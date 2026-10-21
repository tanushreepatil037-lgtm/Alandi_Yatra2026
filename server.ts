import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database Store for Node.js Backend
let users = [
  { id: 1, username: 'admin', email: 'admin@alandiyatra.org', role: 'admin', is_active: true, name: 'Temple Admin Office' },
  { id: 2, username: 'tukaram_varkari', email: 'tukaram@example.com', role: 'pilgrim', is_active: true, name: 'Tukaram Pandurang Shinde' },
  { id: 3, username: 'anita_patil', email: 'anita@example.com', role: 'pilgrim', is_active: true, name: 'Anita Ramesh Patil' },
  { id: 4, username: 'volunteer_ramesh', email: 'ramesh.vol@alandiyatra.org', role: 'volunteer', is_active: true, name: 'Ramesh Mahadev Shinde' },
  { id: 5, username: 'volunteer_priya', email: 'priya.vol@alandiyatra.org', role: 'volunteer', is_active: true, name: 'Priya Santosh Gaikwad' },
];

let pilgrims = [
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

let accommodations = [
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

let accommodationRequests = [
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

let foodCenters = [
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

let waterPoints = [
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
];

let medicalCenters = [
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
];

let volunteers: any[] = [
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
];

let assignments = [
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

let announcements = [
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

let emergencies: any[] = [
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
    description: 'Elderly relative (Age 72, white dhoti, saffron scarf, carrying brass cymbals) separated in crowd.',
    status: 'dispatched',
    admin_notes: 'Volunteer Priya Gaikwad assigned. Central PA announcement broadcast in Marathi across 8 speakers.',
    created_at: '2026-06-25T11:40:00Z',
  },
];

// ============================================================================
// REST API ROUTES
// ============================================================================

// 1. Auth: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, role } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const existingUser = users.find(
    (u) =>
      (u.username.toLowerCase() === username.trim().toLowerCase() ||
        u.email.toLowerCase() === username.trim().toLowerCase()) &&
      (role ? u.role === role : true)
  );

  if (existingUser) {
    return res.json({ success: true, user: existingUser });
  }

  // Create on-the-fly for demo if not found
  const newUser = {
    id: Date.now(),
    username: username.trim(),
    email: `${username.trim()}@alandiyatra.org`,
    role: role || 'pilgrim',
    is_active: true,
    name: username.trim(),
  };
  users.push(newUser);
  return res.json({ success: true, user: newUser });
});

// 2. Pilgrims API
app.get('/api/pilgrims', (req: Request, res: Response) => {
  const { search, status } = req.query;
  let result = [...pilgrims];

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.full_name.toLowerCase().includes(s) ||
        p.registration_number.toLowerCase().includes(s) ||
        p.mobile.includes(s) ||
        p.city.toLowerCase().includes(s)
    );
  }

  if (status && typeof status === 'string' && status !== 'all') {
    result = result.filter((p) => p.status === status);
  }

  res.json(result);
});

app.post('/api/pilgrims', (req: Request, res: Response) => {
  const { full_name, age, gender, mobile, address, city, state, pincode, emergency_contact_name, emergency_contact_phone, accompanying_count, special_needs } = req.body;

  if (!full_name || !mobile) {
    return res.status(400).json({ error: 'Full name and mobile number are required' });
  }

  const uniqueSuffix = 1000 + pilgrims.length + Math.floor(Math.random() * 90);
  const regId = `AY-2026-${uniqueSuffix}`;

  const newPilgrim = {
    id: Date.now(),
    user_id: null,
    registration_number: regId,
    full_name: full_name.trim(),
    age: Number(age) || 40,
    gender: gender || 'Male',
    mobile: mobile.trim(),
    address: address?.trim() || 'Alandi Devachi',
    city: city?.trim() || 'Pune',
    state: state?.trim() || 'Maharashtra',
    pincode: pincode?.trim() || '412105',
    emergency_contact_name: emergency_contact_name?.trim() || 'Family Member',
    emergency_contact_phone: emergency_contact_phone?.trim() || mobile.trim(),
    accompanying_count: Number(accompanying_count) || 0,
    special_needs: special_needs || 'None',
    status: 'approved',
    created_at: new Date().toISOString(),
  };

  pilgrims.unshift(newPilgrim);
  res.status(201).json(newPilgrim);
});

app.put('/api/pilgrims/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = pilgrims.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Pilgrim not found' });
  }

  pilgrims[index] = { ...pilgrims[index], ...req.body };
  res.json(pilgrims[index]);
});

app.delete('/api/pilgrims/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  pilgrims = pilgrims.filter((p) => p.id !== id);
  res.json({ success: true, message: 'Pilgrim record deleted' });
});

// 3. Accommodations API
app.get('/api/accommodations', (_req: Request, res: Response) => {
  res.json(accommodations);
});

app.get('/api/accommodations/requests', (_req: Request, res: Response) => {
  res.json(accommodationRequests);
});

