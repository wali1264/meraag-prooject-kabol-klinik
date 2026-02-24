
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  BarChart3, 
  Users, 
  Settings, 
  Fuel,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: <LayoutDashboard size={20} /> },
    { id: 'sales', label: 'فروش تیل', icon: <ArrowUpRight size={20} /> },
    { id: 'purchases', label: 'خرید تیل', icon: <ArrowDownLeft size={20} /> },
    { id: 'reports', label: 'گزارشات', icon: <BarChart3 size={20} /> },
    { id: 'customers', label: 'دفتر مشتریان', icon: <Users size={20} /> },
    { id: 'settings', label: 'تنظیمات', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 flex flex-col z-50`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center gap-2 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
            <Fuel className="text-yellow-400" />
            <span className="font-bold text-xl whitespace-nowrap">FuelPro AF</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-blue-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 transition-colors ${
                activeTab === item.id ? 'bg-blue-700 border-l-4 border-yellow-400' : 'hover:bg-blue-800'
              }`}
            >
              {item.icon}
              <span className={`${!isSidebarOpen && 'hidden'} transition-opacity`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button className="flex items-center gap-4 w-full p-2 hover:bg-blue-800 rounded transition-colors text-red-300">
            <LogOut size={20} />
            <span className={`${!isSidebarOpen && 'hidden'}`}>خروج از سیستم</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-gray-800">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('fa-AF', { dateStyle: 'full' })}</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              م
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
