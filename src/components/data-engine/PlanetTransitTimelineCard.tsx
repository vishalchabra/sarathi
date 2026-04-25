"use client";

import { useMemo, useState } from "react";

type PlanetTimelineInterval = {
  from: string;
  to: string;
  sign?: string | null;
  nakshatra?: string | null;
  pada?: number | null;
  retrograde?: boolean | null;
};

type PlanetTransitTimelineResponse = {
  ok?: boolean;
  error?: string;
  planet?: string;
  fromDateISO?: string;
  toDateISO?: string;
  intervals?: PlanetTimelineInterval[];
};

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const VIEW_MODES = [
  { value: "rashiNakshatra", label: "Rashi + Nakshatra" },
  { value: "rashi", label: "Rashi only" },
  { value: "nakshatra", label: "Nakshatra only" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addMonthsISO(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  try {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
  } catch {}

  return String(value);
}

function formatMainLabel(row: PlanetTimelineInterval, viewMode: string) {
  const sign = row.sign ?? "—";
  const nak = row.nakshatra ?? "—";
  const pada = row.pada ? ` Pada ${row.pada}` : "";

  if (viewMode === "rashi") return sign;
  if (viewMode === "nakshatra") return `${nak}${pada}`;

  return `${sign} — ${nak}${pada}`;
}

export default function PlanetTransitTimelineCard({
  defaultTimezone = "Asia/Kolkata",
}: {
  defaultTimezone?: string;
}) {
  const [planet, setPlanet] = useState("Jupiter");
  const [fromDateISO, setFromDateISO] = useState(todayISO());
  const [toDateISO, setToDateISO] = useState(addMonthsISO(12));
  const [viewMode, setViewMode] = useState("rashiNakshatra");
  const [includeRetrograde, setIncludeRetrograde] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PlanetTransitTimelineResponse | null>(null);

  const intervals = useMemo(
    () => (Array.isArray(result?.intervals) ? result!.intervals! : []),
    [result]
  );

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/data-engine/planet-transit-timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planet,
          fromDateISO,
          toDateISO,
          timezone: defaultTimezone,
          viewMode,
          includeRetrograde,
        }),
      });

      const json = (await res.json()) as PlanetTransitTimelineResponse;

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to generate planet timeline.");
      }

      setResult(json);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function copyTimeline() {
    const lines = intervals.map((row) => {
      const retro = row.retrograde ? " retrograde" : "";
      return `${formatDate(row.from)} → ${formatDate(row.to)}: ${formatMainLabel(
        row,
        viewMode
      )}${retro}`;
    });

    navigator.clipboard?.writeText(lines.join("\n")).catch(() => {});
  }

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Planet Transit Timeline
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Find which rashi and nakshatra a planet occupies across any date range.
          </p>
        </div>

        {intervals.length ? (
          <button
            type="button"
            onClick={copyTimeline}
            className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Copy timeline
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Planet
          </label>
          <select
            value={planet}
            onChange={(e) => setPlanet(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
          >
            {PLANETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            From
          </label>
          <input
            type="date"
            value={fromDateISO}
            onChange={(e) => setFromDateISO(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            To
          </label>
          <input
            type="date"
            value={toDateISO}
            onChange={(e) => setToDateISO(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            View
          </label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
          >
            {VIEW_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-xl bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Timeline"}
          </button>
        </div>
      </div>

      <label className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={includeRetrograde}
          onChange={(e) => setIncludeRetrograde(e.target.checked)}
          className="h-4 w-4 rounded border-[color:var(--border)]"
        />
        Include retrograde marker where available
      </label>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      {result && !intervals.length ? (
        <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-white px-4 py-6 text-center text-sm text-slate-500">
          No timeline intervals found for this range.
        </div>
      ) : null}

      {intervals.length ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-[color:var(--border)] text-left text-slate-600">
                <th className="px-4 py-3 font-semibold">Period</th>
                <th className="px-4 py-3 font-semibold">Position</th>
                <th className="px-4 py-3 font-semibold">Motion</th>
              </tr>
            </thead>
            <tbody>
              {intervals.map((row, idx) => (
                <tr
                  key={`${row.from}-${row.to}-${idx}`}
                  className="border-b border-[color:var(--border)] last:border-b-0"
                >
                  <td className="px-4 py-3 text-slate-900">
                    {formatDate(row.from)} → {formatDate(row.to)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {formatMainLabel(row, viewMode)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {row.retrograde ? "Retrograde" : "Direct"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
