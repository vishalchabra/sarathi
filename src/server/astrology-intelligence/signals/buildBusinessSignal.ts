import type {
  AstrologyEvidence,
} from "../contracts/evidence";

import type {
  PlanetIntelligenceStore,
} from "../contracts/planetIntelligence";

import type {
  Capability,
  CapabilityStore,
} from "../capabilities/types";

import type {
  PlanetaryInfluenceGraph,
} from "../influence/types";

import type {
  SignalLimitation,
  SignalStrength,
  SignalTheme,
} from "./contracts";

import type {
  BusinessDimension,
  BusinessDimensionKey,
  BusinessModelFit,
  BusinessSignal,
} from "./businessSignalTypes";

type DimensionDefinition = {
  key: BusinessDimensionKey;
  label: string;
  capabilityKeys: string[];
  limitationCapabilityKeys?: string[];
  activation?: boolean;
};

type ModelDefinition = {
  key: string;
  label: string;
  dimensions: BusinessDimensionKey[];
  capabilityKeys: string[];
};

const DIMENSIONS: DimensionDefinition[] = [
  {
    key: "commercial_intelligence",
    label: "Commercial Intelligence",
    capabilityKeys: [
      "commerce",
      "sales",
      "negotiation",
      "customer_understanding",
      "communication",
      "strategic_thinking",
    ],
  },
  {
    key: "knowledge_advantage",
    label: "Knowledge Advantage",
    capabilityKeys: [
      "knowledge",
      "analysis",
      "research",
      "learning",
      "teaching",
      "strategic_thinking",
    ],
  },
  {
    key: "customer_appeal",
    label: "Customer Appeal",
    capabilityKeys: [
      "customer_understanding",
      "communication",
      "creativity",
      "storytelling",
      "media",
      "empathy",
      "relationships",
    ],
  },
  {
    key: "execution_capacity",
    label: "Execution Capacity",
    capabilityKeys: [
      "execution",
      "initiative",
      "discipline",
      "operations",
      "decision_making",
    ],
  },
  {
    key: "operational_durability",
    label: "Operational Durability",
    capabilityKeys: [
      "operations",
      "discipline",
      "endurance",
      "responsibility",
      "governance",
    ],
  },
  {
    key: "leadership_capacity",
    label: "Leadership Capacity",
    capabilityKeys: [
      "leadership",
      "authority",
      "decision_making",
      "responsibility",
      "governance",
      "strategic_thinking",
    ],
  },
  {
    key: "scale_potential",
    label: "Scale Potential",
    capabilityKeys: [
      "scale",
      "innovation",
      "entrepreneurship",
      "operations",
      "leadership",
      "communication",
      "media",
    ],
  },
  {
    key: "risk_pressure",
    label: "Risk Pressure",
    capabilityKeys: [
      "entrepreneurship",
      "initiative",
      "scale",
      "innovation",
      "transformation",
    ],
    limitationCapabilityKeys: [
      "entrepreneurship",
      "initiative",
      "scale",
      "innovation",
      "transformation",
      "decision_making",
    ],
  },
  {
    key: "current_activation",
    label: "Current Activation",
    capabilityKeys: [],
    activation: true,
  },
];

const MODELS: ModelDefinition[] = [
  {
    key: "knowledge_advisory",
    label: "Knowledge & Advisory",
    dimensions: [
      "knowledge_advantage",
      "commercial_intelligence",
      "leadership_capacity",
    ],
    capabilityKeys: [
      "knowledge",
      "analysis",
      "research",
      "teaching",
      "mentoring",
      "communication",
      "strategic_thinking",
    ],
  },
  {
    key: "digital_platform",
    label: "Digital Platform",
    dimensions: [
      "scale_potential",
      "commercial_intelligence",
      "execution_capacity",
    ],
    capabilityKeys: [
      "innovation",
      "scale",
      "entrepreneurship",
      "communication",
      "media",
      "operations",
    ],
  },
  {
    key: "premium_consumer",
    label: "Premium Consumer & Brand",
    dimensions: [
      "customer_appeal",
      "commercial_intelligence",
      "scale_potential",
    ],
    capabilityKeys: [
      "customer_understanding",
      "creativity",
      "storytelling",
      "media",
      "commerce",
      "communication",
    ],
  },
  {
    key: "operations_infrastructure",
    label: "Operations & Infrastructure",
    dimensions: [
      "execution_capacity",
      "operational_durability",
      "leadership_capacity",
    ],
    capabilityKeys: [
      "operations",
      "execution",
      "discipline",
      "endurance",
      "governance",
      "leadership",
    ],
  },
  {
    key: "specialist_diagnostic",
    label: "Specialist & Diagnostic",
    dimensions: [
      "knowledge_advantage",
      "execution_capacity",
      "operational_durability",
    ],
    capabilityKeys: [
      "analysis",
      "research",
      "knowledge",
      "discipline",
      "operations",
      "transformation",
    ],
  },
  {
    key: "cross_border_services",
    label: "Cross-Border Services",
    dimensions: [
      "scale_potential",
      "commercial_intelligence",
      "knowledge_advantage",
    ],
    capabilityKeys: [
      "scale",
      "communication",
      "commerce",
      "knowledge",
      "strategic_thinking",
      "relationships",
    ],
  },
];

