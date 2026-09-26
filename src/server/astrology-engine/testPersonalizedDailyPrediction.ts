import type {
  DailySkyInput,
} from "./core/reasoningEngine";

import {
  generatePersonalizedDailyPrediction,
} from "./personalizedDailyPredictionGenerator";
import {
  resolveNatalSambandha,
} from "./knowledge/natalSambandhaResolver";

import {
  resolveDashaActivation,
} from "./knowledge/dashaActivation";

import {
  resolveDashaSambandha,
} from "./knowledge/dashaSambandhaResolver";

import {
  resolveEventSambandha,
} from "./knowledge/eventSambandhaResolver";

import {
  hasDualActiveSambandha,
  getUniqueSambandhaActivePlanets,
} from "./knowledge/sambandhaEvidence";
import {
  getEventSambandhaBonus,
} from "./knowledge/sambandhaEvidence";
import assert from "node:assert/strict";
const sky: DailySkyInput = {
  date: "2026-07-07",

  moon: {
    sign: "Pisces",
    nakshatra: "Uttara Bhadrapada",

    nextNakshatra: {
      name: "Revati",
      time: "17:10",
    },
  },

  planets: {
    Sun: {
      sign: "Gemini",
    },

    Mars: {
      sign: "Taurus",
      nakshatra: "Rohini",
    },

    Mercury: {
      sign: "Cancer",
    },

    Jupiter: {
      sign: "Cancer",
    },

    Venus: {
      sign: "Leo",
    },

    Saturn: {
      sign: "Pisces",
    },

    Rahu: {
      sign: "Aquarius",
    },

    Ketu: {
      sign: "Leo",
    },
  },
};

const prediction =
  generatePersonalizedDailyPrediction({
    selectedDateISO: "2026-09-23",
    profileKey: "test-taurus-profile",
    sky,

    ascendant: "Virgo",

  dasha: {
  mahadasha: "Rahu",
  antardasha: "Venus",
  pratyantardasha: "Mercury",
},

    natalPositions: {
  Sun: { sign: "Capricorn", house: 5 },
  Moon: { sign: "Leo", house: 12 },
  Mars: { sign: "Libra", house: 2 },
  Mercury: { sign: "Sagittarius", house: 4 },
  Jupiter: { sign: "Sagittarius", house: 4 },
  Venus: { sign: "Sagittarius", house: 4 },
  Saturn: { sign: "Libra", house: 2 },
  Rahu: { sign: "Taurus", house: 9 },
  Ketu: { sign: "Scorpio", house: 3 },
},
  });

console.log(
  "\nPRODUCTION PERSONALIZED DAILY PREDICTION\n"
);

console.dir(
  prediction,
  {
    depth: null,
  }
);
const natal = resolveNatalSambandha({
  ascendant: "Virgo",
  planets: {
    Sun: { sign: "Capricorn", house: 5 },
    Moon: { sign: "Leo", house: 12 },
    Mars: { sign: "Libra", house: 2 },
    Mercury: { sign: "Sagittarius", house: 4 },
    Jupiter: { sign: "Sagittarius", house: 4 },
    Venus: { sign: "Sagittarius", house: 4 },
    Saturn: { sign: "Libra", house: 2 },
    Rahu: { sign: "Taurus", house: 9 },
    Ketu: { sign: "Scorpio", house: 3 },
  },
});

const dashaActivation = resolveDashaActivation({
  ascendant: "Virgo",
  mahadasha: "Rahu",
  antardasha: "Venus",
  pratyantardasha: "Mercury",
  natalPositions: {
    Sun: { sign: "Capricorn", house: 5 },
    Moon: { sign: "Leo", house: 12 },
    Mars: { sign: "Libra", house: 2 },
    Mercury: { sign: "Sagittarius", house: 4 },
    Jupiter: { sign: "Sagittarius", house: 4 },
    Venus: { sign: "Sagittarius", house: 4 },
    Saturn: { sign: "Libra", house: 2 },
    Rahu: { sign: "Taurus", house: 9 },
    Ketu: { sign: "Scorpio", house: 3 },
  },
});

const connections = resolveDashaSambandha(
  dashaActivation,
  natal
);

const moneyEvidence = resolveEventSambandha({
  primaryHouses: [2, 11],
  supportingHouses: [5, 9, 10],
  connections,
});

console.log("\nMONEY INFLOW SAMBANDHA CHECK");

console.dir(
  {
    connections: moneyEvidence,
    uniqueActivePlanets:
      getUniqueSambandhaActivePlanets(moneyEvidence),
    hasDualActiveSambandha:
      hasDualActiveSambandha(moneyEvidence),
  },
  { depth: null }
);
const controlledTimingScore = 60;

const controlledBonus = getEventSambandhaBonus(
  moneyEvidence,
  [2],
  controlledTimingScore
);

const belowThresholdBonus = getEventSambandhaBonus(
  moneyEvidence,
  [2],
  59
);

console.log("\nCONTROLLED SAMBANDHA BONUS CHECK");

console.dir({
  event: "money_inflow",
  timingScore: controlledTimingScore,
  matchedPrimaryHouses: [2],
  dualActive: hasDualActiveSambandha(moneyEvidence),
  bonusAt60: controlledBonus,
  bonusAt59: belowThresholdBonus,
});
const careerTiePrediction =
  generatePersonalizedDailyPrediction({
    selectedDateISO: "2026-09-23",
    profileKey: "career-tie-regression",
    sky,

    ascendant: "Taurus",

    dasha: {
      mahadasha: "Rahu",
      antardasha: "Venus",
      pratyantardasha: "Sun",
    },

    natalPositions: {
      Rahu: { sign: "Capricorn", house: 9 },
      Venus: { sign: "Leo", house: 4 },
      Sun: { sign: "Virgo", house: 5 },
    },
  });

console.log("\nCAREER TIE END-TO-END CHECK\n");
console.dir(careerTiePrediction.primaryTheme, {
  depth: null,
});

assert.equal(
  careerTiePrediction.primaryTheme?.area,
  "career",
);

assert.equal(
  careerTiePrediction.primaryTheme?.manifestationId,
  null,
);

assert.match(
  careerTiePrediction.primaryTheme?.prediction ?? "",
  /career movement or career change/i,
);

console.log("Career tie end-to-end regression passed.");
