
import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Printer, 
  FileSpreadsheet,
  ArrowUpRight,
  User,
  DollarSign
} from 'lucide-react';

const monthlyData = [
  { name: 'حمل', revenue: 45000, expenses: 32000, profit: 13000 },
  { name: 'ثور', revenue: 52000, expenses: 38000, profit: 14000 },
  { name: 'جوزا', revenue: 48000, expenses: 45000, profit: 3000 },
  { name: 'سرطان', revenue: 61000, expenses: 42000, profit: 19000 },
  { name: 'اسد', revenue: 55000, expenses: 35000, profit: 20000 },
  { name: 'سنبله', revenue: 67000, expenses: 48000, profit: 19000 },
];

const serviceDistribution = [
  { name: 'خدمات حج', value: 45, color: '#10B981' },
  { name: 'خدمات عمره', value: 35, color: '#3B82F6' },
  { name: 'صدور ویزه', value: 20, color: '#F59E0B' },
];

interface ReportsProps {
  travelers?: any[];
}

const Reports: React.FC<ReportsProps> = ({ travelers = [] }) => {
  
  // Calculate Real Profit for a traveler
  const calculateTravelerProfit = (t: any) => {
    const parse = (v: any) => parseFloat(v?.toString().replace(/,/g, '')) || 0;
    
    // Profits per service
    const visaProfit = parse(t.visaSelling) - parse(t.visaPurchase);
    const flightProfit = parse(t.flightSelling) - parse(t.flightPurchase);
    const madinahProfit = (parse(t.hotelSelling) - parse(t.hotelPurchase)) * (parse(t.hotelNights) || 1);
    const makkahProfit = (parse(t.hotelMakkahSelling) - parse(t.hotelMakkahPurchase)) * (parse(t.hotelMakkahNights) || 1);
    const transportProfit = parse(t.transportSelling) - parse(t.transportPurchase);
    const foodProfit = parse(t.foodSelling) - parse(t.foodPurchase);
    const repFee = parse(t.representativeFee); // Representative fee is pure revenue/profit for company

    const totalProfit = visaProfit + flightProfit + madinahProfit + makkahProfit + transportProfit + foodProfit + repFee;
    const totalCost = parse(t.visaPurchase) + parse(t.flightPurchase) + 
                     (parse(t.hotelPurchase) * (parse(t.hotelNights) || 1)) + 
                     (parse(t.hotelMakkahPurchase) * (parse(t.hotelMakkahNights) || 1)) + 
                     parse(t.transportPurchase) + parse(t.foodPurchase);
    const totalSale = parse(t.visaSelling) + parse(t.flightSelling) + 
                     (parse(t.hotelSelling) * (parse(t.hotelNights) || 1)) + 
                     (parse(t.hotelMakkahSelling) * (parse(t.hotelMakkahNights) || 1)) + 
                     parse(t.transportSelling) + parse(t.foodSelling) + repFee;

    return { totalProfit, totalCost, totalSale };
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#108548] text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-green-100">
            <BarChart3 size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800">گزارش‌های هوشمند</h2>
            <p className="text-slate-500 mt-1 font-medium">تحلیل دقیق سود حقیقی و عملکرد عملیاتی</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-[#108548] hover:bg-[#0d6e3c] text-white rounded-2xl font-black transition-all shadow-xl shadow-green-50">
            <Download size={20} />
            خروجی اکسل سود
          </button>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-xl font-black text-slate-800">روند عواید و مصارف عمومی</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', textAlign: 'right' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#FB7185" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-xl font-black text-slate-800 w-full text-right mb-8">سهم خدمات از سود</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={serviceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {serviceDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <TrendingUp size={24} className="text-emerald-500 mb-1" />
               <span className="text-xs font-bold text-slate-400">تحلیل سود</span>
            </div>
          </div>
          <div className="w-full space-y-3 mt-4">
            {serviceDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-800">{item.value}٪</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: INDIVIDUAL TRAVELER PROFIT TABLE */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-emerald-50/30">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#108548]">
                <TrendingUp size={20} />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-800">گزارش سود حقیقی به تفکیک مسافر</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">محاسبه خالص سود از تمامی خدمات پکیج</p>
             </div>
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-[#108548] font-bold text-sm">
            <Filter size={18} /> فیلتر مسافران
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-sm font-black text-slate-500">نام مسافر</th>
                <th className="px-8 py-5 text-sm font-black text-slate-500">نوع سفر</th>
                <th className="px-8 py-5 text-sm font-black text-slate-500">مجموع فروش ($)</th>
                <th className="px-8 py-5 text-sm font-black text-slate-500">مجموع خرید ($)</th>
                <th className="px-8 py-5 text-sm font-black text-[#108548]">سود خالص نهایی ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {travelers.length > 0 ? travelers.map((t, idx) => {
                const { totalProfit, totalCost, totalSale } = calculateTravelerProfit(t);
                return (
                  <tr key={idx} className="hover:bg-emerald-50/20 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-slate-300" />
                        <span className="font-black text-slate-700">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${t.tripType === 'عمره' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {t.tripType}
                       </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600">{totalSale.toLocaleString()} $</td>
                    <td className="px-8 py-6 font-bold text-rose-400">{totalCost.toLocaleString()} $</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-[#108548]">
                          {totalProfit.toLocaleString()} $
                        </span>
                        <span className="text-[10px] font-bold text-emerald-300">
                          {Math.round((totalProfit / totalSale) * 100)}٪ حاشیه سود
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold">هیچ مسافری یافت نشد.</td>
                </tr>
              )}
            </tbody>
            {travelers.length > 0 && (
              <tfoot className="bg-slate-900 text-white">
                <tr>
                  <td className="px-8 py-5 font-black">مجموع کل</td>
                  <td className="px-8 py-5"></td>
                  <td className="px-8 py-5 font-black text-blue-300">
                    {travelers.reduce((acc, t) => acc + calculateTravelerProfit(t).totalSale, 0).toLocaleString()} $
                  </td>
                  <td className="px-8 py-5 font-black text-rose-300">
                    {travelers.reduce((acc, t) => acc + calculateTravelerProfit(t).totalCost, 0).toLocaleString()} $
                  </td>
                  <td className="px-8 py-5 font-black text-emerald-400 text-xl">
                    {travelers.reduce((acc, t) => acc + calculateTravelerProfit(t).totalProfit, 0).toLocaleString()} $
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp size={24} /></div>
            <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg"><ArrowUpRight size={14} /> ۱۲٪+</div>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold">سود خالص کل (مسافران)</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">
              {travelers.reduce((acc, t) => acc + calculateTravelerProfit(t).totalProfit, 0).toLocaleString()} $
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
