import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "./types";

const identity: KnowledgeRule[] = [
  {
    id: "mercury_identity_analysis",
    category: "identity",
    title: "Mercury as the analytical graha",
    description:
      "Mercury naturally governs analysis, classification, language, logic, learning, calculation, and interpretation.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "analysis",
        "logic",
        "learning",
        "interpretation",
        "classification",
      ],
      strengthens: [
        "problem solving",
        "pattern recognition",
        "adaptability",
      ],
    },
  },
  {
    id: "mercury_identity_commerce",
    category: "business",
    title: "Mercury as the graha of commerce",
    description:
      "Mercury supports trade, negotiation, exchange, pricing, brokerage, communication, and commercial intelligence.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "commerce",
        "trade",
        "negotiation",
        "brokerage",
        "pricing",
      ],
      strengthens: [
        "sales communication",
        "market understanding",
        "commercial judgement",
      ],
    },
  },
  {
    id: "mercury_identity_technology",
    category: "business",
    title: "Mercury and technology",
    description:
      "Mercury supports software, information systems, automation, analytics, coding, and digital communication.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 14,
      adds: [
        "software",
        "technology",
        "analytics",
        "automation",
        "digital systems",
      ],
    },
  },
  {
    id: "mercury_identity_communication",
    category: "communication",
    title: "Mercury as communicator",
    description:
      "Mercury governs speech, writing, messaging, teaching, translation, explanation, and information flow.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "writing",
        "speaking",
        "teaching",
        "translation",
        "explanation",
      ],
    },
  },
  {
    id: "mercury_identity_shadow",
    category: "psychology",
    title: "Mercury shadow expression",
    description:
      "An overstimulated or poorly directed Mercury can produce overthinking, indecision, nervousness, inconsistency, and excessive analysis.",
    weight: "high",
    priority: 80,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "overthinking",
        "analysis paralysis",
        "restlessness",
        "indecision",
        "scattered attention",
      ],
    },
  },
];

const signRules: KnowledgeRule[] = [
  {
    id: "mercury_aries",
    category: "communication",
    title: "Mercury in Aries",
    description:
      "Mercury in Aries communicates quickly, directly, competitively, and with strong initiative.",
    weight: "high",
    priority: 80,
    trigger: { sign: "Aries" },
    effect: {
      score: 8,
      adds: [
        "fast decisions",
        "direct communication",
        "entrepreneurial thinking",
        "competitive intelligence",
      ],
      shadowAdds: [
        "impatience",
        "premature conclusions",
        "argumentative speech",
      ],
    },
  },
  {
    id: "mercury_taurus",
    category: "business",
    title: "Mercury in Taurus",
    description:
      "Mercury in Taurus favours practical judgement, financial realism, patient planning, and value-based commerce.",
    weight: "high",
    priority: 80,
    trigger: { sign: "Taurus" },
    effect: {
      score: 10,
      adds: [
        "financial planning",
        "value-based decisions",
        "practical commerce",
        "steady communication",
      ],
      shadowAdds: [
        "mental rigidity",
        "slow adaptation",
      ],
    },
  },
  {
    id: "mercury_gemini",
    category: "identity",
    title: "Mercury in Gemini",
    description:
      "Mercury in Gemini strongly supports language, networking, information exchange, media, sales, and intellectual versatility.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Gemini" },
    effect: {
      score: 18,
      adds: [
        "networking",
        "media",
        "sales",
        "writing",
        "multi-disciplinary learning",
      ],
      strengthens: [
        "adaptability",
        "communication speed",
        "commercial agility",
      ],
      shadowAdds: [
        "scattered focus",
        "too many simultaneous interests",
      ],
    },
  },
  {
    id: "mercury_cancer",
    category: "communication",
    title: "Mercury in Cancer",
    description:
      "Mercury in Cancer interprets through memory, emotion, care, family context, and audience sensitivity.",
    weight: "medium",
    priority: 75,
    trigger: { sign: "Cancer" },
    effect: {
      score: 6,
      adds: [
        "empathetic communication",
        "memory",
        "storytelling",
        "client sensitivity",
      ],
      shadowAdds: [
        "subjective thinking",
        "emotional overinterpretation",
      ],
    },
  },
  {
    id: "mercury_leo",
    category: "career",
    title: "Mercury in Leo",
    description:
      "Mercury in Leo supports confident speech, presentation, strategy, leadership communication, and creative messaging.",
    weight: "high",
    priority: 80,
    trigger: { sign: "Leo" },
    effect: {
      score: 9,
      adds: [
        "leadership communication",
        "presentation",
        "creative strategy",
        "public speaking",
      ],
      shadowAdds: [
        "intellectual pride",
        "need for recognition",
      ],
    },
  },
  {
    id: "mercury_virgo",
    category: "strength",
    title: "Mercury in Virgo",
    description:
      "Mercury in Virgo is highly analytical, precise, systematic, technical, and suited to refinement, service, and problem solving.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Virgo" },
    effect: {
      score: 22,
      adds: [
        "precision",
        "analytics",
        "technical intelligence",
        "process design",
        "quality control",
      ],
      strengthens: [
        "research",
        "documentation",
        "systems thinking",
      ],
      shadowAdds: [
        "perfectionism",
        "excessive criticism",
        "analysis paralysis",
      ],
    },
  },
  {
    id: "mercury_libra",
    category: "business",
    title: "Mercury in Libra",
    description:
      "Mercury in Libra supports negotiation, mediation, partnership management, branding, law, and balanced commercial judgement.",
    weight: "high",
    priority: 85,
    trigger: { sign: "Libra" },
    effect: {
      score: 12,
      adds: [
        "negotiation",
        "partnership management",
        "mediation",
        "branding",
        "contract discussion",
      ],
      shadowAdds: [
        "indecision",
        "overdependence on consensus",
      ],
    },
  },
  {
    id: "mercury_scorpio",
    category: "career",
    title: "Mercury in Scorpio",
    description:
      "Mercury in Scorpio favours investigation, confidential analysis, strategy, psychology, research, risk, and hidden systems.",
    weight: "high",
    priority: 85,
    trigger: { sign: "Scorpio" },
    effect: {
      score: 12,
      adds: [
        "deep research",
        "investigation",
        "risk analysis",
        "strategy",
        "psychology",
      ],
      shadowAdds: [
        "suspicion",
        "secretive communication",
        "obsessive thinking",
      ],
    },
  },
  {
    id: "mercury_sagittarius",
    category: "education",
    title: "Mercury in Sagittarius",
    description:
      "Mercury in Sagittarius expands communication toward philosophy, teaching, publishing, law, strategy, and broad knowledge systems.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Sagittarius" },
    effect: {
      score: 14,
      adds: [
        "teaching",
        "publishing",
        "philosophy",
        "strategy",
        "knowledge systems",
        "international learning",
      ],
      strengthens: [
        "advisory work",
        "research synthesis",
        "big-picture communication",
      ],
      shadowAdds: [
        "overgeneralisation",
        "missing practical detail",
        "intellectual restlessness",
      ],
    },
  },
  {
    id: "mercury_capricorn",
    category: "career",
    title: "Mercury in Capricorn",
    description:
      "Mercury in Capricorn favours structured thinking, management, policy, operations, governance, and long-term planning.",
    weight: "high",
    priority: 85,
    trigger: { sign: "Capricorn" },
    effect: {
      score: 12,
      adds: [
        "management",
        "operations",
        "policy",
        "governance",
        "long-term planning",
      ],
      shadowAdds: [
        "pessimistic thinking",
        "over-caution",
      ],
    },
  },
  {
    id: "mercury_aquarius",
    category: "business",
    title: "Mercury in Aquarius",
    description:
      "Mercury in Aquarius supports systems innovation, networks, technology, data, communities, and unconventional problem solving.",
    weight: "very_high",
    priority: 90,
    trigger: { sign: "Aquarius" },
    effect: {
      score: 16,
      adds: [
        "technology",
        "innovation",
        "data",
        "networks",
        "community platforms",
      ],
      strengthens: [
        "future-oriented thinking",
        "system design",
        "digital collaboration",
      ],
      shadowAdds: [
        "detachment",
        "over-intellectualisation",
      ],
    },
  },
  {
    id: "mercury_pisces",
    category: "strength",
    title: "Mercury in Pisces",
    description:
      "Mercury in Pisces can become intuitive, imaginative, symbolic, and compassionate, but may lose precision without support.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Pisces" },
    effect: {
      score: -12,
      adds: [
        "intuition",
        "imagination",
        "symbolic thinking",
        "creative communication",
      ],
      weakens: [
        "precision",
        "linear reasoning",
        "commercial clarity",
      ],
      shadowAdds: [
        "confusion",
        "poor boundaries",
        "inconsistent judgement",
      ],
    },
  },
];

