
import assert from "node:assert/strict";

import { resolveNatalSambandha } from
  "../knowledge/natalSambandhaResolver";

import { resolveDashaActivation } from
  "../knowledge/dashaActivation";

import { resolveDashaSambandha } from
  "../knowledge/dashaSambandhaResolver";

// Virgo ascendant natal chart
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
  pratyantardasha: "Sun",
  natalPositions: planets,
});

const connections = resolveDashaSambandha(
  dasha,
  natal
);

const rahuVenus = connections.find(
  (item) => item.connectionId === "Rahu:Venus"
);

assert.ok(rahuVenus);
assert.equal(rahuVenus.activePlanetCount, 2);
assert.deepEqual(
  [...rahuVenus.activePlanets].sort(),
  ["Rahu", "Venus"]
);

const sunSaturn = connections.find(
  (item) => item.connectionId === "Saturn:Sun"
);

assert.ok(sunSaturn);
assert.equal(sunSaturn.activePlanetCount, 1);
assert.deepEqual(sunSaturn.activePlanets, ["Sun"]);

// Venus–Jupiter has both conjunction and dispositor
// evidence, but must appear as only one connection.
const venusJupiter = connections.filter(
  (item) => item.connectionId === "Jupiter:Venus"
);

assert.equal(venusJupiter.length, 1);
assert.ok(
  venusJupiter[0].relationshipTypes.includes(
    "conjunction"
  )
);
assert.ok(
  venusJupiter[0].relationshipTypes.includes(
    "dispositor"
  )
);

const mercuryVenus = connections.find(
  (item) => item.connectionId === "Mercury:Venus"
);

assert.ok(mercuryVenus);

// Confirm the lordships belong to the correct planets,
// regardless of their order in the relationship.
const mercuryIndex =
  mercuryVenus.planets.indexOf("Mercury");

const venusIndex =
  mercuryVenus.planets.indexOf("Venus");

const lordships = [
  mercuryVenus.planetLordships.first,
  mercuryVenus.planetLordships.second,
];

assert.deepEqual(
  lordships[mercuryIndex],
  [1, 10]
);

assert.deepEqual(
  lordships[venusIndex],
  [2, 9]
);

// Both planets' lordships must remain distinguishable.
assert.equal(
  mercuryVenus.activePlanetCount,
  1
);
assert.deepEqual(
  mercuryVenus.activePlanets,
  ["Venus"]
);
console.log("Dasha–Sambandha tests passed.");
console.table(
  connections.map((item) => ({
    connection: item.connectionId,
    relationships: item.relationshipTypes.join(", "),
    activePlanets: item.activePlanets.join(", "),
    activeCount: item.activePlanetCount,
    houses: item.connectedHouses.join(", "),
  }))
);