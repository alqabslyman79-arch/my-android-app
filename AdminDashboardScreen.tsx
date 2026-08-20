import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/common/StatusBadge';
import { StarRating } from '../../components/common/StarRating';
import { IconRenderer } from '../../components/common/IconRenderer';
import {
  ShieldCheck,
  Users,
  Briefcase,
  CalendarCheck,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Search,
  Filter,
  Eye,
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  Percent,
  Bell,
  Trash2,
  Tag,
  Send,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboardScreen: React.FC = () => {
  const {
    currentScreen,
    users,
    technicians,
    bookings,
    complaints,
    categories,
    offers,
    addCategory,
    addOffer,
    verifyTechnician,
    resolveComplaint,
    sendBroadcastNotification,
    toggleUserStatus,
    navigateTo,
    setSelectedBookingId,
    setSelectedTechnicianId,
    goBack,
  } = useApp();

  type TabType =
    | 'overview'
    | 'technicians'
    | 'bookings'
    | 'complaints'
    | 'categories'
    | 'offers'
    | 'users'
    | 'broadcast';

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Synchronize tab based on the current screen route if directly accessed
  useEffect(() => {
    if (currentScreen === 'admin_technicians') setActiveTab('technicians');
    else if (currentScreen === 'admin_orders') setActiveTab('bookings');
    else if (currentScreen === 'admin_complaints') setActiveTab('complaints');
    else if (currentScreen === 'admin_categories') setActiveTab('categories');
    else if (currentScreen === 'admin_offers') setActiveTab('offers');
    else if (currentScreen === 'admin_users') setActiveTab('users');
    else if (currentScreen === 'admin_stats') setActiveTab('overview');
  }, [currentScreen]);

  const [techFilter, setTechFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [resolutionText, setResolutionText] = useState<{ [id: string]: string }>({});

  // New Category Form State
  const [newCatNameAr, setNewCatNameAr] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Wrench');
  const [newCatPrice, setNewCatPrice] = useState(80);

  // New Offer Form State
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState(20);
  const [newOfferDesc, setNewOfferDesc] = useState('');

  // Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastSentSuccess, setBroadcastSentSuccess] = useState(false);

  // Overview stats calculation
  const totalRevenue = bookings.reduce(
    (sum, b) => (b.status === 'completed' ? sum + b.totalPrice : sum),
    0
  );
  const pendingTechnicians = technicians.filter((t) => t.verificationStatus === 'pending');
  const openComplaints = complaints.filter(
    (c) => c.status === 'open' || c.status === 'under_review'
  );
  const activeBookings = bookings.filter((b) => !['completed', 'cancelled'].includes(b.status));

  const filteredTechnicians = technicians.filter((t) => {
    if (techFilter === 'pending') return t.verificationStatus === 'pending';
    if (techFilter === 'verified') return t.verificationStatus === 'verified';
    return true;
  });

  const filteredComplaints = complaints.filter((c) => {
    if (complaintFilter === 'open') return c.status === 'open' || c.status === 'under_review';
    if (complaintFilter === 'resolved') return c.status === 'resolved' || c.status === 'closed';
    return true;
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameAr) return;
    addCategory({
      nameAr: newCatNameAr,
      nameEn: newCatNameEn || newCatNameAr,
      description: newCatDesc || 'خدمات صيانة منزلية فورية وموثوقة',
      iconName: newCatIcon,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
      startingPrice: Number(newCatPrice),
      color: 'emerald',
      isPopular: true,
      techniciansCount: 1,
    });
    setNewCatNameAr('');
    setNewCatNameEn('');
    setNewCatDesc('');
    alert('تمت إضافة التصنيف والخدمة بنجاح!');
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle || !newOfferCode) return;
    addOffer({
      title: newOfferTitle,
      description: newOfferDesc || 'خصم خاص لفترة محدودة على الخدمات المنزلية',
      code: newOfferCode.toUpperCase(),
      discountPercent: Number(newOfferDiscount),
      validUntil: '2026-12-31',
      bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      active: true,
    });
    setNewOfferTitle('');
    setNewOfferCode('');
    setNewOfferDesc('');
    alert('تم نشر العرض الترويجي وكوبون الخصم بنجاح!');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    sendBroadcastNotification(broadcastTitle, broadcastBody);
    setBroadcastSentSuccess(true);
    setBroadcastTitle('');
    setBroadcastBody('');
    setTimeout(() => setBroadcastSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-5 pb-24 sm:pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center font-black shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">لوحة الإدارة والتحكم الشاملة</h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-bold">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              متابعة العمليات والفنيين والطلبات والشكاوى والتصنيفات في منصة خدمتي
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
        >
          العودة للرئيسية ←
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold overflow-x-auto scrollbar-none gap-1">
        {[
          { id: 'overview' as TabType, label: '📊 المؤشرات والإحصائيات' },
          { id: 'technicians' as TabType, label: `🛠️ الفنيون والاعتماد (${technicians.length})` },
          { id: 'bookings' as TabType, label: `📅 الطلبات والعمليات (${bookings.length})` },
          { id: 'categories' as TabType, label: `📑 التصنيفات والخدمات (${categories.length})` },
          { id: 'offers' as TabType, label: `🎁 العروض والخصومات (${offers.length})` },
          { id: 'complaints' as TabType, label: `⚠️ الشكاوى والدعم (${complaints.length})` },
          { id: 'broadcast' as TabType, label: '📢 إرسال إشعار جماعي' },
          { id: 'users' as TabType, label: `👥 المستخدمون (${users.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow font-black'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Key Metrics Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">إجمالي الإيرادات المنجزة</span>
              <div className="text-xl font-black text-emerald-600">{totalRevenue} ر.س</div>
              <span className="text-[10px] text-slate-500">
                من {bookings.filter((b) => b.status === 'completed').length} طلب مكتمل
              </span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">فنيون بانتظار الاعتماد</span>
              <div className="text-xl font-black text-amber-600">{pendingTechnicians.length}</div>
              <span className="text-[10px] text-slate-500">يتطلب فحص الهوية والشهادات</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">الطلبات الجارية الآن</span>
              <div className="text-xl font-black text-blue-600">{activeBookings.length}</div>
              <span className="text-[10px] text-slate-500">في مراحل التنفيذ المختلفة</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">الشكاوى المفتوحة</span>
              <div className="text-xl font-black text-rose-600">{openComplaints.length}</div>
              <span className="text-[10px] text-slate-500">تحتاج اتخاذ قرار وحل</span>
            </div>
          </div>

          {/* Quick Action Alerts */}
          {pendingTechnicians.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-200 text-amber-900">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-amber-900">
                    يوجد {pendingTechnicians.length} فني جديد بانتظار الاعتماد الرسمي
                  </h3>
                  <p className="text-xs text-amber-700">
                    راجع الملفات المهنية وأسعار الكشف لاعتمادهم في المنصة.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('technicians');
                  setTechFilter('pending');
                }}
                className="px-3.5 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold shadow hover:bg-amber-700"
              >
                مراجعة الآن
              </button>
            </div>
          )}

          {/* Recent Bookings preview */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">أحدث العمليات والطلبات</h3>
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                عرض كل الطلبات ({bookings.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBookingId(b.id);
                    navigateTo('order_detail', { bookingId: b.id });
                  }}
                  className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.technicianAvatar}
                      alt={b.technicianName}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs">#{b.bookingNumber}</span>
                        <span className="font-bold text-xs text-slate-900">{b.specialtyName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        العميل: {b.customerName} | الفني: {b.technicianName}
                      </p>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="font-bold text-xs text-slate-900 block">{b.totalPrice} ر.س</span>
                    <BookingStatusBadge status={b.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Technicians Tab */}
      {activeTab === 'technicians' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTechFilter('all')}
              className={`px-3 py-1.5 rounded-xl ${
                techFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-600'
              }`}
            >
              الكل ({technicians.length})
            </button>
            <button
              type="button"
              onClick={() => setTechFilter('pending')}
              className={`px-3 py-1.5 rounded-xl ${
                techFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-600'
              }`}
            >
              بانتظار الاعتماد ({pendingTechnicians.length})
            </button>
            <button
              type="button"
              onClick={() => setTechFilter('verified')}
              className={`px-3 py-1.5 rounded-xl ${
                techFilter === 'verified' ? 'bg-emerald-600 text-white' : 'text-slate-600'
              }`}
            >
              المعتمدون ({technicians.filter((t) => t.verificationStatus === 'verified').length})
            </button>
          </div>

          <div className="space-y-3">
            {filteredTechnicians.map((tech) => (
              <div
                key={tech.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-slate-900">{tech.name}</h4>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        {tech.phone}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-emerald-600">{tech.specialtyName}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span>المدينة: {tech.city}</span>
                      <span>•</span>
                      <span>سعر الكشف: {tech.basePrice} ر.س</span>
                      <span>•</span>
                      <span>الطلبات المنجزة: {tech.completedOrders}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTechnicianId(tech.id);
                      navigateTo('technician_detail', { technicianId: tech.id });
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                    title="معاينة الملف الشخصي"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {tech.verificationStatus === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => verifyTechnician(tech.id, 'verified')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
                      >
                        ✓ اعتماد الفني
                      </button>
                      <button
                        type="button"
                        onClick={() => verifyTechnician(tech.id, 'rejected')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                      >
                        ✕ رفض
                      </button>
                    </>
                  ) : tech.verificationStatus === 'verified' ? (
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      معتمد ومفعل
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold">
                      مرفوض
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBookingId(b.id);
                navigateTo('order_detail', { bookingId: b.id });
              }}
              className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:border-purple-400 cursor-pointer transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                    #{b.bookingNumber}
                  </span>
                  <span className="font-bold text-xs text-emerald-700">{b.specialtyName}</span>
                </div>
                <BookingStatusBadge status={b.status} size="sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">العميل:</span>
                  <span className="font-bold">
                    {b.customerName} ({b.customerPhone})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">الفني:</span>
                  <span className="font-bold">{b.technicianName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">المبلغ:</span>
                  <span className="font-black text-emerald-700">{b.totalPrice} ر.س</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Categories Management Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-600" />
              <span>إضافة تصنيف أو خدمة جديدة للمنصة</span>
            </h3>

            <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <input
                type="text"
                placeholder="اسم التصنيف بالعربية (مثال: صيانة مصاعد)"
                value={newCatNameAr}
                onChange={(e) => setNewCatNameAr(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold"
                required
              />
              <input
                type="text"
                placeholder="الاسم بالإنجليزية (Elevators Maintenance)"
                value={newCatNameEn}
                onChange={(e) => setNewCatNameEn(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
              />
              <input
                type="number"
                placeholder="يبدأ السعر من (ر.س)"
                value={newCatPrice}
                onChange={(e) => setNewCatPrice(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
              />
              <input
                type="text"
                placeholder="الوصف الترويجي للخدمة"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl sm:col-span-2"
              />
              <button
                type="submit"
                className="py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ وإضافة التصنيف</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                    <IconRenderer name={cat.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{cat.nameAr}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{cat.description}</p>
                    <div className="text-[10px] text-emerald-700 font-bold mt-1">
                      يبدأ من {cat.startingPrice} ر.س • {cat.techniciansCount} فنيين مسجلين
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Offers & Coupons Tab */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>إطلاق عرض ترويجي وكود خصم جديد</span>
            </h3>

            <form onSubmit={handleCreateOffer} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <input
                type="text"
                placeholder="عنوان العرض (مثال: خصم الصيف المباشر)"
                value={newOfferTitle}
                onChange={(e) => setNewOfferTitle(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold"
                required
              />
              <input
                type="text"
                placeholder="كود الخصم (مثال: SUMMER25)"
                value={newOfferCode}
                onChange={(e) => setNewOfferCode(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono uppercase"
                required
              />
              <input
                type="number"
                placeholder="نسبة الخصم %"
                value={newOfferDiscount}
                onChange={(e) => setNewOfferDiscount(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                required
              />
              <input
                type="text"
                placeholder="شرح العرض وتفاصيله للعملاء"
                value={newOfferDesc}
                onChange={(e) => setNewOfferDesc(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl sm:col-span-2"
              />
              <button
                type="submit"
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>نشر العرض فوراً</span>
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">{offer.title}</h4>
                    <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg text-xs font-black">
                      {offer.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{offer.description}</p>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">
                    صالح حتى: {offer.validUntil}
                  </span>
                </div>

                <div className="text-left flex-shrink-0">
                  <span className="text-lg font-black text-emerald-600 block">
                    {offer.discountPercent}% خصم
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    مفعل للعملاء
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Broadcast Notification Tab */}
      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                إرسال إشعار عام لجميع مستخدمي المنصة (Push Notification)
              </h3>
              <p className="text-xs text-slate-500">
                سيصل التنبيه لجميع العملاء والفنيين فوراً عبر التطبيق
              </p>
            </div>
          </div>

          {broadcastSentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم إرسال الإشعار الجماعي بنجاح إلى جميع الحسابات المسجلة!</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">عنوان الإشعار</label>
              <input
                type="text"
                placeholder="مثال: خصم 20% بمناسبة إطلاق الخدمات الجديدة!"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">نص الرسالة</label>
              <textarea
                rows={3}
                placeholder="اكتب تفاصيل التنبيه أو التوجيه هنا..."
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الإشعار الآن</span>
            </button>
          </form>
        </div>
      )}

      {/* 7. Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-3">
          {complaints.map((comp) => {
            const isResolved = comp.status === 'resolved' || comp.status === 'closed';

            return (
              <div
                key={comp.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{comp.complaintNumber}
                    </span>
                    <span className="text-xs font-black text-slate-900">{comp.problemType}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isResolved ? 'تم الحل' : 'مفتوحة'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                  {comp.description}
                </p>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>
                    صاحب الشكوى: {comp.customerName} ({comp.customerPhone})
                  </span>
                  <span>{new Date(comp.createdAt).toLocaleString('ar-SA')}</span>
                </div>

                {!isResolved && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="اكتب رد الإدارة وحل الشكوى..."
                      value={resolutionText[comp.id] || ''}
                      onChange={(e) =>
                        setResolutionText((prev) => ({ ...prev, [comp.id]: e.target.value }))
                      }
                      className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 p-2 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        resolveComplaint(
                          comp.id,
                          resolutionText[comp.id] ||
                            'تم التواصل مع العميل وحل الإشكال وتعويضه بنجاح.'
                        );
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow whitespace-nowrap"
                    >
                      ✓ إغلاق وحل الشكوى
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 8. Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {users.map((u) => (
            <div key={u.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{u.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">{u.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {u.role === 'customer'
                    ? 'عميل'
                    : u.role === 'technician'
                    ? 'فني'
                    : 'مدير نظام'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleUserStatus(u.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl border transition-colors ${
                    u.status === 'suspended'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-slate-100'
                  }`}
                >
                  {u.status === 'suspended' ? 'محظور (تفعيل)' : 'نشط (حظر)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
