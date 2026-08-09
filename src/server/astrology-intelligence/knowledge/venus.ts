import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "./types";

const identity: KnowledgeRule[] = [
  {
    id: "venus_identity_value",
    category: "identity",
    title: "Venus as the graha of value",
    description:
      "Venus governs value, attraction, harmony, relationships, beauty, pleasure, refinement, negotiation, and the ability to create desirable experiences.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "value creation",
        "relationship intelligence",
        "aesthetic judgement",
        "refinement",
        "attraction",
      ],
      strengthens: [
        "diplomacy",
        "negotiation",
        "client understanding",
      ],
    },
  },
  {
    id: "venus_identity_business",
    category: "business",
    title: "Venus in business",
    description:
      "Venus supports businesses built around customer appeal, branding, relationships, hospitality, luxury, design, culture, beauty, comfort, and experience.",
    weight: "very_high",
    priority: 98,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "branding",
        "customer experience",
        "relationship-led commerce",
        "hospitality",
        "luxury",
        "design",
      ],
    },
  },
  {
    id: "venus_identity_wealth",
    category: "wealth",
    title: "Venus and material value",
    description:
      "Venus supports wealth through desirability, quality, relationships, market appeal, negotiation, and the conversion of taste into value.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "market value",
        "commercial appeal",
        "negotiation",
        "relationship wealth",
        "quality premium",
      ],
    },
  },
  {
    id: "venus_identity_shadow",
    category: "psychology",
    title: "Venus shadow expression",
    description:
      "An imbalanced Venus may produce indulgence, dependency on approval, avoidance of conflict, excessive compromise, or attachment to comfort and appearance.",
    weight: "high",
    priority: 88,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "indulgence",
        "approval seeking",
        "conflict avoidance",
        "over-accommodation",
        "attachment to comfort",
      ],
    },
  },
];

