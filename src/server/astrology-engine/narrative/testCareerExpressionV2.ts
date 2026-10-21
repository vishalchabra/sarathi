import { strict as assert } from "node:assert";

import {
  resolveCareerEventExpression,
  composeCareerPredictionV2,
  type CareerEventExpressionResult,
} from "./eventExpressionLibrary";

const cases: Array<{
  manifestation: string;
  expected: CareerEventExpressionResult["expressionId"];
}> = [
  {
    manifestation: "career_movement",
    expected: "general_career_movement",
  },
  {
    manifestation: "career_responsibility",
    expected: "general_career_responsibility",
  },
  {
    manifestation: "career_recognition",
    expected: "general_career_recognition",
  },
  {
    manifestation: "career_change",
    expected: "general_career_change",
  },
  {
    manifestation: "workload_service",
    expected: "general_workload_demand",
  },
];

for (const testCase of cases) {
  const expression = resolveCareerEventExpression(
    testCase.manifestation
  );

  assert.ok(expression);
  assert.equal(expression.expressionId, testCase.expected);
  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  const prediction = composeCareerPredictionV2(
    expression,
    {
      stage: "developing",
      sourceDirection: "develop",
    },
    {
      mode: "initiative",
      matchedTheme: "Taking initiative",
    }
  );

  assert.ok(prediction.trim().length > 0);
  assert.ok(!prediction.includes("undefined"));
  assert.ok(!prediction.includes("[object Object]"));

  console.log(
    `PASS: ${testCase.manifestation} -> ${expression.expressionId}`
  );
}

assert.equal(
  resolveCareerEventExpression("unknown_manifestation"),
  null
);

console.log("All Career V2 baseline tests passed.");
// Verify the same conditional flow used by the diagnostic generator.
function evaluateCareerV2(
  manifestationId: string | null
) {
  const expression = manifestationId
    ? resolveCareerEventExpression(manifestationId)
    : null;

  const prediction = expression
    ? composeCareerPredictionV2(
        expression,
        {
          stage: "clarifying",
          sourceDirection: "clarify",
        },
        {
          mode: "analysis",
          matchedTheme: "Analysis",
        }
      )
    : null;

  return { expression, prediction };
}

const careerResult = evaluateCareerV2("career_recognition");

assert.equal(
  careerResult.expression?.expressionId,
  "general_career_recognition"
);
assert.ok(careerResult.prediction);
assert.ok(careerResult.prediction.includes("professional"));

const educationResult = evaluateCareerV2("education_challenge");

assert.equal(educationResult.expression, null);
assert.equal(educationResult.prediction, null);

const noSelectionResult = evaluateCareerV2(null);

assert.equal(noSelectionResult.expression, null);
assert.equal(noSelectionResult.prediction, null);

console.log("Career V2 conditional integration tests passed.");