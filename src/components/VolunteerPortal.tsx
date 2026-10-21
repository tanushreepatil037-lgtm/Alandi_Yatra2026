import React, { useState } from 'react';
import { Volunteer, VolunteerAssignment, Announcement, EmergencyRequest } from '../types';
import {
  UserCheck,
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
  BellRing,
  Phone,
  Shield,
  CheckCircle2,
  HeartHandshake,
  UserPlus,
} from 'lucide-react';

interface VolunteerPortalProps {
  currentVolunteer: Volunteer | null;
  volunteers: Volunteer[];
  assignments: VolunteerAssignment[];
  announcements: Announcement[];
  emergencies: EmergencyRequest[];
  onRegisterVolunteer: (newVol: Volunteer) => void;
  onUpdateStatus?: (volId: number, status: Volunteer['status']) => void;
}

export const VolunteerPortal: React.FC<VolunteerPortalProps> = ({
  currentVolunteer,
  volunteers,
  assignments,
  announcements,
  emergencies,
  onRegisterVolunteer,
}) => {
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<number>(
    currentVolunteer ? currentVolunteer.id : volunteers[0]?.id || 1
  );

  const [showRegForm, setShowRegForm] = useState(false);
  const [regData, setRegData] = useState({
    full_name: '',
    mobile: '',
    email: '',
    skills: 'Crowd Direction, First Aid, Translation',
    blood_group: 'B+',
    id_proof: 'Aadhaar Card',
  });

  const activeVol = volunteers.find((v) => v.id === selectedVolunteerId) || currentVolunteer || volunteers[0];
  const myAssignments = assignments.filter((a) => a.volunteer_id === activeVol?.id);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.full_name.trim() || !regData.mobile.trim()) {
      alert('Please provide full name and mobile number');
      return;
    }

    const newVol: Volunteer = {
      id: Date.now(),
      user_id: null,
      full_name: regData.full_name.trim(),
      mobile: regData.mobile.trim(),
      email: regData.email.trim() || 'volunteer@alandiyatra.org',
      skills: regData.skills,
      blood_group: regData.blood_group,
      id_proof: regData.id_proof,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    onRegisterVolunteer(newVol);
    setSelectedVolunteerId(newVol.id);
    setShowRegForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Volunteer Header */}
      <div
        className="bg-blue-900 bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: '#1e3a8a' }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-widest">
            <HeartHandshake className="w-4 h-4" />
            <span>॥ वारकरी सेवा हीच ईश्वर सेवा ॥ Sevekari Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Volunteer Duty & Field Coordination Center</h2>
          <p className="text-xs text-blue-200 max-w-xl">
            Access assigned patrol sectors, Darshan line monitoring, elderly support services, and immediate emergency escalation.
          </p>
        </div>

        {/* Profile Switcher or Register Button */}
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl backdrop-blur-xs">
          <label className="text-xs text-blue-200 font-medium">Logged Volunteer:</label>
          <select
            value={activeVol?.id || ''}
            onChange={(e) => setSelectedVolunteerId(Number(e.target.value))}
            className="bg-white text-stone-900 text-xs font-semibold px-2.5 py-1.5 rounded-lg focus:outline-hidden"
          >
            {volunteers.map((v) => (
              <option key={v.id} value={v.id}>
                {v.full_name} ({v.blood_group})
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowRegForm(true)}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
            title="Register as New Sevekari"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Duty Schedule + Field Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Allocated Shifts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>My Assigned Duty Shifts ({myAssignments.length})</span>
              </h3>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                Active Sevekari
              </span>
            </div>

            {myAssignments.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-xl">
                No active shift assigned yet for this volunteer. Temple administration will allocate duties prior to Palkhi departure.
              </div>
            ) : (
              <div className="space-y-3">
                {myAssignments.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-bold text-stone-900 text-sm">{shift.duty_role}</div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {shift.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span><strong>Location:</strong> {shift.location_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span><strong>Shift Hours:</strong> {shift.shift_start} to {shift.shift_end}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-100 text-[11px] text-stone-500 flex items-center justify-between">
                      <span>Shift Date: {shift.shift_date}</span>
                      <span className="text-blue-800 font-medium">Wear Official Saffron Volunteer Badge</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Incidents in the Field */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Field Assistance & Emergency Alerts</span>
              </h3>
              <span className="text-xs text-stone-500">Live feed for on-duty volunteers</span>
            </div>

            <div className="space-y-2">
              {emergencies
                .filter((e) => e.status !== 'resolved')
                .map((em) => (
                  <div
                    key={em.id}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-1"
                  >
                    <div className="flex justify-between font-bold text-stone-900">
                      <span className="text-amber-900">🚨 {em.emergency_type} Incident</span>
                      <span className="text-stone-500 text-[10px]">{em.location_details}</span>
                    </div>
                    <p className="text-stone-700">{em.description}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-600">
                      <span>Reporter Phone: <strong>{em.contact_number}</strong></span>
                      <span className="font-bold text-orange-700">Assist If In Your Sector</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Profile & Standard Operating Protocols */}
        <div className="space-y-4">
          {/* Volunteer Identity Card */}
          {activeVol && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  {activeVol.full_name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{activeVol.full_name}</h4>
                  <div className="text-xs text-stone-500 font-mono">{activeVol.mobile}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-xs space-y-1.5 text-stone-700">
                <div><strong>Email:</strong> {activeVol.email}</div>
                <div><strong>Blood Group:</strong> <span className="text-rose-700 font-bold">{activeVol.blood_group}</span></div>
                <div><strong>Skills:</strong> {activeVol.skills}</div>
                <div><strong>Verification ID:</strong> {activeVol.id_proof}</div>
              </div>

              <div className="pt-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-[11px] font-semibold border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Authorized Alandi Devasthan Sevekari</span>
                </div>
              </div>
            </div>
          )}

          {/* Volunteer Guidelines */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-orange-600" />
              <span>Standard Field Guidelines</span>
            </h4>
            <ul className="space-y-2 text-stone-600 list-disc pl-4">
              <li>Always wear the official ID badge and saffron scarf during your shift.</li>
              <li>Prioritize elderly Varkaris, women with infants, and Divyang pilgrims.</li>
              <li>Direct lost children immediately to Indrayani Ghat Booth 3 or Mandir PA booth.</li>
              <li>In case of medical emergencies, guide EMT staff or call 108 immediately.</li>
              <li>Ensure queue barricades remain orderly without causing panic.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Register Volunteer Modal */}
      {showRegForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Register as Yatra Volunteer (सेवेकरी नोंदणी)</h3>
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vitthal Sopan Gite"
                  value={regData.full_name}
                  onChange={(e) => setRegData({ ...regData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit number"
                    value={regData.mobile}
                    onChange={(e) => setRegData({ ...regData, mobile: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Blood Group</label>
                  <select
                    value={regData.blood_group}
                    onChange={(e) => setRegData({ ...regData, blood_group: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="volunteer@example.com"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Skills & Services</label>
                <input
                  type="text"
                  value={regData.skills}
                  onChange={(e) => setRegData({ ...regData, skills: e.target.value })}
                  placeholder="Crowd Management, Medical, Food Seva..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegForm(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Join as Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
