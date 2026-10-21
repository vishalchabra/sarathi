import { strict as assert } from "node:assert";

import {
  resolveEducationEventExpression,
} from "./eventExpressionLibrary";

const progress = resolveEducationEventExpression(
  "education_progress",
  [],
  ["Jupiter"]
);

const challenge = resolveEducationEventExpression(
  "education_challenge",
  [],
  ["Rahu"]
);

assert.equal(
  progress?.expressionId,
  "general_learning_progress"
);

assert.equal(progress?.specificity, 2);
assert.equal(progress?.confidence, "baseline");

assert.equal(
  challenge?.expressionId,
  "general_learning_challenge"
);

assert.equal(challenge?.specificity, 2);
assert.equal(challenge?.confidence, "baseline");
const focus = resolveEducationEventExpression(
  "education_focus",
  [],
  []
);

assert.ok(focus);

assert.equal(
  focus.expressionId,
  "general_learning_focus"
);

assert.equal(focus.specificity, 2);
assert.equal(focus.confidence, "baseline");

assert.equal(
  resolveEducationEventExpression(
    "unknown_manifestation",
    [],
    []
  ),
  null
);
console.log("Education V2 baseline tests passed.");