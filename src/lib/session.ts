// Demo session helper (frontend only, no real auth)
import type { Role } from "@/data/dummy";

export type DemoSession = {
  role: Role;
  nama: string;
  bayiId?: string; // for ortu
};

const KEY = "posyandu_demo_session";

export function getSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(s: DemoSession) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function roleLabel(r: Role): string {
  return r === "admin" ? "Ketua Posyandu" : r === "kader" ? "Kader Posyandu" : "Orang Tua";
}
