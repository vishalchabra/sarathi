// FILE: src/server/sarathi/opportunityEngine.ts

export type OpportunityStage =
  | "building"
  | "testing"
  | "launch"
  | "conversion"
  | "expansion"
  | "commitment"
  | "completion"
  | "stabilization";

export type OpportunityActivationWindow = {
  start: string;
  end: string;

  peak?: string | null;

  strength: number;

  confidence:
    | "low"
    | "medium"
    | "high";

  source:
    | "pd"
    | "transit"
    | "mixed";

  reason: string;
};

export type OpportunityResult = {
  event: string;

  broaderWindow: {
    start: string;
    end: string;

    confidence:
      | "low"
      | "medium"
      | "high";

    reason: string;
  } | null;

  practicalWindow: {
    start: string;
    end: string;

    confidence:
      | "low"
      | "medium"
      | "high";

    reason: string;
  } | null;

  activationWindows: OpportunityActivationWindow[];

  bestActivationWindow:
    | OpportunityActivationWindow
    | null;

  currentStage: OpportunityStage;

  recommendedAction: string | null;

  explanation: string | null;
};

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

function normalizeConfidence(
  value: any
): "low" | "medium" | "high" {
  const v =
    String(value ?? "")
      .toLowerCase()
      .trim();

  if (v === "high") return "high";
  if (v === "medium") return "medium";

  return "low";
}

function isValidWindow(
  row: any
): boolean {
  return Boolean(
    row?.start &&
    row?.end
  );
}

function dateValue(
  value?: string | null
): number {
  if (!value) return 0;

  const t =
    new Date(
      `${value.slice(0, 10)}T00:00:00Z`
    ).getTime();

  return Number.isFinite(t)
    ? t
    : 0;
}

/* --------------------------------------------------
   Event → practical stage
-------------------------------------------------- */

function stageForEvent(
  event: string,
  hasBroadWindow: boolean,
  hasPracticalWindow: boolean
): OpportunityStage {
  const e =
    String(event ?? "")
      .toLowerCase();

  if (
    e.includes("business")
  ) {
    if (hasPracticalWindow) {
      return "launch";
    }

    if (hasBroadWindow) {
      return "testing";
    }

    return "building";
  }

  if (
    e.includes("marriage") ||
    e.includes("relationship")
  ) {
    if (hasPracticalWindow) {
      return "commitment";
    }

    return "building";
  }

  if (
    e.includes("job") ||
    e.includes("promotion") ||
    e.includes("career")
  ) {
    if (hasPracticalWindow) {
      return "conversion";
    }

    return "building";
  }

  if (
    e.includes("property") ||
    e.includes("vehicle") ||
    e.includes("relocation") ||
    e.includes("foreign")
  ) {
    if (hasPracticalWindow) {
      return "conversion";
    }

    return "building";
  }

  return hasPracticalWindow
    ? "conversion"
    : hasBroadWindow
    ? "testing"
    : "building";
}

/* --------------------------------------------------
   Main Engine
-------------------------------------------------- */

