import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowDown, ArrowUp, Users, Download } from 'lucide-react';

export default function Dashboard() {
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [debtors, setDebtors] = useState<any[]>([]);

  const fetchStats = async () => {
    const resStats = await fetch('/api/reports/daily');
    const dataStats = await resStats.json();
    setDailyStats(dataStats);

    const resDebtors = await fetch('/api/reports/debtors');
    const dataDebtors = await resDebtors.json();
    setDebtors(dataDebtors);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Phone,Balance\n"
      + debtors.map(d => `${d.name},${d.phone},${d.balance}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "debtors_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg shadow-emerald-900/20">
          <div className="flex items-center gap-3 mb-4 opacity-90">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="font-medium">سود خالص امروز</span>
          </div>
          <div className="text-3xl font-bold font-mono">
            {(dailyStats?.total_profit || 0).toLocaleString()}
            <span className="text-sm font-normal mr-2 opacity-80">تومان</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ArrowUp className="w-6 h-6" />
            </div>
            <span className="font-medium">ورودی امروز (برد)</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 font-mono">
            {(dailyStats?.total_in || 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ArrowDown className="w-6 h-6" />
            </div>
            <span className="font-medium">خروجی امروز (رسید)</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 font-mono">
            {(dailyStats?.total_out || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Debtors List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            لیست بدهکاران اصلی
          </h3>
          <div className="flex gap-2">
             <button onClick={handleExport} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-emerald-200 transition-colors">
                <Download className="w-3 h-3" />
                خروجی اکسل
             </button>
             <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
               {debtors.length} نفر
             </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">مشتری</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">شماره تماس</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">میزان بدهی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {debtors.slice(0, 5).map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{d.phone}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">
                    {d.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
