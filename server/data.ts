export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
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

export const SEED_USERS: User[] = [
  { id: 1, username: 'admin', email: 'admin@alandiyatra.org', password_hash: 'admin123', role: 'admin', is_active: true, name: 'Temple Admin Office' },
  { id: 2, username: 'tukaram_varkari', email: 'tukaram@example.com', password_hash: 'pilgrim123', role: 'pilgrim', is_active: true, name: 'Tukaram Pandurang Shinde' },
  { id: 3, username: 'anita_patil', email: 'anita@example.com', password_hash: 'pilgrim123', role: 'pilgrim', is_active: true, name: 'Anita Ramesh Patil' },
  { id: 4, username: 'volunteer_ramesh', email: 'ramesh.vol@alandiyatra.org', password_hash: 'volunteer123', role: 'volunteer', is_active: true, name: 'Ramesh Mahadev Shinde' },
  { id: 5, username: 'volunteer_priya', email: 'priya.vol@alandiyatra.org', password_hash: 'volunteer123', role: 'volunteer', is_active: true, name: 'Priya Santosh Gaikwad' },
];

export const SEED_PILGRIMS: Pilgrim[] = [
  {
    id: 1,
    user_id: 2,
    registration_number: 'AY-2026-1001',
    full_name: 'Tukaram Pandurang Shinde',
    age: 58,
    gender: 'Male',
    mobile: '9822012345',
    address: 'Plot 14, Mauli Niwas, Pandharpur Road',
    city: 'Solapur',
    state: 'Maharashtra',
    pincode: '413002',
    emergency_contact_name: 'Dnyaneshwar Shinde (Son)',
    emergency_contact_phone: '9822099999',
    accompanying_count: 4,
    special_needs: 'Senior citizen assistance required',
    status: 'approved',
    created_at: '2026-06-20T10:30:00Z',
  },
  {
    id: 2,
    user_id: 3,
    registration_number: 'AY-2026-1002',
    full_name: 'Anita Ramesh Patil',
    age: 42,
    gender: 'Female',
    mobile: '9890123456',
    address: 'Flat 302, Sai Residency, Station Road',
    city: 'Satara',
    state: 'Maharashtra',
    pincode: '415001',
    emergency_contact_name: 'Ramesh Patil (Husband)',
    emergency_contact_phone: '9890111222',
    accompanying_count: 2,
    special_needs: 'None',
    status: 'approved',
    created_at: '2026-06-21T11:15:00Z',
  },
  {
    id: 3,
    user_id: null,
    registration_number: 'AY-2026-1003',
    full_name: 'Baburao Ganpat Deshmukh',
    age: 65,
    gender: 'Male',
    mobile: '9423456789',
    address: 'At Post Vadgaon, Taluka Maval',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '412106',
    emergency_contact_name: 'Sanjay Deshmukh',
    emergency_contact_phone: '9423456780',
    accompanying_count: 3,
    special_needs: 'Wheelchair access requested',
    status: 'checked_in',
    created_at: '2026-06-22T09:00:00Z',
  },
  {
    id: 4,
    user_id: null,
    registration_number: 'AY-2026-1004',
    full_name: 'Sunita Mahadev Kadam',
    age: 36,
    gender: 'Female',
    mobile: '9765432100',
    address: 'Shivaji Chowk, Sangamner',
    city: 'Ahmednagar',
    state: 'Maharashtra',
    pincode: '422605',
    emergency_contact_name: 'Mahadev Kadam',
    emergency_contact_phone: '9765432101',
    accompanying_count: 1,
    special_needs: 'None',
    status: 'approved',
    created_at: '2026-06-23T14:40:00Z',
  },
];

