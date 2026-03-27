import type { DegreeHit, PlanetId } from "@/server/astro/types";

type PlanetLike = {
  id?: PlanetId | string;
  name?: PlanetId | string;
  sign?: string;
  house?: number;
  deg?: number;
  siderealLongitude?: number;
};

type Input = {
  natalPlanets?: PlanetLike[] | null;
  transitPlanets?: PlanetLike[] | null;
};

export function buildDegreeHitsForDate(input: Input): DegreeHit[] {
  const natal = normalizePlanets(input.natalPlanets ?? []);
  const transit = normalizePlanets(input.transitPlanets ?? []);

  const hits: DegreeHit[] = [];

  for (const tp of transit) {
    for (const np of natal) {
      const orb = circularDistance(tp.lon, np.lon);
      const sameHouse = tp.house === np.house;

      // keep only reasonably close hits
      if (orb > 8) continue;

      let strength = 0;

      if (orb <= 1) strength = 1.0;
      else if (orb <= 2) strength = 0.9;
      else if (orb <= 3) strength = 0.75;
      else if (orb <= 5) strength = 0.55;
      else strength = 0.35;

      if (sameHouse) {
        strength = Math.min(1, strength + 0.1);
      }

      hits.push({
        transitPlanet: tp.id,
        natalPlanet: np.id,
        orb: round2(orb),
        sameHouse,
        strength: round2(strength),
        note: buildHitNote(tp.id, np.id, orb, sameHouse),
      });
    }
  }

  return hits
    .sort((a, b) => b.strength - a.strength || a.orb - b.orb)
    .slice(0, 20);
}

function normalizePlanets(planets: PlanetLike[]) {
  const out: Array<{
    id: PlanetId;
    house: number;
    lon: number;
  }> = [];

  for (const p of planets) {
    const id = asPlanetId(p?.id ?? p?.name);
    const house = Number(p?.house);
    const lonRaw = Number(p?.siderealLongitude ?? p?.deg ?? 0);

    if (!id) continue;
    if (!Number.isFinite(house)) continue;
    if (!Number.isFinite(lonRaw)) continue;

    const lon = normalizeLongitude(lonRaw);

    out.push({
      id,
      house,
      lon,
    });
  }

  return out;
}

function buildHitNote(
  transitPlanet: PlanetId,
  natalPlanet: PlanetId,
  orb: number,
  sameHouse: boolean
): string {
  const closeness =
    orb <= 1 ? "very exact" :
    orb <= 2 ? "close" :
    orb <= 3 ? "strong" :
    orb <= 5 ? "moderate" :
    "loose";

  if (sameHouse) {
    return `${transitPlanet} has a ${closeness} hit to natal ${natalPlanet} and also activates the same house.`;
  }

  return `${transitPlanet} has a ${closeness} degree hit to natal ${natalPlanet}.`;
}

function circularDistance(a: number, b: number): number {
  const diff = Math.abs(normalizeLongitude(a) - normalizeLongitude(b));
  return diff > 180 ? 360 - diff : diff;
}

function normalizeLongitude(x: number): number {
  let v = x;
  while (v < 0) v += 360;
  while (v >= 360) v -= 360;
  return v;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function asPlanetId(x: any): PlanetId | null {
  const s = String(x ?? "").trim();

  if (
    s === "Sun" ||
    s === "Moon" ||
    s === "Mars" ||
    s === "Mercury" ||
    s === "Jupiter" ||
    s === "Venus" ||
    s === "Saturn" ||
    s === "Rahu" ||
    s === "Ketu"
  ) {
    return s;
  }

  return null;
}