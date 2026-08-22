from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
import httpx
import os
import json

router = APIRouter(prefix="/api/ai", tags=["Creator Search"])

class SearchRequest(BaseModel):
    prompt: str

@router.post("/searchCreators")
async def search_creators(payload: SearchRequest, request: Request):
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured in .env")

    # 1. Ask Groq to extract tags
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
                "content": "You are a skill extractor. Extract 2 to 5 relevant technical/artistic skills from the user's prompt. Return ONLY a valid JSON array of strings, in lowercase. Example: [\"anime\", \"ui design\"]"
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
            
            # Clean up potential markdown blocks if the LLM adds them
            if llm_text.startswith("```json"):
                llm_text = llm_text[7:-3]
            elif llm_text.startswith("```"):
                llm_text = llm_text[3:-3]
                
            extracted_tags = json.loads(llm_text)
            if not isinstance(extracted_tags, list):
                extracted_tags = [str(extracted_tags)]
    except Exception as e:
        print(f"Groq API Error: {e}")
        # Fallback to simple splitting if LLM fails
        extracted_tags = payload.prompt.lower().split()

    search_words = set(extracted_tags)
    
    # 2. Query PostgreSQL and calculate Jaccard similarity
    db = request.app.state.db
    ranked_creators = []
    
    async with db.acquire() as conn:
        records = await conn.fetch('SELECT freelancer_id, freelancer_name, skills, portfolio_summary FROM creator_profiles')
        for r in records:
            creator_words = set(s.lower() for s in r['skills']).union(
                set(r['portfolio_summary'].lower().split())
            )
            
            intersection = search_words.intersection(creator_words)
            union = search_words.union(creator_words)
            jaccard_similarity = len(intersection) / len(union) if union else 0.0
            
            # If there's any match or if we want to return all ranked
            if jaccard_similarity > 0 or len(search_words) == 0:
                match_score = round(30.0 + (jaccard_similarity * 70.0), 2)
                ranked_creators.append({
                    "freelancer_id": r['freelancer_id'],
                    "freelancer_name": r['freelancer_name'],
                    "match_score": match_score,
                    "matched_skills": list(intersection) if intersection else [],
                    "skills": r['skills'],
                    "summary": r['portfolio_summary']
                })
    
    # Sort by match_score descending
    ranked_creators.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "extracted_tags": list(search_words),
        "results": ranked_creators[:5]
    }
