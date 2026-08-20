import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Tag, Sparkles, ArrowLeft, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

export const OffersSlider: React.FC = () => {
  const { offers, navigateTo, setFilterOptions } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeOffers = offers.filter((o) => o.active);

  useEffect(() => {
    if (activeOffers.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeOffers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeOffers.length]);

  if (activeOffers.length === 0) return null;

  const currentOffer = activeOffers[activeIndex];

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOfferClick = () => {
    if (currentOffer.serviceCategoryId) {
      setFilterOptions((prev) => ({ ...prev, categoryId: currentOffer.serviceCategoryId }));
      navigateTo('search', { categoryId: currentOffer.serviceCategoryId });
    } else {
      navigateTo('categories');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm border border-slate-200/80 bg-slate-900 text-white">
      <div
        onClick={handleOfferClick}
        className="cursor-pointer relative min-h-[170px] sm:min-h-[190px] p-5 sm:p-7 flex flex-col justify-between overflow-hidden group"
      >
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentOffer.bannerImage}
            alt={currentOffer.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        {/* Top Tag & Discount */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>عرض حصري ({currentOffer.discountPercent}% خصم)</span>
          </span>

          {currentOffer.code && (
            <button
              type="button"
              onClick={(e) => handleCopyCode(e, currentOffer.code)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/20 hover:bg-white/30 backdrop-blur text-white border border-white/30 transition-colors shadow-sm"
              title="نسخ كود الخصم"
            >
              <Tag className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentOffer.code}</span>
              {copiedCode === currentOffer.code ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-300" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 my-2 max-w-lg">
          <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
            {currentOffer.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
            {currentOffer.description}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            <span>احجز الآن واستفد من الخصم</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {activeOffers.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeIndex ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
