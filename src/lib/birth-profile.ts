// src/lib/birth-profile.ts
export type BirthProfile = {
  dobISO?: string;
  tob?: string; // "HH:mm" 24h
  venusHouse?: number; // 1..12 (optional)
  fourthLord?: string; // optional
  place?: { name: string; lat: number; lon: number; tz: string };
};

const KEY = "sarathi.birthProfile.v1";

export function saveBirthProfile(p: BirthProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function loadBirthProfile(): BirthProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(KEY);
    return s ? (JSON.parse(s) as BirthProfile) : null;
  } catch {
    return null;
  }
}
