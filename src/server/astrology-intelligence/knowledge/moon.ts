import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "./types";

const identity: KnowledgeRule[] = [
  {
    id: "moon_identity_mind",
    category: "identity",
    title: "Moon as the graha of mind",
    description:
      "The Moon governs mind, emotion, memory, adaptability, public response, care, habit, intuition, comfort, and psychological resilience.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "emotional intelligence",
        "adaptability",
        "memory",
        "intuition",
        "public sensitivity",
      ],
      strengthens: [
        "audience understanding",
        "care",
        "habit formation",
      ],
    },
  },
  {
    id: "moon_identity_business",
    category: "business",
    title: "Moon in business",
    description:
      "Moon supports customer understanding, hospitality, food, care, public-facing work, consumer behaviour, branding through emotion, and businesses dependent on trust.",
    weight: "very_high",
    priority: 98,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "customer understanding",
        "hospitality",
        "consumer behaviour",
        "public trust",
        "care-based services",
      ],
    },
  },
  {
    id: "moon_identity_shadow",
    category: "psychology",
    title: "Moon shadow expression",
    description:
      "An imbalanced Moon may produce anxiety, mood fluctuation, dependency, insecurity, emotional overreaction, and difficulty sustaining clarity.",
    weight: "high",
    priority: 92,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "anxiety",
        "mood fluctuation",
        "dependency",
        "insecurity",
        "emotional overreaction",
      ],
    },
  },
];

