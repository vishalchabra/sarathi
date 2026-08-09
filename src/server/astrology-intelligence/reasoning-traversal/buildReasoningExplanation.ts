import type {
  ReasoningPath,
  ReasoningTrace,
} from "./types";

export type ReasoningExplanation = {
  headline: string;

  directAnswer: string;

  strongestReasons: string[];

  supportingPaths: Array<{
    fact: string;
    capability: string;
    expression: string;
    target: string;
    weight: number;
    confidence: number;
  }>;

  contradictions: string[];
  cautions: string[];

  evidenceIds: string[];

  narrative: string;
};

function verdictLanguage(
  verdict: string
): string {
  switch (verdict) {
    case "excellent_fit":
      return "an excellent fit";

    case "strong_fit":
      return "a strong fit";

    case "moderate_fit":
      return "a moderate fit";

    case "conditional_fit":
      return "a conditional fit";

    case "weak_fit":
      return "a weak fit";

    case "insufficient_data":
      return "not sufficiently supported by the available data";

    default:
      return verdict.replace(
        /_/g,
        " "
      );
  }
}

function pathSentence(
  path:
    ReasoningPath
): string {
  return `${path.factLabel} supports ${path.capabilityLabel}, which expresses through ${path.expressionLabel} and contributes to the ${path.targetLabel} profile.`;
}

export function buildReasoningExplanation(
  trace:
    ReasoningTrace
): ReasoningExplanation {
  const strongestReasons =
    trace.strongestPaths
      .slice(0, 6)
      .map(
        pathSentence
      );

  const contradictions =
    trace.contradictions
      .slice(0, 5)
      .map(
        (item) =>
          `${item.capabilityLabel} is ${item.score}/100 against a required threshold of ${item.minimumScore}/100.`
      );

  const directAnswer =
    `${trace.targetLabel} is ${verdictLanguage(
      trace.verdict
    )} at ${trace.matchScore}/100.`;

  const supportText =
    strongestReasons.length >
      0
      ? strongestReasons
          .slice(0, 3)
          .join(" ")
      : "The available graph does not yet contain a complete supporting path.";

  const contradictionText =
    contradictions.length >
      0
      ? ` However, ${contradictions
          .slice(0, 2)
          .join(" ")}`
      : "";

  const cautionText =
    trace.cautions.length >
      0
      ? ` The main cautions are ${trace.cautions
          .slice(0, 2)
          .join(" and ")}.`
      : "";

  return {
    headline:
      `${trace.targetLabel}: ${trace.verdict.replace(
        /_/g,
        " "
      )}`,

    directAnswer,

    strongestReasons,

    supportingPaths:
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

            target:
              path.targetLabel,

            weight:
              path.weight,

            confidence:
              path.confidence,
          })
        ),

    contradictions,

    cautions:
      trace.cautions
        .slice(0, 6),

    evidenceIds:
      trace.evidenceIds,

    narrative:
      `${directAnswer} ${supportText}${contradictionText}${cautionText}`.trim(),
  };
}