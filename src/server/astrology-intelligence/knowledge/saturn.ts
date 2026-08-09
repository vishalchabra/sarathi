import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "./types";

const identity: KnowledgeRule[] = [
  {
    id: "saturn_identity_structure",
    category: "identity",
    title: "Saturn as the graha of structure",
    description:
      "Saturn governs discipline, endurance, responsibility, delay, labour, systems, institutions, scarcity, realism, and long-term results.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "discipline",
        "endurance",
        "responsibility",
        "systems thinking",
        "realism",
      ],
      strengthens: [
        "long-term execution",
        "process",
        "operational durability",
      ],
    },
  },
  {
    id: "saturn_identity_business",
    category: "business",
    title: "Saturn in business",
    description:
      "Saturn supports operations, compliance, infrastructure, manufacturing, logistics, administration, labour-intensive work, governance, and scalable systems.",
    weight: "very_high",
    priority: 98,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "operations",
        "compliance",
        "infrastructure",
        "manufacturing",
        "logistics",
        "governance",
      ],
    },
  },
  {
    id: "saturn_identity_shadow",
    category: "psychology",
    title: "Saturn shadow expression",
    description:
      "An imbalanced Saturn can produce fear, pessimism, rigidity, delay, isolation, over-control, and difficulty trusting progress.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "fear",
        "pessimism",
        "rigidity",
        "delay",
        "over-control",
      ],
    },
  },
];

