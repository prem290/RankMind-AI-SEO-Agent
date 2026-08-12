import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Experiment } from '../types';
import { Plus, Sparkles, Check, Search, Globe, Filter, ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface ExperimentsPageProps {
  activeDomain?: string;
  onDomainChange?: (domain: string) => void;
}

export const ExperimentsPage: React.FC<ExperimentsPageProps> = ({
  activeDomain = 'talentflow-ai.example',
  onDomainChange
}) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [targetUrlInput, setTargetUrlInput] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [changesMade, setChangesMade] = useState('');

  // Complete Modal State
  const [completingExp, setCompletingExp] = useState<any | null>(null);
  const [afterPos, setAfterPos] = useState<string>('12');
  const [afterTraffic, setAfterTraffic] = useState<string>('5200');
  const [afterCtr, setAfterCtr] = useState<string>('4.8');
  const [outcomeStatus, setOutcomeStatus] = useState<string>('Successful');
  const [completionNotes, setCompletionNotes] = useState<string>('');

  const loadExperiments = async () => {
    setLoading(true);
    try {
      const res = await api.getExperiments();
      if (res && res.length > 0) {
        setExperiments(res);
      } else {
        setExperiments(getBaselineExperiments(activeDomain));
      }
    } catch (err) {
      console.error('Error fetching experiments:', err);
      setExperiments(getBaselineExperiments(activeDomain));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiments();
  }, [activeDomain]);

  const getBaselineExperiments = (domain: string): Experiment[] => [
    {
      id: 'SEO-014',
      title: 'FAQ Content & Internal Link Cluster Optimization',
      target_keyword: 'AI resume analyzer',
      changes_made: 'Added 6 structured FAQ items with JSON-LD Schema markup and created 5 internal contextual links.',
      status: 'Completed',
      before_metrics: { position: 31, ctr: 1.8 },
      after_metrics: { position: 14, ctr: 5.4 },
      traffic_delta_pct: 225
    },
    {
      id: 'SEO-009',
      title: 'Meta Title & Description Restructuring for Intent Alignment',
      target_keyword: 'ATS resume checker',
      changes_made: 'Updated meta title to include "Free Instant Scan & Score" and refreshed meta description.',
      status: 'Completed',
      before_metrics: { position: 36, ctr: 2.1 },
      after_metrics: { position: 16, ctr: 6.8 },
      traffic_delta_pct: 275
    },
    {
      id: 'SEO-021',
      title: 'Content Depth Expansion & Technical Comparison Table',
      target_keyword: 'resume scoring AI',
      changes_made: 'Expanded core landing page content from 800 to 2,500 words and added structured comparison table.',
      status: 'In Progress'
    }
  ];

  const handleCreateExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetKeyword.trim()) return;

    const domainUrl = targetUrlInput.trim() ? targetUrlInput.trim() : `https://${activeDomain}/${targetKeyword.toLowerCase().replace(/\s+/g, '-')}`;

    const payload = {
      title,
      target_keyword: targetKeyword,
      hypothesis: hypothesis || `Applying optimization to improve SERP position for ${targetKeyword}`,
      changes_made: changesMade || 'Updated page structure, schema markup, and content hierarchy',
      target_url: domainUrl
    };

    const newExp = await api.createExperiment(payload);
    
    // Add locally if not returned formatted
    const formattedExp: Experiment = {
      id: newExp.id || newExp.experiment_id || `SEO-${Date.now().toString().slice(-3)}`,
      title: newExp.title || title,
      target_keyword: newExp.target_keyword || targetKeyword,
      changes_made: newExp.changes_made || changesMade || 'Updated page structure',
      status: 'In Progress'
    };

    setExperiments([formattedExp, ...experiments]);
    setIsCreateOpen(false);
    setTitle('');
    setTargetKeyword('');
    setTargetUrlInput('');
    setHypothesis('');
    setChangesMade('');
  };

  const handleCompleteExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingExp) return;

    const payload = {
      end_date: new Date().toISOString().split('T')[0],
      after_position: parseFloat(afterPos) || 12,
      traffic_after: parseInt(afterTraffic) || 4500,
      ctr_after: parseFloat(afterCtr) || 5.0,
      outcome: outcomeStatus,
      confidence: 90.0,
      notes: completionNotes || `Completed on ${new Date().toISOString().split('T')[0]} with outcome ${outcomeStatus}`
    };

    await api.completeExperiment(completingExp.id || completingExp.experiment_id, payload);

    // Update local state
    const updated = experiments.map(exp => {
      if (exp.id === completingExp.id) {
        const beforePos = exp.before_metrics?.position || 30;
        const newPos = parseFloat(afterPos) || 12;
        const delta = Math.round(((beforePos - newPos) / beforePos) * 100);
        return {
          ...exp,
          status: outcomeStatus === 'Failed' ? 'Failed' : 'Completed',
          before_metrics: exp.before_metrics || { position: 30, ctr: 2.0 },
          after_metrics: { position: newPos, ctr: parseFloat(afterCtr) || 5.0 },
          traffic_delta_pct: delta > 0 ? delta * 3 : 45
        };
      }
      return exp;
    });

    setExperiments(updated);
    setCompletingExp(null);
  };

  // Filtered experiments
  const filtered = experiments.filter(exp => {
    const matchesSearch = !searchQuery.trim() || 
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      exp.target_keyword.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (exp.id && exp.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && exp.status === 'Completed') ||
      (filterStatus === 'in_progress' && (exp.status === 'In Progress' || exp.status === 'Active')) ||
      (filterStatus === 'failed' && exp.status === 'Failed');

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
        <p>Loading SEO Experiments for {activeDomain}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            SEO Experiment Tracker
            <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {activeDomain}
            </span>
          </h2>
          <p className="text-slate-500 text-sm">
            Track completed and active SEO experiments. Outcomes are automatically saved into persistent Hindsight memory.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Experiment
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row justify-between items-center gap-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search experiments by keyword, title, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-semibold shrink-0">Filter Status:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {['all', 'completed', 'in_progress', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                  filterStatus === status
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experiments Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((exp) => (
            <div key={exp.id} className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-mono text-indigo-600 font-bold">{exp.id}</span>
                    <h3 className="text-md font-bold text-slate-900 leading-snug">{exp.title}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase shrink-0 font-mono ${
                    exp.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    exp.status === 'Failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {exp.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-semibold">Target Keyword:</span>
                    <span className="font-mono font-bold text-indigo-700">{exp.target_keyword}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 block font-semibold mb-1">Changes Executed:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">{exp.changes_made}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Box */}
              <div>
                {exp.status === 'Completed' && exp.before_metrics && exp.after_metrics ? (
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-2">
                    <div className="flex justify-between text-xs font-mono font-bold text-indigo-700">
                      <span>SERP Position: #{exp.before_metrics.position} → #{exp.after_metrics.position}</span>
                      <span className="text-emerald-600 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        +{exp.traffic_delta_pct}% Visits
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono flex items-center justify-between pt-2 border-t border-indigo-100">
                      <span>CTR Shift: {exp.before_metrics.ctr}% → {exp.after_metrics.ctr}%</span>
                      <span className="text-indigo-700 flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Hindsight Indexed
                      </span>
                    </div>
                  </div>
                ) : exp.status === 'Failed' ? (
                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    Experiment outcome did not achieve positive SERP movement. Lesson stored in Hindsight memory.
                  </div>
                ) : (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                    <div className="text-xs text-amber-900 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                      In progress. Collecting post-launch SERP baseline...
                    </div>
                    <button
                      onClick={() => setCompletingExp(exp)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shrink-0 shadow-xs"
                    >
                      Complete Exp
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-indigo-400 mb-2" />
          <h3 className="font-bold text-slate-800">No Experiments Found</h3>
          <p className="text-sm text-slate-500">Create a new experiment above to track SEO changes for {activeDomain}.</p>
        </div>
      )}

      {/* Create Experiment Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create New SEO Experiment</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateExperiment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Experiment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Added FAQ JSON-LD Schema & 4 Internal Links"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Keyword</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SEO analyzer"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Domain / URL</label>
                  <input
                    type="text"
                    placeholder={`https://${activeDomain}/target`}
                    value={targetUrlInput}
                    onChange={(e) => setTargetUrlInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Hypothesis</label>
                <input
                  type="text"
                  placeholder="e.g. FAQ schema will earn rich snippet and boost ranking by +10 positions."
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Changes Made / Action Details</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Injected 4 internal links from high authority blog posts and added structured FAQ JSON-LD markup."
                  value={changesMade}
                  onChange={(e) => setChangesMade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-1 shadow-md">
                  <Check className="w-4 h-4" /> Save Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Experiment Modal */}
      {completingExp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Log Post-Launch Experiment Results</h3>
              <button onClick={() => setCompletingExp(null)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCompleteExperiment} className="space-y-3 text-xs">
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                <span className="text-[10px] font-mono text-indigo-700 uppercase font-bold block">{completingExp.id}</span>
                <p className="font-bold text-slate-900 text-sm">{completingExp.title}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">After SERP Rank</label>
                  <input
                    type="number"
                    required
                    value={afterPos}
                    onChange={(e) => setAfterPos(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">After Traffic</label>
                  <input
                    type="number"
                    required
                    value={afterTraffic}
                    onChange={(e) => setAfterTraffic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">After CTR (%)</label>
                  <input
                    type="text"
                    required
                    value={afterCtr}
                    onChange={(e) => setAfterCtr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Outcome Status</label>
                <select
                  value={outcomeStatus}
                  onChange={(e) => setOutcomeStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="Successful">Successful</option>
                  <option value="Completed">Completed (Neutral)</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Hindsight Indexing Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Significant position lift achieved within 4 weeks."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-sm font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCompletingExp(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-4 h-4" /> Index in Hindsight Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
