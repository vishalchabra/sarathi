// FILE: src/server/life/engine.ts
"use server";

import "server-only";
import { getSwe } from "@/server/astro/swe";

export type Birth = {
  dateISO: string;   // "YYYY-MM-DD"
  time: string;      // "HH:mm" or "HHmm"
  tz: string;        // e.g. "Asia/Kolkata"
  lat: number;
  lon: number;
};

type MDT = { planet: string; startISO: string; endISO: string };

const ORDER = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"] as const;
const YEARS: Record<(typeof ORDER)[number], number> =
  { Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17 };
const NAK_SIZE = 360 / 27;

/* ---------- helpers ---------- */
function tzOffsetHours(tz: string): number {
  const t = (tz || "").toLowerCase();
  if (t.includes("asia/kolkata") || t.includes("kolkata") || t.includes("india")) return 5.5;
  if (t.includes("asia/dubai") || t.includes("dubai") || t.includes("uae")) return 4;
  if (t.includes("doha") || t.includes("qatar")) return 3;
  if (t.includes("riyadh") || t.includes("saudi")) return 3;
  if (t.includes("europe/london") || t.includes("london") || t.includes("utc") || t.includes("gmt")) return 0;
  if (t.includes("america/new_york") || t.includes("new_york") || t.includes("new-york") || t.includes("eastern")) return -5;
  return 0;
}
function parseHM(hm: string): { h: number; m: number } {
  const m = (hm || "").trim().match(/^(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return { h: 12, m: 0 };
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
  const mi = Math.min(59, Math.max(0, parseInt(m[2] ?? "0", 10)));
  return { h, m: mi };
}
function addYearsFrac(date: Date, years: number): Date {
  const out = new Date(date);
  const whole = Math.trunc(years);
  const frac = years - whole;
  if (whole) out.setUTCFullYear(out.getUTCFullYear() + whole);
  if (frac) out.setTime(out.getTime() + frac * 365.2425 * 86400000);
  return out;
}

/* ---------- astro core (SIDEREAL!) ---------- */
function jdUTFromBirth(b: Birth): { jd: number; birthUT: Date } {
  const swe = getSwe();
  const [Y, M, D] = b.dateISO.split("-").map((x) => parseInt(x, 10));
  const { h, m } = parseHM(b.time);
  const utHours = (h + m / 60) - tzOffsetHours(b.tz);
  const jd = swe.swe_julday(Y, M, D, utHours, swe.SE_GREG_CAL);
  const birthUT = new Date(Date.UTC(Y, M - 1, D, Math.floor(utHours), Math.round((utHours % 1) * 60)));
  return { jd, birthUT };
}

function moonLongitudeSiderealUT(jdUT: number): number {
  const swe = getSwe();
  const flag = (swe.SEFLG_SWIEPH ?? 2) | (swe.SEFLG_SIDEREAL ?? 64) | (swe.SEFLG_SPEED ?? 256);
  const res = swe.swe_calc_ut(jdUT, swe.SE_MOON, flag);
  let lon = (res?.longitude ?? res?.x?.[0] ?? 0) % 360;
  if (lon < 0) lon += 360;
  return lon;
}

function mdSeedFromMoon(lonSid: number) {
  const nakIndex = Math.floor(lonSid / NAK_SIZE);                  // 0..26
  const frac = (lonSid - nakIndex * NAK_SIZE) / NAK_SIZE;          // 0..1
  const lordIndex = nakIndex % 9;
  const lord = ORDER[lordIndex];
  const years = YEARS[lord];
  const elapsed = years * frac;            // consumed within running MD
  const remaining = years - elapsed;       // balance at birth
  return { lord, lordIndex, elapsedYears: elapsed, remainingYears: remaining, nakIndex, frac };
}

/* ---------- public API ---------- */
export async function vimshottariMDTable(birth: Birth): Promise<MDT[]> {
  const { jd, birthUT } = jdUTFromBirth(birth);
  const lonSid = moonLongitudeSiderealUT(jd);
  const seed = mdSeedFromMoon(lonSid);

  // Start of the running MD at birth (anchor!)
  const mdStartAtBirth = addYearsFrac(birthUT, -seed.elapsedYears);

  // Roll full 120y sequence
  const rows: MDT[] = [];
  let idx = seed.lordIndex;
  let cursor = new Date(mdStartAtBirth);
  let accYears = 0;

  while (accYears < 120 - 1e-6) {
    const p = ORDER[idx];
    const yrs = YEARS[p];
    const s = new Date(cursor);
    const e = addYearsFrac(s, yrs);
    rows.push({ planet: p, startISO: s.toISOString().slice(0, 10), endISO: e.toISOString().slice(0, 10) });
    idx = (idx + 1) % ORDER.length;
    cursor = e;
    accYears += yrs;
  }

  if (process.env.NODE_ENV !== "production") {
    const names = [
      "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha","Ardra","Punarvasu","Pushya","Ashlesha",
      "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
      "Mula","Purvashada","Uttarashada","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
    ];
    const swe = getSwe();
    const ayan = typeof swe.swe_get_ayanamsa_ut === "function" ? swe.swe_get_ayanamsa_ut(jd) : NaN;
    console.log(
      `[life/engine] Moon(sid)=${lonSid.toFixed(4)}° | Nak=${names[Math.floor(lonSid/NAK_SIZE)]} | ` +
      `MD Lord=${seed.lord} | elapsed=${seed.elapsedYears.toFixed(3)}y | rem=${seed.remainingYears.toFixed(3)}y | ` +
      `ayanamsa=${isNaN(ayan) ? "NA" : ayan.toFixed(4)}°`
    );
  }

  return rows;
}
