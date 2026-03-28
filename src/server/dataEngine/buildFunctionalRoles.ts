import "server-only";

type BuildFunctionalRolesParams = {
  ascendant: {
    sign: string;
    signNum: number;
  };
  houses: Array<{
    house: number;
    sign: string;
    signNum: number;
    lord: string;
    lordPlacedHouse: number | null;
    lordPlacedSign: string | null;
  }>;
  natalPlanets: Array<{
    planet: string;
    lordships?: number[];
  }>;
};

const FIXED_SIGNS = new Set([2, 5, 8, 11]); // Taurus, Leo, Scorpio, Aquarius
const MOVABLE_SIGNS = new Set([1, 4, 7, 10]); // Aries, Cancer, Libra, Capricorn
const DUAL_SIGNS = new Set([3, 6, 9, 12]); // Gemini, Virgo, Sagittarius, Pisces

function unique(arr: string[]): string[] {
  return [...new Set(arr.filter(Boolean))];
}

function findHouseLord(
  houses: BuildFunctionalRolesParams["houses"],
  houseNum: number
): string | null {
  return houses.find((h) => h.house === houseNum)?.lord ?? null;
}

function getBadhakaHouse(signNum: number): number {
  if (MOVABLE_SIGNS.has(signNum)) return 11;
  if (FIXED_SIGNS.has(signNum)) return 9;
  if (DUAL_SIGNS.has(signNum)) return 7;
  return 0;
}

export async function buildFunctionalRoles(
  params: BuildFunctionalRolesParams
) {
  const { ascendant, houses } = params;

  const lord2 = findHouseLord(houses, 2);
  const lord7 = findHouseLord(houses, 7);
  const lordBadhaka = findHouseLord(houses, getBadhakaHouse(ascendant.signNum));

  // This is intentionally simple for V1.
  // Later you can refine yogakaraka / benefic / malefic logic.
  const kendraLords = [1, 4, 7, 10]
    .map((h) => findHouseLord(houses, h))
    .filter(Boolean) as string[];

  const trikonaLords = [1, 5, 9]
    .map((h) => findHouseLord(houses, h))
    .filter(Boolean) as string[];

  const dusthanaLords = [6, 8, 12]
    .map((h) => findHouseLord(houses, h))
    .filter(Boolean) as string[];

  const yogakaraka = unique(
    trikonaLords.filter((p) => kendraLords.includes(p))
  );

  const maraka = unique([lord2 || "", lord7 || ""]);
  const badhaka = unique([lordBadhaka || ""]);

  const functionalBenefics = unique([
    ...trikonaLords,
    ...yogakaraka,
  ]);

  const functionalMalefics = unique([
    ...dusthanaLords,
    ...maraka,
    ...badhaka,
  ]).filter((p) => !functionalBenefics.includes(p));

  return {
    yogakaraka,
    maraka,
    badhaka,
    functionalBenefics,
    functionalMalefics,
  };
}