import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "./types";

const identity: KnowledgeRule[] = [
  {
    id: "sun_identity_authority",
    category: "identity",
    title: "Sun as the graha of authority",
    description:
      "The Sun governs identity, vitality, confidence, authority, leadership, recognition, purpose, government, and the capacity to direct.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "leadership",
        "authority",
        "confidence",
        "purpose",
        "recognition",
      ],
      strengthens: [
        "decision making",
        "executive presence",
        "direction",
      ],
    },
  },
  {
    id: "sun_identity_business",
    category: "business",
    title: "Sun in business",
    description:
      "The Sun supports leadership-led businesses, administration, government-linked work, management, strategy, reputation, and visible authority.",
    weight: "very_high",
    priority: 98,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "leadership",
        "management",
        "administration",
        "government",
        "strategy",
        "reputation",
      ],
    },
  },
  {
    id: "sun_identity_shadow",
    category: "psychology",
    title: "Sun shadow expression",
    description:
      "An imbalanced Sun may produce pride, domination, insecurity around recognition, rigidity, and conflict with authority.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "pride",
        "domination",
        "recognition insecurity",
        "rigidity",
        "authority conflict",
      ],
    },
  },
];

const signRules: KnowledgeRule[] = [
  {
    id: "sun_aries",
    category: "strength",
    title: "Sun in Aries",
    description:
      "Sun in Aries strongly supports initiative, courage, leadership, independence, confidence, and executive action.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Aries" },
    effect: {
      score: 22,
      adds: [
        "initiative",
        "leadership",
        "courage",
        "executive action",
        "independence",
      ],
      strengthens: [
        "authority",
        "confidence",
      ],
      shadowAdds: [
        "impatience",
        "ego-driven action",
      ],
    },
  },
  {
    id: "sun_taurus",
    category: "wealth",
    title: "Sun in Taurus",
    description:
      "Sun in Taurus supports stable authority, resources, finance, value, persistence, and material leadership.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Taurus" },
    effect: {
      score: 12,
      adds: [
        "resource leadership",
        "financial authority",
        "persistence",
        "material stability",
      ],
      shadowAdds: [
        "stubborn pride",
        "attachment to status",
      ],
    },
  },
  {
    id: "sun_gemini",
    category: "communication",
    title: "Sun in Gemini",
    description:
      "Sun in Gemini supports leadership through communication, analysis, networking, teaching, writing, and information.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Gemini" },
    effect: {
      score: 12,
      adds: [
        "communication leadership",
        "writing",
        "teaching",
        "networking",
        "information authority",
      ],
      shadowAdds: [
        "scattered identity",
        "need to be intellectually recognised",
      ],
    },
  },
  {
    id: "sun_cancer",
    category: "relationships",
    title: "Sun in Cancer",
    description:
      "Sun in Cancer supports protective leadership, family responsibility, care, public sensitivity, and emotional authority.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Cancer" },
    effect: {
      score: 12,
      adds: [
        "protective leadership",
        "family responsibility",
        "care",
        "public sensitivity",
      ],
      shadowAdds: [
        "emotional pride",
        "defensive authority",
      ],
    },
  },
  {
    id: "sun_leo",
    category: "strength",
    title: "Sun in Leo",
    description:
      "Sun in Leo expresses leadership, visibility, authority, confidence, creativity, and recognition with natural strength.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Leo" },
    effect: {
      score: 20,
      adds: [
        "leadership",
        "visibility",
        "authority",
        "confidence",
        "creative command",
      ],
      shadowAdds: [
        "pride",
        "need for admiration",
      ],
    },
  },
  {
    id: "sun_virgo",
    category: "career",
    title: "Sun in Virgo",
    description:
      "Sun in Virgo supports service leadership, administration, analysis, process, health, improvement, and practical authority.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Virgo" },
    effect: {
      score: 14,
      adds: [
        "service leadership",
        "administration",
        "analysis",
        "process",
        "practical authority",
      ],
      shadowAdds: [
        "critical pride",
        "perfectionistic control",
      ],
    },
  },
  {
    id: "sun_libra",
    category: "strength",
    title: "Sun in Libra",
    description:
      "Sun in Libra may weaken independent authority by making identity overly dependent on partnership, approval, or balance.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Libra" },
    effect: {
      score: -20,
      adds: [
        "diplomatic leadership",
        "partnership awareness",
      ],
      weakens: [
        "independent authority",
        "confidence",
        "decisiveness",
      ],
      shadowAdds: [
        "approval dependence",
        "indecision",
        "weak boundaries",
      ],
    },
  },
  {
    id: "sun_scorpio",
    category: "career",
    title: "Sun in Scorpio",
    description:
      "Sun in Scorpio supports strategic authority, crisis leadership, investigation, transformation, depth, and control.",
    weight: "high",
    priority: 92,
    trigger: { sign: "Scorpio" },
    effect: {
      score: 16,
      adds: [
        "strategic authority",
        "crisis leadership",
        "investigation",
        "transformation",
      ],
      shadowAdds: [
        "control",
        "secrecy",
        "power struggle",
      ],
    },
  },
  {
    id: "sun_sagittarius",
    category: "education",
    title: "Sun in Sagittarius",
    description:
      "Sun in Sagittarius supports leadership through philosophy, law, education, ethics, publishing, travel, and mission.",
    weight: "high",
    priority: 92,
    trigger: { sign: "Sagittarius" },
    effect: {
      score: 16,
      adds: [
        "mission-led leadership",
        "law",
        "education",
        "ethics",
        "publishing",
      ],
      shadowAdds: [
        "preaching",
        "righteous pride",
      ],
    },
  },
  {
    id: "sun_capricorn",
    category: "career",
    title: "Sun in Capricorn",
    description:
      "Sun in Capricorn supports administration, institutions, hierarchy, governance, status, and disciplined authority.",
    weight: "high",
    priority: 92,
    trigger: { sign: "Capricorn" },
    effect: {
      score: 16,
      adds: [
        "administration",
        "institutions",
        "hierarchy",
        "governance",
        "status",
      ],
      shadowAdds: [
        "rigid authority",
        "status anxiety",
      ],
    },
  },
  {
    id: "sun_aquarius",
    category: "career",
    title: "Sun in Aquarius",
    description:
      "Sun in Aquarius supports leadership in systems, technology, networks, institutions, reform, and collective causes.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Aquarius" },
    effect: {
      score: 14,
      adds: [
        "systems leadership",
        "technology",
        "networks",
        "reform",
        "collective authority",
      ],
      shadowAdds: [
        "detached leadership",
        "conflict with individuality",
      ],
    },
  },
  {
    id: "sun_pisces",
    category: "spirituality",
    title: "Sun in Pisces",
    description:
      "Sun in Pisces supports compassionate leadership, healing, imagination, spirituality, service, and symbolic authority.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Pisces" },
    effect: {
      score: 12,
      adds: [
        "compassionate leadership",
        "healing",
        "imagination",
        "spiritual purpose",
        "service",
      ],
      shadowAdds: [
        "diffused authority",
        "weak boundaries",
      ],
    },
  },
];

