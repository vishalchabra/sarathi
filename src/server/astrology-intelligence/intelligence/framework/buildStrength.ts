import type {
  IntelligenceStrength,
  IntelligenceTheme,
  PlanetStrengthAssessment,
} from "../../contracts/planetIntelligence";

import type {
  PlanetFact,
} from "../../contracts/facts";

import type {
  ScoredRuleSet,
} from "./scoreRules";

import type {
  ThemeBuildResult,
} from "./buildThemes";

export type StrengthBuildResult = {
  assessment: PlanetStrengthAssessment;
  positiveScore: number;
  negativeScore: number;
  netScore: number;
  strongestAreas: IntelligenceTheme[];
  weakestAreas: IntelligenceTheme[];
  evidenceIds: string[];
  warnings: string[];
};

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function uniqueStrings(
  values: Array<string | null | undefined>
): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    )
  );
}

function verdictFromScore(
  score: number
): IntelligenceStrength {
  if (score >= 85) return "very_strong";
  if (score >= 68) return "strong";
  if (score >= 48) return "moderate";
  if (score >= 28) return "weak";
  return "damaged";
}

function dignityAdjustment(
  facts: PlanetFact
): number {
  switch (facts.dignity) {
    case "exalted":
      return 18;
    case "moolatrikona":
      return 16;
    case "own":
      return 14;
    case "friend":
      return 7;
    case "neutral":
      return 2;
    case "enemy":
      return -8;
    case "debilitated":
      return -18;
    default:
      return 0;
  }
}

function conditionAdjustment(
  facts: PlanetFact
): number {
  let adjustment = 0;

  if (facts.retrograde) adjustment += 1;
  if (facts.combust) adjustment -= 12;
  if (facts.vargottama) adjustment += 12;

  return adjustment;
}

function vargaAdjustment(
  facts: PlanetFact
): number {
  if (facts.vargas.length === 0) return 0;

  const supportive = facts.vargas.filter(
    (placement) =>
      placement.dignity === "exalted" ||
      placement.dignity === "moolatrikona" ||
      placement.dignity === "own" ||
      placement.dignity === "friend"
  ).length;

  const difficult = facts.vargas.filter(
    (placement) =>
      placement.dignity === "enemy" ||
      placement.dignity === "debilitated"
  ).length;

  return Math.max(
    -10,
    Math.min(10, supportive * 2 - difficult * 3)
  );
}

function activationAdjustment(
  facts: PlanetFact
): number {
  let adjustment = 0;

  if (facts.currentDashaActive) adjustment += 8;
  if (facts.currentTransitActive) adjustment += 4;
  if (facts.futureActivationWindows.length > 0) adjustment += 2;

  return adjustment;
}

function baseStrengthFromFacts(
  facts: PlanetFact
): number {
  const reportedStrength =
    Number.isFinite(facts.strengthScore)
      ? facts.strengthScore
      : 50;

  // An average reported strength of 50 now starts at 50,
  // rather than being inflated into the 70s.
  return clampScore(
    35 + reportedStrength * 0.3
  );
}

function calculateConfidence(params: {
  facts: PlanetFact;
  scoredRules: ScoredRuleSet;
  themes: ThemeBuildResult;
}): number {
  const { facts, scoredRules, themes } = params;

  let confidence = 40;

  confidence += Math.min(
    20,
    scoredRules.contributions.length * 2
  );

  confidence += Math.min(
    18,
    scoredRules.evidenceIds.length * 2
  );

  confidence += Math.min(
    12,
    themes.allThemes.length
  );

  if (facts.vargas.length > 0) confidence += 5;
  if (facts.dignity === "unknown") confidence -= 8;
  if (facts.evidenceIds.length === 0) confidence -= 15;

  if (scoredRules.warnings.length > 0) {
    confidence -= Math.min(
      15,
      scoredRules.warnings.length * 3
    );
  }

  return clampScore(confidence);
}

function buildSummary(params: {
  planet: string;
  score: number;
  verdict: IntelligenceStrength;
  strongestAreas: IntelligenceTheme[];
  negativeScore: number;
}): string {
  const {
    planet,
    score,
    verdict,
    strongestAreas,
    negativeScore,
  } = params;

  const themeText = strongestAreas
    .slice(0, 3)
    .map((theme) => theme.label)
    .join(", ");

  const strengthText = verdict.replace("_", " ");

  const positiveSentence = themeText
    ? `${planet} is assessed as ${strengthText} at ${score}/100, with its strongest expression through ${themeText}.`
    : `${planet} is assessed as ${strengthText} at ${score}/100.`;

  const limitationSentence =
    negativeScore >= 25
      ? "Material limiting factors are present and should be considered before treating the planet as consistently reliable."
      : negativeScore >= 10
      ? "Some limiting factors are present, but they do not fully override the planet's constructive potential."
      : "No major limiting pattern currently overrides the planet's constructive potential.";

  return `${positiveSentence} ${limitationSentence}`;
}

export function buildStrength(params: {
  facts: PlanetFact;
  scoredRules: ScoredRuleSet;
  themes: ThemeBuildResult;
}): StrengthBuildResult {
  const { facts, scoredRules, themes } = params;

  const factBase =
    baseStrengthFromFacts(facts);

  const ruleAdjustment =
    Math.max(
      -20,
      Math.min(
        20,
        scoredRules.totalWeightedScore * 0.18
      )
    );

  const positiveScore =
    Math.max(
      0,
      Math.round(scoredRules.positiveScore)
    );

  const negativeScore =
    Math.max(
      0,
      Math.round(scoredRules.negativeScore)
    );

  const calculatedScore =
    factBase +
    ruleAdjustment +
    dignityAdjustment(facts) +
    conditionAdjustment(facts) +
    vargaAdjustment(facts) +
    activationAdjustment(facts) -
    Math.min(
      20,
      negativeScore * 0.25
    );

  // Prevent incomplete data from creating false precision.
  const completenessCap =
    facts.dignity === "unknown"
      ? 78
      : facts.vargas.length === 0
      ? 88
      : 96;

  const netScore =
    Math.min(
      completenessCap,
      clampScore(calculatedScore)
    );

  const verdict =
    verdictFromScore(netScore);

  const strongestAreas = themes.allThemes
    .filter((theme) => theme.score >= 40)
    .slice(0, 6);

  const weakestAreas = themes.allThemes
    .filter(
      (theme) =>
        theme.score > 0 &&
        theme.score < 30
    )
    .sort(
      (first, second) =>
        first.score - second.score
    )
    .slice(0, 6);

  const confidence =
    calculateConfidence({
      facts,
      scoredRules,
      themes,
    });

  const evidenceIds =
    uniqueStrings([
      ...facts.evidenceIds,
      ...scoredRules.evidenceIds,
      ...strongestAreas.flatMap(
        (theme) => theme.evidenceIds
      ),
    ]);

  const summary =
    buildSummary({
      planet: facts.planet,
      score: netScore,
      verdict,
      strongestAreas,
      negativeScore,
    });

  return {
    assessment: {
      score: netScore,
      confidence,
      verdict,
      summary,
    },
    positiveScore,
    negativeScore,
    netScore,
    strongestAreas,
    weakestAreas,
    evidenceIds,
    warnings: uniqueStrings([
      ...scoredRules.warnings,
      ...themes.warnings,
    ]),
  };
}
