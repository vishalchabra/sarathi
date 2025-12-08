"use client";

import React from "react";

type DashaSpan = {
  lord?: string;      // e.g. "Rahu"
  planet?: string;    // sometimes libraries use "planet"
  name?: string;      // or "name"
  start: string;      // ISO date
  end: string;        // ISO date
  AD?: DashaSpan[];   // optional nested antardashas
};

type Dasha = {
  MD?: DashaSpan[];                 // primary
  md?: DashaSpan[];
  mahadasha?: DashaSpan[];
  AD?: DashaSpan[];                 // global list
  ad?: DashaSpan[];
  ADByMD?: Record<string, DashaSpan[]>; // keyed by mahadasha lord
  current?: { mahadasha?: string; antardasha?: string };
};

function getName(x: Partial<DashaSpan>) {
  return (x.lord || x.planet || x.name || "").trim();
}
function toDate(s: string) {
  const d = new Date(s);
  return Number.isFinite(d.valueOf()) ? d : new Date(NaN);
}
function pct(x: number) {
  return `${Math.max(0, Math.min(100, x))}%`;
}

/** normalize MD list, regardless of returned shape */
function getMD(d: Partial<Dasha>): DashaSpan[] {
  const md = d.MD || d.md || d.mahadasha || [];
  return (md || []).filter((x: any) => x && x.start && x.end);
}

/** attempt to fetch ADs for a given MD segment */
function getADsFor(md: DashaSpan, d: Partial<Dasha>): DashaSpan[] {
  // 1) nested on segment
  if (Array.isArray(md.AD) && md.AD.length) return md.AD;

  const lord = getName(md);
  // 2) map keyed by lord
  if (d.ADByMD && lord && Array.isArray(d.ADByMD[lord]) && d.ADByMD[lord]!.length) {
    return d.ADByMD[lord]!;
  }

  // 3) global AD array filtered by time window overlap
  const allAD = (d.AD || d.ad || []) as DashaSpan[];
  if (!allAD.length) return [];

  const ms0 = toDate(md.start).getTime();
  const ms1 = toDate(md.end).getTime();

  return allAD.filter((ad) => {
    const a0 = toDate(ad.start).getTime();
    const a1 = toDate(ad.end).getTime();
    return Number.isFinite(a0) && Number.isFinite(a1) && a1 > ms0 && a0 < ms1;
  });
}

export default function DashaTimeline({ dasha }: { dasha: Dasha | undefined }) {
  const md = getMD(dasha || {});
  if (!md.length) {
    return (
      <section className="rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-lg font-semibold mb-2">Dasha Timeline</h3>
        <div className="text-sm text-gray-500 dark:text-slate-400">No dasha data.</div>
      </section>
    );
  }

  const start = toDate(md[0].start).getTime();
  const end = toDate(md[md.length - 1].end).getTime();
  const span = Math.max(1, end - start);

  const horizonStr = `Horizon ~${Math.round(span / (365.25 * 24 * 3600 * 1000))}y | ${
    md[0].start?.slice(0, 10)
  } → ${md[md.length - 1].end?.slice(0, 10)}`;

  return (
    <section className="rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Dasha Timeline</h3>
        <small className="text-gray-500 dark:text-slate-400">{horizonStr}</small>
      </div>

      {/* MD row */}
      <div className="w-full rounded overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="relative h-9">
          {md.map((m, i) => {
            const m0 = toDate(m.start).getTime();
            const m1 = toDate(m.end).getTime();
            const left = ((m0 - start) / span) * 100;
            const width = ((m1 - m0) / span) * 100;
            const label = getName(m) || "MD";
            return (
              <div
                key={`md-${i}`}
                className="absolute top-0 bottom-0 border-r last:border-r-0 border-white/50 dark:border-slate-800/60 bg-indigo-400/40"
                style={{ left: pct(left), width: pct(width) }}
                title={`${label}: ${m.start?.slice(0, 10)} → ${m.end?.slice(0, 10)}`}
              >
                <div className="text-[11px] leading-9 text-center truncate px-1">{label}</div>
              </div>
            );
          })}
        </div>

        {/* AD row */}
        <div className="relative h-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          {md.flatMap((m, mi) => {
            const ads = getADsFor(m, dasha || {});
            const m0 = toDate(m.start).getTime();
            return ads.map((ad, ai) => {
              const a0 = toDate(ad.start).getTime();
              const a1 = toDate(ad.end).getTime();
              const left = ((a0 - start) / span) * 100;
              const width = ((a1 - a0) / span) * 100;
              const label = getName(ad) || "AD";
              return (
                <div
                  key={`ad-${mi}-${ai}`}
                  className="absolute top-0 bottom-0 bg-indigo-500/25 border-r border-white/40 dark:border-slate-800/40"
                  style={{ left: pct(left), width: pct(width) }}
                  title={`${getName(m)} / ${label}: ${ad.start?.slice(0, 10)} → ${ad.end?.slice(0, 10)}`}
                >
                  <div className="text-[10px] leading-6 text-center truncate px-1">{label}</div>
                </div>
              );
            });
          })}
        </div>
      </div>
    </section>
  );
}
