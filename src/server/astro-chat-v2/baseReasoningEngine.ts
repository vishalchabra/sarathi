export type BaseStrength =
  | "very_strong"
  | "strong"
  | "moderate"
  | "weak"
  | "unclear";

export type BaseEvidenceLayer = {
  key:
    | "natal"
    | "sambandha"
    | "divisional"
    | "dasha"
    | "transit"
    | "conversion";

  label: string;
  strength: BaseStrength;
  score: number;
  verdict: string;
  references: string[];
};

export type BaseReasoningConfidence = {
  level: "high" | "medium" | "low";
  score: number;
  supporting: string[];
  limiting: string[];
};

export type BaseReasoningResult = {
  layers: {
    natal: BaseEvidenceLayer;
    sambandha: BaseEvidenceLayer;
    divisional: BaseEvidenceLayer;
    dasha: BaseEvidenceLayer;
    transit: BaseEvidenceLayer;
    conversion: BaseEvidenceLayer;
  };

  overall: {
    score: number;
    strength: BaseStrength;
    verdict: string;
  };

  confidence: BaseReasoningConfidence;

  evidence: {
    natal: string[];
    sambandha: string[];
    divisional: string[];
    dasha: string[];
    transit: string[];
    conversion: string[];
    missing: string[];
  };

  currentDasha: {
    md?: string | null;
    ad?: string | null;
    pd?: string | null;
    line: string;
  };

  timing: {
    selectedWindow: any | null;
    bestTrigger: any | null;
    dashaStrength: string;
    transitStrength: string;
  };

  contradictions: string[];
};

type BundleLike = any;

function uniqueStrings(
  values: Array<string | null | undefined>
): string[] {
  return Array.from(
    new Set(
      values
        .map((value) =>
          String(value ?? "").trim()
        )
        .filter(Boolean)
    )
  );
}

function clamp(
  value: number,
  min = 0,
  max = 100
): number {
  return Math.max(
    min,
    Math.min(
      max,
      Math.round(value)
    )
  );
}

function verdictToScore(
  verdict: unknown
): number {
  switch (
    String(verdict ?? "")
      .trim()
      .toLowerCase()
  ) {
    case "very_strong":
      return 92;

    case "strong":
      return 84;

    case "moderate":
      return 66;

    case "mixed":
      return 50;

    case "weak":
      return 30;

    case "unclear":
    default:
      return 20;
  }
}

function scoreToStrength(
  score: number
): BaseStrength {
  if (score >= 85) {
    return "very_strong";
  }

  if (score >= 68) {
    return "strong";
  }

  if (score >= 48) {
    return "moderate";
  }

  if (score >= 25) {
    return "weak";
  }

  return "unclear";
}

function buildNatalLayer(
  bundle: BundleLike
): BaseEvidenceLayer {
  const score =
    verdictToScore(
      bundle?.promiseLayer?.verdict
    );

  const references =
    uniqueStrings([
      bundle?.promiseLayer?.summary,

      ...(
        bundle?.promiseLayer?.bullets ??
        []
      ),

      ...(
        bundle?.focusHouses ??
        []
      ).map(
        (house: number) =>
          `Primary house ${house}`
      ),

      ...(
        bundle?.supportHouses ??
        []
      ).map(
        (house: number) =>
          `Supporting house ${house}`
      ),
    ]).slice(0, 10);

  return {
    key:
      "natal",

    label:
      "Natal Promise",

    strength:
      scoreToStrength(score),

    score,

    verdict:
      bundle?.promiseLayer?.summary ??
      "Natal promise is not clearly available.",

    references,
  };
}

