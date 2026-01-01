# Fitness Tracker Pro

Local-first React + TypeScript app to **log workouts (per-exercise sets), track calories/macros and water**, and visualize **analytics** (volume, targets, trends). Ships with **CSV import/export**, **optional Supabase sync**, **Tailwind UI**, **Recharts**, and **Docker**.

---

## Features

- **Workouts**
  - Per-exercise **sets** (weight × reps), notes, duration, day/type (Push/Pull/Legs/Run, etc.)
  - **Quick templates** (StrongLifts 5×5 A/B) — customize or add your own
  - Auto-computed **daily training volume**
- **Nutrition & Hydration**
  - Meals with **calories, protein, carbs, fat**
  - Water logs (ml) with **daily target**
  - Daily **targets** for calories/macros/water (editable in Settings)
- **Analytics**
  - Workout **volume by day**
  - **Calories vs. target** line chart
  - **Stacked macros** area chart
  - **Hydration vs. target**
- **Data portability**
  - **CSV export/import** for workouts, meals, water
  - **Local-first** persistence (browser `localStorage`)
- **Cloud sync (optional)**
  - **Supabase** snapshot push — toggle in Settings
- **Tooling**
  - Tailwind UI, Recharts, Framer Motion, Lucide icons
  - **Vite** dev server, TypeScript, path aliases
  - **Docker** & Compose for one-command run

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Recharts, Framer Motion, Lucide
- **State & Storage:** local component state + `localStorage`
- **Optional Cloud:** Supabase (via `@supabase/supabase-js`)
- **Packaging:** Docker multi-stage (build + static serve)

---

## Project Structure

```
fitness-tracker-pro/
├─ Dockerfile
├─ docker-compose.yml
├─ .env.example           # copy to .env and fill in (VITE_*) variables
├─ .gitignore
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ index.html
├─ postcss.config.js
├─ tailwind.config.js
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ index.css
│  ├─ types.ts
│  ├─ hooks/
│  │  └─ useLocalData.ts
│  ├─ lib/
│  │  ├─ storage.ts       # localStorage helpers, uid, todayISO
│  │  ├─ csv.ts           # CSV (toCSV, parseCSV, import/export helpers)
│  │  └─ supabase.ts      # optional sync (pushAll, hasSupabase)
│  ├─ components/
│  │  ├─ StatsRow.tsx
│  │  ├─ ChartCard.tsx
│  │  ├─ ListTable.tsx
│  │  ├─ forms/
│  │  │  ├─ WorkoutForm.tsx
│  │  │  ├─ MealForm.tsx
│  │  │  └─ WaterForm.tsx
│  │  └─ analytics/
│  │     └─ Dashboard.tsx
│  └─ features/
│     ├─ workouts/WorkoutsPage.tsx
│     ├─ nutrition/NutritionPage.tsx
│     ├─ water/WaterPage.tsx
│     ├─ analytics/AnalyticsPage.tsx
│     └─ settings/SettingsPage.tsx
```

---

## Getting Started (Local Node)

### 0) Requirements
- **Node.js 20+** (same as Dockerfile)
- **npm** (or pnpm/yarn if you prefer)

### 1) Install
```bash
npm install
```

### 2) Environment
Copy `.env.example` → `.env` and (optionally) fill values:
```env
# Optional cloud sync (Supabase); leave empty to run offline
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# App targets (defaults used if unset)
VITE_DEFAULT_CALORIES=2400
VITE_DEFAULT_PROTEIN=180
VITE_DEFAULT_CARBS=250
VITE_DEFAULT_FAT=70
VITE_DEFAULT_WATER_ML=3000
```

> **Vite requires** env names to start with `VITE_`.  
> If you use a different mode (e.g., `.env.supabase`), run: `npm run dev -- --mode supabase`.

### 3) Run Dev Server
```bash
npm run dev
```
Open http://localhost:5173

---

## Run with Docker

```bash
docker compose up --build
# open http://localhost:5173
```

**How it works:**
- Stage 1: `node:20-alpine` builds with Vite
- Stage 2: static assets served with `serve -s dist -l 5173`

---

## ⚙️ Scripts

```bash
npm run dev        # start Vite dev server
npm run build      # type-check + build to dist/
npm run preview    # preview built app on a local server
```

---

## Environment Variables (Vite)

| Key                       | Description                          | Example                   |
|---------------------------|--------------------------------------|---------------------------|
| `VITE_SUPABASE_URL`      | Supabase project URL (optional)      | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (optional)         | `eyJhbGciOi...`           |
| `VITE_DEFAULT_CALORIES`  | Default daily calories target        | `2400`                    |
| `VITE_DEFAULT_PROTEIN`   | Default daily protein (g)            | `180`                     |
| `VITE_DEFAULT_CARBS`     | Default daily carbs (g)              | `250`                     |
| `VITE_DEFAULT_FAT`       | Default daily fat (g)                | `70`                      |
| `VITE_DEFAULT_WATER_ML`  | Default daily water target (ml)      | `3000`                    |

