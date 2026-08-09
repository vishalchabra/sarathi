import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "./types";

const identity: KnowledgeRule[] = [
  {
    id: "jupiter_identity_wisdom",
    category: "identity",
    title: "Jupiter as the graha of wisdom",
    description:
      "Jupiter governs wisdom, meaning, judgement, ethics, faith, guidance, expansion, and the ability to place knowledge within a larger framework.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "wisdom",
        "judgement",
        "ethics",
        "guidance",
        "meaning",
      ],
      strengthens: [
        "knowledge synthesis",
        "long-range thinking",
        "advisory capacity",
      ],
    },
  },
  {
    id: "jupiter_identity_education",
    category: "education",
    title: "Jupiter as teacher",
    description:
      "Jupiter supports education, counselling, philosophy, law, scripture, mentoring, and the transmission of meaningful knowledge.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "teaching",
        "mentoring",
        "philosophy",
        "higher education",
        "counselling",
      ],
    },
  },
  {
    id: "jupiter_identity_wealth",
    category: "wealth",
    title: "Jupiter as a wealth significator",
    description:
      "Jupiter supports prosperity through sound judgement, ethical growth, finance, knowledge, opportunity, networks, and long-term accumulation.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "prosperity",
        "financial judgement",
        "long-term wealth",
        "opportunity",
        "ethical expansion",
      ],
    },
  },
  {
    id: "jupiter_identity_business",
    category: "business",
    title: "Jupiter in business",
    description:
      "Jupiter supports advisory, education, finance, law, consulting, publishing, institutional, and trust-led businesses.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "consulting",
        "education business",
        "financial advisory",
        "law",
        "publishing",
        "institutional services",
      ],
    },
  },
  {
    id: "jupiter_identity_shadow",
    category: "psychology",
    title: "Jupiter shadow expression",
    description:
      "An imbalanced Jupiter can produce overconfidence, excess, moral superiority, unrealistic expansion, and advice without sufficient practical grounding.",
    weight: "high",
    priority: 85,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "overconfidence",
        "excess",
        "moral superiority",
        "unrealistic optimism",
        "overexpansion",
      ],
    },
  },
];

