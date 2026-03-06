// FILE: src/server/fullGuidance/buildPaidOutput.ts
import "server-only";

export type PaidPrediction = {
  area: string;
  event: string;
  text: string;
  windowISO: { from: string; to: string };
  confidence: number;
  why?: string;
  sign?: string;
  do?: string;
  avoid?: string;
  consequence?: string;

  // optional compatibility fields used later
  trigger?: string;
  action?: string;
  handledWell?: string;
  handledPoorly?: string;
};

export type PhaseBrief = {
  diagnosis: string;
  why: string[];
  moves: string[];
  traps: string[];
  outcome: string;
  confidence: number;
};

export type PaidOutput = {
  theme: string;
  themeDrivers: string[];
  opportunity: string;
  risk: string;
  controlLever: string;
  nonNegotiable: string;
  phaseBrief: PhaseBrief;
  predictions14d: PaidPrediction[];
  predictions30d: PaidPrediction[];
  predictions60d: PaidPrediction[];
  predictions90d: PaidPrediction[];
  keyWindows12m?: PaidPrediction[];
};

// --- your exact helper implementations ---
function getNowFacts(report: any): string[] {
  return Array.isArray(report?.transitNowFacts) ? report.transitNowFacts : [];
}

function clampPct(n: number) {
  return Math.max(35, Math.min(92, Math.round(n)));
}

// ✅ Missing helper: pickTopWindows
function pickTopWindows(report: any): any[] {
  const a: any[] = Array.isArray(report?.topTransits) ? report.topTransits : [];
  if (a.length) return a;

  const b: any[] = Array.isArray(report?.transits) ? report.transits : [];
  if (b.length) {
    return b
      .slice()
      .sort((x: any, y: any) => Number(y?.strength ?? 0) - Number(x?.strength ?? 0))
      .slice(0, 40);
  }

  return [];
}

function findWindow(report: any, predicate: (t: any) => boolean) {
  const list = pickTopWindows(report);
  return list.find(predicate) ?? null;
}

