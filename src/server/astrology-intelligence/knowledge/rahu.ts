import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "./types";

const identity: KnowledgeRule[] = [
  {
    id: "rahu_identity_amplification",
    category: "identity",
    title: "Rahu as the amplifier",
    description:
      "Rahu magnifies ambition, desire, experimentation, unconventional thinking, foreign influence, technology, disruption, and the pursuit of scale.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "amplification",
        "ambition",
        "experimentation",
        "unconventional thinking",
        "scale",
      ],
      strengthens: [
        "risk appetite",
        "rapid learning",
        "boundary expansion",
      ],
    },
  },
  {
    id: "rahu_identity_business",
    category: "business",
    title: "Rahu in business",
    description:
      "Rahu supports technology, digital platforms, foreign markets, media, unconventional industries, rapid growth, large audiences, and disruptive business models.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "technology",
        "digital platforms",
        "foreign markets",
        "media",
        "disruptive business models",
        "rapid growth",
      ],
    },
  },
  {
    id: "rahu_identity_shadow",
    category: "psychology",
    title: "Rahu shadow expression",
    description:
      "An imbalanced Rahu may produce obsession, exaggeration, instability, manipulation, ethical compromise, overreach, and dissatisfaction despite achievement.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "obsession",
        "exaggeration",
        "instability",
        "manipulation",
        "ethical compromise",
        "overreach",
      ],
    },
  },
];

