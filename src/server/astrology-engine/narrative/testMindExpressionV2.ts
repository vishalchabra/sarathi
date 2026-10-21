import { strict as assert } from "node:assert";

import {
  resolveMindEventExpression,
  composeMindPredictionV2,
  type MindEventExpressionResult,
} from "./eventExpressionLibrary";

const cases: Array<{
  manifestation: string;
  expected: MindEventExpressionResult["expressionId"];
}> = [
  {
    manifestation: "mental_pressure",
    expected: "general_mental_pressure",
  },
  {
    manifestation: "emotional_stability",
    expected: "general_emotional_grounding",
  },
];

const stages = [
  {
    stage: "clarifying",
    sourceDirection: "clarify",
  },
  {
    stage: "stabilizing",
    sourceDirection: "stabilize",
  },
  {
    stage: "developing",
    sourceDirection: "develop",
  },
] as const;

const modes = [
  {
    mode: "analysis",
    matchedTheme: "Analysis",
  },
  {
    mode: "adjustment",
    matchedTheme: "Adjustment",
  },
  {
    mode: "initiative",
    matchedTheme: "Taking initiative",
  },
] as const;

for (const testCase of cases) {
  const expression = resolveMindEventExpression(
    testCase.manifestation
  );

  assert.ok(expression);
  assert.equal(expression.expressionId, testCase.expected);
  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction = composeMindPredictionV2(
        expression,
        stage,
        mode
      );

      assert.ok(prediction.trim().length > 0);
      assert.ok(!prediction.includes("undefined"));
      assert.ok(!prediction.includes("[object Object]"));

      console.log(
        `${testCase.manifestation} | ${stage.stage} | ${mode.mode}`
      );
      console.log(`  ${prediction}`);
    }
  }
}

assert.equal(
  resolveMindEventExpression("unknown_manifestation"),
  null
);

console.log("All Mind V2 baseline tests passed.");