from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import leak_detection, rank_portfolio

app = FastAPI(
    title="LeakGuard AI Engine",
    description="AI Engine for Portfolio Matching & Leak Detection",
    version="1.0.0"
)

# Enable CORS for React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include separated routers
app.include_router(leak_detection.router)
app.include_router(rank_portfolio.router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "LeakGuard AI Engine",
        "version": "1.0.0"
    }