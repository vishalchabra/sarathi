// FILE: src/app/api/sarathi/daily-guide/route.ts
"use server";

import { NextRequest } from "next/server";
import type {
  CoreSignals,
  EmotionalWeather,
  FoodGuide,
  FastingGuide,
  MoneyWindow,
  MoneyMicroTip,
  MoneyTone,
  CoreTransitSignal,
} from "@/server/guides/types";

import { cacheGet, cacheSet, makeCacheKey } from "@/server/cache/simpleCache";
/* ---------------- Helpers ---------------- */

function normaliseCategory(
  cat?: string
): "career" | "relationships" | "health" | "inner" | "general" {
  if (!cat) return "general";
  const c = cat.toLowerCase();
  if (c === "career") return "career";
  if (c === "relationships" || c === "relationship") return "relationships";
  if (c === "health") return "health";
  if (c === "inner" || c === "spiritual") return "inner";
  return "general";
}

function strongestTransit(core: CoreSignals): CoreTransitSignal | null {
  if (!Array.isArray(core.transits) || !core.transits.length) return null;
  return core.transits.reduce((best, cur) => {
    const b = typeof best.strength === "number" ? best.strength : 0;
    const c = typeof cur.strength === "number" ? cur.strength : 0;
    return c > b ? cur : best;
  });
}

function isMarsKetu(t?: CoreTransitSignal | null): boolean {
  if (!t) return false;
  const planet = (t.planet || "").toLowerCase();
  const target = (t.target || "").toLowerCase();
  return (
    planet === "mars" &&
    /natal\s+ketu/.test(target)
  );
}
function isMoneyTransit(t: CoreTransitSignal): boolean {
  const house = t.house;
  const cat = normaliseCategory(t.category);
  const tags = (t.tags || []).map((x) => (x || "").toString().toLowerCase());

  const moneyTag =
    tags.includes("money") ||
    tags.includes("finance") ||
    tags.includes("income") ||
    tags.includes("salary") ||
    tags.includes("bonus");

  const moneyHouse = house === 2 || house === 8 || house === 11;

  return moneyTag || moneyHouse || cat === "career";
}

/* ---------------- Emotional Weather builder ---------------- */

