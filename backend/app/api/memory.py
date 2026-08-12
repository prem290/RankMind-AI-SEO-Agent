from fastapi import APIRouter
from typing import Dict, Any, List
from app.schemas.schemas import MemorySearchQuery, MemorySearchResponse
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/memory", tags=["Hindsight Memory Explorer"])

@router.get("", response_model=Dict[str, Any])
def get_memory_info():
    health = hindsight_service.is_healthy()
    all_memories = hindsight_service.get_all_memories()
    return {
        "hindsight_health": health,
        "total_memories_stored": len(all_memories),
        "bank_name": hindsight_service.bank_name,
        "memories": all_memories[:20]
    }

@router.post("/search", response_model=MemorySearchResponse)
def search_memory(payload: MemorySearchQuery):
    results = hindsight_service.recall(query=payload.query, limit=10, bank_id=payload.bank_id)
    return MemorySearchResponse(
        query=payload.query,
        total_memories_found=len(results),
        memories=results
    )
