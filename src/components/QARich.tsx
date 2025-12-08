// FILE: src/components/QARich.tsx
import * as React from "react";

export type WindowT = { fromISO: string; toISO: string; tag: string; why?: string[]; do?: string[]; score?: number };

export type NarrativeDoc = {
  title?: string; summary?: string; context?: string; advice?: string[];
  timeline?: Array<{ period: string; dasha?: string; note: string }>;
  astroRefs?: string[];
};

export type QAResponse = {
  ok: boolean;
  topic: "vehicle" | "property" | "job" | "wealth" | "health" | "relationships" | "disputes" | "marriage";
  title: string;
  bottomLine?: { lead: string; nuance?: string };
  context?: string;
  natal?: string;
  windows?: WindowT[];
  guidance?: string[];
  checklist?: string[];
  error?: string;
  narrative?: NarrativeDoc;
  now?: { fromISO: string; toISO: string; label: string } | null;
  spans?: Array<{ fromISO: string; toISO: string; label: string }>;
  transit?: Array<{ fromISO: string; toISO: string; label: string; why?: string[] }>;
  remedies?: string[];
  smartPlan?: {
    quarters?: Array<{ label: string; focus: string[]; checkpoints: string[]; upskill: { topic: string; cadence: string } }>;
    micro?: Array<{ fromISO: string; toISO: string; label: string; action: string; why: string[]; do: string[]; score: number }>;
    negotiationTips?: string[];
    visibilityTips?: string[];
  };
  opportunityByAD?: Array<{
    label: string;
    fromISO: string;
    toISO: string;
    sub: Array<{ fromISO: string; toISO: string; tag: string }>;
  }>;
  copy?: {
    answer?: string;
    how?: string;
    windowLines?: string[];
    planIntro?: string;
    quarters?: string[];
    micro?: string[];
  };
};

/* ------------------------------ Utils ------------------------------ */
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—");

function Card({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-4">
      {title && <div className="font-medium mb-2">{title}</div>}
      {children}
    </div>
  );
}

export function QARich({ data, question }: { data: QAResponse | any; question?: string }) {
  if (!data || data.ok === false) {
    return (
      <Card title="No data">
        <div className="text-sm text-gray-600">{data?.error || "Result not available."}</div>
      </Card>
    );
  }

  const windows = Array.isArray(data.windows) ? data.windows : [];
  const guidance = Array.isArray(data.guidance) ? data.guidance : [];
  const checklist = Array.isArray(data.checklist) ? data.checklist : [];
  const opp = Array.isArray(data.opportunityByAD) ? data.opportunityByAD : [];
  const plan = data.smartPlan || {};
  const copy = data.copy || {};

  return (
    <div className="space-y-4">
      {/* Title / Question */}
      <Card title={data.title || "Q&A Result"}>
        {question && <div className="text-sm text-gray-600 mt-1">Q: {question}</div>}
        {copy.answer && <div className="prose prose-sm mt-2" dangerouslySetInnerHTML={{ __html: copy.answer.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />}
      </Card>

      {/* Why / How */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Why this works">
          <ul className="list-disc pl-5 text-sm">
            {(copy.windowLines || []).map((l, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: l.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            ))}
            {!copy.windowLines?.length && <li className="text-gray-500">Engine did not surface sub-lines.</li>}
          </ul>
        </Card>
        <Card title="How to use this period">
          <ul className="list-disc pl-5 text-sm">
            {copy.how ? copy.how.split(";").map((x, i) => <li key={i}>{x.trim()}</li>) : <li className="text-gray-500">Keep execution steady; avoid impulsive switches.</li>}
          </ul>
        </Card>
      </div>

      {/* Opportunity windows (by AD) with sub-windows */}
      {opp.length > 0 && (
        <Card title="Opportunity windows (by AD)">
          <div className="space-y-3">
            {opp.map((o, i) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="text-sm font-medium">
                  {o.label} <span className="text-gray-500">({fmt(o.fromISO)} → {fmt(o.toISO)})</span>
                </div>
                {Array.isArray(o.sub) && o.sub.length > 0 && (
                  <ul className="mt-2 grid md:grid-cols-3 gap-2">
                    {o.sub.map((s, j) => (
                      <li key={j} className="text-sm rounded border p-2">
                        <div className="font-medium">{s.tag}</div>
                        <div className="text-xs text-gray-600">{fmt(s.fromISO)} → {fmt(s.toISO)}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main windows */}
      {windows.length > 0 && (
        <Card title="Your best windows">
          <div className="space-y-3">
            {windows.map((w, i) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="text-sm font-medium">
                  {fmt(w.fromISO)} → {fmt(w.toISO)} — {w.tag}
                </div>
                {w.why?.length ? (
                  <div className="mt-1">
                    <div className="text-xs text-gray-500">Why</div>
                    <ul className="list-disc pl-5 text-sm">
                      {w.why.map((x, k) => <li key={k}>{x}</li>)}
                    </ul>
                  </div>
                ) : null}
                {w.do?.length ? (
                  <div className="mt-1">
                    <div className="text-xs text-gray-500">Do</div>
                    <ul className="list-disc pl-5 text-sm">
                      {w.do.map((x, k) => <li key={k}>{x}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quarterly plan */}
      {Array.isArray(plan.quarters) && plan.quarters.length > 0 && (
        <Card title="Quarterly plan (what to do when)">
          <div className="text-sm text-gray-700 mb-2">{copy.planIntro || "Quarterly compass"}</div>
          <div className="space-y-3">
            {plan.quarters.map((q: any, i: number) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="text-sm font-medium">{q.label}</div>
                <div className="text-xs text-gray-600 mt-1">{q.focus?.join(" • ") || "steady pipeline"}</div>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {q.checkpoints?.map((c: string, k: number) => <li key={k}>{c}</li>)}
                </ul>
                {q.upskill?.topic && (
                  <div className="text-xs text-gray-600 mt-1">
                    Upskill: <span className="font-medium">{q.upskill.topic}</span> — {q.upskill.cadence}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Guidance + Checklist */}
      {(guidance.length > 0 || checklist.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {guidance.length > 0 && (
            <Card title="Guidance">
              <ul className="list-disc pl-5 text-sm">
                {guidance.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </Card>
          )}
          {checklist.length > 0 && (
            <Card title="Checklist">
              <ul className="list-disc pl-5 text-sm">
                {checklist.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Remedies / Tips */}
      {Array.isArray(data.remedies) && data.remedies.length > 0 && (
        <Card title="Remedies / Tips">
          <ul className="list-disc pl-5 text-sm">
            {data.remedies.map((r: string, i: number) => <li key={i}>{r}</li>)}
          </ul>
        </Card>
      )}
    </div>
  );
}