const signRules: KnowledgeRule[] = [
  {
    id: "venus_aries",
    category: "relationships",
    title: "Venus in Aries",
    description:
      "Venus in Aries values independence, direct attraction, initiative, passion, and fast-moving relationships or commercial decisions.",
    weight: "high",
    priority: 85,
    trigger: { sign: "Aries" },
    effect: {
      score: 10,
      adds: [
        "direct attraction",
        "independent taste",
        "bold branding",
        "fast commercial response",
      ],
      shadowAdds: [
        "impatience in relationships",
        "impulsive spending",
      ],
    },
  },
  {
    id: "venus_taurus",
    category: "strength",
    title: "Venus in Taurus",
    description:
      "Venus in Taurus supports material stability, quality, comfort, beauty, resources, loyalty, and practical value creation.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Taurus" },
    effect: {
      score: 20,
      adds: [
        "quality",
        "material stability",
        "resource value",
        "loyalty",
        "sensory refinement",
      ],
      strengthens: [
        "wealth",
        "customer value",
        "commercial appeal",
      ],
      shadowAdds: [
        "possessiveness",
        "resistance to change",
      ],
    },
  },
  {
    id: "venus_gemini",
    category: "communication",
    title: "Venus in Gemini",
    description:
      "Venus in Gemini supports charm through communication, networking, content, media, variety, and intellectual connection.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Gemini" },
    effect: {
      score: 12,
      adds: [
        "charming communication",
        "content",
        "networking",
        "media",
        "intellectual attraction",
      ],
      shadowAdds: [
        "restlessness",
        "inconsistent attachment",
      ],
    },
  },
  {
    id: "venus_cancer",
    category: "relationships",
    title: "Venus in Cancer",
    description:
      "Venus in Cancer values care, emotional security, family connection, nourishment, home, and protective relationships.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Cancer" },
    effect: {
      score: 12,
      adds: [
        "care",
        "emotional security",
        "family orientation",
        "hospitality",
        "nurturing appeal",
      ],
      shadowAdds: [
        "emotional dependency",
        "difficulty separating care from attachment",
      ],
    },
  },
  {
    id: "venus_leo",
    category: "business",
    title: "Venus in Leo",
    description:
      "Venus in Leo supports visibility, luxury, presentation, performance, prestige, generosity, and premium positioning.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Leo" },
    effect: {
      score: 14,
      adds: [
        "premium positioning",
        "luxury",
        "performance",
        "prestige",
        "visible branding",
      ],
      shadowAdds: [
        "vanity",
        "need for admiration",
        "overspending on appearance",
      ],
    },
  },
  {
    id: "venus_virgo",
    category: "strength",
    title: "Venus in Virgo",
    description:
      "Venus in Virgo may become overly analytical, selective, practical, or critical in relationships and value decisions.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Virgo" },
    effect: {
      score: -20,
      adds: [
        "practical service",
        "detail sensitivity",
        "quality control",
      ],
      weakens: [
        "ease in affection",
        "spontaneous enjoyment",
        "relationship flow",
      ],
      shadowAdds: [
        "criticism",
        "perfectionism in relationships",
        "difficulty receiving pleasure",
      ],
    },
  },
  {
    id: "venus_libra",
    category: "strength",
    title: "Venus in Libra",
    description:
      "Venus in Libra supports diplomacy, balance, partnership, negotiation, law, aesthetics, and refined social intelligence.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Libra" },
    effect: {
      score: 20,
      adds: [
        "diplomacy",
        "partnership",
        "negotiation",
        "aesthetic balance",
        "social intelligence",
      ],
      strengthens: [
        "relationships",
        "branding",
        "client management",
      ],
      shadowAdds: [
        "indecision",
        "over-accommodation",
      ],
    },
  },
  {
    id: "venus_scorpio",
    category: "relationships",
    title: "Venus in Scorpio",
    description:
      "Venus in Scorpio intensifies attachment, intimacy, emotional depth, shared resources, transformation, and magnetism.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Scorpio" },
    effect: {
      score: 12,
      adds: [
        "magnetism",
        "emotional depth",
        "intimacy",
        "shared finance",
        "transformational relationships",
      ],
      shadowAdds: [
        "jealousy",
        "control",
        "emotional extremes",
      ],
    },
  },
  {
    id: "venus_sagittarius",
    category: "education",
    title: "Venus in Sagittarius",
    description:
      "Venus in Sagittarius values meaning, learning, philosophy, freedom, culture, travel, and relationships based on shared principles.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Sagittarius" },
    effect: {
      score: 12,
      adds: [
        "cultural appreciation",
        "philosophical relationships",
        "education",
        "travel",
        "meaning-led value",
      ],
      shadowAdds: [
        "idealisation",
        "restlessness in commitment",
      ],
    },
  },
  {
    id: "venus_capricorn",
    category: "business",
    title: "Venus in Capricorn",
    description:
      "Venus in Capricorn values durability, status, structure, professional relationships, disciplined finance, and long-term value.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Capricorn" },
    effect: {
      score: 14,
      adds: [
        "long-term value",
        "professional relationships",
        "disciplined finance",
        "status positioning",
        "structured partnerships",
      ],
      shadowAdds: [
        "emotional reserve",
        "transactional relationships",
      ],
    },
  },
  {
    id: "venus_aquarius",
    category: "business",
    title: "Venus in Aquarius",
    description:
      "Venus in Aquarius supports networks, digital communities, unconventional relationships, social causes, future-oriented design, and platform appeal.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Aquarius" },
    effect: {
      score: 14,
      adds: [
        "digital communities",
        "platform appeal",
        "social design",
        "network value",
        "unconventional relationships",
      ],
      shadowAdds: [
        "emotional detachment",
        "preference for ideals over intimacy",
      ],
    },
  },
  {
    id: "venus_pisces",
    category: "strength",
    title: "Venus in Pisces",
    description:
      "Venus in Pisces strongly supports compassion, imagination, artistry, devotion, healing, romance, and unconditional appreciation.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Pisces" },
    effect: {
      score: 22,
      adds: [
        "compassion",
        "imagination",
        "artistry",
        "devotion",
        "healing",
        "romantic sensitivity",
      ],
      strengthens: [
        "creativity",
        "relationships",
        "spiritual love",
      ],
      shadowAdds: [
        "poor boundaries",
        "idealisation",
        "escapism",
      ],
    },
  },
];

