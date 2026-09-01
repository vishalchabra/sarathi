// FILE: src/server/sarathi/reasoning/dashaReasoning.ts

import type {
  ReasoningItem,
  ReasoningSection,
} from "./types";

type DashaReasoningParams = {
  topic?: string | null;
  eventType?: string | null;

  timingHierarchy?: any;
  currentDasha?: any;

  planetContexts?: Record<
    string,
    DashaPlanetContext
  >;

  source?: string;
};

type DashaPlanetContext = {
  explanation?: string;
  practicalMeaning?: string;
};
type DashaTemplate = {
  title: string;
  explanation: string;
  practicalMeaning: string;
};

const PLANET_DASHA_MEANINGS: Record<
  string,
  string
> = {
  Sun:
    "visibility, authority, leadership, confidence, and decisive action",

  Moon:
    "emotional involvement, responsiveness, changeability, public interaction, and personal priorities",

  Mars:
    "initiative, courage, execution, competition, and movement from planning into action",

  Mercury:
    "communication, analysis, negotiation, commerce, networking, and decision-making",

  Jupiter:
    "growth, opportunity, support, confidence, learning, and long-term expansion",

  Venus:
    "comfort, relationships, value, assets, cooperation, material quality, and settlement",

  Saturn:
    "responsibility, discipline, patience, structure, delay, and long-term stability",

  Rahu:
    "ambition, experimentation, unconventional movement, foreign influence, disruption, and accelerated desire",

  Ketu:
    "detachment, simplification, specialization, reassessment, withdrawal, and separation from old patterns",
};

function normalizePlanet(
  value: unknown
): string {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();

  if (!raw) return "";

  return (
    Object.keys(
      PLANET_DASHA_MEANINGS
    ).find(
      (planet) =>
        planet.toLowerCase() ===
        raw
    ) ?? ""
  );
}

function normalizeTopic(
  topic?: string | null,
  eventType?: string | null
): string {
  const t = String(
    topic ?? ""
  )
    .trim()
    .toLowerCase();

  if (t) {
    if (
      t === "home" ||
      t === "property"
    ) {
      return "property";
    }

    if (
      t === "vehicle" ||
      t === "car"
    ) {
      return "vehicle";
    }

    if (
      t === "relationship" ||
      t === "relationships"
    ) {
      return "relationships";
    }

    return t;
  }

  const e = String(
    eventType ?? ""
  )
    .trim()
    .toLowerCase();

  if (
    e.includes("property") ||
    e.includes("house")
  ) {
    return "property";
  }

  if (
    e.includes("vehicle") ||
    e.includes("car")
  ) {
    return "vehicle";
  }

  if (
    e.includes("business")
  ) {
    return "business";
  }

  if (
    e.includes("promotion") ||
    e.includes("career") ||
    e.includes("job")
  ) {
    return "career";
  }

  if (
    e.includes("marriage")
  ) {
    return "marriage";
  }

  if (
    e.includes("relationship")
  ) {
    return "relationships";
  }

  if (
    e.includes("money") ||
    e.includes("income") ||
    e.includes("wealth")
  ) {
    return "money";
  }

  if (
    e.includes("relocation") ||
    e.includes("foreign_move")
  ) {
    return "relocation";
  }

  return "generic";
}

