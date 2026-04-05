import "server-only";

type NatalPlanet = {
  planet: string;
  lon: number;
};

type TransitPlanet = {
  name: string;
  lon: number;
};

function wrap360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

function angleDiff(a: number, b: number) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

const ASPECTS = [
  { type: "conjunction", angle: 0 },
  { type: "opposition", angle: 180 },
  { type: "trine", angle: 120 },
  { type: "square", angle: 90 },
  { type: "sextile", angle: 60 },
];

const ORB = 3; // degrees

function detectAspect(diff: number) {
  for (const a of ASPECTS) {
    const orb = Math.abs(diff - a.angle);
    if (orb <= ORB) {
      return { type: a.type, orb };
    }
  }
  return null;
}

export function buildTransitContacts(params: {
  natalPlanets: NatalPlanet[];
  transitPlanets: TransitPlanet[];
}) {
  const contacts: any[] = [];

  for (const t of params.transitPlanets) {
    for (const n of params.natalPlanets) {
      if (typeof n.lon !== "number") continue;

      const diff = angleDiff(t.lon, n.lon);
      const aspect = detectAspect(diff);

      if (!aspect) continue;

      contacts.push({
        transitPlanet: t.name,
        natalPlanet: n.planet,
        type: aspect.type,
        orb: Number(aspect.orb.toFixed(2)),
        applying: true, // simple for now
      });
    }
  }

  return contacts;
}