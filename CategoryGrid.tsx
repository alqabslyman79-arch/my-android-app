import React from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { ArrowLeft, ChevronLeft } from 'lucide-react';

interface CategoryGridProps {
  limit?: number;
  showAllButton?: boolean;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ limit, showAllButton = true }) => {
  const { categories, navigateTo, setFilterOptions } = useApp();

  const displayCategories = limit ? categories.slice(0, limit) : categories;

  const handleCategoryClick = (cat: ServiceCategory) => {
    setFilterOptions((prev) => ({ ...prev, categoryId: cat.id }));
    navigateTo('search', { categoryId: cat.id, categoryName: cat.nameAr });
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            تصنيفات الخدمات المنزلية
          </h2>
          <p className="text-xs text-slate-500">اختر نوع الخدمة لتصفح الفنيين المعتمدين</p>
        </div>

        {showAllButton && (
          <button
            type="button"
            onClick={() => navigateTo('categories')}
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>عرض الكل ({categories.length})</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3.5">
        {displayCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group active:scale-95"
          >
            {/* Category Icon Container */}
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-sm mb-2 group-hover:scale-105 transition-transform`}
            >
              <IconRenderer name={cat.iconName} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>

            {/* Category Title */}
            <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {cat.nameAr}
            </span>

            {/* Subtitle / Starting price */}
            <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
              يبدأ من {cat.startingPrice} ر.س
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
