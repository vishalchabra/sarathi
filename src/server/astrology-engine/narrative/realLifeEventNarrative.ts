
export type RealLifeEventEvidence = {
  area: string;
  manifestationId: string | null;
  matchedPrimaryHouses: number[];
  matchedSupportingHouses: number[];
  discriminatorPlanetMatches: string[];
  transitDiscriminatorPlanetMatches: string[];
  hasMoonSambandhaConfirmation: boolean;
  isPrimaryDailyArea?: boolean;
dailyPriorityScore?: number;
  // Independent evidence diagnostics.
// Optional until connected to the existing astrology engine.
hasDirectDashaHouseEvidence?: boolean;
hasPrimaryHouseTransitEvidence?: boolean;
hasSupportingHouseTransitEvidence?: boolean;
hasTransitDiscriminatorOverlap?: boolean;
eventConfirmationStatus?:
  | "EVENT_CONFIRMED"
  | "AREA_CONFIRMED"
  | "EVENT_UNRESOLVED"
  | string;
};
export type RealLifeEventEvidenceAssessment = {
  level: "AREA_ONLY" | "SITUATION_SUPPORTED" | "EVENT_CONFIRMED";
  hasDashaSupport: boolean;
  hasMoonSupport: boolean;
  hasPrimaryTransitSupport: boolean;
  hasDiscriminatorSupport: boolean;
  reason: string;
};

export function assessRealLifeEventEvidence(
  evidence: RealLifeEventEvidence
): RealLifeEventEvidenceAssessment {
  const hasDashaSupport =
    evidence.hasDirectDashaHouseEvidence === true;

  const hasMoonSupport =
    evidence.hasMoonSambandhaConfirmation;

  const hasPrimaryTransitSupport =
    evidence.hasPrimaryHouseTransitEvidence === true;

  const hasDiscriminatorSupport =
    evidence.hasTransitDiscriminatorOverlap === true;

  if (
    evidence.manifestationId !== null &&
    evidence.eventConfirmationStatus === "EVENT_CONFIRMED"
  ) {
    return {
      level: "EVENT_CONFIRMED",
      hasDashaSupport,
      hasMoonSupport,
      hasPrimaryTransitSupport,
      hasDiscriminatorSupport,
      reason: "Existing event-confirmation engine confirmed the manifestation.",
    };
  }

  if (
    hasDashaSupport &&
    hasMoonSupport &&
    hasPrimaryTransitSupport &&
    hasDiscriminatorSupport
  ) {
    return {
      level: "SITUATION_SUPPORTED",
      hasDashaSupport,
      hasMoonSupport,
      hasPrimaryTransitSupport,
      hasDiscriminatorSupport,
      reason: "Dasha, Moon, primary-house transit and discriminator evidence converge.",
    };
  }

  return {
    level: "AREA_ONLY",
    hasDashaSupport,
    hasMoonSupport,
    hasPrimaryTransitSupport,
    hasDiscriminatorSupport,
    reason: "Insufficient independent evidence to distinguish a specific situation.",
  };
}
export type RealLifeEventNarrative = {
  eventId: string;

  area: string;

  specificity: "theme" | "situation" | "event";

  situationCategory: string;

  prediction: string;

  evidenceReason: string;

  evidenceTags: string[];

  expressionVariantId: string;

  repetitionKey: string;
};

export type RealLifeEventDefinition = {
  eventId: string;
  area: string;
  situationCategory: string;
  narrativeIntent?: "practical_guidance" | "situation_prediction" | "event_prediction";
  guidance?: string[];
  requiredPrimaryHouses: number[];
  requiredSupportingHouses: number[];

  relevantPlanets: string[];

  requiresMoonConfirmation: boolean;
  requiresTransitEvidence: boolean;
  requiresConfirmedManifestation: boolean;

  predictions: string[];
};

export function isRealLifeEventEligible(
  definition: RealLifeEventDefinition,
  evidence: RealLifeEventEvidence
): boolean {
  if (definition.area !== evidence.area) {
    return false;
  }

  if (
    definition.requiresConfirmedManifestation &&
    evidence.manifestationId === null
  ) {
    return false;
  }

  if (
    definition.requiresMoonConfirmation &&
    !evidence.hasMoonSambandhaConfirmation
  ) {
    return false;
  }

  if (definition.requiresTransitEvidence) {
  const hasRelevantTransit =
    definition.relevantPlanets.length > 0 &&
    definition.relevantPlanets.some((planet) =>
      evidence.transitDiscriminatorPlanetMatches.includes(planet)
    );

  if (!hasRelevantTransit) {
    return false;
  }
}

  if (
    !definition.requiredPrimaryHouses.every((house) =>
      evidence.matchedPrimaryHouses.includes(house)
    )
  ) {
    return false;
  }

  if (
    !definition.requiredSupportingHouses.every((house) =>
      evidence.matchedSupportingHouses.includes(house)
    )
  ) {
    return false;
  }

  if (
    definition.relevantPlanets.length > 0 &&
    !definition.relevantPlanets.some((planet) =>
      evidence.discriminatorPlanetMatches.includes(planet) ||
      evidence.transitDiscriminatorPlanetMatches.includes(planet)
    )
  ) {
    return false;
  }

  return true;
}

export const EDUCATION_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "education_revisit_unresolved_topic",
    area: "education",
    situationCategory: "learning_clarity",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [5, 9],
    requiredSupportingHouses: [],
    relevantPlanets: ["Mercury", "Jupiter"],