const signRules: KnowledgeRule[] = [
  {
    id: "moon_aries",
    category: "psychology",
    title: "Moon in Aries",
    description:
      "Moon in Aries responds quickly, independently, competitively, and emotionally through action.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Aries" },
    effect: {
      score: 12,
      adds: [
        "quick response",
        "independence",
        "emotional courage",
        "initiative",
      ],
      shadowAdds: [
        "impatience",
        "reactivity",
      ],
    },
  },
  {
    id: "moon_taurus",
    category: "strength",
    title: "Moon in Taurus",
    description:
      "Moon in Taurus strongly supports emotional stability, memory, nourishment, public trust, comfort, and practical sensitivity.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Taurus" },
    effect: {
      score: 22,
      adds: [
        "emotional stability",
        "memory",
        "nourishment",
        "public trust",
        "practical sensitivity",
      ],
      strengthens: [
        "customer understanding",
        "care",
        "consistency",
      ],
      shadowAdds: [
        "attachment to comfort",
      ],
    },
  },
  {
    id: "moon_gemini",
    category: "communication",
    title: "Moon in Gemini",
    description:
      "Moon in Gemini supports communication, curiosity, adaptability, storytelling, networking, and mental variety.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Gemini" },
    effect: {
      score: 14,
      adds: [
        "storytelling",
        "communication",
        "curiosity",
        "networking",
        "mental adaptability",
      ],
      shadowAdds: [
        "restlessness",
        "overthinking",
      ],
    },
  },
  {
    id: "moon_cancer",
    category: "strength",
    title: "Moon in Cancer",
    description:
      "Moon in Cancer expresses care, intuition, memory, emotional intelligence, family connection, and public sensitivity with natural strength.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Cancer" },
    effect: {
      score: 20,
      adds: [
        "care",
        "intuition",
        "memory",
        "emotional intelligence",
        "public sensitivity",
      ],
      shadowAdds: [
        "dependency",
        "emotional defensiveness",
      ],
    },
  },
  {
    id: "moon_leo",
    category: "career",
    title: "Moon in Leo",
    description:
      "Moon in Leo supports emotional leadership, visibility, creativity, warmth, audience connection, and recognition.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Leo" },
    effect: {
      score: 14,
      adds: [
        "emotional leadership",
        "visibility",
        "creativity",
        "warmth",
        "audience connection",
      ],
      shadowAdds: [
        "need for appreciation",
        "dramatic response",
      ],
    },
  },
  {
    id: "moon_virgo",
    category: "career",
    title: "Moon in Virgo",
    description:
      "Moon in Virgo supports service, health, detail, analysis, routines, care through practical action, and responsive problem solving.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Virgo" },
    effect: {
      score: 14,
      adds: [
        "practical care",
        "service",
        "health awareness",
        "routines",
        "responsive problem solving",
      ],
      shadowAdds: [
        "worry",
        "perfectionistic anxiety",
      ],
    },
  },
  {
    id: "moon_libra",
    category: "relationships",
    title: "Moon in Libra",
    description:
      "Moon in Libra supports diplomacy, partnership sensitivity, audience awareness, harmony, negotiation, and social balance.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Libra" },
    effect: {
      score: 14,
      adds: [
        "diplomacy",
        "partnership sensitivity",
        "audience awareness",
        "harmony",
        "negotiation",
      ],
      shadowAdds: [
        "indecision",
        "approval dependence",
      ],
    },
  },
  {
    id: "moon_scorpio",
    category: "strength",
    title: "Moon in Scorpio",
    description:
      "Moon in Scorpio may intensify emotion, fear, control, crisis sensitivity, and difficulty maintaining emotional stability.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Scorpio" },
    effect: {
      score: -20,
      adds: [
        "psychological depth",
        "crisis sensitivity",
        "investigation",
      ],
      weakens: [
        "emotional stability",
        "trust",
        "calm response",
      ],
      shadowAdds: [
        "emotional extremes",
        "control",
        "suspicion",
      ],
    },
  },
  {
    id: "moon_sagittarius",
    category: "education",
    title: "Moon in Sagittarius",
    description:
      "Moon in Sagittarius supports optimism, philosophy, travel, teaching, broad perspective, and emotional need for meaning.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Sagittarius" },
    effect: {
      score: 12,
      adds: [
        "optimism",
        "philosophy",
        "travel",
        "teaching",
        "broad perspective",
      ],
      shadowAdds: [
        "restlessness",
        "emotional preaching",
      ],
    },
  },
  {
    id: "moon_capricorn",
    category: "career",
    title: "Moon in Capricorn",
    description:
      "Moon in Capricorn supports emotional discipline, responsibility, administration, practical care, and public reliability.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Capricorn" },
    effect: {
      score: 14,
      adds: [
        "emotional discipline",
        "responsibility",
        "administration",
        "practical care",
        "public reliability",
      ],
      shadowAdds: [
        "emotional reserve",
        "pessimism",
      ],
    },
  },
  {
    id: "moon_aquarius",
    category: "business",
    title: "Moon in Aquarius",
    description:
      "Moon in Aquarius supports communities, networks, public systems, social causes, technology audiences, and collective sensitivity.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Aquarius" },
    effect: {
      score: 14,
      adds: [
        "community understanding",
        "networks",
        "public systems",
        "technology audiences",
        "collective sensitivity",
      ],
      shadowAdds: [
        "emotional detachment",
      ],
    },
  },
  {
    id: "moon_pisces",
    category: "spirituality",
    title: "Moon in Pisces",
    description:
      "Moon in Pisces supports empathy, imagination, healing, spirituality, compassion, creativity, and intuitive public connection.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Pisces" },
    effect: {
      score: 18,
      adds: [
        "empathy",
        "imagination",
        "healing",
        "spirituality",
        "intuitive public connection",
      ],
      shadowAdds: [
        "poor boundaries",
        "escapism",
      ],
    },
  },
];