const houseRules: KnowledgeRule[] = [
  {
    id: "mercury_house_1",
    category: "identity",
    title: "Mercury in the first house",
    description:
      "Mercury in the first house makes learning, analysis, communication, and adaptability central to identity.",
    weight: "very_high",
    priority: 90,
    trigger: { house: 1 },
    effect: {
      score: 16,
      adds: [
        "intellectual identity",
        "communication-led personality",
        "adaptability",
        "quick learning",
      ],
      shadowAdds: [
        "mental restlessness",
        "over-identification with intellect",
      ],
    },
  },
  {
    id: "mercury_house_2",
    category: "wealth",
    title: "Mercury in the second house",
    description:
      "Mercury in the second house supports income through speech, commerce, knowledge, analysis, accounts, and advisory skills.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 2 },
    effect: {
      score: 18,
      adds: [
        "income through speech",
        "commercial intelligence",
        "financial analysis",
        "advisory income",
      ],
      shadowAdds: [
        "over-calculation in money matters",
        "inconsistent savings if afflicted",
      ],
    },
  },
  {
    id: "mercury_house_3",
    category: "business",
    title: "Mercury in the third house",
    description:
      "Mercury in the third house strongly supports communication, entrepreneurship, sales, writing, marketing, media, and self-initiated enterprise.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 3 },
    effect: {
      score: 18,
      adds: [
        "entrepreneurship",
        "sales",
        "marketing",
        "writing",
        "media",
        "self-initiated work",
      ],
    },
  },
  {
    id: "mercury_house_4",
    category: "education",
    title: "Mercury in the fourth house",
    description:
      "Mercury in the fourth house supports education, knowledge systems, teaching environments, property analysis, home-based work, and intellectual foundations.",
    weight: "high",
    priority: 85,
    trigger: { house: 4 },
    effect: {
      score: 12,
      adds: [
        "education",
        "teaching",
        "knowledge platforms",
        "home-based work",
        "property analysis",
      ],
      shadowAdds: [
        "mental unrest at home",
        "overthinking emotional security",
      ],
    },
  },
  {
    id: "mercury_house_5",
    category: "education",
    title: "Mercury in the fifth house",
    description:
      "Mercury in the fifth house supports intelligence, writing, teaching, strategy, creativity, analytics, markets, and speculative thought.",
    weight: "high",
    priority: 88,
    trigger: { house: 5 },
    effect: {
      score: 14,
      adds: [
        "teaching",
        "creative intelligence",
        "strategy",
        "analytics",
        "content creation",
      ],
      shadowAdds: [
        "over-analysis in speculation",
      ],
    },
  },
  {
    id: "mercury_house_6",
    category: "career",
    title: "Mercury in the sixth house",
    description:
      "Mercury in the sixth house supports service, analytics, health administration, problem solving, disputes, compliance, and process improvement.",
    weight: "high",
    priority: 85,
    trigger: { house: 6 },
    effect: {
      score: 12,
      adds: [
        "service analytics",
        "compliance",
        "process improvement",
        "problem solving",
        "health administration",
      ],
      shadowAdds: [
        "worry",
        "nervous strain",
        "conflict through words",
      ],
    },
  },
  {
    id: "mercury_house_7",
    category: "business",
    title: "Mercury in the seventh house",
    description:
      "Mercury in the seventh house supports clients, contracts, negotiation, partnerships, consulting, and trade.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 7 },
    effect: {
      score: 18,
      adds: [
        "consulting",
        "client management",
        "contracts",
        "partnerships",
        "trade",
      ],
      shadowAdds: [
        "over-negotiation",
        "intellectualising relationships",
      ],
    },
  },
  {
    id: "mercury_house_8",
    category: "career",
    title: "Mercury in the eighth house",
    description:
      "Mercury in the eighth house supports research, risk, insurance, taxation, psychology, confidential analysis, and hidden systems.",
    weight: "high",
    priority: 85,
    trigger: { house: 8 },
    effect: {
      score: 12,
      adds: [
        "research",
        "risk",
        "insurance",
        "taxation",
        "psychology",
        "confidential analysis",
      ],
      shadowAdds: [
        "obsessive thinking",
        "secrecy",
        "mental anxiety",
      ],
    },
  },
  {
    id: "mercury_house_9",
    category: "education",
    title: "Mercury in the ninth house",
    description:
      "Mercury in the ninth house supports higher learning, publishing, law, philosophy, teaching, travel, and international knowledge.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 9 },
    effect: {
      score: 18,
      adds: [
        "higher education",
        "publishing",
        "law",
        "philosophy",
        "teaching",
        "international knowledge",
      ],
    },
  },
  {
    id: "mercury_house_10",
    category: "career",
    title: "Mercury in the tenth house",
    description:
      "Mercury in the tenth house strongly supports careers in business, management, software, analytics, advisory, communication, consulting, finance, and administration.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 10 },
    effect: {
      score: 22,
      adds: [
        "business",
        "management",
        "software",
        "analytics",
        "consulting",
        "finance",
        "administration",
      ],
      strengthens: [
        "professional visibility",
        "career adaptability",
        "commercial intelligence",
      ],
    },
  },
  {
    id: "mercury_house_11",
    category: "wealth",
    title: "Mercury in the eleventh house",
    description:
      "Mercury in the eleventh house supports gains through networks, technology, communication, commerce, clients, and scalable communities.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 11 },
    effect: {
      score: 18,
      adds: [
        "network-based gains",
        "technology income",
        "commercial communities",
        "client networks",
        "scalable communication",
      ],
    },
  },
  {
    id: "mercury_house_12",
    category: "business",
    title: "Mercury in the twelfth house",
    description:
      "Mercury in the twelfth house can support foreign markets, remote work, research, institutions, digital services, and private analysis.",
    weight: "medium",
    priority: 80,
    trigger: { house: 12 },
    effect: {
      score: 8,
      adds: [
        "foreign markets",
        "remote work",
        "research",
        "institutional services",
        "private analysis",
      ],
      shadowAdds: [
        "hidden anxiety",
        "poor documentation",
        "mental isolation",
      ],
    },
  },
];

