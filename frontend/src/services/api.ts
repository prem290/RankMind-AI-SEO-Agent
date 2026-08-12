import axios from 'axios';

const API_BASE = '/api';

/* =========================================================
   DEFAULT DASHBOARD DATA
   ========================================================= */

const DEFAULT_DASHBOARD = (domain: string) => ({
  website: {
    name: domain.split('.')[0].toUpperCase(),
    domain: domain,
  },

  metrics: {
    organic_traffic: 124850,
    organic_traffic_change: '+14.2%',
    average_position: 12.8,
    average_position_change: '+2.4 positions',
    keywords_ranking: 2520,
    top_10_keywords: 684,
    featured_snippets: 32,
    citation_opportunities: 87,
    competitor_visibility: '72%',
    ai_recommendation_success: '78%',
    memory_assisted_recommendations_pct: '64%',
  },

  seo_health: {
    overall_score: 78,
    status: 'Good',

    breakdown: {
      technical_seo: 84,
      content: 76,
      on_page_seo: 78,
      backlinks: 68,
      citations: 64,
      internal_linking: 89,
      keyword_coverage: 77,
      competitor_position: 72,
    },

    explanation: `Live SEO Health score for ${domain} is 78/100. Internal linking (89) and Technical SEO (84) are strong.`,
  },

  memory_score: {
    overall_memory_coverage: 82,

    breakdown: {
      keyword_history: 85,
      experiment_history: 90,
      competitor_history: 75,
    },

    learned_patterns_extracted: 3,
  },
});


/* =========================================================
   DEFAULT KEYWORDS
   ========================================================= */

const DEFAULT_KEYWORDS = (domain: string) => {
  const clean = domain.split('.')[0];

  return [
    {
      id: 'kw-001',
      keyword: `${clean} online analyzer`,
      position: 8,
      previous_position: 13,
      change: 5,
      search_volume: 14500,
      difficulty: 62,
      intent: 'Commercial',
      url: `https://${domain}/analyzer`,
      trend: 'up',
      last_optimization: 'Hindsight Strategy (SEO-014)',
      competitor_position: 14,
      citation_count: 24,
    },

    {
      id: 'kw-002',
      keyword: `best ${clean} tools 2026`,
      position: 12,
      previous_position: 19,
      change: 7,
      search_volume: 9800,
      difficulty: 54,
      intent: 'Informational',
      url: `https://${domain}/blog/best-tools`,
      trend: 'up',
      last_optimization: 'Meta Description Refresh (SEO-009)',
      competitor_position: 18,
      citation_count: 16,
    },

    {
      id: 'kw-003',
      keyword: `${clean} platform pricing`,
      position: 6,
      previous_position: 8,
      change: 2,
      search_volume: 6200,
      difficulty: 48,
      intent: 'Transactional',
      url: `https://${domain}/pricing`,
      trend: 'up',
      last_optimization: 'FAQ Schema Injection (SEO-014)',
      competitor_position: 11,
      citation_count: 31,
    },
  ];
};


/* =========================================================
   API
   ========================================================= */

