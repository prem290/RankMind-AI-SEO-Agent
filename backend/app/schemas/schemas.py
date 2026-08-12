from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
import datetime

class WebsiteBase(BaseModel):
    name: str
    domain: str

class WebsiteCreate(WebsiteBase):
    pass

class WebsiteResponse(WebsiteBase):
    id: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class KeywordBase(BaseModel):
    keyword: str
    position: int
    previous_position: int
    change: int
    search_volume: int
    difficulty: int
    intent: str
    url: str
    trend: str
    last_optimization: str
    competitor_position: int
    citation_count: int = 0

class KeywordResponse(KeywordBase):
    id: str
    website_id: str

    class Config:
        from_attributes = True

class SEOExperimentCreate(BaseModel):
    title: str
    target_url: str
    target_keywords: List[str]
    hypothesis: str
    changes_made: List[str]
    start_date: str
    before_position: float
    traffic_before: int
    ctr_before: float

class SEOExperimentComplete(BaseModel):
    after_position: float
    traffic_after: int
    ctr_after: float
    end_date: str
    outcome: str # Successful, Failed
    confidence: float = 85.0
    notes: Optional[str] = None

class SEOExperimentResponse(BaseModel):
    id: str
    website_id: str
    title: str
    target_url: str
    target_keywords: List[str]
    hypothesis: str
    changes_made: List[str]
    start_date: str
    end_date: Optional[str] = None
    before_position: float
    after_position: Optional[float] = None
    traffic_before: int
    traffic_after: Optional[int] = None
    ctr_before: float
    ctr_after: Optional[float] = None
    outcome: str
    confidence: float
    notes: Optional[str] = None
    hindsight_stored: bool = False

    class Config:
        from_attributes = True

class HistoricalEvidenceItem(BaseModel):
    experiment_id: str
    title: str
    strategy_used: str
    before_after: str
    outcome: str
    relevance_reason: str

class RecommendationItem(BaseModel):
    id: str
    title: str
    target_url: str
    recommendation: str
    why: str
    historical_evidence: List[HistoricalEvidenceItem]
    expected_impact: str
    confidence: float
    priority: str # Critical, High, Medium, Low
    effort: str # Low, Medium, High
    risk: str

class SEORecommendationResponse(BaseModel):
    summary: str
    issues_detected: List[str]
    recommendations: List[RecommendationItem]
    memories_consulted_count: int
    with_hindsight_memory: bool

class CompetitorResponse(BaseModel):
    id: str
    domain: str
    name: str
    visibility_score: int
    ranking_keywords: int
    content_published_month: int
    new_pages_30d: int
    backlinks_gained_30d: int
    citation_presence: str
    serp_features: List[str]
    recent_events: List[Dict[str, Any]]

    class Config:
        from_attributes = True

class CitationResponse(BaseModel):
    id: str
    source_domain: str
    source_title: str
    source_type: str
    brand_mentioned: Optional[str] = None
    competitors_mentioned: List[str]
    citation_url: str
    status: str
    ai_search_visibility: bool
    context: str
    date: str

    class Config:
        from_attributes = True

class LearnedPatternResponse(BaseModel):
    id: str
    pattern_name: str
    summary: str
    evidence_count: int
    average_improvement: str
    confidence: float
    category: str
    successful_experiments: List[str]
    failed_experiments: List[str]
    insight: str

    class Config:
        from_attributes = True

class MemorySearchQuery(BaseModel):
    query: str
    bank_id: Optional[str] = "rankmind-seo-memory"

class MemorySearchResponse(BaseModel):
    query: str
    total_memories_found: int
    memories: List[Dict[str, Any]]

class DemoPromptRequest(BaseModel):
    question: str
    use_hindsight_memory: bool = True
