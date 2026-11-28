export const CLASSICAL_PLANET_MINIMUM_RUPAS = {
  Sun: 5,
  Moon: 6,
  Mars: 5,
  Mercury: 7,
  Jupiter: 6.5,
  Venus: 5.5,
  Saturn: 5,
} as const;

export type ClassicalStrengthPlanet =
  keyof typeof CLASSICAL_PLANET_MINIMUM_RUPAS;

export type PlanetaryCapacity =
  | "limited"
  | "moderate"
  | "adequate"
  | "strong"
  | "unavailable";

export type ShadbalaEvidenceRow = {
  planet: string;
  total: number;
};

export type AfflictionContextRow = {
  planet: string;
  level: "clean" | "mild" | "afflicted";
  score: number;
  reasons: readonly string[];
};

export type PlanetaryStrengthInput = {
  relevantPlanets: readonly string[];
  shadbala?: readonly ShadbalaEvidenceRow[] | null;
  afflictions?: readonly AfflictionContextRow[] | null;
};

export function classifyPlanetaryCapacity(
  ratio: number | null
): PlanetaryCapacity {
  if (
    ratio === null ||
    !Number.isFinite(ratio) ||
    ratio < 0
  ) return "unavailable";

  if (ratio < 0.75) return "limited";
  if (ratio < 1) return "moderate";
  if (ratio < 1.25) return "adequate";

  return "strong";
}

export function resolveEventPlanetaryStrengthEvidence(
  input: PlanetaryStrengthInput
) {
  const relevantPlanets = [...new Set(input.relevantPlanets)];

  const evidence = relevantPlanets.map((planet) => {
    const classical = Object.prototype.hasOwnProperty.call(
      CLASSICAL_PLANET_MINIMUM_RUPAS,
      planet
    );

    const minimumRupas = classical
      ? CLASSICAL_PLANET_MINIMUM_RUPAS[
          planet as ClassicalStrengthPlanet
        ]
      : null;

    const rows = (input.shadbala ?? []).filter(
      (row) => row.planet === planet
    );

    const row = rows.length === 1 ? rows[0] : null;

    // Data Engine Shadbala totals are already expressed in Rupas.
    const totalRupas =
      classical &&
      row &&
      Number.isFinite(row.total) &&
      row.total >= 0
        ? row.total
        : null;

    const totalVirupas =
      totalRupas === null ? null : totalRupas * 60;

    const ratio =
      totalRupas !== null && minimumRupas !== null
        ? totalRupas / minimumRupas
        : null;

    const afflictionRows = (input.afflictions ?? []).filter(
      (item) => item.planet === planet
    );

    const affliction =
      afflictionRows.length === 1
        ? afflictionRows[0]
        : null;

    return {
      planet,
      classical,
      totalVirupas,
      totalRupas,
      minimumRupas,
      ratio,
      capacity: classifyPlanetaryCapacity(ratio),
      affliction,
      estimatedCapacity: true as const,
    };
  });

  const availableEvidence = evidence.filter(
    (item) => item.ratio !== null
  );

  return {
    evidence,
    availableEvidence,
    unavailablePlanets: evidence
      .filter((item) => item.ratio === null)
      .map((item) => item.planet),
    strongPlanets: evidence
      .filter((item) => item.capacity === "strong")
      .map((item) => item.planet),
    adequatePlanets: evidence
      .filter((item) => item.capacity === "adequate")
      .map((item) => item.planet),
    limitedPlanets: evidence
      .filter((item) => item.capacity === "limited")
      .map((item) => item.planet),
    coverage:
      relevantPlanets.length > 0
        ? availableEvidence.length / relevantPlanets.length
        : 0,
  };
}
