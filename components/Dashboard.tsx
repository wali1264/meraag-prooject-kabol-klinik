import React, { useEffect, useState } from 'react';
import { calculateInventory, getCustomers, getTransactions } from '../services/dataService';
import { generateBusinessInsight } from '../services/geminiService';
import { InventoryStats, Transaction, Customer } from '../types';
import { CURRENCY } from '../constants';
import { TrendingUp, TrendingDown, Package, Users, BrainCircuit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [insight, setInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const currentStats = calculateInventory();
    setStats(currentStats);
    setCustomers(getCustomers());
    const txs = getTransactions();
    setTransactions(txs);
  }, []);

  const handleGenerateInsight = async () => {
    if (!stats) return;
    setLoadingAi(true);
    const result = await generateBusinessInsight(stats, transactions.slice(-10), customers);
    setInsight(result);
    setLoadingAi(false);
  };

  if (!stats) return <div>در حال بارگذاری...</div>;

  // Prepare chart data (Last 7 days sales)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const daySales = transactions
      .filter(t => t.type === 'sale' && t.date.startsWith(dateStr))
      .reduce((sum, t) => sum + t.total, 0);
    // Format date in a simpler way, ideally would use Persian calendar if library available, keeping Gregorian for simplicity but potentially could format numbers.
    return { name: d.toLocaleDateString('fa-IR'), sales: daySales };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">داشبورد</h1>
        <button
          onClick={handleGenerateInsight}
          disabled={loadingAi}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition disabled:opacity-50"
        >
          <BrainCircuit size={20} />
          {loadingAi ? 'در حال فکر...' : 'تحلیل هوشمند (AI)'}
        </button>
      </div>

      {insight && (
        <div className="bg-indigo-50 border-s-4 border-indigo-500 p-4 rounded-e-lg shadow-sm">
          <h3 className="text-indigo-800 font-semibold mb-1 flex items-center gap-2">
            <BrainCircuit size={16} /> تحلیل جمنای
          </h3>
          <p className="text-indigo-700 text-sm leading-relaxed">{insight}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">مجموع فروش</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSalesValue.toLocaleString('fa-IR')} <span className="text-xs text-gray-400">{CURRENCY}</span></p>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">مجموع خرید</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPurchaseValue.toLocaleString('fa-IR')} <span className="text-xs text-gray-400">{CURRENCY}</span></p>
          </div>
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">موجودی فعلی</p>
            <p className="text-2xl font-bold text-gray-900">{stats.currentStock.toLocaleString('fa-IR')} <span className="text-xs text-gray-400">لیتر</span></p>
          </div>
          <div className={`p-3 rounded-full ${stats.currentStock < 1000 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">سود خالص</p>
            <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {stats.profit.toLocaleString('fa-IR')} <span className="text-xs text-gray-400">{CURRENCY}</span>
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded-full text-gray-600">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">رشد فروش (۷ روز اخیر)</h3>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">دسترسی سریع</h3>
          <div className="space-y-3">
             <div className="p-3 rounded-lg border border-s-4 border-s-green-500 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <p className="font-semibold text-gray-700">فروش جدید</p>
                <p className="text-xs text-gray-500">ثبت فروش تیل به مشتری</p>
             </div>
             <div className="p-3 rounded-lg border border-s-4 border-s-red-500 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <p className="font-semibold text-gray-700">خرید جدید</p>
                <p className="text-xs text-gray-500">ثبت خرید تیل برای ذخیره</p>
             </div>
             <div className="p-3 rounded-lg border border-s-4 border-s-blue-500 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <p className="font-semibold text-gray-700">مشتری جدید</p>
                <p className="text-xs text-gray-500">افزودن مشتری به دفتر</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;