from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/ai", tags=["Portfolio Ranking"])

class ApplicantPortfolio(BaseModel):
    freelancer_id: str
    freelancer_name: str
    portfolio_summary: str
    skills: List[str]

class RankRequest(BaseModel):
    job_description: str
    required_skills: List[str]
    applicants: List[ApplicantPortfolio]

@router.post("/rankPortfolio")
async def rank_portfolio(payload: RankRequest):
    ranked_results = []
    
    job_words = set(payload.job_description.lower().split()).union(
        set(s.lower() for s in payload.required_skills)
    )

    for applicant in payload.applicants:
        portfolio_words = set(applicant.portfolio_summary.lower().split()).union(
            set(s.lower() for s in applicant.skills)
        )
        
        intersection = job_words.intersection(portfolio_words)
        union = job_words.union(portfolio_words)
        jaccard_similarity = len(intersection) / len(union) if union else 0.0
        
        match_score = round(65.0 + (jaccard_similarity * 33.0), 2)
        
        ranked_results.append({
            "freelancer_id": applicant.freelancer_id,
            "freelancer_name": applicant.freelancer_name,
            "match_score": match_score,
            "matched_skills": list(intersection),
            "recommendation": "Strong Match" if match_score > 80 else "Potential Match"
        })
    
    ranked_results.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "job_processed": payload.job_description[:50] + "...",
        "total_applicants_evaluated": len(payload.applicants),
        "top_rankings": ranked_results[:5]
    }