// FILE: src/server/astro-v2/houses.ts
import { norm360 } from "./math";
import { computeAscendant } from "./ascendant";
import { ayanamsaLahiriDegrees, toSiderealLon } from "./ayanamsa";
import { toUtcDate } from "./time";
import { julianDayUTC } from "./sidereal-time";
function jdFromUtcDate(d: Date): number {
  return d.getTime() / 86400000 + 2440587.5;
}

/**
 * GMST in degrees (0..360) from UTC JD
 * Standard approximation used widely in astronomy.
 */
function gmstDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const theta =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  return norm360(theta);
}

/**
 * Mean obliquity of the ecliptic (degrees)
 */
function meanObliquityDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const seconds =
    21.448 -
    46.8150 * T -
    0.00059 * T * T +
    0.001813 * T * T * T;
  return 23.0 + 26.0 / 60.0 + seconds / 3600.0;
}

function deg2rad(x: number) {
  return (x * Math.PI) / 180;
}
function rad2deg(x: number) {
  return (x * 180) / Math.PI;
}

/**
 * Tropical Ascendant longitude (degrees 0..360)
 */
function ascendantTropicalLon(jd: number, latDeg: number, lonDeg: number): number {
  // Local sidereal time in degrees
  const lst = norm360(gmstDeg(jd) + lonDeg);

  const eps = deg2rad(meanObliquityDeg(jd));
  const phi = deg2rad(latDeg);
  const theta = deg2rad(lst);

  // Formula: tan(λ) = (sinθ cosε − tanφ sinε) / cosθ
  const y = Math.sin(theta) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
  const x = Math.cos(theta);

  const lam = Math.atan2(y, x); // radians
  return norm360(rad2deg(lam));
}

export function computeHousesV2(whenISO: string, lat: number, lon: number) {
  const d = toUtcDate(whenISO);
  const jd = julianDayUTC(d);

   const ascTropical = computeAscendant(jd, lat, lon);
  const ayan = ayanamsaLahiriDegrees(d);

  // ✅ sidereal = tropical - ayan (once)
  const ascDeg = norm360(ascTropical - ayan);

  return { ascDeg };
}
