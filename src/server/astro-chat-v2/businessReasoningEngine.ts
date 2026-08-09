import type {
  QuestionClassification,
} from "./questionClassifier";

import type {
  BusinessReasoningProfile,
} from "./businessReasoningProfiles";

import {
  buildBaseReasoning,
  type BaseReasoningResult,
} from "./baseReasoningEngine";

import {
  buildBusinessArchetypes,
  type BusinessArchetypeResult,
} from "./businessArchetypeEngine";

export type BusinessSuitabilityCategory = {
  label: string;
  fit: "strong" | "moderate" | "low";
  reasons: string[];
};

export type BusinessReasoningResult = {
  topic: "business";
  intent: QuestionClassification["intent"];
  event: QuestionClassification["event"];
  profileKey: string;

  base: BaseReasoningResult;

  verdict: {
    level:
      | "strong_fit"
      | "conditional_fit"
      | "prepare"
      | "proceed"
      | "wait"
      | "unclear";

    headline: string;
    summary: string;
  };

  suitability?: {
    strongestModels: BusinessSuitabilityCategory[];
    moderateModels: BusinessSuitabilityCategory[];
    lowerFitModels: BusinessSuitabilityCategory[];

    naturalRole:
      | "advisor"
      | "operator"
      | "builder"
      | "seller"
      | "strategist"
      | "hybrid";

    operatingStyle: string[];
    commercialStrengths: string[];
    commercialRisks: string[];

    archetypeResult: BusinessArchetypeResult;
  };

  decision?: {
    level:
      | "proceed"
      | "prepare"
      | "wait"
      | "avoid";

    rationale: string;

    recommendedActions: string[];
    avoidActions: string[];

    transitionAdvice:
      | "side_business_first"
      | "controlled_launch"
      | "full_transition_possible"
      | "wait_for_better_alignment";
  };

  timing?: {
    primaryWindow: {
      label: string;
      start?: string | null;
      end?: string | null;
      confidence: "high" | "medium" | "low";
      meaning: string;
    } | null;

    preparationWindow: string | null;
    launchWindow: string | null;
    commercialProofWindow: string | null;
    expansionWindow: string | null;

    timingVerdict: string;
  };
};

type BundleLike = any;

function deriveNaturalRole(
  archetypeResult: BusinessArchetypeResult
): NonNullable<
  BusinessReasoningResult["suitability"]
>["naturalRole"] {
  const role =
    archetypeResult.preferredRole.toLowerCase();

  if (
    role.includes("advisor") &&
    role.includes("operator")
  ) {
    return "hybrid";
  }

  if (
    role.includes("advisor") ||
    role.includes("strategist") ||
    role.includes("guide")
  ) {
    return "advisor";
  }

  if (
    role.includes("operator") ||
    role.includes("execution")
  ) {
    return "operator";
  }

  if (
    role.includes("builder") ||
    role.includes("product")
  ) {
    return "builder";
  }

  if (
    role.includes("seller") ||
    role.includes("commercial connector")
  ) {
    return "seller";
  }

  return "strategist";
}

function deriveSuitability(
  bundle: BundleLike,
  base: BaseReasoningResult
): NonNullable<
  BusinessReasoningResult["suitability"]
