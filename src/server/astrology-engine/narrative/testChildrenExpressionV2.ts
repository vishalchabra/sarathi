import { strict as assert } from "node:assert";

import {
  resolveChildrenEventExpression,
  composeChildrenPredictionV2,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const manifestations = [
  "children_attention",
  "children_progress",
  "children_responsibility",
  "children_concern",
  "children_milestone",
] as const;

const stages: EventStageResult[] = [
  { stage: "emerging", sourceDirection: "develop" },
  { stage: "developing", sourceDirection: "develop" },
  { stage: "clarifying", sourceDirection: "clarify" },
  { stage: "coordinating", sourceDirection: "coordinate" },
  { stage: "stabilizing", sourceDirection: "stabilize" },
  { stage: "confirming", sourceDirection: "clarify" },
  { stage: "completing", sourceDirection: "complete" },
  { stage: "resolving", sourceDirection: "stabilize" },
  { stage: "delayed", sourceDirection: "develop" },
];

const modes: PadaExpressionModeResult[] = [
  { mode: "analysis", matchedTheme: "Analysis" },
  { mode: "communication", matchedTheme: "Communication" },
  { mode: "initiative", matchedTheme: "Initiative" },
  { mode: "support", matchedTheme: "Support" },
  { mode: "adjustment", matchedTheme: "Adjustment" },
];

const prohibited = [
  /\b(illness|disease|infection|injury|hospitalisation|hospitalization)\b/i,
  /\b(accident|danger|emergency|death)\b/i,
  /\b(exam results?|examination results?|grades?|admission|scholarship)\b/i,
  /\b(award|prize|competition win)\b/i,
];

let tested = 0;

for (const manifestationId of manifestations) {
  const expression =
    resolveChildrenEventExpression(manifestationId);

  assert.ok(
    expression,
    `Missing expression for ${manifestationId}`
  );

  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction = composeChildrenPredictionV2(
        expression,
        stage,
        mode
      );

      assert.ok(
        prediction.trim().length > 0,
        `Empty prediction: ${manifestationId}`
      );

      assert.ok(
        !prediction.includes("undefined"),
        `Undefined text: ${prediction}`
      );

      assert.ok(
        !prediction.includes("[object Object]"),
        `Invalid object text: ${prediction}`
      );

      for (const pattern of prohibited) {
        assert.ok(
          !pattern.test(prediction),
          `Unsupported event: ${prediction}`
        );
      }

      console.log(
        `${manifestationId} | ${stage.stage} | ${mode.mode}`
      );
      console.log(`  ${prediction}`);

      tested++;
    }
  }
}

assert.equal(
  resolveChildrenEventExpression(
    "unknown_manifestation"
  ),
  null
);

assert.equal(tested, 225);

console.log(
  `All ${tested} Children V2 baseline tests passed.`
);