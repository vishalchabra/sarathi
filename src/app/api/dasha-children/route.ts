import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import { computePlacements } from "@/server/astro/placements";
import {
  getMahadashaTimeline,
  getAntardashaTimeline,
  getPratyantardashaTimeline,
  getSookshmaDashaTimeline,
  getPranaDashaTimeline,
  getDehaDashaTimeline,
} from "@/lib/astro/dasha";

export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authorization = req.headers.get("authorization");
    const bearerToken = /^Bearer\s+(\S+)$/i.exec(authorization ?? "")?.[1];

    const { data: { user }, error: authError } = bearerToken
      ? await supabase.auth.getUser(bearerToken)
      : await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "Please sign in to use the Data Engine." },
        { status: 401 }
      );
    }

    const entitlementClient = bearerToken
      ? createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: { Authorization: `Bearer ${bearerToken}` },
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
        { ok: false, error: "Data Engine access is required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const birth = body?.birth;
    const path = body?.path;

    if (
      !birth ||
      typeof birth.dateISO !== "string" ||
      typeof birth.time !== "string" ||
      typeof birth.timezone !== "string" ||
      !Number.isFinite(birth.lat) ||
      !Number.isFinite(birth.lon) ||
      birth.lat < -90 ||
      birth.lat > 90 ||
      birth.lon < -180 ||
      birth.lon > 180 ||
      !Array.isArray(path) ||
      path.length > 5 ||
      !path.every(
        (index: unknown) =>
          Number.isInteger(index) && (index as number) >= 0 && (index as number) <= 8
      )
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid birth details or Dasha path." },
        { status: 400 }
      );
    }

    const birthTime = DateTime.fromISO(
      `${birth.dateISO}T${birth.time}`,
      { zone: birth.timezone }
    );

    if (!birthTime.isValid) {
      return NextResponse.json(
        { ok: false, error: "Invalid birth date, time or timezone." },
        { status: 400 }
      );
    }

    const birthUTC = birthTime.toUTC().toJSDate();

    const placements = await computePlacements({
      dateISO: birth.dateISO,
      time: birth.time,
      tz: birth.timezone,
      lat: birth.lat,
      lon: birth.lon,
    });

    const moon = placements.find(
      (planet) => planet.planet === "Moon"
    );

    if (
      typeof moon?.lon !== "number" ||
      !Number.isFinite(moon.lon) ||
      moon.lon < 0 ||
      moon.lon >= 360
    ) {
      throw new Error("Unable to calculate natal Moon longitude.");
    }

    const result = calculateDashaChildren(
      birthUTC,
      moon.lon,
      path
    );

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("[DASHA CHILDREN ERROR]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to retrieve Dasha periods." },
      { status: 500 }
    );
  }
}

type DashaPeriod = {
  start: Date;
  end: Date;
  lord?: string;
  subLord?: string;
  subSubLord?: string;
  sookshmaLord?: string;
  pranaLord?: string;
  dehaLord?: string;
};

const DASHA_LEVELS = ["md", "ad", "pd", "sd", "pr", "de"] as const;

const LORD_FIELDS = [
  "lord",
  "subLord",
  "subSubLord",
  "sookshmaLord",
  "pranaLord",
  "dehaLord",
] as const;

function calculateDashaChildren(
  birthUTC: Date,
  moonLonSidDeg: number,
  path: number[]
) {
  let periods: DashaPeriod[] = getMahadashaTimeline(
    birthUTC,
    0,
    moonLonSidDeg
  );

  const builders = [
    getAntardashaTimeline,
    getPratyantardashaTimeline,
    getSookshmaDashaTimeline,
    getPranaDashaTimeline,
    getDehaDashaTimeline,
  ];

  for (let depth = 0; depth < path.length; depth++) {
    const parent = periods[path[depth]];

    if (!parent) {
      throw new Error("Invalid Dasha period selection");
    }

    const builder = builders[depth];

    if (!builder) {
      throw new Error("Maximum Dasha depth reached");
    }

    periods = builder(parent as never);
  }

  const levelIndex = path.length;

  return {
    level: DASHA_LEVELS[levelIndex],
    children: periods.map((period, index) => ({
      index,
      level: DASHA_LEVELS[levelIndex],
      lord: period[LORD_FIELDS[levelIndex]],
      startISO: period.start.toISOString(),
      endISO: period.end.toISOString(),
    })),
  };
}
