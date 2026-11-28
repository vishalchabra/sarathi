import {
  resolveEventCompetition,
} from "./eventCompetitionResolver";

import type {
  TemporalEventResolution,
} from "./eventTemporalResolution";

const FINANCIAL_EVENT_HOUSES: Record<
  string,
  readonly number[]
> = {
  money_inflow: [9, 10],
  money_outflow: [2, 6, 12],
  money_planning: [3, 6],
  money_accumulation: [5],
  money_settlement: [2, 6, 8, 11, 12],
};

const MINIMUM_SCORE_GAP = 5;
const MINIMUM_TRIGGER_GAP = 1.5;

export function isFinancialCompetitionEvent(
  eventId: string
): boolean {
  return Object.prototype.hasOwnProperty.call(
    FINANCIAL_EVENT_HOUSES,
    eventId
  );
}

function eligible(row: TemporalEventResolution) {
  return (
    row.triggerEligible &&
    row.revisedScore !== null &&
    Number.isFinite(row.revisedScore) &&
    row.stage !== "INELIGIBLE" &&
    row.stage !== "INSUFFICIENT_DATA"
  );
}

function normalizeMechanism(key: string): string {
  // Nakshatra and Navamsa activation of the same
  // planet must not count as independent planets.
  if (
    key.startsWith("nakshatra:") ||
    key.startsWith("navamsa:")
  ) {
    return "moon_lord:" + key.split(":")[1];
  }

  return key;
}

export function resolveFinancialCompetition(
  candidates: readonly TemporalEventResolution[]
) {
  if (
    candidates.some(
      row => !isFinancialCompetitionEvent(row.eventId)
    )
  ) {
    throw new Error(
      "Financial competition accepts money events only."
    );
  }

  const baseline = resolveEventCompetition(candidates);

  const allEligible = candidates.filter(eligible);

  const leading = baseline.selected;

  const directionalHouses = leading
    ? FINANCIAL_EVENT_HOUSES[leading.eventId]
    : [];

  const directionalRows = leading
    ? leading.trigger.evaluatedRows.filter(
        row =>
          directionalHouses.includes(row.house) &&
          row.quality > 0 &&
          row.mechanisms.length > 0
      )
    : [];

  const comparisons = leading
    ? allEligible
        .filter(row => row.eventId !== leading.eventId)
        .map(other => {
          const otherMechanisms = new Set(
            other.trigger.mechanismKeys.map(
              normalizeMechanism
            )
          );

          // Compare all evaluated houses, not only
          // those labelled distinctive by each rule.
          const otherActivatedHouses = new Set(
            other.trigger.evaluatedRows.map(
              row => row.house
            )
          );

          const independentRows = directionalRows.filter(
            row =>
              !otherActivatedHouses.has(row.house) &&
              row.mechanisms.some(
                key =>
                  !otherMechanisms.has(
                    normalizeMechanism(key)
                  )
              )
          );

          const scoreGap =
            leading.revisedScore! -
            other.revisedScore!;

          const triggerGap =
            (leading.trigger.points ?? 0) -
            (other.trigger.points ?? 0);

          const distinguishable =
            scoreGap >= MINIMUM_SCORE_GAP &&
            triggerGap >= MINIMUM_TRIGGER_GAP &&
            independentRows.length > 0;

          return {
            eventId: other.eventId,
            specificity: other.specificity,
            ongoing: !other.newDailyExpression,
            scoreGap,
            triggerGap,
            independentRows,
            distinguishable,
          };
        })
    : [];

  const hasDirectionalEvidence =
    directionalRows.length > 0;

  const unresolvedCompetition =
    comparisons.some(row => !row.distinguishable);

  const blocked =
    leading !== null &&
    (
      !hasDirectionalEvidence ||
      unresolvedCompetition
    );

  const selected = blocked
    ? null
    : baseline.selected;

  const status = blocked
    ? "COMPETING_UNRESOLVED" as const
    : baseline.status;

  return {
    ...baseline,

    status,
    selected,
    selectedEventId: selected?.eventId ?? null,

    publishSpecificDailyEvent:
      !blocked &&
      baseline.publishSpecificDailyEvent,

    financialEvidence: {
      eligibleEventIds:
        allEligible.map(row => row.eventId),

      directionalHouses,
      directionalRows,
      hasDirectionalEvidence,
      unresolvedCompetition,
      comparisons,

      rejectionReasons: [
        ...(!hasDirectionalEvidence && leading
          ? ["MISSING_FINANCIAL_DIRECTION_EVIDENCE"]
          : []),

        ...(unresolvedCompetition
          ? ["FINANCIAL_COMPETITION_UNRESOLVED"]
          : []),
      ],

      transactionVerified: false as const,
      modifiesBaseScore: false as const,
    },
  };
}