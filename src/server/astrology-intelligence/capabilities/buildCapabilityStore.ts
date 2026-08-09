import type {
  IntelligenceTheme,
  PlanetIntelligence,
  PlanetIntelligenceStore,
} from "../contracts/planetIntelligence";

import type {
  PlanetaryInfluenceEdge,
  PlanetaryInfluenceGraph,
} from "../influence/types";

import {
  CAPABILITY_DEFINITIONS,
} from "./definitions";

import type {
  Capability,
  CapabilityActivation,
  CapabilityLimitation,
  CapabilityStore,
  CapabilityStrength,
} from "./types";

import type {
  CapabilityDefinition,
} from "./definitions";

type ThemeSource = {
  planet: PlanetIntelligence;
  theme: IntelligenceTheme;
};

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
): CapabilityStrength {
  if (score >= 82) {
    return "very_strong";
  }

  if (score >= 68) {
    return "strong";
  }

  if (score >= 48) {
    return "moderate";
  }

  if (score >= 28) {
    return "weak";
  }

  return "unclear";
}

function getPlanets(
  store:
    PlanetIntelligenceStore,
  definition:
    CapabilityDefinition
): PlanetIntelligence[] {
  const accepted =
    new Set([
      ...definition.primaryPlanets,
      ...definition.supportingPlanets,
    ]);

  return store.planets.filter(
    (planet) =>
      accepted.has(
        planet.planet
      )
  );
}

function getCandidateThemes(
  planet:
    PlanetIntelligence
): IntelligenceTheme[] {
  return [
    ...planet.talents,
    ...planet.businessThemes,
    ...planet.careerThemes,
    ...planet.wealthThemes,
    ...planet.relationshipThemes,
    ...planet.healthThemes,
    ...planet.spiritualThemes,
  ];
}

function collectThemeSources(
  planets:
    PlanetIntelligence[],
  keys:
    string[]
): ThemeSource[] {
  const accepted =
    new Set(
      keys.map(
        normalizeKey
      )
    );

  return planets.flatMap(
    (planet) =>
      getCandidateThemes(
        planet
      )
        .filter(
          (theme) =>
            accepted.has(
              normalizeKey(
                theme.key ??
                theme.label
              )
            )
        )
        .map(
          (theme) => ({
            planet,
            theme,
          })
        )
  );
}

function collectLimitationSources(
  planets:
    PlanetIntelligence[],
  keys:
    string[]
): ThemeSource[] {
  const accepted =
    new Set(
      keys.map(
        normalizeKey
      )
    );

  return planets.flatMap(
    (planet) =>
      planet.limitations
        .filter(
          (theme) =>
            accepted.has(
              normalizeKey(
                theme.key ??
                theme.label
              )
            )
        )
        .map(
          (theme) => ({
            planet,
            theme,
          })
        )
  );
}

function roleWeight(
  definition:
    CapabilityDefinition,
  planet:
    PlanetIntelligence
): number {
  if (
    definition.primaryPlanets
      .includes(
        planet.planet
      )
  ) {
    return 1;
  }

  if (
    definition.supportingPlanets
      .includes(
        planet.planet
      )
  ) {
    return 0.55;
  }

  return 0;
}

function themeSupportScore(
  sources:
    ThemeSource[],
  definition:
    CapabilityDefinition
): number {
  if (
    sources.length ===
    0
  ) {
    return 0;
  }

  let weightedTotal = 0;
  let totalWeight = 0;

  for (
    const source of
    sources
  ) {
    const weight =
      roleWeight(
        definition,
        source.planet
      );

    if (
      weight <=
      0
    ) {
      continue;
    }

    weightedTotal +=
      source.theme.score *
      weight;

    totalWeight +=
      weight;
  }

  return totalWeight > 0
    ? weightedTotal /
        totalWeight
    : 0;
}

function planetStrengthScore(
  planets:
    PlanetIntelligence[],
  definition:
    CapabilityDefinition
): number {
  if (
    planets.length ===
    0
  ) {
    return 0;
  }

  let weightedTotal = 0;
  let totalWeight = 0;

  for (
    const planet of
    planets
  ) {
    const weight =
      roleWeight(
        definition,
        planet
      );

    weightedTotal +=
      planet.strength
        .score *
      weight;

    totalWeight +=
      weight;
  }

  return totalWeight > 0
    ? weightedTotal /
        totalWeight
    : 0;
}