function buildSambandhaLayer(
  bundle: BundleLike
): BaseEvidenceLayer {
  const score =
    clamp(
      bundle?.sambandhaAnalysis
        ?.conversionScore ??
      bundle?.sambandhaAnalysis
        ?.connectivityScore ??
      0
    );

  const references =
    uniqueStrings([
      bundle?.sambandhaAnalysis
        ?.summary,

      ...(
        bundle?.sambandhaAnalysis
          ?.supportiveLinks ??
        []
      ).map(
        (relationship: any) =>
          relationship?.reason
      ),

      ...(
        bundle?.sambandhaAnalysis
          ?.missingRequiredLinks ??
        []
      ),
    ]).slice(0, 10);

  return {
    key:
      "sambandha",

    label:
      "Planetary Relationships",

    strength:
      scoreToStrength(score),

    score,

    verdict:
      bundle?.sambandhaAnalysis
        ?.summary ??
      "Planetary relationship evidence is not clearly available.",

    references,
  };
}

function buildDivisionalLayer(
  bundle: BundleLike
): BaseEvidenceLayer {
  const score =
    verdictToScore(
      bundle?.divisionalLayer?.verdict
    );

  const references =
    uniqueStrings([
      bundle?.divisionalLayer?.summary,

      ...(
        bundle?.divisionalLayer?.bullets ??
        []
      ),

      ...(
        bundle?.divisionalAnalysis
          ?.supports ??
        []
      ),

      ...(
        bundle?.divisionalAnalysis
          ?.blockers ??
        []
      ),
    ]).slice(0, 10);

  return {
    key:
      "divisional",

    label:
      "Divisional Confirmation",

    strength:
      scoreToStrength(score),

    score,

    verdict:
      bundle?.divisionalLayer?.summary ??
      "Divisional confirmation is not clearly available.",

    references,
  };
}

function dashaStrengthToScore(
  strength: unknown
): number {
  switch (
    String(strength ?? "")
      .trim()
      .toLowerCase()
  ) {
    case "strong":
      return 84;

    case "moderate":
      return 66;

    case "mixed":
      return 48;

    case "weak":
      return 28;

    default:
      return 20;
  }
}

function buildDashaLayer(
  bundle: BundleLike
): BaseEvidenceLayer {
  const score =
    dashaStrengthToScore(
      bundle?.timingPolicy
        ?.dashaStrength
    );

  const dashaChain =
    [
      bundle?.currentDasha?.md,
      bundle?.currentDasha?.ad,
      bundle?.currentDasha?.pd,
    ]
      .filter(Boolean)
      .join("–");

  const references =
    uniqueStrings([
      bundle?.currentDasha?.line,

      dashaChain
        ? `Current dasha chain: ${dashaChain}`
        : null,

      bundle?.timingPolicy?.note,

      ...(
        bundle?.timingLayer?.bullets ??
        []
      ).filter(
        (item: unknown) =>
          /dasha|period|mahadasha|antardasha|pratyantar/i.test(
            String(item ?? "")
          )
      ),
    ]).slice(0, 10);

  return {
    key:
      "dasha",

    label:
      "Dasha Activation",

    strength:
      scoreToStrength(score),

    score,

    verdict:
      bundle?.timingPolicy?.note ??
      "Dasha activation is not clearly available.",

    references,
  };
}

function transitStrengthToScore(
  strength: unknown
): number {
  switch (
    String(strength ?? "")
      .trim()
      .toLowerCase()
  ) {
    case "strong":
      return 84;

    case "moderate":
      return 66;

    case "mixed":
      return 48;

    case "weak":
      return 28;

    default:
      return 20;
  }
}

function buildTransitLayer(
  bundle: BundleLike
): BaseEvidenceLayer {
  const score =
    transitStrengthToScore(
      bundle?.timingPolicy
        ?.transitStrength
    );

  const references =
    uniqueStrings([
      bundle?.bestEventTrigger
        ?.practicalMeaning,

      ...(
        bundle?.bestEventTrigger?.why ??
        []
      ),

      ...(
        bundle?.timingLayer?.bullets ??
        []
      ).filter(
        (item: unknown) =>
          /transit|aspect|conjunction|ingress|degree|trigger/i.test(
            String(item ?? "")
          )
      ),
    ]).slice(0, 10);

  const verdict =
    score >= 68
      ? "Current transits provide meaningful support for practical activation."
      : score >= 48
      ? "Current transits support movement, but final conversion remains conditional."
      : "Current transits are not yet strong enough to confirm final conversion.";

  return {
    key:
      "transit",

    label:
      "Transit Trigger",

    strength:
      scoreToStrength(score),

    score,

    verdict,

    references,
  };
}

