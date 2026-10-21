import { strict as assert } from "node:assert";
import {
  resolveFamilyEventExpression,
  composeFamilyPredictionV2,
  type FamilyEventExpressionResult,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const cases: Array<{
  manifestation: string;
  expected: FamilyEventExpressionResult["expressionId"];
}> = [
  {
    manifestation: "family_responsibility",
    expected: "general_family_responsibility",
  },
  {
    manifestation: "family_support",
    expected: "general_family_support",
  },
  {
    manifestation: "family_discussion",
    expected: "general_family_discussion",
  },
  {
    manifestation: "family_tension",
    expected: "general_family_tension",
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
  const expression = resolveFamilyEventExpression(
    testCase.manifestation
  );

  assert.ok(expression);
  assert.equal(expression.expressionId, testCase.expected);
  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction = composeFamilyPredictionV2(
        expression,
        stage,
        mode
      );

      assert.ok(prediction.trim().length > 0);
      assert.ok(!prediction.includes("undefined"));
      assert.ok(!prediction.includes("[object Object]"));

      // S2 Family must not invent a specific serious event.
      assert.ok(
        !/\b(divorce|separation|estrangement|inheritance|death|illness|hospital|lawsuit|legal dispute|financial support|money from family|family argument|fight)\b/i.test(
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

assert.equal(
  resolveFamilyEventExpression("unknown_manifestation"),
  null
);

assert.equal(tested, 80);

console.log(
  `All ${tested} Family V2 baseline tests passed.`
);