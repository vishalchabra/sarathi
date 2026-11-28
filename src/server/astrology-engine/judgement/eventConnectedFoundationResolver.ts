import type {
  NatalPotentialInput,
} from "./eventNatalPotentialResolver";

import {
  resolveNatalSambandha,
} from "../knowledge/natalSambandhaResolver";

import {
  getPlanetLordships,
} from "../knowledge/planetLordships";

import {
  getJudgementHouseRole,
} from "./eventJudgementEvidence";

import type {
  ConnectedDashaEvidence,
} from "./eventConnectedDashaResolver";

import type {
  EventNatalPotential,
  NatalRelationshipWitness,
  NatalHouseConnection,
} from "./eventNatalPotentialResolver";

import type {
  EventNatalMediation,
} from "./eventNatalMediationResolver";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

function matchesRelationship(
  row: ConnectedDashaEvidence,
  witness: NatalRelationshipWitness
): boolean {
  if (
    !witness.structural ||
    witness.source !== row.relationship ||
    witness.planets.length !== 2
  ) {
    return false;
  }

  const [first, second] = witness.planets;

  const forward =
    first === row.activePlanet &&
    second === row.connectedPlanet &&
    witness.toHouse === row.house;

  const reverse =
    second === row.activePlanet &&
    first === row.connectedPlanet &&
    witness.fromHouse === row.house;

  if (witness.directed) {
    return (
      (forward && row.direction === "outgoing") ||
      (reverse && row.direction === "incoming")
    );
  }

  return (
    row.direction === "mutual" &&
    (forward || reverse)
  );
}

