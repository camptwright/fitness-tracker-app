import { useEffect, useMemo, useState } from "react";
import { Meal, StoreShape, Targets, WaterLog, Workout } from "@types";
import { loadStore, saveStore } from "@lib/storage";

const DEFAULTS: Targets = {
  calories: Number(import.meta.env.VITE_DEFAULT_CALORIES ?? 2400),
  protein: Number(import.meta.env.VITE_DEFAULT_PROTEIN ?? 180),
  carbs: Number(import.meta.env.VITE_DEFAULT_CARBS ?? 250),
  fat: Number(import.meta.env.VITE_DEFAULT_FAT ?? 70),
  waterMl: Number(import.meta.env.VITE_DEFAULT_WATER_ML ?? 3000),
};

export function useLocalData() {
  const [data, setData] = useState<StoreShape>({
    workouts: [],
    meals: [],
    waters: [],
    targets: DEFAULTS,
    useCloud: false,
  });

  useEffect(() => {
    const loaded = loadStore();
    if (loaded)
      setData((s) => ({
        ...s,
        ...loaded,
        targets: loaded.targets ?? DEFAULTS,
      }));
  }, []);

  useEffect(() => {
    saveStore(data);
  }, [data]);

  const addWorkout = (w: Workout) =>
    setData((s) => ({ ...s, workouts: [w, ...s.workouts] }));
  const delWorkout = (id: string) =>
    setData((s) => ({ ...s, workouts: s.workouts.filter((x) => x.id !== id) }));

  const addMeal = (m: Meal) =>
    setData((s) => ({ ...s, meals: [m, ...s.meals] }));
  const delMeal = (id: string) =>
    setData((s) => ({ ...s, meals: s.meals.filter((x) => x.id !== id) }));

  const addWater = (h: WaterLog) =>
    setData((s) => ({ ...s, waters: [h, ...s.waters] }));
  const delWater = (id: string) =>
    setData((s) => ({ ...s, waters: s.waters.filter((x) => x.id !== id) }));

  const updateTargets = (t: Partial<Targets>) =>
    setData((s) => ({ ...s, targets: { ...s.targets, ...t } }));
  const toggleCloud = (v: boolean) => setData((s) => ({ ...s, useCloud: v }));

  const startDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6); // last 7 days default in pages
    return d.toISOString().slice(0, 10);
  }, []);

  const inRange = (iso: string, start = startDate) => iso >= start;

  return {
    data,
    setData,
    addWorkout,
    delWorkout,
    addMeal,
    delMeal,
    addWater,
    delWater,
    updateTargets,
    toggleCloud,
    inRange,
  };
}
