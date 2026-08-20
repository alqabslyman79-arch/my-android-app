import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  CalendarCheck,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  ChevronLeft,
  Briefcase,
  Star,
  Settings,
  Bell,
  Wallet,
  Sparkles,
  Edit2,
  Check,
  Download,
  FileArchive,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    navigateTo,
    bookings,
    favorites,
    updateUserProfile,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.location.city);
  const [district, setDistrict] = useState(currentUser.location.district);

  const userBookings = bookings.filter((b) =>
    currentUser.role === 'customer'
      ? b.customerId === currentUser.id
      : b.technicianId === currentUser.id
  );

  const completedCount = userBookings.filter((b) => b.status === 'completed').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      location: {
        ...currentUser.location,
        city,
        district,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 pb-24 sm:pb-12 max-w-2xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  {currentUser.role === 'customer'
                    ? 'عميل'
                    : currentUser.role === 'technician'
                    ? 'فني معتمد'
                    : 'مدير النظام'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.phone}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.location.city} - {currentUser.location.district}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">{isEditing ? 'إلغاء' : 'تعديل'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-3 border-t border-slate-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">المدينة</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">الحي</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700"
            >
              حفظ التعديلات
            </button>
          </form>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="text-lg font-black text-slate-900 block">{userBookings.length}</span>
            <span className="text-[10px] text-slate-500 font-bold">إجمالي الطلبات</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="text-lg font-black text-emerald-600 block">{completedCount}</span>
            <span className="text-[10px] text-slate-500 font-bold">الطلبات المكتملة</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="text-lg font-black text-rose-500 block">{favorites.length}</span>
            <span className="text-[10px] text-slate-500 font-bold">المفضلة</span>
          </div>
        </div>
      </div>

      {/* Role Switcher Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black">تبديل واجهة العرض والتجربة</h3>
            <p className="text-xs text-slate-400">
              اختر دورك لتجربة كامل ميزات التطبيق (العميل، الفني، أو مدير النظام)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => switchUserRole('customer')}
            className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
              currentUser.role === 'customer'
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            👤 العميل
          </button>
          <button
            type="button"
            onClick={() => switchUserRole('technician')}
            className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
              currentUser.role === 'technician'
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🛠️ الفني
          </button>
          <button
            type="button"
            onClick={() => switchUserRole('admin')}
            className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
              currentUser.role === 'admin'
                ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            👑 لوحة الإدارة
          </button>
        </div>
      </div>

      {/* Menu Links */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {currentUser.role === 'admin' && (
          <button
            type="button"
            onClick={() => navigateTo('admin_dashboard')}
            className="w-full p-4 flex items-center justify-between text-right hover:bg-purple-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-purple-900 block">
                  لوحة تحكم الإدارة الشاملة
                </span>
                <span className="text-[10px] text-purple-600">
                  إدارة المستخدمين والفنيين والطلبات والشكاوى
                </span>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-purple-400 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        <button
          type="button"
          onClick={() => navigateTo('orders')}
          className="w-full p-4 flex items-center justify-between text-right hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800">سجل الطلبات السابقة والحالية</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('favorites')}
          className="w-full p-4 flex items-center justify-between text-right hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800">قائمة الفنيين المفضلين</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('notifications')}
          className="w-full p-4 flex items-center justify-between text-right hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800">الإشعارات والتنبيهات</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('complaints')}
          className="w-full p-4 flex items-center justify-between text-right hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800">الدعم الفني وتقديم الشكاوى</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('about')}
          className="w-full p-4 flex items-center justify-between text-right hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block">عن التطبيق وفريق العمل</span>
              <span className="text-[10px] text-indigo-600 font-bold">المصمم والمهندس: وليد الحداد</span>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Download Project ZIP */}
        <a
          href="/khadamati-app.zip"
          download="khadamati-app.zip"
          className="w-full p-4 flex items-center justify-between text-right bg-emerald-50/50 hover:bg-emerald-100/70 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-emerald-900 block flex items-center gap-1.5">
                <span>تحميل كود التطبيق كملف مضغوط (ZIP)</span>
                <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-800 text-[9px] rounded-full font-bold">مباشر</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                تنزيل ملف khadamati-app.zip بضغطة زر
              </span>
            </div>
          </div>
          <Download className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
        </a>
      </div>

      {/* Logout button */}
      <button
        type="button"
        onClick={() => navigateTo('auth_login')}
        className="w-full p-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>تسجيل الخروج من الحساب</span>
      </button>
    </div>
  );
};
