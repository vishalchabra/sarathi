import type {
  Capability,
  CapabilityStore,
} from "../capabilities/types";

import type {
  CapabilityMatchContribution,
  CapabilityMatchResult,
  TargetProfile,
} from "../capability-matcher/types";

import type {
  CapabilityOntologyStore,
} from "../capability-ontology/types";

import type {
  ReasoningFactStore,
} from "../reasoning-facts/types";

import type {
  ReasoningLink,
  ReasoningLinkStore,
} from "../reasoning-links/types";

import type {
  ReasoningContradiction,
  ReasoningPath,
  ReasoningTrace,
  ReasoningTraceNode,
  TraversalOptions,
} from "./types";

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

function node(params: {
  id: string;
  type:
    ReasoningTraceNode["type"];
  label: string;
  score?: number | null;
  confidence?: number | null;
  evidenceIds?: string[];
  reasons?: string[];
  metadata?: Record<
    string,
    unknown
  >;
}): ReasoningTraceNode {
  return {
    id:
      params.id,

    type:
      params.type,

    label:
      params.label,

    score:
      params.score ??
      null,

    confidence:
      params.confidence ??
      null,

    evidenceIds:
      params.evidenceIds ??
      [],

    reasons:
      params.reasons ??
      [],

    metadata:
      params.metadata ??
      {},
  };
}

function expressionLabel(
  link:
    ReasoningLink
): string {
  const label =
    link.metadata[
      "expressionLabel"
    ];

  return typeof label ===
    "string"
    ? label
    : link.to;
}

function contributionMap(
  match:
    CapabilityMatchResult,
  includeOptional:
    boolean
): Map<
  string,
  CapabilityMatchContribution
> {
  const contributions = [
    ...match
      .requiredContributions,

    ...(
      includeOptional
        ? match
            .optionalContributions
        : []
    ),
  ];

  return new Map(
    contributions.map(
      (item) => [
        item.capabilityKey,
        item,
      ]
    )
  );
}

function linksToTarget(
  store:
    ReasoningLinkStore,
  targetKey:
    string
): ReasoningLink[] {
  return (
    store.byTo[
      `target:${targetKey}`
    ] ??
    []
  ).filter(
    (link) =>
      link.type ===
      "expression_target"
  );
}

function linksToExpression(
  store:
    ReasoningLinkStore,
  expressionId:
    string
): ReasoningLink[] {
  return (
    store.byTo[
      expressionId
    ] ??
    []
  ).filter(
    (link) =>
      link.type ===
      "capability_expression"
  );
}

function linksToCapability(
  store:
    ReasoningLinkStore,
  capabilityKey:
    string
): ReasoningLink[] {
  return (
    store.byTo[
      `capability:${capabilityKey}`
    ] ??
    []
  ).filter(
    (link) =>
      link.type ===
      "fact_capability"
  );
}

function capabilityKeyFromLink(
  link:
    ReasoningLink
): string {
  const metadataKey =
    link.metadata[
      "capabilityKey"
    ];

  if (
    typeof metadataKey ===
    "string"
  ) {
    return metadataKey;
  }

  return link.from.replace(
    /^capability:/,
    ""
  );
}

