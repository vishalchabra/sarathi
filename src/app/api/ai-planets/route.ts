// FILE: src/app/api/ai-planets/route.ts
export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ASTROSARATHI_SYSTEM_PROMPT } from "@/lib/qa/systemPrompt";

// --- OpenAI client: safe even if OPENAI_API_KEY is missing ---
const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;
const GPT_MODEL = "gpt-4.1-mini";

/* ---------- Types ---------- */
type PlanetRow = { name: string; sign?: string; house?: number; nakshatra?: string };
type AspectA = { from: string; to: string; type: string; orb?: number };
type AspectsMap = Record<string, Array<{ onto: string; type: string; orb?: number }>>;

type ReqBody = {
  report?: {
    planets?: PlanetRow[];
    // Any of these keys may carry aspects; we'll normalize them
    aspects?: AspectA[] | AspectsMap;
    aspectsMap?: AspectsMap;
    aspectList?: AspectA[];
    ascSign?: string;
    moonSign?: string;
    sunSign?: string;
    // optional prebuilt incoming map from caller
    incomingAspects?: Record<string, Array<{ from: string; fromHouse?: number; type?: string }>>;
  };
};

/* ---------- Dictionaries ---------- */
const SIGN_TRAITS: Record<string, string> = {
  Aries: "initiating, bold, direct",
  Taurus: "steady, practical, sensual",
  Gemini: "curious, talkative, quick-learning",
  Cancer: "nurturing, protective, emotional",
  Leo: "expressive, proud, creative",
  Virgo: "analytical, service-driven, detail-oriented",
  Libra: "harmonizing, aesthetic, diplomatic",
  Scorpio: "intense, secretive, transformative",
  Sagittarius: "expansive, optimistic, truth-seeking",
  Capricorn: "disciplined, structured, ambitious",
  Aquarius: "innovative, unconventional, community-focused",
  Pisces: "intuitive, empathetic, spiritual",
};

const HOUSE_THEMES: Record<number, string> = {
  1: "identity, body, and self-expression",
  2: "wealth, voice, values, and stability",
  3: "communication, siblings, and effort",
  4: "home, roots, and emotional foundation",
  5: "creativity, romance, and children",
  6: "service, work routines, and health",
  7: "partnerships, marriage, and contracts",
  8: "transformation, shared assets, and secrets",
  9: "learning, belief, and long journeys",
  10: "career, authority, and public life",
  11: "friendships, networks, and aspirations",
  12: "spirituality, solitude, and endings",
};

const ASPECT_EFFECTS: Record<string, string> = {
  conjunction: "merges energies—can amplify both strengths and conflicts",
  opposition: "brings polarity—asks balance between extremes",
  trine: "creates flow and natural cooperation",
  sextile: "opens easy opportunities through awareness",
  square: "challenges growth through friction",
  quincunx: "demands subtle adjustment and compromise",
};

/* ---------- Planet voices ---------- */
const PLANET_VOICES: Record<
  string,
  { tone: string; verbs: string[]; cadence: string; close: string }
