import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowDown, ArrowUp, Download } from 'lucide-react';

export default function Reports() {
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [debtors, setDebtors] = useState<any[]>([]);
  const [creditors, setCreditors] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const resStats = await fetch('/api/reports/daily');
    const dataStats = await resStats.json();
    setDailyStats(dataStats);

    const resDebtors = await fetch('/api/reports/debtors');
    const dataDebtors = await resDebtors.json();
    setDebtors(dataDebtors);

    const resCreditors = await fetch('/api/reports/creditors');
    const dataCreditors = await resCreditors.json();
    setCreditors(dataCreditors);
  };

  const handleExportDebtors = () => {
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
      <h2 className="text-2xl font-bold text-gray-800">گزارشات مالی</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="font-medium">سود خالص امروز</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 font-mono">
            {(dailyStats?.total_profit || 0).toLocaleString()}
            <span className="text-sm font-normal mr-2 opacity-80 text-gray-500">تومان</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Debtors List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <ArrowUp className="w-5 h-5 text-red-500" />
              بدهکاران (ما طلبکاریم)
            </h3>
            <button onClick={handleExportDebtors} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
              <Download className="w-3 h-3" />
              خروجی
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">مشتری</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">مبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {debtors.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">
                      {d.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Creditors List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <ArrowDown className="w-5 h-5 text-emerald-500" />
              بستانکاران (ما بدهکاریم)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">مشتری</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">مبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {creditors.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                      {Math.abs(d.balance).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
