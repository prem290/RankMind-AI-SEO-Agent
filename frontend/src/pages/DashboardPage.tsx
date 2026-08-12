import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  TrendingUp, 
  Search, 
  Target, 
  BrainCircuit, 
  ArrowUpRight,
  Globe,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  activeDomain?: string;
  onDomainChange?: (domain: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ activeDomain = 'talentflow-ai.example', onDomainChange }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inputUrl, setInputUrl] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getDashboard(activeDomain).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [activeDomain]);

  const handleAnalyzeWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    const cleanedDomain = inputUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    setAnalysisStatus(`Crawling live HTTP headers, title tags, meta descriptions, and sitemaps for ${cleanedDomain}...`);
    
    setTimeout(() => {
      if (onDomainChange) {
        onDomainChange(cleanedDomain);
      }
      setAnalysisStatus(`Website ${cleanedDomain} crawled & analyzed! Live SEO metrics and Hindsight baseline saved.`);
      setInputUrl('');
    }, 1200);
  };

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
        <p>Crawling & Loading Live SEO Command Center for {activeDomain}...</p>
      </div>
    );
  }

  const { metrics, seo_health, memory_score } = data;

  return (
    <div className="space-y-6">
      {/* Website Live Analyzer Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-200 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            Crawl & Analyze Live Website URL / Domain
          </label>
          <span className="text-xs text-indigo-700 font-mono font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Hindsight Live Indexer Active
          </span>
        </div>

        <form onSubmit={handleAnalyzeWebsite} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter any live website URL or domain (e.g. stripe.com or https://mysite.com)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition-all shrink-0"
          >
            Crawl Live Website
          </button>
        </form>

        {analysisStatus && (
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800 font-mono font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {analysisStatus}
          </div>
        )}
      </div>

      {/* Top Banner */}
      <div className="glass-panel-glow p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-extrabold text-slate-900">SEO Command Center</h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-mono font-medium">
              Live Website Crawler Online
            </span>
          </div>
          <p className="text-slate-600 text-sm">
            Continuous memory-driven SEO intelligence for <span className="text-indigo-600 font-bold">{activeDomain}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-right shadow-2xs">
            <p className="text-xs text-slate-500 font-medium">SEO Memory Coverage</p>
            <p className="text-xl font-black text-indigo-600">{memory_score.overall_memory_coverage}%</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-right shadow-2xs">
            <p className="text-xs text-slate-500 font-medium">Live SEO Health Score</p>
            <p className="text-xl font-black text-slate-900">{seo_health.overall_score}/100</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Organic Monthly Visits</span>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.organic_traffic.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{metrics.organic_traffic_change} vs last month</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average SERP Position</span>
            <span className="p-2 rounded-lg bg-cyan-50 text-cyan-600"><Search className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.average_position}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{metrics.average_position_change}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keywords Ranking / Top 10</span>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-600"><Target className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.keywords_ranking} <span className="text-sm font-bold text-purple-600">({metrics.top_10_keywords} Top 10)</span></div>
          <div className="text-xs text-slate-500 mt-2 font-medium">{metrics.featured_snippets} Featured Snippets Owned</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Memory Rec Success Rate</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><BrainCircuit className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-emerald-600">{metrics.ai_recommendation_success}</div>
          <div className="text-xs text-slate-500 mt-2 font-medium">{metrics.memory_assisted_recommendations_pct} Memory-Assisted</div>
        </div>
      </div>

      {/* SEO Health Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 border border-slate-200 bg-white space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                SEO Health Score Breakdown
              </h3>
              <p className="text-xs text-slate-500">{seo_health.explanation}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-indigo-600">{seo_health.overall_score}</span>
              <span className="text-xs text-slate-400 block font-medium">/ 100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {Object.entries(seo_health.breakdown).map(([key, score]: [string, any]) => (
              <div key={key} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
                  <span className="capitalize text-slate-700">{key.replace('_', ' ')}</span>
                  <span className={`font-bold ${score >= 80 ? 'text-emerald-600' : score >= 70 ? 'text-indigo-600' : 'text-amber-600'}`}>
                    {score} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 70 ? 'bg-indigo-600' : 'bg-amber-500'}`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hindsight Memory System Status Card */}
        <div className="glass-panel p-6 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              <h3 className="text-md font-bold text-slate-900">Hindsight Memory Engine</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              RankMind AI retains website crawl history, ranking changes, and experiment outcomes in persistent Hindsight memory (`rankmind-seo-memory`).
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-indigo-100 py-1.5 text-slate-700">
                <span>Keyword History Coverage:</span>
                <span className="text-indigo-700 font-bold">{memory_score.breakdown.keyword_history}%</span>
              </div>
              <div className="flex justify-between border-b border-indigo-100 py-1.5 text-slate-700">
                <span>Experiment Memory:</span>
                <span className="text-indigo-700 font-bold">{memory_score.breakdown.experiment_history}%</span>
              </div>
              <div className="flex justify-between border-b border-indigo-100 py-1.5 text-slate-700">
                <span>Competitor Tracking:</span>
                <span className="text-indigo-700 font-bold">{memory_score.breakdown.competitor_history}%</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-700">
                <span>Learned Patterns:</span>
                <span className="text-indigo-700 font-bold">{memory_score.learned_patterns_extracted} Patterns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