const houseRules: KnowledgeRule[] = [
  {
    id: "moon_house_1",
    category: "identity",
    title: "Moon in the first house",
    description:
      "Moon in the first house makes emotion, adaptability, public response, care, intuition, and changing identity central to life expression.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 1 },
    effect: {
      score: 20,
      adds: [
        "adaptability",
        "public sensitivity",
        "intuition",
        "care",
        "emotional identity",
      ],
      shadowAdds: [
        "mood-dependent identity",
      ],
    },
  },
  {
    id: "moon_house_2",
    category: "wealth",
    title: "Moon in the second house",
    description:
      "Moon in the second house supports family resources, speech, food, public trust, changing income, and emotional connection to wealth.",
    weight: "high",
    priority: 90,
    trigger: { house: 2 },
    effect: {
      score: 14,
      adds: [
        "public trust",
        "family resources",
        "food",
        "pleasant speech",
        "consumer value",
      ],
      shadowAdds: [
        "income fluctuation",
        "emotional spending",
      ],
    },
  },
  {
    id: "moon_house_3",
    category: "communication",
    title: "Moon in the third house",
    description:
      "Moon in the third house supports communication, storytelling, media, adaptability, networking, writing, and audience sensitivity.",
    weight: "high",
    priority: 92,
    trigger: { house: 3 },
    effect: {
      score: 16,
      adds: [
        "storytelling",
        "media",
        "writing",
        "networking",
        "audience sensitivity",
      ],
    },
  },
  {
    id: "moon_house_4",
    category: "strength",
    title: "Moon in the fourth house",
    description:
      "Moon in the fourth house strongly supports emotional foundation, home, care, education, public trust, hospitality, and inner resilience.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 4 },
    effect: {
      score: 22,
      adds: [
        "emotional foundation",
        "home",
        "care",
        "education",
        "hospitality",
        "public trust",
      ],
    },
  },
  {
    id: "moon_house_5",
    category: "education",
    title: "Moon in the fifth house",
    description:
      "Moon in the fifth house supports creativity, children, education, storytelling, intuition, public appeal, and emotional intelligence.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 5 },
    effect: {
      score: 18,
      adds: [
        "creativity",
        "education",
        "storytelling",
        "intuition",
        "public appeal",
      ],
      shadowAdds: [
        "emotional speculation",
      ],
    },
  },
  {
    id: "moon_house_6",
    category: "career",
    title: "Moon in the sixth house",
    description:
      "Moon in the sixth house supports service, health, care, routines, public problems, customer complaints, and emotional labour.",
    weight: "high",
    priority: 88,
    trigger: { house: 6 },
    effect: {
      score: 12,
      adds: [
        "service",
        "health care",
        "routines",
        "customer complaints",
        "emotional labour",
      ],
      shadowAdds: [
        "stress sensitivity",
        "worry",
      ],
    },
  },
  {
    id: "moon_house_7",
    category: "relationships",
    title: "Moon in the seventh house",
    description:
      "Moon in the seventh house supports public connection, partnerships, consulting, customer understanding, negotiation, and relationship responsiveness.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 7 },
    effect: {
      score: 18,
      adds: [
        "public connection",
        "partnerships",
        "consulting",
        "customer understanding",
        "relationship responsiveness",
      ],
      shadowAdds: [
        "dependency on partnership",
      ],
    },
  },
  {
    id: "moon_house_8",
    category: "spirituality",
    title: "Moon in the eighth house",
    description:
      "Moon in the eighth house supports psychological depth, crisis sensitivity, research, transformation, hidden emotion, and intuitive investigation.",
    weight: "high",
    priority: 90,
    trigger: { house: 8 },
    effect: {
      score: 14,
      adds: [
        "psychological depth",
        "crisis sensitivity",
        "research",
        "transformation",
        "intuitive investigation",
      ],
      shadowAdds: [
        "emotional volatility",
        "fear",
      ],
    },
  },
  {
    id: "moon_house_9",
    category: "education",
    title: "Moon in the ninth house",
    description:
      "Moon in the ninth house supports travel, teaching, public philosophy, faith, culture, higher education, and intuitive guidance.",
    weight: "high",
    priority: 90,
    trigger: { house: 9 },
    effect: {
      score: 14,
      adds: [
        "travel",
        "teaching",
        "culture",
        "higher education",
        "intuitive guidance",
      ],
    },
  },
  {
    id: "moon_house_10",
    category: "career",
    title: "Moon in the tenth house",
    description:
      "Moon in the tenth house strongly supports public visibility, customer-facing work, care, hospitality, administration, media, and changing professional roles.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 10 },
    effect: {
      score: 22,
      adds: [
        "public visibility",
        "customer-facing work",
        "hospitality",
        "administration",
        "media",
      ],
      shadowAdds: [
        "career fluctuation",
        "public pressure",
      ],
    },
  },
  {
    id: "moon_house_11",
    category: "wealth",
    title: "Moon in the eleventh house",
    description:
      "Moon in the eleventh house supports gains through communities, public networks, audiences, customers, social connection, and changing opportunities.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 11 },
    effect: {
      score: 18,
      adds: [
        "public networks",
        "audiences",
        "customers",
        "community gains",
        "social connection",
      ],
      shadowAdds: [
        "fluctuating gains",
      ],
    },
  },
  {
    id: "moon_house_12",
    category: "spirituality",
    title: "Moon in the twelfth house",
    description:
      "Moon in the twelfth house supports imagination, foreign lands, retreat, care institutions, spirituality, dreams, and work behind the scenes.",
    weight: "high",
    priority: 88,
    trigger: { house: 12 },
    effect: {
      score: 12,
      adds: [
        "imagination",
        "foreign lands",
        "retreat",
        "care institutions",
        "spirituality",
        "dreams",
      ],
      shadowAdds: [
        "isolation",
        "emotional withdrawal",
      ],
    },
  },
];

