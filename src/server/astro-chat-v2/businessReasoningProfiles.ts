import type {
  AstroChatV2Intent,
  AstroChatV2Event,
  QuestionClassification,
} from "./questionClassifier";

export type ResponseSectionKey =
  | "verdict"
  | "timing"
  | "suitability"
  | "decision"
  | "strategy"
  | "journey"
  | "advice"
  | "risks"
  | "evidence";

export type BusinessReasoningProfile = {
  key: string;

  topic: "business";
  intent: AstroChatV2Intent;
  event: AstroChatV2Event;

  title: string;
  userGoal: string;

  showSections: ResponseSectionKey[];
  hideSections: ResponseSectionKey[];

  requiresTiming: boolean;
  requiresDecision: boolean;
  requiresSuitability: boolean;
  requiresCurrentTransits: boolean;

  astrologyFocus: {
    primaryHouses: number[];
    supportHouses: number[];
    karakas: string[];
    divisionalCharts: string[];
    evidencePriority: string[];
  };

  reasoningQuestions: string[];

  lifecycleStages: Array<{
    key: string;
    label: string;
    examples: string[];
  }>;

  responseRules: {
    leadWith: ResponseSectionKey;
    maxMainParagraphs: number;
    showExactDate: boolean;
    showScoresInMainAnswer: boolean;
    showTechnicalEvidenceInMainAnswer: boolean;
    tone: "senior_astrologer" | "direct_consultant";
  };
};

const BUSINESS_SUITABILITY_PROFILE: BusinessReasoningProfile = {
  key: "business_type:suitability",

  topic: "business",
  intent: "suitability",
  event: "business_type",

  title: "Business Suitability",
  userGoal:
    "Identify the kinds of businesses, industries, operating models, and commercial roles that best match the chart.",

  showSections: [
    "verdict",
    "suitability",
    "strategy",
    "risks",
    "evidence",
  ],

  hideSections: [
    "timing",
    "decision",
    "journey",
  ],

  requiresTiming: false,
  requiresDecision: false,
  requiresSuitability: true,
  requiresCurrentTransits: false,

  astrologyFocus: {
    primaryHouses: [2, 7, 10, 11],
    supportHouses: [3, 5, 9],
    karakas: [
      "Mercury",
      "Jupiter",
      "Saturn",
      "Rahu",
      "Venus",
    ],
    divisionalCharts: [
      "D1",
      "D10",
      "D2",
      "D9",
    ],
    evidencePriority: [
      "10th house and lord for profession and operating style",
      "7th house and lord for trade, clients, and partnerships",
      "2nd and 11th houses for monetisation and gains",
      "Mercury for commerce, analysis, communication, and systems",
      "Jupiter for advisory, education, finance, and knowledge-led work",
      "Saturn for structure, operations, discipline, and scalability",
      "Rahu for technology, unconventional models, digital reach, and foreign markets",
      "D10 for professional execution",
      "D2 for income model and financial sustainability",
    ],
  },

  reasoningQuestions: [
    "Which planets dominate the person's commercial style?",
    "Does the chart favour knowledge-led, product-led, service-led, trading-led, or asset-heavy business?",
    "Is the person better suited to solo ownership, partnerships, advisory work, platforms, or operating businesses?",
    "Which industries are naturally supported?",
    "Which business models are lower fit or higher risk?",
    "What scale and pace suit the chart?",
  ],

  lifecycleStages: [
    {
      key: "fit",
      label: "Natural Fit",
      examples: [
        "industry",
        "business model",
        "role in the business",
      ],
    },
    {
      key: "commercial_model",
      label: "Commercial Model",
      examples: [
        "service",
        "subscription",
        "platform",
        "advisory",
        "product",
      ],
    },
    {
      key: "operating_style",
      label: "Operating Style",
      examples: [
        "solo",
        "partner-led",
        "digital-first",
        "relationship-led",
        "structured",
      ],
    },
    {
      key: "risk_fit",
      label: "Risk Fit",
      examples: [
        "capital intensity",
        "leverage",
        "inventory",
        "speculation",
      ],
    },
  ],

  responseRules: {
    leadWith: "suitability",
    maxMainParagraphs: 4,
    showExactDate: false,
    showScoresInMainAnswer: false,
    showTechnicalEvidenceInMainAnswer: false,
    tone: "senior_astrologer",
  },
};

