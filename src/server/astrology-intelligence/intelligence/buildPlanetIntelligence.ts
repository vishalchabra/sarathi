import type {
  AstrologyEvidence,
} from "../contracts/evidence";

import type {
  PlanetFact,
} from "../contracts/facts";

import type {
  PlanetIntelligence,
} from "../contracts/planetIntelligence";

import type {
  PlanetKnowledge,
} from "../knowledge/types";

import {
  matchRules,
} from "./framework/matchRules";

import {
  scoreRules,
} from "./framework/scoreRules";

import {
  buildThemes,
} from "./framework/buildThemes";

import {
  buildStrength,
} from "./framework/buildStrength";

import {
  buildSharedNakshatraRules,
} from "./framework/buildSharedNakshatraRules";
import {
  buildSharedVargaRules,
} from "./framework/buildSharedVargaRules";
import {
  buildSharedDashaRules,
} from "./framework/buildSharedDashaRules";
import {
  buildSharedTransitRules,
} from "./framework/buildSharedTransitRules";
function flattenKnowledge(
  knowledge: PlanetKnowledge
) {
  return [
    ...knowledge.identity,
    ...knowledge.signRules,
    ...knowledge.houseRules,
    ...knowledge.dignityRules,
    ...knowledge.conjunctionRules,
    ...knowledge.aspectRules,
    ...knowledge.dispositorRules,

    /*
     * Planet-specific nakshatra rules are reserved for genuine
     * planet × nakshatra interaction overrides.
     *
     * Universal nakshatra meaning is supplied separately by
     * buildSharedNakshatraRules().
     */
    ...knowledge.nakshatraRules,

    ...knowledge.avasthaRules,
    ...knowledge.vargaRules,
    ...knowledge.dashaRules,
    ...knowledge.transitRules,
    ...knowledge.careerRules,
    ...knowledge.businessRules,
    ...knowledge.wealthRules,
    ...knowledge.relationshipRules,
    ...knowledge.healthRules,
    ...knowledge.spiritualityRules,
    ...knowledge.shadowRules,
  ];
}

function buildSummary(params: {
  facts: PlanetFact;
  strength:
    ReturnType<
      typeof buildStrength
    >;
  themes:
    ReturnType<
      typeof buildThemes
    >;
}) {
  const topThemes =
    params.themes.allThemes
      .slice(0, 5)
      .map(
        (theme) =>
          theme.label
      );

  const shadowThemes =
    params.themes.shadows
      .slice(0, 3)
      .map(
        (theme) =>
          theme.label
      );

  return {
    headline:
      `${params.facts.planet} is assessed as ${params.strength.assessment.verdict.replace(
        "_",
        " "
      )}.`,

    strongestThemes:
      topThemes,

    shadowThemes,

    narrative:
      params.strength
        .assessment
        .summary,
  };
}

export function buildPlanetIntelligence(params: {
  facts: PlanetFact;
  knowledge: PlanetKnowledge;
  evidence: AstrologyEvidence[];
}): PlanetIntelligence {
  const planetRules =
    flattenKnowledge(
      params.knowledge
    );

  const sharedNakshatraRules =
  buildSharedNakshatraRules(
    params.facts
  );

const sharedVargaRules =
  buildSharedVargaRules(
    params.facts
  );

const sharedDashaRules =
  buildSharedDashaRules(
    params.facts
  );

const sharedTransitRules =
  buildSharedTransitRules(
    params.facts
  );

const rules = [
  ...planetRules,
  ...sharedNakshatraRules,
  ...sharedVargaRules,
  ...sharedDashaRules,
  ...sharedTransitRules,
];

  const matchedRules =
    matchRules(
      params.facts,
      rules
    );

  const scoredRules =
    scoreRules({
      facts:
        params.facts,

      rules:
        matchedRules,

      evidence:
        params.evidence,
    });

  const themes =
    buildThemes(
      scoredRules
    );

  const strength =
    buildStrength({
      facts:
        params.facts,

      scoredRules,

      themes,
    });

  const summary =
    buildSummary({
      facts:
        params.facts,

      strength,

      themes,
    });

  return {
    planet:
      params.facts.planet,

    facts:
      params.facts,

    identity: {
      functionalRole:
        themes.byCategory.identity
          .slice(0, 5)
          .map(
            (theme) =>
              theme.label
          ),

      dominantMotivation:
        themes.byCategory.psychology
          .slice(0, 5)
          .map(
            (theme) =>
              theme.label
          ),

      expressionStyle:
        themes.byCategory.communication
          .slice(0, 5)
          .map(
            (theme) =>
              theme.label
          ),
    },

    strength:
      strength.assessment,

    talents:
      themes.allThemes
        .filter(
          (theme) =>
            theme.score >= 40
        )
        .slice(0, 10),

    limitations:
      themes.shadows
        .slice(0, 10),

    businessThemes:
      themes.byCategory.business,

    careerThemes:
      themes.byCategory.career,

    wealthThemes:
      themes.byCategory.wealth,

    relationshipThemes:
      themes.byCategory.relationships,

    healthThemes:
      themes.byCategory.health,

    spiritualThemes:
      themes.byCategory.spirituality,

    activation: {
      currentlyActive:
        params.facts.currentDashaActive ||
        params.facts.currentTransitActive,

      currentThemes:
        params.facts.currentDashaActive ||
        params.facts.currentTransitActive
          ? themes.allThemes.slice(
              0,
              8
            )
          : [],

      futureThemes:
        params.facts
          .futureActivationWindows
          .length >
        0
          ? themes.allThemes.slice(
              0,
              8
            )
          : [],
    },

    contradictions:
      strength.negativeScore >
      20
        ? [
            "Strong constructive themes are present, but meaningful limiting factors reduce consistency.",
          ]
        : [],

    evidence:
      params.evidence.filter(
        (record) =>
          strength.evidenceIds.includes(
            record.id
          )
      ),

    overallConfidence:
      strength.assessment
        .confidence,

    summary,
  };
}