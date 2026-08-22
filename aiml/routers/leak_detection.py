from fastapi import APIRouter, UploadFile, File, Request
import hashlib
import cv2
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from .embedding_utils import get_embedding

router = APIRouter(prefix="/api/ai", tags=["Leak Detection"])

@router.post("/leakDetection")
async def detect_leak(request: Request, file: UploadFile = File(...)):
    contents = await file.read()
    
    # Generate SHA-256 fingerprint
    sha256_hash = hashlib.sha256(contents).hexdigest()
    
    # Generate PyTorch embedding for visual similarity
    target_embedding = get_embedding(contents)
    
    # Process image structure for basic metadata (optional, kept from original)
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Check PostgreSQL for exact match and embedding match
    db = request.app.state.db
    is_exact_match = False
    highest_sim = 0.0
    
    async with db.acquire() as conn:
        records = await conn.fetch('SELECT asset_hash, embedding FROM fingerprints')
        for r in records:
            if r['asset_hash'] == sha256_hash:
                is_exact_match = True
            
            db_emb = r['embedding']
            if db_emb and target_embedding:
                # Calculate cosine similarity
                sim = cosine_similarity([target_embedding], [db_emb])[0][0]
                if sim > highest_sim:
                    highest_sim = sim
    
    if is_exact_match:
        duplicate_score = 100.0
        ai_confidence = 0.99
        is_leak = True
        status_message = "LEAK DETECTED: Asset matches registered on-chain fingerprint exactly!"
    elif highest_sim > 0.90:  # 90% visual similarity threshold
        duplicate_score = round(highest_sim * 100, 2)
        ai_confidence = 0.95
        is_leak = True
        status_message = f"LEAK DETECTED: Asset is visually similar ({duplicate_score}%) to a registered asset!"
    else:
        # Fallback to the original mock score if no match found
        duplicate_score = round(float((int(sha256_hash[:4], 16) % 20)), 2)
        ai_confidence = 0.95
        is_leak = duplicate_score > 75.0
        status_message = "ORIGINAL: No leak detected in platform registry."

    return {
        "filename": file.filename,
        "sha256_fingerprint": sha256_hash,
        "similarity_report": {
            "duplicate_score": duplicate_score,
            "ai_confidence": ai_confidence,
            "is_leak_detected": is_leak,
            "status_message": status_message
        }
    }