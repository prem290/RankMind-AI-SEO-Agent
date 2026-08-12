import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.services.llm_service import llm_service

def test_generic_recommendation_without_memory():
    resp = llm_service.generate_recommendation_with_memory(
        keyword="AI resume analyzer",
        current_position=15,
        previous_position=7,
        target_url="https://talentflow-ai.example/ai-resume-analyzer",
        competitor_pos=4,
        use_memory=False
    )
    assert resp["with_hindsight_memory"] is False
    assert resp["memories_consulted_count"] == 0
    assert len(resp["recommendations"]) > 0
    # Historical evidence should be empty without memory
    assert len(resp["recommendations"][0]["historical_evidence"]) == 0

def test_personalized_recommendation_with_memory():
    resp = llm_service.generate_recommendation_with_memory(
        keyword="AI resume analyzer",
        current_position=15,
        previous_position=7,
        target_url="https://talentflow-ai.example/ai-resume-analyzer",
        competitor_pos=4,
        use_memory=True
    )
    assert resp["with_hindsight_memory"] is True
    assert resp["memories_consulted_count"] > 0
    assert len(resp["recommendations"]) > 0
    # Must contain historical evidence citing past experiment like SEO-014
    evidence = resp["recommendations"][0]["historical_evidence"]
    assert len(evidence) > 0
    assert any("SEO-014" in item["experiment_id"] or "SEO-" in item["experiment_id"] for item in evidence)
