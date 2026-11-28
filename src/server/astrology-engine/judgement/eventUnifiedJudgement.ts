import {
  resolveUnifiedEventAgeEligibility,
} from "../knowledge/eventJudgementRules";

import {
  resolveEventHoraEvidence,
} from "./eventHoraEvidence";

import {
  resolveEventConnectedDasha,
} from "./eventConnectedDashaResolver";

import {
  resolveConnectedFoundation,
} from "./eventConnectedFoundationResolver";

import {
  resolveDivisionalConnectedEvidence,
} from "./eventDivisionalConnectedEvidence";

import {
  validateEventDashaActivations,
} from "./eventDashaValidation";

const CONNECTED_DASHA_WEIGHT = 0.75;

import type {
  PlanetName,
} from "../types";

import type {
  PersonalizedDailyPredictionInput,
} from "../personalizedDailyPredictionGenerator";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import type {
  DashaPlanetActivation,
} from "../knowledge/dashaActivation";

import {
  resolveEventNatalPotential,
} from "./eventNatalPotentialResolver";

import {
  resolveEventNatalMediation,
} from "./eventNatalMediationResolver";

import {
  resolveEventJudgementEvidence,
} from "./eventJudgementEvidence";

import {
  resolveEventTransitGeometry,
} from "./eventTransitGeometry";

import {
  resolveEventTransitEvidence,
} from "./eventTransitEvidence";

import {
  resolveEventMoonTrigger,
} from "./eventMoonTriggerResolver";

import type {
  MoonTriggerContext,
} from "./eventMoonTriggerResolver";

import {
  resolveEventDivisionalEvidence,
} from "./eventDivisionalEvidence";

import {
  resolveEventPlanetaryStrengthEvidence,
} from "./eventPlanetaryStrengthEvidence";

import {
  resolveEventAshtakavargaEvidence,
} from "./eventAshtakavargaEvidence";

import {
  scoreUnifiedEvent,
} from "./eventUnifiedScoring";

type StrengthInput = Parameters<
  typeof resolveEventPlanetaryStrengthEvidence
>[0];

type AshtakavargaInput = Parameters<
  typeof resolveEventAshtakavargaEvidence
>[0];

export type UnifiedJudgementInput = {
  prediction: PersonalizedDailyPredictionInput;

  dashaActivations: readonly DashaPlanetActivation[];

  moon: Pick<
    MoonTriggerContext,
    "nakshatraLord" |
    "navamsaLord" |
    "nakshatra" |
    "pada"
  >;

  shadbala?: StrengthInput["shadbala"];

  afflictions?: StrengthInput["afflictions"];

  ashtakvarga?: AshtakavargaInput["ashtakvarga"];
};

const EVENT_SIGNIFICATORS: Record<
  string,
  readonly PlanetName[]
