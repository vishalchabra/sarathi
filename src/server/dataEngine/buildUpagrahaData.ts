import "server-only";

import { DateTime } from "luxon";
import { getAscendant } from "@/server/astro/asc";
import { buildSolarTimes } from "./buildSolarTimes";

type BirthInput = {
  name?: string;
  dateISO: string;
  time: string;
  timezone: string;
  lat: number;
  lon: number;
};

type NatalAscendantInput = {
  sign: string | null;
  signNum: number | null;
  degree: number | null;
  house: number | null;
  lon: number | null;
};

type UpagrahaKey =
  | "gulika"
  | "mandi"
  | "yamakantaka"
  | "kala"
  | "mrityu"
  | "arthaprahara";

type BirthPhase = "day" | "night";
type NightSubtype = "early_night" | "late_night";
type RuleFamily = "day" | "early_night" | "late_night";
type PointMomentType = "start" | "midpoint" | "end" | "ratio";
type SpanChoice = "previous_night" | "day" | "next_night";

type UpagrahaRule = {
  spanChoice: SpanChoice;
  segmentIndex: number;
  momentType: PointMomentType;
  ratio?: number;
};

type WeekdayRuleSet = Record<UpagrahaKey, UpagrahaRule>;
type RuleMatrix = Record<RuleFamily, Record<string, WeekdayRuleSet>>;

const SIGN_TO_NUM: Record<string, number> = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

const NAKSHATRA_NAMES = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

/**
 * AstroSage-compatible calibration matrix.
 *
 * Key design:
 * - day
 * - early_night  => after sunset until midnight
 * - late_night   => after midnight until sunrise
 *
 * Extend/tune rows as you calibrate more charts.
 */
const ASTROSAGE_RULES: RuleMatrix = {
 day: {
  Sunday: {
    gulika: { spanChoice: "day", segmentIndex: 7, momentType: "start" },
    mandi: { spanChoice: "day", segmentIndex: 7, momentType: "midpoint" },
    yamakantaka: { spanChoice: "day", segmentIndex: 5, momentType: "midpoint" },
    kala: { spanChoice: "day", segmentIndex: 1, momentType: "midpoint" },
    mrityu: { spanChoice: "day", segmentIndex: 3, momentType: "midpoint" },
    arthaprahara: { spanChoice: "day", segmentIndex: 4, momentType: "midpoint" },
  },
  Monday: {
    gulika: { spanChoice: "day", segmentIndex: 6, momentType: "start" },
    mandi: { spanChoice: "day", segmentIndex: 6, momentType: "midpoint" },
    yamakantaka: { spanChoice: "day", segmentIndex: 4, momentType: "midpoint" },
    kala: { spanChoice: "day", segmentIndex: 8, momentType: "midpoint" },
    mrityu: { spanChoice: "day", segmentIndex: 2, momentType: "midpoint" },
    arthaprahara: { spanChoice: "day", segmentIndex: 3, momentType: "midpoint" },
  },
  Tuesday: {
    gulika: { spanChoice: "day", segmentIndex: 5, momentType: "start" },
    mandi: { spanChoice: "day", segmentIndex: 5, momentType: "midpoint" },
    yamakantaka: { spanChoice: "day", segmentIndex: 3, momentType: "midpoint" },
    kala: { spanChoice: "day", segmentIndex: 7, momentType: "midpoint" },
    mrityu: { spanChoice: "day", segmentIndex: 1, momentType: "midpoint" },
    arthaprahara: { spanChoice: "day", segmentIndex: 2, momentType: "midpoint" },
  },
  Wednesday: {
    gulika: { spanChoice: "day", segmentIndex: 4, momentType: "start" },
    mandi: { spanChoice: "day", segmentIndex: 4, momentType: "midpoint" },
    yamakantaka: { spanChoice: "day", segmentIndex: 2, momentType: "midpoint" },
    kala: { spanChoice: "day", segmentIndex: 6, momentType: "midpoint" },
    mrityu: { spanChoice: "day", segmentIndex: 8, momentType: "midpoint" },
    arthaprahara: { spanChoice: "day", segmentIndex: 1, momentType: "midpoint" },
  },
  Thursday: {
    gulika: { spanChoice: "day", segmentIndex: 3, momentType: "start" },
    mandi: { spanChoice: "day", segmentIndex: 3, momentType: "midpoint" },
    yamakantaka: { spanChoice: "day", segmentIndex: 1, momentType: "midpoint" },
    kala: { spanChoice: "day", segmentIndex: 5, momentType: "midpoint" },
    mrityu: { spanChoice: "day", segmentIndex: 7, momentType: "midpoint" },
    arthaprahara: { spanChoice: "day", segmentIndex: 8, momentType: "midpoint" },
  },
  Friday: {
    gulika: { spanChoice: "day", segmentIndex: 2, momentType: "start" },
    mandi: { spanChoice: "day", segmentIndex: 2, momentType: "midpoint" },
    yamakantaka: { spanChoice: "day", segmentIndex: 8, momentType: "midpoint" },
    kala: { spanChoice: "day", segmentIndex: 4, momentType: "midpoint" },
    mrityu: { spanChoice: "day", segmentIndex: 6, momentType: "midpoint" },
    arthaprahara: { spanChoice: "day", segmentIndex: 7, momentType: "midpoint" },
  },
  Saturday: {
    gulika: { spanChoice: "day", segmentIndex: 1, momentType: "start" },
    mandi: { spanChoice: "day", segmentIndex: 1, momentType: "midpoint" },
    yamakantaka: { spanChoice: "day", segmentIndex: 7, momentType: "midpoint" },
    kala: { spanChoice: "day", segmentIndex: 3, momentType: "midpoint" },
    mrityu: { spanChoice: "day", segmentIndex: 5, momentType: "midpoint" },
    arthaprahara: { spanChoice: "day", segmentIndex: 6, momentType: "midpoint" },
  },
},
  /**
   * Evening/night births before midnight.
   */
  early_night: {
   Sunday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 8, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 8, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 6, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 2, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 4, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 5, momentType: "midpoint" },
},
  Monday: {
  gulika: { spanChoice: "next_night", segmentIndex: 7, momentType: "start" },
  mandi: { spanChoice: "next_night", segmentIndex: 7, momentType: "midpoint" },
  yamakantaka: { spanChoice: "next_night", segmentIndex: 5, momentType: "midpoint" },
  kala: { spanChoice: "next_night", segmentIndex: 1, momentType: "midpoint" },
  mrityu: { spanChoice: "next_night", segmentIndex: 3, momentType: "midpoint" },
  arthaprahara: { spanChoice: "next_night", segmentIndex: 4, momentType: "midpoint" },
},
  Tuesday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 6, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 6, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 4, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 8, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 2, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 3, momentType: "midpoint" },
},
 Wednesday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 4, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 4, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 2, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 6, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 8, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 1, momentType: "midpoint" },
},
  Thursday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 3, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 3, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 1, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 5, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 7, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 8, momentType: "midpoint" },
},
 Friday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 2, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 2, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 8, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 4, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 6, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 7, momentType: "midpoint" },
},
   Saturday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 1, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 1, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 7, momentType: "start" },
  kala: { spanChoice: "previous_night", segmentIndex: 2, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 5, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 6, momentType: "midpoint" },
},
  },

  /**
   * After-midnight births before sunrise.
   * This is the new layer your debugging showed was needed.
   * Start with a different Thursday row; extend as you calibrate more charts.
   */
  late_night: {
  Sunday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 3, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 3, momentType: "midpoint" },
  yamakantaka: { spanChoice: "day", segmentIndex: 1, momentType: "ratio", ratio: 0.75 },
  kala: { spanChoice: "previous_night", segmentIndex: 5, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 7, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 8, momentType: "midpoint" },
},

  Monday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 2, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 2, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 8, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 4, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 6, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 7, momentType: "midpoint" },
},

 Tuesday: {
  gulika: { spanChoice: "day", segmentIndex: 1, momentType: "start" },
  mandi: { spanChoice: "day", segmentIndex: 1, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 7, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 3, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 5, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 6, momentType: "midpoint" },
},

