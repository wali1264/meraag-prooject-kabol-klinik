
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SalesJournal from './components/SalesJournal';
import PurchaseJournal from './components/PurchaseJournal';
import Customers from './components/Customers';
import Reports from './components/Reports';
import { AppData, Sale, Purchase, Customer } from './types';
import { Lock, KeyRound, ShieldCheck } from 'lucide-react';

const INITIAL_DATA: AppData = {
  customers: [
    { id: '1', code: 'CUS-0001', name: 'خدمات ترانسپورتی اتفاق', phone: '0700123456', type: 'هر دو' as any, createdAt: new Date().toISOString() },
    { id: '2', code: 'CUS-0002', name: 'فروشگاه تایر ولی', phone: '0788654321', type: 'خریدار' as any, createdAt: new Date().toISOString() },
  ],
  sales: [],
  purchases: [],
  settings: {
    lowStockThreshold: 1000,
    companyName: 'FuelPro AF',
    password: '0796606605' // Updated default password
  }
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('fuelpro_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  // Password Change State
  const [passChange, setPassChange] = useState({ old: '', new: '', confirm: '' });
  const [passMessage, setPassMessage] = useState({ text: '', color: '' });

  useEffect(() => {
    localStorage.setItem('fuelpro_data', JSON.stringify(data));
  }, [data]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === data.settings.password) {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passChange.old !== data.settings.password) {
      setPassMessage({ text: 'رمز عبور فعلی اشتباه است', color: 'text-red-600' });
      return;
    }
    if (passChange.new !== passChange.confirm) {
      setPassMessage({ text: 'رمز جدید با تکرار آن مطابقت ندارد', color: 'text-red-600' });
      return;
    }
    if (passChange.new.length < 4) {
      setPassMessage({ text: 'رمز عبور باید حداقل ۴ کرکتر باشد', color: 'text-red-600' });
      return;
    }

    setData({ ...data, settings: { ...data.settings, password: passChange.new } });
    setPassMessage({ text: 'رمز عبور با موفقیت تغییر کرد', color: 'text-green-600' });
    setPassChange({ old: '', new: '', confirm: '' });
  };

  const handleAddSale = (sale: Sale) => {
    setData(prev => ({ ...prev, sales: [sale, ...prev.sales] }));
  };

  const handleDeleteSale = (id: string) => {
    setData(prev => ({ ...prev, sales: prev.sales.filter(s => s.id !== id) }));
  };

  const handleAddPurchase = (purchase: Purchase) => {
    setData(prev => ({ ...prev, purchases: [purchase, ...prev.purchases] }));
  };

  const handleDeletePurchase = (id: string) => {
    setData(prev => ({ ...prev, purchases: prev.purchases.filter(p => p.id !== id) }));
  };

  const handleAddCustomer = (customer: Customer) => {
    setData(prev => ({ ...prev, customers: [customer, ...prev.customers] }));
  };

  const handleDeleteCustomer = (id: string) => {
    setData(prev => ({ ...prev, customers: prev.customers.filter(c => c.id !== id) }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border-t-8 border-yellow-400">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <Lock size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ورود به سیستم FuelPro AF</h1>
          <p className="text-gray-500 mb-8 text-sm">لطفاً رمز عبور مدیریتی را وارد کنید</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                className={`w-full p-4 bg-gray-50 border ${loginError ? 'border-red-500' : 'border-gray-200'} rounded-2xl text-center text-lg tracking-[0.2em] focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                placeholder="رمز عبور"
                autoFocus
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              {loginError && <p className="text-red-500 text-xs mt-2 font-bold">رمز عبور اشتباه است!</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              تایید و ورود
            </button>
          </form>
          <p className="mt-8 text-xs text-gray-400 font-light">رمز عبور پیش‌فرض: 0796606605</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} />;
      case 'sales':
        return <SalesJournal data={data} onAddSale={handleAddSale} onDeleteSale={handleDeleteSale} />;
      case 'purchases':
        return <PurchaseJournal data={data} onAddPurchase={handleAddPurchase} onDeletePurchase={handleDeletePurchase} />;
      case 'customers':
        return <Customers data={data} onAddCustomer={handleAddCustomer} onDeleteCustomer={handleDeleteCustomer} />;
      case 'reports':
        return <Reports data={data} />;
      case 'settings':
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-blue-600" /> تنظیمات امنیتی و رمز عبور
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور فعلی</label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-blue-500"
                      value={passChange.old}
                      onChange={(e) => setPassChange({...passChange, old: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور جدید</label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-blue-500"
                      value={passChange.new}
                      onChange={(e) => setPassChange({...passChange, new: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تکرار رمز جدید</label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-blue-500"
                      value={passChange.confirm}
                      onChange={(e) => setPassChange({...passChange, confirm: e.target.value})}
                      required
                    />
                  </div>
                </div>
                {passMessage.text && <p className={`text-sm font-bold ${passMessage.color}`}>{passMessage.text}</p>}
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <KeyRound size={18} /> بروزرسانی رمز عبور
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">تنظیمات عمومی</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام شرکت</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg"
                    value={data.settings.companyName}
                    onChange={(e) => setData({...data, settings: {...data.settings, companyName: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حد اقل موجودی برای هشدار (لیتر)</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-200 rounded-lg"
                    value={data.settings.lowStockThreshold}
                    onChange={(e) => setData({...data, settings: {...data.settings, lowStockThreshold: parseInt(e.target.value)}})}
                  />
                </div>
                <div className="pt-6 flex gap-3">
                  <button 
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
                      const downloadAnchorNode = document.createElement('a');
                      downloadAnchorNode.setAttribute("href",     dataStr);
                      downloadAnchorNode.setAttribute("download", `fuelpro_backup_${new Date().toISOString()}.json`);
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    پشتیبان‌گیری (بکاپ) داده‌ها
                  </button>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                  >
                    قفل کردن سیستم
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-8">نسخه: 1.0.1 AF Security Edition</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
