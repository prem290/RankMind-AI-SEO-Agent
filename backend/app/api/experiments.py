import json
import os
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

from app.schemas.schemas import SEOExperimentCreate, SEOExperimentComplete
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/experiments", tags=["Experiments"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "../../data/demo_experiments.json")

def _load_experiments() -> List[Dict[str, Any]]:
    if os.path.exists(DATA_PATH):
        try:
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if data and len(data) > 0:
                    return data
        except Exception:
            pass
            
    # Baseline fallback if empty
    return [
        {
            "experiment_id": "SEO-014",
            "title": "FAQ Content & Internal Link Optimization",
            "target_url": "https://targetdomain.example/landing",
            "target_keywords": ["SEO Optimization", "AI Content Strategy"],
            "hypothesis": "Adding structured FAQ content schema and 5 internal contextual links will improve rankings.",
            "changes_made": [
                "Added 6 structured FAQ items with Schema markup",
                "Created 5 internal links with descriptive anchors"
            ],
            "start_date": "2026-03-01",
            "end_date": "2026-04-15",
            "before_position": 31.0,
            "after_position": 14.0,
            "traffic_before": 2400,
            "traffic_after": 7800,
            "ctr_before": 1.8,
            "ctr_after": 5.4,
            "outcome": "Successful",
            "confidence": 92.0,
            "notes": "Position jumped from 31 to 14. FAQ snippet triggered on target terms."
        },
        {
            "experiment_id": "SEO-009",
            "title": "Meta Title Restructuring for Intent Alignment",
            "target_url": "https://targetdomain.example/tools",
            "target_keywords": ["Free SEO Audit Tool"],
            "hypothesis": "Rewriting meta title to explicitly include intent keywords will increase CTR and search ranking.",
            "changes_made": [
                "Updated meta title & description for high search intent"
            ],
            "start_date": "2026-02-05",
            "end_date": "2026-03-15",
            "before_position": 36.0,
            "after_position": 16.0,
            "traffic_before": 1200,
            "traffic_after": 4500,
            "ctr_before": 2.1,
            "ctr_after": 6.8,
            "outcome": "Successful",
            "confidence": 88.0,
            "notes": "Recovered position from 36 to 16. Higher CTR signaled user relevance."
        }
    ]

def _save_experiments(experiments: List[Dict[str, Any]]):
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(experiments, f, indent=2)

@router.get("", response_model=List[Dict[str, Any]])
def get_experiments():
    return _load_experiments()

@router.get("/{exp_id}", response_model=Dict[str, Any])
def get_experiment(exp_id: str):
    experiments = _load_experiments()
    exp = next((e for e in experiments if e["experiment_id"].lower() == exp_id.lower()), None)
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return exp

@router.post("", response_model=Dict[str, Any])
def create_experiment(exp: SEOExperimentCreate):
    experiments = _load_experiments()
    new_id = f"SEO-0{len(experiments) + 10:02d}"
    
    new_exp = {
        "experiment_id": new_id,
        "title": exp.title,
        "target_url": exp.target_url,
        "target_keywords": exp.target_keywords,
        "hypothesis": exp.hypothesis,
        "changes_made": exp.changes_made,
        "start_date": exp.start_date,
        "end_date": None,
        "before_position": exp.before_position,
        "after_position": None,
        "traffic_before": exp.traffic_before,
        "traffic_after": None,
        "ctr_before": exp.ctr_before,
        "ctr_after": None,
        "outcome": "In Progress",
        "confidence": 80.0,
        "notes": "Experiment active.",
        "hindsight_stored": False
    }
    experiments.insert(0, new_exp)
    _save_experiments(experiments)
    return new_exp

@router.post("/{exp_id}/complete", response_model=Dict[str, Any])
def complete_experiment(exp_id: str, comp: SEOExperimentComplete):
    experiments = _load_experiments()
    exp = next((e for e in experiments if e["experiment_id"].lower() == exp_id.lower()), None)
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")

    exp["end_date"] = comp.end_date
    exp["after_position"] = comp.after_position
    exp["traffic_after"] = comp.traffic_after
    exp["ctr_after"] = comp.ctr_after
    exp["outcome"] = comp.outcome
    exp["confidence"] = comp.confidence
    exp["notes"] = comp.notes or f"Completed on {comp.end_date} with outcome {comp.outcome}"
    
    # Store outcome into Hindsight Memory!
    stored = hindsight_service.store_seo_experiment(exp)
    exp["hindsight_stored"] = stored

    _save_experiments(experiments)
    return {
        "message": f"Experiment {exp_id} completed and recorded in Hindsight persistent memory.",
        "experiment": exp,
        "hindsight_stored": stored
    }
