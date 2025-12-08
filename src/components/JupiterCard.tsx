"use client";
import * as React from "react";

export function JupiterCard({ data }: { data: any }) {
  const { natal, features, scores, windows, explain, remedies } = data || {};

  return (
    <div className="p-4 rounded-xl shadow bg-white space-y-3">
      <h2 className="text-xl font-bold">
        ♃ Jupiter — {natal?.sign} • House {natal?.house}
        {natal?.nak ? ` • ${natal.nak.name} (p${natal.nak.pada})` : ""}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Score label="Wisdom" value={scores?.wisdom ?? 0} />
        <Score label="Dharma" value={scores?.dharma ?? 0} />
        <Score label="Wealth" value={scores?.wealth ?? 0} />
        <Score label="Faith" value={scores?.faith ?? 0} />
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        {features?.yogas?.length > 0 && <p><b>Yogas:</b> {features.yogas.join(", ")}</p>}
        {features?.conjunctions?.length > 0 && <p><b>Conjunctions:</b> {features.conjunctions.join(", ")}</p>}
        {features?.clusters?.length > 0 && <p><b>Clusters:</b> {features.clusters.join("; ")}</p>}
        {features?.aspects_on_jupiter?.length > 0 && (
          <p><b>Aspected by:</b> {features.aspects_on_jupiter.map((a: any) => `${a.from} (${a.kind})`).join(", ")}</p>
        )}
      </div>

      {windows?.length > 0 && (
        <section className="text-sm">
          <h3 className="font-semibold">Windows</h3>
          <ul className="list-disc pl-5">
            {windows.map((w: any, i: number) => (
              <li key={i}>
                <b>{w.from} → {w.to}</b> — {w.label} (conf {Math.round((w.confidence ?? 0) * 100)}%)
                {w.hits?.length ? ` • hits: ${w.hits.join(", ")}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(explain) && explain.length > 0 && (
        <details>
          <summary className="cursor-pointer select-none">Why</summary>
          <ul className="list-disc pl-5">{explain.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul>
        </details>
      )}

      {Array.isArray(remedies) && remedies.length > 0 && (
        <details>
          <summary className="cursor-pointer select-none">Remedies</summary>
          <ul className="list-disc pl-5">{remedies.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul>
        </details>
      )}
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{v}</div>
      <div className="h-2 rounded bg-gray-200 overflow-hidden">
        <div className="h-full" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
