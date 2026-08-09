import type {
  Dignity,
  PlanetFact,
} from "../../contracts/facts";

import type {
  KnowledgeRule,
  KnowledgeWeight,
} from "../../knowledge/types";

import {
  DIVISIONAL_CHART_PROFILE_BY_KEY,
} from "../../knowledge/divisionalCharts";

function unique(
  values: string[]
): string[] {
  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            value.trim()
        )
        .filter(Boolean)
    )
  );
}

function isStrongDignity(
  dignity: Dignity
): boolean {
  return (
    dignity === "exalted" ||
    dignity === "moolatrikona" ||
    dignity === "own" ||
    dignity === "friend"
  );
}

function isWeakDignity(
  dignity: Dignity
): boolean {
  return (
    dignity === "enemy" ||
    dignity === "debilitated"
  );
}

function weightForPlacement(
  dignity: Dignity,
  confidenceWeight: number
): KnowledgeWeight {
  if (
    dignity === "exalted" ||
    dignity === "moolatrikona" ||
    dignity === "own"
  ) {
    return "high";
  }

  if (
    dignity === "debilitated"
  ) {
    return "high";
  }

  if (
    confidenceWeight >=
    9
  ) {
    return "medium";
  }

  return "low";
}

export function buildSharedVargaRules(
  facts: PlanetFact
): KnowledgeRule[] {
  const rules:
    KnowledgeRule[] = [];

  for (
    const placement of
    facts.vargas
  ) {
    const profile =
      DIVISIONAL_CHART_PROFILE_BY_KEY[
        placement.chart
      ];

    if (!profile) {
      continue;
    }

    const strong =
      isStrongDignity(
        placement.dignity
      );

    const weak =
      isWeakDignity(
        placement.dignity
      );

    const adds =
      unique([
        ...profile.represents,
        ...profile.capabilityThemes,
      ]);

    const strengthens =
      strong
        ? unique([
            ...profile.capabilityThemes,
            ...profile.strongExpression,
          ])
        : profile.capabilityThemes;

    const weakens =
      weak
        ? unique([
            ...profile.capabilityThemes,
            ...profile.weakExpression,
          ])
        : [];

    rules.push({
      id:
        `${facts.planet.toLowerCase()}_shared_varga_${placement.chart.toLowerCase()}`,

      category:
        profile.primaryCategory,

      title:
        `${facts.planet} in ${placement.chart} (${profile.name})`,

      description:
        `${profile.name} (${placement.chart}) evaluates ${profile.purpose.toLowerCase()} ${facts.planet} is placed in ${placement.sign ?? "an unresolved sign"}${placement.house !== null ? ` in house ${placement.house}` : ""}, with ${placement.dignity} dignity.`,

      weight:
        weightForPlacement(
          placement.dignity,
          profile.confidenceWeight
        ),

      priority:
        72 +
        profile.confidenceWeight +
        (
          strong ||
          weak
            ? 3
            : 0
        ),

      trigger: {
        varga: {
          chart:
            placement.chart,

          ...(placement.sign
            ? {
                sign:
                  placement.sign,
              }
            : {}),

          ...(placement.house !== null
            ? {
                house:
                  placement.house,
              }
            : {}),

          dignity:
            placement.dignity,
        },
      },

      effect: {
        score:
          strong
            ? profile.confidenceWeight + 3
            : weak
              ? -(profile.confidenceWeight + 2)
              : profile.confidenceWeight,

        adds,

        strengthens:
          strong
            ? strengthens
            : undefined,

        weakens:
          weak
            ? weakens
            : undefined,

        notes: [
          `${placement.chart}: ${profile.purpose}`,
          `Relevant domains: ${profile.represents.join(", ")}.`,
          `Capability vocabulary: ${profile.capabilityThemes.join(", ")}.`,
          strong
            ? `The ${placement.dignity} dignity strengthens this divisional expression.`
            : weak
              ? `The ${placement.dignity} dignity introduces friction in this divisional expression.`
              : "The divisional placement acts as a confirmation or modification layer rather than replacing the D1 promise.",
          placement.chart === "D60"
            ? "D60 should be weighted conservatively unless birth-time accuracy is exceptionally reliable."
            : "D1 remains the primary natal promise; this varga modifies or confirms that promise.",
        ],
      },
    });
  }

  return rules;
}