function buildEmotionalWeather(core: CoreSignals): EmotionalWeather {
  // 1) Read useful signals
  const moonNak =
    (core.moonToday?.nakshatra || "").toString().toLowerCase();
  const relHouse = core.moonToday?.houseFromMoon;
  const tithiRaw =
  (core.panchang?.tithi ??
    (core.panchang as any)?.tithiName ??
    "")
    .toString()
    .toLowerCase();

  const weekdayRaw =
    (core.panchang?.weekday ||
      (core as any).weekday ||
      "")!
      .toString()
      .toLowerCase();

  const transits = Array.isArray(core.transits) ? core.transits : [];

  let tone: "steady" | "sensitive" | "intense" | "low" = "steady";

  // 2) If something upstream explicitly set a tone, respect it
  const providedTone = ((core as any).emotionalTone ||
    (core as any).tone ||
    "") as string;
  if (typeof providedTone === "string" && providedTone) {
    const t = providedTone.toLowerCase();
    if (t === "steady" || t === "sensitive" || t === "intense" || t === "low") {
      tone = t as any;
    }
  }

  // 3) Heuristics from chart & transits (only if not already set)
  if (tone === "steady") {
    const sensitiveNaks = [
      "ardra",
      "ashlesha",
      "jyeshtha",
      "mula",
      "moola",
      "purva bhadrapada",
      "purva-bhadrapada",
    ];
    const soothingNaks = ["pushya", "anuradha", "hasta", "revati"];

    const isSensitiveNak = sensitiveNaks.some((n) => moonNak.includes(n));
    const isSoothingNak = soothingNaks.some((n) => moonNak.includes(n));

    const isAmavasya = tithiRaw.includes("amavasya");
    const isPurnima =
      tithiRaw.includes("purnima") || tithiRaw.includes("poornima");
    const isDarkFortnight = tithiRaw.startsWith("krishna");

    const strongest = strongestTransit(core);
    const marsKetu = isMarsKetu(strongest);

    let strongInnerHit = false;
    let saturnHeavyInner = false;

    for (const t of transits) {
      const planet = (t.planet || "").toString().toLowerCase();
      const cat = normaliseCategory(t.category);
      const s =
        typeof t.strength === "number" && Number.isFinite(t.strength)
          ? t.strength
          : 0;

      if (cat === "inner" && s >= 0.6) {
        strongInnerHit = true;
        if (
          planet === "saturn" ||
          planet === "rahu" ||
          planet === "ketu" ||
          planet === "mars"
        ) {
          saturnHeavyInner = saturnHeavyInner || planet === "saturn";
        }
      }

      const house = t.house;
      if (
        planet === "saturn" &&
        s >= 0.6 &&
        (house === 8 || house === 12)
      ) {
        saturnHeavyInner = true;
      }
    }

    // Primary rules
    if (marsKetu) {
      tone = "intense";
    } else if (saturnHeavyInner && isDarkFortnight && !isPurnima) {
      tone = "low";
    } else if (strongInnerHit || isSensitiveNak || isAmavasya || isPurnima) {
      tone = "sensitive";
    } else if (isSoothingNak && !isDarkFortnight && !strongInnerHit) {
      tone = "steady";
    }

    // Small bonus tweak: Moon in 8/12 from itself can feel more inward
    if (
      typeof relHouse === "number" &&
      (relHouse === 8 || relHouse === 12) &&
      tone === "steady"
    ) {
      tone = "low";
    }
  }

  // 4) Map tone → user-facing copy
  if (tone === "intense") {
    return {
      quality: "intense",
      summary:
        "There is a strong emotional undercurrent. Old themes or unresolved feelings can resurface; respond slowly and consciously instead of reacting in the moment.",
      workWithIt:
        "Pause before big conversations, channel intensity into one clear task, prioritise grounding routines like sleep, food and movement.",
      avoid:
        "All-or-nothing decisions, revenge thinking or score-keeping, doom-scrolling or letting yourself spiral in loops.",
    };
  }

  if (tone === "sensitive") {
    return {
      quality: "sensitive",
      summary:
        "Emotions are closer to the surface today. Mood can shift with environment, people and the information you consume.",
      workWithIt:
        "Slow the pace a little, choose gentle company and media, give yourself permission to feel without judging yourself.",
      avoid:
        "Over-exposure to stressful news, harsh self-talk, forcing big life decisions when you’re not feeling clear.",
    };
  }

  if (tone === "low") {
    return {
      quality: "low",
      summary:
        "Energy may feel lower or more inward today. Motivation can dip, but this is actually good for rest, reflection and quiet progress.",
      workWithIt:
        "Lower the bar, focus on one or two small meaningful tasks, build in extra rest and simple grounding routines.",
      avoid:
        "Comparing your pace to others, labelling yourself as ‘lazy’, overloading the schedule just to avoid uncomfortable feelings.",
    };
  }

  // default: steady
  return {
    quality: "steady",
    summary:
      "Emotional climate is workable and grounded. You can handle tasks and conversations with a calm, measured approach.",
    workWithIt:
      "Schedule important tasks and key conversations, clear one or two pending items, stay present rather than rushing.",
    avoid:
      "Over-scheduling yourself, ignoring subtle emotional signals, making promises you cannot realistically keep.",
  };
}


/* ---------------- Food Guide builder ---------------- */