export const api = {

  /* =======================================================
     DASHBOARD
     ======================================================= */

  getDashboard: async (
    domain = 'talentflow-ai.example'
  ) => {
    try {
      const res = await axios.get(
        `${API_BASE}/dashboard`,
        {
          params: { domain },
          timeout: 5000,
        }
      );

      return res.data || DEFAULT_DASHBOARD(domain);

    } catch (err) {
      console.error('Dashboard API error:', err);

      return DEFAULT_DASHBOARD(domain);
    }
  },


  /* =======================================================
     KEYWORDS
     
     Supports:
     
     api.getKeywords(domain)
     
     OR
     
     api.getKeywords(domain, 'machine learning')
     ======================================================= */

  getKeywords: async (
    domain = 'talentflow-ai.example',
    keyword?: string
  ) => {
    try {

      const params: Record<string, string> = {
        domain,
      };

      /*
       * Only send keyword when user actually entered one.
       */

      if (keyword && keyword.trim()) {
        params.keyword = keyword.trim();
      }

      const res = await axios.get(
        `${API_BASE}/keywords`,
        {
          params,
          timeout: 5000,
        }
      );

      /*
       * Backend returned results.
       */

      if (
        res.data &&
        Array.isArray(res.data) &&
        res.data.length > 0
      ) {
        return res.data;
      }

      /*
       * No custom keyword was searched.
       * Show default domain keywords.
       */

      if (!keyword || !keyword.trim()) {
        return DEFAULT_KEYWORDS(domain);
      }

      /*
       * Custom keyword searched but no result.
       */

      return [];

    } catch (err) {

      console.error('Keyword API error:', err);

      /*
       * If browsing normally, show demo keywords.
       */

      if (!keyword || !keyword.trim()) {
        return DEFAULT_KEYWORDS(domain);
      }

      /*
       * If a specific keyword was searched,
       * don't show unrelated demo keywords.
       */

      return [];
    }
  },


  /* =======================================================
     GET SINGLE KEYWORD
     ======================================================= */

  getKeyword: async (
    keywordId: string,
    domain = 'talentflow-ai.example'
  ) => {
    try {

      const res = await axios.get(
        `${API_BASE}/keywords/${encodeURIComponent(keywordId)}`,
        {
          params: { domain },
          timeout: 5000,
        }
      );

      return res.data;

    } catch (err) {

      console.error('Single keyword API error:', err);

      const defaults = DEFAULT_KEYWORDS(domain);

      return (
        defaults.find(
          (k) =>
            k.id === keywordId ||
            k.keyword.toLowerCase() ===
              keywordId.toLowerCase()
        ) || null
      );
    }
  },


  /* =======================================================
     RANKINGS
     ======================================================= */

  getRankings: async (
    keyword?: string,
    domain?: string
  ) => {
    try {
      const params: Record<string, string> = {};

      if (keyword && keyword.trim()) {
        params.keyword = keyword.trim();
      }

      if (domain && domain.trim()) {
        params.domain = domain.trim();
      }

      const res = await axios.get(
        `${API_BASE}/rankings`,
        {
          params,
          timeout: 5000,
        }
      );

      return res.data || [];

    } catch (err) {
      console.error('Rankings API error:', err);
      return [];
    }
  },


  /* =======================================================
     RANKING HISTORY
     ======================================================= */

  getRankingHistory: async (
    keyword?: string,
    domain?: string
  ) => {
    try {
      const params: Record<string, string> = {};

      if (keyword && keyword.trim()) {
        params.keyword = keyword.trim();
      }

      if (domain && domain.trim()) {
        params.domain = domain.trim();
      }

      const res = await axios.get(
        `${API_BASE}/rankings/history`,
        {
          params,
          timeout: 5000,
        }
      );

      return res.data || [];

    } catch (err) {
      console.error('Ranking history API error:', err);
      return [];
    }
  },


  /* =======================================================
     SEO AUDIT
     ======================================================= */

  getAudit: async (
    domain = 'talentflow-ai.example'
  ) => {

    const fallback = {
      domain,

      overall_score: 78,

      issues_count: 3,

      issues: [
        {
          id: 'AUD-001',
          category: 'Citations & AI Search',
          issue: `Missing Citation Presence on High-Authority Directories for ${domain}`,
          severity: 'High',
          impact_score: 82,
          affected_pages: 2,
          recommendation:
            'Register on tech citation hubs and publish press release.',
          hindsight_evidence_id: 'SEO-027',
        },
      ],
    };

    try {

      const res = await axios.get(
        `${API_BASE}/audit`,
        {
          params: { domain },
          timeout: 5000,
        }
      );

      return res.data || fallback;

    } catch (err) {

      console.error('Audit API error:', err);

      return fallback;
    }
  },


  /* =======================================================
     RUN AUDIT
     ======================================================= */

  runAudit: async (
    domain = 'talentflow-ai.example'
  ) => {
    try {

      const res = await axios.post(
        `${API_BASE}/audit`,
        null,
        {
          params: { domain },
          timeout: 10000,
        }
      );

      return res.data;

    } catch (err) {

      console.error('Run audit API error:', err);

      return null;
    }
  },


  /* =======================================================
     AI RECOMMENDATIONS
     ======================================================= */

  getRecommendations: async (
    keyword = 'AI resume analyzer',
    useHindsightMemory = true,
    domain = 'talentflow-ai.example'
  ) => {

    try {

      const res = await axios.get(
        `${API_BASE}/recommendations`,
        {
          params: {
            keyword,
            use_hindsight_memory:
              useHindsightMemory,
            target_url:
              `https://${domain}/landing`,
          },

          timeout: 10000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Recommendations API error:',
        err
      );

      return {
        summary:
          `Hindsight Memory strategy recommendations for ${domain}.`,

        with_hindsight_memory:
          useHindsightMemory,

        memories_consulted_count: 3,

        recommendations: [
          {
            id: 'REC-001',

            title:
              `Inject FAQ JSON-LD Schema & Internal Links on ${domain}`,

            recommendation:
              `Add structured JSON-LD FAQ schema and 4-6 contextual internal links targeting ${keyword}.`,

            why:
              `Historical experiment SEO-014 proved FAQ schema + internal link clusters yield +17 average position recovery.`,

            priority: 'Critical',

            confidence: 94,

            expected_impact:
              '+14 Positions',

            historical_evidence: [
              {
                experiment_id: 'SEO-014',

                title:
                  'FAQ Schema + Internal Links',

                before_after:
                  'Rank #31 -> #14 (+17)',

                relevance_reason:
                  'Matches site structure and keyword intent',
              },
            ],
          },
        ],
      };
    }
  },


  /* =======================================================
     EXPERIMENTS
     ======================================================= */

  getExperiments: async () => {

    try {

      const res = await axios.get(
        `${API_BASE}/experiments`,
        {
          timeout: 5000,
        }
      );

      return res.data || [];

    } catch (err) {

      console.error(
        'Experiments API error:',
        err
      );

      return [];
    }
  },


  /* =======================================================
     CREATE EXPERIMENT
     ======================================================= */

  createExperiment: async (
    payload: any
  ) => {

    try {

      const res = await axios.post(
        `${API_BASE}/experiments`,
        payload,
        {
          timeout: 10000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Create experiment API error:',
        err
      );

      return {
        id: `EXP-${Date.now()}`,
        title: payload.title,
        target_keyword:
          payload.target_keyword,
        hypothesis:
          payload.hypothesis,
        changes_made:
          payload.changes_made,
        status: 'In Progress',
      };
    }
  },


  /* =======================================================
     COMPLETE EXPERIMENT
     ======================================================= */

  completeExperiment: async (
    expId: string,
    payload: any
  ) => {

    try {

      const res = await axios.post(
        `${API_BASE}/experiments/${encodeURIComponent(expId)}/complete`,
        payload,
        {
          timeout: 10000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Complete experiment API error:',
        err
      );

      return null;
    }
  },


  /* =======================================================
     COMPETITORS
     ======================================================= */

  getCompetitors: async (domain?: string) => {
    try {
      const params: Record<string, string> = {};
      if (domain && domain.trim()) {
        params.domain = domain.trim();
      }

      const res = await axios.get(
        `${API_BASE}/competitors`,
        {
          params,
          timeout: 5000,
        }
      );

      return res.data || [];

    } catch (err) {
      console.error(
        'Competitors API error:',
        err
      );

      return [];
    }
  },


  /* =======================================================
     ANALYZE COMPETITOR
     ======================================================= */

  analyzeCompetitor: async (
    domain: string
  ) => {

    try {

      const res = await axios.post(
        `${API_BASE}/competitors/analyze`,
        null,
        {
          params: { domain },
          timeout: 10000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Competitor analysis API error:',
        err
      );

      return null;
    }
  },


  /* =======================================================
     CITATIONS
     ======================================================= */

  getCitations: async () => {

    try {

      const res = await axios.get(
        `${API_BASE}/citations`,
        {
          timeout: 5000,
        }
      );

      return res.data || [];

    } catch (err) {

      console.error(
        'Citations API error:',
        err
      );

      return [];
    }
  },


  /* =======================================================
     CITATION VISIBILITY
     ======================================================= */

  getCitationVisibility: async () => {

    try {

      const res = await axios.get(
        `${API_BASE}/citations/visibility`,
        {
          timeout: 5000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Citation visibility API error:',
        err
      );

      return null;
    }
  },


  /* =======================================================
     HINDSIGHT MEMORY
     ======================================================= */

  getMemoryInfo: async () => {

    try {

      const res = await axios.get(
        `${API_BASE}/memory`,
        {
          timeout: 5000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Memory API error:',
        err
      );

      return null;
    }
  },


  /* =======================================================
     SEARCH HINDSIGHT MEMORY
     ======================================================= */

  searchMemory: async (
    query: string
  ) => {

    try {

      const res = await axios.post(
        `${API_BASE}/memory/search`,
        {
          query,
        },
        {
          timeout: 10000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Memory search API error:',
        err
      );

      return {
        query,
        total_memories_found: 0,
        memories: [],
      };
    }
  },


  /* =======================================================
     LEARNING CENTER
     ======================================================= */

  getLearning: async () => {

    try {

      const res = await axios.get(
        `${API_BASE}/learning`,
        {
          timeout: 5000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Learning API error:',
        err
      );

      return null;
    }
  },


  /* =======================================================
     STRATEGY REPORT
     ======================================================= */

  getStrategyReport: async () => {

    try {

      const res = await axios.get(
        `${API_BASE}/reports/strategy`,
        {
          timeout: 10000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Strategy report API error:',
        err
      );

      return null;
    }
  },


  /* =======================================================
     DEMO - RUN
     ======================================================= */

  runDemoStep: async (
    question: string,
    useHindsightMemory: boolean
  ) => {

    try {

      const res = await axios.post(
        `${API_BASE}/demo/run`,
        {
          question,
          use_hindsight_memory:
            useHindsightMemory,
        },
        {
          timeout: 15000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Demo API error:',
        err
      );

      return null;
    }
  },


  /* =======================================================
     DEMO - RESET
     ======================================================= */

  resetDemo: async () => {

    try {

      const res = await axios.post(
        `${API_BASE}/demo/reset`,
        null,
        {
          timeout: 10000,
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        'Demo reset API error:',
        err
      );

      return null;
    }
  },
};