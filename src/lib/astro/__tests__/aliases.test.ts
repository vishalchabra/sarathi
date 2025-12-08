// Canonical planet IDs (sidereal): 0..8
export const CANON_IDS = {
  Sun: 0,
  Moon: 1,
  Mars: 2,
  Mercury: 3,
  Jupiter: 4,
  Venus: 5,
  Saturn: 6,
  Rahu: 7,
  Ketu: 8,
} as const;

export type CanonId = (typeof CANON_IDS)[keyof typeof CANON_IDS];

export const wrap360 = (x: number) => {
  let y = x % 360;
  return y < 0 ? y + 360 : y;
};

// Accepts any of: numeric keys, string names ("Sun"/"sun"),
// and legacy Rahu/Ketu as 10/11, plus "north node"/"south node".
const ALIASES: Record<number, Array<string | number>> = {
  0: ["Sun", "sun", "Su", "su", 0, "0"],
  1: ["Moon", "moon", "Mo", "mo", 1, "1"],
  2: ["Mars", "mars", "Ma", "ma", 2, "2"],
  3: ["Mercury", "mercury", "Me", "me", 3, "3"],
  4: ["Jupiter", "jupiter", "Ju", "ju", 4, "4"],
  5: ["Venus", "venus", "Ve", "ve", 5, "5"],
  6: ["Saturn", "saturn", "Sa", "sa", 6, "6"],
  7: ["Rahu", "rahu", "Ra", "ra", "true node", "north node", 7, "7", 10, "10"],
  8: ["Ketu", "ketu", "Ke", "ke", "south node", 8, "8", 11, "11"],
};

function readFirst(planets: any, keys: Array<string | number>) {
  if (!planets) return undefined;
  for (const k of keys) {
    if (k in planets && Number.isFinite(Number((planets as any)[k]))) {
      const v = Number((planets as any)[k]);
      if (Number.isFinite(v)) return wrap360(v);
    }
    if (typeof k === "string") {
      const kk = Object.keys(planets).find((p) => p.toLowerCase() === k.toLowerCase());
      if (kk && Number.isFinite(Number((planets as any)[kk]))) {
        const v = Number((planets as any)[kk]);
        if (Number.isFinite(v)) return wrap360(v);
      }
    }
  }
  return undefined;
}

/** Normalize arbitrary planets object to canonical numeric keys 0..8 (deg 0–360). */
export function normalizePlanets(planets: any): Record<number, number | undefined> {
  const out: Record<number, number | undefined> = {};
  for (const cid of Object.values(CANON_IDS)) {
    out[cid] = readFirst(planets, ALIASES[cid]);
  }

  // If only one node present, infer the other by ±180°
  if (Number.isFinite(out[CANON_IDS.Rahu]) && !Number.isFinite(out[CANON_IDS.Ketu])) {
    out[CANON_IDS.Ketu] = wrap360((out[CANON_IDS.Rahu] as number) + 180);
  }
  if (!Number.isFinite(out[CANON_IDS.Rahu]) && Number.isFinite(out[CANON_IDS.Ketu])) {
    out[CANON_IDS.Rahu] = wrap360((out[CANON_IDS.Ketu] as number) + 180);
  }

  return out;
}
