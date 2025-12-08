// FILE: src/server/astro/fusion.ts

// Light version of a transit hit; should align with /api/transits
export type FusionTransitHit = {
  id: string;
  startISO: string;
  endISO: string;
  planet: string;
  target: string;
  category: "career" | "relationships" | "health" | "inner" | "general";
  strength: number; // 0–1
  title: string;
  description: string;
};

export type FusionDashaNode = {
  lord?: string | null;
  label?: string | null;
  level?: string | null; // "MD" | "AD" | "PD" | etc.
  startISO?: string | null;
  endISO?: string | null;
};

export type FusionCategoryKey = "career" | "relationships" | "health" | "inner";

export type FusionCategoryFacts = {
  key: FusionCategoryKey;
  score: number;          // 0–1 normalized
  mdWeight: number;       // raw MD emphasis
  adWeight: number;       // raw AD emphasis
  pdWeight: number;       // raw PD emphasis
  transitImpact: number;  // raw transit impact
  topTransits: FusionTransitHit[]; // most relevant windows for this category
};

export type FusionFacts = {
  mdLord: string | null;
  adLord: string | null;
  pdLord: string | null;
  categories: FusionCategoryFacts[];
};

/* ------------------------------------------------------------------ */
/*  PUBLIC ENTRY POINT                                                */
/* ------------------------------------------------------------------ */

export function computeFusionFacts(input: {
  md?: FusionDashaNode | null;
  ad?: FusionDashaNode | null;
  pd?: FusionDashaNode | null;
  transits: FusionTransitHit[];
}): FusionFacts {
  const mdLord = cleanPlanetName(planetFromNode(input.md));
  const adLord = cleanPlanetName(planetFromNode(input.ad));
  const pdLord = cleanPlanetName(planetFromNode(input.pd));

  const baseMD = baseWeightsForMD(mdLord);
  const modAD = modifierWeightsForAD(adLord);
  const modPD = modifierWeightsForPD(pdLord);

  // Apply modifiers to MD weights
  const combined = combineWeights(baseMD, modAD, modPD);

  // Transit impacts
  const transitImpact = computeTransitImpact(input.transits);

  // Combine everything into per-category scores
  const cats: FusionCategoryKey[] = ["career", "relationships", "health", "inner"];
  const rawScores: Record<FusionCategoryKey, number> = {
    career: 0,
    relationships: 0,
    health: 0,
    inner: 0,
  };

  for (const k of cats) {
    const w = combined[k];
    const tr = transitImpact.impacts[k];
    // Simple blending formula; we can refine later
    rawScores[k] = w.md * 0.6 + w.ad * 0.25 + w.pd * 0.15 + tr * 0.5;
  }

  const normalized = normalizeScores(rawScores);

  const categories: FusionCategoryFacts[] = cats.map((k) => ({
    key: k,
    score: normalized[k],
    mdWeight: combined[k].md,
    adWeight: combined[k].ad,
    pdWeight: combined[k].pd,
    transitImpact: transitImpact.impacts[k],
    topTransits: transitImpact.topByCategory[k],
  }));

  return {
    mdLord,
    adLord,
    pdLord,
    categories,
  };
}

/* ------------------------------------------------------------------ */
/*  HELPERS: PLANET NAMES & BASE WEIGHTS                              */
/* ------------------------------------------------------------------ */

function planetFromNode(node?: FusionDashaNode | null): string | null {
  if (!node) return null;

  const anyNode = node as any;

  // 1) Try common explicit fields
  if (typeof anyNode.lord === "string") return anyNode.lord;
  if (typeof anyNode.planet === "string") return anyNode.planet;
  if (typeof anyNode.dashaLord === "string") return anyNode.dashaLord;
  if (typeof anyNode.name === "string") return anyNode.name;
  if (typeof node.label === "string") {
    const m = node.label.match(
      /(ketu|venus|sun|moon|mars|rahu|jupiter|saturn|mercury)/i
    );
    if (m) return m[1];
  }

  // 2) Fallback: scan all string fields for a planet name
  const strings: string[] = [];
  for (const key of Object.keys(anyNode)) {
    const val = anyNode[key];
    if (typeof val === "string") {
      strings.push(val);
    }
  }

  if (strings.length > 0) {
    const joined = strings.join(" ").toLowerCase();
    const m = joined.match(
      /(ketu|venus|sun|moon|mars|rahu|jupiter|saturn|mercury)/
    );
    if (m) return m[1];
  }

  return null;
}