const signRules: KnowledgeRule[] = [
  {
    id: "jupiter_aries",
    category: "career",
    title: "Jupiter in Aries",
    description:
      "Jupiter in Aries expands initiative, leadership, enterprise, courage, and independent judgement.",
    weight: "high",
    priority: 82,
    trigger: { sign: "Aries" },
    effect: {
      score: 10,
      adds: [
        "entrepreneurial leadership",
        "initiative",
        "independent judgement",
        "pioneering guidance",
      ],
      shadowAdds: [
        "overconfidence",
        "premature expansion",
      ],
    },
  },
  {
    id: "jupiter_taurus",
    category: "wealth",
    title: "Jupiter in Taurus",
    description:
      "Jupiter in Taurus supports practical wealth, resources, finance, value creation, stability, and patient growth.",
    weight: "high",
    priority: 85,
    trigger: { sign: "Taurus" },
    effect: {
      score: 12,
      adds: [
        "wealth accumulation",
        "financial stability",
        "resource management",
        "value creation",
      ],
      shadowAdds: [
        "material excess",
        "resistance to change",
      ],
    },
  },
  {
    id: "jupiter_gemini",
    category: "education",
    title: "Jupiter in Gemini",
    description:
      "Jupiter in Gemini broadens learning, writing, communication, networking, and multi-disciplinary knowledge, but may scatter philosophical focus.",
    weight: "medium",
    priority: 78,
    trigger: { sign: "Gemini" },
    effect: {
      score: 8,
      adds: [
        "multi-disciplinary learning",
        "writing",
        "communication",
        "networked knowledge",
      ],
      shadowAdds: [
        "scattered beliefs",
        "too many theories",
        "difficulty reaching depth",
      ],
    },
  },
  {
    id: "jupiter_cancer",
    category: "strength",
    title: "Jupiter in Cancer",
    description:
      "Jupiter in Cancer strongly supports protection, care, emotional wisdom, family guidance, nourishment, and compassionate leadership.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Cancer" },
    effect: {
      score: 22,
      adds: [
        "protective wisdom",
        "compassionate leadership",
        "family guidance",
        "emotional intelligence",
      ],
      strengthens: [
        "counselling",
        "care",
        "ethical judgement",
      ],
    },
  },
  {
    id: "jupiter_leo",
    category: "career",
    title: "Jupiter in Leo",
    description:
      "Jupiter in Leo supports leadership, authority, teaching, confidence, recognition, and generous public influence.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Leo" },
    effect: {
      score: 14,
      adds: [
        "leadership",
        "public teaching",
        "authority",
        "recognition",
        "generosity",
      ],
      shadowAdds: [
        "self-righteousness",
        "need for admiration",
      ],
    },
  },
  {
    id: "jupiter_virgo",
    category: "career",
    title: "Jupiter in Virgo",
    description:
      "Jupiter in Virgo applies wisdom through service, analysis, health, method, improvement, and practical problem solving.",
    weight: "medium",
    priority: 82,
    trigger: { sign: "Virgo" },
    effect: {
      score: 8,
      adds: [
        "practical guidance",
        "service",
        "health knowledge",
        "methodical teaching",
        "process improvement",
      ],
      shadowAdds: [
        "over-analysis of beliefs",
        "criticism replacing faith",
      ],
    },
  },
  {
    id: "jupiter_libra",
    category: "relationships",
    title: "Jupiter in Libra",
    description:
      "Jupiter in Libra supports justice, diplomacy, counselling, partnership wisdom, law, and balanced judgement.",
    weight: "high",
    priority: 85,
    trigger: { sign: "Libra" },
    effect: {
      score: 12,
      adds: [
        "diplomacy",
        "law",
        "partnership guidance",
        "mediation",
        "balanced judgement",
      ],
      shadowAdds: [
        "over-accommodation",
        "indecision disguised as fairness",
      ],
    },
  },
  {
    id: "jupiter_scorpio",
    category: "spirituality",
    title: "Jupiter in Scorpio",
    description:
      "Jupiter in Scorpio expands depth, transformation, occult knowledge, psychology, finance, crisis wisdom, and hidden research.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Scorpio" },
    effect: {
      score: 14,
      adds: [
        "occult knowledge",
        "psychology",
        "transformational guidance",
        "deep finance",
        "hidden research",
      ],
      shadowAdds: [
        "dogmatism",
        "obsession with hidden meanings",
      ],
    },
  },
  {
    id: "jupiter_sagittarius",
    category: "strength",
    title: "Jupiter in Sagittarius",
    description:
      "Jupiter in Sagittarius expresses philosophy, teaching, law, ethics, faith, travel, publishing, and higher knowledge with natural strength.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Sagittarius" },
    effect: {
      score: 22,
      adds: [
        "philosophy",
        "teaching",
        "law",
        "ethics",
        "publishing",
        "higher knowledge",
      ],
      strengthens: [
        "guidance",
        "knowledge synthesis",
        "long-range judgement",
      ],
      shadowAdds: [
        "preaching",
        "overconfidence in beliefs",
      ],
    },
  },
  {
    id: "jupiter_capricorn",
    category: "strength",
    title: "Jupiter in Capricorn",
    description:
      "Jupiter in Capricorn may restrict optimism and expansion, requiring disciplined, realistic, and structured growth.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Capricorn" },
    effect: {
      score: -20,
      adds: [
        "disciplined growth",
        "institutional realism",
        "structured wisdom",
      ],
      weakens: [
        "optimism",
        "expansion",
        "faith in opportunity",
      ],
      shadowAdds: [
        "pessimism",
        "fear of expansion",
        "narrow judgement",
      ],
    },
  },
  {
    id: "jupiter_aquarius",
    category: "business",
    title: "Jupiter in Aquarius",
    description:
      "Jupiter in Aquarius supports social systems, technology, networks, reform, institutions, communities, and future-oriented knowledge.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Aquarius" },
    effect: {
      score: 14,
      adds: [
        "social innovation",
        "technology platforms",
        "community systems",
        "institutional reform",
        "future-oriented knowledge",
      ],
      shadowAdds: [
        "detached idealism",
        "abstract reform without execution",
      ],
    },
  },
  {
    id: "jupiter_pisces",
    category: "spirituality",
    title: "Jupiter in Pisces",
    description:
      "Jupiter in Pisces supports compassion, spirituality, imagination, healing, counselling, surrender, and universal wisdom.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Pisces" },
    effect: {
      score: 20,
      adds: [
        "spiritual wisdom",
        "healing",
        "compassion",
        "counselling",
        "imagination",
      ],
      strengthens: [
        "faith",
        "intuition",
        "guidance",
      ],
      shadowAdds: [
        "poor boundaries",
        "escapism",
        "unrealistic idealism",
      ],
    },
  },
];

