import type {
  CapabilityMatcherStore,
} from "../capability-matcher/types";

import {
  resolveReasoningIntent,
} from "./intent/resolveReasoningIntent";

import {
  resolveTargetEntities,
} from "./entity/resolveTargetEntities";

import {
  resolveTargetProfiles,
} from "./resolver/resolveTargetProfiles";

import type {
  ReasoningResult,
} from "./types";

export function resolveReasoningRequest(params: {
  question: string;

  matcherStore:
    CapabilityMatcherStore;
}): ReasoningResult {
  const intent =
    resolveReasoningIntent(
      params.question
    );

  const entities =
    resolveTargetEntities(
      params.question
    );

  const targets =
    resolveTargetProfiles({
      intent,
      entities,
      matcherStore:
        params.matcherStore,
    });

  const warnings:
    string[] = [];

  if (
    entities.length ===
    0
  ) {
    warnings.push(
      "No known target entity could be resolved from the question."
    );
  }

  if (
    entities.length >
      0 &&
    targets.length ===
      0
  ) {
    warnings.push(
      "Entities were detected, but no registered target profile could be resolved."
    );
  }

  return {
    question:
      params.question,

    intent,

    entities,

    targets,

    warnings,
  };
}