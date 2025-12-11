// FILE: src/server/astro/dasha.ts
import "server-only";
import { DateTime } from "luxon";
import { getSwe } from "@/server/astro/swe";

type Place = { tz?: string; lat?: number; lon?: number; name?: string };

export type DashaSpan = {
  lord: string;
  start: string; // ISO UTC
  end: string;   // ISO UTC
  level: "MD" | "AD" | "PD";
};

/* =======================================================================
   Vimshottari constants
======================================================================= */
const LORDS = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
] as const;

const YEARS: Record<(typeof LORDS)[number], number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const NAK_LORD: (typeof LORDS)[number][] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

// 27 nakshatras * 13°20' = 13.333333...
const NAK_SIZE_DEG = 360 / 27;

/* =======================================================================
   Small helpers
======================================================================= */
function wrap360(x: number) {
  x %= 360;
  return x < 0 ? x + 360 : x;
}

function sequenceFrom(lord: (typeof LORDS)[number]) {
  const i = LORDS.indexOf(lord);
  return [...LORDS.slice(i), ...LORDS.slice(0, i)];
}

/* =======================================================================
   Robust parsing (drop-in)
======================================================================= */
function normalizeDate(input: unknown): {
  y: number;
  m: number;
  d: number;
} {
  // A) JS Date object
  if (input instanceof Date) {
    const dt = DateTime.fromJSDate(input);
    if (dt.isValid) return { y: dt.year, m: dt.month, d: dt.day };
  }

  // B) { year, month, day } object
  if (
    input &&
    typeof input === "object" &&
    "year" in (input as any) &&
    "month" in (input as any) &&
    "day" in (input as any)
  ) {
    const { year, month, day } = input as any;
    return { y: Number(year), m: Number(month), d: Number(day) };
  }

  // C) Unix epoch seconds/ms (number or numeric string)
  if (
    typeof input === "number" ||
    (typeof input === "string" && /^\d{10,13}$/.test(input.trim()))
  ) {
    const n = typeof input === "number" ? input : Number(input.trim());
    const ms = n < 1e12 ? n * 1000 : n; // seconds → ms
    const dt = DateTime.fromMillis(ms);
    if (dt.isValid) return { y: dt.year, m: dt.month, d: dt.day };
  }

  // D) String formats
  if (typeof input !== "string" || !input.trim()) {
    throw new Error('Missing or invalid "dobISO" (send a date string).');
  }
  const s = input.trim();

  // Strict known formats
  const formats = [
    "yyyy-MM-dd",
    "dd-MM-yyyy",
    "dd/MM/yyyy",
    "MM-dd-yyyy",
    "MM/dd/yyyy",
    "yyyy/MM/dd",
    // ISO date-times
    "yyyy-MM-dd'T'HH:mm",
    "yyyy-MM-dd'T'HH:mmZ",
    "yyyy-MM-dd'T'HH:mm:ss",
    "yyyy-MM-dd'T'HH:mm:ssZ",
    "yyyy-MM-dd'T'HH:mm:ss.SSS",
    "yyyy-MM-dd'T'HH:mm:ss.SSSZ",
  ];
  for (const fmt of formats) {
    const dt = DateTime.fromFormat(s, fmt);
    if (dt.isValid) return { y: dt.year, m: dt.month, d: dt.day };
  }

  // ISO fallback
  const dtISO = DateTime.fromISO(s);
  if (dtISO.isValid) return { y: dtISO.year, m: dtISO.month, d: dtISO.day };

  // JS Date fallback
  const js = new Date(s);
  if (!Number.isNaN(js.getTime())) {
    const dt = DateTime.fromJSDate(js);
    return { y: dt.year, m: dt.month, d: dt.day };
  }

  throw new Error(`Unrecognized date format for "dobISO": ${s}`);
}

function normalizeTime(input: unknown): { hh: number; mm: number } {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error(
      'Missing or invalid "tob" (expected "HH:mm" like "23:35").'
    );
  }
  const s = input.trim().toUpperCase();

  // HH:mm
  let m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (m) return { hh: +m[1], mm: +m[2] };

  // 4 digits "2335" → 23:35
  m = s.match(/^(\d{2})(\d{2})$/);
  if (m) return { hh: +m[1], mm: +m[2] };

  // "11 PM" / "11:05 PM"
  m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (m) {
    let hh = +m[1] % 12;
    const mm = m[2] ? +m[2] : 0;
    if (m[3] === "PM") hh += 12;
    return { hh, mm };
  }

  throw new Error(`Unrecognized time format for "tob": ${s}`);
}

