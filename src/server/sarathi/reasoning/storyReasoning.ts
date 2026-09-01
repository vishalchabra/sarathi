// FILE: src/server/sarathi/reasoning/storyReasoning.ts

import type {
  ReasoningItem,
  ReasoningSection,
} from "./types";

type Params = {
  topic?: string | null;
  eventType?: string | null;
  promise?: any;
  timing?: any;

  reasoning?: ReasoningSection[];

  sequence?: ReasoningSection | null;
  risks?: ReasoningSection | null;
  actions?: ReasoningSection | null;

  source?: string;
};

function normalizeTopic(
  topic?: string | null
): string {
  const value = String(topic ?? "")
    .trim()
    .toLowerCase();

  if (value === "home") return "property";
  if (value === "car") return "vehicle";
  if (value === "relationship") return "relationships";

  return value || "general";
}

function topicLabel(
  topic: string
): string {
  switch (topic) {
    case "property":
      return "property";
    case "vehicle":
      return "vehicle purchase";
    case "career":
      return "career development";
    case "business":
      return "business development";
    case "marriage":
      return "marriage";
    case "relationships":
      return "relationship development";
    case "money":
      return "financial development";
    case "relocation":
      return "relocation";
    case "health":
  return "health recovery";
  case "education":
  return "higher education";
  case "child":
  return "family expansion and childbirth";
  case "disputes":
  return "dispute resolution and legal closure";
    default:
      return "this event";
  }
}

function formatWindow(
  window: any
): string | null {
  if (!window?.start) {
    return null;
  }

  if (
    !window?.end ||
    window.start === window.end
  ) {
    return String(window.start);
  }

  return `${window.start} to ${window.end}`;
}

function getSection(
  reasoning: ReasoningSection[] | undefined,
  id: string
): ReasoningSection | null {
  if (!Array.isArray(reasoning)) {
    return null;
  }

  return (
    reasoning.find(
      (section) =>
        section?.id === id
    ) ?? null
  );
}

function firstPrimaryItem(
  section?: ReasoningSection | null
): ReasoningItem | null {
  if (!section?.items?.length) {
    return null;
  }

  return (
    section.items.find(
      (item) =>
        item.role === "primary"
    ) ??
    section.items[0] ??
    null
  );
}

