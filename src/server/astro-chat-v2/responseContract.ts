import type {
  AstroChatV2Intent,
  AstroChatV2Event,
  AstroChatV2Topic,
  QuestionClassification,
} from "./questionClassifier";

import type {
  BusinessReasoningResult,
} from "./businessReasoningEngine";

export type V2ResponseSection =
  | "guidance"
  | "timing"
  | "suitability"
  | "decision"
  | "journey"
  | "actions"
  | "risks"
  | "evidence"
  | "confidence";

export type V2ActionPlan = {
  do: string[];
  avoid: string[];
};

export type V2TimingSection = {
  title: string;
  primaryWindow: {
    label: string;
    start?: string | null;
    end?: string | null;
    confidence: "high" | "medium" | "low";
    meaning: string;
  } | null;
  preparation: string | null;
  launch: string | null;
  commercialProof: string | null;
  expansion: string | null;
  verdict: string;
};

export type V2SuitabilitySection = {
  title: string;

  strongestModels: Array<{
    label: string;
    reasons: string[];
  }>;

  moderateModels: Array<{
    label: string;
    reasons: string[];
  }>;

  lowerFitModels: Array<{
    label: string;
    reasons: string[];
  }>;

  naturalRole: string;
  operatingStyle: string[];
  commercialStrengths: string[];
  commercialRisks: string[];
};

export type V2DecisionSection = {
  title: string;
  level: "proceed" | "prepare" | "wait" | "avoid";
  rationale: string;
  transitionAdvice:
    | "side_business_first"
    | "controlled_launch"
    | "full_transition_possible"
    | "wait_for_better_alignment";
};

export type V2JourneySection = {
  title: string;
  stages: Array<{
    key: string;
    label: string;
    examples: string[];
  }>;
};

export type V2EvidenceSection = {
  title: string;

  layers: Array<{
    key:
      | "natal"
      | "sambandha"
      | "divisional"
      | "dasha"
      | "transit"
      | "conversion";

    label: string;
    strength: string;
    score: number;
    verdict: string;
    references: string[];
  }>;

  contradictions: string[];
  missing: string[];
};

export type AstroChatV2Response = {
  version: "sarathi-astro-chat-v2";

  classification: {
    topic: AstroChatV2Topic;
    intent: AstroChatV2Intent;
    event: AstroChatV2Event;
    confidence: QuestionClassification["confidence"];
    reasoningProfileKey: string;
  };

  render: {
    sections: V2ResponseSection[];
  };

  guidance: {
    title: string;
    short: string;
    full: string;
  };

  timing: V2TimingSection | null;
  suitability: V2SuitabilitySection | null;
  decision: V2DecisionSection | null;
  journey: V2JourneySection | null;

  actionPlan: V2ActionPlan | null;

  risks: {
    title: string;
    items: string[];
  } | null;

  confidence: {
    level: "high" | "medium" | "low";
    score: number;
    supporting: string[];
    limiting: string[];
  };

  evidence: V2EvidenceSection;

  meta: {
    usedTiming: boolean;
    usedDecision: boolean;
    usedSuitability: boolean;
    usedCurrentTransits: boolean;
  };
};

export function getAllowedSectionsForIntent(
  intent: AstroChatV2Intent
): V2ResponseSection[] {
  switch (intent) {
    case "suitability":
      return [
        "guidance",
        "suitability",
        "risks",
        "confidence",
        "evidence",
      ];

    case "decision":
      return [
        "guidance",
        "decision",
        "actions",
        "risks",
        "confidence",
        "evidence",
      ];

    case "timing":
      return [
        "guidance",
        "timing",
        "journey",
        "actions",
        "risks",
        "confidence",
        "evidence",
      ];

    case "strategy":
      return [
        "guidance",
        "decision",
        "actions",
        "risks",
        "confidence",
        "evidence",
      ];

    case "prediction":
      return [
        "guidance",
        "timing",
        "confidence",
        "evidence",
      ];

    default:
      return [
        "guidance",
        "confidence",
        "evidence",
      ];
  }
}

function buildEvidence(
  reasoning: BusinessReasoningResult
): V2EvidenceSection {
  const {
    base,
  } = reasoning;

  return {
    title:
      "What this is based on",

    layers: [
      base.layers.natal,
      base.layers.sambandha,
      base.layers.divisional,
      base.layers.dasha,
      base.layers.transit,
      base.layers.conversion,
    ].map(
      (layer) => ({
        key:
          layer.key,

        label:
          layer.label,

        strength:
          layer.strength,

        score:
          layer.score,

        verdict:
          layer.verdict,

        references:
          layer.references,
      })
    ),

    contradictions:
      base.contradictions,

    missing:
      base.evidence.missing,
  };
}

