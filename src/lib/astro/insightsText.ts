// FILE: src/lib/astro/insightsText.ts

/* ------------------------------------------------------------------
   Tiny helper: choose a phrasing variant so text doesn't feel copy/paste
-------------------------------------------------------------------*/
function variant(options: string[]): string {
  if (!options.length) return "";
  // pseudo-random but stable-ish. You can replace with Math.random() if ok with non-deterministic.
  const seed = Date.now() % 7919;
  const idx = options.length === 1 ? 0 : seed % options.length;
  return options[idx];
}

/* ------------------------------------------------------------------
   Utility helpers for houses
-------------------------------------------------------------------*/

function houseNumDesc(h: number): string {
  // short "what this house is really about emotionally"
  const map: Record<number, string> = {
    1: " (identity / how you walk into a room)",
    2: " (resources, voice, self-worth)",
    3: " (courage, skill-building, siblings/peers)",
    4: " (home, roots, emotional safety)",
    5: " (desire to create, to be chosen, to feel special)",
    6: " (stress, obligation, energy budget)",
    7: " (partnership, mirrors, 'us')",
    8: " (power shifts, ego-death, raw honesty)",
    9: " (beliefs, purpose, horizon outside your bubble)",
    10: " (status, reputation, public role)",
    11: " (network, influence, doors opening)",
    12: " (private processing, rest, surrender, sleep)",
  };
  return map[h] ?? "";
}

function houseThemeSentence(h: number): string {
  // what that house asks from you, in human language
  const map: Record<number, string[]> = {
    1: [
      "People read this energy on you before you even start talking.",
    ],
    2: [
      "This affects how you hold money, safety, and 'I deserve this' energy.",
    ],
    3: [
      "This is about proving yourself through skill and repetition, not just talking about it.",
    ],
    4: [
      "This plugs straight into belonging, security, and what 'home' actually feels like for you.",
    ],
    5: [
      "This touches romance, attention, creativity, and the need to feel chosen — not just tolerated.",
    ],
    6: [
      "This shows up whenever you're burning out: health habits, workload, low-grade tension in the body.",
    ],
    7: [
      "This plays out in commitment and loyalty. It's where you define what you will and will not carry for someone else.",
    ],
    8: [
      "This forces real transformation. It's where you can't fake it, can't numb it, can't dodge the truth forever.",
    ],
    9: [
      "This keeps asking: what do you actually believe in enough to live by, not just post about.",
    ],
    10: [
      "This bleeds directly into career, recognition, and how people introduce you when you're not in the room.",
    ],
    11: [
      "This affects access: who helps you, who vouches for you, who opens doors.",
    ],
    12: [
      "This leaks into sleep, nervous system recovery, and the part of you that needs to be completely off-duty sometimes.",
    ],
  };

  const arr = map[h];
  return arr ? variant(arr) : "";
}

/* ------------------------------------------------------------------
   PLANET INSIGHTS
   Input: planetRows from the chart (already computed in route.ts)
   Output: record keyed by planet name
-------------------------------------------------------------------*/

export function buildPlanetInsightsHuman(
  planetRows: Array<{
    name: string;
    sign: string;
    house?: number;
    nakshatra?: string;
  }>
): Record<
  string,
  {
    headline: string;
    summary: string;
  }