export function buildStoryReasoning(
  params: Params
): ReasoningSection {
  const {
    promise,
    timing,
    reasoning,
    sequence,
    risks,
    actions,
    source =
      "structured reasoning synthesis",
  } = params;

  const topic =
    normalizeTopic(
      params.topic
    );

  const normalizedEventType =
  String(
    params.eventType ?? ""
  )
    .toLowerCase()
    .trim();

const label =
  normalizedEventType ===
  "employment_risk"
    ? "employment stability and job-loss risk"
    : normalizedEventType ===
      "financial_loss_risk"
    ? "financial stability and major-loss risk"
    : normalizedEventType ===
      "relationship_breakdown_risk"
    ? "relationship stability and separation risk"
    : topicLabel(topic);
  const items: ReasoningItem[] =
    [];

  const practicalWindow =
    timing?.practicalWindow ??
    null;

  const broaderWindow =
    timing?.broaderWindow ??
    null;

  const activationWindow =
    timing?.activationWindow ??
    null;

  const practicalRange =
    formatWindow(
      practicalWindow
    );

  const broaderRange =
    formatWindow(
      broaderWindow
    );

  const activationRange =
    formatWindow(
      activationWindow
    );

  const eventSection =
    getSection(
      reasoning,
      "event"
    );

  const dashaSection =
    getSection(
      reasoning,
      "dasha"
    );

  const eventItem =
    firstPrimaryItem(
      eventSection
    );

  const dashaItem =
    firstPrimaryItem(
      dashaSection
    );

  const firstSequence =
    sequence?.items?.[0] ??
    null;

  const finalSequence =
    sequence?.items?.[
      (sequence?.items?.length ?? 1) - 1
    ] ?? null;

  const primaryRisk =
    firstPrimaryItem(
      risks
    );

  const primaryAction =
    firstPrimaryItem(
      actions
    );

  /* ---------------------------------------------
     1. EVENT PROMISE
  --------------------------------------------- */

  if (promise) {
    const verdict =
      String(
        promise?.verdict ??
        "unclear"
      ).toLowerCase();

    items.push({
      id:
        "story:promise",

     title:
  normalizedEventType ===
  "employment_risk"
    ? "Underlying employment stability and disruption risk"
    : normalizedEventType ===
      "financial_loss_risk"
    ? "Underlying financial stability and loss risk"
    : normalizedEventType ===
      "relationship_breakdown_risk"
    ? "Underlying relationship stability and separation risk"
    : `Underlying ${label} potential`,

      explanation:
        promise?.summary
          ? String(promise.summary)
          : `The natal chart provides ${verdict} support for ${label}.`,

      practicalMeaning:
        verdict === "strong"
          ? `The underlying chart supports ${label}, so timing is primarily about when that promise is most capable of becoming concrete.`
          : verdict === "moderate"
          ? `The chart supports ${label}, although practical circumstances and timing remain important to conversion.`
          : `The chart does not show an exceptionally strong promise, so timing should be interpreted cautiously.`,

      role:
        "primary",

      confidence:
        verdict === "strong"
          ? "high"
          : verdict === "moderate"
          ? "medium"
          : "low",

      source,
    });
  }

  /* ---------------------------------------------
     2. MAIN TIMING CONCLUSION
  --------------------------------------------- */

  if (practicalRange) {
    items.push({
      id:
        "story:timing",

      title:
        "Main actionable period",

      explanation:
  normalizedEventType ===
  "financial_loss_risk"
    ? `${practicalRange} is the main practical window identified for assessing financial pressure and loss exposure.`
    : normalizedEventType ===
      "relationship_breakdown_risk"
    ? `${practicalRange} is the main practical window identified for assessing relationship strain, continuity, and separation risk.`
    : `${practicalRange} is the strongest practical working window identified for ${label}.`,

      practicalMeaning:
  normalizedEventType ===
  "employment_risk"
    ? broaderRange
      ? `The broader assessment period is ${broaderRange}, while the practical window is the period in which employment conditions should be watched more closely.`
      : `This is the main period in which employment conditions should be watched more closely.`

    : normalizedEventType ===
      "financial_loss_risk"
    ? broaderRange
      ? `The broader assessment period is ${broaderRange}, while the practical window is the period in which financial pressure, exposure, and resource stability should be watched more closely.`
      : `This is the main period in which financial pressure, exposure, and resource stability should be watched more closely.`

    : normalizedEventType ===
      "relationship_breakdown_risk"
    ? broaderRange
      ? `The broader assessment period is ${broaderRange}, while the practical window is the period in which relationship strain, continuity, emotional distance, and separation risk should be watched more closely.`
      : `This is the main period in which relationship strain, continuity, emotional distance, and separation risk should be watched more closely.`

    : broaderRange
    ? `The broader opportunity phase is ${broaderRange}, but the practical window should carry greater weight for concrete action or conversion.`
    : `This period should carry the greatest weight for concrete action or conversion.`,

      role:
        "primary",

      confidence:
        practicalWindow
          ?.confidence ??
        timing
          ?.overallConfidence ??
        "medium",

      source,
    });
  }

  /* ---------------------------------------------
     3. EARLIER / SHARPER TRIGGER
  --------------------------------------------- */

  if (
    activationRange &&
    practicalRange
  ) {
    const activationStart =
      String(
        activationWindow?.peak ??
        activationWindow?.start ??
        ""
      );

    const practicalStart =
      String(
        practicalWindow?.start ??
        ""
      );

    const practicalEnd =
      String(
        practicalWindow?.end ??
        ""
      );

    const inside =
      activationStart >= practicalStart &&
      activationStart <= practicalEnd;

    const before =
      activationStart < practicalStart;

    items.push({
      id:
        "story:activation",

      title:
        inside
          ? "A sharper trigger appears inside the main window"
          : before
          ? "An earlier trigger may start the process"
          : "A separate trigger may create visible movement",

      explanation:
        inside
          ? `${activationRange} falls inside the main actionable period and may sharpen activity or decision-making.`
          : before
          ? `${activationRange} appears before the main actionable period and may begin the process through discussion, research, opportunity, or preparation.`
          : `${activationRange} appears as a separate activation point around the broader event process.`,

      practicalMeaning:
        inside
          ? "Treat this as a possible catalyst within the larger window, not as a guaranteed event date."
          : before
          ? "Treat this as momentum-building rather than assuming the final event must complete on this date."
          : "This trigger should support, rather than replace, the main timing hierarchy.",

      role:
        "supporting",

      confidence:
        activationWindow
          ?.confidence ??
        "medium",

      source,
    });
  }

  /* ---------------------------------------------
     4. WHY THIS EVENT
  --------------------------------------------- */

  if (eventItem) {
    items.push({
      id:
        "story:event",

      title:
        "Why the chart points toward this event",

      explanation:
        eventItem.explanation,

      practicalMeaning:
        eventItem.practicalMeaning,

      role:
        "primary",

      confidence:
        eventItem.confidence,

      source,
    });
  }

  /* ---------------------------------------------
     5. WHY NOW
  --------------------------------------------- */

  if (dashaItem) {
    items.push({
      id:
        "story:dasha",

      title:
        "Why this life phase matters",

      explanation:
        dashaItem.explanation,

      practicalMeaning:
        dashaItem.practicalMeaning,

      role:
        "supporting",

      confidence:
        dashaItem.confidence,

      source,
    });
  }

  /* ---------------------------------------------
     6. HOW IT IS LIKELY TO UNFOLD
  --------------------------------------------- */

  if (
    firstSequence &&
    finalSequence
  ) {
    items.push({
      id:
        "story:sequence",

      title:
        "How the event is likely to develop",

      explanation:
        `The expected progression begins with ${String(
          firstSequence.explanation
        ).toLowerCase()} and develops toward ${String(
          finalSequence.explanation
        ).toLowerCase()}.`,

      practicalMeaning:
        "The event is more likely to develop through stages than appear as a completely isolated one-day outcome.",

      role:
        "supporting",

      confidence:
        sequence
          ?.confidence ??
        "medium",

      source,
    });
  }

  /* ---------------------------------------------
     7. MAIN CAUTION
  --------------------------------------------- */

  if (primaryRisk) {
    items.push({
      id:
        "story:risk",

      title:
        "Main caution",

      explanation:
        primaryRisk.explanation,

      practicalMeaning:
        primaryRisk.practicalMeaning,

      role:
        "supporting",

      confidence:
        primaryRisk.confidence,

      source,
    });
  }

  /* ---------------------------------------------
     8. MAIN ACTION
  --------------------------------------------- */

  if (primaryAction) {
    items.push({
      id:
        "story:action",

      title:
        "Best practical response",

      explanation:
        primaryAction.explanation,

      practicalMeaning:
        primaryAction.practicalMeaning,

      role:
        "primary",

      confidence:
        primaryAction.confidence,

      source,
    });
  }

  return {
    id:
      "story",

    heading:
      "Integrated story",

    summary:
  normalizedEventType ===
  "financial_loss_risk"
    ? "The structured evidence has been combined into one coherent financial stability and loss-risk narrative without adding new astrological claims."
    : `The structured evidence has been combined into one coherent ${label} narrative without adding new astrological claims.`,

    confidence:
      timing
        ?.overallConfidence ??
      "medium",

    source,

    items,
  };
}