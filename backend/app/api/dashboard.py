from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from app.services.seo_service import seo_service
from app.services.learning_service import learning_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=Dict[str, Any])
def get_dashboard_metrics(domain: Optional[str] = Query("talentflow-ai.example")):
    clean_domain = domain.replace("https://", "").replace("http://", "").split("/")[0]
    health = seo_service.calculate_health_score(clean_domain)
    memory_score = learning_service.calculate_memory_score()
    keywords = seo_service.generate_keywords_for_domain(clean_domain)
    
    return {
        "website": {
            "name": clean_domain.split('.')[0].replace('-', ' ').title(),
            "domain": clean_domain
        },
        "metrics": {
            "organic_traffic": 124850 if "talentflow" in clean_domain else 84200,
            "organic_traffic_change": "+14.2%",
            "average_position": 12.8,
            "average_position_change": "+2.4 positions",
            "keywords_ranking": len(keywords) * 420,
            "top_10_keywords": len(keywords) * 75,
            "featured_snippets": 32,
            "citation_opportunities": 87,
            "competitor_visibility": "72%",
            "ai_recommendation_success": "78%",
            "memory_assisted_recommendations_pct": "64%"
        },
        "seo_health": health,
        "memory_score": memory_score,
        "demo_mode": True
    }
