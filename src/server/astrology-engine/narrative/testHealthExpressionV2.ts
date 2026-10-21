import { strict as assert } from "node:assert";
import {
  resolveHealthEventExpression,
  composeHealthPredictionV2,
  type EventStageResult,
  type PadaExpressionModeResult,
} from "./eventExpressionLibrary";

const expression = resolveHealthEventExpression(
  "health_attention"
);

assert.ok(expression);
assert.equal(
  expression.expressionId,
  "general_health_attention"
);
assert.equal(expression.specificity, 2);
assert.equal(expression.confidence, "baseline");

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
  { mode: "reflection", matchedTheme: "Reflection" },
  { mode: "communication", matchedTheme: "Communication" },
  { mode: "adjustment", matchedTheme: "Adjustment" },
  { mode: "organisation", matchedTheme: "Organisation" },
  { mode: "initiative", matchedTheme: "Initiative" },
  { mode: "persistence", matchedTheme: "Persistence" },
];

let tested = 0;

for (const stage of stages) {
  for (const mode of modes) {
    const prediction = composeHealthPredictionV2(
      expression,
      stage,
      mode
    );

    assert.ok(prediction.trim().length > 0);
    assert.ok(!prediction.includes("undefined"));
    assert.ok(!prediction.includes("[object Object]"));

    // Health S2 must not predict medical events.
    assert.ok(
      !/\b(disease|diagnosis|infection|injury|surgery|hospitalisation|hospitalization|medication|treatment|cure|illness|recovery)\b/i.test(
        prediction
      ),
      `Unsupported medical wording: ${prediction}`
    );

    console.log(
      `${stage.stage} | ${mode.mode}`
    );
    console.log(`  ${prediction}`);

    tested++;
  }
}

assert.equal(
  resolveHealthEventExpression("unknown_manifestation"),
  null
);

assert.equal(tested, 63);

console.log(
  `All ${tested} Health V2 baseline tests passed.`
);