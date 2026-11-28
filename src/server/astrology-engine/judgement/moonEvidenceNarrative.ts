export type MoonNatalConnection = {
  planet: string;
  source: "nakshatra_lord" | "navamsa_lord";
  placementHouse: number | null;
  ruledHouses: number[];
};

export type MoonEvidenceNarrativeInput = {
  area: string;
  basePrediction: string;
  transitHouse?: number | null;
  natalConnectedHouses?: number[];
  natalConnections?: MoonNatalConnection[];
  evidenceTier?: string | null;
};

type HouseTheme = {
  focus: string;
  responsibility: string;
};

const HOUSE_THEMES: Record<number, HouseTheme> = {
  1: {
    focus: "personal priorities",
    responsibility: "your own needs and responses",
  },
  2: {
    focus: "financial security and family values",
    responsibility: "resources, commitments and communication",
  },
  3: {
    focus: "communication and initiative",
    responsibility: "the way you express yourself and take action",
  },
  4: {
    focus: "home and emotional security",
    responsibility: "domestic needs and personal stability",
  },
  5: {
    focus: "creativity and emotional expression",
    responsibility: "personal expectations and matters close to your heart",
  },
  6: {
    focus: "daily responsibilities",
    responsibility: "practical demands and matters requiring resolution",
  },
  7: {
    focus: "partnerships and cooperation",
    responsibility: "mutual expectations and one-to-one interactions",
  },
  8: {
    focus: "shared obligations and adjustments",
    responsibility: "uncertainty, dependencies and sensitive matters",
  },
  9: {
    focus: "learning and perspective",
    responsibility: "beliefs, guidance and longer-term considerations",
  },
  10: {
    focus: "professional responsibilities",
    responsibility: "work priorities and external commitments",
  },
  11: {
    focus: "social connections and aspirations",
    responsibility: "networks, support and longer-term goals",
  },
  12: {
    focus: "rest and reflection",
    responsibility: "private concerns and the need for perspective",
  },
};

const AREA_CONTEXT: Record<
  string,
  {
    subject: string;
    action: string;
  }
> = {
  mind: {
    subject: "Your mental and emotional focus",
    action: "Give yourself space to identify what genuinely needs attention.",
  },
  home: {
    subject: "Home and domestic priorities",
    action: "Focus on the practical matter that most needs organising.",
  },
  family: {
    subject: "Family relationships and responsibilities",
    action: "Consider what support or communication is actually needed.",
  },
  relationships: {
    subject: "Personal relationships and one-to-one interactions",
    action: "Listen carefully and clarify expectations before responding.",
  },
  money: {
    subject: "Financial priorities and resource management",
    action: "Review the practical implications before making a commitment.",
  },
  career: {
    subject: "Professional priorities",
    action: "Identify the responsibility that deserves your immediate attention.",
  },
  education: {
    subject: "Learning and educational priorities",
    action: "Focus on the task that will support steady progress.",
  },
  health: {
    subject: "Health and daily wellbeing",
    action: "Pay attention to your routine and avoid unnecessary strain.",
  },
  children: {
    subject: "Matters involving children or personal responsibilities",
    action: "Respond to actual needs rather than anticipating difficulties.",
  },
  travel: {
    subject: "Travel and movement-related plans",
    action: "Review arrangements and practical requirements carefully.",
  },
};

function isValidHouse(
  house: number | null | undefined
): house is number {
  return (
    typeof house === "number" &&
    Number.isInteger(house) &&
    house >= 1 &&
    house <= 12
  );
}

export function composeMoonEvidenceNarrative(
  input: MoonEvidenceNarrativeInput
): string {
  const {
    area,
    basePrediction,
    transitHouse,
    natalConnectedHouses = [],
    natalConnections = [],
    evidenceTier,
  } = input;

  if (
    evidenceTier !== "PRIMARY_CONVERGENCE" &&
    evidenceTier !== "REINFORCED"
  ) {
    return basePrediction;
  }

  const areaContext = AREA_CONTEXT[area];

  if (!areaContext) {
    return basePrediction;
  }

  const orderedConnections = [
    ...natalConnections.filter(
      (connection) => connection.source === "nakshatra_lord"
    ),
    ...natalConnections.filter(
      (connection) => connection.source === "navamsa_lord"
    ),
  ];

  const placementHouses = orderedConnections
    .map((connection) => connection.placementHouse)
    .filter(isValidHouse);

  const lordshipHouses = orderedConnections.flatMap(
    (connection) => connection.ruledHouses.filter(isValidHouse)
  );

  const connectedHouses = [
    ...new Set([
      ...placementHouses,
      ...lordshipHouses,
    ]),
  ];

  const fallbackHouses = natalConnectedHouses.filter(isValidHouse);

  const relevantHouses =
    connectedHouses.length > 0
      ? connectedHouses
      : [...new Set(fallbackHouses)];

  if (relevantHouses.length === 0) {
    return basePrediction;
  }

  const primaryHouse = relevantHouses[0];
  const secondaryHouse = relevantHouses.find(
    (house) => house !== primaryHouse
  );

  const primaryTheme = HOUSE_THEMES[primaryHouse];

  if (!primaryTheme) {
    return basePrediction;
  }

  const secondaryTheme =
    secondaryHouse !== undefined
      ? HOUSE_THEMES[secondaryHouse]
      : null;

  const transitTheme = isValidHouse(transitHouse)
    ? HOUSE_THEMES[transitHouse]
    : null;

  const opening =
    `${areaContext.subject} may require greater awareness today.`;

  const connection =
    secondaryTheme
      ? `The chart connects this area with ` +
        `${primaryTheme.focus} and ${secondaryTheme.focus}, ` +
        `suggesting that these considerations may need to be balanced.`
      : `The chart connects this area with ` +
        `${primaryTheme.focus}, making this a useful theme to consider.`;

  const transit =
    transitTheme
      ? `The Moon's transit also highlights ` +
        `${transitTheme.focus}.`
      : "";

  return [
    opening,
    connection,
    transit,
    areaContext.action,
  ]
    .filter(Boolean)
    .join(" ");
}