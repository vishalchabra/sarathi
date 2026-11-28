import "server-only";
import { NODE_CALCULATION_VERSION } from "@/server/astro/lunarNodes";
import { todayISOForNotificationTz } from "@/server/notifications/today";

export type TransitHit = {
  id: string;
  startISO: string;
  endISO: string;
  planet: string;
  target: string;
  category: "career" | "relationships" | "health" | "inner" | "general";
  strength: number; // 0–1
  title: string;
  description: string;

  // optional extra computed fields from engine (safe if present)
  transitLon?: number;
  transitSign?: string;
  transitHouse?: number;
  natalLon?: number;
  natalHouse?: number;
  orb?: number;
};

export type TransitRequestBirth = {
  dateISO: string;
  time: string;
  tz: string;
  lat: number;
  lon: number;
};

export type DailyMoonRow = {
  dateISO: string;
  moonNakshatra: string | null;
  houseFromMoon?: number | null;
};

export type TransitNowPlanet = {
  name: string;
  lon: number;
  sign: string;
  house?: number;
};

export type MoonNow = {
  atISO: string;
  tz: string;
  nakshatra: string | null;
  lonSid?: number | null;
};
function hhmmNowInTz(tz: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hh = parts.find((p) => p.type === "hour")?.value ?? "12";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hh}:${mm}`;
}


function transitResult<T>(
  data: T,
  options?: { status?: number }
) {
  return {
    status: options?.status ?? 200,
    data,
  };
}

export async function buildTransitResponse(body: any) {

    const requestedNodeMode = body?.nodeMode;

    if (
      requestedNodeMode !== undefined &&
      requestedNodeMode !== null &&
      requestedNodeMode !== "mean" &&
      requestedNodeMode !== "true"
    ) {
      return transitResult(
        {
          ok: false,
          error: "Invalid lunar node convention.",
        },
        { status: 400 }
      );
    }

    const nodeMode: "mean" | "true" =
      requestedNodeMode ?? "mean";

    const birth: (TransitRequestBirth & {
      nodeMode: "mean" | "true";
    }) | undefined = body?.birth
      ? { ...body.birth, nodeMode }
      : undefined;
    const horizonDays = Number(body?.horizonDays ?? 365);

    // Optional (for house computation in windows + transitNow)
    const ascDeg =
      body?.ascDeg != null && Number.isFinite(Number(body.ascDeg))
        ? Number(body.ascDeg)
        : undefined;

    const ascSign =
      typeof body?.ascSign === "string" && body.ascSign.trim()
        ? body.ascSign.trim()
        : undefined;

    if (!birth) {
      return transitResult({
        transits: [],
        topTransits: [],
        transitNow: [],
        dailyMoon: [],
        moonNow: null,
        _debug: {
          ascDeg: ascDeg ?? null,
          ascSign: ascSign ?? null,
          transitsCount: 0,
          transitNowCount: 0,
          dailyMoonCount: 0,
        },
      });
    }

    const forecastTimezone =
      body?.forecastTimezone === undefined
        ? birth.tz
        : body.forecastTimezone;

    try {
      if (
        typeof forecastTimezone !== "string" ||
        !forecastTimezone.trim()
      ) {
        throw new Error("Invalid forecast timezone");
      }

      new Intl.DateTimeFormat("en-GB", {
        timeZone: forecastTimezone,
      }).format(new Date());
    } catch {
      return transitResult(
        {
          ok: false,
          error: "Invalid forecast timezone.",
        },
        { status: 400 }
      );
    }

    let transits: TransitHit[] = [];
    let dailyMoon: DailyMoonRow[] = [];
    let transitNow: TransitNowPlanet[] = [];
    let moonNow: MoonNow | null = null;

    // 1) Transit windows (FULL LIST)
    try {
      const mod = await import("@/server/astro/transits").catch(() => null as any);

      if (mod && typeof mod.computeTransitWindows === "function") {
        transits = await mod.computeTransitWindows(birth, horizonDays, {
          ascDeg,
          ascSign,
        });
      }
    } catch (e) {
      console.warn("[transits] computeTransitWindows failed", e);
      transits = [];
    }

    if (!Array.isArray(transits)) transits = [];

    // 2) Today transit planets snapshot (for "Now" UI)
    try {
      const mod = await import("@/server/astro/transits").catch(() => null as any);

      if (mod && typeof mod.computeTransitPlanetsNow === "function") {
        transitNow = await mod.computeTransitPlanetsNow(birth, ascSign);
      }
    } catch (e) {
      console.warn("[transits] computeTransitPlanetsNow failed", e);
      transitNow = [];
    }

    if (!Array.isArray(transitNow)) transitNow = [];

    // 3) Daily Moon nakshatras (next 14 days) + Moon now (current moment)
    // IMPORTANT: dailyMoon must be computed from "today" in the user's TZ,
    // not from birth.dateISO (which would generate 1984-era moon rows).
    try {
      const sweDaily = await import("@/server/astro/sweDailyMoon").catch(
        () => null as any
      );

      const tz = forecastTimezone;
      const baseDateISO = todayISOForNotificationTz(tz);

      // ---- DEBUG LOGS ----
      const baseTime = hhmmNowInTz(tz);


      // 3a) Next 14 days moon nakshatra series (anchored on today)
      if (sweDaily && typeof sweDaily.computeDailyMoonNakshatras === "function") {
        const baseTime = hhmmNowInTz(tz);
        dailyMoon = await sweDaily.computeDailyMoonNakshatras(
          {
            // natal (your real birth)
            dateISO: birth.dateISO,
            time: birth.time,
            birthTz: birth.tz,

            // base series date/time (today)
            baseDateISO,
            baseTime,

            tz,
            lat: birth.lat,
            lon: birth.lon,
          },
          14
        );
      }

      // 3b) Moon nakshatra "Now" (current moment)
      if (sweDaily && typeof sweDaily.computeMoonNakshatraNow === "function") {
        const nowRes = await sweDaily.computeMoonNakshatraNow(tz, birth.lat, birth.lon);

        // TEMP debug (remove after confirming shape)
        ;

        moonNow = {
          atISO:
            (nowRes as any)?.atISO ??
            (nowRes as any)?.iso ??
            new Date().toISOString(),
          tz,
          nakshatra:
            (nowRes as any)?.nakshatra ??
            (nowRes as any)?.moonNakshatra ??
            null,
          lonSid:
            (nowRes as any)?.lonSid ??
            (nowRes as any)?.siderealDeg ??
            (nowRes as any)?.moonLonSid ??
            null,
        };
      }

      // ---- DEBUG LOGS ----
      ;
    } catch (e) {
      console.warn("[transits] daily moon engine failed", e);
      dailyMoon = [];
      moonNow = null;
    }

    if (!Array.isArray(dailyMoon)) dailyMoon = [];

    // 4) Convenience: topTransits (sorted/trimmed)
    const todayISO = todayISOForNotificationTz(forecastTimezone);
const today = new Date(`${todayISO}T00:00:00`);

const scoreTransit = (t: any) => {
  const strength = Number(t?.strength ?? 0);

  const start = new Date(`${String(t?.startISO || todayISO)}T00:00:00`);
  const daysAway = Math.abs(
    (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const proximityBoost = Math.max(0, 30 - daysAway) * 0.02;

  const orb = Number.isFinite(Number(t?.orb)) ? Number(t.orb) : 12;
  const orbBoost = Math.max(0, 12 - orb) * 0.015;

  return strength + proximityBoost + orbBoost;
};

const topTransits = transits
  .slice()
  .sort((a: any, b: any) => scoreTransit(b) - scoreTransit(a))
  .slice(0, 12);
  ;
    return transitResult({
      nodeMode,
      nodeCalculationVersion: NODE_CALCULATION_VERSION,
      forecastTimezone,
      todayISO,
      transits, // full list (backwards compatible)
      topTransits, // pre-trimmed list
      transitNow, // today snapshot
      dailyMoon,
      moonNow,
      _debug: {
        ascDeg: ascDeg ?? null,
        ascSign: ascSign ?? null,
        transitsCount: transits.length,
        transitNowCount: transitNow.length,
        dailyMoonCount: Array.isArray(dailyMoon) ? dailyMoon.length : 0,
      },
    });
}
