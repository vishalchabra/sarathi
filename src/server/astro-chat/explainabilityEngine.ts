export type SixPillarKey =
  | "natal_promise"
  | "sambandha"
  | "divisional_confirmation"
  | "dasha_activation"
  | "transit_trigger"
  | "conversion_probability";

export type SixPillarItem = {
  key: SixPillarKey;
  label: string;
  score: number;
  weight: number;
  weightedScore: number;
  strength: "very_strong" | "strong" | "moderate" | "weak" | "unclear";
  verdict: string;
  references: string[];
};

export type SixPillarExplainabilityProfile = {
  topic: string;
  eventType?: string;
  overallScore: number;
  overallStrength: "very_strong" | "strong" | "moderate" | "weak";
  movementScore: number;
  conversionScore: number;
  pillars: SixPillarItem[];
  confidenceDrivers: {
    supporting: string[];
    limiting: string[];
  };
  logicChain: string[];
  evidenceReferences: string[];
  finalAssessment: string;
};

type BundleLike = any;

function verdictToScore(verdict: string | undefined): number {
  switch (verdict) {
    case "strong": return 85;
    case "moderate": return 68;
    case "mixed": return 50;
    case "weak": return 30;
    default: return 20;
  }
}

function scoreToStrength(score: number): SixPillarItem["strength"] {
  if (score >= 80) return "very_strong";
  if (score >= 65) return "strong";
  if (score >= 45) return "moderate";
  if (score >= 25) return "weak";
  return "unclear";
}

function getWeights(topic: string, eventType?: string): Record<SixPillarKey, number> {
  if (topic === "career" && eventType === "job_change") {
    return {
      natal_promise: 25,
      sambandha: 20,
      divisional_confirmation: 15,
      dasha_activation: 20,
      transit_trigger: 10,
      conversion_probability: 10,
    };
  }
  if (topic === "marriage" || topic === "relationships") {
    return {
      natal_promise: 25,
      sambandha: 20,
      divisional_confirmation: 25,
      dasha_activation: 15,
      transit_trigger: 10,
      conversion_probability: 5,
    };
  }
  if (topic === "property" || topic === "vehicle") {
    return {
      natal_promise: 30,
      sambandha: 20,
      divisional_confirmation: 20,
      dasha_activation: 15,
      transit_trigger: 10,
      conversion_probability: 5,
    };
  }
  return {
    natal_promise: 25,
    sambandha: 20,
    divisional_confirmation: 20,
    dasha_activation: 20,
    transit_trigger: 10,
    conversion_probability: 5,
  };
}

