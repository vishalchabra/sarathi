import "server-only";

import { DateTime } from "luxon";
import * as SunCalc from "suncalc";
import type { DateTime as LuxonDateTime } from "luxon";
function formatHm(dt: any) {
  if (!dt || !dt.isValid) return null;
  return dt.toFormat("hh:mm:ss a");
}

function getSolarDateTime(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  key: "sunrise" | "sunset";
}) {
  const localNoon = DateTime.fromISO(`${params.dateISO}T12:00:00`, {
    zone: params.timezone,
  });

  if (!localNoon.isValid) return null;

  const times = SunCalc.getTimes(
    localNoon.toJSDate(),
    params.lat,
    params.lon
  );

  const jsDate = times[params.key];

  if (!(jsDate instanceof Date) || Number.isNaN(jsDate.getTime())) {
    return null;
  }

  const dt = DateTime.fromJSDate(jsDate, {
    zone: params.timezone,
  });

  return dt.isValid ? dt : null;
}

export type SolarTimesResult = {
  method: "suncalc";
  sunrise: string | null;
  sunset: string | null;
  previousSunset: string | null;
  nextSunrise: string | null;
  sunriseDT: any | null;
sunsetDT: any | null;
previousSunsetDT: any | null;
nextSunriseDT: any | null;
  hasSunrise: boolean;
  hasSunset: boolean;
};

export async function buildSolarTimes(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
}): Promise<SolarTimesResult> {
  const baseDT = DateTime.fromISO(params.dateISO, {
    zone: params.timezone,
  });

  const prevDateISO = baseDT.minus({ days: 1 }).toFormat("yyyy-MM-dd");
  const nextDateISO = baseDT.plus({ days: 1 }).toFormat("yyyy-MM-dd");

  const sunriseDT = getSolarDateTime({
    ...params,
    key: "sunrise",
  });

  const sunsetDT = getSolarDateTime({
    ...params,
    key: "sunset",
  });

  const previousSunsetDT = getSolarDateTime({
    dateISO: prevDateISO,
    timezone: params.timezone,
    lat: params.lat,
    lon: params.lon,
    key: "sunset",
  });

  const nextSunriseDT = getSolarDateTime({
    dateISO: nextDateISO,
    timezone: params.timezone,
    lat: params.lat,
    lon: params.lon,
    key: "sunrise",
  });

  return {
    method: "suncalc",
    sunrise: formatHm(sunriseDT),
    sunset: formatHm(sunsetDT),
    previousSunset: formatHm(previousSunsetDT),
    nextSunrise: formatHm(nextSunriseDT),
    sunriseDT,
    sunsetDT,
    previousSunsetDT,
    nextSunriseDT,
    hasSunrise: !!sunriseDT,
    hasSunset: !!sunsetDT,
  };
}