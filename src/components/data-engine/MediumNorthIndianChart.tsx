"use client";

import { useMemo, useState, type ReactNode } from "react";

type ChartPlanet = {
  planet: string;
  sign?: string | null;
  house?: number | null;
  rashiHouse?: number | null;
  degree?: number | null;
  retrograde?: boolean;
  nakshatra?: string | null;
  pada?: number | null;
  combust?: boolean;
  displayHouse?: number | null;
  isTransit?: boolean;
  isSynastryOverlay?: boolean;
synastrySource?: "A" | "B";
};

type ArudhaMap = Record<string, { sign: string }>;
type LayoutVariant = "auto" | "primary" | "secondary";

type AstroPoint = {
  sign?: string | null;
  rashi?: string | null;
  house?: number | null;
  rashiHouse?: number | null;
  degree?: number | null;
  deg?: number | null;
  lon?: number | null;
  nakshatra?: string | null;
  pada?: number | null;
  [key: string]: any;
};

type ChartMarker = {
  key: string;
  label: string;
  name: string;
  type: "upagraha" | "shadow";
  sign?: string | null;
  house?: number | null;
  degree?: number | null;
  nakshatra?: string | null;
  pada?: number | null;
};

type HouseAspectMarker = {
  key: string;
  fromPlanet: string;
  label: string;
  aspectLabel?: string | null;
  raw: any;
};

type MediumNorthIndianChartProps = {
  title?: string;
  ascSign?: string | null;
  planets?: ChartPlanet[];
  transitPlanets?: ChartPlanet[];
  onPlanetClick?: (planet: ChartPlanet) => void;
  mode?: "rashi" | "chalit";
  sarvaAshtakvarga?: number[];
  showPlanetDetails?: boolean;
  arudhas?: ArudhaMap;
  layoutVariant?: LayoutVariant;
  upagrahas?: Record<string, AstroPoint> | null;
  solarShadowPoints?: Record<string, AstroPoint> | null;
  vedicAspects?: any;
  showArudhas?: boolean;
  showUpagrahas?: boolean;
  showAspects?: boolean;
  showAbbreviations?: boolean;
  compactPlanetLabels?: boolean;
  aspectHouseReferenceHouse?: number;
  rightPanel?: ReactNode;
highlightPlanets?: string[];
};

const PLANET_SHORT: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
  Uranus: "Ur",
  Neptune: "Ne",
  Pluto: "Pl",
};

const UPAGRAHA_LABELS: Record<string, string> = {
  gulika: "Gk",
  mandi: "Md",
  yamakantaka: "Yg",
  kala: "Ka",
  mrityu: "Mr",
  ardhaprahara: "Ap",
  
};

const UPAGRAHA_NAMES: Record<string, string> = {
  gulika: "Gulika",
  mandi: "Mandi",
  yamakantaka: "Yamakantaka",
  kala: "Kala",
  mrityu: "Mrityu",
  ardhaprahara: "Ardhaprahara",
};

const SHADOW_LABELS: Record<string, string> = {
  dhuma: "Dh",
  vyatipata: "Vy",
  parivesha: "Pa",
  indrachapa: "In",
  upaketu: "Uk",
};

const SHADOW_NAMES: Record<string, string> = {
  dhuma: "Dhuma",
  vyatipata: "Vyatipata",
  parivesha: "Parivesha",
  indrachapa: "Indrachapa",
  upaketu: "Upaketu",
};

const NAKSHATRA_LORD_SHORT: Record<string, string> = {
  Ashwini: "Ke",
  Bharani: "Ve",
  Krittika: "Su",
  Rohini: "Mo",
  Mrigashira: "Ma",
  Ardra: "Ra",
  Punarvasu: "Ju",
  Pushya: "Sa",
  Ashlesha: "Me",
  Magha: "Ke",
  "Purva Phalguni": "Ve",
  "Uttara Phalguni": "Su",
  Hasta: "Mo",
  Chitra: "Ma",
  Swati: "Ra",
  Vishakha: "Ju",
  Anuradha: "Sa",
  Jyeshtha: "Me",
  Mula: "Ke",
  "Purva Ashadha": "Ve",
  "Uttara Ashadha": "Su",
  Shravana: "Mo",
  Dhanishta: "Ma",
  Dhanishtha: "Ma",
  Shatabhisha: "Ra",
  "Purva Bhadrapada": "Ju",
  "Uttara Bhadrapada": "Sa",
  Revati: "Me",
};

