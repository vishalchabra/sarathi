"use client";

import { useMemo, useState } from "react";

type ForecastFocus =
  | "all"
  | "career"
  | "relationships"
  | "money"
  | "health"
  | "spiritual";

type ForecastRow = {
  id?: string;
  startISO?: string;
  endISO?: string;
  dateISO?: string;
  date?: string;
  planet?: string;
  name?: string;
  target?: string;
  eventType?: string;
  type?: string;
  category?: string;
  strength?: number;
  score?: number;
  title?: string;
  description?: string;
  transitSign?: string;
  sign?: string;
  toSign?: string;
  newSign?: string;
  rashi?: string;
  nakshatra?: string | null;
  toNakshatra?: string | null;
  newNakshatra?: string | null;
  moonNakshatra?: string | null;
  pada?: number | null;
  transitHouse?: number;
  house?: number;
  natalHouse?: number;
  [key: string]: any;
};

type UpcomingTransitBuckets = {
  moonTransits?: ForecastRow[];
  planetaryTransits?: ForecastRow[];
  allEvents?: ForecastRow[];
};

type Props = {
  transitWindows?: ForecastRow[];
  transitNow?: ForecastRow[] | any;
  upcomingTransits?: UpcomingTransitBuckets | null;
  currentDasha?: any;
  dashaTimelines?: any;
  houseJudgement?: any[];
  natalPlanets?: any[];
  houses?: any[];
  roles?: any;
  currentDashaLabel?: string;
  ascSign?: string | null;
};

type NormalizedRow = {
  id: string;
  startISO: string;
  endISO: string;
  planet: string;
  eventLabel: string;
  focus: ForecastFocus;
  sign: string | null;
  nakshatra: string | null;
  pada: number | null;
  house: number | null;
  natalHouse: number | null;
  strength: number;
  sourceType: "window" | "upcoming" | "current";
  raw: ForecastRow;
};

const FOCUS_OPTIONS: Array<{ value: ForecastFocus; label: string }> = [
  { value: "all", label: "All areas" },
  { value: "career", label: "Career" },
  { value: "relationships", label: "Relationships" },
  { value: "money", label: "Money" },
  { value: "health", label: "Health" },
  { value: "spiritual", label: "Spiritual / Inner" },
];

const MONTH_OPTIONS = [
  { value: 3, label: "Next 3 months" },
  { value: 6, label: "Next 6 months" },
  { value: 12, label: "Next 12 months" },
  { value: 24, label: "Next 24 months" },
];

const SIGNS_12 = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const NAKSHATRA_TO_SIGN: Record<string, string[]> = {
  Ashwini: ["Aries"],
  Bharani: ["Aries"],
  Krittika: ["Aries", "Taurus"],
  Rohini: ["Taurus"],
  Mrigashira: ["Taurus", "Gemini"],
  Ardra: ["Gemini"],
  Punarvasu: ["Gemini", "Cancer"],
  Pushya: ["Cancer"],
  Ashlesha: ["Cancer"],
  Magha: ["Leo"],
  "Purva Phalguni": ["Leo"],
  "Uttara Phalguni": ["Leo", "Virgo"],
  Hasta: ["Virgo"],
  Chitra: ["Virgo", "Libra"],
  Swati: ["Libra"],
  Vishakha: ["Libra", "Scorpio"],
  Anuradha: ["Scorpio"],
  Jyeshtha: ["Scorpio"],
  Mula: ["Sagittarius"],
  "Purva Ashadha": ["Sagittarius"],
  "Uttara Ashadha": ["Sagittarius", "Capricorn"],
  Shravana: ["Capricorn"],
  Dhanishta: ["Capricorn", "Aquarius"],
  Shatabhisha: ["Aquarius"],
  "Purva Bhadrapada": ["Aquarius", "Pisces"],
  "Uttara Bhadrapada": ["Pisces"],
  Revati: ["Pisces"],
};

const HOUSE_NAMES: Record<number, string> = {
  1: "Self",
  2: "Money",
  3: "Effort",
  4: "Home",
  5: "Creativity",
  6: "Work",
  7: "Partners",
  8: "Change",
  9: "Dharma",
  10: "Career",
  11: "Gains",
  12: "Foreign",
};

