import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import CustomerLedger from './components/CustomerLedger';
import ReportsView from './components/ReportsView';
import GeneralJournal from './components/GeneralJournal';
import SettingsView from './components/SettingsView';
import ExpensesView from './components/ExpensesView';
import { Menu, Lock } from 'lucide-react';
import { calculateInventory, getTransactions, verifyPassword } from './services/dataService';
import { CURRENCY } from './constants';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPassword(passwordInput)) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('رمز عبور اشتباه است.');
    }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">PetroAccount AF</h1>
          <p className="text-gray-500 text-sm mb-6">سیستم مدیریت تجارت مواد نفتی</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-right">
               <label className="text-sm font-medium text-gray-700 mb-1 block">رمز عبور</label>
               <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center tracking-widest text-lg"
                  placeholder="****"
                  autoFocus
               />
            </div>
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              ورود به سیستم
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-6">رمز پیش‌فرض سازنده: 0796606605</p>
        </div>
      </div>
    );
  }

  // --- MAIN APP ---

  const handleTransactionSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('dashboard'); // Redirect to dashboard to see update
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key={refreshKey} />;
      case 'general_journal':
        return <GeneralJournal key={refreshKey} />;
      case 'sales':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">روزنامچه فروش</h1>
            <TransactionForm type="sale" onSuccess={handleTransactionSuccess} />
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 className="text-lg font-bold text-gray-800 mb-4">فروش‌های اخیر</h3>
               <RecentTransactionsList type="sale" key={refreshKey} />
            </div>
          </div>
        );
      case 'purchases':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">روزنامچه خرید</h1>
            <TransactionForm type="purchase" onSuccess={handleTransactionSuccess} />
             <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 className="text-lg font-bold text-gray-800 mb-4">خریدهای اخیر</h3>
               <RecentTransactionsList type="purchase" key={refreshKey} />
            </div>
          </div>
        );
      case 'expenses':
        return <ExpensesView key={refreshKey} />;
      case 'customers':
        return <CustomerLedger key={refreshKey} />;
      case 'reports':
        return <ReportsView key={refreshKey} />;
      case 'inventory':
         // Simple Inventory View Reuse for now, ideally separate component
         const stats = calculateInventory();
         return (
            <div className="space-y-6">
               <h1 className="text-3xl font-bold text-gray-800">مدیریت موجودی</h1>
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-500 mb-2">سطح موجودی فعلی</p>
                  <p className="text-6xl font-black text-blue-600 mb-4">{stats.currentStock.toLocaleString('fa-IR')}</p>
                  <p className="text-xl text-gray-400">لیتر</p>
                  <div className="mt-8 flex justify-center gap-8">
                      <div>
                         <p className="text-sm text-gray-500">قیمت خرید متوسط</p>
                         <p className="font-bold text-gray-800">{stats.avgBuyPrice.toLocaleString('fa-IR')} {CURRENCY}</p>
                      </div>
                      <div>
                         <p className="text-sm text-gray-500">ارزش تخمینی موجودی</p>
                         <p className="font-bold text-gray-800">{(stats.currentStock * stats.avgBuyPrice).toLocaleString('fa-IR')} {CURRENCY}</p>
                      </div>
                  </div>
               </div>
            </div>
         );
      case 'settings':
          return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        {/* Header (Mobile Only) */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
           <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600">
             <Menu size={24} />
           </button>
           <span className="font-bold text-lg">PetroAccount AF</span>
           <div className="w-8"></div>
        </div>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Simple internal component for transaction listing
const RecentTransactionsList: React.FC<{ type: 'sale' | 'purchase' }> = ({ type }) => {
  const txs = getTransactions()
    .filter(t => t.type === type)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  if (txs.length === 0) return <p className="text-gray-400">هیچ موردی یافت نشد.</p>;

  return (
    <div className="overflow-x-auto">
       <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-gray-500">
             <tr>
               <th className="p-3">تاریخ</th>
               <th className="p-3">توضیحات</th>
               <th className="p-3 text-left">لیتر</th>
               <th className="p-3 text-left">جمله ({CURRENCY})</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {txs.map(t => (
               <tr key={t.id}>
                  <td className="p-3">{t.date}</td>
                  <td className="p-3">{t.description || '-'}</td>
                  <td className="p-3 text-left">{t.liters.toLocaleString('fa-IR')}</td>
                  <td className="p-3 text-left font-medium">{t.total.toLocaleString('fa-IR')}</td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
};

export default App;