requiresMoonConfirmation: true,
requiresTransitEvidence: true,
    requiresConfirmedManifestation: false,
    predictions: [
      "You may return to a subject or question that previously left you uncertain, and find a different way to understand it.",
      "Something you studied or explored earlier may come back into focus, giving you an opportunity to look at it from a new angle.",
      "An unresolved question may prompt you to revisit information or seek a clearer explanation.",
    ],
    guidance: [
  "Consider revisiting a subject you have been trying to understand. A different explanation or approach may help.",
  "Use some time today to review an important question or learning topic without rushing to a conclusion.",
],
  },
  {
    eventId: "education_practical_skill",
    area: "education",
    situationCategory: "skill_development",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [5],
    requiredSupportingHouses: [3],
    relevantPlanets: ["Mercury"],
    requiresMoonConfirmation: true,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [
      "You may spend time practising a skill or applying something you recently learned.",
      "A practical task could give you an opportunity to improve a skill through direct experience.",
    ],
    guidance: [
  "Focus on applying something you have learned rather than only gathering more information.",
  "Consider practising a useful skill through a small, manageable task.",
],
  },
  {
    eventId: "education_mentor_guidance",
    area: "education",
    situationCategory: "guidance",
    narrativeIntent: "event_prediction",
    requiredPrimaryHouses: [9],
    requiredSupportingHouses: [],
    relevantPlanets: ["Jupiter"],
    requiresMoonConfirmation: true,
    requiresTransitEvidence: true,
    requiresConfirmedManifestation: false,
    predictions: [
      "A discussion with a teacher, mentor or experienced person may help clarify something important.",
      "You may receive useful guidance that changes how you approach a subject or decision.",
    ],
  },
  {
    eventId: "education_coursework_progress",
    area: "education",
    situationCategory: "academic_progress",
    narrativeIntent: "event_prediction",
    requiredPrimaryHouses: [4, 5],
    requiredSupportingHouses: [11],
    relevantPlanets: ["Mercury", "Jupiter"],
    requiresMoonConfirmation: true,
    requiresTransitEvidence: true,
    requiresConfirmedManifestation: true,
    predictions: [
      "You may complete an important piece of coursework or make measurable progress on an academic task.",
      "A pending assignment or learning milestone may move closer to completion.",
    ],
  },
  {
    eventId: "education_study_plan_adjustment",
    area: "education",
    situationCategory: "planning",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [5],
    requiredSupportingHouses: [],
    relevantPlanets: ["Saturn"],
    requiresMoonConfirmation: true,
    requiresTransitEvidence: true,
    requiresConfirmedManifestation: false,
    predictions: [
      "You may need to reorganise your study schedule or reconsider how much time to devote to a particular subject.",
      "A learning commitment may require a more structured plan or a change in priorities.",
    ],
    guidance: [
  "Review your learning priorities and identify one area that would benefit from more structure.",
  "Consider setting aside focused time for an important learning goal.",
],
  },
];
export const CAREER_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "career_task_prioritization",
    area: "career",
    situationCategory: "work_priorities",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [6, 10],
    requiredSupportingHouses: [],
    relevantPlanets: ["Saturn", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Identify the most important work responsibility today and give it focused attention before taking on additional tasks.",
      "Review your work priorities and concentrate on the responsibilities that need your attention most.",
    ],
  },
  {
    eventId: "career_professional_communication",
    area: "career",
    situationCategory: "professional_communication",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [10],
    requiredSupportingHouses: [3],
    relevantPlanets: ["Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Be clear and deliberate in professional communication, particularly when discussing expectations or responsibilities.",
      "Consider following up on an important work discussion and ensuring the next steps are understood.",
    ],
  },
  {
    eventId: "career_long_term_progress",
    area: "career",
    situationCategory: "career_development",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [10, 11],
    requiredSupportingHouses: [],
    relevantPlanets: ["Saturn", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review one professional goal and identify a practical step that could move it forward.",
      "Focus on steady professional progress rather than expecting every effort to produce an immediate result.",
    ],
  },
];
export const MONEY_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "money_upcoming_expenses",
    area: "money",
    situationCategory: "expense_planning",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 12],
    requiredSupportingHouses: [],
    relevantPlanets: ["Mercury", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review upcoming expenses and make sure essential payments are accounted for before committing to additional spending.",
      "Check your near-term financial obligations and plan how to accommodate them comfortably.",
    ],
  },
  {
    eventId: "money_spending_review",
    area: "money",
    situationCategory: "spending_management",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 12],
    requiredSupportingHouses: [],
    relevantPlanets: ["Venus", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review discretionary spending and identify anything that can reasonably be postponed.",
      "Before making a nonessential purchase, consider whether it supports your current financial priorities.",
    ],
  },
  {
    eventId: "money_pending_payments",
    area: "money",
    situationCategory: "payment_follow_up",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 11],
    requiredSupportingHouses: [],
    relevantPlanets: ["Mercury", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If a payment or reimbursement is pending, check its status and follow up where appropriate.",
      "Review outstanding financial transactions and ensure any required documentation or follow-up is complete.",
    ],
  },
  {
    eventId: "money_savings_planning",
    area: "money",
    situationCategory: "savings_planning",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 11],
    requiredSupportingHouses: [],
    relevantPlanets: ["Jupiter", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review your savings goals and consider one manageable step toward improving financial consistency.",
      "Look at your current income and expenditure balance to identify room for regular savings.",
    ],
  },
  {
    eventId: "money_financial_commitment",
    area: "money",
    situationCategory: "financial_decisions",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 8],
    requiredSupportingHouses: [11],
    relevantPlanets: ["Saturn", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review the terms and long-term affordability of any financial commitment before proceeding.",
      "Take time to understand repayment obligations, fees or conditions before making a significant financial decision.",
    ],
  },
];
export const RELATIONSHIP_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "relationship_clear_communication",
    area: "relationships",
    situationCategory: "communication",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [7],
    requiredSupportingHouses: [3],
    relevantPlanets: ["Mercury", "Venus"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Make time for a meaningful conversation with someone important to you, particularly if expectations need clarification.",
      "Express your thoughts clearly while giving the other person enough space to share their perspective.",
      "If something has been misunderstood, focus on clarifying intentions rather than assigning blame.",
    ],
  },
  {
    eventId: "relationship_expectations",
    area: "relationships",
    situationCategory: "mutual_expectations",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [7],
    requiredSupportingHouses: [2],
    relevantPlanets: ["Venus", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Consider whether your expectations of an important relationship are being communicated openly and fairly.",
      "Pay attention to the balance between what you expect from others and what you are able to offer.",
      "A small adjustment in expectations may help make an important relationship more comfortable.",
    ],
  },
  {
    eventId: "relationship_boundaries",
    area: "relationships",
    situationCategory: "personal_boundaries",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [7],
    requiredSupportingHouses: [6],
    relevantPlanets: ["Saturn", "Mars"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Be clear about your personal boundaries while respecting those of the people around you.",
      "If a request feels difficult to accommodate, communicate your limitations respectfully.",
      "Consider whether you are giving enough attention to your own needs alongside your commitments to others.",
    ],
  },
  {
    eventId: "relationship_cooperation",
    area: "relationships",
    situationCategory: "cooperation",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [7, 11],
    requiredSupportingHouses: [],
    relevantPlanets: ["Venus", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Look for an opportunity to work cooperatively with someone rather than handling every responsibility independently.",
      "Acknowledge another person's contribution and consider how shared effort could make progress easier.",
      "Strengthen an important connection through a practical gesture of support or appreciation.",
    ],
  },
  {
    eventId: "relationship_disagreement_resolution",
    area: "relationships",
    situationCategory: "conflict_resolution",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [7],
    requiredSupportingHouses: [6],
    relevantPlanets: ["Mars", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If a disagreement arises, focus on understanding the underlying concern before responding.",
      "Avoid turning a difference of opinion into a personal confrontation.",
      "Where tensions already exist, consider addressing one manageable issue rather than trying to resolve everything at once.",
    ],
  },
];
export const FAMILY_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "family_shared_responsibilities",
    area: "family",
    situationCategory: "family_responsibilities",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 4],
    requiredSupportingHouses: [],
    relevantPlanets: ["Saturn", "Moon"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review how family responsibilities are being shared and offer practical support where it is needed.",
      "Take care of an important family responsibility before allowing smaller tasks to consume your attention.",
      "Consider whether a household responsibility could be managed more effectively through cooperation.",
    ],
  },
  {
    eventId: "family_emotional_support",
    area: "family",
    situationCategory: "emotional_support",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4],
    requiredSupportingHouses: [2],
    relevantPlanets: ["Moon", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Make time to listen to a family member who may appreciate your attention or encouragement.",
      "A thoughtful conversation or small gesture of care can help strengthen emotional connections at home.",
      "Consider checking in with someone in your family whom you have not spent much time with recently.",
    ],
  },
  {
    eventId: "family_communication",
    area: "family",
    situationCategory: "family_communication",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 4],
    requiredSupportingHouses: [3],
    relevantPlanets: ["Mercury", "Moon"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Discuss an important household matter openly rather than assuming everyone shares the same understanding.",
      "Give family members an opportunity to express their views before making a shared decision.",
      "Choose a calm moment for any family discussion that requires patience or careful listening.",
    ],
  },
  {
    eventId: "family_quality_time",
    area: "family",
    situationCategory: "family_bonding",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 4],
    requiredSupportingHouses: [5],
    relevantPlanets: ["Moon", "Venus"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Set aside some uninterrupted time to connect with family beyond everyday responsibilities.",
      "Consider a simple shared activity that allows everyone to relax and enjoy time together.",
      "Give attention to a family relationship that may have taken a back seat to work or routine commitments.",
    ],
  },
  {
    eventId: "family_joint_decisions",
    area: "family",
    situationCategory: "household_decisions",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4],
    requiredSupportingHouses: [2, 11],
    relevantPlanets: ["Jupiter", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Before finalizing a decision affecting the household, consider the practical needs of everyone involved.",
      "Review the timing, responsibilities and resources involved in an upcoming family decision.",
      "A collaborative approach to household planning may help avoid unnecessary confusion later.",
    ],
  },
];
export const MIND_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "mind_focus_and_concentration",
    area: "mind",
    situationCategory: "mental_focus",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [1, 5],
    requiredSupportingHouses: [],
    relevantPlanets: ["Moon", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Choose one important task and give it your full attention before moving to something else.",
      "Reduce unnecessary distractions and create a short period of uninterrupted concentration.",
      "Organize your thoughts before beginning work that requires careful attention.",
    ],
  },
  {
    eventId: "mind_emotional_balance",
    area: "mind",
    situationCategory: "emotional_balance",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [1, 4],
    requiredSupportingHouses: [],
    relevantPlanets: ["Moon", "Venus"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Give yourself a moment to understand your feelings before responding to a situation.",
      "Maintain a steady routine and make room for activities that help you feel settled.",
      "If something is bothering you, consider whether it needs immediate attention or can be addressed more calmly later.",
    ],
  },
  {
    eventId: "mind_decision_clarity",
    area: "mind",
    situationCategory: "decision_making",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [1, 5],
    requiredSupportingHouses: [9],
    relevantPlanets: ["Mercury", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Before making an important decision, separate confirmed facts from assumptions.",
      "Write down your available options and consider their practical consequences.",
      "If a decision feels complicated, identify what additional information would help you move forward.",
    ],
  },
  {
    eventId: "mind_overthinking",
    area: "mind",
    situationCategory: "mental_clarity",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [1, 12],
    requiredSupportingHouses: [],
    relevantPlanets: ["Moon", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If your thoughts keep returning to the same concern, identify one useful action within your control.",
      "Avoid spending excessive time reconsidering decisions that do not require immediate resolution.",
      "Distinguish between problems you can address today and possibilities that may never materialize.",
    ],
  },
  {
    eventId: "mind_mental_rest",
    area: "mind",
    situationCategory: "mental_recovery",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4, 12],
    requiredSupportingHouses: [],
    relevantPlanets: ["Moon", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Make room for a short period of mental rest without filling every moment with another task.",
      "Consider reducing unnecessary stimulation before bedtime to support a more restful evening.",
      "Balance mentally demanding responsibilities with simple activities that allow you to unwind.",
    ],
  },
];
export const HEALTH_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "health_daily_routine",
    area: "health",
    situationCategory: "healthy_routines",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [1, 6],
    requiredSupportingHouses: [],
    relevantPlanets: ["Sun", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review your daily routine and identify one healthy habit you can maintain consistently.",
      "Give attention to regular meals, movement and rest rather than making several lifestyle changes at once.",
      "Choose one manageable improvement to your routine and focus on maintaining it.",
    ],
  },
  {
    eventId: "health_physical_activity",
    area: "health",
    situationCategory: "physical_activity",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [1, 6],
    requiredSupportingHouses: [3],
    relevantPlanets: ["Mars", "Sun"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Make room for physical activity appropriate to your fitness level and current health.",
      "Balance movement with adequate recovery instead of pushing through unnecessary physical strain.",
      "Consider a manageable activity that helps you stay consistent with your fitness routine.",
    ],
  },
  {
    eventId: "health_rest_and_recovery",
    area: "health",
    situationCategory: "rest_and_recovery",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [6, 12],
    requiredSupportingHouses: [],
    relevantPlanets: ["Moon", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Protect sufficient time for rest, particularly if your schedule has been demanding.",
      "Review whether your current routine allows adequate sleep and recovery.",
      "Avoid filling every available hour with activity when some time for recovery would be beneficial.",
    ],
  },
  {
    eventId: "health_nutrition_hydration",
    area: "health",
    situationCategory: "nutrition_and_hydration",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 6],
    requiredSupportingHouses: [],
    relevantPlanets: ["Moon", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Pay attention to balanced meals and hydration appropriate to your individual needs.",
      "Plan your meals thoughtfully rather than relying entirely on convenience when your schedule becomes busy.",
      "Consider whether your eating routine supports your daily activity and overall well-being.",
    ],
  },
  {
    eventId: "health_preventive_care",
    area: "health",
    situationCategory: "preventive_self_care",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [1, 6],
    requiredSupportingHouses: [8],
    relevantPlanets: ["Saturn", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Keep track of any routine health appointments or preventive checks that are due.",
      "If you have a persistent health concern, consider arranging an appropriate professional assessment.",
      "Review your preventive health routine and address any overdue follow-ups with a qualified healthcare professional.",
    ],
  },
];

