import React, { useState, useMemo } from 'react';
import {
  Pilgrim,
  AccommodationCenter,
  AccommodationRequest,
  FoodCenter,
  WaterPoint,
  MedicalCenter,
  Volunteer,
  VolunteerAssignment,
  Announcement,
  EmergencyRequest,
} from '../types';
import { exportToCSV } from '../utils/csvExport';
import { api } from '../services/api';
import {
  Users,
  Bed,
  Utensils,
  Droplets,
  HeartPulse,
  UserCheck,
  BellRing,
  Siren,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  Eye,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  RefreshCw,
  Building,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  pilgrims: Pilgrim[];
  setPilgrims: React.Dispatch<React.SetStateAction<Pilgrim[]>>;
  accommodations: AccommodationCenter[];
  setAccommodations: React.Dispatch<React.SetStateAction<AccommodationCenter[]>>;
  accommodationRequests: AccommodationRequest[];
  setAccommodationRequests: React.Dispatch<React.SetStateAction<AccommodationRequest[]>>;
  foodCenters: FoodCenter[];
  setFoodCenters: React.Dispatch<React.SetStateAction<FoodCenter[]>>;
  waterPoints: WaterPoint[];
  setWaterPoints: React.Dispatch<React.SetStateAction<WaterPoint[]>>;
  medicalCenters: MedicalCenter[];
  setMedicalCenters: React.Dispatch<React.SetStateAction<MedicalCenter[]>>;
  volunteers: Volunteer[];
  setVolunteers: React.Dispatch<React.SetStateAction<Volunteer[]>>;
  assignments: VolunteerAssignment[];
  setAssignments: React.Dispatch<React.SetStateAction<VolunteerAssignment[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  emergencies: EmergencyRequest[];
  setEmergencies: React.Dispatch<React.SetStateAction<EmergencyRequest[]>>;
  onViewPass: (pilgrim: Pilgrim) => void;
  onOpenNewPilgrimModal: () => void;
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  pilgrims,
  setPilgrims,
  accommodations,
  setAccommodations,
  accommodationRequests,
  setAccommodationRequests,
  foodCenters,
  setFoodCenters,
  waterPoints,
  setWaterPoints,
  medicalCenters,
  setMedicalCenters,
  volunteers,
  setVolunteers,
  assignments,
  setAssignments,
  announcements,
  setAnnouncements,
  emergencies,
  setEmergencies,
  onViewPass,
  onOpenNewPilgrimModal,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'pilgrims' | 'accommodation' | 'facilities' | 'volunteers' | 'announcements' | 'emergencies' | 'reports'
  >('overview');

  React.useEffect(() => {
    if (initialTab) {
      const cleanTab = initialTab.replace('admin_', '') as any;
      if (['overview', 'pilgrims', 'accommodation', 'facilities', 'volunteers', 'announcements', 'emergencies', 'reports'].includes(cleanTab)) {
        setActiveTab(cleanTab);
      }
    }
  }, [initialTab]);

  // Pilgrims tab state
  const [pilgrimSearch, setPilgrimSearch] = useState('');
  const [pilgrimFilterStatus, setPilgrimFilterStatus] = useState<string>('all');
  const [pilgrimSortBy, setPilgrimSortBy] = useState<'id' | 'name' | 'age' | 'date'>('date');
  const [pilgrimPage, setPilgrimPage] = useState(1);
  const itemsPerPage = 8;

  // New Announcement Form State
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: 'General' as Announcement['category'],
    priority: 'medium' as Announcement['priority'],
  });
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);

  // New Duty Assignment Form State
  const [newAssignment, setNewAssignment] = useState({
    volunteer_id: volunteers[0]?.id || 1,
    duty_role: '',
    location_name: '',
    shift_start: '08:00 AM',
    shift_end: '04:00 PM',
    shift_date: '2026-06-25',
  });
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Edit Pilgrim modal state
  const [editingPilgrim, setEditingPilgrim] = useState<Pilgrim | null>(null);

  // Computed totals
  const totalAccompanying = useMemo(
    () => pilgrims.reduce((acc, p) => acc + (p.accompanying_count || 0), 0),
    [pilgrims]
  );
  const totalPilgrimsAll = pilgrims.length + totalAccompanying;
  const totalCapacity = useMemo(() => accommodations.reduce((a, c) => a + c.total_capacity, 0), [accommodations]);
  const availableBeds = useMemo(() => accommodations.reduce((a, c) => a + c.available_capacity, 0), [accommodations]);
  const activeEmergencies = useMemo(() => emergencies.filter((e) => e.status !== 'resolved').length, [emergencies]);
  const totalMealsDaily = useMemo(() => foodCenters.reduce((a, f) => a + f.daily_capacity, 0), [foodCenters]);

  // Filtered & Sorted Pilgrims
  const filteredPilgrims = useMemo(() => {
    return pilgrims
      .filter((p) => {
        const matchesSearch =
          p.full_name.toLowerCase().includes(pilgrimSearch.toLowerCase()) ||
          p.registration_number.toLowerCase().includes(pilgrimSearch.toLowerCase()) ||
          p.mobile.includes(pilgrimSearch) ||
          p.city.toLowerCase().includes(pilgrimSearch.toLowerCase());
        const matchesStatus = pilgrimFilterStatus === 'all' || p.status === pilgrimFilterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (pilgrimSortBy === 'name') return a.full_name.localeCompare(b.full_name);
        if (pilgrimSortBy === 'age') return b.age - a.age;
        if (pilgrimSortBy === 'id') return b.id - a.id;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [pilgrims, pilgrimSearch, pilgrimFilterStatus, pilgrimSortBy]);

  const paginatedPilgrims = useMemo(() => {
    const start = (pilgrimPage - 1) * itemsPerPage;
    return filteredPilgrims.slice(start, start + itemsPerPage);
  }, [filteredPilgrims, pilgrimPage]);

  const totalPages = Math.ceil(filteredPilgrims.length / itemsPerPage) || 1;

  // Handlers for Accommodation Approval
  const handleApproveRequest = (req: AccommodationRequest) => {
    const center = accommodations.find((c) => c.id === req.center_id);
    if (!center) return;

    if (center.available_capacity < req.requested_beds) {
      alert(`Cannot approve: Center only has ${center.available_capacity} beds left!`);
      return;
    }

    // Decrement available capacity
    setAccommodations((prev) =>
      prev.map((c) =>
        c.id === req.center_id ? { ...c, available_capacity: c.available_capacity - req.requested_beds } : c
      )
    );

    // Update request status
    setAccommodationRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'approved', admin_remarks: 'Approved by Accommodation Admin' } : r))
    );

    api.updateAccommodationRequest(req.id, 'approved', 'Approved by Accommodation Admin').catch(() => {});
  };

  const handleRejectRequest = (req: AccommodationRequest) => {
    const reason = prompt('Enter reason for rejection (optional):', 'Capacity constraints or timing mismatch') || 'Rejected';
    setAccommodationRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'rejected', admin_remarks: reason } : r))
    );
    api.updateAccommodationRequest(req.id, 'rejected', reason).catch(() => {});
  };

  // Handler for Emergency Status Update
  const handleUpdateEmergencyStatus = (id: number, newStatus: EmergencyRequest['status']) => {
    setEmergencies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    api.updateEmergency(id, newStatus).catch(() => {});
  };

  // Handler for deleting pilgrim
  const handleDeletePilgrim = (id: number) => {
    if (confirm('Are you sure you want to delete this pilgrim record? This cannot be undone.')) {
      setPilgrims((prev) => prev.filter((p) => p.id !== id));
      api.deletePilgrim(id).catch(() => {});
    }
  };

  // Handler for adding announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;

    const item: Announcement = {
      id: Date.now(),
      title: newAnnouncement.title.trim(),
      content: newAnnouncement.content.trim(),
      category: newAnnouncement.category,
      priority: newAnnouncement.priority,
      published_at: new Date().toISOString(),
      is_active: true,
    };

    setAnnouncements([item, ...announcements]);
    api.createAnnouncement(item).catch(() => {});
    setNewAnnouncement({ title: '', content: '', category: 'General', priority: 'medium' });
    setShowAnnounceModal(false);
  };

  // Handler for creating assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const volunteer = volunteers.find((v) => v.id === Number(newAssignment.volunteer_id));
    if (!volunteer || !newAssignment.duty_role || !newAssignment.location_name) return;

    const assignItem: VolunteerAssignment = {
      id: Date.now(),
      volunteer_id: volunteer.id,
      duty_role: newAssignment.duty_role,
      location_name: newAssignment.location_name,
      shift_start: newAssignment.shift_start,
      shift_end: newAssignment.shift_end,
      shift_date: newAssignment.shift_date,
      status: 'assigned',
      volunteer_name: volunteer.full_name,
      volunteer_phone: volunteer.mobile,
    };

    setAssignments([assignItem, ...assignments]);
    api.createAssignment(assignItem).catch(() => {});
    setShowAssignModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700">
            <Building className="w-4 h-4" />
            <span>Alandi Municipal Council & Devasthan Trust Control Room</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Yatra Central Administration Dashboard (प्रशासन नियंत्रण कक्ष)
          </h2>
          <p className="text-xs text-stone-500">
            Real-time pilgrim registration database, Dharamshala allocations, volunteer deployment, and emergency triage.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewPilgrimModal}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register Pilgrim</span>
          </button>
          <button
            onClick={() => exportToCSV(pilgrims, 'alandi_pilgrims_master_list')}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            title="Download CSV of all pilgrims"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Registered Varkaris</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">{totalPilgrimsAll.toLocaleString()}</div>
          <div className="text-[11px] text-stone-500 mt-1">
            {pilgrims.length} leads + {totalAccompanying} accompanying
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Shelter Capacity</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900">{availableBeds} / {totalCapacity}</div>
          <div className="text-[11px] text-purple-700 mt-1 font-medium">
            {Math.round((availableBeds / totalCapacity) * 100)}% beds remaining
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Mahaprasad Meals</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">{totalMealsDaily.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">Daily capacity across 4 centers</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Active Volunteers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">{volunteers.length}</div>
          <div className="text-[11px] text-blue-700 mt-1 font-medium">
            {assignments.length} deployed on active shifts
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Emergency SOS</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center animate-pulse">
              <Siren className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{activeEmergencies} Active</div>
          <div className="text-[11px] text-rose-700 mt-1 font-medium">
            {emergencies.length} total logged incidents
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-amber-200 p-1 flex flex-wrap gap-1 shadow-xs">
        {[
          { id: 'overview', label: 'Overview', icon: Building },
          { id: 'pilgrims', label: `Pilgrims (${pilgrims.length})`, icon: Users },
          { id: 'accommodation', label: `Accommodation Requests (${accommodationRequests.filter(r => r.status === 'pending').length})`, icon: Bed },
          { id: 'facilities', label: 'Facilities Management', icon: Utensils },
          { id: 'volunteers', label: `Volunteers (${volunteers.length})`, icon: UserCheck },
          { id: 'announcements', label: `Announcements (${announcements.length})`, icon: BellRing },
          { id: 'emergencies', label: `Emergency SOS (${activeEmergencies})`, icon: Siren },
          { id: 'reports', label: 'Reports & CSV Export', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Registrations */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span>Recent Pilgrim Registrations</span>
              </h3>
              <button
                onClick={() => setActiveTab('pilgrims')}
                className="text-xs text-orange-600 hover:underline font-semibold"
              >
                View All ({pilgrims.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-semibold bg-stone-50/50">
                    <th className="py-2.5 px-3">Reg ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">City</th>
                    <th className="py-2.5 px-3">Mobile</th>
                    <th className="py-2.5 px-3">Group</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {pilgrims.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/30 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-orange-700">{p.registration_number}</td>
                      <td className="py-2.5 px-3 font-semibold text-stone-900">{p.full_name}</td>
                      <td className="py-2.5 px-3 text-stone-600">{p.city}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-600">{p.mobile}</td>
                      <td className="py-2.5 px-3 text-stone-600">+{p.accompanying_count}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onViewPass(p)}
                          className="px-2 py-1 bg-stone-100 hover:bg-orange-100 text-orange-700 rounded text-[11px] font-medium"
                        >
                          View Pass
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical Alerts & Quick Tasks */}
          <div className="space-y-4">
            {/* Urgent Emergencies */}
            <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-rose-700 font-bold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1.5">
                  <Siren className="w-4 h-4 text-rose-600" />
                  <span>Active SOS Alerts</span>
                </span>
                <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px]">
                  {activeEmergencies} Unresolved
                </span>
              </div>
              <div className="space-y-2">
                {emergencies
                  .filter((e) => e.status !== 'resolved')
                  .slice(0, 3)
                  .map((em) => (
                    <div key={em.id} className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-rose-900">
                        <span>{em.emergency_type}</span>
                        <span className="text-[10px] font-mono text-rose-700">{em.status}</span>
                      </div>
                      <div className="text-stone-700 font-medium">{em.location_details}</div>
                      <div className="text-stone-500 text-[11px]">{em.description}</div>
                      <div className="pt-1 flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateEmergencyStatus(em.id, 'resolved')}
                          className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded hover:bg-emerald-200"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pending Dharamshala Requests */}
            <div className="bg-white rounded-2xl border border-purple-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-purple-800 font-bold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-purple-600" />
                  <span>Pending Shelter Requests</span>
                </span>
                <button
                  onClick={() => setActiveTab('accommodation')}
                  className="text-xs text-purple-700 hover:underline"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-2">
                {accommodationRequests
                  .filter((r) => r.status === 'pending')
                  .slice(0, 2)
                  .map((req) => (
                    <div key={req.id} className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>{req.pilgrim_name}</span>
                        <span className="font-bold text-purple-800">{req.requested_beds} Beds</span>
                      </div>
                      <div className="text-[11px] text-stone-500">{req.center_name}</div>
                      <div className="pt-1 flex justify-end gap-2">
                        <button
                          onClick={() => handleRejectRequest(req)}
                          className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded hover:bg-rose-100"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveRequest(req)}
                          className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded hover:bg-emerald-200"
                        >
                          Approve Beds
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Pilgrims Directory */}
      {activeTab === 'pilgrims' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-stone-50/50">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, Reg ID, mobile, city..."
                value={pilgrimSearch}
                onChange={(e) => {
                  setPilgrimSearch(e.target.value);
                  setPilgrimPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-700">
                <Filter className="w-3.5 h-3.5 text-stone-500" />
                <select
                  value={pilgrimFilterStatus}
                  onChange={(e) => {
                    setPilgrimFilterStatus(e.target.value);
                    setPilgrimPage(1);
                  }}
                  className="bg-transparent focus:outline-hidden text-xs"
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="checked_in">Checked In</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                <select
                  value={pilgrimSortBy}
                  onChange={(e) => setPilgrimSortBy(e.target.value as any)}
                  className="bg-transparent focus:outline-hidden text-xs"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="age">Sort by Age</option>
                  <option value="id">Sort by ID</option>
                </select>
              </div>

              <button
                onClick={() => exportToCSV(filteredPilgrims, 'alandi_pilgrims_filtered')}
                className="px-3 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-stone-800 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Pilgrims Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-600 font-semibold bg-stone-100/60 uppercase text-[11px]">
                  <th className="py-3 px-4">Registration ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Age / Gender</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Native City & State</th>
                  <th className="py-3 px-4">Emergency Contact</th>
                  <th className="py-3 px-4">Accompanying</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedPilgrims.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-stone-500">
                      No pilgrim records found matching current query.
                    </td>
                  </tr>
                ) : (
                  paginatedPilgrims.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-orange-700">{p.registration_number}</td>
                      <td className="py-3 px-4 font-bold text-stone-900">{p.full_name}</td>
                      <td className="py-3 px-4 text-stone-700">{p.age} Yrs / {p.gender}</td>
                      <td className="py-3 px-4 font-mono text-stone-800">{p.mobile}</td>
                      <td className="py-3 px-4 text-stone-600">{p.city}, {p.state}</td>
                      <td className="py-3 px-4 text-stone-600">
                        <div>{p.emergency_contact_name}</div>
                        <div className="text-[10px] font-mono text-stone-500">{p.emergency_contact_phone}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-orange-800">+{p.accompanying_count}</td>
                      <td className="py-3 px-4">
                        <select
                          value={p.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as Pilgrim['status'];
                            setPilgrims((prev) =>
                              prev.map((item) => (item.id === p.id ? { ...item, status: newStatus } : item))
                            );
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border focus:outline-hidden ${
                            p.status === 'checked_in'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : p.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="approved">Approved</option>
                          <option value="checked_in">Checked In</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewPass(p)}
                            title="Print / View Official Yatra Pass"
                            className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPilgrim(p)}
                            title="Edit details"
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePilgrim(p.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 bg-stone-50/50">
            <div>
              Showing {filteredPilgrims.length > 0 ? (pilgrimPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(pilgrimPage * itemsPerPage, filteredPilgrims.length)} of {filteredPilgrims.length} pilgrims
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={pilgrimPage === 1}
                onClick={() => setPilgrimPage((p) => p - 1)}
                className="px-2.5 py-1 border border-stone-300 rounded bg-white disabled:opacity-40 hover:bg-stone-50"
              >
                Previous
              </button>
              <span className="font-semibold text-stone-700">
                Page {pilgrimPage} of {totalPages}
              </span>
              <button
                disabled={pilgrimPage >= totalPages}
                onClick={() => setPilgrimPage((p) => p + 1)}
                className="px-2.5 py-1 border border-stone-300 rounded bg-white disabled:opacity-40 hover:bg-stone-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Accommodation Management */}
      {activeTab === 'accommodation' && (
        <div className="space-y-6">
          {/* Centers List & Real-time Occupancy */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {accommodations.map((center) => {
              const occupancy = Math.round(
                ((center.total_capacity - center.available_capacity) / center.total_capacity) * 100
              );
              return (
                <div key={center.id} className="bg-white rounded-2xl border border-purple-200 p-4 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-stone-900 text-sm">{center.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        center.available_capacity > 50
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {center.available_capacity} Free
                    </span>
                  </div>

                  <div className="text-xs text-stone-500">{center.location}</div>

                  {/* Capacity Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="text-stone-600">Occupancy: {occupancy}%</span>
                      <span className="text-purple-900 font-bold">
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

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-600 space-y-0.5">
                    <div>
                      <strong>Contact:</strong> {center.contact_person}
                    </div>
                    <div>
                      <strong>Phone:</strong> {center.contact_phone}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Accommodation Requests Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Pilgrim Shelter Booking Requests</h3>
                <p className="text-xs text-stone-500">
                  Review and approve shelter requests. System prevents exceeding shelter capacity.
                </p>
              </div>
              <button
                onClick={() => exportToCSV(accommodationRequests, 'alandi_accommodation_requests')}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Requests</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-600 font-semibold bg-stone-50 uppercase text-[10px]">
                    <th className="py-3 px-4">Pilgrim Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Shelter Center</th>
                    <th className="py-3 px-4">Beds Req.</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Admin Remarks</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {accommodationRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-purple-50/20">
                      <td className="py-3 px-4 font-bold text-stone-900">{req.pilgrim_name}</td>
                      <td className="py-3 px-4 font-mono text-stone-600">{req.pilgrim_mobile}</td>
                      <td className="py-3 px-4 font-medium text-stone-800">{req.center_name}</td>
                      <td className="py-3 px-4 font-bold text-purple-900">{req.requested_beds} Beds</td>
                      <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                        {req.check_in_date} to {req.check_out_date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px] max-w-xs truncate">
                        {req.admin_remarks || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleRejectRequest(req)}
                              className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApproveRequest(req)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Facilities Management */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          {/* Annachhatra Food Centers */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <span>Annachhatra Food Distribution Centers (अन्नछत्र व्यवस्था)</span>
                </h3>
                <p className="text-xs text-stone-500">Continuous Mahaprasad distribution points across Alandi</p>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {totalMealsDaily.toLocaleString()} Meals/Day
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foodCenters.map((food) => (
                <div key={food.id} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-stone-900 text-sm">{food.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {food.is_active ? 'Active' : 'Closed'}
                    </span>
                  </div>
                  <div className="text-stone-600">
                    <strong>Location:</strong> {food.location}
                  </div>
                  <div className="text-stone-600">
                    <strong>Timings:</strong> {food.service_timings}
                  </div>
                  <div className="text-stone-600">
                    <strong>Meal Menu:</strong> {food.meal_type}
                  </div>
                  <div className="text-emerald-800 font-bold">
                    Capacity: {food.daily_capacity.toLocaleString()} Meals/Day
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Water Points & Medical Centers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Water Kiosks */}
            <div className="bg-white rounded-2xl border border-sky-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>RO Drinking Water Points</span>
              </h3>
              <div className="space-y-2.5">
                {waterPoints.map((w) => (
                  <div key={w.id} className="p-3 rounded-xl border border-sky-100 bg-sky-50/20 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{w.name}</span>
                      <span className="text-sky-700">{w.timing}</span>
                    </div>
                    <div className="text-stone-600">{w.location}</div>
                    <div className="text-sky-800 font-medium">{w.water_type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Centers */}
            <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>Medical Camps & Hospitals</span>
              </h3>
              <div className="space-y-2.5">
                {medicalCenters.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl border border-rose-100 bg-rose-50/20 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{m.name}</span>
                      <span className="text-rose-700 font-mono text-[11px]">{m.contact_phone}</span>
                    </div>
                    <div className="text-stone-600">{m.location} ({m.facility_type})</div>
                    <div className="text-stone-700">Doctor: {m.doctor_in_charge} | Beds: {m.bed_count}</div>
                    <div className="text-rose-800 text-[11px]">{m.emergency_services}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: Volunteers Management */}
      {activeTab === 'volunteers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Volunteer Duty Roster & Locations</h3>
                <p className="text-xs text-stone-500">
                  Assign volunteers to Darshan queue, Ghat safety, buggy transport, and Annachhatra
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Duty Shift</span>
                </button>
                <button
                  onClick={() => exportToCSV(assignments, 'alandi_volunteer_assignments')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-600 font-semibold bg-stone-50 uppercase text-[10px]">
                    <th className="py-3 px-4">Volunteer Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Duty Role</th>
                    <th className="py-3 px-4">Allocated Location</th>
                    <th className="py-3 px-4">Shift Time</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {assignments.map((asgn) => (
                    <tr key={asgn.id} className="hover:bg-blue-50/20">
                      <td className="py-3 px-4 font-bold text-stone-900">{asgn.volunteer_name}</td>
                      <td className="py-3 px-4 font-mono text-stone-600">{asgn.volunteer_phone}</td>
                      <td className="py-3 px-4 font-semibold text-blue-900">{asgn.duty_role}</td>
                      <td className="py-3 px-4 text-stone-700">{asgn.location_name}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                        {asgn.shift_start} - {asgn.shift_end}
                      </td>
                      <td className="py-3 px-4 text-stone-600">{asgn.shift_date}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {asgn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Registered Volunteers Card Grid */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Volunteer Force Directory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {volunteers.map((vol) => (
                <div key={vol.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5 text-xs">
                  <div className="font-bold text-stone-900 text-sm">{vol.full_name}</div>
                  <div className="text-stone-600 font-mono">{vol.mobile}</div>
                  <div className="text-stone-500">{vol.email}</div>
                  <div className="text-[11px] text-stone-700">
                    <strong>Skills:</strong> {vol.skills}
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      Blood: {vol.blood_group}
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {vol.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 6: Announcements Publisher */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <BellRing className="w-4 h-4 text-orange-600" />
                <span>Yatra Announcements & Official Advisories</span>
              </h3>
              <p className="text-xs text-stone-500">
                Publish schedule updates, safety guidelines, and queue advisories seen by all pilgrims.
              </p>
            </div>
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  ann.priority === 'urgent'
                    ? 'border-red-300 bg-red-50/40'
                    : ann.priority === 'high'
                    ? 'border-orange-300 bg-orange-50/30'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ann.priority === 'urgent'
                          ? 'bg-red-600 text-white'
                          : ann.priority === 'high'
                          ? 'bg-orange-500 text-white'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {ann.category}
                    </span>
                    <span className="font-bold text-stone-900 text-sm">{ann.title}</span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Published: {new Date(ann.published_at).toLocaleString()}
                  </div>
                </div>
                <p className="text-stone-700 leading-relaxed">{ann.content}</p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => setAnnouncements(announcements.filter((a) => a.id !== ann.id))}
                    className="text-stone-400 hover:text-red-600 text-[11px] flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 7: Emergency SOS Board */}
      {activeTab === 'emergencies' && (
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Siren className="w-5 h-5 text-rose-600" />
                <span>Real-Time Emergency SOS Incidents</span>
              </h3>
              <p className="text-xs text-stone-500">Live triage board connected to quick dispatch and response teams</p>
            </div>
            <button
              onClick={() => exportToCSV(emergencies, 'alandi_emergency_sos_log')}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-rose-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Log</span>
            </button>
          </div>

          <div className="space-y-3">
            {emergencies.map((em) => (
              <div
                key={em.id}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  em.status === 'reported'
                    ? 'border-rose-400 bg-rose-50/50'
                    : em.status === 'dispatched'
                    ? 'border-amber-400 bg-amber-50/40'
                    : 'border-emerald-300 bg-emerald-50/20'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        em.status === 'reported'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : em.status === 'dispatched'
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {em.status}
                    </span>
                    <span className="font-black text-stone-900 text-sm">{em.emergency_type} Emergency</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {new Date(em.created_at).toLocaleTimeString()} ({new Date(em.created_at).toLocaleDateString()})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                  <div>
                    <strong>Reporter:</strong> {em.reporter_name} (
                    <a href={`tel:${em.contact_number}`} className="text-blue-700 font-mono font-bold hover:underline">
                      {em.contact_number}
                    </a>
                    )
                  </div>
                  <div>
                    <strong>Location:</strong> {em.location_details}
                  </div>
                </div>

                <div className="text-stone-600 bg-white/70 p-2.5 rounded-lg border border-stone-200">
                  <strong>Details:</strong> {em.description}
                </div>

                {em.admin_notes && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                    <strong>Triage Action:</strong> {em.admin_notes}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  {em.status === 'reported' && (
                    <button
                      onClick={() => handleUpdateEmergencyStatus(em.id, 'dispatched')}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition"
                    >
                      Dispatch Team
                    </button>
                  )}
                  {em.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateEmergencyStatus(em.id, 'resolved')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 8: Reports & Exports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Comprehensive Yatra Reports & CSV Exports</h3>
            <p className="text-xs text-stone-500">
              Download sanitized data exports for municipal audit, disaster management, and temple logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="font-bold text-stone-900 text-sm">Pilgrims Registration Report</div>
              <div className="text-xs text-stone-600">
                Total {pilgrims.length} master leads ({totalPilgrimsAll} including group members). Contains full names, mobile numbers, city, state, emergency contacts, and special needs.
              </div>
              <button
                onClick={() => exportToCSV(pilgrims, 'alandi_pilgrims_report_2026')}
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Pilgrims CSV</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3">
              <div className="font-bold text-stone-900 text-sm">Accommodation & Bed Allocation</div>
              <div className="text-xs text-stone-600">
                Detailed center-wise capacity, occupancy ratios, approved bed allocations, and pending requests across all Dharamshalas and temporary Rain Baseras.
              </div>
              <button
                onClick={() => exportToCSV(accommodationRequests, 'alandi_accommodation_report_2026')}
                className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Accommodations CSV</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div className="font-bold text-stone-900 text-sm">Volunteer Deployment Roster</div>
              <div className="text-xs text-stone-600">
                Volunteer contact lists, duty role allocations, sector locations (Ghats, Mandir Gates, Annachhatra, Buggy service), and shift timings.
              </div>
              <button
                onClick={() => exportToCSV(assignments, 'alandi_volunteers_duty_report_2026')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Volunteer Roster CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Announcement */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Create Public Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="e.g. Schedule Update for Palkhi Prasthan"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newAnnouncement.category}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Schedule">Schedule</option>
                    <option value="Safety">Safety</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Emergency">Emergency</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Priority</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Content</label>
                <textarea
                  rows={3}
                  required
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Detailed announcement content..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-600 text-white rounded-lg font-bold"
                >
                  Publish Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Duty Shift */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Assign Volunteer Duty</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Select Volunteer</label>
                <select
                  value={newAssignment.volunteer_id}
                  onChange={(e) => setNewAssignment({ ...newAssignment, volunteer_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.full_name} ({v.mobile})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Duty Role / Responsibility</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Darshan Queue Regulation"
                  value={newAssignment.duty_role}
                  onChange={(e) => setNewAssignment({ ...newAssignment, duty_role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Duty Location / Post</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indrayani Ghat Step 14"
                  value={newAssignment.location_name}
                  onChange={(e) => setNewAssignment({ ...newAssignment, location_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Shift Start</label>
                  <input
                    type="text"
                    value={newAssignment.shift_start}
                    onChange={(e) => setNewAssignment({ ...newAssignment, shift_start: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Shift End</label>
                  <input
                    type="text"
                    value={newAssignment.shift_end}
                    onChange={(e) => setNewAssignment({ ...newAssignment, shift_end: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Assign Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Pilgrim */}
      {editingPilgrim && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Edit Pilgrim Record</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingPilgrim.full_name}
                  onChange={(e) => setEditingPilgrim({ ...editingPilgrim, full_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={editingPilgrim.age}
                    onChange={(e) => setEditingPilgrim({ ...editingPilgrim, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Accompanying</label>
                  <input
                    type="number"
                    value={editingPilgrim.accompanying_count}
                    onChange={(e) =>
                      setEditingPilgrim({ ...editingPilgrim, accompanying_count: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={editingPilgrim.mobile}
                    onChange={(e) => setEditingPilgrim({ ...editingPilgrim, mobile: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingPilgrim.city}
                    onChange={(e) => setEditingPilgrim({ ...editingPilgrim, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={editingPilgrim.emergency_contact_phone}
                  onChange={(e) =>
                    setEditingPilgrim({ ...editingPilgrim, emergency_contact_phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditingPilgrim(null)}
                className="px-3 py-1.5 border rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPilgrims((prev) =>
                    prev.map((p) => (p.id === editingPilgrim.id ? editingPilgrim : p))
                  );
                  setEditingPilgrim(null);
                }}
                className="px-4 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
