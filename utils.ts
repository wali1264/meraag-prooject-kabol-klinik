
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-AF', {
    style: 'currency',
    currency: 'AFN',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fa-AF').format(num);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateCustomerCode = (count: number) => {
  return `CUS-${(count + 1).toString().padStart(4, '0')}`;
};

export const getTodayStr = () => new Date().toISOString().split('T')[0];