function matchingInfluenceEdges(params: {
  graph:
    PlanetaryInfluenceGraph;
  definition:
    CapabilityDefinition;
}): PlanetaryInfluenceEdge[] {
  const acceptedThemes =
    new Set(
      params.definition
        .influenceThemeKeys
        .map(
          normalizeKey
        )
    );

  const acceptedPlanets =
    new Set([
      ...params.definition
        .primaryPlanets,
      ...params.definition
        .supportingPlanets,
    ]);

  const primaryPlanets =
    new Set(
      params.definition
        .primaryPlanets
    );

  return params.graph.edges
    .filter(
      (edge) => {
        const bothAccepted =
          acceptedPlanets.has(
            edge.from
          ) &&
          acceptedPlanets.has(
            edge.to
          );

        const touchesPrimary =
          primaryPlanets.has(
            edge.from
          ) ||
          primaryPlanets.has(
            edge.to
          );

        const themeMatches =
          edge.themes.some(
            (theme) =>
              acceptedThemes.has(
                normalizeKey(
                  theme
                )
              )
          );

        return (
          bothAccepted &&
          touchesPrimary &&
          themeMatches
        );
      }
    )
    .slice(
      0,
      12
    );
}

function influenceScore(params: {
  edges:
    PlanetaryInfluenceEdge[];
  definition:
    CapabilityDefinition;
}): number {
  if (
    params.edges.length ===
    0
  ) {
    return 0;
  }

  const primaryPlanets =
    new Set(
      params.definition
        .primaryPlanets
    );

  let weightedTotal = 0;
  let totalWeight = 0;

  for (
    const edge of
    params.edges
  ) {
    const polarityFactor =
      edge.polarity ===
      "supportive"
        ? 1
        : edge.polarity ===
          "mixed"
        ? 0.75
        : 0.35;

    const bothPrimary =
      primaryPlanets.has(
        edge.from
      ) &&
      primaryPlanets.has(
        edge.to
      );

    const roleFactor =
      bothPrimary
        ? 1
        : 0.45;

    const weight =
      polarityFactor *
      roleFactor;

    weightedTotal +=
      edge.score *
      weight;

    totalWeight +=
      weight;
  }

  return totalWeight > 0
    ? weightedTotal /
        totalWeight
    : 0;
}

