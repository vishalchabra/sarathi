import type {
  PlanetName,
} from "../types";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import {
  buildEventDivisionalChart,
  type DivisionalEvidenceInput,
} from "./eventDivisionalEvidence";

const MONEY_EVENTS = new Set<string>([
  "money_inflow",
  "money_outflow",
  "money_planning",
  "money_accumulation",
  "money_settlement",
]);

export function resolveEventHoraEvidence(
  rule: EventJudgementRule,
  input: DivisionalEvidenceInput,
  participatingPlanets: readonly PlanetName[],
) {
  const applicable = MONEY_EVENTS.has(rule.eventId);

  const chart = applicable
    ? buildEventDivisionalChart(input, 2)
    : null;

  const activePeriods = [
    { level: "MD", planet: input.dasha.mahadasha },
    { level: "AD", planet: input.dasha.antardasha },
    { level: "PD", planet: input.dasha.pratyantardasha },
  ] as const;

  const ascendantHoraLord =
    chart?.ascendant === "Leo"
      ? "Sun"
      : chart?.ascendant === "Cancer"
        ? "Moon"
        : null;

  const periodEvidence = applicable
    ? activePeriods.map(period => {
        const planet = period.planet;

        const position = planet
          ? chart?.positions[planet]
          : undefined;

        const horaLord =
          position?.sign === "Leo"
            ? "Sun"
            : position?.sign === "Cancer"
              ? "Moon"
              : null;

        return {
          level: period.level,
          planet,
          horaSign: position?.sign ?? null,
          horaLord,
          participatesInD1Event:
            planet != null &&
            participatingPlanets.includes(planet),
          sharesAscendantHora:
            position != null &&
            position.sign === chart?.ascendant,
        };
      })
    : [];

  const completePeriodData =
    periodEvidence.length === 3 &&
    periodEvidence.every(
      row => row.planet != null && row.horaLord != null
    );

  const available = Boolean(
    applicable &&
    chart?.completeClassicalData &&
    ascendantHoraLord &&
    completePeriodData
  );

  const eventLinkedPeriods = available
    ? periodEvidence.filter(
        row => row.participatesInD1Event
      )
    : [];

  const uniqueEventLinkedPlanets = [
    ...new Set(
      eventLinkedPeriods.map(row => row.planet)
    ),
  ];

  const level =
    !applicable
      ? "NOT_APPLICABLE"
      : !available
        ? "UNAVAILABLE"
        : eventLinkedPeriods.length > 0
          ? "EVENT_LINKED_CONTEXT"
          : "GENERAL_CONTEXT";

  return {
    eventId: rule.eventId,
    applicable,
    available,
    level,

    convention: "PARASHARI_SUN_MOON_HORA" as const,

    chart,
    ascendantHoraLord,

    sunHora: chart?.positions.Sun?.sign ?? null,
    moonHora: chart?.positions.Moon?.sign ?? null,

    periodEvidence,
    eventLinkedPeriods,
    uniqueEventLinkedPlanets,

    completePeriodData,

    // Hora distribution alone does not establish
    // financial strength or transaction direction.
    independentlyConfirmsEvent: false as const,
    contributesToBaseScore: false as const,
  };
}