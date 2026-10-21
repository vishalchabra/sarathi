import { realizePrediction } from "./eventExpressionLibrary";

const result = realizePrediction(
  "An education-related difficulty",
  "clarifying",
  "analysis"
);

console.log("RESULT:", JSON.stringify(result));
console.log("HAS CORRECT SPACE:", result.includes("as relevant"));
console.log("HAS MISSING SPACE:", result.includes("asrelevant"));