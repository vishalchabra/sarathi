import type { EventThemeId } from "../knowledge/eventThemes";

export type EventSpecificity = 2 | 3 | 4;

export type EventStage =
  | "emerging"
  | "developing"
  | "clarifying"
  | "coordinating"
  | "stabilizing"
  | "confirming"
  | "completing"
  | "delayed"
  | "resolving";
export type EventExpressionEvidence = {
  matchedPrimaryHouses: number[];
  matchedSupportingHouses: number[];

  primaryHouseScore?: number;
  supportingHouseScore?: number;
  evidenceScore?: number;

  primaryPlanetConfirmationCount?: number;
  planetConfirmationCount?: number;

  discriminatorPlanetMatches: string[];
  primaryDiscriminatorPlanetMatches: string[];

  discriminatorSourceMatches?: (
    | "lordship"
    | "natal_placement"
    | "dispositor"
  )[];

  matchedDiscriminatorEvidence?: {
    house: number;
    planet: string;
    source:
      | "lordship"
      | "natal_placement"
      | "dispositor";
    score: number;
  }[];

  transitDiscriminatorPlanetMatches: string[];

  matchedTransitDiscriminatorEvidence?: {
    planet: string;
    house: number;
    importance: number;
    polarity:
      | "supportive"
      | "challenging"
      | "mixed"
      | "neutral";
    source: string;
  }[];

  discriminatorConfidence?: number | null;
};
export interface EventExpressionDefinition {
  id: string;
  manifestationId: EventThemeId;
  label: string;
  specificity: EventSpecificity;
  requiresAdditionalEvidence: boolean;
}

export const MONEY_EVENT_EXPRESSIONS: EventExpressionDefinition[] = [
  // MONEY INFLOW
  {
    id: "general_receipt",
    manifestationId: "money_inflow",
    label: "General financial receipt",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "expected_receipt",
    manifestationId: "money_inflow",
    label: "Expected financial receipt",
    specificity: 3,
    requiresAdditionalEvidence: true,
  },
  {
    id: "earned_income",
    manifestationId: "money_inflow",
    label: "Earned or work-related income",
    specificity: 3,
    requiresAdditionalEvidence: true,
  },
  {
    id: "financial_gain",
    manifestationId: "money_inflow",
    label: "Financial gain",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "reimbursement_return",
    manifestationId: "money_inflow",
    label: "Reimbursement or returned money",
    specificity: 3,
    requiresAdditionalEvidence: true,
  },
  {
    id: "financial_support",
    manifestationId: "money_inflow",
    label: "Financial support or resources received",
    specificity: 3,
    requiresAdditionalEvidence: true,
  },

  // MONEY OUTFLOW
  {
    id: "general_expense",
    manifestationId: "money_outflow",
    label: "General payment or expense",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "financial_obligation",
    manifestationId: "money_outflow",
    label: "Financial obligation",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "increased_spending",
    manifestationId: "money_outflow",
    label: "Increased spending",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "unexpected_expense",
    manifestationId: "money_outflow",
    label: "Unexpected expense",
    specificity: 3,
    requiresAdditionalEvidence: true,
  },
  {
    id: "repayment",
    manifestationId: "money_outflow",
    label: "Repayment",
    specificity: 3,
    requiresAdditionalEvidence: true,
  },

  // MONEY PLANNING
  {
    id: "financial_review",
    manifestationId: "money_planning",
    label: "Financial review",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "budgeting",
    manifestationId: "money_planning",
    label: "Budgeting",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "allocation_decision",
    manifestationId: "money_planning",
    label: "Allocation decision",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "future_financial_planning",
    manifestationId: "money_planning",
    label: "Future financial planning",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },

  // MONEY ACCUMULATION
  {
    id: "saving",
    manifestationId: "money_accumulation",
    label: "Saving",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "building_reserves",
    manifestationId: "money_accumulation",
    label: "Building financial reserves",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "financial_security",
    manifestationId: "money_accumulation",
    label: "Improved financial security",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },

  // MONEY SETTLEMENT
  {
    id: "pending_financial_matter",
    manifestationId: "money_settlement",
    label: "Pending financial matter",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "dues_resolution",
    manifestationId: "money_settlement",
    label: "Resolution of dues",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "settlement_repayment",
    manifestationId: "money_settlement",
    label: "Repayment",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "settlement_reimbursement",
    manifestationId: "money_settlement",
    label: "Reimbursement",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "liability_resolution",
    manifestationId: "money_settlement",
    label: "Liability resolution",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
  {
    id: "financial_reconciliation",
    manifestationId: "money_settlement",
    label: "Financial reconciliation",
    specificity: 2,
    requiresAdditionalEvidence: false,
  },
];
export type MoneyEventExpressionResult = {
  expressionId: string;
  specificity: EventSpecificity;
  confidence: "baseline" | "supported";
  evidenceReason: string;
};

function hasHouse(
  houses: number[],
  house: number
): boolean {
  return houses.includes(house);
}

function hasPrimaryDiscriminatorConfirmation(
  evidence: EventExpressionEvidence
): boolean {
  return (
    evidence.primaryDiscriminatorPlanetMatches.length > 0
  );
}

function hasTransitDiscriminatorConfirmation(
  evidence: EventExpressionEvidence
): boolean {
  return (
    evidence.transitDiscriminatorPlanetMatches.length > 0
  );
}

function supportedResult(
  expressionId: string,
  specificity: EventSpecificity,
  evidenceReason: string
): MoneyEventExpressionResult {
  return {
    expressionId,
    specificity,
    confidence: "supported",
    evidenceReason,
  };
}

function baselineResult(
  expressionId: string,
  evidenceReason: string
): MoneyEventExpressionResult {
  return {
    expressionId,
    specificity: 2,
    confidence: "baseline",
    evidenceReason,
  };
}

export function resolveMoneyEventExpression(
  manifestationId: EventThemeId,
  evidence: EventExpressionEvidence
): MoneyEventExpressionResult | null {
  const primary = evidence.matchedPrimaryHouses;
  const supporting = evidence.matchedSupportingHouses;

  const hasStrongPlanetConfirmation =
    hasPrimaryDiscriminatorConfirmation(evidence) ||
    hasTransitDiscriminatorConfirmation(evidence);

  switch (manifestationId) {
    case "money_inflow": {
      /*
       * 10th-house support gives the inflow a legitimate
       * professional/work context.
       *
       * We deliberately stop at earned/work-related income.
       * This does NOT justify salary, bonus or commission.
       */
      if (
        hasHouse(supporting, 10) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "earned_income",
          3,
          "10th-house support with discriminator confirmation connects the financial inflow to professional activity."
        );
      }

      /*
       * 9th-house support can strengthen the interpretation
       * toward gain or constructive financial movement.
       *
       * It does NOT justify windfall, luck or bonus.
       */
      if (
        hasHouse(supporting, 9) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "financial_gain",
          2,
          "9th-house support with discriminator confirmation strengthens the financial-gain expression."
        );
      }

      /*
       * 5th-house support can also refine the manifestation
       * toward gain/resource improvement.
       *
       * We intentionally do NOT infer investment returns.
       */
      if (
        hasHouse(supporting, 5) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "financial_gain",
          2,
          "5th-house support with discriminator confirmation strengthens the financial-gain expression without assuming a specific source."
        );
      }

      return baselineResult(
        "general_receipt",
        "The evidence supports incoming money or financial gain, but not a more specific source."
      );
    }

    case "money_outflow": {
      if (
        hasHouse(supporting, 8) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "repayment",
          3,
          "8th-house support with discriminator confirmation connects the outflow with repayment or an existing financial obligation."
        );
      }

      if (
        hasHouse(supporting, 6) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "financial_obligation",
          2,
          "6th-house support with discriminator confirmation connects the outflow with a practical financial obligation."
        );
      }

      if (
        hasHouse(supporting, 12) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "increased_spending",
          2,
          "12th-house support with discriminator confirmation strengthens the expenditure theme."
        );
      }

      return baselineResult(
        "general_expense",
        "The evidence supports financial outflow, but not a more specific type of expense."
      );
    }

    case "money_planning": {
      if (
        hasHouse(supporting, 6) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "budgeting",
          2,
          "6th-house support with discriminator confirmation emphasizes planning around practical expenses or obligations."
        );
      }

      if (
        hasHouse(supporting, 10) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "allocation_decision",
          2,
          "10th-house support with discriminator confirmation emphasizes a practical financial allocation or decision."
        );
      }

      if (
        hasHouse(supporting, 11) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "future_financial_planning",
          2,
          "11th-house support with discriminator confirmation emphasizes planning for future financial objectives."
        );
      }

      return baselineResult(
        "financial_review",
        "The evidence supports financial planning or review without establishing a narrower context."
      );
    }

    case "money_accumulation": {
      if (
        hasHouse(supporting, 11) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "financial_security",
          2,
          "11th-house support with discriminator confirmation strengthens the theme of improving financial security."
        );
      }

      if (
        hasHouse(supporting, 5) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "saving",
          2,
          "5th-house support with discriminator confirmation supports constructive resource-building without assuming investment gains."
        );
      }

      if (
        hasHouse(supporting, 9) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "financial_security",
          2,
          "9th-house support with discriminator confirmation supports constructive longer-term financial stability."
        );
      }

      return baselineResult(
        "building_reserves",
        "The evidence supports accumulation or strengthening of resources without a more specific financial mechanism."
      );
    }

    case "money_settlement": {
      /*
       * Unlike the other money manifestations, houses 6 and 8
       * are PRIMARY houses for money_settlement. Therefore we
       * can use which primary house actually matched to refine
       * the expression.
       */
      if (
        hasHouse(primary, 8) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "liability_resolution",
          2,
          "8th-house primary evidence with discriminator confirmation emphasizes resolving an existing liability or financial matter."
        );
      }

      if (
        hasHouse(primary, 6) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "dues_resolution",
          2,
          "6th-house primary evidence with discriminator confirmation emphasizes resolving dues, repayment or an obligation."
        );
      }

      if (
        hasHouse(supporting, 12) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "liability_resolution",
          2,
          "12th-house support with discriminator confirmation strengthens the theme of settling an outstanding obligation."
        );
      }

      if (
        hasHouse(supporting, 11) &&
        hasStrongPlanetConfirmation
      ) {
        return supportedResult(
          "dues_resolution",
          2,
          "11th-house support with discriminator confirmation strengthens movement around an amount due or pending settlement."
        );
      }

      return baselineResult(
        "pending_financial_matter",
        "The evidence supports settlement of a pending financial matter without establishing its exact form."
      );
    }

    default:
      return null;
  }
}
export type ContextualEventDirection =
  | "complete"
  | "clarify"
  | "stabilize"
  | "transition"
  | "coordinate"
  | "develop";

export type EventStageResult = {
  stage: EventStage;
  sourceDirection: ContextualEventDirection;
};

