import React from 'react';
import { NAV_ITEMS, APP_NAME } from '../constants';
import { LayoutDashboard, TrendingUp, TrendingDown, Users, Package, BarChart3, LogOut, Fuel, ClipboardList, Settings, Wallet } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const iconMap: any = {
    LayoutDashboard: <LayoutDashboard size={20} />,
    ClipboardList: <ClipboardList size={20} />,
    TrendingUp: <TrendingUp size={20} />,
    TrendingDown: <TrendingDown size={20} />,
    Users: <Users size={20} />,
    Package: <Package size={20} />,
    BarChart3: <BarChart3 size={20} />,
    Settings: <Settings size={20} />,
    Wallet: <Wallet size={20} />,
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
             <Fuel size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{APP_NAME}</h1>
            <p className="text-xs text-slate-400">سیستم مدیریت</p>
          </div>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {iconMap[item.icon]}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
            <LogOut size={20} className="rotate-180" />
            <span>خروج</span>
          </button>
          <div className="mt-4 text-center">
             <p className="text-xs text-slate-600">v1.0.0 &copy; 2025</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;