import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Wrench, Shield, Smartphone, RotateCcw, Sparkles } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, switchUser, users, resetAllDemoData, navigateTo } = useApp();

  const customerUser = users.find((u) => u.role === 'customer') || users[0];
  const technicianUser = users.find((u) => u.role === 'technician') || users[2];
  const adminUser = users.find((u) => u.role === 'admin') || users[6];

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 px-3 py-1.5 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: Role Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-slate-400 font-medium hidden sm:inline flex-items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 inline ml-1" />
            تبديل الحساب السريع للتجربة:
          </span>

          {/* Customer Button */}
          <button
            type="button"
            onClick={() => switchUser(customerUser.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              currentUser.role === 'customer'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>عميل (أحمد)</span>
          </button>

          {/* Technician Button */}
          <button
            type="button"
            onClick={() => switchUser(technicianUser.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              currentUser.role === 'technician'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-blue-300" />
            <span>فني (م. طارق)</span>
          </button>

          {/* Admin Button */}
          <button
            type="button"
            onClick={() => switchUser(adminUser.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              currentUser.role === 'admin'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>لوحة المدير</span>
          </button>
        </div>

        {/* Right Side: Flutter Export & Reset */}
        <div className="flex items-center gap-2 mr-auto sm:mr-0">
          <button
            type="button"
            onClick={() => navigateTo('flutter_export')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-2.5 py-1 rounded-md font-semibold text-xs shadow-sm transition-all animate-pulse"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>تصدير كود Flutter & APK</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('هل تريد إعادة تعيين كافة البيانات التجريبية إلى حالتها الأصلية؟')) {
                resetAllDemoData();
              }
            }}
            title="إعادة ضبط البيانات"
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
