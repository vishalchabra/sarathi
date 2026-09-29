// FILE: src/server/qa/dasha.ts
// Adapter that prefers your Life Report timeline; never forces MD from env.
// It only touches modules that actually exist in most repos: "@/server/dasha" and "@/lib/dasha".

export type Birth = {
  dateISO: string; // "YYYY-MM-DD"
  time: string;    // "HH:mm"
  tz: string;      // IANA TZ, e.g. "Asia/Kolkata"
  lat: number;
  lon: number;
};

export type DashaSpan = { fromISO: string; toISO: string; label: string; note?: string };

const DEBUG = process.env.NODE_ENV !== "production";

/* ----------------------------- tiny utils ----------------------------- */
const toISO = (d: Date | string) => new Date(d).toISOString().slice(0, 10);
const addYearsISO = (fromISO: string, years = 3) => {
  const d = new Date(fromISO);
  d.setFullYear(d.getFullYear() + years);
  return toISO(d);
};
const Cap = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

/** Normalize many possible row shapes into {fromISO,toISO,label,note} */
function normalizeRows(rows: any[], nowISO: string, horizonISO: string): DashaSpan[] {
  if (!Array.isArray(rows)) return [];

  const spans = rows
    .map((r) => {
      // Supported keys
      const fromISO =
        r?.fromISO ?? r?.startISO ?? r?.start ?? r?.from ??
        (r?.start instanceof Date ? toISO(r.start) : undefined);
      const toIso =
        r?.toISO ?? r?.endISO ?? r?.end ?? r?.to ??
        (r?.end instanceof Date ? toISO(r.end) : undefined);

      const md = r?.md ?? r?.major ?? r?.mahadasha;
      const ad = r?.ad ?? r?.minor ?? r?.antardasha;

      if (!fromISO || !toIso || !md || !ad) return null;

      const a = Date.parse(fromISO);
      const b = Date.parse(toIso);
      if (!Number.isFinite(a) || !Number.isFinite(b)) return null;

      return {
        fromISO: fromISO.slice(0, 10),
        toISO: toIso.slice(0, 10),
        label: `${Cap(String(md))} MD / ${Cap(String(ad))} AD`,
        note: r?.note,
      } as DashaSpan;
    })
    .filter(Boolean) as DashaSpan[];

  // Keep only spans in [now, horizon] window
  return spans.filter((s) => s.toISO >= nowISO && s.fromISO <= horizonISO);
}

/* ---------- fallback builder using lib's buildAntardashaSchedule ---------- */
async function expandFromCurrentMD(
  mdPlanet: string,
  mdStartISO: string,
  yearsHorizon = 3
): Promise<DashaSpan[]> {
  try {
    const lib: any = await import("@/lib/dasha");
    const build = lib?.buildAntardashaSchedule;
    if (typeof build !== "function") return [];

    const from = new Date(mdStartISO);
    const rows = build(mdPlanet, from); // [{ md, ad, start: Date, end: Date }]

    const nowISO = toISO(new Date());
    const horizonISO = addYearsISO(nowISO, yearsHorizon);

    return rows
      .filter((r: any) => toISO(r.end) >= nowISO && toISO(r.start) <= horizonISO)
      .map((r: any) => ({
        fromISO: toISO(r.start),
        toISO: toISO(r.end),
        label: `${Cap(r.md)} MD / ${Cap(r.ad)} AD`,
      })) as DashaSpan[];
  } catch (e) {
    if (DEBUG) console.warn("[dasha] expandFromCurrentMD failed:", e);
    return [];
  }
}

/* -------------------------------- MAIN -------------------------------- */
export async function fetchDashaSpans(
  birth: Birth,
  yearsHorizon = 3
): Promise<DashaSpan[]> {
  const nowISO = toISO(new Date());
  const horizonISO = addYearsISO(nowISO, yearsHorizon);

  /* 1) Try a ready-made timeline from your server module */
  try {
    const serverMod: any = await import("@/server/dasha");

    // Common signature: getTimeline(birth, { fromISO, toISO })
    if (typeof serverMod?.getTimeline === "function") {
      const rows = await serverMod.getTimeline(birth, { fromISO: nowISO, toISO: horizonISO });
      const spans = normalizeRows(rows, nowISO, horizonISO);
      if (spans.length) {
        if (DEBUG) console.log("[dasha] using @/server/dasha#getTimeline:", spans.length);
        return spans;
      }
    }

    // Other typical names/signatures
    const candidates = ["computeDashaTimeline", "vimshottariTimeline", "getDashaTimeline", "timeline", "getDashaSpans"];
    for (const fn of candidates) {
      if (typeof serverMod?.[fn] === "function") {
        const rows = await serverMod[fn](birth, nowISO, horizonISO);
        const spans = normalizeRows(rows, nowISO, horizonISO);
        if (spans.length) {
          if (DEBUG) console.log(`[dasha] using @/server/dasha#${fn}:`, spans.length);
          return spans;
        }
      }
    }

    // If server can at least tell us the current MD and its start, expand via lib
    const getCur = serverMod?.getCurrentMajorDasha
      ?? serverMod?.currentMajorDasha
      ?? serverMod?.currentMD;

    if (typeof getCur === "function") {
      const cur = await getCur(birth); // expect { planet: "Rahu", startISO: "YYYY-MM-DD" }
      if (cur?.planet && cur?.startISO) {
        const spans = await expandFromCurrentMD(cur.planet, cur.startISO, yearsHorizon);
        if (spans.length) {
          if (DEBUG) console.log("[dasha] using server currentMD + lib expander:", spans.length);
          return spans;
        }
      }
    }
  } catch (e) {
    // If "@/server/dasha" doesn't exist or throws, just continue
    if (DEBUG) console.log("[dasha] no usable @/server/dasha:", e?.toString?.() ?? e);
  }

  /* 2) Try the lib directly if it exposes a timeline (some Life Report setups do) */
  try {
    const lib: any = await import("@/lib/dasha");

    // Look for common export names
    const fnName =
      ["vimshottariTimeline", "getDashaTimeline", "computeDashaTimeline", "timeline", "getDashaSpans", "default"]
        .find((k) => typeof lib?.[k] === "function");

    if (fnName) {
      const rows = await lib[fnName](birth, { fromISO: nowISO, toISO: horizonISO });
      const spans = normalizeRows(rows, nowISO, horizonISO);
      if (spans.length) {
        if (DEBUG) console.log(`[dasha] using @/lib/dasha#${fnName}:`, spans.length);
        return spans;
      }
    }

    // If lib exports only the builder, we still need current MD/start from somewhere -> not available here.
  } catch (e) {
    if (DEBUG) console.log("[dasha] no usable @/lib/dasha timeline:", e?.toString?.() ?? e);
  }

  /* 3) Nothing usable: return [] so the UI shows the synthetic windows (correct > wrong). */
  if (DEBUG) console.log("[dasha] no timeline found — returning [] (synthetic fallback will be shown)");
  return [];
}
