// src/app/api/astro-chat/route.ts

const chatContext = new Map<string, string[]>(); // memory of recent questions
const lastFollowup = new Map<string, string>();  // last followup lane we offered
const lastFacts = new Map<string, any>();        // last astroFacts bundle
const MAX_HISTORY = 6;

export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";

/* --------------------------------------------------
   Types
-------------------------------------------------- */

type BirthData = {
  name?: string;
  dateISO: string;
  time: string;
  tz: string;
  lat: number;
  lon: number;
};

type ActivePeriods = {
  mahadasha?: {
    lord: string;
    start: string;
    end: string;
    summary?: string;
  };
  antardasha?: {
    mahaLord: string;
    subLord: string;
    start: string;
    end: string;
    summary?: string;
  };
  pratyantardasha?: {
    mahaLord: string;
    antarLord: string;
    lord: string;
    start: string;
    end: string;
    summary?: string;
  };
};

type TimelineWindow = {
  from: string;
  to: string;
  label: string;
  score: number;
  mdLord: string;
  adLord: string;
  pdLord: string;
  highlights: string[];
  blurb: string;
};

type TransitWindow = {
  from: string;
  to: string;
  focusArea: string;
  driver: string;
  riskFlag?: "caution" | "opportunity" | "mixed";
  summary: string;
  actions: string[];
};

type LifeReportLike = {
  activePeriods?: ActivePeriods;
  timeline?: TimelineWindow[];
  transitWindows?: TransitWindow[];
  birth?: BirthData;
  natal?: {
    ascSign?: string | null;
    moonSign?: string | null;
    moonNakshatra?: string | null;
  };
};
type DailyRhythm = {
  tone: string;
  focus: string;
  avoid: string;
  foodHint: string;
  relationshipHint: string;
  moneyHint: string;
  oneStep: string;
};


type AstroChatRequest = {
  question?: string;
  birth?: BirthData | null;
  // frontend may send either "report" or "reportData"
  report?: LifeReportLike | null;
  reportData?: LifeReportLike | null;
};

/* --------------------------------------------------
   Util
-------------------------------------------------- */

