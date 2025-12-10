// src/app/sarathi/chat/page.tsx
"use client";

import { useEffect, useState } from "react";
import { loadBirthProfile, type BirthProfile } from "@/lib/birth-profile";
// Temporary stub until we build a proper ChatSuggestions component or move UI to /components
const ChatSuggestions: React.FC<{ onPick: (q: string) => void }> = () => null;

/* Types from your code (kept) */
type QAResponse = {
  answer: {
    text: string;
    confidence: "Low" | "Medium" | "High";
    actions?: string[];
    headline?: string;
    summary?: string;
  };
  why: {
    facts: string[];
    rules: string[];
    warnings?: string[];
  };
  context: {
    panchang?: { tithi?: string; nakshatra?: string; sunrise?: string; sunset?: string };
    hits?: Array<{ planet?: string; target?: string; orb?: number; name?: string; note?: string; orbDays?: number; exact?: string }>;
    windows?: Array<{ planet: string; target: string; start: string; peak: string; end: string; minOrb: number }>;
    dasha?: { md?: string; ad?: string };
  };
};
type HistMsg = { id: string; role: "user" | "assistant"; content: string; ts: number };

/* Helpers (kept) */
function gcalLink(w: { planet: string; target: string; start: string; end: string; peak: string }) {
  const title = encodeURIComponent(`${w.planet} → ${w.target} (Peak ${w.peak})`);
    const startDay = (w.start ?? "").slice(0, 10).replace(/-/g, "");
  const endDay = (w.end ?? "").slice(0, 10).replace(/-/g, "");

  const startZ = `${startDay}T090000Z`;
  const endZ = `${endDay || startDay}T100000Z`;
  const details = encodeURIComponent("Transit window tracked by Sārathi.");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startZ}/${endZ}&details=${details}`;
}
async function remindServer(w: { planet: string; target: string; start: string; peak: string }) {
  try {
    await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${w.planet} → ${w.target} (peak ${w.peak})`,
        fireAtISO: `${w.start}T09:00:00`,
        meta: { kind: "transit_window", window: w },
      }),
    });
  } catch {}
}
async function remindClient(w: { planet: string; target: string; start: string; peak: string }) {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const perm = await (window as any).Notification.requestPermission();
    if (perm !== "granted") return;
    const fireAt = new Date(`${w.start}T09:00:00`);
    const delay = Math.max(0, fireAt.getTime() - Date.now());
    window.setTimeout(() => {
      new (window as any).Notification("Sārathi Reminder", {
        body: `${w.planet} → ${w.target} begins today (peak ${w.peak}).`,
      });
    }, delay);
    alert("Reminder scheduled on this device.");
  } catch {}
}