const signRules: KnowledgeRule[] = [
  {
    id: "saturn_aries",
    category: "strength",
    title: "Saturn in Aries",
    description:
      "Saturn in Aries may struggle between caution and immediate action, creating frustration, delayed confidence, and difficulty pacing initiative.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Aries" },
    effect: {
      score: -20,
      adds: [
        "disciplined initiative",
        "cautious action",
      ],
      weakens: [
        "confidence",
        "timely execution",
        "direct authority",
      ],
      shadowAdds: [
        "frustration",
        "fear of action",
        "blocked initiative",
      ],
    },
  },
  {
    id: "saturn_taurus",
    category: "wealth",
    title: "Saturn in Taurus",
    description:
      "Saturn in Taurus supports patient accumulation, resource discipline, durable value, land, finance, and practical stability.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Taurus" },
    effect: {
      score: 14,
      adds: [
        "patient accumulation",
        "resource discipline",
        "durable value",
        "land",
        "financial stability",
      ],
      shadowAdds: [
        "fear of loss",
        "resistance to change",
      ],
    },
  },
  {
    id: "saturn_gemini",
    category: "communication",
    title: "Saturn in Gemini",
    description:
      "Saturn in Gemini supports structured thinking, documentation, technical communication, data discipline, research, and careful speech.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Gemini" },
    effect: {
      score: 14,
      adds: [
        "structured thinking",
        "documentation",
        "technical communication",
        "data discipline",
        "research",
      ],
      shadowAdds: [
        "mental rigidity",
        "fear of speaking",
      ],
    },
  },
  {
    id: "saturn_cancer",
    category: "relationships",
    title: "Saturn in Cancer",
    description:
      "Saturn in Cancer may bring emotional reserve, family responsibility, protective caution, and slow development of trust.",
    weight: "medium",
    priority: 84,
    trigger: { sign: "Cancer" },
    effect: {
      score: 8,
      adds: [
        "family responsibility",
        "emotional endurance",
        "protective structure",
      ],
      shadowAdds: [
        "emotional isolation",
        "difficulty trusting care",
      ],
    },
  },
  {
    id: "saturn_leo",
    category: "career",
    title: "Saturn in Leo",
    description:
      "Saturn in Leo tests authority, leadership, visibility, recognition, and the ability to carry responsibility without excessive pride.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Leo" },
    effect: {
      score: 10,
      adds: [
        "responsible leadership",
        "earned authority",
        "disciplined visibility",
      ],
      shadowAdds: [
        "fear of recognition",
        "rigid authority",
      ],
    },
  },
  {
    id: "saturn_virgo",
    category: "career",
    title: "Saturn in Virgo",
    description:
      "Saturn in Virgo supports systems, process, audit, service, health administration, detail, and operational improvement.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Virgo" },
    effect: {
      score: 18,
      adds: [
        "process",
        "audit",
        "service systems",
        "health administration",
        "operational detail",
      ],
      shadowAdds: [
        "perfectionism",
        "chronic worry",
      ],
    },
  },
  {
    id: "saturn_libra",
    category: "strength",
    title: "Saturn in Libra",
    description:
      "Saturn in Libra strongly supports justice, contracts, balance, governance, partnership discipline, institutions, and mature judgement.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Libra" },
    effect: {
      score: 22,
      adds: [
        "justice",
        "contracts",
        "governance",
        "partnership discipline",
        "mature judgement",
      ],
      strengthens: [
        "law",
        "compliance",
        "institutional balance",
      ],
    },
  },
  {
    id: "saturn_scorpio",
    category: "spirituality",
    title: "Saturn in Scorpio",
    description:
      "Saturn in Scorpio supports endurance through crisis, investigation, risk control, hidden systems, transformation, and deep accountability.",
    weight: "high",
    priority: 92,
    trigger: { sign: "Scorpio" },
    effect: {
      score: 16,
      adds: [
        "crisis endurance",
        "investigation",
        "risk control",
        "hidden systems",
        "transformation",
      ],
      shadowAdds: [
        "control",
        "fear of vulnerability",
      ],
    },
  },
  {
    id: "saturn_sagittarius",
    category: "career",
    title: "Saturn in Sagittarius",
    description:
      "Saturn in Sagittarius structures belief, law, education, policy, philosophy, institutions, and long-range planning.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Sagittarius" },
    effect: {
      score: 14,
      adds: [
        "policy",
        "law",
        "institutional education",
        "structured philosophy",
        "long-range planning",
      ],
      shadowAdds: [
        "rigid beliefs",
        "pessimism about expansion",
      ],
    },
  },
  {
    id: "saturn_capricorn",
    category: "strength",
    title: "Saturn in Capricorn",
    description:
      "Saturn in Capricorn strongly supports authority, administration, endurance, hierarchy, governance, operations, and long-term achievement.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Capricorn" },
    effect: {
      score: 20,
      adds: [
        "authority",
        "administration",
        "hierarchy",
        "governance",
        "operations",
        "long-term achievement",
      ],
    },
  },
  {
    id: "saturn_aquarius",
    category: "strength",
    title: "Saturn in Aquarius",
    description:
      "Saturn in Aquarius supports large systems, networks, social structures, technology, reform, institutions, and scalable organisation.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Aquarius" },
    effect: {
      score: 20,
      adds: [
        "large systems",
        "networks",
        "technology structure",
        "social institutions",
        "scalable organisation",
      ],
    },
  },
  {
    id: "saturn_pisces",
    category: "spirituality",
    title: "Saturn in Pisces",
    description:
      "Saturn in Pisces gives structure to service, compassion, institutions, healing, retreat, spirituality, and work behind the scenes.",
    weight: "medium",
    priority: 84,
    trigger: { sign: "Pisces" },
    effect: {
      score: 8,
      adds: [
        "structured compassion",
        "institutional service",
        "healing systems",
        "spiritual discipline",
      ],
      shadowAdds: [
        "confusion around boundaries",
        "withdrawal",
      ],
    },
  },
];

