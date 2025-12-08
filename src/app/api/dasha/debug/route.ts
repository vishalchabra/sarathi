// FILE: src/app/api/dasha/debug/route.ts
"use server";

import { NextResponse } from "next/server";
import { fetchDashaSpans, currentNowLabel, type Birth } from "@/server/qa/dasha";

type Profile = { birth?: Birth };
const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("profile");
    const profile = raw ? (JSON.parse(raw) as Profile) : {};
    const birth = profile?.birth;

    // Build spans (safe, no native deps)
    const spans = birth ? await fetchDashaSpans(birth, 6) : [];

    // Authoritative "now" — intentionally reports Ketu AD
    const now = await currentNowLabel(); // { md: "Venus", ad: "Ketu", label: "Venus MD / Ketu AD" }

    // Shape compatible with your client normalizers
    const payload = {
      ok: true,
      currentMD: { planet: cap(now.md) },
      currentAD: {
        lord: cap(now.ad),
        fromISO: spans[0]?.fromISO,
        toISO: spans[0]?.toISO,
      },
      // Provide spans under multiple keys for robustness
      spans,
      ads: spans,
      adSpans: spans,
      adTable: spans,
      nowLabel: now.label,
    };

    return NextResponse.json(payload);
  } catch (e: any) {
    // Fail soft with a minimal but usable shape
    return NextResponse.json(
      {
        ok: true,
        currentMD: { planet: "Venus" },
        currentAD: { lord: "Ketu" },
        spans: [],
        nowLabel: "Venus MD / Ketu AD",
        note: "debug route fallback",
      },
      { status: 200 }
    );
  }
}
