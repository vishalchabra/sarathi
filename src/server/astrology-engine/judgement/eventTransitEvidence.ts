import type {
  ConnectedDashaEvidence,
} from "./eventConnectedDashaResolver";

import type {
  PlanetName,
} from "../types";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import {
  getJudgementHouseRole,
} from "./eventJudgementEvidence";

import type {
  EventJudgementEvidence,
  JudgementHouseRole,
} from "./eventJudgementEvidence";

import type {
  EventTransitGeometry,
  TransitNatalContact,
} from "./eventTransitGeometry";

export type EventTransitEvidenceSource =
  | "physical_placement"
  | "functional_lordship"
  | "sign_aspect"
  | "natal_contact";

export type EventTransitEvidenceRow = {
  planet: PlanetName;

  house: number;

  houseRole: JudgementHouseRole;

  source: EventTransitEvidenceSource;

  transitHouse: number;

  connectsDirectDasha: boolean;
  connectsConnectedDasha?: boolean;

  connectsDistinctEventHouses: boolean;

  natalTarget?: PlanetName;

  contact?: TransitNatalContact;

  closeDegreeContact: boolean;

  qualifying: boolean;
};

export type EventTransitEvidence = {
  eventId: EventJudgementRule["eventId"];

  evidence: EventTransitEvidenceRow[];

  qualifyingEvidence: EventTransitEvidenceRow[];

  backgroundEvidence: EventTransitEvidenceRow[];

  physicalHouses: number[];

  qualifyingHouses: number[];

  qualifyingCoreHouses: number[];

  qualifyingDistinctiveHouses: number[];

  qualifyingTransitPlanets: PlanetName[];

  directDashaConnectedPlanets: PlanetName[];

  closeNatalContactPlanets: PlanetName[];

  directDashaHouses: number[];

  sharedDashaTransitHouses: number[];

  combinedHouses: number[];

  additionalTransitHouses: number[];

  missingCoreHouses: number[];

  missingRequiredDistinctiveHouses: number[];

  hasMinimumCombinedCoreCoverage: boolean;

  hasAllCombinedRequiredDistinctiveHouses: boolean;

  hasMinimumCombinedDistinctiveCoverage: boolean;

  hasIndependentTransitEvidence: boolean;

  hasDashaTransitConvergence: boolean;
};

function uniqueHouses(
  houses: readonly number[]
): number[] {
  return [...new Set(houses)].sort(
    (a, b) => a - b
  );
}

function uniquePlanets(
  planets: readonly PlanetName[]
): PlanetName[] {
  return [...new Set(planets)].sort();
}

