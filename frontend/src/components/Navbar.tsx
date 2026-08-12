import React, { useState } from 'react';
import { Brain, Sparkles, Plus, Globe, Check } from 'lucide-react';
import { api } from '../services/api';

interface NavbarProps {
  currentModule: string;
  activeDomain: string;
  onDomainChange: (domain: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeDomain, onDomainChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [siteName, setSiteName] = useState('');

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    const formattedDomain = newDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    try {
      await api.getDashboard(formattedDomain);
      onDomainChange(formattedDomain);
      setIsModalOpen(false);
      setNewDomain('');
      setSiteName('');
    } catch (err) {
      onDomainChange(formattedDomain);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                RankMind <span className="text-gradient font-black">AI</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Hindsight-Powered Citation & SEO Agent</p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

          {/* Active Tracked Website Switcher */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-3 py-1 text-xs">
              <span className="text-slate-500 mr-2 font-medium">Active Website:</span>
              <span className="text-indigo-700 font-bold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {activeDomain}
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Website
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Hindsight Status Badge */}
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-mono shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Hindsight Memory Engine:</span>
            <span className="font-bold text-indigo-900">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Add Website Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                Add & Track New Website
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWebsite} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase">Website Name</label>
                <input
                  type="text"
                  placeholder="e.g. My Startup AI"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase">Website Domain / URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mysite.com or https://mysite.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-950 font-medium">
                RankMind AI will crawl live website headers, analyze meta tags, check sitemap accessibility, and save persistent Hindsight memory baselines.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  Crawl & Track Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