function inferGunaFromNakshatra(name: string): "sattva" | "rajas" | "tamas" {
  const n = name.toLowerCase();

  const sattvaList = [
    "punarvasu",
    "pushya",
    "hasta",
    "anuradha",
    "revati",
    "uttara bhadrapada",
    "uttara-bhadrapada",
  ];
  const rajasList = [
    "ashwini",
    "bharani",
    "mrigashira",
    "ardra",
    "chitra",
    "dhanishta",
    "shatabhisha",
  ];
  const tamasList = [
    "krittika",
    "ashlesha",
    "magha",
    "jyeshtha",
    "mula",
    "purva ashadha",
    "uttara ashadha",
    "purva-ashada",
    "uttara-ashada",
  ];

  if (sattvaList.some((x) => n.includes(x))) return "sattva";
  if (rajasList.some((x) => n.includes(x))) return "rajas";
  if (tamasList.some((x) => n.includes(x))) return "tamas";

  // default: treat unknown as sattva-leaning
  return "sattva";
}

/* ---------------- Food helper ---------------- */

function buildFoodGuide(core: CoreSignals, emotionalWeather: EmotionalWeather): FoodGuide {
  const tone = (emotionalWeather as any)?.tone ?? (emotionalWeather as any)?.quality ?? "steady";
  const nak = (core.moonToday?.nakshatra || "").toString().toLowerCase().trim();

  // Try to get a clean weekday string from multiple places
  const weekdayRaw = (
    core.panchang?.weekday ||
    (core.panchang as any)?.weekdayName ||
    (core as any).weekday ||
    ""
  )
    .toString()
    .toLowerCase()
    .trim();

  // --- Baseline generic guidance ---
  let focus = "simple sattvic food and hydration.";

  const doList: string[] = [
    "simple home-cooked meals",
    "fresh fruits and vegetables",
    "adequate water and herbal teas",
  ];

  const avoidList: string[] = [
    "very oily or fried foods",
    "overeating, especially at night",
    "too much sugar 'for comfort'",
  ];

  function pushUnique(arr: string[], item: string) {
    if (!arr.includes(item)) arr.push(item);
  }

  // Weekday → planet lord (with date fallback)
  let weekdayLord:
    | "sun"
    | "moon"
    | "mars"
    | "mercury"
    | "jupiter"
    | "venus"
    | "saturn"
    | null = null;

  // 1) Use Panchang weekday text if available
  if (weekdayRaw.startsWith("sun")) weekdayLord = "sun";
  else if (weekdayRaw.startsWith("mon")) weekdayLord = "moon";
  else if (weekdayRaw.startsWith("tue")) weekdayLord = "mars";
  else if (weekdayRaw.startsWith("wed")) weekdayLord = "mercury";
  else if (weekdayRaw.startsWith("thu")) weekdayLord = "jupiter";
  else if (weekdayRaw.startsWith("fri")) weekdayLord = "venus";
  else if (weekdayRaw.startsWith("sat")) weekdayLord = "saturn";

  // 2) If still null, fall back to JS date → weekday
  if (!weekdayLord) {
    try {
      const iso = (core.birth?.dateISO || new Date().toISOString().slice(0, 10)) as string;
      const d = new Date(iso + "T00:00:00");
      const dow = d.getUTCDay(); // 0 = Sun, 6 = Sat

      if (dow === 0) weekdayLord = "sun";
      else if (dow === 1) weekdayLord = "moon";
      else if (dow === 2) weekdayLord = "mars";
      else if (dow === 3) weekdayLord = "mercury";
      else if (dow === 4) weekdayLord = "jupiter";
      else if (dow === 5) weekdayLord = "venus";
      else if (dow === 6) weekdayLord = "saturn";
    } catch {
      // ignore – we'll handle fallback below
    }
  }

  // 3) As a last resort, if still null, assume Sun (never fully generic)
  if (!weekdayLord) {
    weekdayLord = "sun";
  }

  // Planet-specific food logic – driven by weekday lord
  if (weekdayLord === "sun") {
    focus =
      "simple sattvic food with warm, lightly spiced elements that support Sun energy.";
    pushUnique(doList, "warm, freshly cooked meals");
    pushUnique(doList, "a little ghee or other healthy fats");
    pushUnique(doList, "golden / yellow foods (dal, turmeric, saffron)");
    pushUnique(
      avoidList,
      "skipping breakfast or going too long without food during the day"
    );
  } else if (weekdayLord === "moon") {
    focus =
      "calming, well-hydrated food that soothes the nervous system and supports Moon energy.";
    pushUnique(doList, "light khichdi or soups");
    pushUnique(
      doList,
      "cooling but not icy drinks (like herbal teas or warm water)"
    );
    pushUnique(doList, "simple, comforting home food");
    pushUnique(avoidList, "very spicy, rajasic food late at night");
  } else if (weekdayLord === "mars") {
    focus =
      "grounding but not overly spicy food so Mars stays constructive, not reactive.";
    pushUnique(
      doList,
      "balanced protein (lentils, beans, paneer or your usual source)"
    );
    pushUnique(doList, "moderate spices with digestion support (jeera, ajwain)");
    pushUnique(
      avoidList,
      "excess chilli and stimulants that spike anger or restlessness"
    );
  } else if (weekdayLord === "mercury") {
    focus =
      "clean, light food that keeps the mind clear and focused for Mercury.";
    pushUnique(doList, "green vegetables and leafy salads");
    pushUnique(doList, "nuts and seeds in small quantities");
    pushUnique(avoidList, "heavy, greasy meals that cause brain fog");
  } else if (weekdayLord === "jupiter") {
    focus =
      "nourishing sattvic food with good fats, taken with gratitude to support Jupiter.";
    pushUnique(doList, "warm, nourishing dal and grains");
    pushUnique(doList, "a little ghee in moderation");
    pushUnique(
      avoidList,
      "overeating just because food tastes good or as emotional comfort"
    );
  } else if (weekdayLord === "venus") {
    focus =
      "pleasant, aesthetically plated but not excessive food to channel Venus harmoniously.";
    pushUnique(doList, "fresh, colourful plates with variety");
    pushUnique(
      doList,
      "natural sweetness (fruits, dates) in moderation if it suits your body"
    );
    pushUnique(
      avoidList,
      "emotional eating and rich desserts beyond the point of comfort"
    );
  } else if (weekdayLord === "saturn") {
    focus =
      "simple, disciplined meals at regular times to work with Saturn steadily.";
    pushUnique(
      doList,
      "timely, no-drama meals with simple grains and vegetables"
    );
    pushUnique(doList, "good fibre and warm water across the day");
    pushUnique(
      avoidList,
      "eating very late at night or skipping meals then binging"
    );
  }

  // Emotional tone tweaks
  if (tone === "intense") {
    pushUnique(
      avoidList,
      "excess caffeine, energy drinks or too much tea / coffee"
    );
    pushUnique(avoidList, "mindless snacking while scrolling or working");
    pushUnique(doList, "grounding foods like root vegetables and warm khichdi");
  } else if (tone === "sensitive" || tone === "low") {
    pushUnique(doList, "warm, easy-to-digest meals in smaller portions");
    pushUnique(doList, "soothing herbal teas across the day");
    pushUnique(avoidList, "skipping meals and then overeating later");
  }

  // Light nakshatra flavour
  if (nak.includes("mula") || nak.includes("ashadha")) {
    pushUnique(
      doList,
      "lightly spiced, well-cooked food rather than heavy junk or fast food"
    );
  } else if (
    nak.includes("rohini") ||
    nak.includes("uttara") ||
    nak.includes("pushya")
  ) {
    pushUnique(
      doList,
      "fresh dairy in moderation if it suits your body and medical condition"
    );
  }

  return {
    suggestedFocus: focus,
    do: doList,
    avoid: avoidList,
  };
}




