import { strict as assert } from "node:assert";

import {
  resolveRelationshipEventExpression,
  composeRelationshipPredictionV2,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const manifestations = [
  "relationship_attention",
  "relationship_harmony",
  "relationship_discussion",
  "relationship_tension",
  "relationship_commitment",
];

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
  /\bdivorce\b/i,
  /\bseparation\b/i,
  /\bbreakup\b/i,
  /\bmarriage\b/i,
  /\bwedding\b/i,
  /\bengagement\b/i,
  /\baffair\b/i,
  /\binfidelity\b/i,
  /\breconciliation\b/i,
  /\bargument\b/i,
  /\bfight\b/i,
];

let tested = 0;

for (const manifestationId of manifestations) {
  const expression =
    resolveRelationshipEventExpression(manifestationId);

  assert.ok(
    expression,
    `Missing expression for ${manifestationId}`
  );

  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction = composeRelationshipPredictionV2(
        expression,
        stage,
        mode
      );

      assert.ok(
        prediction.trim().length > 0,
        `Empty prediction: ${manifestationId}`
      );

      assert.ok(!prediction.includes("undefined"));
      assert.ok(!prediction.includes("[object Object]"));

      for (const pattern of prohibited) {
        assert.ok(
          !pattern.test(prediction),
          `Unsupported relationship event: ${prediction}`
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
  resolveRelationshipEventExpression(
    "unknown_manifestation"
  ),
  null
);

assert.equal(tested, 225);

console.log(
  `All ${tested} Relationships V2 baseline tests passed.`
);