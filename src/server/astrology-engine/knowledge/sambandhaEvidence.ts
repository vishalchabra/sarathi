import type { PlanetName } from "../types";

export function getUniqueSambandhaActivePlanets(
  evidence: ReadonlyArray<{
    activePlanets: readonly PlanetName[];
  }>
): PlanetName[] {
  return [
    ...new Set(
      evidence.flatMap(
        (connection) => [...connection.activePlanets]
      )
    ),
  ];
}
export function hasDualActiveSambandha(
  evidence: ReadonlyArray<{
    activePlanets: readonly string[];
  }>
): boolean {
  return evidence.some(
    (connection) =>
      new Set(connection.activePlanets).size === 2
  );
}
export function getEventSambandhaBonus(
  evidence: ReadonlyArray<{
    activePlanets: readonly string[];
    connectsDistinctPrimaryHouses: boolean;
    connectsPrimaryToSupporting: boolean;
  }>,
  matchedPrimaryHouses: readonly number[],
  timingScore: number
): number {
  // Sambandha cannot create an event by itself.
  if (
    matchedPrimaryHouses.length === 0 ||
    timingScore < 60
  ) {
    return 0;
  }

  // Count only a connection where both planets
  // are active in the same planetary relationship.
  const hasRelevantDualActivation = evidence.some(
    (connection) =>
      new Set(connection.activePlanets).size === 2 &&
      (
        connection.connectsDistinctPrimaryHouses ||
        connection.connectsPrimaryToSupporting
      )
  );

  // One capped contribution per event, regardless
  // of how many qualifying relationships exist.
  return hasRelevantDualActivation ? 5 : 0;
}