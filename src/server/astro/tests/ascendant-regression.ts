// FILE: src/server/astro/tests/ascendant-regression.ts
import { buildLifeReport } from "../life-engine";

function fail(msg: string): never {
  console.error("❌ ASC REGRESSION FAILED");
  console.error(msg);
  process.exit(1);
}

(async () => {
  const input = {
    name: "AscRegression",
    birthDateISO: "1985-01-21",
    birthTime: "23:35",
    birthTz: "Asia/Kolkata",
    lat: 29.968,
    lon: 77.5552,
  };

  const report = await buildLifeReport(input);

  const asc = report?.ascSign;
  const planets = Array.isArray(report?.planets) ? report.planets : [];

  const sun = planets.find((p: any) => p?.name === "Sun");
  const moon = planets.find((p: any) => p?.name === "Moon");

  if (!asc) fail(`No ascSign returned. Got: ${JSON.stringify(report?.ascSign)}`);
  if (!sun) fail("Sun not found in report.planets");
  if (!moon) fail("Moon not found in report.planets");

  const expected = {
    ascSign: "Virgo",
    sunHouse: 5,
    moonHouse: 12,
  };

  const got = {
    ascSign: asc,
    sunHouse: sun.house,
    moonHouse: moon.house,
    ascDeg: report?.ascDeg,
  };

  if (got.ascSign !== expected.ascSign) {
    fail(`Expected ascSign=${expected.ascSign} but got ${got.ascSign}. Details: ${JSON.stringify(got)}`);
  }
  if (got.sunHouse !== expected.sunHouse) {
    fail(`Expected Sun house=${expected.sunHouse} but got ${got.sunHouse}. Details: ${JSON.stringify(got)}`);
  }
  if (got.moonHouse !== expected.moonHouse) {
    fail(`Expected Moon house=${expected.moonHouse} but got ${got.moonHouse}. Details: ${JSON.stringify(got)}`);
  }

  console.log("✅ ASC REGRESSION PASSED", got);
  process.exit(0);
})().catch((e) => {
  fail(String(e?.stack || e?.message || e));
});
