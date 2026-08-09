import type {
  CapabilityMatcherStore,
} from "../../capability-matcher/types";

import type {
  ReasoningIntent,
  ResolvedEntity,
  ResolvedTarget,
} from "../types";

const INTENT_KIND_COMPATIBILITY:
  Partial<
    Record<
      ReasoningIntent,
      string[]
    >
  > = {
  career_suitability: [
    "career",
    "leadership",
    "creative",
  ],

  business_suitability: [
    "business",
  ],

  education_suitability: [
    "career",
    "education",
    "spiritual",
  ],

  role_suitability: [
    "career",
    "leadership",
    "business",
  ],

  relationship_suitability: [
    "relationship",
  ],

  health_suitability: [
    "health",
  ],

  spiritual_path: [
    "spiritual",
  ],
};

export function resolveTargetProfiles(params: {
  intent:
    ReasoningIntent;

  entities:
    ResolvedEntity[];

  matcherStore:
    CapabilityMatcherStore;
}): ResolvedTarget[] {
  const allowedKinds =
    INTENT_KIND_COMPATIBILITY[
      params.intent
    ];

  const targets =
    params.entities.flatMap(
      (entity) => {
        const profile =
          params.matcherStore
            .byKey[
              entity.key
            ];

        if (!profile) {
          return [];
        }

        const intentCompatible =
          !allowedKinds ||
          allowedKinds.includes(
            profile.kind
          );

        const confidence =
          Math.max(
            0,
            Math.min(
              100,
              entity.confidence +
                (
                  intentCompatible
                    ? 5
                    : -20
                )
            )
          );

        return [
          {
            profileKey:
              profile.key,

            profileLabel:
              profile.label,

            confidence,

            matchedEntityKeys: [
              entity.key,
            ],

            reasons: [
              `Matched "${entity.matchedText}" to ${profile.label}.`,
              intentCompatible
                ? `The target profile is compatible with the ${params.intent.replace(
                    /_/g,
                    " "
                  )} intent.`
                : `The target profile was found, but its kind does not strongly match the detected intent.`,
            ],
          },
        ];
      }
    );

  const byProfile =
    new Map<
      string,
      ResolvedTarget
    >();

  for (
    const target of
    targets
  ) {
    const existing =
      byProfile.get(
        target.profileKey
      );

    if (!existing) {
      byProfile.set(
        target.profileKey,
        target
      );

      continue;
    }

    existing.confidence =
      Math.max(
        existing.confidence,
        target.confidence
      );

    existing.matchedEntityKeys =
      Array.from(
        new Set([
          ...existing
            .matchedEntityKeys,
          ...target
            .matchedEntityKeys,
        ])
      );

    existing.reasons =
      Array.from(
        new Set([
          ...existing.reasons,
          ...target.reasons,
        ])
      );
  }

  return Array.from(
    byProfile.values()
  )
    .sort(
      (
        first,
        second
      ) =>
        second.confidence -
        first.confidence
    )
    .slice(
      0,
      5
    );
}