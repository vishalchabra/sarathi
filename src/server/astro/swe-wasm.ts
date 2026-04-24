import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import SwephModule from "sweph-wasm";

let ephPromise: Promise<any> | null = null;

async function getEph() {
  if (!ephPromise) {
    ephPromise = (async () => {
      const Sweph: any = SwephModule as any;

      const wasmPath = path.join(
        process.cwd(),
        "node_modules",
        "sweph-wasm",
        "dist",
        "wasm",
        "swisseph.wasm"
      );

      const wasmBinary = await fs.readFile(wasmPath);
      const wasmDataUrl =
        "data:application/wasm;base64," + wasmBinary.toString("base64");

      // Package init expects a URL it can fetch.
      const instance = await Sweph.init(wasmDataUrl);
      return instance;
    })();
  }

  return ephPromise;
}

function wrap360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

export const SWE_CONST = {
  SE_GREG_CAL: 1,
  SEFLG_SIDEREAL: 64,
  SE_SIDM_LAHIRI: 1,
} as const;

export type WasmHouseSystem =
  | "P"
  | "K"
  | "O"
  | "R"
  | "C"
  | "E"
  | "V"
  | "W";

export type SwissHouseResult = {
  cusps: number[];
  ascendant: number;
  mc: number | null;
  armc?: number | null;
  vertex?: number | null;
};

export async function sweJulday(
  year: number,
  month: number,
  day: number,
  hour: number,
  gregFlag = SWE_CONST.SE_GREG_CAL
): Promise<number> {
  const s = await getEph();
  return s.swe_julday(year, month, day, hour, gregFlag);
}

export async function sweGetAyanamsaUt(jdUt: number): Promise<number> {
  const s = await getEph();
  return s.swe_get_ayanamsa_ut(jdUt);
}

export async function sweCalcUt(
  jdUt: number,
  ipl: number,
  flags = 0
): Promise<any> {
  const s = await getEph();
  return s.swe_calc_ut(jdUt, ipl, flags);
}

export async function getSwissHouseCusps(input: {
  jdUt: number;
  lat: number;
  lon: number;
  houseSystem?: WasmHouseSystem;
  sidereal?: boolean;
  siderealMode?: number;
}): Promise<SwissHouseResult> {
  const s = await getEph();
  const houseSystem = input.houseSystem ?? "P";

  let flags = 0;

  if (input.sidereal) {
    flags |= SWE_CONST.SEFLG_SIDEREAL;
    s.swe_set_sid_mode(
      input.siderealMode ?? SWE_CONST.SE_SIDM_LAHIRI,
      0,
      0
    );
  }

  const result: any = s.swe_houses_ex(
    input.jdUt,
    flags,
    input.lat,
    input.lon,
    houseSystem
  );

   const rawHouses =
    result?.cusps ??
    result?.houses ??
    result?.house ??
    result?.data?.cusps ??
    result?.data?.houses ??
    result?.data?.house ??
    [];

  const rawPoints =
    result?.ascmc ??
    result?.points ??
    result?.data?.ascmc ??
    result?.data?.points ??
    [];

  const cusps = Array.isArray(rawHouses)
  ? (
      rawHouses.length >= 13
        ? rawHouses.slice(1, 13)
        : rawHouses.slice(0, 12)
    ).map((x: number) => wrap360(Number(x)))
  : [];

    const ascendant = Number(rawPoints?.[0]);
  const mc = Number(rawPoints?.[1]);
  const armc = Number(rawPoints?.[2]);
  const vertex = Number(rawPoints?.[3]);

  if (cusps.length !== 12 || !Number.isFinite(ascendant)) {
    throw new Error(
      `Invalid Swiss house result: cusps=${cusps.length}, asc=${String(
        ascendant
      )}, keys=${Object.keys(result ?? {}).join(",")}`
    );
  }

  const ayanamsa = input.sidereal
    ? Number(s.swe_get_ayanamsa_ut(input.jdUt))
    : 0;

  const siderealize = (x: number | null) =>
    typeof x === "number" && Number.isFinite(x)
      ? wrap360(x - ayanamsa)
      : null;

  return {
    cusps: input.sidereal
      ? cusps.map((x: number) => wrap360(x - ayanamsa))
      : cusps,
    ascendant: input.sidereal
      ? wrap360(ascendant - ayanamsa)
      : wrap360(ascendant),
    mc:
      input.sidereal && Number.isFinite(mc)
        ? wrap360(mc - ayanamsa)
        : Number.isFinite(mc)
        ? wrap360(mc)
        : null,
    armc: Number.isFinite(armc) ? wrap360(armc) : null,
    vertex: siderealize(vertex),
  };
}