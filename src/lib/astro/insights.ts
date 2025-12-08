// Lightweight, opinionated Vedic-style commentary & scoring engine.
// Exports:
//   - getPlacementText(planet, sign, house)
//   - getAspectText(planet, fromHouse, toHouse, sign?)
//   - summarizeHouseForUser({ house, planets, aspectors, lord? })
//   - summarizeChartBigPicture(placements[])
//   - getSoulPathFromNodes({ rahuHouse, rahuSign, ketuHouse, ketuSign })
//   - getHouseLordSignRuler(sign)
//
// Also includes:
//   - house strength evaluation via evaluateHouseCondition()
//   - house lord lookup via getHouseLordSignRuler()
//
// NOTE: All language is intentionally human, supportive, and non-fatalistic.

/* -------------------------------------------------------------------------- */
/*                               Types / aliases                               */
/* -------------------------------------------------------------------------- */

export type P =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type Sign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

/* -------------------------------------------------------------------------- */
/*                         House themes (base descriptions)                    */
/* -------------------------------------------------------------------------- */

export const HOUSE_THEME: Record<number, string> = {
  1: "self, health, vitality, identity",
  2: "wealth, family, speech, values",
  3: "courage, skills, siblings, initiative",
  4: "home, heart, mother, real-estate, inner peace",
  5: "intelligence, creativity, children, romance",
  6: "service, work routines, health issues, competition",
  7: "partnerships, spouse, contracts, the public",
  8: "secrets, transformations, longevity, shared assets",
  9: "dharma, higher learning, mentors, long journeys",
  10: "career, status, reputation, authority",
  11: "gains, income, networks, aspirations",
  12: "sleep, expenses, foreign lands, liberation",
};

/* -------------------------------------------------------------------------- */
/*                     Planet natures + personality labels                     */
/* -------------------------------------------------------------------------- */

const NATURE: Record<P, "benefic" | "malefic" | "shadow" | "mixed"> = {
  Sun: "mixed",
  Moon: "benefic",
  Mercury: "mixed",
  Venus: "benefic",
  Mars: "malefic",
  Jupiter: "benefic",
  Saturn: "malefic",
  Rahu: "shadow",
  Ketu: "shadow",
};

const PLANET_FLAVOUR: Record<P, string> = {
  Sun: "authority, confidence, visibility",
  Moon: "emotions, care, adaptability",
  Mercury: "intellect, communication, commerce",
  Venus: "beauty, harmony, pleasures and bonds",
  Mars: "drive, courage, competition",
  Jupiter: "wisdom, growth, protection",
  Saturn: "discipline, structure, delays and lessons",
  Rahu: "amplification, obsession, unconventional paths",
  Ketu: "detachment, spiritualization, other-worldliness",
};

/* -------------------------------------------------------------------------- */
/*                          Dignity (sidereal-style)                           */
/* -------------------------------------------------------------------------- */

const OWN: Record<P, Sign[]> = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mars: ["Aries", "Scorpio"],
  Mercury: ["Gemini", "Virgo"],
  Jupiter: ["Sagittarius", "Pisces"],
  Venus: ["Taurus", "Libra"],
  Saturn: ["Capricorn", "Aquarius"],
  Rahu: [],
  Ketu: [],
};

const EXALT: Partial<Record<P, Sign>> = {
  Sun: "Aries",
  Moon: "Taurus",
  Mars: "Capricorn",
  Mercury: "Virgo",
  Jupiter: "Cancer",
  Venus: "Pisces",
  Saturn: "Libra",
};

const DEBIL: Partial<Record<P, Sign>> = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mars: "Cancer",
  Mercury: "Pisces",
  Jupiter: "Capricorn",
  Venus: "Virgo",
  Saturn: "Aries",
};

/* -------------------------------------------------------------------------- */
/*                             Utility helpers                                 */
/* -------------------------------------------------------------------------- */

function cap(s?: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}

function dignityOf(
  planet: P,
  sign: Sign
): "exalt" | "own" | "debil" | "neutral" {
  if (EXALT[planet] === sign) return "exalt";
  if ((OWN[planet] || []).includes(sign)) return "own";
  if (DEBIL[planet] === sign) return "debil";
  return "neutral";
}

