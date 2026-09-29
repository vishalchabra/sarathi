import type {
  LifeArea,
  PlanetName,
} from "../types";

import type {
  DashaActivationResult,
} from "../knowledge/dashaActivation";

import type {
  AscendantJudgement,
} from "./ascendantJudgementEngine";

import type {
  DashaTransitSynthesis,
  DashaTransitMatch,
} from "./dashaTransitSynthesis";
import {
  EVENT_THEMES,
  type EventThemeId,
} from "../knowledge/eventThemes";
import type {
  ActivatedSambandha,
} from "../knowledge/dashaSambandhaResolver";
import {
  resolveEventSambandha,
} from "../knowledge/eventSambandhaResolver";
import {
  getEventSambandhaBonus,
  getUniqueSambandhaActivePlanets,
  hasDualActiveSambandha,
} from "../knowledge/sambandhaEvidence";

import type {
  NatalPlanetPosition,
} from "../knowledge/natalSambandhaResolver";

import {
  getPlanetLordships,
} from "../knowledge/planetLordships";

export type EventActivationStrength =
  | "strong"
  | "moderate"
  | "weak";

export type EventActivationPolarity =
  | "supportive"
  | "challenging"
  | "mixed"
  | "neutral";
export type CandidateEventTheme = {
  id: EventThemeId;

  label: string;

  area: LifeArea;

  description: string;

  matchedPrimaryHouses: number[];

  matchedSupportingHouses: number[];
    primaryHouseScore: number;

  supportingHouseScore: number;

  evidenceScore: number;
    primaryPlanetConfirmationCount: number;

  planetConfirmationCount: number;
  discriminatorPlanetMatches: PlanetName[];

primaryDiscriminatorPlanetMatches:
  PlanetName[];
discriminatorSourceMatches: (
  | "lordship"
  | "natal_placement"
  | "dispositor"
)[];

matchedDiscriminatorEvidence: {

  house: number;
  planet: PlanetName;
  source:
    | "lordship"
    | "natal_placement"
    | "dispositor";
  score: number;
}[];

transitDiscriminatorPlanetMatches: PlanetName[];
matchedTransitDiscriminatorEvidence: {
  planet: PlanetName;
   house: number;
  importance: number;
  polarity:
    | "supportive"
    | "challenging"
    | "mixed"
    | "neutral";
  source: string;
}[];
matchedEventHouseTransits: {
  planet: PlanetName;
  house: number;
  houseRole: "primary" | "supporting";
  source: string;
  importance: number;
}[];
transitDiscriminatorScore: number;
combinedDiscriminatorScore: number;
discriminatorConfidence: number | null;
manifestationScore: number;
discriminatorPolarityApplicable: boolean;
discriminatorPolarityMatch: boolean;

discriminatorScore: number;
  confidenceScore: number;

  confidence:
    | "high"
    | "moderate"
    | "low";
hasMoonSambandhaConfirmation?: boolean;
};
export type EventActivation = {
  area: LifeArea;

  timingScore: number;

  strength: EventActivationStrength;

  polarity: EventActivationPolarity;

  dashaPlanets: PlanetName[];

  activatedHouses: number[];
   transitMatches: DashaTransitMatch[];
houseEvidence: {
  house: number;

  planet: PlanetName;

  source:
    | "lordship"
    | "natal_placement"
    | "dispositor";

  area: LifeArea;

  score: number;
}[];
rankedHouses: {
  house: number;

  score: number;

  confirmationCount: number;
  planetConfirmationCount: number;
  planets: PlanetName[];

  sources: (
    | "lordship"
    | "natal_placement"
    | "dispositor"
  )[];
}[];
candidateEvents: CandidateEventTheme[];
reasons: string[];
};

