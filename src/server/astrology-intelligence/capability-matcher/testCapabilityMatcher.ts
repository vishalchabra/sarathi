import type {
  AstrologyIntelligenceEngineResult,
} from "../astrologyIntelligenceTypes";

import {
  matchTargetProfile,
} from "./matchTargetProfile";

export function testCapabilityMatcher(
  intelligence:
    AstrologyIntelligenceEngineResult
) {
  const targetKeys = [
    "software_engineer",
    "consultant",
    "teacher",
    "lawyer",
    "doctor",
    "astrologer",
    "saas_business",
    "consulting_business",
    "premium_consumer_brand",
    "marriage_partnership",
    "meditation_path",
  ];

  return targetKeys
    .map((targetKey) => {
      const target =
        intelligence
          .capabilityMatcher
          .byKey[targetKey];

      if (!target) {
        return {
          targetKey,
          error:
            "Target profile not found.",
        };
      }

      const result =
        matchTargetProfile({
          target,
          capabilities:
            intelligence.capabilities,
          ontology:
            intelligence
              .capabilityOntology,
        });

      return {
        target:
          result.targetLabel,

        kind:
          result.targetKind,

        score:
          result.score,

        confidence:
          result.confidence,

        verdict:
          result.verdict,

        strengths:
          result.strengths,

        gaps:
          result.gaps,

        cautions:
          result.cautions
            .slice(0, 3),
      };
    })
    .sort((first, second) => {
  const firstScore =
    "error" in first
      ? 0
      : first.score;

  const secondScore =
    "error" in second
      ? 0
      : second.score;

  return secondScore - firstScore;
});
}