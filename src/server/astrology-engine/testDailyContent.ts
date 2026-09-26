import { generateDailyPredictionContent } from "./generators/dailyPredictionGenerator";
import { judgeAllAscendants } from "./judgement/ascendantJudgementEngine";
import {
  enrichSkyInputWithPlanetContacts,
} from "./core/aspectResolver";
import {
  getPlanetContactInterpretation,
} from "./knowledge/planetContacts";
const output = generateDailyPredictionContent({
  date: "7 July 2026",
  moon: {
  sign: "Pisces",
  nakshatra: "Uttara Bhadrapada",
  nextNakshatra: {
    name: "Revati",
    time: "5:10 PM",
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
});

console.log(JSON.stringify(output, null, 2));
const debugInput = {
  date: "7 July 2026",

  moon: {
    sign: "Pisces" as const,
    nakshatra: "Uttara Bhadrapada",

  },

  planets: {
    Mars: {
      sign: "Taurus" as const,
      nakshatra: "Rohini",
    },

    Mercury: {
      sign: "Cancer" as const,
      conjunctions: ["Jupiter" as const],
    },

    Jupiter: {
      sign: "Cancer" as const,
      conjunctions: ["Mercury" as const],
    },

    Venus: {
      sign: "Leo" as const,
    },

    Saturn: {
      sign: "Pisces" as const,
    },

    Rahu: {
      sign: "Aquarius" as const,
    },

    Ketu: {
      sign: "Leo" as const,
    },
  },
};

const enrichedDebugInput =
  enrichSkyInputWithPlanetContacts(debugInput);

const judgements =
  judgeAllAscendants(enrichedDebugInput);
console.log("\nFUNCTIONAL ROLE IMPORTANCE TEST");
console.log("--------------------------------");

for (const ascendant of [
  "Aries",
  "Taurus",
  "Libra",
  "Capricorn",
  "Aquarius",
] as const) {
  const judgement = judgements.find(
    (item) => item.ascendant === ascendant
  );

  const planetHouseSignals =
    judgement?.signals.filter(
      (signal) => signal.source === "planet_house"
    ) ?? [];

  console.log(`\n${ascendant}`);

  for (const signal of planetHouseSignals) {
    console.log({
      id: signal.id,
      importance: signal.importance,
      polarity: signal.polarity,
    });
  }
}
const ariesContactSignals = judgements
  .find((judgement) => judgement.ascendant === "Aries")
  ?.signals.filter(
    (signal) => signal.source === "planet_contact"
  );

console.log(
  "ARIES PLANET CONTACT SIGNALS:",
  JSON.stringify(ariesContactSignals, null, 2)
);
import {
  PLANET_CONTACTS,
} from "./knowledge/planetContacts";

console.log(
  "CURATED PLANET CONTACT COUNT:",
  Object.keys(PLANET_CONTACTS).length
);

console.log(
  "CURATED PLANET CONTACT KEYS:",
  Object.keys(PLANET_CONTACTS)
);
const ariesMoonConditionSignals = judgements
  .find((judgement) => judgement.ascendant === "Aries")
  ?.signals.filter(
    (signal) => signal.source === "moon_condition"
  );

console.log(
  "ARIES MOON CONDITION SIGNALS:",
  JSON.stringify(ariesMoonConditionSignals, null, 2)
);
console.log("\nFUNCTIONAL ROLE REASON TEST");
console.log("-----------------------------");

for (const ascendant of [
  "Taurus",
  "Libra",
  "Capricorn",
  "Aquarius",
] as const) {
  const judgement = judgements.find(
    (item) => item.ascendant === ascendant
  );

  const relevantSignals =
    judgement?.signals
      .filter(
        (signal) =>
          signal.source === "planet_house"
      )
      .filter((signal) =>
        signal.reasons.some(
          (reason) =>
            reason.includes("yogakaraka") ||
            reason.includes("functionally")
        )
      ) ?? [];

  console.log(`\n${ascendant}`);

  for (const signal of relevantSignals) {
    console.log({
      id: signal.id,
      importance: signal.importance,
      polarity: signal.polarity,
      functionalReason: signal.reasons.find(
        (reason) =>
          reason.includes("yogakaraka") ||
          reason.includes("functionally")
      ),
    });
  }
}
console.log("\nPLANET HOUSE BASE POLARITY TEST");
console.log("--------------------------------");

for (const ascendant of [
  "Taurus",
  "Libra",
  "Capricorn",
  "Aquarius",
] as const) {
  const judgement = judgements.find(
    (item) => item.ascendant === ascendant
  );

  const planetHouseSignals =
    judgement?.signals.filter(
      (signal) => signal.source === "planet_house"
    ) ?? [];

  console.log(`\n${ascendant}`);

  for (const signal of planetHouseSignals) {
    console.log({
      id: signal.id,
      importance: signal.importance,
      polarity: signal.polarity,
    });
  }
}
console.log("\nPLANET LORDSHIP POLARITY TEST");
console.log("--------------------------------");

for (const ascendant of [
  "Taurus",
  "Libra",
  "Capricorn",
  "Aquarius",
] as const) {
  const judgement = judgements.find(
    (item) => item.ascendant === ascendant
  );

  const lordshipSignals =
    judgement?.signals.filter(
      (signal) => signal.source === "planet_lordship"
    ) ?? [];

  console.log(`\n${ascendant}`);

  for (const signal of lordshipSignals) {
    console.log({
      id: signal.id,
      importance: signal.importance,
      polarity: signal.polarity,
    });
  }
}
console.log("\nLORDSHIP SCORE DETAIL TEST");
console.log("--------------------------------");

const lordshipTestIds = [
  "Capricorn_venus_5_lord_in_8",
  "Capricorn_venus_10_lord_in_8",
  "Aquarius_venus_4_lord_in_7",
  "Aquarius_venus_9_lord_in_7",
];

for (const judgement of judgements) {
  for (const signal of judgement.signals) {
    if (!lordshipTestIds.includes(signal.id)) {
      continue;
    }

    console.log({
      id: signal.id,
      polarity: signal.polarity,
      reasons: signal.reasons,
    });
  }
}
console.log("\nPLANET SYNTHESIS GROUPING TEST");
console.log("--------------------------------");

for (const ascendant of [
  "Taurus",
  "Capricorn",
  "Aquarius",
] as const) {
  const judgement = judgements.find(
    (item) => item.ascendant === ascendant
  );

  if (!judgement) continue;

  console.log(`\n${ascendant}`);

  for (const synthesis of judgement.planetSyntheses) {
    console.log({
      planet: synthesis.planet,
      house: synthesis.house,

      baseSignal:
        synthesis.baseSignal?.id ?? null,

      lordshipSignals:
        synthesis.lordshipSignals.map(
          (signal) => signal.id
        ),

      contactSignals:
        synthesis.contactSignals.map(
          (signal) => signal.id
        ),
    });
  }
}
console.log("\nPLANET SYNTHESIS SCORE TEST");
console.log("--------------------------------");

for (const ascendant of [
  "Taurus",
  "Capricorn",
  "Aquarius",
] as const) {
  const judgement = judgements.find(
    (item) => item.ascendant === ascendant
  );

  if (!judgement) continue;

  console.log(`\n${ascendant}`);

  for (const synthesis of judgement.planetSyntheses) {
    console.log({
      planet: synthesis.planet,
      house: synthesis.house,
      score: synthesis.score,
      polarity: synthesis.polarity,
      importance: synthesis.importance,
      basePolarity:
        synthesis.baseSignal?.polarity ?? null,
      lordshipPolarities:
        synthesis.lordshipSignals.map(
          (signal) => signal.polarity
        ),
      contactPolarities:
        synthesis.contactSignals.map(
          (signal) => signal.polarity
        ),
    });
  }
}
console.log("\nPLANET CONTACT KNOWLEDGE TEST");
console.log("--------------------------------");

const contactTests = [
  ["Saturn", "Jupiter", "aspect"],
  ["Venus", "Mars", "aspect"],
  ["Venus", "Ketu", "conjunction"],
  ["Mercury", "Jupiter", "conjunction"],
] as const;

for (const [
  planet,
  contactPlanet,
  contactType,
] of contactTests) {
  const contact =
    getPlanetContactInterpretation(
      planet,
      contactPlanet,
      contactType
    );

  console.log({
    planet,
    contactPlanet,
    contactType,
    curated: contact.curated,
    principle: contact.principle,
    synthesis: contact.synthesis,
    supportiveEffects:
      contact.supportiveEffects,
    cautionEffects:
      contact.cautionEffects,
    confidence: contact.confidence,
  });
}
console.log("\nPLANET SYNTHESIS MESSAGE TEST");
console.log("--------------------------------");

for (const ascendant of [
  "Taurus",
  "Capricorn",
  "Aquarius",
] as const) {
  const judgement = judgements.find(
    (item) => item.ascendant === ascendant
  );

  if (!judgement) continue;

  console.log(`\n${ascendant}`);

  for (const synthesis of judgement.planetSyntheses) {
    console.log({
      planet: synthesis.planet,
      house: synthesis.house,
      score: synthesis.score,
      polarity: synthesis.polarity,
      message: synthesis.message,
    });
  }
}
console.log("\nFINAL RANKING WITH PLANET SYNTHESIS");
console.log("--------------------------------");

for (const ascendant of [
  "Taurus",
  "Capricorn",
  "Aquarius",
] as const) {
  const judgement = judgements.find(
    (item) => item.ascendant === ascendant
  );

  if (!judgement) continue;

  console.log(`\n${ascendant}`);

  for (const signal of judgement.rankedSignals) {
    console.log({
      source: signal.source,
      area: signal.area,
      importance: signal.importance,
      polarity: signal.polarity,
      message: signal.message,
    });
  }
}