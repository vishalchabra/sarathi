import {
  CAPABILITY_ONTOLOGY_DEFINITIONS,
  CAPABILITY_RELATIONSHIP_DEFINITIONS,
} from "./definitions";

import type {
  CapabilityOntologyStore,
} from "./types";

export function buildCapabilityOntologyStore():
  CapabilityOntologyStore {
  const byKey:
    CapabilityOntologyStore[
      "byKey"
    ] = {};

  for (
    const definition of
    CAPABILITY_ONTOLOGY_DEFINITIONS
  ) {
    byKey[
      definition.key
    ] =
      definition;
  }

  const warnings:
    string[] = [];

  for (
    const relationship of
    CAPABILITY_RELATIONSHIP_DEFINITIONS
  ) {
    for (
      const sourceKey of
      relationship
        .sourceCapabilityKeys
    ) {
      if (
        !byKey[
          sourceKey
        ]
      ) {
        warnings.push(
          `Capability ontology relationship ${relationship.key} references missing source capability ${sourceKey}.`
        );
      }
    }

    if (
      !byKey[
        relationship
          .resultCapabilityKey
      ]
    ) {
      warnings.push(
        `Capability ontology relationship ${relationship.key} references missing result capability ${relationship.resultCapabilityKey}.`
      );
    }
  }

  return {
    definitions:
      CAPABILITY_ONTOLOGY_DEFINITIONS,

    relationships:
      CAPABILITY_RELATIONSHIP_DEFINITIONS,

    byKey,

    warnings,
  };
}