function dignitySentence(planet: P, sign: Sign) {
  const d = dignityOf(planet, sign);
  if (d === "exalt")
    return `${planet} is exalted in ${sign}, boosting its constructive expression.`;
  if (d === "own")
    return `${planet} is in its own sign ${sign}, steady and reliable.`;
  if (d === "debil")
    return `${planet} is debilitated in ${sign}, so you may have to work through some friction before it flows easily.`;
  return `${planet} in ${sign} is neutral; outcome depends on how it’s integrated with the rest of the chart.`;
}

/* -------------------------------------------------------------------------- */
/*                        House lord (rulership model)                         */
/* -------------------------------------------------------------------------- */

const SIGN_RULER: Record<Sign, P> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn", // traditional rulership
  Pisces: "Jupiter",
};

/**
 * Given the sign on a house cusp, return the ruling planet.
 * e.g. Libra -> Venus
 */
export function getHouseLordSignRuler(sign: Sign): P {
  return SIGN_RULER[sign];
}

/* -------------------------------------------------------------------------- */
/*                       House condition / strength model                      */
/* -------------------------------------------------------------------------- */
/**
 * We produce a "house condition" read:
 * - Are there benefics here or helping it?
 * - Are there pressuring planets here/aspecting it?
 * - Where is the house lord sitting?
 *
 * This feeds into the last line of summarizeHouseForUser().
 */

type HouseConditionInput = {
  house: number;
  planets: Array<{ planet: string; sign: string }>;
  aspectors: string[];
  lord?: {
    planet: string;
    sitsInHouse?: number;
    sitsInSign?: string;
  };
};

function evaluateHouseCondition(opts: HouseConditionInput): { blurb?: string } {
  const { house, planets, aspectors, lord } = opts;

  // Benefics generally offer ease/protection.
  const BENEFICS = new Set(["Moon", "Venus", "Jupiter"]);
  // Challengers tend to demand growth via pressure.
  const CHALLENGERS = new Set([
    "Mars",
    "Saturn",
    "Rahu",
    "Ketu",
    "Sun",
    "Mercury",
  ]);

  const planetNames = planets.map((p) => p.planet);
  const hasBeneficInside = planetNames.some((p) => BENEFICS.has(p));
  const hasChallengerInside = planetNames.some((p) =>
    CHALLENGERS.has(p)
  );

  const aspectSet = new Set(aspectors);
  const hasJupiterAspect = aspectSet.has("Jupiter");
  const hasSaturnAspect = aspectSet.has("Saturn");
  const hasMarsAspect = aspectSet.has("Mars");
  const hasRahuOrKetuAspect =
    aspectSet.has("Rahu") || aspectSet.has("Ketu");

  const lordBondHouse = lord?.sitsInHouse;

  const toneParts: string[] = [];

  // Support / shelter
  if (hasBeneficInside || hasJupiterAspect) {
    toneParts.push(
      "There is protection and guidance here, so even challenges become teachable and workable."
    );
  }

  // Pressure / discipline / karmic intensity
  if (
    hasChallengerInside ||
    hasSaturnAspect ||
    hasMarsAspect ||
    hasRahuOrKetuAspect
  ) {
    toneParts.push(
      "At the same time, this area won't really let you coast — you're asked to step up, set boundaries, or act with courage."
    );
  }

  // House lord linkage
  if (
    typeof lordBondHouse === "number" &&
    lordBondHouse >= 1 &&
    lordBondHouse <= 12 &&
    lordBondHouse !== house
  ) {
    const linkedTheme =
      HOUSE_THEME[lordBondHouse] || `House ${lordBondHouse}`;
    toneParts.push(
      `This house is also plugged into House ${lordBondHouse} (${linkedTheme}), so choices here ripple into that part of life.`
    );
  }

  if (!toneParts.length) {
    return {
      blurb:
        "Overall this part of life looks steady: it might not scream for attention every day, but it quietly shapes who you are.",
    };
  }

  return { blurb: toneParts.join(" ") };
}

/* -------------------------------------------------------------------------- */
/*     Per-planet feeling when exactly one planet sits in a given house       */
/* -------------------------------------------------------------------------- */

