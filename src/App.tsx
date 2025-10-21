import { useLocalData } from "@hooks/useLocalData";
import { StatsRow } from "@components/StatsRow";
import { WorkoutsPage } from "@features/workouts/WorkoutsPage";
import { NutritionPage } from "@features/nutrition/NutritionPage";
import { WaterPage } from "@features/water/WaterPage";
import { AnalyticsPage } from "@features/analytics/AnalyticsPage";
import { SettingsPage } from "@features/settings/SettingsPage";
import {
  toCSV,
  downloadCSV,
  parseCSV,
  importMeals,
  importWaters,
  importWorkouts,
} from "@lib/csv";
import { hasSupabase, pushAll } from "@lib/supabase";
import { Dumbbell, Utensils, Droplet, BarChart2, Settings } from "lucide-react";
import { useMemo, useState } from "react";

export default function App() {
  const {
    data,
    addWorkout,
    delWorkout,
    addMeal,
    delMeal,
    addWater,
    delWater,
    updateTargets,
    toggleCloud,
    inRange,
  } = useLocalData();
  const [tab, setTab] = useState<
    "workouts" | "nutrition" | "water" | "analytics" | "settings"
  >("workouts");

  // Totals for stat row (last 7d default via pages)
  const start = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  }, []);
  const mealsRange = data.meals.filter((m) => inRange(m.date, start));
  const watersRange = data.waters.filter((h) => inRange(h.date, start));
  const workoutsRange = data.workouts.filter((w) => inRange(w.date, start));
  const daysN = 7;
  const tCal = mealsRange.reduce((s, m) => s + m.calories, 0);
  const tProt = mealsRange.reduce((s, m) => s + m.protein, 0);
  const tWater = watersRange.reduce((s, h) => s + h.ml, 0);
  const tVol = workoutsRange.reduce(
    (s, w) =>
      s +
      w.exercises.reduce(
        (ss, ex) =>
          ss + ex.sets.reduce((sss, st) => sss + st.weight * st.reps, 0),
        0
      ),
    0
  );

  const items = [
    { label: "Avg Calories", value: Math.round(tCal / daysN).toLocaleString() },
    {
      label: "Avg Protein (g)",
      value: Math.round(tProt / daysN).toLocaleString(),
    },
    {
      label: "Avg Water (ml)",
      value: Math.round(tWater / daysN).toLocaleString(),
    },
    { label: "Avg Volume", value: Math.round(tVol / daysN).toLocaleString() },
    { label: "Workouts", value: String(workoutsRange.length) },
    { label: "Meals", value: String(mealsRange.length) },
    { label: "Water Logs", value: String(watersRange.length) },
  ];

  // CSV export handlers
  const exportMeals = () => downloadCSV("meals.csv", toCSV(data.meals));
  const exportWaters = () => downloadCSV("waters.csv", toCSV(data.waters));
  const exportWorkouts = () =>
    downloadCSV(
      "workouts.csv",
      toCSV(
        data.workouts.map((w) => ({
          ...w,
          exercises: JSON.stringify(w.exercises),
        }))
      )
    );

  const importFile = async (
    file: File,
    kind: "meals" | "waters" | "workouts"
  ) => {
    const text = await file.text();
    const rows = parseCSV(text);
    if (kind === "meals") importMeals(rows).forEach(addMeal);
    if (kind === "waters") importWaters(rows).forEach(addWater);
    if (kind === "workouts") importWorkouts(rows).forEach(addWorkout);
  };

  const doSync = async () => {
    if (!hasSupabase) {
      alert("Supabase not configured");
      return;
    }
    const userId = "local-demo-user";
    const { error } = await pushAll(userId, {
      workouts: data.workouts,
      meals: data.meals,
      waters: data.waters,
    });
    alert(error ? `Sync error: ${error.message}` : "Synced!");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/5 grid place-items-center shadow">
              <Dumbbell className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold">Fitness Tracker Pro</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Tab
              id="workouts"
              icon={<Dumbbell size={16} />}
              label="Workouts"
              active={tab === "workouts"}
              onClick={() => setTab("workouts")}
            />
            <Tab
              id="nutrition"
              icon={<Utensils size={16} />}
              label="Nutrition"
              active={tab === "nutrition"}
              onClick={() => setTab("nutrition")}
            />
            <Tab
              id="water"
              icon={<Droplet size={16} />}
              label="Water"
              active={tab === "water"}
              onClick={() => setTab("water")}
            />
            <Tab
              id="analytics"
              icon={<BarChart2 size={16} />}
              label="Analytics"
              active={tab === "analytics"}
              onClick={() => setTab("analytics")}
            />
            <Tab
              id="settings"
              icon={<Settings size={16} />}
              label="Settings"
              active={tab === "settings"}
              onClick={() => setTab("settings")}
            />
          </nav>
        </header>

        <StatsRow items={items} />

        <div className="mt-6">
          {tab === "workouts" && (
            <>
              <div className="mb-2 flex gap-2">
                <button className="btn" onClick={exportWorkouts}>
                  Export CSV
                </button>
                <label className="btn cursor-pointer">
                  Import CSV
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files &&
                      importFile(e.target.files[0], "workouts")
                    }
                  />
                </label>
              </div>
              <WorkoutsPage
                workouts={data.workouts}
                onAdd={addWorkout}
                onDelete={delWorkout}
                inRange={inRange}
              />
            </>
          )}
          {tab === "nutrition" && (
            <NutritionPage
              meals={data.meals}
              onAdd={addMeal}
              onDelete={delMeal}
              onExport={exportMeals}
              onImport={(f) => importFile(f, "meals")}
              inRange={(d) => inRange(d)}
            />
          )}
          {tab === "water" && (
            <WaterPage
              waters={data.waters}
              onAdd={addWater}
              onDelete={delWater}
              onExport={exportWaters}
              onImport={(f) => importFile(f, "waters")}
              inRange={(d) => inRange(d)}
            />
          )}
          {tab === "analytics" && (
            <AnalyticsPage
              workouts={data.workouts}
              meals={data.meals}
              waters={data.waters}
              targets={data.targets}
            />
          )}
          {tab === "settings" && (
            <div className="space-y-3">
              <SettingsPage
                targets={data.targets}
                onUpdate={updateTargets}
                useCloud={data.useCloud}
                onToggleCloud={toggleCloud}
              />
              <div className="card p-4 flex gap-2 items-center">
                <button className="btn" onClick={doSync}>
                  Manual Sync
                </button>
                <span className="text-sm text-base-mute">
                  Cloud:{" "}
                  {data.useCloud
                    ? hasSupabase
                      ? "enabled"
                      : "not configured"
                    : "disabled"}
                </span>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-10 text-sm text-base-mute">
          <p>
            Data is stored locally. CSV export/import included. Supabase sync
            optional.
          </p>
        </footer>
      </div>
    </div>
  );
}

function Tab({
  id,
  label,
  icon,
  active,
  onClick,
}: {
  id: string;
  label: string;
  icon: JSX.Element;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`btn ${active ? "bg-white/10" : ""}`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
