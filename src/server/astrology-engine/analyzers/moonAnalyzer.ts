import type { PlanetName, ZodiacSign } from "../types";
import { NAKSHATRA_KNOWLEDGE } from "../knowledge/nakshatras";

export type MoonInput = {
  sign: ZodiacSign;
  degree?: number;
  nakshatra: string;
  pada?: number;
  nextNakshatra?: {
    name: string;
    time: string;
    pada?: number;
  };
  conjunctions?: PlanetName[];
  aspectsFrom?: PlanetName[];
};

export type MoonAnalysis = {
  sign: ZodiacSign;
  degree?: number;
  nakshatra: string;
  nakshatraLord?: string;
  pada?: number;
  nextNakshatra?: {
    name: string;
    time: string;
    pada?: number;
  };
  conjunctions: PlanetName[];
  aspectsFrom: PlanetName[];
  pressurePlanets: PlanetName[];
  supportPlanets: PlanetName[];
  pressureScore: number;
  supportScore: number;
  condition: "supported" | "pressured" | "mixed" | "neutral";
  summary: string;
};

const PRESSURE_PLANETS: PlanetName[] = ["Saturn", "Mars", "Rahu", "Ketu"];
const SUPPORT_PLANETS: PlanetName[] = ["Jupiter", "Venus", "Mercury"];

export function analyzeMoon(moon: MoonInput): MoonAnalysis {
  const conjunctions = moon.conjunctions ?? [];
  const aspectsFrom = moon.aspectsFrom ?? [];

  const pressurePlanets = [...conjunctions, ...aspectsFrom].filter((planet) =>
    PRESSURE_PLANETS.includes(planet)
  );

  const supportPlanets = [...conjunctions, ...aspectsFrom].filter((planet) =>
    SUPPORT_PLANETS.includes(planet)
  );

  const pressureScore = pressurePlanets.length * 3;
  const supportScore = supportPlanets.length * 2;

  const condition =
    pressureScore > supportScore && pressureScore >= 3
      ? "pressured"
      : supportScore > pressureScore && supportScore >= 2
        ? "supported"
        : pressureScore > 0 && supportScore > 0
          ? "mixed"
          : "neutral";

  const nakshatraInfo = NAKSHATRA_KNOWLEDGE[moon.nakshatra];

  return {
    sign: moon.sign,
    degree: moon.degree,
    nakshatra: moon.nakshatra,
    nakshatraLord: nakshatraInfo?.lord,
    pada: moon.pada,
    nextNakshatra: moon.nextNakshatra,
    conjunctions,
    aspectsFrom,
    pressurePlanets,
    supportPlanets,
    pressureScore,
    supportScore,
    condition,
    summary: buildMoonSummary({
      moon,
      condition,
      pressurePlanets,
      supportPlanets,
    }),
  };
}

function buildMoonSummary(params: {
  moon: MoonInput;
  condition: MoonAnalysis["condition"];
  pressurePlanets: PlanetName[];
  supportPlanets: PlanetName[];
}) {
  const { moon, condition, pressurePlanets, supportPlanets } = params;

  const base = `Moon is in ${moon.sign}, moving through ${moon.nakshatra}.`;

  const shift = moon.nextNakshatra
    ? ` It shifts to ${moon.nextNakshatra.name} around ${moon.nextNakshatra.time}.`
    : "";

  const pressure =
    pressurePlanets.length > 0
      ? ` It receives pressure from ${pressurePlanets.join(", ")}.`
      : "";

  const support =
    supportPlanets.length > 0
      ? ` It receives support from ${supportPlanets.join(", ")}.`
      : "";

  return `${base}${shift}${pressure}${support} Overall Moon condition is ${condition}.`;
}