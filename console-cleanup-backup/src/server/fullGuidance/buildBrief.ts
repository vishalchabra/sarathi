import type {
  FullGuidanceBrief,
  PredictionUnit,
  ConfidenceLabel,
  GuidanceDomain,
  LifeArchitecture,
  LifeChapterMD,
  LifeChapterAD,
  CurrentChapter,
} from "./types";

const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));
const pickTop = <T,>(arr: T[], n: number) => (Array.isArray(arr) ? arr.slice(0, n) : []);

const confLabel = (signals: number): ConfidenceLabel =>
  signals >= 3 ? "High" : signals === 2 ? "Medium" : "Low";
const mapPaidToUnit = (p: any, fallbackISO: string): PredictionUnit => {
  const area = String(p?.area ?? "").toLowerCase();

  const domain: GuidanceDomain =
    area.includes("money") ? "Money" :
    area.includes("health") ? "Health" :
    area.includes("relation") ? "Relationships" :
    area.includes("inner") ? "Inner" :
    "Career";

  const startISO = String(p?.windowISO?.from ?? "").trim() || fallbackISO;
  const endISO = String(p?.windowISO?.to ?? "").trim() || startISO;

  const rawText = String(p?.text ?? "").replace(/\s+/g, " ").trim();
  const event = rawText || "—";

  const confNum = Number(p?.confidence);
  const probability = clamp(Number.isFinite(confNum) ? confNum : 55);

  const trigger = String(p?.trigger ?? "").trim();
  const action = String(p?.action ?? "").trim();

  return makeUnit({
    domain,
    startISO,
    endISO,
    event,
    probability,
    confidence: probability >= 75 ? "High" : probability >= 60 ? "Medium" : "Low",
    triggers: trigger ? [trigger] : [],
    actions: action ? [action] : [],
    consequenceIfFollowed: "Handled cleanly → momentum increases.",
    consequenceIfIgnored: "Avoided or rushed → friction repeats.",
    whyFacts: [],
  });
};
function getMDADPD(report: any) {
  const ap = report?.activePeriods || report?.core?.activePeriods || {};

  const md =
    String(ap?.mahadasha?.lord ?? ap?.mahadasha?.planet ?? ap?.md ?? "").trim();

  const ad =
    String(ap?.antardasha?.subLord ?? ap?.antardasha?.planet ?? ap?.ad ?? "").trim();

  const pd =
    String(ap?.pratyantardasha?.subLord ?? ap?.pratyantardasha?.planet ?? ap?.pd ?? "").trim();

  return { md, ad, pd };
}

// v1 mapping (simple). We refine later.
function domainFromSignals(md: string, ad: string, pd: string): GuidanceDomain {
  const s = `${md} ${ad} ${pd}`.toLowerCase();
  if (s.includes("venus")) return "Relationships";
  if (s.includes("mercury")) return "Career";
  if (s.includes("saturn")) return "Career";
  if (s.includes("jupiter")) return "Career";
  if (s.includes("moon")) return "Inner";
  if (s.includes("mars")) return "Health";
  if (s.includes("rahu") || s.includes("ketu")) return "Inner";
  return "Career";
}
const VIM_ORDER = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"] as const;
type VimLord = (typeof VIM_ORDER)[number];

