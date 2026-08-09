import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "./types";

const identity: KnowledgeRule[] = [
  {
    id: "ketu_identity_detachment",
    category: "identity",
    title: "Ketu as the graha of detachment",
    description:
      "Ketu governs detachment, past mastery, precision, inwardness, spiritual insight, hidden knowledge, separation, diagnosis, and the ability to see beyond surface appearance.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "detachment",
        "past mastery",
        "precision",
        "hidden knowledge",
        "diagnosis",
      ],
      strengthens: [
        "research",
        "specialisation",
        "subtle perception",
      ],
    },
  },
  {
    id: "ketu_identity_business",
    category: "business",
    title: "Ketu in business",
    description:
      "Ketu supports specialised, diagnostic, technical, research-led, spiritual, cybersecurity, audit, healing, and hidden-system businesses.",
    weight: "very_high",
    priority: 98,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "specialised services",
        "diagnostics",
        "research",
        "cybersecurity",
        "audit",
        "spiritual services",
      ],
    },
  },
  {
    id: "ketu_identity_shadow",
    category: "psychology",
    title: "Ketu shadow expression",
    description:
      "An imbalanced Ketu may produce withdrawal, disconnection, indifference, abrupt separation, confusion, loss of motivation, and difficulty explaining insight.",
    weight: "high",
    priority: 92,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "withdrawal",
        "disconnection",
        "indifference",
        "abrupt separation",
        "difficulty explaining insight",
      ],
    },
  },
];