const BUSINESS_DECISION_PROFILE: BusinessReasoningProfile = {
  key: "business_start:decision",

  topic: "business",
  intent: "decision",
  event: "business_start",

  title: "Business Start Decision",
  userGoal:
    "Advise whether the person should start a business now, prepare first, proceed gradually, or avoid an all-in transition.",

  showSections: [
    "verdict",
    "decision",
    "strategy",
    "advice",
    "risks",
    "evidence",
  ],

  hideSections: [
    "timing",
    "suitability",
    "journey",
  ],

  requiresTiming: false,
  requiresDecision: true,
  requiresSuitability: false,
  requiresCurrentTransits: true,

  astrologyFocus: {
    primaryHouses: [7, 10],
    supportHouses: [2, 3, 11],
    karakas: [
      "Mercury",
      "Saturn",
      "Jupiter",
      "Rahu",
    ],
    divisionalCharts: [
      "D1",
      "D10",
      "D2",
      "D9",
    ],
    evidencePriority: [
      "Natal promise for entrepreneurship and independent work",
      "Relationship between the 7th and 10th lords",
      "Income and gains support through the 2nd and 11th houses",
      "D10 confirmation for professional execution",
      "D2 confirmation for cash-flow sustainability",
      "Current dasha activation",
      "Current transits only as a supporting decision factor",
    ],
  },

  reasoningQuestions: [
    "Is business genuinely supported in the natal chart?",
    "Is the current phase suitable for preparation, controlled launch, or full transition?",
    "Should the person keep existing income while building the business?",
    "What commercial proof is required before scaling?",
    "What risks should be avoided?",
  ],

  lifecycleStages: [
    {
      key: "validation",
      label: "Validation",
      examples: [
        "clear offer",
        "target customer",
        "paying demand",
      ],
    },
    {
      key: "controlled_launch",
      label: "Controlled Launch",
      examples: [
        "first customers",
        "basic compliance",
        "small operating setup",
      ],
    },
    {
      key: "commercial_proof",
      label: "Commercial Proof",
      examples: [
        "repeat revenue",
        "retention",
        "stable margins",
      ],
    },
    {
      key: "transition",
      label: "Full Transition",
      examples: [
        "dependable income",
        "capital buffer",
        "operating stability",
      ],
    },
  ],

  responseRules: {
    leadWith: "decision",
    maxMainParagraphs: 3,
    showExactDate: false,
    showScoresInMainAnswer: false,
    showTechnicalEvidenceInMainAnswer: false,
    tone: "direct_consultant",
  },
};

const BUSINESS_TIMING_PROFILE: BusinessReasoningProfile = {
  key: "business_start:timing",

  topic: "business",
  intent: "timing",
  event: "business_start",

  title: "Business Start Timing",
  userGoal:
    "Identify when to validate, launch, secure commercial proof, and expand the business.",

  showSections: [
    "verdict",
    "timing",
    "journey",
    "strategy",
    "advice",
    "risks",
    "evidence",
  ],

  hideSections: [
    "suitability",
  ],

  requiresTiming: true,
  requiresDecision: true,
  requiresSuitability: false,
  requiresCurrentTransits: true,

  astrologyFocus: {
    primaryHouses: [7, 10],
    supportHouses: [2, 3, 11],
    karakas: [
      "Mercury",
      "Saturn",
      "Jupiter",
      "Rahu",
    ],
    divisionalCharts: [
      "D1",
      "D10",
      "D2",
      "D9",
    ],
    evidencePriority: [
      "Natal business promise",
      "Sambandha between business and income lords",
      "D10 professional execution",
      "D2 revenue sustainability",
      "Dasha activation",
      "Transit trigger",
      "Difference between launch, first revenue, and expansion",
    ],
  },

  reasoningQuestions: [
    "What is the best period for validation?",
    "What is the best period for public launch?",
    "When is commercial proof more likely?",
    "When should the person avoid overexpansion?",
    "Does the timing support a side business or full transition?",
  ],

  lifecycleStages: [
    {
      key: "validation",
      label: "Validation",
      examples: [
        "research",
        "offer testing",
        "first paying customers",
      ],
    },
    {
      key: "launch",
      label: "Launch",
      examples: [
        "registration",
        "public opening",
        "client outreach",
      ],
    },
    {
      key: "commercial_proof",
      label: "Commercial Proof",
      examples: [
        "repeat customers",
        "stable revenue",
        "market response",
      ],
    },
    {
      key: "expansion",
      label: "Expansion",
      examples: [
        "team",
        "capital",
        "new markets",
        "scale",
      ],
    },
  ],

  responseRules: {
    leadWith: "timing",
    maxMainParagraphs: 4,
    showExactDate: true,
    showScoresInMainAnswer: false,
    showTechnicalEvidenceInMainAnswer: false,
    tone: "senior_astrologer",
  },
};