export function resolveEventStage(
  direction: ContextualEventDirection
): EventStageResult {
  switch (direction) {
    case "complete":
      return {
        stage: "completing",
        sourceDirection: direction,
      };

    case "clarify":
      return {
        stage: "clarifying",
        sourceDirection: direction,
      };

    case "stabilize":
      return {
        stage: "stabilizing",
        sourceDirection: direction,
      };

    case "transition":
      return {
        stage: "developing",
        sourceDirection: direction,
      };

    case "coordinate":
      return {
        stage: "coordinating",
        sourceDirection: direction,
      };

    case "develop":
      return {
        stage: "developing",
        sourceDirection: direction,
      };
  }
}
export type EventExpressionNarrative = {
  prediction: string;
  action: string;
  caution: string;
};

export function composeMoneyEventExpressionNarrative(
  manifestationId: string,
  expression: MoneyEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): EventExpressionNarrative | null {
  const { expressionId } = expression;
  const { stage } = eventStage;

  if (
    manifestationId === "money_inflow" &&
    expressionId === "general_receipt"
  ) {
    switch (stage) {
      case "emerging":
      case "developing":
        return {
          prediction:
            "An incoming financial matter may begin showing movement today.",
          action:
            "Stay attentive to practical financial developments and respond where action is needed.",
          caution:
            "Avoid assuming that early movement means the matter is already settled.",
        };

      case "clarifying":
        return {
          prediction:
            "An incoming financial matter may become clearer today, particularly around what happens next.",
          action:
            "Use any new information to clarify the next practical step.",
          caution:
            "Avoid making financial assumptions before the details are clear.",
        };

      case "coordinating":
        return {
          prediction:
            "Progress around an incoming financial matter may depend on communication, coordination or a practical follow-up today.",
          action:
            "Follow up where necessary and make sure the practical details are aligned.",
          caution:
            "Avoid leaving an important financial matter dependent on unclear communication.",
        };

      case "stabilizing": {
  switch (padaExpressionMode.mode) {
    case "ownership":
      return {
        prediction:
          "An incoming financial matter may become more settled today as you take greater ownership of the practical steps around it.",
        action:
          "Take responsibility for the financial step that is within your control and move it forward deliberately.",
        caution:
          "Avoid taking on obligations that are not necessary simply to force the matter toward completion.",
      };

    case "adjustment":
      return {
        prediction:
          "An incoming financial matter may become more settled through a practical adjustment or restructuring of what is already in progress.",
        action:
          "Review what needs to be adjusted, reorganised or handled differently to support further financial progress.",
        caution:
          "Avoid holding rigidly to an arrangement that may work better with a practical change.",
      };

    default:
      return {
        prediction:
          "An incoming financial matter may move toward a more settled or dependable position today.",
        action:
          "Focus on the practical steps that help secure or organise the financial progress already developing.",
        caution:
          "Avoid treating progress as final until the practical details are settled.",
      };
  }
}
      case "confirming":
        return {
          prediction:
            "An incoming financial matter may move closer to confirmation today.",
          action:
            "Check the relevant details and complete any practical follow-up required from your side.",
          caution:
            "Avoid counting on the outcome before it is formally confirmed.",
        };

      case "completing":
        return {
          prediction:
            "An incoming financial matter may move closer to completion or receipt today.",
          action:
            "Complete any remaining practical step that could help the matter conclude smoothly.",
          caution:
            "Avoid creating unnecessary complications around a matter that is already moving toward closure.",
        };

      case "delayed":
        return {
          prediction:
            "An incoming financial matter may progress more slowly than expected today.",
          action:
            "Use the time to check what remains pending and follow up where appropriate.",
          caution:
            "Avoid interpreting a delay as a definite negative outcome.",
        };

      case "resolving":
        return {
          prediction:
            "An incoming financial matter may begin resolving after a period of uncertainty or delay.",
          action:
            "Address the remaining practical issue and allow the matter to move toward resolution.",
          caution:
            "Avoid reopening issues that are already beginning to settle.",
        };
    }
  }

  return null;
}
export type PadaExpressionMode =
  | "initiative"
  | "ownership"
  | "organisation"
  | "coordination"
  | "adjustment"
  | "analysis"
  | "communication"
  | "persistence"
  | "stability"
  | "growth"
  | "creation"
  | "transition"
  | "closure"
  | "reflection"
  | "support"
  | "guidance"
  | "general";

export type PadaExpressionModeResult = {
  mode: PadaExpressionMode;
  matchedTheme: string | null;
};
export function resolvePadaExpressionMode(
  interpretiveThemes: string[]
): PadaExpressionModeResult {
  const classifyTheme = (
    rawTheme: string
  ): PadaExpressionMode | null => {
    const theme = rawTheme.trim().toLowerCase();

    const hasAny = (...keywords: string[]) =>
      keywords.some((keyword) => theme.includes(keyword));

    if (
      hasAny(
        "completion",
        "closure",
        "release",
        "letting go",
        "resolution"
      )
    ) {
      return "closure";
    }

    if (
      hasAny(
        "restructuring",
        "adjustment",
        "rebuilding",
        "improvement",
        "adaptability",
        "innovation",
        "breaking patterns"
      )
    ) {
      return "adjustment";
    }

    if (
      hasAny(
        "authority",
        "leadership",
        "responsibility",
        "managing obligations",
        "commitment"
      )
    ) {
      return "ownership";
    }

    if (
      hasAny(
        "initiative",
        "starting",
        "new beginning",
        "purposeful action",
        "practical action",
        "taking matters in hand",
        "momentum"
      )
    ) {
      return "initiative";
    }

    if (
      hasAny(
        "organisation",
        "organization",
        "attention to detail",
        "structure",
        "discipline",
        "refinement",
        "productivity"
      )
    ) {
      return "organisation";
    }

    if (
      hasAny(
        "cooperation",
        "balance",
        "negotiation",
        "agreement",
        "fairness",
        "shared",
        "relationship",
        "harmony"
      )
    ) {
      return "coordination";
    }

    if (
      hasAny(
        "analysis",
        "investigation",
        "discernment",
        "reassessment",
        "objectivity",
        "details",
        "inquiry",
        "discovery"
      )
    ) {
      return "analysis";
    }

    if (
      hasAny(
        "communication",
        "dialogue",
        "exchange",
        "information",
        "ideas",
        "learning",
        "understanding"
      )
    ) {
      return "communication";
    }

    if (
      hasAny(
        "resilience",
        "endurance",
        "persistence",
        "emotional strength",
        "steady progress"
      )
    ) {
      return "persistence";
    }

    if (
      hasAny(
        "stability",
        "security",
        "consolidation",
        "preservation",
        "reliability",
        "resources"
      )
    ) {
      return "stability";
    }
    if (
  hasAny(
    "creativity",
    "creation",
    "creative expression"
  )
) {
  return "creation";
}
    if (
      hasAny(
        "growth",
        "development",
        "creating momentum",
        "tangible results"
      )
    ) {
      return "growth";
    }

    if (
      hasAny(
        "transition",
        "transformation",
        "change",
        "renewal",
        "new direction"
      )
    ) {
      return "transition";
    }

    if (
      hasAny(
        "reflection",
        "perspective",
        "introspection",
        "emotional processing",
        "emotional insight"
      )
    ) {
      return "reflection";
    }

    if (
      hasAny(
        "support",
        "care",
        "protection",
        "nurturing",
        "compassion"
      )
    ) {
      return "support";
    }

    if (
      hasAny(
        "guidance",
        "purpose",
        "direction",
        "meaning",
        "wisdom"
      )
    ) {
      return "guidance";
    }

    return null;
  };

  for (const theme of interpretiveThemes) {
    const mode = classifyTheme(theme);

    if (mode) {
      return {
        mode,
        matchedTheme: theme,
      };
    }
  }

  return {
    mode: "general",
    matchedTheme: interpretiveThemes[0] ?? null,
  };
}
export type EventStageLanguage = {
  development: string;
};

export type PadaModeLanguage = {
  mechanism: string;
};

export function getEventStageLanguage(
  stage: EventStage
): EventStageLanguage {
  switch (stage) {
    case "emerging":
      return {
        development: "may begin showing movement",
      };

    case "developing":
      return {
        development: "may continue developing",
      };

    case "clarifying":
      return {
        development: "may become clearer",
      };

    case "coordinating":
      return {
        development: "may progress through coordination",
      };

    case "stabilizing":
      return {
        development: "may move toward a more settled position",
      };

    case "confirming":
      return {
        development: "may move closer to confirmation",
      };

    case "completing":
      return {
        development: "may move closer to completion",
      };

    case "delayed":
      return {
        development: "may progress more slowly than expected",
      };

    case "resolving":
      return {
        development: "may begin moving toward resolution",
      };
  }
}

