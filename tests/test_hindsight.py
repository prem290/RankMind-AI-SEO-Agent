import sys
import os
import pytest

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.services.hindsight_service import hindsight_service

def test_hindsight_retain_and_recall():
    test_exp = {
        "experiment_id": "SEO-TEST-99",
        "title": "Test Memory Optimization",
        "target_url": "https://talentflow-ai.example/test",
        "target_keywords": ["test keyword"],
        "hypothesis": "Testing memory retention",
        "changes_made": ["Added test internal links"],
        "start_date": "2026-08-01",
        "end_date": "2026-08-10",
        "before_position": 25.0,
        "after_position": 10.0,
        "traffic_before": 1000,
        "traffic_after": 3000,
        "ctr_before": 2.0,
        "ctr_after": 5.0,
        "outcome": "Successful",
        "confidence": 90.0,
        "notes": "Test completed successfully."
    }

    # Store experiment in Hindsight
    stored = hindsight_service.store_seo_experiment(test_exp)
    assert stored is True

    # Search similar experiments
    results = hindsight_service.search_similar_experiments("test keyword", limit=5)
    assert len(results) > 0
    
    # Verify experiment ID is present in metadata or content
    found = any(
        res.get("metadata", {}).get("experiment_id") == "SEO-TEST-99" or "SEO-TEST-99" in res.get("content", "")
        for res in results
    )
    assert found is True
