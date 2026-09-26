
import type {
  ActivatedSambandha,
} from "./dashaSambandhaResolver";

export type EventSambandhaEvidence = {
  connectionId: string;
  relationshipTypes: ActivatedSambandha["relationshipTypes"];
  activePlanets: ActivatedSambandha["activePlanets"];
  activePlanetCount: number;

  firstPlanetHouses: number[];
  secondPlanetHouses: number[];

  connectsDistinctPrimaryHouses: boolean;
  connectsPrimaryToSupporting: boolean;
  activationType:
  | "both_planets_active"
  | "one_planet_active";
};

export function resolveEventSambandha(params: {
  primaryHouses: number[];
  supportingHouses?: number[];
  connections: ActivatedSambandha[];
}): EventSambandhaEvidence[] {
  const primary = new Set(params.primaryHouses);
  const supporting = new Set(
    params.supportingHouses ?? []
  );

  return params.connections.flatMap((connection) => {
    const firstLordships =
      connection.planetLordships.first;

    const secondLordships =
      connection.planetLordships.second;

    const firstPrimary = firstLordships.filter(
      (house) => primary.has(house)
    );

    const secondPrimary = secondLordships.filter(
      (house) => primary.has(house)
    );

    const firstSupporting = firstLordships.filter(
      (house) => supporting.has(house)
    );

    const secondSupporting = secondLordships.filter(
      (house) => supporting.has(house)
    );

    const connectsDistinctPrimaryHouses =
      firstPrimary.some((first) =>
        secondPrimary.some(
          (second) => first !== second
        )
      );

    const connectsPrimaryToSupporting =
      firstPrimary.some((first) =>
        secondSupporting.some(
          (second) => first !== second
        )
      ) ||
      secondPrimary.some((second) =>
        firstSupporting.some(
          (first) => first !== second
        )
      );

    if (
      !connectsDistinctPrimaryHouses &&
      !connectsPrimaryToSupporting
    ) {
      return [];
    }

    return [{
      connectionId: connection.connectionId,
      relationshipTypes:
        connection.relationshipTypes,
      activePlanets: connection.activePlanets,
      activePlanetCount:
        connection.activePlanetCount,

      firstPlanetHouses: firstLordships.filter(
        (house) =>
          primary.has(house) ||
          supporting.has(house)
      ),

      secondPlanetHouses: secondLordships.filter(
        (house) =>
          primary.has(house) ||
          supporting.has(house)
      ),

      connectsDistinctPrimaryHouses,
      connectsPrimaryToSupporting,
      activationType:
  connection.activePlanetCount === 2
    ? "both_planets_active"
    : "one_planet_active",
    }];
  });
}