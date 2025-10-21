import { Meal, WaterLog, Workout } from "@types";

export function toCSV<T extends object>(
  rows: T[],
  headers?: (keyof T)[]
): string {
  if (!rows.length) return "";
  const keys = headers ?? (Object.keys(rows[0]) as (keyof T)[]);
  const esc = (v: any) => {
    const s = String(v ?? "");
    const doubled = s.split('"').join('""');
    return /[",\n]/.test(s) ? `"${doubled}"` : s;
  };
  return [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => esc((r as any)[k])).join(",")),
  ].join("");
}

export function downloadCSV(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseCSV(text: string): string[][] {
  // Simple CSV parser for well-formed input (no multi-line quoted fields)
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line) => {
    const out: string[] = [];
    let cur = "",
      inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = !inQ;
      } else if (ch === "," && !inQ) {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out;
  });
}

export function importMeals(rows: string[][]): Meal[] {
  const [hdr, ...data] = rows;
  const idx: Record<string, number> = {};
  hdr.forEach((h, i) => (idx[h.trim()] = i));
  return data.map((r) => ({
    id: r[idx.id] ?? crypto.randomUUID?.() ?? String(Math.random()),
    date: r[idx.date],
    name: r[idx.name],
    calories: Number(r[idx.calories] ?? 0),
    protein: Number(r[idx.protein] ?? 0),
    carbs: Number(r[idx.carbs] ?? 0),
    fat: Number(r[idx.fat] ?? 0),
  }));
}

export function importWaters(rows: string[][]): WaterLog[] {
  const [hdr, ...data] = rows;
  const idx: Record<string, number> = {};
  hdr.forEach((h, i) => (idx[h.trim()] = i));
  return data.map((r) => ({
    id: r[idx.id] ?? crypto.randomUUID?.() ?? String(Math.random()),
    date: r[idx.date],
    ml: Number(r[idx.ml] ?? 0),
  }));
}

export function importWorkouts(rows: string[][]): Workout[] {
  // For simplicity, expect workouts exported by this app (JSON in exercises column)
  const [hdr, ...data] = rows;
  const idx: Record<string, number> = {};
  hdr.forEach((h, i) => (idx[h.trim()] = i));
  return data.map((r) => ({
    id: r[idx.id] ?? crypto.randomUUID?.() ?? String(Math.random()),
    date: r[idx.date],
    type: r[idx.type],
    durationMin: Number(r[idx.durationMin] ?? 0),
    notes: r[idx.notes],
    exercises: JSON.parse(r[idx.exercises] ?? "[]"),
  }));
}
