import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["app"] == "RankMind AI"

def test_dashboard_endpoint():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["website"]["name"] == "TalentFlow AI"
    assert "seo_health" in data

def test_keywords_endpoint():
    response = client.get("/api/keywords")
    assert response.status_code == 200
    keywords = response.json()
    assert len(keywords) > 0

def test_demo_run_endpoint():
    # Test Demo without memory
    response_no_mem = client.post("/api/demo/run", json={"question": "Why is ranking declining?", "use_hindsight_memory": False})
    assert response_no_mem.status_code == 200
    assert response_no_mem.json()["mode"] == "WITHOUT_MEMORIES"

    # Test Demo with memory
    response_with_mem = client.post("/api/demo/run", json={"question": "What should we do based on past history?", "use_hindsight_memory": True})
    assert response_with_mem.status_code == 200
    assert response_with_mem.json()["mode"] == "WITH_MEMORIES"
    assert response_with_mem.json()["result"]["with_hindsight_memory"] is True
