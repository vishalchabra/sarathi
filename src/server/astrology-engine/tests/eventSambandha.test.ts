
import assert from "node:assert/strict";

import { resolveNatalSambandha } from
  "../knowledge/natalSambandhaResolver";

import { resolveDashaActivation } from
  "../knowledge/dashaActivation";

import { resolveDashaSambandha } from
  "../knowledge/dashaSambandhaResolver";

import { resolveEventSambandha } from
  "../knowledge/eventSambandhaResolver";

import { EVENT_THEMES } from "../knowledge/eventThemes";
import {
  getEventSambandhaBonus,
  getUniqueSambandhaActivePlanets,
  hasDualActiveSambandha,
} from "../knowledge/sambandhaEvidence";

// Fixed Virgo ascendant test chart.
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

const connections = resolveDashaSambandha(
  dasha,
  natal
);

// Test a connection between the 10th and 2nd houses.
const careerMoney = resolveEventSambandha({
  primaryHouses: [10, 2],
  connections,
});

const mercuryVenus = careerMoney.find(
  (item) => item.connectionId === "Mercury:Venus"
);

assert.ok(
  mercuryVenus,
  "Mercury–Venus should connect houses 10 and 2"
);

assert.equal(
  mercuryVenus.connectsDistinctPrimaryHouses,
  true
);

// A single primary house is insufficient to
// establish a connection between distinct houses.
const singleHouse = resolveEventSambandha({
  primaryHouses: [10],
  connections,
});

assert.equal(
  singleHouse.some(
    (item) => item.connectsDistinctPrimaryHouses
  ),
  false
);

// Nodes have no classical house lordships in this
// model, so Rahu–Venus is not a lord-to-lord link.
assert.equal(
  careerMoney.some(
    (item) => item.connectionId === "Rahu:Venus"
  ),
  false
);

// Jupiter–Venus has two relationship types but
// must appear only once per planetary pair.
const propertyFinance = resolveEventSambandha({
  primaryHouses: [4, 2],
  connections,
});

const jupiterVenus = propertyFinance.filter(
  (item) => item.connectionId === "Jupiter:Venus"
);

assert.equal(jupiterVenus.length, 1);
assert.ok(
  jupiterVenus[0].relationshipTypes.includes(
    "conjunction"
  )
);
assert.ok(
  jupiterVenus[0].relationshipTypes.includes(
    "dispositor"
  )
);

// Use the actual event definitions, not illustrative houses.
const careerChangeTheme = EVENT_THEMES.find(
  (theme) => theme.id === "career_change"
);

const moneyInflowTheme = EVENT_THEMES.find(
  (theme) => theme.id === "money_inflow"
);

assert.ok(careerChangeTheme);
assert.ok(moneyInflowTheme);

const careerChangeEvidence = resolveEventSambandha({
  primaryHouses: careerChangeTheme.primaryHouses,
  supportingHouses: careerChangeTheme.supportingHouses,
  connections,
});

// Mercury owns the 10th house; Venus owns the 9th.
// Their natal conjunction links the primary career
// house to a supporting career-change house.
const careerLink = careerChangeEvidence.find(
  (item) => item.connectionId === "Mercury:Venus"
);

assert.ok(careerLink);
assert.equal(
  careerLink.connectsPrimaryToSupporting,
  true
);
assert.equal(
  careerLink.connectsDistinctPrimaryHouses,
  false
);
assert.deepEqual(
  [...careerLink.activePlanets].sort(),
  ["Mercury", "Venus"]
);

assert.equal(careerLink.activePlanetCount, 2);

const moneyInflowEvidence = resolveEventSambandha({
  primaryHouses: moneyInflowTheme.primaryHouses,
  supportingHouses: moneyInflowTheme.supportingHouses,
  connections,
});

// Venus owns the primary 2nd house; Mercury owns
// the supporting 10th house.
const moneyLink = moneyInflowEvidence.find(
  (item) => item.connectionId === "Mercury:Venus"
);

assert.ok(moneyLink);
assert.equal(
  moneyLink.connectsPrimaryToSupporting,
  true
);

// Rahu–Venus remains excluded from direct
// house-lord-to-house-lord evidence.
assert.equal(
  moneyInflowEvidence.some(
    (item) => item.connectionId === "Rahu:Venus"
  ),
  false
);

console.table(
  [
    ...careerChangeEvidence.map((item) => ({
      event: "career_change",
      connection: item.connectionId,
      active: item.activePlanets.join(", "),
      primaryToSupporting:
        item.connectsPrimaryToSupporting,
        activationType: item.activationType,
    })),
 ...moneyInflowEvidence.map((item) => ({
  event: "money_inflow",
  connection: item.connectionId,
  active: item.activePlanets.join(", "),
  primaryToSupporting: item.connectsPrimaryToSupporting,
  activationType: item.activationType,
}))
  ]
);
assert.equal(
  careerLink.activationType,
  "both_planets_active"
);

