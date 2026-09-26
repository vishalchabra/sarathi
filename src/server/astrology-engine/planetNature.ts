import type { LifeArea } from "./types";

export type PlanetNatureKnowledge = {
  planet: string;

  coreNature: string;
  principle: string;
  psychology: string;

  naturalKarakatwas: string[];
  supportiveThemes: string[];
  challengingThemes: string[];

  primaryAreas: LifeArea[];

  higherExpression: string;
  lowerExpression: string;

  dailyExpression: string;
  lifeReportInterpretation: string;

  confidence: number;
};

export const PLANET_NATURE: Record<string, PlanetNatureKnowledge> = {};