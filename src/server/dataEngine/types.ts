export type DataEnginePlan = "light" | "pro";

export type BirthInput = {
  name?: string;
  dateISO: string;
  time: string;
  timezone: string;
  lat: number;
  lon: number;
};

export type AscendantData = {
  sign: string;
  signNum: number;
  degree: number;
  house: 1;
};

export type NatalPlanetRow = {
  planet: string;
  sign: string;
  signNum: number;
  degree: number;
  house: number;
  nakshatra?: string;
  pada?: number;
  retrograde?: boolean;
  combust?: boolean;
  lordships?: number[];
};

export type HouseRow = {
  house: number;
  sign: string;
  signNum: number;
  lord: string;
  lordPlacedHouse: number | null;
  lordPlacedSign: string | null;
};

export type FunctionalRoles = {
  yogakaraka: string[];
  maraka: string[];
  badhaka: string[];
  functionalBenefics: string[];
  functionalMalefics: string[];
};

export type TransitPlanetRow = {
  planet: string;
  sign: string;
  signNum: number;
  degree: number;
  houseFromLagna: number;
  retrograde?: boolean;
  nakshatra?: string;
};

export type TransitContactRow = {
  transitPlanet: string;
  natalTarget: string;
  type: string;
  orb?: number | null;
  applying?: boolean | null;
};
export type PanchangData = {
  dateISO: string;
  weekday: string;
  tithi?: string | null;
  nakshatra?: string | null;
  yoga?: string | null;
  karana?: string | null;
  sunrise?: string | null;
  sunset?: string | null;
};

export type MoonContextData = {
  sign?: string | null;
  nakshatra?: string | null;
  houseFromLagna?: number | null;
  houseFromMoon?: number | null;
};