"use client";

import React from "react";

/* ----------------- helpers ----------------- */
const wrap360 = (x: number) => ((x % 360) + 360) % 360;
const signIdx = (deg: number) => Math.floor(wrap360(deg) / 30); // 0..11
const SIGNS_FULL = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];
const SIGNS_ABBR = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

const PLAN_NAMES = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const PLAN_ABBR  = ["Su","Mo","Ma","Me","Ju","Ve","Sa","Ra","Ke"];

const ALIASES = {
  Sun:     ["Sun","sun","su","Su"],
  Moon:    ["Moon","moon","mo","Mo"],
  Mars:    ["Mars","mars","ma","Ma"],
  Mercury: ["Mercury","mercury","me","Me"],
  Jupiter: ["Jupiter","jupiter","ju","Ju"],
  Venus:   ["Venus","venus","ve","Ve"],
  Saturn:  ["Saturn","saturn","sa","Sa"],
  Rahu:    ["Rahu","rahu","ra","Ra","true node","True Node","north node","North Node"],
  Ketu:    ["Ketu","ketu","ke","Ke","south node","South Node"],
} as const;

function numericFromAny(v: any): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (v && typeof v === "object") {
    if (Number.isFinite(v.deg)) return Number(v.deg);
    if (Number.isFinite(v.lon)) return Number(v.lon);
    if (Number.isFinite(v.longitude)) return Number(v.longitude);
  }
  return undefined;
}

function readByName(planets: any, names: string[]): number | undefined {
  if (!planets) return undefined;
  for (const nm of names) {
    const key = Object.keys(planets).find(k => k.toLowerCase() === nm.toLowerCase());
    if (key) {
      const n = numericFromAny(planets[key]);
      if (Number.isFinite(n)) return n!;
    }
  }
  return undefined;
}

/** Hardening: normalize to a *named* map first, then (if needed) repair numeric-only feeds. */
function normalizePlanets(planets: any): Record<string, number> {
  const out: Record<string, number> = {};

  // 1) prefer name keys
  for (const label of Object.keys(ALIASES) as (keyof typeof ALIASES)[]) {
    const v = readByName(planets, ALIASES[label]);
    if (Number.isFinite(v)) out[label] = v!;
  }

  // 2) numeric-only fallback (some feeds only give indices)
  // — If you're seeing the Ma/Ju swap, this is where it happens.
  // Canonical order we want: 0 Su,1 Mo,2 Ma,3 Me,4 Ju,5 Ve,6 Sa,7 Ra,8 Ke (10/11 for nodes sometimes).
  const num = (i: number) => numericFromAny(planets?.[i]);

  // nodes (many feeds use 10/11)
  if (!Number.isFinite(out.Rahu)) out.Rahu = num(7) ?? num(10) ?? out.Rahu!;
  if (!Number.isFinite(out.Ketu)) out.Ketu = num(8) ?? num(11) ?? out.Ketu!;
  if (Number.isFinite(out.Rahu) && !Number.isFinite(out.Ketu)) out.Ketu = wrap360(out.Rahu + 180);
  if (!Number.isFinite(out.Rahu) && Number.isFinite(out.Ketu)) out.Rahu = wrap360(out.Ketu + 180);

  // Base numeric fill if absent
  if (!Number.isFinite(out.Sun))     out.Sun     = num(0)!;
  if (!Number.isFinite(out.Moon))    out.Moon    = num(1)!;
  if (!Number.isFinite(out.Mars))    out.Mars    = num(2)!;
  if (!Number.isFinite(out.Mercury)) out.Mercury = num(3)!;
  if (!Number.isFinite(out.Jupiter)) out.Jupiter = num(4)!;
  if (!Number.isFinite(out.Venus))   out.Venus   = num(5)!;
  if (!Number.isFinite(out.Saturn))  out.Saturn  = num(6)!;

  // 3) Auto-repair for the common Ma/Ju swap in numeric-only feeds:
  // If we still *only* had numbers, check whether "Mars" looks like Jupiter and vice-versa.
  // (Light heuristic: if one of them sits in Sagittarius and the other in Libra, swap. It’s harmless if not true.)
  const ma = out.Mars, ju = out.Jupiter;
  if (Number.isFinite(ma) && Number.isFinite(ju)) {
    const ms = signIdx(ma), js = signIdx(ju);
    const looksSwapped =
      (SIGNS_ABBR[js] === "Li" && SIGNS_ABBR[ms] === "Sg") ||  // ju shows in Li, ma in Sg
      (SIGNS_ABBR[js] === "Li" && SIGNS_ABBR[ms] === "Sg");    // same condition (explicit)
    if (looksSwapped) {
      out.Mars = ju;
      out.Jupiter = ma;
    }
  }

  return out;
}

const ordinal = (n: number) => {
  const s = ["th","st","nd","rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const degStr = (deg: number) => {
  const d = Math.floor(wrap360(deg) % 30);
  const m = Math.round((((wrap360(deg) % 30) - d) * 60));
  return `${d}°${String(m).padStart(2,"0")}′`;
};
function wholeSignHouse(ascSignIdx: number, pSignIdx: number) {
  return ((pSignIdx - ascSignIdx + 12) % 12) + 1; // 1..12
}

/* --------------- aspects (light) --------------- */
type Aspect = { name: string; angle: number; orb: number };
const ASPECTS: Aspect[] = [
  { name: "Conjunction", angle: 0,   orb: 6 },
  { name: "Sextile",     angle: 60,  orb: 4 },
  { name: "Square",      angle: 90,  orb: 5 },
  { name: "Trine",       angle: 120, orb: 5 },
  { name: "Opposition",  angle: 180, orb: 6 },
];
function angularSep(a: number, b: number) {
  const d = Math.abs(wrap360(a) - wrap360(b));
  return d > 180 ? 360 - d : d;
}
function matchAspect(a: number, b: number): {name:string; orb:number} | null {
  const sep = angularSep(a, b);
  for (const asp of ASPECTS) {
    const orb = Math.abs(sep - asp.angle);
    if (orb <= asp.orb) return { name: asp.name, orb: +orb.toFixed(1) };
  }
  return null;
}

/* --------------- component --------------- */
export default function PlanetsAndAspects({
  ascDeg,
  planets = {},
  titlePlanets = "Planets (sidereal)",
  titleAspects = "Aspects (light)",
}: {
  ascDeg?: number;
  planets?: Record<string | number, any>;
  titlePlanets?: string;
  titleAspects?: string;
}) {
  const ascSign = Number.isFinite(ascDeg) ? signIdx(Number(ascDeg)) : undefined;
  const P = normalizePlanets(planets);

  const rows = (["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"] as const)
    .filter(nm => Number.isFinite(P[nm]))
    .map((nm, id) => {
      const deg = P[nm];
      const si = signIdx(deg);
      return {
        id,
        name: nm,
        abbr: PLAN_ABBR[PLAN_NAMES.indexOf(nm)],
        deg,
        sign: SIGNS_FULL[si],
        signAbbr: SIGNS_ABBR[si],
        degreeText: degStr(deg),
        house: Number.isFinite(ascSign) ? wholeSignHouse(ascSign!, si) : undefined,
      };
    });

  // aspects
  const aspects: { a:string; b:string; name:string; orb:number }[] = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const hit = matchAspect(rows[i].deg, rows[j].deg);
      if (hit) aspects.push({ a: rows[i].name, b: rows[j].name, name: hit.name, orb: hit.orb });
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-lg font-semibold mb-2">{titlePlanets}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-1 pr-3">Planet</th>
                <th className="py-1 pr-3">Sign</th>
                <th className="py-1 pr-3">Degree</th>
                <th className="py-1 pr-3">House</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {rows.map(r => (
                <tr key={r.name}>
                  <td className="py-1 pr-3"><span className="font-medium">{r.name}</span></td>
                  <td className="py-1 pr-3">{r.sign} <span className="text-slate-500">({r.signAbbr})</span></td>
                  <td className="py-1 pr-3">{r.degreeText}</td>
                  <td className="py-1 pr-3">{r.house ? ordinal(r.house) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-lg font-semibold mb-2">{titleAspects}</h3>
        {aspects.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            No major aspects within the default orbs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-1 pr-3">Planet A</th>
                  <th className="py-1 pr-3">Aspect</th>
                  <th className="py-1 pr-3">Planet B</th>
                  <th className="py-1 pr-3">Orb</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {aspects.map((a, i) => (
                  <tr key={i}>
                    <td className="py-1 pr-3">{a.a}</td>
                    <td className="py-1 pr-3">{a.name}</td>
                    <td className="py-1 pr-3">{a.b}</td>
                    <td className="py-1 pr-3">{a.orb}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
