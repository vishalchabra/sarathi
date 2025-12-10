// FILE: src/server/qa/handlers.ts
import { detectIntent, type Intent } from "./intent";
import { findNextEkadashi, getPanchang, colorForWeekday, type Place } from "./astro";
import { timingForTopic } from "@/server/timing/engine";
import { fetchFestivalInfoFromWiki } from "./wiki";
import { fetchDashaSpans, type DashaSpan } from "./dasha";

/* ----------------------------- Types ----------------------------- */
type Profile = {
  name?: string;
  birth?: { dateISO: string; time: string; tz: string; lat: number; lon: number };
  place: Place;
};

type QAResult = {
  ok: boolean;
  title?: string;
  answer?: string;
  topic?: string;
  windows?: any[];
  bottomLine?: { lead: string; nuance?: string };
  context?: string;
  natal?: string;
  guidance?: string[];
  checklist?: string[];
  extra?: any;
  error?: string;
};

/* ----------------------------- Copy/Context ----------------------------- */
const CTX_FALLBACK =
  "Proceed methodically; patience multiplies outcomes. Keep decisions documented.";

const NATAL: Record<string, string> = {
  vehicle: "⚠️ 4th-house strength modest; Saturn/Mars echo: go slow, inspect twice.",
  property: "⚠️ 4th/11th need steadying; prefer verified builders + clean titles.",
  job: "✨ 10th/11th activation helps outreach; avoid impulse resignations.",
  wealth: "✨ Dhan cues reward discipline; beware speculative spikes.",
  health: "⚠️ 6th-house cues: routine, sleep, and stress hygiene first.",
  relationships: "✨ 7th/5th warmth windows; speak early, not late.",
  disputes: "⚠️ Saturn/Mars require procedure; write, file, then escalate.",
  marriage:
    "✨ Marriage requires 7th house/7th lord + Venus/Jupiter support; events land best when dasha agrees.",
};

const GUIDANCE: Record<string, string[]> = {
  vehicle: [
    "If you want value + reliability, bias later window(s).",
    "If you want brand/features, start early; close only if numbers are clean.",
  ],
  property: [
    "End-use: favor calmer paperwork windows.",
    "Investing: stagger entries; don’t over-commit in one shot.",
  ],
  job: [
    "Explore market in early windows, line up offers for mid/late close.",
    "Quantify wins; structure beats speed during tougher sub-periods.",
  ],
  wealth: [
    "Accumulate gradually across windows; avoid FOMO outside them.",
    "Rotate only on thesis/weights, not headlines.",
  ],
  health: [
    "Build habit floors first; add intensity when recovery is steady.",
    "Track weekly, not daily; protect joints and sleep.",
  ],
  relationships: [
    "Use early window(s) for reconnection; deeper talks in calmer windows.",
    "Share a light 30-60-90 plan; keep late-night heavies off the table.",
  ],
  disputes: [
    "Mediation/settlement during mid windows.",
    "Escalate only with airtight paper trail and counsel’s go-ahead.",
  ],
  marriage: [
    "Use the first strong window for families to meet and align expectations.",
    "Fix engagement/registration in the strongest window; keep documents ready.",
  ],
};