function buildPath(params: {
  target:
    TargetProfile;

  match:
    CapabilityMatchResult;

  contribution:
    CapabilityMatchContribution;

  capability:
    Capability;

  factStore:
    ReasoningFactStore;

  expressionTargetLink:
    ReasoningLink;

  capabilityExpressionLink:
    ReasoningLink;

  factCapabilityLink:
    ReasoningLink;
}): ReasoningPath | null {
  const fact =
    params.factStore.byId[
      params.factCapabilityLink
        .from
    ];

  if (!fact) {
    return null;
  }

  const expressionId =
    params
      .capabilityExpressionLink
      .to;

  const expression =
    expressionLabel(
      params
        .capabilityExpressionLink
    );

  const targetNode =
    node({
      id:
        `target:${params.target.key}`,

      type:
        "target",

      label:
        params.target.label,

      score:
        params.match.score,

      confidence:
        params.match
          .confidence,

      reasons:
        params.match
          .requiredContributions
          .flatMap(
            (item) =>
              item.reasons
          )
          .slice(0, 6),

      metadata: {
        kind:
          params.target.kind,
      },
    });

  const expressionNode =
    node({
      id:
        expressionId,

      type:
        "expression",

      label:
        expression,

      score:
        params
          .capabilityExpressionLink
          .weight,

      confidence:
        params
          .capabilityExpressionLink
          .confidence,

      evidenceIds:
        params
          .capabilityExpressionLink
          .evidenceIds,

      reasons:
        params
          .capabilityExpressionLink
          .reasons,

      metadata:
        params
          .capabilityExpressionLink
          .metadata,
    });

  const capabilityNode =
    node({
      id:
        `capability:${params.capability.key}`,

      type:
        "capability",

      label:
        params.capability.label,

      score:
        params.capability.score,

      confidence:
        params.capability
          .confidence,

      evidenceIds:
        params.capability
          .evidenceIds,

      reasons:
        params.capability
          .reasons,

      metadata: {
        category:
          params.capability
            .category,

        required:
          params.contribution
            .required,

        minimumScore:
          params.contribution
            .minimumScore,
      },
    });

  const factNode =
    node({
      id:
        fact.id,

      type:
        "fact",

      label:
        fact.label,

      score:
        fact.weight,

      confidence:
        fact.confidence,

      evidenceIds:
        fact.evidenceIds,

      reasons: [
        fact.detail,
      ],

      metadata: {
        kind:
          fact.kind,

        source:
          fact.source,

        planets:
          fact.planets,

        houses:
          fact.houses,

        signs:
          fact.signs,

        polarity:
          fact.polarity,
      },
    });

  const weight =
    clamp(
      params
        .factCapabilityLink
        .weight *
        0.4 +
      params
        .capabilityExpressionLink
        .weight *
        0.3 +
      params
        .expressionTargetLink
        .weight *
        0.2 +
      params.contribution
        .fitScore *
        0.1
    );

  const confidence =
    clamp(
      params
        .factCapabilityLink
        .confidence *
        0.4 +
      params
        .capabilityExpressionLink
        .confidence *
        0.3 +
      params
        .expressionTargetLink
        .confidence *
        0.2 +
      params.contribution
        .confidence *
        0.1
    );

  return {
    id:
      `path_${fact.id}_${params.capability.key}_${expressionId}_${params.target.key}`,

    targetKey:
      params.target.key,

    targetLabel:
      params.target.label,

    capabilityKey:
      params.capability.key,

    capabilityLabel:
      params.capability.label,

    expressionId,

    expressionLabel:
      expression,

    factId:
      fact.id,

    factLabel:
      fact.label,

    weight,
    confidence,

    required:
      params.contribution
        .required,

    thresholdMet:
      params.contribution
        .actualScore >=
      params.contribution
        .minimumScore,

    steps: [
      {
        from:
          factNode,

        link:
          params
            .factCapabilityLink,

        to:
          capabilityNode,
      },
      {
        from:
          capabilityNode,

        link:
          params
            .capabilityExpressionLink,

        to:
          expressionNode,
      },
      {
        from:
          expressionNode,

        link:
          params
            .expressionTargetLink,

        to:
          targetNode,
      },
    ],

    evidenceIds:
      unique([
        ...fact.evidenceIds,

        ...params
          .factCapabilityLink
          .evidenceIds,

        ...params
          .capabilityExpressionLink
          .evidenceIds,

        ...params
          .expressionTargetLink
          .evidenceIds,

        ...params.contribution
          .evidenceIds,
      ]),

    reasons:
      unique([
        fact.detail,

        ...params
          .factCapabilityLink
          .reasons,

        ...params
          .capabilityExpressionLink
          .reasons,

        ...params
          .expressionTargetLink
          .reasons,

        ...params.contribution
          .reasons,
      ]),
  };
}

function buildContradictions(
  match:
    CapabilityMatchResult
): ReasoningContradiction[] {
  return match
    .requiredContributions
    .filter(
      (item) =>
        item.actualScore <
        item.minimumScore
    )
    .map(
      (item) => ({
        capabilityKey:
          item.capabilityKey,

        capabilityLabel:
          item.capabilityLabel,

        score:
          item.actualScore,

        minimumScore:
          item.minimumScore,

        gap:
          item.gap,

        reasons:
          item.reasons,

        evidenceIds:
          item.evidenceIds,
      })
    )
    .sort(
      (
        first,
        second
      ) =>
        second.gap -
        first.gap
    );
}

function buildSummary(params: {
  match:
    CapabilityMatchResult;
  strongestPaths:
    ReasoningPath[];
  contradictions:
    ReasoningContradiction[];
}): string {
  const topCapabilities =
    unique(
      params.strongestPaths
        .map(
          (path) =>
            path.capabilityLabel
        )
    )
      .slice(0, 3)
      .join(", ");

  const topFacts =
    unique(
      params.strongestPaths
        .map(
          (path) =>
            path.factLabel
        )
    )
      .slice(0, 3)
      .join("; ");

  const contradictionText =
    params.contradictions
      .slice(0, 2)
      .map(
        (item) =>
          `${item.capabilityLabel} is below the target threshold`
      )
      .join(" and ");

  return `${params.match.targetLabel} is assessed as ${params.match.verdict.replace(
    /_/g,
    " "
  )} at ${params.match.score}/100. ${
    topCapabilities
      ? `The strongest reasoning paths run through ${topCapabilities}.`
      : "No strong capability path could be traced."
  } ${
    topFacts
      ? `The leading supporting facts are ${topFacts}.`
      : ""
  } ${
    contradictionText
      ? `The main contradictions are that ${contradictionText}.`
      : "No major required capability contradiction is present."
  }`.trim();
}

