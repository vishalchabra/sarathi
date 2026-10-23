
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  meetsRequiredHouseEvidence,
  rankHouseEvidence,
  type EventActivation,
} from "./eventActivationEngine";

type RankedHouses = EventActivation["rankedHouses"];

function makeHouse(
  house: number,
  directCount: number,
  totalCount: number,
  sources: RankedHouses[number]["sources"]
): RankedHouses[number] {
  return {
    house,
    score: totalCount,
    confirmationCount: totalCount,
    planetConfirmationCount: totalCount,
    directPlanetConfirmationCount: directCount,
    planets: ["Venus", "Sun"],
    sources,
  };
}

test("two direct planetary confirmations pass", () => {
  const houses = [
    makeHouse(11, 2, 2, ["lordship", "natal_placement"]),
  ];

  assert.equal(meetsRequiredHouseEvidence([11], houses), true);
});

test("one direct planet plus natal aspect fails", () => {
  const houses = [
    makeHouse(11, 1, 2, ["lordship", "natal_aspect"]),
  ];

  assert.equal(meetsRequiredHouseEvidence([11], houses), false);
});

test("two natal aspects without direct evidence fail", () => {
  const houses = [
    makeHouse(11, 0, 2, ["natal_aspect"]),
  ];

  assert.equal(meetsRequiredHouseEvidence([11], houses), false);
});

test("missing mandatory house fails", () => {
  const houses = [
    makeHouse(10, 2, 2, ["lordship", "natal_placement"]),
  ];

  assert.equal(meetsRequiredHouseEvidence([11], houses), false);
});

test("every mandatory house needs two direct confirmations", () => {
  const houses = [
    makeHouse(10, 2, 2, ["lordship", "natal_placement"]),
    makeHouse(11, 1, 2, ["lordship", "natal_aspect"]),
  ];

  assert.equal(
    meetsRequiredHouseEvidence([10, 11], houses),
    false
  );
});

test("multiple mandatory houses pass when each has two direct confirmations", () => {
  const houses = [
    makeHouse(10, 2, 2, ["lordship", "natal_placement"]),
    makeHouse(11, 2, 3, [
      "lordship",
      "natal_placement",
      "natal_aspect",
    ]),
  ];

  assert.equal(
    meetsRequiredHouseEvidence([10, 11], houses),
    true
  );
});

type HouseEvidence = EventActivation["houseEvidence"];

function makeEvidence(
  house: number,
  planet: HouseEvidence[number]["planet"],
  source: HouseEvidence[number]["source"]
): HouseEvidence[number] {
  return {
    house,
    planet,
    source,
    area: "career",
    score: source === "natal_aspect" ? 0.5 : 2,
  };
}

test("two direct planets are counted independently", () => {
  const ranked = rankHouseEvidence([
    makeEvidence(11, "Venus", "lordship"),
    makeEvidence(11, "Sun", "natal_placement"),
  ]);

  assert.equal(ranked[0].planetConfirmationCount, 2);
  assert.equal(ranked[0].directPlanetConfirmationCount, 2);
  assert.equal(meetsRequiredHouseEvidence([11], ranked), true);
});

test("multiple direct sources from one planet count only once", () => {
  const ranked = rankHouseEvidence([
    makeEvidence(11, "Venus", "lordship"),
    makeEvidence(11, "Venus", "natal_placement"),
  ]);

  assert.equal(ranked[0].confirmationCount, 2);
  assert.equal(ranked[0].planetConfirmationCount, 1);
  assert.equal(ranked[0].directPlanetConfirmationCount, 1);
  assert.equal(meetsRequiredHouseEvidence([11], ranked), false);
});

test("natal aspect adds evidence but not direct confirmation", () => {
  const ranked = rankHouseEvidence([
    makeEvidence(11, "Venus", "lordship"),
    makeEvidence(11, "Sun", "natal_aspect"),
  ]);

  assert.equal(ranked[0].planetConfirmationCount, 2);
  assert.equal(ranked[0].directPlanetConfirmationCount, 1);
  assert.equal(ranked[0].score, 2.5);
  assert.equal(meetsRequiredHouseEvidence([11], ranked), false);
});

test("two natal aspects cannot satisfy mandatory house", () => {
  const ranked = rankHouseEvidence([
    makeEvidence(11, "Venus", "natal_aspect"),
    makeEvidence(11, "Sun", "natal_aspect"),
  ]);

  assert.equal(ranked[0].planetConfirmationCount, 2);
  assert.equal(ranked[0].directPlanetConfirmationCount, 0);
  assert.equal(meetsRequiredHouseEvidence([11], ranked), false);
});

test("one planet with direct and aspect evidence counts once", () => {
  const ranked = rankHouseEvidence([
    makeEvidence(11, "Venus", "lordship"),
    makeEvidence(11, "Venus", "natal_aspect"),
  ]);

  assert.equal(ranked[0].planetConfirmationCount, 1);
  assert.equal(ranked[0].directPlanetConfirmationCount, 1);
  assert.equal(meetsRequiredHouseEvidence([11], ranked), false);
});
