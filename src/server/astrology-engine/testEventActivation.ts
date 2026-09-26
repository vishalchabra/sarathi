import type {
  DailySkyInput,
} from "./core/reasoningEngine";

import {
  enrichSkyInputWithPlanetContacts,
} from "./core/aspectResolver";

import {
  judgeAllAscendants,
} from "./judgement/ascendantJudgementEngine";

import {
  resolveDashaActivation,
} from "./knowledge/dashaActivation";

import {
  synthesizeDashaTransit,
} from "./judgement/dashaTransitSynthesis";

import {
  buildEventActivations,
} from "./judgement/eventActivationEngine";
import {
  buildDailyPriorities,
} from "./judgement/dailyPriorityEngine";
import {
  buildDailyPrediction,
} from "./judgement/dailyPredictionEngine";
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

const enrichedSky =
  enrichSkyInputWithPlanetContacts(sky);

const judgements =
  judgeAllAscendants(enrichedSky);

const taurusJudgement =
  judgements.find(
    (judgement) =>
      judgement.ascendant === "Taurus"
  );

if (!taurusJudgement) {
  throw new Error(
    "Taurus judgement not found."
  );
}

const dasha =
  resolveDashaActivation({
    ascendant: "Taurus",

    mahadasha: "Rahu",
    antardasha: "Venus",
    pratyantardasha: "Sun",

    natalPositions: {
      Rahu: {
        sign: "Capricorn",
        house: 9,
      },

      Venus: {
        sign: "Leo",
        house: 4,
      },

      Sun: {
        sign: "Virgo",
        house: 5,
      },
    },
  });

const synthesis =
  synthesizeDashaTransit(
    dasha,
    taurusJudgement
  );

const events =
  buildEventActivations({
    dasha,
    transit: taurusJudgement,
    synthesis,
  });

console.log(
  "\nEVENT ACTIVATION TEST"
);

console.log(
  "---------------------"
);

console.dir(
  events,
  {
    depth: null,
  }
);
const dailyPriorities =
  buildDailyPriorities(
    events.activations
  );
const dailyPrediction =
  buildDailyPrediction(
    dailyPriorities
  );
console.log(
  "\nDAILY PRIORITIES\n"
);

console.dir(
  dailyPriorities,
  {
    depth: null,
  }
);
console.log(
  "\nDAILY PERSONALIZED PREDICTION\n"
);

console.dir(
  dailyPrediction,
  {
    depth: null,
  }
);