// src/server/astro/houses/reader.ts
import type { PlanetPackMap, AnyPlanetPack } from "../types";

/**
 * Groups planets by house and returns a narrative summary for each.
 * You can call this after building all planet packs (Sun–Ketu).
 */
export function buildHousewiseNarrative(planets: PlanetPackMap) {
  const houses: Record<number, { planets: string[]; notes: string[] }> = {};

  const all: AnyPlanetPack[] = Object.values(planets).filter(Boolean) as AnyPlanetPack[];
  for (const p of all) {
    const h = p.natal.house;
    if (!houses[h]) houses[h] = { planets: [], notes: [] };

    houses[h].planets.push(p.planet);
    const keyLine =
      p.explain.find((x) => x.startsWith("House →")) ||
      p.explain.find((x) => x.toLowerCase().includes("house")) ||
      p.explain[3] ||
      "";
    if (keyLine) houses[h].notes.push(`${p.planet}: ${keyLine}`);
  }

  // Construct final readable summary
  const summary: { house: number; title: string; text: string }[] = [];

  for (let h = 1; h <= 12; h++) {
    const group = houses[h];
    if (!group) continue;

    const planetList = group.planets.join(", ");
    const notes = group.notes.join(" | ");
    const title = `House ${h}: ${planetThemes[h] || "—"}`;
    const text = `${planetList ? `Planets here: ${planetList}. ` : ""}${notes}`;

    summary.push({ house: h, title, text });
  }

  return summary;
}

// ---------------------- HOUSE DESCRIPTORS (Default Text) ----------------------

const planetThemes: Record<number, string> = {
  1: "Self, identity, appearance, vitality",
  2: "Wealth, speech, family, values",
  3: "Courage, communication, siblings",
  4: "Home, emotions, comfort, mother",
  5: "Creativity, children, intelligence",
  6: "Service, enemies, health, discipline",
  7: "Partnerships, marriage, contracts",
  8: "Transformation, longevity, occult",
  9: "Faith, travel, higher purpose",
  10: "Career, karma, authority",
  11: "Gains, networks, achievements",
  12: "Moksha, losses, sleep, foreign lands",
};