const houseRules: KnowledgeRule[] = [
  {
    id: "jupiter_house_1",
    category: "identity",
    title: "Jupiter in the first house",
    description:
      "Jupiter in the first house makes growth, ethics, knowledge, optimism, and guidance central to identity.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 1 },
    effect: {
      score: 18,
      adds: [
        "wise identity",
        "optimism",
        "guidance",
        "ethical presence",
      ],
      shadowAdds: [
        "self-righteousness",
        "overconfidence",
      ],
    },
  },
  {
    id: "jupiter_house_2",
    category: "wealth",
    title: "Jupiter in the second house",
    description:
      "Jupiter in the second house supports wealth, family resources, speech, knowledge, finance, and accumulation.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 2 },
    effect: {
      score: 18,
      adds: [
        "wealth accumulation",
        "financial judgement",
        "knowledge-based income",
        "supportive speech",
      ],
      shadowAdds: [
        "overspending",
        "excessive generosity",
      ],
    },
  },
  {
    id: "jupiter_house_3",
    category: "communication",
    title: "Jupiter in the third house",
    description:
      "Jupiter in the third house supports writing, teaching, communication, enterprise, publishing, and skill development.",
    weight: "high",
    priority: 85,
    trigger: { house: 3 },
    effect: {
      score: 12,
      adds: [
        "writing",
        "teaching",
        "publishing",
        "communication",
        "enterprise",
      ],
      shadowAdds: [
        "overpromising",
        "lecturing rather than listening",
      ],
    },
  },
  {
    id: "jupiter_house_4",
    category: "education",
    title: "Jupiter in the fourth house",
    description:
      "Jupiter in the fourth house supports education, inner stability, property, family guidance, teaching, and a strong knowledge foundation.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 4 },
    effect: {
      score: 18,
      adds: [
        "education",
        "teaching",
        "inner wisdom",
        "property knowledge",
        "family guidance",
      ],
      strengthens: [
        "knowledge foundation",
        "counselling",
        "institutional learning",
      ],
    },
  },
  {
    id: "jupiter_house_5",
    category: "education",
    title: "Jupiter in the fifth house",
    description:
      "Jupiter in the fifth house strongly supports intelligence, teaching, children, creativity, counsel, strategy, mantra, and higher learning.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 5 },
    effect: {
      score: 22,
      adds: [
        "teaching",
        "strategy",
        "creative intelligence",
        "counselling",
        "mantra",
        "higher learning",
      ],
    },
  },
  {
    id: "jupiter_house_6",
    category: "career",
    title: "Jupiter in the sixth house",
    description:
      "Jupiter in the sixth house applies wisdom through service, health, law, disputes, compliance, and problem solving.",
    weight: "medium",
    priority: 82,
    trigger: { house: 6 },
    effect: {
      score: 8,
      adds: [
        "service leadership",
        "health guidance",
        "legal problem solving",
        "compliance",
      ],
      shadowAdds: [
        "overextending in service",
        "moralising conflicts",
      ],
    },
  },
  {
    id: "jupiter_house_7",
    category: "relationships",
    title: "Jupiter in the seventh house",
    description:
      "Jupiter in the seventh house supports counselling, partnerships, contracts, public trust, consulting, and mature relationship judgement.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 7 },
    effect: {
      score: 18,
      adds: [
        "consulting",
        "partnership wisdom",
        "public trust",
        "counselling",
        "contracts",
      ],
      shadowAdds: [
        "idealising partners",
        "over-advising",
      ],
    },
  },
  {
    id: "jupiter_house_8",
    category: "spirituality",
    title: "Jupiter in the eighth house",
    description:
      "Jupiter in the eighth house supports occult knowledge, inheritance, joint finance, psychology, transformation, research, and crisis guidance.",
    weight: "high",
    priority: 90,
    trigger: { house: 8 },
    effect: {
      score: 14,
      adds: [
        "occult knowledge",
        "joint finance",
        "psychology",
        "transformation",
        "deep research",
      ],
      shadowAdds: [
        "hidden excess",
        "overconfidence in risk",
      ],
    },
  },
  {
    id: "jupiter_house_9",
    category: "spirituality",
    title: "Jupiter in the ninth house",
    description:
      "Jupiter in the ninth house strongly supports dharma, higher education, teaching, philosophy, law, pilgrimage, publishing, and guidance.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 9 },
    effect: {
      score: 22,
      adds: [
        "dharma",
        "higher education",
        "teaching",
        "philosophy",
        "law",
        "publishing",
      ],
    },
  },
  {
    id: "jupiter_house_10",
    category: "career",
    title: "Jupiter in the tenth house",
    description:
      "Jupiter in the tenth house supports authority, respected advisory roles, leadership, finance, law, education, policy, and institutional influence.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 10 },
    effect: {
      score: 22,
      adds: [
        "leadership",
        "consulting",
        "finance",
        "law",
        "education",
        "policy",
        "institutional influence",
      ],
      strengthens: [
        "professional respect",
        "ethical authority",
        "public guidance",
      ],
    },
  },
  {
    id: "jupiter_house_11",
    category: "wealth",
    title: "Jupiter in the eleventh house",
    description:
      "Jupiter in the eleventh house supports gains, networks, patrons, opportunities, communities, institutions, and scalable prosperity.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 11 },
    effect: {
      score: 22,
      adds: [
        "gains",
        "networks",
        "patrons",
        "opportunity",
        "community prosperity",
      ],
    },
  },
  {
    id: "jupiter_house_12",
    category: "spirituality",
    title: "Jupiter in the twelfth house",
    description:
      "Jupiter in the twelfth house supports spirituality, charity, foreign institutions, retreat, compassion, research, and liberation-oriented knowledge.",
    weight: "high",
    priority: 88,
    trigger: { house: 12 },
    effect: {
      score: 12,
      adds: [
        "spirituality",
        "charity",
        "foreign institutions",
        "retreat",
        "liberation-oriented knowledge",
      ],
      shadowAdds: [
        "excessive giving",
        "poor financial boundaries",
      ],
    },
  },
];

