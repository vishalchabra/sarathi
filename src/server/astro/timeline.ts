// FILE: src/server/astro/timeline.ts
//
// High-level "Life Timeline" synthesis:
// - Take Mahadasha / Antardasha / Pratyantardasha windows
// - Overlay important transit-like emphasis for those same windows
// - Produce narrative "event windows" a human can read
//
// This is called by the life-report API route to power "Upcoming Chapters" in UI.

import { DateTime } from "luxon";

import {
  getMahadashaTimeline,
  getAntardashaTimeline,
} from "@/lib/astro/dasha";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

// One slice of PD (Pratyantardasha) as a time window.
export type DashaWindow = {
  mdLord: string;
  adLord: string;
  pdLord: string;
  start: Date;
  end: Date;
};

// A high-level "event window" for UI.
export type LifeEventWindow = {
  from: string; // ISO
  to: string;   // ISO
  label: string;
  score: number; // rough vibe score
  mdLord: string;
  adLord: string;
  pdLord: string;
  highlights: string[]; // bullet points
  blurb: string;        // short paragraph, human-friendly
};

// Minimal natal chart context we need for flavor.
export type ChartContext = {
  planets: Array<{
    name: string;
    house?: number;
    sign?: string;
  }>;
  houseLordMap: Record<
    number,
    {
      lord: string;
      lordHouse?: number;
      lordSign?: string;
    }
  >;
  HOUSE_THEME: Record<number, string>;
};

/* -------------------------------------------------------------------------- */
/* Vimshottari helpers                                                        */
/* -------------------------------------------------------------------------- */

// NOTE: we mirror core dasha math locally so this module is standalone.
// If you prefer, you can import these from your dasha util instead.

const DASHA_ORDER = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
] as const;

const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const TOTAL_VIMSHOTTARI_YEARS = 120;

function yearsToMs(years: number): number {
  const days = years * 365.2425;
  return days * 24 * 60 * 60 * 1000;
}

/**
 * Break a single Antardasha into Pratyantardashas.
 * We approximate PD lengths proportionally:
 *   PD length = AD_length * (YEARS[pdLord] / 120)
 */
function getPratyantardashaTimelineForAntar(antar: {
  mahaLord: string;
  subLord: string;
  start: Date;
  end: Date;
  approxYears: number;
}) {
  const out: Array<{
    mahaLord: string;
    antarLord: string;
    pdLord: string;
    start: Date;
    end: Date;
    approxYears: number;
  }> = [];

  let cursor = new Date(antar.start.getTime());

  for (const pdLord of DASHA_ORDER) {
    const frac = DASHA_YEARS[pdLord] / TOTAL_VIMSHOTTARI_YEARS;
    const spanYears = antar.approxYears * frac;
    const spanMs = yearsToMs(spanYears);

    const estEnd = new Date(cursor.getTime() + spanMs);
    const clippedEnd =
      estEnd.getTime() > antar.end.getTime() ? new Date(antar.end) : estEnd;

    out.push({
      mahaLord: antar.mahaLord,
      antarLord: antar.subLord,
      pdLord,
      start: cursor,
      end: clippedEnd,
      approxYears: spanYears,
    });

    cursor = clippedEnd;
    if (cursor.getTime() >= antar.end.getTime()) break;
  }

  return out;
}

/* -------------------------------------------------------------------------- */
/* Window builder                                                             */
/* -------------------------------------------------------------------------- */

/**
 * buildDashaWindows()
 *
 * Build PD windows (md/ad/pd) near "now", filtered to a reasonable time span.
 */
