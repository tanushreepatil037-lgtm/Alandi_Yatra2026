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
  User,
} from '../types';

export const api = {
  // 1. Auth Login
  async login(username: string, role?: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, role }),
    });
    return res.json();
  },

  // 2. Pilgrims
  async getPilgrims(search?: string, status?: string): Promise<Pilgrim[]> {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (status) query.append('status', status);
    const res = await fetch(`/api/pilgrims?${query.toString()}`);
    return res.json();
  },

  async createPilgrim(data: Partial<Pilgrim>): Promise<Pilgrim> {
    const res = await fetch('/api/pilgrims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updatePilgrim(id: number, data: Partial<Pilgrim>): Promise<Pilgrim> {
    const res = await fetch(`/api/pilgrims/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deletePilgrim(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`/api/pilgrims/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // 3. Accommodations
  async getAccommodations(): Promise<AccommodationCenter[]> {
    const res = await fetch('/api/accommodations');
    return res.json();
  },

  async getAccommodationRequests(): Promise<AccommodationRequest[]> {
    const res = await fetch('/api/accommodations/requests');
    return res.json();
  },

  async createAccommodationRequest(data: Partial<AccommodationRequest>): Promise<AccommodationRequest> {
    const res = await fetch('/api/accommodations/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateAccommodationRequest(
    id: number,
    status: 'approved' | 'rejected',
    admin_remarks?: string
  ): Promise<{ request: AccommodationRequest; accommodations: AccommodationCenter[] }> {
    const res = await fetch(`/api/accommodations/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_remarks }),
    });
    return res.json();
  },

  // 4. Facilities
  async getFacilities(): Promise<{
    foodCenters: FoodCenter[];
    waterPoints: WaterPoint[];
    medicalCenters: MedicalCenter[];
  }> {
    const res = await fetch('/api/facilities');
    return res.json();
  },

  // 5. Volunteers
  async getVolunteers(): Promise<Volunteer[]> {
    const res = await fetch('/api/volunteers');
    return res.json();
  },

  async createVolunteer(data: Partial<Volunteer>): Promise<Volunteer> {
    const res = await fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getAssignments(): Promise<VolunteerAssignment[]> {
    const res = await fetch('/api/volunteers/assignments');
    return res.json();
  },

  async createAssignment(data: Partial<VolunteerAssignment>): Promise<VolunteerAssignment> {
    const res = await fetch('/api/volunteers/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // 6. Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch('/api/announcements');
    return res.json();
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteAnnouncement(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // 7. Emergency SOS
  async getEmergencies(): Promise<EmergencyRequest[]> {
    const res = await fetch('/api/emergencies');
    return res.json();
  },

  async createEmergency(data: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    const res = await fetch('/api/emergencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateEmergency(id: number, status: string, admin_notes?: string): Promise<EmergencyRequest> {
    const res = await fetch(`/api/emergencies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_notes }),
    });
    return res.json();
  },
};