export type EventActivationResult = {
  activations: EventActivation[];

  strongestActivations: EventActivation[];
};
function getDashaHouseEvidence(
  dasha: DashaActivationResult,
  area: LifeArea
): EventActivation["houseEvidence"] {
  const evidence:
    EventActivation["houseEvidence"] = [];

  for (
    const planetActivation of
      dasha.planetActivations
  ) {
    const areaActivation =
      planetActivation.areaActivations.find(
        (activation) =>
          activation.area === area
      );

    if (!areaActivation) {
      continue;
    }

    for (
      const contribution of
        areaActivation.sourceContributions
    ) {
      if (
        contribution.houses.length === 0
      ) {
        continue;
      }

      const scorePerHouse =
        contribution.score /
        contribution.houses.length;

      for (
        const house of
          contribution.houses
      ) {
        evidence.push({
          house,

          planet:
            planetActivation.planet,

          source:
            contribution.source,

          area,

          score:
            scorePerHouse,
        });
      }
    }
  }

  return evidence;
}
function getActivatedHouses(
  evidence: EventActivation["houseEvidence"]
): number[] {
  return [
    ...new Set(
      evidence.map(
        (item) => item.house
      )
    ),
  ].sort(
    (a, b) => a - b
  );
}
function rankHouseEvidence(
  evidence: EventActivation["houseEvidence"]
): EventActivation["rankedHouses"] {
  const houseMap = new Map<
    number,
    EventActivation["rankedHouses"][number]
  >();

  for (const item of evidence) {
    const existing =
      houseMap.get(item.house);

    if (existing) {
      existing.score += item.score;

      existing.confirmationCount += 1;

      if (
  !existing.planets.includes(
    item.planet
  )
) {
  existing.planets.push(
    item.planet
  );

  existing.planetConfirmationCount += 1;
}

      if (
        !existing.sources.includes(
          item.source
        )
      ) {
        existing.sources.push(
          item.source
        );
      }

      continue;
    }

    houseMap.set(item.house, {
      house: item.house,

      score: item.score,

      confirmationCount: 1,
      planetConfirmationCount: 1,
      planets: [
        item.planet,
      ],

      sources: [
        item.source,
      ],
    });
  }

  return [
  ...houseMap.values(),
].sort((a, b) => {
  if (b.score !== a.score) {
    return b.score - a.score;
  }

  if (
    b.planetConfirmationCount !==
    a.planetConfirmationCount
  ) {
    return (
      b.planetConfirmationCount -
      a.planetConfirmationCount
    );
  }

  return (
    b.confirmationCount -
    a.confirmationCount
  );
});
}
function getCandidateConfidence(
  score: number
): CandidateEventTheme["confidence"] {
  if (score >= 70) {
    return "high";
  }

  if (score >= 45) {
    return "moderate";
  }

  return "low";
}

