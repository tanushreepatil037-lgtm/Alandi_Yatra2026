import React, { useState } from 'react';
import { Pilgrim } from '../types';
import { X, CheckCircle2, UserCheck, AlertCircle, HeartHandshake, Shield } from 'lucide-react';

interface PilgrimRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newPilgrim: Pilgrim) => void;
  existingCount: number;
}

export const PilgrimRegistrationModal: React.FC<PilgrimRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  existingCount,
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    mobile: '',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '412105',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    accompanying_count: '0',
    special_needs: 'None',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.full_name.trim()) errs.full_name = 'Full name is required';
    if (!formData.age || Number(formData.age) < 1 || Number(formData.age) > 120) {
      errs.age = 'Please enter a valid age (1 - 120)';
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.mobile.trim())) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!formData.address.trim()) errs.address = 'Residential address is required';
    if (!formData.emergency_contact_name.trim()) {
      errs.emergency_contact_name = 'Emergency contact person name is required';
    }
    if (!phoneRegex.test(formData.emergency_contact_phone.trim())) {
      errs.emergency_contact_phone = 'Enter valid 10-digit emergency contact phone';
    }
    if (Number(formData.accompanying_count) < 0 || Number(formData.accompanying_count) > 50) {
      errs.accompanying_count = 'Accompanying count must be between 0 and 50';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const uniqueSuffix = 1000 + existingCount + Math.floor(Math.random() * 90);
      const regId = `AY-2026-${uniqueSuffix}`;

      const newPilgrim: Pilgrim = {
        id: Date.now(),
        user_id: null,
        registration_number: regId,
        full_name: formData.full_name.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        mobile: formData.mobile.trim(),
        address: formData.address.trim(),
        city: formData.city.trim() || 'Alandi',
        state: formData.state.trim() || 'Maharashtra',
        pincode: formData.pincode.trim() || '412105',
        emergency_contact_name: formData.emergency_contact_name.trim(),
        emergency_contact_phone: formData.emergency_contact_phone.trim(),
        accompanying_count: Number(formData.accompanying_count),
        special_needs: formData.special_needs,
        status: 'approved',
        created_at: new Date().toISOString(),
      };

      setIsSubmitting(false);
      onRegisterSuccess(newPilgrim);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-amber-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-orange-700 via-amber-600 to-orange-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl font-bold">
              🚩
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-orange-200 font-semibold">
                ॥ श्री संत ज्ञानेश्वर महाराज पालखी सोहळा ॥
              </div>
              <h3 className="text-lg font-bold">Pilgrim Digital Registration (वारी नोंदणी)</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <Shield className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <span>
              Registration generates your official <strong>Alandi Yatra Pass</strong> with verified ID, priority shelter access, free medical emergency tracking, and Dindi coordination.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name of Pilgrim (वारकरी पूर्ण नाव) *
              </label>
              <input
                type="text"
                placeholder="e.g. Dnyaneshwar Sopanrao Patil"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 ${
                  errors.full_name ? 'border-red-500 bg-red-50' : 'border-stone-300'
                }`}
              />
              {errors.full_name && <p className="text-red-600 text-xs mt-1">{errors.full_name}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Age (वय) *</label>
              <input
                type="number"
                placeholder="e.g. 52"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 ${
                  errors.age ? 'border-red-500 bg-red-50' : 'border-stone-300'
                }`}
              />
              {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Gender (लिंग) *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              >
                <option value="Male">Male (पुरुष)</option>
                <option value="Female">Female (स्त्री)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile Number (मोबाईल क्र.) *
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                className={`w-full px-3 py-2 rounded-lg border text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-orange-500 ${
                  errors.mobile ? 'border-red-500 bg-red-50' : 'border-stone-300'
                }`}
              />
              {errors.mobile && <p className="text-red-600 text-xs mt-1">{errors.mobile}</p>}
            </div>

            {/* Accompanying Count */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Accompanying Pilgrims (सोबतचे सदस्य)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.accompanying_count}
                onChange={(e) => setFormData({ ...formData, accompanying_count: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 ${
                  errors.accompanying_count ? 'border-red-500 bg-red-50' : 'border-stone-300'
                }`}
              />
              <span className="text-[11px] text-stone-500">Number of family/dindi members with you</span>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Permanent Address (मूळ पत्ता) *
              </label>
              <input
                type="text"
                placeholder="House / Street / Dindi Name"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-stone-300'
                }`}
              />
              {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City / District (गाव/जिल्हा)</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* State & Pincode */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State (राज्य)</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Emergency Contact Name */}
            <div>
              <label className="block text-xs font-semibold text-rose-800 mb-1">
                Emergency Contact Person (नातेवाईकाचे नाव) *
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Shinde (Son/Brother)"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 ${
                  errors.emergency_contact_name ? 'border-red-500 bg-red-50' : 'border-rose-200 bg-rose-50/30'
                }`}
              />
              {errors.emergency_contact_name && (
                <p className="text-red-600 text-xs mt-1">{errors.emergency_contact_name}</p>
              )}
            </div>

            {/* Emergency Contact Phone */}
            <div>
              <label className="block text-xs font-semibold text-rose-800 mb-1">
                Emergency Phone Number (आपत्कालीन फोन) *
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit emergency phone"
                value={formData.emergency_contact_phone}
                onChange={(e) =>
                  setFormData({ ...formData, emergency_contact_phone: e.target.value.replace(/\D/g, '') })
                }
                className={`w-full px-3 py-2 rounded-lg border text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-rose-500 ${
                  errors.emergency_contact_phone ? 'border-red-500 bg-red-50' : 'border-rose-200 bg-rose-50/30'
                }`}
              />
              {errors.emergency_contact_phone && (
                <p className="text-red-600 text-xs mt-1">{errors.emergency_contact_phone}</p>
              )}
            </div>

            {/* Special Needs */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Special Assistance / Medical Needs (विशेष सहाय्य)
              </label>
              <select
                value={formData.special_needs}
                onChange={(e) => setFormData({ ...formData, special_needs: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              >
                <option value="None">None (कोणतेही नाही)</option>
                <option value="Senior citizen assistance required">Senior citizen assistance (ज्येष्ठ नागरिक सहाय्य)</option>
                <option value="Wheelchair access requested">Wheelchair access needed (व्हीलचेअर आवश्यकता)</option>
                <option value="Diabetic / Daily Medical Support">Diabetic / Daily Medical Support (औषधोपचार)</option>
                <option value="Dindi Leader / Bhajan Mandali">Dindi Leader / Bhajan Troupe Coordination</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Complete Registration & Issue Yatra Pass</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
