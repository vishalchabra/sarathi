import type {
  KnowledgeRule,
  PlanetKnowledge,
} from "./types";

const identity: KnowledgeRule[] = [
  {
    id: "mars_identity_action",
    category: "identity",
    title: "Mars as the graha of action",
    description:
      "Mars governs action, courage, initiative, competition, force, technical ability, conflict, stamina, and the capacity to execute.",
    weight: "very_high",
    priority: 100,
    trigger: {},
    effect: {
      score: 18,
      adds: [
        "initiative",
        "courage",
        "execution",
        "technical ability",
        "competitive drive",
      ],
      strengthens: [
        "decisiveness",
        "problem solving",
        "operational energy",
      ],
    },
  },
  {
    id: "mars_identity_business",
    category: "business",
    title: "Mars in business",
    description:
      "Mars supports entrepreneurship, engineering, machinery, operations, construction, manufacturing, sales drive, and businesses requiring decisive execution.",
    weight: "very_high",
    priority: 98,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "entrepreneurship",
        "engineering",
        "manufacturing",
        "operations",
        "construction",
        "sales drive",
      ],
    },
  },
  {
    id: "mars_identity_shadow",
    category: "psychology",
    title: "Mars shadow expression",
    description:
      "An imbalanced Mars can produce impatience, aggression, impulsiveness, conflict, domination, and action without sufficient judgement.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "impatience",
        "aggression",
        "impulsiveness",
        "conflict",
        "domination",
      ],
    },
  },
];