const dignityRules: KnowledgeRule[] = [
  {
    id: "jupiter_dignity_exalted",
    category: "strength",
    title: "Exalted Jupiter",
    description:
      "Exalted Jupiter strongly supports wisdom, judgement, prosperity, ethics, protection, and guidance.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "exalted" },
    effect: {
      score: 22,
      strengthens: [
        "wisdom",
        "judgement",
        "prosperity",
        "guidance",
        "ethics",
      ],
    },
  },
  {
    id: "jupiter_dignity_own",
    category: "strength",
    title: "Jupiter in own sign",
    description:
      "Jupiter in its own sign expresses knowledge, expansion, ethics, faith, and judgement with natural competence.",
    weight: "very_high",
    priority: 98,
    trigger: { dignity: "own" },
    effect: {
      score: 20,
      strengthens: [
        "knowledge",
        "guidance",
        "faith",
        "judgement",
        "expansion",
      ],
    },
  },
  {
    id: "jupiter_dignity_friend",
    category: "strength",
    title: "Jupiter in friendly dignity",
    description:
      "Friendly dignity supports constructive growth, confidence, learning, and ethical judgement.",
    weight: "high",
    priority: 85,
    trigger: { dignity: "friend" },
    effect: {
      score: 10,
      strengthens: [
        "growth",
        "learning",
        "judgement",
        "guidance",
      ],
    },
  },
  {
    id: "jupiter_dignity_enemy",
    category: "strength",
    title: "Jupiter in inimical dignity",
    description:
      "Inimical dignity can weaken Jupiter through poor judgement, excess, misplaced faith, or difficulty applying wisdom.",
    weight: "high",
    priority: 90,
    trigger: { dignity: "enemy" },
    effect: {
      score: -12,
      weakens: [
        "judgement",
        "ethical clarity",
        "practical wisdom",
      ],
      shadowAdds: [
        "misplaced optimism",
        "poor counsel",
      ],
    },
  },
  {
    id: "jupiter_dignity_debilitated",
    category: "strength",
    title: "Debilitated Jupiter",
    description:
      "Debilitated Jupiter may weaken confidence, judgement, faith, expansion, and ethical clarity unless cancellation or strong support is present.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "debilitated" },
    effect: {
      score: -22,
      weakens: [
        "judgement",
        "faith",
        "expansion",
        "ethical clarity",
      ],
      shadowAdds: [
        "pessimism",
        "poor advice",
        "narrow beliefs",
      ],
    },
  },
  {
    id: "jupiter_retrograde",
    category: "psychology",
    title: "Retrograde Jupiter",
    description:
      "Retrograde Jupiter internalises belief, wisdom, ethics, and guidance, often producing independent philosophical development and repeated review of meaning.",
    weight: "high",
    priority: 88,
    trigger: { retrograde: true },
    effect: {
      score: 2,
      adds: [
        "independent philosophy",
        "inner guidance",
        "revision of beliefs",
        "deep ethical reflection",
      ],
      shadowAdds: [
        "doubt in external teachers",
        "repeated belief revision",
      ],
    },
  },
  {
    id: "jupiter_combust",
    category: "strength",
    title: "Combust Jupiter",
    description:
      "Combustion can reduce independent wisdom and create pressure around judgement, teachers, authority, and confidence.",
    weight: "high",
    priority: 90,
    trigger: { combust: true },
    effect: {
      score: -12,
      weakens: [
        "independent judgement",
        "confidence",
        "guidance",
      ],
      shadowAdds: [
        "authority-dependent beliefs",
        "inflated certainty",
      ],
    },
  },
  {
    id: "jupiter_vargottama",
    category: "strength",
    title: "Vargottama Jupiter",
    description:
      "Vargottama Jupiter gains consistency across natal and navamsa expression, strengthening wisdom, judgement, and guidance.",
    weight: "very_high",
    priority: 95,
    trigger: { vargottama: true },
    effect: {
      score: 18,
      strengthens: [
        "wisdom",
        "judgement",
        "guidance",
        "consistency",
      ],
    },
  },
];

