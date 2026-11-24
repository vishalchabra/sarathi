import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import {
  sweJulday,
  sweCalcUt,
  sweGetLahiriAyanamsaUt,
  getSwissHouseCusps,
} from "@/server/astro/swe-wasm";
import { buildAvakhada } from "@/server/dataEngine/buildAvakhada";
import { buildGunaMilan } from "@/lib/astrology/matchmaking/buildGunaMilan";
import {
  buildMangalDoshaData,
  buildMangalCancellationData,
} from "@/lib/astrology/matchmaking/buildMangalDosha";

export const runtime = "nodejs";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini",
  "Mrigashira", "Ardra", "Punarvasu", "Pushya",
  "Ashlesha", "Magha", "PurvaPhalguni",
  "UttaraPhalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula",
  "PurvaAshadha", "UttaraAshadha", "Shravana",
  "Dhanishta", "Shatabhisha", "PurvaBhadrapada",
  "UttaraBhadrapada", "Revati",
];

type Birth = {
  dateISO: string;
  time: string;
  timezone: string;
  lat: number;
  lon: number;
};

function validBirth(value: unknown): value is Birth {
  if (!value || typeof value !== "object") return false;

  const b = value as Partial<Birth>;

  if (
    typeof b.dateISO !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(b.dateISO) ||
    typeof b.time !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time) ||
    typeof b.timezone !== "string" ||
    b.timezone.length > 100 ||
    typeof b.lat !== "number" ||
    !Number.isFinite(b.lat) ||
    b.lat < -90 ||
    b.lat > 90 ||
    typeof b.lon !== "number" ||
    !Number.isFinite(b.lon) ||
    b.lon < -180 ||
    b.lon > 180
  ) {
    return false;
  }

  const dt = DateTime.fromISO(
    `${b.dateISO}T${b.time}`,
    { zone: b.timezone, setZone: true }
  );

  return (
    dt.isValid &&
    dt.toFormat("yyyy-MM-dd") === b.dateISO &&
    dt.toFormat("HH:mm") === b.time
  );
}

function wrap360(value: number) {
  return ((value % 360) + 360) % 360;
}

async function calculateMoon(birth: Birth) {
  const local = DateTime.fromISO(
    `${birth.dateISO}T${birth.time}`,
    { zone: birth.timezone, setZone: true }
  );

  const utc = local.toUTC();

  const hour =
    utc.hour +
    utc.minute / 60 +
    utc.second / 3600 +
    utc.millisecond / 3600000;

  const jd = await sweJulday(
    utc.year,
    utc.month,
    utc.day,
    hour
  );

  const result = await sweCalcUt(jd, 1, 0);
  const ayanamsa = Number(await sweGetLahiriAyanamsaUt(jd));

  const tropical = Number(
    Array.isArray(result)
      ? result[0]
      : result?.longitude
  );

  if (
    !Number.isFinite(tropical) ||
    !Number.isFinite(ayanamsa)
  ) {
    throw new Error("Invalid Moon ephemeris result");
  }

  const longitude = wrap360(tropical - ayanamsa);
  const nakshatraIndex = Math.floor(longitude / (360 / 27));
  const nakshatraOffset = longitude % (360 / 27);
  const pada = Math.min(
    4,
    Math.floor(nakshatraOffset / (360 / 108)) + 1
  );

  const sign = SIGNS[Math.floor(longitude / 30)];
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  if (!sign || !nakshatra) {
    throw new Error("Unable to determine Moon nakshatra");
  }

  const avakhada = buildAvakhada({
    natalPlanets: [{
      planet: "Moon",
      sign,
      nakshatra,
      pada,
    }],
  });

  if (
    !avakhada ||
    [avakhada.gana, avakhada.yoni, avakhada.nadi, avakhada.varna]
      .some((value) => !value || value === "—")
  ) {
    throw new Error("Unable to determine matching attributes");
  }

  const houses = await getSwissHouseCusps({
    jdUt: jd,
    lat: birth.lat,
    lon: birth.lon,
    houseSystem: "W",
    sidereal: false,
  });

  const ascLongitude = wrap360(
    houses.ascendant - ayanamsa
  );

  const ascIndex = Math.floor(ascLongitude / 30);
  const ascSign = SIGNS[ascIndex];

  function makePlacement(
    planet: string,
    lon: number
  ) {
    const signIndex = Math.floor(lon / 30);

    return {
      planet,
      sign: SIGNS[signIndex],
      longitude: lon,
      degree: lon % 30,
      house: ((signIndex - ascIndex + 12) % 12) + 1,
      nakshatra: NAKSHATRAS[
        Math.floor(lon / (360 / 27))
      ],
      pada: Math.min(
        4,
        Math.floor(
          (lon % (360 / 27)) / (360 / 108)
        ) + 1
      ),
    };
  }

  async function calculatePlanet(
    planet: string,
    planetId: number
  ) {
    const result = await sweCalcUt(jd, planetId, 0);

    const tropical = Number(
      Array.isArray(result)
        ? result[0]
        : result?.longitude
    );

    if (!Number.isFinite(tropical)) {
      throw new Error(
        `Invalid ${planet} ephemeris result`
      );
    }

    return makePlacement(
      planet,
      wrap360(tropical - ayanamsa)
    );
  }

  const planets = [
    makePlacement("Moon", longitude),
    await calculatePlanet("Mars", 4),
    await calculatePlanet("Venus", 3),
    await calculatePlanet("Jupiter", 5),
  ];

  const ascendant = {
    sign: ascSign,
    longitude: ascLongitude,
    degree: ascLongitude % 30,
  };

  const chartData = {
    foundations: {
      ascendant,
      natal: { planets },
    },
  };

  const mangalDosha = buildMangalDoshaData(chartData);

  const mangalCancellation =
    buildMangalCancellationData(
      chartData,
      mangalDosha
    );

  return {
    sign,
    nakshatra,
    pada,
    longitude,
    avakhada,
    ascendant,
    planets,
    mangalDosha,
    mangalCancellation,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (
      !validBirth(body?.groom) ||
      !validBirth(body?.bride)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid groom or bride birth details.",
        },
        { status: 400 }
      );
    }

    const [groom, bride] = await Promise.all([
      calculateMoon(body.groom),
      calculateMoon(body.bride),
    ]);

    const matching = buildGunaMilan({
      personAAvakhada: groom.avakhada,
      personBAvakhada: bride.avakhada,
    });

    return NextResponse.json(
      {
        ok: true,
        groom,
        bride,
        matching,
        method: "Traditional Ashtakoota Guna Milan",
        maximumScore: 36,
        note: "Traditional astrological compatibility is not a scientific predictor of relationship success.",
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Free Kundli Matching error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to calculate Kundli Matching.",
      },
      { status: 500 }
    );
  }
}