const signRules: KnowledgeRule[] = [
  {
    id: "rahu_aries",
    category: "business",
    title: "Rahu in Aries",
    description:
      "Rahu in Aries amplifies initiative, independence, competition, risk-taking, entrepreneurship, and the desire to act first.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Aries" },
    effect: {
      score: 18,
      adds: [
        "entrepreneurship",
        "risk-taking",
        "competitive ambition",
        "first-mover behaviour",
      ],
      shadowAdds: [
        "recklessness",
        "aggressive overreach",
      ],
    },
  },
  {
    id: "rahu_taurus",
    category: "wealth",
    title: "Rahu in Taurus",
    description:
      "Rahu in Taurus amplifies material ambition, wealth, luxury, resources, market value, and attachment to financial security.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Taurus" },
    effect: {
      score: 18,
      adds: [
        "wealth ambition",
        "market value",
        "luxury",
        "resource acquisition",
        "financial scale",
      ],
      shadowAdds: [
        "material obsession",
        "fear of loss",
      ],
    },
  },
  {
    id: "rahu_gemini",
    category: "communication",
    title: "Rahu in Gemini",
    description:
      "Rahu in Gemini amplifies communication, media, technology, marketing, networking, data, and rapid information exchange.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Gemini" },
    effect: {
      score: 20,
      adds: [
        "media",
        "technology",
        "marketing",
        "networking",
        "data",
        "rapid communication",
      ],
      shadowAdds: [
        "information overload",
        "manipulative messaging",
      ],
    },
  },
  {
    id: "rahu_cancer",
    category: "relationships",
    title: "Rahu in Cancer",
    description:
      "Rahu in Cancer amplifies emotional security needs, family ambition, public sensitivity, care, belonging, and attachment.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Cancer" },
    effect: {
      score: 12,
      adds: [
        "public sensitivity",
        "family ambition",
        "emotional influence",
        "care-based appeal",
      ],
      shadowAdds: [
        "emotional dependency",
        "security obsession",
      ],
    },
  },
  {
    id: "rahu_leo",
    category: "career",
    title: "Rahu in Leo",
    description:
      "Rahu in Leo amplifies visibility, leadership, fame, authority, performance, influence, and the desire for recognition.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Leo" },
    effect: {
      score: 18,
      adds: [
        "visibility",
        "leadership ambition",
        "fame",
        "influence",
        "performance",
      ],
      shadowAdds: [
        "ego inflation",
        "recognition obsession",
      ],
    },
  },
  {
    id: "rahu_virgo",
    category: "career",
    title: "Rahu in Virgo",
    description:
      "Rahu in Virgo amplifies analytics, systems, health, detail, optimisation, technology, and problem-solving.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Virgo" },
    effect: {
      score: 18,
      adds: [
        "analytics",
        "systems optimisation",
        "health technology",
        "technical detail",
        "problem solving",
      ],
      shadowAdds: [
        "perfectionism",
        "obsessive analysis",
      ],
    },
  },
  {
    id: "rahu_libra",
    category: "business",
    title: "Rahu in Libra",
    description:
      "Rahu in Libra amplifies partnerships, negotiation, public appeal, branding, contracts, diplomacy, and market relationships.",
    weight: "very_high",
    priority: 95,
    trigger: { sign: "Libra" },
    effect: {
      score: 18,
      adds: [
        "partnership scale",
        "negotiation",
        "branding",
        "contracts",
        "public appeal",
      ],
      shadowAdds: [
        "image manipulation",
        "unstable alliances",
      ],
    },
  },
  {
    id: "rahu_scorpio",
    category: "spirituality",
    title: "Rahu in Scorpio",
    description:
      "Rahu in Scorpio amplifies hidden systems, finance, crisis, occult knowledge, psychology, investigation, and transformation.",
    weight: "very_high",
    priority: 98,
    trigger: { sign: "Scorpio" },
    effect: {
      score: 20,
      adds: [
        "hidden systems",
        "finance",
        "crisis strategy",
        "occult knowledge",
        "investigation",
      ],
      shadowAdds: [
        "control obsession",
        "secrecy",
        "extreme risk",
      ],
    },
  },
  {
    id: "rahu_sagittarius",
    category: "education",
    title: "Rahu in Sagittarius",
    description:
      "Rahu in Sagittarius amplifies belief, global knowledge, philosophy, law, publishing, travel, and unconventional teaching.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Sagittarius" },
    effect: {
      score: 14,
      adds: [
        "global knowledge",
        "publishing",
        "law",
        "international teaching",
        "philosophical ambition",
      ],
      shadowAdds: [
        "dogmatism",
        "exaggerated beliefs",
      ],
    },
  },
  {
    id: "rahu_capricorn",
    category: "career",
    title: "Rahu in Capricorn",
    description:
      "Rahu in Capricorn amplifies corporate ambition, hierarchy, authority, institutions, status, governance, and large-scale achievement.",
    weight: "very_high",
    priority: 98,
    trigger: { sign: "Capricorn" },
    effect: {
      score: 20,
      adds: [
        "corporate ambition",
        "authority",
        "institutions",
        "status",
        "large-scale achievement",
      ],
      shadowAdds: [
        "power obsession",
        "ethical compromise",
      ],
    },
  },
  {
    id: "rahu_aquarius",
    category: "business",
    title: "Rahu in Aquarius",
    description:
      "Rahu in Aquarius strongly supports technology, networks, digital communities, scale, reform, innovation, and mass systems.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Aquarius" },
    effect: {
      score: 22,
      adds: [
        "technology",
        "networks",
        "digital communities",
        "innovation",
        "mass systems",
        "scale",
      ],
      strengthens: [
        "platform business",
        "global reach",
        "disruption",
      ],
    },
  },
  {
    id: "rahu_pisces",
    category: "spirituality",
    title: "Rahu in Pisces",
    description:
      "Rahu in Pisces amplifies imagination, spirituality, media, healing, fantasy, global compassion, and non-linear influence.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Pisces" },
    effect: {
      score: 12,
      adds: [
        "imagination",
        "spiritual media",
        "healing",
        "global compassion",
        "non-linear influence",
      ],
      shadowAdds: [
        "confusion",
        "escapism",
        "illusion",
      ],
    },
  },
];

