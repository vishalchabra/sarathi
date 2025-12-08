// FILE: src/lib/astro/getWealthWellnessAdvice.ts

export type Planet =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type MoneyTilt =
  | "income_10th"
  | "gains_11th"
  | "assets_2nd"
  | "expenses_12th"
  | "risk_8th"
  | "trade_3rd"
  | "network_7_11"
  | "none";

export type Advice = {
  note?: string;
  caution?: string;
  eatMore: string[];
  reduce: string[];
  herbs: string[];
  mantra?: string;
};

/* ------------------------------ helpers ------------------------------ */

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function safeArr<T>(v: T[] | undefined | null): T[] {
  return Array.isArray(v) ? v : [];
}

function mergeAdvice(...parts: Array<Partial<Advice> | null | undefined>): Advice {
  const items = parts.filter(Boolean) as Partial<Advice>[];

  const eatMore = uniq(items.flatMap((i) => safeArr(i.eatMore))).slice(0, 8);
  const reduce = uniq(items.flatMap((i) => safeArr(i.reduce))).slice(0, 8);
  const herbs = uniq(items.flatMap((i) => safeArr(i.herbs))).slice(0, 8);

  const joinedNote = items.map((i) => i?.note).filter(Boolean).join(" ");
  const joinedCaution = items.map((i) => i?.caution).filter(Boolean).join(" ");

  // If *everything* is empty, still return a shaped object so the UI never crashes.
  return {
    note: joinedNote || undefined,
    caution: joinedCaution || undefined,
    eatMore,
    reduce,
    herbs,
    mantra: items.find((i) => i?.mantra)?.mantra,
  };
}

/* ----------------------------- rule kits ----------------------------- */
// Keep these light; they’re just examples. You can extend as you like.

const BASE: Advice = {
  eatMore: ["warm cooked meals", "ghee", "whole grains"],
  reduce: ["late-night heavy meals", "excess sugar"],
  herbs: ["ginger", "cumin", "fennel"],
};

const PLANET_RULES: Record<Planet, Partial<Advice>> = {
  Sun: {
    eatMore: ["saffron-infused milk (moderate)", "millets"],
    herbs: ["ashwagandha"],
    note: "Support authority + vitality.",
  },
  Moon: {
    eatMore: ["rice", "milk", "cooling fruits"],
    herbs: ["cardamom"],
    note: "Stabilise emotions and fluids.",
  },
  Mars: {
    eatMore: ["lentils", "beetroot"],
    reduce: ["excess chilli", "fried foods"],
    herbs: ["turmeric"],
    note: "Channel drive; avoid overheating.",
  },
  Mercury: {
    eatMore: ["mung dal", "leafy greens"],
    herbs: ["brahmi", "mint"],
    note: "Calm nerves; support focus.",
  },
  Jupiter: {
    eatMore: ["chickpeas", "pumpkin", "ghee (light)"],
    herbs: ["licorice"],
    note: "Wisdom + growth; avoid excess sweets.",
  },
  Venus: {
    eatMore: ["sweet fruits", "rose water (few drops)"],
    reduce: ["alcohol", "excess dairy"],
    herbs: ["shatavari"],
    note: "Harmony, skin, hormones.",
  },
  Saturn: {
    eatMore: ["sesame", "black gram (moderate)"],
    herbs: ["dashamoola (guided)"],
    note: "Bones, discipline; steady routine.",
  },
  Rahu: {
    reduce: ["stimulants", "ultra-processed snacks"],
    herbs: ["tulsi", "triphala (guided)"],
    caution: "Prone to spikes; keep inputs clean.",
  },
  Ketu: {
    eatMore: ["simple sattvic meals"],
    herbs: ["sage", "gotu kola"],
    note: "Detachment; keep it minimal.",
  },
};

const TILT_RULES: Record<MoneyTilt, Partial<Advice>> = {
  income_10th: { note: "Career tilt: fuel consistency; avoid heavy lunches." },
  gains_11th: { note: "Network/gains tilt: keep mind clear; hydrate." },
  assets_2nd: { note: "Assets tilt: steady sugars; warm breakfasts." },
  expenses_12th: { caution: "Leak risk: avoid impulse snacking/late caffeine." },
  risk_8th: { caution: "Risk/volatility: no alcohol; sleep hygiene top." },
  trade_3rd: { note: "Comms tilt: light meals to keep speech steady." },
  network_7_11: { note: "Relationship/network tilt: calming herbs help grace." },
  none: {},
};

/* ---------------------------- main function -------------------------- */

export function getWealthWellnessAdvice(
  moneyDrivers: Planet[] = [],
  tilt: MoneyTilt = "none",
  ctx?: { weekday?: number; tithiName?: string; nakshatraName?: string }
): Advice {
  // Start from BASE
  const pieces: Array<Partial<Advice>> = [BASE];

  // Add per-planet rules
  for (const p of moneyDrivers) {
    const rule = PLANET_RULES[p];
    if (rule) pieces.push(rule);
  }

  // Add tilt rules
  const tiltRule = TILT_RULES[tilt] || {};
  pieces.push(tiltRule);

  // Mild contextual seasoning (safe defaults)
  if (ctx?.weekday === 1) {
    // Monday → Moon
    pieces.push({ eatMore: ["hydrating fruits"], herbs: ["cardamom"] });
  }
  if (ctx?.nakshatraName?.toLowerCase().includes("magha")) {
    pieces.push({ note: "Royal nakshatra day: keep posture + breath steady." });
  }
  if (ctx?.weekday === 0) { // Sunday → Sun
  pieces.push({ eatMore: ["saffron (pinch)", "millets"], herbs: ["ashwagandha"] });
}
if (ctx?.weekday === 6) { // Saturday → Saturn
  pieces.push({ eatMore: ["sesame"], herbs: ["dashamoola (guided)"], note: "Keep routine steady." });
}
  return mergeAdvice(...pieces);
}
