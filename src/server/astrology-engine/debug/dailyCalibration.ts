import type {
  EventActivation,
} from "../judgement/eventActivationEngine";
import type {
  DailyPriorityResult,
} from "../judgement/dailyPriorityEngine";
type CalibrationMoonContext = {
  sign: string | null;
  nakshatra: string | null;
  pada: number | null;
};
type CalibrationCandidate = {
  id: string;
  label: string;

  confidenceScore: number;

  discriminatorScore: number;
  transitDiscriminatorScore: number;
  combinedDiscriminatorScore: number;

  discriminatorConfidence:
    | number
    | null;

  manifestationScore: number;
};

type CalibrationDecision =
  | "SELECTED"
  | "AMBIGUOUS"
  | "NO_STRUCTURAL_CANDIDATE";

type CalibrationArea = {
  area: string;

  timingScore: number;
  strength: string;
  polarity: string;

  activatedHouses: number[];

  dashaPlanets: string[];
  transitPlanets: string[];
  edgeFlags: string[];
  transitMatchCount: number;
  transitPlanetCount: number;
  transitSourceCount: number;
  transitSources: string[];

  candidates:
    CalibrationCandidate[];

  topCandidate:
    string | null;

  secondCandidate:
    string | null;

  manifestationGap:
    number | null;

  decision:
    CalibrationDecision;

    priorityRole:
  | "PRIMARY"
  | "SECONDARY"
  | "SUPPRESSED";

priorityScore:
  number | null;
};

export function buildDailyCalibration(
  activations: EventActivation[],
  priorities?: DailyPriorityResult,
  moon?: CalibrationMoonContext
): CalibrationArea[] {
  return activations.map(
    (activation) => {
      const matchingPriority =
  priorities?.priorities.find(
    (priority) =>
      priority.area ===
      activation.area
  ) ?? null;

const priorityRole:
  CalibrationArea["priorityRole"] =
  matchingPriority?.role ===
  "primary"
    ? "PRIMARY"
    : matchingPriority?.role ===
        "secondary"
      ? "SECONDARY"
      : "SUPPRESSED";
      const candidates =
        activation.candidateEvents.map(
          (candidate) => ({
            id: candidate.id,

            label:
              candidate.label,

            confidenceScore:
              candidate.confidenceScore,

            discriminatorScore:
              candidate.discriminatorScore,

            transitDiscriminatorScore:
              candidate.transitDiscriminatorScore,

            combinedDiscriminatorScore:
              candidate.combinedDiscriminatorScore,

            discriminatorConfidence:
              candidate.discriminatorConfidence,

            manifestationScore:
              candidate.manifestationScore,
          })
        );

      const topCandidate =
        candidates[0] ?? null;

      const secondCandidate =
        candidates[1] ?? null;

      const manifestationGap =
        topCandidate &&
        secondCandidate
          ? topCandidate.manifestationScore -
            secondCandidate.manifestationScore
          : topCandidate
            ? topCandidate.manifestationScore
            : null;

      const decision: CalibrationDecision =
  !topCandidate
    ? "NO_STRUCTURAL_CANDIDATE"
    : topCandidate.manifestationScore < 50 ||
        (secondCandidate !== null &&
          manifestationGap !== null &&
          manifestationGap < 5)
      ? "AMBIGUOUS"
      : "SELECTED";

      const transitPlanets =
        Array.from(
          new Set(
            activation.transitMatches
              .map(
                (match) =>
                  match.transitPlanet
              )
              .filter(
                (
                  planet
                ): planet is NonNullable<
                  typeof planet
                > =>
                  Boolean(
                    planet
                  )
              )
          )
        );
      const edgeFlags: string[] = [];

if (activation.timingScore < 45) {
  edgeFlags.push("WEAK_TIMING");
}

if (
  activation.candidateEvents.length === 0
) {
  edgeFlags.push(
    "NO_STRUCTURAL_CANDIDATE"
  );
}

if (
  activation.candidateEvents.length >= 2
) {
  const gap =
    activation.candidateEvents[0]
      .manifestationScore -
    activation.candidateEvents[1]
      .manifestationScore;

  if (gap < 5) {
    edgeFlags.push(
      "AMBIGUOUS_MANIFESTATION"
    );
  }
}

if (
  priorityRole === "PRIMARY" &&
  activation.polarity === "challenging"
) {
  edgeFlags.push(
    "CHALLENGING_PRIMARY"
  );
}

if (
  priorityRole === "SUPPRESSED" &&
  activation.timingScore >= 60
) {
  edgeFlags.push(
    "STRONG_BUT_SUPPRESSED"
  );
}
      const transitSources =
        Array.from(
          new Set(
            activation.transitMatches.map(
              (match) =>
                match.transitSource
            )
          )
        );

      return {
        area:
          activation.area,

        timingScore:
          activation.timingScore,

        strength:
          activation.strength,

        polarity:
          activation.polarity,

        activatedHouses:
          activation.activatedHouses,

        dashaPlanets:
          activation.dashaPlanets,

        transitPlanets,
        edgeFlags,

        transitMatchCount:
          activation.transitMatches.length,
        transitPlanetCount:
  transitPlanets.length,
        transitSourceCount:
          transitSources.length,

        transitSources,

        candidates,

        topCandidate:
          topCandidate?.id ??
          null,

        secondCandidate:
          secondCandidate?.id ??
          null,

        manifestationGap,

        decision,
        priorityRole,

priorityScore:
  matchingPriority
    ?.dailyPriorityScore ??
  null,
      };
    }
  );
}

