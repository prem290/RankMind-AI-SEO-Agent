export interface Website {
  id: string;
  name: string;
  domain: string;
  created_at: string;
}

export interface Keyword {
  id: string;
  keyword: string;
  position: number;
  previous_position: number;
  change: number;
  search_volume: number;
  difficulty: number;
  intent: string;
  url: string;
  trend: string;
  last_optimization: string;
  competitor_position: number;
  citation_count: number;
}

export interface Experiment {
  id: string;
  experiment_id?: string;
  title: string;
  target_keyword?: string;
  target_keywords?: string[];
  hypothesis?: string;
  changes_made: string;
  target_url?: string;
  status: string;
  start_date?: string;
  completion_date?: string;
  before_metrics?: {
    position: number;
    ctr: number;
    impressions?: number;
  };
  after_metrics?: {
    position: number;
    ctr: number;
    impressions?: number;
  };
  traffic_delta_pct?: number;
  hindsight_relevance_score?: number;
}

export interface Competitor {
  id: string;
  name: string;
  domain: string;
  visibility_score: number;
  avg_position?: number;
  ranking_keywords?: number;
  overlapping_keywords?: number;
  recent_pages_published?: number;
  citation_count?: number;
  hindsight_impact_summary?: string;
}

export interface Citation {
  id: string;
  platform?: string;
  url?: string;
  citation_type?: string;
  authority_score?: number;
  verified?: boolean;
  last_checked?: string;
  status?: string;
  source_type?: string;
  source_domain?: string;
  source_title?: string;
  context?: string;
  ai_search_visibility?: boolean;
}

export type CitationItem = Citation;

export interface LearnedPattern {
  id: string;
  pattern_title?: string;
  pattern_name?: string;
  category: string;
  confidence_score?: number;
  confidence?: number;
  sample_size?: number;
  average_rank_lift?: number;
  average_improvement?: string;
  rule_description?: string;
  summary?: string;
  insight?: string;
  evidence_count?: number;
  evidence_experiment_ids?: string[];
  successful_experiments?: string[];
  failed_experiments?: string[];
}
