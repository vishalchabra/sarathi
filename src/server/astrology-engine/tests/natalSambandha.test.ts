
import assert from "node:assert/strict";

import {
  resolveNatalSambandha,
} from "../knowledge/natalSambandhaResolver";

const result = resolveNatalSambandha({
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

function hasRelationship(
  type: string,
  first: string,
  second: string
): boolean {
  return result.relationships.some((relationship) => {
    if (relationship.type !== type) return false;

    const [a, b] = relationship.planets;

    return relationship.directed
      ? a === first && b === second
      : [a, b].includes(first as typeof a) &&
          [a, b].includes(second as typeof b);
  });
}

// Sign-level conjunctions
assert.ok(hasRelationship("conjunction", "Mercury", "Jupiter"));
assert.ok(hasRelationship("conjunction", "Mercury", "Venus"));
assert.ok(hasRelationship("conjunction", "Jupiter", "Venus"));
assert.ok(hasRelationship("conjunction", "Mars", "Saturn"));

// Dispositor relationships
assert.ok(hasRelationship("dispositor", "Mercury", "Jupiter"));
assert.ok(hasRelationship("dispositor", "Venus", "Jupiter"));
assert.ok(hasRelationship("dispositor", "Rahu", "Venus"));
assert.ok(hasRelationship("dispositor", "Ketu", "Mars"));

// Saturn in Libra aspects the Moon in Leo by its
// 11th sign distance? No: this should NOT be an aspect.
assert.equal(
  hasRelationship("aspect", "Saturn", "Moon"),
  false
);

// Jupiter in Sagittarius aspects the Sun in Capricorn?
// No: Capricorn is the 2nd sign from Sagittarius.
assert.equal(
  hasRelationship("aspect", "Jupiter", "Sun"),
  false
);

// No sign exchange exists in this fixture.
assert.equal(
  result.relationships.some(
    (relationship) => relationship.type === "exchange"
  ),
  false
);

// TEST 2: Mutual aspect
// Mars in Aries aspects Libra by its 7th aspect.
// Venus in Libra aspects Aries by its 7th aspect.

const mutualAspectResult = resolveNatalSambandha({
  ascendant: "Aries",
  planets: {
    Mars: { sign: "Aries", house: 1 },
    Venus: { sign: "Libra", house: 7 },
  },
});

assert.ok(
  mutualAspectResult.relationships.some(
    (relationship) =>
      relationship.type === "mutual_aspect" &&
      relationship.planets.includes("Mars") &&
      relationship.planets.includes("Venus")
  ),
  "Expected a mutual aspect between Mars and Venus"
);

// TEST 3: Parivartana (sign exchange)
// Mars occupies Venus's sign, Taurus.
// Venus occupies Mars's sign, Aries.

const exchangeResult = resolveNatalSambandha({
  ascendant: "Aries",
  planets: {
    Mars: { sign: "Taurus", house: 2 },
    Venus: { sign: "Aries", house: 1 },
  },
});

assert.ok(
  exchangeResult.relationships.some(
    (relationship) =>
      relationship.type === "exchange" &&
      relationship.planets.includes("Mars") &&
      relationship.planets.includes("Venus")
  ),
  "Expected a sign exchange between Mars and Venus"
);

console.log("Mutual aspect and sign exchange tests passed.");
console.log("Natal Sambandha regression test passed.");
console.log(
  JSON.stringify(result.relationships, null, 2)
);