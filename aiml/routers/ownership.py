from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException, status
import hashlib
import base64
from io import BytesIO
from PIL import Image
import asyncpg
import numpy as np
import os
import asyncio
from sklearn.metrics.pairwise import cosine_similarity
from .embedding_utils import get_embedding

from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import AssetConfigTxn

router = APIRouter(prefix="/api/ownership", tags=["Ownership"])

# Setup generic Algonode TestNet client
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""
algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

@router.post("/register")
async def register_asset(
    request: Request,
    wallet_address: str = Form(...),
    title: str = Form(""),
    category: str = Form(""),
    file: UploadFile = File(...)
):
    contents = await file.read()
    
    # Generate SHA-256 fingerprint
    sha256_hash = hashlib.sha256(contents).hexdigest()
    
    # Generate ResNet18 Embedding
    embedding = get_embedding(contents)
    if embedding is None:
        raise HTTPException(status_code=400, detail="Failed to generate image embedding.")
    
    db = request.app.state.db
    async with db.acquire() as conn:
        # First, fetch existing embeddings to check for similarity leaks
        records = await conn.fetch("SELECT wallet_address, created_at, embedding FROM fingerprints WHERE embedding IS NOT NULL")
        
        target_emb = np.array(embedding).reshape(1, -1)
        for row in records:
            db_emb = np.array(row['embedding']).reshape(1, -1)
            sim = cosine_similarity(target_emb, db_emb)[0][0]
            if sim >= 0.90:
                # 409 Conflict: someone already owns this or something highly similar
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={
                        "error": "Asset Already Registered",
                        "similarity": round(float(sim), 4),
                        "original_owner": row['wallet_address'],
                        "registered_at": str(row['created_at'])
                    }
                )
        
        # Mint ASA if platform mnemonic is provided
        asa_id = None
        PLATFORM_MNEMONIC = os.getenv("PLATFORM_MNEMONIC")
        if PLATFORM_MNEMONIC:
            try:
                private_key = mnemonic.to_private_key(PLATFORM_MNEMONIC)
                sender = account.address_from_private_key(private_key)
                sp = algod_client.suggested_params()
                
                txn = AssetConfigTxn(
                    sender=sender,
                    sp=sp,
                    total=1,
                    default_frozen=False,
                    unit_name="LGART",
                    asset_name=f"LG-{sha256_hash[:8]}",
                    manager=sender, # Platform manages it, but you could set to wallet_address
                    reserve=wallet_address,
                    freeze=wallet_address,
                    clawback=wallet_address,
                    url=f"https://leakguard.studio/asset/{sha256_hash}",
                    decimals=0
                )
                stxn = txn.sign(private_key)
                txid = algod_client.send_transaction(stxn)
                
                # Async wait for confirmation
                result = algod_client.pending_transaction_info(txid)
                loops = 0
                while result.get("confirmed-round", 0) == 0 and loops < 10:
                    await asyncio.sleep(1)
                    result = algod_client.pending_transaction_info(txid)
                    loops += 1
                
                asa_id = result.get("asset-index")
            except Exception as e:
                print(f"ASA Minting failed: {e}")

        # Create a compressed base64 thumbnail to save in DB for the feed
        try:
            img = Image.open(BytesIO(contents)).convert("RGB")
            img.thumbnail((400, 400)) # Resize to max 400x400
            buffered = BytesIO()
            img.save(buffered, format="JPEG", quality=75)
            img_b64 = "data:image/jpeg;base64," + base64.b64encode(buffered.getvalue()).decode("utf-8")
        except Exception:
            img_b64 = None

        # If no match found, save to PostgreSQL
        try:
            await conn.execute(
                '''
                INSERT INTO fingerprints (asset_hash, wallet_address, title, category, embedding, asa_id, image_base64) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (asset_hash) DO UPDATE SET image_base64 = EXCLUDED.image_base64
                ''',
                sha256_hash, wallet_address, title, category, embedding, asa_id, img_b64
            )
        except asyncpg.PostgresError as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            
    return {
        "status": "success",
        "message": "Asset successfully registered",
        "asset_hash": sha256_hash,
        "wallet_address": wallet_address,
        "title": title,
        "asa_id": asa_id
    }

