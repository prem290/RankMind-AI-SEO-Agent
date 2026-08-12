from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from app.services.seo_service import seo_service

router = APIRouter(prefix="/api/audit", tags=["SEO Audit"])

@router.get("", response_model=Dict[str, Any])
def get_audit(domain: Optional[str] = Query("talentflow-ai.example")):
    clean_domain = domain.replace("https://", "").replace("http://", "").split("/")[0]
    health = seo_service.calculate_health_score(clean_domain)
    issues = seo_service.get_full_audit_results(clean_domain)
    return {
        "domain": clean_domain,
        "overall_score": health["overall_score"],
        "breakdown": health["breakdown"],
        "issues_count": len(issues),
        "issues": issues
    }

@router.post("", response_model=Dict[str, Any])
def run_audit(domain: Optional[str] = "talentflow-ai.example"):
    return get_audit(domain=domain)
