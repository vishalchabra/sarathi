// FILE: src/components/sarathi/CareerWindowCard.tsx
"use client";

import { useMemo } from "react";

type QAWindow = {
  label: "near" | "mid" | "late" | string;
  from: string | Date;
  to: string | Date;
  why: string[];
  score?: number;
};

type Props = {
  category?: "vehicle" | "job" | "property" | "relationships" | "disputes" | "transit";
  windows: QAWindow[];
  natalScore?: number; // 👈 raw number from backend (0..1)
};

function fmtRange(from: string | Date, to: string | Date) {
  const f = typeof from === "string" ? new Date(from) : from;
  const t = typeof to === "string" ? new Date(to) : to;
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  if (Number.isNaN(+f) || Number.isNaN(+t)) return "—";
  return `${fmt(f)} → ${fmt(t)}`;
}

function strengthBar(score?: number) {
  // Score can be any number; normalise to 1..5
  if (typeof score !== "number" || Number.isNaN(score)) return "🔹🔹🔹⚪⚪";
  // squash into 1–5 band
  const norm = Math.max(1, Math.min(5, Math.round(score / 4)));
  const full = "🔹".repeat(norm);
  const empty = "⚪".repeat(5 - norm);
  return full + empty;
}
function confidenceFromScore(score?: number) {
  if (typeof score !== "number" || Number.isNaN(score)) return undefined;
  if (score >= 0.75) return "high";
  if (score >= 0.5)  return "good";
  if (score >= 0.3)  return "moderate";
  return "low";
}

function labelPhrase(lbl: string) {
  if (lbl === "near") return "Near-term window";
  if (lbl === "mid") return "Mid-term window";
  if (lbl === "late") return "Later window";
  return "Window";
}

export function CareerWindowCard({ category = "job", windows, natalScore }: Props) {
  const confidence = confidenceFromScore(natalScore);

  const [primary, secondary] = useMemo(
    () => [windows[0] ?? null, windows[1] ?? null],
    [windows]
  );


  if (!primary) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/50">
          {category === "job" ? "Career window" : "Timing window"}
        </div>
        <div>No strong timing window detected in the current horizon.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
          {category === "job" ? "Career window" : "Timing window"}
        </div>
        {confidence && (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase text-white/70">
            Confidence: {confidence}
          </span>
        )}
      </div>

      <div className="mb-3 text-sm font-medium text-white">
        {category === "job"
          ? "When is a good time to switch or move up?"
          : "Best timing windows ahead"}
      </div>

      {/* Primary window */}
      <div className="mb-3 rounded-xl bg-white/5 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-semibold text-white/70">
            {labelPhrase(primary.label)}
          </div>
          <div className="text-xs text-white/50">
            {strengthBar(primary.score)}
          </div>
        </div>
        <div className="mt-1 text-sm font-medium text-white">
          {fmtRange(primary.from, primary.to)}
        </div>
        {primary.why && primary.why.length > 0 && (
          <div className="mt-1 text-xs text-white/70">
            <span className="font-semibold">Why:</span>{" "}
            {primary.why.join("; ")}
          </div>
        )}
        {category === "job" && (
          <div className="mt-2 text-xs text-white/70">
            <span className="font-semibold">Use it for:</span> interviews,
            visibility moves, serious conversations about role/comp.
          </div>
        )}
      </div>

      {/* Secondary window (optional) */}
      {secondary && (
        <div className="mb-3 rounded-xl border border-dashed border-white/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-semibold text-white/70">
              {labelPhrase(secondary.label)}
            </div>
            <div className="text-xs text-white/50">
              {strengthBar(secondary.score)}
            </div>
          </div>
          <div className="mt-1 text-sm font-medium text-white">
            {fmtRange(secondary.from, secondary.to)}
          </div>
          {secondary.why && secondary.why.length > 0 && (
            <div className="mt-1 text-xs text-white/70">
              <span className="font-semibold">Why:</span>{" "}
              {secondary.why.join("; ")}
            </div>
          )}
          {category === "job" && (
            <div className="mt-2 text-xs text-white/70">
              <span className="font-semibold">Use it for:</span> follow-up
              talks, finalising offers, or internal transitions.
            </div>
          )}
        </div>
      )}

      {/* Footer tip */}
      <div className="mt-1 text-xs text-white/50">
        Today: stack proof and close loose ends. Use these windows to{" "}
        <span className="font-semibold">step forward</span> instead of waiting
        to be picked.
      </div>
    </div>
  );
}

export default CareerWindowCard;
