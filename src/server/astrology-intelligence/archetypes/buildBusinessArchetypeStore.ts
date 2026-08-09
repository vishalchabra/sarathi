import type {
  PlanetName,
} from "../contracts/facts";

import type {
  PlanetaryInfluenceGraph,
} from "../influence/types";

import type {
  BusinessDimensionKey,
  BusinessSignal,
} from "../signals/businessSignalTypes";

import type {
  BusinessArchetype,
  BusinessArchetypeStore,
  BusinessArchetypeStrength,
} from "./types";

type ArchetypeDefinition = {
  key: string;
  label: string;
  description: string;
  primaryPlanets: PlanetName[];
  supportingPlanets: PlanetName[];
  requiredDimensions: BusinessDimensionKey[];
  supportingDimensions: BusinessDimensionKey[];
  themes: string[];
  influenceThemes: string[];
  baseWeight: number;
};

const ARCHETYPES: ArchetypeDefinition[] = [
  {
    key: "ai_knowledge_entrepreneur",
    label: "AI Knowledge Entrepreneur",
    description:
      "Builds scalable knowledge products, advisory platforms, educational technology, AI tools, or expert-led digital services.",
    primaryPlanets: ["Mercury", "Jupiter", "Rahu"],
    supportingPlanets: ["Venus", "Ketu", "Sun"],
    requiredDimensions: ["knowledge_advantage", "scale_potential"],
    supportingDimensions: [
      "commercial_intelligence",
      "leadership_capacity",
      "customer_appeal",
    ],
    themes: [
      "consulting",
      "teaching",
      "research",
      "software",
      "technology",
      "ai",
      "digital_platforms",
      "knowledge_monetisation",
      "publishing",
      "foreign_markets",
    ],
    influenceThemes: [
      "knowledge",
      "consulting",
      "teaching",
      "publishing",
      "strategy",
      "technology",
      "ai",
      "digital_platforms",
      "foreign_markets",
    ],
    baseWeight: 12,
  },
  {
    key: "cross_border_advisory_builder",
    label: "Cross-Border Advisory Builder",
    description:
      "Builds consulting, education, compliance, or professional-service businesses across countries and client segments.",
    primaryPlanets: ["Jupiter", "Mercury", "Rahu"],
    supportingPlanets: ["Saturn", "Sun", "Venus"],
    requiredDimensions: [
      "knowledge_advantage",
      "commercial_intelligence",
    ],
    supportingDimensions: [
      "scale_potential",
      "leadership_capacity",
      "operational_durability",
    ],
    themes: [
      "consulting",
      "foreign_markets",
      "guidance",
      "law",
      "publishing",
      "strategy",
      "compliance",
      "governance",
      "network_gains",
    ],
    influenceThemes: [
      "global_knowledge",
      "finance",
      "law",
      "education",
      "mass_influence",
      "commerce",
      "client_experience",
    ],
    baseWeight: 10,
  },
  {
    key: "specialist_diagnostic_founder",
    label: "Specialist Diagnostic Founder",
    description:
      "Creates niche businesses around diagnosis, audit, research, analytics, cybersecurity, or technical mastery.",
    primaryPlanets: ["Ketu", "Mercury", "Saturn"],
    supportingPlanets: ["Mars", "Jupiter"],
    requiredDimensions: [
      "knowledge_advantage",
      "operational_durability",
    ],
    supportingDimensions: [
      "execution_capacity",
      "commercial_intelligence",
    ],
    themes: [
      "diagnosis",
      "diagnostics",
      "audit",
      "research",
      "cybersecurity",
      "technical_mastery",
      "niche_expertise",
      "analytics",
      "compliance",
    ],
    influenceThemes: [
      "research",
      "diagnostics",
      "coding",
      "cybersecurity",
      "symbolic_analysis",
      "operations",
      "compliance",
    ],
    baseWeight: 10,
  },
  {
    key: "brand_scale_builder",
    label: "Brand Scale Builder",
    description:
      "Builds premium, media-led, hospitality, luxury, or consumer-facing businesses with digital reach.",
    primaryPlanets: ["Venus", "Rahu", "Moon"],
    supportingPlanets: ["Mercury", "Sun"],
    requiredDimensions: ["customer_appeal", "scale_potential"],
    supportingDimensions: [
      "commercial_intelligence",
      "leadership_capacity",
    ],
    themes: [
      "branding",
      "media",
      "luxury",
      "hospitality",
      "customer_appeal",
      "public_trust",
      "design",
      "mass_attraction",
      "foreign_markets",
    ],
    influenceThemes: [
      "branding",
      "media",
      "luxury",
      "foreign_markets",
      "mass_appeal",
      "customer_understanding",
      "public_appeal",
    ],
    baseWeight: 9,
  },
  {
    key: "industrial_system_builder",
    label: "Industrial System Builder",
    description:
      "Builds engineering, manufacturing, construction, logistics, infrastructure, or operations-heavy businesses.",
    primaryPlanets: ["Mars", "Saturn"],
    supportingPlanets: ["Sun", "Mercury", "Rahu"],
    requiredDimensions: [
      "execution_capacity",
      "operational_durability",
    ],
    supportingDimensions: ["leadership_capacity", "scale_potential"],
    themes: [
      "engineering",
      "construction",
      "manufacturing",
      "operations",
      "infrastructure",
      "logistics",
      "compliance",
      "governance",
      "endurance",
    ],
    influenceThemes: [
      "engineering",
      "operations",
      "construction",
      "endurance",
      "compliance",
      "large_systems",
    ],
    baseWeight: 10,
  },
  {
    key: "institutional_governance_leader",
    label: "Institutional Governance Leader",
    description:
      "Leads regulated, administrative, banking, legal, government, or institutional organisations.",
    primaryPlanets: ["Sun", "Saturn", "Jupiter"],
    supportingPlanets: ["Mercury", "Mars"],
    requiredDimensions: [
      "leadership_capacity",
      "operational_durability",
    ],
    supportingDimensions: [
      "knowledge_advantage",
      "commercial_intelligence",
    ],
    themes: [
      "governance",
      "compliance",
      "administration",
      "policy",
      "law",
      "leadership",
      "strategy",
      "institutions",
      "management",
    ],
    influenceThemes: [
      "leadership",
      "policy",
      "law",
      "ethics",
      "guidance",
      "authority",
      "responsibility",
      "governance",
    ],
    baseWeight: 10,
  },
];