const dignityRules: KnowledgeRule[] = [
  {
    id: "mercury_dignity_exalted",
    category: "strength",
    title: "Exalted Mercury",
    description:
      "Exalted Mercury greatly strengthens analysis, precision, communication, commercial judgement, and technical intelligence.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "exalted" },
    effect: {
      score: 22,
      strengthens: [
        "analysis",
        "precision",
        "commercial intelligence",
        "technical ability",
      ],
    },
  },
  {
    id: "mercury_dignity_own",
    category: "strength",
    title: "Mercury in own sign",
    description:
      "Mercury in its own sign expresses communication, analysis, adaptability, and commerce with natural competence.",
    weight: "very_high",
    priority: 95,
    trigger: { dignity: "own" },
    effect: {
      score: 18,
      strengthens: [
        "communication",
        "analysis",
        "adaptability",
        "commerce",
      ],
    },
  },
  {
    id: "mercury_dignity_friend",
    category: "strength",
    title: "Mercury in friendly dignity",
    description:
      "Friendly dignity allows Mercury to function constructively and with practical support.",
    weight: "medium",
    priority: 70,
    trigger: { dignity: "friend" },
    effect: {
      score: 8,
      strengthens: [
        "learning",
        "communication",
        "commercial judgement",
      ],
    },
  },
  {
    id: "mercury_dignity_enemy",
    category: "strength",
    title: "Mercury in inimical dignity",
    description:
      "Inimical dignity can distort Mercury through inconsistency, weak judgement, or difficulty applying intelligence practically.",
    weight: "high",
    priority: 85,
    trigger: { dignity: "enemy" },
    effect: {
      score: -10,
      weakens: [
        "consistency",
        "practical judgement",
        "communication clarity",
      ],
      shadowAdds: [
        "misjudgement",
        "confusion",
      ],
    },
  },
  {
    id: "mercury_dignity_debilitated",
    category: "strength",
    title: "Debilitated Mercury",
    description:
      "Debilitated Mercury may weaken precision, discrimination, practical reasoning, and commercial clarity unless cancelled or strongly supported.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "debilitated" },
    effect: {
      score: -22,
      weakens: [
        "precision",
        "discrimination",
        "commercial clarity",
        "consistent reasoning",
      ],
      shadowAdds: [
        "confusion",
        "poor decisions",
        "unreliable communication",
      ],
    },
  },
  {
    id: "mercury_retrograde",
    category: "psychology",
    title: "Retrograde Mercury",
    description:
      "Retrograde Mercury internalises analysis and can support review, research, revision, and unconventional thinking while complicating speed and clarity.",
    weight: "high",
    priority: 85,
    trigger: { retrograde: true },
    effect: {
      score: 2,
      adds: [
        "deep review",
        "research",
        "revision",
        "unconventional thinking",
      ],
      shadowAdds: [
        "second guessing",
        "communication delays",
        "repeated decisions",
      ],
    },
  },
  {
    id: "mercury_combust",
    category: "strength",
    title: "Combust Mercury",
    description:
      "Combustion may reduce independent judgement and create pressure around communication, decisions, and nervous energy.",
    weight: "high",
    priority: 90,
    trigger: { combust: true },
    effect: {
      score: -12,
      weakens: [
        "independent judgement",
        "communication ease",
        "mental calm",
      ],
      shadowAdds: [
        "nervous pressure",
        "over-identification with authority",
      ],
    },
  },
  {
    id: "mercury_vargottama",
    category: "strength",
    title: "Vargottama Mercury",
    description:
      "Vargottama Mercury gains consistency and strength of expression across the natal and navamsa layers.",
    weight: "very_high",
    priority: 95,
    trigger: { vargottama: true },
    effect: {
      score: 18,
      strengthens: [
        "consistency",
        "communication",
        "analysis",
        "professional expression",
      ],
    },
  },
];

const conjunctionRules: KnowledgeRule[] = [
  {
    id: "mercury_conjunct_sun",
    category: "career",
    title: "Mercury conjunct Sun",
    description:
      "Mercury with the Sun supports administration, strategy, leadership communication, authority, and intellectual visibility.",
    weight: "high",
    priority: 88,
    trigger: { conjunction: "Sun" },
    effect: {
      score: 12,
      adds: [
        "administration",
        "strategy",
        "leadership communication",
        "authority",
      ],
      shadowAdds: [
        "intellectual pride",
        "combustion-related pressure when too close",
      ],
    },
  },
  {
    id: "mercury_conjunct_moon",
    category: "communication",
    title: "Mercury conjunct Moon",
    description:
      "Mercury with the Moon combines thought and feeling, supporting memory, storytelling, counselling, and audience understanding.",
    weight: "high",
    priority: 85,
    trigger: { conjunction: "Moon" },
    effect: {
      score: 10,
      adds: [
        "storytelling",
        "memory",
        "counselling",
        "audience understanding",
      ],
      shadowAdds: [
        "mental fluctuation",
        "emotional overthinking",
      ],
    },
  },
  {
    id: "mercury_conjunct_mars",
    category: "business",
    title: "Mercury conjunct Mars",
    description:
      "Mercury with Mars supports technical intelligence, engineering, debate, decisive communication, sales aggression, and execution.",
    weight: "high",
    priority: 85,
    trigger: { conjunction: "Mars" },
    effect: {
      score: 10,
      adds: [
        "technical intelligence",
        "engineering",
        "debate",
        "sales drive",
        "execution",
      ],
      shadowAdds: [
        "harsh speech",
        "impulsive decisions",
        "argumentative thinking",
      ],
    },
  },
  {
    id: "mercury_conjunct_jupiter",
    category: "education",
    title: "Mercury conjunct Jupiter",
    description:
      "Mercury with Jupiter combines intellect and wisdom, supporting teaching, consulting, strategy, finance, law, publishing, and knowledge systems.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Jupiter" },
    effect: {
      score: 20,
      adds: [
        "teaching",
        "consulting",
        "strategy",
        "finance",
        "law",
        "publishing",
        "knowledge systems",
      ],
      strengthens: [
        "research synthesis",
        "advisory judgement",
        "ethical communication",
      ],
      shadowAdds: [
        "overconfidence in knowledge",
        "excessive theorising",
      ],
    },
  },
  {
    id: "mercury_conjunct_venus",
    category: "business",
    title: "Mercury conjunct Venus",
    description:
      "Mercury with Venus supports branding, design, client relations, marketing, content, negotiation, and commercial presentation.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Venus" },
    effect: {
      score: 18,
      adds: [
        "branding",
        "design",
        "marketing",
        "content",
        "client relations",
        "commercial presentation",
      ],
    },
  },
  {
    id: "mercury_conjunct_saturn",
    category: "career",
    title: "Mercury conjunct Saturn",
    description:
      "Mercury with Saturn supports discipline, systems, compliance, research, documentation, law, audit, and long-term planning.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Saturn" },
    effect: {
      score: 16,
      adds: [
        "systems",
        "compliance",
        "research",
        "documentation",
        "audit",
        "long-term planning",
      ],
      shadowAdds: [
        "pessimism",
        "mental heaviness",
        "fear of mistakes",
      ],
    },
  },
  {
    id: "mercury_conjunct_rahu",
    category: "business",
    title: "Mercury conjunct Rahu",
    description:
      "Mercury with Rahu strongly supports technology, digital platforms, unconventional intelligence, foreign markets, media, and rapid information processing.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Rahu" },
    effect: {
      score: 20,
      adds: [
        "technology",
        "AI",
        "digital platforms",
        "foreign markets",
        "media",
        "unconventional intelligence",
      ],
      shadowAdds: [
        "mental obsession",
        "manipulative communication",
        "information overload",
      ],
    },
  },
  {
    id: "mercury_conjunct_ketu",
    category: "spirituality",
    title: "Mercury conjunct Ketu",
    description:
      "Mercury with Ketu supports research, coding, hidden knowledge, symbolism, astrology, spiritual study, and detached analysis.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Ketu" },
    effect: {
      score: 16,
      adds: [
        "research",
        "coding",
        "astrology",
        "symbolism",
        "hidden knowledge",
        "spiritual study",
      ],
      shadowAdds: [
        "disconnected communication",
        "over-abstraction",
        "difficulty explaining conclusions",
      ],
    },
  },
];

