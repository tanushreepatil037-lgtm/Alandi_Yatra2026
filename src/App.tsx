import React, { useState, useEffect } from 'react';
import {
  User,
  UserRole,
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
  YatraEvent,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_PILGRIMS,
  INITIAL_ACCOMMODATION_CENTERS,
  INITIAL_ACCOMMODATION_REQUESTS,
  INITIAL_FOOD_CENTERS,
  INITIAL_WATER_POINTS,
  INITIAL_MEDICAL_CENTERS,
  INITIAL_VOLUNTEERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EMERGENCY_REQUESTS,
  INITIAL_EVENTS,
  getStoredData,
  setStoredData,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { FacilitiesMap } from './components/FacilitiesMap';
import { AccommodationTab } from './components/AccommodationTab';
import { AnnouncementsTab } from './components/AnnouncementsTab';
import { VolunteerPortal } from './components/VolunteerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { PilgrimPassTab } from './components/PilgrimPassTab';
import { LoginScreen } from './components/LoginScreen';
import { Footer } from './components/Footer';
import { PilgrimRegistrationModal } from './components/PilgrimRegistrationModal';
import { PilgrimPassModal } from './components/PilgrimPassModal';
import { AccommodationRequestModal } from './components/AccommodationRequestModal';
import { EmergencyModal } from './components/EmergencyModal';
import { CheckCircle2, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { api } from './services/api';

export default function App() {
  // Authentication: Stored User (Null means unauthenticated -> Show Login)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getStoredData<User | null>('auth_user', null);
  });

  // Active Tab: Dependent on User Role
  const [activeTab, setActiveTab] = useState<string>('home');

  // Application Datasets with LocalStorage Persistence
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>(() =>
    getStoredData<Pilgrim[]>('pilgrims', INITIAL_PILGRIMS)
  );
  const [accommodations, setAccommodations] = useState<AccommodationCenter[]>(() =>
    getStoredData<AccommodationCenter[]>('accommodations', INITIAL_ACCOMMODATION_CENTERS)
  );
  const [accommodationRequests, setAccommodationRequests] = useState<AccommodationRequest[]>(() =>
    getStoredData<AccommodationRequest[]>('accommodation_requests', INITIAL_ACCOMMODATION_REQUESTS)
  );
  const [foodCenters, setFoodCenters] = useState<FoodCenter[]>(() =>
    getStoredData<FoodCenter[]>('food_centers', INITIAL_FOOD_CENTERS)
  );
  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>(() =>
    getStoredData<WaterPoint[]>('water_points', INITIAL_WATER_POINTS)
  );
  const [medicalCenters, setMedicalCenters] = useState<MedicalCenter[]>(() =>
    getStoredData<MedicalCenter[]>('medical_centers', INITIAL_MEDICAL_CENTERS)
  );
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() =>
    getStoredData<Volunteer[]>('volunteers', INITIAL_VOLUNTEERS)
  );
  const [assignments, setAssignments] = useState<VolunteerAssignment[]>(() =>
    getStoredData<VolunteerAssignment[]>('assignments', INITIAL_ASSIGNMENTS)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    getStoredData<Announcement[]>('announcements', INITIAL_ANNOUNCEMENTS)
  );
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(() =>
    getStoredData<EmergencyRequest[]>('emergencies', INITIAL_EMERGENCY_REQUESTS)
  );
  const [events] = useState<YatraEvent[]>(INITIAL_EVENTS);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedPassPilgrim, setSelectedPassPilgrim] = useState<Pilgrim | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => setStoredData('auth_user', currentUser), [currentUser]);
  useEffect(() => setStoredData('pilgrims', pilgrims), [pilgrims]);
  useEffect(() => setStoredData('accommodations', accommodations), [accommodations]);
  useEffect(() => setStoredData('accommodation_requests', accommodationRequests), [accommodationRequests]);
  useEffect(() => setStoredData('foodCenters', foodCenters), [foodCenters]);
  useEffect(() => setStoredData('waterPoints', waterPoints), [waterPoints]);
  useEffect(() => setStoredData('medicalCenters', medicalCenters), [medicalCenters]);
  useEffect(() => setStoredData('volunteers', volunteers), [volunteers]);
  useEffect(() => setStoredData('assignments', assignments), [assignments]);
  useEffect(() => setStoredData('announcements', announcements), [announcements]);
  useEffect(() => setStoredData('emergencies', emergencies), [emergencies]);

  // Initial sync from Node.js backend
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const [backendPilgrims, backendAcc, backendReqs, backendFac, backendVols, backendAssign, backendAnn, backendEmer] =
          await Promise.all([
            api.getPilgrims().catch(() => null),
            api.getAccommodations().catch(() => null),
            api.getAccommodationRequests().catch(() => null),
            api.getFacilities().catch(() => null),
            api.getVolunteers().catch(() => null),
            api.getAssignments().catch(() => null),
            api.getAnnouncements().catch(() => null),
            api.getEmergencies().catch(() => null),
          ]);

        if (backendPilgrims && Array.isArray(backendPilgrims) && backendPilgrims.length > 0) {
          setPilgrims(backendPilgrims);
        }
        if (backendAcc && Array.isArray(backendAcc) && backendAcc.length > 0) {
          setAccommodations(backendAcc);
        }
        if (backendReqs && Array.isArray(backendReqs) && backendReqs.length > 0) {
          setAccommodationRequests(backendReqs);
        }
        if (backendFac) {
          if (backendFac.foodCenters) setFoodCenters(backendFac.foodCenters);
          if (backendFac.waterPoints) setWaterPoints(backendFac.waterPoints);
          if (backendFac.medicalCenters) setMedicalCenters(backendFac.medicalCenters);
        }
        if (backendVols && Array.isArray(backendVols) && backendVols.length > 0) {
          setVolunteers(backendVols);
        }
        if (backendAssign && Array.isArray(backendAssign) && backendAssign.length > 0) {
          setAssignments(backendAssign);
        }
        if (backendAnn && Array.isArray(backendAnn) && backendAnn.length > 0) {
          setAnnouncements(backendAnn);
        }
        if (backendEmer && Array.isArray(backendEmer) && backendEmer.length > 0) {
          setEmergencies(backendEmer);
        }
      } catch (err) {
        console.warn('Backend sync fallback to client state');
      }
    };
    syncBackend();
  }, []);

  // Set default tab when user logs in based on role
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin_overview');
    } else if (user.role === 'volunteer') {
      setActiveTab('volunteer_shifts');
    } else {
      setActiveTab('home');
    }
    showToast(`Welcome ${user.name || user.username}! Logged in as ${user.role.toUpperCase()}`);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    showToast('You have logged out.');
  };

  // Find linked pilgrim record for the current user
  const currentPilgrim = currentUser
    ? pilgrims.find((p) => p.user_id === currentUser.id) || pilgrims[0]
    : null;

  // Find linked volunteer record for current volunteer user
  const currentVolunteer = currentUser
    ? volunteers.find((v) => v.user_id === currentUser.id) || volunteers[0]
    : null;

  // Handle Pilgrim Registration
  const handleRegisterSuccess = (newPilgrim: Pilgrim) => {
    // Sync with Node.js backend
    api.createPilgrim(newPilgrim).catch(() => {});

    // If not logged in, auto-login as this new pilgrim
    if (!currentUser) {
      const newUser: User = {
        id: Date.now(),
        username: newPilgrim.mobile,
        email: `${newPilgrim.mobile}@alandiyatra.org`,
        role: 'pilgrim',
        is_active: true,
        name: newPilgrim.full_name,
      };
      newPilgrim.user_id = newUser.id;
      setCurrentUser(newUser);
      setActiveTab('my_pass');
    }

    setPilgrims([newPilgrim, ...pilgrims]);
    setIsRegisterOpen(false);
    setSelectedPassPilgrim(newPilgrim);
    setIsPassModalOpen(true);
    showToast(`Registration completed! Official Pass issued: ${newPilgrim.registration_number}`);
  };

  // Handle Accommodation Request
  const handleAccommodationRequest = (req: AccommodationRequest) => {
    api.createAccommodationRequest(req).catch(() => {});
    setAccommodationRequests([req, ...accommodationRequests]);
    setIsBookingModalOpen(false);
    showToast('Dharamshala bed booking request submitted for admin review.');
  };

  // Handle Emergency Request
  const handleEmergencySOS = (req: EmergencyRequest) => {
    api.createEmergency(req).catch(() => {});
    setEmergencies([req, ...emergencies]);
    showToast('Emergency SOS alert dispatched to Alandi Devasthan Control Room.');
  };

  // Handle Volunteer Registration
  const handleRegisterVolunteer = (newVol: Volunteer) => {
    api.createVolunteer(newVol).catch(() => {});
    setVolunteers([newVol, ...volunteers]);
    showToast(`Welcome Sevekari ${newVol.full_name}! Registered successfully.`);
  };

  // Helper to open Pass Modal
  const handleViewPass = (p: Pilgrim) => {
    setSelectedPassPilgrim(p);
    setIsPassModalOpen(true);
  };

  // Reset to default dataset
  const handleResetData = () => {
    if (confirm('Reset all demo data back to default Alandi Yatra records?')) {
      setPilgrims(INITIAL_PILGRIMS);
      setAccommodations(INITIAL_ACCOMMODATION_CENTERS);
      setAccommodationRequests(INITIAL_ACCOMMODATION_REQUESTS);
      setFoodCenters(INITIAL_FOOD_CENTERS);
      setWaterPoints(INITIAL_WATER_POINTS);
      setMedicalCenters(INITIAL_MEDICAL_CENTERS);
      setVolunteers(INITIAL_VOLUNTEERS);
      setAssignments(INITIAL_ASSIGNMENTS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setEmergencies(INITIAL_EMERGENCY_REQUESTS);
      showToast('Database reset to default records.');
    }
  };

  // Summary counts
  const totalAccompanying = pilgrims.reduce((acc, p) => acc + (p.accompanying_count || 0), 0);
  const totalPilgrimsCount = pilgrims.length + totalAccompanying;
  const availableBeds = accommodations.reduce((a, c) => a + c.available_capacity, 0);
  const totalBeds = accommodations.reduce((a, c) => a + c.total_capacity, 0);
  const totalDailyMeals = foodCenters.reduce((a, f) => a + f.daily_capacity, 0);
  const activeEmergenciesCount = emergencies.filter((e) => e.status !== 'resolved').length;

  // 1. IF NOT LOGGED IN: Render Login & Role Decider Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-100 font-sans text-stone-900">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-[99999] bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-amber-500/50 text-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        <LoginScreen
          onLogin={handleLogin}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />

        <PilgrimRegistrationModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onRegisterSuccess={handleRegisterSuccess}
          existingCount={pilgrims.length}
        />
      </div>
    );
  }

  // 2. IF LOGGED IN: Render Only That Role's Interface
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[99999] bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-amber-500/50 text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Role-Governed Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onViewMyPass={() => {
          if (currentPilgrim) handleViewPass(currentPilgrim);
        }}
        unresolvedSOSCount={activeEmergenciesCount}
      />

      {/* Main Container - Renders ONLY authorized views */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* ============================================================== */}
        {/* PILGRIM ROLE VIEWS ONLY */}
        {/* ============================================================== */}
        {currentUser.role === 'pilgrim' && (
          <>
            {activeTab === 'home' && (
              <div className="space-y-8">
                <HomeHero
                  events={events}
                  announcements={announcements}
                  totalPilgrims={totalPilgrimsCount}
                  availableBeds={availableBeds}
                  totalBeds={totalBeds}
                  totalMeals={totalDailyMeals}
                  onOpenRegister={() => setIsRegisterOpen(true)}
                  onOpenSOS={() => setIsSOSOpen(true)}
                  onNavigateTab={setActiveTab}
                  onViewPass={handleViewPass}
                  samplePilgrim={currentPilgrim || pilgrims[0]}
                />

                <div className="pt-4">
                  <FacilitiesMap
                    accommodations={accommodations}
                    foodCenters={foodCenters}
                    waterPoints={waterPoints}
                    medicalCenters={medicalCenters}
                  />
                </div>
              </div>
            )}

            {activeTab === 'my_pass' && (
              <PilgrimPassTab
                currentPilgrim={currentPilgrim}
                onOpenRegister={() => setIsRegisterOpen(true)}
                onPrintPass={() => {
                  if (currentPilgrim) handleViewPass(currentPilgrim);
                }}
              />
            )}

            {activeTab === 'accommodation' && (
              <AccommodationTab
                accommodations={accommodations}
                requests={accommodationRequests}
                currentPilgrim={currentPilgrim}
                onRequestBooking={() => setIsBookingModalOpen(true)}
              />
            )}

            {activeTab === 'map' && (
              <FacilitiesMap
                accommodations={accommodations}
                foodCenters={foodCenters}
                waterPoints={waterPoints}
                medicalCenters={medicalCenters}
              />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsTab announcements={announcements} />
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* ADMIN ROLE VIEWS ONLY */}
        {/* ============================================================== */}
        {currentUser.role === 'admin' && (
          <>
            {activeTab.startsWith('admin_') && (
              <AdminDashboard
                pilgrims={pilgrims}
                setPilgrims={setPilgrims}
                accommodations={accommodations}
                setAccommodations={setAccommodations}
                accommodationRequests={accommodationRequests}
                setAccommodationRequests={setAccommodationRequests}
                foodCenters={foodCenters}
                setFoodCenters={setFoodCenters}
                waterPoints={waterPoints}
                setWaterPoints={setWaterPoints}
                medicalCenters={medicalCenters}
                setMedicalCenters={setMedicalCenters}
                volunteers={volunteers}
                setVolunteers={setVolunteers}
                assignments={assignments}
                setAssignments={setAssignments}
                announcements={announcements}
                setAnnouncements={setAnnouncements}
                emergencies={emergencies}
                setEmergencies={setEmergencies}
                onViewPass={handleViewPass}
                onOpenNewPilgrimModal={() => setIsRegisterOpen(true)}
                initialTab={activeTab}
              />
            )}

            {activeTab === 'map' && (
              <FacilitiesMap
                accommodations={accommodations}
                foodCenters={foodCenters}
                waterPoints={waterPoints}
                medicalCenters={medicalCenters}
              />
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* VOLUNTEER ROLE VIEWS ONLY */}
        {/* ============================================================== */}
        {currentUser.role === 'volunteer' && (
          <>
            {(activeTab === 'volunteer_shifts' || activeTab === 'volunteer_alerts') && (
              <VolunteerPortal
                currentVolunteer={currentVolunteer}
                volunteers={volunteers}
                assignments={assignments}
                announcements={announcements}
                emergencies={emergencies}
                onRegisterVolunteer={handleRegisterVolunteer}
              />
            )}

            {activeTab === 'map' && (
              <FacilitiesMap
                accommodations={accommodations}
                foodCenters={foodCenters}
                waterPoints={waterPoints}
                medicalCenters={medicalCenters}
              />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsTab announcements={announcements} />
            )}
          </>
        )}
      </main>

      {/* Floating Role Switch / Demo Reset Bar */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
        <button
          onClick={handleLogout}
          className="p-2.5 bg-white/95 hover:bg-white text-stone-800 rounded-full border border-stone-300 shadow-md flex items-center gap-1.5 text-xs font-bold backdrop-blur-xs transition"
          title="Switch logged in role"
        >
          <ArrowLeftRight className="w-4 h-4 text-orange-600" />
          <span className="hidden sm:inline">Switch Role</span>
        </button>

        <button
          onClick={handleResetData}
          className="p-2.5 bg-white/95 hover:bg-white text-stone-700 rounded-full border border-stone-300 shadow-md flex items-center gap-1 text-xs font-semibold backdrop-blur-xs transition"
          title="Reset database to default seed records"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
          <span className="hidden sm:inline">Reset Data</span>
        </button>
      </div>

      {/* Footer */}
      <Footer onNavigateTab={setActiveTab} onOpenSOS={() => setIsSOSOpen(true)} />

      {/* Modals */}
      <PilgrimRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        existingCount={pilgrims.length}
      />

      <PilgrimPassModal
        pilgrim={selectedPassPilgrim}
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />

      <AccommodationRequestModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        centers={accommodations}
        currentPilgrim={currentPilgrim}
        onRequestSubmitted={handleAccommodationRequest}
      />

      <EmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onSubmitEmergency={handleEmergencySOS}
      />
    </div>
  );
}
