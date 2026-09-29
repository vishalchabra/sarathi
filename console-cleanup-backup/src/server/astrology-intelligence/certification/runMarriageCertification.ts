import {
  MARRIAGE_CERTIFICATION,
} from "./marriageCertification";

console.log(
  "\n=== SĀRATHI MARRIAGE CERTIFICATION SPEC ===\n"
);

console.log(
  `Scenarios loaded: ${MARRIAGE_CERTIFICATION.length}`
);

for (
  const scenario of
  MARRIAGE_CERTIFICATION
) {
  console.log(
    `\n${scenario.id}`
  );

  console.log(
    `Question: ${scenario.question}`
  );

  console.log(
    `Expected capabilities: ${
      scenario.expectedCapabilities.join(", ") || "none"
    }`
  );

  console.log(
    `Preferred capabilities: ${
      scenario.preferredCapabilities.join(", ") || "none"
    }`
  );

  console.log(
    `Expected planets: ${
      scenario.expectedPlanets.join(", ") || "none"
    }`
  );

  console.log(
    `Expected evidence: ${
      scenario.expectedEvidence.join(", ") || "none"
    }`
  );

  console.log(
    `Expected themes: ${
      scenario.expectedThemes.join(", ") || "none"
    }`
  );

  console.log(
    `Minimum confidence: ${scenario.minimumConfidence}`
  );

  if (scenario.notes) {
    console.log(
      `Notes: ${scenario.notes}`
    );
  }
}

console.log(
  "\n=== END MARRIAGE CERTIFICATION SPEC ===\n"
);