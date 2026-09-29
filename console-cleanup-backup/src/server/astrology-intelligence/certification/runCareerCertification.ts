import {
  CAREER_CERTIFICATION_SCENARIOS,
} from "./careerCertificationScenarios";

function includesAny(
  text: string,
  values?: string[]
): boolean {
  if (!values?.length) return true;

  const normalized =
    text.toLowerCase();

  return values.some(
    (value) =>
      normalized.includes(
        value.toLowerCase()
      )
  );
}

function includesForbidden(
  text: string,
  values?: string[]
): string[] {
  if (!values?.length) return [];

  const normalized =
    text.toLowerCase();

  return values.filter(
    (value) =>
      normalized.includes(
        value.toLowerCase()
      )
  );
}

console.log(
  "\n=== SĀRATHI CAREER CERTIFICATION ===\n"
);

console.log(
  `Scenarios loaded: ${CAREER_CERTIFICATION_SCENARIOS.length}`
);

for (
  const scenario of
  CAREER_CERTIFICATION_SCENARIOS
) {
  console.log(
    `\n${scenario.id} — ${scenario.label}`
  );

  console.log(
    `Question: ${scenario.question}`
  );

  console.log(
    `Age group: ${scenario.ageGroup}`
  );

  console.log(
    `Expected event: ${scenario.expected.eventType}`
  );

  console.log(
    `Timing: ${
      scenario.expected.shouldMentionTiming
        ? "allowed"
        : "suppressed"
    }`
  );

  console.log(
    `Dasha: ${
      scenario.expected.shouldMentionDasha
        ? "allowed"
        : "suppressed"
    }`
  );

  console.log(
    `Dates: ${
      scenario.expected.shouldMentionDates
        ? "allowed"
        : "suppressed"
    }`
  );

  if (
    scenario.expected.shouldMentionAny?.length
  ) {
    console.log(
      `Expected themes: ${scenario.expected.shouldMentionAny.join(
        ", "
      )}`
    );
  }

  if (
    scenario.expected.shouldNotMention?.length
  ) {
    console.log(
      `Forbidden themes: ${scenario.expected.shouldNotMention.join(
        ", "
      )}`
    );
  }
}

console.log(
  "\n=== END CAREER CERTIFICATION SPEC ===\n"
);