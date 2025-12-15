// FILE: src/server/guides/types.ts
// Shared types for Sārathi "guides" (Daily Guide, Food, Fasting, Money, etc.)

export type CoreBirthSignals = {
  dateISO: string;          // "YYYY-MM-DD"
  time: string;             // "HH:mm"
  tz: string;               // IANA TZ
  lat: number;
  lon: number;
  lagnaSign?: string | null;
};

export type CoreTransitSignal = {
  planet: string;
  house?: number;
  sign?: string;
  category?: "career" | "relationships" | "health" | "inner" | "general" | string;
  strength?: number;
  tags?: string[];
  windowLabel?: string;
  target?: string;
  startISO?: string;
  endISO?: string;
};

export type CoreMoonToday = {
  sign: string;
  nakshatra: string;
  houseFromMoon?: number;
  guna?: "sattva" | "rajas" | "tamas" | string | undefined;
};

export type CorePanchangToday = {
  tithi?: string;
  weekday?: string;
  yogaName?: string;
  karanaName?: string;
  sunriseISO?: string;
};

export type CoreSignals = {
  birth: CoreBirthSignals;
  dashaStack: any[];        // future: structured dasha stack
  transits: CoreTransitSignal[];
  moonToday: CoreMoonToday;
  panchang: CorePanchangToday;
  lagnaSign?: string | null;
};

/* ---------------- Emotional Weather ---------------- */

export type EmotionalWeatherTone =
  | "sensitive"
  | "steady"
  | "intense"
  | "light";

export type EmotionalWeather = {
  tone: EmotionalWeatherTone;
  headline: string;
  summary: string;
  keyTransit?: {
    label: string;
    why: string;
  } | null;
  do: string[];
  avoid: string[];
};

/* ---------------- Food Guide ---------------- */

export type FoodTone = "light" | "grounding" | "energising";

export type FoodGuide = {
  tone: FoodTone;
  suggestedFocus: string;      // e.g. "simple sattvic + hydration"
  do: string[];                // "warm cooked meals", "seasonal fruits"
  avoid: string[];             // "late heavy dinners", "very spicy"
  planetHook: string;          // "supporting Moon today", "cooling Mars today"
};

/* ---------------- Fasting Guide (stub for now) ---------------- */

export type FastingIntensity = "full" | "partial" | "just light food";

export type FastingGuide = {
  suitableToday: boolean;
  type: FastingIntensity;
  planetFocus?: string;
  suggestion: string;
  cautions?: string[];
};

/* ---------------- Money Windows (future) ---------------- */

export type MoneyTone = "cautious" | "balanced" | "opportunity";

export type MoneyWindow = {
  label: string;              // "Nov 20–26", "Dec 2025"
  tone: MoneyTone;
  focus: string;              // "cashflow", "investments", "debt cleanup"
  do: string[];
  avoid: string[];
  why: string;
};
export type MoneyMicroTip = {
  tone: MoneyTone;
  summary: string;     // short, 1–2 lines: "Balanced: good for..."
  do: string[];        // action bullets
  avoid: string[];     // what not to do
};
