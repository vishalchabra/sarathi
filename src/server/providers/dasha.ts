// stays server-side
export const runtime = "nodejs";

import "server-only";
import { DateTime } from "luxon";
import type { BirthInput } from "@/types";
import { getSwe } from "@/server/astro/swe"; // ← use the canonical loader

// --------- Vimshottari constants ----------
export const DASHAS = [
  { lord: "ketu", years: 7 },
  { lord: "venus", years: 20 },
  { lord: "sun", years: 6 },
  { lord: "moon", years: 10 },
  { lord: "mars", years: 7 },
  { lord: "rahu", years: 18 },
  { lord: "jupiter", years: 16 },
  { lord: "saturn", years: 19 },
  { lord: "mercury", years: 17 },
] as const;

const LORD_INDEX: Record<string, number> = {
  ketu: 0,
  venus: 1,
  sun: 2,
  moon: 3,
  mars: 4,
  rahu: 5,
  jupiter: 6,
  saturn: 7,
  mercury: 8,
};

const LORDS = DASHAS.map((d) => d.lord);
const NAKS_PER_CIRCLE = 27;
const NAK_SPAN = 360 / NAKS_PER_CIRCLE; // 13°20'
const DAYS_PER_YEAR = 365.2425;

// --------- Helpers ----------
function norm(deg: number) {
  let v = deg % 360;
  return v < 0 ? v + 360 : v;
}

function moonSiderealDeg(date: Date) {
  const swe = getSwe(); // ← load Swiss here (server only)
  if (!swe) throw new Error("swisseph not available");

  const jd = swe.swe_julday(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600,
    swe.SE_GREG_CAL
  );

  // Try with SWIEPH first
  let flags = (swe.SEFLG_SWIEPH ?? 2) | (swe.SEFLG_SIDEREAL ?? 64);
  let r = swe.swe_calc_ut(jd, swe.SE_MOON, flags);
  if (r && typeof r.longitude === "number") return norm(r.longitude);

  // Fallback: MOSEPH (no .se* files)
  flags = (swe.SEFLG_MOSEPH ?? 0) | (swe.SEFLG_SIDEREAL ?? 64);
  r = swe.swe_calc_ut(jd, swe.SE_MOON, flags);
  if (r && typeof r.longitude === "number") return norm(r.longitude);

  throw new Error("swe_calc_ut failed");
}

function birthUTC(birth: BirthInput) {
  // your BirthInput uses dobISO/tob/place.tz
  return DateTime.fromISO(`${birth.dobISO}T${birth.tob}`, { zone: birth.place.tz })
    .toUTC()
    .toJSDate();
}

function getDashaYears(lord: string) {
  return DASHAS[LORD_INDEX[lord]].years;
}

function nakToLordIndex(nakIndex: number) {
  // Ashwini (0) → Ketu; sequence follows DASHAS order
  return nakIndex % 9;
}

// --------- Types ----------
export type Mahadasha = { lord: string; start: string; end: string };
export type Antardasha = { mahaLord: string; lord: string; start: string; end: string };

// --------- Core calculations ----------
export function computeMahadashas(birth: BirthInput): Mahadasha[] {
  const startUTC = birthUTC(birth);

  let moon: number;
  try {
    moon = moonSiderealDeg(startUTC);
  } catch {
    // Swiss not available or failed → safe fallback
    return [];
  }

  const nakIndex = Math.floor(moon / NAK_SPAN); // 0..26

  // Start from nakshatra lord at birth
  const startLordIdx = nakToLordIndex(nakIndex);
  const startLord = LORDS[startLordIdx];

  // Balance left in current nakshatra → remaining fraction of starting mahadasha
  const nakEnd = (nakIndex + 1) * NAK_SPAN;
  const fracLeft = (nakEnd - moon) / NAK_SPAN; // 0..1
  const startYears = getDashaYears(startLord) * Math.max(0, Math.min(1, fracLeft));

  const res: Mahadasha[] = [];
  let cursor = DateTime.fromJSDate(startUTC);

  // First, truncated start-lord period
  let lordIdx = startLordIdx;
  let durDays = startYears * DAYS_PER_YEAR;
  res.push({
    lord: LORDS[lordIdx],
    start: cursor.toISO()!,
    end: cursor.plus({ days: durDays }).toISO()!,
  });
  cursor = cursor.plus({ days: durDays });
  lordIdx = (lordIdx + 1) % 9;

  // Then full cycles to cover ~120 years
  for (let k = 0; k < 20; k++) {
    const lord = LORDS[lordIdx];
    durDays = getDashaYears(lord) * DAYS_PER_YEAR;
    const next = cursor.plus({ days: durDays });
    res.push({ lord, start: cursor.toISO()!, end: next.toISO()! });
    cursor = next;
    lordIdx = (lordIdx + 1) % 9;
  }

  return res;
}

export function computeAntardashas(maha: Mahadasha): Antardasha[] {
  const mahaLenDays = DateTime.fromISO(maha.end).diff(DateTime.fromISO(maha.start), "days").days;
  const res: Antardasha[] = [];
  const startIdx = LORD_INDEX[maha.lord];
  let cursor = DateTime.fromISO(maha.start);

  for (let i = 0; i < 9; i++) {
    const lord = LORDS[(startIdx + i) % 9];
    const frac = getDashaYears(lord) / 120; // Vimshottari proportional subperiod
    const days = mahaLenDays * frac;
    const end = cursor.plus({ days });
    res.push({ mahaLord: maha.lord, lord, start: cursor.toISO()!, end: end.toISO()! });
    cursor = end;
  }

  return res;
}

export function getDashaAt(dateISO: string, birth: BirthInput) {
  try {
    const mahadashas = computeMahadashas(birth);
    if (!mahadashas.length) return null;
    const t = DateTime.fromISO(dateISO);
    const maha = mahadashas.find(
      (d) => t >= DateTime.fromISO(d.start) && t < DateTime.fromISO(d.end)
    );
    if (!maha) return null;
    const antas = computeAntardashas(maha);
    const antara =
      antas.find((d) => t >= DateTime.fromISO(d.start) && t < DateTime.fromISO(d.end)) || antas[0];
    return { maha, antara };
  } catch {
    return null;
  }
}

// --------- Category-aware gate 0.75..1.0 (soft only) ----------
export function dashaGate(dateISO: string, birth?: BirthInput, category?: string): number {
  if (!birth) return 1; // no birth → neutral
  const info = getDashaAt(dateISO + "T12:00:00.000Z", birth);
  if (!info) return 1;

  const supportive: Record<string, string[]> = {
    vehicle: ["venus", "jupiter", "mercury"],
    property: ["jupiter", "venus", "saturn"],
    job: ["saturn", "jupiter", "mercury"],
    wealth: ["jupiter", "venus", "mercury"],
    health: ["sun", "mars", "jupiter", "moon"],
    relationship: ["venus", "moon", "jupiter"],
  };
  const sup = supportive[category ?? "wealth"] ?? [];

  let factor = 0.9;
  if (sup.includes(info.maha.lord)) factor += 0.15;
  if (sup.includes(info.antara.lord)) factor += 0.1;
  if (info.maha.lord === "rahu" || info.maha.lord === "ketu") factor -= 0.05;

  // clamp into [0.75, 1] and never boost above 1
  if (factor > 1) factor = 1;
  if (factor < 0.75) factor = 0.75;
  return factor;
}