const CHECKLIST: Record<string, string[]> = {
  vehicle: [
    "Pre-approval + hard budget cap.",
    "Line-item on-road price (fees/insurance/accessories).",
    "Month-end leverage; stack corporate/loyalty/exchange.",
    "Sleep on ‘today-only’ offers.",
  ],
  property: [
    "Loan eligibility & FOIR clean.",
    "Title/encumbrance/society NOCs verified.",
    "All promises in writing; snag list before possession.",
  ],
  job: [
    "Update CV/LinkedIn with 5–7 quantified wins.",
    "Warm intros > cold applies; 10 targeted notes/week.",
    "STAR stories prepped; salary bands researched.",
  ],
  wealth: [
    "Automate SIP/DCAs; set max risk per idea.",
    "Quarterly rebalance to target bands.",
    "Write entry + exit plan before buying.",
  ],
  health: [
    "7–8h sleep, 8–10k steps baseline.",
    "Hydration + protein; progressive overload slowly.",
    "Deload week if soreness lingers.",
  ],
  relationships: [
    "1 meaningful shared activity/week.",
    "Time-box tough topics; avoid post-9pm heavies.",
    "Revisit shared goals monthly.",
  ],
  disputes: [
    "Everything in writing; evidence timeline maintained.",
    "Know your BATNA; avoid verbal-only commitments.",
    "Try mediation before filing.",
  ],
  marriage: [
    "Collect KYC/legal docs (IDs, address proofs) for registration.",
    "Block venues/vendors with refundable terms.",
    "Align priest/registrar availability with the chosen window.",
  ],
};

/* ----------------------------- Dasha context ----------------------------- */
function activeDashaContext(spans?: DashaSpan[]): { line: string; raw?: DashaSpan } | null {
  if (!spans || spans.length === 0) return null;
  const now = Date.now();
  const cur =
    spans.find((s) => {
      const a = Date.parse(s.fromISO);
      const b = Date.parse(s.toISO);
      return !isNaN(a) && !isNaN(b) && a <= now && now <= b;
    }) ?? spans[0];
    const label = (cur?.label ?? "").trim();

  // `note` is present at runtime but not on the DashaSpan type,
  // so we read it via `any` to keep TypeScript happy.
  const note = (cur as any)?.note as string | undefined;

  const line = label
    ? `You’re in ${label}. ${note ?? CTX_FALLBACK}`
    : `You’re in current period. ${note ?? CTX_FALLBACK}`;
  return { line, raw: cur };

}

/* ----------------------------- Panchang helpers ----------------------------- */
function weekdayInTZ(tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: tz }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  }
}
const RAHU_APPROX: Record<string, string> = {
  Sunday: "16:30–18:00",
  Monday: "07:30–09:00",
  Tuesday: "15:00–16:30",
  Wednesday: "12:00–13:30",
  Thursday: "13:30–15:00",
  Friday: "10:30–12:00",
  Saturday: "09:00–10:30",
};

/* ----------------------------- tiny utils ----------------------------- */
function fmtISO(isoStr?: string) {
  if (!isoStr) return "?";
  const d = new Date(isoStr as any);
  const t = d?.getTime?.();
  if (!t || Number.isNaN(t)) return isoStr;
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  } catch {
    return isoStr;
  }
}
function getWinDates(w: any) {
  const fromISO = w?.fromISO || w?.from || w?.start || w?.startISO;
  const toISO = w?.toISO || w?.to || w?.end || w?.endISO;
  return { fromISO, toISO };
}
function windowSpanLabel(score?: number) {
  if (typeof score !== "number") return "window";
  if (score >= 0.7) return "strong window";
  if (score >= 0.4) return "supportive window";
  return "light window";
}
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function icon(t: string) {
  return t === "vehicle" ? "🚗" :
         t === "property" ? "🏠" :
         t === "job" ? "💼" :
         t === "wealth" ? "💰" :
         t === "health" ? "🏋️‍♂️" :
         t === "relationships" ? "❤️" :
         t === "marriage" ? "💍" :
         t === "disputes" ? "⚖️" : "✨";
}