const businessRules: KnowledgeRule[] = [
  {
    id: "mercury_business_10th_lord",
    category: "business",
    title: "Mercury ruling the tenth house",
    description:
      "When Mercury rules the tenth house, professional success is strongly tied to communication, analysis, commerce, technology, advisory work, and adaptability.",
    weight: "very_high",
    priority: 100,
    trigger: { ownsHouse: 10 },
    effect: {
      score: 22,
      strengthens: [
        "consulting",
        "technology",
        "software",
        "analytics",
        "business strategy",
        "communication-led profession",
      ],
    },
  },
  {
    id: "mercury_business_7th_lord",
    category: "business",
    title: "Mercury ruling the seventh house",
    description:
      "Mercury ruling the seventh house supports trade, contracts, clients, partnerships, advisory work, and negotiated commerce.",
    weight: "very_high",
    priority: 95,
    trigger: { ownsHouse: 7 },
    effect: {
      score: 18,
      strengthens: [
        "trade",
        "consulting",
        "contracts",
        "client management",
        "partnership business",
      ],
    },
  },
  {
    id: "mercury_business_2nd_lord",
    category: "wealth",
    title: "Mercury ruling the second house",
    description:
      "Mercury ruling the second house supports income through knowledge, speech, analysis, accounts, finance, and commerce.",
    weight: "very_high",
    priority: 95,
    trigger: { ownsHouse: 2 },
    effect: {
      score: 18,
      strengthens: [
        "knowledge income",
        "financial analysis",
        "speech-based income",
        "commerce",
      ],
    },
  },
  {
    id: "mercury_business_11th_lord",
    category: "wealth",
    title: "Mercury ruling the eleventh house",
    description:
      "Mercury ruling the eleventh house supports gains through networks, technology, clients, trade, communication, and scalable platforms.",
    weight: "very_high",
    priority: 95,
    trigger: { ownsHouse: 11 },
    effect: {
      score: 18,
      strengthens: [
        "network gains",
        "technology income",
        "platform business",
        "commercial communities",
      ],
    },
  },
];



const aspectRules: KnowledgeRule[] = [
  {
    id: "mercury_aspected_by_jupiter",
    category: "education",
    title: "Jupiter aspects Mercury",
    description:
      "Jupiter's influence expands Mercury toward wisdom, teaching, synthesis, ethics, law, finance, and advisory judgement.",
    weight: "very_high",
    priority: 95,
    trigger: {
      aspectFrom: "Jupiter",
    },
    effect: {
      score: 16,
      adds: [
        "teaching",
        "knowledge synthesis",
        "advisory judgement",
        "publishing",
        "philosophical reasoning",
      ],
      strengthens: [
        "consulting",
        "research synthesis",
        "strategy",
      ],
      shadowAdds: [
        "overconfidence in conclusions",
        "excessive theorising",
      ],
    },
  },
  {
    id: "mercury_aspected_by_saturn",
    category: "career",
    title: "Saturn aspects Mercury",
    description:
      "Saturn's influence disciplines Mercury and supports structure, systems, compliance, documentation, audit, research, and long-term thinking.",
    weight: "very_high",
    priority: 95,
    trigger: {
      aspectFrom: "Saturn",
    },
    effect: {
      score: 16,
      adds: [
        "systems thinking",
        "compliance",
        "documentation",
        "audit",
        "methodical research",
        "long-term planning",
      ],
      strengthens: [
        "analysis",
        "process design",
        "professional discipline",
      ],
      shadowAdds: [
        "mental heaviness",
        "fear of mistakes",
        "slow decision making",
      ],
    },
  },
  {
    id: "mercury_aspected_by_mars",
    category: "business",
    title: "Mars aspects Mercury",
    description:
      "Mars energises Mercury toward technical problem solving, debate, engineering, decisive communication, and execution.",
    weight: "high",
    priority: 88,
    trigger: {
      aspectFrom: "Mars",
    },
    effect: {
      score: 12,
      adds: [
        "technical problem solving",
        "decisive communication",
        "engineering logic",
        "sales drive",
        "execution",
      ],
      shadowAdds: [
        "argumentative speech",
        "impatient decisions",
        "harsh communication",
      ],
    },
  },
  {
    id: "mercury_aspected_by_venus",
    category: "business",
    title: "Venus aspects Mercury",
    description:
      "Venus refines Mercury through aesthetics, diplomacy, branding, client sensitivity, content, and commercial presentation.",
    weight: "high",
    priority: 88,
    trigger: {
      aspectFrom: "Venus",
    },
    effect: {
      score: 12,
      adds: [
        "branding",
        "content",
        "client communication",
        "commercial presentation",
        "diplomacy",
      ],
      strengthens: [
        "marketing",
        "negotiation",
        "relationship management",
      ],
    },
  },
  {
    id: "mercury_aspected_by_sun",
    category: "career",
    title: "Sun aspects Mercury",
    description:
      "The Sun gives Mercury authority, confidence, administration, leadership communication, and strategic visibility.",
    weight: "high",
    priority: 85,
    trigger: {
      aspectFrom: "Sun",
    },
    effect: {
      score: 10,
      adds: [
        "administration",
        "leadership communication",
        "strategy",
        "authority",
      ],
      shadowAdds: [
        "intellectual pride",
        "need to control the narrative",
      ],
    },
  },
  {
    id: "mercury_aspected_by_moon",
    category: "communication",
    title: "Moon aspects Mercury",
    description:
      "The Moon connects Mercury with memory, emotion, audience awareness, storytelling, and intuitive communication.",
    weight: "high",
    priority: 82,
    trigger: {
      aspectFrom: "Moon",
    },
    effect: {
      score: 10,
      adds: [
        "storytelling",
        "memory",
        "audience sensitivity",
        "empathetic communication",
      ],
      shadowAdds: [
        "emotional overthinking",
        "fluctuating judgement",
      ],
    },
  },
  {
    id: "mercury_aspected_by_rahu",
    category: "business",
    title: "Rahu aspects Mercury",
    description:
      "Rahu amplifies Mercury toward technology, digital platforms, unconventional intelligence, foreign markets, media, and rapid information processing.",
    weight: "very_high",
    priority: 95,
    trigger: {
      aspectFrom: "Rahu",
    },
    effect: {
      score: 16,
      adds: [
        "technology",
        "AI",
        "digital platforms",
        "foreign markets",
        "media",
        "unconventional intelligence",
      ],
      shadowAdds: [
        "information overload",
        "mental obsession",
        "manipulative communication",
      ],
    },
  },
  {
    id: "mercury_aspected_by_ketu",
    category: "spirituality",
    title: "Ketu aspects Mercury",
    description:
      "Ketu turns Mercury inward and supports hidden knowledge, coding, symbolism, astrology, research, and detached analysis.",
    weight: "high",
    priority: 90,
    trigger: {
      aspectFrom: "Ketu",
    },
    effect: {
      score: 14,
      adds: [
        "hidden knowledge",
        "coding",
        "symbolism",
        "astrology",
        "detached research",
      ],
      shadowAdds: [
        "disconnected communication",
        "difficulty explaining conclusions",
      ],
    },
  },
];