> {
  const out: Record<
    string,
    { headline: string; summary: string }
  > = {};

  for (const p of planetRows) {
    const { name: planet, sign, house, nakshatra } = p;

    const wherePhrase = house
      ? `House ${house}${houseNumDesc(house)}`
      : "your chart";

    // emotional / behavioral role per planet
    let role = "";
    switch (planet) {
      case "Sun":
        role = variant([
          "your core drive and the part of you that wants to be seen as real",
          "your sense of identity, pride, and 'this is who I am'",
          "the 'I exist and I matter' beam you project into the world",
        ]);
        break;
      case "Moon":
        role = variant([
          "your emotional baseline and how you self-soothe under stress",
          "the nervous system pattern you fall back into when you’re raw",
          "what makes you feel held, safe, and not judged",
        ]);
        break;
      case "Mercury":
        role = variant([
          "how you translate thoughts into words (and whether people actually get you)",
          "your mental pacing, attention style, and how you explain yourself",
          "the way you observe, narrate, and negotiate reality",
        ]);
        break;
      case "Venus":
        role = variant([
          "your bonding style — how you attract, receive, and allow closeness",
          "how you experience affection, softness, and being chosen",
          "what feels beautiful, easy, and emotionally worth saying yes to",
        ]);
        break;
      case "Mars":
        role = variant([
          "your confrontation style — how you push back or go after what you want",
          "the raw engine that says 'move now' instead of waiting for permission",
          "how you handle conflict, assert boundaries, and hunt for what matters",
        ]);
        break;
      case "Jupiter":
        role = variant([
          "your horizon — faith, growth, meaning, and 'why any of this is worth it'",
          "what helps you feel like life is expanding, not shrinking",
          "your relationship to wisdom, mentorship, purpose",
        ]);
        break;
      case "Saturn":
        role = variant([
          "your slow lessons: patience, self-respect, staying power",
          "where you’re forced to grow up and hold your own structure",
          "the part of you that quietly carries weight long-term",
        ]);
        break;
      case "Rahu":
        role = variant([
          "the hunger — the part of you that wants more than you're 'supposed' to want",
          "your ambition edge, your refusal to stay small",
          "the taboo appetite that keeps pulling you forward",
        ]);
        break;
      case "Ketu":
        role = variant([
          "old karmic muscle memory — 'I’ve done this before, I don’t need applause'",
          "detachment: what you can walk away from because you've already outgrown it",
          "the spiritual 'I don't have to prove this' place in you",
        ]);
        break;
      default:
        role = "a quieter layer of temperament and focus";
    }

    // house impact
    const houseLine = house ? houseThemeSentence(house) : "";

    // nakshatra seasoning (if we have it)
    const nakLine = nakshatra
      ? `This comes through with a ${nakshatra} flavor — like an accent on how you express it.`
      : "";

    const paragraphs = [
      `${planet} in ${sign}${house ? `, sitting in ${wherePhrase},` : ""} describes ${role}.`,
      houseLine,
      nakLine,
    ]
      .map((s) => s.trim())
      .filter(Boolean);

    out[planet] = {
      headline: `${planet}: ${sign}${house ? ` • House ${house}` : ""}`,
      summary: paragraphs.join(" "),
    };
  }

  return out;
}

/* ------------------------------------------------------------------
   LIFE THEMES (Career, Money, Relationships, Health)
   Inputs:
     - houseLordMap: which planet rules each house, and where that lord sits
     - timeline: windows we already computed (lets us detect "this is loud now")
   Output:
     object with { careerBlueprint, wealthPath, relationshipKarma, vitalityHealth }
-------------------------------------------------------------------*/

