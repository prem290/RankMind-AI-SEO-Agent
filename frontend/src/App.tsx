import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { DashboardPage } from './pages/DashboardPage';
import { KeywordsPage } from './pages/KeywordsPage';
import { RankingsPage } from './pages/RankingsPage';
import { AuditPage } from './pages/AuditPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ExperimentsPage } from './pages/ExperimentsPage';
import { CompetitorsPage } from './pages/CompetitorsPage';
import { CitationsPage } from './pages/CitationsPage';
import { MemoryPage } from './pages/MemoryPage';
import { LearningPage } from './pages/LearningPage';
import { ReportsPage } from './pages/ReportsPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeDomain, setActiveDomain] = useState<string>('talentflow-ai.example');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage activeDomain={activeDomain} onDomainChange={setActiveDomain} />;
      case 'keywords':
        return <KeywordsPage activeDomain={activeDomain} onDomainChange={setActiveDomain} />;
      case 'rankings':
        return <RankingsPage activeDomain={activeDomain} onDomainChange={setActiveDomain} />;
      case 'audit':
        return <AuditPage activeDomain={activeDomain} />;
      case 'recommendations':
        return <RecommendationsPage activeDomain={activeDomain} />;
      case 'experiments':
        return <ExperimentsPage activeDomain={activeDomain} onDomainChange={setActiveDomain} />;
      case 'competitors':
        return <CompetitorsPage activeDomain={activeDomain} onDomainChange={setActiveDomain} />;
      case 'citations':
        return <CitationsPage activeDomain={activeDomain} />;
      case 'memory':
        return <MemoryPage />;
      case 'learning':
        return <LearningPage />;
      case 'reports':
        return <ReportsPage activeDomain={activeDomain} />;
      default:
        return <DashboardPage activeDomain={activeDomain} onDomainChange={setActiveDomain} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar currentModule={currentTab} activeDomain={activeDomain} onDomainChange={setActiveDomain} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
