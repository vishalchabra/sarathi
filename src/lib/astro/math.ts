export function clamp(x: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, x));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
