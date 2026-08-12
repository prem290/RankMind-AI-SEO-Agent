# Hindsight Memory Integration & Data Schema

RankMind AI uses Hindsight as its central persistent memory bank (`rankmind-seo-memory`).

## Key Operations
1. `retain()`: Ingests SEO experiments, ranking events, competitor movements, and brand citations into durable memory.
2. `recall()`: Performs multi-strategy recall to fetch past experiments relevant to current ranking declines.
3. `reflect()`: Synthesizes site-specific strategies backed by empirical past performance.

## Memory Schemas
- **SEO Experiment**: Includes experiment ID, title, hypothesis, target keywords, changes made, before/after positions, traffic, CTR, and outcome.
- **Learned Pattern**: Contains distilled rule patterns (e.g., FAQ schema effectiveness, internal link clustering impact, title tag keyword stripping risks).
