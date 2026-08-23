from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
import httpx
import os
import json

router = APIRouter(prefix="/api/ai", tags=["Artwork Search"])

class SearchRequest(BaseModel):
    prompt: str

@router.post("/searchArtworks")
async def search_artworks(payload: SearchRequest, request: Request):
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured in .env")

    # 1. Ask Groq to extract style/subject tags
    groq_url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system",
                "content": "You are a style/subject extractor for artwork. Extract 2 to 5 relevant tags from the user's prompt. Return ONLY a valid JSON array of strings, in lowercase. Example: [\"cyberpunk\", \"cityscape\", \"neon\"]"
            },
            {
                "role": "user",
                "content": payload.prompt
            }
        ],
        "temperature": 0.1,
        "max_tokens": 150
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(groq_url, headers=headers, json=data, timeout=10.0)
            response.raise_for_status()
            result = response.json()
            llm_text = result["choices"][0]["message"]["content"].strip()
            
            if llm_text.startswith("```json"):
                llm_text = llm_text[7:-3]
            elif llm_text.startswith("```"):
                llm_text = llm_text[3:-3]
                
            extracted_tags = json.loads(llm_text)
            if not isinstance(extracted_tags, list):
                extracted_tags = [str(extracted_tags)]
    except Exception as e:
        print(f"Groq API Error: {e}")
        extracted_tags = payload.prompt.lower().split()

    search_words = set(extracted_tags)
    
    # 2. Query PostgreSQL and calculate Jaccard similarity
    db = request.app.state.db
    ranked_artworks = []
    
    async with db.acquire() as conn:
        records = await conn.fetch('SELECT asset_hash, wallet_address, title, category, tags, asa_id, image_base64 FROM fingerprints')
        for r in records:
            # Combine title, category, and tags into one searchable word set
            artwork_words = set()
            if r['title']:
                artwork_words.update(r['title'].lower().split())
            if r['category']:
                artwork_words.update(r['category'].lower().split())
            if r['tags']:
                artwork_words.update([str(t).lower() for t in r['tags']])
            
            intersection = search_words.intersection(artwork_words)
            union = search_words.union(artwork_words)
            jaccard_similarity = len(intersection) / len(union) if union else 0.0
            
            if jaccard_similarity > 0 or len(search_words) == 0:
                match_score = round(30.0 + (jaccard_similarity * 70.0), 2)
                
                # We use the real uploaded image if it exists, otherwise a deterministic placeholder
                seed = r['asset_hash'][:10] if r['asset_hash'] else "default"
                real_image = r.get('image_base64')
                image_url = real_image if real_image else f"https://picsum.photos/seed/{seed}/400/300"
                
                ranked_artworks.append({
                    "asset_hash": r['asset_hash'],
                    "wallet_address": r['wallet_address'],
                    "title": r['title'] or "Untitled",
                    "category": r['category'] or "Uncategorized",
                    "asa_id": r['asa_id'],
                    "image": image_url,
                    "match_score": match_score,
                    "matched_tags": list(intersection) if intersection else []
                })
    
    ranked_artworks.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "extracted_tags": list(search_words),
        "results": ranked_artworks
    }
