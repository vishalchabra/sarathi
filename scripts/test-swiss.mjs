import { Constants, load } from "@fusionstrings/swiss-eph";

const eph = await load();

console.log("loaded:", typeof eph);
console.log(
  "house methods:",
  Object.keys(eph).filter((k) => k.toLowerCase().includes("house"))
);
console.log(
  "ayanamsa methods:",
  Object.keys(eph).filter((k) => k.toLowerCase().includes("ayan"))
);
console.log(
  "calc methods:",
  Object.keys(eph).filter((k) => k.toLowerCase().includes("calc"))
);

const jd = eph.swe_julday(2026, 4, 22, 12.0, Constants.SE_GREG_CAL);
console.log("jd", jd);

const ay = eph.swe_get_ayanamsa_ut(jd);
console.log("ayanamsa", ay);

const houses = eph.swe_houses_ex(
  jd,
  Constants.SEFLG_SIDEREAL,
  29.9637438,
  77.5427464,
  "P"
);

console.log("houses raw", JSON.stringify(houses, null, 2));