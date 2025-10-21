import { Dashboard } from "@components/analytics/Dashboard";
import { Workout, Meal, WaterLog, Targets } from "@types";
import { useMemo } from "react";

export function AnalyticsPage({
  workouts,
  meals,
  waters,
  targets,
}: {
  workouts: Workout[];
  meals: Meal[];
  waters: WaterLog[];
  targets: Targets;
}) {
  const byDay = useMemo(() => {
    const map: Record<string, any> = {};
    const addDay = (d: string) =>
      (map[d] ??= {
        date: d,
        volume: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0,
      });
    for (const w of workouts) {
      const d = addDay(w.date);
      d.volume += w.exercises.reduce(
        (s, ex) => s + ex.sets.reduce((ss, st) => ss + st.weight * st.reps, 0),
        0
      );
    }
    for (const m of meals) {
      const d = addDay(m.date);
      d.calories += m.calories;
      d.protein += m.protein;
      d.carbs += m.carbs;
      d.fat += m.fat;
    }
    for (const h of waters) {
      const d = addDay(h.date);
      d.water += h.ml;
    }
    return Object.values(map)
      .sort((a: any, b: any) => (a.date > b.date ? 1 : -1))
      .map((row: any) => ({
        ...row,
        calTarget: targets.calories,
        waterTarget: targets.waterMl,
      }));
  }, [workouts, meals, waters, targets]);

  return <Dashboard data={byDay} />;
}