export function buildSixPillarExplainabilityProfile(bundle: BundleLike): SixPillarExplainabilityProfile {
  const eventType = bundle.eventType ?? bundle.careerEventType;
  const weights = getWeights(bundle.topic, eventType);
  const natalScore = verdictToScore(bundle.promiseLayer?.verdict);
  const sambandhaScore = Math.max(0, Math.min(100, bundle.sambandhaAnalysis?.conversionScore ?? 0));
  const divisionalScore = verdictToScore(bundle.divisionalLayer?.verdict);
  const dashaScore = bundle.timingPolicy?.dashaStrength === "strong" ? 85
    : bundle.timingPolicy?.dashaStrength === "moderate" ? 68
    : bundle.timingPolicy?.dashaStrength === "mixed" ? 48 : 28;
  const transitScore = bundle.timingPolicy?.transitStrength === "strong" ? 85
    : bundle.timingPolicy?.transitStrength === "moderate" ? 68
    : bundle.timingPolicy?.transitStrength === "mixed" ? 48 : 28;
  const conversionScore = Math.max(0, Math.min(100,
    bundle.conversionDiagnosisV2?.conversionStrength ?? bundle.sambandhaAnalysis?.conversionScore ?? 0
  ));
  const houseRefs = [...(bundle.focusHouses ?? []), ...(bundle.supportHouses ?? [])]
    .filter((value: number, index: number, values: number[]) => values.indexOf(value) === index)
    .map((house: number) => `House ${house}`);
  const dashaChain = [bundle.currentDasha?.md, bundle.currentDasha?.ad, bundle.currentDasha?.pd]
    .filter(Boolean).join("–");

  const makePillar = (
    key: SixPillarKey,
    label: string,
    score: number,
    verdict: string,
    references: string[]
  ): SixPillarItem => ({
    key,
    label,
    score,
    weight: weights[key],
    weightedScore: Math.round((score * weights[key]) / 100),
    strength: scoreToStrength(score),
    verdict,
    references: references.filter(Boolean).slice(0, 6),
  });

  const pillars: SixPillarItem[] = [
    makePillar("natal_promise", "Natal Promise", natalScore,
      bundle.promiseLayer?.summary ?? "Natal promise is not clearly available.",
      [`Relevant houses: ${houseRefs.join(", ") || "not available"}`, ...(bundle.promiseLayer?.bullets ?? [])]),
    makePillar("sambandha", "Planetary Relationships", sambandhaScore,
      bundle.sambandhaAnalysis?.summary ?? "Planetary connectivity is not available.",
      [
        ...(bundle.sambandhaAnalysis?.supportiveLinks ?? []).slice(0, 4).map((r: any) => r.reason),
        ...(bundle.sambandhaAnalysis?.missingRequiredLinks ?? []).slice(0, 2),
      ]),
    makePillar("divisional_confirmation", "Divisional Confirmation", divisionalScore,
      bundle.divisionalLayer?.summary ?? "The divisional confirmation is unclear.",
      [`Relevant charts: ${(bundle.divisionalCharts ?? []).join(", ") || "not available"}`, ...(bundle.divisionalLayer?.bullets ?? [])]),
    makePillar("dasha_activation", "Dasha Activation", dashaScore,
      bundle.timingPolicy?.note ?? "Dasha activation is unclear.",
      [dashaChain ? `Current dasha chain: ${dashaChain}` : "", ...(bundle.timingLayer?.bullets ?? []).filter((x: any) => /dasha|period|mahadasha|antardasha|pratyantar/i.test(String(x)))]),
    makePillar("transit_trigger", "Transit Trigger", transitScore,
      bundle.timingPolicy?.transitStrength === "strong"
        ? "Current transits strongly support activation and practical movement."
        : bundle.timingPolicy?.transitStrength === "moderate"
        ? "Current transits provide meaningful support, but final conversion still requires confirmation."
        : "Current transits are opening movement more clearly than final conversion.",
      [...(bundle.bestEventTrigger?.why ?? []), ...(bundle.timingLayer?.bullets ?? []).filter((x: any) => /transit|aspect|conjunction|ingress|degree/i.test(String(x)))]),
    makePillar("conversion_probability", "Conversion Assessment", conversionScore,
      bundle.conversionDiagnosisV2?.verdict === "conversion_favored"
        ? "The evidence supports movement converting into a completed outcome."
        : bundle.conversionDiagnosisV2?.verdict === "movement_favored"
        ? "Movement is better supported than immediate final conversion."
        : "The final outcome remains blocked or insufficiently confirmed.",
      [...(bundle.conversionDiagnosisV2?.conversionReasons ?? []).slice(0, 3), ...(bundle.conversionDiagnosisV2?.blockageReasons ?? []).slice(0, 3)]),
  ];

  const overallScore = Math.max(0, Math.min(100, pillars.reduce((sum, p) => sum + p.weightedScore, 0)));
  const movementScore = Math.max(0, Math.min(100, bundle.conversionDiagnosisV2?.movementStrength ?? overallScore));
  const finalConversionScore = Math.round(conversionScore * 0.55 + sambandhaScore * 0.25 + transitScore * 0.2);
  const supporting = pillars.filter((p) => p.score >= 65).map((p) => `${p.label}: ${p.verdict}`).slice(0, 4);
  const limiting = pillars.filter((p) => p.score < 55).map((p) => `${p.label}: ${p.verdict}`).slice(0, 4);
  const logicChain = [
    `Natal promise: ${bundle.promiseLayer?.summary ?? "unclear"}`,
    `Sambandha: ${bundle.sambandhaAnalysis?.summary ?? "unclear"}`,
    `Divisional confirmation: ${bundle.divisionalLayer?.summary ?? "unclear"}`,
    `Current dasha: ${dashaChain || "not clearly available"}`,
    `Transit trigger: ${bundle.timingPolicy?.transitStrength ?? "unclear"}`,
    bundle.conversionDiagnosisV2?.verdict === "conversion_favored"
      ? "Conclusion: movement and conversion are both supported."
      : bundle.conversionDiagnosisV2?.verdict === "movement_favored"
      ? "Conclusion: movement is supported before final conversion."
      : "Conclusion: final conversion is not yet sufficiently confirmed.",
  ];
  const evidenceReferences = pillars.flatMap((p) => p.references.map((r) => `${p.label}: ${r}`))
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 18);

  return {
    topic: bundle.topic,
    eventType,
    overallScore,
    overallStrength: overallScore >= 80 ? "very_strong" : overallScore >= 65 ? "strong" : overallScore >= 45 ? "moderate" : "weak",
    movementScore,
    conversionScore: finalConversionScore,
    pillars,
    confidenceDrivers: { supporting, limiting },
    logicChain,
    evidenceReferences,
    finalAssessment: finalConversionScore >= 70
      ? "The chart supports both activation and a credible route toward final conversion."
      : movementScore >= 55
      ? "The chart supports movement first, while final conversion remains conditional."
      : "The current evidence is better used for preparation than for expecting an immediate completed outcome.",
  };
}
