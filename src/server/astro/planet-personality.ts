// FILE: src/server/astro/planet-personality.ts
// NOTE: no "use server" here – this is a plain server helper, not a Server Action.

import { NAKSHATRAS } from "@/server/astro/nakshatra";

/* ---------- Types ---------- */

export type PlanetInput = {
  name: string;
  sign?: string;
  house?: number;
  nakshatra?: string;
  siderealLongitude?: number;
};

export type AspectInput = {
  from: string;
  to: string;
  type?: string;
  strength?: number;
};

export type PlanetPersonality = {
  summary: string[];
  strengths: string[];
  cautions: string[];
  tags: string[];
};

export type PlanetPersonalityMap = Record<string, PlanetPersonality>;

/* ---------- Small helpers ---------- */

const nakThemeByName: Record<string, string> = {};
for (const n of NAKSHATRAS) {
  nakThemeByName[n.name] = n.theme;
}

function normName(x: string | undefined | null): string {
  return (x || "").trim();
}

/* ---------- Main builder ---------- */
/**
 * Build a lightweight, structured personality map for each planet.
 * This is intentionally simple; GPT will turn this into narrative text.
 */
export function buildPlanetPersonality(
  planets: PlanetInput[],
  aspects: AspectInput[],
  ascSign?: string // kept for future use
): PlanetPersonalityMap {
  const result: PlanetPersonalityMap = {};

  const list = Array.isArray(planets) ? planets : [];
  const asp = Array.isArray(aspects) ? aspects : [];

  // Group incoming aspects by target planet
  const incoming: Record<string, AspectInput[]> = {};
  for (const a of asp) {
    const to = normName(a.to);
    const from = normName(a.from);
    if (!to || !from) continue;
    if (!incoming[to]) incoming[to] = [];
    incoming[to].push(a);
  }

  for (const p of list) {
    const name = normName(p.name);
    if (!name) continue;

    const summary: string[] = [];
    const strengths: string[] = [];
    const cautions: string[] = [];
    const tags: string[] = [];

    if (p.sign) {
      summary.push(`${name} in ${p.sign}.`);
      tags.push(`sign:${p.sign}`);
    }
    if (typeof p.house === "number") {
      summary.push(`Influences house ${p.house}.`);
      tags.push(`house:${p.house}`);
    }

    // Nakshatra + theme
    const nakName = p.nakshatra;
    if (nakName) {
      summary.push(`Nakshatra: ${nakName}.`);
      const theme = nakThemeByName[nakName];
      if (theme) {
        strengths.push(theme);
        tags.push(`nakshatra:${nakName}`);
      }
    }

    // Aspect flavour
    const inc = incoming[name] || [];
    if (inc.length) {
      const softCount = inc.filter((a) =>
        /(trine|sextile)/i.test(a.type || "")
      ).length;
      const tenseCount = inc.filter((a) =>
        /(square|opposition|conjunction)/i.test(a.type || "")
      ).length;

      if (softCount) {
        strengths.push(
          `Supported by ${softCount} harmonious aspect${
            softCount > 1 ? "s" : ""
          }.`
        );
      }
      if (tenseCount) {
        cautions.push(
          `Faces ${tenseCount} challenging aspect${
            tenseCount > 1 ? "s" : ""
          }.`
        );
      }
    }

    if (!summary.length) {
      summary.push(`${name} participates actively in the chart.`);
    }

    result[name] = {
      summary,
      strengths,
      cautions,
      tags,
    };
  }

  return result;
}
