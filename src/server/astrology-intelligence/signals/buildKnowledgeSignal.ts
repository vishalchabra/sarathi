import type {
  AstrologyEvidence,
} from "../contracts/evidence";

import type {
  IntelligenceTheme,
  PlanetIntelligence,
} from "../contracts/planetIntelligence";

import type {
  AstrologySignal,
  SignalBuildContext,
  SignalLimitation,
  SignalStrength,
  SignalTheme,
} from "./contracts";

type ThemeSource = {
  planet: string;
  theme: IntelligenceTheme;
};

const KNOWLEDGE_THEME_KEYS = new Set([
  "analysis",
  "analytics",
  "research",
  "deep_research",
  "research_synthesis",
  "teaching",
  "consulting",
  "guidance",
  "knowledge_synthesis",
  "knowledge_monetisation",
  "publishing",
  "writing",
  "strategy",
  "strategic_analysis",
  "philosophy",
  "education",
  "higher_education",
  "advisory_judgement",
  "interpretation",
  "explanation",
  "knowledge_systems",
  "astrology",
  "symbolic_interpretation",
  "root_cause_analysis",
  "first_principles_thinking",
  "pattern_recognition",
]);

const KNOWLEDGE_LIMITATION_KEYS = new Set([
  "overconfidence_in_knowledge",
  "overconfidence_in_beliefs",
  "excessive_theorising",
  "overgeneralisation",
  "missing_practical_detail",
  "intellectual_restlessness",
  "fear_of_mistakes",
  "slow_decision_making",
  "analysis_paralysis",
  "difficulty_simplifying",
  "overcomplicating_the_offer",
]);

function normalizeKey(
  value: string
): string {
  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "_"
    )
    .replace(
      /^_+|_+$/g,
      ""
    );
}

function clampScore(
  value: number
): number {
  if (
    !Number.isFinite(
      value
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        value
      )
    )
  );
}

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

function strengthFromScore(
  score: number
): SignalStrength {
  if (
    score >= 82
  ) {
    return "very_strong";
  }

  if (
    score >= 68
  ) {
    return "strong";
  }

  if (
    score >= 48
  ) {
    return "moderate";
  }

  if (
    score >= 28
  ) {
    return "weak";
  }

  return "unclear";
}

function getKnowledgeThemes(
  planet:
    PlanetIntelligence
): IntelligenceTheme[] {
  const candidates = [
    ...planet.talents,
    ...planet.businessThemes,
    ...planet.careerThemes,
    ...planet.wealthThemes,
    ...planet.spiritualThemes,
  ];

  return candidates.filter(
    (
      theme,
      index,
      themes
    ) =>
      themes.findIndex(
        (candidate) =>
          candidate.key ===
          theme.key
      ) === index &&
      KNOWLEDGE_THEME_KEYS.has(
        normalizeKey(
          theme.key ??
          theme.label
        )
      )
  );
}

function getKnowledgeLimitations(
  planet:
    PlanetIntelligence
): IntelligenceTheme[] {
  return planet.limitations
    .filter(
      (theme) =>
        KNOWLEDGE_LIMITATION_KEYS.has(
          normalizeKey(
            theme.key ??
            theme.label
          )
        )
    );
}

function collectSources(
  planets:
    PlanetIntelligence[]
): ThemeSource[] {
  return planets.flatMap(
    (planet) =>
      getKnowledgeThemes(
        planet
      ).map(
        (theme) => ({
          planet:
            planet.planet,

          theme,
        })
      )
  );
}

function collectLimitations(
  planets:
    PlanetIntelligence[]
): ThemeSource[] {
  return planets.flatMap(
    (planet) =>
      getKnowledgeLimitations(
        planet
      ).map(
        (theme) => ({
          planet:
            planet.planet,

          theme,
        })
      )
  );
}