const houseRules: KnowledgeRule[] = [
  {
    id: "sun_house_1",
    category: "identity",
    title: "Sun in the first house",
    description:
      "Sun in the first house makes identity, confidence, authority, visibility, vitality, and leadership central to life expression.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 1 },
    effect: {
      score: 22,
      adds: [
        "leadership identity",
        "confidence",
        "visibility",
        "authority",
      ],
      shadowAdds: [
        "self-centredness",
        "recognition pressure",
      ],
    },
  },
  {
    id: "sun_house_2",
    category: "wealth",
    title: "Sun in the second house",
    description:
      "Sun in the second house supports family authority, wealth leadership, speech, reputation, and visible resource control.",
    weight: "high",
    priority: 90,
    trigger: { house: 2 },
    effect: {
      score: 14,
      adds: [
        "wealth leadership",
        "authoritative speech",
        "family status",
        "resource control",
      ],
      shadowAdds: [
        "pride in wealth",
        "harsh speech",
      ],
    },
  },
  {
    id: "sun_house_3",
    category: "communication",
    title: "Sun in the third house",
    description:
      "Sun in the third house supports courage, enterprise, communication, writing, leadership through skills, and self-made recognition.",
    weight: "high",
    priority: 92,
    trigger: { house: 3 },
    effect: {
      score: 16,
      adds: [
        "enterprise",
        "communication leadership",
        "writing",
        "courage",
        "self-made recognition",
      ],
    },
  },
  {
    id: "sun_house_4",
    category: "career",
    title: "Sun in the fourth house",
    description:
      "Sun in the fourth house supports property, education, administration, family leadership, homeland, and institutional foundations.",
    weight: "high",
    priority: 90,
    trigger: { house: 4 },
    effect: {
      score: 14,
      adds: [
        "property",
        "education administration",
        "family leadership",
        "institutional foundations",
      ],
      shadowAdds: [
        "domestic authority conflict",
      ],
    },
  },
  {
    id: "sun_house_5",
    category: "education",
    title: "Sun in the fifth house",
    description:
      "Sun in the fifth house supports intelligence, strategy, creativity, leadership, children, education, and visible self-expression.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 5 },
    effect: {
      score: 20,
      adds: [
        "strategy",
        "creative leadership",
        "education",
        "intelligence",
        "visible self-expression",
      ],
      shadowAdds: [
        "pride in intelligence",
        "need for appreciation",
      ],
    },
  },
  {
    id: "sun_house_6",
    category: "career",
    title: "Sun in the sixth house",
    description:
      "Sun in the sixth house supports service leadership, administration, competition, compliance, problem solving, and authority in difficult environments.",
    weight: "high",
    priority: 92,
    trigger: { house: 6 },
    effect: {
      score: 16,
      adds: [
        "service leadership",
        "administration",
        "competition",
        "compliance",
        "problem solving",
      ],
      shadowAdds: [
        "workplace authority conflict",
      ],
    },
  },
  {
    id: "sun_house_7",
    category: "relationships",
    title: "Sun in the seventh house",
    description:
      "Sun in the seventh house supports public visibility, contracts, leadership through partnership, consulting, and authority in relationships.",
    weight: "high",
    priority: 90,
    trigger: { house: 7 },
    effect: {
      score: 14,
      adds: [
        "public visibility",
        "consulting",
        "partnership leadership",
        "contracts",
      ],
      shadowAdds: [
        "domination in partnership",
        "ego conflict",
      ],
    },
  },
  {
    id: "sun_house_8",
    category: "spirituality",
    title: "Sun in the eighth house",
    description:
      "Sun in the eighth house supports crisis leadership, investigation, transformation, hidden authority, inheritance, and deep research.",
    weight: "high",
    priority: 90,
    trigger: { house: 8 },
    effect: {
      score: 14,
      adds: [
        "crisis leadership",
        "investigation",
        "transformation",
        "hidden authority",
        "deep research",
      ],
      shadowAdds: [
        "power struggle",
        "fear of loss of control",
      ],
    },
  },
  {
    id: "sun_house_9",
    category: "education",
    title: "Sun in the ninth house",
    description:
      "Sun in the ninth house supports law, philosophy, higher education, ethics, publishing, travel, and leadership through purpose.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 9 },
    effect: {
      score: 20,
      adds: [
        "law",
        "philosophy",
        "higher education",
        "ethics",
        "publishing",
        "purpose-led leadership",
      ],
    },
  },
  {
    id: "sun_house_10",
    category: "career",
    title: "Sun in the tenth house",
    description:
      "Sun in the tenth house strongly supports authority, status, leadership, administration, government, visibility, and executive achievement.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 10 },
    effect: {
      score: 22,
      adds: [
        "authority",
        "status",
        "leadership",
        "administration",
        "government",
        "executive achievement",
      ],
    },
  },
  {
    id: "sun_house_11",
    category: "wealth",
    title: "Sun in the eleventh house",
    description:
      "Sun in the eleventh house supports gains through leadership, institutions, networks, patrons, recognition, and ambitious goals.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 11 },
    effect: {
      score: 18,
      adds: [
        "leadership gains",
        "institutional networks",
        "patrons",
        "recognition",
        "ambitious goals",
      ],
    },
  },
  {
    id: "sun_house_12",
    category: "spirituality",
    title: "Sun in the twelfth house",
    description:
      "Sun in the twelfth house supports foreign institutions, research, spirituality, retreat, service, hidden authority, and work behind the scenes.",
    weight: "high",
    priority: 88,
    trigger: { house: 12 },
    effect: {
      score: 12,
      adds: [
        "foreign institutions",
        "research",
        "spirituality",
        "hidden authority",
        "behind-the-scenes leadership",
      ],
      shadowAdds: [
        "isolation",
        "recognition difficulty",
      ],
    },
  },
];

