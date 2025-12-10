// FILE: src/server/sarathi/narrator.ts
type ComposeArgs = {
  // keep this loose for now; we can tighten it later if needed
  [key: string]: any;
};

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type NarrativeInput = {
  topic: string;
  persona?: any;
  tone?: string; // "" | "share"
  nowLabel?: string; // e.g. "Rahu MD / Ketu AD"
  windows?: Array<{
    fromISO: string;
    toISO: string;
    tag?: string;
    label?: string;
    notes?: string;
  }>;
  plan?: any;
  opportunityByAD?: Array<{
    label: string;
    fromISO: string;
    toISO: string;
    sub?: Array<{ fromISO: string; toISO: string; tag: string }>;
  }>;
  guidance?: string[];
  roleTitle?: string;
  query: string;
  profile?: {
    name?: string;
    role?: string;
    stack?: string;
    // Optional natal summary you can store in Life Report and pass through:
    natal?: {
      // simple 1..12 index of houses with lord + sign + strength if you have it
      houses?: Record<
        string,
        {
          lord?: string; // e.g., "Saturn"
          sign?: string; // e.g., "Capricorn"
          strength?: "strong" | "average" | "weak";
        }
      >;
      // aspects like:  "Saturn -> 10 (trine)", "Mars -> 6 (square)"
      aspects?: Array<{ from: string; toHouse: number; type: string }>;
    };
  };
};

export type NarrativeOutput = {
  answer?: string;
  how?: string;
  quarters?: string[];
  micro?: Array<{
    fromISO: string;
    toISO: string;
    label: string;
    action: "push" | "build" | "close" | "foundation";
    why?: string[];
    do?: string[];
    score?: number;
  }>;
};

/* -------------------------------------------------------------------------- */
/* Small helpers                                                              */
/* -------------------------------------------------------------------------- */

const _nice = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const _intent = (q = "") => {
  const s = q.toLowerCase();
  if (/\b(exact|date|day|when exactly|specific)\b/.test(s)) return "exact";
  if (/\bnext\s*week|coming\s*week\b/.test(s)) return "nextweek";
  if (/\btips?|advice|how can i improve\b/.test(s)) return "tips";
  if (/\bremedies?|upaya|mantra|pooja|totka\b/.test(s)) return "remedies";
  if (/\brole|title|what kind of role\b/.test(s)) return "role";
  if (/\brecruiter|talking points|call points\b/.test(s)) return "recruiter";
  if (/\bsector|sectors|industry|domain\b/.test(s)) return "sectors";
  if (/\bwhen|change|increment|offer\b/.test(s)) return "when";
  return "generic";
};

const parseMdAd = (label?: string): { md?: string; ad?: string } => {
  if (!label) return {};
  const m = label.match(
    /\b(ketu|venus|sun|moon|mars|rahu|jupiter|saturn|mercury)\s+md\s*\/\s*(ketu|venus|sun|moon|mars|rahu|jupiter|saturn|mercury)\s+ad/i
  );
  if (!m) return {};
  const C = (x: string) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase();
  return { md: C(m[1]), ad: C(m[2]) };
};

const firstWin = (windows?: NarrativeInput["windows"]) => {
  if (!windows || !windows.length) return undefined;
  const w = [...windows].sort((a, b) => a.fromISO.localeCompare(b.fromISO))[0];
  return w;
};

/* -------------------------------------------------------------------------- */
/* House logic (lightweight scoring; degrades gracefully)                     */
/* -------------------------------------------------------------------------- */

type HousePack = {
  relevant: number[];
  blurb: string;
  remedyHint: string;
};