const dignityRules: KnowledgeRule[] = [
  {
    id: "moon_dignity_exalted",
    category: "strength",
    title: "Exalted Moon",
    description:
      "Exalted Moon strongly supports emotional stability, memory, intuition, care, public trust, and adaptability.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "exalted" },
    effect: {
      score: 22,
      strengthens: [
        "emotional stability",
        "memory",
        "intuition",
        "care",
        "public trust",
      ],
    },
  },
  {
    id: "moon_dignity_own",
    category: "strength",
    title: "Moon in own sign",
    description:
      "Moon in its own sign expresses emotion, care, memory, intuition, and public sensitivity with natural competence.",
    weight: "very_high",
    priority: 98,
    trigger: { dignity: "own" },
    effect: {
      score: 20,
      strengthens: [
        "emotion",
        "care",
        "memory",
        "intuition",
        "public sensitivity",
      ],
    },
  },
  {
    id: "moon_dignity_friend",
    category: "strength",
    title: "Moon in friendly dignity",
    description:
      "Friendly dignity supports emotional balance, adaptability, care, and public connection.",
    weight: "high",
    priority: 86,
    trigger: { dignity: "friend" },
    effect: {
      score: 10,
      strengthens: [
        "emotional balance",
        "adaptability",
        "care",
        "public connection",
      ],
    },
  },
  {
    id: "moon_dignity_enemy",
    category: "strength",
    title: "Moon in inimical dignity",
    description:
      "Inimical dignity may weaken emotional stability, trust, adaptability, memory, or public confidence.",
    weight: "high",
    priority: 90,
    trigger: { dignity: "enemy" },
    effect: {
      score: -12,
      weakens: [
        "emotional stability",
        "trust",
        "adaptability",
        "public confidence",
      ],
      shadowAdds: [
        "insecurity",
        "mood fluctuation",
      ],
    },
  },
  {
    id: "moon_dignity_debilitated",
    category: "strength",
    title: "Debilitated Moon",
    description:
      "Debilitated Moon may weaken emotional stability, trust, mental resilience, adaptability, and public confidence unless cancellation or support is present.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "debilitated" },
    effect: {
      score: -22,
      weakens: [
        "emotional stability",
        "trust",
        "mental resilience",
        "adaptability",
      ],
      shadowAdds: [
        "emotional extremes",
        "fear",
        "suspicion",
      ],
    },
  },
  {
    id: "moon_vargottama",
    category: "strength",
    title: "Vargottama Moon",
    description:
      "Vargottama Moon strengthens consistency in emotional intelligence, memory, intuition, care, and public response.",
    weight: "very_high",
    priority: 95,
    trigger: { vargottama: true },
    effect: {
      score: 18,
      strengthens: [
        "emotional intelligence",
        "memory",
        "intuition",
        "care",
        "public response",
      ],
    },
  },
];

