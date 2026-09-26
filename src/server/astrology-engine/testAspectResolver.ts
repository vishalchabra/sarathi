import {
  doesPlanetAspectSign,
  enrichSkyInputWithPlanetContacts,
  getAspectHouseBetweenSigns,
  resolvePlanetAspects,
  resolvePlanetConjunctions,
  signAtAspectDistance,
} from "./core/aspectResolver";

console.log(
  "Mars 4th aspect from Aries:",
  signAtAspectDistance("Aries", 4)
);

console.log(
  "Distance Aries -> Cancer:",
  getAspectHouseBetweenSigns("Aries", "Cancer")
);

console.log(
  "Mars aspects Cancer from Aries:",
  doesPlanetAspectSign(
    "Mars",
    "Aries",
    "Cancer"
  )
);

console.log(
  "Jupiter aspects Cancer from Aries:",
  doesPlanetAspectSign(
    "Jupiter",
    "Aries",
    "Cancer"
  )
);

const aspects = resolvePlanetAspects({
  Mars: { sign: "Aries" },
  Venus: { sign: "Cancer" },
  Saturn: { sign: "Libra" },
  Jupiter: { sign: "Sagittarius" },
});

console.log(
  "RESOLVED PLANET ASPECTS:",
  JSON.stringify(aspects, null, 2)
);
const enriched = enrichSkyInputWithPlanetContacts({
  date: "test",
  moon: {
    sign: "Taurus",
    nakshatra: "Rohini",
  },
  planets: {
  Mars: {
    sign: "Aries",
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

  Ketu: {
    sign: "Leo",
  },

  Saturn: {
    sign: "Libra",
  },
},
});

console.log(
  "ENRICHED PLANETS:",
  JSON.stringify(enriched.planets, null, 2)
);
const conjunctions = resolvePlanetConjunctions({
  Mercury: { sign: "Cancer" },
  Jupiter: { sign: "Cancer" },
  Mars: { sign: "Taurus" },
  Venus: { sign: "Leo" },
  Ketu: { sign: "Leo" },
});

console.log(
  "RESOLVED PLANET CONJUNCTIONS:",
  JSON.stringify(conjunctions, null, 2)
);
const enrichedWithMoon =
  enrichSkyInputWithPlanetContacts({
    date: "moon-test",

    moon: {
      sign: "Pisces",
      nakshatra: "Uttara Bhadrapada",
    },

    planets: {
      Saturn: {
        sign: "Pisces",
      },

      Jupiter: {
        sign: "Cancer",
      },

      Mars: {
        sign: "Taurus",
      },

      Venus: {
        sign: "Leo",
      },
    },
  });

console.log(
  "ENRICHED MOON:",
  JSON.stringify(enrichedWithMoon.moon, null, 2)
);