export function buildDashaWindows(params: {
  birthUTC: Date;
  jdBirth: number;
  moonLonSidDeg: number;
  lookAheadYears?: number;
  lookBackYears?: number;
}): DashaWindow[] {
  const {
    birthUTC,
    jdBirth,
    moonLonSidDeg,
    lookAheadYears = 2,
    lookBackYears = 0.25,
  } = params;

  // 1. Full Mahadasha timeline.
  const mahaList = getMahadashaTimeline(
    birthUTC,
    jdBirth,
    moonLonSidDeg,
    Math.max(120, lookAheadYears + 5) // generous span
  );

  // Time filter window around now.
  const now = DateTime.utc();
  const windowStart = now.minus({ years: lookBackYears }).toMillis();
  const windowEnd = now.plus({ years: lookAheadYears }).toMillis();

  const pdWindows: DashaWindow[] = [];

  for (const maha of mahaList) {
    if (maha.end.getTime() < windowStart) continue;
    if (maha.start.getTime() > windowEnd) continue;

    // Antardashas inside this Mahadasha
    const antars = getAntardashaTimeline(maha);

    for (const antar of antars) {
      if (antar.end.getTime() < windowStart) continue;
      if (antar.start.getTime() > windowEnd) continue;

      // PDs inside this Antar
      const pratyList = getPratyantardashaTimelineForAntar(antar);

      for (const pd of pratyList) {
        if (pd.end.getTime() < windowStart) continue;
        if (pd.start.getTime() > windowEnd) continue;

        pdWindows.push({
          mdLord: pd.mahaLord,
          adLord: pd.antarLord,
          pdLord: pd.pdLord,
          start: pd.start,
          end: pd.end,
        });
      }
    }
  }

  // Sort chronologically.
  pdWindows.sort((a, b) => a.start.getTime() - b.start.getTime());

  return pdWindows;
}

/* -------------------------------------------------------------------------- */
/* Tone helpers (MD/AD climate + PD trigger + vibe)                           */
/* -------------------------------------------------------------------------- */

/**
 * getMdAdBlendTone()
 *
 * Adds "background climate" based on Mahadasha (mdLord) + Antardasha (adLord).
 * This lets Rahu/Ketu feel different from Rahu/Jupiter, etc.
 */
function getMdAdBlendTone(mdLord: string, adLord: string): {
  blendTone: string | null;
  blendScoreAdj: number;
} {
  const key = `${mdLord}/${adLord}`.toLowerCase();

  switch (key) {
    case "rahu/ketu":
      return {
        blendTone:
          "Karmic re-alignment: cutting attachments, exposing what’s fake, being brutally honest with yourself.",
        blendScoreAdj: -0.5,
      };
    case "rahu/jupiter":
      return {
        blendTone:
          "Opportunistic expansion: craving growth, influence, recognition, and bigger stages.",
        blendScoreAdj: 1.5,
      };
    case "rahu/saturn":
      return {
        blendTone:
          "Accountability test: intense workload, maturity checkpoints, ‘prove you deserve it’.",
        blendScoreAdj: -1,
      };
    case "rahu/mercury":
      return {
        blendTone:
          "Deals and positioning: paperwork, negotiation, messaging, pitching ideas.",
        blendScoreAdj: 0.5,
      };
    case "rahu/venus":
      return {
        blendTone:
          "Desire and indulgence: charisma, attraction, comfort-seeking, and reputation polish.",
        blendScoreAdj: 1,
      };
    case "rahu/mars":
      return {
        blendTone:
          "Aggressive push: competition, risk-taking, decisive moves, sometimes friction.",
        blendScoreAdj: 0.5,
      };

    case "saturn/rahu":
      return {
        blendTone:
          "Restless ambition under pressure: wanting breakthrough under strict limits.",
        blendScoreAdj: -0.5,
      };
    case "saturn/jupiter":
      return {
        blendTone:
          "Structured growth: build something durable and credible, not hype.",
        blendScoreAdj: 0.5,
      };
    case "saturn/mercury":
      return {
        blendTone:
          "Detail and compliance: paperwork, process, precision, nothing sloppy.",
        blendScoreAdj: 0,
      };

    case "jupiter/rahu":
      return {
        blendTone:
          "Bold expansion drive: hunger for reach, leverage, and visibility.",
        blendScoreAdj: 1,
      };
    case "jupiter/saturn":
      return {
        blendTone:
          "Long-term positioning: patient, serious moves that can define status.",
        blendScoreAdj: 0,
      };
    case "jupiter/ketu":
      return {
        blendTone:
          "Internal truth check: ‘Does this still match what I claim to believe?’",
        blendScoreAdj: -0.5,
      };

    case "ketu/rahu":
      return {
        blendTone:
          "Identity flip: detaching from an old self while lunging toward a new one.",
        blendScoreAdj: 0,
      };
    case "ketu/jupiter":
      return {
        blendTone:
          "Spiritual audit: wisdom vs ego, humility vs status.",
        blendScoreAdj: -0.5,
      };

    default:
      return { blendTone: null, blendScoreAdj: 0 };
  }
}

