import type {
  EventActivation,
  CandidateEventTheme,
} from "./eventActivationEngine";

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


export function buildDailyPriorities(
  activations: EventActivation[]
): DailyPriorityResult {
  const priorities =
  activations
    .filter(
      (activation) =>
        activation.candidateEvents.length > 0
    )
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

const bestManifestation =
  hasClearManifestation
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

const rawPriorityScore =
  activation.timingScore +
  manifestationBonus +
  moonConfirmationBonus;

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