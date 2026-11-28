import type { EventThemeId } from "./eventThemes";

export type EventJudgementRule = {
  eventId: EventThemeId;

  specificity:
    | "broad"
    | "situational"
    | "specific";

  coreHouses: readonly number[];

  requiredDistinctiveHouses: readonly number[];

  alternativeDistinctiveHouses: readonly number[];

  reinforcingHouses: readonly number[];

  minimumCoreHouses: number;

  minimumDistinctiveHouses: number;

  requiresIndependentTransit: boolean;

  requiresDailyTrigger: boolean;

  description: string;
};

export const EVENT_JUDGEMENT_WEIGHTS = {
  dashaActivation: 30,
  houseCombination: 25,
  transitConvergence: 20,
  dailyTrigger: 15,
  naturalSignificance: 10,
} as const;

export const CAREER_EVENT_JUDGEMENT_RULES:
  readonly EventJudgementRule[] = [
  {
    eventId: "career_movement",
    specificity: "broad",

    coreHouses: [10],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [1, 6, 9],
    reinforcingHouses: [11],

    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Professional movement without sufficient evidence of a more specific career outcome.",
  },

  {
    eventId: "career_interview_invitation",
    specificity: "specific",

    coreHouses: [6, 10],
    requiredDistinctiveHouses: [3],
    alternativeDistinctiveHouses: [],
    reinforcingHouses: [11],

    minimumCoreHouses: 2,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Employment-related communication or an interview invitation.",
  },

  {
    eventId: "career_job_offer",
    specificity: "specific",

    coreHouses: [6, 10],
    requiredDistinctiveHouses: [11],
    alternativeDistinctiveHouses: [],
    reinforcingHouses: [2, 3],

    minimumCoreHouses: 2,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Employment opportunity reaching an offer or confirmation stage.",
  },

  {
    eventId: "career_responsibility",
    specificity: "situational",

    coreHouses: [6, 10],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [1],
    reinforcingHouses: [],

    minimumCoreHouses: 2,
    minimumDistinctiveHouses: 0,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Additional professional accountability or responsibility beyond routine workload.",
  },

  {
    eventId: "career_recognition",
    specificity: "situational",

    coreHouses: [10],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [9, 11],
    reinforcingHouses: [1],

    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Professional acknowledgement, visibility or recognition.",
  },

  {
    eventId: "career_change",
    specificity: "specific",

    coreHouses: [10],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [8, 12],
    reinforcingHouses: [6, 9],

    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Professional restructuring, transition or separation from an existing arrangement.",
  },

  {
    eventId: "workload_service",
    specificity: "situational",

    coreHouses: [6],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [],
    reinforcingHouses: [1, 10],

    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 0,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Routine work demands, service obligations or operational problem-solving.",
  },
];

export const MONEY_EVENT_JUDGEMENT_RULES:
  readonly EventJudgementRule[] = [
  {
    eventId: "money_inflow",
    specificity: "specific",

    coreHouses: [2, 11],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [9, 10],
    reinforcingHouses: [5],

    minimumCoreHouses: 2,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Potential receipt, income or financial gain supported by a distinct source of financial opportunity.",
  },

  {
    eventId: "money_outflow",
    specificity: "specific",

    coreHouses: [12],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [2, 6],
    reinforcingHouses: [8],

    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Potential outward movement of money connected to available resources or financial obligations.",
  },

  {
    eventId: "money_planning",
    specificity: "situational",

    coreHouses: [2],
    requiredDistinctiveHouses: [3],
    alternativeDistinctiveHouses: [6],
    reinforcingHouses: [10, 11],

    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Financial review, documentation, budgeting or practical decisions about available resources.",
  },

  {
    eventId: "money_accumulation",
    specificity: "situational",

    coreHouses: [2, 11],
    requiredDistinctiveHouses: [5],
    alternativeDistinctiveHouses: [],
    reinforcingHouses: [9],

    minimumCoreHouses: 2,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Financial consolidation, allocation towards reserves or longer-term resource building, without asserting realised savings.",
  },

  {
    eventId: "money_settlement",
    specificity: "specific",

    coreHouses: [6, 8],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [2, 11, 12],
    reinforcingHouses: [],

    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,

    requiresIndependentTransit: true,
    requiresDailyTrigger: true,

    description:
      "Potential resolution of dues, repayments, liabilities, reimbursements or another pending financial obligation.",
  },
];

