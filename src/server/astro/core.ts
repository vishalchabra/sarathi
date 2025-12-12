// FILE: src/server/astro/core.ts
export const runtime = "nodejs";

import "server-only";
import type { BirthInput } from "@/types";
import { DateTime } from "luxon";
import { sweCall, getSweConstants } from "@/server/astro/swe-remote";

/** Normalize 0..360 */
function norm360(x: number): number {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

/**
 * UT Julian day for a given Date (in UTC), implemented with a pure
 * TypeScript algorithm (no native Swiss Ephemeris).
 *
 * Returned value is a Julian Day including fractional day for time of day.
 */
export async function julianDayUTC(date: Date): Promise<number> {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  let day =
    date.getUTCDate() +
    (date.getUTCHours() +
      (date.getUTCMinutes() + date.getUTCSeconds() / 60) / 60) /
      24;

  // Shift Jan/Feb to month 13/14 of previous year
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 100);

  const jd =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5;

  return jd;
}

/**
 * Sidereal (Lahiri-ish) longitude using our SWE-FREE stub engine.
 * Uses swe_calc_ut from swe-remote (mean-motion approximation),
 * then subtracts a fixed ayanāṁśa (~24°) and wraps to 0..360.
 */
export async function siderealLon(
  utc: Date,
  planetCode: number
): Promise<number | null> {
  try {
    const jd = await julianDayUTC(utc);
    const res: any = await sweCall("swe_calc_ut", jd, planetCode);

    let lon: number | undefined = res?.longitude;
    if (lon == null && Array.isArray(res?.x) && typeof res.x[0] === "number") {
      lon = res.x[0];
    } else if (lon == null && Array.isArray(res) && typeof res[0] === "number") {
      lon = res[0];
    }

    if (typeof lon !== "number" || !Number.isFinite(lon)) return null;

    // Rough Lahiri ayanāṁśa (~24°); we can refine later.
    const lahiriAyanamsaDeg = 24;
    const sid = norm360(lon - lahiriAyanamsaDeg);
    return sid;
  } catch {
    return null;
  }
}

/** Minimal natal shape used by life report / engine */
export type Natal = { planets: Partial<Record<number, number>> };

/**
 * Compute D1 planet longitudes for the standard set
 * (Sun..Saturn + True Node + synthetic Ketu).
 *
 * NOTE: This uses our SWE-FREE stub engine (mean motions via swe-remote),
 * not native Swiss Ephemeris, so it is an approximation but gives us
 * real numbers instead of an empty map.
 */
export async function getNatal(birth?: BirthInput): Promise<Natal> {
  if (!birth) return { planets: {} };

  const constants = await getSweConstants();

  // Build UTC date from given tz
  const dt = DateTime.fromISO(`${birth.dobISO}T${birth.tob}`, {
    zone: birth.place.tz,
  }).toUTC();
  const date = dt.toJSDate();
  const jd = await julianDayUTC(date);

  const PLANETS = [
    constants.SE_SUN,
    constants.SE_MOON,
    constants.SE_MERCURY,
    constants.SE_VENUS,
    constants.SE_MARS,
    constants.SE_JUPITER,
    constants.SE_SATURN,
    constants.SE_TRUE_NODE,
  ];

  const out: Natal = { planets: {} };

  for (const code of PLANETS) {
    try {
      const r: any = await sweCall("swe_calc_ut", jd, code);
      let lon: number | undefined = r?.longitude;

      if (lon == null && Array.isArray(r?.x) && typeof r.x[0] === "number") {
        lon = r.x[0];
      } else if (lon == null && Array.isArray(r) && typeof r[0] === "number") {
        lon = r[0];
      }

      if (typeof lon === "number" && Number.isFinite(lon)) {
        out.planets[code] = norm360(lon);
      }
    } catch (err) {
      // If one planet fails, skip it and continue
      console.error("[getNatal] swe_calc_ut failed for code", code, err);
    }
  }

  // Synthetic Ketu (opposite Rahu / True Node), use key -1
  const rahuCode = constants.SE_TRUE_NODE;
  if (out.planets[rahuCode] != null) {
    out.planets[-1] = norm360((out.planets[rahuCode] as number) + 180);
  }

  return out;
}
