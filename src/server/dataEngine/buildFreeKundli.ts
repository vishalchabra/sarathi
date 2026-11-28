import "server-only";

import { DateTime } from "luxon";
import type { BirthInput } from "./types";
import { getAscendant } from "@/server/astro/asc";
import { computePlacements } from "@/server/astro/placements";
import {
  calculateNatalLunarNodes,
  resolveNodeMode,
  type NodeMode,
} from "../astro/lunarNodes";
import { buildVargaData } from "./buildVargaData";
import { buildDashaData } from "./buildDashaData";
import { buildPanchangData } from "./buildPanchangData";
import { buildAvakhada } from "./buildAvakhada";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon",
  "Sun", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const CLASSICAL_PLANETS = [
  "Sun", "Moon", "Mars", "Mercury",
  "Jupiter", "Venus", "Saturn", "Rahu", "Ketu",
];

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
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

function getNakshatraAndPadaFromLon(lon: number | null | undefined) {
  if (typeof lon !== "number" || Number.isNaN(lon)) {
    return { nakshatra: null, pada: null };
  }

  const x = ((lon % 360) + 360) % 360;
  const nakSpan = 360 / 27; // 13°20'
  const idx = Math.floor(x / nakSpan);
  const withinNak = x % nakSpan;
  const pada = Math.floor(withinNak / (nakSpan / 4)) + 1;

  return {
    nakshatra: NAKSHATRA_NAMES[idx] ?? null,
    pada,
  };
}

function normalizeLongitude(lon: number) {
  return ((lon % 360) + 360) % 360;
}

export async function buildFreeKundli(
  birth: BirthInput,
  requestedNodeMode: NodeMode = "mean"
) {
  const nodeMode = resolveNodeMode(requestedNodeMode);
  const birthDT = DateTime.fromISO(
    `${birth.dateISO}T${birth.time}`,
    { zone: birth.timezone }
  );

  if (!birthDT.isValid) {
    throw new Error("Invalid birth date, time or timezone.");
  }

  const birthUTCISO = birthDT.toUTC().toISO();

  if (!birthUTCISO) {
    throw new Error("Unable to determine birth UTC time.");
  }

  const input = {
    dateISO: birth.dateISO,
    time: birth.time,
    tz: birth.timezone,
    lat: birth.lat,
    lon: birth.lon,
  };

  const asc = await getAscendant(input);
  const nodeLons = await calculateNatalLunarNodes(birth, nodeMode);
  const rawPlacements = await computePlacements(input, nodeMode);

  if (!asc || typeof asc.lon !== "number" || !Number.isFinite(asc.lon)) {
    throw new Error("Ascendant calculation failed.");
  }

  const ascLon = normalizeLongitude(asc.lon);
  const ascIndex = Math.floor(ascLon / 30);
  const ascNak = getNakshatraAndPadaFromLon(ascLon);

  const ascendant = {
    sign: SIGNS[ascIndex],
    signNum: ascIndex + 1,
    degree: Number((ascLon % 30).toFixed(2)),
    lon: ascLon,
    longitude: ascLon,
    house: 1,
    lord: SIGN_LORDS[ascIndex],
    nakshatra: ascNak.nakshatra,
    pada: ascNak.pada,
  };

  const planets = rawPlacements
    .filter((p: any) => CLASSICAL_PLANETS.includes(p.planet))
    .map((p: any) => {
      const isNode = p.planet === "Rahu" || p.planet === "Ketu";

      const rawLon =
        p.planet === "Rahu"
          ? nodeLons.rahuLonSid
          : p.planet === "Ketu"
          ? nodeLons.ketuLonSid
          : p.lon;

      if (typeof rawLon !== "number" || !Number.isFinite(rawLon)) {
        throw new Error(`Invalid longitude for ${p.planet}`);
      }

      const lon = normalizeLongitude(rawLon);
      const signIndex = Math.floor(lon / 30);
      const nak = getNakshatraAndPadaFromLon(lon);

      const speed =
        isNode
          ? nodeLons.speedLon
          : typeof p.speed === "number"
          ? p.speed
          : typeof p.speedLon === "number"
          ? p.speedLon
          : typeof p.longitudeSpeed === "number"
          ? p.longitudeSpeed
          : null;

      return {
        planet: p.planet,
        sign: SIGNS[signIndex],
        signNum: signIndex + 1,
        signLord: SIGN_LORDS[signIndex],
        lon,
        longitude: lon,
        degree: Number((lon % 30).toFixed(2)),
        house: ((signIndex - ascIndex + 12) % 12) + 1,
        nakshatra: nak.nakshatra,
        pada: nak.pada,
        speed,
        retrograde:
          isNode
            ? nodeLons.retrograde
            : p.planet === "Sun" || p.planet === "Moon"
            ? false
            : typeof speed === "number"
            ? speed < 0
            : Boolean(p.retrograde),
      };
    });

  if (
    planets.length !== 9 ||
    CLASSICAL_PLANETS.some(
      name => !planets.some(p => p.planet === name)
    )
  ) {
    throw new Error("Incomplete natal planetary positions.");
  }

  const moon = planets.find(p => p.planet === "Moon");

  if (!moon) {
    throw new Error("Natal Moon calculation failed.");
  }

  const natal = {
    nodeMode: nodeLons.nodeMode,
    nodeCalculationVersion: nodeLons.calculationVersion,
    ayanamsa: "Lahiri",
    birthUTCISO,
    moonLonSidDeg: moon.lon,
    ascendant,
    planets,
  };

  const selectedDateISO =
    DateTime.now().setZone(birth.timezone).toISODate() ??
    new Date().toISOString().slice(0, 10);

  const [vargas, panchang, dasha] = await Promise.all([
    buildVargaData({
      birth,
      plan: "light",
      natalPlanets: planets,
      natalAscendant: ascendant,
    }),

    buildPanchangData({
      dateISO: birth.dateISO,
      time: birth.time,
      timezone: birth.timezone,
      lat: birth.lat,
      lon: birth.lon,
      transitNow: null,
    }),

    buildDashaData({
      birth,
      selectedDateISO,
      plan: "light",
      natal: {
        birthUTCISO,
        moonLonSidDeg: moon.lon,
      },
    }),
  ]);

  const avakhada = buildAvakhada({
    natalPlanets: planets,
  });

  return {
    ok: true,
    method: {
      zodiac: "Sidereal",
      ayanamsa: "Lahiri",
      houseSystem: "Whole Sign",
      nodeType: nodeMode === "mean" ? "Mean Node" : "True Node",
      nodeMode,
      nodeCalculationVersion: nodeLons.calculationVersion,
    },
    birth,
    natal,
    vargas: {
      d9: vargas.d9,
    },
    panchang,
    avakhada,
    dasha: {
      current: dasha.current,
      timelines: {
        md: dasha.timelines.md,
        adInCurrentMd: dasha.timelines.adInCurrentMd,
      },
    },
  };
}