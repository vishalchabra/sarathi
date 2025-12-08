"use client";
import * as React from "react";
import type { MarsPack } from "@/server/astro/types";

export function MarsCard({ data }: { data: MarsPack }) {
  const { natal, features, scores, windows, explain, remedies } = data;

  return (
    <div className="p-4 rounded-xl shadow bg-white space-y-3">
      <h2 className="text-xl font-bold">
        ♂ Mars — {natal.sign} • House {natal.house}
        {natal.nak ? ` • ${natal.nak.name} (p${natal.nak.pada})` : ""}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Score label="Drive" value={scores.drive} />
        <Score label="Courage" value={scores.courage} />
        <Score label="Conflict" value={scores.conflict} />
        <Score label="Health" value={scores.health} />
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        {features.yogas?.length > 0 && <p><b>Yogas:</b> {features.yogas.join(", ")}</p>}
        {features.conjunctions?.length > 0 && <p><b>Conjunctions:</b> {features.conjunctions.join(", ")}</p>}
        {features.clusters?.length > 0 && <p><b>Clusters:</b> {features.clusters.join("; ")}</p>}
        {features.aspects_on_mars?.length > 0 && (
          <p><b>Aspected by:</b> {features.aspects_on_mars.map(a => `${a.from} (${a.kind})`).join(", ")}</p>
        )}
      </div>

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

      {explain?.length > 0 && (
        <details>
          <summary className="cursor-pointer select-none">Why</summary>
          <ul className="list-disc pl-5">{explain.map((x,i) => <li key={i}>{x}</li>)}</ul>
        </details>
      )}

      {remedies?.length > 0 && (
        <details>
          <summary className="cursor-pointer select-none">Remedies</summary>
          <ul className="list-disc pl-5">{remedies.map((x,i) => <li key={i}>{x}</li>)}</ul>
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
