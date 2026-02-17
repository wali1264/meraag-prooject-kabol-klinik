
import React, { useState } from 'react';
import { Download, Filter, FileText, PieChart } from 'lucide-react';
import { AppData } from '../types';
import { formatCurrency, formatNumber } from '../utils';

interface ReportsProps {
  data: AppData;
}

const Reports: React.FC<ReportsProps> = ({ data }) => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const totalSales = data.sales.reduce((acc, s) => acc + s.total, 0);
  const totalPurchases = data.purchases.reduce((acc, p) => acc + p.total, 0);
  const totalLitersSold = data.sales.reduce((acc, s) => acc + s.liters, 0);
  const netProfit = totalSales - totalPurchases;

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {(['weekly', 'monthly', 'yearly'] as const).map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                reportType === type 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'weekly' ? 'هفته‌وار' : type === 'monthly' ? 'ماه‌وار' : 'سال‌وار'}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <Filter size={18} /> فیلتر پیشرفته
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-sm transition-all">
            <Download size={18} /> خروجی PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <div className="text-blue-600 mb-2"><FileText size={24} /></div>
          <p className="text-gray-500 text-xs">مجموع فروش در این دوره</p>
          <h4 className="text-xl font-bold text-blue-900 mt-1">{formatCurrency(totalSales)}</h4>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
          <div className="text-red-600 mb-2"><PieChart size={24} /></div>
          <p className="text-gray-500 text-xs">مجموع خرید در این دوره</p>
          <h4 className="text-xl font-bold text-red-900 mt-1">{formatCurrency(totalPurchases)}</h4>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
          <div className="text-green-600 mb-2"><PieChart size={24} /></div>
          <p className="text-gray-500 text-xs">سود / زیان خالص</p>
          <h4 className={`text-xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            {formatCurrency(netProfit)}
          </h4>
        </div>
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <div className="text-indigo-600 mb-2"><FileText size={24} /></div>
          <p className="text-gray-500 text-xs">تیل فروخته شده (لیتر)</p>
          <h4 className="text-xl font-bold text-indigo-900 mt-1">{formatNumber(totalLitersSold)} ل</h4>
        </div>
      </div>

      {/* Report Table View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-gray-800">لیست جزئی تراکنش‌های دوره</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">تاریخ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">نوعیت</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">جزئیات</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">مقدار (لیتر)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">مبلغ کل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...data.sales, ...data.purchases].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item, idx) => {
                const isSale = 'customerId' in item;
                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${isSale ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isSale ? 'فروش' : 'خرید'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {isSale 
                        ? (data.customers.find(c => c.id === (item as any).customerId)?.name || 'مشتری')
                        : (item as any).description
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(item.liters)}</td>
                    <td className={`px-6 py-4 text-sm font-bold ${isSale ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
