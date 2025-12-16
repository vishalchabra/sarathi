import { vimshottariMDTable } from "@/server/astro/vimshottari-core";




function assert(cond: any, msg: string) {
  if (!cond) throw new Error(msg);
}

async function main() {
  // Use the SAME Moon sidereal longitude you logged earlier (Moon°= 251.53)
  const birth = {
    dateISO: "1984-01-21",
    time: "23:35",
    tz: "Asia/Kolkata",
    lat: 29.9856799,
    lon: 77.5040646,
    moonSiderealLongitude: 141.64499767356253,
  };

  const rows = await vimshottariMDTable(birth);

  assert(Array.isArray(rows) && rows.length > 0, "No MD rows returned");
  function daysBetween(aISO: string, bISO: string) {
  const a = new Date(aISO + "T00:00:00.000Z").getTime();
  const b = new Date(bISO + "T00:00:00.000Z").getTime();
  return Math.round(Math.abs(a - b) / 86400000);
}

  const rahu = rows.find((r) => r.planet === "Rahu");
  assert(!!rahu, "Rahu MD not found");

  // These dates match your screenshot (the correct “finally” output)
  const expectedRahuStart = "2014-08-04"; // keep your original expected
assert(
  daysBetween(rahu.startISO, expectedRahuStart) <= 1,
  `Rahu start mismatch: got ${rahu.startISO}, expected ~${expectedRahuStart}`
);

 const expectedRahuEnd = "2032-08-04"; // keep your original expected
assert(
  daysBetween(rahu.endISO, expectedRahuEnd) <= 1,
  `Rahu end mismatch: got ${rahu.endISO}, expected ~${expectedRahuEnd}`
);


  console.log("✅ Vimshottari regression test passed:", rahu);
}

main().catch((e) => {
  console.error("❌ Vimshottari regression test failed:", e);
  process.exit(1);
});