const houseRules: KnowledgeRule[] = [
  {
    id: "rahu_house_1",
    category: "identity",
    title: "Rahu in the first house",
    description:
      "Rahu in the first house amplifies identity, ambition, unconventional self-expression, visibility, and the desire to stand apart.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 1 },
    effect: {
      score: 20,
      adds: [
        "unconventional identity",
        "visibility",
        "ambition",
        "self-reinvention",
      ],
      shadowAdds: [
        "identity instability",
        "image obsession",
      ],
    },
  },
  {
    id: "rahu_house_2",
    category: "wealth",
    title: "Rahu in the second house",
    description:
      "Rahu in the second house amplifies wealth ambition, speech, family resources, unconventional income, finance, and material desire.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 2 },
    effect: {
      score: 18,
      adds: [
        "wealth ambition",
        "unconventional income",
        "finance",
        "persuasive speech",
        "resource scale",
      ],
      shadowAdds: [
        "financial instability",
        "manipulative speech",
      ],
    },
  },
  {
    id: "rahu_house_3",
    category: "communication",
    title: "Rahu in the third house",
    description:
      "Rahu in the third house strongly supports media, marketing, technology, communication, courage, networking, and self-made enterprise.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 3 },
    effect: {
      score: 22,
      adds: [
        "media",
        "marketing",
        "technology",
        "networking",
        "self-made enterprise",
      ],
    },
  },
  {
    id: "rahu_house_4",
    category: "career",
    title: "Rahu in the fourth house",
    description:
      "Rahu in the fourth house amplifies property, vehicles, technology at home, public sentiment, education, and unconventional foundations.",
    weight: "high",
    priority: 90,
    trigger: { house: 4 },
    effect: {
      score: 14,
      adds: [
        "property",
        "vehicles",
        "education technology",
        "public sentiment",
        "unconventional foundations",
      ],
      shadowAdds: [
        "domestic instability",
        "restlessness",
      ],
    },
  },
  {
    id: "rahu_house_5",
    category: "business",
    title: "Rahu in the fifth house",
    description:
      "Rahu in the fifth house amplifies creativity, speculation, media, entertainment, innovation, education, and unconventional intelligence.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 5 },
    effect: {
      score: 18,
      adds: [
        "innovation",
        "media",
        "entertainment",
        "speculation",
        "unconventional intelligence",
      ],
      shadowAdds: [
        "speculative excess",
        "attention seeking",
      ],
    },
  },
  {
    id: "rahu_house_6",
    category: "career",
    title: "Rahu in the sixth house",
    description:
      "Rahu in the sixth house strongly supports competition, problem solving, service, technology, disputes, compliance complexity, and overcoming obstacles.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 6 },
    effect: {
      score: 22,
      adds: [
        "competition",
        "problem solving",
        "technology service",
        "disputes",
        "regulatory complexity",
        "overcoming obstacles",
      ],
    },
  },
  {
    id: "rahu_house_7",
    category: "business",
    title: "Rahu in the seventh house",
    description:
      "Rahu in the seventh house amplifies partnerships, foreign clients, public dealing, contracts, consulting, and unconventional alliances.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 7 },
    effect: {
      score: 18,
      adds: [
        "foreign clients",
        "partnership scale",
        "public dealing",
        "contracts",
        "unconventional alliances",
      ],
      shadowAdds: [
        "unstable partnerships",
        "transactional relationships",
      ],
    },
  },
  {
    id: "rahu_house_8",
    category: "spirituality",
    title: "Rahu in the eighth house",
    description:
      "Rahu in the eighth house amplifies hidden systems, joint finance, crisis, investigation, transformation, risk, and occult knowledge.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 8 },
    effect: {
      score: 20,
      adds: [
        "hidden systems",
        "joint finance",
        "crisis strategy",
        "investigation",
        "risk",
        "occult knowledge",
      ],
      shadowAdds: [
        "extreme volatility",
        "secrecy",
        "control obsession",
      ],
    },
  },
  {
    id: "rahu_house_9",
    category: "education",
    title: "Rahu in the ninth house",
    description:
      "Rahu in the ninth house amplifies foreign travel, global knowledge, unconventional beliefs, publishing, law, and international education.",
    weight: "very_high",
    priority: 95,
    trigger: { house: 9 },
    effect: {
      score: 18,
      adds: [
        "foreign travel",
        "global knowledge",
        "publishing",
        "law",
        "international education",
      ],
      shadowAdds: [
        "dogmatism",
        "rejection of tradition",
      ],
    },
  },
  {
    id: "rahu_house_10",
    category: "career",
    title: "Rahu in the tenth house",
    description:
      "Rahu in the tenth house strongly supports ambition, public visibility, technology, foreign organisations, unconventional careers, and rapid professional scale.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 10 },
    effect: {
      score: 22,
      adds: [
        "professional ambition",
        "public visibility",
        "technology",
        "foreign organisations",
        "unconventional careers",
        "rapid scale",
      ],
    },
  },
  {
    id: "rahu_house_11",
    category: "wealth",
    title: "Rahu in the eleventh house",
    description:
      "Rahu in the eleventh house strongly supports large networks, gains, digital communities, mass audiences, technology, and scalable opportunity.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 11 },
    effect: {
      score: 22,
      adds: [
        "large networks",
        "gains",
        "digital communities",
        "mass audiences",
        "technology",
        "scalable opportunity",
      ],
    },
  },
  {
    id: "rahu_house_12",
    category: "spirituality",
    title: "Rahu in the twelfth house",
    description:
      "Rahu in the twelfth house amplifies foreign lands, hidden institutions, media, isolation, expenses, spirituality, and work behind the scenes.",
    weight: "high",
    priority: 90,
    trigger: { house: 12 },
    effect: {
      score: 14,
      adds: [
        "foreign lands",
        "hidden institutions",
        "media",
        "behind-the-scenes work",
        "spiritual experimentation",
      ],
      shadowAdds: [
        "uncontrolled expenses",
        "isolation",
        "escapism",
      ],
    },
  },
];

