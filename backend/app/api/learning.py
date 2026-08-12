from fastapi import APIRouter
from typing import Dict, Any, List
from app.services.learning_service import learning_service

router = APIRouter(prefix="/api/learning", tags=["Learning Center"])

@router.get("", response_model=Dict[str, Any])
def get_learning_summary():
    patterns = learning_service.get_learned_patterns()
    score = learning_service.calculate_memory_score()
    return {
        "memory_score": score,
        "patterns_count": len(patterns),
        "patterns": patterns
    }

@router.get("/patterns", response_model=List[Dict[str, Any]])
def get_learned_patterns():
    return learning_service.get_learned_patterns()
