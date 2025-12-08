// FILE: src/lib/astro/getPanchang.ts
import path from "node:path";

export type PanchangOut = {
  weekday: string;
  tithiName: string;
  yogaName: string;
  moonNakshatraName: string;
  moonNakshatraTheme?: string;
  raw: { sunLon: number; moonLon: number; tithiIndex: number; yogaIndex: number; nakshatraIndex: number };
};

const TITHI = [
  "Pratipada","Dvitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami",
  "Ekadashi","Dvadashi","Trayodashi","Chaturdashi","Purnima/Amavasya",
];
const NAKSHATRA = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati",
];
const YOGA = [
  "Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarman","Dhriti","Shoola","Ganda",
  "Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyana","Parigha","Shiva",
  "Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti",
];

const norm360 = (x: number) => ((x % 360) + 360) % 360;
const weekdayOfUTC = (d: Date) => ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getUTCDay()];

function toJulianUT(dateISO: string, timeHHmm: string, swe: any) {
  const dLocal = new Date(`${dateISO}T${timeHHmm}:00`);
  const Y = dLocal.getUTCFullYear();
  const M = dLocal.getUTCMonth() + 1;
  const D = dLocal.getUTCDate();
  const H = dLocal.getUTCHours() + dLocal.getUTCMinutes()/60 + dLocal.getUTCSeconds()/3600;
  const jdut = swe.swe_julday(Y, M, D, H, swe.SE_GREG_CAL);
  return { jdut, weekday: weekdayOfUTC(new Date(Date.UTC(Y, M-1, D))) };
}

export async function getPanchang(
  { dateISO, time, tz, lat, lon }: { dateISO: string; time: string; tz: string; lat?: number; lon?: number }
): Promise<PanchangOut> {
  // 👇 lazy cjs require so Turbopack doesn't bundle the native binary
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const swisseph: any = require("swisseph");

  // ephemeris files path (works on Windows too)
  const ephePath = path.join(process.cwd(), "node_modules", "swisseph", "ephe");
  swisseph.swe_set_ephe_path(ephePath);

  // Lahiri sidereal
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  const { jdut, weekday } = toJulianUT(dateISO, time, swisseph);
  const iflag = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;

  const sun = swisseph.swe_calc_ut(jdut, swisseph.SE_SUN, iflag);
  const moon = swisseph.swe_calc_ut(jdut, swisseph.SE_MOON, iflag);
  if (sun.error || moon.error) throw new Error(String(sun.error || moon.error));

  const sunLon = sun.x[0];
  const moonLon = moon.x[0];

  const tithiAngle = norm360(moonLon - sunLon);
  const tithiIndex = Math.floor(tithiAngle / 12) + 1;
  const tithiName = TITHI[(tithiIndex - 1) % 15];

  const yogaAngle = norm360(moonLon + sunLon);
  const yogaIndex = Math.floor(yogaAngle / (13 + 1/3)) + 1;
  const yogaName = YOGA[(yogaIndex - 1) % 27];

  const nakIndex = Math.floor(norm360(moonLon) / (13 + 1/3)) + 1;
  const moonNakshatraName = NAKSHATRA[(nakIndex - 1) % 27];

  return {
    weekday,
    tithiName,
    yogaName,
    moonNakshatraName,
    moonNakshatraTheme: "",
    raw: { sunLon, moonLon, tithiIndex, yogaIndex, nakshatraIndex: nakIndex },
  };
}
