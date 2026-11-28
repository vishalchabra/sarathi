import type {
  PlanetName,
  ZodiacSign,
} from "../types";

import type {
  PersonalizedDailyPredictionInput,
} from "../personalizedDailyPredictionGenerator";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import {
  getPlanetLordships,
} from "../knowledge/planetLordships";

import {
  resolveNatalSambandha,
} from "../knowledge/natalSambandhaResolver";

import type {
  SambandhaType,
} from "../knowledge/natalSambandhaResolver";

import {
  getPlanetDignity,
} from "../knowledge/planetDignity";

export type NatalPotentialInput = Pick<
  PersonalizedDailyPredictionInput,
  "ascendant" | "natalPositions"
>;

export type NatalConnectionSource =
  | "lord_placement"
  | "shared_lordship"
  | SambandhaType;

export type NatalRelationshipWitness = {
  fromHouse: number;
  toHouse: number;
  source: NatalConnectionSource;
  planets: PlanetName[];
  directed: boolean;
  structural: boolean;
};

export type NatalHouseConnection = {
  relationshipWitnesses: NatalRelationshipWitness[];
  firstHouse: number;
  secondHouse: number;

  planets: PlanetName[];

  sources: NatalConnectionSource[];

  directedSources: {
    source: NatalConnectionSource;
    fromPlanet: PlanetName;
    toPlanet: PlanetName;
  }[];

  hasStructuralConnection: boolean;
  hasIndirectConnection: boolean;
};

export type NatalPlanetEvidence = {
  planet: PlanetName;
  sign: ZodiacSign;
  natalHouse: number;
  ruledHouses: number[];
  relevantLordships: number[];
  occupiesRelevantHouse: boolean;
  dignity: ReturnType<typeof getPlanetDignity>;
};

export type NatalPotentialLevel =
  | "INSUFFICIENT_DATA"
  | "CONTEXT_ONLY"
  | "PARTIAL"
  | "STRUCTURALLY_SUPPORTED";

export type EventNatalPotential = {
  eventId: EventJudgementRule["eventId"];

  level: NatalPotentialLevel;

  relevantHouses: number[];

  planets: NatalPlanetEvidence[];

  connections: NatalHouseConnection[];

  structuralConnections: NatalHouseConnection[];

  indirectConnections: NatalHouseConnection[];

  connectedComponents: number[][];

  structurallyConnectedComponents: number[][];

  connectedCoreHouses: number[];

  connectedDistinctiveHouses: number[];

  missingCoreHouses: number[];

  missingRequiredDistinctiveHouses: number[];

  hasMinimumCoreCoverage: boolean;

  hasAllRequiredDistinctiveHouses: boolean;

  hasMinimumDistinctiveCoverage: boolean;

  hasConnectedEventFoundation: boolean;

  missingNatalPlanets: PlanetName[];

  invalidNatalPlanets: PlanetName[];

  rejectedUnverifiedRelationships: number;
};

