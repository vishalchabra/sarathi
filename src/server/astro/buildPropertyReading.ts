type PropertyStage =
  | "exploration"
  | "active_search"
  | "execution"
  | "closure_window";

type PropertyConfidence = "Low" | "Medium" | "High";
type ClosureLikelihood = "Low" | "Moderate" | "High";
function scorePropertyConfidence(facts: string[], stage: PropertyStage): {
  confidence: PropertyConfidence;
  closureLikelihood: ClosureLikelihood;
} {
  const text = facts.join(" ").toLowerCase();

  let score = 0;

  if (text.includes("property")) score += 2;
  if (text.includes("home")) score += 1;
  if (text.includes("settlement")) score += 1;
  if (text.includes("relocation")) score += 1;
  if (text.includes("execution")) score += 2;
  if (text.includes("paperwork")) score += 2;
  if (text.includes("documents")) score += 2;
  if (text.includes("finance")) score += 2;
  if (text.includes("loan")) score += 1;
  if (text.includes("negotiation")) score += 1;
  if (text.includes("closure")) score += 3;
  if (text.includes("ownership")) score += 3;
  if (text.includes("registration")) score += 3;

  let confidence: PropertyConfidence = "Low";
  if (score >= 8) confidence = "High";
  else if (score >= 4) confidence = "Medium";

  let closureLikelihood: ClosureLikelihood = "Low";

  if (stage === "closure_window") {
    closureLikelihood = confidence === "High" ? "High" : "Moderate";
  } else if (stage === "execution") {
    closureLikelihood = score >= 8 ? "Moderate" : "Low";
  } else {
    closureLikelihood = "Low";
  }

  return { confidence, closureLikelihood };
}
function detectPropertyStage(facts: string[]): PropertyStage {
  const text = facts.join(" ").toLowerCase();

  const hasProperty =
    text.includes("property") ||
    text.includes("home") ||
    text.includes("stability") ||
    text.includes("settlement");

  const hasRelocation =
    text.includes("relocation") ||
    text.includes("movement") ||
    text.includes("foreign") ||
    text.includes("change of place");

  const hasExecution =
    text.includes("paperwork") ||
    text.includes("documents") ||
    text.includes("finance") ||
    text.includes("loan") ||
    text.includes("negotiation") ||
    text.includes("registration");

  const hasClosure =
    text.includes("finalize") ||
    text.includes("closure") ||
    text.includes("ownership") ||
    text.includes("deal completes") ||
    text.includes("registration completes");

if (
  hasClosure &&
  (
    text.includes("ownership") ||
    text.includes("registration completes") ||
    text.includes("finalize")
  )
) {
  return "closure_window";
}

if (hasExecution) return "execution";
if (hasProperty || hasRelocation) return "active_search";
return "exploration";
}

export function buildPropertyReading(opts: {
  facts: string[];
}) {
  const { facts } = opts;

  const stage = detectPropertyStage(facts);
  const { confidence, closureLikelihood } = scorePropertyConfidence(facts, stage);
  const realityLine =
    "Property decisions typically unfold over weeks or months. This window shows when movement starts or accelerates, not necessarily when the deal completes.";

  if (!facts.length) {
    return {
  stage: "exploration" as PropertyStage,
  confidence,
  closureLikelihood,
  verdict: "Property is not strongly activated right now.",
  explanation:
    "This looks more like a neutral phase for property matters. The chart does not yet show strong push toward purchase, relocation, or closure.",
  action:
    "Use this period for clarity only — budget, priorities, and what kind of move would actually make sense.",
  timingNote: realityLine,
};
  }

  if (stage === "closure_window") {
    return {
      stage,
      confidence,
      closureLikelihood,
      verdict: "Property phase is in closure mode.",
      explanation:
        "This is the strongest form of activation. It suggests a deal already in motion can move toward final decision, registration, or ownership.",
      action:
        "Push paperwork, funding, final checks, and deadline-driven action.",
      timingNote: realityLine,
    };
  }

  if (stage === "execution") {
    return {
      stage,
      confidence,
      closureLikelihood,
      verdict: "Property phase is in execution mode.",
      explanation:
        "This phase supports serious movement — shortlisting, negotiation, financing, documents, or progressing an existing property decision.",
      action:
        "Treat this as a working phase. Move files, numbers, discussions, and verification forward.",
      timingNote: realityLine,
    };
  }

  if (stage === "active_search") {
    return {
      stage,
      confidence,
      closureLikelihood,
      verdict: "Property phase is activating.",
      explanation:
        "This phase is more about search, planning, discussion, or relocation momentum than instant closure. The process has started moving.",
      action:
        "Start or intensify search, budget planning, area comparison, and practical discussions.",
      timingNote: realityLine,
    };
  }

  return {
    stage,
    confidence,
    closureLikelihood,
    verdict: "Property remains in exploration mode.",
    explanation:
      "Interest may be building, but the chart does not yet show strong execution or closure signals.",
    action:
      "Clarify whether this is truly the right move before committing resources.",
    timingNote: realityLine,
  };
}