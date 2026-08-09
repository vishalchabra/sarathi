import {
  TARGET_PROFILES,
} from "./definitions";

import type {
  CapabilityMatcherStore,
} from "./types";

export function buildCapabilityMatcherStore():
  CapabilityMatcherStore {
  const byKey:
    CapabilityMatcherStore[
      "byKey"
    ] = {};

  const warnings:
    string[] = [];

  for (
    const profile of
    TARGET_PROFILES
  ) {
    if (
      byKey[
        profile.key
      ]
    ) {
      warnings.push(
        `Duplicate target profile key: ${profile.key}.`
      );
    }

    byKey[
      profile.key
    ] =
      profile;
  }

  return {
    profiles:
      TARGET_PROFILES,

    byKey,

    warnings,
  };
}