const houseRules: KnowledgeRule[] = [
  {
    id: "venus_house_1",
    category: "identity",
    title: "Venus in the first house",
    description:
      "Venus in the first house makes charm, diplomacy, appearance, value, and relationship intelligence central to identity.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 1 },
    effect: {
      score: 18,
      adds: [
        "charm",
        "diplomacy",
        "social appeal",
        "aesthetic identity",
      ],
      shadowAdds: [
        "approval seeking",
        "over-identification with appearance",
      ],
    },
  },
  {
    id: "venus_house_2",
    category: "wealth",
    title: "Venus in the second house",
    description:
      "Venus in the second house supports income, speech, family resources, luxury, quality, food, beauty, and value-based wealth.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 2 },
    effect: {
      score: 20,
      adds: [
        "income",
        "pleasant speech",
        "family resources",
        "luxury value",
        "quality-based wealth",
      ],
      shadowAdds: [
        "overspending",
        "attachment to possessions",
      ],
    },
  },
  {
    id: "venus_house_3",
    category: "communication",
    title: "Venus in the third house",
    description:
      "Venus in the third house supports communication, content, writing, design, media, marketing, networking, and persuasive presentation.",
    weight: "high",
    priority: 90,
    trigger: { house: 3 },
    effect: {
      score: 14,
      adds: [
        "content",
        "writing",
        "marketing",
        "media",
        "persuasive presentation",
      ],
    },
  },
  {
    id: "venus_house_4",
    category: "relationships",
    title: "Venus in the fourth house",
    description:
      "Venus in the fourth house supports home comfort, education, property, interiors, family harmony, emotional refinement, and hospitality.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 4 },
    effect: {
      score: 18,
      adds: [
        "home comfort",
        "property",
        "interiors",
        "family harmony",
        "hospitality",
      ],
      shadowAdds: [
        "attachment to comfort",
        "avoidance of emotional conflict",
      ],
    },
  },
  {
    id: "venus_house_5",
    category: "business",
    title: "Venus in the fifth house",
    description:
      "Venus in the fifth house supports creativity, entertainment, romance, education, children, speculation, design, and expressive value creation.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 5 },
    effect: {
      score: 20,
      adds: [
        "creativity",
        "entertainment",
        "design",
        "education",
        "expressive value creation",
      ],
      shadowAdds: [
        "speculative indulgence",
        "need for appreciation",
      ],
    },
  },
  {
    id: "venus_house_6",
    category: "career",
    title: "Venus in the sixth house",
    description:
      "Venus in the sixth house supports client service, HR, health, beauty services, workplace diplomacy, routines, and conflict management.",
    weight: "medium",
    priority: 82,
    trigger: { house: 6 },
    effect: {
      score: 8,
      adds: [
        "client service",
        "HR",
        "workplace diplomacy",
        "beauty services",
        "conflict management",
      ],
      shadowAdds: [
        "people pleasing at work",
        "relationship complications in service environments",
      ],
    },
  },
  {
    id: "venus_house_7",
    category: "relationships",
    title: "Venus in the seventh house",
    description:
      "Venus in the seventh house strongly supports partnership, negotiation, public appeal, contracts, consulting, diplomacy, and client relationships.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 7 },
    effect: {
      score: 22,
      adds: [
        "partnership",
        "negotiation",
        "public appeal",
        "contracts",
        "client relationships",
      ],
      shadowAdds: [
        "dependency on partnership",
        "avoidance of difficult boundaries",
      ],
    },
  },
  {
    id: "venus_house_8",
    category: "wealth",
    title: "Venus in the eighth house",
    description:
      "Venus in the eighth house supports shared resources, inheritance, finance, intimacy, transformation, hidden value, and relationship depth.",
    weight: "high",
    priority: 88,
    trigger: { house: 8 },
    effect: {
      score: 12,
      adds: [
        "shared finance",
        "inheritance",
        "hidden value",
        "relationship transformation",
        "intimacy",
      ],
      shadowAdds: [
        "financial dependency",
        "jealousy",
        "hidden relationship complications",
      ],
    },
  },
  {
    id: "venus_house_9",
    category: "education",
    title: "Venus in the ninth house",
    description:
      "Venus in the ninth house supports culture, travel, higher education, philosophy, publishing, art, diplomacy, and relationships across backgrounds.",
    weight: "high",
    priority: 90,
    trigger: { house: 9 },
    effect: {
      score: 14,
      adds: [
        "culture",
        "travel",
        "higher education",
        "publishing",
        "cross-cultural relationships",
      ],
    },
  },
  {
    id: "venus_house_10",
    category: "career",
    title: "Venus in the tenth house",
    description:
      "Venus in the tenth house supports public appeal, branding, leadership through relationships, design, luxury, hospitality, HR, media, and client-facing authority.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 10 },
    effect: {
      score: 22,
      adds: [
        "branding",
        "public appeal",
        "design",
        "hospitality",
        "HR",
        "media",
        "client-facing leadership",
      ],
    },
  },
  {
    id: "venus_house_11",
    category: "wealth",
    title: "Venus in the eleventh house",
    description:
      "Venus in the eleventh house supports gains through networks, clients, communities, relationships, social reach, and desirable offerings.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 11 },
    effect: {
      score: 20,
      adds: [
        "network gains",
        "client growth",
        "community value",
        "social reach",
        "relationship income",
      ],
    },
  },
  {
    id: "venus_house_12",
    category: "spirituality",
    title: "Venus in the twelfth house",
    description:
      "Venus in the twelfth house supports imagination, private creativity, foreign connections, luxury expenditure, retreat, compassion, and spiritual love.",
    weight: "high",
    priority: 88,
    trigger: { house: 12 },
    effect: {
      score: 12,
      adds: [
        "private creativity",
        "foreign connections",
        "retreat",
        "compassion",
        "spiritual love",
      ],
      shadowAdds: [
        "secret relationships",
        "luxury expenditure",
        "poor boundaries",
      ],
    },
  },
];