const signRules: KnowledgeRule[] = [
  {
    id: "mars_aries",
    category: "strength",
    title: "Mars in Aries",
    description:
      "Mars in Aries supports initiative, leadership, courage, entrepreneurship, competition, and direct execution.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Aries" },
    effect: {
      score: 20,
      adds: [
        "initiative",
        "entrepreneurship",
        "leadership",
        "competition",
        "direct execution",
      ],
      strengthens: [
        "courage",
        "decisiveness",
      ],
      shadowAdds: [
        "impatience",
        "recklessness",
      ],
    },
  },
  {
    id: "mars_taurus",
    category: "business",
    title: "Mars in Taurus",
    description:
      "Mars in Taurus applies energy steadily through resources, finance, land, production, persistence, and material execution.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Taurus" },
    effect: {
      score: 12,
      adds: [
        "persistent execution",
        "resource building",
        "production",
        "land",
        "material operations",
      ],
      shadowAdds: [
        "stubborn conflict",
        "slow anger",
      ],
    },
  },
  {
    id: "mars_gemini",
    category: "communication",
    title: "Mars in Gemini",
    description:
      "Mars in Gemini energises debate, sales, communication, technology, multitasking, and tactical intelligence.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Gemini" },
    effect: {
      score: 12,
      adds: [
        "sales drive",
        "debate",
        "tactical communication",
        "technology",
        "rapid problem solving",
      ],
      shadowAdds: [
        "argumentative speech",
        "scattered effort",
      ],
    },
  },
  {
    id: "mars_cancer",
    category: "strength",
    title: "Mars in Cancer",
    description:
      "Mars in Cancer may weaken direct action by mixing anger, protection, emotion, and defensiveness.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Cancer" },
    effect: {
      score: -20,
      adds: [
        "protective action",
        "family defence",
        "emotional courage",
      ],
      weakens: [
        "direct execution",
        "consistent aggression",
        "objective conflict handling",
      ],
      shadowAdds: [
        "defensiveness",
        "passive aggression",
        "emotional volatility",
      ],
    },
  },
  {
    id: "mars_leo",
    category: "career",
    title: "Mars in Leo",
    description:
      "Mars in Leo supports leadership, command, courage, visibility, performance, authority, and competitive ambition.",
    weight: "high",
    priority: 92,
    trigger: { sign: "Leo" },
    effect: {
      score: 14,
      adds: [
        "command",
        "leadership",
        "competitive ambition",
        "authority",
        "visible execution",
      ],
      shadowAdds: [
        "ego conflict",
        "domineering behaviour",
      ],
    },
  },
  {
    id: "mars_virgo",
    category: "career",
    title: "Mars in Virgo",
    description:
      "Mars in Virgo applies energy through analysis, repair, service, health, technical detail, operations, and process improvement.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Virgo" },
    effect: {
      score: 14,
      adds: [
        "technical analysis",
        "repair",
        "process improvement",
        "service execution",
        "operational detail",
      ],
      shadowAdds: [
        "critical aggression",
        "perfectionistic frustration",
      ],
    },
  },
  {
    id: "mars_libra",
    category: "relationships",
    title: "Mars in Libra",
    description:
      "Mars in Libra directs action through negotiation, partnership, strategy, contracts, and balancing competing interests.",
    weight: "high",
    priority: 88,
    trigger: { sign: "Libra" },
    effect: {
      score: 12,
      adds: [
        "strategic negotiation",
        "partnership action",
        "contract execution",
        "competitive diplomacy",
      ],
      shadowAdds: [
        "conflict through indecision",
        "passive competition",
      ],
    },
  },
  {
    id: "mars_scorpio",
    category: "strength",
    title: "Mars in Scorpio",
    description:
      "Mars in Scorpio supports intensity, strategy, resilience, investigation, crisis response, transformation, and controlled power.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Scorpio" },
    effect: {
      score: 20,
      adds: [
        "strategic power",
        "investigation",
        "resilience",
        "crisis response",
        "transformation",
      ],
      strengthens: [
        "focus",
        "courage",
        "endurance",
      ],
      shadowAdds: [
        "control",
        "revenge",
        "hidden aggression",
      ],
    },
  },
  {
    id: "mars_sagittarius",
    category: "career",
    title: "Mars in Sagittarius",
    description:
      "Mars in Sagittarius acts through belief, law, travel, teaching, strategy, expansion, and mission-driven execution.",
    weight: "high",
    priority: 90,
    trigger: { sign: "Sagittarius" },
    effect: {
      score: 14,
      adds: [
        "mission-driven action",
        "strategy",
        "law",
        "expansion",
        "teaching through action",
      ],
      shadowAdds: [
        "righteous aggression",
        "reckless conviction",
      ],
    },
  },
  {
    id: "mars_capricorn",
    category: "strength",
    title: "Mars in Capricorn",
    description:
      "Mars in Capricorn strongly supports disciplined execution, engineering, management, organisation, endurance, and result-oriented leadership.",
    weight: "very_high",
    priority: 100,
    trigger: { sign: "Capricorn" },
    effect: {
      score: 22,
      adds: [
        "disciplined execution",
        "engineering",
        "management",
        "endurance",
        "result orientation",
      ],
      strengthens: [
        "operations",
        "leadership",
        "strategic implementation",
      ],
    },
  },
  {
    id: "mars_aquarius",
    category: "business",
    title: "Mars in Aquarius",
    description:
      "Mars in Aquarius supports technology, systems, networks, reform, teams, engineering, and large-scale execution.",
    weight: "high",
    priority: 92,
    trigger: { sign: "Aquarius" },
    effect: {
      score: 14,
      adds: [
        "technology execution",
        "network systems",
        "engineering",
        "reform",
        "team operations",
      ],
      shadowAdds: [
        "detached aggression",
        "rebellious conflict",
      ],
    },
  },
  {
    id: "mars_pisces",
    category: "spirituality",
    title: "Mars in Pisces",
    description:
      "Mars in Pisces acts through compassion, imagination, service, healing, spirituality, and indirect strategy.",
    weight: "medium",
    priority: 82,
    trigger: { sign: "Pisces" },
    effect: {
      score: 8,
      adds: [
        "compassionate action",
        "healing",
        "service",
        "imaginative execution",
        "spiritual courage",
      ],
      shadowAdds: [
        "diffused effort",
        "avoidance of direct conflict",
      ],
    },
  },
];

