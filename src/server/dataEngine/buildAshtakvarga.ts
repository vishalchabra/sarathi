type PlanetName =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn";

type ContributorName = PlanetName | "Lagna";

type PlanetInput = {
  planet: string;
  signNum?: number | null;
  house?: number | null;
};

const PLANETS: PlanetName[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

const CONTRIBUTORS: ContributorName[] = [...PLANETS, "Lagna"];

const EXPECTED_BAV_TOTALS: Record<PlanetName, number> = {
  Sun: 48,
  Moon: 49,
  Mars: 39,
  Mercury: 54,
  Jupiter: 56,
  Venus: 52,
  Saturn: 39,
};

const BAV_RULES: Record<PlanetName, Record<ContributorName, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [3, 4, 6, 10, 11, 12],
  },

  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Lagna: [3, 6, 10, 11],
  },

  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 2, 4, 7, 8, 10, 11],
    Lagna: [1, 3, 6, 10, 11],
  },

  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 8, 10, 11],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 2, 4, 6, 8, 10, 11],
  },

  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },

  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },

  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Lagna: [1, 3, 4, 6, 10, 11],
  },
};

function normalizeSign(signNum?: number | null) {
  if (typeof signNum !== "number" || !Number.isFinite(signNum)) return null;
  return ((Math.trunc(signNum) - 1) % 12 + 12) % 12 + 1;
}

function getRelativeSign(fromSign: number, toSign: number) {
  return ((toSign - fromSign + 12) % 12) + 1;
}

export function buildAshtakvarga({
  natalPlanets,
  lagnaSign,
}: {
  natalPlanets: PlanetInput[];
  lagnaSign?: number | null;
}) {
  const contributorSignMap: Partial<Record<ContributorName, number>> = {};

  natalPlanets.forEach((p) => {
    if (!PLANETS.includes(p.planet as PlanetName)) return;

    const sign = normalizeSign(p.signNum);
    if (!sign) return;

    contributorSignMap[p.planet as PlanetName] = sign;
  });

  const normalizedLagnaSign = normalizeSign(lagnaSign);
  if (normalizedLagnaSign) {
    contributorSignMap.Lagna = normalizedLagnaSign;
  }

  const planets = PLANETS.map((targetPlanet) => {
    const signs = Array.from({ length: 12 }, (_, i) => {
      const targetSign = i + 1;
      let bindu = 0;

      for (const contributor of CONTRIBUTORS) {
        const fromSign = contributorSignMap[contributor];
        if (!fromSign) continue;

        const relativeSign = getRelativeSign(fromSign, targetSign);
        const allowedSigns = BAV_RULES[targetPlanet][contributor];

        if (allowedSigns.includes(relativeSign)) {
          bindu += 1;
        }
      }

      return bindu;
    });

    const total = signs.reduce((sum, value) => sum + value, 0);

    return {
      planet: targetPlanet,
      houses: signs, // keeping key as houses for UI backward compatibility
      signs,
      total,
      expectedTotal: EXPECTED_BAV_TOTALS[targetPlanet],
      isTotalValid: total === EXPECTED_BAV_TOTALS[targetPlanet],
    };
  });

  const sarva = Array.from({ length: 12 }, (_, i) =>
    planets.reduce((sum, p) => sum + p.signs[i], 0)
  );

  const sarvaTotal = sarva.reduce((sum, value) => sum + value, 0);

  return {
    planets,
    sarva,
    sarvaTotal,
    expectedSarvaTotal: 337,
    isSarvaTotalValid: sarvaTotal === 337,
  };
}