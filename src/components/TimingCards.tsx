// FILE: src/components/TimingCards.tsx
"use client";

import { useMemo, type ReactNode } from "react";

/* ------------ Robust MD/AD label helper (authoritative first) ------------ */
function currentMdAdLabel(data: any) {
  const cap = (s?: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

  // helper: normalize any span-like row to {fromISO,toISO,label}
  const toSpan = (row: any) => {
    const fromISO =
      row?.fromISO ?? row?.startISO ?? row?.from ?? row?.start ?? row?.s ?? "";
    const toISO =
      row?.toISO ?? row?.endISO ?? row?.to ?? row?.end ?? row?.e ?? "";
    const md = row?.md ?? row?.major ?? row?.maha ?? row?.mdLord ?? row?.md_lord;
    const ad =
      row?.ad ??
      row?.sub ??
      row?.lord ??
      row?.antardasha ??
      row?.ad_lord ??
      row?.adLord;
    const label =
      row?.label ??
      (md && ad ? `${cap(String(md))} MD / ${cap(String(ad))} AD` : undefined);
    return {
      fromISO: String(fromISO || "").slice(0, 10),
      toISO: String(toISO || "").slice(0, 10),
      label,
    };
  };

  const today = new Date().toISOString().slice(0, 10);

  // 1) Strongest: injected overrides on the data itself (fresh from server)
  if (data?.extra?.nowLabel) return data.extra.nowLabel as string;
  if (data?.now?.label) return data.now.label as string;

  // 2) Data-level currentMD/currentAD from this response
  const mdPlanet =
    data?.currentMD?.planet ??
    data?.extra?.currentMD?.planet ??
    data?.md?.planet ??
    data?.md;
  const adLord =
    data?.currentAD?.lord ??
    data?.extra?.currentAD?.lord ??
    data?.ad?.lord ??
    data?.ad;
  if (mdPlanet && adLord)
    return `${cap(String(mdPlanet))} MD / ${cap(String(adLord))} AD`;

  // 3) Data-level span-like arrays from this response
  const arrays: any[] = []
    .concat(Array.isArray(data?.spans) ? data.spans : [])
    .concat(Array.isArray(data?.ads) ? data.ads : [])
    .concat(Array.isArray(data?.adSpans) ? data.adSpans : [])
    .concat(Array.isArray(data?.ad_table) ? data.ad_table : [])
    .concat(Array.isArray(data?.adTable) ? data.adTable : []);
  if (arrays.length) {
    const normalized = arrays.map(toSpan).filter((s) => s.fromISO && s.toISO);
    const hit = normalized.find(
      (s) => s.label && s.fromISO <= today && today <= s.toISO
    );
    if (hit?.label) return hit.label as string;
  }

  // 4) Optional: LAST-resort localStorage (can also be removed entirely if you prefer)
  try {
    const raw = localStorage.getItem("life-report-dasha");
    if (raw) {
      const bundle = JSON.parse(raw);

      const storeLabel = bundle?.now?.label ?? bundle?.nowLabel;
      if (storeLabel) return storeLabel as string;

      const sMd = bundle?.currentMD?.planet;
      const sAd = bundle?.currentAD?.lord;
      if (sMd && sAd) return `${cap(String(sMd))} MD / ${cap(String(sAd))} AD`;

      let storeSpans: any[] = [];
      if (Array.isArray(bundle?.spans)) storeSpans = storeSpans.concat(bundle.spans);
      if (Array.isArray(bundle?.ads)) storeSpans = storeSpans.concat(bundle.ads);
      if (Array.isArray(bundle?.adSpans)) storeSpans = storeSpans.concat(bundle.adSpans);
      if (Array.isArray(bundle?.ad_table)) storeSpans = storeSpans.concat(bundle.ad_table);
      if (Array.isArray(bundle?.adTable)) storeSpans = storeSpans.concat(bundle.adTable);

      if (storeSpans.length) {
        const normalized = storeSpans.map(toSpan).filter((s) => s.fromISO && s.toISO);
        const hit = normalized.find(
          (s) => s.label && s.fromISO <= today && today <= s.toISO
        );
        if (hit?.label) return hit.label as string;
      }
    }
  } catch {
    // ignore storage errors
  }

  // 5) Last resort: parse legacy context strings on this response
  const m = String(data?.context || "").match(
    /\b(ketu|venus|sun|moon|mars|rahu|jupiter|saturn|mercury)\s+md\s*\/\s*(ketu|venus|sun|moon|mars|rahu|jupiter|saturn|mercury)\s+ad/i
  );
  if (m) {
    const cap2 = (s: string) =>
      s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    return `${cap2(m[1])} MD / ${cap2(m[2])} AD`;
  }

  return undefined;
}

/* ----------------- extra helpers for the Q&A rich card ----------------- */
const ORDER: string[] = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const YEARS: Record<string, number> = {
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

// months for a sub-period inside a given MD (classic Vimshottari proportion)
function adMonths(md: string, ad: string): number {
  const m = YEARS[cap(md)] ?? 0;
  const a = YEARS[cap(ad)] ?? 0;
  return (m * a) / 10;
}
function cap(s?: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}
function nextAd(cur: string) {
  const i = ORDER.indexOf(cap(cur));
  return ORDER[(i + 1 + ORDER.length) % ORDER.length];
}
function toISO(d: Date) {
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
function addMonths(d: Date, months: number) {
  const dd = new Date(d.getTime());
  const whole = Math.floor(months);
  dd.setMonth(dd.getMonth() + whole);
  const leftoverDays = Math.round((months - whole) * 30);
  dd.setDate(dd.getDate() + leftoverDays);
  return dd;
}
function parseMdAd(label?: string) {
  if (!label) return { md: undefined as string | undefined, ad: undefined as string | undefined };
  const m = label.match(/^\s*([A-Za-z]+)\s+MD\s*\/\s*([A-Za-z]+)\s+AD\s*$/i);
  if (!m) return { md: undefined, ad: undefined };
  return { md: cap(m[1]), ad: cap(m[2]) };
}
function fmtDM(x?: string | Date | null) {
  if (!x) return "—";
  const d = x instanceof Date ? x : new Date(x as any);
  return Number.isNaN(+d)
    ? "—"
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
function fmtY(x?: string | Date | null) {
  if (!x) return "";
  const d = x instanceof Date ? x : new Date(x as any);
  return Number.isNaN(+d) ? "" : d.getFullYear().toString();
}
function synthesizeAdSpans(md?: string, startAd?: string, horizonMonths = 30) {
  if (!md || !startAd) return [];
  const out: Array<{ fromISO: string; toISO: string; label: string }> = [];
  let cur = cap(startAd);
  let start = new Date();
  let used = 0;
  while (used < horizonMonths && out.length < 12) {
    const months = Math.max(2, Math.round(adMonths(cap(md), cur)));
    const end = addMonths(start, months);
    out.push({ fromISO: toISO(start), toISO: toISO(end), label: `${cap(md)} MD / ${cur} AD` });
    used += months;
    start = end;
    cur = nextAd(cur);
  }
  return out;
}

/* ------------------------------- types ------------------------------- */
export type Topic =
  | "vehicle"
  | "property"
  | "job"
  | "wealth"
  | "health"
  | "relationships"
  | "disputes"
  | "marriage";

export type WindowT = {
  range?: string;
  fromISO?: string;
  toISO?: string;
  start?: string;
  end?: string;
  startISO?: string;
  endISO?: string;
  tag: string;
  why: string[];
  do: string[];
};

export type NarrativeDoc = {
  title?: string;
  summary?: string;
  context?: string;
  advice?: string[];
  timeline?: Array<{ period: string; dasha?: string; note: string }>;
  astroRefs?: string[];
};

type SmartQuarter = {
  label: string;
  focus: string[];
  checkpoints: string[];
  upskill?: { topic: string; cadence: string; resources?: string[] };
};
type SmartMicro = {
  fromISO: string;
  toISO: string;
  label: string;
  action: "close" | "push" | "build" | "foundation";
  why: string[];
  do: string[];
  score: number;
};

export type QAResponse = {
  ok: boolean;
  topic: Topic;
  title: string;
  bottomLine: { lead: string; nuance: string };
  context?: string;
  natal?: string;
  windows: WindowT[];
  guidance: string[];
  checklist: string[];
  error?: string;
  narrative?: NarrativeDoc;

  now?: { label?: string; fromISO?: string; toISO?: string };
  extra?: { nowLabel?: string };
  spans?: Array<{ fromISO: string; toISO: string; label: string }>;

  // optional enrichments
  transit?: Array<{ fromISO: string; toISO: string; label: string; why?: string[] }>;
  remedies?: string[];
  smartPlan?: {
    quarters: SmartQuarter[];
    micro: SmartMicro[];
    negotiationTips?: string[];
    visibilityTips?: string[];
  };

  [k: string]: any;
};

/* ------------------------------ tiny UI ------------------------------ */
function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={"rounded-2xl border border-black/10 bg-white shadow-sm " + (className ?? "")}>{children}</div>;
}
function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={"p-4 " + (className ?? "")}>{children}</div>;
}
function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h3 className={"font-semibold tracking-tight " + (className ?? "")}>{children}</h3>;
}
function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={"p-4 pt-0 " + (className ?? "")}>{children}</div>;
}
function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={"p-4 pt-0 " + (className ?? "")}>{children}</div>;
}
function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" }
) {
  const { className, variant = "primary", ...rest } = props;
  const base =
    "inline-flex items-center justify-center h-9 rounded-md px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "outline" ? "border border-black/10 bg-white hover:bg-black/5" : "bg-black text-white hover:bg-black/90";
  return <button {...rest} className={`${base} ${styles} ${className ?? ""}`} />;
}
function Separator({ className }: { className?: string }) {
  return <hr className={"border-t border-black/10 " + (className ?? "")} />;
}

