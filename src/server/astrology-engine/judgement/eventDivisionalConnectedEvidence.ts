import {
  validateEventDashaActivations,
} from "./eventDashaValidation";

import type {
  PlanetName,
} from "../types";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import type {
  DashaPlanetActivation,
} from "../knowledge/dashaActivation";

import {
  resolveEventDivisionalEvidence,
  type DivisionalEvidenceInput,
} from "./eventDivisionalEvidence";

import {
  resolveEventNatalMediation,
} from "./eventNatalMediationResolver";

import {
  resolveEventConnectedDasha,
} from "./eventConnectedDashaResolver";

import {
  resolveConnectedFoundation,
} from "./eventConnectedFoundationResolver";

type LegacyDivisionalEvidence =
  ReturnType<typeof resolveEventDivisionalEvidence>;

function uniqueHouses(
  houses: readonly number[]
): number[] {
  return [...new Set(houses)].sort((a, b) => a - b);
}

export function resolveDivisionalConnectedEvidence(
  rule: EventJudgementRule,
  input: DivisionalEvidenceInput,
  activations: readonly DashaPlanetActivation[],
  legacy: LegacyDivisionalEvidence,
  d1FoundationSupported: boolean
) {
  if (legacy.eventId !== rule.eventId) {
    throw new Error("Mismatched divisional event.");
  }

  const chart = legacy.d10;
  const divisionalRule = legacy.d10Rule;
  const natal = legacy.d10Potential;

  const unavailable = {
    eventId: rule.eventId,
    available: false,
    legacyLevel: legacy.d10EvidenceLevel,
    enhancedLevel: divisionalRule
      ? "UNAVAILABLE" as const
      : "NOT_APPLICABLE" as const,
    d1FoundationSupported,
    hasIndependentD10Support: false,
    hasD10Reinforcement: false,
    directCoreHouses: [] as number[],
    directDistinctiveHouses: [] as number[],
    connectedCoreHouses: [] as number[],
    connectedDistinctiveHouses: [] as number[],
    combinedCoreHouses: [] as number[],
    combinedDistinctiveHouses: [] as number[],
    qualifiedConnectedRows: [] as ReturnType<
      typeof resolveConnectedFoundation
    >["qualifiedRows"],
  };

  if (
    !chart ||
    !divisionalRule ||
    !natal ||
    !chart.completeClassicalData
  ) {
    return unavailable;
  }

  // Validate period identity using actual MD/AD/PD.
  // Do not accept unrelated activation planets.

  const validation =
    validateEventDashaActivations(
      {
        ascendant: input.ascendant,
        ...input.dasha,
        natalPositions: input.natalPositions,
      },
      activations
    );

  const completeDashaData =
    validation.valid &&
    validation.activations.every(
      activation =>
        Boolean(chart.positions[activation.planet])
    );

  if (!completeDashaData) {
    return unavailable;
  }

  const validActivations =
    validation.activations;

  const activePlanets = new Set<PlanetName>(
    validActivations.map(row => row.planet)
  );

  // Evaluate D10 using its own natal geometry.

  const mediation = resolveEventNatalMediation(
    divisionalRule,
    natal
  );

  const connected = resolveEventConnectedDasha(
    divisionalRule,
    {
      ascendant: chart.ascendant,
      natalPositions: chart.positions,
    },
    validActivations
  );

  const foundation = resolveConnectedFoundation(
    divisionalRule,
    natal,
    mediation,
    connected.foundationalEvidence,
    {
      ascendant: chart.ascendant,
      natalPositions: chart.positions,
    }
  );

  const foundationHouses = new Set(
    foundation.foundationHouses
  );

  const directRows = legacy.d10Activation.filter(
    row => activePlanets.has(row.planet)
  );

  const rawDirectCoreHouses = uniqueHouses(
    directRows.flatMap(row => row.coreHouses)
  );

  const rawDirectDistinctiveHouses = uniqueHouses(
    directRows.flatMap(row => row.distinctiveHouses)
  );

  // Strong support requires coverage inside the
  // same selected natal foundation.

  const directCoreHouses =
    rawDirectCoreHouses.filter(
      house => foundationHouses.has(house)
    );

  const directDistinctiveHouses =
    rawDirectDistinctiveHouses.filter(
      house => foundationHouses.has(house)
    );

  const qualifiedConnectedRows =
    foundation.qualifiedRows;

  const connectedCoreHouses = uniqueHouses(
    qualifiedConnectedRows
      .filter(row => row.houseRole === "core")
      .map(row => row.house)
  );

  const connectedDistinctiveHouses = uniqueHouses(
    qualifiedConnectedRows
      .filter(row =>
        row.houseRole === "required_distinctive" ||
        row.houseRole === "alternative_distinctive"
      )
      .map(row => row.house)
  );

  const combinedCoreHouses = uniqueHouses([
    ...directCoreHouses,
    ...connectedCoreHouses,
  ]);

  const combinedDistinctiveHouses = uniqueHouses([
    ...directDistinctiveHouses,
    ...connectedDistinctiveHouses,
  ]);

  const hasCoreCoverage =
    combinedCoreHouses.length >=
    divisionalRule.minimumCoreHouses;

  const hasDistinctiveCoverage =
    combinedDistinctiveHouses.length >=
      divisionalRule.minimumDistinctiveHouses &&
    divisionalRule.requiredDistinctiveHouses.every(
      house => combinedDistinctiveHouses.includes(house)
    );

  // Exact witnesses prevent unrelated planets on
  // aggregated house edges from providing support.

  const path = !mediation.hasDirectSupport
    ? mediation.bestPath
    : null;

  const singleCoreFoundation =
    divisionalRule.minimumCoreHouses === 1 &&
    divisionalRule.minimumDistinctiveHouses === 0 &&
    divisionalRule.requiredDistinctiveHouses.length === 0;

  const structuralWitnesses =
    natal.structuralConnections.flatMap(edge => {
      const first =
        foundationHouses.has(edge.firstHouse);

      const second =
        foundationHouses.has(edge.secondHouse);

      const insideFoundation = first && second;

      const singleCoreReinforcement =
        mediation.hasDirectSupport &&
        singleCoreFoundation &&
        (
          (
            first &&
            divisionalRule.reinforcingHouses.includes(
              edge.secondHouse
            )
          ) ||
          (
            second &&
            divisionalRule.reinforcingHouses.includes(
              edge.firstHouse
            )
          )
        );

      const mediatedEdge =
        path !== null &&
        (
          edge === path.firstEdge ||
          edge === path.secondEdge
        );

      if (
        !insideFoundation &&
        !singleCoreReinforcement &&
        !mediatedEdge
      ) {
        return [];
      }

      return edge.relationshipWitnesses.filter(
        witness =>
          witness.structural &&
          (
            !mediatedEdge ||
            witness.planets.includes(
              path!.mediatingPlanet
            )
          )
      );
    });

  const activeStructuralWitnesses =
    structuralWitnesses.filter(
      witness => witness.planets.some(
        planet => activePlanets.has(planet)
      )
    );

  const hasIndependentD10Support =
    foundation.supported &&
    hasCoreCoverage &&
    hasDistinctiveCoverage &&
    activeStructuralWitnesses.length > 0;

  const enhancedLevel =
    hasIndependentD10Support
      ? "STRONG" as const
      : hasCoreCoverage && hasDistinctiveCoverage
        ? "PARTIAL" as const
        : rawDirectCoreHouses.length > 0 ||
          connectedCoreHouses.length > 0
          ? "CONTEXTUAL" as const
          : "NONE" as const;

  return {
    eventId: rule.eventId,
    available: true,
    legacyLevel: legacy.d10EvidenceLevel,
    enhancedLevel,
    d1FoundationSupported,
    completeDashaData,
    activePlanets: [...activePlanets],
    natalFoundationLevel: mediation.level,
    foundationHouses: [...foundationHouses],
    rawDirectCoreHouses,
    rawDirectDistinctiveHouses,
    directCoreHouses,
    directDistinctiveHouses,
    connectedCoreHouses,
    connectedDistinctiveHouses,
    combinedCoreHouses,
    combinedDistinctiveHouses,
    hasCoreCoverage,
    hasDistinctiveCoverage,
    qualifiedConnectedRows,
    rejectedConnectedRows: foundation.rejectedRows,
    activeStructuralWitnesses,
    hasIndependentD10Support,
    hasD10Reinforcement:
      d1FoundationSupported &&
      hasIndependentD10Support,
  };
}
