import {
  PROFESSION_CERTIFICATION,
} from "./professionCertification";

import {
  TARGET_PROFILES,
} from "../capability-matcher/definitions";

import type {
  TargetProfile,
} from "../capability-matcher/types";

import type {
  CertificationQuestion,
} from "./types";

type CertificationStatus =
  | "pass"
  | "partial"
  | "fail"
  | "missing_profile";

export type ProfessionCertificationResult = {
  id: string;
  question: string;

  targetKey: string;
  targetLabel: string | null;

  status:
    CertificationStatus;

  score: number;

  expectedCapabilities: {
    expected: string[];
    matched: string[];
    missing: string[];
  };

  preferredCapabilities: {
    expected: string[];
    matched: string[];
    missing: string[];
  };

  forbiddenCapabilities: {
    forbidden: string[];
    present: string[];
  };

  actualCapabilities: string[];

  notYetTested: {
    expectedPlanets: string[];
    expectedEvidence: string[];
    expectedThemes: string[];
    minimumConfidence: number;
  };

  warnings: string[];
};

export type ProfessionCertificationSummary = {
  total: number;

  passed: number;
  partial: number;
  failed: number;
  missingProfiles: number;

  averageScore: number;

  profileCoverage: {
    covered: number;
    expected: number;
    percentage: number;
  };

  results:
    ProfessionCertificationResult[];
};

function normalize(
  value: string
): string {
  return String(
    value ?? ""
  )
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

function unique(
  values: string[]
): string[] {
  return Array.from(
    new Set(
      values
        .map(normalize)
        .filter(Boolean)
    )
  );
}

function targetKeyFromQuestion(
  question:
    CertificationQuestion
): string {
  return question.id.replace(
    /^profession_/,
    ""
  );
}

function capabilitiesFromProfile(
  profile: TargetProfile
): string[] {
  return unique([
    ...profile.requirements.map(
      (requirement) =>
        requirement.capabilityKey
    ),

    ...profile.optionalCapabilities.map(
      (requirement) =>
        requirement.capabilityKey
    ),
  ]);
}

function compareExpected(params: {
  expected: string[];
  actual: string[];
}) {
  const expected =
    unique(
      params.expected
    );

  const actual =
    new Set(
      unique(
        params.actual
      )
    );

  const matched =
    expected.filter(
      (value) =>
        actual.has(value)
    );

  const missing =
    expected.filter(
      (value) =>
        !actual.has(value)
    );

  return {
    expected,
    matched,
    missing,
  };
}

function buildResult(
  question:
    CertificationQuestion
): ProfessionCertificationResult {
  const targetKey =
    targetKeyFromQuestion(
      question
    );

  const profile =
    TARGET_PROFILES.find(
      (candidate) =>
        candidate.key ===
        targetKey
    );

  if (!profile) {
    return {
      id:
        question.id,

      question:
        question.question,

      targetKey,

      targetLabel:
        null,

      status:
        "missing_profile",

      score:
        0,

      expectedCapabilities: {
        expected:
          unique(
            question
              .expectedCapabilities
          ),

        matched:
          [],

        missing:
          unique(
            question
              .expectedCapabilities
          ),
      },

      preferredCapabilities: {
        expected:
          unique(
            question
              .preferredCapabilities
          ),

        matched:
          [],

        missing:
          unique(
            question
              .preferredCapabilities
          ),
      },

      forbiddenCapabilities: {
        forbidden:
          unique(
            question
              .forbiddenCapabilities
          ),

        present:
          [],
      },

      actualCapabilities:
        [],

      notYetTested: {
        expectedPlanets:
          question
            .expectedPlanets,

        expectedEvidence:
          question
            .expectedEvidence,

        expectedThemes:
          question
            .expectedThemes,

        minimumConfidence:
          question
            .minimumConfidence,
      },

      warnings: [
        `No target profile exists for "${targetKey}".`,
      ],
    };
  }

  const actualCapabilities =
    capabilitiesFromProfile(
      profile
    );

  const expected =
    compareExpected({
      expected:
        question
          .expectedCapabilities,

      actual:
        actualCapabilities,
    });

  const preferred =
    compareExpected({
      expected:
        question
          .preferredCapabilities,

      actual:
        actualCapabilities,
    });

  const forbidden =
    compareExpected({
      expected:
        question
          .forbiddenCapabilities,

      actual:
        actualCapabilities,
    });

  /*
   * Scoring:
   *
   * Must-have capabilities: 70 points.
   * Preferred capabilities: 20 points.
   * No forbidden capabilities: 10 points.
   *
   * Planets, evidence, themes and confidence are deliberately
   * not scored here because TargetProfile does not contain them.
   * Those belong to chart-based certification later.
   */
  const mustHaveScore =
    expected.expected.length >
    0
      ? (
          expected.matched.length /
          expected.expected.length
        ) *
        70
      : 70;

  const preferredScore =
    preferred.expected.length >
    0
      ? (
          preferred.matched.length /
          preferred.expected.length
        ) *
        20
      : 20;

  const forbiddenPenalty =
    forbidden.matched.length >
    0
      ? 10
      : 0;

  const score =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(
          mustHaveScore +
          preferredScore +
          10 -
          forbiddenPenalty
        )
      )
    );

  const status:
    CertificationStatus =
    expected.missing.length ===
      0 &&
    forbidden.matched.length ===
      0 &&
    score >= 80
      ? "pass"
      : expected.matched.length >
          0 &&
        score >= 50
        ? "partial"
        : "fail";

  const warnings:
    string[] = [];

  if (
    expected.missing.length >
    0
  ) {
    warnings.push(
      `Missing required benchmark capabilities: ${expected.missing.join(
        ", "
      )}.`
    );
  }

  if (
    forbidden.matched.length >
    0
  ) {
    warnings.push(
      `Forbidden benchmark capabilities are present: ${forbidden.matched.join(
        ", "
      )}.`
    );
  }

  return {
    id:
      question.id,

    question:
      question.question,

    targetKey,

    targetLabel:
      profile.label,

    status,

    score,

    expectedCapabilities:
      expected,

    preferredCapabilities:
      preferred,

    forbiddenCapabilities: {
      forbidden:
        forbidden.expected,

      present:
        forbidden.matched,
    },

    actualCapabilities,

    notYetTested: {
      expectedPlanets:
        question
          .expectedPlanets,

      expectedEvidence:
        question
          .expectedEvidence,

      expectedThemes:
        question
          .expectedThemes,

      minimumConfidence:
        question
          .minimumConfidence,
    },

    warnings,
  };
}

