// FILE: src/server/guides/engine.ts
import type {
  CoreSignals,
  FoodGuide,
  FastingGuide,
  MoneyWindow,
  MoneyTone,
  EmotionalWeather,
} from "./types";

// ---------- Helpers ----------

function getCurrentMD(signals: CoreSignals): string | undefined {
  const md = signals.dashaStack.find(d => d.level === "MD");
  return md?.planet?.toLowerCase();
}

function hasHealthStress(signals: CoreSignals): boolean {
  return signals.transits.some(
    t =>
      t.category === "health" &&
      [6, 8, 12].includes(t.house) &&
      (t.strength ?? 0) <= 0
  );
}

function firstStrongMoneyTransit(signals: CoreSignals) {
  return signals.transits.find(t =>
    (t.tags ?? []).includes("money") ||
    [2, 8, 11].includes(t.house)
  );
}

// ---------- Food × Astrology ----------

export function buildFoodGuide(signals: CoreSignals): FoodGuide {
  const md = getCurrentMD(signals);
  const guna = signals.moonToday.guna;
  const healthStress = hasHealthStress(signals);

  let tone: FoodGuide["tone"] = "light";
  let suggestedFocus = "simple sattvic + hydration";

  if (healthStress) {
    tone = "grounding";
    suggestedFocus = "warm, grounding meals and easy digestion";
  }

  if (guna === "rajas") {
    tone = "grounding";
    suggestedFocus = "stable, non-jittery foods; avoid overstimulation";
  } else if (guna === "tamas") {
    tone = "energising";
    suggestedFocus = "light but energising foods to avoid sluggishness";
  }

  if (md === "mars" || md === "sun") {
    // cool the fire a bit
    suggestedFocus = "cooling but nourishing foods; avoid excessive heat";
  }

  const doList: string[] = [];
  const avoidList: string[] = [];

  // Base rules
  doList.push("warm cooked meals", "good hydration", "seasonal fruits");

  if (tone === "grounding") {
    doList.push("root vegetables", "healthy fats in moderation");
    avoidList.push("very spicy food", "over-caffeination");
  }

  if (tone === "energising") {
    doList.push("fresh fruits", "light grains", "herbal teas");
    avoidList.push("very heavy late-night dinners");
  }

  if (healthStress) {
    doList.push("easy-to-digest, home-cooked food");
    avoidList.push("fried and excessively oily foods");
  }

  const planetHook =
    md === "mars" || md === "sun"
      ? "cooling Mars/Sun today through food discipline"
      : md
      ? `supporting your running dasha planet (${md.toUpperCase()}) with clean food`
      : "supporting Moon today with simple, sattvic choices";

  return {
    tone,
    suggestedFocus,
    do: Array.from(new Set(doList)),
    avoid: Array.from(new Set(avoidList)),
    planetHook,
  };
}
// ---------- Emotional Weather ----------

