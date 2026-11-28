const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

const EXPECTED_BAV_TOTALS = {
  Sun: 48,
  Moon: 49,
  Mars: 39,
  Mercury: 54,
  Jupiter: 56,
  Venus: 52,
  Saturn: 39,
} as const;

type ClassicalPlanet = keyof typeof EXPECTED_BAV_TOTALS;

export type AshtakavargaSupport =
  | "limited"
  | "below_average"
  | "balanced"
  | "supportive"
  | "strongly_supportive"
  | "unavailable";

export type AshtakavargaPlanetRow = {
  planet: string;
  houses?: readonly number[];
  signs?: readonly number[];
  total: number;
  isTotalValid?: boolean;
};

export type AshtakavargaData = {
  planets: readonly AshtakavargaPlanetRow[];
  sarva: readonly number[];
  sarvaTotal?: number;
  isSarvaTotalValid?: boolean;
};

export type EventTransitSign = {
  planet: string;
  sign: string;
};

export type EventAshtakavargaInput = {
  qualifyingTransitPlanets: readonly string[];
  transitPositions: readonly EventTransitSign[];
  ashtakvarga?: AshtakavargaData | null;
  includeMoonTrigger?: boolean;
};

function sum(values: readonly number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function validDistribution(
  values: readonly number[] | undefined,
  maximum: number
): values is readonly number[] {
  return (
    Array.isArray(values) &&
    values.length === 12 &&
    values.every(
      (value) =>
        Number.isInteger(value) &&
        value >= 0 &&
        value <= maximum
    )
  );
}

function validBav(row: AshtakavargaPlanetRow) {
  if (
    !Object.prototype.hasOwnProperty.call(
      EXPECTED_BAV_TOTALS,
      row.planet
    )
  ) return null;

  const values = row.signs ?? row.houses;
  const expected =
    EXPECTED_BAV_TOTALS[row.planet as ClassicalPlanet];

  if (
    !validDistribution(values, 8) ||
    row.total !== expected ||
    sum(values) !== expected ||
    row.isTotalValid === false
  ) return null;

  if (
    row.signs &&
    row.houses &&
    (
      !validDistribution(row.houses, 8) ||
      row.signs.some(
        (value, index) => value !== row.houses![index]
      )
    )
  ) return null;

  return values;
}

export function classifyAshtakavargaSupport(
  bindus: number | null
): AshtakavargaSupport {
  if (
    bindus === null ||
    !Number.isInteger(bindus) ||
    bindus < 0 ||
    bindus > 8
  ) return "unavailable";

  if (bindus <= 2) return "limited";
  if (bindus === 3) return "below_average";
  if (bindus === 4) return "balanced";
  if (bindus <= 6) return "supportive";

  return "strongly_supportive";
}

export function resolveEventAshtakavargaEvidence(
  input: EventAshtakavargaInput
) {
  const data = input.ashtakvarga;
  const rows = data?.planets ?? [];

  const validRows = new Map<string, readonly number[]>();

  for (const planet of Object.keys(EXPECTED_BAV_TOTALS)) {
    const matches = rows.filter((row) => row.planet === planet);

    if (matches.length !== 1) continue;

    const values = validBav(matches[0]);

    if (values) validRows.set(planet, values);
  }

  const sarva = data?.sarva;

  const sarvaValid =
    validDistribution(sarva, 56) &&
    sum(sarva) === 337 &&
    (data?.sarvaTotal === undefined ||
      data.sarvaTotal === 337) &&
    data?.isSarvaTotalValid !== false &&
    validRows.size === 7 &&
    sarva.every((value, index) => {
      let expected = 0;

      for (const values of validRows.values()) {
        expected += values[index];
      }

      return value === expected;
    });

  const planets = [
    ...new Set(
      input.qualifyingTransitPlanets.filter(
        (planet) => planet !== "Moon"
      )
    ),
  ];

  if (input.includeMoonTrigger) planets.push("Moon");

  const evidence = planets.map((planet) => {
    const positions = input.transitPositions.filter(
      (position) => position.planet === planet
    );

    const position =
      positions.length === 1 ? positions[0] : null;

    const signIndex = position
      ? SIGNS.findIndex((sign) => sign === position.sign)
      : -1;

    const values = validRows.get(planet);

    const bav =
      signIndex >= 0 && values
        ? values[signIndex]
        : null;

    const sav =
      signIndex >= 0 && sarvaValid && sarva
        ? sarva[signIndex]
        : null;

    return {
      planet,
      transitSign: position?.sign ?? null,
      signIndex: signIndex >= 0 ? signIndex : null,
      bav,
      sav,
      support: classifyAshtakavargaSupport(bav),
      independentTransit: planet !== "Moon",
    };
  });

  const independentEvidence = evidence.filter(
    (item) => item.independentTransit
  );

  const moonEvidence =
    evidence.find((item) => item.planet === "Moon") ?? null;

  return {
    evidence,
    independentEvidence,
    moonEvidence,
    sarvaValid,
    validBavPlanetCount: validRows.size,
    availableIndependentEvidence: independentEvidence.filter(
      (item) => item.bav !== null
    ),
    unavailablePlanets: evidence
      .filter((item) => item.bav === null)
      .map((item) => item.planet),
  };
}