export const HOME_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "home_household_organization",
    area: "home",
    situationCategory: "household_organization",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4],
    requiredSupportingHouses: [],
    relevantPlanets: ["Moon", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Identify one area of your home that could benefit from better organization and give it some attention.",
      "Review pending household tasks and prioritize those that will make your daily routine easier.",
      "Consider simplifying a part of your living space to make it more comfortable and functional.",
    ],
  },
  {
    eventId: "home_maintenance",
    area: "home",
    situationCategory: "home_maintenance",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4, 6],
    requiredSupportingHouses: [],
    relevantPlanets: ["Saturn", "Mars"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Check whether any routine household maintenance needs attention before it becomes inconvenient.",
      "Review a pending repair or maintenance task and consider arranging the necessary follow-up.",
      "Give attention to the practical upkeep of your living space rather than postponing manageable tasks.",
    ],
  },
  {
    eventId: "home_domestic_planning",
    area: "home",
    situationCategory: "domestic_planning",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4],
    requiredSupportingHouses: [2],
    relevantPlanets: ["Mercury", "Moon"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review upcoming household requirements and plan any necessary purchases or arrangements.",
      "Coordinate domestic responsibilities so that important tasks are not overlooked.",
      "Consider preparing a simple household plan for the coming days to reduce last-minute pressure.",
    ],
  },
  {
    eventId: "home_living_space_improvement",
    area: "home",
    situationCategory: "living_space_improvement",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4],
    requiredSupportingHouses: [11],
    relevantPlanets: ["Venus", "Moon"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Consider a small improvement that could make your home more comfortable or welcoming.",
      "Review whether your current living space supports the activities and routines that matter most.",
      "A simple adjustment to your home environment may help make everyday activities more convenient.",
    ],
  },
  {
    eventId: "home_household_resources",
    area: "home",
    situationCategory: "household_resources",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [2, 4],
    requiredSupportingHouses: [],
    relevantPlanets: ["Saturn", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review essential household supplies and replenish anything genuinely needed.",
      "Check recurring household expenses and consider whether any practical adjustments would be useful.",
      "Plan household purchases around actual requirements rather than making unnecessary commitments.",
    ],
  },
];

