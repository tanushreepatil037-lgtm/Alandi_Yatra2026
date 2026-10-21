export type UserRole = 'admin' | 'pilgrim' | 'volunteer' | 'guest';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'pilgrim' | 'volunteer';
  is_active: boolean;
  name?: string;
}

export interface Pilgrim {
  id: number;
  user_id?: number | null;
  registration_number: string;
  full_name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  accompanying_count: number;
  special_needs?: string;
  status: 'pending' | 'approved' | 'checked_in' | 'cancelled';
  created_at: string;
}

export interface AccommodationCenter {
  id: number;
  name: string;
  location: string;
  total_capacity: number;
  available_capacity: number;
  facilities: string;
  contact_person: string;
  contact_phone: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
}

export interface AccommodationRequest {
  id: number;
  pilgrim_id: number;
  center_id: number;
  requested_beds: number;
  check_in_date: string;
  check_out_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  admin_remarks?: string;
  created_at: string;
  // joined fields
  pilgrim_name?: string;
  pilgrim_mobile?: string;
  center_name?: string;
}

export interface FoodCenter {
  id: number;
  name: string;
  location: string;
  service_timings: string;
  meal_type: string;
  daily_capacity: number;
  contact_phone: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
}

export interface WaterPoint {
  id: number;
  name: string;
  location: string;
  water_type: string;
  is_operational: boolean;
  timing: string;
  latitude: number;
  longitude: number;
}

export interface MedicalCenter {
  id: number;
  name: string;
  facility_type: 'First Aid Center' | 'Rural Hospital' | 'Ambulance Point' | 'Mobile Health Camp';
  location: string;
  contact_phone: string;
  doctor_in_charge: string;
  bed_count: number;
  emergency_services: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
}

export interface Volunteer {
  id: number;
  user_id?: number | null;
  full_name: string;
  mobile: string;
  email: string;
  skills: string;
  blood_group: string;
  id_proof: string;
  status: 'active' | 'inactive' | 'on_leave';
  created_at: string;
}

export interface VolunteerAssignment {
  id: number;
  volunteer_id: number;
  duty_role: string;
  location_name: string;
  shift_start: string;
  shift_end: string;
  shift_date: string;
  status: 'assigned' | 'completed' | 'absent';
  volunteer_name?: string;
  volunteer_phone?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: 'Schedule' | 'Safety' | 'Facilities' | 'Emergency' | 'General';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  published_at: string;
  is_active: boolean;
}

export interface EmergencyRequest {
  id: number;
  pilgrim_id?: number | null;
  reporter_name: string;
  contact_number: string;
  location_details: string;
  emergency_type: 'Medical' | 'Missing Person' | 'Food/Water' | 'Crowd Stampede' | 'Other';
  description: string;
  status: 'reported' | 'dispatched' | 'resolved';
  admin_notes?: string;
  created_at: string;
}

export interface YatraEvent {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  year: number;
  expected_pilgrims: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}
