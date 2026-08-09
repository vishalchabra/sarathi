import { getEventResponseProfile } from "@/server/astro-chat/eventProfiles";
import type { AstroDecision } from "@/server/astro-chat/decisionEngine";

export type SeniorAstrologerResponse = {
  short: string;
  full: string;
  action: string;
  verdict: string;
  timing: string;
  unfolding: string;
};

function extractISODate(value: unknown): string | null {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const match = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (match) return match[0];
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function daysBetween(first: unknown, second: unknown): number | null {
  const a = extractISODate(first);
  const b = extractISODate(second);
  if (!a || !b) return null;
  return Math.abs(Math.round((new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime()) / 86_400_000));
}

function sameDate(first: unknown, second: unknown): boolean {
  const a = extractISODate(first);
  const b = extractISODate(second);
  return Boolean(a && b && a === b);
}

function formatDate(value: unknown): string {
  const iso = extractISODate(value);
  if (!iso) return String(value ?? "");
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

function joinNatural(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function decisionSentence(decision?: AstroDecision | null): string {
  if (!decision) return "";
  return `${decision.headline} ${decision.rationale}`.trim();
}

export function buildSeniorAstrologerResponse(bundle: any): SeniorAstrologerResponse {
  const eventType = bundle.eventType ?? bundle.careerEventType;
  const profile = getEventResponseProfile(bundle.topic, eventType);
  const decision: AstroDecision | null = bundle.decision ?? null;

  const selectedWindow =
    bundle.selectedTimingWindow ??
    bundle.bestAvailableWindow ??
    bundle.strongestWindow ??
    bundle.rankedTimingWindows?.[0] ??
    bundle.timingWindows?.[0] ??
    null;

  const trigger = bundle.bestEventTrigger ?? null;
  const windowStart = selectedWindow?.start ?? selectedWindow?.from ?? selectedWindow?.startISO ?? selectedWindow?.peak ?? selectedWindow?.end ?? null;
  const windowEnd = selectedWindow?.end ?? selectedWindow?.to ?? selectedWindow?.endISO ?? null;

  const hasRange = Boolean(windowStart && windowEnd && !sameDate(windowStart, windowEnd));
  const windowLabel = hasRange
    ? `${formatDate(windowStart)} to ${formatDate(windowEnd)}`
    : windowStart
      ? formatDate(windowStart)
      : selectedWindow?.label ?? null;

  const triggerDate = trigger?.date ?? null;
  const triggerDistance = daysBetween(triggerDate, windowStart);
  const triggerInsideWindow = Boolean(
    triggerDate &&
    windowStart &&
    windowEnd &&
    extractISODate(triggerDate) &&
    extractISODate(windowStart) &&
    extractISODate(windowEnd) &&
    extractISODate(triggerDate)! >= extractISODate(windowStart)! &&
    extractISODate(triggerDate)! <= extractISODate(windowEnd)!
  );

  const conversionVerdict = bundle.conversionDiagnosisV2?.verdict;
  const showTriggerDate = Boolean(
    triggerDate &&
    (triggerInsideWindow ||
      conversionVerdict === "conversion_favored" ||
      trigger?.confidence === "high" ||
      (triggerDistance !== null && triggerDistance <= 120))
  );

  const timingVerdict = bundle.timingLayer?.verdict;
  const chartVerdict =
    timingVerdict === "strong"
      ? profile.immediateStrong
      : timingVerdict === "moderate"
        ? profile.immediateModerate
        : profile.immediateNegative;

  const verdict = decision
    ? `${chartVerdict} ${decisionSentence(decision)}`
    : chartVerdict;
const isProfessionIdentity =
  bundle?.careerEventType === "profession_identity" ||
  bundle?.eventType === "profession_identity";
const shouldAnswerTiming =
  !isProfessionIdentity &&
  (
    bundle.questionType === "timing" ||
    bundle.questionType === "prediction"
  );

const timing =
  shouldAnswerTiming
    ? windowLabel
      ? `The period I would watch most closely runs from ${windowLabel}.`
      : "I would read the timing as a broader phase rather than reduce it to one exact date."
    : "";

 const earlyMovement =
  shouldAnswerTiming && triggerDate
    ? showTriggerDate
      ? triggerInsideWindow
        ? `${formatDate(triggerDate)} may act as a sharper activation point within that broader period.`
        : `A preliminary opening may appear around ${formatDate(triggerDate)}, but I would treat it as the beginning of the process rather than the date of ${profile.outcomeName}.`
      : profile.earlierMovement
    : "";

  // Do not repeat profile.earlierMovement here; it is already included above when relevant.
  const unfolding =
  isProfessionIdentity
    ? ""
    : conversionVerdict === "conversion_favored"
      ? profile.conversionLanguage
      : conversionVerdict === "movement_favored"
        ? `The present phase is more useful for opening the process. ${profile.conversionLanguage}`
        : profile.blockedLanguage;

  const stageNarrative =
  isProfessionIdentity
    ? ""
    : profile.stages
        .map(
          (stage) =>
            `${stage.label}: ${joinNatural(stage.examples)}.`
        )
        .join(" ");

  const confidence = selectedWindow?.confidence ?? trigger?.confidence ?? String(bundle.confidence ?? "").toLowerCase();
  const confidenceSentence =
    confidence === "high"
      ? "The alignment is comparatively coherent, although practical confirmation must still guide the final decision."
      : confidence === "medium"
        ? "I would regard this as the more credible period, but not as a fixed promise independent of real-world developments."
        : "The timing remains conditional, so I would look for practical confirmation before relying on it.";

  const short = [verdict, timing, earlyMovement].filter(Boolean).join(" ");
  const full = [
  short,
  unfolding,
  stageNarrative
    ? `The sequence I would expect is: ${stageNarrative}`
    : "",
  isProfessionIdentity
    ? ""
    : confidenceSentence,
]
  .filter(Boolean)
  .join("\n\n");

  const actionLines = decision
    ? [
        ...decision.do,
        ...decision.avoid.map((item) => `Avoid: ${item}`),
      ]
    : [profile.preparationAdvice, profile.activeWindowAdvice, profile.caution];

  const action = actionLines.join("\n");
  return { short, full, action, verdict, timing, unfolding };
}
