from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from app.services.competitor_service import competitor_service

router = APIRouter(prefix="/api/competitors", tags=["Competitors"])

@router.get("", response_model=List[Dict[str, Any]])
def get_competitors(domain: Optional[str] = Query("talentflow-ai.example")):
    return competitor_service.get_competitors(domain=domain)

@router.post("/analyze", response_model=Dict[str, Any])
def analyze_competitor(domain: str):
    return competitor_service.analyze_competitor_memory(domain)

