import type { AstrologyEvidence } from "../contracts/evidence";
import type {
  AspectFact,
  ChartFacts,
  Dignity,
  PlanetFact,
  SambandhaFact,
} from "../contracts/facts";
import type {
  ReasoningFact,
  ReasoningFactSource,
  ReasoningFactStore,
} from "./types";

import {
  NAKSHATRA_PROFILE_BY_LABEL,
} from "../knowledge/nakshatras";

import {
  DIVISIONAL_CHART_PROFILE_BY_KEY,
} from "../knowledge/divisionalCharts";

import {
  getDashaActivationProfile,
} from "../knowledge/dashas";

import {
  getTransitActivationProfile,
} from "../knowledge/transits";

function clamp(value: number): number {
  return Number.isFinite(value)
    ? Math.max(0, Math.min(100, Math.round(value)))
    : 0;
}

function dignityPolarity(
  dignity: Dignity
): ReasoningFact["polarity"] {
  switch (dignity) {
    case "exalted":
    case "moolatrikona":
    case "own":
    case "friend":
      return "supportive";
    case "enemy":
    case "debilitated":
      return "challenging";
    default:
      return "neutral";
  }
}

function evidenceSource(
  evidence: AstrologyEvidence | undefined,
  fallback: ReasoningFactSource
): ReasoningFactSource {
  const source = String(evidence?.source ?? "").toLowerCase();
  if (source.includes("dasha")) return "dasha";
  if (source.includes("transit")) return "transit";
  if (source.includes("yoga")) return "yoga";
  if (source.includes("aspect")) return "aspect";
  if (source.includes("sambandha")) return "sambandha";
  if (source.includes("lordship")) return "lordship";
  if (source.includes("d1") || source.includes("natal")) return "natal";
  return fallback;
}

function buildPlacementFact(planet: PlanetFact): ReasoningFact {
  return {
    id: `fact_placement_${planet.planet.toLowerCase()}`,
    kind: "placement",
    source: "natal",
    label: `${planet.planet} in ${planet.sign}, house ${planet.house}`,
    detail: `${planet.planet} is placed in ${planet.sign} in house ${planet.house}, in ${planet.nakshatra || "an unresolved nakshatra"}, with ${planet.dignity} dignity.`,
    planets: [planet.planet],
    houses: [planet.house],
    signs: [planet.sign],
    charts: ["D1"],
    weight: clamp(planet.strengthScore),
    confidence: 90,
    polarity: dignityPolarity(planet.dignity),
    evidenceIds: planet.evidenceIds,
    metadata: {
      degree: planet.degree,
      nakshatra: planet.nakshatra,
      pada: planet.pada,
      dignity: planet.dignity,
      retrograde: planet.retrograde,
      combust: planet.combust,
      vargottama: planet.vargottama,
    },
  };
}

function buildNakshatraFact(
  planet: PlanetFact
): ReasoningFact | null {
  const profile =
    NAKSHATRA_PROFILE_BY_LABEL[
      planet.nakshatra
    ];

  if (!profile) {
    return null;
  }

  const capabilityThemes =
    profile.capabilityThemes ?? [];

  return {
    id:
      `fact_nakshatra_${planet.planet.toLowerCase()}_${profile.key}`,

    kind:
      "placement",

    source:
      "natal",

    label:
      `${planet.planet} in ${profile.label} nakshatra`,

    detail:
      `${planet.planet} expresses through ${profile.label}, highlighting ${profile.themes
        .slice(0, 4)
        .join(", ")}. This supports ${capabilityThemes
        .slice(0, 6)
        .join(", ")}.`,

    planets: [
      planet.planet,
    ],

    houses: [
      planet.house,
    ],

    signs: [
      planet.sign,
    ],

    charts: [
      "D1",
    ],

    weight:
      clamp(
        Math.max(
          55,
          planet.strengthScore * 0.75 +
            profile.score * 2
        )
      ),

    confidence:
      88,

    polarity:
      "supportive",

    evidenceIds:
      planet.evidenceIds,

    metadata: {
      nakshatra:
        profile.label,

      nakshatraKey:
        profile.key,

      nakshatraRuler:
        profile.ruler,

      deity:
        profile.deity,

      motivation:
        profile.motivation,

      themes:
        profile.themes,

      capabilityThemes,

      strengthens:
        profile.strengthens,

      shadows:
        profile.shadows,

      pada:
        planet.pada,
    },
  };
}