Wednesday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 7, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 7, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 5, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 1, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 3, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 4, momentType: "midpoint" },
},

Thursday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 6, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 6, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 4, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 8, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 2, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 3, momentType: "midpoint" },
},

Friday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 5, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 5, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 3, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 7, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 1, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 2, momentType: "midpoint" },
},

Saturday: {
  gulika: { spanChoice: "previous_night", segmentIndex: 4, momentType: "start" },
  mandi: { spanChoice: "previous_night", segmentIndex: 4, momentType: "midpoint" },
  yamakantaka: { spanChoice: "previous_night", segmentIndex: 2, momentType: "midpoint" },
  kala: { spanChoice: "previous_night", segmentIndex: 6, momentType: "midpoint" },
  mrityu: { spanChoice: "previous_night", segmentIndex: 8, momentType: "midpoint" },
  arthaprahara: { spanChoice: "previous_night", segmentIndex: 1, momentType: "midpoint" },
},
  },
};
const CORRECTABLE_UPAGRAHAS: UpagrahaKey[] = [
  "yamakantaka",
  "kala",
  "mrityu",
];

const WEEKDAY_UPAGRAHA_SEGMENT_CORRECTIONS: Partial<
  Record<string, Partial<Record<UpagrahaKey, number>>>
> = {
};

function wrapSegmentIndex(index: number) {
  const normalized = ((index - 1) % 8 + 8) % 8;
  return normalized + 1;
}

function getCorrectedSegmentIndex(
  weekdayName: string,
  key: UpagrahaKey,
  segmentIndex: number
) {
  if (!CORRECTABLE_UPAGRAHAS.includes(key)) {
    return segmentIndex;
  }

  const weekdayCorrections =
    WEEKDAY_UPAGRAHA_SEGMENT_CORRECTIONS[weekdayName] ?? null;
  const delta = weekdayCorrections?.[key] ?? 0;
  return wrapSegmentIndex(segmentIndex + delta);
}
function getRule(
  family: RuleFamily,
  weekdayName: string,
  key: UpagrahaKey
): UpagrahaRule | null {
  return ASTROSAGE_RULES[family]?.[weekdayName]?.[key] ?? null;
}

function normalize360(v: number) {
  const x = v % 360;
  return x < 0 ? x + 360 : x;
}

function getNakshatraAndPadaFromLon(lon: number | null | undefined) {
  if (typeof lon !== "number" || Number.isNaN(lon)) {
    return { nakshatra: null, pada: null };
  }

  const x = normalize360(lon);
  const nakSpan = 360 / 27;
  const idx = Math.floor(x / nakSpan);
  const withinNak = x % nakSpan;
  const pada = Math.floor(withinNak / (nakSpan / 4)) + 1;

  return {
    nakshatra: NAKSHATRA_NAMES[idx] ?? null,
    pada,
  };
}

function getSignFromLon(lon: number | null | undefined) {
  if (typeof lon !== "number" || Number.isNaN(lon)) return null;

  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  const idx = Math.floor(normalize360(lon) / 30);
  return signs[idx] ?? null;
}

function getDegreeInSign(lon: number | null | undefined) {
  if (typeof lon !== "number" || Number.isNaN(lon)) return null;
  return Number((normalize360(lon) % 30).toFixed(2));
}

function getHouseFromAsc(pointSign: string | null, natalAscSign: string | null) {
  if (!pointSign || !natalAscSign) return null;

  const pointNum = SIGN_TO_NUM[pointSign] ?? 0;
  const ascNum = SIGN_TO_NUM[natalAscSign] ?? 0;

  if (!pointNum || !ascNum) return null;

  return ((pointNum - ascNum + 12) % 12) + 1;
}

function buildEightSegments(startDT: any, endDT: any) {
  if (!startDT || !endDT || !startDT.isValid || !endDT.isValid) return [];

  const totalMinutes = endDT.diff(startDT, "minutes").minutes;
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return [];

  const part = totalMinutes / 8;

  return Array.from({ length: 8 }, (_, i) => {
    const index = i + 1;
    const segStart = startDT.plus({ minutes: i * part });
    const segEnd = startDT.plus({ minutes: (i + 1) * part });
    const midpoint = segStart.plus({ minutes: part / 2 });

    return {
      index,
      startDT: segStart,
      endDT: segEnd,
      midpointDT: midpoint,
      startISO: segStart.toISO(),
      endISO: segEnd.toISO(),
      midpointISO: midpoint.toISO(),
      durationMinutes: Number(part.toFixed(6)),
    };
  });
}

function isDusthana(house: number | null) {
  return [6, 8, 12].includes(Number(house));
}

function isUpachaya(house: number | null) {
  return [3, 6, 10, 11].includes(Number(house));
}

function isKendra(house: number | null) {
  return [1, 4, 7, 10].includes(Number(house));
}

function isTrikona(house: number | null) {
  return [1, 5, 9].includes(Number(house));
}

function isMaraka(house: number | null) {
  return [2, 7].includes(Number(house));
}

function getGulikaHouseMeaning(house: number | null) {
  const map: Record<number, string> = {
    1: "Gives karmic heaviness to self-expression, health patterns, temperament, and personal identity.",
    2: "Can intensify family karma, speech, stored values, and money-related stress or discipline.",
    3: "Often shows forceful effort, persistence, pressure through communication, siblings, or self-made struggle.",
    4: "May burden emotional peace, home life, mother themes, or inner security, while deepening endurance.",
    5: "Can complicate creativity, children, romance, and speculative judgement, but may sharpen seriousness in study.",
    6: "Strongly activates conflict, service, debts, disease, competition, and the ability to survive adversity.",
    7: "Can create karmic seriousness in marriage, contracts, public dealings, and one-to-one relationships.",
    8: "Deepens occult tendency, vulnerability, hidden suffering, transformation, secrecy, and crisis-handling.",
    9: "May challenge faith, teachers, father themes, belief systems, and fortune, while deepening austerity.",
    10: "Brings pressure, endurance, karmic visibility, ambition, and strain in profession or public duty.",
    11: "Can complicate gains, networks, elder-sibling dynamics, and desire fulfilment, but supports hard-earned success.",
    12: "Often links to isolation, expenditure, hidden sorrow, loss, retreat, sleep issues, or spiritual withdrawal.",
  };

  return house ? map[house] ?? null : null;
}

function getGulikaSignMeaning(sign: string | null) {
  const map: Record<string, string> = {
    Aries: "Acts with urgency, heat, confrontation, and impulsive force.",
    Taurus:
      "Acts through endurance, material attachment, stability pressure, and stubborn persistence.",
    Gemini: "Acts through speech, nervous intensity, duality, and mental restlessness.",
    Cancer:
      "Acts through emotional sensitivity, protection patterns, memory, and mood-based defensiveness.",
    Leo: "Acts through pride, visibility, authority themes, and wounded self-expression.",
    Virgo: "Acts through analysis, worry, correction, service, and perfection pressure.",
    Libra:
      "Acts through relationships, fairness tensions, diplomacy, and social balancing.",
    Scorpio:
      "Acts through secrecy, control, survival instinct, emotional intensity, and deep karmic pressure.",
    Sagittarius:
      "Acts through ideology, principles, teaching, morality, and directional conviction.",
    Capricorn: "Acts through burden, discipline, delay, endurance, status, and realism.",
    Aquarius:
      "Acts through detachment, systems, social distance, unconventional thinking, and pressure through networks.",
    Pisces:
      "Acts through sensitivity, withdrawal, dissolution, compassion, and hidden emotional load.",
  };

  return sign ? map[sign] ?? null : null;
}