function clamp(
  value: number
): number {
  return Number.isFinite(value)
    ? Math.max(
        0,
        Math.min(
          100,
          Math.round(value)
        )
      )
    : 0;
}

function unique(
  values: Array<string | null | undefined>
): string[] {
  return Array.from(
    new Set(
      values
        .map((value) =>
          String(value ?? "").trim()
        )
        .filter(Boolean)
    )
  );
}

function strength(
  score: number
): SignalStrength {
  if (score >= 82) return "very_strong";
  if (score >= 68) return "strong";
  if (score >= 48) return "moderate";
  if (score >= 28) return "weak";
  return "unclear";
}

function getCapabilities(
  store: CapabilityStore,
  keys: string[]
): Capability[] {
  return keys
    .map((key) => store.byKey[key])
    .filter(
      (capability): capability is Capability =>
        Boolean(capability)
    );
}

function averageScore(
  capabilities: Capability[]
): number {
  if (capabilities.length === 0) {
    return 0;
  }

  return (
    capabilities.reduce(
      (sum, capability) =>
        sum + capability.score,
      0
    ) / capabilities.length
  );
}

function averageConfidence(
  capabilities: Capability[]
): number {
  if (capabilities.length === 0) {
    return 0;
  }

  return (
    capabilities.reduce(
      (sum, capability) =>
        sum + capability.confidence,
      0
    ) / capabilities.length
  );
}

function buildActivationDimension(
  capabilities: CapabilityStore
): BusinessDimension {
  const active =
    capabilities.capabilities
      .filter(
        (capability) =>
          capability.activation.currentlyActive
      )
      .sort(
        (first, second) =>
          second.activation.score -
          first.activation.score
      );

  const score =
    active.length === 0
      ? 0
      : clamp(
          active
            .slice(0, 8)
            .reduce(
              (sum, capability) =>
                sum +
                capability.activation.score,
              0
            ) /
            Math.min(8, active.length)
        );

  const confidence =
    active.length === 0
      ? 0
      : clamp(
          active
            .slice(0, 8)
            .reduce(
              (sum, capability) =>
                sum +
                capability.activation.confidence,
              0
            ) /
            Math.min(8, active.length)
        );

  return {
    key: "current_activation",
    label: "Current Activation",
    score,
    confidence,
    strength: strength(score),
    contributors: unique(
      active.flatMap(
        (capability) =>
          capability.activation.activePlanets
      )
    ),
    reasons: active
      .slice(0, 8)
      .map(
        (capability) =>
          `${capability.label} is currently activated at ${capability.activation.score}/100.`
      ),
    evidenceIds: unique(
      active.flatMap(
        (capability) =>
          capability.activation.evidenceIds
      )
    ),
  };
}

function buildRiskDimension(
  definition: DimensionDefinition,
  capabilities: CapabilityStore
): BusinessDimension {
  const relevant =
    getCapabilities(
      capabilities,
      definition.capabilityKeys
    );

  const limitationCapabilities =
    getCapabilities(
      capabilities,
      definition.limitationCapabilityKeys ?? []
    );

  const limitationItems =
    limitationCapabilities.flatMap(
      (capability) =>
        capability.limitations.map(
          (limitation) => ({
            capability,
            limitation,
          })
        )
    );

  const limitationScore =
    limitationItems.length === 0
      ? 0
      : limitationItems
          .sort(
            (first, second) =>
              second.limitation.score -
              first.limitation.score
          )
          .slice(0, 8)
          .reduce(
            (sum, item) =>
              sum + item.limitation.score,
            0
          ) /
        Math.min(8, limitationItems.length);

  const activationPressure =
    relevant.length === 0
      ? 0
      : relevant.reduce(
          (sum, capability) =>
            sum +
            (
              capability.activation.currentlyActive
                ? capability.activation.score
                : 0
            ),
          0
        ) / relevant.length;

  const score =
    clamp(
      limitationScore * 0.75 +
      activationPressure * 0.25
    );

  return {
    key: definition.key,
    label: definition.label,
    score,
    confidence: clamp(
      averageConfidence(relevant)
    ),
    strength: strength(score),
    contributors: unique([
      ...relevant.flatMap(
        (capability) =>
          capability.contributors
      ),
      ...limitationItems.flatMap(
        (item) =>
          item.limitation.contributors
      ),
    ]),
    reasons: unique(
      limitationItems
        .sort(
          (first, second) =>
            second.limitation.score -
            first.limitation.score
        )
        .slice(0, 8)
        .flatMap(
          (item) => [
            `${item.capability.label}: ${item.limitation.label}`,
            ...item.limitation.reasons,
          ]
        )
    ),
    evidenceIds: unique(
      limitationItems.flatMap(
        (item) =>
          item.limitation.evidenceIds
      )
    ),
  };
}

