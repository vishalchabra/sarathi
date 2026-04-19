import type { Birth, PlanetId } from "@/server/astro/types";
import { computeTransitPlanetsNow } from "@/server/astro/transits";

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
  time?: string;
};

export async function buildTransitSnapshotForDate(
  input: Input
): Promise<TransitPlanet[]> {
  const { birth, targetDateISO, time = "12:00" } = input;

 const planets = await computeTransitPlanetsNow(
  {
    dateISO: targetDateISO,
    time,
    tz: birth.tz,
    lat: birth.lat,
    lon: birth.lon,
  },
  undefined,
  {
    dateISO: targetDateISO,
    time,
    tz: birth.tz,
  }
);

  return normalizeTransitPlanets(planets);
}

function normalizeTransitPlanets(planets: any[]): TransitPlanet[] {
  const out: TransitPlanet[] = [];

  for (const p of planets) {
    const id = asPlanetId(p?.id ?? p?.name ?? p?.planet);
    const house = Number(p?.house);
    const siderealLongitude = Number(p?.siderealLongitude ?? p?.lon ?? 0);
    const deg = Number(
      p?.deg ??
        p?.degree ??
        (((siderealLongitude % 30) + 30) % 30)
    );

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