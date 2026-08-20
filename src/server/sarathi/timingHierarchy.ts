// FILE: src/server/sarathi/timingHierarchy.ts

export type TimingConfidence =
  | "low"
  | "medium"
  | "high";

export type HierarchyWindow = {
  start: string;
  end: string;
  peak?: string | null;

  confidence: TimingConfidence;

  score: number;

  source:
    | "ad"
    | "pd"
    | "transit";

  reason: string;
};

export type TimingHierarchyResult = {
  broaderWindow: HierarchyWindow | null;
  practicalWindow: HierarchyWindow | null;
  activationWindow: HierarchyWindow | null;

  stage:
    | "preparation"
    | "opportunity"
    | "activation"
    | "conversion"
    | "completion"
    | "stabilization";

  explanation: string | null;
  overallConfidence: TimingConfidence;
  confidenceScore: number;
};

function normalizeConfidence(
  value: any
): TimingConfidence {
  const v = String(value ?? "")
    .toLowerCase()
    .trim();

  if (v === "high") return "high";
  if (v === "medium") return "medium";

  return "low";
}

function validWindow(row: any): boolean {
  return Boolean(
    row?.start &&
    row?.end
  );
}

function daysBetween(
  fromISO: string,
  toISO: string
): number {
  const from = new Date(
    `${fromISO.slice(0, 10)}T00:00:00Z`
  ).getTime();

  const to = new Date(
    `${toISO.slice(0, 10)}T00:00:00Z`
  ).getTime();

  if (
    !Number.isFinite(from) ||
    !Number.isFinite(to)
  ) {
    return 0;
  }

  return Math.floor(
    (to - from) /
      86400000
  );
}

