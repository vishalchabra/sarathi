"use client";

import React from "react";
import { sIdx } from "@/lib/astro/canonical";
import { normalizePlanets, CANON_IDS, wrap360 } from "@/lib/astro/aliases";

const SIGNS_ABBR = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

type Yoga = {
  name: string;
  flavor: "Auspicious" | "Inauspicious";
  weight: "Major" | "Minor";
  note: string;
};

const ownSigns = {
  [CANON_IDS.Sun]:     [4],
  [CANON_IDS.Moon]:    [3],
  [CANON_IDS.Mercury]: [2,5],
  [CANON_IDS.Venus]:   [1,6],
  [CANON_IDS.Mars]:    [0,7],
  [CANON_IDS.Jupiter]: [8,11],
  [CANON_IDS.Saturn]:  [9,10],
} as const;

const exaltSign = {
  [CANON_IDS.Sun]: 0,
  [CANON_IDS.Moon]: 1,
  [CANON_IDS.Mercury]: 5,
  [CANON_IDS.Venus]: 11,
  [CANON_IDS.Mars]: 9,
  [CANON_IDS.Jupiter]: 3,
  [CANON_IDS.Saturn]: 6,
} as const;

function inOwnOrExalt(pid: number, signIdx: number) {
  return ownSigns[pid]?.includes(signIdx) || exaltSign[pid] === signIdx;
}

function kendra(h: number) {
  return h === 1 || h === 4 || h === 7 || h === 10;
}

function houseOf(signIdx: number, asc0: number) {
  return ((signIdx - asc0 + 12) % 12) + 1;
}

export default function YogasAuto({
  planets = {} as any,
  ascDeg,
  mode = "strict",
}: {
  planets: any;
  ascDeg?: number;
  mode?: "strict" | "light";
}) {
  const P = normalizePlanets(planets);
  const asc0 = Number.isFinite(ascDeg) ? Math.floor(wrap360(Number(ascDeg)) / 30) : 0;

  const signOf = (pid: number) => sIdx(P[pid] ?? NaN);
  const houseOfP = (pid: number) => houseOf(signOf(pid), asc0);

  const list: Yoga[] = [];

  // ---- Pancha Mahapurusha (strict) ----
  // Ruchaka: Mars kendra + own/exalt
  if (kendra(houseOfP(CANON_IDS.Mars)) && inOwnOrExalt(CANON_IDS.Mars, signOf(CANON_IDS.Mars))) {
    list.push({ name: "Ruchaka Yoga", flavor: "Auspicious", weight: "Major",
      note: "Mars in a kendra in own/exaltation sign" });
  }
  // Bhadra: Mercury
  if (kendra(houseOfP(CANON_IDS.Mercury)) && inOwnOrExalt(CANON_IDS.Mercury, signOf(CANON_IDS.Mercury))) {
    list.push({ name: "Bhadra Yoga", flavor: "Auspicious", weight: "Major",
      note: "Mercury in a kendra in own/exaltation sign" });
  }
  // Hamsa: Jupiter
  if (kendra(houseOfP(CANON_IDS.Jupiter)) && inOwnOrExalt(CANON_IDS.Jupiter, signOf(CANON_IDS.Jupiter))) {
    list.push({ name: "Hamsa Yoga", flavor: "Auspicious", weight: "Major",
      note: "Jupiter in a kendra in own/exaltation sign" });
  }
  // Malavya: Venus
  if (kendra(houseOfP(CANON_IDS.Venus)) && inOwnOrExalt(CANON_IDS.Venus, signOf(CANON_IDS.Venus))) {
    list.push({ name: "Malavya Yoga", flavor: "Auspicious", weight: "Major",
      note: "Venus in a kendra in own/exaltation sign" });
  }
  // Sasa: Saturn
  if (kendra(houseOfP(CANON_IDS.Saturn)) && inOwnOrExalt(CANON_IDS.Saturn, signOf(CANON_IDS.Saturn))) {
    list.push({ name: "Śaśa Yoga", flavor: "Auspicious", weight: "Major",
      note: "Planet in a kendra in own/exaltation sign" });
  }

  // ---- Gajakesari (light but safe) ----
  if (mode !== "strict") {
    const moonH = houseOfP(CANON_IDS.Moon);
    const jupH = houseOfP(CANON_IDS.Jupiter);
    if (kendra(moonH) && kendra(jupH)) {
      list.push({
        name: "Gajakeśarī (light)",
        flavor: "Auspicious",
        weight: "Minor",
        note: "Moon & Jupiter both in kendras (whole-sign).",
      });
    }
  }

  // ---- Kemadruma (light) ----
  if (mode !== "strict") {
    const mSign = signOf(CANON_IDS.Moon);
    if (Number.isFinite(mSign)) {
      const s2 = (mSign + 1) % 12;
      const s12 = (mSign + 11) % 12;
      const occupiedSigns = new Set<number>([
        sIdx(P[CANON_IDS.Sun] ?? NaN),
        sIdx(P[CANON_IDS.Mercury] ?? NaN),
        sIdx(P[CANON_IDS.Venus] ?? NaN),
        sIdx(P[CANON_IDS.Mars] ?? NaN),
        sIdx(P[CANON_IDS.Jupiter] ?? NaN),
        sIdx(P[CANON_IDS.Saturn] ?? NaN),
      ]);
      const empty2 = !occupiedSigns.has(s2);
      const empty12 = !occupiedSigns.has(s12);
      const conjNone = !occupiedSigns.has(mSign);
      if (empty2 && empty12 && conjNone) {
        list.push({
          name: "Kemadruma (light)",
          flavor: "Inauspicious",
          weight: "Minor",
          note: "Moon isolated (no classical planets in same/2nd/12th).",
        });
      }
    }
  }

  if (list.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-slate-400">
        No common yogas detected by light rules.
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">
        sidereal • whole-sign houses • reproducible
      </div>
      {list.map((y, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 dark:border-slate-700 p-2"
        >
          <div className="flex flex-wrap items-center gap-2">
            <b>{y.name}</b>
            <span className={
              y.flavor === "Auspicious"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }>
              {y.flavor}
            </span>
            <span className="text-gray-500 dark:text-slate-400">{y.weight}</span>
            <span className="text-gray-700 dark:text-slate-200">— {y.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
