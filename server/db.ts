import fs from 'fs';
import path from 'path';
import {
  User,
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
  SEED_USERS,
  SEED_PILGRIMS,
  SEED_ACCOMMODATION_CENTERS,
  SEED_ACCOMMODATION_REQUESTS,
  SEED_FOOD_CENTERS,
  SEED_WATER_POINTS,
  SEED_MEDICAL_CENTERS,
  SEED_VOLUNTEERS,
  SEED_ASSIGNMENTS,
  SEED_ANNOUNCEMENTS,
  SEED_EMERGENCIES,
} from './data';

interface DatabaseSchema {
  users: User[];
  pilgrims: Pilgrim[];
  accommodations: AccommodationCenter[];
  accommodation_requests: AccommodationRequest[];
  food_centers: FoodCenter[];
  water_points: WaterPoint[];
  medical_centers: MedicalCenter[];
  volunteers: Volunteer[];
  assignments: VolunteerAssignment[];
  announcements: Announcement[];
  emergencies: EmergencyRequest[];
}

const DB_FILE = path.resolve(process.cwd(), 'server', 'db_store.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read db_store.json, initializing fresh default dataset:', e);
    }

    const defaultData: DatabaseSchema = {
      users: [...SEED_USERS],
      pilgrims: [...SEED_PILGRIMS],
      accommodations: [...SEED_ACCOMMODATION_CENTERS],
      accommodation_requests: [...SEED_ACCOMMODATION_REQUESTS],
      food_centers: [...SEED_FOOD_CENTERS],
      water_points: [...SEED_WATER_POINTS],
      medical_centers: [...SEED_MEDICAL_CENTERS],
      volunteers: [...SEED_VOLUNTEERS],
      assignments: [...SEED_ASSIGNMENTS],
      announcements: [...SEED_ANNOUNCEMENTS],
      emergencies: [...SEED_EMERGENCIES],
    };

    this.save(defaultData);
    return defaultData;
  }

  public save(dataToSave?: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving db_store.json:', e);
    }
  }

  public reset() {
    this.data = {
      users: [...SEED_USERS],
      pilgrims: [...SEED_PILGRIMS],
      accommodations: [...SEED_ACCOMMODATION_CENTERS],
      accommodation_requests: [...SEED_ACCOMMODATION_REQUESTS],
      food_centers: [...SEED_FOOD_CENTERS],
      water_points: [...SEED_WATER_POINTS],
      medical_centers: [...SEED_MEDICAL_CENTERS],
      volunteers: [...SEED_VOLUNTEERS],
      assignments: [...SEED_ASSIGNMENTS],
      announcements: [...SEED_ANNOUNCEMENTS],
      emergencies: [...SEED_EMERGENCIES],
    };
    this.save();
    return this.data;
  }

  public get<K extends keyof DatabaseSchema>(table: K): DatabaseSchema[K] {
    return this.data[table];
  }

  public set<K extends keyof DatabaseSchema>(table: K, value: DatabaseSchema[K]) {
    this.data[table] = value;
    this.save();
  }
}

export const db = new DatabaseStore();
