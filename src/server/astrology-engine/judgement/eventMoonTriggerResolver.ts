import type {
  ConnectedDashaEvidence,
} from "./eventConnectedDashaResolver";

import type {
  PlanetName,
} from "../types";

import type {
  PersonalizedDailyPredictionInput,
} from "../personalizedDailyPredictionGenerator";

import {
  getPlanetLordships,
} from "../knowledge/planetLordships";

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
  EventTransitEvidence,
} from "./eventTransitEvidence";

import type {
  EventTransitGeometry,
  TransitNatalContact,
} from "./eventTransitGeometry";

export type MoonTriggerLevel =
  | "NONE"
  | "AREA"
  | "CORE"
  | "DISTINCTIVE"
  | "CONVERGENT";

export type MoonTriggerSource =
  | "moon_transit_house"
  | "moon_functional_lordship"
  | "nakshatra_lordship"
  | "nakshatra_natal_placement"
  | "navamsa_lordship"
  | "navamsa_natal_placement"
  | "moon_natal_contact";

export type MoonTriggerContext = Pick<
  PersonalizedDailyPredictionInput,
  "ascendant" | "natalPositions"
> & {
  nakshatraLord: PlanetName | null;
  navamsaLord: PlanetName | null;
  nakshatra?: string | null;
  pada?: number | null;
};

export type MoonTriggerEvidenceRow = {
  planet: PlanetName;
  house: number;
  houseRole: JudgementHouseRole;
  sources: MoonTriggerSource[];

  connectsDirectDashaPlanet: boolean;
  connectsConnectedDashaPlanet?: boolean;
  connectsDirectDashaHouse: boolean;

  connectsQualifyingTransitPlanet: boolean;
  connectsQualifyingTransitHouse: boolean;

  closeNatalContact: boolean;

  contacts: TransitNatalContact[];
};

