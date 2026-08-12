import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  FlaskConical, 
  Users, 
  Quote, 
  BrainCircuit, 
  Lightbulb, 
  FileText
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'SEO Command Center', icon: LayoutDashboard },
    { id: 'keywords', label: 'Keyword Intelligence', icon: Search },
    { id: 'rankings', label: 'Ranking History', icon: TrendingUp },
    { id: 'audit', label: 'SEO & Citation Audit', icon: ShieldAlert },
    { id: 'recommendations', label: 'AI SEO Recommendations', icon: Sparkles },
    { id: 'experiments', label: 'Experiment Tracker', icon: FlaskConical },
    { id: 'competitors', label: 'Competitor Intelligence', icon: Users },
    { id: 'citations', label: 'Citation Intelligence', icon: Quote },
    { id: 'memory', label: 'Hindsight Memory Explorer', icon: BrainCircuit },
    { id: 'learning', label: 'Learning Center', icon: Lightbulb },
    { id: 'reports', label: 'AI Strategy Report', icon: FileText },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)] shadow-xs">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider font-mono">
          Core Modules
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-medium">
        <span className="font-bold text-slate-800 block">RankMind AI Engine</span>
        Real-world live website crawler & Hindsight persistent memory active.
      </div>
    </aside>
  );
};
