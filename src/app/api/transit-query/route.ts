import { NextResponse } from "next/server";
import { computeTransitPlanetsNow } from "@/server/astro/transits";

export const runtime = "nodejs";

const SIGN_NAMES = [
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
] as const;

const NAKSHATRAS_27 = [
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
];

function wrap360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

function signFromLongitude(lon: number | null | undefined) {
  if (typeof lon !== "number" || !Number.isFinite(lon)) {
    return { sign: "", signNum: 0, degree: null };
  }

  const normalized = wrap360(lon);
  const signIndex = Math.floor(normalized / 30);
  const sign = SIGN_NAMES[signIndex] ?? "";
  const signNum = signIndex + 1;
  const degree = Number((normalized % 30).toFixed(2));

  return { sign, signNum, degree };
}

function getNakshatraFromLon(lon: number | null | undefined) {
  if (typeof lon !== "number" || !Number.isFinite(lon)) return null;
  const idx = Math.floor(wrap360(lon) / (360 / 27));
  return NAKSHATRAS_27[idx] ?? null;
}

function getPadaFromLon(lon: number | null | undefined) {
  if (typeof lon !== "number" || !Number.isFinite(lon)) return null;
  const nakSegment = 360 / 27;
  const withinNak = wrap360(lon) % nakSegment;
  return Math.floor(withinNak / (nakSegment / 4)) + 1;
}

function degreeMatches(actual: number | null | undefined, target: number, orb: number) {
  if (actual === null || actual === undefined || Number.isNaN(Number(actual))) return false;
  return Math.abs(Number(actual) - target) <= orb;
}

function addHours(base: Date, hours: number) {
  return new Date(base.getTime() + hours * 60 * 60 * 1000);
}

function toDateISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function toHHMM(d: Date) {
  return d.toISOString().slice(11, 16);
}