function topicPhrase(
  topic: string
): string {
  switch (topic) {
    case "property":
      return "property, home, settlement, and long-term assets";

    case "vehicle":
      return "vehicle ownership, mobility, comfort, and asset purchase";

    case "business":
      return "business activity, commerce, partnerships, and independent growth";

    case "career":
      return "career movement, responsibility, visibility, and professional progress";

    case "marriage":
    case "relationships":
      return "partnership, commitment, emotional involvement, and relationship development";

    case "money":
      return "income, gains, savings, resources, and financial growth";

    case "relocation":
      return "movement, residence change, settlement, and foreign or distant environments";
    case "financial_loss_risk":
  return "financial pressure, resource depletion, unexpected expenses, loss exposure, capital preservation, and financial stability";
    default:
      return "the user's main life event";
  }
}
function resolveEventPhrase(
  topic: string,
  eventType?: string | null
): string {
  const event =
    String(eventType ?? "")
      .toLowerCase()
      .trim();

  switch (event) {
    case "job_change":
      return "job search, interviews, offer movement, exit from the existing setup, and transition to a new role or employer";

    case "promotion":
      return "promotion, recognition, title elevation, increased responsibility, and professional reward";

    case "salary_increase":
      return "salary improvement, compensation movement, bonus, or increased professional income";

    case "buy_property":
      return "property search, financing, agreement, registration, and possession";

    case "buy_vehicle":
      return "vehicle selection, financing, booking, purchase, and delivery";

    case "marriage_commitment":
      return "commitment, family discussions, engagement, and marriage movement";

    case "foreign_move":
      return "foreign relocation, documentation, approvals, movement, and settlement";

    case "health_recovery":
      return "health recovery, routine correction, diagnosis clarity, treatment response, and gradual improvement";
    
      case "higher_education":
      return "higher education, admission, study, skill development, qualification, and academic progress";
     
      case "childbirth_timing":
  return "family expansion, conception possibility, pregnancy development, childbirth, and transition into parenthood";
      case "dispute_resolution":
  return "dispute resolution, negotiation, legal movement, settlement efforts, and closure of the conflict";
  case "employment_risk":
  return "employment pressure, organizational instability, continuity risk, restructuring, and possible separation from the existing role";
  case "financial_loss_risk":
  return "financial pressure, resource depletion, unexpected expenses, loss exposure, capital preservation, and financial stability";
  case "relationship_breakdown_risk":
  return "relationship strain, emotional distance, partnership instability, continuity concerns, possible separation, and relationship stability";
  default:
      return topicPhrase(topic);
  }
}
function planetMeaning(
  planet: string
): string {
  return (
    PLANET_DASHA_MEANINGS[
      planet
    ] ??
    "the life themes associated with this planetary period"
  );
}

/* --------------------------------------------------
   Builder
-------------------------------------------------- */