export type EventMoonTriggerEvidence = {
  eventId: EventJudgementRule["eventId"];

  level: MoonTriggerLevel;

  moonHouse: number | null;
  nakshatra: string | null;
  pada: number | null;

  nakshatraLord: PlanetName | null;
  navamsaLord: PlanetName | null;

  evidence: MoonTriggerEvidenceRow[];

  activatedHouses: number[];
  activatedCoreHouses: number[];
  activatedDistinctiveHouses: number[];
  activatedReinforcingHouses: number[];

  uniqueTriggerPlanets: PlanetName[];

  directDashaConnectedPlanets: PlanetName[];
  transitConnectedPlanets: PlanetName[];

  sharedDashaHouses: number[];
  sharedTransitHouses: number[];

  convergentHouses: number[];
  convergentDistinctiveHouses: number[];

  hasDirectDashaConnection: boolean;
  hasIndependentTransitConnection: boolean;

  hasCoreTrigger: boolean;
  hasDistinctiveTrigger: boolean;

  hasFoundationalEventCoverage: boolean;

  hasEventSpecificDailyTrigger: boolean;

  hasMoonGeometry: boolean;
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

function isDistinctiveRole(
  role: JudgementHouseRole
): boolean {
  return (
    role === "required_distinctive" ||
    role === "alternative_distinctive"
  );
}

export function resolveEventMoonTrigger(
  rule: EventJudgementRule,
  dasha: EventJudgementEvidence,
  transit: EventTransitEvidence,
  geometry: EventTransitGeometry,
  context: MoonTriggerContext,
  connected: readonly ConnectedDashaEvidence[] = []
): EventMoonTriggerEvidence {

  if (
    dasha.eventId !== rule.eventId ||
    transit.eventId !== rule.eventId
  ) {
    throw new Error(
      `Mismatched Moon trigger evidence: ${rule.eventId}`
    );
  }

  const directDashaPlanets = new Set(
    dasha.directEvidence.map(
      (item) => item.planet
    )
  );

  const directDashaHouses = new Set(
    dasha.directEvidence.map(
      (item) => item.house
    )
  );

  const connectedRows = connected.filter(
    row => row.foundationalEligible
  );

  const connectedPlanetHouseKeys = new Set(
    connectedRows.map(
      row => `${row.connectedPlanet}:${row.house}`
    )
  );

  const qualifyingTransitPlanets = new Set(
    transit.qualifyingTransitPlanets
  );

  const qualifyingTransitHouses = new Set(
    transit.qualifyingHouses
  );

  const evidenceMap = new Map<
    string,
    MoonTriggerEvidenceRow
  >();

  function register(
    planet: PlanetName,
    house: number,
    source: MoonTriggerSource,
    contact?: TransitNatalContact
  ): void {

    const houseRole =
      getJudgementHouseRole(rule, house);

    if (!houseRole) {
      return;
    }

    const key = `${planet}:${house}`;

    const existing = evidenceMap.get(key);

    if (existing) {

      if (!existing.sources.includes(source)) {
        existing.sources.push(source);
      }

      if (contact) {

        const duplicate =
          existing.contacts.some(
            (item) =>
              item.transitPlanet ===
                contact.transitPlanet &&
              item.natalPlanet ===
                contact.natalPlanet &&
              item.contactType ===
                contact.contactType &&
              item.aspectHouse ===
                contact.aspectHouse
          );

        if (!duplicate) {
          existing.contacts.push(contact);
        }

        existing.closeNatalContact = true;
      }

      return;
    }

    evidenceMap.set(key, {

      planet,
      house,
      houseRole,

      sources: [source],

      connectsDirectDashaPlanet:
        directDashaPlanets.has(planet),

      connectsConnectedDashaPlanet:
        connectedPlanetHouseKeys.has(
          `${planet}:${house}`
        ),

      connectsDirectDashaHouse:
        directDashaHouses.has(house),

      connectsQualifyingTransitPlanet:
        qualifyingTransitPlanets.has(planet),

      connectsQualifyingTransitHouse:
        qualifyingTransitHouses.has(house),

      closeNatalContact: Boolean(contact),

      contacts: contact ? [contact] : [],
    });
  }

  // 1. Physical Moon transit and functional role.

  const moonPosition =
    geometry.moonPosition?.planet === "Moon"
      ? geometry.moonPosition
      : null;

  if (moonPosition) {

    register(
      "Moon",
      moonPosition.house,
      "moon_transit_house"
    );

    for (const house of moonPosition.ruledHouses) {

      register(
        "Moon",
        house,
        "moon_functional_lordship"
      );
    }
  }

  // 2. Nakshatra and Navamsa lord connections.
  // Functional lordship is evaluated independently
  // of natural planetary signification.

  function registerLord(
    planet: PlanetName | null,
    source: "nakshatra" | "navamsa"
  ): void {

    if (!planet || !moonPosition) {
      return;
    }

    const lordshipSource: MoonTriggerSource =
      source === "nakshatra"
        ? "nakshatra_lordship"
        : "navamsa_lordship";

    const placementSource: MoonTriggerSource =
      source === "nakshatra"
        ? "nakshatra_natal_placement"
        : "navamsa_natal_placement";

    for (
      const house of getPlanetLordships(
        context.ascendant,
        planet
      )
    ) {
      register(
        planet,
        house,
        lordshipSource
      );
    }

    const natalPosition =
      context.natalPositions[planet];

    if (natalPosition) {
      register(
        planet,
        natalPosition.house,
        placementSource
      );
    }
  }

  registerLord(
    context.nakshatraLord,
    "nakshatra"
  );

  registerLord(
    context.navamsaLord,
    "navamsa"
  );

  // 3. Degree-sensitive Moon contacts.
  // Unknown or wide contacts cannot qualify here.

  if (moonPosition) {

    for (const contact of geometry.moonNatalContacts) {

      if (contact.transitPlanet !== "Moon") {
        continue;
      }

      if (
        contact.orb === null ||
        !Number.isFinite(contact.orb) ||
        contact.orb < 0 ||
        contact.orb > 3
      ) {
        continue;
      }

      const houses = uniqueHouses([
        contact.natalHouse,
        ...contact.natalRuledHouses,
      ]);

      for (const house of houses) {

        register(
          contact.natalPlanet,
          house,
          "moon_natal_contact",
          contact
        );
      }
    }
  }

  const evidence = [...evidenceMap.values()];

  const activatedHouses = uniqueHouses(
    evidence.map((item) => item.house)
  );

  const activatedCoreHouses = uniqueHouses(
    evidence
      .filter(
        (item) => item.houseRole === "core"
      )
      .map((item) => item.house)
  );

  const activatedDistinctiveHouses = uniqueHouses(
    evidence
      .filter(
        (item) => isDistinctiveRole(item.houseRole)
      )
      .map((item) => item.house)
  );

  const activatedReinforcingHouses = uniqueHouses(
    evidence
      .filter(
        (item) =>
          item.houseRole === "reinforcing"
      )
      .map((item) => item.house)
  );

  // Multiple sources referring to the same planet
  // must not become independent confirmations.

  const uniqueTriggerPlanets = uniquePlanets(
    evidence.map((item) => item.planet)
  );

  const directDashaConnectedPlanets =
    uniquePlanets(
      evidence
        .filter(
          (item) => item.connectsDirectDashaPlanet
        )
        .map((item) => item.planet)
    );

  const transitConnectedPlanets =
    uniquePlanets(
      evidence
        .filter(
          (item) =>
            item.connectsQualifyingTransitPlanet
        )
        .map((item) => item.planet)
    );

  const sharedDashaHouses = uniqueHouses(
    evidence
      .filter(
        (item) => item.connectsDirectDashaHouse
      )
      .map((item) => item.house)
  );

  const sharedTransitHouses = uniqueHouses(
    evidence
      .filter(
        (item) =>
          item.connectsQualifyingTransitHouse
      )
      .map((item) => item.house)
  );

  const hasDirectDashaConnection =
    directDashaConnectedPlanets.length > 0;

  const hasIndependentTransitConnection =
    transit.hasIndependentTransitEvidence &&
    (
      transitConnectedPlanets.length > 0 ||
      sharedTransitHouses.length > 0
    );

  // Convergence must occur within the same
  // evidence row, not across unrelated rows.

  const convergentEvidence = evidence.filter(
    (item) =>

      item.houseRole !== "reinforcing" &&

      // Direct planetary Dasha connection must
      // exist within this same evidence row.
      (
        item.connectsDirectDashaPlanet ||
        item.connectsConnectedDashaPlanet
      ) &&

      // Independent transit relevance must also
      // exist within this same evidence row.
      (
        item.connectsQualifyingTransitPlanet ||
        item.connectsQualifyingTransitHouse
      ) &&

      // The Moon cannot introduce a missing
      // foundational event house.
      transit.combinedHouses.includes(
        item.house
      )
  );

  const convergentHouses = uniqueHouses(
    convergentEvidence.map(
      (item) => item.house
    )
  );

  const convergentDistinctiveHouses =
    uniqueHouses(
      convergentEvidence
        .filter(
          (item) =>
            isDistinctiveRole(item.houseRole)
        )
        .map((item) => item.house)
    );

  const hasCoreTrigger =
    activatedCoreHouses.length > 0;

  const hasDistinctiveTrigger =
    activatedDistinctiveHouses.length > 0;

  // Moon cannot repair missing foundational
  // Dasha and independent transit coverage.

  const hasFoundationalEventCoverage =

    (
      dasha.directCoreHouses.length > 0 ||
      connectedRows.some(
        row => row.houseRole === "core"
      )
    ) &&

    transit.hasMinimumCombinedCoreCoverage &&

    transit.hasAllCombinedRequiredDistinctiveHouses &&

    transit.hasMinimumCombinedDistinctiveCoverage &&

    (
      !rule.requiresIndependentTransit ||
      (
        transit.hasIndependentTransitEvidence &&
        transit.hasDashaTransitConvergence
      )
    );

  const requiresDistinctiveTrigger =
    rule.minimumDistinctiveHouses > 0 ||
    rule.requiredDistinctiveHouses.length > 0;

  const hasRelevantConvergence =
    requiresDistinctiveTrigger
      ? convergentDistinctiveHouses.length > 0
      : convergentEvidence.some(
          (item) => item.houseRole === "core"
        );

  const hasEventSpecificDailyTrigger =

    hasFoundationalEventCoverage &&

    (
      hasDirectDashaConnection ||
      convergentEvidence.some(
        row => row.connectsConnectedDashaPlanet
      )
    ) &&

    hasIndependentTransitConnection &&

    hasRelevantConvergence;

  let level: MoonTriggerLevel = "NONE";

  if (evidence.length > 0) {
    level = "AREA";
  }

  if (hasCoreTrigger) {
    level = "CORE";
  }

  if (hasDistinctiveTrigger) {
    level = "DISTINCTIVE";
  }

  if (hasEventSpecificDailyTrigger) {
    level = "CONVERGENT";
  }

  return {

    eventId: rule.eventId,

    level,

    moonHouse: moonPosition?.house ?? null,

    nakshatra: context.nakshatra ?? null,

    pada: context.pada ?? null,

    nakshatraLord: context.nakshatraLord,

    navamsaLord: context.navamsaLord,

    evidence,

    activatedHouses,
    activatedCoreHouses,
    activatedDistinctiveHouses,
    activatedReinforcingHouses,

    uniqueTriggerPlanets,

    directDashaConnectedPlanets,
    transitConnectedPlanets,

    sharedDashaHouses,
    sharedTransitHouses,

    convergentHouses,
    convergentDistinctiveHouses,

    hasDirectDashaConnection,
    hasIndependentTransitConnection,

    hasCoreTrigger,
    hasDistinctiveTrigger,

    hasFoundationalEventCoverage,

    hasEventSpecificDailyTrigger,

    hasMoonGeometry: moonPosition !== null,
  };
}