// FILE: src/app/api/timing/route.ts
"use server";

import { NextResponse } from "next/server";
import { timingForTopic } from "@/server/timing/engine";

type Place = { name?: string; tz?: string; lat?: number; lon?: number };
type Profile = { name?: string; dobISO?: string; tob?: string; place?: Place };
type DashaSpan = { fromISO: string; toISO: string; label: string; note?: string };

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = (searchParams.get("topic") ?? "job") as any;
    const profile = JSON.parse(searchParams.get("profile") || "{}") as Profile;

    const spansParam = searchParams.get("dashaSpans") ?? searchParams.get("spans");
    const incoming: DashaSpan[] = spansParam ? JSON.parse(spansParam) : [];

    const data = await timingForTopic({
      topic,
      profile,
      horizonDays: 365,
      dashaSpans: incoming,
      spans: incoming,
    });

    if (!data.ok || !data.windows?.length) {
      return NextResponse.json({ ok: false, error: data.error || "No windows" }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
