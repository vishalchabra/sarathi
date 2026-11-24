import fs from "node:fs/promises";
import path from "node:path";
import SwephModule from "sweph-wasm";

const START = Date.UTC(1900, 0, 1);
const END = Date.UTC(2101, 0, 1);
const DAY = 86400000;
const MINUTE = 60000;
const SAMPLE = DAY / 4;

const SE_SATURN = 6;
const SEFLG_SPEED = 256;
const SE_SIDM_LAHIRI = 1;

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini",
  "Mrigashira", "Ardra", "Punarvasu", "Pushya",
  "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula",
  "Purva Ashadha", "Uttara Ashadha", "Shravana",
  "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
];

type SaturnState = {
  longitude: number;
  degree: number;
  sign: string;
  signIndex: number;
  nakshatra: string;
  nakshatraIndex: number;
  pada: number;
  retrograde: boolean;
};

type CalendarRow = {
  startUTC: string;
  endUTC: string;
  sign: string;
  signIndex: number;
  nakshatra: string;
  nakshatraIndex: number;
  pada: number;
  retrograde: boolean;
  entryLongitude: number;
};

function wrap360(value: number) {
  return ((value % 360) + 360) % 360;
}

function signedDifference(a: number, b: number) {
  return ((a - b + 540) % 360) - 180;
}

function round(value: number) {
  return Number(value.toFixed(6));
}

async function main() {
  const wasmPath = path.join(
    process.cwd(),
    "public",
    "wasm",
    "swisseph.wasm"
  );

  const binary = await fs.readFile(wasmPath);

  const dataUrl =
    "data:application/wasm;base64," +
    binary.toString("base64");

  const Sweph: any = SwephModule;
  const swe = await Sweph.init(dataUrl);

  swe.swe_set_sid_mode(SE_SIDM_LAHIRI, 0, 0);

  function longitudeAt(timestamp: number): number {
    const jd = timestamp / DAY + 2440587.5;

    const result = swe.swe_calc_ut(
      jd,
      SE_SATURN,
      SEFLG_SPEED
    );

    const rawLongitude =
      result?.longitude ??
      result?.lon ??
      result?.xx?.[0] ??
      result?.data?.[0] ??
      result?.[0];

    const ayanamsa = swe.swe_get_ayanamsa_ut(jd);

    if (
      typeof rawLongitude !== "number" ||
      !Number.isFinite(rawLongitude) ||
      !Number.isFinite(ayanamsa)
    ) {
      throw new Error(
        "Invalid Saturn ephemeris at " +
        new Date(timestamp).toISOString()
      );
    }

    return wrap360(rawLongitude - ayanamsa);
  }

  function stateAt(timestamp: number): SaturnState {
    const longitude = longitudeAt(timestamp);

    // Determine direction using sidereal motion.
    // Central difference over two minutes.
    const before = longitudeAt(timestamp - MINUTE);
    const after = longitudeAt(timestamp + MINUTE);

    const motion = signedDifference(after, before);

    const signIndex = Math.floor(longitude / 30);

    const nakshatraSize = 360 / 27;
    const padaSize = 360 / 108;

    const nakshatraIndex = Math.floor(
      longitude / nakshatraSize
    );

    const pada = Math.floor(
      longitude / padaSize
    ) % 4 + 1;

    return {
      longitude: round(longitude),
      degree: round(longitude % 30),
      sign: SIGNS[signIndex],
      signIndex,
      nakshatra: NAKSHATRAS[nakshatraIndex],
      nakshatraIndex,
      pada,
      retrograde: motion < 0,
    };
  }

  function stateKey(state: SaturnState) {
    return [
      state.signIndex,
      state.nakshatraIndex,
      state.pada,
      state.retrograde ? "R" : "D",
    ].join("|");
  }

  function refineBoundary(
    left: number,
    right: number,
    previousKey: string
  ) {
    while (right - left > MINUTE) {
      const middle = Math.floor((left + right) / 2);

      if (stateKey(stateAt(middle)) === previousKey) {
        left = middle;
      } else {
        right = middle;
      }
    }

    return right;
  }

  function makeRow(
    timestamp: number,
    state: SaturnState
  ): CalendarRow {
    return {
      startUTC: new Date(timestamp).toISOString(),
      endUTC: "",
      sign: state.sign,
      signIndex: state.signIndex,
      nakshatra: state.nakshatra,
      nakshatraIndex: state.nakshatraIndex,
      pada: state.pada,
      retrograde: state.retrograde,
      entryLongitude: state.longitude,
    };
  }

  const rows: CalendarRow[] = [];

  let previousTime = START;
  let previousState = stateAt(START);
  let active = makeRow(START, previousState);

  let lastProgressYear = 1900;

  console.log("Generating Saturn calendar: 1900-2100");
  console.log("Method: Swiss Ephemeris / Lahiri");

  for (
    let timestamp = START + SAMPLE;
    timestamp <= END;
    timestamp += SAMPLE
  ) {
    const currentState = stateAt(timestamp);

    let left = previousTime;
    let leftState = previousState;

    while (
      stateKey(currentState) !== stateKey(leftState)
    ) {
      const boundary = refineBoundary(
        left,
        timestamp,
        stateKey(leftState)
      );

      const nextState = stateAt(boundary);

      active.endUTC =
        new Date(boundary).toISOString();

      rows.push(active);

      active = makeRow(boundary, nextState);

      left = boundary;
      leftState = nextState;
    }

    previousTime = timestamp;
    previousState = currentState;

    const year = new Date(timestamp).getUTCFullYear();

    if (year >= lastProgressYear + 10) {
      console.log(`Processed through ${year}`);
      lastProgressYear = year;
    }
  }

  if (Date.parse(active.startUTC) < END) {
    active.endUTC = new Date(END).toISOString();
    rows.push(active);
  }

  const output = {
    version: 1,
    planet: "Saturn",
    zodiac: "Sidereal",
    ayanamsa: "Lahiri",
    ephemeris: "Swiss Ephemeris WASM",
    coverageStartUTC: new Date(START).toISOString(),
    coverageEndUTC: new Date(END).toISOString(),
    boundaryResolutionMinutes: 1,
    samplingIntervalHours: 6,
    generatedAtUTC: new Date().toISOString(),
    totalRows: rows.length,
    rows,
  };

  const outputDirectory = path.join(
    process.cwd(),
    "src",
    "server",
    "data"
  );

  await fs.mkdir(outputDirectory, {
    recursive: true,
  });

  const outputPath = path.join(
    outputDirectory,
    "saturn-calendar.json"
  );

  await fs.writeFile(
    outputPath,
    JSON.stringify(output, null, 2),
    "utf8"
  );

  console.log("");
  console.log("Saturn calendar generated.");
  console.log(`Total rows: ${rows.length}`);
  console.log(`Saved to: ${outputPath}`);

  console.log("");
  console.log("Recent and upcoming sign ingresses:");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const previous = rows[i - 1];

    if (
      row.startUTC >= "2023-01-01" &&
      row.startUTC < "2036-01-01" &&
      row.sign !== previous.sign
    ) {
      console.log(
        row.startUTC,
        previous.sign,
        "->",
        row.sign,
        row.retrograde ? "(Retrograde)" : "(Direct)"
      );
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});