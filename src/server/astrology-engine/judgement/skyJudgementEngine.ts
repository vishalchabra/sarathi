import type { PlanetName } from "../types";
import type { DailySkyInput } from "../core/reasoningEngine";
import { analyzeMoon } from "../analyzers/moonAnalyzer";
import { NAKSHATRA_KNOWLEDGE } from "../knowledge/nakshatras";

export type SkyJudgement = {
  date: string;
  dominantEnergy: string;
  energyShift?: string;
  strongestPlanet: PlanetName;
  secondaryPlanet?: PlanetName;
  dominantThemes: string[];
  globalAdvice: string;
  pressureScore: number;
  supportScore: number;
  reasons: string[];
};

export function judgeSky(input: DailySkyInput): SkyJudgement {
  const moon = analyzeMoon(input.moon);
  const nakshatra = NAKSHATRA_KNOWLEDGE[input.moon.nakshatra];
  const nextNakshatra = input.moon.nextNakshatra
    ? NAKSHATRA_KNOWLEDGE[input.moon.nextNakshatra.name]
    : null;

  const hasSaturn = moon.pressurePlanets.includes("Saturn");
  const hasMars = moon.pressurePlanets.includes("Mars");
  const hasRahu = moon.pressurePlanets.includes("Rahu");
  const hasKetu = moon.pressurePlanets.includes("Ketu");
  const hasJupiter = moon.supportPlanets.includes("Jupiter");
const hasVenus = moon.supportPlanets.includes("Venus");
const hasMercury = moon.supportPlanets.includes("Mercury");
  const reasons: string[] = [];
  const dominantThemes = new Set<string>();

  if (nakshatra) {
    nakshatra.keywords.slice(0, 3).forEach((x) => dominantThemes.add(x));
    reasons.push(`Moon begins in ${nakshatra.name}, emphasizing ${nakshatra.keywords.slice(0, 3).join(", ")}.`);
  }

  if (nextNakshatra) {
    nextNakshatra.keywords.slice(0, 3).forEach((x) => dominantThemes.add(x));
    reasons.push(`Moon later enters ${nextNakshatra.name}, adding ${nextNakshatra.keywords.slice(0, 3).join(", ")}.`);
  }

  if (hasSaturn) {
    dominantThemes.add("responsibility");
    dominantThemes.add("patience");
    dominantThemes.add("emotional maturity");
    reasons.push("Saturn influences the Moon, making the day more serious, mature, and responsibility-oriented.");
  }

  if (hasMars) {
    dominantThemes.add("urgency");
    dominantThemes.add("action");
    reasons.push("Mars influences the Moon, increasing urgency and emotional sharpness.");
  }

  if (hasRahu) {
    dominantThemes.add("mental noise");
    dominantThemes.add("desire");
    reasons.push("Rahu influences the Moon, increasing restlessness, desire, or exaggeration.");
  }

  if (hasKetu) {
    dominantThemes.add("detachment");
    dominantThemes.add("withdrawal");
    reasons.push("Ketu influences the Moon, increasing detachment and internalization.");
  }
  if (hasJupiter) {
  dominantThemes.add("perspective");
  dominantThemes.add("guidance");
  reasons.push(
    "Jupiter influences the Moon, bringing perspective, wisdom, guidance, and emotional steadiness."
  );
}

if (hasVenus) {
  dominantThemes.add("harmony");
  dominantThemes.add("emotional ease");
  reasons.push(
    "Venus influences the Moon, bringing emotional softness, harmony, comfort, and cooperation."
  );
}

if (hasMercury) {
  dominantThemes.add("clarity");
  dominantThemes.add("communication");
  reasons.push(
    "Mercury influences the Moon, helping emotions become easier to understand, organize, and communicate."
  );
}
  const dominantEnergy = buildDominantEnergy({
  hasSaturn,
  hasMars,
  hasRahu,
  hasKetu,
  hasSupport: moon.supportPlanets.length > 0,
  nakshatraName: input.moon.nakshatra,
  nextNakshatraName: input.moon.nextNakshatra?.name,
});

  return {
    date: input.date,
    dominantEnergy,
    energyShift: buildEnergyShift(input),
    strongestPlanet: "Moon",
    secondaryPlanet: hasSaturn
      ? "Saturn"
      : hasMars
        ? "Mars"
        : hasRahu
          ? "Rahu"
          : hasKetu
            ? "Ketu"
            : undefined,
    dominantThemes: [...dominantThemes].slice(0, 6),
    globalAdvice: buildGlobalAdvice({
  hasSaturn,
  hasMars,
  hasRahu,
  hasKetu,
  hasSupport: moon.supportPlanets.length > 0,
  hasNextNakshatra: Boolean(input.moon.nextNakshatra),
}),
    pressureScore: moon.pressureScore,
    supportScore: moon.supportScore,
    reasons,
  };
}

function buildDominantEnergy(params: {
  hasSaturn: boolean;
  hasMars: boolean;
  hasRahu: boolean;
  hasKetu: boolean;
  hasSupport: boolean;
  nakshatraName: string;
  nextNakshatraName?: string;
}) {
  if (
  params.hasSaturn &&
  params.hasSupport &&
  params.nextNakshatraName === "Revati"
) {
  return "Responsible completion with supportive perspective";
}

if (params.hasSaturn && params.hasSupport) {
  return "Serious reflection with constructive support";
}
  if (params.hasSaturn && params.nextNakshatraName === "Revati") {
    return "Completion with responsibility";
  }

  if (params.hasSaturn) {
    return "Reflection before action";
  }

  if (params.hasMars) {
    return "Action with emotional control";
  }

  if (params.hasRahu) {
    return "Desire with discernment";
  }

  if (params.hasKetu) {
    return "Detachment and inner clarity";
  }

  return "Emotional awareness and steady movement";
}

function buildEnergyShift(input: DailySkyInput): string | undefined {
  if (!input.moon.nextNakshatra) return undefined;

  return `After ${input.moon.nextNakshatra.time}, Moon moves from ${input.moon.nakshatra} to ${input.moon.nextNakshatra.name}, changing the tone of the day without changing the activated house.`;
}

function buildGlobalAdvice(params: {
  hasSaturn: boolean;
  hasMars: boolean;
  hasRahu: boolean;
  hasKetu: boolean;
  hasSupport: boolean;
  hasNextNakshatra: boolean;
}) {
  if (params.hasSaturn && params.hasSupport) {
    return "Move patiently and handle responsibilities carefully, while using available guidance and perspective to make constructive decisions.";
  }

  if (params.hasSaturn) {
    return "Move patiently, complete pending matters, and avoid emotional reactions to delays.";
  }

  if (params.hasMars) {
    return "Use the energy for action, but avoid arguments and rushed decisions.";
  }

  if (params.hasRahu) {
    return "Avoid exaggeration, comparison, and anxiety-driven choices.";
  }

  if (params.hasKetu) {
    return "Use solitude constructively and avoid withdrawing without communication.";
  }

  if (params.hasNextNakshatra) {
    return "Notice the shift in tone and adjust your decisions accordingly.";
  }

  return "Stay emotionally aware and keep the day practical.";
}