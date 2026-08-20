import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OffersSlider } from '../components/home/OffersSlider';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { TechnicianCard } from '../components/home/TechnicianCard';
import { MapPreview } from '../components/common/MapPreview';
import { BookingStatusBadge } from '../components/common/StatusBadge';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Clock,
  ThumbsUp,
  MapPin,
  ArrowLeft,
  CalendarCheck,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    technicians,
    bookings,
    categories,
    navigateTo,
    setSelectedBookingId,
    setFilterOptions,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Active user in-progress order snippet
  const activeOrder = bookings.find(
    (b) =>
      b.customerId === currentUser.id &&
      !['completed', 'cancelled'].includes(b.status)
  );

  // Filter top rated & nearby
  const topRatedTechnicians = [...technicians]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const nearbyTechnicians = technicians.filter(
    (t) => t.city === currentUser.city || t.isAvailable
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilterOptions((prev) => ({ ...prev, searchQuery }));
      navigateTo('search', { query: searchQuery });
    } else {
      navigateTo('search');
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Welcome & Search Bar Header */}
      <div className="bg-gradient-to-b from-emerald-700 to-teal-800 text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Background ambient shapes */}
        <div className="absolute top-0 -left-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur">
              👋 مرحباً بك، {currentUser.name.split(' ')[0]}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black leading-tight tracking-tight">
            ما هي الخدمة المنزلية التي تحتاجها اليوم؟
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">
            نوفر لك أمهر الفنيين المعتمدين في {currentUser.city} بضمان وأسعار شفافة
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن: سباك، كهربائي، تكييف، تنظيف..."
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-4 pr-11 py-3 rounded-2xl text-xs sm:text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow-md transition-all font-bold flex items-center justify-center flex-shrink-0"
              title="بحث"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Active Order Live Tracker (if any) */}
      {activeOrder && (
        <div
          onClick={() => {
            setSelectedBookingId(activeOrder.id);
            navigateTo('order_detail', { bookingId: activeOrder.id });
          }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-900">
                طلبك الحالي قيد المتابعة ({activeOrder.bookingNumber})
              </span>
            </div>
            <BookingStatusBadge status={activeOrder.status} size="sm" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={activeOrder.technicianAvatar}
                alt={activeOrder.technicianName}
                className="w-10 h-10 rounded-xl object-cover border border-emerald-200"
              />
              <div>
                <p className="text-xs font-extrabold text-slate-800">
                  {activeOrder.technicianName} ({activeOrder.specialtyName})
                </p>
                <p className="text-[11px] text-slate-500">
                  الموعد: {activeOrder.scheduledDate} • {activeOrder.scheduledTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <span>تفاصيل التتبع</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Featured Offers Slider */}
      <OffersSlider />

      {/* Popular Categories Grid */}
      <CategoryGrid limit={6} />

      {/* Fast Request / Emergency Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white flex-shrink-0">
            <Zap className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black leading-tight">
              هل تواجه عطلاً طارئاً؟ (كهرباء أو سباكة)
            </h3>
            <p className="text-xs text-amber-100 mt-0.5">
              اطلب فني طوارئ الآن ليصلك خلال 30 دقيقة داخل {currentUser.city}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFilterOptions({ onlyAvailable: true, city: currentUser.city });
            navigateTo('search', { emergency: true });
          }}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black shadow transition-transform active:scale-95"
        >
          طلب فني طوارئ فوري
        </button>
      </div>

      {/* Top Rated Technicians */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              أفضل الفنيين تقييماً ⭐
            </h2>
            <p className="text-xs text-slate-500">فنيون معتمدون حاصلون على أعلى التقييمات</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFilterOptions({ sortBy: 'rating' });
              navigateTo('search');
            }}
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            <span>عرض المزيد</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {topRatedTechnicians.map((tech) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      </div>

      {/* Nearby Technicians Map Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                الفنيون المتاحون بالقرب منك
              </h2>
              <p className="text-xs text-slate-500">
                في {currentUser.city} - {currentUser.district || 'وسط المدينة'}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
            {nearbyTechnicians.length} فني متاح
          </span>
        </div>

        <MapPreview
          location={currentUser.location}
          technicianLocation={technicians[0]?.location}
          height="h-56"
          showRoute
        />
      </div>

      {/* Guarantee & Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-800">فنيون معتمدون ومفحوصون</h4>
            <p className="text-[11px] text-slate-500">فحص هويات وسجلات مهنية كاملة</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-800">ضمان على الخدمة 30 يوماً</h4>
            <p className="text-[11px] text-slate-500">إعادة صيانة مجانية عند أي ملاحظة</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-800">أسعار واضحة ودفع آمن</h4>
            <p className="text-[11px] text-slate-500">لا توجد رسوم خفية أو مبالغ إضافية</p>
          </div>
        </div>
      </div>
    </div>
  );
};