/* ---------------- Fasting & Discipline helper ---------------- */

function buildFastingGuide(core: CoreSignals, emotionalWeather: EmotionalWeather): FastingGuide {
  const tone = emotionalWeather?.tone || "steady";

  const tithiRaw = (core.panchang?.tithiName || "")
    .toString()
    .toLowerCase()
    .trim();
  const weekdayRaw = (
    core.panchang?.weekday ||
    (core as any).weekday ||
    ""
  )
    .toString()
    .toLowerCase()
    .trim();

  const stack = Array.isArray(core.dashaStack) ? core.dashaStack : [];
  const mdObj = stack[0] ?? null;
  const adObj = stack[1] ?? null;

  const md = String(
    mdObj?.planet || mdObj?.lord || mdObj?.mdLord || ""
  ).toLowerCase();
  const ad = String(
    adObj?.planet || adObj?.lord || adObj?.adLord || ""
  ).toLowerCase();

  const isEkadashi = tithiRaw.includes("ekadashi");
  const isPurnima =
    tithiRaw.includes("purnima") || tithiRaw.includes("poornima");
  const isAmavasya = tithiRaw.includes("amavasya");

  let weekdayLord:
    | "sun"
    | "moon"
    | "mars"
    | "mercury"
    | "jupiter"
    | "venus"
    | "saturn"
    | null = null;

  if (weekdayRaw.startsWith("sun")) weekdayLord = "sun";
  else if (weekdayRaw.startsWith("mon")) weekdayLord = "moon";
  else if (weekdayRaw.startsWith("tue")) weekdayLord = "mars";
  else if (weekdayRaw.startsWith("wed")) weekdayLord = "mercury";
  else if (weekdayRaw.startsWith("thu")) weekdayLord = "jupiter";
  else if (weekdayRaw.startsWith("fri")) weekdayLord = "venus";
  else if (weekdayRaw.startsWith("sat")) weekdayLord = "saturn";

  const emphasisedPlanet = ((): string | null => {
    if (weekdayLord && md.includes(weekdayLord)) return weekdayLord;
    if (md) return md;
    return weekdayLord;
  })();

  let suitableToday = false;
  let type: FastingGuide["type"] = "light";
  let planetFocus: string | undefined;
  let suggestion =
    "Focus on light, clean, regular meals rather than strict fasting. Keep discipline gentle: avoid obvious excess and respect your body's signals.";
  const cautions: string[] = [
    "If you have any medical condition or are on regular medication, avoid strict fasting without medical advice.",
    "Prioritise hydration and do not ignore signs of dizziness, weakness or headache.",
  ];

  if (isEkadashi || isPurnima || isAmavasya) {
    suitableToday = true;
    type = "partial";
    suggestion =
      "A classical fasting / upavas day in many traditions. If your health allows, you can keep a lighter, more disciplined food routine today.";

    if (isEkadashi) {
      planetFocus = "Vishnu / Moon focus (Ekadashi discipline)";
    } else if (isPurnima) {
      planetFocus = "Moon (Purnima – fullness and cleansing)";
    } else if (isAmavasya) {
      planetFocus = "Moon / ancestors (Amavasya – inner clearing)";
    }
  }

  const dashaIsSaturnLike =
    md.includes("saturn") || ad.includes("saturn") || weekdayLord === "saturn";
  const dashaIsMarsLike =
    md.includes("mars") || ad.includes("mars") || weekdayLord === "mars";
  const dashaIsKetuLike =
    md.includes("ketu") || ad.includes("ketu") || tithiRaw.includes("amavasya");

  if (!suitableToday && (dashaIsSaturnLike || dashaIsMarsLike || dashaIsKetuLike)) {
    suitableToday = true;
    type = "light";
    if (!planetFocus) {
      if (dashaIsSaturnLike) planetFocus = "Saturn – steady discipline";
      else if (dashaIsMarsLike) planetFocus = "Mars – controlled energy";
      else if (dashaIsKetuLike) planetFocus = "Ketu – detachment and simplicity";
    }
    suggestion =
      "A good day for gentle discipline: lighter meals, avoiding excess, and keeping a simple, sattvic routine rather than strict or punishing fasting.";
  }

  if (tone === "intense" || tone === "low") {
    if (type === "partial" || type === "strong") {
      type = "light";
      suggestion =
        "Energy is a bit volatile today. If you observe any fasting, keep it light and kind to the body — focus on simplicity rather than strict rules.";
    }
    cautions.push(
      "On emotionally intense or low days, avoid very strict or punitive fasting. Choose gentleness over extremes."
    );
  }

  if (!planetFocus && emphasisedPlanet) {
    if (emphasisedPlanet === "sun") planetFocus = "Sun – clarity and vitality";
    else if (emphasisedPlanet === "moon")
      planetFocus = "Moon – emotional balance and rest";
    else if (emphasisedPlanet === "mars")
      planetFocus = "Mars – courage with restraint";
    else if (emphasisedPlanet === "mercury")
      planetFocus = "Mercury – focus and clear thinking";
    else if (emphasisedPlanet === "jupiter")
      planetFocus = "Jupiter – wisdom and moderation";
    else if (emphasisedPlanet === "venus")
      planetFocus = "Venus – harmony and self-respect";
    else if (emphasisedPlanet === "saturn")
      planetFocus = "Saturn – consistency and responsibility";
  }

  return {
    suitableToday,
    type,
    planetFocus,
    suggestion,
    cautions,
  };
}


