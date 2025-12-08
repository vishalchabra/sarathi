// FILE: src/server/astro/food-guide.ts
import "server-only";

export type FoodTone = "sattvic" | "rajasic" | "tamasic";

export type FoodSuggestion = {
  tone: FoodTone;
  headline: string;
  description: string;
  examplesToFavor: string[];
  examplesToReduce: string[];
  reason: string;
};

/**
 * Very simple tone mapping by planet
 * (we can refine this later nakshatra-by-nakshatra)
 */
const PLANET_TONE: Record<string, FoodTone> = {
  Sun: "sattvic",
  Moon: "sattvic",
  Mars: "rajasic",
  Mercury: "sattvic",
  Jupiter: "sattvic",
  Venus: "rajasic",
  Saturn: "tamasic",
  Rahu: "tamasic",
  Ketu: "sattvic",
};

const WEEKDAY_TONE: Record<string, FoodTone> = {
  Sunday: "sattvic",
  Monday: "sattvic",
  Tuesday: "rajasic",
  Wednesday: "sattvic",
  Thursday: "sattvic",
  Friday: "rajasic",
  Saturday: "tamasic",
};

const SATTVIC_EXAMPLES = [
  "warm home-cooked dal",
  "fresh fruits",
  "light khichdi",
  "steamed vegetables",
  "herbal tea",
];

const RAJASIC_EXAMPLES = [
  "spiced curries (not too oily)",
  "lightly fried snacks in moderation",
  "chapati with sabzi",
  "buttermilk",
];

const TAMASIC_EXAMPLES = [
  "very heavy fried food",
  "excessive sweets",
  "packaged junk food",
  "late-night heavy meals",
];

function pickTone(
  mdPlanetRaw: string | null,
  weekdayRaw: string | null
): FoodTone {
  const mdPlanet = mdPlanetRaw ? normalisePlanet(mdPlanetRaw) : null;
  const weekday = weekdayRaw ? normaliseWeekday(weekdayRaw) : null;

  const fromPlanet = mdPlanet ? PLANET_TONE[mdPlanet] : undefined;
  const fromWeekday = weekday ? WEEKDAY_TONE[weekday] : undefined;

  // Priority: MD lord → weekday → default
  if (fromPlanet && fromWeekday) {
    if (fromPlanet === fromWeekday) return fromPlanet;

    // If one is tamasic and other is sattvic, soften to rajasic (middle)
    if (
      (fromPlanet === "tamasic" && fromWeekday === "sattvic") ||
      (fromPlanet === "sattvic" && fromWeekday === "tamasic")
    ) {
      return "rajasic";
    }

    // Otherwise MD has slight priority
    return fromPlanet;
  }

  if (fromPlanet) return fromPlanet;
  if (fromWeekday) return fromWeekday;

  return "sattvic";
}

function normalisePlanet(p: string): string {
  const x = p.trim().toLowerCase();
  if (x.startsWith("sun")) return "Sun";
  if (x.startsWith("mo")) return "Moon";
  if (x.startsWith("ma")) return "Mars";
  if (x.startsWith("me")) return "Mercury";
  if (x.startsWith("ju")) return "Jupiter";
  if (x.startsWith("ve")) return "Venus";
  if (x.startsWith("sa")) return "Saturn";
  if (x.startsWith("ra")) return "Rahu";
  if (x.startsWith("ke")) return "Ketu";
  return p;
}

function normaliseWeekday(w: string): string {
  const x = w.trim().toLowerCase();
  if (x.startsWith("sun")) return "Sunday";
  if (x.startsWith("mon")) return "Monday";
  if (x.startsWith("tue")) return "Tuesday";
  if (x.startsWith("wed")) return "Wednesday";
  if (x.startsWith("thu")) return "Thursday";
  if (x.startsWith("fri")) return "Friday";
  if (x.startsWith("sat")) return "Saturday";
  return w;
}

/**
 * Safe helper to dig MD planet + weekday + Moon nakshatra
 * without depending on strict CoreSignals typing.
 */
function extractContext(core: any): {
  mdPlanet: string | null;
  weekday: string | null;
  moonNakshatra: string | null;
} {
  let mdPlanet: string | null = null;
  let weekday: string | null = null;
  let moonNakshatra: string | null = null;

  // MD planet — try a few shapes
  if (core?.dasha?.current?.md?.planet) {
    mdPlanet = core.dasha.current.md.planet;
  } else if (core?.dasha?.mahadasha?.lord) {
    mdPlanet = core.dasha.mahadasha.lord;
  } else if (core?.dasha?.mahadasha?.planet) {
    mdPlanet = core.dasha.mahadasha.planet;
  }

  // Weekday — panchang or date
  if (core?.panchang?.weekday) {
    weekday = core.panchang.weekday;
  } else if (core?.date?.weekday) {
    weekday = core.date.weekday;
  }

  // Moon nakshatra (optional flavour)
  if (core?.panchang?.nakshatra?.name) {
    moonNakshatra = core.panchang.nakshatra.name;
  } else if (core?.moon?.nakshatra?.name) {
    moonNakshatra = core.moon.nakshatra.name;
  }

  return { mdPlanet, weekday, moonNakshatra };
}

export function buildFoodGuidance(core: any): FoodSuggestion {
  const { mdPlanet, weekday, moonNakshatra } = extractContext(core);
  const tone = pickTone(mdPlanet, weekday);

  let headline: string;
  let description: string;
  let examplesToFavor: string[];
  let examplesToReduce: string[];

  if (tone === "sattvic") {
    headline = "Favour light sattvic foods today.";
    description =
      "Keep the system clear and calm. Warm, simple, freshly cooked food will support your mind and energy better than heavy or complicated meals.";
    examplesToFavor = SATTVIC_EXAMPLES;
    examplesToReduce = [...RAJASIC_EXAMPLES, ...TAMASIC_EXAMPLES];
  } else if (tone === "rajasic") {
    headline = "Go for balanced, energising food — not too heavy.";
    description =
      "You may need focus and drive today, so balanced meals with some spice are fine, as long as you avoid going overboard with oil, sugar, or late-night eating.";
    examplesToFavor = [...SATTVIC_EXAMPLES, ...RAJASIC_EXAMPLES];
    examplesToReduce = TAMASIC_EXAMPLES;
  } else {
    headline = "Keep heavy, tamasic food low and support digestion.";
    description =
      "The day can pull you toward sluggishness if you overload the system. If you eat something heavy, balance it with light, warm, and simple meals in the rest of the day.";
    examplesToFavor = SATTVIC_EXAMPLES;
    examplesToReduce = [...RAJASIC_EXAMPLES, ...TAMASIC_EXAMPLES];
  }

  const reasonParts: string[] = [];

  if (mdPlanet) {
    reasonParts.push(`current mahadasha influence from ${mdPlanet}`);
  }
  if (weekday) {
    reasonParts.push(`${weekday} rulership`);
  }
  if (moonNakshatra) {
    reasonParts.push(`Moon in ${moonNakshatra}`);
  }

  const reason =
    reasonParts.length > 0
      ? `Reason: ${reasonParts.join(" + ")}.`
      : "Reason: general alignment for cleaner, more stable energy.";

  return {
    tone,
    headline,
    description,
    examplesToFavor,
    examplesToReduce,
    reason,
  };
}