const dignityRules: KnowledgeRule[] = [
  {
    id: "sun_dignity_exalted",
    category: "strength",
    title: "Exalted Sun",
    description:
      "Exalted Sun strongly supports authority, confidence, leadership, vitality, purpose, and executive capacity.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "exalted" },
    effect: {
      score: 22,
      strengthens: [
        "authority",
        "confidence",
        "leadership",
        "vitality",
        "purpose",
      ],
    },
  },
  {
    id: "sun_dignity_own",
    category: "strength",
    title: "Sun in own sign",
    description:
      "Sun in its own sign expresses identity, confidence, leadership, visibility, and authority with natural competence.",
    weight: "very_high",
    priority: 98,
    trigger: { dignity: "own" },
    effect: {
      score: 20,
      strengthens: [
        "identity",
        "confidence",
        "leadership",
        "visibility",
        "authority",
      ],
    },
  },
  {
    id: "sun_dignity_friend",
    category: "strength",
    title: "Sun in friendly dignity",
    description:
      "Friendly dignity supports confidence, leadership, vitality, and constructive authority.",
    weight: "high",
    priority: 86,
    trigger: { dignity: "friend" },
    effect: {
      score: 10,
      strengthens: [
        "confidence",
        "leadership",
        "vitality",
        "authority",
      ],
    },
  },
  {
    id: "sun_dignity_enemy",
    category: "strength",
    title: "Sun in inimical dignity",
    description:
      "Inimical dignity may weaken confidence, authority, vitality, recognition, or consistency of purpose.",
    weight: "high",
    priority: 90,
    trigger: { dignity: "enemy" },
    effect: {
      score: -12,
      weakens: [
        "confidence",
        "authority",
        "vitality",
        "purpose",
      ],
      shadowAdds: [
        "recognition insecurity",
        "authority conflict",
      ],
    },
  },
  {
    id: "sun_dignity_debilitated",
    category: "strength",
    title: "Debilitated Sun",
    description:
      "Debilitated Sun may weaken confidence, authority, vitality, recognition, and independent decision making unless cancellation or support is present.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "debilitated" },
    effect: {
      score: -22,
      weakens: [
        "confidence",
        "authority",
        "vitality",
        "independent decision making",
      ],
      shadowAdds: [
        "approval dependence",
        "weak boundaries",
      ],
    },
  },
  {
    id: "sun_vargottama",
    category: "strength",
    title: "Vargottama Sun",
    description:
      "Vargottama Sun strengthens consistency in identity, authority, leadership, vitality, and purpose.",
    weight: "very_high",
    priority: 95,
    trigger: { vargottama: true },
    effect: {
      score: 18,
      strengthens: [
        "identity",
        "authority",
        "leadership",
        "vitality",
        "purpose",
      ],
    },
  },
];

