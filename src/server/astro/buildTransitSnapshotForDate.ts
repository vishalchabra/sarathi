import type { Birth, PlanetId } from "@/server/astro/types";
import { getPlanetPositions } from "@/server/astro/swe-remote";

type TransitPlanet = {
  id: PlanetId;
  sign?: string;
  house: number;
  deg: number;
  siderealLongitude: number;
};

type Input = {
  birth: Birth;
  targetDateISO: string;
};

export async function buildTransitSnapshotForDate(
  input: Input
): Promise<TransitPlanet[]> {
  const { birth, targetDateISO } = input;

  const dateISO = `${targetDateISO}T12:00:00`;

  const transit = await getPlanetPositions({
    dateISO,
    tz: birth.tz,
    lat: birth.lat,
    lon: birth.lon,
  });

  const planets = Array.isArray((transit as any)?.planets)
    ? (transit as any).planets
    : [];

  return normalizeTransitPlanets(planets);
}

function normalizeTransitPlanets(planets: any[]): TransitPlanet[] {
  const out: TransitPlanet[] = [];

  for (const p of planets) {
    const id = asPlanetId(p?.id ?? p?.name);
    const house = Number(p?.house);
    const siderealLongitude = Number(p?.siderealLongitude ?? 0);
    const deg = Number(p?.deg ?? (siderealLongitude % 30));

    if (!id) continue;
    if (!Number.isFinite(house)) continue;
    if (!Number.isFinite(siderealLongitude)) continue;

    out.push({
      id,
      sign: p?.sign,
      house,
      deg,
      siderealLongitude,
    });
  }

  return out;
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