> {
  const archetypeResult =
    buildBusinessArchetypes({
      bundle,
      base,
    });

  const strongestModels =
    archetypeResult
      .strongestArchetypes
      .map(
        (archetype) => ({
          label:
            archetype.label,

          fit:
            "strong" as const,

          reasons:
            archetype.reasons,
        })
      );

  const moderateModels =
    archetypeResult
      .moderateArchetypes
      .map(
        (archetype) => ({
          label:
            archetype.label,

          fit:
            "moderate" as const,

          reasons:
            archetype.reasons,
        })
      );

  const lowerFitModels =
    archetypeResult
      .lowerFitArchetypes
      .map(
        (archetype) => ({
          label:
            archetype.label,

          fit:
            "low" as const,

          reasons: [
            ...archetype.reasons,
            ...archetype.cautions,
          ],
        })
      );

  return {
    strongestModels:
      strongestModels.slice(
        0,
        4
      ),

    moderateModels:
      moderateModels.slice(
        0,
        5
      ),

    lowerFitModels:
      lowerFitModels.slice(
        0,
        4
      ),

    naturalRole:
      deriveNaturalRole(
        archetypeResult
      ),

    operatingStyle:
      archetypeResult
        .preferredOperatingStyle,

    commercialStrengths:
      archetypeResult
        .dominantCommercialThemes,

    commercialRisks: [
      "Scaling before demand is proven",

      "Taking on fixed costs too early",

      "Choosing vague partnerships without written responsibilities",

      "Depending on one client, one channel, or one source of revenue",
    ],

    archetypeResult,
  };
}

function deriveDecision(
  base: BaseReasoningResult
): NonNullable<
  BusinessReasoningResult["decision"]
> {
  if (
    base.layers.conversion.score >= 68 &&
    base.layers.natal.score >= 68
  ) {
    return {
      level:
        "proceed",

      rationale:
        "The main astrological layers align sufficiently for a controlled launch, provided the commercial model is validated in practice.",

      recommendedActions: [
        "Begin with one clear offer and customer segment",

        "Acquire paying customers before expanding fixed costs",

        "Track margins, retention, and cash flow from the beginning",

        "Use written commercial and partnership terms",
      ],

      avoidActions: [
        "Committing large capital before proving demand",

        "Leaving stable income before the business becomes dependable",
      ],

      transitionAdvice:
        "controlled_launch",
    };
  }

  if (
    base.layers.dasha.score < 48 ||
    base.layers.transit.score < 48
  ) {
    return {
      level:
        "wait",

      rationale:
        "The chart may support business capacity, but the present timing is better used to strengthen the model than to depend on it fully.",

      recommendedActions: [
        "Validate demand while retaining existing income",

        "Build the offer, pricing, customer segment, and operating process",

        "Create a financial buffer before considering a full transition",
      ],

      avoidActions: [
        "An all-in transition without recurring revenue",

        "Large borrowing or fixed costs during an unproven phase",
      ],

      transitionAdvice:
        "wait_for_better_alignment",
    };
  }

  return {
    level:
      "prepare",

    rationale:
      "The current combination supports groundwork, testing, and controlled commercial movement more clearly than immediate financial dependence on the business.",

    recommendedActions: [
      "Develop the business alongside existing income",

      "Validate paying demand before scaling",

      "Start with a defined offer and customer segment",

      "Track cash flow, compliance, and repeat business",
    ],

    avoidActions: [
      "Leaving stable employment before recurring revenue develops",

      "Committing large capital before proving demand",

      "Entering vague partnerships without written roles and exit terms",
    ],

    transitionAdvice:
      "side_business_first",
  };
}

function deriveTiming(
  base: BaseReasoningResult
): NonNullable<
  BusinessReasoningResult["timing"]
> {
  const selectedWindow =
    base.timing.selectedWindow;

  const label =
    String(
      selectedWindow?.label ??
      ""
    ).trim();

  const confidence =
    (
      selectedWindow?.confidence ===
        "high" ||
      selectedWindow?.confidence ===
        "medium" ||
      selectedWindow?.confidence ===
        "low"
    )
      ? selectedWindow.confidence
      : "low";

  return {
    primaryWindow:
      selectedWindow
        ? {
            label:
              label ||
              "Selected business window",

            start:
              selectedWindow?.start ??
              selectedWindow?.from ??
              selectedWindow?.startISO ??
              null,

            end:
              selectedWindow?.end ??
              selectedWindow?.to ??
              selectedWindow?.endISO ??
              null,

            confidence,

            meaning:
              selectedWindow
                ?.practicalMeaning ??
              "Use this period for visible commercial activity while confirming demand and execution in practice.",
          }
        : null,

    preparationWindow:
      "Use the earlier phase to clarify the offer, customer segment, pricing, compliance, and financial buffer.",

    launchWindow:
      selectedWindow
        ? "Use the selected window for registration, public launch, client outreach, and first commercial commitments."
        : null,

    commercialProofWindow:
      "Commercial proof should be judged through repeat customers, stable margins, and dependable cash flow—not launch activity alone.",

    expansionWindow:
      "Expand only after demand, retention, and operating stability are visible.",

    timingVerdict:
      base.layers.conversion.score >= 68
        ? "The selected period can support launch and practical conversion, although business stability still requires commercial proof."

        : "The selected period is better suited to activation and testing than immediate dependence on the business as the primary income source.",
  };
}