app.post('/api/accommodations/requests', (req: Request, res: Response) => {
  const { center_id, requested_beds, check_in_date, check_out_date, pilgrim_name, pilgrim_mobile, pilgrim_id } = req.body;

  const center = accommodations.find((c) => c.id === Number(center_id));
  if (!center) {
    return res.status(404).json({ error: 'Center not found' });
  }

  if (center.available_capacity < Number(requested_beds)) {
    return res.status(400).json({ error: 'Requested beds exceed available capacity' });
  }

  const newRequest = {
    id: Date.now(),
    pilgrim_id: pilgrim_id || 1,
    center_id: center.id,
    requested_beds: Number(requested_beds) || 1,
    check_in_date: check_in_date || '2026-06-25',
    check_out_date: check_out_date || '2026-06-28',
    status: 'pending',
    admin_remarks: 'Submitted via online portal',
    created_at: new Date().toISOString(),
    pilgrim_name: pilgrim_name || 'Pilgrim',
    pilgrim_mobile: pilgrim_mobile || '9822000000',
    center_name: center.name,
  };

  accommodationRequests.unshift(newRequest);
  res.status(201).json(newRequest);
});

app.put('/api/accommodations/requests/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status, admin_remarks } = req.body;
  const reqIndex = accommodationRequests.findIndex((r) => r.id === id);

  if (reqIndex === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }

  const targetReq = accommodationRequests[reqIndex];

  // If approving, reduce center capacity
  if (status === 'approved' && targetReq.status !== 'approved') {
    const center = accommodations.find((c) => c.id === targetReq.center_id);
    if (center) {
      if (center.available_capacity < targetReq.requested_beds) {
        return res.status(400).json({ error: 'Not enough available beds remaining' });
      }
      center.available_capacity -= targetReq.requested_beds;
    }
  }

  accommodationRequests[reqIndex] = {
    ...targetReq,
    status: status || targetReq.status,
    admin_remarks: admin_remarks || targetReq.admin_remarks,
  };

  res.json({ request: accommodationRequests[reqIndex], accommodations });
});

// 4. Facilities API
app.get('/api/facilities', (_req: Request, res: Response) => {
  res.json({ foodCenters, waterPoints, medicalCenters });
});

// 5. Volunteers API
app.get('/api/volunteers', (_req: Request, res: Response) => {
  res.json(volunteers);
});

app.post('/api/volunteers', (req: Request, res: Response) => {
  const { full_name, mobile, email, skills, blood_group } = req.body;
  const newVol = {
    id: Date.now(),
    user_id: null,
    full_name: full_name.trim(),
    mobile: mobile.trim(),
    email: email?.trim() || 'volunteer@alandiyatra.org',
    skills: skills || 'Crowd Management',
    blood_group: blood_group || 'B+',
    id_proof: 'Aadhaar Verified',
    status: 'active',
    created_at: new Date().toISOString(),
  };
  volunteers.push(newVol);
  res.status(201).json(newVol);
});

app.get('/api/volunteers/assignments', (_req: Request, res: Response) => {
  res.json(assignments);
});

app.post('/api/volunteers/assignments', (req: Request, res: Response) => {
  const { volunteer_id, duty_role, location_name, shift_start, shift_end, shift_date } = req.body;
  const vol = volunteers.find((v) => v.id === Number(volunteer_id));

  const newAssignment = {
    id: Date.now(),
    volunteer_id: Number(volunteer_id),
    duty_role: duty_role || 'General Seva',
    location_name: location_name || 'Mandir Complex',
    shift_start: shift_start || '08:00 AM',
    shift_end: shift_end || '04:00 PM',
    shift_date: shift_date || '2026-06-25',
    status: 'assigned',
    volunteer_name: vol ? vol.full_name : 'Volunteer',
    volunteer_phone: vol ? vol.mobile : '',
  };

  assignments.unshift(newAssignment);
  res.status(201).json(newAssignment);
});

// 6. Announcements API
app.get('/api/announcements', (_req: Request, res: Response) => {
  res.json(announcements);
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const { title, content, category, priority } = req.body;
  const newAnn = {
    id: Date.now(),
    title: title.trim(),
    content: content.trim(),
    category: category || 'General',
    priority: priority || 'medium',
    published_at: new Date().toISOString(),
    is_active: true,
  };
  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

app.delete('/api/announcements/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  announcements = announcements.filter((a) => a.id !== id);
  res.json({ success: true });
});

// 7. Emergency SOS API
app.get('/api/emergencies', (_req: Request, res: Response) => {
  res.json(emergencies);
});

app.post('/api/emergencies', (req: Request, res: Response) => {
  const { reporter_name, contact_number, location_details, emergency_type, description } = req.body;
  const newReq = {
    id: Date.now(),
    pilgrim_id: null,
    reporter_name: reporter_name?.trim() || 'Devotee',
    contact_number: contact_number?.trim() || '108',
    location_details: location_details?.trim() || 'Alandi Ghat',
    emergency_type: emergency_type || 'Medical',
    description: description?.trim() || 'Urgent assistance needed',
    status: 'reported',
    admin_notes: 'Alert sent to Central Control Room',
    created_at: new Date().toISOString(),
  };
  emergencies.unshift(newReq);
  res.status(201).json(newReq);
});

app.put('/api/emergencies/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status, admin_notes } = req.body;
  const emIndex = emergencies.findIndex((e) => e.id === id);
  if (emIndex === -1) {
    return res.status(404).json({ error: 'Incident not found' });
  }

  emergencies[emIndex] = {
    ...emergencies[emIndex],
    status: status || emergencies[emIndex].status,
    admin_notes: admin_notes !== undefined ? admin_notes : emergencies[emIndex].admin_notes,
  };
  res.json(emergencies[emIndex]);
});

// ============================================================================
// SERVER SETUP & VITE MOUNTING
// ============================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Alandi Yatra Backend] Node.js Express server running on port ${PORT}`);
  });
}

startServer();
