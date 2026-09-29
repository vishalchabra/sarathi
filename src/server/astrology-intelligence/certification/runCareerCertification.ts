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

;

;

for (
  const scenario of
  CAREER_CERTIFICATION_SCENARIOS
) {
  ;

  ;

  ;

  ;

  ;

  ;

  ;

  if (
    scenario.expected.shouldMentionAny?.length
  ) {
    ;
  }

  if (
    scenario.expected.shouldNotMention?.length
  ) {
    ;
  }
}

;