const signRules: KnowledgeRule[] = [
  {
    id: "ketu_aries",
    category: "career",
    title: "Ketu in Aries",
    description:
      "Ketu in Aries internalises courage, action, independence, competition, and identity, supporting precise or solitary execution.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Aries" },
    effect: {
      score: 12,
      adds: [
        "solitary execution",
        "precision",
        "independent action",
        "detached courage",
      ],
      shadowAdds: [
        "sudden aggression",
        "loss of direction",
      ],
    },
  },
  {
    id: "ketu_taurus",
    category: "wealth",
    title: "Ketu in Taurus",
    description:
      "Ketu in Taurus detaches from material security and may produce unusual value systems, specialised finance, or reduced attachment to possessions.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Taurus" },
    effect: {
      score: 12,
      adds: [
        "unusual values",
        "specialised finance",
        "detachment from possessions",
      ],
      shadowAdds: [
        "material dissatisfaction",
        "unstable value perception",
      ],
    },
  },
  {
    id: "ketu_gemini",
    category: "communication",
    title: "Ketu in Gemini",
    description:
      "Ketu in Gemini supports coding, symbolic language, technical writing, analysis, pattern recognition, and detached communication.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Gemini" },
    effect: {
      score: 18,
      adds: [
        "coding",
        "symbolic language",
        "technical writing",
        "pattern recognition",
        "detached analysis",
      ],
      shadowAdds: [
        "communication gaps",
        "difficulty explaining conclusions",
      ],
    },
  },
  {
    id: "ketu_cancer",
    category: "relationships",
    title: "Ketu in Cancer",
    description:
      "Ketu in Cancer may detach from emotional security, family patterns, care, belonging, and inherited emotional habits.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Cancer" },
    effect: {
      score: 10,
      adds: [
        "emotional detachment",
        "ancestral pattern insight",
        "inner sensitivity",
      ],
      shadowAdds: [
        "difficulty receiving care",
        "family disconnection",
      ],
    },
  },
  {
    id: "ketu_leo",
    category: "career",
    title: "Ketu in Leo",
    description:
      "Ketu in Leo detaches from recognition, performance, ego, visibility, and conventional authority while supporting inward mastery.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Leo" },
    effect: {
      score: 10,
      adds: [
        "detached leadership",
        "inner mastery",
        "low-ego authority",
      ],
      shadowAdds: [
        "recognition detachment",
        "identity uncertainty",
      ],
    },
  },
  {
    id: "ketu_virgo",
    category: "career",
    title: "Ketu in Virgo",
    description:
      "Ketu in Virgo strongly supports diagnosis, analytics, health research, audit, technical precision, debugging, and specialisation.",
    weight: "very_high",
    priority: 98,
    trigger: { sign: "Virgo" },
    effect: {
      score: 20,
      adds: [
        "diagnosis",
        "analytics",
        "health research",
        "audit",
        "debugging",
        "technical precision",
      ],
      shadowAdds: [
        "hyper-criticism",
        "detachment from routine",
      ],
    },
  },
  {
    id: "ketu_libra",
    category: "relationships",
    title: "Ketu in Libra",
    description:
      "Ketu in Libra detaches from conventional partnership, social approval, compromise, and relationship expectations.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Libra" },
    effect: {
      score: 10,
      adds: [
        "unconventional partnership",
        "detached negotiation",
        "relationship insight",
      ],
      shadowAdds: [
        "relationship withdrawal",
        "difficulty compromising",
      ],
    },
  },
  {
    id: "ketu_scorpio",
    category: "spirituality",
    title: "Ketu in Scorpio",
    description:
      "Ketu in Scorpio strongly supports occult knowledge, crisis mastery, hidden systems, investigation, transformation, and psychological depth.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Scorpio" },
    effect: {
      score: 22,
      adds: [
        "occult knowledge",
        "crisis mastery",
        "hidden systems",
        "investigation",
        "psychological depth",
      ],
      strengthens: [
        "research",
        "spiritual insight",
        "diagnosis",
      ],
      shadowAdds: [
        "extreme withdrawal",
        "secrecy",
      ],
    },
  },
  {
    id: "ketu_sagittarius",
    category: "spirituality",
    title: "Ketu in Sagittarius",
    description:
      "Ketu in Sagittarius supports spiritual philosophy, scripture, past knowledge, unconventional belief, pilgrimage, and detachment from dogma.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Sagittarius" },
    effect: {
      score: 18,
      adds: [
        "spiritual philosophy",
        "scripture",
        "past knowledge",
        "pilgrimage",
        "detachment from dogma",
      ],
      shadowAdds: [
        "rejection of teachers",
        "belief isolation",
      ],
    },
  },
  {
    id: "ketu_capricorn",
    category: "career",
    title: "Ketu in Capricorn",
    description:
      "Ketu in Capricorn detaches from status and hierarchy while supporting specialised administration, systems, institutions, and hidden responsibility.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Capricorn" },
    effect: {
      score: 14,
      adds: [
        "specialised administration",
        "hidden responsibility",
        "systems",
        "institutional detachment",
      ],
      shadowAdds: [
        "career disengagement",
        "status indifference",
      ],
    },
  },
  {
    id: "ketu_aquarius",
    category: "business",
    title: "Ketu in Aquarius",
    description:
      "Ketu in Aquarius supports technology, networks, cybersecurity, systems research, unconventional communities, and detached innovation.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Aquarius" },
    effect: {
      score: 18,
      adds: [
        "technology",
        "cybersecurity",
        "systems research",
        "networks",
        "detached innovation",
      ],
      shadowAdds: [
        "social detachment",
      ],
    },
  },
  {
    id: "ketu_pisces",
    category: "spirituality",
    title: "Ketu in Pisces",
    description:
      "Ketu in Pisces strongly supports spirituality, surrender, healing, imagination, mysticism, liberation, and subtle perception.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Pisces" },
    effect: {
      score: 22,
      adds: [
        "spirituality",
        "surrender",
        "healing",
        "mysticism",
        "liberation",
        "subtle perception",
      ],
      shadowAdds: [
        "escapism",
        "withdrawal from practical life",
      ],
    },
  },
];