/* =======================================================================
   Time conversion to Julian Day (UT)
======================================================================= */
async function jdUTFromLocal(dobISO: any, tobHHmm: any, tz: string) {
  const { y, m, d } = normalizeDate(dobISO);
  const { hh, mm } = normalizeTime(tobHHmm);

  const dtLocal = DateTime.fromObject(
    { year: y, month: m, day: d, hour: hh, minute: mm, second: 0, millisecond: 0 },
    { zone: tz || "UTC" }
  );

  if (!dtLocal.isValid) {
    throw new Error(
      `Invalid local date/time (${dobISO} ${tobHHmm}) for zone ${tz}: ${
        dtLocal.invalidReason ?? ""
      }`
    );
  }

   const dtUTC = dtLocal.toUTC();
  const swe = await getSwe();

  const jd = swe.swe_julday(
    dtUTC.year,
    dtUTC.month,
    dtUTC.day,
    dtUTC.hour + dtUTC.minute / 60 + dtUTC.second / 3600,
    swe.SE_GREG_CAL
  );

  if (!Number.isFinite(jd)) {
    throw new Error(
      `Computed invalid Julian Day (NaN) from inputs: ${JSON.stringify({
        y,
        m,
        d,
        hh,
        mm,
        tz,
      })}`
    );
  }

  return { jd, dtUTC };
}

/* =======================================================================
   Astro helpers (using getSwe, sidereal Lahiri)
======================================================================= */

async function siderealMoonLongLahiri(jdUT: number): Promise<number> {
const swe = await getSwe();

  // Set sidereal Lahiri mode defensively
  try {
    if (typeof swe.swe_set_sid_mode === "function") {
      swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
    }
  } catch {
    // ignore; engine may already be Lahiri from startup
  }

  const flags =
    (swe.SEFLG_SWIEPH ?? 2) |
    (swe.SEFLG_SIDEREAL ?? 64) |
    (swe.SEFLG_SPEED ?? 256);

  const r = swe.swe_calc_ut(jdUT, swe.SE_MOON, flags);

  let lon: number | undefined;

  if (r && typeof r.longitude === "number") {
    lon = r.longitude;
  } else if (r && Array.isArray((r as any).x) && typeof (r as any).x[0] === "number") {
    lon = (r as any).x[0];
  }

  if (lon == null || !Number.isFinite(lon)) {
    throw new Error(
      `Invalid result from swe_calc_ut for Moon at jdUT=${jdUT}`
    );
  }

  return wrap360(lon);
}

function buildMDChain(
  startUTC: any, // 👈 changed from DateTime to any to avoid TS namespace type error
  startLord: (typeof LORDS)[number],
  startBalanceYears: number
) {
  const chain: DashaSpan[] = [];
  const seq = sequenceFrom(startLord);

  let cursor = startUTC;
  let mdSeq = seq;
  let first = true;

  // generate multiple cycles to cover any horizon
  for (let loop = 0; loop < 12; loop++) {
    for (const lord of mdSeq) {
      const years = first ? startBalanceYears : YEARS[lord];
      first = false;
      const end = cursor.plus({ years });
      const startISO = cursor.toUTC().toISO();
      const endISO = end.toUTC().toISO();
      if (!startISO || !endISO) {
        throw new Error(
          `Could not produce ISO for MD span: ${lord} ${cursor.toISO()} → ${end.toISO()}`
        );
      }
      chain.push({
        lord,
        start: startISO,
        end: endISO,
        level: "MD",
      });
      cursor = end;
    }
    mdSeq = LORDS as unknown as (typeof LORDS)[number][];
  }
  return chain;
}

function mdToADs(md: DashaSpan) {
  const seq = sequenceFrom(md.lord as any); // assume valid planet name
  const mdStart = DateTime.fromISO(md.start, { zone: "utc" });
  const mdEnd = DateTime.fromISO(md.end, { zone: "utc" });
  const spanMs = mdEnd.toMillis() - mdStart.toMillis(); // raw duration in ms

  const cumFrac = (idx: number) =>
    seq.slice(0, idx).reduce((a, l) => a + YEARS[l] / 120, 0);

  return seq.map((lord, idx) => {
    const startFrac = cumFrac(idx);
    const endFrac = startFrac + YEARS[lord] / 120;

    const adStart = mdStart.plus({
      milliseconds: spanMs * startFrac,
    });
    const adEnd = mdStart.plus({
      milliseconds: spanMs * endFrac,
    });

    const startISO = adStart.toUTC().toISO();
    const endISO = adEnd.toUTC().toISO();
    if (!startISO || !endISO) {
      throw new Error(
        `Could not produce ISO for AD span: ${lord} ${adStart.toISO()} → ${adEnd.toISO()}`
      );
    }

    return {
      lord,
      start: startISO,
      end: endISO,
      level: "AD",
    } as DashaSpan;
  });
}

