import type {
  TemporalEventResolution,
} from "./eventTemporalResolution";

const MINIMUM_SCORE_GAP = 5;
const MINIMUM_TRIGGER_GAP = 1.5;

export function resolveEventCompetition(
  candidates: readonly TemporalEventResolution[]
) {
  if (
    new Set(candidates.map(row => row.date)).size > 1
  ) {
    throw new Error("Competition must use the same date.");
  }

  if (
    new Set(candidates.map(row => row.eventId)).size !==
      candidates.length
  ) {
    throw new Error("Duplicate competing event IDs.");
  }

  const eligible = candidates.filter(
    row =>
      row.triggerEligible &&
      row.revisedScore !== null &&
      row.stage !== "INELIGIBLE" &&
      row.stage !== "INSUFFICIENT_DATA"
  );

  const fresh = eligible.filter(
    row => row.newDailyExpression
  );

  // An ongoing specific event must not automatically
  // suppress a fresh situational development.
  const expressionPool = fresh.length
    ? fresh
    : eligible;

  const specific = expressionPool.filter(
    row => row.specificity === "specific"
  );

  const pool = specific.length
    ? specific
    : expressionPool.filter(
        row => row.specificity === "situational"
      );

  const ranked = [...pool].sort(
    (a, b) =>
      b.revisedScore! - a.revisedScore! ||
      a.eventId.localeCompare(b.eventId)
  );

  const leading = ranked[0] ?? null;
  const competitors = ranked.slice(1);

  const comparisons = leading
    ? competitors.map(other => {
        const uniqueDistinctiveHouses =
          leading.trigger.distinctiveHouses.filter(
            house =>
              !other.trigger.distinctiveHouses.includes(
                house
              )
          );

        const uniqueMechanisms =
          leading.trigger.mechanismKeys.filter(
            key =>
              !other.trigger.mechanismKeys.includes(key)
          );

        // The unique mechanism must actually support
        // a distinctive house of the leading event.
        const independentDistinctiveRows =
          leading.trigger.evaluatedRows.filter(
            row =>
              row.distinctive &&
              uniqueDistinctiveHouses.includes(row.house) &&
              row.mechanisms.some(
                key => uniqueMechanisms.includes(key)
              )
          );

        const scoreGap =
          leading.revisedScore! - other.revisedScore!;

        const triggerGap =
          (leading.trigger.points ?? 0) -
          (other.trigger.points ?? 0);

        const distinguishable =
          scoreGap >= MINIMUM_SCORE_GAP &&
          triggerGap >= MINIMUM_TRIGGER_GAP &&
          uniqueDistinctiveHouses.length > 0 &&
          independentDistinctiveRows.length > 0;

        return {
          eventId: other.eventId,
          scoreGap,
          triggerGap,
          uniqueDistinctiveHouses,
          uniqueMechanisms,
          independentDistinctiveRows,
          distinguishable,
        };
      })
    : [];

  const unresolved =
    leading !== null &&
    comparisons.some(row => !row.distinguishable);

  const selected =
    leading && !unresolved ? leading : null;

  const status =
    !leading
      ? "NO_ADMITTED_EVENT" as const
      : unresolved
        ? "COMPETING_UNRESOLVED" as const
        : selected?.newDailyExpression
          ? "DISTINCT_DAILY_TRIGGER" as const
          : "ONGOING_ACTIVATION" as const;

  return {
    status,
    selectedEventId: selected?.eventId ?? null,
    selected,
    leading,
    comparisons,
    ranked,
    ongoingEvents: eligible
      .filter(row => !row.newDailyExpression)
      .map(row => row.eventId),
    publishSpecificDailyEvent:
      status === "DISTINCT_DAILY_TRIGGER" &&
      selected?.specificity === "specific",
  };
}