const houseRules: KnowledgeRule[] = [
  {
    id: "saturn_house_1",
    category: "identity",
    title: "Saturn in the first house",
    description:
      "Saturn in the first house makes seriousness, responsibility, endurance, caution, discipline, and delayed confidence central to identity.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 1 },
    effect: {
      score: 18,
      adds: [
        "seriousness",
        "responsibility",
        "endurance",
        "discipline",
      ],
      shadowAdds: [
        "self-doubt",
        "isolation",
        "delayed confidence",
      ],
    },
  },
  {
    id: "saturn_house_2",
    category: "wealth",
    title: "Saturn in the second house",
    description:
      "Saturn in the second house supports slow accumulation, disciplined finance, conservative speech, family responsibility, and long-term resource building.",
    weight: "high",
    priority: 92,
    trigger: { house: 2 },
    effect: {
      score: 16,
      adds: [
        "slow accumulation",
        "disciplined finance",
        "family responsibility",
        "resource building",
      ],
      shadowAdds: [
        "fear of scarcity",
        "restricted speech",
      ],
    },
  },
  {
    id: "saturn_house_3",
    category: "communication",
    title: "Saturn in the third house",
    description:
      "Saturn in the third house supports sustained effort, documentation, technical skills, disciplined communication, and patient enterprise.",
    weight: "high",
    priority: 90,
    trigger: { house: 3 },
    effect: {
      score: 14,
      adds: [
        "sustained effort",
        "documentation",
        "technical skills",
        "disciplined communication",
        "patient enterprise",
      ],
      shadowAdds: [
        "fear of expression",
        "slow initiative",
      ],
    },
  },
  {
    id: "saturn_house_4",
    category: "career",
    title: "Saturn in the fourth house",
    description:
      "Saturn in the fourth house supports property, land, infrastructure, administration, family responsibility, and durable foundations.",
    weight: "high",
    priority: 90,
    trigger: { house: 4 },
    effect: {
      score: 14,
      adds: [
        "property",
        "land",
        "infrastructure",
        "administration",
        "durable foundations",
      ],
      shadowAdds: [
        "emotional heaviness",
        "domestic responsibility",
      ],
    },
  },
  {
    id: "saturn_house_5",
    category: "education",
    title: "Saturn in the fifth house",
    description:
      "Saturn in the fifth house supports disciplined study, strategy, research, long-term creativity, responsibility toward children, and cautious speculation.",
    weight: "high",
    priority: 88,
    trigger: { house: 5 },
    effect: {
      score: 12,
      adds: [
        "disciplined study",
        "strategy",
        "research",
        "long-term creativity",
      ],
      shadowAdds: [
        "fear of expression",
        "delayed confidence in creativity",
      ],
    },
  },
  {
    id: "saturn_house_6",
    category: "career",
    title: "Saturn in the sixth house",
    description:
      "Saturn in the sixth house strongly supports service, compliance, disputes, labour, routines, health administration, and defeating obstacles through persistence.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 6 },
    effect: {
      score: 22,
      adds: [
        "service",
        "compliance",
        "labour management",
        "routines",
        "health administration",
        "persistent problem solving",
      ],
    },
  },
  {
    id: "saturn_house_7",
    category: "relationships",
    title: "Saturn in the seventh house",
    description:
      "Saturn in the seventh house brings seriousness, delay, responsibility, contracts, durable partnerships, and lessons through commitment.",
    weight: "high",
    priority: 92,
    trigger: { house: 7 },
    effect: {
      score: 14,
      adds: [
        "durable partnerships",
        "contracts",
        "commitment",
        "responsibility",
      ],
      shadowAdds: [
        "relationship delay",
        "emotional distance",
      ],
    },
  },
  {
    id: "saturn_house_8",
    category: "spirituality",
    title: "Saturn in the eighth house",
    description:
      "Saturn in the eighth house supports endurance through crisis, audit, risk control, inheritance, hidden systems, and long-term transformation.",
    weight: "high",
    priority: 92,
    trigger: { house: 8 },
    effect: {
      score: 16,
      adds: [
        "crisis endurance",
        "audit",
        "risk control",
        "inheritance",
        "hidden systems",
      ],
      shadowAdds: [
        "fear of loss",
        "prolonged crisis",
      ],
    },
  },
  {
    id: "saturn_house_9",
    category: "career",
    title: "Saturn in the ninth house",
    description:
      "Saturn in the ninth house supports law, policy, institutional education, disciplined belief, long-distance responsibility, and structured guidance.",
    weight: "high",
    priority: 90,
    trigger: { house: 9 },
    effect: {
      score: 14,
      adds: [
        "law",
        "policy",
        "institutional education",
        "disciplined belief",
        "structured guidance",
      ],
      shadowAdds: [
        "rigid beliefs",
        "delayed fortune",
      ],
    },
  },
  {
    id: "saturn_house_10",
    category: "career",
    title: "Saturn in the tenth house",
    description:
      "Saturn in the tenth house strongly supports authority, administration, operations, governance, institutions, responsibility, and durable achievement.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 10 },
    effect: {
      score: 22,
      adds: [
        "authority",
        "administration",
        "operations",
        "governance",
        "institutions",
        "durable achievement",
      ],
    },
  },
  {
    id: "saturn_house_11",
    category: "wealth",
    title: "Saturn in the eleventh house",
    description:
      "Saturn in the eleventh house supports gains through institutions, networks, labour, systems, long-term goals, and scalable organisation.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 11 },
    effect: {
      score: 20,
      adds: [
        "institutional gains",
        "network durability",
        "long-term goals",
        "scalable organisation",
      ],
    },
  },
  {
    id: "saturn_house_12",
    category: "spirituality",
    title: "Saturn in the twelfth house",
    description:
      "Saturn in the twelfth house supports foreign institutions, isolation, hospitals, research, hidden work, retreat, and spiritual discipline.",
    weight: "high",
    priority: 88,
    trigger: { house: 12 },
    effect: {
      score: 12,
      adds: [
        "foreign institutions",
        "research",
        "hidden work",
        "retreat",
        "spiritual discipline",
      ],
      shadowAdds: [
        "isolation",
        "institutional burden",
      ],
    },
  },
];

