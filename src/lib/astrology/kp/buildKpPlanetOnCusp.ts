import { KP_CUSP_ASPECT_CONFIG } from "./kpCuspAspectConfig";

type AspectConfigItem = {
  code: string;
  angle: number;
  maxOrb: number;
};

type InputPlanet = {
  planet: string;
  lon?: number | null;
  longitude?: number | null;
};

type InputCusp = {
  cusp: number;
  lon?: number | null;
  longitude?: number | null;
  sign?: string | null;
  degreeInSign?: number | null;
  nakshatra?: string | null;
  pada?: number | null;
  starLord?: string | null;
  subLord?: string | null;
  subSubLord?: string | null;
};

function normalizeAngle(angle: number) {
  let x = angle % 360;
  if (x < 0) x += 360;
  return x;
}

function shortestArc(a: number, b: number) {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return diff > 180 ? 360 - diff : diff;
}

function signFromLongitude(lon: number) {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  const idx = Math.floor(normalizeAngle(lon) / 30);
  return signs[idx] ?? "Unknown";
}

function degreeInSignFromLongitude(lon: number) {
  return normalizeAngle(lon) % 30;
}

function getAllowedAspectCodesForPlanet(planet: string) {
  const MAP: Record<string, string[]> = {
    Sun: [],
    Moon: ["CONJ","SEXT","SQUR","TRIN","OPPN"],
    Mars: ["CONJ","NONL","QUIN","SQQD"],
    Mercury: ["CONJ"],
    Venus: ["SEXT","SQUR","CONJ"],
    Jupiter: [],
    Saturn: ["SEXT","SQUR","TRIN"],
    Rahu: ["CONJ","TRIN","OPPN"],
    Ketu: ["CONJ","TRIN","OPPN"],
    Uranus: ["CONJ","TRIN"],
    Neptune: [],
    Pluto: ["CONJ"],
  };

  return MAP[planet] ?? ["CONJ","SEXT","SQUR","TRIN","OPPN"];
}

function findBestAspect(
  exactAngle: number,
  aspectSet: readonly AspectConfigItem[]
) {
  const majorCodes = new Set(["CONJ", "OPPN", "TRIN", "SQUR", "SEXT"]);
  const majors = aspectSet.filter((a) => majorCodes.has(a.code));
  const minors = aspectSet.filter((a) => !majorCodes.has(a.code));

  const pickClosest = (items: readonly AspectConfigItem[]) => {
    let best: AspectConfigItem | null = null;
    let bestOrb = Number.POSITIVE_INFINITY;

    for (const aspect of items) {
      const orb = Math.abs(exactAngle - aspect.angle);
      if (orb <= aspect.maxOrb && orb < bestOrb) {
        best = aspect;
        bestOrb = orb;
      }
    }

    if (!best) return null;

    return {
      aspectCode: best.code,
      aspectAngle: best.angle,
      orb: bestOrb,
    };
  };

  return pickClosest(majors) ?? pickClosest(minors);
}

export function buildKpPlanetOnCusp(args: {
  cusps: InputCusp[];
  planets: InputPlanet[];
  zodiac?: "sidereal" | "tropical";
  ayanamsa?: string | null;
  aspectSet?: readonly AspectConfigItem[];
}) {
  const aspectSet = args.aspectSet ?? KP_CUSP_ASPECT_CONFIG;

  const filteredPlanets = (args.planets ?? []).filter((p) => {
    const lon = p.lon ?? p.longitude;
    return p.planet && typeof lon === "number" && Number.isFinite(lon);
  });

  const cuspRows = (args.cusps ?? [])
    .filter((c) => {
      const lon = c.lon ?? c.longitude;
      return (
        typeof c.cusp === "number" &&
        typeof lon === "number" &&
        Number.isFinite(lon)
      );
    })
    .map((cusp) => {
      const cuspLon = normalizeAngle((cusp.lon ?? cusp.longitude)!);

      const hitsRaw = filteredPlanets
  .map((planet) => {
    const planetLon = normalizeAngle((planet.lon ?? planet.longitude)!);
    const exactAngle = normalizeAngle(cuspLon - planetLon);
    if (
  ["Moon", "Mars", "Mercury", "Venus", "Saturn", "Rahu", "Ketu"].includes(
    planet.planet
  ) &&
  [2, 3, 4, 5, 6, 7, 9, 12].includes(cusp.cusp)
) {
}
    const best = findBestAspect(exactAngle, aspectSet);

    if (!best) return null;

    return {
      planet: planet.planet,
      planetLon,
      cusp: cusp.cusp,
      cuspLon,
      exactAngle,
      aspectAngle: best.aspectAngle,
      aspectCode: best.aspectCode,
      orb: best.orb,
      applying: null,
    };
  })
  .filter(Boolean)
  .sort((a: any, b: any) => a.orb - b.orb);

const hits = hitsRaw;
      return {
        cusp: cusp.cusp,
        lon: cuspLon,
        sign: cusp.sign ?? signFromLongitude(cuspLon),
        degreeInSign:
          typeof cusp.degreeInSign === "number" &&
          Number.isFinite(cusp.degreeInSign)
            ? cusp.degreeInSign
            : degreeInSignFromLongitude(cuspLon),
        nakshatra: cusp.nakshatra ?? null,
        pada: cusp.pada ?? null,
        starLord: cusp.starLord ?? null,
        subLord: cusp.subLord ?? null,
        subSubLord: cusp.subSubLord ?? null,
        hits,
      };
    })
    .sort((a, b) => a.cusp - b.cusp);

  return {
    system: "KP" as const,
    zodiac: args.zodiac ?? "sidereal",
    ayanamsa: args.ayanamsa ?? null,
    aspectSet: aspectSet.map((a) => ({
      code: a.code,
      angle: a.angle,
      maxOrb: a.maxOrb,
    })),
    cusps: cuspRows,
    generatedAt: new Date().toISOString(),
  };
}