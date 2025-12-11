// FILE: src/server/astro/core.ts
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
export async function julianDayUTC(date: Date): Promise<number> {
  const swe = await getSwe();

  return swe.swe_julday(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours() +
      date.getUTCMinutes() / 60 +
      date.getUTCSeconds() / 3600,
    swe.SE_GREG_CAL
  );
}

/** Sidereal planet longitude (Lahiri, MOSEPH). Returns null if Swiss not available. */
export async function siderealLon(
  utc: Date,
  planet: number
): Promise<number | null> {
  try {
    const swe = await getSwe();

    // Always set sidereal (Lahiri) before computing longitudes
    try {
      if (typeof swe.swe_set_sid_mode === "function") {
        await swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
      }
    } catch {
      // ignore; if this fails, engine may still be in Lahiri from startup
    }

    const jd = await julianDayUTC(utc);
    if (!Number.isFinite(jd)) return null;

    // Prefer sidereal + MOSEPH
    const flags =
      (swe.SEFLG_SIDEREAL ?? 0) |
      (swe.SEFLG_MOSEPH ?? 0);

    const r = await swe.swe_calc_ut(jd, planet, flags);

    // sweph-wasm can return either array or object depending on API shape
    const lon: number | undefined =
      (r && (r.longitude as number)) ??
      (Array.isArray(r) ? (r[0] as number) : (r?.x?.[0] as number | undefined));

    if (typeof lon !== "number" || !Number.isFinite(lon)) return null;
    return norm360(lon);
  } catch {
    return null;
  }
}

/** Minimal natal shape used by life report / engine */
export type Natal = { planets: Partial<Record<number, number>> };

/** Compute D1 planet longitudes for the standard set (Sun..Saturn + True Node + Ketu). */
export async function getNatal(birth?: BirthInput): Promise<Natal> {
  if (!birth) return { planets: {} };

  const swe = await getSwe();

  // Build UTC date from given tz
  const dt = DateTime.fromISO(`${birth.dobISO}T${birth.tob}`, {
    zone: birth.place.tz,
  }).toUTC();
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
    const v = await siderealLon(date, pl);
    if (typeof v === "number") out.planets[pl] = v;
  }

  // Synthetic Ketu (opposite Rahu)
  if (out.planets[swe.SE_TRUE_NODE] != null) {
    out.planets[-1] = norm360(
      (out.planets[swe.SE_TRUE_NODE] as number) + 180
    );
  }

  return out;
}