const houseRules: KnowledgeRule[] = [
  {
    id: "mars_house_1",
    category: "identity",
    title: "Mars in the first house",
    description:
      "Mars in the first house makes courage, action, independence, competition, and directness central to identity.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 1 },
    effect: {
      score: 20,
      adds: [
        "courage",
        "initiative",
        "independence",
        "competitive identity",
      ],
      shadowAdds: [
        "impatience",
        "confrontation",
      ],
    },
  },
  {
    id: "mars_house_2",
    category: "wealth",
    title: "Mars in the second house",
    description:
      "Mars in the second house energises income, family resources, speech, accumulation, finance, and material ambition.",
    weight: "high",
    priority: 90,
    trigger: { house: 2 },
    effect: {
      score: 14,
      adds: [
        "material ambition",
        "active income",
        "resource accumulation",
        "financial drive",
      ],
      shadowAdds: [
        "harsh speech",
        "family conflict",
        "impulsive spending",
      ],
    },
  },
  {
    id: "mars_house_3",
    category: "communication",
    title: "Mars in the third house",
    description:
      "Mars in the third house strongly supports courage, enterprise, sales, communication, skills, initiative, and self-made effort.",
    weight: "very_high",
    priority: 98,
    trigger: { house: 3 },
    effect: {
      score: 20,
      adds: [
        "enterprise",
        "sales",
        "courage",
        "skills",
        "self-made effort",
      ],
      shadowAdds: [
        "argumentative communication",
        "sibling conflict",
      ],
    },
  },
  {
    id: "mars_house_4",
    category: "career",
    title: "Mars in the fourth house",
    description:
      "Mars in the fourth house supports property, vehicles, land, engineering, construction, security, and technical work connected to foundations.",
    weight: "high",
    priority: 90,
    trigger: { house: 4 },
    effect: {
      score: 14,
      adds: [
        "property",
        "vehicles",
        "construction",
        "engineering",
        "security",
      ],
      shadowAdds: [
        "domestic conflict",
        "inner restlessness",
      ],
    },
  },
  {
    id: "mars_house_5",
    category: "career",
    title: "Mars in the fifth house",
    description:
      "Mars in the fifth house supports strategy, competition, sport, creativity, entrepreneurship, speculation, and decisive intelligence.",
    weight: "high",
    priority: 92,
    trigger: { house: 5 },
    effect: {
      score: 16,
      adds: [
        "strategy",
        "competition",
        "entrepreneurship",
        "sport",
        "decisive intelligence",
      ],
      shadowAdds: [
        "speculative risk",
        "impatience with children or creativity",
      ],
    },
  },
  {
    id: "mars_house_6",
    category: "career",
    title: "Mars in the sixth house",
    description:
      "Mars in the sixth house strongly supports competition, disputes, service, health, technical work, problem solving, and defeating obstacles.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 6 },
    effect: {
      score: 22,
      adds: [
        "competitive strength",
        "problem solving",
        "service execution",
        "dispute handling",
        "technical work",
      ],
      shadowAdds: [
        "workplace conflict",
        "overwork",
      ],
    },
  },
  {
    id: "mars_house_7",
    category: "relationships",
    title: "Mars in the seventh house",
    description:
      "Mars in the seventh house energises partnerships, contracts, competition, business alliances, public dealing, and relationship conflict.",
    weight: "high",
    priority: 92,
    trigger: { house: 7 },
    effect: {
      score: 14,
      adds: [
        "business partnerships",
        "contract execution",
        "competitive alliances",
        "public dealing",
      ],
      shadowAdds: [
        "relationship conflict",
        "domination in partnership",
      ],
    },
  },
  {
    id: "mars_house_8",
    category: "spirituality",
    title: "Mars in the eighth house",
    description:
      "Mars in the eighth house supports crisis response, surgery, investigation, joint assets, risk, transformation, and hidden technical work.",
    weight: "high",
    priority: 90,
    trigger: { house: 8 },
    effect: {
      score: 14,
      adds: [
        "crisis response",
        "surgery",
        "investigation",
        "risk management",
        "transformation",
      ],
      shadowAdds: [
        "accident risk",
        "hidden conflict",
        "financial volatility",
      ],
    },
  },
  {
    id: "mars_house_9",
    category: "career",
    title: "Mars in the ninth house",
    description:
      "Mars in the ninth house supports mission, law, travel, higher education, ideology, leadership, and action guided by conviction.",
    weight: "high",
    priority: 90,
    trigger: { house: 9 },
    effect: {
      score: 14,
      adds: [
        "mission",
        "law",
        "travel",
        "leadership",
        "conviction-driven action",
      ],
      shadowAdds: [
        "righteous conflict",
        "rebellion against teachers",
      ],
    },
  },
  {
    id: "mars_house_10",
    category: "career",
    title: "Mars in the tenth house",
    description:
      "Mars in the tenth house strongly supports leadership, operations, engineering, manufacturing, execution, authority, and visible achievement.",
    weight: "very_high",
    priority: 100,
    trigger: { house: 10 },
    effect: {
      score: 22,
      adds: [
        "leadership",
        "operations",
        "engineering",
        "manufacturing",
        "execution",
        "visible achievement",
      ],
    },
  },
  {
    id: "mars_house_11",
    category: "wealth",
    title: "Mars in the eleventh house",
    description:
      "Mars in the eleventh house supports gains through enterprise, networks, technology, competition, teams, and ambitious goals.",
    weight: "very_high",
    priority: 96,
    trigger: { house: 11 },
    effect: {
      score: 18,
      adds: [
        "enterprise gains",
        "network execution",
        "technology gains",
        "ambitious goals",
      ],
      shadowAdds: [
        "conflict with networks",
        "aggressive ambition",
      ],
    },
  },
  {
    id: "mars_house_12",
    category: "spirituality",
    title: "Mars in the twelfth house",
    description:
      "Mars in the twelfth house directs energy toward foreign lands, isolation, hidden work, hospitals, research, expenses, and spiritual discipline.",
    weight: "medium",
    priority: 82,
    trigger: { house: 12 },
    effect: {
      score: 8,
      adds: [
        "foreign operations",
        "hidden work",
        "research",
        "spiritual discipline",
      ],
      shadowAdds: [
        "wasted energy",
        "hidden anger",
        "unplanned expenses",
      ],
    },
  },
];

