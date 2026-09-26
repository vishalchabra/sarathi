
import assert from "node:assert/strict";

import { buildEventActivations } from "../judgement/eventActivationEngine";
import { resolveNatalSambandha } from "../knowledge/natalSambandhaResolver";
import { resolveDashaActivation } from "../knowledge/dashaActivation";
import { resolveDashaSambandha } from "../knowledge/dashaSambandhaResolver";
import type {
  DashaTransitSynthesis,
  DashaTransitAreaSynthesis,
} from "../judgement/dashaTransitSynthesis";
import type { AscendantJudgement } from "../judgement/ascendantJudgementEngine";
import { judgeAscendant } from "../judgement/ascendantJudgementEngine";
import type { DailySkyInput } from "../core/reasoningEngine";
const planets = {
  Sun: { sign: "Capricorn", house: 5 },
  Moon: { sign: "Leo", house: 12 },
  Mars: { sign: "Libra", house: 2 },
  Mercury: { sign: "Sagittarius", house: 4 },
  Jupiter: { sign: "Sagittarius", house: 4 },
  Venus: { sign: "Sagittarius", house: 4 },
  Saturn: { sign: "Libra", house: 2 },
  Rahu: { sign: "Taurus", house: 9 },
  Ketu: { sign: "Scorpio", house: 3 },
} as const;

const natal = resolveNatalSambandha({
  ascendant: "Virgo",
  planets,
});

const dasha = resolveDashaActivation({
  ascendant: "Virgo",
  mahadasha: "Rahu",
  antardasha: "Venus",
  pratyantardasha: "Mercury",
  natalPositions: planets,
});

const activatedSambandha =
  resolveDashaSambandha(dasha, natal);

const mercuryVenus = activatedSambandha.find(
  (connection) =>
    connection.connectionId === "Mercury:Venus"
);

assert.ok(mercuryVenus);
assert.equal(mercuryVenus.activePlanetCount, 2);
// Preserve the real Dasha evidence while controlling
// only the timing score for the integration test.
const careerArea: DashaTransitAreaSynthesis = {
  area: "career",
  dashaScore: 20,
  dashaConfirmationCount: 2,
  strongestTransitImportance: 20,
  transitConfirmationCount: 1,
  transitPlanetConfirmationCount: 1,
  supportiveCount: 1,
  challengingCount: 0,
  mixedCount: 0,
  dashaPlanets: ["Mercury"],
  transitSources: [],
  transitMatches: [],
  timingScore: 60,
  polarityScore: 1,
  timingStrength: "strong",
  activationPolarity: "supportive",
};

function makeSynthesis(
  timingScore: number
): DashaTransitSynthesis {
  return {
    matches: [],
    areaSyntheses: [
      {
        ...careerArea,
        timingScore,
      },
    ],
    strongestAreas: ["career"],
    strongestAreaDetails: [
      {
        area: "career",
        timingScore,
        timingStrength: "strong",
        activationPolarity: "supportive",
      },
    ],
    timingStrength: "strong",
  };
}
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
    Sun: { sign: "Gemini" },
    Mars: { sign: "Taurus", nakshatra: "Rohini" },
    Mercury: { sign: "Cancer" },
    Jupiter: { sign: "Cancer" },
    Venus: { sign: "Leo" },
    Saturn: { sign: "Pisces" },
    Rahu: { sign: "Aquarius" },
    Ketu: { sign: "Leo" },
  },
};

const transit = judgeAscendant(sky, "Virgo");
function runCareerTest(timingScore: number) {
  const result = buildEventActivations({
    dasha,
    transit,
    synthesis: makeSynthesis(timingScore),
    activatedSambandha,
  });

  const career = result.activations.find(
    (activation) => activation.area === "career"
  );

  assert.ok(career, "Career activation must exist");

  const recognition = career.candidateEvents.find(
    (event) => event.id === "career_recognition"
  );

  assert.ok(
    recognition,
    "Career recognition must be generated"
  );

  return recognition.manifestationScore;
}

const score59 = runCareerTest(59);
const score60 = runCareerTest(60);
const diagnosticResult = buildEventActivations({
  dasha,
  transit,
  synthesis: makeSynthesis(60),
  activatedSambandha,
});

