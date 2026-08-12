from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional

from app.services.ranking_service import ranking_service


router = APIRouter(
    prefix="/api/rankings",
    tags=["Rankings"]
)


@router.get(
    "",
    response_model=List[Dict[str, Any]]
)
def get_rankings(
    keyword: Optional[str] = Query(
        default=None,
        description="Optional keyword to search"
    ),
    domain: Optional[str] = Query(
        default=None,
        description="Optional domain to filter or contextualize"
    )
):
    """
    Get ranking history.
    """
    return ranking_service.get_ranking_history(
        keyword=keyword,
        domain=domain
    )


@router.get(
    "/history",
    response_model=List[Dict[str, Any]]
)
def get_ranking_history(
    keyword: Optional[str] = Query(
        default=None,
        description="Keyword to search in ranking history"
    ),
    domain: Optional[str] = Query(
        default=None,
        description="Domain to contextualize"
    )
):
    """
    Get historical ranking information.
    """
    return ranking_service.get_ranking_history(
        keyword=keyword,
        domain=domain
    )


@router.get(
    "/search",
    response_model=Dict[str, Any]
)
def search_ranking_keyword(
    keyword: str = Query(
        ...,
        min_length=1,
        description="Any keyword to analyze"
    ),
    domain: Optional[str] = Query(
        default=None,
        description="Optional domain"
    )
):
    """
    Accept ANY keyword.
    """
    return ranking_service.search_keyword(
        keyword=keyword,
        domain=domain
    )