const conjunctionRules: KnowledgeRule[] = [
  {
    id: "jupiter_conjunct_sun",
    category: "career",
    title: "Jupiter conjunct Sun",
    description:
      "Jupiter with the Sun supports leadership, authority, policy, teaching, ethics, recognition, and institutional influence.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Sun" },
    effect: {
      score: 18,
      adds: [
        "leadership",
        "policy",
        "authority",
        "teaching",
        "institutional influence",
      ],
      shadowAdds: [
        "moral pride",
        "self-righteous authority",
      ],
    },
  },
  {
    id: "jupiter_conjunct_moon",
    category: "relationships",
    title: "Jupiter conjunct Moon",
    description:
      "Jupiter with the Moon supports emotional wisdom, care, counselling, generosity, popularity, and protective judgement.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Moon" },
    effect: {
      score: 18,
      adds: [
        "emotional wisdom",
        "counselling",
        "care",
        "generosity",
        "public trust",
      ],
      shadowAdds: [
        "emotional excess",
        "overprotection",
      ],
    },
  },
  {
    id: "jupiter_conjunct_mars",
    category: "business",
    title: "Jupiter conjunct Mars",
    description:
      "Jupiter with Mars supports enterprise, leadership, law, strategy, expansion, technical execution, and confident action.",
    weight: "very_high",
    priority: 95,
    trigger: { conjunction: "Mars" },
    effect: {
      score: 18,
      adds: [
        "enterprise",
        "strategy",
        "leadership",
        "law",
        "expansion",
        "execution",
      ],
      shadowAdds: [
        "overreach",
        "righteous aggression",
      ],
    },
  },
  {
    id: "jupiter_conjunct_mercury",
    category: "education",
    title: "Jupiter conjunct Mercury",
    description:
      "Jupiter with Mercury combines wisdom and intellect, supporting teaching, consulting, finance, law, strategy, publishing, and knowledge systems.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mercury" },
    effect: {
      score: 20,
      adds: [
        "teaching",
        "consulting",
        "finance",
        "law",
        "strategy",
        "publishing",
        "knowledge systems",
      ],
      strengthens: [
        "research synthesis",
        "advisory judgement",
        "explanation",
      ],
      shadowAdds: [
        "excessive theorising",
        "overconfidence in knowledge",
      ],
    },
  },
  {
    id: "jupiter_conjunct_venus",
    category: "wealth",
    title: "Jupiter conjunct Venus",
    description:
      "Jupiter with Venus supports prosperity, education, counselling, culture, finance, luxury, relationships, and value creation.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Venus" },
    effect: {
      score: 20,
      adds: [
        "prosperity",
        "financial value",
        "education",
        "counselling",
        "culture",
        "client trust",
      ],
      shadowAdds: [
        "indulgence",
        "over-spending",
        "idealisation",
      ],
    },
  },
  {
    id: "jupiter_conjunct_saturn",
    category: "career",
    title: "Jupiter conjunct Saturn",
    description:
      "Jupiter with Saturn combines growth and discipline, supporting institutions, policy, law, governance, long-term strategy, and structured expansion.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "governance",
        "policy",
        "institutions",
        "law",
        "long-term strategy",
        "structured expansion",
      ],
      shadowAdds: [
        "conflict between optimism and fear",
        "delayed confidence",
      ],
    },
  },
  {
    id: "jupiter_conjunct_rahu",
    category: "business",
    title: "Jupiter conjunct Rahu",
    description:
      "Jupiter with Rahu can amplify global reach, unconventional knowledge, technology, mass influence, foreign links, and ambitious expansion, while requiring ethical discipline.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Rahu" },
    effect: {
      score: 16,
      adds: [
        "global reach",
        "technology-enabled knowledge",
        "foreign links",
        "mass influence",
        "ambitious expansion",
      ],
      shadowAdds: [
        "distorted judgement",
        "ethical compromise",
        "inflated promises",
      ],
    },
  },
  {
    id: "jupiter_conjunct_ketu",
    category: "spirituality",
    title: "Jupiter conjunct Ketu",
    description:
      "Jupiter with Ketu supports spiritual inquiry, philosophy, scripture, detachment, occult knowledge, and unconventional guidance.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Ketu" },
    effect: {
      score: 18,
      adds: [
        "spiritual inquiry",
        "scripture",
        "detachment",
        "occult knowledge",
        "philosophy",
      ],
      shadowAdds: [
        "rejection of practical guidance",
        "dogmatic detachment",
      ],
    },
  },
];