/**
 * getPdFlavorTone()
 *
 * PD lord adds the “right now” urgency.
 */
function getPdFlavorTone(pdLord: string): {
  pdTone: string;
  pdScore: number;
} {
  switch (pdLord) {
    case "Jupiter":
      return {
        pdTone:
          "Growth and guidance: teachers, mentors, fortunate openings.",
        pdScore: 3,
      };
    case "Venus":
      return {
        pdTone:
          "Comfort and connection: harmony, affection, aesthetic or relational gains.",
        pdScore: 2,
      };
    case "Saturn":
      return {
        pdTone:
          "Audit-and-build mode: responsibility, structure, and sustained effort.",
        pdScore: -2,
      };
    case "Rahu":
      return {
        pdTone:
          "Edge and experimentation: unusual opportunities, bold risks, appetite for more.",
        pdScore: 1,
      };
    case "Ketu":
      return {
        pdTone:
          "Declutter and distill: detachment, simplification, and quiet inner work.",
        pdScore: -1,
      };
    case "Mars":
      return {
        pdTone:
          "Action bias: initiative, competition, decisive movement.",
        pdScore: 1.5,
      };
    case "Sun":
      return {
        pdTone:
          "Visibility and leadership: status, authority, and vitality step forward.",
        pdScore: 1,
      };
    case "Moon":
      return {
        pdTone:
          "Care and rhythm: home, emotional security, nourishment, sleep, and mood management.",
        pdScore: 0.5,
      };
    case "Mercury":
      return {
        pdTone:
          "Signals and systems: communication, documents, learning, logistics accelerate.",
        pdScore: 1,
      };
    default:
      return {
        pdTone: `${pdLord} colors this stretch with its agenda.`,
        pdScore: 0,
      };
  }
}

/**
 * getTransitOverlayNote()
 *
 * Step 4: faux "transit overlay" flavor. We don't have live ephemeris here,
 * but we can still mention Saturn/Jupiter style influences when they are in play
 * (md/ad/pd). This reads like: "In real time, Saturn influence = slow but
 * durable build", "Jupiter influence = support / luck windows".
 */
function getTransitOverlayNote(actors: string[]): string | null {
  const lower = actors.map((p) => p.toLowerCase());

  const hasSaturn = lower.includes("saturn");
  const hasJupiter = lower.includes("jupiter");

  if (hasSaturn && hasJupiter) {
    return "In real time this feels like serious long-term positioning: patient, structured growth with some helpful openings and guidance.";
  }
  if (hasSaturn) {
    return "In real time Saturn pressure wants durability: slow build, reputation through discipline, not shortcuts.";
  }
  if (hasJupiter) {
    return "In real time Jupiter support is louder: mentorship, protection, timing that feels lucky if you step forward.";
  }

  return null;
}

/**
 * vibeSummaryFromScore()
 *
 * Step 3: adaptive vibe summary based on aggregate score.
 * High score → green light / momentum.
 * Low score → pressure / testing phase.
 */