const VIM_YEARS: Record<VimLord, number> = {
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

function buildSubTimeline(parentStartISO: string, parentEndISO: string, startLord: string) {
  const startIdx = VIM_ORDER.indexOf(startLord as VimLord);
  if (startIdx === -1) return [];

  const start = new Date(parentStartISO + "T00:00:00Z").getTime();
  const end = new Date(parentEndISO + "T00:00:00Z").getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return [];

  const totalMs = end - start;
  let cursor = start;

  const out: Array<{ planet: string; startISO: string; endISO: string }> = [];

  for (let i = 0; i < VIM_ORDER.length; i++) {
    const lord = VIM_ORDER[(startIdx + i) % VIM_ORDER.length];
    const weight = VIM_YEARS[lord];
    const spanMs = (totalMs * weight) / 120;

    const segStart = cursor;
    let segEnd = cursor + spanMs;

    // last segment ends exactly at parent end
    if (i === VIM_ORDER.length - 1) segEnd = end;

    const sISO = new Date(segStart).toISOString().slice(0, 10);
    const eISO = new Date(segEnd).toISOString().slice(0, 10);

    out.push({ planet: lord, startISO: sISO, endISO: eISO });
    cursor = segEnd;
  }

  return out;
}
function baseSnapshot(domain: GuidanceDomain) {
  if (domain === "Career") {
    return {
      primaryVector: "Execution discipline + process stabilization",
      opportunity: "Reputation lift via precision and closure",
      vulnerability: "Overcommitment → rework cycles",
      reliability: { strongestDomain: "Career" as const, weakestDomain: "Inner" as const },
    };
  }
  if (domain === "Relationships") {
    return {
      primaryVector: "Expectation setting + boundary clarity",
      opportunity: "Stabilize a key relationship dynamic",
      vulnerability: "Tone mistakes during fatigue windows",
      reliability: { strongestDomain: "Relationships" as const, weakestDomain: "Money" as const },
    };
  }
  return {
    primaryVector: "Reduce noise + improve consistency",
    opportunity: "One clean decision improves direction",
    vulnerability: "Energy volatility → reactive choices",
    reliability: { strongestDomain: "Career" as const, weakestDomain: "Relationships" as const },
  };
}

function makeUnit(
  input: Partial<PredictionUnit> & Pick<PredictionUnit, "domain" | "startISO" | "endISO" | "event">
): PredictionUnit {
  const probability = clamp(Number(input.probability ?? 55));

  return {
    domain: input.domain,
    startISO: input.startISO,
    endISO: input.endISO,
    event: String(input.event || "—").trim(),
    probability,
    confidence: (input.confidence ??
      (probability >= 70 ? "High" : probability >= 60 ? "Medium" : "Low")) as ConfidenceLabel,
    triggers: pickTop(input.triggers ?? [], 4),
    actions: pickTop(input.actions ?? [], 4),
    consequenceIfFollowed: String(input.consequenceIfFollowed ?? "Handled cleanly → momentum increases.").trim(),
    consequenceIfIgnored: String(input.consequenceIfIgnored ?? "Rushed or avoided → friction repeats.").trim(),
    whyFacts: pickTop(input.whyFacts ?? [], 5),
  };
}
function getTimelineRows(report: any): any[] {
  const top =
    (report as any)?.dashaTimeline ??
    (report as any)?.timelineWindows ??
    (report as any)?.timeline ??
    (report as any)?.core?.dashaTimeline ??
    (report as any)?.core?.timelineWindows ??
    (report as any)?.core?.timeline ??
    (report as any)?.__paid?.dashaTimeline ??
    (report as any)?.__paid?.timelineWindows ??
    (report as any)?.__paid?.timeline ??
    [];

  return Array.isArray(top) ? top : [];
}

function isMDOnlyRow(x: any) {
  // MD-only rows from vimshottariMDTable usually look like: { planet, startISO, endISO }
  return (
    x &&
    typeof x === "object" &&
    typeof x.planet === "string" &&
    typeof x.startISO === "string" &&
    typeof x.endISO === "string" &&
    !("ad" in x) &&
    !("adPlanet" in x) &&
    !("subLord" in x)
  );
}

// Split one MD span into 9 AD spans (proportional Vimshottari split)
function buildADTimelineForMD(mdPlanet: string, mdStartISO: string, mdEndISO: string) {
  const startIdx = VIM_ORDER.indexOf(mdPlanet as any);
  if (startIdx === -1) return [];

  const start = new Date(mdStartISO + "T00:00:00Z");
  const end = new Date(mdEndISO + "T00:00:00Z");
  const totalMs = Math.max(0, end.getTime() - start.getTime());
  if (!totalMs) return [];

  const out: Array<{ md: string; ad: string; fromISO: string; toISO: string }> = [];

  let cursor = start.getTime();

  for (let i = 0; i < VIM_ORDER.length; i++) {
    const adLord = VIM_ORDER[(startIdx + i) % VIM_ORDER.length];
    const weight = VIM_YEARS[adLord];
    const spanMs = (totalMs * weight) / 120;

    let segEnd = cursor + spanMs;
    if (i === VIM_ORDER.length - 1) segEnd = end.getTime();

    const fromISO = new Date(cursor).toISOString().slice(0, 10);
    const toISO = new Date(segEnd).toISOString().slice(0, 10);

    out.push({
      md: mdPlanet,
      ad: String(adLord),
      fromISO,
      toISO,
    });

    cursor = segEnd;
  }

  return out;
}

function expandMDTableToMDADRows(rows: any[]) {
  // rows are MD-only (planet/startISO/endISO). Return MD+AD rows.
  const res: any[] = [];

  for (const mdRow of rows) {
    const mdPlanet = String(mdRow?.planet ?? "").trim();
    const mdStartISO = String(mdRow?.startISO ?? "").trim();
    const mdEndISO = String(mdRow?.endISO ?? "").trim();
    if (!mdPlanet || !mdStartISO || !mdEndISO) continue;

    const ads = buildADTimelineForMD(mdPlanet, mdStartISO, mdEndISO);
    for (const ad of ads) {
      res.push({
        mdPlanet: ad.md,
        adPlanet: ad.ad,
        fromISO: ad.fromISO,
        toISO: ad.toISO,
      });
    }
  }

  return res;
}
function normPlanet(x: any) {
  return String(x ?? "").trim();
}

function normISO(x: any) {
  const s = String(x ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

// You will tune this once you paste 1–2 real rows
function rowToMDAD(row: any) {
  // If this is a plain MD row (planet + startISO/endISO), treat it as MD with AD = same planet
  const mdPlain = normPlanet(row?.planet ?? row?.mdPlanet ?? row?.md ?? row?.mahadasha ?? row?.MD ?? row?.lord ?? row?.major);
  const adPlain = normPlanet(row?.adPlanet ?? row?.ad ?? row?.antardasha ?? row?.AD ?? row?.subLord ?? row?.minor);

  // Some timelines store combined labels like "Rahu / Venus" etc.
  const label = String(row?.label ?? row?.name ?? "").trim();
  let md = mdPlain;
  let ad = adPlain;

  if ((!md || !ad) && label.includes("/")) {
    const parts = label.split("/").map((x) => x.trim());
    if (!md && parts[0]) md = parts[0];
    if (!ad && parts[1]) ad = parts[1];
  }

  // If still no AD, set AD = MD (so chapters still render at least at MD level)
  if (md && !ad) ad = md;

  const fromISO =
    normISO(row?.fromISO ?? row?.startISO ?? row?.start ?? row?.from) || "";

  const toISO =
    normISO(row?.toISO ?? row?.endISO ?? row?.end ?? row?.to) || "";

  return { md, ad, fromISO, toISO };
}

function groupMDAD(report: any) {
  const raw = getTimelineRows(report);

  // ---- Case A: MD-only timeline rows: { planet, startISO, endISO } ----
  const mdOnly = Array.isArray(raw)
    ? raw
        .map((r: any) => ({
          mdPlanet: normPlanet(r?.planet ?? r?.mdPlanet ?? r?.md ?? r?.mahadasha),
          fromISO: normISO(r?.startISO ?? r?.fromISO ?? r?.start ?? r?.from),
          toISO: normISO(r?.endISO ?? r?.toISO ?? r?.end ?? r?.to),
        }))
        .filter((x) => x.mdPlanet && x.fromISO && x.toISO)
    : [];

  const looksLikeMDOnly =
    mdOnly.length > 0 &&
    // if there is no AD field in raw rows, treat as MD-only
    !raw.some((r: any) => r?.adPlanet || r?.ad || r?.antardasha || r?.AD || r?.subLord);

  if (looksLikeMDOnly) {
    // Build AD subchapters from each MD span
    return mdOnly.map((md) => {
      const ads = buildSubTimeline(md.fromISO, md.toISO, md.mdPlanet).map((ad) => ({
        md: md.mdPlanet,
        ad: ad.planet,
        fromISO: ad.startISO,
        toISO: ad.endISO,
      }));

      return {
        mdPlanet: md.mdPlanet,
        fromISO: md.fromISO,
        toISO: md.toISO,
        ads,
      };
    });
  }

  // ---- Case B: already has MD+AD rows (your old behavior) ----
  const rows = raw.map(rowToMDAD).filter((r) => r.md && r.ad);

  const byMD = new Map<string, { mdPlanet: string; fromISO: string; toISO: string; ads: any[] }>();

  for (const r of rows) {
    const key = r.md;
    const cur = byMD.get(key);
    if (!cur) {
      byMD.set(key, { mdPlanet: r.md, fromISO: r.fromISO, toISO: r.toISO, ads: [r] });
    } else {
      cur.ads.push(r);
      if (r.fromISO && (!cur.fromISO || r.fromISO < cur.fromISO)) cur.fromISO = r.fromISO;
      if (r.toISO && (!cur.toISO || r.toISO > cur.toISO)) cur.toISO = r.toISO;
    }
  }

  return Array.from(byMD.values())
    .map((md) => ({
      mdPlanet: md.mdPlanet,
      fromISO: md.fromISO,
      toISO: md.toISO,
      ads: md.ads.sort((a: any, b: any) => (a.fromISO || "").localeCompare(b.fromISO || "")),
    }))
    .sort((a, b) => (a.fromISO || "").localeCompare(b.fromISO || ""));
}

function mdTheme(p: string) {
  const s = p.toLowerCase();
  if (s.includes("rahu")) return "Repositioning + ambition outside comfort";
  if (s.includes("saturn")) return "Discipline, responsibility, delayed rewards";
  if (s.includes("jupiter")) return "Expansion through learning, mentors, legitimacy";
  if (s.includes("mercury")) return "Skills, communication, systems";
  if (s.includes("venus")) return "Value, relationships, comfort strategy";
  if (s.includes("moon")) return "Mind, belonging, emotional cycles";
  if (s.includes("sun")) return "Authority, identity, leadership tests";
  if (s.includes("mars")) return "Action, conflict, decisive moves";
  if (s.includes("ketu")) return "Detachment, pruning, inner clarity";
  return "Major life restructuring";
}

const adTheme = mdTheme;

function chapterDo(p: string): string[] {
  const s = p.toLowerCase();
  if (s.includes("mercury")) return ["Document decisions", "Ship clean versions", "Build repeatable templates"];
  if (s.includes("venus")) return ["Strengthen relationships strategically", "Build a parallel asset", "Improve comfort without overspending"];
  if (s.includes("saturn")) return ["Commit to one system", "Close loops", "Define scope and boundaries"];
  if (s.includes("rahu")) return ["Network with intent", "Take visible bets (controlled size)", "Break comfort routines"];
  if (s.includes("ketu")) return ["Simplify", "Cut distractions", "Deep work daily"];
  return ["Finish before expanding", "Create structure", "Avoid scattered effort"];
}

function chapterAvoid(p: string): string[] {
  const s = p.toLowerCase();
  if (s.includes("mercury")) return ["Rework cycles", "Ambiguous commitments", "Too many parallel threads"];
  if (s.includes("venus")) return ["Mixed signals", "Comfort spending", "Emotional bargaining"];
  if (s.includes("saturn")) return ["Undefined scope", "Bitterness", "Neglecting health routine"];
  if (s.includes("rahu")) return ["Impulsive pivots", "Overpromising", "Shortcut thinking"];
  if (s.includes("ketu")) return ["Isolation spiral", "Avoiding responsibility", "Overthinking"];
  return ["Emotional quitting", "Overexpansion", "Avoiding hard conversations"];
}

function likelyEvents(p: string): string[] {
  const s = p.toLowerCase();
  if (s.includes("mercury")) return ["Communication becomes decisive", "A fix/cleanup earns trust", "Skills bring visibility"];
  if (s.includes("venus")) return ["Terms in relationships clarify", "Value/brand positioning improves", "Comfort vs ambition tradeoffs"];
  if (s.includes("saturn")) return ["Responsibility increases", "Patience is tested", "Structure wins over speed"];
  if (s.includes("rahu")) return ["New direction pulls you", "Online/foreign link strengthens", "Restlessness pushes change"];
  if (s.includes("ketu")) return ["Detachment from old identity", "Cutting back becomes necessary", "Clarity rises after pruning"];
  return ["A decision point emerges", "Pressure builds then releases", "Results depend on discipline"];
}
export function buildFullGuidanceBrief(args: {
  report: any;
  todayISO: string;
  hits: any[];
  notificationsPreview?: any;
  dailyHighlights?: any[];
}): FullGuidanceBrief {
  const { report, todayISO, hits, notificationsPreview } = args;
  const { md, ad, pd } = getMDADPD(report);
     const signals =
    (md ? 1 : 0) + (ad ? 1 : 0) + (pd ? 1 : 0) + (Array.isArray(hits) && hits.length ? 1 : 0);

  const overallConfidence = confLabel(signals);
  const primaryDomain = domainFromSignals(md, ad, pd);
  const snapshot = baseSnapshot(primaryDomain);

  const pickWhy = (k: "morning" | "midday" | "evening") => {
    const arr = notificationsPreview?.[k] || [];
    const t = String(arr?.[0]?.text || "").replace(/\s+/g, " ").trim();
    return t ? t.slice(0, 140) : "";
  };

  const today = {
    directive: "Finish the highest-impact item with zero rework.",
    avoid: "Avoid emotional or rushed commitments during fatigue windows.",
    bestWindows: [
      {
        label: "Morning" as const,
        bestFor: "High-impact work, planning, key conversations",
        oneAction: "Lock 25–40 minutes on the hardest task and start without switching.",
        avoid: "Multitasking or starting too many threads",
        whyFact: pickWhy("morning") || undefined,
      },
      {
        label: "Midday" as const,
        bestFor: "Admin, follow-ups, low-risk decisions, money hygiene",
        oneAction: "Do a 5-minute check (spend/commitments/messages), then act only on basics.",
        avoid: "Big spends, rushed commitments, impulsive trades",
        whyFact: pickWhy("midday") || undefined,
      },
      {
        label: "Evening" as const,
        bestFor: "Closing loops, family/home, light creative work, reflection",
        oneAction: "Close one open loop and do a 10-minute wind-down reset.",
        avoid: "Heavy debates or emotionally loaded decisions",
        whyFact: pickWhy("evening") || undefined,
      },
    ],
    caution: [
      "Avoid impulsive decisions during the afternoon dip.",
      "Avoid heavy conversations late at night.",
    ],
  };

  // IMPORTANT: we read your paid output from report.__paid (we attach it in TabFullPlan step 3)
  const paid = report ? (report as any).__paid ?? null : null;
  const paid14 = Array.isArray(paid?.predictions14d) ? paid.predictions14d : [];
  const paid30 = Array.isArray(paid?.predictions30d) ? paid.predictions30d : [];
  const paid60 = Array.isArray(paid?.predictions60d) ? paid.predictions60d : [];
  const paid90 = Array.isArray(paid?.predictions90d) ? paid.predictions90d : [];


  const next90Predictions: PredictionUnit[] = paid90.length
    ? paid90.slice(0, 6).map((p: any) =>
        makeUnit({
          domain: String(p?.area || "").toLowerCase().includes("money")
            ? "Money"
            : String(p?.area || "").toLowerCase().includes("health")
            ? "Health"
            : String(p?.area || "").toLowerCase().includes("relation")
            ? "Relationships"
            : "Career",
          startISO: String(p?.windowISO?.from || todayISO),
          endISO: String(p?.windowISO?.to || todayISO),
          event: String(p?.text || "—").trim(),
          probability: Number(p?.confidence ?? 55),
          confidence:
            Number(p?.confidence ?? 0) >= 70
              ? "High"
              : Number(p?.confidence ?? 0) >= 60
              ? "Medium"
              : "Low",
          triggers: p?.trigger ? [String(p.trigger)] : [],
          actions: p?.action ? [String(p.action)] : [],
          consequenceIfFollowed: "Handled cleanly → momentum increases.",
          consequenceIfIgnored: "Avoided or rushed → friction repeats.",
          whyFacts: Array.isArray(paid?.themeDrivers) ? paid.themeDrivers.slice(0, 3) : [],
        })
      )
    : [
        makeUnit({
          domain: "Career",
          startISO: todayISO,
          endISO: todayISO,
          event: "No paid predictions available. Regenerate report.",
          probability: 50,
          confidence: "Low",
          triggers: [],
          actions: [],
          whyFacts: [],
          consequenceIfFollowed: "—",
          consequenceIfIgnored: "—",
        }),
      ];

  

const next14 = {
  title: "Next 14 days — immediate outcomes",
  predictions: paid14.length ? paid14.map((p: any) => mapPaidToUnit(p, todayISO)) : next90Predictions.slice(0, 2),
};

const next30 = {
  title: "Next 30 days — trigger windows",
  predictions: paid30.length ? paid30.map((p: any) => mapPaidToUnit(p, todayISO)) : next90Predictions.slice(2, 4),
};

const next60 = {
  title: "Next 60 days — main swing",
  predictions: paid60.length ? paid60.map((p: any) => mapPaidToUnit(p, todayISO)) : next90Predictions.slice(0, 1),
};

const next90 = {
  title: "Next 90 days — outcomes",
  predictions: paid90.length ? paid90.map((p: any) => mapPaidToUnit(p, todayISO)) : next90Predictions,
};

  const riskIndex = {
    likelyMistake: "Overextending to prove capability.",
    emotionalTrap: "Responding immediately instead of pausing.",
    structuralTrap: "Taking responsibility without defined scope.",
    financialTrap: "Convenience spending accumulating quietly.",
  };

  const decisionProtocol = [
    "Finish before expanding.",
    "Confirm scope in writing.",
    "Delay emotional decisions by 6 hours.",
    "48-hour rule for non-essential spending.",
    "Protect sleep consistency for 10 days.",
  ];
  // --- NEW: Life Architecture + Life Story (MD+AD) ---
  const lifeArchitecture: LifeArchitecture = {
    oneLine: "Your life accelerates through repositioning — stability first, then a strategic pivot.",
    corePattern:
      "You tend to outgrow stable structures once your skill + ambition outpace recognition. Your best results come when you build parallel capability, then switch with timing.",
    primaryTension: "Security vs autonomy (comfort vs growth).",
    growthEngine: "Skill-stacking + building assets quietly, then taking visible steps when timing opens.",
    longTrajectory: "Structured career → hybrid phase → self-led platform/independent value creation.",
  };

  const mdGroups = groupMDAD(report);
  if (process.env.NODE_ENV !== "production") {
  console.log("[FullGuidance] timeline rows:", getTimelineRows(report)?.length || 0);
}
  console.log("[FullGuidance] mdGroups", mdGroups?.length, mdGroups?.[0]);
  // keep it readable: last 3 MDs; each with up to 6 AD subchapters
  const lifeChapters: LifeChapterMD[] = mdGroups
    .slice(Math.max(0, mdGroups.length - 3))
    .map((g) => {
      const adChapters: LifeChapterAD[] = g.ads.slice(0, 6).map((r: any) => ({
        adPlanet: r.ad,
        fromISO: r.fromISO || "",
        toISO: r.toISO || "",
        theme: adTheme(r.ad),
        likelyEvents: likelyEvents(r.ad).slice(0, 4),
        do: chapterDo(r.ad).slice(0, 3),
        avoid: chapterAvoid(r.ad).slice(0, 3),
        evidence: [
          `Timing layer: ${g.mdPlanet} → ${r.ad}`,
          "MD sets the chapter; AD sets the operational focus.",
        ],
      }));

      return {
        mdPlanet: g.mdPlanet,
        fromISO: g.fromISO || "",
        toISO: g.toISO || "",
        mdTheme: mdTheme(g.mdPlanet),
        mdStory: `This period emphasizes ${mdTheme(g.mdPlanet).toLowerCase()}. Outcomes improve when you choose structure + deliberate moves over impulse.`,
        adChapters,
      };
    });

  const currentChapter: CurrentChapter = {
    md,
    ad,
    pd: pd || undefined,
    executiveSummary:
      `You are in ${md}–${ad}${pd ? `–${pd}` : ""}: the system is asking for disciplined execution plus a value/positioning shift. Momentum rises when focus is tight and outputs are measurable.`,
    whatToBuild: [
      "One clear 90-day goal with weekly outputs",
      "A repeatable delivery system (templates/checklists)",
      "Visible proof-of-work (ship → show → ask)",
      "A parallel asset (platform/product) without burning base income",
      "Boundary language (scope, timelines, terms)",
    ],
    whatToStop: [
      "Rework caused by unclear commitments",
      "Emotional decisions during fatigue windows",
      "Overbuilding without shipping",
      "Comfort spending as stress relief",
      "Too many parallel priorities",
    ],
    doNow: chapterDo(ad).slice(0, 4),
    avoidNow: chapterAvoid(ad).slice(0, 4),
  };
  return {
    generatedForISO: todayISO,
    overallConfidence,
    snapshot,
    today,
    next14,
    next30,
    next60,
    next90,
    riskIndex,
    decisionProtocol,
    lifeArchitecture,
    lifeChapters,
    currentChapter,
    
  };
}
