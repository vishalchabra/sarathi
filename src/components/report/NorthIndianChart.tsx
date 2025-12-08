"use client";

import React from "react";

/* ---------- small helpers ---------- */
const wrap360 = (x: number) => ((x % 360) + 360) % 360;
const sIdx = (deg: number) => Math.floor(wrap360(deg) / 30); // 0..11
const SIGNS = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

const PLAN_ABBR: Record<number, string> = {
  0: "Su", 1: "Mo", 2: "Ma", 3: "Me", 4: "Ju", 5: "Ve", 6: "Sa", 7: "Ra", 8: "Ke",
};

// ✅ explicit ID → canonical key to avoid any object-key-order pitfalls
const ID_TO_KEY: Record<number, keyof typeof ALIASES> = {
  0: "Sun",
  1: "Moon",
  2: "Mars",
  3: "Mercury",
  4: "Jupiter",
  5: "Venus",
  6: "Saturn",
  7: "Rahu",
  8: "Ketu",
};

// accepted aliases per planet (numbers are handled separately)
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

function readByAliases(planets: any, id: number): number | undefined {
  if (!planets) return undefined;

  // numeric key direct (most of your app uses 0..8)
  if (Number.isFinite(planets[id])) return Number(planets[id]);

  // sometimes people keep alternate numeric keys for nodes
  if (id === 7 && Number.isFinite(planets[10])) return Number(planets[10]); // Rahu
  if (id === 8 && Number.isFinite(planets[11])) return Number(planets[11]); // Ketu

  // string keys (case-insensitive exact)
  const names = ALIASES[ID_TO_KEY[id]];
  for (const name of names) {
    const hit = Object.keys(planets).find(k => k.toLowerCase() === String(name).toLowerCase());
    if (hit && Number.isFinite(planets[hit])) return Number(planets[hit]);
  }

  return undefined;
}

function ensureNodes(planetsIn: Record<any, number>) {
  const out: Record<any, number> = { ...planetsIn };
  const has = (k: any) => Number.isFinite(out[k]);

  // map common alternates → 7/8
  if (!has(7)) {
    if (has("Rahu")) out[7] = Number(out["Rahu"]);
    else if (has("rahu")) out[7] = Number(out["rahu"]);
    else if (has(10)) out[7] = Number(out[10]);
  }
  if (!has(8)) {
    if (has("Ketu")) out[8] = Number(out["Ketu"]);
    else if (has("ketu")) out[8] = Number(out["ketu"]);
    else if (has(11)) out[8] = Number(out[11]);
  }

  if (has(7) && !has(8)) out[8] = wrap360(out[7] + 180);
  if (!has(7) && has(8)) out[7] = wrap360(out[8] + 180);
  return out;
}

const houseFrom = (ascSignIdx: number, pSignIdx: number) =>
  ((pSignIdx - ascSignIdx + 12) % 12) + 1; // 1..12

/* chip colors */
const CHIP_COLORS: Record<string,string> = {
  neutral:  "#0f172a",
  benefic:  "#155e75",
  malefic:  "#7f1d1d",
  node:     "#1f2937",
};
function chipColorFor(pid: number) {
  if (pid === 7 || pid === 8) return CHIP_COLORS.node;
  if (pid === 4 || pid === 5 || pid === 1) return CHIP_COLORS.benefic;
  if (pid === 2 || pid === 6) return CHIP_COLORS.malefic;
  return CHIP_COLORS.neutral;
}