/* =======================================================================
   Public API
======================================================================= */
/** Canonical function (now async) */
export async function computeVimshottari(
  dobISO:
    | string
    | Date
    | { year: number; month: number; day: number }
    | number,
  tobHHmm: string,
  place: Place = { tz: "UTC" },
  opts?: { includeAD?: boolean; horizonYears?: number }
) {
  const tz = place?.tz ?? "UTC";
  const horizonYears = opts?.horizonYears ?? 60;

  // 1) Local → JD(UT) and birth UTC DateTime
  const { jd: jdUT, dtUTC: birth } = await jdUTFromLocal(
    dobISO,
    tobHHmm,
    tz
  );

  // 2) Sidereal Moon @ birth (defensive)
  const lon = await siderealMoonLongLahiri(jdUT);

  // 3) Birth nakshatra & starting lord
  const nakIndex = Math.floor(wrap360(lon) / NAK_SIZE_DEG); // 0..26
  const startLord = NAK_LORD[nakIndex];

  // 4) Balance in first MD
  const startDeg = nakIndex * NAK_SIZE_DEG;
  const traversed = wrap360(lon - startDeg); // 0..13.3333
  const fracTraversed = traversed / NAK_SIZE_DEG; // 0..1
  const mdTotalYears = YEARS[startLord];
  const startBalanceYears = (1 - fracTraversed) * mdTotalYears;

  // 5) Build full MD chain
  const birthDT = DateTime.fromISO(
    typeof (birth as any).toISO === "function" ? (birth as any).toISO() : String(birth),
    { zone: "utc" }
  );
  const mdChain = buildMDChain(
    birthDT,
    startLord,
    startBalanceYears
  );

  // 6) Clip to horizon (birth → birth + N years)
  const endHorizon = birthDT.plus({ years: horizonYears });

  const MD = mdChain.filter(
    (md) => DateTime.fromISO(md.start) < endHorizon
  );

  if (!opts?.includeAD) return { MD };

  const AD = MD.flatMap((md) => mdToADs(md)).filter(
    (ad) => DateTime.fromISO(ad.start) < endHorizon
  );

  // Convenience: what’s active *now*
  const now = DateTime.utc();
  const currentMD = MD.find(
    (md) =>
      DateTime.fromISO(md.start) <= now &&
      now < DateTime.fromISO(md.end)
  );
  const currentAD = currentMD
    ? mdToADs(currentMD).find(
        (ad) =>
          DateTime.fromISO(ad.start) <= now &&
          now < DateTime.fromISO(ad.end)
      )
    : undefined;

  return {
    MD,
    AD,
    current:
      currentMD && currentAD
        ? {
            mahadasha: currentMD.lord,
            antardasha: currentAD.lord,
            mdStart: currentMD.start,
            mdEnd: currentMD.end,
            adStart: currentAD.start,
            adEnd: currentAD.end,
          }
        : undefined,
  };
}

/** Friendly alias to keep older call sites working */
export const vimsottari = computeVimshottari;

/** Default export so `import x from ...` also works */
export default computeVimshottari;

/* =======================================================================
   Payload adapter (accepts many field names/shapes)
======================================================================= */
function pickDOB(body: any) {
  return (
    body?.dobISO ??
    body?.dob ??
    body?.date ??
    body?.birthDate ??
    body?.birth?.date ??
    body?.form?.dob ??
    null
  );
}

function pickTOB(body: any) {
  return (
    body?.tob ??
    body?.time ??
    body?.birthTime ??
    body?.birth?.time ??
    body?.form?.tob ??
    null
  );
}

function pickPlace(body: any) {
  return (
    body?.place ??
    body?.birth?.place ??
    body?.location ??
    body?.form?.place ??
    null
  );
}

/**
 * Drop-in adapter: pass your raw request JSON here.
 * It will map common aliases and call the canonical function.
 */
export async function computeVimshottariFromPayload(
  payload: any,
  opts?: { includeAD?: boolean; horizonYears?: number }
) {
  const dobAny = pickDOB(payload);
  const tobAny = pickTOB(payload);
  const placeAny = pickPlace(payload) ?? { tz: "UTC" };

  if (!dobAny || !tobAny) {
    throw new Error(
      `Required fields missing. Provide a date + time using any of these keys: ` +
        `{"dobISO"/"dob"/"date"/"birthDate" or birth.date} + {"tob"/"time"/"birthTime" or birth.time"}. ` +
        `Got dob=${JSON.stringify(dobAny)} tob=${JSON.stringify(tobAny)}`
    );
  }

  return computeVimshottari(
    dobAny, // string | Date | {year,month,day} | number
    String(tobAny), // normalize time to string
    placeAny as Place, // only tz is used for time conversion
    { includeAD: true, horizonYears: 60, ...opts }
  );
}
