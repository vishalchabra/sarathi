import { strict as assert } from "node:assert";

import {
  resolveHomeEventExpression,
  composeHomePredictionV2,
  type HomeEventExpressionResult,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const cases: Array<{
  manifestation: string;
  expected: HomeEventExpressionResult["expressionId"];
}> = [
  {
    manifestation: "home_change",
    expected: "general_home_change",
  },
  {
    manifestation: "home_attention",
    expected: "general_home_attention",
  },
  {
    manifestation: "home_stability",
    expected: "general_home_stability",
  },
];

const stages: EventStageResult[] = [
  { stage: "clarifying", sourceDirection: "clarify" },
  { stage: "stabilizing", sourceDirection: "stabilize" },
  { stage: "developing", sourceDirection: "develop" },
  { stage: "coordinating", sourceDirection: "coordinate" },
  { stage: "completing", sourceDirection: "complete" },
];

const modes: PadaExpressionModeResult[] = [
  { mode: "analysis", matchedTheme: "Analysis" },
  { mode: "adjustment", matchedTheme: "Adjustment" },
  { mode: "initiative", matchedTheme: "Taking initiative" },
  { mode: "communication", matchedTheme: "Communication" },
];

let tested = 0;

for (const testCase of cases) {
  const expression = resolveHomeEventExpression(
    testCase.manifestation
  );

  assert.ok(expression);
  assert.equal(expression.expressionId, testCase.expected);
  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction = composeHomePredictionV2(
        expression,
        stage,
        mode
      );

      assert.ok(prediction.trim().length > 0);
      assert.ok(!prediction.includes("undefined"));
      assert.ok(!prediction.includes("[object Object]"));

      // Home S2 must not invent concrete outcomes.
      assert.ok(
        !/\b(relocation|moving house|property purchase|property sale|renovation)\b/i.test(
          prediction
        )
      );

      console.log(
        `${testCase.manifestation} | ${stage.stage} | ${mode.mode}`
      );
      console.log(`  ${prediction}`);

      tested++;
    }
  }
}

assert.equal(resolveHomeEventExpression("unknown_manifestation"), null);
assert.equal(tested, 60);

console.log(`All ${tested} Home V2 baseline tests passed.`);