const conjunctionRules: KnowledgeRule[] = [
  {
    id: "moon_conjunct_sun",
    category: "identity",
    title: "Moon conjunct Sun",
    description:
      "Moon with Sun combines mind and identity, supporting focus, visibility, purpose, and subjective leadership.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Sun" },
    effect: {
      score: 16,
      adds: [
        "focus",
        "visibility",
        "purpose",
        "subjective leadership",
      ],
      shadowAdds: [
        "difficulty separating emotion from identity",
      ],
    },
  },
  {
    id: "moon_conjunct_mars",
    category: "psychology",
    title: "Moon conjunct Mars",
    description:
      "Moon with Mars intensifies courage, protection, emotional drive, reactivity, and instinctive action.",
    weight: "high",
    priority: 92,
    trigger: { conjunction: "Mars" },
    effect: {
      score: 12,
      adds: [
        "protective courage",
        "emotional drive",
        "instinctive action",
      ],
      shadowAdds: [
        "reactivity",
        "impatience",
        "emotional volatility",
      ],
    },
  },
  {
    id: "moon_conjunct_mercury",
    category: "communication",
    title: "Moon conjunct Mercury",
    description:
      "Moon with Mercury supports storytelling, memory, communication, audience understanding, writing, and emotional intelligence.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mercury" },
    effect: {
      score: 20,
      adds: [
        "storytelling",
        "memory",
        "communication",
        "audience understanding",
        "writing",
      ],
      shadowAdds: [
        "overthinking",
        "mood-driven judgement",
      ],
    },
  },
  {
    id: "moon_conjunct_jupiter",
    category: "relationships",
    title: "Moon conjunct Jupiter",
    description:
      "Moon with Jupiter supports emotional wisdom, care, counselling, generosity, public trust, and protective judgement.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Jupiter" },
    effect: {
      score: 20,
      adds: [
        "emotional wisdom",
        "counselling",
        "care",
        "generosity",
        "public trust",
      ],
      shadowAdds: [
        "emotional excess",
      ],
    },
  },
  {
    id: "moon_conjunct_venus",
    category: "business",
    title: "Moon conjunct Venus",
    description:
      "Moon with Venus supports hospitality, customer understanding, emotional appeal, beauty, public trust, and relationship warmth.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Venus" },
    effect: {
      score: 20,
      adds: [
        "hospitality",
        "customer understanding",
        "emotional appeal",
        "beauty",
        "public trust",
      ],
      shadowAdds: [
        "comfort seeking",
        "emotional dependency",
      ],
    },
  },
  {
    id: "moon_conjunct_saturn",
    category: "psychology",
    title: "Moon conjunct Saturn",
    description:
      "Moon with Saturn supports emotional endurance, responsibility, realism, care under pressure, and public reliability while increasing heaviness.",
    weight: "high",
    priority: 94,
    trigger: { conjunction: "Saturn" },
    effect: {
      score: 14,
      adds: [
        "emotional endurance",
        "responsibility",
        "realism",
        "public reliability",
      ],
      shadowAdds: [
        "emotional heaviness",
        "isolation",
        "pessimism",
      ],
    },
  },
  {
    id: "moon_conjunct_rahu",
    category: "psychology",
    title: "Moon conjunct Rahu",
    description:
      "Moon with Rahu amplifies imagination, media appeal, public sensitivity, emotional intensity, anxiety, and instability.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Rahu" },
    effect: {
      score: 16,
      adds: [
        "media appeal",
        "public sensitivity",
        "imagination",
        "emotional influence",
      ],
      shadowAdds: [
        "anxiety",
        "emotional instability",
        "obsession",
      ],
    },
  },
  {
    id: "moon_conjunct_ketu",
    category: "spirituality",
    title: "Moon conjunct Ketu",
    description:
      "Moon with Ketu supports intuition, detachment, spiritual sensitivity, memory of subtle patterns, and inward emotional processing.",
    weight: "high",
    priority: 94,
    trigger: { conjunction: "Ketu" },
    effect: {
      score: 14,
      adds: [
        "intuition",
        "spiritual sensitivity",
        "subtle memory",
        "inward processing",
      ],
      shadowAdds: [
        "emotional detachment",
        "difficulty expressing needs",
      ],
    },
  },
];

