import type {
  UnifiedEventJudgement,
} from "./eventUnifiedJudgement";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import {
  UNIFIED_EVENT_THRESHOLDS,
} from "./eventUnifiedScoring";

import {
  resolveEventMoonTriggerQuality,
} from "./eventMoonTriggerQuality";

export type TemporalEventStage =
  | "INELIGIBLE"
  | "INSUFFICIENT_DATA"
  | "BACKGROUND_ACTIVATION"
  | "ACTIVE_WINDOW"
  | "EMERGING_TRIGGER"
  | "CONTINUING_TRIGGER"
  | "PEAK_TRIGGER";

export function buildTemporalEventSnapshot(
  date: string,
  rule: EventJudgementRule,
  judgement: UnifiedEventJudgement
) {
  const scoring = judgement.scoring;

  const trigger =
    resolveEventMoonTriggerQuality(rule, judgement);

  const underlyingScore = Math.round(
    scoring.breakdown
      .filter(row => row.dimension !== "dailyTrigger")
      .reduce((sum, row) => sum + row.points, 0)
      * 100
  ) / 100;

  const revisedScore = trigger.points === null
    ? null
    : Math.round(
        (underlyingScore + trigger.points) * 100
      ) / 100;

  const failedFoundation =
    scoring.failedGates.filter(
      gate => gate !== "dailyTrigger"
    );

  const unknownFoundation =
    scoring.unknownGates.filter(
      gate => gate !== "dailyTrigger"
    );

  const foundationEligible =
    failedFoundation.length === 0 &&
    unknownFoundation.length === 0 &&
    scoring.missingDimensions.filter(
      dimension => dimension !== "dailyTrigger"
    ).length === 0;

  const threshold =
    rule.specificity === "specific"
      ? UNIFIED_EVENT_THRESHOLDS.specific
      : UNIFIED_EVENT_THRESHOLDS.situation;

  // A window is potential support, not a daily event.
  // Preserve existing admission thresholds.

  const activeWindow =
    foundationEligible &&
    underlyingScore + 15 >= threshold;

  const triggerEligible =
    activeWindow &&
    trigger.qualified &&
    revisedScore !== null &&
    revisedScore >= threshold &&
    rule.specificity !== "broad";

  return {
    date,
    eventId: rule.eventId,
    specificity: rule.specificity,
    originalScore: scoring.baseScore,
    originalAdmission: scoring.admission,
    underlyingScore,
    revisedScore,
    foundationEligible,
    activeWindow,
    triggerEligible,
    trigger,
    failedFoundation,
    unknownFoundation,
  };
}

export type TemporalEventSnapshot =
  ReturnType<typeof buildTemporalEventSnapshot>;

function dayNumber(date: string): number {
  const value = Date.parse(date + "T00:00:00Z");

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(value) ||
    new Date(value).toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`Invalid temporal date: ${date}`);
  }

  return value / 86400000;
}