const aspectRules: KnowledgeRule[] = [
  {
    id: "jupiter_aspected_by_sun",
    category: "career",
    title: "Sun aspects Jupiter",
    description:
      "The Sun gives Jupiter authority, visibility, policy orientation, and confidence in leadership or guidance.",
    weight: "high",
    priority: 88,
    trigger: { aspectFrom: "Sun" },
    effect: {
      score: 12,
      adds: [
        "authority",
        "policy",
        "leadership guidance",
        "visibility",
      ],
      shadowAdds: [
        "moral pride",
      ],
    },
  },
  {
    id: "jupiter_aspected_by_moon",
    category: "relationships",
    title: "Moon aspects Jupiter",
    description:
      "The Moon adds emotional intelligence, care, popularity, and audience sensitivity to Jupiter.",
    weight: "high",
    priority: 86,
    trigger: { aspectFrom: "Moon" },
    effect: {
      score: 12,
      adds: [
        "emotional wisdom",
        "care",
        "public trust",
        "audience sensitivity",
      ],
    },
  },
  {
    id: "jupiter_aspected_by_mars",
    category: "business",
    title: "Mars aspects Jupiter",
    description:
      "Mars energises Jupiter toward enterprise, law, strategy, decisive guidance, and expansion through action.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Mars" },
    effect: {
      score: 14,
      adds: [
        "enterprise",
        "strategy",
        "decisive guidance",
        "execution",
      ],
      shadowAdds: [
        "overreach",
        "righteous aggression",
      ],
    },
  },
  {
    id: "jupiter_aspected_by_mercury",
    category: "education",
    title: "Mercury aspects Jupiter",
    description:
      "Mercury sharpens Jupiter through analysis, writing, explanation, finance, strategy, and intellectual versatility.",
    weight: "very_high",
    priority: 92,
    trigger: { aspectFrom: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "analysis",
        "writing",
        "explanation",
        "finance",
        "strategy",
      ],
      strengthens: [
        "teaching",
        "consulting",
        "knowledge synthesis",
      ],
    },
  },
  {
    id: "jupiter_aspected_by_venus",
    category: "wealth",
    title: "Venus aspects Jupiter",
    description:
      "Venus refines Jupiter through value, relationships, culture, prosperity, diplomacy, and market appeal.",
    weight: "high",
    priority: 88,
    trigger: { aspectFrom: "Venus" },
    effect: {
      score: 14,
      adds: [
        "prosperity",
        "value creation",
        "diplomacy",
        "client trust",
        "culture",
      ],
    },
  },
  {
    id: "jupiter_aspected_by_saturn",
    category: "career",
    title: "Saturn aspects Jupiter",
    description:
      "Saturn disciplines Jupiter, supporting institutions, governance, policy, realism, and long-term structured growth.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Saturn" },
    effect: {
      score: 16,
      adds: [
        "governance",
        "policy",
        "institutional judgement",
        "realism",
        "structured growth",
      ],
      shadowAdds: [
        "restricted optimism",
        "fear of expansion",
      ],
    },
  },
  {
    id: "jupiter_aspected_by_rahu",
    category: "business",
    title: "Rahu aspects Jupiter",
    description:
      "Rahu amplifies Jupiter toward global scale, technology, unconventional knowledge, foreign markets, and mass influence.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Rahu" },
    effect: {
      score: 16,
      adds: [
        "global scale",
        "technology-enabled knowledge",
        "foreign markets",
        "mass influence",
      ],
      shadowAdds: [
        "distorted judgement",
        "inflated promises",
      ],
    },
  },
  {
    id: "jupiter_aspected_by_ketu",
    category: "spirituality",
    title: "Ketu aspects Jupiter",
    description:
      "Ketu turns Jupiter toward detachment, scripture, spiritual inquiry, occult knowledge, and non-conventional wisdom.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Ketu" },
    effect: {
      score: 14,
      adds: [
        "spiritual inquiry",
        "scripture",
        "occult knowledge",
        "detached wisdom",
      ],
      shadowAdds: [
        "rejection of worldly guidance",
      ],
    },
  },
];