export function runProfessionCertification():
  ProfessionCertificationSummary {
  const results =
    PROFESSION_CERTIFICATION.map(
      buildResult
    );

  const passed =
    results.filter(
      (result) =>
        result.status ===
        "pass"
    ).length;

  const partial =
    results.filter(
      (result) =>
        result.status ===
        "partial"
    ).length;

  const failed =
    results.filter(
      (result) =>
        result.status ===
        "fail"
    ).length;

  const missingProfiles =
    results.filter(
      (result) =>
        result.status ===
        "missing_profile"
    ).length;

  const covered =
    results.length -
    missingProfiles;

  const averageScore =
    results.length >
    0
      ? Math.round(
          results.reduce(
            (
              total,
              result
            ) =>
              total +
              result.score,
            0
          ) /
          results.length
        )
      : 0;

  return {
    total:
      results.length,

    passed,
    partial,
    failed,
    missingProfiles,

    averageScore,

    profileCoverage: {
      covered,

      expected:
        results.length,

      percentage:
        results.length >
        0
          ? Math.round(
              (
                covered /
                results.length
              ) *
                100
            )
          : 0,
    },

    results,
  };
}

/*
 * Run directly with:
 *
 * pnpm exec tsx src/server/astrology-intelligence/certification/runProfessionCertification.ts
 */
const certification =
  runProfessionCertification();

console.log(
  "\n=== SĀRATHI PROFESSION CERTIFICATION ===\n"
);

console.log(
  `Total: ${certification.total}`
);

console.log(
  `Pass: ${certification.passed}`
);

console.log(
  `Partial: ${certification.partial}`
);

console.log(
  `Fail: ${certification.failed}`
);

console.log(
  `Missing profiles: ${certification.missingProfiles}`
);

console.log(
  `Profile coverage: ${certification.profileCoverage.covered}/${certification.profileCoverage.expected} (${certification.profileCoverage.percentage}%)`
);

console.log(
  `Average benchmark score: ${certification.averageScore}/100`
);

console.log(
  "\nResults:\n"
);

for (
  const result of
  certification.results
) {
  console.log(
    `${result.status.toUpperCase().padEnd(
      15
    )} ${String(
      result.score
    ).padStart(
      3
    )}/100  ${result.targetKey}`
  );

  if (
    result.expectedCapabilities
      .missing.length >
    0
  ) {
    console.log(
      `  Missing must-have: ${result.expectedCapabilities.missing.join(
        ", "
      )}`
    );
  }

  if (
    result.forbiddenCapabilities
      .present.length >
    0
  ) {
    console.log(
      `  Forbidden present: ${result.forbiddenCapabilities.present.join(
        ", "
      )}`
    );
  }
}