// Simple local profile store (localStorage)
// - Persist multiple profiles
// - Lookup by id via ?profile=<id> on the chat page

export type StoredPlace = {
  name: string;
  lat: number;
  lon: number;
  tz: string;
};

export type StoredProfile = {
  id: string;
  name: string;
  dobISO: string;   // YYYY-MM-DD
  tob: string;      // HH:mm
  place: StoredPlace;
  createdAt: string; // ISO
};

const KEY = "sarathi.profiles.v1";

function readAll(): Record<string, StoredProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, StoredProfile>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function saveProfile(p: Omit<StoredProfile, "id" | "createdAt"> & Partial<StoredProfile>) {
  const map = readAll();
  const id = p.id || (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `p_${Date.now()}`);
  const now = new Date().toISOString();
  const final: StoredProfile = {
    id,
    name: p.name || "",
    dobISO: p.dobISO,
    tob: p.tob,
    place: p.place,
    createdAt: p.createdAt || now,
  };
  map[id] = final;
  writeAll(map);
  return final;
}

export function getProfile(id: string): StoredProfile | undefined {
  const map = readAll();
  return map[id];
}

export function getAllProfiles(): StoredProfile[] {
  const map = readAll();
  return Object.values(map).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function deleteProfile(id: string) {
  const map = readAll();
  delete map[id];
  writeAll(map);
}
