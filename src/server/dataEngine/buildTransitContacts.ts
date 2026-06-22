import "server-only";

type NatalPlanet = {
  planet: string;
  lon: number;
};

type TransitPlanet = {
  name: string;
  lon: number;
};

type AspectTone = "supportive" | "challenging" | "mixed" | "neutral";

export type TransitContactRow = {
  transitPlanet: string;
  natalTarget: string;
  type: "vedic_hit";
  tone: AspectTone;
  label: string;
  rule: string;
  exactAngle: number;
  diff: number;
  orb: number;
  applying: boolean | null;
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
  if (fromPlanet === "Moon") return "supportive";
  if (fromPlanet === "Sun") return "mixed";
  if (fromPlanet === "Mercury") return "neutral";
  if (fromPlanet === "Mars") return "challenging";
  if (fromPlanet === "Saturn") return "challenging";
  if (fromPlanet === "Rahu") return "challenging";
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

export function buildTransitContacts(params: {
  natalPlanets: NatalPlanet[];
  transitPlanets: TransitPlanet[];
}): TransitContactRow[] {
  const natalPlanets = Array.isArray(params.natalPlanets)
    ? params.natalPlanets
    : [];
  const transitPlanets = Array.isArray(params.transitPlanets)
    ? params.transitPlanets
    : [];

  const filteredNatal = natalPlanets.filter(
    (n) =>
      n &&
      KEY_PLANETS.has(String(n.planet ?? "")) &&
      typeof n.lon === "number" &&
      !Number.isNaN(n.lon)
  );

  const filteredTransit = transitPlanets.filter(
    (t) =>
      t &&
      KEY_PLANETS.has(String(t.name ?? "")) &&
      typeof t.lon === "number" &&
      !Number.isNaN(t.lon)
  );

  const contacts: TransitContactRow[] = [];

  for (const t of filteredTransit) {
    const rules = getVedicAspectRules(t.name);

    for (const n of filteredNatal) {
      const hDist = houseDistance(t.lon, n.lon);

      if (!rules.includes(hDist)) continue;

      const exactAngle = getAspectAngleFromHouseDistance(hDist);
      const rawDiff = norm360(n.lon - t.lon);
      const orb = angleDiff(rawDiff, exactAngle);

      // Keep all valid rashi-based Vedic aspects.
// Orb is retained as metadata for intensity/ranking.

      const tone = getAspectTone(t.name);

      contacts.push({
        transitPlanet: t.name,
        natalTarget: n.planet,
        type: "vedic_hit",
        tone,
        label: buildReadableLabel(t.name, n.planet, tone),
        rule: getRuleLabel(t.name, hDist),
        exactAngle,
        diff: Number(rawDiff.toFixed(2)),
        orb: Number(orb.toFixed(2)),
        applying: null,
        houseDistance: hDist,
      });
    }
  }

  return contacts.sort((a, b) => {
    if (a.orb !== b.orb) return a.orb - b.orb;
    if (a.transitPlanet !== b.transitPlanet) {
      return a.transitPlanet.localeCompare(b.transitPlanet);
    }
    return a.natalTarget.localeCompare(b.natalTarget);
  });
}