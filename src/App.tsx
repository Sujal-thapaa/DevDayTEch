import React, { useState } from 'react';
import { OperatorNav } from './components/layout/OperatorNav';
import { OperatorHeader } from './components/layout/OperatorHeader';
import { PublicNav } from './components/layout/PublicNav';
import { HomePage } from './pages/operator/HomePage';
import { AnalysisPage } from './pages/operator/AnalysisPage';
import { ROIPage } from './pages/operator/ROIPage';
import { ReportsPage } from './pages/operator/ReportsPage';
import { IncidentsPage } from './pages/operator/IncidentsPage';
import { MarketPage } from './pages/operator/MarketPage';
import { DataEntryPage } from './pages/operator/DataEntryPage';
import { SettingsPage } from './pages/operator/SettingsPage';
import { PublicHomePage } from './pages/public/PublicHomePage';
import { EntryPage } from './pages/EntryPage';
import { OperatorAuthPage } from './pages/auth/OperatorAuthPage';
import { OperatorPage, PublicPage } from './types';

type AppRoute = 'entry' | 'auth' | 'public' | 'operator';

function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('entry');
  const [operatorPage, setOperatorPage] = useState<OperatorPage>('data-entry');
  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  const renderOperatorPage = () => {
    switch (operatorPage) {
      case 'home':
        return <HomePage onNavigate={setOperatorPage} isDataLoaded={isDataLoaded} />;
      case 'analysis':
        return <AnalysisPage onNavigate={setOperatorPage} isDataLoaded={isDataLoaded} />;
      case 'roi':
        return <ROIPage onNavigate={setOperatorPage} isDataLoaded={isDataLoaded} />;
      case 'reports':
        return <ReportsPage isDataLoaded={isDataLoaded} />;
      case 'incidents':
        return <IncidentsPage isDataLoaded={isDataLoaded} />;
      case 'market':
        return <MarketPage />;
      case 'data-entry':
        return <DataEntryPage onDataProcessed={() => setIsDataLoaded(true)} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={setOperatorPage} isDataLoaded={isDataLoaded} />;
    }
  };

  const renderPublicPage = () => {
    switch (publicPage) {
      case 'home':
        return <PublicHomePage />;
      case 'explore':
        return (
          <div className="max-w-7xl mx-auto py-8 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Industry</h1>
            <p className="text-gray-600">Industry profiles and company information coming soon...</p>
          </div>
        );
      case 'economy':
        return (
          <div className="max-w-7xl mx-auto py-8 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Economic Impact</h1>
            <p className="text-gray-600">Parish-level economic analysis coming soon...</p>
          </div>
        );
      case 'alerts':
        return (
          <div className="max-w-7xl mx-auto py-8 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Safety Alerts</h1>
            <p className="text-gray-600">Public safety incident feed coming soon...</p>
          </div>
        );
      case 'bridge':
        return (
          <div className="max-w-7xl mx-auto py-8 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">University Bridge</h1>
            <p className="text-gray-600">Research partnership news coming soon...</p>
          </div>
        );
      default:
        return <PublicHomePage />;
    }
  };

  // Route handlers
  const handleSelectPublic = () => {
    setCurrentRoute('public');
  };

  const handleSelectOperator = () => {
    setCurrentRoute('auth');
  };

  const handleOperatorLogin = () => {
    setCurrentRoute('operator');
  };

  const handleBackToEntry = () => {
    setCurrentRoute('entry');
  };

  // Render based on current route
  if (currentRoute === 'entry') {
    return (
      <EntryPage 
        onSelectPublic={handleSelectPublic} 
        onSelectOperator={handleSelectOperator} 
      />
    );
  }

  if (currentRoute === 'auth') {
    return (
      <OperatorAuthPage 
        onLogin={handleOperatorLogin} 
        onBack={handleBackToEntry} 
      />
    );
  }

  if (currentRoute === 'public') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNav 
          currentPage={publicPage} 
          onNavigate={setPublicPage}
          onBack={handleBackToEntry}
        />
        <main className="bg-white min-h-screen">{renderPublicPage()}</main>
      </div>
    );
  }

  // Operator route
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <OperatorNav currentPage={operatorPage} onNavigate={setOperatorPage} />
        <div className="flex-1 ml-64">
          <OperatorHeader onLogout={handleBackToEntry} />
          <main className="p-6">{renderOperatorPage()}</main>
        </div>
      </div>
    </div>
  );
}

export default App;
