import React from 'react';
import { Pilgrim } from '../types';
import { X, Printer, ShieldCheck, Heart, User, Calendar, MapPin, Phone, AlertTriangle } from 'lucide-react';

interface PilgrimPassModalProps {
  pilgrim: Pilgrim | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PilgrimPassModal: React.FC<PilgrimPassModalProps> = ({ pilgrim, isOpen, onClose }) => {
  if (!isOpen || !pilgrim) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-amber-200 shadow-2xl overflow-hidden my-6">
        {/* Action Header */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-orange-400 font-bold text-sm">Official Pilgrimage Pass</span>
            <span className="text-xs bg-stone-800 text-stone-300 px-2 py-0.5 rounded">Verified Yatra ID</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-md transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div id="printable-yatra-pass" className="p-6 sm:p-8 bg-amber-50/30">
          <div className="border-2 border-orange-500 rounded-2xl p-6 bg-white relative overflow-hidden shadow-sm">
            {/* Spiritual Watermark */}
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none text-9xl font-serif text-orange-900">
              ॐ
            </div>

            {/* Header Badge */}
            <div className="text-center border-b border-orange-200 pb-4 mb-4">
              <div className="text-xs font-bold tracking-widest text-orange-700 uppercase">
                ॥ जय जय राम कृष्ण हरी ॥ ज्ञानोबा माऊली तुकाराम ॥
              </div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 mt-1">
                श्री संत ज्ञानेश्वर महाराज पालखी सोहळा, आळंदी देवची
              </h2>
              <div className="text-xs font-semibold text-orange-800 mt-0.5">
                ALANDI YATRA OFFICIAL PILGRIM PASS & IDENTITY BADGE (२०२६)
              </div>
              <div className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-mono text-sm font-bold border border-amber-300">
                Reg ID: {pilgrim.registration_number}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Pilgrim Avatar / Photo Placeholder */}
              <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <div className="w-20 h-24 bg-white border border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-400 mb-2">
                  <User className="w-8 h-8 text-orange-600 mb-1" />
                  <span className="text-[9px] font-medium uppercase text-stone-500">Pilgrim Photo</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified Varkari
                </span>
                <span className="text-[10px] text-stone-500 mt-1">Dindi / Group Pass</span>
              </div>

              {/* Pilgrim Details */}
              <div className="sm:col-span-2 space-y-2 text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Full Name / नाव:</span>
                  <span className="font-bold text-stone-900 text-sm">{pilgrim.full_name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-semibold">Age / Gender:</span>
                    <span className="font-semibold text-stone-800">{pilgrim.age} Yrs / {pilgrim.gender}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-semibold">Accompanying:</span>
                    <span className="font-semibold text-orange-700">+{pilgrim.accompanying_count} Members</span>
                  </div>
                </div>

                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Mobile Number:</span>
                  <span className="font-mono font-semibold text-stone-800">{pilgrim.mobile}</span>
                </div>

                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Native Place / गाव:</span>
                  <span className="text-stone-800">{pilgrim.city}, {pilgrim.state} ({pilgrim.pincode})</span>
                </div>

                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                  <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-rose-700">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>Emergency Contact (आपत्कालीन संपर्क):</span>
                  </div>
                  <div className="font-semibold text-xs mt-0.5">
                    {pilgrim.emergency_contact_name}: <span className="font-mono">{pilgrim.emergency_contact_phone}</span>
                  </div>
                </div>

                {pilgrim.special_needs && pilgrim.special_needs !== 'None' && (
                  <div className="text-[10px] bg-blue-50 text-blue-900 p-1.5 rounded border border-blue-200">
                    <span className="font-bold">Special Needs: </span>{pilgrim.special_needs}
                  </div>
                )}
              </div>
            </div>

            {/* QR Simulation & Barcode */}
            <div className="mt-5 pt-4 border-t border-dashed border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Barcode Graphic Simulation */}
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-end gap-[2px] h-9">
                  {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5].map((h, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-900"
                      style={{ width: `${(idx % 3 === 0 ? 3 : 1.5)}px`, height: `${20 + (h % 5) * 3}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-stone-500 tracking-wider mt-0.5">
                  *{pilgrim.registration_number.replace('-', '')}*
                </span>
              </div>

              {/* Official Stamp */}
              <div className="text-right flex items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-orange-600 flex flex-col items-center justify-center text-[8px] font-bold text-orange-700 uppercase leading-tight text-center rotate-[-12deg]">
                  <span>ALANDI</span>
                  <span>TEMPLE</span>
                  <span>VERIFIED</span>
                </div>
                <div className="text-left text-[9px] text-stone-500">
                  <div>Issued Date: {new Date(pilgrim.created_at).toLocaleDateString()}</div>
                  <div className="text-emerald-700 font-semibold">Priority Darshan & Dharamshala Pass</div>
                  <div>Shree Alandi Devasthan Trust</div>
                </div>
              </div>
            </div>

            {/* Safety Footer */}
            <div className="mt-4 pt-2 border-t border-stone-200 text-[9px] text-stone-500 text-center leading-normal">
              Kindly keep this pass printed or on mobile. Free drinking water, Annachhatra food, and emergency medical camps are provided across Alandi. 24x7 Control Room: 020-27185200 | Ambulance: 108 | Police: 112.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