const dignityRules: KnowledgeRule[] = [
  {
    id: "saturn_dignity_exalted",
    category: "strength",
    title: "Exalted Saturn",
    description:
      "Exalted Saturn strongly supports justice, responsibility, endurance, governance, contracts, and mature judgement.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "exalted" },
    effect: {
      score: 22,
      strengthens: [
        "justice",
        "responsibility",
        "endurance",
        "governance",
        "mature judgement",
      ],
    },
  },
  {
    id: "saturn_dignity_own",
    category: "strength",
    title: "Saturn in own sign",
    description:
      "Saturn in its own sign expresses discipline, structure, endurance, systems, and long-term authority with natural competence.",
    weight: "very_high",
    priority: 98,
    trigger: { dignity: "own" },
    effect: {
      score: 20,
      strengthens: [
        "discipline",
        "structure",
        "endurance",
        "systems",
        "authority",
      ],
    },
  },
  {
    id: "saturn_dignity_friend",
    category: "strength",
    title: "Saturn in friendly dignity",
    description:
      "Friendly dignity supports constructive discipline, realistic planning, endurance, and operational maturity.",
    weight: "high",
    priority: 86,
    trigger: { dignity: "friend" },
    effect: {
      score: 10,
      strengthens: [
        "discipline",
        "realistic planning",
        "endurance",
        "operations",
      ],
    },
  },
  {
    id: "saturn_dignity_enemy",
    category: "strength",
    title: "Saturn in inimical dignity",
    description:
      "Inimical dignity may increase fear, delay, rigidity, frustration, or difficulty applying discipline constructively.",
    weight: "high",
    priority: 90,
    trigger: { dignity: "enemy" },
    effect: {
      score: -12,
      weakens: [
        "constructive discipline",
        "confidence",
        "timely execution",
      ],
      shadowAdds: [
        "fear",
        "rigidity",
        "frustration",
      ],
    },
  },
  {
    id: "saturn_dignity_debilitated",
    category: "strength",
    title: "Debilitated Saturn",
    description:
      "Debilitated Saturn may weaken patience, discipline, endurance, authority, and confidence unless cancellation or strong support is present.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "debilitated" },
    effect: {
      score: -22,
      weakens: [
        "patience",
        "discipline",
        "endurance",
        "authority",
      ],
      shadowAdds: [
        "fear",
        "blocked progress",
        "frustration",
      ],
    },
  },
  {
    id: "saturn_retrograde",
    category: "psychology",
    title: "Retrograde Saturn",
    description:
      "Retrograde Saturn internalises duty, fear, discipline, authority, and responsibility, often creating repeated review of obligations and boundaries.",
    weight: "high",
    priority: 90,
    trigger: { retrograde: true },
    effect: {
      score: 2,
      adds: [
        "inner discipline",
        "independent responsibility",
        "deep review of duty",
      ],
      shadowAdds: [
        "self-judgement",
        "repeated delay",
        "difficulty trusting authority",
      ],
    },
  },
  {
    id: "saturn_combust",
    category: "strength",
    title: "Combust Saturn",
    description:
      "Combustion may pressure Saturn through authority conflict, reduced patience, difficulty with boundaries, and strained responsibility.",
    weight: "high",
    priority: 90,
    trigger: { combust: true },
    effect: {
      score: -12,
      weakens: [
        "patience",
        "authority",
        "boundaries",
        "steady responsibility",
      ],
      shadowAdds: [
        "authority conflict",
        "burnout",
      ],
    },
  },
  {
    id: "saturn_vargottama",
    category: "strength",
    title: "Vargottama Saturn",
    description:
      "Vargottama Saturn strengthens consistency in discipline, endurance, responsibility, systems, and long-term results.",
    weight: "very_high",
    priority: 95,
    trigger: { vargottama: true },
    effect: {
      score: 18,
      strengthens: [
        "discipline",
        "endurance",
        "responsibility",
        "systems",
        "consistency",
      ],
    },
  },
];