function aggregateThemes(
  sources:
    ThemeSource[]
): SignalTheme[] {
  const map =
    new Map<
      string,
      SignalTheme
    >();

  for (
    const source of
    sources
  ) {
    const key =
      normalizeKey(
        source.theme.key ??
        source.theme.label
      );

    if (!key) {
      continue;
    }

    const existing =
      map.get(key) ??
      {
        key,

        label:
          source.theme.label,

        score: 0,
        confidence: 0,

        contributors: [],
        reasons: [],
        evidenceIds: [],
      };

    const isNewContributor =
  !existing.contributors.includes(
    source.planet
  );

const contributionFactor =
  existing.score === 0
    ? 0.75
    : isNewContributor
    ? 0.3
    : 0.12;

existing.score +=
  source.theme.score *
  contributionFactor;

    existing.confidence =
      Math.max(
        existing.confidence,
        source.theme.confidence
      );

    existing.contributors =
      uniqueStrings([
        ...existing.contributors,
        source.planet,
      ]);

    existing.reasons =
      uniqueStrings([
        ...existing.reasons,
        ...source.theme.reasons,
      ]);

    existing.evidenceIds =
      uniqueStrings([
        ...existing.evidenceIds,
        ...source.theme.evidenceIds,
      ]);

    map.set(
      key,
      existing
    );
  }

  return Array.from(
    map.values()
  )
    .map(
      (theme) => ({
        ...theme,

        score:
  clampScore(
    Math.min(
      95,
      theme.score
    )
  ),

        confidence:
          clampScore(
            theme.confidence +
            Math.min(
              12,
              (
                theme
                  .contributors
                  .length -
                1
              ) *
                6
            )
          ),
      })
    )
    .sort(
      (
        first,
        second
      ) =>
        second.score -
          first.score ||
        second.confidence -
          first.confidence
    );
}

function aggregateLimitations(
  sources:
    ThemeSource[]
): SignalLimitation[] {
  const themes =
    aggregateThemes(
      sources
    );

  return themes.map(
    (theme) => ({
      key:
        theme.key,

      label:
        theme.label,

      score:
        theme.score,

      confidence:
        theme.confidence,

      contributors:
        theme.contributors,

      reasons:
        theme.reasons,

      evidenceIds:
        theme.evidenceIds,
    })
  );
}

function calculateSignalScore(params: {
  planets:
    PlanetIntelligence[];
  themes:
    SignalTheme[];
  limitations:
    SignalLimitation[];
}): number {
  const planetStrength =
    params.planets.length >
    0
      ? params.planets.reduce(
          (
            sum,
            planet
          ) =>
            sum +
            planet
              .strength
              .score,
          0
        ) /
        params.planets.length
      : 0;

  const topThemeScore =
    params.themes
      .slice(0, 6)
      .reduce(
        (
          sum,
          theme
        ) =>
          sum +
          theme.score,
        0
      ) /
    Math.max(
      1,
      Math.min(
        6,
        params.themes.length
      )
    );

  const limitationPenalty =
    params.limitations
      .slice(0, 4)
      .reduce(
        (
          sum,
          limitation
        ) =>
          sum +
          limitation.score,
        0
      ) *
    0.08;

  return clampScore(
    planetStrength *
      0.45 +
    topThemeScore *
      0.55 -
    limitationPenalty
  );
}

function calculateSignalConfidence(params: {
  planets:
    PlanetIntelligence[];
  themes:
    SignalTheme[];
}): number {
  const planetConfidence =
    params.planets.length >
    0
      ? params.planets.reduce(
          (
            sum,
            planet
          ) =>
            sum +
            planet
              .overallConfidence,
          0
        ) /
        params.planets.length
      : 0;

  const themeConfidence =
    params.themes.length >
    0
      ? params.themes
          .slice(0, 6)
          .reduce(
            (
              sum,
              theme
            ) =>
              sum +
              theme.confidence,
            0
          ) /
        Math.min(
          6,
          params.themes.length
        )
      : 0;

  return clampScore(
    planetConfidence *
      0.55 +
    themeConfidence *
      0.45
  );
}