export function buildReasoningTrace(params: {
  target:
    TargetProfile;

  match:
    CapabilityMatchResult;

  facts:
    ReasoningFactStore;

  capabilities:
    CapabilityStore;

  ontology:
    CapabilityOntologyStore;

  links:
    ReasoningLinkStore;

  options?:
    TraversalOptions;
}): ReasoningTrace {
  const options = {
    maxPaths:
      params.options
        ?.maxPaths ??
      40,

    maxFactsPerCapability:
      params.options
        ?.maxFactsPerCapability ??
      5,

    minimumLinkWeight:
      params.options
        ?.minimumLinkWeight ??
      20,

    includeOptionalCapabilities:
      params.options
        ?.includeOptionalCapabilities ??
      true,
  };

  const warnings:
    string[] = [];

  const contributions =
    contributionMap(
      params.match,
      options
        .includeOptionalCapabilities
    );

  const paths:
    ReasoningPath[] = [];

  const targetLinks =
    linksToTarget(
      params.links,
      params.target.key
    );

  for (
    const expressionTargetLink of
    targetLinks
  ) {
    if (
      expressionTargetLink.weight <
      options.minimumLinkWeight
    ) {
      continue;
    }

    const expressionLinks =
      linksToExpression(
        params.links,
        expressionTargetLink.from
      );

    for (
      const capabilityExpressionLink of
      expressionLinks
    ) {
      const capabilityKey =
        capabilityKeyFromLink(
          capabilityExpressionLink
        );

      const contribution =
        contributions.get(
          capabilityKey
        );

      if (!contribution) {
        continue;
      }

      const capability =
        params.capabilities
          .byKey[
            capabilityKey
          ];

      if (!capability) {
        warnings.push(
          `Capability ${capabilityKey} was referenced by the reasoning graph but could not be found.`
        );

        continue;
      }

      const factLinks =
        linksToCapability(
          params.links,
          capabilityKey
        )
          .filter(
            (link) =>
              link.weight >=
              options
                .minimumLinkWeight
          )
          .sort(
            (
              first,
              second
            ) =>
              second.weight -
                first.weight ||
              second.confidence -
                first.confidence
          )
          .slice(
            0,
            options
              .maxFactsPerCapability
          );

      for (
        const factCapabilityLink of
        factLinks
      ) {
        const path =
          buildPath({
            target:
              params.target,

            match:
              params.match,

            contribution,

            capability,

            factStore:
              params.facts,

            expressionTargetLink,

            capabilityExpressionLink,

            factCapabilityLink,
          });

        if (path) {
          paths.push(
            path
          );
        }
      }
    }
  }

  const supportingPaths =
    paths
      .sort(
        (
          first,
          second
        ) =>
          second.weight -
            first.weight ||
          second.confidence -
            first.confidence
      )
      .slice(
        0,
        options.maxPaths
      );

  const strongestPaths:
    ReasoningPath[] = [];

  const seenCapabilities =
    new Set<string>();

  for (
    const path of
    supportingPaths
  ) {
    if (
      seenCapabilities.has(
        path.capabilityKey
      )
    ) {
      continue;
    }

    seenCapabilities.add(
      path.capabilityKey
    );

    strongestPaths.push(
      path
    );

    if (
      strongestPaths.length >=
      8
    ) {
      break;
    }
  }

  if (
    supportingPaths.length ===
    0
  ) {
    warnings.push(
      `No complete reasoning path could be traced for target ${params.target.key}.`
    );
  }

  const contradictions =
    buildContradictions(
      params.match
    );

  const evidenceIds =
    unique([
      ...supportingPaths.flatMap(
        (path) =>
          path.evidenceIds
      ),

      ...contradictions.flatMap(
        (item) =>
          item.evidenceIds
      ),
    ]);

  return {
    targetKey:
      params.target.key,

    targetLabel:
      params.target.label,

    targetKind:
      params.target.kind,

    matchScore:
      params.match.score,

    matchConfidence:
      params.match
        .confidence,

    verdict:
      params.match.verdict,

    supportingPaths,

    strongestPaths,

    contradictions,

    strengths:
      params.match
        .strengths,

    gaps:
      params.match
        .gaps,

    cautions:
      params.match
        .cautions,

    evidenceIds,

    summary:
      buildSummary({
        match:
          params.match,

        strongestPaths,

        contradictions,
      }),

    warnings:
      unique(
        warnings
      ),

    match:
      params.match,
  };
}