const conjunctionRules: KnowledgeRule[] = [
  {
    id: "saturn_conjunct_sun",
    category: "career",
    title: "Saturn conjunct Sun",
    description:
      "Saturn with the Sun combines authority and responsibility, supporting governance, administration, institutions, discipline, and leadership under pressure.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Sun" },
    effect: {
      score: 18,
      adds: [
        "governance",
        "administration",
        "institutional leadership",
        "discipline",
        "responsibility",
      ],
      shadowAdds: [
        "authority conflict",
        "fear of recognition",
      ],
    },
  },
  {
    id: "saturn_conjunct_moon",
    category: "psychology",
    title: "Saturn conjunct Moon",
    description:
      "Saturn with the Moon supports emotional endurance, realism, responsibility, and care under pressure, while increasing heaviness or restraint.",
    weight: "high",
    priority: 92,
    trigger: { conjunction: "Moon" },
    effect: {
      score: 12,
      adds: [
        "emotional endurance",
        "realism",
        "responsibility",
      ],
      shadowAdds: [
        "emotional heaviness",
        "isolation",
        "pessimism",
      ],
    },
  },
  {
    id: "saturn_conjunct_mars",
    category: "career",
    title: "Saturn conjunct Mars",
    description:
      "Saturn with Mars combines discipline and force, supporting engineering, heavy operations, construction, compliance, endurance, and difficult execution.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mars" },
    effect: {
      score: 20,
      adds: [
        "engineering",
        "heavy operations",
        "construction",
        "compliance",
        "endurance",
        "difficult execution",
      ],
      shadowAdds: [
        "frustration",
        "blocked action",
        "harsh self-discipline",
      ],
    },
  },
  {
    id: "saturn_conjunct_mercury",
    category: "career",
    title: "Saturn conjunct Mercury",
    description:
      "Saturn with Mercury supports systems, documentation, audit, compliance, technical analysis, process, research, and disciplined communication.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mercury" },
    effect: {
      score: 20,
      adds: [
        "systems",
        "documentation",
        "audit",
        "compliance",
        "technical analysis",
        "process",
      ],
      shadowAdds: [
        "mental heaviness",
        "fear of mistakes",
      ],
    },
  },
  {
    id: "saturn_conjunct_jupiter",
    category: "career",
    title: "Saturn conjunct Jupiter",
    description:
      "Saturn with Jupiter combines growth and discipline, supporting institutions, law, governance, policy, long-term strategy, and structured expansion.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Jupiter" },
    effect: {
      score: 20,
      adds: [
        "institutions",
        "law",
        "governance",
        "policy",
        "long-term strategy",
        "structured expansion",
      ],
      shadowAdds: [
        "restricted optimism",
        "delayed confidence",
      ],
    },
  },
  {
    id: "saturn_conjunct_venus",
    category: "business",
    title: "Saturn conjunct Venus",
    description:
      "Saturn with Venus supports durable value, long-term clients, contracts, structured partnerships, design discipline, and restrained finance.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Venus" },
    effect: {
      score: 18,
      adds: [
        "durable value",
        "long-term clients",
        "contracts",
        "structured partnerships",
        "disciplined finance",
      ],
      shadowAdds: [
        "emotional reserve",
        "transactional relationships",
      ],
    },
  },
  {
    id: "saturn_conjunct_rahu",
    category: "business",
    title: "Saturn conjunct Rahu",
    description:
      "Saturn with Rahu supports large systems, technology, foreign institutions, mass operations, ambition, unconventional scale, and regulatory complexity.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Rahu" },
    effect: {
      score: 18,
      adds: [
        "large systems",
        "technology",
        "foreign institutions",
        "mass operations",
        "unconventional scale",
        "regulatory complexity",
      ],
      shadowAdds: [
        "obsession with control",
        "ethical pressure",
        "fear-driven ambition",
      ],
    },
  },
  {
    id: "saturn_conjunct_ketu",
    category: "spirituality",
    title: "Saturn conjunct Ketu",
    description:
      "Saturn with Ketu supports austerity, detachment, hidden work, spiritual discipline, research, and responsibility without recognition.",
    weight: "high",
    priority: 94,
    trigger: { conjunction: "Ketu" },
    effect: {
      score: 16,
      adds: [
        "austerity",
        "detachment",
        "hidden work",
        "spiritual discipline",
        "research",
      ],
      shadowAdds: [
        "isolation",
        "detachment from results",
      ],
    },
  },
];

