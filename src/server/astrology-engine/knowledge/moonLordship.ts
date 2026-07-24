import type { LifeArea, ZodiacSign } from "../types";

export type MoonLordshipKnowledge = {
  ascendant: ZodiacSign;
  moonLordshipHouse: number;
  functionalNature: "supportive" | "challenging" | "mixed";
  ruledThemes: string[];
  primaryAreas: LifeArea[];
  interpretation: string;
};

export const MOON_LORDSHIP_KNOWLEDGE: Record<
  ZodiacSign,
  MoonLordshipKnowledge
> = {
  Aries: {
    ascendant: "Aries",
    moonLordshipHouse: 4,
    functionalNature: "supportive",
    ruledThemes: ["home", "mother", "comfort", "property", "emotional peace"],
    primaryAreas: ["home", "family", "mind"],
    interpretation:
      "For Aries ascendant, Moon rules the 4th house, so it carries themes of emotional comfort, home, property, mother, and inner security.",
  },

  Taurus: {
    ascendant: "Taurus",
    moonLordshipHouse: 3,
    functionalNature: "mixed",
    ruledThemes: ["effort", "communication", "siblings", "courage", "short travel"],
    primaryAreas: ["career", "travel"],
    interpretation:
      "For Taurus ascendant, Moon rules the 3rd house, so it brings focus to effort, communication, siblings, courage, and practical initiative.",
  },

  Gemini: {
    ascendant: "Gemini",
    moonLordshipHouse: 2,
    functionalNature: "supportive",
    ruledThemes: ["money", "speech", "family", "food", "values"],
    primaryAreas: ["money", "family"],
    interpretation:
      "For Gemini ascendant, Moon rules the 2nd house, so it connects strongly with money, family, speech, food, and personal values.",
  },

  Cancer: {
    ascendant: "Cancer",
    moonLordshipHouse: 1,
    functionalNature: "supportive",
    ruledThemes: ["self", "body", "mind", "identity", "emotional state"],
    primaryAreas: ["mind", "health"],
    interpretation:
      "For Cancer ascendant, Moon is the ascendant lord, making its daily condition very important for mood, health, confidence, and personal direction.",
  },

  Leo: {
    ascendant: "Leo",
    moonLordshipHouse: 12,
    functionalNature: "challenging",
    ruledThemes: ["expenses", "sleep", "foreign matters", "isolation", "letting go"],
    primaryAreas: ["money", "mind", "spirituality", "travel"],
    interpretation:
      "For Leo ascendant, Moon rules the 12th house, so it often brings themes of rest, expenses, sleep, foreign matters, private emotions, and release.",
  },

  Virgo: {
    ascendant: "Virgo",
    moonLordshipHouse: 11,
    functionalNature: "supportive",
    ruledThemes: ["gains", "income", "network", "friends", "long-term wishes"],
    primaryAreas: ["money", "career", "relationships"],
    interpretation:
      "For Virgo ascendant, Moon rules the 11th house, so it is connected with gains, income, networks, friends, and fulfilment of desires.",
  },

  Libra: {
    ascendant: "Libra",
    moonLordshipHouse: 10,
    functionalNature: "supportive",
    ruledThemes: ["career", "status", "work", "authority", "public image"],
    primaryAreas: ["career", "publicImage"],
    interpretation:
      "For Libra ascendant, Moon rules the 10th house, so it strongly influences career, public image, responsibility, status, and professional visibility.",
  },

  Scorpio: {
    ascendant: "Scorpio",
    moonLordshipHouse: 9,
    functionalNature: "supportive",
    ruledThemes: ["luck", "dharma", "teachers", "father", "long-distance travel"],
    primaryAreas: ["spirituality", "education", "travel"],
    interpretation:
      "For Scorpio ascendant, Moon rules the 9th house, bringing themes of luck, guidance, belief, teachers, father, dharma, and long-distance matters.",
  },

  Sagittarius: {
    ascendant: "Sagittarius",
    moonLordshipHouse: 8,
    functionalNature: "challenging",
    ruledThemes: ["sudden changes", "hidden emotions", "research", "vulnerability"],
    primaryAreas: ["hiddenMatters", "mind", "health"],
    interpretation:
      "For Sagittarius ascendant, Moon rules the 8th house, so its condition can bring emotional depth, sudden developments, hidden matters, and transformation.",
  },

  Capricorn: {
    ascendant: "Capricorn",
    moonLordshipHouse: 7,
    functionalNature: "mixed",
    ruledThemes: ["partner", "clients", "public dealings", "relationships"],
    primaryAreas: ["relationships", "career"],
    interpretation:
      "For Capricorn ascendant, Moon rules the 7th house, so it influences relationships, partnerships, clients, spouse, and public-facing interactions.",
  },

  Aquarius: {
    ascendant: "Aquarius",
    moonLordshipHouse: 6,
    functionalNature: "challenging",
    ruledThemes: ["workload", "health", "debts", "conflict", "competition"],
    primaryAreas: ["career", "health"],
    interpretation:
      "For Aquarius ascendant, Moon rules the 6th house, so it can activate workload, health routines, competition, conflict resolution, and discipline.",
  },

  Pisces: {
    ascendant: "Pisces",
    moonLordshipHouse: 5,
    functionalNature: "supportive",
    ruledThemes: ["children", "creativity", "education", "intelligence", "romance"],
    primaryAreas: ["children", "education", "relationships"],
    interpretation:
      "For Pisces ascendant, Moon rules the 5th house, so it supports creativity, learning, children, romance, intelligence, and emotional expression.",
  },
};