const dignityRules: KnowledgeRule[] = [
  {
    id: "mars_dignity_exalted",
    category: "strength",
    title: "Exalted Mars",
    description:
      "Exalted Mars strongly supports disciplined action, engineering, endurance, leadership, strategy, and execution.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "exalted" },
    effect: {
      score: 22,
      strengthens: [
        "execution",
        "leadership",
        "engineering",
        "strategy",
        "endurance",
      ],
    },
  },
  {
    id: "mars_dignity_own",
    category: "strength",
    title: "Mars in own sign",
    description:
      "Mars in its own sign expresses courage, action, resilience, initiative, and strategic force with natural competence.",
    weight: "very_high",
    priority: 98,
    trigger: { dignity: "own" },
    effect: {
      score: 20,
      strengthens: [
        "courage",
        "initiative",
        "resilience",
        "strategy",
        "execution",
      ],
    },
  },
  {
    id: "mars_dignity_friend",
    category: "strength",
    title: "Mars in friendly dignity",
    description:
      "Friendly dignity supports constructive courage, execution, technical ability, and leadership.",
    weight: "high",
    priority: 86,
    trigger: { dignity: "friend" },
    effect: {
      score: 10,
      strengthens: [
        "courage",
        "execution",
        "technical ability",
        "leadership",
      ],
    },
  },
  {
    id: "mars_dignity_enemy",
    category: "strength",
    title: "Mars in inimical dignity",
    description:
      "Inimical dignity may weaken direction, patience, conflict handling, or the ability to apply force constructively.",
    weight: "high",
    priority: 90,
    trigger: { dignity: "enemy" },
    effect: {
      score: -12,
      weakens: [
        "direction",
        "patience",
        "constructive action",
      ],
      shadowAdds: [
        "misdirected anger",
        "frustrated execution",
      ],
    },
  },
  {
    id: "mars_dignity_debilitated",
    category: "strength",
    title: "Debilitated Mars",
    description:
      "Debilitated Mars may weaken direct action, courage, conflict handling, and execution unless cancellation or strong support is present.",
    weight: "very_high",
    priority: 100,
    trigger: { dignity: "debilitated" },
    effect: {
      score: -22,
      weakens: [
        "courage",
        "direct action",
        "conflict handling",
        "execution",
      ],
      shadowAdds: [
        "defensiveness",
        "passive aggression",
        "emotional volatility",
      ],
    },
  },
  {
    id: "mars_retrograde",
    category: "psychology",
    title: "Retrograde Mars",
    description:
      "Retrograde Mars internalises action, anger, ambition, and conflict, often producing repeated effort, strategic redirection, or delayed expression of force.",
    weight: "high",
    priority: 88,
    trigger: { retrograde: true },
    effect: {
      score: 2,
      adds: [
        "strategic redirection",
        "inner endurance",
        "independent action",
      ],
      shadowAdds: [
        "suppressed anger",
        "repeated conflict",
        "frustrated action",
      ],
    },
  },
  {
    id: "mars_combust",
    category: "strength",
    title: "Combust Mars",
    description:
      "Combustion can make Mars reactive, ego-driven, pressured, or less independently effective in action and conflict.",
    weight: "high",
    priority: 90,
    trigger: { combust: true },
    effect: {
      score: -12,
      weakens: [
        "independent action",
        "conflict judgement",
        "steady execution",
      ],
      shadowAdds: [
        "reactivity",
        "ego conflict",
      ],
    },
  },
  {
    id: "mars_vargottama",
    category: "strength",
    title: "Vargottama Mars",
    description:
      "Vargottama Mars strengthens consistency in courage, execution, technical ability, and strategic force across natal and navamsa expression.",
    weight: "very_high",
    priority: 95,
    trigger: { vargottama: true },
    effect: {
      score: 18,
      strengthens: [
        "courage",
        "execution",
        "technical ability",
        "strategic force",
      ],
    },
  },
];