const dignityRules: KnowledgeRule[] = [
  {
    id: "rahu_retrograde",
    category: "psychology",
    title: "Rahu's retrograde motion",
    description:
      "Rahu is naturally retrograde in astronomical calculation; this should not be treated as an exceptional strength or weakness by itself.",
    weight: "low",
    priority: 20,
    trigger: { retrograde: true },
    effect: {
      score: 0,
    },
  },
  {
    id: "rahu_vargottama",
    category: "strength",
    title: "Vargottama Rahu",
    description:
      "Vargottama Rahu strengthens consistency in ambition, disruption, foreign influence, technology, and unconventional expression.",
    weight: "very_high",
    priority: 95,
    trigger: { vargottama: true },
    effect: {
      score: 18,
      strengthens: [
        "ambition",
        "technology",
        "foreign influence",
        "disruption",
        "consistency",
      ],
    },
  },
];

const conjunctionRules: KnowledgeRule[] = [
  {
    id: "rahu_conjunct_sun",
    category: "career",
    title: "Rahu conjunct Sun",
    description:
      "Rahu with the Sun amplifies ambition, visibility, authority, politics, leadership, foreign influence, and the desire for recognition.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Sun" },
    effect: {
      score: 18,
      adds: [
        "visibility",
        "authority",
        "politics",
        "leadership ambition",
        "foreign influence",
      ],
      shadowAdds: [
        "ego inflation",
        "authority conflict",
      ],
    },
  },
  {
    id: "rahu_conjunct_moon",
    category: "psychology",
    title: "Rahu conjunct Moon",
    description:
      "Rahu with the Moon amplifies imagination, public sensitivity, media appeal, emotional intensity, and instability.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Moon" },
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
    id: "rahu_conjunct_mars",
    category: "business",
    title: "Rahu conjunct Mars",
    description:
      "Rahu with Mars amplifies ambition, technology, machinery, competition, foreign expansion, risk, and unconventional execution.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mars" },
    effect: {
      score: 20,
      adds: [
        "aggressive expansion",
        "technology",
        "machinery",
        "competition",
        "foreign operations",
        "unconventional execution",
      ],
      shadowAdds: [
        "recklessness",
        "accident risk",
        "ethical compromise",
      ],
    },
  },
  {
    id: "rahu_conjunct_mercury",
    category: "business",
    title: "Rahu conjunct Mercury",
    description:
      "Rahu with Mercury strongly supports technology, AI, media, digital platforms, marketing, data, foreign communication, and unconventional intelligence.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mercury" },
    effect: {
      score: 22,
      adds: [
        "technology",
        "AI",
        "media",
        "digital platforms",
        "marketing",
        "data",
        "foreign communication",
      ],
      shadowAdds: [
        "information overload",
        "manipulative communication",
      ],
    },
  },
  {
    id: "rahu_conjunct_jupiter",
    category: "business",
    title: "Rahu conjunct Jupiter",
    description:
      "Rahu with Jupiter amplifies global knowledge, finance, law, education, technology-enabled guidance, mass influence, and ambitious expansion.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Jupiter" },
    effect: {
      score: 20,
      adds: [
        "global knowledge",
        "finance",
        "law",
        "technology-enabled guidance",
        "mass influence",
        "ambitious expansion",
      ],
      shadowAdds: [
        "distorted judgement",
        "inflated promises",
        "ethical compromise",
      ],
    },
  },
  {
    id: "rahu_conjunct_venus",
    category: "business",
    title: "Rahu conjunct Venus",
    description:
      "Rahu with Venus amplifies branding, luxury, digital appeal, media, foreign markets, mass attraction, and unconventional relationships.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Venus" },
    effect: {
      score: 20,
      adds: [
        "branding",
        "luxury",
        "digital appeal",
        "media",
        "foreign markets",
        "mass attraction",
      ],
      shadowAdds: [
        "image obsession",
        "unstable desires",
        "excess",
      ],
    },
  },
  {
    id: "rahu_conjunct_saturn",
    category: "business",
    title: "Rahu conjunct Saturn",
    description:
      "Rahu with Saturn supports large systems, technology, foreign institutions, mass operations, regulatory complexity, ambition, and unconventional scale.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Saturn" },
    effect: {
      score: 20,
      adds: [
        "large systems",
        "technology",
        "foreign institutions",
        "mass operations",
        "regulatory complexity",
        "unconventional scale",
      ],
      shadowAdds: [
        "control obsession",
        "fear-driven ambition",
        "ethical pressure",
      ],
    },
  },
  {
    id: "rahu_conjunct_ketu",
    category: "spirituality",
    title: "Rahu conjunct Ketu",
    description:
      "Rahu and Ketu are always opposite rather than conjunct in a valid chart; this rule exists only as a guard against malformed input.",
    weight: "low",
    priority: 1,
    trigger: { conjunction: "Ketu" },
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
    id: "rahu_aspected_by_sun",
    category: "career",
    title: "Sun aspects Rahu",
    description:
      "The Sun gives Rahu visibility, authority, politics, leadership, and public ambition.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Sun" },
    effect: {
      score: 14,
      adds: [
        "visibility",
        "authority",
        "politics",
        "leadership ambition",
      ],
      shadowAdds: [
        "ego inflation",
      ],
    },
  },
  {
    id: "rahu_aspected_by_moon",
    category: "psychology",
    title: "Moon aspects Rahu",
    description:
      "The Moon adds emotional intensity, media sensitivity, public influence, and imaginative reach to Rahu.",
    weight: "high",
    priority: 88,
    trigger: { aspectFrom: "Moon" },
    effect: {
      score: 12,
      adds: [
        "media sensitivity",
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
    id: "rahu_aspected_by_mars",
    category: "business",
    title: "Mars aspects Rahu",
    description:
      "Mars energises Rahu toward technology, machinery, competition, foreign expansion, risk, and unconventional execution.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Mars" },
    effect: {
      score: 18,
      adds: [
        "technology",
        "machinery",
        "competition",
        "foreign expansion",
        "unconventional execution",
      ],
      shadowAdds: [
        "recklessness",
        "accident risk",
      ],
    },
  },
  {
    id: "rahu_aspected_by_mercury",
    category: "business",
    title: "Mercury aspects Rahu",
    description:
      "Mercury sharpens Rahu through technology, AI, data, media, marketing, digital platforms, and foreign communication.",
    weight: "very_high",
    priority: 100,
    trigger: { aspectFrom: "Mercury" },
    effect: {
      score: 20,
      adds: [
        "technology",
        "AI",
        "data",
        "media",
        "marketing",
        "digital platforms",
      ],
    },
  },
  {
    id: "rahu_aspected_by_jupiter",
    category: "business",
    title: "Jupiter aspects Rahu",
    description:
      "Jupiter guides Rahu toward global knowledge, law, finance, education, strategy, ethics, and large-scale advisory work.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Jupiter" },
    effect: {
      score: 18,
      adds: [
        "global knowledge",
        "law",
        "finance",
        "education",
        "strategy",
        "large-scale advisory",
      ],
      shadowAdds: [
        "inflated promises",
      ],
    },
  },
  {
    id: "rahu_aspected_by_venus",
    category: "business",
    title: "Venus aspects Rahu",
    description:
      "Venus refines Rahu through branding, media, luxury, digital attraction, foreign markets, and mass appeal.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Venus" },
    effect: {
      score: 18,
      adds: [
        "branding",
        "media",
        "luxury",
        "digital attraction",
        "foreign markets",
        "mass appeal",
      ],
    },
  },
  {
    id: "rahu_aspected_by_saturn",
    category: "business",
    title: "Saturn aspects Rahu",
    description:
      "Saturn structures Rahu through large systems, regulation, institutions, compliance, operations, and controlled scale.",
    weight: "very_high",
    priority: 100,
    trigger: { aspectFrom: "Saturn" },
    effect: {
      score: 20,
      adds: [
        "large systems",
        "regulation",
        "institutions",
        "compliance",
        "operations",
        "controlled scale",
      ],
      shadowAdds: [
        "control obsession",
        "fear-driven ambition",
      ],
    },
  },
  {
    id: "rahu_aspected_by_ketu",
    category: "spirituality",
    title: "Ketu aspects Rahu",
    description:
      "Ketu's opposition to Rahu highlights the tension between worldly expansion and detachment, material ambition and inner release.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Ketu" },
    effect: {
      score: 10,
      adds: [
        "worldly-spiritual tension",
        "detachment awareness",
        "karmic polarity",
      ],
      shadowAdds: [
        "extreme swings",
        "difficulty finding balance",
      ],
    },
  },
];