export function buildEmotionalWeather(signals: CoreSignals): EmotionalWeather {
  const guna = signals.moonToday.guna; // "sattva" | "rajas" | "tamas" | undefined
  const md = getCurrentMD(signals);

  let score = 0;

  // 1) Base from guna
  if (guna === "sattva") score += 2;
  if (guna === "rajas") score += 0;
  if (guna === "tamas") score -= 2;

  // 2) Transits touching inner/relationship/health space
  const emotionalTransits = signals.transits.filter(t =>
    ["inner", "relationships", "health"].includes(t.category)
  );

  emotionalTransits.forEach(t => {
    const s = t.strength ?? 0;
    if (s >= 2) score += 1;
    if (s <= -2) score -= 1;
  });

  // Clamp score
  if (score > 4) score = 4;
  if (score < -4) score = -4;

  // 3) Tone based on score
  let tone: EmotionalWeather["tone"] = "mixed";
  if (score >= 2) tone = "calm";
  else if (score >= 0) tone = "mixed";
  else if (score <= -3) tone = "intense";
  else tone = "sensitive";

  // 4) Headline text
  let headline = "Emotional weather: Mixed";
  if (tone === "calm") headline = "Emotional weather: Clear & grounded";
  if (tone === "sensitive") headline = "Emotional weather: Sensitive & reactive";
  if (tone === "intense") headline = "Emotional weather: Intense & transformative";

  // 5) Summary – 2–3 lines using guna + MD
  const lines: string[] = [];

  if (guna === "sattva") {
    lines.push("Mind has more access to clarity and perspective today.");
  } else if (guna === "rajas") {
    lines.push("There is movement and restlessness; mind wants to act or respond.");
  } else if (guna === "tamas") {
    lines.push("Energy can feel heavy or slow; emotions may lean towards withdrawal.");
  }

  if (md) {
    lines.push(`You are in ${md.toUpperCase()} Mahadasha, so today's mood still carries that planet's long-term flavour.`);
  }

  if (emotionalTransits.length === 0) {
    lines.push("No very sharp emotional triggers from transits – day responds more to your own choices.");
  } else {
    lines.push("Certain transits are colouring how you receive people and events today.");
  }

  const summary = lines.join(" ");

  // 6) Do / Avoid suggestions
  const doList: string[] = [];
  const avoidList: string[] = [];

  if (tone === "calm") {
    doList.push("schedule meaningful conversations", "do focused work or planning");
    avoidList.push("wasting the clarity window on doom-scrolling");
  } else if (tone === "sensitive") {
    doList.push("slow down responses", "journal or voice-note your feelings");
    avoidList.push("over-explaining yourself", "taking every comment personally");
  } else if (tone === "intense") {
    doList.push("move the body (walk / workout)", "channel emotion into prayer or creative work");
    avoidList.push("big confrontations", "final decisions made in the peak of emotion");
  } else {
    // mixed
    doList.push("keep the day flexible", "take small breaks to check in with yourself");
    avoidList.push("over-scheduling", "trying to fix every issue at once");
  }

  // 7) Key transit (optional)
  const strongestTransit = emotionalTransits.sort(
    (a, b) => Math.abs((b.strength ?? 0)) - Math.abs((a.strength ?? 0))
  )[0];

  let keyTransit: EmotionalWeather["keyTransit"] | undefined;

  if (strongestTransit) {
    const label = `${strongestTransit.planet} transit`;
    const whyParts: string[] = [];

    whyParts.push(
      `affecting the ${strongestTransit.category} zone (house ${strongestTransit.house})`
    );

    const s = strongestTransit.strength ?? 0;
    if (s >= 2) whyParts.push("bringing heightened awareness and emotional charge");
    if (s <= -2) whyParts.push("pressuring you to see what no longer works");

    keyTransit = {
      label,
      why: whyParts.join("; "),
    };
  }

  return {
    tone,
    score,
    headline,
    summary,
    do: Array.from(new Set(doList)),
    avoid: Array.from(new Set(avoidList)),
    keyTransit,
  };
}

// ---------- Fasting × Astrology ----------

const FAST_TITHIS = ["Ekadashi", "Trayodashi", "Purnima", "Amavasya"];

function isSupportiveTithi(tithiName: string | undefined): boolean {
  if (!tithiName) return false;
  return FAST_TITHIS.some(t => tithiName.toLowerCase().includes(t.toLowerCase()));
}

function isHeavyHealthStress(signals: CoreSignals): boolean {
  // same as healthStress but stricter (more than one hit)
  const hits = signals.transits.filter(
    t =>
      t.category === "health" &&
      [6, 8, 12].includes(t.house) &&
      (t.strength ?? 0) <= 0
  );
  return hits.length >= 2;
}