function daysBetweenISO(startISO: string, endISO: string) {
  const start = new Date(`${startISO}T00:00:00Z`).getTime();
  const end = new Date(`${endISO}T00:00:00Z`).getTime();
  return Math.floor((end - start) / 86400000);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const birth = body?.birth;
    const fromISO = String(body?.fromISO ?? "");
    const toISO = String(body?.toISO ?? "");
    const conditions = Array.isArray(body?.conditions) ? body.conditions : [];

    if (!birth?.dateISO || !birth?.time || !birth?.timezone) {
      return NextResponse.json(
        { ok: false, error: "Missing birth details." },
        { status: 400 }
      );
    }

    if (!fromISO || !toISO) {
      return NextResponse.json(
        { ok: false, error: "Please provide from and to dates." },
        { status: 400 }
      );
    }

    const activeConditions = conditions.filter((row: any) => row?.enabled !== false);

    if (!activeConditions.length) {
      return NextResponse.json(
        { ok: false, error: "Please enable at least one condition." },
        { status: 400 }
      );
    }

    const rangeDays = daysBetweenISO(fromISO, toISO);

    if (rangeDays < 0) {
      return NextResponse.json(
        { ok: false, error: "To date must be after from date." },
        { status: 400 }
      );
    }

    if (rangeDays > 180) {
      return NextResponse.json(
        { ok: false, error: "Please search maximum 180 days at a time." },
        { status: 400 }
      );
    }

    const hasMoon = activeConditions.some((row: any) => row?.planet === "Moon");
    const stepHours = hasMoon ? 1 : 6;

    const start = new Date(`${fromISO}T00:00:00Z`);
    const totalHours = rangeDays * 24 + 23;

    const matches: any[] = [];
    let lastMatchKey = "";

    for (let hour = 0; hour <= totalHours; hour += stepHours) {
      const scanDate = addHours(start, hour);
      const dateISO = toDateISO(scanDate);
      const time = toHHMM(scanDate);

      const raw = await computeTransitPlanetsNow(
        {
          dateISO: birth.dateISO,
          time: birth.time,
          tz: birth.timezone,
          lat: Number(birth.lat),
          lon: Number(birth.lon),
        },
        "Aries",
        {
          dateISO,
          time,
          tz: birth.timezone,
        }
      );

      const transitPlanets = (Array.isArray(raw) ? raw : []).map((p: any) => {
        const planet = String(p?.name ?? p?.planet ?? "").trim();
        const lon = typeof p?.lon === "number" ? p.lon : null;
        const derived = signFromLongitude(lon);

        return {
          planet,
          lon,
          sign: derived.sign,
          signNum: derived.signNum,
          degree: derived.degree,
          retrograde:
            typeof p?.retrograde === "boolean"
              ? p.retrograde
              : planet === "Rahu" || planet === "Ketu",
          nakshatra: getNakshatraFromLon(lon),
          pada: getPadaFromLon(lon),
        };
      });
     const natalPlanets = Array.isArray(body?.natalPlanets)
  ? body.natalPlanets
  : [];
    const matchedPlanets = activeConditions
  .map((condition: any) => {
    const row = transitPlanets.find(
      (p: any) => String(p?.planet) === String(condition?.planet)
    );

    if (!row) return null;

    const conditionType = String(condition?.conditionType ?? "sign_degree");

    if (conditionType === "sign_degree") {
      const targetDegree =
        Number(condition?.degree || 0) + Number(condition?.minute || 0) / 60;

      const orb = Number(condition?.orb || 0);
      const sameSign = String(row.sign) === String(condition?.sign);
      const sameDegree = degreeMatches(row.degree, targetDegree, orb);

      if (!sameSign || !sameDegree) return null;

      return {
        conditionType,
        planet: row.planet,
        sign: row.sign,
        degree: row.degree,
        targetDegree,
        orb,
        nakshatra: row.nakshatra,
        pada: row.pada,
        retrograde: row.retrograde,
      };
    }

    if (conditionType === "nakshatra") {
      if (String(row.nakshatra) !== String(condition?.nakshatra)) return null;

      return {
        conditionType,
        planet: row.planet,
        sign: row.sign,
        degree: row.degree,
        targetDegree: row.degree,
        orb: 0,
        nakshatra: row.nakshatra,
        pada: row.pada,
        retrograde: row.retrograde,
      };
    }

    if (conditionType === "retrograde") {
      if (!row.retrograde) return null;

      return {
        conditionType,
        planet: row.planet,
        sign: row.sign,
        degree: row.degree,
        targetDegree: row.degree,
        orb: 0,
        nakshatra: row.nakshatra,
        pada: row.pada,
        retrograde: row.retrograde,
      };
    }

    if (conditionType === "same_sign_as") {
      const other = transitPlanets.find(
        (p: any) => String(p?.planet) === String(condition?.comparePlanet)
      );

      if (!other) return null;
      if (String(row.sign) !== String(other.sign)) return null;

      return {
        conditionType,
        planet: row.planet,
        sign: row.sign,
        degree: row.degree,
        targetDegree: row.degree,
        orb: 0,
        nakshatra: row.nakshatra,
        pada: row.pada,
        retrograde: row.retrograde,
        comparePlanet: other.planet,
      };
    }

    if (conditionType === "conjunct_natal") {
      const natal = natalPlanets.find(
        (p: any) => String(p?.planet) === String(condition?.natalPlanet)
      );

      if (!natal) return null;

      const natalLon =
        typeof natal?.lon === "number"
          ? natal.lon
          : typeof natal?.longitude === "number"
          ? natal.longitude
          : typeof natal?.signNum === "number" && typeof natal?.degree === "number"
          ? (Number(natal.signNum) - 1) * 30 + Number(natal.degree)
          : null;

      if (typeof natalLon !== "number") return null;

      const orb = Number(condition?.orb || 1);
      const diff = Math.abs(wrap360(row.lon - natalLon));
      const shortestDiff = Math.min(diff, 360 - diff);

      if (shortestDiff > orb) return null;

      return {
        conditionType,
        planet: row.planet,
        sign: row.sign,
        degree: row.degree,
        targetDegree: Number((natalLon % 30).toFixed(2)),
        orb,
        nakshatra: row.nakshatra,
        pada: row.pada,
        retrograde: row.retrograde,
        natalPlanet: condition?.natalPlanet,
        natalOrb: Number(shortestDiff.toFixed(2)),
      };
    }

    return null;
  })
  .filter(Boolean);

      if (matchedPlanets.length === activeConditions.length) {
        const matchKey = `${dateISO}-${matchedPlanets
          .map((p: any) => `${p.planet}-${Math.round(Number(p.degree ?? 0))}`)
          .join("-")}`;

        if (matchKey !== lastMatchKey) {
          matches.push({
            dateISO,
            time,
            matchedPlanets,
          });

          lastMatchKey = matchKey;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      fromISO,
      toISO,
      stepHours,
      matches,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Transit query failed." },
      { status: 500 }
    );
  }
}