const FOCUS_HOUSES: Record<ForecastFocus, number[]> = {
  all: [],
  career: [1, 6, 10, 11],
  relationships: [5, 7, 8],
  money: [2, 5, 8, 11],
  health: [1, 6, 8, 12],
  spiritual: [4, 8, 9, 12],
};

function cleanText(value: any) {
  if (value === null || value === undefined || value === "") return "";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function cleanEventLabel(value: any) {
  const raw = String(value ?? "").trim();
  const key = raw.toLowerCase().replace(/\s+/g, "_");

  const labels: Record<string, string> = {
    nakshatra_ingress: "Nakshatra change",
    sign_ingress: "Rashi change",
    rashi_ingress: "Rashi change",
    retrograde_start: "Retrograde starts",
    retrograde_end: "Retrograde ends",
    direct_station: "Direct motion starts",
    retrograde_station: "Retrograde motion starts",
    aspect_exact: "Aspect peak",
    conjunction: "Conjunction",
    opposition: "Opposition",
    trine: "Trine",
    square: "Square",
    sextile: "Sextile",
  };

  return labels[key] ?? cleanText(raw || "Transit");
}

function normalizePlanet(value: any) {
  const text = String(value ?? "").trim();
  const aliases: Record<string, string> = {
    Su: "Sun",
    Mo: "Moon",
    Ma: "Mars",
    Me: "Mercury",
    Ju: "Jupiter",
    Ve: "Venus",
    Sa: "Saturn",
    Ra: "Rahu",
    Ke: "Ketu",
  };

  return aliases[text] ?? text;
}

function parseISODate(value?: string | null) {
  if (!value) return null;
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(dateISO: string, days: number) {
  const d = parseISODate(dateISO) ?? new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(value?: string | null) {
  const d = parseISODate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(value?: string | null) {
  const d = parseISODate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function inferSignFromNakshatra(nakshatra?: string | null) {
  if (!nakshatra) return null;
  return NAKSHATRA_TO_SIGN[String(nakshatra).trim()]?.[0] ?? null;
}

function houseFromAscSign(sign?: string | null, ascSign?: string | null) {
  if (!sign || !ascSign) return null;

  const s = SIGNS_12.findIndex((x) => x.toLowerCase() === String(sign).toLowerCase());
  const a = SIGNS_12.findIndex((x) => x.toLowerCase() === String(ascSign).toLowerCase());

  if (s < 0 || a < 0) return null;

  return ((s - a + 12) % 12) + 1;
}

function readHouseNumber(value: any) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 12 ? n : null;
}

function getNakshatra(row: ForecastRow) {
  return (
    row?.nakshatra ??
    row?.toNakshatra ??
    row?.newNakshatra ??
    row?.moonNakshatra ??
    null
  );
}

function getSign(row: ForecastRow) {
  return (
    row?.transitSign ??
    row?.sign ??
    row?.toSign ??
    row?.newSign ??
    row?.rashi ??
    inferSignFromNakshatra(getNakshatra(row)) ??
    null
  );
}

function getDashaPlanet(node: any) {
  if (!node) return null;
  if (typeof node === "string") return node;
  return node?.planet ?? node?.lord ?? node?.name ?? node?.dashaLord ?? null;
}

function getDashaPlanets(currentDasha: any) {
  const md =
    getDashaPlanet(currentDasha?.md) ??
    getDashaPlanet(currentDasha?.mahadasha) ??
    (typeof currentDasha?.md === "string" ? currentDasha.md : null);

  const ad =
    getDashaPlanet(currentDasha?.ad) ??
    getDashaPlanet(currentDasha?.antardasha) ??
    (typeof currentDasha?.ad === "string" ? currentDasha.ad : null);

  const pd =
    getDashaPlanet(currentDasha?.pd) ??
    getDashaPlanet(currentDasha?.pratyantardasha) ??
    (typeof currentDasha?.pd === "string" ? currentDasha.pd : null);

  return [
    { level: "MD", planet: md },
    { level: "AD", planet: ad },
    { level: "PD", planet: pd },
  ].filter((x) => x.planet);
}

function getDashaLabel(currentDasha: any, fallback?: string) {
  const parts = getDashaPlanets(currentDasha).map(
    (row) => `${row.level} ${normalizePlanet(row.planet)}`
  );

  if (parts.length) return parts.join(" / ");
  return fallback || "—";
}

function rowPlanetName(row: any) {
  return normalizePlanet(row?.planet ?? row?.name ?? row?.graha ?? row?.lord ?? row?.body);
}

function getPlanetHouse(planet: string, natalPlanets: any[]) {
  const p = normalizePlanet(planet);
  const row = (Array.isArray(natalPlanets) ? natalPlanets : []).find((item) =>
    [item?.planet, item?.name, item?.graha, item?.body, item?.code, item?.label]
      .map(normalizePlanet)
      .filter(Boolean)
      .some((name) => name.toLowerCase() === p.toLowerCase())
  );

  if (!row) return null;

  const candidates = [
    row?.house,
    row?.houseNumber,
    row?.bhava,
    row?.wholeSignHouse,
    row?.signHouse,
    row?.rashiHouse,
    row?.placementHouse,
    row?.houseFromAsc,
    row?.lagnaHouse,
    row?.chartHouse,
    row?.d1House,
    row?.position?.house,
    row?.position?.houseNumber,
    row?.d1?.house,
    row?.d1?.houseNumber,
  ];

  for (const c of candidates) {
    const h = readHouseNumber(c);
    if (h) return h;
  }

  return null;
}

function getHouseNumber(row: any) {
  const candidates = [
    row?.house,
    row?.houseNumber,
    row?.number,
    row?.bhava,
    row?.id,
    row?.index,
    row?.slot,
    row?.houseNo,
    row?.houseIndex,
    row?.position?.house,
    row?.cusp?.house,
  ];

  for (const c of candidates) {
    const h = readHouseNumber(c);
    if (h) return h;
  }

  return null;
}

function getHouseLord(row: any) {
  return normalizePlanet(
    row?.lord ??
      row?.houseLord ??
      row?.signLord ??
      row?.owner ??
      row?.ruler ??
      row?.lordPlanet ??
      row?.lordName ??
      row?.rashiLord ??
      row?.sign?.lord ??
      row?.cusp?.lord ??
      row?.cusp?.signLord
  );
}

function getOwnedHouses(planet: string, houses: any[], roles: any) {
  const p = normalizePlanet(planet);
  const owned = new Set<number>();

  for (const row of Array.isArray(houses) ? houses : []) {
    const lord = getHouseLord(row);
    const house = getHouseNumber(row);

    if (house && lord && lord.toLowerCase() === p.toLowerCase()) {
      owned.add(house);
    }
  }

  const scan = (value: any) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach(scan);
      return;
    }

    if (typeof value !== "object") return;

    const possiblePlanet = rowPlanetName(value);
    const possibleHouses = [
      value?.ownedHouses,
      value?.housesOwned,
      value?.ownership,
      value?.owns,
      value?.lordOf,
      value?.lordship,
      value?.houses,
      value?.house,
      value?.houseNumber,
    ];

    if (possiblePlanet && possiblePlanet.toLowerCase() === p.toLowerCase()) {
      for (const possible of possibleHouses) {
        const list = Array.isArray(possible) ? possible : [possible];

        for (const item of list) {
          const house = readHouseNumber(
            typeof item === "object"
              ? item?.house ?? item?.houseNumber ?? item?.number ?? item?.id
              : item
          );

          if (house) owned.add(house);
        }
      }
    }

    Object.values(value).forEach((nested) => {
      if (nested && typeof nested === "object") scan(nested);
    });
  };

  scan(roles);

  return Array.from(owned);
}

function buildDashaActivatedHouses(params: {
  currentDasha: any;
  natalPlanets: any[];
  houses: any[];
  roles: any;
}) {
  const dashaPlanets = getDashaPlanets(params.currentDasha);
  const houseMap = new Map<number, { house: number; sources: string[]; weight: number }>();

  const addHouse = (house: number | null, source: string, weight: number) => {
    if (!house) return;

    const existing =
      houseMap.get(house) ?? {
        house,
        sources: [],
        weight: 0,
      };

    existing.sources.push(source);
    existing.weight += weight;
    houseMap.set(house, existing);
  };

  for (const item of dashaPlanets) {
    const planet = normalizePlanet(item.planet);
    const level = item.level;

    addHouse(
      getPlanetHouse(planet, params.natalPlanets),
      `${level} ${planet} placement`,
      level === "MD" ? 4 : level === "AD" ? 3 : 2
    );

    for (const house of getOwnedHouses(planet, params.houses, params.roles)) {
      addHouse(
        house,
        `${level} ${planet} ownership`,
        level === "MD" ? 3 : level === "AD" ? 2 : 1
      );
    }
  }

  return {
    rows: Array.from(houseMap.values())
      .sort((a, b) => b.weight - a.weight || a.house - b.house)
      .slice(0, 5),
    dashaPlanets,
  };
}

function scoreFocus(row: NormalizedRow, focus: ForecastFocus) {
  if (focus === "all") return 1;

  let score = 0;
  const text = [row.eventLabel, row.planet, row.sign, row.nakshatra]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (row.house && FOCUS_HOUSES[focus].includes(row.house)) score += 4;
  if (row.natalHouse && FOCUS_HOUSES[focus].includes(row.natalHouse)) score += 2;

  if (focus === "career" && /career|work|profession|status|reputation/.test(text)) score += 3;
  if (focus === "relationships" && /relationship|partner|marriage|venus/.test(text)) score += 3;
  if (focus === "money" && /money|income|wealth|gains|resources/.test(text)) score += 3;
  if (focus === "health" && /health|routine|stress|saturn|mars/.test(text)) score += 3;
  if (focus === "spiritual" && /spiritual|inner|dharma|ketu|jupiter/.test(text)) score += 3;

  return score;
}

function inferFocus(row: NormalizedRow): ForecastFocus {
  const candidates: ForecastFocus[] = [
    "career",
    "relationships",
    "money",
    "health",
    "spiritual",
  ];

  const scored = candidates
    .map((focus) => ({ focus, score: scoreFocus(row, focus) }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].focus : "all";
}

function focusLabel(value: ForecastFocus) {
  return FOCUS_OPTIONS.find((x) => x.value === value)?.label ?? "All areas";
}

function normalizeWindow(row: ForecastRow, idx: number, sourceType: NormalizedRow["sourceType"], ascSign?: string | null): NormalizedRow | null {
  if (!row || typeof row !== "object") return null;

  const startISO =
    row?.startISO ??
    row?.dateISO ??
    row?.date ??
    row?.from ??
    row?.fromDateISO ??
    row?.startDate ??
    null;

  if (!startISO) return null;

  const planet = normalizePlanet(row?.planet ?? row?.name ?? row?.body ?? row?.transitPlanet) || "Planet";
  const sign = getSign(row);
  const nakshatra = getNakshatra(row);
  const explicitHouse = readHouseNumber(row?.transitHouse ?? row?.house);
  const inferredHouse = explicitHouse ?? houseFromAscSign(sign, ascSign);
  const eventLabel = cleanEventLabel(row?.target ?? row?.eventType ?? row?.type ?? row?.title ?? "Transit");
  const strength = Number(row?.strength ?? row?.score ?? (sourceType === "window" ? 0.6 : 0.45));

  return {
    id: String(row?.id ?? `${sourceType}-${planet}-${startISO}-${eventLabel}-${idx}`),
    startISO,
    endISO: row?.endISO ?? row?.to ?? row?.toDateISO ?? startISO,
    planet,
    eventLabel,
    focus: "all",
    sign,
    nakshatra,
    pada: row?.pada ?? null,
    house: inferredHouse,
    natalHouse: readHouseNumber(row?.natalHouse),
    strength: Number.isFinite(strength) ? strength : 0.45,
    sourceType,
    raw: row,
  };
}

function normalizeCurrent(row: ForecastRow, idx: number, ascSign?: string | null): NormalizedRow | null {
  if (!row || typeof row !== "object") return null;

  const planet = normalizePlanet(row?.planet ?? row?.name);
  if (!planet) return null;

  const startISO = todayISO();
  const sign = getSign(row);
  const house = readHouseNumber(row?.house ?? row?.transitHouse) ?? houseFromAscSign(sign, ascSign);

  return {
    id: `current-${planet}-${idx}`,
    startISO,
    endISO: addDaysISO(startISO, planet === "Moon" ? 2 : planet === "Sun" ? 30 : 60),
    planet,
    eventLabel: "Current transit",
    focus: "all",
    sign,
    nakshatra: getNakshatra(row),
    pada: row?.pada ?? null,
    house,
    natalHouse: null,
    strength: 0.45,
    sourceType: "current",
    raw: row,
  };
}

function buildRows(params: {
  transitWindows?: ForecastRow[];
  upcomingTransits?: UpcomingTransitBuckets | null;
  transitNow?: ForecastRow[] | any;
  ascSign?: string | null;
}) {
  const rows: NormalizedRow[] = [];

  (Array.isArray(params.transitWindows) ? params.transitWindows : []).forEach((row, idx) => {
    const normalized = normalizeWindow(row, idx, "window", params.ascSign);
    if (normalized) rows.push(normalized);
  });

  [
    ...(Array.isArray(params.upcomingTransits?.planetaryTransits)
      ? params.upcomingTransits!.planetaryTransits!
      : []),
    ...(Array.isArray(params.upcomingTransits?.moonTransits)
      ? params.upcomingTransits!.moonTransits!
      : []),
    ...(Array.isArray(params.upcomingTransits?.allEvents)
      ? params.upcomingTransits!.allEvents!
      : []),
  ].forEach((row, idx) => {
    const normalized = normalizeWindow(row, idx, "upcoming", params.ascSign);
    if (normalized) rows.push(normalized);
  });

  (Array.isArray(params.transitNow) ? params.transitNow : []).forEach((row, idx) => {
    const normalized = normalizeCurrent(row, idx, params.ascSign);
    if (normalized) rows.push(normalized);
  });

  const seen = new Set<string>();

  return rows.filter((row) => {
    const key = [
      row.startISO,
      row.endISO,
      row.planet,
      row.eventLabel,
      row.house ?? "",
      row.sign ?? "",
      row.nakshatra ?? "",
      row.sourceType,
    ].join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function groupByHouse(rows: NormalizedRow[]) {
  const map = new Map<number, NormalizedRow[]>();

  for (const row of rows) {
    if (!row.house) continue;
    if (!map.has(row.house)) map.set(row.house, []);
    map.get(row.house)!.push(row);
  }

  return Array.from(map.entries())
    .map(([house, items]) => ({
      house,
      items: items.slice().sort((a, b) => a.startISO.localeCompare(b.startISO)),
    }))
    .sort((a, b) => a.house - b.house);
}

export default function ForecastTimelineCard({
  transitWindows = [],
  transitNow = [],
  upcomingTransits = null,
  currentDasha,
  dashaTimelines,
  houseJudgement = [],
  natalPlanets = [],
  houses = [],
  roles = null,
  currentDashaLabel,
  ascSign = null,
}: Props) {
  const [months, setMonths] = useState(12);
  const [focus, setFocus] = useState<ForecastFocus>("all");
  const [openHouse, setOpenHouse] = useState<number | null>(null);

  const now = useMemo(() => new Date(), []);
  const horizonEnd = useMemo(() => addMonths(now, months), [now, months]);

  const allRows = useMemo(
    () =>
      buildRows({
        transitWindows,
        upcomingTransits,
        transitNow,
        ascSign,
      }),
    [transitWindows, upcomingTransits, transitNow, ascSign]
  );

  const activatedHouseData = useMemo(
    () =>
      buildDashaActivatedHouses({
        currentDasha,
        natalPlanets,
        houses,
        roles,
      }),
    [currentDasha, natalPlanets, houses, roles]
  );

  const filteredRows = useMemo(() => {
    return allRows
      .filter((row) => {
        const start = parseISODate(row.startISO);
        const end = parseISODate(row.endISO) ?? start;
        if (!start && !end) return false;

        const compareStart = start ?? end!;
        const compareEnd = end ?? start!;
        const overlaps =
          compareEnd.getTime() >= now.getTime() &&
          compareStart.getTime() <= horizonEnd.getTime();

        if (!overlaps) return false;

        if (focus === "all") return true;
        return scoreFocus(row, focus) > 0;
      })
      .map((row) => ({ ...row, focus: inferFocus(row) }))
      .sort((a, b) => a.startISO.localeCompare(b.startISO))
      .slice(0, 80);
  }, [allRows, now, horizonEnd, focus]);

  const grouped = useMemo(() => groupByHouse(filteredRows), [filteredRows]);

  const dashaLabel = getDashaLabel(currentDasha, currentDashaLabel);
  const activatedLabel = activatedHouseData.rows.length
    ? activatedHouseData.rows
        .slice(0, 3)
        .map((row) => `H${row.house} ${HOUSE_NAMES[row.house] ?? ""}`.trim())
        .join(" • ")
    : activatedHouseData.dashaPlanets.length
    ? activatedHouseData.dashaPlanets
        .map((row) => `${row.level} ${normalizePlanet(row.planet)}`)
        .join(" • ")
    : "—";

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Forecast Timeline
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
            Transit timing data grouped by chart house for faster astrologer scanning.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Period
            </label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
            >
              {MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Focus
            </label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value as ForecastFocus)}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
            >
              {FOCUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Active Dasha
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-950">
            {dashaLabel}
          </div>
          <div className="mt-1 text-xs text-slate-500">MD / AD / PD</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Activated Houses
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-950">
            {activatedLabel}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Houses highlighted by dasha lords
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Events Analyzed
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {allRows.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Raw transit events checked</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Shortlisted Rows
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {filteredRows.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Rows matching period and focus</div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {!grouped.length ? (
          <div className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-8 text-center text-sm text-slate-500">
            No grouped timing rows found. Try increasing the period or changing focus to All areas.
          </div>
        ) : null}

        {grouped.map(({ house, items }) => {
          const isOpen = openHouse === house;

          return (
            <div
              key={house}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenHouse(isOpen ? null : house)}
                className="flex w-full items-center justify-between gap-4 bg-slate-50/80 px-4 py-3 text-left transition hover:bg-slate-100"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold text-slate-900">
                      H{house} {HOUSE_NAMES[house] ?? "House"}
                    </span>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      {items.length} timing events
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {items
                      .slice(0, 3)
                      .map((row) => `${formatShortDate(row.startISO)} ${row.planet}`)
                      .join(" • ")}
                    {items.length > 3 ? " • …" : ""}
                  </div>
                </div>

                <span className="text-sm font-medium text-slate-500">
                  {isOpen ? "Hide" : "Show"}
                </span>
              </button>

              {isOpen ? (
                <div className="divide-y divide-slate-100">
                  {items.map((row) => {
                    const details = [
                      row.sign ? `Rashi: ${row.sign}` : null,
                      row.nakshatra ? `Nakshatra: ${row.nakshatra}` : null,
                      row.pada ? `Pada: ${row.pada}` : null,
                      row.natalHouse ? `Natal H${row.natalHouse}` : null,
                    ].filter(Boolean);

                    return (
                      <div
                        key={row.id}
                        className="grid grid-cols-1 gap-3 px-4 py-3 text-sm md:grid-cols-[110px_minmax(0,1fr)_120px]"
                      >
                        <div className="font-medium text-slate-500">
                          {formatShortDate(row.startISO)}
                          {row.endISO !== row.startISO ? (
                            <span className="block text-[11px] font-normal text-slate-400">
                              to {formatShortDate(row.endISO)}
                            </span>
                          ) : null}
                        </div>

                        <div>
                          <div className="font-semibold text-slate-900">
                            {row.planet} • {row.eventLabel}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {details.length ? details.join(" • ") : "Transit update"}
                          </div>
                        </div>

                        <div className="flex items-start justify-start md:justify-end">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {row.sourceType === "window"
                              ? "Window"
                              : row.sourceType === "upcoming"
                              ? "Upcoming"
                              : "Current"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
