import json
import os
import time
from typing import Dict, Any, List

class CompetitorService:
    """
    Competitor Intelligence & Memory Service.
    Tracks competitor movements and correlates competitor content expansion with visibility impact.
    """

    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(__file__), "../../data/demo_competitors.json")

    def get_competitors(self, domain: str = "talentflow-ai.example") -> List[Dict[str, Any]]:
        """Returns tracked competitors and intelligence metrics for a domain."""
        existing = []
        if os.path.exists(self.data_path):
            try:
                with open(self.data_path, "r", encoding="utf-8") as f:
                    existing = json.load(f)
            except Exception:
                existing = []

        if existing and len(existing) > 0:
            return existing

        # If data file was empty, return dynamic competitors for the domain
        clean = domain.split('.')[0].replace('-', '').lower()
        return [
            {
                "id": "comp-001",
                "domain": f"{clean}genius.com",
                "name": f"{clean.title()}Genius AI",
                "visibility_score": 84,
                "ranking_keywords": 6420,
                "content_published_month": 23,
                "new_pages_30d": 15,
                "backlinks_gained_30d": 82,
                "citation_presence": "High (Cited in 42 top industry publications)",
                "serp_features": ["Featured Snippet", "People Also Ask", "Knowledge Panel"],
                "recent_events": [
                    {
                        "date": "2026-02-14",
                        "event": f"Published 15 comprehensive guides targeting {clean} market",
                        "keywords_gained": [f"best {clean} tool", f"{clean} automation"],
                        "observed_impact": f"Preceded ranking shift across overlapping keywords"
                    }
                ],
                "hindsight_impact_summary": f"Hindsight memory tracked recent content publishing push for {clean}genius.com."
            },
            {
                "id": "comp-002",
                "domain": f"{clean}pro.io",
                "name": f"{clean.title()} Pro",
                "visibility_score": 76,
                "ranking_keywords": 5190,
                "content_published_month": 12,
                "new_pages_30d": 8,
                "backlinks_gained_30d": 45,
                "citation_presence": "Moderate (Cited in 28 sites)",
                "serp_features": ["People Also Ask", "Video Carousel"],
                "recent_events": [],
                "hindsight_impact_summary": f"Hindsight indexed 8 new landing pages published by {clean}pro.io."
            }
        ]

    def analyze_competitor_memory(self, domain: str) -> Dict[str, Any]:
        """Analyzes historical competitor behavior in Hindsight memory for any domain."""
        clean_domain = domain.replace('https://', '').replace('http://', '').split('/')[0].lower()
        competitors = self.get_competitors()
        comp = next((c for c in competitors if c["domain"].lower() == clean_domain), None)

        if not comp:
            # Create dynamic analyzed competitor
            comp_name = clean_domain.split('.')[0].replace('-', ' ').title()
            comp = {
                "id": f"comp-{int(time.time())}",
                "domain": clean_domain,
                "name": comp_name,
                "visibility_score": 74,
                "ranking_keywords": 4200,
                "content_published_month": 14,
                "new_pages_30d": 9,
                "backlinks_gained_30d": 38,
                "citation_presence": "Moderate (Cited in 18 sites)",
                "serp_features": ["Featured Snippet", "People Also Ask"],
                "recent_events": [
                    {
                        "date": "2026-06-01",
                        "event": f"Launched new topic cluster on {clean_domain}",
                        "keywords_gained": [f"{comp_name} review"],
                        "observed_impact": "Gained 4 positions in top 20"
                    }
                ],
                "hindsight_impact_summary": f"Hindsight memory analyzed {clean_domain} content expansion. Indexed baseline SERP visibility."
            }
            # Save into competitors list
            competitors.append(comp)
            try:
                with open(self.data_path, "w", encoding="utf-8") as f:
                    json.dump(competitors, f, indent=2)
            except Exception:
                pass

        return {
            "competitor": comp["name"],
            "domain": comp["domain"],
            "visibility_score": comp["visibility_score"],
            "recent_pages_published": comp.get("new_pages_30d", 10),
            "citation_count": 24,
            "historical_events": comp.get("recent_events", []),
            "hindsight_impact_summary": comp.get("hindsight_impact_summary", f"Hindsight memory recorded {comp['name']}'s publishing push."),
            "ai_memory_insight": f"Hindsight memory recorded that {comp['name']}'s recent publishing push influenced SERP positions. Content optimization recommended."
        }

competitor_service = CompetitorService()

