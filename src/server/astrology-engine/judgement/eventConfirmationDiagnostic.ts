import type { CandidateEventTheme } from "./eventActivationEngine";

export type EventConfirmationStatus =
  | "AREA_CONFIRMED"
  | "EVENT_SUPPORTED"
  | "EVENT_UNRESOLVED";

export type EventConfirmationDiagnostic = {
  eventId: CandidateEventTheme["id"];
  status: EventConfirmationStatus;
  manifestationScore: number;
  primaryHouses: number[];
  supportingHouses: number[];
  evidenceHouses: number[];
  natalDiscriminatorPlanets: string[];
  transitDiscriminatorPlanets: string[];
  overlappingDiscriminatorPlanets: string[];
  competingEventGap: number | null;
  reasons: string[];
};

export function diagnoseEventConfirmation(
  candidate: CandidateEventTheme,
  competitors: readonly CandidateEventTheme[]
): EventConfirmationDiagnostic {
  const primaryHouses = [...candidate.matchedPrimaryHouses];
  const supportingHouses = [...candidate.matchedSupportingHouses];

  const evidenceHouses = [
    ...new Set([...primaryHouses, ...supportingHouses]),
  ];

  const natalDiscriminatorPlanets = [
    ...new Set(
      candidate.matchedDiscriminatorEvidence.map(
        (evidence) => evidence.planet
      )
    ),
  ];

  const transitDiscriminatorPlanets = [
    ...new Set(
      candidate.matchedTransitDiscriminatorEvidence.map(
        (evidence) => evidence.planet
      )
    ),
  ];

  const overlappingDiscriminatorPlanets =
    natalDiscriminatorPlanets.filter((planet) =>
      transitDiscriminatorPlanets.includes(planet)
    );

  const nextHighestScore = competitors
    .filter((event) => event.id !== candidate.id)
    .reduce<number | null>(
      (highest, event) =>
        highest === null
          ? event.manifestationScore
          : Math.max(highest, event.manifestationScore),
      null
    );

  const competingEventGap =
    nextHighestScore === null
      ? null
      : candidate.manifestationScore - nextHighestScore;

  const reasons: string[] = [];

  if (evidenceHouses.length <= 1) {
    reasons.push("EVIDENCE_CONCENTRATED_IN_ONE_HOUSE");
  }

  if (supportingHouses.length === 0) {
    reasons.push("NO_SUPPORTING_HOUSE_ACTIVATION");
  }

  if (overlappingDiscriminatorPlanets.length > 0) {
    reasons.push("NATAL_TRANSIT_DISCRIMINATOR_OVERLAP");
  }

  if (competingEventGap !== null && competingEventGap < 5) {
    reasons.push("WEAK_SEPARATION_FROM_COMPETITORS");
  }

  // Diagnostic classifications are provisional.
  // They are not calibrated probabilities.
  let status: EventConfirmationStatus = "AREA_CONFIRMED";

  if (primaryHouses.length === 0) {
    status = "EVENT_UNRESOLVED";
    reasons.push("NO_PRIMARY_HOUSE_ACTIVATION");
  } else if (
   (
  supportingHouses.length > 0 ||
  evidenceHouses.length >= 2
) &&
natalDiscriminatorPlanets.length > 0 &&
transitDiscriminatorPlanets.length > 0 &&
    (competingEventGap === null || competingEventGap >= 5)
  ) {
    status = "EVENT_SUPPORTED";
  } else if (
    competingEventGap !== null &&
    competingEventGap < 5
  ) {
    status = "EVENT_UNRESOLVED";
  }

  return {
    eventId: candidate.id,
    status,
    manifestationScore: candidate.manifestationScore,
    primaryHouses,
    supportingHouses,
    evidenceHouses,
    natalDiscriminatorPlanets,
    transitDiscriminatorPlanets,
    overlappingDiscriminatorPlanets,
    competingEventGap,
    reasons,
  };
}