const conjunctionRules: KnowledgeRule[] = [
  {
    id: "mars_conjunct_sun",
    category: "career",
    title: "Mars conjunct Sun",
    description:
      "Mars with the Sun supports authority, leadership, command, courage, visibility, and decisive action.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Sun" },
    effect: {
      score: 18,
      adds: [
        "command",
        "leadership",
        "authority",
        "visible execution",
        "courage",
      ],
      shadowAdds: [
        "ego conflict",
        "domination",
      ],
    },
  },
  {
    id: "mars_conjunct_moon",
    category: "psychology",
    title: "Mars conjunct Moon",
    description:
      "Mars with the Moon intensifies emotional action, courage, protection, reactivity, and instinctive response.",
    weight: "high",
    priority: 92,
    trigger: { conjunction: "Moon" },
    effect: {
      score: 12,
      adds: [
        "protective courage",
        "instinctive action",
        "emotional drive",
      ],
      shadowAdds: [
        "emotional volatility",
        "reactivity",
        "impatience",
      ],
    },
  },
  {
    id: "mars_conjunct_mercury",
    category: "business",
    title: "Mars conjunct Mercury",
    description:
      "Mars with Mercury supports technical intelligence, engineering, debate, sales, coding, tactical communication, and rapid execution.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Mercury" },
    effect: {
      score: 20,
      adds: [
        "technical intelligence",
        "engineering",
        "sales",
        "coding",
        "tactical communication",
        "rapid execution",
      ],
      shadowAdds: [
        "argumentative speech",
        "hasty decisions",
      ],
    },
  },
  {
    id: "mars_conjunct_jupiter",
    category: "business",
    title: "Mars conjunct Jupiter",
    description:
      "Mars with Jupiter supports enterprise, expansion, law, leadership, strategy, confidence, and mission-driven action.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Jupiter" },
    effect: {
      score: 20,
      adds: [
        "enterprise",
        "expansion",
        "law",
        "leadership",
        "strategy",
        "mission-driven action",
      ],
      shadowAdds: [
        "overreach",
        "righteous aggression",
      ],
    },
  },
  {
    id: "mars_conjunct_venus",
    category: "business",
    title: "Mars conjunct Venus",
    description:
      "Mars with Venus combines attraction and action, supporting design, luxury, hospitality, sales, performance, and entrepreneurial drive.",
    weight: "very_high",
    priority: 98,
    trigger: { conjunction: "Venus" },
    effect: {
      score: 18,
      adds: [
        "sales drive",
        "design execution",
        "luxury",
        "hospitality",
        "performance",
        "entrepreneurship",
      ],
      shadowAdds: [
        "relationship conflict",
        "impulsive desire",
      ],
    },
  },
  {
    id: "mars_conjunct_saturn",
    category: "career",
    title: "Mars conjunct Saturn",
    description:
      "Mars with Saturn combines force and discipline, supporting engineering, heavy operations, construction, endurance, compliance, and difficult execution.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "engineering",
        "heavy operations",
        "construction",
        "endurance",
        "compliance",
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
    id: "mars_conjunct_rahu",
    category: "business",
    title: "Mars conjunct Rahu",
    description:
      "Mars with Rahu amplifies ambition, technology, machinery, risk, foreign expansion, competition, and unconventional execution.",
    weight: "very_high",
    priority: 100,
    trigger: { conjunction: "Rahu" },
    effect: {
      score: 18,
      adds: [
        "aggressive expansion",
        "technology",
        "machinery",
        "foreign operations",
        "competition",
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
    id: "mars_conjunct_ketu",
    category: "spirituality",
    title: "Mars conjunct Ketu",
    description:
      "Mars with Ketu supports precision, detachment, technical depth, surgery, hidden action, spiritual discipline, and sudden decisive force.",
    weight: "high",
    priority: 95,
    trigger: { conjunction: "Ketu" },
    effect: {
      score: 16,
      adds: [
        "precision",
        "surgery",
        "technical depth",
        "spiritual discipline",
        "hidden action",
      ],
      shadowAdds: [
        "sudden aggression",
        "detached conflict",
      ],
    },
  },
];

const aspectRules: KnowledgeRule[] = [
  {
    id: "mars_aspected_by_sun",
    category: "career",
    title: "Sun aspects Mars",
    description:
      "The Sun gives Mars authority, confidence, leadership, command, and visible execution.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Sun" },
    effect: {
      score: 14,
      adds: [
        "authority",
        "leadership",
        "command",
        "visible execution",
      ],
      shadowAdds: [
        "ego conflict",
      ],
    },
  },
  {
    id: "mars_aspected_by_moon",
    category: "psychology",
    title: "Moon aspects Mars",
    description:
      "The Moon makes Mars emotionally responsive, protective, intuitive, and reactive.",
    weight: "high",
    priority: 86,
    trigger: { aspectFrom: "Moon" },
    effect: {
      score: 10,
      adds: [
        "protective action",
        "intuitive response",
        "emotional courage",
      ],
      shadowAdds: [
        "reactivity",
        "emotional volatility",
      ],
    },
  },
  {
    id: "mars_aspected_by_mercury",
    category: "business",
    title: "Mercury aspects Mars",
    description:
      "Mercury sharpens Mars through technical analysis, coding, sales, engineering logic, tactical communication, and planning.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "technical analysis",
        "coding",
        "sales",
        "engineering logic",
        "tactical planning",
      ],
    },
  },
  {
    id: "mars_aspected_by_jupiter",
    category: "business",
    title: "Jupiter aspects Mars",
    description:
      "Jupiter guides Mars toward strategy, law, ethical action, leadership, expansion, and mission-driven enterprise.",
    weight: "very_high",
    priority: 95,
    trigger: { aspectFrom: "Jupiter" },
    effect: {
      score: 16,
      adds: [
        "strategy",
        "law",
        "ethical action",
        "leadership",
        "enterprise",
      ],
      shadowAdds: [
        "overconfidence",
      ],
    },
  },
  {
    id: "mars_aspected_by_venus",
    category: "business",
    title: "Venus aspects Mars",
    description:
      "Venus refines Mars through design, sales, hospitality, negotiation, market appeal, and relationship-aware execution.",
    weight: "high",
    priority: 90,
    trigger: { aspectFrom: "Venus" },
    effect: {
      score: 14,
      adds: [
        "design execution",
        "sales",
        "hospitality",
        "negotiation",
        "market-aware action",
      ],
    },
  },
  {
    id: "mars_aspected_by_saturn",
    category: "career",
    title: "Saturn aspects Mars",
    description:
      "Saturn disciplines Mars through endurance, structure, compliance, delayed action, heavy operations, and methodical execution.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "endurance",
        "structure",
        "compliance",
        "heavy operations",
        "methodical execution",
      ],
      shadowAdds: [
        "frustration",
        "blocked action",
      ],
    },
  },
  {
    id: "mars_aspected_by_rahu",
    category: "business",
    title: "Rahu aspects Mars",
    description:
      "Rahu amplifies Mars toward technology, machinery, foreign expansion, competition, unconventional action, and risk.",
    weight: "very_high",
    priority: 98,
    trigger: { aspectFrom: "Rahu" },
    effect: {
      score: 18,
      adds: [
        "technology",
        "machinery",
        "foreign expansion",
        "competition",
        "unconventional action",
      ],
      shadowAdds: [
        "recklessness",
        "accident risk",
      ],
    },
  },
  {
    id: "mars_aspected_by_ketu",
    category: "spirituality",
    title: "Ketu aspects Mars",
    description:
      "Ketu sharpens Mars through precision, detachment, hidden action, surgery, spiritual discipline, and technical depth.",
    weight: "high",
    priority: 92,
    trigger: { aspectFrom: "Ketu" },
    effect: {
      score: 14,
      adds: [
        "precision",
        "surgery",
        "hidden action",
        "technical depth",
        "spiritual discipline",
      ],
      shadowAdds: [
        "sudden aggression",
      ],
    },
  },
];

