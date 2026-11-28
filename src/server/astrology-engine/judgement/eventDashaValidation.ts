import {
  resolveDashaActivation,
  type DashaActivationInput,
  type DashaPlanetActivation,
} from "../knowledge/dashaActivation";

import type {
  PlanetName,
} from "../types";

const VALID_PLANETS = new Set<string>([
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
]);

function sameValues<T>(
  first: readonly T[],
  second: readonly T[]
): boolean {
  return (
    first.length === second.length &&
    new Set(first).size === first.length &&
    first.every(value => second.includes(value))
  );
}

export function validateEventDashaActivations(
  input: DashaActivationInput,
  supplied: readonly DashaPlanetActivation[]
) {
  const rejectionReasons: string[] = [];

  const periods = [
    input.mahadasha,
    input.antardasha,
    input.pratyantardasha,
  ];

  const completePeriods = periods.every(
    planet =>
      typeof planet === "string" &&
      VALID_PLANETS.has(planet)
  );

  if (!completePeriods) {
    rejectionReasons.push("INVALID_OR_MISSING_PERIOD");
  }

  if (!input.ascendant) {
    rejectionReasons.push("MISSING_ASCENDANT");
  }

  for (const planet of periods) {
    if (
      planet &&
      !input.natalPositions?.[planet]
    ) {
      rejectionReasons.push(
        `MISSING_NATAL_POSITION:${planet}`
      );
    }
  }

  const canonical =
    rejectionReasons.length === 0
      ? resolveDashaActivation(input).planetActivations
      : [];

  const seen = new Set<PlanetName>();

  for (const row of supplied) {
    if (seen.has(row.planet)) {
      rejectionReasons.push(
        `DUPLICATE_ACTIVATION:${row.planet}`
      );
    }

    seen.add(row.planet);

    const expected = canonical.find(
      item => item.planet === row.planet
    );

    if (!expected) {
      rejectionReasons.push(
        `UNEXPECTED_ACTIVATION:${row.planet}`
      );

      continue;
    }

    if (
      !sameValues(row.levels, expected.levels)
    ) {
      rejectionReasons.push(
        `INVALID_DASHA_LEVELS:${row.planet}`
      );
    }

    if (
      !Number.isFinite(row.strength) ||
      row.strength !== expected.strength
    ) {
      rejectionReasons.push(
        `INVALID_DASHA_STRENGTH:${row.planet}`
      );
    }

    if (
      !sameValues(
        row.ruledHouses,
        expected.ruledHouses
      )
    ) {
      rejectionReasons.push(
        `INVALID_LORDSHIPS:${row.planet}`
      );
    }

    if (row.natalHouse !== expected.natalHouse) {
      rejectionReasons.push(
        `INVALID_NATAL_HOUSE:${row.planet}`
      );
    }

    if (
      !sameValues(
        row.natalAspectedHouses ?? [],
        expected.natalAspectedHouses ?? []
      )
    ) {
      rejectionReasons.push(
        `INVALID_NATAL_ASPECTS:${row.planet}`
      );
    }

    if (
      row.dispositor !== expected.dispositor ||
      !sameValues(
        row.dispositorRuledHouses,
        expected.dispositorRuledHouses
      )
    ) {
      rejectionReasons.push(
        `INVALID_DISPOSITOR:${row.planet}`
      );
    }
  }

  for (const expected of canonical) {
    if (!seen.has(expected.planet)) {
      rejectionReasons.push(
        `MISSING_ACTIVATION:${expected.planet}`
      );
    }
  }

  const valid =
    rejectionReasons.length === 0 &&
    canonical.length > 0;

  return {
    valid,
    completePeriods,
    suppliedCount: supplied.length,
    canonicalCount: canonical.length,
    rejectionReasons: [...new Set(rejectionReasons)],

    // Downstream consumers receive reconstructed
    // canonical evidence, never supplied metadata.
    activations: valid ? canonical : [],
  };
}
