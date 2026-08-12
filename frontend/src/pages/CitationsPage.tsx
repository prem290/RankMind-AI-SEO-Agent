import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CitationItem } from '../types';
import { Quote } from 'lucide-react';

interface CitationsPageProps {
  activeDomain?: string;
}

export const CitationsPage: React.FC<CitationsPageProps> = ({ activeDomain }) => {
  const [citations, setCitations] = useState<CitationItem[]>([]);
  const [visibilityData, setVisibilityData] = useState<any>(null);

  useEffect(() => {
    api.getCitations().then(setCitations);
    api.getCitationVisibility().then(setVisibilityData);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Citation Intelligence & AI Search Visibility
          <Quote className="w-5 h-5 text-indigo-600" />
        </h2>
        <p className="text-slate-500 text-sm">
          Track brand mentions, citations in LLM search experiences, and high-authority citation opportunities.
        </p>
      </div>

      {/* AI Visibility Scores */}
      {visibilityData && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-200 bg-indigo-50/30 grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(visibilityData.competitor_scores).map(([brand, score]: [string, any]) => (
            <div key={brand} className={`p-4 rounded-xl border ${
              brand.includes('TalentFlow') ? 'bg-white border-indigo-300 shadow-md' : 'bg-white border-slate-200'
            }`}>
              <span className="text-xs text-slate-500 block font-semibold">{brand}</span>
              <span className={`text-2xl font-black ${brand.includes('TalentFlow') ? 'text-indigo-700' : 'text-slate-800'}`}>
                {score}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-1 font-medium">AI Search Citation Visibility</span>
            </div>
          ))}
        </div>
      )}

      {/* Citations List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Tracked Brand & Competitor Citations</h3>
        <div className="space-y-3">
          {citations.map((item) => (
            <div key={item.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between gap-4 items-start">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    item.status === 'Cited' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-500">{item.source_type}</span>
                  <span className="text-xs font-mono font-semibold text-indigo-700">{item.source_domain}</span>
                </div>
                <h4 className="text-md font-bold text-slate-900">{item.source_title}</h4>
                <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 font-medium">{item.context}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-500 block font-medium">AI Search Presence</span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                  item.ai_search_visibility ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {item.ai_search_visibility ? 'VISIBLE IN LLM SERP' : 'NOT CITED YET'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