function describeSinglePlanetInHouseHuman(
  planet: string,
  sign: string,
  house: number,
  theme: string
): string {
  const lower = planet.toLowerCase();

  if (lower === "rahu") {
    return `Rahu is here in ${sign}, which means you're pulled into ${theme} with intense curiosity and hunger for growth. Life keeps steering you toward these topics even if they feel disruptive.`;
  }
  if (lower === "ketu") {
    return `Ketu is here in ${sign}, which can make ${theme} feel oddly familiar or karmic. You may seem detached on the surface, but there's deep spiritual processing happening underneath.`;
  }
  if (lower === "saturn") {
    return `Saturn is here in ${sign}. ${theme} tends to demand patience, boundaries, and responsibility. It may feel weighty at times, but it matures you and builds long-term credibility.`;
  }
  if (lower === "mars") {
    return `Mars is here in ${sign}. ${theme} becomes something you approach with urgency and willpower. You don't like being passive here — you act, you push, you assert yourself.`;
  }
  if (lower === "moon") {
    return `Moon is here in ${sign}, so ${theme} is emotionally central. You track safety, comfort, and mood through this area. When this house is stable, you feel internally settled.`;
  }
  if (lower === "sun") {
    return `Sun is here in ${sign}, so ${theme} is tied to identity, pride, and visibility. People tend to recognize you through how you handle this part of life.`;
  }
  if (lower === "venus") {
    return `Venus is here in ${sign}. You try to bring harmony, connection, and ease to ${theme}. Love, attraction, and aesthetic instinct show up through this space of life.`;
  }
  if (lower === "mercury") {
    return `Mercury is here in ${sign}. You think about, talk about, and problem-solve this area a lot. ${theme} becomes something you manage through analysis, negotiation, and skill.`;
  }
  if (lower === "jupiter") {
    return `Jupiter is here in ${sign}, so ${theme} tends to be protected and given room to grow. You look for meaning, wisdom, or guidance through this part of life.`;
  }

  return `${planet} is here in ${sign}, so ${theme} is a visible storyline in your life — not something that just sits quietly in the background.`;
}

/* -------------------------------------------------------------------------- */
/*                       PUBLIC: summarizeHouseForUser                         */
/* -------------------------------------------------------------------------- */
/**
 * Builds the short/plain paragraph you show in each expanded house card.
 * This is the "human mode" summary that the UI shows as houseSummaryPlain.
 *
 * Inputs:
 *   house: number
 *   planets: [{ planet: "Mars", sign: "Gemini" }, ...] in THIS house
 *   aspectors: ["Saturn","Jupiter", ...] that aspect THIS house
 *   lord?: {
 *     planet: "Venus",
 *     sitsInHouse: 6,
 *     sitsInSign: "Pisces"
 *   }
 */

export function summarizeHouseForUser(opts: {
  house: number;
  planets: Array<{ planet: string; sign: string }>;
  aspectors: string[];
  lord?: {
    planet: string;
    sitsInHouse?: number;
    sitsInSign?: string;
  };
}): string {
  const { house, planets, aspectors, lord } = opts;

  const theme = HOUSE_THEME[house];
  const out: string[] = [];

  // 1. What this house is about
  out.push(`This house is about ${theme}.`);

  // 2. Who’s sitting here
  if (planets.length === 1) {
    const p = planets[0];
    out.push(
      describeSinglePlanetInHouseHuman(p.planet, p.sign, house, theme)
    );
  } else if (planets.length > 1) {
    const plist = planets
      .map((p) => `${p.planet} (${p.sign})`)
      .join(", ");
    out.push(
      `You have multiple players here — ${plist}. That means ${theme} is a major storyline in real life, not background noise.`
    );
  } else {
    out.push(
      `There may be no planet parked here, but it’s still active through its ruler and through planets that keep aiming energy at this house.`
    );
  }

  // 3. House lord / flow linkage
  if (lord?.planet && lord.sitsInHouse) {
    const destTheme =
      HOUSE_THEME[lord.sitsInHouse] ||
      `House ${lord.sitsInHouse}`;
    const lordLabel = lord.sitsInSign
      ? `${lord.planet} in ${lord.sitsInSign}`
      : lord.planet;

    out.push(
      `The ruler of this house is ${lordLabel}, currently placed in House ${lord.sitsInHouse}. So ${theme} keeps flowing into ${destTheme}. In day-to-day life, those areas are tied together.`
    );
  }

  // 4. External influence (aspects)
  const uniqueAspectors = Array.from(new Set(aspectors));
  if (uniqueAspectors.length === 1) {
    const who = uniqueAspectors[0];
    if (who === "Jupiter") {
      out.push(
        `Jupiter is actively supporting this area, which usually brings guidance, faith, or protection when you need it.`
      );
    } else if (who === "Saturn") {
      out.push(
        `Saturn leans on this area, which means you’re asked to treat it seriously, take ownership, and grow up through experience.`
      );
    } else if (who === "Mars") {
      out.push(
        `Mars keeps activating this area. ${theme} can't just sit on paper — you're pushed to act on it.`
      );
    } else if (who === "Rahu") {
      out.push(
        `Rahu charges this space with intensity and craving. You can feel pulled toward it like it matters in a big, fated way.`
      );
    } else if (who === "Ketu") {
      out.push(
        `Ketu influences this area, so you may feel oddly detached or “done with the drama,” like you're finishing old karma here.`
      );
    } else {
      out.push(
        `${who} keeps energizing this part of life, so ${theme} shows up in real decisions — not just theory.`
      );
    }
  } else if (uniqueAspectors.length === 2) {
    const [a, b] = uniqueAspectors;
    out.push(
      `${a} and ${b} both work on this house, so you feel ${theme} from more than one angle — sometimes support, sometimes pressure.`
    );
  } else if (uniqueAspectors.length > 2) {
    out.push(
      `Several influences (${uniqueAspectors.join(
        ", "
      )}) keep pinging this house, which makes ${theme} a repeating theme across your life chapters.`
    );
  }

  // 5. Overall tone (house "strength" / demand / support)
  const condition = evaluateHouseCondition({
    house,
    planets,
    aspectors,
    lord,
  });
  if (condition?.blurb) {
    out.push(condition.blurb);
  }

  return out.join(" ");
}