export function buildLifeThemesHuman(args: {
  houseLordMap: Record<
    number,
    { lord: string; lordHouse?: number; lordSign?: string }
  >;
  timeline: any[];
}) {
  const { houseLordMap, timeline } = args;

  // helper: does timeline mention this topic right now?
  const timelineMentions = (needles: string[]) => {
    const lowerNeedles = needles.map((n) => n.toLowerCase());
    return timeline.some((win) => {
      const text = `${win.label || ""} ${win.blurb || ""} ${win.summary || ""}`.toLowerCase();
      return lowerNeedles.some((n) => text.includes(n));
    });
  };

  // CAREER / STATUS
  const lord10 = houseLordMap[10]?.lord;
  const lord11 = houseLordMap[11]?.lord;
  const careerHot = timelineMentions(["career", "status", "promotion", "recognition", "visibility"]);

  const careerBody = variant([
    "You’re not built to stay invisible forever. Eventually people start treating you like the responsible one, even if you still feel like you're figuring it out in real time.",
    "There's a pull toward visibility — not fame for ego, but credibility. Being respected matters, and you notice when it’s missing.",
    "You learn by being thrown into situations where you're slightly underqualified and then having to rise fast.",
  ]);

  // MONEY / POWER / VALUE
  const lord2 = houseLordMap[2]?.lord;
  const lord8 = houseLordMap[8]?.lord;
  const moneyHot = timelineMentions(["money", "finance", "debt", "resources", "compensation", "terms"]);

  const wealthBody = variant([
    "Money for you is emotional. It's not just income — it's safety, leverage, and proof you won't be controlled.",
    "You clock power dynamics around resources instantly. If terms feel unfair, your body literally tenses.",
    "Shared resources and trust are linked. If the deal doesn't feel respectful, you mentally start leaving.",
  ]);

  // RELATIONSHIP / LOYALTY / BONDING
  const lord7 = houseLordMap[7]?.lord;
  const relBody = variant([
    "Partnership isn't aesthetic for you. It's real contract energy: loyalty, honesty, 'Are we actually on the same side?'",
    "You attract mirrors, not placeholders. People who get close tend to expose what you really need.",
    "You don't do permanent performance. If someone can’t meet you where you actually live emotionally, the connection erodes.",
  ]);

  // HEALTH / NERVOUS SYSTEM / BURNOUT
  const lord6 = houseLordMap[6]?.lord;
  const lord12 = houseLordMap[12]?.lord;
  const healthHot = timelineMentions(["health", "burnout", "rest", "sleep", "recovery", "stress"]);

  const healthBody = variant([
    "Your system keeps score. Stress you pretend is 'fine' shows up in your body almost immediately.",
    "You don't actually get unlimited output. Recovery, sleep, quiet time — these are structural for you, not 'nice if I have time.'",
    "Your chart doesn't hide strain well. When you're overextended, it leaks through mood, sleep, focus, and patience.",
  ]);

  return {
    careerBlueprint: [
      `Career / public role is wired through House 10 and House 11 — lords ${lord10 || "?"} and ${lord11 || "?"} set the tone.`,
      careerBody,
      careerHot
        ? "This is active right now: expectations are getting louder, and people are already treating you like you're in the role (even if the title hasn't caught up)."
        : "This builds in layers. You earn authority through repetition and presence, not fake branding."
    ].join(" "),

    wealthPath: [
      `Wealth and power-sharing sit in House 2 and House 8 — lords ${lord2 || "?"} and ${lord8 || "?"}.`,
      wealthBody,
      moneyHot
        ? "Right now money/terms are not neutral. It’s negotiation season and the universe is low-key asking 'Do you actually believe you're worth what you’re asking for?'"
        : "Long game: the real currency here is control of your time and emotional bandwidth."
    ].join(" "),

    relationshipKarma: [
      `Partnership gravity comes through House 7 (lord ${lord7 || "?"}).`,
      relBody,
      "You don't do 'casual forever.' Even if the vibe starts light, the question underneath is always: does this feel emotionally safe for me, yes or no?"
    ].join(" "),

    vitalityHealth: [
      `Your energy budget is House 6 and House 12 — lords ${lord6 || "?"} and ${lord12 || "?"}.`,
      healthBody,
      healthHot
        ? "Your current timing is basically yelling: protect sleep, protect peace, protect your body like it's expensive equipment."
        : "When you treat recovery as non-negotiable, everything else in your chart performs better — mood, clarity, and even how you show up for other people."
    ].join(" "),
  };
}

/* ------------------------------------------------------------------
   LIFE MILESTONES
   Input = Mahadasha ladder
   Output = array of chapters with human language paragraphs
-------------------------------------------------------------------*/

export type MilestoneInput = {
  lord: string;
  start: Date;
  end: Date;
};