export const SEED_ACCOMMODATION_CENTERS: AccommodationCenter[] = [
  {
    id: 1,
    name: 'Mauli Bhakta Niwas Complex',
    location: 'Near Sant Dnyaneshwar Samadhi Mandir, Alandi',
    total_capacity: 1500,
    available_capacity: 320,
    facilities: 'Separate Dormitories for Men & Women, Hot Water, CCTV Security, Locker Facility, RO Drinking Water',
    contact_person: 'Sopandada More',
    contact_phone: '020-27185200',
    latitude: 18.6778,
    longitude: 73.8972,
    is_active: true,
  },
  {
    id: 2,
    name: 'Varkari Bhavan Shelter Hall',
    location: 'Opposite Indrayani River Ghat, Alandi',
    total_capacity: 2500,
    available_capacity: 780,
    facilities: 'Large Ventilated Community Hall, High-grade Mattresses, Sanitized Restrooms, 24x7 Seva Guards, Bhajan Stage',
    contact_person: 'Pandharinath Maharaj',
    contact_phone: '020-27185201',
    latitude: 18.6769,
    longitude: 73.8958,
    is_active: true,
  },
  {
    id: 3,
    name: 'Sant Tukaram Dharmashala',
    location: 'Markal Road, Vadgaon Ghenand Naka, Alandi',
    total_capacity: 1200,
    available_capacity: 450,
    facilities: 'Attached Bathrooms, Solar Water Heating, First Aid Desk, Information Counter, Shoe Keeping Stall',
    contact_person: 'Chandrakant Jadhav',
    contact_phone: '020-27185202',
    latitude: 18.6812,
    longitude: 73.8995,
    is_active: true,
  },
  {
    id: 4,
    name: 'Shree Dnyanraj Rain Basera Camp',
    location: 'Pune-Alandi Highway, Near Alandi Octroi Naka',
    total_capacity: 3000,
    available_capacity: 1150,
    facilities: 'Large German Waterproof Hangars, Carpeted Flooring, 50 Mobile Restrooms, Mobile Charging Kiosks',
    contact_person: 'Rajendra Gadekar',
    contact_phone: '020-27185203',
    latitude: 18.6735,
    longitude: 73.8930,
    is_active: true,
  },
];

export const SEED_ACCOMMODATION_REQUESTS: AccommodationRequest[] = [
  {
    id: 1,
    pilgrim_id: 1,
    center_id: 1,
    requested_beds: 5,
    check_in_date: '2026-06-25',
    check_out_date: '2026-06-28',
    status: 'approved',
    admin_remarks: 'Allocated Room 104, Ground Floor for senior Varkaris',
    created_at: '2026-06-20T12:00:00Z',
    pilgrim_name: 'Tukaram Pandurang Shinde',
    pilgrim_mobile: '9822012345',
    center_name: 'Mauli Bhakta Niwas Complex',
  },
  {
    id: 2,
    pilgrim_id: 2,
    center_id: 2,
    requested_beds: 3,
    check_in_date: '2026-06-26',
    check_out_date: '2026-06-29',
    status: 'pending',
    admin_remarks: 'Under review by accommodation committee',
    created_at: '2026-06-21T15:00:00Z',
    pilgrim_name: 'Anita Ramesh Patil',
    pilgrim_mobile: '9890123456',
    center_name: 'Varkari Bhavan Shelter Hall',
  },
];

export const SEED_FOOD_CENTERS: FoodCenter[] = [
  {
    id: 1,
    name: 'Central Mandir Annachhatra',
    location: 'Behind Samadhi Mandir, Alandi',
    service_timings: '06:00 AM - 10:30 PM (Continuous)',
    meal_type: 'Mahaprasad (Khichdi, Pithla Bhakri, Sheera, Masala Chaas)',
    daily_capacity: 45000,
    contact_phone: '020-27185300',
    latitude: 18.6781,
    longitude: 73.8975,
    is_active: true,
  },
  {
    id: 2,
    name: 'Indrayani Ghat Seva Mahaprasad',
    location: 'Near Siddhabetta Bridge, Indrayani Ghat',
    service_timings: '07:00 AM - 09:30 PM',
    meal_type: 'Puri Bhaji, Dal Rice, Jalebi & Warm Herbal Tea',
    daily_capacity: 35000,
    contact_phone: '020-27185301',
    latitude: 18.6762,
    longitude: 73.8961,
    is_active: true,
  },
  {
    id: 3,
    name: 'Dnyaneshwari Varkari Bhojanalaya',
    location: 'Markal Road Chowk, Alandi',
    service_timings: '08:00 AM - 10:00 PM',
    meal_type: 'Authentic Maharashtrian Satvik Thali & Warm Haldi Milk',
    daily_capacity: 25000,
    contact_phone: '020-27185302',
    latitude: 18.6820,
    longitude: 73.9010,
    is_active: true,
  },
  {
    id: 4,
    name: 'Charholi Phata Welcome Annachhatra',
    location: 'Pune-Alandi Highway Entrance Gateway',
    service_timings: '06:30 AM - 11:00 PM',
    meal_type: 'Breakfast Poha, Upma, Full Lunch & Dinner Prasadam',
    daily_capacity: 30000,
    contact_phone: '020-27185303',
    latitude: 18.6690,
    longitude: 73.8910,
    is_active: true,
  },
];

