import React, { useState } from 'react';
import { EmergencyRequest } from '../types';
import { X, AlertTriangle, Phone, ShieldAlert, CheckCircle2, Siren, MapPin } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEmergency: (req: EmergencyRequest) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onSubmitEmergency,
}) => {
  const [formData, setFormData] = useState({
    reporter_name: '',
    contact_number: '',
    location_details: '',
    emergency_type: 'Medical' as EmergencyRequest['emergency_type'],
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reporter_name.trim() || !formData.contact_number.trim() || !formData.location_details.trim()) {
      setError('Please fill all required fields (Name, Phone, and Specific Location).');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.contact_number.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const newReq: EmergencyRequest = {
      id: Date.now(),
      pilgrim_id: null,
      reporter_name: formData.reporter_name.trim(),
      contact_number: formData.contact_number.trim(),
      location_details: formData.location_details.trim(),
      emergency_type: formData.emergency_type,
      description: formData.description.trim() || 'Urgent assistance requested via portal.',
      status: 'reported',
      admin_notes: 'Alert broadcast to Alandi Central Control Room',
      created_at: new Date().toISOString(),
    };

    onSubmitEmergency(newReq);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError(null);
    setFormData({
      reporter_name: '',
      contact_number: '',
      location_details: '',
      emergency_type: 'Medical',
      description: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border-2 border-rose-500 shadow-2xl overflow-hidden my-6">
        {/* Urgent Header */}
        <div className="bg-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <Siren className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-rose-200 font-bold">
                Emergency Assistance (आपत्कालीन मदत)
              </div>
              <h3 className="text-lg font-black">Alandi Yatra Emergency SOS</h3>
            </div>
          </div>
          <button onClick={handleResetAndClose} className="text-white/80 hover:text-white p-1.5 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Disclaimer Banner */}
        <div className="bg-amber-100 border-b border-amber-300 p-3 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Important Notice:</strong> This digital dispatch tool assists temple volunteers and medical teams.
            <strong> For life-threatening emergencies, dial 108 (Ambulance) or 112 (Police) immediately.</strong>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-stone-900">Emergency Alert Dispatched!</h4>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              Your request has been routed to the Alandi Central Temple Control Room and nearest volunteer sector team. Keep your phone nearby.
            </p>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-700 font-mono">
              Reported Location: {formData.location_details}
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Quick Emergency Helplines */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href="tel:108"
                className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center hover:bg-rose-100 transition"
              >
                <div className="text-[10px] text-rose-700 font-semibold uppercase">Ambulance</div>
                <div className="text-sm font-black text-rose-900 font-mono">108</div>
              </a>
              <a
                href="tel:112"
                className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-center hover:bg-blue-100 transition"
              >
                <div className="text-[10px] text-blue-700 font-semibold uppercase">Police</div>
                <div className="text-sm font-black text-blue-900 font-mono">112</div>
              </a>
              <a
                href="tel:02027185108"
                className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center hover:bg-amber-100 transition"
              >
                <div className="text-[10px] text-amber-700 font-semibold uppercase">Rural Hospital</div>
                <div className="text-xs font-black text-amber-900 font-mono truncate">27185108</div>
              </a>
              <a
                href="tel:02027185200"
                className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-center hover:bg-purple-100 transition"
              >
                <div className="text-[10px] text-purple-700 font-semibold uppercase">Temple Trust</div>
                <div className="text-xs font-black text-purple-900 font-mono truncate">27185200</div>
              </a>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Emergency Category *</label>
              <select
                value={formData.emergency_type}
                onChange={(e) => setFormData({ ...formData, emergency_type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              >
                <option value="Medical">Medical Emergency (Dehydration / Heatstroke / Injury)</option>
                <option value="Missing Person">Missing Person / Lost Child (हरवलेली व्यक्ती)</option>
                <option value="Food/Water">Severe Drinking Water / Food Emergency</option>
                <option value="Crowd Stampede">Crowd Rush / Barricade Congestion Risk</option>
                <option value="Other">Other Urgent Assistance</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Name (आपले नाव) *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Shinde"
                  value={formData.reporter_name}
                  onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Contact Phone *</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Exact Location in Alandi (अचूक ठिकाण) *
              </label>
              <input
                type="text"
                placeholder="e.g. Near Indrayani Ghat Step 14, Opposite Siddhabetta Bridge"
                value={formData.location_details}
                onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
              <span className="text-[10px] text-stone-500">Mention landmark, gate number, or dindi number</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Description / Condition Details</label>
              <textarea
                rows={2}
                placeholder="Describe patient condition, clothes worn by missing person, or urgent assistance required..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Siren className="w-4 h-4" />
                <span>Transmit Emergency SOS</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