const aspectRules: KnowledgeRule[] = [
  {
    id: "moon_aspected_by_mars",
    category: "psychology",
    title: "Mars aspects Moon",
    description:
      "Mars energises the Moon through courage, protection, action, intensity, and emotional reactivity.",
    weight: "high",
    priority: 92,
    trigger: { aspectFrom: "Mars" },
    effect: {
      score: 12,
      adds: [
        "courage",
        "protection",
        "emotional drive",
        "action",
      ],
      shadowAdds: [
        "reactivity",
        "impatience",
      ],
    },
  },
  {
    id: "moon_aspected_by_mercury",
    category: "communication",
    title: "Mercury aspects Moon",
    description:
      "Mercury sharpens the Moon through storytelling, writing, memory, audience understanding, communication, and analysis.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "storytelling",
        "writing",
        "memory",
        "audience understanding",
        "communication",
      ],
    },
  },
  {
    id: "moon_aspected_by_jupiter",
    category: "relationships",
    title: "Jupiter aspects Moon",
    description:
      "Jupiter guides the Moon toward emotional wisdom, care, counselling, generosity, faith, and public trust.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Jupiter" },
    effect: {
      score: 16,
      adds: [
        "emotional wisdom",
        "care",
        "counselling",
        "generosity",
        "public trust",
      ],
    },
  },
  {
    id: "moon_aspected_by_venus",
    category: "business",
    title: "Venus aspects Moon",
    description:
      "Venus refines the Moon through hospitality, beauty, emotional appeal, customer understanding, relationships, and public trust.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Venus" },
    effect: {
      score: 16,
      adds: [
        "hospitality",
        "beauty",
        "emotional appeal",
        "customer understanding",
        "public trust",
      ],
    },
  },
  {
    id: "moon_aspected_by_saturn",
    category: "psychology",
    title: "Saturn aspects Moon",
    description:
      "Saturn disciplines the Moon through responsibility, realism, endurance, emotional restraint, care under pressure, and public reliability.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Saturn" },
    effect: {
      score: 14,
      adds: [
        "responsibility",
        "realism",
        "endurance",
        "public reliability",
      ],
      shadowAdds: [
        "emotional heaviness",
        "pessimism",
      ],
    },
  },
  {
    id: "moon_aspected_by_rahu",
    category: "psychology",
    title: "Rahu aspects Moon",
    description:
      "Rahu amplifies the Moon toward media, public influence, imagination, emotional intensity, anxiety, and instability.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Rahu" },
    effect: {
      score: 16,
      adds: [
        "media",
        "public influence",
        "imagination",
        "emotional reach",
      ],
      shadowAdds: [
        "anxiety",
        "instability",
      ],
    },
  },
  {
    id: "moon_aspected_by_ketu",
    category: "spirituality",
    title: "Ketu aspects Moon",
    description:
      "Ketu turns the Moon inward and supports intuition, detachment, subtle perception, spiritual sensitivity, and emotional withdrawal.",
    weight: "high",
    priority: 92,
    trigger: { aspectFrom: "Ketu" },
    effect: {
      score: 14,
      adds: [
        "intuition",
        "subtle perception",
        "spiritual sensitivity",
        "inward processing",
      ],
      shadowAdds: [
        "emotional withdrawal",
      ],
    },
  },
];