export const TRAVEL_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "travel_journey_preparation",
    area: "travel",
    situationCategory: "journey_preparation",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [3, 9],
    requiredSupportingHouses: [],
    relevantPlanets: ["Mercury", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you have an upcoming journey, review the essential arrangements early rather than leaving everything until departure.",
      "Check the practical details of any planned travel, including timing, transport and necessary belongings.",
      "Prepare a simple checklist for an upcoming journey so important arrangements are not overlooked.",
    ],
  },
  {
    eventId: "travel_schedule_coordination",
    area: "travel",
    situationCategory: "travel_coordination",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [3, 9],
    requiredSupportingHouses: [11],
    relevantPlanets: ["Mercury", "Moon"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If travel is planned, confirm schedules and meeting arrangements with the people involved.",
      "Allow reasonable flexibility in your itinerary rather than arranging every activity too tightly.",
      "Review transport connections and departure timings before finalizing your plans.",
    ],
  },
  {
    eventId: "travel_documentation",
    area: "travel",
    situationCategory: "travel_documents",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [9, 12],
    requiredSupportingHouses: [],
    relevantPlanets: ["Mercury", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "For any upcoming travel, check that required identification and travel documents are valid and accessible.",
      "Review booking confirmations and applicable entry requirements before an important journey.",
      "Keep essential travel information organized so it is easy to retrieve when needed.",
    ],
  },
  {
    eventId: "travel_practical_precautions",
    area: "travel",
    situationCategory: "travel_precautions",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [3, 12],
    requiredSupportingHouses: [],
    relevantPlanets: ["Saturn", "Mars"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you are travelling, allow sufficient time for the journey and avoid unnecessary rushing.",
      "Check weather, route conditions and practical safety requirements before setting out.",
      "Plan appropriate breaks and avoid fatigue during a demanding journey.",
    ],
  },
  {
    eventId: "travel_purpose_and_priorities",
    area: "travel",
    situationCategory: "travel_planning",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [9, 12],
    requiredSupportingHouses: [3],
    relevantPlanets: ["Jupiter", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you are considering a trip, clarify its main purpose before committing to arrangements.",
      "Review the time and resources required for planned travel and prioritize what matters most.",
      "Consider whether your proposed itinerary leaves enough room for the activities you value.",
    ],
  },
];

export const SPIRITUALITY_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "spirituality_daily_reflection",
    area: "spirituality",
    situationCategory: "self_reflection",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [9, 12],
    requiredSupportingHouses: [],
    relevantPlanets: ["Jupiter", "Moon"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Set aside a few quiet moments to reflect on what has been occupying your thoughts and attention.",
      "Consider whether your recent actions have been aligned with the values that matter most to you.",
      "Use a short period of reflection to gain perspective before returning to your daily responsibilities.",
    ],
  },
  {
    eventId: "spirituality_practice_consistency",
    area: "spirituality",
    situationCategory: "spiritual_discipline",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [9],
    requiredSupportingHouses: [12],
    relevantPlanets: ["Jupiter", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you follow a spiritual practice, give attention to consistency rather than the length or complexity of the ritual.",
      "Consider making time for a familiar prayer, meditation or reflective practice that is meaningful to you.",
      "A simple, regular spiritual routine may be more sustainable than adding several new practices at once.",
    ],
  },
  {
    eventId: "spirituality_learning",
    area: "spirituality",
    situationCategory: "spiritual_learning",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [5, 9],
    requiredSupportingHouses: [],
    relevantPlanets: ["Jupiter", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Explore a spiritual or philosophical teaching that interests you and consider how it applies to everyday life.",
      "Spend some time understanding the meaning behind a practice rather than following it mechanically.",
      "If a spiritual question has been on your mind, consider studying it through a source you trust.",
    ],
  },
  {
    eventId: "spirituality_service_compassion",
    area: "spirituality",
    situationCategory: "service_and_compassion",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [9, 12],
    requiredSupportingHouses: [6],
    relevantPlanets: ["Jupiter", "Venus"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Consider a small act of kindness or practical assistance that could make someone's day easier.",
      "Look for an opportunity to express your values through helpful action rather than words alone.",
      "If you wish to give or volunteer, choose something meaningful and comfortably within your means.",
    ],
  },
  {
    eventId: "spirituality_inner_balance",
    area: "spirituality",
    situationCategory: "inner_balance",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [9, 12],
    requiredSupportingHouses: [4],
    relevantPlanets: ["Moon", "Ketu"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Create a little space away from unnecessary distractions for quiet reflection or contemplation.",
      "Consider whether simplifying one part of your routine could leave more time for what feels meaningful.",
      "Balance your outward responsibilities with time for personal reflection and inner calm.",
    ],
  },
];

export const CHILDREN_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "children_education_support",
    area: "children",
    situationCategory: "education_support",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [5],
    requiredSupportingHouses: [4],
    relevantPlanets: ["Jupiter", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you have children, take an interest in their current learning activities and offer support where needed.",
      "Consider checking whether your child needs help organizing schoolwork or preparing for an upcoming activity.",
      "Encourage curiosity and learning through a conversation or activity suited to your child's interests.",
    ],
  },
  {
    eventId: "children_emotional_connection",
    area: "children",
    situationCategory: "emotional_connection",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [5],
    requiredSupportingHouses: [4],
    relevantPlanets: ["Moon", "Venus"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you have children, make time to listen to their experiences without immediately offering solutions.",
      "Consider spending some uninterrupted time with your child doing something they enjoy.",
      "A calm conversation may help you better understand what your child has been thinking or feeling.",
    ],
  },
  {
    eventId: "children_routine_responsibilities",
    area: "children",
    situationCategory: "routine_and_responsibilities",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [5],
    requiredSupportingHouses: [6],
    relevantPlanets: ["Saturn", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review whether your child's daily routine provides enough time for learning, play and rest.",
      "Consider helping your child develop a manageable routine for everyday responsibilities.",
      "If family schedules have become demanding, look for a practical way to simplify your child's routine.",
    ],
  },
  {
    eventId: "children_independence_growth",
    area: "children",
    situationCategory: "independence_and_growth",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [5],
    requiredSupportingHouses: [9],
    relevantPlanets: ["Jupiter", "Sun"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you have children, consider giving them an age-appropriate opportunity to make a small decision independently.",
      "Encourage your child to develop confidence by recognizing effort and progress rather than results alone.",
      "Look for a suitable opportunity to support your child's growing interests or abilities.",
    ],
  },
  {
    eventId: "children_family_coordination",
    area: "children",
    situationCategory: "parenting_coordination",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [5],
    requiredSupportingHouses: [2, 4],
    relevantPlanets: ["Moon", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you share parenting responsibilities, coordinate upcoming commitments to avoid unnecessary confusion.",
      "Review any practical arrangements involving your children and clarify responsibilities where needed.",
      "Consider discussing an upcoming family decision involving children so everyone understands the plan.",
    ],
  },
];

export const COMMUNICATION_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "communication_important_conversation",
    area: "communication",
    situationCategory: "important_conversation",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [3],
    requiredSupportingHouses: [7],
    relevantPlanets: ["Mercury", "Moon"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If an important conversation is pending, clarify the main point you want to communicate before beginning.",
      "Approach an important discussion with clear expectations and allow the other person time to explain their perspective.",
      "Consider choosing an appropriate time for a meaningful conversation rather than raising it in a rushed moment.",
    ],
  },
  {
    eventId: "communication_written_messages",
    area: "communication",
    situationCategory: "written_communication",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [3],
    requiredSupportingHouses: [6],
    relevantPlanets: ["Mercury", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review an important email or written message for clarity before sending it.",
      "Keep written communication focused on the main information and any action required.",
      "If you are preparing a formal message, check that the facts, tone and intended recipient are correct.",
    ],
  },
  {
    eventId: "communication_misunderstanding_resolution",
    area: "communication",
    situationCategory: "misunderstanding_resolution",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [3, 7],
    requiredSupportingHouses: [],
    relevantPlanets: ["Mercury", "Venus"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If a misunderstanding exists, ask a clarifying question before drawing conclusions about someone's intentions.",
      "When discussing a disagreement, separate what was actually said from what may have been assumed.",
      "Consider addressing a communication gap calmly rather than allowing uncertainty to continue.",
    ],
  },
  {
    eventId: "communication_information_sharing",
    area: "communication",
    situationCategory: "information_sharing",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [3],
    requiredSupportingHouses: [11],
    relevantPlanets: ["Mercury", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Before sharing important information, verify that it is accurate and relevant to the intended audience.",
      "Consider whether someone involved in an ongoing activity needs an update from you.",
      "Organize key information so others can understand it without unnecessary follow-up questions.",
    ],
  },
  {
    eventId: "communication_listening_and_response",
    area: "communication",
    situationCategory: "active_listening",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [3],
    requiredSupportingHouses: [2, 7],
    relevantPlanets: ["Moon", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Give the other person an opportunity to finish explaining before preparing your response.",
      "If a discussion becomes emotionally charged, take a moment to understand the concern before replying.",
      "Pay attention to both the words and the context of an important conversation to avoid unnecessary assumptions.",
    ],
  },
];

