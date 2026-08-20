import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StarRating } from '../components/common/StarRating';
import { MapPreview } from '../components/common/MapPreview';
import {
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Heart,
  Share2,
  Calendar,
  Clock,
  ShieldCheck,
  Briefcase,
  Star,
  Award,
  ChevronLeft,
  ArrowRight,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

export const TechnicianDetailScreen: React.FC = () => {
  const {
    selectedTechnicianId,
    technicians,
    reviews,
    navigateTo,
    setSelectedTechnicianId,
    toggleFavorite,
    isFavorite,
    startOrOpenChat,
    goBack,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'reviews'>('services');

  const technician =
    technicians.find((t) => t.id === selectedTechnicianId) || technicians[0];

  if (!technician) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl">
        <p>لم يتم العثور على بيانات الفني.</p>
        <button onClick={goBack} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl">
          رجوع
        </button>
      </div>
    );
  }

  const techReviews = reviews.filter((r) => r.technicianId === technician.id);
  const favorite = isFavorite(technician.id);

  const handleBookNow = () => {
    setSelectedTechnicianId(technician.id);
    navigateTo('book_service', { technicianId: technician.id });
  };

  const handleStartChat = () => {
    startOrOpenChat(technician.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `الفني ${technician.name} - تطبيق خدمتي`,
        text: `تواصل مع ${technician.name} في تخصص ${technician.specialtyName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط ملف الفني بنجاح!');
    }
  };

  return (
    <div className="space-y-4 pb-28 sm:pb-12">
      {/* Top Banner & Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Action buttons top */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <button
              type="button"
              onClick={goBack}
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-800 backdrop-blur shadow-sm transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-800 backdrop-blur shadow-sm transition-colors"
                title="مشاركة"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(technician.id)}
                className={`p-2 rounded-xl backdrop-blur shadow-sm transition-colors ${
                  favorite
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/80 hover:bg-white text-slate-800'
                }`}
                title="إضافة للمفضلة"
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-5 pb-5 pt-0 relative">
          {/* Avatar floating */}
          <div className="flex flex-wrap items-end justify-between gap-3 -mt-12 mb-3">
            <div className="relative">
              <img
                src={technician.avatar}
                alt={technician.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
              />
              {technician.isAvailable ? (
                <span
                  className="absolute bottom-0 right-0 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full border-2 border-white shadow flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  متاح للعمل
                </span>
              ) : (
                <span
                  className="absolute bottom-0 right-0 px-2 py-0.5 bg-slate-500 text-white text-[10px] font-black rounded-full border-2 border-white shadow"
                >
                  غير متاح
                </span>
              )}
            </div>

            {/* Price Badge */}
            <div className="text-left bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl">
              <span className="text-[10px] text-emerald-800 font-semibold block">سعر الكشف والزيارة</span>
              <span className="text-lg font-black text-emerald-950">{technician.basePrice} ر.س</span>
            </div>
          </div>

          {/* Name & Specialty */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {technician.name}
              </h1>
              {technician.verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  فني معتمد
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5">
              {technician.specialtyName}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <StarRating rating={technician.rating} showCount reviewsCount={technician.reviewsCount} />
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold">{technician.completedOrders} طلب مكتمل</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{technician.experienceYears} سنوات خبرة</span>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
            <p>{technician.bio}</p>
          </div>

          {/* Key Info grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">المنطقة</span>
                <span className="font-bold text-slate-800 truncate">{technician.city} - {technician.district}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">أوقات العمل</span>
                <span className="font-bold text-slate-800 text-[11px] truncate">{technician.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'services'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            قائمة الخدمات والأسعار ({technician.services.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'portfolio'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            معرض الأعمال ({technician.portfolioImages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            التقييمات والآراء ({techReviews.length})
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {/* 1. Services Tab */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-black text-slate-900">الخدمات المتوفرة</h3>
            <span className="text-xs text-slate-400">أسعار شاملة الضمان</span>
          </div>

          <div className="divide-y divide-slate-100">
            {technician.services.map((srv) => (
              <div key={srv.id} className="py-3 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">{srv.name}</h4>
                  {srv.description && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{srv.description}</p>
                  )}
                  {srv.unit && (
                    <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                      الحساب: {srv.unit}
                    </span>
                  )}
                </div>

                <div className="text-left flex-shrink-0">
                  <span className="text-sm font-black text-emerald-600">{srv.price} ر.س</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Portfolio Gallery */}
      {activeTab === 'portfolio' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-900">صور سابقة من أعمال الفني</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {technician.portfolioImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                <img
                  src={img}
                  alt={`أعمال ${technician.name}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Customer Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">آراء وتقييمات العملاء</h3>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-sm text-slate-900">{technician.rating}</span>
              <span className="text-xs text-slate-400">({technician.reviewsCount} تقييم)</span>
            </div>
          </div>

          <div className="space-y-3">
            {techReviews.map((rev) => (
              <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.customerAvatar}
                      alt={rev.customerName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{rev.customerName}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map location preview */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 mb-2.5 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>نطاق تغطية الفني على الخريطة</span>
        </h3>
        <MapPreview location={technician.location} height="h-44" />
      </div>

      {/* Fixed Bottom Booking Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 z-40 shadow-2xl">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartChat}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1 text-xs font-bold"
              title="محادثة"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">محادثة</span>
            </button>

            <a
              href={`tel:${technician.phone}`}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1 text-xs font-bold"
              title="اتصال"
            >
              <Phone className="w-4 h-4 text-blue-700" />
              <span className="hidden sm:inline">اتصال</span>
            </a>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleBookNow}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <span>طلب خدمة الآن</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