const conjunctionRules: KnowledgeRule[] = [
  {
    id: "sun_conjunct_moon",
    category: "identity",
    title: "Sun conjunct Moon",
    description:
      "Sun with Moon combines identity and mind, supporting focus, visibility, leadership, and unified purpose while reducing emotional distance from ego.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Moon" },
    effect: {
      score: 16,
      adds: [
        "unified purpose",
        "visibility",
        "leadership",
        "focus",
      ],
      shadowAdds: [
        "subjective judgement",
        "difficulty separating emotion from identity",
      ],
    },
  },
  {
    id: "sun_conjunct_mars",
    category: "career",
    title: "Sun conjunct Mars",
    description:
      "Sun with Mars strongly supports command, courage, leadership, competition, authority, and decisive execution.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mars" },
    effect: {
      score: 20,
      adds: [
        "command",
        "courage",
        "leadership",
        "competition",
        "decisive execution",
      ],
      shadowAdds: [
        "aggression",
        "ego conflict",
      ],
    },
  },
  {
    id: "sun_conjunct_mercury",
    category: "career",
    title: "Sun conjunct Mercury",
    description:
      "Sun with Mercury supports administration, strategy, communication, intellect, management, policy, and leadership through information.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mercury" },
    effect: {
      score: 20,
      adds: [
        "administration",
        "strategy",
        "communication",
        "management",
        "policy",
        "intellectual authority",
      ],
      shadowAdds: [
        "intellectual pride",
      ],
    },
  },
  {
    id: "sun_conjunct_jupiter",
    category: "career",
    title: "Sun conjunct Jupiter",
    description:
      "Sun with Jupiter supports ethical leadership, law, policy, teaching, recognition, authority, and institutional guidance.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Jupiter" },
    effect: {
      score: 20,
      adds: [
        "ethical leadership",
        "law",
        "policy",
        "teaching",
        "institutional guidance",
      ],
      shadowAdds: [
        "moral pride",
        "self-righteousness",
      ],
    },
  },
  {
    id: "sun_conjunct_venus",
    category: "business",
    title: "Sun conjunct Venus",
    description:
      "Sun with Venus supports public appeal, branding, prestige, creativity, diplomacy, luxury, and visible relationship intelligence.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Venus" },
    effect: {
      score: 18,
      adds: [
        "public appeal",
        "branding",
        "prestige",
        "creativity",
        "diplomacy",
      ],
      shadowAdds: [
        "vanity",
        "approval seeking",
      ],
    },
  },
  {
    id: "sun_conjunct_saturn",
    category: "career",
    title: "Sun conjunct Saturn",
    description:
      "Sun with Saturn combines authority and responsibility, supporting governance, administration, institutions, endurance, and leadership under pressure.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "governance",
        "administration",
        "institutions",
        "endurance",
        "responsible leadership",
      ],
      shadowAdds: [
        "authority conflict",
        "fear of recognition",
      ],
    },
  },
  {
    id: "sun_conjunct_rahu",
    category: "career",
    title: "Sun conjunct Rahu",
    description:
      "Sun with Rahu amplifies visibility, ambition, politics, authority, foreign influence, unconventional leadership, and recognition pressure.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Rahu" },
    effect: {
      score: 18,
      adds: [
        "visibility",
        "ambition",
        "politics",
        "foreign influence",
        "unconventional leadership",
      ],
      shadowAdds: [
        "ego inflation",
        "recognition obsession",
        "authority conflict",
      ],
    },
  },
  {
    id: "sun_conjunct_ketu",
    category: "spirituality",
    title: "Sun conjunct Ketu",
    description:
      "Sun with Ketu can detach identity from recognition, support spiritual leadership, research, humility, and unconventional authority.",
    weight: "high",
    priority: 94,
    trigger: { conjunction: "Ketu" },
    effect: {
      score: 14,
      adds: [
        "spiritual leadership",
        "research",
        "detached authority",
        "humility",
      ],
      shadowAdds: [
        "identity uncertainty",
        "recognition detachment",
      ],
    },
  },
];

