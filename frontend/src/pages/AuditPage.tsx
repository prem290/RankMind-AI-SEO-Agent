import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AuditProps {
  activeDomain?: string;
}

export const AuditPage: React.FC<AuditProps> = ({ activeDomain = 'talentflow-ai.example' }) => {
  const [audit, setAudit] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStatus, setAuditStatus] = useState<string | null>(null);

  const fetchAudit = (dom: string) => {
    api.getAudit(dom).then(setAudit);
  };

  useEffect(() => {
    fetchAudit(activeDomain);
  }, [activeDomain]);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditStatus(`Crawling technical SEO baseline and sitemaps for ${activeDomain}...`);
    await api.runAudit(activeDomain);
    setTimeout(() => {
      fetchAudit(activeDomain);
      setIsAuditing(false);
      setAuditStatus(`Technical SEO audit complete for ${activeDomain}. 4 prioritized issues found.`);
    }, 1000);
  };

  if (!audit) {
    return <div className="p-8 text-center text-slate-500">Loading Technical SEO Audit...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Technical SEO & Citation Audit</h2>
          <p className="text-slate-500 text-sm">
            Prioritized issues for <span className="font-bold text-indigo-700">{activeDomain}</span> backed by historical Hindsight experiment evidence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            Run Technical Audit
          </button>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-right shadow-2xs">
            <span className="text-xs text-slate-500 block font-medium">Issues Detected</span>
            <span className="text-xl font-black text-amber-600">{audit.issues_count} Audit Items</span>
          </div>
        </div>
      </div>

      {auditStatus && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 font-mono font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {auditStatus}
        </div>
      )}

      <div className="space-y-4">
        {audit.issues.map((item: any) => (
          <div key={item.id} className="glass-panel p-5 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row justify-between gap-4 items-start shadow-xs">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                  item.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  item.severity === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {item.severity} Priority
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500">{item.category}</span>
                <span className="text-xs text-slate-400">• {item.affected_pages} Page(s) Affected</span>
              </div>
              <h3 className="text-md font-bold text-slate-900">{item.issue}</h3>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-medium">
                <strong>Recommended Action:</strong> {item.recommendation}
              </p>
            </div>

            <div className="w-full md:w-64 bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl shrink-0 text-right space-y-2">
              <div className="text-xs text-slate-500 font-medium">Impact Score</div>
              <div className="text-2xl font-black text-indigo-700">{item.impact_score}/100</div>
              {item.hindsight_evidence_id && (
                <div className="text-[11px] text-indigo-700 flex items-center justify-end gap-1 font-mono font-semibold">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Evidence: {item.hindsight_evidence_id}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
