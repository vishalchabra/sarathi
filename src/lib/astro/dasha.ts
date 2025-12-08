// FILE: src/lib/astro/dasha.ts
//
// Core Vimshottari dasha math (Lahiri-style).
//
// Exports:
//
//  - getMahadashaTimeline(birthUTC, jdBirth, moonLonSidDeg)
//      -> full 120yr-ish cycle starting a little BEFORE birth (so birth is inside the first block)
//         returns array of MahadashaPeriod { lord, start, end }
//
//  - getAntardashaTimeline(mahaperiod)
//      -> splits a single Mahadasha into Antardashas (Bhuktis)
//
//  - getPratyantardashaTimeline(antardasha)
//      -> splits a single Antardasha into Pratyantardashas (sub-sub periods)
//
//  - getActiveDashaStateAt(when, mahaList)
//      -> { currentMahadasha, currentAntardasha, currentPratyantardasha }
//
//  - interpretMahadashaForUser / interpretAntardashaForUser / interpretPratyantardashaForUser
//
// NOTES:
// - We use mean tropical year length = 365.2425 days for time math.
// - Birth is treated as UTC anchor. Localize later for display only.

import { getNakshatraForLongitude } from "./nakshatra";
import type { P } from "./insights";

/* ------------------------------------------
   Vimshottari constants
------------------------------------------ */

// canonical dasha cycle order (cyclic)
const DASHA_ORDER: P[] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

// Mahadasha lengths in years for each lord
const DASHA_YEARS: Record<P, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

// Total Vimshottari span = 120y
const TOTAL_VIMSHOTTARI_YEARS = 120;

/* ------------------------------------------
   Time helpers
------------------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;
const YEAR_DAYS = 365.2425; // mean tropical year

function yearsToMs(years: number): number {
  const days = years * YEAR_DAYS;
  return days * DAY_MS;
}

function msToYears(ms: number): number {
  return ms / (YEAR_DAYS * DAY_MS);
}

function addYears(date: Date, years: number): Date {
  return new Date(date.getTime() + yearsToMs(years));
}

/* ------------------------------------------
   Figure out which Mahadasha is active at birth
   and how much of it was already used
------------------------------------------ */

function getStartMahadashaInfo(moonLonSidDeg: number) {
  const nak = getNakshatraForLongitude(moonLonSidDeg);

  const startLord = nak.lord; // e.g. "Moon"
  // nak.fractionRemaining = fraction of the nakshatra still remaining at birth.
  // Vimshottari maps "remaining nakshatra fraction" -> "remaining Mahadasha fraction".
  const fractionRemaining = nak.fractionRemaining;

  const fullYears = DASHA_YEARS[startLord];
  const remainingYears = fullYears * fractionRemaining;
  const usedYears = fullYears - remainingYears;

  return {
    startLord,
    remainingYears, // time left in that Mahadasha AFTER birth
    usedYears,      // time already elapsed IN that Mahadasha BEFORE birth
    fullYears,
  };
}

/* ------------------------------------------
   Build the Mahadasha timeline (~120y forward)
------------------------------------------ */

export type MahadashaPeriod = {
  lord: P;
  start: Date; // UTC
  end: Date;   // UTC
  durationYears: number;
};

export function getMahadashaTimeline(
  birthUTC: Date,
  jdBirth: number, // reserved for future precision / ayanamsha tweaks
  moonLonSidDeg: number,
  spanYears: number = 120
): MahadashaPeriod[] {
  // 1. Which Mahadasha were we born in?
  const { startLord, usedYears } = getStartMahadashaInfo(moonLonSidDeg);

  // 2. Where is that lord in the canonical cycle?
  const idx = DASHA_ORDER.indexOf(startLord);
  if (idx === -1) {
    throw new Error(`Unknown dasha start lord ${startLord}`);
  }

  // 3. Birth happened "usedYears" INTO that Mahadasha.
  //    So that Mahadasha truly began earlier at:
  const firstStart = new Date(birthUTC.getTime() - yearsToMs(usedYears));

  // 4. Walk forward through the Mahadasha cycle producing blocks.
  const periods: MahadashaPeriod[] = [];
  let cursorStart = firstStart;
  let lordCursorIndex = idx;

  // generate until we pass birthUTC + spanYears
  const endLimit = addYears(birthUTC, spanYears).getTime();

  while (true) {
    const lord = DASHA_ORDER[lordCursorIndex]!;
    const durY = DASHA_YEARS[lord];
    const cursorEnd = addYears(cursorStart, durY);

    periods.push({
      lord,
      start: cursorStart,
      end: cursorEnd,
      durationYears: durY,
    });

    cursorStart = cursorEnd;
    lordCursorIndex = (lordCursorIndex + 1) % DASHA_ORDER.length;

    if (cursorStart.getTime() > endLimit) break;
  }

  return periods;
}

/* ------------------------------------------
   Antardasha (Bhukti) timeline for ONE Mahadasha
------------------------------------------ */