export const PUBLIC_IMAGE_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "public_image_professional_reputation",
    area: "publicImage",
    situationCategory: "professional_reputation",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [10],
    requiredSupportingHouses: [11],
    relevantPlanets: ["Sun", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Give attention to the quality and reliability of work that others may associate with your professional reputation.",
      "Consider whether your recent professional commitments are being followed through consistently.",
      "Focus on demonstrating reliability through practical actions rather than seeking immediate recognition.",
    ],
  },
  {
    eventId: "public_image_public_communication",
    area: "publicImage",
    situationCategory: "public_communication",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [10, 11],
    requiredSupportingHouses: [3],
    relevantPlanets: ["Sun", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you are communicating with a wider audience, ensure your message is clear, accurate and appropriate.",
      "Review the tone and content of any public statement or professional update before sharing it.",
      "Consider how your words may be understood by people who do not have the full background of the situation.",
    ],
  },
  {
    eventId: "public_image_social_presence",
    area: "publicImage",
    situationCategory: "social_presence",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [11],
    requiredSupportingHouses: [3],
    relevantPlanets: ["Venus", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review whether your public or professional profile accurately reflects your current interests and experience.",
      "If you share content publicly, consider whether it communicates the values and qualities you want to represent.",
      "Give attention to the consistency of your online presence rather than posting simply to remain visible.",
    ],
  },
  {
    eventId: "public_image_network_relationships",
    area: "publicImage",
    situationCategory: "professional_networking",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [10, 11],
    requiredSupportingHouses: [7],
    relevantPlanets: ["Jupiter", "Venus"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Consider reconnecting with a professional contact where there is a genuine reason to maintain the relationship.",
      "Focus on building meaningful connections through mutual respect and useful exchanges.",
      "If a networking opportunity arises, approach it with curiosity rather than concentrating only on immediate benefits.",
    ],
  },
  {
    eventId: "public_image_feedback_and_perception",
    area: "publicImage",
    situationCategory: "feedback_and_perception",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [10],
    requiredSupportingHouses: [7, 11],
    relevantPlanets: ["Sun", "Saturn", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you receive feedback about your work or conduct, consider which observations may be useful for improvement.",
      "Reflect on whether your actions are communicating the professional qualities you intend to demonstrate.",
      "Avoid reacting immediately to criticism; evaluate the substance of the feedback before deciding how to respond.",
    ],
  },
];

export const HIDDEN_MATTERS_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "hidden_matters_private_responsibilities",
    area: "hiddenMatters",
    situationCategory: "private_responsibilities",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [8, 12],
    requiredSupportingHouses: [],
    relevantPlanets: ["Saturn", "Mercury"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Review any private responsibilities that may need attention without sharing unnecessary personal details.",
      "If an unresolved personal matter requires action, identify one practical step you can take.",
      "Consider organizing confidential personal information so it remains accessible when genuinely needed.",
    ],
  },
  {
    eventId: "hidden_matters_confidentiality",
    area: "hiddenMatters",
    situationCategory: "confidentiality_and_privacy",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [8],
    requiredSupportingHouses: [12],
    relevantPlanets: ["Mercury", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Be thoughtful about sharing sensitive information, especially when the recipient or purpose is unclear.",
      "Review the privacy of important documents or accounts and address any practical concerns.",
      "Respect the confidentiality of information entrusted to you and share it only when appropriate.",
    ],
  },
  {
    eventId: "hidden_matters_unresolved_questions",
    area: "hiddenMatters",
    situationCategory: "unresolved_questions",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [8],
    requiredSupportingHouses: [3],
    relevantPlanets: ["Mercury", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If something remains unclear, distinguish verified facts from assumptions before taking action.",
      "Consider seeking reliable information about an unresolved matter rather than relying on speculation.",
      "Break a complicated question into smaller parts and identify what information is still missing.",
    ],
  },
  {
    eventId: "hidden_matters_shared_obligations",
    area: "hiddenMatters",
    situationCategory: "shared_obligations",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [8],
    requiredSupportingHouses: [2, 7],
    relevantPlanets: ["Saturn", "Venus"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you have shared financial or administrative obligations, review the agreed responsibilities and deadlines.",
      "Check that important arrangements involving shared resources are properly documented.",
      "Where responsibilities overlap, consider clarifying expectations before making further commitments.",
    ],
  },
  {
    eventId: "hidden_matters_personal_reflection",
    area: "hiddenMatters",
    situationCategory: "private_reflection",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [8, 12],
    requiredSupportingHouses: [4],
    relevantPlanets: ["Moon", "Ketu"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "Set aside some private time to reflect on a personal concern without pressuring yourself to resolve everything immediately.",
      "Consider whether an old concern still requires practical attention or can reasonably be set aside.",
      "If a private matter is weighing on your mind, identify a constructive next step or a trusted source of support.",
    ],
  },
];

export const PROPERTY_REAL_LIFE_EVENTS: RealLifeEventDefinition[] = [
  {
    eventId: "property_maintenance_planning",
    area: "property",
    situationCategory: "property_maintenance",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4],
    requiredSupportingHouses: [6],
    relevantPlanets: ["Saturn", "Mars"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you own or manage a property, review any maintenance requirements and prioritize necessary work.",
      "Consider checking whether a property-related repair or inspection needs scheduling.",
      "Plan routine property upkeep before committing to optional improvements or renovations.",
    ],
  },
  {
    eventId: "property_documentation",
    area: "property",
    situationCategory: "property_documentation",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4],
    requiredSupportingHouses: [3, 8],
    relevantPlanets: ["Mercury", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you have property-related documents, check that important records are organized and accessible.",
      "Review the dates and terms of any upcoming property-related renewal or administrative requirement.",
      "Before signing a property document, read the relevant conditions carefully and clarify anything uncertain.",
    ],
  },
  {
    eventId: "property_financial_planning",
    area: "property",
    situationCategory: "property_finances",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4, 2],
    requiredSupportingHouses: [8],
    relevantPlanets: ["Venus", "Saturn"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you are considering a property-related expense, review its affordability alongside your other commitments.",
      "Consider budgeting for recurring property costs, including maintenance and applicable fees.",
      "Before making a significant property commitment, compare the expected costs with your available resources.",
    ],
  },
  {
    eventId: "property_ownership_responsibilities",
    area: "property",
    situationCategory: "ownership_responsibilities",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4, 8],
    requiredSupportingHouses: [7],
    relevantPlanets: ["Saturn", "Jupiter"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you share property responsibilities, clarify who is handling important payments, records or maintenance.",
      "Review any existing property obligations and ensure important deadlines are not overlooked.",
      "Where property arrangements involve other people, keep agreements and responsibilities clearly documented.",
    ],
  },
  {
    eventId: "property_decision_evaluation",
    area: "property",
    situationCategory: "property_decisions",
    narrativeIntent: "practical_guidance",
    requiredPrimaryHouses: [4],
    requiredSupportingHouses: [2, 11],
    relevantPlanets: ["Jupiter", "Mercury", "Venus"],
    requiresMoonConfirmation: false,
    requiresTransitEvidence: false,
    requiresConfirmedManifestation: false,
    predictions: [],
    guidance: [
      "If you are considering buying, selling or renting property, compare your options against your practical requirements.",
      "Before making a property decision, evaluate location, costs, suitability and longer-term responsibilities.",
      "Take time to verify important property information and seek qualified advice where legal or financial details require it.",
    ],
  },
];

