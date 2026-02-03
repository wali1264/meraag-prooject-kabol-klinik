
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Travelers from './components/Travelers';
import Services from './components/Services';
import Accounts from './components/Accounts';
import Expenses from './components/Expenses';
import Commission from './components/Commission';
import History from './components/History';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-right" dir="rtl">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : activeTab === 'travelers' ? (
          <Travelers />
        ) : activeTab === 'services' ? (
          <Services />
        ) : activeTab === 'accounts' ? (
          <Accounts />
        ) : activeTab === 'expenses' ? (
          <Expenses />
        ) : activeTab === 'commission' ? (
          <Commission />
        ) : activeTab === 'history' ? (
          <History />
        ) : activeTab === 'reports' ? (
          <Reports />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-medium">
             این بخش در حال توسعه است
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
