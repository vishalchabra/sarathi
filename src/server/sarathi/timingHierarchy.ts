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

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

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

function validWindow(
  row: any
): boolean {
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

function containsWindow(
  outer: any,
  inner: any
): boolean {
  if (
    !validWindow(outer) ||
    !validWindow(inner)
  ) {
    return false;
  }

  return (
    outer.start <= inner.start &&
    outer.end >= inner.end
  );
}

/* --------------------------------------------------
   Main builder
-------------------------------------------------- */

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

  const majorWindows =
    Array.isArray(
      astroBundle?.majorWindows
    )
      ? astroBundle.majorWindows
      : [];

  /*
   * ------------------------------------------------
   * 1. PRACTICAL WINDOW
   *
   * PD is the actionable sub-period.
   *
   * We choose this first because the broader AD
   * must structurally contain the selected PD.
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
            row.score ?? 0
          );

        /*
         * Practical ranking:
         *
         * - favor usable current periods
         * - favor near-term periods
         * - retain astrology strength
         * - penalize distant periods
         */

        /*
 * Astrology remains the primary ranking factor.
 *
 * Proximity should only help distinguish periods
 * of similar astrological strength — it should
 * never turn a weak/average current PD into the
 * strongest practical window.
 */

let practicalScore =
  astrologyScore;

// Current and still usable
if (
  alreadyStarted &&
  daysRemaining >= 14
) {
  practicalScore += 5;
}

// Current but almost finished
else if (
  alreadyStarted &&
  daysRemaining < 14
) {
  practicalScore += 1;
}

// Begins within 30 days
else if (
  !alreadyStarted &&
  daysUntilStart <= 30
) {
  practicalScore += 5;
}

// Begins within 90 days
else if (
  !alreadyStarted &&
  daysUntilStart <= 90
) {
  practicalScore += 4;
}

// Begins within 180 days
else if (
  !alreadyStarted &&
  daysUntilStart <= 180
) {
  practicalScore += 3;
}

// Begins within one year
else if (
  !alreadyStarted &&
  daysUntilStart <= 365
) {
  practicalScore += 2;
}

// More distant periods receive no proximity bonus.
// Do not heavily penalize them because a genuinely
// strong PD may still be astrologically important.

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
   * 2. BROADER WINDOW
   *
   * AD is the broader opportunity season.
   *
   * IMPORTANT:
   * When a practical PD exists, the chosen AD MUST
   * contain that PD.
   *
   * Never independently select a later AD that does
   * not contain the practical period.
   * ------------------------------------------------
   */

  const adCandidates = [
    ...timeline,
    ...majorWindows,
  ].filter(
    (row: any) =>
      row?.dashaLevel === "ad" &&
      validWindow(row)
  );

  /*
   * Remove duplicate AD rows where timeline and
   * majorWindows contain the same period.
   */

  const uniqueAdCandidates =
    adCandidates.filter(
      (
        row: any,
        index: number,
        rows: any[]
      ) =>
        rows.findIndex(
          (candidate: any) =>
            candidate.start ===
              row.start &&
            candidate.end ===
              row.end
        ) === index
    );

  let broaderCandidate:
    any =
    null;

  if (practicalCandidate) {
    /*
     * First choice:
     * Find the AD which actually contains the PD.
     */

    const containingAds =
      uniqueAdCandidates
        .filter(
          (row: any) =>
            containsWindow(
              row,
              practicalCandidate
            )
        )
        .sort(
          (a: any, b: any) => {
            /*
             * If more than one containing AD somehow
             * exists, prefer the stronger score.
             */

            const scoreDiff =
              Number(
                b.score ?? 0
              ) -
              Number(
                a.score ?? 0
              );

            if (scoreDiff !== 0) {
              return scoreDiff;
            }

            return String(
              a.start
            ).localeCompare(
              String(
                b.start
              )
            );
          }
        );

    broaderCandidate =
      containingAds[0] ??
      null;
  } else {
    /*
     * If no practical PD exists, use the nearest
     * current/future AD as broader context.
     */

    broaderCandidate =
      uniqueAdCandidates
        .filter(
          (row: any) =>
            row.end >= today
        )
        .sort(
          (a: any, b: any) => {
            const aCurrent =
              a.start <= today &&
              a.end >= today;

            const bCurrent =
              b.start <= today &&
              b.end >= today;

            /*
             * Prefer an AD active today.
             */

            if (
              aCurrent !==
              bCurrent
            ) {
              return aCurrent
                ? -1
                : 1;
            }

            return String(
              a.start
            ).localeCompare(
              String(
                b.start
              )
            );
          }
        )[0] ??
      null;
  }

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
   * 3. TRANSIT ACTIVATION
   *
   * Transit is a trigger.
   *
   * It can occur before or inside the practical PD.
   * It must never replace the PD as the main window.
   * ------------------------------------------------
   */

  const selected =
    astroBundle
      ?.selectedTimingWindow ??
    astroBundle
      ?.bestAvailableWindow ??
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
            Array.isArray(
              selected.why
            )
              ? selected.why
                  .map(
                    (
                      x: string
                    ) =>
                      x
                        .trim()
                        .replace(
                          /[.]+$/,
                          ""
                        )
                  )
                  .filter(Boolean)
                  .join(". ")
              : String(
                  selected
                    .practicalMeaning ??
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

  const broaderActive =
    broaderWindow &&
    broaderWindow.start <= today &&
    broaderWindow.end >= today;

  const practicalActive =
    practicalWindow &&
    practicalWindow.start <= today &&
    practicalWindow.end >= today;

  const activationActive =
    activationWindow &&
    activationWindow.start <= today &&
    activationWindow.end >= today;

  if (broaderWindow) {
    stage = "opportunity";
  }

  if (broaderActive) {
    stage = "opportunity";
  }

  if (practicalActive) {
    stage = "activation";
  }

  if (
    activationActive &&
    practicalActive
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
    practicalWindow
  ) {
    explanation =
      `The broader opportunity period runs from ${broaderWindow.start} to ${broaderWindow.end}. ` +
      `Within it, ${practicalWindow.start} to ${practicalWindow.end} is the more actionable sub-period.`;

    if (activationWindow) {
      const activationDate =
        activationWindow.peak ??
        activationWindow.start;

      if (
        activationDate <
        practicalWindow.start
      ) {
        explanation +=
          ` An earlier activation trigger appears around ${activationDate}, which can begin movement before the main actionable period.`;
      } else if (
        activationDate >=
          practicalWindow.start &&
        activationDate <=
          practicalWindow.end
      ) {
        explanation +=
          ` A sharper activation trigger appears around ${activationDate} within the actionable period.`;
      } else {
        explanation +=
          ` A separate activation trigger appears around ${activationDate}.`;
      }
    }
  } else if (
    practicalWindow
  ) {
    explanation =
      `The more actionable period runs from ${practicalWindow.start} to ${practicalWindow.end}.`;

    if (activationWindow) {
      explanation +=
        ` A narrower activation trigger appears around ${
          activationWindow.peak ??
          activationWindow.start
        }.`;
    }
  } else if (
    broaderWindow
  ) {
    explanation =
      `The broader opportunity period runs from ${broaderWindow.start} to ${broaderWindow.end}.`;
  } else if (
    activationWindow
  ) {
    explanation =
      `A narrower activation trigger appears around ${
        activationWindow.peak ??
        activationWindow.start
      }, but no broader actionable dasha window is currently established.`;
  }

  /*
   * ------------------------------------------------
   * 6. CONFIDENCE
   *
   * Natal promise = 30
   * AD             = 25
   * PD             = 25
   * Transit        = 20
   *
   * Optional conversion bonus = +5
   * Final result capped at 100.
   * ------------------------------------------------
   */

  let confidenceScore =
    0;

  const promiseVerdict =
    String(
      astroBundle
        ?.promiseLayer
        ?.verdict ??
        ""
    )
      .toLowerCase()
      .trim();

  if (
    promiseVerdict ===
    "strong"
  ) {
    confidenceScore += 30;
  } else if (
    promiseVerdict ===
      "mixed" ||
    promiseVerdict ===
      "moderate"
  ) {
    confidenceScore += 18;
  } else if (
    promiseVerdict ===
    "weak"
  ) {
    confidenceScore += 8;
  }

  if (broaderWindow) {
    confidenceScore +=
      Math.max(
        0,
        Math.min(
          25,
          (
            Number(
              broaderWindow.score ??
              0
            ) /
            100
          ) *
            25
        )
      );
  }

  if (practicalWindow) {
    confidenceScore +=
      Math.max(
        0,
        Math.min(
          25,
          (
            Number(
              practicalWindow.score ??
              0
            ) /
            100
          ) *
            25
        )
      );
  }

  if (activationWindow) {
    confidenceScore +=
      Math.max(
        0,
        Math.min(
          20,
          (
            Number(
              activationWindow.score ??
              0
            ) /
            100
          ) *
            20
        )
      );
  }

  const conversionVerdict =
    String(
      astroBundle
        ?.conversionDiagnosisV2
        ?.verdict ??
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

  const overallConfidence:
    TimingConfidence =
    confidenceScore >= 75
      ? "high"
      : confidenceScore >= 50
      ? "medium"
      : "low";

  /*
   * ------------------------------------------------
   * 7. HIERARCHY SAFETY
   *
   * A practical PD cannot sit outside its broader AD.
   * ------------------------------------------------
   */

  if (
    broaderWindow &&
    practicalWindow &&
    !containsWindow(
      broaderWindow,
      practicalWindow
    )
  ) {
    console.error(
      "[TIMING HIERARCHY] INVALID NESTING",
      {
        broaderWindow,
        practicalWindow,
      }
    );
  }

  /*
   * Temporary debug.
   * Remove after hierarchy is validated.
   */

  console.log(
    "========== RAW WINDOWS =========="
  );

  console.log(
    "Broader:",
    JSON.stringify(
      broaderWindow,
      null,
      2
    )
  );

  console.log(
    "Practical:",
    JSON.stringify(
      practicalWindow,
      null,
      2
    )
  );

  console.log(
    "Activation:",
    JSON.stringify(
      activationWindow,
      null,
      2
    )
  );

  console.log(
    "================================="
  );

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