import type {
  AstrologyIntelligenceEngineResult,
} from "../astrologyIntelligenceTypes";

import {
  matchTargetProfile,
} from "../capability-matcher/matchTargetProfile";

export type CareerCapabilitySummary = {
  key: string;
  label: string;
  score: number;
  confidence: number;
  strength: string;

  contributors: string[];
  supportingThemes: string[];

  currentlyActive: boolean;
  activationScore: number;

  limitations: string[];
};

export type CareerFitSummary = {
  key: string;
  label: string;

  score: number;
  confidence: number;
  verdict: string;

  strengths: string[];
  gaps: string[];
  cautions: string[];

  practicalExpressions: string[];
};

export type CareerIntelligenceSummary = {
  overallScore: number;
  confidence: number;
  strength: string;

  strongestCapabilities:
    CareerCapabilitySummary[];

  activeCapabilities:
    CareerCapabilitySummary[];

  careerFits:
    CareerFitSummary[];

  strongestCareerFits:
    CareerFitSummary[];

  cautions: string[];

  evidenceIds: string[];

  summary: string;
  warnings: string[];
};

function clamp(
  value: number
): number {
  if (
    !Number.isFinite(
      value
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        value
      )
    )
  );
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

function mapCapability(
  capability:
    AstrologyIntelligenceEngineResult[
      "capabilities"
    ]["capabilities"][number]
): CareerCapabilitySummary {
  return {
    key:
      capability.key,

    label:
      capability.label,

    score:
      capability.score,

    confidence:
      capability.confidence,

    strength:
      capability.strength,

    contributors:
      capability.contributors,

    supportingThemes:
      capability.supportingThemes
        .slice(
          0,
          8
        ),

    currentlyActive:
      capability.activation
        .currentlyActive,

    activationScore:
      capability.activation
        .score,

    limitations:
      capability.limitations
        .slice(
          0,
          4
        )
        .map(
          (item) =>
            item.label
        ),
  };
}

function strengthFromScore(
  score: number
): string {
  if (
    score >= 82
  ) {
    return "very_strong";
  }

  if (
    score >= 68
  ) {
    return "strong";
  }

  if (
    score >= 48
  ) {
    return "moderate";
  }

  if (
    score >= 28
  ) {
    return "weak";
  }

  return "unclear";
}

export function buildCareerIntelligenceSummary(
  intelligence:
    AstrologyIntelligenceEngineResult
): CareerIntelligenceSummary {
  const capabilities =
    intelligence
      .capabilities
      .capabilities;

  const strongestCapabilities =
    [...capabilities]
      .sort(
        (
          first,
          second
        ) =>
          second.score -
            first.score ||
          second.confidence -
            first.confidence
      )
      .slice(
        0,
        10
      )
      .map(
        mapCapability
      );

  const activeCapabilities =
    capabilities
      .filter(
        (capability) =>
          capability.activation
            .currentlyActive
      )
      .sort(
        (
          first,
          second
        ) =>
          second.activation
            .score -
            first.activation
              .score ||
          second.score -
            first.score
      )
      .slice(
        0,
        8
      )
      .map(
        mapCapability
      );

  const careerProfiles =
    intelligence
      .capabilityMatcher
      .profiles
      .filter(
        (profile) =>
          profile.kind ===
            "career" ||
          profile.kind ===
            "leadership" ||
          profile.kind ===
            "creative"
      );

  const careerFits =
    careerProfiles
      .map(
        (profile) => {
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

          return {
            key:
              match.targetKey,

            label:
              match.targetLabel,

            score:
              match.score,

            confidence:
              match.confidence,

            verdict:
              match.verdict,

            strengths:
              match.strengths,

            gaps:
              match.gaps,

            cautions:
              match.cautions,

            practicalExpressions:
              match
                .practicalExpressions,
          };
        }
      )
      .sort(
        (
          first,
          second
        ) =>
          second.score -
            first.score ||
          second.confidence -
            first.confidence
      );

  const strongestCareerFits =
    careerFits.slice(
      0,
      6
    );

  const overallScore =
    strongestCareerFits.length ===
      0
      ? 0
      : clamp(
          strongestCareerFits
            .slice(
              0,
              3
            )
            .reduce(
              (
                total,
                item
              ) =>
                total +
                item.score,
              0
            ) /
            Math.min(
              3,
              strongestCareerFits.length
            )
        );

  const confidence =
    strongestCareerFits.length ===
      0
      ? 0
      : clamp(
          strongestCareerFits
            .slice(
              0,
              3
            )
            .reduce(
              (
                total,
                item
              ) =>
                total +
                item.confidence,
              0
            ) /
            Math.min(
              3,
              strongestCareerFits.length
            )
        );

  const cautions =
    unique(
      strongestCareerFits
        .slice(
          0,
          5
        )
        .flatMap(
          (fit) =>
            fit.cautions
        )
    ).slice(
      0,
      8
    );

  const evidenceIds =
    unique(
      capabilities
        .filter(
          (capability) =>
            strongestCapabilities
              .some(
                (summary) =>
                  summary.key ===
                  capability.key
              )
        )
        .flatMap(
          (capability) =>
            capability
              .evidenceIds
        )
    ).slice(
      0,
      30
    );

  const topCapabilityText =
    strongestCapabilities
      .slice(
        0,
        4
      )
      .map(
        (item) =>
          item.label
      )
      .join(
        ", "
      );

  const topFitText =
    strongestCareerFits
      .slice(
        0,
        3
      )
      .map(
        (item) =>
          item.label
      )
      .join(
        ", "
      );

  const summary =
    [
      topCapabilityText
        ? `The strongest current career capabilities are ${topCapabilityText}.`
        : "",

      topFitText
        ? `The strongest tested career directions are ${topFitText}.`
        : "",

      activeCapabilities.length >
        0
        ? `Current activation is strongest around ${activeCapabilities
            .slice(
              0,
              3
            )
            .map(
              (item) =>
                item.label
            )
            .join(
              ", "
            )}.`
        : "No major career capability is currently receiving a strong activation signal.",
    ]
      .filter(Boolean)
      .join(
        " "
      );

  return {
    overallScore,

    confidence,

    strength:
      strengthFromScore(
        overallScore
      ),

    strongestCapabilities,

    activeCapabilities,

    careerFits,

    strongestCareerFits,

    cautions,

    evidenceIds,

    summary,

    warnings:
      intelligence.warnings,
  };
}