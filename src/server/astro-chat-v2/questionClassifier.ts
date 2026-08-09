export type AstroChatV2Topic =
  | "career"
  | "business"
  | "money"
  | "property"
  | "vehicle"
  | "marriage"
  | "relationships"
  | "health"
  | "education"
  | "relocation"
  | "travel"
  | "children"
  | "disputes"
  | "spiritual"
  | "generic";

export type AstroChatV2Intent =
  | "timing"
  | "decision"
  | "suitability"
  | "prediction"
  | "comparison"
  | "strategy"
  | "diagnosis"
  | "remedy"
  | "explanation"
  | "profile"
  | "generic";

export type AstroChatV2Event =
  | "job_change"
  | "promotion"
  | "salary_increase"
  | "career_direction"
  | "business_start"
  | "business_type"
  | "business_success"
  | "business_partner"
  | "business_expansion"
  | "property_purchase"
  | "property_sale"
  | "vehicle_purchase"
  | "marriage_timing"
  | "relationship_improvement"
  | "health_recovery"
  | "education_admission"
  | "foreign_move"
  | "generic_event";

export type QuestionClassification = {
  originalQuestion: string;
  normalizedQuestion: string;

  topic: AstroChatV2Topic;
  intent: AstroChatV2Intent;
  event: AstroChatV2Event;

  confidence: "high" | "medium" | "low";

  matchedTopicSignals: string[];
  matchedIntentSignals: string[];
  matchedEventSignals: string[];

  requiresTiming: boolean;
  requiresDecision: boolean;
  requiresSuitability: boolean;
  requiresEvidence: boolean;
  requiresCurrentTransits: boolean;

  reasoningProfileKey: string;
};

type KeywordRule<T extends string> = {
  value: T;
  keywords: string[];
  priority?: number;
};

const TOPIC_RULES: KeywordRule<AstroChatV2Topic>[] = [
  {
    value: "business",
    priority: 100,
    keywords: [
      "business",
      "startup",
      "start-up",
      "entrepreneur",
      "entrepreneurship",
      "company",
      "self employed",
      "self-employed",
      "own venture",
      "own work",
      "partnership business",
      "commercial venture",
    ],
  },
  {
    value: "career",
    priority: 95,
    keywords: [
      "job",
      "career",
      "promotion",
      "profession",
      "employer",
      "workplace",
      "role",
      "salary",
      "boss",
      "resign",
      "resignation",
      "new position",
      "switch company",
      "change company",
    ],
  },
  {
    value: "money",
    keywords: [
      "money",
      "wealth",
      "income",
      "finance",
      "financial",
      "savings",
      "bonus",
      "cash flow",
      "investment",
    ],
  },
  {
    value: "property",
    keywords: [
      "property",
      "house",
      "home",
      "flat",
      "apartment",
      "land",
      "plot",
      "real estate",
      "mortgage",
    ],
  },
  {
    value: "vehicle",
    keywords: [
      "vehicle",
      "car",
      "bike",
      "automobile",
      "suv",
    ],
  },
  {
    value: "marriage",
    keywords: [
      "marriage",
      "marry",
      "wedding",
      "spouse",
      "husband",
      "wife",
      "engagement",
    ],
  },
  {
    value: "relationships",
    keywords: [
      "relationship",
      "love",
      "partner",
      "boyfriend",
      "girlfriend",
      "reconciliation",
      "separation",
      "divorce",
    ],
  },
  {
    value: "health",
    keywords: [
      "health",
      "illness",
      "recovery",
      "disease",
      "treatment",
      "mental health",
      "anxiety",
      "stress",
      "sleep",
    ],
  },
  {
    value: "education",
    keywords: [
      "education",
      "study",
      "studies",
      "course",
      "college",
      "university",
      "exam",
      "admission",
      "degree",
    ],
  },
  {
    value: "relocation",
    keywords: [
      "relocate",
      "relocation",
      "move abroad",
      "foreign settlement",
      "settle abroad",
      "shift country",
      "migration",
    ],
  },
  {
    value: "travel",
    keywords: [
      "travel",
      "trip",
      "journey",
      "visa",
      "pilgrimage",
      "holiday abroad",
    ],
  },
  {
    value: "children",
    keywords: [
      "child",
      "children",
      "baby",
      "pregnancy",
      "conceive",
      "son",
      "daughter",
    ],
  },
  {
    value: "disputes",
    keywords: [
      "court",
      "legal",
      "case",
      "dispute",
      "conflict",
      "litigation",
    ],
  },
  {
    value: "spiritual",
    keywords: [
      "spiritual",
      "remedy",
      "mantra",
      "deity",
      "worship",
      "meditation",
      "karma",
      "karmic",
      "purpose",
    ],
  },
];