const aspectRules: KnowledgeRule[] = [
  {
    id: "sun_aspected_by_mars",
    category: "career",
    title: "Mars aspects Sun",
    description:
      "Mars energises the Sun through courage, command, competition, leadership, and decisive action.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Mars" },
    effect: {
      score: 16,
      adds: [
        "courage",
        "command",
        "competition",
        "leadership",
        "decisive action",
      ],
      shadowAdds: [
        "aggression",
      ],
    },
  },
  {
    id: "sun_aspected_by_mercury",
    category: "career",
    title: "Mercury aspects Sun",
    description:
      "Mercury sharpens the Sun through strategy, communication, administration, policy, analysis, and management.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "strategy",
        "communication",
        "administration",
        "policy",
        "management",
      ],
    },
  },
  {
    id: "sun_aspected_by_jupiter",
    category: "career",
    title: "Jupiter aspects Sun",
    description:
      "Jupiter guides the Sun toward ethical authority, law, teaching, policy, wisdom, and institutional leadership.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Jupiter" },
    effect: {
      score: 16,
      adds: [
        "ethical authority",
        "law",
        "teaching",
        "policy",
        "institutional leadership",
      ],
    },
  },
  {
    id: "sun_aspected_by_venus",
    category: "business",
    title: "Venus aspects Sun",
    description:
      "Venus refines the Sun through diplomacy, branding, public appeal, prestige, creativity, and relationship intelligence.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Venus" },
    effect: {
      score: 14,
      adds: [
        "diplomacy",
        "branding",
        "public appeal",
        "prestige",
        "creativity",
      ],
    },
  },
  {
    id: "sun_aspected_by_saturn",
    category: "career",
    title: "Saturn aspects Sun",
    description:
      "Saturn disciplines the Sun through responsibility, governance, administration, endurance, institutions, and delayed authority.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "responsibility",
        "governance",
        "administration",
        "endurance",
        "institutions",
      ],
      shadowAdds: [
        "authority pressure",
        "delayed recognition",
      ],
    },
  },
  {
    id: "sun_aspected_by_rahu",
    category: "career",
    title: "Rahu aspects Sun",
    description:
      "Rahu amplifies the Sun toward visibility, politics, foreign influence, unconventional leadership, ambition, and recognition.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Rahu" },
    effect: {
      score: 18,
      adds: [
        "visibility",
        "politics",
        "foreign influence",
        "unconventional leadership",
        "ambition",
      ],
      shadowAdds: [
        "ego inflation",
        "recognition obsession",
      ],
    },
  },
  {
    id: "sun_aspected_by_ketu",
    category: "spirituality",
    title: "Ketu aspects Sun",
    description:
      "Ketu detaches the Sun from conventional recognition and supports spiritual authority, research, humility, and inner purpose.",
    weight: "high",
    priority: 92,
    trigger: { aspectFrom: "Ketu" },
    effect: {
      score: 14,
      adds: [
        "spiritual authority",
        "research",
        "humility",
        "inner purpose",
      ],
      shadowAdds: [
        "identity uncertainty",
      ],
    },
  },
];

