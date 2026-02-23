import React, { useState, useEffect } from 'react';
import { Search, UserPlus, FileText, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const fetchCustomers = async () => {
    const res = await fetch(`/api/customers?search=${search}`);
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    });
    
    if (res.ok) {
      setShowAddModal(false);
      setNewCustomer({ name: '', phone: '' });
      fetchCustomers();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const handleViewLedger = async (id: number) => {
    const res = await fetch(`/api/customers/${id}`);
    const data = await res.json();
    setSelectedCustomer(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مدیریت مشتریان</h2>
          <p className="text-gray-500 text-sm mt-1">لیست تمام مشتریان و وضعیت حساب آنها</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>ثبت مشتری جدید</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="جستجو با نام، کد یا شماره تماس..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">کد مشتری</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">نام کامل</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">شماره تماس</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">مانده حساب</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">وضعیت</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{customer.code}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{customer.phone}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${customer.balance > 0 ? 'text-red-500' : customer.balance < 0 ? 'text-emerald-500' : 'text-gray-500'}`}>
                    {Math.abs(customer.balance).toLocaleString()}
                    <span className="text-xs font-normal mr-1 text-gray-400">
                      {customer.balance > 0 ? 'بدهکار' : customer.balance < 0 ? 'بستانکار' : 'تسویه'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      فعال
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleViewLedger(customer.id)}
                      className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      صورتحساب
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">ثبت مشتری جدید</h3>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
                <input
                  required
                  type="text"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
                <input
                  required
                  type="tel"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  ثبت مشتری
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ledger Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-sm text-gray-500 font-mono mt-1">{selectedCustomer.code} | {selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">مانده حساب</p>
                <p className={`text-lg font-bold ${selectedCustomer.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {Math.abs(selectedCustomer.balance).toLocaleString()}
                  <span className="text-xs mr-1">{selectedCustomer.balance > 0 ? 'بدهکار' : 'بستانکار'}</span>
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">مجموع برد (بدهی)</p>
                <p className="text-lg font-bold text-gray-800">
                  {(selectedCustomer.stats?.total_wins || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">مجموع رسید (پرداخت)</p>
                <p className="text-lg font-bold text-gray-800">
                  {(selectedCustomer.stats?.total_receipts || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">مجموع کارمزد</p>
                <p className="text-lg font-bold text-gray-800">
                  {(selectedCustomer.stats?.total_fees || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">تاریخ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">نوع</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">مبلغ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">نرخ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">کل</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">توضیحات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedCustomer.transactions?.map((tx: any) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        {new Date(tx.created_at).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                          tx.type === 'win' ? 'bg-red-50 text-red-700' : 
                          tx.type === 'receipt' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {tx.type === 'win' ? <ArrowUpRight className="w-3 h-3" /> : 
                           tx.type === 'receipt' ? <ArrowDownLeft className="w-3 h-3" /> : null}
                          {tx.type === 'win' ? 'برد' : tx.type === 'receipt' ? 'رسید' : tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{tx.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{tx.rate.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-bold">{tx.total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{tx.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
