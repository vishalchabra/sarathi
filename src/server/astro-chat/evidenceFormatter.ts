import type { SixPillarExplainabilityProfile } from "./explainabilityEngine";

export function buildStructuredEvidence(bundle: any, profile: SixPillarExplainabilityProfile): string[] {
  const natal = profile.pillars.find((pillar) => pillar.key === "natal_promise");
  const divisional = profile.pillars.find((pillar) => pillar.key === "divisional_confirmation");
  const dasha = profile.pillars.find((pillar) => pillar.key === "dasha_activation");
  const transit = profile.pillars.find((pillar) => pillar.key === "transit_trigger");
  const conversion = profile.pillars.find((pillar) => pillar.key === "conversion_probability");

  const selectedWindowLord = bundle.selectedTimingWindow?.dashaLord
    ?? bundle.bestAvailableWindow?.dashaLord
    ?? bundle.strongestWindow?.dashaLord
    ?? null;

  return [
    `Natal Promise — ${natal?.verdict ?? bundle.promiseLayer?.summary ?? "Not available"}`,
    ...(natal?.references ?? []).map((item) => `Natal Promise — ${item}`),
    `Planetary Relationships — ${bundle.sambandhaAnalysis?.summary ?? "Not available"}`,
    ...(bundle.sambandhaAnalysis?.supportiveLinks ?? []).slice(0, 4)
      .map((relationship: any) => `Planetary Relationships — ${relationship.reason}`),
    `Divisional Confirmation — ${divisional?.verdict ?? bundle.divisionalLayer?.summary ?? "Not available"}`,
    ...(divisional?.references ?? []).map((item) => `Divisional Confirmation — ${item}`),
    `Current Dasha — ${bundle.currentDasha?.line ?? dasha?.verdict ?? "Not available"}`,
    selectedWindowLord
      ? `Future Window Ruler — ${selectedWindowLord} becomes relevant in the selected future window; it is not the current sub-period unless it matches the current dasha chain.`
      : "",
    `Transit Status — ${transit?.verdict ?? bundle.timingPolicy?.note ?? "Not available"}`,
    `Assessment — Astrological evidence strength ${profile.overallScore}/100; near-term movement support ${profile.movementScore}/100; final conversion support ${profile.conversionScore}/100.`,
    `Conversion Assessment — ${conversion?.verdict ?? profile.finalAssessment}`,
    ...profile.confidenceDrivers.supporting.map((item) => `Supporting Factor — ${item}`),
    ...profile.confidenceDrivers.limiting.map((item) => `Limiting Factor — ${item}`),
    ...profile.logicChain.map((item, index) => `Logic ${index + 1} — ${item}`),
  ].filter(Boolean);
}
