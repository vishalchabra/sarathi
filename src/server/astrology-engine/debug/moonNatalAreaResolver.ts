import type { LifeArea, PlanetName, ZodiacSign } from "../types";
import { HOUSE_KNOWLEDGE } from "../knowledge/houses";
import { getPlanetLordships } from "../knowledge/planetLordships";
import type { NatalPlanetPosition } from "../knowledge/natalSambandhaResolver";

export function resolveMoonTriggerNatalAreas(params: {
  ascendant: ZodiacSign;
  planet: PlanetName;
  natalPositions: Partial<Record<PlanetName, NatalPlanetPosition>>;
}) {
  const natalHouse = params.natalPositions[params.planet]?.house ?? null;
  const ruledHouses = getPlanetLordships(
    params.ascendant,
    params.planet
  );

  const placementAreas: LifeArea[] =
    natalHouse !== null
      ? HOUSE_KNOWLEDGE[natalHouse]?.primaryAreas ?? []
      : [];

  const lordshipAreas: LifeArea[] = [
    ...new Set(
      ruledHouses.flatMap(
        (house) => HOUSE_KNOWLEDGE[house]?.primaryAreas ?? []
      )
    ),
  ];

  return {
    planet: params.planet,
    natalHouse,
    ruledHouses,
    placementAreas,
    lordshipAreas,
    combinedAreas: [
      ...new Set([...placementAreas, ...lordshipAreas]),
    ],
  };
}