const dispositorRules: KnowledgeRule[] = [
  {
    id: "rahu_dispositor_sun",
    category: "career",
    title: "Rahu disposed by Sun",
    description:
      "When the Sun disposes Rahu, ambition seeks visibility, leadership, authority, politics, recognition, and public influence.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Sun" },
    effect: {
      score: 18,
      adds: [
        "visibility",
        "leadership",
        "authority",
        "politics",
        "public influence",
      ],
    },
  },
  {
    id: "rahu_dispositor_moon",
    category: "relationships",
    title: "Rahu disposed by Moon",
    description:
      "When the Moon disposes Rahu, ambition is channelled through public emotion, care, family, audience sensitivity, and mass psychology.",
    weight: "high",
    priority: 90,
    trigger: { dispositor: "Moon" },
    effect: {
      score: 14,
      adds: [
        "mass psychology",
        "audience sensitivity",
        "public emotion",
        "care-based influence",
      ],
      shadowAdds: [
        "emotional instability",
      ],
    },
  },
  {
    id: "rahu_dispositor_mars",
    category: "business",
    title: "Rahu disposed by Mars",
    description:
      "When Mars disposes Rahu, ambition becomes competitive, technical, entrepreneurial, aggressive, and execution-oriented.",
    weight: "very_high",
    priority: 98,
    trigger: { dispositor: "Mars" },
    effect: {
      score: 20,
      adds: [
        "competition",
        "technology",
        "entrepreneurship",
        "aggressive expansion",
        "execution",
      ],
      shadowAdds: [
        "recklessness",
      ],
    },
  },
  {
    id: "rahu_dispositor_mercury",
    category: "business",
    title: "Rahu disposed by Mercury",
    description:
      "When Mercury disposes Rahu, ambition is expressed through technology, AI, media, marketing, data, digital platforms, and foreign communication.",
    weight: "very_high",
    priority: 100,
    trigger: { dispositor: "Mercury" },
    effect: {
      score: 22,
      adds: [
        "technology",
        "AI",
        "media",
        "marketing",
        "data",
        "digital platforms",
      ],
    },
  },
  {
    id: "rahu_dispositor_jupiter",
    category: "business",
    title: "Rahu disposed by Jupiter",
    description:
      "When Jupiter disposes Rahu, ambition becomes global, advisory, educational, financial, legal, philosophical, and scale-oriented.",
    weight: "very_high",
    priority: 100,
    trigger: { dispositor: "Jupiter" },
    effect: {
      score: 22,
      adds: [
        "global advisory",
        "education",
        "finance",
        "law",
        "philosophy",
        "scale",
      ],
      shadowAdds: [
        "inflated promises",
        "ethical pressure",
      ],
    },
  },
  {
    id: "rahu_dispositor_venus",
    category: "business",
    title: "Rahu disposed by Venus",
    description:
      "When Venus disposes Rahu, ambition is channelled through branding, luxury, relationships, media, foreign markets, attraction, and customer appeal.",
    weight: "very_high",
    priority: 100,
    trigger: { dispositor: "Venus" },
    effect: {
      score: 22,
      adds: [
        "branding",
        "luxury",
        "media",
        "foreign markets",
        "customer appeal",
        "mass attraction",
      ],
    },
  },
  {
    id: "rahu_dispositor_saturn",
    category: "business",
    title: "Rahu disposed by Saturn",
    description:
      "When Saturn disposes Rahu, ambition is channelled through institutions, technology, systems, regulation, operations, compliance, and controlled scale.",
    weight: "very_high",
    priority: 100,
    trigger: { dispositor: "Saturn" },
    effect: {
      score: 22,
      adds: [
        "institutions",
        "technology",
        "systems",
        "regulation",
        "operations",
        "controlled scale",
      ],
      shadowAdds: [
        "control obsession",
        "fear-driven ambition",
      ],
    },
  },
];