export type RealLifeEventMatch = {
  definition: RealLifeEventDefinition;

  // Existing score based on eligibility-rule specificity.
  // Retained for compatibility with current tests.
  evidenceStrength: number;

  // Actual matched evidence, calculated separately.
  // This will eventually drive event selection.
  astrologicalSupportScore: number;
  astrologicalSupportBreakdown: {
  primaryHousePoints: number;
  supportingHousePoints: number;
  moonConfirmationPoints: number;
  uniquePlanetPoints: number;
  dailyTransitPoints: number;
};
  matchedEvidenceTags: string[];
};

export function findEligibleRealLifeEvents(
  definitions: RealLifeEventDefinition[],
  evidence: RealLifeEventEvidence
): RealLifeEventMatch[] {
  return definitions
    .filter((definition) =>
      isRealLifeEventEligible(definition, evidence)
    )
    .map((definition) => {
      const matchedEvidenceTags: string[] = [];
      if (evidence.transitDiscriminatorPlanetMatches.length > 0) {
  for (const planet of evidence.transitDiscriminatorPlanetMatches) {
    matchedEvidenceTags.push(
      `transit_discriminator_${planet.toLowerCase()}`
    );
  }
}
      for (const house of definition.requiredPrimaryHouses) {
        matchedEvidenceTags.push(`primary_house_${house}`);
      }

      for (const house of definition.requiredSupportingHouses) {
        matchedEvidenceTags.push(`supporting_house_${house}`);
      }

      if (
        definition.requiresMoonConfirmation &&
        evidence.hasMoonSambandhaConfirmation
      ) {
        matchedEvidenceTags.push("moon_confirmed");
      }

      if (
        definition.requiresTransitEvidence &&
        evidence.transitDiscriminatorPlanetMatches.length > 0
      ) {
        matchedEvidenceTags.push("transit_confirmed");
      }

      if (
        definition.requiresConfirmedManifestation &&
        evidence.manifestationId !== null
      ) {
        matchedEvidenceTags.push("manifestation_confirmed");
      }

      const evidenceStrength =
        definition.requiredPrimaryHouses.length * 2 +
        definition.requiredSupportingHouses.length +
        (definition.requiresMoonConfirmation ? 2 : 0) +
        (definition.requiresTransitEvidence ? 3 : 0) +
        (definition.requiresConfirmedManifestation ? 4 : 0);
    const matchedRelevantTransits = [
  ...new Set(
    definition.relevantPlanets.filter((planet) =>
      evidence.transitDiscriminatorPlanetMatches.includes(planet)
    )
  ),
];

const matchedRelevantNatalPlanets = [
  ...new Set(
    definition.relevantPlanets.filter((planet) =>
      evidence.discriminatorPlanetMatches.includes(planet)
    )
  ),
];

// Count each relevant planet once across natal and transit
// evidence. A separate transit bonus records daily activation
// without treating the same planet as independent confirmation.
const uniqueRelevantPlanets = new Set([
  ...matchedRelevantNatalPlanets,
  ...matchedRelevantTransits,
]);

const hasRelevantDailyTransit =
  matchedRelevantTransits.length > 0;

const astrologicalSupportScore =
  definition.requiredPrimaryHouses.length * 2 +
  definition.requiredSupportingHouses.length +
  (evidence.hasMoonSambandhaConfirmation ? 2 : 0) +
  uniqueRelevantPlanets.size +
  (hasRelevantDailyTransit ? 2 : 0);
      return {
  definition,
  evidenceStrength,
  astrologicalSupportScore,
  astrologicalSupportBreakdown: {
    primaryHousePoints:
      definition.requiredPrimaryHouses.length * 2,
    supportingHousePoints:
      definition.requiredSupportingHouses.length,
    moonConfirmationPoints:
      evidence.hasMoonSambandhaConfirmation ? 2 : 0,
    uniquePlanetPoints:
      uniqueRelevantPlanets.size,
    dailyTransitPoints:
      hasRelevantDailyTransit ? 2 : 0,
  },
  matchedEvidenceTags,
};
    })
    .sort(
      (a, b) =>
        b.evidenceStrength - a.evidenceStrength ||
        a.definition.eventId.localeCompare(b.definition.eventId)
    );
}

export type RealLifeEventHistory = {
  eventId: string;
  date: string;
};

export type RealLifeEventSelection = {
  match: RealLifeEventMatch;
  repetitionCount: number;
  selectionScore: number;
};

export function rankRealLifeEventsByHistory(
  matches: RealLifeEventMatch[],
  history: RealLifeEventHistory[],
  currentDate: string,
  lookbackDays = 7
): RealLifeEventSelection[] {
  const currentDay = Date.parse(`${currentDate}T00:00:00Z`);

  if (!Number.isFinite(currentDay)) {
    return [];
  }

  return matches
    .map((match) => {
      const repetitionCount = history.filter((entry) => {
        if (entry.eventId !== match.definition.eventId) {
          return false;
        }

        const previousDay = Date.parse(
          `${entry.date}T00:00:00Z`
        );

        const daysAgo =
          (currentDay - previousDay) / 86_400_000;

        return (
          Number.isFinite(daysAgo) &&
          daysAgo > 0 &&
          daysAgo <= lookbackDays
        );
      }).length;

      // Repetition can influence selection among comparably
// supported situations, but must not override a clear
// difference in evidence specificity.
// Evidence strength remains the primary ranking criterion.
// Repetition only changes ordering between equally
// supported events.
const repetitionPenalty = repetitionCount * 3;

const selectionScore =
  match.evidenceStrength - repetitionPenalty;

      return {
        match,
        repetitionCount,
        selectionScore,
      };
    })
    .sort(
  (a, b) =>
    b.match.evidenceStrength - a.match.evidenceStrength ||
    b.selectionScore - a.selectionScore ||
    a.match.definition.eventId.localeCompare(
      b.match.definition.eventId
    )
);
}

export type RealLifeEventExpression = {
  eventId: string;
  expressionVariantId: string;
  prediction: string;
  repetitionKey: string;
};

export function selectRealLifeEventExpression(
  definition: RealLifeEventDefinition,
  date: string,
  previousVariantIds: string[] = []
): RealLifeEventExpression | null {
  if (definition.predictions.length === 0) {
    return null;
  }

  const availableVariants = definition.predictions.map(
    (prediction, index) => ({
      prediction,
      expressionVariantId: `${definition.eventId}_v${index + 1}`,
    })
  );

  const unusedVariants = availableVariants.filter(
    (variant) =>
      !previousVariantIds.includes(variant.expressionVariantId)
  );

  const candidates =
    unusedVariants.length > 0
      ? unusedVariants
      : availableVariants;

  // Stable date-based selection: the same event and date
  // produce the same wording unless history changes.
  const seed = `${definition.eventId}:${date}`;

  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  const index = (hash >>> 0) % candidates.length;
  const selected = candidates[index];

  return {
    eventId: definition.eventId,
    expressionVariantId: selected.expressionVariantId,
    prediction: selected.prediction,
    repetitionKey: definition.eventId,
  };
}

