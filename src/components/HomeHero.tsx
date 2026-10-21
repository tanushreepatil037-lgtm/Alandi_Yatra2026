import React from 'react';
import {
  Pilgrim,
  AccommodationCenter,
  FoodCenter,
  WaterPoint,
  MedicalCenter,
  Announcement,
  YatraEvent,
} from '../types';
import {
  Calendar,
  Users,
  Bed,
  Utensils,
  Droplets,
  HeartPulse,
  MapPin,
  ArrowRight,
  Shield,
  Siren,
  Megaphone,
  Printer,
  Compass,
} from 'lucide-react';

interface HomeHeroProps {
  events: YatraEvent[];
  announcements: Announcement[];
  totalPilgrims: number;
  availableBeds: number;
  totalBeds: number;
  totalMeals: number;
  onOpenRegister: () => void;
  onOpenSOS: () => void;
  onNavigateTab: (tab: string) => void;
  onViewPass?: (p: Pilgrim) => void;
  samplePilgrim?: Pilgrim;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  events,
  announcements,
  totalPilgrims,
  availableBeds,
  totalBeds,
  totalMeals,
  onOpenRegister,
  onOpenSOS,
  onNavigateTab,
  onViewPass,
  samplePilgrim,
}) => {
  const currentEvent = events[0] || {
    title: 'Sant Dnyaneshwar Maharaj Ashadhi Palkhi Sohala 2026',
    description: 'The world-renowned spiritual pilgrimage of Varkaris carrying Mauli padukas to Pandharpur.',
    start_date: '2026-06-25',
    end_date: '2026-07-15',
    expected_pilgrims: 650000,
  };

  return (
    <div className="space-y-8">
      {/* Hero Spiritual Banner */}
      <div
        className="relative rounded-3xl overflow-hidden bg-orange-700 bg-linear-to-br from-amber-800 via-orange-700 to-amber-900 text-white shadow-xl"
        style={{ backgroundColor: '#c2410c' }}
      >
        {/* Subtle Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-xs font-semibold uppercase tracking-widest border border-white/20">
            <span>🚩</span>
            <span>॥ ज्ञानोबा माऊली तुकाराम ॥ आळंदी देवची</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Alandi Yatra Management System
          </h1>

          <p className="text-sm sm:text-lg text-amber-100 max-w-3xl mx-auto font-normal leading-relaxed">
            Welcome to the official digital portal for the sacred <strong>Sant Dnyaneshwar Maharaj Palkhi Sohala</strong>.
            Coordinate online pilgrim passes, Dharamshala shelters, free Mahaprasad dining, RO water points, and 24x7 medical assistance.
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3 bg-white text-orange-800 hover:bg-amber-50 rounded-xl text-sm font-black shadow-lg hover:shadow-xl transition flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>+ Register as Pilgrim (वारी नोंदणी)</span>
              <ArrowRight className="w-4 h-4 text-orange-600" />
            </button>

            <button
              onClick={() => onNavigateTab('accommodation')}
              className="px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white rounded-xl text-sm font-bold border border-white/30 transition flex items-center gap-2"
            >
              <Bed className="w-4 h-4" />
              <span>Book Dharamshala</span>
            </button>

            <button
              onClick={() => onNavigateTab('map')}
              className="px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white rounded-xl text-sm font-bold border border-white/30 transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Interactive Map</span>
            </button>

            <button
              onClick={onOpenSOS}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <Siren className="w-4 h-4" />
              <span>Emergency SOS</span>
            </button>
          </div>

          {samplePilgrim && onViewPass && (
            <div className="pt-2">
              <button
                onClick={() => onViewPass(samplePilgrim)}
                className="text-xs text-amber-200 hover:text-white underline font-semibold flex items-center justify-center gap-1 mx-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View Sample Registered Yatra Pass ({samplePilgrim.registration_number})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Key Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{totalPilgrims.toLocaleString()}+</div>
            <div className="text-xs font-semibold text-stone-500 uppercase">Registered Varkaris</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Bed className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-900">{availableBeds} / {totalBeds}</div>
            <div className="text-xs font-semibold text-stone-500 uppercase">Free Shelter Beds</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{totalMeals.toLocaleString()}</div>
            <div className="text-xs font-semibold text-stone-500 uppercase">Daily Mahaprasad Meals</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">24x7</div>
            <div className="text-xs font-semibold text-stone-500 uppercase">RO Pure Water Posts</div>
          </div>
        </div>
      </div>

      {/* Featured Event Card & Latest Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ongoing Event Highlight */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
              Main Yatra Event (प्रमुख सोहळा)
            </span>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>{currentEvent.start_date} to {currentEvent.end_date}</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">{currentEvent.title}</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{currentEvent.description}</p>

          {/* Yatra Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs space-y-1">
              <div className="font-bold text-orange-800">1. Indrayani Snan</div>
              <p className="text-stone-600 text-[11px]">Holy dip at Siddhabetta & Alandi Ghats with round-the-clock safety guards.</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs space-y-1">
              <div className="font-bold text-orange-800">2. Palkhi Prasthan</div>
              <p className="text-stone-600 text-[11px]">Auspicious departure ceremony from Samadhi Mandir with traditional chopdars.</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs space-y-1">
              <div className="font-bold text-orange-800">3. Varkari Seva</div>
              <p className="text-stone-600 text-[11px]">Free community shelter, hot satvik meals, and medical camps on route.</p>
            </div>
          </div>
        </div>

        {/* Announcements Ticker */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-orange-600" />
                <span>Live Announcements</span>
              </h4>
              <button
                onClick={() => onNavigateTab('announcements')}
                className="text-xs text-orange-600 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-xl border border-stone-100 bg-stone-50/60 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        ann.priority === 'urgent'
                          ? 'bg-red-600 text-white'
                          : ann.priority === 'high'
                          ? 'bg-orange-500 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(ann.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="font-bold text-stone-900 mt-1">{ann.title}</div>
                  <p className="text-stone-600 text-[11px] line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Verified by Devasthan Control Room</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Quick Services Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('accommodation')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition">
            <Bed className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Dharamshalas & Rain Basera</h4>
          <p className="text-xs text-stone-500">
            Verified shelters with bed capacities, separate women facilities, CCTV, and locker rooms.
          </p>
          <div className="text-xs font-semibold text-purple-700 flex items-center gap-1 pt-1">
            <span>Book Accommodation</span> &rarr;
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('map')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-md cursor-pointer transition space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
            <Utensils className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Annachhatra & Meals</h4>
          <p className="text-xs text-stone-500">
            4 large community kitchens serving unlimited hygienic Mahaprasad, tea, and warm milk.
          </p>
          <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 pt-1">
            <span>Locate Food Centers</span> &rarr;
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('map')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-rose-300 hover:shadow-md cursor-pointer transition space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Medical Centers & 108</h4>
          <p className="text-xs text-stone-500">
            Alandi Rural Hospital, first-aid posts, heatstroke clinics, and advanced life support ambulances.
          </p>
          <div className="text-xs font-semibold text-rose-700 flex items-center gap-1 pt-1">
            <span>View Medical Posts</span> &rarr;
          </div>
        </div>

        <div
          onClick={() => {
            if (samplePilgrim && onViewPass) {
              onViewPass(samplePilgrim);
            } else {
              onNavigateTab('my_pass');
            }
          }}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-amber-300 hover:shadow-md cursor-pointer transition space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Official Yatra Pass</h4>
          <p className="text-xs text-stone-500">
            View & print your verified pilgrim identity badge, Dindi entry QR, and family details.
          </p>
          <div className="text-xs font-semibold text-orange-700 flex items-center gap-1 pt-1">
            <span>View My Pass</span> &rarr;
          </div>
        </div>
      </div>
    </div>
  );
};
