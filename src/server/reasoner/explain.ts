// FILE: src/server/reasoner/explain.ts

/**
 * Lightweight explanation helper.
 * For now it's a simple pass-through / formatter around the raw answer.
 * You can extend this later to add debug info, scoring breakdowns, etc.
 */
export function explain(answer: any) {
  // If answer is already a string, just return it.
  if (typeof answer === "string") return answer;

  // If it looks like a structured answer with `text`, prefer that.
  if (answer && typeof answer === "object" && "text" in answer) {
    return (answer as any).text;
  }

  // Fallback: JSON stringify for safety.
  try {
    return JSON.stringify(answer);
  } catch {
    return String(answer);
  }
}
