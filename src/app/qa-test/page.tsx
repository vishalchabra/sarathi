"use client";

import { useState } from "react";

export default function QATest() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  async function run() {
    try {
      setLoading(true);
      setErr(null);
      const r = await fetch("/api/qa?v=qa-route-2025-10-18b", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        next: { revalidate: 0 },
        body: JSON.stringify({
          query: "when will I change my job with increment",
          profile: {},
        }),
      });
      const j = await r.json();
      setData(j);
    } catch (e: any) {
      setErr(e?.message || "request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={run}
        className="px-3 py-2 rounded bg-black text-white hover:opacity-90"
      >
        Run QA
      </button>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && data && (
        <div className="space-y-6">
          {/* show version so we know it's the new API */}
          <p className="text-xs text-gray-500">
            API version: {data?.meta?.version || "(none)"}
          </p>

          {/* short answer */}
          <div className="rounded-xl bg-gray-50 p-4 leading-relaxed whitespace-pre-wrap">
            {data?.copy?.answer || "(no answer text)"}
          </div>

          {/* chart lens */}
          {(data?.copy?.house?.line ||
            (data?.copy?.house?.bullets &&
              data.copy.house.bullets.length > 0)) && (
            <section className="rounded-xl border p-4">
              <h3 className="font-semibold mb-2">Chart lens</h3>
              {data.copy.house?.line && (
                <p className="text-sm mb-2">{data.copy.house.line}</p>
              )}
              {!!data.copy.house?.bullets?.length && (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {data.copy.house.bullets.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* exact sub-windows + peaks */}
          {data?.copy?.exact && (
            <section className="rounded-xl border p-4">
              <h3 className="font-semibold mb-2">Exact sub-windows</h3>
              {!!data.copy.exact?.sub?.length && (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {data.copy.exact.sub.map((s: any, i: number) => (
                    <li key={i}>
                      {s.fromISO} → {s.toISO} — {s.tag}
                    </li>
                  ))}
                </ul>
              )}
              {!!data.copy.exact?.peaks?.length && (
                <p className="text-sm mt-2">
                  <strong>Peak weekdays:</strong>{" "}
                  {data.copy.exact.peaks.join(" • ")}
                </p>
              )}
            </section>
          )}

          {/* top action windows */}
          {!!data?.copy?.actionWindows?.length && (
            <section className="rounded-xl border p-4">
              <h3 className="font-semibold mb-2">Top action windows</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {data.copy.actionWindows.map((w: any, i: number) => (
                  <li key={i}>
                    {w.fromISO} → {w.toISO} — {w.tag || w.label || "supportive"}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* how to use this */}
          {data?.copy?.how && (
            <section className="rounded-xl border p-4">
              <h3 className="font-semibold mb-2">How to use this</h3>
              <div className="whitespace-pre-wrap text-sm">{data.copy.how}</div>
            </section>
          )}

          {/* quarterly plan */}
          {!!data?.copy?.quarters?.length && (
            <section className="rounded-xl border p-4">
              <h3 className="font-semibold mb-2">Quarterly plan</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {data.copy.quarters.map((q: string, i: number) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </section>
          )}

          {/* remedies */}
          {data?.copy?.remedies && (
            <section className="rounded-xl border p-4">
              <h3 className="font-semibold mb-2">Remedies</h3>
              {Array.isArray(data.copy.remedies) ? (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {data.copy.remedies.map((r: any, i: number) => (
                    <li key={i}>{String(r)}</li>
                  ))}
                </ul>
              ) : (
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(data.copy.remedies, null, 2)}
                </pre>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
