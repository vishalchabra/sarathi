
import type { PlanetName } from "../types";

import type {
  DashaActivationResult,
} from "./dashaActivation";

import type {
  NatalSambandhaResult,
  SambandhaType,
} from "./natalSambandhaResolver";

export type ActivatedSambandha = {
  connectionId: string;
  planets: [PlanetName, PlanetName];
  relationshipTypes: SambandhaType[];
  activePlanets: PlanetName[];
  activePlanetCount: number;
  connectedHouses: number[];
  planetLordships: {
  first: number[];
  second: number[];
};
};

export function resolveDashaSambandha(
  dasha: DashaActivationResult,
  natal: NatalSambandhaResult
): ActivatedSambandha[] {
  const active = new Set(dasha.dominantPlanets);

  const connections =
    new Map<string, ActivatedSambandha>();

  for (const relationship of natal.relationships) {
    const activePlanets =
      relationship.planets.filter(
        (planet) => active.has(planet)
      );

    // Diagnostic only: at least one planet must
    // participate in the current Dasha.
    if (activePlanets.length === 0) continue;

    const existing =
      connections.get(relationship.connectionId);

    if (existing) {
      if (
        !existing.relationshipTypes.includes(
          relationship.type
        )
      ) {
        existing.relationshipTypes.push(
          relationship.type
        );
      }

      existing.connectedHouses = [
        ...new Set([
          ...existing.connectedHouses,
          ...relationship.houses,
        ]),
      ].sort((a, b) => a - b);

      continue;
    }

    connections.set(relationship.connectionId, {
      connectionId: relationship.connectionId,
      planets: relationship.planets,
      relationshipTypes: [relationship.type],
      activePlanets,
      activePlanetCount: activePlanets.length,
      connectedHouses: [...relationship.houses],
      planetLordships: {
  first: [...relationship.planetLordships.first],
  second: [...relationship.planetLordships.second],
},
    });
  }

  return [...connections.values()].sort(
    (a, b) =>
      b.activePlanetCount - a.activePlanetCount ||
      a.connectionId.localeCompare(b.connectionId)
  );
}