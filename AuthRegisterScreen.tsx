import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Wrench,
  User,
  Phone,
  Lock,
  MapPin,
  Briefcase,
  ChevronLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AuthRegisterScreen: React.FC = () => {
  const { registerUser, navigateTo, categories } = useApp();

  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('الرياض');
  const [district, setDistrict] = useState('حي الملقا');
  const [specialtyId, setSpecialtyId] = useState(categories[0]?.id || 'cat_ac');
  const [bio, setBio] = useState('');
  const [basePrice, setBasePrice] = useState(100);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const specialty = categories.find((c) => c.id === specialtyId);

    registerUser({
      name,
      phone,
      role,
      location: {
        lat: 24.7136,
        lng: 46.6753,
        city,
        district,
        addressText: `${city} - ${district}`,
      },
      specialtyId: role === 'technician' ? specialtyId : undefined,
      specialtyName: role === 'technician' ? specialty?.nameAr : undefined,
      bio: role === 'technician' ? bio : undefined,
      basePrice: role === 'technician' ? basePrice : undefined,
    });

    navigateTo('home');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">إنشاء حساب جديد</h1>
          <p className="text-xs text-slate-500">انضم إلى شبكة خِدمَتي كعميل أو مقدم خدمة معتمد</p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'customer'
                ? 'bg-white text-emerald-700 shadow font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👤 حساب عميل (طلب خدمات)
          </button>
          <button
            type="button"
            onClick={() => setRole('technician')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'technician'
                ? 'bg-white text-emerald-700 shadow font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛠️ حساب فني (تقديم خدمات)
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">الاسم الكامل *</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: خالد العتيبي"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 pl-4 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">رقم الجوال *</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 pl-4 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">المدينة</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2.5 rounded-2xl text-xs font-bold focus:outline-none"
              >
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="الدمام">الدمام</option>
                <option value="مكة المكرمة">مكة المكرمة</option>
                <option value="المدينة المنورة">المدينة المنورة</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">الحي</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="اسم الحي"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2.5 rounded-2xl text-xs font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Technician Specific Fields */}
          {role === 'technician' && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Briefcase className="w-4 h-4" />
                <span>بيانات الفني المهنية</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  التخصص المهني
                </label>
                <select
                  value={specialtyId}
                  onChange={(e) => setSpecialtyId(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2 rounded-xl text-xs font-bold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  سعر الكشف والزيارة التقديري (ر.س)
                </label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  نبذة عن خبراتك ومؤهلاتك
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="سنوات الخبرة، الشهادات، نوعية الأعمال التي تنفذها..."
                  className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">كلمة المرور *</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-4 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
          >
            <span>إتمام التسجيل والبدء</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            لديك حساب بالفعل؟{' '}
            <button
              type="button"
              onClick={() => navigateTo('auth_login')}
              className="text-emerald-600 font-extrabold hover:underline"
            >
              تسجيل الدخول
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