function formatNakshatraWithLord(nakshatra?: string | null) {
  if (!nakshatra) return "—";

  const lord = NAKSHATRA_LORD_SHORT[nakshatra];

  return lord ? `${nakshatra} (${lord})` : nakshatra;
}

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
] as const;

const SIGN_TO_NUMBER: Record<string, number> = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

type HouseAnchor = {
  house: number;
  x: number;
  y: number;
  width: number;
  minHeight?: number;
};

type LayoutConfig = {
  frameWidth: number;
  frameHeight: number;
  outerRect: { x: number; y: number; width: number; height: number };
  anchors: HouseAnchor[];
  housePlanetShifts: Record<number, string>;
  houseLabelShifts?: Partial<Record<number, string>>;
  houseMaxHeights?: Partial<Record<number, number>>;
  houseArudhaShifts?: Partial<Record<number, string>>;
  houseMarkerShifts?: Partial<Record<number, string>>;
};

const PRIMARY_LAYOUT: LayoutConfig = {
  frameWidth: 720,
  frameHeight: 650,
  outerRect: { x: 70, y: 54, width: 570, height: 540 },
  anchors: [
    { house: 2, x: 230, y: 86, width: 96, minHeight: 112 },
    { house: 12, x: 490, y: 86, width: 96, minHeight: 112 },

    { house: 3, x: 146, y: 176, width: 96, minHeight: 112 },
    { house: 1, x: 360, y: 146, width: 120, minHeight: 112 },
    { house: 11, x: 574, y: 176, width: 96, minHeight: 112 },

    { house: 4, x: 230, y: 304, width: 96, minHeight: 112 },
    { house: 10, x: 490, y: 304, width: 96, minHeight: 112 },

    { house: 5, x: 146, y: 410, width: 104, minHeight: 120 },
    { house: 7, x: 360, y: 430, width: 120, minHeight: 112 },
    { house: 9, x: 590, y: 422, width: 92, minHeight: 112 },

    { house: 6, x: 222, y: 512, width: 104, minHeight: 120 },
    { house: 8, x: 490, y: 520, width: 96, minHeight: 112 },
  ],
  housePlanetShifts: {
    1: "translate(0,-2px)",
    5: "translate(-4px,-2px)",
    6: "translate(-6px,2px)",
    7: "translate(-2px,-2px)",
    8: "translate(-2px,-2px)",
    9: "translate(-2px,2px)",
    10: "translate(-4px,-2px)",
    11: "translate(0,-2px)",
    12: "translate(0,-2px)",
  },
  houseLabelShifts: {
    2: "translateY(6px)",
    12: "translateY(6px)",
  },
  houseMaxHeights: {
    1: 72,
    2: 72,
    3: 72,
    4: 72,
    5: 72,
    6: 72,
    7: 72,
    8: 72,
    9: 72,
    10: 72,
    11: 72,
    12: 72,
  },
  houseArudhaShifts: {},
  houseMarkerShifts: {},
};
const PRIMARY_ASPECT_ANCHORS: Record<number, { left: number; top: number; width: number }> = {
  // Aspect rail is keyed by HOUSE number, not by displayed sign number.
  // Top rail: H2 • H1 • H12
  2: { left: 175, top: 20, width: 110 },
  1: { left: 305, top: 20, width: 110 },
  12: { left: 435, top: 20, width: 110 },

  // Left rail: H3 • H4 • H5
  3: { left: 10, top: 160, width: 110 },
  4: { left: 10, top: 320, width: 110 },
  5: { left: 10, top: 480, width: 110 },

  // Right rail: H11 • H10 • H9
  11: { left: 600, top: 160, width: 110 },
  10: { left: 600, top: 320, width: 110 },
  9: { left: 600, top: 480, width: 110 },

  // Bottom rail: H6 • H7 • H8
  6: { left: 175, top: 604, width: 110 },
  7: { left: 305, top: 604, width: 110 },
  8: { left: 435, top: 604, width: 110 },
};