const dispositorRules: KnowledgeRule[] = [
  {
    id: "sun_dispositor_moon",
    category: "relationships",
    title: "Sun disposed by Moon",
    description:
      "When the Moon disposes the Sun, authority becomes protective, emotional, family-oriented, intuitive, and responsive to public sentiment.",
    weight: "high",
    priority: 90,
    trigger: { dispositor: "Moon" },
    effect: {
      score: 14,
      adds: [
        "protective authority",
        "public sensitivity",
        "family leadership",
        "intuitive direction",
      ],
    },
  },
  {
    id: "sun_dispositor_mars",
    category: "career",
    title: "Sun disposed by Mars",
    description:
      "When Mars disposes the Sun, authority becomes decisive, competitive, courageous, technical, and execution-oriented.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Mars" },
    effect: {
      score: 16,
      adds: [
        "decisive authority",
        "competition",
        "courage",
        "technical leadership",
        "execution",
      ],
    },
  },
  {
    id: "sun_dispositor_mercury",
    category: "career",
    title: "Sun disposed by Mercury",
    description:
      "When Mercury disposes the Sun, authority is expressed through strategy, communication, administration, policy, analysis, and management.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "strategy",
        "communication",
        "administration",
        "policy",
        "management",
      ],
    },
  },
  {
    id: "sun_dispositor_jupiter",
    category: "career",
    title: "Sun disposed by Jupiter",
    description:
      "When Jupiter disposes the Sun, authority becomes ethical, advisory, educational, legal, philosophical, and purpose-led.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Jupiter" },
    effect: {
      score: 16,
      adds: [
        "ethical authority",
        "advisory leadership",
        "education",
        "law",
        "purpose-led direction",
      ],
    },
  },
  {
    id: "sun_dispositor_venus",
    category: "business",
    title: "Sun disposed by Venus",
    description:
      "When Venus disposes the Sun, authority is channelled through diplomacy, branding, public appeal, relationships, prestige, and visible value.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Venus" },
    effect: {
      score: 16,
      adds: [
        "diplomacy",
        "branding",
        "public appeal",
        "relationships",
        "prestige",
      ],
    },
  },
  {
    id: "sun_dispositor_saturn",
    category: "career",
    title: "Sun disposed by Saturn",
    description:
      "When Saturn disposes the Sun, authority becomes structured, institutional, administrative, responsible, disciplined, and long-term.",
    weight: "very_high",
    priority: 98,
    trigger: { dispositor: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "structured authority",
        "institutions",
        "administration",
        "responsibility",
        "long-term leadership",
      ],
      shadowAdds: [
        "recognition delay",
        "authority pressure",
      ],
    },
  },
];

