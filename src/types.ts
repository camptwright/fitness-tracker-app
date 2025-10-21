export type ISODate = string; // YYYY-MM-DD

export type SetEntry = {
  weight: number; // kg or lb (user-defined unit later)
  reps: number;
};

export type Exercise = {
  id: string;
  name: string; // e.g., Bench Press
  sets: SetEntry[];
};

export type Workout = {
  id: string;
  date: ISODate;
  type: string; // Push/Pull/Legs/Run
  durationMin: number;
  notes?: string;
  exercises: Exercise[];
};

export type Meal = {
  id: string;
  date: ISODate;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type WaterLog = { id: string; date: ISODate; ml: number };

export type Targets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
};

export type StoreShape = {
  workouts: Workout[];
  meals: Meal[];
  waters: WaterLog[];
  targets: Targets;
  useCloud: boolean; // Supabase toggle
};
