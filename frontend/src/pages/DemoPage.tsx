import React, { useState } from 'react';
import { api } from '../services/api';
import { Sparkles, CheckCircle2, RefreshCw, ArrowRight, Flame } from 'lucide-react';

export const DemoPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [resultWithoutMemory, setResultWithoutMemory] = useState<any>(null);
  const [resultWithMemory, setResultWithMemory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const runPart1 = async () => {
    setLoading(true);
    const res = await api.runDemoStep("Why is our keyword 'AI resume analyzer' declining from position 7 to 15?", false);
    setResultWithoutMemory(res);
    setActiveStep(1);
    setLoading(false);
  };

  const runPart2And4 = async () => {
    setLoading(true);
    const res = await api.runDemoStep("What optimization strategy should we execute next for 'AI resume analyzer' based on our site history?", true);
    setResultWithMemory(res);
    setActiveStep(4);
    setLoading(false);
  };

  const handleResetDemo = async () => {
    setLoading(true);
    const res = await api.resetDemo();
    setResetMessage(res.message);
    setResultWithoutMemory(null);
    setResultWithMemory(null);
    setActiveStep(1);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-indigo-200 bg-white space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-purple-600 animate-pulse" />
              <h2 className="text-2xl font-bold text-slate-900">60-Second Hackathon Judging Demonstration</h2>
            </div>
            <p className="text-slate-600 text-sm mt-1">
              Side-by-side proof comparing generic AI recommendations versus Hindsight memory-backed site-specific strategy.
            </p>
          </div>

          <button
            onClick={handleResetDemo}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-2 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Reset Demo & Pre-populate Hindsight
          </button>
        </div>

        {resetMessage && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 font-mono font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {resetMessage}
          </div>
        )}
      </div>

      {/* Step Trigger Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={runPart1}
          disabled={loading}
          className="p-5 rounded-2xl border bg-white hover:bg-slate-50 border-slate-200 text-left transition-all space-y-2 group shadow-2xs"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase">Part 1 Demo Trigger</span>
            <span className="text-xs text-slate-500 group-hover:text-slate-800 flex items-center gap-1 font-medium">
              Run Trigger <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-md font-bold text-slate-900">Ask Agent WITHOUT Memory</h3>
          <p className="text-xs text-slate-500 font-medium">
            Prompt: "Why is our AI resume analyzer keyword declining from position 7 to 15?"
          </p>
        </button>

        <button
          onClick={runPart2And4}
          disabled={loading}
          className="p-5 rounded-2xl border bg-indigo-50/70 hover:bg-indigo-100/70 border-indigo-200 text-left transition-all space-y-2 group shadow-sm"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-indigo-700 uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Part 4 Demo Trigger
            </span>
            <span className="text-xs text-indigo-700 font-bold flex items-center gap-1">
              Run Memory Recall <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-md font-bold text-slate-900">Ask Agent WITH Hindsight Memory</h3>
          <p className="text-xs text-indigo-900 font-medium">
            Recalls Experiment SEO-014 (+17 positions) to recommend site-specific FAQ + Internal link strategy.
          </p>
        </button>
      </div>

      {/* Side-by-Side Judging Comparison View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WITHOUT MEMORY PANEL */}
        <div className="glass-panel p-6 rounded-2xl border border-rose-200 bg-rose-50/20 space-y-4">
          <div className="flex justify-between items-center border-b border-rose-200 pb-3">
            <h3 className="text-md font-bold text-rose-800 flex items-center gap-2">
              WITHOUT MEMORY
            </h3>
            <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded font-bold">
              Generic Advice
            </span>
          </div>

          {resultWithoutMemory ? (
            <div className="space-y-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">User Question</span>
                <p className="font-semibold text-slate-900">"{resultWithoutMemory.user_query}"</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Agent Response</span>
                <p className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
                  {resultWithoutMemory.result.summary}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Historical Evidence Cited</span>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-500 italic font-medium">
                  No historical evidence cited. Generic SEO advice.
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs italic border border-dashed border-slate-300 rounded-xl">
              Click 'Ask Agent WITHOUT Memory' above to trigger generic AI response.
            </div>
          )}
        </div>

        {/* WITH HINDSIGHT MEMORY PANEL */}
        <div className="glass-panel-glow p-6 rounded-2xl border border-indigo-200 bg-white space-y-4">
          <div className="flex justify-between items-center border-b border-indigo-100 pb-3">
            <h3 className="text-md font-bold text-indigo-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              WITH HINDSIGHT MEMORY
            </h3>
            <span className="text-[10px] font-mono uppercase bg-indigo-100 text-indigo-800 border border-indigo-300 px-2 py-0.5 rounded font-bold">
              Site-Specific Strategy
            </span>
          </div>

          {resultWithMemory ? (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1 font-semibold">User Question</span>
                <p className="font-bold text-slate-900">"{resultWithMemory.user_query}"</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-indigo-700 font-bold uppercase block mb-1">Agent Response (Memory-Aware)</span>
                <p className="bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-200 text-indigo-950 leading-relaxed font-semibold">
                  {resultWithMemory.result.recommendations[0]?.recommendation}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block mb-1">Historical Empirical Evidence Cited</span>
                <div className="space-y-2">
                  {resultWithMemory.result.recommendations[0]?.historical_evidence.map((ev: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-indigo-200 text-xs space-y-1">
                      <div className="flex justify-between font-mono font-bold text-indigo-700">
                        <span>{ev.experiment_id}: {ev.title}</span>
                        <span className="text-emerald-700 font-bold">{ev.before_after}</span>
                      </div>
                      <p className="text-[11px] text-slate-800 font-semibold">{ev.relevance_reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs italic border border-dashed border-indigo-200 rounded-xl">
              Click 'Ask Agent WITH Hindsight Memory' above to trigger memory recall response.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
