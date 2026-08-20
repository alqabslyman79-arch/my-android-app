import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import {
  Wrench,
  Plus,
  Trash2,
  Edit2,
  Save,
  ArrowRight,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const TechServicesScreen: React.FC = () => {
  const { currentUser, technicians, updateTechnicianProfileData, goBack } = useApp();

  const currentTech =
    technicians.find((t) => t.id === currentUser.id) ||
    technicians.find((t) => t.phone === currentUser.phone) ||
    technicians[0];

  const [services, setServices] = useState<ServiceItem[]>(currentTech.services || []);
  const [basePrice, setBasePrice] = useState(currentTech.basePrice || 100);
  const [workingHours, setWorkingHours] = useState(currentTech.workingHours || '8:00 ص - 10:00 م');
  const [bio, setBio] = useState(currentTech.bio || '');

  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceUnit, setNewServiceUnit] = useState('خدمة');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    const newSrv: ServiceItem = {
      id: `srv_${Date.now()}`,
      name: newServiceName,
      price: Number(newServicePrice),
      unit: newServiceUnit,
    };

    setServices([...services, newSrv]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleSaveChanges = () => {
    updateTechnicianProfileData(currentTech.id, {
      services,
      basePrice,
      workingHours,
      bio,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24 sm:pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
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
              إدارة خدماتي وأسعاري
            </h1>
            <p className="text-xs text-slate-500">
              تحديد قائمة الخدمات والأسعار المعتمدة للعملاء
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التعديلات</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ وتحديث بيانات الخدمات والأسعار بنجاح في النظام!</span>
        </div>
      )}

      {/* General Pricing & Work Hours */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900">إعدادات التسعير والدوام</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              سعر الكشف والزيارة الأساسي (ر.س)
            </label>
            <div className="relative">
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
              />
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">يخصم من إجمالي الفاتورة عند الاتفاق على الإصلاح</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              ساعات العمل المعتمدة
            </label>
            <div className="relative">
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="مثال: 8:00 ص - 10:00 م"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            نبذة عن خبراتك ومؤهلاتك (تظهر للعميل في ملفك)
          </label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2.5 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Services List Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">
            قائمة الخدمات الفرعية ({services.length})
          </h3>
          <span className="text-xs text-slate-400">يمكن للعميل اختيار بنود محددة</span>
        </div>

        <div className="divide-y divide-slate-100">
          {services.map((srv) => (
            <div key={srv.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{srv.name}</h4>
                <span className="text-[11px] text-slate-400">حساب التسعير: {srv.unit || 'خدمة'}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-black text-emerald-700 text-sm">{srv.price} ر.س</span>
                <button
                  type="button"
                  onClick={() => handleDeleteService(srv.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="حذف الخدمة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Service Form */}
        <form onSubmit={handleAddService} className="pt-3 border-t border-slate-100 space-y-2.5">
          <span className="text-xs font-bold text-slate-700 block">إضافة خدمة جديدة للقائمة:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="اسم الخدمة (مثال: صيانة مروحة السقف)"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs"
              required
            />
            <input
              type="number"
              placeholder="السعر (ر.س)"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs"
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="الوحدة (قطعة / متر)"
                value={newServiceUnit}
                onChange={(e) => setNewServiceUnit(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs"
              />
              <button
                type="submit"
                className="w-1/2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
