// src/server/sarathi/decisionEngine.ts

export type DecisionSummary = {
  answerType:
    | "timing"
    | "identity"
    | "prediction"
    | "diagnosis"
    | "decision"
    | "generic";

  headline: string | null;

  summary: string | null;

  confidence: string | null;

  confidenceScore: number | null;

  classification: string | null;

  practicalMeaning: string | null;

  evidence: string[];
};

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

function formatDecisionDate(
  value?: string | null
): string | null {
  if (!value) return null;

  // Handle YYYY-MM-DD without timezone shifting.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] =
      value.split("-").map(Number);

    const d = new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }
    ).format(d);
  }

  return value;
}

function formatDecisionWindow(
  start?: string | null,
  end?: string | null
): string | null {
  const prettyStart =
    formatDecisionDate(start);

  const prettyEnd =
    formatDecisionDate(end);

  if (!prettyStart && !prettyEnd) {
    return null;
  }

  if (prettyStart && prettyEnd) {
    if (start === end) {
      return prettyStart;
    }

    return `${prettyStart} to ${prettyEnd}`;
  }

  return prettyStart ?? prettyEnd;
}

function cleanEvidence(
  items: any
): string[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) =>
      String(item ?? "")
        .trim()
        .replace(/[.]+$/, "")
    )
    .filter(Boolean);
}

/* --------------------------------------------------
   Major-event policy
-------------------------------------------------- */

const MAJOR_LIFE_EVENTS = new Set([
  "business_launch",

  "marriage_timing",
  "marriage_commitment",

  "buy_property",
  "property_timing",

  "buy_vehicle",
  "vehicle_timing",

  "job_change",
  "promotion",
  "internal_shift",

  "childbirth_timing",

  "foreign_move",
  "relocation_timing",
]);

/* --------------------------------------------------
   Decision builder
-------------------------------------------------- */

