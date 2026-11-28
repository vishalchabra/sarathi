import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { buildFreeKundli } from "@/server/dataEngine/buildFreeKundli";

export const runtime = "nodejs";

function errorResponse(error: string, status: number) {
  return NextResponse.json(
    { ok: false, error },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function POST(req: NextRequest) {
  let body;

  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const birth = body?.birth;

  if (!birth || typeof birth !== "object") {
    return errorResponse("Birth details are required.", 400);
  }

  const { dateISO, time, timezone, lat, lon } = birth;

  if (
    typeof dateISO !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateISO) ||
    typeof time !== "string" ||
    !/^\d{2}:\d{2}$/.test(time) ||
    typeof timezone !== "string" ||
    !timezone.trim()
  ) {
    return errorResponse("Invalid birth date, time or timezone.", 400);
  }

  if (
    typeof lat !== "number" ||
    !Number.isFinite(lat) ||
    lat < -90 ||
    lat > 90 ||
    typeof lon !== "number" ||
    !Number.isFinite(lon) ||
    lon < -180 ||
    lon > 180
  ) {
    return errorResponse("Invalid birthplace coordinates.", 400);
  }

  const birthDT = DateTime.fromISO(
    `${dateISO}T${time}`,
    { zone: timezone }
  );

  if (!birthDT.isValid) {
    return errorResponse("Invalid birth date or time.", 400);
  }

  if (birthDT.toMillis() > Date.now()) {
    return errorResponse("Birth date cannot be in the future.", 400);
  }

  try {
    const result = await buildFreeKundli({
      name:
        typeof birth.name === "string"
          ? birth.name.trim().slice(0, 100)
          : undefined,
      dateISO,
      time,
      timezone,
      lat,
      lon,
    }, "mean");

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[FREE KUNDLI]", err);

    return errorResponse(
      "Unable to calculate Kundli. Please check the birth details and try again.",
      500
    );
  }
}