export function buildFastingGuide(signals: CoreSignals): FastingGuide {
  const tithiName = signals.panchang.tithi;
  const weekday = signals.panchang.weekday;
  const md = getCurrentMD(signals);
  const supportiveTithi = isSupportiveTithi(tithiName);
  const heavyStress = isHeavyHealthStress(signals);

  // Basic weekday → planet hook
  const weekdayPlanetMap: Record<string, string> = {
    Sunday: "Sun",
    Monday: "Moon",
    Tuesday: "Mars",
    Wednesday: "Mercury",
    Thursday: "Jupiter",
    Friday: "Venus",
    Saturday: "Saturn",
  };

  const weekdayPlanet = weekdayPlanetMap[weekday] ?? undefined;

  let suitableToday = supportiveTithi || !!weekdayPlanet;
  let type: FastingGuide["type"] = "partial";
  let suggestion = "keep food simple and light; avoid overeating";
  const cautions: string[] = [];

  if (heavyStress) {
    // don't push too hard on fasting when health is under pressure
    suitableToday = true;
    type = "just light food";
    cautions.push("avoid strict fasting if you feel weak or are on medication");
  } else if (supportiveTithi && !heavyStress) {
    type = "full";
    suggestion = "if health permits, observe a simple fast + extra water and mantra";
  }

  const planetFocus =
    md && weekdayPlanet && md.toLowerCase() === weekdayPlanet.toLowerCase()
      ? `${weekdayPlanet} (aligning weekday with your running dasha)`
      : weekdayPlanet || md;

  return {
    suitableToday,
    type,
    planetFocus,
    suggestion,
    cautions: cautions.length ? cautions : undefined,
  };
}

// ---------- Money × Astrology (weekly/monthly windows) ----------

function classifyMoneyTone(strengthSum: number): MoneyTone {
  if (strengthSum >= 3) return "opportunity";
  if (strengthSum <= -2) return "cautious";
  return "balanced";
}

export function buildMoneyWindows(
  signals: CoreSignals,
  label: string
): MoneyWindow[] {
  // v1: just one “current window” using money-related transits.
  const moneyTransits = signals.transits.filter(
    t =>
      (t.tags ?? []).includes("money") ||
      [2, 8, 11].includes(t.house)
  );

  if (!moneyTransits.length) {
    return [
      {
        label,
        tone: "balanced",
        focus: "steady cashflow and basic review",
        do: ["track monthly expenses", "continue small systematic investments"],
        avoid: ["impulsive big purchases", "high-risk leverage trades"],
        why: "no major money-related transits currently in strong stress or boost",
      },
    ];
  }

  const strengthSum = moneyTransits.reduce(
    (sum, t) => sum + (t.strength ?? 0),
    0
  );
  const tone = classifyMoneyTone(strengthSum);

  const doList: string[] = [];
  const avoidList: string[] = [];

  let focus = "cashflow and stability";

  if (tone === "opportunity") {
    focus = "investments and growth moves";
    doList.push(
      "review long-term investment plan",
      "increase systematic, affordable investments if comfortable"
    );
    avoidList.push("reckless speculation", "all-in bets");
  } else if (tone === "cautious") {
    focus = "debt cleanup and protection";
    doList.push(
      "review existing loans and liabilities",
      "build or top-up emergency fund"
    );
    avoidList.push("new unnecessary loans", "large luxury buys");
  } else {
    // balanced
    doList.push("maintain basic saving habit", "small but consistent SIPs");
    avoidList.push("emotional spending", "comparison-driven purchases");
  }

  const strongest = moneyTransits.sort(
    (a, b) => (Math.abs(b.strength ?? 0) - Math.abs(a.strength ?? 0))
  )[0];

  const whyParts: string[] = [];
  if (strongest) {
    whyParts.push(
      `${strongest.planet} in house ${strongest.house}${
        strongest.sign ? " in " + strongest.sign : ""
      }`
    );
  }
  if (strengthSum) {
    whyParts.push(
      `overall money transit strength around ${strengthSum >= 0 ? "+" : ""}${strengthSum}`
    );
  }

  const why =
    whyParts.length > 0
      ? whyParts.join("; ")
      : "mixed but manageable money transits.";

  return [
    {
      label,
      tone,
      focus,
      do: Array.from(new Set(doList)),
      avoid: Array.from(new Set(avoidList)),
      why,
    },
  ];
}