const HOUSE_MAP: Record<string, HousePack> = {
  // Job/career
  job: {
    relevant: [2, 6, 10, 11],
    blurb:
      "I’m weighing pay & resources (2), daily grind & competition (6), status & career arc (10), and results/network (11).",
    remedyHint:
      "Keep Saturdays light and consistent; offer service quietly; anchor decisions on scope → impact → comp.",
  },
  // Wealth / savings
  wealth: {
    relevant: [2, 11, 5],
    blurb: "I’m looking at income & savings (2), gains & networks (11), and speculation/bonuses (5).",
    remedyHint:
      "Track inflow/outflow weekly; favor regulated instruments; keep a tiny decision log.",
  },
  // Health
  health: {
    relevant: [1, 6, 8, 12],
    blurb:
      "Vitality & body (1), immunity & routine (6), recovery/transformation (8), and rest/sleep patterns (12) set the tone.",
    remedyHint:
      "Fix a routine first; add sunlight + walking; one small non-negotiable habit beats big pushes.",
  },
  // Property / vehicle
  property: {
    relevant: [4, 2, 11],
    blurb: "Home/comfort (4), liquidity (2) and ability to realize gains (11) steer the decision.",
    remedyHint: "Doc-check early, site-visit on strong sub-windows; don’t rush registration.",
  },
  vehicle: {
    relevant: [3, 4, 2, 11],
    blurb: "Commute & short travel (3), comfort (4) with liquidity (2) and gains (11).",
    remedyHint: "Compare TCO; test-drive on supportive dates; keep insurance clean.",
  },
  // Relationships / marriage (sketch)
  relationships: {
    relevant: [5, 7, 11],
    blurb: "Romance & fun (5), partnership (7), and social proof (11).",
    remedyHint: "Meet light; seed conversations during Venus/Mercury flavor.",
  },
  marriage: {
    relevant: [7, 2, 11],
    blurb: "Partnership (7) with family/resources (2) and network support (11).",
    remedyHint: "Use strongest sub-window for formal steps; prepare docs upfront.",
  },
  disputes: {
    relevant: [6, 7, 8],
    blurb: "Competition (6), contracts/opponents (7), and resolution/transform (8).",
    remedyHint: "Document decisions; avoid impulse filings; seek expert second opinion.",
  },
};
function composeGeneric(args: ComposeArgs): {
  answer?: string;
  how?: string;
  quarters?: string[];
  micro?: Array<any>;
} {
  const topic = String(args.topic || "").toLowerCase();
  const mdad = args.nowLabel ? `You’re in **${args.nowLabel}**.` : "";

  // Use the helper `firstWin` defined above, not `_firstWindow`
  const win = firstWin(args.windows);
  const when =
    win &&
    `Supportive window: **${_nice(win.fromISO)} → ${_nice(win.toISO)}**${
      win.tag ? ` (${win.tag})` : ""
    }.`;

  // Topic-specific opener + how-to
  let opener = "Here’s the clean, usable plan.";
  let how = "Keep actions small and steady; review every Sunday.";

  if (topic === "wealth") {
    opener = "Let’s steady your **money rhythm**—cash-in, cash-out, and buffers.";
    how =
      "Automate a weekly SIP, track spends 1x/week, and aim for a quiet 1–2% spend cut each week. Park windfalls, avoid fresh EMI during weak weeks.";
  } else if (topic === "health") {
    opener = "We’ll protect **energy, sleep, and routine**—slow and sustainable.";
    how =
      "Anchor sleep/wake, 20-minute walks most days, light meals at dinner, and one screen-free evening per week. Book checkups inside supportive windows.";
  } else if (topic === "vehicle") {
    opener = "Treat the vehicle decision like a mini project—TCO first, then test drives.";
    how =
      "Shortlist 3 models, book test drives inside the window, compare TCO (fuel+ins+service), and negotiate calmly near the tail end.";
  } else if (topic === "property") {
    opener = "Property moves best with **documents first, visits second**.";
    how =
      "Collect docs (title, encumbrance, society NOC), shortlist 3 areas, do weekend site visits, negotiate only after banker’s soft approval.";
  } else if (topic === "relationships") {
    opener = "Keep the relationship cadence warm and consistent.";
    how =
      "One meaningful plan per week, one honest check-in, and meet a close friend/family during supportive weeks.";
  } else if (topic === "marriage") {
    opener = "Stage the milestones—discuss → families meet → formalize.";
    how =
      "Use supportive sub-window for formal steps. Keep logistics ready (venues, documents) ahead of time.";
  } else if (topic === "disputes") {
    opener = "In disputes, **paper trail and patience** win the long game.";
    how =
      "Date-stamp evidence, keep counsel in the loop, and use supportive days for filings/hearings. Don’t escalate on weak days.";
  }

  return {
    answer: [
      opener,
      mdad,
      when || "I’ll show exact dates once sub-windows are available.",
    ]
      .filter(Boolean)
      .join("\n\n"),
    how,
  };
}

