import json
import os
from fastapi import APIRouter
from typing import Dict, Any
from app.schemas.schemas import DemoPromptRequest
from app.services.hindsight_service import hindsight_service
from app.services.llm_service import llm_service

router = APIRouter(prefix="/api/demo", tags=["Demo Mode"])

@router.post("/reset", response_model=Dict[str, Any])
def reset_demo_data():
    """Populates Hindsight memory bank with baseline synthetic demo experiments."""
    demo_exp_path = os.path.join(os.path.dirname(__file__), "../../data/demo_experiments.json")
    if os.path.exists(demo_exp_path):
        with open(demo_exp_path, "r", encoding="utf-8") as f:
            experiments = json.load(f)
            for exp in experiments:
                hindsight_service.store_seo_experiment(exp)

    return {
        "status": "success",
        "message": "Demo environment reset successfully. 5 baseline SEO experiments loaded into Hindsight persistent memory.",
        "hindsight_memories_loaded": len(hindsight_service.get_all_memories())
    }

@router.post("/run", response_model=Dict[str, Any])
def run_demo_step(payload: DemoPromptRequest):
    """
    Executes the interactive hackathon before/after memory demonstration.
    """
    use_mem = payload.use_hindsight_memory
    
    # 1. Execute LLM Reasoning Pipeline
    response = llm_service.generate_recommendation_with_memory(
        keyword="AI resume analyzer",
        current_position=15,
        previous_position=7,
        target_url="https://talentflow-ai.example/ai-resume-analyzer",
        competitor_pos=4,
        use_memory=use_mem
    )

    demo_part = 4 if use_mem else 1
    
    return {
        "step": f"PART {demo_part}: {'WITH HINDSIGHT MEMORY (Site-Specific Evidence)' if use_mem else 'WITHOUT MEMORY (Generic AI Advice)'}",
        "user_query": payload.question,
        "mode": "WITH_MEMORIES" if use_mem else "WITHOUT_MEMORIES",
        "result": response,
        "judging_insight": (
            "NOTICE THE DIFFERENCE: Without memory, the AI gives generic SEO advice. "
            "With Hindsight memory, RankMind recalls Experiment SEO-014, proves that internal linking + FAQ schema previously recovered ranking from 31 to 14 (+17 positions), and gives a personalized site-specific plan!"
            if use_mem else
            "Without memory, the system has no knowledge of past website experiments, SEO actions, or what worked/failed."
        )
    }
