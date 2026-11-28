import { NextResponse } from "next/server";
import { DateTime, IANAZone } from "luxon";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { computeTransitPlanetsNow } from "@/server/astro/transits";
import { computePlacements } from "@/server/astro/placements";

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
  const degree = normalized % 30;

  return { sign, signNum, degree };
}

function getNakshatraPadaIndex(
  lon: number | null | undefined
): number | null {
  if (
    typeof lon !== "number" ||
    !Number.isFinite(lon)
  ) return null;

  const normalized = wrap360(lon);

  // Correct floating-point rounding at exact pada boundaries.
  let index = Math.min(
    107,
    Math.floor((normalized * 108) / 360)
  );

  // Compare against the canonical boundary longitude.
  while (
    index < 107 &&
    normalized >= ((index + 1) * 360) / 108
  ) {
    index++;
  }

  while (
    index > 0 &&
    normalized < (index * 360) / 108
  ) {
    index--;
  }

  return index;
}

function getNakshatraFromLon(
  lon: number | null | undefined
) {
  const index = getNakshatraPadaIndex(lon);

  if (index === null) return null;

  return NAKSHATRAS_27[Math.floor(index / 4)] ?? null;
}

function getPadaFromLon(
  lon: number | null | undefined
) {
  const index = getNakshatraPadaIndex(lon);

  if (index === null) return null;

  return (index % 4) + 1;
}

function degreeMatches(actual: number | null | undefined, target: number, orb: number) {
  if (actual === null || actual === undefined || Number.isNaN(Number(actual))) return false;
  return Math.abs(Number(actual) - target) <= orb;
}

function daysBetweenISO(startISO: string, endISO: string) {
  const start = new Date(`${startISO}T00:00:00Z`).getTime();
  const end = new Date(`${endISO}T00:00:00Z`).getTime();
  return Math.floor((end - start) / 86400000);
}

