import "server-only";

import { DateTime } from "luxon";
import type { BirthInput } from "./types";
import {
  sweCalcUt,
  sweGetLahiriAyanamsaUt,
} from "@/server/astro/swe-wasm";

import calendar from "../data/saturn-calendar.json";

const DAY = 86400000;

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini",
  "Mrigashira", "Ardra", "Punarvasu", "Pushya",
  "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula",
  "Purva Ashadha", "Uttara Ashadha", "Shravana",
  "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
];

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars",
  "Rahu", "Jupiter", "Saturn", "Mercury",
];

type CalendarRow = (typeof calendar.rows)[number];

type Phase =
  | "rising"
  | "peak"
  | "setting"
  | "fourth"
  | "eighth"
  | "inactive";

const PHASE_DETAILS: Record<
  Phase,
  { label: string; theme: string; guidance: string }
> = {
  rising: {
    label: "Phase 1 - Rising",
    theme: "Preparation and restructuring",
    guidance:
      "Review commitments, simplify expenses and build sustainable routines.",
  },
  peak: {
    label: "Phase 2 - Peak",
    theme: "Responsibility and self-development",
    guidance:
      "Prioritise emotional balance, patience and realistic expectations.",
  },
  setting: {
    label: "Phase 3 - Setting",
    theme: "Consolidation and stability",
    guidance:
      "Strengthen financial discipline, family communication and long-term plans.",
  },
  fourth: {
    label: "Ardha Ashtama Shani",
    theme: "Domestic and emotional foundations",
    guidance:
      "Give attention to home, personal boundaries and emotional stability.",
  },
  eighth: {
    label: "Ashtama Shani",
    theme: "Transformation and resilience",
    guidance:
      "Review long-term obligations, prepare for uncertainty and avoid rushed decisions.",
  },
  inactive: {
    label: "Regular Saturn Transit",
    theme: "Steady progress",
    guidance:
      "Continue building consistency, responsibility and practical long-term goals.",
  },
};

function wrap360(value: number) {
  return ((value % 360) + 360) % 360;
}

function houseFromMoon(
  moonIndex: number,
  saturnIndex: number
) {
  return ((saturnIndex - moonIndex + 12) % 12) + 1;
}

function phaseFromHouse(house: number): Phase {
  switch (house) {
    case 12: return "rising";
    case 1: return "peak";
    case 2: return "setting";
    case 4: return "fourth";
    case 8: return "eighth";
    default: return "inactive";
  }
}

function isSadeSati(phase: Phase) {
  return (
    phase === "rising" ||
    phase === "peak" ||
    phase === "setting"
  );
}

function isDhaiya(phase: Phase) {
  return phase === "fourth" || phase === "eighth";
}

function describeLongitude(longitude: number) {
  const lon = wrap360(longitude);

  const signIndex = Math.floor(lon / 30);

  const nakshatraIndex = Math.floor(
    lon / (360 / 27)
  );

  const pada =
    Math.floor(lon / (360 / 108)) % 4 + 1;

  return {
    longitude: lon,
    degree: Number((lon % 30).toFixed(2)),
    sign: SIGNS[signIndex],
    signIndex,
    nakshatra: NAKSHATRAS[nakshatraIndex],
    nakshatraLord:
      NAKSHATRA_LORDS[nakshatraIndex % 9],
    nakshatraIndex,
    pada,
  };
}

async function calculateLongitude(
  timestamp: number,
  planetId: number
) {
  const jd = timestamp / DAY + 2440587.5;

  const result = await sweCalcUt(jd, planetId, 0);

  const tropical =
    result?.longitude ??
    result?.lon ??
    result?.xx?.[0] ??
    result?.data?.[0] ??
    result?.[0];

  const ayanamsa = await sweGetLahiriAyanamsaUt(jd);

  if (
    typeof tropical !== "number" ||
    !Number.isFinite(tropical) ||
    !Number.isFinite(ayanamsa)
  ) {
    throw new Error("Invalid planetary ephemeris.");
  }

  return wrap360(tropical - ayanamsa);
}

function durationDays(startUTC: string, endUTC: string) {
  return Math.max(
    0,
    (Date.parse(endUTC) - Date.parse(startUTC)) / DAY
  );
}

function localDate(utc: string, timezone: string) {
  return DateTime
    .fromISO(utc, { zone: "utc" })
    .setZone(timezone)
    .toISODate();
}

type PhaseInterval = {
  phase: Phase;
  label: string;
  sign: string;
  houseFromMoon: number;
  startUTC: string;
  endUTC: string;
  durationDays: number;
  startDate: string | null;
  endDate: string | null;
  retrogradeEntry: boolean;
};