export const SEED_WATER_POINTS: WaterPoint[] = [
  {
    id: 1,
    name: 'Mandir Pradakshina RO Station',
    location: 'East Gate, Samadhi Mandir Complex',
    water_type: 'RO Chilled Pure Drinking Water (12 Automated Faucets)',
    is_operational: true,
    timing: '24 Hours Open',
    latitude: 18.6779,
    longitude: 73.8979,
  },
  {
    id: 2,
    name: 'Indrayani Ghat Pumping Station Point',
    location: 'Main Ghat Steps near Boat Stand',
    water_type: 'UV Filtered Mineral Water Post',
    is_operational: true,
    timing: '24 Hours Open',
    latitude: 18.6766,
    longitude: 73.8953,
  },
  {
    id: 3,
    name: 'Alandi Bus Stand Water Tanker Post',
    location: 'MSRTC Bus Depot Alandi',
    water_type: 'Continuous Municipal Corporation Filtered Tanker',
    is_operational: true,
    timing: '24 Hours Open',
    latitude: 18.6740,
    longitude: 73.8942,
  },
  {
    id: 4,
    name: 'Varkari Chowk Mobile Dispenser',
    location: 'Vadgaon Road junction',
    water_type: 'Automated Cold Water Kiosk',
    is_operational: true,
    timing: '05:00 AM - 11:00 PM',
    latitude: 18.6805,
    longitude: 73.8988,
  },
];

export const SEED_MEDICAL_CENTERS: MedicalCenter[] = [
  {
    id: 1,
    name: 'Alandi Rural Government Hospital',
    facility_type: 'Rural Hospital',
    location: 'Vadgaon Road, Near Municipal Council, Alandi',
    contact_phone: '020-27185108',
    doctor_in_charge: 'Dr. Suresh Kulkarni (MS)',
    bed_count: 60,
    emergency_services: 'Trauma ICU, 24x7 Emergency Ward, Minor OT, Anti-Venom, Oxygen Supply',
    latitude: 18.6795,
    longitude: 73.8965,
    is_active: true,
  },
  {
    id: 2,
    name: 'Indrayani Ghat Emergency First Aid Camp',
    facility_type: 'First Aid Center',
    location: 'Ghat Entrance Gate 2, River Promenade',
    contact_phone: '9823010101',
    doctor_in_charge: 'Dr. Meena Deshmukh (MBBS)',
    bed_count: 15,
    emergency_services: 'Heatstroke Treatment, Blister Dressings, ORS Hydration Post, Wheelchairs',
    latitude: 18.6763,
    longitude: 73.8950,
    is_active: true,
  },
  {
    id: 3,
    name: '108 Emergency Ambulance Station 1',
    facility_type: 'Ambulance Point',
    location: 'Temple North Car Parking Gate',
    contact_phone: '108',
    doctor_in_charge: 'EMT Team Alpha (State Health Dept)',
    bed_count: 2,
    emergency_services: 'Advanced Life Support (ALS) with Defibrillator, Ventilator, Paramedics',
    latitude: 18.6788,
    longitude: 73.8980,
    is_active: true,
  },
  {
    id: 4,
    name: 'Red Cross Mobile Medical Unit',
    facility_type: 'Mobile Health Camp',
    location: 'Charholi Phata Holding Area',
    contact_phone: '9823020202',
    doctor_in_charge: 'Dr. Anand Joshi',
    bed_count: 10,
    emergency_services: 'Free Physician Consultation, BP/Sugar screening, Free Medicine Dispensing',
    latitude: 18.6700,
    longitude: 73.8915,
    is_active: true,
  },
];