function getGulikaSeverityTag(house: number | null) {
  if ([6, 8, 12].includes(Number(house))) return "high";
  if ([1, 4, 7, 10].includes(Number(house))) return "moderate";
  if (house == null) return "unknown";
  return "contextual";
}

function getGulikaFocusAreas(house: number | null) {
  const map: Record<number, string[]> = {
    1: ["self", "health", "identity"],
    2: ["family", "speech", "wealth"],
    3: ["effort", "communication", "siblings"],
    4: ["home", "mother", "emotional peace"],
    5: ["children", "intelligence", "creativity"],
    6: ["disease", "debts", "enemies"],
    7: ["marriage", "agreements", "public dealings"],
    8: ["crisis", "longevity", "occult matters"],
    9: ["faith", "teachers", "fortune"],
    10: ["career", "reputation", "duty"],
    11: ["gains", "networks", "ambitions"],
    12: ["loss", "retreat", "sleep"],
  };

  return house ? map[house] ?? [] : [];
}

function getOrdinalSuffix(n: number) {
  if (n >= 11 && n <= 13) return "th";

  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function buildGulikaInterpretation(params: {
  sign: string | null;
  houseFromAsc: number | null;
  nakshatra: string | null;
  phase: BirthPhase | null;
}) {
  const { sign, houseFromAsc, nakshatra, phase } = params;

  const signMeaning = getGulikaSignMeaning(sign);
  const houseMeaning = getGulikaHouseMeaning(houseFromAsc);
  const severity = getGulikaSeverityTag(houseFromAsc);
  const focusAreas = getGulikaFocusAreas(houseFromAsc);

  const summaryParts = [
    sign ? `Gulika in ${sign}` : null,
    houseFromAsc
      ? `in the ${houseFromAsc}${getOrdinalSuffix(houseFromAsc)} house`
      : null,
    nakshatra ? `in ${nakshatra}` : null,
  ].filter(Boolean);

  let summary = summaryParts.join(" ");
  if (summary) {
    summary += ".";
  } else {
    summary = "Gulika placement available.";
  }

  let practicalReading = "";
  if (signMeaning && houseMeaning) {
    practicalReading = `${signMeaning} ${houseMeaning}`;
  } else if (signMeaning) {
    practicalReading = signMeaning;
  } else if (houseMeaning) {
    practicalReading = houseMeaning;
  }

  let caution = "";
  if (houseFromAsc === 3) {
    caution =
      "Watch pressure patterns in speech, initiative, sibling dynamics, and reactive communication.";
  } else if (houseFromAsc === 6) {
    caution =
      "Strong placement for struggle-management, but health, conflict, and debt themes need careful handling.";
  } else if (houseFromAsc === 8) {
    caution =
      "Handle crisis, secrecy, emotional intensity, and hidden vulnerability with maturity.";
  } else if (houseFromAsc === 12) {
    caution =
      "Pay attention to isolation, sleep, hidden stress, and loss-producing habits.";
  } else if (houseFromAsc === 10) {
    caution =
      "Career pressure may become karmically defining; discipline matters more than image.";
  } else {
    caution =
      "This placement should be judged carefully with Saturn, the 8th house, Moon, and the dasha context.";
  }

  let birthContext = "";
  if (phase === "night") {
    birthContext = "Computed from the night segment system for a night birth.";
  } else if (phase === "day") {
    birthContext = "Computed from the day segment system for a day birth.";
  }

  return {
    severity,
    focusAreas,
    summary,
    practicalReading,
    caution,
    birthContext,
  };
}

function resolveSpanFromChoice(params: {
  spanChoice: SpanChoice;
  sunriseDT: any;
  sunsetDT: any;
  previousSunsetDT: any;
  nextSunriseDT: any;
}) {
  const { spanChoice, sunriseDT, sunsetDT, previousSunsetDT, nextSunriseDT } =
    params;

  if (spanChoice === "previous_night") {
    if (previousSunsetDT && sunriseDT) {
      return {
        phase: "night" as BirthPhase,
        spanStartDT: previousSunsetDT,
        spanEndDT: sunriseDT,
      };
    }
  }

  if (spanChoice === "day") {
    if (sunriseDT && sunsetDT) {
      return {
        phase: "day" as BirthPhase,
        spanStartDT: sunriseDT,
        spanEndDT: sunsetDT,
      };
    }
  }

  if (spanChoice === "next_night") {
    if (sunsetDT && nextSunriseDT) {
      return {
        phase: "night" as BirthPhase,
        spanStartDT: sunsetDT,
        spanEndDT: nextSunriseDT,
      };
    }
  }

  return null;
}

async function buildPointFromSegment(params: {
  segment: any;
  birth: BirthInput;
  natalAscendant: NatalAscendantInput;
  pointMomentType?: PointMomentType;
  pointMomentRatio?: number | null;
}) {
  const pointMomentType = params.pointMomentType ?? "start";

  let pointMomentDT: any = null;

  if (pointMomentType === "midpoint") {
    pointMomentDT = params.segment?.midpointDT ?? null;
  } else if (pointMomentType === "end") {
    pointMomentDT = params.segment?.endDT ?? null;
  } else if (pointMomentType === "ratio") {
    const startDT = params.segment?.startDT ?? null;
    const endDT = params.segment?.endDT ?? null;
    const ratio =
      typeof params.pointMomentRatio === "number" &&
      Number.isFinite(params.pointMomentRatio)
        ? params.pointMomentRatio
        : 0.5;

    if (startDT?.isValid && endDT?.isValid) {
      const clampedRatio = Math.max(0, Math.min(1, ratio));
      const totalMinutes = endDT.diff(startDT, "minutes").minutes;
      pointMomentDT = startDT.plus({ minutes: totalMinutes * clampedRatio });
    }
  } else {
    pointMomentDT = params.segment?.startDT ?? null;
  }

  if (!pointMomentDT?.isValid) return null;

  const pointAsc = await getAscendant({
    dateISO: pointMomentDT.toFormat("yyyy-MM-dd"),
    time: pointMomentDT.toFormat("HH:mm:ss"),
    tz: params.birth.timezone,
    lat: params.birth.lat,
    lon: params.birth.lon,
  });

  const lon =
    pointAsc && typeof pointAsc.lon === "number"
      ? normalize360(pointAsc.lon)
      : null;

  const sign = getSignFromLon(lon);
  const degree = getDegreeInSign(lon);
  const nakInfo = getNakshatraAndPadaFromLon(lon);
  const houseFromAsc = getHouseFromAsc(sign, params.natalAscendant.sign);

  return {
    pointMomentISO: pointMomentDT.toISO(),
    pointMomentType,
    pointMomentRatio:
      pointMomentType === "ratio"
        ? typeof params.pointMomentRatio === "number"
          ? params.pointMomentRatio
          : null
        : null,
    lon,
    sign,
    degree,
    nakshatra: nakInfo.nakshatra,
    pada: nakInfo.pada,
    houseFromAsc,
    flags: {
      isDusthana: isDusthana(houseFromAsc),
      isUpachaya: isUpachaya(houseFromAsc),
      isKendra: isKendra(houseFromAsc),
      isTrikona: isTrikona(houseFromAsc),
      isMaraka: isMaraka(houseFromAsc),
    },
  };
}

async function buildSegmentedUpagraha(params: {
  key: UpagrahaKey;
  phase: BirthPhase;
  weekdayName: string;
  spanStartDT: any;
  spanEndDT: any;
  birth: BirthInput;
  natalAscendant: NatalAscendantInput;
  ruleFamily: RuleFamily;
  rule: UpagrahaRule;
}) {
  const {
    key,
    phase,
    weekdayName,
    spanStartDT,
    spanEndDT,
    birth,
    natalAscendant,
    ruleFamily,
    rule,
  } = params;

  const segmentIndex = getCorrectedSegmentIndex(
    weekdayName,
    key,
    rule.segmentIndex
  );

  const segments = buildEightSegments(spanStartDT, spanEndDT);
  const chosenSegment =
    segments.find((s: any) => s.index === segmentIndex) ?? null;

  if (!chosenSegment?.startDT?.isValid) return null;

  const pointMomentType = rule.momentType;
  const pointMomentRatio =
    pointMomentType === "ratio" ? rule.ratio ?? null : null;

  const point = await buildPointFromSegment({
    segment: chosenSegment,
    birth,
    natalAscendant,
    pointMomentType,
    pointMomentRatio,
  });

  if (!point) return null;

  return {
    phase,
    weekday: weekdayName,
    segmentIndex,
    spanStartISO: spanStartDT?.toISO?.() ?? null,
    spanEndISO: spanEndDT?.toISO?.() ?? null,
    segmentStartISO: chosenSegment?.startISO ?? null,
    segmentEndISO: chosenSegment?.endISO ?? null,
    pointMomentISO: point.pointMomentISO,
    pointMomentType: point.pointMomentType,
    pointMomentRatio: point.pointMomentRatio ?? null,
    lon: point.lon,
    sign: point.sign,
    degree: point.degree,
    nakshatra: point.nakshatra,
    pada: point.pada,
    houseFromAsc: point.houseFromAsc,
    flags: point.flags,
    calculationBasis: {
      spanType: phase,
      slotSystem: "weekday-8-part",
      pointMomentType,
      pointMomentRatio,
      ruleFamily,
      spanChoice: rule.spanChoice,
    },
  };
}
async function buildRuledUpagraha(params: {
  key: UpagrahaKey;
  birth: BirthInput;
  natalAscendant: NatalAscendantInput;
  ruleFamily: RuleFamily;
  operativeWeekday: string;
  sunriseDT: any;
  sunsetDT: any;
  previousSunsetDT: any;
  nextSunriseDT: any;
}) {
  const {
    key,
    birth,
    natalAscendant,
    ruleFamily,
    operativeWeekday,
    sunriseDT,
    sunsetDT,
    previousSunsetDT,
    nextSunriseDT,
  } = params;

  const rule = getRule(ruleFamily, operativeWeekday, key);
  if (!rule) return null;

  const resolved = resolveSpanFromChoice({
    spanChoice: rule.spanChoice,
    sunriseDT,
    sunsetDT,
    previousSunsetDT,
    nextSunriseDT,
  });

  if (!resolved) return null;

return buildSegmentedUpagraha({
  key,
  phase: resolved.phase,
  weekdayName: operativeWeekday,
  spanStartDT: resolved.spanStartDT,
  spanEndDT: resolved.spanEndDT,
  birth,
  natalAscendant,
  ruleFamily,
  rule,
});
}

async function buildSegmentDebugTable(params: {
  birth: BirthInput;
  natalAscendant: NatalAscendantInput;
  spanStartDT: any;
  spanEndDT: any;
}) {
  const { birth, natalAscendant, spanStartDT, spanEndDT } = params;

  const segments = buildEightSegments(spanStartDT, spanEndDT);

  const rows = await Promise.all(
    segments.map(async (segment: any) => {
      const startPoint = await buildPointFromSegment({
        segment,
        birth,
        natalAscendant,
        pointMomentType: "start",
      });

      const midpointPoint = await buildPointFromSegment({
        segment,
        birth,
        natalAscendant,
        pointMomentType: "midpoint",
      });

      const ratio75Point = await buildPointFromSegment({
        segment,
        birth,
        natalAscendant,
        pointMomentType: "ratio",
        pointMomentRatio: 0.75,
      });

      return {
        segmentIndex: segment.index,
        segmentStartISO: segment.startISO ?? null,
        segmentEndISO: segment.endISO ?? null,
        segmentMidpointISO: segment.midpointISO ?? null,
        durationMinutes: segment.durationMinutes ?? null,
        start: startPoint
          ? {
              lon: startPoint.lon,
              sign: startPoint.sign,
              degree: startPoint.degree,
              nakshatra: startPoint.nakshatra,
              pada: startPoint.pada,
              houseFromAsc: startPoint.houseFromAsc,
            }
          : null,
        midpoint: midpointPoint
          ? {
              lon: midpointPoint.lon,
              sign: midpointPoint.sign,
              degree: midpointPoint.degree,
              nakshatra: midpointPoint.nakshatra,
              pada: midpointPoint.pada,
              houseFromAsc: midpointPoint.houseFromAsc,
            }
          : null,
        ratio75: ratio75Point
          ? {
              lon: ratio75Point.lon,
              sign: ratio75Point.sign,
              degree: ratio75Point.degree,
              nakshatra: ratio75Point.nakshatra,
              pada: ratio75Point.pada,
              houseFromAsc: ratio75Point.houseFromAsc,
            }
          : null,
      };
    })
  );

  return rows;
}

async function buildUpagrahaPack(params: {
  phase: BirthPhase;
  weekdayName: string;
  spanStartDT: any;
  spanEndDT: any;
  birth: BirthInput;
  natalAscendant: NatalAscendantInput;
  ruleFamily: RuleFamily;
  label: string;
}) {
  const {
    phase,
    weekdayName,
    spanStartDT,
    spanEndDT,
    birth,
    natalAscendant,
    ruleFamily,
    label,
  } = params;

  const gulikaRule = getRule(ruleFamily, weekdayName, "gulika");
  const mandiRule = getRule(ruleFamily, weekdayName, "mandi");
  const yamakantakaRule = getRule(ruleFamily, weekdayName, "yamakantaka");
  const kalaRule = getRule(ruleFamily, weekdayName, "kala");
  const mrityuRule = getRule(ruleFamily, weekdayName, "mrityu");
  const arthapraharaRule = getRule(ruleFamily, weekdayName, "arthaprahara");

  const [gulika, mandi, yamakantaka, kala, mrityu, arthaprahara] =
    await Promise.all([
      gulikaRule
        ? buildSegmentedUpagraha({
            key: "gulika",
            phase,
            weekdayName,
            spanStartDT,
            spanEndDT,
            birth,
            natalAscendant,
            ruleFamily,
            rule: gulikaRule,
          })
        : null,
      mandiRule
        ? buildSegmentedUpagraha({
            key: "mandi",
            phase,
            weekdayName,
            spanStartDT,
            spanEndDT,
            birth,
            natalAscendant,
            ruleFamily,
            rule: mandiRule,
          })
        : null,
      yamakantakaRule
        ? buildSegmentedUpagraha({
            key: "yamakantaka",
            phase,
            weekdayName,
            spanStartDT,
            spanEndDT,
            birth,
            natalAscendant,
            ruleFamily,
            rule: yamakantakaRule,
          })
        : null,
      kalaRule
        ? buildSegmentedUpagraha({
            key: "kala",
            phase,
            weekdayName,
            spanStartDT,
            spanEndDT,
            birth,
            natalAscendant,
            ruleFamily,
            rule: kalaRule,
          })
        : null,
      mrityuRule
        ? buildSegmentedUpagraha({
            key: "mrityu",
            phase,
            weekdayName,
            spanStartDT,
            spanEndDT,
            birth,
            natalAscendant,
            ruleFamily,
            rule: mrityuRule,
          })
        : null,
      arthapraharaRule
        ? buildSegmentedUpagraha({
            key: "arthaprahara",
            phase,
            weekdayName,
            spanStartDT,
            spanEndDT,
            birth,
            natalAscendant,
            ruleFamily,
            rule: arthapraharaRule,
          })
        : null,
    ]);

  const gulikaInterpretation = gulika
    ? buildGulikaInterpretation({
        sign: gulika.sign,
        houseFromAsc: gulika.houseFromAsc,
        nakshatra: gulika.nakshatra,
        phase,
      })
    : null;

  return {
    label,
    phase,
    spanStartISO: spanStartDT?.toISO?.() ?? null,
    spanEndISO: spanEndDT?.toISO?.() ?? null,
    gulika: gulika
      ? {
          ...gulika,
          interpretation: gulikaInterpretation,
        }
      : null,
    mandi,
    yamakantaka,
    kala,
    mrityu,
    arthaprahara,
    ardhaprahara: arthaprahara,
  };
}

function getRuleFamily(params: {
  birthPhaseAtBirth: BirthPhase;
  birthDT: any;
  sunriseDT: any;
}): RuleFamily {
  const { birthPhaseAtBirth, birthDT, sunriseDT } = params;

  if (birthPhaseAtBirth === "day") return "day";

  if (sunriseDT && birthDT < sunriseDT) {
    return "late_night";
  }

  return "early_night";
}

export async function buildUpagrahaData(params: {
  birth: BirthInput;
  natalAscendant: NatalAscendantInput;
}) {
  const { birth, natalAscendant } = params;

  const birthDT = DateTime.fromISO(`${birth.dateISO}T${birth.time}`, {
    zone: birth.timezone,
  });

  const emptyResponse = {
    methodId: "upagraha_rule_matrix_3family_debug_v1",
    traditionLabel: "Sarathi Upagraha Rule-Matrix 3-Family Debug",
    gulika: null,
    mandi: null,
    yamakantaka: null,
    kala: null,
    mrityu: null,
    arthaprahara: null,
    previousNightPack: null,
    dayPack: null,
    nextNightPack: null,
    debugSegments: [],
    debugDaySegments: [],
    debugPreviousNightSegments: [],
    debugNextNightSegments: [],
    debugMeta: null,
  };

  if (!birthDT.isValid) {
    return emptyResponse;
  }

  const solarTimes = await buildSolarTimes({
    dateISO: birth.dateISO,
    timezone: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
  });

  const sunriseDT = solarTimes?.sunriseDT ?? null;
  const sunsetDT = solarTimes?.sunsetDT ?? null;
  const previousSunsetDT = solarTimes?.previousSunsetDT ?? null;
  const nextSunriseDT = solarTimes?.nextSunriseDT ?? null;

  let birthPhaseAtBirth: BirthPhase | null = null;
  let activeSpanStartDT: any = null;
  let activeSpanEndDT: any = null;

  if (sunriseDT && sunsetDT && birthDT >= sunriseDT && birthDT < sunsetDT) {
    birthPhaseAtBirth = "day";
    activeSpanStartDT = sunriseDT;
    activeSpanEndDT = sunsetDT;
  } else if (sunsetDT && nextSunriseDT && birthDT >= sunsetDT) {
    birthPhaseAtBirth = "night";
    activeSpanStartDT = sunsetDT;
    activeSpanEndDT = nextSunriseDT;
  } else if (previousSunsetDT && sunriseDT && birthDT < sunriseDT) {
    birthPhaseAtBirth = "night";
    activeSpanStartDT = previousSunsetDT;
    activeSpanEndDT = sunriseDT;
  }

  if (!birthPhaseAtBirth || !activeSpanStartDT || !activeSpanEndDT) {
    return emptyResponse;
  }

  let operativeWeekday = birthDT.toFormat("cccc");

  if (birthPhaseAtBirth === "night" && sunriseDT && birthDT < sunriseDT) {
    operativeWeekday = birthDT.minus({ days: 1 }).toFormat("cccc");
  }

  const ruleFamily = getRuleFamily({
    birthPhaseAtBirth,
    birthDT,
    sunriseDT,
  });

  const selectedRulesForWeekday =
    ASTROSAGE_RULES[ruleFamily]?.[operativeWeekday] ?? null;

  if (!selectedRulesForWeekday) {
    return emptyResponse;
  }

  const dayDebugSegments =
    sunriseDT && sunsetDT
      ? await buildSegmentDebugTable({
          birth,
          natalAscendant,
          spanStartDT: sunriseDT,
          spanEndDT: sunsetDT,
        })
      : [];

  const previousNightDebugSegments =
    previousSunsetDT && sunriseDT
      ? await buildSegmentDebugTable({
          birth,
          natalAscendant,
          spanStartDT: previousSunsetDT,
          spanEndDT: sunriseDT,
        })
      : [];

  const nextNightDebugSegments =
    sunsetDT && nextSunriseDT
      ? await buildSegmentDebugTable({
          birth,
          natalAscendant,
          spanStartDT: sunsetDT,
          spanEndDT: nextSunriseDT,
        })
      : [];

  const debugSegments = await buildSegmentDebugTable({
    birth,
    natalAscendant,
    spanStartDT: activeSpanStartDT,
    spanEndDT: activeSpanEndDT,
  });

  const previousNightPack =
    previousSunsetDT && sunriseDT
      ? await buildUpagrahaPack({
          phase: "night",
          weekdayName: operativeWeekday,
          spanStartDT: previousSunsetDT,
          spanEndDT: sunriseDT,
          birth,
          natalAscendant,
          ruleFamily,
          label: "previous_night",
        })
      : null;

  const dayPack =
    sunriseDT && sunsetDT
      ? await buildUpagrahaPack({
          phase: "day",
          weekdayName: operativeWeekday,
          spanStartDT: sunriseDT,
          spanEndDT: sunsetDT,
          birth,
          natalAscendant,
          ruleFamily,
          label: "day",
        })
      : null;

  const nextNightPack =
    sunsetDT && nextSunriseDT
      ? await buildUpagrahaPack({
          phase: "night",
          weekdayName: operativeWeekday,
          spanStartDT: sunsetDT,
          spanEndDT: nextSunriseDT,
          birth,
          natalAscendant,
          ruleFamily,
          label: "next_night",
        })
      : null;
console.log("UPAGRAHA WEEKDAY DEBUG", {
  operativeWeekday,
  ruleFamily,
});
  const [gulika, mandi, yamakantaka, kala, mrityu, arthaprahara] =
    await Promise.all([
      buildRuledUpagraha({
        key: "gulika",
        birth,
        natalAscendant,
        ruleFamily,
        operativeWeekday,
        sunriseDT,
        sunsetDT,
        previousSunsetDT,
        nextSunriseDT,
      }),
      buildRuledUpagraha({
        key: "mandi",
        birth,
        natalAscendant,
        ruleFamily,
        operativeWeekday,
        sunriseDT,
        sunsetDT,
        previousSunsetDT,
        nextSunriseDT,
      }),
      buildRuledUpagraha({
        key: "yamakantaka",
        birth,
        natalAscendant,
        ruleFamily,
        operativeWeekday,
        sunriseDT,
        sunsetDT,
        previousSunsetDT,
        nextSunriseDT,
      }),
      buildRuledUpagraha({
        key: "kala",
        birth,
        natalAscendant,
        ruleFamily,
        operativeWeekday,
        sunriseDT,
        sunsetDT,
        previousSunsetDT,
        nextSunriseDT,
      }),
      buildRuledUpagraha({
        key: "mrityu",
        birth,
        natalAscendant,
        ruleFamily,
        operativeWeekday,
        sunriseDT,
        sunsetDT,
        previousSunsetDT,
        nextSunriseDT,
      }),
      buildRuledUpagraha({
        key: "arthaprahara",
        birth,
        natalAscendant,
        ruleFamily,
        operativeWeekday,
        sunriseDT,
        sunsetDT,
        previousSunsetDT,
        nextSunriseDT,
      }),
    ]);

  const gulikaWithInterpretation = gulika
    ? {
        ...gulika,
        interpretation: buildGulikaInterpretation({
          sign: gulika.sign,
          houseFromAsc: gulika.houseFromAsc,
          nakshatra: gulika.nakshatra,
          phase: gulika.phase,
        }),
      }
    : null;

  return {
    methodId: "upagraha_rule_matrix_3family_debug_v1",
    traditionLabel: "Sarathi Upagraha Rule-Matrix 3-Family Debug",

    gulika: gulikaWithInterpretation,
    mandi,
    yamakantaka,
    kala,
    mrityu,
    arthaprahara,
    ardhaprahara: arthaprahara,
    previousNightPack,
    dayPack,
    nextNightPack,

    debugMeta: {
      birthDateISO: birth.dateISO,
      birthTime: birth.time,
      timezone: birth.timezone,
      civilWeekday: birthDT.toFormat("cccc"),
      operativeWeekday,
      birthPhaseAtBirth,
      ruleFamily,
      activeBirthSpanStartISO: activeSpanStartDT?.toISO?.() ?? null,
      activeBirthSpanEndISO: activeSpanEndDT?.toISO?.() ?? null,
      selectedRulesForWeekday,
    },

    debugSegments,
    debugDaySegments: dayDebugSegments,
    debugPreviousNightSegments: previousNightDebugSegments,
    debugNextNightSegments: nextNightDebugSegments,
  };
}