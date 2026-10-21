import { strict as assert } from "node:assert";

import {
  resolveTravelEventExpression,
  composeTravelPredictionV2,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const manifestations = [
  "travel_planning",
  "travel_movement",
  "travel_disruption",
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
  { mode: "adjustment", matchedTheme: "Adjustment" },
];

const prohibited = [
  /\baccident\b/i,
  /\bcrash\b/i,
  /\binjur(?:y|ies)\b/i,
  /\bcancell?(?:ed|ation)\b/i,
  /\bmissed flight\b/i,
  /\bflight confirmed\b/i,
  /\btickets? booked\b/i,
  /\bvisa approved\b/i,
  /\bguaranteed\b/i,
];

let tested = 0;

for (const manifestationId of manifestations) {
  const expression =
    resolveTravelEventExpression(manifestationId);

  assert.ok(
    expression,
    `Missing expression for ${manifestationId}`
  );

  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction = composeTravelPredictionV2(
        expression,
        stage,
        mode
      );

      assert.ok(
        prediction.trim().length > 0,
        `Empty prediction for ${manifestationId}`
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
  resolveTravelEventExpression(
    "unknown_manifestation"
  ),
  null
);

assert.equal(tested, 189);

console.log(
  `All ${tested} Travel V2 baseline tests passed.`
);