export const SEED_VOLUNTEERS: Volunteer[] = [
  {
    id: 1,
    user_id: 4,
    full_name: 'Ramesh Mahadev Shinde',
    mobile: '9822114455',
    email: 'ramesh.vol@alandiyatra.org',
    skills: 'Crowd Direction, Barricade Management, Marathi & Hindi Translation',
    blood_group: 'O+',
    id_proof: 'Aadhaar: 4521-8890-1122',
    status: 'active',
    created_at: '2026-06-15T09:00:00Z',
  },
  {
    id: 2,
    user_id: 5,
    full_name: 'Priya Santosh Gaikwad',
    mobile: '9822225566',
    email: 'priya.vol@alandiyatra.org',
    skills: 'Certified First Aid, Nursing Support, Lost Child Care',
    blood_group: 'A+',
    id_proof: 'Aadhaar: 7812-4455-9900',
    status: 'active',
    created_at: '2026-06-16T10:00:00Z',
  },
  {
    id: 3,
    user_id: null,
    full_name: 'Ganesh Vitthal Pawar',
    mobile: '9822336677',
    email: 'ganesh.pawar@example.com',
    skills: 'Elderly Wheelchair Transport, Traffic & Parking Regulation',
    blood_group: 'B+',
    id_proof: 'Aadhaar: 3344-9988-1212',
    status: 'active',
    created_at: '2026-06-17T11:00:00Z',
  },
];

export const SEED_ASSIGNMENTS: VolunteerAssignment[] = [
  {
    id: 1,
    volunteer_id: 1,
    duty_role: 'Darshan Queue Management & Barricade Safety',
    location_name: 'Samadhi Mandir East Entrance Gate',
    shift_start: '06:00 AM',
    shift_end: '02:00 PM',
    shift_date: '2026-06-25',
    status: 'assigned',
    volunteer_name: 'Ramesh Mahadev Shinde',
    volunteer_phone: '9822114455',
  },
  {
    id: 2,
    volunteer_id: 2,
    duty_role: 'First Aid & Lost Person Support Helpdesk',
    location_name: 'Indrayani Ghat Information Booth 3',
    shift_start: '08:00 AM',
    shift_end: '04:00 PM',
    shift_date: '2026-06-25',
    status: 'assigned',
    volunteer_name: 'Priya Santosh Gaikwad',
    volunteer_phone: '9822225566',
  },
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Sant Dnyaneshwar Palkhi Prasthan Timetable Declared',
    content: 'The official departure procession of Palkhi will begin at 4:00 PM from Samadhi Mandir sanctum sanctorum. Devotees are requested to cooperate with volunteers along the barricaded path.',
    category: 'Schedule',
    priority: 'urgent',
    published_at: '2026-06-25T08:00:00Z',
    is_active: true,
  },
  {
    id: 2,
    title: 'Free Electric Battery Buggy for Senior Citizens & Divyangs',
    content: '20 battery-operated buggies are in service between Alandi Bus Stand, Dharamshalas, and Mandir Gate. Please present your digital or printed Yatra Pass for free priority boarding.',
    category: 'Facilities',
    priority: 'high',
    published_at: '2026-06-25T06:30:00Z',
    is_active: true,
  },
  {
    id: 3,
    title: 'Indrayani River Bathing Safety Notice - Respect Red Warning Flags',
    content: 'Please bathe only in shallow barricaded ghat zones. Life guards from the Pune Disaster Response Team and NDRF are deployed on boat patrols 24 hours.',
    category: 'Safety',
    priority: 'high',
    published_at: '2026-06-24T18:00:00Z',
    is_active: true,
  },
];

export const SEED_EMERGENCIES: EmergencyRequest[] = [
  {
    id: 1,
    pilgrim_id: 1,
    reporter_name: 'Dnyaneshwar Shinde',
    contact_number: '9822099999',
    location_details: 'Near Ghat Step No. 12, River Bank',
    emergency_type: 'Medical',
    description: 'Elderly father feels dizzy due to high heat & dehydration. Needs immediate medical check and ORS.',
    status: 'resolved',
    admin_notes: 'Dr. Meena Deshmukh team attended within 6 minutes. ORS and glucose given. Vitals normal.',
    created_at: '2026-06-25T09:15:00Z',
  },
  {
    id: 2,
    pilgrim_id: 4,
    reporter_name: 'Sunita Mahadev Kadam',
    contact_number: '9765432100',
    location_details: 'Annachhatra Dining Exit Gate 2',
    emergency_type: 'Missing Person',
    description: 'Elderly relative separated in crowd.',
    status: 'dispatched',
    admin_notes: 'Volunteer Priya Gaikwad assigned. Central PA announcement broadcast in Marathi.',
    created_at: '2026-06-25T11:40:00Z',
  },
];