assert.equal(
  moneyLink.activationType,
  "both_planets_active"
);

// Regression test: single-planet activation
// under Rahu–Venus–Sun.

const sunDasha = resolveDashaActivation({
  ascendant: "Virgo",
  mahadasha: "Rahu",
  antardasha: "Venus",
  pratyantardasha: "Sun",
  natalPositions: planets,
});

const sunConnections = resolveDashaSambandha(
  sunDasha,
  natal
);

const sunMoneyEvidence = resolveEventSambandha({
  primaryHouses: moneyInflowTheme.primaryHouses,
  supportingHouses: moneyInflowTheme.supportingHouses,
  connections: sunConnections,
});

const sunMercuryVenus = sunMoneyEvidence.find(
  (item) => item.connectionId === "Mercury:Venus"
);

assert.ok(sunMercuryVenus);

assert.deepEqual(
  sunMercuryVenus.activePlanets,
  ["Venus"]
);

assert.equal(
  sunMercuryVenus.activePlanetCount,
  1
);

assert.equal(
  sunMercuryVenus.activationType,
  "one_planet_active"
);
// Dual activation: Rahu–Venus–Mercury
assert.deepEqual(
  getUniqueSambandhaActivePlanets(
    moneyInflowEvidence
  ).sort(),
  ["Mercury", "Venus"]
);

// Single activation: Rahu–Venus–Sun
assert.deepEqual(
  getUniqueSambandhaActivePlanets(
    sunMoneyEvidence
  ).sort(),
  ["Venus"]
);
// Both Mercury and Venus active in the same connection.
assert.equal(
  hasDualActiveSambandha(moneyInflowEvidence),
  true
);

// Only Venus active under Rahu–Venus–Sun.
assert.equal(
  hasDualActiveSambandha(sunMoneyEvidence),
  false
);

// Two separate single-active connections are not
// equivalent to one dual-active connection.
assert.equal(
  hasDualActiveSambandha([
    { activePlanets: ["Mercury"] },
    { activePlanets: ["Venus"] },
  ]),
  false
);
// A dual-active connection must be relevant to
// the event's primary or supporting houses.

const unrelatedEventEvidence = resolveEventSambandha({
  primaryHouses: [3, 8],
  supportingHouses: [],
  connections: [
    {
      connectionId: "Mercury:Venus",
      planets: ["Mercury", "Venus"],
      relationshipTypes: ["conjunction"],
      activePlanets: ["Mercury", "Venus"],
      activePlanetCount: 2,
      connectedHouses: [1, 2, 9, 10],
      planetLordships: {
        first: [1, 10],
        second: [2, 9],
      },
    },
  ],
});

assert.deepEqual(unrelatedEventEvidence, []);

assert.equal(
  hasDualActiveSambandha(unrelatedEventEvidence),
  false
);
// A relevant dual-active connection receives one
// capped bonus when timing is sufficiently strong.

assert.equal(
  getEventSambandhaBonus(
    moneyInflowEvidence,
    [2],
    75
  ),
  5
);

// Timing below the threshold: no bonus.
assert.equal(
  getEventSambandhaBonus(
    moneyInflowEvidence,
    [2],
    59
  ),
  0
);

// No matched primary house: no bonus.
assert.equal(
  getEventSambandhaBonus(
    moneyInflowEvidence,
    [],
    75
  ),
  0
);

// Separate single-active connections must not
// receive a dual-activation bonus.
assert.equal(
  getEventSambandhaBonus(
    sunMoneyEvidence,
    [2],
    75
  ),
  0
);

// Unrelated connections must not qualify.
assert.equal(
  getEventSambandhaBonus(
    unrelatedEventEvidence,
    [2],
    75
  ),
  0
);

// Multiple qualifying connections cannot
// multiply the bonus.
assert.equal(
  getEventSambandhaBonus(
    [...moneyInflowEvidence, ...moneyInflowEvidence],
    [2],
    75
  ),
  5
);
// Exact timing threshold: 60 qualifies.
assert.equal(
  getEventSambandhaBonus(
    careerChangeEvidence,
    [10],
    60
  ),
  5
);

// The observed career timing of 51 does not qualify.
assert.equal(
  getEventSambandhaBonus(
    careerChangeEvidence,
    [10],
    51
  ),
  0
);
console.log("Event–Sambandha tests passed.");
console.table(
  careerMoney.map((item) => ({
    connection: item.connectionId,
    activePlanets: item.activePlanets.join(", "),
    firstHouses: item.firstPlanetHouses.join(", "),
    secondHouses: item.secondPlanetHouses.join(", "),
    distinctHouses:
      item.connectsDistinctPrimaryHouses,
      activationType: item.activationType,
  }))
);