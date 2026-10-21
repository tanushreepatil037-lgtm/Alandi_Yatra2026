import React from 'react';
import { AccommodationCenter, AccommodationRequest, Pilgrim } from '../types';
import { Bed, MapPin, Phone, CheckCircle, AlertCircle, Plus, Users, Shield } from 'lucide-react';

interface AccommodationTabProps {
  accommodations: AccommodationCenter[];
  requests: AccommodationRequest[];
  currentPilgrim: Pilgrim | null;
  onRequestBooking: () => void;
}

export const AccommodationTab: React.FC<AccommodationTabProps> = ({
  accommodations,
  requests,
  currentPilgrim,
  onRequestBooking,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="bg-purple-900 bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: '#581c87' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
            <Bed className="w-4 h-4" />
            <span>Devotee Shelter & Dharamshala Quota Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            Alandi Pilgrim Accommodation (धर्मशाळा व भक्त निवास)
          </h2>
          <p className="text-xs text-purple-200 max-w-xl">
            Clean, verified boarding centers for visiting Varkaris. Book rooms or hall beds with confirmed priority passes.
          </p>
        </div>

        <button
          onClick={onRequestBooking}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Request Accommodation</span>
        </button>
      </div>

      {/* Centers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accommodations.map((center) => {
          const occupancy = Math.round(
            ((center.total_capacity - center.available_capacity) / center.total_capacity) * 100
          );
          const isFull = center.available_capacity <= 0;

          return (
            <div
              key={center.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4 hover:border-purple-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-stone-900">{center.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>{center.location}</span>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isFull
                      ? 'bg-rose-100 text-rose-800'
                      : center.available_capacity < 100
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isFull ? 'Housefull' : `${center.available_capacity} Free Beds`}
                </span>
              </div>

              {/* Occupancy Indicator */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Occupancy: {occupancy}%</span>
                  <span className="font-bold text-stone-900">
                    {center.total_capacity - center.available_capacity} / {center.total_capacity} Beds
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      occupancy > 90 ? 'bg-rose-600' : occupancy > 60 ? 'bg-amber-500' : 'bg-purple-600'
                    }`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>

              {/* Facilities Description */}
              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-stone-700 space-y-1">
                <div className="font-semibold text-purple-900">Key Facilities:</div>
                <p className="text-stone-600 leading-relaxed">{center.facilities}</p>
              </div>

              {/* Contact Footer */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    {center.contact_person}:{' '}
                    <a href={`tel:${center.contact_phone}`} className="font-semibold text-purple-800 hover:underline">
                      {center.contact_phone}
                    </a>
                  </span>
                </div>
                <button
                  onClick={onRequestBooking}
                  disabled={isFull}
                  className="px-3 py-1 bg-stone-100 hover:bg-purple-100 text-purple-900 rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {isFull ? 'Fully Booked' : 'Book Here'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Requests Status Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Accommodation Booking Request Status</h3>
            <p className="text-xs text-stone-500">
              Live status of your submitted Dharamshala room requests
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
            {requests.length} Requests Logged
          </span>
        </div>

        <div className="space-y-2.5">
          {requests.map((r) => (
            <div
              key={r.id}
              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-bold text-stone-900 text-sm">{r.center_name}</div>
                <div className="text-stone-600">
                  Pilgrim: <strong>{r.pilgrim_name}</strong> | Requested: <strong>{r.requested_beds} Beds</strong>
                </div>
                <div className="text-stone-500 text-[11px]">
                  Dates: {r.check_in_date} to {r.check_out_date}
                </div>
                {r.admin_remarks && (
                  <div className="text-[11px] text-purple-800 font-medium mt-1">
                    Remark: {r.admin_remarks}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    r.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : r.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
