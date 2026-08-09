import type {
  IntelligenceTheme,
} from "../../contracts/planetIntelligence";

import type {
  KnowledgeCategory,
} from "../../knowledge/types";

import type {
  RuleScoreContribution,
  ScoredRuleSet,
} from "./scoreRules";

export type ThemeBuildResult = {
  byCategory: Record<
    KnowledgeCategory,
    IntelligenceTheme[]
  >;

  allThemes: IntelligenceTheme[];
  shadows: IntelligenceTheme[];

  removedThemes: string[];
  warnings: string[];
};

type ThemeAccumulator = {
  key: string;
  label: string;
  category: KnowledgeCategory;

  score: number;

  positiveContributions: number;
  negativeContributions: number;

  reasons: string[];
  evidenceIds: string[];
};

const CATEGORIES: KnowledgeCategory[] = [
  "identity",
  "strength",
  "career",
  "business",
  "wealth",
  "relationships",
  "health",
  "spirituality",
  "psychology",
  "communication",
  "education",
];

function normalizeThemeKey(
  value: string
): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function titleCase(
  value: string
): string {
  return String(value ?? "")
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word
          ? word[0].toUpperCase() +
            word.slice(1)
          : ""
    )
    .join(" ");
}

function clampScore(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
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

function categoryMap(): Record<
  KnowledgeCategory,
  IntelligenceTheme[]
> {
  return {
    identity: [],
    strength: [],
    career: [],
    business: [],
    wealth: [],
    relationships: [],
    health: [],
    spirituality: [],
    psychology: [],
    communication: [],
    education: [],
  };
}

function addThemeContribution(params: {
  map: Map<string, ThemeAccumulator>;
  theme: string;
  category: KnowledgeCategory;
  contribution: number;
  reason: string;
  evidenceIds: string[];
}): void {
  const key =
    normalizeThemeKey(
      params.theme
    );

  if (!key) {
    return;
  }

  const existing =
    params.map.get(key) ??
    {
      key,
      label:
        titleCase(
          params.theme
        ),

      category:
        params.category,

      score: 0,

      positiveContributions: 0,
      negativeContributions: 0,

      reasons: [],
      evidenceIds: [],
    };

  existing.score +=
    params.contribution;

  if (
    params.contribution >=
    0
  ) {
    existing.positiveContributions +=
      params.contribution;
  } else {
    existing.negativeContributions +=
      Math.abs(
        params.contribution
      );
  }

  existing.reasons =
    uniqueStrings([
      ...existing.reasons,
      params.reason,
    ]);

  existing.evidenceIds =
    uniqueStrings([
      ...existing.evidenceIds,
      ...params.evidenceIds,
    ]);

  params.map.set(
    key,
    existing
  );
}

function processContribution(params: {
  contribution: RuleScoreContribution;
  themes: Map<
    string,
    ThemeAccumulator
  >;
  shadows: Map<
    string,
    ThemeAccumulator
  >;
  removed: Set<string>;
}): void {
  const {
    contribution,
    themes,
    shadows,
    removed,
  } = params;

  const baseReason =
    contribution.title;

  const addedScore =
    Math.max(
      4,
      Math.round(
        Math.abs(
          contribution
            .weightedScore
        ) *
          0.7
      )
    );

  const strengthenedScore =
    Math.max(
      5,
      Math.round(
        Math.abs(
          contribution
            .weightedScore
        )
      )
    );

  const weakenedScore =
    -Math.max(
      5,
      Math.round(
        Math.abs(
          contribution
            .weightedScore
        )
      )
    );

  const shadowScore =
    Math.max(
      4,
      Math.round(
        Math.abs(
          contribution
            .weightedScore
        ) *
          0.65
      )
    );

  for (
    const theme of
    contribution.addedThemes
  ) {
    addThemeContribution({
      map:
        themes,

      theme,

      category:
        contribution.category,

      contribution:
        addedScore,

      reason:
        baseReason,

      evidenceIds:
        contribution.evidenceIds,
    });
  }

  for (
    const theme of
    contribution.strengthenedThemes
  ) {
    addThemeContribution({
      map:
        themes,

      theme,

      category:
        contribution.category,

      contribution:
        strengthenedScore,

      reason:
        baseReason,

      evidenceIds:
        contribution.evidenceIds,
    });
  }

  for (
    const theme of
    contribution.weakenedThemes
  ) {
    addThemeContribution({
      map:
        themes,

      theme,

      category:
        contribution.category,

      contribution:
        weakenedScore,

      reason:
        `${baseReason} weakens this expression`,

      evidenceIds:
        contribution.evidenceIds,
    });
  }

  for (
    const theme of
    contribution.removedThemes
  ) {
    const key =
      normalizeThemeKey(
        theme
      );

    if (key) {
      removed.add(key);
    }
  }

  for (
    const theme of
    contribution.shadowThemes
  ) {
    addThemeContribution({
      map:
        shadows,

      theme,

      category:
        "psychology",

      contribution:
        shadowScore,

      reason:
        baseReason,

      evidenceIds:
        contribution.evidenceIds,
    });
  }
}

function confidenceForTheme(
  accumulator: ThemeAccumulator
): number {
  const evidenceCount =
    accumulator.evidenceIds.length;

  const reasonCount =
    accumulator.reasons.length;

  const positiveStrength =
    Math.min(
      25,
      accumulator.positiveContributions * 0.35
    );

  const evidenceSupport =
    Math.min(
      18,
      evidenceCount * 2
    );

  const reasonSupport =
    Math.min(
      20,
      reasonCount * 7
    );

  const contradictionPenalty =
    Math.min(
      30,
      accumulator.negativeContributions * 0.6
    );

  const singleRulePenalty =
    reasonCount <= 1
      ? 10
      : 0;

  const score =
    32 +
    positiveStrength +
    evidenceSupport +
    reasonSupport -
    contradictionPenalty -
    singleRulePenalty;

  return clampScore(
    score
  );
}

function finalizeTheme(
  accumulator: ThemeAccumulator
): IntelligenceTheme {
  return {
    key:
      accumulator.key,

    label:
      accumulator.label,

    score:
      clampScore(
        accumulator.score
      ),

    confidence:
      confidenceForTheme(
        accumulator
      ),

    reasons:
      accumulator.reasons,

    evidenceIds:
      accumulator.evidenceIds,
  };
}

function sortThemes(
  themes: IntelligenceTheme[]
): IntelligenceTheme[] {
  return [...themes].sort(
    (
      first,
      second
    ) => {
      if (
        second.score !==
        first.score
      ) {
        return (
          second.score -
          first.score
        );
      }

      return (
        second.confidence -
        first.confidence
      );
    }
  );
}

export function buildThemes(
  scoredRules: ScoredRuleSet
): ThemeBuildResult {
  const themeMap =
    new Map<
      string,
      ThemeAccumulator
    >();

  const shadowMap =
    new Map<
      string,
      ThemeAccumulator
    >();

  const removedThemes =
    new Set<string>();

  for (
    const contribution of
    scoredRules.contributions
  ) {
    processContribution({
      contribution,

      themes:
        themeMap,

      shadows:
        shadowMap,

      removed:
        removedThemes,
    });
  }

  for (
    const removedTheme of
    removedThemes
  ) {
    themeMap.delete(
      removedTheme
    );
  }

  const allThemes =
    sortThemes(
      Array.from(
        themeMap.values()
      )
        .map(
          finalizeTheme
        )
        .filter(
          (theme) =>
            theme.score >
            0
        )
    );

  const shadows =
    sortThemes(
      Array.from(
        shadowMap.values()
      )
        .map(
          finalizeTheme
        )
        .filter(
          (theme) =>
            theme.score >
            0
        )
    );

  const byCategory =
    categoryMap();

  for (
    const theme of
    allThemes
  ) {
    const accumulator =
      themeMap.get(
        theme.key
      );

    if (!accumulator) {
      continue;
    }

    byCategory[
      accumulator.category
    ].push(theme);
  }

  for (
    const category of
    CATEGORIES
  ) {
    byCategory[category] =
      sortThemes(
        byCategory[
          category
        ]
      );
  }

  return {
    byCategory,

    allThemes,
    shadows,

    removedThemes:
      Array.from(
        removedThemes
      ),

    warnings:
      scoredRules.warnings,
  };
}
