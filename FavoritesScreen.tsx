import React from 'react';
import { useApp } from '../context/AppContext';
import { TechnicianCard } from '../components/home/TechnicianCard';
import { Heart, ChevronLeft, Search } from 'lucide-react';

export const FavoritesScreen: React.FC = () => {
  const { favorites, technicians, navigateTo } = useApp();

  const favoriteTechnicians = technicians.filter((t) => favorites.includes(t.id));

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900">الفنيون المفضلون</h1>
            <p className="text-xs text-slate-500">قائمة الفنيين المحفوظين لسهولة الوصول والحجز</p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          {favoriteTechnicians.length} فني
        </span>
      </div>

      {/* Grid */}
      {favoriteTechnicians.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {favoriteTechnicians.map((tech) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">قائمة المفضلة فارغة</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            يمكنك إضافة أي فني إلى المفضلة بالنقر على أيقونة القلب في بطاقة الفني أو صفحته الشخصية.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('search')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-700 transition-colors"
          >
            استعراض الفنيين الآن
          </button>
        </div>
      )}
    </div>
  );
};
