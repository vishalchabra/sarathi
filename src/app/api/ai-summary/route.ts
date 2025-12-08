export const runtime = "nodejs";

import "server-only";
import { NextResponse } from "next/server";
import { openai, GPT_MODEL } from "@/lib/ai";

/* ---------------- basics ---------------- */
type Style = "direct" | "poetic" | "corporate";
function okJson(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
function badJson(message: string, status = 400) {
  return okJson({ error: message, modelUsed: GPT_MODEL }, status);
}
export async function GET() {
  return okJson({ ok: true, modelUsed: GPT_MODEL });
}

/* ---------------- types used from page ---------------- */
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;
type Sign = typeof SIGNS[number];

type PlanetRow = { name: string; sign?: string; house?: number; nakshatra?: string; note?: string };
type Report = {
  name?: string;
  birthDateISO?: string;
  birthTime?: string;
  birthTz?: string;
  birthLat?: number;
  birthLon?: number;

  ascSign?: Sign;
  moonSign?: Sign;
  sunSign?: Sign;
  ascNakshatraName?: string;
  moonNakshatraName?: string;
  planets?: PlanetRow[];

  activePeriods?: {
    mahadasha?: { lord: string; start: string; end: string; summary?: string };
    antardasha?: { mahaLord: string; subLord: string; start: string; end: string; summary?: string };
    pratyantardasha?: { mahaLord: string; antarLord: string; lord: string; start: string; end: string; summary?: string };
  };
  transitWindows?: Array<{
    from: string; to: string; focusArea: string; driver: string;
    riskFlag?: "caution" | "opportunity" | "mixed";
    summary: string; actions?: string[];
  }>;
};

/* ---------------- markdown → structured coercer ---------------- */
type Structured = {
  overview?: string;
  personality?: string;
  career?: string;
  relationships?: string;
  health?: string;
  spiritual?: string;
  keyPoints?: string[];
};

function pickFirstParagraph(block?: string) {
  if (!block) return undefined;
  const lines = block.trim().split(/\n/).map((s) => s.trim()).filter(Boolean);
  return lines.join(" ").replace(/\s+/g, " ").trim();
}

function coerceFromMarkdown(md: string): Structured | null {
  if (!md || !/\w/.test(md)) return null;

  const text = md.replace(/\r/g, "").replace(/^\s*[-*]\s+/gm, "• ").replace(/^#+\s*/gm, "").trim();

  const grab = (label: string) => {
    const re = new RegExp(
      `(^|\\n)\\s*\\**${label}\\**\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\*{0,2}[A-Z][^\\n]*:?\\s*\\n|$)`,
      "i"
    );
    const m = text.match(re);
    return m ? m[2].trim() : "";
  };

  const out: Structured = {
    overview: pickFirstParagraph(grab("Current Tone") || grab("Overview")),
    personality: pickFirstParagraph(grab("Personality")),
    career: pickFirstParagraph(grab("Career") || grab("Career / Money") || grab("Work")),
    relationships: pickFirstParagraph(grab("Relationships") || grab("Love / Partners")),
    health: pickFirstParagraph(grab("Health") || grab("Vitality")),
    spiritual: pickFirstParagraph(grab("Spiritual") || grab("Spirituality")),
    keyPoints: [],
  };

  const doBlock = grab("Do");
  const dontBlock = grab("Don't") || grab("Dont");
  const bullets = (src: string) =>
    src.split(/\n|•/).map((s) => s.trim()).filter((s) => s && !/^[-–—]+$/.test(s));
  out.keyPoints = [...bullets(doBlock).slice(0, 3), ...bullets(dontBlock).slice(0, 2)];

  const hasAny = Object.values(out).some((v) => (Array.isArray(v) ? v.length : !!v));
  return hasAny ? out : null;
}

/* ---------------- compact Nakshatra profiles (fallback) ---------------- */
type NakProfile = {
  archetype: string;
  strengths: string[];
  watch: string[];
  work: string[];
  love: string[];
  health: string[];
  mantra: string;
};
const NAK: Record<string, NakProfile> = {
  Ashwini: { archetype:"first spark",
    strengths:["quick starts","courage"], watch:["impatience"], work:["short sprints"], love:["direct, needs space"], health:["mobility 10–15m"], mantra:"Start clean; finish cleaner." },
  Bharani:{ archetype:"transformer",
    strengths:["endurance","responsibility"], watch:["overload"], work:["scoped commitments"], love:["devotion with depth"], health:["steady meals + breath"], mantra:"Carry well; release on time." },
  Krittika:{ archetype:"refiner",
    strengths:["editing","precision"], watch:["harsh tone"], work:["reviews & cleanups"], love:["clear expectations"], health:["warm simple meals"], mantra:"Cut to clarify, not to wound." },
  Rohini:{ archetype:"cultivator",
    strengths:["beauty","growth"], watch:["comfort inertia"], work:["patient compounding"], love:["security & rituals"], health:["grounding foods"], mantra:"Tend daily; growth follows." },
  Mrigashira:{ archetype:"seeker",
    strengths:["curiosity"], watch:["restless hopping"], work:["test–learn loops"], love:["playful discovery"], health:["light cardio"], mantra:"Explore lightly; commit by evidence." },
  Ardra:{ archetype:"storm→clarity",
    strengths:["truth-telling"], watch:["overwhelm"], work:["turnarounds"], love:["radical honesty"], health:["nervous-system care"], mantra:"Feel fully; speak softly; act cleanly." },
  Punarvasu:{ archetype:"renewal",
    strengths:["resilience"], watch:["looping"], work:["iterate back to core"], love:["second chances"], health:["sleep regularity"], mantra:"Try again, better aligned." },
  Pushya:{ archetype:"nourisher",
    strengths:["discipline that feeds"], watch:["rigidity"], work:["ritualized routines"], love:["acts of service"], health:["soups, oiling"], mantra:"Build rituals that feed the soul." },
  Ashlesha:{ archetype:"serpent insight",
    strengths:["strategy"], watch:["entanglement"], work:["systems mapping"], love:["intense loyalty"], health:["detox cycles"], mantra:"Bind by consent; unbind by wisdom." },
  Magha:{ archetype:"dignified lineage",
    strengths:["leadership"], watch:["status chasing"], work:["own the room"], love:["respect + warmth"], health:["cooling play"], mantra:"Lead by service, not spotlight." },
  PurvaPhalguni:{ archetype:"creator of ease",
    strengths:["hospitality"], watch:["excess"], work:["brand/story"], love:["romance rituals"], health:["hydrate; early nights"], mantra:"Create through warmth, not force." },
  UttaraPhalguni:{ archetype:"vows & frameworks",
    strengths:["commitment"], watch:["over-responsibility"], work:["contracts & SLAs"], love:["reliable presence"], health:["core + sleep"], mantra:"Commit clearly; prosper steadily." },
  Hasta:{ archetype:"hand-skill",
    strengths:["craft","organization"], watch:["nitpicking"], work:["kanban clarity"], love:["helpful acts"], health:["wrist/hand care"], mantra:"Make with care; let go on time." },
  Chitra:{ archetype:"architect–designer",
    strengths:["structure + beauty"], watch:["over-engineering"], work:["system + style guides"], love:["shared builds"], health:["strength + mobility"], mantra:"Make it beautiful and true." },
  Swati:{ archetype:"independent wind",
    strengths:["flexibility"], watch:["drift"], work:["async deep work"], love:["space + trust"], health:["breathwork"], mantra:"Bend; don’t break." },
  Vishakha:{ archetype:"focused quest",
    strengths:["aim & persistence"], watch:["tunnel vision"], work:["one OKR at a time"], love:["aligned goals"], health:["timed sprints"], mantra:"Choose one aim and advance." },
  Anuradha:{ archetype:"devotion & friendship",
    strengths:["loyal bonds"], watch:["people-pleasing"], work:["ally networks"], love:["steady affection"], health:["gratitude walk"], mantra:"Win through loyalty." },
  Jyeshtha:{ archetype:"senior power",
    strengths:["responsibility"], watch:["burden hoarding"], work:["own outcomes"], love:["gentle debriefs"], health:["stress hygiene"], mantra:"Carry power with grace." },
  Mula:{ archetype:"root-cutter",
    strengths:["simplification"], watch:["scorched-earth"], work:["debt cleanup"], love:["radical clarity"], health:["spices balance"], mantra:"Uproot; keep the good soil." },
  Purvashadha:{ archetype:"victory drive",
    strengths:["campaign energy"], watch:["over-selling"], work:["launches"], love:["cheerlead + protect"], health:["intervals + cooling"], mantra:"Gather allies; move." },
  Uttarashadha:{ archetype:"enduring success",
    strengths:["long game"], watch:["rigidity"], work:["governance"], love:["traditions"], health:["bone strength"], mantra:"Rightful wins endure." },
  Shravana:{ archetype:"listener",
    strengths:["learning"], watch:["analysis paralysis"], work:["SOPs / teach-backs"], love:["attentive presence"], health:["neck/ear care"], mantra:"Listen; then lead the path." },
  Dhanishta:{ archetype:"rhythm & wealth",
    strengths:["timing","assets"], watch:["comparison"], work:["cadence boards"], love:["shared rhythm"], health:["rhythmic workouts"], mantra:"Move in rhythm; compound steadily." },
  Shatabhisha:{ archetype:"healer of systems",
    strengths:["repair","detox"], watch:["aloofness"], work:["debug/ops health"], love:["space + honesty"], health:["sleep/circadian"], mantra:"Clean systems, clean life." },
  PurvaBhadrapada:{ archetype:"intense vision",
    strengths:["focus fire"], watch:["extremes"], work:["mission builds"], love:["devotional"], health:["grounding foods"], mantra:"Direct fire into purpose." },
  UttaraBhadrapada:{ archetype:"deep waters",
    strengths:["compassion"], watch:["passivity"], work:["quiet mastery"], love:["gentle loyalty"], health:["warmth + oils"], mantra:"Soft strength, steady action." },
  Revati:{ archetype:"safe passage",
    strengths:["guidance","completion"], watch:["drift"], work:["finishers"], love:["tender care"], health:["digestive ease"], mantra:"Protect journeys; finish well." },
};

function nakOf(name?: string) {
  if (!name) return null;
  const key = name.replace(/\s+/g, "");
  return NAK[key] || null;
}
function nakBlend(m?: NakProfile | null, a?: NakProfile | null, s?: NakProfile | null) {
  const pick = (sel: (x: NakProfile) => string[]) => {
    const out: string[] = [];
    if (m) out.push(...sel(m));
    if (a) out.push(sel(a)[0] || "");
    if (s) out.push(sel(s)[0] || "");
    return out.filter(Boolean);
  };
  return {
    archetype: m?.archetype || a?.archetype || s?.archetype || "",
    strengths: pick((x) => x.strengths).slice(0, 3),
    watch: pick((x) => x.watch).slice(0, 3),
    work: pick((x) => x.work).slice(0, 3),
    love: pick((x) => x.love).slice(0, 3),
    health: pick((x) => x.health).slice(0, 3),
    mantra: m?.mantra || a?.mantra || s?.mantra || "",
  };
}

function nakSummary(report: Report, style: Style): Structured {
  const moon = nakOf(report.moonNakshatraName);
  const asc = nakOf(report.ascNakshatraName);
  const sun = nakOf(
    report.planets?.find((p) => (p.name || "").toLowerCase() === "sun")?.nakshatra
  );
  const mix = nakBlend(moon, asc, sun);

  const stylify = (t: string) =>
    style === "poetic" ? (t.endsWith(".") ? t : t + ".")
    : style === "corporate" ? t.replace(/\bmay\b/gi, "can")
    : t;

  const overview = stylify(
    `Nakshatra tone via Moon (${report.moonNakshatraName ?? "—"}): ${mix.archetype}.`
  );
  const personality = stylify(
    `Strengths: ${mix.strengths.join(" • ")}. Watch-outs: ${mix.watch.join(" • ")}.`
  );
  const career = stylify(`Work style: ${mix.work.join(" • ")}.`);
  const relationships = stylify(`Relationship style: ${mix.love.join(" • ")}.`);
  const health = stylify(`Health style: ${mix.health.join(" • ")}.`);
  const spiritual = stylify(mix.mantra ? `Mantra: ${mix.mantra}` : "Trust rhythm over intensity.");

  const keyPoints = [
    mix.strengths[0] && `Double down on ${mix.strengths[0]}.`,
    mix.watch[0] && `Design guardrails for ${mix.watch[0]}.`,
    mix.work[0] && `Shape the week around ${mix.work[0]}.`,
  ].filter(Boolean) as string[];

  return { overview, personality, career, relationships, health, spiritual, keyPoints };
}

/* ---------------- route ---------------- */
type AIRequest = { style?: Style; report?: Report };

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const qpStyle = (url.searchParams.get("style") as Style) || undefined;
    const body = ((await req.json().catch(() => ({}))) || {}) as AIRequest;
    const style: Style = body?.style || qpStyle || "direct";

    const report = body?.report as Report | undefined;
    if (!report) return badJson("Missing report", 400);

    /* 1) Try the model */
    const facts: string[] = [];
    if (report.ascNakshatraName) facts.push(`Asc Nakshatra: ${report.ascNakshatraName}`);
    if (report.moonNakshatraName) facts.push(`Moon Nakshatra: ${report.moonNakshatraName}`);
    if (report.moonSign) facts.push(`Moon Sign: ${report.moonSign}`);
    if (report.ascSign) facts.push(`Ascendant: ${report.ascSign}`);
    if (report.sunSign) facts.push(`Sun Sign: ${report.sunSign}`);
    if (report.activePeriods?.mahadasha)
      facts.push(
        `MD: ${report.activePeriods.mahadasha.lord} ${report.activePeriods.mahadasha.start}→${report.activePeriods.mahadasha.end}`
      );
    if (report.activePeriods?.antardasha)
      facts.push(
        `AD: ${report.activePeriods.antardasha.subLord} ${report.activePeriods.antardasha.start}→${report.activePeriods.antardasha.end}`
      );

    const systemPrompt =
      "You are Sārathi, a precise Vedic-astrology analyst. Use only provided facts. " +
      "Prefer Nakshatra-based personality, then add clear actions. Keep it compact. " +
      "Write sections: Current Tone, Career, Relationships, Health, Spiritual, Do/Don’t. " +
      "Return clean markdown with those headings (no intro header).";

    try {
      const completion = await openai.chat.completions.create({
        model: GPT_MODEL,
        temperature: 0.2,
        max_tokens: 800,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `FACTS:\n${facts.join("\n")}` },
        ],
      });
      const text = completion.choices?.[0]?.message?.content?.trim() || "";
      const structured = text ? coerceFromMarkdown(text) : null;
      if (structured) {
        // ✅ Wrap as { summary: {...} } to match the page’s preferred shape
        return okJson({ summary: structured, modelUsed: GPT_MODEL });
      }
    } catch {
      // fall through to deterministic fallback
    }

    /* 2) Deterministic Nakshatra fallback (always returns content) */
    const fallback = nakSummary(report, style);
    return okJson({ summary: fallback, modelUsed: `${GPT_MODEL} (fallback-local)` });
  } catch (err: any) {
    try {
      const body = ((await req.json().catch(() => ({}))) || {}) as AIRequest;
      const style: Style = body?.style || "direct";
      const report = body?.report as Report | undefined;
      if (!report) return badJson("Missing report", 400);
      const fb = nakSummary(report, style);
      return okJson({ summary: fb, modelUsed: `${GPT_MODEL} (fallback-local-error)` }, 200);
    } catch {
      return okJson(
        { error: "ai_summary_failed", details: String(err), modelUsed: GPT_MODEL },
        502
      );
    }
  }
}
