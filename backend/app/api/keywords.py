from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional

from app.services.seo_service import seo_service


router = APIRouter(
    prefix="/api/keywords",
    tags=["Keywords"]
)


@router.get(
    "",
    response_model=List[Dict[str, Any]]
)
def get_keywords(
    domain: Optional[str] = Query(
        "talentflow-ai.example"
    ),
    keyword: Optional[str] = Query(None)
):
    """
    Get keyword intelligence.

    If a keyword is supplied, generate SEO
    intelligence specifically for that keyword.

    If no keyword is supplied, automatically
    generate keywords from the website.
    """

    return seo_service.generate_keywords_for_domain(
        domain=domain,
        keyword=keyword
    )


@router.get(
    "/{keyword_id}",
    response_model=Dict[str, Any]
)
def get_keyword(
    keyword_id: str,
    domain: Optional[str] = Query(
        "talentflow-ai.example"
    )
):
    """
    Get a single keyword by ID or keyword name.
    """

    keywords = seo_service.generate_keywords_for_domain(
        domain=domain
    )

    item = next(
        (
            keyword
            for keyword in keywords
            if (
                keyword["id"] == keyword_id
                or
                keyword["keyword"].lower()
                == keyword_id.lower()
            )
        ),
        None
    )

    if item is None:
        return {
            "id": keyword_id,
            "keyword": keyword_id,
            "message": (
                "Keyword not found in generated "
                "domain keywords."
            )
        }

    return item