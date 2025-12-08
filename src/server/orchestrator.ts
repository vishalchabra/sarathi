// FILE: src/lib/server/qa/orchestrator.ts
import { DateTime } from "luxon";

/** ------------- Types ------------- */
export type Place = { tz?: string; lat?: number; lon?: number; name?: string };
export type OrchestrateInput = {
  // question + routing
  question?: string;
  category?: "vehicle" | "property" | "job" | "relationships" | "disputes" | "transit";
  // birth context
  dobISO?: string;
  tob?: string; // "23:35"
  place?: Place;
  ayanamsa?: string;
  node?: "true" | "mean";
  hsys?: string;
  // shaping
  horizonDays?: number;
  orbDeg?: number;

  // optional user profile for personalization (name, etc.)
  profile?: { name?: string } | null;

  // optional learning signal (0..1 where 1 = very good)
  feedbackScore?: number;
};

export type Window = {
  start: string;     // ISO date
  end: string;       // ISO date
  score: number;     // 0..1
  confidence: number;// 0..1
  why: string[];     // bullet points
};

export type OrchestrateOutput = {
  topic: NonNullable<OrchestrateInput["category"]>;
  horizonDays: number;
  windows: Window[];
  answer: string;    // human-friendly
  confidence: number;// overall confidence
  meta?: Record<string, unknown>;
};

/** ------------- Lightweight, local "learning" store -------------
 * In dev/server environments we can keep an in-memory + /tmp mirror.
 * In serverless it will be best-effort (ephemeral), which is fine for now.
 */
type WeightMap = Record<string, number>; // per-category scalar weight
const defaultWeights: WeightMap = {
  vehicle: 1.0,
  property: 1.0,
  job: 1.0,
  relationships: 1.0,
  disputes: 1.0,
  transit: 1.0,
};
let weights: WeightMap = { ...defaultWeights };

const WEIGHT_FILE = "/tmp/sarathi-qa-weights.json";
function loadWeights() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs");
    if (fs.existsSync(WEIGHT_FILE)) {
      const raw = fs.readFileSync(WEIGHT_FILE, "utf-8");
      const j = JSON.parse(raw);
      if (j && typeof j === "object") {
        weights = { ...defaultWeights, ...j };
      }
    }
  } catch {}
}
function saveWeights() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs");
    fs.writeFileSync(WEIGHT_FILE, JSON.stringify(weights), "utf-8");
  } catch {}
}
loadWeights();

/** ------------- Topic detection (fallback) ------------- */
function detectTopic(q?: string): OrchestrateInput["category"] {
  const s = (q || "").toLowerCase();
  if (/\b(job|career|promotion|role|offer|switch|boss|salary)\b/.test(s)) return "job";
  if (/\b(car|vehicle|automobile|bike|upgrade)\b/.test(s)) return "vehicle";
  if (/\b(house|home|property|flat|land|real estate|mortgage)\b/.test(s)) return "property";
  if (/\b(marriage|relationship|partner|love|spouse)\b/.test(s)) return "relationships";
  if (/\b(dispute|court|legal|case|litigation|conflict)\b/.test(s)) return "disputes";
  if (/\b(transit|gochar|panchang|tithi|nakshatra)\b/.test(s)) return "transit";
  // generic queries: bias to job/property as they’re common
  if (/\b(when|window|good time|auspicious)\b/.test(s)) return "job";
  return "job";
}

/** ------------- Category defaults ------------- */
const PER_CAT = {
  vehicle:      { horizonDays: 150, minSpan: 5,  maxSpan: 24 },
  property:     { horizonDays: 210, minSpan: 7,  maxSpan: 35 },
  job:          { horizonDays: 180, minSpan: 7,  maxSpan: 28 },
  relationships:{ horizonDays: 180, minSpan: 7,  maxSpan: 28 },
  disputes:     { horizonDays: 180, minSpan: 7,  maxSpan: 28 },
  transit:      { horizonDays: 90,  minSpan: 3,  maxSpan: 14 },
} as const;

