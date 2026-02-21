
import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Printer } from 'lucide-react';
import { AppData, Sale } from '../types';
import { generateId, formatCurrency, formatNumber, getTodayStr } from '../utils';

interface SalesJournalProps {
  data: AppData;
  onAddSale: (sale: Sale) => void;
  onDeleteSale: (id: string) => void;
}

const SalesJournal: React.FC<SalesJournalProps> = ({ data, onAddSale, onDeleteSale }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    date: getTodayStr(),
    customerId: '',
    description: '',
    liters: 0,
    pricePerLiter: 0
  });

  const calculatedTotal = useMemo(() => {
    return (formData.liters || 0) * (formData.pricePerLiter || 0);
  }, [formData.liters, formData.pricePerLiter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || formData.liters <= 0 || formData.pricePerLiter <= 0) return;

    const newSale: Sale = {
      id: generateId(),
      ...formData,
      total: calculatedTotal
    };

    onAddSale(newSale);
    setFormData({
      date: getTodayStr(),
      customerId: '',
      description: '',
      liters: 0,
      pricePerLiter: 0
    });
    setShowForm(false);
  };

  const filteredSales = data.sales.filter(s => 
    s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.customers.find(c => c.id === s.customerId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            className="block w-full pr-10 pl-3 py-2 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="جستجو در فروش..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> ثبت فروش جدید
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">مشتری</label>
              <select
                required
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              >
                <option value="">انتخاب مشتری...</option>
                {data.customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">فی لیتر (AFN)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">جمله (AFN) - محاسبه خودکار</label>
              <input
                type="text"
                disabled
                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 font-bold text-blue-700"
                value={formatCurrency(calculatedTotal)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="جزئیات اضافی..."
              />
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md"
              >
                ثبت در روزنامچه
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
              <th className="px-6 py-4 text-sm font-bold text-gray-600">مشتری</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">مقدار (لیتر)</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">فی لیتر</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">جمله کل</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4 text-sm text-gray-700">{sale.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {data.customers.find(c => c.id === sale.customerId)?.name || 'نامعلوم'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{formatNumber(sale.liters)}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(sale.pricePerLiter)}</td>
                <td className="px-6 py-4 text-sm font-bold text-blue-600">{formatCurrency(sale.total)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-blue-600"><Printer size={18} /></button>
                    <button 
                      onClick={() => onDeleteSale(sale.id)}
                      className="p-1 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSales.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">هیچ سابقه فروشی یافت نشد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesJournal;
