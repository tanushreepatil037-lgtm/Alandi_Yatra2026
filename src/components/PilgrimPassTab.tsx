import React from 'react';
import { Pilgrim } from '../types';
import { Printer, ShieldCheck, User, Calendar, MapPin, Phone, AlertTriangle, Users, Plus } from 'lucide-react';

interface PilgrimPassTabProps {
  currentPilgrim: Pilgrim | null;
  onOpenRegister: () => void;
  onPrintPass: () => void;
}

export const PilgrimPassTab: React.FC<PilgrimPassTabProps> = ({
  currentPilgrim,
  onOpenRegister,
  onPrintPass,
}) => {
  if (!currentPilgrim) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl font-bold">
          🪪
        </div>
        <h3 className="text-lg font-bold text-stone-900">No Pilgrim Registration Found</h3>
        <p className="text-xs text-stone-600">
          You have not registered for an official Yatra Pass yet. Register now to receive your verified pass, accommodation eligibility, and priority Darshan queues.
        </p>
        <button
          onClick={onOpenRegister}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          + Register for Yatra Pass
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Alandi Devasthan Devotee Identification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            My Yatra Pass & Identity Badge (वारकरी ओळखपत्र)
          </h2>
          <p className="text-xs text-stone-500">
            Keep this digital pass saved or carry a printout for priority queues, free Dharamshala entry, and medical help.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrintPass}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Pass</span>
          </button>
          <button
            onClick={onOpenRegister}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Styled Physical Pass Card */}
      <div className="bg-white rounded-3xl border-2 border-orange-500 p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute right-6 bottom-4 opacity-5 pointer-events-none select-none text-9xl font-serif text-orange-900">
          ॐ
        </div>

        {/* Top Sacred Header */}
        <div className="text-center border-b border-orange-200 pb-5 mb-6">
          <div className="text-xs font-bold tracking-widest text-orange-700 uppercase">
            ॥ जय जय राम कृष्ण हरी ॥ ज्ञानोबा माऊली तुकाराम ॥
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            श्री संत ज्ञानेश्वर महाराज पालखी सोहळा, आळंदी देवची
          </h3>
          <div className="text-xs font-semibold text-orange-800 mt-0.5">
            ALANDI DEVOTEES VERIFIED YATRA REGISTRATION PASS (२०२६)
          </div>
          <div className="inline-block mt-3 px-4 py-1 bg-amber-100 text-amber-950 rounded-full font-mono text-sm font-bold border border-amber-300">
            Registration No: {currentPilgrim.registration_number}
          </div>
        </div>

        {/* Pass Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* Photo Slot */}
          <div className="flex flex-col items-center justify-center p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-center">
            <div className="w-24 h-28 bg-white border border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400 mb-2">
              <User className="w-10 h-10 text-orange-600 mb-1" />
              <span className="text-[10px] font-medium uppercase text-stone-500">Pilgrim Photo</span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
              Status: {currentPilgrim.status.toUpperCase()}
            </span>
            <span className="text-[11px] text-stone-500 mt-1">Varkari Dindi Member</span>
          </div>

          {/* Core Info */}
          <div className="sm:col-span-2 space-y-3 text-xs">
            <div>
              <span className="text-stone-500 block text-[11px] uppercase font-semibold">Pilgrim Full Name (वारकरी नाव):</span>
              <span className="font-bold text-stone-900 text-base">{currentPilgrim.full_name}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-stone-500 block text-[11px] uppercase font-semibold">Age / Gender:</span>
                <span className="font-semibold text-stone-800">{currentPilgrim.age} Yrs / {currentPilgrim.gender}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px] uppercase font-semibold">Accompanying Group:</span>
                <span className="font-semibold text-orange-700">+{currentPilgrim.accompanying_count} Members</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-stone-500 block text-[11px] uppercase font-semibold">Contact Mobile:</span>
                <span className="font-mono font-bold text-stone-800">{currentPilgrim.mobile}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px] uppercase font-semibold">Native Place:</span>
                <span className="text-stone-800 font-medium">{currentPilgrim.city}, {currentPilgrim.state}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
              <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase text-rose-700">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Emergency Contact Person (आपत्कालीन संपर्क):</span>
              </div>
              <div className="font-semibold text-xs mt-1">
                {currentPilgrim.emergency_contact_name} — <span className="font-mono">{currentPilgrim.emergency_contact_phone}</span>
              </div>
            </div>

            {currentPilgrim.special_needs && currentPilgrim.special_needs !== 'None' && (
              <div className="p-2 rounded-lg bg-blue-50 text-blue-900 text-xs border border-blue-200">
                <strong>Assistance Request:</strong> {currentPilgrim.special_needs}
              </div>
            )}
          </div>
        </div>

        {/* Barcode & Verification Seal */}
        <div className="mt-6 pt-5 border-t border-dashed border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-end gap-[2px] h-10">
              {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5].map((h, idx) => (
                <div
                  key={idx}
                  className="bg-stone-900"
                  style={{ width: `${idx % 3 === 0 ? 3 : 1.5}px`, height: `${22 + (h % 5) * 3}px` }}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] text-stone-500 tracking-wider mt-1">
              *{currentPilgrim.registration_number.replace('-', '')}*
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-orange-600 flex flex-col items-center justify-center text-[9px] font-bold text-orange-700 uppercase leading-tight text-center rotate-[-10deg]">
              <span>ALANDI</span>
              <span>DEVASHTHAN</span>
              <span>VERIFIED</span>
            </div>
            <div className="text-right text-[10px] text-stone-500">
              <div>Issued: {new Date(currentPilgrim.created_at).toLocaleDateString()}</div>
              <div className="text-emerald-700 font-semibold">Priority Darshan Access</div>
              <div>Alandi Devasthan Trust</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
