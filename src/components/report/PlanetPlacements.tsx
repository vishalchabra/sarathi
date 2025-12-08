"use client";

import React from "react";
import { sIdx, degMin } from "@/lib/astro/canonical";
import { normalizePlanets, CANON_IDS } from "@/lib/astro/aliases";

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const ORDER: Array<[string, number]> = [
  ["Sun",     CANON_IDS.Sun],
  ["Moon",    CANON_IDS.Moon],
  ["Mars",    CANON_IDS.Mars],
  ["Mercury", CANON_IDS.Mercury],
  ["Jupiter", CANON_IDS.Jupiter],
  ["Venus",   CANON_IDS.Venus],
  ["Saturn",  CANON_IDS.Saturn],
  ["Rahu",    CANON_IDS.Rahu],
  ["Ketu",    CANON_IDS.Ketu],
];

export default function PlanetPlacements({ planets = {} as any }) {
  const P = normalizePlanets(planets);

  return (
    <section className="rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
      <h3 className="text-lg font-semibold mb-2">Planet Placements (sidereal)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-gray-500 dark:text-slate-400">
            <tr>
              <th className="text-left py-1 pr-4">Planet</th>
              <th className="text-left py-1 pr-4">Sign</th>
              <th className="text-left py-1">Degree</th>
            </tr>
          </thead>
          <tbody>
            {ORDER.map(([name, id]) => {
              const deg = P[id];
              if (deg == null || Number.isNaN(deg)) return null;
              const sign = SIGNS[sIdx(deg)];
              return (
                <tr key={name} className="border-t border-slate-100 dark:border-slate-700/50">
                  <td className="py-1 pr-4">{name}</td>
                  <td className="py-1 pr-4">{sign}</td>
                  <td className="py-1">{degMin(deg)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