export type RealLifeEventResolutionInput = {
  evidence: RealLifeEventEvidence;
  date: string;
  history?: RealLifeEventHistory[];
  previousVariantIds?: string[];
};

export function resolveCandidateRealLifeEvent(
  input: RealLifeEventResolutionInput
): RealLifeEventNarrative | null {
  const {
    evidence,
    date,
    history = [],
    previousVariantIds = [],
  } = input;

  // Preserve the existing confirmed-event narrative.
  if (evidence.manifestationId !== null) {
    return null;
  }
// Require independent evidence convergence before
// generating an unconfirmed real-life situation.
// Preserve the existing broader narrative otherwise.
const evidenceAssessment = assessRealLifeEventEvidence(evidence);

if (evidenceAssessment.level !== "SITUATION_SUPPORTED") {
  return null;
}
  const definitions: RealLifeEventDefinition[] = [
    ...EDUCATION_REAL_LIFE_EVENTS,
  ];

  const matches = findEligibleRealLifeEvents(
    definitions,
    evidence
  );

  if (matches.length === 0) {
    return null;
  }

  const ranked = rankRealLifeEventsByHistory(
    matches,
    history,
    date
  );

  const selected = ranked[0];

  if (!selected) {
    return null;
  }
// Broad house and Moon evidence can establish a life-area
// focus without identifying a specific real-life situation.
// Require independent daily transit evidence before
// selecting an unconfirmed situation-level prediction.
// An unconfirmed situation must have transit evidence
// relevant to the selected event, not merely to the area.
const selectedDefinition = selected.match.definition;

const hasRelevantTransit =
  selectedDefinition.relevantPlanets.length > 0 &&
  selectedDefinition.relevantPlanets.some((planet) =>
    evidence.transitDiscriminatorPlanetMatches.includes(planet)
  );

if (evidence.manifestationId === null && !hasRelevantTransit) {
  return null;
}
  const expression = selectRealLifeEventExpression(
    selected.match.definition,
    date,
    previousVariantIds
  );

  if (!expression) {
    return null;
  }

  return {
    eventId: expression.eventId,
    area: evidence.area,
    specificity: "situation",
    situationCategory:
      selected.match.definition.situationCategory,
    prediction: expression.prediction,
    evidenceReason:
      `Eligible situation based on ${selected.match.matchedEvidenceTags.join(", ")}.`,
    evidenceTags:
      selected.match.matchedEvidenceTags,
    expressionVariantId:
      expression.expressionVariantId,
    repetitionKey:
      expression.repetitionKey,
  };
}

export function resolveRealLifeEventNarrative(
  evidence: RealLifeEventEvidence
): RealLifeEventNarrative | null {
  // A specific manifestation must be confirmed
  // before this layer describes a specific event.
  if (evidence.manifestationId !== null) {
    return null;
  }

  // For now, leave unconfirmed situations to the
  // existing narrative engine until evidence-based
  // situation mappings are implemented.
  return null;
}
export function testRealLifeEventResolver(): {
  testDate: string;
  result: RealLifeEventNarrative | null;
  evidenceAssessment: RealLifeEventEvidenceAssessment;
} {
  const testDate = "2026-10-03";

  const result = resolveCandidateRealLifeEvent({
    date: testDate,
    evidence: {
      area: "education",
      manifestationId: null,
      matchedPrimaryHouses: [5, 9],
      matchedSupportingHouses: [],
      discriminatorPlanetMatches: ["Rahu"],
      transitDiscriminatorPlanetMatches: [],
      hasMoonSambandhaConfirmation: true,
      hasDirectDashaHouseEvidence: true,
hasPrimaryHouseTransitEvidence: false,
hasSupportingHouseTransitEvidence: true,
hasTransitDiscriminatorOverlap: false,
eventConfirmationStatus: "AREA_CONFIRMED",
    },
  });
   return {
  testDate,
  result,
  evidenceAssessment: assessRealLifeEventEvidence({
    area: "education",
    manifestationId: null,
    matchedPrimaryHouses: [5, 9],
    matchedSupportingHouses: [],
    discriminatorPlanetMatches: ["Rahu"],
    transitDiscriminatorPlanetMatches: [],
    hasMoonSambandhaConfirmation: true,
    hasDirectDashaHouseEvidence: true,
    hasPrimaryHouseTransitEvidence: false,
    hasSupportingHouseTransitEvidence: true,
    hasTransitDiscriminatorOverlap: false,
    eventConfirmationStatus: "AREA_CONFIRMED",
  }),
};
}
export function testPositiveRealLifeEventResolver(): {
  testDate: string;
  result: RealLifeEventNarrative | null;
} {
  const testDate = "2026-10-03";

  const result = resolveCandidateRealLifeEvent({
    date: testDate,
    evidence: {
      area: "education",
      manifestationId: null,
      matchedPrimaryHouses: [5, 9],
      matchedSupportingHouses: [],
      discriminatorPlanetMatches: ["Rahu"],
      transitDiscriminatorPlanetMatches: ["Mercury"],
      hasMoonSambandhaConfirmation: true,
    },
  });

  return {
    testDate,
    result,
  };
}
export function testRealLifeEventRepetition() {
  const evidence: RealLifeEventEvidence = {
    area: "education",
    manifestationId: null,
    matchedPrimaryHouses: [5, 9],
    matchedSupportingHouses: [],
    discriminatorPlanetMatches: ["Rahu", "Saturn"],
    transitDiscriminatorPlanetMatches: ["Mercury", "Saturn"],
    hasMoonSambandhaConfirmation: true,
  };

  const matches = findEligibleRealLifeEvents(
    EDUCATION_REAL_LIFE_EVENTS,
    evidence
  );

  const history: RealLifeEventHistory[] = [
    {
      eventId: "education_revisit_unresolved_topic",
      date: "2026-10-01",
    },
    {
      eventId: "education_revisit_unresolved_topic",
      date: "2026-10-02",
    },
  ];

  return {
    withoutHistory: rankRealLifeEventsByHistory(
      matches,
      [],
      "2026-10-03"
    ).map((item) => ({
  eventId: item.match.definition.eventId,
  evidenceStrength: item.match.evidenceStrength,
  astrologicalSupportScore:
    item.match.astrologicalSupportScore,
    astrologicalSupportBreakdown:
  item.match.astrologicalSupportBreakdown,
  selectionScore: item.selectionScore,
})),

    withHistory: rankRealLifeEventsByHistory(
      matches,
      history,
      "2026-10-03"
    ).map((item) => ({
  eventId: item.match.definition.eventId,
  evidenceStrength: item.match.evidenceStrength,
  astrologicalSupportScore:
    item.match.astrologicalSupportScore,
    astrologicalSupportBreakdown:
  item.match.astrologicalSupportBreakdown,
  selectionScore: item.selectionScore,
  repetitionCount: item.repetitionCount,
})),
  };
}
export function testEqualStrengthEventRepetition() {
  const definitions: RealLifeEventDefinition[] = [
    {
      ...EDUCATION_REAL_LIFE_EVENTS[0],
      eventId: "test_learning_revision",
    },
    {
      ...EDUCATION_REAL_LIFE_EVENTS[0],
      eventId: "test_learning_exploration",
    },
  ];

  const evidence: RealLifeEventEvidence = {
    area: "education",
    manifestationId: null,
    matchedPrimaryHouses: [5, 9],
    matchedSupportingHouses: [],
    discriminatorPlanetMatches: ["Rahu"],
    transitDiscriminatorPlanetMatches: ["Mercury"],
    hasMoonSambandhaConfirmation: true,
  };

  const matches = findEligibleRealLifeEvents(
    definitions,
    evidence
  );

  const history: RealLifeEventHistory[] = [
    {
      eventId: "test_learning_exploration",
      date: "2026-10-02",
    },
  ];

  return {
    withoutHistory: rankRealLifeEventsByHistory(
      matches,
      [],
      "2026-10-03"
    ).map((item) => ({
      eventId: item.match.definition.eventId,
      evidenceStrength: item.match.evidenceStrength,
      selectionScore: item.selectionScore,
    })),

    withHistory: rankRealLifeEventsByHistory(
      matches,
      history,
      "2026-10-03"
    ).map((item) => ({
      eventId: item.match.definition.eventId,
      evidenceStrength: item.match.evidenceStrength,
      selectionScore: item.selectionScore,
      repetitionCount: item.repetitionCount,
    })),
  };
}
export function testSupportedSituationAssessment() {
  const evidence: RealLifeEventEvidence = {
    area: "education",
    manifestationId: null,
    matchedPrimaryHouses: [5, 9],
    matchedSupportingHouses: [],
    discriminatorPlanetMatches: ["Mercury"],
    transitDiscriminatorPlanetMatches: ["Mercury"],
    hasMoonSambandhaConfirmation: true,
    hasDirectDashaHouseEvidence: true,
    hasPrimaryHouseTransitEvidence: true,
    hasSupportingHouseTransitEvidence: false,
    hasTransitDiscriminatorOverlap: true,
    eventConfirmationStatus: "EVENT_UNRESOLVED",
  };

  return {
    testCase: "synthetic_supported_situation",
    assessment: assessRealLifeEventEvidence(evidence),
  };
}
export type RealLifePracticalGuidance = {
  area: string;
  eventId: string;
  narrativeIntent: "practical_guidance";
  guidance: string;
  evidenceLevel: "AREA_ONLY";
};