const SECONDARY_ASPECT_ANCHORS: Record<number, { left: number; top: number; width: number }> = {
  // Same HOUSE-number mapping for secondary charts.
  2: { left: 112, top: 10, width: 96 },
  1: { left: 212, top: 10, width: 96 },
  12: { left: 312, top: 10, width: 96 },

  3: { left: 0, top: 112, width: 96 },
  4: { left: 0, top: 232, width: 96 },
  5: { left: 0, top: 352, width: 96 },

  11: { left: 424, top: 112, width: 96 },
  10: { left: 424, top: 232, width: 96 },
  9: { left: 424, top: 352, width: 96 },

  6: { left: 112, top: 468, width: 96 },
  7: { left: 212, top: 468, width: 96 },
  8: { left: 312, top: 468, width: 96 },
};
const SECONDARY_LAYOUT: LayoutConfig = {
  frameWidth: 520,
  frameHeight: 500,
  outerRect: { x: 34, y: 34, width: 452, height: 432 },
  anchors: [
    { house: 2, x: 158, y: 62, width: 82, minHeight: 96 },
    { house: 12, x: 362, y: 62, width: 82, minHeight: 96 },

    { house: 3, x: 94, y: 132, width: 80, minHeight: 96 },
    { house: 1, x: 260, y: 106, width: 98, minHeight: 96 },
    { house: 11, x: 426, y: 132, width: 80, minHeight: 96 },

    { house: 4, x: 158, y: 234, width: 80, minHeight: 96 },
    { house: 10, x: 362, y: 234, width: 80, minHeight: 96 },

    { house: 5, x: 94, y: 324, width: 80, minHeight: 96 },
    { house: 7, x: 260, y: 334, width: 98, minHeight: 96 },
    { house: 9, x: 446, y: 350, width: 76, minHeight: 96 },

    { house: 6, x: 158, y: 396, width: 80, minHeight: 96 },
    { house: 8, x: 362, y: 396, width: 80, minHeight: 96 },
  ],
  housePlanetShifts: {
    1: "translate(0,-1px)",
    7: "translate(-1px,-1px)",
    8: "translate(-1px,-1px)",
    9: "translate(-1px,-7px)",
    10: "translate(-2px,-1px)",
    11: "translate(0,-1px)",
    12: "translate(0,-1px)",
  },
  houseLabelShifts: {
    2: "translateY(4px)",
    12: "translateY(4px)",
  },
  houseMaxHeights: {
    1: 72,
    2: 72,
    3: 72,
    4: 72,
    5: 72,
    6: 72,
    7: 72,
    8: 72,
    9: 72,
    10: 72,
    11: 72,
    12: 72,
  },
  houseArudhaShifts: {},
  houseMarkerShifts: {},
};

function getSignNumber(sign?: string | null) {
  if (!sign) return "—";
  return String(SIGN_TO_NUMBER[sign] ?? "—");
}

function resolveLayoutVariant(title: string, layoutVariant: LayoutVariant): Exclude<LayoutVariant, "auto"> {
  if (layoutVariant !== "auto") return layoutVariant;
  const normalized = title.toLowerCase();
  if (
    normalized.includes("d1") ||
    normalized.includes("lagna") ||
    normalized.includes("house centered") ||
    normalized.includes("house-centred") ||
    normalized.includes("house centered chart")
  ) {
    return "primary";
  }
  return "secondary";
}

function getLayoutConfig(title: string, layoutVariant: LayoutVariant): LayoutConfig {
  const resolved = resolveLayoutVariant(title, layoutVariant);
  return resolved === "primary" ? PRIMARY_LAYOUT : SECONDARY_LAYOUT;
}

function formatPlanetLabel(p: ChartPlanet) {
  const planetName = p?.planet ?? "??";
  const short = PLANET_SHORT[planetName] ?? String(planetName).slice(0, 2);
  const transitPrefix = p?.isTransit ? "T-" : "";

  return `${transitPrefix}${short}${p.retrograde ? "*" : ""}`;
}
function getPlanetsByHouse(
  planets: ChartPlanet[],
  mode: "rashi" | "chalit" = "rashi"
) {
  const map = new Map<number, ChartPlanet[]>();

  for (const p of planets) {
  const house =
  typeof p.displayHouse === "number"
    ? p.displayHouse
    : typeof p.rashiHouse === "number"
      ? p.rashiHouse
      : typeof p.house === "number"
        ? p.house
        : null;

    if (typeof house !== "number") continue;

    if (!map.has(house)) map.set(house, []);
    map.get(house)!.push(p);
  }

  return map;
}

function getAscSignIndex(ascSign?: string | null) {
  if (!ascSign) return -1;
  return SIGNS.findIndex((s) => s === ascSign);
}

function normalizeDegree(point: AstroPoint) {
  if (typeof point?.degree === "number") return point.degree;
  if (typeof point?.deg === "number") return point.deg;
  if (typeof point?.lon === "number") return Number((((point.lon % 30) + 30) % 30).toFixed(2));
  return null;
}