/* ---------------- Money helpers: transit + Moon + dasha scoring ---------------- */

function moneyDashaScoreForPlanet(raw: any): number {
  if (!raw) return 0;
  const p = String(
    raw.planet || raw.lord || raw.mdLord || raw.adLord || raw.pdLord || ""
  ).toLowerCase();

  if (!p) return 0;

  // Opportunity planets
  if (p === "jupiter") return 1.0;
  if (p === "venus") return 1.0;
  if (p === "mercury") return 0.6;
  if (p === "moon") return 0.4;

  // Cautious planets
  if (p === "rahu") return -1.0;
  if (p === "ketu") return -0.8;
  if (p === "saturn") return -0.7;
  if (p === "mars") return -0.6;

  // Light support
  if (p === "sun") return 0.2;

  return 0;
}

/** dashaScore ≈ MD + 0.5·AD + 0.2·PD */
function computeDashaMoneyScore(core: CoreSignals): number {
  const stack = Array.isArray(core.dashaStack) ? core.dashaStack : [];

  const md = stack[0] ?? null;
  const ad = stack[1] ?? null;
  const pd = stack[2] ?? null;

  const mdScore = moneyDashaScoreForPlanet(md);
  const adScore = moneyDashaScoreForPlanet(ad);
  const pdScore = moneyDashaScoreForPlanet(pd);

  return mdScore + 0.5 * adScore + 0.2 * pdScore;
}

