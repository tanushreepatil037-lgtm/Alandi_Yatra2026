import React from 'react';
import { MapPin, Phone, Mail, Shield, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenSOS: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenSOS }) => {
  return (
    <footer className="mt-16 bg-stone-900 text-stone-300 border-t-4 border-orange-600">
      {/* Top Spiritual Chant Bar */}
      <div className="bg-stone-950 py-3 text-center border-b border-stone-800">
        <p className="text-xs sm:text-sm font-serif text-amber-400 font-bold tracking-widest uppercase">
          ॥ अवघा रंग एक झाला । रंगी रंगला श्रीरंग ॥ ज्ञानोबा माऊली तुकाराम ॥
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg">
                ॐ
              </div>
              <span className="text-base font-bold text-white">Alandi Yatra System</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Official pilgrimage logistics and public service portal for Sant Dnyaneshwar Maharaj Palkhi Sohala and Kartiki Ekadashi, Alandi Devachi, Maharashtra.
            </p>
            <div className="text-[11px] text-stone-500">
              Joint initiative of Shree Alandi Devasthan Trust & Alandi Municipal Council.
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Services</h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-amber-400 transition">
                  Home / मुख्यपृष्ठ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('map')} className="hover:text-amber-400 transition">
                  Facilities Map / नकाशा
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('accommodation')} className="hover:text-amber-400 transition">
                  Dharamshalas / निवास
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('announcements')} className="hover:text-amber-400 transition">
                  Announcements / सूचना
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">24x7 Emergency Helplines</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-800 border border-stone-700">
                <span className="text-stone-300">Free Ambulance</span>
                <a href="tel:108" className="text-rose-400 font-mono font-bold hover:underline">
                  108
                </a>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-800 border border-stone-700">
                <span className="text-stone-300">Police Emergency</span>
                <a href="tel:112" className="text-blue-400 font-mono font-bold hover:underline">
                  112
                </a>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-800 border border-stone-700">
                <span className="text-stone-300">Alandi Rural Hospital</span>
                <a href="tel:02027185108" className="text-emerald-400 font-mono font-bold hover:underline">
                  020-27185108
                </a>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-800 border border-stone-700">
                <span className="text-stone-300">Temple Control Room</span>
                <a href="tel:02027185200" className="text-amber-400 font-mono font-bold hover:underline">
                  020-27185200
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Platform & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform & Security</h4>
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-xs text-stone-400 space-y-1.5">
              <div className="font-semibold text-stone-200">Architecture Features:</div>
              <div>• Strict Role-Based Access Control (RBAC)</div>
              <div>• Leaflet & OpenStreetMap GIS for Alandi</div>
              <div>• Real-time Dharamshala Quota Enforcement</div>
              <div>• Instant Emergency SOS & Field Dispatch</div>
              <div>• Printable Official Yatra Passes & Badges</div>
            </div>
            <button
              onClick={onOpenSOS}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Instant Emergency Assistance</span>
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            &copy; 2026 Alandi Yatra Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Palkhi Sohala • Indrayani Ghat • Samadhi Mandir</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
