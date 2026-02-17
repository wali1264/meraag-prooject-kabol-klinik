
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SalesJournal from './components/SalesJournal';
import PurchaseJournal from './components/PurchaseJournal';
import Customers from './components/Customers';
import Reports from './components/Reports';
import { AppData, Sale, Purchase, Customer } from './types';

const INITIAL_DATA: AppData = {
  customers: [
    { id: '1', code: 'CUS-0001', name: 'خدمات ترانسپورتی اتفاق', phone: '0700123456', type: 'هر دو' as any, createdAt: new Date().toISOString() },
    { id: '2', code: 'CUS-0002', name: 'فروشگاه تایر ولی', phone: '0788654321', type: 'خریدار' as any, createdAt: new Date().toISOString() },
  ],
  sales: [],
  purchases: [],
  settings: {
    lowStockThreshold: 1000,
    companyName: 'FuelPro AF'
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('fuelpro_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('fuelpro_data', JSON.stringify(data));
  }, [data]);

  const handleAddSale = (sale: Sale) => {
    setData(prev => ({
      ...prev,
      sales: [sale, ...prev.sales]
    }));
  };

  const handleDeleteSale = (id: string) => {
    setData(prev => ({
      ...prev,
      sales: prev.sales.filter(s => s.id !== id)
    }));
  };

  const handleAddPurchase = (purchase: Purchase) => {
    setData(prev => ({
      ...prev,
      purchases: [purchase, ...prev.purchases]
    }));
  };

  const handleDeletePurchase = (id: string) => {
    setData(prev => ({
      ...prev,
      purchases: prev.purchases.filter(p => p.id !== id)
    }));
  };

  const handleAddCustomer = (customer: Customer) => {
    setData(prev => ({
      ...prev,
      customers: [customer, ...prev.customers]
    }));
  };

  const handleDeleteCustomer = (id: string) => {
    setData(prev => ({
      ...prev,
      customers: prev.customers.filter(c => c.id !== id)
    }));
  };

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
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6">تنظیمات سیستم</h2>
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
              <div className="pt-6">
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
                  پشتیبان‌گیری (بکاپ) از داده‌ها
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-8">نسخه: 1.0.0 AF Edition</p>
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