export type AntardashaPeriod = {
  mahaLord: P;
  subLord: P;
  start: Date;
  end: Date;
  // theoretical duration in "astrological years"
  approxYears: number;
};

export function getAntardashaTimeline(
  mahaperiod: MahadashaPeriod
): AntardashaPeriod[] {
  //
  // RULE:
  // Inside Mahadasha M, Antardasha order STARTS FROM M
  // and then follows DASHA_ORDER cyclically.
  //
  // Length of Antardasha for subLord S inside M:
  //   subYears = M_years * (DASHA_YEARS[S] / 120)
  //
  const {
    lord: mahaLord,
    start: mahaStart,
    end: mahaEnd,
    durationYears: mahaYears,
  } = mahaperiod;

  const startIdx = DASHA_ORDER.indexOf(mahaLord);
  if (startIdx === -1) {
    throw new Error(`Mahadasha lord ${mahaLord} not found in DASHA_ORDER`);
  }

  const subPeriods: AntardashaPeriod[] = [];
  let cursor = new Date(mahaStart.getTime());

  for (let i = 0; i < DASHA_ORDER.length; i++) {
    const subLord = DASHA_ORDER[(startIdx + i) % DASHA_ORDER.length]!;
    const subFrac = DASHA_YEARS[subLord] / TOTAL_VIMSHOTTARI_YEARS; // e.g. 20/120
    const subYears = mahaYears * subFrac; // scaled portion of the Mahadasha
    const subEnd = addYears(cursor, subYears);

    // clip to Mahadasha end just in case of floating rounding
    const clippedEnd =
      subEnd.getTime() > mahaEnd.getTime() ? new Date(mahaEnd) : subEnd;

    subPeriods.push({
      mahaLord,
      subLord,
      start: cursor,
      end: clippedEnd,
      approxYears: subYears,
    });

    cursor = clippedEnd;
    if (cursor.getTime() >= mahaEnd.getTime()) break;
  }

  return subPeriods;
}

/* ------------------------------------------
   Pratyantardasha (sub-sub period) timeline
   for ONE Antardasha
------------------------------------------ */

export type PratyantardashaPeriod = {
  mahaLord: P;
  antarLord: P;
  subSubLord: P;
  start: Date;
  end: Date;
  approxYears: number;
};

export function getPratyantardashaTimeline(
  antardasha: AntardashaPeriod
): PratyantardashaPeriod[] {
  //
  // RULE:
  // Inside Antardasha A, Pratyantardasha order STARTS FROM A's lord
  // and then follows DASHA_ORDER cyclically.
  //
  // Length of Pratyantardasha for lord X inside Antardasha A:
  //   triYears = A_durationYears * (DASHA_YEARS[X] / 120)
  //
  // Where A_durationYears is the ACTUAL elapsed years of that Antardasha.
  //
  const {
    mahaLord,
    subLord: antarLord,
    start: antarStart,
    end: antarEnd,
  } = antardasha;

  // actual duration of this Antardasha in years (using ms diff)
  const antarYearsExact = msToYears(antarEnd.getTime() - antarStart.getTime());

  const startIdx = DASHA_ORDER.indexOf(antarLord);
  if (startIdx === -1) {
    throw new Error(`Antardasha lord ${antarLord} not found in DASHA_ORDER`);
  }

  const triPeriods: PratyantardashaPeriod[] = [];
  let cursor = new Date(antarStart.getTime());

  for (let i = 0; i < DASHA_ORDER.length; i++) {
    const subSubLord = DASHA_ORDER[(startIdx + i) % DASHA_ORDER.length]!;
    const frac = DASHA_YEARS[subSubLord] / TOTAL_VIMSHOTTARI_YEARS;
    const triYears = antarYearsExact * frac;
    const triEnd = addYears(cursor, triYears);

    const clippedEnd =
      triEnd.getTime() > antarEnd.getTime() ? new Date(antarEnd) : triEnd;

    triPeriods.push({
      mahaLord,
      antarLord,
      subSubLord,
      start: cursor,
      end: clippedEnd,
      approxYears: triYears,
    });

    cursor = clippedEnd;
    if (cursor.getTime() >= antarEnd.getTime()) break;
  }

  return triPeriods;
}

/* ------------------------------------------
   Figure out "what period am I in on this date?"
------------------------------------------ */

export function getActiveDashaStateAt(
  when: Date,
  mahaList: MahadashaPeriod[]
): {
  currentMahadasha?: MahadashaPeriod;
  currentAntardasha?: AntardashaPeriod;
  currentPratyantardasha?: PratyantardashaPeriod;
} {
  // 1. Which Mahadasha covers `when`?
  const maha = mahaList.find((m) => when >= m.start && when < m.end);
  if (!maha) {
    return {};
  }

  // 2. Which Antardasha (Bhukti) inside that Mahadasha?
  const antars = getAntardashaTimeline(maha);
  const antar = antars.find((a) => when >= a.start && when < a.end);

  if (!antar) {
    return {
      currentMahadasha: maha,
    };
  }

  // 3. Which Pratyantardasha (sub-sub period) inside that Antardasha?
  const pratyans = getPratyantardashaTimeline(antar);
  const praty = pratyans.find((p) => when >= p.start && when < p.end);

  return {
    currentMahadasha: maha,
    currentAntardasha: antar,
    currentPratyantardasha: praty,
  };
}