const houseRules: KnowledgeRule[] = [
  {
    id: "ketu_house_1",
    category: "identity",
    title: "Ketu in the first house",
    description:
      "Ketu in the first house creates detachment from conventional identity, supporting introspection, specialisation, subtle perception, and inward mastery.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 1 },
    effect: {
      score: 18,
      adds: [
        "introspection",
        "specialisation",
        "subtle perception",
        "inward mastery",
      ],
      shadowAdds: [
        "identity uncertainty",
        "withdrawal",
      ],
    },
  },
  {
    id: "ketu_house_2",
    category: "wealth",
    title: "Ketu in the second house",
    description:
      "Ketu in the second house may detach from family resources, speech, conventional wealth, and material security while supporting specialised knowledge.",
    weight: "high",
    priority: 88,
    trigger: { house: 2 },
    effect: {
      score: 10,
      adds: [
        "specialised knowledge income",
        "detached speech",
        "unusual values",
      ],
      shadowAdds: [
        "family disconnection",
        "financial detachment",
      ],
    },
  },
  {
    id: "ketu_house_3",
    category: "communication",
    title: "Ketu in the third house",
    description:
      "Ketu in the third house supports technical skills, writing, coding, self-study, independent effort, and detached communication.",
    weight: "high",
    priority: 92,
    trigger: { house: 3 },
    effect: {
      score: 16,
      adds: [
        "technical skills",
        "coding",
        "self-study",
        "independent effort",
        "detached communication",
      ],
    },
  },
  {
    id: "ketu_house_4",
    category: "spirituality",
    title: "Ketu in the fourth house",
    description:
      "Ketu in the fourth house detaches from home, emotional security, property, family patterns, and conventional inner comfort.",
    weight: "high",
    priority: 88,
    trigger: { house: 4 },
    effect: {
      score: 10,
      adds: [
        "inner detachment",
        "ancestral insight",
        "spiritual home",
      ],
      shadowAdds: [
        "domestic disconnection",
        "inner restlessness",
      ],
    },
  },
  {
    id: "ketu_house_5",
    category: "education",
    title: "Ketu in the fifth house",
    description:
      "Ketu in the fifth house supports past knowledge, intuition, mantra, research, unconventional intelligence, and specialised creativity.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 5 },
    effect: {
      score: 18,
      adds: [
        "past knowledge",
        "intuition",
        "mantra",
        "research",
        "unconventional intelligence",
      ],
      shadowAdds: [
        "detachment from recognition",
      ],
    },
  },
  {
    id: "ketu_house_6",
    category: "career",
    title: "Ketu in the sixth house",
    description:
      "Ketu in the sixth house supports diagnosis, hidden enemies, technical service, health analysis, problem solving, and precise defeat of obstacles.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 6 },
    effect: {
      score: 20,
      adds: [
        "diagnosis",
        "technical service",
        "health analysis",
        "problem solving",
        "precision",
      ],
    },
  },
  {
    id: "ketu_house_7",
    category: "relationships",
    title: "Ketu in the seventh house",
    description:
      "Ketu in the seventh house can detach from conventional partnership, public approval, contracts, and relationship expectations.",
    weight: "high",
    priority: 88,
    trigger: { house: 7 },
    effect: {
      score: 10,
      adds: [
        "unconventional partnership",
        "detached consulting",
        "relationship insight",
      ],
      shadowAdds: [
        "partnership withdrawal",
        "difficulty sustaining engagement",
      ],
    },
  },
  {
    id: "ketu_house_8",
    category: "spirituality",
    title: "Ketu in the eighth house",
    description:
      "Ketu in the eighth house strongly supports occult knowledge, hidden systems, crisis mastery, investigation, inheritance research, and transformation.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 8 },
    effect: {
      score: 22,
      adds: [
        "occult knowledge",
        "hidden systems",
        "crisis mastery",
        "investigation",
        "transformation",
      ],
    },
  },
  {
    id: "ketu_house_9",
    category: "spirituality",
    title: "Ketu in the ninth house",
    description:
      "Ketu in the ninth house supports spiritual philosophy, pilgrimage, scripture, unconventional belief, past knowledge, and detachment from formal teachers.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 9 },
    effect: {
      score: 18,
      adds: [
        "spiritual philosophy",
        "pilgrimage",
        "scripture",
        "past knowledge",
        "unconventional belief",
      ],
      shadowAdds: [
        "rejection of teachers",
      ],
    },
  },
  {
    id: "ketu_house_10",
    category: "career",
    title: "Ketu in the tenth house",
    description:
      "Ketu in the tenth house supports specialised careers, hidden work, research, technical mastery, consulting, and detachment from conventional status.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 10 },
    effect: {
      score: 18,
      adds: [
        "specialised career",
        "hidden work",
        "research",
        "technical mastery",
        "consulting",
      ],
      shadowAdds: [
        "career disengagement",
        "status detachment",
      ],
    },
  },
  {
    id: "ketu_house_11",
    category: "wealth",
    title: "Ketu in the eleventh house",
    description:
      "Ketu in the eleventh house may detach from networks, large gains, social approval, and conventional ambitions while supporting niche communities.",
    weight: "high",
    priority: 88,
    trigger: { house: 11 },
    effect: {
      score: 10,
      adds: [
        "niche communities",
        "specialised gains",
        "detached networking",
      ],
      shadowAdds: [
        "network disconnection",
        "reduced interest in status gains",
      ],
    },
  },
  {
    id: "ketu_house_12",
    category: "spirituality",
    title: "Ketu in the twelfth house",
    description:
      "Ketu in the twelfth house strongly supports liberation, retreat, foreign spiritual practice, dreams, isolation, hidden research, and surrender.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 12 },
    effect: {
      score: 22,
      adds: [
        "liberation",
        "retreat",
        "foreign spiritual practice",
        "dreams",
        "hidden research",
        "surrender",
      ],
    },
  },
];

