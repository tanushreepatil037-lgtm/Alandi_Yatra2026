import React, { useState } from 'react';
import { AccommodationCenter, AccommodationRequest, Pilgrim } from '../types';
import { X, Bed, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';

interface AccommodationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  centers: AccommodationCenter[];
  currentPilgrim: Pilgrim | null;
  onRequestSubmitted: (request: AccommodationRequest) => void;
}

export const AccommodationRequestModal: React.FC<AccommodationRequestModalProps> = ({
  isOpen,
  onClose,
  centers,
  currentPilgrim,
  onRequestSubmitted,
}) => {
  const [selectedCenterId, setSelectedCenterId] = useState<number>(centers[0]?.id || 1);
  const [beds, setBeds] = useState<number>(1);
  const [checkIn, setCheckIn] = useState<string>('2026-06-25');
  const [checkOut, setCheckOut] = useState<string>('2026-06-28');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCenter = centers.find((c) => c.id === Number(selectedCenterId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCenter) {
      setError('Please select a valid accommodation center.');
      return;
    }

    if (beds <= 0) {
      setError('Please select at least 1 bed.');
      return;
    }

    if (beds > selectedCenter.available_capacity) {
      setError(
        `Selected shelter only has ${selectedCenter.available_capacity} beds available. Please reduce requested beds or choose another center.`
      );
      return;
    }

    if (!checkIn || !checkOut || checkIn >= checkOut) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    const newRequest: AccommodationRequest = {
      id: Date.now(),
      pilgrim_id: currentPilgrim ? currentPilgrim.id : 999,
      center_id: selectedCenter.id,
      requested_beds: Number(beds),
      check_in_date: checkIn,
      check_out_date: checkOut,
      status: 'pending',
      admin_remarks: 'Submitted by pilgrim online portal',
      created_at: new Date().toISOString(),
      pilgrim_name: currentPilgrim ? currentPilgrim.full_name : 'Guest Pilgrim',
      pilgrim_mobile: currentPilgrim ? currentPilgrim.mobile : '9822000000',
      center_name: selectedCenter.name,
    };

    onRequestSubmitted(newRequest);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-purple-200 shadow-2xl overflow-hidden my-6">
        <div className="bg-linear-to-r from-purple-800 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl">
              <Bed className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-purple-200 font-semibold">
                Dharamshala & Bhakta Niwas
              </div>
              <h3 className="text-lg font-bold">Request Accommodation (निवास व्यवस्था)</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1.5 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {currentPilgrim && (
            <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-xs space-y-1">
              <div className="font-semibold text-purple-900">
                Pilgrim: {currentPilgrim.full_name} ({currentPilgrim.registration_number})
              </div>
              <div className="text-purple-700">Mobile: {currentPilgrim.mobile} | Accompanying: +{currentPilgrim.accompanying_count}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Select Accommodation Shelter (धर्मशाळा निवडा)
            </label>
            <select
              value={selectedCenterId}
              onChange={(e) => setSelectedCenterId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            >
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — ({c.available_capacity} free beds of {c.total_capacity})
                </option>
              ))}
            </select>
          </div>

          {selectedCenter && (
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Available Capacity:</span>
                <span className={`font-bold ${selectedCenter.available_capacity > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {selectedCenter.available_capacity} / {selectedCenter.total_capacity} Beds
                </span>
              </div>
              <div className="text-stone-600">
                <strong>Location:</strong> {selectedCenter.location}
              </div>
              <div className="text-stone-600">
                <strong>Facilities:</strong> {selectedCenter.facilities}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Number of Beds Required (आवश्यक खाटांची संख्या)
            </label>
            <input
              type="number"
              min="1"
              max={selectedCenter ? Math.min(20, selectedCenter.available_capacity) : 10}
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-[11px] text-stone-500">Subject to approval by temple accommodation cell</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Check-in Date (आगमन)</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Check-out Date (प्रस्थान)</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Bed Booking Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