const dispositorRules: KnowledgeRule[] = [
  {
    id: "mercury_dispositor_jupiter_identity",
    category: "identity",
    title: "Mercury disposed by Jupiter",
    description:
      "When Mercury is placed in a sign ruled by Jupiter, its intelligence becomes broader, philosophical, advisory, interpretive, and meaning-oriented.",
    weight: "high",
    priority: 90,
    trigger: {
      dispositor: "Jupiter",
    },
    effect: {
      score: 10,
      adds: [
        "philosophical intelligence",
        "knowledge synthesis",
        "advisory thinking",
        "meaning-oriented analysis",
      ],
      strengthens: [
        "teaching",
        "consulting",
        "strategy",
        "research synthesis",
      ],
      shadowAdds: [
        "overgeneralisation",
        "theory without sufficient detail",
      ],
    },
  },
  {
    id: "mercury_dispositor_jupiter_business",
    category: "business",
    title: "Jupiter-disposed Mercury in business",
    description:
      "Jupiter as Mercury's dispositor favours businesses built around knowledge, education, advice, finance, law, publishing, ethics, or guidance.",
    weight: "very_high",
    priority: 95,
    trigger: {
      dispositor: "Jupiter",
    },
    effect: {
      score: 14,
      adds: [
        "knowledge advisory",
        "education business",
        "publishing",
        "financial guidance",
        "strategic consulting",
        "wisdom platforms",
      ],
      strengthens: [
        "consulting",
        "teaching",
        "knowledge monetisation",
      ],
    },
  },
  {
    id: "mercury_dispositor_jupiter_career",
    category: "career",
    title: "Jupiter-disposed Mercury in career",
    description:
      "This Mercury performs strongly in professions requiring explanation, guidance, synthesis, policy, teaching, law, finance, or strategic judgement.",
    weight: "high",
    priority: 90,
    trigger: {
      dispositor: "Jupiter",
    },
    effect: {
      score: 12,
      adds: [
        "teaching",
        "consulting",
        "policy",
        "financial advisory",
        "publishing",
        "strategy",
      ],
    },
  },
];

const nakshatraRules: KnowledgeRule[] = [
  {
    id: "mercury_mula_identity",
    category: "identity",
    title: "Mercury in Mula",
    description:
      "Mercury in Mula seeks the root cause of a subject. It favours dismantling assumptions, tracing origins, researching hidden structures, and rebuilding knowledge from first principles.",
    weight: "very_high",
    priority: 100,
    trigger: {
      nakshatra: "Mula",
    },
    effect: {
      score: 14,
      adds: [
        "root-cause analysis",
        "first-principles thinking",
        "deep research",
        "investigation",
        "reconstruction of knowledge",
      ],
      strengthens: [
        "research",
        "analysis",
        "pattern recognition",
        "hidden-system interpretation",
      ],
      shadowAdds: [
        "intellectual destructiveness",
        "discarding useful structures too quickly",
        "obsession with finding the ultimate cause",
      ],
    },
  },
  {
    id: "mercury_mula_business",
    category: "business",
    title: "Mercury in Mula for business",
    description:
      "For business, Mercury in Mula supports research-led, diagnostic, transformative, spiritual, technical, or knowledge-based models that solve problems at their root.",
    weight: "very_high",
    priority: 100,
    trigger: {
      nakshatra: "Mula",
    },
    effect: {
      score: 16,
      adds: [
        "research-led consulting",
        "diagnostic services",
        "astrology",
        "deep-tech analysis",
        "transformation advisory",
        "specialised knowledge products",
      ],
      strengthens: [
        "research",
        "consulting",
        "analytics",
        "knowledge monetisation",
      ],
      shadowAdds: [
        "overcomplicating the offer",
        "focusing on depth without commercial simplicity",
      ],
    },
  },
  {
    id: "mercury_mula_career",
    category: "career",
    title: "Mercury in Mula for career",
    description:
      "Mercury in Mula is suited to careers involving investigation, research, diagnosis, strategy, technology, astrology, psychology, risk, audit, or hidden systems.",
    weight: "very_high",
    priority: 95,
    trigger: {
      nakshatra: "Mula",
    },
    effect: {
      score: 14,
      adds: [
        "research",
        "investigation",
        "strategy",
        "technology",
        "astrology",
        "risk analysis",
        "audit",
      ],
      strengthens: [
        "deep research",
        "problem diagnosis",
        "strategic analysis",
      ],
    },
  },
  {
    id: "mercury_mula_spirituality",
    category: "spirituality",
    title: "Mercury in Mula and spiritual inquiry",
    description:
      "Mula directs Mercury toward origins, karmic roots, sacred knowledge, symbolism, and inquiry into what lies beneath appearances.",
    weight: "high",
    priority: 90,
    trigger: {
      nakshatra: "Mula",
    },
    effect: {
      score: 12,
      adds: [
        "astrology",
        "sacred research",
        "karmic inquiry",
        "symbolic interpretation",
        "spiritual investigation",
      ],
    },
  },
];


type MercuryNakshatraDefinition = {
  key: string;
  label: string;
  category: KnowledgeRule["category"];
  description: string;
  adds: string[];
  strengthens?: string[];
  shadows?: string[];
  score?: number;
};

function buildMercuryNakshatraRule(
  definition: MercuryNakshatraDefinition
): KnowledgeRule {
  return {
    id:
      `mercury_nakshatra_${definition.key}`,

    category:
      definition.category,

    title:
      `Mercury in ${definition.label}`,

    description:
      definition.description,

    weight:
      "high",

    priority:
      88,

    trigger: {
      nakshatra:
        definition.label,
    },

    effect: {
      score:
        definition.score ??
        10,

      adds:
        definition.adds,

      strengthens:
        definition.strengthens,

      shadowAdds:
        definition.shadows,
    },
  };
}

