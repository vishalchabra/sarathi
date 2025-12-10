// FILE: src/server/engine/emotionalWeather.ts
// import type { DailyFeature } from "@/app/api/ai-daily/route"; // now unused here
// Minimal local placeholder; refine later if needed
type DailyFeature = any;

export type EmotionalWeather = {
  dateISO: string;
  moodScore: number;
  intensity: "medium" | "soft" | "sharp";
  moodTag: "sensitive" | "steady" | "uplifted" | "wired";

  // new field if you really want it
  quality?: "steady" | "sensitive" | "intense" | "flat";
};

// --- Temporary stubs; replace with real logic later ---

function baseFromHouse(houseFromMoon: number | null): { baseScore: number } {
  // Simple neutral baseline; real logic can weight houses later
  return { baseScore: 50 };
}

function adjustForTransit(
  base: { baseScore: number },
  _f: DailyFeature
): { score: number; intensity: "soft" | "medium" | "sharp" } {
  // For now just pass through with a medium intensity
  return { score: base.baseScore, intensity: "medium" };
}
type MoodTag = "sensitive" | "steady" | "uplifted" | "wired";
function moodTagFromScore(
  score: number,
  intensity: "soft" | "medium" | "sharp"
): MoodTag {
  // Very simple placeholder tagging using only allowed tags
  if (score >= 75) return "uplifted";

  if (score <= 35) {
    // Low score: either "wired" (sharp over-activation) or "sensitive"
    return intensity === "sharp" ? "wired" : "sensitive";
  }

  // Middle band: steady
  return "steady";
}

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