function buildLimitations(params: {
  sources:
    ThemeSource[];
  definition:
    CapabilityDefinition;
}): CapabilityLimitation[] {
  const map =
    new Map<
      string,
      CapabilityLimitation
    >();

  for (
    const source of
    params.sources
  ) {
    const key =
      normalizeKey(
        source.theme.key ??
        source.theme.label
      );

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

    const weight =
      roleWeight(
        params.definition,
        source.planet
      );

    existing.score +=
      source.theme.score *
      weight;

    existing.confidence =
      Math.max(
        existing.confidence,
        source.theme.confidence
      );

    existing.contributors =
      uniqueStrings([
        ...existing.contributors,
        source.planet.planet,
      ]) as CapabilityLimitation[
        "contributors"
      ];

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
      (item) => ({
        ...item,
        score:
          clampScore(
            Math.min(
              95,
              item.score
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
        first.score
    )
    .slice(
      0,
      6
    );
}

function buildActivation(params: {
  planets:
    PlanetIntelligence[];
  themeSources:
    ThemeSource[];
  edges:
    PlanetaryInfluenceEdge[];
}): CapabilityActivation {
  const activePlanets =
    params.planets.filter(
      (planet) =>
        planet.activation
          .currentlyActive
    );

  if (
    activePlanets.length ===
    0
  ) {
    return {
      currentlyActive:
        false,

      score:
        0,

      confidence:
        0,

      activePlanets:
        [],

      activeThemes:
        [],

      evidenceIds:
        [],
    };
  }

  const activePlanetNames =
    new Set(
      activePlanets.map(
        (planet) =>
          planet.planet
      )
    );

  const activeThemes =
    params.themeSources
      .filter(
        (source) =>
          activePlanetNames.has(
            source.planet
              .planet
          )
      );

  const activeEdges =
    params.edges.filter(
      (edge) =>
        activePlanetNames.has(
          edge.from
        ) ||
        activePlanetNames.has(
          edge.to
        )
    );

  const planetScore =
    activePlanets.reduce(
      (
        sum,
        planet
      ) =>
        sum +
        planet.strength
          .score,
      0
    ) /
    activePlanets.length;

  const themeScore =
    activeThemes.length ===
    0
      ? 0
      : activeThemes.reduce(
          (
            sum,
            source
          ) =>
            sum +
            source.theme
              .score,
          0
        ) /
        activeThemes.length;

  const edgeScore =
    activeEdges.length ===
    0
      ? 0
      : activeEdges.reduce(
          (
            sum,
            edge
          ) =>
            sum +
            edge.score,
          0
        ) /
        activeEdges.length;

  const score =
    clampScore(
      planetScore *
        0.55 +
      themeScore *
        0.3 +
      edgeScore *
        0.15
    );

  const confidence =
    clampScore(
      activePlanets.reduce(
        (
          sum,
          planet
        ) =>
          sum +
          planet
            .overallConfidence,
        0
      ) /
      activePlanets.length
    );

  return {
    currentlyActive:
      true,

    score,
    confidence,

    activePlanets:
      activePlanets.map(
        (planet) =>
          planet.planet
      ),

    activeThemes:
      uniqueStrings(
        activeThemes.map(
          (source) =>
            source.theme
              .label
        )
      ).slice(
        0,
        8
      ),

    evidenceIds:
      uniqueStrings([
        ...activeThemes.flatMap(
          (source) =>
            source.theme
              .evidenceIds
        ),

        ...activeEdges.flatMap(
          (edge) =>
            edge.evidenceIds
        ),
      ]),
  };
}

function buildSummary(params: {
  definition:
    CapabilityDefinition;
  score: number;
  strength:
    CapabilityStrength;
  contributors: string[];
  limitations:
    CapabilityLimitation[];
  activation:
    CapabilityActivation;
}): string {
  const contributorText =
    params.contributors
      .slice(
        0,
        4
      )
      .join(", ");

  const limitationText =
    params.limitations
      .slice(
        0,
        2
      )
      .map(
        (item) =>
          item.label
      )
      .join(" and ");

  const activationText =
    params.activation
      .currentlyActive
      ? " This capability is currently activated."
      : "";

  return `${params.definition.label} is ${params.strength.replace(
    "_",
    " "
  )} at ${params.score}/100${
    contributorText
      ? `, led by ${contributorText}`
      : ""
  }. ${
    limitationText
      ? `The main limiting patterns are ${limitationText}.`
      : "No major limiting pattern currently dominates this capability."
  }${activationText}`;
}

function buildCapability(params: {
  definition:
    CapabilityDefinition;
  planets:
    PlanetIntelligenceStore;
  graph:
    PlanetaryInfluenceGraph;
}): Capability {
  const relevantPlanets =
    getPlanets(
      params.planets,
      params.definition
    );

  const themeSources =
    collectThemeSources(
      relevantPlanets,
      params.definition
        .themeKeys
    );

  const limitationSources =
    collectLimitationSources(
      relevantPlanets,
      params.definition
        .limitationKeys
    );

  const edges =
    matchingInfluenceEdges({
      graph:
        params.graph,
      definition:
        params.definition,
    });

  const planetScore =
    planetStrengthScore(
      relevantPlanets,
      params.definition
    );

  const themeScore =
    themeSupportScore(
      themeSources,
      params.definition
    );

  const graphScore =
    influenceScore({
      edges,
      definition:
        params.definition,
    });

  const limitations =
    buildLimitations({
      sources:
        limitationSources,
      definition:
        params.definition,
    });

  const limitationPenalty =
  limitations
    .slice(
      0,
      4
    )
    .reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.score,
      0
    ) *
  0.1;

  const activation =
    buildActivation({
      planets:
        relevantPlanets,
      themeSources,
      edges,
    });

  const themeSupportCount =
  themeSources.length;

const influenceSupportCount =
  edges.length;

const evidenceCount =
  uniqueStrings([
    ...themeSources.flatMap(
      (source) =>
        source.theme
          .evidenceIds
    ),

    ...edges.flatMap(
      (edge) =>
        edge.evidenceIds
    ),
  ]).length;

const supportBreadth =
  Math.min(
    1,
    themeSupportCount /
      5
  );

const evidenceBreadth =
  Math.min(
    1,
    evidenceCount /
      8
  );

const supportGate =
  0.72 +
  supportBreadth *
    0.18 +
  evidenceBreadth *
    0.1;

const rawScore =
  planetScore *
    0.2 +
  themeScore *
    0.5 +
  graphScore *
    0.17 +
  activation.score *
    0.05 +
  params.definition
    .baseWeight;

const score =
  clampScore(
    rawScore *
      supportGate -
    limitationPenalty +
    15
  );

const themeConfidence =
  themeSources.length ===
    0
    ? 0
    : themeSources.reduce(
        (
          total,
          source
        ) =>
          total +
          source.theme
            .confidence,
        0
      ) /
      themeSources.length;

const graphConfidence =
  edges.length ===
    0
    ? 0
    : edges.reduce(
        (
          total,
          edge
        ) =>
          total +
          edge.confidence,
        0
      ) /
      edges.length;

const confidence =
  clampScore(
    themeConfidence *
      0.55 +
    graphConfidence *
      0.25 +
    evidenceBreadth *
      20
  );
  const contributors =
    uniqueStrings([
      ...themeSources.map(
        (source) =>
          source.planet
            .planet
      ),

      ...edges.flatMap(
        (edge) => [
          edge.from,
          edge.to,
        ]
      ),
    ]) as Capability[
      "contributors"
    ];

  const supportingThemes =
    uniqueStrings(
      themeSources
        .sort(
          (
            first,
            second
          ) =>
            second.theme
              .score -
            first.theme
              .score
        )
        .map(
          (source) =>
            source.theme
              .label
        )
    ).slice(
      0,
      12
    );

  const reasons =
    uniqueStrings([
      ...themeSources
        .sort(
          (
            first,
            second
          ) =>
            second.theme
              .score -
            first.theme
              .score
        )
        .slice(
          0,
          8
        )
        .flatMap(
          (source) =>
            source.theme
              .reasons
        ),

      ...edges
        .slice(
          0,
          6
        )
        .flatMap(
          (edge) =>
            edge.reasons
        ),
    ]);

  const evidenceIds =
    uniqueStrings([
      ...themeSources.flatMap(
        (source) =>
          source.theme
            .evidenceIds
      ),

      ...edges.flatMap(
        (edge) =>
          edge.evidenceIds
      ),

      ...limitations.flatMap(
        (item) =>
          item.evidenceIds
      ),

      ...activation
        .evidenceIds,
    ]);

  const strength =
    strengthFromScore(
      score
    );

  return {
    key:
      params.definition.key,

    label:
      params.definition.label,

    description:
      params.definition
        .description,

    category:
      params.definition
        .category,

    score,
    confidence,
    strength,

    contributors,

    supportingThemes,

    supportingInfluenceEdgeIds:
      edges.map(
        (edge) =>
          edge.id
      ),

    reasons,

    evidenceIds,

    limitations,

    activation,

    summary:
      buildSummary({
        definition:
          params.definition,
        score,
        strength,
        contributors,
        limitations,
        activation,
      }),
  };
}

export function buildCapabilityStore(params: {
  planets:
    PlanetIntelligenceStore;
  influenceGraph:
    PlanetaryInfluenceGraph;
}): CapabilityStore {
  const capabilities =
    CAPABILITY_DEFINITIONS
      .map(
        (definition) =>
          buildCapability({
            definition,
            planets:
              params.planets,
            graph:
              params.influenceGraph,
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

  const byKey:
    Record<
      string,
      Capability | undefined
    > = {};

  for (
    const capability of
    capabilities
  ) {
    byKey[
      capability.key
    ] =
      capability;
  }

  return {
    capabilities,

    byKey,

    strongest:
      capabilities.slice(
        0,
        10
      ),

    warnings: [],
  };
}