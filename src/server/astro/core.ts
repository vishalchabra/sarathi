// src/server/astro/core.ts
export const runtime = "nodejs";
import "server-only";
import type { BirthInput } from "@/types";
import { DateTime } from "luxon";
import { getSwe } from "@/server/astro/swe";

/** Normalize 0..360 */
function norm360(x: number): number {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

/** UT Julian day for a given Date (in UTC) */
function jdUT(date: Date): number {
  const swe = getSwe();
  if (!swe) return NaN;
  return swe.swe_julday(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600,
    swe.SE_GREG_CAL
  );
}

/** Sidereal planet longitude (Lahiri, MOSEPH), returns null if Swiss not available. */
export function siderealLon(utc: Date, planet: number): number | null {
  const swe = getSwe();
  if (!swe) return null;
  try {
    // Always set sidereal (Lahiri) before computing longitudes
    try { swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0); } catch {}

    const jd = jdUT(utc);
    if (!Number.isFinite(jd)) return null;

    const flags = swe.SEFLG_SIDEREAL | swe.SEFLG_MOSEPH;
    const r = swe.swe_calc_ut(jd, planet, flags);
    if (!r || typeof r.longitude !== "number") return null;
    return norm360(r.longitude);
  } catch {
    return null;
  }
}

/** Minimal natal shape used by life report */
export type Natal = { planets: Partial<Record<number, number>> };

/** Compute D1 planet longitudes for the standard set (Sun..Saturn + True Node + Ketu). */
export async function getNatal(birth?: BirthInput): Promise<Natal> {
  const swe = getSwe();
  if (!swe || !birth) return { planets: {} };

  // Build UTC date from given tz
  const dt = DateTime.fromISO(`${birth.dobISO}T${birth.tob}`, { zone: birth.place.tz }).toUTC();
  const date = dt.toJSDate();

  const PLANETS = [
    swe.SE_SUN,
    swe.SE_MOON,
    swe.SE_MERCURY,
    swe.SE_VENUS,
    swe.SE_MARS,
    swe.SE_JUPITER,
    swe.SE_SATURN,
    swe.SE_TRUE_NODE,
  ];

  const out: Natal = { planets: {} };
  for (const pl of PLANETS) {
    const v = siderealLon(date, pl);
    if (typeof v === "number") out.planets[pl] = v;
  }

  // Synthetic Ketu (opposite Rahu)
  if (out.planets[swe.SE_TRUE_NODE] != null) {
    out.planets[-1] = norm360((out.planets[swe.SE_TRUE_NODE] as number) + 180);
  }

  return out;
}
