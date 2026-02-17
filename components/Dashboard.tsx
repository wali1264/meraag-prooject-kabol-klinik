
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Wallet, 
  Users, 
  AlertTriangle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { AppData } from '../types';
import { formatCurrency, formatNumber, getTodayStr } from '../utils';

interface DashboardProps {
  data: AppData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const today = getTodayStr();
  
  const todaySales = data.sales.filter(s => s.date === today).reduce((acc, s) => acc + s.total, 0);
  const todayPurchases = data.purchases.filter(p => p.date === today).reduce((acc, p) => acc + p.total, 0);
  
  const totalLitersSold = data.sales.reduce((acc, s) => acc + s.liters, 0);
  const totalLitersPurchased = data.purchases.reduce((acc, p) => acc + p.liters, 0);
  const currentInventory = totalLitersPurchased - totalLitersSold;
  
  const totalSalesAmount = data.sales.reduce((acc, s) => acc + s.total, 0);
  const totalPurchasesAmount = data.purchases.reduce((acc, p) => acc + p.total, 0);
  const totalProfit = totalSalesAmount - totalPurchasesAmount;

  // Chart Data (Mocking last 7 days)
  const chartData = [
    { name: 'شنبه', sales: 4000, purchases: 2400 },
    { name: 'یکشنبه', sales: 3000, purchases: 1398 },
    { name: 'دوشنبه', sales: 2000, purchases: 9800 },
    { name: 'سه‌شنبه', sales: 2780, purchases: 3908 },
    { name: 'چهارشنبه', sales: 1890, purchases: 4800 },
    { name: 'پنج‌شنبه', sales: 2390, purchases: 3800 },
    { name: 'جمعه', sales: 3490, purchases: 4300 },
  ];

  const stats = [
    { label: 'فروش امروز', value: formatCurrency(todaySales), icon: <TrendingUp className="text-green-500" />, bg: 'bg-green-50' },
    { label: 'خرید امروز', value: formatCurrency(todayPurchases), icon: <TrendingDown className="text-red-500" />, bg: 'bg-red-50' },
    { label: 'موجودی فعلی (لیتر)', value: `${formatNumber(currentInventory)} ل`, icon: <Package className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'سود کل', value: formatCurrency(totalProfit), icon: <Wallet className="text-yellow-500" />, bg: 'bg-yellow-50', isPositive: totalProfit >= 0 },
    { label: 'مشتریان فعال', value: formatNumber(data.customers.length), icon: <Users className="text-purple-500" />, bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Alert if low stock */}
      {currentInventory < data.settings.lowStockThreshold && (
        <div className="bg-amber-50 border-r-4 border-amber-500 p-4 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="text-amber-600" />
          <div>
            <p className="font-bold text-amber-800">هشدار موجودی!</p>
            <p className="text-amber-700 text-sm">موجودی تیل در حال اتمام است ({formatNumber(currentInventory)} لیتر باقی مانده).</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.bg} p-6 rounded-2xl shadow-sm border border-white/50 flex flex-col justify-between`}>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-white shadow-sm">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <h3 className={`text-xl font-bold mt-1 ${stat.isPositive === false ? 'text-red-600' : 'text-gray-800'}`}>
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="text-blue-600" /> روند فروش و خرید (هفتگی)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="فروش" />
                <Bar dataKey="purchases" fill="#ef4444" radius={[4, 4, 0, 0]} name="خرید" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-green-600" /> تحلیل موجودی مخزن
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{r: 6}} name="نوسان موجودی" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon Import
import { BarChart3 } from 'lucide-react';

export default Dashboard;