const dispositorRules: KnowledgeRule[] = [
  {
    id: "moon_dispositor_sun",
    category: "career",
    title: "Moon disposed by Sun",
    description:
      "When the Sun disposes the Moon, emotion seeks visibility, authority, leadership, recognition, and public expression.",
    weight: "high",
    priority: 90,
    trigger: { dispositor: "Sun" },
    effect: {
      score: 14,
      adds: [
        "emotional leadership",
        "visibility",
        "authority",
        "public expression",
      ],
    },
  },
  {
    id: "moon_dispositor_mars",
    category: "psychology",
    title: "Moon disposed by Mars",
    description:
      "When Mars disposes the Moon, emotion becomes active, protective, competitive, courageous, and reactive.",
    weight: "high",
    priority: 92,
    trigger: { dispositor: "Mars" },
    effect: {
      score: 14,
      adds: [
        "protective action",
        "courage",
        "emotional drive",
        "competition",
      ],
      shadowAdds: [
        "reactivity",
      ],
    },
  },
  {
    id: "moon_dispositor_mercury",
    category: "communication",
    title: "Moon disposed by Mercury",
    description:
      "When Mercury disposes the Moon, emotion is expressed through communication, writing, analysis, storytelling, networking, and mental adaptability.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "communication",
        "writing",
        "analysis",
        "storytelling",
        "networking",
      ],
    },
  },
  {
    id: "moon_dispositor_jupiter",
    category: "relationships",
    title: "Moon disposed by Jupiter",
    description:
      "When Jupiter disposes the Moon, emotion becomes wise, generous, philosophical, caring, advisory, and meaning-oriented.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Jupiter" },
    effect: {
      score: 16,
      adds: [
        "emotional wisdom",
        "generosity",
        "care",
        "advisory sensitivity",
        "meaning-oriented response",
      ],
    },
  },
  {
    id: "moon_dispositor_venus",
    category: "business",
    title: "Moon disposed by Venus",
    description:
      "When Venus disposes the Moon, emotion is channelled through hospitality, relationships, beauty, customer understanding, comfort, and public appeal.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Venus" },
    effect: {
      score: 16,
      adds: [
        "hospitality",
        "relationships",
        "beauty",
        "customer understanding",
        "public appeal",
      ],
    },
  },
  {
    id: "moon_dispositor_saturn",
    category: "career",
    title: "Moon disposed by Saturn",
    description:
      "When Saturn disposes the Moon, emotion becomes disciplined, responsible, practical, restrained, public-facing, and duty-oriented.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Saturn" },
    effect: {
      score: 16,
      adds: [
        "discipline",
        "responsibility",
        "practical care",
        "public reliability",
        "duty",
      ],
      shadowAdds: [
        "emotional heaviness",
      ],
    },
  },
];

const businessRules: KnowledgeRule[] = [
  {
    id: "moon_business_2nd_lord",
    category: "wealth",
    title: "Moon ruling the second house",
    description:
      "Moon ruling the second house supports income through food, public trust, speech, care, family resources, hospitality, and customer understanding.",
    weight: "very_high",
    priority: 96,
    trigger: { ownsHouse: 2 },
    effect: {
      score: 18,
      strengthens: [
        "food",
        "public trust",
        "hospitality",
        "customer understanding",
        "family resources",
      ],
    },
  },
  {
    id: "moon_business_4th_lord",
    category: "business",
    title: "Moon ruling the fourth house",
    description:
      "Moon ruling the fourth house supports property, education, hospitality, care, home, public trust, and emotional foundations.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 4 },
    effect: {
      score: 20,
      strengthens: [
        "property",
        "education",
        "hospitality",
        "care",
        "public trust",
      ],
    },
  },
  {
    id: "moon_business_7th_lord",
    category: "business",
    title: "Moon ruling the seventh house",
    description:
      "Moon ruling the seventh house supports partnerships, consulting, public dealing, customer understanding, contracts, and responsive service.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 7 },
    effect: {
      score: 20,
      strengthens: [
        "partnerships",
        "consulting",
        "public dealing",
        "customer understanding",
        "responsive service",
      ],
    },
  },
  {
    id: "moon_business_10th_lord",
    category: "career",
    title: "Moon ruling the tenth house",
    description:
      "Moon ruling the tenth house ties professional success to public response, care, hospitality, administration, media, customers, and adaptability.",
    weight: "very_high",
    priority: 100,
    trigger: { ownsHouse: 10 },
    effect: {
      score: 22,
      strengthens: [
        "public response",
        "care",
        "hospitality",
        "administration",
        "media",
        "customer-facing work",
      ],
    },
  },
  {
    id: "moon_business_11th_lord",
    category: "wealth",
    title: "Moon ruling the eleventh house",
    description:
      "Moon ruling the eleventh house supports gains through communities, audiences, customers, public networks, care, and changing opportunities.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 11 },
    effect: {
      score: 20,
      strengthens: [
        "community gains",
        "audiences",
        "customers",
        "public networks",
        "changing opportunities",
      ],
    },
  },
];

