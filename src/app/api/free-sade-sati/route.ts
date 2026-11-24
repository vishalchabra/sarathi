import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { buildSadeSati } from "@/server/dataEngine/buildSadeSati";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(
  message: string,
  status = 400
) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    let body: any;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body.");
    }

    const input = body?.birth;

    if (!input || typeof input !== "object") {
      return errorResponse("Birth details are required.");
    }

    const {
      dateISO,
      time,
      timezone,
      lat,
      lon,
    } = input;

    if (
      typeof dateISO !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dateISO)
    ) {
      return errorResponse("Invalid birth date.");
    }

    if (
      typeof time !== "string" ||
      !/^\d{2}:\d{2}(:\d{2})?$/.test(time)
    ) {
      return errorResponse("Invalid birth time.");
    }

    if (
      typeof timezone !== "string" ||
      !timezone.trim()
    ) {
      return errorResponse("Invalid timezone.");
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
      return errorResponse("Invalid birthplace coordinates.");
    }

    const birthDT = DateTime.fromISO(
      `${dateISO}T${time}`,
      { zone: timezone }
    );

    if (!birthDT.isValid) {
      return errorResponse(
        "Invalid birth date, time or timezone."
      );
    }

    if (birthDT.toMillis() > Date.now()) {
      return errorResponse(
        "Birth date cannot be in the future."
      );
    }

    if (
      birthDT.toMillis() < Date.UTC(1900, 0, 1)
    ) {
      return errorResponse(
        "Birth date is outside the supported calendar range."
      );
    }

    const name =
      typeof input.name === "string"
        ? input.name.trim().slice(0, 100)
        : undefined;

    const result = await buildSadeSati({
      name,
      dateISO,
      time,
      timezone,
      lat,
      lon,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });

  } catch (error) {
    console.error("[free-sade-sati]", error);

    return errorResponse(
      "Unable to calculate Sade Sati. Please try again.",
      500
    );
  }
}