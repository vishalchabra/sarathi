// FILE: src/app/api/ai-dasha-transits/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";

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

function buildFallbackDashaTransits(
  profile: ReqBody["profile"],
  mdad: MdAdInfo | null,
  transits: TransitWindow[]
): string {
  const name = (profile?.name || "you").trim() || "you";

  const md = mdad?.md?.planet || "";
  const ad = mdad?.ad?.planet || "";
  const dashaLine =
    md && ad
      ? `You are currently moving through a **${md} Mahadasha** with a **${ad} Antardasha** active.`
      : md
      ? `You are currently moving through a **${md} Mahadasha**.`
      : `The current dasha period is about consolidating lessons and making steadier choices.`;

  const bullets =
    Array.isArray(transits) && transits.length
      ? transits
          .slice(0, 6)
          .map((t) => {
            const label = t.title || `${t.planet ?? "Planet"} → ${t.target ?? ""}`.trim();
            const when =
              t.startISO && t.endISO
                ? `${t.startISO} → ${t.endISO}`
                : t.startISO || t.endISO || "timing window";
            const cat = t.category ? ` [${t.category}]` : "";
            return `• ${label} (${when})${cat}`;
          })
          .join("\n")
      : "• No specific transit windows were provided, so this stays general.";

  return [
    `### How your current dasha + transits are working together for ${name}`,
    ``,
    `${dashaLine} This sets the *background storyline* for this phase of life – what life is asking you to learn, stabilise, or grow into.`,
    ``,
    `Looking at the key transit windows layered on top of this dasha, a few patterns stand out:`,
    ``,
    bullets,
    ``,
    `**Career & practical life:**`,
    `During stronger windows, you may notice chances to push projects, negotiate better, or step into more responsibility. Use those windows to take intentional steps forward, not random risks.`,
    ``,
    `**Relationships & support system:**`,
    `Some transits emphasise communication and emotional honesty. When you feel friction, treat it as a signal to slow down, listen better, and clarify needs rather than reacting from stress.`,
    ``,
    `**Inner growth & mindset:**`,
    `Dasha + transits together push you to respond with more awareness. Notice when you feel rushed, anxious or over-excited—that is where Rahu/Saturn/Ketu-type energies are asking for grounding, simplicity and clear boundaries.`,
    ``,
    `**Next step:**`,
    `Pick one upcoming window from the list above and decide *in advance* how you want to use it—career push, honest conversation, or inner reset. When the window arrives, act with calm, not compulsion.`,
  ].join("\n");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as ReqBody;
    const profile = body.profile ?? {};
    const mdad = body.mdad ?? null;
    const transits = Array.isArray(body.transits) ? body.transits : [];

    const text = buildFallbackDashaTransits(profile, mdad, transits);

    return NextResponse.json({ text }, { status: 200 });
  } catch (e) {
    console.error("[api/ai-dasha-transits] error", e);
    // absolute last-resort fallback
    return NextResponse.json(
      {
        text:
          "This phase combines your current dasha with active transit windows, asking for steadier, more conscious choices in work, relationships and daily habits.",
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
