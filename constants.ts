export const CURRENCY = 'AFN';
export const APP_NAME = 'PetroAccount AF';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'داشبورد', icon: 'LayoutDashboard' },
  { id: 'general_journal', label: 'روزنامچه عمومی', icon: 'ClipboardList' },
  { id: 'sales', label: 'روزنامچه فروش', icon: 'TrendingUp' },
  { id: 'purchases', label: 'روزنامچه خرید', icon: 'TrendingDown' },
  { id: 'expenses', label: 'مصارف', icon: 'Wallet' },
  { id: 'customers', label: 'دفتر مشتریان', icon: 'Users' },
  { id: 'inventory', label: 'موجودی', icon: 'Package' },
  { id: 'reports', label: 'گزارشات', icon: 'BarChart3' },
  { id: 'settings', label: 'تنظیمات', icon: 'Settings' },
];

export const MOCK_CUSTOMERS = [
  { id: '1', code: 'C-001', name: 'شرکت احمد اویل', phone: '0799000000', type: 'seller', createdAt: new Date().toISOString() },
  { id: '2', code: 'C-002', name: 'کابل ترانسپورت', phone: '0700123456', type: 'buyer', createdAt: new Date().toISOString() },
  { id: '3', code: 'C-003', name: 'هرات لوژستیک', phone: '0788987654', type: 'both', createdAt: new Date().toISOString() },
];