function normalizeKey(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clampScore(value: number): number {
  return Number.isFinite(value)
    ? Math.max(0, Math.min(100, Math.round(value)))
    : 0;
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

function strengthFromScore(
  score: number
): BusinessArchetypeStrength {
  if (score >= 82) return "dominant";
  if (score >= 68) return "strong";
  if (score >= 50) return "supporting";
  return "weak";
}

function averageDimensions(
  business: BusinessSignal,
  keys: BusinessDimensionKey[]
): number {
  if (keys.length === 0) return 0;

  return (
    keys.reduce(
      (sum, key) =>
        sum + business.dimensions[key].score,
      0
    ) / keys.length
  );
}

function averageConfidence(
  business: BusinessSignal,
  keys: BusinessDimensionKey[]
): number {
  if (keys.length === 0) return 0;

  return (
    keys.reduce(
      (sum, key) =>
        sum + business.dimensions[key].confidence,
      0
    ) / keys.length
  );
}

function buildArchetype(params: {
  definition: ArchetypeDefinition;
  business: BusinessSignal;
  graph: PlanetaryInfluenceGraph;
}): BusinessArchetype {
  const acceptedThemes = new Set(
    params.definition.themes.map(normalizeKey)
  );

  const matchedThemes = params.business.themes.filter(
    (theme) =>
      acceptedThemes.has(
        normalizeKey(theme.key ?? theme.label)
      )
  );

  const themeScore =
    matchedThemes.length === 0
      ? 0
      : matchedThemes.reduce(
          (sum, theme) => sum + theme.score,
          0
        ) / matchedThemes.length;

  const acceptedInfluenceThemes = new Set(
    params.definition.influenceThemes.map(normalizeKey)
  );

  const acceptedPlanets = new Set<PlanetName>([
    ...params.definition.primaryPlanets,
    ...params.definition.supportingPlanets,
  ]);

 const primaryPlanets =
  new Set(
    params.definition
      .primaryPlanets
  );

const matchedEdges =
  params.graph.edges
    .filter(
      (edge) => {
        const bothAccepted =
          acceptedPlanets.has(
            edge.from
          ) &&
          acceptedPlanets.has(
            edge.to
          );

        const fromPrimary =
          primaryPlanets.has(
            edge.from
          );

        const toPrimary =
          primaryPlanets.has(
            edge.to
          );

        const touchesPrimary =
          fromPrimary ||
          toPrimary;

        const themeMatches =
          edge.themes.some(
            (theme) =>
              acceptedInfluenceThemes.has(
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
    );

  const influenceScore =
  matchedEdges.length === 0
    ? 0
    : (() => {
        let weightedTotal = 0;
        let totalWeight = 0;

        for (const edge of matchedEdges) {
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

          const edgeWeight =
            polarityFactor *
            roleFactor;

          weightedTotal +=
            edge.score *
            edgeWeight;

          totalWeight +=
            edgeWeight;
        }

        return totalWeight > 0
          ? weightedTotal /
              totalWeight
          : 0;
      })();

  const requiredScore = averageDimensions(
    params.business,
    params.definition.requiredDimensions
  );

  const supportingScore = averageDimensions(
    params.business,
    params.definition.supportingDimensions
  );

  const activationScore =
    params.business.dimensions.current_activation.score;

  const riskPenalty =
    params.business.dimensions.risk_pressure.score * 0.08;

  const score = clampScore(
    requiredScore * 0.42 +
      supportingScore * 0.16 +
      themeScore * 0.22 +
      influenceScore * 0.16 +
      activationScore * 0.04 +
      params.definition.baseWeight -
      riskPenalty
  );

  const confidence = clampScore(
    averageConfidence(
      params.business,
      [
        ...params.definition.requiredDimensions,
        ...params.definition.supportingDimensions,
      ]
    ) *
      0.7 +
      params.business.confidence * 0.2 +
      (matchedEdges.length > 0 ? 90 : 55) * 0.1
  );

  const themeContributors = uniqueStrings(
    matchedThemes.flatMap(
      (theme) => theme.contributors
    )
  ) as PlanetName[];

  const edgeContributors = uniqueStrings(
    matchedEdges.flatMap(
      (edge) => [edge.from, edge.to]
    )
  ) as PlanetName[];

  const supportingPlanets = uniqueStrings([
    ...themeContributors,
    ...edgeContributors,
  ]).filter(
    (planet) =>
      !params.definition.primaryPlanets.includes(
        planet as PlanetName
      )
  ) as PlanetName[];

  return {
    key: params.definition.key,
    label: params.definition.label,
    description: params.definition.description,
    score,
    confidence,
    strength: strengthFromScore(score),
    primaryPlanets: params.definition.primaryPlanets,
    supportingPlanets,
    requiredDimensions: params.definition.requiredDimensions,
    supportingDimensions:
      params.definition.supportingDimensions,
    matchedThemes: matchedThemes.map(
      (theme) => theme.label
    ),
    matchedInfluenceEdgeIds: matchedEdges.map(
      (edge) => edge.id
    ),
    reasons: uniqueStrings([
      ...params.definition.requiredDimensions.map(
        (key) =>
          `${params.business.dimensions[key].label}: ${params.business.dimensions[key].score}/100`
      ),
      ...matchedEdges
  .sort(
    (first, second) => {
      const firstBothPrimary =
        primaryPlanets.has(
          first.from
        ) &&
        primaryPlanets.has(
          first.to
        );

      const secondBothPrimary =
        primaryPlanets.has(
          second.from
        ) &&
        primaryPlanets.has(
          second.to
        );

      return Number(
        secondBothPrimary
      ) -
      Number(
        firstBothPrimary
      );
    }
  )
  .flatMap(
    (edge) =>
      edge.reasons
  ),
      ...matchedThemes
        .slice(0, 6)
        .map(
          (theme) =>
            `Theme support: ${theme.label}`
        ),
    ]),
    evidenceIds: uniqueStrings([
      ...matchedThemes.flatMap(
        (theme) => theme.evidenceIds
      ),
      ...matchedEdges.flatMap(
        (edge) => edge.evidenceIds
      ),
    ]),
  };
}

export function buildBusinessArchetypeStore(params: {
  business: BusinessSignal;
  influenceGraph: PlanetaryInfluenceGraph;
}): BusinessArchetypeStore {
  const archetypes = ARCHETYPES.map(
    (definition) =>
      buildArchetype({
        definition,
        business: params.business,
        graph: params.influenceGraph,
      })
  ).sort(
    (first, second) =>
      second.score - first.score ||
      second.confidence - first.confidence
  );

  return {
    archetypes,
    primary: archetypes[0] ?? null,
    secondary: archetypes.slice(1, 4),
    warnings: [],
  };
}
