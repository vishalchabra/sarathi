import type {
  DashaPlanetActivation,
  DashaLevel,
} from "../knowledge/dashaActivation";

import type {
  EventThemeDefinition,
} from "../knowledge/eventThemes";

export type EventDashaEvidenceSource =
  | "lordship"
  | "natal_placement"
  | "dispositor"
  | "natal_aspect";

export type EventDashaActivationClass =
  | "direct"
  | "indirect"
  | "supporting";

export type EventDashaHouseEvidence = {
  planet: DashaPlanetActivation["planet"];
  house: number;
  houseRole: "primary" | "supporting";
  source: EventDashaEvidenceSource;
  strength: number;
  sourceWeight: number;
  overlapsWithActiveDispositor: boolean;

  dashaLevels: DashaLevel[];
  dashaStrength: number;
  activationClass: EventDashaActivationClass;
  dispositor?: DashaPlanetActivation["planet"];
};

export type EventDashaEvidenceOptions = {
  includeNatalAspects?: boolean;
};

const SOURCE_WEIGHTS: Record<
  EventDashaEvidenceSource,
  number
> = {
  lordship: 3,
  natal_placement: 2,
  dispositor: 1,
  natal_aspect: 0.5,
};

const ACTIVATION_CLASSES: Record<
  EventDashaEvidenceSource,
  EventDashaActivationClass
> = {
  lordship: "direct",
  natal_placement: "direct",
  dispositor: "indirect",
  natal_aspect: "supporting",
};

export function getEventDashaHouseEvidence(
  theme: EventThemeDefinition,
  activations: readonly DashaPlanetActivation[],
  options: EventDashaEvidenceOptions = {}
): EventDashaHouseEvidence[] {
  return activations.flatMap((activation) => {
    const connections: {
      house: number;
      source: EventDashaEvidenceSource;
    }[] = [
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

      ...activation.dispositorRuledHouses.map(
        (house) => ({
          house,
          source: "dispositor" as const,
        })
      ),

      ...(options.includeNatalAspects === true
        ? (activation.natalAspectedHouses ?? []).map(
            (house) => ({
              house,
              source: "natal_aspect" as const,
            })
          )
        : []),
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

        sourceWeight: SOURCE_WEIGHTS[source],

        dashaLevels: [...activation.levels],

        dashaStrength: activation.strength,

        activationClass:
          ACTIVATION_CLASSES[source],

        ...(source === "dispositor" &&
        activation.dispositor !== undefined
          ? { dispositor: activation.dispositor }
          : {}),

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