/** ------------- Simple window builder (placeholder) -------------
 * This simulates realistic windows until your astro engine plugs in.
 * It shapes 2–4 windows across the horizon and annotates "why" bullets.
 * The per-category weight (learned) affects scores and confidence.
 */
function synthWindows(topic: NonNullable<OrchestrateInput["category"]>, horizonDays: number): Window[] {
  const base = DateTime.now().startOf("day");
  const cfg = PER_CAT[topic];
  const w = weights[topic] ?? 1.0;

  // Generate 3 candidate windows spaced across the horizon
  const buckets = [0.2, 0.5, 0.8]; // as fractions of horizon
  const spans = [
    clamp(Math.round(cfg.minSpan * 1.0), cfg.minSpan, cfg.maxSpan),
    clamp(Math.round((cfg.minSpan + cfg.maxSpan) / 2), cfg.minSpan, cfg.maxSpan),
    clamp(Math.round(cfg.maxSpan * 0.9), cfg.minSpan, cfg.maxSpan),
  ];

  return buckets.map((frac, i) => {
    const start = base.plus({ days: Math.round(horizonDays * frac) });
    const end = start.plus({ days: spans[i] });
    const rawScore = (0.7 + 0.3 * (i / (buckets.length - 1))) * w; // later windows slightly stronger
    const score = clamp(round2(rawScore), 0.1, 1.0);
    const confidence = clamp(round2(0.6 * w + 0.15 * i), 0.3, 0.95);

    const why = buildWhy(topic, i);

    return {
      start: start.toISODate()!,
      end: end.toISODate()!,
      score,
      confidence,
      why,
    };
  });
}

function buildWhy(topic: NonNullable<OrchestrateInput["category"]>, idx: number): string[] {
  // Human-friendly bullets per category (non-astrological placeholder text).
  // Replace with your actual contributors (Venus/Jupiter, 10H/4H lords, dasha gates, Panchang filters).
  if (topic === "job") {
    return [
      idx === 0 ? "Momentum uptick in opportunities and networking." :
      idx === 1 ? "Supportive period for interviews, negotiations, and role clarity." :
                  "High-clarity window for offers, transitions, and compensation talks.",
      "Energy and focus align with career-growth actions.",
      "Avoid decision whiplash: prepare documents ahead of time.",
    ];
  }
  if (topic === "vehicle") {
    return [
      idx === 0 ? "Desire/comfort themes rise—good for shortlisting and test drives." :
      idx === 1 ? "Financing and logistics align—good for booking." :
                  "Strong closure window for delivery/registration.",
      "Keep paperwork ready; compare insurance and add-ons.",
    ];
  }
  if (topic === "property") {
    return [
      idx === 0 ? "Research window—locality, budget, and legal checks." :
      idx === 1 ? "Negotiation leverage improves—token or agreement prep." :
                  "Completion—agreement execution, handover, or registration.",
      "Consult legal & valuation to avoid hidden liabilities.",
    ];
  }
  if (topic === "relationships") {
    return [
      idx === 0 ? "Communication deepens—good for alignment talks." :
      idx === 1 ? "Commitment energy grows—meet families/define next steps." :
                  "Stability window—formalize plans or ceremonies.",
      "Prioritize empathy and shared routines.",
    ];
  }
  if (topic === "disputes") {
    return [
      idx === 0 ? "Evidence & strategy prep window." :
      idx === 1 ? "Negotiation/mediation leverage improves." :
                  "Resolution window—orders, settlements, or closures.",
      "Keep documentation complete; reduce reactive moves.",
    ];
  }
  return [
    "General supportive period.",
    "Refine plan; act with clarity.",
  ];
}