function yearsBetween(a: Date, b: Date) {
  return (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

// classify tone/story based on which houses that Mahadasha lord rules
function classifyTone(ruledHouses: number[]) {
  const ruled = new Set(ruledHouses);

  if (ruled.has(10) || ruled.has(11)) {
    return {
      headline: "Stepping into visibility + responsibility",
      risk: "opportunity" as const,
      hook:
        "This is a 'people are watching me now' era. You get asked to act like the person in charge before you necessarily feel like one.",
    };
  }

  if (ruled.has(8) || ruled.has(12) || ruled.has(6)) {
    return {
      headline: "Stripping down / healing / cutting lies",
      risk: "caution" as const,
      hook:
        "This is the season where you stop pretending it's fine. You start cutting what quietly drains you, and you call that healing even if nobody claps.",
    };
  }

  if (ruled.has(4) || ruled.has(2)) {
    return {
      headline: "Stability, belonging, self-worth",
      risk: "mixed" as const,
      hook:
        "Home, safety, self-respect, 'who actually shows up for me' — those questions get loud, quietly but constantly.",
    };
  }

  if (ruled.has(7)) {
    return {
      headline: "Partnership, loyalty, choosing who stands next to you",
      risk: "mixed" as const,
      hook:
        "Relationships stop being aesthetics and start being contracts. You learn what commitment actually costs and actually gives.",
    };
  }

  if (ruled.has(3) || ruled.has(5)) {
    return {
      headline: "Voice, talent, 'this is who I am'",
      risk: "mixed" as const,
      hook:
        "You experiment with identity and want to be seen for something that feels yours — skill, style, work, body of thought.",
    };
  }

  if (ruled.has(9)) {
    return {
      headline: "Meaning, belief, outgrowing the old world",
      risk: "opportunity" as const,
      hook:
        "Your world gets bigger. You start asking not 'What was I told to believe?' but 'What do I personally stand for?'",
    };
  }

  return {
    headline: "Deep personal growth",
    risk: "mixed" as const,
    hook:
      "Life pushes you to level up in a way that's not subtle. You can actually feel yourself changing under pressure.",
  };
}

export function buildLifeMilestonesHuman(args: {
  birthUTC: Date;
  mahaList: MilestoneInput[];
  houseLordMap: Record<
    number,
    { lord: string; lordHouse?: number; lordSign?: string }
  >;
  planetRows: Array<{
    name: string;
    house?: number;
    sign?: string;
    nakshatra?: string;
  }>;
  interpretMahadashaForUser: (x: {
    mahaLord: string;
    lordPlacement: { house?: number; sign?: string; nakshatra?: string };
    ruledHouses: number[];
    HOUSE_THEME: any;
  }) => string | undefined;
  HOUSE_THEME: any;
}) {
  const {
    birthUTC,
    mahaList,
    houseLordMap,
    planetRows,
    interpretMahadashaForUser,
    HOUSE_THEME,
  } = args;

  function ruledHousesBy(planetName: string): number[] {
    const ruled: number[] = [];
    for (let h = 1; h <= 12; h++) {
      if (houseLordMap[h]?.lord === planetName) ruled.push(h);
    }
    return ruled;
  }

  return mahaList.map((md) => {
    const ageStart = Math.max(0, Math.floor(yearsBetween(birthUTC, md.start)));
    const ageEnd = Math.max(ageStart, Math.floor(yearsBetween(birthUTC, md.end)));

    const ruled = ruledHousesBy(md.lord);
    const tone = classifyTone(ruled);

    const placement = planetRows.find((p) => p.name === md.lord);

    const mahaSummary = interpretMahadashaForUser({
      mahaLord: md.lord as any,
      lordPlacement: {
        house: placement?.house,
        sign: placement?.sign,
        nakshatra: placement?.nakshatra,
      },
      ruledHouses: ruled,
      HOUSE_THEME,
    });

    const placementLine = placement?.house
      ? `This chapter is carried by ${md.lord} sitting in House ${placement.house}${houseNumDesc(
          placement.house
        )}. Those topics keep surfacing until you deal with them directly — they won't stay background noise.`
      : `This chapter is carried by ${md.lord}. That planet keeps surfacing patterns you're supposed to actually face, not just think about.`;

    const mahaLine = mahaSummary
      ? mahaSummary
          .split(/(?<=[.?!])\s+/)
          .slice(0, 2)
          .join(" ")
          .trim()
      : "";

    // last flavor line depending on tone.risk
    let closer = "";
    if (tone.risk === "opportunity") {
      closer =
        "It feels like 'I'm allowed to take up more room' — or honestly, 'I'm being forced to take up more room,' and then realizing you can actually hold it.";
    } else if (tone.risk === "caution") {
      closer =
        "It's not always gentle, but it's honest. You cut what hurts, and that becomes the definition of healing — even if nobody applauds you for it.";
    } else {
      closer =
        "This isn't overnight change. It's slow muscle-building of self-respect, boundary by boundary.";
    }

    // build paragraphs and dedupe quietly
    const rawParas = [
      tone.hook,
      placementLine,
      mahaLine,
      closer,
    ]
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const seen = new Set<string>();
    const uniqueParas = rawParas.filter((p) => {
      const key = p.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return {
      label: tone.headline,
      approxAgeRange: `Age ${ageStart}–${ageEnd}`,
      periodStart: md.start.toISOString(),
      periodEnd: md.end.toISOString(),
      drivers: `${md.lord} Mahadasha`,
      risk: tone.risk,
      themes: uniqueParas, // array of short paragraphs
    };
  });
}
