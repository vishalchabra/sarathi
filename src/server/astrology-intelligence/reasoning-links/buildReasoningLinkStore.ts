import type {
  CapabilityStore,
} from "../capabilities/types";

import type {
  CapabilityOntologyStore,
} from "../capability-ontology/types";

import type {
  CapabilityMatcherStore,
} from "../capability-matcher/types";

import type {
  ReasoningFactStore,
} from "../reasoning-facts/types";

import {
  buildFactCapabilityLinks,
} from "./buildFactCapabilityLinks";

import {
  buildCapabilityExpressionLinks,
} from "./buildCapabilityExpressionLinks";

import {
  buildExpressionTargetLinks,
} from "./buildExpressionTargetLinks";

import type {
  ReasoningLink,
  ReasoningLinkStore,
} from "./types";

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

export function buildReasoningLinkStore(params: {
  facts:
    ReasoningFactStore;

  capabilities:
    CapabilityStore;

  ontology:
    CapabilityOntologyStore;

  matcher:
    CapabilityMatcherStore;
}): ReasoningLinkStore {
  const links =
    [
      ...buildFactCapabilityLinks({
        facts:
          params.facts,

        capabilities:
          params.capabilities,
      }),

      ...buildCapabilityExpressionLinks({
        capabilities:
          params.capabilities,

        ontology:
          params.ontology,
      }),

      ...buildExpressionTargetLinks({
        ontology:
          params.ontology,

        matcher:
          params.matcher,
      }),
    ];

  const byId:
    ReasoningLinkStore[
      "byId"
    ] = {};

  const byFrom:
    ReasoningLinkStore[
      "byFrom"
    ] = {};

  const byTo:
    ReasoningLinkStore[
      "byTo"
    ] = {};

  const byType:
    ReasoningLinkStore[
      "byType"
    ] = {};

  const warnings:
    string[] = [];

  for (
    const link of links
  ) {
    if (
      byId[
        link.id
      ]
    ) {
      warnings.push(
        `Duplicate reasoning link id: ${link.id}.`
      );

      continue;
    }

    byId[
      link.id
    ] =
      link;

    byFrom[
      link.from
    ] ??= [];

    byFrom[
      link.from
    ].push(
      link
    );

    byTo[
      link.to
    ] ??= [];

    byTo[
      link.to
    ].push(
      link
    );

    byType[
      link.type
    ] ??= [];

    byType[
      link.type
    ]?.push(
      link
    );
  }

  if (
    links.length ===
    0
  ) {
    warnings.push(
      "No reasoning links could be generated."
    );
  }

  const factLinks =
    byType
      .fact_capability ??
    [];

  const capabilityLinks =
    byType
      .capability_expression ??
    [];

  const targetLinks =
    byType
      .expression_target ??
    [];

  if (
    factLinks.length ===
    0
  ) {
    warnings.push(
      "No fact-to-capability links were generated."
    );
  }

  if (
    capabilityLinks.length ===
    0
  ) {
    warnings.push(
      "No capability-to-expression links were generated."
    );
  }

  if (
    targetLinks.length ===
    0
  ) {
    warnings.push(
      "No expression-to-target links were generated."
    );
  }

  const sortedLinks =
    [...links].sort(
      (
        first,
        second
      ) =>
        second.weight -
          first.weight ||
        second.confidence -
          first.confidence
    );

  return {
    links:
      sortedLinks,

    byId,

    byFrom,

    byTo,

    byType,

    warnings:
      unique(
        warnings
      ),
  };
}