const INTENT_RULES: KeywordRule<AstroChatV2Intent>[] = [
  {
    value: "timing",
    priority: 100,
    keywords: [
      "when",
      "which year",
      "which month",
      "how soon",
      "by when",
      "what time",
      "best period",
      "best time",
      "timing",
      "date",
    ],
  },
  {
    value: "suitability",
    priority: 95,
    keywords: [
      "what kind",
      "which kind",
      "what type",
      "which type",
      "best suited",
      "suitable for",
      "what should i do",
      "which business",
      "what business",
      "which career",
      "what career",
    ],
  },
  {
    value: "decision",
    priority: 90,
    keywords: [
      "should i",
      "shall i",
      "is it advisable",
      "is it good for me",
      "would it be wise",
      "can i start",
      "can i buy",
      "can i resign",
      "should we",
    ],
  },
  {
    value: "comparison",
    priority: 85,
    keywords: [
      "or",
      "better between",
      "which is better",
      "compare",
      "versus",
      "vs",
    ],
  },
  {
    value: "strategy",
    keywords: [
      "how should i",
      "what should i do now",
      "how can i",
      "how do i improve",
      "how to proceed",
      "what steps",
      "strategy",
      "plan",
    ],
  },
  {
    value: "remedy",
    keywords: [
      "remedy",
      "what should i wear",
      "mantra",
      "pooja",
      "worship",
      "fasting",
      "daan",
      "gemstone",
    ],
  },
  {
    value: "diagnosis",
    keywords: [
      "why is",
      "why am i",
      "what is blocking",
      "what is wrong",
      "why does",
      "why do",
      "reason for",
    ],
  },
  {
    value: "prediction",
    keywords: [
      "will i",
      "will my",
      "will there be",
      "is there a chance",
      "possibility of",
      "can this happen",
      "will it happen",
    ],
  },
  {
    value: "profile",
    keywords: [
      "what am i like",
      "what are my strengths",
      "what is my nature",
      "what does my chart say about me",
      "personality",
      "profile",
    ],
  },
  {
    value: "explanation",
    keywords: [
      "what does",
      "explain",
      "meaning of",
      "how does",
      "tell me about",
    ],
  },
];

const EVENT_RULES: KeywordRule<AstroChatV2Event>[] = [
  {
    value: "job_change",
    priority: 100,
    keywords: [
      "new job",
      "change my job",
      "change job",
      "job change",
      "switch job",
      "switch company",
      "change employer",
      "new employer",
      "resign",
      "resignation",
    ],
  },
  {
    value: "promotion",
    priority: 95,
    keywords: [
      "promotion",
      "promoted",
      "title change",
      "higher role",
      "career elevation",
    ],
  },
  {
    value: "salary_increase",
    keywords: [
      "salary increase",
      "salary hike",
      "increment",
      "pay rise",
      "bonus",
    ],
  },
  {
    value: "career_direction",
    keywords: [
      "career direction",
      "which career",
      "what career",
      "profession suited",
    ],
  },
  {
    value: "business_type",
    priority: 100,
    keywords: [
      "what kind of business",
      "which kind of business",
      "what type of business",
      "which type of business",
      "what business should",
      "which business should",
      "business suitable",
      "best business for me",
    ],
  },
  {
    value: "business_start",
    priority: 95,
    keywords: [
      "start a business",
      "start business",
      "launch a business",
      "begin a business",
      "open a business",
      "set up a business",
      "setup a business",
    ],
  },
  {
    value: "business_success",
    keywords: [
      "business succeed",
      "successful in business",
      "business success",
      "will my business work",
      "will business grow",
    ],
  },
  {
    value: "business_partner",
    keywords: [
      "business partner",
      "take a partner",
      "partnership",
      "cofounder",
      "co-founder",
    ],
  },
  {
    value: "business_expansion",
    keywords: [
      "expand business",
      "business expansion",
      "scale business",
      "grow my business",
    ],
  },
  {
    value: "property_purchase",
    keywords: [
      "buy property",
      "buy a house",
      "purchase property",
      "purchase home",
    ],
  },
  {
    value: "property_sale",
    keywords: [
      "sell property",
      "sell my house",
      "property sale",
    ],
  },
  {
    value: "vehicle_purchase",
    keywords: [
      "buy a car",
      "new car",
      "buy vehicle",
      "purchase vehicle",
    ],
  },
  {
    value: "marriage_timing",
    keywords: [
      "when will i marry",
      "marriage timing",
      "get married",
    ],
  },
  {
    value: "relationship_improvement",
    keywords: [
      "relationship improve",
      "married life improve",
      "reconcile",
      "reconciliation",
    ],
  },
  {
    value: "health_recovery",
    keywords: [
      "health improve",
      "recover",
      "recovery",
      "get better",
    ],
  },
  {
    value: "education_admission",
    keywords: [
      "admission",
      "university acceptance",
      "college acceptance",
      "course admission",
    ],
  },
  {
    value: "foreign_move",
    keywords: [
      "move abroad",
      "foreign move",
      "settle abroad",
      "relocate abroad",
    ],
  },
];

