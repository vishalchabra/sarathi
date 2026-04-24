import "server-only";
import { DateTime } from "luxon";
import { getSwissHouseCusps, sweJulday } from "../astro/swe-wasm";

export type HouseSystem = "placidus" | "equal" | "sripati";

export type HouseCuspsResult = {
  system: HouseSystem;
  ascLon: number;
  mcLon: number | null;
  cusps: number[];
};

type Params = {
  birth: {
    dateISO: string;
    time: string;
    timezone: string;
    lat: number;
    lon: number;
  };
  ascLon: number;
  coreHouses?: number[] | null;
};

export async function buildHouseCusps(params: Params): Promise<HouseCuspsResult> {
  const { birth } = params;

  const dt = DateTime.fromISO(`${birth.dateISO}T${birth.time}`, {
    zone: birth.timezone,
  }).toUTC();

  const hour =
    dt.hour +
    dt.minute / 60 +
    dt.second / 3600;

  const jdUt = await sweJulday(
    dt.year,
    dt.month,
    dt.day,
    hour,
    1
  );

  const houseData = await getSwissHouseCusps({
    jdUt,
    lat: birth.lat,
    lon: birth.lon,
    houseSystem: "P",
    sidereal: true,
  });

  console.log("SWISS HOUSE DEBUG", {
    system: "placidus",
    asc: houseData.ascendant,
    mc: houseData.mc,
    c1: houseData.cusps?.[0],
    c2: houseData.cusps?.[1],
    c3: houseData.cusps?.[2],
    c4: houseData.cusps?.[3],
  });

  return {
    system: "placidus",
    ascLon: houseData.ascendant,
    mcLon: houseData.mc,
    cusps: houseData.cusps,
  };
}

export default buildHouseCusps;