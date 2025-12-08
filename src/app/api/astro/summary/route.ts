import { NextResponse } from "next/server";

import type { Birth, PlanetPos, PlanetPackMap } from "@/server/astro/types";
import { getNatal } from "@/server/ephemeris";
import { getNakshatra } from "@/server/astro/nakshatra";
import { buildHousewiseNarrative } from "@/server/astro/houses/reader";

// ---- Planet Builders ----
import { buildSunPack } from "@/server/astro/sun";
import { buildMoonPack } from "@/server/astro/moon";
import { buildMarsPack } from "@/server/astro/mars";
import { buildMercuryPack } from "@/server/astro/mercury";
import { buildVenusPack } from "@/server/astro/venus";
import { buildJupiterPack } from "@/server/astro/jupiter";
import { buildSaturnPack } from "@/server/astro/saturn";
import { buildRahuPack } from "@/server/astro/rahu";
import { buildKetuPack } from "@/server/astro/ketu";

// ---- Ascendant helpers ----
import { computeAscendant } from "@/server/astro/asc";
import { ascendantTraits } from "@/server/astro/asc_traits";

// ------------------------------------------------------------
// Helper: ensure nakshatra enrichment
// ------------------------------------------------------------
function enrichNak(pos: PlanetPos): PlanetPos {
  if (!pos.nakName || !pos.pada) {
    const nk = getNakshatra(pos.lon);
    return { ...pos, nakName: nk.name, pada: nk.pada as 1 | 2 | 3 | 4 };
  }
  return pos;
}

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const birth: Birth | undefined = body.birth;
    let positions: PlanetPos[] | undefined = body.positions;

    if (!positions && birth) positions = await getNatal(birth) as PlanetPos[];
    if (!Array.isArray(positions) || positions.length === 0) {
      return NextResponse.json({ error: "Provide either positions[] or birth{}" }, { status: 400 });
    }

    positions = positions.map(enrichNak);

    // -------------------- Ascendant Calculation --------------------
    let asc: { sign: string; degree: number } | undefined = undefined;
    try {
      if (birth) asc = await computeAscendant(birth);
    } catch (e) {
      console.warn("Ascendant calculation failed, skipping:", e);
    }

    const ascSign = asc?.sign || "Unknown";
    const ascDetails = ascendantTraits[ascSign] || { summary: "", element: "", modality: "" };

    // --------------------- Planetary Packs ---------------------
    const planets: PlanetPackMap = {
      sun: buildSunPack(positions),
      moon: buildMoonPack(positions),
      mars: buildMarsPack(positions),
      mercury: buildMercuryPack(positions),
      venus: buildVenusPack(positions),
      jupiter: buildJupiterPack(positions),
      saturn: buildSaturnPack(positions),
      rahu: buildRahuPack(positions),
      ketu: buildKetuPack(positions),
    };

    // --------------------- Housewise Summary ---------------------
    const housewise = buildHousewiseNarrative(planets);

    // --------------------- Purpose & Tone ---------------------
    const tone = buildLifeSummary(ascSign, planets);
    const purpose = buildSoulPurpose(ascSign, planets);

    // --------------------- Final Response ---------------------
    return NextResponse.json({
      profile: { birth, ascendant: asc },
      summary: {
        ascendant: ascSign,
        element: ascDetails.element,
        modality: ascDetails.modality,
        personality: ascDetails.summary,
        tone,
        purpose,
      },
      planets,
      housewise,
      meta: { generatedAt: new Date().toISOString() },
    });

  } catch (e: any) {
    console.error("Summary route error:", e);
    return NextResponse.json({ error: e?.message || "Failed to generate summary" }, { status: 500 });
  }
}

// ------------------------------------------------------------
// Build overall life tone
// ------------------------------------------------------------
function buildLifeSummary(asc: string, planets: PlanetPackMap): string {
  const s = asc.toLowerCase();
  const themes: string[] = [];

  if (planets.sun?.scores?.confidence || planets.mars?.scores?.strength)
    themes.push("strong willpower and leadership potential");
  if (planets.moon?.scores?.emotion || planets.venus?.scores?.love)
    themes.push("deep emotional and relational awareness");
  if (planets.jupiter?.scores?.wisdom)
    themes.push("natural teacher or mentor vibe");
  if (planets.saturn?.scores?.discipline)
    themes.push("grounded and responsible by nature");
  if (planets.rahu?.scores?.ambition)
    themes.push("driven toward worldly success and innovation");
  if (planets.ketu?.scores?.spirituality)
    themes.push("ultimately drawn toward detachment and self-realization");

  const trait = ascendantTraits[asc]?.summary || "";
  return `${asc} Ascendant — ${trait}${themes.length ? ". Life shows " + themes.join(", ") + "." : ""}`;
}