function getPointSign(point: AstroPoint) {
  return point?.sign ?? point?.rashi ?? null;
}

function getHouseFromSign(sign: string | null | undefined, ascSign?: string | null) {
  const ascIndex = getAscSignIndex(ascSign);
  if (!sign || ascIndex < 0) return null;

  const signIndex = SIGNS.findIndex((s) => s === sign);
  if (signIndex < 0) return null;

  return ((signIndex - ascIndex + 12) % 12) + 1;
}

function getPointHouse(point: AstroPoint, ascSign?: string | null) {
  if (typeof point?.rashiHouse === "number") return point.rashiHouse;
  if (typeof point?.house === "number") return point.house;
  return getHouseFromSign(getPointSign(point), ascSign);
}

function getPlanetTitle(p: ChartPlanet) {
  const parts = [
    p.isTransit ? "Transit" : "Natal",
    p.planet,
    p.sign ? `in ${p.sign}` : null,
    typeof p.degree === "number" ? `${p.degree.toFixed(2)}°` : null,
    p.nakshatra ? formatNakshatraWithLord(p.nakshatra) : null,
    p.pada ? `Pada ${p.pada}` : null,
  ].filter(Boolean);

  return parts.join(" • ");
}

function getMarkerTitle(marker: ChartMarker) {
  const parts = [
    marker.name,
    marker.type === "upagraha" ? "Upagraha" : "Solar shadow point",
    marker.sign ? `in ${marker.sign}` : null,
    typeof marker.degree === "number" ? `${marker.degree.toFixed(2)}°` : null,
    marker.nakshatra ? formatNakshatraWithLord(marker.nakshatra) : null,
    marker.pada ? `Pada ${marker.pada}` : null,
  ].filter(Boolean);

  return parts.join(" • ");
}

function getHouseSignNumber(house: number, ascSign?: string | null) {
  const ascIndex = getAscSignIndex(ascSign);
  if (ascIndex < 0) return "—";
  return String(((ascIndex + (house - 1)) % 12) + 1);
}

function getHouseSignName(house: number, ascSign?: string | null) {
  const ascIndex = getAscSignIndex(ascSign);
  if (ascIndex < 0) return null;
  return SIGNS[(ascIndex + (house - 1)) % 12] ?? null;
}

function getArudhasByHouse(arudhas: ArudhaMap | undefined, ascSign?: string | null) {
  const map = new Map<number, string[]>();

  if (!arudhas || !ascSign) return map;

  for (const [label, value] of Object.entries(arudhas)) {
    const sign = value?.sign;
    if (!sign) continue;

    const house = getHouseFromSign(sign, ascSign);
    if (!house) continue;

    if (!map.has(house)) map.set(house, []);
    map.get(house)!.push(label);
  }

  return map;
}

function buildMarkersByHouse(
  upagrahas: Record<string, AstroPoint> | null | undefined,
  solarShadowPoints: Record<string, AstroPoint> | null | undefined,
  ascSign?: string | null
) {
  const map = new Map<number, ChartMarker[]>();

  const addMarker = (key: string, point: AstroPoint | undefined, type: ChartMarker["type"]) => {
    if (!point || typeof point !== "object") return;

    const label = type === "upagraha" ? UPAGRAHA_LABELS[key] : SHADOW_LABELS[key];
    const name = type === "upagraha" ? UPAGRAHA_NAMES[key] : SHADOW_NAMES[key];

    if (!label || !name) return;

    const house = getPointHouse(point, ascSign);
    if (!house || house < 1 || house > 12) return;

    const marker: ChartMarker = {
      key,
      label,
      name,
      type,
      sign: getPointSign(point),
      house,
      degree: normalizeDegree(point),
      nakshatra: point?.nakshatra ?? null,
      pada: typeof point?.pada === "number" ? point.pada : null,
    };

    if (!map.has(house)) map.set(house, []);
    map.get(house)!.push(marker);
  };

  for (const key of Object.keys(UPAGRAHA_LABELS)) {
    addMarker(key, upagrahas?.[key], "upagraha");
  }

  for (const key of Object.keys(SHADOW_LABELS)) {
    addMarker(key, solarShadowPoints?.[key], "shadow");
  }

  return map;
}

