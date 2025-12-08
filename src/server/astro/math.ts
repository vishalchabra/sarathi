// src/server/astro/math.ts

// ---- Core math helpers ----

/** Clamp x to the inclusive range [lo, hi]. */
export function clamp(x: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, x));
}

/** Linear interpolation: a → b at fraction t (0..1). */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ---- Angle helpers for astrology modules ----

export const TAU = 360;

/** Wrap any angle to 0..360 degrees. */
export function wrap360(x: number) {
  const r = x % TAU;
  return r < 0 ? r + TAU : r;
}

/** Smallest angular distance between two angles in degrees (0..180). */
export function degDiff(a: number, b: number) {
  const d = Math.abs(wrap360(a) - wrap360(b)) % TAU;
  return d > 180 ? TAU - d : d;
}
