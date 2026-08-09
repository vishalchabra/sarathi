import type {
  KnowledgeCategory,
} from "./types";

export type DivisionalChartProfile = {
  chart: string;
  name: string;

  primaryCategory:
    KnowledgeCategory;

  purpose: string;

  represents: string[];

  capabilityThemes: string[];

  strongExpression: string[];
  weakExpression: string[];

  confidenceWeight: number;
};

export const DIVISIONAL_CHART_PROFILES:
  DivisionalChartProfile[] = [
  {
    chart: "D9",
    name: "Navamsa",

    primaryCategory:
      "relationships",

    purpose:
      "Shows deeper planetary maturity, dharma, relational capacity and how natal promise develops with time.",

    represents: [
      "planetary maturity",
      "dharma",
      "marriage",
      "long-term relational capacity",
      "inner strength",
    ],

    capabilityThemes: [
      "relationships",
      "dharma",
      "guidance",
      "maturity",
      "commitment",
    ],

    strongExpression: [
      "mature expression",
      "greater consistency with age",
      "stronger dharmic alignment",
      "better long-term relational expression",
    ],

    weakExpression: [
      "delayed maturity",
      "inconsistent long-term expression",
      "relational learning",
      "need for greater inner alignment",
    ],

    confidenceWeight:
      9,
  },

  {
    chart: "D10",
    name: "Dasamsa",

    primaryCategory:
      "career",

    purpose:
      "Shows professional expression, authority, execution, public responsibility and career development.",

    represents: [
      "profession",
      "career execution",
      "authority",
      "public reputation",
      "professional responsibility",
    ],

    capabilityThemes: [
      "career",
      "leadership",
      "execution",
      "governance",
      "professional_communication",
      "strategy",
    ],

    strongExpression: [
      "stronger professional delivery",
      "greater authority",
      "career consistency",
      "visible professional contribution",
    ],

    weakExpression: [
      "career inconsistency",
      "delayed professional consolidation",
      "authority challenges",
      "greater effort required for recognition",
    ],

    confidenceWeight:
      10,
  },

  {
    chart: "D24",
    name: "Chaturvimshamsa",

    primaryCategory:
      "education",

    purpose:
      "Shows education, scholarship, learning capacity, mastery, teaching and disciplined acquisition of knowledge.",

    represents: [
      "education",
      "scholarship",
      "learning",
      "teaching",
      "mastery",
    ],

    capabilityThemes: [
      "learning",
      "knowledge",
      "teaching",
      "research",
      "analysis",
    ],

    strongExpression: [
      "strong learning capacity",
      "scholarly depth",
      "teaching potential",
      "greater mastery through study",
    ],

    weakExpression: [
      "learning interruptions",
      "uneven academic confidence",
      "need for disciplined study",
      "delayed mastery",
    ],

    confidenceWeight:
      9,
  },

  {
    chart: "D7",
    name: "Saptamsa",

    primaryCategory:
      "relationships",

    purpose:
      "Shows children, creativity carried forward, nurturing responsibility and continuity through the next generation.",

    represents: [
      "children",
      "creative continuity",
      "nurturing",
      "legacy",
      "responsibility for dependants",
    ],

    capabilityThemes: [
      "relationships",
      "mentoring",
      "creativity",
      "responsibility",
      "guidance",
    ],

    strongExpression: [
      "constructive nurturing",
      "creative continuity",
      "strong mentoring capacity",
      "greater responsibility toward dependants",
    ],

    weakExpression: [
      "nurturing strain",
      "delays around continuity",
      "greater responsibility through children",
      "creative inconsistency",
    ],

    confidenceWeight:
      7,
  },

  {
    chart: "D12",
    name: "Dwadasamsa",

    primaryCategory:
      "psychology",

    purpose:
      "Shows parental lineage, inherited patterns, family conditioning and ancestral continuity.",

    represents: [
      "parents",
      "lineage",
      "ancestral patterns",
      "family conditioning",
      "inherited tendencies",
    ],

    capabilityThemes: [
      "psychological_depth",
      "responsibility",
      "guidance",
      "tradition",
      "healing",
    ],

    strongExpression: [
      "constructive lineage support",
      "greater continuity with family strengths",
      "mature handling of inherited patterns",
    ],

    weakExpression: [
      "ancestral burdens",
      "family-pattern repetition",
      "greater need for psychological differentiation",
    ],

    confidenceWeight:
      7,
  },

  {
    chart: "D20",
    name: "Vimsamsa",

    primaryCategory:
      "spirituality",

    purpose:
      "Shows spiritual practice, devotional capacity, inner discipline and the maturity of spiritual pursuit.",

    represents: [
      "spiritual practice",
      "devotion",
      "inner discipline",
      "meditation",
      "spiritual maturity",
    ],

    capabilityThemes: [
      "mysticism",
      "dharma",
      "detachment",
      "guidance",
      "healing",
    ],

    strongExpression: [
      "sustained spiritual practice",
      "deeper devotion",
      "greater inner discipline",
      "stronger contemplative capacity",
    ],

    weakExpression: [
      "irregular spiritual practice",
      "confusion around belief",
      "need for stronger inner discipline",
    ],

    confidenceWeight:
      8,
  },

  {
    chart: "D60",
    name: "Shashtiamsa",

    primaryCategory:
      "spirituality",

    purpose:
      "Acts as a deep karmic confirmation layer and should be used only when birth time reliability is sufficiently high.",

    represents: [
      "deep karmic pattern",
      "root conditioning",
      "subtle planetary confirmation",
      "deep strength",
      "deep vulnerability",
    ],

    capabilityThemes: [
      "pattern_recognition",
      "research",
      "mysticism",
      "transformation",
      "dharma",
    ],

    strongExpression: [
      "deep confirmation of constructive natal promise",
      "strong karmic continuity",
      "greater depth of planetary expression",
    ],

    weakExpression: [
      "deep karmic friction",
      "subtle inconsistency",
      "greater need for corrective maturity",
    ],

    confidenceWeight:
      6,
  },
];

export const DIVISIONAL_CHART_PROFILE_BY_KEY:
  Record<
    string,
    DivisionalChartProfile | undefined
  > =
  Object.fromEntries(
    DIVISIONAL_CHART_PROFILES.map(
      (profile) => [
        profile.chart,
        profile,
      ]
    )
  );