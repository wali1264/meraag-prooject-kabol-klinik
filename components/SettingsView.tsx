import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Lock, KeyRound, Download, Upload } from 'lucide-react';
import { verifyPassword, updatePassword } from '../services/dataService';

const SettingsView: React.FC = () => {
  const [passData, setPassData] = useState({ old: '', new: '' });
  const [msg, setMsg] = useState({ text: '', isError: false });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPassword(passData.old)) {
       setMsg({ text: 'رمز فعلی اشتباه است.', isError: true });
       return;
    }
    if (passData.new.length < 4) {
       setMsg({ text: 'رمز جدید باید حداقل ۴ رقم باشد.', isError: true });
       return;
    }
    updatePassword(passData.new);
    setMsg({ text: 'رمز عبور با موفقیت تغییر کرد.', isError: false });
    setPassData({ old: '', new: '' });
  };

  const handleExport = () => {
    // Include auth key to transfer password state to new device
    const backup = {
       pa_customers: localStorage.getItem('pa_customers'),
       pa_transactions: localStorage.getItem('pa_transactions'),
       pa_expenses: localStorage.getItem('pa_expenses'),
       pa_auth_key: localStorage.getItem('pa_auth_key'),
       backup_date: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `petroaccount_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic validation
        if (json.pa_customers && json.pa_transactions) {
           if(confirm('آیا مطمئن هستید؟ اطلاعات فعلی با اطلاعات فایل پشتیبان جایگزین خواهد شد. این عملیات قابل بازگشت نیست.')) {
              localStorage.setItem('pa_customers', json.pa_customers);
              localStorage.setItem('pa_transactions', json.pa_transactions);
              if (json.pa_expenses) {
                 localStorage.setItem('pa_expenses', json.pa_expenses);
              }
              
              // Restore password if present in backup (for new device migration)
              if (json.pa_auth_key) {
                localStorage.setItem('pa_auth_key', json.pa_auth_key);
              }

              alert('اطلاعات با موفقیت بازیابی شد. صفحه مجدداً بارگذاری می‌شود.');
              window.location.reload();
           }
        } else {
           alert('فایل انتخاب شده معتبر نیست یا فرمت آن قدیمی است.');
        }
      } catch (err) {
        alert('خطا در خواندن فایل.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Reset input value to allow re-uploading same file if needed
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">تنظیمات سیستم</h1>
      
      {/* General Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
           <Settings size={20} className="text-blue-600" /> تنظیمات عمومی
        </h2>
        
        <div className="space-y-4 max-w-xl">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام شرکت</label>
              <input 
                type="text" 
                defaultValue="PetroAccount AF" 
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">برای تغییر نام شرکت با پشتیبانی تماس بگیرید.</p>
           </div>
           
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">واحد پول</label>
              <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border" disabled>
                 <option>AFN (افغانی)</option>
              </select>
           </div>
        </div>
      </div>

      {/* Security Settings - Password Change */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
         <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
           <Lock size={20} className="text-orange-600" /> امنیت و ورود
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور فعلی</label>
              <div className="relative">
                 <KeyRound size={16} className="absolute right-3 top-3 text-gray-400" />
                 <input 
                  type="password" 
                  value={passData.old}
                  onChange={e => setPassData({...passData, old: e.target.value})}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 pr-10 border"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور جدید</label>
              <input 
                type="text" 
                value={passData.new}
                onChange={e => setPassData({...passData, new: e.target.value})}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border"
                required
                placeholder="حداقل ۴ کاراکتر"
              />
            </div>
            
            {msg.text && (
              <p className={`text-sm ${msg.isError ? 'text-red-600' : 'text-green-600'}`}>{msg.text}</p>
            )}

            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition flex items-center gap-2">
               <Save size={18} /> تغییر رمز عبور
            </button>
        </form>
      </div>

      {/* Data Management - Backup & Restore */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
           <RefreshCw size={20} className="text-blue-600" /> پشتیبان‌گیری و بازیابی
        </h2>
        <p className="text-sm text-gray-600 mb-4">
           می‌توانید از اطلاعات خود نسخه پشتیبان تهیه کنید یا اطلاعات قبلی را بازیابی نمایید.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
           <button 
             onClick={handleExport}
             className="flex-1 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg hover:bg-green-100 transition text-sm font-medium flex items-center justify-center gap-2"
           >
              <Download size={18} /> دانلود فایل پشتیبان
           </button>

           <label className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center gap-2 cursor-pointer">
              <Upload size={18} /> 
              <span>بازیابی فایل پشتیبان</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
           </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;