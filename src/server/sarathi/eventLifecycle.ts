export type EventStage =
  | "preparation"
  | "opportunity"
  | "activation"
  | "conversion"
  | "completion"
  | "stabilization";

export type EventLifecycle = {
  event: string;

  promised: boolean;

  currentStage: EventStage;

  opportunityWindow: {
    start: string | null;
    end: string | null;
    confidence: string | null;
  } | null;

  practicalWindow: {
    start: string | null;
    end: string | null;
    confidence: string | null;
  } | null;

  activationWindow: {
    start: string | null;
    end: string | null;
    peak: string | null;
    confidence: string | null;
  } | null;

  completionWindow: {
    start: string | null;
    end: string | null;
    confidence: string | null;
  } | null;
  
  overallConfidence: string | null;
  confidenceScore: number | null;
  explanation: string | null;

  recommendedAction: string | null;
};

export function buildEventLifecycle(
  astroBundle: any,
  timingHierarchy?: any
): EventLifecycle {
  const selectedWindow =
    astroBundle?.selectedTimingWindow ??
    astroBundle?.bestAvailableWindow ??
    null;

  const event =
    astroBundle?.eventType ??
    astroBundle?.careerEventType ??
    astroBundle?.topic ??
    "generic";

  const hierarchyStage =
    timingHierarchy?.stage ?? null;

  const currentStage: EventStage =
    hierarchyStage === "opportunity" ||
    hierarchyStage === "activation" ||
    hierarchyStage === "conversion" ||
    hierarchyStage === "completion" ||
    hierarchyStage === "stabilization"
      ? hierarchyStage
      : "preparation";

  const promised =
    typeof astroBundle?.promiseLayer?.promised === "boolean"
      ? astroBundle.promiseLayer.promised
      : Boolean(
          astroBundle?.promiseLayer ||
          astroBundle?.winningEvidence ||
          timingHierarchy?.broaderWindow ||
          timingHierarchy?.practicalWindow ||
          selectedWindow
        );

  const opportunityWindow =
    timingHierarchy?.broaderWindow
      ? {
          start:
            timingHierarchy.broaderWindow.start ??
            null,

          end:
            timingHierarchy.broaderWindow.end ??
            null,

          confidence:
            timingHierarchy.broaderWindow.confidence ??
            null,
        }
      : null;

  const practicalWindow =
    timingHierarchy?.practicalWindow
      ? {
          start:
            timingHierarchy.practicalWindow.start ??
            null,

          end:
            timingHierarchy.practicalWindow.end ??
            null,

          confidence:
            timingHierarchy.practicalWindow.confidence ??
            null,
        }
      : null;

  const activationWindow =
    timingHierarchy?.activationWindow
      ? {
          start:
            timingHierarchy.activationWindow.start ??
            null,

          end:
            timingHierarchy.activationWindow.end ??
            null,

          peak:
            timingHierarchy.activationWindow.peak ??
            timingHierarchy.activationWindow.start ??
            null,

          confidence:
            timingHierarchy.activationWindow.confidence ??
            null,
        }
      : null;

  return {
    event,

    promised,

    currentStage,

    opportunityWindow,

    practicalWindow,

    activationWindow,

    completionWindow: null,
    overallConfidence:
  timingHierarchy?.overallConfidence ??
  null,

  confidenceScore:
  typeof timingHierarchy?.confidenceScore === "number"
    ? timingHierarchy.confidenceScore
    : null,
    explanation:
      timingHierarchy?.explanation ??
      selectedWindow?.practicalMeaning ??
      astroBundle?.decision?.reason ??
      null,

    recommendedAction:
      Array.isArray(astroBundle?.decision?.do) &&
      astroBundle.decision.do.length
        ? String(
            astroBundle.decision.do[0]
          )
        : null,
  };
}