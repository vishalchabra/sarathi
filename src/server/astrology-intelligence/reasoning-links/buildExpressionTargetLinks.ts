import type {
  CapabilityOntologyStore,
} from "../capability-ontology/types";

import type {
  CapabilityMatcherStore,
  TargetProfile,
} from "../capability-matcher/types";

import type {
  ReasoningLink,
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

function normalize(
  value: string
): string {
  return String(value ?? "")
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

function targetNeedsCapability(
  target:
    TargetProfile,
  capabilityKey:
    string
): {
  matched: boolean;
  required: boolean;
  weight: number;
  reason: string;
} {
  const required =
    target.requirements.find(
      (item) =>
        item.capabilityKey ===
        capabilityKey
    );

  if (required) {
    return {
      matched:
        true,

      required:
        required.required,

      weight:
        required.weight,

      reason:
        required.reason,
    };
  }

  const optional =
    target
      .optionalCapabilities
      .find(
        (item) =>
          item.capabilityKey ===
          capabilityKey
      );

  if (optional) {
    return {
      matched:
        true,

      required:
        false,

      weight:
        optional.weight,

      reason:
        optional.reason,
    };
  }

  return {
    matched:
      false,

    required:
      false,

    weight:
      0,

    reason:
      "",
  };
}

export function buildExpressionTargetLinks(params: {
  ontology:
    CapabilityOntologyStore;

  matcher:
    CapabilityMatcherStore;
}): ReasoningLink[] {
  const links:
    ReasoningLink[] = [];

  for (
    const definition of
    params.ontology
      .definitions
  ) {
    definition.expressions.forEach(
      (
        expression,
        expressionIndex
      ) => {
        const expressionId =
          `expression:${definition.key}:${normalize(
            expression.label
          )}:${expressionIndex}`;

        for (
          const target of
          params.matcher
            .profiles
        ) {
          const match =
            targetNeedsCapability(
              target,
              definition.key
            );

          if (!match.matched) {
            continue;
          }

          const domainCompatible =
            expression.domains
              .some(
                (domain) =>
                  target.domains
                    .includes(
                      domain
                    )
              );

          if (!domainCompatible) {
            continue;
          }

          const weight =
            clamp(
              match.weight *
                70 +
              (
                match.required
                  ? 20
                  : 8
              )
            );

          links.push({
            id:
              `link_expression_${normalize(
                expressionId
              )}_target_${normalize(
                target.key
              )}`,

            type:
              "expression_target",

            from:
              expressionId,

            to:
              `target:${target.key}`,

            weight,

            confidence:
              domainCompatible
                ? 90
                : 55,

            evidenceIds:
              [],

            reasons: [
              `${expression.label} supports the ${target.label} profile.`,
              match.reason,
              expression.description,
            ],

            metadata: {
              capabilityKey:
                definition.key,

              expressionLabel:
                expression.label,

              targetKey:
                target.key,

              targetKind:
                target.kind,

              required:
                match.required,

              profileWeight:
                match.weight,

              sharedDomains:
                expression.domains
                  .filter(
                    (domain) =>
                      target.domains
                        .includes(
                          domain
                        )
                  ),
            },
          });
        }
      }
    );
  }

  return links.sort(
    (
      first,
      second
    ) =>
      second.weight -
        first.weight ||
      second.confidence -
        first.confidence
  );
}