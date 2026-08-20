import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Grid,
  CalendarCheck2,
  MessageSquare,
  User,
  Wrench,
  LayoutDashboard,
  Users,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentUser, currentScreen, navigateTo, conversations, bookings } = useApp();

  // Active unread messages
  const unreadMsgCount = conversations.reduce((acc, c) => {
    return (
      acc +
      (currentUser.role === 'customer'
        ? c.unreadCountCustomer
        : c.unreadCountTechnician)
    );
  }, 0);

  // Active orders count
  const activeOrdersCount = bookings.filter((b) => {
    if (currentUser.role === 'customer') {
      return (
        b.customerId === currentUser.id &&
        !['completed', 'cancelled'].includes(b.status)
      );
    } else if (currentUser.role === 'technician') {
      return (
        b.technicianId === currentUser.id &&
        !['completed', 'cancelled'].includes(b.status)
      );
    }
    return !['completed', 'cancelled'].includes(b.status);
  }).length;

  // Render navigation based on user role
  const renderNavItems = () => {
    if (currentUser.role === 'admin') {
      return [
        { screen: 'admin_dashboard', label: 'الرئيسية', icon: LayoutDashboard },
        { screen: 'admin_users', label: 'المستخدمين', icon: Users },
        { screen: 'admin_technicians', label: 'الفنيين', icon: ShieldCheck },
        { screen: 'admin_orders', label: 'الطلبات', icon: CalendarCheck2, badge: activeOrdersCount },
        { screen: 'admin_stats', label: 'الإحصائيات', icon: BarChart3 },
      ];
    }

    if (currentUser.role === 'technician') {
      return [
        { screen: 'tech_dashboard', label: 'لوحة الفني', icon: LayoutDashboard },
        { screen: 'orders', label: 'الطلبات', icon: CalendarCheck2, badge: activeOrdersCount },
        { screen: 'tech_services', label: 'خدماتي وأسعاري', icon: Wrench },
        { screen: 'chats', label: 'المحادثات', icon: MessageSquare, badge: unreadMsgCount },
        { screen: 'profile', label: 'الملف المهني', icon: User },
      ];
    }

    // Default: Customer
    return [
      { screen: 'home', label: 'الرئيسية', icon: Home },
      { screen: 'categories', label: 'الخدمات', icon: Grid },
      { screen: 'orders', label: 'طلباتي', icon: CalendarCheck2, badge: activeOrdersCount },
      { screen: 'chats', label: 'المحادثات', icon: MessageSquare, badge: unreadMsgCount },
      { screen: 'profile', label: 'حسابي', icon: User },
    ];
  };

  const navItems = renderNavItems();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 py-1.5 px-3 z-40 shadow-lg md:hidden">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen;

          return (
            <button
              key={item.screen}
              type="button"
              onClick={() => navigateTo(item.screen as any)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
