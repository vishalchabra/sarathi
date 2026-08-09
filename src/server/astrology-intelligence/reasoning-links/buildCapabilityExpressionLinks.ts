import type {
  Capability,
  CapabilityStore,
} from "../capabilities/types";

import type {
  CapabilityOntologyStore,
} from "../capability-ontology/types";

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

function getCapability(
  store: CapabilityStore,
  key: string
): Capability | undefined {
  return store.byKey[key];
}

export function buildCapabilityExpressionLinks(params: {
  capabilities:
    CapabilityStore;

  ontology:
    CapabilityOntologyStore;
}): ReasoningLink[] {
  const links:
    ReasoningLink[] = [];

  for (
    const definition of
    params.ontology
      .definitions
  ) {
    const capability =
      getCapability(
        params.capabilities,
        definition.key
      );

    if (!capability) {
      continue;
    }

    definition.expressions.forEach(
      (
        expression,
        index
      ) => {
        const supporting =
          (
            expression
              .supportingCapabilityKeys ??
            []
          )
            .map(
              (key) =>
                getCapability(
                  params.capabilities,
                  key
                )
            )
            .filter(
              (
                item
              ): item is Capability =>
                Boolean(item)
            );

        const supportingScore =
          supporting.length ===
          0
            ? capability.score
            : supporting.reduce(
                (
                  sum,
                  item
                ) =>
                  sum +
                  item.score,
                0
              ) /
              supporting.length;

        const minimumScore =
          expression
            .minimumScore ??
          0;

        const thresholdFactor =
          minimumScore <=
          0
            ? 1
            : Math.min(
                1.2,
                capability.score /
                  minimumScore
              );

        const weight =
          clamp(
            (
              capability.score *
                0.68 +
              supportingScore *
                0.32
            ) *
              Math.min(
                1,
                thresholdFactor
              )
          );

        const confidence =
          clamp(
            (
              capability.confidence +
              (
                supporting.length ===
                0
                  ? capability
                      .confidence
                  : supporting.reduce(
                      (
                        sum,
                        item
                      ) =>
                        sum +
                        item.confidence,
                      0
                    ) /
                    supporting.length
              )
            ) /
              2
          );

        const expressionId =
          `expression:${definition.key}:${normalize(
            expression.label
          )}:${index}`;

        links.push({
          id:
            `link_capability_${normalize(
              capability.key
            )}_expression_${normalize(
              expression.label
            )}_${index}`,

          type:
            "capability_expression",

          from:
            `capability:${capability.key}`,

          to:
            expressionId,

          weight,
          confidence,

          evidenceIds:
            capability
              .evidenceIds,

          reasons: [
            `${capability.label} supports ${expression.label}.`,
            expression.description,
            ...supporting.map(
              (item) =>
                `${item.label} strengthens this expression.`
            ),
          ],

          metadata: {
            capabilityKey:
              capability.key,

            expressionLabel:
              expression.label,

            domains:
              expression.domains,

            minimumScore,

            actualScore:
              capability.score,

            thresholdMet:
              capability.score >=
              minimumScore,

            supportingCapabilityKeys:
              supporting.map(
                (item) =>
                  item.key
              ),
          },
        });
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