function houseScore(opts: {
  topic: string;
  natal?: NarrativeInput["profile"] extends { natal: infer N } ? N : any;
  aspects?: NarrativeInput["profile"] extends { natal: { aspects: infer A } } ? A : any;
}) {
  const pack = HOUSE_MAP[opts.topic] || HOUSE_MAP["job"];
  const rel = new Set(pack.relevant);
  const houses = opts.natal?.houses || {};
  const aspects = (opts.natal?.aspects || []) as Array<{ from: string; toHouse: number; type: string }>;

  // Start neutral
  let score = 0;
  const notes: string[] = [];

  // Lord strength heuristics
  for (const h of rel) {
    const row = houses[String(h)];
    if (!row) continue;
    if (row.strength === "strong") {
      score += 1;
      notes.push(`House ${h} lord strong (${row.lord} in ${row.sign}).`);
    } else if (row.strength === "weak") {
      score -= 1;
      notes.push(`House ${h} lord stressed/weak (${row.lord ?? "—"}).`);
    }
  }

  // Aspects toward relevant houses
  for (const a of aspects) {
    if (!rel.has(a.toHouse)) continue;
    if (/trine|sextile|conj|support/i.test(a.type)) {
      score += 0.5;
      notes.push(`${a.from} supports house ${a.toHouse} (${a.type}).`);
    } else if (/square|oppose|debil|malefic/i.test(a.type)) {
      score -= 0.5;
      notes.push(`${a.from} pressures house ${a.toHouse} (${a.type}).`);
    }
  }

  // Clamp & translate to text
  const clamp = Math.max(-2, Math.min(2, score));
  const mood =
    clamp >= 1 ? "supportive"
    : clamp <= -1 ? "cautious"
    : "balanced";

  return { mood, score: clamp, notes, pack };
}

/* -------------------------------------------------------------------------- */
/* Humanized paragraph builders                                               */
/* -------------------------------------------------------------------------- */

function openerLine(input: NarrativeInput) {
  const name = input.profile?.name ? `for **${input.profile.name}**` : "";
  const md = parseMdAd(input.nowLabel).md;
  const ad = parseMdAd(input.nowLabel).ad;
  const mdad = md && ad ? ` You’re in **${md} MD / ${ad} AD**.` : input.nowLabel ? ` You’re in **${input.nowLabel}**.` : "";
  return `Reading your chart ${name}, here’s the plan.${mdad}`;
}

function timingLines(input: NarrativeInput) {
  const first = firstWin(input.windows);
  if (!first) return "";
  const tag = first.tag || first.label || "supportive";
  return `Supportive window: **${_nice(first.fromISO)} → ${_nice(first.toISO)}** (${tag}).`;
}

function houseLines(input: NarrativeInput) {
  const { mood, notes, pack } = houseScore({
    topic: input.topic.toLowerCase(),
    natal: input.profile?.natal,
    aspects: input.profile?.natal?.aspects,
  });
  const color =
    mood === "supportive" ? "The houses lean supportive—use the tailwind."
    : mood === "cautious" ? "Signals are mixed—move methodically and protect downside."
    : "It’s balanced—steady effort wins.";

  const blurb = pack.blurb;
  const bullets =
    notes.length
      ? `Why I’m saying this: ${notes.slice(0, 3).join(" ")}`
      : "";

  return `${blurb} ${color}${bullets ? ` ${bullets}` : ""}`;
}

/* -------------------------------------------------------------------------- */
/* Topic/intents                                                              */
/* -------------------------------------------------------------------------- */

