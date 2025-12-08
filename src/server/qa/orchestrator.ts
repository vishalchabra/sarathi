// FILE: src/lib/qa/orchestrator.ts

/* -------------------------------------------------------------
   Orchestrator v5 — profile-first MD/AD + simple transit scorer
   - NO dynamic imports (Turbopack-safe)
   - Uses profile.mdad if present, else profile.dasha, else mock
------------------------------------------------------------- */

export type Category =
  | "vehicle"
  | "job"
  | "property"
  | "relationships"
  | "disputes"
  | "transit";

type Place = { name?: string; tz?: string; lat?: number; lon?: number };

type MDAD = {
  md: { planet: string; start: string | null; end: string | null };
  ad: { planet: string; start: string | null; end: string | null };
  nextADs: Array<{ planet: string; start: string | null; end: string | null }>;
};

type TransitHit = {
  at: string;
  planet: string;
  aspect?: string;
  score: number;
  note?: string;
};

type NatalBasics = {
  houses?: Record<number, { lord?: { name?: string; strength?: number } }>;
  planets?: Record<
    string,
    {
      dignity?: number;
      strength?: number;
      benefic?: boolean;
      house?: number;
      sign?: string;
    }
  >;
};

type Profile = {
  name?: string;
  dobISO?: string;
  tob?: string;
  place?: Place;
  mdad?: MDAD;
  dasha?: any; // full dasha block saved from life-report (used as fallback)
};

type Inputs = {
  question?: string;
  category: Category;
  dobISO?: string | null;
  tob?: string | null;
  place?: Place | null;
  profile?: Profile | null;

  // Optional overrides
  mdadOverride?: MDAD | null;
  transitsOverride?: TransitHit[] | null;
};

