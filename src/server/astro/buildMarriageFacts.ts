import type {
  BaseChartFactors,
  MarriageFacts,
  PlanetId,
} from "@/server/astro/types";

type Input = {
  baseChartFactors?: BaseChartFactors | null;
};

export function buildMarriageFacts(input: Input): MarriageFacts {
  const base = input.baseChartFactors ?? null;

  const strongestMarriageSignals: string[] = [];
  const d9Signals: string[] = [];
  const obstacles: string[] = [];
  const modifiers: string[] = [];

  const partnershipStyle: string[] = [];
  const commitmentStyle: string[] = [];
  const spouseQualities: string[] = [];
  const dominantMarriagePlanets: PlanetId[] = [];

  let likelyMarriagePattern: "steady" | "delayed" | "mixed" | "unconventional" = "mixed";
  let loveVsArranged: "love" | "arranged" | "mixed" = "mixed";
  let confidence = 50;

  const houseLords = base?.houseLords ?? {};
  const dominantPlanets = base?.strengths?.dominantPlanets ?? [];
  const activeHouses = base?.activeTiming?.activeNatalHouses ?? [];

  const lord7 = houseLords[7] ?? null;

  if (lord7) {
    dominantMarriagePlanets.push(lord7);
    strongestMarriageSignals.push(`7th lord ${lord7} is a core relationship driver.`);
    confidence += 8;
  }

  if (dominantPlanets.includes("Venus")) {
    dominantMarriagePlanets.push("Venus");
    partnershipStyle.push("affectionate", "bond-seeking", "relational");
    strongestMarriageSignals.push("Venus dominance increases the importance of relationship harmony and bonding.");
    confidence += 6;
  }

  if (dominantPlanets.includes("Jupiter")) {
    dominantMarriagePlanets.push("Jupiter");
    commitmentStyle.push("growth-oriented", "meaning-seeking", "advisory");
    spouseQualities.push("wise", "supportive", "guiding");
    strongestMarriageSignals.push("Jupiter adds growth, maturity, and meaning to partnership themes.");
    confidence += 5;
  }

  if (dominantPlanets.includes("Moon")) {
    dominantMarriagePlanets.push("Moon");
    partnershipStyle.push("emotionally responsive", "connection-seeking");
    spouseQualities.push("sensitive", "emotionally aware");
    strongestMarriageSignals.push("Moon increases emotional responsiveness and the need for closeness in partnership.");
    confidence += 4;
  }

  if (dominantPlanets.includes("Saturn")) {
    dominantMarriagePlanets.push("Saturn");
    commitmentStyle.push("serious", "duty-based", "long-term");
    strongestMarriageSignals.push("Saturn brings seriousness, commitment, delay, or karmic weight to marriage.");
    likelyMarriagePattern = "delayed";
    confidence += 4;
  }

  if (dominantPlanets.includes("Rahu")) {
    dominantMarriagePlanets.push("Rahu");
    modifiers.push("Rahu adds unconventional attraction, intensity, or non-traditional relationship patterns.");
    likelyMarriagePattern = likelyMarriagePattern === "delayed" ? "mixed" : "unconventional";
    loveVsArranged = "love";
  }

  if (dominantPlanets.includes("Ketu")) {
    dominantMarriagePlanets.push("Ketu");
    obstacles.push("Ketu can create detachment, uneven emotional engagement, or periods of withdrawal.");
  }

  if (activeHouses.includes(7)) {
    strongestMarriageSignals.push("Current dasha activates the 7th house, making relationship/marriage themes more relevant now.");
    confidence += 6;
  }

if (activeHouses.includes(5)) {
  modifiers.push("5th-house activation supports romance, emotional expression, or attraction themes.");
  loveVsArranged = "love";
}

  if (activeHouses.includes(2)) {
    modifiers.push("2nd-house activation supports family formation and practical commitment themes.");
    confidence += 3;
  }

  const d9 = base?.divisionalSupport?.d9;
  if (d9?.reinforcedPlanets?.length) {
    d9Signals.push(
      `D9 reinforces: ${d9.reinforcedPlanets.join(", ")}.`
    );
    confidence += 6;
  }

  if (d9?.reinforcedPlanets?.includes("Venus")) {
    d9Signals.push("D9 Venus reinforcement strengthens marriage and relational bonding themes.");
    confidence += 4;
  }

  if (d9?.reinforcedPlanets?.includes("Jupiter")) {
    d9Signals.push("D9 Jupiter reinforcement supports maturity, wisdom, and dharmic bonding in marriage.");
    confidence += 4;
  }

  if (d9?.reinforcedPlanets?.includes("Saturn")) {
    d9Signals.push("D9 Saturn reinforcement adds durability, seriousness, and sometimes delay.");
    likelyMarriagePattern = likelyMarriagePattern === "unconventional" ? "mixed" : "delayed";
    confidence += 3;
  }

  // Simple arranged/love tendency
  if (
    dominantPlanets.includes("Venus") &&
    dominantPlanets.includes("Moon") &&
    !dominantPlanets.includes("Saturn")
  ) {
    loveVsArranged = "love";
  }

  if (
    dominantPlanets.includes("Saturn") &&
    dominantPlanets.includes("Jupiter")
  ) {
    loveVsArranged = loveVsArranged === "love" ? "mixed" : "arranged";
  }

  // Clean defaults
  if (!partnershipStyle.length) {
    partnershipStyle.push("serious", "selective");
  }

  if (!commitmentStyle.length) {
    commitmentStyle.push("measured", "gradual");
  }

  if (!spouseQualities.length) {
    spouseQualities.push("practical", "responsible");
  }

  confidence = clamp(confidence, 0, 100);

  return {
    partnershipStyle: uniq(partnershipStyle).slice(0, 5),
    commitmentStyle: uniq(commitmentStyle).slice(0, 5),
    spouseQualities: uniq(spouseQualities).slice(0, 5),
    likelyMarriagePattern,
    loveVsArranged,
    dominantMarriagePlanets: uniqPlanetIds(dominantMarriagePlanets),
    strongestMarriageSignals: uniq(strongestMarriageSignals).slice(0, 6),
    d9Signals: uniq(d9Signals).slice(0, 5),
    obstacles: uniq(obstacles).slice(0, 5),
    modifiers: uniq(modifiers).slice(0, 5),
    confidence,
  };
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map((x) => String(x).trim()).filter(Boolean)));
}

function uniqPlanetIds(arr: PlanetId[]) {
  return Array.from(new Set(arr));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}