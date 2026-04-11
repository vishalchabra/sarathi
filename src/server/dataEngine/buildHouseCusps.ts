import "server-only";
import { DateTime } from "luxon";
import { sweJulday, sweCall } from "@/server/astro/swe-remote";

export type HouseSystem = "equal" | "sripati";

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

function wrap360(x: number) {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

function norm24(x: number) {
  let v = x % 24;
  if (v < 0) v += 24;
  return v;
}

function julianCenturiesSinceJ2000(jd: number) {
  return (jd - 2451545.0) / 36525.0;
}

function meanObliquityDeg(jd: number) {
  const T = julianCenturiesSinceJ2000(jd);
  const seconds =
    21.448 -
    T *
      (46.815 +
        T * (0.00059 - T * 0.001813));

  return 23 + 26 / 60 + seconds / 3600;
}

function gmstHours(jd: number) {
  const T = (jd - 2451545.0) / 36525.0;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;

  return norm24(gmst / 15);
}

function localSiderealTimeHours(jd: number, lonDeg: number) {
  return norm24(gmstHours(jd) + lonDeg / 15);
}

function computeMcLongitudeTropical(jd: number, lonDeg: number) {
  const lstHours = localSiderealTimeHours(jd, lonDeg);
  const ramcDeg = lstHours * 15;
  const epsDeg = meanObliquityDeg(jd);

  const ramc = degToRad(ramcDeg);
  const eps = degToRad(epsDeg);

  const y = Math.sin(ramc) * Math.cos(eps);
  const x = Math.cos(ramc);

  return wrap360(radToDeg(Math.atan2(y, x)));
}

function forwardArc(start: number, end: number) {
  return wrap360(end - start);
}

function buildSripatiCuspsFromAngles(ascLon: number, mcLon: number) {
  const asc = wrap360(ascLon);
  const mc = wrap360(mcLon);
  const desc = wrap360(asc + 180);
  const ic = wrap360(mc + 180);

  const arc10to1 = forwardArc(mc, asc);
  const arc1to4 = forwardArc(asc, ic);
  const arc4to7 = forwardArc(ic, desc);
  const arc7to10 = forwardArc(desc, mc);

  const c10 = mc;
  const c11 = wrap360(mc + arc10to1 / 3);
  const c12 = wrap360(mc + (2 * arc10to1) / 3);
  const c1 = asc;

  const c2 = wrap360(asc + arc1to4 / 3);
  const c3 = wrap360(asc + (2 * arc1to4) / 3);
  const c4 = ic;

  const c5 = wrap360(ic + arc4to7 / 3);
  const c6 = wrap360(ic + (2 * arc4to7) / 3);
  const c7 = desc;

  const c8 = wrap360(desc + arc7to10 / 3);
  const c9 = wrap360(desc + (2 * arc7to10) / 3);

  return [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12];
}

export async function buildHouseCusps(params: Params): Promise<HouseCuspsResult> {
  const { birth, ascLon } = params;

  const dt = DateTime.fromISO(`${birth.dateISO}T${birth.time}`, {
    zone: birth.timezone,
  }).toUTC();

  const hour =
    dt.hour +
    dt.minute / 60 +
    dt.second / 3600;

  const jd = await sweJulday(
    dt.year,
    dt.month,
    dt.day,
    hour,
    1
  );

  const ayanamsa = await sweCall<number>("swe_get_ayanamsa_ut", jd);

  const mcTropical = computeMcLongitudeTropical(jd, birth.lon);
  const mcSidereal = wrap360(mcTropical - ayanamsa);

  const cusps = buildSripatiCuspsFromAngles(ascLon, mcSidereal);

  return {
    system: "sripati",
    ascLon: wrap360(ascLon),
    mcLon: wrap360(mcSidereal),
    cusps,
  };
}

export default buildHouseCusps;