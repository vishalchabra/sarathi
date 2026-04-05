import "server-only";

import { computeTransitPlanetsNow } from "@/server/astro/transits";

function addDays(date: Date, d: number) {
  const x = new Date(date);
  x.setDate(x.getDate() + d);
  return x;
}

function angleDiff(a: number, b: number) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export async function buildUpcomingTransits(params: {
  birth: any;
  natalPlanets: any[];
  natalAscendant?: {
    sign?: string;
    lon?: number | null;
  } | null;
  days?: number;
}) {
  const days = params.days ?? 30;
  const results: any[] = [];

  const engineBirth = {
    dateISO: params.birth.dateISO,
    time: params.birth.time,
    tz: params.birth.timezone,
    lat: params.birth.lat,
    lon: params.birth.lon,
  };

  const ascSign = String(params.natalAscendant?.sign ?? "").trim();

  if (!ascSign) {
    return results;
  }

  for (let i = 1; i <= days; i++) {
    const date = addDays(new Date(), i);

    const transits = await computeTransitPlanetsNow(
      engineBirth,
      ascSign,
      {
        dateISO: date.toISOString().slice(0, 10),
        time: "12:00",
        tz: params.birth.timezone,
      }
    );

    for (const t of transits) {
      for (const n of params.natalPlanets) {
        if (typeof n?.lon !== "number") continue;
        if (typeof t?.lon !== "number") continue;

        const diff = angleDiff(t.lon, n.lon);

        if (diff < 3) {
          results.push({
            dateISO: date.toISOString().slice(0, 10),
            transitPlanet: t.name,
            natalPlanet: n.planet,
            orb: Number(diff.toFixed(2)),
          });
        }
      }
    }
  }

  return results;
}