function buildVargaFacts(
  planet: PlanetFact
): ReasoningFact[] {
  const facts:
    ReasoningFact[] = [];

  for (
    const placement of
    planet.vargas
  ) {
    const profile =
      DIVISIONAL_CHART_PROFILE_BY_KEY[
        placement.chart
      ];

    if (!profile) {
      continue;
    }

    const strong =
      placement.dignity ===
        "exalted" ||
      placement.dignity ===
        "moolatrikona" ||
      placement.dignity ===
        "own" ||
      placement.dignity ===
        "friend";

    const weak =
      placement.dignity ===
        "enemy" ||
      placement.dignity ===
        "debilitated";

    facts.push({
      id:
        `fact_varga_${planet.planet.toLowerCase()}_${placement.chart.toLowerCase()}`,

      kind:
        "placement",

      source:
        "varga",

      label:
        `${planet.planet} in ${placement.chart} (${profile.name})`,

      detail:
        `${planet.planet} is placed in ${placement.chart} (${profile.name}) in ${placement.sign ?? "an unresolved sign"}${
          placement.house !== null
            ? `, house ${placement.house}`
            : ""
        }, with ${placement.dignity} dignity. ${profile.purpose}`,

      planets: [
        planet.planet,
      ],

      houses:
        placement.house !== null
          ? [placement.house]
          : [],

      signs:
        placement.sign
          ? [placement.sign]
          : [],

      charts: [
        placement.chart,
      ],

      weight:
        clamp(
          55 +
          profile.confidenceWeight *
            3 +
          (strong
            ? 8
            : weak
              ? -4
              : 0)
        ),

      confidence:
        placement.chart ===
        "D60"
          ? 72
          : 86,

      polarity:
        strong
          ? "supportive"
          : weak
            ? "challenging"
            : "neutral",

      evidenceIds:
        planet.evidenceIds,

      metadata: {
        chart:
          placement.chart,

        chartName:
          profile.name,

        purpose:
          profile.purpose,

        capabilityThemes:
          profile.capabilityThemes,

        themes:
          profile.represents,

        strengthens:
          strong
            ? profile.strongExpression
            : [],

        weakens:
          weak
            ? profile.weakExpression
            : [],

        dignity:
          placement.dignity,

        sign:
          placement.sign,

        house:
          placement.house,
      },
    });
  }

  return facts;
}

function buildLordshipFacts(planet: PlanetFact): ReasoningFact[] {
  return planet.ownsHouses.map((house) => ({
    id: `fact_lordship_${planet.planet.toLowerCase()}_${house}`,
    kind: "ownership",
    source: "lordship",
    label: `${planet.planet} rules house ${house}`,
    detail: `${planet.planet} carries the affairs of house ${house} through its natal condition and relationships.`,
    planets: [planet.planet],
    houses: [house],
    signs: [],
    charts: ["D1"],
    weight: clamp(planet.strengthScore),
    confidence: 95,
    polarity: "neutral",
    evidenceIds: planet.evidenceIds.filter((id) => id.includes(`house_${house}`)),
    metadata: { ownedHouse: house },
  }));
}

function buildConditionFacts(planet: PlanetFact): ReasoningFact[] {
  const facts: ReasoningFact[] = [];
  if (planet.retrograde) {
    facts.push({
      id: `fact_condition_${planet.planet.toLowerCase()}_retrograde`,
      kind: "condition",
      source: "natal",
      label: `${planet.planet} is retrograde`,
      detail: `${planet.planet} is retrograde, modifying how its significations are processed and expressed.`,
      planets: [planet.planet],
      houses: [planet.house],
      signs: [planet.sign],
      charts: ["D1"],
      weight: 55,
      confidence: 95,
      polarity: "mixed",
      evidenceIds: planet.evidenceIds,
      metadata: {},
    });
  }
  if (planet.combust) {
    facts.push({
      id: `fact_condition_${planet.planet.toLowerCase()}_combust`,
      kind: "condition",
      source: "natal",
      label: `${planet.planet} is combust`,
      detail: `${planet.planet} is combust, which can reduce independent expression of its significations.`,
      planets: [planet.planet],
      houses: [planet.house],
      signs: [planet.sign],
      charts: ["D1"],
      weight: 65,
      confidence: 95,
      polarity: "challenging",
      evidenceIds: planet.evidenceIds,
      metadata: {},
    });
  }
  if (planet.vargottama) {
    facts.push({
      id: `fact_condition_${planet.planet.toLowerCase()}_vargottama`,
      kind: "condition",
      source: "varga",
      label: `${planet.planet} is vargottama`,
      detail: `${planet.planet} repeats its sign across D1 and D9, reinforcing continuity of expression.`,
      planets: [planet.planet],
      houses: [planet.house],
      signs: [planet.sign],
      charts: ["D1", "D9"],
      weight: 75,
      confidence: 90,
      polarity: "supportive",
      evidenceIds: planet.evidenceIds,
      metadata: {},
    });
  }
  return facts;
}

