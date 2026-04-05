type RelocationStage =
  | "exploration"
  | "preparation"
  | "execution"
  | "move_window";

type RelocationType =
  | "domestic"
  | "foreign"
  | "unclear";

type RelocationIntent =
  | "voluntary"
  | "forced"
  | "mixed";

function detectRelocationStage(facts: string[]): RelocationStage {
  const text = facts.join(" ").toLowerCase();

  if (
    text.includes("finalize") ||
    text.includes("move completes") ||
    text.includes("shift happens")
  ) {
    return "move_window";
  }

  if (
    text.includes("documents") ||
    text.includes("logistics") ||
    text.includes("visa") ||
    text.includes("execution")
  ) {
    return "execution";
  }

  if (
    text.includes("planning") ||
    text.includes("discussion") ||
    text.includes("considering")
  ) {
    return "preparation";
  }

  return "exploration";
}

function detectRelocationType(facts: string[]): RelocationType {
  const text = facts.join(" ").toLowerCase();

  if (
    text.includes("foreign") ||
    text.includes("abroad") ||
    text.includes("international") ||
    text.includes("visa")
  ) {
    return "foreign";
  }

  if (
    text.includes("city") ||
    text.includes("local") ||
    text.includes("within country")
  ) {
    return "domestic";
  }

  return "unclear";
}

function detectRelocationIntent(facts: string[]): RelocationIntent {
  const text = facts.join(" ").toLowerCase();

  const voluntarySignals =
    text.includes("opportunity") ||
    text.includes("choice") ||
    text.includes("growth") ||
    text.includes("expansion");

  const forcedSignals =
    text.includes("pressure") ||
    text.includes("compulsion") ||
    text.includes("forced") ||
    text.includes("loss of stability");

  if (voluntarySignals && forcedSignals) return "mixed";
  if (forcedSignals) return "forced";
  if (voluntarySignals) return "voluntary";

  return "mixed";
}

export function buildRelocationReading(opts: {
  facts: string[];
}) {
  const { facts } = opts;

  const stage = detectRelocationStage(facts);
  const type = detectRelocationType(facts);
  const intent = detectRelocationIntent(facts);

  const realityLine =
    "Relocation typically unfolds in stages — planning, preparation, execution, and then the actual move. This timing shows when movement builds, not just when the move completes.";

  if (!facts.length) {
    return {
      stage,
      type,
      intent,
      verdict: "Relocation is not strongly activated right now.",
      explanation:
        "Your chart does not currently show strong movement signals for changing location or environment.",
      action:
        "Use this phase for clarity — whether a move is actually needed or beneficial.",
      timingNote: realityLine,
    };
  }

  if (stage === "move_window") {
    return {
      stage,
      type,
      intent,
      verdict: "Relocation is entering a move window.",
      explanation:
        "This is when an actual shift in location becomes possible. A move that has been building can now materialize.",
      action: "Focus on final logistics, commitments, and execution.",
      timingNote: realityLine,
    };
  }

  if (stage === "execution") {
    return {
      stage,
      type,
      intent,
      verdict: "Relocation is in execution phase.",
      explanation:
        "This phase supports documentation, logistics, and concrete movement toward changing location.",
      action:
        "Handle paperwork, logistics, travel planning, and final confirmations.",
      timingNote: realityLine,
    };
  }

  if (stage === "preparation") {
    return {
      stage,
      type,
      intent,
      verdict: "Relocation phase is building.",
      explanation:
        "This is a preparation phase — discussions, planning, and evaluating options become active.",
      action:
        "Research locations, evaluate options, and begin structured planning.",
      timingNote: realityLine,
    };
  }

  return {
    stage,
    type,
    intent,
    verdict: "Relocation is in early exploration.",
    explanation:
      "The idea of change may be emerging, but the chart does not yet show strong movement.",
    action:
      "Clarify whether a move is necessary before taking action.",
    timingNote: realityLine,
  };
}