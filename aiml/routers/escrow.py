from fastapi import APIRouter, Request, Query
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api/escrow", tags=["Escrow"])

@router.get("/history")
async def get_escrow_history(request: Request, wallet: str = Query(...)):
    db = request.app.state.db
    history = []
    
    async with db.acquire() as conn:
        # 1. Fetch Marketplace Sales
        sales = await conn.fetch(
            "SELECT * FROM sales WHERE buyer_wallet = $1 OR seller_wallet = $1", 
            wallet
        )
        for s in sales:
            role = "Buyer" if s["buyer_wallet"] == wallet else "Seller"
            history.append({
                "id": f"SALE-{s['id']}",
                "type": "Marketplace Sale",
                "role": role,
                "title": f"ASA #{s['asa_id']}",
                "amount_algo": s["price_algo"],
                "status": "Released",  # Sales are instant release in this app
                "tx_id": s["tx_id"],
                "created_at": s["created_at"].isoformat()
            })
            
        # 2. Fetch Bounties Posted by this wallet
        posted_bounties = await conn.fetch(
            "SELECT * FROM bounties WHERE client_wallet = $1", 
            wallet
        )
        for b in posted_bounties:
            history.append({
                "id": f"BOUNTY-{b['id']}",
                "type": "Bounty Challenge",
                "role": "Client",
                "title": b["title"],
                "amount_algo": b["prize_algo"],
                "status": "Funded" if b["status"] == "open" else "Released",
                "tx_id": b["tx_id"],
                "created_at": b["created_at"].isoformat()
            })
            
        # 3. Fetch Bounties Won by this wallet (where they submitted and status=winner)
        # We only show it in escrow history if they won (Released) or maybe if they submitted we don't show escrow since they haven't funded anything. 
        # But let's show bounties they WON.
        won_bounties = await conn.fetch(
            """
            SELECT b.*, s.id as sub_id
            FROM bounties b
            JOIN bounty_submissions s ON b.id = s.bounty_id
            WHERE s.creator_wallet = $1 AND s.status = 'winner'
            """, 
            wallet
        )
        for b in won_bounties:
            history.append({
                "id": f"WIN-{b['id']}",
                "type": "Bounty Challenge",
                "role": "Creator (Winner)",
                "title": b["title"],
                "amount_algo": b["prize_algo"],
                "status": "Released",
                # Ideally we'd store the payout tx_id, but for now we link to the original funding tx_id 
                "tx_id": b["tx_id"],
                "created_at": b["created_at"].isoformat()
            })

    # Sort history descending by date
    history.sort(key=lambda x: x["created_at"], reverse=True)
    return history
