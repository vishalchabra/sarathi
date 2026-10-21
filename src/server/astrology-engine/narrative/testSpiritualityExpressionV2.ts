import { strict as assert } from "node:assert";

import {
  resolveSpiritualityEventExpression,
  composeSpiritualityPredictionV2,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const manifestations = [
  "spiritual_practice",
  "spiritual_introspection",
  "spiritual_learning",
  "spiritual_detachment",
  "spiritual_guidance",
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
  /\bguaranteed\b/i,
  /\bmiracle\b/i,
  /\bsupernatural experience\b/i,
  /\bspiritual awakening\b/i,
  /\benlightenment\b/i,
  /\bdivine intervention\b/i,
  /\bdiagnos(?:is|ed)\b/i,
  /\btrauma\b/i,
  /\bfinancial loss\b/i,
  /\brelationship breakdown\b/i,
  /\bwill meet (?:a|your) (?:guru|teacher)\b/i,
];

let tested = 0;

for (const manifestationId of manifestations) {
  const expression =
    resolveSpiritualityEventExpression(manifestationId);

  assert.ok(
    expression,
    `Missing expression: ${manifestationId}`
  );

  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction =
        composeSpiritualityPredictionV2(
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

      assert.equal(
        prediction,
        prediction.trim(),
        `Unexpected surrounding whitespace: ${prediction}`
      );

      assert.ok(
        /[.!?]$/.test(prediction),
        `Missing sentence punctuation: ${prediction}`
      );

      for (const pattern of prohibited) {
        assert.ok(
          !pattern.test(prediction),
          `Unsupported spiritual claim: ${prediction}`
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
  resolveSpiritualityEventExpression(
    "unknown_manifestation"
  ),
  null
);

assert.equal(tested, 315);

console.log(
  `All ${tested} Spirituality V2 baseline tests passed.`
);