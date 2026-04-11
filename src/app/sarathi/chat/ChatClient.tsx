"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { TimingCards, NarrativeTiming, QARich } from "@/components/TimingCards";
import { loadBirthProfile } from "@/lib/birth-profile";


/* ===================== Local types ===================== */
type Topic =
  | "vehicle"
  | "property"
  | "job"
  | "wealth"
  | "health"
  | "relationships"
  | "disputes"
  | "marriage";

type Place = { name?: string; tz: string; lat: number; lon: number };
type Profile = { name?: string; dobISO?: string; tob?: string; place?: Place };

type BottomLine = { lead: string; nuance?: string };
type Role = "user" | "assistant";

type MDAD = {
  md: { planet: string; start?: string | null; end?: string | null };
  ad: { planet: string; start?: string | null; end?: string | null };
  nextADs?: Array<{ planet: string; start?: string | null; end?: string | null }>;
};

type QAResponse = {
  ok: boolean;
  topic?: Topic;
  title?: string;
  bottomLine?: BottomLine;
  context?: string;
  natal?: string;

  now?: { label?: string; fromISO?: string; toISO?: string };
  spans?: Array<{ fromISO: string; toISO: string; label: string }>;

  windows?: Array<{
    fromISO?: string;
    toISO?: string;
    label?: string;
    tag?: string;
    why?: string[];
    do?: string[];
    score?: number;
    origin?: "engine" | "spans" | "synth";
    notes?: string | string[];
  }>;

  guidance?: string[];
  checklist?: string[];
  extra?: { nowLabel?: string };
  transit?: Array<{ fromISO: string; toISO: string; label: string }>;

  copy?: {
    answer?: string;
    how?: string;
    long?: string;
    quarters?: string[];
    house?: { line?: string; bullets?: string[] };
    exact?: {
      sub?: Array<{ fromISO: string; toISO: string; tag: string }>;
      peaks?: string[];
    };
    actionWindows?: Array<{ fromISO: string; toISO: string; tag?: string; label?: string }>;
    remedies?: any;
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

  remedies?: { items?: string[] } | string[];
  smartPlan?: any;
  meta?: { windowOrigin?: "engine" | "spans" | "synth"; version?: string };
  error?: string;
  debug?: any;
  core?: {
    ok: boolean;
    mode: "personalized" | "generic";
    domain: string;
    questionType: string;
    title: string;
    verdict: {
      type: string;
      line: string;
    };
    currentPhase: {
      label?: string;
      summary: string;
    };
    timing: {
      hasTiming: boolean;
      summary: string;
      windows: Array<{
        fromISO?: string;
        toISO?: string;
        label: string;
        strength: "Strong" | "Supportive" | "Mixed" | "Caution";
        why: string[];
        do: string[];
        avoid: string[];
      }>;
    };
    reasons: string[];
    actions: string[];
    avoid: string[];
    confidence: {
      level: "Low" | "Medium" | "High";
      reason: string;
    };
    followUps: string[];
    emotionalSupport?: string;
    evidenceBullets: string[];
    prose: {
      short: string;
      full: string;
    };
  };
  [k: string]: any;
};

type Msg = { id: string; role: Role; content?: string; data?: QAResponse; error?: string };

/* ===================== Keys & IDs ===================== */
const LIFE_REPORT_KEY = "life-report-profile";
const DEFAULT_PROFILE_KEY = "sarathi_default_profile_v1";

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

/* ===================== Small helpers ===================== */
const Cap = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

const idQueryPassThrough = (q: string) => q.trim();

function placeFromProfile(p?: Profile) {
  const pl = p?.place;
  if (!pl) return undefined;
  const valid = typeof pl.lat === "number" && typeof pl.lon === "number" && !!pl.tz;
  return valid ? { name: pl.name, tz: pl.tz, lat: pl.lat, lon: pl.lon } : undefined;
}

function effectivePlace(p?: Profile): Required<Place> {
  const pl = p?.place;
  const valid = pl && typeof pl.lat === "number" && typeof pl.lon === "number" && !!pl.tz;
  return valid
    ? (pl as Required<Place>)
    : { name: "Dubai", tz: "Asia/Dubai", lat: 25.2048, lon: 55.2708 };
}

/* ===================== Natal (houses/aspects) from Life Report ===================== */
function readLifeReportNatal():
  | {
      houses?: Record<
        string,
        { lord?: string; sign?: string; strength?: "strong" | "average" | "weak" }
      >;
      aspects?: Array<{ from: string; toHouse: number; type: string }>;
    }
  | undefined {
  try {
    const raw = localStorage.getItem(LIFE_REPORT_KEY);
    if (!raw) return undefined;
    const lr = JSON.parse(raw);

    const houses: Record<
      string,
      { lord?: string; sign?: string; strength?: "strong" | "average" | "weak" }
    > = {};

    if (Array.isArray(lr?.natal?.houses)) {
      for (const h of lr.natal.houses as Array<any>) {
        const key = String(h.house ?? h.index ?? h.num ?? h.h);
        if (!key) continue;
        houses[key] = {
          lord: h.lord,
          sign: h.sign,
          strength: (h.strength || "average") as "strong" | "average" | "weak",
        };
      }
    } else if (lr?.natal?.houses && typeof lr.natal.houses === "object") {
      for (const k of Object.keys(lr.natal.houses)) {
        const v = lr.natal.houses[k];
        houses[String(k)] = {
          lord: v?.lord,
          sign: v?.sign,
          strength: (v?.strength || "average") as "strong" | "average" | "weak",
        };
      }
    }

    const aspects: Array<{ from: string; toHouse: number; type: string }> = [];
    if (Array.isArray(lr?.natal?.aspects)) {
      for (const a of lr.natal.aspects as Array<any>) {
        aspects.push({
          from: a.from ?? a.planet ?? "",
          toHouse: Number(a.toHouse ?? a.house ?? a.target ?? 0),
          type: String(a.type ?? a.aspect ?? ""),
        });
      }
    }

    if (Object.keys(houses).length || aspects.length) return { houses, aspects };
  } catch {
    // ignore
  }
  return undefined;
}

/* ===================== Intent helpers ===================== */
type JobIntent =
  | "when"
  | "exact"
  | "nextweek"
  | "tips"
  | "remedies"
  | "role"
  | "recruiter"
  | "sectors"
  | "generic";

function intentFromQuery(query = ""): JobIntent {
  const q = query.toLowerCase();
  if (/\b(exact|exactly|specific|date|dates|which day)\b/.test(q)) return "exact";
  if (/\bnext\s*week|coming\s*week\b/.test(q)) return "nextweek";
  if (/\btips?|advice|how can i improve\b/.test(q)) return "tips";
  if (/\bremedies?|upaya|mantra|pooja|totka\b/.test(q)) return "remedies";
  if (/\brole|title|what kind of role\b/.test(q)) return "role";
  if (/\brecruiter|talking points|call points\b/.test(q)) return "recruiter";
  if (/\bsector|sectors|industry|domain\b/.test(q)) return "sectors";
  if (/\bwhen|change|increment|offer\b/.test(q)) return "when";
  return "generic";
}

/* ===================== Debug + history ===================== */
const DEBUG =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("debug") === "1";

function buildHistory(msgs: Msg[], nextUser?: string) {
  const recent = msgs.slice(-12);
  const out: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (const m of recent) {
    if (m.role === "user" && m.content) out.push({ role: "user", content: m.content });
    else if (m.role === "assistant") {
      const answer =
        (m.data as any)?.copy?.answer ||
        (m.data as any)?.bottomLine?.lead ||
        m.content ||
        "";
      if (answer) out.push({ role: "assistant", content: String(answer) });
    }
  }
  if (nextUser && nextUser.trim()) out.push({ role: "user", content: nextUser.trim() });
  return out;
}

/* =============== Prose renderer (dark theme) =============== */
function AssistantProse({ data }: { data: QAResponse }) {
  const c = data.copy || {};
  const hasQuarters = Array.isArray(c.quarters) && c.quarters.length > 0;
  const hasMicro = Array.isArray(c.micro) && c.micro.length > 0;
  const [showLong, setShowLong] = useState(false);

  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5 md:p-6 text-sm leading-6 text-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
      {c.answer ? <p className="mb-3 whitespace-pre-wrap">{c.answer}</p> : null}

      {c.long ? (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowLong((s) => !s)}
            className="text-xs rounded-lg border border-white/10 bg-white/5/5 px-2.5 py-1 hover:bg-white/5/10"
          >
            {showLong ? "Hide full explanation" : "Show full explanation"}
          </button>
          {showLong ? (
            <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100/90">
              {c.long}
            </div>
          ) : null}
        </div>
      ) : null}

      {c.how ? (
        <div className="mt-3">
          <div className="font-semibold mb-1 text-slate-100">How to use this</div>
          <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-100/90">{c.how}</pre>
        </div>
      ) : null}

      {hasQuarters ? (
        <div className="mt-4">
          <div className="font-semibold mb-1 text-slate-100">Quarterly plan</div>
          <ul className="list-disc pl-5 space-y-1 text-slate-100/90">
            {c.quarters!.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasMicro ? (
        <div className="mt-4">
          <div className="font-semibold mb-1 text-slate-100">Action windows</div>
          <ul className="list-disc pl-5 space-y-1 text-slate-100/90">
            {c.micro!.slice(0, 6).map((m, i) => (
              <li key={i}>
                <span className="font-medium text-slate-100">
                  {m.fromISO} → {m.toISO}
                </span>
                : <em className="text-slate-200/80">{m.action}</em>
                {m.why?.length ? ` — ${m.why[0]}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/* =============== Normalizers =============== */
function normalizeWindows(wins: QAResponse["windows"]) {
  if (!Array.isArray(wins)) return [];
  return wins.map((w) => {
    const why = Array.isArray(w?.why) ? w!.why : [];
    const tag = typeof w?.tag === "string" ? w!.tag : "";
    const notes = w?.notes ?? (why.length ? why.join("; ") : tag || "");
    return { ...w, notes };
  });
}

/* ===================== Build MD/AD from local dasha cache ===================== */
function buildMDADAndSpans(): {
  mdad?: MDAD;
  nowLabel?: string;
  spans: Array<{ fromISO: string; toISO: string; label: string }>;
} {
  let mdad: MDAD | undefined;
  let nowLabel: string | undefined;
  let spans: Array<{ fromISO: string; toISO: string; label: string }> = [];

  if (typeof window === "undefined") return { mdad, nowLabel, spans };

  try {
    const raw = localStorage.getItem("life-report-dasha");
    if (!raw) return { mdad, nowLabel, spans };
    const d = JSON.parse(raw);

    const today = new Date().toISOString().slice(0, 10);

    const rows: any[] = [];
    if (Array.isArray(d.spans)) rows.push(...d.spans);
    if (Array.isArray(d.ads)) rows.push(...d.ads);
    if (Array.isArray(d.adSpans)) rows.push(...d.adSpans);
    if (Array.isArray(d.ad_table)) rows.push(...d.ad_table);
    if (Array.isArray(d.adTable)) rows.push(...d.adTable);

    const normalizeRow = (row: any) => {
      const fromISO = String(
        row?.fromISO ?? row?.startISO ?? row?.from ?? row?.start ?? row?.s ?? ""
      ).slice(0, 10);
      const toISO = String(
        row?.toISO ?? row?.endISO ?? row?.to ?? row?.end ?? row?.e ?? ""
      ).slice(0, 10);
      const md =
        row?.md ??
        row?.mahadasha ??
        row?.major ??
        row?.mdLord ??
        row?.md_lord ??
        row?.md_lord_name;
      const ad =
        row?.ad ??
        row?.sub ??
        row?.lord ??
        row?.antardasha ??
        row?.ad_lord ??
        row?.adLord;
      const label =
        row?.label ??
        (md && ad ? `${Cap(String(md))} MD / ${Cap(String(ad))} AD` : undefined);
      return { fromISO, toISO, label, md, ad };
    };

    const normalizedFull = rows
      .map(normalizeRow)
      .filter((r) => r.fromISO && r.toISO && r.label);

    spans = normalizedFull.map((r) => ({
      fromISO: r.fromISO,
      toISO: r.toISO,
      label: r.label!,
    }));

    let curMd: string | undefined;
    let curAd: string | undefined;
    let curFrom: string | undefined;
    let curTo: string | undefined;

    const cMD = d.currentMD;
    const cAD = d.currentAD;
    if (cMD?.planet && cAD?.lord) {
      curMd = cMD.planet;
      curAd = cAD.lord;
      curFrom =
        cAD.startISO ??
        cAD.fromISO ??
        cAD.start ??
        cMD.startISO ??
        cMD.fromISO ??
        cMD.start;
      curTo =
        cAD.endISO ?? cAD.toISO ?? cAD.end ?? cMD.endISO ?? cMD.toISO ?? cMD.end;
    }

    if (!curMd || !curAd) {
      const c = d.current;
      if (c) {
        curMd =
          c.mahadasha ??
          c.md ??
          c.mdLord ??
          c.md_lord ??
          c.md_lord_name ??
          curMd;
        curAd =
          c.antardasha ??
          c.ad ??
          c.adLord ??
          c.ad_lord ??
          c.ad_lord_name ??
          curAd;
        curFrom =
          c.adStartISO ??
          c.adStart ??
          c.startISO ??
          c.fromISO ??
          curFrom;
        curTo = c.adEndISO ?? c.adEnd ?? c.endISO ?? c.toISO ?? curTo;
      }
    }

    let normalized = normalizedFull;
    if ((!curMd || !curAd) && normalized.length) {
      const best = normalized.find(
        (r) => r.md && r.ad && r.fromISO <= today && today <= r.toISO
      );
      if (best) {
        curMd = best.md;
        curAd = best.ad;
        curFrom = best.fromISO;
        curTo = best.toISO;
      }
    }

    if (!curMd || !curAd) return { mdad, nowLabel, spans };

    nowLabel = `${Cap(curMd)} MD / ${Cap(curAd)} AD`;

    const currentIndex = normalized.findIndex(
      (r) => r.md && r.ad && Cap(r.md) === Cap(curMd!) && Cap(r.ad) === Cap(curAd!)
    );

    const nextADs =
      currentIndex >= 0
        ? normalized.slice(currentIndex + 1, currentIndex + 3).map((row) => ({
            planet: Cap(row.ad),
            start: row.fromISO || null,
            end: row.toISO || null,
          }))
        : [];

    const safeNextADs = (nextADs ?? []).map((ad) => ({
      planet: ad.planet ?? "Unknown",
      start: ad.start ?? null,
      end: ad.end ?? null,
    }));

    mdad = {
      md: { planet: Cap(curMd || "Unknown") ?? "Unknown", start: curFrom ?? null, end: curTo ?? null },
      ad: { planet: Cap(curAd || "Unknown") ?? "Unknown", start: curFrom ?? null, end: curTo ?? null },
      nextADs: safeNextADs,
    };

    return { mdad, nowLabel, spans };
  } catch (e) {
    console.warn("buildMDADAndSpans failed", e);
    return { mdad, nowLabel, spans };
  }
}
function SarathiAnswerCard({
  title,
  nowLabel,
  answer,
  how,
  whyBullets,
  confidenceText,
  confidenceLevel,
  confidenceReason,
  timingStrength,
  timingSummary,
  evidenceBullets,
  detailNote,
}: {
  title?: string;
  nowLabel?: string;
  answer?: string;
  how?: string;
  whyBullets?: string[];
  confidenceText?: string;
  confidenceLevel?: "Low" | "Medium" | "High";
  confidenceReason?: string;
  timingStrength?: "Strong" | "Supportive" | "Mixed" | "Caution";
  timingSummary?: string;
  evidenceBullets?: string[];
  detailNote?: string;
}) {
  const [expanded, setExpanded] = useState(false);
const [showEvidence, setShowEvidence] = useState(false);
    const confidenceBadgeClass =
    confidenceLevel === "High"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      : confidenceLevel === "Medium"
      ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
      : "border-white/10 bg-white/5/5 text-slate-200/90";

  const timingBadgeClass =
    timingStrength === "Strong"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      : timingStrength === "Supportive"
      ? "border-sky-400/30 bg-sky-500/10 text-sky-200"
      : timingStrength === "Mixed"
      ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
      : timingStrength === "Caution"
      ? "border-rose-400/30 bg-rose-500/10 text-rose-200"
      : "border-white/10 bg-white/5/5 text-slate-200/90";
  return (
         <div>
        <div className="text-xs uppercase tracking-[0.18em] text-slate-300/60">
          Sārathi's Guidance
        </div>

     {title &&
 !["sārathi guidance", "sarathi guidance", "career guidance", "inner guidance", "relationship guidance", "money guidance", "health guidance"].includes(title.trim().toLowerCase()) ? (
  <div className="mt-2 text-sm font-medium text-slate-300/80">{title}</div>
) : null}

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
          {confidenceText ? (
            <div className="rounded-full border border-white/10 bg-white/5/5 px-2.5 py-1 text-[11px] text-slate-200/85">
  {confidenceText}
</div>
          ) : null}

          {nowLabel ? (
            <div className="rounded-full border border-white/10 bg-white/5/5 px-2.5 py-1 text-[11px] text-slate-200/85">
              Current timing: {nowLabel}
            </div>
          ) : null}

          {confidenceLevel ? (
            <div className={`rounded-full border px-3 py-1 text-xs ${confidenceBadgeClass}`}>
              Confidence: {confidenceLevel}
            </div>
          ) : null}

          {timingStrength ? (
            <div className={`rounded-full border px-3 py-1 text-xs ${timingBadgeClass}`}>
              Timing: {timingStrength}
            </div>
          ) : null}
        </div>

                 {answer ? (
  <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5/[0.05] p-5 md:p-6">
  <div className="whitespace-pre-wrap text-[15px] leading-8 text-slate-100/95">
      {expanded ? answer : answer.slice(0, 520)}
      {answer.length > 520 && !expanded ? "…" : ""}
    </div>

    {answer.length > 520 && (
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-xs text-indigo-300 hover:underline"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    )}
  </div>
) : null}

      {timingSummary || confidenceReason ? (
  <div className="mt-4 grid gap-3 md:grid-cols-2">
    {timingSummary ? (
      <div className="rounded-2xl border border-white/10 bg-white/5/[0.04] p-4">
        <div className="text-[11px] uppercase tracking-[0.14em] text-slate-300/45">
          Current timing
        </div>
        <div className="mt-2 text-sm leading-6 text-slate-100/80">{timingSummary}</div>
      </div>
    ) : null}

    {confidenceReason ? (
      <div className="rounded-2xl border border-white/10 bg-white/5/[0.04] p-4">
        <div className="text-[11px] uppercase tracking-[0.14em] text-slate-300/45">
          How clear this looks
        </div>
        <div className="mt-2 text-sm leading-6 text-slate-100/80">{confidenceReason}</div>
      </div>
    ) : null}
  </div>
) : null}
            {(how || (whyBullets && whyBullets.length)) ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {how ? (
            <div className="rounded-2xl border border-white/10 bg-white/5/5 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-slate-300/60">What to do now</div>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100/90">{how}</div>
            </div>
          ) : null}

          {whyBullets && whyBullets.length ? (
            <div className="rounded-2xl border border-white/10 bg-white/5/5 p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-slate-300/60">Why this works</div>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm leading-6 text-slate-100/90">
                {whyBullets.slice(0, 3).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

                {evidenceBullets && evidenceBullets.length ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5/5 p-4">
          <button
            type="button"
            onClick={() => setShowEvidence((s) => !s)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-slate-300/60">
                What this is based on
              </div>
              <div className="mt-1 text-sm text-slate-100/85">
                See the astrology signals behind this answer
              </div>
            </div>
            <div className="text-xs text-indigo-300">
              {showEvidence ? "Hide" : "Show"}
            </div>
          </button>

          {showEvidence ? (
            <ul className="mt-3 list-disc pl-5 space-y-2 text-sm leading-6 text-slate-100/90">
              {evidenceBullets.slice(0, 5).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {detailNote ? (
        <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/40/80">
          {detailNote}
        </div>
      ) : null}
    </div>
  );
}
function getFreshProfileForApi(): Profile | null {
  const p = loadBirthProfile();
  if (!p) return null;

  const lat = Number(p.place?.lat);
  const lon = Number(p.place?.lon);
  const tz = String(p.place?.tz ?? "");

  const placeOk = Number.isFinite(lat) && Number.isFinite(lon) && !!tz;

  return {
    name: p.name,
    dobISO: p.dobISO,
    tob: p.tob,
    place: placeOk
      ? { name: p.place?.name ?? "", lat, lon, tz }
      : undefined,
  };
}

function loadLifeReportCache(): any | null {
  try {
    if (typeof window === "undefined") return null;
    const s = localStorage.getItem("sarathi.lifeReportCache.v2");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}


/* ===================== Component ===================== */
export default function ChatClient() {
  const [mounted, setMounted] = useState(false);
  const [safeMode, setSafeMode] = useState(false);
  const [view, setView] = useState<"cards" | "narrative" | "qa">("qa");
  const [showDetails, setShowDetails] = useState(true);
  const [chattyMode, setChattyMode] = useState(true);
  const [profile, setProfile] = useState<Profile>({});
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: newId(),
      role: "assistant",
      content: "Hi — Sārathi Chat is ready. Ask about career, money, relationships, health, or timing.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const hasProfile = useMemo(() => {
    const hasBirth = !!profile?.dobISO && !!profile?.tob;
    const hasPlace = !!(profile?.place?.tz) && Number.isFinite(profile?.place?.lat as any) && Number.isFinite(profile?.place?.lon as any);
    return hasBirth && hasPlace;
  }, [profile]);

  // Mount & restore
  useEffect(() => {
    setMounted(true);
    try {
      const qs = new URLSearchParams(window.location.search);
      if (qs.get("safe") === "1") setSafeMode(true);
      const q = qs.get("q");
      if (q && q.trim()) setInput(q.trim());
    } catch {}

    try {
  const qs = new URLSearchParams(window.location.search);
  const resume = qs.get("resume") === "1";

  if (resume) {
    const raw = localStorage.getItem("sarathi-chat");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
    }
  }
} catch {}

        // Profile load (AUTHORITATIVE ORDER)
    try {
      // 1) Prefer ACTIVE profile saved by Life Report
      const active = loadBirthProfile();
      if (active) {
        setProfile({
          name: active.name,
          dobISO: active.dobISO,
          tob: active.tob,
          place: active.place,
        });
      } else {
        // 2) Fallback: old chat default profile
        const rawDefault = localStorage.getItem(DEFAULT_PROFILE_KEY);
        if (rawDefault) {
          const p = JSON.parse(rawDefault);
          setProfile({
            name: p.name,
            dobISO: p.birthDateISO,
            tob: p.birthTime,
            place:
              p.birthTz != null
                ? {
                    name: p.placeName,
                    tz: p.birthTz,
                    lat: Number(p.lat),
                    lon: Number(p.lon),
                  }
                : undefined,
          });
        } else {
          // 3) Last fallback: legacy life report profile
          const rawLR = localStorage.getItem(LIFE_REPORT_KEY);
          if (rawLR) setProfile(JSON.parse(rawLR));
        }
      }
    } catch {
      setProfile({});
    }

    const onStorage = (e: StorageEvent) => {
      // If active profile changes anywhere, re-load it
      if (
        e.key === "sarathi.birthProfile.v1" ||
        e.key === DEFAULT_PROFILE_KEY ||
        e.key === LIFE_REPORT_KEY
      ) {
        try {
          const active = loadBirthProfile();
          if (active) {
            setProfile({
              name: active.name,
              dobISO: active.dobISO,
              tob: active.tob,
              place: active.place,
            });
          } else {
            setProfile({});
          }
        } catch {
          setProfile({});
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persist chat
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("sarathi-chat", JSON.stringify(messages));
    } catch {}
  }, [mounted, messages]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  /* ---- unified server call ---- */
  const askServer = async (query: string, prof: Profile) => {
    const place = placeFromProfile(prof) ?? effectivePlace(prof);
    const natalFromLR = readLifeReportNatal();

    const baseProfile: any = {
      ...(prof?.name ? { name: prof.name } : {}),
      birth: prof?.dobISO
        ? {
            dateISO: prof.dobISO,
            time: prof.tob ?? "00:00",
            tz: place.tz,
            lat: place.lat,
            lon: place.lon,
          }
        : undefined,
      place,
      ...(natalFromLR ? { natal: natalFromLR } : {}),
    };

    const { mdad, nowLabel, spans } = buildMDADAndSpans();

    const userIntent = intentFromQuery(query);
    const styleToSend =
      userIntent === "exact" ? "narrative" : userIntent === "when" ? "cards" : "qa";
     // Always send the freshest saved profile (authoritative)
const fresh = getFreshProfileForApi();

// Fall back to the in-memory profile if fresh is missing
const finalProfile: Profile = fresh ?? prof ?? {};

// Ensure we always have a usable place object (even if birth details missing)
const finalPlace = effectivePlace(finalProfile);

// Debug (shows in browser console)
console.log("[sarathi/chat] finalProfile being sent", {
  name: finalProfile?.name,
  dobISO: finalProfile?.dobISO,
  tob: finalProfile?.tob,
  place: {
    tz: finalProfile?.place?.tz ?? finalPlace.tz,
    lat: finalProfile?.place?.lat ?? finalPlace.lat,
    lon: finalProfile?.place?.lon ?? finalPlace.lon,
    name: finalProfile?.place?.name ?? finalPlace.name,
  },
});




// (optional debug)
console.log("[chat] profile send", {
  dobISO: finalProfile?.dobISO,
  tob: finalProfile?.tob,
  tz: finalPlace?.tz,
  lat: finalPlace?.lat,
  lon: finalPlace?.lon,
});

const payload: any = {
  question: query,
  message: query,
  profile: finalProfile,
  birthProfile: finalProfile,
  reportData: (() => {
  try {
    const raw =
      localStorage.getItem("sarathi.lifeReportCache.v2") ||
      localStorage.getItem("sarathi.lifeReportCache"); // legacy fallback
    if (!raw) return null;

    const cached = JSON.parse(raw);

    // ✅ If cached is { data, profile }, unwrap to the real Life Report
    if (cached && typeof cached === "object" && cached.data && typeof cached.data === "object") {
      return cached.data;
    }

    // ✅ If it's already the report, send as-is
    return cached;
  } catch {
    return null;
  }
})(),

};




    let res: Response | undefined;
    let body: any = null;

    try {
      res = await fetch("/api/astro-chat", {
  method: "POST",
  headers: { "content-type": "application/json" },
  cache: "no-store",
  body: JSON.stringify(payload),
});

      try {
        body = await res.json();
      } catch {
        body = null;
      }
    } catch (e: any) {
      body = { ok: false, error: `Network error: ${e?.message || e}` };
    }

    const errText = String((body && body.error) || "");
    const effectiveNowLabel =
      nowLabel || (body && ((body.extra && body.extra.nowLabel) || (body.now && body.now.label)));

    if (!res?.ok || !body || body.ok === false) {
      const fallback: QAResponse = {
        ok: true,
        title: "Overview",
        windows: [],
        bottomLine: {
          lead: "I couldn’t fetch a detailed answer right now, but here’s a safe overview.",
          nuance: errText && errText !== "undefined" ? errText : "",
        },
        now: effectiveNowLabel ? { label: effectiveNowLabel } : {},
        spans,
        copy: {
          answer:
            "Let’s keep momentum steady while I refresh your timing windows." +
            (effectiveNowLabel ? ` You’re currently in **${effectiveNowLabel}**.` : ""),
          how: "Work in weekly bursts; warm referrals first, small visible wins every week.",
        },
        extra: effectiveNowLabel ? { nowLabel: effectiveNowLabel } : {},
        meta: { version: "fallback" },
      };
      fallback.windows = normalizeWindows(fallback.windows);
      return fallback;
    }

    const withNow: QAResponse = {
      ...(body as QAResponse),
      extra: {
        ...((body as any).extra || {}),
        ...(effectiveNowLabel ? { nowLabel: effectiveNowLabel } : {}),
      },
      now: {
        ...((body as any).now || {}),
        ...(effectiveNowLabel ? { label: effectiveNowLabel } : {}),
      },
      spans: spans.length ? spans : (body as any).spans || [],
    };

    withNow.windows = normalizeWindows(withNow.windows);
    return withNow;
  };

  async function send(textArg?: string) {
    const raw = (textArg ?? input).trim();
    if (!raw || loading) return;

    const augmented = idQueryPassThrough(raw);
    const userIntent = intentFromQuery(augmented);

    if (userIntent === "exact") setView("narrative");
    else if (userIntent !== "when" && view !== "qa") setView("qa");

    setInput("");
    setMessages((m) => [...m, { id: newId(), role: "user", content: raw }]);
    setLoading(true);

    const stripMDAD = (s?: string): string | undefined => {
      if (!s) return s;
      let out = s;
      const lower = out.toLowerCase();
      const idx1 = lower.indexOf("you’re in");
      const idx2 = lower.indexOf("you're in");
      const cut = idx1 >= 0 ? idx1 : idx2;
      if (cut >= 0) out = out.slice(0, cut).trim();
      out = out.replace(/\b[a-z]+ md\s*\/\s*[a-z]+ ad\b/gi, "").replace(/\s{2,}/g, " ").trim();
      return out;
    };
const stripEvidenceMarker = (s?: string) => {
  if (!s) return s;
  return s
    .replace(/\*\*why this\s*\(evidence\)\s*\*\*/gi, "")
    .replace(/\*\*why this\s*\*\*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
};

    try {
      const data = await askServer(augmented, profile);

      const safeData: QAResponse = {
        ...data,
        bottomLine:
          data.bottomLine ?? {
            lead: (data as any).answer ?? "Here are your best windows.",
            nuance: "",
          },
      };

      if (safeData.bottomLine?.lead) {
        safeData.bottomLine = {
          ...safeData.bottomLine,
         lead:
  stripEvidenceMarker(stripMDAD(safeData.bottomLine.lead)) ??
  safeData.bottomLine.lead,
        };
      }
      if (safeData.bottomLine?.nuance) {
  safeData.bottomLine = {
    ...safeData.bottomLine,
    nuance:
      stripEvidenceMarker(stripMDAD(safeData.bottomLine.nuance)) ??
      safeData.bottomLine.nuance,
  };
}

         if (safeData.copy?.answer || safeData.copy?.how) {
        safeData.copy = {
          ...safeData.copy,
          ...(safeData.copy?.answer
           ? { answer: stripEvidenceMarker(stripMDAD(safeData.copy.answer)) ?? safeData.copy.answer }

            : {}),
          ...(safeData.copy?.how ? { how: stripEvidenceMarker(stripMDAD(safeData.copy.how)) ?? safeData.copy.how } : {}),
        } as any;
      }

      safeData.windows = normalizeWindows(safeData.windows);

      setMessages((m: Msg[]) => [...m, { id: newId(), role: "assistant", data: safeData }]);
    } catch (e: any) {
      console.error("[chat] /api/qa error:", e);
      setMessages((m: Msg[]) => [
        ...m,
        {
          id: newId(),
          role: "assistant",
          content: "I couldn’t fetch a detailed answer right now. Please check birth details or try again.",
          error: typeof e?.message === "string" ? e.message : "Request failed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-sm text-slate-300 bg-slate-950">
        Loading chat…
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-4 h-[100dvh] flex flex-col gap-3 text-slate-100 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950">
      {/* Header */}
      <header className="rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-lg md:text-xl font-semibold tracking-tight">
            Sārathi · Chat{" "}
            {profile?.name ? (
              <span className="text-slate-300/70 text-sm font-normal">— {profile.name}</span>
            ) : null}
          </h1>

          <div className="ml-auto flex items-center gap-2 text-xs">
  {safeMode && (
    <span className="rounded-full border border-white/10 bg-white/5/5 px-2 py-0.5 text-slate-200/80">
      Safe
    </span>
  )}
</div>
        </div>

        {/* Profile + actions */}
        <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
          <div
            className={
              "rounded-full px-3 py-1 border " +
              (hasProfile
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : "border-amber-400/30 bg-amber-500/10 text-amber-200")
            }
          >
            {hasProfile
              ? `Profile loaded${profile?.name ? `: ${profile.name}` : ""}`
              : "No birth profile loaded — using default place for timing."}
          </div>

          {!hasProfile && (
            <a
              href="/sarathi/life-report"
              className="rounded-full border border-white/10 bg-white/5/5 px-3 py-1 hover:bg-white/5/10 text-slate-100"
            >
              Open Life Report
            </a>
          )}

          <button
            onClick={() => {
              setMessages([
  {
    id: newId(),
    role: "assistant",
    content: "Hi — Sārathi Chat is ready. Ask about career, money, relationships, health, or timing.",
  },
]);

              try {
                localStorage.removeItem("sarathi-chat");
              } catch {}
            }}
            className="ml-auto rounded-full border border-white/10 bg-white/5/5 px-3 py-1 hover:bg-white/5/10 text-slate-100"
            title="Clear chat history"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-indigo-950/35 backdrop-blur-sm p-4 space-y-6">
        {messages.map((msg, idx) => {
          const hasWindows = !!(msg.data && Array.isArray(msg.data.windows) && msg.data.windows.length);
          const hasNarrative = !!(msg.data && msg.data.copy && msg.data.copy.answer);

          const prevUser =
            [...messages].slice(0, idx).reverse().find((m) => m.role === "user")?.content || "";
          const intent = intentFromQuery(prevUser);

         let content: React.ReactElement | null = null;

if (msg.role === "assistant" && msg.data) {
  const d = msg.data;
console.log("[job-debug] full payload", d);
console.log("[job-debug] lengths", {
  bottom: d?.bottomLine?.lead?.length ?? 0,
  copyAnswer: d?.copy?.answer?.length ?? 0,
  copyLong: d?.copy?.long?.length ?? 0,
  win0why: Array.isArray(d?.windows?.[0]?.why) ? d.windows[0].why.join(" ").length : 0,
  win0do: Array.isArray(d?.windows?.[0]?.do) ? d.windows[0].do.join(" ").length : 0,
});

  const now = d?.now?.label || d?.extra?.nowLabel;
    const core = d?.core;
    const isDailyOutlook = core?.questionType === "daily_outlook";
  const timingStrength =
  core?.questionType === "daily_outlook"
    ? undefined
    : core?.timing?.windows?.[0]?.strength;
  const timingSummary =
  core?.questionType === "daily_outlook"
    ? undefined
    : core?.timing?.summary;
  const confidenceLevel = core?.confidence?.level;
  const confidenceReason = core?.confidence?.reason;
  const evidenceBullets = core?.evidenceBullets || d?.evidenceBullets || [];
const preferLong = intent === "when" || intent === "exact" || view === "narrative";

const fallbackAnswer =
  Array.isArray(d?.windows) && d.windows.length
    ? [
        `Main window: ${d.windows[0]?.label || ""} (${d.windows[0]?.fromISO || ""} → ${d.windows[0]?.toISO || ""})`.trim(),
        ...(Array.isArray(d.windows[0]?.why) ? d.windows[0].why.slice(0, 2) : []),
      ]
        .filter(Boolean)
        .join("\n")
    : Array.isArray(d?.guidance) && d.guidance.length
    ? d.guidance.slice(0, 3).join("\n")
    : "";

const longFromWindows =
  Array.isArray(d?.windows) && d.windows.length
    ? [
        "What this phase means",
        ...(Array.isArray(d.windows[0]?.why) ? d.windows[0].why : []),
        ...(Array.isArray(d.windows[0]?.notes) ? d.windows[0].notes : d.windows[0]?.notes ? [String(d.windows[0].notes)] : []),
        "",
        "What to do now",
        ...(Array.isArray(d.windows[0]?.do) ? d.windows[0].do : []),
        ...(d?.copy?.how ? [d.copy.how] : []),
      ]
        .flat()
        .filter(Boolean)
        .join("\n")
    : "";

const bestLongAnswer =
  [
    d?.copy?.long,
    d?.answer,
    core?.prose?.full,
    d?.copy?.answer,
    core?.prose?.short,
    d?.bottomLine?.lead,
    fallbackAnswer,
  ]
    .map((x) => String(x || "").trim())
    .find((x) => x.length >= 80) ||
  [
    d?.copy?.long,
    d?.answer,
    core?.prose?.full,
    d?.copy?.answer,
    core?.prose?.short,
    d?.bottomLine?.lead,
    fallbackAnswer,
  ]
    .map((x) => String(x || "").trim())
    .find(Boolean) ||
  "";

const bestShortAnswer =
  [
    d?.copy?.answer,
    d?.answer,
    core?.prose?.short,
    d?.copy?.long,
    core?.prose?.full,
    d?.bottomLine?.lead,
    fallbackAnswer,
  ]
    .map((x) => String(x || "").trim())
    .find((x) => x.length >= 40) ||
  [
    d?.copy?.answer,
    d?.answer,
    core?.prose?.short,
    d?.copy?.long,
    core?.prose?.full,
    d?.bottomLine?.lead,
    fallbackAnswer,
  ]
    .map((x) => String(x || "").trim())
    .find(Boolean) ||
  "";

let answer =
  isDailyOutlook
    ? bestLongAnswer
    : preferLong
    ? bestLongAnswer
    : bestShortAnswer;
if (!answer || answer.trim().length < 120) {
  answer = answer ? `${answer}\n\n${fallbackAnswer}` : fallbackAnswer;
}

console.log("[chat] keys:", {
  hasCopy: !!d?.copy,
  hasLong: !!d?.copy?.long,
  hasAnswer: !!d?.copy?.answer,
  hasWindows: Array.isArray(d?.windows) ? d.windows.length : 0,
  hasBottom: !!d?.bottomLine?.lead,
});



  const how =
    d?.copy?.how ||
    (Array.isArray(d?.checklist) ? d.checklist.slice(0, 3).join("\n") : "");

  const whyBullets: string[] =
    Array.isArray(d?.windows) && d.windows.length
      ? (d.windows[0]?.why || []).slice(0, 3)
      : Array.isArray(d?.guidance)
      ? d.guidance.slice(0, 3)
      : [];

 const title = core?.title || d?.title || (d?.topic ? Cap(String(d.topic)) : undefined);

  const detailNote = hasProfile
  ? "Deeper timing layers are available if you want to explore further."
  : "For precise timing windows, open Life Report once and save your birth profile.";

  // show one compact Sarathi answer card
  content = (
    <div className="space-y-3">
            <SarathiAnswerCard
  title={title}
  nowLabel={now}
  answer={answer}
  how={how}
  whyBullets={whyBullets}
  confidenceText={hasProfile ? "Personalized" : "General"}
  confidenceLevel={confidenceLevel}
  confidenceReason={confidenceReason}
  timingStrength={timingStrength}
  timingSummary={timingSummary}
  evidenceBullets={evidenceBullets}
  detailNote={detailNote}
/>

      {/* Optional deep view stays available */}
      {null}
    </div>
  );
} else if (msg.role === "assistant" && msg.content) {
  // keep plain assistant text messages as a simple bubble
  content = (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-100">
      {msg.content}
    </div>
  );
}

          return (
            <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[88%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                {safeMode && msg.data ? (
                  <pre className="max-w-[88%] overflow-auto rounded-2xl bg-slate-950/60 border border-white/10 p-3 text-xs text-slate-100">
                    {JSON.stringify(msg.data, null, 2)}
                  </pre>
                ) : msg.role === "assistant" && msg.data ? (
                  content
                ) : msg.content ? (
                  <div
                    className={
                      "rounded-2xl px-4 py-2.5 text-sm " +
                      (msg.role === "user"
                        ? "bg-indigo-500/20 border border-indigo-300/20 text-slate-100"
                        : "bg-slate-950/35 border border-white/10 text-slate-100")
                    }
                  >
                    {msg.content}
                    {msg.error && (
                      <div className="mt-2 text-xs text-rose-200/90">
                        <code className="break-words">{msg.error}</code>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {loading && <div className="text-sm text-slate-300/70">Thinking…</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="h-11 flex-1 rounded-xl border border-white/10 bg-slate-950/40 px-4 text-sm text-slate-100 placeholder:text-slate-300/60 outline-none focus:border-indigo-300/40"
          placeholder="Ask about career, money, relationships, health…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          onClick={() => send()}
          disabled={!canSend}
          className="inline-flex items-center justify-center h-11 rounded-xl px-4 text-sm font-semibold border border-white/10 bg-white/5/10 hover:bg-white/5/15 disabled:opacity-50 text-slate-100"
        >
          Send
        </button>
      </div>
    </main>
  );
}
