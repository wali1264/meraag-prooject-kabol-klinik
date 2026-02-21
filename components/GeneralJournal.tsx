import React, { useState, useEffect } from 'react';
import { getTransactions, getCustomers } from '../services/dataService';
import { Transaction, Customer } from '../types';
import { CURRENCY } from '../constants';
import { Search, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const GeneralJournal: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load and sort transactions descending by date
    const txs = getTransactions();
    txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setTransactions(txs);
    setCustomers(getCustomers());
  }, []);

  const getCustomerName = (id: string) => {
    const c = customers.find(cust => cust.id === id);
    return c ? c.name : 'ناشناس';
  };

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCustomerName(t.customerId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">روزنامچه عمومی</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50">
           <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="جستجو در توضیحات یا نام مشتری..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3">تاریخ</th>
                <th className="px-4 py-3">نوع</th>
                <th className="px-4 py-3">طرف حساب</th>
                <th className="px-4 py-3">توضیحات</th>
                <th className="px-4 py-3 text-left">مقدار (لیتر)</th>
                <th className="px-4 py-3 text-left">فی لیتر</th>
                <th className="px-4 py-3 text-left">جمله ({CURRENCY})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(t => {
                const isSale = t.type === 'sale';
                return (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{t.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        isSale ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {isSale ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                        {isSale ? 'فروش' : 'خرید'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{getCustomerName(t.customerId)}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{t.description || '-'}</td>
                    <td className="px-4 py-3 text-left font-mono">{t.liters.toLocaleString('fa-IR')}</td>
                    <td className="px-4 py-3 text-left text-gray-500 font-mono">{t.pricePerLiter.toLocaleString('fa-IR')}</td>
                    <td className="px-4 py-3 text-left font-bold font-mono text-gray-800">{t.total.toLocaleString('fa-IR')}</td>
                  </tr>
                );
              })}
               {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    هیچ تراکنشی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneralJournal;