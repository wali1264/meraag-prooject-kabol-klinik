export type CustomerType = 'buyer' | 'seller' | 'both';

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  type: CustomerType;
  createdAt: string;
}

export type TransactionType = 'sale' | 'purchase';

export interface Transaction {
  id: string;
  date: string;
  customerId: string;
  description: string;
  liters: number;
  pricePerLiter: number;
  total: number;
  type: TransactionType;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt: string;
}

export interface InventoryStats {
  currentStock: number;
  avgBuyPrice: number;
  totalSalesValue: number;
  totalPurchaseValue: number;
  profit: number;
}

export interface CustomerBalance {
  customerId: string;
  totalBought: number; // Money they spent (Sales to them)
  totalSold: number;   // Money we paid them (Purchases from them)
  balance: number;     // totalBought - totalSold (>0 they owe us, <0 we owe them)
}