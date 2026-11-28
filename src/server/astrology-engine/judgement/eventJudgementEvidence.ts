import type {
  DashaPlanetActivation,
} from "../knowledge/dashaActivation";

import {
  EVENT_THEMES,
} from "../knowledge/eventThemes";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import {
  getEventDashaHouseEvidence,
} from "./eventDashaEvidence";

import type {
  EventDashaHouseEvidence,
} from "./eventDashaEvidence";

export type JudgementHouseRole =
  | "core"
  | "required_distinctive"
  | "alternative_distinctive"
  | "reinforcing";

export type JudgementDashaEvidence =
  EventDashaHouseEvidence & {
    judgementHouseRole: JudgementHouseRole;
  };

export type EventJudgementEvidence = {
  eventId: EventJudgementRule["eventId"];

  relevantHouses: number[];

  evidence: JudgementDashaEvidence[];

  directEvidence: JudgementDashaEvidence[];

  indirectEvidence: JudgementDashaEvidence[];

  supportingEvidence: JudgementDashaEvidence[];

  directCoreHouses: number[];

  directRequiredDistinctiveHouses: number[];

  directAlternativeDistinctiveHouses: number[];

  directReinforcingHouses: number[];

  uniqueDirectPlanets: string[];

  missingCoreHouses: number[];

  missingRequiredDistinctiveHouses: number[];

  hasMinimumDirectCoreCoverage: boolean;

  hasAllRequiredDistinctiveHouses: boolean;

  hasMinimumDirectDistinctiveCoverage: boolean;

  overlappingDispositorCount: number;
};

function uniqueHouses(
  houses: readonly number[]
): number[] {
  return [...new Set(houses)].sort(
    (a, b) => a - b
  );
}

export function getJudgementHouseRole(
  rule: EventJudgementRule,
  house: number
): JudgementHouseRole | undefined {

  if (rule.coreHouses.includes(house)) {
    return "core";
  }

  if (
    rule.requiredDistinctiveHouses.includes(house)
  ) {
    return "required_distinctive";
  }

  if (
    rule.alternativeDistinctiveHouses.includes(house)
  ) {
    return "alternative_distinctive";
  }

  if (rule.reinforcingHouses.includes(house)) {
    return "reinforcing";
  }

  return undefined;
}

export function resolveEventJudgementEvidence(
  rule: EventJudgementRule,
  activations: readonly DashaPlanetActivation[]
): EventJudgementEvidence {

  const originalTheme = EVENT_THEMES.find(
    (theme) => theme.id === rule.eventId
  );

  if (!originalTheme) {
    throw new Error(
      `Unknown event judgement rule: ${rule.eventId}`
    );
  }

  const relevantHouses = uniqueHouses([
    ...rule.coreHouses,
    ...rule.requiredDistinctiveHouses,
    ...rule.alternativeDistinctiveHouses,
    ...rule.reinforcingHouses,
  ]);

  const revisedTheme = {
    ...originalTheme,

    primaryHouses: [...rule.coreHouses],

    supportingHouses: relevantHouses.filter(
      (house) => !rule.coreHouses.includes(house)
    ),

    requiredHouses: [
      ...rule.requiredDistinctiveHouses,
    ],
  };

  const rawEvidence = getEventDashaHouseEvidence(
    revisedTheme,
    activations,
    { includeNatalAspects: true }
  );

  const evidenceMap = new Map<
    string,
    JudgementDashaEvidence
  >();

  for (const item of rawEvidence) {

    const judgementHouseRole =
      getJudgementHouseRole(rule, item.house);

    if (!judgementHouseRole) {
      continue;
    }

    const key = [
      item.planet,
      item.house,
      item.source,
      item.dispositor ?? "",
    ].join(":");

    const previous = evidenceMap.get(key);

    if (!previous) {

      evidenceMap.set(key, {
        ...item,
        judgementHouseRole,
      });

      continue;
    }

    evidenceMap.set(key, {
      ...previous,

      strength: Math.max(
        previous.strength,
        item.strength
      ),

      dashaStrength: Math.max(
        previous.dashaStrength,
        item.dashaStrength
      ),

      dashaLevels: [
        ...new Set([
          ...previous.dashaLevels,
          ...item.dashaLevels,
        ]),
      ],

      overlapsWithActiveDispositor:
        previous.overlapsWithActiveDispositor ||
        item.overlapsWithActiveDispositor,
    });
  }

  const evidence = [...evidenceMap.values()];

  const directEvidence = evidence.filter(
    (item) => item.activationClass === "direct"
  );

  const indirectEvidence = evidence.filter(
    (item) => item.activationClass === "indirect"
  );

  const supportingEvidence = evidence.filter(
    (item) => item.activationClass === "supporting"
  );

  const directHousesForRole = (
    role: JudgementHouseRole
  ): number[] =>
    uniqueHouses(
      directEvidence
        .filter(
          (item) => item.judgementHouseRole === role
        )
        .map((item) => item.house)
    );

  const directCoreHouses =
    directHousesForRole("core");

  const directRequiredDistinctiveHouses =
    directHousesForRole("required_distinctive");

  const directAlternativeDistinctiveHouses =
    directHousesForRole("alternative_distinctive");

  const directReinforcingHouses =
    directHousesForRole("reinforcing");

  const directDistinctiveHouses = uniqueHouses([
    ...directRequiredDistinctiveHouses,
    ...directAlternativeDistinctiveHouses,
  ]);

  const missingCoreHouses =
    rule.coreHouses.filter(
      (house) => !directCoreHouses.includes(house)
    );

  const missingRequiredDistinctiveHouses =
    rule.requiredDistinctiveHouses.filter(
      (house) =>
        !directRequiredDistinctiveHouses.includes(
          house
        )
    );

  return {

    eventId: rule.eventId,

    relevantHouses,

    evidence,

    directEvidence,

    indirectEvidence,

    supportingEvidence,

    directCoreHouses,

    directRequiredDistinctiveHouses,

    directAlternativeDistinctiveHouses,

    directReinforcingHouses,

    uniqueDirectPlanets: [
      ...new Set(
        directEvidence.map(
          (item) => item.planet
        )
      ),
    ].sort(),

    missingCoreHouses,

    missingRequiredDistinctiveHouses,

    hasMinimumDirectCoreCoverage:
      directCoreHouses.length >=
      rule.minimumCoreHouses,

    hasAllRequiredDistinctiveHouses:
      missingRequiredDistinctiveHouses.length === 0,

    hasMinimumDirectDistinctiveCoverage:
      directDistinctiveHouses.length >=
      rule.minimumDistinctiveHouses,

    overlappingDispositorCount:
      indirectEvidence.filter(
        (item) => item.overlapsWithActiveDispositor
      ).length,
  };
}