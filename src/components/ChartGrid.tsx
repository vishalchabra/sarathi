// src/components/ChartGrid.tsx
"use client";
import React from "react";

type HousePlacement = {
  house: number;
  planets: { label: string; detail?: string }[]; // 👈 add detail
  sign?: string;
};

export default function ChartGrid({
  title,
  placements,
}: {
  title: string;
  placements: HousePlacement[];
}) {
  const byHouse: Record<number, HousePlacement> = {};
  for (let i = 1; i <= 12; i++) {
    byHouse[i] = { house: i, planets: [] };
  }
  placements.forEach((p) => (byHouse[p.house] = p));

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{title}</h3>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }, (_, idx) => {
          const h = idx + 1;
          const cell = byHouse[h];
          return (
            <div key={h} className="border rounded-xl p-2 min-h-[72px]">
              <div className="text-[10px] text-slate-500">House {h}{cell.sign ? ` • ${cell.sign}` : ""}</div>
              <div className="text-sm font-medium break-words">
  {cell.planets.length
    ? cell.planets.map((p, i) => (
        <span key={i} className={`mr-2 ${toneFor(p.label)}`}>
          {p.label}{p.detail ? ` (${p.detail})` : ""}
          {i < cell.planets.length - 1 ? "," : ""}
        </span>
      ))
    : "—"}
</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function toneFor(label: string) {
  // Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke
  const m: Record<string,string> = {
    Su: "text-orange-600", Mo: "text-slate-700", Ma: "text-red-600",
    Me: "text-emerald-700", Ju: "text-amber-700", Ve: "text-pink-700",
    Sa: "text-blue-700", Ra: "text-purple-700", Ke: "text-purple-700",
  };
  return m[label] ?? "text-black";
}

/** Utility to abbreviate planet names (Sun->Su, Moon->Mo, etc.) */
export function abbrev(planet: string) {
  const map: Record<string, string> = {
    Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
    Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
  };
  return map[planet] || planet.slice(0,2);
}
