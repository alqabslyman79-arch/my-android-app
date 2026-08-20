import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCheck,
  CalendarCheck,
  Tag,
  MessageSquare,
  Star,
  Info,
  ChevronLeft,
} from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
    setSelectedBookingId,
  } = useApp();

  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || !n.userId
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className="w-5 h-5 text-emerald-600" />;
      case 'offer':
        return <Tag className="w-5 h-5 text-amber-600" />;
      case 'chat':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-indigo-600" />;
    }
  };

  const handleNotificationClick = (notif: typeof userNotifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.linkId) {
      setSelectedBookingId(notif.linkId);
      navigateTo('order_detail', { bookingId: notif.linkId });
    }
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900">مركز الإشعارات</h1>
            <p className="text-xs text-slate-500">تحديثات الطلبات والعروض والرسائل</p>
          </div>
        </div>

        {userNotifications.some((n) => !n.read) && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>تحديد الكل كمقروء</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {userNotifications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {userNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                !notif.read ? 'bg-emerald-50/40 hover:bg-emerald-50/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-100 flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.body}</p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    {new Date(notif.createdAt).toLocaleDateString('ar-SA', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {notif.linkId && (
                <ChevronLeft className="w-5 h-5 text-slate-400 flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">لا توجد إشعارات جديدة</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            ستصلك هنا إشعارات فورية بحالة طلباتك وعروض التخفيض الحصرية.
          </p>
        </div>
      )}
    </div>
  );
};
