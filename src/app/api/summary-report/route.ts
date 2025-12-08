// FILE: src/app/api/summary-report/route.ts
export const runtime = "nodejs";
import "server-only";
import { NextResponse } from "next/server";

type LifeReportView = {
  name?: string;
  birthDateISO?: string;
  birthTime?: string;
  birthTz?: string;
  ascSign?: string;
  moonSign?: string;
  sunSign?: string;
  ascNakshatraName?: string;
  moonNakshatraName?: string;
  moonNakshatraTheme?: string;
  panchang?: {
    weekday?: string;
    tithiName?: string;
    yogaName?: string;
    moonNakshatraName?: string;
    moonNakshatraTheme?: string;
  };
  activePeriods?: {
    mahadasha?: { lord: string; start: string; end: string; summary?: string };
    antardasha?: { mahaLord: string; subLord: string; start: string; end: string; summary?: string };
    pratyantardasha?: { mahaLord: string; antarLord: string; lord: string; start: string; end: string; summary?: string };
  };
  lifeThemes?: {
    careerBlueprint?: string;
    wealthPath?: string;
    relationshipKarma?: string;
    vitalityHealth?: string;
  };
  planets?: Array<{ name: string; sign: string; house?: number; nakshatra?: string }>;
  money?: {
    tilt?: string; currentTilt?: string;
    drivers?: string[]; activeDrivers?: string[];
    score?: number;
  };
};

function offlineSummary(r: LifeReportView): string {
  const lines: string[] = [];

  lines.push(`**Big picture**`);
  const who = [
    r.ascSign ? `Rising ${r.ascSign}` : null,
    r.sunSign ? `Sun ${r.sunSign}` : null,
    r.moonSign ? `Moon ${r.moonSign}` : null,
  ].filter(Boolean).join(" • ");
  if (who) lines.push(`You’re ${who}.`);

  if (r.moonNakshatraName) {
    lines.push(
      `Moon in **${r.moonNakshatraName}**` +
      (r.moonNakshatraTheme ? ` — ${r.moonNakshatraTheme}.` : `.`)
    );
  }

  if (r.panchang?.weekday || r.panchang?.tithiName || r.panchang?.yogaName) {
    lines.push(
      `Panchang snapshot: ` +
      [
        r.panchang?.weekday ? `Weekday ${r.panchang.weekday}` : null,
        r.panchang?.tithiName ? `Tithi ${r.panchang.tithiName}` : null,
        r.panchang?.yogaName ? `Yoga ${r.panchang.yogaName}` : null,
      ]
        .filter(Boolean)
        .join("; ") + `.`
    );
  }

  const md = r.activePeriods?.mahadasha;
  const ad = r.activePeriods?.antardasha;
  if (md) {
    lines.push(
      `**Current Dasha focus**: ${md.lord} Mahadasha (${new Date(md.start).toLocaleDateString()} → ${new Date(md.end).toLocaleDateString()}).` +
      (md.summary ? ` ${md.summary}` : ``)
    );
  }
  if (ad) {
    lines.push(
      `Running ${ad.subLord} Antardasha within ${ad.mahaLord}.` +
      (ad.summary ? ` ${ad.summary}` : ``)
    );
  }

  // Themes
  const t = r.lifeThemes || {};
  const themed: string[] = [];
  if (t.careerBlueprint) themed.push(`**Career** — ${t.careerBlueprint}`);
  if (t.wealthPath) themed.push(`**Wealth** — ${t.wealthPath}`);
  if (t.relationshipKarma) themed.push(`**Relationships** — ${t.relationshipKarma}`);
  if (t.vitalityHealth) themed.push(`**Health** — ${t.vitalityHealth}`);
  if (themed.length) {
    lines.push(`\n**Themes**`);
    lines.push(...themed);
  }

  // Money tilt + drivers
  const tilt = (r.money?.currentTilt ?? r.money?.tilt) as string | undefined;
  const drivers = r.money?.activeDrivers ?? r.money?.drivers ?? [];
  if (tilt || drivers.length) {
    lines.push(`\n**Money**`);
    if (tilt) lines.push(`Tilt: ${tilt.replaceAll("_", " ")}.`);
    if (drivers.length) lines.push(`Active drivers: ${drivers.join(", ")}.`);
  }

  // Planet highlights
  if (Array.isArray(r.planets) && r.planets.length) {
    const items = r.planets
      .slice(0, 5)
      .map(p => `${p.name} in ${p.sign}${typeof p.house === "number" ? ` (House ${p.house})` : ""}${p.nakshatra ? ` — ${p.nakshatra}` : ""}`);
    lines.push(`\n**Planet highlights**`);
    lines.push(...items);
  }

  lines.push(`\nThis is a concise offline summary. Enable billing or switch to a key with quota to get the rich, narrative AI write-up.`);

  return lines.join("\n");
}

async function callOpenAI(system: string, user: string, key: string) {
  // Chat Completions (broadly supported)
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.SUMMARY_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(String(data?.error?.message || res.statusText));
    // @ts-ignore
    err["status"] = res.status;
    // @ts-ignore
    err["raw"] = data;
    throw err;
  }

  const text = data?.choices?.[0]?.message?.content ?? "";
  return String(text);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const report = (body?.report || {}) as LifeReportView;

    const key = process.env.OPENAI_API_KEY?.trim();
    const system = `You are an expert Vedic astrology writer. Produce a warm, practical, structured summary (3–6 short paragraphs, with bolded section headers like "Career", "Wealth", "Relationships", "Health"). Keep it concise, non-fatalistic, and actionable.`;
    const user = `Write a narrative summary for this report (JSON):\n${JSON.stringify(report)}`;

    // Allow forced offline via env
    if (!key || process.env.OFFLINE_SUMMARY === "1") {
      return NextResponse.json({ summary: offlineSummary(report), usedFallback: true }, { status: 200 });
    }

    try {
      const ai = await callOpenAI(system, user, key);
      return NextResponse.json({ summary: ai, usedFallback: false }, { status: 200 });
    } catch (e: any) {
      const status = e?.status ?? 500;
      const msg = String(e?.message || "OpenAI call failed");

      // If quota / rate / auth — gracefully fall back to offline summary
      if (status === 401 || status === 402 || status === 429) {
        const sum = offlineSummary(report);
        return NextResponse.json(
          { summary: sum, usedFallback: true, hint: `AI fallback used: ${status} ${msg}` },
          { status: 200, headers: { "x-fallback": "offline" } }
        );
      }

      // For other errors, bubble an explicit error
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || "Bad Request") }, { status: 400 });
  }
}
