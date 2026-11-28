// src/server/ephemeris.ts
import "server-only";

import { DateTime } from "luxon";
import type { Birth, PlanetPos, PlanetId } from "@/server/astro/types";
import { computePlacements } from "@/server/astro/placements";
import { getNakshatra } from "@/server/astro/nakshatra";
import {
  resolveNodeMode,
  type NodeMode,
} from "@/server/astro/lunarNodes";

// Legacy transit contract retained pending migration.
export async function getTransitsDaily(
  _dateISO: string,
  _tz: string
) {
  return [];
}

/**
 * Real natal planetary placements.
 * Preserves the legacy PlanetPos response contract.
 */
export async function getNatal(
  birth: Birth & { nodeMode?: NodeMode },
  requestedNodeMode?: NodeMode
): Promise<PlanetPos[]> {
  const nodeMode = resolveNodeMode(
    requestedNodeMode ?? birth.nodeMode ?? "mean"
  );

  if (
    !birth.tz ||
    !Number.isFinite(birth.lat) ||
    !Number.isFinite(birth.lon) ||
    Math.abs(birth.lat) > 90 ||
    Math.abs(birth.lon) > 180
  ) {
    throw new Error("Invalid birth location or timezone.");
  }

  if (
    typeof birth.dateISO !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(birth.dateISO)
  ) {
    throw new Error("Birth date and time are required.");
  }

  const local = DateTime.fromISO(birth.dateISO, {
    zone: birth.tz,
  });

  if (!local.isValid) {
    throw new Error("Invalid birth date, time or timezone.");
  }

  const placements = await computePlacements(
    {
      dateISO: local.toISODate()!,
      time: local.toFormat("HH:mm:ss"),
      tz: birth.tz,
      lat: birth.lat,
      lon: birth.lon,
    },
    nodeMode
  );

  if (placements.length !== 9) {
    throw new Error("Incomplete natal planetary calculation.");
  }

  return placements.map(p => {
    const lon = ((p.lon % 360) + 360) % 360;

    if (!Number.isFinite(lon)) {
      throw new Error("Invalid planetary longitude.");
    }

    const house = p.house;

    if (
      typeof house !== "number" ||
      !Number.isInteger(house) ||
      house < 1 ||
      house > 12
    ) {
      throw new Error(`Invalid house placement for ${p.planet}.`);
    }

    const nk = getNakshatra(lon);

    const pada = (
      Math.floor((lon % (360 / 27)) / (360 / 108)) + 1
    ) as 1 | 2 | 3 | 4;

    return {
      id: p.planet as PlanetId,
      lon,
      sign: p.sign,
      house,
      deg: lon % 30,
      nakName: nk.name,
      pada,
      retrograde: p.retrograde,
      speedLon: p.speedLon,
    };
  });
}