export function logDailyCalibration(
  activations: EventActivation[],
  priorities?: DailyPriorityResult,
  moon?: CalibrationMoonContext
): void {
  const calibration =
    buildDailyCalibration(
      activations,
      priorities
    );
console.log(
  "[DAILY CALIBRATION]",
  JSON.stringify(
    calibration
      .filter((area) => area.area === "mind")
      .map((area) => ({
        area: area.area,
        decision: area.decision,
        manifestationGap: area.manifestationGap,
        candidates: area.candidates,
      })),
    null,
    2
  )
);
  

  if (moon) {
    
  }

  for (
    const area of calibration
  ) {
    

    

    

    

    
  if (area.edgeFlags.length > 0) {
  
}
  

    

    if (
      !area.candidates.length
    ) {
      

      



continue;
    }

    area.candidates.forEach(
      (
        candidate,
        index
      ) => {
        
      }
    );

    

    
    
  }
const reportEdgeFlags: string[] = [];

const primaryPriority =
  priorities?.primary ?? null;

const secondaryPriorities =
  priorities?.secondary ?? [];

const visibleThemeCount =
  (primaryPriority ? 1 : 0) +
  secondaryPriorities.length;

if (!primaryPriority) {
  reportEdgeFlags.push(
    "NO_PRIMARY"
  );
}

if (
  primaryPriority &&
  visibleThemeCount === 1
) {
  reportEdgeFlags.push(
    "ONE_THEME_ONLY"
  );
}

if (
  primaryPriority &&
  secondaryPriorities.length > 0
) {
  const firstSecondary =
    secondaryPriorities[0];

  const gap =
    primaryPriority.dailyPriorityScore -
    firstSecondary.dailyPriorityScore;

  if (gap <= 3) {
    reportEdgeFlags.push(
      "PRIMARY_SECONDARY_NEAR_TIE"
    );
  }
}

if (
  primaryPriority?.polarity ===
    "challenging" &&
  secondaryPriorities.some(
    (item) =>
      item.polarity ===
      "supportive"
  )
) {
  reportEdgeFlags.push(
    "CHALLENGING_PRIMARY_WITH_SUPPORT"
  );
}

if (
  secondaryPriorities.length === 2
) {
  reportEdgeFlags.push(
    "SECONDARY_CAP_REACHED"
  );
}



if (reportEdgeFlags.length > 0) {
  
} else {
  
}
  
}