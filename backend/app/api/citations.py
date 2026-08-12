from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.citation_service import citation_service

router = APIRouter(prefix="/api/citations", tags=["Citations"])

@router.get("", response_model=List[Dict[str, Any]])
def get_citations():
    return citation_service.get_citations()

@router.get("/visibility", response_model=Dict[str, Any])
def get_ai_citation_visibility():
    return citation_service.get_ai_citation_visibility()

@router.post("/analyze", response_model=Dict[str, Any])
def analyze_citations():
    return citation_service.get_ai_citation_visibility()