/* -------------------------------------------------------------------------- */
/*                       PUBLIC: getPlacementText()                            */
/* -------------------------------------------------------------------------- */
/**
 * Technical-ish placement blurb for planet in a house/sign.
 * This is what you feed into houseNote (the "Show technical details" section).
 */

export function getPlacementText(
  planetRaw: string,
  signRaw: string,
  house: number
): string {
  const planet = cap(planetRaw) as P;
  const sign = cap(signRaw) as Sign;

  if (!(planet in NATURE) || !(house in HOUSE_THEME) || !sign) return "";

  const parts: string[] = [];
  parts.push(`${planet} in ${sign} activates ${HOUSE_THEME[house]}.`);
  parts.push(dignitySentence(planet, sign));
  parts.push(
    `It channels ${PLANET_FLAVOUR[planet]} into this part of life.`
  );

  // Targeted seasoning to feel real, not copy-paste:
  if (planet === "Mars" && (house === 4 || house === 7 || house === 8)) {
    parts.push(
      "There can be heat or friction here — you’re pushed to express that drive without burning bridges."
    );
  }
  if (planet === "Saturn" && (house === 10 || house === 7 || house === 4)) {
    parts.push(
      "This placement asks for patience, duty, and long-term effort; in return it can produce serious credibility."
    );
  }
  if (
    planet === "Jupiter" &&
    (house === 1 || house === 5 || house === 9 || house === 11)
  ) {
    parts.push(
      "There's a protective, growth-oriented current here: wisdom, mentorship, or blessing tends to show up."
    );
  }
  if (planet === "Rahu") {
    parts.push(
      "Rahu intensifies desire and hunger, pulling attention toward this life area in unconventional ways."
    );
  }
  if (planet === "Ketu") {
    parts.push(
      "Ketu brings detachment and spiritualization, sometimes making you feel 'done' with normal expectations here."
    );
  }

  return parts.join(" ");
}

/* -------------------------------------------------------------------------- */
/*                        PUBLIC: getAspectText()                              */
/* -------------------------------------------------------------------------- */
/**
 * Technical-ish aspect blurb for planet in House A aspecting House B.
 */

export function getAspectText(
  planetRaw: string,
  fromHouse: number,
  toHouse: number,
  signRaw?: string
): string {
  const planet = cap(planetRaw) as P;
  const sign = cap(signRaw || "") as Sign | "";

  if (
    !(planet in NATURE) ||
    !(fromHouse in HOUSE_THEME) ||
    !(toHouse in HOUSE_THEME)
  )
    return "";

  const base = `${planet} from House ${fromHouse} aspects House ${toHouse}, which deals with ${HOUSE_THEME[toHouse]}.`;

  let tone = "";
  if (planet === "Jupiter")
    tone =
      "It adds protection, wisdom and supportive growth, encouraging you to do the right thing there.";
  else if (planet === "Saturn")
    tone =
      "It imposes structure, tests and long-range responsibility, which can feel heavy but produces discipline.";
  else if (planet === "Mars")
    tone =
      "It injects heat, courage and decisive action, which can solve problems fast but also raise conflict if unmanaged.";
  else if (planet === "Venus")
    tone =
      "It tries to harmonize and smooth this area, seeking connection, attraction, or compromise.";
  else if (planet === "Mercury")
    tone =
      "It brings analysis, negotiation, and problem-solving — you'll tend to 'think it through' there.";
  else if (planet === "Moon")
    tone =
      "It sensitizes emotions and nurturance, so you feel this house more personally.";
  else if (planet === "Sun")
    tone =
      "It demands clarity, visibility and leadership in that area, making it hard to stay in the background.";
  else if (planet === "Rahu")
    tone =
      "It amplifies desire, restlessness and unconventional approaches — this house doesn't stay low-key.";
  else if (planet === "Ketu")
    tone =
      "It strips things down to the essence, making you less attached but more spiritually aware of that area.";

  let dig = "";
  if (sign) {
    const d = dignitySentence(planet, sign as Sign);
    dig = d.replace(`${planet} in ${sign} is neutral; `, "");
  }

  return `${base} ${tone} ${dig}`.trim();
}