const nakshatraExpansionDefinitions:
  MercuryNakshatraDefinition[] = [
  {
    key: "ashwini",
    label: "Ashwini",
    category: "career",
    description:
      "Mercury in Ashwini thinks quickly, initiates rapidly, diagnoses early, and learns through direct experimentation.",
    adds: [
      "rapid learning",
      "diagnostic thinking",
      "initiative",
      "quick problem solving",
    ],
    strengthens: [
      "entrepreneurship",
      "technical response",
    ],
    shadows: [
      "premature conclusions",
      "impatience with detail",
    ],
  },
  {
    key: "bharani",
    label: "Bharani",
    category: "psychology",
    description:
      "Mercury in Bharani examines responsibility, consequence, ethics, boundaries, and difficult transitions.",
    adds: [
      "ethical analysis",
      "boundary awareness",
      "transformational thinking",
      "responsibility",
    ],
    shadows: [
      "mental intensity",
      "judgemental communication",
    ],
  },
  {
    key: "krittika",
    label: "Krittika",
    category: "communication",
    description:
      "Mercury in Krittika separates truth from excess and supports sharp critique, editing, classification, and decisive speech.",
    adds: [
      "critical analysis",
      "editing",
      "classification",
      "decisive speech",
    ],
    shadows: [
      "cutting language",
      "excessive criticism",
    ],
  },
  {
    key: "rohini",
    label: "Rohini",
    category: "business",
    description:
      "Mercury in Rohini supports attractive communication, commercial cultivation, product development, and value creation.",
    adds: [
      "product thinking",
      "commercial communication",
      "creative planning",
      "value creation",
    ],
    strengthens: [
      "branding",
      "customer understanding",
    ],
  },
  {
    key: "mrigashira",
    label: "Mrigashira",
    category: "education",
    description:
      "Mercury in Mrigashira is curious, exploratory, research-oriented, mobile, and continuously searching for better information.",
    adds: [
      "curiosity",
      "exploratory research",
      "information gathering",
      "comparative analysis",
    ],
    shadows: [
      "restless searching",
      "difficulty settling",
    ],
  },
  {
    key: "ardra",
    label: "Ardra",
    category: "career",
    description:
      "Mercury in Ardra penetrates complexity, crisis, technology, disruption, and difficult data.",
    adds: [
      "complex problem solving",
      "technology",
      "crisis analysis",
      "data investigation",
    ],
    strengthens: [
      "research",
      "innovation",
    ],
    shadows: [
      "mental turbulence",
      "destructive argument",
    ],
    score: 12,
  },
  {
    key: "punarvasu",
    label: "Punarvasu",
    category: "education",
    description:
      "Mercury in Punarvasu revises, restores, reframes, teaches, and returns complex ideas to clear principles.",
    adds: [
      "reframing",
      "revision",
      "teaching",
      "conceptual renewal",
    ],
    strengthens: [
      "explanation",
      "knowledge synthesis",
    ],
  },
  {
    key: "pushya",
    label: "Pushya",
    category: "education",
    description:
      "Mercury in Pushya supports disciplined learning, institutional knowledge, mentoring, administration, and responsible advice.",
    adds: [
      "structured learning",
      "mentoring",
      "administration",
      "responsible advice",
    ],
    strengthens: [
      "teaching",
      "governance",
    ],
  },
  {
    key: "ashlesha",
    label: "Ashlesha",
    category: "psychology",
    description:
      "Mercury in Ashlesha understands hidden motives, persuasion, psychology, strategy, confidential systems, and complex speech.",
    adds: [
      "psychological insight",
      "persuasion",
      "confidential analysis",
      "strategic communication",
    ],
    shadows: [
      "manipulation",
      "suspicion",
      "verbal entanglement",
    ],
    score: 12,
  },
  {
    key: "magha",
    label: "Magha",
    category: "career",
    description:
      "Mercury in Magha supports institutional memory, legacy knowledge, administration, lineage-based learning, and authoritative speech.",
    adds: [
      "institutional memory",
      "administration",
      "legacy knowledge",
      "authoritative communication",
    ],
  },
  {
    key: "purva_phalguni",
    label: "Purva Phalguni",
    category: "communication",
    description:
      "Mercury in Purva Phalguni supports creative messaging, entertainment, attraction, social intelligence, and audience engagement.",
    adds: [
      "creative communication",
      "audience engagement",
      "social intelligence",
      "entertainment",
    ],
    strengthens: [
      "media",
      "branding",
    ],
  },
  {
    key: "uttara_phalguni",
    label: "Uttara Phalguni",
    category: "business",
    description:
      "Mercury in Uttara Phalguni supports agreements, service, contracts, organisation, professional reliability, and partnership administration.",
    adds: [
      "contracts",
      "service management",
      "professional organisation",
      "partnership administration",
    ],
    strengthens: [
      "consulting",
      "governance",
    ],
  },
  {
    key: "hasta",
    label: "Hasta",
    category: "career",
    description:
      "Mercury in Hasta supports practical skill, detailed execution, craft, writing, calculation, and hands-on problem solving.",
    adds: [
      "practical intelligence",
      "detailed execution",
      "calculation",
      "technical craft",
    ],
    strengthens: [
      "documentation",
      "process design",
    ],
    score: 12,
  },
  {
    key: "chitra",
    label: "Chitra",
    category: "business",
    description:
      "Mercury in Chitra combines design and logic, supporting architecture, visual systems, technical creativity, branding, and product construction.",
    adds: [
      "design intelligence",
      "architecture",
      "technical creativity",
      "product construction",
    ],
    strengthens: [
      "branding",
      "innovation",
    ],
  },
  {
    key: "swati",
    label: "Swati",
    category: "business",
    description:
      "Mercury in Swati supports trade, independence, negotiation, digital networks, flexibility, and international commerce.",
    adds: [
      "trade",
      "negotiation",
      "digital networks",
      "international commerce",
    ],
    strengthens: [
      "entrepreneurship",
      "adaptability",
    ],
    score: 12,
  },
  {
    key: "vishakha",
    label: "Vishakha",
    category: "career",
    description:
      "Mercury in Vishakha focuses intelligence toward goals, persuasion, strategy, competitive achievement, and long-term positioning.",
    adds: [
      "goal-directed analysis",
      "persuasion",
      "competitive strategy",
      "long-term positioning",
    ],
    shadows: [
      "mental fixation",
      "over-competition",
    ],
  },
  {
    key: "anuradha",
    label: "Anuradha",
    category: "relationships",
    description:
      "Mercury in Anuradha supports collaborative intelligence, loyalty, networks, research partnerships, and diplomatic communication.",
    adds: [
      "collaborative intelligence",
      "network building",
      "research partnerships",
      "diplomacy",
    ],
  },
  {
    key: "jyeshtha",
    label: "Jyeshtha",
    category: "career",
    description:
      "Mercury in Jyeshtha supports senior judgement, confidential intelligence, risk management, protection, strategy, and investigative authority.",
    adds: [
      "senior judgement",
      "confidential intelligence",
      "risk management",
      "investigative strategy",
    ],
    shadows: [
      "defensive thinking",
      "intellectual superiority",
    ],
    score: 12,
  },
  {
    key: "purva_ashadha",
    label: "Purva Ashadha",
    category: "communication",
    description:
      "Mercury in Purva Ashadha supports advocacy, persuasive teaching, publishing, belief-led communication, and campaign thinking.",
    adds: [
      "advocacy",
      "persuasive teaching",
      "publishing",
      "campaign communication",
    ],
    shadows: [
      "argument from belief",
      "resistance to correction",
    ],
  },
  {
    key: "uttara_ashadha",
    label: "Uttara Ashadha",
    category: "career",
    description:
      "Mercury in Uttara Ashadha supports policy, durable planning, governance, principled communication, and institutional strategy.",
    adds: [
      "policy",
      "durable planning",
      "governance",
      "institutional strategy",
    ],
    strengthens: [
      "responsibility",
      "leadership communication",
    ],
  },
  {
    key: "shravana",
    label: "Shravana",
    category: "education",
    description:
      "Mercury in Shravana supports listening, language, oral tradition, learning, counselling, documentation, and knowledge transmission.",
    adds: [
      "deep listening",
      "language learning",
      "counselling",
      "knowledge transmission",
    ],
    strengthens: [
      "teaching",
      "communication",
    ],
    score: 12,
  },
  {
    key: "dhanishtha",
    label: "Dhanishtha",
    category: "business",
    description:
      "Mercury in Dhanishtha supports timing, coordination, networks, resource planning, media rhythm, and commercial organisation.",
    adds: [
      "coordination",
      "resource planning",
      "network intelligence",
      "commercial organisation",
    ],
  },
  {
    key: "shatabhisha",
    label: "Shatabhisha",
    category: "career",
    description:
      "Mercury in Shatabhisha supports systems research, technology, data, diagnostics, healing analysis, and unconventional knowledge.",
    adds: [
      "systems research",
      "technology",
      "data analysis",
      "diagnostics",
      "unconventional knowledge",
    ],
    strengthens: [
      "innovation",
      "research",
    ],
    score: 12,
  },
  {
    key: "purva_bhadrapada",
    label: "Purva Bhadrapada",
    category: "spirituality",
    description:
      "Mercury in Purva Bhadrapada supports philosophical intensity, symbolic thought, reform, occult inquiry, and transformative teaching.",
    adds: [
      "symbolic thought",
      "occult inquiry",
      "reformist thinking",
      "transformative teaching",
    ],
    shadows: [
      "extreme conclusions",
      "intellectual severity",
    ],
  },
  {
    key: "uttara_bhadrapada",
    label: "Uttara Bhadrapada",
    category: "spirituality",
    description:
      "Mercury in Uttara Bhadrapada supports contemplative intelligence, depth, patience, counselling, spiritual study, and stable interpretation.",
    adds: [
      "contemplative intelligence",
      "counselling",
      "spiritual study",
      "stable interpretation",
    ],
  },
  {
    key: "revati",
    label: "Revati",
    category: "communication",
    description:
      "Mercury in Revati supports guidance, navigation, compassionate communication, travel, completion, music, and subtle interpretation.",
    adds: [
      "guidance",
      "navigation",
      "compassionate communication",
      "subtle interpretation",
    ],
    strengthens: [
      "counselling",
      "creative communication",
    ],
  },
];