/** Moon score from nakshatra + house from Moon (confidence / clarity) */
function computeMoonMoneyScore(core: CoreSignals): number {
  const nak = (core.moonToday.nakshatra || "").toLowerCase();
  const relHouse = core.moonToday.houseFromMoon;

  let score = 0;

  // Supportive nakshatras for steady, practical money mindset
  const supportiveNakshatras = [
    "vishakha",
    "anuradha",
    "uttara ashadha",
    "uttara ashadh",
    "uttarashadha",
    "shravana",
    "revati",
    "bharani",
  ];
  const volatileNakshatras = [
    "ardra",
    "ashlesha",
    "jyeshtha",
    "mula",
    "moola",
  ];

  if (nak && supportiveNakshatras.some((n) => nak.includes(n))) {
    score += 0.5;
  } else if (nak && volatileNakshatras.some((n) => nak.includes(n))) {
    score -= 0.5;
  }

  // House from Moon
  if (typeof relHouse === "number") {
    if (relHouse === 2 || relHouse === 11) {
      score += 0.5; // income / gains focus with some clarity
    } else if (relHouse === 8 || relHouse === 12) {
      score -= 0.5; // anxiety / instability around resources
    }
  }

  return score;
}

/** Transit score from money-related transits */
function computeTransitMoneyScore(core: CoreSignals): number {
  const transits = Array.isArray(core.transits) ? core.transits : [];

  let score = 0;

  for (const t of transits) {
    // Reuse your existing helper
    if (!isMoneyTransit(t)) continue;

    const s =
      typeof t.strength === "number" && Number.isFinite(t.strength)
        ? t.strength
        : 0.5;

    const planet = (t.planet || "").toLowerCase();
    const house = t.house;
    const cat = normaliseCategory(t.category);
    const tags = (t.tags || []).map((x) =>
      String(x || "").toLowerCase()
    );

    // Base weight from planet
    let weight = 0;

    if (planet === "jupiter" || planet === "venus") {
      weight = 1.0;
    } else if (planet === "sun" || planet === "mercury") {
      weight = 0.5;
    } else if (
      planet === "saturn" ||
      planet === "mars" ||
      planet === "rahu" ||
      planet === "ketu"
    ) {
      weight = -0.9;
    }

    // House emphasis: 2/11 supportive, 8 can be gains via stress / risk
    if (house === 2 || house === 11) {
      weight *= 1.2;
    } else if (house === 8) {
      // 8th often: debt / taxes / joint money risk
      if (weight > 0) {
        weight *= 0.4; // muted “opportunity”, high caution
      } else {
        weight *= 1.2; // deepen caution
      }
    }

    // Tags can tilt things
    const riskyTag = tags.some((t) =>
      ["risk", "speculation", "volatile", "loan", "debt"].includes(t)
    );
    const gainTag = tags.some((t) =>
      ["bonus", "income", "profit", "raise"].includes(t)
    );

    if (riskyTag) {
      weight -= 0.4;
    }
    if (gainTag) {
      weight += 0.4;
    }

    // Category: career often ties to money, but slightly down-weighted
    if (cat === "career") {
      weight *= 0.8;
    }

    score += s * weight;
  }

  return score;
}

