import type {
  LifeArea,
  PlanetName,
} from "../types";

import type {
  DashaActivationResult,
} from "../knowledge/dashaActivation";

import type {
  AscendantJudgement,
} from "./ascendantJudgementEngine";

export type DashaTransitMatch = {
  area: LifeArea;

  dashaScore: number;
  dashaConfirmationCount: number;

  transitImportance: number;
  transitPolarity:
    | "supportive"
    | "challenging"
    | "mixed"
    | "neutral";

  transitSource: string;

  transitPlanet?: PlanetName;
  transitHouse?: number;
  timingScore: number;

  dashaPlanets: PlanetName[];

  reasons: string[];
};
export type DashaTransitAreaSynthesis = {
  area: LifeArea;

  dashaScore: number;
  dashaConfirmationCount: number;

  strongestTransitImportance: number;
  transitConfirmationCount: number;
  transitPlanetConfirmationCount: number;
  supportiveCount: number;
  challengingCount: number;
  mixedCount: number;

  dashaPlanets: PlanetName[];

    transitSources: string[];

  transitMatches: DashaTransitMatch[];

  timingScore: number;
polarityScore: number;
timingStrength:
  | "strong"
  | "moderate"
  | "weak";

activationPolarity:
  | "supportive"
  | "challenging"
  | "mixed"
  | "neutral";
};
export type DashaTransitSynthesis = {
  matches: DashaTransitMatch[];

  areaSyntheses: DashaTransitAreaSynthesis[];

  strongestAreas: LifeArea[];
  strongestAreaDetails: {
  area: LifeArea;

  timingScore: number;

  timingStrength:
    | "strong"
    | "moderate"
    | "weak";

  activationPolarity:
    | "supportive"
    | "challenging"
    | "mixed"
    | "neutral";
}[];
  timingStrength:
  | "strong"
  | "moderate"
  | "weak";
};
function calculateTimingActivation(params: {
  dashaScore: number;
  dashaConfirmationCount: number;
  transitImportance: number;
  transitConfirmationCount: number;
}): {
  score: number;
  strength: "strong" | "moderate" | "weak";
} {
  const dashaComponent =
    Math.min(
      40,
      params.dashaScore * 3
    );

  const transitComponent =
    Math.min(
      40,
      params.transitImportance
    );

  const dashaConfirmationBonus =
    Math.min(
      10,
      Math.max(
        0,
        params.dashaConfirmationCount - 1
      ) * 5
    );

  const transitConfirmationBonus =
    Math.min(
      10,
      Math.max(
        0,
        params.transitConfirmationCount - 1
      ) * 5
    );

  const score =
    dashaComponent +
    transitComponent +
    dashaConfirmationBonus +
    transitConfirmationBonus;

  let strength:
    | "strong"
    | "moderate"
    | "weak" = "weak";

  if (score >= 70) {
    strength = "strong";
  } else if (score >= 45) {
    strength = "moderate";
  }

  return {
    score,
    strength,
  };
}
function getTransitPolarityScore(
  polarity: DashaTransitMatch["transitPolarity"]
): number {
  if (polarity === "supportive") {
    return 1;
  }

  if (polarity === "challenging") {
    return -1;
  }

  return 0;
}
function buildAreaSyntheses(
  matches: DashaTransitMatch[]
): DashaTransitAreaSynthesis[] {
  const areaMap =
    new Map<
      LifeArea,
      DashaTransitAreaSynthesis
    >();

  for (const match of matches) {
    const existing =
      areaMap.get(match.area);

    if (existing) {
      existing.strongestTransitImportance =
        Math.max(
          existing.strongestTransitImportance,
          match.transitImportance
        );
      existing.polarityScore +=
  getTransitPolarityScore(
    match.transitPolarity
  ) * match.transitImportance;
      existing.transitConfirmationCount += 1;

      if (
        match.transitPolarity === "supportive"
      ) {
        existing.supportiveCount += 1;
      }

      if (
        match.transitPolarity === "challenging"
      ) {
        existing.challengingCount += 1;
      }

      if (
        match.transitPolarity === "mixed"
      ) {
        existing.mixedCount += 1;
      }

            if (
        !existing.transitSources.includes(
          match.transitSource
        )
      ) {
        existing.transitSources.push(
          match.transitSource
        );
      }
      if (
  match.transitPlanet &&
  !existing.transitMatches.some(
    (existingMatch) =>
      existingMatch.transitPlanet ===
      match.transitPlanet
  )
) {
  existing.transitPlanetConfirmationCount += 1;
}
      existing.transitMatches.push(
        match
      );

      continue;
    }

    areaMap.set(match.area, {
      area: match.area,

      dashaScore: match.dashaScore,

      dashaConfirmationCount:
        match.dashaConfirmationCount,

      strongestTransitImportance:
        match.transitImportance,

      transitConfirmationCount: 1,
      transitPlanetConfirmationCount:
  match.transitPlanet ? 1 : 0,
      supportiveCount:
        match.transitPolarity ===
        "supportive"
          ? 1
          : 0,

      challengingCount:
        match.transitPolarity ===
        "challenging"
          ? 1
          : 0,

      mixedCount:
        match.transitPolarity === "mixed"
          ? 1
          : 0,

      dashaPlanets: [
        ...match.dashaPlanets,
      ],

            transitSources: [
        match.transitSource,
      ],

      transitMatches: [
        match,
      ],

      timingScore: 0,
timingStrength: "weak",
  polarityScore:
    getTransitPolarityScore(
      match.transitPolarity
    ) * match.transitImportance,
activationPolarity: "neutral",
    });
  }

  const areaSyntheses =
  Array.from(
    areaMap.values()
  );

for (const synthesis of areaSyntheses) {
  const timing =
    calculateTimingActivation({
      dashaScore:
        synthesis.dashaScore,

      dashaConfirmationCount:
        synthesis.dashaConfirmationCount,

      transitImportance:
        synthesis.strongestTransitImportance,

      transitConfirmationCount:
  synthesis.transitPlanetConfirmationCount,
    });

  synthesis.timingScore =
    timing.score;

  synthesis.timingStrength =
    timing.strength;
    if (synthesis.polarityScore >= 15) {
  synthesis.activationPolarity =
    "supportive";
} else if (
  synthesis.polarityScore <= -15
) {
  synthesis.activationPolarity =
    "challenging";
} else if (
  synthesis.supportiveCount > 0 ||
  synthesis.challengingCount > 0 ||
  synthesis.mixedCount > 0
) {
  synthesis.activationPolarity =
    "mixed";
} else {
  synthesis.activationPolarity =
    "neutral";
}
}

return areaSyntheses.sort(
  (a, b) =>
    b.timingScore -
    a.timingScore
);
}
export function synthesizeDashaTransit(
  dasha: DashaActivationResult,
  judgement: AscendantJudgement
): DashaTransitSynthesis {
  const matches: DashaTransitMatch[] = [];

for (
  const dashaArea of
    dasha.periodAreaActivations
) {
  const transitSignals =
    judgement.rankedSignals.filter(
      (signal) =>
        signal.area === dashaArea.area
    );

  for (const signal of transitSignals) {
    matches.push({
      area: dashaArea.area,

      dashaScore:
        dashaArea.score,

      dashaConfirmationCount:
        dashaArea.confirmationCount,

      transitImportance:
        signal.importance,

      transitPolarity:
        signal.polarity,

            transitSource:
        signal.source,

      transitPlanet:
        signal.planet,
      transitHouse:
  signal.transitHouse,
      timingScore: 0,

      dashaPlanets:
        dashaArea.contributors.map(
          (contributor) =>
            contributor.planet
        ),

      reasons: [
        `${dashaArea.area} is activated by the current dasha period with a score of ${dashaArea.score}.`,

        `${dashaArea.area} is also activated by the current transit through ${signal.source}.`,

        `The transit signal has importance ${signal.importance} and is ${signal.polarity}.`,
      ],
    });
  }
}
const areaSyntheses =
  buildAreaSyntheses(matches);

if (process.env.NODE_ENV !== "production") {
  console.log(
    "[TIMING_COMPONENTS]",
    JSON.stringify(
      areaSyntheses.map((area) => ({
        area: area.area,
        dashaScore: area.dashaScore,
        dashaConfirmationCount:
          area.dashaConfirmationCount,
        strongestTransitImportance:
          area.strongestTransitImportance,
        transitPlanetConfirmationCount:
          area.transitPlanetConfirmationCount,
        transitSignals: area.transitMatches.map(
          (match) => ({
            planet: match.transitPlanet,
            house: match.transitHouse,
            source: match.transitSource,
            importance: match.transitImportance,
            polarity: match.transitPolarity,
          })
        ),
        timingScore: area.timingScore,
      })),
      null,
      2
    )
  );
}
  const strongestAreas =
  areaSyntheses
    .filter(
      (synthesis) =>
        synthesis.timingStrength ===
        "strong"
    )
    .map(
      (synthesis) =>
        synthesis.area
    );
const strongestAreaDetails =
  areaSyntheses
    .filter(
      (synthesis) =>
        synthesis.timingStrength ===
        "strong"
    )
    .map((synthesis) => ({
      area: synthesis.area,

      timingScore:
        synthesis.timingScore,

      timingStrength:
        synthesis.timingStrength,

      activationPolarity:
        synthesis.activationPolarity,
    }));
let timingStrength:
  DashaTransitSynthesis["timingStrength"] =
    "weak";

if (
  areaSyntheses.some(
    (synthesis) =>
      synthesis.timingStrength ===
      "strong"
  )
) {
  timingStrength = "strong";
} else if (
  areaSyntheses.some(
    (synthesis) =>
      synthesis.timingStrength ===
      "moderate"
  )
) {
  timingStrength = "moderate";
}
return {
  matches,
  areaSyntheses,
  strongestAreas,
  strongestAreaDetails,
  timingStrength,
};
}