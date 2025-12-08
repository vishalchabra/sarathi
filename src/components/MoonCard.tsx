// src/components/MoonCard.tsx
"use client";

import * as React from "react";
// Make sure MoonPack exists in your types (planet, natal, features, scores, windows, explain, remedies)
import type { MoonPack } from "@/server/astro/types";

export function MoonCard({ data }: { data: MoonPack }) {
  const { natal, features, scores, windows, explain, remedies } = data;

  return (
    <div className="p-4 rounded-xl shadow bg-white space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          🌙 Moon — {natal.sign} • House {natal.house}
          {natal.nak ? ` • ${natal.nak.name} (p${natal.nak.pada})` : ""}
        </h2>
      </header>

      {/* Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Score label="Mind" value={scores.mind} />
        <Score label="Emotions" value={scores.emotions} />
        <Score label="Relationships" value={scores.relationships} />
        <Score label="Public" value={scores.public} />
      </div>

      {/* Features */}
      <div className="text-sm text-gray-700 space-y-1">
        {features.yogas?.length > 0 && (
          <p><b>Yogas:</b> {features.yogas.join(", ")}</p>
        )}
        {features.conjunctions?.length > 0 && (
          <p><b>Conjunctions:</b> {features.conjunctions.join(", ")}</p>
        )}
        {features.clusters?.length > 0 && (
          <p><b>Clusters:</b> {features.clusters.join("; ")}</p>
        )}
        {features.aspects_on_moon?.length > 0 && (
          <p><b>Aspected by:</b> {features.aspects_on_moon.map(a => `${a.from} (${a.kind})`).join(", ")}</p>
        )}
      </div>

      {/* Windows (hook when you add timing) */}
      {windows?.length > 0 && (
        <section className="text-sm">
          <h3 className="font-semibold">Windows</h3>
          <ul className="list-disc pl-5">
            {windows.map((w, i) => (
              <li key={i}>
                <b>{w.from} → {w.to}</b> — {w.label} (conf {Math.round(w.confidence * 100)}%)
                {w.hits?.length ? ` • hits: ${w.hits.join(", ")}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Why / Remedies */}
      {explain?.length > 0 && (
        <details>
          <summary className="cursor-pointer select-none">Why</summary>
          <ul className="list-disc pl-5">
            {explain.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </details>
      )}

      {remedies?.length > 0 && (
        <details>
          <summary className="cursor-pointer select-none">Remedies</summary>
          <ul className="list-disc pl-5">
            {remedies.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </details>
      )}
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="h-2 rounded bg-gray-200 overflow-hidden">
        <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
