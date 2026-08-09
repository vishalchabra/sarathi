import type {
  AstrologyEvidence,
} from "../../contracts/evidence";

import type {
  PlanetFact,
} from "../../contracts/facts";

import type {
  KnowledgeRule,
  KnowledgeWeight,
} from "../../knowledge/types";

export type RuleScoreContribution = {
  ruleId: string;
  title: string;
  category: KnowledgeRule["category"];

  rawScore: number;
  weightedScore: number;

  addedThemes: string[];
  strengthenedThemes: string[];
  weakenedThemes: string[];
  removedThemes: string[];
  shadowThemes: string[];

  notes: string[];
  evidenceIds: string[];
};

export type ScoredRuleSet = {
  contributions: RuleScoreContribution[];

  totalRawScore: number;
  totalWeightedScore: number;

  positiveScore: number;
  negativeScore: number;

  evidenceIds: string[];
  warnings: string[];
};

const WEIGHT_MULTIPLIER: Record<
  KnowledgeWeight,
  number
> = {
  very_low: 0.35,
  low: 0.55,
  medium: 0.75,
  high: 1,
  very_high: 1.2,
};

function clamp(
  value: number,
  min = -100,
  max = 100
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    min,
    Math.min(
      max,
      Math.round(value)
    )
  );
}

function uniqueStrings(
  values: Array<
    string | null | undefined
  >
): string[] {
  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            String(
              value ?? ""
            ).trim()
        )
        .filter(Boolean)
    )
  );
}

function getRuleEvidenceIds(params: {
  facts: PlanetFact;
  rule: KnowledgeRule;
  evidence: AstrologyEvidence[];
}): string[] {
  const relevantIds =
    params.evidence
      .filter(
        (record) => {
          if (
            record.planets?.includes(
              params.facts.planet
            )
          ) {
            return true;
          }

          if (
            params.rule.trigger.house !==
              undefined &&
            record.houses?.includes(
              params.rule.trigger.house
            )
          ) {
            return true;
          }

          if (
            params.rule.trigger.sign &&
            record.signs?.includes(
              params.rule.trigger.sign
            )
          ) {
            return true;
          }

        if (
  params.rule.trigger.varga?.chart &&
  record.charts?.includes(
    params.rule.trigger.varga.chart
  )
) {
  return true;
}

          return false;
        }
      )
      .map(
        (record) =>
          record.id
      );

  return uniqueStrings([
    ...params.facts.evidenceIds,
    ...relevantIds,
  ]);
}

export function scoreRules(params: {
  facts: PlanetFact;
  rules: KnowledgeRule[];
  evidence: AstrologyEvidence[];
}): ScoredRuleSet {
  const contributions: RuleScoreContribution[] = [];
  const warnings: string[] = [];

  for (
    const rule of
    params.rules
  ) {
    const multiplier =
      WEIGHT_MULTIPLIER[
        rule.weight
      ] ?? 1;

    const rawScore =
      clamp(
        rule.effect.score
      );

    const priorityFactor =
      Math.max(
        0.5,
        Math.min(
          1.5,
          rule.priority /
            100
        )
      );

    const weightedScore =
      clamp(
        rawScore *
          multiplier *
          priorityFactor
      );

    const evidenceIds =
      getRuleEvidenceIds({
        facts:
          params.facts,

        rule,

        evidence:
          params.evidence,
      });

    if (
      evidenceIds.length ===
      0
    ) {
      warnings.push(
        `Rule ${rule.id} matched without traceable evidence.`
      );
    }

    contributions.push({
      ruleId:
        rule.id,

      title:
        rule.title,

      category:
        rule.category,

      rawScore,

      weightedScore,

      addedThemes:
        uniqueStrings(
          rule.effect.adds ??
          []
        ),

      strengthenedThemes:
        uniqueStrings(
          rule.effect
            .strengthens ??
          []
        ),

      weakenedThemes:
        uniqueStrings(
          rule.effect.weakens ??
          []
        ),

      removedThemes:
        uniqueStrings(
          rule.effect.removes ??
          []
        ),

      shadowThemes:
        uniqueStrings(
          rule.effect
            .shadowAdds ??
          []
        ),

      notes:
        uniqueStrings(
          rule.effect.notes ??
          []
        ),

      evidenceIds,
    });
  }

  const totalRawScore =
    contributions.reduce(
      (
        sum,
        contribution
      ) =>
        sum +
        contribution.rawScore,
      0
    );

  const totalWeightedScore =
    contributions.reduce(
      (
        sum,
        contribution
      ) =>
        sum +
        contribution
          .weightedScore,
      0
    );

  const positiveScore =
    contributions
      .filter(
        (contribution) =>
          contribution
            .weightedScore >
          0
      )
      .reduce(
        (
          sum,
          contribution
        ) =>
          sum +
          contribution
            .weightedScore,
        0
      );

  const negativeScore =
    Math.abs(
      contributions
        .filter(
          (contribution) =>
            contribution
              .weightedScore <
            0
        )
        .reduce(
          (
            sum,
            contribution
          ) =>
            sum +
            contribution
              .weightedScore,
          0
        )
    );

  return {
    contributions,

    totalRawScore,
    totalWeightedScore,

    positiveScore,
    negativeScore,

    evidenceIds:
      uniqueStrings(
        contributions.flatMap(
          (contribution) =>
            contribution
              .evidenceIds
        )
      ),

    warnings,
  };
}
