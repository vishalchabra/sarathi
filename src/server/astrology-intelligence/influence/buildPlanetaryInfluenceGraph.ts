import type {
  PlanetName,
} from "../contracts/facts";

import type {
  PlanetIntelligence,
  PlanetIntelligenceStore,
} from "../contracts/planetIntelligence";

import type {
  PlanetaryInfluenceEdge,
  PlanetaryInfluenceGraph,
  PlanetaryInfluenceKind,
  PlanetaryInfluenceNode,
  PlanetaryInfluencePolarity,
} from "./types";

type PairRule = {
  planets: [
    PlanetName,
    PlanetName,
  ];

  kind: PlanetaryInfluenceKind;
  polarity: PlanetaryInfluencePolarity;

  score: number;

  themes: string[];
  reason: string;
};

const PLANETS: PlanetName[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

const PAIR_RULES: PairRule[] = [
  {
    planets: [
      "Mercury",
      "Jupiter",
    ],
    kind:
      "mutual_reinforcement",
    polarity:
      "supportive",
    score:
      18,
    themes: [
      "knowledge",
      "consulting",
      "teaching",
      "publishing",
      "strategy",
    ],
    reason:
      "Mercury and Jupiter reinforce analysis, explanation, judgement, teaching, and advisory capacity.",
  },
  {
    planets: [
      "Mercury",
      "Venus",
    ],
    kind:
      "mutual_reinforcement",
    polarity:
      "supportive",
    score:
      16,
    themes: [
      "branding",
      "marketing",
      "negotiation",
      "commerce",
      "client experience",
    ],
    reason:
      "Mercury and Venus reinforce communication-led value creation, branding, negotiation, and commercial appeal.",
  },
  {
    planets: [
      "Mars",
      "Saturn",
    ],
    kind:
      "discipline",
    polarity:
      "mixed",
    score:
      18,
    themes: [
      "engineering",
      "operations",
      "construction",
      "endurance",
      "compliance",
    ],
    reason:
      "Mars and Saturn combine force with discipline, producing durable execution but also pressure, delay, and frustration.",
  },
  {
    planets: [
      "Venus",
      "Rahu",
    ],
    kind:
      "amplification",
    polarity:
      "mixed",
    score:
      17,
    themes: [
      "branding",
      "media",
      "luxury",
      "foreign markets",
      "mass appeal",
    ],
    reason:
      "Rahu amplifies Venusian attraction, branding, media reach, foreign appeal, and market desire.",
  },
  {
    planets: [
      "Mercury",
      "Rahu",
    ],
    kind:
      "amplification",
    polarity:
      "mixed",
    score:
      18,
    themes: [
      "technology",
      "AI",
      "digital platforms",
      "media",
      "data",
    ],
    reason:
      "Rahu amplifies Mercury through technology, data, media, digital scale, and unconventional intelligence.",
  },
  {
    planets: [
      "Sun",
      "Jupiter",
    ],
    kind:
      "mutual_reinforcement",
    polarity:
      "supportive",
    score:
      17,
    themes: [
      "leadership",
      "policy",
      "law",
      "ethics",
      "guidance",
    ],
    reason:
      "Sun and Jupiter reinforce ethical authority, policy, leadership, law, and institutional guidance.",
  },
  {
    planets: [
      "Sun",
      "Saturn",
    ],
    kind:
      "tension",
    polarity:
      "mixed",
    score:
      16,
    themes: [
      "authority",
      "responsibility",
      "governance",
      "recognition",
      "delay",
    ],
    reason:
      "Sun and Saturn create tension between authority and duty, often producing leadership through pressure, delayed recognition, or institutional responsibility.",
  },
  {
    planets: [
      "Moon",
      "Jupiter",
    ],
    kind:
      "mutual_reinforcement",
    polarity:
      "supportive",
    score:
      17,
    themes: [
      "care",
      "counselling",
      "public trust",
      "emotional wisdom",
      "guidance",
    ],
    reason:
      "Moon and Jupiter reinforce care, emotional wisdom, counselling, generosity, and public trust.",
  },
  {
    planets: [
      "Moon",
      "Venus",
    ],
    kind:
      "mutual_reinforcement",
    polarity:
      "supportive",
    score:
      16,
    themes: [
      "hospitality",
      "customer understanding",
      "public appeal",
      "relationships",
      "comfort",
    ],
    reason:
      "Moon and Venus reinforce hospitality, emotional appeal, customer understanding, and relationship warmth.",
  },
  {
    planets: [
      "Mars",
      "Rahu",
    ],
    kind:
      "amplification",
    polarity:
      "challenging",
    score:
      18,
    themes: [
      "risk",
      "competition",
      "technology",
      "rapid expansion",
      "recklessness",
    ],
    reason:
      "Rahu amplifies Mars toward aggressive expansion, technology, competition, and risk, requiring strong controls.",
  },
  {
    planets: [
      "Jupiter",
      "Rahu",
    ],
    kind:
      "amplification",
    polarity:
      "mixed",
    score:
      17,
    themes: [
      "global knowledge",
      "finance",
      "law",
      "education",
      "mass influence",
    ],
    reason:
      "Rahu amplifies Jupiter toward global scale, mass influence, finance, education, and ambitious expansion, while increasing ethical pressure.",
  },
  {
    planets: [
      "Mercury",
      "Ketu",
    ],
    kind:
      "detachment",
    polarity:
      "supportive",
    score:
      17,
    themes: [
      "research",
      "diagnostics",
      "coding",
      "cybersecurity",
      "symbolic analysis",
    ],
    reason:
      "Ketu sharpens Mercury toward research, diagnostics, coding, symbolic interpretation, and specialised technical intelligence.",
  },
  {
    planets: [
      "Jupiter",
      "Ketu",
    ],
    kind:
      "detachment",
    polarity:
      "supportive",
    score:
      17,
    themes: [
      "spiritual philosophy",
      "scripture",
      "occult knowledge",
      "detachment",
      "past wisdom",
    ],
    reason:
      "Ketu turns Jupiter toward spiritual philosophy, scripture, occult knowledge, and non-material wisdom.",
  },
];

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

function getPlanet(
  store:
    PlanetIntelligenceStore,
  planet:
    PlanetName
): PlanetIntelligence | undefined {
  return store.byPlanet[
    planet
  ];
}

function planetEvidenceIds(
  planet:
    PlanetIntelligence
): string[] {
  return uniqueStrings([
    ...planet.facts.evidenceIds,
    ...planet.evidence.map(
      (record) =>
        record.id
    ),
  ]);
}

function edgeId(params: {
  from: PlanetName;
  to: PlanetName;
  kind:
    PlanetaryInfluenceKind;
}): string {
  return [
    "planetary_influence",
    params.from.toLowerCase(),
    params.to.toLowerCase(),
    params.kind,
  ].join("_");
}

function createEdge(params: {
  from:
    PlanetIntelligence;
  to:
    PlanetIntelligence;
  kind:
    PlanetaryInfluenceKind;
  polarity:
    PlanetaryInfluencePolarity;
  baseScore: number;
  themes: string[];
  reasons: string[];
  evidenceIds?: string[];
}): PlanetaryInfluenceEdge {
  const strengthFactor =
    (
      params.from.strength
        .score +
      params.to.strength
        .score
    ) /
    200;

  const activationBoost =
    (
      params.from.activation
        .currentlyActive ||
      params.to.activation
        .currentlyActive
    )
      ? 6
      : 0;

  const score =
    clampScore(
      params.baseScore *
        3.5 *
        strengthFactor +
      activationBoost
    );

  const confidence =
    clampScore(
      (
        params.from
          .overallConfidence +
        params.to
          .overallConfidence
      ) /
      2
    );

  return {
    id:
      edgeId({
        from:
          params.from.planet,
        to:
          params.to.planet,
        kind:
          params.kind,
      }),

    from:
      params.from.planet,
    to:
      params.to.planet,

    kind:
      params.kind,
    polarity:
      params.polarity,

    score,
    confidence,

    themes:
      uniqueStrings(
        params.themes
      ),

    reasons:
      uniqueStrings(
        params.reasons
      ),

    evidenceIds:
      uniqueStrings([
        ...planetEvidenceIds(
          params.from
        ),
        ...planetEvidenceIds(
          params.to
        ),
        ...(
          params.evidenceIds ??
          []
        ),
      ]),
  };
}

function hasConjunction(
  first:
    PlanetIntelligence,
  second:
    PlanetIntelligence
): boolean {
  return (
    first.facts
      .conjunctions
      .includes(
        second.planet
      ) ||
    second.facts
      .conjunctions
      .includes(
        first.planet
      )
  );
}

function hasReceivedAspect(
  from:
    PlanetIntelligence,
  to:
    PlanetIntelligence
): boolean {
  return to.facts
    .aspectsReceived
    .some(
      (aspect) =>
        aspect.from ===
        from.planet
    );
}

function buildStructuralEdges(
  store:
    PlanetIntelligenceStore
): PlanetaryInfluenceEdge[] {
  const edges:
    PlanetaryInfluenceEdge[] = [];

  for (
    const firstName of
    PLANETS
  ) {
    const first =
      getPlanet(
        store,
        firstName
      );

    if (!first) {
      continue;
    }

    for (
      const secondName of
      PLANETS
    ) {
      if (
        firstName ===
        secondName
      ) {
        continue;
      }

      const second =
        getPlanet(
          store,
          secondName
        );

      if (!second) {
        continue;
      }

      if (
        hasConjunction(
          first,
          second
        ) &&
        firstName <
          secondName
      ) {
        edges.push(
          createEdge({
            from:
              first,
            to:
              second,
            kind:
              "conjunction",
            polarity:
              "mixed",
            baseScore:
              16,
            themes: [
              "combined expression",
            ],
            reasons: [
              `${first.planet} and ${second.planet} are conjunct in the natal chart.`,
            ],
          })
        );
      }

      if (
        hasReceivedAspect(
          first,
          second
        )
      ) {
        edges.push(
          createEdge({
            from:
              first,
            to:
              second,
            kind:
              "received_aspect",
            polarity:
              "mixed",
            baseScore:
              13,
            themes: [
              "direct influence",
            ],
            reasons: [
              `${first.planet} directly aspects ${second.planet}.`,
            ],
          })
        );
      }

      if (
        second.facts
          .dispositor ===
        first.planet
      ) {
        edges.push(
          createEdge({
            from:
              first,
            to:
              second,
            kind:
              "dispositor",
            polarity:
              "supportive",
            baseScore:
              14,
            themes: [
              "expression channel",
            ],
            reasons: [
              `${first.planet} disposes ${second.planet} and therefore channels how it expresses.`,
            ],
          })
        );
      }
    }
  }

  return edges;
}

function buildPairEdges(
  store:
    PlanetIntelligenceStore
): PlanetaryInfluenceEdge[] {
  const edges:
    PlanetaryInfluenceEdge[] = [];

  for (
    const rule of
    PAIR_RULES
  ) {
    const first =
      getPlanet(
        store,
        rule.planets[0]
      );

    const second =
      getPlanet(
        store,
        rule.planets[1]
      );

    if (
      !first ||
      !second
    ) {
      continue;
    }

    const connected =
      hasConjunction(
        first,
        second
      ) ||
      hasReceivedAspect(
        first,
        second
      ) ||
      hasReceivedAspect(
        second,
        first
      ) ||
      first.facts
        .dispositor ===
        second.planet ||
      second.facts
        .dispositor ===
        first.planet;

    if (!connected) {
      continue;
    }

    edges.push(
      createEdge({
        from:
          first,
        to:
          second,
        kind:
          rule.kind,
        polarity:
          rule.polarity,
        baseScore:
          rule.score,
        themes:
          rule.themes,
        reasons: [
          rule.reason,
        ],
      })
    );
  }

  return edges;
}

function deduplicateEdges(
  edges:
    PlanetaryInfluenceEdge[]
): PlanetaryInfluenceEdge[] {
  const map =
    new Map<
      string,
      PlanetaryInfluenceEdge
    >();

  for (
    const edge of
    edges
  ) {
    const existing =
      map.get(
        edge.id
      );

    if (!existing) {
      map.set(
        edge.id,
        edge
      );
      continue;
    }

    map.set(
      edge.id,
      {
        ...existing,

        score:
          Math.max(
            existing.score,
            edge.score
          ),

        confidence:
          Math.max(
            existing.confidence,
            edge.confidence
          ),

        themes:
          uniqueStrings([
            ...existing.themes,
            ...edge.themes,
          ]),

        reasons:
          uniqueStrings([
            ...existing.reasons,
            ...edge.reasons,
          ]),

        evidenceIds:
          uniqueStrings([
            ...existing
              .evidenceIds,
            ...edge
              .evidenceIds,
          ]),
      }
    );
  }

  return Array.from(
    map.values()
  ).sort(
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

function buildNodes(
  store:
    PlanetIntelligenceStore,
  edges:
    PlanetaryInfluenceEdge[]
): Record<
  PlanetName,
  PlanetaryInfluenceNode
> {
  const nodes =
    {} as Record<
      PlanetName,
      PlanetaryInfluenceNode
    >;

  for (
    const planetName of
    PLANETS
  ) {
    const planet =
      getPlanet(
        store,
        planetName
      );

    nodes[
      planetName
    ] = {
      planet:
        planetName,

      strengthScore:
        planet?.strength
          .score ??
        0,

      confidence:
        planet
          ?.overallConfidence ??
        0,

      currentlyActive:
        planet
          ?.activation
          .currentlyActive ??
        false,

      incomingEdgeIds:
        edges
          .filter(
            (edge) =>
              edge.to ===
              planetName
          )
          .map(
            (edge) =>
              edge.id
          ),

      outgoingEdgeIds:
        edges
          .filter(
            (edge) =>
              edge.from ===
              planetName
          )
          .map(
            (edge) =>
              edge.id
          ),
    };
  }

  return nodes;
}

export function buildPlanetaryInfluenceGraph(
  store:
    PlanetIntelligenceStore
): PlanetaryInfluenceGraph {
  const warnings:
    string[] = [];

  for (
    const planet of
    PLANETS
  ) {
    if (
      !store.byPlanet[
        planet
      ]
    ) {
      warnings.push(
        `${planet} intelligence is unavailable for the planetary influence graph.`
      );
    }
  }

  const edges =
    deduplicateEdges([
      ...buildStructuralEdges(
        store
      ),
      ...buildPairEdges(
        store
      ),
    ]);

  return {
    nodes:
      buildNodes(
        store,
        edges
      ),

    edges,

    supportiveEdges:
      edges.filter(
        (edge) =>
          edge.polarity ===
          "supportive"
      ),

    challengingEdges:
      edges.filter(
        (edge) =>
          edge.polarity ===
          "challenging"
      ),

    warnings,
  };
}
