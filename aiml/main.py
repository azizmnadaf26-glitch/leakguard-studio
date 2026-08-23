from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import leak_detection, rank_portfolio, ownership, search_artworks, marketplace, bounties, escrow
import os
from dotenv import load_dotenv
from x402 import x402ResourceServer, FacilitatorConfig
from x402.http import HTTPFacilitatorClient
from x402.http.middleware.fastapi import payment_middleware
from x402.mechanisms.avm.exact.register import register_exact_avm_server
from starlette.middleware.base import BaseHTTPMiddleware

from contextlib import asynccontextmanager
import asyncpg

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create connection pool
    app.state.db = await asyncpg.create_pool(DATABASE_URL)
    
    # Create fingerprints table if it doesn't exist
    async with app.state.db.acquire() as conn:
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS fingerprints (
                id SERIAL PRIMARY KEY,
                asset_hash TEXT UNIQUE NOT NULL,
                wallet_address TEXT NOT NULL,
                title TEXT,
                category TEXT,
                embedding FLOAT8[],
                asa_id BIGINT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Add image_base64 column to persist artwork images
        try:
            await conn.execute('ALTER TABLE fingerprints ADD COLUMN image_base64 TEXT')
        except asyncpg.exceptions.DuplicateColumnError:
            pass
        
        # Seamlessly upgrade existing table if it was created previously
        await conn.execute('''
            ALTER TABLE fingerprints 
            ADD COLUMN IF NOT EXISTS embedding FLOAT8[],
            ADD COLUMN IF NOT EXISTS title TEXT,
            ADD COLUMN IF NOT EXISTS category TEXT,
            ADD COLUMN IF NOT EXISTS tags TEXT[],
            ADD COLUMN IF NOT EXISTS asa_id BIGINT;
        ''')
        
        # Backfill tags based on title and category if tags are empty
        records = await conn.fetch("SELECT id, title, category FROM fingerprints WHERE tags IS NULL OR array_length(tags, 1) IS NULL")
        for r in records:
            title_words = [w.strip().lower() for w in (r['title'] or "").split() if w.strip()]
            category_words = [w.strip().lower() for w in (r['category'] or "").split() if w.strip()]
            combined_tags = list(set(title_words + category_words))
            await conn.execute("UPDATE fingerprints SET tags = $1 WHERE id = $2", combined_tags, r['id'])
        
        # Create ownership history table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS ownership_history (
                id SERIAL PRIMARY KEY,
                asset_hash TEXT NOT NULL,
                from_wallet TEXT NOT NULL,
                to_wallet TEXT NOT NULL,
                tx_id TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create marketplace listings table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS marketplace_listings (
                id SERIAL PRIMARY KEY,
                asset_hash TEXT UNIQUE NOT NULL,
                asa_id BIGINT NOT NULL,
                seller_wallet TEXT NOT NULL,
                title TEXT,
                category TEXT,
                price_algo FLOAT NOT NULL,
                status TEXT DEFAULT 'listed',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create sales table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS sales (
                id SERIAL PRIMARY KEY,
                asa_id BIGINT NOT NULL,
                buyer_wallet TEXT NOT NULL,
                seller_wallet TEXT NOT NULL,
                price_algo FLOAT NOT NULL,
                tx_id TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create bounties table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS bounties (
                id SERIAL PRIMARY KEY,
                client_wallet TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                prize_algo FLOAT NOT NULL,
                deadline TIMESTAMP WITH TIME ZONE,
                status TEXT DEFAULT 'open',
                tx_id TEXT UNIQUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create bounty submissions table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS bounty_submissions (
                id SERIAL PRIMARY KEY,
                bounty_id INTEGER REFERENCES bounties(id),
                creator_wallet TEXT NOT NULL,
                submission_url TEXT,
                note TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create creator profiles table for search matching
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS creator_profiles (
                id SERIAL PRIMARY KEY,
                freelancer_id TEXT UNIQUE NOT NULL,
                freelancer_name TEXT NOT NULL,
                skills TEXT[] NOT NULL,
                portfolio_summary TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Seed mock creator profiles if empty
        count = await conn.fetchval('SELECT COUNT(*) FROM creator_profiles')
        if count == 0:
            mock_creators = [
                ("FR-001", "Akira M.", ["anime", "manga", "2d illustration", "character design"], "Specializes in high-quality anime character design and manga illustrations."),
                ("FR-002", "Sarah J.", ["ui/ux", "web design", "figma", "frontend"], "Modern clean UI/UX designer for web3 and tech platforms."),
                ("FR-003", "David K.", ["3d modeling", "blender", "animation", "game assets"], "Creates game-ready 3D assets and animations."),
                ("FR-004", "Elena R.", ["concept art", "fantasy", "environment design"], "Fantasy environment and concept artist for RPGs."),
                ("FR-005", "Ken T.", ["thumbnail", "youtube", "photoshop", "clickbait"], "High CTR YouTube thumbnails and social media graphics.")
            ]
            await conn.executemany('''
                INSERT INTO creator_profiles (freelancer_id, freelancer_name, skills, portfolio_summary)
                VALUES ($1, $2, $3, $4)
            ''', mock_creators)
    yield
    # Shutdown: close pool
    await app.state.db.close()

app = FastAPI(
    title="LeakGuard AI Engine",
    description="AI Engine for Portfolio Matching & Leak Detection",
    version="1.0.0",
    lifespan=lifespan
)

# Include separated routers
app.include_router(leak_detection.router)
app.include_router(rank_portfolio.router)
app.include_router(ownership.router)
app.include_router(search_artworks.router)
app.include_router(marketplace.router)
app.include_router(bounties.router)
app.include_router(escrow.router)

# x402 Configuration
ALGORAND_NETWORK = os.getenv("ALGORAND_NETWORK", "testnet")
AVM_ADDRESS = os.getenv("AVM_ADDRESS", "")
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.goplausible.xyz")

facilitator = HTTPFacilitatorClient(FacilitatorConfig(url=FACILITATOR_URL))
server = x402ResourceServer(facilitator)
register_exact_avm_server(server)

if ALGORAND_NETWORK == "testnet":
    caip2_network = "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
elif ALGORAND_NETWORK == "mainnet":
    caip2_network = "algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8="
else:
    caip2_network = ALGORAND_NETWORK

protected_routes = {
    "POST /api/ai/leakDetection": {
        "accepts": {
            "scheme": "exact",
            "payTo": AVM_ADDRESS,
            "price": "0.02",
            "network": caip2_network,
        }
    },
    "POST /api/ai/rankPortfolio": {
        "accepts": {
            "scheme": "exact",
            "payTo": AVM_ADDRESS,
            "price": "0.03",
            "network": caip2_network,
        }
    },
    "POST /api/ai/searchArtworks": {
        "accepts": {
            "scheme": "exact",
            "payTo": AVM_ADDRESS,
            "price": "0.01",
            "network": caip2_network,
        }
    }
}

async def x402_middleware(request, call_next):
    # Log incoming x-payment
    with open("x_payment.log", "w") as f:
        f.write(f"Incoming payment-signature: {request.headers.get('payment-signature')}\n")
        
    response = await payment_middleware(protected_routes, server)(request, call_next)
    
    # Debug logging
    try:
        body_bytes = b""
        if hasattr(response, "body"):
            body_bytes = response.body
        elif hasattr(response, "body_iterator"):
            async for chunk in response.body_iterator:
                body_bytes += chunk
            
        with open("error.log", "w") as f:
            f.write(f"Status: {response.status_code}\n")
            f.write(f"Headers: {dict(response.headers)}\n")
            f.write(f"Body: {body_bytes.decode('utf-8', errors='ignore')}\n")
            
        from fastapi import Response
        return Response(content=body_bytes, status_code=response.status_code, headers=response.headers, media_type=response.media_type)
    except Exception as e:
        with open("error.log", "w") as f:
            f.write(f"Exception: {e}")
        return response

# 1. Add x402 middleware first (so it runs inner-most relative to CORS)
app.add_middleware(BaseHTTPMiddleware, dispatch=x402_middleware)

# 2. Add CORSMiddleware last (so it runs outer-most and wraps the 402 with CORS headers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["payment-required", "x-payment-required"],
)

# Trigger reload
@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "LeakGuard AI Engine",
        "version": "1.0.0"
    }







