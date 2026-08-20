import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPreview } from '../components/common/MapPreview';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  Building2,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { PaymentMethod } from '../types';

export const BookServiceScreen: React.FC = () => {
  const {
    selectedTechnicianId,
    technicians,
    currentUser,
    createBooking,
    navigateTo,
    setSelectedBookingId,
    goBack,
  } = useApp();

  const technician =
    technicians.find((t) => t.id === selectedTechnicianId) || technicians[0];

  // Form State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    technician?.services.length > 0 ? [technician.services[0].name] : ['كشف وصيانة عامة']
  );
  const [problemDescription, setProblemDescription] = useState('');
  const [problemImages, setProblemImages] = useState<string[]>([]);
  const [imageInputUrl, setImageInputUrl] = useState('');

  // Location
  const [location, setLocation] = useState(
    currentUser.location || {
      lat: 24.7742,
      lng: 46.6384,
      city: 'الرياض',
      district: 'حي الملقا',
      addressText: 'شارع أنس بن مالك، فيلا 42',
    }
  );
  const [addressNotes, setAddressNotes] = useState('');

  // Schedule
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('04:00 م - 06:00 م');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '08:00 ص - 10:00 ص',
    '10:00 ص - 12:00 م',
    '12:00 م - 02:00 م',
    '02:00 م - 04:00 م',
    '04:00 م - 06:00 م',
    '06:00 م - 08:00 م',
    '08:00 م - 10:00 م',
  ];

  // Calculate estimated total price
  const calculateTotal = () => {
    let sum = technician ? technician.basePrice : 100;
    if (technician) {
      selectedServices.forEach((sName) => {
        const item = technician.services.find((s) => s.name === sName);
        if (item) sum += item.price;
      });
    }
    return sum;
  };

  const handleToggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleAddSampleImage = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
    ];
    const randomImg = sampleImages[problemImages.length % sampleImages.length];
    setProblemImages((prev) => [...prev, randomImg]);
  };

  const handleAddCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageInputUrl.trim()) {
      setProblemImages((prev) => [...prev, imageInputUrl.trim()]);
      setImageInputUrl('');
    }
  };

  const handleSubmitOrder = () => {
    if (!problemDescription.trim()) {
      alert('يرجى كتابة وصف مختصر للمشكلة أو الخدمة المطلوبة.');
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking = createBooking({
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerPhone: currentUser.phone,
        customerAvatar: currentUser.avatar,
        technicianId: technician.id,
        technicianName: technician.name,
        technicianPhone: technician.phone,
        technicianAvatar: technician.avatar,
        specialtyId: technician.specialtyId,
        specialtyName: technician.specialtyName,
        serviceItems: selectedServices,
        problemDescription,
        problemImages,
        location: {
          ...location,
          addressText: addressNotes ? `${location.addressText} (${addressNotes})` : location.addressText,
        },
        scheduledDate,
        scheduledTime,
        notes: addressNotes,
        status: 'new',
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'unpaid' : 'pending_verification',
        totalPrice: calculateTotal(),
        estimatedPrice: calculateTotal(),
      });

      // Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      setIsSubmitting(false);
      setSelectedBookingId(newBooking.id);
      navigateTo('order_detail', { bookingId: newBooking.id, justCreated: true });
    }, 600);
  };

  return (
    <div className="space-y-4 pb-24 sm:pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="p-2 -mr-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                طلب خدمة جديدة
              </h1>
              <p className="text-xs text-slate-500">
                من الفني: {technician?.name} ({technician?.specialtyName})
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-1/2 inset-x-8 -translate-y-1/2 h-1 bg-slate-100 z-0" />
          <div
            className="absolute top-1/2 right-8 -translate-y-1/2 h-1 bg-emerald-600 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 75}%` }}
          />

          {[
            { num: 1, label: 'تفاصيل العطل' },
            { num: 2, label: 'الموقع' },
            { num: 3, label: 'الموعد' },
            { num: 4, label: 'الدفع والتأكيد' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className="relative z-10 flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step === s.num
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-[10px] mt-1 font-bold whitespace-nowrap ${
                  step === s.num ? 'text-emerald-700' : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Problem description & services */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2">
              الخدمات المطلوبة من الفني
            </label>
            <div className="space-y-2">
              {technician?.services.map((srv) => {
                const isSelected = selectedServices.includes(srv.name);
                return (
                  <div
                    key={srv.id}
                    onClick={() => handleToggleService(srv.name)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{srv.name}</span>
                        {srv.description && (
                          <span className="text-[10px] text-slate-500">{srv.description}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700">{srv.price} ر.س</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              وصف المشكلة أو العطل بالتفصيل *
            </label>
            <textarea
              rows={4}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="مثال: يوجد صوت غير طبيعي بالمكيف مع تسريب ماء خفيف، أحتاج فحص الفريون والتنظيف..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Attach Photos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>إرفاق صور العطل (اختياري)</span>
              </label>
              <button
                type="button"
                onClick={handleAddSampleImage}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>إضافة صورة توضيحية</span>
              </button>
            </div>

            {problemImages.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {problemImages.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 group">
                    <img src={img} alt="صورة العطل" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setProblemImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (!problemDescription.trim()) {
                alert('يرجى كتابة وصف مختصر للمشكلة قبل المتابعة.');
                return;
              }
              setStep(2);
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow transition-all flex items-center justify-center gap-2"
          >
            <span>التالي: تحديد موقع الخدمة</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>موقع تنفيذ الخدمة</span>
            </h3>
            <span className="text-[11px] text-slate-500">انقر على الخريطة لتعديل الموقع</span>
          </div>

          <MapPreview
            location={location}
            interactive
            onLocationSelect={(loc) => setLocation(loc)}
            height="h-52"
          />

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              ملاحظات العنوان (رقم الفيلا، الدور، المعالم القريبة)
            </label>
            <input
              type="text"
              value={addressNotes}
              onChange={(e) => setAddressNotes(e.target.value)}
              placeholder="مثال: فيلا رقم 42، بجوار مسجد الإيمان، الدور الأرضي"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-2xl hover:bg-slate-50"
            >
              السابق
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow transition-all flex items-center justify-center gap-1"
            >
              <span>التالي: اختيار التاريخ والوقت</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>تاريخ الزيارة المفضل</span>
            </label>
            <input
              type="date"
              value={scheduledDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-2xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>الوقت المناسب للزيارة</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setScheduledTime(slot)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    scheduledTime === slot
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-2xl hover:bg-slate-50"
            >
              السابق
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow transition-all flex items-center justify-center gap-1"
            >
              <span>التالي: اختيار طريقة الدفع</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment & Review Summary */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900">طريقة الدفع ومراجعة الطلب</h3>

          {/* Payment Method Cards */}
          <div className="space-y-2">
            {[
              {
                id: 'cash' as PaymentMethod,
                title: 'الدفع نقداً عند الإنجاز (كاش)',
                desc: 'ادفع للفني مباشرة بعد فحص وإنجاز الخدمة ورضاك التام.',
                icon: Banknote,
              },
              {
                id: 'card' as PaymentMethod,
                title: 'البطاقة الائتمانية / مدى (آمن)',
                desc: 'دفع فوري مؤمن عبر البطاقات البنكية.',
                icon: CreditCard,
              },
              {
                id: 'bank_transfer' as PaymentMethod,
                title: 'تحويل بنكي مباشر',
                desc: 'تحويل على الحساب البنكي المعتمد للمنصة مع رفع الإيصال.',
                icon: Building2,
              },
            ].map((pm) => {
              const Icon = pm.icon;
              const isSelected = paymentMethod === pm.id;
              return (
                <div
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{pm.title}</span>
                      <span className="text-[10px] text-slate-500">{pm.desc}</span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Invoice Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>الفني المعين:</span>
              <span className="font-bold text-slate-900">{technician.name}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>التخصص:</span>
              <span className="font-bold text-slate-900">{technician.specialtyName}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>الموعد المحدد:</span>
              <span className="font-bold text-slate-900">{scheduledDate} ({scheduledTime})</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>رسوم الزيارة والكشف:</span>
              <span className="font-bold text-slate-900">{technician.basePrice} ر.س</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-black text-sm text-slate-900">
              <span>إجمالي المبلغ التقديري:</span>
              <span className="text-emerald-700 text-base">{calculateTotal()} ر.س</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-1/3 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-2xl hover:bg-slate-50"
            >
              السابق
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitOrder}
              className="w-2/3 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري إرسال الطلب...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تأكيد وإرسال الطلب للفني</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