function normalizeQuestion(question: string): string {
  return String(question ?? "")
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[?!.,;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsSignal(text: string, keyword: string): boolean {
  const normalizedKeyword = normalizeQuestion(keyword);
  if (!normalizedKeyword) return false;

  if (normalizedKeyword.includes(" ")) {
    return text.includes(normalizedKeyword);
  }

  const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

function evaluateRules<T extends string>(
  text: string,
  rules: KeywordRule<T>[]
): {
  value: T | null;
  matches: string[];
  score: number;
} {
  let bestValue: T | null = null;
  let bestMatches: string[] = [];
  let bestScore = 0;

  for (const rule of rules) {
    const matches = rule.keywords.filter((keyword) =>
      containsSignal(text, keyword)
    );

    if (matches.length === 0) continue;

    const priority = rule.priority ?? 50;
    const longestMatch = Math.max(...matches.map((match) => match.length));
    const score = priority * 100 + matches.length * 10 + longestMatch;

    if (score > bestScore) {
      bestValue = rule.value;
      bestMatches = matches;
      bestScore = score;
    }
  }

  return {
    value: bestValue,
    matches: bestMatches,
    score: bestScore,
  };
}

function inferTopicFromEvent(
  event: AstroChatV2Event
): AstroChatV2Topic | null {
  switch (event) {
    case "job_change":
    case "promotion":
    case "salary_increase":
    case "career_direction":
      return "career";

    case "business_start":
    case "business_type":
    case "business_success":
    case "business_partner":
    case "business_expansion":
      return "business";

    case "property_purchase":
    case "property_sale":
      return "property";

    case "vehicle_purchase":
      return "vehicle";

    case "marriage_timing":
      return "marriage";

    case "relationship_improvement":
      return "relationships";

    case "health_recovery":
      return "health";

    case "education_admission":
      return "education";

    case "foreign_move":
      return "relocation";

    default:
      return null;
  }
}

function inferIntentFromEvent(
  event: AstroChatV2Event,
  detectedIntent: AstroChatV2Intent | null
): AstroChatV2Intent {
  if (detectedIntent) return detectedIntent;

  switch (event) {
    case "business_type":
    case "career_direction":
      return "suitability";

    case "business_start":
    case "business_partner":
      return "decision";

    case "business_success":
    case "promotion":
    case "salary_increase":
    case "relationship_improvement":
    case "health_recovery":
      return "prediction";

    default:
      return "generic";
  }
}

function buildReasoningProfileKey(
  topic: AstroChatV2Topic,
  intent: AstroChatV2Intent,
  event: AstroChatV2Event
): string {
  const eventKey =
    event === "generic_event"
      ? topic
      : event;

  return `${eventKey}:${intent}`;
}

function calculateConfidence(params: {
  topicScore: number;
  intentScore: number;
  eventScore: number;
  topic: AstroChatV2Topic;
  intent: AstroChatV2Intent;
  event: AstroChatV2Event;
}): "high" | "medium" | "low" {
  const {
    topicScore,
    intentScore,
    eventScore,
    topic,
    intent,
    event,
  } = params;

  const explicitSignals = [
    topic !== "generic",
    intent !== "generic",
    event !== "generic_event",
  ].filter(Boolean).length;

  const totalScore = topicScore + intentScore + eventScore;

  if (explicitSignals >= 2 && totalScore >= 12_000) {
    return "high";
  }

  if (explicitSignals >= 2 || totalScore >= 6_000) {
    return "medium";
  }

  return "low";
}

export function classifyAstroQuestion(
  question: string
): QuestionClassification {
  const normalizedQuestion = normalizeQuestion(question);

  const topicResult = evaluateRules(
    normalizedQuestion,
    TOPIC_RULES
  );

  const intentResult = evaluateRules(
    normalizedQuestion,
    INTENT_RULES
  );

  const eventResult = evaluateRules(
    normalizedQuestion,
    EVENT_RULES
  );

  const event =
    eventResult.value ??
    "generic_event";

  const inferredTopic =
    inferTopicFromEvent(event);

  const topic =
    inferredTopic ??
    topicResult.value ??
    "generic";

  const intent =
    inferIntentFromEvent(
      event,
      intentResult.value
    );

  const confidence =
    calculateConfidence({
      topicScore: topicResult.score,
      intentScore: intentResult.score,
      eventScore: eventResult.score,
      topic,
      intent,
      event,
    });

  const requiresTiming =
    intent === "timing" ||
    (
      intent === "prediction" &&
      /\bwhen\b|\bwhich year\b|\bwhich month\b/.test(
        normalizedQuestion
      )
    );

  const requiresDecision =
    intent === "decision" ||
    intent === "comparison" ||
    intent === "strategy";

  const requiresSuitability =
    intent === "suitability" ||
    event === "business_type" ||
    event === "career_direction";

  const requiresCurrentTransits =
    requiresTiming ||
    intent === "prediction" ||
    intent === "decision";

  return {
    originalQuestion: question,
    normalizedQuestion,

    topic,
    intent,
    event,

    confidence,

    matchedTopicSignals:
      topicResult.matches,

    matchedIntentSignals:
      intentResult.matches,

    matchedEventSignals:
      eventResult.matches,

    requiresTiming,
    requiresDecision,
    requiresSuitability,

    requiresEvidence:
      topic !== "generic",

    requiresCurrentTransits,

    reasoningProfileKey:
      buildReasoningProfileKey(
        topic,
        intent,
        event
      ),
  };
}