function buildActivationFacts(planet: PlanetFact): ReasoningFact[] {
  const facts: ReasoningFact[] = [];
  if (planet.currentDashaActive) {
    const dashaProfile =
      getDashaActivationProfile(
        planet.planet
      );

    facts.push({
      id:
        `fact_activation_${planet.planet.toLowerCase()}_dasha`,

      kind:
        "activation",

      source:
        "dasha",

      label:
        `${planet.planet} is active by dasha`,

      detail:
        `${planet.planet} is part of the current dasha chain and is therefore actively expressing its natal promise. The activation emphasizes ${dashaProfile.themes
          .slice(0, 5)
          .join(", ")}.`,

      planets: [
        planet.planet,
      ],

      houses: [
        planet.house,
      ],

      signs: [
        planet.sign,
      ],

      charts: [
        "D1",
      ],

      weight:
        clamp(
          Math.max(
            planet.strengthScore,
            55 +
              dashaProfile.score *
                3
          )
        ),

      confidence:
        95,

      polarity:
        "mixed",

      evidenceIds:
        planet.evidenceIds,

      metadata: {
        activationType:
          "dasha",

        themes:
          dashaProfile.themes,

        capabilityThemes:
          dashaProfile.capabilityThemes,

        strengthens:
          dashaProfile.constructiveExpression,

        shadows:
          dashaProfile.shadowExpression,

        profileScore:
          dashaProfile.score,
      },
    });
  }
  if (planet.currentTransitActive) {
    const transitProfile =
      getTransitActivationProfile(
        planet.planet
      );

    facts.push({
      id:
        `fact_activation_${planet.planet.toLowerCase()}_transit`,

      kind:
        "activation",

      source:
        "transit",

      label:
        `${planet.planet} is active by transit`,

      detail:
        `${planet.planet} is currently activated through the supplied transit layer, temporarily emphasizing ${transitProfile.themes
          .slice(0, 5)
          .join(", ")}.`,

      planets: [
        planet.planet,
      ],

      houses: [
        planet.house,
      ],

      signs: [
        planet.sign,
      ],

      charts: [
        "D1",
      ],

      weight:
        clamp(
          Math.max(
            60,
            50 +
              transitProfile.score *
                4
          )
        ),

      confidence:
        80,

      polarity:
        "mixed",

      evidenceIds:
        planet.evidenceIds,

      metadata: {
        activationType:
          "transit",

        themes:
          transitProfile.themes,

        capabilityThemes:
          transitProfile.capabilityThemes,

        strengthens:
          transitProfile.constructiveExpression,

        shadows:
          transitProfile.shadowExpression,

        profileScore:
          transitProfile.score,
      },
    });
  }
  return facts;
}

function buildAspectFact(aspect: AspectFact, index: number): ReasoningFact {
  return {
    id: `fact_aspect_${aspect.from.toLowerCase()}_${aspect.to.toLowerCase()}_${index}`,
    kind: "relationship",
    source: "aspect",
    label: `${aspect.from} aspects ${aspect.to}`,
    detail: `${aspect.from} gives a ${aspect.type.replace(/_/g, " ")} aspect to ${aspect.to}.`,
    planets: [aspect.from, aspect.to],
    houses: [],
    signs: [],
    charts: ["D1"],
    weight: clamp(aspect.strength),
    confidence: 90,
    polarity: "mixed",
    evidenceIds: aspect.evidenceIds,
    metadata: { aspectType: aspect.type },
  };
}

function buildSambandhaFact(sambandha: SambandhaFact, index: number): ReasoningFact {
  return {
    id: `fact_sambandha_${sambandha.planets.map((planet) => planet.toLowerCase()).join("_")}_${index}`,
    kind: "relationship",
    source: "sambandha",
    label: `${sambandha.planets.join(" and ")} form ${sambandha.relationship.replace(/_/g, " ")}`,
    detail: `${sambandha.planets.join(", ")} are connected through ${sambandha.relationship.replace(/_/g, " ")}.`,
    planets: sambandha.planets,
    houses: [],
    signs: [],
    charts: ["D1"],
    weight: clamp(sambandha.strength),
    confidence: 90,
    polarity: "mixed",
    evidenceIds: sambandha.evidenceIds,
    metadata: { relationship: sambandha.relationship },
  };
}