export function resolveTemporalEventWindow(
  snapshots: readonly TemporalEventSnapshot[]
) {
  const ordered = [...snapshots].sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  if (
    new Set(ordered.map(row => row.eventId)).size > 1
  ) {
    throw new Error("Mixed event IDs in temporal window.");
  }

  const days = ordered.map(row => dayNumber(row.date));

  if (new Set(days).size !== days.length) {
    throw new Error("Duplicate temporal dates.");
  }

  let episodeStartDate: string | null = null;
  let episodeFirstTriggerDate: string | null = null;
  let lastEligibleTriggerDate: string | null = null;
  let episodeTriggerCount = 0;

  return ordered.map((current, index) => {
    const previous =
      index > 0 &&
      days[index] - days[index - 1] === 1
        ? ordered[index - 1]
        : null;

    const next =
      index < ordered.length - 1 &&
      days[index + 1] - days[index] === 1
        ? ordered[index + 1]
        : null;

    const usable = (
      row: TemporalEventSnapshot | null
    ): row is TemporalEventSnapshot =>
      row !== null &&
      row.originalAdmission !== "INELIGIBLE" &&
      row.originalAdmission !== "INSUFFICIENT_DATA" &&
      row.trigger.complete &&
      row.unknownFoundation.length === 0 &&
      row.trigger.points !== null &&
      Number.isFinite(row.trigger.points);

    const previousUsable = usable(previous);
    const nextUsable = usable(next);
    const currentUsable = usable(current);

    const episodeActive =
      currentUsable &&
      current.foundationEligible &&
      current.activeWindow;

    const continuesEpisode =
      episodeActive &&
      previousUsable &&
      previous.foundationEligible &&
      previous.activeWindow &&
      episodeStartDate !== null;

    if (!episodeActive || !continuesEpisode) {
      episodeStartDate = episodeActive
        ? current.date
        : null;

      episodeFirstTriggerDate = null;
      lastEligibleTriggerDate = null;
      episodeTriggerCount = 0;
    }

    const priorEpisodeTriggerCount =
      episodeTriggerCount;

    const priorEligibleTriggerDate =
      lastEligibleTriggerDate;

    const hadEarlierEpisodeTrigger =
      priorEpisodeTriggerCount > 0;

    const resumedTrigger =
      episodeActive &&
      current.triggerEligible &&
      hadEarlierEpisodeTrigger &&
      previousUsable &&
      !previous.triggerEligible;

    const daysSincePreviousTrigger =
      priorEligibleTriggerDate === null
        ? null
        : dayNumber(current.date) -
          dayNumber(priorEligibleTriggerDate);

    if (episodeActive && current.triggerEligible) {
      episodeFirstTriggerDate ??= current.date;
      lastEligibleTriggerDate = current.date;
      episodeTriggerCount++;
    }

    const signatureChanged =
      previousUsable &&
      current.trigger.signature !==
        previous.trigger.signature;

    const qualityImproved =
      previousUsable &&
      current.trigger.points !== null &&
      current.trigger.points -
        previous.trigger.points! >= 1.5;

    const newMechanisms = previousUsable
      ? current.trigger.mechanismKeys.filter(
          key => !previous.trigger.mechanismKeys.includes(key)
        )
      : [];

    // Consecutive eligible days belong to an ongoing
    // activation. A changed signature alone does not
    // establish a new event.
    const newTrigger =
      episodeActive &&
      previousUsable &&
      !previous.triggerEligible &&
      current.triggerEligible &&
      !hadEarlierEpisodeTrigger;

    // Escalation is diagnostic, not a new event.
    const meaningfulEscalation =
      previousUsable &&
      previous.triggerEligible &&
      current.triggerEligible &&
      qualityImproved &&
      newMechanisms.length > 0;

    const peakComparisonAvailable =
      previousUsable &&
      nextUsable &&
      previous.activeWindow &&
      current.activeWindow &&
      next.activeWindow &&
      current.triggerEligible &&
      current.trigger.points !== null;

    const localPeak =
      peakComparisonAvailable &&
      current.trigger.points! >= 12 &&
      current.trigger.points! >
        previous.trigger.points! &&
      current.trigger.points! >
        next.trigger.points!;

    let stage: TemporalEventStage =
      "BACKGROUND_ACTIVATION";

    if (current.originalAdmission === "INELIGIBLE") {
      stage = "INELIGIBLE";
    } else if (
      current.originalAdmission === "INSUFFICIENT_DATA" ||
      !current.trigger.complete
    ) {
      stage = "INSUFFICIENT_DATA";
    } else if (current.activeWindow) {
      stage = "ACTIVE_WINDOW";

      if (current.triggerEligible) {
        stage = localPeak
          ? "PEAK_TRIGGER"
          : newTrigger
            ? "EMERGING_TRIGGER"
            : hadEarlierEpisodeTrigger
              ? "CONTINUING_TRIGGER"
              : "ACTIVE_WINDOW";
      }
    }

    return {
      ...current,
      stage,
      signatureChanged,
      qualityImproved,
      localPeak,
      hasPreviousDay: previous !== null,
      hasNextDay: next !== null,
      previousEvidenceUsable: previousUsable,
      nextEvidenceUsable: nextUsable,
      newMechanisms,
      meaningfulEscalation,
      episodeActive,
      episodeStartDate,
      episodeFirstTriggerDate,
      episodeTriggerCount,
      priorEligibleTriggerDate,
      daysSincePreviousTrigger,
      resumedTrigger,
      usesFutureComparison: peakComparisonAvailable,
      newDailyExpression:
        stage === "EMERGING_TRIGGER" ||
        stage === "PEAK_TRIGGER",
    };
  });
}

export type TemporalEventResolution =
  ReturnType<typeof resolveTemporalEventWindow>[number];
