import type { PlanetName, ZodiacSign } from "../types";

export type FunctionalPlanetRole =
  | "lagna_lord"
  | "yogakaraka"
  | "functional_benefic"
  | "functional_malefic"
  | "mixed"
  | "maraka"
  | "neutral";

export type FunctionalPlanetRoleKnowledge = {
  ascendant: ZodiacSign;
  planet: PlanetName;

  ruledHouses: number[];

  roles: FunctionalPlanetRole[];

  principle: string;

  supportiveThemes: string[];
  challengingThemes: string[];

  confidence: number;
};

export type FunctionalPlanetRoleMap = Partial<
  Record<
    ZodiacSign,
    Partial<Record<PlanetName, FunctionalPlanetRoleKnowledge>>
  >
>;

export const FUNCTIONAL_PLANET_ROLES: FunctionalPlanetRoleMap = {
  Aries: {
    Sun: {
  ascendant: "Aries",
  planet: "Sun",
  ruledHouses: [5],
  roles: ["functional_benefic"],
  principle:
    "For Aries ascendant, the Sun rules the 5th house, connecting authority, confidence and leadership with intelligence, education, creativity, children, merit and self-expression.",
  supportiveThemes: [
    "intelligence",
    "education",
    "creativity",
    "children",
    "leadership",
  ],
  challengingThemes: [
    "ego around recognition",
    "pride in one's judgement",
  ],
  confidence: 10,
},

Moon: {
  ascendant: "Aries",
  planet: "Moon",
  ruledHouses: [4],
  roles: ["neutral"],
  principle:
    "For Aries ascendant, the Moon rules the 4th house, connecting emotional responsiveness with home, property, education, inner security, comfort and emotional foundations.",
  supportiveThemes: [
    "home",
    "property",
    "education",
    "emotional security",
    "comfort",
  ],
  challengingThemes: [
    "emotional fluctuation",
    "domestic sensitivity",
  ],
  confidence: 10,
},

    Mars: {
      ascendant: "Aries",
      planet: "Mars",
      ruledHouses: [1, 8],
      roles: ["lagna_lord", "mixed"],
      principle:
        "For Aries ascendant, Mars rules the 1st and 8th houses. As ascendant lord it strongly represents the self, vitality and direction, while its 8th-house ownership also connects it with transformation, vulnerability and sudden change.",
      supportiveThemes: [
        "self",
        "vitality",
        "initiative",
        "resilience",
        "transformation",
      ],
      challengingThemes: [
        "sudden change",
        "instability",
        "conflict",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Aries",
      planet: "Mercury",
      ruledHouses: [3, 6],
      roles: ["functional_malefic"],
      principle:
        "For Aries ascendant, Mercury rules the 3rd and 6th houses, connecting it strongly with effort, competition, disputes, workload, communication and practical problem-solving.",
      supportiveThemes: [
        "effort",
        "communication",
        "problem-solving",
        "competition",
      ],
      challengingThemes: [
        "conflict",
        "overwork",
        "disputes",
        "mental restlessness",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Aries",
      planet: "Jupiter",
      ruledHouses: [9, 12],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Aries ascendant, Jupiter rules the 9th and 12th houses. Its 9th-house ownership strongly connects it with fortune, dharma, teachers and higher learning, while the 12th adds spirituality, foreign connections, expenditure and release.",
      supportiveThemes: [
        "fortune",
        "guidance",
        "higher learning",
        "spirituality",
        "foreign connections",
      ],
      challengingThemes: [
        "expenses",
        "withdrawal",
        "loss of resources",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Aries",
      planet: "Venus",
      ruledHouses: [2, 7],
      roles: ["maraka", "mixed"],
      principle:
        "For Aries ascendant, Venus rules the 2nd and 7th houses, strongly connecting it with wealth, family, speech, relationships, partnerships and agreements. Both houses also carry classical maraka significance.",
      supportiveThemes: [
        "wealth",
        "family",
        "relationships",
        "partnerships",
        "agreements",
      ],
      challengingThemes: [
        "relationship pressure",
        "financial attachment",
        "maraka themes",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Aries",
      planet: "Saturn",
      ruledHouses: [10, 11],
      roles: ["mixed"],
      principle:
        "For Aries ascendant, Saturn rules the 10th and 11th houses, connecting responsibility and sustained effort with career, status, gains, networks and long-term ambitions.",
      supportiveThemes: [
        "career",
        "responsibility",
        "gains",
        "networks",
        "long-term goals",
      ],
      challengingThemes: [
        "delay",
        "pressure",
        "slow progress",
      ],
      confidence: 10,
    },
  },
    Taurus: {
    Sun: {
      ascendant: "Taurus",
      planet: "Sun",
      ruledHouses: [4],
      roles: ["neutral"],
      principle:
        "For Taurus ascendant, the Sun rules the 4th house, connecting authority and identity with home, mother, property, education, emotional foundations and inner stability.",
      supportiveThemes: [
        "home",
        "property",
        "education",
        "stability",
        "responsibility",
      ],
      challengingThemes: [
        "pride in domestic matters",
        "authority issues at home",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Taurus",
      planet: "Moon",
      ruledHouses: [3],
      roles: ["functional_malefic"],
      principle:
        "For Taurus ascendant, the Moon rules the 3rd house, connecting emotional energy with communication, initiative, courage, skills, siblings and repeated personal effort.",
      supportiveThemes: [
        "communication",
        "initiative",
        "skills",
        "courage",
        "effort",
      ],
      challengingThemes: [
        "restlessness",
        "fluctuating effort",
        "emotional reactions in communication",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Taurus",
      planet: "Mars",
      ruledHouses: [7, 12],
      roles: ["maraka", "mixed"],
      principle:
        "For Taurus ascendant, Mars rules the 7th and 12th houses, connecting partnerships and public dealings with expenditure, foreign environments, withdrawal and private matters. Its 7th-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "partnerships",
        "clients",
        "foreign connections",
        "private effort",
      ],
      challengingThemes: [
        "relationship conflict",
        "expenses",
        "separation",
        "maraka themes",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Taurus",
      planet: "Mercury",
      ruledHouses: [2, 5],
      roles: ["functional_benefic"],
      principle:
        "For Taurus ascendant, Mercury rules the 2nd and 5th houses, connecting wealth, speech and family resources with intelligence, education, creativity, children and judgement.",
      supportiveThemes: [
        "wealth",
        "speech",
        "intelligence",
        "education",
        "creativity",
      ],
      challengingThemes: [
        "over-analysis of money",
        "excessive calculation",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Taurus",
      planet: "Jupiter",
      ruledHouses: [8, 11],
      roles: ["functional_malefic"],
      principle:
        "For Taurus ascendant, Jupiter rules the 8th and 11th houses, connecting transformation, shared resources and hidden matters with gains, networks, ambitions and fulfilment of desires.",
      supportiveThemes: [
        "research",
        "shared resources",
        "networks",
        "gains",
        "deep knowledge",
      ],
      challengingThemes: [
        "sudden changes",
        "financial complexity",
        "excessive expectations",
        "instability in gains",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Taurus",
      planet: "Venus",
      ruledHouses: [1, 6],
      roles: ["lagna_lord", "mixed"],
      principle:
        "For Taurus ascendant, Venus rules the 1st and 6th houses. As ascendant lord it strongly represents identity, vitality and personal direction, while 6th-house ownership also connects it with work, service, health, competition and practical challenges.",
      supportiveThemes: [
        "self",
        "personal direction",
        "relationships",
        "service",
        "problem-solving",
      ],
      challengingThemes: [
        "workload",
        "competition",
        "health routines",
        "conflict",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Taurus",
      planet: "Saturn",
      ruledHouses: [9, 10],
      roles: ["yogakaraka", "functional_benefic"],
      principle:
        "For Taurus ascendant, Saturn rules both the 9th house of dharma, fortune and higher guidance and the 10th house of career, responsibility and public contribution, making Saturn a classical yogakaraka.",
      supportiveThemes: [
        "career",
        "fortune",
        "authority",
        "discipline",
        "long-term achievement",
      ],
      challengingThemes: [
        "delay before results",
        "heavy responsibility",
      ],
      confidence: 10,
    },
  },
    Gemini: {
    Sun: {
      ascendant: "Gemini",
      planet: "Sun",
      ruledHouses: [3],
      roles: ["functional_malefic"],
      principle:
        "For Gemini ascendant, the Sun rules the 3rd house, connecting authority, confidence and self-expression with communication, courage, initiative, skills, siblings and personal effort.",
      supportiveThemes: [
        "courage",
        "initiative",
        "communication",
        "skills",
        "self-effort",
      ],
      challengingThemes: [
        "ego in communication",
        "conflict with siblings",
        "excessive self-reliance",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Gemini",
      planet: "Moon",
      ruledHouses: [2],
      roles: ["maraka", "mixed"],
      principle:
        "For Gemini ascendant, the Moon rules the 2nd house, connecting emotional security with wealth, family, speech, food and accumulated resources. The 2nd house also carries classical maraka significance.",
      supportiveThemes: [
        "wealth",
        "family",
        "speech",
        "resources",
        "financial security",
      ],
      challengingThemes: [
        "financial fluctuation",
        "emotional speech",
        "family sensitivity",
        "maraka themes",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Gemini",
      planet: "Mars",
      ruledHouses: [6, 11],
      roles: ["functional_malefic"],
      principle:
        "For Gemini ascendant, Mars rules the 6th and 11th houses, connecting action and competition with work, disputes, obstacles, gains, networks and fulfilment of ambitions.",
      supportiveThemes: [
        "competition",
        "problem-solving",
        "gains",
        "networks",
        "determination",
      ],
      challengingThemes: [
        "conflict",
        "disputes",
        "overwork",
        "aggressive pursuit of gains",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Gemini",
      planet: "Mercury",
      ruledHouses: [1, 4],
      roles: ["lagna_lord", "functional_benefic"],
      principle:
        "For Gemini ascendant, Mercury rules the 1st and 4th houses, connecting identity, intelligence and personal direction with home, education, property, emotional foundations and inner stability.",
      supportiveThemes: [
        "self",
        "intelligence",
        "education",
        "home",
        "communication",
      ],
      challengingThemes: [
        "overthinking",
        "mental restlessness",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Gemini",
      planet: "Jupiter",
      ruledHouses: [7, 10],
      roles: ["maraka", "mixed"],
      principle:
        "For Gemini ascendant, Jupiter rules the 7th and 10th houses, connecting partnerships, clients and agreements with career, authority, reputation and public responsibility. Its 7th-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "partnerships",
        "clients",
        "career",
        "guidance",
        "public responsibility",
      ],
      challengingThemes: [
        "relationship expectations",
        "career pressure",
        "maraka themes",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Gemini",
      planet: "Venus",
      ruledHouses: [5, 12],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Gemini ascendant, Venus rules the 5th and 12th houses. Its 5th-house ownership connects it strongly with intelligence, creativity, children and merit, while the 12th adds expenditure, foreign connections, privacy, pleasure and release.",
      supportiveThemes: [
        "creativity",
        "education",
        "children",
        "foreign connections",
        "imagination",
      ],
      challengingThemes: [
        "expenses",
        "indulgence",
        "withdrawal",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Gemini",
      planet: "Saturn",
      ruledHouses: [8, 9],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Gemini ascendant, Saturn rules the 8th and 9th houses. Its 9th-house ownership connects it with dharma, fortune, higher learning and guidance, while the 8th adds transformation, longevity, hidden matters and sudden change.",
      supportiveThemes: [
        "higher learning",
        "discipline",
        "research",
        "long-term wisdom",
        "resilience",
      ],
      challengingThemes: [
        "delays",
        "sudden changes",
        "heavy transformation",
        "uncertainty",
      ],
      confidence: 10,
    },
  },
    Cancer: {
    Sun: {
      ascendant: "Cancer",
      planet: "Sun",
      ruledHouses: [2],
      roles: ["maraka", "mixed"],
      principle:
        "For Cancer ascendant, the Sun rules the 2nd house, connecting authority, identity and confidence with wealth, family, speech and accumulated resources. The 2nd house also carries classical maraka significance.",
      supportiveThemes: [
        "wealth",
        "family",
        "speech",
        "financial stability",
        "resources",
      ],
      challengingThemes: [
        "pride in financial matters",
        "authoritative speech",
        "family pressure",
        "maraka themes",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Cancer",
      planet: "Moon",
      ruledHouses: [1],
      roles: ["lagna_lord", "functional_benefic"],
      principle:
        "For Cancer ascendant, the Moon rules the 1st house and becomes the ascendant lord, strongly connecting emotional condition, adaptability and sensitivity with identity, vitality and personal direction.",
      supportiveThemes: [
        "self",
        "vitality",
        "emotional intelligence",
        "adaptability",
        "personal direction",
      ],
      challengingThemes: [
        "emotional fluctuation",
        "sensitivity",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Cancer",
      planet: "Mars",
      ruledHouses: [5, 10],
      roles: ["yogakaraka", "functional_benefic"],
      principle:
        "For Cancer ascendant, Mars rules both the 5th house of intelligence, creativity and merit and the 10th house of career, responsibility and public contribution, making Mars a classical yogakaraka.",
      supportiveThemes: [
        "career",
        "leadership",
        "intelligence",
        "creativity",
        "achievement",
      ],
      challengingThemes: [
        "impatience",
        "forceful decision-making",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Cancer",
      planet: "Mercury",
      ruledHouses: [3, 12],
      roles: ["functional_malefic"],
      principle:
        "For Cancer ascendant, Mercury rules the 3rd and 12th houses, connecting communication, initiative and personal effort with expenditure, foreign connections, privacy, withdrawal and release.",
      supportiveThemes: [
        "communication",
        "skills",
        "foreign connections",
        "research",
        "independent effort",
      ],
      challengingThemes: [
        "expenses",
        "mental restlessness",
        "scattered effort",
        "withdrawal",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Cancer",
      planet: "Jupiter",
      ruledHouses: [6, 9],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Cancer ascendant, Jupiter rules the 6th and 9th houses. Its 9th-house ownership strongly connects it with dharma, fortune, teachers and higher learning, while the 6th adds work, service, health, competition and practical challenges.",
      supportiveThemes: [
        "fortune",
        "guidance",
        "higher learning",
        "service",
        "problem-solving",
      ],
      challengingThemes: [
        "workload",
        "conflict",
        "health responsibilities",
        "competition",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Cancer",
      planet: "Venus",
      ruledHouses: [4, 11],
      roles: ["mixed"],
      principle:
        "For Cancer ascendant, Venus rules the 4th and 11th houses, connecting home, comfort, property and emotional foundations with gains, networks, friendships and long-term aspirations.",
      supportiveThemes: [
        "home",
        "property",
        "comfort",
        "gains",
        "networks",
      ],
      challengingThemes: [
        "attachment to comfort",
        "excessive desires",
        "dependence on social validation",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Cancer",
      planet: "Saturn",
      ruledHouses: [7, 8],
      roles: ["maraka", "functional_malefic"],
      principle:
        "For Cancer ascendant, Saturn rules the 7th and 8th houses, connecting partnerships and public dealings with transformation, vulnerability, shared resources and sudden change. Its 7th-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "commitment",
        "partnership responsibility",
        "endurance",
        "research",
        "long-term resilience",
      ],
      challengingThemes: [
        "relationship pressure",
        "delay",
        "sudden changes",
        "emotional heaviness",
        "maraka themes",
      ],
      confidence: 10,
    },
  },
    Leo: {
    Sun: {
      ascendant: "Leo",
      planet: "Sun",
      ruledHouses: [1],
      roles: ["lagna_lord", "functional_benefic"],
      principle:
        "For Leo ascendant, the Sun rules the 1st house and becomes the ascendant lord, strongly connecting identity, vitality, confidence, authority and personal direction.",
      supportiveThemes: [
        "self",
        "vitality",
        "confidence",
        "leadership",
        "personal direction",
      ],
      challengingThemes: [
        "ego",
        "rigidity",
        "excessive pride",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Leo",
      planet: "Moon",
      ruledHouses: [12],
      roles: ["functional_malefic"],
      principle:
        "For Leo ascendant, the Moon rules the 12th house, connecting emotional experience with rest, withdrawal, expenditure, foreign environments, private matters and release.",
      supportiveThemes: [
        "reflection",
        "rest",
        "foreign connections",
        "spirituality",
        "private work",
      ],
      challengingThemes: [
        "expenses",
        "withdrawal",
        "emotional isolation",
        "loss of energy",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Leo",
      planet: "Mars",
      ruledHouses: [4, 9],
      roles: ["yogakaraka", "functional_benefic"],
      principle:
        "For Leo ascendant, Mars rules both the 4th house of home, property and emotional foundations and the 9th house of dharma, fortune and higher guidance, making Mars a classical yogakaraka.",
      supportiveThemes: [
        "fortune",
        "property",
        "education",
        "leadership",
        "higher learning",
      ],
      challengingThemes: [
        "impatience",
        "domestic conflict",
        "forceful beliefs",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Leo",
      planet: "Mercury",
      ruledHouses: [2, 11],
      roles: ["maraka", "mixed"],
      principle:
        "For Leo ascendant, Mercury rules the 2nd and 11th houses, connecting wealth, family and speech with gains, networks, ambitions and fulfilment of desires. Its 2nd-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "wealth",
        "communication",
        "gains",
        "networks",
        "commercial ability",
      ],
      challengingThemes: [
        "financial attachment",
        "excessive calculation",
        "desire-driven decisions",
        "maraka themes",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Leo",
      planet: "Jupiter",
      ruledHouses: [5, 8],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Leo ascendant, Jupiter rules the 5th and 8th houses. Its 5th-house ownership strongly connects it with intelligence, education, creativity, children and merit, while the 8th adds transformation, research, shared resources and hidden knowledge.",
      supportiveThemes: [
        "intelligence",
        "education",
        "children",
        "wisdom",
        "research",
      ],
      challengingThemes: [
        "sudden changes",
        "financial complexity",
        "hidden matters",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Leo",
      planet: "Venus",
      ruledHouses: [3, 10],
      roles: ["mixed"],
      principle:
        "For Leo ascendant, Venus rules the 3rd and 10th houses, connecting communication, initiative and skills with career, reputation, responsibility and public contribution.",
      supportiveThemes: [
        "career",
        "communication",
        "creativity",
        "professional relationships",
        "skills",
      ],
      challengingThemes: [
        "career attachment",
        "need for recognition",
        "inconsistent effort",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Leo",
      planet: "Saturn",
      ruledHouses: [6, 7],
      roles: ["maraka", "functional_malefic"],
      principle:
        "For Leo ascendant, Saturn rules the 6th and 7th houses, connecting work, competition, disputes and practical challenges with partnerships, clients and agreements. Its 7th-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "discipline",
        "service",
        "commitment",
        "partnership responsibility",
        "endurance",
      ],
      challengingThemes: [
        "conflict",
        "relationship pressure",
        "delay",
        "competition",
        "maraka themes",
      ],
      confidence: 10,
    },
  },
    Virgo: {
    Sun: {
      ascendant: "Virgo",
      planet: "Sun",
      ruledHouses: [12],
      roles: ["functional_malefic"],
      principle:
        "For Virgo ascendant, the Sun rules the 12th house, connecting authority, identity and confidence with expenditure, foreign environments, withdrawal, private matters and release.",
      supportiveThemes: [
        "foreign connections",
        "reflection",
        "private work",
        "spiritual development",
        "release",
      ],
      challengingThemes: [
        "expenses",
        "isolation",
        "loss of resources",
        "reduced visibility",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Virgo",
      planet: "Moon",
      ruledHouses: [11],
      roles: ["mixed"],
      principle:
        "For Virgo ascendant, the Moon rules the 11th house, connecting emotional needs and responsiveness with gains, networks, friendships, ambitions and fulfilment of desires.",
      supportiveThemes: [
        "gains",
        "networks",
        "friendships",
        "income",
        "long-term goals",
      ],
      challengingThemes: [
        "fluctuating gains",
        "changing social expectations",
        "emotional attachment to outcomes",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Virgo",
      planet: "Mars",
      ruledHouses: [3, 8],
      roles: ["functional_malefic"],
      principle:
        "For Virgo ascendant, Mars rules the 3rd and 8th houses, connecting action, courage and initiative with effort, communication, transformation, hidden matters and sudden change.",
      supportiveThemes: [
        "courage",
        "initiative",
        "research",
        "resilience",
        "problem-solving",
      ],
      challengingThemes: [
        "conflict",
        "impulsive communication",
        "sudden changes",
        "instability",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Virgo",
      planet: "Mercury",
      ruledHouses: [1, 10],
      roles: ["lagna_lord", "functional_benefic"],
      principle:
        "For Virgo ascendant, Mercury rules the 1st and 10th houses, connecting identity, intelligence and personal direction directly with career, responsibility, reputation and public contribution.",
      supportiveThemes: [
        "self",
        "intelligence",
        "career",
        "communication",
        "professional competence",
      ],
      challengingThemes: [
        "overthinking",
        "work-related mental pressure",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Virgo",
      planet: "Jupiter",
      ruledHouses: [4, 7],
      roles: ["maraka", "mixed"],
      principle:
        "For Virgo ascendant, Jupiter rules the 4th and 7th houses, connecting home, education, property and emotional foundations with partnerships, clients, agreements and public dealings. Its 7th-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "home",
        "property",
        "education",
        "partnerships",
        "guidance",
      ],
      challengingThemes: [
        "relationship expectations",
        "domestic pressure",
        "maraka themes",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Virgo",
      planet: "Venus",
      ruledHouses: [2, 9],
      roles: ["functional_benefic", "maraka"],
      principle:
        "For Virgo ascendant, Venus rules the 2nd and 9th houses. Its 9th-house ownership strongly connects it with fortune, dharma, higher learning and guidance, while the 2nd connects it with wealth, family and speech and also carries classical maraka significance.",
      supportiveThemes: [
        "fortune",
        "wealth",
        "higher learning",
        "family resources",
        "guidance",
      ],
      challengingThemes: [
        "financial attachment",
        "indulgence",
        "maraka themes",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Virgo",
      planet: "Saturn",
      ruledHouses: [5, 6],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Virgo ascendant, Saturn rules the 5th and 6th houses. Its 5th-house ownership connects it with intelligence, education, creativity, children and merit, while the 6th adds work, service, competition, health and practical challenges.",
      supportiveThemes: [
        "disciplined learning",
        "education",
        "problem-solving",
        "service",
        "persistence",
      ],
      challengingThemes: [
        "workload",
        "competition",
        "delays",
        "pressure around responsibilities",
      ],
      confidence: 10,
    },
  },
    Libra: {
    Sun: {
      ascendant: "Libra",
      planet: "Sun",
      ruledHouses: [11],
      roles: ["mixed"],
      principle:
        "For Libra ascendant, the Sun rules the 11th house, connecting authority, confidence and visibility with gains, networks, friendships, ambitions and fulfilment of desires.",
      supportiveThemes: [
        "gains",
        "networks",
        "leadership",
        "influential connections",
        "long-term goals",
      ],
      challengingThemes: [
        "excessive ambition",
        "ego within networks",
        "attachment to recognition",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Libra",
      planet: "Moon",
      ruledHouses: [10],
      roles: ["neutral"],
      principle:
        "For Libra ascendant, the Moon rules the 10th house, connecting emotional responsiveness and public interaction with career, responsibility, reputation, authority and professional contribution.",
      supportiveThemes: [
        "career",
        "public visibility",
        "professional relationships",
        "responsibility",
        "adaptability",
      ],
      challengingThemes: [
        "career fluctuation",
        "emotional sensitivity to recognition",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Libra",
      planet: "Mars",
      ruledHouses: [2, 7],
      roles: ["maraka", "mixed"],
      principle:
        "For Libra ascendant, Mars rules the 2nd and 7th houses, connecting wealth, family and speech with relationships, partnerships, clients and agreements. Both houses also carry classical maraka significance.",
      supportiveThemes: [
        "wealth",
        "family",
        "partnerships",
        "clients",
        "decisive agreements",
      ],
      challengingThemes: [
        "conflict in relationships",
        "sharp speech",
        "financial pressure",
        "maraka themes",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Libra",
      planet: "Mercury",
      ruledHouses: [9, 12],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Libra ascendant, Mercury rules the 9th and 12th houses. Its 9th-house ownership strongly connects it with fortune, dharma, higher learning and guidance, while the 12th adds foreign connections, expenditure, reflection and release.",
      supportiveThemes: [
        "fortune",
        "higher learning",
        "guidance",
        "foreign connections",
        "spiritual study",
      ],
      challengingThemes: [
        "expenses",
        "withdrawal",
        "scattered direction",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Libra",
      planet: "Jupiter",
      ruledHouses: [3, 6],
      roles: ["functional_malefic"],
      principle:
        "For Libra ascendant, Jupiter rules the 3rd and 6th houses, connecting knowledge and expansion with effort, communication, competition, work, service, disputes and practical challenges.",
      supportiveThemes: [
        "learning through effort",
        "communication",
        "service",
        "problem-solving",
        "practical knowledge",
      ],
      challengingThemes: [
        "conflict",
        "workload",
        "competition",
        "excessive effort",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Libra",
      planet: "Venus",
      ruledHouses: [1, 8],
      roles: ["lagna_lord", "mixed"],
      principle:
        "For Libra ascendant, Venus rules the 1st and 8th houses. As ascendant lord it strongly represents identity, vitality, relationships and personal direction, while the 8th adds transformation, vulnerability, shared resources and hidden matters.",
      supportiveThemes: [
        "self",
        "relationships",
        "personal direction",
        "resilience",
        "transformation",
      ],
      challengingThemes: [
        "sudden changes",
        "relationship complexity",
        "financial entanglements",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Libra",
      planet: "Saturn",
      ruledHouses: [4, 5],
      roles: ["yogakaraka", "functional_benefic"],
      principle:
        "For Libra ascendant, Saturn rules both the 4th house of home, property and emotional foundations and the 5th house of intelligence, creativity and merit, making Saturn a classical yogakaraka.",
      supportiveThemes: [
        "education",
        "property",
        "intelligence",
        "creativity",
        "long-term stability",
      ],
      challengingThemes: [
        "delay before results",
        "heavy responsibilities",
      ],
      confidence: 10,
    },
  },
    Scorpio: {
    Sun: {
      ascendant: "Scorpio",
      planet: "Sun",
      ruledHouses: [10],
      roles: ["neutral"],
      principle:
        "For Scorpio ascendant, the Sun rules the 10th house, connecting authority, leadership and visibility with career, responsibility, reputation and public contribution.",
      supportiveThemes: [
        "career",
        "leadership",
        "authority",
        "reputation",
        "public responsibility",
      ],
      challengingThemes: [
        "career pressure",
        "ego around status",
        "conflict with authority",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Scorpio",
      planet: "Moon",
      ruledHouses: [9],
      roles: ["functional_benefic"],
      principle:
        "For Scorpio ascendant, the Moon rules the 9th house, connecting emotional intelligence and responsiveness with dharma, fortune, higher learning, teachers, travel and broader guidance.",
      supportiveThemes: [
        "fortune",
        "higher learning",
        "guidance",
        "teachers",
        "travel",
      ],
      challengingThemes: [
        "fluctuating beliefs",
        "emotional dependence on guidance",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Scorpio",
      planet: "Mars",
      ruledHouses: [1, 6],
      roles: ["lagna_lord", "mixed"],
      principle:
        "For Scorpio ascendant, Mars rules the 1st and 6th houses. As ascendant lord it strongly represents identity, vitality, courage and personal direction, while the 6th adds work, competition, health, conflict and practical challenges.",
      supportiveThemes: [
        "self",
        "courage",
        "resilience",
        "competition",
        "problem-solving",
      ],
      challengingThemes: [
        "conflict",
        "workload",
        "health pressure",
        "competitiveness",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Scorpio",
      planet: "Mercury",
      ruledHouses: [8, 11],
      roles: ["functional_malefic"],
      principle:
        "For Scorpio ascendant, Mercury rules the 8th and 11th houses, connecting analysis and communication with transformation, hidden matters, shared resources, gains, networks and long-term ambitions.",
      supportiveThemes: [
        "research",
        "analysis",
        "networks",
        "gains",
        "hidden knowledge",
      ],
      challengingThemes: [
        "sudden changes",
        "financial complexity",
        "unstable gains",
        "over-analysis",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Scorpio",
      planet: "Jupiter",
      ruledHouses: [2, 5],
      roles: ["functional_benefic", "maraka"],
      principle:
        "For Scorpio ascendant, Jupiter rules the 2nd and 5th houses. Its 5th-house ownership strongly connects it with intelligence, education, creativity, children and merit, while the 2nd connects it with wealth, family and speech and also carries classical maraka significance.",
      supportiveThemes: [
        "wealth",
        "education",
        "intelligence",
        "children",
        "judgement",
      ],
      challengingThemes: [
        "financial attachment",
        "excess",
        "maraka themes",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Scorpio",
      planet: "Venus",
      ruledHouses: [7, 12],
      roles: ["maraka", "mixed"],
      principle:
        "For Scorpio ascendant, Venus rules the 7th and 12th houses, connecting relationships, partnerships and public dealings with expenditure, foreign environments, privacy, pleasure and release. Its 7th-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "relationships",
        "partnerships",
        "foreign connections",
        "diplomacy",
        "private enjoyment",
      ],
      challengingThemes: [
        "relationship attachment",
        "expenses",
        "withdrawal",
        "maraka themes",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Scorpio",
      planet: "Saturn",
      ruledHouses: [3, 4],
      roles: ["mixed"],
      principle:
        "For Scorpio ascendant, Saturn rules the 3rd and 4th houses, connecting sustained effort, communication and skills with home, property, education and emotional foundations.",
      supportiveThemes: [
        "disciplined effort",
        "property",
        "education",
        "persistence",
        "long-term stability",
      ],
      challengingThemes: [
        "domestic pressure",
        "slow progress",
        "communication burdens",
        "emotional heaviness",
      ],
      confidence: 10,
    },
  },
    Sagittarius: {
    Sun: {
      ascendant: "Sagittarius",
      planet: "Sun",
      ruledHouses: [9],
      roles: ["functional_benefic"],
      principle:
        "For Sagittarius ascendant, the Sun rules the 9th house, connecting authority, confidence and leadership with dharma, fortune, higher learning, teachers and broader guidance.",
      supportiveThemes: [
        "fortune",
        "higher learning",
        "leadership",
        "guidance",
        "principles",
      ],
      challengingThemes: [
        "rigidity in beliefs",
        "pride in one's judgement",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Sagittarius",
      planet: "Moon",
      ruledHouses: [8],
      roles: ["functional_malefic"],
      principle:
        "For Sagittarius ascendant, the Moon rules the 8th house, connecting emotional experience with transformation, vulnerability, shared resources, hidden matters, research and sudden change.",
      supportiveThemes: [
        "research",
        "intuition",
        "transformation",
        "shared resources",
        "deeper understanding",
      ],
      challengingThemes: [
        "emotional instability",
        "sudden changes",
        "uncertainty",
        "hidden concerns",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Sagittarius",
      planet: "Mars",
      ruledHouses: [5, 12],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Sagittarius ascendant, Mars rules the 5th and 12th houses. Its 5th-house ownership connects it with intelligence, creativity, children and merit, while the 12th adds expenditure, foreign environments, private effort and release.",
      supportiveThemes: [
        "intelligence",
        "creativity",
        "children",
        "foreign connections",
        "decisive learning",
      ],
      challengingThemes: [
        "expenses",
        "impulsive speculation",
        "withdrawal",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Sagittarius",
      planet: "Mercury",
      ruledHouses: [7, 10],
      roles: ["maraka", "mixed"],
      principle:
        "For Sagittarius ascendant, Mercury rules the 7th and 10th houses, connecting partnerships, clients and agreements with career, reputation and public responsibility. Its 7th-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "partnerships",
        "clients",
        "career",
        "communication",
        "professional agreements",
      ],
      challengingThemes: [
        "relationship pressure",
        "career over-analysis",
        "maraka themes",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Sagittarius",
      planet: "Jupiter",
      ruledHouses: [1, 4],
      roles: ["lagna_lord", "functional_benefic"],
      principle:
        "For Sagittarius ascendant, Jupiter rules the 1st and 4th houses, connecting identity, vitality, wisdom and personal direction with home, education, property and emotional foundations.",
      supportiveThemes: [
        "self",
        "wisdom",
        "home",
        "education",
        "personal growth",
      ],
      challengingThemes: [
        "overconfidence",
        "excessive idealism",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Sagittarius",
      planet: "Venus",
      ruledHouses: [6, 11],
      roles: ["functional_malefic"],
      principle:
        "For Sagittarius ascendant, Venus rules the 6th and 11th houses, connecting relationships, values and material interests with work, competition, practical challenges, gains, networks and fulfilment of desires.",
      supportiveThemes: [
        "gains",
        "networks",
        "service",
        "practical cooperation",
        "financial opportunities",
      ],
      challengingThemes: [
        "conflict",
        "excessive desires",
        "competition",
        "relationship expectations",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Sagittarius",
      planet: "Saturn",
      ruledHouses: [2, 3],
      roles: ["maraka", "mixed"],
      principle:
        "For Sagittarius ascendant, Saturn rules the 2nd and 3rd houses, connecting wealth, family and speech with effort, communication, skills and persistence. Its 2nd-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "financial discipline",
        "persistent effort",
        "communication",
        "skills",
        "resource management",
      ],
      challengingThemes: [
        "financial restriction",
        "communication pressure",
        "slow progress",
        "maraka themes",
      ],
      confidence: 10,
    },
  },
    Capricorn: {
    Sun: {
      ascendant: "Capricorn",
      planet: "Sun",
      ruledHouses: [8],
      roles: ["functional_malefic"],
      principle:
        "For Capricorn ascendant, the Sun rules the 8th house, connecting authority, confidence and identity with transformation, shared resources, hidden matters, research and sudden change.",
      supportiveThemes: [
        "research",
        "transformation",
        "resilience",
        "hidden knowledge",
        "shared resources",
      ],
      challengingThemes: [
        "sudden changes",
        "authority pressure",
        "uncertainty",
        "financial complexity",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Capricorn",
      planet: "Moon",
      ruledHouses: [7],
      roles: ["maraka", "mixed"],
      principle:
        "For Capricorn ascendant, the Moon rules the 7th house, connecting emotional responsiveness with partnerships, relationships, clients, agreements and public dealings. The 7th house also carries classical maraka significance.",
      supportiveThemes: [
        "relationships",
        "partnerships",
        "clients",
        "cooperation",
        "public interaction",
      ],
      challengingThemes: [
        "relationship fluctuation",
        "emotional dependence",
        "maraka themes",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Capricorn",
      planet: "Mars",
      ruledHouses: [4, 11],
      roles: ["mixed"],
      principle:
        "For Capricorn ascendant, Mars rules the 4th and 11th houses, connecting home, property and emotional foundations with gains, networks, ambitions and fulfilment of desires.",
      supportiveThemes: [
        "property",
        "home",
        "gains",
        "networks",
        "ambition",
      ],
      challengingThemes: [
        "domestic conflict",
        "aggressive pursuit of gains",
        "restlessness",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Capricorn",
      planet: "Mercury",
      ruledHouses: [6, 9],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Capricorn ascendant, Mercury rules the 6th and 9th houses. Its 9th-house ownership strongly connects it with fortune, higher learning and guidance, while the 6th adds work, service, health, competition and practical challenges.",
      supportiveThemes: [
        "fortune",
        "higher learning",
        "problem-solving",
        "service",
        "guidance",
      ],
      challengingThemes: [
        "workload",
        "competition",
        "over-analysis",
        "disputes",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Capricorn",
      planet: "Jupiter",
      ruledHouses: [3, 12],
      roles: ["functional_malefic"],
      principle:
        "For Capricorn ascendant, Jupiter rules the 3rd and 12th houses, connecting knowledge and expansion with communication, initiative, personal effort, expenditure, foreign environments and release.",
      supportiveThemes: [
        "learning",
        "communication",
        "foreign connections",
        "spirituality",
        "independent effort",
      ],
      challengingThemes: [
        "expenses",
        "scattered effort",
        "withdrawal",
        "overextension",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Capricorn",
      planet: "Venus",
      ruledHouses: [5, 10],
      roles: ["yogakaraka", "functional_benefic"],
      principle:
        "For Capricorn ascendant, Venus rules both the 5th house of intelligence, creativity and merit and the 10th house of career, responsibility and public contribution, making Venus a classical yogakaraka.",
      supportiveThemes: [
        "career",
        "creativity",
        "education",
        "intelligence",
        "professional success",
      ],
      challengingThemes: [
        "attachment to recognition",
        "comfort reducing initiative",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Capricorn",
      planet: "Saturn",
      ruledHouses: [1, 2],
      roles: ["lagna_lord", "maraka", "mixed"],
      principle:
        "For Capricorn ascendant, Saturn rules the 1st and 2nd houses. As ascendant lord it strongly represents identity, vitality, discipline and personal direction, while the 2nd connects it with wealth, family and speech and also carries classical maraka significance.",
      supportiveThemes: [
        "self",
        "discipline",
        "financial stability",
        "family responsibility",
        "long-term security",
      ],
      challengingThemes: [
        "financial restriction",
        "heavy responsibility",
        "slow progress",
        "maraka themes",
      ],
      confidence: 10,
    },
  },
    Aquarius: {
    Sun: {
      ascendant: "Aquarius",
      planet: "Sun",
      ruledHouses: [7],
      roles: ["maraka", "mixed"],
      principle:
        "For Aquarius ascendant, the Sun rules the 7th house, connecting authority, confidence and visibility with relationships, partnerships, clients, agreements and public dealings. The 7th house also carries classical maraka significance.",
      supportiveThemes: [
        "partnerships",
        "clients",
        "leadership in relationships",
        "agreements",
        "public interaction",
      ],
      challengingThemes: [
        "ego in relationships",
        "conflict around authority",
        "maraka themes",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Aquarius",
      planet: "Moon",
      ruledHouses: [6],
      roles: ["functional_malefic"],
      principle:
        "For Aquarius ascendant, the Moon rules the 6th house, connecting emotional responsiveness with work, service, health, competition, disputes, obstacles and practical responsibilities.",
      supportiveThemes: [
        "service",
        "problem-solving",
        "daily work",
        "competition",
        "practical care",
      ],
      challengingThemes: [
        "emotional stress",
        "workload",
        "conflict",
        "health concerns",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Aquarius",
      planet: "Mars",
      ruledHouses: [3, 10],
      roles: ["mixed"],
      principle:
        "For Aquarius ascendant, Mars rules the 3rd and 10th houses, connecting courage, initiative, communication and personal effort with career, responsibility, reputation and public contribution.",
      supportiveThemes: [
        "career",
        "initiative",
        "courage",
        "professional action",
        "skills",
      ],
      challengingThemes: [
        "career conflict",
        "impulsive decisions",
        "aggressive communication",
        "overwork",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Aquarius",
      planet: "Mercury",
      ruledHouses: [5, 8],
      roles: ["functional_benefic", "mixed"],
      principle:
        "For Aquarius ascendant, Mercury rules the 5th and 8th houses. Its 5th-house ownership connects it with intelligence, education, creativity, children and merit, while the 8th adds research, transformation, hidden matters and shared resources.",
      supportiveThemes: [
        "intelligence",
        "education",
        "research",
        "creativity",
        "analysis",
      ],
      challengingThemes: [
        "over-analysis",
        "sudden changes",
        "hidden complications",
        "financial complexity",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Aquarius",
      planet: "Jupiter",
      ruledHouses: [2, 11],
      roles: ["maraka", "mixed"],
      principle:
        "For Aquarius ascendant, Jupiter rules the 2nd and 11th houses, connecting wealth, family and speech with gains, networks, ambitions and fulfilment of desires. Its 2nd-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "wealth",
        "income",
        "gains",
        "networks",
        "financial growth",
      ],
      challengingThemes: [
        "financial attachment",
        "excessive desires",
        "overexpansion",
        "maraka themes",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Aquarius",
      planet: "Venus",
      ruledHouses: [4, 9],
      roles: ["yogakaraka", "functional_benefic"],
      principle:
        "For Aquarius ascendant, Venus rules both the 4th house of home, property and emotional foundations and the 9th house of dharma, fortune and higher guidance, making Venus a classical yogakaraka.",
      supportiveThemes: [
        "fortune",
        "property",
        "education",
        "comfort",
        "higher learning",
      ],
      challengingThemes: [
        "attachment to comfort",
        "indulgence",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Aquarius",
      planet: "Saturn",
      ruledHouses: [1, 12],
      roles: ["lagna_lord", "mixed"],
      principle:
        "For Aquarius ascendant, Saturn rules the 1st and 12th houses. As ascendant lord it strongly represents identity, vitality, discipline and personal direction, while the 12th adds expenditure, foreign environments, solitude, reflection and release.",
      supportiveThemes: [
        "self",
        "discipline",
        "resilience",
        "foreign connections",
        "reflection",
      ],
      challengingThemes: [
        "isolation",
        "expenses",
        "heavy responsibilities",
        "withdrawal",
      ],
      confidence: 10,
    },
  },
    Pisces: {
    Sun: {
      ascendant: "Pisces",
      planet: "Sun",
      ruledHouses: [6],
      roles: ["functional_malefic"],
      principle:
        "For Pisces ascendant, the Sun rules the 6th house, connecting authority, confidence and leadership with work, service, health, competition, disputes and practical challenges.",
      supportiveThemes: [
        "service",
        "competition",
        "problem-solving",
        "discipline",
        "overcoming obstacles",
      ],
      challengingThemes: [
        "conflict",
        "work pressure",
        "authority disputes",
        "health responsibilities",
      ],
      confidence: 10,
    },

    Moon: {
      ascendant: "Pisces",
      planet: "Moon",
      ruledHouses: [5],
      roles: ["functional_benefic"],
      principle:
        "For Pisces ascendant, the Moon rules the 5th house, connecting emotional intelligence and responsiveness with education, creativity, children, judgement, merit and self-expression.",
      supportiveThemes: [
        "education",
        "creativity",
        "children",
        "intuition",
        "intelligence",
      ],
      challengingThemes: [
        "emotional attachment to outcomes",
        "fluctuation in creative confidence",
      ],
      confidence: 10,
    },

    Mars: {
      ascendant: "Pisces",
      planet: "Mars",
      ruledHouses: [2, 9],
      roles: ["functional_benefic", "maraka"],
      principle:
        "For Pisces ascendant, Mars rules the 2nd and 9th houses. Its 9th-house ownership strongly connects it with fortune, dharma, higher learning and guidance, while the 2nd connects it with wealth, family and speech and also carries classical maraka significance.",
      supportiveThemes: [
        "fortune",
        "wealth",
        "higher learning",
        "courage",
        "family resources",
      ],
      challengingThemes: [
        "sharp speech",
        "financial impulsiveness",
        "maraka themes",
      ],
      confidence: 10,
    },

    Mercury: {
      ascendant: "Pisces",
      planet: "Mercury",
      ruledHouses: [4, 7],
      roles: ["maraka", "mixed"],
      principle:
        "For Pisces ascendant, Mercury rules the 4th and 7th houses, connecting home, education, property and emotional foundations with relationships, partnerships, clients and agreements. Its 7th-house ownership also carries classical maraka significance.",
      supportiveThemes: [
        "education",
        "home",
        "property",
        "partnerships",
        "communication",
      ],
      challengingThemes: [
        "relationship over-analysis",
        "domestic restlessness",
        "maraka themes",
      ],
      confidence: 10,
    },

    Jupiter: {
      ascendant: "Pisces",
      planet: "Jupiter",
      ruledHouses: [1, 10],
      roles: ["lagna_lord", "functional_benefic"],
      principle:
        "For Pisces ascendant, Jupiter rules the 1st and 10th houses, connecting identity, wisdom, vitality and personal direction directly with career, responsibility, reputation and public contribution.",
      supportiveThemes: [
        "self",
        "wisdom",
        "career",
        "leadership",
        "public responsibility",
      ],
      challengingThemes: [
        "overextension",
        "excessive idealism",
        "taking on too much responsibility",
      ],
      confidence: 10,
    },

    Venus: {
      ascendant: "Pisces",
      planet: "Venus",
      ruledHouses: [3, 8],
      roles: ["functional_malefic"],
      principle:
        "For Pisces ascendant, Venus rules the 3rd and 8th houses, connecting relationships, values and material interests with communication, initiative, personal effort, transformation, hidden matters and shared resources.",
      supportiveThemes: [
        "communication",
        "creative skills",
        "research",
        "transformation",
        "shared resources",
      ],
      challengingThemes: [
        "relationship complexity",
        "financial entanglements",
        "sudden changes",
        "inconsistent effort",
      ],
      confidence: 10,
    },

    Saturn: {
      ascendant: "Pisces",
      planet: "Saturn",
      ruledHouses: [11, 12],
      roles: ["functional_malefic"],
      principle:
        "For Pisces ascendant, Saturn rules the 11th and 12th houses, connecting gains, networks and long-term ambitions with expenditure, foreign environments, solitude, reflection and release.",
      supportiveThemes: [
        "long-term gains",
        "networks",
        "foreign connections",
        "discipline",
        "structured goals",
      ],
      challengingThemes: [
        "delayed gains",
        "expenses",
        "isolation",
        "heavy responsibilities",
      ],
      confidence: 10,
    },
  },
};
export function getFunctionalPlanetRole(
  ascendant: ZodiacSign,
  planet: PlanetName
): FunctionalPlanetRoleKnowledge | undefined {
  return FUNCTIONAL_PLANET_ROLES[ascendant]?.[planet];
}