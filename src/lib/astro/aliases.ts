// Centralized planet IDs + helpers
// ---------------------------------------------------------

export const CANON_IDS = {
  Sun: 0,
  Moon: 1,
  Mercury: 2,
  Venus: 3,
  Mars: 4,
  Jupiter: 5,
  Saturn: 6,
  Rahu: 7, // True/North node
  Ketu: 8, // South node (always opposite Rahu)
} as const;

export type PlanetKey = keyof typeof CANON_IDS;
export type CanonId = (typeof CANON_IDS)[PlanetKey];

// Many feeds use different keys for nodes; accept generous aliases.
export const PLANET_ALIASES: Record<PlanetKey, Array<string | number>> = {
  Sun:     ["Sun", "sun", "Su", "su", CANON_IDS.Sun, 0],
  Moon:    ["Moon", "moon", "Mo", "mo", CANON_IDS.Moon, 1],
  Mercury: ["Mercury", "mercury", "Me", "me", CANON_IDS.Mercury, 2],
  Venus:   ["Venus", "venus", "Ve", "ve", CANON_IDS.Venus, 3],
  Mars:    ["Mars", "mars", "Ma", "ma", CANON_IDS.Mars, 4],
  Jupiter: ["Jupiter", "jupiter", "Ju", "ju", CANON_IDS.Jupiter, 5],
  Saturn:  ["Saturn", "saturn", "Sa", "sa", CANON_IDS.Saturn, 6],
  Rahu: [
    "Rahu", "rahu", "Ra", "ra", "true node", "True Node", "north node", "North Node",
    CANON_IDS.Rahu, 10, 11 // tolerate mean/true node numeric ids from some feeds
  ],
  Ketu: [
    "Ketu", "ketu", "Ke", "ke", "south node", "South Node",
    CANON_IDS.Ketu, 10, 11
  ],
};

// ---------- small numeric helpers ----------
export const wrap360 = (x: number) => ((x % 360) + 360) % 360;

export const degDiff = (a: number, b: number) => {
  const d = Math.abs(wrap360(a) - wrap360(b));
  return d > 180 ? 360 - d : d;
};

export const isOpposite = (a: number, b: number, tol = 1) =>
  degDiff(a, wrap360(b + 180)) <= tol;

const isFiniteNumber = (v: any): v is number =>
  typeof v === "number" && Number.isFinite(v);

// ---------- core readers ----------
/** Resolve a degree value from any planets map using aliases (case-insensitive). */
export function getPlanetDeg(
  planets: Record<string | number, unknown>,
  planet: PlanetKey
): number | undefined {
  if (!planets) return undefined;

  for (const key of PLANET_ALIASES[planet]) {
    // exact numeric key
    if (typeof key === "number" && isFiniteNumber((planets as any)[key])) {
      return Number((planets as any)[key]);
    }
    // string key (exact or case-insensitive)
    if (typeof key === "string") {
      if (isFiniteNumber((planets as any)[key])) return Number((planets as any)[key]);
      const matchKey = Object.keys(planets).find(
        (k) => k.toLowerCase() === key.toLowerCase()
      );
      if (matchKey && isFiniteNumber((planets as any)[matchKey])) {
        return Number((planets as any)[matchKey]);
      }
    }
  }
  return undefined;
}

/**
 * Normalize an incoming planets map to canonical IDs 0..8.
 * - Reads any alias (string/numeric)
 * - If only one node is present, derives the other at +180°
 * - If both nodes present but not opposite, trust Rahu and derive Ketu from Rahu
 * - Returns a new object (does not mutate input)
 */
export function normalizePlanets(
  planets: Record<string | number, unknown>
): Record<CanonId, number> {
  const out: Partial<Record<CanonId, number>> = {};

  // Read classical planets
  (Object.keys(CANON_IDS) as PlanetKey[]).forEach((pk) => {
    if (pk === "Rahu" || pk === "Ketu") return;
    const deg = getPlanetDeg(planets, pk);
    if (isFiniteNumber(deg)) out[CANON_IDS[pk]] = wrap360(deg);
  });

  // Nodes
  let rahu = getPlanetDeg(planets, "Rahu");
  let ketu = getPlanetDeg(planets, "Ketu");

  if (isFiniteNumber(rahu) && !isFiniteNumber(ketu)) {
    ketu = wrap360(rahu + 180);
  } else if (!isFiniteNumber(rahu) && isFiniteNumber(ketu)) {
    rahu = wrap360(ketu + 180);
  } else if (isFiniteNumber(rahu) && isFiniteNumber(ketu)) {
    if (!isOpposite(rahu, ketu, 6)) {
      // keep internal consistency
      ketu = wrap360(rahu + 180);
    }
  }

  if (isFiniteNumber(rahu)) out[CANON_IDS.Rahu] = wrap360(rahu);
  if (isFiniteNumber(ketu)) out[CANON_IDS.Ketu] = wrap360(ketu);

  return out as Record<CanonId, number>;
}