/* ---------------------- narrative builder ---------------------- */
function buildStructuredNarrative(args: {
  topic: string; name?: string; windows?: any[];
  bottomLine?: { lead: string; nuance?: string };
  guidance?: string[]; checklist?: string[]; natal?: string;
  dashaSpans?: DashaSpan[];
}) {
  const { topic, name, windows = [], bottomLine, guidance = [], checklist = [], natal, dashaSpans = [] } = args;
  const who = name ?? "you";
  const top = [...windows].sort((a: any, b: any) => (b?.score ?? 0) - (a?.score ?? 0)).slice(0, 3);

  const bestLines = top.map((w: any) => {
    const { fromISO, toISO } = getWinDates(w);
    const lbl = windowSpanLabel(w?.score);
    const why = w?.why || w?.note || "";
    return `• ${fmtISO(fromISO)} – ${fmtISO(toISO)} (${lbl})${why ? ` — ${why}` : ""}`;
  });

  const now = new Date(); const cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() + 24);
  const dashaLines = (dashaSpans || [])
  .filter((d) => {
    const a = Date.parse(d.fromISO);
    return !isNaN(a) && a <= +cutoff;
  })
  .slice(0, 8)
  .map((d) => {
    const note = (d as any)?.note as string | undefined;
    return `• ${fmtISO(d.fromISO)} → ${fmtISO(d.toISO)} — ${d.label}${note ? ` (${note})` : ""}`;
  });


  let summary = bottomLine?.lead || `Good opportunities are visible for ${who}.`;
  if (top.length > 0) {
    const f = getWinDates(top[0]).fromISO;
    const l = getWinDates(top[top.length - 1]).toISO;
    summary = `${cap(topic)}: promising period from ${fmtISO(f)} to ${fmtISO(l)}. ${bottomLine?.lead ?? ""}`.trim();
  }

  const parts: string[] = [];
  parts.push(`**Summary**\n${summary}`);
  if (bottomLine?.nuance) parts.push(`**Nuance**\n${bottomLine.nuance}`);
  if (bestLines.length) parts.push(`**Best windows**\n${bestLines.join("\n")}`);
  if (dashaLines.length) parts.push(`**Dasha highlights**\n${dashaLines.join("\n")}`);
  if (guidance.length) parts.push(`**Action plan**\n${guidance.map((g) => `• ${g}`).join("\n")}`);
  if (checklist.length) parts.push(`**Checklist**\n${checklist.map((c) => `• ${c}`).join("\n")}`);
  if (natal) parts.push(`**Astro reference**\n${natal}`);
  return { summary, text: parts.join("\n\n"), bestWindows: bestLines, dashaHighlights: dashaLines };
}

function safeWindows(wins: any[]): any[] {
  return (wins || []).filter((w) => {
    const { fromISO, toISO } = getWinDates(w);
    const a = Date.parse(fromISO || "");
    const b = Date.parse(toISO || "");
    return Number.isFinite(a) && !Number.isNaN(a) && Number.isFinite(b) && !Number.isNaN(b);
  });
}