function buildCapabilityDimension(
  definition: DimensionDefinition,
  capabilities: CapabilityStore
): BusinessDimension {
  if (definition.activation) {
    return buildActivationDimension(
      capabilities
    );
  }

  if (
    definition.key ===
    "risk_pressure"
  ) {
    return buildRiskDimension(
      definition,
      capabilities
    );
  }

  const relevant =
    getCapabilities(
      capabilities,
      definition.capabilityKeys
    );

  const score =
    clamp(
      averageScore(relevant)
    );

  const confidence =
    clamp(
      averageConfidence(relevant)
    );

  return {
    key: definition.key,
    label: definition.label,
    score,
    confidence,
    strength: strength(score),
    contributors: unique(
      relevant.flatMap(
        (capability) =>
          capability.contributors
      )
    ),
    reasons: unique(
      relevant
        .sort(
          (first, second) =>
            second.score -
            first.score
        )
        .slice(0, 8)
        .flatMap(
          (capability) => [
            `${capability.label}: ${capability.score}/100`,
            ...capability.reasons.slice(0, 2),
          ]
        )
    ),
    evidenceIds: unique(
      relevant.flatMap(
        (capability) =>
          capability.evidenceIds
      )
    ),
  };
}

function capabilityToTheme(
  capability: Capability
): SignalTheme {
  return {
    key: capability.key,
    label: capability.label,
    score: capability.score,
    confidence: capability.confidence,
    contributors:
      capability.contributors,
    reasons:
      capability.reasons,
    evidenceIds:
      capability.evidenceIds,
  };
}

function buildCautions(
  capabilities: CapabilityStore
): SignalLimitation[] {
  const map =
    new Map<
      string,
      SignalLimitation
    >();

  for (
    const capability of
    capabilities.capabilities
  ) {
    for (
      const limitation of
      capability.limitations
    ) {
      const existing =
        map.get(
          limitation.key
        ) ?? {
          key:
            limitation.key,
          label:
            limitation.label,
          score:
            0,
          confidence:
            0,
          contributors:
            [],
          reasons:
            [],
          evidenceIds:
            [],
        };

      existing.score =
        Math.max(
          existing.score,
          limitation.score
        );

      existing.confidence =
        Math.max(
          existing.confidence,
          limitation.confidence
        );

      existing.contributors =
        unique([
          ...existing.contributors,
          ...limitation.contributors,
        ]);

      existing.reasons =
        unique([
          ...existing.reasons,
          ...limitation.reasons,
        ]);

      existing.evidenceIds =
        unique([
          ...existing.evidenceIds,
          ...limitation.evidenceIds,
        ]);

      map.set(
        limitation.key,
        existing
      );
    }
  }

  return Array.from(
    map.values()
  )
    .sort(
      (first, second) =>
        second.score -
        first.score
    )
    .slice(0, 12);
}

function buildModels(
  dimensions:
    Record<
      BusinessDimensionKey,
      BusinessDimension
    >,
  capabilities:
    CapabilityStore
): BusinessModelFit[] {
  return MODELS.map(
    (model) => {
      const dimensionScore =
        model.dimensions.reduce(
          (sum, key) =>
            sum +
            dimensions[key].score,
          0
        ) /
        model.dimensions.length;

      const matched =
        getCapabilities(
          capabilities,
          model.capabilityKeys
        );

      const capabilityScore =
        averageScore(matched);

      return {
        key:
          model.key,
        label:
          model.label,
        score:
          clamp(
            dimensionScore * 0.65 +
            capabilityScore * 0.35
          ),
        confidence:
          clamp(
            (
              model.dimensions.reduce(
                (sum, key) =>
                  sum +
                  dimensions[key].confidence,
                0
              ) /
              model.dimensions.length
            ) *
              0.6 +
            averageConfidence(matched) *
              0.4
          ),
        supportingDimensions:
          model.dimensions,
        supportingThemes:
          matched
            .sort(
              (first, second) =>
                second.score -
                first.score
            )
            .slice(0, 8)
            .map(
              (capability) =>
                capability.label
            ),
        contributors:
          unique(
            matched.flatMap(
              (capability) =>
                capability.contributors
            )
          ),
      };
    }
  ).sort(
    (first, second) =>
      second.score -
        first.score ||
      second.confidence -
        first.confidence
  );
}