function buildSuitability(
  reasoning: BusinessReasoningResult
): V2SuitabilitySection | null {
  if (
    !reasoning.suitability
  ) {
    return null;
  }

  return {
    title:
      "Best-fit business directions",

    strongestModels:
      reasoning.suitability
        .strongestModels
        .map(
          (model) => ({
            label:
              model.label,

            reasons:
              model.reasons,
          })
        ),

    moderateModels:
      reasoning.suitability
        .moderateModels
        .map(
          (model) => ({
            label:
              model.label,

            reasons:
              model.reasons,
          })
        ),

    lowerFitModels:
      reasoning.suitability
        .lowerFitModels
        .map(
          (model) => ({
            label:
              model.label,

            reasons:
              model.reasons,
          })
        ),

    naturalRole:
      reasoning.suitability
        .naturalRole,

    operatingStyle:
      reasoning.suitability
        .operatingStyle,

    commercialStrengths:
      reasoning.suitability
        .commercialStrengths,

    commercialRisks:
      reasoning.suitability
        .commercialRisks,
  };
}

function buildDecision(
  reasoning: BusinessReasoningResult
): V2DecisionSection | null {
  if (
    !reasoning.decision
  ) {
    return null;
  }

  return {
    title:
      "Astrologer's decision",

    level:
      reasoning.decision
        .level,

    rationale:
      reasoning.decision
        .rationale,

    transitionAdvice:
      reasoning.decision
        .transitionAdvice,
  };
}

function buildTiming(
  reasoning: BusinessReasoningResult
): V2TimingSection | null {
  if (
    !reasoning.timing
  ) {
    return null;
  }

  return {
    title:
      "Most likely timing",

    primaryWindow:
      reasoning.timing
        .primaryWindow,

    preparation:
      reasoning.timing
        .preparationWindow,

    launch:
      reasoning.timing
        .launchWindow,

    commercialProof:
      reasoning.timing
        .commercialProofWindow,

    expansion:
      reasoning.timing
        .expansionWindow,

    verdict:
      reasoning.timing
        .timingVerdict,
  };
}

function buildActionPlan(
  reasoning: BusinessReasoningResult
): V2ActionPlan | null {
  if (
    !reasoning.decision
  ) {
    return null;
  }

  return {
    do:
      reasoning.decision
        .recommendedActions,

    avoid:
      reasoning.decision
        .avoidActions,
  };
}

function buildRisks(
  reasoning: BusinessReasoningResult
): AstroChatV2Response["risks"] {
  const suitabilityRisks =
    reasoning.suitability
      ?.commercialRisks ??
    [];

  const decisionRisks =
    reasoning.decision
      ?.avoidActions ??
    [];

  const items =
    Array.from(
      new Set([
        ...suitabilityRisks,
        ...decisionRisks,
      ])
    );

  if (
    items.length === 0
  ) {
    return null;
  }

  return {
    title:
      "Key risks to manage",

    items,
  };
}

function buildJourney(
  profileStages: Array<{
    key: string;
    label: string;
    examples: string[];
  }>
): V2JourneySection | null {
  if (
    profileStages.length === 0
  ) {
    return null;
  }

  return {
    title:
      "How the process may unfold",

    stages:
      profileStages,
  };
}

export function createBusinessV2ResponseContract(params: {
  classification: QuestionClassification;
  reasoning: BusinessReasoningResult;
  profileStages: Array<{
    key: string;
    label: string;
    examples: string[];
  }>;
  guidance: {
    short: string;
    full: string;
  };
}): AstroChatV2Response {
  const {
    classification,
    reasoning,
    profileStages,
    guidance,
  } = params;

  const allowedSections =
    getAllowedSectionsForIntent(
      classification.intent
    );

  const timing =
    allowedSections.includes(
      "timing"
    )
      ? buildTiming(
          reasoning
        )
      : null;

  const suitability =
    allowedSections.includes(
      "suitability"
    )
      ? buildSuitability(
          reasoning
        )
      : null;

  const decision =
    allowedSections.includes(
      "decision"
    )
      ? buildDecision(
          reasoning
        )
      : null;

  const journey =
    allowedSections.includes(
      "journey"
    )
      ? buildJourney(
          profileStages
        )
      : null;

  const actionPlan =
    allowedSections.includes(
      "actions"
    )
      ? buildActionPlan(
          reasoning
        )
      : null;

  const risks =
    allowedSections.includes(
      "risks"
    )
      ? buildRisks(
          reasoning
        )
      : null;

  return {
    version:
      "sarathi-astro-chat-v2",

    classification: {
      topic:
        classification.topic,

      intent:
        classification.intent,

      event:
        classification.event,

      confidence:
        classification.confidence,

      reasoningProfileKey:
        classification.reasoningProfileKey,
    },

    render: {
      sections:
        allowedSections,
    },

    guidance: {
      title:
        "Sārathi's Guidance",

      short:
        guidance.short,

      full:
        guidance.full,
    },

    timing,
    suitability,
    decision,
    journey,
    actionPlan,
    risks,

    confidence: {
      level:
        reasoning.base
          .confidence
          .level,

      score:
        reasoning.base
          .confidence
          .score,

      supporting:
        reasoning.base
          .confidence
          .supporting,

      limiting:
        reasoning.base
          .confidence
          .limiting,
    },

    evidence:
      buildEvidence(
        reasoning
      ),

    meta: {
      usedTiming:
        Boolean(timing),

      usedDecision:
        Boolean(decision),

      usedSuitability:
        Boolean(suitability),

      usedCurrentTransits:
        classification
          .requiresCurrentTransits,
    },
  };
}