const dignityRules: KnowledgeRule[] = [
  {
    id: "venus_dignity_exalted",
    category: "strength",
    title: "Exalted Venus",
    description:
      "Exalted Venus strongly supports compassion, creativity, refinement, relationships, value, and artistic or spiritual appreciation.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "exalted" },
    effect: {
      score: 22,
      strengthens: [
        "relationships",
        "creativity",
        "value creation",
        "compassion",
        "refinement",
      ],
    },
  },
  {
    id: "venus_dignity_own",
    category: "strength",
    title: "Venus in own sign",
    description:
      "Venus in its own sign expresses attraction, diplomacy, value, relationships, and aesthetic judgement with natural competence.",
    weight: "very_high",
    priority: 98,
    trigger: { dignity: "own" },
    effect: {
      score: 20,
      strengthens: [
        "diplomacy",
        "relationships",
        "commercial appeal",
        "aesthetic judgement",
      ],
    },
  },
  {
    id: "venus_dignity_friend",
    category: "strength",
    title: "Venus in friendly dignity",
    description:
      "Friendly dignity supports harmony, value creation, client relationships, and social intelligence.",
    weight: "high",
    priority: 85,
    trigger: { dignity: "friend" },
    effect: {
      score: 10,
      strengthens: [
        "harmony",
        "client relationships",
        "value creation",
        "social intelligence",
      ],
    },
  },
  {
    id: "venus_dignity_enemy",
    category: "strength",
    title: "Venus in inimical dignity",
    description:
      "Inimical dignity may reduce relationship ease, value clarity, satisfaction, or the ability to convert attraction into stable outcomes.",
    weight: "high",
    priority: 90,
    trigger: { dignity: "enemy" },
    effect: {
      score: -12,
      weakens: [
        "relationship ease",
        "value clarity",
        "satisfaction",
      ],
      shadowAdds: [
        "conflicted desires",
        "unstable preferences",
      ],
    },
  },
  {
    id: "venus_dignity_debilitated",
    category: "strength",
    title: "Debilitated Venus",
    description:
      "Debilitated Venus may weaken relationship flow, enjoyment, self-worth, satisfaction, and value decisions unless cancellation or strong support is present.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "debilitated" },
    effect: {
      score: -22,
      weakens: [
        "relationships",
        "self-worth",
        "satisfaction",
        "value decisions",
      ],
      shadowAdds: [
        "criticism",
        "relationship dissatisfaction",
        "difficulty receiving pleasure",
      ],
    },
  },
  {
    id: "venus_retrograde",
    category: "psychology",
    title: "Retrograde Venus",
    description:
      "Retrograde Venus internalises value, love, taste, self-worth, and relationship choices, often producing repeated review of what is truly desirable.",
    weight: "high",
    priority: 88,
    trigger: { retrograde: true },
    effect: {
      score: 2,
      adds: [
        "independent values",
        "inner refinement",
        "relationship reflection",
        "reassessment of desire",
      ],
      shadowAdds: [
        "difficulty trusting attraction",
        "repeated relationship review",
      ],
    },
  },
  {
    id: "venus_combust",
    category: "strength",
    title: "Combust Venus",
    description:
      "Combustion can reduce independent relationship judgement, satisfaction, artistic ease, and the ability to express value without pressure from authority or ego.",
    weight: "high",
    priority: 90,
    trigger: { combust: true },
    effect: {
      score: -12,
      weakens: [
        "relationship judgement",
        "satisfaction",
        "artistic ease",
        "independent values",
      ],
      shadowAdds: [
        "ego in relationships",
        "suppressed preferences",
      ],
    },
  },
  {
    id: "venus_vargottama",
    category: "strength",
    title: "Vargottama Venus",
    description:
      "Vargottama Venus strengthens consistency in relationships, values, creativity, and commercial appeal across natal and navamsa expression.",
    weight: "very_high",
    priority: 95,
    trigger: { vargottama: true },
    effect: {
      score: 18,
      strengthens: [
        "relationships",
        "values",
        "creativity",
        "commercial appeal",
        "consistency",
      ],
    },
  },
];

