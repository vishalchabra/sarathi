// FILE: src/server/astro-v2/sidereal-time.ts

import { norm360 } from "./math";

/**
 * Convert Date -> Julian Day (UTC)
 */
export function julianDayUTC(d: Date): number {
  return d.getTime() / 86400000 + 2440587.5;
}

/**
 * GMST in hours (good practical approximation)
 * Source form: GMST = 18.697374558 + 24.06570982441908 * (JD - 2451545.0)
 */
export function gmstHours(dateUtc: Date): number {
  const jd = julianDayUTC(dateUtc);
  const d = jd - 2451545.0;
  let gmst = 18.697374558 + 24.06570982441908 * d;
  gmst = ((gmst % 24) + 24) % 24;
  return gmst;
}

/**
 * Local Sidereal Time in DEGREES (0..360)
 *
 * IMPORTANT:
 * - lonDeg MUST be East-positive (India/UAE are positive longitudes)
 * - LST = GMST + lon/15
 */
export function localSiderealTime(jd: number, lonDegEast: number): number {
  // GMST in hours (good practical approximation)
  // GMST = 18.697374558 + 24.06570982441908 * (JD - 2451545.0)
  const d = jd - 2451545.0;

  let gmstHours = 18.697374558 + 24.06570982441908 * d;
  gmstHours = ((gmstHours % 24) + 24) % 24;

  // ✅ IMPORTANT: East-positive longitude ADDS to GMST
  let lstHours = gmstHours + lonDegEast / 15;
  lstHours = ((lstHours % 24) + 24) % 24;

  return norm360(lstHours * 15); // degrees
}