function normalizeAspectLabel(value: any) {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function remapHouseForReference(house: number, referenceHouse = 1) {
  const ref = Number(referenceHouse);

  if (!Number.isFinite(ref) || ref < 1 || ref > 12) return house;

  return ((house - ref + 12) % 12) + 1;
}

function getHouseAspectsByHouse(vedicAspects: any, referenceHouse = 1) {
  const map = new Map<number, HouseAspectMarker[]>();

  // Exact schema used by VedicHouseAspectsCard:
  // data.houses = [
  //   {
  //     house: number,
  //     aspectedBy: [
  //       { planet, fromHouse, aspectType, housesAway }
  //     ]
  //   }
  // ]
  const rows = Array.isArray(vedicAspects?.houses) ? vedicAspects.houses : [];

  for (const row of rows) {
    const natalHouse = Number(row?.house);

    if (!Number.isFinite(natalHouse) || natalHouse < 1 || natalHouse > 12) continue;

    const house = remapHouseForReference(natalHouse, referenceHouse);

    const aspectedBy = Array.isArray(row?.aspectedBy) ? row.aspectedBy : [];

    for (let idx = 0; idx < aspectedBy.length; idx += 1) {
      const item = aspectedBy[idx];
      const planet = item?.planet ? String(item.planet) : "";

      if (!planet) continue;

      if (!map.has(house)) map.set(house, []);

      const aspectLabel = normalizeAspectLabel(item?.aspectType);
      const label = PLANET_SHORT[planet] ?? planet.slice(0, 2);

      map.get(house)!.push({
        key: `${house}-natal-${natalHouse}-${planet}-${item?.fromHouse ?? "x"}-${aspectLabel ?? "aspect"}-${idx}`,
        fromPlanet: planet,
        label,
        aspectLabel,
        raw: { ...item, natalTargetHouse: natalHouse, displayTargetHouse: house },
      });
    }
  }

  return map;
}

function getAspectTitle(house: number, marker: HouseAspectMarker) {
  const fromHouse = marker.raw?.fromHouse;
  const housesAway = marker.raw?.housesAway;
  const natalTargetHouse = marker.raw?.natalTargetHouse;

  return [
    `Displayed house ${house} aspected by ${marker.fromPlanet}`,
    natalTargetHouse && natalTargetHouse !== house ? `Natal H${natalTargetHouse}` : null,
    fromHouse !== null && fromHouse !== undefined ? `From H${fromHouse}` : null,
    marker.aspectLabel ? `Aspect: ${marker.aspectLabel}` : null,
    housesAway !== null && housesAway !== undefined ? `${housesAway} houses away` : null,
  ]
    .filter(Boolean)
    .join(" • ");
}
function getAspectPlanetLabel(row: any) {
  const planet =
    row?.fromPlanet ??
    row?.planet ??
    row?.sourcePlanet ??
    row?.aspectingPlanet ??
    "";

  return PLANET_SHORT[planet] ?? String(planet).slice(0, 2);
}
export default function MediumNorthIndianChart({
  title = "North Indian Chart",
  ascSign,
  planets = [],
  transitPlanets = [],
  onPlanetClick,
  mode = "rashi",
  sarvaAshtakvarga = [],
  showPlanetDetails = true,
  arudhas = {},
  layoutVariant = "auto",
  upagrahas = null,
  solarShadowPoints = null,
  vedicAspects = null,
  showArudhas = false,
  showUpagrahas = false,
  showAspects = false,
  showAbbreviations = true,
  compactPlanetLabels = false,
  aspectHouseReferenceHouse = 1,
  rightPanel = null,
highlightPlanets = [],
}: MediumNorthIndianChartProps) {
  const [selected, setSelected] = useState<ChartPlanet | null>(null);
  const [hovered, setHovered] = useState<ChartPlanet | null>(null);
  const layout = useMemo(() => getLayoutConfig(title, layoutVariant), [title, layoutVariant]);
  const pct = (value: number, total: number) => `${(value / total) * 100}%`;
  const planetsByHouse = useMemo(() => getPlanetsByHouse(planets, mode), [planets, mode]);
const transitPlanetsByHouse = useMemo(
  () => getPlanetsByHouse(transitPlanets, mode),
  [transitPlanets, mode]
);
  const arudhasByHouse = useMemo(() => getArudhasByHouse(arudhas, ascSign), [arudhas, ascSign]);
  const markersByHouse = useMemo(
    () => buildMarkersByHouse(upagrahas, solarShadowPoints, ascSign),
    [upagrahas, solarShadowPoints, ascSign]
  );
  const aspectsByHouse = useMemo(
    () => getHouseAspectsByHouse(vedicAspects, aspectHouseReferenceHouse),
    [vedicAspects, aspectHouseReferenceHouse]
  );
  

  const rectLeft = layout.outerRect.x;
  const rectTop = layout.outerRect.y;
  const rectRight = layout.outerRect.x + layout.outerRect.width;
  const rectBottom = layout.outerRect.y + layout.outerRect.height;
  const centerX = rectLeft + layout.outerRect.width / 2;
  const centerY = rectTop + layout.outerRect.height / 2;
  const resolvedLayoutVariant = resolveLayoutVariant(title, layoutVariant);
  const aspectAnchors =
    resolvedLayoutVariant === "primary"
      ? PRIMARY_ASPECT_ANCHORS
      : SECONDARY_ASPECT_ANCHORS;
  const activePlanet = hovered || selected;
  const highlightSet = new Set(highlightPlanets.map(String));
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">Click any planet to view detailed information.</p>
        </div>

        <div className="text-xs text-slate-900">
          Ascendant: <span className="font-semibold text-[color:var(--primary)]">{getSignNumber(ascSign)}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="min-w-0">
      <div className="mt-4 w-full overflow-x-auto overflow-y-hidden">
  <div
    className="relative mx-auto overflow-visible rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm"
    style={{
      width: layout.frameWidth,
      height: layout.frameHeight,
      minWidth: layout.frameWidth,
    }}
  >
          <svg
            viewBox={`0 0 ${layout.frameWidth} ${layout.frameHeight}`}
            className="absolute inset-0 h-full w-full"
            aria-label="North Indian astrology chart"
          >
            <rect
              x={layout.outerRect.x}
              y={layout.outerRect.y}
              width={layout.outerRect.width}
              height={layout.outerRect.height}
              fill="transparent"
              stroke="rgba(71,85,105,0.65)"
              strokeWidth="1.6"
            />

            <line x1={centerX} y1={rectTop} x2={rectRight} y2={centerY} stroke="rgba(71,85,105,0.65)" strokeWidth="1.6" />
            <line x1={rectRight} y1={centerY} x2={centerX} y2={rectBottom} stroke="rgba(71,85,105,0.65)" strokeWidth="1.6" />
            <line x1={centerX} y1={rectBottom} x2={rectLeft} y2={centerY} stroke="rgba(71,85,105,0.65)" strokeWidth="1.6" />
            <line x1={rectLeft} y1={centerY} x2={centerX} y2={rectTop} stroke="rgba(71,85,105,0.65)" strokeWidth="1.6" />

            <line x1={rectLeft} y1={rectTop} x2={rectRight} y2={rectBottom} stroke="rgba(71,85,105,0.65)" strokeWidth="1.6" />
            <line x1={rectRight} y1={rectTop} x2={rectLeft} y2={rectBottom} stroke="rgba(71,85,105,0.65)" strokeWidth="1.6" />
          </svg>

          {layout.anchors.map((anchor) => {
            const housePlanets = planetsByHouse.get(anchor.house) ?? [];
            const houseTransitPlanets = (transitPlanetsByHouse.get(anchor.house) ?? []).map((p) => ({ ...p, isTransit: true }));
            const shownNatalPlanets = housePlanets;
            const shownTransitPlanets = houseTransitPlanets;
            const isAscHouse = anchor.house === 1;
            const houseLabel = getHouseSignNumber(anchor.house, ascSign);
            const houseLabelShift = layout.houseLabelShifts?.[anchor.house] ?? "translateY(0px)";
            const planetShift = layout.housePlanetShifts[anchor.house] ?? "translate(0,0)";
            const houseMaxHeight = layout.houseMaxHeights?.[anchor.house] ?? 46;
            const allForTitle = [...housePlanets, ...houseTransitPlanets];
            const houseArudhas = arudhasByHouse.get(anchor.house) ?? [];
            const houseMarkers = markersByHouse.get(anchor.house) ?? [];
            
            const houseSarva = sarvaAshtakvarga?.[anchor.house - 1];
            return (
              <div
                key={anchor.house}
                className="absolute"
               style={{
  left: anchor.x - anchor.width / 2,
  top: anchor.y,
  width: anchor.width,
  minHeight: anchor.minHeight ?? 104,
}}
              >
                

                <div className="flex flex-col items-center">
                  <div
                    className={`text-[15px] font-semibold leading-none ${isAscHouse ? "text-indigo-700" : "text-slate-700"}`}
                    style={{ transform: houseLabelShift }}
                  >
                    {houseLabel}
                    {typeof houseSarva === "number" ? (
                      <span className="ml-1 text-[9px] font-medium text-slate-400">{houseSarva}</span>
                    ) : null}
                  </div>
                </div>
                <div
                  className="mt-1 grid grid-cols-2 content-start justify-items-center gap-1"
                  style={{
                    maxHeight: houseMaxHeight,
                    transform: planetShift,
                  }}
                  title={allForTitle.map(getPlanetTitle).join(" • ")}
                >
                  {shownNatalPlanets.map((p, idx) => (
                    <button
                      key={`natal-${anchor.house}-${p.planet}-${idx}`}
                      type="button"
                      onMouseEnter={() => setHovered(p)}
                      onMouseLeave={() =>
                        setHovered((curr) => (curr?.planet === p.planet && !curr?.isTransit ? null : curr))
                      }
                      onClick={() => {
                        setSelected(p);
                        onPlanetClick?.(p);
                      }}
                      className={`${
  compactPlanetLabels
    ? "max-w-[34px] rounded px-1 py-[1px] text-[9px]"
    : "rounded-md px-1.5 py-0.5 text-[10px]"
} font-medium leading-none shadow-sm transition ${
                        p.isSynastryOverlay
  ? "border border-violet-200 bg-violet-50 text-violet-700"
  :
                        p.planet === "Moon"
  ? "border border-orange-200 bg-orange-50 text-orange-700"
  : selected?.planet === p.planet && !selected?.isTransit
    ? "border border-orange-300 bg-orange-100 text-orange-800"
    : hovered?.planet === p.planet && !hovered?.isTransit
      ? "border border-orange-200 bg-orange-50 text-orange-700"
      : "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                      }`}
                      title={getPlanetTitle(p)}
                    >
                      {formatPlanetLabel(p)}
                    </button>
                  ))}

                  {shownTransitPlanets.map((p, idx) => (
                    <button
                      key={`transit-${anchor.house}-${p.planet}-${idx}`}
                      type="button"
                      onMouseEnter={() => setHovered(p)}
                      onMouseLeave={() =>
                        setHovered((curr) => (curr?.planet === p.planet && curr?.isTransit ? null : curr))
                      }
                      onClick={() => {
                        setSelected(p);
                        onPlanetClick?.(p);
                      }}
                      className={`${
  compactPlanetLabels
    ? "max-w-[34px] rounded px-1 py-[1px] text-[9px]"
    : "rounded-md px-1.5 py-0.5 text-[10px]"
} font-medium leading-none shadow-sm transition ${
                        highlightSet.has(p.planet)
  ? "border border-indigo-300 bg-indigo-50 text-indigo-700"
  : selected?.planet === p.planet && selected?.isTransit
    ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
    : hovered?.planet === p.planet && hovered?.isTransit
      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                      title={getPlanetTitle(p)}
                    >
                      {formatPlanetLabel(p)}
                    </button>
                  ))}
                </div>

                {showArudhas && houseArudhas.length ? (
                  <div
                    className="mt-1 flex w-full flex-wrap justify-center gap-[2px] opacity-90"
                    style={{ lineHeight: "9px" }}
                  >
                    {houseArudhas.map((label) => {
                      const isAL = label === "AL";
                      const isUL = label === "UL";

                      return (
                        <span
                          key={`${anchor.house}-${label}`}
                          className={
                            isAL
                              ? "rounded bg-fuchsia-100 px-[2px] py-[1px] text-[7px] font-bold text-fuchsia-700"
                              : isUL
                                ? "rounded bg-fuchsia-50 px-[2px] py-[1px] text-[7px] font-semibold text-fuchsia-600"
                                : "rounded bg-fuchsia-50 px-[2px] py-[1px] text-[7px] font-medium text-fuchsia-500"
                          }
                          title={`${label} in ${getHouseSignName(anchor.house, ascSign) ?? "—"}`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                ) : null}

                {showUpagrahas && houseMarkers.length ? (
                  <div
                    className="mt-1 flex w-full flex-wrap justify-center gap-[2px]"
                    style={{ lineHeight: "9px" }}
                  >
                    {houseMarkers.map((marker) => (
                      <span
                        key={`${anchor.house}-${marker.type}-${marker.key}`}
                        className={
                          marker.type === "upagraha"
                            ? "rounded-sm border border-violet-100 bg-violet-50 px-[2px] py-[1px] text-[7px] font-semibold text-violet-700"
                            : "rounded-sm border border-cyan-100 bg-cyan-50 px-[2px] py-[1px] text-[7px] font-semibold text-cyan-700"
                        }
                        title={getMarkerTitle(marker)}
                      >
                        {marker.label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* Professional outer house-aspect rail: outside the chart lines, not inside houses. */}
          {showAspects ? Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
            const rows = aspectsByHouse.get(house) ?? [];
            const aspectAnchor = aspectAnchors[house];

            if (!rows.length || !aspectAnchor) return null;

            return (
              <div
                key={`outer-aspect-${house}`}
                className="pointer-events-none absolute z-30 flex flex-wrap justify-center gap-[3px]"
                style={{
  left: aspectAnchor.left,
  top: aspectAnchor.top,
  width: aspectAnchor.width,
}}
              >
                {rows.map((aspect) => (
  <span
    key={aspect.key}
    className="rounded-full border border-violet-300 bg-violet-50 px-1.5 py-[2px] text-[8px] font-semibold leading-none text-violet-700 shadow-sm"
    title={getAspectTitle(house, aspect)}
  >
    {aspect.label}
  </span>
))}
              </div>
            );
          }) : null}
        </div>
      </div>
        </div>

        
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-700">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-400" /> Planets</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Transits</span>
        {showUpagrahas ? (
          <>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-500" /> Upagrahas</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Shadow Points</span>
          </>
        ) : null}
        {showArudhas ? (
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-fuchsia-400" /> Arudhas</span>
        ) : null}
        {showAspects ? (
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full border border-violet-300 bg-violet-50" /> House Aspects</span>
        ) : null}
        <span>* Retrograde</span>
      </div>

      {showPlanetDetails && activePlanet ? (
        <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-slate-50 p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">{activePlanet?.planet ?? "Planet"}</div>

          <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-slate-900/80 md:grid-cols-4">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-900">Sign</div>
              <div className="mt-1">{activePlanet?.sign ?? "—"}</div>
            </div>

            <div>
  <div className="text-[10px] uppercase tracking-wide text-slate-900">
    Bhava House
  </div>

  <div className="mt-1">
    {activePlanet?.house ?? "—"}
  </div>
</div>

<div>
  <div className="text-[10px] uppercase tracking-wide text-slate-900">
    Rashi House
  </div>

  <div className="mt-1">
    {activePlanet?.rashiHouse ?? activePlanet?.house ?? "—"}
  </div>
</div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-900">Degree</div>
              <div className="mt-1">
                {typeof activePlanet?.degree === "number" ? `${activePlanet.degree.toFixed(2)}°` : "—"}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-900">Retrograde</div>
              <div className="mt-1">{activePlanet?.retrograde ? "Yes" : "No"}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-900">Nakshatra</div>
              <div className="mt-1">{formatNakshatraWithLord(activePlanet?.nakshatra)}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-900">Pada</div>
              <div className="mt-1">{activePlanet?.pada ?? "—"}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-900">Combust</div>
              <div className="mt-1">{activePlanet?.combust ? "Yes" : "No"}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-900">State</div>
              <div className="mt-1">{hovered?.planet === activePlanet?.planet ? "Hovering" : "Selected"}</div>
            </div>
          </div>
          
        </div>
      ) : null}

      {showAbbreviations && (showUpagrahas || showArudhas) ? (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Abbreviations
        </div>

        <div className="grid grid-cols-1 gap-4 text-xs text-slate-700 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <div className="mb-2 font-semibold text-violet-700">Upagrahas</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <span><b>Gk</b> Gulika</span>
              <span><b>Md</b> Mandi</span>
              <span><b>Yg</b> Yamakantaka</span>
              <span><b>Ka</b> Kala</span>
              <span><b>Mr</b> Mrityu</span>
              <span><b>Ap</b> Ardhaprahara</span>
            </div>
          </div>

          <div>
            <div className="mb-2 font-semibold text-cyan-700">Solar Shadow Points</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <span><b>Dh</b> Dhuma</span>
              <span><b>Vy</b> Vyatipata</span>
              <span><b>Pa</b> Parivesha</span>
              <span><b>In</b> Indrachapa</span>
              <span><b>Uk</b> Upaketu</span>
            </div>
          </div>

          <div>
            <div className="mb-2 font-semibold text-fuchsia-700">Arudhas</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <span><b>AL</b> Lagna Arudha</span>
              <span><b>UL</b> Upapada Lagna</span>
              <span><b>A2–A12</b> House Arudhas</span>
            </div>
          </div>
        </div>
      </div>
      ) : null}
</div>
    
  );
}
