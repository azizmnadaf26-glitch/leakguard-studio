from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from algosdk import account, mnemonic, transaction, encoding
from algosdk.v2client import algod
import os
import json
import base64

router = APIRouter(prefix="/api/marketplace", tags=["Marketplace"])

def get_algod_client():
    network = os.getenv("ALGORAND_NETWORK", "testnet")
    if network == "mainnet":
        return algod.AlgodClient("", "https://mainnet-api.algonode.cloud")
    return algod.AlgodClient("", "https://testnet-api.algonode.cloud")

def get_platform_account():
    mn = os.getenv("PLATFORM_MNEMONIC")
    if not mn:
        raise HTTPException(status_code=500, detail="PLATFORM_MNEMONIC not set")
    sk = mnemonic.to_private_key(mn)
    addr = account.address_from_private_key(sk)
    return sk, addr

class ListBuildRequest(BaseModel):
    asset_hash: str
    asa_id: int
    seller_wallet: str
    price_algo: float

class ListConfirmRequest(BaseModel):
    asset_hash: str
    asa_id: int
    seller_wallet: str
    price_algo: float
    tx_id: str

@router.post("/list/build")
async def build_listing(payload: ListBuildRequest, request: Request):
    client = get_algod_client()
    plat_sk, plat_addr = get_platform_account()
    params = client.suggested_params()
    
    # Check if Platform ALREADY holds the ASA (because it was minted by the platform and never claimed)
    platform_holds = False
    try:
        asset_info = client.account_asset_info(plat_addr, payload.asa_id)
        if asset_info['asset-holding']['amount'] > 0:
            platform_holds = True
    except Exception:
        pass

    if platform_holds:
        # Platform already holds it! Just make the user sign a 0 ALGO intent transaction
        note_str = f"List ASA {payload.asa_id} for {payload.price_algo} ALGO"
        txn = transaction.PaymentTxn(
            sender=payload.seller_wallet,
            sp=params,
            receiver=payload.seller_wallet,
            amt=0,
            note=note_str.encode()
        )
    else:
        # Platform must opt-in to the ASA first if it hasn't already!
        try:
            account_info = client.account_info(plat_addr)
            opted_in = False
            if "assets" in account_info:
                for asset in account_info["assets"]:
                    if asset["asset-id"] == payload.asa_id:
                        opted_in = True
                        break
                        
            if not opted_in:
                optin_txn = transaction.AssetTransferTxn(
                    sender=plat_addr,
                    sp=params,
                    receiver=plat_addr,
                    amt=0,
                    index=payload.asa_id
                )
                signed_optin = optin_txn.sign(plat_sk)
                txid = client.send_transaction(signed_optin)
                transaction.wait_for_confirmation(client, txid, 4)
        except Exception as e:
            print(f"Failed to opt-in platform wallet: {e}")
            raise HTTPException(status_code=500, detail=f"Platform opt-in failed: {e}")

        # Build transfer from Seller to Platform Escrow
        txn = transaction.AssetTransferTxn(
            sender=payload.seller_wallet,
            sp=params,
            receiver=plat_addr,
            amt=1,
            index=payload.asa_id
        )
    
    encoded_txn = encoding.msgpack_encode(txn)
    return {"transaction": encoded_txn}

@router.post("/list/confirm")
async def confirm_listing(payload: ListConfirmRequest, request: Request):
    client = get_algod_client()
    try:
        tx_info = client.pending_transaction_info(payload.tx_id)
        if tx_info.get("confirmed-round", 0) == 0:
            transaction.wait_for_confirmation(client, payload.tx_id, 4)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Transaction failed: {str(e)}")

    db = request.app.state.db
    async with db.acquire() as conn:
        # Get metadata from fingerprints
        row = await conn.fetchrow("SELECT title, category FROM fingerprints WHERE asset_hash = $1", payload.asset_hash)
        if not row:
            raise HTTPException(status_code=404, detail="Asset not found in registry")
            
        await conn.execute('''
            INSERT INTO marketplace_listings (asset_hash, asa_id, seller_wallet, title, category, price_algo, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'listed')
            ON CONFLICT (asset_hash) DO UPDATE SET status = 'listed', price_algo = $6
        ''', payload.asset_hash, payload.asa_id, payload.seller_wallet, row['title'], row['category'], payload.price_algo)
        
    return {"status": "listed"}

