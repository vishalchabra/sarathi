import {
  EVENT_JUDGEMENT_WEIGHTS,
} from "../knowledge/eventJudgementRules";

export type UnifiedEvidenceDimension =
  keyof typeof EVENT_JUDGEMENT_WEIGHTS;

export type UnifiedEvidenceValue = {
  value: number | null;
  reasons: readonly string[];
};

export type UnifiedEvidenceDimensions = Record<
  UnifiedEvidenceDimension,
  UnifiedEvidenceValue
>;

export type UnifiedEventGates = {
  ageAppropriate: boolean | null;
  completeNatalData: boolean | null;
  natalFoundation: boolean | null;
  directDashaActivation: boolean | null;
  coreHouseCoverage: boolean | null;
  distinctiveHouseCoverage: boolean | null;
  independentTransit: boolean | null;
  dailyTrigger: boolean | null;
};

export type UnifiedEventScoringInput = {
  eventId: string;
  specificity: "broad" | "situational" | "specific";
  dimensions: UnifiedEvidenceDimensions;
  gates: UnifiedEventGates;
  requiresIndependentTransit: boolean;
  requiresDailyTrigger: boolean;
};

export type UnifiedEventAdmission =
  | "INELIGIBLE"
  | "INSUFFICIENT_DATA"
  | "AREA_ONLY"
  | "SITUATION_SUPPORTED"
  | "EVENT_SUPPORTED";

export const UNIFIED_EVENT_THRESHOLDS = {
  situation: 50,
  specific: 70,
} as const;

const DIMENSIONS = Object.keys(
  EVENT_JUDGEMENT_WEIGHTS
) as UnifiedEvidenceDimension[];

function validValue(value: number | null): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function scoreUnifiedEvent(
  input: UnifiedEventScoringInput
) {
  const breakdown = DIMENSIONS.map(dimension => {
    const evidence = input.dimensions[dimension];
    const weight = EVENT_JUDGEMENT_WEIGHTS[dimension];

    const available = validValue(evidence?.value);

    const value = available
      ? evidence.value as number
      : null;

    return {
      dimension,
      weight,
      value,
      available,
      points: value === null
        ? 0
        : round2(value * weight),
      reasons: evidence?.reasons ?? [],
    };
  });

  const maximumScore = breakdown.reduce(
    (sum, row) => sum + row.weight,
    0
  );

  const availableWeight = breakdown.reduce(
    (sum, row) => sum + (
      row.available ? row.weight : 0
    ),
    0
  );

  // Missing evidence must not inflate the score
  // by reducing the denominator.
  const baseScore = round2(
    breakdown.reduce(
      (sum, row) => sum + row.points,
      0
    )
  );

  const evidenceCoverage =
    maximumScore > 0
      ? availableWeight / maximumScore
      : 0;

  const missingDimensions = breakdown
    .filter(row => !row.available)
    .map(row => row.dimension);

  const mandatoryGates: Array<keyof UnifiedEventGates> = [
    "ageAppropriate",
    "completeNatalData",
    "natalFoundation",
    "directDashaActivation",
    "coreHouseCoverage",
    "distinctiveHouseCoverage",
  ];

  if (input.requiresIndependentTransit) {
    mandatoryGates.push("independentTransit");
  }

  if (input.requiresDailyTrigger) {
    mandatoryGates.push("dailyTrigger");
  }

  const failedGates = mandatoryGates.filter(
    gate => input.gates[gate] === false
  );

  const unknownGates = mandatoryGates.filter(
    gate => input.gates[gate] !== true &&
      input.gates[gate] !== false
  );

  const allMandatoryGatesPassed =
    failedGates.length === 0 &&
    unknownGates.length === 0;

  const foundationalFailure =
    input.gates.natalFoundation === false ||
    input.gates.directDashaActivation === false ||
    input.gates.coreHouseCoverage === false;

  let admission: UnifiedEventAdmission = "AREA_ONLY";

  if (input.gates.ageAppropriate === false) {
    admission = "INELIGIBLE";
  } else if (
    input.gates.completeNatalData !== true ||
    unknownGates.length > 0 ||
    missingDimensions.length > 0
  ) {
    admission = "INSUFFICIENT_DATA";
  } else if (foundationalFailure) {
    admission = "AREA_ONLY";
  } else if (
    input.specificity === "specific" &&
    allMandatoryGatesPassed &&
    baseScore >= UNIFIED_EVENT_THRESHOLDS.specific
  ) {
    admission = "EVENT_SUPPORTED";
  } else if (
    input.specificity !== "broad" &&
    allMandatoryGatesPassed &&
    baseScore >= UNIFIED_EVENT_THRESHOLDS.situation
  ) {
    admission = "SITUATION_SUPPORTED";
  }

  return {
    eventId: input.eventId,
    specificity: input.specificity,
    baseScore,
    maximumScore,
    evidenceCoverage,
    availableWeight,
    breakdown,
    missingDimensions,
    mandatoryGates,
    failedGates,
    unknownGates,
    allMandatoryGatesPassed,
    admission,
    scoreMeaning: "heuristic_evidence_alignment" as const,
  };
}