const conjunctionRules: KnowledgeRule[] = [
  {
    id: "venus_conjunct_sun",
    category: "career",
    title: "Venus conjunct Sun",
    description:
      "Venus with the Sun supports public appeal, leadership presentation, creativity, prestige, branding, and visible relationship intelligence.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Sun" },
    effect: {
      score: 16,
      adds: [
        "public appeal",
        "prestige",
        "branding",
        "leadership presentation",
        "creativity",
      ],
      shadowAdds: [
        "vanity",
        "ego in relationships",
      ],
    },
  },
  {
    id: "venus_conjunct_moon",
    category: "relationships",
    title: "Venus conjunct Moon",
    description:
      "Venus with the Moon supports care, emotional appeal, hospitality, beauty, popularity, audience sensitivity, and relationship warmth.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Moon" },
    effect: {
      score: 18,
      adds: [
        "emotional appeal",
        "hospitality",
        "relationship warmth",
        "audience sensitivity",
        "popularity",
      ],
      shadowAdds: [
        "emotional dependency",
        "comfort seeking",
      ],
    },
  },
  {
    id: "venus_conjunct_mars",
    category: "business",
    title: "Venus conjunct Mars",
    description:
      "Venus with Mars combines attraction and action, supporting design, luxury, sales, entrepreneurship, hospitality, performance, and strong commercial drive.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Mars" },
    effect: {
      score: 18,
      adds: [
        "sales drive",
        "entrepreneurship",
        "design",
        "luxury",
        "hospitality",
        "commercial intensity",
      ],
      shadowAdds: [
        "relationship conflict",
        "impulsive desire",
        "competitive attraction",
      ],
    },
  },
  {
    id: "venus_conjunct_mercury",
    category: "business",
    title: "Venus conjunct Mercury",
    description:
      "Venus with Mercury supports branding, content, communication, negotiation, commerce, design, media, marketing, and client experience.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mercury" },
    effect: {
      score: 20,
      adds: [
        "branding",
        "content",
        "marketing",
        "negotiation",
        "commerce",
        "client experience",
        "design",
      ],
      strengthens: [
        "communication",
        "sales",
        "market appeal",
      ],
    },
  },
  {
    id: "venus_conjunct_jupiter",
    category: "wealth",
    title: "Venus conjunct Jupiter",
    description:
      "Venus with Jupiter supports prosperity, education, counselling, culture, finance, relationships, generosity, and trusted value creation.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Jupiter" },
    effect: {
      score: 20,
      adds: [
        "prosperity",
        "education",
        "counselling",
        "culture",
        "finance",
        "trusted value creation",
      ],
      shadowAdds: [
        "indulgence",
        "overspending",
        "idealisation",
      ],
    },
  },
  {
    id: "venus_conjunct_saturn",
    category: "career",
    title: "Venus conjunct Saturn",
    description:
      "Venus with Saturn supports durable value, structured partnerships, design discipline, long-term clients, contracts, operations, and restrained refinement.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "durable value",
        "structured partnerships",
        "design discipline",
        "long-term clients",
        "contracts",
      ],
      shadowAdds: [
        "emotional reserve",
        "fear of rejection",
        "transactional relationships",
      ],
    },
  },
  {
    id: "venus_conjunct_rahu",
    category: "business",
    title: "Venus conjunct Rahu",
    description:
      "Venus with Rahu amplifies attraction, media, luxury, digital reach, foreign markets, unconventional branding, and mass appeal.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Rahu" },
    effect: {
      score: 18,
      adds: [
        "digital appeal",
        "foreign markets",
        "mass branding",
        "luxury",
        "media",
        "unconventional attraction",
      ],
      shadowAdds: [
        "excess",
        "image obsession",
        "unstable desires",
      ],
    },
  },
  {
    id: "venus_conjunct_ketu",
    category: "spirituality",
    title: "Venus conjunct Ketu",
    description:
      "Venus with Ketu can spiritualise love, refine artistic sensitivity, detach from conventional relationships, and support symbolic or devotional creativity.",
    weight: "high",
    priority: 92,
    trigger: { conjunction: "Ketu" },
    effect: {
      score: 14,
      adds: [
        "spiritual love",
        "symbolic art",
        "devotional creativity",
        "detached values",
      ],
      shadowAdds: [
        "relationship detachment",
        "difficulty sustaining desire",
      ],
    },
  },
];

