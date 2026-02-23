import React, { useState, useEffect, useRef } from 'react';
import { Save, Calculator, Search, X, Check } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  code: string;
  phone: string;
}

export default function Journal() {
  const [formData, setFormData] = useState({
    type: 'win', // win, receipt, buy, sell
    customer_id: '',
    amount: '',
    rate: '',
    fee1: '',
    fee2: '',
    description: ''
  });
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setCustomers([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/customers?search=${searchQuery}`);
          if (res.ok) {
            const data = await res.json();
            setCustomers(data);
          }
        } catch (error) {
          console.error("Error fetching customers:", error);
        } finally {
          setIsSearching(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCustomers([]);
    }
  }, [searchQuery]);

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.rate) || 0;
    return amount * rate;
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({ ...formData, customer_id: customer.id.toString() });
    setSearchQuery('');
    setCustomers([]);
  };

  const clearSelectedCustomer = () => {
    setSelectedCustomer(null);
    setFormData({ ...formData, customer_id: '' });
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id) return alert('لطفا مشتری را انتخاب کنید');

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customer_id: parseInt(formData.customer_id),
          amount: parseFloat(formData.amount),
          rate: parseFloat(formData.rate) || 1,
          fee1: parseFloat(formData.fee1) || 0,
          fee2: parseFloat(formData.fee2) || 0,
        }),
      });

      if (res.ok) {
        alert('تراکنش با موفقیت ثبت شد');
        setFormData({
          type: 'win',
          customer_id: '',
          amount: '',
          rate: '',
          fee1: '',
          fee2: '',
          description: ''
        });
        setSelectedCustomer(null);
        setSearchQuery('');
      } else {
        const errorData = await res.json();
        alert(`خطا در ثبت تراکنش: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert('خطا در برقراری ارتباط با سرور');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            روزنامچه هوشمند
          </h2>
          <p className="text-sm text-gray-500 mt-1">ثبت تراکنش‌های روزانه با محاسبه خودکار</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Transaction Type */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'win', label: 'برد (بدهکار)', color: 'bg-red-50 text-red-700 border-red-200 peer-checked:bg-red-600 peer-checked:text-white' },
              { id: 'receipt', label: 'رسید (بستانکار)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 peer-checked:bg-emerald-600 peer-checked:text-white' },
              { id: 'buy', label: 'خرید ارز', color: 'bg-blue-50 text-blue-700 border-blue-200 peer-checked:bg-blue-600 peer-checked:text-white' },
              { id: 'sell', label: 'فروش ارز', color: 'bg-amber-50 text-amber-700 border-amber-200 peer-checked:bg-amber-600 peer-checked:text-white' },
            ].map((type) => (
              <label key={type.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type.id}
                  checked={formData.type === type.id}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="peer sr-only"
                />
                <div className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${type.color}`}>
                  {type.label}
                </div>
              </label>
            ))}
          </div>

          {/* Customer Search */}
          <div className="relative" ref={searchRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب مشتری</label>
            
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{selectedCustomer.name}</div>
                    <div className="text-xs text-gray-500">{selectedCustomer.code} | {selectedCustomer.phone}</div>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={clearSelectedCustomer}
                  className="p-2 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="جستجوی مشتری با نام، کد یا شماره تماس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                {isSearching && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}

            {customers.length > 0 && !selectedCustomer && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {customers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCustomer(c)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.code} | {c.phone}</div>
                    </div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">انتخاب</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">مبلغ اصلی</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نرخ ارز</label>
              <input
                type="number"
                required
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                placeholder="1"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-center">
              <span className="text-xs text-gray-500 mb-1">مبلغ کل (محاسبه خودکار)</span>
              <span className="text-xl font-bold text-gray-900 font-mono">
                {calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">فی ۱ (کارمزد ثابت)</label>
              <input
                type="number"
                value={formData.fee1}
                onChange={(e) => setFormData({ ...formData, fee1: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">فی ۲ (خدمات)</label>
              <input
                type="number"
                value={formData.fee2}
                onChange={(e) => setFormData({ ...formData, fee2: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                placeholder="0"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="توضیحات تکمیلی تراکنش..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            ثبت نهایی تراکنش
          </button>
        </form>
      </div>
    </div>
  );
}
