import type {
  ReasoningIntent,
} from "../types";

type IntentRule = {
  intent: ReasoningIntent;
  phrases: string[];
  tokens: string[];
  priority: number;
};

const INTENT_RULES: IntentRule[] = [
  {
    intent: "business_suitability",
    phrases: [
      "should i start",
      "should i open",
      "should i launch",
      "start a business",
      "start my own business",
      "business should i start",
      "company should i start",
      "business suitability",
    ],
    tokens: [
      "business",
      "startup",
      "company",
      "founder",
      "entrepreneur",
      "venture",
      "saas",
      "consulting business",
      "brand",
    ],
    priority: 100,
  },
  {
    intent: "education_suitability",
    phrases: [
      "should i study",
      "should i learn",
      "which course",
      "what should i study",
      "is this course suitable",
      "education suitability",
    ],
    tokens: [
      "study",
      "course",
      "degree",
      "university",
      "college",
      "education",
      "learn",
      "training",
    ],
    priority: 90,
  },
  {
    intent: "role_suitability",
    phrases: [
      "would i make a good",
      "am i suited to be",
      "could i become a",
      "can i lead as",
      "role suitability",
    ],
    tokens: [
      "ceo",
      "manager",
      "leader",
      "director",
      "head",
      "founder",
      "partner",
    ],
    priority: 85,
  },
  {
    intent: "career_suitability",
    phrases: [
      "should i become",
      "is this career suitable",
      "what career suits me",
      "which profession suits me",
      "career suitability",
      "profession suitability",
    ],
    tokens: [
      "career",
      "profession",
      "job",
      "doctor",
      "lawyer",
      "teacher",
      "engineer",
      "consultant",
      "astrologer",
    ],
    priority: 80,
  },
  {
    intent: "relationship_suitability",
    phrases: [
      "am i suited for marriage",
      "would marriage suit me",
      "relationship suitability",
      "partnership suitability",
      "should i marry",
    ],
    tokens: [
      "marriage",
      "relationship",
      "partner",
      "spouse",
      "commitment",
    ],
    priority: 70,
  },
  {
    intent: "health_suitability",
    phrases: [
      "is this health goal suitable",
      "should i train for",
      "can i do a marathon",
      "health suitability",
    ],
    tokens: [
      "fitness",
      "marathon",
      "exercise",
      "health goal",
      "weight loss",
      "training",
    ],
    priority: 60,
  },
  {
    intent: "spiritual_path",
    phrases: [
      "which spiritual path",
      "should i meditate",
      "is meditation suitable",
      "spiritual path",
      "which sadhana",
    ],
    tokens: [
      "meditation",
      "spiritual",
      "sadhana",
      "mantra",
      "mysticism",
      "astrology",
    ],
    priority: 55,
  },
];

function normalize(
  value: string
): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ");
}

export function resolveReasoningIntent(
  question: string
): ReasoningIntent {
  const normalized =
    normalize(question);

  let best:
    | {
        intent: ReasoningIntent;
        score: number;
        priority: number;
      }
    | null = null;

  for (const rule of INTENT_RULES) {
    let score = 0;

    for (const phrase of rule.phrases) {
      if (
        normalized.includes(
          normalize(phrase)
        )
      ) {
        score += 4;
      }
    }

    for (const token of rule.tokens) {
      if (
        normalized.includes(
          normalize(token)
        )
      ) {
        score += 1;
      }
    }

    if (
      score <= 0
    ) {
      continue;
    }

    if (
      !best ||
      score > best.score ||
      (
        score === best.score &&
        rule.priority >
          best.priority
      )
    ) {
      best = {
        intent: rule.intent,
        score,
        priority:
          rule.priority,
      };
    }
  }

  return (
    best?.intent ??
    "general"
  );
}