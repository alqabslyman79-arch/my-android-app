import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, BookingStatus } from '../types';
import { BookingStatusBadge, PaymentStatusBadge } from '../components/common/StatusBadge';
import {
  CalendarCheck,
  Clock,
  MapPin,
  ChevronLeft,
  MessageSquare,
  Phone,
  Star,
  PlusCircle,
  XCircle,
  CheckCircle,
} from 'lucide-react';

export const OrdersScreen: React.FC = () => {
  const {
    bookings,
    currentUser,
    navigateTo,
    setSelectedBookingId,
    startOrOpenChat,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  // Filter bookings based on current user role
  const userBookings = bookings.filter((b) => {
    if (currentUser.role === 'customer') {
      return b.customerId === currentUser.id;
    } else if (currentUser.role === 'technician') {
      return b.technicianId === currentUser.id;
    }
    return true; // admin sees all
  });

  const filteredBookings = userBookings.filter((b) => {
    if (activeTab === 'active') {
      return !['completed', 'cancelled'].includes(b.status);
    }
    if (activeTab === 'completed') {
      return b.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  });

  const handleOrderClick = (booking: Booking) => {
    setSelectedBookingId(booking.id);
    navigateTo('order_detail', { bookingId: booking.id });
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900">
              {currentUser.role === 'technician' ? 'إدارة طلبات الصيانة' : 'طلباتي'}
            </h1>
            <p className="text-xs text-slate-500">
              متابعة حالة الطلبات وتفاصيل التنفيذ والتواصل
            </p>
          </div>
        </div>

        {currentUser.role === 'customer' && (
          <button
            type="button"
            onClick={() => navigateTo('categories')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>طلب خدمة جديدة</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
        {[
          { id: 'all', label: `الكل (${userBookings.length})` },
          {
            id: 'active',
            label: `قيد التنفيذ (${
              userBookings.filter((b) => !['completed', 'cancelled'].includes(b.status)).length
            })`,
          },
          {
            id: 'completed',
            label: `المكتملة (${
              userBookings.filter((b) => b.status === 'completed').length
            })`,
          },
          {
            id: 'cancelled',
            label: `الملغية (${
              userBookings.filter((b) => b.status === 'cancelled').length
            })`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 rounded-xl text-center transition-all ${
              activeTab === tab.id
                ? 'bg-white text-emerald-700 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const isCustomer = currentUser.role === 'customer';
            const personName = isCustomer ? booking.technicianName : booking.customerName;
            const personAvatar = isCustomer ? booking.technicianAvatar : booking.customerAvatar;
            const personPhone = isCustomer ? booking.technicianPhone : booking.customerPhone;

            return (
              <div
                key={booking.id}
                onClick={() => handleOrderClick(booking)}
                className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all cursor-pointer group space-y-3"
              >
                {/* Card Top: Order Num & Status */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                      #{booking.bookingNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {booking.specialtyName}
                    </span>
                  </div>

                  <BookingStatusBadge status={booking.status} size="sm" />
                </div>

                {/* Body: Person info & problem */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={personAvatar}
                      alt={personName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {personName}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {booking.problemDescription}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {booking.scheduledDate} ({booking.scheduledTime})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left flex-shrink-0">
                    <span className="text-sm font-black text-slate-900 block">
                      {booking.totalPrice} ر.س
                    </span>
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startOrOpenChat(booking.technicianId, booking.customerId, booking.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 font-bold text-[11px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>محادثة</span>
                    </button>

                    <a
                      href={`tel:${personPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 font-bold text-[11px]"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>اتصال</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-600 font-bold group-hover:translate-x-[-4px] transition-transform">
                    <span>عرض التفاصيل</span>
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">لا توجد طلبات في هذا القسم</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            تصفح خدماتنا المتنوعة واطلب فني صيانة معتمد في أي وقت.
          </p>
          {currentUser.role === 'customer' && (
            <button
              type="button"
              onClick={() => navigateTo('categories')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-700"
            >
              طلب خدمة جديدة الآن
            </button>
          )}
        </div>
      )}
    </div>
  );
};