const careerEvents = diagnosticResult.activations
  .find((activation) => activation.area === "career")
  ?.candidateEvents;

assert.ok(careerEvents, "Career events must exist");

console.table(
  careerEvents.map((event) => ({
    event: event.id,
    primary: event.matchedPrimaryHouses.join(","),
    supporting: event.matchedSupportingHouses.join(","),
    discriminatorPlanets:
      event.discriminatorPlanetMatches.join(","),
    discriminatorScore: event.discriminatorScore,
    transitDiscriminatorScore:
      event.transitDiscriminatorScore,
    manifestationScore: event.manifestationScore,
  }))
);
assert.equal(
  score59,
  45,
  "Timing 59 must not receive a Sambandha bonus"
);

assert.equal(
  score60,
  50,
  "Timing 60 must receive the Sambandha bonus"
);

assert.equal(
  score60 - score59,
  5,
  "The Sambandha bonus must be applied exactly once"
);

console.log(
  "Production Sambandha integration tests passed."
);
console.log({
  score59,
  score60,
  difference: score60 - score59,
});
console.log("Real transit judgment created.");
console.log(
  "Controlled Mercury–Venus connection verified."
);
const jupiterTransitMatch = {
  area: "career" as const,

  dashaScore: 20,
  dashaConfirmationCount: 2,

  transitImportance: 30,
  transitPolarity: "supportive" as const,
  transitSource: "transit_house",

  transitPlanet: "Jupiter" as const,
  transitHouse: 10,

  timingScore: 60,
  dashaPlanets: ["Mercury" as const],

  reasons: ["Controlled Jupiter transit discriminator test"],
};

const recognitionTestResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [jupiterTransitMatch],
      },
    ],
  },
  activatedSambandha,
});

const recognitionTestEvents =
  recognitionTestResult.activations.find(
    (activation) => activation.area === "career"
  )?.candidateEvents;

assert.ok(recognitionTestEvents);

console.table(
  recognitionTestEvents.map((event) => ({
    event: event.id,
    transitDiscriminatorScore:
      event.transitDiscriminatorScore,
    manifestationScore: event.manifestationScore,
  }))
);
const recognition = recognitionTestEvents.find(
  (event) => event.id === "career_recognition"
);

const movement = recognitionTestEvents.find(
  (event) => event.id === "career_movement"
);

const change = recognitionTestEvents.find(
  (event) => event.id === "career_change"
);

assert.ok(recognition);
assert.ok(movement);
assert.ok(change);

assert.equal(recognition.transitDiscriminatorScore, 7);
assert.equal(movement.transitDiscriminatorScore, 0);
assert.equal(change.transitDiscriminatorScore, 0);

assert.ok(
  recognition.manifestationScore > movement.manifestationScore
);

assert.ok(
  recognition.manifestationScore > change.manifestationScore
);

console.log("Career event discriminator regression test passed.");
const rahuTransitMatch = {
  ...jupiterTransitMatch,
  transitPlanet: "Rahu" as const,
  reasons: ["Controlled Rahu career-change discriminator test"],
};

const rahuTestResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [rahuTransitMatch],
      },
    ],
  },
  activatedSambandha,
});

const rahuCareerEvents = rahuTestResult.activations.find(
  (activation) => activation.area === "career"
)?.candidateEvents;

assert.ok(rahuCareerEvents);

const rahuChange = rahuCareerEvents.find(
  (event) => event.id === "career_change"
);
const rahuRecognition = rahuCareerEvents.find(
  (event) => event.id === "career_recognition"
);

assert.ok(rahuChange);
assert.ok(rahuRecognition);

assert.equal(rahuChange.transitDiscriminatorScore, 7);
assert.equal(rahuRecognition.transitDiscriminatorScore, 0);
assert.ok(
  rahuChange.manifestationScore >
    rahuRecognition.manifestationScore
);

console.table(
  rahuCareerEvents.map((event) => ({
    event: event.id,
    transitDiscriminatorScore: event.transitDiscriminatorScore,
    manifestationScore: event.manifestationScore,
  }))
);

console.log("Rahu career-change discriminator test passed.");
const rahuOutsideCareerHouses = {
  ...rahuTransitMatch,
  transitHouse: 3,
  reasons: ["Controlled Rahu transit outside career event houses"],
};

const outsideHouseResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [rahuOutsideCareerHouses],
      },
    ],
  },
  activatedSambandha,
});

const outsideHouseEvents = outsideHouseResult.activations.find(
  (activation) => activation.area === "career"
)?.candidateEvents;

assert.ok(outsideHouseEvents);

console.table(
  outsideHouseEvents.map((event) => ({
    event: event.id,
    matchedTransitHouses: event.matchedEventHouseTransits
      .map((match) => match.house)
      .join(","),
    transitDiscriminatorScore: event.transitDiscriminatorScore,
    manifestationScore: event.manifestationScore,
  }))
);
for (const event of outsideHouseEvents) {
  assert.equal(
    event.transitDiscriminatorScore,
    0,
    `${event.id} must not receive discriminator points from an unrelated transit house`
  );

  assert.deepEqual(
    event.transitDiscriminatorPlanetMatches,
    [],
    `${event.id} must not report an unrelated transit as discriminator evidence`
  );
}

console.log("Outside-house transit discriminator regression test passed.");
const ketuTransitMatch = {
  ...rahuTransitMatch,
  transitPlanet: "Ketu" as const,
  transitHouse: 10,
  reasons: ["Controlled Ketu career-change discriminator test"],
};

const ketuTestResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [ketuTransitMatch],
      },
    ],
  },
  activatedSambandha,
});

const ketuCareerEvents = ketuTestResult.activations.find(
  (activation) => activation.area === "career"
)?.candidateEvents;

assert.ok(ketuCareerEvents);

const ketuChange = ketuCareerEvents.find(
  (event) => event.id === "career_change"
);

const ketuMovement = ketuCareerEvents.find(
  (event) => event.id === "career_movement"
);

assert.ok(ketuChange);
assert.ok(ketuMovement);

assert.equal(ketuChange.transitDiscriminatorScore, 7);
assert.equal(ketuMovement.transitDiscriminatorScore, 0);

assert.ok(
  ketuChange.manifestationScore >
    ketuMovement.manifestationScore
);

console.table(
  ketuCareerEvents.map((event) => ({
    event: event.id,
    transitDiscriminatorPlanets:
      event.transitDiscriminatorPlanetMatches.join(","),
    transitDiscriminatorScore: event.transitDiscriminatorScore,
    manifestationScore: event.manifestationScore,
  }))
);

console.log("Ketu career-change discriminator regression test passed.");
const ketuSupportingHouseMatch = {
  ...ketuTransitMatch,
  transitHouse: 9,
  reasons: ["Controlled Ketu supporting-house discriminator test"],
};

const supportingHouseResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [ketuSupportingHouseMatch],
      },
    ],
  },
  activatedSambandha,
});

const supportingHouseEvents = supportingHouseResult.activations.find(
  (activation) => activation.area === "career"
)?.candidateEvents;

assert.ok(supportingHouseEvents);

const supportingHouseChange = supportingHouseEvents.find(
  (event) => event.id === "career_change"
);

const supportingHouseResponsibility = supportingHouseEvents.find(
  (event) => event.id === "career_responsibility"
);

assert.ok(supportingHouseChange);
assert.ok(supportingHouseResponsibility);

assert.equal(supportingHouseChange.transitDiscriminatorScore, 7);
assert.deepEqual(
  supportingHouseChange.transitDiscriminatorPlanetMatches,
  ["Ketu"]
);

assert.equal(
  supportingHouseResponsibility.transitDiscriminatorScore,
  0
);

console.table(
  supportingHouseEvents.map((event) => ({
    event: event.id,
    matchedTransitHouses: event.matchedEventHouseTransits
      .map((match) => match.house)
      .join(","),
    transitDiscriminatorScore: event.transitDiscriminatorScore,
    manifestationScore: event.manifestationScore,
  }))
);

console.log("Supporting-house transit discriminator regression test passed.");
const { transitHouse: _omittedHouse, ...ketuWithoutHouse } =
  ketuTransitMatch;

const missingHouseResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [ketuWithoutHouse],
      },
    ],
  },
  activatedSambandha,
});

const missingHouseEvents = missingHouseResult.activations.find(
  (activation) => activation.area === "career"
)?.candidateEvents;

assert.ok(missingHouseEvents);

for (const event of missingHouseEvents) {
  assert.equal(
    event.transitDiscriminatorScore,
    0,
    `${event.id} must not receive discriminator points without a known transit house`
  );

  assert.deepEqual(
    event.transitDiscriminatorPlanetMatches,
    [],
    `${event.id} must not report discriminator evidence without a known transit house`
  );
}

console.log("Missing-house transit discriminator regression test passed.");
const duplicateTransitResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [
          ketuTransitMatch,
          {
            ...ketuTransitMatch,
            transitSource: "transit_aspect",
            reasons: ["Duplicate evidence for the same Ketu transit"],
          },
        ],
      },
    ],
  },
  activatedSambandha,
});

const duplicateCareerEvents = duplicateTransitResult.activations.find(
  (activation) => activation.area === "career"
)?.candidateEvents;

assert.ok(duplicateCareerEvents);

const duplicateKetuChange = duplicateCareerEvents.find(
  (event) => event.id === "career_change"
);

assert.ok(duplicateKetuChange);

console.log("Duplicate transit diagnostic:", {
  evidenceCount:
    duplicateKetuChange.matchedTransitDiscriminatorEvidence.length,
  transitDiscriminatorScore:
    duplicateKetuChange.transitDiscriminatorScore,
});

assert.equal(
  duplicateKetuChange.transitDiscriminatorScore,
  7,
  "The same planet in the same house must not earn discriminator points twice"
);

console.log("Duplicate transit regression test passed.");
const weakerKetuMatch = {
  ...ketuTransitMatch,
  transitImportance: 10,
  transitSource: "transit_aspect",
  reasons: ["Weaker evidence for the same Ketu transit"],
};

for (const transitMatches of [
  [weakerKetuMatch, ketuTransitMatch],
  [ketuTransitMatch, weakerKetuMatch],
]) {
  const result = buildEventActivations({
    dasha,
    transit,
    synthesis: {
      ...makeSynthesis(60),
      areaSyntheses: [
        {
          ...careerArea,
          transitMatches,
        },
      ],
    },
    activatedSambandha,
  });

  const careerChange = result.activations
    .find((activation) => activation.area === "career")
    ?.candidateEvents.find((event) => event.id === "career_change");

  assert.ok(careerChange);

  assert.equal(
    careerChange.transitDiscriminatorScore,
    7,
    "Duplicate transit scoring must use the highest importance"
  );

  assert.equal(careerChange.manifestationScore, 59);
}

console.log("Strongest duplicate transit regression test passed.");
const distinctPlanetResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [
          ketuTransitMatch,
          rahuTransitMatch,
        ],
      },
    ],
  },
  activatedSambandha,
});

const distinctPlanetEvents = distinctPlanetResult.activations.find(
  (activation) => activation.area === "career"
)?.candidateEvents;

assert.ok(distinctPlanetEvents);

const distinctPlanetChange = distinctPlanetEvents.find(
  (event) => event.id === "career_change"
);

assert.ok(distinctPlanetChange);

assert.equal(
  distinctPlanetChange.transitDiscriminatorScore,
  14,
  "Distinct planets must contribute independently"
);

assert.deepEqual(
  [...distinctPlanetChange.transitDiscriminatorPlanetMatches].sort(),
  ["Ketu", "Rahu"]
);

console.log("Distinct-planet transit regression test passed.");
const cappedTransitResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [
          ketuTransitMatch,
          rahuTransitMatch,
          {
            ...ketuTransitMatch,
            transitPlanet: "Saturn" as const,
            reasons: ["Controlled Saturn scoring-cap test"],
          },
        ],
      },
    ],
  },
  activatedSambandha,
});

const cappedCareerChange = cappedTransitResult.activations
  .find((activation) => activation.area === "career")
  ?.candidateEvents.find((event) => event.id === "career_change");

assert.ok(cappedCareerChange);

assert.equal(
  cappedCareerChange.transitDiscriminatorScore,
  15,
  "Transit discriminator scoring must respect the 15-point cap"
);

