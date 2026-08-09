import type {
  CertificationQuestion,
} from "./types";

export const MARRIAGE_CERTIFICATION:
  CertificationQuestion[] = [
  {
    id: "marriage_partner_type",

    category:
      "marriage",

    question:
      "What kind of partner would suit me best?",

    expectedCapabilities: [
      "communication",
      "empathy",
      "relationships",
      "responsibility",
    ],

    preferredCapabilities: [
      "negotiation",
      "mentoring",
      "dharma",
    ],

    forbiddenCapabilities: [],

    expectedPlanets: [
      "Venus",
      "Jupiter",
      "Moon",
    ],

    expectedEvidence: [
      "7th house",
      "7th lord",
      "Venus",
      "D9",
      "Sambandha",
    ],

    expectedThemes: [
      "partnership",
      "compatibility",
      "emotional connection",
      "commitment",
    ],

    minimumConfidence:
      45,

    notes:
      "Permanent relationship-pattern question. Timing should not dominate the answer.",
  },

  {
    id: "marriage_suitability",

    category:
      "marriage",

    question:
      "Am I naturally suited for marriage?",

    expectedCapabilities: [
      "relationships",
      "empathy",
      "responsibility",
      "communication",
    ],

    preferredCapabilities: [
      "negotiation",
      "dharma",
    ],

    forbiddenCapabilities: [],

    expectedPlanets: [
      "Venus",
      "Jupiter",
      "Moon",
    ],

    expectedEvidence: [
      "7th house",
      "7th lord",
      "D9",
      "Venus",
      "Jupiter",
    ],

    expectedThemes: [
      "commitment",
      "partnership",
      "marital capacity",
      "relationship stability",
    ],

    minimumConfidence:
      45,

    notes:
      "Suitability question. Current dasha/transits should not decide permanent marriage capacity.",
  },

  {
    id: "marriage_relationship_pattern",

    category:
      "marriage",

    question:
      "Why do my relationships become difficult?",

    expectedCapabilities: [
      "relationships",
      "empathy",
      "communication",
      "responsibility",
    ],

    preferredCapabilities: [
      "negotiation",
      "transformation",
    ],

    forbiddenCapabilities: [],

    expectedPlanets: [
      "Venus",
      "Moon",
      "Mars",
      "Saturn",
    ],

    expectedEvidence: [
      "7th house",
      "7th lord",
      "Venus",
      "Moon",
      "D9",
      "Sambandha",
    ],

    expectedThemes: [
      "relationship pattern",
      "conflict",
      "emotional needs",
      "communication",
    ],

    minimumConfidence:
      40,

    notes:
      "Diagnostic relationship-pattern question. Do not reduce the answer to marriage timing.",
  },

  {
    id: "marriage_love_or_arranged",

    category:
      "marriage",

    question:
      "Am I more suited to love marriage or arranged marriage?",

    expectedCapabilities: [
      "relationships",
      "communication",
      "empathy",
    ],

    preferredCapabilities: [
      "independence",
      "dharma",
      "responsibility",
    ],

    forbiddenCapabilities: [],

    expectedPlanets: [
      "Venus",
      "Moon",
      "Jupiter",
      "Rahu",
    ],

    expectedEvidence: [
      "5th house",
      "7th house",
      "5th lord",
      "7th lord",
      "Venus",
      "D9",
      "Sambandha",
    ],

    expectedThemes: [
      "romance",
      "marriage",
      "family involvement",
      "choice",
    ],

    minimumConfidence:
      40,

    notes:
      "This should be treated as relationship-style/promise analysis, not a timing question.",
  },

  {
    id: "marriage_timing",

    category:
      "marriage",

    question:
      "When am I likely to get married?",

    expectedCapabilities: [
      "relationships",
    ],

    preferredCapabilities: [
      "responsibility",
      "empathy",
    ],

    forbiddenCapabilities: [],

    expectedPlanets: [
      "Venus",
      "Jupiter",
    ],

    expectedEvidence: [
      "7th house",
      "7th lord",
      "D9",
      "dasha",
      "transit",
      "timing window",
    ],

    expectedThemes: [
      "marriage timing",
      "commitment",
      "conversion",
    ],

    minimumConfidence:
      45,

    notes:
      "Timing question. Dasha, transit and conversion windows are allowed and expected.",
  },

  {
    id: "marriage_meeting_partner",

    category:
      "marriage",

    question:
      "When am I likely to meet a serious partner?",

    expectedCapabilities: [
      "relationships",
      "communication",
    ],

    preferredCapabilities: [
      "empathy",
      "responsibility",
    ],

    forbiddenCapabilities: [],

    expectedPlanets: [
      "Venus",
      "Jupiter",
      "Moon",
    ],

    expectedEvidence: [
      "5th house",
      "7th house",
      "7th lord",
      "D9",
      "dasha",
      "transit",
    ],

    expectedThemes: [
      "meeting",
      "relationship activation",
      "serious partnership",
    ],

    minimumConfidence:
      40,

    notes:
      "Timing is appropriate here, but meeting someone must not automatically be treated as marriage completion.",
  },

  {
    id: "marriage_commitment_vs_attraction",

    category:
      "marriage",

    question:
      "Do I have stronger attraction patterns or stronger commitment patterns?",

    expectedCapabilities: [
      "relationships",
      "empathy",
      "responsibility",
    ],

    preferredCapabilities: [
      "communication",
      "negotiation",
    ],

    forbiddenCapabilities: [],

    expectedPlanets: [
      "Venus",
      "Moon",
      "Mars",
      "Saturn",
      "Jupiter",
    ],

    expectedEvidence: [
      "5th house",
      "7th house",
      "Venus",
      "D9",
      "Sambandha",
    ],

    expectedThemes: [
      "attraction",
      "commitment",
      "romance",
      "stability",
    ],

    minimumConfidence:
      40,

    notes:
      "Permanent relationship-style analysis. Timing should be suppressed.",
  },

  {
    id: "marriage_child_guardrail",

    category:
      "marriage",

    question:
      "When will I get married?",

    expectedCapabilities: [
      "relationships",
    ],

    preferredCapabilities: [],

    forbiddenCapabilities: [],

    expectedPlanets: [
      "Venus",
      "Jupiter",
    ],

    expectedEvidence: [
      "7th house",
      "D9",
    ],

    expectedThemes: [
      "future relationship potential",
      "emotional development",
    ],

    minimumConfidence:
      35,

    notes:
      "Life-stage guardrail test. If userContext indicates a child, do not present imminent marriage dates or adult commitment advice.",
  },
];