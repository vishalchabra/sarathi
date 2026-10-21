import { strict as assert } from "node:assert";

import {
  resolvePropertyEventExpression,
  composePropertyPredictionV2,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const manifestations = [
  "property_attention",
  "property_progress",
  "property_complication",
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
  /\bpurchased?\b/i,
  /\bsold\b/i,
  /\bownership transfer\b/i,
  /\bapproved\b/i,
  /\bguaranteed\b/i,
  /\bfinancial loss\b/i,
  /\blegal dispute\b/i,
  /\beviction\b/i,
  /\bforeclosure\b/i,
  /\blawsuit\b/i,
];

let tested = 0;

for (const manifestationId of manifestations) {
  const expression =
    resolvePropertyEventExpression(manifestationId);

  assert.ok(
    expression,
    `Missing expression: ${manifestationId}`
  );

  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction = composePropertyPredictionV2(
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
          `Unsupported property claim: ${prediction}`
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
  resolvePropertyEventExpression(
    "unknown_manifestation"
  ),
  null
);

assert.equal(tested, 189);

console.log(
  `All ${tested} Property V2 baseline tests passed.`
);