const aspectRules: KnowledgeRule[] = [
  {
    id: "venus_aspected_by_sun",
    category: "career",
    title: "Sun aspects Venus",
    description:
      "The Sun gives Venus visibility, authority, prestige, leadership presentation, and stronger public expression.",
    weight: "high",
    priority: 88,
    trigger: { aspectFrom: "Sun" },
    effect: {
      score: 12,
      adds: [
        "visibility",
        "prestige",
        "leadership presentation",
        "public appeal",
      ],
      shadowAdds: [
        "vanity",
        "ego in relationships",
      ],
    },
  },
  {
    id: "venus_aspected_by_moon",
    category: "relationships",
    title: "Moon aspects Venus",
    description:
      "The Moon adds care, emotional sensitivity, hospitality, audience understanding, and relational warmth to Venus.",
    weight: "high",
    priority: 88,
    trigger: { aspectFrom: "Moon" },
    effect: {
      score: 12,
      adds: [
        "care",
        "hospitality",
        "audience understanding",
        "relationship warmth",
      ],
    },
  },
  {
    id: "venus_aspected_by_mars",
    category: "business",
    title: "Mars aspects Venus",
    description:
      "Mars energises Venus toward sales, design execution, entrepreneurship, luxury, hospitality, and competitive commercial expression.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Mars" },
    effect: {
      score: 14,
      adds: [
        "sales",
        "entrepreneurship",
        "design execution",
        "hospitality",
        "commercial intensity",
      ],
      shadowAdds: [
        "relationship conflict",
        "impulsive desire",
      ],
    },
  },
  {
    id: "venus_aspected_by_mercury",
    category: "business",
    title: "Mercury aspects Venus",
    description:
      "Mercury sharpens Venus through communication, content, branding, negotiation, commerce, marketing, and market understanding.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "branding",
        "content",
        "negotiation",
        "commerce",
        "marketing",
        "market understanding",
      ],
    },
  },
  {
    id: "venus_aspected_by_jupiter",
    category: "wealth",
    title: "Jupiter aspects Venus",
    description:
      "Jupiter expands Venus toward prosperity, trusted relationships, education, culture, finance, generosity, and value creation.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Jupiter" },
    effect: {
      score: 16,
      adds: [
        "prosperity",
        "trusted relationships",
        "education",
        "culture",
        "finance",
        "value creation",
      ],
      shadowAdds: [
        "indulgence",
        "overexpansion",
      ],
    },
  },
  {
    id: "venus_aspected_by_saturn",
    category: "career",
    title: "Saturn aspects Venus",
    description:
      "Saturn disciplines Venus through durability, contracts, structure, long-term clients, professional boundaries, and restrained design.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Saturn" },
    effect: {
      score: 16,
      adds: [
        "durable value",
        "contracts",
        "professional boundaries",
        "long-term clients",
        "structured design",
      ],
      shadowAdds: [
        "emotional reserve",
        "fear of rejection",
      ],
    },
  },
  {
    id: "venus_aspected_by_rahu",
    category: "business",
    title: "Rahu aspects Venus",
    description:
      "Rahu amplifies Venus toward digital reach, media, mass appeal, foreign markets, unconventional branding, and luxury.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Rahu" },
    effect: {
      score: 16,
      adds: [
        "digital reach",
        "mass appeal",
        "foreign markets",
        "media",
        "unconventional branding",
        "luxury",
      ],
      shadowAdds: [
        "image obsession",
        "unstable desires",
      ],
    },
  },
  {
    id: "venus_aspected_by_ketu",
    category: "spirituality",
    title: "Ketu aspects Venus",
    description:
      "Ketu spiritualises or detaches Venus, supporting symbolic art, devotional creativity, non-material values, and unconventional relationships.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Ketu" },
    effect: {
      score: 14,
      adds: [
        "symbolic art",
        "devotional creativity",
        "non-material values",
        "relationship detachment",
      ],
    },
  },
];

