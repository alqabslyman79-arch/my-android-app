import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Code,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  Share2,
  Download,
  FileArchive,
} from 'lucide-react';

export const AboutScreen: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div className="space-y-5 pb-24 sm:pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="p-2 -mr-2 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900">عن تطبيق خدمتي</h1>
            <p className="text-xs text-slate-500">المنصة الشاملة للخدمات والصيانة المنزلية</p>
          </div>
        </div>
      </div>

      {/* Direct Download ZIP Action Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-right">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <FileArchive className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black">تحميل المشروع كملف مضغوط (ZIP)</h3>
            <p className="text-xs text-emerald-100 mt-0.5">تحميل كود التطبيق المصدري بالكامل جاهز للتشغيل والتطوير</p>
          </div>
        </div>

        <a
          href="/khadamati-app.zip"
          download="khadamati-app.zip"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>تنزيل الملف (ZIP)</span>
        </a>
      </div>

      {/* Main Branding Card */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white mx-auto flex items-center justify-center shadow-lg">
          <Wrench className="w-10 h-10 text-emerald-300" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">تطبيق خِدمَتي</h2>
          <p className="text-xs sm:text-sm text-emerald-200 font-bold mt-1">
            Khadamati - Home Services & Maintenance Platform
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-white/15 rounded-full text-xs font-mono">
            الإصدار v2.4.0 المعتمد
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md mx-auto">
          منصة تقنية رائدة تربط بين طالبي الخدمات المنزلية ونخبة من الفنيين والمهنيين المعتمدين والمفحوصين، لضمان أعلى مستويات الجودة والأمان والسرعة بأسعار عادلة وشفافة.
        </p>
      </div>

      {/* Creator & Engineer Attribution Highlight (Requested by User) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/40 rounded-3xl p-6 text-center space-y-3 shadow-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-md">
          <Code className="w-6 h-6" />
        </div>

        <div>
          <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">
            التطوير الهندسي والتصميم الرقمي
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            المصمم والمهندس: وليد الحداد
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            تم تصميم وبرمجة هذا النظام وفق أعلى معايير الجودة وتجربة المستخدم وتوافقية الـ RTL وقواعد البيانات الفورية.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold text-emerald-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>حقوق التطوير والتصميم محفوظة © {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900">فنيون معتمدون</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            فحص هوية وسجل مهني شامل لجميع مقدمي الخدمات قبل قبولهم.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900">ضمان الخدمة</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ضمان على الأعمال وخدمات ما بعد الصيانة مع حماية كاملة للمدفوعات.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900">دعم متواصل 24/7</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            فريق خدمة عملاء متواجد على مدار الساعة للرد على استفساراتكم.
          </p>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400">قنوات التواصل والدعم الفني</h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>الرقم الموحد للدعم:</span>
            </div>
            <span className="font-mono font-bold text-slate-900 dir-ltr">920001234</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>البريد الإلكتروني:</span>
            </div>
            <span className="font-mono font-bold text-slate-900">support@khadamati.app</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>الموقع الإلكتروني:</span>
            </div>
            <span className="font-mono font-bold text-slate-900">www.khadamati.app</span>
          </div>
        </div>
      </div>
    </div>
  );
};
