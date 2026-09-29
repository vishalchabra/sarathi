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
    ActivatedSambandha[] = []
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
      const matchedPrimaryHouses =
        theme.primaryHouses.filter(
          (house) =>
            activatedHouses.includes(
              house
            )
        );

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
  const baseManifestationScore =
  discriminatorConfidence === null
    ? confidenceScore
    : Math.round(
        confidenceScore * 0.6 +
        discriminatorConfidence * 0.4
      );

const manifestationScore = Math.min(
  100,
  baseManifestationScore + sambandhaBonus
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

export function buildEventActivations(params: {
  dasha: DashaActivationResult;
  transit: AscendantJudgement;
  synthesis: DashaTransitSynthesis;
  activatedSambandha?: ActivatedSambandha[];
}): EventActivationResult {
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

const candidateEvents =
  buildCandidateEventThemes(
    areaSynthesis.area,
    rankedHouses,
    houseEvidence,
    areaSynthesis.transitMatches,
    areaSynthesis.timingScore,
    areaSynthesis.activationPolarity,
    params.activatedSambandha ?? []
  );
  if (process.env.NODE_ENV === "development") {
  console.log(
    "[EVENT_TRANSIT_HOUSES]",
    JSON.stringify(
      {
        area: areaSynthesis.area,
        events: candidateEvents.map((event) => ({
          event: event.id,
          primaryHouses: event.matchedPrimaryHouses,
          supportingHouses: event.matchedSupportingHouses,
          unmatchedSupportingHouses:
  EVENT_THEMES.find(
    (theme) => theme.id === event.id
  )?.supportingHouses.filter(
    (house) =>
      !event.matchedSupportingHouses.includes(house)
  ) ?? [],
          transits: event.matchedEventHouseTransits,
          discriminatorPlanets:
  event.discriminatorPlanetMatches,

sambandhaEvidence: summarizeEventSambandha(
  event,
  params.activatedSambandha ?? [],
  activatedHouses
),
uniqueSambandhaActivePlanets:
  getUniqueSambandhaActivePlanets(
    summarizeEventSambandha(
      event,
      params.activatedSambandha ?? [],
      activatedHouses
    )
  ),
  hasDualActiveSambandha:
  hasDualActiveSambandha(
    summarizeEventSambandha(
      event,
      params.activatedSambandha ?? [],
      activatedHouses
    )
  ),
transitDiscriminatorPlanets:
  event.transitDiscriminatorPlanetMatches,

discriminatorScore:
  event.discriminatorScore,

transitDiscriminatorScore:
  event.transitDiscriminatorScore,

manifestationScore:
  event.manifestationScore,
  sambandhaBonus:
  getEventSambandhaBonus(
    resolveEventSambandha({
      primaryHouses:
        EVENT_THEMES.find(
          (theme) => theme.id === event.id
        )!.primaryHouses,
      supportingHouses:
        EVENT_THEMES.find(
          (theme) => theme.id === event.id
        )!.supportingHouses,
      connections:
        params.activatedSambandha ?? [],
    }),
    event.matchedPrimaryHouses,
    areaSynthesis.timingScore
  ),
  baseManifestationScore:
  event.manifestationScore -
  getEventSambandhaBonus(
    resolveEventSambandha({
      primaryHouses:
        EVENT_THEMES.find(
          (theme) => theme.id === event.id
        )!.primaryHouses,
      supportingHouses:
        EVENT_THEMES.find(
          (theme) => theme.id === event.id
        )!.supportingHouses,
      connections: params.activatedSambandha ?? [],
    }),
    event.matchedPrimaryHouses,
    areaSynthesis.timingScore
  ),
        })),
      },
      null,
      2
    )
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
  candidateEvents,
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
