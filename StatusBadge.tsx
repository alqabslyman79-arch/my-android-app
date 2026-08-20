import React from 'react';
import { BookingStatus, PaymentStatus } from '../../types';
import { Clock, CheckCircle2, AlertCircle, XCircle, Truck, PlayCircle, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md';
}

export const BookingStatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config: Record<
    BookingStatus,
    { label: string; bg: string; text: string; border: string; icon: any }
  > = {
    new: {
      label: 'طلب جديد',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: Clock,
    },
    pending_acceptance: {
      label: 'بانتظار قبول الفني',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: Clock,
    },
    accepted: {
      label: 'تم قبول الطلب',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: CheckCircle2,
    },
    on_the_way: {
      label: 'في الطريق للموقع',
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      icon: Truck,
    },
    in_progress: {
      label: 'جاري تنفيذ الخدمة',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: PlayCircle,
    },
    completed: {
      label: 'مكتمل بنجاح',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle2,
    },
    cancelled: {
      label: 'ملغي',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: XCircle,
    },
  };

  const item = config[status] || config.new;
  const Icon = item.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${item.bg} ${item.text} ${item.border} ${sizeClasses}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{item.label}</span>
    </span>
  );
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const config: Record<PaymentStatus, { label: string; bg: string; text: string }> = {
    paid: { label: 'مدفوع بالكامل', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    pending_verification: { label: 'بانتظار التحقق من التحويل', bg: 'bg-amber-100', text: 'text-amber-800' },
    unpaid: { label: 'غير مدفوع (نقداً عند الإنجاز)', bg: 'bg-slate-100', text: 'text-slate-700' },
    refunded: { label: 'مسترد', bg: 'bg-rose-100', text: 'text-rose-800' },
  };

  const item = config[status] || config.unpaid;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.bg} ${item.text}`}>
      {item.label}
    </span>
  );
};
