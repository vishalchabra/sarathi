import "server-only";

import { DateTime } from "luxon";

// NOAA-style approximation.
// Good enough for sunrise/sunset display in the data engine.

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

function radToDeg(r: number) {
  return (r * 180) / Math.PI;
}

function normalize360(v: number) {
  let x = v % 360;
  return x < 0 ? x + 360 : x;
}

function normalizeHours(v: number) {
  let x = v % 24;
  return x < 0 ? x + 24 : x;
}

function dayOfYear(dateISO: string, timezone: string) {
  const dt = DateTime.fromISO(dateISO, { zone: timezone });
  return dt.isValid ? dt.ordinal : 1;
}

function localHourToDateTime(
  dateISO: string,
  timezone: string,
  localHour: number | null
) {
  if (localHour == null || !Number.isFinite(localHour)) return null;

  const hh = Math.floor(localHour);
  const rawMinutes = (localHour - hh) * 60;
  const mm = Math.floor(rawMinutes);
  const ss = Math.round((rawMinutes - mm) * 60);

  const dt = DateTime.fromISO(`${dateISO}T00:00:00`, { zone: timezone }).plus({
    hours: hh,
    minutes: mm,
    seconds: ss,
  });

  return dt.isValid ? dt : null;
}

function formatHm(dt: any) {
  if (!dt || !dt.isValid) return null;
  return dt.toFormat("hh:mm:ss a");
}

function computeSunTime(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
  isSunrise: boolean;
}) {
  const { dateISO, timezone, lat, lon, isSunrise } = params;

  const N = dayOfYear(dateISO, timezone);
  const lngHour = lon / 15;

  const t = isSunrise
    ? N + (6 - lngHour) / 24
    : N + (18 - lngHour) / 24;

  const M = 0.9856 * t - 3.289;

  let L =
    M +
    1.916 * Math.sin(degToRad(M)) +
    0.02 * Math.sin(degToRad(2 * M)) +
    282.634;

  L = normalize360(L);

  let RA = radToDeg(Math.atan(0.91764 * Math.tan(degToRad(L))));
  RA = normalize360(RA);

  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = RA + (Lquadrant - RAquadrant);
  RA = RA / 15;

  const sinDec = 0.39782 * Math.sin(degToRad(L));
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosH =
    (Math.cos(degToRad(90.833)) - sinDec * Math.sin(degToRad(lat))) /
    (cosDec * Math.cos(degToRad(lat)));

  if (cosH > 1 || cosH < -1) {
    return null;
  }

  let H = isSunrise
    ? 360 - radToDeg(Math.acos(cosH))
    : radToDeg(Math.acos(cosH));

  H = H / 15;

  const T = H + RA - 0.06571 * t - 6.622;
  const UT = normalizeHours(T - lngHour);

  const offsetHours =
    DateTime.fromISO(`${dateISO}T12:00:00`, { zone: timezone }).offset / 60;

  const localTime = normalizeHours(UT + offsetHours);

  return localHourToDateTime(dateISO, timezone, localTime);
}

export async function buildSolarTimes(params: {
  dateISO: string;
  timezone: string;
  lat: number;
  lon: number;
}) {
  const sunriseDT = computeSunTime({
    ...params,
    isSunrise: true,
  });

  const sunsetDT = computeSunTime({
    ...params,
    isSunrise: false,
  });

  return {
    sunrise: formatHm(sunriseDT),
    sunset: formatHm(sunsetDT),
    sunriseDT,
    sunsetDT,
  };
}