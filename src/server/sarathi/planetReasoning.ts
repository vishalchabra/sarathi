export type PlanetReasoningItem = {
  planet: string;
  meaning: string;
  practicalMeaning: string;
  role: "primary" | "supporting" | "challenging";
  source: string;
};

const PLANET_MEANINGS: Record<string, {
  meaning: string;
  practicalMeaning: string;
}> = {
  Sun: {
    meaning: "authority, visibility, leadership, identity",
    practicalMeaning:
      "can increase visibility, leadership responsibility, recognition, or the need to act decisively",
  },

  Moon: {
    meaning: "mind, emotions, adaptability, public response",
    practicalMeaning:
      "can heighten emotional involvement, responsiveness, public interaction, or changes in personal priorities",
  },

  Mars: {
    meaning: "initiative, courage, competition, execution",
    practicalMeaning:
      "can increase drive, willingness to act, competition, and the ability to move plans into execution",
  },

  Mercury: {
    meaning: "thinking, communication, negotiation, commerce",
    practicalMeaning:
      "can support discussions, agreements, analysis, interviews, sales, networking, and commercial judgement",
  },

  Jupiter: {
    meaning: "growth, opportunity, wisdom, expansion",
    practicalMeaning:
      "can broaden opportunities, confidence, learning, support, and long-term growth potential",
  },

  Venus: {
    meaning: "relationships, value, attraction, comfort",
    practicalMeaning:
      "can support partnerships, customer attraction, financial value, cooperation, and relationship-building",
  },

  Saturn: {
    meaning: "discipline, responsibility, delay, stability",
    practicalMeaning:
      "can demand patience and sustained effort while building structure, responsibility, and longer-term stability",
  },

  Rahu: {
    meaning: "ambition, disruption, unconventional growth, foreign influence",
    practicalMeaning:
      "can push rapid experimentation, unconventional opportunities, foreign connections, technology, or strong ambition",
  },

  Ketu: {
    meaning: "detachment, specialization, introspection, separation",
    practicalMeaning:
      "can create withdrawal from old patterns, specialization, reassessment, or a need to simplify direction",
  },
};

export function buildPlanetReasoning(params: {
  planets?: string[];
  primaryPlanets?: string[];
  challengingPlanets?: string[];
  source?: string;
}): PlanetReasoningItem[] {
  const {
    planets = [],
    primaryPlanets = [],
    challengingPlanets = [],
    source = "astrology engine",
  } = params;

  const uniquePlanets = [
    ...new Set(
      planets
        .map((p) => String(p ?? "").trim())
        .filter(Boolean)
    ),
  ];

  return uniquePlanets
    .map((planet) => {
      const definition =
        PLANET_MEANINGS[planet];

      if (!definition) {
        return null;
      }

      let role: PlanetReasoningItem["role"] =
        "supporting";

      if (primaryPlanets.includes(planet)) {
        role = "primary";
      }

      if (challengingPlanets.includes(planet)) {
        role = "challenging";
      }

      return {
        planet,
        meaning: definition.meaning,
        practicalMeaning:
          definition.practicalMeaning,
        role,
        source,
      };
    })
    .filter(
      (
        item
      ): item is PlanetReasoningItem =>
        Boolean(item)
    );
}