export type HabitCategory = 'Study' | 'Health' | 'Routines' | 'Creative';

export type PlotSpriteType =
  | 'cherry_blossom'
  | 'pine'
  | 'oak_lantern'
  | 'wildflower_arch'
  | 'herb_garden'
  | 'cedar_shrine';

// -1: Weeds (after 3+ missed days), 0: Seeds, 1: Sprout, 2: Sapling, 3: Bloom
export type PlantStage = -1 | 0 | 1 | 2 | 3;

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  spriteType: PlotSpriteType;
  plotId: number; // 0..15 in 4x4 grid
  plantedDate: string; // YYYY-MM-DD local date (also reset when pulling weeds)
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD local date
  watered: boolean;
  updatedAt: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  deadline?: string; // optional short tag e.g. "6 PM"
  done: boolean;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface UserProfile {
  isAuthenticated: boolean;
  displayName: string;
  groveName: string;
}

export interface StoredAccount {
  username: string;
  displayName: string;
  password: string;
  groveName: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface GroveState {
  profile: UserProfile;
  settings: AppSettings;
  habits: Habit[];
  logs: HabitLog[];
  reminders: ReminderItem[];
}
