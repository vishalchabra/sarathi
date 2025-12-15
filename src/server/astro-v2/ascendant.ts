// FILE: src/server/astro-v2/ascendant.ts
import { localSiderealTime } from "./sidereal-time";
import { norm360 } from "./math";
import { astroDebug } from "@/server/astro/debug";
function degToRad(d: number) {
  return (d * Math.PI) / 180;
}
function radToDeg(r: number) {
  return (r * 180) / Math.PI;
}

/**
 * Mean obliquity of the ecliptic (deg)
 * Simple/robust approximation good enough for asc calculations
 */
function meanObliquityDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // arcseconds
  const sec =
    84381.448 -
    46.8150 * T -
    0.00059 * T * T +
    0.001813 * T * T * T;
  return sec / 3600.0;
}

/**
 * Ascendant (tropical ecliptic longitude) in degrees 0..360
 * lonDegEast MUST be East-positive
 */



export function computeAscendant(jdUt: number, latDeg: number, lonDegEast: number): number {
  const thetaDeg = localSiderealTime(jdUt, lonDegEast); // degrees 0..360
  const epsDeg = meanObliquityDeg(jdUt);

  const theta = degToRad(thetaDeg);
  const phi = degToRad(latDeg);
  const eps = degToRad(epsDeg);

    // ✅ Standard Ascendant formula (robust):
  // λ_asc = atan2( -cosθ, sinθ*cosε + tanφ*sinε )
  const y = -Math.cos(theta);
  const x = Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);

  let ascTropical = norm360(radToDeg(Math.atan2(y, x)));

  // 🔒 Fix the common 180° ambiguity:
  // Ascendant should correspond to the eastern horizon.
  // A simple and effective correction is to ensure it lies in the correct quadrant
  // relative to local sidereal time (thetaDeg).
  const diff = norm360(ascTropical - thetaDeg);
  if (diff > 180) {
    ascTropical = norm360(ascTropical + 180);
  }
 astroDebug("[ASC V2] computeAscendant CALLED");
  astroDebug("[ASC V2]", {
  jdUt,
  latDeg,
  lonDegEast,
  thetaDeg,
  epsDeg,
  ascTropical,
});

  return ascTropical;
}
