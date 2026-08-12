import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LearnedPattern } from '../types';
import { GraduationCap } from 'lucide-react';

export const LearningPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getLearning().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-center text-slate-500 font-medium">Loading Learning Center...</div>;

  const { patterns } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            What Has the Agent Learned?
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </h2>
          <p className="text-slate-500 text-sm">
            Automatically extracted organizational SEO knowledge distilled from Hindsight memory.
          </p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-right shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Patterns Distilled</span>
          <span className="text-xl font-extrabold text-purple-700">{data.patterns_count} Patterns</span>
        </div>
      </div>

      {/* Patterns Grid */}
      <div className="space-y-4">
        {patterns.map((pat: LearnedPattern, idx: number) => (
          <div key={pat.id} className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded">
                  Pattern #{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{pat.pattern_name}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded font-medium">
                  Category: {pat.category}
                </span>
                <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded font-bold">
                  Confidence: {pat.confidence}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                <p className="text-sm text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-semibold">
                  {pat.summary}
                </p>

                <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-1 font-medium">
                  <span className="font-bold uppercase text-indigo-700 block">Empirical Insight:</span>
                  <p>{pat.insight}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-sans font-medium">Supporting Evidence:</span>
                  <span className="text-slate-800 font-bold">{pat.evidence_count} Experiments</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-sans font-medium">Average Improvement:</span>
                  <span className="text-emerald-700 font-bold">{pat.average_improvement}</span>
                </div>
                {pat.successful_experiments.length > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-sans font-medium">Successful IDs:</span>
                    <span className="text-indigo-700 font-bold">{pat.successful_experiments.join(', ')}</span>
                  </div>
                )}
                {pat.failed_experiments.length > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-sans font-medium">Failed Warning IDs:</span>
                    <span className="text-rose-700 font-bold">{pat.failed_experiments.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
