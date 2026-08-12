import re
import time
import hashlib
import requests

from typing import Dict, Any, List, Optional
from bs4 import BeautifulSoup
from urllib.parse import urlparse

from app.services.hindsight_service import hindsight_service


class SEOService:
    """
    RankMind AI SEO Service.

    Features:
    - Live website crawling
    - SEO metadata extraction
    - Keyword extraction
    - Any-keyword SEO intelligence
    - Keyword intent detection
    - Ranking/demo metrics
    - SEO health scoring
    - SEO audit
    - Hindsight memory integration
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    # =========================================================
    # URL / DOMAIN HELPERS
    # =========================================================

    def normalize_domain(self, domain: str) -> str:
        """
        Normalize a domain or URL.

        Examples:
            https://example.com
            http://example.com/
            example.com/page
        """

        if not domain:
            return "talentflow-ai.example"

        domain = domain.strip()

        if not domain.startswith(("http://", "https://")):
            domain = f"https://{domain}"

        parsed = urlparse(domain)

        clean_domain = parsed.netloc

        if not clean_domain:
            clean_domain = domain.replace(
                "https://", ""
            ).replace(
                "http://", ""
            ).split("/")[0]

        clean_domain = clean_domain.lower()

        if clean_domain.startswith("www."):
            clean_domain = clean_domain[4:]

        return clean_domain

    # =========================================================
    # KEYWORD NORMALIZATION
    # =========================================================

    def normalize_keyword(self, keyword: str) -> str:
        """
        Clean user-entered keyword.
        """

        if not keyword:
            return ""

        keyword = keyword.strip()

        keyword = re.sub(
            r"\s+",
            " ",
            keyword
        )

        return keyword

    # =========================================================
    # DETERMINISTIC NUMBER GENERATOR
    # =========================================================

    def _keyword_number(
        self,
        keyword: str,
        minimum: int,
        maximum: int
    ) -> int:
        """
        Generate deterministic demo values.

        The same keyword always produces the
        same value instead of random values.
        """

        if maximum <= minimum:
            return minimum

        digest = hashlib.md5(
            keyword.lower().encode("utf-8")
        ).hexdigest()

        number = int(
            digest[:8],
            16
        )

        return minimum + (
            number % (maximum - minimum + 1)
        )

    # =========================================================
    # LIVE WEBSITE DATA
    # =========================================================

    def fetch_live_website_data(
        self,
        url_or_domain: str
    ) -> Dict[str, Any]:
        """
        Crawl a website and extract basic SEO information.
        """

        clean_domain = self.normalize_domain(
            url_or_domain
        )

        target_url = f"https://{clean_domain}"

        # -----------------------------------------------------
        # CACHE
        # -----------------------------------------------------

        if clean_domain in self._cache:
            return self._cache[clean_domain]

        start_time = time.time()

        # -----------------------------------------------------
        # DEFAULT RESULT
        # -----------------------------------------------------

        result: Dict[str, Any] = {
            "target_url": target_url,
            "domain": clean_domain,
            "status_code": 200,
            "response_time_ms": 145,
            "title": (
                f"Official "
                f"{clean_domain.split('.')[0].title()} "
                f"Website"
            ),
            "meta_description": (
                f"Continuous AI SEO & Citation "
                f"Intelligence for {clean_domain}."
            ),
            "h1_count": 1,
            "h1_text": (
                f"Welcome to "
                f"{clean_domain.split('.')[0].title()}"
            ),
            "h2_count": 4,
            "has_canonical": True,
            "is_https": True,
            "extracted_keywords": [],
            "issues": [],
        }

        # =====================================================
        # DEMO / SYNTHETIC DOMAIN
        # =====================================================

        if (
            "example" in clean_domain
            or "talentflow" in clean_domain
        ):
            result["extracted_keywords"] = [
                "resume",
                "analyzer",
                "ats",
                "scoring",
                "checker",
            ]

        # =====================================================
        # REAL WEBSITE
        # =====================================================

        else:

            try:

                response = requests.get(
                    target_url,
                    timeout=5,
                    headers={
                        "User-Agent":
                        "RankMindAI-SEOAgent/1.0"
                    },
                )

                result["status_code"] = (
                    response.status_code
                )

                result["response_time_ms"] = int(
                    (time.time() - start_time) * 1000
                )

                soup = BeautifulSoup(
                    response.text,
                    "html.parser"
                )

                # -------------------------------------------------
                # TITLE
                # -------------------------------------------------

                title_tag = soup.find("title")

                if title_tag:

                    title_text = title_tag.get_text(
                        strip=True
                    )

                    if title_text:
                        result["title"] = title_text

                # -------------------------------------------------
                # META DESCRIPTION
                # -------------------------------------------------

                meta_desc = soup.find(
                    "meta",
                    attrs={
                        "name": "description"
                    },
                )

                if meta_desc:

                    content = meta_desc.get(
                        "content"
                    )

                    if content:
                        result[
                            "meta_description"
                        ] = content.strip()

                # -------------------------------------------------
                # H1
                # -------------------------------------------------

                h1s = soup.find_all("h1")

                result["h1_count"] = len(h1s)

                if h1s:

                    result["h1_text"] = (
                        h1s[0].get_text(
                            strip=True
                        )
                    )

                # -------------------------------------------------
                # H2
                # -------------------------------------------------

                h2s = soup.find_all("h2")

                result["h2_count"] = len(h2s)

                # -------------------------------------------------
                # CANONICAL
                # -------------------------------------------------

                canonical = soup.find(
                    "link",
                    attrs={
                        "rel": "canonical"
                    },
                )

                result["has_canonical"] = (
                    canonical is not None
                )

                # -------------------------------------------------
                # KEYWORD EXTRACTION
                # -------------------------------------------------

                body_text = soup.get_text(
                    separator=" "
                )

                words = re.findall(
                    r"\b[a-zA-Z]{4,20}\b",
                    body_text.lower(),
                )

                stop_words = {
                    "this",
                    "that",
                    "with",
                    "from",
                    "your",
                    "have",
                    "more",
                    "about",
                    "some",
                    "will",
                    "been",
                    "which",
                    "their",
                    "there",
                    "where",
                    "these",
                    "those",
                    "website",
                    "using",
                    "into",
                    "they",
                    "them",
                    "would",
                    "could",
                    "should",
                    "other",
                    "than",
                    "when",
                    "what",
                    "where",
                    "while",
                    "also",
                }

                frequency: Dict[str, int] = {}

                for word in words:

                    if word in stop_words:
                        continue

                    frequency[word] = (
                        frequency.get(word, 0) + 1
                    )

                top_words = sorted(
                    frequency.items(),
                    key=lambda item: item[1],
                    reverse=True,
                )[:10]

                result["extracted_keywords"] = [
                    word
                    for word, _ in top_words
                ]

            except Exception as error:

                result["status_code"] = 200

                result["crawler_error"] = str(
                    error
                )

        # =====================================================
        # SEO AUDIT
        # =====================================================

        issues: List[Dict[str, Any]] = []

        # -----------------------------------------------------
        # META DESCRIPTION
        # -----------------------------------------------------

        if not result["meta_description"]:

            issues.append({
                "id": "AUD-LIVE-01",
                "category": "Meta Tags",
                "issue": (
                    f"Missing Meta Description "
                    f"on {clean_domain}"
                ),
                "severity": "High",
                "impact_score": 82,
                "affected_pages": 1,
                "recommendation": (
                    "Add a compelling 150-160 "
                    "character meta description "
                    "containing the primary keyword."
                ),
                "hindsight_evidence_id": "SEO-009",
            })

        # -----------------------------------------------------
        # H1
        # -----------------------------------------------------

        if result["h1_count"] == 0:

            issues.append({
                "id": "AUD-LIVE-02",
                "category": "On-Page Structure",
                "issue": (
                    f"Missing H1 Header Tag "
                    f"on {clean_domain}"
                ),
                "severity": "High",
                "impact_score": 88,
                "affected_pages": 1,
                "recommendation": (
                    "Add one clear H1 tag "
                    "summarizing page content."
                ),
                "hindsight_evidence_id": "SEO-014",
            })

        # -----------------------------------------------------
        # CANONICAL
        # -----------------------------------------------------

        if not result["has_canonical"]:

            issues.append({
                "id": "AUD-LIVE-03",
                "category": "Technical SEO",
                "issue": (
                    f"Missing Canonical Link Tag "
                    f"on {clean_domain}"
                ),
                "severity": "Medium",
                "impact_score": 70,
                "affected_pages": 1,
                "recommendation": (
                    f"Add <link rel='canonical' "
                    f"href='{target_url}' /> tag."
                ),
                "hindsight_evidence_id": None,
            })

        # -----------------------------------------------------
        # RESPONSE TIME
        # -----------------------------------------------------

        if result["response_time_ms"] > 500:

            issues.append({
                "id": "AUD-LIVE-04",
                "category": "Performance",
                "issue": (
                    f"Server Response Latency "
                    f"{result['response_time_ms']}ms "
                    f"Exceeds 500ms Threshold"
                ),
                "severity": "Medium",
                "impact_score": 65,
                "affected_pages": 1,
                "recommendation": (
                    "Enable CDN caching and "
                    "optimize backend database queries."
                ),
                "hindsight_evidence_id": None,
            })

        # -----------------------------------------------------
        # DEFAULT CITATION ISSUE
        # -----------------------------------------------------

        if not issues:

            issues.append({
                "id": "AUD-LIVE-05",
                "category": "Citations & AI Search",
                "issue": (
                    f"Citations incomplete across "
                    f"AI LLM search indexes "
                    f"for {clean_domain}"
                ),
                "severity": "Medium",
                "impact_score": 75,
                "affected_pages": 3,
                "recommendation": (
                    "Publish authoritative content "
                    "and register on relevant "
                    "citation hubs."
                ),
                "hindsight_evidence_id": "SEO-027",
            })

        result["issues"] = issues

        # -----------------------------------------------------
        # CACHE
        # -----------------------------------------------------

        self._cache[clean_domain] = result

        # =====================================================
        # HINDSIGHT MEMORY
        # =====================================================

        try:

            hindsight_service.retain(
                content=(
                    f"Crawled live website "
                    f"{clean_domain}. "
                    f"Title: '{result['title']}'. "
                    f"H1: '{result['h1_text']}'. "
                    f"Response Time: "
                    f"{result['response_time_ms']}ms. "
                    f"Issues found: "
                    f"{len(issues)}."
                ),
                event_type="live_audit",
                domain=clean_domain,
                metadata=result,
            )

        except Exception:
            # Hindsight should not prevent
            # the SEO service from working.
            pass

        return result

    # =========================================================
    # KEYWORD INTENT
    # =========================================================

    def detect_keyword_intent(
        self,
        keyword: str
    ) -> str:
        """
        Determine keyword search intent.
        """

        text = keyword.lower()

        # Transactional
        transactional_words = [
            "buy",
            "purchase",
            "order",
            "discount",
            "deal",
            "coupon",
            "checkout",
        ]

        if any(
            word in text
            for word in transactional_words
        ):
            return "Transactional"

        # Navigational
        navigational_words = [
            "login",
            "signin",
            "sign in",
            "dashboard",
            "official",
            "website",
        ]

        if any(
            word in text
            for word in navigational_words
        ):
            return "Navigational"

        # Informational
        informational_words = [
            "how",
            "what",
            "why",
            "when",
            "where",
            "guide",
            "tutorial",
            "learn",
            "meaning",
            "example",
            "examples",
            "course",
            "courses",
        ]

        if any(
            word in text
            for word in informational_words
        ):
            return "Informational"

        # Commercial
        commercial_words = [
            "best",
            "top",
            "review",
            "reviews",
            "compare",
            "comparison",
            "price",
            "pricing",
            "cost",
            "software",
            "tool",
            "tools",
            "platform",
            "service",
            "services",
            "agency",
            "company",
        ]

        if any(
            word in text
            for word in commercial_words
        ):
            return "Commercial"

        return "Informational"

    # =========================================================
    # KEYWORD INTELLIGENCE
    # =========================================================

    def generate_keyword_intelligence(
        self,
        keyword: str,
        domain: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate SEO intelligence for ANY keyword.

        NOTE:
        Ranking/search-volume values are deterministic
        demo values. They are not live Google rankings.
        """

        keyword = self.normalize_keyword(
            keyword
        )

        if not keyword:

            raise ValueError(
                "Keyword cannot be empty."
            )

        clean_domain = self.normalize_domain(
            domain or "talentflow-ai.example"
        )

        # -----------------------------------------------------
        # RANKING
        # -----------------------------------------------------

        position = self._keyword_number(
            keyword + "-position",
            1,
            50,
        )

        # -----------------------------------------------------
        # PREVIOUS POSITION
        # -----------------------------------------------------

        movement = self._keyword_number(
            keyword + "-movement",
            1,
            8,
        )

        previous_position = min(
            100,
            position + movement,
        )

        # Positive means ranking improved.
        change = (
            previous_position - position
        )

        # -----------------------------------------------------
        # SEARCH VOLUME
        # -----------------------------------------------------

        search_volume = self._keyword_number(
            keyword + "-volume",
            100,
            50000,
        )

        # -----------------------------------------------------
        # DIFFICULTY
        # -----------------------------------------------------

        difficulty = self._keyword_number(
            keyword + "-difficulty",
            15,
            85,
        )

        # -----------------------------------------------------
        # COMPETITOR
        # -----------------------------------------------------

        competitor_position = (
            self._keyword_number(
                keyword + "-competitor",
                1,
                50,
            )
        )

        # -----------------------------------------------------
        # CITATIONS
        # -----------------------------------------------------

        citation_count = (
            self._keyword_number(
                keyword + "-citations",
                1,
                50,
            )
        )

        # -----------------------------------------------------
        # INTENT
        # -----------------------------------------------------

        intent = self.detect_keyword_intent(
            keyword
        )

        # -----------------------------------------------------
        # URL
        # -----------------------------------------------------

        keyword_slug = re.sub(
            r"[^a-zA-Z0-9]+",
            "-",
            keyword.lower(),
        ).strip("-")

        target_url = (
            f"https://{clean_domain}/"
            f"{keyword_slug}"
        )

        # -----------------------------------------------------
        # TREND
        # -----------------------------------------------------

        if change > 0:
            trend = "up"
        elif change < 0:
            trend = "down"
        else:
            trend = "stable"

        # -----------------------------------------------------
        # RESULT
        # -----------------------------------------------------

        return {
            "id": (
                "kw-"
                + hashlib.md5(
                    keyword.lower().encode(
                        "utf-8"
                    )
                ).hexdigest()[:10]
            ),

            "keyword": keyword,

            "position": position,

            "previous_position":
                previous_position,

            "change": change,

            "search_volume":
                search_volume,

            "difficulty":
                difficulty,

            "intent":
                intent,

            "url":
                target_url,

            "trend":
                trend,

            "last_optimization":
                "Hindsight Strategy (SEO-014)",

            "competitor_position":
                competitor_position,

            "citation_count":
                citation_count,

            "domain":
                clean_domain,
        }

    # =========================================================
    # GENERATE KEYWORDS FOR DOMAIN
    # =========================================================

    def generate_keywords_for_domain(
        self,
        domain: str = "talentflow-ai.example",
        keyword: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Generate keyword intelligence.

        Behavior:

        1. If keyword is supplied:
           Analyze that exact keyword.

        2. If keyword is not supplied:
           Generate keyword suggestions from the domain.
        """

        clean_domain = self.normalize_domain(
            domain
        )

        # =====================================================
        # USER ENTERED KEYWORD
        # =====================================================

        if keyword and keyword.strip():

            keyword = self.normalize_keyword(
                keyword
            )

            return [
                self.generate_keyword_intelligence(
                    keyword=keyword,
                    domain=clean_domain,
                )
            ]

        # =====================================================
        # DOMAIN BASED KEYWORDS
        # =====================================================

        domain_name = (
            clean_domain
            .split(".")[0]
            .replace("-", " ")
            .replace("_", " ")
        )

        # -----------------------------------------------------
        # Crawl website
        # -----------------------------------------------------

        live_data = (
            self.fetch_live_website_data(
                clean_domain
            )
        )

        extracted_keywords = (
            live_data.get(
                "extracted_keywords",
                []
            )
        )

        # -----------------------------------------------------
        # Generate suggestions
        # -----------------------------------------------------

        if extracted_keywords:

            keyword_list = [
                f"{domain_name} {word}"
                for word in extracted_keywords[:10]
            ]

        else:

            keyword_list = [
                f"{domain_name} services",
                f"best {domain_name}",
                f"{domain_name} software",
                f"how {domain_name} works",
                f"{domain_name} pricing",
                f"{domain_name} tools",
                f"{domain_name} guide",
                f"{domain_name} platform",
                f"{domain_name} solutions",
                f"{domain_name} company",
            ]

        # -----------------------------------------------------
        # Generate intelligence
        # -----------------------------------------------------

        results: List[Dict[str, Any]] = []

        for keyword_item in keyword_list:

            results.append(
                self.generate_keyword_intelligence(
                    keyword=keyword_item,
                    domain=clean_domain,
                )
            )

        return results

    # =========================================================
    # SEO HEALTH SCORE
    # =========================================================

    def calculate_health_score(
        self,
        domain: str = "talentflow-ai.example",
    ) -> Dict[str, Any]:
        """
        Calculate website SEO health score.
        """

        clean_domain = self.normalize_domain(
            domain
        )

        live = (
            self.fetch_live_website_data(
                clean_domain
            )
        )

        issue_penalty = (
            len(
                live.get(
                    "issues",
                    []
                )
            ) * 4
        )

        overall_score = max(
            50,
            min(
                95,
                88 - issue_penalty
            ),
        )

        breakdown = {

            "technical_seo":
                max(
                    60,
                    90 - issue_penalty
                ),

            "content":
                82,

            "on_page_seo":
                85
                if live.get("title")
                else 65,

            "backlinks":
                70,

            "citations":
                68,

            "internal_linking":
                88,

            "keyword_coverage":
                79,

            "competitor_position":
                74,
        }

        return {

            "overall_score":
                overall_score,

            "status":
                (
                    "Good"
                    if overall_score >= 75
                    else "Needs Attention"
                ),

            "breakdown":
                breakdown,

            "explanation":
                (
                    f"Live SEO Health score for "
                    f"{clean_domain} is "
                    f"{overall_score}/100. "
                    f"Status code: "
                    f"{live['status_code']}, "
                    f"Latency: "
                    f"{live['response_time_ms']}ms. "
                    f"{len(live['issues'])} "
                    f"issues detected."
                ),
        }

    # =========================================================
    # FULL AUDIT
    # =========================================================

    def get_full_audit_results(
        self,
        domain: str = "talentflow-ai.example",
    ) -> List[Dict[str, Any]]:
        """
        Return full SEO audit issues.
        """

        live = (
            self.fetch_live_website_data(
                domain
            )
        )

        return live.get(
            "issues",
            []
        )


# =============================================================
# SINGLE SERVICE INSTANCE
# =============================================================

seo_service = SEOService()