function buildPhaseIntervals(
  moonIndex: number,
  timezone: string
): PhaseInterval[] {
  const intervals: PhaseInterval[] = [];

  for (const row of calendar.rows) {
    const house = houseFromMoon(
      moonIndex,
      row.signIndex
    );

    const phase = phaseFromHouse(house);

    const previous = intervals[intervals.length - 1];

    if (
      previous &&
      previous.phase === phase &&
      previous.sign === row.sign &&
      previous.endUTC === row.startUTC
    ) {
      previous.endUTC = row.endUTC;
      previous.endDate = localDate(row.endUTC, timezone);
      previous.durationDays = Math.round(
        durationDays(previous.startUTC, row.endUTC)
      );
    } else {
      intervals.push({
        phase,
        label: PHASE_DETAILS[phase].label,
        sign: row.sign,
        houseFromMoon: house,
        startUTC: row.startUTC,
        endUTC: row.endUTC,
        startDate: localDate(row.startUTC, timezone),
        endDate: localDate(row.endUTC, timezone),
        durationDays: Math.round(
          durationDays(row.startUTC, row.endUTC)
        ),
        retrogradeEntry: row.retrograde,
      });
    }
  }

  return intervals;
}

type SaturnCycle = {
  startUTC: string;
  endUTC: string;
  startDate: string | null;
  endDate: string | null;
  durationDays: number;
  activeDays: number;
  interruptionDays: number;
  complete: boolean;
  phases: PhaseInterval[];
  interruptions: {
    startUTC: string;
    endUTC: string;
    startDate: string | null;
    endDate: string | null;
    durationDays: number;
  }[];
};

function buildCycles(
  intervals: PhaseInterval[],
  timezone: string,
  category: "sadeSati" | "dhaiya"
): SaturnCycle[] {
  const relevant = intervals.filter(interval =>
    category === "sadeSati"
      ? isSadeSati(interval.phase)
      : isDhaiya(interval.phase)
  );

  const cycles: SaturnCycle[] = [];

  for (const interval of relevant) {
    const previous = cycles[cycles.length - 1];

    const gap = previous
      ? durationDays(previous.endUTC, interval.startUTC)
      : Infinity;

    const sameDhaiya =
      category !== "dhaiya" ||
      previous?.phases[0]?.phase === interval.phase;

    // Group temporary retrograde exits and re-entries.
    // Separate cycles are several years apart.
    if (previous && gap <= 365 && sameDhaiya) {
      if (gap > 0) {
        previous.interruptions.push({
          startUTC: previous.endUTC,
          endUTC: interval.startUTC,
          startDate: localDate(previous.endUTC, timezone),
          endDate: localDate(interval.startUTC, timezone),
          durationDays: Math.round(gap),
        });
      }

      previous.phases.push(interval);
      previous.endUTC = interval.endUTC;
      previous.endDate = interval.endDate;
    } else {
      cycles.push({
        startUTC: interval.startUTC,
        endUTC: interval.endUTC,
        startDate: interval.startDate,
        endDate: interval.endDate,
        durationDays: 0,
        activeDays: 0,
        interruptionDays: 0,
        complete: true,
        phases: [interval],
        interruptions: [],
      });
    }
  }

  for (const cycle of cycles) {
    const total = durationDays(
      cycle.startUTC,
      cycle.endUTC
    );

    const active = cycle.phases.reduce(
      (sum, phase) =>
        sum + durationDays(phase.startUTC, phase.endUTC),
      0
    );

    cycle.durationDays = Math.round(total);
    cycle.activeDays = Math.round(active);
    cycle.interruptionDays = Math.round(
      Math.max(0, total - active)
    );

    cycle.complete =
      cycle.startUTC !== calendar.coverageStartUTC &&
      cycle.endUTC !== calendar.coverageEndUTC;
  }

  return cycles;
}

function buildNakshatraJourney(
  cycle: SaturnCycle | null,
  moonIndex: number,
  timezone: string
) {
  if (!cycle) return [];

  const start = Date.parse(cycle.startUTC);
  const end = Date.parse(cycle.endUTC);

  return calendar.rows
    .filter(row =>
      Date.parse(row.startUTC) < end &&
      Date.parse(row.endUTC) > start
    )
    .map((row: CalendarRow) => {
      const house = houseFromMoon(
        moonIndex,
        row.signIndex
      );

      const phase = phaseFromHouse(house);

      return {
        sign: row.sign,
        nakshatra: row.nakshatra,
        nakshatraLord:
          NAKSHATRA_LORDS[row.nakshatraIndex % 9],
        pada: row.pada,
        retrograde: row.retrograde,
        phase,
        phaseLabel: PHASE_DETAILS[phase].label,
        startUTC: row.startUTC,
        endUTC: row.endUTC,
        startDate: localDate(row.startUTC, timezone),
        endDate: localDate(row.endUTC, timezone),
      };
    });
}

function selectCycles(
  cycles: SaturnCycle[],
  birthTimestamp: number,
  now: number
) {
  const relevant = cycles.filter(
    cycle => Date.parse(cycle.endUTC) > birthTimestamp
  );

  const previous = relevant
    .filter(cycle => Date.parse(cycle.endUTC) <= now)
    .slice(-1)[0] ?? null;

  const current = relevant.find(
    cycle =>
      Date.parse(cycle.startUTC) <= now &&
      now < Date.parse(cycle.endUTC)
  ) ?? null;

  const upcoming = relevant.find(
    cycle => Date.parse(cycle.startUTC) > now
  ) ?? null;

  return {
    previous,
    current,
    upcoming,
    history: relevant.filter(
      cycle => Date.parse(cycle.endUTC) <= now
    ),
  };
}

