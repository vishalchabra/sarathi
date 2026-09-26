import type {
  LifeArea,
  PlanetName,
} from "../types";
import type {
  ZodiacSign,
} from "../types";

import {
  getPlanetLordships,
} from "./planetLordships";
import {
  HOUSE_KNOWLEDGE,
} from "./houses";
import {
  getSignLord,
} from "./signLords";
export type DashaLevel =
  | "mahadasha"
  | "antardasha"
  | "pratyantardasha";

export type DashaPeriod = {
  planet: PlanetName;
  level: DashaLevel;
};

export type DashaActivationInput = {
  ascendant?: ZodiacSign;

  mahadasha: PlanetName;
  antardasha?: PlanetName;
  pratyantardasha?: PlanetName;

  natalPositions?: Partial<
    Record<
      PlanetName,
      NatalPlanetPosition
    >
  >;
};

export type DashaPlanetActivation = {
  planet: PlanetName;

  levels: DashaLevel[];

  strength: number;
  ruledHouses: number[];
  natalHouse?: number;
  dispositor?: PlanetName;
dispositorRuledHouses: number[];
lordshipAreas: LifeArea[];
natalPlacementAreas: LifeArea[];
dispositorAreas: LifeArea[];
  areas: LifeArea[];
  areaActivations: DashaAreaActivation[];
  reasons: string[];
};

export type DashaActivationResult = {
  activePeriods: DashaPeriod[];

  planetActivations: DashaPlanetActivation[];

  dominantPlanets: PlanetName[];

  periodAreaActivations: DashaPeriodAreaActivation[];
};
export type NatalPlanetPosition = {
  sign: ZodiacSign;
  house: number;
};
export type DashaAreaActivationSource =
  | "lordship"
  | "natal_placement"
  | "dispositor";

export type DashaAreaSourceContribution = {
  source: DashaAreaActivationSource;

  score: number;

  houses: number[];
};

export type DashaAreaActivation = {
  area: LifeArea;

  score: number;

  sources: DashaAreaActivationSource[];

  sourceContributions:
    DashaAreaSourceContribution[];
};
export type DashaPeriodAreaActivation = {
  area: LifeArea;

  score: number;
  confirmationCount: number;
  contributors: {
    planet: PlanetName;
    dashaStrength: number;
    areaScore: number;
    contribution: number;
  }[];
};
const DASHA_LEVEL_STRENGTH: Record<
  DashaLevel,
  number