const nakshatraExpansionRules:
  KnowledgeRule[] =
  nakshatraExpansionDefinitions.map(
    buildMercuryNakshatraRule
  );

const nakshatraPadaRules:
  KnowledgeRule[] = [
  {
    id: "mercury_nakshatra_pada_1",
    category: "career",
    title: "Mercury in first nakshatra pada",
    description:
      "The first pada gives Mercury a more initiating, direct, independent, and action-oriented expression.",
    weight: "medium",
    priority: 70,
    trigger: {
      pada: 1,
    },
    effect: {
      score: 4,
      strengthens: [
        "initiative",
        "independent thinking",
        "rapid application",
      ],
      shadowAdds: [
        "premature expression",
      ],
    },
  },
  {
    id: "mercury_nakshatra_pada_2",
    category: "business",
    title: "Mercury in second nakshatra pada",
    description:
      "The second pada gives Mercury a more practical, productive, commercial, and materially grounded expression.",
    weight: "medium",
    priority: 70,
    trigger: {
      pada: 2,
    },
    effect: {
      score: 5,
      strengthens: [
        "commercial application",
        "practical judgement",
        "value creation",
      ],
    },
  },
  {
    id: "mercury_nakshatra_pada_3",
    category: "communication",
    title: "Mercury in third nakshatra pada",
    description:
      "The third pada gives Mercury a more social, communicative, adaptive, networked, and idea-oriented expression.",
    weight: "medium",
    priority: 70,
    trigger: {
      pada: 3,
    },
    effect: {
      score: 5,
      strengthens: [
        "communication",
        "networking",
        "adaptability",
      ],
    },
  },
  {
    id: "mercury_nakshatra_pada_4",
    category: "psychology",
    title: "Mercury in fourth nakshatra pada",
    description:
      "The fourth pada gives Mercury a more internal, emotional, intuitive, reflective, and meaning-oriented expression.",
    weight: "medium",
    priority: 70,
    trigger: {
      pada: 4,
    },
    effect: {
      score: 4,
      strengthens: [
        "intuition",
        "reflection",
        "audience sensitivity",
      ],
      shadowAdds: [
        "subjective interpretation",
      ],
    },
  },
];

const dispositorExpansionRules:
  KnowledgeRule[] = [
  {
    id: "mercury_dispositor_sun",
    category: "career",
    title: "Mercury disposed by the Sun",
    description:
      "The Sun as dispositor directs Mercury toward authority, administration, leadership, visibility, and strategic communication.",
    weight: "high",
    priority: 88,
    trigger: {
      dispositor: "Sun",
    },
    effect: {
      score: 10,
      adds: [
        "administration",
        "leadership communication",
        "strategy",
        "authority",
      ],
      shadowAdds: [
        "intellectual pride",
      ],
    },
  },
  {
    id: "mercury_dispositor_moon",
    category: "communication",
    title: "Mercury disposed by the Moon",
    description:
      "The Moon as dispositor makes Mercury more receptive, memory-based, emotional, narrative, and audience-sensitive.",
    weight: "high",
    priority: 85,
    trigger: {
      dispositor: "Moon",
    },
    effect: {
      score: 8,
      adds: [
        "memory",
        "storytelling",
        "empathetic communication",
        "audience understanding",
      ],
      shadowAdds: [
        "emotional overthinking",
      ],
    },
  },
  {
    id: "mercury_dispositor_mars",
    category: "career",
    title: "Mercury disposed by Mars",
    description:
      "Mars as dispositor directs Mercury toward engineering, debate, technical execution, decisive analysis, and competitive intelligence.",
    weight: "high",
    priority: 88,
    trigger: {
      dispositor: "Mars",
    },
    effect: {
      score: 10,
      adds: [
        "engineering logic",
        "technical execution",
        "debate",
        "decisive analysis",
      ],
      shadowAdds: [
        "argumentative speech",
        "impatient judgement",
      ],
    },
  },
  {
    id: "mercury_dispositor_mercury",
    category: "strength",
    title: "Mercury self-disposed",
    description:
      "Mercury in its own sign operates with independence, coherence, adaptability, and direct command over its significations.",
    weight: "very_high",
    priority: 95,
    trigger: {
      dispositor: "Mercury",
    },
    effect: {
      score: 16,
      strengthens: [
        "analysis",
        "communication",
        "learning",
        "commerce",
        "adaptability",
      ],
    },
  },
  {
    id: "mercury_dispositor_venus",
    category: "business",
    title: "Mercury disposed by Venus",
    description:
      "Venus as dispositor refines Mercury toward negotiation, design, branding, relationships, value, and commercial presentation.",
    weight: "high",
    priority: 90,
    trigger: {
      dispositor: "Venus",
    },
    effect: {
      score: 12,
      adds: [
        "branding",
        "negotiation",
        "client relations",
        "commercial presentation",
      ],
      strengthens: [
        "marketing",
        "customer understanding",
      ],
    },
  },
  {
    id: "mercury_dispositor_saturn",
    category: "career",
    title: "Mercury disposed by Saturn",
    description:
      "Saturn as dispositor disciplines Mercury toward systems, documentation, compliance, audit, structure, and long-term planning.",
    weight: "very_high",
    priority: 92,
    trigger: {
      dispositor: "Saturn",
    },
    effect: {
      score: 14,
      adds: [
        "systems thinking",
        "documentation",
        "compliance",
        "audit",
        "long-term planning",
      ],
      shadowAdds: [
        "mental heaviness",
        "fear of mistakes",
      ],
    },
  },
  {
    id: "mercury_dispositor_rahu",
    category: "business",
    title: "Mercury disposed by Rahu",
    description:
      "Rahu as dispositor amplifies Mercury toward technology, media, foreign systems, unconventional intelligence, and rapid scaling.",
    weight: "very_high",
    priority: 95,
    trigger: {
      dispositor: "Rahu",
    },
    effect: {
      score: 16,
      adds: [
        "technology",
        "media",
        "foreign systems",
        "unconventional intelligence",
        "digital scale",
      ],
      shadowAdds: [
        "information overload",
        "mental obsession",
      ],
    },
  },
  {
    id: "mercury_dispositor_ketu",
    category: "spirituality",
    title: "Mercury disposed by Ketu",
    description:
      "Ketu as dispositor directs Mercury toward symbolism, coding, hidden knowledge, detached analysis, spiritual study, and research.",
    weight: "very_high",
    priority: 92,
    trigger: {
      dispositor: "Ketu",
    },
    effect: {
      score: 14,
      adds: [
        "symbolism",
        "coding",
        "hidden knowledge",
        "detached analysis",
        "spiritual research",
      ],
      shadowAdds: [
        "over-abstraction",
        "difficulty explaining conclusions",
      ],
    },
  },
];

