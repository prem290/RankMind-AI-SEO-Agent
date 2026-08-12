# RankMind AI — System Architecture

RankMind AI is built as a multi-tier agentic system centered around **Hindsight** by Vectorize.

```
[ React / TypeScript Frontend ]
             │ HTTP / REST
             ▼
[ FastAPI Backend (Python) ]
  ├── SEO Health & Audit Engine
  ├── Ranking Correlation Engine
  ├── Competitor Intelligence Service
  ├── Citation & AI Search Visibility Service
  ├── Experiment Tracker & Learning Distiller
  └── LLM Structured Reasoning Engine
             │
             ▼
[ Hindsight Persistent Memory Layer ]
  ├── Retain (Experiments, Ranking Events, Competitors, Citations)
  ├── Recall (Multi-strategy semantic/keyword/temporal search)
  └── Reflect (Strategy synthesis & empirical knowledge distillation)
```

## Storage Strategy
- **Application State**: SQLite / PostgreSQL stores relational entities (Websites, Keywords, Experiments metadata).
- **Persistent AI Memory**: Hindsight stores durable, structured SEO history, experimental outcomes (+17 position gains vs drops), and organizational knowledge patterns across time.