> = {
  career_movement: [
    "Sun", "Saturn", "Mercury",
  ],

  career_interview_invitation: [
    "Mercury", "Sun", "Jupiter",
  ],

  career_job_offer: [
    "Mercury", "Jupiter", "Saturn",
  ],

  career_responsibility: [
    "Sun", "Saturn", "Mars",
  ],

  career_recognition: [
    "Sun", "Jupiter",
  ],

  career_change: [
    "Saturn", "Rahu", "Ketu",
  ],

  workload_service: [
    "Saturn", "Mars", "Mercury",
  ],

  money_inflow: [
    "Jupiter", "Venus", "Mercury",
  ],

  money_outflow: [
    "Saturn", "Mars", "Venus",
  ],

  money_planning: [
    "Mercury", "Saturn",
  ],

  money_accumulation: [
    "Jupiter", "Saturn",
  ],

  money_settlement: [
    "Saturn", "Mercury", "Jupiter",
  ],

  relationship_attention: ["Venus", "Moon"],
  relationship_harmony: ["Venus", "Jupiter", "Moon"],
  relationship_discussion: ["Mercury", "Venus", "Moon"],
  relationship_tension: ["Mars", "Saturn", "Rahu"],
  relationship_commitment: ["Venus", "Jupiter", "Saturn"],
  children_attention: ["Jupiter", "Moon"],
  children_progress: ["Jupiter", "Mercury", "Sun"],
  children_responsibility: ["Jupiter", "Saturn", "Moon"],
  children_concern: ["Moon", "Saturn", "Jupiter"],
  children_milestone: ["Jupiter", "Sun", "Mercury"],
  education_focus: ["Mercury", "Jupiter", "Saturn"],
  education_progress: ["Mercury", "Jupiter", "Sun"],
  education_challenge: ["Saturn", "Mercury", "Mars"],
  home_change: ["Moon", "Mars", "Saturn"],
  home_attention: ["Moon", "Venus"],
  home_stability: ["Moon", "Venus", "Jupiter"],
  family_responsibility: ["Moon", "Saturn", "Jupiter"],
  family_support: ["Moon", "Jupiter", "Venus"],
  family_discussion: ["Mercury", "Moon", "Jupiter"],
  family_tension: ["Mars", "Saturn", "Moon"],
  property_attention: ["Mars", "Venus", "Saturn"],
  property_progress: ["Mars", "Venus", "Jupiter"],
  property_complication: ["Saturn", "Mars", "Rahu"],
  travel_planning: ["Mercury", "Jupiter"],
  travel_movement: ["Mercury", "Moon", "Rahu"],
  travel_disruption: ["Saturn", "Mars", "Rahu"],
  communication_activity: ["Mercury", "Moon"],
  communication_clarity: ["Mercury", "Jupiter"],
  communication_friction: ["Mercury", "Mars", "Saturn"],
  mental_pressure: ["Moon", "Saturn", "Mercury"],
  emotional_stability: ["Moon", "Jupiter", "Venus"],
  health_attention: ["Sun", "Moon", "Saturn"],
  spiritual_practice: ["Jupiter", "Ketu", "Moon"],
  spiritual_introspection: ["Ketu", "Saturn", "Moon"],
  spiritual_learning: ["Jupiter", "Mercury", "Ketu"],
  spiritual_detachment: ["Ketu", "Saturn"],
  spiritual_guidance: ["Jupiter", "Ketu"],
  hidden_matters_revelation: ["Mercury", "Rahu", "Ketu"],
  hidden_matters_introspection: ["Moon", "Ketu", "Saturn"],
  hidden_matters_complication: ["Rahu", "Saturn", "Mars", "Ketu"],
  public_image_visibility: ["Sun", "Rahu", "Mercury"],
  public_image_recognition: ["Sun", "Jupiter"],
  public_image_pressure: ["Sun", "Saturn", "Rahu"],
};

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function coverage(
  count: number,
  minimum: number
): number {
  return minimum === 0
    ? 1
    : clamp(count / minimum);
}

