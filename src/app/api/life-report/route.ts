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
   It only uses enriched.transits, enriched.dailyMoon, enriched.transitPlanets.
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


    // Top transit windows
    const topTransits = transits
      .slice()
      .sort((a: any, b: any) => Number(b?.strength ?? 0) - Number(a?.strength ?? 0))
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
    const transitNowFacts = transitNow
  .filter((p: any) => p?.name && p?.sign)
  .map((p: any) => {
    const h = Number(p?.house);
    if (Number.isFinite(h)) return `${p.name} in ${p.sign} (H${h})`;
    return `${p.name} in ${p.sign}`;
  });

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
    const cat = String(t?.category ?? "").trim();      // ✅ was missing
    const ttitle = String(t?.title ?? "").trim();      // ✅ was missing
    const targetRaw = String(t?.target ?? "").trim();

    // Extract natal planet from strings like: "conjunction natal Rahu"
    const m = /natal\s+([A-Za-z]+)/i.exec(targetRaw);
    const targetPlanet = (m?.[1] ?? "").trim(); // e.g. "Rahu"

    const natalTarget = targetPlanet
      ? natalByName.get(targetPlanet.toLowerCase())
      : null;

    const natalTag =
      natalTarget && Number.isFinite(Number(natalTarget?.house))
        ? `natal ${targetPlanet} (H${Number(natalTarget.house)})`
        : targetRaw
        ? `target: ${targetRaw}`
        : "";

    const win = t?.startISO && t?.endISO ? `${t.startISO} → ${t.endISO}` : "";

    const label = ttitle || `${tp} ${cat ? "(" + cat + ")" : ""}`.trim();

    return [label, natalTag ? `• ${natalTag}` : "", win ? `• ${win}` : ""]
      .filter(Boolean)
      .join(" ");
  })
  .slice(0, 10);


    console.log("[nowPlan] topTransits sample:", topTransits.slice(0, 4));
    console.log("[nowPlan] anchorsUsed sample:", anchorsUsed.slice(0, 6));
    console.log("[nowPlan] transitNow sample:", transitNow.slice(0, 6));
    console.log("[nowPlan] TransitNowFacts:", transitNowFacts);
    console.log("[nowPlan] keys:", Object.keys(enriched || {}));
    console.log("[nowPlan] enriched.transitNow?", enriched?.transitNow?.slice?.(0,3));
    console.log("[nowPlan] enriched.transitPlanets?", enriched?.transitPlanets?.slice?.(0,3));
    console.log("[nowPlan] enriched.topTransits?", enriched?.topTransits?.slice?.(0,3));
    console.log("[nowPlan] enriched.transits?", enriched?.transits?.slice?.(0,3));

    const prompt = `
You are Sārathi — a paid, practical Vedic guide.
You may describe "likely scenarios" and "areas activated", but you must NOT claim certainty or guarantee events.

Return STRICT JSON ONLY (one JSON object). No markdown. No extra keys. No commentary.

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
- Write in second person ("you"). Be direct, clear, calm.
- Every bullet must be concrete and observable in real life (meeting, call, decision, paperwork, delay, spend, follow-up, travel, sleep/motivation shift).
- Do NOT invent big life events (job loss, marriage, pregnancy, diagnosis, legal outcomes). Keep it realistic and plausible.
- Keep everything crisp. No long paragraphs. No poetic language.

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


HARD LIMITS (enforce strictly):
- headline: max 120 characters
- now3Days.focusAreas: exactly 3 items
- now3Days.themes: 3–4 items
- now3Days.likelyScenarios: 4–6 items
- now3Days.do: 4–6 items
- now3Days.avoid: 3–5 items
- now3Days.remedies: 2–4 items (<=10 min each)
- next14Days.areasActivated: 4–6 items
- next14Days.likelyScenarios: 5–8 items
- next14Days.steeringPlan: 5–8 items
- next14Days.timing: 3–6 items
- next14Days.remedies: 2–4 items
- next30Days.areasActivated: 4–6 items
- next30Days.runway: exactly 3 items (keep labels as given)
  - each runway.focus: max 140 characters
  - each runway.likely: 3–5 items
- next30Days.priorityWins: 4–6 items
- next30Days.watchouts: 4–6 items
- next30Days.systemToInstall: 3–5 items
- closing: max 240 characters
- astroDrivers: exactly 3 items
- driver: max 80 chars
- meaning: max 140 chars
- howItShowsUp: max 140 chars


EVIDENCE (for debugging, keep short):
- evidence.phase: one line describing the core phase in plain English (max 120 chars).
- evidence.transitsUsed: list 3–6 short strings from topTransits (use planet+target or title).
- evidence.anchorsUsed: list 3–6 short strings from Natal anchors.

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
- MoonTodayNakshatraFact (MUST COPY EXACTLY if mentioning nakshatra): ${JSON.stringify(moonNakshatraToday)}
- MoonTodayNakshatraFact (MUST COPY EXACTLY if mentioning nakshatra): ${JSON.stringify(moonTodayFact)}
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

    return obj;
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
    const cacheBuster = 0;

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

    const cacheKey = `v2:${baseKey}`;

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
        await cacheSet(cacheKey, report, 60 * 60);
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
  // Prefer explicit env var
  const explicit = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel runtime
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`.replace(/\/$/, "");

  // Local dev
  return "http://localhost:3000";
}

async function fetchTransitsForLifeReport(payload: any) {
  const base = getServerBaseUrl();
  const res = await fetch(`${base}/api/transits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // IMPORTANT on server: avoid cached fetch behavior
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
  ascDeg: report?.core?.ascDeg,
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

// IMPORTANT: buildNowNearFuturePlan prefers enriched.transitNow first
(enriched as any).transitNow = transitNow;

// Keep legacy UI key working (your UI reads transitPlanets)
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
    // 10) Moon nakshatra "today fact" (from dailyMoon rows)
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

    // ----------------------------
    // 11) Build enrichedWithDaily for nowPlan
    // ----------------------------
    const enrichedWithDaily = {
  ...enriched,
  dailyGuide,
  topTransits, // nowPlan reads enriched.topTransits
  dailyMoon,   // nowPlan reads enriched.dailyMoon

  // ✅ SOURCE OF TRUTH = what we computed RIGHT NOW
transitNow: transitNow,
transitPlanets: transitNow, // keep legacy UI key working

  moonNakshatraTodayFact,
};



    // ----------------------------
    // 12) Notifications (unchanged)
    // ----------------------------
    const notificationTz = body.notificationTz || body.birthTz || "Asia/Dubai";
    const todayISO = todayISOForNotificationTz(notificationTz);

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
    // ----------------------------
    const nowPlan = await buildNowNearFuturePlan(enrichedWithDaily);
    console.log("[life-report] nowPlan generated?", !!nowPlan, "headline:", nowPlan?.headline);

    // ----------------------------
    // 14) Response payload
    // ----------------------------
    const payload = {
      ...enrichedWithDaily,

      nowNearFuture: nowPlan,
      nowPlan,

      notificationFacts,
      previewNotifications,

      _cache: cacheFlag,
      _debugAsc: {
        ascDeg: report?.core?.ascDeg,
        ascSign: report?.core?.ascSign,
      },
    };

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