const dignityRules: KnowledgeRule[] = [
  {
    id: "ketu_retrograde",
    category: "psychology",
    title: "Ketu's retrograde motion",
    description:
      "Ketu is naturally retrograde in astronomical calculation; this should not be treated as an exceptional strength or weakness by itself.",
    weight: "low",
    priority: 20,
    trigger: { retrograde: true },
    effect: {
      score: 0,
    },
  },
  {
    id: "ketu_vargottama",
    category: "strength",
    title: "Vargottama Ketu",
    description:
      "Vargottama Ketu strengthens consistency in detachment, research, precision, hidden knowledge, spiritual insight, and specialisation.",
    weight: "very_high",
    priority: 95,
    trigger: { vargottama: true },
    effect: {
      score: 18,
      strengthens: [
        "detachment",
        "research",
        "precision",
        "hidden knowledge",
        "spiritual insight",
      ],
    },
  },
];

const conjunctionRules: KnowledgeRule[] = [
  {
    id: "ketu_conjunct_sun",
    category: "spirituality",
    title: "Ketu conjunct Sun",
    description:
      "Ketu with Sun detaches identity from recognition and supports spiritual authority, research, humility, and unconventional purpose.",
    weight: "high",
    priority: 94,
    trigger: { conjunction: "Sun" },
    effect: {
      score: 14,
      adds: [
        "spiritual authority",
        "research",
        "humility",
        "unconventional purpose",
      ],
      shadowAdds: [
        "identity uncertainty",
        "recognition detachment",
      ],
    },
  },
  {
    id: "ketu_conjunct_moon",
    category: "spirituality",
    title: "Ketu conjunct Moon",
    description:
      "Ketu with Moon supports intuition, subtle perception, spiritual sensitivity, inward emotion, memory of hidden patterns, and detachment.",
    weight: "high",
    priority: 94,
    trigger: { conjunction: "Moon" },
    effect: {
      score: 14,
      adds: [
        "intuition",
        "subtle perception",
        "spiritual sensitivity",
        "hidden-pattern memory",
      ],
      shadowAdds: [
        "emotional withdrawal",
        "difficulty expressing needs",
      ],
    },
  },
  {
    id: "ketu_conjunct_mars",
    category: "career",
    title: "Ketu conjunct Mars",
    description:
      "Ketu with Mars supports precision, surgery, technical depth, hidden action, spiritual discipline, and sudden decisive force.",
    weight: "very_high",
    priority: 96,
    trigger: { conjunction: "Mars" },
    effect: {
      score: 18,
      adds: [
        "precision",
        "surgery",
        "technical depth",
        "hidden action",
        "spiritual discipline",
      ],
      shadowAdds: [
        "sudden aggression",
        "detached conflict",
      ],
    },
  },
  {
    id: "ketu_conjunct_mercury",
    category: "business",
    title: "Ketu conjunct Mercury",
    description:
      "Ketu with Mercury strongly supports coding, symbolic language, astrology, diagnostics, cybersecurity, technical research, and detached analysis.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mercury" },
    effect: {
      score: 22,
      adds: [
        "coding",
        "symbolic language",
        "astrology",
        "diagnostics",
        "cybersecurity",
        "technical research",
      ],
      shadowAdds: [
        "communication gaps",
        "difficulty explaining insight",
      ],
    },
  },
  {
    id: "ketu_conjunct_jupiter",
    category: "spirituality",
    title: "Ketu conjunct Jupiter",
    description:
      "Ketu with Jupiter supports spiritual philosophy, scripture, detachment, occult knowledge, unconventional teaching, and past wisdom.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Jupiter" },
    effect: {
      score: 20,
      adds: [
        "spiritual philosophy",
        "scripture",
        "occult knowledge",
        "unconventional teaching",
        "past wisdom",
      ],
      shadowAdds: [
        "rejection of practical guidance",
        "dogmatic detachment",
      ],
    },
  },
  {
    id: "ketu_conjunct_venus",
    category: "spirituality",
    title: "Ketu conjunct Venus",
    description:
      "Ketu with Venus supports devotional creativity, symbolic art, spiritual love, detached values, and unconventional relationships.",
    weight: "high",
    priority: 94,
    trigger: { conjunction: "Venus" },
    effect: {
      score: 14,
      adds: [
        "devotional creativity",
        "symbolic art",
        "spiritual love",
        "detached values",
      ],
      shadowAdds: [
        "relationship detachment",
        "difficulty sustaining desire",
      ],
    },
  },
  {
    id: "ketu_conjunct_saturn",
    category: "spirituality",
    title: "Ketu conjunct Saturn",
    description:
      "Ketu with Saturn supports austerity, hidden work, spiritual discipline, research, responsibility without recognition, and karmic endurance.",
    weight: "very_high",
    priority: 96,
    trigger: { conjunction: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "austerity",
        "hidden work",
        "spiritual discipline",
        "research",
        "karmic endurance",
      ],
      shadowAdds: [
        "isolation",
        "detachment from results",
      ],
    },
  },
  {
    id: "ketu_conjunct_rahu",
    category: "spirituality",
    title: "Ketu conjunct Rahu",
    description:
      "Rahu and Ketu are always opposite rather than conjunct in a valid chart; this rule exists only as a guard against malformed input.",
    weight: "low",
    priority: 1,
    trigger: { conjunction: "Rahu" },
    effect: {
      score: -20,
      shadowAdds: [
        "invalid nodal conjunction input",
      ],
    },
  },
];

