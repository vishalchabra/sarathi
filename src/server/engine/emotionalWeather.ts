// FILE: src/server/engine/emotionalWeather.ts
import type { DailyFeature } from "@/app/api/ai-daily/route"; // or copy the type

export type EmotionalWeather = {
  dateISO: string;
  moodScore: number;  // 0..1
  intensity: "soft" | "medium" | "sharp";
  moodTag: "uplifted" | "steady" | "sensitive" | "wired";
};

export function scoreDay(f: DailyFeature): EmotionalWeather {
  const base = baseFromHouse(f.houseFromMoon ?? null);
  const { score, intensity } = adjustForTransit(base, f);
  const moodTag = moodTagFromScore(score, intensity);

  return {
    dateISO: f.dateISO,
    moodScore: score,
    intensity,
    moodTag,
  };
}

// plus the helper functions from above: baseFromHouse, adjustForTransit, moodTagFromScore
