
export enum AppState {
  HOME = 'HOME',
  BODY_SELECTION = 'BODY_SELECTION',
  PLACEMENT = 'PLACEMENT',
  CALIBRATION = 'CALIBRATION',
  WORKOUT = 'WORKOUT',
  SUMMARY = 'SUMMARY',
  ANALYTICS = 'ANALYTICS',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  JOURNAL = 'JOURNAL'
}

export enum WorkoutMode {
  WEIGHT = 'Ağırlık',
  CARDIO = 'Kardiyo'
}

export enum BodyRegion {
  CHEST = 'Göğüs',
  BACK = 'Sırt',
  SHOULDER = 'Omuz',
  ARM = 'Kol',
  ABS = 'Karın',
  LEG = 'Bacak'
}

export enum ModuleId {
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED'
}

export interface ModuleStatus {
  id: ModuleId;
  color: string;
  label: string;
  placed: boolean;
  battery: number;
  connected: boolean;
  signal: number;
}

export interface EmgDataPoint {
  timestamp: number;
  BLUE: number;
  GREEN: number;
  YELLOW: number;
  RED: number;
  avg: number;
}

export interface ModuleSpecificMetrics {
  avg: number;
  peak: number;
  contractions: number;
  fatigueIndex: number; // -1 to 1 (negative = decreasing power)
  timeInZones: {
    low: number;    // 0-30%
    medium: number; // 30-60%
    high: number;   // 60-80%
    extreme: number; // 80-100%
  };
}

export interface WorkoutRecord {
  id: string;
  date: string;
  mode: WorkoutMode;
  region: BodyRegion;
  duration: number; // seconds
  avgActivation: number;
  peakActivation: number;
  sets: number;
  notes: string;
  symmetryIndex: number; // -100 to 100 (0 is perfect balance)
  qualityScore: number;  // 0-100
  moduleMetrics: {
    [key in ModuleId]: ModuleSpecificMetrics;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  goal?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  notifications: boolean;
  demoMode: boolean;
}
