import type {
  PlanetName,
} from "../contracts/facts";

export type TransitActivationProfile = {
  planet: PlanetName;

  themes: string[];
  capabilityThemes: string[];

  constructiveExpression: string[];
  shadowExpression: string[];

  score: number;
};

export const TRANSIT_ACTIVATION_PROFILES:
  Record<
    PlanetName,
    TransitActivationProfile
  > = {
  Sun: {
    planet: "Sun",

    themes: [
      "visibility",
      "authority",
      "recognition",
      "purpose",
      "leadership",
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
      "leadership opportunities",
      "clearer sense of direction",
      "recognition through responsibility",
    ],

    shadowExpression: [
      "ego conflict",
      "authority pressure",
      "over-identification with status",
    ],

    score: 7,
  },

  Moon: {
    planet: "Moon",

    themes: [
      "emotion",
      "public response",
      "adaptability",
      "care",
      "mental movement",
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
      "increased public sensitivity",
      "stronger adaptability",
    ],

    shadowExpression: [
      "mood fluctuation",
      "reactivity",
      "subjectivity",
    ],

    score: 6,
  },

  Mars: {
    planet: "Mars",

    themes: [
      "action",
      "competition",
      "initiative",
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
      "greater momentum",
      "decisive action",
      "competitive drive",
      "technical execution",
    ],

    shadowExpression: [
      "conflict",
      "impatience",
      "rash action",
    ],

    score: 7,
  },

  Mercury: {
    planet: "Mercury",

    themes: [
      "communication",
      "analysis",
      "learning",
      "commerce",
      "movement",
    ],

    capabilityThemes: [
      "communication",
      "analysis",
      "research",
      "learning",
      "commerce",
      "negotiation",
    ],

    constructiveExpression: [
      "greater communication activity",
      "analytical movement",
      "commercial exchange",
      "learning opportunities",
    ],

    shadowExpression: [
      "overthinking",
      "miscommunication",
      "scattered attention",
    ],

    score: 6,
  },

  Jupiter: {
    planet: "Jupiter",

    themes: [
      "expansion",
      "guidance",
      "opportunity",
      "teaching",
      "growth",
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
      "greater opportunity",
      "support through mentors or knowledge",
      "expansion through education",
      "broader perspective",
    ],

    shadowExpression: [
      "overexpansion",
      "overconfidence",
      "excess optimism",
    ],

    score: 8,
  },

  Venus: {
    planet: "Venus",

    themes: [
      "relationships",
      "value",
      "comfort",
      "creativity",
      "attraction",
    ],

    capabilityThemes: [
      "relationships",
      "negotiation",
      "creativity",
      "wealth",
      "communication",
    ],

    constructiveExpression: [
      "greater social ease",
      "creative opportunity",
      "relationship activity",
      "value creation",
    ],

    shadowExpression: [
      "indulgence",
      "avoidance",
      "attachment",
    ],

    score: 7,
  },

  Saturn: {
    planet: "Saturn",

    themes: [
      "pressure",
      "responsibility",
      "consolidation",
      "delay",
      "restructuring",
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
      "greater discipline",
      "long-term consolidation",
      "structural correction",
      "maturity through responsibility",
    ],

    shadowExpression: [
      "delay",
      "fear",
      "restriction",
      "pressure",
    ],

    score: 8,
  },

  Rahu: {
    planet: "Rahu",

    themes: [
      "acceleration",
      "disruption",
      "foreign influence",
      "technology",
      "ambition",
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
      "rapid experimentation",
      "unconventional opportunity",
      "foreign or technological exposure",
      "greater ambition",
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
      "separation",
      "research",
      "specialisation",
      "hidden knowledge",
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
      "greater discrimination",
      "spiritual detachment",
    ],

    shadowExpression: [
      "withdrawal",
      "fragmentation",
      "disconnection",
    ],

    score: 7,
  },
};

export function getTransitActivationProfile(
  planet: PlanetName
): TransitActivationProfile {
  return TRANSIT_ACTIVATION_PROFILES[
    planet
  ];
}