const PLANETS: readonly PlanetName[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

const SIGNS: readonly ZodiacSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

function uniqueHouses(
  houses: readonly number[]
): number[] {
  return [...new Set(houses)].sort(
    (a, b) => a - b
  );
}

function buildComponents(
  connections: readonly NatalHouseConnection[]
): number[][] {

  const adjacency = new Map<number, Set<number>>();

  for (const connection of connections) {

    const first = connection.firstHouse;
    const second = connection.secondHouse;

    if (!adjacency.has(first)) {
      adjacency.set(first, new Set());
    }

    if (!adjacency.has(second)) {
      adjacency.set(second, new Set());
    }

    adjacency.get(first)!.add(second);
    adjacency.get(second)!.add(first);
  }

  const visited = new Set<number>();
  const components: number[][] = [];

  for (const house of adjacency.keys()) {

    if (visited.has(house)) continue;

    const pending = [house];
    const component: number[] = [];

    while (pending.length > 0) {

      const current = pending.pop()!;

      if (visited.has(current)) continue;

      visited.add(current);
      component.push(current);

      for (const neighbour of adjacency.get(current) ?? []) {
        if (!visited.has(neighbour)) {
          pending.push(neighbour);
        }
      }
    }

    components.push(uniqueHouses(component));
  }

  return components.sort(
    (a, b) =>
      b.length - a.length ||
      a[0] - b[0]
  );
}

export function resolveEventNatalPotential(
  rule: EventJudgementRule,
  input: NatalPotentialInput
): EventNatalPotential {

  const ascendantIndex = SIGNS.indexOf(
    input.ascendant
  );

  if (ascendantIndex < 0) {
    throw new Error("Invalid natal ascendant.");
  }

  const relevantHouses = uniqueHouses([
    ...rule.coreHouses,
    ...rule.requiredDistinctiveHouses,
    ...rule.alternativeDistinctiveHouses,
    ...rule.reinforcingHouses,
  ]);

  const relevant = new Set(relevantHouses);

  const foundational = new Set([
    ...rule.coreHouses,
    ...rule.requiredDistinctiveHouses,
    ...rule.alternativeDistinctiveHouses,
  ]);

  const distinctive = new Set([
    ...rule.requiredDistinctiveHouses,
    ...rule.alternativeDistinctiveHouses,
  ]);

  const missingNatalPlanets: PlanetName[] = [];
  const invalidNatalPlanets: PlanetName[] = [];

  const verifiedPositions:
    NatalPotentialInput["natalPositions"] = {};

  const planets: NatalPlanetEvidence[] = [];

  for (const planet of PLANETS) {

    const position = input.natalPositions[planet];

    if (!position) {
      missingNatalPlanets.push(planet);
      continue;
    }

    const signIndex = SIGNS.indexOf(position.sign);

    if (signIndex < 0) {
      invalidNatalPlanets.push(planet);
      continue;
    }

    const expectedHouse =
      ((signIndex - ascendantIndex + 12) % 12) + 1;

    // Do not silently repair inconsistent natal data.
    if (position.house !== expectedHouse) {
      invalidNatalPlanets.push(planet);
      continue;
    }

    verifiedPositions[planet] = {
      ...position,
    };

    const ruledHouses = uniqueHouses(
      getPlanetLordships(input.ascendant, planet)
    );

    planets.push({
      planet,
      sign: position.sign,
      natalHouse: position.house,
      ruledHouses,
      relevantLordships: ruledHouses.filter(
        (house) => relevant.has(house)
      ),
      occupiesRelevantHouse:
        relevant.has(position.house),
      dignity: getPlanetDignity(
        planet,
        position.sign
      ),
    });
  }

  const planetMap = new Map(
    planets.map((planet) => [
      planet.planet,
      planet,
    ])
  );

  const connectionMap =
    new Map<string, NatalHouseConnection>();

  function addConnection(
    firstHouse: number,
    secondHouse: number,
    source: NatalConnectionSource,
    involvedPlanets: PlanetName[],
    directed: boolean = false
  ) {

    if (firstHouse === secondHouse) return;

    if (
      !relevant.has(firstHouse) ||
      !relevant.has(secondHouse)
    ) {
      return;
    }

    const [first, second] = [
      firstHouse,
      secondHouse,
    ].sort((a, b) => a - b);

    const key = `${first}:${second}`;

    let connection = connectionMap.get(key);

    if (!connection) {

      connection = {
        firstHouse: first,
        secondHouse: second,
        planets: [],
        sources: [],
        directedSources: [],
        relationshipWitnesses: [],
        hasStructuralConnection: false,
        hasIndirectConnection: false,
      };

      connectionMap.set(key, connection);
    }

    connection.planets = [
      ...new Set([
        ...connection.planets,
        ...involvedPlanets,
      ]),
    ].sort();

    if (!connection.sources.includes(source)) {
      connection.sources.push(source);
    }

    if (
      source === "lord_placement" ||
      source === "conjunction" ||
      source === "aspect" ||
      source === "mutual_aspect" ||
      source === "exchange"
    ) {
      connection.hasStructuralConnection = true;
    }

    if (source === "dispositor") {
      connection.hasIndirectConnection = true;
    }

    const structural =
      source === "lord_placement" ||
      source === "conjunction" ||
      source === "aspect" ||
      source === "mutual_aspect" ||
      source === "exchange";

    const witness: NatalRelationshipWitness = {
      fromHouse: firstHouse,
      toHouse: secondHouse,
      source,
      planets: [...involvedPlanets],
      directed,
      structural,
    };

    const witnessExists =
      connection.relationshipWitnesses.some(
        existing =>
          existing.fromHouse === witness.fromHouse &&
          existing.toHouse === witness.toHouse &&
          existing.source === witness.source &&
          existing.directed === witness.directed &&
          existing.planets.length === witness.planets.length &&
          existing.planets.every(
            (planet, index) =>
              planet === witness.planets[index]
          )
      );

    if (!witnessExists) {
      connection.relationshipWitnesses.push(witness);
    }

    if (directed && involvedPlanets.length === 2) {

      const fromPlanet = involvedPlanets[0];
      const toPlanet = involvedPlanets[1];

      const exists = connection.directedSources.some(
        (row) =>
          row.source === source &&
          row.fromPlanet === fromPlanet &&
          row.toPlanet === toPlanet
      );

      if (!exists) {
        connection.directedSources.push({
          source,
          fromPlanet,
          toPlanet,
        });
      }
    }
  }

  // 1. Actual natal placement of relevant house lords.
  for (const planet of planets) {

    for (const ruledHouse of planet.relevantLordships) {

      addConnection(
        ruledHouse,
        planet.natalHouse,
        "lord_placement",
        [planet.planet]
      );
    }

    // 2. Shared lordship is retained as context.
    // It cannot establish structural support alone.
    for (
      let first = 0;
      first < planet.relevantLordships.length;
      first++
    ) {

      for (
        let second = first + 1;
        second < planet.relevantLordships.length;
        second++
      ) {

        addConnection(
          planet.relevantLordships[first],
          planet.relevantLordships[second],
          "shared_lordship",
          [planet.planet]
        );
      }
    }
  }

  // 3. Reuse existing natal relationship calculations.
  const sambandha = resolveNatalSambandha({
    ascendant: input.ascendant,
    planets: verifiedPositions,
  });

  let rejectedUnverifiedRelationships = 0;

  for (const relationship of sambandha.relationships) {

    const [firstPlanet, secondPlanet] =
      relationship.planets;

    const first = planetMap.get(firstPlanet);
    const second = planetMap.get(secondPlanet);

    // Both natal planetary positions must be verified.
    if (!first || !second) {
      rejectedUnverifiedRelationships++;
      continue;
    }

    for (const firstHouse of first.relevantLordships) {

      for (const secondHouse of second.relevantLordships) {

        addConnection(
          firstHouse,
          secondHouse,
          relationship.type,
          [firstPlanet, secondPlanet],
          relationship.directed
        );
      }
    }
  }

  const connections = [
    ...connectionMap.values(),
  ].sort(
    (a, b) =>
      a.firstHouse - b.firstHouse ||
      a.secondHouse - b.secondHouse
  );

  const structuralConnections = connections.filter(
    (connection) =>
      connection.hasStructuralConnection
  );

  const indirectConnections = connections.filter(
    (connection) =>
      connection.hasIndirectConnection
  );

  const connectedComponents = buildComponents(
    connections
  );

  // Reinforcing houses cannot act as bridges that
  // manufacture a missing foundational combination.
  const foundationalStructuralConnections =
    structuralConnections.filter(
      (connection) =>
        foundational.has(connection.firstHouse) &&
        foundational.has(connection.secondHouse)
    );

  const structurallyConnectedComponents =
    buildComponents(
      foundationalStructuralConnections
    );

  // A single-core event can have a natal foundation
  // through an actual structural connection with a
  // reinforcing house, without requiring another core.
  if (
    rule.minimumCoreHouses === 1 &&
    rule.minimumDistinctiveHouses === 0 &&
    rule.requiredDistinctiveHouses.length === 0
  ) {

    for (const house of rule.coreHouses) {

      const hasStructuralLink =
        structuralConnections.some(
          (connection) =>
            connection.firstHouse === house ||
            connection.secondHouse === house
        );

      const alreadyRepresented =
        structurallyConnectedComponents.some(
          (component) => component.includes(house)
        );

      if (hasStructuralLink && !alreadyRepresented) {
        structurallyConnectedComponents.push([house]);
      }
    }
  }

  const assessments =
    structurallyConnectedComponents.map(
      (component) => {

        const coreHouses = component.filter(
          (house) => rule.coreHouses.includes(house)
        );

        const distinctiveHouses = component.filter(
          (house) => distinctive.has(house)
        );

        const missingRequired =
          rule.requiredDistinctiveHouses.filter(
            (house) => !component.includes(house)
          );

        const supported =
          coreHouses.length >= rule.minimumCoreHouses &&
          distinctiveHouses.length >=
            rule.minimumDistinctiveHouses &&
          missingRequired.length === 0;

        return {
          component,
          coreHouses,
          distinctiveHouses,
          missingRequired,
          supported,
        };
      }
    );

  assessments.sort(
    (a, b) =>
      Number(b.supported) - Number(a.supported) ||
      b.coreHouses.length - a.coreHouses.length ||
      a.missingRequired.length - b.missingRequired.length ||
      b.distinctiveHouses.length - a.distinctiveHouses.length ||
      a.component[0] - b.component[0]
  );

  const best = assessments[0];

  const connectedCoreHouses =
    best?.coreHouses ?? [];

  const connectedDistinctiveHouses =
    best?.distinctiveHouses ?? [];

  const missingCoreHouses =
    rule.coreHouses.filter(
      (house) => !connectedCoreHouses.includes(house)
    );

  const missingRequiredDistinctiveHouses =
    rule.requiredDistinctiveHouses.filter(
      (house) =>
        !connectedDistinctiveHouses.includes(house)
    );

  const hasMinimumCoreCoverage =
    connectedCoreHouses.length >=
      rule.minimumCoreHouses;

  const hasAllRequiredDistinctiveHouses =
    missingRequiredDistinctiveHouses.length === 0;

  const hasMinimumDistinctiveCoverage =
    connectedDistinctiveHouses.length >=
      rule.minimumDistinctiveHouses;

  const hasConnectedEventFoundation =
    hasMinimumCoreCoverage &&
    hasAllRequiredDistinctiveHouses &&
    hasMinimumDistinctiveCoverage;

  const incompleteClassicalPlanets = [
    ...missingNatalPlanets,
    ...invalidNatalPlanets,
  ].some(
    (planet) =>
      planet !== "Rahu" &&
      planet !== "Ketu"
  );

  let level: NatalPotentialLevel;

  if (hasConnectedEventFoundation) {
    level = "STRUCTURALLY_SUPPORTED";
  } else if (incompleteClassicalPlanets) {
    level = "INSUFFICIENT_DATA";
  } else if (structuralConnections.length > 0) {
    level = "PARTIAL";
  } else {
    level = "CONTEXT_ONLY";
  }

  return {
    eventId: rule.eventId,
    level,
    relevantHouses,

    planets: planets.filter(
      (planet) =>
        planet.relevantLordships.length > 0 ||
        planet.occupiesRelevantHouse
    ),

    connections,
    structuralConnections,
    indirectConnections,

    connectedComponents,
    structurallyConnectedComponents,

    connectedCoreHouses,
    connectedDistinctiveHouses,

    missingCoreHouses,
    missingRequiredDistinctiveHouses,

    hasMinimumCoreCoverage,
    hasAllRequiredDistinctiveHouses,
    hasMinimumDistinctiveCoverage,
    hasConnectedEventFoundation,

    missingNatalPlanets,
    invalidNatalPlanets,
    rejectedUnverifiedRelationships,
  };
}