import type {
  BusinessReasoningProfile,
} from "./businessReasoningProfiles";

import type {
  BusinessReasoningResult,
} from "./businessReasoningEngine";

export type BusinessComposedGuidance = {
  short: string;
  full: string;
};

function joinNatural(
  items: string[]
): string {
  const clean =
    items
      .map(
        (item) =>
          String(item ?? "").trim()
      )
      .filter(Boolean);

  if (clean.length === 0) {
    return "";
  }

  if (clean.length === 1) {
    return clean[0];
  }

  if (clean.length === 2) {
    return `${clean[0]} and ${clean[1]}`;
  }

  return `${clean
    .slice(0, -1)
    .join(", ")}, and ${clean.at(-1)}`;
}

function composeSuitability(
  reasoning: BusinessReasoningResult
): BusinessComposedGuidance {
  const suitability =
    reasoning.suitability;

  if (!suitability) {
    return {
      short:
        reasoning.verdict.headline,

      full:
        reasoning.verdict.summary,
    };
  }

  const strongestLabels =
    suitability
      .strongestModels
      .map(
        (model) =>
          model.label
      )
      .slice(0, 3);

  const moderateLabels =
    suitability
      .moderateModels
      .map(
        (model) =>
          model.label
      )
      .slice(0, 2);

  const naturalRole =
    suitability.naturalRole ===
    "advisor"
      ? "an advisor and subject-matter guide"
      : suitability.naturalRole ===
        "operator"
      ? "a structured operator"
      : suitability.naturalRole ===
        "builder"
      ? "a product or platform builder"
      : suitability.naturalRole ===
        "seller"
      ? "a commercial connector and seller"
      : suitability.naturalRole ===
        "hybrid"
      ? "a hybrid advisor-operator"
      : "a strategist";

  const short =
    strongestLabels.length
      ? `Your chart is best suited to ${joinNatural(
          strongestLabels
        )}.`
      : reasoning.verdict.headline;

  const paragraphs: string[] = [
    strongestLabels.length
      ? `If I were advising you personally, I would place the strongest emphasis on ${joinNatural(
          strongestLabels
        )}. These models make the best use of your chart's combination of knowledge, client trust, structured thinking, and scalable delivery.`
      : reasoning.verdict.summary,

    `Your natural role appears closer to ${naturalRole} than to a purely speculative risk-taker. You are more likely to do well where expertise, judgement, relationships, systems, or digital reach can be converted into repeatable value.`,

    moderateLabels.length
      ? `You can also consider ${joinNatural(
          moderateLabels
        )}, provided the business has a clear offer, measurable client value, and disciplined execution.`
      : "",

    `I would be more cautious about highly leveraged, inventory-heavy, or capital-intensive ventures that require large commitments before demand is proven. The chart is better suited to controlled validation and steady compounding than to an aggressive all-in gamble.`,
  ];

  return {
    short,

    full:
      paragraphs
        .filter(Boolean)
        .join("\n\n"),
  };
}

function composeDecision(
  reasoning: BusinessReasoningResult
): BusinessComposedGuidance {
  const decision =
    reasoning.decision;

  if (!decision) {
    return {
      short:
        reasoning.verdict.headline,

      full:
        reasoning.verdict.summary,
    };
  }

  const short =
    decision.level === "proceed"
      ? "You can begin, but the launch should remain controlled and commercially disciplined."
      : decision.level === "wait"
      ? "Do not make an all-in transition yet; use the present phase to strengthen the model."
      : decision.level === "avoid"
      ? "I would not advise proceeding under the current conditions."
      : "Build the business alongside existing income before depending on it fully.";

  const paragraphs: string[] = [
    decision.level === "proceed"
      ? `Your chart supports beginning the business, but I would still advise a controlled launch rather than immediate overexpansion. The first objective should be paying demand, not scale.`
      : decision.level === "wait"
      ? `Your chart may support business capacity, but the present phase is not strong enough for a dependable all-in transition. I would use it to refine the offer, test demand, and build a financial buffer while retaining existing income.`
      : decision.level === "avoid"
      ? `The present combination does not justify taking a major irreversible business risk. Delay the decision until the commercial model and timing become clearer.`
      : `Your chart supports business activity, but I would advise building it alongside existing income rather than depending on it immediately. The current phase is better suited to testing, acquiring initial clients, and proving repeatable revenue.`,

    decision.rationale,

    decision.transitionAdvice ===
    "side_business_first"
      ? `The safest route is to begin as a side business, validate one defined offer, and consider a larger transition only after recurring revenue becomes dependable.`
      : decision.transitionAdvice ===
        "controlled_launch"
      ? `A controlled launch is appropriate: begin with one customer segment, limited fixed costs, and clear operating discipline.`
      : decision.transitionAdvice ===
        "full_transition_possible"
      ? `A larger transition can be considered, but only after the practical conditions—cash flow, customer demand, capital buffer, and operating stability—are confirmed.`
      : `This phase is better used for preparation than for financial dependence on the business.`,
  ];

  return {
    short,

    full:
      paragraphs
        .filter(Boolean)
        .join("\n\n"),
  };
}

function formatWindow(
  window: NonNullable<
    BusinessReasoningResult["timing"]
  >["primaryWindow"]
): string {
  if (!window) {
    return "";
  }

  if (
    window.start &&
    window.end &&
    window.start !==
      window.end
  ) {
    return `${window.start} to ${window.end}`;
  }

  return (
    window.start ??
    window.label
  );
}

function composeTiming(
  reasoning: BusinessReasoningResult
): BusinessComposedGuidance {
  const timing =
    reasoning.timing;

  if (!timing) {
    return {
      short:
        reasoning.verdict.headline,

      full:
        reasoning.verdict.summary,
    };
  }

  const windowText =
    formatWindow(
      timing.primaryWindow
    );

  const short =
    windowText
      ? `The period I would monitor most closely for a controlled business launch is ${windowText}.`
      : "The chart currently supports staged business development more clearly than one sharply defined launch date.";

  const paragraphs: string[] = [
    windowText
      ? `The period I would monitor most closely is ${windowText}. I would use it for a controlled launch, client outreach, registration, and the first serious commercial commitments—not as a guarantee of immediate stability.`
      : timing.timingVerdict,

    timing.preparationWindow
      ? `Before that, focus on ${timing.preparationWindow
          .replace(
            /^Use the earlier phase to\s*/i,
            ""
          )
          .replace(
            /\.$/,
            ""
          )}.`
      : "",

    timing.commercialProofWindow ??
      "",

    timing.expansionWindow ??
      "",

    timing.timingVerdict,
  ];

  return {
    short,

    full:
      paragraphs
        .filter(Boolean)
        .filter(
          (
            paragraph,
            index,
            values
          ) =>
            values.indexOf(
              paragraph
            ) === index
        )
        .join("\n\n"),
  };
}

export function composeBusinessGuidance(params: {
  profile: BusinessReasoningProfile;
  reasoning: BusinessReasoningResult;
}): BusinessComposedGuidance {
  const {
    profile,
    reasoning,
  } = params;

  if (
    profile.requiresSuitability
  ) {
    return composeSuitability(
      reasoning
    );
  }

  if (
    profile.requiresTiming
  ) {
    return composeTiming(
      reasoning
    );
  }

  if (
    profile.requiresDecision
  ) {
    return composeDecision(
      reasoning
    );
  }

  return {
    short:
      reasoning.verdict.headline,

    full:
      [
        reasoning.verdict.headline,
        reasoning.verdict.summary,
      ]
        .filter(Boolean)
        .join("\n\n"),
  };
}