export const ADDITIONAL_EVENT_JUDGEMENT_RULES:
  readonly EventJudgementRule[] = [
  {
    eventId: "relationship_attention",
    specificity: "broad",
    coreHouses: [7],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [5,11],
    reinforcingHouses: [1],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Greater attention to interpersonal relationships.",
  },
  {
    eventId: "relationship_harmony",
    specificity: "situational",
    coreHouses: [7],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [5,11],
    reinforcingHouses: [2],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Opportunity for cooperation and constructive interaction.",
  },
  {
    eventId: "relationship_discussion",
    specificity: "specific",
    coreHouses: [7],
    requiredDistinctiveHouses: [3],
    alternativeDistinctiveHouses: [],
    reinforcingHouses: [5],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "A meaningful interpersonal discussion.",
  },
  {
    eventId: "relationship_tension",
    specificity: "situational",
    coreHouses: [7],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6,8,12],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Interpersonal disagreement or difficulty.",
  },
  {
    eventId: "relationship_commitment",
    specificity: "specific",
    coreHouses: [7],
    requiredDistinctiveHouses: [2,11],
    alternativeDistinctiveHouses: [],
    reinforcingHouses: [5,9],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 2,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Discussion or development concerning a relationship commitment.",
  },
  {
    eventId: "children_attention",
    specificity: "broad",
    coreHouses: [5],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [4,9],
    reinforcingHouses: [2],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Increased attention to matters concerning children.",
  },
  {
    eventId: "children_progress",
    specificity: "situational",
    coreHouses: [5],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [9,11],
    reinforcingHouses: [4],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Constructive developments concerning children.",
  },
  {
    eventId: "children_responsibility",
    specificity: "situational",
    coreHouses: [5],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6,10],
    reinforcingHouses: [4],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Additional responsibilities concerning children.",
  },
  {
    eventId: "children_concern",
    specificity: "situational",
    coreHouses: [5],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6,8,12],
    reinforcingHouses: [4],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "A matter concerning children requiring attention.",
  },
  {
    eventId: "children_milestone",
    specificity: "specific",
    coreHouses: [5],
    requiredDistinctiveHouses: [11],
    alternativeDistinctiveHouses: [9,10],
    reinforcingHouses: [4],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Potential progress towards a milestone concerning children.",
  },
  {
    eventId: "education_focus",
    specificity: "situational",
    coreHouses: [4,5,9],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [3],
    reinforcingHouses: [11],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Concentrated learning or academic activity.",
  },
  {
    eventId: "education_progress",
    specificity: "specific",
    coreHouses: [4,5,9],
    requiredDistinctiveHouses: [11],
    alternativeDistinctiveHouses: [],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Potential feedback or progress in learning.",
  },
  {
    eventId: "education_challenge",
    specificity: "situational",
    coreHouses: [4,5,9],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6,8,12],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Academic difficulty or increased learning demands.",
  },
  {
    eventId: "home_change",
    specificity: "specific",
    coreHouses: [4],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [8,12],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Potential change in the domestic environment.",
  },
  {
    eventId: "home_attention",
    specificity: "situational",
    coreHouses: [4],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [1],
    reinforcingHouses: [2],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 0,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Domestic matters requiring practical attention.",
  },
  {
    eventId: "home_stability",
    specificity: "situational",
    coreHouses: [4],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [2,11],
    reinforcingHouses: [1],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Domestic organisation or improved stability.",
  },
  {
    eventId: "family_responsibility",
    specificity: "situational",
    coreHouses: [4],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [2,6],
    reinforcingHouses: [10],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Family duties or responsibilities.",
  },
  {
    eventId: "family_support",
    specificity: "situational",
    coreHouses: [2,4],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [9,11],
    reinforcingHouses: [5],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Opportunity for family cooperation or assistance.",
  },
  {
    eventId: "family_discussion",
    specificity: "specific",
    coreHouses: [2,4],
    requiredDistinctiveHouses: [3],
    alternativeDistinctiveHouses: [],
    reinforcingHouses: [11],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "A discussion involving family matters.",
  },
  {
    eventId: "family_tension",
    specificity: "situational",
    coreHouses: [2,4],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6,8,12],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Family disagreement or competing obligations.",
  },
  {
    eventId: "property_attention",
    specificity: "situational",
    coreHouses: [4],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [2,8],
    reinforcingHouses: [6],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Property or housing matters requiring attention.",
  },
  {
    eventId: "property_progress",
    specificity: "specific",
    coreHouses: [4],
    requiredDistinctiveHouses: [11],
    alternativeDistinctiveHouses: [2],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Potential progress in an existing property matter.",
  },
  {
    eventId: "property_complication",
    specificity: "situational",
    coreHouses: [4],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6,8,12],
    reinforcingHouses: [2],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Property obligations or practical complications.",
  },
  {
    eventId: "travel_planning",
    specificity: "situational",
    coreHouses: [3,9],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [12],
    reinforcingHouses: [11],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 0,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Travel arrangements or preparation.",
  },
  {
    eventId: "travel_movement",
    specificity: "specific",
    coreHouses: [3,9],
    requiredDistinctiveHouses: [12],
    alternativeDistinctiveHouses: [],
    reinforcingHouses: [11],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Potential movement or a journey.",
  },
  {
    eventId: "travel_disruption",
    specificity: "situational",
    coreHouses: [3,9,12],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6,8],
    reinforcingHouses: [1],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Travel arrangements requiring flexibility.",
  },
  {
    eventId: "communication_activity",
    specificity: "situational",
    coreHouses: [3],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [1,11],
    reinforcingHouses: [10],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 0,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Increased correspondence or conversation.",
  },
  {
    eventId: "communication_clarity",
    specificity: "situational",
    coreHouses: [3],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [1,9],
    reinforcingHouses: [11],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Clarification or constructive communication.",
  },
  {
    eventId: "communication_friction",
    specificity: "situational",
    coreHouses: [3],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6,8],
    reinforcingHouses: [12],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Misunderstanding or difficult communication.",
  },
  {
    eventId: "mental_pressure",
    specificity: "situational",
    coreHouses: [1,4,6],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [8,12],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Competing demands or a need for mental rest.",
  },
  {
    eventId: "emotional_stability",
    specificity: "situational",
    coreHouses: [4],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [1],
    reinforcingHouses: [5,11],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Opportunity for emotional balance.",
  },
  {
    eventId: "health_attention",
    specificity: "situational",
    coreHouses: [1,6],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [8,12],
    reinforcingHouses: [4],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Attention to rest and everyday wellbeing.",
  },
  {
    eventId: "spiritual_practice",
    specificity: "situational",
    coreHouses: [5,9,12],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [8],
    reinforcingHouses: [4],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Interest in spiritual or reflective practice.",
  },
  {
    eventId: "spiritual_introspection",
    specificity: "situational",
    coreHouses: [8,12],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [4,9],
    reinforcingHouses: [5],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Reflection and inward attention.",
  },
  {
    eventId: "spiritual_learning",
    specificity: "situational",
    coreHouses: [5,9],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [8,12],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Interest in philosophical or spiritual learning.",
  },
  {
    eventId: "spiritual_detachment",
    specificity: "situational",
    coreHouses: [8,12],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [9],
    reinforcingHouses: [4],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Desire for solitude or reduced distractions.",
  },
  {
    eventId: "spiritual_guidance",
    specificity: "situational",
    coreHouses: [9],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [5,8,12],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Interest in advice or spiritual guidance.",
  },
  {
    eventId: "hidden_matters_revelation",
    specificity: "situational",
    coreHouses: [8],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [12],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "An overlooked matter receiving attention.",
  },
  {
    eventId: "hidden_matters_introspection",
    specificity: "situational",
    coreHouses: [8,12],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [4],
    reinforcingHouses: [5],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Reflection on private or unresolved concerns.",
  },
  {
    eventId: "hidden_matters_complication",
    specificity: "situational",
    coreHouses: [8,12],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "An unresolved matter requiring careful review.",
  },
  {
    eventId: "public_image_visibility",
    specificity: "situational",
    coreHouses: [10],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [1,11],
    reinforcingHouses: [3],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Greater visibility within a social or public setting.",
  },
  {
    eventId: "public_image_recognition",
    specificity: "situational",
    coreHouses: [10],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [9,11],
    reinforcingHouses: [1],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Potential acknowledgement or positive feedback.",
  },
  {
    eventId: "public_image_pressure",
    specificity: "situational",
    coreHouses: [10],
    requiredDistinctiveHouses: [],
    alternativeDistinctiveHouses: [6,8],
    reinforcingHouses: [1],
    minimumCoreHouses: 1,
    minimumDistinctiveHouses: 1,
    requiresIndependentTransit: true,
    requiresDailyTrigger: true,
    description: "Increased expectations or attention from others.",
  },
];

