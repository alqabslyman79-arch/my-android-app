import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Wrench,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

export const AuthLoginScreen: React.FC = () => {
  const { login, switchUserRole, navigateTo } = useApp();

  const [phone, setPhone] = useState('0501234567');
  const [password, setPassword] = useState('123456');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(phone, selectedRole);
    navigateTo('home');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
        {/* App Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">تسجيل الدخول</h1>
          <p className="text-xs text-slate-500">مرحباً بك مجدداً في منصة خِدمَتي للخدمات المنزلية</p>
        </div>

        {/* Role Switcher */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2 text-center">
            اختر نوع الحساب لتسجيل الدخول:
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {[
              { id: 'customer' as UserRole, label: '👤 عميل' },
              { id: 'technician' as UserRole, label: '🛠️ فني' },
              { id: 'admin' as UserRole, label: '👑 إدارة' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedRole(r.id);
                  if (r.id === 'technician') setPhone('0559876543');
                  else if (r.id === 'admin') setPhone('0500000000');
                  else setPhone('0501234567');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === r.id
                    ? 'bg-white text-emerald-700 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">رقم الجوال</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 pl-4 pr-10 py-3 rounded-2xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">كلمة المرور</label>
              <button
                type="button"
                onClick={() => alert('تم إرسال رمز التحقق المؤقت عبر رسالة SMS')}
                className="text-[11px] text-emerald-600 hover:underline font-bold"
              >
                الدخول برمز التحقق OTP
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 pl-4 pr-10 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <span>تسجيل الدخول</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-100 space-y-3">
          <p className="text-xs text-slate-600">
            ليس لديك حساب بعد؟{' '}
            <button
              type="button"
              onClick={() => navigateTo('auth_register')}
              className="text-emerald-600 font-extrabold hover:underline"
            >
              إنشاء حساب جديد
            </button>
          </p>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
          >
            تصفح التطبيق كزائر ←
          </button>
        </div>
      </div>
    </div>
  );
};