function okJson(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function badJson(message: string, status = 400) {
  return okJson({ error: message }, status);
}

function safeInternalURL(req: Request, path: string) {
  try {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const u = new URL(req.url);
    return u.origin + cleanPath;
  } catch {
    return "http://localhost:3000" + path;
  }
}

function fmtDateShort(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function fmtRange(fromISO?: string, toISO?: string) {
  return `${fmtDateShort(fromISO)} – ${fmtDateShort(toISO)}`;
}

function strengthBar(n: number): string {
  const full = "🔹";
  const empty = "⚪";
  const clamped = Math.min(5, Math.max(1, n));
  return full.repeat(clamped) + empty.repeat(5 - clamped);
}

/* --------------------------------------------------
   Topic + emotion sensing
-------------------------------------------------- */

function detectTopic(
  q: string
): "career" | "money" | "relationship" | "health" | "generic" {
  const lower = q.toLowerCase();

  if (
    lower.includes("promotion") ||
    lower.includes("job") ||
    lower.includes("role") ||
    lower.includes("title") ||
    lower.includes("boss") ||
    lower.includes("career") ||
    lower.includes("work") ||
    lower.includes("office") ||
    lower.includes("job change") ||
    lower.includes("job switch") ||
    lower.includes("new job")
  ) return "career";

  if (
    lower.includes("money") ||
    lower.includes("income") ||
    lower.includes("wealth") ||
    lower.includes("finance") ||
    lower.includes("salary") ||
    lower.includes("bonus") ||
    lower.includes("raise")
  ) return "money";

  if (
    lower.includes("relationship") ||
    lower.includes("marriage") ||
    lower.includes("partner") ||
    lower.includes("love") ||
    lower.includes("spouse")
  ) return "relationship";

  if (
    lower.includes("health") ||
    lower.includes("body") ||
    lower.includes("stress") ||
    lower.includes("energy") ||
    lower.includes("fatigue") ||
    lower.includes("sleep") ||
    lower.includes("burnout")
  ) return "health";

  return "generic";
}
function isFoodQuestion(q: string): boolean {
  const l = q.toLowerCase();

  // direct food/eating keywords
  if (
    /\b(what should i eat|kya khau|kya khana hai|what to eat|eat today|diet|food|khana|khaana|meal|lunch|dinner)\b/.test(
      l
    )
  ) {
    return true;
  }

  // softer forms like "is this food ok", "should I avoid X"
  if (/(is .* good for (me|health)|should i avoid .* food|healthy to eat)/.test(l)) {
    return true;
  }

  return false;
}

function inferMood(q: string): string {
  const l = q.toLowerCase();

  if (
    l.includes("anxious") || l.includes("anxiety") || l.includes("scared") ||
    l.includes("worried") || l.includes("worry") || l.includes("stressed") ||
    l.includes("burnout") || l.includes("burned out") ||
    l.includes("tired") || l.includes("exhausted") ||
    l.includes("nothing is moving") || l.includes("stuck") ||
    l.includes("losing hope")
  ) {
    return "the user sounds worried / stressed and needs reassurance and clarity";
  }

  if (
    l.includes("promotion") || l.includes("next role") ||
    l.includes("when will i get") || l.includes("when can i move") ||
    l.includes("job change") || l.includes("career window") ||
    l.includes("raise") || l.includes("money") ||
    l.includes("when do i get a new job") || l.includes("when will i get a new job")
  ) {
    return "the user sounds ambitious and impatient and wants timing they can act on";
  }

  if (
    l.includes("relationship") || l.includes("love") || l.includes("marriage") ||
    l.includes("heart") || l.includes("feel") || l.includes("feelings")
  ) {
    return "the user sounds emotionally vulnerable and wants emotional context, not just dates";
  }

  return "neutral curiosity, just answer naturally and be supportive";
}

function detectDistress(q: string): boolean {
  const l = q.toLowerCase();
  const triggers = [
    "stuck","nothing is moving","nothing is happening","why is nothing",
    "i'm tired","i am tired","tired of this","exhausted","burned out","burnt out",
    "frustrated","frustration","losing hope","lose hope","scared","worried","anxious","anxiety",
    "panic","am i cursed","am i screwed","is this bad","when will this end","why me",
    "fed up","give up","too far","that's too far","too long",
  ];
  return triggers.some((t) => l.includes(t));
}

function reassureUser(topic: string): string {
  if (topic === "career")
    return "You're not failing. This timing is slow-build, not dead. The chart is saying 'stack proof and be seen', not 'you're done'.";
  if (topic === "health")
    return "Your chart does not say permanent damage. It says 'watch stress load, protect sleep, don't self-abandon'.";
  if (topic === "relationship")
    return "This isn't 'you're unlovable'. It's a boundary-and-truth chapter, not permanent loneliness.";
  if (topic === "money")
    return "This is 'delayed inflow', not 'no inflow'. It's timing, not doom.";
  return "I can feel how heavy this is. This is shaping energy, not punishment. You're not broken.";
}

/* --------------------------------------------------
   Follow-up classifier
-------------------------------------------------- */

function isShortFollowup(q: string): boolean {
  const t = q.trim().toLowerCase();

  if (
    t.length <= 14 &&
    ["yes","yeah","yep","ok","okay","sure","go on","tell me more","continue","keep going","right","correct","hmm","hm"].includes(t)
  ) return true;

  if (/(near\s*term|near\s*fut|current|right now|this week|this month|today|short term|in the meantime|for now|too far|is too far|closer)/i.test(t))
    return true;

  if (/(safe|stability|stable|secure|risk|jump|leave|quit|should i leave|should i quit|safe to move)/i.test(t))
    return true;

  return false;
}

/* --------------------------------------------------
   Timing helpers
-------------------------------------------------- */

function toneForLord(lord?: string): string {
  if (!lord) return "";
  const L = lord.toLowerCase();
  if (L === "jupiter") return "growth and guidance, mentors, fortunate openings if you step forward";
  if (L === "venus")   return "charisma, attraction, comfort-seeking, polishing how you present yourself";
  if (L === "saturn")  return "pressure, responsibility, audit-and-build mode; slow work that actually lasts";
  if (L === "rahu")    return "risk appetite, hungry ambition, edgy moves that bend rules";
  if (L === "ketu")    return "cutting noise, spiritual cleanup, detaching from drama and fake obligations";
  if (L === "mercury") return "communication, documents, logistics, getting clarity in plans";
  if (L === "mars")    return "action, confrontation, decisive movement, protect your energy";
  if (L === "sun")     return "visibility and authority; you’re being seen and judged, so stand tall";
  if (L === "moon")    return "emotional flow, instincts, comfort and security needs";
  return "activation around a key theme.";
}
function pickActiveTransitNow(
  report: LifeReportLike | null | undefined
): TransitWindow | null {
  if (!report?.transitWindows || !Array.isArray(report.transitWindows)) return null;

  const now = Date.now();

  const tagged = report.transitWindows
    .map((w) => {
      const from = new Date(w.from).getTime();
      const to = new Date(w.to).getTime();
      return { w, from, to };
    })
    .filter((x) => Number.isFinite(x.from) && Number.isFinite(x.to));

  if (!tagged.length) return null;

  // 1) window that actually covers "now"
  let active = tagged.find((x) => now >= x.from && now <= x.to);
  if (!active) {
    // 2) nearest upcoming window
    active = [...tagged]
      .filter((x) => x.from >= now)
      .sort((a, b) => a.from - b.from)[0];
  }
  if (!active) {
    // 3) fallback: most recent past window
    active = [...tagged].sort((a, b) => b.to - a.to)[0];
  }

  return active ? active.w : null;
}

function buildShortHorizon(
  report?: LifeReportLike | null,
  span: "day" | "week" | "month" = "day"
): string {
  if (!report?.activePeriods) {
    return "I need your dasha context to read the moment. Open Life Report first.";
  }

  const { mahadasha, antardasha, pratyantardasha } = report.activePeriods;
  const maha = mahadasha?.lord || "—";
  const antar = antardasha?.subLord || "—";
  const praty = pratyantardasha?.lord || "—";

  const antarTone = toneForLord(antar);
  const pratyTone = toneForLord(praty);

  let label = "Today's tone";
  if (span === "week")  label = "This week’s tone";
  if (span === "month") label = "This month’s tone";

  let guidance = "";
  const P = praty.toLowerCase();
  if (P === "saturn")       guidance = "Do the boring thing properly; slow progress counts.";
  else if (P === "venus")   guidance = "Be likable and visible; charm beats force.";
  else if (P === "mars")    guidance = "Take initiative but don't start pointless fights.";
  else if (P === "ketu")    guidance = "Detach from drama and keep priorities clean.";
  else if (P === "rahu")    guidance = "Chase bold opportunities, but stay grounded and ethical. Don't panic-grab.";
  else if (P === "jupiter") guidance = "Seek mentorship; good advice lands easily now.";
  else if (P === "mercury") guidance = "Communicate clearly; organize your plans/papers.";
  else if (P === "sun")     guidance = "Take ownership; visibility brings growth.";
  else if (P === "moon")    guidance = "Honor emotions; don't override your body.";
  else                      guidance = "Stay steady; ignore noise.";

  // 🔹 Natal Moon flavour (uses sarathi.lifeReportCache.v2 → .natal)
    const natal = (report as any)?.natal;
  let natalLine = "";

  if (span === "day" && natal?.moonNakshatra) {
    const theme =
      natal.moonNakshatraTheme &&
      String(natal.moonNakshatraTheme).trim().length
        ? ` (${natal.moonNakshatraTheme})`
        : "";

    natalLine =
      `Natal flavour: Moon in ${natal.moonNakshatra}${theme} — today feels better if you add a small moment of joy/creativity instead of running only on duty and pressure.`;
  }


  return [
    `${label}: ${antar} → ${antarTone}.`,
    `Right-now trigger: ${praty} → ${pratyTone}.`,
    natalLine,
    `Use it like this: ${guidance}`,
    `Active stack: ${maha} / ${antar} / ${praty}`,
  ]
    .filter(Boolean)
    .join(" ");
}


/* -------------------- Topic scoring -------------------- */

function pickBestTransitWindows(
  report: LifeReportLike | null | undefined,
  topic: string
) {
  if (!report?.transitWindows || !Array.isArray(report.transitWindows)) return [];

  function scoreTransitForTopic(t: TransitWindow, topic: string): number {
    const area = (t.focusArea || "").toLowerCase();
    const driver = (t.driver || "").toLowerCase();
    const summary = (t.summary || "").toLowerCase();

    if (topic === "career") {
      if (
        area.includes("career") || area.includes("status") || area.includes("recognition") ||
        summary.includes("career") || driver.includes("10th") || driver.includes("11th") ||
        driver.includes("reputation") || driver.includes("visibility")
      ) return 10;
    }
    if (topic === "money") {
      if (
        area.includes("money") || area.includes("income") || area.includes("wealth") ||
        area.includes("earnings") || summary.includes("money") || summary.includes("income") ||
        driver.includes("2nd") || driver.includes("11th")
      ) return 10;
    }
    if (topic === "relationship") {
      if (
        area.includes("relationship") || area.includes("partnership") || area.includes("marriage") ||
        driver.includes("7th") || summary.includes("relationship")
      ) return 10;
    }
    if (topic === "health") {
      if (
        area.includes("health") || area.includes("body") || area.includes("recovery") ||
        area.includes("stress") || driver.includes("6th") || driver.includes("8th") ||
        summary.includes("health")
      ) return 10;
    }

    // generic or weak match
    return 1;
  }

  const ranked = report.transitWindows
    .map((tw) => ({ win: tw, s: scoreTransitForTopic(tw, topic) }))
    .sort((a, b) => b.s - a.s);

  if (!ranked.length) return [];

  // 🔹 For generic questions ("how is my day looking"), still use the top windows
  if (topic === "generic") {
    return ranked.slice(0, 2).map((r) => r.win);
  }

  // 🔹 For specific topics, keep the stronger threshold
  return ranked
    .filter((r) => r.s >= 5)
    .slice(0, 2)
    .map((r) => r.win);
}


function pickFromTimeline(
  report: LifeReportLike | null | undefined,
  topic: string
) {
  if (!report?.timeline || !Array.isArray(report.timeline)) return null;

  const scored = report.timeline.map((w) => {
    const hay = `${w.label} ${w.blurb} ${(w.highlights || []).join(" ")}`.toLowerCase();
    let score = 0;

    const topicKeys: Record<string, string[]> = {
      career: ["career","status","recognition","authority","promotion","visibility","leadership"],
      money: ["money","income","finance","wealth","bonus","gain","raise"],
      relationship: ["relationship","partner","marriage","union"],
      health: ["health","body","stress","vitality","energy","wellbeing"],
      generic: [],
    };
    for (const k of topicKeys[topic] ?? []) if (hay.includes(k)) score += 2;

    const ad = (w.adLord || "").toLowerCase();
    const pd = (w.pdLord || "").toLowerCase();

    if (topic === "career" && /(sun|mars|jupiter|saturn|venus|rahu)/.test(ad + pd)) score += 2;
    if (topic === "money" && /(venus|mercury|jupiter|rahu)/.test(ad + pd)) score += 2;
    if (topic === "health" && /(venus|moon|mercury|sun)/.test(ad + pd)) score += 2;
    if (topic === "relationship" && /(venus|moon|jupiter)/.test(ad + pd)) score += 2;

    return { w, score };
  });

  const best = scored.sort((a, b) => b.score - a.score)[0];
  return best?.score ? best.w : null;
}

function scoreTransitCareerWindow(win: TransitWindow): number {
  let s = 3;
  const driver = (win.driver || "").toLowerCase();
  const area = (win.focusArea || "").toLowerCase();

  if (area.includes("career") || area.includes("status") || area.includes("recognition") ||
      driver.includes("10th") || driver.includes("11th") ||
      driver.includes("reputation") || driver.includes("visibility")) s += 1;

  if (win.riskFlag === "opportunity") s += 1;
  if (win.riskFlag === "caution") s -= 1;

  if (s < 1) s = 1;
  if (s > 5) s = 5;
  return s;
}

function scoreCareerWindow(
  adLord: string | undefined,
  pdLord: string | undefined,
  baseScore?: number
): number {
  let s = 0;
  if (typeof baseScore === "number") s += baseScore / 2;

  const combo = `${adLord || ""} ${pdLord || ""}`.toLowerCase();
  if (/(sun|venus|jupiter)/.test(combo)) s += 2;
  if (/(mars|rahu)/.test(combo)) s += 1;
  if (/(saturn)/.test(combo)) s += 1;

  if (s < 1) s = 1;
  if (s > 5) s = 5;
  return Math.round(s);
}

function buildCareerBriefStructured(opts: { report?: LifeReportLike | null }) {
  const { report } = opts;
  const bestTransit = pickBestTransitWindows(report, "career");
  const bestTimeline = pickFromTimeline(report, "career");

  if (bestTransit.length) {
    const w = bestTransit[0];
    const strength = scoreTransitCareerWindow(w);
    const confidenceWord = strength >= 4 ? "high" : strength === 3 ? "medium" : "low";

    return {
      topic: "career",
      type: "career_window",
      hasWindow: true,
      windowRange: fmtRange(w.from, w.to),
      strengthScore: strength,
      confidenceWord,
      strengthBar: strengthBar(strength),
      why: w.driver || "",
      theme: w.summary || "",
      firstAction: w.actions?.[0] || "",
      note: "Transit + your dasha suggests visibility / recognition pressure",
    };
  }

  const bestTimelineWin = bestTimeline;
  if (bestTimelineWin) {
    const strength = scoreCareerWindow(bestTimelineWin.adLord, bestTimelineWin.pdLord, bestTimelineWin.score);
    const confidenceWord = strength >= 4 ? "high" : strength === 3 ? "medium" : "low";

    return {
      topic: "career",
      type: "career_window",
      hasWindow: true,
      windowRange: fmtRange(bestTimelineWin.from, bestTimelineWin.to),
      strengthScore: strength,
      confidenceWord,
      strengthBar: strengthBar(strength),
      why: `${bestTimelineWin.adLord} (active sub-lord) + ${bestTimelineWin.pdLord} (immediate trigger) pushes status / authority.`,
      theme: bestTimelineWin.blurb ? bestTimelineWin.blurb.trim().replace(/\s+/g, " ") : "",
      firstAction: "Step forward during that period instead of waiting to be picked.",
      note: "Dasha combo supports recognition / authority.",
    };
  }

  return {
    topic: "career",
    type: "career_window",
    hasWindow: false,
    message:
      "I don't see a clean promotion spike in the data yet. That usually means the current sub-period isn't pure 'authority/visibility'. Momentum flips when the sub-lord changes.",
  };
}

function scoreGenericWindow(
  topic: string,
  winTimeline?: TimelineWindow | null,
  winTransit?: TransitWindow | null
): number {
  if (winTransit) {
    let base = 3;
    if (winTransit.riskFlag === "opportunity") base += 1;
    if (winTransit.riskFlag === "caution") base -= 1;
    if (base < 1) base = 1;
    if (base > 5) base = 5;
    return base;
  }

  if (winTimeline) {
    let base = typeof winTimeline.score === "number" ? winTimeline.score / 2 : 3;

    const ad = (winTimeline.adLord || "").toLowerCase();
    const pd = (winTimeline.pdLord || "").toLowerCase();

    if (topic === "health" && /(moon|venus|sun|mercury)/.test(ad + pd)) base += 1;
    if (topic === "money"  && /(venus|jupiter|mercury|rahu)/.test(ad + pd)) base += 1;
    if (topic === "relationship" && /(venus|moon|jupiter)/.test(ad + pd)) base += 1;

    if (base < 1) base = 1;
    if (base > 5) base = 5;
    return Math.round(base);
  }

  return 3;
}

function buildGenericBrief(opts: {
  topic: string;
  question: string;
  report?: LifeReportLike | null;
}): string {
  const { topic, report } = opts;

  const bestTransit = pickBestTransitWindows(report, topic);
  const bestTimeline = pickFromTimeline(report, topic);

  // 1) If we have transit windows, use them first
  if (bestTransit.length) {
    const w = bestTransit[0];
    const strength = scoreGenericWindow(topic, null, w);
    const bar = strengthBar(strength);

    return [
      `${fmtRange(w.from, w.to)} is the key window for ${topic}.`,
      `Strength: ${strength}/5 ${bar}`,
      w.driver ? `Driver: ${w.driver}.` : null,
      w.summary ? `Theme: ${w.summary}` : null,
      w.actions && w.actions.length ? `Action: ${w.actions[0]}` : null,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // 2) Else fall back to timeline window
  if (bestTimeline) {
    const strength = scoreGenericWindow(topic, bestTimeline, null);
    const bar = strengthBar(strength);

    return [
      `${fmtRange(bestTimeline.from, bestTimeline.to)} is a key phase for ${topic}.`,
      `Strength: ${strength}/5 ${bar}`,
      bestTimeline.blurb ? `Theme: ${bestTimeline.blurb.trim().replace(/\s+/g, " ")}` : null,
      bestTimeline.adLord ? `Active sub-lord: ${bestTimeline.adLord}.` : null,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // 3) If no future window, anchor to current AD
  const runningSubLord =
    report?.activePeriods?.antardasha?.subLord || "your current sub-lord";

  return `No specific future window tagged, but ${runningSubLord} is setting the tone. Watch the next sub-lord change for the next real shift in ${topic}.`;
}


/* --------------------------------------------------
   Evidence / Why section
-------------------------------------------------- */

function buildWhyEvidence(opts: {
  report?: LifeReportLike | null;
  topic: "career" | "money" | "relationship" | "health" | "generic";
}) {
  const { report, topic } = opts;
  const bullets: string[] = [];
  if (!report) return bullets;

  const md = report.activePeriods?.mahadasha;
  const ad = report.activePeriods?.antardasha;
  const pd = report.activePeriods?.pratyantardasha;
  if (md || ad || pd) {
    const parts: string[] = [];
    if (md?.lord) parts.push(`MD ${md.lord} ${fmtRange(md.start, md.end)}`);
    if (ad?.subLord) parts.push(`AD ${ad.subLord} ${fmtRange(ad.start, ad.end)}`);
    if (pd?.lord) parts.push(`PD ${pd.lord} ${fmtRange(pd.start, pd.end)}`);
    if (parts.length) bullets.push(`Active dasha stack → ${parts.join(" • ")}`);
  }

  const bestTransit = pickBestTransitWindows(report, topic);
  if (bestTransit.length) {
    for (const w of bestTransit.slice(0, 2)) {
      const toneText =
  w.riskFlag === "opportunity"
    ? "tone: opportunity-leaning"
    : w.riskFlag === "caution"
    ? "tone: caution/learning"
    : w.riskFlag === "mixed"
    ? "tone: balanced / mixed signals"
    : "";

bullets.push(
  `Transit window ${fmtRange(w.from, w.to)} → ${w.focusArea || "focus"}; driver: ${w.driver}${toneText ? `; ${toneText}` : ""}`
);

    }
  }

  const bestTimeline = pickFromTimeline(report, topic);
  if (bestTimeline) {
    bullets.push(
      `Dasha timeline ${fmtRange(bestTimeline.from, bestTimeline.to)} → AD ${bestTimeline.adLord}, PD ${bestTimeline.pdLord}${typeof bestTimeline.score === "number" ? `; score ${bestTimeline.score}` : ""}`
    );
  }

  if (!bullets.length && ad?.subLord) {
    bullets.push(`Tone set by ${ad.subLord} Antardasha until ${fmtDateShort(ad.end)}.`);
  }

  return bullets;
}

/* --------------------------------------------------
   Remedies / next phases / concept explainers
-------------------------------------------------- */

function remedyForPlanet(p: string): string {
  const key = p.toLowerCase();
  if (key === "sun")    return "Respect father/mentors, offer water to the rising Sun, ruby only if Sun actually supports your chart.";
  if (key === "moon")   return "Protect sleep + nervous system, show care to mother energy, pearl only if Moon is safe for you.";
  if (key === "mars")   return "Move your body, burn anger cleanly, avoid impulsive fights. Coral only if Mars won't overheat you.";
  if (key === "mercury")return "Write things down, speak clearly, avoid gossip. Emerald only if Mercury is friendly to your lagna.";
  if (key === "jupiter")return "Seek advice from real mentors, support education, 'Om Gurave Namah'. Yellow sapphire only if Jupiter is benefic for you.";
  if (key === "venus")  return "Keep your space kind and aesthetic, practice soft diplomacy, rein in overindulgence. Diamond/opal only if Venus truly helps you.";
  if (key === "saturn") return "Do the responsible thing consistently, help elderly/poor, 'Om Sham Shanicharaya Namah'. Blue sapphire ONLY if Saturn is genuinely protective for you.";
  if (key === "rahu")   return "Avoid panic moves / shortcuts, ground yourself, donate darker clothes/food on Saturdays.";
  if (key === "ketu")   return "Cut fake obligations, feed/comfort stray dogs, allow emotional detox. Cat’s eye ONLY if it's actually aligned.";
  return "Serve honestly, stay clean, protect your peace — that supports any planet.";
}

function buildRemedyAnswer(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) return "I'd need your dasha context to suggest safe remedies. Open Life Report first.";

  const { mahadasha, antardasha, pratyantardasha } = report.activePeriods;
  const md = mahadasha?.lord || "";
  const ad = antardasha?.subLord || "";
  const pd = pratyantardasha?.lord || "";

  const uniquePlanets = Array.from(new Set([md, ad, pd].filter(Boolean)));
  if (!uniquePlanets.length) return "I can't see your active dasha rulers clearly, so I'd be guessing remedies — not safe.";

  const tips = uniquePlanets.map((p) => `• ${p} → ${remedyForPlanet(p)}`).join("\n");
  return `Practical stuff aligned with your *right now* planets:\n\n${tips}\n\nDo these from sincerity, not fear.`;
}

function buildNextPhases(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) return "I need your dasha timeline to forecast next phases. Open Life Report first so I can cache it.";

  const { antardasha } = report.activePeriods;
  const nowMs = Date.now();

  const futureWins = (report.timeline ?? []).filter((w) => {
    const start = new Date(w.from).getTime();
    return Number.isFinite(start) && start > nowMs;
  });

  if (!futureWins.length) {
    if (antardasha?.subLord && antardasha?.end) {
      return `Right now you're in ${antardasha.subLord} Antardasha. That chapter ends around ${new Date(antardasha.end).toLocaleDateString()}. Your next pivot is when that sub-period changes — that's when tone and opportunity actually flip.`;
    }
    return "You're still in this active Antardasha. The next sub-period change is your real pivot.";
  }

  futureWins.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
  const picks = futureWins.slice(0, 2);

  const bullets = picks.map((w) => {
    const rng = `${fmtDateShort(w.from)} → ${fmtDateShort(w.to)}`;
    const tone = w.blurb ? w.blurb.trim().replace(/\s+/g, " ") : w.label;
    return `• ${rng}: ${tone} (AD ${w.adLord}, PD ${w.pdLord})`;
  });

  return "Your next phases:\n" + bullets.join("\n") + "\nThese are legit pivot windows where life changes tone.";
}

function explainPlanet(p: string): string | null {
  const key = p.toLowerCase();
  if (key === "sun")    return "Sun = ego, identity, authority, visibility, father-energy. Strong Sun = 'I show up', weak Sun = 'I chase validation'.";
  if (key === "moon")   return "Moon = emotional needs, comfort, mood, intuition, mother-energy. It's how you self-soothe and feel safe.";
  if (key === "mars")   return "Mars = drive, action, anger, courage. Strong Mars = momentum. Unbalanced Mars = conflict or burnout.";
  if (key === "mercury")return "Mercury = thinking, speech, logistics, deals. It's how you organize chaos and negotiate reality.";
  if (key === "jupiter")return "Jupiter = wisdom, growth, teachers, faith, protection. It opens doors when you're aligned.";
  if (key === "venus")  return "Venus = love, charm, pleasure, taste, beauty. It's how you attract and bond.";
  if (key === "saturn") return "Saturn = responsibility, structure, time. It's pressure that matures you and gives durable results.";
  if (key === "rahu")   return "Rahu = obsession, ambition, 'I want more now'. Big gains + anxiety in the same package.";
  if (key === "ketu")   return "Ketu = detachment, spiritual cleanup, cutting fake obligations. Feels like loss because it's cleanup.";
  return null;
}

function explainHouse(num: string): string | null {
  if (num === "1" || /1st|first/.test(num))  return "1st house = self, body, how you show up, how you initiate.";
  if (num === "2" || /2nd|second/.test(num)) return "2nd house = money you earn, voice, values, stability.";
  if (num === "3" || /3rd|third/.test(num))  return "3rd house = hustle, self-made effort, siblings, communication.";
  if (num === "4" || /4th|fourth/.test(num)) return "4th house = home, inner peace, mother, real emotional safety.";
  if (num === "5" || /5th|fifth/.test(num))  return "5th house = romance, creativity, playful confidence, speculative luck.";
  if (num === "6" || /6th|sixth/.test(num))  return "6th house = stress, grind, routine work, health maintenance, discipline.";
  if (num === "7" || /7th|seventh/.test(num))return "7th house = partner, marriage, PR, one-on-one bonding, contracts.";
  if (num === "8" || /8th|eighth/.test(num)) return "8th house = shared resources, crisis alchemy, taboo power, rebirth.";
  if (num === "9" || /9th|ninth/.test(num))  return "9th house = meaning, mentorship, long journeys, lucky alignment.";
  if (num === "10" || /10th|tenth/.test(num))return "10th house = public status, career, leadership, visible success.";
  if (num === "11" || /11th|eleventh/.test(num))return "11th house = gains, network, audience, social proof, payout from long grind.";
  if (num === "12" || /12th|twelfth/.test(num))return "12th house = isolation, sleep, surrender, letting go, foreign lands.";
  return null;
}

function explainTimingTerm(q: string): string | null {
  const l = q.toLowerCase();
  if (l.includes("mahadasha") || l.includes("maha dasha"))
    return "Mahadasha = the main multi-year chapter. It's the big storyline you're living inside.";
  if (l.includes("antardasha") || l.includes("antar dasha") || l.includes("sub period"))
    return "Antardasha = the sub-chapter running the day-to-day tone right now.";
  if (l.includes("pratyantardasha") || l.includes("pratyantar") || l.includes("pd"))
    return "Pratyantardasha = the micro-spike timing. That's why this month feels like THIS.";
  if (l.includes("transit"))
    return "Transit = planets in the sky hitting your chart. Transit says 'ok but when does it show in real life'.";
  return null;
}

function lookupAstroConcept(question: string): string | null {
  const q = question.toLowerCase().trim();

  const planets = ["sun","moon","mars","mercury","jupiter","venus","saturn","rahu","ketu"];
  for (const p of planets) {
    if (q.includes(p)) {
      const expl = explainPlanet(p);
      if (expl) return expl;
    }
  }

  const houseMatch = q.match(/(\d+)(st|nd|rd|th)?\s+house/) || q.match(/house\s+(\d+)/);
  if (houseMatch) {
    const hNum = houseMatch[1];
    const expl = explainHouse(hNum);
    if (expl) return expl;
  }

  const termExpl = explainTimingTerm(q);
  if (termExpl) return termExpl;

  if (q.startsWith("what is") || q.startsWith("what's") || q.startsWith("whats") ||
      q.includes("explain") || q.includes("meaning of") || q.includes("what does it mean")) {
    return "In Vedic terms: planets = actors, houses = areas of life, dasha = timing engine, transits = real-world trigger. I map those to you, not in generic textbook form.";
  }

  return null;
}
function buildFoodAnswer(report: LifeReportLike | null): string {
  // --- 1) Read dasha stack safely ---
  const md = report?.activePeriods?.mahadasha?.lord || "";
  const ad = report?.activePeriods?.antardasha?.subLord || "";
  const pd = report?.activePeriods?.pratyantardasha?.lord || "";

  const stack = `${md} ${ad} ${pd}`.toLowerCase();

  const saturnActive = stack.includes("saturn");
  const ketuActive = stack.includes("ketu");
  const rahuActive = stack.includes("rahu");

  // --- 2) Natal flavour (Moon nakshatra) ---
  const moonNak = report?.natal?.moonNakshatra || "";
  const nakLower = moonNak.toLowerCase();
  const isPurvaPhalguni =
    nakLower.includes("purva") && nakLower.includes("phalg");

  // default joy line, tweaked if Purva Phalguni
  let joyLine =
    "Add a small, intentional pleasure to your plate — a date, a bite of jaggery, or a nicely plated meal. Not indulgence, just a gentle reminder that you’re allowed small joys.";

  if (isPurvaPhalguni) {
    joyLine =
      "Add a small, intentional pleasure to your plate — a date, a bit of jaggery, or a nicely plated dish. Your Purva Phalguni Moon feels better when there is a touch of beauty and enjoyment.";
  }

  // --- 3) Theme text based on stack ---
  let themeLine =
    "Today has a quiet, grounding tone — the kind of day that benefits from simple, warm, comforting food that keeps your system steady.";

  if (saturnActive || ketuActive) {
    themeLine =
      "Today has a quiet, grounding tone — Saturn and Ketu favour simple, warm, comforting food that keeps your system steady without adding extra drama.";
  } else if (rahuActive) {
    themeLine =
      "Today’s energy can tilt towards restlessness or craving extremes, so food works best when it is simple, warm, and not too stimulating.";
  }

  // --- 4) If we have no dasha context at all, fall back gracefully ---
  const hasAnyDasha = Boolean(md || ad || pd);

  const whyParts: string[] = [];
  if (md) whyParts.push(`MD ${md}`);
  if (ad) whyParts.push(`AD ${ad}`);
  if (pd) whyParts.push(`PD ${pd}`);

  const whyLine = hasAnyDasha
    ? `Why this (evidence):\n- Active dasha stack → ${whyParts.join(" • ")}`
    : "";

  // --- 5) Main food guidance text (template) ---
  const favourLines = [
    "- Warm, cooked meals (avoid overloading on cold/raw items).",
    "- Dal–chawal, khichdi, simple veg pulao, or roti–sabzi type meals.",
    "- Light dals like moong or masoor.",
    "- Soft, cooked vegetables (lauki, tori, pumpkin, beans, bhindi, etc.).",
    "- A little ghee for grounding, if it suits you.",
    "- Herbal tea or warm water through the day instead of too many chilled drinks.",
  ];

  const avoidLines = [
    "- Very heavy fried foods or greasy snacks.",
    "- Too much chilli or extreme spice that overheats the system.",
    "- Ice-cold drinks and heavy desserts late at night.",
    "- Mindless ‘timepass’ snacking when you feel emotionally stuck.",
  ];

  const simpleRule =
    "Choose one main meal today that is warm, simple, and eaten without multitasking.";

  if (!hasAnyDasha) {
    // no report / no dasha context – generic but still useful answer
    return [
      "🥗 **What you should eat today**",
      "",
      "Your system will feel better today with warm, simple, home-style food rather than heavy or hyper-stimulating options.",
      "",
      "### Eat more of (favour today)",
      ...favourLines,
      "",
      "### Go easy on",
      ...avoidLines,
      "",
      "### One simple rule for today",
      `**${simpleRule}**`,
      "",
      "### Joy element",
      joyLine,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // --- 6) Dasha-aware answer ---
  return [
    "🥗 **What you should eat today**",
    "",
    themeLine,
    "",
    "### Eat more of (favour today)",
    ...favourLines,
    "",
    "### Go easy on",
    ...avoidLines,
    "",
    "### One simple rule for today",
    `**${simpleRule}**`,
    "",
    "### Joy element",
    joyLine,
    "",
    whyLine,
  ]
    .filter(Boolean)
    .join("\n");
}

/* --------------------------------------------------
   Stress + coping
-------------------------------------------------- */

function inferAstroStressDriver(report: LifeReportLike | null): string {
  if (!report?.activePeriods) return "";

  const { antardasha, pratyantardasha } = report.activePeriods;
  const sub = antardasha?.subLord?.toLowerCase() || "";
  const trigger = pratyantardasha?.lord?.toLowerCase() || "";

  if (sub.includes("saturn") || trigger.includes("saturn"))
    return "Saturn pressure = long grind, heavy responsibility, 'prove yourself' energy. Slow doesn't mean failing.";
  if (sub.includes("rahu") || trigger.includes("rahu"))
    return "Rahu restlessness = 'why isn't it happening already'. Hunger + anxiety in the same package.";
  if (sub.includes("ketu") || trigger.includes("ketu"))
    return "Ketu purge = cutting fake obligations, emotional detox. It can feel like loss because it's cleanup.";
  if (sub.includes("mars") || trigger.includes("mars"))
    return "Mars spike = irritability and 'I need change now'. Watch impulsive reactions.";
  if (sub.includes("moon") || trigger.includes("moon"))
    return "Moon sensitivity = emotional heaviness + sleep swings. Your system is asking for care, not 'tough it out'.";
  return "";
}

const sootheTips = {
  patience: [
    "Pick one thing you can finish cleanly today. Control that, not the entire future.",
    "Slow build isn't 'stuck'. It's stacking proof. Write down what you've quietly held together — that's leverage.",
  ],
  self_trust: [
    "Your body saying 'this isn't okay' is data, not drama.",
    "Name one thing you handle better now vs last year. That's proof you're not actually in the same place.",
  ],
  nervous_system: [
    "Unclench jaw / drop shoulders for 10 seconds. Tiny, but it interrupts the stress loop.",
    "Water + long exhale. Calm body first so choices aren't panic-driven.",
  ],
  boundaries_release: [
    "You are allowed to pull back from people who drain you.",
    "If someone always shrinks you, reduce their access. Protecting your energy is valid action.",
  ],
};

function pickCopingTip(stressDriver: string): string {
  if (!stressDriver) {
    const arr = sootheTips.self_trust;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const lower = stressDriver.toLowerCase();
  let bucket: keyof typeof sootheTips = "self_trust";
  if (lower.includes("saturn")) bucket = "patience";
  else if (lower.includes("rahu")) bucket = "nervous_system";
  else if (lower.includes("ketu")) bucket = "boundaries_release";
  else if (lower.includes("mars")) bucket = "nervous_system";
  else if (lower.includes("moon")) bucket = "self_trust";
  const tips = sootheTips[bucket];
  return tips[Math.floor(Math.random() * tips.length)];
}

/* --------------------------------------------------
   Fact bundle used by /api/naturalize
-------------------------------------------------- */

function buildCurrentSummary(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) return "Current period info isn't loaded yet.";

  const { mahadasha, antardasha, pratyantardasha } = report.activePeriods;

  const maha = mahadasha
    ? `${mahadasha.lord} Mahadasha (${fmtDateShort(mahadasha.start)} → ${fmtDateShort(mahadasha.end)})`
    : "Mahadasha info missing";

  const antar = antardasha
    ? `${antardasha.subLord} Antardasha (${fmtDateShort(antardasha.start)} → ${fmtDateShort(antardasha.end)})`
    : "Antardasha info missing";

  const praty = pratyantardasha
    ? `${pratyantardasha.lord} Pratyantardasha (${fmtDateShort(pratyantardasha.start)} → ${fmtDateShort(pratyantardasha.end)})`
    : "Pratyantardasha info missing";

  return [`You're under ${maha}.`, `Right now you're running ${antar}.`, `Immediate trigger layer: ${praty}.`].join(" ");
}

function gemstoneAdvice(report: LifeReportLike | null | undefined, question: string): string {
  const q = question.toLowerCase();
  const mentionsGem = /gem|stone|wear|ruby|pearl|blue sapphire|cat's eye|cats eye/i.test(q);
  if (!mentionsGem) return "";

  if (!report?.activePeriods) {
    return "Gemstones are powerful and can backfire. I need to confirm your current dasha rulers before I tell you to wear anything.";
  }
  const ad = report.activePeriods.antardasha?.subLord || "";
  if (!ad) {
    return "You only boost a gem if it supports your active Antardasha lord AND doesn't fight your base chart. It's not 'everyone wear blue sapphire'.";
  }
  return `You're in ${ad} Antardasha. You only wear a stone that helps that planet AND doesn't fight your base chart. It's case-by-case, not generic shopping advice.`;
}
function buildNatalFlavor(report?: LifeReportLike | null): string {
  if (!report?.natal) return "";

  const asc = report.natal.ascSign || "";
  const moon = report.natal.moonSign || "";
  const nak  = report.natal.moonNakshatra || "";

  const parts: string[] = [];

  if (asc) {
    parts.push(
      `Baseline wiring: ${asc} rising — you tend to process life through that sign’s style (how you show up and act).`
    );
  }

  if (moon) {
    if (nak) {
      parts.push(
        `Emotional layer: Moon in ${moon}, ${nak} nakshatra — your mood and gut reactions follow this pattern, so notice what your body says before your mind argues.`
      );
    } else {
      parts.push(
        `Emotional layer: Moon in ${moon} — your feelings and decisions often move in that sign’s style.`
      );
    }
  }

  if (!parts.length) return "";

  parts.push(
    "Use today’s timing in a way that fits this wiring instead of copying someone else’s style."
  );

  return parts.join(" ");
}
type FoodGuide = {
  keyPlanets: string[];
  favour: string[];
  moderate: string[];
  note: string;
};

function buildFoodGuide(report?: LifeReportLike | null): FoodGuide | null {
  if (!report?.activePeriods) return null;

  const { mahadasha, antardasha, pratyantardasha } = report.activePeriods;
  const planets = Array.from(
    new Set(
      [mahadasha?.lord, antardasha?.subLord, pratyantardasha?.lord]
        .filter(Boolean)
        .map((p) => String(p))
    )
  );

  if (!planets.length) return null;

  const baseMap: Record<string, { favour: string[]; moderate: string[]; note: string }> = {
    Sun: {
      favour: ["warm simple foods", "a little ghee", "fresh seasonal fruits"],
      moderate: ["very spicy oily food", "heavy fried items"],
      note: "Support digestion and vitality without overloading heat.",
    },
    Moon: {
      favour: ["hydrating foods", "soups", "cooked grains", "milk or plant milk if tolerated"],
      moderate: ["excessive caffeine", "very dry salty snacks"],
      note: "Support emotional stability and fluids.",
    },
    Mars: {
      favour: ["light protein", "lentils", "grilled foods", "warm spices like ginger"],
      moderate: ["chilli overload", "red meat late at night"],
      note: "Give clean fuel without overheating.",
    },
    Mercury: {
      favour: ["fresh greens", "light grains", "a few nuts/seeds"],
      moderate: ["processed snacks", "too much sugar"],
      note: "Keep nerves and focus steady, not jittery.",
    },
    Jupiter: {
      favour: ["satvic home-cooked meals", "simple dals", "fresh fruits"],
      moderate: ["over-eating sweets", "very heavy dinners"],
      note: "Support wisdom and optimism without lethargy.",
    },
    Venus: {
      favour: ["nicely presented meals", "lightly sweet foods", "fruits"],
      moderate: ["excess desserts", "late-night heavy meals"],
      note: "Enjoy pleasure in balance, not excess.",
    },
    Saturn: {
      favour: ["simple rustic meals", "millets", "warm cooked vegetables"],
      moderate: ["cold, stale food", "overeating late at night"],
      note: "Support long-term stamina and digestion.",
    },
    Rahu: {
      favour: ["clean home-style food", "grounding root vegetables"],
      moderate: ["junk/packaged food", "energy drinks"],
      note: "Reduce scattered, restless energy.",
    },
    Ketu: {
      favour: ["light, easy-to-digest meals", "warm herbal teas"],
      moderate: ["mindless snacking", "festival-style heavy meals"],
      note: "Support emotional detox and clarity.",
    },
  };

  const favourSet = new Set<string>();
  const moderateSet = new Set<string>();
  const notes: string[] = [];

  for (const p of planets) {
    const cfg = baseMap[p as keyof typeof baseMap];
    if (!cfg) continue;
    cfg.favour.forEach((f) => favourSet.add(f));
    cfg.moderate.forEach((m) => moderateSet.add(m));
    notes.push(`${p}: ${cfg.note}`);
  }

  return {
    keyPlanets: planets,
    favour: Array.from(favourSet),
    moderate: Array.from(moderateSet),
    note: notes.join(" "),
  };
}
function buildDailyRhythmTone(report?: LifeReportLike | null): {
  tone: string;
  focus: string;
  avoid: string;
} {
  if (!report?.activePeriods) {
    return {
      tone: "Neutral, usable day — nothing extreme, focus on simple progress.",
      focus: "Handle 1–2 important responsibilities without overloading yourself.",
      avoid: "Avoid overthinking timing or comparing yourself to others.",
    };
  }

  const { antardasha, pratyantardasha } = report.activePeriods;
  const antar = (antardasha?.subLord || "").toLowerCase();
  const praty = (pratyantardasha?.lord || "").toLowerCase();
  const stack = antar + " " + praty;

  // defaults
  let tone = "Steady but sensitive — progress is possible if you pace yourself.";
  let focus = "Pick one meaningful task and complete it with full attention.";
  let avoid = "Avoid forcing big decisions or spiraling in worry.";

  if (stack.includes("saturn")) {
    tone = "Slow, serious, but constructive — this is a 'brick by brick' kind of day.";
    focus = "Finish one responsibility properly; honour deadlines and commitments.";
    avoid = "Avoid taking on too much or judging yourself for slow progress.";
  } else if (stack.includes("rahu")) {
    tone = "Restless and ambitious — energy wants change, but can become scattered.";
    focus = "Channel the urge to change into structured outreach or planning.";
    avoid = "Avoid impulsive career jumps or money risks just to escape discomfort.";
  } else if (stack.includes("ketu")) {
    tone = "Decluttering and detaching — good for cleaning up old obligations.";
    focus = "Wrap up loose ends and quietly step away from drains on your energy.";
    avoid = "Avoid emotional over-engagement in drama or pointless debates.";
  } else if (stack.includes("mars")) {
    tone = "Active and assertive — good for action, but watch impatience.";
    focus = "Take decisive steps on 1–2 pending tasks that need courage or initiative.";
    avoid = "Avoid fights, ultimatums, or ‘all or nothing’ reactions.";
  } else if (stack.includes("jupiter")) {
    tone = "Expansive and growth-oriented — good for learning and guidance.";
    focus = "Seek advice, study, or work on something that grows your long-term path.";
    avoid = "Avoid over-promising or assuming things will work without effort.";
  } else if (stack.includes("venus")) {
    tone = "Pleasant and connective — good for people work and aesthetics.";
    focus = "Bring warmth and polish to communication or your environment.";
    avoid = "Avoid overindulgence in comfort, sweets, or pure pleasure distractions.";
  } else if (stack.includes("mercury")) {
    tone = "Thinking and communication-focused — good for planning and paperwork.";
    focus = "Clarify plans, fix documents, send messages, and get facts straight.";
    avoid = "Avoid gossip, over-analyzing, or changing decisions every hour.";
  } else if (stack.includes("moon")) {
    tone = "Emotionally sensitive — intuition is high but so is mood fluctuation.";
    focus = "Honour how you feel; choose tasks that match your emotional capacity.";
    avoid = "Avoid suppressing emotions or pushing yourself to look ‘strong’.";
  } else if (stack.includes("sun")) {
    tone = "Visible and evaluative — you are more ‘on stage’ than usual.";
    focus = "Show up where it matters; take ownership in one visible area.";
    avoid = "Avoid ego battles or overreacting to feedback.";
  }

  return { tone, focus, avoid };
}

function buildDailyRhythmFoodHint(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) {
    return "Prefer warm, simple, cooked meals over cold or heavy junk today.";
  }

  const stack =
    (report.activePeriods.antardasha?.subLord || "").toLowerCase() +
    " " +
    (report.activePeriods.pratyantardasha?.lord || "").toLowerCase();

  if (stack.includes("saturn") || stack.includes("ketu")) {
    return "Go for grounding, warm, simple food (dal, khichdi, roti–sabzi) and avoid overeating or very heavy fried items.";
  }
  if (stack.includes("rahu") || stack.includes("mars")) {
    return "Support your system with clean, energising food — avoid too much spice, caffeine, or random snacking when restless.";
  }
  if (stack.includes("moon") || stack.includes("venus")) {
    return "Eat comforting but not excessive meals; hydrate well and allow a small, intentional treat if you like.";
  }
  if (stack.includes("jupiter")) {
    return "Favour sattvic, clean food — fruits, simple grains, moderate ghee; avoid overindulgence ‘just because it feels good’.";
  }
  if (stack.includes("mercury")) {
    return "Keep meals light and clear so your mind stays sharp — avoid very heavy or sleepy-making foods in the daytime.";
  }

  return "Aim for warm, cooked meals and minimise junk or emotional snacking.";
}

function buildDailyRhythmRelationshipHint(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) {
    return "Keep conversations simple and honest; avoid over-explaining or reacting from stress.";
  }

  const stack =
    (report.activePeriods.antardasha?.subLord || "").toLowerCase() +
    " " +
    (report.activePeriods.pratyantardasha?.lord || "").toLowerCase();

  if (stack.includes("saturn")) {
    return "Show reliability more than drama — follow through on what you’ve already promised.";
  }
  if (stack.includes("venus") || stack.includes("moon")) {
    return "Good for gentle connection — a kind message, shared meal, or small gesture goes far.";
  }
  if (stack.includes("mars") || stack.includes("rahu")) {
    return "Watch tone and impatience; if a topic is heated, pause instead of escalating.";
  }
  if (stack.includes("ketu")) {
    return "Detach slightly from emotionally draining dynamics; protect your peace without guilt.";
  }

  return "Lead with clarity and kindness; keep boundaries clean.";
}

function buildDailyRhythmMoneyHint(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) {
    return "Use today to review money, not for big impulsive decisions.";
  }

  const stack =
    (report.activePeriods.antardasha?.subLord || "").toLowerCase() +
    " " +
    (report.activePeriods.pratyantardasha?.lord || "").toLowerCase();

  if (stack.includes("rahu")) {
    return "Avoid impulsive spending or speculative bets; channel ambition into planning and skill-building.";
  }
  if (stack.includes("saturn")) {
    return "Good for budgeting, clearing dues, or organising documents — slow, responsible money steps.";
  }
  if (stack.includes("jupiter")) {
    return "Look at long-term growth moves (learning, planning, advice), not just short-term gains.";
  }
  if (stack.includes("venus")) {
    return "You may feel like spending on comfort or beauty; allow a little, but stay within a clear limit.";
  }
  if (stack.includes("mercury")) {
    return "Ideal for paperwork, negotiations, or comparing options rather than finalising big commitments.";
  }

  return "Keep money moves simple and deliberate today; avoid big risks made from emotion.";
}

function buildDailyRhythmOneStep(
  tone: string,
  focus: string,
  report?: LifeReportLike | null
): string {
  const nak = (report as any)?.natal?.moonNakshatra || "";
  if (nak && typeof nak === "string" && nak.toLowerCase().includes("phalguni")) {
    return "Pick one responsibility you can complete today, then add one small moment of beauty or joy for yourself afterward.";
  }
  return "Choose one realistic task that matches today’s tone and finish it fully before you touch anything else.";
}

function buildDailyRhythm(
  report?: LifeReportLike | null
): DailyRhythm | null {
  if (!report) return null;

  const { tone, focus, avoid } = buildDailyRhythmTone(report);
  const foodHint = buildDailyRhythmFoodHint(report);
  const relationshipHint = buildDailyRhythmRelationshipHint(report);
  const moneyHint = buildDailyRhythmMoneyHint(report);
  const oneStep = buildDailyRhythmOneStep(tone, focus, report);

  return {
    tone,
    focus,
    avoid,
    foodHint,
    relationshipHint,
    moneyHint,
    oneStep,
  };
}

function buildAstroFacts(question: string, report: LifeReportLike | null) {
  if (!report) {
    return {
      question,
      hasReport: false,
      note: "No life report / dasha context loaded.",
    };
  }

  // 🔹 Natal flavour (Moon nakshatra etc.), coming from sarathi.lifeReportCache.v2
  const natal = (report as any)?.natal;
  let natalContext = "";

  if (natal?.moonNakshatra) {
    const theme =
      natal.moonNakshatraTheme && String(natal.moonNakshatraTheme).trim().length
        ? ` (${natal.moonNakshatraTheme})`
        : "";
    natalContext =
      `Your Moon is in ${natal.moonNakshatra}${theme}. ` +
      `Days tend to feel better when you respect that emotional flavour rather than fighting it.`;
  }
   const foodGuide = buildFoodGuide(report);
    const dailyRhythm = buildDailyRhythm(report);

  return {
    question,
    hasReport: true,

    activePeriodSummary: buildCurrentSummary(report),
    careerTiming: buildCareerBriefStructured({ report }),

    dayTone:   buildShortHorizon(report, "day"),
    weekTone:  buildShortHorizon(report, "week"),
    monthTone: buildShortHorizon(report, "month"),

    nextPhasesSummary: buildNextPhases(report),
    remediesNow:       buildRemedyAnswer(report),
    gemstoneNote:      gemstoneAdvice(report, question),
    conceptExplainer:  lookupAstroConcept(question),

    // 🆕 explicit natal field the model can read
    natalContext,

    // 🆕 NEW: unified daily rhythm engine output
    dailyRhythm,
  };
}


/* --------------------------------------------------
   POST handler
-------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AstroChatRequest;

    const question = (body.question || "").trim();
    const report = body.report ?? body.reportData ?? null;

    if (!question) return badJson("No question provided", 400);

    // 🔹 Food Engine: handle food/diet questions directly, without GPT
    if (isFoodQuestion(question)) {
      const foodText = buildFoodAnswer(report);
      return okJson({
        answer: foodText,
        followupMode: "new",
        distressed: false,
      });
    }

    const topic = detectTopic(question);
    const moodHint = inferMood(question);
    const distressed = detectDistress(question);
    const distressSoothing = distressed ? reassureUser(topic) : "";
    const astroStressDriver = inferAstroStressDriver(report);
    const copingTip = pickCopingTip(astroStressDriver);

    const userId = "default"; // simple session id for now

    // memory of last few questions
    const prevArr = chatContext.get(userId) || [];
    prevArr.push(question);
    if (prevArr.length > MAX_HISTORY) prevArr.shift();
    chatContext.set(userId, prevArr);
    const history = prevArr.slice(-4).join("\n");

    // gather astro data
    const astroFacts = buildAstroFacts(question, report);
    lastFacts.set(userId, astroFacts);

    // followup vs new ask
    const followupMode = isShortFollowup(question) ? "short" : "new";

    // what we offered last time (career_deepen, etc.)
    const prevFollowKind = lastFollowup.get(userId) || "generic_deepen";
    const evidenceBullets = buildWhyEvidence({ report, topic });
        // Build a lightweight signature of "today's astro window"
    const todayISO = new Date().toISOString().slice(0, 10);

    const active = report?.activePeriods;
    const maha = active?.mahadasha?.lord || "";
    const antar = active?.antardasha?.subLord || "";
    const praty = active?.pratyantardasha?.lord || "";

    const activeTransit = pickActiveTransitNow(report);
    const transitKey = activeTransit
      ? `${activeTransit.driver || ""}|${activeTransit.focusArea || ""}`
      : "";

    const astroWindowSignature = [
      todayISO,
      maha,
      antar,
      praty,
      transitKey,
    ]
      .map((x) => String(x || "").toLowerCase().trim())
      .join("|");

    const questionSignature = question.toLowerCase().trim();

        // payload for /api/naturalize
    const natPayload = {
      userQuestion: question,
      topic,
      history,
      astroFacts,
      moodHint,

      distressed,
      distressSoothing,
      astroStressDriver,
      copingTip,

      followupMode,
      lastFollowupKind: prevFollowKind,

      astroWindowSignature,
      questionSignature,

      evidenceBullets,

            styleGuide: {
        vibe: "soft-direct, not guru, not corporate",
        rules: [
          "Answer the actual ask first (timing, safety, near-term behavior).",
          "Normalize their feelings. Tell them they are not broken.",
          "Offer one practical way to survive the phase they're in.",
          "End with exactly one next choice, not a menu.",
          "After the answer, add a short 'Why this (evidence):' section with 2–4 bullets, using ONLY the provided evidenceBullets verbatim (no guesses). If evidenceBullets is empty, skip the section.",
          "If astroFacts.natalContext is present, weave in exactly one short, grounded sentence of natal flavour (no jargon, no textbook dump).",
          "If astroFacts.dailyRhythm is present, keep the tone, focus and oneStep aligned with it instead of inventing a new direction."
        ],
        avoid: [
          "No dumping raw dasha / transit data unless user asked 'why does it feel like this'.",
          "Don't sound like a horoscope blog.",
          "Don't blame them or say 'be positive'."
        ]
      }
      };

    // ---- call /api/naturalize ----
    let naturalJson: any = null;

    try {
      const naturalizeURL = safeInternalURL(req, "/api/naturalize");
      const naturalRes = await fetch(naturalizeURL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(natPayload),
      });

      if (!naturalRes.ok) {
  const errText = await naturalRes.text();
  return okJson({
    answer:
      `⚠️ GPT call failed (naturalize ${naturalRes.status}).\n\n` +
      `Server said:\n${errText}\n\n` +
      `Tip: Check OPENAI_API_KEY / GPT_MODEL in .env.local, then restart dev server.`,
    followupMode,
    distressed,
    debug: true,
  });
}

      naturalJson = await naturalRes.json();
    } catch (e: any) {
      return okJson({
        answer:
          `⚠️ Could not reach /api/naturalize.\n\n${String(e?.message || e)}\n\n` +
          `Tip: Is the route file at src/app/api/naturalize/route.ts and exported as POST?`,
        followupMode,
        distressed,
        debug: true,
      });
    }

    // if we got a styled, human answer, return that (and append evidence if needed)
       if (naturalJson?.text) {
      lastFollowup.set(userId, naturalJson.followupKind || "generic_deepen");

      let finalText = naturalJson.text as string;
      if (Array.isArray(evidenceBullets) && evidenceBullets.length && !/Why this \(evidence\)/i.test(finalText)) {
        finalText += "\n\n**Why this (evidence):**\n" + evidenceBullets.map(b => `• ${b}`).join("\n");
      }



      return okJson({
        answer: finalText,
        followupMode,
        distressed,
      });
    }


    // graceful fallback (still human voice)
    const timingCore =
      astroFacts.careerTiming?.windowRange ||
      astroFacts.nextPhasesSummary ||
      astroFacts.activePeriodSummary ||
      "";

    const fallbackLines: string[] = [];
    if (timingCore) {
      fallbackLines.push(
        `Let me be direct: ${timingCore}. That's the pressure window where things actually move for you.`
      );
    }

    if (distressed) {
      fallbackLines.push(
        "I can feel how heavy this is. You're not cursed or behind. This is slow-build timing, not punishment. The job right now is protect energy and collect proof, not burn yourself out trying to force a result today."
      );
    } else {
      fallbackLines.push(
        "This is not 'you're stuck forever'. It's slow-bake timing, not dead timing. You're being asked to build leverage, not panic-jump."
      );
    }

    fallbackLines.push(
      "Do you want me to help you survive this stretch without burning out, or talk pure safety/stability (like 'is it safe to jump')?"
    );

    if (evidenceBullets && evidenceBullets.length) {
      fallbackLines.push("**Why this (evidence):**\n" + evidenceBullets.map(b => `• ${b}`).join("\n"));
    }

    return okJson({
      answer: fallbackLines.join("\n\n"),
      followupMode,
      distressed,
    });
  } catch (err: any) {
    console.error("astro-chat error:", err);
    return okJson({ error: "astro-chat internal error", details: err?.message ?? String(err) }, 500);
  }
}
