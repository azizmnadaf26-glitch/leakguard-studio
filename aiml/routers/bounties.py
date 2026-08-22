from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from algosdk import account, mnemonic, transaction, encoding
from algosdk.v2client import algod
import os
import datetime
import base64

router = APIRouter(prefix="/api/bounties", tags=["Bounties"])

def get_algod_client():
    network = os.getenv("ALGORAND_NETWORK", "testnet")
    if network == "mainnet":
        return algod.AlgodClient("", "https://mainnet-api.algonode.cloud")
    return algod.AlgodClient("", "https://testnet-api.algonode.cloud")

def get_platform_account():
    mn = os.getenv("PLATFORM_MNEMONIC")
    if not mn:
        raise HTTPException(status_code=500, detail="Platform escrow not configured")
    sk = mnemonic.to_private_key(mn)
    addr = account.address_from_private_key(sk)
    return sk, addr

class BountyBuildRequest(BaseModel):
    client_wallet: str
    title: str
    description: str
    prize_algo: float
    deadline_days: int = 7

@router.post("/create/build")
async def build_bounty_creation(payload: BountyBuildRequest):
    client = get_algod_client()
    _, plat_addr = get_platform_account()
    params = client.suggested_params()
    
    amount_micro_algo = int(payload.prize_algo * 1_000_000)
    
    txn = transaction.PaymentTxn(
        sender=payload.client_wallet,
        sp=params,
        receiver=plat_addr,
        amt=amount_micro_algo,
        note=f"LeakGuard Bounty: {payload.title[:50]}".encode()
    )
    
    encoded_txn = encoding.msgpack_encode(txn)
    return {"transaction": encoded_txn}

class BountyConfirmRequest(BaseModel):
    client_wallet: str
    title: str
    description: str
    prize_algo: float
    deadline_days: int = 7
    tx_id: str

@router.post("/create/confirm")
async def confirm_bounty_creation(payload: BountyConfirmRequest, request: Request):
    client = get_algod_client()
    try:
        tx_info = client.pending_transaction_info(payload.tx_id)
        if tx_info.get("confirmed-round", 0) == 0:
            transaction.wait_for_confirmation(client, payload.tx_id, 4)
            tx_info = client.pending_transaction_info(payload.tx_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Transaction validation failed: {e}")
        
    db = request.app.state.db
    deadline = datetime.datetime.now() + datetime.timedelta(days=payload.deadline_days)
    
    async with db.acquire() as conn:
        bounty_id = await conn.fetchval(
            """
            INSERT INTO bounties (client_wallet, title, description, prize_algo, deadline, status, tx_id)
            VALUES ($1, $2, $3, $4, $5, 'open', $6)
            RETURNING id
            """,
            payload.client_wallet, payload.title, payload.description, payload.prize_algo, deadline, payload.tx_id
        )
        return {"success": True, "bounty_id": bounty_id}

@router.get("")
async def get_bounties(request: Request):
    db = request.app.state.db
    async with db.acquire() as conn:
        records = await conn.fetch("SELECT * FROM bounties ORDER BY created_at DESC")
        return [dict(r) for r in records]

class SubmissionRequest(BaseModel):
    creator_wallet: str
    submission_url: str
    note: str

@router.post("/{bounty_id}/submit")
async def submit_entry(bounty_id: int, payload: SubmissionRequest, request: Request):
    db = request.app.state.db
    async with db.acquire() as conn:
        bounty = await conn.fetchrow("SELECT * FROM bounties WHERE id = $1", bounty_id)
        if not bounty:
            raise HTTPException(status_code=404, detail="Bounty not found")
        if bounty['status'] != 'open':
            raise HTTPException(status_code=400, detail="Bounty is no longer open")
            
        # Check if already submitted
        existing = await conn.fetchrow("SELECT id FROM bounty_submissions WHERE bounty_id = $1 AND creator_wallet = $2", bounty_id, payload.creator_wallet)
        if existing:
            raise HTTPException(status_code=400, detail="You have already submitted an entry")
            
        sub_id = await conn.fetchval(
            """
            INSERT INTO bounty_submissions (bounty_id, creator_wallet, submission_url, note)
            VALUES ($1, $2, $3, $4)
            RETURNING id
            """,
            bounty_id, payload.creator_wallet, payload.submission_url, payload.note
        )
        return {"success": True, "submission_id": sub_id}

@router.get("/{bounty_id}/submissions")
async def get_submissions(bounty_id: int, request: Request):
    db = request.app.state.db
    async with db.acquire() as conn:
        records = await conn.fetch("SELECT * FROM bounty_submissions WHERE bounty_id = $1 ORDER BY created_at DESC", bounty_id)
        return [dict(r) for r in records]

class AwardRequest(BaseModel):
    submission_id: int

@router.post("/{bounty_id}/award")
async def award_bounty(bounty_id: int, payload: AwardRequest, request: Request):
    db = request.app.state.db
    async with db.acquire() as conn:
        bounty = await conn.fetchrow("SELECT * FROM bounties WHERE id = $1", bounty_id)
        if not bounty:
            raise HTTPException(status_code=404, detail="Bounty not found")
        if bounty['status'] != 'open':
            raise HTTPException(status_code=400, detail="Bounty is already awarded or closed")
            
        submission = await conn.fetchrow("SELECT * FROM bounty_submissions WHERE id = $1 AND bounty_id = $2", payload.submission_id, bounty_id)
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
            
        # Send prize to winner
        client = get_algod_client()
        plat_sk, plat_addr = get_platform_account()
        params = client.suggested_params()
        
        amount_micro = int(bounty['prize_algo'] * 1_000_000)
        
        txn = transaction.PaymentTxn(
            sender=plat_addr,
            sp=params,
            receiver=submission['creator_wallet'],
            amt=amount_micro,
            note=f"Bounty Award for {bounty['title']}".encode()
        )
        
        stxn = txn.sign(plat_sk)
        try:
            txid = client.send_transaction(stxn)
            transaction.wait_for_confirmation(client, txid, 4)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to send prize: {e}")
            
        # Update DB
        await conn.execute("UPDATE bounties SET status = 'awarded' WHERE id = $1", bounty_id)
        await conn.execute("UPDATE bounty_submissions SET status = 'winner' WHERE id = $1", payload.submission_id)
        
        return {"success": True, "tx_id": txid}