const aspectRules: KnowledgeRule[] = [
  {
    id: "ketu_aspected_by_sun",
    category: "spirituality",
    title: "Sun aspects Ketu",
    description:
      "The Sun gives Ketu purpose, authority, visibility, and direction while challenging detachment from recognition.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Sun" },
    effect: {
      score: 14,
      adds: [
        "purpose",
        "spiritual authority",
        "direction",
        "visible expertise",
      ],
      shadowAdds: [
        "identity conflict",
      ],
    },
  },
  {
    id: "ketu_aspected_by_moon",
    category: "spirituality",
    title: "Moon aspects Ketu",
    description:
      "The Moon gives Ketu intuition, subtle memory, emotional sensitivity, compassion, and inward receptivity.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Moon" },
    effect: {
      score: 14,
      adds: [
        "intuition",
        "subtle memory",
        "emotional sensitivity",
        "inward receptivity",
      ],
    },
  },
  {
    id: "ketu_aspected_by_mars",
    category: "career",
    title: "Mars aspects Ketu",
    description:
      "Mars sharpens Ketu through precision, surgery, technical depth, hidden action, courage, and decisive separation.",
    weight: "very_high",
    priority: 96,
    trigger: { aspectFrom: "Mars" },
    effect: {
      score: 18,
      adds: [
        "precision",
        "surgery",
        "technical depth",
        "hidden action",
        "decisive separation",
      ],
    },
  },
  {
    id: "ketu_aspected_by_mercury",
    category: "business",
    title: "Mercury aspects Ketu",
    description:
      "Mercury sharpens Ketu through coding, symbolic language, diagnostics, cybersecurity, technical research, and analytical explanation.",
    weight: "very_high",
    priority: 100,
    trigger: { aspectFrom: "Mercury" },
    effect: {
      score: 20,
      adds: [
        "coding",
        "symbolic language",
        "diagnostics",
        "cybersecurity",
        "technical research",
      ],
    },
  },
  {
    id: "ketu_aspected_by_jupiter",
    category: "spirituality",
    title: "Jupiter aspects Ketu",
    description:
      "Jupiter guides Ketu toward philosophy, scripture, spiritual teaching, ethics, wisdom, and meaningful detachment.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Jupiter" },
    effect: {
      score: 18,
      adds: [
        "philosophy",
        "scripture",
        "spiritual teaching",
        "ethics",
        "meaningful detachment",
      ],
    },
  },
  {
    id: "ketu_aspected_by_venus",
    category: "spirituality",
    title: "Venus aspects Ketu",
    description:
      "Venus refines Ketu through symbolic art, devotional creativity, spiritual love, healing, and detached values.",
    weight: "high",
    priority: 92,
    trigger: { aspectFrom: "Venus" },
    effect: {
      score: 14,
      adds: [
        "symbolic art",
        "devotional creativity",
        "spiritual love",
        "healing",
        "detached values",
      ],
    },
  },
  {
    id: "ketu_aspected_by_saturn",
    category: "spirituality",
    title: "Saturn aspects Ketu",
    description:
      "Saturn disciplines Ketu through austerity, hidden work, research, spiritual practice, responsibility, and karmic endurance.",
    weight: "very_high",
    priority: 96,
    trigger: { aspectFrom: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "austerity",
        "hidden work",
        "research",
        "spiritual practice",
        "karmic endurance",
      ],
    },
  },
  {
    id: "ketu_aspected_by_rahu",
    category: "spirituality",
    title: "Rahu aspects Ketu",
    description:
      "Rahu's opposition to Ketu highlights the tension between worldly expansion and detachment, desire and release, visibility and inward mastery.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Rahu" },
    effect: {
      score: 10,
      adds: [
        "worldly-spiritual tension",
        "detachment awareness",
        "karmic polarity",
      ],
      shadowAdds: [
        "extreme swings",
      ],
    },
  },
];

