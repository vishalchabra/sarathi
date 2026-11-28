import type {
  PlanetName,
} from "../types";

import type {
  PersonalizedDailyPredictionInput,
} from "../personalizedDailyPredictionGenerator";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import {
  calculateDivisionalPosition,
  calculateDivisionalHouse,
  type SupportedDivision,
} from "../../../lib/astrology/divisionalCalculator";

import {
  getPlanetLordships,
} from "../knowledge/planetLordships";

import {
  getPlanetDignity,
} from "../knowledge/planetDignity";

import {
  resolveEventNatalPotential,
  type NatalPotentialInput,
} from "./eventNatalPotentialResolver";

export type DivisionalEvidenceInput = Pick<
  PersonalizedDailyPredictionInput,
  "ascendant" |
  "natalAscendantLongitude" |
  "natalPositions" |
  "dasha"
>;

const PLANETS: readonly PlanetName[] = [
  "Sun", "Moon", "Mars", "Mercury",
  "Jupiter", "Venus", "Saturn",
  "Rahu", "Ketu",
];

const CLASSICAL_PLANETS: readonly PlanetName[] = PLANETS.filter(
  planet => planet !== "Rahu" && planet !== "Ketu"
);

function uniqueHouses(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

function isFiniteLongitude(
  value: unknown
): value is number {
  return typeof value === "number" &&
    Number.isFinite(value);
}

export function buildEventDivisionalChart(
  input: DivisionalEvidenceInput,
  division: SupportedDivision
) {
  if (!isFiniteLongitude(input.natalAscendantLongitude)) {
    return null;
  }

  const asc = calculateDivisionalPosition(
    input.natalAscendantLongitude,
    division
  );

  if (asc.natalSign !== input.ascendant) {
    return null;
  }

  const positions: NatalPotentialInput["natalPositions"] = {};

  const missingPlanets: PlanetName[] = [];
  const inconsistentPlanets: PlanetName[] = [];

  for (const planet of PLANETS) {
    const natal = input.natalPositions[planet];

    if (!natal || !isFiniteLongitude(natal.longitude)) {
      missingPlanets.push(planet);
      continue;
    }

    const position = calculateDivisionalPosition(
      natal.longitude,
      division
    );

    const expectedNatalHouse = calculateDivisionalHouse(
      asc.natalSignIndex,
      position.natalSignIndex
    );

    if (
      position.natalSign !== natal.sign ||
      natal.house !== expectedNatalHouse
    ) {
      inconsistentPlanets.push(planet);
      continue;
    }

    positions[planet] = {
      sign: position.sign,
      house: calculateDivisionalHouse(
        asc.signIndex,
        position.signIndex
      ),
      longitude: position.longitude,
    };
  }

  const completeClassicalData =
    CLASSICAL_PLANETS.every(
      planet => Boolean(positions[planet])
    );

  return {
    division,
    ascendant: asc.sign,
    ascendantLongitude: asc.longitude,
    positions,
    missingPlanets,
    inconsistentPlanets,
    completeClassicalData,
  };
}

type DivisionalChart = NonNullable<
  ReturnType<typeof buildEventDivisionalChart>
>;

type CareerDivisionalRule = {
  core: number[];
  required: number[];
  alternatives: number[];
  reinforcing: number[];
  minimumCore: number;
  minimumDistinctive: number;
};

const D10_RULES: Record<string, CareerDivisionalRule> = {
  career_movement: {
    core: [10],
    required: [],
    alternatives: [1, 6],
    reinforcing: [11],
    minimumCore: 1,
    minimumDistinctive: 1,
  },
  career_interview_invitation: {
    core: [6, 10],
    required: [3],
    alternatives: [],
    reinforcing: [11],
    minimumCore: 2,
    minimumDistinctive: 1,
  },
  career_job_offer: {
    core: [6, 10],
    required: [11],
    alternatives: [],
    reinforcing: [2, 3],
    minimumCore: 2,
    minimumDistinctive: 1,
  },
  career_responsibility: {
    core: [6, 10],
    required: [],
    alternatives: [1],
    reinforcing: [],
    minimumCore: 2,
    minimumDistinctive: 0,
  },
  career_recognition: {
    core: [10],
    required: [],
    alternatives: [9, 11],
    reinforcing: [1],
    minimumCore: 1,
    minimumDistinctive: 1,
  },
  career_change: {
    core: [10],
    required: [],
    alternatives: [8, 12],
    reinforcing: [6, 9],
    minimumCore: 1,
    minimumDistinctive: 1,
  },
  workload_service: {
    core: [6],
    required: [],
    alternatives: [],
    reinforcing: [10],
    minimumCore: 1,
    minimumDistinctive: 0,
  },
};

export function getCareerDivisionalRule(
  rule: EventJudgementRule
): EventJudgementRule | null {
  const config = D10_RULES[rule.eventId];

  if (!config) return null;

  return {
    ...rule,
    coreHouses: [...config.core],
    requiredDistinctiveHouses: [...config.required],
    alternativeDistinctiveHouses: [...config.alternatives],
    reinforcingHouses: [...config.reinforcing],
    minimumCoreHouses: config.minimumCore,
    minimumDistinctiveHouses: config.minimumDistinctive,
  };
}

function resolveD9Context(
  input: DivisionalEvidenceInput,
  chart: DivisionalChart | null,
  relevantPlanets: PlanetName[]
) {
  if (!chart) return null;

  return relevantPlanets.flatMap(planet => {
    const natal = input.natalPositions[planet];
    const divisional = chart.positions[planet];

    if (!natal || !divisional) return [];

    return [{
      planet,
      natalSign: natal.sign,
      navamsaSign: divisional.sign,
      navamsaHouse: divisional.house,
      vargottama: natal.sign === divisional.sign,
      natalDignity: getPlanetDignity(
        planet,
        natal.sign
      ),
      navamsaDignity: getPlanetDignity(
        planet,
        divisional.sign
      ),
    }];
  });
}

export function resolveEventDivisionalEvidence(
  rule: EventJudgementRule,
  input: DivisionalEvidenceInput
) {
  const activePlanets = [...new Set([
    input.dasha.mahadasha,
    input.dasha.antardasha,
    input.dasha.pratyantardasha,
  ])];

  const d1 = resolveEventNatalPotential(rule, {
    ascendant: input.ascendant,
    natalPositions: input.natalPositions,
  });

  const relevantD1Planets = new Set(
    d1.planets.map(item => item.planet)
  );

  const relevantActivePlanets = activePlanets.filter(
    planet => relevantD1Planets.has(planet)
  );

  const d9 = buildEventDivisionalChart(input, 9);
  const d10 = buildEventDivisionalChart(input, 10);

  const d9Context = resolveD9Context(
    input,
    d9,
    relevantActivePlanets
  );

  const d10Rule = getCareerDivisionalRule(rule);

  const d10Potential = d10 && d10Rule
    ? resolveEventNatalPotential(d10Rule, {
        ascendant: d10.ascendant,
        natalPositions: d10.positions,
      })
    : null;

  const d10Activation = d10 && d10Rule
    ? activePlanets.flatMap(planet => {
        const position = d10.positions[planet];

        if (!position) return [];

        const ruledHouses = getPlanetLordships(
          d10.ascendant,
          planet
        );

        const directHouses = uniqueHouses([
          position.house,
          ...ruledHouses,
        ]);

        return [{
          planet,
          house: position.house,
          ruledHouses,
          directHouses,
          coreHouses: directHouses.filter(
            house => d10Rule.coreHouses.includes(house)
          ),
          distinctiveHouses: directHouses.filter(
            house =>
              d10Rule.requiredDistinctiveHouses.includes(house) ||
              d10Rule.alternativeDistinctiveHouses.includes(house)
          ),
        }];
      })
    : [];

  const activeCoreHouses = uniqueHouses(
    d10Activation.flatMap(item => item.coreHouses)
  );

  const activeDistinctiveHouses = uniqueHouses(
    d10Activation.flatMap(item => item.distinctiveHouses)
  );

  const activeStructuralConnections =
    d10Potential?.structuralConnections.filter(
      connection =>
        connection.planets.some(
          planet => relevantActivePlanets.includes(planet)
        )
    ) ?? [];

  const foundationalHouses = new Set([
    ...(d10Rule?.coreHouses ?? []),
    ...(d10Rule?.requiredDistinctiveHouses ?? []),
    ...(d10Rule?.alternativeDistinctiveHouses ?? []),
  ]);

  const activeFoundationalConnections =
    activeStructuralConnections.filter(
      connection =>
        foundationalHouses.has(connection.firstHouse) &&
        foundationalHouses.has(connection.secondHouse) &&
        connection.hasStructuralConnection &&
        connection.sources.some(
          source =>
            source !== "shared_lordship" &&
            source !== "dispositor"
        )
    );

  const hasActiveCoreCoverage = Boolean(
    d10Rule &&
    activeCoreHouses.length >= d10Rule.minimumCoreHouses
  );

  const hasActiveDistinctiveCoverage = Boolean(
    d10Rule &&
    activeDistinctiveHouses.length >=
      d10Rule.minimumDistinctiveHouses &&
    d10Rule.requiredDistinctiveHouses.every(
      house => activeDistinctiveHouses.includes(house)
    )
  );

  const d1Complete = ![
    ...d1.missingNatalPlanets,
    ...d1.invalidNatalPlanets,
  ].some(
    planet => CLASSICAL_PLANETS.includes(planet)
  );

  // Divisional evidence is evaluated independently.
  // Final event admission remains a separate decision.
  const independentD10Connections =
    d10Potential?.structuralConnections.filter(
      connection =>
        connection.hasStructuralConnection &&
        foundationalHouses.has(connection.firstHouse) &&
        foundationalHouses.has(connection.secondHouse) &&
        connection.sources.some(
          source =>
            source !== "shared_lordship" &&
            source !== "dispositor"
        ) &&
        connection.planets.some(
          planet => activePlanets.includes(planet)
        )
    ) ?? [];

  const hasIndependentD10Support = Boolean(
    d10Rule &&
    d10?.completeClassicalData &&
    d10Potential?.hasConnectedEventFoundation &&
    hasActiveCoreCoverage &&
    hasActiveDistinctiveCoverage &&
    independentD10Connections.length > 0
  );

  const d10EvidenceLevel:
    | "NOT_APPLICABLE"
    | "UNAVAILABLE"
    | "NONE"
    | "CONTEXTUAL"
    | "PARTIAL"
    | "STRONG" =
    !d10Rule
      ? "NOT_APPLICABLE"
      : !d10?.completeClassicalData
        ? "UNAVAILABLE"
        : hasIndependentD10Support
          ? "STRONG"
          : hasActiveCoreCoverage &&
              hasActiveDistinctiveCoverage
            ? "PARTIAL"
            : activeCoreHouses.length > 0
              ? "CONTEXTUAL"
              : "NONE";

  const hasD10Reinforcement = Boolean(
    d1Complete &&
    d1.hasConnectedEventFoundation &&
    d10?.completeClassicalData &&
    d10Potential?.hasConnectedEventFoundation &&
    hasActiveCoreCoverage &&
    hasActiveDistinctiveCoverage &&
    activeFoundationalConnections.length > 0
  );

  return {
    eventId: rule.eventId,
    activePlanets,
    relevantActivePlanets,
    d9,
    d10,
    d9Context,
    d10Rule,
    d10Potential,
    d10Activation,
    activeCoreHouses,
    activeDistinctiveHouses,
    activeStructuralConnections,
    activeFoundationalConnections,
    hasActiveCoreCoverage,
    hasActiveDistinctiveCoverage,
    independentD10Connections,
    hasIndependentD10Support,
    d10EvidenceLevel,
    hasD10Reinforcement,
  };
}