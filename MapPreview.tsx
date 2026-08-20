import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, CheckCircle } from 'lucide-react';
import { GeoLocation } from '../../types';

interface MapPreviewProps {
  location?: GeoLocation;
  technicianLocation?: GeoLocation;
  interactive?: boolean;
  onLocationSelect?: (loc: GeoLocation) => void;
  height?: string;
  showRoute?: boolean;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  location = {
    lat: 24.7742,
    lng: 46.6384,
    city: 'الرياض',
    district: 'حي الملقا',
    addressText: 'شارع أنس بن مالك، فيلا 42',
  },
  technicianLocation,
  interactive = false,
  onLocationSelect,
  height = 'h-52',
  showRoute = false,
}) => {
  const [currentLoc, setCurrentLoc] = useState<GeoLocation>(location);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  const popularLocations = [
    { city: 'الرياض', district: 'حي الملقا', addressText: 'شارع أنس بن مالك', lat: 24.7742, lng: 46.6384 },
    { city: 'الرياض', district: 'حي النرجس', addressText: 'طريق الملك سلمان', lat: 24.8142, lng: 46.6582 },
    { city: 'جدة', district: 'حي الروضة', addressText: 'شارع الأمير سلطان', lat: 21.5794, lng: 39.1607 },
    { city: 'الدمام', district: 'حي الشاطئ', addressText: 'طريق الخليج', lat: 26.434, lng: 50.103 },
  ];

  const handleSelect = (loc: typeof popularLocations[0]) => {
    setCurrentLoc(loc);
    if (onLocationSelect) {
      onLocationSelect(loc);
    }
  };

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100`}>
      {/* Map visual background */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          mapType === 'satellite'
            ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900'
            : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-sky-50/70'
        }`}
      >
        {/* Simulated map grid lines & roads */}
        <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#94a3b8" strokeWidth="2" />
          <line x1="35%" y1="0" x2="35%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
          <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="8 6" />

          {/* Route path */}
          {showRoute && (
            <path
              d="M 120 70 Q 220 120 280 140"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {/* Map controls overlay */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-200 text-slate-700 hover:text-emerald-600 transition-colors text-xs flex items-center gap-1 font-medium"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{mapType === 'standard' ? 'خريطة' : 'أقمار'}</span>
        </button>
      </div>

      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur text-white text-[11px] font-semibold rounded-full shadow-sm flex items-center gap-1">
          <Navigation className="w-3 h-3" />
          <span>GPS دقيق</span>
        </span>
      </div>

      {/* Pins */}
      {/* Customer Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 animate-ping absolute inset-0 -m-1"></div>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <span className="mt-1 px-2 py-0.5 bg-slate-900/80 text-white text-[11px] rounded-md font-medium shadow backdrop-blur whitespace-nowrap">
          موقع الخدمة ({currentLoc.district || currentLoc.city})
        </span>
      </div>

      {/* Technician Pin if provided */}
      {technicianLocation && (
        <div className="absolute top-[25%] left-[25%] flex flex-col items-center pointer-events-none z-10">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <span className="mt-0.5 px-1.5 py-0.5 bg-blue-900/80 text-white text-[10px] rounded-md shadow whitespace-nowrap">
            موقع الفني (يبعد 2.4 كم)
          </span>
        </div>
      )}

      {/* Address Bar Bottom */}
      <div className="absolute bottom-2 inset-x-2 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-md flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-2 overflow-hidden">
          <Compass className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div className="truncate">
            <p className="font-semibold text-slate-800 truncate">{currentLoc.city} - {currentLoc.district}</p>
            <p className="text-[11px] text-slate-500 truncate">{currentLoc.addressText}</p>
          </div>
        </div>

        {interactive && (
          <div className="flex items-center gap-1 flex-shrink-0 mr-2">
            {popularLocations.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(item)}
                className={`px-1.5 py-1 rounded text-[10px] border transition-colors ${
                  currentLoc.district === item.district
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.city.slice(0, 4)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