function answerForIntent(input: NarrativeInput): NarrativeOutput {
  const intent = _intent(input.query);
  const baseOpen = openerLine(input);

  // SHARE link mode
  if (input.tone === "share") {
    return {
      answer:
        "Vishal Chhabra is sharing the question they asked Melooha, with you!\n" +
        "Discover personalized astrology insights, guidance, and more on our astrology-as-a-service platform.\n" +
        "Join now: https://download.melooha.com",
    };
  }

  if (intent === "exact") {
    const adList =
      (input.opportunityByAD || [])
        .slice(0, 2)
        .map(
          (s) => `• **${_nice(s.fromISO)} → ${_nice(s.toISO)}** — ${s.label.replace(/\s+MD\s*\/\s*/i, " MD / ")}`
        )
        .join("\n");

    return {
      answer: [
        baseOpen,
        "",
        adList
          ? `Here are the **strongest sub-windows**:\n${adList}`
          : "Save DOB/TOB/TZ in Life Report to surface exact AD sub-windows here.",
        timingLines(input),
      ]
        .filter(Boolean)
        .join("\n"),
      how:
        "Schedule high-stakes steps *inside* these dates. Warm referrals before screens; small, visible wins every week.",
    };
  }

  if (intent === "nextweek") {
    return {
      answer: [
        baseOpen,
        "",
        "Next 7 days: batch outreach early; secure at least one warm intro; ship one tiny public win; book one mock session.",
        timingLines(input),
      ].join("\n"),
      how:
        "Your period rewards steady proof of impact over volume. Log outcomes; adjust next week.",
    };
  }

  if (intent === "tips") {
    return {
      answer: [
        baseOpen,
        "",
        "Practical tips:",
        "• Visibility: 1 small public win/week.",
        "• Referrals > cold apply: press intros before screens.",
        "• Negotiation: scope → impact → comp; prep two counters; lock references.",
      ].join("\n"),
      how: "If you do one thing this week: ship one visible win and tell a real person about it.",
    };
  }

  if (intent === "remedies") {
    const md = parseMdAd(input.nowLabel).md || "";
    const gentle =
      /saturn|ketu/i.test(md)
        ? "Keep Saturdays clean; light sesame lamp; offer quiet service."
        : /rahu/i.test(md)
        ? "Do one mindful digital-detox block/day; note the single decision that mattered."
        : /venus/i.test(md)
        ? "Polish: tidy wardrobe; sweet speech; gratitude practice."
        : "Keep a simple routine and 10 minutes of breathwork.";
    return {
      answer: [baseOpen, "", "Light remedies to keep rhythm steady:", `• ${gentle}`].join("\n"),
      how: "Astrology supports cadence; your effort pattern matters more than raw volume.",
    };
  }

  if (intent === "role") {
    return {
      answer: [
        baseOpen,
        "",
        "Pick 1–2 titles you can *prove* with artifacts (case-study / PR / demo). Prefer orgs with published bands and clear scope.",
      ].join("\n"),
      how: "Keep your story tight: scope you owned → impact you drove → comp clarity.",
    };
  }

  if (intent === "recruiter") {
    return {
      answer: [
        baseOpen,
        "",
        "Three points for a recruiter call:",
        "• Recent impact: 2 case-studies with measurable lift.",
        "• Strengths: align to your stack.",
        "• What I want next: scope/ownership aligned to impact → comp.",
      ].join("\n"),
      how: "Keep it under 60 seconds; results > responsibilities.",
    };
  }

  // sectors intent is handled by the route's QA or a separate composer – keep generic here
  if (intent === "sectors") {
    return {
      answer: [
        baseOpen,
        "",
        "Target sectors depend on MD/AD flavor and your role/stack. Save role + stack in Life Report for a sharper, chart-aware list.",
        timingLines(input),
      ].join("\n"),
      how: "Pick 3 target orgs; secure one warm intro per org; tie story to scope → impact → comp.",
    };
  }

  // WHEN / GENERIC — include houses + timing
  return {
    answer: [
      baseOpen,
      "",
      houseLines(input),
      timingLines(input),
      "",
      "Use it like this: keep weekly targets light; warm referrals before screens; ship one small visible win each week.",
    ].join("\n"),
    how:
      "Aim for one meaningful action per week that a real person can see. Review every Sunday; adjust lightly.",
  };
}

/* -------------------------------------------------------------------------- */
/* Public entry                                                               */
/* -------------------------------------------------------------------------- */

export function makeNarrative(input: NarrativeInput): NarrativeOutput {
  try {
    const out = answerForIntent(input);

    // Surface quarterly plan / micro if provided (UI reads these fields)
    const quarters: string[] = [];
    if (Array.isArray(input?.plan?.quarters)) {
      for (const q of input.plan.quarters.slice(0, 4)) {
        const f = Array.isArray(q.focus) ? q.focus.join(", ") : "";
        quarters.push(`${q.label}: ${f}`.trim());
      }
    }

    const micro = Array.isArray(input?.plan?.micro) ? input.plan.micro : undefined;

    return { ...out, quarters: quarters.length ? quarters : undefined, micro };
  } catch {
    // absolute fallback
    const first = firstWin(input.windows);
    return {
      answer:
        `Here’s the clean, usable plan.${input.nowLabel ? ` You’re in **${input.nowLabel}**.` : ""}\n\n` +
        (first
          ? `Supportive window: **${_nice(first.fromISO)} → ${_nice(first.toISO)}**.`
          : "I’ll surface exact sub-windows once birth details are saved."),
      how: "Keep weekly targets light; warm referrals before screens; ship a small, visible win each week.",
    };
  }
}
