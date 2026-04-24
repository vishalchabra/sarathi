import type {
  KpPlanetOnCuspData,
  KpPlanetOnCuspHit,
} from "@/lib/astrology/kp/types";

const ASTROSAGE_ORBS: Record<string, number> = {
  CONJ: 15,
  OPPN: 15,
  TRIN: 6,
  SQUR: 6,
  SEXT: 6,
  SSQU: 1,
  NONL: 1,
  QUIN: 1,
  SQQD: 1,
  QCUN: 1,
};

function visible(hit: KpPlanetOnCuspHit) {
  const planet = hit.planet;
  const code = hit.aspectCode;
  const orb = Number(hit.orb);

  const outerPlanet = ["Uranus", "Neptune", "Pluto"].includes(planet);

  const maxOrbByAspect: Record<string, number> = outerPlanet
    ? {
        CONJ: 8,
        OPPN: 8,
        TRIN: 6,
        SQUR: 6,
        SEXT: 5,
        SSQU: 1,
        NONL: 1,
        QUIN: 1,
        SQQD: 1,
        QCUN: 1,
      }
    : {
        CONJ: 15,
        OPPN: 15,
        TRIN: 6,
        SQUR: 6,
        SEXT: 6,
        SSQU: 1,
        NONL: 1,
        QUIN: 1,
        SQQD: 1,
        QCUN: 1,
      };

  const maxOrb = maxOrbByAspect[code] ?? 0;
  return orb <= maxOrb;
}

function maxHitsForPlanet(planet: string) {
  if (planet === "Sun") return 4;
  if (planet === "Moon") return 5;

  // relax outer planets
  if (["Uranus", "Neptune", "Pluto"].includes(planet)) return 5;

  return 4;
}

function choosePlanetHits(hits: KpPlanetOnCuspHit[]) {
  if (!hits.length) return [];

  const planet = hits[0]?.planet ?? "";

  const rules: Record<string, { max: number; allow: string[] }> = {
    Sun: { max: 3, allow: ["CONJ", "SEXT", "SQUR", "TRIN", "OPPN"] },
    Moon: { max: 4, allow: ["SEXT", "SQUR", "TRIN", "CONJ"] }, // no wide OPPN
    Mars: { max: 4, allow: ["CONJ", "SEXT", "TRIN", "OPPN"] },
    Mercury: { max: 4, allow: ["CONJ", "SEXT", "SQUR", "TRIN", "OPPN"] },
    Jupiter: { max: 4, allow: ["CONJ", "TRIN", "SEXT", "SQUR"] }, // remove giant OPPN
    Venus: { max: 3, allow: ["CONJ", "SEXT", "TRIN", "SQUR"] },
    Saturn: { max: 4, allow: ["CONJ", "SEXT", "TRIN", "SQUR"] },
    Rahu: { max: 3, allow: ["CONJ", "TRIN", "SEXT", "OPPN"] },
    Ketu: { max: 3, allow: ["CONJ", "TRIN", "SEXT", "SQUR"] },
    Uranus: { max: 4, allow: ["CONJ", "TRIN", "SEXT", "SQUR"] },
    Neptune: { max: 4, allow: ["CONJ", "TRIN", "SEXT", "SQUR"] },
    Pluto: { max: 4, allow: ["CONJ", "TRIN", "SEXT", "SQUR"] },
  };

  const rule = rules[planet] ?? {
    max: 4,
    allow: ["CONJ", "SEXT", "SQUR", "TRIN", "OPPN"],
  };
console.log("RULE RUNNING", hits[0]?.planet);
  return hits
    .filter((h) => visible(h))
    .filter((h) => rule.allow.includes(h.aspectCode))
    .sort((a, b) => Number(a.orb) - Number(b.orb))
    .slice(0, rule.max);
}

export function formatKpPlanetOnCuspForAstroSage(
  data: KpPlanetOnCuspData | null | undefined
): KpPlanetOnCuspData | null {
  if (!data?.cusps?.length) return null;

  const grouped: Record<string, KpPlanetOnCuspHit[]> = {};

  for (const cusp of data.cusps) {
    for (const hit of cusp.hits ?? []) {
      if (!grouped[hit.planet]) grouped[hit.planet] = [];
      grouped[hit.planet].push(hit);
    }
  }

  const chosenHits = Object.values(grouped).flatMap(choosePlanetHits);

  return {
    ...data,
    cusps: data.cusps.map((cusp) => ({
      ...cusp,
      hits: chosenHits
        .filter((h) => Number(h.cusp) === Number(cusp.cusp))
        .sort((a, b) => Number(a.orb) - Number(b.orb)),
    })),
  };
}