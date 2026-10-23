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