export function resolveUnifiedEventJudgement(
  rule: EventJudgementRule,
  input: UnifiedJudgementInput
) {
  const prediction = input.prediction;

  const significators =
    EVENT_SIGNIFICATORS[rule.eventId];

  if (!significators) {
    throw new Error(
      `Unified judgement rule not configured: ${rule.eventId}`
    );
  }

  // 1. Natal foundation.

  const natal = resolveEventNatalPotential(
    rule,
    prediction
  );

  const mediation = resolveEventNatalMediation(
    rule,
    natal
  );

  const completeNatalData =
    !mediation.incompleteClassicalData;

  const natalFoundation =
    mediation.hasDirectSupport ||
    mediation.hasMediatedSupport;

  // 2. Dasha evidence.

  const dashaValidation =
    validateEventDashaActivations(
      {
        ascendant: prediction.ascendant,
        ...prediction.dasha,
        natalPositions: prediction.natalPositions,
      },
      input.dashaActivations
    );

  const validatedDashaActivations =
    dashaValidation.activations;

  const dasha = resolveEventJudgementEvidence(
    rule,
    validatedDashaActivations
  );

  const connectedDasha = resolveEventConnectedDasha(
    rule,
    prediction,
    validatedDashaActivations
  );

  // Connected evidence must belong to the
  // selected direct or mediated natal foundation.
  const foundationHouses = new Set(
    mediation.hasDirectSupport
      ? [
          ...natal.connectedCoreHouses,
          ...natal.connectedDistinctiveHouses,
        ]
      : mediation.hasMediatedSupport &&
        mediation.bestPath
        ? [
            ...mediation.bestPath.connectedCoreHouses,
            ...mediation.bestPath.connectedDistinctiveHouses,
          ]
        : []
  );

  const connectedFoundation =
    resolveConnectedFoundation(
      rule,
      natal,
      mediation,
      connectedDasha.foundationalEvidence,
      prediction
    );

  const qualifiedConnectedRows =
    connectedFoundation.qualifiedRows.filter(
      row =>
        completeNatalData &&
        natalFoundation &&
        foundationHouses.has(row.house)
    );

  const connectedActivePlanets = [
    ...new Set(
      qualifiedConnectedRows.map(
        row => row.activePlanet
      )
    ),
  ];

  const connectedCoreActivation =
    qualifiedConnectedRows.some(
      row => row.houseRole === "core"
    );

  const foundationalDashaRows =
    dasha.directEvidence.filter(
      row => row.judgementHouseRole !== "reinforcing"
    );

  const foundationalDashaPlanets = [
    ...new Set(
      foundationalDashaRows.map(row => row.planet)
    ),
  ];

  const activePeriods = [
    {
      planet: prediction.dasha.mahadasha,
      weight: 3,
    },
    {
      planet: prediction.dasha.antardasha,
      weight: 2,
    },
    {
      planet: prediction.dasha.pratyantardasha,
      weight: 1,
    },
  ];

  const completeDashaData =
    dashaValidation.valid &&
    activePeriods.every(
      period =>
        Boolean(
          period.planet &&
          prediction.natalPositions[period.planet]
        ) &&
        !natal.invalidNatalPlanets.includes(
          period.planet!
        )
    );

  const activePeriodWeight = activePeriods.reduce(
    (sum, period) =>
      sum + (
        period.planet &&
        foundationalDashaPlanets.includes(period.planet)
          ? period.weight
          : period.planet &&
            connectedActivePlanets.includes(period.planet)
            ? period.weight * CONNECTED_DASHA_WEIGHT
            : 0
      ),
    0
  );

  const dashaValue = completeDashaData
    ? clamp(activePeriodWeight / 6)
    : null;

  // 3. Independent transit evidence.

  const geometry = resolveEventTransitGeometry(
    prediction
  );

  const transit = resolveEventTransitEvidence(
    rule,
    dasha,
    geometry,
    qualifiedConnectedRows
  );

  const foundationalTransitRows =
    transit.qualifyingEvidence.filter(
      row => row.houseRole !== "reinforcing"
    );

  const foundationalTransitPlanets = [
    ...new Set(
      foundationalTransitRows.map(row => row.planet)
    ),
  ];

  const independentTransit =
    foundationalTransitRows.length > 0 &&
    transit.hasDashaTransitConvergence;

  const completeTransitData =
    geometry.missingTransitPlanets.filter(
      planet => planet !== "Moon"
    ).length === 0;

  const transitValue = completeTransitData
    ? independentTransit
      ? clamp(
          0.5 +
          (
            foundationalTransitPlanets.length >= 2
              ? 0.2
              : 0
          ) +
          (
            foundationalTransitRows.some(
              row => row.closeDegreeContact
            )
              ? 0.2
              : 0
          ) +
          (
            foundationalTransitRows.some(
              row => row.connectsDistinctEventHouses
            )
              ? 0.1
              : 0
          )
        )
      : 0
    : null;

  // 4. Combined house coverage.

  const combinedHouses = [
    ...new Set([
      ...foundationalDashaRows.map(row => row.house),
      ...qualifiedConnectedRows.map(row => row.house),
      ...foundationalTransitRows.map(row => row.house),
    ]),
  ];

  const combinedCoreHouses =
    rule.coreHouses.filter(
      house => combinedHouses.includes(house)
    );

  const combinedDistinctiveHouses = [
    ...new Set([
      ...rule.requiredDistinctiveHouses,
      ...rule.alternativeDistinctiveHouses,
    ]),
  ].filter(
    house => combinedHouses.includes(house)
  );

  const coreHouseCoverage =
    combinedCoreHouses.length >=
      rule.minimumCoreHouses;

  const distinctiveHouseCoverage =
    combinedDistinctiveHouses.length >=
      rule.minimumDistinctiveHouses &&
    rule.requiredDistinctiveHouses.every(
      house => combinedHouses.includes(house)
    );

  const coreCoverageRatio = coverage(
    combinedCoreHouses.length,
    rule.minimumCoreHouses
  );

  const distinctiveCoverageRatio = coverage(
    combinedDistinctiveHouses.length,
    rule.minimumDistinctiveHouses
  );

  const requiredCoverageRatio = coverage(
    rule.requiredDistinctiveHouses.filter(
      house => combinedHouses.includes(house)
    ).length,
    rule.requiredDistinctiveHouses.length
  );

  const houseValue =
    completeDashaData && completeTransitData
      ? rule.minimumDistinctiveHouses === 0 &&
        rule.requiredDistinctiveHouses.length === 0
        ? coreCoverageRatio
        : clamp(
            0.6 * coreCoverageRatio +
            0.4 * Math.min(
              distinctiveCoverageRatio,
              requiredCoverageRatio
            )
          )
      : null;

  // 5. Moon daily trigger.

  const moon = resolveEventMoonTrigger(
    rule,
    dasha,
    transit,
    geometry,
    {
      ascendant: prediction.ascendant,
      natalPositions: prediction.natalPositions,
      ...input.moon,
    },
    qualifiedConnectedRows
  );

  const completeMoonData =
    moon.hasMoonGeometry &&
    geometry.moonPosition?.longitude != null &&
    input.moon.nakshatraLord != null &&
    input.moon.navamsaLord != null;

  // Moon's permanent functional lordship alone
  // cannot establish a day-specific trigger.

  const dynamicMoonRows = moon.evidence.filter(
    row =>
      row.houseRole !== "reinforcing" &&
      row.sources.some(
        source =>
          source !== "moon_functional_lordship"
      ) &&
      (
        row.connectsDirectDashaPlanet ||
        row.connectsConnectedDashaPlanet
      ) &&
      (
        row.connectsQualifyingTransitPlanet ||
        row.connectsQualifyingTransitHouse
      ) &&
      combinedHouses.includes(row.house)
  );

  const requiresDistinctiveTrigger =
    rule.minimumDistinctiveHouses > 0 ||
    rule.requiredDistinctiveHouses.length > 0;

  const dynamicDistinctiveTrigger =
    dynamicMoonRows.some(
      row =>
        row.houseRole === "required_distinctive" ||
        row.houseRole === "alternative_distinctive"
    );

  const dailyTrigger =
    moon.hasEventSpecificDailyTrigger &&
    dynamicMoonRows.length > 0 &&
    (
      !requiresDistinctiveTrigger ||
      dynamicDistinctiveTrigger
    );

  const moonValue = completeMoonData
    ? dailyTrigger
      ? 1
      : moon.level === "NONE"
        ? 0
        : moon.level === "AREA"
          ? 0.2
          : 0.4
    : null;

  // 6. Natural planetary significance.
  // Significators must participate in actual
  // event evidence, not merely exist in the chart.

  const activeSignificators =
    significators.filter(
      planet =>
        foundationalDashaPlanets.includes(planet) ||
        foundationalTransitPlanets.includes(planet)
    );

  const naturalValue =
    completeDashaData && completeTransitData
      ? coverage(activeSignificators.length, 2)
      : null;

  // 7. Age eligibility.

  const age = prediction.age;

  const ageAppropriate =
    resolveUnifiedEventAgeEligibility(
      rule.eventId,
      age
    );

  // 8. Independent reinforcement assessments.

  const divisional = resolveEventDivisionalEvidence(
    rule,
    prediction
  );

  const relevantPlanets = [
    ...new Set([
      ...foundationalDashaPlanets,
      ...foundationalTransitPlanets,
    ]),
  ];

  const strength =
    resolveEventPlanetaryStrengthEvidence({
      relevantPlanets,
      shadbala: input.shadbala,
      afflictions: input.afflictions,
    });

  const ashtakavarga =
    resolveEventAshtakavargaEvidence({
      qualifyingTransitPlanets:
        foundationalTransitPlanets,

      transitPositions: [
        ...geometry.independentPositions,
        ...(geometry.moonPosition
          ? [geometry.moonPosition]
          : []),
      ].map(position => ({
        planet: position.planet,
        sign: position.sign,
      })),

      ashtakvarga: input.ashtakvarga,
      includeMoonTrigger: dailyTrigger,
    });

  // 9. Unified scoring and admission.

  const scoring = scoreUnifiedEvent({
    eventId: rule.eventId,
    specificity: rule.specificity,

    requiresIndependentTransit:
      rule.requiresIndependentTransit,

    requiresDailyTrigger:
      rule.requiresDailyTrigger,

    dimensions: {
      dashaActivation: {
        value: dashaValue,
        reasons: [
          `Combined Dasha weight: ${activePeriodWeight}/6`,
          `Connected-only coefficient: ${CONNECTED_DASHA_WEIGHT}`,
          `Connected active planets: ${connectedActivePlanets.join(", ")}`,
          `Participating planets: ${foundationalDashaPlanets.join(", ")}`,
        ],
      },

      houseCombination: {
        value: houseValue,
        reasons: [
          `Core houses: ${combinedCoreHouses.join(", ")}`,
          `Distinctive houses: ${combinedDistinctiveHouses.join(", ")}`,
        ],
      },

      transitConvergence: {
        value: transitValue,
        reasons: [
          `Independent planets: ${foundationalTransitPlanets.join(", ")}`,
          `Independent convergence: ${independentTransit}`,
        ],
      },

      dailyTrigger: {
        value: moonValue,
        reasons: [
          `Moon level: ${moon.level}`,
          `Dynamic trigger rows: ${dynamicMoonRows.length}`,
          `Event-specific trigger: ${dailyTrigger}`,
        ],
      },

      naturalSignificance: {
        value: naturalValue,
        reasons: [
          `Participating significators: ${activeSignificators.join(", ")}`,
        ],
      },
    },

    gates: {
      ageAppropriate,

      completeNatalData,

      natalFoundation: completeNatalData
        ? natalFoundation
        : null,

      directDashaActivation: completeDashaData
        ? (
            dasha.directCoreHouses.length > 0 ||
            connectedCoreActivation
          )
        : null,

      coreHouseCoverage:
        completeDashaData && completeTransitData
          ? coreHouseCoverage
          : null,

      distinctiveHouseCoverage:
        completeDashaData && completeTransitData
          ? distinctiveHouseCoverage
          : null,

      independentTransit: completeTransitData
        ? independentTransit
        : null,

      dailyTrigger: completeMoonData
        ? dailyTrigger
        : null,
    },
  });

  return {
    eventId: rule.eventId,

    scoring,

    natal,
    mediation,
    dasha,
    connectedDasha,
    qualifiedConnectedRows,
    connectedFoundation,
    dashaValidation,
    enhancedDivisionalEvidence:
      resolveDivisionalConnectedEvidence(
        rule,
        prediction,
        validatedDashaActivations,
        divisional,
        completeNatalData && natalFoundation
      ),
    geometry,
    transit,
    moon,

    reinforcement: {
      divisional,
      strength,
      ashtakavarga,
      hora: resolveEventHoraEvidence(
        rule,
        prediction,
        foundationalDashaPlanets
      ),
    },

    diagnostics: {
      completeNatalData,
      completeDashaData,
      completeTransitData,
      completeMoonData,

      natalFoundation,
      ageAppropriate,

      foundationalDashaPlanets,
      connectedActivePlanets,
      connectedCoreActivation,
      connectedDashaWeight: CONNECTED_DASHA_WEIGHT,
      qualifiedConnectedRowCount:
        qualifiedConnectedRows.length,
      foundationalTransitPlanets,

      combinedCoreHouses,
      combinedDistinctiveHouses,

      dynamicMoonRows,
      dynamicDistinctiveTrigger,

      activeSignificators,

      independentTransit,
      dailyTrigger,
    },
  };
}

export type UnifiedEventJudgement = ReturnType<
  typeof resolveUnifiedEventJudgement
>;
