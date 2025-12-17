"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TimingCards, NarrativeTiming, QARich } from "@/components/TimingCards";
import React from "react";
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
  smartPlan?: {
    quarters?: Array<{
      label: string;
      focus?: string[];
      checkpoints?: string[];
      upskill?: { topic?: string; cadence?: string };
    }>;
    micro?: Array<{
      fromISO: string;
      toISO: string;
      label: string;
      action: "close" | "push" | "build" | "foundation";
      why: string[];
      do: string[];
      score: number;
    }>;
    negotiationTips?: string[];
    visibilityTips?: string[];
  };
  meta?: { windowOrigin?: "engine" | "spans" | "synth"; version?: string };
  error?: string;
  debug?: any;

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

/** Remove any “You’re in … MD / … AD” sentence from a line of text. */
function stripDashaSentence(text?: string): string {
  if (!text) return "";
  const idx = text.search(/You(?:’|')re in/i);
  if (idx === -1) return text;
  const kept = text.slice(0, idx).trim();
  if (!kept) return text;
  return kept.replace(/[ ,;:–-]*$/, "."); // trim trailing junk and end cleanly
}

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

/* =============== Prose renderer for chatty answers (ENHANCED) =============== */
function AssistantProse({ data }: { data: QAResponse }) {
  const c = data.copy || {};
  const hasQuarters = Array.isArray(c.quarters) && c.quarters.length > 0;
  const hasMicro = Array.isArray(c.micro) && c.micro.length > 0;

  const [showLong, setShowLong] = useState(false);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-sm leading-6">
      {c.answer ? <p className="mb-2">{c.answer}</p> : null}

      {c.long ? (
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setShowLong((s) => !s)}
            className="text-xs px-2 py-1 rounded-md border border-black/10 hover:bg-black/5"
          >
            {showLong ? "Hide full explanation" : "Show full explanation"}
          </button>
          {showLong ? (
            <div className="mt-2 whitespace-pre-wrap text-sm leading-6">
              {c.long}
            </div>
          ) : null}
        </div>
      ) : null}

      {c.how ? (
        <div className="mt-2">
          <div className="font-semibold mb-1">How to use this</div>
          <pre className="whitespace-pre-wrap text-sm leading-6">{c.how}</pre>
        </div>
      ) : null}

      {hasQuarters ? (
        <div className="mt-3">
          <div className="font-semibold mb-1">Quarterly plan</div>
          <ul className="list-disc pl-5 space-y-1">
            {c.quarters!.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasMicro ? (
        <div className="mt-3">
          <div className="font-semibold mb-1">Action windows</div>
          <ul className="list-disc pl-5 space-y-1">
            {c.micro!.slice(0, 6).map((m, i) => (
              <li key={i}>
                <span className="font-medium">
                  {m.fromISO} → {m.toISO}
                </span>
                : <em>{m.action}</em>
                {m.why?.length ? ` — ${m.why[0]}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/* =============== Normalizers to keep UI safe =============== */
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
/**
 * Reads `life-report-dasha` and tries to construct:
 *  - mdad (Rahu MD / Saturn AD etc.)
 *  - nowLabel ("Rahu MD / Saturn AD")
 *  - spans (AD windows) for QARich
 */
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

    // Shape 1: explicit currentMD/currentAD
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

    // Shape 2: `current` object with md/ad
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

    // Shape 3: derive from active span (if needed)
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
            const safeNextADs =
      (nextADs ?? []).map((ad) => ({
        planet: ad.planet ?? "Unknown",
        start: ad.start ?? null,
        end: ad.end ?? null,
      }));

    mdad = {
      md: {
        planet: (Cap(curMd || "Unknown") ?? "Unknown"),
        start: curFrom ?? null,
        end: curTo ?? null,
      },
      ad: {
        planet: (Cap(curAd || "Unknown") ?? "Unknown"),
        start: curFrom ?? null,
        end: curTo ?? null,
      },
      nextADs: safeNextADs,
    };


    return { mdad, nowLabel, spans };
  } catch (e) {
    console.warn("buildMDADAndSpans failed", e);
    return { mdad, nowLabel, spans };
  }
}

/* ===================== Component ===================== */
export default function ChatClient() {
  const [mounted, setMounted] = useState(false);
  const [safeMode, setSafeMode] = useState(false);
  const [view, setView] = useState<"cards" | "narrative" | "qa">("qa");
  const [chattyMode, setChattyMode] = useState(true);
  const [profile, setProfile] = useState<Profile>({});
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: newId(),
      role: "assistant",
      content:
        "Hi, this is the Sarathi Chat. If you see this line, ChatClient.tsx is wired correctly.",
    },
  ]);

  const [input, setInput] = useState("when will I change my job with increment");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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
      const raw = localStorage.getItem("sarathi-chat");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {}

    // Prefer the new default profile (saved from Life Report),
    // fall back to the older life-report-profile shape if needed.
    try {
      const rawDefault = localStorage.getItem(DEFAULT_PROFILE_KEY);
      if (rawDefault) {
        const p = JSON.parse(rawDefault);
        const mapped: Profile = {
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
        };
        setProfile(mapped);
      } else {
        const rawLR = localStorage.getItem(LIFE_REPORT_KEY);
        if (rawLR) setProfile(JSON.parse(rawLR));
      }
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === LIFE_REPORT_KEY) {
        try {
          setProfile(e.newValue ? JSON.parse(e.newValue) : {});
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

  /* ---- unified server call: birth + MD/AD from local dasha ---- */
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

    const payload: any = {
  query,
  text: query,
  input: query,

  profile: mdad ? { ...baseProfile, mdad } : baseProfile,
  style: styleToSend,
  spans,
  dashaSpans: spans,
  ...(DEBUG ? { history: buildHistory(messages, query), debug: true } : {}),
};

    console.log("[chat] QA payload to /api/qa", payload);

    let res: Response | undefined;
    let body: any = null;

    try {
      res = await fetch("/api/qa?v=qa-route-2025-10-18b", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        next: { revalidate: 0 },
        body: JSON.stringify(payload),
      });

      try {
        body = await res.json();
        console.log("[chat] QA raw response from /api/qa", body);
      } catch {
        body = null;
      }
    } catch (e: any) {
      body = { ok: false, error: `Network error: ${e?.message || e}` };
    }

    const errText = String((body && body.error) || "");
    const effectiveNowLabel =
      nowLabel ||
      (body &&
        ((body.extra && body.extra.nowLabel) ||
          (body.now && body.now.label)));

    // If not OK, return a safe fallback
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

    // Happy path: attach our nowLabel + spans override, normalize windows
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
      out = out
        .replace(/\b[a-z]+ md\s*\/\s*[a-z]+ ad\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      return out;
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
          lead: stripMDAD(safeData.bottomLine.lead) ?? safeData.bottomLine.lead,
        };
      }
      if (safeData.bottomLine?.nuance) {
        safeData.bottomLine = {
          ...safeData.bottomLine,
          nuance: stripMDAD(safeData.bottomLine.nuance) ?? safeData.bottomLine.nuance,
        };
      }

      if (safeData.copy?.answer || safeData.copy?.how) {
        safeData.copy = {
          ...safeData.copy,
          ...(safeData.copy?.answer
            ? { answer: stripMDAD(safeData.copy.answer) ?? safeData.copy.answer }
            : {}),
          ...(safeData.copy?.how
            ? { how: stripMDAD(safeData.copy.how) ?? safeData.copy.how }
            : {}),
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
          content:
            "I couldn’t fetch a detailed answer right now. Please check birth details or try again.",
          error: typeof e?.message === "string" ? e.message : "Request failed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return <div className="p-6 text-sm text-gray-600">Loading chat…</div>;

  return (
    <main className="mx-auto max-w-5xl p-4 h-[100dvh] flex flex-col gap-3 text-slate-100 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950">
      <header className="flex items-center gap-3 flex-wrap">
        <h1 className="text-xl font-semibold tracking-tight">
          Sarathi · Chat{" "}
          {profile?.name ? <span className="text-gray-500">— for {profile.name}</span> : null}
        </h1>

        <div className="flex items-center gap-3 text-xs ml-auto">
          <span className="text-gray-600">View:</span>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="view"
              checked={view === "qa"}
              onChange={() => setView("qa")}
              disabled={safeMode}
            />
            Q&amp;A
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="view"
              checked={view === "cards"}
              onChange={() => setView("cards")}
              disabled={safeMode}
            />
            Cards
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="view"
              checked={view === "narrative"}
              onChange={() => setView("narrative")}
              disabled={safeMode}
            />
            Narrative / Timeline
          </label>

          <span className="ml-4 text-gray-600">Chat mode:</span>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={chattyMode}
              onChange={(e) => setChattyMode(e.target.checked)}
            />
            Conversational
          </label>

          {safeMode && (
            <span className="rounded-md border border-black/10 px-2 py-0.5 text-xs bg-gray-50">
              Safe mode
            </span>
          )}
        </div>

        <div className="w-full flex items-center gap-2 text-xs">
          <div
            className={`rounded-full px-2 py-0.5 border ${
              profile?.name
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-yellow-50 text-yellow-700 border-yellow-200"
            }`}
          >
            {profile?.name
              ? `Profile loaded (Life Report): ${profile.name}`
              : "No profile found. Using default location for timing answers."}
          </div>
          {!profile?.name && (
            <a
              href="/sarathi/life-report"
              className="rounded-md border border-black/10 px-2 py-1 hover:bg-black/5"
            >
              Go to Life Report
            </a>
          )}
          <button
            onClick={() => {
              setMessages([] as Msg[]);
              try {
                localStorage.removeItem("sarathi-chat");
              } catch {}
            }}
            className="ml-auto rounded-md border border-black/10 px-2 py-1 hover:bg-black/5"
            title="Clear chat history"
          >
            clear
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-indigo-950/40 backdrop-blur-sm p-4 space-y-6">
        {messages.map((msg, idx) => {
          const hasWindows = !!(msg.data && Array.isArray(msg.data.windows) && msg.data.windows.length);
          const hasNarrative = !!(msg.data && msg.data.copy && msg.data.copy.answer);

          const prevUser =
            [...messages].slice(0, idx).reverse().find((m) => m.role === "user")?.content || "";
          const intent = intentFromQuery(prevUser);

          let content: React.ReactElement | null = null;

          if (msg.role === "assistant" && msg.data && hasNarrative) {
            content = <AssistantProse data={msg.data} />;
          } else if (
            msg.role === "assistant" &&
            msg.data &&
            hasWindows &&
            (intent === "when" || intent === "exact")
          ) {
            const hideChartLens = Boolean(msg.data?.copy?.answer);

            const dataForCards = {
              ...msg.data,
              ...(hideChartLens ? { copy: { ...msg.data.copy, house: undefined } } : {}),
              windows: normalizeWindows(msg.data.windows),
              bottomLine:
                msg.data.bottomLine ?? {
                  lead: (msg.data as any).answer ?? "Here are your best windows.",
                  nuance: "",
                },
            };

            content =
              view === "cards" ? (
                <TimingCards data={dataForCards as any} />
              ) : view === "narrative" ? (
                <NarrativeTiming data={dataForCards as any} />
              ) : (
                <QARich data={dataForCards as any} question={prevUser} />
              );
          } else if (msg.role === "assistant" && msg.data && !hasNarrative) {
            const now =
              msg.data?.now?.label ||
              msg.data?.extra?.nowLabel;
            const wins = normalizeWindows(msg.data?.windows);
            content = (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-sm leading-6">
                <p className="mb-2">
                  I couldn’t fetch specific guidance for that request just now.
                  {now ? ` You’re currently in **${now}**.` : ""} Here’s the big picture:
                </p>
                {wins.length ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {wins.slice(0, 2).map((w: any, i: number) => (
                      <li key={i}>
                        <span className="font-medium">
                          {(w?.fromISO || w?.from) ?? "—"} → {(w?.toISO || w?.to) ?? "—"}
                        </span>
                        {w?.label ? ` — ${w.label}` : ""}
                        {w?.notes
                          ? ` — ${typeof w.notes === "string" ? w.notes : w.notes.join("; ")}`
                          : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Keep efforts steady week by week; warm referrals before screens.</p>
                )}
              </div>
            );
          } else if (msg.role === "assistant" && msg.data) {
            content = (
              <div className="rounded-2xl bg-white/5 border border-white/5 px-3 py-2 text-sm">
                {msg.data.bottomLine?.lead || "Here’s what I found."}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`max-w-[85%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                {safeMode && msg.data ? (
                  <pre className="max-w-[85%] overflow-auto rounded-2xl bg-white/5 border border-white/10 p-3 text-xs">
                    {JSON.stringify(msg.data, null, 2)}
                  </pre>
                ) : msg.role === "assistant" && msg.data ? (
                  content
                ) : msg.content ? (
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user" ? "bg-black text-white" : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {msg.content}
                    {msg.error && (
                      <div className="mt-1 text-xs opacity-80">
                        <code>{msg.error}</code>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        {loading && <div className="text-sm text-gray-500">…thinking</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="h-10 flex-1 rounded-md border border-black/5 bg-white px-3 text-sm outline-none focus:border-black/30"
          placeholder="Type your question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          onClick={() => send()}
          disabled={!canSend}
          className="inline-flex items-center justify-center h-10 rounded-md px-3 text-sm font-medium bg-black text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </main>
  );
}