export function getPadaModeLanguage(
  mode: PadaExpressionMode
): PadaModeLanguage {
  switch (mode) {
    case "initiative":
      return {
        mechanism: "a practical step or initiative",
      };

    case "ownership":
      return {
        mechanism: "greater ownership of what is within your control",
      };

    case "organisation":
      return {
        mechanism: "better organisation and attention to practical details",
      };

    case "coordination":
      return {
        mechanism: "cooperation, alignment or practical coordination",
      };

    case "adjustment":
      return {
        mechanism: "an adjustment to what is already in progress",
      };

    case "analysis":
      return {
        mechanism: "closer examination of the relevant details",
      };

    case "communication":
      return {
        mechanism: "clearer communication or exchange of information",
      };

    case "persistence":
      return {
        mechanism: "steady effort and persistence",
      };

    case "stability":
      return {
        mechanism: "protecting what is already working and keeping the situation steady",
      };

    case "growth":
      return {
        mechanism: "constructive development of what is already underway",
      };

    case "creation":
      return {
        mechanism: "a constructive or creative approach",
      };

    case "transition":
      return {
        mechanism: "adapting to a changing situation",
      };

    case "closure":
      return {
        mechanism: "completing or releasing what no longer needs to remain pending",
      };

    case "reflection":
      return {
        mechanism: "reflection before taking the next step",
      };

    case "support":
      return {
        mechanism: "practical support, care or cooperation",
      };

    case "guidance":
      return {
        mechanism: "clearer direction or useful guidance",
      };

    case "general":
      return {
        mechanism: "practical attention to the matter",
      };
  }
}
export type ComposedEventNarrativeV2 = {
  prediction: string;
  action: string;
  caution: string;
  eventText: string;
  stageText: string;
  modeText: string;
};
export type EventGuidanceContext = {
  subject: string;
  actionObject: string;
};
function getMoneyGuidanceContext(
  expressionId: string
): EventGuidanceContext | null {
  switch (expressionId) {
    case "general_receipt":
      return {
        subject: "the incoming financial matter",
        actionObject: "the financial step",
      };

    case "expected_receipt":
      return {
        subject: "the expected financial receipt",
        actionObject: "the practical step connected with the expected receipt",
      };

    case "earned_income":
      return {
        subject: "the work-related income matter",
        actionObject: "the practical step connected with the income",
      };

    case "financial_gain":
      return {
        subject: "the financial opportunity",
        actionObject: "the practical financial step",
      };

    case "reimbursement_return":
      return {
        subject: "the reimbursement or return",
        actionObject: "the practical follow-up connected with the return",
      };

    case "financial_support":
      return {
        subject: "the financial support",
        actionObject: "the practical step connected with the support",
      };

    default:
      return null;
  }
}
export function contextualizePadaGuidance(
  mode: PadaExpressionMode,
  context: EventGuidanceContext
): PadaGuidanceLanguage {
  switch (mode) {
    case "ownership":
      return {
        action:
          `Take responsibility for ${context.actionObject} that genuinely requires your attention.`,
        caution:
          `Avoid taking on more responsibility for ${context.subject} than the situation actually requires.`,
      };

    case "adjustment":
      return {
        action:
          `Review what needs to be adjusted around ${context.subject} to support further progress.`,
        caution:
          `Avoid changing more around ${context.subject} than the situation actually requires.`,
      };

    default:
      return getPadaGuidanceLanguage(mode);
  }
}
export function realizePrediction(
  eventText: string,
  stage: EventStage,
  mode: PadaExpressionMode
): string {
// Reinforcing completion signals.
if (stage === "completing" && mode === "closure") {
  return (
    `${eventText} may move closer to resolution today, ` +
    `particularly if any remaining practical steps are completed.`
  );
}

// Clarification supported by investigation or analysis.
if (stage === "clarifying" && mode === "analysis") {
  return `${eventText} may become easier to understand today as relevant details are examined more closely.`;
}
if (stage === "developing") {
  switch (mode) {
    case "initiative":
      return `${eventText} may begin showing movement today, with a practical step or initiative helping move the situation forward.`;

    case "adjustment":
      return `${eventText} may continue developing today as an existing arrangement or process is adjusted.`;

    case "communication":
      return `${eventText} may continue developing today through an important conversation, update or exchange of information.`;

    case "coordination":
      return `${eventText} may continue developing today as the relevant people or practical steps become better aligned.`;

    case "analysis":
      return `${eventText} may continue developing today as important details are examined more closely.`;

    case "persistence":
      return `${eventText} may continue developing today through steady follow-through rather than immediate results.`;

    case "transition":
      return `${eventText} may continue developing today as the situation moves into its next phase.`;

    case "closure":
      return `${eventText} may continue developing today as an earlier pending step moves toward completion.`;

    default:
      break;
  }
}
  if (stage === "stabilizing") {
    switch (mode) {
      case "ownership":
        return `${eventText} may become more settled today as you take responsibility for the practical steps within your control.`;

      case "adjustment":
        return `${eventText} may become more settled today if an existing arrangement or process is adjusted.`;

      case "organisation":
        return `${eventText} may become more settled today as the practical details become better organised.`;

      case "coordination":
        return `${eventText} may become more settled today through better coordination or alignment.`;

      case "communication":
        return `${eventText} may become more settled today as important information becomes clearer or is communicated more effectively.`;

      case "analysis":
        return `${eventText} may become more settled today after the relevant details are examined more closely.`;

      case "persistence":
        return `${eventText} may become more settled today through steady follow-through rather than immediate action.`;

      case "stability":
        return `${eventText} may become more settled today by protecting what is already working.`;

      case "growth":
        return `${eventText} may become more settled today as existing progress develops further.`;

      case "creation":
        return `${eventText} may become more settled today through a constructive alternative or new approach.`;

      case "transition":
        return `${eventText} may become more settled today as you adapt to a change already underway.`;

      case "closure":
        return `${eventText} may become more settled today as a pending step moves toward completion.`;

      case "reflection":
        return `${eventText} may become more settled today after you take time to assess the situation clearly.`;

      case "support":
        return `${eventText} may become more settled today with practical support or cooperation.`;

      case "guidance":
        return `${eventText} may become more settled today as the right direction or next step becomes clearer.`;

      case "initiative":
        return `${eventText} may become more settled today after a practical step is taken.`;

      case "general":
        break;
    }
  }

  const stageLanguage = getEventStageLanguage(stage);
  const modeLanguage = getPadaModeLanguage(mode);

  return (
    `${eventText} ${stageLanguage.development} today, ` +
    `particularly through ${modeLanguage.mechanism}.`
  );
}
function getMoneyEventText(
  expressionId: string
): string | null {
  switch (expressionId) {
    case "general_receipt":
      return "An incoming financial matter";

    case "expected_receipt":
      return "An expected financial receipt";

    case "earned_income":
      return "Income connected with your work or efforts";

    case "financial_gain":
      return "A financial gain";

    case "reimbursement_return":
      return "Money being returned or reimbursed";

    case "financial_support":
      return "Financial support or resources coming toward you";

    default:
      return null;
  }
}

export function composeMoneyPredictionV2(
  expression: MoneyEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): ComposedEventNarrativeV2 | null {
  const eventText = getMoneyEventText(expression.expressionId);

  if (!eventText) {
    return null;
  }

  const stageLanguage = getEventStageLanguage(eventStage.stage);
  const modeLanguage = getPadaModeLanguage(
    padaExpressionMode.mode
  );
const guidanceContext = getMoneyGuidanceContext(
  expression.expressionId
);

const guidanceLanguage = guidanceContext
  ? contextualizePadaGuidance(
      padaExpressionMode.mode,
      guidanceContext
    )
  : getPadaGuidanceLanguage(padaExpressionMode.mode);
  const prediction = realizePrediction(
  eventText,
  eventStage.stage,
  padaExpressionMode.mode
);

 return {
  prediction,
  action: guidanceLanguage.action,
  caution: guidanceLanguage.caution,
  eventText,
  stageText: stageLanguage.development,
  modeText: `particularly through ${modeLanguage.mechanism}`,
};
}
export type PadaGuidanceLanguage = {
  action: string;
  caution: string;
};

export function getPadaGuidanceLanguage(
  mode: PadaExpressionMode
): PadaGuidanceLanguage {
  switch (mode) {
    case "initiative":
      return {
        action:
          "Take the practical step that is within your control and move it forward deliberately.",
        caution:
          "Avoid acting so quickly that important details are overlooked.",
      };

    case "ownership":
      return {
        action:
          "Take responsibility for the part that genuinely requires your attention.",
        caution:
          "Avoid taking on more responsibility than the situation actually requires.",
      };

    case "organisation":
      return {
        action:
          "Organise the practical details and bring greater structure to what needs attention.",
        caution:
          "Avoid getting so focused on perfecting the details that progress slows down.",
      };

    case "coordination":
      return {
        action:
          "Align the relevant people, information or practical steps before moving ahead.",
        caution:
          "Avoid assuming everyone involved is working from the same understanding.",
      };

    case "adjustment":
      return {
        action:
          "Review what needs to be adjusted or handled differently to support progress.",
        caution:
          "Avoid resisting a useful change or altering more than the situation requires.",
      };

    case "analysis":
      return {
        action:
          "Examine the relevant details carefully before deciding the next step.",
        caution:
          "Avoid overanalysing the situation once the important facts are clear.",
      };

    case "communication":
      return {
        action:
          "Clarify the important information and communicate what needs to be understood.",
        caution:
          "Avoid leaving important details open to assumption or misunderstanding.",
      };

    case "persistence":
      return {
        action:
          "Keep steady effort on the matter rather than expecting immediate movement.",
        caution:
          "Avoid forcing progress simply because the situation is taking time.",
      };

    case "stability":
      return {
        action:
          "Protect what is already working and strengthen the practical foundations around it.",
        caution:
          "Avoid unnecessary changes that could disturb a situation that is becoming steadier.",
      };

    case "growth":
      return {
        action:
          "Build constructively on the progress that is already beginning to develop.",
        caution:
          "Avoid expanding faster than the practical situation can support.",
      };

    case "creation":
      return {
        action:
          "Use a constructive approach and consider a practical alternative where it adds value.",
        caution:
          "Avoid choosing novelty simply for the sake of doing something differently.",
      };

    case "transition":
      return {
        action:
          "Adapt to what is changing and focus on the next workable step.",
        caution:
          "Avoid holding too tightly to an approach that the situation is already moving beyond.",
      };

    case "closure":
      return {
        action:
          "Complete what genuinely needs finishing and clear any remaining practical loose ends.",
        caution:
          "Avoid reopening something that is already moving toward resolution.",
      };

    case "reflection":
      return {
        action:
          "Give yourself enough perspective to understand the situation before responding.",
        caution:
          "Avoid remaining in reflection when the next practical step has already become clear.",
      };

    case "support":
      return {
        action:
          "Use the support available and offer practical cooperation where it helps the situation.",
        caution:
          "Avoid carrying the entire matter yourself when appropriate support is available.",
      };

    case "guidance":
      return {
        action:
          "Use the clearest available direction to decide the next practical step.",
        caution:
          "Avoid following advice without considering whether it fits the actual situation.",
      };

    case "general":
      return {
        action:
          "Give practical attention to the matter and respond to what genuinely requires action.",
        caution:
          "Avoid making assumptions before the situation becomes sufficiently clear.",
      };
  }
}
export type EducationEventExpressionResult = {
  expressionId:
    | "general_learning_progress"
    | "learning_achievement"
    | "general_learning_challenge"
    | "additional_learning_effort"
    | "general_learning_focus";
  specificity: 2 | 3;
  confidence: "baseline" | "supported";
  evidenceReason: string;
};

