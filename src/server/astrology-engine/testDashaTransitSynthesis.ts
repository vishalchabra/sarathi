import {
  resolveDashaActivation,
} from "./knowledge/dashaActivation";

import {
  synthesizeDashaTransit,
} from "./judgement/dashaTransitSynthesis";

import {
  judgeAllAscendants,
} from "./judgement/ascendantJudgementEngine";

import {
  enrichSkyInputWithPlanetContacts,
} from "./core/aspectResolver";

import type {
  DailySkyInput,
} from "./core/reasoningEngine";

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

const ascendantJudgements =
  judgeAllAscendants(enrichedSky);

const taurusJudgement =
  ascendantJudgements.find(
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

console.log(
  "\nDASHA × TRANSIT SYNTHESIS TEST"
);

console.log(
  "--------------------------------"
);

console.dir(
  synthesis,
  {
    depth: null,
  }
);