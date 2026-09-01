// FILE: src/server/sarathi/reasoning/houseReasoning.ts

import type {
  ReasoningItem,
  ReasoningSection,
  ReasoningRole,
} from "./types";

type HouseDefinition = {
  meaning: string;
  practicalMeaning: string;
};
type HouseContext = {
  explanation?: string;
  practicalMeaning?: string;
  eventLanguage?: string;
};
const HOUSE_MEANINGS: Record<number, HouseDefinition> = {
  1: {
    meaning:
      "self, identity, body, initiative, personal direction",
    practicalMeaning:
      "brings the matter directly into the person's own decisions, priorities, confidence, or visible life direction",
  },

  2: {
    meaning:
      "money, family resources, speech, accumulated assets",
    practicalMeaning:
      "can affect savings, financial commitments, family resources, accumulated wealth, or the ability to fund the event",
  },

  3: {
    meaning:
      "effort, courage, communication, skills, initiative",
    practicalMeaning:
      "supports taking practical action, making contact, negotiating, learning, networking, and moving from thought into effort",
  },

  4: {
    meaning:
      "home, property, residence, emotional security, vehicles",
    practicalMeaning:
      "directly activates home, property, settlement, domestic comfort, residence, or vehicle-related matters",
  },

  5: {
    meaning:
      "creativity, intelligence, children, speculation, personal expression",
    practicalMeaning:
      "can support creative decisions, planning, learning, children-related matters, risk-taking, or personal expression",
  },

  6: {
    meaning:
      "work, competition, service, debt, obstacles, health routines",
    practicalMeaning:
      "brings practical work, competition, repayment, problem-solving, service obligations, or the need to overcome obstacles",
  },

  7: {
    meaning:
      "partnerships, agreements, clients, marriage, public dealings",
    practicalMeaning:
      "increases the importance of partnerships, negotiations, contracts, customers, marriage, or dealing directly with other people",
  },

  8: {
    meaning:
      "change, shared resources, uncertainty, transformation, inheritance",
    practicalMeaning:
      "can bring deeper change, shared finances, hidden complications, joint resources, inheritance, or situations requiring adjustment",
  },

  9: {
    meaning:
      "fortune, higher learning, mentors, travel, beliefs",
    practicalMeaning:
      "can broaden opportunities through mentors, travel, learning, guidance, belief systems, or fortunate circumstances",
  },

  10: {
    meaning:
      "career, status, responsibility, achievement, public role",
    practicalMeaning:
      "directly influences career movement, visibility, responsibility, leadership, reputation, and professional outcomes",
  },

  11: {
    meaning:
      "gains, income, networks, fulfilment, results",
    practicalMeaning:
      "supports gains, fulfilment of goals, income, professional networks, approvals, rewards, or visible results",
  },

  12: {
    meaning:
      "expenses, foreign matters, withdrawal, endings, private activity",
    practicalMeaning:
      "can involve expenditure, foreign connections, private preparation, closure, relocation, or activity happening behind the scenes",
  },
};

function normalizeHouse(
  value: unknown
): number | null {
  const n = Number(value);

  if (
    Number.isInteger(n) &&
    n >= 1 &&
    n <= 12
  ) {
    return n;
  }

  return null;
}

export function buildHouseReasoning(params: {
  houses?: number[];
  primaryHouses?: number[];
  challengingHouses?: number[];
  houseContexts?: Record<
    number,
    HouseContext
  >;
  source?: string;
}): ReasoningSection {
  const {
  houses = [],
  primaryHouses = [],
  challengingHouses = [],
  houseContexts = {},
  source =
    "event houses and active chart factors",
} = params;

  const normalizedPrimary =
    new Set(
      primaryHouses
        .map(normalizeHouse)
        .filter(
          (x): x is number =>
            x !== null
        )
    );

  const normalizedChallenging =
    new Set(
      challengingHouses
        .map(normalizeHouse)
        .filter(
          (x): x is number =>
            x !== null
        )
    );

  const uniqueHouses = [
    ...new Set(
      houses
        .map(normalizeHouse)
        .filter(
          (x): x is number =>
            x !== null
        )
    ),
  ];

  const items: ReasoningItem[] =
  uniqueHouses.flatMap(
    (house): ReasoningItem[] => {
      const definition =
        HOUSE_MEANINGS[house];

      if (!definition) {
        return [];
      }
    const context =
  houseContexts[house] ??
  null;
  const eventLanguage =
  String(
    context?.eventLanguage ?? ""
  ).trim();

const houseSpecificMeaning =
  String(
    definition.practicalMeaning ??
    definition.meaning ??
    ""
  ).trim();
      let role: ReasoningRole =
        "supporting";

      if (
        normalizedPrimary.has(house)
      ) {
        role = "primary";
      }

      if (
        normalizedChallenging.has(
          house
        )
      ) {
        role = "challenging";
      }

      const confidence:
        ReasoningItem["confidence"] =
        role === "primary"
          ? "high"
          : "medium";

      return [
        {
          id: `house:${house}`,

          title:
            `House ${house}`,

          explanation:
  context?.explanation ??
  definition.meaning,

practicalMeaning:
  context
    ? role === "primary"
      ? `${context.practicalMeaning ?? ""} Its specific role is ${houseSpecificMeaning}${
          eventLanguage
            ? `. In this event model, this contributes to ${eventLanguage}`
            : ""
        }.`
      : `${context.practicalMeaning ?? ""} It contributes through ${houseSpecificMeaning}${
          eventLanguage
            ? ` within the wider process of ${eventLanguage}`
            : ""
        }.`
    : definition.practicalMeaning,

          role,

          confidence,

          source,
        },
      ];
    }
  );

  return {
    id: "house",

    heading:
      "House reasoning",

    summary:
      items.length
        ? "These houses explain which areas of life are carrying the event and how the prediction is likely to manifest."
        : "No meaningful house reasoning factors were available.",

    confidence:
      items.some(
        (item) =>
          item.role === "primary"
      )
        ? "high"
        : "medium",

    source,

    items,
  };
}