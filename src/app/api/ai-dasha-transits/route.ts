// FILE: src/app/api/ai-dasha-transits/route.ts
import "server-only";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type TransitWindow = {
  title?: string;
  startISO?: string;
  endISO?: string;
  planet?: string;
  target?: string;
  category?: string;
  strength?: number;
};

type MdAdInfo = {
  md?: { planet?: string; start?: string | null; end?: string | null };
  ad?: { planet?: string; start?: string | null; end?: string | null };
};

type ReqBody = {
  profile?: {
    name?: string;
    birthDateISO?: string;
    birthTime?: string;
    birthTz?: string;
  };
  mdad?: MdAdInfo | null;
  transits?: TransitWindow[];
};

function safeStr(v: any) {
  return String(v ?? "").replace(/\s+/g, " ").trim();
}

function fmtWindow(t: TransitWindow) {
  const label =
    safeStr(t.title) ||
    safeStr(`${t.planet ?? "Planet"} → ${t.target ?? ""}`) ||
    "Transit window";

  const when =
    safeStr(t.startISO) && safeStr(t.endISO)
      ? `${safeStr(t.startISO)} → ${safeStr(t.endISO)}`
      : safeStr(t.startISO) || safeStr(t.endISO) || "Timing: soon";

  const category = safeStr(t.category);
  const strength =
    typeof t.strength === "number" && isFinite(t.strength)
      ? Math.max(0, Math.min(1, t.strength))
      : undefined;

  return {
    label,
    when,
    category: category || undefined,
    strength,
  };
}

function buildStructuredDashaTransits(
  profile: ReqBody["profile"],
  mdad: MdAdInfo | null,
  transits: TransitWindow[]
) {
  const name = safeStr(profile?.name) || "you";

  const md = safeStr(mdad?.md?.planet);
  const ad = safeStr(mdad?.ad?.planet);

  const dashaLine =
    md && ad
      ? `Current cycle: ${md} MD + ${ad} AD`
      : md
      ? `Current cycle: ${md} MD`
      : "Current cycle: steady consolidation + cleaner choices";

  // Sort “best” windows first if strength exists; otherwise keep order
  const windows = (Array.isArray(transits) ? transits : [])
    .map(fmtWindow)
    .sort((a, b) => (b.strength ?? -1) - (a.strength ?? -1))
    .slice(0, 6);

  // Compact “patterns” (these are still fallback, but crisp)
  const patterns = [
    {
      title: "Career & direction",
      text:
        "Use stronger windows for one meaningful push (project, negotiation, responsibility). Avoid random risks.",
    },
    {
      title: "Relationships & support",
      text:
        "Choose clarity over reaction. If friction shows up, slow down and tighten communication.",
    },
    {
      title: "Inner stability",
      text:
        "When you feel rushed or edgy, simplify. One priority. One grounded action.",
    },
  ];

  const nextStep =
    windows.length > 0
      ? "Pick ONE upcoming window and decide in advance how you’ll use it (push / clarify / reset)."
      : "Pick ONE area to simplify this week (work, health, relationships) and apply steady effort.";

  return {
    headline: `Past • Present • Upcoming — ${name}`,
    dashaLine,
    windows,
    patterns,
    nextStep,
    source: "fallback_rules", // important: tells UI this is not GPT
  };
}

export async function POST(req: Request) {
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
