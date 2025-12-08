import React from "react";

type ActionWindow = { fromISO: string; toISO: string; tag?: string; label?: string; origin?: string; score?: number };

type CopyBlock = {
  answer: string;
  how: string;
  quarters: string[];
  micro?: any[];
  house?: { line?: string; bullets?: string[] };
  exact?: { sub: { fromISO: string; toISO: string; tag: string }[]; peaks: string[] };
  remedies?: any;
  actionWindows?: ActionWindow[];
};

type QAResponse = {
  ok: boolean;
  title: string;
  topic: string;
  windows: ActionWindow[];
  copy: CopyBlock;
  remedies?: any;
  smartPlan?: any;
};

export default function QAResult({ data }: { data: QAResponse }) {
  const { copy } = data;

  return (
    <div className="space-y-6">
      {/* Short answer */}
      <div className="rounded-xl bg-gray-50 p-4 leading-relaxed">
        <div className="whitespace-pre-wrap">{copy.answer}</div>
      </div>

      {/* House lens (NEW) */}
      {(copy.house?.line || (copy.house?.bullets && copy.house?.bullets.length)) && (
        <section className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Chart lens</h3>
          {copy.house?.line && <p className="text-sm mb-2">{copy.house.line}</p>}
          {!!copy.house?.bullets?.length && (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {copy.house.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Exact sub-windows & peak dates (NEW) */}
      {copy.exact && (copy.exact.sub?.length || copy.exact.peaks?.length) ? (
        <section className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Exact sub-windows</h3>
          {!!copy.exact.sub?.length && (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {copy.exact.sub.map((s, i) => (
                <li key={i}>
                  {s.fromISO} → {s.toISO} — {s.tag}
                </li>
              ))}
            </ul>
          )}
          {!!copy.exact.peaks?.length && (
            <>
              <div className="h-2" />
              <h4 className="font-medium">Peak weekdays for negotiation</h4>
              <p className="text-sm">{copy.exact.peaks.join(" • ")}</p>
            </>
          )}
        </section>
      ) : null}

      {/* Action windows list (NEW) */}
      {!!copy.actionWindows?.length && (
        <section className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Top action windows</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {copy.actionWindows.map((w, i) => (
              <li key={i}>
                {w.fromISO} → {w.toISO} — {w.tag || w.label || "supportive"}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* How to use this */}
      {copy.how && (
        <section className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">How to use this</h3>
          <div className="whitespace-pre-wrap text-sm">{copy.how}</div>
        </section>
      )}

      {/* Quarterly plan */}
      {!!copy.quarters?.length && (
        <section className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Quarterly plan</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {copy.quarters.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Remedies (NEW) */}
      {copy.remedies && (
        <section className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Remedies</h3>
          {Array.isArray(copy.remedies) ? (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {copy.remedies.map((r: any, i: number) => (
                <li key={i}>{String(r)}</li>
              ))}
            </ul>
          ) : (
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(copy.remedies, null, 2)}</pre>
          )}
        </section>
      )}
    </div>
  );
}
