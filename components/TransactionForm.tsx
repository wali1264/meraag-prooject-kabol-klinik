import React, { useState, useEffect } from 'react';
import { Customer, Transaction, TransactionType } from '../types';
import { getCustomers, addTransaction } from '../services/dataService';
import { Save, Calculator } from 'lucide-react';
import { CURRENCY } from '../constants';

interface TransactionFormProps {
  type: TransactionType;
  onSuccess: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, onSuccess }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    liters: '' as any,
    pricePerLiter: '' as any,
  });

  useEffect(() => {
    const allCustomers = getCustomers();
    // Filter customers:
    // If Sale, show 'buyer' or 'both'
    // If Purchase, show 'seller' or 'both'
    const filtered = allCustomers.filter(c => {
      if (type === 'sale') return c.type === 'buyer' || c.type === 'both';
      return c.type === 'seller' || c.type === 'both';
    });
    setCustomers(filtered);
  }, [type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    const qty = parseFloat(formData.liters) || 0;
    const price = parseFloat(formData.pricePerLiter) || 0;
    return qty * price;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.liters || !formData.pricePerLiter) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: formData.date,
      customerId: formData.customerId,
      description: formData.description,
      liters: parseFloat(formData.liters),
      pricePerLiter: parseFloat(formData.pricePerLiter),
      total: calculateTotal(),
      type: type,
      createdAt: new Date().toISOString(),
    };

    addTransaction(newTransaction);
    // Reset form
    setFormData({
      customerId: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      liters: '',
      pricePerLiter: '',
    });
    onSuccess();
  };

  const isSale = type === 'sale';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className={`mb-6 pb-4 border-b ${isSale ? 'border-green-100' : 'border-red-100'}`}>
        <h2 className={`text-xl font-bold ${isSale ? 'text-green-700' : 'text-red-700'}`}>
          {isSale ? '📘 ثبت فروش جدید' : '📗 ثبت خرید جدید'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {isSale ? 'ثبت مقدار تیل فروخته شده به مشتری.' : 'ثبت مقدار تیل خریداری شده از تامین کننده.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isSale ? 'مشتری' : 'تامین کننده'}
            </label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
              required
            >
              <option value="">{isSale ? 'انتخاب مشتری' : 'انتخاب تامین کننده'}</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مقدار (لیتر)</label>
            <input
              type="number"
              step="0.01"
              name="liters"
              value={formData.liters}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">فی لیتر ({CURRENCY})</label>
            <input
              type="number"
              step="0.01"
              name="pricePerLiter"
              value={formData.pricePerLiter}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
              required
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">جمله ({CURRENCY})</label>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-800 font-bold flex items-center justify-between">
                <span>{calculateTotal().toLocaleString('fa-IR')}</span>
                <Calculator size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
           <textarea
             name="description"
             rows={3}
             value={formData.description}
             onChange={handleChange}
             className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
             placeholder="یادداشت اختیاری..."
           />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all ${
              isSale 
                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' 
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
            }`}
          >
            <Save size={18} />
            {isSale ? 'ثبت فروش' : 'ثبت خرید'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;