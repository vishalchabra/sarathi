// FILE: src/server/sarathi/predict.ts

import "server-only";

import { cacheGet, cacheSet } from "@/server/cache/simpleCache";
import { buildGuidance } from "@/server/sarathi/guidance";

/* ---------------- Types ---------------- */

export type PredictionCategory =
  | "job"
  | "business"
  | "money"
  | "property"
  | "vehicle"
  | "relationships"
  | "disputes"
  | "health"
  | "wealth"
  | "general";

export type PredictionHorizon = {
  startISO: string;
  endISO: string;
};

export type PredictionWindow = {
  fromISO: string;
  toISO: string;
  label: string;
  score: number; // 0–1
  strengthLabel: "low" | "medium" | "high";
  drivers: string[]; // short machine facts, e.g. ["category: job"]
};

export type PredictionResult = {
  category: PredictionCategory;
  horizon: PredictionHorizon;
  score: {
    now: number;
    peak: number;
    confidence: number;
  };
  mainWindow: PredictionWindow | null;
  windows: PredictionWindow[];
  keySignals: string[];
  recommendedActions: string[];
  version: string;
  _cache?: "hit" | "miss";
};

export type PredictionInput = {
  birth: {
    dateISO: string;
    time: string;
    tz: string;
    lat?: number | null;
    lon?: number | null;
    placeName?: string;
  };
  category: PredictionCategory;
  horizon: PredictionHorizon;
};

/* ---------------- Helpers ---------------- */

function normaliseCategory(raw?: string): PredictionCategory {
  if (!raw) return "general";
  const c = raw.toLowerCase();

  if (c.startsWith("job") || c.includes("career")) return "job";
  if (c.startsWith("bus")) return "business";
  if (c.startsWith("prop")) return "property";
  if (c.startsWith("veh")) return "vehicle";
  if (c.startsWith("rel")) return "relationships";
  if (c.startsWith("disp") || c.includes("court") || c.includes("legal"))
    return "disputes";
  if (c.startsWith("heal")) return "health";
  if (c.startsWith("money") || c.startsWith("wealth") || c.includes("finance"))
    return "wealth";

  return "general";
}

function strengthLabelFromScore(score: number): "low" | "medium" | "high" {
  if (score >= 0.7) return "high";
  if (score >= 0.45) return "medium";
  return "low";
}

/**
 * Very simple v1 scorer — just to get something non-zero and category-aware.
 * We'll swap this later for real dasha + transit scoring.
 */
function scoreFromCategory(category: PredictionCategory): number {
  switch (category) {
    case "job":
    case "business":
    case "wealth":
      return 0.65; // slightly optimistic baseline
    case "relationships":
      return 0.55;
    case "property":
    case "vehicle":
      return 0.6;
    case "disputes":
      return 0.4; // slightly cautious
    case "health":
      return 0.5;
    default:
      return 0.5;
  }
}

function buildCacheKey(input: PredictionInput): string {
  const { birth, category, horizon } = input;

  const keyObject = {
    v: "sarathi-predict-v1",
    category,
    horizon,
    birth: {
      dateISO: birth.dateISO,
      time: birth.time,
      tz: birth.tz,
      lat: birth.lat ?? null,
      lon: birth.lon ?? null,
      placeName: birth.placeName ?? "",
    },
  };

  return "sarathi:predict:" + JSON.stringify(keyObject);
}

/* ---------------- Core engine ---------------- */

export async function buildPrediction(
  rawInput: PredictionInput
): Promise<PredictionResult> {
  const category = normaliseCategory(rawInput.category);
  const input: PredictionInput = { ...rawInput, category };

  const cacheKey = buildCacheKey(input);

  // 1) Try cache
  const cached = await cacheGet<PredictionResult>(cacheKey);
  if (cached) {
    return { ...cached, _cache: "hit" };
  }

  const { horizon } = input;

  // 2) Simple v1: one main window covering the horizon
  const score = scoreFromCategory(category);
  const mainWindow: PredictionWindow = {
    fromISO: horizon.startISO,
    toISO: horizon.endISO,
    label: `Core window for ${category}`,
    score,
    strengthLabel: strengthLabelFromScore(score),
    drivers: [`category:${category}`],
  };

  const keySignals: string[] = [
    `Focus area: ${category}`,
    `Window: ${horizon.startISO} → ${horizon.endISO}`,
  ];

  // Use your existing guidance engine for practical actions (no GPT)
  const recommendedActions = buildGuidance({
    topic: category === "wealth" ? "wealth" : category,
  });

  const result: PredictionResult = {
    category,
    horizon,
    score: {
      now: score,
      peak: score,
      confidence: 0.5, // neutral for v1
    },
    mainWindow,
    windows: [mainWindow],
    keySignals,
    recommendedActions,
    version: "sarathi-predict-v1",
    _cache: "miss",
  };

  // 3) Cache it – TTL depends on horizon length
  const horizonDays =
    (new Date(horizon.endISO).getTime() -
      new Date(horizon.startISO).getTime()) /
    (1000 * 60 * 60 * 24);

  let ttlSeconds = 60 * 60 * 24; // 1 day
  if (horizonDays > 60) ttlSeconds = 60 * 60 * 24 * 7; // 1 week
  if (horizonDays > 180) ttlSeconds = 60 * 60 * 24 * 30; // 30 days

  await cacheSet(cacheKey, result, ttlSeconds);

  return { ...result, _cache: "miss" };
}