@router.get("/verify/{asset_hash}")
async def verify_asset(request: Request, asset_hash: str):
    db = request.app.state.db
    async with db.acquire() as conn:
        record = await conn.fetchrow(
            "SELECT asset_hash, wallet_address, asa_id, created_at, title, category FROM fingerprints WHERE asset_hash = $1",
            asset_hash
        )
        
        if not record:
            raise HTTPException(status_code=404, detail="Asset not found or unregistered.")
            
        return dict(record)

from pydantic import BaseModel
import base64
from algosdk import encoding
from algosdk.transaction import AssetTransferTxn

class TransferBuildRequest(BaseModel):
    asset_id: int
    asset_hash: str
    from_wallet: str
    to_wallet: str

class TransferConfirmRequest(BaseModel):
    asset_hash: str
    from_wallet: str
    to_wallet: str
    tx_id: str

@router.post("/transfer/build")
async def build_transfer(req: TransferBuildRequest):
    sp = algod_client.suggested_params()
    try:
        txn = AssetTransferTxn(
            sender=req.from_wallet,
            sp=sp,
            receiver=req.to_wallet,
            amt=1,
            index=req.asset_id
        )
        unsigned_b64 = base64.b64encode(encoding.msgpack_encode(txn)).decode("utf-8")
        return {"unsigned_txn_b64": unsigned_b64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transfer/confirm")
async def confirm_transfer(request: Request, req: TransferConfirmRequest):
    db = request.app.state.db
    async with db.acquire() as conn:
        try:
            # Update current owner
            await conn.execute(
                "UPDATE fingerprints SET wallet_address = $1 WHERE asset_hash = $2",
                req.to_wallet, req.asset_hash
            )
            # Insert history
            await conn.execute(
                '''
                INSERT INTO ownership_history (asset_hash, from_wallet, to_wallet, tx_id)
                VALUES ($1, $2, $3, $4)
                ''',
                req.asset_hash, req.from_wallet, req.to_wallet, req.tx_id
            )
        except asyncpg.PostgresError as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            
    return {"status": "success", "message": "Ownership transferred"}

@router.get("/my-assets")
async def get_my_assets(wallet: str, request: Request):
    db = request.app.state.db
    async with db.acquire() as conn:
        # Simplistic approach: get fingerprints where this wallet was the original creator, 
        # or it was transferred to them recently. Since we didn't track current owner perfectly 
        # outside of ownership_history, we will check ownership_history for latest owner.
        
        # Actually, let's just do a naive check: fingerprints where wallet_address = wallet 
        # OR they are the most recent to_wallet in ownership_history.
        records = await conn.fetch('''
            SELECT f.asset_hash, f.asa_id, f.title, f.category
            FROM fingerprints f
            WHERE f.wallet_address = $1 AND f.asa_id IS NOT NULL
        ''', wallet)
        
        return [dict(r) for r in records]

@router.get("/feed")
async def get_feed(request: Request):
    db = request.app.state.db
    async with db.acquire() as conn:
        records = await conn.fetch('''
            SELECT asset_hash, wallet_address, title, category, created_at, asa_id, image_base64 
            FROM fingerprints 
            ORDER BY created_at DESC 
            LIMIT 50
        ''')
        
        posts = []
        for r in records:
            # Map wallet addresses to profile names for the demo
            wallet = r['wallet_address']
            if wallet == "T4QAY62C7BPPI6GZB6QWOGO7P73FKGZSCW7GQTOQ5CE6KX3GH6G4CQDNEI":
                artist_name = "Sania Nadaf"
            else:
                artist_name = f"Creator {wallet[-4:]}"
                
            # Format the data to match the mock posts structure the frontend expects
            posts.append({
                "id": r['asset_hash'],
                "artist": artist_name,
                "full_address": wallet,
                "title": r['title'] if r['title'] else f"Artwork {r['asset_hash'][:6]}",
                "category": r['category'],
                "image": r['image_base64'] if r.get('image_base64') else f"https://picsum.photos/seed/{r['asset_hash']}/600/400", 
                "likes": hash(r['asset_hash']) % 1000,
                "comments": [],
                "created_at": r['created_at'].isoformat() if r['created_at'] else None
            })
            
        return posts
