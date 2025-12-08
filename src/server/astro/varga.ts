// FILE: /src/server/astro/varga.ts
import "server-only";
import { getSwe } from "@/server/astro/swe";
import { AstroConfig } from "@/server/astro/astro-config";

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

function wrap360(x: number) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

function signOfDeg(deg: number) {
  return SIGNS[Math.floor(wrap360(deg) / 30)];
}

/* ---------------------------------------------------------
   SWISS EPHEMERIS WRAPPER
   --------------------------------------------------------- */
async function getSiderealPlanetLon(jdUt: number, planetCode: number) {
  const swe = getSwe();
  swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);

  const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;

  const r = swe.swe_calc_ut(jdUt, planetCode, flags);
  return wrap360(r.longitude);
}

/* ---------------------------------------------------------
   CLASSICAL VARGA SIGN COMPUTATION
   --------------------------------------------------------- */

function vargaSign(deg: number, varga: number): string {
  // Deg = 0–360
  const signIndex = Math.floor(deg / 30);        // 0–11
  const inSignDeg = deg % 30;                    // 0–30
  const part = 30 / varga;                       // size of each varga division

  const division = Math.floor(inSignDeg / part); // 0–(varga-1)

  // Classical rule:
  // Varga sign = signIndex * varga + division  (mod 12)
  const newSign = (signIndex * varga + division) % 12;
  return SIGNS[newSign];
}

/* ---------------------------------------------------------
   SPECIAL VARGA RULES (parashari)
   --------------------------------------------------------- */

function navamsaSign(deg: number): string {
  // D9
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  const pada = Math.floor(inSignDeg / 3.3333333); // 0–8
  const start = [0,3,6,9,12,15,18,21,24,27,30,33]; // start points in D9 cycle

  const idx = (start[signIndex] + pada) % 12;
  return SIGNS[idx];
}

function dasamsaSign(deg: number): string {
  // D10 (Hierarchic – different for odd/even signs)
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;
  const part = 3; // 30° / 10

  const division = Math.floor(inSignDeg / part);

  if (signIndex % 2 === 0) {
    // Odd signs start from Aries
    const idx = division % 12;
    return SIGNS[idx];
  } else {
    // Even signs start from Leo
    const idx = (division + 4) % 12;
    return SIGNS[idx];
  }
}

function saptamsaSign(deg: number): string {
  // D7
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;
  const part = 30 / 7;

  const division = Math.floor(inSignDeg / part);

  // Odd signs start from Aries
  // Even signs start from Libra
  const start = signIndex % 2 === 0 ? 0 : 6;
  const idx = (start + division) % 12;
  return SIGNS[idx];
}

function dwadashaSign(deg: number): string {
  // D12
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  const part = 30 / 12;
  const division = Math.floor(inSignDeg / part);

  return SIGNS[division];
}

function shodashamsaSign(deg: number): string {
  // D16
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  const part = 30 / 16;
  const division = Math.floor(inSignDeg / part);

  const idx = (signIndex * 4 + division) % 12;
  return SIGNS[idx];
}

function vimsamsaSign(deg: number): string {
  // D20
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  const part = 30 / 20;
  const division = Math.floor(inSignDeg / part);

  const idx = (signIndex * 2 + division) % 12;
  return SIGNS[idx];
}

function chaturvimsamsaSign(deg: number): string {
  // D24
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  const part = 30 / 24;
  const division = Math.floor(inSignDeg / part);

  const idx = (signIndex * 2 + division) % 12;
  return SIGNS[idx];
}

function bhamsaSign(deg: number): string {
  // D27
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  const part = 30 / 27;
  const division = Math.floor(inSignDeg / part);

  const idx = (signIndex * 9 + division) % 12;
  return SIGNS[idx];
}

function trimsamsaSign(deg: number): string {
  // D30 (Malefic distribution)
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  if (signIndex % 2 === 0) {
    // Even signs: 0–5 Aries, 5–10 Mercury, 10–18 Jupiter, 18–25 Venus, 25–30 Saturn
    if (inSignDeg < 5) return "Aries";
    if (inSignDeg < 10) return "Gemini";
    if (inSignDeg < 18) return "Sagittarius";
    if (inSignDeg < 25) return "Libra";
    return "Capricorn";
  } else {
    // Odd signs: 0–5 Taurus, 5–12 Virgo, 12–20 Capricorn, 20–28 Scorpio, 28–30 Aries
    if (inSignDeg < 5) return "Taurus";
    if (inSignDeg < 12) return "Virgo";
    if (inSignDeg < 20) return "Capricorn";
    if (inSignDeg < 28) return "Scorpio";
    return "Aries";
  }
}