const dispositorRules: KnowledgeRule[] = [
  {
    id: "ketu_dispositor_sun",
    category: "spirituality",
    title: "Ketu disposed by Sun",
    description:
      "When the Sun disposes Ketu, detachment seeks purpose, authority, visible expertise, spiritual leadership, and self-knowledge.",
    weight: "high",
    priority: 92,
    trigger: { dispositor: "Sun" },
    effect: {
      score: 14,
      adds: [
        "purpose",
        "spiritual leadership",
        "visible expertise",
        "self-knowledge",
      ],
    },
  },
  {
    id: "ketu_dispositor_moon",
    category: "spirituality",
    title: "Ketu disposed by Moon",
    description:
      "When the Moon disposes Ketu, detachment becomes intuitive, emotional, inward, ancestral, compassionate, and memory-oriented.",
    weight: "high",
    priority: 92,
    trigger: { dispositor: "Moon" },
    effect: {
      score: 14,
      adds: [
        "intuition",
        "ancestral insight",
        "compassion",
        "subtle memory",
        "inward processing",
      ],
    },
  },
  {
    id: "ketu_dispositor_mars",
    category: "career",
    title: "Ketu disposed by Mars",
    description:
      "When Mars disposes Ketu, detachment becomes precise, technical, surgical, courageous, and action-oriented.",
    weight: "very_high",
    priority: 96,
    trigger: { dispositor: "Mars" },
    effect: {
      score: 18,
      adds: [
        "precision",
        "technical depth",
        "surgery",
        "courage",
        "hidden action",
      ],
    },
  },
  {
    id: "ketu_dispositor_mercury",
    category: "business",
    title: "Ketu disposed by Mercury",
    description:
      "When Mercury disposes Ketu, detachment is expressed through coding, symbolic language, diagnostics, cybersecurity, analysis, and technical research.",
    weight: "very_high",
    priority: 100,
    trigger: { dispositor: "Mercury" },
    effect: {
      score: 20,
      adds: [
        "coding",
        "symbolic language",
        "diagnostics",
        "cybersecurity",
        "analysis",
        "technical research",
      ],
    },
  },
  {
    id: "ketu_dispositor_jupiter",
    category: "spirituality",
    title: "Ketu disposed by Jupiter",
    description:
      "When Jupiter disposes Ketu, detachment becomes philosophical, spiritual, ethical, educational, scriptural, and meaning-oriented.",
    weight: "very_high",
    priority: 98,
    trigger: { dispositor: "Jupiter" },
    effect: {
      score: 18,
      adds: [
        "philosophy",
        "spiritual teaching",
        "ethics",
        "scripture",
        "meaningful detachment",
      ],
    },
  },
  {
    id: "ketu_dispositor_venus",
    category: "spirituality",
    title: "Ketu disposed by Venus",
    description:
      "When Venus disposes Ketu, detachment is channelled through symbolic art, devotional creativity, spiritual love, healing, and refined values.",
    weight: "high",
    priority: 94,
    trigger: { dispositor: "Venus" },
    effect: {
      score: 14,
      adds: [
        "symbolic art",
        "devotional creativity",
        "spiritual love",
        "healing",
        "refined values",
      ],
    },
  },
  {
    id: "ketu_dispositor_saturn",
    category: "spirituality",
    title: "Ketu disposed by Saturn",
    description:
      "When Saturn disposes Ketu, detachment becomes austere, disciplined, hidden, research-oriented, responsible, and karmically enduring.",
    weight: "very_high",
    priority: 98,
    trigger: { dispositor: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "austerity",
        "discipline",
        "hidden work",
        "research",
        "karmic endurance",
      ],
    },
  },
];

