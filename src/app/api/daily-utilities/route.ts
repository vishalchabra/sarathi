import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { buildPanchangData } from "@/server/dataEngine/buildPanchangData";
import {
  buildHoraTable,
  getAccurateHoraLord,
} from "@/server/dataEngine/horaCalculations";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    const { dateISO, time, timezone, lat, lon } = body ?? {};

    if (
      typeof dateISO !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dateISO) ||
      typeof time !== "string" ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
      typeof timezone !== "string" ||
      timezone.length > 100 ||
      typeof lat !== "number" ||
      !Number.isFinite(lat) ||
      lat < -90 ||
      lat > 90 ||
      typeof lon !== "number" ||
      !Number.isFinite(lon) ||
      lon < -180 ||
      lon > 180
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid date, time or location." },
        { status: 400 }
      );
    }

    const localDate = DateTime.fromISO(dateISO, { zone: timezone });

    if (!localDate.isValid || localDate.toISODate() !== dateISO) {
      return NextResponse.json(
        { ok: false, error: "Invalid date or timezone." },
        { status: 400 }
      );
    }

    const panchang = await buildPanchangData({
      dateISO,
      time,
      timezone,
      lat,
      lon,
      transitNow: null,
    });

    const sunrise = panchang._sunriseDT;
    const sunset = panchang._sunsetDT;
    const previousSunset = panchang._previousSunsetDT;
    const nextSunrise = panchang._nextSunriseDT;

    const validSolarTimes =
      sunrise?.isValid &&
      sunset?.isValid &&
      previousSunset?.isValid &&
      nextSunrise?.isValid &&
      previousSunset < sunrise &&
      sunrise < sunset &&
      sunset < nextSunrise;

    const hora = validSolarTimes
      ? getAccurateHoraLord({
          birthDateISO: dateISO,
          birthTime: time,
          timezone,
          sunrise,
          sunset,
          previousSunset,
          nextSunrise,
        })
      : null;

    const horaTable = validSolarTimes
      ? buildHoraTable({
          sunriseDT: sunrise,
          sunsetDT: sunset,
          nextSunriseDT: nextSunrise,
          weekdayIndex: localDate.weekday % 7,
        })
      : { day: [], night: [] };

    const {
      _sunriseDT,
      _sunsetDT,
      _previousSunsetDT,
      _nextSunriseDT,
      ...publicPanchang
    } = panchang;

    return NextResponse.json(
      {
        ok: true,
        dateISO,
        time,
        timezone,
        location: { lat, lon },
        panchang: publicPanchang,
        hora: {
          current: hora,
          table: horaTable,
        },
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Daily utilities error:", error);

    return NextResponse.json(
      { ok: false, error: "Unable to calculate daily utilities." },
      { status: 500 }
    );
  }
}
