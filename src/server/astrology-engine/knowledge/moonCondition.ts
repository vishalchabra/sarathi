import type { PlanetName } from "../types";

export type MoonConditionRule = {
  id: string;
  label: string;
  type: "support" | "pressure" | "neutral";
  planets?: PlanetName[];
  intensity: number; // 1-10
  confidence: number; // 1-10
  interpretation: string;
  advice: string;
};

export const MOON_CONDITION_RULES = {
  maleficConjunction: {
    id: "moon_malefic_conjunction",
    label: "Moon with malefic planet",
    type: "pressure",
    planets: ["Saturn", "Mars", "Rahu", "Ketu"],
    intensity: 8,
    confidence: 8,
    interpretation:
      "Moon receives pressure from a malefic influence, making the day more serious, reactive, delayed, or emotionally heavy.",
    advice:
      "Avoid impulsive reactions and give yourself more time before making emotional decisions.",
  },

  beneficConjunction: {
    id: "moon_benefic_conjunction",
    label: "Moon with benefic planet",
    type: "support",
    planets: ["Jupiter", "Venus", "Mercury"],
    intensity: 7,
    confidence: 8,
    interpretation:
      "Moon receives support from a benefic influence, improving clarity, emotional balance, cooperation, and practical judgment.",
    advice:
      "Use the day for constructive conversations, learning, planning, and supportive interactions.",
  },

  maleficAspect: {
    id: "moon_malefic_aspect",
    label: "Moon aspected by malefic planet",
    type: "pressure",
    planets: ["Saturn", "Mars", "Rahu", "Ketu"],
    intensity: 7,
    confidence: 7,
    interpretation:
      "A malefic aspect to the Moon can create pressure, restlessness, delays, emotional seriousness, or sharper reactions.",
    advice:
      "Stay patient and avoid turning temporary pressure into permanent conclusions.",
  },

  beneficAspect: {
    id: "moon_benefic_aspect",
    label: "Moon aspected by benefic planet",
    type: "support",
    planets: ["Jupiter", "Venus", "Mercury"],
    intensity: 6,
    confidence: 7,
    interpretation:
      "A benefic aspect to the Moon can bring emotional support, perspective, and better decision-making.",
    advice:
      "Use the support for thoughtful choices, meaningful conversations, and steady progress.",
  },

  sixthHouseTransit: {
    id: "moon_6th_house_transit",
    label: "Moon in 6th house",
    type: "pressure",
    intensity: 6,
    confidence: 8,
    interpretation:
      "Moon in the 6th house activates workload, routine, discipline, health correction, and conflict management.",
    advice:
      "Focus on finishing pending work and avoid unnecessary arguments.",
  },

  eighthHouseTransit: {
    id: "moon_8th_house_transit",
    label: "Moon in 8th house",
    type: "pressure",
    intensity: 8,
    confidence: 8,
    interpretation:
      "Moon in the 8th house can make the day emotionally deeper, unpredictable, private, or sensitive.",
    advice:
      "Avoid impulsive decisions and use the day for observation, research, and inner work.",
  },

  twelfthHouseTransit: {
    id: "moon_12th_house_transit",
    label: "Moon in 12th house",
    type: "pressure",
    intensity: 6,
    confidence: 8,
    interpretation:
      "Moon in the 12th house activates rest, sleep, expenses, foreign matters, solitude, and emotional release.",
    advice:
      "Reduce unnecessary spending and give yourself space to recharge.",
  },

  saturnMoonContact: {
    id: "moon_saturn_contact",
    label: "Moon influenced by Saturn",
    type: "pressure",
    planets: ["Saturn"],
    intensity: 8,
    confidence: 8,
    interpretation:
      "Saturn's influence on the Moon makes the day more serious, practical, slow, responsible, or emotionally restrained.",
    advice:
      "Move patiently, accept responsibility, and avoid expecting quick emotional validation.",
  },

  marsMoonContact: {
    id: "moon_mars_contact",
    label: "Moon influenced by Mars",
    type: "pressure",
    planets: ["Mars"],
    intensity: 8,
    confidence: 8,
    interpretation:
      "Mars' influence on the Moon can make reactions sharper and decisions more urgent.",
    advice:
      "Channel the energy into action, but avoid arguments and emotional impatience.",
  },

  rahuMoonContact: {
    id: "moon_rahu_contact",
    label: "Moon influenced by Rahu",
    type: "pressure",
    planets: ["Rahu"],
    intensity: 8,
    confidence: 8,
    interpretation:
      "Rahu's influence on the Moon can increase mental noise, desire, confusion, exaggeration, or sudden emotional swings.",
    advice:
      "Do not act from anxiety, comparison, or obsession. Pause before reacting.",
  },

  ketuMoonContact: {
    id: "moon_ketu_contact",
    label: "Moon influenced by Ketu",
    type: "pressure",
    planets: ["Ketu"],
    intensity: 7,
    confidence: 8,
    interpretation:
      "Ketu's influence on the Moon can create detachment, emotional distance, confusion, or a need to withdraw.",
    advice:
      "Use solitude constructively and avoid assuming others are intentionally distant.",
  },

  jupiterMoonContact: {
    id: "moon_jupiter_contact",
    label: "Moon influenced by Jupiter",
    type: "support",
    planets: ["Jupiter"],
    intensity: 8,
    confidence: 8,
    interpretation:
      "Jupiter's influence on the Moon brings perspective, wisdom, guidance, optimism, and emotional steadiness.",
    advice:
      "Use the day for learning, guidance, planning, and generous but practical choices.",
  },

  venusMoonContact: {
    id: "moon_venus_contact",
    label: "Moon influenced by Venus",
    type: "support",
    planets: ["Venus"],
    intensity: 7,
    confidence: 8,
    interpretation:
      "Venus' influence on the Moon supports comfort, relationships, creativity, beauty, and emotional softness.",
    advice:
      "Use the day for relationship repair, creativity, aesthetics, and pleasant interactions.",
  },

  mercuryMoonContact: {
    id: "moon_mercury_contact",
    label: "Moon influenced by Mercury",
    type: "support",
    planets: ["Mercury"],
    intensity: 6,
    confidence: 7,
    interpretation:
      "Mercury's influence on the Moon supports communication, thinking, learning, writing, and practical planning.",
    advice:
      "Use the day for conversations, documentation, study, and clear communication.",
  },
} satisfies Record<string, MoonConditionRule>;