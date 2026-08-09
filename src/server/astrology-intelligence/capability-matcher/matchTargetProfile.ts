import type {
  Capability,
  CapabilityStore,
} from "../capabilities/types";

import type {
  CapabilityOntologyStore,
} from "../capability-ontology/types";

import type {
  CapabilityMatchContribution,
  CapabilityMatchConstraintResult,
  CapabilityMatchResult,
  CapabilityMatchVerdict,
  TargetCapabilityRequirement,
  TargetProfile,
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
  values: Array<string | null | undefined>
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

function verdictFromScore(
  score: number,
  missingRequired: number,
  confidence: number
): CapabilityMatchVerdict {
  if (
    confidence < 40
  ) {
    return "insufficient_data";
  }

  if (
    missingRequired >= 2
  ) {
    return "weak_fit";
  }

  if (
    missingRequired === 1
  ) {
    return score >= 60
      ? "conditional_fit"
      : "weak_fit";
  }

  if (score >= 82) {
    return "excellent_fit";
  }

  if (score >= 70) {
    return "strong_fit";
  }

  if (score >= 56) {
    return "moderate_fit";
  }

  if (score >= 42) {
    return "conditional_fit";
  }

  return "weak_fit";
}

function getCapability(
  store:
    CapabilityStore,
  key: string
): Capability | undefined {
  return store.byKey[
    key
  ];
}

function stabilityScore(
  capability:
    Capability
): number {
  const limitationPressure =
    capability.limitations.length ===
    0
      ? 0
      : capability.limitations
          .slice(0, 4)
          .reduce(
            (sum, item) =>
              sum +
              item.score,
            0
          ) /
        Math.min(
          4,
          capability.limitations.length
        );

  return clamp(
    capability.score *
      0.65 +
    capability.confidence *
      0.25 +
    (
      capability.activation
        .currentlyActive
        ? capability.activation
            .score
        : capability.score
    ) *
      0.1 -
    limitationPressure *
      0.2
  );
}

function riskScore(
  capability:
    Capability
): number {
  if (
    capability.limitations.length ===
    0
  ) {
    return 0;
  }

  return clamp(
    capability.limitations
      .slice(0, 5)
      .reduce(
        (sum, item) =>
          sum +
          item.score,
        0
      ) /
    Math.min(
      5,
      capability.limitations.length
    )
  );
}

function buildContribution(params: {
  requirement:
    TargetCapabilityRequirement;
  capability:
    Capability | undefined;
  ontology:
    CapabilityOntologyStore;
}): CapabilityMatchContribution {
  const {
    requirement,
    capability,
    ontology,
  } = params;

  const ontologyDefinition =
    ontology.byKey[
      requirement
        .capabilityKey
    ];

  if (!capability) {
    return {
      capabilityKey:
        requirement
          .capabilityKey,

      capabilityLabel:
        ontologyDefinition
          ?.label ??
        requirement
          .capabilityKey,

      required:
        requirement.required,

      weight:
        requirement.weight,

      actualScore:
        0,

      minimumScore:
        requirement
          .minimumScore,

      confidence:
        0,

      fitScore:
        0,

      gap:
        requirement
          .minimumScore,

      reasons: [
        requirement.reason,
        "The capability is not available in the current capability store.",
      ],

      evidenceIds:
        [],
    };
  }

  const actualScore =
    capability.score;

  const minimumScore =
    requirement.minimumScore;

  const ratio =
  actualScore / minimumScore;

let thresholdFit = 0;

if (ratio >= 1.25) {
  thresholdFit = 82;
}
else if (ratio >= 1.10) {
  thresholdFit = 74;
}
else if (ratio >= 1.00) {
  thresholdFit = 66;
}
else if (ratio >= 0.90) {
  thresholdFit = 45;
}
else if (ratio >= 0.80) {
  thresholdFit = 25;
}
else {
  thresholdFit = 10;
}

  const surplus =
    Math.max(
      0,
      actualScore -
      minimumScore
    );

  const fitScore =
    clamp(
      Math.min(
        70,
        thresholdFit
      ) +
      Math.min(
        20,
        surplus *
          0.8
      ) +
      capability.confidence *
        0.1
    );

  return {
    capabilityKey:
      capability.key,

    capabilityLabel:
      capability.label,

    required:
      requirement.required,

    weight:
      requirement.weight,

    actualScore,

    minimumScore,

    confidence:
      capability.confidence,

    fitScore,

    gap:
      Math.max(
        0,
        minimumScore -
        actualScore
      ),

    reasons:
      unique([
        requirement.reason,
        capability.summary,
        ...capability.reasons
          .slice(0, 3),
      ]),

    evidenceIds:
      capability.evidenceIds,
  };
}

function buildConstraintResults(params: {
  target:
    TargetProfile;
  capabilities:
    CapabilityStore;
  ontology:
    CapabilityOntologyStore;
}): CapabilityMatchConstraintResult[] {
  return params.target.constraints
    .map(
      (constraint) => {
        const capability =
          getCapability(
            params.capabilities,
            constraint
              .capabilityKey
          );

        const ontologyDefinition =
          params.ontology.byKey[
            constraint
              .capabilityKey
          ];

        const actualRiskScore =
          capability
            ? riskScore(
                capability
              )
            : 100;

        const actualStabilityScore =
          capability
            ? stabilityScore(
                capability
              )
            : 0;

        const riskPassed =
          constraint
            .maximumRiskScore ===
          undefined
            ? true
            : actualRiskScore <=
              constraint
                .maximumRiskScore;

        const stabilityPassed =
          constraint
            .minimumStabilityScore ===
          undefined
            ? true
            : actualStabilityScore >=
              constraint
                .minimumStabilityScore;

        return {
          capabilityKey:
            constraint
              .capabilityKey,

          capabilityLabel:
            capability
              ?.label ??
            ontologyDefinition
              ?.label ??
            constraint
              .capabilityKey,

          passed:
            riskPassed &&
            stabilityPassed,

          actualRiskScore,

          allowedRiskScore:
            constraint
              .maximumRiskScore ??
            null,

          actualStabilityScore,

          requiredStabilityScore:
            constraint
              .minimumStabilityScore ??
            null,

          reason:
            constraint.reason,
        };
      }
    );
}

function weightedContributionScore(
  contributions:
    CapabilityMatchContribution[]
): number {
  if (
    contributions.length ===
    0
  ) {
    return 0;
  }

  const totalWeight =
    contributions.reduce(
      (sum, item) =>
        sum +
        item.weight,
      0
    );

  if (
    totalWeight <=
    0
  ) {
    return 0;
  }

  return (
    contributions.reduce(
      (sum, item) =>
        sum +
        item.fitScore *
          item.weight,
      0
    ) /
    totalWeight
  );
}

function weightedConfidence(
  contributions:
    CapabilityMatchContribution[]
): number {
  if (
    contributions.length ===
    0
  ) {
    return 0;
  }

  const totalWeight =
    contributions.reduce(
      (sum, item) =>
        sum +
        item.weight,
      0
    );

  if (
    totalWeight <=
    0
  ) {
    return 0;
  }

  return (
    contributions.reduce(
      (sum, item) =>
        sum +
        item.confidence *
          item.weight,
      0
    ) /
    totalWeight
  );
}

function buildSummary(params: {
  target:
    TargetProfile;
  score: number;
  verdict:
    CapabilityMatchVerdict;
  strengths: string[];
  gaps: string[];
  cautions: string[];
}): string {
  const strengthText =
    params.strengths
      .slice(0, 3)
      .join(", ");

  const gapText =
    params.gaps
      .slice(0, 2)
      .join(" and ");

  const cautionText =
    params.cautions
      .slice(0, 2)
      .join(" and ");

  return `${params.target.label} is assessed as ${params.verdict.replace(
    /_/g,
    " "
  )} at ${params.score}/100. ${
    strengthText
      ? `The strongest supporting capabilities are ${strengthText}.`
      : "No strong supporting capability is currently clear."
  } ${
    gapText
      ? `The main capability gaps are ${gapText}.`
      : "No major required capability gap is currently dominant."
  } ${
    cautionText
      ? `Key cautions are ${cautionText}.`
      : ""
  }`.trim();
}

export function matchTargetProfile(params: {
  target:
    TargetProfile;

  capabilities:
    CapabilityStore;

  ontology:
    CapabilityOntologyStore;
}): CapabilityMatchResult {
  const requiredContributions =
    params.target.requirements
      .map(
        (requirement) =>
          buildContribution({
            requirement,
            capability:
              getCapability(
                params.capabilities,
                requirement
                  .capabilityKey
              ),
            ontology:
              params.ontology,
          })
      );

  const optionalContributions =
    params.target
      .optionalCapabilities
      .map(
        (requirement) =>
          buildContribution({
            requirement,
            capability:
              getCapability(
                params.capabilities,
                requirement
                  .capabilityKey
              ),
            ontology:
              params.ontology,
          })
      );

  const requiredScore =
    weightedContributionScore(
      requiredContributions
    );

  const optionalScore =
    weightedContributionScore(
      optionalContributions
    );

  const constraintResults =
    buildConstraintResults({
      target:
        params.target,
      capabilities:
        params.capabilities,
      ontology:
        params.ontology,
    });

  const failedConstraints =
    constraintResults.filter(
      (item) =>
        !item.passed
    );

  const missingRequired =
    requiredContributions.filter(
      (item) =>
        item.required &&
        item.actualScore <
          item.minimumScore
    );

 const missingRequiredPenalty =
  missingRequired.reduce(
    (
      total,
      item
    ) =>
      total +
      Math.max(
        8,
        item.gap * 0.9
      ),
    0
  );

const score =
  clamp(
    requiredScore *
      0.9 +
    optionalScore *
      0.1 -
    failedConstraints.length *
      7 -
    missingRequiredPenalty
  );

  const confidence =
    clamp(
      weightedConfidence([
        ...requiredContributions,
        ...optionalContributions,
      ])
    );

  const verdict =
    verdictFromScore(
      score,
      missingRequired.length,
      confidence
    );

  const strengths =
    requiredContributions
      .filter(
        (item) =>
          item.actualScore >=
          item.minimumScore
      )
      .sort(
        (first, second) =>
          second.fitScore -
          first.fitScore
      )
      .slice(0, 6)
      .map(
        (item) =>
          item.capabilityLabel
      );

  const gaps =
    requiredContributions
      .filter(
        (item) =>
          item.actualScore <
          item.minimumScore
      )
      .sort(
        (first, second) =>
          second.gap -
          first.gap
      )
      .slice(0, 6)
      .map(
        (item) =>
          `${item.capabilityLabel} (${item.actualScore}/${item.minimumScore})`
      );

  const cautions =
    unique([
      ...params.target.cautions,
      ...failedConstraints.map(
        (item) =>
          `${item.capabilityLabel}: ${item.reason}`
      ),
    ]);

  const evidenceIds =
    unique([
      ...requiredContributions.flatMap(
        (item) =>
          item.evidenceIds
      ),
      ...optionalContributions.flatMap(
        (item) =>
          item.evidenceIds
      ),
    ]);

  return {
    targetKey:
      params.target.key,

    targetLabel:
      params.target.label,

    targetKind:
      params.target.kind,

    score,
    confidence,
    verdict,

    requiredContributions,

    optionalContributions,

    constraintResults,

    strengths,
    gaps,
    cautions,

    practicalExpressions:
      params.target
        .practicalExpressions,

    evidenceIds,

    summary:
      buildSummary({
        target:
          params.target,
        score,
        verdict,
        strengths,
        gaps,
        cautions,
      }),

    warnings: [],
  };
}