> = {
  Sun: {
    tone: "confident, purpose-led, dignified",
    verbs: ["lead", "express", "radiate", "direct"],
    cadence: "measured, declarative",
    close: "affirm purpose with calm strength",
  },
  Moon: {
    tone: "warm, reflective, nurturing",
    verbs: ["feel", "soothe", "sense", "care"],
    cadence: "gentle, flowing",
    close: "reassure toward emotional safety",
  },
  Mars: {
    tone: "decisive, energetic, courageous",
    verbs: ["act", "assert", "cut through", "mobilize"],
    cadence: "crisp, dynamic",
    close: "channel passion into disciplined action",
  },
  Mercury: {
    tone: "curious, practical, articulate",
    verbs: ["analyze", "connect", "translate", "learn"],
    cadence: "clear, concise",
    close: "recommend one concrete mental habit",
  },
  Jupiter: {
    tone: "wise, expansive, benevolent",
    verbs: ["grow", "trust", "integrate", "teach"],
    cadence: "uplifting, spacious",
    close: "invite faith anchored in ethics",
  },
  Venus: {
    tone: "harmonizing, aesthetic, relational",
    verbs: ["attract", "soften", "balance", "delight"],
    cadence: "lyrical, graceful",
    close: "suggest a small act of beauty or kindness",
  },
  Saturn: {
    tone: "sober, disciplined, accountable",
    verbs: ["commit", "structure", "endure", "refine"],
    cadence: "stoic, steady",
    close: "offer a mature, patient commitment",
  },
  Rahu: {
    tone: "visionary, restless, boundary-pushing",
    verbs: ["innovate", "experiment", "amplify", "risk wisely"],
    cadence: "edgy, futuristic",
    close: "temper ambition with ethics and grounding",
  },
  Ketu: {
    tone: "detached, mystical, incisive",
    verbs: ["release", "discern", "spiritualize", "simplify"],
    cadence: "minimal, lucid",
    close: "return attention to essence over form",
  },
};

function planetVoiceFor(name?: string) {
  const k = (name || "").toLowerCase();
  return (
    PLANET_VOICES[
      ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"].find(
        (x) => x === k
      ) || "Sun"
    ]
  );
}

/* ---------- Normalizers ---------- */
function norm(s?: string | number | null) {
  if (s === null || s === undefined) return "";
  return String(s).trim().toLowerCase();
}
function normType(s?: string) {
  return norm(s).replace(/[^a-z]/g, "");
}
function normPlanetName(s?: string) {
  const x = norm(s);
  if (!x) return "";
  if (x.includes("truenode") || x.includes("northnode") || x.includes("dragonshead")) return "rahu";
  if (x.includes("southnode") || x.includes("dragonstail")) return "ketu";
  return x;
}

/* ---------- Helpers ---------- */
function houseMap(planets: PlanetRow[]) {
  const map = new Map<number, string[]>();
  for (const p of planets) {
    if (typeof p.house === "number" && p.name) {
      const arr = map.get(p.house) || [];
      arr.push(p.name);
      map.set(p.house, arr);
    }
  }
  return map;
}

function aspectsFor(
  planetName: string,
  planets: PlanetRow[],
  aspects: AspectA[] | AspectsMap | undefined
): { pairs: { other: string; type: string; orb?: number }[] } {
  if (!aspects) return { pairs: [] };

  const selfKey = normPlanetName(planetName);
  const pairs: { other: string; type: string; orb?: number }[] = [];

  const hmap = houseMap(planets);
  const expandHouseToken = (token: string): string[] => {
    const m = token.match(/^H(\d{1,2})$/i);
    if (!m) return [token];
    const h = Number(m[1]);
    return hmap.get(h) || [];
  };

  const addPair = (otherToken: string, type: string, orb?: number) => {
    const others = expandHouseToken(otherToken);
    for (const other of others) {
      if (other && normPlanetName(other) !== selfKey) pairs.push({ other, type, orb });
    }
  };

  if (Array.isArray(aspects)) {
    for (const a of aspects) {
      if (!a) continue;
      if (normPlanetName(a.from) === selfKey) addPair(a.to, a.type, a.orb);
      if (normPlanetName(a.to) === selfKey) addPair(a.from, a.type, a.orb);

      if (/^H\d+$/i.test(a.from)) {
        for (const p of expandHouseToken(a.from)) {
          if (normPlanetName(p) === selfKey) addPair(a.to, a.type, a.orb);
        }
      }
      if (/^H\d+$/i.test(a.to)) {
        for (const p of expandHouseToken(a.to)) {
          if (normPlanetName(p) === selfKey) addPair(a.from, a.type, a.orb);
        }
      }
    }
  } else {
    for (const [key, arr] of Object.entries(aspects)) {
      const keyNorm = normPlanetName(key);
      if (keyNorm === selfKey) {
        for (const x of arr || []) addPair(x.onto, x.type, x.orb);
      } else if (/^H\d+$/i.test(key)) {
        for (const p of expandHouseToken(key)) {
          if (normPlanetName(p) === selfKey) {
            for (const x of arr || []) addPair(x.onto, x.type, x.orb);
          }
        }
      }
    }
  }

  return { pairs };
}

