// FILE: src/server/sarathi/reasoning/planetReasoning.ts

import type {
  ReasoningItem,
  ReasoningSection,
  ReasoningRole,
} from "./types";

type PlanetDefinition = {
  meaning: string;
  practicalMeaning: string;
};
type PlanetContext = {
  explanation?: string;
  practicalMeaning?: string;
};
const PLANET_MEANINGS: Record<
  string,
  PlanetDefinition
> = {
  Sun: {
    meaning:
      "authority, visibility, leadership, identity",
    practicalMeaning:
      "can increase visibility, leadership responsibility, recognition, or the need to act decisively",
  },

  Moon: {
    meaning:
      "mind, emotions, adaptability, public response",
    practicalMeaning:
      "can heighten emotional involvement, responsiveness, public interaction, or changes in personal priorities",
  },

  Mars: {
    meaning:
      "initiative, courage, competition, execution",
    practicalMeaning:
      "can increase drive, willingness to act, competition, and the ability to move plans into execution",
  },

  Mercury: {
    meaning:
      "thinking, communication, negotiation, commerce",
    practicalMeaning:
      "can support discussions, agreements, analysis, interviews, sales, networking, and commercial judgement",
  },

  Jupiter: {
    meaning:
      "growth, opportunity, wisdom, expansion",
    practicalMeaning:
      "can broaden opportunities, confidence, learning, support, and long-term growth potential",
  },

  Venus: {
    meaning:
      "relationships, value, attraction, comfort",
    practicalMeaning:
      "can support cooperation, value creation, attraction, comfort, partnerships, and material quality depending on the topic",
  },

  Saturn: {
    meaning:
      "discipline, responsibility, delay, stability",
    practicalMeaning:
      "can demand patience and sustained effort while building structure, responsibility, and longer-term stability",
  },

  Rahu: {
    meaning:
      "ambition, disruption, unconventional growth, foreign influence",
    practicalMeaning:
      "can push experimentation, unconventional opportunities, foreign connections, technology, or unusually strong ambition",
  },

  Ketu: {
    meaning:
      "detachment, specialization, introspection, separation",
    practicalMeaning:
      "can create withdrawal from old patterns, specialization, reassessment, or a need to simplify direction",
  },
};

function normalizePlanet(
  value: unknown
): string {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();

  if (!raw) return "";

  return (
    Object.keys(PLANET_MEANINGS).find(
      (planet) =>
        planet.toLowerCase() === raw
    ) ?? ""
  );
}

export function buildPlanetReasoning(params: {
  planets?: string[];
  primaryPlanets?: string[];
  challengingPlanets?: string[];
  planetContexts?: Record<
    string,
    PlanetContext
  >;
  source?: string;
}): ReasoningSection {
  const {
  planets = [],
  primaryPlanets = [],
  challengingPlanets = [],
  planetContexts = {},
  source =
    "event karakas and active timing factors",
} = params;

  const normalizedPrimary =
    new Set(
      primaryPlanets
        .map(normalizePlanet)
        .filter(Boolean)
    );

  const normalizedChallenging =
    new Set(
      challengingPlanets
        .map(normalizePlanet)
        .filter(Boolean)
    );

  const uniquePlanets = [
    ...new Set(
      planets
        .map(normalizePlanet)
        .filter(Boolean)
    ),
  ];

  const items: ReasoningItem[] =
    uniquePlanets
      .map((planet) => {
        const definition =
          PLANET_MEANINGS[planet];

        if (!definition) {
          return null;
        }
     const context =
  planetContexts[planet] ??
  planetContexts[
    planet.toLowerCase()
  ] ??
  null;
        let role: ReasoningRole =
          "supporting";

        if (
          normalizedPrimary.has(planet)
        ) {
          role = "primary";
        }

        if (
          normalizedChallenging.has(
            planet
          )
        ) {
          role = "challenging";
        }

        const item: ReasoningItem = {
  id: `planet:${planet.toLowerCase()}`,

  title: planet,

  explanation:
    context?.explanation ??
    definition.meaning,

  practicalMeaning:
    context?.practicalMeaning ??
    definition.practicalMeaning,

  role,

  confidence:
    role === "primary"
      ? "high"
      : role === "challenging"
      ? "medium"
      : "medium",

  source,
};

        return item;
      })
      .filter(
        (
          item
        ): item is ReasoningItem =>
          item !== null
      );

 return {
    id: "planet",

    heading: "Planetary reasoning",

    summary:
        items.length > 0
            ? "These planetary factors explain how the event develops."
            : "No meaningful planetary reasoning factors were available.",

    confidence:
        items.some(i => i.role === "primary")
            ? "high"
            : "medium",

    source:
        "event karakas and active timing factors",

    items,
};
}