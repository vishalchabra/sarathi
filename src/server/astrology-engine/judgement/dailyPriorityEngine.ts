import {
  resolveEventConvergence,
} from "./eventConvergenceResolver";

import type {
  EventActivation,
  CandidateEventTheme,
} from "./eventActivationEngine";
import { diagnoseEventConfirmation } from "./eventConfirmationDiagnostic";
export type DailyPriority = {
  area: EventActivation["area"];

  polarity: EventActivation["polarity"];

  areaTimingScore: number;

  bestManifestation:
    | CandidateEventTheme
    | null;
  candidateEvents: CandidateEventTheme[];
  manifestationScore: number;

  dailyPriorityScore: number;

  role:
  | "primary"
  | "secondary"
  | "background";
};

export type DailyPriorityResult = {
  priorities: DailyPriority[];

  primary: DailyPriority | null;

  secondary: DailyPriority[];

  background: DailyPriority[];
};

export type MoonDailyPriorityInput = {
  primaryAreas: EventActivation["area"][];
  reinforcedAreas: EventActivation["area"][];
  singleSourceAreas: EventActivation["area"][];
  transitHouseConfirmedAreas?: EventActivation["area"][];
};
export type MoonDailyThemeResult = {
  primaryAreas: EventActivation["area"][];
  reinforcedAreas: EventActivation["area"][];
  backgroundAreas: EventActivation["area"][];
  leadingAreas: EventActivation["area"][];
  hasCoPrimaryAreas: boolean;
};
export function buildMoonDailyThemes(
  moonInput: MoonDailyPriorityInput
): MoonDailyThemeResult {
  const primaryAreas = [...new Set(moonInput.primaryAreas)];

  const reinforcedAreas = [
    ...new Set(moonInput.reinforcedAreas),
  ].filter((area) => !primaryAreas.includes(area));

  const backgroundAreas = [
    ...new Set(moonInput.singleSourceAreas),
  ].filter(
    (area) =>
      !primaryAreas.includes(area) &&
      !reinforcedAreas.includes(area)
  );
  const confirmedPrimaryAreas = primaryAreas.filter((area) =>
    moonInput.transitHouseConfirmedAreas?.includes(area)
  );

  const leadingAreas =
    confirmedPrimaryAreas.length > 0
      ? confirmedPrimaryAreas
      : primaryAreas;
  return {
    primaryAreas,
    leadingAreas,
    reinforcedAreas,
    backgroundAreas,
    hasCoPrimaryAreas: primaryAreas.length > 1,
  };
}
export function buildDailyPriorities(
  activations: EventActivation[],
  moonInput?: MoonDailyPriorityInput
): DailyPriorityResult {
  if (process.env.NODE_ENV === "development") {
  console.log(
    "[DAILY PRIORITY MOON INPUT]",
    JSON.stringify(moonInput ?? null)
  );
}
const moonAreaOrder = [
  ...new Set([
    ...(moonInput?.primaryAreas ?? []),
    ...(moonInput?.reinforcedAreas ?? []),
    ...(moonInput?.singleSourceAreas ?? []),
  ]),
];

if (process.env.NODE_ENV === "development") {
  console.log(
    "[MOON FIRST AREA ORDER]",
    JSON.stringify(moonAreaOrder)
  );
}
const moonPrimaryTie =
  (moonInput?.primaryAreas.length ?? 0) > 1;

if (process.env.NODE_ENV === "development") {
  console.log(
    "[MOON PRIMARY TIE]",
    JSON.stringify({
      tied: moonPrimaryTie,
      areas: moonInput?.primaryAreas ?? [],
      resolution: moonPrimaryTie
        ? "CO_PRIMARY_AREAS"
        : "SINGLE_OR_NO_PRIMARY",
    })
  );
}
  const priorities =
  activations
    .map((activation) => {
        const topCandidate =
  activation.candidateEvents[0] ??
  null;

const secondCandidate =
  activation.candidateEvents[1] ??
  null;

const manifestationGap =
  topCandidate && secondCandidate
    ? topCandidate.manifestationScore -
      secondCandidate.manifestationScore
    : topCandidate
      ? topCandidate.manifestationScore
      : 0;

const hasClearManifestation =
  topCandidate !== null &&
  topCandidate.manifestationScore >= 50 &&
  (
    !secondCandidate ||
    manifestationGap >= 5
  );

const confirmation = topCandidate
  ? diagnoseEventConfirmation(
      topCandidate,
      activation.candidateEvents.slice(1),
      activation.rankedHouses
    )
  : null;

const bestManifestation =
  hasClearManifestation &&
  confirmation?.status === "EVENT_SUPPORTED" &&
  topCandidate?.hasMoonSambandhaConfirmation === true
    ? topCandidate
    : null;
 
if (process.env.NODE_ENV === "development") {
  const candidateSelectionAudit =
    activation.candidateEvents.map((candidate) => {
      const competitors =
        activation.candidateEvents.filter(
          (other) => other.id !== candidate.id
        );

      const diagnostic = diagnoseEventConfirmation(
        candidate,
        competitors,
        activation.rankedHouses
      );

      const moonEvidence = candidate.moonEvidence ?? [];

      const eventSpecificMoonEvidence =
        moonEvidence.filter(
          (evidence) =>
            evidence.matchesEventDiscriminator &&
            evidence.matchedPrimaryHouses.length > 0
        );

      const directDashaMoonEvidence =
        eventSpecificMoonEvidence.filter(
          (evidence) => evidence.connectsDashaDirectly
        );

      const independentPrimaryTransits =
        candidate.matchedEventHouseTransits.filter(
          (transit) =>
            transit.houseRole === "primary" &&
            transit.planet !== "Moon" &&
            !transit.source.startsWith("moon_")
        );

      const rejectionReasons: string[] = [];

      if (candidate.manifestationScore < 50) {
        rejectionReasons.push("BELOW_SCORE_THRESHOLD");
      }

      if (diagnostic.status !== "EVENT_SUPPORTED") {
        rejectionReasons.push("EVENT_NOT_SUPPORTED");
      }

      if (candidate.hasMoonSambandhaConfirmation !== true) {
        rejectionReasons.push("NO_EVENT_SPECIFIC_MOON_CONFIRMATION");
      }

      if (
        diagnostic.competingEventGap !== null &&
        diagnostic.competingEventGap < 5
      ) {
        rejectionReasons.push("INSUFFICIENT_COMPETITOR_SEPARATION");
      }

      return {
        eventId: candidate.id,
        manifestationScore: candidate.manifestationScore,
        confirmationStatus: diagnostic.status,
        competingEventGap: diagnostic.competingEventGap,
        primaryHouses: diagnostic.primaryHouses,
        supportingHouses: diagnostic.supportingHouses,
        overlappingDiscriminators:
          diagnostic.overlappingDiscriminatorPlanets,
        moonConfirmed:
          candidate.hasMoonSambandhaConfirmation === true,
        eventSpecificMoonSources:
          eventSpecificMoonEvidence.map((evidence) => ({
            source: evidence.source,
            planet: evidence.planet,
            houses: evidence.matchedPrimaryHouses,
          })),
        directDashaMoonSources:
          directDashaMoonEvidence.map((evidence) => ({
            source: evidence.source,
            planet: evidence.planet,
          })),
        independentPrimaryTransits:
          independentPrimaryTransits.map((transit) => ({
            planet: transit.planet,
            house: transit.house,
            source: transit.source,
          })),
        eligibleUnderCurrentRules:
          rejectionReasons.length === 0,
        rejectionReasons,
        selected:
          bestManifestation?.id === candidate.id,
      };
    });

  console.log(
    "[DAILY CANDIDATE SELECTION AUDIT]",
    JSON.stringify({
      area: activation.area,
      timingScore: activation.timingScore,
      selectedManifestation:
        bestManifestation?.id ?? null,
      candidates: candidateSelectionAudit,
    })
  );
}

if (process.env.NODE_ENV === "development") {
  const convergenceCandidates = activation.candidateEvents.map(
    (candidate) => {
      const competitors = activation.candidateEvents.filter(
        (other) => other.id !== candidate.id
      );

      const existingConfirmation = diagnoseEventConfirmation(
        candidate,
        competitors,
        activation.rankedHouses
      );

      const convergence = resolveEventConvergence(candidate);

      const hasAlternativePlanetaryPathway =
        convergence.functionalLordship.supported ||
        convergence.sambandha.supported;

      const hasCompetitorSeparation =
        existingConfirmation.competingEventGap == null ||
        existingConfirmation.competingEventGap >= 5;

      const hasExistingHouseCoverage =
        candidate.matchedPrimaryHouses.length > 0 &&
        (
          candidate.matchedSupportingHouses.length > 0 ||
          new Set([
            ...candidate.matchedPrimaryHouses,
            ...candidate.matchedSupportingHouses,
          ]).size >= 2
        );

      const hasCombinedHouseCoverage =
        hasExistingHouseCoverage ||
        convergence.houseConvergence.supported;

      const alternativePathwayReview =
        !convergence.exactPlanetary.supported &&
        hasAlternativePlanetaryPathway;

      const shadowReviewCandidate =
        existingConfirmation.status !== "EVENT_SUPPORTED" &&
        candidate.manifestationScore >= 50 &&
        hasCompetitorSeparation &&
        hasCombinedHouseCoverage &&
        convergence.moonConfirmation.supported &&
        convergence.moonConfirmation.directDashaConnection &&
        convergence.houseConvergence.independentTransitPlanets.length > 0 &&
        (
          convergence.exactPlanetary.supported ||
          hasAlternativePlanetaryPathway
        );

      return {
        eventId: candidate.id,
        manifestationScore: candidate.manifestationScore,
        existingStatus: existingConfirmation.status,
        competingEventGap:
          existingConfirmation.competingEventGap,

        matchedPrimaryHouses:
          candidate.matchedPrimaryHouses,

        matchedSupportingHouses:
          candidate.matchedSupportingHouses,

        hasExistingHouseCoverage,
        hasCombinedHouseCoverage,
        alternativePathwayReview,
        shadowReviewCandidate,

        retainedFunctionalEvidenceCount:
          candidate.eventFunctionalHouseEvidence?.length ?? 0,

        retainedSambandhaEvidenceCount:
          candidate.eventSambandhaEvidence?.length ?? 0,

        completeDashaComparison: (() => {
          const originalEvidence =
            candidate.eventFunctionalHouseEvidence ?? [];

          const completeEvidence =
            candidate.eventCompleteDashaEvidence ?? [];

          const originalKeys = new Set(
            originalEvidence.map(
              (e) => `${e.planet}:${e.house}:${e.source}`
            )
          );

          const uniqueCompleteEvidence = [
            ...new Map(
              completeEvidence.map((e) => [
                `${e.planet}:${e.house}:${e.source}`,
                e,
              ])
            ).values(),
          ];

          const recoveredEvidence =
            uniqueCompleteEvidence.filter(
              (e) =>
                !originalKeys.has(
                  `${e.planet}:${e.house}:${e.source}`
                )
            );

          const directEvidence =
            uniqueCompleteEvidence.filter(
              (e) => e.activationClass === "direct"
            );

          const recoveredDirectEvidence =
            recoveredEvidence.filter(
              (e) => e.activationClass === "direct"
            );

          const originalHouses = [
            ...new Set(
              originalEvidence.map((e) => e.house)
            ),
          ].sort((a, b) => a - b);

          const completeHouses = [
            ...new Set(
              uniqueCompleteEvidence.map((e) => e.house)
            ),
          ].sort((a, b) => a - b);

          const directPrimaryHouses = [
            ...new Set(
              directEvidence
                .filter((e) => e.houseRole === "primary")
                .map((e) => e.house)
            ),
          ].sort((a, b) => a - b);

          const directSupportingHouses = [
            ...new Set(
              directEvidence
                .filter((e) => e.houseRole === "supporting")
                .map((e) => e.house)
            ),
          ].sort((a, b) => a - b);

          const recoveredPrimaryHouses = [
            ...new Set(
              recoveredDirectEvidence
                .filter(
                  (e) =>
                    e.houseRole === "primary" &&
                    !originalHouses.includes(e.house)
                )
                .map((e) => e.house)
            ),
          ].sort((a, b) => a - b);

          const recoveredSupportingHouses = [
            ...new Set(
              recoveredDirectEvidence
                .filter(
                  (e) =>
                    e.houseRole === "supporting" &&
                    !originalHouses.includes(e.house)
                )
                .map((e) => e.house)
            ),
          ].sort((a, b) => a - b);

          const independentPrimaryTransits =
            candidate.matchedEventHouseTransits.filter(
              (t) =>
                t.houseRole === "primary" &&
                t.planet !== "Moon" &&
                !t.source.startsWith("moon_")
            );

          const functionalMatches = [
            ...new Map(
              directEvidence
                .filter(
                  (e) =>
                    e.source === "lordship" &&
                    e.houseRole === "primary" &&
                    independentPrimaryTransits.some(
                      (t) =>
                        t.planet === e.planet &&
                        t.house === e.house
                    )
                )
                .map((e) => [
                  `${e.planet}:${e.house}`,
                  {
                    planet: e.planet,
                    house: e.house,
                    dashaLevels: e.dashaLevels,
                    dashaStrength: e.dashaStrength,
                  },
                ])
            ).values(),
          ];

          const verifiedSambandhaMatches =
            convergence.sambandha.connections.filter(
              (match) => {
                const connection =
                  candidate.eventSambandhaEvidence?.find(
                    (e) =>
                      String(e.connectionId) ===
                      match.connectionId
                  );

                if (!connection) {
                  return false;
                }

                const activeIndex =
                  connection.planets.findIndex(
                    (planet) =>
                      planet === match.activePlanet
                  );

                const transitIndex =
                  connection.planets.findIndex(
                    (planet) =>
                      planet === match.transitPlanet
                  );

                if (activeIndex < 0 || transitIndex < 0) {
                  return false;
                }

                const activeHouses =
                  activeIndex === 0
                    ? connection.firstPlanetHouses
                    : connection.secondPlanetHouses;

                const transitHouses =
                  transitIndex === 0
                    ? connection.firstPlanetHouses
                    : connection.secondPlanetHouses;

                return independentPrimaryTransits.some(
                  (t) =>
                    t.planet === match.transitPlanet &&
                    transitHouses.includes(t.house) &&
                    directEvidence.some(
                      (e) =>
                        e.planet === match.activePlanet &&
                        activeHouses.includes(e.house) &&
                        e.house !== t.house
                    )
                );
              }
            );

          const uniqueDirectPlanets = [
            ...new Set(
              directEvidence.map((e) => e.planet)
            ),
          ];

          return {
            evidenceAvailable:
              candidate.eventCompleteDashaEvidence !== undefined,

            originalEvidenceCount:
              originalEvidence.length,

            completeEvidenceCount:
              completeEvidence.length,

            uniqueCompleteEvidenceCount:
              uniqueCompleteEvidence.length,

            duplicateEvidenceCount:
              completeEvidence.length -
              uniqueCompleteEvidence.length,

            recoveredEvidenceCount:
              recoveredEvidence.length,

            recoveredDirectEvidenceCount:
              recoveredDirectEvidence.length,

            originalHouses,
            completeHouses,

            additionalHouses:
              completeHouses.filter(
                (house) => !originalHouses.includes(house)
              ),

            directPrimaryHouses,
            directSupportingHouses,
            recoveredPrimaryHouses,
            recoveredSupportingHouses,
            uniqueDirectPlanets,

            hasCompleteDirectHouseCoverage:
              directPrimaryHouses.length > 0 &&
              new Set([
                ...directPrimaryHouses,
                ...directSupportingHouses,
              ]).size >= 2,

            overlappingDispositorCount:
              uniqueCompleteEvidence.filter(
                (e) =>
                  e.source === "dispositor" &&
                  e.overlapsWithActiveDispositor
              ).length,

            natalAspectEvidenceCount:
              uniqueCompleteEvidence.filter(
                (e) => e.source === "natal_aspect"
              ).length,

            functionalMatches,

            hasNewFunctionalPathway:
              !convergence.functionalLordship.supported &&
              functionalMatches.length > 0,

            verifiedSambandhaMatches,

            hasVerifiedSambandha:
              verifiedSambandhaMatches.length > 0,

            recoveredEvidence,
            recoveredDirectEvidence,
            completeEvidence: uniqueCompleteEvidence,
          };
        })(),
        functionalEvidence:
          candidate.eventFunctionalHouseEvidence ?? [],

        sambandhaEvidence:
          candidate.eventSambandhaEvidence ?? [],

        transitEvidence:
          candidate.matchedEventHouseTransits,

        moonEvidence:
          candidate.moonEvidence ?? [],

        convergence,

        currentlySelected:
          bestManifestation?.id === candidate.id,
      };
    }
  );

  console.log(
    "[EVENT CONVERGENCE SHADOW]",
    JSON.stringify({
      area: activation.area,
      timingScore: activation.timingScore,
      selectedManifestation:
        bestManifestation?.id ?? null,
      candidates: convergenceCandidates,
    })
  );
}

const manifestationScore =
  topCandidate
    ?.manifestationScore ?? 0;
        const manifestationBonus =
  bestManifestation
    ? Math.min(
        10,
        Math.max(
          0,
          bestManifestation.manifestationScore - 50
        )
      )
    : 0;

const moonConfirmationBonus =
  bestManifestation?.hasMoonSambandhaConfirmation
    ? 2
    : 0;

const moonDailyEmphasisBonus =
  moonInput?.primaryAreas.includes(activation.area)
    ? 15
    : moonInput?.reinforcedAreas.includes(activation.area)
      ? 5
      : 0;

const rawPriorityScore =
  activation.timingScore +
  manifestationBonus +
  moonConfirmationBonus +
  moonDailyEmphasisBonus;

const dailyPriorityScore =
  Math.min(100, rawPriorityScore);
        const priority: DailyPriority = {
          candidateEvents: activation.candidateEvents,
  area: activation.area,

polarity: activation.polarity,

areaTimingScore:
  activation.timingScore,

  bestManifestation,

  manifestationScore,

  dailyPriorityScore,

  role: "background",
};

return priority;
      })
     .sort(
  (a, b) =>
    b.dailyPriorityScore - a.dailyPriorityScore
);
priorities.forEach((priority, index) => {
  if (index === 0) {
    priority.role = "primary";
    return;
  }

  if (priority.dailyPriorityScore >= 60) {
    priority.role = "secondary";
    return;
  }

  priority.role = "background";
});
  const primary =
    priorities[0] ?? null;

  const secondary =
  priorities
    .filter(
      (priority) =>
        priority.role === "secondary"
    )
    .slice(0, 2);

const secondarySet =
  new Set(secondary);

const background =
  priorities.filter(
    (priority) =>
      priority.role === "background" ||
      (
        priority.role === "secondary" &&
        !secondarySet.has(priority)
      )
  );
for (const priority of background) {
  if (priority.role === "secondary") {
    priority.role = "background";
  }
}
  return {
    priorities,
    primary,
    secondary,
    background,
  };
}