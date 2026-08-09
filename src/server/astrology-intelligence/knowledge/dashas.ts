import type {
  PlanetName,
} from "../contracts/facts";

export type DashaActivationProfile = {
  planet: PlanetName;

  themes: string[];
  capabilityThemes: string[];

  constructiveExpression: string[];
  shadowExpression: string[];

  score: number;
};

export const DASHA_ACTIVATION_PROFILES:
  Record<
    PlanetName,
    DashaActivationProfile
  > = {
  Sun: {
    planet: "Sun",

    themes: [
      "leadership",
      "authority",
      "visibility",
      "purpose",
      "recognition",
    ],

    capabilityThemes: [
      "leadership",
      "authority",
      "governance",
      "decision_making",
      "career",
    ],

    constructiveExpression: [
      "greater visibility",
      "leadership responsibility",
      "stronger identity expression",
      "recognition through responsibility",
    ],

    shadowExpression: [
      "ego pressure",
      "authority conflict",
      "over-identification with status",
    ],

    score: 8,
  },

  Moon: {
    planet: "Moon",

    themes: [
      "emotion",
      "public response",
      "care",
      "adaptability",
      "mental focus",
    ],

    capabilityThemes: [
      "empathy",
      "relationships",
      "communication",
      "intuition",
      "healing",
    ],

    constructiveExpression: [
      "greater emotional responsiveness",
      "stronger public connection",
      "increased care and receptivity",
    ],

    shadowExpression: [
      "mood fluctuation",
      "emotional reactivity",
      "subjectivity",
    ],

    score: 7,
  },

  Mars: {
    planet: "Mars",

    themes: [
      "action",
      "initiative",
      "competition",
      "courage",
      "execution",
    ],

    capabilityThemes: [
      "initiative",
      "execution",
      "engineering",
      "leadership",
      "decision_making",
    ],

    constructiveExpression: [
      "faster execution",
      "greater courage",
      "stronger competitive drive",
      "technical action",
    ],

    shadowExpression: [
      "conflict",
      "impatience",
      "overreaction",
    ],

    score: 8,
  },

  Mercury: {
    planet: "Mercury",

    themes: [
      "analysis",
      "communication",
      "learning",
      "commerce",
      "adaptability",
    ],

    capabilityThemes: [
      "analysis",
      "communication",
      "research",
      "learning",
      "commerce",
      "negotiation",
    ],

    constructiveExpression: [
      "greater learning",
      "stronger communication",
      "commercial activity",
      "analytical problem solving",
    ],

    shadowExpression: [
      "overthinking",
      "scattered attention",
      "excess analysis",
    ],

    score: 8,
  },

  Jupiter: {
    planet: "Jupiter",

    themes: [
      "wisdom",
      "guidance",
      "teaching",
      "expansion",
      "ethics",
    ],

    capabilityThemes: [
      "knowledge",
      "teaching",
      "guidance",
      "dharma",
      "research",
      "mentoring",
    ],

    constructiveExpression: [
      "greater guidance",
      "learning and teaching",
      "expansion through knowledge",
      "ethical judgement",
    ],

    shadowExpression: [
      "overconfidence",
      "dogmatism",
      "excess",
    ],

    score: 9,
  },

  Venus: {
    planet: "Venus",

    themes: [
      "relationships",
      "value",
      "creativity",
      "comfort",
      "negotiation",
    ],

    capabilityThemes: [
      "relationships",
      "negotiation",
      "creativity",
      "wealth",
      "communication",
    ],

    constructiveExpression: [
      "greater relationship activity",
      "creative expression",
      "value creation",
      "diplomatic opportunity",
    ],

    shadowExpression: [
      "indulgence",
      "attachment",
      "avoidance of difficult choices",
    ],

    score: 8,
  },

  Saturn: {
    planet: "Saturn",

    themes: [
      "discipline",
      "responsibility",
      "structure",
      "delay",
      "endurance",
    ],

    capabilityThemes: [
      "discipline",
      "governance",
      "operations",
      "responsibility",
      "analysis",
      "execution",
    ],

    constructiveExpression: [
      "greater responsibility",
      "long-term consolidation",
      "structured execution",
      "maturity through discipline",
    ],

    shadowExpression: [
      "delay",
      "fear",
      "pressure",
      "rigidity",
    ],

    score: 9,
  },

  Rahu: {
    planet: "Rahu",

    themes: [
      "ambition",
      "innovation",
      "foreign influence",
      "scale",
      "unconventional growth",
    ],

    capabilityThemes: [
      "innovation",
      "technology",
      "entrepreneurship",
      "scale",
      "media",
      "commerce",
    ],

    constructiveExpression: [
      "greater ambition",
      "unconventional opportunity",
      "technology or foreign exposure",
      "rapid scaling impulses",
    ],

    shadowExpression: [
      "obsession",
      "distortion",
      "overreach",
      "instability",
    ],

    score: 8,
  },

  Ketu: {
    planet: "Ketu",

    themes: [
      "detachment",
      "research",
      "specialisation",
      "hidden knowledge",
      "inner separation",
    ],

    capabilityThemes: [
      "research",
      "mysticism",
      "analysis",
      "occult_knowledge",
      "hidden_systems",
      "detachment",
    ],

    constructiveExpression: [
      "deeper specialisation",
      "research intensity",
      "spiritual detachment",
      "focus on hidden systems",
    ],

    shadowExpression: [
      "withdrawal",
      "fragmentation",
      "disconnection",
    ],

    score: 8,
  },
};

export function getDashaActivationProfile(
  planet: PlanetName
): DashaActivationProfile {
  return DASHA_ACTIVATION_PROFILES[
    planet
  ];
}