const dispositorRules: KnowledgeRule[] = [
  {
    id: "mars_dispositor_sun",
    category: "career",
    title: "Mars disposed by Sun",
    description:
      "When the Sun disposes Mars, action seeks leadership, authority, recognition, visibility, and command.",
    weight: "high",
    priority: 90,
    trigger: { dispositor: "Sun" },
    effect: {
      score: 14,
      adds: [
        "leadership",
        "authority",
        "command",
        "visible execution",
      ],
    },
  },
  {
    id: "mars_dispositor_moon",
    category: "psychology",
    title: "Mars disposed by Moon",
    description:
      "When the Moon disposes Mars, action becomes protective, emotional, family-oriented, intuitive, and reactive.",
    weight: "high",
    priority: 86,
    trigger: { dispositor: "Moon" },
    effect: {
      score: 10,
      adds: [
        "protective action",
        "emotional courage",
        "intuitive response",
      ],
      shadowAdds: [
        "defensiveness",
      ],
    },
  },
  {
    id: "mars_dispositor_mercury",
    category: "business",
    title: "Mars disposed by Mercury",
    description:
      "When Mercury disposes Mars, action is channelled through technology, sales, analysis, coding, engineering logic, and tactical planning.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Mercury" },
    effect: {
      score: 16,
      adds: [
        "technology",
        "sales",
        "analysis",
        "coding",
        "engineering logic",
        "tactical planning",
      ],
    },
  },
  {
    id: "mars_dispositor_jupiter",
    category: "business",
    title: "Mars disposed by Jupiter",
    description:
      "When Jupiter disposes Mars, action becomes strategic, mission-driven, ethical, expansive, legal, and leadership-oriented.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Jupiter" },
    effect: {
      score: 16,
      adds: [
        "strategy",
        "mission-driven action",
        "law",
        "leadership",
        "ethical enterprise",
      ],
    },
  },
  {
    id: "mars_dispositor_venus",
    category: "business",
    title: "Mars disposed by Venus",
    description:
      "When Venus disposes Mars, action is channelled through negotiation, design, relationships, sales, hospitality, and market appeal.",
    weight: "very_high",
    priority: 95,
    trigger: { dispositor: "Venus" },
    effect: {
      score: 16,
      adds: [
        "negotiation",
        "design execution",
        "sales",
        "hospitality",
        "market-aware action",
      ],
    },
  },
  {
    id: "mars_dispositor_saturn",
    category: "career",
    title: "Mars disposed by Saturn",
    description:
      "When Saturn disposes Mars, action becomes disciplined, structured, operational, compliant, durable, and long-term.",
    weight: "very_high",
    priority: 98,
    trigger: { dispositor: "Saturn" },
    effect: {
      score: 18,
      adds: [
        "disciplined execution",
        "operations",
        "compliance",
        "durability",
        "long-term implementation",
      ],
      shadowAdds: [
        "frustration",
        "delayed action",
      ],
    },
  },
];

