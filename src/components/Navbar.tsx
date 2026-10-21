import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  User as UserIcon,
  LogOut,
  MapPin,
  Home,
  UserCheck,
  Building,
  Bed,
  Megaphone,
  Siren,
  Menu,
  X,
  CreditCard,
  Users,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSOS: () => void;
  onOpenRegister?: () => void;
  onViewMyPass?: () => void;
  unresolvedSOSCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  activeTab,
  onSelectTab,
  onOpenSOS,
  onOpenRegister,
  onViewMyPass,
  unresolvedSOSCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Generate Nav links strictly based on the logged-in role
  const getNavLinks = () => {
    if (!currentUser) {
      return [{ id: 'home', label: 'Home / मुख्यपृष्ठ', icon: Home }];
    }

    if (currentUser.role === 'admin') {
      return [
        { id: 'admin_overview', label: 'Admin Dashboard', icon: Building },
        { id: 'admin_pilgrims', label: 'Pilgrim Directory', icon: Users },
        { id: 'admin_accommodation', label: 'Dharamshala Approvals', icon: Bed },
        { id: 'admin_volunteers', label: 'Volunteer Rosters', icon: UserCheck },
        { id: 'admin_facilities', label: 'Food & Water Points', icon: Building },
        { id: 'map', label: 'Facilities Map', icon: MapPin },
        { id: 'admin_emergencies', label: `Emergency SOS (${unresolvedSOSCount})`, icon: Siren },
      ];
    }

    if (currentUser.role === 'volunteer') {
      return [
        { id: 'volunteer_shifts', label: 'My Duty Shifts', icon: Calendar },
        { id: 'volunteer_alerts', label: 'Sector Alerts', icon: AlertTriangle },
        { id: 'map', label: 'Facilities Map', icon: MapPin },
        { id: 'announcements', label: 'Safety Guidelines & Notices', icon: Megaphone },
      ];
    }

    // Default: Pilgrim
    return [
      { id: 'home', label: 'Home / मुख्यपृष्ठ', icon: Home },
      { id: 'my_pass', label: 'My Yatra Pass / ओळखपत्र', icon: CreditCard },
      { id: 'accommodation', label: 'Dharamshala / निवास', icon: Bed },
      { id: 'map', label: 'Facilities Map / नकाशा', icon: MapPin },
      { id: 'announcements', label: 'Announcements / सूचना', icon: Megaphone },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-200 shadow-xs">
      {/* Top Spiritual Header */}
      <div className="bg-linear-to-r from-orange-700 via-amber-600 to-orange-700 text-white text-[11px] py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate font-semibold tracking-wider">
          <span className="text-amber-200">🚩</span>
          <span className="truncate">॥ जय जय राम कृष्ण हरी ॥ संत ज्ञानेश्वर महाराज पालखी सोहळा, आळंदी देवची</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-orange-100 text-[10px]">
          <span>Helpline: <strong>020-27185200</strong></span>
          <span>Ambulance: <strong>108</strong></span>
          <span>Police: <strong>112</strong></span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab(currentUser?.role === 'admin' ? 'admin_overview' : currentUser?.role === 'volunteer' ? 'volunteer_shifts' : 'home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition">
              ॐ
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                Alandi Yatra <span className="text-orange-600 font-extrabold">2026</span>
              </div>
              <div className="text-[10px] font-medium text-stone-500 uppercase tracking-widest">
                {currentUser?.role === 'admin'
                  ? 'Administration Desk'
                  : currentUser?.role === 'volunteer'
                  ? 'Volunteer Field Desk'
                  : 'Pilgrim Service Portal'}
              </div>
            </div>
          </div>

          {/* Role-Specific Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Emergency SOS Button */}
            <button
              onClick={onOpenSOS}
              className="relative px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition animate-pulse"
              title="Report Medical or Police Emergency"
            >
              <Siren className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">SOS Emergency</span>
              {unresolvedSOSCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-white absolute -top-1 -right-1" />
              )}
            </button>

            {/* If Pilgrim: Quick Register Button */}
            {currentUser?.role === 'pilgrim' && onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold hidden sm:flex items-center gap-1.5 shadow-xs transition"
              >
                <span>+ Register Member</span>
              </button>
            )}

            {/* User Profile Badge & Logout */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 px-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      currentUser.role === 'admin'
                        ? 'bg-purple-700'
                        : currentUser.role === 'volunteer'
                        ? 'bg-blue-600'
                        : 'bg-orange-600'
                    }`}
                  >
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left text-[11px] leading-tight">
                    <div className="font-bold text-stone-900 truncate max-w-[100px]">
                      {currentUser.name || currentUser.username}
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider ${
                        currentUser.role === 'admin'
                          ? 'text-purple-700'
                          : currentUser.role === 'volunteer'
                          ? 'text-blue-700'
                          : 'text-orange-700'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 hover:bg-white text-stone-600 hover:text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  title="Log Out / Switch Role"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Logout</span>
                </button>
              </div>
            ) : null}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                  isActive
                    ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-4 h-4 text-orange-600" />
                <span>{link.label}</span>
              </button>
            );
          })}
          {currentUser && (
            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2 bg-stone-100 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of {currentUser.role.toUpperCase()} Account</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