/* ============================= MAIN HANDLER ============================= */
export async function handleQA(
  query: string,
  profile: Profile,
  opts?: { dashaSpans?: DashaSpan[] }
): Promise<QAResult> {
  const intent: Intent = detectIntent(query);

  // Prefer the Life Report engine bridge
  let autoDashaSpans: DashaSpan[] = [];
  if (opts?.dashaSpans?.length) {
    autoDashaSpans = opts.dashaSpans;
  } else if (profile?.birth) {
    autoDashaSpans = await fetchDashaSpans({
      dateISO: profile.birth.dateISO,
      time: profile.birth.time,
      tz: profile.birth.tz,
      lat: profile.birth.lat,
      lon: profile.birth.lon,
    }, 3);
  }

  const dashaCtx = activeDashaContext(autoDashaSpans);
  const timingPrefix = autoDashaSpans.length
    ? `Job timing: dasha-aligned windows (${autoDashaSpans.length})`
    : `Job timing: synthetic fallback`;

  switch (intent) {
    case "vehicle":
    case "property":
    case "job":
    case "wealth":
    case "health":
    case "relationships":
    case "disputes":
    case "marriage": {
      const res = await timingForTopic({
        topic: intent as any,
        profile,
        horizonDays: 120,
        dashaSpans: autoDashaSpans,
      });
      if (!res.ok) return { ok: false, title: cap(intent), answer: "", error: res.error ?? "Failed." };

      const defaultLead =
        intent === "vehicle" ? "A cautious buy is possible; use windows intentionally."
      : intent === "job" ? "Momentum via structured outreach; expect quality spikes."
      : intent === "marriage"
        ? "Marriage is most likely when 7th-house factors and dasha align; use the strongest window(s) for formal steps."
        : "Use the windows deliberately; patience between them helps.";

      const topicKey = intent as string;
      const safeBottom = res.bottomLine ?? { lead: defaultLead };
      const wins = safeWindows(res.windows ?? []);
      const narrative = buildStructuredNarrative({
        topic: topicKey,
        name: profile.name,
        windows: wins,
        bottomLine: safeBottom,
        guidance: res.guidance ?? GUIDANCE[topicKey] ?? [],
        checklist: res.checklist ?? CHECKLIST[topicKey] ?? [],
        natal: res.natal ?? NATAL[topicKey],
        dashaSpans: autoDashaSpans,
      });

      return {
        ok: true,
        title: `${icon(topicKey)} ${cap(topicKey)} timing for ${profile.name ?? "you"}`,
        answer: narrative.summary,
        topic: topicKey,
        windows: wins,
        bottomLine: safeBottom,
        context: dashaCtx?.line ? `${timingPrefix}\n${dashaCtx.line}` : timingPrefix,
        natal: res.natal ?? NATAL[topicKey],
        guidance: res.guidance ?? GUIDANCE[topicKey],
        checklist: res.checklist ?? CHECKLIST[topicKey],
        extra: {
          ...res,
          dashaActive: dashaCtx?.raw,
          structured: {
            text: narrative.text,
            bestWindows: narrative.bestWindows,
            dashaHighlights: narrative.dashaHighlights,
          },
        },
      };
    }

    case "is_today_good": {
      const p = await getPanchang(new Date().toISOString(), profile.place);
      const wd = weekdayInTZ(profile.place.tz);
      if (!p) {
        const lead = `${wd} — Mixed influences. Prefer clarity tasks; avoid high-stakes late night.`;
        return {
          ok: true,
          title: "Is it a good day?",
          answer: lead,
          bottomLine: { lead, nuance: "Panchang unavailable — generic guidance shown." },
          context: dashaCtx?.line ?? CTX_FALLBACK,
          guidance: [
            "Do important starts near local midday (Abhijit ~12:00–12:48)",
            `Avoid Rahu Kaal (approx ${RAHU_APPROX[wd] ?? "slot varies"})`,
          ],
          checklist: ["Plan 3 key tasks", "Keep buffers in calendar", "Document decisions"],
          extra: { panchang: null, dashaActive: dashaCtx?.raw },
        };
      }
      const t = (p.tithi ?? "").toLowerCase();
      const pros = /(dwitiya|tritiya|panchami|saptami|dashami|ekadashi|trayodashi)/i.test(t);
      const cons = /(amavasya|ashtami|chaturdashi)/i.test(t);
      const lead = `${p.weekday ?? "Today"} — ${p.tithi ?? "Tithi unknown"}.`;
      return {
        ok: true,
        title: "Is it a good day?",
        answer: `${lead} ${pros ? "Supportive for momentum. " : ""}${cons ? "Keep it light." : ""}`.trim(),
        bottomLine: { lead, nuance: [pros ? "Supportive" : "", cons ? "Some restraint wise" : ""].filter(Boolean).join(" · ") },
        context: dashaCtx?.line ?? CTX_FALLBACK,
        guidance: ["Do important starts in Abhijit; avoid Rahu Kaal.", "Prefer clarity tasks over high-stakes if tithi is harsh."],
        checklist: ["Plan 3 priorities", "Keep buffers in calendar", "Document key decisions"],
        extra: { panchang: p, dashaActive: dashaCtx?.raw },
      };
    }

    case "date_muhurta": {
      const p = await getPanchang(new Date().toISOString(), profile.place);
      const wd = weekdayInTZ(profile.place.tz);
      if (!p) {
        const lead = "Prefer Abhijit around local midday (~12:00–12:48); avoid Rahu Kaal.";
        return {
          ok: true,
          title: "Date/Muhurta",
          answer: `${lead} (Approx Rahu for ${wd}: ${RAHU_APPROX[wd] ?? "varies"}).`,
          bottomLine: { lead, nuance: `Rahu (approx): ${RAHU_APPROX[wd] ?? "varies"}` },
          context: dashaCtx?.line ?? CTX_FALLBACK,
          guidance: ["Meet in bright, open settings", "Keep conversations light; focus on rapport", "Avoid very late-night slots"],
          checklist: ["Arrive a bit early", "Keep it under ~90 minutes", "End with a clear next step"],
          extra: { panchang: null, dashaActive: dashaCtx?.raw },
        };
      }
      const lead = "Prefer Abhijit; avoid Rahu Kaal for first meetings.";
      return {
        ok: true,
        title: "Date/Muhurta",
        answer: `${lead} Snapshot — ${p.tithi ?? "tithi?"}, ${p.nakshatra ?? "nakshatra?"}.`,
        bottomLine: { lead, nuance: `${p.tithi ?? "tithi?"}, ${p.nakshatra ?? "nakshatra?"}` },
        context: dashaCtx?.line ?? CTX_FALLBACK,
        guidance: ["Meet in bright, open settings", "Keep conversations light in harsher tithis"],
        checklist: ["Arrive early", "Keep it under 90 minutes", "End with a clear next step"],
        extra: { panchang: p, dashaActive: dashaCtx?.raw },
      };
    }

    case "color_today": {
      const { weekday, color } = colorForWeekday(profile.place.tz);
      const lead = `${weekday}: ${color}.`;
      return {
        ok: true,
        title: "Color for today",
        answer: lead,
        bottomLine: { lead },
        context: dashaCtx?.line ?? "Weekday lord color mapping; refine with Lagna/Moon later.",
        guidance: ["Choose one dominant tone", "Avoid clashing accents"],
        checklist: ["Primary color piece", "Neutral shoes/belt", "1 minimal accessory"],
        extra: { dashaActive: dashaCtx?.raw },
      };
    }

    case "ekadashi_next": {
      const hit = await findNextEkadashi(new Date().toISOString(), profile.place);
      if (!hit) {
        const lead = "Couldn't find an upcoming Ekadashi in the near scan.";
        return { ok: true, title: "Ekadashi", answer: lead, bottomLine: { lead }, context: dashaCtx?.line ?? CTX_FALLBACK };
      }
      const lead = `${hit.weekday}, ${hit.date} (${hit.name}).`;
      return {
        ok: true,
        title: "Next Ekadashi",
        answer: lead,
        bottomLine: { lead },
        context: "Fasting/vrat day; keep workload light and intentions clear.",
        guidance: ["Hydrate well", "Simple meals if fasting", "Spiritual study/reflection"],
        checklist: ["Plan meals", "Set a short intention", "Light evening routine"],
        extra: { ekadashi: hit, dashaActive: dashaCtx?.raw },
      };
    }

    case "generic_web": {
      const topic = inferTimingTopicFromText(query);
      if (topic) {
        const res = await timingForTopic({
          topic,
          profile,
          horizonDays: 120,
          dashaSpans: autoDashaSpans,
        });
        if (res.ok) {
          const safeBottom =
            res.bottomLine ?? {
              lead:
                topic === "vehicle" ? "A cautious buy is possible; use windows intentionally."
              : topic === "job" ? "Momentum via structured outreach; expect quality spikes."
              : topic === "marriage" ? "Marriage is most likely when 7th-house factors and dasha align; use the strongest window(s) for formal steps."
              : "Use the windows deliberately; patience between them helps.",
            };
          const wins = safeWindows(res.windows ?? []);
          const narrative = buildStructuredNarrative({
            topic, name: profile.name, windows: wins, bottomLine: safeBottom,
            guidance: res.guidance ?? GUIDANCE[topic],
            checklist: res.checklist ?? CHECKLIST[topic],
            natal: res.natal ?? NATAL[topic],
            dashaSpans: autoDashaSpans,
          });
          return {
            ok: true,
            title: `${icon(topic)} ${cap(topic)} timing for ${profile.name ?? "you"}`,
            answer: narrative.summary,
            topic,
            windows: wins,
            bottomLine: safeBottom,
            context: dashaCtx?.line
              ? `Job timing: dasha-aligned windows (${autoDashaSpans.length})\n${dashaCtx.line}`
              : "Job timing: synthetic fallback",
            natal: res.natal ?? NATAL[topic],
            guidance: res.guidance ?? GUIDANCE[topic],
            checklist: res.checklist ?? CHECKLIST[topic],
            extra: { ...res, structured: { text: narrative.text } },
          };
        }
      }
      return handleGenericWeb(query, dashaCtx?.line);
    }

    default: {
      return {
        ok: true,
        title: "I can help",
        answer:
          'Ask about job/vehicle/property/health/relationships/marriage/disputes, or daily tips like "is it a good day?", "color to wear?", "next Ekadashi?", or general what/when/how.',
        bottomLine: { lead: "How can I help?" },
        context: dashaCtx?.line ?? CTX_FALLBACK,
        guidance: ["Be specific about the goal", "Tell me your location for Panchang-based answers"],
        checklist: ["Pick one topic", "Add any timeline or constraints"],
        extra: { dashaActive: dashaCtx?.raw },
      };
    }
  }
}

