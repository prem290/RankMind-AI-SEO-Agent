# RankMind AI 

> **AI SEO & Citation Intelligence Agent That Learns Using Hindsight**

RankMind AI is an AI SEO and Citation Intelligence agent built specifically for the **"AI Agents That Learn Using Hindsight"** hackathon. Unlike generic SEO chatbots that give repetitive heuristic advice, RankMind AI maintains a persistent memory of a website's optimization history, ranking shifts, competitor movements, and past experiment outcomes.

---

##  The Core Problem Solved

SEO is a long-term process. Marketing teams frequently execute changes but struggle to determine:
- *Which optimization caused a 15-position improvement?*
- *Which title change triggered a ranking drop?*
- *What strategies consistently work for specific topic clusters on this site?*

RankMind AI uses **Hindsight** by Vectorize as its persistent memory layer to continuously retain, recall, and reflect on historical SEO actions. When a ranking drop or keyword opportunity occurs, RankMind AI searches Hindsight memory, identifies similar past experiments, and delivers site-specific, evidence-backed recommendations citing empirical proof.

---

##  Key Modules & Features

1. **SEO Command Center Dashboard**: Displays Organic Traffic (124,850 visits), Avg Position (12.8), Top 10 Keywords (684), Featured Snippets (32), Citation Opportunities (87), and Memory Rec Success (78%).
2. **SEO Health Score (0–100)**: Explainable health breakdown across Technical, Content, On-Page, Backlinks, Citations, Internal Linking, and Keyword Coverage.
3. **Keyword Intelligence**: Detailed keyword management table with search volume, intent, position trends, and last Hindsight optimization.
4. **Ranking History & Action Correlation**: Interactive SERP position over time timeline correlating ranking movements with recorded SEO actions (using explicit correlation language).
5. **Technical SEO & Citation Audit**: Prioritized technical issues linked to empirical Hindsight evidence.
6. **AI SEO Recommendation Engine**: Generates site-specific recommendations backed by historical memory (cites past experiment IDs like `SEO-014` and `SEO-009`).
7. **SEO Experiment Tracker**: Full experiment lifecycle system. Completing an experiment automatically retains outcome, CTR shift, and position delta into Hindsight memory.
8. **Competitor Intelligence & Memory**: Monitors competitor publishing pushes and correlates competitor expansion with visibility impact over time.
9. **Citation Intelligence & AI Search Monitoring**: Tracks brand mentions, uncited opportunities, and calculates AI Search Citation Visibility Scores.
10. **Hindsight Memory Explorer**: Dedicated memory bank explorer (`rankmind-seo-memory`). Allows natural language memory queries (e.g. *"What SEO changes improved our AI resume keywords?"*).
11. **Learning Center ("What Has the Agent Learned?")**: Distills organizational SEO knowledge patterns (e.g. FAQ Schema effectiveness, Internal Link clustering, Title tag stripping risks).
12. **AI Strategy Report & 90-Day Roadmap**: Generates an executive report with a 3-phase 90-day execution roadmap.
13. **Before/After Memory Hackathon Demo Mode**: Interactive 4-part judging demonstration comparing generic AI responses without memory against site-specific recommendations with Hindsight memory.

---

## 🏗️ Architecture

```
rankmind-ai/
├── frontend/                     # React 18, TypeScript, Vite, Tailwind CSS, Recharts
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, Cards
│   │   ├── pages/                # All 12 product module screens & Demo Mode
│   │   ├── services/             # Axios API service
│   │   └── types/                # TypeScript interfaces
├── backend/                      # FastAPI Python Application
│   ├── app/
│   │   ├── main.py               # FastAPI entry point & CORS
│   │   ├── config.py             # App configuration & ENV variables
│   │   ├── api/                  # 13 REST API Routers
│   │   ├── models/               # SQLAlchemy Models
│   │   ├── schemas/              # Pydantic validation schemas
│   │   └── services/             # Core Services
│   │       ├── hindsight_service.py   # Primary Hindsight API abstraction (Retain, Recall, Reflect)
│   │       ├── llm_service.py         # Structured reasoning & Groq pipeline
│   │       ├── seo_service.py         # SEO score calculation & issue auditing
│   │       ├── ranking_service.py     # Ranking history & correlation analysis
│   │       ├── competitor_service.py  # Competitor tracking & gap analysis
│   │       ├── citation_service.py    # Citation monitoring & AI search visibility
│   │       └── learning_service.py    # Pattern extraction & knowledge distillation
├── data/                         # Rich synthetic case study datasets (TalentFlow AI)
├── docs/                         # Comprehensive architecture & demo documentation
└── tests/                        # Pytest automated test suite
```

---

##  Quick Start & Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Run FastAPI backend
uvicorn app.main:app --port 8000 --reload
```
*The backend automatically initializes SQLite database tables and pre-populates Hindsight memory with baseline synthetic experiments.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Running Automated Tests

```bash
# Run pytest backend suite
python -m pytest tests/
```

---

##  60-Second Hackathon Judging Flow

1. Open **Hackathon Demo Mode** in the sidebar.
2. Click **Ask Agent WITHOUT Memory**. Notice the AI provides generic, non-personalized SEO advice.
3. Observe **Experiment SEO-014** (FAQ content + internal linking) in Hindsight memory (Position 31 → 14).
4. Click **Ask Agent WITH Hindsight Memory**.
5. Observe the agent recall `SEO-014` and output:
   > *"Your current drop resembles Experiment SEO-014. In that experiment, adding FAQ schema and internal links produced a 17-position recovery. Audit internal links first."*
6. **Verdict**: *RankMind doesn't just analyze SEO. It remembers what worked.*

---

## 📄 License
MIT License.
