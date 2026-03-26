  // FILE: src/app/api/life-report/route.ts

  import "server-only";
  import { NextResponse } from "next/server";
  import { buildLifeReport } from "@/server/astro/life-engine";
  import { cacheGet, cacheSet, makeCacheKey } from "@/server/cache/simpleCache";
  import { buildNotificationFactsFromDailyGuide } from "@/server/notifications/daily-facts";
  import { pickNotificationsForMoment } from "@/server/notifications/engine";
  import type { NotificationContext } from "@/server/notifications/types";
  import type { CoreSignals } from "@/server/guides/types";
  import { buildDailyGuideFromCore } from "@/server/guides/daily-core";
  import { todayISOForNotificationTz } from "@/server/notifications/today";
  import { openai, GPT_MODEL } from "@/lib/ai";
  import type { TransitHit, DailyMoonRow } from "@/app/api/transits/route";
  import { buildFullGuidanceV2 } from "@/server/fullGuidance/buildFullGuidanceV2";
  import { buildPaidOutput } from "@/server/fullGuidance/buildPaidOutput";

  import {
    buildOverviewSummary,
    buildCoreLifePattern,
    buildLifePressureZone,
    buildNaturalStrength,
  } from "@/server/astro/overviewEngine";
  import { buildHiddenPattern } from "@/server/astro/hiddenPatternEngine";
  import { buildLifePatternMap } from "@/server/astro/lifePatternEngine";

  export const runtime = "nodejs";
  export const dynamic = "force-dynamic";
  export const revalidate = 0;

  /* -------------------------------------------------------
    Text cleanup helpers
  -------------------------------------------------------- */

  function errToJson(err: any) {
    return {
      error: "internal_error",
      message: String(err?.message || err || "Unknown error"),
      stack: err?.stack ? String(err.stack) : undefined,
      name: err?.name ? String(err.name) : undefined,
    };
  }

  function normalizeWeirdText(s: string) {
    return (s ?? "")
      .replace(/(\w)\?(\w)/g, "$1'$2")
      .replace(/\s\?\s/g, " — ")
      .replace(/\s—\s—\s/g, " — ");
  }

  function deepCleanStrings<T>(value: T): T {
    if (typeof value === "string") return normalizeWeirdText(value) as any;
    if (Array.isArray(value)) return value.map(deepCleanStrings) as any;
    if (value && typeof value === "object") {
      const out: any = {};
      for (const [k, v] of Object.entries(value as any)) out[k] = deepCleanStrings(v);
      return out;
    }
    return value;
  }

  function fixWeirdEncoding(input: string) {
    const s = String(input ?? "");
    return s
      .replace(/\uFFFD/g, "")
      .replace(/\u00E2\u0080\u0099/g, "\u2019")
      .replace(/\u00E2\u0080\u009C/g, "\u201C")
      .replace(/\u00E2\u0080\u009D/g, "\u201D")
      .replace(/\u00E2\u0080\u0093/g, "\u2013")
      .replace(/\u00E2\u0080\u0094/g, "\u2014")
      .replace(/\u00E2\u0080\u00A6/g, "\u2026")
      .replace(/\u00E2\u0086\u0092/g, "\u2192")
      .replace(/\u00C2/g, "")
      .replace(/\u00A0/g, " ")
      .replace(/\s\?\s/g, " — ")
      .replace(/(\w)\?(\w)/g, "$1'$2")
      .replace(/\s—\s—\s/g, " — ");
  }

  function stripJsonFences(s: string) {
    return (s ?? "")
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();
  }

  function safeParseJson(s: string): any | null {
    const t = stripJsonFences(s);
    try {
      return JSON.parse(t);
    } catch {}
    const first = t.indexOf("{");
    const last = t.lastIndexOf("}");
    if (first >= 0 && last > first) {
      const sliced = t.slice(first, last + 1);
      try {
        return JSON.parse(sliced);
      } catch {}
    }
    return null;
  }
  function stripVisibleDashaPrefix(s: string) {
    return String(s ?? "")
      .replace(
        /\b(?:Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+MD\s+•\s+(?:Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+AD\s+•\s+(?:Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+PD\.?\s*/gi,
        ""
      )
      .replace(
        /\b(?:Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+MD\s*\/\s*(?:Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+AD\s*\/\s*(?:Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+PD\.?\s*/gi,
        ""
      )
      .trim();
  }

  function cleanVisibleTextDeep(value: any): any {
    if (typeof value === "string") {
      return stripVisibleDashaPrefix(
        normalizeWeirdText(fixWeirdEncoding(value))
      );
    }
    if (Array.isArray(value)) return value.map(cleanVisibleTextDeep);
    if (value && typeof value === "object") {
      const out: any = {};
      for (const [k, v] of Object.entries(value)) out[k] = cleanVisibleTextDeep(v);
      return out;
    }
    return value;
  }

  function extractFirstISODate(s: string): string {
    const m = String(s ?? "").match(/\b\d{4}-\d{2}-\d{2}\b/);
    return m?.[0] ?? String(s ?? "").trim();
  }
function applyProgressionTone(text: string, dayIndex: number): string {
  const raw = String(text || "").trim();
  if (!raw) return raw;

  const t = raw.toLowerCase();

  const stage = dayIndex; // 0..3

  if (/message|reply|conversation|document|paperwork/.test(t)) {
    if (stage === 0) {
      return "A pending message or unfinished conversation may return to your attention. Someone may want an update or a clearer reply than what was given earlier.";
    }
    if (stage === 1) {
      return "A follow-up may be needed on something that was already discussed. You may need to confirm what has been handled and what still needs a response.";
    }
    if (stage === 2) {
      return "A communication gap may become more visible if left hanging. This is where a direct reply or document check can prevent avoidable confusion.";
    }
    return "A delayed message, reply, or document may finally need closure. The simplest path is to answer clearly and close the loop properly.";
  }

  if (/payment|expense|budget|money|transfer|reimbursement/.test(t)) {
    if (stage === 0) {
      return "A money matter may come up for review. This could involve checking an amount, timing, or whether a payment has already been handled.";
    }
    if (stage === 1) {
      return "A payment, expense, or reimbursement detail may need clearer confirmation. Someone may want numbers, timing, or responsibility spelled out more clearly.";
    }
    if (stage === 2) {
      return "If money details stay vague, they may start creating irritation or unnecessary back-and-forth. This is a better time to confirm the practical facts directly.";
    }
    return "A financial matter may be ready for resolution. You may need to settle the amount, timing, or ownership so the issue stops hanging in the background.";
  }

  if (/schedule|timing|plan|availability|conflict/.test(t)) {
    if (stage === 0) {
      return "A scheduling issue or timing clash may first become noticeable here. You may need to check availability or adjust a small plan.";
    }
    if (stage === 1) {
      return "Plans may need firmer coordination once other people’s timing becomes clearer. This could involve reshuffling a task, meeting, or commitment.";
    }
    if (stage === 2) {
      return "If timing is not clarified, a small coordination issue may start affecting other responsibilities. This is where confirming sequence and ownership will help.";
    }
    return "A plan or schedule may need a final adjustment so things can move smoothly. What matters now is settling who will do what and by when.";
  }

  if (/family|home|household|domestic/.test(t)) {
    if (stage === 0) {
      return "A home or family matter may start needing more practical attention. You may be drawn into timing, support, or small household coordination.";
    }
    if (stage === 1) {
      return "A family or home responsibility may need clearer handling once other people’s needs or expectations become visible. Someone may look to you for coordination.";
    }
    if (stage === 2) {
      return "If home or family responsibilities are left vague, they may start creating emotional friction. A practical conversation can keep the matter grounded.";
    }
    return "A domestic or family matter may be ready for a clearer resolution. This is a better time to settle responsibility and the next concrete step.";
  }

  if (/shared responsibility|role|clarify|partner|project|task|handoff/.test(t)) {
    if (stage === 0) {
      return "A shared responsibility may begin to require clearer ownership. Someone may want to know who is handling the next step.";
    }
    if (stage === 1) {
      return "Role clarity may matter more once the task starts moving again. This could involve confirming expectations, responsibility, or a missing handoff.";
    }
    if (stage === 2) {
      return "If roles stay assumed rather than spoken, a small misunderstanding may become more visible. This is where explicit ownership can prevent friction.";
    }
    return "A shared task or responsibility may need a final reset so progress becomes easier. The practical win is to name who owns what from here.";
  }

  return raw;
}
 function buildDay4to7Timing(nowPlan: any, dailyMoon: any[], todayISO?: string) {
  const areas = Array.isArray(nowPlan?.next14Days?.areasActivated)
    ? nowPlan.next14Days.areasActivated
    : [];

  const scenarios = Array.isArray(nowPlan?.next14Days?.likelyScenarios)
    ? nowPlan.next14Days.likelyScenarios
    : [];

  const originalTiming = Array.isArray(nowPlan?.next14Days?.timing)
    ? nowPlan.next14Days.timing
    : [];

  const safeTodayISO =
    typeof todayISO === "string" && /^\d{4}-\d{2}-\d{2}$/.test(todayISO)
      ? todayISO
      : new Date().toISOString().slice(0, 10);

  const baseDate = new Date(`${safeTodayISO}T00:00:00`);

  const futureRows = Array.isArray(dailyMoon) ? dailyMoon.slice(3, 7) : [];

  const out = Array.from({ length: 4 }, (_, i) => {
    const area = areas[i] ?? areas[0] ?? null;

    const scenario = String(
      scenarios[i] ??
        area?.why ??
        originalTiming[i]?.note ??
        "A pending task, message, payment, or shared responsibility may need clearer handling."
    ).trim();
   const richerScenario = beefUpNext14Note(scenario);
    const generatedDate = new Date(baseDate);
    generatedDate.setDate(baseDate.getDate() + 3 + i);

    const generatedISO = generatedDate.toISOString().slice(0, 10);

    const row = futureRows[i] ?? null;
    const nak = String(row?.moonNakshatra ?? "").trim();

    const noteParts = [
  richerScenario,
  nak ? `Moon tone: ${nak}.` : "",
].filter(Boolean);

    return {
      window: generatedISO,
      note: noteParts.join(" "),
    };
  });

  return out;
}
function polishFocusLabel(label: string): string {
  const t = String(label || "").trim().toLowerCase();

  if (!t) return "Current focus";

  if (/emotional steadiness.*communication|communication.*emotional/.test(t)) {
    return "Pending conversation";
  }
  if (/money management|expense tracking|financial caution|financial management/.test(t)) {
    return "Payment follow-up";
  }
  if (/self-directed progress|personal momentum|self direction/.test(t)) {
    return "Delayed response";
  }
  if (/home|family|domestic|household/.test(t)) {
    return "Home responsibility";
  }
  if (/relationship|partner|agreement|expectation/.test(t)) {
    return "Role clarification";
  }
  if (/work|routine|task|workflow|schedule/.test(t)) {
    return "Work backlog";
  }
  if (/communication|message|reply|document|paperwork/.test(t)) {
    return "Pending conversation";
  }
  if (/money|budget|expense|payment|resource/.test(t)) {
    return "Payment follow-up";
  }

  return label;
}

function polishScenarioText(text: string): string {
  const raw = String(text || "").trim();
  if (!raw) return raw;

  const t = raw.toLowerCase();

  if (/someone may message you asking for an update/.test(t)) {
    return "A pending message or shared task may come back to you today. Someone may want to know what has already been handled and what is still pending.";
  }

  if (/payment or expense may require your review/.test(t)) {
    return "A payment, transfer, or expense detail may need a second look. You may need to confirm the amount, timing, or who is responsible before moving ahead.";
  }

  if (/follow up with a colleague or friend about a delayed reply/.test(t)) {
    return "A delayed reply or unfinished conversation may need to be reopened. This could turn into a quick check-in about timing, next steps, or what was left hanging.";
  }

  if (/family member may ask you to coordinate a gathering or event/.test(t)) {
    return "A family or household plan may need your coordination. You may be asked to help decide timing, logistics, or who is handling what.";
  }

  if (/unexpected expense could arise/.test(t)) {
    return "A money matter may need attention sooner than expected. This could be a cost, transfer, or budget detail that needs clarification before it becomes annoying.";
  }

  if (/clarify your role or responsibility/.test(t)) {
    return "Someone may ask what exactly you are handling in a shared task or discussion. That conversation may expose an assumption, missed handoff, or loose end that now needs clarity.";
  }

  if (/delayed response.*quick catch-up|follow up about a delayed response/.test(t)) {
    return "A delayed reply or postponed conversation may return to your attention. You may need to close the loop, reschedule, or confirm where things stand.";
  }

  return raw;
}

function polishTimingNote(text: string): string {
  const raw = String(text || "").trim();
  if (!raw) return raw;

  return polishScenarioText(raw)
    .replace(/\bMoon tone: [^.]+\.\s*/gi, "")
    .trim();
}
function beefUpNext14Note(text: string, idx: number = 0): string {
  const raw = String(text || "").trim();
  if (!raw) return raw;

  const t = raw.toLowerCase();
  const pick = (arr: string[]) => arr[idx % arr.length];

  if (/task|backlog|work|review|complete/.test(t)) {
    return applyProgressionTone(
      pick([
        "A task or follow-up that was left pending may come back into focus.",
        "A previously delayed task may resurface and need your attention.",
        "Work that was set aside may return for completion.",
      ]),
      idx
    );
  }

  if (/shared responsibility|partner|role|clarify/.test(t)) {
    return applyProgressionTone(
      pick([
        "A shared responsibility may need clearer ownership.",
        "Someone may ask who is handling what in a shared task.",
        "A joint responsibility may need to be revisited.",
      ]),
      idx
    );
  }

  if (/schedule|timing|plan|conflict/.test(t)) {
    return applyProgressionTone(
      pick([
        "A timing or scheduling issue may require coordination.",
        "A small scheduling clash could surface and need resolution.",
        "Plans may need slight adjustment due to timing changes.",
      ]),
      idx
    );
  }

  if (/payment|expense|budget|money/.test(t)) {
    return applyProgressionTone(
      pick([
        "A money matter may need clearer confirmation.",
        "A payment or expense may require a second look.",
        "A financial detail may come up for review.",
      ]),
      idx
    );
  }

  if (/family|home|household/.test(t)) {
    return applyProgressionTone(
      pick([
        "A home or family matter may need practical coordination.",
        "A household task or family request may require your involvement.",
        "A domestic matter may need attention.",
      ]),
      idx
    );
  }

  if (/message|reply|document/.test(t)) {
    return applyProgressionTone(
      pick([
        "A delayed reply or message may return to your attention.",
        "A message or document you postponed may come back into focus.",
        "A pending conversation may resurface.",
      ]),
      idx
    );
  }

  return applyProgressionTone(raw, idx);
}
function buildNow3Feeling(text: string): string {
  const src = String(text || "").toLowerCase();

  if (/conversation|message|reply|document/.test(src)) {
    return "You may feel mentally occupied or slightly pressured to respond quickly.";
  }
  if (/payment|expense|budget|money|reimbursement/.test(src)) {
    return "You may feel more cautious than usual and want clearer numbers before moving ahead.";
  }
  if (/home|family|household|repair/.test(src)) {
    return "You may feel responsible for keeping things coordinated and emotionally steady.";
  }
  if (/work|task|deadline|backlog|schedule/.test(src)) {
    return "You may feel some pressure to clear pending matters before they pile up.";
  }
  if (/relationship|partner|agreement|role|shared/.test(src)) {
    return "You may feel alert to tone, expectations, and what is being left unsaid.";
  }

  return "You may feel slightly more reactive to practical matters that need closure.";
}

function buildNow3ActionLine(text: string): string {
  const src = String(text || "").toLowerCase();

  if (/conversation|message|reply|document/.test(src)) {
    return "Watch for: a delayed reply turning a small issue into a bigger one.";
  }
  if (/payment|expense|budget|money|reimbursement/.test(src)) {
    return "Best use: confirm the amount, timing, and who is covering what.";
  }
  if (/home|family|household|repair/.test(src)) {
    return "Best use: settle timing and responsibility early before emotions lead the discussion.";
  }
  if (/work|task|deadline|backlog|schedule/.test(src)) {
    return "Watch for: poor sequencing creating pressure that was avoidable.";
  }
  if (/relationship|partner|agreement|role|shared/.test(src)) {
    return "Best use: make expectations explicit before you move the matter forward.";
  }

  return "Watch for: letting a small practical issue stay vague for too long.";
}
function fillNow3PremiumFields(cleaned: any) {
  if (!cleaned?.now3Days) return cleaned;

  const scenarios = Array.isArray(cleaned.now3Days.likelyScenarios)
    ? cleaned.now3Days.likelyScenarios.slice(0, 3)
    : [];

  const focusAreas = Array.isArray(cleaned.now3Days.focusAreas)
    ? cleaned.now3Days.focusAreas.slice(0, 3)
    : [];

  const snapshot = Array.isArray(cleaned.now3Days.transitSnapshot)
    ? cleaned.now3Days.transitSnapshot.filter(Boolean)
    : [];

  if (!Array.isArray(cleaned.now3Days.drivers) || cleaned.now3Days.drivers.length < 3) {
    cleaned.now3Days.drivers = Array.from({ length: 3 }, (_, i) => {
      return String(
        snapshot[i] ??
        snapshot[0] ??
        focusAreas[i]?.why ??
        focusAreas[0]?.why ??
        ""
      ).trim();
    });
  }

  if (!Array.isArray(cleaned.now3Days.feelings) || cleaned.now3Days.feelings.length < 3) {
  cleaned.now3Days.feelings = scenarios.map((x: any) =>
    buildNow3Feeling(String(x ?? ""))
  );
}

if (!Array.isArray(cleaned.now3Days.actionLines) || cleaned.now3Days.actionLines.length < 3) {
  cleaned.now3Days.actionLines = scenarios.map((x: any) =>
    buildNow3ActionLine(String(x ?? ""))
  );
}

  if (!Array.isArray(cleaned.now3Days.confidenceByDay) || cleaned.now3Days.confidenceByDay.length < 3) {
    cleaned.now3Days.confidenceByDay = scenarios.map((_: any, i: number) =>
      i === 0 ? "High" : "Medium"
    );
  }

  cleaned.now3Days.likelyScenarios = scenarios;
  cleaned.now3Days.focusAreas = focusAreas;

  return cleaned;
}
function postProcessNowPlan(nowPlan: any, dailyMoon: any[], todayISO?: string) {
  if (!nowPlan || typeof nowPlan !== "object") return nowPlan;

  const cleaned = cleanVisibleTextDeep(nowPlan);
  fillNow3PremiumFields(cleaned);
  // Make focus labels feel like real-life situations
  if (Array.isArray(cleaned?.now3Days?.focusAreas)) {
    cleaned.now3Days.focusAreas = cleaned.now3Days.focusAreas.map((x: any) => ({
      ...x,
      area: polishFocusLabel(String(x?.area ?? "")),
      why: String(x?.why ?? "").trim(),
    }));
  }

  // Make active-now scenarios feel more relatable
  if (Array.isArray(cleaned?.now3Days?.likelyScenarios)) {
    cleaned.now3Days.likelyScenarios = cleaned.now3Days.likelyScenarios
      .map((x: any) => polishScenarioText(String(x ?? "")))
      .filter(Boolean)
      .slice(0, 3);
  }

  // Force next 4 visible entries to be single-day, prediction-style timing rows
 if (cleaned?.next14Days) {
  cleaned.next14Days.timing = buildDay4to7Timing(cleaned, dailyMoon, todayISO).map((row: any, i: number) => ({
    ...row,
    note: beefUpNext14Note(
      polishTimingNote(String(row?.note ?? "")),
      i
    ),
  }));
}

  // Optional cleanup for next14 likely scenarios too
  if (Array.isArray(cleaned?.next14Days?.likelyScenarios)) {
    cleaned.next14Days.likelyScenarios = cleaned.next14Days.likelyScenarios
      .map((x: any) => polishScenarioText(String(x ?? "")))
      .filter(Boolean);
  }

  return cleaned;
}
  function stripVisibleDashaText(s: string) {
    return String(s ?? "")
      .replace(
        /\b(?:Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+MD\s+•\s+(?:Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+AD\s+•\s+(?:Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+PD\.?\s*/gi,
        ""
      )
      .trim();
  }

  function toTitleCase(s: string) {
    return String(s ?? "")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function fmtDayLabel(dateISO: string) {
    const d = new Date(`${String(dateISO).slice(0, 10)}T12:00:00Z`);
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  function firstSentence(s: string) {
    const text = String(s ?? "").trim();
    const m = text.match(/.*?[.!?](\s|$)/);
    return (m?.[0] ?? text).trim();
  }

  function removeLeadingDateLine(s: string) {
    return String(s ?? "")
      .replace(/^\s*\d{4}-\d{2}-\d{2}\s*$/gm, "")
      .replace(/^\s*\d{4}-\d{2}-\d{2}\s+to\s+\d{4}-\d{2}-\d{2}\s*$/gim, "")
      .trim();
  }

  function splitArea(area: string) {
    const raw = String(area ?? "").trim();

    if (!raw) {
      return {
        focus: "General themes",
        subfocus: "Practical follow-through",
        houseNum: null as number | null,
      };
    }

    const houseMatch = /\bH(\d+)\b/i.exec(raw);
    const houseNum = houseMatch ? Number(houseMatch[1]) : null;

    const houseLabel =
      houseNum === 1 ? "Self & direction" :
      houseNum === 2 ? "Money & resources" :
      houseNum === 3 ? "Communication & effort" :
      houseNum === 4 ? "Home & foundations" :
      houseNum === 5 ? "Creativity & children" :
      houseNum === 6 ? "Work & routines" :
      houseNum === 7 ? "Relationships & agreements" :
      houseNum === 8 ? "Shared finances & change" :
      houseNum === 9 ? "Learning & travel" :
      houseNum === 10 ? "Career & reputation" :
      houseNum === 11 ? "Friends & gains" :
      houseNum === 12 ? "Rest & reflection" :
      null;

    const parts = raw.split(":");
    const subfocus =
      parts.length > 1
        ? parts.slice(1).join(":").trim()
        : raw.replace(/\bH\d+\b/i, "").trim();

    return {
      focus:
        houseNum && houseLabel
          ? `H${houseNum} ${houseLabel}`
          : raw,
      subfocus: subfocus || "Practical follow-through",
      houseNum,
    };
  }
  function detectTriggerFromEvidence(evidence: string[], focus?: string) {
    const text = evidence.join(" ").toLowerCase();
    const focusText = String(focus ?? "").toLowerCase();

    // strongest combined patterns first
    if (text.includes("jupiter") && text.includes("saturn")) {
      return "Growth with Responsibility Trigger";
    }

    if (text.includes("square") && text.includes("saturn") && text.includes("mercury")) {
      return "Misunderstanding Trigger";
    }

    if (text.includes("mars") && text.includes("rahu")) {
      return "Priority Clash Trigger";
    }

    if (text.includes("mars") && text.includes("saturn")) {
      return "Responsibility Pressure Trigger";
    }

    if (text.includes("sun") && text.includes("h7")) {
      return "Partnership Focus Trigger";
    }

    if (text.includes("mercury") && text.includes("h6")) {
      return "Pending Task Trigger";
    }

    // single-planet / simpler transit labels
    if (text.includes("jupiter")) return "Jupiter Opportunity Trigger";
    if (text.includes("saturn")) return "Saturn Responsibility Trigger";
    if (text.includes("rahu")) return "Rahu Shift Trigger";
    if (text.includes("ketu")) return "Ketu Release Trigger";
    if (text.includes("mars")) return "Mars Action Trigger";
    if (text.includes("venus")) return "Venus Relationship Trigger";
    if (text.includes("mercury")) return "Mercury Communication Trigger";
    if (text.includes("moon")) return "Moon Emotional Shift";
    if (text.includes("sun")) return "Sun Visibility Trigger";

    // focus-based fallback
    if (
      focusText.includes("relationship") ||
      focusText.includes("partner") ||
      focusText.includes("agreement") ||
      focusText.includes("shared")
    ) {
      return "Partnership Focus Trigger";
    }

    if (
      focusText.includes("work") ||
      focusText.includes("routine") ||
      focusText.includes("task") ||
      focusText.includes("service")
    ) {
      return "Workload Trigger";
    }

    if (
      focusText.includes("money") ||
      focusText.includes("finance") ||
      focusText.includes("budget") ||
      focusText.includes("resource")
    ) {
      return "Money Decision Trigger";
    }

    if (
      focusText.includes("communication") ||
      focusText.includes("message") ||
      focusText.includes("document") ||
      focusText.includes("paperwork")
    ) {
      return "Communication Trigger";
    }

    if (
      focusText.includes("career") ||
      focusText.includes("recognition") ||
      focusText.includes("reputation") ||
      focusText.includes("leadership")
    ) {
      return "Career Development Trigger";
    }

    return "Transit Activation";
  }
  function cleanNowTabGuidance(text: string) {
    const raw = String(text || "").trim();
    if (!raw) return raw;

  const banned = [
    "a little structure now will reduce friction later",
    "a little structure and a timely response will make the situation easier to handle",
    "the more clearly you respond the easier this becomes",
    "a clear response will prevent unnecessary back and forth",
    "this is easier to handle well when details are not rushed",
    "handling it early should keep the rest of the day smoother",
    "an opportunity for growth learning or expansion may emerge here",
    "this may touch relationship expectations or financial priorities",
    "responsibilities or long term commitments may shape the situation",
    "something may feel less important now encouraging simplification",
    "communication style or information flow may become especially important",
    "you could find yourself needing to respond to a practical obligation that needs timely attention",
    "a practical moment may come up around clarify expectations with someone important",
    "you could find yourself needing to respond to a situation that rewards steadiness over speed",
    "this may connect to long term ambitions or unfamiliar territory",
    "a situation may arise where",
    "themes are active",
    "energy may shift",
    "this day supports",
    "focus on",
    "this is a good day for"
  ];

    const normalize = (s: string) =>
      s.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();

    const parts = raw.match(/[^.!?]+[.!?]?/g) || [raw];
    const seen = new Set<string>();
    const kept: string[] = [];

    for (const part of parts.map((x) => x.trim()).filter(Boolean)) {
      const key = normalize(part);
      if (!key) continue;

      const isBanned = banned.some((b) => key.includes(b));
      if (isBanned) continue;
      if (seen.has(key)) continue;

      seen.add(key);
      kept.push(part);

      if (kept.length >= 2) break;
    }

    return kept.join(" ").replace(/\s{2,}/g, " ").trim();
  }
  function forcePredictionStyle(text: string) {
    let raw = cleanNowTabGuidance(
      removeLeadingDateLine(stripVisibleDashaText(text))
    );

    raw = raw.replace(/^a situation may arise where\s+/i, "");
    raw = raw.replace(/^you may need to\s+/i, "You may need to ");
    raw = raw.replace(/^someone may ask you to\s+/i, "Someone may ask you to ");

    const parts =
      raw.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter(Boolean) ?? [];

    const kept = parts.slice(0, 2);
    let out = kept.join(" ").replace(/\s{2,}/g, " ").trim();

    if (!out) return "";

    if (
      /^(focus on|this is a good day|themes include|energy|this day|use the day)/i.test(out)
    ) {
      out = `A practical matter may need your attention. ${out}`;
    }

    return out;
  }
  function buildFeelingFromMoon(row: any, houseNum?: number | null) {
    const nak = String(row?.moonNakshatra ?? "").trim().toLowerCase();
    const sign = String(row?.moonSign ?? "").trim();

    let feeling = "You may feel slightly more reactive than usual and want clarity before engaging deeply.";

    if (nak.includes("ashwini")) {
      feeling = "You may feel restless, fast-moving, and eager to act quickly, with less patience for delay.";
    } else if (nak.includes("bharani")) {
      feeling = "You may feel emotionally intense or burdened, as if something important needs to be handled properly.";
    } else if (nak.includes("krittika")) {
      feeling = "You may feel sharp, decisive, or slightly irritated, especially if others are unclear or inefficient.";
    } else if (nak.includes("rohini")) {
      feeling = "You may want emotional ease, comfort, and steadiness, and may dislike unnecessary tension around you.";
    } else if (nak.includes("mrigashira")) {
      feeling = "You may feel curious, mentally active, and slightly unsettled, as if still looking for the full picture.";
    } else if (nak.includes("ardra")) {
      feeling = "You may feel mentally heavy or emotionally charged, with a tendency to overthink what is unfolding.";
    } else if (nak.includes("punarvasu")) {
      feeling = "You may feel more hopeful and mentally reset, as if things can still be corrected or improved.";
    } else if (nak.includes("pushya")) {
      feeling = "You may feel responsible, composed, and more willing to support others than usual.";
    } else if (nak.includes("ashlesha")) {
      feeling = "You may feel inward, watchful, or psychologically alert, noticing what is not being openly said.";
    } else if (nak.includes("magha")) {
      feeling = "You may feel proud, self-aware, and more sensitive to respect, recognition, or status.";
    } else if (nak.includes("purva phalguni") || nak.includes("purvaphalguni")) {
      feeling = "You may want warmth, ease, and emotional validation, and may resist pressure or dryness.";
    } else if (nak.includes("uttara phalguni") || nak.includes("uttaraphalguni")) {
      feeling = "You may feel more practical about commitments and want reliability from people around you.";
    } else if (nak.includes("hasta")) {
      feeling = "You may feel like organizing, fixing, or controlling the details so things stay manageable.";
    } else if (nak.includes("chitra")) {
      feeling = "You may feel more image-conscious or perfection-driven, wanting things done properly and cleanly.";
    } else if (nak.includes("swati")) {
      feeling = "You may want space, flexibility, and freedom to handle things in your own way.";
    } else if (nak.includes("vishakha")) {
      feeling = "You may feel determined and goal-focused, but also somewhat impatient for visible progress.";
    } else if (nak.includes("anuradha")) {
      feeling = "You may feel loyal, emotionally invested, and more affected by closeness or trust dynamics.";
    } else if (nak.includes("jyeshtha")) {
      feeling = "You may feel protective, mentally charged, and sensitive to pressure, control, or hidden competition.";
    } else if (nak.includes("mula")) {
      feeling = "You may feel like cutting through the surface and dealing with the real issue directly.";
    } else if (nak.includes("purva ashadha") || nak.includes("purvashadha")) {
      feeling = "You may feel internally strong-willed and less open to advice unless it truly makes sense to you.";
    } else if (nak.includes("uttara ashadha") || nak.includes("uttarashadha")) {
      feeling = "You may feel serious, duty-bound, and more focused on what must be done than what feels easy.";
    } else if (nak.includes("shravana")) {
      feeling = "You may feel observant and mentally alert, listening carefully before deciding how to respond.";
    } else if (nak.includes("dhanishta")) {
      feeling = "You may feel driven to keep pace, stay productive, and avoid falling behind.";
    } else if (nak.includes("shatabhisha")) {
      feeling = "You may feel detached, inward, or less willing to explain yourself emotionally.";
    } else if (nak.includes("purva bhadrapada") || nak.includes("purvabhadrapada")) {
      feeling = "You may feel intense, thoughtful, and somewhat split between practicality and deeper concerns.";
    } else if (nak.includes("uttara bhadrapada") || nak.includes("uttarabhadrapada")) {
      feeling = "You may feel quieter, deeper, and more reflective, with less appetite for noise or superficiality.";
    } else if (nak.includes("revati")) {
      feeling = "You may feel softer, more inward, and more emotionally absorbent than usual.";
    }

    // small house-based modifier so it feels chart-linked, not just nakshatra-linked
    if (houseNum === 6) {
    feeling += " Small delays, unfinished work, or other people’s inefficiency may affect you more strongly that day.";
  } else if (houseNum === 7) {
    feeling += " You may react more strongly to other people’s tone, expectations, or lack of clarity.";
  } else if (houseNum === 2) {
    feeling += " Money, family tone, or practical security issues may sit more heavily on your mind.";
  } else if (houseNum === 10) {
    feeling += " Recognition, performance, or whether things are moving forward may feel especially personal.";
  } else if (houseNum === 4) {
    feeling += " Your inner comfort and emotional steadiness may matter more than usual.";
  }

    return {
      feeling,
      moonTone: nak ? toTitleCase(nak) : "",
      moonSign: sign,
    };
  }
  function buildUnifiedNowNearFutureCards(nowPlan: any, dailyMoon: any[], transitNowFacts: string[]) {
    const cards: any[] = [];

    const focusAreas = Array.isArray(nowPlan?.now3Days?.focusAreas)
      ? nowPlan.now3Days.focusAreas
      : [];
    const likelyScenarios = Array.isArray(nowPlan?.now3Days?.likelyScenarios)
      ? nowPlan.now3Days.likelyScenarios
      : [];

    const nextAreas = Array.isArray(nowPlan?.next14Days?.areasActivated)
      ? nowPlan.next14Days.areasActivated
      : [];
    const nextScenarios = Array.isArray(nowPlan?.next14Days?.likelyScenarios)
      ? nowPlan.next14Days.likelyScenarios
      : [];
    const nextTiming = Array.isArray(nowPlan?.next14Days?.timing)
      ? nowPlan.next14Days.timing
      : [];
    const nextSteering = Array.isArray(nowPlan?.next14Days?.steeringPlan)
      ? nowPlan.next14Days.steeringPlan
      : [];

    const astroDrivers = Array.isArray(nowPlan?.astroDrivers)
      ? nowPlan.astroDrivers
      : [];
    const transitsUsed = Array.isArray(nowPlan?.evidence?.transitsUsed)
      ? nowPlan.evidence.transitsUsed
      : [];
    const impactFactsUsed = Array.isArray(nowPlan?.evidence?.impactFactsUsed)
      ? nowPlan.evidence.impactFactsUsed
      : [];

    const moonRows = Array.isArray(dailyMoon) ? dailyMoon.slice(0, 7) : [];

    for (let i = 0; i < 7; i++) {
      const row = moonRows[i] ?? null;
      const areaObjForFeeling =
    i < 3
      ? (focusAreas[i] ?? focusAreas[0] ?? {})
      : (nextAreas[i - 3] ?? nextAreas[0] ?? {});

  const areaPartsForFeeling = splitArea(areaObjForFeeling?.area ?? "General themes");
  const feelingData = buildFeelingFromMoon(row, areaPartsForFeeling.houseNum);
      const dateISO = String(row?.dateISO ?? row?.date ?? "").slice(0, 10);
      if (!dateISO) continue;

      if (i < 3) {
        const areaObj = focusAreas[i] ?? focusAreas[0] ?? {};
        const scenario = cleanNowTabGuidance(
    String(
      likelyScenarios[i] ??
        areaObj?.why ??
        "Use the day for practical discussions and steady follow-through."
    ).trim()
  );

        const areaParts = splitArea(areaObj?.area ?? "General themes");
      const evidence = transitNowFacts.slice(0, 2);
        cards.push({
    kind: "day",
    trigger: detectTriggerFromEvidence(evidence, areaParts.focus),
    dateISO,
    dateLabel: fmtDayLabel(dateISO),
    confidence: "High",
    energy: "High",
    focus: areaParts.focus,
    subfocus: areaParts.subfocus,
    houseNum: areaParts.houseNum,
    dailyFeeling: feelingData.feeling,
    moonTone: feelingData.moonTone,
    guidance: forcePredictionStyle(scenario),
    evidence: transitNowFacts.slice(0, 2),
  });
      } else {
        const idx = i - 3;

        const areaObj = nextAreas[idx] ?? nextAreas[0] ?? {};
        const scenario = cleanNowTabGuidance(
    String(
      nextScenarios[idx] ??
        nextTiming[idx]?.note ??
        nextSteering[idx] ??
        areaObj?.why ??
        "A practical conversation, adjustment, or responsibility may need your attention."
    ).trim()
  );

        const areaParts = splitArea(areaObj?.area ?? "General themes");
        const moonTone = String(row?.moonNakshatra ?? "").trim();

        const transitEvidence =
          impactFactsUsed[idx] ??
          transitsUsed[idx] ??
          astroDrivers[idx]?.driver ??
          transitNowFacts[idx % Math.max(1, transitNowFacts.length)] ??
          "";
        const evidence = [
    transitEvidence
      ? String(transitEvidence)
          .replace(/\s*•\s*natal\s+/i, " • ")
          .replace(/\s*\(H\d+\)/g, "")
      : "",
    moonTone ? `Moon tone: ${moonTone}.` : "",
  ].filter(Boolean);

        cards.push({
    kind: "day",
    trigger: detectTriggerFromEvidence(evidence, areaParts.focus),
    dateISO,
    dateLabel: fmtDayLabel(dateISO),
    confidence: "Medium",
    energy: "High",
    focus: areaParts.focus,
    subfocus: areaParts.subfocus,
    houseNum: areaParts.houseNum,
    dailyFeeling: feelingData.feeling,
    moonTone: feelingData.moonTone,
    guidance: forcePredictionStyle(scenario),
    evidence: [
      transitEvidence ? String(transitEvidence) : "",
      moonTone ? `Moon tone: ${moonTone}.` : "",
    ].filter(Boolean),
  });
      }
    }

    return cards;
  }
  /* -------------------------------------------------------
    Enrich with MD / AD / PD
  -------------------------------------------------------- */
  function enrichWithActivePeriods(report: any) {
    if (!report) return report;

    const existing = report.activePeriods ?? null;

    const timeline =
      report.dashaTimeline ??
      report.timelineWindows ??
      report.timeline ??
      [];

    const main =
      Array.isArray(timeline) && timeline.length > 0 ? timeline[0] : null;

    if (!main) {
      return {
        ...report,
        activePeriods: existing ?? null,
      };
    }

    const md = main.md ?? (main as any).mahadasha ?? null;
    const ad = main.ad ?? (main as any).antardasha ?? null;
    const pd = main.pd ?? (main as any).pratyantardasha ?? null;

    const mdLord =
      (md && ((md as any).planet ?? (md as any).lord ?? (md as any).name)) || "";
    const adLord =
      (ad && ((ad as any).planet ?? (ad as any).lord ?? (ad as any).name)) || "";
    const pdLord =
      (pd && ((pd as any).planet ?? (pd as any).lord ?? (pd as any).name)) || "";

    const activePeriods = {
      mahadasha:
        mdLord && md
          ? {
              lord: mdLord,
              start: (md as any).startISO ?? (md as any).start ?? "",
              end: (md as any).endISO ?? (md as any).end ?? "",
              summary: (existing as any)?.mahadasha?.summary ?? "",
            }
          : existing?.mahadasha ?? null,
      antardasha:
        adLord && ad
          ? {
              mahaLord: mdLord,
              subLord: adLord,
              start: (ad as any).startISO ?? (ad as any).start ?? "",
              end: (ad as any).endISO ?? (ad as any).end ?? "",
            }
          : existing?.antardasha ?? null,
      pratyantardasha:
        pdLord && pd
          ? {
              mahaLord: mdLord,
              antarLord: adLord,
              lord: pdLord,
              start: (pd as any).startISO ?? (pd as any).start ?? "",
              end: (pd as any).endISO ?? (pd as any).end ?? "",
            }
          : existing?.pratyantardasha ?? null,
    };

    return {
      ...report,
      activePeriods,
    };
  }

  /* -------------------------------------------------------
    Now/Near-future plan (AI)
    IMPORTANT: does NOT compute transits itself.
    It only uses enriched.topTransits, enriched.dailyMoon, enriched.transitNow/transitPlanets.
  -------------------------------------------------------- */
  async function buildNowNearFuturePlan(enriched: any) {
    try {
      const asc = enriched?.core?.ascSign ?? enriched?.ascSign ?? "Unknown";
      const moon = enriched?.moonSign ?? enriched?.core?.moonSign ?? "Unknown";
      const sun = enriched?.sunSign ?? enriched?.core?.sunSign ?? "Unknown";
      const moonNakshatraToday = enriched?.moonNakshatraTodayFact ?? null;
      const moonTodayFact = enriched?.moonTodayFact ?? null;

      const md = enriched?.activePeriods?.mahadasha?.lord ?? "Unknown";
      const ad =
        enriched?.activePeriods?.antardasha?.subLord ??
        enriched?.activePeriods?.antardasha?.lord ??
        "Unknown";

      // -------------------------
      // Dasha focus (MD/AD/PD → natal houses)
      // -------------------------
      const planetsArr = Array.isArray(enriched?.planets) ? enriched.planets : [];

      const findHouseOf = (planetName: string): number | null => {
        const p = planetsArr.find(
          (x: any) =>
            String(x?.name ?? "").toLowerCase() ===
            String(planetName ?? "").toLowerCase()
        );
        const h = Number(p?.house);
        return Number.isFinite(h) ? h : null;
      };

      const pd =
        enriched?.activePeriods?.pratyantardasha?.lord ??
        enriched?.activePeriods?.pratyantardasha?.antarLord ??
        "Unknown";

      const dashaFocus = {
        md: { planet: md, house: findHouseOf(md) },
        ad: { planet: ad, house: findHouseOf(ad) },
        pd: { planet: pd, house: findHouseOf(pd) },
      };

      const daily = enriched?.dailyGuide ?? {};

      const transits = Array.isArray(enriched?.topTransits) ? enriched.topTransits : [];
      const dailyMoon = Array.isArray(enriched?.dailyMoon) ? enriched.dailyMoon : [];

      // -------------------------
      // Top transit windows (strength + proximity scoring)
      // FIXES:
      // - use payload todayISO when available
      // - handle invalid / missing dates safely
      // - keep focus on next 30 days for now/near-future
      // -------------------------
      const todayRealISO = new Date().toISOString().slice(0, 10);

const planTodayISO =
  typeof enriched?.todayISO === "string" &&
  enriched.todayISO.length >= 10 &&
  enriched.todayISO.startsWith(todayRealISO.slice(0, 7)) // same month/year check
    ? enriched.todayISO
    : todayRealISO;

      const today = new Date(`${planTodayISO}T00:00:00Z`);
      const horizon30 = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      const scoreTransit = (t: any) => {
        const strength = Number(t?.strength ?? 0);

        const rawStart = String(t?.startISO ?? "").trim();
        const start = rawStart ? new Date(rawStart) : today;

        const daysAway = Number.isFinite(start.getTime())
          ? Math.abs(
              (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            )
          : 30;

        const proximityBoost = Math.max(0, 30 - daysAway) * 0.8;
        return strength + proximityBoost;
      };

      const nearFutureTransits = transits.filter((t: any) => {
        const rawStart = String(t?.startISO ?? "").trim();
        const rawEnd = String(t?.endISO ?? "").trim();

        const start = rawStart ? new Date(rawStart) : today;
        const end = rawEnd ? new Date(rawEnd) : start;

        if (!Number.isFinite(start.getTime()) && !Number.isFinite(end.getTime())) {
          return false;
        }

        const safeStart = Number.isFinite(start.getTime()) ? start : today;
        const safeEnd = Number.isFinite(end.getTime()) ? end : safeStart;

        return safeStart <= horizon30 && safeEnd >= today;
      });

      const topTransitsSource = nearFutureTransits.length > 0 ? nearFutureTransits : transits;

      const topTransits = topTransitsSource
        .slice()
        .sort((a: any, b: any) => scoreTransit(b) - scoreTransit(a))
        .slice(0, 12)
        .map((t: any) => ({
          planet: t?.planet,
          target: t?.target,
          category: t?.category,
          strength: t?.strength,
          startISO: t?.startISO,
          endISO: t?.endISO,
          title: t?.title,
        }));

      console.log("[life-report] topTransits after scoring:", topTransits.slice(0, 3));

      // Natal anchors (background only)
      const anchors = (enriched?.planets ?? [])
        .slice(0, 10)
        .map((p: any) => ({
          name: p?.name,
          sign: p?.sign,
          house: p?.house,
          nakshatra: p?.nakshatra,
        }))
        .filter((x: any) => x?.name);

      const anchorsUsed = anchors.map((a: any) => {
        const h = typeof a.house === "number" ? `H${a.house}` : "";
        const s = a.sign ? `${a.sign}` : "";
        return `Natal ${a.name}${h ? " " + h : ""}${s ? " (" + s + ")" : ""}`.trim();
      });

      // Current transit planets today (computed in POST; do NOT compute here)
      const transitNow = Array.isArray(enriched?.transitNow)
        ? enriched.transitNow
        : Array.isArray(enriched?.transitPlanets)
        ? enriched.transitPlanets
        : [];

      let transitNowFacts = transitNow
  .filter((p: any) => p?.name && p?.sign)
  .map((p: any) => {
    const h = Number(p?.house);
    if (Number.isFinite(h)) return `${p.name} in ${p.sign} (H${h})`;
    return `${p.name} in ${p.sign}`;
  });

// 🔥 HARD FALLBACK (CRITICAL)
if (!transitNowFacts.length && Array.isArray(topTransits) && topTransits.length > 0) {
  transitNowFacts = topTransits.slice(0, 3).map((t: any) => {
    return `${t.planet} active (${t.category || "general"})`;
  });
}

      const transitSnapshotHard = transitNowFacts.slice(0, 3);
      const whyAnchorFacts = transitNowFacts.slice(0, 5);

      console.log("[life-report] transitNow raw:", transitNow);
      console.log("[life-report] transitNowFacts:", transitNowFacts);

      // -------------------------
      // Transit → Natal impact facts (easy-to-use bridge for AI)
      // -------------------------
      const natalPlanets = Array.isArray(enriched?.planets) ? enriched.planets : [];
      const natalByName = new Map<string, any>();
      for (const p of natalPlanets) {
        const k = String(p?.name ?? "").toLowerCase();
        if (k) natalByName.set(k, p);
      }

      // Convert transit windows into "impact facts" that reference natal targets
      const transitImpactFacts = topTransits
        .map((t: any) => {
          const tp = String(t?.planet ?? "").trim();
          const cat = String(t?.category ?? "").trim();
          const ttitle = String(t?.title ?? "").trim();
          const targetRaw = String(t?.target ?? "").trim();

          const m = /natal\s+([A-Za-z]+)/i.exec(targetRaw);
          const targetPlanet = (m?.[1] ?? "").trim();

          const natalTarget = targetPlanet
            ? natalByName.get(targetPlanet.toLowerCase())
            : null;

          const natalTag =
            natalTarget && Number.isFinite(Number(natalTarget?.house))
              ? `natal ${targetPlanet} (H${Number(natalTarget.house)})`
              : targetRaw
              ? `target: ${targetRaw}`
              : "";

          const label = ttitle || `${tp} ${cat ? "(" + cat + ")" : ""}`.trim();

          return [label, natalTag ? `• ${natalTag}` : ""]
            .filter(Boolean)
            .join(" ");
        })
        .slice(0, 10);

      // -------------------------
      // Primary Drivers (strongest astrology signals)
      // -------------------------
      const PLANET_WEIGHT: Record<string, number> = {
        saturn: 10,
        mars: 9,
        jupiter: 8,
        rahu: 8,
        ketu: 8,
        sun: 7,
        venus: 6,
        mercury: 5,
        moon: 4,
      };

      function scoreTransitFact(f: string) {
        const lower = f.toLowerCase();

        let score = 1;

        for (const p in PLANET_WEIGHT) {
          if (lower.includes(p)) {
            score += PLANET_WEIGHT[p];
          }
        }

        if (lower.includes("conjunction")) score += 4;
        if (lower.includes("opposition")) score += 3;
        if (lower.includes("square")) score += 3;

        return score;
      }

      const primaryDrivers = [...transitNowFacts, ...transitImpactFacts]
        .map((f) => ({ f, score: scoreTransitFact(f) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((x) => x.f);
      if (!primaryDrivers.length && topTransits.length > 0) {
  primaryDrivers.push(
    ...topTransits.slice(0, 3).map((t: any) => `${t.planet} ${t.category || ""}`)
  );
}
      console.log("[nowPlan] rankedDrivers:", primaryDrivers);
      console.log("[nowPlan] primaryDrivers:", primaryDrivers);

      console.log("[nowPlan] topTransits sample:", topTransits.slice(0, 4));
      console.log("[nowPlan] anchorsUsed sample:", anchorsUsed.slice(0, 6));
      console.log("[nowPlan] transitNow sample:", transitNow.slice(0, 6));
      console.log("[nowPlan] TransitNowFacts:", transitNowFacts);
      console.log("[nowPlan] keys:", Object.keys(enriched || {}));
      console.log("[nowPlan] enriched.transitNow?", enriched?.transitNow?.slice?.(0, 3));
      console.log("[nowPlan] enriched.transitPlanets?", enriched?.transitPlanets?.slice?.(0, 3));
      console.log("[nowPlan] enriched.topTransits?", enriched?.topTransits?.slice?.(0, 3));
      console.log("[nowPlan] enriched.transits?", enriched?.transits?.slice?.(0, 3));

      const prompt = `
  You are Sārathi — a paid, practical Vedic guide.
  You may describe "likely scenarios" and "areas activated", but you must NOT claim certainty or guarantee events.
  - Each likelyScenarios item MUST include a specific action or interaction (message, payment, meeting, task, request, coordination).
  - If a scenario does not include a concrete real-world action, it is invalid.  
  Return STRICT JSON ONLY (one JSON object). No markdown. No extra keys. No commentary.
 - now3Days.drivers: exactly 3 short strings, one per visible day.
- Each driver MUST quote either:
  (a) one exact TransitNowFacts string, or
  (b) one exact item from TransitSnapshotHard, or
  (c) one exact topTransits title.
- now3Days.feelings: exactly 3 short lines, one per visible day, grounded in the likely scenario.
- now3Days.actionLines: exactly 3 items, one per visible day, each shaped as either "Watch for: ..." or "Best use: ...".
- now3Days.confidenceByDay: exactly 3 values chosen only from High, Medium, Low.
- Day 1 should usually be stronger than Day 3 unless facts are weak.
  SCHEMA (output must match exactly):
  {
    "headline": "",
    "astroDrivers": [
      {"driver":"","meaning":"","howItShowsUp":""},
      {"driver":"","meaning":"","howItShowsUp":""},
      {"driver":"","meaning":"","howItShowsUp":""}
    ],
    "now3Days": {
  "transitSnapshot": [],
  "focusAreas": [{"area":"","why":""}],
  "themes": [],
  "likelyScenarios": [],
  "drivers": [],
  "feelings": [],
  "actionLines": [],
  "confidenceByDay": [],
  "do": [],
  "avoid": [],
  "remedies": []
},
    "next14Days": {
      "areasActivated": [{"area":"","why":""}],
      "likelyScenarios": [],
      "steeringPlan": [],
      "timing": [{"window":"","note":""}],
      "remedies": []
    },
    "next30Days": {
      "areasActivated": [{"area":"","why":""}],
      "runway": [
        {"label":"Weeks 1–2","focus":"","likely":[]},
        {"label":"Weeks 3–4","focus":"","likely":[]},
        {"label":"By day 30","focus":"","likely":[]}
      ],
      "priorityWins": [],
      "watchouts": [],
      "systemToInstall": []
    },
    "evidence": {
      "phase": "",
      "transitsUsed": [],
      "anchorsUsed": [],
      "transitNowFactsUsed": [],
      "impactFactsUsed": []
    },
    "closing": ""
  }

  ABSOLUTE OUTPUT RULES (do not break):

  1) Tone & realism
  - Write in second person ("you"). Be direct, calm, and practical.
  - Every visible scenario must describe a likely real-world event the user may actually encounter because of the chart and current transits.
  - Do NOT write abstract lines like:
    "A situation may arise..."
    "Themes are active..."
    "Energy may shift..."
  - Start with a concrete likely event instead.
 - Good examples:
  "A pending message, work follow-up, or small obligation may come back to you today. Someone may want to know where things stand or what has already been handled."
  "A payment, transfer, expense, or budget detail may need a second look. You may need to confirm numbers, timing, or who is covering what."
  "A partner, client, colleague, or family member may ask you to clarify your role in something shared. This may expose a loose end, assumption, or missing handoff."
  "A delayed reply, document, or practical conversation may need to be reopened. What looked minor can matter more once someone asks for an update."
  "A home, family, or scheduling matter may need your coordination. This may involve deciding timing, responsibility, or the next concrete step."

- Bad examples:
  "Emotional steadiness in communication"
  "Money management and expense tracking"
  "Self-directed progress"
  "A situation may arise"
  "Themes around clarity are active"

- Focus area labels must sound like real life, not astrology summaries.
- Good focus labels:
  "Pending conversation"
  "Payment follow-up"
  "Home responsibility"
  "Role clarification"
  "Delayed response"
  "Shared task"
  "Work backlog"
  "Scheduling issue"
  "Family coordination"

- For now3Days.focusAreas[].area:
  - Use 2 to 5 words only.
  - Make it sound like a real situation the user will recognize immediately.
  - Do NOT use abstract labels like "emotional steadiness", "self-directed progress", "communication dynamics", or "financial caution".
  - Each day must feel different in wording and situation.
  - Prefer practical situations: delayed reply, missed follow-up, budget check, role confusion, backlog pressure, scheduling clash, shared responsibility, family coordination, repair, paperwork, negotiation, support request.
  - Keep each scenario to 2 short sentences.
  - Sentence 1 = what likely happens.
  - Sentence 2 = how it may unfold, what it may involve, or the best immediate response.
  - Do NOT append generic coaching after every day.
  - Do NOT reuse stock phrases like:
    "clarify details"
    "reduce friction"
    "timely response"
    "the easier this becomes"
    "a little structure"
    "details are not rushed"
    "keep the rest of the day smoother"
  - Avoid repetition across days.
  - Make the output feel observed from the user's life, not written from a template.
  2) Astrology source-of-truth
  - Only reference planets present in FACTS. Only use: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu, Ketu.
  - Never describe natal anchors as "current transits". Natal anchors are ONLY background context.
  - In now3Days and next14Days: you MAY reference natal targets ONLY as activations (e.g., "a transit activates natal Venus themes").
  - Do NOT state natal placements as positions (avoid "natal Mars in H2" style).
  - Natal anchors may only appear in evidence. Do not use anchorsUsed in visible guidance sections.

  3) Allowed inputs only (do not assume anything else)
  - Use ONLY these inputs: (1) TransitNowFacts (today), (2) TransitSnapshotHard (today), (3) topTransits windows, (4) TransitImpactFacts, (5) dailyMoon, and (6) dashaFocus as secondary context.

  4) Hard anchoring (this creates premium quality)
  - now3Days.transitSnapshot MUST equal TransitSnapshotHard exactly (copy verbatim).
  - Do NOT write "No major current transits". Always list what IS active today.
  - In now3Days.focusAreas[].why: MUST include ONE EXACT TransitNowFacts string copied verbatim (example: "Mercury in Capricorn (H5)").
  - Do NOT write generic why-lines like "emotional climate is workable" without that TransitNowFacts anchor.
  - If a planet is not present in TransitNowFacts, DO NOT mention its house.
  - If TransitNowFacts is empty, then set now3Days.focusAreas[].why to "Transit data missing today." (do not improvise).
  - In now3Days.focusAreas[].why: MUST include ONE EXACT string copied from WhyAnchorFacts.

  5) Dasha handling (background only)
  - Do NOT show MD/AD/PD as the main visible label.
  - Do NOT begin focusAreas[].why with "Dasha" or "MD/AD/PD".
  - If you reference dasha, put it at the end as a short modifier in parentheses (e.g., "(Ketu AD tone)").

  6) Time-window discipline
  - For now3Days: only use transit windows whose date range overlaps today → today+3d.
  - Ignore transit windows far in the future.
  6.1) First-week display discipline
  - The UI will show the first 7 visible entries as day cards.
  - Days 1-3 come from now3Days.
  - Days 4-7 come from next14Days.timing.
  - Therefore, the FIRST 4 items of next14Days.timing MUST be SINGLE-DAY dates only in YYYY-MM-DD format.
  - Do NOT output date ranges like "2026-03-11 to 2026-03-17" for those first 4 timing items.
  - Each of those first 4 timing.note values MUST be a concrete daily prediction, not a transit label.

  6.2) Visible text cleanup
  - Do NOT include visible MD/AD/PD strings like "Sun MD • Saturn AD • Venus PD." in scenario text.
  - Keep dasha as hidden reasoning only.
  6.3) Card phrasing discipline
  - For daily card content, the first sentence MUST be written like a likely event or likely situation.
  - Good examples:
    "A practical conversation about shared expenses may come up."
    "You may need to follow up on a delayed reply or pending document."
    "A home-related responsibility could require your coordination."
  - Avoid starting with generic advice like:
    "Focus on..."
    "This is a good day for..."
    "Themes include..."
  - Avoid generic helper lines repeated across days.
  - Do NOT append reusable coaching phrases after every scenario.
  - The daily note should feel like a fresh situation, not a templated reminder.
  - Use one main scenario and one supporting implication only.
  - Do NOT add a generic concluding sentence after every scenario.
  - Use one main scenario and one supporting implication only.
  - Do NOT append a generic concluding sentence after every day.
  7) Moon / nakshatra anti-hallucination rule
  - You may mention Moon nakshatra ONLY if you copy it exactly from MoonTodayNakshatraFact (today) or from dailyMoon rows (future days).
  - If MoonTodayNakshatraFact is null, do NOT mention any nakshatra by name.
  - Do NOT invent nakshatra names.

  8) 14 days & 30 days anchoring
  - In next14Days.areasActivated[].why: MUST reference either a topTransits/TransitImpactFacts item OR a dailyMoon shift cue.
  - In next14Days.timing[].note: MUST reference either a topTransits/TransitImpactFacts window OR a dailyMoon change.
  - In next30Days.runway[].focus: MUST reference at least one driver from topTransits or TransitImpactFacts (no generic "stay disciplined" without citing a driver).

  9) Astro drivers (premium reasoning)
  - astroDrivers: exactly 3 items.
  - Each astroDrivers item MUST be grounded in either:
    (a) ONE EXACT TransitNowFacts string (planet in sign + H#), OR
    (b) a dated window from topTransits/TransitImpactFacts.
  - Do not write generic psychology in astroDrivers.

  10) Primary drivers priority
  - The list "PrimaryDrivers" contains the strongest active astrology signals.
  - Use these signals as the main reasoning for astroDrivers and focusAreas.
  - Avoid building guidance from weak signals if PrimaryDrivers are available.

  HARD LIMITS (enforce strictly):
  - headline: max 120 characters
  - now3Days.focusAreas: exactly 3 items
  - now3Days.themes: 3-4 items
  - now3Days.likelyScenarios: 4-6 items
  - now3Days.do: 4-6 items
  - now3Days.avoid: 3-5 items
  - now3Days.remedies: 2-4 items (<=10 min each)
  - next14Days.areasActivated: 4-6 items
  - next14Days.likelyScenarios: 5-8 items
  - next14Days.steeringPlan: 5-8 items
  - next14Days.timing: 3-6 items
  - next14Days.remedies: 2-4 items
  - next30Days.areasActivated: 4-6 items
  - next30Days.runway: exactly 3 items (keep labels as given)
    - each runway.focus: max 140 characters
    - each runway.likely: 3-5 items
  - next30Days.priorityWins: 4-6 items
  - next30Days.watchouts: 4-6 items
  - next30Days.systemToInstall: 3-5 items
  - closing: max 240 characters
  - astroDrivers: exactly 3 items
  - driver: max 80 chars
  - meaning: max 140 chars
  - howItShowsUp: max 140 chars

  EVIDENCE (for debugging, keep short):
  - evidence.phase: one line describing the core phase in plain English (max 120 chars).
  - evidence.transitsUsed: list 3-6 short strings from topTransits (use planet+target or title).
  - evidence.anchorsUsed: list 3-6 short strings from Natal anchors.

  FACTS (use only these inputs — do not assume anything else):
  - Asc: ${asc}, Moon: ${moon}, Sun: ${sun}
  - Current phase (MD/AD): ${md}/${ad}
  - Dasha focus houses: ${JSON.stringify(dashaFocus)}
  - Natal anchors (top): ${JSON.stringify(anchorsUsed)}
  - Current transit planets (today): ${JSON.stringify(transitNow)}
  - Top transit windows (sorted): ${JSON.stringify(topTransits)}
  - TransitImpactFacts (transit→natal bridge): ${JSON.stringify(transitImpactFacts)}
  - Daily Moon (next 14 days): ${JSON.stringify(dailyMoon)}
  - TransitNowFacts (MUST COPY EXACTLY when mentioning houses): ${JSON.stringify(transitNowFacts)}
  - PrimaryDrivers (strongest signals — MUST drive the reasoning for the next 3 days): ${JSON.stringify(primaryDrivers)}
  - - MoonTodayFact (MUST COPY EXACTLY if mentioning current Moon context): ${JSON.stringify(moonTodayFact)}
  - MoonTodayFact (MUST COPY EXACTLY if mentioning current Moon context): ${JSON.stringify(moonTodayFact)}
  - TransitSnapshotHard (must use exactly these 3 lines): ${JSON.stringify(transitSnapshotHard)}
  - WhyAnchorFacts (copy exactly in focusAreas.why): ${JSON.stringify(whyAnchorFacts)}

  - Daily signals: ${JSON.stringify({
        emotional: daily?.emotionalWeather?.summary ?? null,
        money: daily?.moneyTip?.summary ?? null,
        food: daily?.food?.headline ?? null,
      })}

  Now produce the JSON.
  `.trim();

      const completion = await openai.chat.completions.create({
        model: GPT_MODEL,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "Return ONLY valid JSON for the schema. No markdown, no commentary, no extra text.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const raw = completion.choices?.[0]?.message?.content ?? "{}";
      const cleaned = normalizeWeirdText(fixWeirdEncoding(raw));

      const obj = safeParseJson(cleaned);
  if (!obj) {
    console.warn("[nowPlan] safeParseJson failed. head:", cleaned.slice(0, 250));
    console.warn("[nowPlan] safeParseJson failed. tail:", cleaned.slice(-220));
    return null;
  }

  const finalObj = postProcessNowPlan(obj, dailyMoon, planTodayISO);
  return finalObj;
    } catch (e) {
      console.warn("[nowPlan] buildNowNearFuturePlan failed:", e);
      return null;
    }
  }

  /* -------------------------------------------------------
    Route
  -------------------------------------------------------- */
  export async function GET(req: Request) {
    console.warn("[api/life-report] GET hit:", req.url, {
      referer: req.headers.get("referer"),
      ua: req.headers.get("user-agent"),
    });
    return Response.json(
      { ok: false, error: "Use POST /api/life-report with JSON body" },
      { status: 200 }
    );
  }

  export async function POST(req: Request) {
    try {
      const body = await req.json();

      // ----------------------------
      // 1) Parse location (support old + new schema)
      // ----------------------------
      const rawLat = body.birthLat ?? body.lat;
      const rawLon = body.birthLon ?? body.lon;

      const lat = typeof rawLat === "string" ? Number(rawLat) : Number(rawLat);
      const lon = typeof rawLon === "string" ? Number(rawLon) : Number(rawLon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error("Invalid latitude/longitude. Please pick a place from dropdown.");
      }

      // ----------------------------
      // 2) Cache keys
      // ----------------------------
      const cacheBuster = 1;

      const baseKey = makeCacheKey({
        name: body.name ?? body.placeName ?? "User",
        birthDateISO: body.birthDateISO,
        birthTime: body.birthTime,
        birthTz: body.birthTz,
        lat,
        lon,
        version: "engine-v2b-asc-sidereal-2",
        cacheBuster,
      });

      const cacheKey = `v3:${baseKey}`;
      
      // ----------------------------
      // 3) Build or load life report
      // ----------------------------
      let report: any;
      let cacheFlag: "hit" | "miss" | "miss-dev" = "miss";

      if (process.env.NODE_ENV !== "production") {
        report = await buildLifeReport({
          name: body.name ?? body.placeName,
          birthDateISO: body.birthDateISO,
          birthTime: body.birthTime,
          birthTz: body.birthTz,
          lat,
          lon,
        });
        cacheFlag = "miss-dev";
      } else {
        const cached = await cacheGet<any>(cacheKey);
        if (cached) {
          report = cached;
          cacheFlag = "hit";
        } else {
          report = await buildLifeReport({
            name: body.name ?? body.placeName,
            birthDateISO: body.birthDateISO,
            birthTime: body.birthTime,
            birthTz: body.birthTz,
            lat,
            lon,
          });
          await cacheSet(cacheKey, report, 60 * 5);
          cacheFlag = "miss";
        }
      }
    
      // ----------------------------
      // 4) Enrich report with active periods
      // ----------------------------
      const enriched = enrichWithActivePeriods(report);

      const lagnaSign =
        (enriched as any)?.core?.ascSign ?? (enriched as any)?.ascSign ?? undefined;

      // ----------------------------
      // 5) Shared birth payload for transit engines
      // ----------------------------
      const birthForTransits = {
        dateISO: body.birthDateISO,
        time: body.birthTime,
        tz: body.birthTz,
        lat,
        lon,
      };

      // ----------------------------
      // 6) Helper: call /api/transits (SOURCE OF TRUTH)
      // ----------------------------
      function getServerBaseUrl() {
        const explicit = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
        if (explicit) return explicit.replace(/\/$/, "");

        const vercel = process.env.VERCEL_URL;
        if (vercel) return `https://${vercel}`.replace(/\/$/, "");

        return "http://localhost:3000";
      }

      async function fetchTransitsForLifeReport(payload: any) {
        const base = getServerBaseUrl();
        const res = await fetch(`${base}/api/transits`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.warn("[life-report] /api/transits non-200:", res.status, text.slice(0, 200));
          return null;
        }

        return res.json();
      }
    
      // ----------------------------
      // 7) Get transit windows + dailyMoon + transitNow from /api/transits
      // ----------------------------
      const transitsData = await fetchTransitsForLifeReport({
        birth: birthForTransits,
        horizonDays: 365,
        ascDeg: (enriched as any)?.core?.ascDeg ?? report?.core?.ascDeg,
        ascSign: lagnaSign,
      });

      const transits: TransitHit[] = Array.isArray(transitsData?.transits)
        ? transitsData.transits
        : [];

      const topTransits: TransitHit[] = Array.isArray(transitsData?.topTransits)
        ? transitsData.topTransits
        : transits
            .slice()
            .sort((a: any, b: any) => Number(b?.strength ?? 0) - Number(a?.strength ?? 0))
            .slice(0, 12);

      const dailyMoon: DailyMoonRow[] = Array.isArray(transitsData?.dailyMoon)
        ? transitsData.dailyMoon
        : [];

      const transitNow: any[] = Array.isArray(transitsData?.transitNow)
        ? transitsData.transitNow
        : [];

      // ----------------------------
      // 8) Attach canonical keys used by nowPlan + UI
      // ----------------------------
      (enriched as any).topTransits = topTransits;
      (enriched as any).dailyMoon = dailyMoon;
      (enriched as any).transitNow = transitNow;
      (enriched as any).transitPlanets = transitNow;

      console.log("[life-report] transits:", transits.length);
      console.log("[life-report] topTransits:", topTransits.length, topTransits?.[0]);
      console.log("[life-report] transitNow:", transitNow.length, transitNow?.[0]);
      console.log("[life-report] dailyMoon:", dailyMoon.length, dailyMoon?.[0]);

      // ----------------------------
      // 9) Daily Guide (uses transits windows)
      // ----------------------------
      const core: CoreSignals = {
        birth: birthForTransits,
        lagnaSign,
        dashaStack: [],
        transits: topTransits,
        moonToday: {
          sign: (enriched as any).moonSign ?? "Unknown",
          nakshatra:
            (enriched as any).panchang?.moonNakshatraName ??
            (enriched as any).panchangToday?.nakshatraName ??
            (enriched as any).moonNakshatraName ??
            "Unknown",
        },
        panchang: (enriched as any).panchang ?? {},
      };

      const ap = (enriched as any).activePeriods;
      if (ap?.mahadasha) core.dashaStack.push(ap.mahadasha as any);
      if (ap?.antardasha) core.dashaStack.push(ap.antardasha as any);
      if (ap?.pratyantardasha) core.dashaStack.push(ap.pratyantardasha as any);

      const dailyGuide = await buildDailyGuideFromCore(core);

      // ----------------------------
      // 10) Moon facts from dailyMoon rows
      // FIX:
      // - add moonTodayFact so prompt has the value it expects
      // ----------------------------
      const notificationTzTmp = body.notificationTz || body.birthTz || "Asia/Dubai";
      const todayISOTmp = todayISOForNotificationTz(notificationTzTmp);

      const moonTodayRow: any =
        (Array.isArray(dailyMoon)
          ? (dailyMoon as any[]).find(
              (r: any) => String(r?.dateISO ?? r?.date ?? "") === String(todayISOTmp)
            )
          : null) ?? (Array.isArray(dailyMoon) ? (dailyMoon as any[])[0] : null);

      const moonNakshatraTodayFact =
        moonTodayRow?.moonNakshatra
          ? `Moon nakshatra today: ${moonTodayRow.moonNakshatra}`
          : null;

      const moonTodayFact =
        moonTodayRow
          ? `Moon today: ${[
              moonTodayRow?.moonSign ? String(moonTodayRow.moonSign) : "",
              moonTodayRow?.moonNakshatra ? `(${String(moonTodayRow.moonNakshatra)})` : "",
            ]
              .filter(Boolean)
              .join(" ")}`
          : null;

      // ----------------------------
      // 11) Build enrichedWithDaily for nowPlan
      // FIXES:
      // - pass todayISO into nowPlan so scoring aligns with notification timezone
      // - pass moonTodayFact too
      // ----------------------------
      const notificationTz = body.notificationTz || body.birthTz || "Asia/Dubai";
      const todayISO = todayISOForNotificationTz(notificationTz);

      const enrichedWithDaily = {
    ...enriched,

    // canonical birth fields for UI
    birthDateISO: body.birthDateISO ?? enriched?.birthDateISO ?? report?.birthDateISO ?? "",
    birthTime: body.birthTime ?? enriched?.birthTime ?? report?.birthTime ?? "",
    birthTz: body.birthTz ?? enriched?.birthTz ?? report?.birthTz ?? "",
    birthLat:
      Number.isFinite(lat)
        ? lat
        : (typeof enriched?.birthLat === "number" ? enriched.birthLat : report?.birthLat),
    birthLon:
      Number.isFinite(lon)
        ? lon
        : (typeof enriched?.birthLon === "number" ? enriched.birthLon : report?.birthLon),
    placeName: body.placeName ?? body.name ?? enriched?.placeName ?? report?.placeName ?? "",

    dailyGuide,
    topTransits,
    dailyMoon,
    transitNow,
    transitPlanets: transitNow,
    moonNakshatraTodayFact,
    moonTodayFact,
    todayISO,
  };
      // ----------------------------
      // 12) Notifications (unchanged)
      // ----------------------------
      const dailyForNotifications = {
        dateISO: todayISO,
        emotional: dailyGuide?.emotionalWeather ?? null,
        money: dailyGuide?.moneyTip ?? null,
        fasting: dailyGuide?.fasting ?? null,
        food: dailyGuide?.food ?? null,
        panchang: report.panchangToday ?? report.panchang ?? null,
        transits: topTransits,
      };

      const userId = undefined;
      const notificationFacts = buildNotificationFactsFromDailyGuide(dailyForNotifications, userId);

      const morningCtx: NotificationContext = { timeOfDay: "morning", facts: notificationFacts };
      const middayCtx: NotificationContext = { timeOfDay: "midday", facts: notificationFacts };
      const eveningCtx: NotificationContext = { timeOfDay: "evening", facts: notificationFacts };

      const previewNotifications = {
        morning: pickNotificationsForMoment(morningCtx, { maxPerBatch: 3 }),
        midday: pickNotificationsForMoment(middayCtx, { maxPerBatch: 2 }),
        evening: pickNotificationsForMoment(eveningCtx, { maxPerBatch: 2 }),
      };

      // ----------------------------
      // 13) Now/Near-future plan (AI)
      // FIX:
      // - bump cache version so old messy prod plan is not reused
      // ----------------------------
      const decision90Key = `decision90:v4:${baseKey}`;
// cache key for Now & Near Future plan
const nowPlanKey = `nowplan:v4:${baseKey}:${todayISO}`;
const DECISION_TTL_SEC = 60 * 60 * 24 * 30;

let nowPlan: any = null;

if (process.env.NODE_ENV === "production") {
  const cachedPlan = await cacheGet<any>(nowPlanKey);

  if (cachedPlan) {
    nowPlan = cachedPlan;
  } else {
    nowPlan = await buildNowNearFuturePlan(enrichedWithDaily);

    if (nowPlan) {
      // temporary shorter cache while testing
      await cacheSet(nowPlanKey, nowPlan, 60 * 10);
    }
  }
} else {
  // dev mode: always regenerate
  nowPlan = await buildNowNearFuturePlan(enrichedWithDaily);
}

console.log("[life-report] nowPlan generated?", !!nowPlan, "headline:", nowPlan?.headline);

      const transitNowFacts = Array.isArray(transitNow)
        ? transitNow
            .filter((p: any) => p?.name && p?.sign)
            .map((p: any) => {
              const h = Number(p?.house);
              if (Number.isFinite(h)) return `${p.name} in ${p.sign} (H${h})`;
              return `${p.name} in ${p.sign}`;
            })
            .slice(0, 12)
        : [];
      const todayNextFewDaysCards = buildUnifiedNowNearFutureCards(
    nowPlan,
    dailyMoon,
    transitNowFacts
  );
      // ----------------------------
      // 14) Response payload
      // ----------------------------
      const payload: any = {
    ...enrichedWithDaily,
    transitNowFacts,
    nowNearFuture: nowPlan,
    nowPlan,
    todayNextFewDaysCards,

    notificationFacts,
    previewNotifications,
    _cache: cacheFlag,
    _debugAsc: {
      ascDeg: (enriched as any)?.core?.ascDeg ?? report?.core?.ascDeg,
      ascSign: (enriched as any)?.core?.ascSign ?? report?.core?.ascSign,
    },
  };
    payload.overviewSummary = buildOverviewSummary(payload);
  payload.todayISO = todayISO;
  payload.hiddenPattern = buildHiddenPattern(payload);
  payload.lifePatternMap = buildLifePatternMap(payload);
  payload.coreLifePattern = buildCoreLifePattern(payload);
  payload.lifePressureZone = buildLifePressureZone(payload);
  payload.naturalStrength = buildNaturalStrength(payload);
      // Build paid output (source for FG_V2)
      const paidOut = buildPaidOutput(payload);

      const activePeriods = (enriched as any)?.activePeriods ?? payload?.activePeriods ?? null;
      const paid = paidOut;

      const fullGuidanceV2 = buildFullGuidanceV2({
        todayISO: String(todayISO ?? payload?.todayISO ?? new Date().toISOString().slice(0, 10)),
        activePeriods,
        paid,
        topTransits: Array.isArray(topTransits) ? topTransits : [],
        transitNowFacts: Array.isArray(transitNowFacts) ? transitNowFacts : [],
      });

      payload.fullGuidanceV2 = fullGuidanceV2;

      return NextResponse.json(deepCleanStrings(payload));
    } catch (e: any) {
      console.error("life-report API error:", e);
      const msg = String(e?.message ?? e);

      return NextResponse.json(
        { error: "internal_error", message: msg || "Unknown error" },
        { status: 500 }
      );
    }
  }