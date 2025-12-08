// FILE: src/app/api/sarathi/myths/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { CoreSignals } from "@/server/guides/types";

export type MythCard = {
  myth: string;
  reality: string;
  personalNote?: string;
};

type MythRequestBody = {
  core?: CoreSignals;
};

function normalisePlanetName(p?: string | null): string {
  const s = String(p ?? "").trim().toLowerCase();
  if (!s) return "";
  if (s.startsWith("rahu")) return "rahu";
  if (s.startsWith("ketu")) return "ketu";
  if (s.startsWith("saturn") || s === "shani") return "saturn";
  if (s.startsWith("jupiter") || s === "guru" || s === "brihaspati") return "jupiter";
  if (s.startsWith("venus") || s === "shukra") return "venus";
  if (s.startsWith("mars") || s === "mangal") return "mars";
  if (s.startsWith("mercury") || s === "budh") return "mercury";
  if (s.startsWith("moon")) return "moon";
  if (s.startsWith("sun")) return "sun";
  return s;
}

function extractCurrentMD(core?: CoreSignals): string | null {
  if (!core?.dashaStack || !core.dashaStack.length) return null;
  const md =
    core.dashaStack.find((d) => d.level === "md") ?? core.dashaStack[0];
  return normalisePlanetName(md?.planet);
}

function hasHeavySaturnOrRahuTransits(core?: CoreSignals): boolean {
  if (!core?.transits || !core.transits.length) return false;
  return core.transits.some((t) => {
    const p = normalisePlanetName(t.planet);
    if (p !== "saturn" && p !== "rahu") return false;
    const h = typeof t.house === "number" ? t.house : null;
    if (!h) return false;
    // 2, 8, 11, 12 money / karma houses are sensitive
    return h === 2 || h === 8 || h === 11 || h === 12;
  });
}

function buildMythCards(core?: CoreSignals): MythCard[] {
  const mdPlanet = extractCurrentMD(core);
  const saturnOrRahuHeavy = hasHeavySaturnOrRahuTransits(core);

  const out: MythCard[] = [];

  // --- 1) Rahu Mahadasha myth ---
  if (mdPlanet === "rahu") {
    out.push({
      myth: "Rahu Mahadasha is always terrible and destroys life.",
      reality:
        "Rahu Mahadasha is intense, but not automatically a disaster. It amplifies desire, ambition, foreign or unusual experiences and inner restlessness. Its result depends on Rahu’s house, sign, nakshatra and the dignity of its dispositor.",
      personalNote:
        "You are currently in a Rahu period. It is here to push you out of old comfort zones and expose hidden fears or desires so that you can work with them consciously, not to randomly punish you.",
    });
  } else {
    out.push({
      myth: "Rahu Mahadasha is always terrible and destroys life.",
      reality:
        "Rahu periods exaggerate desire, confusion and unusual paths, but they are also times of breakthroughs, foreign connections and new identities. Charts where Rahu is well placed can use this phase very constructively.",
      personalNote:
        mdPlanet
          ? `You are not in Rahu Mahadasha right now; your main karmic flavour is more about ${mdPlanet} themes. Internet horror stories about Rahu do not map one-to-one onto your current period.`
          : "At present, Rahu is not your main active dasha. Its influence comes more through specific transits than through the overall life chapter.",
    });
  }

  // --- 2) Saturn myth ---
  if (mdPlanet === "saturn" || saturnOrRahuHeavy) {
    out.push({
      myth: "Saturn always only delays, denies and punishes.",
      reality:
        "Saturn does test and slow things down, but its deeper job is to make you mature, disciplined and realistic. It stabilises whatever it finally allows. People often look back on strong Saturn phases as times where foundations were built.",
      personalNote:
        "You are under a heavier Saturn/Rahu influence in this phase. That’s a signal to clean up structures: routines, money, health, responsibilities. When you cooperate with Saturn’s demand for honesty and consistency, the same energy becomes long-term stability instead of just pressure.",
    });
  } else {
    out.push({
      myth: "Saturn always only delays, denies and punishes.",
      reality:
        "Saturn highlights where we have avoided responsibility. It can feel like pressure, but the purpose is correction, not cruelty. When you take small consistent actions in Saturn areas, the same energy becomes support and protection.",
      personalNote:
        "Right now Saturn is not the sole driver of your life chapter. Its transits still matter, but they work together with your running Mahadasha rather than acting alone as a villain.",
    });
  }

  // --- 3) Retrograde planets myth ---
  out.push({
    myth: "Retrograde planets always ruin the chart.",
    reality:
      "Retrograde simply means the planet appears to move backwards from Earth’s view. It often turns the planet’s results more inward, reflective or delayed, not permanently broken. Many people with strong retrograde planets do deep work in that planet’s area.",
    personalNote:
      "If you have retrograde planets, they point to areas where your growth may be more internal and nonlinear. Instead of fear, it is better to ask how to cooperate with that planet’s lessons patiently.",
  });

  // --- 4) Gemstones / fixes myth ---
  out.push({
    myth: "If you don’t wear the ‘right’ gemstone or do the ‘right’ remedy, life will go wrong.",
    reality:
      "Gemstones and remedies are optional supports, not mandatory tickets to a good life. If a planet is fundamentally weak or troubled, blindly strengthening it with stones can even amplify problems. Life outcomes come more from your choices, effort and timing than from objects.",
    personalNote:
      "It is safer to treat remedies as subtle support for sincere effort, not as magic shortcuts. Before wearing any powerful stone, it is better to understand which planet truly needs support in your chart and whether strengthening it is wise.",
  });

  // --- 5) Manglik / marriage doom myth ---
  out.push({
    myth: "Manglik or 'bad' 7th house means marriage is doomed.",
    reality:
      "Challenging 7th-house or Mars patterns show that relationships will require conscious work, clear communication and emotional maturity. They do not guarantee divorce. Many charts with strong Mars or 7th-house tension have passionate but stable partnerships once both people grow.",
    personalNote:
      "Instead of fearing labels like 'Manglik', it is more useful to understand how you handle anger, boundaries and expectations in relationships — and then work on those patterns directly.",
  });

  // Cap to 5 cards for now
  return out.slice(0, 5);
}

// POST handler
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as MythRequestBody;
    const core = body.core;

    // For safety, allow call without core but results will be generic
    const myths = buildMythCards(core);

    return NextResponse.json({ myths }, { status: 200 });
  } catch (err) {
    console.error("myths API error", err);
    return NextResponse.json(
      { error: "Could not build myths." },
      { status: 500 }
    );
  }
}
