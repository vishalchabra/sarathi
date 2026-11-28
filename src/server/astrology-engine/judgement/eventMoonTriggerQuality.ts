import type {
  UnifiedEventJudgement,
} from "./eventUnifiedJudgement";

import type {
  EventJudgementRule,
} from "../knowledge/eventJudgementRules";

import type {
  MoonTriggerEvidenceRow,
} from "./eventMoonTriggerResolver";

export type TriggerQualityLevel =
  | "UNAVAILABLE"
  | "NONE"
  | "BACKGROUND"
  | "QUALIFIED"
  | "PRECISE"
  | "EXACT";

function isDistinctive(
  row: MoonTriggerEvidenceRow
): boolean {
  return (
    row.houseRole === "required_distinctive" ||
    row.houseRole === "alternative_distinctive"
  );
}

function evaluateRow(row: MoonTriggerEvidenceRow) {
  const sources = row.sources;

  const validContacts = row.contacts.filter(
    contact =>
      contact.transitPlanet === "Moon" &&
      contact.natalPlanet === row.planet &&
      typeof contact.orb === "number" &&
      Number.isFinite(contact.orb) &&
      contact.orb >= 0 &&
      contact.orb <= 3 &&
      (
        contact.natalHouse === row.house ||
        contact.natalRuledHouses.includes(row.house)
      )
  );

  const minimumOrb = validContacts.length
    ? Math.min(
        ...validContacts.map(contact => contact.orb!)
      )
    : null;

  let quality = 0;

  if (sources.includes("moon_transit_house")) {
    quality = Math.max(quality, 0.55);
  }

  if (
    sources.includes("navamsa_lordship") ||
    sources.includes("navamsa_natal_placement")
  ) {
    quality = Math.max(quality, 0.60);
  }

  if (
    sources.includes("nakshatra_lordship") ||
    sources.includes("nakshatra_natal_placement")
  ) {
    quality = Math.max(quality, 0.70);
  }

  if (
    sources.includes("moon_natal_contact") &&
    minimumOrb !== null
  ) {
    quality = Math.max(
      quality,
      minimumOrb <= 0.5
        ? 1
        : minimumOrb <= 1
          ? 0.90
          : 0.80
    );
  }

  // A mechanism identifies the planetary trigger,
  // independently of how many houses it activates.
  const mechanisms: string[] = [];

  if (sources.includes("moon_transit_house")) {
    mechanisms.push(`moon_transit:${row.house}`);
  }

  if (
    sources.includes("navamsa_lordship") ||
    sources.includes("navamsa_natal_placement")
  ) {
    mechanisms.push(`navamsa:${row.planet}`);
  }

  if (
    sources.includes("nakshatra_lordship") ||
    sources.includes("nakshatra_natal_placement")
  ) {
    mechanisms.push(`nakshatra:${row.planet}`);
  }

  if (sources.includes("moon_natal_contact")) {
    for (const contact of validContacts) {
      mechanisms.push([
        "moon_contact",
        contact.natalPlanet,
        contact.contactType,
        contact.exactAngle,
      ].join(":"));
    }
  }

  return {
    mechanisms: [...new Set(mechanisms)].sort(),
    planet: row.planet,
    house: row.house,
    houseRole: row.houseRole,
    sources: [...new Set(sources)].sort(),
    quality,
    minimumOrb,
    distinctive: isDistinctive(row),
    directDasha: row.connectsDirectDashaPlanet,
    connectedDasha:
      row.connectsConnectedDashaPlanet === true,
  };
}

export function resolveEventMoonTriggerQuality(
  rule: EventJudgementRule,
  judgement: UnifiedEventJudgement
) {
  if (rule.eventId !== judgement.eventId) {
    throw new Error("Mismatched trigger quality event.");
  }

  const complete =
    judgement.diagnostics.completeMoonData;

  const requiresDistinctive =
    rule.minimumDistinctiveHouses > 0 ||
    rule.requiredDistinctiveHouses.length > 0;

  const evaluatedRows =
    judgement.diagnostics.dynamicMoonRows
      .filter(row =>
        row.houseRole !== "reinforcing" &&
        (
          !requiresDistinctive ||
          isDistinctive(row)
        )
      )
      .map(evaluateRow)
      .filter(row => row.quality > 0)
      .sort(
        (a, b) =>
          b.quality - a.quality ||
          a.planet.localeCompare(b.planet) ||
          a.house - b.house
      );

  const strongest = evaluatedRows[0] ?? null;

  const qualified =
    complete &&
    judgement.diagnostics.dailyTrigger &&
    strongest !== null;

  const backgroundValue =
    judgement.moon.level === "NONE"
      ? 0
      : judgement.moon.level === "AREA"
        ? 0.2
        : 0.4;

  const value = !complete
    ? null
    : qualified
      ? strongest!.quality
      : backgroundValue;

  const points = value === null
    ? null
    : Math.round(value * 1500) / 100;

  const level: TriggerQualityLevel =
    !complete
      ? "UNAVAILABLE"
      : !qualified
        ? value === 0
          ? "NONE"
          : "BACKGROUND"
        : value === 1
          ? "EXACT"
          : value! >= 0.8
            ? "PRECISE"
            : "QUALIFIED";

  // Stable signature excludes changing orb values.
  // It identifies the mechanism, not the score.

  const signature = qualified
    ? [...new Set(
        evaluatedRows.map(row =>
          [
            row.planet,
            row.house,
            row.sources
              .filter(
                source =>
                  source !== "moon_functional_lordship"
              )
              .join(","),
          ].join(":")
        )
      )].sort().join("|")
    : null;

  return {
    eventId: rule.eventId,
    complete,
    qualified,
    value,
    points,
    level,
    strongest,
    evaluatedRows,
    signature,
    mechanismKeys: qualified
      ? [...new Set(
          evaluatedRows.flatMap(row => row.mechanisms)
        )].sort()
      : [],
    distinctiveHouses: [...new Set(
      evaluatedRows
        .filter(row => row.distinctive)
        .map(row => row.house)
    )].sort((a, b) => a - b),
  };
}

export type EventMoonTriggerQuality =
  ReturnType<typeof resolveEventMoonTriggerQuality>;