> When env files change, **restart** the dev server.

---

## CSV Import/Export

### Export
- **Workouts:** “Export CSV” on Workouts tab  
- **Meals/Water:** buttons on their respective tabs

### Import
- Click **Import CSV** and select a CSV that matches the formats below.

### Formats

**Meals**
```csv
id,date,name,calories,protein,carbs,fat
abc123,2025-01-01,Chicken bowl,600,40,60,20
```

**Waters**
```csv
id,date,ml
w1,2025-01-01,500
```

**Workouts**
```csv
id,date,type,durationMin,notes,exercises
wk1,2025-01-01,Push,60,,[{"id":"e1","name":"Bench Press","sets":[{"weight":100,"reps":5},{"weight":100,"reps":5}]}]
```
> `exercises` is a **JSON string** representing the array of exercises + sets.

---

## ☁️ Optional: Supabase Sync

- Toggle **“Enable cloud sync (Supabase)”** in Settings.
- Click **“Manual Sync”** to upsert snapshots of workouts/meals/waters.

### Install & Configure
```bash
npm i @supabase/supabase-js
```
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env`.

### Minimal Schema (SQL)
```sql
create table if not exists public.workouts (
  id text primary key,
  user_id text,
  date text not null,
  type text,
  durationMin integer,
  notes text,
  exercises jsonb,
  updated_at timestamptz
);

create table if not exists public.meals (
  id text primary key,
  user_id text,
  date text not null,
  name text,
  calories integer,
  protein integer,
  carbs integer,
  fat integer,
  updated_at timestamptz
);

create table if not exists public.waters (
  id text primary key,
  user_id text,
  date text not null,
  ml integer,
  updated_at timestamptz
);
```

> **Security:** Enable Row Level Security (RLS) and policies for your auth model if you go beyond local testing.

---

## Data Model (TypeScript)

```ts
type SetEntry = { weight: number; reps: number };
type Exercise = { id: string; name: string; sets: SetEntry[] };

type Workout = {
  id: string;
  date: string;           // ISO YYYY-MM-DD
  type: string;
  durationMin: number;
  notes?: string;
  exercises: Exercise[];  // used to compute daily volume
};

type Meal = { id: string; date: string; name: string; calories: number; protein: number; carbs: number; fat: number };
type WaterLog = { id: string; date: string; ml: number };

type Targets = { calories: number; protein: number; carbs: number; fat: number; waterMl: number };
```

---

## Customization Tips

- **Add workout templates:** edit `src/components/forms/WorkoutForm.tsx` (`TEMPLATES`).
- **Units (kg/lb):** store a `unit` in settings and convert display/entry.
- **Streaks/PRs:** derive from workouts in `AnalyticsPage.tsx` and render in `Dashboard.tsx`.
- **Path aliases:** Edit both `tsconfig.json` (`paths`) and `vite.config.ts` (`resolve.alias`) together.

---

## Troubleshooting

**`Cannot find module '@vitejs/plugin-react'`**  
Install the plugin and restart:
```bash
npm i -D @vitejs/plugin-react
```

**`Property 'env' does not exist on type 'ImportMeta'`**  
Add Vite types and ES lib in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "types": ["vite/client"]
  }
}
```

**`replaceAll` not found**  
Use `"target": "ES2021"` or replace with `split('"').join('""')`.

**CSV parser regex error**  
Use correct line split: `text.trim().split(/\r?\n/)`.

**Tailwind at-rule warnings in editor**  
Ensure `@tailwind`/`@apply` (not `@tailwindcss`/`@applycss`), install Tailwind IntelliSense, or set `"css.lint.unknownAtRules": "ignore"` in `.vscode/settings.json`.

**Env file not loading**  
Vite only loads `.env`, `.env.local`, or `.env.<mode>`. If you use `.env.supabase`, run `npm run dev -- --mode supabase`. Ensure all keys start with `VITE_`.

---

## .gitignore

Make sure the repo has a `.gitignore` that ignores real env files but keeps examples:

```gitignore
node_modules/
dist/
.vite/
.cache/
*.log
.env
.env.*
!.env.example
!.env.sample
```

---

## Roadmap (ideas)

- Exercise PR tracking (best set per lift)
- Weekly/monthly goals and streak badges
- Bodyweight & measurements tracking
- Export to Google Sheets
- Multi-user auth + RLS policies (Supabase)
- PWA offline install + mobile UI optimizations
