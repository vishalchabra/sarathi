

type Aspect = {
  planetA: string;
  planetB: string;
  tone: string;
};

type Planet = {
  planet: string;
  sign?: string;
  lon?: number;
  combust?: boolean;
};

const ENEMY_SIGNS: Record<string, string[]> = {
  Sun: ["Libra", "Capricorn"],
  Moon: ["Capricorn"],
  Mars: ["Cancer"],
  Mercury: ["Pisces"],
  Jupiter: ["Capricorn"],
  Venus: ["Virgo"],
  Saturn: ["Aries"],
};

const MALEFICS = ["Saturn", "Mars", "Rahu", "Ketu"];
function circularDiff(a: number, b: number) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}
const FUNCTIONAL_MALEFICS_BY_LAGNA: Record<string, string[]> = {
  Aries: ["Mercury", "Venus", "Saturn"],
  Taurus: ["Jupiter", "Mars"],
  Gemini: ["Mars", "Jupiter", "Saturn"],
  Cancer: ["Mercury", "Venus", "Saturn"],
  Leo: ["Moon", "Mercury", "Saturn"],
  Virgo: ["Mars", "Moon", "Jupiter"],
  Libra: ["Sun", "Jupiter", "Mars"],
  Scorpio: ["Mercury", "Venus", "Saturn"],
  Sagittarius: ["Moon", "Venus", "Saturn"],
  Capricorn: ["Moon", "Mars", "Jupiter"],
  Aquarius: ["Moon", "Mars", "Mercury"],
  Pisces: ["Sun", "Venus", "Saturn"],
};

const FUNCTIONAL_BENEFICS_BY_LAGNA: Record<string, string[]> = {
  Aries: ["Sun", "Jupiter"],
  Taurus: ["Saturn", "Mercury"],
  Gemini: ["Venus", "Mercury"],
  Cancer: ["Mars", "Jupiter"],
  Leo: ["Mars", "Jupiter"],
  Virgo: ["Venus", "Mercury"],
  Libra: ["Saturn", "Mercury"],
  Scorpio: ["Moon", "Sun", "Jupiter"],
  Sagittarius: ["Sun", "Mars"],
  Capricorn: ["Venus", "Mercury"],
  Aquarius: ["Venus", "Saturn"],
  Pisces: ["Moon", "Mars", "Jupiter"],
};
function getCombustionOrb(planet: string) {
  const orbs: Record<string, number> = {
    Moon: 12,
    Mars: 17,
    Mercury: 14,
    Jupiter: 11,
    Venus: 10,
    Saturn: 15,
  };

  return orbs[planet] ?? 0;
}
export function getAffliction(
  planet: Planet,
  aspects: Aspect[],
  allPlanets: Planet[],
  lagnaSign?: string | null
) {
  let score = 0;
  const reasons: string[] = [];

  // 1. Enemy sign
  if (planet.sign && ENEMY_SIGNS[planet.planet]?.includes(planet.sign)) {
    score += 1;
    reasons.push(`in enemy sign (${planet.sign})`);
  }

  // 2. Malefic aspects
  const hits = aspects.filter(
    (a) => a.planetB === planet.planet && MALEFICS.includes(a.planetA)
  );

  if (hits.length > 0) {
    score += hits.length;
    reasons.push(
      `aspected by ${hits.map((h) => h.planetA).join(", ")}`
    );
  }

  // 3. Conjunction (within 8°)
  const conjunctions = allPlanets.filter((p) => {
    if (p.planet === planet.planet) return false;
    if (!p.lon || !planet.lon) return false;

    const diff = Math.abs(p.lon - planet.lon);
    return diff < 8;
  });

  const maleficConj = conjunctions.filter((p) =>
    MALEFICS.includes(p.planet)
  );

  if (maleficConj.length > 0) {
    score += maleficConj.length;
    reasons.push(
      `conjunct ${maleficConj.map((p) => p.planet).join(", ")}`
    );
  }
  // 4. Combustion by proximity to Sun
  if (planet.planet !== "Sun" && typeof planet.lon === "number") {
    const sun = allPlanets.find((p) => p.planet === "Sun");

    if (sun && typeof sun.lon === "number") {
      const orb = getCombustionOrb(planet.planet);
      const diff = circularDiff(planet.lon, sun.lon);

      if (orb > 0 && diff <= orb) {
        score += 1;
        reasons.push(`combust by Sun (${diff.toFixed(2)}°)`);
      }
    }
  }
    // 5. Functional role by Lagna
  if (lagnaSign) {
   if (FUNCTIONAL_MALEFICS_BY_LAGNA[lagnaSign]?.includes(planet.planet)) {
  reasons.push(`functional malefic for ${lagnaSign} lagna`);
}

    if (FUNCTIONAL_BENEFICS_BY_LAGNA[lagnaSign]?.includes(planet.planet)) {
      reasons.push(`functional benefic for ${lagnaSign} lagna`);
    }
  }
  // Classification
  let level: "clean" | "mild" | "afflicted" = "clean";

  if (score >= 3) level = "afflicted";
  else if (score >= 1) level = "mild";

  return {
    planet: planet.planet,
    level,
    score,
    reasons,
  };
}