import { strict as assert } from "node:assert";

import {
  resolveHiddenMattersEventExpression,
  composeHiddenMattersPredictionV2,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const manifestations = [
  "hidden_matters_revelation",
  "hidden_matters_introspection",
  "hidden_matters_complication",
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
  { mode: "initiative", matchedTheme: "Initiative" },
  { mode: "organisation", matchedTheme: "Organisation" },
  { mode: "coordination", matchedTheme: "Coordination" },
  { mode: "analysis", matchedTheme: "Analysis" },
  { mode: "communication", matchedTheme: "Communication" },
  { mode: "support", matchedTheme: "Support" },
  { mode: "reflection", matchedTheme: "Reflection" },
];

const prohibited = [
  /\bbetrayal\b/i,
  /\bdeception\b/i,
  /\bscandal\b/i,
  /\bconspiracy\b/i,
  /\bsecret (?:will|is going to)\b/i,
  /\bhidden enemy\b/i,
  /\bdiagnos(?:is|ed)\b/i,
  /\btrauma\b/i,
  /\bguaranteed\b/i,
];

let tested = 0;

for (const manifestationId of manifestations) {
  const expression =
    resolveHiddenMattersEventExpression(manifestationId);

  assert.ok(
    expression,
    `Missing expression: ${manifestationId}`
  );

  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction =
        composeHiddenMattersPredictionV2(
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
          `Unsupported claim: ${prediction}`
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
  resolveHiddenMattersEventExpression(
    "unknown_manifestation"
  ),
  null
);

assert.equal(tested, 189);

console.log(
  `All ${tested} Hidden Matters V2 baseline tests passed.`
);