function cleanPlanetName(raw: string | null): string | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  if (s.includes("sun")) return "sun";
  if (s.includes("moon")) return "moon";
  if (s.includes("mars")) return "mars";
  if (s.includes("mercury")) return "mercury";
  if (s.includes("jupiter")) return "jupiter";
  if (s.includes("venus")) return "venus";
  if (s.includes("saturn")) return "saturn";
  if (s.includes("rahu")) return "rahu";
  if (s.includes("ketu")) return "ketu";
  return s;
}

type WeightMap = Record<FusionCategoryKey, number>;

type CombinedWeightMap = Record<
  FusionCategoryKey,
  { md: number; ad: number; pd: number }
>;

// Very approximate but structured MD emphasis per category
function baseWeightsForMD(md: string | null): WeightMap {
  const def: WeightMap = {
    career: 0.4,
    relationships: 0.4,
    health: 0.4,
    inner: 0.4,
  };

  switch (md) {
    case "sun":
      return { career: 0.8, relationships: 0.3, health: 0.4, inner: 0.6 };
    case "moon":
      return { career: 0.4, relationships: 0.7, health: 0.6, inner: 0.6 };
    case "mars":
      return { career: 0.7, relationships: 0.3, health: 0.6, inner: 0.3 };
    case "mercury":
      return { career: 0.6, relationships: 0.4, health: 0.4, inner: 0.4 };
    case "jupiter":
      return { career: 0.6, relationships: 0.6, health: 0.5, inner: 0.8 };
    case "venus":
      return { career: 0.5, relationships: 0.8, health: 0.4, inner: 0.6 };
    case "saturn":
      return { career: 0.7, relationships: 0.4, health: 0.7, inner: 0.7 };
    case "rahu":
      return { career: 0.8, relationships: 0.5, health: 0.4, inner: 0.6 };
    case "ketu":
      return { career: 0.3, relationships: 0.4, health: 0.5, inner: 0.9 };
    default:
      return def;
  }
}

// AD modifies MD emphasis slightly
function modifierWeightsForAD(ad: string | null): WeightMap {
  const zero: WeightMap = {
    career: 0,
    relationships: 0,
    health: 0,
    inner: 0,
  };
  switch (ad) {
    case "sun":
      return { career: 0.2, relationships: -0.05, health: 0, inner: 0.1 };
    case "moon":
      return { career: -0.05, relationships: 0.2, health: 0.15, inner: 0.15 };
    case "mars":
      return { career: 0.2, relationships: -0.05, health: 0.15, inner: -0.05 };
    case "mercury":
      return { career: 0.15, relationships: 0.05, health: 0, inner: 0 };
    case "jupiter":
      return { career: 0.15, relationships: 0.15, health: 0.05, inner: 0.2 };
    case "venus":
      return { career: 0.05, relationships: 0.25, health: 0, inner: 0.1 };
    case "saturn":
      return { career: 0.2, relationships: -0.05, health: 0.2, inner: 0.2 };
    case "rahu":
      return { career: 0.25, relationships: 0.05, health: -0.05, inner: 0.1 };
    case "ketu":
      return { career: -0.05, relationships: -0.05, health: 0.05, inner: 0.3 };
    default:
      return zero;
  }
}

// PD: emotional / short-term flavour
function modifierWeightsForPD(pd: string | null): WeightMap {
  const zero: WeightMap = {
    career: 0,
    relationships: 0,
    health: 0,
    inner: 0,
  };
  switch (pd) {
    case "sun":
      return { career: 0.1, relationships: -0.02, health: 0, inner: 0.05 };
    case "moon":
      return { career: 0, relationships: 0.1, health: 0.1, inner: 0.1 };
    case "mars":
      return { career: 0.1, relationships: -0.02, health: 0.1, inner: -0.02 };
    case "mercury":
      return { career: 0.08, relationships: 0.05, health: 0, inner: 0.02 };
    case "jupiter":
      return { career: 0.08, relationships: 0.08, health: 0.02, inner: 0.1 };
    case "venus":
      return { career: 0.02, relationships: 0.12, health: 0, inner: 0.06 };
    case "saturn":
      return { career: 0.1, relationships: -0.02, health: 0.1, inner: 0.1 };
    case "rahu":
      return { career: 0.12, relationships: 0.02, health: -0.02, inner: 0.06 };
    case "ketu":
      return { career: -0.02, relationships: -0.02, health: 0.02, inner: 0.12 };
    default:
      return zero;
  }
}