/* Component */
export default function Page() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<QAResponse | null>(null);

  const [history, setHistory] = useState<HistMsg[]>([]);
  useEffect(() => {
    fetch("/api/qa?limit=6")
      .then((r) => r.json())
      .then((j) => setHistory(j.history ?? []))
      .catch(() => {});
  }, []);

  const [openWinIdx, setOpenWinIdx] = useState<number | null>(null);

  const [profile, setProfile] = useState<BirthProfile | null>(null);
  useEffect(() => {
    setProfile(loadBirthProfile());
  }, []);

  const facts = resp?.why?.facts ?? [];
  const rules = resp?.why?.rules ?? [];
  const warnings = resp?.why?.warnings ?? [];

  const ctx = resp?.context ?? {};
  const p = ctx.panchang ?? {};

  const headlineSafe = (resp?.answer?.headline ?? "").trim() || "Guidance";
  const summarySafe = (resp?.answer?.summary ?? "").trim();
  const answerText = (resp?.answer?.text ?? "").trim() || `${headlineSafe}\n\n${summarySafe}`.trim();

  const send = async (text?: string) => {
    const message = (text ?? msg).trim();
    if (!message) return;
    setLoading(true);
    setResp(null);
    setOpenWinIdx(null);

    try {
      const birth = profile
        ? {
            dobISO: profile.dobISO,
            tob: profile.tob,
            chart: {
              houseOf: profile.venusHouse ? { Venus: profile.venusHouse } : undefined,
              fourthLord: profile.fourthLord,
            },
          }
        : undefined;

      const place = profile?.place;

      const r = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, birth, place }),
      });

      const raw = (await r.json()) as any;
      const normalized: QAResponse = {
        ...raw,
        answer: {
          text:
            (raw?.answer?.text ?? "").trim() ||
            `${(raw?.answer?.headline ?? "").trim() || "Guidance"}\n\n${(raw?.answer?.summary ?? "").trim()}`.trim(),
          confidence: raw?.answer?.confidence ?? "Low",
          actions: raw?.answer?.actions ?? [],
          headline: raw?.answer?.headline,
          summary: raw?.answer?.summary,
        },
        why: {
          facts: raw?.why?.facts ?? [],
          rules: raw?.why?.rules ?? [],
          warnings: raw?.why?.warnings ?? [],
        },
        context: raw?.context ?? raw?.facts ?? {},
      };

      setResp(normalized);

      void fetch("/api/qa?limit=6")
        .then((r2) => r2.json())
        .then((j) => setHistory(j.history ?? []))
        .catch(() => {});
    } catch (e) {
      console.error(e);
      setResp({
        answer: { text: "Something went wrong. Please try again.", confidence: "Low" },
        why: { facts: [], rules: [], warnings: [] },
        context: {},
      } as any);
    } finally {
      setLoading(false);
    }
  };

  const remind = async (w: { planet: string; target: string; start: string; peak: string }) => {
    await remindServer(w);
    await remindClient(w);
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Sārathi – Chat</h1>

      {/* Recent */}
      {history.length > 0 && (
        <section className="rounded-xl border p-4">
          <div className="text-sm uppercase text-slate-500 mb-2">Recent</div>
          <div className="space-y-2 text-sm">
            {history.map((h) => (
              <div key={h.id} className="flex gap-2">
                <div className={`px-2 py-1 rounded-md ${h.role === "user" ? "bg-slate-100" : "bg-emerald-50"}`}>
                  <span className="font-medium">{h.role === "user" ? "You" : "Sārathi"}:</span> {h.content}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="Ask anything… e.g., When is a good window for career moves?"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={() => send()}
          disabled={loading || !msg.trim()}
          className="rounded-lg border px-4 py-2 bg-black text-white disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </div>

      {/* Suggestions */}
      <ChatSuggestions onPick={(q) => { setMsg(q); void send(q); }} />

      {/* Answer */}
      {resp && (
        <section className="grid gap-6 sm:grid-cols-3">
          {/* Left: Answer */}
          <div className="sm:col-span-2 rounded-xl border p-4 space-y-3">
            <div className="text-sm uppercase text-slate-500">Answer</div>
            <div className="whitespace-pre-wrap leading-relaxed">{answerText}</div>
            <div className="text-xs text-slate-500">
              Confidence: <span className="font-medium">{resp.answer.confidence}</span>
            </div>
            {resp.answer.actions?.length ? (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {resp.answer.actions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            ) : null}
          </div>

          {/* Right: Context */}
          <div className="space-y-3">
            <div className="rounded-xl border p-4">
              <div className="text-sm uppercase text-slate-500 mb-1">Why</div>
              {!!(resp.why?.facts?.length) && (
                <>
                  <div className="text-xs text-slate-500">Facts</div>
                  <ul className="list-disc pl-5 text-sm">
                    {resp.why.facts.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </>
              )}
              {!!(resp.why?.rules?.length) && (
                <>
                  <div className="text-xs text-slate-500 mt-2">Rules</div>
                  <ul className="list-disc pl-5 text-sm">
                    {resp.why.rules.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </>
              )}
              {!!(resp.why?.warnings?.length) && (
                <>
                  <div className="text-xs text-slate-500 mt-2">Warnings</div>
                  <ul className="list-disc pl-5 text-sm">
                    {resp.why.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </>
              )}
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-sm uppercase text-slate-500 mb-1">Today’s Panchang</div>
              <div className="text-sm">
                <div>Tithi: {ctx.panchang?.tithi ?? "—"}</div>
                <div>Nakshatra: {ctx.panchang?.nakshatra ?? "—"}</div>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-sm uppercase text-slate-500 mb-1">Dasha</div>
              <div className="text-sm">
                {ctx.dasha?.md ? `MD: ${ctx.dasha.md}` : "—"}
                {ctx.dasha?.ad ? ` • AD: ${ctx.dasha.ad}` : ""}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
