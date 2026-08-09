import type { AstrologyEvidence } from "./evidence";

export type PlanetName =
  | "Sun" | "Moon" | "Mars" | "Mercury"
  | "Jupiter" | "Venus" | "Saturn"
  | "Rahu" | "Ketu";

export type Dignity =
  | "exalted"
  | "moolatrikona"
  | "own"
  | "friend"
  | "neutral"
  | "enemy"
  | "debilitated"
  | "unknown";

export type HouseFact = {
  house: number;
  sign: string;
  lord: PlanetName;
  occupants: PlanetName[];
  evidenceIds: string[];
};

export type AspectFact = {
  from: PlanetName;
  to: PlanetName;
  type: "full" | "special" | "graha_drishti" | "rashi_drishti";
  strength: number;
  evidenceIds: string[];
};

export type SambandhaFact = {
  planets: PlanetName[];
  relationship:
    | "conjunction"
    | "mutual_aspect"
    | "exchange"
    | "dispositor"
    | "nakshatra"
    | "combined";
  strength: number;
  evidenceIds: string[];
};

export type VargaPlacement = {
  chart: string;
  sign: string | null;
  house: number | null;
  dignity: Dignity;
  evidenceIds: string[];
};

export type PlanetFact = {
  planet: PlanetName;
  sign: string;
  house: number;
  degree: number;
  nakshatra: string;
  pada: number | null;
  ownsHouses: number[];
  dispositor: PlanetName | null;
  nakshatraLord: PlanetName | null;
  retrograde: boolean;
  combust: boolean;
  vargottama: boolean;
  dignity: Dignity;
  conjunctions: PlanetName[];
  aspectsGiven: AspectFact[];
  aspectsReceived: AspectFact[];
  vargas: VargaPlacement[];
  strengthScore: number;
  currentDashaActive: boolean;
  currentTransitActive: boolean;
  futureActivationWindows: string[];
  evidenceIds: string[];
};

export type YogaFact = {
  name: string;
  active: boolean;
  strength: number;
  evidenceIds: string[];
};

export type DashaFact = {
  mahadasha: PlanetName;
  antardasha: PlanetName;
  pratyantardasha?: PlanetName;
  start?: string;
  end?: string;
  evidenceIds: string[];
};

export type TransitFact = {
  planet: PlanetName;
  sign: string;
  house: number;
  degree: number;
  evidenceIds: string[];
};

export type ChartFacts = {
  chartId: string;
  ascendantSign: string;
  ascendantDegree: number;
  ayanamsha?: string;
  planets: PlanetFact[];
  houses: HouseFact[];
  sambandhas: SambandhaFact[];
  yogas: YogaFact[];
  dasha: DashaFact;
  transits: TransitFact[];
  evidence: AstrologyEvidence[];
  warnings: string[];
};
