// FILE: /src/components/Report/StrengthSignatureV2.tsx
"use client";
import React from "react";
import {
  canonicalPlanets, sIdx, dignityLabel,
} from "@/lib/astro/canonical";

/**
 * Transparent scoring:
 * Exalted +2, Own +1.5, Friend +1, Neutral 0, Enemy -1, Debilitated -2.
 * Map planets => tracks, sum, then min/max scale to 0..100.
 */
const WEIGHTS: Record<string, ("career"|"wealth"|"relationships"|"health")[]> = {
  Sun: ["career"],
  Moon: ["relationships","health"],
  Mars: ["career","health"],
  Mercury: ["career","wealth"],
  Jupiter: ["career","wealth","relationships"],
  Venus: ["wealth","relationships"],
  Saturn: ["career","health"],
  Rahu: ["career","wealth"],
  Ketu: ["relationships","health"],
};

const SCORE_MAP: Record<string, number> = {
  "Exalted": 2, "Own sign": 1.5, "Friend sign": 1, "Neutral": 0, "Enemy sign": -1, "Debilitated": -2,
};

export default function StrengthSignatureV2({
  planets,
}: {
  planets: Record<string, any>;
}) {
  const P = canonicalPlanets(planets);
  const totals: Record<"career"|"wealth"|"relationships"|"health", number> =
    { career: 0, wealth: 0, relationships: 0, health: 0 };

  for (const [name, deg] of Object.entries(P)) {
    if (typeof deg !== "number" || !Number.isFinite(deg)) continue;
    const label = dignityLabel(name, sIdx(deg));
    const score = SCORE_MAP[label] ?? 0;
    for (const t of WEIGHTS[name] || []) totals[t] += score;
  }

  // normalize to 0..100 with plausible min/max
  const MIN = -8, MAX = 12; // loose bounds
  const toPct = (v: number) => Math.round((Math.max(MIN, Math.min(MAX, v)) - MIN) * 100 / (MAX - MIN));

  const rows = Object.entries(totals).map(([k, v]) => ({ k, pct: toPct(v) }));

  return (
    <section className="rounded-xl border bg-white p-4" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold mb-2">Strength Signature</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {rows.map(r => (
          <div key={r.k}>
            <div className="text-sm mb-1 capitalize">{r.k}</div>
            <div className="h-2 rounded bg-gray-100 overflow-hidden">
              <div className="h-2 bg-indigo-500" style={{ width: `${r.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Scores reflect dignity-weighted influence of relevant planets; scaled to 0–100.
      </p>
    </section>
  );
}