export function buildOpportunityEngine(
  astroBundle: any
): OpportunityResult {
  const event =
    astroBundle?.eventType ??
    astroBundle?.careerEventType ??
    astroBundle?.topic ??
    "generic";

  /* ----------------------------------------------
     1. Broader AD opportunity period
  ---------------------------------------------- */

  const majorWindows =
    Array.isArray(
      astroBundle?.majorWindows
    )
      ? astroBundle.majorWindows
      : [];

  const broaderCandidate =
    majorWindows.find(
      (row: any) =>
        row?.dashaLevel === "ad" &&
        isValidWindow(row)
    ) ??
    majorWindows.find(
      (row: any) =>
        isValidWindow(row)
    ) ??
    null;

  const broaderWindow =
    broaderCandidate
      ? {
          start:
            broaderCandidate.start,

          end:
            broaderCandidate.end,

          confidence:
            normalizeConfidence(
              broaderCandidate.confidence
            ),

          reason:
            String(
              broaderCandidate.reason ??
              "The broader dasha period activates this life theme."
            ),
        }
      : null;

  /* ----------------------------------------------
     2. PD activation periods
  ---------------------------------------------- */

  const astroTimeline =
    Array.isArray(
      astroBundle?.astroTimeline
    )
      ? astroBundle.astroTimeline
      : [];

  const pdWindows =
    astroTimeline
      .filter(
        (row: any) =>
          row?.dashaLevel === "pd" &&
          isValidWindow(row)
      )
      .map(
        (
          row: any
        ): OpportunityActivationWindow => ({
          start:
            row.start,

          end:
            row.end,

          peak:
            null,

          strength:
            Number(
              row.score ??
              0
            ),

          confidence:
            normalizeConfidence(
              row.confidence
            ),

          source:
            "pd",

          reason:
            String(
              row.reason ??
              "Pratyantardasha activates the event theme."
            ),
        })
      );

  /* ----------------------------------------------
     3. Transit trigger
  ---------------------------------------------- */

  const selectedWindow =
    astroBundle?.selectedTimingWindow ??
    astroBundle?.bestAvailableWindow ??
    null;

  const transitActivation:
    | OpportunityActivationWindow
    | null =
    selectedWindow?.start &&
    selectedWindow?.end
      ? {
          start:
            selectedWindow.start,

          end:
            selectedWindow.end,

          peak:
            selectedWindow.peak ??
            selectedWindow.start ??
            null,

          strength:
            Number(
              selectedWindow.score ??
              0
            ),

          confidence:
            normalizeConfidence(
              selectedWindow.confidence
            ),

          source:
            "transit",

          reason:
            Array.isArray(
              selectedWindow.why
            )
              ? selectedWindow.why.join(
                  ". "
                )
              : String(
                  selectedWindow.practicalMeaning ??
                  "Transit activity creates a narrower trigger."
                ),
        }
      : null;

  const activationWindows = [
    ...pdWindows,
    ...(transitActivation
      ? [transitActivation]
      : []),
  ];

  /* ----------------------------------------------
     4. Select best practical PD window

     Prefer:
     - current/future
     - stronger score
     - nearer start
  ---------------------------------------------- */

  const today =
    new Date();

  const todayISO =
    today
      .toISOString()
      .slice(0, 10);

 const eligiblePD: OpportunityActivationWindow[] =
  pdWindows
    .filter(
      (row: OpportunityActivationWindow) =>
        row.end >= todayISO
    )
    .sort(
      (
        a: OpportunityActivationWindow,
        b: OpportunityActivationWindow
      ) => {
        const scoreDiff =
          Number(b.strength) -
          Number(a.strength);

        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        return (
          dateValue(a.start) -
          dateValue(b.start)
        );
      }
    );

  const bestPd =
    eligiblePD[0] ??
    null;

  /* ----------------------------------------------
     5. Practical window

     For now:
     strongest relevant PD period.

     Later:
     intersection of AD + PD + transit clusters.
  ---------------------------------------------- */

  const practicalWindow =
    bestPd
      ? {
          start:
            bestPd.start,

          end:
            bestPd.end,

          confidence:
            bestPd.confidence,

          reason:
            bestPd.reason,
        }
      : null;

  /* ----------------------------------------------
     6. Best activation

     Transit wins when it falls inside practical PD.
  ---------------------------------------------- */

  let bestActivationWindow:
    | OpportunityActivationWindow
    | null =
    bestPd;

  if (
    transitActivation &&
    bestPd &&
    transitActivation.start >=
      bestPd.start &&
    transitActivation.start <=
      bestPd.end
  ) {
    bestActivationWindow = {
      ...transitActivation,

      source:
        "mixed",

      reason:
        `${bestPd.reason}. ${transitActivation.reason}`,
    };
  } else if (
    transitActivation &&
    !bestPd
  ) {
    bestActivationWindow =
      transitActivation;
  }

  const currentStage =
    stageForEvent(
      event,
      Boolean(broaderWindow),
      Boolean(practicalWindow)
    );

  const recommendedAction =
    Array.isArray(
      astroBundle?.decision?.do
    ) &&
    astroBundle.decision.do.length
      ? String(
          astroBundle.decision.do[0]
        )
      : null;

  let explanation:
    | string
    | null =
    null;

  if (
    broaderWindow &&
    practicalWindow
  ) {
    explanation =
      `The broader opportunity period runs from ${broaderWindow.start} to ${broaderWindow.end}, while ${practicalWindow.start} to ${practicalWindow.end} is the more actionable sub-period within it.`;
  } else if (
    broaderWindow
  ) {
    explanation =
      `The broader opportunity period runs from ${broaderWindow.start} to ${broaderWindow.end}, but no stronger practical sub-window has yet been identified.`;
  } else if (
    practicalWindow
  ) {
    explanation =
      `The most actionable period currently identified runs from ${practicalWindow.start} to ${practicalWindow.end}.`;
  }

  return {
    event,

    broaderWindow,

    practicalWindow,

    activationWindows,

    bestActivationWindow,

    currentStage,

    recommendedAction,

    explanation,
  };
}