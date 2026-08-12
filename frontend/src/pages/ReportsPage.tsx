import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Sparkles, FileText, CheckCircle2, Globe } from 'lucide-react';

interface ReportsProps {
  activeDomain?: string;
}

export const ReportsPage: React.FC<ReportsProps> = ({ activeDomain = 'talentflow-ai.example' }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getStrategyReport().then((res) => {
      setReport(res);
      setLoading(false);
    });
  }, [activeDomain]);

  if (loading || !report) {
    return <div className="p-8 text-center text-slate-500 font-medium">Generating AI Strategy Report for {activeDomain}...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex justify-between items-center shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">AI SEO Strategy Report</h2>
            <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {activeDomain}
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            90-Day Execution Roadmap & Historical Evidence Summary for <span className="font-bold text-indigo-700">{activeDomain}</span>.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <FileText className="w-4 h-4" />
          Export Strategy PDF
        </button>
      </div>

      {/* Executive Summary */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
        <h3 className="text-md font-bold text-indigo-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Executive Strategy Summary
        </h3>
        <p className="text-sm text-indigo-950 leading-relaxed font-medium">
          Based on 6+ months of persistent Hindsight memory tracking for <span className="font-bold">{activeDomain}</span>, 
          the primary catalyst for rank recovery is structured FAQ JSON-LD injection paired with targeted internal link clusters. 
          Replicating historical strategy SEO-014 provides an estimated +15.4 average rank lift across top priority keywords.
        </p>
      </div>

      {/* Roadmap */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">90-Day Hindsight-Guided Execution Roadmap</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs font-mono font-bold text-indigo-700">PHASE 1 (DAYS 1-30)</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-semibold">Priority</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Technical & FAQ Schema Sprint</h4>
            <ul className="text-xs text-slate-700 space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                Inject JSON-LD FAQ schema across core landing pages.
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                Add 4-6 internal links from high-authority blog clusters.
              </li>
            </ul>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-700">PHASE 2 (DAYS 31-60)</span>
              <span className="text-[10px] bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded font-mono font-semibold">Content</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Content Deep-Dive Expansion</h4>
            <ul className="text-xs text-slate-700 space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                Expand top 5 informational guides from 1,200 to 2,500 words.
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                Include interactive comparison tables and expert quotes.
              </li>
            </ul>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs font-mono font-bold text-emerald-700">PHASE 3 (DAYS 61-90)</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-semibold">Citations</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">AI Search Citation Outreach</h4>
            <ul className="text-xs text-slate-700 space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                Pitch 10 un-cited high-authority tech directories.
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                Monitor LLM search citation share vs ResumeGenius AI.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
