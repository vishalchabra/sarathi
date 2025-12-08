import "server-only";
import { DateTime } from "luxon";

/* ------------------ Types ------------------ */
type BirthInput = {
  dateISO: string;
  time: string;
  tz: string;
  lat: number;
  lon: number;
};
type BuildInput = { name?: string; birth: BirthInput };
type RawPlacement = any;

type Placement = {
  planet: string;
  sign?: string | null;
  house?: number | null;
  degree?: number | null; // 0..30 within sign
  nakshatra?: string | null;
  lon?: number | null;    // absolute sidereal longitude 0..360
};

type Report = {
  placements: Placement[];           // array (widgets)
  planets: Placement[];              // array alias
  planetsList?: Placement[];         // alias (compat)
  planetsByName: Record<string, Partial<Placement>>; // map for lookups

  houses: { asc?: { sign?: string } };
  housesList?: Array<{ house: number; sign?: string; occupants: string[] }>;
  summary: { sunSign?: string; moonSign?: string; ascSign?: string; text?: string };

  // ✨ Panchang at top-level (many UIs read this)
  panchang: {
    weekday?: string | "—";
    tithi?: string | "—";
    yoga?: string | "—";
    moonNakshatra?: string | "—";
  };

  ascendant: {
    label: string;
    ascSign: string | "—";
    moonSign: string | "—";
    ascNakshatraName: string | "—";
    moonNakshatraName: string | "—";
    panchang: {
      weekday?: string | "—";
      tithi?: string | "—";
      yoga?: string | "—";
      moonNakshatra?: string | "—";
    };
  };

  aspects?: Record<string, Array<{ onto: string; type: string; orb?: number }>>;
  aspectsMap?: Record<string, Array<{ onto: string; type: string; orb?: number }>>;
  // Tabs often look for these:
  timeline: Array<{ label: string; start: string; end?: string; score?: number }>;
  money: {
    score: number;
    drivers: Array<{ label: string; note?: string }>;
    gainWindows: Array<{ start: string; end: string; reason?: string }>;
    riskWindows: Array<{ start: string; end: string; reason?: string }>;
    levers: {
      income: Array<{ label: string }>;
      savings: Array<{ label: string }>;
      investing: Array<{ label: string }>;
    };
  };
  foodRemedies: {
    do: string[];
    avoid: string[];
    notes?: string[];
  };
  predictions: Array<{ area: string; text: string; confidence?: number }>;

  personalSummary: string;
  activePeriods: Record<string, unknown>;
  transitWindows: any[];
  lifeMilestones: any[];
  planetInsights: Record<string, unknown>;
  lifeThemes: Record<string, unknown>;
};

/* ------------------ Helpers ------------------ */
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;
const NAKS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati",
] as const;
const NAK_SPAN = 360 / 27;
const nowIso = () => new Date().toISOString();

function norm360(x: number) { let v = x % 360; return v < 0 ? v + 360 : v; }
function signFromDeg(longitude?: number | null) {
  if (longitude == null || isNaN(longitude)) return "—";
  const lon = norm360(longitude);
  return SIGNS[Math.floor(lon / 30)] ?? "—";
}
function signIndex(name?: string | null) {
  if (!name) return null;
  const i = SIGNS.findIndex(s => s.toLowerCase() === String(name).toLowerCase());
  return i >= 0 ? i : null;
}
function nakFromLon(lon?: number | null) {
  if (lon == null || isNaN(lon)) return "—";
  const idx = Math.floor(norm360(lon) / NAK_SPAN);
  return NAKS[idx] ?? "—";
}
function degFromRaw(p: RawPlacement): number | null {
  const cand = [
    p?.deg, p?.degree, p?.lon, p?.longitude, p?.eclipticLon, p?.lambda,
    Array.isArray(p?.x) && typeof p.x[0] === "number" ? p.x[0] : undefined,
  ].find((v) => typeof v === "number");
  return typeof cand === "number" ? cand : null;
}
function signFromRaw(p: RawPlacement): string | null {
  const s =
    p?.sign ?? p?.rasi ?? p?.rashi ?? p?.signName ??
    (typeof p?.signIndex === "number" ? SIGNS[p.signIndex] : undefined);
  if (typeof s === "string" && s.length) return s;
  const deg = degFromRaw(p);
  return signFromDeg(deg);
}
function houseFromRaw(p: RawPlacement): number | null {
  const h = p?.house ?? p?.bhava ?? p?.houseNo ?? p?.houseIndex;
  return typeof h === "number" ? h : null;
}
function nakFromRaw(p: RawPlacement): string | null {
  return p?.nakshatra ?? p?.nak ?? p?.nakName ?? null;
}

function normalizePlacements(raw: RawPlacement[] | undefined | null): Placement[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => {
    const planet = p?.planet ?? p?.name ?? (typeof p?.id === "string" ? p.id : "Unknown");

    const lonAbs = (() => {
      const d = degFromRaw(p);
      if (typeof d === "number") {
        if (typeof p?.signIndex === "number") return p.signIndex * 30 + (d % 30);
        const idx = signIndex(p?.sign ?? p?.rasi ?? p?.rashi ?? p?.signName);
        if (idx != null) return idx * 30 + (d % 30);
        return d; // assume absolute
      }
      return null;
    })();

    const sign = signFromRaw(p) ?? (lonAbs != null ? signFromDeg(lonAbs) : "—");
    const house = houseFromRaw(p);
    const degree = lonAbs != null ? (lonAbs % 30) : (typeof p?.degree === "number" ? p.degree : null);
    const nak = nakFromRaw(p) ?? (lonAbs != null ? nakFromLon(lonAbs) : null);

    return { planet, sign: sign ?? "—", house: house ?? null, degree, nakshatra: nak ?? "—", lon: lonAbs };
  });
}

function toPlanetMap(arr: Placement[]): Record<string, Partial<Placement>> {
  const out: Record<string, Partial<Placement>> = {};
  for (const p of arr) out[p.planet] = { sign: p.sign, house: p.house, degree: p.degree, lon: p.lon, nakshatra: p.nakshatra };
  return out;
}

/* ---- Panchang derivation from placements if provider missing ---- */
function buildPanchangLike(birth: BirthInput, planetsByName: Record<string, Partial<Placement>>) {
  const local = DateTime.fromISO(`${birth.dateISO}T${birth.time}`, { zone: birth.tz });
  const weekday = local.weekdayLong; // Monday..Sunday

  const sunLon = planetsByName["Sun"]?.lon as number | undefined;
  const moonLon = planetsByName["Moon"]?.lon as number | undefined;

  let tithi = "—", yoga = "—", moonNakshatra = "—";
  if (typeof sunLon === "number" && typeof moonLon === "number") {
    const diff = norm360(moonLon - sunLon);      // 0..360
    const tithiIdx = Math.floor(diff / 12);      // 0..29
    const TITHIS = [
      "Pratipada","Dvitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami",
      "Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima/Amavasya",
      "Pratipada","Dvitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami",
      "Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima/Amavasya",
    ];
    tithi = TITHIS[tithiIdx] ?? "—";

    const sum = norm360(moonLon + sunLon);
    const yogaIdx = Math.floor(sum / (360 / 27));
    yoga = NAKS[yogaIdx] ?? "—";

    moonNakshatra = nakFromLon(moonLon);
  }

  return { weekday, tithi, yoga, moonNakshatra };
}

/* ---- Simple graha dṛṣṭi ---- */
function computeAspects(placements: Placement[]) {
  const special: Record<string, number[]> = {
    Mars: [4, 7, 8],
    Jupiter: [5, 7, 9],
    Saturn: [3, 7, 10],
    Rahu: [5, 7, 9],
    Ketu: [5, 7, 9],
  };
  const list = placements.filter(p => typeof p.house === "number") as Array<Required<Pick<Placement,"planet"|"house">> & Placement>;
  const out: Report["aspects"] = {};
  for (const src of list) {
    const rays = special[src.planet] ?? [7];
    const hits: Array<{ onto: string; type: string; orb?: number }> = [];
    for (const dst of list) {
      if (dst.planet === src.planet) continue;
      const gap = ((dst.house! - src.house! + 12) % 12) || 12; // 1..12
      if (rays.includes(gap)) hits.push({ onto: dst.planet, type: gap === 7 ? "Opposition (7th)" : `${gap}th aspect` });
    }
    out[src.planet] = hits;
  }
  return out;
}
/* ---- Aspect types & helpers ---- */
type AspectItem = { p1: string; p2: string; type: string; orbDeg?: number; applying?: boolean };

function normalizeAspectName(s: string) {
  const t = String(s).toLowerCase();
  if (t.includes("opposition") || t.includes("7th")) return "opposition";
  if (t.includes("conj")) return "conjunction";
  if (t.includes("trine") || t.includes("120")) return "trine";
  if (t.includes("square") || t.includes("90")) return "square";
  if (t.includes("sextile") || t.includes("60")) return "sextile";
  return s;
}

function flattenAspects(map: Report["aspectsMap"]): AspectItem[] {
  const out: AspectItem[] = [];
  if (!map) return out;
  for (const [p1, arr] of Object.entries(map)) {
    for (const a of arr || []) {
      const p2 = a.onto;
      // prevent duplicates (A→B and B→A)
      const exists = out.some(
        x => (x.p1 === p1 && x.p2 === p2 && x.type === normalizeAspectName(a.type)) ||
             (x.p1 === p2 && x.p2 === p1 && x.type === normalizeAspectName(a.type))
      );
      if (exists) continue;
      out.push({ p1, p2, type: normalizeAspectName(a.type), orbDeg: a.orb });
    }
  }
  return out;
}

/* ------------------ Main builder ------------------ */
export async function buildLifeReport(input: BuildInput): Promise<{ report: Report }> {
  const { birth } = input;

  const [{ getPanchang }, ascMod, placementsMod] = await Promise.all([
    import("@/server/astro/panchang").catch(() => ({} as any)),
    import("@/server/astro/asc").catch(() => ({} as any)),
    import("@/server/astro/placements").catch(() => ({} as any)),
  ]);

  // Placements
  let placements: Placement[] = [];
  try {
    if (typeof placementsMod.computePlacements === "function") {
      const raw = await placementsMod.computePlacements(birth);
      placements = normalizePlacements(raw);
    }
  } catch {}

  // Asc (sidereal)
  let ascSign = "—";
  let ascLon: number | null = null;
  try {
    if (typeof (ascMod as any).getAscendant === "function") {
      const asc = await (ascMod as any).getAscendant(birth);
      ascSign = asc?.sign ?? "—";
      ascLon = typeof asc?.lon === "number" ? asc.lon : null;
    } else if (typeof (ascMod as any).getAscendantSign === "function") {
      ascSign = (await (ascMod as any).getAscendantSign(birth)) ?? "—";
    }
  } catch {}

  // Per-planet nakshatra via lon if missing
  placements = placements.map(p => ({ ...p, nakshatra: p.nakshatra ?? nakFromLon(p.lon ?? null) }));

  const planetsByName = toPlanetMap(placements);
  const sunSign = (planetsByName["Sun"]?.sign as string) ?? "—";
  const moonSign = (planetsByName["Moon"]?.sign as string) ?? "—";

  // Panchang (top-level & snapshot)
  let weekday = "—", tithi = "—", yoga = "—", moonNakshatra = "—";
  try {
    if (typeof getPanchang === "function") {
      const p = await getPanchang(birth);
      weekday = p?.weekday ?? "—";
      tithi = p?.tithi ?? "—";
      yoga = p?.yoga ?? "—";
      moonNakshatra = p?.moonNakshatra ?? "—";
    } else {
      const p2 = buildPanchangLike(birth, planetsByName);
      weekday = p2.weekday; tithi = p2.tithi; yoga = p2.yoga; moonNakshatra = p2.moonNakshatra;
    }
  } catch {
    const p2 = buildPanchangLike(birth, planetsByName);
    weekday = p2.weekday; tithi = p2.tithi; yoga = p2.yoga; moonNakshatra = p2.moonNakshatra;
  }

  const ascNakshatra = ascLon != null ? nakFromLon(ascLon) : "—";
  const aspects = computeAspects(placements);

  // Houses list (very light: sign via whole-sign rotation from asc; occupants from placements)
  const ascIdx = signIndex(ascSign);
  const housesList =
    ascIdx == null
      ? Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: "—", occupants: [] as string[] }))
      : Array.from({ length: 12 }, (_, i) => {
          const sign = SIGNS[(ascIdx + i) % 12];
          const occupants = placements.filter(p => p.house === i + 1).map(p => p.planet);
          return { house: i + 1, sign, occupants };
        });

  // Default content to keep Summary / Money / Food / Timeline tabs alive
  const today = DateTime.now().toISODate();
  const in30 = DateTime.now().plus({ days: 30 }).toISODate();

  const report: Report = {
    placements,
    planets: placements,
    planetsList: placements,
    planetsByName,
    houses: { asc: { sign: ascSign } },
    housesList,
    summary: {
      sunSign, moonSign, ascSign,
      text: `Asc in ${ascSign}. Sun in ${sunSign}. Moon in ${moonSign}.`,
    },
    panchang: { weekday, tithi, yoga, moonNakshatra },
    ascendant: {
      label: "Ascendant",
      ascSign,
      moonSign,
      ascNakshatraName: ascNakshatra,
      moonNakshatraName: moonNakshatra,
      panchang: { weekday, tithi, yoga, moonNakshatra },
    },
    aspects,
    aspectsMap: aspects,
    // --- Tabs: minimally non-empty structures ---
    timeline: [
      { label: "Next 30 days window", start: today, end: in30, score: 0.5 },
    ],
    money: {
      score: 0.5,
      drivers: [{ label: "Planetary baseline (demo)" }],
      gainWindows: [{ start: today, end: in30, reason: "Baseline example" }],
      riskWindows: [],
      levers: {
        income: [{ label: "Upskill or pitch high-value task" }],
        savings: [{ label: "Automate 10% pay-yourself-first" }],
        investing: [{ label: "Stick to SIP; avoid FOMO buys" }],
      },
    },
    foodRemedies: {
      do: ["Warm, sattvic foods mid-day", "Hydration + herbal tea"],
      avoid: ["Heavy late-night meals", "Over-caffeination"],
      notes: ["Customize later per chart module"],
    },
    predictions: [
      { area: "Career", text: "Steady progress; avoid over-commitment.", confidence: 0.6 },
      { area: "Well-being", text: "Prioritize sleep consistency.", confidence: 0.7 },
    ],

    personalSummary: "",
    activePeriods: {},
    transitWindows: [],
    lifeMilestones: [],
    planetInsights: {},
    lifeThemes: {},
  };

  return { report };
}

export default buildLifeReport;
