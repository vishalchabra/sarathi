import "server-only";

import type { BirthInput, DataEnginePlan } from "./types";

type BuildVargaDataParams = {
  birth: BirthInput;
  plan: DataEnginePlan;
};

export async function buildVargaData(params: BuildVargaDataParams) {
  const { plan, birth } = params;

  const base = {
    D9: {
      ascendant: {
        sign: "Cancer",
        signNum: 4,
        degree: 8.22,
      },
      planets: [],
    },
    D10: {
      ascendant: {
        sign: "Libra",
        signNum: 7,
        degree: 17.31,
      },
      planets: [],
    },
  };

  if (plan === "light") {
    return base;
  }

  return {
    ...base,
    D2: {
      ascendant: {
        sign: "Leo",
        signNum: 5,
        degree: 3.1,
      },
      planets: [],
    },
    D3: {
      ascendant: {
        sign: "Scorpio",
        signNum: 8,
        degree: 12.9,
      },
      planets: [],
    },
    D7: {
      ascendant: {
        sign: "Pisces",
        signNum: 12,
        degree: 4.8,
      },
      planets: [],
    },
    D12: {
      ascendant: {
        sign: "Virgo",
        signNum: 6,
        degree: 6.7,
      },
      planets: [],
    },
    _sourceNote: `Stub varga data for ${birth.dateISO}`,
  };
}