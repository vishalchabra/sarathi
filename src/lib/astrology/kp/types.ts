export type KpAspectCode =
  | "CONJ"
  | "SEXT"
  | "SQUR"
  | "TRIN"
  | "OPPN"
  | "QCUN"
  | "SSQU"
  | "SESQ"
  | "SQQD"
  | "QUIN"
  | "NONL";

export type KpPlanetOnCuspHit = {
  planet: string;
  planetLon: number;
  cusp: number;
  cuspLon: number;
  exactAngle: number;
  aspectAngle: number;
  aspectCode: string;
  orb: number;
  applying?: boolean | null;
};

export type KpCuspEntry = {
  cusp: number;
  lon: number;
  sign: string;
  degreeInSign: number;
  nakshatra?: string | null;
  pada?: number | null;
  starLord?: string | null;
  subLord?: string | null;
  subSubLord?: string | null;
  hits: KpPlanetOnCuspHit[];
};

export type KpPlanetOnCuspData = {
  system: "KP";
  zodiac: "sidereal" | "tropical";
  ayanamsa?: string | null;
  aspectSet: {
    code: string;
    angle: number;
    maxOrb: number;
  }[];
  cusps: KpCuspEntry[];
  generatedAt?: string;
};