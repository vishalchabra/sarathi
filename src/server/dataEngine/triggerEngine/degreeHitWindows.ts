import { buildTransitSnapshot } from "../buildTransitSnapshot";
import { computeDegreeHits } from "./degreeHits";

type DegreeHitWindow = {
  natalPlanet: string;
  transitPlanet: string;
  windowStart: string;
  peakDate: string;
  windowEnd: string;
  maxStrength: number;
};

export async function computeDegreeHitWindows(params: {
  birth: any;
  natalPlanets: any[];
  natalAscendant: any;
  startDateISO: string;
  days?: number;
}) {
  const { birth, natalPlanets, natalAscendant, startDateISO, days = 30 } = params;

  const results: any[] = [];

  // Step 1: scan daily
  for (let i = 0; i < days; i++) {
    const date = new Date(startDateISO);
    date.setDate(date.getDate() + i);

    const dateISO = date.toISOString().slice(0, 10);

    const snapshot = await buildTransitSnapshot({
      birth,
      dateISO,
      natalAscendant,
      natalPlanets,
      plan: "light",
    });

    const hits = computeDegreeHits({
      transitPlanets: snapshot.planets,
      natalPlanets,
    });

    hits.forEach((hit) => {
      results.push({
        ...hit,
        dateISO,
      });
    });
  }

  // Step 2: group by pair
  const grouped: Record<string, any[]> = {};

  for (const hit of results) {
    const key = `${hit.transitPlanet}_${hit.natalPlanet}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(hit);
  }

  const windows: DegreeHitWindow[] = [];

  // Step 3: build windows
  for (const key in grouped) {
    const hits = grouped[key].sort((a, b) =>
      a.dateISO.localeCompare(b.dateISO)
    );

    let windowStart = hits[0].dateISO;
    let windowEnd = hits[hits.length - 1].dateISO;

    let peak = hits[0];

    for (const h of hits) {
      if (h.strength > peak.strength) peak = h;
    }

    windows.push({
      natalPlanet: peak.natalPlanet,
      transitPlanet: peak.transitPlanet,
      windowStart,
      peakDate: peak.dateISO,
      windowEnd,
      maxStrength: peak.strength,
    });
  }

  return windows;
}