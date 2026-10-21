import { strict as assert } from "node:assert";

import {
  resolveCommunicationEventExpression,
  composeCommunicationPredictionV2,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const manifestations = [
  "communication_activity",
  "communication_clarity",
  "communication_friction",
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
  /\bjob offer\b/i,
  /\bpromotion\b/i,
  /\bapproval (?:received|granted)\b/i,
  /\bmessage (?:will|has) arriv(?:e|ed)\b/i,
  /\bargument (?:will|has)\b/i,
  /\bconfrontation (?:will|has)\b/i,
  /\brelationship breakdown\b/i,
  /\bguaranteed\b/i,
];

let tested = 0;

for (const manifestationId of manifestations) {
  const expression =
    resolveCommunicationEventExpression(manifestationId);

  assert.ok(
    expression,
    `Missing expression: ${manifestationId}`
  );

  assert.equal(expression.specificity, 2);
  assert.equal(expression.confidence, "baseline");

  for (const stage of stages) {
    for (const mode of modes) {
      const prediction =
        composeCommunicationPredictionV2(
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
  resolveCommunicationEventExpression(
    "unknown_manifestation"
  ),
  null
);

assert.equal(tested, 189);

console.log(
  `All ${tested} Communication V2 baseline tests passed.`
);