const aspectRules: KnowledgeRule[] = [
  {
    id: "saturn_aspected_by_sun",
    category: "career",
    title: "Sun aspects Saturn",
    description:
      "The Sun gives Saturn authority, visibility, administration, governance, and responsibility under leadership.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Sun" },
    effect: {
      score: 14,
      adds: [
        "authority",
        "administration",
        "governance",
        "leadership responsibility",
      ],
      shadowAdds: [
        "authority conflict",
      ],
    },
  },
  {
    id: "saturn_aspected_by_moon",
    category: "psychology",
    title: "Moon aspects Saturn",
    description:
      "The Moon adds emotional responsibility, care under pressure, family duty, and public sensitivity to Saturn.",
    weight: "high",
    priority: 86,
    trigger: { aspectFrom: "Moon" },
    effect: {
      score: 10,
      adds: [
        "emotional responsibility",
        "family duty",
        "care under pressure",
      ],
      shadowAdds: [
        "emotional heaviness",
      ],
    },
  },
  {
    id: "saturn_aspected_by_mars",
    category: "career",
    title: "Mars aspects Saturn",
    description:
      "Mars energises Saturn toward engineering, construction, operations, compliance, endurance, and difficult execution.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Mars" },
    effect: {
      score: 18,
      adds: [
        "engineering",
        "construction",
        "operations",
        "compliance",
        "endurance",
      ],
      shadowAdds: [
        "frustration",
        "blocked action",
      ],
    },
  },
  {
    id: "saturn_aspected_by_mercury",
    category: "career",
    title: "Mercury aspects Saturn",
    description:
      "Mercury sharpens Saturn through systems, documentation, audit, compliance, data, technical analysis, and process design.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "systems",
        "documentation",
        "audit",
        "compliance",
        "data",
        "process design",
      ],
    },
  },
  {
    id: "saturn_aspected_by_jupiter",
    category: "career",
    title: "Jupiter aspects Saturn",
    description:
      "Jupiter guides Saturn toward governance, law, policy, ethical institutions, long-term strategy, and structured growth.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Jupiter" },
    effect: {
      score: 16,
      adds: [
        "governance",
        "law",
        "policy",
        "ethical institutions",
        "long-term strategy",
      ],
    },
  },
  {
    id: "saturn_aspected_by_venus",
    category: "business",
    title: "Venus aspects Saturn",
    description:
      "Venus refines Saturn through durable value, contracts, long-term clients, structured partnerships, design discipline, and restrained finance.",
    weight: "high",
    priority: 92,
    trigger: { aspectFrom: "Venus" },
    effect: {
      score: 14,
      adds: [
        "durable value",
        "contracts",
        "long-term clients",
        "structured partnerships",
        "disciplined finance",
      ],
    },
  },
  {
    id: "saturn_aspected_by_rahu",
    category: "business",
    title: "Rahu aspects Saturn",
    description:
      "Rahu amplifies Saturn toward technology, large systems, foreign institutions, mass operations, unconventional scale, and regulatory complexity.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Rahu" },
    effect: {
      score: 18,
      adds: [
        "technology",
        "large systems",
        "foreign institutions",
        "mass operations",
        "unconventional scale",
      ],
      shadowAdds: [
        "fear-driven ambition",
        "control obsession",
      ],
    },
  },
  {
    id: "saturn_aspected_by_ketu",
    category: "spirituality",
    title: "Ketu aspects Saturn",
    description:
      "Ketu turns Saturn toward austerity, hidden work, detachment, research, spiritual discipline, and responsibility without recognition.",
    weight: "high",
    priority: 92,
    trigger: { aspectFrom: "Ketu" },
    effect: {
      score: 14,
      adds: [
        "austerity",
        "hidden work",
        "research",
        "spiritual discipline",
        "detachment",
      ],
    },
  },
];