const businessRules: KnowledgeRule[] = [
  {
    id: "ketu_business_specialisation",
    category: "business",
    title: "Ketu and specialised business",
    description:
      "Ketu favours niche businesses built around diagnosis, technical mastery, research, cybersecurity, audit, astrology, healing, and hidden systems.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "niche expertise",
        "diagnostics",
        "technical mastery",
        "cybersecurity",
        "audit",
        "astrology",
        "healing",
      ],
    },
  },
];

const careerRules: KnowledgeRule[] = [
  {
    id: "ketu_career_specialist_professions",
    category: "career",
    title: "Ketu and specialist professions",
    description:
      "A strong Ketu supports careers involving research, diagnosis, cybersecurity, coding, audit, surgery, occult knowledge, healing, investigation, and hidden work.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "research",
        "diagnosis",
        "cybersecurity",
        "coding",
        "audit",
        "surgery",
        "occult knowledge",
        "investigation",
      ],
    },
  },
];

const wealthRules: KnowledgeRule[] = [
  {
    id: "ketu_wealth_specialised",
    category: "wealth",
    title: "Ketu and wealth through specialisation",
    description:
      "Ketu supports wealth through niche expertise, rare knowledge, diagnostics, technical mastery, research, and specialised services.",
    weight: "high",
    priority: 92,
    trigger: {},
    effect: {
      score: 14,
      adds: [
        "niche expertise",
        "rare knowledge",
        "diagnostics",
        "technical mastery",
        "specialised services",
      ],
    },
  },
];

const relationshipRules: KnowledgeRule[] = [
  {
    id: "ketu_relationship_detachment",
    category: "relationships",
    title: "Ketu in relationships",
    description:
      "Ketu brings detachment, karmic familiarity, spiritual connection, unusual bonds, withdrawal, and reduced interest in conventional relationship patterns.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 10,
      adds: [
        "karmic familiarity",
        "spiritual connection",
        "unusual bonds",
      ],
      shadowAdds: [
        "withdrawal",
        "disconnection",
        "difficulty sustaining engagement",
      ],
    },
  },
];

const healthRules: KnowledgeRule[] = [
  {
    id: "ketu_health_diagnosis",
    category: "health",
    title: "Ketu and hidden health patterns",
    description:
      "Ketu relates to hidden symptoms, unusual diagnosis, surgery, nerve sensitivity, sudden separation, subtle causes, and conditions requiring specialised investigation.",
    weight: "high",
    priority: 88,
    trigger: {},
    effect: {
      score: 0,
      adds: [
        "specialised diagnosis",
        "subtle-cause investigation",
      ],
      shadowAdds: [
        "hard-to-classify symptoms",
        "sudden health shifts",
        "nerve sensitivity",
      ],
    },
  },
];

const spiritualityRules: KnowledgeRule[] = [
  {
    id: "ketu_spiritual_liberation",
    category: "spirituality",
    title: "Ketu and liberation",
    description:
      "Ketu supports liberation, meditation, detachment, past-life mastery, occult knowledge, surrender, subtle perception, and the search beyond material identity.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 20,
      adds: [
        "liberation",
        "meditation",
        "detachment",
        "past-life mastery",
        "occult knowledge",
        "subtle perception",
      ],
    },
  },
];

const shadowRules: KnowledgeRule[] = [
  {
    id: "ketu_shadow_withdrawal",
    category: "psychology",
    title: "Ketu excess",
    description:
      "A highly active Ketu may become withdrawn, indifferent, disconnected, difficult to motivate, abrupt, or unable to translate insight into worldly action.",
    weight: "high",
    priority: 92,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "withdrawal",
        "indifference",
        "disconnection",
        "low motivation",
        "difficulty translating insight into action",
      ],
    },
  },
];

export const KetuKnowledge: PlanetKnowledge = {
  planet: "Ketu",

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
