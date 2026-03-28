import "server-only";

import type { BirthInput, DataEnginePlan } from "./types";
import { computeTransitPlanetsNow } from "@/server/astro/transits";
import { computeDailyMoonNakshatras } from "@/server/astro/sweDailyMoon";

type BuildTransitSnapshotParams = {
  birth: BirthInput;
  dateISO: string;
  natalAscendant: {
    sign: string;
    signNum: number;
    degree: number;
    house: number;
  };
  natalPlanets: Array<{
    planet: string;
    sign: string;
    signNum: number;
    degree: number;
    house: number;
  }>;
  plan: DataEnginePlan;
};

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

function houseFromLagna(lagnaSignNum: number, transitSignNum: number): number {
  return ((transitSignNum - lagnaSignNum + 12) % 12) + 1;
}

function toEngineBirth(birth: BirthInput) {
  return {
    dateISO: birth.dateISO,
    time: birth.time,
    tz: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
  };
}

function hhmmInTzForDate(dateISO: string, tz: string): string {
  const now = new Date(`${dateISO}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hh = parts.find((p) => p.type === "hour")?.value ?? "12";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hh}:${mm}`;
}

export async function buildTransitSnapshot(
  params: BuildTransitSnapshotParams
) {
  const { dateISO, natalAscendant, plan, birth } = params;

  const engineBirth = toEngineBirth(birth);

  // 1) Transit planets for the selected date
  const transitNowRaw = await computeTransitPlanetsNow(
    engineBirth,
    natalAscendant.sign,
    {
      dateISO,
      time: "12:00",
      tz: birth.timezone,
    }
  );

  const planets = (Array.isArray(transitNowRaw) ? transitNowRaw : []).map((p) => {
    const signNum = SIGN_TO_NUM[p.sign] ?? 0;

    return {
      planet: p.name,
      sign: p.sign,
      signNum,
      degree: Number((p.lon % 30).toFixed(2)),
      houseFromLagna:
        typeof p.house === "number"
          ? p.house
          : houseFromLagna(natalAscendant.signNum, signNum),
      retrograde: false, // current computeTransitPlanetsNow output does not expose retrograde
      nakshatra: undefined, // not returned from computeTransitPlanetsNow
      lon: p.lon,
    };
  });

  // 2) Daily Moon rows anchored on selected date
  const dailyMoon = await computeDailyMoonNakshatras(
    {
      dateISO: birth.dateISO,
      time: birth.time,
      baseDateISO: dateISO,
      baseTime: hhmmInTzForDate(dateISO, birth.timezone),
      tz: birth.timezone,
      lat: birth.lat,
      lon: birth.lon,
    },
    14
  );

  const firstMoon = Array.isArray(dailyMoon) && dailyMoon.length > 0
    ? dailyMoon[0]
    : null;

  return {
    dateISO,
    planets,
    moonToday: firstMoon
      ? {
          sign: null,
          signNum: null,
          degree: null,
          houseFromLagna: null,
          nakshatra: firstMoon.moonNakshatra ?? null,
          pada: null,
          houseFromMoon: firstMoon.houseFromMoon ?? null,
        }
      : {
          sign: null,
          signNum: null,
          degree: null,
          houseFromLagna: null,
          nakshatra: null,
          pada: null,
          houseFromMoon: null,
        },
    dailyMoon,
    ...(plan === "pro"
      ? {
          contacts: [],
        }
      : {}),
    sourceNote: `Real transit snapshot for ${dateISO}`,
  };
}