/** Combine all scores → MoneyTone */
function computeMoneyTone(core: CoreSignals): MoneyTone {
  const transitScore = computeTransitMoneyScore(core);
  const moonScore = computeMoonMoneyScore(core);
  const dashaScore = computeDashaMoneyScore(core);

  const finalScore = transitScore + moonScore + dashaScore;

  if (finalScore <= -0.8) return "cautious";
  if (finalScore >= 0.8) return "opportunity";
  return "balanced";
}



function buildMoneyWindows(_core: CoreSignals): MoneyWindow[] {
  // v1: not used yet
  return [];
}
function buildMoneyTip(core: CoreSignals): MoneyMicroTip {
  const tone = computeMoneyTone(core);

  let summary = "";
  const doList: string[] = [];
  const avoidList: string[] = [];

  if (tone === "opportunity") {
    summary =
      "Opportunity: money climate is supportive for thoughtful moves — one well-chosen step can go a long way.";
    doList.push(
      "review investments or savings with a calm, long-term view",
      "act on one or two financial decisions you have already researched",
      "have focused, honest conversations about money or planning"
    );
    avoidList.push(
      "rushing into new commitments without comparison or clarity",
      "letting excitement or FOMO override simple realism"
    );
  } else if (tone === "cautious") {
    summary =
      "Caution: money energy is a bit foggy today; better to protect and organise than to chase big gains.";
    doList.push(
      "stick to your usual routine around spending and saving",
      "review expenses and plug obvious leaks",
      "postpone big investment or loan decisions if possible"
    );
    avoidList.push(
      "impulse purchases to soothe stress or anxiety",
      "taking large leverage or speculative trades",
      "making long-term moves based on short-term emotions"
    );
  } else {
    // balanced
    summary =
      "Balanced: continue existing plans steadily; good for maintenance and small corrections, not for dramatic money experiments.";
    doList.push(
      "stay regular with SIPs or existing savings plans",
      "keep a simple, honest log of income and expenses",
      "clear one or two small pending dues to reduce background stress"
    );
    avoidList.push(
      "sudden, unresearched changes to long-term plans",
      "spending just to change your mood or escape discomfort"
    );
  }

  return {
    tone,
    summary,
    do: doList,
    avoid: avoidList,
  };
}

