import type {
  PlanetName,
} from "../types";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import type {
  EventNatalPotential,
  NatalPlanetEvidence,
  NatalHouseConnection,
} from "./eventNatalPotentialResolver";

import {
  VEDIC_ASPECT_RULES,
  getAspectHouseBetweenSigns,
} from "../core/aspectResolver";

export type NatalMediationPath = {
  firstHouse: number;
  bridgeHouse: number;
  secondHouse: number;
  mediatingPlanet: PlanetName;
  firstEdge: NatalHouseConnection;
  secondEdge: NatalHouseConnection;
  connectedCoreHouses: number[];
  connectedDistinctiveHouses: number[];
  satisfiesFoundation: boolean;
};

export type NatalMediationLevel =
  | "DIRECT_SUPPORT"
  | "MEDIATED_SUPPORT"
  | "PARTIAL"
  | "CONTEXT_ONLY"
  | "INSUFFICIENT_DATA";

export type EventNatalMediation = {
  eventId: EventJudgementRule["eventId"];
  level: NatalMediationLevel;
  originalLevel: EventNatalPotential["level"];
  hasDirectSupport: boolean;
  hasMediatedSupport: boolean;
  paths: NatalMediationPath[];
  qualifyingPaths: NatalMediationPath[];
  bestPath: NatalMediationPath | null;
  incompleteClassicalData: boolean;
};

function uniqueHouses(
  houses: readonly number[]
): number[] {
  return [...new Set(houses)].sort(
    (a, b) => a - b
  );
}

function connectsHouses(
  edge: NatalHouseConnection,
  first: number,
  second: number
): boolean {

  return (
    edge.firstHouse === Math.min(first, second) &&
    edge.secondHouse === Math.max(first, second)
  );
}

function hasVedicAspect(
  first: NatalPlanetEvidence,
  second: NatalPlanetEvidence
): boolean {

  const distance = getAspectHouseBetweenSigns(
    first.sign,
    second.sign
  );

  return (
    VEDIC_ASPECT_RULES[first.planet]?.includes(
      distance
    ) ?? false
  );
}

// Reconstruct structural participation instead of
// trusting aggregated planet names on a house edge.
function verifiesMediatingPlanet(
  edge: NatalHouseConnection,
  bridgeHouse: number,
  endpointHouse: number,
  mediator: NatalPlanetEvidence,
  planets: readonly NatalPlanetEvidence[]
): boolean {

  if (!edge.hasStructuralConnection) return false;

  if (!edge.planets.includes(mediator.planet)) {
    return false;
  }

  if (!mediator.ruledHouses.includes(bridgeHouse)) {
    return false;
  }

  // The bridge lord physically occupies the endpoint.
  if (
    edge.sources.includes("lord_placement") &&
    mediator.natalHouse === endpointHouse
  ) {
    return true;
  }

  for (const endpointLord of planets) {

    if (endpointLord.planet === mediator.planet) {
      continue;
    }

    if (
      !endpointLord.ruledHouses.includes(endpointHouse)
    ) {
      continue;
    }

    if (!edge.planets.includes(endpointLord.planet)) {
      continue;
    }

    // The endpoint lord occupies the bridge house.
    if (
      edge.sources.includes("lord_placement") &&
      endpointLord.natalHouse === bridgeHouse
    ) {
      return true;
    }

    if (
      edge.sources.includes("conjunction") &&
      mediator.sign === endpointLord.sign
    ) {
      return true;
    }

    const forwardAspect = hasVedicAspect(
      mediator,
      endpointLord
    );

    const reverseAspect = hasVedicAspect(
      endpointLord,
      mediator
    );

    if (
      edge.sources.includes("aspect") &&
      (forwardAspect || reverseAspect)
    ) {
      return true;
    }

    if (
      edge.sources.includes("mutual_aspect") &&
      forwardAspect &&
      reverseAspect
    ) {
      return true;
    }

    if (
      edge.sources.includes("exchange") &&
      mediator.ruledHouses.includes(
        endpointLord.natalHouse
      ) &&
      endpointLord.ruledHouses.includes(
        mediator.natalHouse
      )
    ) {
      return true;
    }
  }

  return false;
}

