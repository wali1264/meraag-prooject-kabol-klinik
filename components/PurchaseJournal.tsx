
import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, ShieldCheck } from 'lucide-react';
import { AppData, Purchase } from '../types';
import { generateId, formatCurrency, formatNumber, getTodayStr } from '../utils';

interface PurchaseJournalProps {
  data: AppData;
  onAddPurchase: (purchase: Purchase) => void;
  onDeletePurchase: (id: string) => void;
}

const PurchaseJournal: React.FC<PurchaseJournalProps> = ({ data, onAddPurchase, onDeletePurchase }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    date: getTodayStr(),
    description: '',
    liters: 0,
    pricePerLiter: 0
  });

  const calculatedTotal = useMemo(() => {
    return (formData.liters || 0) * (formData.pricePerLiter || 0);
  }, [formData.liters, formData.pricePerLiter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.liters <= 0 || formData.pricePerLiter <= 0 || !formData.description) return;

    const newPurchase: Purchase = {
      id: generateId(),
      ...formData,
      total: calculatedTotal
    };

    onAddPurchase(newPurchase);
    setFormData({
      date: getTodayStr(),
      description: '',
      liters: 0,
      pricePerLiter: 0
    });
    setShowForm(false);
  };

  const filteredPurchases = data.purchases.filter(p => 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
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
            className="block w-full pr-10 pl-3 py-2 border border-gray-200 rounded-xl focus:ring-red-500 focus:border-red-500 text-sm"
            placeholder="جستجو در خریدها (تانکر/شرکت)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> ثبت خرید جدید (ورودی)
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ</label>
              <input
                type="date"
                required
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام تانکر / شرکت فروشنده</label>
              <input
                type="text"
                required
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="مثلاً: تانکر احمدی"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مقدار (لیتر)</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.liters || ''}
                onChange={(e) => setFormData({...formData, liters: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">فی لیتر خرید (AFN)</label>
              <input
                type="number"
                step="0.1"
                required
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.pricePerLiter || ''}
                onChange={(e) => setFormData({...formData, pricePerLiter: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">جمله خرید کل (AFN)</label>
              <input
                type="text"
                disabled
                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 font-bold text-red-700"
                value={formatCurrency(calculatedTotal)}
              />
            </div>
            <div className="flex items-end">
               <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                 <ShieldCheck size={16} className="text-green-500" />
                 <span>بعد از ثبت، موجودی کل افزایش می‌یابد.</span>
               </div>
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
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
              >
                تایید و افزایش موجودی
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">تاریخ</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">منبع (شرکت/تانکر)</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">مقدار (لیتر)</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">فی لیتر</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">جمله خرید</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPurchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-red-50/30 transition-colors group">
                <td className="px-6 py-4 text-sm text-gray-700">{purchase.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {purchase.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{formatNumber(purchase.liters)}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(purchase.pricePerLiter)}</td>
                <td className="px-6 py-4 text-sm font-bold text-red-600">{formatCurrency(purchase.total)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onDeletePurchase(purchase.id)}
                      className="p-1 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPurchases.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">هیچ سابقه خریدی یافت نشد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseJournal;
