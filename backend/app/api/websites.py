from fastapi import APIRouter, Depends
from typing import List, Dict, Any

router = APIRouter(prefix="/api/websites", tags=["Websites"])

@router.get("", response_model=List[Dict[str, Any]])
def get_websites():
    return [
        {
            "id": "web-001",
            "name": "TalentFlow AI",
            "domain": "talentflow-ai.example",
            "created_at": "2026-01-01T00:00:00Z"
        }
    ]

@router.post("", response_model=Dict[str, Any])
def create_website(name: str, domain: str):
    return {
        "id": "web-002",
        "name": name,
        "domain": domain,
        "created_at": "2026-08-12T12:00:00Z"
    }
