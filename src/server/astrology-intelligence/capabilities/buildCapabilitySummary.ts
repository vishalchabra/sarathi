import type {
  Capability,
  CapabilityStore,
} from "../capabilities/types";

export type CapabilitySummaryItem = {
  key: string;
  label: string;
  description: string;
  category: string;

  score: number;
  confidence: number;
  strength: string;

  contributors: string[];
  supportingThemes: string[];

  limitations: Array<{
    label: string;
    score: number;
    contributors: string[];
  }>;

  activation: {
    currentlyActive: boolean;
    score: number;
    activePlanets: string[];
    activeThemes: string[];
  };

  summary: string;
};

export type CapabilitySummary = {
  strongest:
    CapabilitySummaryItem[];

  byCategory:
    Record<
      string,
      CapabilitySummaryItem[]
    >;

  warnings:
    string[];
};

function mapCapability(
  capability:
    Capability
): CapabilitySummaryItem {
  return {
    key:
      capability.key,

    label:
      capability.label,

    description:
      capability.description,

    category:
      capability.category,

    score:
      capability.score,

    confidence:
      capability.confidence,

    strength:
      capability.strength,

    contributors:
      capability.contributors,

    supportingThemes:
      capability.supportingThemes
        .slice(
          0,
          8
        ),

    limitations:
      capability.limitations
        .slice(
          0,
          4
        )
        .map(
          (item) => ({
            label:
              item.label,

            score:
              item.score,

            contributors:
              item.contributors,
          })
        ),

    activation: {
      currentlyActive:
        capability
          .activation
          .currentlyActive,

      score:
        capability
          .activation
          .score,

      activePlanets:
        capability
          .activation
          .activePlanets,

      activeThemes:
        capability
          .activation
          .activeThemes
          .slice(
            0,
            6
          ),
    },

    summary:
      capability.summary,
  };
}

export function buildCapabilitySummary(
  store:
    CapabilityStore
): CapabilitySummary {
  const byCategory:
    Record<
      string,
      CapabilitySummaryItem[]
    > = {};

  for (
    const capability of
    store.capabilities
  ) {
    const category =
      capability.category;

    if (
      !byCategory[
        category
      ]
    ) {
      byCategory[
        category
      ] = [];
    }

    byCategory[
      category
    ].push(
      mapCapability(
        capability
      )
    );
  }

  for (
    const category of
    Object.keys(
      byCategory
    )
  ) {
    byCategory[
      category
    ] =
      byCategory[
        category
      ].slice(
        0,
        6
      );
  }

  return {
    strongest:
      store.strongest
        .slice(
          0,
          10
        )
        .map(
          mapCapability
        ),

    byCategory,

    warnings:
      store.warnings,
  };
}