const dispositorRules: KnowledgeRule[] = [
  {
    id: "saturn_dispositor_sun",
    category: "career",
    title: "Saturn disposed by Sun",
    description:
      "When the Sun disposes Saturn, discipline seeks authority, governance, leadership, administration, and public responsibility.",
    weight: "high",
    priority: 90,
    trigger: { dispositor: "Sun" },
    effect: {
      score: 14,
      adds: [
        "governance",
        "leadership responsibility",
        "administration",
        "authority",
      ],
    },
  },
  {
    id: "saturn_dispositor_moon",
    category: "relationships",
    title: "Saturn disposed by Moon",
    description:
      "When the Moon disposes Saturn, responsibility becomes emotional, protective, family-oriented, public-facing, and care-driven.",
    weight: "high",
    priority: 86,
    trigger: { dispositor: "Moon" },
    effect: {
      score: 10,
      adds: [
        "family responsibility",
        "care under pressure",
        "protective structure",
      ],
      shadowAdds: [
        "emotional heaviness",
      ],
    },
  },
  {
    id: "saturn_dispositor_mars",
    category: "career",
    title: "Saturn disposed by Mars",
    description:
      "When Mars disposes Saturn, discipline becomes operational, technical, forceful, engineering-oriented, and execution-driven.",
    weight: "very_high",
    priority: 98,
    trigger: { dispositor: "Mars" },
    effect: {
      score: 18,
      adds: [
        "operations",
        "engineering",
        "construction",
        "technical discipline",
        "difficult execution",
      ],
    },
  },
  {
    id: "saturn_dispositor_mercury",
    category: "career",
    title: "Saturn disposed by Mercury",
    description:
      "When Mercury disposes Saturn, discipline is expressed through systems, data, documentation, audit, compliance, analysis, and process.",
    weight: "very_high",
    priority: 98,
    trigger: { dispositor: "Mercury" },
    effect: {
      score: 18,
      adds: [
        "systems",
        "data",
        "documentation",
        "audit",
        "compliance",
        "process",
      ],
    },
  },
  {
    id: "saturn_dispositor_jupiter",
    category: "career",
    title: "Saturn disposed by Jupiter",
    description:
      "When Jupiter disposes Saturn, discipline becomes institutional, legal, ethical, policy-oriented, strategic, and connected to structured growth.",
    weight: "very_high",
    priority: 98,
    trigger: { dispositor: "Jupiter" },
    effect: {
      score: 18,
      adds: [
        "institutions",
        "law",
        "policy",
        "ethical governance",
        "long-term strategy",
      ],
    },
  },
  {
    id: "saturn_dispositor_venus",
    category: "business",
    title: "Saturn disposed by Venus",
    description:
      "When Venus disposes Saturn, discipline is channelled through contracts, value, relationships, finance, partnerships, and durable commercial structures.",
    weight: "very_high",
    priority: 98,
    trigger: { dispositor: "Venus" },
    effect: {
      score: 18,
      adds: [
        "contracts",
        "durable value",
        "partnership structures",
        "disciplined finance",
        "long-term clients",
      ],
    },
  },
];

