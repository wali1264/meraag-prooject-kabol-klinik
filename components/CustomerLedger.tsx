import React, { useState, useEffect } from 'react';
import { Customer, CustomerBalance } from '../types';
import { getCustomers, saveCustomer, calculateCustomerBalances, generateNextCustomerCode } from '../services/dataService';
import { CURRENCY } from '../constants';
import { Plus, Search, Phone, User, RefreshCw } from 'lucide-react';

const CustomerLedger: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [balances, setBalances] = useState<CustomerBalance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New customer form state
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    type: 'both'
  });

  const loadData = () => {
    setCustomers(getCustomers());
    setBalances(calculateCustomerBalances());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name) return;

    const customer: Customer = {
      id: crypto.randomUUID(),
      code: generateNextCustomerCode(),
      name: newCustomer.name,
      phone: newCustomer.phone || '',
      type: newCustomer.type as any,
      createdAt: new Date().toISOString()
    };

    saveCustomer(customer);
    setIsModalOpen(false);
    setNewCustomer({ name: '', phone: '', type: 'both' });
    loadData();
  };

  const getBalanceInfo = (customerId: string) => {
    return balances.find(b => b.customerId === customerId);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">دفتر مشتریان</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 transition"
        >
          <Plus size={18} /> مشتری جدید
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="جستجو با نام یا کد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={loadData} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-100 text-gray-600 text-sm font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">کد</th>
                <th className="px-6 py-4">نام</th>
                <th className="px-6 py-4">نوع</th>
                <th className="px-6 py-4 text-left">مجموع خرید</th>
                <th className="px-6 py-4 text-left">مجموع فروش</th>
                <th className="px-6 py-4 text-left">بیلانس ({CURRENCY})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map(customer => {
                const bal = getBalanceInfo(customer.id);
                const balanceVal = bal ? bal.balance : 0;
                const isDebtor = balanceVal > 0;
                const isCreditor = balanceVal < 0;

                return (
                  <tr key={customer.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">{customer.code}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{customer.name}</span>
                        {customer.phone && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone size={10} /> {customer.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        customer.type === 'buyer' ? 'bg-green-50 text-green-700 border-green-200' :
                        customer.type === 'seller' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {customer.type === 'buyer' ? 'خریدار' : customer.type === 'seller' ? 'فروشنده' : 'هر دو'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left text-gray-600">
                      {bal?.totalBought.toLocaleString('fa-IR')}
                    </td>
                    <td className="px-6 py-4 text-left text-gray-600">
                      {bal?.totalSold.toLocaleString('fa-IR')}
                    </td>
                    <td className="px-6 py-4 text-left font-bold" dir="ltr">
                       {balanceVal === 0 && <span className="text-gray-400">-</span>}
                       {isDebtor && <span className="text-red-600">+{balanceVal.toLocaleString('fa-IR')} (بدهکار)</span>}
                       {isCreditor && <span className="text-green-600">{balanceVal.toLocaleString('fa-IR')} (طلبکار)</span>}
                    </td>
                  </tr>
                );
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    مشتری یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={24} className="text-blue-600" /> مشتری جدید
            </h2>
            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
                <input 
                  type="text" 
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="مثلاً: احمد کریمی"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس (اختیاری)</label>
                <input 
                  type="text" 
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="07..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع</label>
                <select 
                  value={newCustomer.type}
                  onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value as any})}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="both">هر دو (خریدار و فروشنده)</option>
                  <option value="buyer">خریدار (از ما خرید می‌کند)</option>
                  <option value="seller">فروشنده (به ما می‌فروشد)</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  لغو
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLedger;