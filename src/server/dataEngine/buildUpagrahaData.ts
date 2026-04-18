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
  | "mrityu";

type BirthPhase = "day" | "night";

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

const UPAGRAHA_SLOT_MAP: Record<
  UpagrahaKey,
  Record<BirthPhase, Record<string, number>>
> = {
  gulika: {
    day: {
      Sunday: 7,
      Monday: 6,
      Tuesday: 5,
      Wednesday: 4,
      Thursday: 3,
      Friday: 2,
      Saturday: 1,
    },
    night: {
      Sunday: 6,
      Monday: 5,
      Tuesday: 4,
      Wednesday: 3,
      Thursday: 2,
      Friday: 1,
      Saturday: 7,
    },
  },

  mandi: {
    day: {
      Sunday: 7,
      Monday: 6,
      Tuesday: 5,
      Wednesday: 4,
      Thursday: 3,
      Friday: 2,
      Saturday: 1,
    },
    night: {
      Sunday: 6,
      Monday: 5,
      Tuesday: 4,
      Wednesday: 3,
      Thursday: 2,
      Friday: 1,
      Saturday: 7,
    },
  },

  yamakantaka: {
    day: {
      Sunday: 5,
      Monday: 4,
      Tuesday: 3,
      Wednesday: 2,
      Thursday: 1,
      Friday: 7,
      Saturday: 6,
    },
    night: {
      Sunday: 4,
      Monday: 3,
      Tuesday: 2,
      Wednesday: 1,
      Thursday: 7,
      Friday: 6,
      Saturday: 5,
    },
  },

  kala: {
    day: {
      Sunday: 6,
      Monday: 5,
      Tuesday: 4,
      Wednesday: 3,
      Thursday: 2,
      Friday: 1,
      Saturday: 7,
    },
    night: {
      Sunday: 5,
      Monday: 4,
      Tuesday: 3,
      Wednesday: 2,
      Thursday: 1,
      Friday: 7,
      Saturday: 6,
    },
  },

  mrityu: {
    day: {
      Sunday: 2,
      Monday: 1,
      Tuesday: 7,
      Wednesday: 6,
      Thursday: 5,
      Friday: 4,
      Saturday: 3,
    },
    night: {
      Sunday: 1,
      Monday: 7,
      Tuesday: 6,
      Wednesday: 5,
      Thursday: 4,
      Friday: 3,
      Saturday: 2,
    },
  },
};

const UPAGRAHA_POINT_MOMENT_TYPE: Record<
  UpagrahaKey,
  "start" | "midpoint"
