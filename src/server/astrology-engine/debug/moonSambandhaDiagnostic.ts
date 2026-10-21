
import type { PlanetName, ZodiacSign } from "../types";
import {
  getPlanetLordships,
} from "../knowledge/planetLordships";
import type {
  NatalPlanetPosition,
  NatalSambandhaResult,
} from "../knowledge/natalSambandhaResolver";
import { resolveMoonTriggerNatalAreas } from "./moonNatalAreaResolver";
export function diagnoseMoonDashaSambandha(params: {
  ascendant: ZodiacSign;
  nakshatraLord: PlanetName | null | undefined;
  navamsaLord: PlanetName | null | undefined;
  dashaPlanets: readonly PlanetName[];
  natalPositions: Partial<
    Record<PlanetName, NatalPlanetPosition>
  >;
  natalSambandha: NatalSambandhaResult;
}) {
  const activeDashaPlanets = new Set(params.dashaPlanets);

  const triggers = (
    [
      ["nakshatraLord", params.nakshatraLord],
      ["navamsaLord", params.navamsaLord],
    ] as const
  ).flatMap(([source, planet]) => {
    if (!planet) return [];

    const natalHouse =
      params.natalPositions[planet]?.house ?? null;

    const connections = params.natalSambandha.relationships
      .filter(
        (relationship) =>
          relationship.planets.includes(planet) &&
          relationship.planets.some(
            (partner) =>
              partner !== planet &&
              activeDashaPlanets.has(partner)
          )
      )
      .map((relationship) => {
        const partner =
          relationship.planets[0] === planet
            ? relationship.planets[1]
            : relationship.planets[0];

        return {
          partner,
          relationshipType: relationship.type,
          directed: relationship.directed,
          partnerIsDashaActive: true,
          triggerLordships: getPlanetLordships(
            params.ascendant,
            planet
          ),
          triggerNatalHouse: natalHouse,
          partnerLordships: getPlanetLordships(
            params.ascendant,
            partner
          ),
          partnerNatalHouse:
            params.natalPositions[partner]?.house ?? null,
        };
      });
const natalAreas = resolveMoonTriggerNatalAreas({
  ascendant: params.ascendant,
  planet,
  natalPositions: params.natalPositions,
});
const indirectDashaConnections =
  params.natalSambandha.relationships
    .filter(
      (first) =>
        first.type === "dispositor" &&
        first.planets[0] === planet
    )
    .flatMap((first) => {
      const intermediary = first.planets[1];

      return params.natalSambandha.relationships
        .filter(
  (second) =>
    second.planets.includes(intermediary) &&
    (
      !second.directed ||
      second.planets[0] === intermediary
    ) &&
    second.planets.some(
      (p) =>
        p !== intermediary &&
        activeDashaPlanets.has(p)
    )
)
        .map((second) => ({
          intermediary,
          dashaPlanet:
            second.planets[0] === intermediary
              ? second.planets[1]
              : second.planets[0],
          firstRelationship: first.type,
          secondRelationship: second.type,
          secondDirected: second.directed,
          secondPlanets: second.planets,
          connectionId: second.connectionId,
        }));
    });
    return [{
        
      source,
      planet,
      directlyDashaActive:
        activeDashaPlanets.has(planet),
      lordships: getPlanetLordships(
        params.ascendant,
        planet
      ),
      natalHouse,
      natalAreas,
      connections,
      indirectDashaConnections,
    }];
  });

  return {
    dashaPlanets: [...activeDashaPlanets],
    triggers,
  };
}