export function resolveConnectedFoundation(
  rule: EventJudgementRule,
  natal: EventNatalPotential,
  mediation: EventNatalMediation,
  rows: readonly ConnectedDashaEvidence[],
  input?: NatalPotentialInput
) {
  if (
    rule.eventId !== natal.eventId ||
    rule.eventId !== mediation.eventId
  ) {
    throw new Error("Mismatched connected foundation.");
  }

  const supported =
    !mediation.incompleteClassicalData &&
    (
      mediation.hasDirectSupport ||
      mediation.hasMediatedSupport
    );

  const path =
    !mediation.hasDirectSupport &&
    mediation.hasMediatedSupport
      ? mediation.bestPath
      : null;

  const foundationHouses = new Set(
    mediation.hasDirectSupport
      ? [
          ...natal.connectedCoreHouses,
          ...natal.connectedDistinctiveHouses,
        ]
      : path
        ? [
            ...path.connectedCoreHouses,
            ...path.connectedDistinctiveHouses,
          ]
        : []
  );

  const edges: NatalHouseConnection[] =
    natal.structuralConnections.filter(
      edge =>
        foundationHouses.has(edge.firstHouse) &&
        foundationHouses.has(edge.secondHouse)
    );

  const singleCoreFoundation =
    rule.minimumCoreHouses === 1 &&
    rule.minimumDistinctiveHouses === 0 &&
    rule.requiredDistinctiveHouses.length === 0;

  // Preserve legitimate single-core foundations.
  if (
    mediation.hasDirectSupport &&
    singleCoreFoundation
  ) {
    for (const edge of natal.structuralConnections) {
      const firstCore =
        foundationHouses.has(edge.firstHouse);

      const secondCore =
        foundationHouses.has(edge.secondHouse);

      const validReinforcement =
        (
          firstCore &&
          rule.reinforcingHouses.includes(
            edge.secondHouse
          )
        ) ||
        (
          secondCore &&
          rule.reinforcingHouses.includes(
            edge.firstHouse
          )
        );

      if (
        validReinforcement &&
        !edges.includes(edge)
      ) {
        edges.push(edge);
      }
    }
  }

  const witnesses = edges.flatMap(
    edge => edge.relationshipWitnesses
  ).filter(witness => witness.structural);

  // A mediated path may contribute only its
  // verified mediator's actual structural records.
  if (path) {
    for (const edge of [
      path.firstEdge,
      path.secondEdge,
    ]) {
      witnesses.push(
        ...edge.relationshipWitnesses.filter(
          witness =>
            witness.structural &&
            witness.planets.includes(
              path.mediatingPlanet
            )
        )
      );
    }
  }

  const natalRelationships = input
    ? resolveNatalSambandha({
        ascendant: input.ascendant,
        planets: input.natalPositions,
      }).relationships
    : [];

  const assessments = rows.map(row => {
    const matchingWitnesses = witnesses.filter(
      witness => matchesRelationship(row, witness)
    );

    const targetFoundationWitnesses =
      witnesses.filter(witness => {
        if (!witness.structural) return false;

        if (witness.source === "lord_placement") {
          return (
            witness.planets.includes(
              row.connectedPlanet
            ) &&
            witness.fromHouse === row.house
          );
        }

        if (witness.planets.length !== 2) {
          return false;
        }

        return (
          (
            witness.planets[0] === row.connectedPlanet &&
            witness.fromHouse === row.house
          ) ||
          (
            witness.planets[1] === row.connectedPlanet &&
            witness.toHouse === row.house
          )
        );
      });

    const verifiedExternalRelationship =
      Boolean(input) &&
      row.activePlanet !== row.connectedPlanet &&
      row.relationship !== "dispositor" &&
      natalRelationships.some(relationship => {
        if (relationship.type !== row.relationship) {
          return false;
        }

        const [first, second] = relationship.planets;

        const forward =
          first === row.activePlanet &&
          second === row.connectedPlanet;

        const reverse =
          second === row.activePlanet &&
          first === row.connectedPlanet;

        return relationship.directed
          ? (
              (forward && row.direction === "outgoing") ||
              (reverse && row.direction === "incoming")
            )
          : (
              row.direction === "mutual" &&
              (forward || reverse)
            );
      });

    const validTargetLordship =
      input !== undefined &&
      getPlanetLordships(
        input.ascendant,
        row.connectedPlanet
      ).includes(row.house);

    const externalActivation =
      matchingWitnesses.length === 0 &&
      verifiedExternalRelationship &&
      validTargetLordship &&
      targetFoundationWitnesses.length > 0;

    const qualified =
      supported &&
      row.foundationalEligible &&
      row.targetSource === "lordship" &&
      !row.overlapsDirectActivation &&
      row.houseRole !== "reinforcing" &&
      row.relationship !== "dispositor" &&
      foundationHouses.has(row.house) &&
      getJudgementHouseRole(rule, row.house) ===
        row.houseRole &&
      (
        matchingWitnesses.length > 0 ||
        externalActivation
      );

    const rejectionReasons: string[] = [];

    if (!supported) {
      rejectionReasons.push("NATAL_FOUNDATION_UNSUPPORTED");
    }

    if (!row.foundationalEligible) {
      rejectionReasons.push("CONTEXTUAL_RELATIONSHIP");
    }

    if (row.targetSource !== "lordship") {
      rejectionReasons.push("NON_LORDSHIP_TARGET");
    }

    if (row.overlapsDirectActivation) {
      rejectionReasons.push("DIRECT_ACTIVATION_OVERLAP");
    }

    if (row.houseRole === "reinforcing") {
      rejectionReasons.push("REINFORCING_HOUSE_ONLY");
    }

    if (row.relationship === "dispositor") {
      rejectionReasons.push("DISPOSITOR_CONTEXT_ONLY");
    }

    if (!foundationHouses.has(row.house)) {
      rejectionReasons.push("OUTSIDE_SELECTED_FOUNDATION");
    }

    if (
      getJudgementHouseRole(rule, row.house) !==
      row.houseRole
    ) {
      rejectionReasons.push("HOUSE_ROLE_MISMATCH");
    }

    if (
      matchingWitnesses.length === 0 &&
      !externalActivation
    ) {
      rejectionReasons.push("NO_EXACT_STRUCTURAL_WITNESS");

      if (!verifiedExternalRelationship) {
        rejectionReasons.push(
          "EXTERNAL_RELATIONSHIP_UNVERIFIED"
        );
      }

      if (!validTargetLordship) {
        rejectionReasons.push(
          "EXTERNAL_TARGET_LORDSHIP_UNVERIFIED"
        );
      }

      if (targetFoundationWitnesses.length === 0) {
        rejectionReasons.push(
          "TARGET_NOT_STRUCTURAL_PARTICIPANT"
        );
      }
    }

    const activationPathway = qualified
      ? matchingWitnesses.length > 0
        ? "STRUCTURAL" as const
        : "EXTERNAL" as const
      : "REJECTED" as const;

    return {
      row,
      qualified,
      matchingWitnesses,
      targetFoundationWitnesses,
      verifiedExternalRelationship,
      validTargetLordship,
      activationPathway,
      rejectionReasons,
    };
  });

  return {
    eventId: rule.eventId,
    supported,
    foundationHouses: [...foundationHouses].sort(
      (a, b) => a - b
    ),
    assessments,
    structuralRows: assessments
      .filter(item => item.activationPathway === "STRUCTURAL")
      .map(item => item.row),
    externalRows: assessments
      .filter(item => item.activationPathway === "EXTERNAL")
      .map(item => item.row),
    qualifiedRows: assessments
      .filter(item => item.qualified)
      .map(item => item.row),
    rejectedRows: assessments
      .filter(item => !item.qualified),
  };
}
