import type {
  PlanetFact,
} from "../../contracts/facts";

import type {
  KnowledgeRule,
} from "../../knowledge/types";

import {
  getTransitActivationProfile,
} from "../../knowledge/transits";

export function buildSharedTransitRules(
  facts: PlanetFact
): KnowledgeRule[] {
  if (
    !facts.currentTransitActive
  ) {
    return [];
  }

  const profile =
    getTransitActivationProfile(
      facts.planet
    );

  return [
    {
      id:
        `${facts.planet.toLowerCase()}_shared_transit_activation`,

      category:
        "strength",

      title:
        `${facts.planet} activated by transit`,

      description:
        `${facts.planet} is active in the current transit layer, temporarily emphasizing themes of ${profile.themes
          .slice(0, 4)
          .join(", ")}.`,

      weight:
        profile.score >= 8
          ? "high"
          : "medium",

      priority:
        82,

      trigger: {
        currentTransit:
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
          `Transit activation themes: ${profile.themes.join(", ")}.`,
          `Capability vocabulary: ${profile.capabilityThemes.join(", ")}.`,
          `Constructive expression: ${profile.constructiveExpression.join(", ")}.`,
          `Potential shadow: ${profile.shadowExpression.join(", ")}.`,
          "This is a temporary activation layer. It does not replace natal promise.",
          "Dasha support, natal condition, house relevance, sambandha and varga confirmation remain necessary for stronger event judgement.",
        ],
      },
    },
  ];
}