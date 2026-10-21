
import type { DashaPlanetActivation } from "../knowledge/dashaActivation";
import type { EventThemeDefinition } from "../knowledge/eventThemes";

export type EventDashaHouseEvidence = {
  planet: DashaPlanetActivation["planet"];
  house: number;
  houseRole: "primary" | "supporting";
  source: "lordship" | "natal_placement" | "dispositor";
  strength: number;
  sourceWeight: number;
  overlapsWithActiveDispositor: boolean;
};

export function getEventDashaHouseEvidence(
  theme: EventThemeDefinition,
  activations: readonly DashaPlanetActivation[]
): EventDashaHouseEvidence[] {
  return activations.flatMap((activation) => {
    const connections = [
      ...activation.ruledHouses.map((house) => ({
        house,
        source: "lordship" as const,
      })),
      ...(activation.natalHouse !== undefined
        ? [{
            house: activation.natalHouse,
            source: "natal_placement" as const,
          }]
        : []),
      ...activation.dispositorRuledHouses.map((house) => ({
        house,
        source: "dispositor" as const,
      })),
    ];

    return connections
      .filter(
        ({ house }) =>
          theme.primaryHouses.includes(house) ||
          theme.supportingHouses.includes(house)
      )
      .map(({ house, source }) => ({
        planet: activation.planet,
        house,
        houseRole: (
          theme.primaryHouses.includes(house)
            ? "primary"
            : "supporting"
        ) as "primary" | "supporting",
        source,
        strength: activation.strength,
        sourceWeight:
          source === "lordship"
            ? 3
            : source === "natal_placement"
              ? 2
              : 1,
        overlapsWithActiveDispositor:
          source === "dispositor" &&
          activation.dispositor !== undefined &&
          activations.some(
            (other) =>
              other.planet === activation.dispositor &&
              other.ruledHouses.includes(house)
          ),
      }));
  });
}