const businessRules: KnowledgeRule[] = [
  {
    id: "mars_business_3rd_lord",
    category: "business",
    title: "Mars ruling the third house",
    description:
      "Mars ruling the third house supports enterprise, sales, courage, communication, self-effort, and independent business initiative.",
    weight: "very_high",
    priority: 95,
    trigger: { ownsHouse: 3 },
    effect: {
      score: 18,
      strengthens: [
        "enterprise",
        "sales",
        "initiative",
        "self-made effort",
      ],
    },
  },
  {
    id: "mars_business_6th_lord",
    category: "career",
    title: "Mars ruling the sixth house",
    description:
      "Mars ruling the sixth house supports competition, service, technical work, disputes, operations, and defeating obstacles.",
    weight: "very_high",
    priority: 95,
    trigger: { ownsHouse: 6 },
    effect: {
      score: 18,
      strengthens: [
        "competition",
        "operations",
        "technical service",
        "problem solving",
      ],
    },
  },
  {
    id: "mars_business_10th_lord",
    category: "career",
    title: "Mars ruling the tenth house",
    description:
      "Mars ruling the tenth house ties professional success to leadership, engineering, operations, manufacturing, execution, and authority.",
    weight: "very_high",
    priority: 100,
    trigger: { ownsHouse: 10 },
    effect: {
      score: 22,
      strengthens: [
        "leadership",
        "engineering",
        "operations",
        "manufacturing",
        "execution",
      ],
    },
  },
  {
    id: "mars_business_11th_lord",
    category: "wealth",
    title: "Mars ruling the eleventh house",
    description:
      "Mars ruling the eleventh house supports gains through enterprise, technology, competition, teams, networks, and ambitious execution.",
    weight: "very_high",
    priority: 98,
    trigger: { ownsHouse: 11 },
    effect: {
      score: 20,
      strengthens: [
        "enterprise gains",
        "technology gains",
        "network execution",
        "ambitious goals",
      ],
    },
  },
];

