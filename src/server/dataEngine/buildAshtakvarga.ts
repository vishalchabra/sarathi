type PlanetName =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn";

type PlanetInput = {
  planet: string;
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

// Real Jyotish-style allowed houses (simplified but valid structure)
const BAV_RULES: Record<PlanetName, number[]> = {
  Sun: [1, 2, 4, 7, 8, 9, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [1, 2, 4, 7, 8, 10, 11],
  Mercury: [1, 2, 4, 5, 6, 8, 9, 10, 11],
  Jupiter: [1, 2, 4, 5, 7, 9, 10, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11],
  Saturn: [1, 2, 3, 5, 6, 10, 11],
};

function getRelativeHouse(from: number, to: number) {
  return ((to - from + 12) % 12) + 1;
}

export function buildAshtakvarga({
  natalPlanets,
}: {
  natalPlanets: PlanetInput[];
}) {
  const planetMap: Record<string, number> = {};

  natalPlanets.forEach((p) => {
    if (typeof p.house === "number") {
      planetMap[p.planet] = p.house;
    }
  });

  const bav = PLANETS.map((targetPlanet) => {
    const houses = Array.from({ length: 12 }, (_, i) => {
      const house = i + 1;

      let bindu = 0;

      for (const contributor of PLANETS) {
        const fromHouse = planetMap[contributor];
        if (!fromHouse) continue;

        const relative = getRelativeHouse(fromHouse, house);

        if (BAV_RULES[targetPlanet].includes(relative)) {
          bindu += 1;
        }
      }

      return bindu;
    });

    return {
      planet: targetPlanet,
      houses,
      total: houses.reduce((a, b) => a + b, 0),
    };
  });

  const sarva = Array.from({ length: 12 }, (_, i) =>
    bav.reduce((sum, p) => sum + p.houses[i], 0)
  );

  return {
    planets: bav,
    sarva,
  };
}