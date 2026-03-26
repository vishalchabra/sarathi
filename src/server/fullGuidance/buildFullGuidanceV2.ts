// /src/server/fullGuidance/buildFullGuidanceV2.ts
import type { ConfidenceLabel, GuidanceDomain } from "./types";
const toArrStr = (x: any): string[] => {
  if (!x) return [];
  if (Array.isArray(x)) return x.map((v) => String(v).trim()).filter(Boolean);
  return [String(x).trim()].filter(Boolean);
};

const uniqStr = (arr: any[]): string[] =>
  Array.from(new Set((arr ?? []).map((x) => String(x).trim()).filter(Boolean)));

const safeInt = (n: any, fallback: number) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
};
const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

const confLabel = (score: number): ConfidenceLabel =>
  score >= 70 ? "High" : score >= 55 ? "Medium" : "Low";

const toDomain = (area: any): GuidanceDomain => {
  const a = String(area ?? "").toLowerCase();
  if (a.includes("career")) return "Career";
  if (a.includes("relation")) return "Relationships";
  if (a.includes("health")) return "Health";
  if (a.includes("money") || a.includes("finance")) return "Money";
  if (a.includes("inner") || a.includes("mind")) return "Inner";
  // default mapping: treat "general" as Inner (or Career). You can change later.
  return "Inner";
};

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function pickTop<T>(arr: T[], n: number) {
  return Array.isArray(arr) ? arr.slice(0, n) : [];
}