function makeHeadline(p: PlanetRow) {
  const parts: string[] = [];
  if (p.sign) parts.push(p.sign);
  if (typeof p.house === "number") parts.push(`H${p.house}`);
  if (p.nakshatra) parts.push(p.nakshatra);
  return parts.join(" • ");
}

function fallbackMeaning(
  p: PlanetRow,
  pairs: { other: string; type: string; orb?: number }[]
) {
  const name = p.name || "Planet";
  const signTrait = p.sign && SIGN_TRAITS[p.sign] ? `${p.sign} gives a ${SIGN_TRAITS[p.sign]} tone.` : "";
  const houseTheme =
    typeof p.house === "number" && HOUSE_THEMES[p.house]
      ? `Focuses on ${HOUSE_THEMES[p.house]}.`
      : "";
  const nak = p.nakshatra ? `Nakshatra influence: ${p.nakshatra}.` : "";

  const aspectBits =
    pairs.length > 0
      ? `Aspect highlights: ` +
        pairs
          .map((a) => {
            const t = normType(a.type);
            const eff = ASPECT_EFFECTS[t] || "interacts with";
            const orb = typeof a.orb === "number" ? ` (orb ${a.orb.toFixed(1)}°)` : "";
            return `${name} ${t} ${eff} ${a.other}${orb}`;
          })
          .join("; ") + "."
      : "";

  return [signTrait, houseTheme, nak, aspectBits].filter(Boolean).join(" ");
}

