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
  sign?: string | null;
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

const NATURAL_RELATIONSHIPS: Record<
  PlanetName,
  {
    friends: PlanetName[];
    neutrals: PlanetName[];
    enemies: PlanetName[];
  }
> = {
  Sun: {
    friends: ["Moon", "Mars", "Jupiter"],
    neutrals: ["Mercury"],
    enemies: ["Venus", "Saturn"],
  },
  Moon: {
    friends: ["Sun", "Mercury"],
    neutrals: ["Mars", "Jupiter", "Venus", "Saturn"],
    enemies: [],
  },
  Mars: {
    friends: ["Sun", "Moon", "Jupiter"],
    neutrals: ["Venus", "Saturn"],
    enemies: ["Mercury"],
  },
  Mercury: {
    friends: ["Sun", "Venus"],
    neutrals: ["Mars", "Jupiter", "Saturn"],
    enemies: ["Moon"],
  },
  Jupiter: {
    friends: ["Sun", "Moon", "Mars"],
    neutrals: ["Saturn"],
    enemies: ["Mercury", "Venus"],
  },
  Venus: {
    friends: ["Mercury", "Saturn"],
    neutrals: ["Mars", "Jupiter"],
    enemies: ["Sun", "Moon"],
  },
  Saturn: {
    friends: ["Mercury", "Venus"],
    neutrals: ["Jupiter"],
    enemies: ["Sun", "Moon", "Mars"],
  },
};

function normalizeHouseDistance(fromHouse: number, toHouse: number) {
  return ((toHouse - fromHouse + 12) % 12) + 1;
}

function getNaturalRelation(from: PlanetName, to: PlanetName) {
  const rel = NATURAL_RELATIONSHIPS[from];

  if (rel.friends.includes(to)) return "Friend";
  if (rel.enemies.includes(to)) return "Enemy";
  return "Neutral";
}

function getTemporaryRelation(fromHouse?: number | null, toHouse?: number | null) {
  if (typeof fromHouse !== "number" || typeof toHouse !== "number") {
    return "Neutral";
  }

  const distance = normalizeHouseDistance(fromHouse, toHouse);

  if ([2, 3, 4, 10, 11, 12].includes(distance)) return "Friend";
  if ([1, 5, 6, 7, 8, 9].includes(distance)) return "Enemy";
  return "Neutral";
}

function combineRelations(natural: string, temporary: string) {
  const key = `${natural}|${temporary}`;

  const map: Record<string, string> = {
    "Friend|Friend": "Great Friend",
    "Friend|Neutral": "Friend",
    "Friend|Enemy": "Neutral",
    "Neutral|Friend": "Friend",
    "Neutral|Neutral": "Neutral",
    "Neutral|Enemy": "Enemy",
    "Enemy|Friend": "Neutral",
    "Enemy|Neutral": "Enemy",
    "Enemy|Enemy": "Great Enemy",
  };

  return map[key] ?? "Neutral";
}

export function buildFiveFoldFriendship({
  natalPlanets,
}: {
  natalPlanets: PlanetInput[];
}) {
  const corePlanets = natalPlanets.filter((p) =>
    PLANETS.includes(p.planet as PlanetName)
  ) as Array<PlanetInput & { planet: PlanetName }>;

  return PLANETS.map((fromPlanet) => {
    const fromRow = corePlanets.find((p) => p.planet === fromPlanet);

    return {
      planet: fromPlanet,
      relationships: PLANETS.filter((p) => p !== fromPlanet).map((toPlanet) => {
        const toRow = corePlanets.find((p) => p.planet === toPlanet);

        const natural = getNaturalRelation(fromPlanet, toPlanet);
        const temporary = getTemporaryRelation(fromRow?.signNum, toRow?.signNum);
        const final = combineRelations(natural, temporary);

        return {
          withPlanet: toPlanet,
          natural,
          temporary,
          final,
        };
      }),
    };
  });
}