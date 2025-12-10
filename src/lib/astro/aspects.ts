// src/lib/astro/aspects.ts
export type PlanetName =
  | "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";

export type PlanetLoc = { planet: string; house: number; deg?: number };

export type AspectHouseEdge = {
  from: PlanetName; fromHouse: number;
  toHouse: number; kind: "7th" | "3rd" | "4th" | "5th" | "8th" | "9th" | "10th";
};

export type AspectPlanetEdge = AspectHouseEdge & {
  to?: PlanetName; // filled when a planet sits in the target house
};

const wrap12 = (n: number) => ((n - 1 + 12) % 12) + 1; // keep 1..12

const OFFSETS: Record<PlanetName, { k: number; label: AspectHouseEdge["kind"] }[]> = {
  Sun:     [{ k: 6, label: "7th" }],
  Moon:    [{ k: 6, label: "7th" }],
  Mercury: [{ k: 6, label: "7th" }],
  Venus:   [{ k: 6, label: "7th" }],
  Mars:    [{ k: 3, label: "4th" }, { k: 6, label: "7th" }, { k: 7, label: "8th" }],
  Jupiter: [{ k: 4, label: "5th" }, { k: 6, label: "7th" }, { k: 8, label: "9th" }],
  Saturn:  [{ k: 2, label: "3rd" }, { k: 6, label: "7th" }, { k: 9, label: "10th" }],
  Rahu:    [{ k: 4, label: "5th" }, { k: 6, label: "7th" }, { k: 8, label: "9th" }],
  Ketu:    [{ k: 4, label: "5th" }, { k: 6, label: "7th" }, { k: 8, label: "9th" }],
};



export function computeHouseAspects(planets: PlanetLoc[]): AspectHouseEdge[] {
  const edges: AspectHouseEdge[] = [];
  for (const p of planets) {
    const name = normalizePlanetName(p.planet);
    const house = Number(p.house);
    if (!name || !Number.isFinite(house)) continue;

    const rules = OFFSETS[name] || [];
    for (const rule of rules) {
      edges.push({
        from: name,
        fromHouse: house,
        toHouse: wrap12(house + rule.k),
        kind: rule.label,
      });
    }
  }
  return edges;
}

export function computePlanetAspects(planets: PlanetLoc[]): AspectPlanetEdge[] {
  const byHouse = new Map<number, string[]>(); // store normalized names

  for (const p of planets) {
    const name = normalizePlanetName(p.planet);
    const house = Number(p.house);
    if (!name || !Number.isFinite(house)) continue;
    const arr = byHouse.get(house) || [];
    arr.push(name);
    byHouse.set(house, arr);
  }

  const baseEdges = computeHouseAspects(planets);
  const edges: AspectPlanetEdge[] = [];

  for (const e of baseEdges) {
    const targets = byHouse.get(e.toHouse) || [];
    if (targets.length === 0) {
      edges.push({ ...e }); // house-only drishti
    } else {
      for (const t of targets) {
        edges.push({ ...e, to: t as PlanetName });
      }
    }
  }
  return edges;
}

// Accept common aliases & any casing
const NAME_ALIAS: Record<string,
  "Sun"|"Moon"|"Mars"|"Mercury"|"Jupiter"|"Venus"|"Saturn"|"Rahu"|"Ketu"
> = {
  sun: "Sun", surya: "Sun",
  moon: "Moon", chandra: "Moon",
  mars: "Mars", mangal: "Mars", kuja: "Mars",
  mercury: "Mercury", budh: "Mercury",
  jupiter: "Jupiter", guru: "Jupiter", brihaspati: "Jupiter",
  venus: "Venus", shukra: "Venus",
  saturn: "Saturn", shani: "Saturn",
  rahu: "Rahu",
  ketu: "Ketu",
};

export function normalizePlanetName(x: any) {
  const s = String(x ?? "").trim().toLowerCase();
  return NAME_ALIAS[s];
}

/** Helper to build indexes for your UI */
export function indexAspects(edges: AspectPlanetEdge[]) {
  const bySource: Record<string, AspectPlanetEdge[]> = {};
  const byTarget: Record<string, AspectPlanetEdge[]> = {};
  for (const e of edges) {
    (bySource[e.from] ||= []).push(e);
    if (e.to) (byTarget[e.to] ||= []).push(e);
  }
  return { bySource, byTarget };
}
