import type { PlanetName, ZodiacSign } from "./types";

import {
  FUNCTIONAL_PLANET_ROLES,
  type FunctionalPlanetRole,
} from "./knowledge/functionalPlanetRoles";

import {
  PLANET_LORDSHIPS,
} from "./knowledge/planetLordships";

const ascendants: ZodiacSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const planets: PlanetName[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

const validRoles = new Set<FunctionalPlanetRole>([
  "lagna_lord",
  "yogakaraka",
  "functional_benefic",
  "functional_malefic",
  "mixed",
  "maraka",
  "neutral",
]);

let totalEntries = 0;

const missingEntries: string[] = [];
const ownershipMismatches: string[] = [];
const identityMismatches: string[] = [];
const invalidRoles: string[] = [];
const emptyRoles: string[] = [];
const invalidConfidence: string[] = [];
const missingContent: string[] = [];

for (const ascendant of ascendants) {
  for (const planet of planets) {
    const entry =
      FUNCTIONAL_PLANET_ROLES[ascendant]?.[planet];

    if (!entry) {
      missingEntries.push(`${ascendant} - ${planet}`);
      continue;
    }

    totalEntries++;

    // Validate ascendant / planet stored inside entry
    if (
      entry.ascendant !== ascendant ||
      entry.planet !== planet
    ) {
      identityMismatches.push(
        `${ascendant} - ${planet}: stored as ${entry.ascendant} - ${entry.planet}`
      );
    }

    // Compare against our existing lordship ownership map
    const expectedHouses =
      PLANET_LORDSHIPS[ascendant][planet] ?? [];

    const actualHouses = [...entry.ruledHouses].sort(
      (a, b) => a - b
    );

    const expectedSorted = [...expectedHouses].sort(
      (a, b) => a - b
    );

    if (
      JSON.stringify(actualHouses) !==
      JSON.stringify(expectedSorted)
    ) {
      ownershipMismatches.push(
        `${ascendant} - ${planet}: expected [${expectedSorted.join(
          ", "
        )}], got [${actualHouses.join(", ")}]`
      );
    }

    // Validate roles
    if (entry.roles.length === 0) {
      emptyRoles.push(`${ascendant} - ${planet}`);
    }

    for (const role of entry.roles) {
      if (!validRoles.has(role)) {
        invalidRoles.push(
          `${ascendant} - ${planet}: ${role}`
        );
      }
    }

    // Validate confidence
    if (
      typeof entry.confidence !== "number" ||
      entry.confidence < 1 ||
      entry.confidence > 10
    ) {
      invalidConfidence.push(
        `${ascendant} - ${planet}: ${entry.confidence}`
      );
    }

    // Basic content validation
    if (
      !entry.principle ||
      entry.supportiveThemes.length === 0 ||
      entry.challengingThemes.length === 0
    ) {
      missingContent.push(`${ascendant} - ${planet}`);
    }
  }
}

console.log("\nFUNCTIONAL PLANET ROLE VALIDATION");
console.log("--------------------------------");
console.log(`Expected entries: ${ascendants.length * planets.length}`);
console.log(`Actual entries:   ${totalEntries}`);

console.log("\nMissing entries:", missingEntries.length);
console.log(missingEntries);

console.log(
  "\nOwnership mismatches:",
  ownershipMismatches.length
);
console.log(ownershipMismatches);

console.log(
  "\nIdentity mismatches:",
  identityMismatches.length
);
console.log(identityMismatches);

console.log("\nInvalid roles:", invalidRoles.length);
console.log(invalidRoles);

console.log("\nEmpty roles:", emptyRoles.length);
console.log(emptyRoles);

console.log(
  "\nInvalid confidence:",
  invalidConfidence.length
);
console.log(invalidConfidence);

console.log("\nMissing content:", missingContent.length);
console.log(missingContent);

const passed =
  totalEntries === 84 &&
  missingEntries.length === 0 &&
  ownershipMismatches.length === 0 &&
  identityMismatches.length === 0 &&
  invalidRoles.length === 0 &&
  emptyRoles.length === 0 &&
  invalidConfidence.length === 0 &&
  missingContent.length === 0;

console.log(
  passed
    ? "\n✅ FUNCTIONAL PLANET ROLE VALIDATION PASSED"
    : "\n❌ FUNCTIONAL PLANET ROLE VALIDATION FAILED"
);