
import React, { useState } from 'react';
import { Plus, UserPlus, Phone, CreditCard, Trash2, Search } from 'lucide-react';
import { AppData, Customer, CustomerType } from '../types';
import { generateId, generateCustomerCode, formatCurrency, formatNumber } from '../utils';

interface CustomersProps {
  data: AppData;
  onAddCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

const Customers: React.FC<CustomersProps> = ({ data, onAddCustomer, onDeleteCustomer }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: CustomerType.BUYER
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newCustomer: Customer = {
      id: generateId(),
      code: generateCustomerCode(data.customers.length),
      name: formData.name,
      phone: formData.phone,
      type: formData.type,
      createdAt: new Date().toISOString()
    };

    onAddCustomer(newCustomer);
    setFormData({ name: '', phone: '', type: CustomerType.BUYER });
    setShowForm(false);
  };

  const getCustomerBalance = (customerId: string) => {
    const customerSales = data.sales.filter(s => s.customerId === customerId);
    const totalSales = customerSales.reduce((acc, s) => acc + s.total, 0);
    // Note: In a real app, we'd also subtract actual "payments" received. 
    // For this prototype, we assume the balance is the total sold.
    return totalSales;
  };

  const filteredCustomers = data.customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="block w-full pr-10 pl-3 py-2 border border-gray-200 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-sm"
            placeholder="جستجوی مشتری (نام یا کد)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <UserPlus size={20} /> افزودن مشتری جدید
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل (اجباری)</label>
              <input
                type="text"
                required
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="مثلاً: حاجی محمد"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس (اختیاری)</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="07xxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع مشتری</label>
              <select
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as CustomerType})}
              >
                {Object.values(CustomerType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md"
              >
                ثبت مشتری
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const balance = getCustomerBalance(customer.id);
          return (
            <div key={customer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-50 text-purple-600 font-bold px-3 py-1 rounded-lg text-sm">
                  {customer.code}
                </div>
                <button 
                  onClick={() => onDeleteCustomer(customer.id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{customer.name}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone size={14} /> {customer.phone || 'فاقد شماره'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CreditCard size={14} /> نوع: {customer.type}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="text-xs text-gray-400">بیلانس فعلی (بدهکاری)</div>
                <div className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(balance)}
                </div>
              </div>
            </div>
          );
        })}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">هیچ مشتری در سیستم ثبت نشده است.</div>
        )}
      </div>
    </div>
  );
};

export default Customers;