/* ---------- component ---------- */
export default function NorthIndianChart({
  ascDeg,
  planets = {},
  size = 420,
  svgId = "north-chart-svg",
  showLegend = true,
}: {
  ascDeg?: number;
  planets?: Record<string | number, number>;
  size?: number;
  svgId?: string;
  showLegend?: boolean;
}) {
  if (!Number.isFinite(ascDeg)) {
    return <div className="text-sm text-gray-500">Ascendant missing; cannot draw chart.</div>;
  }

  const w = size;
  const cx = w / 2, cy = w / 2;
  const ascSign = sIdx(Number(ascDeg)); // 0..11

  type HData = { signIdx: number; sign: string; items: {pid:number; txt:string}[] };
  const houses: Record<number, HData> = {};
  for (let h = 1; h <= 12; h++) {
    const si = (ascSign + (h - 1)) % 12;
    houses[h] = { signIdx: si, sign: SIGNS[si], items: [] };
  }

  // ✅ robust planet reading (with node guarantee)
  const P = ensureNodes(planets);
  const ids = [0,1,2,3,4,5,6,7,8] as const;

  ids.forEach(pid => {
    const deg = readByAliases(P, pid);
    if (!Number.isFinite(deg)) return;
    const pSign = sIdx(deg!);
    const H = houseFrom(ascSign, pSign);
    const label = PLAN_ABBR[pid];
    const d = Math.floor(wrap360(deg!) % 30);
    const m = Math.floor((((wrap360(deg!) % 30) - d) * 60) + 1e-6);
    houses[H].items.push({ pid, txt: `${label} ${d}°${String(m).padStart(2,"0")}′` });
  });

  // geometry
  const corner = { tl:{x:0,y:0}, tr:{x:w,y:0}, br:{x:w,y:w}, bl:{x:0,y:w} };

  const t = 0.36, tCorner = 0.20;
  const HCTR: Record<number, {x:number;y:number;align?:"left"|"right"|"center"}> = {
    1: { x: cx, y: cy * t, align: "center" },
    2: { x: cx + (w - cx) * t, y: cy * t, align: "left" },
    3: { x: w - cx * t, y: cy, align: "left" },
    4: { x: w - cx * t, y: w - cy * t, align: "left" },
    5: { x: cx, y: w - cy * t, align: "center" },
    6: { x: cx * t, y: w - cy * t, align: "right" },
    7: { x: cx * t, y: cy, align: "right" },
    8: { x: cx * t, y: cy * t, align: "right" },
    9: { x: cx * tCorner, y: cy * tCorner, align: "right" },
    10:{ x: w - cx * tCorner, y: cy * tCorner, align: "left" },
    11:{ x: w - cx * tCorner, y: w - cy * tCorner, align: "left" },
    12:{ x: cx * tCorner, y: w - cy * tCorner, align: "right" },
  };

  function HouseStack({h}:{h:number}) {
    const info = houses[h];
    const lines = info.items;
    const signY = HCTR[h].y - (lines.length ? 16 : 8);
    const align = HCTR[h].align || "center";
    const baseX =
      align === "left" ? HCTR[h].x - 10 :
      align === "right" ? HCTR[h].x + 10 :
      HCTR[h].x;

    return (
      <g>
        <text x={HCTR[h].x} y={signY}
              textAnchor="middle" dominantBaseline="central"
              fontSize={14} fill="#64748b">{info.sign}</text>
        {lines.map((p, i) => {
          const bx = align === "left" ? baseX : align === "right" ? baseX - 36 : baseX - 18;
          const by = HCTR[h].y + i*16;
          const fill = chipColorFor(p.pid);
          return (
            <g key={i} transform={`translate(${bx}, ${by})`}>
              <rect rx="6" ry="6" width="36" height="16" fill={fill} opacity={0.95} />
              <text x={18} y={8} dominantBaseline="middle" textAnchor="middle"
                    fontSize={10} fill="white">{p.txt}</text>
            </g>
          );
        })}
        <text x={HCTR[h].x} y={HCTR[h].y + (lines.length ? (lines.length*16 + 6) : 20)}
          textAnchor="middle" dominantBaseline="hanging"
          fontSize={10} fill="#94a3b8">{h}H</text>
      </g>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <svg id={svgId} viewBox={`0 0 ${w} ${w}`} width={w} height={w}
           className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        {/* border */}
        <rect x={0.5} y={0.5} width={w-1} height={w-1} fill="none" stroke="#0f172a" strokeWidth={1.2}/>
        {/* diamond */}
        <path d={`M ${cx},0 L ${w},${cy} L ${cx},${w} L 0,${cy} Z`}
              fill="none" stroke="#334155" strokeWidth={1}/>
        {/* diagonals to center */}
        <line x1={0} y1={0} x2={cx} y2={cy} stroke="#334155" strokeWidth={1}/>
        <line x1={w} y1={0} x2={cx} y2={cy} stroke="#334155" strokeWidth={1}/>
        <line x1={w} y1={w} x2={cx} y2={cy} stroke="#334155" strokeWidth={1}/>
        <line x1={0} y1={w} x2={cx} y2={cy} stroke="#334155" strokeWidth={1}/>

        {/* houses */}
        {Array.from({length:12},(_,i)=>i+1).map(h => <HouseStack key={h} h={h}/>)}

        {/* ASC pill */}
        <g transform={`translate(${cx-18}, ${cy*0.36 - 26})`}>
          <rect rx="6" ry="6" width="36" height="16" fill="#7c3aed" />
          <text x={18} y={8} dominantBaseline="middle" textAnchor="middle"
                fontSize={10} fill="white">ASC</text>
        </g>
      </svg>

      {showLegend && (
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Whole-sign houses • Ascendant at top diamond • Houses proceed anti-clockwise • Nodes shown as “Ra/Ke”
        </div>
      )}
    </div>
  );
}
