// src/server/astro/aspects.ts

// ---------------------------
// WESTERN-STYLE ASPECTS (keep your original API)
// ---------------------------
export type PlanetLong = Record<string, number>; // planet -> ecliptic longitude 0..360

const BASE = [0, 60, 90, 120, 180] as const; // conj, sextile, square, trine, opposition
const ORB = 6; // degrees

function angle(a: number, b: number) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** Your existing function: detects conjunction/sextile/square/trine/opposition between any two planets. */
export function computeAspects(longitudes: PlanetLong) {
  const names = Object.keys(longitudes);
  const out: Array<{ from: string; to: string; type: string; orb: number }> = [];

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i], b = names[j];
      const ang = angle(longitudes[a], longitudes[b]);
      for (const base of BASE) {
        const dev = Math.abs(ang - base);
        if (dev <= ORB) {
          const type =
            base === 0   ? "conjunction" :
            base === 60  ? "sextile" :
            base === 90  ? "square" :
            base === 120 ? "trine" : "opposition";
          out.push({ from: a, to: b, type, orb: +dev.toFixed(2) });
          break;
        }
      }
    }
  }
  out.sort((x, y) => x.orb - y.orb);
  return out;
}

// ---------------------------
// VEDIC-STYLE ASPECTS (needed by sun.ts / moon.ts)
// ---------------------------

/** Minimal shape used by our Vedic aspect helpers. */
export type PlanetPos = { id: string; lon: number };

/** Vedic aspect kinds used in our packs. */
export type AspectKind = "7th" | "3rd" | "4th" | "5th" | "8th" | "9th" | "10th";
export type AspectHit = { from: string; kind: AspectKind };

const VEDIC_ORB = 6; // keep modest; you can tune per planet if you wish

/** Smallest angular distance 0..180 (same as angle(), but name matches usage) */
function degDiff(a: number, b: number) {
  return angle(a, b);
}

/**
 * Compute *onto a target planet* using standard Vedic rules:
 * - Everyone aspects 7th (~180°)
 * - Mars: also 4th (~90°) & 8th (~120°)
 * - Jupiter: also 5th (~150°) & 9th (~30°)
 * - Saturn: also 3rd (~60°) & 10th (~120°)
 */
function computeAspectsOnto(targetId: string, positions: PlanetPos[], orb = VEDIC_ORB): AspectHit[] {
  const target = positions.find(p => p.id === targetId);
  if (!target) return [];

  const out: AspectHit[] = [];
  const ALL = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Rahu","Ketu"] as const;

  function check(fromId: string, patterns: { deg: number; kind: AspectKind }[]) {
    const from = positions.find((p) => p.id === fromId);
const target = positions.find((p) => p.id === targetId);

if (!from || !target || from.id === targetId) return;

const sep = Math.round(degDiff(from.lon, target.lon)); // 0..180

    for (const pat of patterns) {
      if (Math.abs(sep - pat.deg) <= orb) out.push({ from: fromId, kind: pat.kind });
    }
  }

  // everyone 7th
  for (const id of ALL) check(id, [{ deg: 180, kind: "7th" }]);

  // special aspects
  check("Mars",    [{ deg:  90, kind: "4th" }, { deg: 120, kind: "8th" }]);
  check("Jupiter", [{ deg: 150, kind: "5th" }, { deg:  30, kind: "9th" }]); // +7th already added
  check("Saturn",  [{ deg:  60, kind: "3rd" }, { deg: 120, kind: "10th" }]); // +7th already added

  // de-dup (e.g., if same aspect caught twice)
  const seen = new Set<string>();
  return out.filter(a => {
    const k = `${a.from}-${a.kind}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Public helpers used by your planet modules */
export function aspectsOntoSun(positions: PlanetPos[], orb = VEDIC_ORB): AspectHit[] {
  return computeAspectsOnto("Sun", positions, orb);
}

export function aspectsOntoMoon(positions: PlanetPos[], orb = VEDIC_ORB): AspectHit[] {
  return computeAspectsOnto("Moon", positions, orb);
}

/** Optional generic for any target if you need later */
export function aspectsOnto(targetId: string, positions: PlanetPos[], orb = VEDIC_ORB): AspectHit[] {
  return computeAspectsOnto(targetId, positions, orb);
}