export function buildDashaReasoning(
  params: DashaReasoningParams
): ReasoningSection {
  const {
  topic,
  eventType,
  timingHierarchy,
  currentDasha,
  planetContexts = {},
  source =
    "current dasha chain and timing hierarchy",
} = params;

  const normalizedTopic =
    normalizeTopic(
      topic,
      eventType
    );

  const eventPhrase =
  resolveEventPhrase(
    normalizedTopic,
    eventType
  );

  const md =
    normalizePlanet(
      currentDasha?.md ??
      currentDasha
        ?.mahadasha ??
      ""
    );

  const ad =
    normalizePlanet(
      currentDasha?.ad ??
      currentDasha
        ?.antardasha ??
      ""
    );
const mdContext =
  planetContexts[md] ??
  planetContexts[
    md.toLowerCase()
  ] ??
  null;

const adContext =
  planetContexts[ad] ??
  planetContexts[
    ad.toLowerCase()
  ] ??
  null;
  /*
   * IMPORTANT:
   *
   * The currently active PD may not be the same
   * PD selected as the strongest practicalWindow.
   *
   * So we prefer the practicalWindow reason for
   * the actionable sub-period, rather than assuming
   * currentDasha.pd is the predicted event PD.
   */

  const practicalWindow =
    timingHierarchy
      ?.practicalWindow ??
    null;

  const broaderWindow =
    timingHierarchy
      ?.broaderWindow ??
    null;

  const activationWindow =
    timingHierarchy
      ?.activationWindow ??
    null;

  const items: ReasoningItem[] =
    [];

  /*
   * ------------------------------------------------
   * 1. MAHADASHA
   *
   * Background life direction.
   * ------------------------------------------------
   */

  if (md) {
    items.push({
      id:
        `dasha:md:${md.toLowerCase()}`,

      title:
        `${md} Mahadasha sets the broader life context`,

      explanation:
        mdContext?.explanation
  ? `${mdContext.explanation}. This acts as the background life cycle within which ${eventPhrase} must develop.`
  : `${md} Mahadasha provides the broader dasha context within which ${eventPhrase} must develop.`,

      practicalMeaning:
        mdContext?.practicalMeaning ??
  `This period does not by itself guarantee the event, but it shapes the larger environment surrounding it.`,

      role:
        "supporting",

      confidence:
        "medium",

      source,
    });
  }

  /*
   * ------------------------------------------------
   * 2. ANTARDASHA
   *
   * Broader opportunity season.
   * ------------------------------------------------
   */

  if (
    ad &&
    broaderWindow
  ) {
    items.push({
      id:
        `dasha:ad:${ad.toLowerCase()}`,

      title:
        `${ad} Antardasha activates the broader opportunity phase`,

      explanation:
  adContext?.explanation
    ? `${adContext.explanation}. This sub-period supports the broader ${eventPhrase} phase from ${broaderWindow.start} to ${broaderWindow.end}.`
    : `In the current chart context, ${ad} Antardasha keeps ${eventPhrase} active from ${broaderWindow.start} to ${broaderWindow.end}.`,

      practicalMeaning:
        adContext?.practicalMeaning ??
  `This is the background season in which the event can develop through preparation, opportunities, discussions, decisions, and gradual movement.`,

      role:
        "primary",

      confidence:
        broaderWindow.confidence ??
        "medium",

      source,
    });
  }

  /*
   * ------------------------------------------------
   * 3. PRACTICAL PD
   *
   * We deliberately use timingHierarchy rather
   * than currentDasha.pd because the strongest
   * future practical PD may not be active today.
   * ------------------------------------------------
   */

  if (practicalWindow) {
    items.push({
      id:
        "dasha:practical",

      title:
        "The shorter sub-period creates the strongest practical opportunity",

      explanation:
        practicalWindow.reason
          ? String(
              practicalWindow.reason
            )
          : `The shorter dasha layer strengthens ${eventPhrase} during the main actionable window.`,

      practicalMeaning:
        `This is why ${practicalWindow.start} to ${practicalWindow.end} is more capable of converting preparation into concrete action or outcome than the broader dasha period alone.`,

      role:
        "primary",

      confidence:
        practicalWindow.confidence ??
        "medium",

      source,
    });
  }

  /*
   * ------------------------------------------------
   * 4. ACTIVATION TRIGGER
   *
   * Transit is not dasha, but including its relation
   * here explains how the shorter trigger interacts
   * with the dasha hierarchy.
   * ------------------------------------------------
   */

  if (
    activationWindow &&
    practicalWindow
  ) {
    const activationDate =
      activationWindow.peak ??
      activationWindow.start;

    const beforePractical =
      activationDate <
      practicalWindow.start;

    const insidePractical =
      activationDate >=
        practicalWindow.start &&
      activationDate <=
        practicalWindow.end;

    items.push({
      id:
        "dasha:activation-relationship",

      title:
        beforePractical
          ? "The transit trigger opens the process before the stronger dasha window"
          : insidePractical
          ? "The transit trigger sharpens the stronger dasha window"
          : "The transit trigger adds a separate activation point",

      explanation:
        beforePractical
          ? `The trigger around ${activationDate} occurs before the main actionable dasha period, so it is better understood as an early opening, conversation, decision, or momentum-building point.`
          : insidePractical
          ? `The trigger around ${activationDate} falls inside the stronger dasha period and can act as a sharper catalyst for visible movement.`
          : `The trigger around ${activationDate} is separate from the main practical dasha window and should be treated as supporting timing rather than the primary event period.`,

      practicalMeaning:
        beforePractical
          ? "The process may begin earlier, but the stronger period for conversion remains the practical dasha window."
          : insidePractical
          ? "This can mark a stronger moment for action inside the main window."
          : "Treat this as supplementary timing rather than replacing the main actionable period.",

      role:
        "supporting",

      confidence:
        activationWindow.confidence ??
        "medium",

      source,
    });
  }

  /*
   * Generic fallback
   */

  if (!items.length) {
    items.push({
      id:
        "dasha:generic",

      title:
        "The dasha pattern provides timing context",

      explanation:
        "The supplied planetary periods describe the broader life cycle and shorter activation phases surrounding the event.",

      practicalMeaning:
        "The event should be judged through the relationship between the broader dasha period and the shorter actionable window rather than through a single date alone.",

      role:
        "supporting",

      confidence:
        "low",

      source,
    });
  }

  const hasPrimary =
    items.some(
      (item) =>
        item.role === "primary"
    );

  const confidence:
    ReasoningSection["confidence"] =
    timingHierarchy
      ?.overallConfidence ??
    (hasPrimary
      ? "medium"
      : "low");

  return {
    id:
      "dasha",

    heading:
      "Dasha reasoning",

    summary:
      `The dasha hierarchy explains why ${eventPhrase} are active in this life phase and why the practical timing window is stronger than the surrounding periods.`,

    confidence,

    source,

    items,
  };
}