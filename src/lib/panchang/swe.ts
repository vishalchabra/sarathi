// src/lib/panchang/swe.ts

import "server-only";
import { getSwe } from "@/server/astro/swe";
// Server-only Swiss Ephemeris Panchang (Tithi / Yoga / Moon Nakshatra)
export type PanchangInput = {
  dateISO: string;       // "1984-01-21"
  time: string;          // "23:35" (24h, local time)
  tz: string;            // IANA tz e.g. "Asia/Kolkata"
  lat: number;
  lon: number;
};

export type PanchangOut = {
  weekday: string;
  tithiName: string;
  yogaName: string;
  moonNakshatraName: string;
  moonNakshatraTheme: string;
};

// 27 nakshatras (Lahiri), each 13°20'
const NAKS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha",
  "Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha",
  "Purva Bhadrapada","Uttara Bhadrapada","Revati"
];

function wkdayLabel(d: Date) {
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];
}

// minimal themes – tweak to your style later
function nakTheme(n: string) {
  const m: Record<string,string> = {
    "Magha":"royal lineage, dignity, ancestors",
    "Purva Phalguni":"pleasure, artistry, generosity",
    "Uttara Phalguni":"commitment, patronage, steady support",
  };
  return m[n] || "";
}

export async function getPanchangWithSwiss(inp: PanchangInput): Promise<PanchangOut> {
  // dynamic import avoids bundling in client
  const swe = await getSwe();

  // build UTC from local wall time + tz
  const zoned = new Date(`${inp.dateISO}T${inp.time}:00`);
  // Next/Node doesn’t shift by IANA here; we just treat as local and compute UTC offset via Intl.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: inp.tz, hour12: false, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
  const parts = fmt.formatToParts(zoned).reduce<Record<string,string>>((a, p) => (a[p.type]=p.value, a), {});
  const localISO = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
  const localDate = new Date(localISO);
  const utcMillis = localDate.getTime() - (
    // difference between same instant rendered in tz vs system tz
    new Date(localDate.toLocaleString("en-US", { timeZone: "UTC" })).getTime() -
    new Date(localDate.toLocaleString("en-US", { timeZone: inp.tz })).getTime()
  );
  const whenUTC = new Date(utcMillis);

  const jd = swe.swe_julday(
    whenUTC.getUTCFullYear(),
    whenUTC.getUTCMonth() + 1,
    whenUTC.getUTCDate(),
    whenUTC.getUTCHours() + whenUTC.getUTCMinutes()/60 + whenUTC.getUTCSeconds()/3600,
    swe.SE_GREG_CAL
  );

  // ecliptic longitudes (tropical), then convert to sidereal Lahiri
  const iflag = swe.SEFLG_SWIEPH;
  const moon = swe.swe_calc_ut(jd, swe.SE_MOON, iflag);
  const sun  = swe.swe_calc_ut(jd, swe.SE_SUN,  iflag);
  const aya  = swe.swe_get_ayanamsa_ut(jd); // Lahiri by default

  const lonMoonSid = (moon.longitude - aya + 360) % 360;
  const lonSunSid  = (sun .longitude - aya + 360) % 360;

  // Tithi: (Moon - Sun) / 12° -> 30 tithis
  const tithiIndex = Math.floor(((lonMoonSid - lonSunSid + 360) % 360) / 12);
  const TITHIS = [
    "Pratipada","Dvitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami",
    "Ekadashi","Dvadashi","Trayodashi","Chaturdashi","Purnima/Amavasya",
    "Pratipada","Dvitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami",
    "Ekadashi","Dvadashi","Trayodashi","Chaturdashi","Purnima/Amavasya"
  ];
  const tithiName = TITHIS[tithiIndex];

  // Yoga: (Sun + Moon) sidereal longitudes / 13°20' -> 27
  const yogaIndex = Math.floor(((lonMoonSid + lonSunSid) % 360) / (360/27));
  const YOGAS = [
    "Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shoola",
    "Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyana","Parigha",
    "Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"
  ];
  const yogaName = YOGAS[yogaIndex];

  // Nakshatra: Moon longitude / 13°20' -> 27
  const nakIndex = Math.floor(lonMoonSid / (360/27));
  const moonNakshatraName = NAKS[nakIndex];
  const moonNakshatraTheme = nakTheme(moonNakshatraName);

  return {
    weekday: wkdayLabel(localDate),
    tithiName,
    yogaName,
    moonNakshatraName,
    moonNakshatraTheme,
  };
}
