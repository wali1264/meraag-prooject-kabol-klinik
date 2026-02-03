
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  Download, 
  FilePieChart, 
  TrendingUp, 
  Calendar, 
  Filter, 
  ChevronDown,
  Printer,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight
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

const Reports: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-emerald-100">
            <BarChart3 size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800">گزارش‌های هوشمند</h2>
            <p className="text-slate-500 mt-1 font-medium">تحلیل دقیق وضعیت مالی و عملکرد عملیاتی شرکت</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-2xl border border-slate-100 flex gap-1">
            <button className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200">سال ۱۴۰۳</button>
            <button className="px-5 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all">سال ۱۴۰۲</button>
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-50">
            <Download size={20} />
            خروجی جامع
          </button>
        </div>
      </div>

      {/* Main Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue vs Expenses Line Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-800">روند عواید و مصارف</h3>
              <p className="text-xs text-slate-400 font-bold mt-1">مقایسه ماهانه در نیم‌سال اول</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-bold text-slate-500">عواید</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                <span className="text-xs font-bold text-slate-500">مصارف</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB7185" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FB7185" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} tickFormatter={(val) => `${val/1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#FB7185" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution Pie Chart */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center justify-between">
          <div className="w-full text-right">
            <h3 className="text-xl font-black text-slate-800">توزیع درآمدی</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">سهم هر خدمت از کل عواید</p>
          </div>

          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-2xl font-black text-slate-800">۱۰۰٪</span>
               <span className="text-[10px] font-bold text-slate-400">کل خدمات</span>
            </div>
          </div>

          <div className="w-full space-y-3">
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

      {/* Bottom Insights and Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
               <TrendingUp size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight size={14} />
              ۱۲٪+
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold">میانگین سود هر مسافر</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">۱۸,۴۰۰ AFN</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
               <Calendar size={24} />
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold">سودآورترین ماه</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">سنبله ۱۴۰۳</h4>
          </div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-[32px] shadow-xl shadow-indigo-100 flex flex-col justify-between text-white lg:col-span-2">
           <div className="flex justify-between items-start">
             <div>
                <h4 className="text-xl font-black">گزارش سریع مالی</h4>
                <p className="text-indigo-200 text-xs font-bold mt-1">دریافت آخرین ترازنامه در قالب‌های مختلف</p>
             </div>
             <FilePieChart size={32} className="opacity-40" />
           </div>
           
           <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-white/10 hover:bg-white/20 transition-all p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm">
                 <Printer size={18} /> چاپ مستقیم
              </button>
              <button className="flex-1 bg-white text-indigo-600 hover:bg-indigo-50 transition-all p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm">
                 <FileSpreadsheet size={18} /> خروجی اکسل
              </button>
           </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800">ترازنامه فصلی (نیم‌سال اول)</h3>
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm">
            <Filter size={18} /> فیلتر ستون‌ها
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-sm font-black text-slate-500">ماه مالی</th>
                <th className="px-8 py-5 text-sm font-black text-slate-500">مجموع عواید</th>
                <th className="px-8 py-5 text-sm font-black text-slate-500">مجموع مصارف</th>
                <th className="px-8 py-5 text-sm font-black text-slate-500">سود خالص</th>
                <th className="px-8 py-5 text-sm font-black text-slate-500">درصد بازگشت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {monthlyData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-700">{row.name}</td>
                  <td className="px-8 py-6 font-bold text-slate-600">{row.revenue.toLocaleString()} AFN</td>
                  <td className="px-8 py-6 font-bold text-slate-600">{row.expenses.toLocaleString()} AFN</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black ${row.profit > 15000 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {row.profit.toLocaleString()} AFN
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                         <div className="h-full bg-indigo-500" style={{ width: `${(row.profit/row.revenue)*100}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-slate-400">{Math.round((row.profit/row.revenue)*100)}٪</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
