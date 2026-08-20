import React from 'react';
import { TechnicianProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import { StarRating } from '../common/StarRating';
import {
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Heart,
  Briefcase,
  Clock,
  Sparkles,
} from 'lucide-react';

interface TechnicianCardProps {
  technician: TechnicianProfile;
  compact?: boolean;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({ technician, compact = false }) => {
  const { navigateTo, setSelectedTechnicianId, toggleFavorite, isFavorite, startOrOpenChat } = useApp();

  const favorite = isFavorite(technician.id);

  const handleCardClick = () => {
    setSelectedTechnicianId(technician.id);
    navigateTo('technician_detail', { technicianId: technician.id });
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTechnicianId(technician.id);
    navigateTo('book_service', { technicianId: technician.id });
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    startOrOpenChat(technician.id);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${technician.phone}`;
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(technician.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all p-4 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Banner Status */}
      <div className="flex items-start justify-between gap-3">
        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={technician.avatar}
              alt={technician.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform"
            />
            {technician.isAvailable ? (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
                title="متاح للعمل الآن"
              />
            ) : (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-400 border-2 border-white rounded-full"
                title="غير متاح حالياً"
              />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                {technician.name}
              </h3>
              {technician.verificationStatus === 'verified' && (
                <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" title="فني موثق ومعتمد" />
              )}
            </div>

            <p className="text-xs font-semibold text-emerald-600 mt-0.5">
              {technician.specialtyName}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <StarRating
                rating={technician.rating}
                reviewsCount={technician.reviewsCount}
                showCount
                size="sm"
              />
              <span className="text-[11px] text-slate-400">•</span>
              <span className="text-[11px] text-slate-500 font-medium">
                {technician.completedOrders} طلب منجز
              </span>
            </div>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`p-2 rounded-full border transition-colors ${
            favorite
              ? 'bg-rose-50 border-rose-200 text-rose-500'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
          }`}
          title="إضافة للمفضلة"
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Location & Experience */}
      {!compact && (
        <div className="my-3 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate max-w-[170px]">{technician.city} - {technician.district}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>{technician.experienceYears} سنوات خبرة</span>
          </div>
        </div>
      )}

      {/* Pricing and Action Buttons */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">سعر الزيارة والكشف</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-slate-900">
              {technician.basePrice}
            </span>
            <span className="text-xs text-slate-500 font-semibold">ر.س</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Chat */}
          <button
            type="button"
            onClick={handleChat}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="محادثة مباشرة"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Quick Call */}
          <button
            type="button"
            onClick={handleCall}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="اتصال هاتفي"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Book Button */}
          <button
            type="button"
            onClick={handleBookNow}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            <span>طلب خدمة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