export const ADULT_ONLY_UNIFIED_EVENTS =
  new Set<string>([
  ...CAREER_EVENT_JUDGEMENT_RULES.map(rule => rule.eventId),
  ...MONEY_EVENT_JUDGEMENT_RULES.map(rule => rule.eventId),
  "relationship_commitment",
  "children_attention",
  "children_progress",
  "children_responsibility",
  "children_concern",
  "children_milestone",
  "property_attention",
  "property_progress",
  "property_complication",
]);

export function resolveUnifiedEventAgeEligibility(
  eventId: string,
  age: number | undefined
): boolean | null {
  if (
    typeof age !== "number" ||
    !Number.isFinite(age) ||
    age < 0
  ) {
    return null;
  }

  return !ADULT_ONLY_UNIFIED_EVENTS.has(eventId) ||
    age >= 18;
}

export const EVENT_JUDGEMENT_RULES:
  readonly EventJudgementRule[] = [
  ...CAREER_EVENT_JUDGEMENT_RULES,
  ...MONEY_EVENT_JUDGEMENT_RULES,
  ...ADDITIONAL_EVENT_JUDGEMENT_RULES,
];

export function getEventJudgementRule(
  eventId: EventThemeId
): EventJudgementRule | undefined {
  return EVENT_JUDGEMENT_RULES.find(
    (rule) => rule.eventId === eventId
  );
}