// 🔹 Shared helper: build daily guide object from a CoreSignals bundle
export async function buildDailyGuideFromCore(coreInput: CoreSignals) {
  let core = coreInput;

  // Ensure birth & moonToday exist even if partially missing
  if (!core.birth) {
    core.birth = {
      dateISO: new Date().toISOString().slice(0, 10),
      time: "00:00",
      tz: "Asia/Dubai",
      lat: 0,
      lon: 0,
      lagnaSign: undefined,
    };
  }

  if (!core.moonToday) {
    core.moonToday = {
      sign: "Unknown",
      nakshatra: "Unknown",
    };
  }

  // 3) Compute the guide (same logic you already had)
  const emotionalWeather = buildEmotionalWeather(core);

  // expose tone & weather back into core so other helpers can see it
  (core as any).emotionalTone = emotionalWeather.quality;
  (core as any).emotionalWeather = emotionalWeather;

   const food = buildFoodGuide(core, emotionalWeather);
  const fasting = buildFastingGuide(core, emotionalWeather);
  const moneyWindows = buildMoneyWindows(core);
  const moneyTip = buildMoneyTip(core);

  return {
    emotionalWeather,
    food,
    fasting,
    moneyWindows,
    moneyTip,
    // 👇 echo through the context so notifications & highlights can use it
    panchang: core.panchang,
    transits: core.transits,
    moonToday: core.moonToday,
  };
}

/* ---------------- Route handler ---------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));

    let core = body.core as CoreSignals | undefined;

    // If client didn't send a proper core, build a very safe fallback
    if (!core || typeof core !== "object") {
      core = {
        birth: {
          dateISO: new Date().toISOString().slice(0, 10),
          time: "00:00",
          tz: "Asia/Dubai",
          lat: 0,
          lon: 0,
          lagnaSign: undefined,
        },
        dashaStack: [],
        transits: [],
        moonToday: {
          sign: "Unknown",
          nakshatra: "Unknown",
        },
        panchang: {},
      };
    }

    // Ensure birth & moonToday exist even if partially missing
    if (!core.birth) {
      core.birth = {
        dateISO: new Date().toISOString().slice(0, 10),
        time: "00:00",
        tz: "Asia/Dubai",
        lat: 0,
        lon: 0,
        lagnaSign: undefined,
      };
    }

    if (!core.moonToday) {
      core.moonToday = {
        sign: "Unknown",
        nakshatra: "Unknown",
      };
    }

    // 1) Build a cache key for "one person, one day" of daily guide
    const cacheKey = makeCacheKey({
      feature: "daily-guide",
      // birth context
      birth: {
        dateISO: core.birth.dateISO,
        time: core.birth.time,
        tz: core.birth.tz,
        lat: core.birth.lat,
        lon: core.birth.lon,
        lagnaSign: core.birth.lagnaSign,
      },
      // active dasha stack affects tone → include it
      dashaStack: core.dashaStack ?? [],
      // effectively "today" for the guide
      dayISO: core.birth.dateISO,
      version: "v1", // bump if you change guide logic structure
    });

    // 2) Try cache first
    const cached = cacheGet<any>(cacheKey);
    if (cached) {
      return new Response(
        JSON.stringify({
          ...cached,
          _cache: "hit",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

   
        // 3) Compute the guide using shared helper
   const result = await buildDailyGuideFromCore(core);


    // 4) Save to cache for 1 day
    cacheSet(cacheKey, result, 60 * 60 * 24);

    return new Response(
      JSON.stringify({
        ...result,
        _cache: "miss",
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (e: any) {
    console.error("daily-guide API error:", e);
    return new Response(
      JSON.stringify({
        error: e?.message ?? "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
}