export function resolveEducationEventExpression(
  manifestationId: string,
  _matchedSupportingHouses: number[],
  _discriminatorPlanetMatches: string[]
): EducationEventExpressionResult | null {
  if (manifestationId === "education_focus") {
  return {
    expressionId: "general_learning_focus",
    specificity: 2,
    confidence: "baseline",
    evidenceReason:
      "Attention to learning or study is indicated without evidence for a specific educational outcome.",
  };
}
  if (manifestationId === "education_progress") {
    return {
      expressionId: "general_learning_progress",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "Educational progress is supported, but no specific educational milestone has been established.",
    };
  }

  if (manifestationId === "education_challenge") {
    return {
      expressionId: "general_learning_challenge",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "An educational challenge is supported without sufficient evidence for a more specific subtype.",
    };
  }

  return null;
}
export function composeEducationPredictionV2(
  expression: EducationEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const eventSubjects: Record<
    EducationEventExpressionResult["expressionId"],
    string
  > = {
    general_learning_focus:
  "A matter requiring attention to learning or study",
    general_learning_progress: "Progress in a learning-related matter",
    learning_achievement: "An educational achievement or milestone",
    general_learning_challenge: "An education-related difficulty",
    additional_learning_effort: "A learning-related task requiring additional effort",
  };

  return realizePrediction(
    eventSubjects[expression.expressionId],
    eventStage.stage,
    padaExpressionMode.mode
  );
}
export type CareerEventExpressionResult = {
  expressionId:
    | "general_career_movement"
    | "general_career_responsibility"
    | "general_career_recognition"
    | "general_career_change"
    | "general_workload_demand";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveCareerEventExpression(
  manifestationId: string
): CareerEventExpressionResult | null {
  const expressions: Record<
    CareerEventExpressionResult["expressionId"],
    string
  > = {
    general_career_movement:
      "Professional movement is indicated without evidence for a specific role or employer change.",

    general_career_responsibility:
      "Professional responsibilities are indicated without evidence for a specific new assignment.",

    general_career_recognition:
      "Professional visibility or acknowledgement is indicated without evidence for a promotion or award.",

    general_career_change:
      "A change in professional circumstances is indicated without confirmation of a specific transition.",

    general_workload_demand:
      "Work-related demands are indicated without evidence for a specific task or incident.",
  };

  const manifestationToExpression: Record<
    string,
    CareerEventExpressionResult["expressionId"]
  > = {
    career_movement: "general_career_movement",
    career_responsibility: "general_career_responsibility",
    career_recognition: "general_career_recognition",
    career_change: "general_career_change",
    workload_service: "general_workload_demand",
  };

  const expressionId =
    manifestationToExpression[manifestationId];

  if (!expressionId) {
    return null;
  }

  return {
    expressionId,
    specificity: 2,
    confidence: "baseline",
    evidenceReason: expressions[expressionId],
  };
}
export function composeCareerPredictionV2(
  expression: CareerEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const eventSubjects: Record<
    CareerEventExpressionResult["expressionId"],
    string
  > = {
    general_career_movement:
      "A matter involving your professional direction",

    general_career_responsibility:
      "A matter involving your professional responsibilities",

    general_career_recognition:
      "A matter involving professional visibility or acknowledgement",

    general_career_change:
      "A potential change in your working circumstances",

    general_workload_demand:
      "A matter involving your daily workload",
  };

  return realizePrediction(
    eventSubjects[expression.expressionId],
    eventStage.stage,
    padaExpressionMode.mode
  );
}
export type MindEventExpressionResult = {
  expressionId:
    | "general_mental_pressure"
    | "general_emotional_grounding";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveMindEventExpression(
  manifestationId: string
): MindEventExpressionResult | null {
  if (manifestationId === "mental_pressure") {
    return {
      expressionId: "general_mental_pressure",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "Attention to mental load or internal pressure is indicated without evidence for a specific cause or outcome.",
    };
  }

  if (manifestationId === "emotional_stability") {
    return {
      expressionId: "general_emotional_grounding",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "Attention to emotional grounding is indicated without establishing a specific emotional outcome.",
    };
  }

  return null;
}
export function composeMindPredictionV2(
  expression: MindEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const isPressure =
    expression.expressionId === "general_mental_pressure";

  const subject = isPressure
    ? "Competing demands or mental pressure"
    : "Your sense of emotional balance";

  const mode = padaExpressionMode.mode;

  switch (eventStage.stage) {
    case "clarifying":
      if (mode === "analysis") {
        return isPressure
          ? `${subject} may feel easier to understand as you identify which concerns need attention.`
          : `${subject} may benefit from reflecting on what helps you feel grounded.`;
      }

      if (mode === "communication") {
        return `${subject} may benefit from an open and thoughtful conversation today.`;
      }

      return `${subject} may become easier to navigate as your priorities become clearer.`;

    case "stabilizing":
      if (mode === "adjustment") {
        return isPressure
          ? `${subject} may become more manageable if you adjust your pace or priorities.`
          : `${subject} may benefit from small adjustments to your routine.`;
      }

      if (mode === "analysis") {
        return `${subject} may benefit from distinguishing immediate concerns from matters that can wait.`;
      }

      return `${subject} may benefit from a steady approach and manageable expectations today.`;

    case "developing":
      if (mode === "initiative") {
        return isPressure
          ? `${subject} may call for one manageable step rather than trying to address everything at once.`
          : `${subject} may benefit from taking a small, constructive step toward greater calm.`;
      }

      if (mode === "adjustment") {
        return `${subject} may benefit from reconsidering an existing habit or expectation.`;
      }

      return `${subject} may call for patience as you work through your priorities.`;

    default:
      return isPressure
        ? `${subject} may deserve attention today. Give yourself room to prioritise what matters.`
        : `${subject} may benefit from a little time for reflection and grounding today.`;
  }
}
export type HomeEventExpressionResult = {
  expressionId:
    | "general_home_change"
    | "general_home_attention"
    | "general_home_stability";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveHomeEventExpression(
  manifestationId: string
): HomeEventExpressionResult | null {
  switch (manifestationId) {
    case "home_change":
      return {
        expressionId: "general_home_change",
        specificity: 2,
        confidence: "baseline",
        evidenceReason:
          "A home-related adjustment or decision is indicated without evidence of relocation or a property transaction.",
      };

    case "home_attention":
      return {
        expressionId: "general_home_attention",
        specificity: 2,
        confidence: "baseline",
        evidenceReason:
          "Attention to a domestic matter is indicated without identifying a specific task or incident.",
      };

    case "home_stability":
      return {
        expressionId: "general_home_stability",
        specificity: 2,
        confidence: "baseline",
        evidenceReason:
          "A theme of domestic stability or comfort is indicated without establishing a specific outcome.",
      };

    default:
      return null;
  }
}
export function composeHomePredictionV2(
  expression: HomeEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const subjects: Record<
    HomeEventExpressionResult["expressionId"],
    string
  > = {
    general_home_change:
      "A possible adjustment involving your home or living arrangements",
    general_home_attention:
      "A domestic matter requiring your attention",
    general_home_stability:
      "A matter involving comfort or stability at home",
  };

  const subject = subjects[expression.expressionId];
  const mode = padaExpressionMode.mode;

  if (
  expression.expressionId === "general_home_attention" &&
  eventStage.stage === "developing" &&
  !["initiative", "communication", "adjustment"].includes(mode)
) {
  return "A domestic matter may need your attention over time rather than an immediate decision.";
}

if (
  expression.expressionId === "general_home_stability" &&
  eventStage.stage === "completing"
) {
  return mode === "analysis"
    ? "An existing matter affecting comfort at home may benefit from reviewing the remaining details."
    : "An existing matter affecting comfort at home may benefit from bringing outstanding practical details together.";
}
  switch (eventStage.stage) {
    case "clarifying":
      if (mode === "analysis") {
        return `${subject} may become clearer as you examine the practical details.`;
      }

      if (mode === "communication") {
        return `${subject} may become clearer through a conversation or exchange of information.`;
      }

      if (mode === "adjustment") {
        return `${subject} may become clearer as you consider what needs adjusting.`;
      }

      return `${subject} may become easier to understand as the next steps become clearer.`;

    case "stabilizing":
      if (mode === "organisation") {
        return `${subject} may benefit from organising practical arrangements.`;
      }

      if (mode === "coordination") {
        return `${subject} may benefit from better coordination with those involved.`;
      }

      if (mode === "adjustment") {
        return `${subject} may benefit from a small, practical adjustment.`;
      }

      return `${subject} may benefit from a steady, practical approach today.`;

    case "developing":
      if (mode === "initiative") {
        return `${subject} may call for a practical first step today.`;
      }

      if (mode === "communication") {
        return `${subject} may develop through a conversation or useful update.`;
      }

      if (mode === "adjustment") {
        return `${subject} may develop as an existing arrangement is reconsidered.`;
      }

      return `${subject} may require gradual attention rather than an immediate decision.`;

    case "coordinating":
      return `${subject} may benefit from aligning expectations and practical arrangements with others.`;

    case "completing":
      return `${subject} may move closer to resolution as remaining practical details are addressed.`;

    case "resolving":
      return `${subject} may become easier to manage as outstanding concerns are addressed.`;

    case "delayed":
      return `${subject} may require patience while pending details are clarified.`;

    case "confirming":
      return `${subject} may call for checking the details before proceeding.`;

    case "emerging":
      return `${subject} may begin drawing more of your attention today.`;

    default:
      return `${subject} may deserve some practical attention today.`;
  }
}
export type FamilyEventExpressionResult = {
  expressionId:
    | "general_family_responsibility"
    | "general_family_support"
    | "general_family_discussion"
    | "general_family_tension";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveFamilyEventExpression(
  manifestationId: string
): FamilyEventExpressionResult | null {
  switch (manifestationId) {
    case "family_responsibility":
      return {
        expressionId: "general_family_responsibility",
        specificity: 2,
        confidence: "baseline",
        evidenceReason:
          "Family responsibilities or practical involvement are indicated without identifying a specific obligation or event.",
      };

    case "family_support":
      return {
        expressionId: "general_family_support",
        specificity: 2,
        confidence: "baseline",
        evidenceReason:
          "A family-related theme of support or cooperation is indicated without establishing a particular source or outcome.",
      };

    case "family_discussion":
      return {
        expressionId: "general_family_discussion",
        specificity: 2,
        confidence: "baseline",
        evidenceReason:
          "A family-related discussion or clarification is indicated without establishing its subject or result.",
      };

    case "family_tension":
      return {
        expressionId: "general_family_tension",
        specificity: 2,
        confidence: "baseline",
        evidenceReason:
          "A theme of family pressure or differing expectations is indicated without evidence of a specific conflict.",
      };

    default:
      return null;
  }
}
export function composeFamilyPredictionV2(
  expression: FamilyEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const subjects: Record<
    FamilyEventExpressionResult["expressionId"],
    string
  > = {
    general_family_responsibility:
      "A responsibility involving family",
    general_family_support:
      "An opportunity for support or cooperation within the family",
    general_family_discussion:
      "A matter requiring discussion within the family",
    general_family_tension:
      "A family matter involving differing needs or expectations",
  };

  const subject = subjects[expression.expressionId];
  const mode = padaExpressionMode.mode;
  if (
  expression.expressionId === "general_family_tension" &&
  eventStage.stage === "clarifying" &&
  !["communication", "analysis", "reflection"].includes(mode)
) {
  return "Differences in family expectations may become easier to understand as the underlying concerns become clearer.";
}
  switch (eventStage.stage) {
    case "clarifying":
      if (mode === "communication") {
        return `${subject} may become clearer through an open exchange of information.`;
      }
      if (mode === "analysis") {
        return `${subject} may benefit from examining the practical details before drawing conclusions.`;
      }
      if (mode === "reflection") {
        return `${subject} may become easier to understand after some reflection.`;
      }
      return `${subject} may become clearer as expectations are better understood.`;

    case "stabilizing":
      if (mode === "coordination") {
        return `${subject} may benefit from coordinating expectations with those involved.`;
      }
      if (mode === "adjustment") {
        return `${subject} may become easier to manage through a small adjustment in approach.`;
      }
      if (mode === "support") {
        return `${subject} may benefit from practical cooperation and mutual understanding.`;
      }
      return `${subject} may benefit from a steady and considerate approach.`;

    case "developing":
      if (mode === "initiative") {
        return `${subject} may call for a constructive first step today.`;
      }
      if (mode === "communication") {
        return `${subject} may develop through a conversation or exchange of information.`;
      }
      if (mode === "adjustment") {
        return `${subject} may benefit from reconsidering an existing expectation.`;
      }
      return `${subject} may require gradual attention rather than an immediate decision.`;

    case "coordinating":
      if (mode === "communication") {
        return `${subject} may benefit from clearer communication among those involved.`;
      }
      return `${subject} may benefit from aligning practical expectations with others.`;

    case "completing":
      return `${subject} may move toward a more settled position as remaining details are addressed.`;

    case "resolving":
      return `${subject} may become easier to handle through patience and constructive understanding.`;

    case "delayed":
      return `${subject} may require patience while expectations or practical details are clarified.`;

    case "confirming":
      return `${subject} may benefit from confirming the details before proceeding.`;

    case "emerging":
      return `${subject} may begin drawing more attention today.`;

    default:
      return `${subject} may deserve thoughtful attention today.`;
  }
}
export type HealthEventExpressionResult = {
  expressionId: "general_health_attention";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveHealthEventExpression(
  manifestationId: string
): HealthEventExpressionResult | null {
  if (manifestationId !== "health_attention") {
    return null;
  }

  return {
    expressionId: "general_health_attention",
    specificity: 2,
    confidence: "baseline",
    evidenceReason:
      "Attention to general wellbeing or physical routines is indicated without evidence of a specific medical condition, symptom, or outcome.",
  };
}
export function composeHealthPredictionV2(
  expression: HealthEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const subject = "Your physical wellbeing and daily routine";
  const mode = padaExpressionMode.mode;

  switch (eventStage.stage) {
    case "clarifying":
      if (mode === "analysis" || mode === "reflection") {
        return `${subject} may benefit from reviewing which habits are working well for you.`;
      }
      if (mode === "communication") {
        return `${subject} may benefit from clarifying any practical questions about your routine.`;
      }
      return `${subject} may deserve a closer look as you consider your daily priorities.`;

    case "stabilizing":
      if (mode === "adjustment") {
        return `${subject} may benefit from a small, manageable adjustment.`;
      }
      if (mode === "organisation") {
        return `${subject} may benefit from a more consistent daily schedule.`;
      }
      return `${subject} may benefit from maintaining a steady, manageable pace.`;

    case "developing":
      if (mode === "initiative") {
        return `${subject} may benefit from taking one practical step toward a sustainable habit.`;
      }
      if (mode === "persistence") {
        return `${subject} may benefit from consistency rather than sudden changes.`;
      }
      return `${subject} may deserve gradual attention rather than an immediate overhaul.`;

    case "coordinating":
      return `${subject} may benefit from balancing different commitments and allowing time for basic self-care.`;

    case "completing":
      return `${subject} may benefit from following through on an existing wellbeing routine.`;

    case "resolving":
      return `${subject} may benefit from a measured approach to your usual activities.`;

    case "delayed":
      return `${subject} may benefit from patience and realistic expectations about your routine.`;

    case "confirming":
      return `${subject} may benefit from reviewing your existing routine before making changes.`;

    case "emerging":
      return `${subject} may deserve some additional attention today.`;

    default:
      return `${subject} may benefit from thoughtful, practical attention today.`;
  }
}
export type RelationshipEventExpressionResult = {
  expressionId:
    | "general_relationship_attention"
    | "general_relationship_harmony"
    | "general_relationship_discussion"
    | "general_relationship_tension"
    | "general_relationship_commitment";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveRelationshipEventExpression(
  manifestationId: string
): RelationshipEventExpressionResult | null {
  const expressions: Record<
    string,
    RelationshipEventExpressionResult
  > = {
    relationship_attention: {
      expressionId: "general_relationship_attention",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "An important relationship or one-to-one interaction may require attention, without evidence of a more specific event.",
    },

    relationship_harmony: {
      expressionId: "general_relationship_harmony",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports a theme of warmth or cooperation without establishing a specific relationship outcome.",
    },

    relationship_discussion: {
      expressionId: "general_relationship_discussion",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports relationship communication without establishing a specific conversation or decision.",
    },

    relationship_tension: {
      expressionId: "general_relationship_tension",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports possible differences or friction without establishing an argument, separation, or other specific event.",
    },

    relationship_commitment: {
      expressionId: "general_relationship_commitment",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports consideration of seriousness or shared expectations without establishing a formal commitment.",
    },
  };

  return expressions[manifestationId] ?? null;
}
export function composeRelationshipPredictionV2(
  expression: RelationshipEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const subjects: Record<
    RelationshipEventExpressionResult["expressionId"],
    string
  > = {
    general_relationship_attention:
      "An important relationship or one-to-one interaction",

    general_relationship_harmony:
      "An opportunity for warmth or cooperation in an important relationship",

    general_relationship_discussion:
      "A matter requiring discussion in an important relationship",

    general_relationship_tension:
      "Differences in an important relationship",

    general_relationship_commitment:
      "Questions about shared expectations or commitment in a relationship",
  };

  const subject = subjects[expression.expressionId];
  const mode = padaExpressionMode.mode;
  if (
  expression.expressionId ===
    "general_relationship_commitment" &&
  eventStage.stage === "clarifying" &&
  !["analysis", "reflection", "communication"].includes(mode)
) {
  return "Shared expectations or commitment in an important relationship may need further clarification before decisions are made.";
}
  switch (eventStage.stage) {
    case "emerging":
      return `${subject} may come into greater focus today.`;

    case "developing":
      if (mode === "communication") {
        return `${subject} may develop through thoughtful communication.`;
      }
      if (mode === "initiative") {
        return `${subject} may benefit from a measured first step.`;
      }
      if (mode === "support") {
        return `${subject} may benefit from patience and mutual consideration.`;
      }
      return `${subject} may gradually become more relevant today.`;

    case "clarifying":
      if (
        mode === "analysis" ||
        mode === "reflection"
      ) {
        return `${subject} may become clearer through careful reflection.`;
      }
      if (mode === "communication") {
        return `${subject} may benefit from an open, considerate conversation.`;
      }
      return `${subject} may require a clearer understanding of expectations.`;

    case "coordinating":
      if (
        mode === "coordination" ||
        mode === "organisation"
      ) {
        return `${subject} may benefit from aligning practical expectations.`;
      }
      return `${subject} may require cooperation and consideration of different priorities.`;

    case "stabilizing":
      if (
        mode === "adjustment" ||
        mode === "stability"
      ) {
        return `${subject} may benefit from small adjustments and consistency.`;
      }
      return `${subject} may move toward a steadier understanding through patience.`;

    case "confirming":
      return `${subject} may benefit from checking that expectations are understood.`;

    case "completing":
      return `${subject} may benefit from following through on an existing understanding.`;

    case "resolving":
      return `${subject} may become easier to manage through a measured response.`;

    case "delayed":
      return `${subject} may require patience rather than immediate conclusions.`;

    default:
      return `${subject} may deserve thoughtful attention today.`;
  }
}
export type ChildrenEventExpressionResult = {
  expressionId:
    | "general_children_attention"
    | "general_children_progress"
    | "general_children_responsibility"
    | "general_children_concern"
    | "general_children_milestone";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveChildrenEventExpression(
  manifestationId: string
): ChildrenEventExpressionResult | null {
  const expressions: Record<
    string,
    ChildrenEventExpressionResult
  > = {
    children_attention: {
      expressionId: "general_children_attention",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports greater involvement in matters concerning children without identifying a specific event.",
    },

    children_progress: {
      expressionId: "general_children_progress",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports constructive development involving children without establishing a particular achievement or result.",
    },

    children_responsibility: {
      expressionId: "general_children_responsibility",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports practical responsibilities involving children without establishing a specific duty or decision.",
    },

    children_concern: {
      expressionId: "general_children_concern",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports a need for care or patience regarding children without establishing illness, danger, or another adverse event.",
    },

    children_milestone: {
      expressionId: "general_children_milestone",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports attention to a meaningful developmental stage involving children without establishing a particular milestone or achievement.",
    },
  };

  return expressions[manifestationId] ?? null;
}
export function composeChildrenPredictionV2(
  expression: ChildrenEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const subjects: Record<
    ChildrenEventExpressionResult["expressionId"],
    string
  > = {
    general_children_attention:
      "A matter involving a child",

    general_children_progress:
      "An opportunity for constructive progress involving a child",

    general_children_responsibility:
      "A practical responsibility involving a child",

    general_children_concern:
      "A matter involving a child that deserves careful attention",

    general_children_milestone:
      "An important stage in a child's development",
  };

  const subject = subjects[expression.expressionId];
  const mode = padaExpressionMode.mode;
  if (
  expression.expressionId ===
    "general_children_responsibility" &&
  eventStage.stage === "developing" &&
  mode === "initiative"
) {
  return "A responsibility involving a child may benefit from taking a measured first step today.";
}

if (
  expression.expressionId ===
    "general_children_milestone" &&
  eventStage.stage === "developing" &&
  !["initiative", "support", "persistence"].includes(mode)
) {
  return "A meaningful stage in a child's development may gradually take shape through everyday involvement.";
}
  // Preserve caution without predicting an adverse event.
  if (
    expression.expressionId === "general_children_concern" &&
    eventStage.stage === "developing"
  ) {
    return "A matter involving a child may call for patience, reassurance and thoughtful attention as it develops.";
  }

  // A milestone theme does not establish an achievement.
  if (
    expression.expressionId === "general_children_milestone" &&
    eventStage.stage === "completing"
  ) {
    return "An important stage in a child's development may deserve recognition and thoughtful reflection today.";
  }

  switch (eventStage.stage) {
    case "emerging":
      return `${subject} may come into greater focus today.`;

    case "developing":
      if (mode === "initiative") {
        return `${subject} may benefit from a practical first step.`;
      }
      if (mode === "support") {
        return `${subject} may benefit from encouragement and steady support.`;
      }
      if (mode === "persistence") {
        return `${subject} may benefit from patience and consistency.`;
      }
      return `${subject} may gradually develop through everyday involvement.`;

    case "clarifying":
      if (
        mode === "analysis" ||
        mode === "reflection"
      ) {
        return `${subject} may become clearer through careful observation and reflection.`;
      }
      if (mode === "communication") {
        return `${subject} may benefit from an open, age-appropriate conversation.`;
      }
      return `${subject} may require a clearer understanding of what is needed.`;

    case "coordinating":
      if (
        mode === "organisation" ||
        mode === "coordination"
      ) {
        return `${subject} may benefit from organising practical arrangements.`;
      }
      return `${subject} may require cooperation and attention to different priorities.`;

    case "stabilizing":
      if (
        mode === "adjustment" ||
        mode === "stability"
      ) {
        return `${subject} may benefit from small, consistent adjustments.`;
      }
      return `${subject} may benefit from maintaining a steady and supportive approach.`;

    case "confirming":
      return `${subject} may benefit from checking that practical needs and expectations are understood.`;

    case "completing":
      return `${subject} may benefit from following through on existing arrangements.`;

    case "resolving":
      return `${subject} may become easier to manage through patience and practical attention.`;

    case "delayed":
      return `${subject} may require patience rather than immediate conclusions.`;

    default:
      return `${subject} may deserve thoughtful attention today.`;
  }
}
export type TravelEventExpressionResult = {
  expressionId:
    | "general_travel_planning"
    | "general_travel_movement"
    | "general_travel_disruption";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveTravelEventExpression(
  manifestationId: string
): TravelEventExpressionResult | null {
  const expressions: Record<
    string,
    TravelEventExpressionResult
  > = {
    travel_planning: {
      expressionId: "general_travel_planning",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports planning or practical decisions concerning travel without confirming a journey or booking.",
    },

    travel_movement: {
      expressionId: "general_travel_movement",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports increased attention to travel or movement without establishing a specific journey, destination or departure.",
    },

    travel_disruption: {
      expressionId: "general_travel_disruption",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports a need for flexibility in travel-related arrangements without establishing cancellation, accidents or serious disruption.",
    },
  };

  return expressions[manifestationId] ?? null;
}
export function composeTravelPredictionV2(
  expression: TravelEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const mode = padaExpressionMode.mode;

  const subjects: Record<
    TravelEventExpressionResult["expressionId"],
    string
  > = {
    general_travel_planning:
      "Travel-related planning",
    general_travel_movement:
      "Travel or movement-related arrangements",
    general_travel_disruption:
      "Travel arrangements that may require flexibility",
  };

  const subject = subjects[expression.expressionId];

  // A disruption theme does not establish an actual
  // cancellation, accident, or missed journey.
  if (
    expression.expressionId === "general_travel_disruption"
  ) {
    switch (eventStage.stage) {
      case "clarifying":
        return "Travel-related arrangements may benefit from checking details carefully before making commitments.";

      case "coordinating":
        return "Travel-related arrangements may require extra coordination and flexibility.";

      case "stabilizing":
        return "Keeping travel plans flexible may help accommodate practical adjustments.";

      case "completing":
        return "Before finalising travel arrangements, allow room to address outstanding practical details.";

      case "delayed":
        return "Travel-related arrangements may require additional patience and flexibility.";

      default:
        return "Travel-related arrangements may benefit from allowing extra flexibility and checking practical details.";
    }
  }

  switch (eventStage.stage) {
    case "emerging":
      return `${subject} may come into greater focus today.`;

    case "developing":
      if (mode === "initiative") {
        return `${subject} may benefit from taking an initial practical step.`;
      }
      if (
        mode === "organisation" ||
        mode === "coordination"
      ) {
        return `${subject} may develop through organising practical details.`;
      }
      if (mode === "support") {
        return `${subject} may benefit from cooperation or assistance.`;
      }
      return `${subject} may gradually develop through practical preparation.`;

    case "clarifying":
      if (
        mode === "analysis" ||
        mode === "reflection"
      ) {
        return `${subject} may become clearer through careful review of the available options.`;
      }
      if (mode === "communication") {
        return `${subject} may benefit from confirming details with the relevant people.`;
      }
      return `${subject} may require clearer information before decisions are made.`;

    case "coordinating":
      return `${subject} may benefit from coordinating schedules and practical requirements.`;

    case "stabilizing":
      if (
        mode === "adjustment" ||
        mode === "stability"
      ) {
        return `${subject} may benefit from small adjustments to existing plans.`;
      }
      return `${subject} may become easier to manage through a steady approach.`;

    case "confirming":
      return `${subject} may benefit from checking that arrangements and expectations are understood.`;

    case "completing":
      return `${subject} may benefit from following through on outstanding practical details.`;

    case "resolving":
      return `${subject} may become easier to manage as practical questions are addressed.`;

    case "delayed":
      return `${subject} may require patience while details are worked through.`;

    default:
      return `${subject} may deserve practical attention today.`;
  }
}
export type CommunicationEventExpressionResult = {
  expressionId:
    | "general_communication_activity"
    | "general_communication_clarity"
    | "general_communication_friction";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveCommunicationEventExpression(
  manifestationId: string
): CommunicationEventExpressionResult | null {
  const expressions: Record<
    string,
    CommunicationEventExpressionResult
  > = {
    communication_activity: {
      expressionId: "general_communication_activity",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports greater communication activity without establishing a specific message, conversation, or response.",
    },

    communication_clarity: {
      expressionId: "general_communication_clarity",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports clearer or more constructive communication without establishing agreement, acceptance, or a particular outcome.",
    },

    communication_friction: {
      expressionId: "general_communication_friction",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports greater care in communication without establishing an argument, confrontation, or relationship conflict.",
    },
  };

  return expressions[manifestationId] ?? null;
}
export function composeCommunicationPredictionV2(
  expression: CommunicationEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const mode = padaExpressionMode.mode;

  const subjects: Record<
    CommunicationEventExpressionResult["expressionId"],
    string
  > = {
    general_communication_activity:
      "Conversations or exchanges of information",

    general_communication_clarity:
      "An opportunity for clearer communication",

    general_communication_friction:
      "Communication that requires additional care",
  };

  const subject = subjects[expression.expressionId];

  // Friction indicates a need for care, not a confirmed conflict.
  if (
    expression.expressionId ===
    "general_communication_friction"
  ) {
    switch (eventStage.stage) {
      case "clarifying":
        return "A sensitive exchange may benefit from clarifying intentions and checking assumptions before responding.";

      case "coordinating":
        return "Communication may require extra coordination to prevent avoidable misunderstandings.";

      case "stabilizing":
        return "A measured tone and consistent communication may help keep exchanges constructive.";

      case "completing":
        return "Before concluding an important exchange, check that the intended message has been understood.";

      case "delayed":
        return "Allowing additional time before responding may help prevent unnecessary communication friction.";

      default:
        return "Communication may require extra patience, careful wording and attention to different perspectives.";
    }
  }

  // Clarity does not guarantee agreement or a positive response.
  if (
    expression.expressionId ===
      "general_communication_clarity" &&
    eventStage.stage === "clarifying"
  ) {
    if (
      mode === "analysis" ||
      mode === "reflection"
    ) {
      return "An opportunity for clearer communication may benefit from reviewing the facts and separating assumptions from what is known.";
    }

    if (mode === "communication") {
      return "An opportunity for clearer communication may benefit from expressing intentions simply and directly.";
    }
  }

  switch (eventStage.stage) {
    case "emerging":
      return `${subject} may come into greater focus today.`;

    case "developing":
      if (mode === "initiative") {
        return `${subject} may benefit from taking the first step in an exchange.`;
      }

      if (mode === "communication") {
        return `${subject} may develop through direct and thoughtful expression.`;
      }

      if (mode === "support") {
        return `${subject} may benefit from listening and responding with consideration.`;
      }

      return `${subject} may develop gradually through everyday interactions.`;

    case "clarifying":
      if (
        mode === "analysis" ||
        mode === "reflection"
      ) {
        return `${subject} may become clearer through careful consideration of the available information.`;
      }

      return `${subject} may benefit from checking details and intentions.`;

    case "coordinating":
      if (
        mode === "organisation" ||
        mode === "coordination"
      ) {
        return `${subject} may benefit from organising information and aligning expectations.`;
      }

      return `${subject} may require cooperation and attention to different viewpoints.`;

    case "stabilizing":
      if (
        mode === "adjustment" ||
        mode === "stability"
      ) {
        return `${subject} may benefit from small adjustments in tone or approach.`;
      }

      return `${subject} may become easier to manage through steady and thoughtful communication.`;

    case "confirming":
      return `${subject} may benefit from confirming that key details are understood.`;

    case "completing":
      return `${subject} may benefit from bringing outstanding points to a clear conclusion.`;

    case "resolving":
      return `${subject} may become easier to manage as uncertainties are addressed.`;

    case "delayed":
      return `${subject} may require patience while information or responses are considered.`;

    default:
      return `${subject} may deserve thoughtful attention today.`;
  }
}
export type PublicImageEventExpressionResult = {
  expressionId:
    | "general_public_image_visibility"
    | "general_public_image_recognition"
    | "general_public_image_pressure";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolvePublicImageEventExpression(
  manifestationId: string
): PublicImageEventExpressionResult | null {
  const expressions: Record<
    string,
    PublicImageEventExpressionResult
  > = {
    public_image_visibility: {
      expressionId: "general_public_image_visibility",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports greater visibility of actions or contributions without establishing fame, publicity, or a specific audience.",
    },

    public_image_recognition: {
      expressionId: "general_public_image_recognition",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports the possibility of acknowledgement or appreciation without establishing an award, promotion, or formal recognition.",
    },

    public_image_pressure: {
      expressionId: "general_public_image_pressure",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports sensitivity around expectations or reputation without establishing criticism, controversy, or reputational damage.",
    },
  };

  return expressions[manifestationId] ?? null;
}
export function composePublicImagePredictionV2(
  expression: PublicImageEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const mode = padaExpressionMode.mode;

  // Pressure does not establish criticism or damage.
  if (
    expression.expressionId ===
    "general_public_image_pressure"
  ) {
    switch (eventStage.stage) {
      case "clarifying":
        return "Expectations around your contribution or how it is perceived may benefit from clearer communication.";

      case "coordinating":
        return "Managing expectations around your contribution may require careful coordination with others.";

      case "stabilizing":
        return "A consistent and measured approach may help manage expectations around your contribution.";

      case "completing":
        return "Before concluding a visible responsibility, reviewing important details may help maintain confidence in your work.";

      case "delayed":
        return "Patience may be useful when expectations around your contribution take time to settle.";

      case "resolving":
        return "Concerns about how your contribution is perceived may become easier to manage through practical clarification.";

      default:
        return "Expectations around your actions or contribution may require additional care and attention today.";
    }
  }

  // Recognition remains a possibility, not a guaranteed result.
  if (
    expression.expressionId ===
    "general_public_image_recognition"
  ) {
    switch (eventStage.stage) {
      case "emerging":
        return "Your contribution may begin attracting greater appreciation or acknowledgement.";

      case "developing":
        if (mode === "initiative") {
          return "Taking a measured initiative may help make your contribution more noticeable.";
        }

        if (
          mode === "support" ||
          mode === "coordination"
        ) {
          return "Your contribution may become more noticeable through cooperation and support.";
        }

        return "Your contribution may gradually become more noticeable to others.";

      case "clarifying":
        return "Communicating the value of your contribution clearly may help others understand it.";

      case "coordinating":
        return "Collaborative efforts may create opportunities for your contribution to be appreciated.";

      case "stabilizing":
        return "Consistent contributions may help strengthen how your efforts are appreciated.";

      case "confirming":
        return "Acknowledgement of your contribution may become clearer through constructive feedback.";

      case "completing":
        return "Completing a responsibility thoughtfully may provide an opportunity for your contribution to be acknowledged.";

      case "resolving":
        return "As expectations become clearer, your contribution may be easier for others to appreciate.";

      case "delayed":
        return "Appreciation for your contribution may require patience rather than immediate acknowledgement.";

      default:
        return "Your contribution may receive greater attention or appreciation.";
    }
  }

  // Visibility does not establish publicity or fame.
  switch (eventStage.stage) {
    case "emerging":
      return "Your actions or contributions may begin becoming more noticeable to others.";

    case "developing":
      if (mode === "initiative") {
        return "Taking initiative may make your contribution more visible in everyday interactions.";
      }

      if (
        mode === "communication" ||
        mode === "guidance"
      ) {
        return "Explaining your contribution clearly may help others understand your involvement.";
      }

      return "Your contribution may gradually become more visible through ongoing involvement.";

    case "clarifying":
      return "Clarifying your role or contribution may help others understand your involvement.";

    case "coordinating":
      return "Working with others may bring greater attention to your contribution.";

    case "stabilizing":
      return "A consistent approach may help make your contribution more noticeable over time.";

    case "confirming":
      return "Your role or contribution may become more visible as expectations are clarified.";

    case "completing":
      return "Following through on responsibilities may make your contribution more noticeable.";

    case "resolving":
      return "As outstanding matters become clearer, your contribution may become easier to recognise.";

    case "delayed":
      return "Greater visibility of your contribution may develop gradually rather than immediately.";

    default:
      return "Your actions or contributions may attract greater attention today.";
  }
}
export type HiddenMattersEventExpressionResult = {
  expressionId:
    | "general_hidden_matters_revelation"
    | "general_hidden_matters_introspection"
    | "general_hidden_matters_complication";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveHiddenMattersEventExpression(
  manifestationId: string
): HiddenMattersEventExpressionResult | null {
  const expressions: Record<
    string,
    HiddenMattersEventExpressionResult
  > = {
    hidden_matters_revelation: {
      expressionId: "general_hidden_matters_revelation",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports greater understanding of a previously unclear or private matter without establishing disclosure of a secret or a specific revelation.",
    },

    hidden_matters_introspection: {
      expressionId: "general_hidden_matters_introspection",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports private reflection or examination of an internal pattern without establishing a psychological condition or a specific unresolved event.",
    },

    hidden_matters_complication: {
      expressionId: "general_hidden_matters_complication",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports careful attention to an unclear, overlooked or unresolved matter without establishing deception, betrayal, scandal or a specific adverse event.",
    },
  };

  return expressions[manifestationId] ?? null;
}
export function composeHiddenMattersPredictionV2(
  expression: HiddenMattersEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const mode = padaExpressionMode.mode;

  // An unclear matter becoming clearer does not establish
  // that a secret, deception or concealed event exists.
  if (
    expression.expressionId ===
    "general_hidden_matters_revelation"
  ) {
    switch (eventStage.stage) {
      case "emerging":
        return "A previously unclear matter may begin making more sense as you examine it.";

      case "developing":
        if (mode === "analysis" || mode === "reflection") {
          return "A previously unclear matter may become easier to understand through careful reflection.";
        }

        if (
          mode === "communication" ||
          mode === "guidance"
        ) {
          return "A previously unclear matter may become easier to understand through thoughtful discussion.";
        }

        return "Your understanding of a previously unclear matter may gradually develop.";

      case "clarifying":
        return "Details of a previously unclear matter may become easier to understand through careful examination.";

      case "coordinating":
        return "Discussing an unclear matter with someone involved may help you understand it better.";

      case "stabilizing":
        return "A more consistent understanding of a previously unclear matter may begin taking shape.";

      case "confirming":
        return "Checking available information may help establish a clearer understanding of an uncertain matter.";

      case "completing":
        return "Reviewing the remaining details may help bring greater clarity to an unresolved question.";

      case "delayed":
        return "Understanding an unclear matter may take longer than expected, making patience useful.";

      case "resolving":
        return "An unresolved question may become easier to understand as its details are examined.";

      default:
        return "Something previously unclear may become easier to understand today.";
    }
  }

  // Introspection does not establish emotional distress,
  // trauma, illness or a specific psychological condition.
  if (
    expression.expressionId ===
    "general_hidden_matters_introspection"
  ) {
    switch (eventStage.stage) {
      case "emerging":
        return "You may feel drawn to reflect more deeply on a private concern or recurring thought.";

      case "developing":
        if (
          mode === "reflection" ||
          mode === "analysis"
        ) {
          return "Quiet reflection may help you better understand a recurring thought or personal concern.";
        }

        if (mode === "support") {
          return "Giving yourself time and space may support deeper reflection on a personal matter.";
        }

        return "A personal matter may invite deeper reflection as your understanding develops.";

      case "clarifying":
        return "Reflecting on your own priorities may help clarify a personal concern.";

      case "coordinating":
        return "Balancing private reflection with everyday responsibilities may require thoughtful attention.";

      case "stabilizing":
        return "A steady approach to reflection may help you understand your priorities more clearly.";

      case "confirming":
        return "Reviewing your thoughts carefully may help you recognise which concerns deserve attention.";

      case "completing":
        return "Taking time to reflect may help you bring a personal question toward a clearer conclusion.";

      case "delayed":
        return "A personal question may need more time for reflection before reaching a conclusion.";

      case "resolving":
        return "A recurring personal concern may become easier to understand through patient reflection.";

      default:
        return "A private concern or personal question may invite deeper reflection today.";
    }
  }

  // Complication indicates a need for attention, not
  // proof of betrayal, wrongdoing or an adverse event.
  switch (eventStage.stage) {
    case "emerging":
      return "A previously overlooked detail may deserve closer attention before you proceed.";

    case "developing":
      if (mode === "analysis") {
        return "Careful examination may help you identify details that need attention in an unresolved matter.";
      }

      if (
        mode === "organisation" ||
        mode === "coordination"
      ) {
        return "Organising the available information may help you manage an unresolved matter carefully.";
      }

      return "An unresolved or overlooked matter may require additional attention as it develops.";

    case "clarifying":
      return "Clarifying the details of an unresolved matter may help prevent unnecessary confusion.";

    case "coordinating":
      return "Coordinating information carefully may help you manage an unresolved matter.";

    case "stabilizing":
      return "A measured approach may help you manage an unresolved matter without unnecessary assumptions.";

    case "confirming":
      return "Verifying important details may help you approach an uncertain matter more confidently.";

    case "completing":
      return "Before closing an unresolved matter, reviewing overlooked details may be useful.";

    case "delayed":
      return "An unresolved matter may require patience and careful follow-through.";

    case "resolving":
      return "An unresolved matter may become easier to manage through careful review and clarification.";

    default:
      return "An overlooked or unresolved matter may benefit from closer attention today.";
  }
}
export type PropertyEventExpressionResult = {
  expressionId:
    | "general_property_attention"
    | "general_property_progress"
    | "general_property_complication";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolvePropertyEventExpression(
  manifestationId: string
): PropertyEventExpressionResult | null {
  const expressions: Record<
    string,
    PropertyEventExpressionResult
  > = {
    property_attention: {
      expressionId: "general_property_attention",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports attention to a property, housing or related practical matter without establishing a specific transaction, ownership change or financial obligation.",
    },

    property_progress: {
      expressionId: "general_property_progress",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports constructive movement or organisation in a property-related matter without establishing a purchase, sale, approval or completed transaction.",
    },

    property_complication: {
      expressionId: "general_property_complication",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports the possibility of additional practical attention or complexity in a property-related matter without establishing a dispute, confirmed delay, financial loss or adverse event.",
    },
  };

  return expressions[manifestationId] ?? null;
}
export function composePropertyPredictionV2(
  expression: PropertyEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const mode = padaExpressionMode.mode;

  // ATTENTION:
  // A practical property or housing matter deserves attention.
  // No transaction or ownership change is assumed.
  if (
    expression.expressionId ===
    "general_property_attention"
  ) {
    switch (eventStage.stage) {
      case "emerging":
        return "A practical matter involving your home or property may begin drawing your attention.";

      case "developing":
        if (
          mode === "organisation" ||
          mode === "coordination"
        ) {
          return "A home or property-related matter may benefit from organising practical details.";
        }

        if (
          mode === "analysis" ||
          mode === "reflection"
        ) {
          return "Reviewing the details of a home or property-related matter may help you identify what needs attention.";
        }

        if (mode === "initiative") {
          return "Taking a measured first step may help you address a practical home or property-related matter.";
        }

        return "A practical home or property-related matter may require some attention as it develops.";

      case "clarifying":
        return "Clarifying practical details may help you understand a home or property-related matter better.";

      case "coordinating":
        return "Coordinating responsibilities may help you manage a home or property-related matter.";

      case "stabilizing":
        return "A steady approach may help you organise practical matters involving your home or property.";

      case "confirming":
        return "Checking relevant details may help you approach a home or property-related matter with greater clarity.";

      case "completing":
        return "Reviewing remaining practical details may help you bring a home or property-related task closer to completion.";

      case "delayed":
        return "A home or property-related matter may need additional time and practical attention.";

      case "resolving":
        return "A home or property-related concern may become easier to manage through careful follow-through.";

      default:
        return "A practical home or property-related matter may deserve your attention today.";
    }
  }

  // PROGRESS:
  // Constructive movement is supported, but a purchase,
  // sale, approval or completed transaction is not established.
  if (
    expression.expressionId ===
    "general_property_progress"
  ) {
    switch (eventStage.stage) {
      case "emerging":
        return "An opportunity to organise a home or property-related matter more effectively may begin taking shape.";

      case "developing":
        if (
          mode === "organisation" ||
          mode === "coordination"
        ) {
          return "Organising practical arrangements may help a home or property-related matter move forward.";
        }

        if (mode === "initiative") {
          return "A measured first step may support progress in a home or property-related matter.";
        }

        if (
          mode === "communication" ||
          mode === "guidance"
        ) {
          return "A useful discussion may help clarify the next steps in a home or property-related matter.";
        }

        return "A home or property-related matter may gradually become easier to organise.";

      case "clarifying":
        return "Clearer practical details may help you identify the next steps in a home or property-related matter.";

      case "coordinating":
        return "Coordinating practical arrangements may support progress in a home or property-related matter.";

      case "stabilizing":
        return "A more organised approach may help bring steadiness to a home or property-related matter.";

      case "confirming":
        return "Reviewing available information may help you confirm suitable next steps in a home or property-related matter.";

      case "completing":
        return "A home or property-related task may move closer to completion through careful attention to remaining details.";

      case "delayed":
        return "Progress in a home or property-related matter may require patience and continued organisation.";

      case "resolving":
        return "A practical home or property-related matter may become easier to manage as outstanding details are addressed.";

      default:
        return "A home or property-related matter may become easier to organise or move forward constructively.";
    }
  }

  // COMPLICATION:
  // Additional complexity is possible.
  // No confirmed dispute, loss or adverse event is assumed.
  switch (eventStage.stage) {
    case "emerging":
      return "A practical detail involving your home or property may require closer attention before proceeding.";

    case "developing":
      if (
        mode === "analysis" ||
        mode === "reflection"
      ) {
        return "Carefully reviewing a home or property-related concern may help you identify details needing attention.";
      }

      if (
        mode === "organisation" ||
        mode === "coordination"
      ) {
        return "Organising responsibilities and practical details may help you manage a complicated home or property-related matter.";
      }

      return "A home or property-related matter may require additional care as practical details develop.";

    case "clarifying":
      return "Clarifying outstanding details may help you approach a home or property-related complication more carefully.";

    case "coordinating":
      return "Careful coordination may help you manage practical complexity involving your home or property.";

    case "stabilizing":
      return "A measured approach may help you manage a home or property-related concern without unnecessary assumptions.";

    case "confirming":
      return "Verifying practical details may help you avoid confusion in a home or property-related matter.";

    case "completing":
      return "Before concluding a home or property-related task, reviewing outstanding details may be worthwhile.";

    case "delayed":
      return "A home or property-related matter may require additional patience while practical details are addressed.";

    case "resolving":
      return "A home or property-related complication may become easier to manage through careful review and follow-through.";

    default:
      return "A home or property-related matter may require extra patience and attention to practical details.";
  }
}
export type SpiritualityEventExpressionResult = {
  expressionId:
    | "general_spiritual_practice"
    | "general_spiritual_introspection"
    | "general_spiritual_learning"
    | "general_spiritual_detachment"
    | "general_spiritual_guidance";
  specificity: 2;
  confidence: "baseline";
  evidenceReason: string;
};

export function resolveSpiritualityEventExpression(
  manifestationId: string
): SpiritualityEventExpressionResult | null {
  const expressions: Record<
    string,
    SpiritualityEventExpressionResult
  > = {
    spiritual_practice: {
      expressionId: "general_spiritual_practice",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports an inclination toward spiritual practice without establishing a particular ritual, supernatural experience or guaranteed spiritual result.",
    },

    spiritual_introspection: {
      expressionId: "general_spiritual_introspection",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports contemplation and inward reflection without establishing emotional distress, a psychological condition or a specific transformative experience.",
    },

    spiritual_learning: {
      expressionId: "general_spiritual_learning",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports exploration of spiritual or philosophical knowledge without establishing formal study, a particular teacher or a specific achievement.",
    },

    spiritual_detachment: {
      expressionId: "general_spiritual_detachment",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports reconsidering attachments or priorities without establishing withdrawal from relationships, abandonment of responsibilities or a specific loss.",
    },

    spiritual_guidance: {
      expressionId: "general_spiritual_guidance",
      specificity: 2,
      confidence: "baseline",
      evidenceReason:
        "The selected manifestation supports seeking perspective from spiritual teachings or sources of wisdom without establishing a meeting with a teacher, receipt of advice or a guaranteed answer.",
    },
  };

  return expressions[manifestationId] ?? null;
}
export function composeSpiritualityPredictionV2(
  expression: SpiritualityEventExpressionResult,
  eventStage: EventStageResult,
  padaExpressionMode: PadaExpressionModeResult
): string {
  const stage = eventStage.stage;
  const mode = padaExpressionMode.mode;

  // PRACTICE: Inclination toward spiritual practice.
  // No specific ritual or spiritual outcome is assumed.
  if (expression.expressionId === "general_spiritual_practice") {
    switch (stage) {
      case "emerging":
        return "You may feel inclined to make more room for spiritual practice in your day.";

      case "developing":
        if (mode === "initiative") {
          return "Taking a small, deliberate step may help you establish a spiritual practice that feels meaningful.";
        }
        if (mode === "persistence" || mode === "stability") {
          return "Maintaining a simple spiritual routine may feel more meaningful than making major changes.";
        }
        if (mode === "reflection" || mode === "analysis") {
          return "Reflecting on the purpose of your spiritual practice may help you approach it more thoughtfully.";
        }
        return "Your interest in prayer, meditation or another spiritual practice may gradually develop.";

      case "clarifying":
        return "Reflecting on what you seek from spiritual practice may help clarify your approach.";

      case "coordinating":
        return "Making space for spiritual practice alongside daily responsibilities may require thoughtful planning.";

      case "stabilizing":
        return "A consistent and manageable spiritual routine may support a steadier approach to practice.";

      case "confirming":
        return "Reviewing your spiritual routine may help you identify which practices feel meaningful to you.";

      case "completing":
        return "Taking time to complete a familiar spiritual practice may provide a useful sense of continuity.";

      case "delayed":
        return "If spiritual practice feels difficult to accommodate, a simpler routine may be more manageable.";

      case "resolving":
        return "Revisiting your intentions may help you approach spiritual practice with greater clarity.";

      default:
        return "Spiritual practice may deserve some thoughtful attention today.";
    }
  }

  // INTROSPECTION: Contemplation and inward reflection.
  // No psychological condition or breakthrough is assumed.
  if (
    expression.expressionId ===
    "general_spiritual_introspection"
  ) {
    switch (stage) {
      case "emerging":
        return "You may feel drawn toward quiet contemplation of your beliefs or personal priorities.";

      case "developing":
        if (mode === "analysis" || mode === "reflection") {
          return "Quiet contemplation may help you examine your beliefs and priorities more carefully.";
        }
        if (mode === "support") {
          return "Allowing yourself some quiet time may support reflection on what matters to you.";
        }
        return "A question about meaning or personal priorities may invite deeper contemplation.";

      case "clarifying":
        return "Reflecting on your values may help clarify what feels meaningful to you.";

      case "coordinating":
        return "Balancing time for contemplation with everyday responsibilities may require attention.";

      case "stabilizing":
        return "A steady approach to contemplation may help you examine your priorities without rushing conclusions.";

      case "confirming":
        return "Revisiting your beliefs thoughtfully may help you recognise which values remain important.";

      case "completing":
        return "A period of reflection may help you bring greater clarity to a personal question about meaning.";

      case "delayed":
        return "Questions about meaning or purpose may benefit from patience rather than immediate answers.";

      case "resolving":
        return "Patient contemplation may help you approach a personal question with greater understanding.";

      default:
        return "Quiet contemplation may help you explore your beliefs and priorities.";
    }
  }

  // LEARNING: Exploration of spiritual or philosophical ideas.
  // No formal enrolment, teacher or achievement is assumed.
  if (expression.expressionId === "general_spiritual_learning") {
    switch (stage) {
      case "emerging":
        return "Curiosity about a spiritual or philosophical subject may begin drawing your attention.";

      case "developing":
        if (mode === "analysis") {
          return "Studying a spiritual or philosophical idea carefully may help deepen your understanding.";
        }
        if (mode === "communication" || mode === "guidance") {
          return "A thoughtful discussion may help you explore a spiritual or philosophical question.";
        }
        if (mode === "initiative") {
          return "Exploring one spiritual or philosophical question may be a useful starting point.";
        }
        return "Your interest in spiritual or philosophical learning may gradually develop.";

      case "clarifying":
        return "Examining a spiritual or philosophical idea more closely may help clarify your understanding.";

      case "coordinating":
        return "Organising your reading or exploration may make spiritual learning easier to pursue.";

      case "stabilizing":
        return "A steady approach to spiritual or philosophical study may help you build understanding gradually.";

      case "confirming":
        return "Revisiting what you have learned may help you distinguish questions from established understanding.";

      case "completing":
        return "Reviewing a spiritual or philosophical topic may help consolidate what you have explored.";

      case "delayed":
        return "Understanding a complex spiritual or philosophical idea may require more time and reflection.";

      case "resolving":
        return "Reconsidering a spiritual or philosophical question may help you develop a clearer perspective.";

      default:
        return "A spiritual or philosophical subject may invite further exploration today.";
    }
  }

  // DETACHMENT: Reconsidering attachments and priorities.
  // No separation, abandonment or material loss is assumed.
  if (
    expression.expressionId ===
    "general_spiritual_detachment"
  ) {
    switch (stage) {
      case "emerging":
        return "You may begin reconsidering how much importance you place on a familiar concern.";

      case "developing":
        if (mode === "reflection" || mode === "analysis") {
          return "Reflecting on your priorities may help you reconsider an attachment without rushing a decision.";
        }
        if (mode === "adjustment" || mode === "transition") {
          return "A gradual adjustment in priorities may help you make room for what feels meaningful.";
        }
        return "You may feel inclined to place less emphasis on something that has occupied your attention.";

      case "clarifying":
        return "Clarifying your priorities may help you distinguish what matters from what can receive less attention.";

      case "coordinating":
        return "Balancing personal priorities with existing responsibilities may require thoughtful adjustment.";

      case "stabilizing":
        return "A measured approach may help you reconsider attachments while maintaining important responsibilities.";

      case "confirming":
        return "Reviewing your priorities may help you recognise what still deserves your time and attention.";

      case "completing":
        return "You may find it useful to reflect on whether an old concern still deserves the same attention.";

      case "delayed":
        return "Reconsidering an attachment or familiar priority may take time and need not be rushed.";

      case "resolving":
        return "A more balanced perspective may help you approach a familiar concern with less attachment.";

      default:
        return "You may benefit from reflecting on which priorities still feel meaningful.";
    }
  }

  // GUIDANCE: Openness to teachings or sources of wisdom.
  // No actual meeting, message or guaranteed answer is assumed.
  switch (stage) {
    case "emerging":
      return "You may feel inclined to seek perspective from a trusted teaching or source of wisdom.";

    case "developing":
      if (mode === "communication" || mode === "guidance") {
        return "A thoughtful conversation or trusted teaching may offer perspective on a spiritual question.";
      }
      if (mode === "analysis" || mode === "reflection") {
        return "Reflecting on familiar teachings may help you consider a spiritual question more carefully.";
      }
      return "Exploring a trusted source of wisdom may help you consider a question from another perspective.";

    case "clarifying":
      return "Considering different teachings or perspectives may help clarify a spiritual question.";

    case "coordinating":
      return "Making time to explore spiritual guidance alongside daily commitments may require planning.";

    case "stabilizing":
      return "Returning to familiar teachings may provide a consistent framework for reflection.";

    case "confirming":
      return "Considering advice carefully against your own values may help you decide what feels relevant.";

    case "completing":
      return "Reviewing guidance you have considered may help you organise your thoughts on a spiritual question.";

    case "delayed":
      return "Finding meaningful guidance may require patience and careful consideration.";

    case "resolving":
      return "Reflecting on trusted sources of wisdom may help you approach a spiritual question with greater perspective.";

    default:
      return "A trusted teaching or source of wisdom may offer useful perspective today.";
  }
}