from fastapi import APIRouter, Query
from typing import Dict, Any
from app.services.llm_service import llm_service

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("", response_model=Dict[str, Any])
def get_recommendations(
    keyword: str = Query("AI resume analyzer"),
    current_position: int = Query(8),
    previous_position: int = Query(13),
    target_url: str = Query("https://talentflow-ai.example/ai-resume-analyzer"),
    competitor_pos: int = Query(4),
    use_hindsight_memory: bool = Query(True)
):
    return llm_service.generate_recommendation_with_memory(
        keyword=keyword,
        current_position=current_position,
        previous_position=previous_position,
        target_url=target_url,
        competitor_pos=competitor_pos,
        use_memory=use_hindsight_memory
    )

@router.post("", response_model=Dict[str, Any])
def generate_recommendations(
    keyword: str = "AI resume analyzer",
    current_position: int = 8,
    previous_position: int = 13,
    target_url: str = "https://talentflow-ai.example/ai-resume-analyzer",
    competitor_pos: int = 4,
    use_hindsight_memory: bool = True
):
    return llm_service.generate_recommendation_with_memory(
        keyword=keyword,
        current_position=current_position,
        previous_position=previous_position,
        target_url=target_url,
        competitor_pos=competitor_pos,
        use_memory=use_hindsight_memory
    )