const dispositorRules: KnowledgeRule[] = [
  {
    id: "jupiter_dispositor_sun",
    category: "career",
    title: "Jupiter disposed by Sun",
    description:
      "When the Sun disposes Jupiter, wisdom seeks authority, leadership, recognition, governance, and public responsibility.",
    weight: "high",
    priority: 88,
    trigger: { dispositor: "Sun" },
    effect: {
      score: 12,
      adds: [
        "leadership guidance",
        "governance",
        "authority",
        "public responsibility",
      ],
    },
  },
  {
    id: "jupiter_dispositor_moon",
    category: "relationships",
    title: "Jupiter disposed by Moon",
    description:
      "When the Moon disposes Jupiter, guidance becomes nurturing, protective, intuitive, family-oriented, and emotionally responsive.",
    weight: "high",
    priority: 88,
    trigger: { dispositor: "Moon" },
    effect: {
      score: 12,
      adds: [
        "nurturing guidance",
        "emotional wisdom",
        "family counsel",
        "protective judgement",
      ],
    },
  },
  {
    id: "jupiter_dispositor_mars",
    category: "business",
    title: "Jupiter disposed by Mars",
    description:
      "When Mars disposes Jupiter, wisdom becomes action-oriented, strategic, entrepreneurial, technical, and decisive.",
    weight: "high",
    priority: 90,
    trigger: { dispositor: "Mars" },
    effect: {
      score: 14,
      adds: [
        "enterprise",
        "strategy",
        "technical guidance",
        "decisive expansion",
      ],
    },
  },
  {
    id: "jupiter_dispositor_mercury",
    category: "education",
    title: "Jupiter disposed by Mercury",
    description:
      "When Mercury disposes Jupiter, wisdom is expressed through analysis, writing, finance, explanation, consulting, and adaptable knowledge.",
    weight: "very_high",
    priority: 92,
    trigger: { dispositor: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "analysis",
        "writing",
        "finance",
        "consulting",
        "explanation",
      ],
      strengthens: [
        "teaching",
        "knowledge synthesis",
      ],
    },
  },
  {
    id: "jupiter_dispositor_venus",
    category: "wealth",
    title: "Jupiter disposed by Venus",
    description:
      "When Venus disposes Jupiter, wisdom is channelled through value, relationships, finance, culture, diplomacy, beauty, and client trust.",
    weight: "high",
    priority: 90,
    trigger: { dispositor: "Venus" },
    effect: {
      score: 14,
      adds: [
        "value creation",
        "finance",
        "diplomacy",
        "client trust",
        "culture",
      ],
    },
  },
  {
    id: "jupiter_dispositor_saturn",
    category: "career",
    title: "Jupiter disposed by Saturn",
    description:
      "When Saturn disposes Jupiter, growth becomes structured, institutional, disciplined, policy-oriented, and long-term.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Saturn" },
    effect: {
      score: 16,
      adds: [
        "institutional growth",
        "policy",
        "governance",
        "long-term strategy",
        "discipline",
      ],
      shadowAdds: [
        "restricted optimism",
        "slow expansion",
      ],
    },
  },
];

