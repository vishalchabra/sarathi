type TimingAnswer = { short: string; full: string; action: string };

function extractISODate(value: unknown): string | null {
  const text = String(value ?? "").trim();
  const match = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (match) return match[0];
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function daysBetween(first: unknown, second: unknown): number | null {
  const a = extractISODate(first);
  const b = extractISODate(second);
  if (!a || !b) return null;
  return Math.abs(Math.round((new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime()) / 86400000));
}

function sameDate(a: unknown, b: unknown): boolean {
  const x = extractISODate(a);
  const y = extractISODate(b);
  return Boolean(x && y && x === y);
}

function formatDate(value: unknown): string {
  const iso = extractISODate(value);
  if (!iso) return String(value ?? "");
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

function topicCopy(topic: string, eventType?: string) {
  if (topic === "career") {
    const isJobChange = eventType === "job_change";
    const isPromotion = eventType === "promotion";
    return {
      outcomeName: isJobChange ? "job change" : isPromotion ? "promotion" : "career outcome",
      eventName: isJobChange ? "job-change" : isPromotion ? "promotion" : "career",
      activationMeaning: isJobChange
        ? "recruiter contact, applications, interviews, networking, or employer discussions"
        : isPromotion
        ? "visibility, review discussions, added responsibility, or recognition"
        : "professional discussions, visibility, applications, or role movement",
      conversionMeaning: isJobChange
        ? "a confirmed offer, resignation, employer change, or joining"
        : isPromotion
        ? "formal approval, title change, salary revision, or announced promotion"
        : "a confirmed professional outcome",
      weakOpening: isJobChange
        ? "The chart does not show an immediate dependable employer change."
        : "An immediate career outcome is not strongly confirmed.",
      preparationAction: "Use the intervening period to strengthen your profile, visibility, network, and evidence of performance.",
      activationAction: "During the stronger window, pursue serious conversations, applications, interviews, and viable opportunities actively.",
      caution: "Do not resign or make an irreversible career decision until the practical outcome is confirmed.",
    };
  }
  return {
    outcomeName: "desired outcome",
    eventName: "outcome",
    activationMeaning: "discussion, planning, practical movement, or opportunity-building",
    conversionMeaning: "a confirmed and completed outcome",
    weakOpening: "An immediate final outcome is not strongly confirmed.",
    preparationAction: "Use the intervening period to clarify the practical requirements and remove avoidable obstacles.",
    activationAction: "During the stronger window, respond actively to genuine opportunities.",
    caution: "Do not make an irreversible commitment until the practical conditions are clear.",
  };
}

export function buildSeniorTimingAnswer(bundle: any): TimingAnswer {
  const eventType = bundle.eventType ?? bundle.careerEventType;
  const copy = topicCopy(bundle.topic, eventType);
  const selectedWindow = bundle.selectedTimingWindow ?? bundle.bestAvailableWindow ?? bundle.strongestWindow ?? bundle.rankedTimingWindows?.[0] ?? bundle.timingWindows?.[0] ?? null;
  const trigger = bundle.bestEventTrigger ?? null;
  const windowStart = selectedWindow?.start ?? selectedWindow?.from ?? selectedWindow?.startISO ?? selectedWindow?.peak ?? selectedWindow?.end ?? null;
  const windowEnd = selectedWindow?.end ?? selectedWindow?.to ?? selectedWindow?.endISO ?? null;
  const hasRange = Boolean(windowStart && windowEnd && !sameDate(windowStart, windowEnd));
  const windowLabel = hasRange ? `${formatDate(windowStart)} to ${formatDate(windowEnd)}` : windowStart ? formatDate(windowStart) : selectedWindow?.label ?? null;
  const triggerRaw = trigger?.date ?? null;
  const triggerDistance = daysBetween(triggerRaw, windowStart);
  const conversionFavored = bundle.conversionDiagnosisV2?.verdict === "conversion_favored";
  const triggerInsideWindow = Boolean(triggerRaw && windowStart && windowEnd && extractISODate(triggerRaw)! >= extractISODate(windowStart)! && extractISODate(triggerRaw)! <= extractISODate(windowEnd)!);
  const showTrigger = Boolean(triggerRaw && (triggerInsideWindow || conversionFavored || trigger?.confidence === "high" || (triggerDistance !== null && triggerDistance <= 120)));

  const opening = bundle.timingLayer?.verdict === "strong"
    ? `The chart shows a credible period for ${copy.outcomeName}.`
    : bundle.timingLayer?.verdict === "moderate"
    ? `The chart supports ${copy.outcomeName}, but the result is more likely to unfold in stages than happen suddenly.`
    : copy.weakOpening;

  const windowSentence = windowLabel
    ? `The more coherent ${copy.eventName} period runs from ${windowLabel}.`
    : `The timing is better understood as a broader phase rather than one exact date.`;

  const triggerSentence = showTrigger && triggerRaw
    ? triggerInsideWindow
      ? `${formatDate(triggerRaw)} may act as a stronger activation point within this period.`
      : `A preliminary activation may appear around ${formatDate(triggerRaw)}, but it should be read as the opening of the process rather than the date of ${copy.outcomeName}.`
    : triggerRaw
    ? `Some earlier movement may arise through ${copy.activationMeaning}, but it should not be presented as the likely date of ${copy.outcomeName}.`
    : "";

  const conversionSentence = bundle.conversionDiagnosisV2?.verdict === "conversion_favored"
    ? `This window is capable of carrying the matter from ${copy.activationMeaning} into ${copy.conversionMeaning}.`
    : bundle.conversionDiagnosisV2?.verdict === "movement_favored"
    ? `The chart opens the process before it completes it. Early activity is more likely to take the form of ${copy.activationMeaning}; the stronger window carries the better possibility of ${copy.conversionMeaning}.`
    : `The chart contains some potential, but the present combination does not yet provide a clean route to ${copy.conversionMeaning}.`;

  const confidence = selectedWindow?.confidence ?? trigger?.confidence ?? String(bundle.confidence ?? "").toLowerCase();
  const confidenceSentence = confidence === "high"
    ? "The alignment is comparatively strong, although practical readiness still matters."
    : confidence === "medium"
    ? "The period should be treated as a probability window rather than a fixed promise."
    : "The timing remains conditional and should be confirmed through real-world developments.";

  const short = [opening, windowSentence, triggerSentence].filter(Boolean).join(" ");
  const full = [short, conversionSentence, confidenceSentence].filter(Boolean).join("\n\n");
  const action = [copy.preparationAction, copy.activationAction, copy.caution].join("\n");
  return { short, full, action };
}
