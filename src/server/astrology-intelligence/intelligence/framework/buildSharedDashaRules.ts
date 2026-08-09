import type {
  PlanetFact,
} from "../../contracts/facts";

import type {
  KnowledgeRule,
} from "../../knowledge/types";

import {
  getDashaActivationProfile,
} from "../../knowledge/dashas";

export function buildSharedDashaRules(
  facts: PlanetFact
): KnowledgeRule[] {
  if (
    !facts.currentDashaActive
  ) {
    return [];
  }

  const profile =
    getDashaActivationProfile(
      facts.planet
    );

  return [
    {
      id:
        `${facts.planet.toLowerCase()}_shared_dasha_activation`,

      category:
        "strength",

      title:
        `${facts.planet} activated by dasha`,

      description:
        `${facts.planet} is active in the current dasha chain, increasing the expression of its natal promise and its themes of ${profile.themes
          .slice(0, 4)
          .join(", ")}.`,

      weight:
        profile.score >= 9
          ? "high"
          : "medium",

      priority:
        88,

      trigger: {
        currentDasha:
          true,
      },

      effect: {
        score:
          profile.score,

        adds:
          profile.themes,

        strengthens:
          profile.capabilityThemes,

        shadowAdds:
          profile.shadowExpression,

        notes: [
          `Dasha activation themes: ${profile.themes.join(", ")}.`,
          `Capability vocabulary: ${profile.capabilityThemes.join(", ")}.`,
          `Constructive expression: ${profile.constructiveExpression.join(", ")}.`,
          `Potential shadow: ${profile.shadowExpression.join(", ")}.`,
          "This rule indicates activation, not a standalone prediction. Natal condition, house lordship, sambandha, varga confirmation and transit context remain necessary.",
        ],
      },
    },
  ];
}