const careerRules: KnowledgeRule[] = [
  {
    id: "mars_career_execution_professions",
    category: "career",
    title: "Mars and execution professions",
    description:
      "A strong Mars supports professions involving engineering, operations, construction, manufacturing, defence, surgery, technology, sport, sales, and crisis response.",
    weight: "very_high",
    priority: 95,
    trigger: {},
    effect: {
      score: 16,
      adds: [
        "engineering",
        "operations",
        "construction",
        "manufacturing",
        "defence",
        "surgery",
        "technology",
        "sales",
      ],
    },
  },
];

const wealthRules: KnowledgeRule[] = [
  {
    id: "mars_wealth_execution",
    category: "wealth",
    title: "Mars and wealth through execution",
    description:
      "Mars supports wealth through initiative, land, machinery, production, technical skill, competition, and operational delivery.",
    weight: "very_high",
    priority: 92,
    trigger: {},
    effect: {
      score: 14,
      adds: [
        "technical income",
        "land",
        "machinery",
        "production",
        "operational wealth",
      ],
    },
  },
];

const relationshipRules: KnowledgeRule[] = [
  {
    id: "mars_relationship_energy",
    category: "relationships",
    title: "Mars in relationships",
    description:
      "Mars brings passion, initiative, protection, competitiveness, sexuality, conflict, and the need for clear boundaries in relationships.",
    weight: "high",
    priority: 88,
    trigger: {},
    effect: {
      score: 10,
      adds: [
        "passion",
        "initiative",
        "protection",
        "sexual energy",
      ],
      shadowAdds: [
        "conflict",
        "domination",
        "impatience",
      ],
    },
  },
];

const healthRules: KnowledgeRule[] = [
  {
    id: "mars_health_vitality",
    category: "health",
    title: "Mars and physical vitality",
    description:
      "Mars relates to blood, muscles, heat, inflammation, injuries, surgery, stamina, and recovery through action.",
    weight: "high",
    priority: 85,
    trigger: {},
    effect: {
      score: 8,
      adds: [
        "stamina",
        "physical vitality",
        "surgical recovery",
        "active resilience",
      ],
      shadowAdds: [
        "inflammation",
        "injuries",
        "burnout",
      ],
    },
  },
];

const spiritualityRules: KnowledgeRule[] = [
  {
    id: "mars_spiritual_discipline",
    category: "spirituality",
    title: "Mars and spiritual discipline",
    description:
      "Mars supports tapas, discipline, courage, protection, pilgrimage, martial practice, and action aligned with conviction.",
    weight: "high",
    priority: 88,
    trigger: {},
    effect: {
      score: 12,
      adds: [
        "tapas",
        "discipline",
        "courage",
        "protection",
        "spiritual action",
      ],
    },
  },
];

const shadowRules: KnowledgeRule[] = [
  {
    id: "mars_shadow_impulsiveness",
    category: "psychology",
    title: "Mars excess",
    description:
      "A highly active Mars may act before thinking, escalate conflict, overwork, dominate others, or take unnecessary risks.",
    weight: "high",
    priority: 90,
    trigger: {},
    effect: {
      score: 0,
      shadowAdds: [
        "impulsiveness",
        "conflict escalation",
        "overwork",
        "domination",
        "unnecessary risk",
      ],
    },
  },
];

export const MarsKnowledge: PlanetKnowledge = {
  planet: "Mars",

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
