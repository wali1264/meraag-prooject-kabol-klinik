import React, { useState, useEffect } from 'react';
import { Expense } from '../types';
import { addExpense, getExpenses, deleteExpense } from '../services/dataService';
import { CURRENCY } from '../constants';
import { Plus, Trash2, Wallet } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'کرایه', 'معاش پرسونل', 'برق', 'غذا', 'ترمیمات', 'مالیات', 'متفرقه'
];

const ExpensesView: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    date: new Date().toISOString().split('T')[0],
    category: 'متفرقه',
    description: '',
    amount: '' as any
  });

  const loadData = () => {
    const data = getExpenses();
    // Sort by date descending
    data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setExpenses(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.category) return;

    const expense: Expense = {
      id: crypto.randomUUID(),
      date: newExpense.date || new Date().toISOString().split('T')[0],
      category: newExpense.category,
      description: newExpense.description || '',
      amount: parseFloat(newExpense.amount as any),
      createdAt: new Date().toISOString()
    };

    addExpense(expense);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: 'متفرقه',
      description: '',
      amount: '' as any
    });
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این مورد مطمئن هستید؟')) {
      deleteExpense(id);
      loadData();
    }
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">مدیریت مصارف</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Wallet size={20} className="text-orange-500" /> ثبت مصرف جدید
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ</label>
              <input 
                type="date"
                required
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
              <select 
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ ({CURRENCY})</label>
              <input 
                type="number"
                required
                min="0"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value as any})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
              <textarea 
                rows={3}
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="جزئیات بیشتر..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
            >
              <Plus size={18} /> ثبت مصرف
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2 space-y-4">
           {/* Summary Card */}
           <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex justify-between items-center">
              <div>
                 <p className="text-orange-800 font-medium text-sm">مجموع مصارف ثبت شده</p>
                 <p className="text-2xl font-bold text-orange-900 mt-1">{totalExpenses.toLocaleString('fa-IR')} <span className="text-xs">{CURRENCY}</span></p>
              </div>
              <div className="bg-white p-3 rounded-full shadow-sm text-orange-500">
                 <Wallet size={24} />
              </div>
           </div>

           {/* Table */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-right text-sm">
                 <thead className="bg-gray-50 text-gray-600 font-semibold">
                   <tr>
                     <th className="px-4 py-3">تاریخ</th>
                     <th className="px-4 py-3">دسته</th>
                     <th className="px-4 py-3">توضیحات</th>
                     <th className="px-4 py-3 text-left">مبلغ ({CURRENCY})</th>
                     <th className="px-4 py-3 text-center">عملیات</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {expenses.map(item => (
                     <tr key={item.id} className="hover:bg-gray-50">
                       <td className="px-4 py-3 text-gray-600">{item.date}</td>
                       <td className="px-4 py-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{item.category}</span>
                       </td>
                       <td className="px-4 py-3 text-gray-500">{item.description || '-'}</td>
                       <td className="px-4 py-3 text-left font-bold text-gray-800">{item.amount.toLocaleString('fa-IR')}</td>
                       <td className="px-4 py-3 text-center">
                         <button 
                           onClick={() => handleDelete(item.id)}
                           className="text-red-400 hover:text-red-600 transition p-1"
                           title="حذف"
                         >
                           <Trash2 size={16} />
                         </button>
                       </td>
                     </tr>
                   ))}
                   {expenses.length === 0 && (
                     <tr>
                       <td colSpan={5} className="text-center py-8 text-gray-400">
                         هیچ مصرفی ثبت نشده است.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesView;