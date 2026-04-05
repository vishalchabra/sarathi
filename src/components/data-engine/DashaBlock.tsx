"use client";

type Props = {
  current?: Record<string, any>;
  mdTimeline?: any[];
  adTimeline?: any[];
  pdTimeline?: any[];
};

function cardClass() {
  return "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
}

export default function DashaBlock({
  current,
  mdTimeline = [],
  adTimeline = [],
  pdTimeline = [],
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(current ?? {}).map(([key, value]) => (
          <div key={key} className={cardClass()}>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {key}
            </div>
            <div className="mt-1 text-sm text-slate-900">
              {String(value ?? "—")}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className={cardClass()}>
          <h2 className="text-base font-semibold text-slate-950">MD Timeline</h2>
          <div className="mt-4 space-y-3">
            {mdTimeline.length ? (
              mdTimeline.map((row: any, idx: number) => (
                <div key={idx} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-sm font-medium text-slate-900">
                    {row.lord ?? "—"}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {row.startISO ?? "—"} → {row.endISO ?? "—"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No data</div>
            )}
          </div>
        </div>

        <div className={cardClass()}>
          <h2 className="text-base font-semibold text-slate-950">
            AD in Current MD
          </h2>
          <div className="mt-4 space-y-3">
            {adTimeline.length ? (
              adTimeline.map((row: any, idx: number) => (
                <div key={idx} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-sm font-medium text-slate-900">
                    {row.lord ?? "—"}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {row.startISO ?? "—"} → {row.endISO ?? "—"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No data</div>
            )}
          </div>
        </div>

        <div className={cardClass()}>
          <h2 className="text-base font-semibold text-slate-950">
            PD in Current AD
          </h2>
          <div className="mt-4 space-y-3">
            {pdTimeline.length ? (
              pdTimeline.map((row: any, idx: number) => (
                <div key={idx} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-sm font-medium text-slate-900">
                    {row.lord ?? "—"}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {row.startISO ?? "—"} → {row.endISO ?? "—"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}