import "server-only";

type NatalPlanet = {
  planet: string;
  lon: number;
};

type AspectTone = "supportive" | "challenging" | "mixed" | "neutral";

export type NatalAspectRow = {
  planetA: string; // aspecting planet
  planetB: string; // aspected planet
  type: "vedic_aspect";
  tone: AspectTone;
  label: string;
  rule: string;
  exactAngle: number;
  diff: number;
  orb: number;
  houseDistance: number;
};

const KEY_PLANETS = new Set([
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
]);

function norm360(n: number): number {
  return ((n % 360) + 360) % 360;
}

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function signIndexFromLon(lon: number): number {
  return Math.floor(norm360(lon) / 30); // 0..11
}

function houseDistance(fromLon: number, toLon: number): number {
  const fromSign = signIndexFromLon(fromLon);
  const toSign = signIndexFromLon(toLon);
  return ((toSign - fromSign + 12) % 12) + 1; // 1..12
}

function getVedicAspectRules(planet: string): number[] {
  if (planet === "Mars") return [4, 7, 8];
  if (planet === "Jupiter") return [5, 7, 9];
  if (planet === "Saturn") return [3, 7, 10];
  if (planet === "Rahu" || planet === "Ketu") return [5, 7, 9];
  return [7];
}

function getAspectAngleFromHouseDistance(houseNum: number): number {
  return (houseNum - 1) * 30;
}

function getAspectTone(fromPlanet: string): AspectTone {
  if (fromPlanet === "Jupiter") return "supportive";
  if (fromPlanet === "Venus") return "supportive";

  if (fromPlanet === "Saturn") return "challenging";
  if (fromPlanet === "Mars") return "challenging";
  if (fromPlanet === "Rahu") return "challenging";

  if (fromPlanet === "Moon") return "supportive";
  if (fromPlanet === "Sun") return "mixed";
  if (fromPlanet === "Mercury") return "neutral";
  if (fromPlanet === "Ketu") return "mixed";

  return "neutral";
}

function getRuleLabel(planet: string, houseNum: number): string {
  if (houseNum === 7) return "full 7th aspect";
  if (planet === "Mars" && houseNum === 4) return "special 4th aspect";
  if (planet === "Mars" && houseNum === 8) return "special 8th aspect";
  if (planet === "Jupiter" && houseNum === 5) return "special 5th aspect";
  if (planet === "Jupiter" && houseNum === 9) return "special 9th aspect";
  if (planet === "Saturn" && houseNum === 3) return "special 3rd aspect";
  if (planet === "Saturn" && houseNum === 10) return "special 10th aspect";
  if ((planet === "Rahu" || planet === "Ketu") && houseNum === 5) {
    return "node 5th aspect";
  }
  if ((planet === "Rahu" || planet === "Ketu") && houseNum === 9) {
    return "node 9th aspect";
  }
  return "aspect";
}

function buildReadableLabel(
  fromPlanet: string,
  toPlanet: string,
  tone: AspectTone
): string {
  if (tone === "supportive") {
    return `${toPlanet} influenced by ${fromPlanet} (supportive)`;
  }
  if (tone === "challenging") {
    return `${toPlanet} under tension from ${fromPlanet}`;
  }
  if (tone === "mixed") {
    return `${toPlanet} influenced by ${fromPlanet} (mixed)`;
  }
  return `${toPlanet} influenced by ${fromPlanet}`;
}

function buildAspectRow(
  fromPlanet: NatalPlanet,
  toPlanet: NatalPlanet,
  hDist: number
): NatalAspectRow {
  const exactAngle = getAspectAngleFromHouseDistance(hDist);
  const rawDiff = norm360(toPlanet.lon - fromPlanet.lon);
  const orb = angleDiff(rawDiff, exactAngle);
  const tone = getAspectTone(fromPlanet.planet);

  return {
    planetA: fromPlanet.planet,
    planetB: toPlanet.planet,
    type: "vedic_aspect",
    tone,
    label: buildReadableLabel(fromPlanet.planet, toPlanet.planet, tone),
    rule: getRuleLabel(fromPlanet.planet, hDist),
    exactAngle,
    diff: Number(rawDiff.toFixed(2)),
    orb: Number(orb.toFixed(2)),
    houseDistance: hDist,
  };
}

export function buildNatalAspects(params: {
  natalPlanets: NatalPlanet[];
}): NatalAspectRow[] {
  const planets = Array.isArray(params.natalPlanets) ? params.natalPlanets : [];

  const filtered = planets.filter(
    (p) =>
      p &&
      KEY_PLANETS.has(String(p.planet ?? "")) &&
      typeof p.lon === "number" &&
      !Number.isNaN(p.lon)
  );

  const aspects: NatalAspectRow[] = [];

  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      const A = filtered[i];
      const B = filtered[j];

      const hDistAB = houseDistance(A.lon, B.lon);
      const hDistBA = houseDistance(B.lon, A.lon);

      const rulesA = getVedicAspectRules(A.planet);
      const rulesB = getVedicAspectRules(B.planet);

      if (rulesA.includes(hDistAB)) {
  const row = buildAspectRow(A, B, hDistAB);

  if (row.orb <= 6) {   // ⭐ KEY FILTER
    aspects.push(row);
  }
}

     if (rulesB.includes(hDistBA)) {
  const row = buildAspectRow(B, A, hDistBA);

  if (row.orb <= 6) {
    aspects.push(row);
  }
}
    }
  }

  return aspects.sort((a, b) => {
    const toneRank: Record<AspectTone, number> = {
      supportive: 1,
      challenging: 2,
      mixed: 3,
      neutral: 4,
    };

    if (toneRank[a.tone] !== toneRank[b.tone]) {
      return toneRank[a.tone] - toneRank[b.tone];
    }

    if (a.houseDistance !== b.houseDistance) {
      return a.houseDistance - b.houseDistance;
    }

    if (a.planetB !== b.planetB) {
      return a.planetB.localeCompare(b.planetB);
    }

    return a.planetA.localeCompare(b.planetA);
  });
}