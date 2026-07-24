import type { LifeArea } from "../types";

export type HouseKnowledge = {
  house: number;
  name: string;
  keywords: string[];
  primaryAreas: LifeArea[];
  supportiveThemes: string[];
  cautionThemes: string[];
  bestUse: string;
};

export const HOUSE_KNOWLEDGE: Record<number, HouseKnowledge> = {
  1: {
    house: 1,
    name: "Self and Direction",
    keywords: ["self", "body", "mood", "identity", "confidence"],
    primaryAreas: ["mind", "health"],
    supportiveThemes: [
      "personal clarity",
      "self-awareness",
      "confidence",
      "fresh initiative",
    ],
    cautionThemes: [
      "emotional reactivity",
      "overthinking self-image",
      "physical tiredness",
    ],
    bestUse: "Use the day to reset your energy and make clear personal choices.",
  },

  2: {
    house: 2,
    name: "Money and Speech",
    keywords: ["money", "speech", "family", "food", "values"],
    primaryAreas: ["money", "family"],
    supportiveThemes: [
      "financial awareness",
      "family conversations",
      "practical decision-making",
      "value-based choices",
    ],
    cautionThemes: [
      "sharp speech",
      "unplanned spending",
      "emotional eating",
      "family sensitivity",
    ],
    bestUse: "Use the day to manage money, speech, and family matters carefully.",
  },

  3: {
    house: 3,
    name: "Effort and Communication",
    keywords: ["communication", "effort", "siblings", "courage", "short travel"],
    primaryAreas: ["career", "travel"],
    supportiveThemes: [
      "clear communication",
      "follow-ups",
      "writing",
      "short travel",
      "self-effort",
    ],
    cautionThemes: [
      "impatience",
      "unnecessary arguments",
      "scattered effort",
    ],
    bestUse: "Use the day for communication, follow-ups, writing, or short travel.",
  },

  4: {
    house: 4,
    name: "Home and Emotional Security",
    keywords: ["home", "mother", "comfort", "property", "emotional security"],
    primaryAreas: ["home", "family", "mind"],
    supportiveThemes: [
      "home comfort",
      "emotional grounding",
      "property matters",
      "family support",
    ],
    cautionThemes: [
      "domestic sensitivity",
      "moodiness",
      "attachment to comfort",
    ],
    bestUse: "Use the day to handle home, comfort, property, or emotional matters.",
  },

  5: {
    house: 5,
    name: "Creativity and Intelligence",
    keywords: ["children", "creativity", "learning", "romance", "intelligence"],
    primaryAreas: ["children", "education", "relationships"],
    supportiveThemes: [
      "creative ideas",
      "learning",
      "children-related matters",
      "romantic expression",
      "planning",
    ],
    cautionThemes: [
      "emotional speculation",
      "attention-seeking",
      "overthinking romance",
    ],
    bestUse: "Use the day for learning, creativity, children, or thoughtful planning.",
  },

  6: {
    house: 6,
    name: "Workload and Discipline",
    keywords: ["workload", "health", "competition", "conflict", "discipline"],
    primaryAreas: ["career", "health"],
    supportiveThemes: [
      "discipline",
      "problem-solving",
      "finishing pending work",
      "health correction",
    ],
    cautionThemes: [
      "stress",
      "arguments",
      "minor health sensitivity",
      "work pressure",
    ],
    bestUse: "Use the day to finish pending work and avoid unnecessary arguments.",
  },

  7: {
    house: 7,
    name: "Relationships and Public Dealings",
    keywords: ["relationships", "clients", "partnerships", "public dealings"],
    primaryAreas: ["relationships", "career"],
    supportiveThemes: [
      "partnership clarity",
      "client interaction",
      "public visibility",
      "balanced dialogue",
    ],
    cautionThemes: [
      "emotional dependence",
      "misunderstanding with partner",
      "people-pleasing",
    ],
    bestUse: "Use the day to handle relationships and client matters with maturity.",
  },

  8: {
    house: 8,
    name: "Depth and Sudden Changes",
    keywords: ["sudden changes", "deep emotions", "research", "hidden matters"],
    primaryAreas: ["hiddenMatters", "mind", "health"],
    supportiveThemes: [
      "research",
      "inner work",
      "private problem-solving",
      "deep observation",
    ],
    cautionThemes: [
      "sudden mood shifts",
      "overthinking",
      "unnecessary risk",
      "hidden stress",
    ],
    bestUse: "Use the day for research, inner work, and avoiding impulsive moves.",
  },

  9: {
    house: 9,
    name: "Luck and Guidance",
    keywords: ["luck", "beliefs", "teachers", "father", "long-distance matters"],
    primaryAreas: ["spirituality", "education", "travel"],
    supportiveThemes: [
      "guidance",
      "learning",
      "higher perspective",
      "spiritual clarity",
      "long-distance planning",
    ],
    cautionThemes: [
      "rigid beliefs",
      "expecting luck without effort",
      "disagreement with mentors",
    ],
    bestUse: "Use the day for guidance, learning, travel planning, or spiritual clarity.",
  },

  10: {
    house: 10,
    name: "Career and Responsibility",
    keywords: ["career", "status", "responsibility", "visibility", "decisions"],
    primaryAreas: ["career", "publicImage"],
    supportiveThemes: [
      "career focus",
      "visibility",
      "responsibility",
      "important decisions",
      "professional maturity",
    ],
    cautionThemes: [
      "pressure from authority",
      "emotional decision-making at work",
      "work-life imbalance",
    ],
    bestUse: "Use the day to focus on responsibility, career visibility, and decisions.",
  },

  11: {
    house: 11,
    name: "Gains and Networks",
    keywords: ["gains", "network", "friends", "income", "wish fulfilment"],
    primaryAreas: ["money", "career", "relationships"],
    supportiveThemes: [
      "income opportunities",
      "network support",
      "friendships",
      "long-term goals",
      "recognition from groups",
    ],
    cautionThemes: [
      "over-expectation",
      "social distraction",
      "depending too much on others",
    ],
    bestUse: "Use the day to connect with people and work toward gains.",
  },

  12: {
    house: 12,
    name: "Rest and Release",
    keywords: ["rest", "sleep", "expenses", "foreign matters", "letting go"],
    primaryAreas: ["mind", "spirituality", "travel", "money"],
    supportiveThemes: [
      "rest",
      "private reflection",
      "spiritual reset",
      "foreign connections",
      "closure",
    ],
    cautionThemes: [
      "unnecessary expenses",
      "low energy",
      "sleep disturbance",
      "emotional withdrawal",
    ],
    bestUse: "Use the day to rest, reduce clutter, and avoid wasteful expenses.",
  },
};