export async function buildSadeSati(birth: BirthInput) {
  const birthDT = DateTime.fromISO(
    `${birth.dateISO}T${birth.time}`,
    { zone: birth.timezone }
  );

  if (!birthDT.isValid) {
    throw new Error("Invalid birth date or timezone.");
  }

  const birthTimestamp = birthDT.toMillis();
  const now = Date.now();

  if (birthTimestamp > now) {
    throw new Error("Birth date cannot be in the future.");
  }

  if (
    birthTimestamp < Date.parse(calendar.coverageStartUTC) ||
    now >= Date.parse(calendar.coverageEndUTC)
  ) {
    throw new Error("Date outside Saturn calendar coverage.");
  }

  const moonLongitude = await calculateLongitude(
    birthTimestamp,
    1
  );

  const saturnLongitude = await calculateLongitude(
    now,
    6
  );

  const moon = describeLongitude(moonLongitude);
  const saturn = describeLongitude(saturnLongitude);

  const before = await calculateLongitude(
    now - 60000,
    6
  );

  const after = await calculateLongitude(
    now + 60000,
    6
  );

  const retrograde =
    ((after - before + 540) % 360) - 180 < 0;

  const house = houseFromMoon(
    moon.signIndex,
    saturn.signIndex
  );

  const phase = phaseFromHouse(house);

  const intervals = buildPhaseIntervals(
    moon.signIndex,
    birth.timezone
  );

  const sadeSatiCycles = buildCycles(
    intervals,
    birth.timezone,
    "sadeSati"
  );

  const dhaiyaCycles = buildCycles(
    intervals,
    birth.timezone,
    "dhaiya"
  );

  const sadeSati = selectCycles(
    sadeSatiCycles,
    birthTimestamp,
    now
  );

  const dhaiya = selectCycles(
    dhaiyaCycles,
    birthTimestamp,
    now
  );

  const activeInterval = intervals.find(
    interval =>
      Date.parse(interval.startUTC) <= now &&
      now < Date.parse(interval.endUTC)
  ) ?? null;

  const nextInterval = intervals.find(
    interval => Date.parse(interval.startUTC) > now
  ) ?? null;

  const currentCycle =
    sadeSati.current ?? dhaiya.current;

  const journeyCycle =
    sadeSati.current ?? sadeSati.upcoming;

  return {
    ok: true,

    method: {
      zodiac: "Sidereal",
      ayanamsa: "Lahiri",
      reference: "Natal Moon - Whole Sign",
      ephemeris: calendar.ephemeris,
      calendarVersion: calendar.version,
      coverageStartUTC: calendar.coverageStartUTC,
      coverageEndUTC: calendar.coverageEndUTC,
      boundaryResolutionMinutes:
        calendar.boundaryResolutionMinutes,
    },

    birth,

    asOfUTC: new Date(now).toISOString(),

    natalMoon: moon,

    currentSaturn: {
      ...saturn,
      retrograde,
      houseFromMoon: house,
    },

    status: {
      phase,
      label: PHASE_DETAILS[phase].label,
      sadeSatiActive: isSadeSati(phase),
      dhaiyaActive: isDhaiya(phase),
      temporaryExit: Boolean(
        currentCycle &&
        !isSadeSati(phase) &&
        !isDhaiya(phase)
      ),
      activeInterval,
      nextInterval,
      remainingPhaseDays: activeInterval
        ? Math.max(
            0,
            Math.ceil(
              (Date.parse(activeInterval.endUTC) - now) / DAY
            )
          )
        : null,
      remainingCycleDays: currentCycle
        ? Math.max(
            0,
            Math.ceil(
              (Date.parse(currentCycle.endUTC) - now) / DAY
            )
          )
        : null,
    },

    sadeSati: {
      ...sadeSati,
      phaseSigns: {
        rising: SIGNS[(moon.signIndex + 11) % 12],
        peak: SIGNS[moon.signIndex],
        setting: SIGNS[(moon.signIndex + 1) % 12],
      },
      nakshatraJourney: buildNakshatraJourney(
        journeyCycle,
        moon.signIndex,
        birth.timezone
      ),
    },

    dhaiya: {
      ...dhaiya,
      fourthSign: SIGNS[(moon.signIndex + 3) % 12],
      eighthSign: SIGNS[(moon.signIndex + 7) % 12],
    },

    guidance: {
      theme: PHASE_DETAILS[phase].theme,
      message: PHASE_DETAILS[phase].guidance,
      note:
        "Sade Sati is a traditional astrological framework, not a scientific prediction of adverse events. Individual experiences vary.",
    },
  };
}