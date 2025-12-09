// FILE: /src/lib/qa/orchestrator.ts
/* -------------------------------------------------------------
   Orchestrator — profile-first MD/AD + polished Markdown answer
   - Uses profile.mdad if present
   - Else derives from profile.dasha (current + AD list)
   - Else uses a deterministic mock
   - Adds simple transit “hits” mock
   - Formats a structured Markdown reply (the “browser” look)
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
  md: { planet: string; start?: string | null; end?: string | null };
  ad: { planet: string; start?: string | null; end?: string | null };
  nextADs?: Array<{ planet: string; start?: string | null; end?: string | null }>;
};

type TransitHit = { at: string; planet: string; aspect?: string; score: number; note?: string };

type NatalBasics = {
  houses?: Record<number, { lord?: { strength?: number } }>;
  planets?: Record<string, { dignity?: number; strength?: number; benefic?: boolean }>;
};

type Profile = {
  name?: string; // optional
  dobISO?: string;
  tob?: string;
  place?: Place | null;
  mdad?: MDAD | null;
  dasha?: any | null;
};

export type Inputs = {
  question?: string;
  category: Category;
  dobISO?: string | null;
  tob?: string | null;
  place?: Place | null;
  profile?: Profile | null;
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const addWeeks = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n * 7); return x; };
const stableHash = (s: string) => [...s].reduce((a, c) => ((a * 131) ^ c.charCodeAt(0)) >>> 0, 7);
const fmtMD = (s?: string | null) => (s ? new Date(s).toLocaleDateString() : "—");
const cap = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

function range(a: Date, b: Date) {
  const f = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${f(a)} – ${f(b)}`;
}

/* ---------- simple natal mock (deterministic) ---------- */
async function getNatal(_: Inputs): Promise<NatalBasics> {
  // If you have a real natal engine, call it here. This is a small deterministic mock.
  const seed = stableHash(`${_.dobISO}|${_.tob}`);
  const r = (k: number) => ((seed >> (k * 3)) & 255) / 255;
  const dignity = () => Math.round((r(1) * 4 - 2) * 10) / 10;
  const strength = () => Math.round(r(2) * 100) / 100;

  return {
    houses: { 4: { lord: { strength: strength() } } },
    planets: {
      Venus: { dignity: dignity(), strength: strength(), benefic: true },
      Saturn: { dignity: dignity(), strength: strength(), benefic: false },
      Mars:   { dignity: dignity(), strength: strength(), benefic: false },
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
  if ((ven?.dignity ?? 0) >= 0) { s += 1; notes.push("Venus support for visibility & deals"); }
  if (((natal.planets?.Saturn?.dignity ?? 0) < -0.2) || ((natal.planets?.Mars?.dignity ?? 0) < -0.2)) {
    s -= 1; notes.push("Saturn/Mars stress — inspect twice");
  }

  return { score: clamp(s, 0, 4), notes };
}

/* ---------- derive MD/AD from saved dasha (fallback) ---------- */
function mdadFromDashaBlock(dasha: any): MDAD | null {
  if (!dasha) return null;
  const cur = dasha.current || {};
  const md = cur.mahadasha || cur.md || cur.MD || "";
  const ad = cur.antardasha || cur.ad || cur.AD || "";
  if (!md || !ad) return null;

  const adList: any[] = Array.isArray(dasha.AD) ? dasha.AD : [];
  const nextADs: any[] = [];
  if (adList.length) {
    const i = adList.findIndex(
      (x) => (x.antardasha || x.ad) === ad && (x.mahadasha || x.md) === md
    );
    for (let k = i + 1; k < adList.length && nextADs.length < 2; k++) {
      const x = adList[k];
      nextADs.push({ planet: x.antardasha || x.ad || "" , start: x.start || x.from || null, end: x.end || x.to || null });
    }
  }

  return {
    md: { planet: md, start: cur.mdStart || null, end: cur.mdEnd || null },
    ad: { planet: ad, start: cur.adStart || null, end: cur.adEnd || null },
    nextADs,
  };
}

/* ---------- get MD/AD (profile-first, then fallback) ---------- */
function getMDAD(input: Inputs): { mdad: MDAD; source: string } {
  if (input.profile?.mdad?.md && input.profile?.mdad?.ad) {
    return { mdad: input.profile.mdad, source: "profile.mdad" };
  }
  const fromDasha = mdadFromDashaBlock(input.profile?.dasha);
  if (fromDasha) return { mdad: fromDasha, source: "profile.dasha" };

  // deterministic mock
  const seed = stableHash(`${input.dobISO}|${input.tob}`);
  const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const pick = (k: number) => planets[(seed + k) % planets.length];
  const now = new Date();

  return {
    mdad: {
      md: { planet: pick(0), start: addWeeks(now, -26).toISOString(), end: addWeeks(now, 78).toISOString() },
      ad: { planet: pick(1), start: addWeeks(now, -3).toISOString(),  end: addWeeks(now, 8).toISOString() },
      nextADs: [
        { planet: pick(2), start: addWeeks(now, 8).toISOString(),  end: addWeeks(now, 19).toISOString() },
        { planet: pick(3), start: addWeeks(now, 19).toISOString(), end: addWeeks(now, 30).toISOString() },
      ],
    },
    source: "mock",
  };
}

/* ---------- simple transit mock ---------- */
async function getTransits(_: Inputs): Promise<TransitHit[]> {
  const base = new Date();
  const P = ["Jupiter", "Saturn", "Mars", "Venus", "Mercury", "Sun"];
  const aspects = ["trine", "sextile", "conj", "opp", "square"];
  const notes = ["supports negotiation","stability & structure","quick actions favored","visibility & recognition","paperwork moves"];
  const scores = [2, 1, 3, -1, 1, 2];
  const hits: TransitHit[] = [];
  for (let i = 0; i < 6; i++) {
    const at = addWeeks(base, 2 + i * 3);
    hits.push({ at: at.toISOString(), planet: P[i % P.length], aspect: aspects[i % aspects.length], score: scores[i % scores.length], note: notes[i % notes.length] });
  }
  return hits;
}

function windowsFromToday() {
  const now = new Date();
  return [
    { label: "near" as const, from: addWeeks(now, 3),  to: addWeeks(now, 7)  },
    { label: "mid"  as const, from: addWeeks(now, 10), to: addWeeks(now, 16) },
    { label: "late" as const, from: addWeeks(now, 24), to: addWeeks(now, 32) },
  ];
}

function scoreMD(cat: Category, mdad: MDAD, idx: number) {
  const good = { vehicle: ["Venus","Mars","Mercury","Jupiter"] } as Record<string,string[]>;
  const risky = { vehicle: ["Rahu","Ketu","Saturn"] } as Record<string,string[]>;
  const cfgG = good[cat] || [];
  const cfgR = risky[cat] || [];

  const w = (p: string) => (cfgG.includes(p) ? 2 : 0) + (cfgR.includes(p) ? -1 : 0);
  const adPlanet = idx === 0 ? mdad.ad.planet : mdad.nextADs?.[idx-1]?.planet || "";
  return clamp(w(adPlanet) * 2 + w(mdad.md.planet), -2, 5);
}

function scoreTransits(cat: Category, hits: TransitHit[], from: Date, to: Date) {
  const relevant = hits.filter(h => {
    const d = new Date(h.at);
    return d >= from && d <= to;
  });
  const bonus = (p: string) => (["Jupiter","Venus","Mercury"].includes(p) ? 1 : 0);
  return relevant.reduce((a,h) => a + h.score + bonus(h.planet), 0);
}

/* ============================================================= */

export async function orchestrateQA(input: Inputs) {
  // 1) Minimal natal score for vehicle “promise”
  const natal = await getNatal(input);
  let natalScore = 0.5;
  let natalNotes: string[] = [];
  if (input.category === "vehicle") {
    const { score, notes } = vehiclePromiseScore(natal);
    natalScore = score / 4;
    natalNotes = notes;
  }
  const qSeed = stableHash((input.question || "").trim().toLowerCase());
    // 2) MD/AD + transits
  const { mdad, source: mdSource } = getMDAD(input);
  const transits = await getTransits(input);
  

  // Build dasha label ONLY if it’s coming from a real profile/dasha, not from the mock
  const hasRealDasha = mdSource === "profile.mdad" || mdSource === "profile.dasha";

  const nowLabel = hasRealDasha
    ? `${cap(mdad.md.planet)} MD / ${cap(mdad.ad.planet)} AD`
    : undefined;

  const now =
    hasRealDasha && (mdad.ad.start || mdad.md.start) && (mdad.ad.end || mdad.md.end)
      ? {
          label: nowLabel,
          fromISO: (mdad.ad.start || mdad.md.start) ?? undefined,
          toISO: (mdad.ad.end || mdad.md.end) ?? undefined,
        }
      : undefined;

  const spans =
    hasRealDasha
      ? [
          {
            fromISO: (mdad.ad.start || mdad.md.start) ?? "",
            toISO: (mdad.ad.end || mdad.md.end) ?? "",
            label: nowLabel!,
          },
          ...(mdad.nextADs ?? []).map((ad) => ({
            fromISO: ad.start ?? "",
            toISO: ad.end ?? "",
            label: `${cap(mdad.md.planet)} MD / ${cap(ad.planet)} AD`,
          })),
        ]
      : [];


  // 3) Build 3 windows and score/rank
  const base = windowsFromToday().map((w, i) => {
    const mdS = scoreMD(input.category, mdad, i);
    const trS = scoreTransits(input.category, transits, w.from, w.to);
    const total = natalScore * 4 + mdS * 2 + trS;

    // short "why"
    const why: string[] = [];
    const adTxt =
      i === 0
        ? `AD ${mdad.ad.planet} within MD ${mdad.md.planet}`
        : mdad.nextADs?.[i - 1]
        ? `upcoming AD ${mdad.nextADs[i - 1].planet} within MD ${mdad.md.planet}`
        : "";
    if (adTxt) why.push(adTxt);

    const trHit = transits
      .filter(h => {
        const d = new Date(h.at);
        return d >= w.from && d <= w.to;
      })
      .slice(0, 1)[0];
    if (trHit) {
      why.push(`${trHit.planet}${trHit.aspect ? " " + trHit.aspect : ""}${trHit.note ? ` — ${trHit.note}` : ""}`);
    }

    return { ...w, score: total, why };
  });

   const ranked = base.sort((a, b) => b.score - a.score);
  const top2 = ranked.slice(0, 2);

  // 4) Polished Markdown answer (the “browser” look, WITHOUT MD/AD names)
  const firstName = (input.profile?.name || "").trim();
  const headingSuffix = firstName ? ` for **${firstName}**` : "";

    const goodBottomLines = [
    "A purchase is feasible if you’re deliberate. Your best odds cluster in the windows below—use them.",
    "Conditions support a purchase as long as you stay disciplined. Use the stronger windows below instead of rushing on a random day.",
  ];

  const cautiousBottomLines = [
    "A cautious buy is possible, but your chart leans toward desire/upgrade energy rather than an effortless big purchase. If you do buy, your best odds cluster in the windows below—use them deliberately.",
    "The chart pushes more for upgrade and desire than effortless gain. If you must buy, lean on the stronger windows below and keep every number crystal clear.",
  ];

  const bottomLine =
    natalScore >= 0.55
      ? goodBottomLines[qSeed % goodBottomLines.length]
      : cautiousBottomLines[qSeed % cautiousBottomLines.length];

  // We still use Venus / 4th-house etc. internally, but we DO NOT talk about MD/AD planets here.
  const hasVenus = (natal.planets?.Venus?.dignity ?? 0) >= 0;
  const venLine = hasVenus ? "✅ Venus support for visibility & deals when activated." : "";

  const fourthWeak =
    (natal.houses?.[4]?.lord?.strength ?? 0) < 0.5 ||
    (natal.planets?.Saturn?.dignity ?? 0) < -0.2 ||
    (natal.planets?.Mars?.dignity ?? 0) < -0.2;

  const hmLine = fourthWeak
    ? "⚠️ 4th-house strength is modest; Saturn/Mars echo **go slow, inspect twice**."
    : "✅ 4th-house baseline is serviceable; diligence still pays.";

  // Build a short description for each timing window WITHOUT mentioning MD/AD names.
  const mkWin = (w: (typeof ranked)[number], title: string) => {
    const why1 =
      w.why[0]
        ? w.why[0].replace(/^upcoming /, "")
        : "supportive factors in this period";
    const why2 = w.why[1] ? `; ${w.why[1]}` : "";

    const doText =
      title.includes("shortlist")
        ? "Test drives, lock pre-approval, get written quotes from 2–3 dealers."
        : "Re-price insurance; take extended warranty only if **net-positive**; walk away from rushed add-ons.";

    return `- **${range(w.from, w.to)} — “${title}”**  
  **Why:** ${why1}${why2}  
  **Do:** ${doText}`;
  };

  const win1 = top2[0] ? mkWin(top2[0], "shortlist + deal momentum") : "";
  const win2 = top2[1] ? mkWin(top2[1], "close well, if needed") : "";

  const guidance =
    top2.length === 2
      ? [
          "- If you’re aiming for **value + reliability**, target **Window 2**.",
          "- If you’re itching to **upgrade (features/brand)**, start in **Window 1**, close only if the numbers are clean.",
        ].join("\n")
      : "- Use the strongest window deliberately; walk away from rushed add-ons.";
     const checklistLines = [
    "- Pre-approval + budget cap before stepping into a showroom.",
    "- Compare *on-road* price line-by-line (fees, insurance, accessories).",
    "- Prefer **month-end** closures; ask for **loyalty + corporate + exchange** stacked.",
    "- Sleep on any “today-only” offer—Rahu-type periods reward patience.",
  ];

  const shift = checklistLines.length > 0 ? qSeed % checklistLines.length : 0;
  const rotatedChecklist =
    shift === 0
      ? checklistLines
      : checklistLines.slice(shift).concat(checklistLines.slice(0, shift));

  const mdAnswer = [
    `# 🚗 Vehicle timing${headingSuffix}`,
    "",
    "### Bottom line",
    bottomLine,
    "",
    "### Natal snapshot (what helps / hinders)",
    venLine && `- ${venLine}`,
    `- ${hmLine}`,
    "",
    "### 📅 Your best windows",
    win1,
    win2,
    "",
    "### Buy / Wait guidance",
    guidance,
    "",
        "### Smart checklist for you",
    ...rotatedChecklist,
    "",

    // No MD/AD planets in the source line; keep it generic.
    `*Source:* internal timing model (mode: ${mdSource}).`,
  ]
    .filter(Boolean)
    .join("\n");

   return {
    ok: true,
    category: input.category,
    mdSource,
    md: mdad, // raw MD/AD for internal use
    transits,
    windows: top2,
    natal: { score: natalScore, notes: natalNotes },

    // NEW: fields that TimingCards / QARich can read directly
    now,
    extra: nowLabel ? { nowLabel } : {},
    currentMD: hasRealDasha ? { planet: cap(mdad.md.planet) } : undefined,
    currentAD: hasRealDasha ? { lord: cap(mdad.ad.planet) } : undefined,
    spans,

    answer: mdAnswer,
  };
}

