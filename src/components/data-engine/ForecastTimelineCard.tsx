"use client";

import { useMemo, useState } from "react";

type ActivationFocus =
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
  from?: string;
  to?: string;
  fromDateISO?: string;
  toDateISO?: string;
  startDate?: string;
  planet?: string;
  name?: string;
  body?: string;
  transitPlanet?: string;
  target?: string;
  eventType?: string;
  type?: string;
  title?: string;
  strength?: number;
  score?: number;
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

type SourceType = "window" | "upcoming" | "current";

type NormalizedRow = {
  id: string;
  startISO: string;
  endISO: string;
  planet: string;
  eventLabel: string;
  focus: ActivationFocus;
  sign: string | null;
  nakshatra: string | null;
  pada: number | null;
  house: number | null;
  natalHouse: number | null;
  strength: number;
  sourceType: SourceType;
};

type DashaActivation = {
  house: number;
  weight: number;
  sources: string[];
};

type HouseActivation = {
  house: number;
  dashaWeight: number;
  transitWeight: number;
  combinedWeight: number;
  dashaSources: string[];
  events: NormalizedRow[];
};

type PlanetActivation = {
  planet: string;
  count: number;
  weight: number;
  houses: number[];
  events: NormalizedRow[];
};

const MONTH_OPTIONS = [
  { value: 3, label: "Next 3 months" },
  { value: 6, label: "Next 6 months" },
  { value: 12, label: "Next 12 months" },
  { value: 24, label: "Next 24 months" },
];

const FOCUS_OPTIONS: Array<{ value: ActivationFocus; label: string }> = [
  { value: "all", label: "All areas" },
  { value: "career", label: "Career" },
  { value: "relationships", label: "Relationships" },
  { value: "money", label: "Money" },
  { value: "health", label: "Health" },
  { value: "spiritual", label: "Spiritual / Inner" },
];

const SIGNS = [
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
  2: "Resources",
  3: "Effort",
  4: "Home",
  5: "Creativity",
  6: "Work",
  7: "Partnerships",
  8: "Transformation",
  9: "Dharma",
  10: "Career",
  11: "Gains",
  12: "Withdrawal / Foreign",
};

const FOCUS_HOUSES: Record<ActivationFocus, number[]> = {
  all: [],
  career: [1, 6, 10, 11],
  relationships: [5, 7, 8],
  money: [2, 5, 8, 11],
  health: [1, 6, 8, 12],
  spiritual: [4, 8, 9, 12],
};

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