// ------------------------------------------------------------
// Build "Soul Purpose" summary (Three-Layer Sārathi Engine)
// ------------------------------------------------------------
function buildSoulPurpose(asc: string, planets: PlanetPackMap) {
  const sunSign = planets.sun?.natal?.sign || "";
  const moonSign = planets.moon?.natal?.sign || "";
  const jupiterSign = planets.jupiter?.natal?.sign || "";
  const ketuSign = planets.ketu?.natal?.sign || "";
  const rahuSign = planets.rahu?.natal?.sign || "";

  const material: string[] = [];
  const emotional: string[] = [];
  const spiritual: string[] = [];

  // 🌞 Ascendant — Material Path
  if (/Aries/i.test(asc)) material.push("Born to initiate, lead, and carve new paths with courage.");
  else if (/Taurus/i.test(asc)) material.push("Here to build stability, wealth, and beauty through persistence.");
  else if (/Gemini/i.test(asc)) material.push("Meant to communicate, teach, and connect ideas across boundaries.");
  else if (/Cancer/i.test(asc)) material.push("Purpose rooted in nurturing, protection, and creating emotional security.");
  else if (/Leo/i.test(asc)) material.push("Meant to shine creatively, lead, and uplift through self-expression.");
  else if (/Virgo/i.test(asc)) material.push("Called to serve with precision — purpose through healing and improvement.");
  else if (/Libra/i.test(asc)) material.push("Here to bring harmony, justice, and beauty into relationships and systems.");
  else if (/Scorpio/i.test(asc)) material.push("Born to transform, manage crises, and uncover hidden power.");
  else if (/Sagittarius/i.test(asc)) material.push("Purpose thrives in teaching, travel, and guiding others toward meaning.");
  else if (/Capricorn/i.test(asc)) material.push("Destined to build legacy through structure, discipline, and leadership.");
  else if (/Aquarius/i.test(asc)) material.push("Purpose lies in reforming society and inspiring collective growth.");
  else if (/Pisces/i.test(asc)) material.push("Here to express compassion, creativity, and spiritual imagination.");

  // 🌕 Moon — Emotional Path
  if (/Cancer|Pisces|Scorpio/i.test(moonSign))
    emotional.push("You feel most alive when nurturing emotional safety and deep connection.");
  else if (/Taurus|Virgo|Capricorn/i.test(moonSign))
    emotional.push("You find peace through responsibility, order, and tangible progress.");
  else if (/Gemini|Libra|Aquarius/i.test(moonSign))
    emotional.push("Your emotions thrive through ideas, balance, and shared understanding.");
  else if (/Aries|Leo|Sagittarius/i.test(moonSign))
    emotional.push("Passion fuels your emotions — you recharge through inspiration and purpose.");

  // ♃ Jupiter — Spiritual Expansion
  if (/Sagittarius|Pisces/i.test(jupiterSign))
    spiritual.push("Your soul expands through teaching, wisdom, and faith in divine order.");
  else if (/Cancer/i.test(jupiterSign))
    spiritual.push("You evolve by nurturing, protecting, and healing others selflessly.");
  else if (/Capricorn/i.test(jupiterSign))
    spiritual.push("Spiritual mastery comes through discipline and grounded ethics.");
  else if (/Gemini|Virgo/i.test(jupiterSign))
    spiritual.push("You grow by translating spiritual truths into practical service.");

  // ☋ Ketu — Liberation
  if (/Pisces|Cancer|Scorpio/i.test(ketuSign))
    spiritual.push("You are releasing emotional attachments to reach transcendence.");
  else if (/Virgo|Capricorn|Taurus/i.test(ketuSign))
    spiritual.push("You’re learning surrender over control and mastery of selfless action.");
  else if (/Gemini|Libra|Aquarius/i.test(ketuSign))
    spiritual.push("You detach from overthinking to find stillness and higher wisdom.");
  else if (/Aries|Leo|Sagittarius/i.test(ketuSign))
    spiritual.push("You surrender ego to embody divine inspiration.");

  // ☊ Rahu — Worldly Catalyst
  if (/Leo|Aries|Capricorn/i.test(rahuSign))
    material.push("Worldly success unfolds through courageous leadership and initiative.");
  else if (/Libra|Taurus|Cancer/i.test(rahuSign))
    emotional.push("You grow through empathy, relationships, and emotional wisdom.");

  // Return layered structure
  return {
    material: material.join(" "),
    emotional: emotional.join(" "),
    spiritual: spiritual.join(" "),
    combined: [
      "Material:", material.join(" "),
      "Emotional:", emotional.join(" "),
      "Spiritual:", spiritual.join(" ")
    ].join(" "),
  };
}