const businessRules: KnowledgeRule[] = [
  {
    id: "sun_business_5th_lord",
    category: "business",
    title: "Sun ruling the fifth house",
    description:
      "Sun ruling the fifth house supports strategy, creativity, leadership, education, authority, and visible value creation.",
    weight: "very_high",
    priority: 95,
    trigger: { ownsHouse: 5 },
    effect: {
      score: 18,
      strengthens: [
        "strategy",
        "creative leadership",
        "education",
        "authority",
      ],
    },
  },
  {
    id: "sun_business_9th_lord",
    category: "career",
    title: "Sun ruling the ninth house",
    description:
      "Sun ruling the ninth house supports law, ethics, higher education, publishing, government, and purpose-led leadership.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 9 },
    effect: {
      score: 20,
      strengthens: [
        "law",
        "ethics",
        "higher education",
        "publishing",
        "purpose-led leadership",
      ],
    },
  },
  {
    id: "sun_business_10th_lord",
    category: "career",
    title: "Sun ruling the tenth house",
    description:
      "Sun ruling the tenth house strongly supports authority, leadership, government, administration, visibility, and executive achievement.",
    weight: "very_high",
    priority: 100,
    trigger: { ownsHouse: 10 },
    effect: {
      score: 22,
      strengthens: [
        "authority",
        "leadership",
        "government",
        "administration",
        "executive achievement",
      ],
    },
  },
  {
    id: "sun_business_11th_lord",
    category: "wealth",
    title: "Sun ruling the eleventh house",
    description:
      "Sun ruling the eleventh house supports gains through leadership, institutions, patrons, networks, recognition, and ambitious goals.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 11 },
    effect: {
      score: 20,
      strengthens: [
        "leadership gains",
        "institutional networks",
        "patrons",
        "recognition",
      ],
    },
  },
];

const careerRules: KnowledgeRule[] = [
  {
    id: "sun_career_authority_professions",
    category: "career",
    title: "Sun and authority professions",
    description:
      "A strong Sun supports professions involving leadership, management, administration, government, strategy, policy, reputation, and executive responsibility.",
    weight: "very_high",
    priority: 98,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "leadership",
        "management",
        "administration",
        "government",
        "strategy",
        "policy",
        "executive responsibility",
      ],
    },
  },
];

const wealthRules: KnowledgeRule[] = [
  {
    id: "sun_wealth_status",
    category: "wealth",
    title: "Sun and wealth through authority",
    description:
      "Sun supports wealth through leadership, status, government, institutions, reputation, executive roles, and visible responsibility.",
    weight: "high",
    priority: 92,
    trigger: {},
    effect: {
      score: 14,
      adds: [
        "leadership income",
        "status",
        "institutional wealth",
        "reputation value",
        "executive income",
      ],
    },
  },
];

const relationshipRules: KnowledgeRule[] = [
  {
    id: "sun_relationship_identity",
    category: "relationships",
    title: "Sun in relationships",
    description:
      "Sun brings loyalty, protection, pride, authority, visibility, and the need for respect within relationships.",
    weight: "high",
    priority: 88,
    trigger: {},
    effect: {
      score: 10,
      adds: [
        "loyalty",
        "protection",
        "respect",
        "visibility",
      ],
      shadowAdds: [
        "domination",
        "pride",
        "need for recognition",
      ],
    },
  },
];

const healthRules: KnowledgeRule[] = [
  {
    id: "sun_health_vitality",
    category: "health",
    title: "Sun and vitality",
    description:
      "Sun relates to vitality, heart, circulation, immunity, confidence, recovery, and the capacity to sustain life force.",
    weight: "high",
    priority: 85,
    trigger: {},
    effect: {
      score: 8,
      adds: [
        "vitality",
        "recovery",
        "immunity",
        "life force",
      ],
      shadowAdds: [
        "burnout",
        "circulatory strain",
        "confidence collapse",
      ],
    },
  },
];

const spiritualityRules: KnowledgeRule[] = [
  {
    id: "sun_spiritual_purpose",
    category: "spirituality",
    title: "Sun and spiritual purpose",
    description:
      "Sun supports purpose, dharma, self-knowledge, truth, integrity, sacrifice, and leadership aligned with conscience.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 14,
      adds: [
        "purpose",
        "dharma",
        "self-knowledge",
        "integrity",
        "conscience-led leadership",
      ],
    },
  },
];

const shadowRules: KnowledgeRule[] = [
  {
    id: "sun_shadow_pride",
    category: "psychology",
    title: "Sun excess",
    description:
      "A highly active Sun may become proud, controlling, recognition-dependent, rigid, self-centred, or unable to share authority.",
    weight: "high",
    priority: 92,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "pride",
        "control",
        "recognition dependence",
        "rigidity",
        "difficulty sharing authority",
      ],
    },
  },
];

export const SunKnowledge: PlanetKnowledge = {
  planet: "Sun",

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