function summaryFor(
  score: number,
  signalStrength: SignalStrength,
  models: BusinessModelFit[],
  dimensions:
    Record<
      BusinessDimensionKey,
      BusinessDimension
    >,
  cautions: SignalLimitation[]
): string {
  const modelText =
    models
      .slice(0, 3)
      .map(
        (model) =>
          model.label
      )
      .join(", ") ||
    "not yet clear";

  const dimensionText =
    Object.values(dimensions)
      .filter(
        (dimension) =>
          dimension.key !==
            "risk_pressure" &&
          dimension.key !==
            "current_activation"
      )
      .sort(
        (first, second) =>
          second.score -
          first.score
      )
      .slice(0, 3)
      .map(
        (dimension) =>
          dimension.label
      )
      .join(", ") ||
    "not yet clear";

  const cautionText =
    cautions
      .slice(0, 2)
      .map(
        (caution) =>
          caution.label
      )
      .join(" and ");

  return `The Business Signal is ${signalStrength.replace(
    "_",
    " "
  )} at ${score}/100. The strongest business models are ${modelText}. The main supporting dimensions are ${dimensionText}. ${
    cautionText
      ? `The main cautions are ${cautionText}.`
      : "No major business caution currently dominates the signal."
  }`;
}

export function buildBusinessSignal(params: {
  planets:
    PlanetIntelligenceStore;

  influenceGraph:
    PlanetaryInfluenceGraph;

  capabilities:
    CapabilityStore;
}): BusinessSignal {
  const {
    planets,
    influenceGraph,
    capabilities,
  } = params;

  const dimensions =
    DIMENSIONS.reduce(
      (
        result,
        definition
      ) => {
        result[
          definition.key
        ] =
          buildCapabilityDimension(
            definition,
            capabilities
          );

        return result;
      },
      {} as Record<
        BusinessDimensionKey,
        BusinessDimension
      >
    );

  const themes =
    capabilities.capabilities
      .map(
        capabilityToTheme
      )
      .sort(
        (first, second) =>
          second.score -
          first.score
      )
      .slice(0, 20);

  const cautions =
    buildCautions(
      capabilities
    );

  const suitableModels =
    buildModels(
      dimensions,
      capabilities
    );

  const positiveKeys:
    BusinessDimensionKey[] = [
      "commercial_intelligence",
      "knowledge_advantage",
      "customer_appeal",
      "execution_capacity",
      "operational_durability",
      "leadership_capacity",
      "scale_potential",
    ];

  const positiveScores =
    positiveKeys
      .map(
        (key) =>
          dimensions[key].score
      )
      .sort(
        (first, second) =>
          second - first
      );

  const dominantAverage =
    positiveScores
      .slice(0, 4)
      .reduce(
        (sum, value) =>
          sum + value,
        0
      ) /
    Math.min(
      4,
      positiveScores.length
    );

  const supportingAverage =
    positiveScores
      .slice(4)
      .reduce(
        (sum, value) =>
          sum + value,
        0
      ) /
    Math.max(
      1,
      positiveScores.length - 4
    );

  const score =
    clamp(
      dominantAverage * 0.72 +
      supportingAverage * 0.18 +
      dimensions
        .current_activation
        .score *
        0.1 -
      dimensions
        .risk_pressure
        .score *
        0.12
    );

  const confidence =
    clamp(
      positiveKeys.reduce(
        (sum, key) =>
          sum +
          dimensions[key]
            .confidence,
        0
      ) /
      positiveKeys.length
    );

  const signalStrength =
    strength(score);

  const evidenceIds =
    unique([
      ...Object.values(
        dimensions
      ).flatMap(
        (dimension) =>
          dimension.evidenceIds
      ),
      ...themes.flatMap(
        (theme) =>
          theme.evidenceIds
      ),
      ...cautions.flatMap(
        (caution) =>
          caution.evidenceIds
      ),
    ]);

  const availableEvidence:
    AstrologyEvidence[] = [
      ...planets.planets.flatMap(
        (planet) =>
          planet.evidence
      ),
    ];

  const evidence =
    evidenceIds
      .map(
        (id) =>
          availableEvidence.find(
            (record) =>
              record.id === id
          )
      )
      .filter(
        (
          record
        ): record is AstrologyEvidence =>
          Boolean(record)
      );

  const warnings =
    unique([
      ...capabilities.warnings,
      ...influenceGraph.warnings,
    ]);

  return {
    key:
      "business",
    label:
      "Business Signal",
    score,
    confidence,
    strength:
      signalStrength,
    dimensions,
    suitableModels,
    themes,
    cautions,
    evidence,
    evidenceIds,
    summary:
      summaryFor(
        score,
        signalStrength,
        suitableModels,
        dimensions,
        cautions
      ),
    warnings,
  };
}
