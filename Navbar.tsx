import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  MapPin,
  Sparkles,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
  Info,
  Layers,
  Heart,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentScreen,
    navigateTo,
    goBack,
    history,
    notifications,
    updateCurrentUserProfile,
  } = useApp();

  const unreadNotifsCount = notifications.filter(
    (n) => n.userId === currentUser.id && !n.read
  ).length;

  const isSubScreen =
    history.length > 1 &&
    ![
      'home',
      'categories',
      'orders',
      'chats',
      'profile',
      'tech_dashboard',
      'admin_dashboard',
    ].includes(currentScreen);

  const cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'الخبر'];

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-[33px] z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand or Back Button */}
        <div className="flex items-center gap-2">
          {isSubScreen ? (
            <button
              type="button"
              onClick={goBack}
              className="p-2 -mr-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 text-sm font-semibold"
            >
              <ArrowRight className="w-5 h-5 text-slate-800" />
              <span className="hidden sm:inline">رجوع</span>
            </button>
          ) : (
            <div
              onClick={() => navigateTo(currentUser.role === 'admin' ? 'admin_dashboard' : currentUser.role === 'technician' ? 'tech_dashboard' : 'home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                خ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">خدمتي</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                    Khadamati
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 -mt-0.5 font-medium hidden sm:block">
                  منصة الخدمات والصيانة المنزلية
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Location selector (for Customer view) */}
        {currentUser.role === 'customer' && (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-500">الموقع:</span>
            <select
              value={currentUser.city}
              onChange={(e) => updateCurrentUserProfile({ city: e.target.value })}
              aria-label="اختر مدينتك لتحديد الخدمات المتاحة"
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search */}
          <button
            type="button"
            onClick={() => navigateTo('search')}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="بحث عن فني أو خدمة"
          >
            <Search className="w-4 h-4 text-slate-600" />
            <span className="hidden lg:inline bg-slate-100 px-2 py-0.5 rounded-md text-slate-500">
              بحث عن فني أو تصنيف...
            </span>
          </button>

          {/* Favorites */}
          {currentUser.role === 'customer' && (
            <button
              type="button"
              onClick={() => navigateTo('favorites')}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-rose-500 transition-colors relative"
              title="المفضلة"
            >
              <Heart className="w-5 h-5 text-slate-600" />
            </button>
          )}

          {/* Notifications */}
          <button
            type="button"
            onClick={() => navigateTo('notifications')}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors relative"
            title="الإشعارات"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadNotifsCount > 0 && (
              <span className="absolute 1.5 top-1.5 -right-0.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Avatar & Role */}
          <div
            onClick={() => navigateTo('profile')}
            className="flex items-center gap-2 cursor-pointer pr-1 pl-1 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-300 ring-2 ring-emerald-500/20"
            />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                {currentUser.name.split(' ')[0]}
              </p>
              <span className="text-[10px] text-slate-500 capitalize">
                {currentUser.role === 'customer'
                  ? 'عميل'
                  : currentUser.role === 'technician'
                  ? 'فني معتمد'
                  : 'مدير النظام'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