/* ------------------------------------------
   High-level interpretation helpers
------------------------------------------ */

/**
 * interpretMahadashaForUser
 *
 * Turn "You are in Venus Mahadasha" into a friendly paragraph that ties
 * that planet back to the birth chart.
 *
 * Inputs you will pass from route.ts:
 * - lordPlacement: from planetRows.find(p => p.name === mahaLord)
 *   { house, sign, nakshatra }
 * - ruledHouses: which houses this lord rules in the natal chart
 *   e.g. Venus might rule House 2 and House 9 in YOUR chart
 * - HOUSE_THEME map from insights
 */
export function interpretMahadashaForUser(args: {
  mahaLord: P;
  lordPlacement?: { house?: number; sign?: string; nakshatra?: string };
  ruledHouses: number[];
  HOUSE_THEME: Record<number, string>;
}): string {
  const { mahaLord, lordPlacement, ruledHouses, HOUSE_THEME } = args;

  const bits: string[] = [];

  // opener
  bits.push(
    `${mahaLord} is the main period running your life in this stretch of time.`
  );

  // where it sits natally
  if (lordPlacement?.house && lordPlacement?.sign) {
    const hTheme =
      HOUSE_THEME[lordPlacement.house] || `House ${lordPlacement.house}`;
    bits.push(
      `${mahaLord} sits in House ${lordPlacement.house} (${hTheme}) in ${lordPlacement.sign}, so that area of life tends to become loud, visible, or priority during this period.`
    );
  }

  // nakshatra flavor (if we have it)
  if (lordPlacement?.nakshatra) {
    bits.push(
      `It expresses through the ${lordPlacement.nakshatra} nakshatra tone, so the style of this period feels like that nakshatra’s flavor rather than just the raw planet.`
    );
  }

  // what houses does it rule?
  if (ruledHouses.length === 1) {
    const h = ruledHouses[0];
    const theme = HOUSE_THEME[h] || `House ${h}`;
    bits.push(
      `${mahaLord} also rules House ${h}, which covers ${theme}, so expect those topics to keep surfacing.`
    );
  } else if (ruledHouses.length > 1) {
    const list = ruledHouses
      .map(
        (h) =>
          `House ${h} (${HOUSE_THEME[h] || `House ${h}`})`
      )
      .join(", ");
    bits.push(
      `This planet ties directly into ${list}, so those themes become part of the long arc of this chapter.`
    );
  }

  bits.push(
    `Overall, this mahadasha describes the kind of storyline you keep returning to, not just a single event.`
  );

  return bits.join(" ");
}

/**
 * interpretAntardashaForUser
 *
 * Takes the active Mahadasha + Antardasha (Bhukti),
 * and explains the SHORT-term "focus / pressure / flavor".
 *
 * Example:
 *   "You're in Venus/Mars right now. Venus sets the stage
 *    (relationships, comfort, resources), but Mars adds urgency, conflict,
 *    courage, boundary-setting, or fast action."
 */
export function interpretAntardashaForUser(args: {
  mahaLord: P;
  subLord: P;
}): string {
  const { mahaLord, subLord } = args;

  if (mahaLord === subLord) {
    return `You're in ${mahaLord}/${subLord}, which is a pure expression of ${mahaLord}'s storyline without much filter. This tends to feel like “this is the real theme of my life right now.”`;
  }

  return `You're in ${mahaLord}/${subLord} right now. ${mahaLord} sets the overall chapter, and ${subLord} is the short-term activator — it decides what feels urgent, demanding, or rewarding this season.`;
}

/**
 * interpretPratyantardashaForUser
 *
 * Zooms in even tighter: "what is getting triggered THIS month / THIS few weeks."
 * This is the micro-spotlight inside the Antardasha.
 */
export function interpretPratyantardashaForUser(args: {
  mahaLord: P;
  antarLord: P;
  subSubLord: P;
}): string {
  const { mahaLord, antarLord, subSubLord } = args;

  // style guidance:
  // Mahadasha = background storyline,
  // Antardasha = current chapter,
  // Pratyantardasha = today's scene / where the drama is peaking.

  if (antarLord === subSubLord) {
    return `At the very fine timing level, you're in ${mahaLord}/${antarLord}/${subSubLord}. This is a concentrated dose of ${antarLord}'s themes, showing you exactly where life is poking you right now.`;
  }

  return `Right now the spotlight is ${mahaLord}/${antarLord}/${subSubLord}. ${mahaLord} is the long-running chapter, ${antarLord} is the current chapter inside it, and ${subSubLord} is the trigger of the moment — the area that feels most intense, sensitive, or fast-moving in day-to-day life.`;
}