export function buildReasoningFactStore(chartFacts: ChartFacts): ReasoningFactStore {
  const facts: ReasoningFact[] = [];

  for (const planet of chartFacts.planets) {
    const nakshatraFact =
      buildNakshatraFact(
        planet
      );

    facts.push(
      buildPlacementFact(
        planet
      )
    );

    if (nakshatraFact) {
      facts.push(
        nakshatraFact
      );
    }

    facts.push(
      ...buildVargaFacts(
        planet
      ),

      ...buildLordshipFacts(
        planet
      ),
      ...buildConditionFacts(
        planet
      ),
      ...buildActivationFacts(
        planet
      )
    );
  }

  const seenAspects = new Set<string>();
  for (const planet of chartFacts.planets) {
    for (const aspect of planet.aspectsGiven) {
      const key = `${aspect.from}_${aspect.to}_${aspect.type}`;
      if (seenAspects.has(key)) continue;
      seenAspects.add(key);
      facts.push(buildAspectFact(aspect, seenAspects.size - 1));
    }
  }

  chartFacts.sambandhas.forEach((sambandha, index) => {
    facts.push(buildSambandhaFact(sambandha, index));
  });

  chartFacts.yogas
    .filter((yoga) => yoga.active)
    .forEach((yoga, index) => {
      facts.push({
        id: `fact_yoga_${index}`,
        kind: "pattern",
        source: "yoga",
        label: yoga.name,
        detail: `${yoga.name} is active in the supplied chart facts.`,
        planets: [],
        houses: [],
        signs: [],
        charts: ["D1"],
        weight: clamp(yoga.strength),
        confidence: 85,
        polarity: "supportive",
        evidenceIds: yoga.evidenceIds,
        metadata: {},
      });
    });

  chartFacts.transits.forEach((transit, index) => {
    const transitProfile =
      getTransitActivationProfile(
        transit.planet
      );

    facts.push({
      id:
        `fact_transit_${transit.planet.toLowerCase()}_${index}`,

      kind:
        "timing",

      source:
        "transit",

      label:
        `${transit.planet} transits ${transit.sign}, house ${transit.house}`,

      detail:
        `${transit.planet} is transiting ${transit.sign} in house ${transit.house}, temporarily emphasizing ${transitProfile.themes
          .slice(0, 5)
          .join(", ")}.`,

      planets: [
        transit.planet,
      ],

      houses: [
        transit.house,
      ],

      signs: [
        transit.sign,
      ],

      charts: [],

      weight:
        clamp(
          52 +
            transitProfile.score *
              4
        ),

      confidence:
        85,

      polarity:
        "mixed",

      evidenceIds:
        transit.evidenceIds,

      metadata: {
        degree:
          transit.degree,

        themes:
          transitProfile.themes,

        capabilityThemes:
          transitProfile.capabilityThemes,

        strengthens:
          transitProfile.constructiveExpression,

        shadows:
          transitProfile.shadowExpression,

        profileScore:
          transitProfile.score,
      },
    });
  });

  const evidenceById = new Map(
    chartFacts.evidence.map((record) => [record.id, record])
  );

  const normalizedFacts = facts.map((fact) => {
    const linkedEvidence = fact.evidenceIds
      .map((id) => evidenceById.get(id))
      .filter((record): record is AstrologyEvidence => Boolean(record));

    if (linkedEvidence.length === 0) return fact;

    return {
      ...fact,
      source: evidenceSource(linkedEvidence[0], fact.source),
      weight: clamp(
        Math.max(fact.weight, ...linkedEvidence.map((record) => record.weight))
      ),
      confidence: clamp(
        Math.max(
          fact.confidence,
          ...linkedEvidence.map((record) => record.confidence)
        )
      ),
    };
  });

  const byId: ReasoningFactStore["byId"] = {};
  const byPlanet: ReasoningFactStore["byPlanet"] = {};
  const byKind: ReasoningFactStore["byKind"] = {};

  for (const fact of normalizedFacts) {
    byId[fact.id] = fact;
    for (const planet of fact.planets) {
      byPlanet[planet] ??= [];
      byPlanet[planet]?.push(fact);
    }
    byKind[fact.kind] ??= [];
    byKind[fact.kind]?.push(fact);
  }

  const warnings: string[] = [];
  if (normalizedFacts.length === 0) {
    warnings.push("No reasoning facts could be generated from the supplied chart facts.");
  }

  const factsWithoutEvidence = normalizedFacts.filter(
    (fact) => fact.evidenceIds.length === 0
  ).length;

  if (factsWithoutEvidence > 0) {
    warnings.push(
      `${factsWithoutEvidence} reasoning facts do not yet have linked evidence records.`
    );
  }

  return {
    facts: normalizedFacts,
    byId,
    byPlanet,
    byKind,
    evidence: chartFacts.evidence,
    warnings,
  };
}