export function resolveAreaPracticalGuidance(
  evidence: RealLifeEventEvidence,
  date: string
): RealLifePracticalGuidance | null {
  const assessment = assessRealLifeEventEvidence(evidence);

  if (assessment.level !== "AREA_ONLY") {
    return null;
  }

const guidanceDefinitionsByArea: Record<
  string,
  RealLifeEventDefinition[]
> = {
  education: EDUCATION_REAL_LIFE_EVENTS,
  career: CAREER_REAL_LIFE_EVENTS,
  money: MONEY_REAL_LIFE_EVENTS,
  relationships: RELATIONSHIP_REAL_LIFE_EVENTS,
  family: FAMILY_REAL_LIFE_EVENTS,
  mind: MIND_REAL_LIFE_EVENTS,
  health: HEALTH_REAL_LIFE_EVENTS,
  home: HOME_REAL_LIFE_EVENTS,
  travel: TRAVEL_REAL_LIFE_EVENTS,
  spirituality: SPIRITUALITY_REAL_LIFE_EVENTS,
  children: CHILDREN_REAL_LIFE_EVENTS,
  communication: COMMUNICATION_REAL_LIFE_EVENTS,
  publicImage: PUBLIC_IMAGE_REAL_LIFE_EVENTS,
  hiddenMatters: HIDDEN_MATTERS_REAL_LIFE_EVENTS,
  property: PROPERTY_REAL_LIFE_EVENTS,
};

const areaDefinitions =
  guidanceDefinitionsByArea[evidence.area];

if (!areaDefinitions) {
  return null;
}

  // An activated life area alone supports general guidance,
  // not a claim that a specific event will occur.
 const relevantHousesByArea: Record<string, number[]> = {
  education: [4, 5, 9],
  career: [6, 10, 11],
  money: [2, 8, 11, 12],
  relationships: [7, 11],
  family: [2, 4, 5],
  mind: [1, 4, 5, 12],
  health: [1, 2, 6, 8, 12],
  home: [2, 4, 6, 11],
  travel: [3, 9, 12],
  spirituality: [4, 5, 6, 9, 12],
  children: [2, 4, 5, 6, 9],
  communication: [2, 3, 6, 7, 11],
  publicImage: [3, 7, 10, 11],
  hiddenMatters: [2, 3, 4, 7, 8, 12],
  property: [2, 3, 4, 6, 7, 8, 11],
};

const relevantHouses = relevantHousesByArea[evidence.area];

if (!relevantHouses) {
  return null;
}

const hasRelevantHouseEvidence =
  evidence.matchedPrimaryHouses.some((house) =>
    relevantHouses.includes(house)
  );

const hasIndependentActivation =
  assessment.hasDashaSupport ||
  assessment.hasMoonSupport;

const hasConfirmedArea =
  evidence.eventConfirmationStatus === "AREA_CONFIRMED";

const hasPrimaryAreaActivation =
  evidence.isPrimaryDailyArea === true &&
  typeof evidence.dailyPriorityScore === "number" &&
  Number.isFinite(evidence.dailyPriorityScore) &&
  evidence.dailyPriorityScore > 0;

if (
  !hasRelevantHouseEvidence ||
  !(
    (hasConfirmedArea && hasIndependentActivation) ||
    hasPrimaryAreaActivation
  )
) {
  return null;
}

const eligible = areaDefinitions.filter(
  (definition) =>
    definition.narrativeIntent === "practical_guidance" &&
    (definition.guidance?.length ?? 0) > 0 &&
    definition.requiredPrimaryHouses.some((house) =>
      evidence.matchedPrimaryHouses.includes(house)
    )
);
if (process.env.NODE_ENV === "development") {
  console.log("[REAL LIFE GUIDANCE ELIGIBILITY]", {
    date,
    area: evidence.area,
    matchedPrimaryHouses: evidence.matchedPrimaryHouses,
    eligibleCount: eligible.length,
    definitions: EDUCATION_REAL_LIFE_EVENTS.map((definition) => ({
      eventId: definition.eventId,
      narrativeIntent: definition.narrativeIntent,
      guidanceCount: definition.guidance?.length ?? 0,
      requiredPrimaryHouses: definition.requiredPrimaryHouses,
    })),
  });
}
  if (eligible.length === 0) {
    return null;
  }

  // Stable selection for the same date and evidence.
  const dateNumber = Number(date.replace(/-/g, ""));
  if (!Number.isFinite(dateNumber)) {
    return null;
  }

  const ranked = [...eligible].sort((a, b) => {
  const score = (definition: RealLifeEventDefinition) => {
    const primaryMatches = definition.requiredPrimaryHouses.filter(
      (house) => evidence.matchedPrimaryHouses.includes(house)
    ).length;

    const supportingMatches = definition.requiredSupportingHouses.filter(
      (house) => evidence.matchedSupportingHouses.includes(house)
    ).length;

    const planetMatches = definition.relevantPlanets.filter(
      (planet) =>
        evidence.discriminatorPlanetMatches.includes(planet) ||
        evidence.transitDiscriminatorPlanetMatches.includes(planet)
    ).length;

    return (
      primaryMatches * 3 +
      supportingMatches * 2 +
      planetMatches * 4
    );
  };

  return (
    score(b) - score(a) ||
    a.eventId.localeCompare(b.eventId)
  );
});

const selected = ranked[0];
  const guidance = selected.guidance;

  if (!guidance?.length) {
    return null;
  }

  return {
    area: evidence.area,
    eventId: selected.eventId,
    narrativeIntent: "practical_guidance",
    guidance: guidance[
      Math.floor(dateNumber / eligible.length) % guidance.length
    ],
    evidenceLevel: "AREA_ONLY",
  };
}