> = {
  mahadasha: 3,
  antardasha: 2,
  pratyantardasha: 1,
};
function getDashaActivatedAreas(
  ruledHouses: number[]
): LifeArea[] {
  const areas = new Set<LifeArea>();

  for (const house of ruledHouses) {
    const houseKnowledge =
      HOUSE_KNOWLEDGE[house];

    if (!houseKnowledge) continue;

    for (
      const area of houseKnowledge.primaryAreas
    ) {
      areas.add(area);
    }
  }

  return Array.from(areas);
}
function getHousesForArea(
  houses: number[],
  area: LifeArea
): number[] {
  return houses.filter((house) => {
    const houseKnowledge =
      HOUSE_KNOWLEDGE[house];

    if (!houseKnowledge) {
      return false;
    }

    return (
      houseKnowledge.primaryAreas.includes(
        area
      )
    );
  });
}
function buildDashaAreaActivations(params: {
  lordshipAreas: LifeArea[];
  natalPlacementAreas: LifeArea[];
  dispositorAreas: LifeArea[];

  ruledHouses: number[];
  natalHouse?: number;
  dispositorRuledHouses: number[];
}): DashaAreaActivation[] {
  const activationMap =
    new Map<LifeArea, DashaAreaActivation>();

 const addActivation = (
  area: LifeArea,
  source: DashaAreaActivationSource,
  score: number,
  houses: number[]
) => {
    const existing =
      activationMap.get(area);

   if (existing) {
  existing.score += score;

  if (!existing.sources.includes(source)) {
    existing.sources.push(source);
  }

  const existingContribution =
    existing.sourceContributions.find(
      (contribution) =>
        contribution.source === source
    );

  if (existingContribution) {
    existingContribution.score += score;

    existingContribution.houses = [
      ...new Set([
        ...existingContribution.houses,
        ...houses,
      ]),
    ];
  } else {
    existing.sourceContributions.push({
      source,
      score,
      houses: [...houses],
    });
  }

  return;
}

   activationMap.set(area, {
  area,
  score,
  sources: [source],

  sourceContributions: [
    {
      source,
      score,
      houses: [...houses],
    },
  ],
});
  };

for (const area of params.lordshipAreas) {
  addActivation(
    area,
    "lordship",
    3,
    getHousesForArea(
      params.ruledHouses,
      area
    )
  );
}

for (
  const area of params.natalPlacementAreas
) {
  addActivation(
    area,
    "natal_placement",
    2,
    params.natalHouse
      ? getHousesForArea(
          [params.natalHouse],
          area
        )
      : []
  );
}

for (const area of params.dispositorAreas) {
  addActivation(
    area,
    "dispositor",
    1,
    getHousesForArea(
      params.dispositorRuledHouses,
      area
    )
  );
}

  return Array.from(
    activationMap.values()
  ).sort(
    (a, b) => b.score - a.score
  );
}
function buildDashaPeriodAreaActivations(
  planetActivations: DashaPlanetActivation[]
): DashaPeriodAreaActivation[] {
  const areaMap =
    new Map<
      LifeArea,
      DashaPeriodAreaActivation
    >();

  for (const activation of planetActivations) {
    for (
      const areaActivation of
        activation.areaActivations
    ) {
      const contribution =
        areaActivation.score *
        activation.strength;

      const contributor = {
        planet: activation.planet,
        dashaStrength:
          activation.strength,
        areaScore:
          areaActivation.score,
        contribution,
      };

      const existing =
        areaMap.get(
          areaActivation.area
        );

      if (existing) {
        existing.score += contribution;
        existing.confirmationCount += 1;
        existing.contributors.push(
          contributor
        );
        continue;
      }

      areaMap.set(
        areaActivation.area,
        {
          area: areaActivation.area,
          score: contribution,
          confirmationCount: 1,
          contributors: [contributor],
        }
      );
    }
  }

  return Array.from(
    areaMap.values()
  ).sort((a, b) => {
  if (b.score !== a.score) {
    return b.score - a.score;
  }

  return (
    b.confirmationCount -
    a.confirmationCount
  );
});
}
export function resolveDashaActivation(
  input: DashaActivationInput
): DashaActivationResult {
  const activePeriods: DashaPeriod[] = [
    {
      planet: input.mahadasha,
      level: "mahadasha",
    },
  ];

  if (input.antardasha) {
    activePeriods.push({
      planet: input.antardasha,
      level: "antardasha",
    });
  }

  if (input.pratyantardasha) {
    activePeriods.push({
      planet: input.pratyantardasha,
      level: "pratyantardasha",
    });
  }

  const activationMap = new Map<
    PlanetName,
    DashaPlanetActivation
  >();

  for (const period of activePeriods) {
    const existing =
      activationMap.get(period.planet);

    if (existing) {
      existing.levels.push(period.level);

      existing.strength +=
        DASHA_LEVEL_STRENGTH[period.level];

      existing.reasons.push(
        `${period.planet} is active at the ${period.level} level.`
      );

      continue;
    }
    const ruledHouses =
  input.ascendant
    ? getPlanetLordships(
        input.ascendant,
        period.planet
      )
    : [];
    const natalHouse =
  input.natalPositions?.[
    period.planet
  ]?.house;
  const natalSign =
  input.natalPositions?.[
    period.planet
  ]?.sign;

const isNode =
  period.planet === "Rahu" ||
  period.planet === "Ketu";

const dispositor =
  isNode && natalSign
    ? getSignLord(natalSign)
    : undefined;

const dispositorRuledHouses =
  dispositor && input.ascendant
    ? getPlanetLordships(
        input.ascendant,
        dispositor
      )
    : [];
    const lordshipAreas =
  getDashaActivatedAreas(
    ruledHouses
  );

const natalPlacementAreas =
  natalHouse
    ? getDashaActivatedAreas([
        natalHouse,
      ])
    : [];

const dispositorAreas =
  getDashaActivatedAreas(
    dispositorRuledHouses
  );
  const areaActivations =
  buildDashaAreaActivations({
    lordshipAreas,
    natalPlacementAreas,
    dispositorAreas,

    ruledHouses,
    natalHouse,
    dispositorRuledHouses,
  });

    activationMap.set(period.planet, {
  planet: period.planet,

  levels: [period.level],

  strength:
    DASHA_LEVEL_STRENGTH[period.level],

  ruledHouses,
  natalHouse,
  dispositor,
dispositorRuledHouses,
lordshipAreas,
natalPlacementAreas,
dispositorAreas,
areaActivations,
  areas:
  getDashaActivatedAreas([
    ...ruledHouses,

    ...(natalHouse
      ? [natalHouse]
      : []),

    ...dispositorRuledHouses,
  ]),

 reasons: [
  `${period.planet} is active at the ${period.level} level.`,

  ...(ruledHouses.length > 0
    ? [
        `${period.planet} activates the houses it rules: ${ruledHouses.join(
          ", "
        )}.`,
      ]
    : []),

  ...(natalHouse
    ? [
        `${period.planet} also activates its natal ${natalHouse}th house placement.`,
      ]
    : []),
    ...(dispositor
  ? [
      `${period.planet} is placed in ${natalSign}, so ${dispositor} acts as its sign dispositor.`,
    ]
  : []),

...(dispositorRuledHouses.length > 0
  ? [
      `${period.planet} therefore also activates the houses ruled by its dispositor ${dispositor}: ${dispositorRuledHouses.join(
        ", "
      )}.`,
    ]
  : []),
],
});
  }

  const planetActivations = Array.from(
    activationMap.values()
  ).sort(
    (a, b) => b.strength - a.strength
  );
const periodAreaActivations =
  buildDashaPeriodAreaActivations(
    planetActivations
  );
  const dominantPlanets =
    planetActivations.map(
      (activation) => activation.planet
    );

  return {
    activePeriods,
    planetActivations,
    dominantPlanets,
    periodAreaActivations,
  };
}