const careerRules: KnowledgeRule[] = [
  {
    id: "moon_career_public_professions",
    category: "career",
    title: "Moon and public-facing professions",
    description:
      "A strong Moon supports professions involving hospitality, care, food, customer experience, media, public administration, counselling, education, and audience understanding.",
    weight: "very_high",
    priority: 98,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "hospitality",
        "care",
        "food",
        "customer experience",
        "media",
        "public administration",
        "counselling",
      ],
    },
  },
];

const wealthRules: KnowledgeRule[] = [
  {
    id: "moon_wealth_public",
    category: "wealth",
    title: "Moon and wealth through public response",
    description:
      "Moon supports wealth through customers, public trust, food, hospitality, care, property, consumer understanding, and recurring demand.",
    weight: "high",
    priority: 92,
    trigger: {},
    effect: {
      score: 14,
      adds: [
        "customers",
        "public trust",
        "food",
        "hospitality",
        "property",
        "recurring demand",
      ],
    },
  },
];

const relationshipRules: KnowledgeRule[] = [
  {
    id: "moon_relationship_care",
    category: "relationships",
    title: "Moon in relationships",
    description:
      "Moon brings care, emotional bonding, memory, dependency, protection, empathy, and the need for emotional security in relationships.",
    weight: "very_high",
    priority: 92,
    trigger: {},
    effect: {
      score: 14,
      adds: [
        "care",
        "emotional bonding",
        "protection",
        "empathy",
        "security",
      ],
      shadowAdds: [
        "dependency",
        "mood-driven response",
      ],
    },
  },
];

const healthRules: KnowledgeRule[] = [
  {
    id: "moon_health_regulation",
    category: "health",
    title: "Moon and bodily regulation",
    description:
      "Moon relates to fluids, sleep, digestion, emotional regulation, hormones, memory, appetite, and recovery through rest.",
    weight: "high",
    priority: 85,
    trigger: {},
    effect: {
      score: 8,
      adds: [
        "recovery through rest",
        "fluid balance",
        "emotional regulation",
        "sleep",
      ],
      shadowAdds: [
        "sleep disturbance",
        "digestive fluctuation",
        "stress sensitivity",
      ],
    },
  },
];

const spiritualityRules: KnowledgeRule[] = [
  {
    id: "moon_spiritual_receptivity",
    category: "spirituality",
    title: "Moon and spiritual receptivity",
    description:
      "Moon supports devotion, intuition, receptivity, ritual, memory, compassion, and emotional connection to spiritual practice.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 14,
      adds: [
        "devotion",
        "intuition",
        "receptivity",
        "ritual",
        "compassion",
      ],
    },
  },
];

const shadowRules: KnowledgeRule[] = [
  {
    id: "moon_shadow_instability",
    category: "psychology",
    title: "Moon excess",
    description:
      "A highly active Moon may become anxious, dependent, emotionally reactive, approval-sensitive, inconsistent, or overwhelmed by public response.",
    weight: "high",
    priority: 92,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "anxiety",
        "dependency",
        "emotional reactivity",
        "approval sensitivity",
        "inconsistency",
      ],
    },
  },
];

export const MoonKnowledge: PlanetKnowledge = {
  planet: "Moon",

  identity,
  signRules,
  houseRules,
  dignityRules,
  conjunctionRules,
  aspectRules,
  dispositorRules,

  nakshatraRules: [],
  avasthaRules: [],
  vargaRules: [],
  dashaRules: [],
  transitRules: [],

  careerRules,
  businessRules,
  wealthRules,
  relationshipRules,
  healthRules,
  spiritualityRules,
  shadowRules,
};