function normalizeISO(x: any): string {
  const s = String(x ?? "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}
const overlaps = (a: any, b: any) =>
  !(String(a.toISO) < String(b.fromISO) || String(a.fromISO) > String(b.toISO));

const pickHighlights = (scenarios: any[], max = 3) => {
  const picked: any[] = [];
  const usedDomains = new Set<GuidanceDomain>();

  for (const s of scenarios) {
    if (picked.length >= max) break;
    if (picked.some((p) => overlaps(p, s))) continue;
    if (usedDomains.has(s.domain) && usedDomains.size < 3) continue;

    picked.push(s);
    usedDomains.add(s.domain);
  }
  return picked;
};
// This builder intentionally uses your EXISTING paid output fields
// so you can ship V2 immediately without rewriting astro math today.

const splitBullets = (raw: any): string[] => {
  const s = String(raw ?? "").trim();
  if (!s) return [];
  // split on • or | or newline
  return s
    .split(/•|\||\n/g)
    .map((x) => x.trim())
    .filter(Boolean);
};

// pulls short “why” facts like H6/H10 from the why string
const extractWhyFacts = (raw: any): string[] => {
  const s = String(raw ?? "");
  if (!s) return [];
  const out: string[] = [];
  const h = s.match(/H\d{1,2}\s*[^\•\|]+/g); // e.g., "H6 pressure (...)" "H10 support (...)"
  if (h) out.push(...h.map((x) => x.trim()));
  // also keep “Rahu–Venus–Venus” like segments
  const d = s.match(/Rahu[–-]\s*Venus[–-]\s*Venus|Rahu[–-]\s*Venus/gi);
  if (d) out.push(...d.map((x) => x.trim()));
  return uniqStr(out).slice(0, 3);
};
function astrologerShiftNarrative(domain: string, headline: string, mode: "next" | "strongest") {
  const h = String(headline ?? "").trim();

  if (domain === "Career") {
    return mode === "next"
      ? `This is when work stops feeling quietly heavy and starts asking for definition. A review, a result, or a visible responsibility can bring your contribution into focus. If your effort has been real but unseen, this is the period when it can finally be named properly. ${h}`.trim()
      : `This is the strongest career wave in the coming phase. What you have been carrying in the background can now turn into visibility, authority, or a direct increase in responsibility. Handled well, this becomes a step upward rather than just more work. ${h}`.trim();
  }

  if (domain === "Relationships") {
    return mode === "next"
      ? `This is when the relationship matter you have been carrying without full clarity can no longer stay undefined. A conversation, a change in behaviour, or emotional distance forces the truth into the open. What has been tolerated quietly now asks for a decision. ${h}`.trim()
      : `This is the strongest relationship wave ahead. Bonds become more defining here: commitment deepens, expectations are spoken, or unclear dynamics finally show their limit. What has been emotionally tolerated may now need a firm decision. ${h}`.trim();
  }

  if (domain === "Health") {
    return mode === "next"
      ? `This is when the body starts speaking more directly. If rhythm has been ignored, fatigue, digestion, or mood will show it quickly. If routine is corrected in time, recovery can also come quickly. ${h}`.trim()
      : `This is the strongest health and routine wave ahead. The body will reward discipline and punish inconsistency more sharply than usual. This is less about illness and more about whether daily rhythm is respected or neglected. ${h}`.trim();
  }

  if (domain === "Money") {
    return mode === "next"
      ? `This is when financial reality becomes easier to see. Not through one dramatic event, but through repeated patterns: small leaks, unnecessary spends, or the relief that comes once control returns. ${h}`.trim()
      : `This is the strongest money wave ahead. Stability can improve here, but only through verification, restraint, and cleaner decisions. If handled loosely, avoidable leakage grows; if handled well, the phase becomes more solid and less noisy. ${h}`.trim();
  }

  return mode === "next"
    ? `This is when your inner state becomes harder to ignore. Restlessness, mental clutter, or emotional flatness begin asking for simplification. What is misaligned will feel heavier; what is honest will feel quieter. ${h}`.trim()
    : `This is the strongest inner wave ahead. The phase asks for less noise, less scattering, and more truth. What has been mentally tolerated may now need to be consciously released. ${h}`.trim();
}

function astrologerWeekNarrative(
  domain: string,
  weekNumber: number,
  headline?: string
) {
  const h = String(headline ?? "").trim();

  const stage =
    weekNumber === 1
      ? "setup"
      : weekNumber === 2
      ? "pressure"
      : weekNumber === 3
      ? "decision"
      : "result";

  if (domain === "Career") {
    if (stage === "setup") {
      return {
        focus:
          "This week sets the direction at work. Early signals show where visibility, ownership, or clearer positioning will matter more than usual." +
          (h ? ` ${h}` : ""),
        action:
          "Prepare proof properly: what changed, what improved, and what you are actually carrying.",
        avoid:
          "Do not assume people fully understand your value without you showing it clearly.",
      };
    }

    if (stage === "pressure") {
      return {
        focus:
          "This week work pressure becomes more visible. If role, scope, or ownership stays loose, the burden can rise faster than the recognition." +
          (h ? ` ${h}` : ""),
        action:
          "Put structure around what is pending and name ownership clearly.",
        avoid:
          "Do not keep carrying important work silently just because it is easier than speaking directly.",
      };
    }

    if (stage === "decision") {
      return {
        focus:
          "This week asks for a clear professional decision. A role, boundary, responsibility, or next-level ask may now need to be stated more directly." +
          (h ? ` ${h}` : ""),
        action:
          "Say clearly what you own, what result you delivered, and what should happen next.",
        avoid:
          "Do not keep hinting when the situation now needs a direct position.",
      };
    }

    return {
      focus:
        "This week shows the result of earlier work and positioning. What was handled well can now turn into visibility, authority, or cleaner recognition." +
        (h ? ` ${h}` : ""),
      action:
        "Consolidate progress and close loops with proof, not just effort.",
      avoid:
        "Do not dilute momentum by taking on fresh work before current gains are made visible.",
    };
  }

  if (domain === "Relationships") {
    if (stage === "setup") {
      return {
        focus:
          "This week begins to reveal where a relationship needs more clarity. The emotional tone may already be showing what can no longer stay vague." +
          (h ? ` ${h}` : ""),
        action:
          "Observe behaviour carefully and prepare for a clear conversation.",
        avoid:
          "Do not explain away signs that are already showing you the truth.",
      };
    }

    if (stage === "pressure") {
      return {
        focus:
          "This week brings relational pressure. What has been emotionally vague or half-defined may start feeling heavier than before." +
          (h ? ` ${h}` : ""),
        action:
          "Say what you mean simply and make expectations more visible.",
        avoid:
          "Do not keep something half-open just to postpone discomfort.",
      };
    }

    if (stage === "decision") {
      return {
        focus:
          "This week is about relationship definition. A decision about expectations, commitment, effort, or boundaries may now need to be faced honestly." +
          (h ? ` ${h}` : ""),
        action:
          "Choose clarity over mixed signals and state your terms cleanly.",
        avoid:
          "Do not settle for ambiguity once the need for truth is already obvious.",
      };
    }

    return {
      focus:
        "This week shows what earlier emotional patterns were leading toward. Bonds may feel stronger through honesty, or weaker through continued inconsistency." +
        (h ? ` ${h}` : ""),
      action:
        "Respond to what is real, not to what you hoped this would become.",
        avoid:
          "Do not restart confusion after clarity has already been shown.",
      };
  }

  if (domain === "Health") {
    if (stage === "setup") {
      return {
        focus:
          "This week shows early signs from the body. Small shifts in energy, sleep, digestion, or mood can tell you quickly whether rhythm is supporting you." +
          (h ? ` ${h}` : ""),
        action:
          "Tighten your daily rhythm before imbalance builds.",
        avoid:
          "Do not ignore the early body signal just because it still feels manageable.",
      };
    }

    if (stage === "pressure") {
      return {
        focus:
          "This week increases pressure on routine. The body reacts faster than usual to neglect, overstimulation, irregular sleep, or poor timing." +
          (h ? ` ${h}` : ""),
        action:
          "Protect sleep, meal timing, and daily movement with more discipline.",
        avoid:
          "Do not use willpower to override what the body is already showing you.",
      };
    }

    if (stage === "decision") {
      return {
        focus:
          "This week is about a health decision. You may need to choose rhythm over indulgence, steadiness over intensity, or correction over postponement." +
          (h ? ` ${h}` : ""),
        action:
          "Make one clean routine correction and follow it properly.",
        avoid:
          "Do not keep negotiating with the habit that is causing the same issue.",
      };
    }

    return {
      focus:
        "This week shows the result of your recent routine. If discipline improved, the body supports you; if not, the slowdown becomes more visible." +
        (h ? ` ${h}` : ""),
      action:
          "Keep what is working and repeat it consistently.",
      avoid:
          "Do not undo progress through one or two careless days.",
    };
  }

  if (domain === "Money") {
    if (stage === "setup") {
      return {
        focus:
          "This week helps you notice where money is actually going. Quiet leaks, repeat spends, and convenience habits become easier to see." +
          (h ? ` ${h}` : ""),
        action:
          "Track the repeated spend before trying to solve the whole money picture.",
        avoid:
          "Do not dismiss small leaks just because each one looks harmless on its own.",
      };
    }

    if (stage === "pressure") {
      return {
        focus:
          "This week brings financial pressure through repetition, not drama. Loose spending, weak checking, or rushed decisions may now feel heavier." +
          (h ? ` ${h}` : ""),
        action:
          "Pause, verify, and cut what is clearly unnecessary.",
        avoid:
          "Do not make quick comfort-based purchases without checking the pattern.",
      };
    }

    if (stage === "decision") {
      return {
        focus:
          "This week asks for a money decision. A purchase, commitment, correction, or spending boundary may now need a cleaner line." +
          (h ? ` ${h}` : ""),
        action:
          "Choose control over impulse and verify before committing.",
        avoid:
          "Do not let convenience make the decision for you.",
      };
    }

    return {
      focus:
          "This week shows the result of recent financial behaviour. Cleaner control brings relief; repeated leakage becomes harder to ignore." +
          (h ? ` ${h}` : ""),
      action:
          "Keep the correction that worked and make it repeatable.",
      avoid:
          "Do not reopen the same leak after finally seeing it clearly.",
    };
  }

  if (stage === "setup") {
    return {
      focus:
        "This week begins an inner reset. Mental overload, emotional clutter, or restlessness may be showing you what needs simplification." +
        (h ? ` ${h}` : ""),
      action:
        "Notice what is draining attention and reduce one source of noise.",
      avoid:
        "Do not force answers before creating inner space.",
    };
  }

  if (stage === "pressure") {
    return {
      focus:
        "This week increases inner pressure. What feels like confusion may actually be overload, and the need for simplification becomes stronger." +
        (h ? ` ${h}` : ""),
      action:
        "Protect one clean hour daily for silence, prayer, journaling, or undistracted work.",
      avoid:
        "Do not keep feeding the mind more stimulation when it already needs less.",
    };
  }

  if (stage === "decision") {
    return {
      focus:
        "This week is about an inner decision. You may need to consciously stop one draining pattern, one false attachment, or one noisy habit." +
        (h ? ` ${h}` : ""),
      action:
        "Choose one thing to release and one thing to protect.",
      avoid:
        "Do not keep calling overload ‘normal’ once you can clearly feel the cost.",
    };
  }

  return {
    focus:
      "This week shows the result of simplification. Less noise, cleaner attention, and more honesty can start making life feel lighter again." +
      (h ? ` ${h}` : ""),
    action:
      "Repeat what creates calm and remove what repeatedly scatters you.",
    avoid:
      "Do not refill your life with noise just because the pressure has reduced.",
  };
}
export function buildFullGuidanceV2(input: {
  todayISO: string;
  activePeriods?: any;
  paid?: any;
  topTransits?: any[];      // ✅ add
  transitNowFacts?: string[]; // ✅ optional (nice for “house activation”)
}): any {
  const todayISO = normalizeISO(input.todayISO) || new Date().toISOString().slice(0, 10);
  // ----------------- Window helpers -----------------
const addDaysISO = (iso: string, days: number) => {
  // iso expected as "YYYY-MM-DD" (no time). Use UTC to avoid TZ drift.
  try {
    const d = new Date((String(iso) || new Date().toISOString().slice(0, 10)) + "T00:00:00.000Z");
    d.setUTCDate(d.getUTCDate() + Number(days || 0));
    return d.toISOString().slice(0, 10);
  } catch {
    return new Date(Date.now() + Number(days || 0) * 86400000).toISOString().slice(0, 10);
  }
};

const addWeeksISO = (iso: string, weeks: number) => addDaysISO(iso, Number(weeks || 0) * 7);

const weekLabel = (fromISO: string) => {
  const toISO = addDaysISO(fromISO, 6);
  return `${fromISO} → ${toISO}`;
};

/**
 * Coerce a paid-prediction object into a normalized { fromISO, toISO }.
 * - prefers explicit fields: windowISO.from/to, startISO/endISO, fromISO/toISO, from/to
 * - if toISO is missing or equals fromISO, uses fallbackDays to create a real range.
 */
const coerceWindow = (p: any, todayISO: string, fallbackDays = 14) => {
  const from =
    normalizeISO(p?.windowISO?.from) ||
    normalizeISO(p?.from) ||
    normalizeISO(p?.fromISO) ||
    normalizeISO(p?.startISO) ||
    todayISO;

  const candidateTo =
    normalizeISO(p?.windowISO?.to) ||
    normalizeISO(p?.to) ||
    normalizeISO(p?.toISO) ||
    normalizeISO(p?.endISO) ||
    "";

  // if to is missing or equals from, force a fallback range
  const to = candidateTo && candidateTo !== from ? candidateTo : addDaysISO(from, fallbackDays);

  return { fromISO: from, toISO: to };
};
  const paid = input.paid ?? {};
  const ap = input.activePeriods ?? null;

  // ---- Reality check (tight) ----
  const md = String(ap?.mahadasha?.lord ?? ap?.mahadasha?.mdLord ?? "").trim();
  const ad = String(ap?.antardasha?.subLord ?? ap?.antardasha?.lord ?? "").trim();
  const currentPhase = [md && `${md} MD`, ad && `${ad} AD`].filter(Boolean).join(" • ") || "Current phase";

  const preds14: any[] = Array.isArray(paid?.predictions14d) ? paid.predictions14d : [];
  const preds30: any[] = Array.isArray(paid?.predictions30d) ? paid.predictions30d : [];
  const preds60: any[] = Array.isArray(paid?.predictions60d) ? paid.predictions60d : [];
  const preds90: any[] = Array.isArray(paid?.predictions90d) ? paid.predictions90d : [];

  // ---- Domain snapshot from best 90d items (scenario-lite with evidence) ----
const preds90Lite = (Array.isArray(preds90) ? preds90 : []).map((p0) => {
  const p: any = p0 as any;

  const domain = toDomain(p?.area);
  const score = clamp(Number(p?.confidence ?? 50));

  const headline =
  String(p?.event ?? p?.headline ?? p?.text ?? "").trim() ||
  "A meaningful window opens — act deliberately.";
  const whyArr = uniqStr([
  ...toArrStr(p?.why),
  ...toArrStr(p?.trigger),
  ...toArrStr(p?.because),
  ...toArrStr(p?.evidence),
]).slice(0, 4);
  const mostLikelySign = uniq(
    ([] as any[])
      .concat(p?.sign ? [String(p.sign)] : [])
      .filter(Boolean)
      .map((x: any) => String(x).trim())
  ).slice(0, 2);

  const doArr = uniqStr([
  ...toArrStr(p?.do),
  ...toArrStr(p?.action),
  ...toArrStr(p?.winMove),
]).slice(0, 4);

const avoidArr = uniqStr([
  ...toArrStr(p?.avoid),
  ...toArrStr(p?.dont),
  ...toArrStr(p?.drainToCut),
]).slice(0, 3);
  return {
    domain,
    score,
    confidence: confLabel(score),
    headline,
    why: whyArr,
    mostLikelySign,
    do: doArr,
    avoid: avoidArr,
  };
});
const bestByDomain = new Map<GuidanceDomain, any>();
for (const s of preds90Lite) {
  const cur = bestByDomain.get(s.domain);
  if (!cur || Number(s.score) > Number(cur.score)) bestByDomain.set(s.domain, s);
}
  const domains = (["Career", "Relationships", "Health", "Money", "Inner"] as GuidanceDomain[])
  .map((d) => {
    
    const p = bestByDomain.get(d) ?? null;
  
    const score = clamp(Number(p?.score ?? 50));
    
    const headline =
      String(p?.headline ?? "").trim() ||
      "No strong window detected — stay steady and avoid forcing outcomes.";
    
    // ✅ Evidence: use scenario-lite fields only (no fluff)
    // priority: WHY → SIGN → DO
    const whyTop2 = (() => {
  const a = uniqStr([
    ...toArrStr(p?.why),
    ...toArrStr(p?.mostLikelySign),
    ...toArrStr(p?.do).slice(0, 1),
  ]).filter(Boolean);

  // Fallback chain (must always return 2)
  if (a.length >= 2) return a.slice(0, 2);

  const fallback = uniqStr([
    // force something tangible if inputs are sparse
    p?.headline ? `Focus: ${String(p.headline).slice(0, 80)}` : "",
    md && ad ? `Phase: ${md}–${ad} (background driver)` : "",
    paid?.winMove ? `Win move: ${String(paid.winMove).slice(0, 70)}` : "",
  ]).filter(Boolean);

  return uniqStr([...a, ...fallback]).slice(0, 2);
})();

  // Build a richer, non-fluffy “why this score”
const drivers = uniqStr([
  ...toArrStr(p?.why),
  ...toArrStr(p?.mostLikelySign),
  ...toArrStr(paid?.winMove),
]).slice(0, 3);

const risks = uniqStr([
  ...toArrStr(p?.avoid),
  ...toArrStr(paid?.drainToCut),
]).slice(0, 2);

// One lever that *changes outcome*
const lever =
  (Array.isArray(p?.do) && p.do[0] ? String(p.do[0]).trim() : "") ||
  String(paid?.winMove ?? "").trim() ||
  "Choose one priority and close the loop with proof.";

return {
  domain: d,
  score,
  confidence: confLabel(score),
  headline,
  whyTop2,
  scoreBreakdown: {
    drivers: drivers.length ? drivers : ["Driver: current phase favors steady progress."],
    risks: risks.length ? risks : ["Risk: scattered effort reduces the score."],
    lever,
  },
};
  });

const probabilityLabelByDomain: Record<string, string> = {
  Career: "Career movement",
  Relationships: "Relationship clarity",
  Health: "Health correction",
  Money: "Money stabilisation",
  Inner: "Inner reset",
};

const probabilities = (Array.isArray(domains) ? domains : [])
  .map((d: any) => {
    const domain = String(d?.domain ?? "");
    return {
      domain,
      label: probabilityLabelByDomain[domain] || domain,
      probability: Math.round(Number(d?.score ?? 50)),
    };
  })
  .sort((a: any, b: any) => b.probability - a.probability);
  // pick a “main theme” from best career/overall 90d
  const top90 = preds90
    .slice()
    .sort((a, b) => clamp(Number(b?.confidence ?? 0)) - clamp(Number(a?.confidence ?? 0)))[0];

  const mainTheme =
    String(top90?.text ?? "").trim() ||
    "A practical 90-day phase: progress comes from clarity, boundaries, and follow-through.";

  const winMove =
    String(paid?.winMove ?? paid?.reality?.winMove ?? "").trim() ||
    "Define one standard: scope + owner + checklist. Close loops with proof.";

  const drainToCut =
    String(paid?.drainToCut ?? paid?.reality?.drainToCut ?? "").trim() ||
    "Avoid saying yes without scope/authority/deadline.";

  // ---- Scenario maker from your existing prediction rows ----
  const toScenario = (p: any) => {
    const score = clamp(Number(p?.confidence ?? 50));
    const domain = toDomain(p?.area);
    // prefer an explicit window; if missing, produce a sensible horizon-based window
// attempt to pick a horizon from the prediction object, else default 14 days
const horizonDays = safeInt(p?.horizonDays ?? p?.horizon ?? p?.windowDays, 14);
const { fromISO, toISO } = coerceWindow(p, todayISO, horizonDays);

    const headline =
      String(p?.headline ?? p?.text ?? "").trim() ||
      "A meaningful window opens — act deliberately.";

    const mostLikelySign = uniq(
      [
        String(p?.mostLikelySign ?? "").trim(),
        String(p?.sign ?? "").trim(),
        String(p?.trigger ?? "").trim(),
      ].filter(Boolean)
    );

   const doArr = uniq(
  ([] as any[])
    .concat(Array.isArray(p?.do) ? p.do : p?.do ? [p.do] : [])
    .concat(p?.action ? [String(p.action)] : [])
    .filter(Boolean)
    .map((x: any) => String(x).trim())
);

    const avoidArr = uniqStr([
  ...toArrStr(p?.avoid),
  ...toArrStr(p?.dont),
]).slice(0, 4);
const consequence = String(p?.consequence ?? "").trim();

    return {
      domain,
      fromISO,
      toISO,
      score,
      confidence: confLabel(score),
      headline,
      why: uniqStr([
  ...toArrStr(p?.why),
  ...toArrStr(p?.trigger),
  ...toArrStr(p?.evidence),
]).slice(0, 3),
      mostLikelySign: pickTop(mostLikelySign, 3),
      do: pickTop(doArr, 4),
      avoid: pickTop(avoidArr, 4),
       outcomeIfDone:
    String(p?.outcomeIfDone ?? p?.handledWell ?? "").trim() ||
    (consequence.includes("Handled well") ? consequence : "") ||
    "Handled well → credibility and stability increase.",
  outcomeIfIgnored:
    String(p?.outcomeIfIgnored ?? p?.handledPoorly ?? "").trim() ||
    (consequence.includes("Avoided") ? consequence : "") ||
    "Handled poorly → delays and pressure increase.",
      drivers: pickTop(
        [
          { type: "Transit" as const, label: String(p?.trigger ?? "Transit"), strength: score / 100 },
        ],
        2
      ),
    };
  };

  const withinDays = (days: number) => (p: any) => {
  const w = p?.windowISO;
  const from = normalizeISO(w?.from) || normalizeISO(p?.fromISO) || normalizeISO(p?.startISO) || "";
  if (!from) return true; // keep if unknown
  const maxISO = addDaysISO(todayISO, days);
  return from <= maxISO;
};

const pack = (arr: any[], horizonDays: number, limit = 4) =>
  arr
    .slice()
    .filter(withinDays(horizonDays))
    .sort((a, b) => clamp(Number(b?.confidence ?? 0)) - clamp(Number(a?.confidence ?? 0)))
    .slice(0, limit)
    .map(toScenario);

const next14dPacked = pack(preds14, 14);
const next30dPacked = pack(preds30, 30);
const next60dPacked = pack(preds60, 60);
const next90dPacked = pack(preds90, 90, 4);

// choose top 3 non-overlapping windows
const candidates90 = pack(preds90, 90, 12);

const highlights90d = pickHighlights(
  candidates90.slice().sort((a, b) => b.score - a.score),
  3
);
// ----------------- Next 3 Turning Points -----------------

const turningPointTitle = (domain: string, headline: string) => {
  if (domain === "Career") return "Work visibility / responsibility shift";
  if (domain === "Relationships") return "Relationship clarity / definition";
  if (domain === "Health") return "Health / routine correction point";
  if (domain === "Money") return "Money control / leakage check";
  return "Inner reset / simplification point";
};

const turningPointMeaning = (domain: string, headline: string) => {
  if (domain === "Career") {
    return "A moment where work becomes easier to define, show, or claim properly.";
  }
  if (domain === "Relationships") {
    return "A moment where vagueness becomes harder to carry and clarity starts pushing forward.";
  }
  if (domain === "Health") {
    return "A moment where the body shows clearly whether routine is helping or hurting.";
  }
  if (domain === "Money") {
    return "A moment where repeated leaks or better control become more visible.";
  }
  return "A moment where inner noise asks to be simplified rather than ignored.";
};

const turningPoints = (Array.isArray(candidates90) ? candidates90 : [])
  .filter((x: any) => String(x?.fromISO ?? "") > todayISO)
  .slice()
  .sort((a: any, b: any) => String(a.fromISO).localeCompare(String(b.fromISO)))
  .slice(0, 3)
  .map((x: any) => ({
    dateISO: String(x?.fromISO ?? "").slice(0, 10),
    domain: String(x?.domain ?? "").trim(),
    title: turningPointTitle(String(x?.domain ?? "").trim(), String(x?.headline ?? "").trim()),
    meaning: turningPointMeaning(String(x?.domain ?? "").trim(), String(x?.headline ?? "").trim()),
    headline: String(x?.headline ?? "").trim(),
    action:
      Array.isArray(x?.do) && x.do.length
        ? String(x.do[0])
        : winMove || "Move early and act with clarity.",
  }));
// ----------------- Next Shift (earliest) + Strongest Shift -----------------

const futureHighlights = (Array.isArray(candidates90) ? candidates90 : [])
  .filter((w: any) => String(w?.fromISO ?? "") > todayISO)
  .slice();

const earliestShiftRow =
  futureHighlights
    .slice()
    .sort((a: any, b: any) => String(a.fromISO).localeCompare(String(b.fromISO)))[0] || null;

const strongestShiftRow =
  futureHighlights
    .slice()
    .sort((a: any, b: any) => Number(b?.score ?? 0) - Number(a?.score ?? 0))[0] || null;

const buildShiftCard = (row: any, mode: "earliest" | "strongest") => {
  if (!row) return null;

  const domain = String(row?.domain ?? "Life").trim();
  const headline = String(row?.headline ?? "").trim();
  const fromISO = String(row?.fromISO ?? "").slice(0, 10);
  const toISO = String(row?.toISO ?? "").slice(0, 10);

  const title =
  mode === "earliest"
    ? "The Next Turn"
    : "The Strongest Wave Ahead";

  const shiftNarrative = (domain: string, headline: string) => {
  if (domain === "Relationships") {
    return `Around this time, the relationship matter that has stayed uncertain will ask for definition. A conversation, a shift in behaviour, or a clear emotional signal will make it difficult to keep things vague. ${headline}`;
  }
  if (domain === "Career") {
    return `Around this time, work and visibility begin to move more openly. What you have been carrying quietly can turn into recognition, responsibility, or a direct ask for more ownership — but only if it is shown clearly. ${headline}`;
  }
  if (domain === "Health") {
    return `Around this time, the body stops letting inconsistency pass without consequence. If rhythm is good, stability returns quickly. If not, tiredness, digestion, or mood will show the imbalance more clearly. ${headline}`;
  }
  if (domain === "Money") {
    return `Around this time, money becomes less about earning and more about control. Quiet leaks, repeated spends, and verification issues become visible. ${headline}`;
  }
  return `Around this time, your inner state becomes harder to ignore. What has been mentally noisy or emotionally flat starts asking for simplification and honest adjustment. ${headline}`;
};

const whatChanges = astrologerShiftNarrative(
  domain,
  headline,
  mode === "earliest" ? "next" : "strongest"
);
  const isVisibleLifeSignal = (s: any) => {
  const t = String(s ?? "").trim();
  if (!t) return false;

  const lower = t.toLowerCase();

  if (
    lower.includes("dasha") ||
    lower.includes(" md ") ||
    lower.includes(" ad ") ||
    lower.includes(" pd ") ||
    lower.includes("h6") ||
    lower.includes("h7") ||
    lower.includes("h10") ||
    lower.includes("house") ||
    lower.includes("rahu") ||
    lower.includes("venus") ||
    lower.includes("jupiter") ||
    lower.includes("saturn")
  ) {
    return false;
  }

  return true;
};

const watchForRaw = uniqStr([
  ...(Array.isArray(row?.mostLikelySign) ? row.mostLikelySign : []),
  ...(Array.isArray(row?.why) ? row.why : []),
]);

let watchFor: string[] = watchForRaw.filter(isVisibleLifeSignal).slice(0, 4);

if (!watchFor.length) {
  if (domain === "Relationships") {
    watchFor = [
      "A direct conversation about expectations or commitment.",
      "A visible change in tone or emotional effort.",
      "Silence starting to feel heavier than clarity.",
    ];
  } else if (domain === "Career") {
    watchFor = [
      "A review or update where your work gets mentioned.",
      "A situation where ownership needs to be defined.",
      "A visible problem becoming an opportunity.",
    ];
  } else if (domain === "Health") {
    watchFor = [
      "Energy changes depending on routine and sleep.",
      "The body reacting quickly to good or bad rhythm.",
      "Fatigue or heaviness if routine slips.",
    ];
  } else if (domain === "Money") {
    watchFor = [
      "Small repeated spends becoming more noticeable.",
      "A decision that needs verification before committing.",
      "Relief once one or two money leaks are removed.",
    ];
  } else {
    watchFor = [
      "Mental noise becoming harder to ignore.",
      "Greater sensitivity to clutter or emotional inconsistency.",
      "Relief once life becomes simpler again.",
    ];
  }
}

  const doArr = uniqStr([
    ...(Array.isArray(row?.do) ? row.do : []),
  ]).slice(0, 3);

  const avoidArr = uniqStr([
    ...(Array.isArray(row?.avoid) ? row.avoid : []),
  ]).slice(0, 2);
const realLifeScenarios =
  domain === "Relationships"
    ? [
        "A conversation begins around expectations, commitment, or where this is going.",
        "You notice a clear change in tone, effort, or consistency from the other side.",
        "You realise clarity feels kinder than continuing uncertainty.",
      ]
    : domain === "Career"
    ? [
        "Your work comes under clearer review, discussion, or visibility.",
        "You are asked to define ownership, scope, or next steps more directly.",
        "A problem others are avoiding becomes your opening if you handle it well.",
      ]
    : domain === "Health"
    ? [
        "The body responds quickly to better or worse routine.",
        "Fatigue, heaviness, sleep disturbance, or digestion become harder to ignore.",
        "Small corrections start helping more than big efforts.",
      ]
    : domain === "Money"
    ? [
        "Repeated small expenses become more obvious than one large expense.",
        "A purchase, agreement, or financial decision needs verification before trust.",
        "You feel relief quickly once leakage is reduced.",
      ]
    : [
        "Mental noise becomes more noticeable than outer pressure.",
        "You feel less tolerant of clutter, emotional inconsistency, or wasted effort.",
        "A quieter, simpler rhythm starts feeling more healing than activity.",
      ];
  return {
    title,
    whenISO: fromISO,
    windowISO: { from: fromISO, to: toISO || fromISO },
    domain,
    confidence: String(row?.confidence ?? ""),
    score: Number(row?.score ?? 0),
    whatChanges,
    watchFor,
    realLifeScenarios,
    do: doArr,
    avoid: avoidArr,
  };
};

const nextShift = buildShiftCard(earliestShiftRow, "earliest");
const strongestShift = buildShiftCard(strongestShiftRow, "strongest");

const sameShift =
  nextShift &&
  strongestShift &&
  String(nextShift.whenISO) === String(strongestShift.whenISO) &&
  String(nextShift.domain) === String(strongestShift.domain);

const strongestShiftFinal = sameShift ? null : strongestShift;

// ----------------- Weekly Playbook (next 4 weeks) -----------------

// Helper: pick a strong domain for a week (don’t repeat the same one every time)
const domainOrder = (Array.isArray(domains) ? domains : [])
  .slice()
  .sort((a: any, b: any) => Number(b?.score ?? 0) - Number(a?.score ?? 0))
  .map((d: any) => String(d?.domain ?? "").trim())
  .filter(Boolean);

// fallback order if domains are empty
const fallbackDomainOrder: GuidanceDomain[] = ["Health", "Relationships", "Career", "Money", "Inner"];
const rankedDomains: string[] = domainOrder.length ? domainOrder : fallbackDomainOrder;

const weekRangeISO = (weekStartISO: string) => {
  const weekEndISO = addDaysISO(weekStartISO, 6);
  return { weekStartISO, weekEndISO };
};

const highlightOverlapsWeek = (h: any, weekStartISO: string, weekEndISO: string) =>
  !(String(h?.toISO) < weekStartISO || String(h?.fromISO) > weekEndISO);

// 1) If a highlight overlaps the week, use it.
// 2) Else rotate across top domains, avoiding repeats.
const pickFocusForWeek = (weekStartISO: string, used: Set<string>) => {
  const { weekEndISO } = weekRangeISO(weekStartISO);

  const h =
    Array.isArray(highlights90d) && highlights90d.length
      ? highlights90d.find((x: any) => highlightOverlapsWeek(x, weekStartISO, weekEndISO))
      : null;

  if (h) return { mode: "highlight", focus: h };

  // rotate through ranked domains and avoid repeating
  const chosenDomain =
    rankedDomains.find((d) => !used.has(d)) ||
    rankedDomains[0] ||
    "Career";

  const dom = (Array.isArray(domains) ? domains : []).find((x: any) => String(x?.domain) === chosenDomain) || null;

  // Build a week-specific focus line (less generic than reusing 90-day headline)
  const focusLine =
    (chosenDomain === "Health")
      ? "Cleanup week: fix routine leaks. Your body reacts fast when timing slips."
      : (chosenDomain === "Relationships")
      ? "Boundary week: define expectations and stop carrying emotional ambiguity."
      : (chosenDomain === "Career")
      ? "Visibility week: output gets noticed if it’s measurable and packaged properly."
      : (chosenDomain === "Money")
      ? "Desire-control week: comfort and distraction rise together — choose discipline."
      : "Inner week: simplify, remove noise, and rebuild calm discipline.";

  const action =
    chosenDomain === "Health"
      ? "10-day rule: same sleep window + lighter dinner + 20–30 min walk daily. No negotiations."
      : chosenDomain === "Relationships"
      ? "Say it once, clearly: what you want, what you won’t accept, and what changes from today."
      : chosenDomain === "Career"
      ? "Bring proof: before/after + 2–3 metrics. Ask directly for scope/ownership (not appreciation)."
      : chosenDomain === "Money"
      ? "Cut 2 leaks: subscriptions + convenience spends. Set one weekly money check-in (30 min)."
      : "One clean hour daily: no phone, no noise. One task finished fully.";

  const avoid =
    chosenDomain === "Health"
      ? "Avoid late nights and heavy dinners. Don’t try intensity to compensate for inconsistency."
      : chosenDomain === "Relationships"
      ? "Avoid half-open situations and passive hints. Don’t over-explain — state terms and move."
      : chosenDomain === "Career"
      ? "Avoid doing extra work without written scope/authority. Don’t wait for someone to ‘notice’."
      : chosenDomain === "Money"
      ? "Avoid ‘small’ purchases that repeat daily. Don’t sign/buy without verification and a cooling-off pause."
      : "Avoid forcing answers. Don’t chase meaning through chaos.";

  return {
    mode: "rotation",
    focus: {
      domain: chosenDomain,
      headline: focusLine,
      do: [action],
      avoid: [avoid],
    },
  };
};

const weeklyPlaybook = (() => {
  const used = new Set<string>();
  const out: any[] = [];

  for (let w = 0; w < 4; w++) {
    const startISO = addWeeksISO(todayISO, w);
    const weekEndISO = addDaysISO(startISO, 6);

    const picked = pickFocusForWeek(startISO, used);
    const focus = picked.focus;

    const domain = String(focus?.domain ?? "Career");
    used.add(domain);

    const rich = astrologerWeekNarrative(
  domain,
  w + 1,
  String(focus?.headline ?? "").trim()
);

    const action =
      Array.isArray(focus?.do) && focus.do.length
        ? String(focus.do[0])
        : rich.action;

    const avoid =
      Array.isArray(focus?.avoid) && focus.avoid.length
        ? String(focus.avoid[0])
        : rich.avoid;

    out.push({
  week: w + 1,
  range: `${startISO} → ${weekEndISO}`,
  domain,
  headline: String(focus?.headline ?? "").trim(),
  focus: rich.focus,
  action,
  avoid,
});
  }

  return out;
})();
// ----------------- Paid-worthy: current life + remedies + chat funnel -----------------

// strongest 90d row (already computed as top90 earlier)
const topWhyFacts = extractWhyFacts(top90?.why);

// Use paid fields if present (you confirmed they exist in logs)
const theme = String(paid?.theme ?? "").trim();
const phaseBriefRaw = paid?.phaseBrief;

const phaseBrief =
  typeof phaseBriefRaw === "string"
    ? phaseBriefRaw.trim()
    : Array.isArray(phaseBriefRaw)
      ? phaseBriefRaw.map((x) => String(x).trim()).filter(Boolean).join(" • ")
      : "";
const themeDrivers = uniqStr([
  ...toArrStr(paid?.themeDrivers),
  ...splitBullets(paid?.themeDrivers),
]).slice(0, 4);

// Pull 3 “what’s happening now” bullets from best domain headlines (non-fluffy)
const snapshot = uniqStr(
  domains
    .slice()
    .sort((a: any, b: any) => Number(b?.score ?? 0) - Number(a?.score ?? 0))
    .slice(0, 3)
    .map((d: any) => `${d.domain}: ${String(d.headline ?? "").trim()}`)
).slice(0, 3);

// Build “why now” bullets (dasha + theme drivers + extracted H6/H10 facts)
const whyNow = uniqStr([
  currentPhase ? `Dasha phase: ${currentPhase}` : "",
  ...themeDrivers.map((x) => `Driver: ${x}`),
  ...topWhyFacts.map((x) => `Signal: ${x}`),
]).filter(Boolean).slice(0, 4);
const activeWhyText = uniqStr([
  ...whyNow,
  ...themeDrivers.map((x) => String(x)),
  ...topWhyFacts.map((x) => String(x)),
]).join(" • ").toLowerCase();

const activeHouseFlags = {
  h6: activeWhyText.includes("h6"),
  h7: activeWhyText.includes("h7"),
  h10: activeWhyText.includes("h10"),
};

const mostLikelyNextEvent = (() => {
  const row = nextShift || strongestShiftFinal || null;
  if (!row) return null;

  const domain = String(row?.domain ?? "").trim();
  const whenISO = String(row?.whenISO ?? "").slice(0, 10);
  const watchFor = Array.isArray(row?.watchFor) ? row.watchFor : [];
  const doArr = Array.isArray(row?.do) ? row.do : [];

  const firstSignal =
    watchFor.length > 0 ? String(watchFor[0]).trim() : "";

  let event = "";
  let whyLikely = "";

  if (domain === "Career") {
    if (activeHouseFlags.h10) {
      event =
        "A review, update, or stakeholder conversation that puts your work under clearer visibility is the most likely next event.";
      whyLikely =
        "Because career visibility is active, and work is moving from silent effort into visible evaluation or ownership.";
    } else if (activeHouseFlags.h6) {
      event =
        "A recurring work problem or responsibility lands more clearly on your desk, forcing ownership or a process decision.";
      whyLikely =
        "Because work pressure is active through operational cleanup, and unresolved responsibilities are asking to be defined.";
    } else {
      event =
        "A work discussion or decision that forces clearer role definition is the most likely next event.";
      whyLikely =
        "Because career is the strongest active theme and silent effort is becoming harder to sustain.";
    }
  } else if (domain === "Relationships") {
    if (firstSignal) {
      event =
        "A direct conversation about expectations, commitment, or where this is going is the most likely next event.";
    } else {
      event =
        "A change in tone, distance, or direct conversation that forces relationship clarity is the most likely next event.";
    }

    whyLikely =
      "Because the relationship theme is moving from ambiguity into definition, and mixed signals are becoming harder to tolerate.";
  } else if (domain === "Health") {
    if (activeHouseFlags.h6) {
      event =
        "A clear body signal — through energy, digestion, sleep, or irritability — becomes the most likely next event.";
      whyLikely =
        "Because health and routine are strongly activated, and the body is responding quickly to rhythm.";
    } else {
      event =
        "A noticeable shift in energy or routine tolerance becomes the most likely next event.";
      whyLikely =
        "Because the body is becoming less willing to absorb inconsistency quietly.";
    }
  } else if (domain === "Money") {
    event =
      "A spending pattern, repeated leakage, or a decision that needs verification becomes the most likely next event.";
    whyLikely =
      "Because money is moving through control rather than drama, and quiet waste is becoming more visible.";
  } else {
    event =
      "A moment of mental overload, emotional flatness, or inner clarity becomes the most likely next event.";
    whyLikely =
      "Because inner pressure is building and simplification is becoming necessary.";
  }

  const bestResponse =
    doArr.length
      ? String(doArr[0])
      : domain === "Career"
      ? "Define ownership clearly and show the result, not just the effort."
      : domain === "Relationships"
      ? "Say what you want clearly and do not leave the situation half-open."
      : domain === "Health"
      ? "Correct routine immediately instead of waiting for a bigger signal."
      : domain === "Money"
      ? "Pause, verify, and cut the repeated leak before it grows."
      : "Reduce noise and simplify before mental overload deepens.";

  const signs = watchFor.length
    ? watchFor.slice(0, 3)
    : domain === "Relationships"
    ? [
        "A direct conversation begins around expectations or commitment.",
        "A visible change in tone, effort, or consistency appears.",
        "Silence starts feeling heavier than clarity.",
      ]
    : domain === "Career"
    ? [
        "Your work comes under clearer review or discussion.",
        "Ownership or scope needs to be defined more directly.",
        "A visible problem becomes an opportunity to step forward.",
      ]
    : domain === "Health"
    ? [
        "Sleep, energy, digestion, or irritability become easier to notice.",
        "The body reacts quickly to better or worse rhythm.",
        "Small corrections start helping more than force.",
      ]
    : domain === "Money"
    ? [
        "Repeated small spends become more noticeable.",
        "A decision needs verification before commitment.",
        "Relief comes once one leak is reduced.",
      ]
    : [
        "Mental noise becomes harder to ignore.",
        "You feel less tolerant of clutter or inconsistency.",
        "Simplicity starts feeling more healing than stimulation.",
      ];

  return {
    title: "The next real-life event most likely to happen",
    event,
    whenISO,
    whyLikely,
    signs,
    bestResponse,
  };
})();
// “what to do now” = winMove + 1 best action from top scenario + 1 boundary reminder
const topScenarioDo = (() => {
  // best actionable do from the top90 row
  const d = toArrStr(top90?.do);
  return d.length ? d[0] : "";
})();

const controlLever = String(paid?.controlLever ?? "").trim();
const oneDecision =
  controlLever ||
  winMove ||
  "Define your responsibilities clearly and stop carrying what is not yours.";
 
const whatToDoNow = [
  controlLever && `Control lever: ${controlLever}`,
  winMove && `Win move: ${winMove}`,
  drainToCut && `Cut this drain: ${drainToCut}`,
].filter(Boolean).slice(0, 3);
// Remedies: keep practical + spiritual, no fluff
const remedies = {
  immediate: uniqStr([
    "Today: 12–15 min brisk walk + hydrate (reduces mental noise fast).",
    "Tonight: screen-off 45 min before sleep; lighter dinner (stabilizes H6-style volatility).",
    "Write 1 page: what I’m responsible for / not responsible for (boundaries).",
  ]).slice(0, 3),

  stabilizer30d: uniqStr([
    "Weekly: 30-min money audit (subscriptions, small spends, quick-fix purchases).",
    "Work: one standard template — scope + owner + deadline + proof (repeat every task).",
    "Health: 5 days/week consistent routine > intensity (sleep + meals on time).",
  ]).slice(0, 3),

  spiritual: uniqStr([
    // Rahu MD + Venus AD oriented, but still universal + non-sectarian
    "Friday: small white donation (milk/sweets/white cloth) + gratitude practice (Venus balance).",
    "Daily: 108 breaths or 10-min mantra/chanting/quiet japa (calms Rahu overthinking).",
    "Seva: help one person weekly without expecting credit (purifies Rahu–Venus loop).",
  ]).slice(0, 3),

  avoid: uniqStr([
    drainToCut || "Avoid saying yes without scope/authority/deadline.",
    "Avoid late-night decisions when emotions spike.",
  ]).slice(0, 2),
};

// Chat funnel prompts (these should be clickable in UI later)
const chatPrompts = [
  {
    label: "What is really happening in my life right now?",
    prompt: "Tell me clearly what is happening in my life right now, why this phase feels this way, and what I must understand immediately.",
  },
  {
    label: "What is really happening in my career?",
    prompt: "Tell me what is really happening in my career right now, what is opening, what is being tested, and what I should do next.",
  },
  {
    label: "Is this relationship moving toward clarity or distance?",
    prompt: "Tell me whether this relationship is moving toward commitment, clarity, or distance, and what signs I should watch for next.",
  },
  {
    label: "Where is my money leaking right now?",
    prompt: "Tell me where money is leaking in this phase, what pattern is causing it, and what I should correct immediately.",
  },
  {
    label: "Why am I feeling like this mentally?",
    prompt: "Explain why my mind feels this way in the current phase, what is causing the restlessness or pressure, and how to steady it.",
  },
  {
    label: "Give me remedies for this exact phase",
    prompt: "Give me remedies for my current phase: what to start now, what to continue for 30 days, and what to avoid.",
  },
];

// ----------------- Current Life (paid voice) + Next Change -----------------

const bestDomainList = (Array.isArray(domains) ? domains : [])
  .slice()
  .sort((a: any, b: any) => Number(b?.score ?? 0) - Number(a?.score ?? 0));

const dCareer = bestDomainList.find((x: any) => x.domain === "Career");
const dRel = bestDomainList.find((x: any) => x.domain === "Relationships");
const dHealth = bestDomainList.find((x: any) => x.domain === "Health");
const dMoney = bestDomainList.find((x: any) => x.domain === "Money");
const dInner = bestDomainList.find((x: any) => x.domain === "Inner");

const hasText = (s: any) => typeof s === "string" && s.trim().length > 0;

// Pull the “signals” from whyNow (you already build these)
const whyBlob = (Array.isArray(whyNow) ? whyNow : []).join(" • ").toLowerCase();

const inferMindState = () => {
  const out: string[] = [];

  // H6 style pressure
  if (whyBlob.includes("h6")) {
    out.push(
      "You’re mentally in ‘fix-it mode’ — more responsibility, less patience for mess, and a constant feeling that something needs to be handled."
    );
  }

  // H7 / Saturn partnership boundaries
  if (whyBlob.includes("h7") || whyBlob.includes("saturn")) {
    out.push(
      "Relationships feel practical right now. You want clarity, consistency, and fewer loose ends — otherwise irritation builds quietly."
    );
  }

  // H10 / Jupiter visibility
  if (whyBlob.includes("h10") || whyBlob.includes("jupiter")) {
    out.push(
      "Your ambition is awake. You can feel a ‘next level’ calling, but you’ll only respect progress that is measurable and real."
    );
  }

  // Rahu–Venus flavor (craving + overthinking)
  if (String(currentPhase).toLowerCase().includes("rahu") && String(currentPhase).toLowerCase().includes("venus")) {
    out.push(
      "There’s a strong pull toward comfort, validation, and better lifestyle — but if boundaries are weak, the same pull becomes distraction."
    );
  }

  // fallback (always return something)
  if (!out.length) {
    out.push(
      "Mentally this is a transition phase — you’re recalibrating priorities and your tolerance for nonsense is lower than usual."
    );
  }

  return out.join(" ");
};

const areaPack = (domainLabel: string, d: any) => {
  const lever = String(d?.scoreBreakdown?.lever ?? "").trim();

  const whatByDomain: Record<string, string> = {
    Career:
      "Work is asking for definition. You may already be doing useful and visible things, but unless your role, ownership, or outcome is made clear, the burden can grow faster than the recognition.",
    Money:
      "Money is not under one dramatic threat right now. The issue is quieter: repeated leakage, convenience decisions, and the difference between disciplined spending and emotional spending.",
    Relationships:
      "Relationships are moving toward definition. What has been vague, half-open, or carried on mixed signals becomes harder to tolerate, and clarity starts feeling healthier than uncertainty.",
    Health:
      "Health is tied closely to routine in this phase. The body is less forgiving of irregular sleep, food timing, and overexertion, but it can also improve quickly once rhythm returns.",
    Inner:
      "Internally, this phase is less about outer crisis and more about mental overload. You may feel restless, emotionally flat, or unusually sensitive to noise, clutter, and inconsistency.",
  };

  const feelByDomain: Record<string, string> = {
    Career:
      "You want your effort to count, but you do not want to chase validation. If your work is not defined properly, irritation builds quietly.",
    Money:
      "You want stability, but careless or repetitive leakage feels especially frustrating because it is avoidable.",
    Relationships:
      "You are less willing to tolerate mixed signals. You would rather know the truth than keep living inside ambiguity.",
    Health:
      "Your mood and energy are closely tied to rhythm right now. When routine slips, the mental effect comes quickly.",
    Inner:
      "You may feel mentally full even when life looks manageable from outside. The need is not more stimulation, but less inner noise.",
  };

  const eventsByDomain: Record<string, string[]> = {
    Career: [
      "A review, discussion, or result can bring your contribution into sharper focus.",
      "You may realise you are carrying work that should have clearer ownership.",
      "A visible problem can become your opening — but only if you claim the role properly.",
    ],
    Money: [
      "Repeated small spends start becoming more visible than one large expense.",
      "A simple verification or pause before buying can prevent waste.",
      "A money clean-up brings relief faster than expected.",
    ],
    Relationships: [
      "A conversation forces clarity around expectations, commitment, or emotional effort.",
      "Silence or inconsistency begins to feel heavier than distance.",
      "You stop tolerating half-effort simply to keep peace.",
    ],
    Health: [
      "Fatigue, heaviness, digestion, or irritability can rise if routine slips.",
      "Even small corrections in rhythm start helping quickly.",
      "The body responds better to steadiness than intensity.",
    ],
    Inner: [
      "You become more sensitive to clutter, emotional noise, and low-quality interactions.",
      "Periods of flatness may actually be a sign of overload, not lack of purpose.",
      "Quiet discipline starts restoring inner steadiness.",
    ],
  };

  return {
    domain: domainLabel,
    what:
      whatByDomain[domainLabel] ||
      "This area is asking for steadiness and clear handling, not force.",
    feel: feelByDomain[domainLabel] || "",
    events: eventsByDomain[domainLabel] || [],
    lever: lever || "",
  };
};

// Current life overview (one paragraph, astrologer voice)
const overviewParts: string[] = [];
if (hasText(phaseBrief)) overviewParts.push(String(phaseBrief).trim());
if (hasText(theme)) overviewParts.push(String(theme).trim());

const currentLifeOverview =
  overviewParts.join(" ") ||
  "This phase is about cleanup and direction. Progress comes from discipline, clear boundaries, and proof — not speed.";

// Build areas (keep 5)
const currentLifeAreas = [
  areaPack("Career", dCareer),
  areaPack("Money", dMoney),
  areaPack("Relationships", dRel),
  areaPack("Health", dHealth),
  areaPack("Inner", dInner),
];


// Replace currentLife with richer, paid-worthy shape
const phaseTruth =
  "The truth of this phase is simple: progress is possible, but only if responsibility, boundaries, and discipline become cleaner than before.";
const topDomainNow =
  (Array.isArray(domains) ? domains : [])
    .slice()
    .sort((a: any, b: any) => Number(b?.score ?? 0) - Number(a?.score ?? 0))[0] ?? null;
 const biggestMistake = (() => {
  const domain = String(topDomainNow?.domain ?? "").trim();

  if (domain === "Career") {
    return "Doing work without defining ownership or visibility. If you carry responsibility silently, the burden grows faster than the recognition.";
  }

  if (domain === "Relationships") {
    return "Allowing mixed signals to continue just to avoid discomfort. In this phase, vagueness becomes heavier the longer it survives.";
  }

  if (domain === "Health") {
    return "Ignoring routine while trying to compensate with occasional intensity. The body in this phase responds to rhythm, not bursts of effort.";
  }

  if (domain === "Money") {
    return "Ignoring small repeated leaks. Quiet financial erosion matters more than one dramatic expense right now.";
  }

  return "Allowing mental noise and scattered attention to continue without simplification.";
})();
const lifeSummary = (() => {
  const domain = String(topDomainNow?.domain ?? "").trim();

  if (domain === "Career") {
    return "This is a phase where progress comes from defining your role clearly and refusing silent over-responsibility.";
  }

  if (domain === "Relationships") {
    return "This is a phase where relationships move toward clarity — bonds either strengthen through honesty or loosen through truth.";
  }

  if (domain === "Health") {
    return "This is a phase where routine becomes the foundation of stability and the body responds quickly to discipline.";
  }

  if (domain === "Money") {
    return "This is a phase where financial stability improves through awareness, restraint, and removing quiet leakage.";
  }

  return "This is a phase where simplification and disciplined attention restore inner steadiness.";
})();
const strategicFocusTitle =
  topDomainNow?.domain === "Career"
    ? "Your Strategic Focus for the Next 90 Days"
    : topDomainNow?.domain === "Relationships"
    ? "Your Strategic Focus for the Next 90 Days"
    : topDomainNow?.domain === "Health"
    ? "Your Strategic Focus for the Next 90 Days"
    : topDomainNow?.domain === "Money"
    ? "Your Strategic Focus for the Next 90 Days"
    : "Your Strategic Focus for the Next 90 Days";

const strategicFocusText = (() => {
  const domain = String(topDomainNow?.domain ?? "").trim();

  if (domain === "Career") {
    return "Your best results come from defining work clearly, making output visible, and refusing silent over-carrying. This is not the phase to hope people notice on their own. It is the phase to show value properly and claim ownership cleanly.";
  }

  if (domain === "Relationships") {
    return "Your peace will come from clarity, not from waiting. The more something stays vague, the heavier it feels. This is the phase to define expectations early, read behaviour honestly, and stop protecting confusion just to avoid discomfort.";
  }

  if (domain === "Health") {
    return "Your strength in this phase comes from rhythm, not intensity. Small discipline done daily will help more than occasional effort. If you respect routine, the body supports you quickly. If you ignore it, the body creates the slowdown itself.";
  }

  if (domain === "Money") {
    return "Your advantage now is not dramatic gain but cleaner control. Quiet leakage matters more than large expense. The phase improves when decisions are slower, verification is stronger, and repeated small waste is removed.";
  }

  return "Your progress in this phase comes from simplification. You do not need more stimulation or more scattered effort. You need cleaner priorities, less noise, and a more honest relationship with what is draining your attention.";
})();

const strategicFocusBullets = uniqStr([
  winMove ? `Priority: ${winMove}` : "",
  drainToCut ? `Main mistake to avoid: ${drainToCut}` : "",
  nextShift?.domain === "Relationships"
  ? "Next important turn: a relationship matter moves toward clarity and can no longer stay vague."
  : nextShift?.domain === "Career"
  ? "Next important turn: work visibility increases and role or ownership becomes easier to define."
  : nextShift?.domain === "Health"
  ? "Next important turn: the body starts showing clearly whether routine is helping or hurting."
  : nextShift?.domain === "Money"
  ? "Next important turn: financial leakage or control becomes easier to see."
  : nextShift?.whatChanges
  ? `Next important turn: ${String(nextShift.whatChanges).slice(0, 110)}`
  : "",
]).filter(Boolean).slice(0, 3);

const strategicFocus = {
  title: strategicFocusTitle,
  text: strategicFocusText,
  bullets: strategicFocusBullets,
};

const currentLifeRich = {
  title: theme ? `Current phase: ${theme}` : "Current phase",
  overview: currentLifeOverview,
  lifeSummary,
  mindState: inferMindState(),
  phaseTruth,
  oneDecision,
  biggestMistake,
  areas: currentLifeAreas,
  whyNow,
  whatToDoNow,
};
  return {
    version: "FG_V2",
    generatedAtISO: new Date().toISOString(),
    todayISO,

    realityCheck: {
      currentPhase,
      mainTheme,
      winMove,
      drainToCut,
    },

    domains,
    probabilities,
    next14d: next14dPacked,
    next30d: next30dPacked,
    next60d: next60dPacked,
    next90d: next90dPacked,
    highlights90d,
    currentLife: currentLifeRich,
nextShift,
mostLikelyNextEvent,
turningPoints,
strongestShift: strongestShiftFinal,
strategicFocus,
remedies,
weeklyPlaybook,
chatPrompts,
    advisorMemo: {
      opportunity: pickTop(
        uniq([String(paid?.opportunity ?? "").trim(), String(paid?.advisor?.opportunity ?? "").trim()].filter(Boolean)),
        3
      ),
      risks: pickTop(
        uniq([String(paid?.risk ?? "").trim(), String(paid?.advisor?.risk ?? "").trim()].filter(Boolean)),
        3
      ),
      controlLevers: pickTop(
        uniq([String(paid?.controlLever ?? "").trim(), String(paid?.advisor?.controlLever ?? "").trim()].filter(Boolean)),
        4
      ),
      nonNegotiables: pickTop(
        uniq([String(paid?.nonNegotiable ?? "").trim(), String(paid?.advisor?.nonNegotiable ?? "").trim()].filter(Boolean)),
        4
      ),
    },
  };
}