import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Bell,
  Globe,
  Moon,
  Shield,
  Trash2,
  Download,
  ArrowRight,
  CheckCircle2,
  FileArchive,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { goBack, resetAllDemoData, navigateTo } = useApp();

  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gpsPrecision, setGpsPrecision] = useState('high');
  const [appLang, setAppLang] = useState('ar');

  return (
    <div className="space-y-4 pb-24 sm:pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="p-2 -mr-2 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900">إعدادات التطبيق</h1>
            <p className="text-xs text-slate-500">تخصيص التنبيهات واللغة وإدارة التخزين</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900">التفضيلات العامة</h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-800 block">لغة التطبيق</span>
                <span className="text-[11px] text-slate-400">واجهة المستخدم ودعم RTL</span>
              </div>
            </div>
            <select
              value={appLang}
              onChange={(e) => setAppLang(e.target.value)}
              className="bg-slate-50 border border-slate-200 font-bold text-slate-800 p-1.5 rounded-xl text-xs"
            >
              <option value="ar">العربية (Arabic) 🇸🇦</option>
              <option value="en">English 🇺🇸</option>
            </select>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-bold text-slate-800 block">إشعارات الطلبات المباشرة</span>
                <span className="text-[11px] text-slate-400">تنبيهات فورية بتغير حالة الطلبات والرسائل</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifsEnabled}
              onChange={(e) => setNotifsEnabled(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-purple-600" />
              <div>
                <span className="font-bold text-slate-800 block">دقة تحديد الموقع (GPS)</span>
                <span className="text-[11px] text-slate-400">تحديد موقع الفني والعميل بدقة على الخريطة</span>
              </div>
            </div>
            <select
              value={gpsPrecision}
              onChange={(e) => setGpsPrecision(e.target.value)}
              className="bg-slate-50 border border-slate-200 font-bold text-slate-800 p-1.5 rounded-xl text-xs"
            >
              <option value="high">دقة عالية (GPS)</option>
              <option value="medium">متوسطة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project & Data Management */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-slate-900">إدارة البيانات والنسخ الاحتياطي</h3>

        <div className="space-y-2 text-xs">
          <button
            type="button"
            onClick={() => navigateTo('flutter_export')}
            className="w-full p-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl flex items-center justify-between text-sky-900 font-bold hover:bg-sky-100 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileArchive className="w-4 h-4 text-sky-600" />
              <span>تصدير كود Flutter & APK وبناء أندرويد</span>
            </div>
            <span className="text-[10px] bg-sky-200 px-2 py-0.5 rounded-full font-extrabold">جاهز</span>
          </button>

          <a
            href="/khadamati-app.zip"
            download="khadamati-app.zip"
            className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-900 font-bold hover:bg-emerald-100 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>تحميل كود المشروع كملف مضغوط (khadamati-app.zip)</span>
            </div>
            <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full font-extrabold">تنزيل مباشر</span>
          </a>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('هل تريد مسح البيانات وإعادة تعيين البيانات الافتراضية؟')) {
                resetAllDemoData();
              }
            }}
            className="w-full p-3 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-2xl flex items-center justify-between text-slate-700 hover:text-rose-700 font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4" />
              <span>إعادة ضبط كافة البيانات التجريبية لحالتها الأولى</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
