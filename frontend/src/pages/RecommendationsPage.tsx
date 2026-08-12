import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Sparkles, Globe } from 'lucide-react';

interface RecommendationsProps {
  activeDomain?: string;
}

export const RecommendationsPage: React.FC<RecommendationsProps> = ({ activeDomain = 'talentflow-ai.example' }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [useMemory, setUseMemory] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [availableKeywords, setAvailableKeywords] = useState<any[]>([]);

  useEffect(() => {
    api.getKeywords(activeDomain).then((kws) => {
      setAvailableKeywords(kws);
      if (kws.length > 0) {
        setKeyword(kws[0].keyword);
      }
    });
  }, [activeDomain]);

  const fetchRecs = (mem: boolean, kw: string, dom: string) => {
    if (!kw) return;
    setLoading(true);
    api.getRecommendations(kw, mem, dom).then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (keyword) {
      fetchRecs(useMemory, keyword, activeDomain);
    }
  }, [useMemory, keyword, activeDomain]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            AI SEO Recommendation Engine
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {activeDomain}
            </span>
          </h2>
          <p className="text-slate-500 text-sm">
            What should you do next based on everything that has happened to <span className="font-bold text-indigo-700">{activeDomain}</span> before?
          </p>
        </div>

        {/* Memory Toggle */}
        <div className="flex items-center bg-white border border-slate-300 p-1 rounded-xl shadow-2xs">
          <button
            onClick={() => setUseMemory(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !useMemory ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Without Memory (Generic)
          </button>
          <button
            onClick={() => setUseMemory(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              useMemory ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            With Hindsight Memory
          </button>
        </div>
      </div>

      {/* Target Keyword Selector */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-4 shadow-xs">
        <span className="text-xs text-slate-500 font-semibold shrink-0">Analyze Target Keyword for {activeDomain}:</span>
        <select
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono font-medium"
        >
          {availableKeywords.map((k) => (
            <option key={k.id} value={k.keyword}>
              {k.keyword} (Rank #{k.position})
            </option>
          ))}
        </select>
      </div>

      {loading || !data ? (
        <div className="p-8 text-center text-slate-500 font-medium">Generating AI Recommendations for {activeDomain}...</div>
      ) : (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className={`p-5 rounded-2xl border ${
            data.with_hindsight_memory 
              ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950' 
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                {data.with_hindsight_memory ? '⚡ Hindsight Memory-Aware Context Active' : '⚠️ Generic Heuristic Mode'}
              </span>
              <span className="text-xs font-mono bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-600 font-medium">
                Consulted {data.memories_consulted_count} Memory Events
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed">{data.summary}</p>
          </div>

          {/* Recommendations List */}
          <div className="space-y-6">
            {data.recommendations.map((rec: any) => (
              <div key={rec.id} className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-mono text-indigo-600 font-bold">{rec.id}</span>
                    <h3 className="text-lg font-bold text-slate-900">{rec.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      rec.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {rec.priority} Priority
                    </span>
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-1 rounded font-mono font-medium">
                      Confidence: {rec.confidence}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Recommendation & Why */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-slate-500 mb-1">Recommendation</h4>
                      <p className="text-sm text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
                        {rec.recommendation}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase font-bold text-slate-500 mb-1">Why is this recommended?</h4>
                      <p className="text-xs text-indigo-950 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 leading-relaxed font-medium">
                        {rec.why}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Historical Evidence */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs uppercase font-bold text-indigo-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Historical Evidence Used
                    </h4>

                    {rec.historical_evidence && rec.historical_evidence.length > 0 ? (
                      <div className="space-y-3">
                        {rec.historical_evidence.map((item: any, idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-indigo-200 text-xs space-y-1 shadow-2xs">
                            <div className="flex justify-between font-mono font-bold text-indigo-700">
                              <span>{item.experiment_id}</span>
                              <span className="text-emerald-600 font-bold">{item.before_after}</span>
                            </div>
                            <p className="text-[11px] text-slate-800 font-semibold">{item.title}</p>
                            <p className="text-[10px] text-slate-500 italic">{item.relevance_reason}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-white rounded text-xs text-slate-400 italic border border-slate-200">
                        No historical memory enabled. Output relies on generic SEO heuristic rules.
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 text-xs flex justify-between text-slate-600 font-mono">
                      <span>Expected Impact:</span>
                      <span className="text-emerald-700 font-bold">{rec.expected_impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
