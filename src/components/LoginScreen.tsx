import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { api } from '../services/api';
import {
  Shield,
  UserCheck,
  Building,
  Lock,
  ArrowRight,
  AlertCircle,
  Users,
  Compass,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onOpenRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onOpenRegister }) => {
  const [selectedRole, setSelectedRole] = useState<'pilgrim' | 'admin' | 'volunteer'>('pilgrim');
  const [username, setUsername] = useState('tukaram_varkari');
  const [password, setPassword] = useState('pilgrim123');
  const [error, setError] = useState<string | null>(null);

  // When user clicks a role card, prefill default demo credentials
  const handleSelectRole = (role: 'pilgrim' | 'admin' | 'volunteer') => {
    setSelectedRole(role);
    setError(null);
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (role === 'volunteer') {
      setUsername('volunteer_ramesh');
      setPassword('volunteer123');
    } else {
      setUsername('tukaram_varkari');
      setPassword('pilgrim123');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check credentials against initial users
    const found = INITIAL_USERS.find(
      (u) =>
        (u.username.toLowerCase() === username.trim().toLowerCase() ||
          u.email.toLowerCase() === username.trim().toLowerCase()) &&
        u.role === selectedRole
    );

    if (found) {
      api.login(found.username, found.role).catch(() => {});
      onLogin(found);
    } else {
      // If user typed custom username, allow login as the selected role
      if (username.trim()) {
        const customUser: User = {
          id: Date.now(),
          username: username.trim(),
          email: `${username.trim()}@alandiyatra.org`,
          role: selectedRole,
          is_active: true,
          name: username.trim(),
        };
        api.login(customUser.username, customUser.role).catch(() => {});
        onLogin(customUser);
      } else {
        setError('Please enter a valid username');
      }
    }
  };

  const handleInstantRoleLogin = (role: 'pilgrim' | 'admin' | 'volunteer') => {
    const defaultUser = INITIAL_USERS.find((u) => u.role === role);
    if (defaultUser) {
      onLogin(defaultUser);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3 pt-2">
        {/* Sacred Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold tracking-wider border border-orange-300 shadow-xs">
          <span>🚩</span>
          <span>॥ ज्ञानोबा माऊली तुकाराम ॥ श्री क्षेत्र आळंदी देवची</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl font-black shadow-md border border-orange-500">
            ॐ
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Alandi Yatra <span className="text-orange-600">Management System</span>
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto leading-relaxed">
          Please select your role to log in. The application features and navigation will be tailored specifically to your authorized access.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-8 space-y-6">
          {/* Step 1: Select User Role */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                1. Select Login Role (आपली भूमिका निवडा)
              </label>
              <span className="text-[11px] text-orange-700 font-semibold">Strict Role-Based Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Pilgrim Card */}
              <button
                type="button"
                onClick={() => handleSelectRole('pilgrim')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  selectedRole === 'pilgrim'
                    ? 'border-orange-500 bg-orange-50/60 shadow-xs ring-2 ring-orange-500/20'
                    : 'border-stone-200 hover:border-orange-200 hover:bg-stone-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-bold text-stone-900 text-xs">Pilgrim</div>
                <div className="text-[10px] text-orange-700 font-semibold">वारकरी</div>
                <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">
                  Pass, Dharamshala, Food & Water Maps, SOS
                </p>
                {selectedRole === 'pilgrim' && (
                  <CheckCircle2 className="w-4 h-4 text-orange-600 absolute top-3 right-3" />
                )}
              </button>

              {/* Administrator Card */}
              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  selectedRole === 'admin'
                    ? 'border-purple-600 bg-purple-50/60 shadow-xs ring-2 ring-purple-600/20'
                    : 'border-stone-200 hover:border-purple-200 hover:bg-stone-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-2">
                  <Building className="w-4 h-4" />
                </div>
                <div className="font-bold text-stone-900 text-xs">Admin</div>
                <div className="text-[10px] text-purple-700 font-semibold">प्रशासन कक्ष</div>
                <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">
                  CRUD, Bed Approvals, Duty Scheduling, CSV
                </p>
                {selectedRole === 'admin' && (
                  <CheckCircle2 className="w-4 h-4 text-purple-600 absolute top-3 right-3" />
                )}
              </button>

              {/* Volunteer Card */}
              <button
                type="button"
                onClick={() => handleSelectRole('volunteer')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  selectedRole === 'volunteer'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-600/20'
                    : 'border-stone-200 hover:border-blue-200 hover:bg-stone-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-2">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-stone-900 text-xs">Volunteer</div>
                <div className="text-[10px] text-blue-700 font-semibold">सेवेकरी</div>
                <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">
                  Assigned Shifts, Sector Alerts, Safety
                </p>
                {selectedRole === 'volunteer' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 absolute top-3 right-3" />
                )}
              </button>
            </div>
          </div>

          {/* Quick 1-Click Role Login Bar */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-stone-500 font-medium">Quick Demo Access:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleInstantRoleLogin('pilgrim')}
                className="px-2.5 py-1 bg-orange-100 text-orange-800 hover:bg-orange-200 rounded-lg font-bold text-[11px] transition"
              >
                As Pilgrim &rarr;
              </button>
              <button
                type="button"
                onClick={() => handleInstantRoleLogin('admin')}
                className="px-2.5 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-lg font-bold text-[11px] transition"
              >
                As Admin &rarr;
              </button>
              <button
                type="button"
                onClick={() => handleInstantRoleLogin('volunteer')}
                className="px-2.5 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg font-bold text-[11px] transition"
              >
                As Volunteer &rarr;
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Username / Mobile Number (वापरकर्ता नाव)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or tukaram_varkari"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Password (पासवर्ड)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 ${
                selectedRole === 'admin'
                  ? 'bg-purple-700 hover:bg-purple-800'
                  : selectedRole === 'volunteer'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              <span>Log In as {selectedRole.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* New Pilgrim Quick Link */}
          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-stone-500">Not registered for Alandi Yatra yet?</span>
            <button
              type="button"
              onClick={onOpenRegister}
              className="text-orange-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>+ Register New Pilgrim (नवीन वारकरी नोंदणी)</span>
            </button>
          </div>
        </div>

        {/* Security & Disclaimer Footer */}
        <div className="mt-4 text-center text-xs text-stone-600 font-medium space-y-1">
          <div>Shree Sant Dnyaneshwar Maharaj Sanjeevan Samadhi Mandir, Alandi Devachi</div>
          <div>24x7 Control Room: 020-27185200 | Ambulance: 108 | Police: 112</div>
        </div>
      </div>
    </div>
  );
};
