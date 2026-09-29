import {
  buildAstrologyIntelligenceEngine,
} from "../buildAstrologyIntelligenceEngine";

import {
  chartFactsFixture,
} from "../fixtures/chartFactsFixture";

import {
  resolveReasoningRequest,
} from "../reasoning/resolveReasoningRequest";

import {
  matchTargetProfile,
} from "../capability-matcher/matchTargetProfile";

import {
  PROFESSION_CERTIFICATION,
} from "./professionCertification";

type LiveProfessionResult = {
  question: string;
  resolvedTarget: string | null;
  expectedTarget: string;
  targetMatched: boolean;

  score: number | null;
  confidence: number | null;
  verdict: string | null;

  strongestRequired: {
    capability: string;
    score: number;
    minimum: number;
    gap: number;
  }[];

  strengths: string[];
  gaps: string[];

  warnings: string[];
};

function expectedTargetFromId(
  id: string
): string {
  return id.replace(
    /^profession_/,
    ""
  );
}

export function runLiveProfessionCertification() {
  const intelligence =
    buildAstrologyIntelligenceEngine(
      chartFactsFixture
    );

  const results:
    LiveProfessionResult[] = [];

  for (
    const certification of
    PROFESSION_CERTIFICATION
  ) {
    const expectedTarget =
      expectedTargetFromId(
        certification.id
      );

    const reasoning =
      resolveReasoningRequest({
        question:
          certification.question,

        matcherStore:
          intelligence
            .capabilityMatcher,
      });

    const resolved =
      reasoning.targets[0] ??
      null;

    if (!resolved) {
      results.push({
        question:
          certification.question,

        resolvedTarget:
          null,

        expectedTarget,

        targetMatched:
          false,

        score:
          null,

        confidence:
          null,

        verdict:
          null,

        strongestRequired:
          [],

        strengths:
          [],

        gaps:
          [],

        warnings: [
          "No target profile was resolved.",
        ],
      });

      continue;
    }

    const profile =
      intelligence
        .capabilityMatcher
        .byKey[
          resolved.profileKey
        ];

    if (!profile) {
      results.push({
        question:
          certification.question,

        resolvedTarget:
          resolved.profileKey,

        expectedTarget,

        targetMatched:
          resolved.profileKey ===
          expectedTarget,

        score:
          null,

        confidence:
          null,

        verdict:
          null,

        strongestRequired:
          [],

        strengths:
          [],

        gaps:
          [],

        warnings: [
          `Resolved profile "${resolved.profileKey}" was not found.`,
        ],
      });

      continue;
    }

    const match =
      matchTargetProfile({
        target:
          profile,

        capabilities:
          intelligence
            .capabilities,

        ontology:
          intelligence
            .capabilityOntology,
      });

    const strongestRequired =
      [...match.requiredContributions]
        .sort(
          (
            first,
            second
          ) =>
            second.fitScore -
            first.fitScore
        )
        .slice(
          0,
          5
        )
        .map(
          (item) => ({
            capability:
              item.capabilityLabel,

            score:
              item.actualScore,

            minimum:
              item.minimumScore,

            gap:
              item.gap,
          })
        );

    results.push({
      question:
        certification.question,

      resolvedTarget:
        resolved.profileKey,

      expectedTarget,

      targetMatched:
        resolved.profileKey ===
        expectedTarget,

      score:
        match.score,

      confidence:
        match.confidence,

      verdict:
        match.verdict,

      strongestRequired,

      strengths:
        match.strengths.slice(
          0,
          5
        ),

      gaps:
        match.gaps.slice(
          0,
          5
        ),

      warnings:
        match.warnings,
    });
  }

  const resolutionPasses =
    results.filter(
      (result) =>
        result.targetMatched
    ).length;

  const ranked =
    results
      .filter(
        (
          result
        ): result is LiveProfessionResult & {
          score: number;
        } =>
          typeof result.score ===
          "number"
      )
      .sort(
        (
          first,
          second
        ) =>
          second.score -
          first.score
      );

  ;

  ;

  ;

  ranked.forEach(
    (
      result,
      index
    ) => {
      ;

      if (
        !result.targetMatched
      ) {
        ;
      }

      if (
        result.strongestRequired
          .length >
        0
      ) {
        ;
      }

      if (
        result.gaps.length >
        0
      ) {
        ;
      }
    }
  );

  ;

  ;

  ;

  ;

  ;

  return {
    resolutionPasses,
    total:
      results.length,
    ranked,
    results,
  };
}

runLiveProfessionCertification();