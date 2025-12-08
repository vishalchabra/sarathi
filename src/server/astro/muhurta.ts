import type { Panchang } from "@/lib/types";

// HH:MM -> minutes
const toMin = (s?: string) => {
  if (!s) return null;
  const [h, m] = s.split(":").map((n) => parseInt(n, 10));
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};
const fmt = (x: number) =>
  `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
const fmtRange = (a: number, b: number) => `${fmt(a)}–${fmt(b)}`;
const overlaps = (a: [number, number], b: [number, number]) => !(a[1] <= b[0] || b[1] <= a[0]);

export function extractBlocks(p: Panchang | null) {
  if (!p) return null;
  const sun = { start: toMin(p.sun?.sunrise), end: toMin(p.sun?.sunset) };
  if (sun.start == null || sun.end == null || sun.end <= sun.start) return null;

  const ab = p.muhurtas?.abhijit
    ? { start: toMin(p.muhurtas.abhijit.start), end: toMin(p.muhurtas.abhijit.end) }
    : null;
  const rah = p.kaal?.rahu ? { start: toMin(p.kaal.rahu.start), end: toMin(p.kaal.rahu.end) } : null;
  const gul = p.kaal?.gulika ? { start: toMin(p.kaal.gulika.start), end: toMin(p.kaal.gulika.end) } : null;
  const yam = p.kaal?.yamagandam
    ? { start: toMin(p.kaal.yamagandam.start), end: toMin(p.kaal.yamagandam.end) }
    : null;

  const avoid: Array<[number, number]> = [];
  for (const blk of [rah, gul, yam]) {
    if (blk?.start != null && blk.end != null && blk.end > blk.start) avoid.push([blk.start, blk.end]);
  }

  return { sun, ab, avoid };
}

/** Return safe free slots between sunrise/sunset excluding avoid blocks. */
export function safeSlots(p: Panchang | null, minMinutes = 45): string[] {
  const b = extractBlocks(p);
  if (!b) return [];
  const { sun, avoid } = b;
  const blocks = [...avoid].sort((x, y) => x[0] - y[0]);
  const out: [number, number][] = [];
  let cur = sun.start;
  for (const [a, e] of blocks) {
    if (a > cur && a - cur >= minMinutes) out.push([cur, a]);
    cur = Math.max(cur, e);
  }
  if (sun.end > cur && sun.end - cur >= minMinutes) out.push([cur, sun.end]);
  return out.map(([a, e]) => fmtRange(a, e));
}

/** Is Abhijit usable (i.e., doesn’t overlap any avoid block)? */
export function isAbhijitClean(p: Panchang | null): boolean {
  const b = extractBlocks(p);
  if (!b || !b.ab) return false;
  const { ab, avoid } = b;
  if (ab.start == null || ab.end == null || ab.end <= ab.start) return false;
  return !avoid.some((blk) => overlaps([ab.start!, ab.end!], blk));
}

/** Pick the best slot (prefer clean Abhijit; else the first safe slot near midday). */
export function pickBestSlotForDecision(p: Panchang | null): { start: string; end: string; why: string } | null {
  const b = extractBlocks(p);
  if (!b) return null;
  const { ab } = b;
  if (isAbhijitClean(p) && ab?.start != null && ab.end != null) {
    return { start: fmt(ab.start), end: fmt(ab.end), why: "Abhijit muhurta (clean)" };
  }
  const slots = safeSlots(p, 60);
  if (!slots.length) return null;

  // Choose slot closest to midday
  const sun = b.sun;
  const midday = Math.floor((sun.start + sun.end) / 2);
  let best = slots[0], bestDiff = Infinity;
  for (const s of slots) {
    const [a, e] = s.split("–").map(toMin) as [number, number];
    const mid = Math.floor((a + e) / 2);
    const diff = Math.abs(midday - mid);
    if (diff < bestDiff) { best = s; bestDiff = diff; }
  }
  const [a, e] = best.split("–");
  return { start: a, end: e, why: "Clean daytime slot (avoids Rahu/Gulika/Yamagandam)" };
}
