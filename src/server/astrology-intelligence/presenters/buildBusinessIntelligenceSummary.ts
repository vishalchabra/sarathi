import type {
  AstrologyIntelligenceEngineResult,
} from "../astrologyIntelligenceTypes";

import type {
  BusinessDimensionKey,
} from "../signals/businessSignalTypes";

export type BusinessIntelligenceDimensionSummary = {
  key: BusinessDimensionKey;
  label: string;
  score: number;
  confidence: number;
  strength: string;
  contributors: string[];
};

export type BusinessIntelligenceArchetypeSummary = {
  key: string;
  label: string;
  description: string;
  score: number;
  confidence: number;
  strength: string;
  primaryPlanets: string[];
  supportingPlanets: string[];
  matchedThemes: string[];
  reasons: string[];
};

export type BusinessIntelligenceModelSummary = {
  key: string;
  label: string;
  score: number;
  confidence: number;
  supportingThemes: string[];
  contributors: string[];
};

export type BusinessIntelligenceCautionSummary = {
  key: string;
  label: string;
  score: number;
  confidence: number;
  contributors: string[];
};

export type BusinessIntelligenceSummary = {
  overallScore: number;
  confidence: number;
  strength: string;

  primaryArchetype:
    BusinessIntelligenceArchetypeSummary |
    null;

  secondaryArchetypes:
    BusinessIntelligenceArchetypeSummary[];

  strongestDimensions:
    BusinessIntelligenceDimensionSummary[];

  suitableModels:
    BusinessIntelligenceModelSummary[];

  cautions:
    BusinessIntelligenceCautionSummary[];

  currentActivation: {
    score: number;
    confidence: number;
    strength: string;
    contributors: string[];
    reasons: string[];
  };

  evidenceIds: string[];

  summary: string;
  warnings: string[];
};

function uniqueStrings(
  values: Array<
    string |
    null |
    undefined
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

function mapArchetype(
  archetype:
    AstrologyIntelligenceEngineResult[
      "signals"
    ][
      "businessArchetypes"
    ][
      "archetypes"
    ][number]
): BusinessIntelligenceArchetypeSummary {
  return {
    key:
      archetype.key,

    label:
      archetype.label,

    description:
      archetype.description,

    score:
      archetype.score,

    confidence:
      archetype.confidence,

    strength:
      archetype.strength,

    primaryPlanets:
      archetype.primaryPlanets,

    supportingPlanets:
      archetype.supportingPlanets,

    matchedThemes:
      archetype.matchedThemes
        .slice(
          0,
          10
        ),

    reasons:
      archetype.reasons
        .slice(
          0,
          8
        ),
  };
}

export function buildBusinessIntelligenceSummary(
  intelligence:
    AstrologyIntelligenceEngineResult
): BusinessIntelligenceSummary {
  const business =
    intelligence.signals.business;

  const archetypes =
    intelligence
      .signals
      .businessArchetypes;

  const strongestDimensions =
    Object.values(
      business.dimensions
    )
      .filter(
        (dimension) =>
          dimension.key !==
            "risk_pressure" &&
          dimension.key !==
            "current_activation"
      )
      .sort(
        (
          first,
          second
        ) =>
          second.score -
          first.score
      )
      .slice(
        0,
        5
      )
      .map(
        (dimension) => ({
          key:
            dimension.key,

          label:
            dimension.label,

          score:
            dimension.score,

          confidence:
            dimension.confidence,

          strength:
            dimension.strength,

          contributors:
            dimension.contributors,
        })
      );

  const currentActivation =
    business.dimensions
      .current_activation;

  const primaryArchetype =
    archetypes.primary
      ? mapArchetype(
          archetypes.primary
        )
      : null;

  const secondaryArchetypes =
    archetypes.secondary
      .slice(
        0,
        3
      )
      .map(
        mapArchetype
      );

  const suitableModels =
    business.suitableModels
      .slice(
        0,
        5
      )
      .map(
        (model) => ({
          key:
            model.key,

          label:
            model.label,

          score:
            model.score,

          confidence:
            model.confidence,

          supportingThemes:
            model.supportingThemes
              .slice(
                0,
                8
              ),

          contributors:
            model.contributors,
        })
      );

  const cautions =
    business.cautions
      .slice(
        0,
        6
      )
      .map(
        (caution) => ({
          key:
            caution.key,

          label:
            caution.label,

          score:
            caution.score,

          confidence:
            caution.confidence,

          contributors:
            caution.contributors,
        })
      );

  const evidenceIds =
    uniqueStrings([
      ...business.evidenceIds,

      ...(
        archetypes.primary
          ?.evidenceIds ??
        []
      ),

      ...archetypes.secondary
        .flatMap(
          (archetype) =>
            archetype.evidenceIds
        ),
    ]);

  return {
    overallScore:
      business.score,

    confidence:
      business.confidence,

    strength:
      business.strength,

    primaryArchetype,

    secondaryArchetypes,

    strongestDimensions,

    suitableModels,

    cautions,

    currentActivation: {
      score:
        currentActivation.score,

      confidence:
        currentActivation.confidence,

      strength:
        currentActivation.strength,

      contributors:
        currentActivation.contributors,

      reasons:
        currentActivation.reasons
          .slice(
            0,
            8
          ),
    },

    evidenceIds,

    summary:
      business.summary,

    warnings:
      uniqueStrings([
        ...business.warnings,
        ...archetypes.warnings,
      ]),
  };
}