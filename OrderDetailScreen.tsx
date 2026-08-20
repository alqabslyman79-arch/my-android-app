import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookingStatusBadge, PaymentStatusBadge } from '../components/common/StatusBadge';
import { StarRating } from '../components/common/StarRating';
import { MapPreview } from '../components/common/MapPreview';
import { BookingStatus } from '../types';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  CreditCard,
  Truck,
  PlayCircle,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flag,
} from 'lucide-react';

export const OrderDetailScreen: React.FC = () => {
  const {
    selectedBookingId,
    bookings,
    technicians,
    currentUser,
    updateBookingStatus,
    updateBookingPayment,
    submitBookingReview,
    startOrOpenChat,
    navigateTo,
    goBack,
  } = useApp();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const booking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  if (!booking) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl">
        <p>لم يتم العثور على بيانات الطلب.</p>
        <button onClick={goBack} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl">
          رجوع
        </button>
      </div>
    );
  }

  const isCustomer = currentUser.role === 'customer';
  const isTechnician = currentUser.role === 'technician';
  const isAdmin = currentUser.role === 'admin';

  // Status timeline definition
  const timelineSteps: { key: BookingStatus; label: string }[] = [
    { key: 'new', label: 'طلب جديد' },
    { key: 'accepted', label: 'تم القبول' },
    { key: 'on_the_way', label: 'في الطريق' },
    { key: 'in_progress', label: 'بدأ العمل' },
    { key: 'completed', label: 'اكتمل' },
  ];

  const getStepIndex = (st: BookingStatus) => {
    switch (st) {
      case 'new':
      case 'pending_acceptance':
        return 0;
      case 'accepted':
        return 1;
      case 'on_the_way':
        return 2;
      case 'in_progress':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(booking.status);

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBookingReview(booking.id, ratingValue, ratingComment || 'خدمة ممتازة، شكراً لكم!');
    setShowRatingModal(false);
    try {
      confetti({ particleCount: 60, spread: 60 });
    } catch (err) {}
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingStatus(booking.id, 'cancelled', cancelReason || 'تم الإلغاء من قبل العميل');
    setShowCancelModal(false);
  };

  return (
    <div className="space-y-4 pb-24 sm:pb-12 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="p-2 -mr-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900">
                  تفاصيل الطلب #{booking.bookingNumber}
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                تاريخ الإنشاء: {new Date(booking.createdAt).toLocaleString('ar-SA')}
              </p>
            </div>
          </div>

          <BookingStatusBadge status={booking.status} />
        </div>

        {/* Live Timeline Tracker (unless cancelled) */}
        {booking.status !== 'cancelled' ? (
          <div className="pt-4 border-t border-slate-100">
            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute top-1/2 inset-x-4 -translate-y-1/2 h-1 bg-slate-100 z-0" />
              <div
                className="absolute top-1/2 right-4 -translate-y-1/2 h-1 bg-emerald-600 z-0 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIdx) / (timelineSteps.length - 1)) * 90}%`,
                }}
              />

              {timelineSteps.map((s, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div key={s.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-bold whitespace-nowrap ${
                        isCurrent ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <div>
              <span className="font-bold">تم إلغاء هذا الطلب: </span>
              <span>{booking.cancellationReason || 'لا يوجد سبب محدد'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Technician / Customer Contact Profile */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400">
            {isCustomer ? 'بيانات الفني المكلف بالخدمة' : 'بيانات العميل'}
          </h3>
          <span className="text-xs font-bold text-emerald-600">{booking.specialtyName}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={isCustomer ? booking.technicianAvatar : booking.customerAvatar}
              alt={isCustomer ? booking.technicianName : booking.customerName}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                {isCustomer ? booking.technicianName : booking.customerName}
              </h4>
              <p className="text-xs text-slate-500">
                {isCustomer ? 'فني معتمد ومفحوص الهوية' : 'العميل صاحب الطلب'}
              </p>
              <p className="text-xs font-mono text-slate-600 mt-0.5">
                {isCustomer ? booking.technicianPhone : booking.customerPhone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => startOrOpenChat(booking.technicianId, booking.customerId, booking.id)}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center gap-1 text-xs font-bold"
              title="محادثة مباشرة"
            >
              <MessageSquare className="w-4 h-4" />
              <span>محادثة</span>
            </button>

            <a
              href={`tel:${isCustomer ? booking.technicianPhone : booking.customerPhone}`}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors flex items-center gap-1 text-xs font-bold"
              title="اتصال هاتفي"
            >
              <Phone className="w-4 h-4" />
              <span>اتصال</span>
            </a>
          </div>
        </div>
      </div>

      {/* Problem & Services Details */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-slate-900">تفاصيل العطل والخدمات المطلوبة</h3>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
          <p className="font-medium">{booking.problemDescription}</p>
        </div>

        {/* Selected Services Tags */}
        {booking.serviceItems && booking.serviceItems.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700 block">البنود المحددة:</span>
            <div className="flex flex-wrap gap-1.5">
              {booking.serviceItems.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Problem Photos */}
        {booking.problemImages && booking.problemImages.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold text-slate-700 block">صور العطل المرفقة:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {booking.problemImages.map((img, i) => (
                <a
                  key={i}
                  href={img}
                  target="_blank"
                  rel="noreferrer"
                  className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0"
                >
                  <img src={img} alt="عطل" className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location on Map */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>موقع تنفيذ الخدمة</span>
          </h3>
          <span className="text-xs text-slate-500 font-bold">
            {booking.location.city} - {booking.location.district}
          </span>
        </div>

        <MapPreview
          location={booking.location}
          technicianLocation={technicians.find((t) => t.id === booking.technicianId)?.location}
          height="h-44"
          showRoute={['on_the_way', 'in_progress'].includes(booking.status)}
        />
        <p className="text-xs text-slate-600 px-1">{booking.location.addressText}</p>
      </div>

      {/* Invoice & Payment Information */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>الفاتورة والدفع</span>
          </h3>
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>

        <div className="divide-y divide-slate-100 text-xs space-y-2 pt-1">
          <div className="flex items-center justify-between text-slate-600 pt-1">
            <span>طريقة الدفع:</span>
            <span className="font-bold text-slate-900">
              {booking.paymentMethod === 'cash'
                ? 'نقداً عند الإنجاز (كاش)'
                : booking.paymentMethod === 'card'
                ? 'بطاقة ائتمانية / مدى'
                : 'تحويل بنكي'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 pt-2">
            <span>تاريخ وموعد الخدمة:</span>
            <span className="font-bold text-slate-900">
              {booking.scheduledDate} • {booking.scheduledTime}
            </span>
          </div>

          <div className="flex items-center justify-between font-black text-sm text-slate-900 pt-2">
            <span>المبلغ الإجمالي:</span>
            <span className="text-emerald-700 text-base">{booking.totalPrice} ر.س</span>
          </div>
        </div>

        {/* Technician Payment verification toggle (if transfer) */}
        {(isTechnician || isAdmin) && booking.paymentStatus === 'pending_verification' && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 text-xs">
            <span className="text-amber-800 font-bold">هل استلمت قيمة التحويل البنكي؟</span>
            <button
              type="button"
              onClick={() => updateBookingPayment(booking.id, 'paid')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
            >
              تأكيد استلام المبلغ
            </button>
          </div>
        )}
      </div>

      {/* Customer Rating Section if completed */}
      {booking.status === 'completed' && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-sm font-black text-slate-900">تقييم الخدمة</h3>
            </div>
            {booking.rating ? (
              <StarRating rating={booking.rating} size="sm" />
            ) : isCustomer ? (
              <button
                type="button"
                onClick={() => setShowRatingModal(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                ⭐ قيّم الفني الآن
              </button>
            ) : (
              <span className="text-xs text-slate-500">بانتظار تقييم العميل</span>
            )}
          </div>

          {booking.rating && booking.reviewComment && (
            <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-amber-100">
              "{booking.reviewComment}"
            </p>
          )}
        </div>
      )}

      {/* Role Action Controls */}
      {/* 1. Technician Action Workflow Buttons */}
      {isTechnician && booking.status !== 'completed' && booking.status !== 'cancelled' && (
        <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>لوحة تحكم الفني لحالة الطلب</span>
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {booking.status === 'new' && (
              <>
                <button
                  type="button"
                  onClick={() => updateBookingStatus(booking.id, 'accepted')}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow transition-all"
                >
                  ✓ قبول الطلب
                </button>
                <button
                  type="button"
                  onClick={() => updateBookingStatus(booking.id, 'cancelled', 'اعتذر الفني لضغط العمل')}
                  className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow transition-all"
                >
                  ✕ رفض الطلب
                </button>
              </>
            )}

            {booking.status === 'accepted' && (
              <button
                type="button"
                onClick={() => updateBookingStatus(booking.id, 'on_the_way')}
                className="col-span-2 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>أنا في الطريق إلى موقع العميل الآن</span>
              </button>
            )}

            {booking.status === 'on_the_way' && (
              <button
                type="button"
                onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                className="col-span-2 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>وصلت وبدأت تنفيذ أعمال الصيانة</span>
              </button>
            )}

            {booking.status === 'in_progress' && (
              <button
                type="button"
                onClick={() => {
                  updateBookingStatus(booking.id, 'completed');
                  try {
                    confetti({ particleCount: 70, spread: 60 });
                  } catch (e) {}
                }}
                className="col-span-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>إنهاء الخدمة بنجاح وتأكيد الإنجاز ✅</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Customer Actions: Cancel or File Complaint */}
      {isCustomer && !['completed', 'cancelled'].includes(booking.status) && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <XCircle className="w-4 h-4" />
            <span>إلغاء الطلب</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('complaints', { bookingId: booking.id })}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <Flag className="w-3.5 h-3.5 text-slate-400" />
            <span>رفع شكوى أو ملاحظة</span>
          </button>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-2">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              </div>
              <h3 className="text-base font-black text-slate-900">تقييم خدمة الفني</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                كيف كانت تجربتك مع {booking.technicianName}؟
              </p>
            </div>

            <div className="flex justify-center py-2">
              <StarRating
                rating={ratingValue}
                interactive
                onRatingChange={(r) => setRatingValue(r)}
                size="lg"
              />
            </div>

            <div>
              <textarea
                rows={3}
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="اكتب رأيك الصادق في جودة العمل ودقة المواعيد..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="w-1/3 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleRatingSubmit}
                className="w-2/3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow"
              >
                حفظ التقييم ⭐
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">تأكيد إلغاء الطلب</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟
              </p>
            </div>

            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="اذكر سبب الإلغاء (اختياري)..."
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-1/2 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleCancelSubmit}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow"
              >
                تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