assert.deepEqual(
  [...cappedCareerChange.transitDiscriminatorPlanetMatches].sort(),
  ["Ketu", "Rahu", "Saturn"]
);

console.log("Transit discriminator scoring-cap regression test passed.");
const differentHouseResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [
          ketuTransitMatch,
          {
            ...ketuTransitMatch,
            transitHouse: 9,
            transitSource: "transit_aspect",
            reasons: ["Controlled Ketu supporting-house activation"],
          },
        ],
      },
    ],
  },
  activatedSambandha,
});

const differentHouseChange = differentHouseResult.activations
  .find((activation) => activation.area === "career")
  ?.candidateEvents.find((event) => event.id === "career_change");

assert.ok(differentHouseChange);

assert.equal(
  differentHouseChange.transitDiscriminatorScore,
  14,
  "One planet activating two distinct relevant houses should contribute twice"
);

assert.deepEqual(
  differentHouseChange.matchedEventHouseTransits
    .map((match) => match.house)
    .sort((a, b) => a - b),
  [9, 10]
);

console.log("Different-house transit regression test passed.");
const moonNakshatraResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [
          {
            ...ketuTransitMatch,
            transitSource: "moon_nakshatra",
            reasons: ["Controlled excluded-source regression test"],
          },
        ],
      },
    ],
  },
  activatedSambandha,
});

const moonNakshatraEvents = moonNakshatraResult.activations.find(
  (activation) => activation.area === "career"
)?.candidateEvents;

assert.ok(moonNakshatraEvents);

for (const event of moonNakshatraEvents) {
  assert.equal(
    event.transitDiscriminatorScore,
    0,
    `${event.id} must not score moon_nakshatra evidence`
  );

  assert.deepEqual(
    event.transitDiscriminatorPlanetMatches,
    [],
    `${event.id} must not report moon_nakshatra discriminator evidence`
  );

  assert.deepEqual(
    event.matchedEventHouseTransits,
    [],
    `${event.id} must not report moon_nakshatra as an event-house transit`
  );
}

console.log("Moon-nakshatra exclusion regression test passed.");
const moonConditionResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [
          {
            ...ketuTransitMatch,
            transitSource: "moon_condition",
            reasons: ["Controlled Moon-condition exclusion test"],
          },
        ],
      },
    ],
  },
  activatedSambandha,
});

const moonConditionEvents = moonConditionResult.activations.find(
  (activation) => activation.area === "career"
)?.candidateEvents;

assert.ok(moonConditionEvents);

for (const event of moonConditionEvents) {
  assert.equal(
    event.transitDiscriminatorScore,
    0,
    `${event.id} must not score moon_condition evidence`
  );

  assert.deepEqual(
    event.transitDiscriminatorPlanetMatches,
    [],
    `${event.id} must not report moon_condition discriminator evidence`
  );

  assert.deepEqual(
    event.matchedEventHouseTransits,
    [],
    `${event.id} must not report moon_condition as an event-house transit`
  );
}

console.log("Moon-condition exclusion regression test passed.");
const mixedHouseResult = buildEventActivations({
  dasha,
  transit,
  synthesis: {
    ...makeSynthesis(60),
    areaSyntheses: [
      {
        ...careerArea,
        transitMatches: [
          ketuTransitMatch,
          {
            ...ketuTransitMatch,
            transitHouse: 3,
            reasons: ["Identical Ketu evidence in an unrelated house"],
          },
        ],
      },
    ],
  },
  activatedSambandha,
});

const mixedHouseChange = mixedHouseResult.activations
  .find((activation) => activation.area === "career")
  ?.candidateEvents.find((event) => event.id === "career_change");

assert.ok(mixedHouseChange);

console.log("Mixed-house diagnostic:", {
  evidenceCount:
    mixedHouseChange.matchedTransitDiscriminatorEvidence.length,
  transitDiscriminatorScore:
    mixedHouseChange.transitDiscriminatorScore,
});

assert.equal(
  mixedHouseChange.matchedTransitDiscriminatorEvidence.length,
  1
);

assert.equal(
  mixedHouseChange.transitDiscriminatorScore,
  7,
  "An unrelated house must not receive discriminator points"
);

console.log("Mixed-house transit regression test passed.");