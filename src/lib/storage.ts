import { StoreShape } from "@types";
const KEY = "ft_pro_store_v1";
export function loadStore(): Partial<StoreShape> | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function saveStore(s: StoreShape) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}
export const uid = () => Math.random().toString(36).slice(2, 10);
export const todayISO = () => new Date().toISOString().slice(0, 10);
