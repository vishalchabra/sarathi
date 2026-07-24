import type { ZodiacSign } from "../types";
import { HOUSE_KNOWLEDGE } from "../knowledge/houses";
import { MOON_LORDSHIP_KNOWLEDGE } from "../knowledge/moonLordship";
import { ordinal } from "../utils/ordinal";
export type AscendantAnalysis = {
  ascendant: ZodiacSign;
  moonHouse: number;
  moonLordshipHouse: number;
  houseName: string;
  houseKeywords: string[];
  lordshipThemes: string[];
  housePrimaryAreas: string[];
  lordshipPrimaryAreas: string[];
  activationSummary: string;
};

const SIGNS: ZodiacSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export function houseFromAscendant(
  ascendant: ZodiacSign,
  transitSign: ZodiacSign
): number {
  const ascIndex = SIGNS.indexOf(ascendant);
  const signIndex = SIGNS.indexOf(transitSign);

  if (ascIndex === -1 || signIndex === -1) {
    throw new Error(`Invalid ascendant/sign: ${ascendant}, ${transitSign}`);
  }

  return ((signIndex - ascIndex + 12) % 12) + 1;
}

export function analyzeAscendantMoonTransit(params: {
  ascendant: ZodiacSign;
  moonSign: ZodiacSign;
}): AscendantAnalysis {
  const moonHouse = houseFromAscendant(params.ascendant, params.moonSign);
  const house = HOUSE_KNOWLEDGE[moonHouse];
  const lordship = MOON_LORDSHIP_KNOWLEDGE[params.ascendant];

  return {
    ascendant: params.ascendant,
    moonHouse,
    moonLordshipHouse: lordship.moonLordshipHouse,
    houseName: house.name,
    houseKeywords: house.keywords,
    lordshipThemes: lordship.ruledThemes,
    housePrimaryAreas: house.primaryAreas,
    lordshipPrimaryAreas: lordship.primaryAreas,
    activationSummary: `For ${params.ascendant}, Moon rules the ${ordinal(lordship.moonLordshipHouse)} house and transits the ${ordinal(moonHouse)} house, activating ${house.name.toLowerCase()}.`,
  };
}