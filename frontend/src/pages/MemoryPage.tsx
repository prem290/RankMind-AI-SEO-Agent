import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BrainCircuit, Search, Database, Clock } from 'lucide-react';

export const MemoryPage: React.FC = () => {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    api.getMemoryInfo().then(setMemoryInfo);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const res = await api.searchMemory(searchQuery);
    setSearchResults(res.memories || []);
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Hindsight Memory Explorer
            <BrainCircuit className="w-6 h-6 text-indigo-600" />
          </h2>
          <p className="text-slate-500 text-sm">
            Inspect persistent long-term memories, ranking events, and SEO experiments remembered by Hindsight.
          </p>
        </div>

        {memoryInfo && (
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-right shadow-2xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Hindsight Status</span>
              <span className="text-xs font-mono font-bold text-emerald-700">{memoryInfo.hindsight_health.status}</span>
            </div>
            <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-right shadow-2xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Memories</span>
              <span className="text-xs font-mono font-bold text-indigo-700">{memoryInfo.total_memories_stored} Events</span>
            </div>
          </div>
        )}
      </div>

      {/* Memory Search Bar */}
      <form onSubmit={handleSearch} className="glass-panel p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
          <Search className="w-4 h-4 text-indigo-600" />
          Query Hindsight Memory Bank (<span className="text-indigo-700 font-mono">rankmind-seo-memory</span>)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. What SEO changes improved our AI resume keywords?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-2xs"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
          >
            {isSearching ? 'Recalling...' : 'Recall Memory'}
          </button>
        </div>
      </form>

      {/* Search Results Display */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Recalled Memory Results ({searchResults.length})</h3>
          <div className="space-y-3">
            {searchResults.map((res: any, idx: number) => (
              <div key={idx} className="glass-panel p-4 rounded-xl border border-indigo-200 bg-white space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-indigo-700 font-bold">{res.metadata?.experiment_id || `MEMORY-${idx+1}`}</span>
                  <span className="text-emerald-700 font-bold">Relevance Score: {res.score}</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {res.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default Memories Display */}
      {memoryInfo && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            What RankMind Remembers (Recent Retained Events)
          </h3>
          <div className="space-y-3">
            {memoryInfo.memories.map((mem: any) => (
              <div key={mem.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center font-mono">
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-bold">
                    {mem.type}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> {mem.created_at}
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed font-mono font-medium">{mem.content}</p>
                {mem.metadata && Object.keys(mem.metadata).length > 0 && (
                  <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px] text-slate-600 font-mono overflow-x-auto shadow-2xs">
                    <pre>{JSON.stringify(mem.metadata, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
