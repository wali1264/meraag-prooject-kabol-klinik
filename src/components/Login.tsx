import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const data = await res.json();
      login(data.role);
    } else {
      setError('رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ورود به صرافی پرو</h1>
          <p className="text-gray-500 mt-2">لطفا رمز عبور خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-center text-lg tracking-widest"
              placeholder="••••••••"
            />
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            ورود به سیستم
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>رمز پیش‌فرض مدیر: admin123</p>
          <p>رمز پیش‌فرض کارمند: user123</p>
        </div>
      </div>
    </div>
  );
}
