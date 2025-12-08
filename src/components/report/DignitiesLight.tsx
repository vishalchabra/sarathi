"use client";

import React from "react";
import { sIdx } from "@/lib/astro/canonical";
import { normalizePlanets, CANON_IDS } from "@/lib/astro/aliases";

const SIGNS_ABBR = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

// Rulerships (sidereal, classical)
const RULER: Record<number, number> = {
  0: 4, // Aries → Mars
  1: 3, // Taurus → Venus
  2: 2, // Gemini → Mercury
  3: 1, // Cancer → Moon
  4: 0, // Leo → Sun
  5: 2, // Virgo → Mercury
  6: 3, // Libra → Venus
  7: 4, // Scorpio → Mars
  8: 5, // Sagittarius → Jupiter
  9: 6, // Capricorn → Saturn
  10: 6, // Aquarius → Saturn
  11: 5, // Pisces → Jupiter
} as const;

// Exaltations (planetId -> signIndex)
const EXALT: Record<number, number> = {
  [CANON_IDS.Sun]: 0,     // Ar
  [CANON_IDS.Moon]: 1,    // Ta
  [CANON_IDS.Mars]: 9,    // Cp
  [CANON_IDS.Mercury]: 5, // Vi
  [CANON_IDS.Jupiter]: 3, // Cn
  [CANON_IDS.Venus]: 11,  // Pi
  [CANON_IDS.Saturn]: 6,  // Li
  // Nodes (light rule commonly used)
  [CANON_IDS.Rahu]: 1,    // Ta
  [CANON_IDS.Ketu]: 7,    // Sc
};

// Debilitations (opposite of exaltation)
const DEBIL: Record<number, number> = Object.fromEntries(
  Object.entries(EXALT).map(([pid, sign]) => [pid, (Number(sign) + 6) % 12])
);

// Natural friendships (very light rule)
const FRIENDS: Record<number, number[]> = {
  [CANON_IDS.Sun]:     [CANON_IDS.Moon, CANON_IDS.Mars, CANON_IDS.Jupiter],
  [CANON_IDS.Moon]:    [CANON_IDS.Sun, CANON_IDS.Mercury],
  [CANON_IDS.Mercury]: [CANON_IDS.Sun, CANON_IDS.Venus],
  [CANON_IDS.Venus]:   [CANON_IDS.Mercury, CANON_IDS.Saturn],
  [CANON_IDS.Mars]:    [CANON_IDS.Sun, CANON_IDS.Moon, CANON_IDS.Jupiter],
  [CANON_IDS.Jupiter]: [CANON_IDS.Sun, CANON_IDS.Moon, CANON_IDS.Mars],
  [CANON_IDS.Saturn]:  [CANON_IDS.Mercury, CANON_IDS.Venus],
} as const;

const ENEMIES: Record<number, number[]> = {
  [CANON_IDS.Sun]:     [CANON_IDS.Saturn],
  [CANON_IDS.Moon]:    [], // none
  [CANON_IDS.Mercury]: [CANON_IDS.Moon],
  [CANON_IDS.Venus]:   [CANON_IDS.Sun, CANON_IDS.Moon],
  [CANON_IDS.Mars]:    [CANON_IDS.Mercury],
  [CANON_IDS.Jupiter]: [CANON_IDS.Venus, CANON_IDS.Mercury],
  [CANON_IDS.Saturn]:  [CANON_IDS.Sun, CANON_IDS.Moon],
} as const;

const ORDER: Array<[string, number]> = [
  ["Sun", CANON_IDS.Sun],
  ["Moon", CANON_IDS.Moon],
  ["Mars", CANON_IDS.Mars],
  ["Mercury", CANON_IDS.Mercury],
  ["Jupiter", CANON_IDS.Jupiter],
  ["Venus", CANON_IDS.Venus],
  ["Saturn", CANON_IDS.Saturn],
  ["Rahu", CANON_IDS.Rahu],
  ["Ketu", CANON_IDS.Ketu],
];

function dignityFor(pid: number, signIdx: number): { label: string; tone: "pos"|"neg"|"neu" } {
  if (EXALT[pid] === signIdx) return { label: "Exalted", tone: "pos" };
  if (DEBIL[pid] === signIdx) return { label: "Debilitated", tone: "neg" };

  // own sign?
  if (RULER[signIdx] === pid) return { label: "Own sign", tone: "pos" };

  // Natural relationship to sign ruler (skip nodes)
  if (pid <= CANON_IDS.Saturn) {
    const ruler = RULER[signIdx];
    if (FRIENDS[pid]?.includes(ruler)) return { label: "Friend sign", tone: "pos" };
    if (ENEMIES[pid]?.includes(ruler)) return { label: "Enemy sign", tone: "neg" };
  }

  return { label: "Neutral", tone: "neu" };
}

export default function DignitiesLight({ planets = {} as any }) {
  const P = normalizePlanets(planets);

  return (
    <section>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-gray-500 dark:text-slate-400">
            <tr>
              <th className="text-left py-1 pr-4">Planet</th>
              <th className="text-left py-1 pr-4">Sign</th>
              <th className="text-left py-1">Dignity</th>
            </tr>
          </thead>
          <tbody>
            {ORDER.map(([name, id]) => {
              const deg = P[id];
              if (deg == null) return null;
              const signIdx = sIdx(deg);
              const sign = SIGNS_ABBR[signIdx];
              const d = dignityFor(id, signIdx);
              const cls =
                d.tone === "pos"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : d.tone === "neg"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-inherit";
              return (
                <tr key={name} className="border-t border-slate-100 dark:border-slate-700/50">
                  <td className="py-1 pr-4">{name}</td>
                  <td className="py-1 pr-4">{sign}</td>
                  <td className={`py-1 ${cls}`}>{d.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
        Light rules: sign-only checks for exaltation/debilitation, classical rulerships & natural friendships.
      </p>
    </section>
  );
}