const BUSINESS_GENERIC_PROFILE: BusinessReasoningProfile = {
  key: "business:generic",

  topic: "business",
  intent: "generic",
  event: "generic_event",

  title: "Business Overview",
  userGoal:
    "Provide a general business-oriented reading without forcing timing, decision, or suitability conclusions.",

  showSections: [
    "verdict",
    "strategy",
    "risks",
    "evidence",
  ],

  hideSections: [
    "timing",
    "decision",
    "suitability",
    "journey",
  ],

  requiresTiming: false,
  requiresDecision: false,
  requiresSuitability: false,
  requiresCurrentTransits: false,

  astrologyFocus: {
    primaryHouses: [7, 10],
    supportHouses: [2, 3, 11],
    karakas: [
      "Mercury",
      "Saturn",
      "Jupiter",
      "Rahu",
    ],
    divisionalCharts: [
      "D1",
      "D10",
      "D2",
    ],
    evidencePriority: [
      "General business promise",
      "Professional execution",
      "Income sustainability",
    ],
  },

  reasoningQuestions: [
    "What business strengths are visible?",
    "What risks should be managed?",
    "What is the most useful practical interpretation?",
  ],

  lifecycleStages: [],

  responseRules: {
    leadWith: "verdict",
    maxMainParagraphs: 3,
    showExactDate: false,
    showScoresInMainAnswer: false,
    showTechnicalEvidenceInMainAnswer: false,
    tone: "senior_astrologer",
  },
};

const BUSINESS_PROFILES: Record<string, BusinessReasoningProfile> = {
  [BUSINESS_SUITABILITY_PROFILE.key]:
    BUSINESS_SUITABILITY_PROFILE,

  [BUSINESS_DECISION_PROFILE.key]:
    BUSINESS_DECISION_PROFILE,

  [BUSINESS_TIMING_PROFILE.key]:
    BUSINESS_TIMING_PROFILE,

  [BUSINESS_GENERIC_PROFILE.key]:
    BUSINESS_GENERIC_PROFILE,
};

export function getBusinessReasoningProfile(
  classification: QuestionClassification
): BusinessReasoningProfile {
  if (classification.topic !== "business") {
    throw new Error(
      `Business reasoning profile requested for topic "${classification.topic}".`
    );
  }

  const exactProfile =
    BUSINESS_PROFILES[
      classification.reasoningProfileKey
    ];

  if (exactProfile) {
    return exactProfile;
  }

  if (
    classification.event === "business_type" ||
    classification.intent === "suitability"
  ) {
    return BUSINESS_SUITABILITY_PROFILE;
  }

  if (
    classification.event === "business_start" &&
    classification.intent === "timing"
  ) {
    return BUSINESS_TIMING_PROFILE;
  }

  if (
    classification.event === "business_start" &&
    (
      classification.intent === "decision" ||
      classification.intent === "strategy"
    )
  ) {
    return BUSINESS_DECISION_PROFILE;
  }

  return BUSINESS_GENERIC_PROFILE;
}