function cleanText(value: any) {
  return String(value ?? "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function cleanEventLabel(value: any) {
  const raw = String(value ?? "Transit").trim();
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
  return labels[key] ?? cleanText(raw);
}

function parseISODate(value?: string | null) {
  if (!value) return null;
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(dateISO: string, days: number) {
  const date = parseISODate(dateISO) ?? new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function formatShortDate(value?: string | null) {
  const date = parseISODate(value);
  if (!date) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function inferSignFromNakshatra(nakshatra?: string | null) {
  if (!nakshatra) return null;
  return NAKSHATRA_TO_SIGN[String(nakshatra).trim()]?.[0] ?? null;
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

function readHouseNumber(value: any) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 1 && number <= 12 ? number : null;
}

function houseFromAscSign(sign?: string | null, ascSign?: string | null) {
  if (!sign || !ascSign) return null;
  const signIndex = SIGNS.findIndex(
    (item) => item.toLowerCase() === String(sign).toLowerCase()
  );
  const ascIndex = SIGNS.findIndex(
    (item) => item.toLowerCase() === String(ascSign).toLowerCase()
  );
  if (signIndex < 0 || ascIndex < 0) return null;
  return ((signIndex - ascIndex + 12) % 12) + 1;
}

function getDashaPlanet(node: any) {
  if (!node) return null;
  if (typeof node === "string") return node;
  return node?.planet ?? node?.lord ?? node?.name ?? node?.dashaLord ?? null;
}

function getDashaPlanets(currentDasha: any) {
  const md = getDashaPlanet(currentDasha?.md ?? currentDasha?.mahadasha);
  const ad = getDashaPlanet(currentDasha?.ad ?? currentDasha?.antardasha);
  const pd = getDashaPlanet(currentDasha?.pd ?? currentDasha?.pratyantardasha);

  return [
    { level: "MD", planet: md, weight: 4 },
    { level: "AD", planet: ad, weight: 3 },
    { level: "PD", planet: pd, weight: 2 },
  ].filter((item) => item.planet);
}

function getDashaLabel(currentDasha: any, fallback?: string) {
  const parts = getDashaPlanets(currentDasha).map(
    (item) => `${item.level} ${normalizePlanet(item.planet)}`
  );
  return parts.length ? parts.join(" / ") : fallback || "—";
}

function rowPlanetName(row: any) {
  return normalizePlanet(
    row?.planet ?? row?.name ?? row?.graha ?? row?.lord ?? row?.body
  );
}

function getPlanetHouse(planet: string, natalPlanets: any[]) {
  const target = normalizePlanet(planet).toLowerCase();
  const row = (Array.isArray(natalPlanets) ? natalPlanets : []).find((item) =>
    [item?.planet, item?.name, item?.graha, item?.body, item?.code, item?.label]
      .map(normalizePlanet)
      .filter(Boolean)
      .some((name) => name.toLowerCase() === target)
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

  for (const candidate of candidates) {
    const house = readHouseNumber(candidate);
    if (house) return house;
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

  for (const candidate of candidates) {
    const house = readHouseNumber(candidate);
    if (house) return house;
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
  const target = normalizePlanet(planet).toLowerCase();
  const owned = new Set<number>();

  for (const row of Array.isArray(houses) ? houses : []) {
    const lord = getHouseLord(row);
    const house = getHouseNumber(row);
    if (house && lord && lord.toLowerCase() === target) owned.add(house);
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

    if (possiblePlanet && possiblePlanet.toLowerCase() === target) {
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

function buildDashaActivations(params: {
  currentDasha: any;
  natalPlanets: any[];
  houses: any[];
  roles: any;
}) {
  const map = new Map<number, DashaActivation>();
  const dashaPlanets = getDashaPlanets(params.currentDasha);

  const add = (house: number | null, source: string, weight: number) => {
    if (!house) return;
    const existing = map.get(house) ?? { house, weight: 0, sources: [] };
    existing.weight += weight;
    if (!existing.sources.includes(source)) existing.sources.push(source);
    map.set(house, existing);
  };

  for (const item of dashaPlanets) {
    const planet = normalizePlanet(item.planet);
    add(
      getPlanetHouse(planet, params.natalPlanets),
      `${item.level} ${planet} placement`,
      item.weight
    );

    for (const house of getOwnedHouses(planet, params.houses, params.roles)) {
      add(
        house,
        `${item.level} ${planet} ownership`,
        Math.max(1, item.weight - 1)
      );
    }
  }

  return {
    rows: Array.from(map.values()).sort(
      (a, b) => b.weight - a.weight || a.house - b.house
    ),
    dashaPlanets,
  };
}

function normalizeWindow(
  row: ForecastRow,
  index: number,
  sourceType: SourceType,
  ascSign?: string | null
): NormalizedRow | null {
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

  const planet =
    normalizePlanet(row?.planet ?? row?.name ?? row?.body ?? row?.transitPlanet) ||
    "Planet";
  const sign = getSign(row);
  const house =
    readHouseNumber(row?.transitHouse ?? row?.house) ??
    houseFromAscSign(sign, ascSign);
  const strength = Number(
    row?.strength ?? row?.score ?? (sourceType === "window" ? 0.65 : 0.45)
  );

  return {
    id: String(row?.id ?? `${sourceType}-${planet}-${startISO}-${index}`),
    startISO,
    endISO: row?.endISO ?? row?.to ?? row?.toDateISO ?? startISO,
    planet,
    eventLabel: cleanEventLabel(
      row?.target ?? row?.eventType ?? row?.type ?? row?.title ?? "Transit"
    ),
    focus: "all",
    sign,
    nakshatra: getNakshatra(row),
    pada: row?.pada ?? null,
    house,
    natalHouse: readHouseNumber(row?.natalHouse),
    strength: Number.isFinite(strength) ? strength : 0.45,
    sourceType,
  };
}

function normalizeCurrent(
  row: ForecastRow,
  index: number,
  ascSign?: string | null
): NormalizedRow | null {
  const planet = normalizePlanet(row?.planet ?? row?.name);
  if (!planet) return null;

  const startISO = todayISO();
  const sign = getSign(row);
  const house =
    readHouseNumber(row?.house ?? row?.transitHouse) ??
    houseFromAscSign(sign, ascSign);

  return {
    id: `current-${planet}-${index}`,
    startISO,
    endISO: addDaysISO(
      startISO,
      planet === "Moon" ? 2 : planet === "Sun" ? 30 : 60
    ),
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
  };
}

function buildRows(params: {
  transitWindows?: ForecastRow[];
  upcomingTransits?: UpcomingTransitBuckets | null;
  transitNow?: ForecastRow[] | any;
  ascSign?: string | null;
}) {
  const rows: NormalizedRow[] = [];

  (Array.isArray(params.transitWindows) ? params.transitWindows : []).forEach(
    (row, index) => {
      const normalized = normalizeWindow(row, index, "window", params.ascSign);
      if (normalized) rows.push(normalized);
    }
  );

  const upcoming = [
    ...(Array.isArray(params.upcomingTransits?.planetaryTransits)
      ? params.upcomingTransits!.planetaryTransits!
      : []),
    ...(Array.isArray(params.upcomingTransits?.moonTransits)
      ? params.upcomingTransits!.moonTransits!
      : []),
    ...(Array.isArray(params.upcomingTransits?.allEvents)
      ? params.upcomingTransits!.allEvents!
      : []),
  ];

  upcoming.forEach((row, index) => {
    const normalized = normalizeWindow(row, index, "upcoming", params.ascSign);
    if (normalized) rows.push(normalized);
  });

  (Array.isArray(params.transitNow) ? params.transitNow : []).forEach(
    (row, index) => {
      const normalized = normalizeCurrent(row, index, params.ascSign);
      if (normalized) rows.push(normalized);
    }
  );

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
    ].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function scoreFocus(row: NormalizedRow, focus: ActivationFocus) {
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
  if (focus === "money" && /money|income|wealth|gain|resource/.test(text)) score += 3;
  if (focus === "health" && /health|routine|stress|saturn|mars/.test(text)) score += 3;
  if (focus === "spiritual" && /spiritual|inner|dharma|ketu|jupiter/.test(text)) score += 3;

  return score;
}

function inferFocus(row: NormalizedRow): ActivationFocus {
  const candidates: ActivationFocus[] = [
    "career",
    "relationships",
    "money",
    "health",
    "spiritual",
  ];

  const best = candidates
    .map((focus) => ({ focus, score: scoreFocus(row, focus) }))
    .sort((a, b) => b.score - a.score)[0];

  return best?.score > 0 ? best.focus : "all";
}

function buildHouseActivations(
  rows: NormalizedRow[],
  dashaRows: DashaActivation[]
): HouseActivation[] {
  const map = new Map<number, HouseActivation>();

  for (const dasha of dashaRows) {
    map.set(dasha.house, {
      house: dasha.house,
      dashaWeight: dasha.weight,
      transitWeight: 0,
      combinedWeight: dasha.weight,
      dashaSources: dasha.sources,
      events: [],
    });
  }

  for (const row of rows) {
    if (!row.house) continue;
    const existing = map.get(row.house) ?? {
      house: row.house,
      dashaWeight: 0,
      transitWeight: 0,
      combinedWeight: 0,
      dashaSources: [],
      events: [],
    };

    existing.events.push(row);
    existing.transitWeight += Math.max(0.25, row.strength);
    existing.combinedWeight = existing.dashaWeight + existing.transitWeight;
    map.set(row.house, existing);
  }

  return Array.from(map.values()).sort(
    (a, b) => b.combinedWeight - a.combinedWeight || a.house - b.house
  );
}

function buildPlanetActivations(rows: NormalizedRow[]): PlanetActivation[] {
  const map = new Map<string, PlanetActivation>();

  for (const row of rows) {
    const existing = map.get(row.planet) ?? {
      planet: row.planet,
      count: 0,
      weight: 0,
      houses: [],
      events: [],
    };

    existing.count += 1;
    existing.weight += Math.max(0.25, row.strength);
    existing.events.push(row);
    if (row.house && !existing.houses.includes(row.house)) existing.houses.push(row.house);
    map.set(row.planet, existing);
  }

  return Array.from(map.values()).sort(
    (a, b) => b.weight - a.weight || b.count - a.count
  );
}

function activationLabel(weight: number) {
  if (weight >= 9) return "Very High";
  if (weight >= 6) return "High";
  if (weight >= 3) return "Moderate";
  return "Mild";
}

function focusLabel(value: ActivationFocus) {
  return FOCUS_OPTIONS.find((item) => item.value === value)?.label ?? "All areas";
}

export default function ForecastTimelineCard({
  transitWindows = [],
  transitNow = [],
  upcomingTransits = null,
  currentDasha,
  natalPlanets = [],
  houses = [],
  roles = null,
  currentDashaLabel,
  ascSign = null,
}: Props) {
  const [months, setMonths] = useState(12);
  const [focus, setFocus] = useState<ActivationFocus>("all");
  const [openHouse, setOpenHouse] = useState<number | null>(null);
  const [openPlanet, setOpenPlanet] = useState<string | null>(null);

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

  const dashaActivationData = useMemo(
    () =>
      buildDashaActivations({
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
      .slice(0, 120);
  }, [allRows, now, horizonEnd, focus]);

  const houseActivations = useMemo(
    () => buildHouseActivations(filteredRows, dashaActivationData.rows),
    [filteredRows, dashaActivationData.rows]
  );

  const planetActivations = useMemo(
    () => buildPlanetActivations(filteredRows),
    [filteredRows]
  );

  const lifeAreaActivations = useMemo(() => {
    return ([
      "career",
      "relationships",
      "money",
      "health",
      "spiritual",
    ] as ActivationFocus[])
      .map((area) => {
        const rows = filteredRows.filter((row) => scoreFocus(row, area) > 0);
        const weight = rows.reduce(
          (sum, row) => sum + Math.max(0.25, row.strength),
          0
        );
        const houses = Array.from(
          new Set(rows.map((row) => row.house).filter(Boolean) as number[])
        );
        return { area, rows, weight, houses };
      })
      .filter((item) => item.rows.length)
      .sort((a, b) => b.weight - a.weight);
  }, [filteredRows]);

  const activeDashaLabel = getDashaLabel(currentDasha, currentDashaLabel);
  const topCombinedHouse = houseActivations[0];
  const topTransitPlanet = planetActivations[0];

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Activations</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
            Structured dasha and transit data showing which planets, houses and life areas are active in the selected period.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Period
            </label>
            <select
              value={months}
              onChange={(event) => setMonths(Number(event.target.value))}
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
              Life Area Filter
            </label>
            <select
              value={focus}
              onChange={(event) =>
                setFocus(event.target.value as ActivationFocus)
              }
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
        <SummaryCard
          label="Active Dasha"
          value={activeDashaLabel}
          helper="Current MD / AD / PD sequence"
        />
        <SummaryCard
          label="Strongest Combined House"
          value={
            topCombinedHouse
              ? `H${topCombinedHouse.house} ${HOUSE_NAMES[topCombinedHouse.house] ?? ""}`
              : "—"
          }
          helper={
            topCombinedHouse
              ? `${activationLabel(topCombinedHouse.combinedWeight)} activation`
              : "No activation data"
          }
        />
        <SummaryCard
          label="Most Active Transit Planet"
          value={topTransitPlanet?.planet ?? "—"}
          helper={
            topTransitPlanet
              ? `${topTransitPlanet.count} events across ${topTransitPlanet.houses.length} houses`
              : "No transit data"
          }
        />
        <SummaryCard
          label="Active Events"
          value={String(filteredRows.length)}
          helper={`${focusLabel(focus)} • selected period`}
          large
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          title="Current Dasha Activation"
          description="Houses activated by the placement and ownership of the running dasha lords."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {dashaActivationData.dashaPlanets.length ? (
              dashaActivationData.dashaPlanets.map((item) => (
                <span
                  key={`${item.level}-${item.planet}`}
                  className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                >
                  {item.level} {normalizePlanet(item.planet)}
                </span>
              ))
            ) : (
              <EmptyText text="No current dasha data available." />
            )}
          </div>

          <div className="space-y-3">
            {dashaActivationData.rows.map((row) => (
              <div
                key={row.house}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">
                    H{row.house} {HOUSE_NAMES[row.house] ?? "House"}
                  </div>
                  <ActivationBadge weight={row.weight} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {row.sources.map((source) => (
                    <span
                      key={source}
                      className="rounded-lg bg-white px-2 py-1 text-[11px] text-slate-600 ring-1 ring-slate-200"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Life-Area Activation"
          description="A data grouping of transit events by houses and event keywords."
        >
          <div className="space-y-3">
            {lifeAreaActivations.length ? (
              lifeAreaActivations.map((item) => (
                <div
                  key={item.area}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {focusLabel(item.area)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.rows.length} events
                        {item.houses.length
                          ? ` • H${item.houses.join(", H")}`
                          : ""}
                      </div>
                    </div>
                    <ActivationBadge weight={item.weight} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyText text="No life-area activation rows found for this period." />
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel
          title="Combined House Activation"
          description="Dasha weight and transit activity shown together. Expand a house to inspect its source data."
        >
          <div className="space-y-3">
            {houseActivations.length ? (
              houseActivations.map((item) => {
                const isOpen = openHouse === item.house;
                return (
                  <div
                    key={item.house}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenHouse(isOpen ? null : item.house)}
                      className="flex w-full items-center justify-between gap-4 bg-slate-50/80 px-4 py-3 text-left transition hover:bg-slate-100"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            H{item.house} {HOUSE_NAMES[item.house] ?? "House"}
                          </span>
                          <ActivationBadge weight={item.combinedWeight} />
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Dasha {item.dashaWeight.toFixed(1)} • Transit {item.transitWeight.toFixed(1)} • {item.events.length} events
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {isOpen ? "Hide Events" : "View Events"}
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="border-t border-slate-200">
                        {item.dashaSources.length ? (
                          <div className="border-b border-slate-100 bg-white px-4 py-3">
                            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                              Dasha Sources
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {item.dashaSources.map((source) => (
                                <span
                                  key={source}
                                  className="rounded-lg bg-indigo-50 px-2 py-1 text-[11px] text-indigo-700"
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div className="divide-y divide-slate-100">
                          {item.events.length ? (
                            item.events.map((row) => <EventRow key={row.id} row={row} />)
                          ) : (
                            <div className="px-4 py-4 text-sm text-slate-500">
                              No transit events in the selected period.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <EmptyText text="No combined house activations available." />
            )}
          </div>
        </Panel>

        <Panel
          title="Planet Activation"
          description="Transit planets ranked by event count and signal weight."
        >
          <div className="space-y-3">
            {planetActivations.length ? (
              planetActivations.map((item) => {
                const isOpen = openPlanet === item.planet;
                return (
                  <div
                    key={item.planet}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenPlanet(isOpen ? null : item.planet)
                      }
                      className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">
                          {item.planet}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.count} events
                          {item.houses.length
                            ? ` • H${item.houses.join(", H")}`
                            : ""}
                        </div>
                      </div>
                      <ActivationBadge weight={item.weight} />
                    </button>

                    {isOpen ? (
                      <div className="border-t border-slate-200 bg-white">
                        {item.events.slice(0, 10).map((row) => (
                          <EventRow key={row.id} row={row} compact />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <EmptyText text="No planet activation data available." />
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Activation Timeline"
          description="Chronological raw timing rows for the selected period and life-area filter."
        >
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {filteredRows.length ? (
              filteredRows.map((row) => <EventRow key={row.id} row={row} />)
            ) : (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No activation events found. Increase the period or change the life-area filter.
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-sm leading-relaxed text-slate-600">
        This view presents activation data only. It does not classify an activation as favourable or unfavourable and does not generate predictive conclusions.
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  helper,
  large = false,
}: {
  label: string;
  value: string;
  helper: string;
  large?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div
        className={`mt-2 font-semibold text-slate-950 ${
          large ? "text-2xl tracking-tight" : "text-sm"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-slate-500">{helper}</div>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ActivationBadge({ weight }: { weight: number }) {
  return (
    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
      {activationLabel(weight)}
    </span>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
      {text}
    </div>
  );
}

function EventRow({
  row,
  compact = false,
}: {
  row: NormalizedRow;
  compact?: boolean;
}) {
  const details = [
    row.house ? `Transit H${row.house}` : null,
    row.natalHouse ? `Natal H${row.natalHouse}` : null,
    row.sign ? `Rashi: ${row.sign}` : null,
    row.nakshatra ? `Nakshatra: ${row.nakshatra}` : null,
    row.pada ? `Pada: ${row.pada}` : null,
  ].filter(Boolean);

  return (
    <div
      className={`grid grid-cols-1 gap-3 px-4 py-3 text-sm ${
        compact ? "" : "md:grid-cols-[110px_minmax(0,1fr)_110px]"
      }`}
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
          {details.length ? details.join(" • ") : "Transit event"}
        </div>
      </div>

      {!compact ? (
        <div className="flex items-start justify-start md:justify-end">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {row.sourceType === "window"
              ? "Window"
              : row.sourceType === "upcoming"
              ? "Upcoming"
              : "Current"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
