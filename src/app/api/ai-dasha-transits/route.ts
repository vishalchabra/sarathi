import { requireLifeReportAccess } from "@/server/auth/requireLifeReportAccess";
// FILE: src/app/api/ai-dasha-transits/route.ts
import "server-only";
import { NextResponse } from "next/server";
import {
  buildStructuredDashaTransits,
  type ReqBody,
} from "@/server/astro/dasha-transit-summary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const accessDenied = await requireLifeReportAccess(req);

  if (accessDenied) return accessDenied;

  try {
    const body = (await req.json().catch(() => ({}))) as ReqBody;

    const profile = body.profile ?? {};
    const mdad = body.mdad ?? null;
    const transits = Array.isArray(body.transits) ? body.transits : [];

    const structured = buildStructuredDashaTransits(profile, mdad, transits);

    return NextResponse.json(structured, { status: 200 });
  } catch (e) {
    console.error("[api/ai-dasha-transits] error", e);
    return NextResponse.json(
      {
        headline: "Past • Present • Upcoming",
        dashaLine: "Current cycle: steady consolidation + cleaner choices",
        windows: [],
        patterns: [
          { title: "Career & direction", text: "Make one steady move; avoid impulsive leaps." },
          { title: "Relationships & support", text: "Communicate clearly; don’t react fast." },
          { title: "Inner stability", text: "Simplify: one priority, one grounded action." },
        ],
        nextStep: "Pick one area to simplify this week and apply steady effort.",
        source: "fallback_rules",
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, endpoint: "/api/ai-dasha-transits" },
    { status: 200 }
  );
}