> = {
  gulika: "start",
  mandi: "midpoint",
  yamakantaka: "start",
  kala: "start",
  mrityu: "start",
};

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
    Taurus: "Acts through endurance, material attachment, stability pressure, and stubborn persistence.",
    Gemini: "Acts through speech, nervous intensity, duality, and mental restlessness.",
    Cancer: "Acts through emotional sensitivity, protection patterns, memory, and mood-based defensiveness.",
    Leo: "Acts through pride, visibility, authority themes, and wounded self-expression.",
    Virgo: "Acts through analysis, worry, correction, service, and perfection pressure.",
    Libra: "Acts through relationships, fairness tensions, diplomacy, and social balancing.",
    Scorpio: "Acts through secrecy, control, survival instinct, emotional intensity, and deep karmic pressure.",
    Sagittarius: "Acts through ideology, principles, teaching, morality, and directional conviction.",
    Capricorn: "Acts through burden, discipline, delay, endurance, status, and realism.",
    Aquarius: "Acts through detachment, systems, social distance, unconventional thinking, and pressure through networks.",
    Pisces: "Acts through sensitivity, withdrawal, dissolution, compassion, and hidden emotional load.",
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
    houseFromAsc ? `in the ${houseFromAsc}${getOrdinalSuffix(houseFromAsc)} house` : null,
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
    caution = "Watch pressure patterns in speech, initiative, sibling dynamics, and reactive communication.";
  } else if (houseFromAsc === 6) {
    caution = "Strong placement for struggle-management, but health, conflict, and debt themes need careful handling.";
  } else if (houseFromAsc === 8) {
    caution = "Handle crisis, secrecy, emotional intensity, and hidden vulnerability with maturity.";
  } else if (houseFromAsc === 12) {
    caution = "Pay attention to isolation, sleep, hidden stress, and loss-producing habits.";
  } else if (houseFromAsc === 10) {
    caution = "Career pressure may become karmically defining; discipline matters more than image.";
  } else {
    caution = "This placement should be judged carefully with Saturn, the 8th house, Moon, and the dasha context.";
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

function getUpagrahaSlot(
  key: UpagrahaKey,
  phase: BirthPhase,
  weekdayName: string
): number | null {
  return UPAGRAHA_SLOT_MAP[key]?.[phase]?.[weekdayName] ?? null;
}

async function buildPointFromSegment(params: {
  segment: any;
  birth: BirthInput;
  natalAscendant: NatalAscendantInput;
  pointMomentType?: "start" | "midpoint";
}) {
  const pointMomentType = params.pointMomentType ?? "start";

  const pointMomentDT =
    pointMomentType === "midpoint"
      ? params.segment?.midpointDT ?? null
      : params.segment?.startDT ?? null;

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
}) {
  const {
    key,
    phase,
    weekdayName,
    spanStartDT,
    spanEndDT,
    birth,
    natalAscendant,
  } = params;

  const segmentIndex = getUpagrahaSlot(key, phase, weekdayName);
  if (!segmentIndex) return null;

  const segments = buildEightSegments(spanStartDT, spanEndDT);
  const chosenSegment =
    segments.find((s: any) => s.index === segmentIndex) ?? null;

  if (!chosenSegment?.startDT?.isValid) return null;

  const pointMomentType = UPAGRAHA_POINT_MOMENT_TYPE[key];

  const point = await buildPointFromSegment({
    segment: chosenSegment,
    birth,
    natalAscendant,
    pointMomentType,
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
    },
  };
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
    methodId: "upagraha_v3_segmented_multi_point",
    traditionLabel:
      "Sarathi Classical Upagraha (Segmented Day/Night Multi-Point)",
    gulika: null,
    mandi: null,
    yamakantaka: null,
    kala: null,
    mrityu: null,
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

  const weekdayName = birthDT.toFormat("cccc");

  let phase: BirthPhase | null = null;
  let spanStartDT: any = null;
  let spanEndDT: any = null;

  if (sunriseDT && sunsetDT && birthDT >= sunriseDT && birthDT < sunsetDT) {
    phase = "day";
    spanStartDT = sunriseDT;
    spanEndDT = sunsetDT;
  } else if (sunsetDT && nextSunriseDT && birthDT >= sunsetDT) {
    phase = "night";
    spanStartDT = sunsetDT;
    spanEndDT = nextSunriseDT;
  } else if (previousSunsetDT && sunriseDT && birthDT < sunriseDT) {
    phase = "night";
    spanStartDT = previousSunsetDT;
    spanEndDT = sunriseDT;
  }

  if (!phase || !spanStartDT || !spanEndDT) {
    return emptyResponse;
  }

  const [gulika, mandi, yamakantaka, kala, mrityu] = await Promise.all([
    buildSegmentedUpagraha({
      key: "gulika",
      phase,
      weekdayName,
      spanStartDT,
      spanEndDT,
      birth,
      natalAscendant,
    }),
    buildSegmentedUpagraha({
      key: "mandi",
      phase,
      weekdayName,
      spanStartDT,
      spanEndDT,
      birth,
      natalAscendant,
    }),
    buildSegmentedUpagraha({
      key: "yamakantaka",
      phase,
      weekdayName,
      spanStartDT,
      spanEndDT,
      birth,
      natalAscendant,
    }),
    buildSegmentedUpagraha({
      key: "kala",
      phase,
      weekdayName,
      spanStartDT,
      spanEndDT,
      birth,
      natalAscendant,
    }),
    buildSegmentedUpagraha({
      key: "mrityu",
      phase,
      weekdayName,
      spanStartDT,
      spanEndDT,
      birth,
      natalAscendant,
    }),
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
    methodId: "upagraha_v3_segmented_multi_point",
    traditionLabel:
      "Sarathi Classical Upagraha (Segmented Day/Night Multi-Point)",

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
  };
}