function khavedamsaSign(deg: number) {
  // D40
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  const part = 30 / 40;
  const division = Math.floor(inSignDeg / part);

  const start = signIndex % 2 === 0 ? 0 : 6;
  return SIGNS[(start + division) % 12];
}

function akshavedamsaSign(deg: number) {
  // D45
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  const part = 30 / 45;
  const division = Math.floor(inSignDeg / part);

  const idx = (signIndex * 15 + division) % 12;
  return SIGNS[idx];
}

function shashtiamsaSign(deg: number) {
  // D60
  const signIndex = Math.floor(deg / 30);
  const inSignDeg = deg % 30;

  const part = 0.5; // 30° / 60
  const division = Math.floor(inSignDeg / part);

  const idx = division % 12;
  return SIGNS[idx];
}

/* ---------------------------------------------------------
   MAP VARGA NUMBER → CORRESPONDING SIGN FUNCTION
   --------------------------------------------------------- */

function getVargaSignFunction(v: number) {
  switch (v) {
    case 1: return (deg: number) => signOfDeg(deg);
    case 2: return (deg: number) => vargaSign(deg, 2);
    case 3: return (deg: number) => vargaSign(deg, 3);
    case 4: return (deg: number) => vargaSign(deg, 4);
    case 7: return saptamsaSign;
    case 9: return navamsaSign;
    case 10: return dasamsaSign;
    case 12: return dwadashaSign;
    case 16: return shodashamsaSign;
    case 20: return vimsamsaSign;
    case 24: return chaturvimsamsaSign;
    case 27: return bhamsaSign;
    case 30: return trimsamsaSign;
    case 40: return khavedamsaSign;
    case 45: return akshavedamsaSign;
    case 60: return shashtiamsaSign;
    default:
      return (deg: number) => vargaSign(deg, v);
  }
}

/* ---------------------------------------------------------
   HOUSE MAPPING INSIDE VARGA
   --------------------------------------------------------- */

function computeVargaHouses(vargaAsc: string, planetSign: string) {
  // House = relative position from Varga Ascendant
  const ascIndex = SIGNS.indexOf(vargaAsc);
  const pIndex = SIGNS.indexOf(planetSign);

  let house = (pIndex - ascIndex + 12) % 12;
  return house + 1; // houses are 1–12
}

/* ---------------------------------------------------------
   BUILD A SINGLE VARGA CHART
   --------------------------------------------------------- */

export async function buildVarga(jdUt: number, lat: number, lon: number, varga: number, planetsInput: any[]) {
  const signFn = getVargaSignFunction(varga);

  // Compute ascendant degree for varga
  const swe = getSwe();
  const houses = swe.swe_houses(jdUt, lat, lon, "P");
  const ascDeg = wrap360(houses.ascendant);
  const ascSign = signFn(ascDeg);

  const planets = [];

  for (const p of planetsInput) {
    const plSign = signFn(p.siderealLongitude);
    const house = computeVargaHouses(ascSign, plSign);

    planets.push({
      name: p.name,
      sign: plSign,
      house,
      siderealLongitude: p.siderealLongitude
    });
  }

  return {
    varga,
    name: `D${varga}`,
    ascDeg,
    ascSign,
    planets
  };
}

/* ---------------------------------------------------------
   BUILD ALL VARGAS (D1–D60)
   --------------------------------------------------------- */

export async function buildAllVargas(opts: {
  jdUt: number;
  lat: number;
  lon: number;
  planets: any[];
}) {
  const { jdUt, lat, lon, planets } = opts;

  if (!AstroConfig.returnAllVargas) {
    return { D1: await buildVarga(jdUt, lat, lon, 1, planets) };
  }

  const vargaList = [
    1,2,3,4,7,9,10,12,16,20,24,27,30,40,45,60
  ];

  const out: any = {};

  for (const v of vargaList) {
    out[`D${v}`] = await buildVarga(jdUt, lat, lon, v, planets);
  }

  return out;
}
