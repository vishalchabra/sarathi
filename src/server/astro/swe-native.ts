import "server-only";
import path from "node:path";
const swe = require("sweph");

let initialized = false;

function wrap360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

function initSwe() {
  if (initialized) return;

  const ephePath = path.join(process.cwd(), "ephemeris");
  swe.set_ephe_path(ephePath);

  initialized = true;
}

export type NativeHouseSystem = "P" | "K" | "O" | "R" | "C" | "E" | "V" | "W";

export type SwissHouseResult = {
  cusps: number[];
  ascendant: number;
  mc: number | null;
  armc?: number | null;
  vertex?: number | null;
};

export function getSwissHouseCusps(input: {
  jdUt: number;
  lat: number;
  lon: number;
  houseSystem?: NativeHouseSystem;
  sidereal?: boolean;
  siderealMode?: number;
}): SwissHouseResult {
  initSwe();

  const C = swe.constants;
  const houseSystem = input.houseSystem ?? "P";

  let flags = 0;

  if (input.sidereal) {
    flags |= C.SEFLG_SIDEREAL;
    swe.set_sid_mode(input.siderealMode ?? C.SE_SIDM_LAHIRI, 0, 0);
  }

  let result: any;

  try {
    result = swe.houses_ex(
      input.jdUt,
      flags,
      input.lat,
      input.lon,
      houseSystem
    );
  } catch (err: any) {
    throw new Error(`swe.houses_ex crashed: ${err?.message || String(err)}`);
  }

  if (!result || result.flag < 0) {
    throw new Error(`swe.houses_ex failed: ${JSON.stringify(result)}`);
  }

  const rawHouses = result?.data?.houses ?? [];
  const rawPoints = result?.data?.points ?? [];

  const cusps = Array.isArray(rawHouses)
    ? rawHouses.slice(0, 12).map((x: number) => wrap360(Number(x)))
    : [];

  const ascendant = Number(rawPoints?.[0]);
  const mc = Number(rawPoints?.[1]);
  const armc = Number(rawPoints?.[2]);
  const vertex = Number(rawPoints?.[3]);

  if (cusps.length !== 12 || !Number.isFinite(ascendant)) {
    throw new Error(
      `Invalid Swiss house result: cusps=${cusps.length}, asc=${String(ascendant)}`
    );
  }

  return {
    cusps,
    ascendant: wrap360(ascendant),
    mc: Number.isFinite(mc) ? wrap360(mc) : null,
    armc: Number.isFinite(armc) ? wrap360(armc) : null,
    vertex: Number.isFinite(vertex) ? wrap360(vertex) : null,
  };
}