@router.get("/listings")
async def get_listings(request: Request):
    db = request.app.state.db
    async with db.acquire() as conn:
        records = await conn.fetch("SELECT asset_hash, asa_id, seller_wallet, title, category, price_algo FROM marketplace_listings WHERE status = 'listed'")
        
        # Add deterministic mock images for frontend rendering
        results = []
        for r in records:
            d = dict(r)
            seed = d['asset_hash'][:10]
            d['image'] = f"https://picsum.photos/seed/{seed}/400/300"
            results.append(d)
            
        return results

class BuyBuildRequest(BaseModel):
    asa_id: int
    buyer_wallet: str

class BuyConfirmRequest(BaseModel):
    asa_id: int
    buyer_wallet: str
    tx_id: str

@router.post("/buy/build")
async def build_buy(payload: BuyBuildRequest, request: Request):
    db = request.app.state.db
    async with db.acquire() as conn:
        listing = await conn.fetchrow("SELECT price_algo FROM marketplace_listings WHERE asa_id = $1 AND status = 'listed'", payload.asa_id)
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found or already sold")
            
    client = get_algod_client()
    plat_sk, plat_addr = get_platform_account()
    params = client.suggested_params()
    
    # Buyer pays ALGO to Platform Escrow
    amount_micro_algo = int(listing['price_algo'] * 1_000_000)
    txn = transaction.PaymentTxn(
        sender=payload.buyer_wallet,
        sp=params,
        receiver=plat_addr,
        amt=amount_micro_algo
    )
    
    encoded_txn = encoding.msgpack_encode(txn)
    return {"transaction": encoded_txn}

@router.post("/buy/confirm")
async def confirm_buy(payload: BuyConfirmRequest, request: Request):
    client = get_algod_client()
    try:
        tx_info = client.pending_transaction_info(payload.tx_id)
        if tx_info.get("confirmed-round", 0) == 0:
            transaction.wait_for_confirmation(client, payload.tx_id, 4)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Transaction failed: {str(e)}")

    db = request.app.state.db
    plat_sk, plat_addr = get_platform_account()
    
    async with db.acquire() as conn:
        listing = await conn.fetchrow("SELECT seller_wallet, price_algo FROM marketplace_listings WHERE asa_id = $1 AND status = 'listed'", payload.asa_id)
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
            
        # 1. Send ASA to buyer
        params = client.suggested_params()
        asa_txn = transaction.AssetTransferTxn(
            sender=plat_addr,
            sp=params,
            receiver=payload.buyer_wallet,
            amt=1,
            index=payload.asa_id
        )
        signed_asa_txn = asa_txn.sign(plat_sk)
        client.send_transaction(signed_asa_txn)
        
        # 2. Release ALGO to seller (minus tiny txn fee optionally, but we'll send full for prototype)
        amount_micro_algo = int(listing['price_algo'] * 1_000_000)
        algo_txn = transaction.PaymentTxn(
            sender=plat_addr,
            sp=client.suggested_params(),
            receiver=listing['seller_wallet'],
            amt=amount_micro_algo - 2000 # keep 0.002 algo for fees
        )
        signed_algo_txn = algo_txn.sign(plat_sk)
        client.send_transaction(signed_algo_txn)
        
        # 3. Update DB
        await conn.execute("UPDATE marketplace_listings SET status = 'sold' WHERE asa_id = $1", payload.asa_id)
        await conn.execute('''
            INSERT INTO sales (asa_id, buyer_wallet, seller_wallet, price_algo, tx_id)
            VALUES ($1, $2, $3, $4, $5)
        ''', payload.asa_id, payload.buyer_wallet, listing['seller_wallet'], listing['price_algo'], payload.tx_id)
        
    return {"status": "success"}