import { NODE_CALCULATION_VERSION } from "@/server/astro/lunarNodes";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const authorization = req.headers.get("authorization");

    const bearerToken = /^Bearer\s+(\S+)$/i.exec(
      authorization ?? ""
    )?.[1];

    let user = null;

    // Mobile authentication using a verified bearer token.
    if (authorization !== null) {
      if (bearerToken) {
        const {
          data: { user: tokenUser },
          error: tokenError,
        } = await supabase.auth.getUser(bearerToken);

        if (!tokenError) {
          user = tokenUser;
        }
      }
    } else {
      // Existing website cookie-based authentication.
      const {
        data: { user: cookieUser },
        error: cookieError,
      } = await supabase.auth.getUser();

      if (!cookieError) {
        user = cookieUser;
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          reason: "not_authenticated",
          error: "You must sign in to use Transit Query.",
        },
        { status: 401 }
      );
    }

    // Preserve the authenticated user's context for RLS.
    const entitlementClient = bearerToken
      ? createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
              },
            },
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            },
          }
        )
      : supabase;

    const entitlements = await getUserEntitlements(
      user.id,
      entitlementClient
    );

    if (!entitlements.dataEngine.allowed) {
      return NextResponse.json(
        {
          ok: false,
          reason: "data_engine_access_required",
          error: "Your account does not have access to Transit Query.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const badRequest = (error: string) =>
      NextResponse.json(
        { ok: false, error },
        { status: 400 }
      );

    const validDate = (value: unknown): value is string =>
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      DateTime.fromISO(value, { zone: "UTC" }).isValid;

    const validTime = (value: unknown): value is string =>
      typeof value === "string" &&
      /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);

    const validNumber = (
      value: unknown,
      min: number,
      max: number
    ): boolean => {
      if (
        typeof value !== "number" &&
        typeof value !== "string"
      ) return false;

      if (
        typeof value === "string" &&
        value.trim() === ""
      ) return false;

      const n = Number(value);

      return Number.isFinite(n) && n >= min && n <= max;
    };

    const supportedPlanets = new Set([
      "Sun", "Moon", "Mars", "Mercury",
      "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
    ]);

    const requestedNodeMode = body?.nodeMode;

    if (
      requestedNodeMode !== undefined &&
      requestedNodeMode !== null &&
      requestedNodeMode !== "mean" &&
      requestedNodeMode !== "true"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid lunar node convention.",
        },
        { status: 400 }
      );
    }

    const nodeMode: "mean" | "true" =
      requestedNodeMode ?? "mean";

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

    if (!validDate(birth.dateISO)) {
      return badRequest("Invalid birth date.");
    }

    if (!validTime(birth.time)) {
      return badRequest("Invalid birth time.");
    }

    if (
      typeof birth.timezone !== "string" ||
      !IANAZone.isValidZone(birth.timezone)
    ) {
      return badRequest("Invalid birth timezone.");
    }

    if (!validNumber(birth.lat, -90, 90)) {
      return badRequest("Invalid birth latitude.");
    }

    if (!validNumber(birth.lon, -180, 180)) {
      return badRequest("Invalid birth longitude.");
    }

    if (!validDate(fromISO) || !validDate(toISO)) {
      return badRequest("Invalid search dates.");
    }

    if (
      conditions.some(
        (row: any) =>
          !row ||
          typeof row !== "object" ||
          Array.isArray(row)
      )
    ) {
      return badRequest("Invalid search condition.");
    }

    if (conditions.length > 50) {
      return badRequest("Too many search conditions.");
    }

    const activeConditions = conditions.filter(
      (row: any) => row?.enabled !== false
    );

    for (const condition of activeConditions) {
      if (!supportedPlanets.has(condition.planet)) {
        return badRequest("Unsupported transit planet.");
      }

      const conditionType =
        condition.conditionType ?? "sign_degree";

      switch (conditionType) {
        case "sign_degree":
          if (!SIGN_NAMES.includes(condition.sign)) {
            return badRequest("Invalid target sign.");
          }

          if (
            !validNumber(condition.degree ?? 0, 0, 29) ||
            !Number.isInteger(Number(condition.degree ?? 0)) ||
            !validNumber(condition.minute ?? 0, 0, 59) ||
            !Number.isInteger(Number(condition.minute ?? 0)) ||
            !validNumber(condition.orb ?? 0, 0, 30)
          ) {
            return badRequest("Invalid degree, minute or orb.");
          }
          break;

        case "nakshatra":
          if (
            typeof condition.nakshatra !== "string" ||
            !NAKSHATRAS_27.includes(condition.nakshatra)
          ) {
            return badRequest("Invalid target nakshatra.");
          }
          break;

        case "retrograde":
          break;

        case "same_sign_as":
          if (!supportedPlanets.has(condition.comparePlanet)) {
            return badRequest("Invalid comparison planet.");
          }
          break;

        case "conjunct_natal":
          if (!supportedPlanets.has(condition.natalPlanet)) {
            return badRequest("Invalid natal conjunction target.");
          }

          if (!validNumber(condition.orb ?? 1, 0, 180)) {
            return badRequest("Invalid conjunction orb.");
          }
          break;

        default:
          return badRequest("Unsupported search condition.");
      }
    }

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

    // Distributed per-user rate limit shared by website and mobile.
    try {
      const {
        data: rateLimitAllowed,
        error: rateLimitError,
      } = await entitlementClient.rpc(
        "check_transit_query_rate_limit"
      );

      if (
        rateLimitError ||
        typeof rateLimitAllowed !== "boolean"
      ) {
        console.error(
          "[transit-query] Rate limit check unavailable",
          rateLimitError?.code ?? "invalid_response"
        );

        return NextResponse.json(
          {
            ok: false,
            reason: "rate_limit_unavailable",
            error: "Transit Query is temporarily unavailable. Please try again shortly.",
          },
          {
            status: 503,
            headers: {
              "Cache-Control": "no-store",
              "Retry-After": "30",
            },
          }
        );
      }

      if (!rateLimitAllowed) {
        return NextResponse.json(
          {
            ok: false,
            reason: "rate_limit_exceeded",
            error: "Search limit reached. Please wait before trying again. Hourly limits reset at the next hour.",
          },
          {
            status: 429,
            headers: {
              "Cache-Control": "no-store",
            },
          }
        );
      }
    } catch {
      console.error(
        "[transit-query] Rate limit service unavailable"
      );

      return NextResponse.json(
        {
          ok: false,
          reason: "rate_limit_unavailable",
          error: "Transit Query is temporarily unavailable. Please try again shortly.",
        },
        {
          status: 503,
          headers: {
            "Cache-Control": "no-store",
            "Retry-After": "30",
          },
        }
      );
    }

    const requiresNatal = activeConditions.some(
      (row: any) => row?.conditionType === "conjunct_natal"
    );

    const natalPlanets = requiresNatal
      ? await computePlacements(
          {
            dateISO: birth.dateISO,
            time: birth.time,
            tz: birth.timezone,
            lat: Number(birth.lat),
            lon: Number(birth.lon),
          },
          nodeMode
        )
      : [];

    if (
      requiresNatal &&
      activeConditions.some(
        (condition: any) =>
          condition?.conditionType === "conjunct_natal" &&
          !natalPlanets.some(
            (p) =>
              p.planet === condition.natalPlanet &&
              typeof p.lon === "number" &&
              Number.isFinite(p.lon)
          )
      )
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid natal conjunction target." },
        { status: 400 }
      );
    }

    const hasMoon = activeConditions.some(
      (row: any) =>
        row.planet === "Moon" ||
        (
          row.conditionType === "same_sign_as" &&
          row.comparePlanet === "Moon"
        )
    );
    const stepHours = hasMoon ? 1 : 6;

    const requiredPlanets = new Set<string>();

    for (const condition of activeConditions) {
      requiredPlanets.add(condition.planet);

      if (condition.conditionType === "same_sign_as") {
        requiredPlanets.add(condition.comparePlanet);
      }
    }

    const requestedPlanets = Array.from(requiredPlanets);

    const searchTimezone = birth.timezone;

    const start = DateTime.fromISO(fromISO, {
      zone: searchTimezone,
    }).startOf("day");

    const endExclusive = DateTime.fromISO(toISO, {
      zone: searchTimezone,
    }).plus({ days: 1 }).startOf("day");

    if (
      !start.isValid ||
      !endExclusive.isValid ||
      start.toISODate() !== fromISO ||
      endExclusive.toMillis() <= start.toMillis()
    ) {
      return badRequest("Invalid search date boundaries.");
    }

    const stepMs = stepHours * 60 * 60 * 1000;
    const startMs = start.toMillis();
    const endMs = endExclusive.toMillis();

    const matches: any[] = [];


    for (
      let scanMs = startMs;
      scanMs < endMs;
      scanMs += stepMs
    ) {
      const scanLocal = DateTime.fromMillis(scanMs, {
        zone: searchTimezone,
      });

      const scanUTC = scanLocal.toUTC();

      const dateISO = scanLocal.toFormat("yyyy-MM-dd");
      const time = scanLocal.toFormat("HH:mm");
      const timestampUTC = scanUTC.toISO();
      const utcOffsetMinutes = scanLocal.offset;

      const raw = await computeTransitPlanetsNow(
        {
          dateISO: birth.dateISO,
          time: birth.time,
          tz: birth.timezone,
          nodeMode,
          lat: Number(birth.lat),
          lon: Number(birth.lon),
        },
        "Aries",
        {
          dateISO: scanUTC.toFormat("yyyy-MM-dd"),
          time: scanUTC.toFormat("HH:mm:ss"),
          tz: "UTC",
        },
        requestedPlanets
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

    const matchedPlanets = activeConditions
  .map((condition: any) => {
    const row = transitPlanets.find(
      (p: any) => String(p?.planet) === String(condition?.planet)
    );

    if (
      !row ||
      typeof row.lon !== "number" ||
      !Number.isFinite(row.lon)
    ) return null;

    const conditionType = String(condition?.conditionType ?? "sign_degree");

    if (conditionType === "sign_degree") {
      const targetDegree =
        Number(condition?.degree || 0) + Number(condition?.minute || 0) / 60;

      const orb = Number(condition?.orb ?? 0);

      if (
        !Number.isFinite(targetDegree) ||
        targetDegree < 0 ||
        targetDegree >= 30 ||
        !Number.isFinite(orb) ||
        orb < 0
      ) return null;
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

      if (
        !other ||
        typeof other.lon !== "number" ||
        !Number.isFinite(other.lon)
      ) return null;
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

      const natalLon = natal.lon;

      if (
        typeof natalLon !== "number" ||
        !Number.isFinite(natalLon)
      ) return null;

      const orb = Number(condition?.orb ?? 1);

      if (!Number.isFinite(orb) || orb < 0) return null;
      const diff = Math.abs(wrap360(row.lon - natalLon));
      const shortestDiff = Math.min(diff, 360 - diff);

      if (shortestDiff > orb) return null;

      return {
        conditionType,
        planet: row.planet,
        sign: row.sign,
        degree: row.degree,
        targetDegree: wrap360(natalLon) % 30,
        orb,
        nakshatra: row.nakshatra,
        pada: row.pada,
        retrograde: row.retrograde,
        natalPlanet: condition?.natalPlanet,
        natalOrb: shortestDiff,
      };
    }

    return null;
  })
  .filter(Boolean);

      if (matchedPlanets.length === activeConditions.length) {
        matches.push({
          dateISO,
          time,
          timestampUTC,
          timezone: searchTimezone,
          utcOffsetMinutes,
          matchedPlanets,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      fromISO,
      toISO,
      nodeMode,
      nodeCalculationVersion: NODE_CALCULATION_VERSION,
      stepHours,
      timezone: searchTimezone,
      searchStartUTC: start.toUTC().toISO(),
      searchEndExclusiveUTC: endExclusive.toUTC().toISO(),
      matches,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Transit query failed. Please try again." },
      { status: 500 }
    );
  }
}