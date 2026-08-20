import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IconRenderer } from '../components/common/IconRenderer';
import { Search, ChevronLeft, ArrowRight, Layers, Users } from 'lucide-react';

export const CategoriesScreen: React.FC = () => {
  const { categories, technicians, navigateTo, setFilterOptions, goBack } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(
    (c) =>
      c.nameAr.includes(searchTerm) ||
      c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.includes(searchTerm)
  );

  const handleSelectCategory = (categoryId: string, categoryName: string) => {
    setFilterOptions((prev) => ({ ...prev, categoryId }));
    navigateTo('search', { categoryId, categoryName });
  };

  return (
    <div className="space-y-5 pb-20 sm:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900">
                جميع تصنيفات الخدمات
              </h1>
              <p className="text-xs text-slate-500">
                تصفح {categories.length} تخصص مهني متاح في المنصة
              </p>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث في تصنيفات الخدمات المنزلية..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 pl-4 pr-11 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Categories Detailed Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredCategories.map((cat) => {
          const techCount = technicians.filter((t) => t.specialtyId === cat.id).length;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id, cat.nameAr)}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex items-start gap-3.5"
            >
              {/* Category Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}
              >
                <IconRenderer name={cat.iconName} className="w-7 h-7" />
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                    {cat.nameAr}
                  </h3>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    يبدأ من {cat.startingPrice} ر.س
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{techCount > 0 ? techCount : cat.techniciansCount} فني متاح</span>
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                    <span>عرض الفنيين</span>
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
