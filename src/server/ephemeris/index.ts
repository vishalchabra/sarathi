import type { TransitSample } from "@/server/qa/transit";

const DAY = 86400000;
const iso = (d: Date) => d.toISOString().slice(0, 10);
const wrap = (deg: number) => ((deg % 360) + 360) % 360;
export type Birth = { dateISO: string; time: string; tz: string; lat: number; lon: number };

function hashBirth(b: Birth) {
  const s = `${b.dateISO}|${b.time}|${b.tz}|${b.lat}|${b.lon}`;
  let h = 0 >>> 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}

/**
 * Minimal natal stub for development.
 * Returns stable-but-fake degrees so transit logic can run.
 * Swap this with your real Swiss Ephemeris implementation later.
 */
export async function getNatal(birth: Birth) {
  const base = hashBirth(birth);          // 0..359
  const lagnaDeg = wrap(base * 1.07);     // faux Ascendant
  const moonDeg  = wrap(base * 2.23 + 13); // faux Moon
  const mc10Deg  = wrap(lagnaDeg + 90);   // simple MC ≈ Asc + 90°
  // crude "10th lord" proxy: pick sign of MC and park at its center
  const sign = Math.floor(mc10Deg / 30);           // 0..11
  const lord10Deg = wrap(sign * 30 + 15);          // mid-sign as placeholder

  return {
    lagnaDeg,
    moonDeg,
    mc10Deg,
    lord10Deg,
    d10: {
      lagnaDeg: wrap(lagnaDeg * 10),
      lordDeg:  wrap(lord10Deg * 10),
    },
  };
}
// same nakshatra math as in transit.ts (so labels match)
const N_NAMES = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati",
] as const;
function nak(deg: number) {
  const span = 360 / 27;
  const slot = wrap(deg);
  const idx = Math.floor(slot / span);
  const within = slot - idx * span;
  const pada = (Math.floor(within / (span / 4)) + 1) as 1|2|3|4;
  return { name: N_NAMES[idx], pada };
}

// TODO: swap this with your real ephemeris calls.
export async function getTransitsDaily(fromISO: string, toISO: string): Promise<TransitSample[]> {
  const start = new Date(fromISO);
  const end = new Date(toISO);
  if (!(+start) || !(+end) || start > end) return [];

  // deterministic seed for stable dev behavior
  const seed = new Date(fromISO).getUTCFullYear() % 360;

  const out: TransitSample[] = [];
  for (let t = +start, i = 0; t <= +end; t += DAY, i++) {
    // plausible daily “speeds” (not astronomical accuracy)
    const j = wrap(seed + i * 0.083);       // Jupiter ~12y
    const s = wrap(seed + 180 + i * 0.033); // Saturn ~30y
    const v = wrap(seed + 40 + i * 1.2);    // Venus fast
    const m = wrap(seed + 20 + i * 1.0);    // Mercury avg
    const moon = wrap(seed + i * 13.176);   // Moon

    out.push({
      dateISO: iso(new Date(t)),
      Jup:  { deg: j, retro: false },
      Sat:  { deg: s, retro: false },
      Ven:  { deg: v, retro: false },
      Mer:  { deg: m, retro: (i % 40) < 10 }, // sometimes retro
      Moon: { deg: moon },
      nakshatras: { Moon: nak(moon) },
    });
  }
  return out;
}