function vibeSummaryFromScore(score: number): string | null {
  if (score >= 1.5) {
    return "Momentum window: doors tend to open if you act.";
  }
  if (score <= -1) {
    return "Pressure-testing window: patience and discipline matter more than speed.";
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Transit-ish highlighting + tone                                            */
/* -------------------------------------------------------------------------- */

/**
 * getTransitHighlightsForWindow()
 *
 * - dedup house themes (Step 1)
 * - blend MD/AD climate + PD trigger into one narrative (Step 2)
 * - score-based vibe summary (Step 3)
 * - include Saturn/Jupiter style overlay (Step 4)
 */
function getTransitHighlightsForWindow(args: {
  chart: ChartContext;
  window: DashaWindow;
}): { bullets: string[]; rawScore: number; toneLine: string } {
  const { chart, window } = args;

  function findRow(planetName: string) {
    return chart.planets.find(
      (p) => p.name.toLowerCase() === planetName.toLowerCase()
    );
  }

  const mdRow = findRow(window.mdLord);
  const adRow = findRow(window.adLord);
  const pdRow = findRow(window.pdLord);

  // Houses touched by md/ad/pd lords
  const themeHouses = Array.from(
    new Set(
      [mdRow?.house, adRow?.house, pdRow?.house].filter(Boolean) as number[]
    )
  );

  // ---------- tone construction ----------
  const { blendTone, blendScoreAdj } = getMdAdBlendTone(
    window.mdLord,
    window.adLord
  );

  const { pdTone, pdScore } = getPdFlavorTone(window.pdLord);

  const baseScore = (pdScore ?? 0) + (blendScoreAdj ?? 0);

  const transitOverlay = getTransitOverlayNote([
    window.mdLord,
    window.adLord,
    window.pdLord,
  ]);

  const vibeSummary = vibeSummaryFromScore(baseScore);

  // Build one smooth narrative sentence for the paragraph outro / tone.
  // Rules:
  // - Start with blendTone if present (MD/AD climate).
  // - Then flow into PD flavor as "Right now ...".
  // - Then layer transitOverlay if available.
  // - Then vibeSummary for final positioning.
  const parts: string[] = [];

  if (blendTone) {
    parts.push(blendTone); // e.g. "Karmic re-alignment: cutting attachments..."
  }

  // "Right now" phrasing for PD
  if (pdTone) {
    const pdLower =
      pdTone.charAt(0).toLowerCase() + pdTone.slice(1); // lowercase first letter
    parts.push(`Right now the immediate trigger says: ${pdLower}`);
  }

  if (transitOverlay) {
    parts.push(transitOverlay);
  }

  if (vibeSummary) {
    parts.push(`Overall: ${vibeSummary}`);
  }

  const narrativeTone = parts.join(" ");

  // ---------- bullets ----------
  const bullets: string[] = [];

  // Deduped house theme bullets
  for (const h of themeHouses) {
    const theme = chart.HOUSE_THEME?.[h] ?? `House ${h}`;
    const line = `Emphasis on ${theme.toLowerCase()}.`;
    if (!bullets.includes(line)) {
      bullets.push(line);
    }
  }

  // Add blend tone (if present)
  if (blendTone && !bullets.includes(blendTone)) {
    bullets.push(blendTone);
  }

  // Add PD tone if distinct
  if (pdTone && !bullets.includes(pdTone)) {
    bullets.push(pdTone);
  }

  // Add transit overlay if present
  if (transitOverlay && !bullets.includes(transitOverlay)) {
    bullets.push(transitOverlay);
  }

  // Add vibe summary if present
  if (vibeSummary && !bullets.includes(vibeSummary)) {
    bullets.push(vibeSummary);
  }

  return { bullets, rawScore: baseScore, toneLine: narrativeTone };
}

/* -------------------------------------------------------------------------- */
/* Narrative builders                                                         */
/* -------------------------------------------------------------------------- */

/**
 * buildNarrativeIntro()
 * First sentence of the blurb, sets roles:
 * - mdLord = long arc
 * - adLord = current chapter
 * - pdLord = immediate trigger
 */
function buildNarrativeIntro(w: DashaWindow): string {
  return `Long arc: ${w.mdLord}. Current chapter: ${w.adLord}. Immediate trigger: ${w.pdLord}.`;
}

/**
 * buildFocusSentence()
 * Takes the *first* bullet (usually a house theme) and makes it a human line.
 */
function buildFocusSentence(bullets: string[]): string {
  if (!bullets.length) return "";

  // The first bullet is often "Emphasis on X."
  // We'll rephrase to "Main emphasis: X."
  const first = bullets[0]
    .replace(/^Emphasis on\s*/i, "")
    .replace(/\.$/, "");

  if (!first) return "";

  return `Main emphasis: ${first}.`;
}

/**
 * buildOutroTone()
 * Uses the narrativeTone we built (blend tone + PD tone + overlay + vibe).
 */
function buildOutroTone(toneLine: string): string {
  if (!toneLine) return "";
  return toneLine.endsWith(".") ? toneLine : toneLine + ".";
}

/**
 * buildBlurb()
 * Final paragraph for each window.
 *
 * Shape:
 *   [intro] [focus sentence] [tone/outro]
 */
function buildBlurb(args: {
  w: DashaWindow;
  bullets: string[];
  toneLine: string;
}): string {
  const { w, bullets, toneLine } = args;

  const intro = buildNarrativeIntro(w);
  const focus = buildFocusSentence(bullets);
  const outro = buildOutroTone(toneLine);

  // Filter empty parts and join with space.
  return [intro, focus, outro].filter(Boolean).join(" ");
}

/**
 * makeLabel()
 * Short heading for timeline rows.
 *
 * Format:
 *   "Rahu / Ketu / Jupiter — dharma, higher learning, mentors, long journeys"
 *
 * We grab the first bullet's theme and strip "Emphasis on".
 */
function makeLabel(w: DashaWindow, bullets: string[]): string {
  const trio = `${w.mdLord} / ${w.adLord} / ${w.pdLord}`;

  if (bullets.length === 0) return trio;

  const cleaned = bullets[0]
    .replace(/^Emphasis on\s*/i, "")
    .replace(/\.$/, "");

  if (!cleaned) return trio;

  return `${trio} — ${cleaned}`;
}

/* -------------------------------------------------------------------------- */
/* Public: buildLifeEventTimeline()                                           */
/* -------------------------------------------------------------------------- */

/**
 * buildLifeEventTimeline
 *
 * Returns an array of LifeEventWindow in chronological order.
 */
export function buildLifeEventTimeline(args: {
  birthUTC: Date;
  jdBirth: number;
  moonLonSidDeg: number;
  chart: ChartContext;
  lookAheadYears?: number;
  lookBackYears?: number;
  maxWindows?: number;
}): LifeEventWindow[] {
  const {
    birthUTC,
    jdBirth,
    moonLonSidDeg,
    chart,
    lookAheadYears = 2,
    lookBackYears = 0.25,
    maxWindows = 10,
  } = args;

  // 1. raw PD windows
  const pdWindows = buildDashaWindows({
    birthUTC,
    jdBirth,
    moonLonSidDeg,
    lookAheadYears,
    lookBackYears,
  });

  // 2. annotate each window with bullets, score, narrative
  const annotated = pdWindows.map((w) => {
    const { bullets, rawScore, toneLine } = getTransitHighlightsForWindow({
      chart,
      window: w,
    });

    const blurb = buildBlurb({
      w,
      bullets,
      toneLine,
    });

    const label = makeLabel(w, bullets);

    return {
      from: w.start.toISOString(),
      to: w.end.toISOString(),
      label,
      score: rawScore,
      mdLord: w.mdLord,
      adLord: w.adLord,
      pdLord: w.pdLord,
      highlights: bullets,
      blurb,
    } satisfies LifeEventWindow;
  });

  // 3. sort just in case
  annotated.sort(
    (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()
  );

  // 4. cap
  return annotated.slice(0, maxWindows);
}