function buildSummary(params: {
  score: number;
  strength:
    SignalStrength;
  themes:
    SignalTheme[];
  limitations:
    SignalLimitation[];
}): string {
  const topThemes =
    params.themes
      .slice(0, 4)
      .map(
        (theme) =>
          theme.label
      )
      .join(", ");

  const topLimitations =
    params.limitations
      .slice(0, 2)
      .map(
        (limitation) =>
          limitation.label
      )
      .join(" and ");

  const supportSentence =
    topThemes
      ? `The strongest knowledge expressions are ${topThemes}.`
      : "The chart does not yet provide enough structured knowledge themes for a confident conclusion.";

  const limitationSentence =
    topLimitations
      ? `The main limitations are ${topLimitations}.`
      : "No major knowledge-related limitation currently dominates the signal.";

  return `The Knowledge Signal is ${params.strength.replace(
    "_",
    " "
  )} at ${params.score}/100. ${supportSentence} ${limitationSentence}`;
}

export function buildKnowledgeSignal(
  context:
    SignalBuildContext
): AstrologySignal {
  const mercury =
    context.planets
      .byPlanet
      .Mercury;

  const jupiter =
    context.planets
      .byPlanet
      .Jupiter;

  const contributors =
    [
      mercury,
      jupiter,
    ].filter(
      (
        planet
      ): planet is PlanetIntelligence =>
        Boolean(planet)
    );
const knowledgeInfluences =
  context.influenceGraph
    .edges
    .filter(
      (edge) =>
        edge.themes.some(
          (theme) =>
            [
              "knowledge",
              "consulting",
              "teaching",
              "publishing",
              "strategy",
              "research",
              "diagnostics",
              "coding",
              "symbolic analysis",
            ].includes(
              theme
            )
        )
    )
    .slice(
      0,
      8
    );
  const warnings:
    string[] = [];

  if (!mercury) {
    warnings.push(
      "Mercury intelligence is unavailable for the Knowledge Signal."
    );
  }

  if (!jupiter) {
    warnings.push(
      "Jupiter intelligence is unavailable for the Knowledge Signal."
    );
  }

  const themes =
    aggregateThemes(
      collectSources(
        contributors
      )
    );

  const limitations =
    aggregateLimitations(
      collectLimitations(
        contributors
      )
    );

  const score =
    calculateSignalScore({
      planets:
        contributors,

      themes,

      limitations,
    });

  const confidence =
    calculateSignalConfidence({
      planets:
        contributors,

      themes,
    });

  const strength =
    strengthFromScore(
      score
    );

  const evidenceIds =
    uniqueStrings([
        ...knowledgeInfluences.flatMap(
  (edge) =>
    edge.evidenceIds
),
      ...contributors
        .flatMap(
          (planet) =>
            planet
              .evidence
              .map(
                (record) =>
                  record.id
              )
        ),

      ...themes.flatMap(
        (theme) =>
          theme.evidenceIds
      ),

      ...limitations.flatMap(
        (limitation) =>
          limitation
            .evidenceIds
      ),
    ]);

  const availableEvidence =
    contributors.flatMap(
      (planet) =>
        planet.evidence
    );

  const evidence =
    uniqueStrings(
      evidenceIds
    )
      .map(
        (id) =>
          availableEvidence.find(
            (record) =>
              record.id ===
              id
          )
      )
      .filter(
        (
          record
        ): record is AstrologyEvidence =>
          Boolean(record)
      );

  return {
    key:
      "knowledge",

    label:
      "Knowledge Signal",

    score,
    confidence,
    strength,

    themes:
      themes.slice(
        0,
        12
      ),

    limitations:
      limitations.slice(
        0,
        8
      ),

    evidence,
    evidenceIds,

    summary:
      buildSummary({
        score,
        strength,
        themes,
        limitations,
      }),

    warnings:
  uniqueStrings([
    ...warnings,

    ...context
      .influenceGraph
      .warnings,
  ]),
  };
}
