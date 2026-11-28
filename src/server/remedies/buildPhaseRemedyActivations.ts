import type { PhaseRemedyInput } from "./selectPhaseRemedies";

type LordProfile = {
  planet?: string | null;
  house?: number | null;
  ruledHouses?: number[];
};

type TransitInteraction = {
  transitPlanet?: string;
  natalTarget?: string;
  aspectType?: string;
  orb?: number | null;
};

type DegreeHit = {
  transitPlanet?: string;
  natalPlanet?: string;
  distance?: number;
  exact?: boolean;
  strength?: number;
};

type ActivationInput = {
  dashaContext?: {
    md?: LordProfile | null;
    ad?: LordProfile | null;
    pd?: LordProfile | null;
  } | null;

  transitInteractions?: TransitInteraction[];

  degreeHits?: DegreeHit[];
};

const HOUSE_AREAS: Record<number, string[]> = {
  1: ["health"],
  2: ["money", "family"],
  3: ["education"],
  4: ["family"],
  5: ["education"],
  6: ["career", "health"],
  7: ["relationships"],
  8: ["money"],
  9: ["education"],
  10: ["career"],
  11: ["money"],
  12: ["money"],
};

const PLANETS = new Set([
  "sun", "moon", "mars", "mercury",
  "jupiter", "venus", "saturn",
  "rahu", "ketu",
]);

function normalize(value: unknown): string {
  return typeof value === "string"
    ? value.trim().toLowerCase()
    : "";
}

function validHouse(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 12
  );
}

export function buildPhaseRemedyActivations(
  input: ActivationInput
): PhaseRemedyInput["activations"] {
  const context = input.dashaContext;

  if (!context) return [];

  const profiles = [
    context.ad,
    context.md,
    context.pd,
  ];

  const interactions = Array.isArray(
    input.transitInteractions
  )
    ? input.transitInteractions
    : [];

  const degreeHits = Array.isArray(input.degreeHits)
    ? input.degreeHits
    : [];

  const activations: PhaseRemedyInput["activations"] = [];

  const processed = new Set<string>();

  for (const profile of profiles) {
    if (!profile) continue;

    const planet = normalize(profile.planet);

    if (
      !PLANETS.has(planet) ||
      processed.has(planet) ||
      !validHouse(profile.house)
    ) {
      continue;
    }

    processed.add(planet);

    const hasDegreeHit = degreeHits.some(
      (hit) =>
        normalize(hit.natalPlanet) === planet &&
        PLANETS.has(normalize(hit.transitPlanet)) &&
        normalize(hit.transitPlanet) !== "moon" &&
        typeof hit.distance === "number" &&
        Number.isFinite(hit.distance) &&
        hit.distance >= 0 &&
        hit.distance <= 3
    );

    const hasTransitContact = interactions.some(
      (interaction) =>
        normalize(interaction.natalTarget) === planet &&
        PLANETS.has(
          normalize(interaction.transitPlanet)
        ) &&
        normalize(interaction.transitPlanet) !== "moon" &&
        typeof interaction.orb === "number" &&
        Number.isFinite(interaction.orb) &&
        interaction.orb >= 0 &&
        interaction.orb <= 3 &&
        Boolean(normalize(interaction.aspectType)) &&
        interaction.aspectType !== "—"
    );

    if (!hasDegreeHit && !hasTransitContact) {
      continue;
    }

    const houses = [
      ...new Set(
        [
          profile.house,
          ...(Array.isArray(profile.ruledHouses)
            ? profile.ruledHouses
            : []),
        ].filter(validHouse)
      ),
    ];

    // Keep each house linked to its own life areas.
    // Do not merge unrelated houses and life areas.
    for (const house of houses) {
      const lifeAreas = HOUSE_AREAS[house] ?? [];

      if (!lifeAreas.length) continue;

      activations.push({
        planet,
        houses: [house],
        lifeAreas,
      });
    }
  }

  return activations;
}