import { createClient } from "@supabase/supabase-js";
import { Meal, WaterLog, Workout } from "@types";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const hasSupabase = !!(url && key);
export const supabase = hasSupabase ? createClient(url!, key!) : null;
export type SimpleErr = { message: string };

export async function pushAll(
  userId: string,
  payload: { workouts: Workout[]; meals: Meal[]; waters: WaterLog[] }
): Promise<{ error: SimpleErr | null }> {
  if (!supabase) return { error: { message: "Supabase not configured" } };

  const now = new Date().toISOString();
  const { error: e1 } = await supabase
    .from("workouts")
    .upsert(
      payload.workouts.map((w) => ({ ...w, user_id: userId, updated_at: now }))
    );

  const { error: e2 } = await supabase
    .from("meals")
    .upsert(
      payload.meals.map((m) => ({ ...m, user_id: userId, updated_at: now }))
    );

  const { error: e3 } = await supabase
    .from("waters")
    .upsert(
      payload.waters.map((h) => ({ ...h, user_id: userId, updated_at: now }))
    );

  const err = e1 || e2 || e3 || null;
  return { error: err ? { message: err.message ?? String(err) } : null };
}