function buildCandidateEventThemes(
  area: LifeArea,

  rankedHouses:
    EventActivation["rankedHouses"],

  houseEvidence:
    EventActivation["houseEvidence"],

  transitMatches:
    EventActivation["transitMatches"],

  timingScore: number,

  polarity:
    EventActivationPolarity,

 activatedSambandha:
  ActivatedSambandha[] = [],
moonNakshatraLord?: PlanetName
,
natalPositions?: Partial<
  Record<PlanetName, NatalPlanetPosition>
>
): CandidateEventTheme[] {
     const activatedHouses =
    rankedHouses.map(
      (item) => item.house
    );
  return EVENT_THEMES
    .filter(
      (theme) => theme.area === area
    )
    .map((theme) => {
      const eventSambandhaEvidence =
  resolveEventSambandha({
    primaryHouses: theme.primaryHouses,
    supportingHouses: theme.supportingHouses,
    connections: activatedSambandha,
  });
  const moonLordNatalPrimaryMatch =
  moonNakshatraLord &&
  natalPositions?.[moonNakshatraLord]
    ? theme.primaryHouses.includes(
        natalPositions[moonNakshatraLord]!.house
      )
    : false;
      const matchedPrimaryHouses =
        theme.primaryHouses.filter(
          (house) =>
            activatedHouses.includes(
              house
            )
        );
  const moonSambandhaPrimaryConfirmations =
  moonNakshatraLord
    ? activatedSambandha.filter((connection) => {
        if (
          !connection.planets.includes(
            moonNakshatraLord
          )
        ) {
          return false;
        }

        return connection.planets.some(
          (planet, index) => {
            if (
              planet === moonNakshatraLord ||
              !connection.activePlanets.includes(
                planet
              )
            ) {
              return false;
            }

            const ruledHouses =
              index === 0
                ? connection.planetLordships.first
                : connection.planetLordships.second;

            return ruledHouses.some((house) =>
              theme.primaryHouses.includes(house)
            );
          }
        );
      })
    : [];
    const moonPrimaryConfirmation =
  moonLordNatalPrimaryMatch ||
  moonSambandhaPrimaryConfirmations.length > 0;
    if (
  process.env.NODE_ENV === "development" &&
  area === "money"
) {
  console.log("[MOON EVENT CONFIRMATION]", {
    event: theme.id,
    moonLordNatalPrimaryMatch,
    confirmingPairs:
      moonSambandhaPrimaryConfirmations.map(
        (connection) => connection.planets
      ),
  });
}
  if (
  process.env.NODE_ENV === "development" &&
  area === "money" &&
  moonNakshatraLord
) {
  const moonConnections = activatedSambandha.filter(
    (connection) =>
      connection.planets.includes(moonNakshatraLord)
  );

  console.dir(
    {
      event: theme.id,
      moonNakshatraLord,
      natalPosition:
        natalPositions?.[moonNakshatraLord] ?? null,
      primaryHouses: theme.primaryHouses,
      supportingHouses: theme.supportingHouses,
      connections: moonConnections.map((connection) => ({
        planets: connection.planets,
        relationshipTypes: connection.relationshipTypes,
        activePlanets: connection.activePlanets,
        connectedHouses: connection.connectedHouses,
        matchesPrimaryHouses:
  connection.connectedHouses.filter((house) =>
    theme.primaryHouses.includes(house)
  ),
activePartnerPrimaryHouses:
  connection.planets.flatMap((planet, index) =>
    connection.activePlanets.includes(planet)
      ? (
          index === 0
            ? connection.planetLordships.first
            : connection.planetLordships.second
        ).filter((house) =>
          theme.primaryHouses.includes(house)
        )
      : []
  ),
matchesSupportingHouses:
  connection.connectedHouses.filter((house) =>
    theme.supportingHouses.includes(house)
  ),
      })),
    },
    { depth: null }
  );
}


      const matchedSupportingHouses =
        theme.supportingHouses.filter(
          (house) =>
            activatedHouses.includes(
              house
            )
        );
           const primaryHouseEvidence =
        rankedHouses.filter(
          (item) =>
            matchedPrimaryHouses.includes(
              item.house
            )
        );

      const supportingHouseEvidence =
        rankedHouses.filter(
          (item) =>
            matchedSupportingHouses.includes(
              item.house
            )
        );

      const primaryHouseScore =
        primaryHouseEvidence.reduce(
          (total, item) =>
            total + item.score,
          0
        );

      const supportingHouseScore =
        supportingHouseEvidence.reduce(
          (total, item) =>
            total + item.score,
          0
        );
      const primaryConfirmingPlanets =
  new Set<PlanetName>();

for (
  const item of primaryHouseEvidence
) {
  for (
    const planet of item.planets
  ) {
    primaryConfirmingPlanets.add(
      planet
    );
  }
}
      const confirmingPlanets =
        new Set<PlanetName>();

      for (
        const item of [
          ...primaryHouseEvidence,
          ...supportingHouseEvidence,
        ]
      ) {
        for (
          const planet of item.planets
        ) {
          confirmingPlanets.add(
            planet
          );
        }
      }

      const evidenceScore =
        primaryHouseScore +
        supportingHouseScore * 0.5;
        const totalHouseScore =
  rankedHouses.reduce(
    (total, item) =>
      total + item.score,
    0
  );

const primaryCoverage =
  totalHouseScore > 0
    ? primaryHouseScore /
      totalHouseScore
    : 0;
        const timingComponent =
  Math.min(
    40,
    timingScore * 0.4
  );

const primaryEvidenceComponent =
  Math.min(
    30,
    primaryCoverage * 30
  );

const primaryPlanetComponent =
  Math.min(
    20,
    primaryConfirmingPlanets.size * 10
  );

const supportingEvidenceComponent =
  Math.min(
    10,
    supportingHouseScore * 2
  );

const confidenceScore =
  Math.round(
    timingComponent +
      primaryEvidenceComponent +
      primaryPlanetComponent +
      supportingEvidenceComponent
  );
const matchedDiscriminatorEvidence =
  houseEvidence.filter(
    (evidence) => {
      if (
        !matchedPrimaryHouses.includes(
          evidence.house
        ) &&
        !matchedSupportingHouses.includes(
          evidence.house
        )
      ) {
        return false;
      }

      return (
        theme.discriminators?.signatures?.some(
          (signature) => {
            if (
              signature.planet !==
              evidence.planet
            ) {
              return false;
            }

            if (
              !signature.sources ||
              signature.sources.length === 0
            ) {
              return true;
            }

            return signature.sources.includes(
              evidence.source
            );
          }
        ) ?? false
      );
    }
  );

const discriminatorPlanetMatches = [
  ...new Set(
    matchedDiscriminatorEvidence.map(
      (evidence) =>
        evidence.planet
    )
  ),
];

const primaryDiscriminatorPlanetMatches =
  [
    ...new Set(
      matchedDiscriminatorEvidence
        .filter((evidence) =>
          matchedPrimaryHouses.includes(
            evidence.house
          )
        )
        .map(
          (evidence) =>
            evidence.planet
        )
    ),
  ];

const discriminatorSourceMatches = [
  ...new Set(
    matchedDiscriminatorEvidence.map(
      (evidence) =>
        evidence.source
    )
  ),
];
const transitDiscriminatorPlanetMatches =
  [
    ...new Set(
      transitMatches
        .filter(
          (match) =>
            match.transitPlanet &&
            theme.discriminators?.signatures?.some(
              (signature) =>
                signature.planet ===
                match.transitPlanet
            )
        )
        .map(
          (match) =>
            match.transitPlanet!
        )
    ),
  ];
  const matchedTransitDiscriminatorEvidence =
  transitMatches
    .filter((match) => {
      if (!match.transitPlanet) {
        return false;
      }

      // Moon nakshatra is a daily area-emphasis signal.
      // It should affect timing/prioritisation, but should
      // not by itself select a specific manifestation.
    if (
  match.transitSource === "moon_nakshatra" ||
  match.transitSource === "moon_condition"
) {
  return false;
}
// A transit planet can discriminate between event themes only
// when it activates a primary or supporting house of that event.
if (
  match.transitHouse === undefined ||
  !(
    theme.primaryHouses.includes(match.transitHouse) ||
    theme.supportingHouses.includes(match.transitHouse)
  )
) {
  return false;
}
      return (
        theme.discriminators
          ?.signatures
          ?.some(
            (signature) =>
              signature.planet ===
              match.transitPlanet
          ) ?? false
      );
    })
    .map((match) => ({
      planet:
        match.transitPlanet!,
      house: match.transitHouse!,
      importance:
        match.transitImportance,

      polarity:
        match.transitPolarity,

      source:
        match.transitSource,
    }));
    // Multiple evidence sources for the same planet in the same
// house represent one transit activation for scoring purposes.
// Retain the strongest importance for each planet-house pair.
const uniqueTransitDiscriminators = new Map<string, number>();

for (const match of transitMatches) {
  if (
    !match.transitPlanet ||
    match.transitHouse === undefined ||
    match.transitSource === "moon_nakshatra" ||
match.transitSource === "moon_condition" ||

    !matchedTransitDiscriminatorEvidence.some(
      (evidence) =>
        evidence.planet === match.transitPlanet &&
evidence.house === match.transitHouse &&
evidence.source === match.transitSource &&
evidence.importance === match.transitImportance
    )
  ) {
    continue;
  }

  const key = `${match.transitPlanet}:${match.transitHouse}`;

  uniqueTransitDiscriminators.set(
    key,
    Math.max(
      uniqueTransitDiscriminators.get(key) ?? 0,
      match.transitImportance
    )
  );
}

const transitDiscriminatorScore = Math.min(
  15,
  [...uniqueTransitDiscriminators.values()].reduce(
    (total, importance) => {
      if (importance >= 30) return total + 7;
      if (importance >= 20) return total + 5;
      if (importance >= 10) return total + 3;
      return total + 1;
    },
    0
  )
);
  const matchedEventHouseTransits = transitMatches
  .filter(
    (match) =>
      match.transitPlanet !== undefined &&
      match.transitHouse !== undefined &&
      match.transitSource !== "moon_nakshatra" &&
      match.transitSource !== "moon_condition"
  )
  .flatMap((match) => {
    const house = match.transitHouse!;

    const houseRole: "primary" | "supporting" | null =
      theme.primaryHouses.includes(house)
        ? "primary"
        : theme.supportingHouses.includes(house)
          ? "supporting"
          : null;

    if (!houseRole) return [];

    return [{
      planet: match.transitPlanet!,
      house,
      houseRole,
      source: match.transitSource,
      importance: match.transitImportance,
    }];
  });
const supportingOnlyDiscriminatorMatches =
  discriminatorPlanetMatches.filter(
    (planet) =>
      !primaryDiscriminatorPlanetMatches.includes(
        planet
      )
  );
const discriminatorPolarityApplicable =
  Boolean(
    theme.discriminators?.polarity &&
      theme.discriminators.polarity.length > 0
  );

const discriminatorPolarityMatch =
  discriminatorPolarityApplicable
    ? theme.discriminators!.polarity!.includes(
        polarity
      )
    : false;
const planetDiscriminatorScore =
  primaryDiscriminatorPlanetMatches.length *
    10 +
  supportingOnlyDiscriminatorMatches.length *
    5;

const polarityDiscriminatorScore =
  discriminatorPolarityApplicable &&
  discriminatorPolarityMatch
    ? 5
    : 0;

const discriminatorScore =
  planetDiscriminatorScore +
  polarityDiscriminatorScore;
  const combinedDiscriminatorScore =
  discriminatorScore +
  transitDiscriminatorScore;
  const hasDiscriminatorDefinition =
  Boolean(
    theme.discriminators?.signatures?.length ||
    theme.discriminators?.polarity?.length
  );

const discriminatorConfidence =
  hasDiscriminatorDefinition
    ? Math.min(
        100,
        Math.round(
          (combinedDiscriminatorScore / 30) *
            100
        )
      )
    : null;
    const sambandhaBonus =
  getEventSambandhaBonus(
    eventSambandhaEvidence,
    matchedPrimaryHouses,
    timingScore
  );
const moonConfirmationBonus =
  moonLordNatalPrimaryMatch &&
  moonSambandhaPrimaryConfirmations.length > 0
    ? 3
    : moonLordNatalPrimaryMatch
      ? 1
      : 0;
  const baseManifestationScore =
  discriminatorConfidence === null
    ? confidenceScore
    : Math.round(
        confidenceScore * 0.6 +
        discriminatorConfidence * 0.4
      );

const manifestationScore = Math.min(
  100,
  baseManifestationScore +
    sambandhaBonus +
    moonConfirmationBonus
);
const confidence =
  getCandidateConfidence(
    confidenceScore
  );

      return {
  id: theme.id,
  label: theme.label,
  area: theme.area,
  description:
    theme.description,

  matchedPrimaryHouses,
  matchedSupportingHouses,

  primaryHouseScore,

  supportingHouseScore,

  evidenceScore,

  primaryPlanetConfirmationCount:
    primaryConfirmingPlanets.size,

  planetConfirmationCount:
    confirmingPlanets.size,
discriminatorPlanetMatches,

primaryDiscriminatorPlanetMatches,

discriminatorSourceMatches,

matchedDiscriminatorEvidence,

transitDiscriminatorPlanetMatches:
  [...new Set(
    matchedTransitDiscriminatorEvidence.map(
      (evidence) => evidence.planet
    )
  )],
matchedTransitDiscriminatorEvidence,
matchedEventHouseTransits,
transitDiscriminatorScore,

combinedDiscriminatorScore,

discriminatorConfidence,

manifestationScore,

discriminatorPolarityApplicable,
discriminatorPolarityMatch,

discriminatorScore,
 confidenceScore,

confidence,
};
    })
        .filter(
      (theme) =>
        theme.matchedPrimaryHouses
          .length > 0
    )
    .sort((a, b) => {
  if (
    b.manifestationScore !==
    a.manifestationScore
  ) {
    return (
      b.manifestationScore -
      a.manifestationScore
    );
  }

  if (
    b.confidenceScore !==
    a.confidenceScore
  ) {
    return (
      b.confidenceScore -
      a.confidenceScore
    );
  }

  if (
    b.evidenceScore !==
    a.evidenceScore
  ) {
    return (
      b.evidenceScore -
      a.evidenceScore
    );
  }

  return (
    b.primaryPlanetConfirmationCount -
    a.primaryPlanetConfirmationCount
  );
});
}
function summarizeEventSambandha(
  event: CandidateEventTheme,
  activatedSambandha: ActivatedSambandha[],
  activatedHouses: number[]
) {
  const theme = EVENT_THEMES.find(
    (item) => item.id === event.id
  );

  if (!theme) return [];

  const connections = resolveEventSambandha({
    primaryHouses: theme.primaryHouses,
    supportingHouses: theme.supportingHouses,
    connections: activatedSambandha,
  });

  return connections.map((connection) => {
    const connectedHouses = [
      ...new Set([
        ...connection.firstPlanetHouses,
        ...connection.secondPlanetHouses,
      ]),
    ];

    return {
      connectionId: connection.connectionId,
      activePlanets: connection.activePlanets,
      bothPlanetsActive:
        connection.activePlanetCount === 2,
      independentlyActivatedHouses:
        connectedHouses.filter((house) =>
          activatedHouses.includes(house)
        ),
      connectedButUnactivatedHouses:
        connectedHouses.filter(
          (house) => !activatedHouses.includes(house)
        ),
    };
  });
}
function isEventAgeAppropriate(
  eventId: EventThemeId,
  age?: number
): boolean {
  if (age === undefined || age >= 18) {
    return true;
  }

  const adultOnlyEvents: EventThemeId[] = [
    "career_movement",
    "career_responsibility",
    "career_recognition",
    "career_change",
    "workload_service",
    "money_inflow",
    "money_outflow",
    "money_planning",
    "money_accumulation",
    "money_settlement",
    "children_responsibility",
    "children_concern",
    "relationship_commitment",
    "property_attention",
    "property_progress",
    "property_complication",
  ];

  return !adultOnlyEvents.includes(eventId);
}
export function buildEventActivations(params: {
  dasha: DashaActivationResult;
  transit: AscendantJudgement;
  synthesis: DashaTransitSynthesis;
  activatedSambandha?: ActivatedSambandha[];
  moonPadaData?: {
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  navamsaSign: string | null;
  navamsaLord: string | null;
} | null;

natalPositions?: Partial<
  Record<PlanetName, NatalPlanetPosition>
>;
age?: number;
}): EventActivationResult {
 
if (process.env.NODE_ENV === "development") {
  const nakshatraLord =
    params.moonPadaData?.nakshatraLord as PlanetName | undefined;

  const navamsaLord =
    params.moonPadaData?.navamsaLord as PlanetName | undefined;

  console.log("[MOON LORD NATAL POSITIONS]", {
    nakshatraLord,
    nakshatraLordNatal: nakshatraLord
      ? params.natalPositions?.[nakshatraLord]
      : null,
    navamsaLord,
    navamsaLordNatal: navamsaLord
      ? params.natalPositions?.[navamsaLord]
      : null,
  });
  console.log("[MOON LORD HOUSES]", {
  nakshatraLord: {
    planet: nakshatraLord,
    natalHouse: nakshatraLord
      ? params.natalPositions?.[nakshatraLord]?.house
      : null,
  },
  navamsaLord: {
    planet: navamsaLord,
    natalHouse: navamsaLord
      ? params.natalPositions?.[navamsaLord]?.house
      : null,
  },
});

console.log("[MOON LORD LORDSHIPS]", {
  nakshatraLord: nakshatraLord
    ? getPlanetLordships(
        params.transit.ascendant,
        nakshatraLord
      )
    : [],

  navamsaLord: navamsaLord
    ? getPlanetLordships(
        params.transit.ascendant,
        navamsaLord
      )
    : [],
});

console.log("[MOON DAILY HOUSE CONNECTIONS]", {
  nakshatra: nakshatraLord
    ? {
        planet: nakshatraLord,
        ruledHouses: getPlanetLordships(
          params.transit.ascendant,
          nakshatraLord
        ),
        natalHouse:
          params.natalPositions?.[nakshatraLord]?.house ?? null,
      }
    : null,

  navamsa: navamsaLord
    ? {
        planet: navamsaLord,
        ruledHouses: getPlanetLordships(
          params.transit.ascendant,
          navamsaLord
        ),
        natalHouse:
          params.natalPositions?.[navamsaLord]?.house ?? null,
      }
    : null,
});

}

const moonNakshatraLord =
  params.transit.rankedSignals.find(
    (signal) =>
      signal.source === "moon_nakshatra"
  )?.nakshatraLord;
console.log("[MOON SIGNAL CHECK]",
  params.transit.rankedSignals
    .filter((signal) => signal.source === "moon_nakshatra")
    .map((signal) => ({
      planet: signal.planet,
      nakshatraLord: signal.nakshatraLord,
      area: signal.area,
    }))
);
if (
  process.env.NODE_ENV === "development" &&
  moonNakshatraLord
) {
  console.log("[MOON NAKSHATRA LORD]", {
    planet: moonNakshatraLord,
    natalPosition:
      params.natalPositions?.[moonNakshatraLord] ?? null,
    ruledHouses: getPlanetLordships(
      params.transit.ascendant,
      moonNakshatraLord
    ),
  });
}

const moonDailyEvidence = (
  ["nakshatraLord", "navamsaLord"] as const
).flatMap((source) => {
  const planet = params.moonPadaData?.[source] as
    | PlanetName
    | undefined;

  if (!planet) return [];

  const natalHouse =
    params.natalPositions?.[planet]?.house;

  return [{
    source,
    planet,
    ruledHouses: getPlanetLordships(
      params.transit.ascendant,
      planet
    ),
    natalHouse: natalHouse ?? null,
    connectsDashaDirectly:
      params.dasha.dominantPlanets.includes(planet),
  }];
});

  const activations: EventActivation[] =
    params.synthesis.areaSyntheses.map(
  (areaSynthesis) => {
    const houseEvidence =
      getDashaHouseEvidence(
        params.dasha,
        areaSynthesis.area
      );
    const activatedHouses =
  getActivatedHouses(
    houseEvidence
  );

const rankedHouses =
  rankHouseEvidence(
    houseEvidence
  );

const candidateEvents = buildCandidateEventThemes(
  areaSynthesis.area,
  rankedHouses,
  houseEvidence,
  areaSynthesis.transitMatches,
  areaSynthesis.timingScore,
  areaSynthesis.activationPolarity,
  params.activatedSambandha ?? [],
  moonNakshatraLord,
  params.natalPositions
).filter((event) =>
  isEventAgeAppropriate(event.id, params.age)
);
  
const moonEventEvidence = candidateEvents.map((event) => {
  const theme = EVENT_THEMES.find(
    (item) => item.id === event.id
  );

  const connections = moonDailyEvidence.map((evidence) => {
    const connectedHouses = [
      ...new Set([
        ...evidence.ruledHouses,
        ...(evidence.natalHouse !== null
          ? [evidence.natalHouse]
          : []),
      ]),
    ];

    return {
      source: evidence.source,
      planet: evidence.planet,
      matchedPrimaryHouses:
        theme?.primaryHouses.filter((house) =>
          connectedHouses.includes(house)
        ) ?? [],
      matchedSupportingHouses:
        theme?.supportingHouses.filter((house) =>
          connectedHouses.includes(house)
        ) ?? [],
      connectsDashaDirectly:
        evidence.connectsDashaDirectly,
    newPrimaryHouses:
  (theme?.primaryHouses ?? []).filter(
    (house) =>
      connectedHouses.includes(house) &&
      !activatedHouses.includes(house)
  ),

newSupportingHouses:
  (theme?.supportingHouses ?? []).filter(
    (house) =>
      connectedHouses.includes(house) &&
      !activatedHouses.includes(house)
  ),
    };
  });

  return { event: event.id, connections };
});
const moonEvidenceByEvent = new Map(
  moonEventEvidence.map(({ event, connections }) => [
    event,
    connections,
  ])
);

const moonAdjustedEvents = candidateEvents
  .map((event) => {
    const moonEvidence = (
      moonEvidenceByEvent.get(event.id) ?? []
    ).map((evidence) => ({
      ...evidence,
      matchesEventDiscriminator:
        event.discriminatorPlanetMatches.includes(
          evidence.planet
        ),
    }));

    const confirmedEvidence = moonEvidence.filter(
      (evidence) =>
        evidence.matchesEventDiscriminator &&
        evidence.matchedPrimaryHouses.length > 0
    );

    const nakshatraConfirmed =
      confirmedEvidence.some(
        (evidence) =>
          evidence.source === "nakshatraLord"
      );

    const navamsaConfirmed =
      confirmedEvidence.some(
        (evidence) =>
          evidence.source === "navamsaLord"
      );

    const moonBonus =
      (nakshatraConfirmed ? 3 : 0) +
      (navamsaConfirmed ? 2 : 0);

    return {
      ...event,
      manifestationScore: Math.min(
        100,
        event.manifestationScore + moonBonus
      ),
      moonEvidence,
      hasMoonSambandhaConfirmation:
        confirmedEvidence.length > 0,
    };
  })
  .sort(
    (a, b) =>
      b.manifestationScore -
      a.manifestationScore
  );

if (process.env.NODE_ENV === "development") {
  console.log(
    "[MOON DISCRIMINATOR MATCHES]",
    JSON.stringify(
      moonAdjustedEvents
        .map((event) => ({
          event: event.id,
          matches: event.moonEvidence.filter(
            (evidence) =>
              evidence.matchesEventDiscriminator
          ),
        }))
        .filter((event) => event.matches.length > 0),
      null,
      2
    )
  );
}
if (process.env.NODE_ENV === "development") {
  console.log(
    "[NEW MOON CONFIRMATIONS]",
    JSON.stringify(
      moonEventEvidence
        .map(({ event, connections }) => ({
          event,
          connections: connections.filter(
            (connection) =>
              connection.newPrimaryHouses.length > 0
          ),
        }))
        .filter((item) => item.connections.length > 0),
      null,
      2
    )
  );
}
  if (
  process.env.NODE_ENV === "development" &&
  areaSynthesis.area === "money"
) {
  console.dir(
    {
      area: areaSynthesis.area,
      timingScore: areaSynthesis.timingScore,
      rankedHouses,
      candidateEvents: moonAdjustedEvents,
    },
    { depth: null }
  );
}
    return {
        area: areaSynthesis.area,

        timingScore:
          areaSynthesis.timingScore,

        strength:
          areaSynthesis.timingStrength,

        polarity:
          areaSynthesis.activationPolarity,

        dashaPlanets: [
          ...areaSynthesis.dashaPlanets,
        ],

       activatedHouses,
       transitMatches:
    areaSynthesis.transitMatches,
houseEvidence,
rankedHouses,
  candidateEvents: moonAdjustedEvents,
        reasons: [
          `${areaSynthesis.area} has a timing score of ${areaSynthesis.timingScore}.`,
          `The activation strength is ${areaSynthesis.timingStrength}.`,
          `The activation polarity is ${areaSynthesis.activationPolarity}.`,
        ],
         };
  }
);

  const strongestActivations =
    activations.filter(
      (activation) =>
        activation.strength === "strong"
    );

  return {
    activations,
    strongestActivations,
  };
}
