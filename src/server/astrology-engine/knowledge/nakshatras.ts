import type { LifeArea } from "../types";

export type NakshatraKnowledge = {
  name: string;
  lord: string;
  nature: "soft" | "sharp" | "fixed" | "movable" | "mixed";
  keywords: string[];
  primaryAreas: LifeArea[];
  supportiveThemes: string[];
  cautionThemes: string[];
  bestUse: string;
};

export const NAKSHATRA_KNOWLEDGE: Record<string, NakshatraKnowledge> = {
  "Uttara Bhadrapada": {
    name: "Uttara Bhadrapada",
    lord: "Saturn",
    nature: "fixed",
    keywords: [
      "depth",
      "patience",
      "stability",
      "inner maturity",
      "quiet responsibility",
    ],
    primaryAreas: ["mind", "spirituality", "career"],
    supportiveThemes: [
      "deep thinking",
      "patience",
      "emotional maturity",
      "long-term planning",
      "quiet discipline",
    ],
    cautionThemes: [
      "emotional heaviness",
      "overthinking",
      "delayed expression",
      "withdrawal",
    ],
    bestUse:
      "Use this nakshatra for patient planning, emotional grounding, and mature decisions.",
  },

  Revati: {
    name: "Revati",
    lord: "Mercury",
    nature: "soft",
    keywords: [
      "completion",
      "guidance",
      "travel",
      "protection",
      "gentle closure",
    ],
    primaryAreas: ["travel", "spirituality", "mind", "relationships"],
    supportiveThemes: [
      "completion",
      "compassion",
      "safe travel",
      "gentle communication",
      "closure",
    ],
    cautionThemes: [
      "drifting",
      "avoidance",
      "emotional softness",
      "lack of boundaries",
    ],
    bestUse:
      "Use this nakshatra to complete pending matters, communicate gently, and close loops.",
  },

  "Purva Bhadrapada": {
    name: "Purva Bhadrapada",
    lord: "Jupiter",
    nature: "mixed",
    keywords: [
      "intensity",
      "belief",
      "awakening",
      "inner fire",
      "transformation",
    ],
    primaryAreas: ["spirituality", "mind", "hiddenMatters"],
    supportiveThemes: [
      "deep insight",
      "spiritual intensity",
      "commitment",
      "transformational thinking",
    ],
    cautionThemes: [
      "extreme thinking",
      "emotional intensity",
      "rigidity",
      "overreaction",
    ],
    bestUse:
      "Use this nakshatra for deep reflection, but avoid extreme conclusions.",
  },
};