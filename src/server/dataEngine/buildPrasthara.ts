type Planet =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn";

type Contributor = Planet | "Lagna";

type PlanetInput = {
  planet: string;
  signNum?: number | null;
  house?: number | null;
};

const PLANETS: Planet[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

const CONTRIBUTORS: Contributor[] = [...PLANETS, "Lagna"];

const BAV_RULES: Record<Planet, Record<Contributor, number[]>> = {
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

function normalizeSign(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return ((Math.trunc(value) - 1) % 12 + 12) % 12 + 1;
}

function getRelativeSign(fromSign: number, toSign: number) {
  return ((toSign - fromSign + 12) % 12) + 1;
}

export function buildPrasthara({
  natalPlanets,
  lagnaSign,
}: {
  natalPlanets: PlanetInput[];
  lagnaSign?: number | null;
}) {
  const contributorSignMap: Partial<Record<Contributor, number>> = {};

  for (const p of natalPlanets ?? []) {
    if (!PLANETS.includes(p.planet as Planet)) continue;

    const sign = normalizeSign(p.signNum);
    if (!sign) continue;

    contributorSignMap[p.planet as Planet] = sign;
  }

  const normalizedLagnaSign = normalizeSign(lagnaSign);
  if (normalizedLagnaSign) {
    contributorSignMap.Lagna = normalizedLagnaSign;
  }

  const result: Record<Planet, Record<Contributor, number[]>> = {} as Record<
    Planet,
    Record<Contributor, number[]>
  >;

  for (const targetPlanet of PLANETS) {
    result[targetPlanet] = {} as Record<Contributor, number[]>;

    for (const contributor of CONTRIBUTORS) {
      const fromSign = contributorSignMap[contributor];

      result[targetPlanet][contributor] = Array.from({ length: 12 }, (_, i) => {
        if (!fromSign) return 0;

        const targetSign = i + 1;
        const relativeSign = getRelativeSign(fromSign, targetSign);

        return BAV_RULES[targetPlanet][contributor].includes(relativeSign)
          ? 1
          : 0;
      });
    }
  }

  return result;
}