import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint } from '../types';
import {
  HelpCircle,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  ChevronLeft,
  FileText,
  Plus,
} from 'lucide-react';

export const ComplaintsScreen: React.FC = () => {
  const { complaints, currentUser, bookings, submitComplaint, screenParams } = useApp();

  const [showNewForm, setShowNewForm] = useState(!!screenParams?.bookingId);
  const [selectedBookingId, setSelectedBookingId] = useState(screenParams?.bookingId || '');
  const [problemType, setProblemType] = useState('تأخر الفني عن الموعد');
  const [description, setDescription] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const userComplaints = complaints.filter(
    (c) => c.customerId === currentUser.id
  );

  const problemTypes = [
    'تأخر الفني عن الموعد المحدد',
    'جودة الصيانة غير مرضية',
    'طلب مبالغ إضافية غير متفق عليها',
    'عدم إحضار قطع الغيار المتفق عليها',
    'سلوك أو تعامل غير لائق',
    'مشكلة أخرى أو استفسار عام',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('يرجى كتابة تفاصيل الشكوى أو الملاحظة.');
      return;
    }

    submitComplaint({
      bookingId: selectedBookingId || undefined,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      problemType,
      description,
      images: [],
    });

    setDescription('');
    setShowNewForm(false);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900">
              الدعم الفني والشكاوى
            </h1>
            <p className="text-xs text-slate-500">نحن هنا لمساعدتك وضمان حقك ورضاك التام</p>
          </div>
        </div>

        {!showNewForm && (
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>تقديم شكوى جديدة</span>
          </button>
        )}
      </div>

      {submittedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold">تم استلام الشكوى بنجاح!</p>
            <p className="text-[11px] text-emerald-700">
              سيقوم فريق خدمة العملاء بمراجعة الشكوى والتواصل معك هاتفياً خلال 24 ساعة.
            </p>
          </div>
        </div>
      )}

      {/* New Complaint Form */}
      {showNewForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900">بيانات الشكوى أو البلاغ</h3>
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              إلغاء
            </button>
          </div>

          {/* Related Booking */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              رقم الطلب المرتبط (اختياري)
            </label>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2.5 rounded-xl text-xs font-bold focus:outline-none"
            >
              <option value="">بدون تحديد طلب محدد</option>
              {bookings
                .filter((b) => b.customerId === currentUser.id)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    #{b.bookingNumber} - {b.specialtyName} ({b.technicianName})
                  </option>
                ))}
            </select>
          </div>

          {/* Problem Type */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">نوع المشكلة</label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2.5 rounded-xl text-xs font-bold focus:outline-none"
            >
              {problemTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              تفاصيل المشكلة والوقائع بالتفصيل *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب ما حدث بدقة لمساعدتنا على معالجة الشكوى وتعويضك إن لزم..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 -rotate-90" />
            <span>إرسال الشكوى لفريق المتابعة</span>
          </button>
        </form>
      )}

      {/* User's past complaints */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 px-1">سجل الشكاوى والمتابعات</h3>

        {userComplaints.length > 0 ? (
          <div className="space-y-3">
            {userComplaints.map((comp) => {
              const statusConfig = {
                open: { label: 'مفتوحة وبانتظار المراجعة', bg: 'bg-amber-100 text-amber-800' },
                under_review: { label: 'قيد المتابعة والتحقيق', bg: 'bg-blue-100 text-blue-800' },
                resolved: { label: 'تم الحل بنجاح', bg: 'bg-emerald-100 text-emerald-800' },
                closed: { label: 'مغلقة', bg: 'bg-slate-100 text-slate-700' },
              };
              const st = statusConfig[comp.status] || statusConfig.open;

              return (
                <div
                  key={comp.id}
                  className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{comp.complaintNumber}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${st.bg}`}>
                      {st.label}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900">{comp.problemType}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{comp.description}</p>

                  {comp.resolutionNotes && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                      <span className="font-bold block">رد الإدارة وحل المشكلة:</span>
                      <span>{comp.resolutionNotes}</span>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-100">
                    تاريخ الرفع: {new Date(comp.createdAt).toLocaleString('ar-SA')}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm text-slate-500 text-xs">
            لا توجد شكاوى مسجلة بحسابك.
          </div>
        )}
      </div>
    </div>
  );
};