function buildConversionLayer(
  bundle: BundleLike
): BaseEvidenceLayer {
  const rawScore =
    bundle?.conversionDiagnosisV2
      ?.conversionStrength ??
    bundle?.sambandhaAnalysis
      ?.conversionScore ??
    0;

  const score =
    clamp(rawScore);

  const verdictCode =
    String(
      bundle?.conversionDiagnosisV2
        ?.verdict ??
        ""
    );

  const verdict =
    verdictCode ===
    "conversion_favored"
      ? "The available evidence supports movement converting into a completed outcome."
      : verdictCode ===
        "movement_favored"
      ? "Movement is better supported than immediate final conversion."
      : "Final conversion remains blocked or insufficiently confirmed.";

  const references =
    uniqueStrings([
      ...(
        bundle?.conversionDiagnosisV2
          ?.conversionReasons ??
        []
      ),

      ...(
        bundle?.conversionDiagnosisV2
          ?.movementReasons ??
        []
      ),

      ...(
        bundle?.conversionDiagnosisV2
          ?.blockageReasons ??
        []
      ),
    ]).slice(0, 10);

  return {
    key:
      "conversion",

    label:
      "Conversion Assessment",

    strength:
      scoreToStrength(score),

    score,

    verdict,

    references,
  };
}

function buildContradictions(
  layers: BaseReasoningResult["layers"]
): string[] {
  const contradictions: string[] = [];

  if (
    layers.natal.score >= 68 &&
    layers.divisional.score < 48
  ) {
    contradictions.push(
      "The natal promise is stronger than the divisional confirmation, so potential may exist while execution remains uneven."
    );
  }

  if (
    layers.natal.score < 48 &&
    layers.transit.score >= 68
  ) {
    contradictions.push(
      "Current transits are stronger than the natal promise, so an opportunity may appear without becoming durable."
    );
  }

  if (
    layers.dasha.score >= 68 &&
    layers.transit.score < 48
  ) {
    contradictions.push(
      "The dasha is supportive, but current transits are not yet confirming a clean outcome."
    );
  }

  if (
    layers.sambandha.score < 48 &&
    layers.natal.score >= 68
  ) {
    contradictions.push(
      "The promise exists, but the required event factors are not sufficiently connected for dependable conversion."
    );
  }

  if (
    layers.conversion.score < 48 &&
    (
      layers.natal.score >= 68 ||
      layers.dasha.score >= 68
    )
  ) {
    contradictions.push(
      "Some major layers are supportive, but the final conversion layer remains incomplete."
    );
  }

  return contradictions;
}

function buildConfidence(
  layers: BaseReasoningResult["layers"],
  contradictions: string[]
): BaseReasoningConfidence {
  const weightedScore =
    clamp(
      layers.natal.score *
        0.25 +
      layers.sambandha.score *
        0.2 +
      layers.divisional.score *
        0.2 +
      layers.dasha.score *
        0.15 +
      layers.transit.score *
        0.1 +
      layers.conversion.score *
        0.1
    );

  const contradictionPenalty =
    contradictions.length * 6;

  const score =
    clamp(
      weightedScore -
      contradictionPenalty
    );

  const supporting =
    Object.values(layers)
      .filter(
        (layer) =>
          layer.score >= 68
      )
      .map(
        (layer) =>
          `${layer.label}: ${layer.verdict}`
      )
      .slice(0, 5);

  const limiting =
    uniqueStrings([
      ...Object.values(layers)
        .filter(
          (layer) =>
            layer.score < 48
        )
        .map(
          (layer) =>
            `${layer.label}: ${layer.verdict}`
        ),

      ...contradictions,
    ]).slice(0, 5);

  const level =
    score >= 75
      ? "high"
      : score >= 50
      ? "medium"
      : "low";

  return {
    level,
    score,
    supporting,
    limiting,
  };
}