const businessRules: KnowledgeRule[] = [
  {
    id: "jupiter_business_2nd_lord",
    category: "wealth",
    title: "Jupiter ruling the second house",
    description:
      "Jupiter ruling the second house supports wealth through knowledge, finance, guidance, speech, family resources, and ethical accumulation.",
    weight: "very_high",
    priority: 95,
    trigger: { ownsHouse: 2 },
    effect: {
      score: 18,
      strengthens: [
        "wealth accumulation",
        "financial advisory",
        "knowledge income",
      ],
    },
  },
  {
    id: "jupiter_business_5th_lord",
    category: "business",
    title: "Jupiter ruling the fifth house",
    description:
      "Jupiter ruling the fifth house supports teaching, strategy, education, counselling, creativity, and knowledge products.",
    weight: "very_high",
    priority: 95,
    trigger: { ownsHouse: 5 },
    effect: {
      score: 18,
      strengthens: [
        "education business",
        "strategy",
        "teaching",
        "counselling",
        "knowledge products",
      ],
    },
  },
  {
    id: "jupiter_business_9th_lord",
    category: "business",
    title: "Jupiter ruling the ninth house",
    description:
      "Jupiter ruling the ninth house supports advisory, law, publishing, higher education, international knowledge, ethics, and spiritual guidance.",
    weight: "very_high",
    priority: 100,
    trigger: { ownsHouse: 9 },
    effect: {
      score: 20,
      strengthens: [
        "consulting",
        "law",
        "publishing",
        "higher education",
        "international advisory",
        "spiritual guidance",
      ],
    },
  },
  {
    id: "jupiter_business_10th_lord",
    category: "career",
    title: "Jupiter ruling the tenth house",
    description:
      "Jupiter ruling the tenth house ties professional success to leadership, guidance, finance, law, education, policy, and respected advisory work.",
    weight: "very_high",
    priority: 100,
    trigger: { ownsHouse: 10 },
    effect: {
      score: 22,
      strengthens: [
        "leadership",
        "consulting",
        "finance",
        "law",
        "education",
        "policy",
      ],
    },
  },
  {
    id: "jupiter_business_11th_lord",
    category: "wealth",
    title: "Jupiter ruling the eleventh house",
    description:
      "Jupiter ruling the eleventh house supports gains through networks, institutions, patrons, advisory work, education, and scalable opportunity.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 11 },
    effect: {
      score: 20,
      strengthens: [
        "network gains",
        "institutional opportunity",
        "advisory income",
        "scalable prosperity",
      ],
    },
  },
];

const careerRules: KnowledgeRule[] = [
  {
    id: "jupiter_career_knowledge_professions",
    category: "career",
    title: "Jupiter and knowledge professions",
    description:
      "A strong Jupiter supports professions involving guidance, education, finance, law, policy, counselling, leadership, publishing, and institutional judgement.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "consulting",
        "education",
        "finance",
        "law",
        "policy",
        "counselling",
        "leadership",
        "publishing",
      ],
    },
  },
];

const wealthRules: KnowledgeRule[] = [
  {
    id: "jupiter_wealth_expansion",
    category: "wealth",
    title: "Jupiter and sustainable prosperity",
    description:
      "Jupiter supports wealth through opportunity recognition, sound judgement, knowledge, networks, finance, and ethical long-term expansion.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "opportunity recognition",
        "long-term prosperity",
        "financial judgement",
        "network-supported gains",
        "knowledge wealth",
      ],
    },
  },
];

const relationshipRules: KnowledgeRule[] = [
  {
    id: "jupiter_relationship_guidance",
    category: "relationships",
    title: "Jupiter in relationships",
    description:
      "Jupiter supports generosity, maturity, counsel, shared values, faith, protection, and growth within relationships.",
    weight: "high",
    priority: 85,
    trigger: {},
    effect: {
      score: 12,
      adds: [
        "generosity",
        "maturity",
        "shared values",
        "protection",
        "growth",
      ],
      shadowAdds: [
        "over-advising",
        "idealising the relationship",
      ],
    },
  },
];

const healthRules: KnowledgeRule[] = [
  {
    id: "jupiter_health_growth",
    category: "health",
    title: "Jupiter and growth regulation",
    description:
      "Jupiter relates to growth, nourishment, liver function, metabolism, optimism, and the tendency toward excess.",
    weight: "high",
    priority: 80,
    trigger: {},
    effect: {
      score: 0,
      adds: [
        "recovery capacity",
        "nourishment",
        "optimism",
      ],
      shadowAdds: [
        "excess",
        "weight gain",
        "overindulgence",
      ],
    },
  },
];

const spiritualityRules: KnowledgeRule[] = [
  {
    id: "jupiter_spiritual_dharma",
    category: "spirituality",
    title: "Jupiter and dharma",
    description:
      "Jupiter supports faith, philosophy, scripture, teachers, ethics, pilgrimage, mantra, and the search for meaningful direction.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "dharma",
        "faith",
        "philosophy",
        "scripture",
        "teachers",
        "mantra",
      ],
    },
  },
];

const shadowRules: KnowledgeRule[] = [
  {
    id: "jupiter_shadow_excess",
    category: "psychology",
    title: "Jupiter excess",
    description:
      "A highly active Jupiter may over-expand, overpromise, advise without listening, or assume that optimism alone will produce results.",
    weight: "high",
    priority: 88,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "overexpansion",
        "overpromising",
        "advice without listening",
        "unrealistic optimism",
      ],
    },
  },
];

export const JupiterKnowledge: PlanetKnowledge = {
  planet: "Jupiter",

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
