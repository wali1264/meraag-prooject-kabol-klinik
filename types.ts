
export enum CustomerType {
  BUYER = 'خریدار',
  SELLER = 'فروشنده',
  BOTH = 'هر دو'
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  type: CustomerType;
  createdAt: string;
}

export interface Sale {
  id: string;
  date: string;
  customerId: string;
  description: string;
  liters: number;
  pricePerLiter: number;
  total: number;
}

export interface Purchase {
  id: string;
  date: string;
  description: string; // Tanker or Company Name
  liters: number;
  pricePerLiter: number;
  total: number;
}

export interface AppData {
  customers: Customer[];
  sales: Sale[];
  purchases: Purchase[];
  settings: {
    lowStockThreshold: number;
    companyName: string;
    password: string; // New field for master password
  };
}
