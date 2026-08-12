import json
import logging
import sqlite3
import os
import requests
from typing import List, Dict, Any, Optional

from app.config import settings

logger = logging.getLogger("rankmind.hindsight")

class HindsightMemoryService:
    """
    Hindsight Persistent Memory Service Abstraction.
    Interfaces with Hindsight Memory API / hindsight-client SDK.
    Includes an embedded local vector/keyword fallback engine for zero-config hackathon judging & offline support.
    """

    def __init__(self):
        self.base_url = settings.HINDSIGHT_BASE_URL.rstrip('/')
        self.api_key = settings.HINDSIGHT_API_KEY
        self.bank_name = settings.HINDSIGHT_BANK_NAME
        self.fallback_db_path = os.path.join(os.path.dirname(__file__), "../../hindsight_fallback.db")
        self._init_fallback_db()
        self._hindsight_client = None
        self._init_hindsight_client()

    def _init_hindsight_client(self):
        """Attempts to initialize hindsight-client SDK if installed."""
        try:
            from hindsight_client import Hindsight
            self._hindsight_client = Hindsight(base_url=self.base_url, api_key=self.api_key if self.api_key else None)
            logger.info(f"Hindsight client SDK initialized for {self.base_url}")
        except Exception as e:
            logger.info(f"hindsight-client SDK not available or remote offline. Using resilient embedded memory fallback engine. ({e})")
            self._hindsight_client = None

    def _init_fallback_db(self):
        """Initializes SQLite database for embedded fallback memory store."""
        try:
            conn = sqlite3.connect(self.fallback_db_path)
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS hindsight_memories (
                    id TEXT PRIMARY KEY,
                    bank_id TEXT,
                    memory_type TEXT,
                    content TEXT,
                    metadata_json TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Error initializing fallback memory DB: {e}")

    def is_healthy(self) -> Dict[str, Any]:
        """Checks connection status to Hindsight service."""
        hindsight_online = False
        try:
            resp = requests.get(f"{self.base_url}/health", timeout=1.5)
            if resp.status_code == 200:
                hindsight_online = True
        except Exception:
            hindsight_online = False

        return {
            "status": "online" if hindsight_online else "embedded_fallback",
            "base_url": self.base_url,
            "bank_name": self.bank_name,
            "hindsight_server_active": hindsight_online,
            "fallback_engine_active": True
        }

    # ==========================
    # CORE HINDSIGHT OPERATIONS
    # ==========================

    def retain(self, content: str, memory_type: str = "SEO_EXPERIMENT", metadata: Optional[Dict[str, Any]] = None, bank_id: Optional[str] = None) -> bool:
        """
        Ingests information into durable structured Hindsight memory.
        """
        bank = bank_id or self.bank_name
        metadata_dict = metadata or {}
        
        # 1. Attempt official Hindsight API / Client SDK
        stored_remote = False
        if self._hindsight_client:
            try:
                self._hindsight_client.retain(bank_id=bank, content=content, metadata=metadata_dict)
                stored_remote = True
            except Exception as e:
                logger.warning(f"Remote Hindsight retain failed, saving to embedded memory: {e}")

        if not stored_remote:
            try:
                resp = requests.post(
                    f"{self.base_url}/api/v1/banks/{bank}/memories",
                    json={"content": content, "metadata": metadata_dict, "type": memory_type},
                    headers={"Authorization": f"Bearer {self.api_key}"} if self.api_key else {},
                    timeout=0.2
                )
                if resp.status_code in [200, 201]:
                    stored_remote = True
            except Exception:
                pass

        # 2. Always persist to embedded memory fallback store as guarantee
        memory_id = metadata_dict.get("experiment_id") or metadata_dict.get("id") or f"mem-{os.urandom(4).hex()}"
        try:
            conn = sqlite3.connect(self.fallback_db_path)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO hindsight_memories (id, bank_id, memory_type, content, metadata_json)
                VALUES (?, ?, ?, ?, ?)
            """, (memory_id, bank, memory_type, content, json.dumps(metadata_dict)))
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            logger.error(f"Fallback retain error: {e}")
            return False

    def recall(self, query: str, limit: int = 5, bank_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Recalls context from Hindsight memory using multi-strategy search.
        """
        bank = bank_id or self.bank_name
        results = []

        # 1. Try remote Hindsight client / API first
        if self._hindsight_client:
            try:
                res = self._hindsight_client.recall(bank_id=bank, query=query)
                if hasattr(res, 'results'):
                    for item in res.results:
                        results.append({
                            "content": getattr(item, 'text', str(item)),
                            "metadata": getattr(item, 'metadata', {}),
                            "score": getattr(item, 'score', 0.9)
                        })
                    if results:
                        return results[:limit]
            except Exception as e:
                logger.warning(f"Hindsight client recall fallback triggered: {e}")

        # HTTP REST call fallback
        try:
            resp = requests.post(
                f"{self.base_url}/api/v1/banks/{bank}/recall",
                json={"query": query, "top_k": limit},
                headers={"Authorization": f"Bearer {self.api_key}"} if self.api_key else {},
                timeout=0.2
            )
            if resp.status_code == 200:
                data = resp.json()
                for item in data.get("results", []):
                    results.append({
                        "content": item.get("content") or item.get("text", ""),
                        "metadata": item.get("metadata", {}),
                        "score": item.get("score", 0.85)
                    })
                if results:
                    return results[:limit]
        except Exception:
            pass

        # 2. Embedded vector/keyword fallback search
        try:
            conn = sqlite3.connect(self.fallback_db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT id, memory_type, content, metadata_json FROM hindsight_memories WHERE bank_id = ?", (bank,))
            rows = cursor.fetchall()
            conn.close()

            query_words = set(query.lower().replace("-", " ").split())
            scored_memories = []

            for row_id, mem_type, content, meta_json in rows:
                meta = json.loads(meta_json) if meta_json else {}
                content_lower = (content + " " + json.dumps(meta)).lower()
                
                # Scoring based on term overlaps and exact token matches
                score = sum(2.0 if word in content_lower else 0.0 for word in query_words)
                
                # Boost if target keyword or experiment ID matches
                for kw in meta.get("target_keywords", []):
                    if kw.lower() in query.lower():
                        score += 5.0
                if meta.get("experiment_id", "").lower() in query.lower():
                    score += 10.0

                if score > 0 or len(rows) <= limit:
                    scored_memories.append({
                        "content": content,
                        "metadata": meta,
                        "memory_type": mem_type,
                        "score": round(min(0.99, 0.5 + score * 0.08), 2)
                    })

            scored_memories.sort(key=lambda x: x["score"], reverse=True)
            return scored_memories[:limit]
        except Exception as e:
            logger.error(f"Fallback recall error: {e}")
            return []

    # ==========================
    # DOMAIN SPECIFIC MEMORY API
    # ==========================

    def store_seo_experiment(self, exp_data: Dict[str, Any]) -> bool:
        """Stores completed or active SEO experiment into Hindsight memory."""
        content = (
            f"SEO Experiment {exp_data.get('experiment_id')}: Title '{exp_data.get('title')}'. "
            f"Target URL: {exp_data.get('target_url')}. Target Keywords: {', '.join(exp_data.get('target_keywords', []))}. "
            f"Hypothesis: {exp_data.get('hypothesis')}. Changes Made: {'; '.join(exp_data.get('changes_made', []))}. "
            f"Outcome: {exp_data.get('outcome')}. Position before: {exp_data.get('before_position')} -> after: {exp_data.get('after_position')}. "
            f"Traffic before: {exp_data.get('traffic_before')} -> after: {exp_data.get('traffic_after')}. "
            f"CTR before: {exp_data.get('ctr_before')}% -> after: {exp_data.get('ctr_after')}%. "
            f"Notes: {exp_data.get('notes', '')}"
        )
        return self.retain(content=content, memory_type="SEO_EXPERIMENT", metadata=exp_data)

    def store_ranking_event(self, ranking_data: Dict[str, Any]) -> bool:
        """Stores significant keyword ranking movement and correlated action into Hindsight memory."""
        content = (
            f"Ranking Movement Event for '{ranking_data.get('keyword')}': "
            f"Moved from position {ranking_data.get('old_position')} to {ranking_data.get('new_position')} on {ranking_data.get('date')}. "
            f"Correlated Action: {ranking_data.get('action')}. Associated Experiment: {ranking_data.get('experiment_id', 'N/A')}. "
            f"Observed Impact: {ranking_data.get('impact')}"
        )
        return self.retain(content=content, memory_type="RANKING_EVENT", metadata=ranking_data)

    def store_competitor_event(self, comp_data: Dict[str, Any]) -> bool:
        """Stores competitor action and observed SERP impact in Hindsight memory."""
        content = (
            f"Competitor Event ({comp_data.get('competitor')}): {comp_data.get('event')} on {comp_data.get('date')}. "
            f"Keywords Gained: {', '.join(comp_data.get('keywords_gained', []))}. "
            f"Observed Impact on Our Site: {comp_data.get('observed_impact')}"
        )
        return self.retain(content=content, memory_type="COMPETITOR_EVENT", metadata=comp_data)

    def store_citation_event(self, citation_data: Dict[str, Any]) -> bool:
        """Stores brand/competitor citation event in Hindsight memory."""
        content = (
            f"Citation Event ({citation_data.get('source_domain')}): Title '{citation_data.get('source_title')}'. "
            f"Brand Mentioned: {citation_data.get('brand_mentioned', 'None')}. Competitors: {', '.join(citation_data.get('competitors_mentioned', []))}. "
            f"Status: {citation_data.get('status')}. Context: {citation_data.get('context')}"
        )
        return self.retain(content=content, memory_type="CITATION_EVENT", metadata=citation_data)

    def search_similar_experiments(self, keyword_or_url: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Recalls past experiments relevant to a keyword, URL, or strategy."""
        query = f"SEO experiment optimization for {keyword_or_url} position recovery internal linking FAQ title"
        return self.recall(query=query, limit=limit)

    def build_seo_context(self, keyword: str, current_position: float, target_url: str) -> str:
        """Assembles structured Hindsight memory context for LLM recommendation prompts."""
        recalled = self.search_similar_experiments(f"{keyword} {target_url}", limit=5)
        if not recalled:
            return "No prior historical experiments found in Hindsight memory for this keyword cluster."

        context_lines = [f"### RECALLED HINDSIGHT HISTORICAL MEMORIES ({len(recalled)} items found):"]
        for idx, item in enumerate(recalled, 1):
            meta = item.get("metadata", {})
            context_lines.append(
                f"{idx}. Experiment ID: {meta.get('experiment_id', 'SEO-EXP')}\n"
                f"   - Title: {meta.get('title', item.get('content')[:80])}\n"
                f"   - Strategy Implemented: {', '.join(meta.get('changes_made', ['On-page optimization']))}\n"
                f"   - Before Position: {meta.get('before_position')} -> After Position: {meta.get('after_position')}\n"
                f"   - Result: {meta.get('outcome', 'Successful')} (CTR Change: {meta.get('ctr_before', '')}% -> {meta.get('ctr_after', '')}%)\n"
                f"   - Empirical Learning: {meta.get('notes', item.get('content'))}\n"
            )
        return "\n".join(context_lines)

    def get_all_memories(self) -> List[Dict[str, Any]]:
        """Returns all memories stored in the bank for display in Memory Explorer."""
        try:
            conn = sqlite3.connect(self.fallback_db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT id, bank_id, memory_type, content, metadata_json, created_at FROM hindsight_memories ORDER BY created_at DESC")
            rows = cursor.fetchall()
            conn.close()

            memories = []
            for row in rows:
                meta = json.loads(row[4]) if row[4] else {}
                memories.append({
                    "id": row[0],
                    "bank_id": row[1],
                    "type": row[2],
                    "content": row[3],
                    "metadata": meta,
                    "created_at": row[5]
                })
            return memories
        except Exception as e:
            logger.error(f"Error fetching memories: {e}")
            return []

# Singleton instance
hindsight_service = HindsightMemoryService()
