"use client";

import React, { useMemo } from "react";

/** Normalize any dasha JSON shape into a consistent array */
function toISO(x: any): string | null {
  if (!x) return null;
  const s =
    x.start || x.from || x.begin || x.beg || x.s || x.Start || x.S || x.dateStart || x[0];
  const iso = typeof s === "string" ? s : typeof s === "number" ? new Date(s).toISOString() : null;
  return iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso).toISOString() : null;
}
function isoEnd(x: any): string | null {
  if (!x) return null;
  const e = x.end || x.to || x.finish || x.e || x.End || x.E || x.dateEnd || x[1];
  const iso = typeof e === "string" ? e : typeof e === "number" ? new Date(e).toISOString() : null;
  return iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso).toISOString() : null;
}
function label(x: any): string {
  return (x.planet || x.lord || x.name || x.p || x.Lord || x.P || "").toString();
}
function childrenOf(x: any): any[] {
  return (
    x.AD ||
    x.Ad ||
    x.antardashas ||
    x.sub ||
    x.children ||
    x.subPeriods ||
    x.antara ||
    x.ad ||
    []
  );
}
type Row = {
  label: string;
  start: string;
  end: string;
  AD: { label: string; start: string; end: string }[];
};

function normalize(dasha: any): Row[] {
  const raw: any[] =
    dasha?.MD ||
    dasha?.Md ||
    dasha?.main ||
    dasha?.mainPeriods ||
    dasha?.periods ||
    dasha?.Mahadashas ||
    dasha?.mahadasha ||
    dasha?.mahadashas ||
    dasha ||
    [];
  const rows: Row[] = [];
  for (const m of raw) {
    const s = toISO(m);
    const e = isoEnd(m);
    if (!s || !e) continue;
    const row: Row = { label: label(m), start: s, end: e, AD: [] };
    for (const a of childrenOf(m)) {
      const as = toISO(a);
      const ae = isoEnd(a);
      if (!as || !ae) continue;
      row.AD.push({ label: label(a), start: as, end: ae });
    }
    rows.push(row);
  }
  // sort by start
  rows.sort((a, b) => +new Date(a.start) - +new Date(b.start));
  return rows;
}

function fmt(d: string) {
  try {
    const dt = new Date(d);
    if (Number.isNaN(+dt)) return d;
    return dt.toISOString().slice(0, 10);
  } catch {
    return d;
  }
}

export default function DashaTimeline({ dasha }: { dasha: any }) {
  const rows = useMemo(() => normalize(dasha), [dasha]);

  const now = new Date();
  const { t0, t1 } = useMemo(() => {
    const starts = rows.map((r) => +new Date(r.start));
    const ends = rows.map((r) => +new Date(r.end));
    const min = Math.min(...(starts.length ? starts : [+now]));
    const max = Math.max(...(ends.length ? ends : [+now]));
    return { t0: min, t1: max };
  }, [rows, now]);

  const span = Math.max(1, t1 - t0);

  // Try to determine current MD/AD
  const current = useMemo(() => {
    let md: Row | null = null;
    let ad: Row["AD"][number] | null = null;
    for (const r of rows) {
      const s = +new Date(r.start);
      const e = +new Date(r.end);
      if (s <= +now && +now <= e) {
        md = r;
        for (const a of r.AD) {
          const as = +new Date(a.start);
          const ae = +new Date(a.end);
          if (as <= +now && +now <= ae) {
            ad = a;
            break;
          }
        }
        break;
      }
    }
    return md ? { md, ad } : null;
  }, [rows, now]);

  return (
    <section className="rounded-xl border bg-white p-4" style={{ breakInside: "avoid" }}>
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">Vimshottari Timeline</h3>
        {current ? (
          <div className="text-sm text-gray-600">
            Current:&nbsp;
            <b>{current.md.label}</b>
            {current.ad ? <> / <b>{current.ad.label}</b></> : null}
          </div>
        ) : (
          <div className="text-xs text-gray-500">No active period found</div>
        )}
      </div>

      {!rows.length ? (
        <div className="text-sm text-gray-500 mt-2">No dasha data.</div>
      ) : (
        <div className="mt-4 space-y-4">
          {rows.map((r, i) => {
            const s = +new Date(r.start);
            const e = +new Date(r.end);
            const leftPct = ((s - t0) / span) * 100;
            const widthPct = ((e - s) / span) * 100;
            const active = s <= +now && +now <= e;
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">
                    {r.label} <span className="text-xs text-gray-500">({fmt(r.start)} → {fmt(r.end)})</span>
                  </div>
                </div>
                <div className="relative h-3 bg-gray-100 rounded overflow-hidden">
                  <div
                    className={`absolute top-0 h-3 rounded ${active ? "bg-indigo-500" : "bg-gray-300"}`}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                </div>

                {r.AD?.length ? (
                  <div className="mt-2 grid grid-cols-12 gap-1">
                    {r.AD.map((a, j) => {
                      const as = +new Date(a.start);
                      const ae = +new Date(a.end);
                      const aw = Math.max(1, (ae - as) / Math.max(1, e - s)) * 100;
                      const aActive = as <= +now && +now <= ae;
                      return (
                        <div key={j} className="col-span-3 sm:col-span-2 md:col-span-1">
                          <div className={`h-2 ${aActive ? "bg-emerald-500" : "bg-gray-300"} rounded`} style={{ width: `${aw}%` }} />
                          <div className="text-[11px] mt-1">
                            <b>{a.label}</b> <span className="text-gray-500">{fmt(a.start)} → {fmt(a.end)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