/* ---------------- utilities ---------------- */
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addWeeks = (d: Date, n: number) => addDays(d, n * 7);
const addMonths = (d: Date, n: number) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
const fmtRange = (a: Date, b: Date) => {
  const o = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${o(a)}–${o(b)}`;
};
const stableHash = (s: string) => [...s].reduce((a, c) => ((a * 131) ^ c.charCodeAt(0)) >>> 0, 7);

/* ---------------- very-light natal mock ---------------- */
function mockNatal(dobISO?: string, tob?: string): NatalBasics {
  const seed = stableHash((dobISO || "") + "|" + (tob || ""));
  const r01 = (k: number) => ((seed >> (k * 3)) & 255) / 255;
  const dignity = () => Math.round((r01(1) * 4 - 2) * 10) / 10;
  const strength = () => Math.round(r01(2) * 100) / 100;

  return {
    houses: { 4: { lord: { name: "Lord4", strength: strength() } } },
    planets: {
      Venus: { dignity: dignity(), strength: strength(), benefic: true, house: 4 },
      Jupiter:{ dignity: dignity(), strength: strength(), benefic: true },
      Saturn: { dignity: dignity(), strength: strength(), benefic: false },
      Mars:   { dignity: dignity(), strength: strength(), benefic: false },
      Mercury:{ dignity: dignity(), strength: strength(), benefic: true },
      Moon:   { dignity: dignity(), strength: strength(), benefic: true },
      Sun:    { dignity: dignity(), strength: strength(), benefic: true },
      Rahu:   { dignity: dignity(), strength: strength(), benefic: false },
      Ketu:   { dignity: dignity(), strength: strength(), benefic: false },
    },
  };
}

function vehiclePromiseScore(natal: NatalBasics): { score: number; notes: string[] } {
  let s = 0; const notes: string[] = [];
  const lord4 = natal.houses?.[4]?.lord?.strength ?? 0;
  if (lord4 > 0.66) { s += 2; notes.push("Strong 4th-house lord"); }
  else if (lord4 > 0.4) { s += 1; notes.push("Moderate 4th-house lord"); }
  else notes.push("Weak 4th-house lord");
  const ven = natal.planets?.Venus;
  if (ven) {
    if ((ven.dignity ?? 0) >= 0) { s += 1; notes.push("Venus dignity/support"); }
    if ((ven.strength ?? 0) > 0.6) { s += 1; notes.push("Venus strength"); }
  }
  const jup = natal.planets?.Jupiter;
  if ((jup?.strength ?? 0) > 0.6) { s += 1; notes.push("Jupiter support"); }
  const satW = (natal.planets?.Saturn?.dignity ?? 0) < -0.5;
  const marW = (natal.planets?.Mars?.dignity ?? 0) < -0.5;
  if (satW && marW) { s -= 1; notes.push("Saturn/Mars affliction"); }
  return { score: clamp(s, 0, 4), notes };
}

/* ---------------- derive MD/AD from a saved dasha block ---------------- */
function mdadFromDashaBlock(dasha: any): MDAD | null {
  if (!dasha) return null;

  const cur = dasha.current || {};
  const mdPlanet = cur.mahadasha || cur.md || cur.MD || cur.MDPlanet || "";
  const adPlanet = cur.antardasha || cur.ad || cur.AD || cur.ADPlanet || "";

  const mdStart = cur.mdStart || cur.MDStart || cur.md_start || cur.md_from || cur.fromMD || cur.startMD || null;
  const mdEnd   = cur.mdEnd   || cur.MDEnd   || cur.md_end   || cur.md_to   || cur.toMD   || cur.endMD   || null;

  const adStart = cur.adStart || cur.ADStart || cur.ad_start || cur.ad_from || cur.fromAD || cur.startAD || null;
  const adEnd   = cur.adEnd   || cur.ADEnd   || cur.ad_end   || cur.ad_to   || cur.toAD   || cur.endAD   || null;

  const adList: any[] = Array.isArray(dasha.AD) ? dasha.AD : Array.isArray(dasha.Ad) ? dasha.Ad : [];
  const nextADs: Array<{ planet: string; start: string | null; end: string | null }> = [];

  if (adList.length) {
    const idx = Math.max(
      0,
      adList.findIndex((x) => {
        const xp = x.antardasha || x.ad || x.AD || x.planet || "";
        const xs = x.start || x.from || x.fromAD || null;
        return xp === adPlanet && (!adStart || xs === adStart);
      })
    );
    for (let i = idx + 1; i < adList.length && nextADs.length < 2; i++) {
      const x = adList[i];
      nextADs.push({
        planet: x.antardasha || x.ad || x.AD || x.planet || "",
        start:  x.start || x.from || x.fromAD || null,
        end:    x.end   || x.to   || x.toAD   || null,
      });
    }
  }

  if (!mdPlanet || !adPlanet) return null;

  return {
    md:  { planet: mdPlanet, start: mdStart, end: mdEnd },
    ad:  { planet: adPlanet, start: adStart, end: adEnd },
    nextADs,
  };
}

/* ---------------- MD/AD (profile-first) ---------------- */
function mdadFromProfileFirst(input: Inputs): { mdad: MDAD; source: string } {
  if (input.profile?.mdad?.md && input.profile?.mdad?.ad) {
    return { mdad: input.profile.mdad, source: "profile.mdad" };
  }
  const fromDasha = mdadFromDashaBlock(input.profile?.dasha);
  if (fromDasha) return { mdad: fromDasha, source: "profile.dasha" };

  if (input.mdadOverride?.md && input.mdadOverride?.ad) {
    return { mdad: input.mdadOverride, source: "override" };
  }

  // mock fallback
  const seed = (input.dobISO || "1984-01-21") + "|" + (input.tob || "12:00");
  const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const h = stableHash(seed);
  const pick = (k:number)=>planets[(h+k)%planets.length];
  const today = new Date();
  const mdad: MDAD = {
    md: { planet: pick(0), start: addMonths(today, -6).toISOString(), end: addMonths(today, 18).toISOString() },
    ad: { planet: pick(1), start: addWeeks(today, -3).toISOString(),   end: addWeeks(today, 8).toISOString() },
    nextADs: [
      { planet: pick(2), start: addWeeks(today, 8).toISOString(),  end: addWeeks(today, 19).toISOString() },
      { planet: pick(3), start: addWeeks(today, 19).toISOString(), end: addWeeks(today, 30).toISOString() },
    ],
  };
  return { mdad, source: "mock" };
}

/* ---------------- Transits (simple deterministic mock) ---------------- */
function getTransits(input: Inputs): TransitHit[] {
  if (input.transitsOverride) return input.transitsOverride;
  const base = new Date();
  const P = ["Jupiter", "Saturn", "Mars", "Venus", "Mercury", "Sun"];
  const aspects = ["trine", "sextile", "conj", "opp", "square"];
  const notes = ["supports negotiation","stability & structure","quick actions favored","visibility & recognition","paperwork moves","comforts & assets"];
  const scores = [2, 1, 3, -1, 1, 2];
  const hits: TransitHit[] = [];
  for (let i = 0; i < 6; i++) {
    const at = addWeeks(base, 2 + i * 3);
    hits.push({
      at: at.toISOString(),
      planet: P[i % P.length],
      aspect: aspects[i % aspects.length],
      score: scores[i % scores.length],
      note: notes[i % notes.length]
    });
  }
  return hits;
}

/* ---------------- category configs & scoring ---------------- */
const catPlanets: Record<Category, { good: string[]; risky: string[]; emoji: string; header: string; tip: string }> = {
  vehicle:       { good: ["Venus", "Mars", "Mercury", "Jupiter"], risky: ["Rahu", "Ketu", "Saturn"], emoji: "🚗", header: "Vehicle timing",      tip: "Shortlist now; secure pre-approval; use month-end incentives." },
  job:           { good: ["Saturn", "Sun", "Jupiter", "Mercury"], risky: ["Rahu", "Ketu", "Mars"],   emoji: "💼", header: "Career timing",       tip: "Refresh CV; ask 2–3 referrals; run two parallel interview tracks." },
  property:      { good: ["Venus", "Jupiter", "Saturn", "Moon"],  risky: ["Mars", "Rahu", "Ketu"],   emoji: "🏠", header: "Property timing",     tip: "Keep pre-approval warm; budget a buffer; be strict on inspection clauses." },
  relationships: { good: ["Venus", "Jupiter", "Moon"],            risky: ["Saturn", "Mars", "Rahu"], emoji: "💞", header: "Relationships",       tip: "Lead with clarity; pace decisions; align on practicals early." },
  disputes:      { good: ["Saturn", "Mars"],                       risky: ["Rahu", "Ketu"],           emoji: "⚖️", header: "Disputes",            tip: "Document facts; avoid reactive steps; prefer mediation when leverage peaks." },
  transit:       { good: ["Jupiter", "Moon", "Mercury"],          risky: ["Saturn", "Mars"],         emoji: "📅", header: "Transits",            tip: "Mark key days; prefer benefic Moon/Jupiter days." },
};

function scoreFromMDAD(cat: Category, mdad: MDAD) {
  const cfg = catPlanets[cat];
  const w = (p: string) => (cfg.good.includes(p) ? 2 : 0) + (cfg.risky.includes(p) ? -1 : 0);
  const sNow = w(mdad.ad.planet) * 2 + w(mdad.md.planet);
  const sN1  = w(mdad.nextADs[0]?.planet || "") * 2 + w(mdad.md.planet);
  const sN2  = w(mdad.nextADs[1]?.planet || "") * 2 + w(mdad.md.planet);
  return [sNow, sN1, sN2].map(s => clamp(s, -2, 5));
}

function scoreFromTransits(cat: Category, hits: TransitHit[], windowStart: Date, windowEnd: Date) {
  const relevant = hits.filter(h => {
    const d = new Date(h.at);
    return d >= windowStart && d <= windowEnd;
  });
  const cfg = catPlanets[cat];
  let sum = 0;
  for (const h of relevant) sum += h.score + (cfg.good.includes(h.planet) ? 1 : 0);
  return sum;
}

function windowsFromToday(): Array<{ label: "near" | "mid" | "late"; from: Date; to: Date }> {
  const now = new Date();
  return [
    { label: "near", from: addWeeks(now, 3),  to: addWeeks(now, 7)  },
    { label: "mid",  from: addWeeks(now, 10), to: addWeeks(now, 16) },
    { label: "late", from: addWeeks(now, 24), to: addWeeks(now, 32) },
  ];
}

function rankWindows(cat: Category, mdad: MDAD, transits: TransitHit[], natalWeight: number) {
  const [mdS_near, mdS_mid, mdS_late] = scoreFromMDAD(cat, mdad);
  const base = windowsFromToday();

  const scored = base.map((w, i) => {
    const mdScore = [mdS_near, mdS_mid, mdS_late][i];
    const trScore = scoreFromTransits(cat, transits, w.from, w.to);
    const total = natalWeight * 4 + mdScore * 2 + trScore;

    const why: string[] = [];
    if (i === 0) why.push(`AD ${mdad.ad.planet} within MD ${mdad.md.planet}`);
    else {
      const nxt = mdad.nextADs[i - 1];
      if (nxt) why.push(`upcoming AD ${nxt.planet} within MD ${mdad.md.planet}`);
    }
    const trHits = transits
      .filter(h => { const d = new Date(h.at); return d >= w.from && d <= w.to; })
      .slice(0, 2)
      .map(h => `${h.planet}${h.aspect ? " " + h.aspect : ""}${h.note ? ` — ${h.note}` : ""}`);
    if (trHits.length) why.push(...trHits);

    return { label: w.label, from: w.from, to: w.to, score: total, why };
  });

  return scored.sort((a, b) => b.score - a.score);
}

/* ---------------- main entry ---------------- */
export async function orchestrateQA(input: Inputs) {
  const cfg = catPlanets[input.category];
  const name = input.profile?.name?.trim();

  // Natal promise (mock; deterministic & fast)
  const natal = mockNatal(input.dobISO || input.profile?.dobISO, input.tob || input.profile?.tob);
  let natalScore = 0.5, natalNotes: string[] = [];
  if (input.category === "vehicle") {
    const { score, notes } = vehiclePromiseScore(natal);
    natalScore = score / 4;
    natalNotes = notes;
  }

  // MD/AD & transits (profile-first)
  const { mdad, source: mdSource } = mdadFromProfileFirst(input);
  const transits = getTransits(input);

  // Rank & summarize (top-2)
  const ranked = rankWindows(input.category, mdad, transits, natalScore);
  const top2 = ranked.slice(0, 2);
  const phr = (lbl: "near" | "mid" | "late") => lbl === "near" ? "near-term" : lbl === "mid" ? "mid-term" : "late-term";
  const oneLine = (w: typeof ranked[number]) => {
    const why1 = w.why[0] ? w.why[0].replace(/^upcoming /, "") : "supportive factors";
    const why2 = w.why[1] ? `, plus ${w.why[1]}` : "";
    return `${phr(w.label)} (${fmtRange(w.from, w.to)}) with ${why1}${why2}`;
  };
  const confidence = natalScore >= 0.75 ? "high" : natalScore >= 0.5 ? "good" : natalScore >= 0.3 ? "moderate" : "low";

  const header = `${cfg.emoji} ${cfg.header}${name ? `, ${name}` : ""}`;
  const lead =
    input.category === "vehicle"
      ? (natalScore >= 0.6
          ? "Your natal chart shows clear promise for vehicle gains."
          : natalScore >= 0.4
            ? "Natal promise for vehicles is present but moderate."
            : "Natal promise for a new vehicle is limited; timing windows may express as desire or upgrades rather than a purchase.")
      : "Timing outlook:";

  const summary =
    top2.length === 2
      ? `Best support comes in ${oneLine(top2[0])}. Another strong window is in ${oneLine(top2[1])}.`
      : top2.length === 1
        ? `Best support comes in ${oneLine(top2[0])}.`
        : "No strong windows detected in the next few months.";

  const windowsDetail =
    top2
      .map(w =>
        `- ${phr(w.label)} ${fmtRange(w.from, w.to)} — ${w.why.length ? w.why.join("; ") : "general support"}`
      )
      .join("\n");

  return {
    ok: true,
    category: input.category,
    confidence,
    natal: { score: natalScore, notes: natalNotes },
    mdSource, // for debugging/visibility
    md: mdad, // the MD/AD actually used
    transits,
    windows: top2,
    answer: `${header}: ${lead}

**Current Dasha:** 
MD ${mdad.md.planet} (${mdad.md.start?.slice(0, 10)} → ${mdad.md.end?.slice(0, 10)}) 
/ AD ${mdad.ad.planet} (${mdad.ad.start?.slice(0, 10)} → ${mdad.ad.end?.slice(0, 10)})

**Natal factors:** ${natalNotes.join("; ") || "—"}

**Best windows:**
${windowsDetail}

Tip: ${cfg.tip}
(Source: ${mdSource})`,
  };
}