const businessRules: KnowledgeRule[] = [
  {
    id: "saturn_business_2nd_lord",
    category: "wealth",
    title: "Saturn ruling the second house",
    description:
      "Saturn ruling the second house supports wealth through discipline, long-term accumulation, conservative finance, labour, systems, and durable assets.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 2 },
    effect: {
      score: 20,
      strengthens: [
        "long-term accumulation",
        "conservative finance",
        "durable assets",
        "systematic wealth",
      ],
    },
  },
  {
    id: "saturn_business_6th_lord",
    category: "career",
    title: "Saturn ruling the sixth house",
    description:
      "Saturn ruling the sixth house supports service, labour, compliance, disputes, health administration, routines, and persistent problem solving.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 6 },
    effect: {
      score: 20,
      strengthens: [
        "service",
        "labour management",
        "compliance",
        "health administration",
        "persistent problem solving",
      ],
    },
  },
  {
    id: "saturn_business_10th_lord",
    category: "career",
    title: "Saturn ruling the tenth house",
    description:
      "Saturn ruling the tenth house ties professional success to authority, administration, operations, governance, institutions, systems, and long-term achievement.",
    weight: "very_high",
    priority: 100,
    trigger: { ownsHouse: 10 },
    effect: {
      score: 22,
      strengthens: [
        "authority",
        "administration",
        "operations",
        "governance",
        "institutions",
        "systems",
      ],
    },
  },
  {
    id: "saturn_business_11th_lord",
    category: "wealth",
    title: "Saturn ruling the eleventh house",
    description:
      "Saturn ruling the eleventh house supports gains through institutions, networks, systems, labour, large organisations, and long-term goals.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 11 },
    effect: {
      score: 20,
      strengthens: [
        "institutional gains",
        "large organisations",
        "network durability",
        "systematic growth",
      ],
    },
  },
];

const careerRules: KnowledgeRule[] = [
  {
    id: "saturn_career_system_professions",
    category: "career",
    title: "Saturn and system professions",
    description:
      "A strong Saturn supports professions involving operations, compliance, governance, administration, infrastructure, manufacturing, logistics, audit, labour, law, and institutions.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "operations",
        "compliance",
        "governance",
        "administration",
        "infrastructure",
        "manufacturing",
        "logistics",
        "audit",
      ],
    },
  },
];

const wealthRules: KnowledgeRule[] = [
  {
    id: "saturn_wealth_accumulation",
    category: "wealth",
    title: "Saturn and durable wealth",
    description:
      "Saturn supports wealth through patience, discipline, labour, systems, land, infrastructure, conservative finance, and long-term accumulation.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "long-term accumulation",
        "land",
        "infrastructure",
        "conservative finance",
        "systematic wealth",
      ],
    },
  },
];

const relationshipRules: KnowledgeRule[] = [
  {
    id: "saturn_relationship_commitment",
    category: "relationships",
    title: "Saturn in relationships",
    description:
      "Saturn brings commitment, duty, durability, boundaries, delay, realism, and lessons through responsibility in relationships.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 12,
      adds: [
        "commitment",
        "duty",
        "durability",
        "boundaries",
        "realism",
      ],
      shadowAdds: [
        "distance",
        "delay",
        "fear of vulnerability",
      ],
    },
  },
];

const healthRules: KnowledgeRule[] = [
  {
    id: "saturn_health_chronic",
    category: "health",
    title: "Saturn and chronic regulation",
    description:
      "Saturn relates to bones, joints, teeth, chronic conditions, dryness, ageing, endurance, and the consequences of long-term habits.",
    weight: "high",
    priority: 85,
    trigger: {},
    effect: {
      score: 8,
      adds: [
        "endurance",
        "recovery through discipline",
        "long-term regulation",
      ],
      shadowAdds: [
        "chronic strain",
        "stiffness",
        "slow recovery",
      ],
    },
  },
];

const spiritualityRules: KnowledgeRule[] = [
  {
    id: "saturn_spiritual_discipline",
    category: "spirituality",
    title: "Saturn and spiritual discipline",
    description:
      "Saturn supports austerity, service, humility, patience, karma, responsibility, detachment, and sustained spiritual practice.",
    weight: "very_high",
    priority: 92,
    trigger: {},
    effect: {
      score: 14,
      adds: [
        "austerity",
        "service",
        "humility",
        "patience",
        "karma",
        "sustained practice",
      ],
    },
  },
];

const shadowRules: KnowledgeRule[] = [
  {
    id: "saturn_shadow_rigidity",
    category: "psychology",
    title: "Saturn excess",
    description:
      "A highly active Saturn may become rigid, fearful, pessimistic, controlling, overly cautious, or resistant to necessary change.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "rigidity",
        "fear",
        "pessimism",
        "over-control",
        "resistance to change",
      ],
    },
  },
];

export const SaturnKnowledge: PlanetKnowledge = {
  planet: "Saturn",

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