const businessRules: KnowledgeRule[] = [
  {
    id: "rahu_business_3rd_house_owner_proxy",
    category: "business",
    title: "Rahu and entrepreneurial houses",
    description:
      "Rahu strongly amplifies business when connected to houses of enterprise, creativity, partnership, profession, or gains.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "entrepreneurship",
        "innovation",
        "partnership scale",
        "professional ambition",
        "network gains",
      ],
    },
  },
];

const careerRules: KnowledgeRule[] = [
  {
    id: "rahu_career_disruptive_professions",
    category: "career",
    title: "Rahu and disruptive professions",
    description:
      "A strong Rahu supports careers involving technology, AI, media, foreign markets, digital platforms, politics, unconventional industries, mass audiences, and disruption.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "technology",
        "AI",
        "media",
        "foreign markets",
        "digital platforms",
        "politics",
        "disruption",
      ],
    },
  },
];

const wealthRules: KnowledgeRule[] = [
  {
    id: "rahu_wealth_scale",
    category: "wealth",
    title: "Rahu and wealth through scale",
    description:
      "Rahu supports wealth through technology, foreign markets, large audiences, unconventional opportunities, networks, media, and rapid expansion.",
    weight: "very_high",
    priority: 98,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "technology wealth",
        "foreign markets",
        "large audiences",
        "network gains",
        "rapid expansion",
      ],
    },
  },
];