function combineWeights(
  md: WeightMap,
  adMod: WeightMap,
  pdMod: WeightMap
): Record<FusionCategoryKey, { md: number; ad: number; pd: number }> {
  const cats: FusionCategoryKey[] = ["career", "relationships", "health", "inner"];
  const out: CombinedWeightMap = {
    career: { md: 0, ad: 0, pd: 0 },
    relationships: { md: 0, ad: 0, pd: 0 },
    health: { md: 0, ad: 0, pd: 0 },
    inner: { md: 0, ad: 0, pd: 0 },
  };
  for (const k of cats) {
    const mdW = clamp01(md[k]);
    const adW = clamp01(mdW + adMod[k]) - mdW;
    const pdW = clamp01(mdW + adMod[k] + pdMod[k]) - (mdW + adMod[k]);
    out[k] = { md: mdW, ad: mdW + adW, pd: mdW + adW + pdW };
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  TRANSIT IMPACT                                                    */
/* ------------------------------------------------------------------ */

type TransitImpact = {
  impacts: Record<FusionCategoryKey, number>;
  topByCategory: Record<FusionCategoryKey, FusionTransitHit[]>;
};

function computeTransitImpact(transits: FusionTransitHit[]): TransitImpact {
  const impacts: Record<FusionCategoryKey, number> = {
    career: 0,
    relationships: 0,
    health: 0,
    inner: 0,
  };

  const byCategory: Record<FusionCategoryKey, FusionTransitHit[]> = {
    career: [],
    relationships: [],
    health: [],
    inner: [],
  };

  for (const t of transits) {
    const planet = cleanPlanetName(t.planet) ?? "";
    const baseStrength = clamp01(t.strength || 0.5);
    const cats: FusionCategoryKey[] = ["career", "relationships", "health", "inner"];

    for (const cat of cats) {
      let weight = 0.2; // base
      if (t.category === cat) weight += 0.5;

      // Planet-specific boosts
      weight += planetCategoryBoost(planet, cat);

      const impact = baseStrength * weight;

      impacts[cat] += impact;

      // Keep transits attached loosely to their "main" category
      if (t.category === cat) {
        byCategory[cat].push(t);
      }
    }
  }

  // Normalize impacts a bit
  const maxImpact = Math.max(
    0.0001,
    impacts.career,
    impacts.relationships,
    impacts.health,
    impacts.inner
  );

  const norm: Record<FusionCategoryKey, number> = {
    career: clamp01(impacts.career / maxImpact),
    relationships: clamp01(impacts.relationships / maxImpact),
    health: clamp01(impacts.health / maxImpact),
    inner: clamp01(impacts.inner / maxImpact),
  };

  // Limit top transits per category
  const topByCategory: Record<FusionCategoryKey, FusionTransitHit[]> = {
    career: byCategory.career.slice(0, 3),
    relationships: byCategory.relationships.slice(0, 3),
    health: byCategory.health.slice(0, 3),
    inner: byCategory.inner.slice(0, 3),
  };

  return { impacts: norm, topByCategory };
}

function planetCategoryBoost(
  planet: string,
  cat: FusionCategoryKey
): number {
  switch (planet) {
    case "jupiter":
      if (cat === "career" || cat === "relationships" || cat === "inner") return 0.3;
      return 0.1;
    case "saturn":
      if (cat === "career" || cat === "health" || cat === "inner") return 0.3;
      return 0.05;
    case "mars":
      if (cat === "career" || cat === "health") return 0.25;
      return 0.05;
    case "venus":
      if (cat === "relationships") return 0.35;
      return 0.05;
    case "mercury":
      if (cat === "career" || cat === "relationships") return 0.2;
      return 0.05;
    case "rahu":
      if (cat === "career" || cat === "inner") return 0.25;
      return 0.05;
    case "ketu":
      if (cat === "inner") return 0.3;
      return 0.05;
    case "moon":
      if (cat === "relationships" || cat === "inner") return 0.2;
      return 0.05;
    default:
      return 0.05;
  }
}

/* ------------------------------------------------------------------ */
/*  NORMALIZATION                                                     */
/* ------------------------------------------------------------------ */

function normalizeScores(
  raw: Record<FusionCategoryKey, number>
): Record<FusionCategoryKey, number> {
  const vals = Object.values(raw);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const out: Record<FusionCategoryKey, number> = {
    career: 0,
    relationships: 0,
    health: 0,
    inner: 0,
  };

  (["career", "relationships", "health", "inner"] as FusionCategoryKey[]).forEach(
    (k) => {
      const norm = (raw[k] - min) / range;
      // Map to [0.3, 1] so nothing is "zero"
      out[k] = clamp01(0.3 + 0.7 * norm);
    }
  );

  return out;
}

function clamp01(x: number): number {
  if (!isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
