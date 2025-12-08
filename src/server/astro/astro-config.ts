// FILE: /src/server/astro/astro-config.ts

export const AstroConfig = {
  siderealMode: "LAHIRI",  // or KRISHNAMURTI, RAMAN (pulled from env)
  
  divisionalChartHouseSystem: "VEDIC", 
  // "VEDIC" => classical varga houses (recommended)
  // "SWISS" => recalc houses via SwissEph for each varga
  // "BOTH"  => return both (for advanced UI)

  returnAllVargas: true,    // D1–D60
  returnStrengths: true,    // shadbala, baladi, naisargika, etc. (phase 2)
  returnYogas: true,        // Gaja Kesari, Saraswati, Chandra-Mangal

  precision: {
    panchangEvents: true,   // tithi end, nakshatra end, karana end, etc.
    riseSet: true,          // true sunrise/moonrise
    muhurta: true,          // Rahu Kalam, Yama, Gulika, etc.
  }
};
