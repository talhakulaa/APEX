
import { UserProfile, WorkoutRecord, AppSettings } from '../types';

const KEYS = {
  PROFILE: 'myotrack.profile.v1',
  RECORDS: 'myotrack.records.v1',
  SETTINGS: 'myotrack.settings.v1'
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  notifications: true,
  demoMode: true
};

export const storage = {
  // Profile
  loadProfile: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      if (!data) return null;
      const parsed = JSON.parse(data);
      // Basic validation: ensure it has a name
      if (parsed && typeof parsed.name === 'string') {
        return parsed as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Failed to load profile from storage:', error);
      return null;
    }
  },
  saveProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save profile to storage:', error);
    }
  },

  // Records
  loadRecords: (): WorkoutRecord[] => {
    try {
      const data = localStorage.getItem(KEYS.RECORDS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed as WorkoutRecord[];
      }
      return [];
    } catch (error) {
      console.error('Failed to load records from storage:', error);
      localStorage.removeItem(KEYS.RECORDS); // Clear corrupt data
      return [];
    }
  },
  saveRecords: (records: WorkoutRecord[]): void => {
    try {
      localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save records to storage:', error);
    }
  },

  // Settings
  loadSettings: (): AppSettings => {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (error) {
      console.error('Failed to load settings from storage:', error);
      return DEFAULT_SETTINGS;
    }
  },
  saveSettings: (settings: AppSettings): void => {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to storage:', error);
    }
  }
};
