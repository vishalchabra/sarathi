// src/lib/astro-helpers.ts

// 27 nakshatras in order (sidereal). Each = 13°20' = 13.333333333...°
export const NAKSHATRAS = [
  "Aśvinī","Bharanī","Kṛttikā","Rohiṇī","Mṛgaśīrṣa","Ārdrā","Punarvasu","Puṣya","Āśleṣā",
  "Maghā","Pūrvaphalgunī","Uttaraphalgunī","Hasta","Chitrā","Svātī","Viśākhā","Anurādhā",
  "Jyeṣṭhā","Mūlā","Pūrvāṣāḍhā","Uttarāṣāḍhā","Śravaṇa","Dhaniṣṭhā","Śatabhiṣā",
  "Pūrvabhādrapadā","Uttarabhādrapadā","Revatī"
];
// Equal-house from ascendant absolute degree
export function houseFromAsc(ascAbsDeg: number, bodyAbsDeg: number) {
  const d = norm360(bodyAbsDeg - ascAbsDeg);      // 0..360 ahead of Asc
  return Math.floor(d / 30) + 1;                  // 1..12
}
export const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const NAK_SPAN = 360 / 27;       // 13.3333333333...
const PADA_SPAN = NAK_SPAN / 4;  // 3.3333333333...

/** normalize any degree to [0,360) */
export function norm360(deg: number) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/** 0..360 sidereal degrees -> nakshatra name */
export function nakshatraFromDegree(deg: number) {
  const d = norm360(deg);
  const idx = Math.floor(d / NAK_SPAN); // 0..26
  return NAKSHATRAS[idx];
}

/** 0..360 sidereal degrees -> pada 1..4 */
export function padaFromDegree(deg: number): 1|2|3|4 {
  const d = norm360(deg);
  const withinNak = d % NAK_SPAN;
  const p = Math.floor(withinNak / PADA_SPAN) + 1; // 1..4
  return (p as 1|2|3|4);
}

/** 0..360 sidereal degrees -> sign name */
export function signFromDegree(deg: number) {
  const d = norm360(deg);
  return SIGNS[Math.floor(d / 30)];
}

/** sign + degree-in-sign -> absolute 0..360 */
export function absoluteFromSign(sign: string, degreeInSign: number) {
  const idx = SIGNS.indexOf(sign);
  const base = idx >= 0 ? idx * 30 : 0;
  return norm360(base + degreeInSign);
}
// --- Navamsa (D9) helpers -----------------------------------------------

/** Return the sign index (0..11) for Navāṁśa from an absolute sidereal degree (0..360). */
export function navamsaSignIndexFromDegree(absDeg: number) {
  const d = norm360(absDeg);
  const signIndex = Math.floor(d / 30);         // base rāśi sign 0..11
  const degInSign = d % 30;                     // 0..30
  const padaIndex = Math.floor(degInSign / (30 / 9)); // 0..8 (each 3°20')

  // Group: movable(0,3,6,9) / fixed(1,4,7,10) / dual(2,5,8,11)
  const group = signIndex % 3;
  // Start sign for D9 sequence:
  // movable → same sign; fixed → 9th from it; dual → 5th from it
  const start =
    group === 0 ? signIndex :            // movable
    group === 1 ? (signIndex + 8) % 12 : // fixed
                  (signIndex + 4) % 12;  // dual

  return (start + padaIndex) % 12;
}

/** Return the Navāṁśa sign name from absolute degree. */
export function navamsaSignFromDegree(absDeg: number) {
  return SIGNS[navamsaSignIndexFromDegree(absDeg)];
}
// ---------- Generic Varga helpers (D3, D7, D9, D10, D12) ----------

/** Index of the rāśi (0..11) from an absolute sidereal degree. */
export function rasiIndex(absDeg: number) {
  return Math.floor(norm360(absDeg) / 30) % 12;
}

/** Degree inside the current sign (0..30). */
export function degreeInSign(absDeg: number) {
  const d = norm360(absDeg);
  return d % 30;
}

/** Return the rāśi index (0..11) for a given varga N, using common Parāśari rules. */
export function vargaSignIndexFromDegree(absDeg: number, N: number) {
  const rasi = rasiIndex(absDeg);
  const degIn = degreeInSign(absDeg);

  // Parts-per-sign and which subdivision (0-based)
  const part = 30 / N;                     // e.g. D9 -> 3°20'
  const k = Math.floor(degIn / part);      // 0..N-1

  const movable = rasi % 3 === 0; // 0,3,6,9
  const fixed   = rasi % 3 === 1; // 1,4,7,10
  const dual    = rasi % 3 === 2; // 2,5,8,11
  const oddSign = rasi % 2 === 0; // Aries=0 is odd (masculine)

  // Specific canonical rules:
  switch (N) {
    case 3: { // Drekkana
      // Odd signs: self, 5th, 9th; Even signs: 9th, self, 5th
      const seqOdd  = [0, 4, 8];
      const seqEven = [8, 0, 4];
      const base = oddSign ? seqOdd[k] : seqEven[k];
      return (rasi + base) % 12;
    }
    case 7: { // Saptāṁśa
      // Odd signs start from Aries; even signs start from Libra
      const start = oddSign ? 0 : 6;
      return (start + k) % 12;
    }
    case 9: { // Navāṁśa (same rule you already used)
      const start = movable ? rasi : fixed ? (rasi + 8) % 12 : (rasi + 4) % 12;
      return (start + k) % 12;
    }
    case 10: { // Daśāṁśa
      // Movable start Aries(0), Fixed start Leo(4), Dual start Sagittarius(8)
      const start = movable ? 0 : fixed ? 4 : 8;
      return (start + k) % 12;
    }
    case 12: { // Dvādaśāṁśa
      // Odd signs start from the same sign; even signs start from the 9th
      const start = oddSign ? rasi : (rasi + 8) % 12;
      return (start + k) % 12;
    }
    default: {
      // Simple fallback: start at the sign itself and step forward
      return (rasi + k) % 12;
    }
  }
}

/** Convenience: return rāśi name for the given varga N from an absolute degree. */
export function vargaSignFromDegree(absDeg: number, N: number) {
  return SIGNS[vargaSignIndexFromDegree(absDeg, N)];
}