export function buildDecisionSummary({
  astroBundle,
  questionType,
  topic,
  eventType,
  shouldSuppressTiming,
  eventLifecycle,
}: {
  astroBundle: any;
  questionType: string;
  topic: string;
  eventType: string;
  shouldSuppressTiming: boolean;
  eventLifecycle?: any;
}): DecisionSummary {

  /* ------------------------------------------------
     Non-timing questions
  ------------------------------------------------ */

  if (questionType !== "timing") {
    return {
      answerType:
        questionType as DecisionSummary["answerType"],

      headline: null,
      summary: null,
      confidence: null,
      confidenceScore: null,
      classification: null,
      practicalMeaning: null,
      evidence: [],
    };
  }

  /* ------------------------------------------------
     Timing suppression
  ------------------------------------------------ */

  if (shouldSuppressTiming) {
    return {
      answerType: "timing",

      headline: null,

      summary:
        "Timing is intentionally not being provided for this question.",

      confidence: null,
      confidenceScore: null,
      classification: null,
      practicalMeaning: null,
      evidence: [],
    };
  }

  const isMajorLifeEvent =
    MAJOR_LIFE_EVENTS.has(
      String(eventType ?? "")
    );

  /*
   * Hierarchy:
   *
   * opportunityWindow
   *   = broader AD-backed season
   *
   * practicalWindow
   *   = actionable PD-backed period
   *
   * activationWindow
   *   = transit trigger
   */

  const opportunityWindow =
    eventLifecycle?.opportunityWindow ??
    null;

  const practicalWindow =
    eventLifecycle?.practicalWindow ??
    null;

  const activationWindow =
    eventLifecycle?.activationWindow ??
    null;

  /*
   * Legacy/fallback timing source.
   *
   * This must NOT override lifecycle timing.
   */
  const selectedWindow =
    astroBundle?.selectedTimingWindow ??
    astroBundle?.bestAvailableWindow ??
    null;

  /* ------------------------------------------------
     MAJOR LIFE EVENT
  ------------------------------------------------ */

  if (
    isMajorLifeEvent &&
    (
      practicalWindow?.start ||
      opportunityWindow?.start
    )
  ) {
    const broaderHeadline =
      opportunityWindow?.start &&
      opportunityWindow?.end
        ? formatDecisionWindow(
            opportunityWindow.start,
            opportunityWindow.end
          )
        : null;

    const practicalHeadline =
      practicalWindow?.start &&
      practicalWindow?.end
        ? formatDecisionWindow(
            practicalWindow.start,
            practicalWindow.end
          )
        : null;

    const activationPeak =
      formatDecisionDate(
        activationWindow?.peak ??
        activationWindow?.start ??
        null
      );

    /*
     * MAIN ANSWER:
     *
     * Practical PD window wins.
     *
     * Broader AD remains context.
     */
    const headline =
      practicalHeadline ??
      broaderHeadline;

    const evidence: string[] = [];

    if (broaderHeadline) {
      evidence.push(
        `The broader dasha-backed opportunity period runs from ${broaderHeadline}`
      );
    }

    if (practicalHeadline) {
      evidence.push(
        `${practicalHeadline} is the more actionable sub-period within the broader opportunity phase`
      );
    }

    if (activationPeak) {
      evidence.push(
        `${activationPeak} is a narrower activation trigger within the actionable period`
      );
    }

    const selectedEvidence =
      cleanEvidence(
        selectedWindow?.why
      );

    evidence.push(
      ...selectedEvidence
    );

    let summary: string;

    if (
      practicalHeadline &&
      broaderHeadline
    ) {
      summary =
        `The more actionable timing window runs from ${practicalHeadline}, ` +
        `within the broader opportunity period of ${broaderHeadline}.`;
    } else if (practicalHeadline) {
      summary =
        `The more actionable timing window runs from ${practicalHeadline}.`;
    } else {
      summary =
        `The broader opportunity period runs from ${broaderHeadline}.`;
    }

    let practicalMeaning: string;

    if (
      practicalHeadline &&
      activationPeak
    ) {
      practicalMeaning =
        `Use ${practicalHeadline} as the main working window. ` +
        `Around ${activationPeak} may act as a sharper trigger for movement or visible activation, ` +
        `but it should not be treated as a guaranteed single-day event.`;
    } else if (
      practicalHeadline
    ) {
      practicalMeaning =
        `Use ${practicalHeadline} as the main working period rather than reducing the event to one date.`;
    } else if (
      broaderHeadline &&
      activationPeak
    ) {
      practicalMeaning =
        `Treat ${broaderHeadline} as the broader opportunity phase. ` +
        `Around ${activationPeak} may act as a narrower trigger within it.`;
    } else {
      practicalMeaning =
        "Treat the supplied broader period as the opportunity phase rather than a guaranteed single-day outcome.";
    }

    return {
      answerType: "timing",

      headline,

      summary,

      confidence:
  eventLifecycle?.overallConfidence ??
  practicalWindow?.confidence ??
  opportunityWindow?.confidence ??
  null,

confidenceScore:
  typeof eventLifecycle?.confidenceScore === "number"
    ? eventLifecycle.confidenceScore
    : null,

      classification:
        eventLifecycle?.currentStage ??
        "opportunity",

      practicalMeaning,

      evidence,
    };
  }

  /* ------------------------------------------------
     NON-MAJOR / FALLBACK TIMING

     Use selected timing only when no lifecycle
     hierarchy is available.
  ------------------------------------------------ */

  if (!selectedWindow) {
    return {
      answerType: "timing",

      headline: null,

      summary:
        "No reliable timing window is currently available.",

      confidence: null,
      confidenceScore: null,
      classification: null,
      practicalMeaning: null,
      evidence: [],
    };
  }

  const fallbackHeadline =
    selectedWindow.start ===
    selectedWindow.end
      ? (
          formatDecisionDate(
            selectedWindow.start
          ) ??
          selectedWindow.label ??
          null
        )
      : formatDecisionWindow(
          selectedWindow.start,
          selectedWindow.end
        );

  return {
    answerType: "timing",

    headline:
      fallbackHeadline,

    summary:
      fallbackHeadline
        ? `${fallbackHeadline} is the strongest available timing window.`
        : "A timing window is available.",

    confidence:
      selectedWindow.confidence ??
      null,

    confidenceScore:
      selectedWindow.score ??
      null,

    classification:
      selectedWindow.windowClass ??
      null,

    practicalMeaning:
      selectedWindow.practicalMeaning ??
      null,

    evidence:
      cleanEvidence(
        selectedWindow.why
      ),
  };
}