const relationshipRules: KnowledgeRule[] = [
  {
    id: "rahu_relationship_unconventional",
    category: "relationships",
    title: "Rahu in relationships",
    description:
      "Rahu brings attraction to the unfamiliar, foreign, unconventional, intense, ambitious, or socially different in relationships.",
    weight: "high",
    priority: 88,
    trigger: {},
    effect: {
      score: 10,
      adds: [
        "unconventional attraction",
        "foreign connections",
        "intensity",
        "social difference",
      ],
      shadowAdds: [
        "obsession",
        "instability",
        "idealisation",
      ],
    },
  },
];

const healthRules: KnowledgeRule[] = [
  {
    id: "rahu_health_toxicity",
    category: "health",
    title: "Rahu and irregular health patterns",
    description:
      "Rahu relates to toxins, addictions, unusual symptoms, anxiety, technological overstimulation, irregular habits, and conditions that are difficult to classify.",
    weight: "high",
    priority: 85,
    trigger: {},
    effect: {
      score: 0,
      adds: [
        "unusual diagnosis",
        "sensitivity to overstimulation",
      ],
      shadowAdds: [
        "addiction",
        "anxiety",
        "toxicity",
        "irregular habits",
      ],
    },
  },
];

const spiritualityRules: KnowledgeRule[] = [
  {
    id: "rahu_spiritual_unconventional",
    category: "spirituality",
    title: "Rahu and unconventional spirituality",
    description:
      "Rahu supports foreign traditions, taboo subjects, occult experimentation, intense desire for answers, and spiritual paths outside convention.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 12,
      adds: [
        "foreign traditions",
        "occult experimentation",
        "taboo inquiry",
        "unconventional spirituality",
      ],
    },
  },
];

const shadowRules: KnowledgeRule[] = [
  {
    id: "rahu_shadow_overreach",
    category: "psychology",
    title: "Rahu excess",
    description:
      "A highly active Rahu may become obsessive, manipulative, unstable, ethically compromised, dissatisfied, or addicted to expansion and recognition.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "obsession",
        "manipulation",
        "instability",
        "ethical compromise",
        "dissatisfaction",
        "addiction to expansion",
      ],
    },
  },
];

export const RahuKnowledge: PlanetKnowledge = {
  planet: "Rahu",

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