// ----------------------------
// ✅ PASTE YOUR buildPaidOutput FUNCTION BELOW
// (exactly what you pasted to me)
// ----------------------------
export function buildPaidOutput(report: any): PaidOutput {
  const facts = getNowFacts(report);

  // --- helpers ---
  const todayISO =
    String(report?.meta?.todayISO || report?.todayISO || "").slice(0, 10) ||
    new Date().toISOString().slice(0, 10);

  const addDaysISO = (iso: string, days: number) => {
    const d = new Date(iso + "T00:00:00.000Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const makeWin = (days: number) => ({ from: todayISO, to: addDaysISO(todayISO, days) });

  const iso10 = (v: any) => String(v ?? "").slice(0, 10);
  const toWin = (w: any, fallbackDays: number) => {
    if (!w) return makeWin(fallbackDays);
    const from = iso10(w?.startISO ?? w?.from ?? w?.windowISO?.from);
    const to = iso10(w?.endISO ?? w?.to ?? w?.windowISO?.to);
    if (from && to) return { from, to };
    return makeWin(fallbackDays);
  };

  // --- evidence flags from facts (be generous: facts vary) ---
  const hasH6 = facts.some((s) => /H\s*6/i.test(String(s)) || /6th house/i.test(String(s)));
  const hasJup10 = facts.some(
    (s) => /Jupiter/i.test(String(s)) && (/H\s*10/i.test(String(s)) || /10th house/i.test(String(s)))
  );
  const hasSat7 = facts.some(
    (s) => /Saturn/i.test(String(s)) && (/H\s*7/i.test(String(s)) || /7th house/i.test(String(s)))
  );

  const themeDrivers: string[] = [];
  if (hasH6) themeDrivers.push("H6 active: work/routines/health cleanup.");
  if (hasJup10) themeDrivers.push("Jupiter H10: visibility via output.");
  if (hasSat7) themeDrivers.push("Saturn H7: partnership terms + boundaries.");
  if (!themeDrivers.length) themeDrivers.push("Primary lever: consistency + clean communication.");

  // --- theme (less generic) ---
  const themeParts = [
    hasH6 ? "Operational pressure increases; precision matters." : "",
    hasJup10 ? "Career visibility opens if output is clean." : "",
    hasSat7 ? "Partnership terms require clarity and boundaries." : "",
  ].filter(Boolean);

  const theme = themeParts.length
    ? themeParts.join(" ")
    : "Execution + structural clarity dominate this cycle.";

  // --- windows from computed transit hits ---
  const winVenusRahu = findWindow(
    report,
    (t) => (t?.planet === "Venus" || t?.transitPlanet === "Venus") && /natal Rahu/i.test(String(t?.target ?? t?.natalPoint ?? ""))
  );
  const winMarsRahu = findWindow(
    report,
    (t) => (t?.planet === "Mars" || t?.transitPlanet === "Mars") && /natal Rahu/i.test(String(t?.target ?? t?.natalPoint ?? ""))
  );
  const winVenusMars = findWindow(
    report,
    (t) => (t?.planet === "Venus" || t?.transitPlanet === "Venus") && /natal Mars/i.test(String(t?.target ?? t?.natalPoint ?? ""))
  );
  const winSunSun = findWindow(
    report,
    (t) => (t?.planet === "Sun" || t?.transitPlanet === "Sun") && /natal Sun/i.test(String(t?.target ?? t?.natalPoint ?? ""))
  );

  const w14 = makeWin(14);
  const w30 = makeWin(30);
  const w60 = makeWin(60);
  const w90 = makeWin(90);

  const evidenceScore =
    themeDrivers.length +
    (winSunSun ? 1 : 0) +
    (winMarsRahu ? 1 : 0) +
    (winVenusRahu ? 1 : 0);

  const baseConf = clampPct(50 + evidenceScore * 6);

  // --- why line shown inside each prediction card ---
  const whyLine = (area: string) => {
    const parts: string[] = [];

    // Dasha (short)
    const md = String(report?.activePeriods?.mahadasha?.lord ?? "").trim();
    const ad = String(report?.activePeriods?.antardasha?.subLord ?? "").trim();
    const pd = String(report?.activePeriods?.pratyantardasha?.lord ?? "").trim();
    if (md) parts.push(`Dasha: ${md}${ad ? `–${ad}` : ""}${pd ? `–${pd}` : ""}`);

    // Core signals
    if (hasH6) parts.push("H6 pressure (work/routine/health cleanup)");
    if (hasJup10) parts.push("H10 support (visibility via output)");
    if (hasSat7) parts.push("H7 weight (terms/boundaries)");

    // Transit anchors (use what actually exists in report windows)
    const labelWin = (w: any, name: string) => {
      if (!w) return "";
      const f = String(w?.startISO ?? w?.from ?? w?.windowISO?.from ?? "").slice(0, 10);
      const t = String(w?.endISO ?? w?.to ?? w?.windowISO?.to ?? "").slice(0, 10);
      const rng = f && t ? ` ${f}→${t}` : "";
      return `${name}${rng}`.trim();
    };

    if (area === "career") {
      const a = labelWin(winSunSun, "Sun spotlight");
      const b = labelWin(winMarsRahu, "Mars pressure");
      if (a) parts.push(a);
      else if (b) parts.push(b);
    }

    if (area === "relationships") {
      const a = labelWin(winVenusRahu, "Venus–Rahu terms");
      const b = labelWin(winVenusMars, "Venus–Mars charge");
      if (a) parts.push(a);
      else if (b) parts.push(b);
    }

    // Keep tight
    return parts.slice(0, 3).join(" • ");
  };

  // --- WHY bullets for phaseBrief ---
  const whyBullets: string[] = [];
  const md0 = String(report?.activePeriods?.mahadasha?.lord ?? "").trim();
  const ad0 = String(report?.activePeriods?.antardasha?.subLord ?? "").trim();
  const pd0 = String(report?.activePeriods?.pratyantardasha?.lord ?? "").trim();
  if (md0) whyBullets.push(`Dasha: ${md0}${ad0 ? `–${ad0}` : ""}${pd0 ? `–${pd0}` : ""}`);
  if (hasH6) whyBullets.push("Signal: 6th-house pressure → routines/workload/cleanup/health discipline.");
  if (hasJup10) whyBullets.push("Signal: 10th-house support → visibility if output is measurable.");
  if (hasSat7) whyBullets.push("Signal: 7th-house weight → relationships/partnership terms need clarity.");
  if (winSunSun) whyBullets.push("Timing: Sun activation → spotlight/authority window.");
  if (winVenusRahu) whyBullets.push("Timing: Venus–Rahu → attachment/terms get activated.");
  if (winMarsRahu) whyBullets.push("Timing: Mars–Rahu → urgency spike; avoid overcommitment.");

  // ---------------- Predictions ----------------
  const predictions14d: PaidPrediction[] = [
    {
      area: "career",
      event: "A finished task comes back for correction (precision test).",
      text: "This is a credibility moment: you either close the loop cleanly or you get stuck in rework cycles.",
      windowISO: w14,
      confidence: clampPct(baseConf + (hasH6 ? 8 : 0)),
      sign: "You hear: “Please resend with X / attach Y / adjust the numbers / align to the template.”",
      do: "Send ONE final version: (1) what changed, (2) the decision you need, (3) deadline. Put scope in writing.",
      avoid: "Avoid multiple partial revisions and vague ‘okay I’ll see’ replies.",
      consequence: "Handled cleanly → credibility rises. Delayed/messy → you become the fallback fixer.",
      why: whyLine("career"),
    },
    {
      area: "health",
      event: "Energy dips if routine slips (sleep + digestion sensitivity).",
      text:
        "This is a short window where routine has outsized impact: small discipline gives a big payoff, but small chaos shows fast.",
      windowISO: w14,
      confidence: clampPct(baseConf - 4 + (hasH6 ? 6 : 0)),
      why: whyLine("health"),
      sign: "Heavier mornings, caffeine reliance, short temper, constipation/bloating.",
      do: "10-day stabilizer: fixed sleep/wake, lighter dinner, 20–30 min walk daily. Keep workouts moderate.",
      avoid: "Avoid late dinners, heavy fried food, and late-night screen time (they trigger the spiral).",
      consequence:
        "Handled well → stable energy and clearer mood. Ignored → fatigue/irritation builds and productivity drops.",
    },
  ];

  const predictions30d: PaidPrediction[] = [
    {
      area: "relationships",
      event: "A clarity conversation happens (expectation / availability / commitment).",
      text:
        "Avoiding it turns into passive tension. Handling it directly stabilizes the dynamic quickly.",
      windowISO: w30,
      confidence: clampPct(baseConf + (hasSat7 ? 10 : 0)),
      why: whyLine("relationships"),
      sign:
        "Delayed replies, mixed signals, repeated misunderstandings, or a direct “Where is this going?” question.",
      do:
        "Send 3 lines: (1) what you want, (2) what you can commit to, (3) next step + date/time.",
      avoid: "Avoid late-night emotional debates and half-commitments.",
      consequence:
        "Handled well → stability and respect increases. Avoided → tension grows and boundaries harden.",
    },
    {
      area: "career",
      event: "Work becomes process ownership (cleanup + coordination = your value).",
      text:
        "Recognition comes if you standardize and document. Otherwise it becomes invisible labor and repeated rework.",
      windowISO: w30,
      confidence: clampPct(baseConf + (hasJup10 ? 6 : 0) + (hasH6 ? 6 : 0)),
      why: whyLine("career"),
      sign:
        "More dependencies/follow-ups; “Can you align/track/coordinate this?” requests increase.",
      do:
        "Create ONE standard: template + checklist + owner. Put scope in writing. Track outcomes (rework reduced, turnaround improved).",
      avoid: "Avoid saying yes without scope/authority/deadline — that creates unpaid pressure.",
      consequence:
        "Handled well → visible credibility + scope upgrade. Handled poorly → you become the default fixer without credit.",
    },
  ];

  const predictions60d: PaidPrediction[] = [
    {
      area: "money",
      event: "A ‘useful upgrade’ purchase temptation appears (recurring leak risk).",
      text:
        "This is a discipline test: the wrong purchase becomes a quiet monthly drain; the right one reduces friction and saves time.",
      windowISO: w60,
      confidence: clampPct(baseConf - 6),
      why: whyLine("money"),
      sign: "You justify it as “This will save time” or “This is a quality upgrade.”",
      do:
        "48-hour rule + friction test: buy ONLY if it removes daily repeat hassle or increases output measurably.",
      avoid: "Avoid subscriptions/add-ons that feel small but stack monthly.",
      consequence:
        "Handled well → spending stays controlled and clean. Impulsive → recurring leak that annoys you later.",
    },
    {
      area: "career",
      event: "A pivot/leadership ask appears (scope expansion).",
      text:
        "If you don’t define authority and success metrics, it turns into unpaid extra work. If you define it, it becomes a real trajectory shift.",
      windowISO: toWin(winMarsRahu, 60),
      confidence: clampPct(baseConf + (winMarsRahu ? 6 : 0)),
      why: whyLine("career"),
      sign: "You hear: “Can you lead this / own this / present this / be point person?”",
      do:
        "Reply with conditions: scope + authority + success metric + timeline. Ship 1 tangible artifact in 7–10 days to lock credibility.",
      avoid: "Avoid taking responsibility without decision power (that creates burnout + blame).",
      consequence:
        "Handled well → real authority/visibility. Handled poorly → pressure rises without reward.",
    },
  ];

  const predictions90d: PaidPrediction[] = [
    {
      area: "career",
      event: "90-day outcome: recognition OR invisible workload — depends on proof + asking.",
      text:
        "You’ll be noticed for fixing recurring problems and delivering clean work. This becomes a recognition moment only if you bring proof and ask for scope/authority.",
      windowISO: toWin(winSunSun, 90),
      confidence: clampPct(baseConf + 10),
      why: whyLine("career"),
      sign: "A review, presentation, or stakeholder references your work directly.",
      do: "Bring proof: before/after results + 2–3 metrics. Ask explicitly for expanded scope/authority.",
      avoid: "Avoid hinting. Say it directly: scope, title, ownership, next level.",
      consequence:
        "Handled well → promotion-like scope upgrade. Avoided → you keep doing high-value work without credit.",
    },
    {
      area: "relationships",
      event: "90-day outcome: terms get defined (commitment OR boundary).",
      text:
        "Stability arrives once mixed signals stop. The relationship becomes clearer — either closer commitment or cleaner distance.",
      windowISO: toWin(winVenusRahu, 90),
      confidence: clampPct(baseConf - 2 + (hasSat7 ? 10 : 0) + (winVenusRahu ? 4 : 0)),
      why: whyLine("relationships"),
      sign: "Renegotiation talk, proposal-like conversation, or friction around expectations.",
      do: "Choose one path and state it early. If yes → define cadence. If no → define distance.",
      avoid: "Avoid keeping it half-open (it creates resentment).",
      consequence:
        "Handled well → stability and peace. Avoided → repeated friction and emotional drain.",
    },
    {
      area: "health",
      event: "90-day outcome: routine decides energy (boring habits beat bursts).",
      text:
        "Consistency stabilizes energy; chaos creates dips. This cycle rewards prevention more than recovery.",
      windowISO: w90,
      confidence: clampPct(baseConf - 4 + (hasH6 ? 6 : 0)),
      why: whyLine("health"),
      sign: "Workload stacks + late nights → fatigue spiral; digestion and mood follow.",
      do: "Non-negotiables: sleep window + lighter dinners + daily movement. Track sleep/energy/digestion weekly.",
      avoid: "Avoid extreme workouts or extreme dieting — they backfire under workload.",
      consequence:
        "Handled well → stable energy and better focus. Ignored → repeated dips and irritability.",
    },
    {
      area: "money",
      event: "90-day outcome: stable money if verified + boring; risk is quiet leaks.",
      text:
        "Risk comes from small recurring charges and ‘quick fix’ purchases. Your win is clean spending rules and monthly audits.",
      windowISO: w90,
      confidence: clampPct(baseConf - 10),
      why: whyLine("money"),
      sign: "Subscriptions/add-ons and small convenience spends quietly stack.",
      do: "Monthly audit: cancel 2 leaks, cap impulse buys, allow only 1 upgrade that truly saves time/output.",
      avoid: "Avoid stacking subscriptions and paying for ‘nice-to-have’ tools during a busy phase.",
      consequence:
        "Handled well → savings feel effortless. Ignored → money feels ‘leaky’ and annoying.",
    },
  ];

  const uniq = (arr: PaidPrediction[]) => {
    const seen = new Set<string>();
    return arr.filter((p) => {
      const key = `${p.area}|${String((p as any).text ?? "").slice(0, 90)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const p14 = uniq(predictions14d);
  const p30 = uniq(predictions30d);
  const p60 = uniq(predictions60d);
  const p90 = uniq(predictions90d);

  const topByArea = (arr: PaidPrediction[], area: string) =>
    arr.find((p) => String((p as any)?.area ?? "").toLowerCase() === area.toLowerCase()) ?? null;

  const topCareer = topByArea(p30, "career") || topByArea(p14, "career") || topByArea(p90, "career");
  const topRel = topByArea(p30, "relationships") || topByArea(p14, "relationships") || topByArea(p90, "relationships");
  const topHealth = topByArea(p14, "health") || topByArea(p30, "health") || topByArea(p90, "health");
  const topMoney = topByArea(p60, "money") || topByArea(p90, "money");

  const dashaLine =
    md0 ? `${md0}${ad0 ? `–${ad0}` : ""}${pd0 ? `–${pd0}` : ""}` : "";

  const diagnosis =
    `${dashaLine ? `Dasha running: ${dashaLine}. ` : ""}` +
    `${topCareer?.text ? `Career: ${String(topCareer.text)} ` : ""}` +
    `${topRel?.text ? `Relationships: ${String(topRel.text)} ` : ""}` +
    `${topHealth?.text ? `Health: ${String(topHealth.text)} ` : ""}` +
    `${topMoney?.text ? `Money: ${String(topMoney.text)}` : ""}`;

  const moves = [
    (topCareer as any)?.action ? `Career move: ${String((topCareer as any).action)}` : "",
    (topRel as any)?.action ? `Relationship move: ${String((topRel as any).action)}` : "",
    (topHealth as any)?.action ? `Health move: ${String((topHealth as any).action)}` : "",
    (topMoney as any)?.action ? `Money move: ${String((topMoney as any).action)}` : "",
  ].filter(Boolean).slice(0, 3);

  const traps = [
    (topCareer as any)?.trigger ? `Career trap: ${String((topCareer as any).trigger)}` : "",
    (topRel as any)?.trigger ? `Relationship trap: ${String((topRel as any).trigger)}` : "",
    (topHealth as any)?.trigger ? `Health trap: ${String((topHealth as any).trigger)}` : "",
    (topMoney as any)?.trigger ? `Money trap: ${String((topMoney as any).trigger)}` : "",
  ].filter(Boolean).slice(0, 3);

  const outCareer = topByArea(p90, "career");
  const outRel = topByArea(p90, "relationships");
  const outHealth = topByArea(p90, "health");
  const outMoney = topByArea(p90, "money");

  const outcome =
    `If you execute cleanly, your 90-day outcome looks like: ` +
    `${outCareer?.text ? `Career: ${String(outCareer.text)} ` : ""}` +
    `${outRel?.text ? `Relationships: ${String(outRel.text)} ` : ""}` +
    `${outHealth?.text ? `Health: ${String(outHealth.text)} ` : ""}` +
    `${outMoney?.text ? `Money: ${String(outMoney.text)}` : ""}`;

  const phaseBrief: PhaseBrief = {
    diagnosis,
    why: whyBullets.slice(0, 5),
    moves,
    traps,
    outcome,
    confidence: baseConf,
  };

  const opportunity = [
    hasJup10 ? "Visibility increases when output is measurable (deliverable + metric + outcome)." : "",
    winSunSun ? "Use Sun window for recognition/authority conversations." : "",
    hasH6 ? "Cleanup becomes a signature win if you standardize + document." : "",
  ].filter(Boolean).join(" ");

  const risk = [
    hasH6 ? "Rework + routine chaos → fatigue and lower precision." : "",
    hasSat7 ? "Unclear expectations → relationship/partnership friction." : "",
    winVenusMars ? "Higher charge: chemistry and conflict rise together if ego triggers." : "",
    winMarsRahu ? "Overcommitment risk: scope without authority becomes pressure." : "",
  ].filter(Boolean).join(" ");

  const opportunitySafe =
    opportunity || "Opportunity: build a visible win by standardizing one process and documenting outcomes.";
  const riskSafe =
    risk || "Risk: rework + unclear terms drains energy and creates friction if you don’t set scope and boundaries.";

  const controlLever = hasH6
    ? "Consistency + precision: one clean system (template/checklist) + stable routine for 10 days."
    : "Clarity + follow-through: one decision, one message, one closure loop per day.";

  const nonNegotiable = [
    "No vague commitments (always define scope + deadline).",
    "No late-night conflict conversations.",
    hasH6 ? "No sleep chaos for 10 days." : "",
  ].filter(Boolean).join(" ");

  const keyWindows12m: PaidPrediction[] = [];

  if (winVenusRahu) {
    keyWindows12m.push({
      area: "relationships",
      event: "12-month turning point: relationship terms / alignment shifts.",
      text: "Partnership turning point: alignment opportunity OR a clean renegotiation.",
      windowISO: toWin(winVenusRahu, 90),
      confidence: clampPct(78),
      why: whyLine("relationships"),
      sign: "Reconnect / proposal-like talk / terms change / boundary conversation.",
      do: "State intentions early. Choose one path. Put expectations + cadence in writing if needed.",
      avoid: "Avoid keeping it half-open or sending mixed signals.",
      consequence: "Handled well → stability and clarity. Avoided → repeated friction and emotional drain.",
    });
  }

  if (winMarsRahu) {
    keyWindows12m.push({
      area: "career",
      event: "12-month spike window: leadership ask / scope expansion appears.",
      text: "Career spike: one decisive action changes trajectory (scope/visibility).",
      windowISO: toWin(winMarsRahu, 90),
      confidence: clampPct(82),
      why: whyLine("career"),
      sign: "New responsibility, bold opportunity, or pressure to lead / deliver fast.",
      do: "Ask for scope + authority + success metric. Ship 1 tangible artifact quickly to lock credibility.",
      avoid: "Avoid accepting responsibility without decision power (unpaid pressure trap).",
      consequence: "Handled well → real trajectory shift. Handled poorly → burnout + blame without reward.",
    });
  }

  if (winVenusMars) {
    keyWindows12m.push({
      area: "relationships",
      event: "12-month high-intensity window: chemistry + ego both rise.",
      text: "High intensity: chemistry rises; conflict risk rises if ego triggers.",
      windowISO: toWin(winVenusMars, 90),
      confidence: clampPct(74),
      why: whyLine("relationships"),
      sign: "Strong pull + strong reactions; quick escalation; blame loops.",
      do: "Keep discussions factual. Choose calm timing. De-escalate fast when tone rises.",
      avoid: "Avoid late-night emotional debates and ego-driven ultimatums.",
      consequence: "Handled well → passion with control. Ignored → avoidable fights and distance.",
    });
  }

  if (winSunSun) {
    keyWindows12m.push({
      area: "career",
      event: "12-month spotlight window: recognition / leadership conversation opens.",
      text: "Spotlight: recognition/leadership conversation if credibility is built.",
      windowISO: toWin(winSunSun, 90),
      confidence: clampPct(76),
      why: whyLine("career"),
      sign: "Promotion-like chat, visibility role, leadership ask, or stakeholder praise.",
      do: "Bring deliverables + numbers. Ask explicitly for the next level (scope/title/ownership).",
      avoid: "Avoid hinting or waiting for others to notice. Make the ask direct.",
      consequence: "Handled well → recognition/scope upgrade. Avoided → you do the work but stay undervalued.",
    });
  }

  return {
    theme,
    themeDrivers,
    opportunity: opportunitySafe,
    risk: riskSafe,
    controlLever,
    nonNegotiable,
    phaseBrief,
    predictions14d: p14,
    predictions30d: p30,
    predictions60d: p60,
    predictions90d: p90,
    keyWindows12m,
  };
}