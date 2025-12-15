// FILE: src/server/astro/houses.ts
import "server-only";

export function wrap360(x: number): number {
  const v = x % 360;
  return v < 0 ? v + 360 : v;
}

/**
 * Whole Sign Houses (Sidereal):
 * - House 1 = Ascendant sign
 * - House depends only on planet sign vs asc sign
 */
export function getWholeSignHouse(planetDeg: number, ascDeg: number): number {
  const p = wrap360(planetDeg);
  const a = wrap360(ascDeg);

  const planetSign = Math.floor(p / 30); // 0..11
  const ascSign = Math.floor(a / 30); // 0..11

  return ((planetSign - ascSign + 12) % 12) + 1; // 1..12
}
