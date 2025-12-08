// FILE: src/server/qa/dasha.ts
// Adapter: prefer Life-report MD table → expand AD spans; never force ENV unless explicitly set.

export type Birth = {
  dateISO: string; // "YYYY-MM-DD"
  time: string;    // "HH:mm"
  tz: string;      // e.g., "Asia/Kolkata"
  lat: number;
  lon: number;
};

export type DashaSpan = { fromISO: string; toISO: string; label: string; note?: string };

// ---------- small utils ----------
const iso = (d: Date | string) => new Date(d).toISOString().slice(0, 10);
const Cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "");
const addYears = (fromISO: string, years = 3) => {
  const d = new Date(fromISO);
  d.setFullYear(d.getFullYear() + years);
  return iso(d);
};

// ---------- AD builder from a known MD ----------
async function buildADSpansFrom(mdPlanet: string, mdStartISO: string, yearsHorizon = 3): Promise<DashaSpan[]> {
  // Uses your existing lib/dasha buildAntardashaSchedule (already in your repo)
  const { buildAntardashaSchedule } = await import("@/lib/dasha");
  const rows = buildAntardashaSchedule(mdPlanet, new Date(mdStartISO));
  const fromISO = iso(new Date());
  const toISO = addYears(fromISO, yearsHorizon);
  return rows
    .filter((r: any) => iso(r.end) >= fromISO && iso(r.start) <= toISO)
    .map((r: any) => ({
      fromISO: iso(r.start),
      toISO: iso(r.end),
      label: `${Cap(r.md)} MD / ${Cap(r.ad)} AD`,
    }));
}

// ---------- main ----------
export async function fetchDashaSpans(birth: Birth, yearsHorizon = 3): Promise<DashaSpan[]> {
  const nowISO = iso(new Date());
  const horizonISO = addYears(nowISO, yearsHorizon);

  // 1) LIFE provider (your new server shim)
  try {
    const life = await import("@/server/life/engine"); // <— the file you just created
    const fn = life.vimshottariMDTable;
    if (typeof fn === "function") {
      const mdRows: Array<{ planet: string; startISO: string; endISO: string }> = await fn(birth);
      if (Array.isArray(mdRows) && mdRows.length) {
        // find the current MD row
        const cur = mdRows.find(
          (r) => iso(r.startISO) <= nowISO && nowISO <= iso(r.endISO)
        ) ?? mdRows[0];

        if (cur?.planet && cur?.startISO) {
          return buildADSpansFrom(cur.planet, iso(cur.startISO), yearsHorizon);
        }
      }
    }
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[QA] Life provider not available:", (e as Error)?.message);
    }
  }

  // 2) Optional, explicit ENV forcing (only if you *really* set these)
  const md = (process.env.DASHA_MD || "").trim();
  const mdStart = (process.env.DASHA_MD_START || "").trim();
  if (md && mdStart) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[QA] Using explicit ENV MD/AD fallback:", md, mdStart);
    }
    return buildADSpansFrom(md, mdStart, yearsHorizon);
  }

  // 3) Nothing found → return [] so the timing engine uses synthetic windows
  if (process.env.NODE_ENV !== "production") {
    console.warn("[QA] No Life provider and no ENV MD → returning [] (synthetic fallback upstream).");
  }
  return [];
}
