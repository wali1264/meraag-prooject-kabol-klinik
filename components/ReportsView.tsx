import React, { useState, useMemo } from 'react';
import { getTransactions } from '../services/dataService';
import { CURRENCY } from '../constants';
import { FileText, Printer, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

type ReportPeriod = 'weekly' | 'monthly' | 'yearly';

const ReportsView: React.FC = () => {
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  const transactions = getTransactions();

  const reportData = useMemo(() => {
    // Basic aggregation logic for demo purposes
    const data: any[] = [];
    const grouped: Record<string, { sales: number, purchases: number }> = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      let key = '';
      if (period === 'weekly') {
        const onejan = new Date(date.getFullYear(), 0, 1);
        const week = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
        key = `هفته ${week} - ${date.getFullYear()}`;
      } else if (period === 'monthly') {
        // Simple mapping, ideally use Intl.DateTimeFormat with fa-IR
        const months = ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'آگست', 'سپتمبر', 'اکتوبر', 'نوامبر', 'دسامبر'];
        key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      } else {
        key = date.getFullYear().toString();
      }

      if (!grouped[key]) grouped[key] = { sales: 0, purchases: 0 };
      if (t.type === 'sale') grouped[key].sales += t.total;
      else grouped[key].purchases += t.total;
    });

    Object.keys(grouped).forEach(k => {
      data.push({
        name: k,
        Sales: grouped[k].sales,
        Purchases: grouped[k].purchases,
        Profit: grouped[k].sales - grouped[k].purchases
      });
    });

    return data.slice(-12);
  }, [transactions, period]);

  const totalSales = reportData.reduce((acc, curr) => acc + curr.Sales, 0);
  const totalPurchases = reportData.reduce((acc, curr) => acc + curr.Purchases, 0);
  const totalProfit = totalSales - totalPurchases;

  const periodLabels: Record<ReportPeriod, string> = {
    weekly: 'هفته‌وار',
    monthly: 'ماه‌وار',
    yearly: 'سال‌وار'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">گزارشات تجاری</h1>
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          {(['weekly', 'monthly', 'yearly'] as ReportPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                period === p 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500"/> عملکرد {periodLabels[period]}
          </h2>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
          >
            <Printer size={18} /> چاپ گزارش
          </button>
        </div>

        <div className="h-80 w-full mb-8" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <Tooltip 
                 cursor={{fill: '#F3F4F6'}}
                 contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
              />
              <Legend />
              <Bar dataKey="Sales" name="فروش" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Purchases" name="خرید" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
           <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
             <p className="text-emerald-800 text-sm font-medium">مجموع فروش دوره</p>
             <p className="text-2xl font-bold text-emerald-700">{totalSales.toLocaleString('fa-IR')} <span className="text-xs">{CURRENCY}</span></p>
           </div>
           <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
             <p className="text-rose-800 text-sm font-medium">مجموع خرید دوره</p>
             <p className="text-2xl font-bold text-rose-700">{totalPurchases.toLocaleString('fa-IR')} <span className="text-xs">{CURRENCY}</span></p>
           </div>
           <div className={`p-4 rounded-lg border ${totalProfit >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
             <p className={`${totalProfit >= 0 ? 'text-blue-800' : 'text-orange-800'} text-sm font-medium`}>مفاد خالص دوره</p>
             <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{totalProfit.toLocaleString('fa-IR')} <span className="text-xs">{CURRENCY}</span></p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;