import type { PlanetName } from "../types";

import type {
  DashaPlanetActivation,
} from "../knowledge/dashaActivation";

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
  NatalPotentialInput,
} from "./eventNatalPotentialResolver";

import {
  getJudgementHouseRole,
} from "./eventJudgementEvidence";

import type {
  JudgementHouseRole,
} from "./eventJudgementEvidence";

export type ConnectedDashaSource =
  | "conjunction"
  | "aspect"
  | "mutual_aspect"
  | "exchange"
  | "dispositor";

export type ConnectedDashaEvidence = {
  activePlanet: PlanetName;
  connectedPlanet: PlanetName;
  house: number;
  houseRole: JudgementHouseRole;
  targetSource: "lordship" | "natal_placement";
  relationship: ConnectedDashaSource;
  direction:
    | "outgoing"
    | "incoming"
    | "mutual";
  dashaLevels: DashaPlanetActivation["levels"];
  dashaStrength: number;
  overlapsDirectActivation: boolean;
  foundationalEligible: boolean;
};

const PLANETS: readonly PlanetName[] = [
  "Sun", "Moon", "Mars", "Mercury",
  "Jupiter", "Venus", "Saturn",
  "Rahu", "Ketu",
];

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn",
  "Aquarius", "Pisces",
] as const;

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function uniqueHouses(
  values: readonly number[]
): number[] {
  return unique(values).sort((a, b) => a - b);
}

export function resolveEventConnectedDasha(
  rule: EventJudgementRule,
  input: NatalPotentialInput,
  activations: readonly DashaPlanetActivation[]
) {
  const ascendantIndex = SIGNS.indexOf(
    input.ascendant
  );

  if (ascendantIndex < 0) {
    throw new Error("Invalid natal ascendant.");
  }

  const verifiedPositions:
    NatalPotentialInput["natalPositions"] = {};

  const invalidPlanets: PlanetName[] = [];
  const missingPlanets: PlanetName[] = [];

  for (const planet of PLANETS) {
    const position = input.natalPositions[planet];

    if (!position) {
      missingPlanets.push(planet);
      continue;
    }

    const signIndex = SIGNS.indexOf(position.sign);

    if (
      signIndex < 0 ||
      position.house !==
        ((signIndex - ascendantIndex + 12) % 12) + 1
    ) {
      invalidPlanets.push(planet);
      continue;
    }

    verifiedPositions[planet] = { ...position };
  }

  const completeClassicalData = ![
    ...invalidPlanets,
    ...missingPlanets,
  ].some(
    (planet) =>
      planet !== "Rahu" && planet !== "Ketu"
  );

  const activeMap = new Map<
    PlanetName,
    DashaPlanetActivation
  >();

  for (const activation of activations) {
    if (!verifiedPositions[activation.planet]) {
      continue;
    }

    if (
      !Number.isFinite(activation.strength) ||
      activation.strength <= 0 ||
      activation.levels.length === 0
    ) {
      continue;
    }

    const previous = activeMap.get(
      activation.planet
    );

    activeMap.set(activation.planet, {
      ...activation,
      levels: unique([
        ...(previous?.levels ?? []),
        ...activation.levels,
      ]),
      strength: Math.max(
        previous?.strength ?? 0,
        activation.strength
      ),
    });
  }

  const sambandha = resolveNatalSambandha({
    ascendant: input.ascendant,
    planets: verifiedPositions,
  });

  const evidenceMap = new Map<
    string,
    ConnectedDashaEvidence
  >();

  function register(
    activePlanet: PlanetName,
    connectedPlanet: PlanetName,
    relationship: ConnectedDashaSource,
    direction: ConnectedDashaEvidence["direction"]
  ) {
    if (activePlanet === connectedPlanet) return;

    const activation = activeMap.get(activePlanet);
    const activePosition =
      verifiedPositions[activePlanet];
    const targetPosition =
      verifiedPositions[connectedPlanet];

    if (
      !activation ||
      !activePosition ||
      !targetPosition
    ) {
      return;
    }

    const ownHouses = uniqueHouses([
      ...getPlanetLordships(
        input.ascendant,
        activePlanet
      ),
      activePosition.house,
    ]);

    const targetHouses: {
      house: number;
      source: ConnectedDashaEvidence["targetSource"];
    }[] = [
      ...getPlanetLordships(
        input.ascendant,
        connectedPlanet
      ).map((house) => ({
        house,
        source: "lordship" as const,
      })),
      {
        house: targetPosition.house,
        source: "natal_placement",
      },
    ];

    for (const target of targetHouses) {
      const houseRole = getJudgementHouseRole(
        rule,
        target.house
      );

      if (!houseRole) continue;

      const overlapsDirectActivation =
        ownHouses.includes(target.house);

      // Dispositor and inherited placement remain
      // contextual during the initial career pilot.
      const foundationalEligible =
        completeClassicalData &&
        houseRole !== "reinforcing" &&
        target.source === "lordship" &&
        relationship !== "dispositor" &&
        !overlapsDirectActivation;

      const key = [
        activePlanet,
        connectedPlanet,
        target.house,
        target.source,
        relationship,
        direction,
      ].join(":");

      evidenceMap.set(key, {
        activePlanet,
        connectedPlanet,
        house: target.house,
        houseRole,
        targetSource: target.source,
        relationship,
        direction,
        dashaLevels: [...activation.levels],
        dashaStrength: activation.strength,
        overlapsDirectActivation,
        foundationalEligible,
      });
    }
  }

  for (const relationship of sambandha.relationships) {
    const [first, second] = relationship.planets;
    const source = relationship.type;

    if (
      source !== "conjunction" &&
      source !== "aspect" &&
      source !== "mutual_aspect" &&
      source !== "exchange" &&
      source !== "dispositor"
    ) {
      continue;
    }

    register(
      first,
      second,
      source,
      relationship.directed
        ? "outgoing"
        : "mutual"
    );

    // A dispositor relationship is directional.
    // Do not automatically reverse it.
    if (source !== "dispositor") {
      register(
        second,
        first,
        source,
        relationship.directed
          ? "incoming"
          : "mutual"
      );
    }
  }

  const evidence = [...evidenceMap.values()];

  const foundationalEvidence = evidence.filter(
    (item) => item.foundationalEligible
  );

  const connectedCoreHouses = uniqueHouses(
    foundationalEvidence
      .filter((item) => item.houseRole === "core")
      .map((item) => item.house)
  );

  const connectedDistinctiveHouses = uniqueHouses(
    foundationalEvidence
      .filter(
        (item) =>
          item.houseRole === "required_distinctive" ||
          item.houseRole === "alternative_distinctive"
      )
      .map((item) => item.house)
  );

  // One active planet remains one activation identity,
  // regardless of how many relationships it possesses.
  const connectedActivePlanets = unique(
    foundationalEvidence.map(
      (item) => item.activePlanet
    )
  );

  return {
    eventId: rule.eventId,
    completeClassicalData,
    missingPlanets,
    invalidPlanets,
    evidence,
    foundationalEvidence,
    contextualEvidence: evidence.filter(
      (item) => !item.foundationalEligible
    ),
    connectedCoreHouses,
    connectedDistinctiveHouses,
    connectedActivePlanets,
    hasConnectedCoreActivation:
      connectedCoreHouses.length > 0,
  };
}