/* ------------------------------ helpers ------------------------------ */
const topicEmoji: Record<Topic, string> = {
  vehicle: "🚗",
  property: "🏠",
  job: "💼",
  wealth: "💰",
  health: "🏋️‍♂️",
  relationships: "❤️",
  disputes: "⚖️",
  marriage: "💍",
};
const tagStyles: Record<string, string> = {
  "quick wins": "bg-blue-50 text-blue-700 border-blue-200",
  "build + close": "bg-amber-50 text-amber-700 border-amber-200",
  "prep + momentum": "bg-emerald-50 text-emerald-700 border-emerald-200",
};
function TagChip({ tag }: { tag: string }) {
  const cls = tagStyles[tag] ?? "bg-gray-50 text-gray-700 border-gray-200";
  return <span className={"inline-block rounded-full border px-3 py-1 text-xs font-medium " + cls}>{tag}</span>;
}
function BulletList({ items }: { items: string[] }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <ul className="space-y-1">
      {list.map((t, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-0.5">•</span>
          <span className="text-sm leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}
function intersectAll(arrs: string[][]): string[] {
  if (!arrs.length) return [];
  return arrs.reduce((acc, cur) => acc.filter((x) => cur.includes(x)));
}
function without<T>(base: T[], remove: T[]) {
  return base.filter((x) => !remove.includes(x));
}
function guidanceTitleFor(topic: Topic) {
  switch (topic) {
    case "job":
      return "Switch / Wait guidance";
    case "vehicle":
      return "Buy / Wait guidance";
    case "property":
      return "Proceed / Pause guidance";
    default:
      return "Guidance";
  }
}

/* ---------------------------- Cards View ---------------------------- */
type Props = { data?: QAResponse };

export function TimingCards({ data }: Props) {
  if (!data) return null;
  const { title, bottomLine, natal, windows, guidance, checklist, topic } = data;

  const commonWhy = useMemo(() => intersectAll(windows.map((w) => w.why || [])), [windows]);
  const commonDo = useMemo(() => intersectAll(windows.map((w) => w.do || [])), [windows]);

  const slimWindows = useMemo(
    () => windows.map((w) => ({ ...w, why: without(w.why || [], commonWhy), do: without(w.do || [], commonDo) })),
    [windows, commonWhy, commonDo]
  );

  const mdAd = currentMdAdLabel(data);
  const contextText = useMemo(() => {
    const count = windows?.length ?? 0;
    return `Dasha-aligned windows (${count})
${mdAd ? `You’re in ${mdAd}. Proceed methodically; patience multiplies outcomes.` : `Engine running; MD/AD label unavailable.`}`;
  }, [mdAd, windows]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="text-xl">{topicEmoji[topic] ?? "✨"}</span>
              <span>{title}</span>
            </CardTitle>
            <div className="ml-auto">
              <Button variant="outline" onClick={() => window.print()} title="Print or Save as PDF">
                Print / PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-black/10 p-3 bg-gray-50">
            <div className="text-sm font-medium mb-1">Bottom line</div>
            <div className="text-sm">{bottomLine?.lead ?? ""}</div>
            {bottomLine?.nuance ? <div className="text-xs text-gray-500 mt-1">{bottomLine.nuance}</div> : null}
          </div>
          <div className="rounded-xl border border-black/10 p-3 bg-gray-50">
            <div className="text-sm font-medium mb-1 flex items-center gap-2">ℹ️ Context</div>
            <div className="text-xs whitespace-pre-line leading-relaxed text-gray-600">{contextText}</div>
          </div>
        </CardContent>
        {data.natal ? (
          <CardFooter className="pt-0">
            <div className="text-sm text-gray-600 flex items-center gap-2">✨ {natal}</div>
          </CardFooter>
        ) : null}
      </Card>

      {(commonWhy.length > 0 || commonDo.length > 0) && (
        <Card>
          <CardContent className="grid md:grid-cols-2 gap-6 p-6">
            {commonWhy.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Common signals across windows</div>
                <BulletList items={commonWhy} />
              </div>
            )}
            {commonDo.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Core actions (apply to all)</div>
                <BulletList items={commonDo} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {slimWindows.map((w, idx) => {
          const showWhy = (w.why || []).length > 0;
          const showDo = (w.do || []).length > 0;
          const showBaselineNote = !showWhy && !showDo;
          const fromISO = w?.fromISO ?? w?.from ?? w?.start ?? w?.startISO ?? null;
          const toISO = w?.toISO ?? w?.to ?? w?.end ?? w?.endISO ?? null;
          const left = fmtDM(fromISO);
          const right = fmtDM(toISO);
          const yearL = fmtY(fromISO);
          const yearR = fmtY(toISO);
          const rangeLabel =
            left === "—" && right === "—" && typeof w?.range === "string" && w.range.trim()
              ? w.range
              : `${left} ${yearL} – ${right} ${yearR}`;

          return (
            <Card className="h-full" key={idx}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">📅 {rangeLabel}</div>
                  <TagChip tag={w.tag} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {showWhy && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Why (unique)</div>
                    <BulletList items={w.why || []} />
                  </div>
                )}
                {showWhy && showDo && <Separator />}
                {showDo && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Focus (unique)</div>
                    <BulletList items={w.do || []} />
                  </div>
                )}
                {showBaselineNote && <div className="text-xs text-gray-500 italic">Follows common signals & actions.</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <div className="text-sm font-medium mb-2">{guidanceTitleFor(topic)}</div>
            <BulletList items={data.guidance || []} />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Smart checklist for you</div>
            <BulletList items={data.checklist || []} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------- Narrative View -------------------------- */
export function NarrativeTiming({ data }: { data: QAResponse }) {
  const mdAd = currentMdAdLabel(data);

  const doc: NarrativeDoc = useMemo(() => {
    if (data.narrative) return data.narrative;

    const summary = `${data.bottomLine?.lead ?? ""} ${data.bottomLine?.nuance ?? ""}`.trim();
    const advice = data.guidance || [];
    const count = data.windows?.length ?? 0;
    const context = `Dasha-aligned windows (${count})
${mdAd ? `You’re in ${mdAd}. Proceed methodically; patience multiplies outcomes.` : `Engine running; MD/AD label unavailable.`}`;

    const timeline = (data.windows || []).map((w) => {
      const fromISO = w?.fromISO ?? w?.from ?? w?.start ?? w?.startISO ?? null;
      const toISO = w?.toISO ?? w?.to ?? w?.end ?? w?.endISO ?? null;
      const period = `${fmtDM(fromISO)} ${fmtY(fromISO)} – ${fmtDM(toISO)} ${fmtY(toISO)}`;
      return {
        period,
        note: `${w.tag}: ${(w.why && w.why[0]) ?? "favorable signals"}; focus: ${(w.do && w.do[0]) ?? "steady execution"}.`,
      };
    });

    return { title: data.title, summary, context, advice, timeline };
  }, [data, mdAd]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl">{doc.title ?? data.title}</CardTitle>
            <div className="ml-auto">
              <Button variant="outline" onClick={() => window.print()} title="Print or Save as PDF">
                Print / PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {doc.context && (
            <div className="rounded-xl border border-black/10 p-3 bg-gray-50 text-xs whitespace-pre-line text-gray-600">
              {doc.context}
            </div>
          )}
          {doc.summary && <p className="text-sm leading-relaxed">{doc.summary}</p>}
          {doc.advice?.length ? (
            <div>
              <div className="text-sm font-medium mb-2">Guidance</div>
              <BulletList items={doc.advice} />
            </div>
          ) : null}
          {doc.timeline?.length ? (
            <div>
              <div className="text-sm font-medium mb-2">Timeline</div>
              <div className="space-y-3">
                {doc.timeline.map((t, i) => (
                  <div key={i} className="rounded-lg border border-black/10 p-3 bg-white">
                    <div className="text-sm font-medium">{t.period}</div>
                    {t.dasha && <div className="text-xs text-gray-500">Dasha: {t.dasha}</div>}
                    <div className="text-sm mt-1">{t.note}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

/* --------------------------- Q&A Rich View --------------------------- */
export function QARich({
  data,
  question,
}: {
  data: QAResponse | any;
  question?: string;
}) {
  const HEADLINE_RANGE_MONTHS = 24;

  // ---- local helpers ----
  const safeDateLocal = (x?: string | Date | null) => {
    if (!x) return null;
    const d = x instanceof Date ? x : new Date(x as any);
    return Number.isNaN(+d) ? null : d;
  };
  const addM = (d: Date, m: number) => {
    const c = new Date(d);
    c.setMonth(c.getMonth() + m);
    return c;
  };
  const fmtMY = (iso?: string | Date | null) => {
    const d = safeDateLocal(iso as any);
    return d ? d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "—";
  };

  const mdAdLabel = currentMdAdLabel(data);
  const parseMdAdLocal = (label?: string) => {
    if (!label) return { md: undefined as string | undefined, ad: undefined as string | undefined };
    const m = label.match(
      /\b(ketu|venus|sun|moon|mars|rahu|jupiter|saturn|mercury)\s+md\s*\/\s*(ketu|venus|sun|moon|mars|rahu|jupiter|saturn|mercury)\s+ad/i
    );
    if (!m) return { md: undefined, ad: undefined };
    const cap2 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    return { md: cap2(m[1]), ad: cap2(m[2]) };
  };
  const { md, ad } = parseMdAdLocal(mdAdLabel);

  const serverSpans: Array<{ fromISO: string; toISO: string; label: string }> =
    Array.isArray(data?.spans) ? data.spans.filter((s: any) => s?.label) : [];
  const spans = serverSpans.length > 0 ? serverSpans : synthesizeAdSpans(md, ad, 30);

  const CFG = { HEADLINE_RANGE_MONTHS, SHIFT_START_MONTHS: -1, SHIFT_END_MONTHS: -1 };
  const primary = spans.slice(0, 2);
  const startISO = primary[0]?.fromISO;
  const endRawISO = primary[1]?.toISO || primary[0]?.toISO;

  let startD = safeDateLocal(startISO);
  let endD = safeDateLocal(endRawISO);
  if (startD) {
    const capD = addM(startD, CFG.HEADLINE_RANGE_MONTHS);
    if (!endD || endD > capD) endD = capD;
  }
  if (startD) startD = addM(startD, CFG.SHIFT_START_MONTHS);
  if (endD) endD = addM(endD, CFG.SHIFT_END_MONTHS);

  // Tailored bullets (fallbacks if humanCopy.* not provided)
  const why: string[] = [];
  const how: string[] = [];
  if (md === "Rahu") {
    why.push("Rahu MD supports bold pivots, visibility and network-led breakthroughs.");
  }
  if (ad === "Ketu") {
    why.push("Ketu AD gives results after consistent, detached execution; quality > volume.");
    how.push("Document decisions; avoid impulsive switches; keep outreach steady.");
    how.push("Tighten your story; target fewer roles; keep references warm.");
  }
  if (ad === "Venus") {
    why.push("Venus AD is pay/brand friendly — good for negotiations and title upgrades.");
    how.push("Polish portfolio/LinkedIn; line up referrals; anchor on comp.");
  }

  const astroRefs: string[] =
    (Array.isArray(data?.astroRefs) && data.astroRefs) ||
    (Array.isArray(data?.extra?.astroRefs) && data.extra.astroRefs) ||
    [];

  // Transit windows, visible ones
  const todayISO = new Date().toISOString().slice(0, 10);
  const minMs = 14 * 86400000;
  const visibleTransits: Array<{ fromISO: string; toISO: string; label: string; why?: string[] }> =
    Array.isArray(data?.transit)
      ? [...data.transit]
          .filter((t) => t.toISO >= todayISO)
          .filter((t) => +new Date(t.toISO) - +new Date(t.fromISO) >= minMs)
          .sort((a, b) => a.fromISO.localeCompare(b.fromISO))
      : [];

  const remedies: string[] = Array.isArray(data?.remedies) ? data.remedies : [];

  const sp = data?.smartPlan as QAResponse["smartPlan"] | undefined;

  // Humanized copy from API
  const humanCopy = (data?.copy ?? {}) as {
    answer?: string;
    how?: string[];
    windowLines?: string[];
    planIntro?: string;
    quarters?: string[];
    micro?: string[];
  };

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="text-lg font-semibold">{data?.title || "Job change timing"}</div>

      {question && (
        <div className="rounded-lg border border-black/10 p-3 bg-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Question</div>
          <div className="text-sm">{question}</div>
        </div>
      )}

      {/* Answer (humanized when available) */}
      <div className="rounded-lg border border-black/10 p-3 bg-white">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Answer</div>
        <div className="text-sm leading-relaxed">
          {humanCopy?.answer ? (
            humanCopy.answer
          ) : (
            <>
              The <strong>high-probability window for a switch with increment</strong> is{" "}
              {startD && endD ? (
                <span className="font-medium">
                  {fmtMY(startD)} – {fmtMY(endD)}
                </span>
              ) : (
                "coming up"
              )}
              .{md && ad ? (
                <> You’re in <span className="font-medium">{md} MD / {ad} AD</span>.</>
              ) : null}{" "}
              Work methodically; patience multiplies outcomes.
            </>
          )}
        </div>
      </div>

      {/* Why / How — prefer humanized; fall back to heuristic bullets */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-black/10 p-3 bg-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Why this window works
          </div>
          {Array.isArray(humanCopy?.windowLines) && humanCopy.windowLines.length > 0 ? (
            <BulletList items={humanCopy.windowLines} />
          ) : why.length ? (
            <BulletList items={why} />
          ) : (
            <div className="text-sm text-gray-600">Favourable dasha mix; use methodical execution.</div>
          )}
        </div>

        <div className="rounded-lg border border-black/10 p-3 bg-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            How to use this period
          </div>
          {Array.isArray(humanCopy?.how) && humanCopy.how.length > 0 ? (
            <BulletList items={humanCopy.how} />
          ) : how.length ? (
            <BulletList items={how} />
          ) : (
            <div className="text-sm text-gray-600">
              Document decisions; keep outreach steady; avoid impulsive switches.
            </div>
          )}
        </div>
      </div>

      {/* Opportunity windows (by AD) */}
      <div className="rounded-lg border border-black/10 p-3 bg-white">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Opportunity windows (by AD)
        </div>
        {spans.length ? (
          <div className="space-y-2">
            {spans.map((s, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium">{s.label}</span>{" "}
                <span className="text-gray-600">
                  ({fmtMY(s.fromISO)} – {fmtMY(s.toISO)})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            I couldn’t fetch detailed windows right now. Please check birth details or try again.
          </div>
        )}
      </div>

      {/* Quarterly plan — human one-liners preferred; structured fallback */}
      {(humanCopy.quarters?.length || sp?.quarters?.length) ? (
        <div className="rounded-lg border border-black/10 p-3 bg-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Quarterly plan (what to do when)
          </div>
          {humanCopy.planIntro ? <p className="text-sm mb-2">{humanCopy.planIntro}</p> : null}
          {humanCopy.quarters?.length ? (
            <ul className="space-y-2">
              {humanCopy.quarters.map((line, i) => (
                <li key={i} className="text-sm leading-relaxed">{line}</li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              {sp!.quarters!.map((q, i) => (
                <div key={i} className="rounded-md border border-black/10 p-3">
                  <div className="text-sm font-medium">{q.label}</div>
                  {q.focus?.length ? (
                    <div className="text-xs text-gray-600 mt-1">
                      Focus: <span className="font-medium">{q.focus.join(" · ")}</span>
                    </div>
                  ) : null}
                  {q.upskill ? (
                    <div className="text-xs text-gray-600 mt-1">
                      Upskill: {q.upskill.topic} — <span className="italic">{q.upskill.cadence}</span>
                    </div>
                  ) : null}
                  {q.checkpoints?.length ? (
                    <div className="mt-2">
                      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Checkpoints</div>
                      <BulletList items={q.checkpoints} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Micro windows (3–8 weeks) — human one-liners preferred; structured fallback */}
      {(humanCopy.micro?.length || sp?.micro?.length) ? (
        <div className="rounded-lg border border-black/10 p-3 bg-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Action windows (3–8 weeks)
          </div>
          {humanCopy.micro?.length ? (
            <BulletList items={humanCopy.micro} />
          ) : (
            <div className="space-y-2">
              {sp!.micro!.map((m, i) => (
                <div key={i} className="text-sm leading-6">
                  <div className="font-medium">
                    {m.label} — <span className="uppercase">{m.action}</span>{" "}
                    <span className="text-gray-600">
                      ({new Date(m.fromISO).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      {" "}→{" "}
                      {new Date(m.toISO).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })})
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">Score: {m.score}</div>
                  {m.why?.length ? (
                    <div className="mt-1">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Why</div>
                      <BulletList items={m.why.slice(0, 3)} />
                    </div>
                  ) : null}
                  {m.do?.length ? (
                    <div className="mt-1">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Do</div>
                      <BulletList items={m.do.slice(0, 4)} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Transit-boosted windows */}
      {visibleTransits.length > 0 && (
        <div className="rounded-lg border border-black/10 p-3 bg-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Transit-boosted windows (3–8 weeks)
          </div>
          <div className="space-y-2">
            {visibleTransits.map((t, i) => (
              <div key={i} className="text-sm leading-6">
                <div className="font-medium">{t.label}</div>
                <div className="text-gray-600">
                  {new Date(t.fromISO).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}{" "}
                  →{" "}
                  {new Date(t.toISO).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
                {Array.isArray(t.why) && t.why.length > 0 ? (
                  <ul className="text-xs text-gray-600 list-disc ml-5 mt-1">
                    {t.why.slice(0, 3).map((w: string, k: number) => (
                      <li key={k}>{w}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remedies / Tips */}
      {remedies.length > 0 && (
        <div className="rounded-lg border border-black/10 p-3 bg-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Remedies / Tips</div>
          <BulletList items={remedies} />
        </div>
      )}

      {/* Astro refs */}
      {astroRefs.length ? (
        <div className="rounded-lg border border-black/10 p-3 bg-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Astro reference (from chart)
          </div>
          <BulletList items={astroRefs} />
        </div>
      ) : null}
    </div>
  );
}