/* -------------------------------------------------------------------------- */
/*                   Overall "big picture" summary of chart                    */
/* -------------------------------------------------------------------------- */
/**
 * High-level, gentle summary about main focus areas and the node axis.
 */

export function summarizeChartBigPicture(
  placements: Array<{ planet: string; house?: number; sign?: string }>
): string {
  const counts: Record<number, number> = {};
  for (const pl of placements) {
    if (!pl.house) continue;
    counts[pl.house] = (counts[pl.house] || 0) + 1;
  }

  let maxHouse: number | null = null;
  let maxCount = 0;
  for (const hStr in counts) {
    const h = Number(hStr);
    if (counts[h] > maxCount) {
      maxCount = counts[h];
      maxHouse = h;
    }
  }

  const topTheme =
    maxHouse && HOUSE_THEME[maxHouse]
      ? HOUSE_THEME[maxHouse]
      : null;

  const rahuPlacement = placements.find((p) => p.planet === "Rahu");
  const ketuPlacement = placements.find((p) => p.planet === "Ketu");

  const bits: string[] = [];

  if (topTheme && maxCount > 1) {
    bits.push(
      `A lot of attention clusters around House ${maxHouse}, which connects to ${topTheme}. This is a storyline you revisit over and over.`
    );
  } else {
    bits.push(
      `Your chart spreads energy across different parts of life instead of forcing everything into one single theme.`
    );
  }

  if (rahuPlacement?.house && ketuPlacement?.house) {
    bits.push(
      `There's a karmic pull on the Rahu–Ketu axis. Rahu marks where you're hungry to stretch into new territory, while Ketu marks where you're already carrying wisdom from somewhere older/deeper.`
    );
  }

  bits.push(
    `Overall, you're learning to notice where effort naturally goes. The areas that feel intense are also where you grow fastest.`
  );

  return bits.join(" ");
}

/* -------------------------------------------------------------------------- */
/*                           Soul Path from Nodes                              */
/* -------------------------------------------------------------------------- */
/**
 * Converts Rahu/Ketu axis into an "emotional purpose" / "spiritual purpose".
 * Soft, supportive, not doom-y.
 */

export function getSoulPathFromNodes(opts: {
  rahuHouse?: number;
  rahuSign?: string;
  ketuHouse?: number;
  ketuSign?: string;
}): {
  emotionalPurpose?: string;
  spiritualPurpose?: string;
} {
  const { rahuHouse, rahuSign, ketuHouse, ketuSign } = opts;

  let emotionalPurpose = "";
  let spiritualPurpose = "";

  if (rahuHouse && rahuSign) {
    emotionalPurpose = `You’re being pulled toward growth in the realm of House ${rahuHouse} (${HOUSE_THEME[rahuHouse]}), especially through the style of ${rahuSign}. Emotionally, you're meant to lean into this even if it feels unfamiliar or high-stakes.`;
  } else {
    emotionalPurpose =
      "You find peace through responsibility, order, and tangible progress.";
  }

  if (ketuHouse && ketuSign) {
    spiritualPurpose = `On a soul level, you're releasing over-attachment to House ${ketuHouse} (${HOUSE_THEME[ketuHouse]}). With Ketu in ${ketuSign}, the deeper lesson is to act without ego and let intuition guide you rather than old autopilot patterns.`;
  } else {
    spiritualPurpose =
      "You surrender ego to embody divine inspiration.";
  }

  return {
    emotionalPurpose,
    spiritualPurpose,
  };
}
