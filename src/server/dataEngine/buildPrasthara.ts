type Planet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";

const PLANETS: Planet[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

function seededBinary(planet: string, contributor: string, house: number) {
  const seed =
    planet.charCodeAt(0) +
    contributor.charCodeAt(0) +
    house * 13;

  return seed % 2 === 0 ? 1 : 0;
}

export function buildPrasthara() {
  const result: Record<
    string,
    Record<string, number[]>
  > = {};

  for (const planet of PLANETS) {
    result[planet] = {};

    for (const contributor of PLANETS) {
      result[planet][contributor] = Array.from({ length: 12 }, (_, i) =>
        seededBinary(planet, contributor, i + 1)
      );
    }
  }

  return result;
}