function buildOverallVerdict(
  layers: BaseReasoningResult["layers"],
  confidence: BaseReasoningConfidence
): BaseReasoningResult["overall"] {
  const score =
    clamp(
      layers.natal.score *
        0.25 +
      layers.sambandha.score *
        0.2 +
      layers.divisional.score *
        0.2 +
      layers.dasha.score *
        0.15 +
      layers.transit.score *
        0.1 +
      layers.conversion.score *
        0.1
    );

  const verdict =
    layers.conversion.score >= 68 &&
    layers.natal.score >= 68
      ? "The promise and conversion factors align sufficiently for a credible completed outcome."
      : layers.natal.score >= 68 &&
        layers.conversion.score < 48
      ? "The underlying promise exists, but the present combination is better suited to preparation or movement than completion."
      : layers.natal.score < 48 &&
        layers.transit.score >= 68
      ? "A temporary opportunity may arise, but the underlying promise is not strong enough to rely on it as a durable outcome."
      : confidence.level === "low"
      ? "The available evidence is incomplete or contradictory, so the conclusion should remain cautious."
      : "The evidence supports gradual development, but the final outcome remains conditional.";

  return {
    score,
    strength:
      scoreToStrength(score),
    verdict,
  };
}

export function buildBaseReasoning(
  bundle: BundleLike
): BaseReasoningResult {
  const layers = {
    natal:
      buildNatalLayer(
        bundle
      ),

    sambandha:
      buildSambandhaLayer(
        bundle
      ),

    divisional:
      buildDivisionalLayer(
        bundle
      ),

    dasha:
      buildDashaLayer(
        bundle
      ),

    transit:
      buildTransitLayer(
        bundle
      ),

    conversion:
      buildConversionLayer(
        bundle
      ),
  };

  const contradictions =
    buildContradictions(
      layers
    );

  const confidence =
    buildConfidence(
      layers,
      contradictions
    );

  const overall =
    buildOverallVerdict(
      layers,
      confidence
    );

  return {
    layers,

    overall,

    confidence,

    evidence: {
      natal:
        layers.natal.references,

      sambandha:
        layers.sambandha.references,

      divisional:
        layers.divisional.references,

      dasha:
        layers.dasha.references,

      transit:
        layers.transit.references,

      conversion:
        layers.conversion.references,

      missing:
        uniqueStrings([
          ...(
            bundle
              ?.canonicalChartContext
              ?.warnings ??
            []
          ),

          ...(
            bundle
              ?.divisionalAnalysis
              ?.missingCharts ??
            []
          ).map(
            (chart: string) =>
              `${chart} is unavailable.`
          ),
        ]),
    },

    currentDasha: {
      md:
        bundle?.currentDasha?.md ??
        null,

      ad:
        bundle?.currentDasha?.ad ??
        null,

      pd:
        bundle?.currentDasha?.pd ??
        null,

      line:
        bundle?.currentDasha?.line ??
        [
          bundle?.currentDasha?.md,
          bundle?.currentDasha?.ad,
          bundle?.currentDasha?.pd,
        ]
          .filter(Boolean)
          .join("–"),
    },

    timing: {
      selectedWindow:
        bundle?.selectedTimingWindow ??
        bundle?.bestAvailableWindow ??
        bundle?.strongestWindow ??
        bundle?.rankedTimingWindows?.[0] ??
        bundle?.timingWindows?.[0] ??
        null,

      bestTrigger:
        bundle?.bestEventTrigger ??
        null,

      dashaStrength:
        String(
          bundle?.timingPolicy
            ?.dashaStrength ??
          "unclear"
        ),

      transitStrength:
        String(
          bundle?.timingPolicy
            ?.transitStrength ??
          "unclear"
        ),
    },

    contradictions,
  };
}
