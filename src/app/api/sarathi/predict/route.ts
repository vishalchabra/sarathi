// FILE: src/app/api/sarathi/predict/route.ts

import { NextRequest, NextResponse } from "next/server";

import {
  buildPrediction,
  PredictionCategory,
  PredictionHorizon,
} from "@/server/sarathi/predict";
// Simple in-memory cache for predictions (per server instance)
type PredictionCacheEntry = {
  key: string;
  value: any;
  timestamp: number;
};

const PREDICT_CACHE = new Map<string, PredictionCacheEntry>();

// How long to keep a cached prediction (ms)
const PREDICT_TTL_MS = 1000 * 60 * 60; // 1 hour

type PredictBody = {
  category?: PredictionCategory;
  horizon?: Partial<PredictionHorizon> & { dateISO?: string };
  name?: string;
  birthDateISO: string;
  birthTime: string;
  birthTz: string;
  lat?: number;
  lon?: number;
  placeName?: string;
};
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      message: "Use POST with JSON body to get a Sarathi prediction.",
    },
    { status: 200 }
  );
}
export async function POST(req: NextRequest) {
  let body: PredictBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body.birthDateISO || !body.birthTime || !body.birthTz) {
    return NextResponse.json(
      { error: "Missing birth data." },
      { status: 400 }
    );
  }

  const category: PredictionCategory = body.category || "general";

  // Build a simple horizon if not provided
  const baseDateISO =
    body.horizon?.startISO ||
    body.horizon?.dateISO ||
    new Date().toISOString().slice(0, 10);

  const startISO = baseDateISO;
  const endISO =
    body.horizon?.endISO ||
    new Date(
      new Date(baseDateISO).getTime() + 1000 * 60 * 60 * 24 * 90
    ) // default 90 days
      .toISOString()
      .slice(0, 10);

  const horizon: PredictionHorizon = { startISO, endISO };

  const birth = {
    dateISO: body.birthDateISO,
    time: body.birthTime,
    tz: body.birthTz,
    lat: body.lat ?? null,
    lon: body.lon ?? null,
    placeName: body.placeName ?? "",
  };

  // 🔹 Build a cache key – same person + category + horizon
  const cacheKey = JSON.stringify({
    category,
    birth,
    horizon,
  });

  // 🔹 Try cache first
  const now = Date.now();
  const cached = PREDICT_CACHE.get(cacheKey);
  if (cached && now - cached.timestamp < PREDICT_TTL_MS) {
    const value = {
      ...cached.value,
      _cache: "hit",
    };
    return NextResponse.json(value, { status: 200 });
  }

  // 🔹 No valid cache → compute prediction
  const prediction = await buildPrediction({
    birth,
    category,
    horizon,
  });

  const value = {
    ...prediction,
    _cache: "miss",
  };

  // 🔹 Store in cache
  PREDICT_CACHE.set(cacheKey, {
    key: cacheKey,
    value,
    timestamp: now,
  });

  return NextResponse.json(value, { status: 200 });
}
