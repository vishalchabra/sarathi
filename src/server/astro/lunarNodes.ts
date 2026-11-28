import "server-only";
import { DateTime } from "luxon";
import {
  sweCalcLahiriSiderealUt,
} from "./swe-wasm";

export type NodeMode = "mean" | "true";

export const DEFAULT_NODE_MODE: NodeMode = "mean";

export const NODE_CALCULATION_VERSION =
  "lahiri-swiss-node-v1";

export function resolveNodeMode(
  value: unknown
): NodeMode {
  if (value === undefined || value === null) {
    return DEFAULT_NODE_MODE;
  }

  if (value === "mean" || value === "true") {
    return value;
  }

  throw new Error("Invalid lunar node convention");
}

function wrap360(value: number): number {
  return ((value % 360) + 360) % 360;
}

export async function calculateLunarNodesAtJulianDay(
  jdUt: number,
  nodeMode: NodeMode = DEFAULT_NODE_MODE
) {
  if (!Number.isFinite(jdUt)) {
    throw new Error("Invalid Julian day for lunar nodes");
  }

  const mode = resolveNodeMode(nodeMode);
  const planetId = mode === "true" ? 11 : 10;

  const result = await sweCalcLahiriSiderealUt(
    jdUt,
    planetId
  );

  const longitude = Number(result[0]);
  const speed = Number(result[3]);

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(speed)
  ) {
    throw new Error("Invalid Swiss Ephemeris lunar node result");
  }

  const rahuLonSid = wrap360(longitude);
  const ketuLonSid = wrap360(rahuLonSid + 180);

  return {
    nodeMode: mode,
    ayanamsa: "Lahiri" as const,
    calculationVersion: NODE_CALCULATION_VERSION,
    rahuLonSid,
    ketuLonSid,
    speedLon: speed,
    retrograde: speed < 0,
  };
}

export async function calculateLunarNodesAtDate(
  date: Date,
  nodeMode: NodeMode = DEFAULT_NODE_MODE
) {
  const timestamp = date.getTime();

  if (!Number.isFinite(timestamp)) {
    throw new Error("Invalid date for lunar nodes");
  }

  const jdUt = timestamp / 86400000 + 2440587.5;

  return calculateLunarNodesAtJulianDay(
    jdUt,
    nodeMode
  );
}

export async function calculateNatalLunarNodes(
  birth: {
    dateISO: string;
    time: string;
    timezone: string;
  },
  nodeMode: NodeMode = DEFAULT_NODE_MODE
) {
  const birthTime = DateTime.fromISO(
    `${birth.dateISO}T${birth.time}`,
    { zone: birth.timezone }
  );

  if (!birthTime.isValid) {
    throw new Error("Invalid birth date, time or timezone");
  }

  return calculateLunarNodesAtDate(
    birthTime.toUTC().toJSDate(),
    nodeMode
  );
}
