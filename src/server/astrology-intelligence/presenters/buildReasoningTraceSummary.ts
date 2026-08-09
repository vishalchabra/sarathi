import type {
  ReasoningTrace,
} from "../reasoning-traversal/types";

import {
  buildReasoningExplanation,
} from "../reasoning-traversal/buildReasoningExplanation";

export type ReasoningTraceSummary = {
  target: {
    key: string;
    label: string;
    kind: string;
  };

  score: number;
  confidence: number;
  verdict: string;

  strongestPaths: Array<{
    fact: string;
    capability: string;
    expression: string;
    weight: number;
    confidence: number;
  }>;

  contradictions: Array<{
    capability: string;
    score: number;
    requiredScore: number;
    gap: number;
  }>;

  explanation: {
    headline: string;
    directAnswer: string;
    strongestReasons: string[];
    narrative: string;
  };

  cautions: string[];
  evidenceIds: string[];
  warnings: string[];
};

export function buildReasoningTraceSummary(
  trace:
    ReasoningTrace
): ReasoningTraceSummary {
  const explanation =
    buildReasoningExplanation(
      trace
    );

  return {
    target: {
      key:
        trace.targetKey,

      label:
        trace.targetLabel,

      kind:
        trace.targetKind,
    },

    score:
      trace.matchScore,

    confidence:
      trace.matchConfidence,

    verdict:
      trace.verdict,

    strongestPaths:
      trace.strongestPaths
        .slice(0, 8)
        .map(
          (path) => ({
            fact:
              path.factLabel,

            capability:
              path.capabilityLabel,

            expression:
              path.expressionLabel,

            weight:
              path.weight,

            confidence:
              path.confidence,
          })
        ),

    contradictions:
      trace.contradictions
        .slice(0, 6)
        .map(
          (item) => ({
            capability:
              item.capabilityLabel,

            score:
              item.score,

            requiredScore:
              item.minimumScore,

            gap:
              item.gap,
          })
        ),

    explanation: {
      headline:
        explanation.headline,

      directAnswer:
        explanation.directAnswer,

      strongestReasons:
        explanation
          .strongestReasons,

      narrative:
        explanation.narrative,
    },

    cautions:
      trace.cautions
        .slice(0, 6),

    evidenceIds:
      trace.evidenceIds,

    warnings:
      trace.warnings,
  };
}