function resolveConnectedFoundation(
  rule: EventJudgementRule,
  natal: EventNatalPotential,
  firstHouse: number,
  secondHouse: number
) {

  const foundational = new Set([
    ...rule.coreHouses,
    ...rule.requiredDistinctiveHouses,
    ...rule.alternativeDistinctiveHouses,
  ]);

  const edges = natal.structuralConnections
    .filter(
      (edge) =>
        foundational.has(edge.firstHouse) &&
        foundational.has(edge.secondHouse)
    )
    .map(
      (edge) => [
        edge.firstHouse,
        edge.secondHouse,
      ]
    );

  // Add only this single verified mediated edge.
  edges.push([firstHouse, secondHouse]);

  const visited = new Set<number>();
  const pending = [firstHouse];

  while (pending.length > 0) {

    const current = pending.pop()!;

    if (visited.has(current)) continue;

    visited.add(current);

    for (const [first, second] of edges) {

      if (
        first === current &&
        !visited.has(second)
      ) {
        pending.push(second);
      }

      if (
        second === current &&
        !visited.has(first)
      ) {
        pending.push(first);
      }
    }
  }

  const connectedCoreHouses = uniqueHouses(
    rule.coreHouses.filter(
      (house) => visited.has(house)
    )
  );

  const connectedDistinctiveHouses = uniqueHouses(
    [
      ...rule.requiredDistinctiveHouses,
      ...rule.alternativeDistinctiveHouses,
    ].filter(
      (house) => visited.has(house)
    )
  );

  const satisfiesFoundation =
    connectedCoreHouses.length >=
      rule.minimumCoreHouses &&
    connectedDistinctiveHouses.length >=
      rule.minimumDistinctiveHouses &&
    rule.requiredDistinctiveHouses.every(
      (house) => visited.has(house)
    );

  return {
    connectedCoreHouses,
    connectedDistinctiveHouses,
    satisfiesFoundation,
  };
}

export function resolveEventNatalMediation(
  rule: EventJudgementRule,
  natal: EventNatalPotential
): EventNatalMediation {

  if (rule.eventId !== natal.eventId) {
    throw new Error(
      "Mismatched natal event evidence."
    );
  }

  const incompleteClassicalData = [
    ...natal.missingNatalPlanets,
    ...natal.invalidNatalPlanets,
  ].some(
    (planet) =>
      planet !== "Rahu" &&
      planet !== "Ketu"
  );

  const foundationalHouses = uniqueHouses([
    ...rule.coreHouses,
    ...rule.requiredDistinctiveHouses,
    ...rule.alternativeDistinctiveHouses,
  ]);

  const reinforcingHouses =
    rule.reinforcingHouses.filter(
      (house) =>
        !foundationalHouses.includes(house)
    );

  const paths: NatalMediationPath[] = [];

  for (const bridgeHouse of reinforcingHouses) {

    const mediators = natal.planets.filter(
      (planet) =>
        planet.ruledHouses.includes(bridgeHouse)
    );

    for (
      let first = 0;
      first < foundationalHouses.length;
      first++
    ) {

      for (
        let second = first + 1;
        second < foundationalHouses.length;
        second++
      ) {

        const firstHouse =
          foundationalHouses[first];

        const secondHouse =
          foundationalHouses[second];

        const firstEdge =
          natal.structuralConnections.find(
            (edge) =>
              connectsHouses(
                edge,
                firstHouse,
                bridgeHouse
              )
          );

        const secondEdge =
          natal.structuralConnections.find(
            (edge) =>
              connectsHouses(
                edge,
                bridgeHouse,
                secondHouse
              )
          );

        if (!firstEdge || !secondEdge) continue;

        for (const mediator of mediators) {

          if (
            !verifiesMediatingPlanet(
              firstEdge,
              bridgeHouse,
              firstHouse,
              mediator,
              natal.planets
            )
          ) {
            continue;
          }

          if (
            !verifiesMediatingPlanet(
              secondEdge,
              bridgeHouse,
              secondHouse,
              mediator,
              natal.planets
            )
          ) {
            continue;
          }

          const foundation =
            resolveConnectedFoundation(
              rule,
              natal,
              firstHouse,
              secondHouse
            );

          paths.push({
            firstHouse,
            bridgeHouse,
            secondHouse,
            mediatingPlanet: mediator.planet,
            firstEdge,
            secondEdge,
            ...foundation,
          });
        }
      }
    }
  }

  paths.sort(
    (a, b) =>
      Number(b.satisfiesFoundation) -
        Number(a.satisfiesFoundation) ||
      b.connectedCoreHouses.length -
        a.connectedCoreHouses.length ||
      b.connectedDistinctiveHouses.length -
        a.connectedDistinctiveHouses.length ||
      a.bridgeHouse - b.bridgeHouse ||
      a.firstHouse - b.firstHouse ||
      a.secondHouse - b.secondHouse ||
      a.mediatingPlanet.localeCompare(
        b.mediatingPlanet
      )
  );

  const qualifyingPaths =
    incompleteClassicalData
      ? []
      : paths.filter(
          (path) => path.satisfiesFoundation
        );

  const hasDirectSupport =
    natal.hasConnectedEventFoundation;

  const hasMediatedSupport =
    !hasDirectSupport &&
    qualifyingPaths.length > 0;

  let level: NatalMediationLevel;

  if (hasDirectSupport) {
    level = "DIRECT_SUPPORT";
  } else if (hasMediatedSupport) {
    level = "MEDIATED_SUPPORT";
  } else if (incompleteClassicalData) {
    level = "INSUFFICIENT_DATA";
  } else if (natal.level === "PARTIAL") {
    level = "PARTIAL";
  } else {
    level = "CONTEXT_ONLY";
  }

  return {
    eventId: rule.eventId,
    level,
    originalLevel: natal.level,
    hasDirectSupport,
    hasMediatedSupport,
    paths,
    qualifyingPaths,
    bestPath: qualifyingPaths[0] ?? null,
    incompleteClassicalData,
  };
}