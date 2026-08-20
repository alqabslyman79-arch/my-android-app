import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TechnicianCard } from '../components/home/TechnicianCard';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Star,
  MapPin,
  Check,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Users,
} from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const {
    technicians,
    categories,
    filterOptions,
    setFilterOptions,
    resetFilter,
    currentUser,
  } = useApp();

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [query, setQuery] = useState(filterOptions.searchQuery || '');

  const cities = ['الكل', 'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'الخبر'];

  // Perform multi-facet filtering on technicians
  const filteredTechnicians = technicians.filter((tech) => {
    // Search query
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchName = tech.name.toLowerCase().includes(q);
      const matchSpecialty = tech.specialtyName.toLowerCase().includes(q);
      const matchCity = tech.city.toLowerCase().includes(q);
      const matchBio = tech.bio.toLowerCase().includes(q);
      const matchServices = tech.services.some((s) => s.name.toLowerCase().includes(q));
      if (!matchName && !matchSpecialty && !matchCity && !matchBio && !matchServices) {
        return false;
      }
    }

    // Category filter
    if (filterOptions.categoryId && tech.specialtyId !== filterOptions.categoryId) {
      return false;
    }

    // City filter
    if (filterOptions.city && filterOptions.city !== 'الكل' && tech.city !== filterOptions.city) {
      return false;
    }

    // Only Available
    if (filterOptions.onlyAvailable && !tech.isAvailable) {
      return false;
    }

    // Min rating
    if (filterOptions.minRating && tech.rating < filterOptions.minRating) {
      return false;
    }

    // Max Price
    if (filterOptions.maxPrice && tech.basePrice > filterOptions.maxPrice) {
      return false;
    }

    return true;
  });

  // Sort
  const sortedTechnicians = [...filteredTechnicians].sort((a, b) => {
    switch (filterOptions.sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price_low':
        return a.basePrice - b.basePrice;
      case 'price_high':
        return b.basePrice - a.basePrice;
      case 'experience':
        return b.experienceYears - a.experienceYears;
      case 'completed':
        return b.completedOrders - a.completedOrders;
      default:
        return b.rating - a.rating;
    }
  });

  const activeFiltersCount =
    (filterOptions.categoryId ? 1 : 0) +
    (filterOptions.city && filterOptions.city !== 'الكل' ? 1 : 0) +
    (filterOptions.onlyAvailable ? 1 : 0) +
    (filterOptions.minRating ? 1 : 0) +
    (filterOptions.maxPrice ? 1 : 0);

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* Search Bar & Quick Filters */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setFilterOptions((prev) => ({ ...prev, searchQuery: e.target.value }));
              }}
              placeholder="ابحث بالاسم، الخدمة، التخصص، أو المدينة..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 pl-4 pr-11 py-3 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setFilterOptions((prev) => ({ ...prev, searchQuery: '' }));
                }}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilterDrawer(true)}
            className={`p-3 rounded-2xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              activeFiltersCount > 0
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">فلاتر</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-white text-emerald-800 rounded-full flex items-center justify-center font-extrabold text-[10px]">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterOptions((prev) => ({ ...prev, categoryId: undefined }))}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              !filterOptions.categoryId
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            جميع التخصصات
          </button>

          {categories.map((cat) => {
            const isSelected = filterOptions.categoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    categoryId: isSelected ? undefined : cat.id,
                  }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.nameAr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-slate-900">
            نتائج البحث ({sortedTechnicians.length})
          </span>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetFilter}
              className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>مسح الفلاتر</span>
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <span>الترتيب:</span>
          <select
            value={filterOptions.sortBy || 'rating'}
            onChange={(e) =>
              setFilterOptions((prev) => ({
                ...prev,
                sortBy: e.target.value as any,
              }))
            }
            aria-label="ترتيب نتائج البحث عن الفنيين"
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800 text-xs focus:outline-none"
          >
            <option value="rating">الأعلى تقييماً ⭐</option>
            <option value="completed">الأكثر طلباً 💼</option>
            <option value="experience">الأكثر خبرة 🏆</option>
            <option value="price_low">الأقل سعراً 💰</option>
            <option value="price_high">الأعلى سعراً 💎</option>
          </select>
        </div>
      </div>

      {/* Technicians List */}
      {sortedTechnicians.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sortedTechnicians.map((tech) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">لا يوجد فنيون يطابقون خيارات البحث</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            جرب تغيير المدينة أو مسح فلاتر التقييم والسعر للوصول إلى خيارات أكثر.
          </p>
          <button
            type="button"
            onClick={resetFilter}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-700 transition-colors"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}

      {/* Filter Modal / Drawer */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">تصفية نتائج البحث</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* City Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">المدينة</label>
              <div className="grid grid-cols-3 gap-2">
                {cities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        city: c === 'الكل' ? undefined : c,
                      }))
                    }
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      (c === 'الكل' && !filterOptions.city) || filterOptions.city === c
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Only */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">المتاحون الآن فقط</span>
                <span className="text-[10px] text-slate-500">عرض الفنيين الجاهزين لاستقبال طلبات فورية</span>
              </div>
              <input
                type="checkbox"
                checked={!!filterOptions.onlyAvailable}
                onChange={(e) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    onlyAvailable: e.target.checked,
                  }))
                }
                aria-label="عرض الفنيين المتاحين الآن فقط"
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Min Rating */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">الحد الأدنى للتقييم</label>
              <div className="grid grid-cols-4 gap-2">
                {[4.8, 4.5, 4.0, 0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        minRating: rate === 0 ? undefined : rate,
                      }))
                    }
                    className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 ${
                      (rate === 0 && !filterOptions.minRating) || filterOptions.minRating === rate
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {rate > 0 ? (
                      <>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>+{rate}</span>
                      </>
                    ) : (
                      <span>الكل</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  resetFilter();
                  setShowFilterDrawer(false);
                }}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                إلغاء الفلاتر
              </button>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                تطبيق النتائج ({filteredTechnicians.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