const vargaRules:
  KnowledgeRule[] = [
  {
    id: "mercury_d9_strong",
    category: "strength",
    title: "Mercury strongly placed in Navamsa",
    description:
      "A strong Mercury in D9 confirms maturity, consistency, judgement, communication, and the deeper sustainability of Mercury's promise.",
    weight: "very_high",
    priority: 95,
    trigger: {
      varga: {
        chart: "D9",
        dignity: "own",
      },
    },
    effect: {
      score: 14,
      strengthens: [
        "mature judgement",
        "communication consistency",
        "relationship intelligence",
        "long-term expression",
      ],
    },
  },
  {
    id: "mercury_d9_exalted",
    category: "strength",
    title: "Exalted Mercury in Navamsa",
    description:
      "Exalted Mercury in D9 strongly confirms discrimination, communication, adaptability, and intellectual maturity.",
    weight: "very_high",
    priority: 100,
    trigger: {
      varga: {
        chart: "D9",
        dignity: "exalted",
      },
    },
    effect: {
      score: 18,
      strengthens: [
        "discrimination",
        "intellectual maturity",
        "communication",
        "analysis",
      ],
    },
  },
  {
    id: "mercury_d10_kendra",
    category: "career",
    title: "Mercury in a D10 kendra",
    description:
      "Mercury in a D10 angular house makes communication, analysis, management, advisory work, or technical intelligence professionally visible.",
    weight: "very_high",
    priority: 95,
    trigger: {
      varga: {
        chart: "D10",
        house: 10,
      },
    },
    effect: {
      score: 18,
      strengthens: [
        "professional communication",
        "consulting",
        "management",
        "technology",
        "career visibility",
      ],
    },
  },
  {
    id: "mercury_d10_first",
    category: "career",
    title: "Mercury in the D10 first house",
    description:
      "Mercury in the D10 first house makes intellectual adaptability and communication central to professional identity.",
    weight: "very_high",
    priority: 92,
    trigger: {
      varga: {
        chart: "D10",
        house: 1,
      },
    },
    effect: {
      score: 16,
      strengthens: [
        "professional identity",
        "adaptability",
        "communication-led career",
      ],
    },
  },
  {
    id: "mercury_d24_strong",
    category: "education",
    title: "Mercury strong in D24",
    description:
      "A strong Mercury in D24 confirms learning ability, technical study, interpretation, writing, and educational accomplishment.",
    weight: "very_high",
    priority: 95,
    trigger: {
      varga: {
        chart: "D24",
        dignity: "own",
      },
    },
    effect: {
      score: 16,
      strengthens: [
        "learning",
        "technical study",
        "writing",
        "interpretation",
      ],
    },
  },
];

const dashaRules:
  KnowledgeRule[] = [
  {
    id: "mercury_current_dasha_activation",
    category: "career",
    title: "Mercury active in the current dasha",
    description:
      "When Mercury is active in the current dasha chain, communication, decisions, learning, commerce, analysis, technology, and Mercury-ruled houses become immediately relevant.",
    weight: "very_high",
    priority: 100,
    trigger: {
      currentDasha: true,
    },
    effect: {
      score: 18,
      strengthens: [
        "communication",
        "learning",
        "analysis",
        "commerce",
        "technology",
        "decision making",
      ],
      notes: [
        "Dasha activation expresses Mercury's natal condition; it does not independently improve a weak Mercury.",
      ],
    },
  },
];

const transitRules:
  KnowledgeRule[] = [
  {
    id: "mercury_current_transit_activation",
    category: "communication",
    title: "Mercury currently activated by transit",
    description:
      "Current Mercury transit activation increases movement around communication, documents, travel, commerce, learning, meetings, and decisions.",
    weight: "high",
    priority: 90,
    trigger: {
      currentTransit: true,
    },
    effect: {
      score: 8,
      adds: [
        "active communication",
        "documents",
        "meetings",
        "short travel",
        "commercial movement",
        "decisions",
      ],
      shadowAdds: [
        "temporary mental overload",
      ],
      notes: [
        "Transit activation is temporary and should be interpreted through natal strength and dasha support.",
      ],
    },
  },
];


const careerRules: KnowledgeRule[] = [
  {
    id: "mercury_career_knowledge_professions",
    category: "career",
    title: "Mercury and knowledge professions",
    description:
      "A strong Mercury supports professions requiring analysis, communication, information management, advisory judgement, or technical skill.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "consulting",
        "analytics",
        "software",
        "finance",
        "writing",
        "teaching",
        "research",
        "administration",
      ],
    },
  },
];

const wealthRules: KnowledgeRule[] = [
  {
    id: "mercury_wealth_commercial_intelligence",
    category: "wealth",
    title: "Mercury and monetisable intelligence",
    description:
      "Mercury creates wealth through knowledge, information, trade, negotiation, communication, and adaptable commercial skill.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "knowledge monetisation",
        "trade",
        "advisory income",
        "technology income",
        "communication income",
      ],
    },
  },
];

const relationshipRules: KnowledgeRule[] = [
  {
    id: "mercury_relationship_communication",
    category: "relationships",
    title: "Mercury in relationships",
    description:
      "Mercury supports connection through conversation, humour, curiosity, friendship, and intellectual exchange.",
    weight: "high",
    priority: 80,
    trigger: {},
    effect: {
      score: 10,
      adds: [
        "conversation",
        "friendship",
        "curiosity",
        "intellectual compatibility",
      ],
      shadowAdds: [
        "over-analysis of emotions",
        "avoidance through logic",
      ],
    },
  },
];

const healthRules: KnowledgeRule[] = [
  {
    id: "mercury_health_nervous_system",
    category: "health",
    title: "Mercury and nervous energy",
    description:
      "Mercury relates to the nervous system, mental processing, speech, coordination, and stress generated by overthinking.",
    weight: "high",
    priority: 80,
    trigger: {},
    effect: {
      score: 0,
      adds: [
        "mental alertness",
        "coordination",
      ],
      shadowAdds: [
        "nervous strain",
        "sleep disruption from thinking",
        "anxiety through information overload",
      ],
    },
  },
];

const spiritualityRules: KnowledgeRule[] = [
  {
    id: "mercury_spiritual_discrimination",
    category: "spirituality",
    title: "Mercury and spiritual discrimination",
    description:
      "Mercury supports scriptural study, interpretation, mantra pronunciation, symbolic knowledge, and discrimination between ideas.",
    weight: "high",
    priority: 80,
    trigger: {},
    effect: {
      score: 10,
      adds: [
        "scriptural study",
        "symbolic interpretation",
        "mantra learning",
        "spiritual discrimination",
      ],
    },
  },
];

const shadowRules: KnowledgeRule[] = [
  {
    id: "mercury_shadow_execution_gap",
    category: "psychology",
    title: "Mercury execution gap",
    description:
      "A highly active Mercury may continue refining, researching, or comparing instead of committing to execution.",
    weight: "high",
    priority: 85,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "delayed execution",
        "constant refinement",
        "too many alternatives",
        "difficulty finalising",
      ],
    },
  },
];

export const MercuryKnowledge: PlanetKnowledge = {
  planet: "Mercury",

  identity,
  signRules,
  houseRules,
  dignityRules,
  conjunctionRules,

  aspectRules,
  dispositorRules: [
    ...dispositorRules,
    ...dispositorExpansionRules,
  ],

nakshatraRules: [],

  /*
   * Deferred until PlanetFact carries canonical avastha data.
   */
  avasthaRules: [],

  vargaRules,
  dashaRules,
  transitRules,

  careerRules,
  businessRules,
  wealthRules,
  relationshipRules,
  healthRules,
  spiritualityRules,
  shadowRules,
};