const dispositorRules: KnowledgeRule[] = [
  {
    id: "venus_dispositor_sun",
    category: "career",
    title: "Venus disposed by Sun",
    description:
      "When the Sun disposes Venus, value seeks visibility, authority, prestige, leadership, and public expression.",
    weight: "high",
    priority: 88,
    trigger: { dispositor: "Sun" },
    effect: {
      score: 12,
      adds: [
        "prestige",
        "public expression",
        "leadership presentation",
        "visible branding",
      ],
    },
  },
  {
    id: "venus_dispositor_moon",
    category: "relationships",
    title: "Venus disposed by Moon",
    description:
      "When the Moon disposes Venus, value becomes nurturing, emotional, family-oriented, hospitable, and responsive to audience needs.",
    weight: "high",
    priority: 88,
    trigger: { dispositor: "Moon" },
    effect: {
      score: 12,
      adds: [
        "hospitality",
        "care",
        "family value",
        "audience sensitivity",
      ],
    },
  },
  {
    id: "venus_dispositor_mars",
    category: "business",
    title: "Venus disposed by Mars",
    description:
      "When Mars disposes Venus, value becomes active, entrepreneurial, technical, competitive, and execution-oriented.",
    weight: "high",
    priority: 90,
    trigger: { dispositor: "Mars" },
    effect: {
      score: 14,
      adds: [
        "entrepreneurship",
        "sales drive",
        "design execution",
        "commercial intensity",
      ],
    },
  },
  {
    id: "venus_dispositor_mercury",
    category: "business",
    title: "Venus disposed by Mercury",
    description:
      "When Mercury disposes Venus, value is expressed through communication, content, negotiation, marketing, commerce, and adaptable design.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "branding",
        "content",
        "negotiation",
        "marketing",
        "commerce",
        "design communication",
      ],
    },
  },
  {
    id: "venus_dispositor_jupiter",
    category: "wealth",
    title: "Venus disposed by Jupiter",
    description:
      "When Jupiter disposes Venus, value becomes educational, ethical, advisory, cultural, financial, philosophical, and trust-led.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Jupiter" },
    effect: {
      score: 16,
      adds: [
        "trusted value",
        "education",
        "advisory",
        "culture",
        "finance",
        "philosophical relationships",
      ],
    },
  },
  {
    id: "venus_dispositor_saturn",
    category: "career",
    title: "Venus disposed by Saturn",
    description:
      "When Saturn disposes Venus, value becomes structured, durable, contractual, professional, disciplined, and long-term.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Saturn" },
    effect: {
      score: 16,
      adds: [
        "durable value",
        "contracts",
        "professional relationships",
        "disciplined finance",
        "long-term clients",
      ],
      shadowAdds: [
        "emotional reserve",
        "transactional relationships",
      ],
    },
  },
];

