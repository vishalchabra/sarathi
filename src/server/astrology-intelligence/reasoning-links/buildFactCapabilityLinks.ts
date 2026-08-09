import type {
  Capability,
  CapabilityStore,
} from "../capabilities/types";

import type {
  ReasoningFact,
  ReasoningFactStore,
} from "../reasoning-facts/types";

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

function metadataStringArray(
  fact: ReasoningFact,
  key: string
): string[] {
  const value =
    fact.metadata?.[
      key
    ];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (
      item
    ): item is string =>
      typeof item ===
      "string"
  );
}

function getSemanticOverlap(params: {
  fact: ReasoningFact;
  capability: Capability;
}): string[] {
  const factThemes =
    unique([
      ...metadataStringArray(
        params.fact,
        "capabilityThemes"
      ),

      ...metadataStringArray(
        params.fact,
        "themes"
      ),

      ...metadataStringArray(
        params.fact,
        "strengthens"
      ),
    ]);

  if (
    factThemes.length ===
    0
  ) {
    return [];
  }

  const accepted =
    new Set(
      [
        params.capability.key,
        params.capability.label,

        ...params.capability
          .supportingThemes,
      ].map(
        normalize
      )
    );

  return factThemes.filter(
    (theme) =>
      accepted.has(
        normalize(theme)
      )
  );
}

function factSupportsCapability(params: {
  fact: ReasoningFact;
  capability: Capability;
}): boolean {
  const contributorMatch =
    params.fact.planets.some(
      (planet) =>
        params.capability
          .contributors
          .includes(
            planet
          )
    );

  if (!contributorMatch) {
    return false;
  }

  /*
   * First-class semantic bridge:
   *
   * Knowledge-derived reasoning facts can publish
   * capabilityThemes/themes/strengthens in metadata.
   * If those overlap with the capability itself or with
   * the capability's supporting themes, the fact directly
   * supports that capability.
   */
  const semanticOverlap =
    getSemanticOverlap(
      params
    );

  if (
    semanticOverlap.length >
    0
  ) {
    return true;
  }

  const searchable =
    normalize(
      [
        params.fact.label,
        params.fact.detail,
        ...params.fact.signs,
        ...params.fact.charts,
      ].join(" ")
    );

  const themeMatch =
    params.capability
      .supportingThemes
      .some(
        (theme) =>
          searchable.includes(
            normalize(theme)
          )
      );

  const evidenceOverlap =
    params.fact.evidenceIds
      .some(
        (id) =>
          params.capability
            .evidenceIds
            .includes(id)
      );

  const relationshipFact =
    params.fact.kind ===
      "relationship" &&
    params.fact.planets.some(
      (planet) =>
        params.capability
          .contributors
          .includes(
            planet
          )
    );

  const activationFact =
    params.fact.kind ===
      "activation" &&
    params.capability
      .activation
      .currentlyActive;

  return (
    themeMatch ||
    evidenceOverlap ||
    relationshipFact ||
    activationFact ||
    params.fact.kind ===
      "placement" ||
    params.fact.kind ===
      "ownership" ||
    params.fact.kind ===
      "condition"
  );
}

function buildLink(params: {
  fact: ReasoningFact;
  capability: Capability;
}): ReasoningLink {
  const sharedEvidence =
    params.fact.evidenceIds
      .filter(
        (id) =>
          params.capability
            .evidenceIds
            .includes(id)
      );

  const sharedPlanets =
    params.fact.planets
      .filter(
        (planet) =>
          params.capability
            .contributors
            .includes(
              planet
            )
      );

  const semanticOverlap =
    getSemanticOverlap(
      params
    );

  const factWeight =
    params.fact.weight;

  const capabilityWeight =
    params.capability.score;

  const activationBoost =
    params.fact.kind ===
      "activation" &&
    params.capability
      .activation
      .currentlyActive
      ? 8
      : 0;

  const evidenceBoost =
    sharedEvidence.length >
      0
      ? 8
      : 0;

  /*
   * Semantic matches deserve an explanation-ranking boost,
   * because they represent an explicit knowledge → capability
   * relationship rather than only a shared planet.
   *
   * This changes reasoning-link ranking only. It does NOT
   * directly change the underlying capability score.
   */
  const semanticBoost =
    semanticOverlap.length >
      0
      ? Math.min(
          18,
          10 +
            semanticOverlap.length *
              2
        )
      : 0;

  const weight =
    clamp(
      factWeight * 0.48 +
      capabilityWeight * 0.44 +
      activationBoost +
      evidenceBoost +
      semanticBoost
    );

  const confidence =
    clamp(
      params.fact.confidence *
        0.55 +
      params.capability
        .confidence *
        0.45
    );

  return {
    id:
      `link_fact_${normalize(
        params.fact.id
      )}_capability_${normalize(
        params.capability.key
      )}`,

    type:
      "fact_capability",

    from:
      params.fact.id,

    to:
      `capability:${params.capability.key}`,

    weight,
    confidence,

    evidenceIds:
      unique([
        ...params.fact
          .evidenceIds,
        ...sharedEvidence,
      ]),

    reasons:
      unique([
        semanticOverlap.length >
          0
          ? `${params.fact.label} directly supports ${params.capability.label} through ${semanticOverlap.join(
              ", "
            )}.`
          : `${params.fact.label} supports ${params.capability.label}.`,

        sharedPlanets.length >
          0
          ? `${sharedPlanets.join(
              ", "
            )} contribute to ${params.capability.label}.`
          : null,

        params.capability
          .summary,
      ]),

    metadata: {
      factKind:
        params.fact.kind,

      factSource:
        params.fact.source,

      capabilityCategory:
        params.capability
          .category,

      sharedPlanets,

      sharedEvidenceCount:
        sharedEvidence.length,

      semanticOverlap,

      semanticMatch:
        semanticOverlap.length >
        0,
    },
  };
}

export function buildFactCapabilityLinks(params: {
  facts:
    ReasoningFactStore;

  capabilities:
    CapabilityStore;
}): ReasoningLink[] {
  const links:
    ReasoningLink[] = [];

  for (
    const capability of
    params.capabilities
      .capabilities
  ) {
    const candidateFacts =
      unique(
        capability.contributors
          .flatMap(
            (planet) =>
              (
                params.facts
                  .byPlanet[
                    planet
                  ] ??
                []
              ).map(
                (fact) =>
                  fact.id
              )
          )
      )
        .map(
          (id) =>
            params.facts
              .byId[id]
        )
        .filter(
          (
            fact
          ): fact is ReasoningFact =>
            Boolean(fact)
        );

    for (
      const fact of
      candidateFacts
    ) {
      if (
        !factSupportsCapability({
          fact,
          capability,
        })
      ) {
        continue;
      }

      links.push(
        buildLink({
          fact,
          capability,
        })
      );
    }
  }

  /*
   * Do NOT hard-cap this array.
   *
   * The previous `.slice(0, 500)` silently discarded valid
   * fact→capability links after sorting. That prevented newly
   * added knowledge facts (such as nakshatra facts) from
   * entering downstream traversal whenever the legacy links
   * already filled the first 500 positions.
   *
   * Downstream traversal is responsible for selecting the
   * strongest paths for presentation.
   */
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