import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/common/StatusBadge';
import { StarRating } from '../../components/common/StarRating';
import { MapPreview } from '../../components/common/MapPreview';
import {
  Wrench,
  CheckCircle2,
  Clock,
  DollarSign,
  Star,
  CalendarCheck,
  TrendingUp,
  MapPin,
  MessageSquare,
  Phone,
  Power,
  ChevronLeft,
  Eye,
  PlusCircle,
  Truck,
  PlayCircle,
  Sparkles,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export const TechDashboardScreen: React.FC = () => {
  const {
    currentUser,
    technicians,
    bookings,
    updateBookingStatus,
    toggleTechnicianAvailability,
    navigateTo,
    setSelectedBookingId,
    startOrOpenChat,
  } = useApp();

  const currentTech =
    technicians.find((t) => t.id === currentUser.id) ||
    technicians.find((t) => t.phone === currentUser.phone) ||
    technicians[0];

  const techBookings = bookings.filter(
    (b) => b.technicianId === currentTech?.id || b.technicianId === currentUser.id
  );

  const activeOrders = techBookings.filter(
    (b) => !['completed', 'cancelled'].includes(b.status)
  );

  const completedOrders = techBookings.filter((b) => b.status === 'completed');
  const totalEarnings = completedOrders.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-4 pb-24 sm:pb-12 max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentTech.avatar}
              alt={currentTech.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black">{currentTech.name}</h1>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[10px] font-bold">
                  {currentTech.specialtyName}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مرحباً بك في لوحة متابعة طلبات الصيانة وإدارة الخدمات
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-300 block">حالة التوفر لاستقبال الطلبات:</span>
              <span
                className={`text-xs font-black ${
                  currentTech.isAvailable ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {currentTech.isAvailable ? '● متاح وجاهز للعمل' : '○ غير متاح حالياً'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleTechnicianAvailability(currentTech.id)}
              className={`p-2 rounded-xl transition-all ${
                currentTech.isAvailable
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
              title="تغيير حالة التوفر"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">الأرباح المحققة</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-600">{totalEarnings} ر.س</div>
          <span className="text-[10px] text-slate-500">من {completedOrders.length} طلب مكتمل</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">الطلبات الجارية</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-600">{activeOrders.length}</div>
          <span className="text-[10px] text-slate-500">تحتاج متابعة وتنفيذ</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">التقييم العام</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900">{currentTech.rating} / 5</div>
          <span className="text-[10px] text-slate-500">({currentTech.reviewsCount} تقييم عملاء)</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">سعر الكشف</span>
            <Wrench className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-purple-600">{currentTech.basePrice} ر.س</div>
          <span className="text-[10px] text-slate-500">الزيارة والفحص</span>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => navigateTo('tech_services')}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-3xl shadow-sm text-right transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">إدارة الخدمات والأسعار</h4>
              <p className="text-[11px] text-slate-500">{currentTech.services.length} خدمة مفعلة</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('chats')}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-3xl shadow-sm text-right transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">محادثات العملاء</h4>
              <p className="text-[11px] text-slate-500">تواصل مباشر وتأكيد المواعيد</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('technician_detail', { technicianId: currentTech.id })}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-3xl shadow-sm text-right transition-all flex items-center justify-between group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">معاينة ملفي كما يراه العميل</h4>
              <p className="text-[11px] text-slate-500">التقييمات ومعرض الأعمال</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Active Orders Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">
              الطلبات الجارية والمستلمة ({activeOrders.length})
            </h2>
            <p className="text-xs text-slate-500">
              تحكم بحالة الطلب وقم بتحديثها للعميل لحظياً
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('orders')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            كل الطلبات ({techBookings.length})
          </button>
        </div>

        {activeOrders.length > 0 ? (
          <div className="space-y-3">
            {activeOrders.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      #{booking.bookingNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {booking.specialtyName}
                    </span>
                  </div>
                  <BookingStatusBadge status={booking.status} size="sm" />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.customerAvatar}
                      alt={booking.customerName}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {booking.customerName}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                        {booking.problemDescription}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {booking.scheduledDate} ({booking.scheduledTime})
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {booking.location.city} - {booking.location.district}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left flex-shrink-0">
                    <span className="text-sm font-black text-emerald-700 block">
                      {booking.totalPrice} ر.س
                    </span>
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </div>
                </div>

                {/* Technician Quick Action Bar */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startOrOpenChat(booking.technicianId, booking.customerId, booking.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 text-xs font-bold"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>محادثة</span>
                    </button>
                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 text-xs font-bold"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>اتصال</span>
                    </a>
                  </div>

                  {/* Status Steps Action */}
                  <div className="flex items-center gap-1.5">
                    {booking.status === 'new' && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(booking.id, 'accepted')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
                        >
                          ✓ قبول الطلب
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled', 'اعتذر الفني')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                        >
                          ✕ رفض
                        </button>
                      </>
                    )}

                    {booking.status === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(booking.id, 'on_the_way')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>أنا في الطريق</span>
                      </button>
                    )}

                    {booking.status === 'on_the_way' && (
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>بدء العمل</span>
                      </button>
                    )}

                    {booking.status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>إنهاء الخدمة وتأكيد الإنجاز</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        navigateTo('order_detail', { bookingId: booking.id });
                      }}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
                    >
                      التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl space-y-2">
            <CalendarCheck className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-xs font-black text-slate-800">لا توجد طلبات جارية حالياً</h4>
            <p className="text-[11px] text-slate-500">
              تأكد من تفعيل حالة التوفر لاستقبال طلبات صيانة جديدة من العملاء القريبين منك.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