function tryParseJson(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/);
    if (m) {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/* ---------- Main ---------- */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug");

  try {
    const body = (await req.json().catch(() => ({}))) as ReqBody;

    // ✅ ALWAYS use `rpt`
    const rpt = body?.report || {};
    const planets: PlanetRow[] = Array.isArray((rpt as any).planets)
      ? ((rpt as any).planets as PlanetRow[])
      : [];

    // aspects input (either array or map) from `rpt`
    const aspectsIn: AspectA[] | AspectsMap | undefined =
      (rpt as any).aspects ?? (rpt as any).aspectList ?? (rpt as any).aspectsMap ?? undefined;

    // Build per-planet facts + aspect summaries
    const perPlanet = planets.map((p) => {
      const { pairs } = aspectsFor(p.name || "", planets, aspectsIn);
      const aspectSummary =
        pairs.length
          ? pairs
              .map(
                (a) =>
                  `${a.type.toLowerCase()} with ${a.other}${
                    typeof a.orb === "number" ? ` (orb ${a.orb.toFixed(1)}°)` : ""
                  }`
              )
              .join("; ")
          : "no significant aspects recorded";

      return {
        name: p.name || "Planet",
        sign: p.sign || "",
        house: typeof p.house === "number" ? p.house : null,
        nakshatra: p.nakshatra || "",
        aspects: aspectSummary,
        pairs,
        headline: makeHeadline(p),
        raw: p,
      };
    });

    if (debug) {
      return NextResponse.json(
        {
          debugPairs: perPlanet.map(({ name, pairs, aspects }) => ({
            planet: name,
            pairs,
            aspectSummary: aspects,
          })),
        },
        { status: 200 }
      );
    }

    // ---------- No OpenAI key? Use fallback-only ----------
    if (!client) {
      const insights: Record<string, { headline: string; summary: string }> = {};
      for (const f of perPlanet) {
        const headline = (f.headline || "Placement").trim();
        const summary = fallbackMeaning(f.raw, f.pairs).replace(/\s+/g, " ").trim();
        insights[f.name] = { headline, summary };
      }

      return NextResponse.json(
        {
          insights,
          _meta: { disabled: true, reason: "OPENAI_API_KEY not configured" },
        },
        { status: 200 }
      );
    }

    // ---------- GPT generation ----------

    let ai: any | null = null;
    try {
            const system = `
${ASTROSARATHI_SYSTEM_PROMPT}

You are now generating *planet-wise* insights for a single chart.

- For each planet, use a planet-appropriate voice (tone, verbs, cadence) based on the provided "voice" hints.
- Blend **sign, house, nakshatra, and aspects** into ONE cohesive paragraph.
- Interpret; do not just list facts. Speak personally to the seeker.
- Keep **3–5 sentences** per planet.
- No bullet points, no headings, no markdown.

Return STRICT JSON only:

{
  "insights": {
    "PlanetName": {
      "headline": "short label for this placement",
      "summary": "3–5 sentence paragraph in plain text"
    }
  }
}
`;

      const userPayload = {
        planets: perPlanet.map((f) => {
          const voice = planetVoiceFor(f.name);
          return {
            planet: f.name,
            sign: f.sign || undefined,
            house: f.house || undefined,
            nakshatra: f.nakshatra || undefined,
            aspects: f.aspects,
            headline: f.headline,
            voice: {
              tone: voice.tone,
              verbs: voice.verbs,
              cadence: voice.cadence,
              closingIntent: voice.close,
            },
            guidanceStyle: {
              sentenceCount: "3-5",
              avoid: [
                "bulleted lists",
                "overly generic cookbook lines",
                "repeating raw facts verbatim",
              ],
              do: [
                "weave aspects naturally",
                "name growth direction",
                "end with a clear, gentle nudge",
              ],
            },
          };
        }),
      };

      const completion = await client.chat.completions.create({
        model: GPT_MODEL,
        temperature: 0.6,
        max_tokens: 2000,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content:
              "For each planet below, write ONE cohesive paragraph that blends sign, house, nakshatra, and aspect effects. " +
              "Respect the provided voice (tone, verbs, cadence) for that planet. End with the closing intent. " +
              "Avoid bullet points. Keep it compact and human.\n\n" +
              JSON.stringify(userPayload, null, 2),
          },
        ],
      });

      const text = completion?.choices?.[0]?.message?.content?.trim() || "";
      ai = tryParseJson(text);
    } catch (e) {
      ai = null;
      console.error("Batched GPT failed:", e);
    }

    const namesInOrder = perPlanet.map((f) => f.name);
    let aiMap: Record<string, { headline?: string; summary?: string }> = {};

    if (ai?.insights && typeof ai.insights === "object") {
      const keys = Object.keys(ai.insights);
      const looksGeneric = keys.every((k) => /^planet\s*\d+/i.test(k));
      if (looksGeneric && keys.length === namesInOrder.length) {
        keys.forEach((k, i) => {
          aiMap[namesInOrder[i]] = (ai.insights as any)[k];
        });
      } else {
        aiMap = ai.insights;
      }
    }

    // Merge with fallback
    const insights: Record<string, { headline: string; summary: string }> = {};
    for (const f of perPlanet) {
      const g = aiMap?.[f.name];
      const headline = (g?.headline || f.headline || "Placement").trim();

      const base =
        (typeof g?.summary === "string" && g.summary.trim()) ||
        fallbackMeaning(f.raw, f.pairs);

      insights[f.name] = { headline, summary: base.replace(/\s+/g, " ").trim() };
    }

    return NextResponse.json({ insights }, { status: 200 });
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({
        error: "ai_planets_failed",
        message: err?.message || "Unknown error",
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug");
  if (debug) {
    return NextResponse.json({ ok: true, endpoint: "/api/ai-planets", debug: true });
  }
  return NextResponse.json({ ok: true, endpoint: "/api/ai-planets" });
}