const businessRules: KnowledgeRule[] = [
  {
    id: "venus_business_2nd_lord",
    category: "wealth",
    title: "Venus ruling the second house",
    description:
      "Venus ruling the second house supports income through value, quality, relationships, speech, beauty, food, design, and desirable offerings.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 2 },
    effect: {
      score: 20,
      strengthens: [
        "income",
        "quality premium",
        "relationship wealth",
        "commercial appeal",
      ],
    },
  },
  {
    id: "venus_business_5th_lord",
    category: "business",
    title: "Venus ruling the fifth house",
    description:
      "Venus ruling the fifth house supports creativity, design, entertainment, education, children, luxury, and expressive value creation.",
    weight: "very_high",
    priority: 95,
    trigger: { ownsHouse: 5 },
    effect: {
      score: 18,
      strengthens: [
        "creativity",
        "design",
        "entertainment",
        "education",
        "luxury",
      ],
    },
  },
  {
    id: "venus_business_7th_lord",
    category: "business",
    title: "Venus ruling the seventh house",
    description:
      "Venus ruling the seventh house supports partnerships, consulting, client relationships, contracts, negotiation, and public commerce.",
    weight: "very_high",
    priority: 100,
    trigger: { ownsHouse: 7 },
    effect: {
      score: 20,
      strengthens: [
        "partnerships",
        "consulting",
        "client relationships",
        "contracts",
        "negotiation",
      ],
    },
  },
  {
    id: "venus_business_10th_lord",
    category: "career",
    title: "Venus ruling the tenth house",
    description:
      "Venus ruling the tenth house ties professional success to relationships, branding, design, hospitality, media, HR, luxury, or public appeal.",
    weight: "very_high",
    priority: 100,
    trigger: { ownsHouse: 10 },
    effect: {
      score: 22,
      strengthens: [
        "branding",
        "design",
        "hospitality",
        "media",
        "HR",
        "client-facing leadership",
      ],
    },
  },
  {
    id: "venus_business_11th_lord",
    category: "wealth",
    title: "Venus ruling the eleventh house",
    description:
      "Venus ruling the eleventh house supports gains through clients, communities, social reach, desirable products, relationships, and market appeal.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 11 },
    effect: {
      score: 20,
      strengthens: [
        "client gains",
        "community value",
        "social reach",
        "relationship income",
        "market appeal",
      ],
    },
  },
];

const careerRules: KnowledgeRule[] = [
  {
    id: "venus_career_value_professions",
    category: "career",
    title: "Venus and value professions",
    description:
      "A strong Venus supports professions involving relationships, design, hospitality, branding, media, HR, luxury, beauty, negotiation, culture, or client experience.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "branding",
        "design",
        "hospitality",
        "media",
        "HR",
        "luxury",
        "negotiation",
        "client experience",
      ],
    },
  },
];

const wealthRules: KnowledgeRule[] = [
  {
    id: "venus_wealth_value",
    category: "wealth",
    title: "Venus and value-based wealth",
    description:
      "Venus supports wealth through market appeal, quality, relationships, negotiation, customer experience, design, and desirable offerings.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "market appeal",
        "quality premium",
        "relationship income",
        "customer value",
        "desirable offerings",
      ],
    },
  },
];

const relationshipRules: KnowledgeRule[] = [
  {
    id: "venus_relationship_harmony",
    category: "relationships",
    title: "Venus and relationship harmony",
    description:
      "Venus supports attraction, affection, compromise, appreciation, intimacy, shared pleasure, and relational balance.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "attraction",
        "affection",
        "appreciation",
        "intimacy",
        "relational balance",
      ],
      shadowAdds: [
        "approval seeking",
        "conflict avoidance",
      ],
    },
  },
];

const healthRules: KnowledgeRule[] = [
  {
    id: "venus_health_balance",
    category: "health",
    title: "Venus and bodily balance",
    description:
      "Venus relates to reproductive health, kidneys, sugar regulation, hydration, beauty, recovery through comfort, and the tendency toward indulgence.",
    weight: "high",
    priority: 80,
    trigger: {},
    effect: {
      score: 0,
      adds: [
        "recovery through balance",
        "hydration",
        "reproductive vitality",
      ],
      shadowAdds: [
        "sugar excess",
        "indulgence",
        "comfort-based inactivity",
      ],
    },
  },
];

const spiritualityRules: KnowledgeRule[] = [
  {
    id: "venus_spiritual_devotion",
    category: "spirituality",
    title: "Venus and devotion",
    description:
      "Venus supports devotion, gratitude, beauty, sacred art, relationship as a spiritual path, compassion, and appreciation.",
    weight: "high",
    priority: 88,
    trigger: {},
    effect: {
      score: 12,
      adds: [
        "devotion",
        "gratitude",
        "sacred art",
        "compassion",
        "spiritual love",
      ],
    },
  },
];

const shadowRules: KnowledgeRule[] = [
  {
    id: "venus_shadow_indulgence",
    category: "psychology",
    title: "Venus excess",
    description:
      "A highly active Venus may over-prioritise comfort, pleasure, image, harmony, or approval at the expense of boundaries and long-term discipline.",
    weight: "high",
    priority: 88,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "indulgence",
        "image dependence",
        "approval seeking",
        "weak boundaries",
        "avoidance of necessary conflict",
      ],
    },
  },
];

export const VenusKnowledge: PlanetKnowledge = {
  planet: "Venus",

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