export function buildBusinessReasoning(params: {
  classification: QuestionClassification;
  profile: BusinessReasoningProfile;
  bundle: BundleLike;
}): BusinessReasoningResult {
  const {
    classification,
    profile,
    bundle,
  } = params;

  if (
    classification.topic !==
    "business"
  ) {
    throw new Error(
      `Business reasoning requested for topic "${classification.topic}".`
    );
  }

  const base =
    buildBaseReasoning(
      bundle
    );

  if (
    profile.requiresSuitability
  ) {
    const suitability =
      deriveSuitability(
        bundle,
        base
      );

    return {
      topic:
        "business",

      intent:
        classification.intent,

      event:
        classification.event,

      profileKey:
        profile.key,

      base,

      verdict: {
        level:
          suitability
            .strongestModels
            .length > 0
            ? "strong_fit"
            : "conditional_fit",

        headline:
          suitability
            .strongestModels
            .length > 0
            ? `The chart most strongly favours ${suitability.strongestModels
                .slice(0, 3)
                .map(
                  (model) =>
                    model.label
                )
                .join(", ")}.`
            : "The chart supports business, but the best model should remain controlled, low-fixed-cost, and evidence-led.",

        summary:
          suitability
            .archetypeResult
            .dominantCommercialThemes
            .slice(0, 3)
            .join(" "),
      },

      suitability,
    };
  }

  if (
    profile.requiresTiming
  ) {
    const decision =
      deriveDecision(
        base
      );

    const timing =
      deriveTiming(
        base
      );

    return {
      topic:
        "business",

      intent:
        classification.intent,

      event:
        classification.event,

      profileKey:
        profile.key,

      base,

      verdict: {
        level:
          decision.level ===
          "proceed"
            ? "proceed"
            : decision.level ===
              "wait"
            ? "wait"
            : "prepare",

        headline:
          decision.level ===
          "proceed"
            ? "The chart supports a controlled business launch during the selected period."
            : "The chart supports preparation and staged commercial movement more strongly than an immediate all-in transition.",

        summary:
          timing.timingVerdict,
      },

      decision,

      timing,
    };
  }

  if (
    profile.requiresDecision
  ) {
    const decision =
      deriveDecision(
        base
      );

    return {
      topic:
        "business",

      intent:
        classification.intent,

      event:
        classification.event,

      profileKey:
        profile.key,

      base,

      verdict: {
        level:
          decision.level ===
          "proceed"
            ? "proceed"
            : decision.level ===
              "wait"
            ? "wait"
            : "prepare",

        headline:
          decision.level ===
          "proceed"
            ? "You can begin with a controlled launch, but commercial proof should govern the pace of expansion."
            : "Build the business alongside existing income until demand and recurring revenue become dependable.",

        summary:
          decision.rationale,
      },

      decision,
    };
  }

  return {
    topic:
      "business",

    intent:
      classification.intent,

    event:
      classification.event,

    profileKey:
      profile.key,

    base,

    verdict: {
      level:
        "unclear",

      headline:
        "The business theme requires a more specific question before a precise judgement can be made.",

      summary:
        "Ask about suitability, timing, partnership, launch, expansion, or business success.",
    },
  };
}
