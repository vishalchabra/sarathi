"use client";

import React, { useMemo } from "react";

type Row = {
  label: string;
  start: string;
  end: string;
  AD: { label: string; start: string; end: string }[];
};

function parseISO(x: any): string | null {
  if (!x) return null;
  const s =
    x.start || x.from || x.begin || x.beg || x.s || x.Start || x.S || x.dateStart || x[0];
  const iso = typeof s === "string" ? s : typeof s === "number" ? new Date(s).toISOString() : null;
  return iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso).toISOString() : null;
}
function parseEnd(x: any): string | null {
  if (!x) return null;
  const e = x.end || x.to || x.finish || x.e || x.End || x.E || x.dateEnd || x[1];
  const iso = typeof e === "string" ? e : typeof e === "number" ? new Date(e).toISOString() : null;
  return iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso).toISOString() : null;
}
function nameOf(x: any): string {
  return (x.planet || x.lord || x.name || x.p || x.Lord || x.P || "").toString();
}
function kids(x: any): any[] {
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
    const s = parseISO(m);
    const e = parseEnd(m);
    if (!s || !e) continue;
    const row: Row = { label: nameOf(m), start: s, end: e, AD: [] };
    for (const a of kids(m)) {
      const as = parseISO(a);
      const ae = parseEnd(a);
      if (!as || !ae) continue;
      row.AD.push({ label: nameOf(a), start: as, end: ae });
    }
    rows.push(row);
  }
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

export default function DashaTable({ dasha }: { dasha: any }) {
  const rows = useMemo(() => normalize(dasha), [dasha]);
  if (!rows.length) {
    return (
      <section className="rounded-xl border bg-white p-4" style={{ breakInside: "avoid" }}>
        <h3 className="text-lg font-semibold">Vimshottari Table</h3>
        <div className="text-sm text-gray-500 mt-1">No dasha data.</div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-4" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold mb-2">Vimshottari Table</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 pr-4">Mahadasha</th>
              <th className="py-2 pr-4">Start</th>
              <th className="py-2 pr-4">End</th>
              <th className="py-2">Antardashas</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 pr-4 font-medium">{r.label}</td>
                <td className="py-2 pr-4">{fmt(r.start)}</td>
                <td className="py-2 pr-4">{fmt(r.end)}</td>
                <td className="py-2">
                  {r.AD?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {r.AD.map((a, j) => (
                        <span key={j} className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1">
                          <b>{a.label}</b>
                          <span className="text-gray-500">{fmt(a.start)}→{fmt(a.end)}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
