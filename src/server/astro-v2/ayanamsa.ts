import { norm360 } from "./math";

const AYAN_TWEAK_DEG = 0;

export function ayanamsaLahiriDegrees(when: string | Date): number {
  const d = when instanceof Date ? when : new Date(when);
  if (Number.isNaN(d.getTime())) return 0;

  const jd = d.getTime() / 86400000 + 2440587.5;
  const JD1900 = 2415020.0;
  const T = (jd - JD1900) / 36525;

  const ayan = 22.460148 + 1.396042 * T + 0.000308 * T * T;
  return ayan + AYAN_TWEAK_DEG;
}

export function toSiderealLon(tropicalLon: number, ayanamsaDeg: number): number {
  return norm360(tropicalLon - ayanamsaDeg);
}
