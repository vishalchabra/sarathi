
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
  Ashwini: {
    name: "Ashwini",
    lord: "Ketu",
    nature: "movable",
    keywords: ["beginnings", "speed", "healing", "initiative", "independence"],
    primaryAreas: ["health", "career", "travel", "mind"],
    supportiveThemes: [
      "new beginnings",
      "timely action",
      "recovery",
      "initiative",
      "quick problem-solving",
    ],
    cautionThemes: [
      "impatience",
      "rushed decisions",
      "acting without preparation",
      "unnecessary haste",
    ],
    bestUse:
      "Take purposeful first steps and act promptly without sacrificing preparation.",
  },

  Bharani: {
    name: "Bharani",
    lord: "Venus",
    nature: "mixed",
    keywords: ["responsibility", "restraint", "transformation", "endurance", "consequences"],
    primaryAreas: ["mind", "relationships", "health", "spirituality"],
    supportiveThemes: [
      "accepting responsibility",
      "emotional maturity",
      "setting boundaries",
      "completing difficult tasks",
    ],
    cautionThemes: [
      "emotional extremes",
      "overindulgence",
      "resentment",
      "impulsive choices",
    ],
    bestUse:
      "Handle responsibilities patiently and make choices with long-term consequences in mind.",
  },

  Krittika: {
    name: "Krittika",
    lord: "Sun",
    nature: "sharp",
    keywords: ["purification", "discernment", "protection", "discipline", "clarity"],
    primaryAreas: ["career", "family", "health", "mind"],
    supportiveThemes: [
      "removing unnecessary complications",
      "clear decisions",
      "protective action",
      "disciplined effort",
    ],
    cautionThemes: [
      "harsh criticism",
      "impatience",
      "rigidity",
      "unnecessary confrontation",
    ],
    bestUse:
      "Simplify what needs attention and communicate necessary corrections constructively.",
  },

  Rohini: {
    name: "Rohini",
    lord: "Moon",
    nature: "fixed",
    keywords: ["growth", "nourishment", "beauty", "stability", "creation"],
    primaryAreas: ["money", "family", "relationships", "career"],
    supportiveThemes: [
      "steady growth",
      "creative development",
      "nurturing relationships",
      "building resources",
    ],
    cautionThemes: [
      "possessiveness",
      "attachment",
      "comfort-seeking",
      "resistance to change",
    ],
    bestUse:
      "Nurture worthwhile commitments and make steady progress on something you want to grow.",
  },

  Mrigashira: {
    name: "Mrigashira",
    lord: "Mars",
    nature: "soft",
    keywords: ["curiosity", "exploration", "search", "adaptability", "discovery"],
    primaryAreas: ["education", "travel", "relationships", "mind"],
    supportiveThemes: [
      "research",
      "learning",
      "exploring alternatives",
      "asking useful questions",
    ],
    cautionThemes: [
      "restlessness",
      "indecision",
      "distraction",
      "endless searching",
    ],
    bestUse:
      "Explore promising ideas while keeping your attention on a clear objective.",
  },

  Ardra: {
    name: "Ardra",
    lord: "Rahu",
    nature: "sharp",
    keywords: ["intensity", "change", "investigation", "release", "renewal"],
    primaryAreas: ["mind", "career", "hiddenMatters", "health"],
    supportiveThemes: [
      "investigating problems",
      "releasing old patterns",
      "honest reflection",
      "working through change",
    ],
    cautionThemes: [
      "emotional volatility",
      "harsh speech",
      "overreaction",
      "unnecessary disruption",
    ],
    bestUse:
      "Address difficult matters carefully and turn emotional intensity into constructive action.",
  },

  Punarvasu: {
    name: "Punarvasu",
    lord: "Jupiter",
    nature: "movable",
    keywords: ["renewal", "restoration", "optimism", "return", "recovery"],
    primaryAreas: ["family", "mind", "spirituality", "career"],
    supportiveThemes: [
      "fresh attempts",
      "restoring relationships",
      "returning to useful routines",
      "rebuilding confidence",
    ],
    cautionThemes: [
      "repeating old mistakes",
      "unrealistic optimism",
      "lack of follow-through",
    ],
    bestUse:
      "Revisit an unfinished opportunity and approach it with better understanding.",
  },

  Pushya: {
    name: "Pushya",
    lord: "Saturn",
    nature: "mixed",
    keywords: ["nourishment", "discipline", "support", "tradition", "responsibility"],
    primaryAreas: ["family", "career", "spirituality", "education"],
    supportiveThemes: [
      "mentoring",
      "supporting others",
      "disciplined learning",
      "strengthening routines",
    ],
    cautionThemes: [
      "excessive obligation",
      "rigidity",
      "neglecting personal needs",
    ],
    bestUse:
      "Strengthen an important routine and offer practical support where it is needed.",
  },

  Ashlesha: {
    name: "Ashlesha",
    lord: "Mercury",
    nature: "sharp",
    keywords: ["perception", "strategy", "attachment", "intuition", "complexity"],
    primaryAreas: ["mind", "relationships", "hiddenMatters", "health"],
    supportiveThemes: [
      "careful observation",
      "strategic thinking",
      "understanding complex situations",
      "recognising unhealthy patterns",
    ],
    cautionThemes: [
      "suspicion",
      "manipulation",
      "overthinking",
      "emotional entanglement",
    ],
    bestUse:
      "Observe carefully, communicate clearly and avoid acting on unverified assumptions.",
  },

  Magha: {
    name: "Magha",
    lord: "Ketu",
    nature: "sharp",
    keywords: ["ancestry", "authority", "legacy", "tradition", "recognition"],
    primaryAreas: ["family", "career", "spirituality", "publicImage"],
    supportiveThemes: [
      "honouring family traditions",
      "taking responsibility",
      "leadership",
      "respecting experience",
    ],
    cautionThemes: [
      "pride",
      "status-consciousness",
      "rigidity",
      "unnecessary power struggles",
    ],
    bestUse:
      "Take responsibility with humility and draw on the experience of those who came before you.",
  },

  "Purva Phalguni": {
    name: "Purva Phalguni",
    lord: "Venus",
    nature: "mixed",
    keywords: ["pleasure", "creativity", "relationships", "relaxation", "expression"],
    primaryAreas: ["relationships", "family", "mind", "money"],
    supportiveThemes: [
      "creative expression",
      "social connection",
      "rest",
      "enjoying meaningful relationships",
    ],
    cautionThemes: [
      "overindulgence",
      "procrastination",
      "unnecessary spending",
      "avoiding responsibilities",
    ],
    bestUse:
      "Make room for creativity and connection while maintaining sensible boundaries.",
  },

  "Uttara Phalguni": {
    name: "Uttara Phalguni",
    lord: "Sun",
    nature: "fixed",
    keywords: ["commitment", "partnership", "service", "reliability", "support"],
    primaryAreas: ["relationships", "career", "family", "money"],
    supportiveThemes: [
      "honouring commitments",
      "strengthening partnerships",
      "practical cooperation",
      "long-term planning",
    ],
    cautionThemes: [
      "unequal obligations",
      "taking others for granted",
      "overcommitment",
    ],
    bestUse:
      "Follow through on commitments and strengthen relationships through practical cooperation.",
  },

  Hasta: {
    name: "Hasta",
    lord: "Moon",
    nature: "soft",
    keywords: ["skill", "craftsmanship", "resourcefulness", "precision", "practicality"],
    primaryAreas: ["career", "education", "money", "mind"],
    supportiveThemes: [
      "hands-on work",
      "developing skills",
      "organising tasks",
      "practical problem-solving",
    ],
    cautionThemes: [
      "perfectionism",
      "controlling behaviour",
      "overwork",
      "unnecessary worry",
    ],
    bestUse:
      "Apply your skills to a practical task and focus on what you can directly improve.",
  },

  Chitra: {
    name: "Chitra",
    lord: "Mars",
    nature: "soft",
    keywords: ["design", "beauty", "construction", "individuality", "achievement"],
    primaryAreas: ["career", "relationships", "property", "publicImage"],
    supportiveThemes: [
      "creative design",
      "improving presentation",
      "building something lasting",
      "independent initiative",
    ],
    cautionThemes: [
      "perfectionism",
      "vanity",
      "unnecessary competition",
      "superficial judgments",
    ],
    bestUse:
      "Improve the quality or presentation of an important project without losing sight of its purpose.",
  },

  Swati: {
    name: "Swati",
    lord: "Rahu",
    nature: "movable",
    keywords: ["independence", "flexibility", "movement", "trade", "adaptability"],
    primaryAreas: ["career", "money", "travel", "relationships"],
    supportiveThemes: [
      "negotiation",
      "independent work",
      "adaptation",
      "exploring opportunities",
    ],
    cautionThemes: [
      "indecision",
      "scattered effort",
      "excessive independence",
      "instability",
    ],
    bestUse:
      "Remain flexible while making decisions that support your longer-term independence.",
  },

  Vishakha: {
    name: "Vishakha",
    lord: "Jupiter",
    nature: "mixed",
    keywords: ["ambition", "determination", "purpose", "achievement", "persistence"],
    primaryAreas: ["career", "education", "money", "spirituality"],
    supportiveThemes: [
      "focused effort",
      "working toward milestones",
      "sustained learning",
      "purposeful action",
    ],
    cautionThemes: [
      "obsession with results",
      "impatience",
      "unnecessary rivalry",
      "neglecting relationships",
    ],
    bestUse:
      "Choose one meaningful objective and direct your effort toward measurable progress.",
  },

  Anuradha: {
    name: "Anuradha",
    lord: "Saturn",
    nature: "soft",
    keywords: ["friendship", "devotion", "cooperation", "discipline", "loyalty"],
    primaryAreas: ["relationships", "career", "spirituality", "mind"],
    supportiveThemes: [
      "teamwork",
      "maintaining friendships",
      "disciplined practice",
      "building trust",
    ],
    cautionThemes: [
      "emotional dependency",
      "overcommitment",
      "unspoken resentment",
      "rigidity",
    ],
    bestUse:
      "Strengthen a valuable relationship or shared goal through consistent effort.",
  },

  Jyeshtha: {
    name: "Jyeshtha",
    lord: "Mercury",
    nature: "sharp",
    keywords: ["seniority", "protection", "authority", "strategy", "responsibility"],
    primaryAreas: ["career", "family", "mind", "hiddenMatters"],
    supportiveThemes: [
      "responsible leadership",
      "protecting important interests",
      "strategic decisions",
      "handling sensitive matters",
    ],
    cautionThemes: [
      "defensiveness",
      "jealousy",
      "power struggles",
      "excessive control",
    ],
    bestUse:
      "Handle sensitive responsibilities with discretion and avoid unnecessary competition.",
  },

  Mula: {
    name: "Mula",
    lord: "Ketu",
    nature: "sharp",
    keywords: ["roots", "investigation", "truth", "release", "transformation"],
    primaryAreas: ["hiddenMatters", "spirituality", "mind", "career"],
    supportiveThemes: [
      "root-cause analysis",
      "deep research",
      "questioning assumptions",
      "removing ineffective approaches",
    ],
    cautionThemes: [
      "unnecessary disruption",
      "harsh conclusions",
      "destructive criticism",
      "extreme reactions",
    ],
    bestUse:
      "Investigate the root of a problem before making significant changes.",
  },

  "Purva Ashadha": {
    name: "Purva Ashadha",
    lord: "Venus",
    nature: "mixed",
    keywords: ["conviction", "enthusiasm", "expression", "renewal", "confidence"],
    primaryAreas: ["career", "relationships", "education", "spirituality"],
    supportiveThemes: [
      "presenting ideas",
      "renewed motivation",
      "creative expression",
      "pursuing meaningful goals",
    ],
    cautionThemes: [
      "stubbornness",
      "overconfidence",
      "refusing feedback",
      "premature conclusions",
    ],
    bestUse:
      "Express your ideas confidently while remaining open to useful feedback.",
  },

  "Uttara Ashadha": {
    name: "Uttara Ashadha",
    lord: "Sun",
    nature: "fixed",
    keywords: ["endurance", "integrity", "responsibility", "achievement", "commitment"],
    primaryAreas: ["career", "family", "publicImage", "spirituality"],
    supportiveThemes: [
      "long-term commitments",
      "disciplined leadership",
      "steady progress",
      "acting with integrity",
    ],
    cautionThemes: [
      "inflexibility",
      "excessive responsibility",
      "pride",
      "neglecting rest",
    ],
    bestUse:
      "Make steady progress on a long-term responsibility and honour existing commitments.",
  },

  Shravana: {
    name: "Shravana",
    lord: "Moon",
    nature: "movable",
    keywords: ["listening", "learning", "communication", "tradition", "connection"],
    primaryAreas: ["education", "career", "relationships", "spirituality"],
    supportiveThemes: [
      "careful listening",
      "learning from experience",
      "constructive communication",
      "studying traditional knowledge",
    ],
    cautionThemes: [
      "gossip",
      "misunderstanding",
      "information overload",
      "unverified assumptions",
    ],
    bestUse:
      "Listen carefully, gather reliable information and communicate what matters clearly.",
  },

  Dhanishta: {
    name: "Dhanishta",
    lord: "Mars",
    nature: "movable",
    keywords: ["rhythm", "prosperity", "teamwork", "ambition", "coordination"],
    primaryAreas: ["career", "money", "relationships", "publicImage"],
    supportiveThemes: [
      "coordinated teamwork",
      "resource management",
      "disciplined action",
      "shared achievements",
    ],
    cautionThemes: [
      "status competition",
      "financial impulsiveness",
      "neglecting relationships",
      "excessive ambition",
    ],
    bestUse:
      "Coordinate your efforts with others and use available resources efficiently.",
  },

  Shatabhisha: {
    name: "Shatabhisha",
    lord: "Rahu",
    nature: "movable",
    keywords: ["healing", "research", "privacy", "innovation", "independence"],
    primaryAreas: ["health", "hiddenMatters", "mind", "education"],
    supportiveThemes: [
      "research",
      "independent study",
      "examining underlying problems",
      "reviewing wellbeing routines",
    ],
    cautionThemes: [
      "isolation",
      "overanalysis",
      "emotional withdrawal",
      "unnecessary secrecy",
    ],
    bestUse:
      "Investigate a problem methodically and balance independent work with appropriate support.",
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
};