/* ----------------------------- Helpers (outside handleQA) ----------------------------- */
function handleGenericWeb(q: string, ctxLine?: string): QAResult {
  const lead = "I'll look that up and summarize from reliable sources.";
  return {
    ok: true,
    title: "Web answer (summary)",
    answer: lead,
    bottomLine: { lead },
    context: ctxLine ?? "Generic knowledge query.",
    guidance: ["Prefer primary sources", "Cross-check dates and regions"],
    checklist: ["Clarify country/region if needed"],
    extra: { query: q },
  };
}

function inferTimingTopicFromText(
  q: string
): "vehicle" | "property" | "job" | "wealth" | "health" | "relationships" | "disputes" | "marriage" | null {
  const s = q.toLowerCase();
  if (/(car|vehicle|bike|scooter|automobile|buy.*(car|vehicle|bike)|delivery|registration)/.test(s)) return "vehicle";
  if (/(property|flat|apartment|house|home|land|plot|real ?estate|rent|lease|mortgage|possession|registration|handover)/.test(s)) return "property";
  if (/(job|career|offer|interview|promotion|raise|hike|switch|change role|join|resign|layoff|hiring|notice period|onsite)/.test(s)) return "job";
  if (/(wealth|invest|investment|stock|share|mutual fund|sip|dca|portfolio|money|crypto|gold|etf|options)/.test(s)) return "wealth";
  if (/(health|diet|sleep|workout|exercise|recovery|injury|stress|therapy|doctor|surgery|operation)/.test(s)) return "health";
  if (/(marry|married|marriage|wed|wedding|engagement|fiance|fiancé|fiancée|shaadi|vivah|when\s+will\s+i\s+get\s+married)/.test(s)) return "marriage";
  if (/(relationship|dating|date|girlfriend|boyfriend|partner|spouse|love|reconcile|break ?up)/.test(s)) return "relationships";
  if (/(dispute|legal|lawsuit|case|court|settle|mediation|complaint|penalty|fine|notice|summons)/.test(s)) return "disputes";
  return null;
}