function todayISO(): string {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

export function buildTimingHierarchy(
  astroBundle: any
): TimingHierarchyResult {
  const today = todayISO();

  

  const timeline =
    Array.isArray(
      astroBundle?.astroTimeline
    )
      ? astroBundle.astroTimeline
      : [];

  /*
   * ------------------------------------------------
   * 1. BROADER WINDOW
   *
   * AD is the opportunity season.
   * Score describes quality.
   * Score does NOT decide whether the AD exists.
   * ------------------------------------------------
   */

  const broaderCandidate =
  timeline
    .filter(
      (row: any) =>
        row?.dashaLevel === "ad" &&
        validWindow(row) &&
        row.end >= today
    )
    .sort(
      (a: any, b: any) => {
        const aActive =
          a.start <= today &&
          a.end >= today;

        const bActive =
          b.start <= today &&
          b.end >= today;

        // Current AD outranks future AD.
        if (aActive !== bActive) {
          return aActive ? -1 : 1;
        }

        // Otherwise choose the nearer AD.
        return String(
          a.start ?? ""
        ).localeCompare(
          String(
            b.start ?? ""
          )
        );
      }
    )[0] ??
  null;

  const broaderWindow:
    | HierarchyWindow
    | null =
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

          score:
            Number(
              broaderCandidate.score ??
              0
            ),

          source:
            "ad",

          reason:
            String(
              broaderCandidate.reason ??
              ""
            ),
        }
      : null;

  /*
   * ------------------------------------------------
   * 2. PRACTICAL WINDOW
   *
   * PD gives the actionable sub-period.
   *
   * Important:
   * Do not select a nearly-finished current PD just
   * because its raw score is highest.
   * ------------------------------------------------
   */

  const pdCandidates =
    timeline
      .filter(
        (row: any) =>
          row?.dashaLevel === "pd" &&
          validWindow(row) &&
          row.end >= today
      )
          .map((row: any) => {
      const alreadyStarted =
        row.start <= today;

      const daysRemaining =
        alreadyStarted
          ? daysBetween(
              today,
              row.end
            )
          : daysBetween(
              row.start,
              row.end
            );

      const daysUntilStart =
        row.start > today
          ? daysBetween(
              today,
              row.start
            )
          : 0;

      const astrologyScore =
        Number(
          row.score ??
          0
        );

      /*
       * Practical ranking philosophy:
       *
       * 1. Favor current and near-term PDs.
       * 2. Keep astrology strength important.
       * 3. Do not let a strong PD years away
       *    automatically beat a usable near-term PD.
       */

      let practicalScore =
        astrologyScore;

      // Current usable PD
      if (
        alreadyStarted &&
        daysRemaining >= 14
      ) {
        practicalScore += 40;
      }

      // Current PD almost finished
      if (
        alreadyStarted &&
        daysRemaining < 14
      ) {
        practicalScore += 5;
      }

      // Starts very soon
      if (
        !alreadyStarted &&
        daysUntilStart <= 30
      ) {
        practicalScore += 35;
      }

      // Near term
      else if (
        !alreadyStarted &&
        daysUntilStart <= 90
      ) {
        practicalScore += 30;
      }

      // Still actionable this half-year
      else if (
        !alreadyStarted &&
        daysUntilStart <= 180
      ) {
        practicalScore += 20;
      }

      // Within one year
      else if (
        !alreadyStarted &&
        daysUntilStart <= 365
      ) {
        practicalScore += 10;
      }

      // Penalize distant windows
      else if (
        daysUntilStart > 365
      ) {
        practicalScore -= 20;
      }

            return {
        row,
        practicalScore,
      };
    })
    .sort(
      (
        a: {
          row: any;
          practicalScore: number;
        },
        b: {
          row: any;
          practicalScore: number;
        }
      ) => {
        const scoreDiff =
          b.practicalScore -
          a.practicalScore;

        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        return String(
          a.row.start ?? ""
        ).localeCompare(
          String(
            b.row.start ?? ""
          )
        );
      }
    );

  const practicalCandidate =
    pdCandidates[0]?.row ??
    null;

  const practicalWindow:
    | HierarchyWindow
    | null =
    practicalCandidate
      ? {
          start:
            practicalCandidate.start,

          end:
            practicalCandidate.end,

          confidence:
            normalizeConfidence(
              practicalCandidate.confidence
            ),

          score:
            Number(
              practicalCandidate.score ??
              0
            ),

          source:
            "pd",

          reason:
            String(
              practicalCandidate.reason ??
              ""
            ),
        }
      : null;

  /*
   * ------------------------------------------------
   * 3. TRANSIT ACTIVATION
   *
   * Transit is a trigger.
   * Never let it replace AD or PD.
   * ------------------------------------------------
   */

  const selected =
    astroBundle?.selectedTimingWindow ??
    astroBundle?.bestAvailableWindow ??
    null;

  const activationWindow:
    | HierarchyWindow
    | null =
    selected?.start &&
    selected?.end
      ? {
          start:
            selected.start,

          end:
            selected.end,

          peak:
            selected.peak ??
            selected.start ??
            null,

          confidence:
            normalizeConfidence(
              selected.confidence
            ),

          score:
            Number(
              selected.score ??
              0
            ),

          source:
            "transit",

                    reason:
            Array.isArray(selected.why)
              ? selected.why
                  .map((x: string) =>
                    x
                      .trim()
                      .replace(/[.]+$/, "")
                  )
                  .filter(Boolean)
                  .join(". ")
              : String(
                  selected.practicalMeaning ??
                  ""
                ),
        }
      : null;

  /*
   * ------------------------------------------------
   * 4. STAGE
   * ------------------------------------------------
   */

  let stage:
    TimingHierarchyResult["stage"] =
    "preparation";

  if (broaderWindow) {
    stage = "opportunity";
  }

  if (
    practicalWindow &&
    practicalWindow.start <= today &&
    practicalWindow.end >= today
  ) {
    stage = "activation";
  }

  /*
   * ------------------------------------------------
   * 5. EXPLANATION
   * ------------------------------------------------
   */

  let explanation:
    | string
    | null =
    null;

  if (
    broaderWindow &&
    practicalWindow &&
    activationWindow
  ) {
    explanation =
      `The broader opportunity period runs from ${broaderWindow.start} to ${broaderWindow.end}. ` +
      `Within it, ${practicalWindow.start} to ${practicalWindow.end} is the more actionable sub-period, ` +
      `while ${activationWindow.peak ?? activationWindow.start} is a narrower activation trigger.`;
  } else if (
    broaderWindow &&
    practicalWindow
  ) {
    explanation =
      `The broader opportunity period runs from ${broaderWindow.start} to ${broaderWindow.end}, ` +
      `with ${practicalWindow.start} to ${practicalWindow.end} as the more actionable sub-period.`;
  } else if (
    broaderWindow
  ) {
    explanation =
      `The broader opportunity period runs from ${broaderWindow.start} to ${broaderWindow.end}.`;
  }
let confidenceScore = 0;

/*
 * Confidence should reflect strength of evidence,
 * not merely the presence of evidence.
 *
 * Weighting:
 * Natal promise  = 30%
 * AD strength    = 25%
 * PD strength    = 25%
 * Transit        = 20%
 */

const promiseVerdict =
  String(
    astroBundle?.promiseLayer?.verdict ??
    ""
  )
    .toLowerCase()
    .trim();

if (promiseVerdict === "strong") {
  confidenceScore += 30;
} else if (
  promiseVerdict === "mixed" ||
  promiseVerdict === "moderate"
) {
  confidenceScore += 18;
} else if (promiseVerdict === "weak") {
  confidenceScore += 8;
}

/*
 * AD score is already 0–100.
 * Convert it into max 25 points.
 */
if (broaderWindow) {
  confidenceScore +=
    Math.max(
      0,
      Math.min(
        25,
        (Number(broaderWindow.score ?? 0) / 100) * 25
      )
    );
}

/*
 * PD practical strength:
 * max 25 points.
 */
if (practicalWindow) {
  confidenceScore +=
    Math.max(
      0,
      Math.min(
        25,
        (Number(practicalWindow.score ?? 0) / 100) * 25
      )
    );
}

/*
 * Transit trigger:
 * max 20 points.
 */
if (activationWindow) {
  confidenceScore +=
    Math.max(
      0,
      Math.min(
        20,
        (Number(activationWindow.score ?? 0) / 100) * 20
      )
    );
}

/*
 * Optional small conversion bonus.
 */
const conversionVerdict =
  String(
    astroBundle?.conversionDiagnosisV2?.verdict ??
    ""
  )
    .toLowerCase()
    .trim();

if (
  conversionVerdict.includes(
    "conversion_favored"
  )
) {
  confidenceScore += 5;
}

confidenceScore =
  Math.round(
    Math.max(
      0,
      Math.min(
        100,
        confidenceScore
      )
    )
  );

const overallConfidence: TimingConfidence =
  confidenceScore >= 75
    ? "high"
    : confidenceScore >= 50
    ? "medium"
    : "low";
return {
  broaderWindow,
  practicalWindow,
  activationWindow,
  stage,
  explanation,
  overallConfidence,
  confidenceScore,
};
}