export function resolveEventTransitEvidence(
  rule: EventJudgementRule,
  dasha: EventJudgementEvidence,
  geometry: EventTransitGeometry,
  connected: readonly ConnectedDashaEvidence[] = []
): EventTransitEvidence {

  if (rule.eventId !== dasha.eventId) {
    throw new Error(
      "Event rule and Dasha evidence do not match."
    );
  }

  const relevantHouses = uniqueHouses([
    ...rule.coreHouses,
    ...rule.requiredDistinctiveHouses,
    ...rule.alternativeDistinctiveHouses,
    ...rule.reinforcingHouses,
  ]);

  const relevantHouseSet =
    new Set(relevantHouses);

  const directDashaHouses = uniqueHouses(
    dasha.directEvidence.map(
      (row) => row.house
    )
  );

  const directDashaHouseSet =
    new Set(directDashaHouses);

  const connectedRows = connected.filter(
    row => row.foundationalEligible
  );

  const activationHouseSet = new Set([
    ...directDashaHouses,
    ...connectedRows.map(row => row.house),
  ]);

  const directDashaPlanetSet =
    new Set(
      dasha.directEvidence.map(
        (row) => row.planet
      )
    );

  const connectedPlanetHouseKeys = new Set(
    connectedRows.map(
      row => `${row.connectedPlanet}:${row.house}`
    )
  );

  const evidence: EventTransitEvidenceRow[] = [];

  function addEvidence(
    row: Omit<
      EventTransitEvidenceRow,
      "houseRole"
    >
  ) {
    const houseRole =
      getJudgementHouseRole(
        rule,
        row.house
      );

    if (!houseRole) return;

    evidence.push({
      ...row,
      houseRole,
      connectsConnectedDasha:
        row.qualifying &&
        !row.connectsDirectDasha,
    });
  }

  for (
    const transit of
    geometry.independentPositions
  ) {

    if (transit.planet === "Moon") {
      continue;
    }

    const physicalRelevant =
      relevantHouseSet.has(
        transit.house
      );

    const relevantRuledHouses =
      transit.ruledHouses.filter(
        (house) =>
          relevantHouseSet.has(house)
      );

    const planetDirectlyActive =
      directDashaPlanetSet.has(
        transit.planet
      );

    const functionalBridge =
      physicalRelevant &&
      relevantRuledHouses.some(
        (house) =>
          house !== transit.house
      );

    const lordshipDashaBridge =
      relevantRuledHouses.some(
        (house) =>
          directDashaHouseSet.has(house)
      );

    if (physicalRelevant) {

      const connectsDirectDasha =
        planetDirectlyActive ||
        directDashaHouseSet.has(transit.house) ||
        lordshipDashaBridge;

      addEvidence({
        planet: transit.planet,
        house: transit.house,
        source: "physical_placement",
        transitHouse: transit.house,
        connectsDirectDasha,
        connectsDistinctEventHouses:
          functionalBridge,
        closeDegreeContact: false,

        qualifying:
          connectsDirectDasha ||
          activationHouseSet.has(transit.house),
      });
    }

    for (
      const house of relevantRuledHouses
    ) {

      const connectsDirectDasha =
        planetDirectlyActive ||
        (
          physicalRelevant &&
          directDashaHouseSet.has(
            transit.house
          )
        );

      addEvidence({
        planet: transit.planet,
        house,
        source: "functional_lordship",
        transitHouse: transit.house,

        connectsDirectDasha,

        connectsDistinctEventHouses:
          physicalRelevant &&
          house !== transit.house,

        closeDegreeContact: false,

        qualifying:
          physicalRelevant &&
          house !== transit.house &&
          (
            connectsDirectDasha ||
            connectedPlanetHouseKeys.has(
              `${transit.planet}:${house}`
            ) ||
            activationHouseSet.has(transit.house)
          ),
      });
    }

    for (
      const house of
      transit.aspectedHouses
    ) {

      if (!relevantHouseSet.has(house)) {
        continue;
      }

      const connectsDirectDasha =
        planetDirectlyActive ||
        directDashaHouseSet.has(house);

      addEvidence({
        planet: transit.planet,
        house,
        source: "sign_aspect",
        transitHouse: transit.house,

        connectsDirectDasha,

        connectsDistinctEventHouses:
          physicalRelevant &&
          house !== transit.house,

        closeDegreeContact: false,

        // Sign-only aspects remain
        // background evidence.
        qualifying: false,
      });
    }
  }

  for (
    const contact of
    geometry.independentNatalContacts
  ) {

    if (contact.transitPlanet === "Moon") {
      continue;
    }

    const closeDegreeContact =
      contact.degreeBand === "exact" ||
      contact.degreeBand === "close" ||
      contact.degreeBand === "moderate";

    const natalRelevantHouses =
      uniqueHouses([
        contact.natalHouse,
        ...contact.natalRuledHouses,
      ]).filter(
        (house) =>
          relevantHouseSet.has(house)
      );

    const connectsDirectDasha =
      directDashaPlanetSet.has(
        contact.transitPlanet
      ) ||
      directDashaPlanetSet.has(
        contact.natalPlanet
      );

    for (
      const house of natalRelevantHouses
    ) {

      addEvidence({
        planet: contact.transitPlanet,
        house,
        source: "natal_contact",
        transitHouse:
          contact.transitHouse,

        connectsDirectDasha,

        connectsDistinctEventHouses:
          relevantHouseSet.has(
            contact.transitHouse
          ) &&
          contact.transitHouse !== house,

        natalTarget:
          contact.natalPlanet,

        contact,

        closeDegreeContact,

        qualifying:
          closeDegreeContact &&
          (
            connectsDirectDasha ||
            connectedPlanetHouseKeys.has(
              `${contact.natalPlanet}:${house}`
            )
          ),
      });
    }
  }

  const uniqueEvidence = [
    ...new Map(
      evidence.map((row) => [
        [
          row.planet,
          row.house,
          row.source,
          row.natalTarget ?? "",
          row.contact?.aspectHouse ?? "",
        ].join(":"),
        row,
      ])
    ).values(),
  ];

  const qualifyingEvidence =
    uniqueEvidence.filter(
      (row) => row.qualifying
    );

  const backgroundEvidence =
    uniqueEvidence.filter(
      (row) => !row.qualifying
    );

  const physicalHouses = uniqueHouses(
    uniqueEvidence
      .filter(
        (row) =>
          row.source ===
          "physical_placement"
      )
      .map((row) => row.house)
  );

  const qualifyingHouses = uniqueHouses(
    qualifyingEvidence.map(
      (row) => row.house
    )
  );

  const qualifyingCoreHouses =
    qualifyingHouses.filter(
      (house) =>
        rule.coreHouses.includes(house)
    );

  const distinctiveHouses =
    uniqueHouses([
      ...rule.requiredDistinctiveHouses,
      ...rule.alternativeDistinctiveHouses,
    ]);

  const qualifyingDistinctiveHouses =
    qualifyingHouses.filter(
      (house) =>
        distinctiveHouses.includes(house)
    );

  const qualifyingTransitPlanets =
    uniquePlanets(
      qualifyingEvidence.map(
        (row) => row.planet
      )
    );

  const directDashaConnectedPlanets =
    uniquePlanets(
      qualifyingEvidence
        .filter(
          (row) =>
            row.connectsDirectDasha
        )
        .map((row) => row.planet)
    );

  const closeNatalContactPlanets =
    uniquePlanets(
      qualifyingEvidence
        .filter(
          (row) =>
            row.source === "natal_contact" &&
            row.closeDegreeContact
        )
        .map((row) => row.planet)
    );

  const sharedDashaTransitHouses =
    qualifyingHouses.filter(
      (house) =>
        directDashaHouseSet.has(house)
    );

  const combinedHouses =
    uniqueHouses([
      ...activationHouseSet,
      ...qualifyingHouses,
    ]);

  const combinedHouseSet =
    new Set(combinedHouses);

  const additionalTransitHouses =
    qualifyingHouses.filter(
      (house) =>
        !directDashaHouseSet.has(house)
    );

  const missingCoreHouses =
    rule.coreHouses.filter(
      (house) =>
        !combinedHouseSet.has(house)
    );

  const missingRequiredDistinctiveHouses =
    rule.requiredDistinctiveHouses.filter(
      (house) =>
        !combinedHouseSet.has(house)
    );

  const combinedCoreCount =
    rule.coreHouses.filter(
      (house) =>
        combinedHouseSet.has(house)
    ).length;

  const combinedDistinctiveCount =
    distinctiveHouses.filter(
      (house) =>
        combinedHouseSet.has(house)
    ).length;

  return {
    eventId: rule.eventId,

    evidence: uniqueEvidence,

    qualifyingEvidence,

    backgroundEvidence,

    physicalHouses,

    qualifyingHouses,

    qualifyingCoreHouses,

    qualifyingDistinctiveHouses,

    qualifyingTransitPlanets,

    directDashaConnectedPlanets,

    closeNatalContactPlanets,

    directDashaHouses,

    sharedDashaTransitHouses,

    combinedHouses,

    additionalTransitHouses,

    missingCoreHouses,

    missingRequiredDistinctiveHouses,

    hasMinimumCombinedCoreCoverage:
      combinedCoreCount >=
      rule.minimumCoreHouses,

    hasAllCombinedRequiredDistinctiveHouses:
      missingRequiredDistinctiveHouses
        .length === 0,

    hasMinimumCombinedDistinctiveCoverage:
      combinedDistinctiveCount >=
      rule.minimumDistinctiveHouses,

    hasIndependentTransitEvidence:
      qualifyingTransitPlanets.length > 0,

    hasDashaTransitConvergence:
      activationHouseSet.size > 0 &&
      qualifyingEvidence.length > 0,
  };
}