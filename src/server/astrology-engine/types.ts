export type PlanetName =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export type LifeArea =
  | "career"
  | "money"
  | "relationships"
  | "health"
  | "mind"
  | "family"
  | "home"
  | "children"
  | "travel"
  | "spirituality"
  | "education"
  | "publicImage"
  | "hiddenMatters"
  | "communication"
  | "property";

export type InfluencePolarity = "supportive" | "challenging" | "mixed" | "neutral";

export type AstrologyInfluence = {
  id: string;
  source:
    | "moon_house"
    | "moon_lordship"
    | "moon_nakshatra"
    | "moon_condition"
    | "planetary_context"
    | "degree_context";

  area: LifeArea;
  polarity: InfluencePolarity;
  intensity: number; // 1-10
  confidence: number; // 1-10
  keywords: string[];
  reasoning: string;
  advice?: string;
};

export type SynthesizedPrediction = {
  ascendant: ZodiacSign;
  date: string;
  moonHouse: number;
  moonLordship: number;
  dominantAreas: LifeArea[];
  emotionalTone: string;
  opportunities: AstrologyInfluence[];
  cautions: AstrologyInfluence[];
  neutralThemes: AstrologyInfluence[];
  finalMessage: string;
  bestUse: string;
};