/** ------------- Public Orchestrator ------------- */
export async function orchestrateQA(input: OrchestrateInput): Promise<OrchestrateOutput> {
  const topic = input.category || detectTopic(input.question);
  const cfg = PER_CAT[topic];
  const horizonDays = clamp(input.horizonDays ?? cfg.horizonDays, cfg.minSpan * 3, cfg.horizonDays);

  // If you already have per-category engines, attempt dynamic import here:
  // try {
  //   const mod = await import(`./plugins/${topic}.js`); // or .ts with transpile
  //   const out = await mod.run(input);
  //   return out as OrchestrateOutput;
  // } catch { /* fall back to synthetic */ }

  // Synthetic windows until your astro engine is wired:
  const windows = synthWindows(topic, horizonDays);

  // Lightweight self-learning hook
  if (typeof input.feedbackScore === "number" && !Number.isNaN(input.feedbackScore)) {
    // Move weight 10% toward feedback (bounded)
    const prev = weights[topic] ?? 1.0;
    const next = clamp(prev * 0.9 + clamp(input.feedbackScore, 0, 1) * 0.1 * 2, 0.5, 1.5);
    weights[topic] = next;
    saveWeights();
  }

  // Format human answer
  const who = input.profile?.name ? `, ${input.profile.name}` : "";
  const lines: string[] = [];
  lines.push(`Here’s how it looks${who}:`);
  lines.push("");
  lines.push(titleFor(topic));
  lines.push(...windows.map((w, i) =>
    `• Window ${i + 1}: ${fmt(w.start)} → ${fmt(w.end)}  (strength ${(w.score * 100)|0}%, confidence ${(w.confidence * 100)|0}%)`
  ));
  lines.push("");
  lines.push("Why these windows:");
  windows[0]?.why.forEach(b => lines.push(`- ${b}`));
  lines.push("");
  lines.push("Tips:");
  lines.push(...tipsFor(topic));

  const overall = clamp(avg(windows.map(w => w.confidence)) * (weights[topic] ?? 1), 0.3, 0.95);

  return {
    topic,
    horizonDays,
    windows,
    answer: lines.join("\n"),
    confidence: round2(overall),
    meta: {
      usedSynthetic: true,
      weight: weights[topic],
      tz: input.place?.tz,
    },
  };
}

/** ------------- Helpers ------------- */
function titleFor(topic: NonNullable<OrchestrateInput["category"]>): string {
  switch (topic) {
    case "job": return "💼 Job / Career timing windows";
    case "vehicle": return "🚗 Vehicle timing windows";
    case "property": return "🏠 Property timing windows";
    case "relationships": return "💞 Relationship timing windows";
    case "disputes": return "⚖️ Disputes / Legal timing windows";
    default: return "📅 Timing windows";
  }
}
function tipsFor(topic: NonNullable<OrchestrateInput["category"]>): string[] {
  if (topic === "job") {
    return [
      "Update CV, portfolio, and references before window 1.",
      "Line up interviews near the middle of window 2.",
      "Negotiate and sign toward window 3 if possible.",
    ];
  }
  if (topic === "vehicle") {
    return [
      "Pre-approve financing and compare insurance.",
      "Test drive in window 1; book in window 2; delivery in window 3.",
    ];
  }
  if (topic === "property") {
    return [
      "Complete legal and title diligence early.",
      "Avoid rushed agreements—use middle of window 2 for negotiation.",
    ];
  }
  if (topic === "disputes") {
    return [
      "Focus on documentation/evidence prep first.",
      "Use window 2 for mediation; aim for resolution in window 3.",
    ];
  }
  if (topic === "relationships") {
    return [
      "Communicate expectations clearly.",
      "Schedule key conversations mid-window.",
    ];
  }
  return ["Act deliberately; avoid whiplash decisions outside windows."];
}
function fmt(iso: string) { return DateTime.fromISO(iso).toFormat("dd LLL yyyy"); }
function avg(a: number[]) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; }
function round2(n: number) { return Math.round(n * 100) / 100; }
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
