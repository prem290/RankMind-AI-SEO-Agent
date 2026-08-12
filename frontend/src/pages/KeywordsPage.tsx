import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Globe,
  Loader2,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  Plus
} from 'lucide-react';

interface KeywordsProps {
  activeDomain?: string;
  onDomainChange?: (domain: string) => void;
}

export const KeywordsPage: React.FC<KeywordsProps> = ({
  activeDomain = 'talentflow-ai.example',
  onDomainChange
}) => {
  const [search, setSearch] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDomainKeywords = async (domain: string, kw?: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getKeywords(domain, kw);
      if (data && Array.isArray(data) && data.length > 0) {
        setKeywords(data);
      } else {
        setKeywords([]);
      }
    } catch (err) {
      console.error('Error fetching keywords:', err);
      setError('Unable to fetch keyword intelligence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainKeywords(activeDomain);
  }, [activeDomain]);

  const handleSearchKeyword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const keyword = search.trim();
    if (!keyword) {
      fetchDomainKeywords(activeDomain);
      return;
    }
    fetchDomainKeywords(activeDomain, keyword);
  };

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    const cleanDom = domainInput.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (onDomainChange) onDomainChange(cleanDom);
    setDomainInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchKeyword();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Keyword Intelligence & SERP Explorer
            <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {activeDomain}
            </span>
          </h2>
          <p className="text-slate-500 text-sm">
            Analyze search volume, difficulty, search intent, and ranking positions for any keyword or URL on <span className="font-bold text-indigo-700">{activeDomain}</span>.
          </p>
        </div>
      </div>

      {/* Dual Search Input Bar: Any URL / Any Keyword */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Track URL/Domain */}
        <form onSubmit={handleDomainSubmit} className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            Analyze Any Website URL / Domain
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. mysite.com or https://mysite.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shrink-0"
            >
              Set Domain
            </button>
          </div>
        </form>

        {/* Search Keyword */}
        <form onSubmit={handleSearchKeyword} className="glass-panel p-4 rounded-2xl border border-indigo-200 bg-indigo-50/30 shadow-xs space-y-2">
          <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            Search & Analyze Any Keyword
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. artificial intelligence, python tutorial, cloud hosting..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-white border border-indigo-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-1"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Suggested Keywords Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-1">Popular Keywords:</span>
        {[
          'AI resume analyzer',
          'ATS resume checker',
          'resume scoring AI',
          'machine learning tools',
          'SEO automation platform'
        ].map((kw) => (
          <button
            key={kw}
            onClick={() => {
              setSearch(kw);
              fetchDomainKeywords(activeDomain, kw);
            }}
            className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-2xs"
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-600" />
          Analyzing keyword intelligence for <span className="font-bold text-indigo-700">{search || activeDomain}</span>...
        </div>
      )}

      {/* Results Table */}
      {!loading && keywords.length > 0 && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs space-y-0">
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Tracked Keywords ({keywords.length})
              </h3>
            </div>
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  fetchDomainKeywords(activeDomain);
                }}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Target Keyword & URL</th>
                  <th className="py-3 px-4 font-bold text-center">SERP Rank</th>
                  <th className="py-3 px-4 font-bold text-center">Change</th>
                  <th className="py-3 px-4 font-bold text-right">Search Volume</th>
                  <th className="py-3 px-4 font-bold text-center">Difficulty</th>
                  <th className="py-3 px-4 font-bold">Search Intent</th>
                  <th className="py-3 px-4 font-bold">Hindsight Strategy</th>
                  <th className="py-3 px-4 font-bold text-center">Comp Rank</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium">
                {keywords.map((kw) => (
                  <tr key={kw.id || kw.keyword} className="hover:bg-slate-50/80 transition-colors">
                    {/* Keyword & Target URL */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        {kw.keyword}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                        {kw.url || `https://${activeDomain}`}
                      </span>
                    </td>

                    {/* SERP Position */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono text-xs ${
                        kw.position && kw.position <= 10
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        #{kw.position || 15}
                      </span>
                    </td>

                    {/* Change */}
                    <td className="py-3.5 px-4 text-center font-bold">
                      {kw.change > 0 ? (
                        <span className="text-emerald-600 flex items-center justify-center gap-0.5 font-bold">
                          <ArrowUp className="w-3.5 h-3.5" />
                          +{kw.change}
                        </span>
                      ) : kw.change < 0 ? (
                        <span className="text-rose-600 flex items-center justify-center gap-0.5 font-bold">
                          <ArrowDown className="w-3.5 h-3.5" />
                          {kw.change}
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center justify-center gap-0.5">
                          <Minus className="w-3.5 h-3.5" />
                          0
                        </span>
                      )}
                    </td>

                    {/* Volume */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-800 font-bold">
                      {kw.search_volume ? kw.search_volume.toLocaleString() : '12,400'}
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-semibold ${
                        (kw.difficulty || 50) >= 60
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {kw.difficulty || 54}/100
                      </span>
                    </td>

                    {/* Intent */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold">
                        {kw.intent || 'Commercial'}
                      </span>
                    </td>

                    {/* Hindsight Optimization */}
                    <td className="py-3.5 px-4">
                      <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-md inline-flex items-center gap-1 font-mono text-[11px] font-medium">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        {kw.last_optimization || 'Hindsight Strategy (SEO-014)'}
                      </span>
                    </td>

                    {/* Competitor Rank */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-semibold">
                      #{kw.competitor_position || 14}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && keywords.length === 0 && !error && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
          <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="font-bold text-slate-800">No keyword results found</h3>
          <p className="text-xs text-slate-500">Try searching for another keyword or entering a different URL.</p>
        </div>
      )}
    </div>
  );
};