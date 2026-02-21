import { Customer, Transaction, InventoryStats, CustomerBalance, TransactionType, Expense } from "../types";

// Helper to seed data if empty
const seedData = () => {
  if (!localStorage.getItem('pa_customers')) {
    const customers = [
        { id: 'c1', code: 'C-001', name: 'Ali Transport', phone: '0700111222', type: 'buyer', createdAt: new Date().toISOString() } as Customer,
        { id: 'c2', code: 'C-002', name: 'Global Fuel Supply', phone: '0799333444', type: 'seller', createdAt: new Date().toISOString() } as Customer,
    ];
    localStorage.setItem('pa_customers', JSON.stringify(customers));
  }
  if (!localStorage.getItem('pa_transactions')) {
    localStorage.setItem('pa_transactions', JSON.stringify([]));
  }
  if (!localStorage.getItem('pa_expenses')) {
    localStorage.setItem('pa_expenses', JSON.stringify([]));
  }
  // Default Developer Password
  // Check if it's the old default or not set, then update to new default
  const currentKey = localStorage.getItem('pa_auth_key');
  if (!currentKey || currentKey === '12345') {
    localStorage.setItem('pa_auth_key', '0796606605');
  }
};

seedData();

export const verifyPassword = (inputPass: string): boolean => {
  const stored = localStorage.getItem('pa_auth_key');
  return stored === inputPass;
};

export const updatePassword = (newPass: string): void => {
  localStorage.setItem('pa_auth_key', newPass);
};

export const getCustomers = (): Customer[] => {
  const data = localStorage.getItem('pa_customers');
  return data ? JSON.parse(data) : [];
};

export const saveCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  const existingIndex = customers.findIndex(c => c.id === customer.id);
  if (existingIndex >= 0) {
    customers[existingIndex] = customer;
  } else {
    customers.push(customer);
  }
  localStorage.setItem('pa_customers', JSON.stringify(customers));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem('pa_transactions');
  return data ? JSON.parse(data) : [];
};

export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem('pa_transactions', JSON.stringify(transactions));
};

export const getExpenses = (): Expense[] => {
  const data = localStorage.getItem('pa_expenses');
  return data ? JSON.parse(data) : [];
};

export const addExpense = (expense: Expense): void => {
  const expenses = getExpenses();
  expenses.push(expense);
  localStorage.setItem('pa_expenses', JSON.stringify(expenses));
};

export const deleteExpense = (id: string): void => {
  const expenses = getExpenses().filter(e => e.id !== id);
  localStorage.setItem('pa_expenses', JSON.stringify(expenses));
};

export const calculateInventory = (): InventoryStats => {
  const transactions = getTransactions();
  let totalStock = 0;
  let totalPurchaseVal = 0;
  let totalPurchaseLiters = 0;
  let totalSalesVal = 0;
  let totalSalesLiters = 0;

  transactions.forEach(t => {
    if (t.type === 'purchase') {
      totalStock += t.liters;
      totalPurchaseVal += t.total;
      totalPurchaseLiters += t.liters;
    } else {
      totalStock -= t.liters;
      totalSalesVal += t.total;
      totalSalesLiters += t.liters;
    }
  });

  const avgBuyPrice = totalPurchaseLiters > 0 ? totalPurchaseVal / totalPurchaseLiters : 0;
  // Simple Profit: Sales - (Sold Liters * Avg Buy Price)
  // This is a FIFO approximation or Weighted Average approximation. 
  // For this app, let's use: Total Sales Revenue - (Liters Sold * Current Avg Buy Price)
  const costOfGoodsSold = totalSalesLiters * avgBuyPrice;
  const profit = totalSalesVal - costOfGoodsSold;

  return {
    currentStock: totalStock,
    avgBuyPrice,
    totalSalesValue: totalSalesVal,
    totalPurchaseValue: totalPurchaseVal,
    profit
  };
};

export const calculateCustomerBalances = (): CustomerBalance[] => {
  const customers = getCustomers();
  const transactions = getTransactions();
  
  return customers.map(c => {
    const custTrans = transactions.filter(t => t.customerId === c.id);
    const totalBought = custTrans.filter(t => t.type === 'sale').reduce((acc, curr) => acc + curr.total, 0);
    const totalSold = custTrans.filter(t => t.type === 'purchase').reduce((acc, curr) => acc + curr.total, 0);
    
    return {
      customerId: c.id,
      totalBought,
      totalSold,
      balance: totalBought - totalSold // + means they owe us (debtor), - means we owe them (creditor)
    };
  });
};

export const generateNextCustomerCode = (): string => {
  const customers = getCustomers();
  const count = customers.length + 1;
  return `C-${count.toString().padStart(3, '0')}`;
};