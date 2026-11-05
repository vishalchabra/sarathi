"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

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
  ascDegree?: number | null;
    ascendantDetails?: {
    sign?: string | null;
    signNum?: number | null;
    degree?: number | null;
    lon?: number | null;
    nakshatra?: string | null;
    pada?: number | null;
  } | null;
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
placementMode?: "sign" | "house";
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

    { house: 3, x: 158, y: 176, width: 96, minHeight: 112 },
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
    2: "translateY(2px)",
    12: "translateY(2px)",
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
    { house: 2, x: 145, y: 50, width: 82, minHeight: 96 },
    { house: 12, x: 362, y: 50, width: 82, minHeight: 96 },

    { house: 3, x: 80, y: 132, width: 80, minHeight: 96 },
    { house: 1, x: 260, y: 106, width: 98, minHeight: 96 },
    { house: 11, x: 426, y: 132, width: 80, minHeight: 96 },

    { house: 4, x: 158, y: 234, width: 80, minHeight: 96 },
    { house: 10, x: 362, y: 234, width: 80, minHeight: 96 },

    { house: 5, x: 94, y: 324, width: 80, minHeight: 96 },
    { house: 7, x: 260, y: 334, width: 98, minHeight: 96 },
    { house: 9, x: 446, y: 350, width: 76, minHeight: 96 },

    { house: 6, x: 158, y: 396, width: 80, minHeight: 96 },
    { house: 8, x: 390, y: 396, width: 80, minHeight: 96 },
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
    2: "translateY(2px)",
    12: "translateY(2px)",
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
const TECHNICAL_PLACEMENT: Partial<Record<number, "top" | "bottom">> = {
  // Top triangular houses have less vertical room near the lower edge,
  // so keep technical labels above the planet group.
  2: "top",
  12: "top",
};
const HOUSE_CONTENT_SHIFT: Partial<Record<number, string>> = {
  6: "translateY(-4px)",
  8: "translateY(-4px)",
  11: "translateY(-22px)",
  12: "translateY(2px)",
};

const HOUSE_PLANET_WRAPS: Partial<Record<number, string>> = {
  2: "translate(-4px, 14px)",
  12: "translate(4px, 14px)",

  6: "translate(-4px, 0px)",
  8: "translate(24px, 4px)",
  11: "translate(-8px, 0px)",
};

const HOUSE_TECHNICAL_ROW_SHIFTS: Partial<Record<number, string>> = {
  // V4: keep technical labels as an independent layer.
  // This avoids Gk/Md/Arudha labels being hidden behind planet buttons.
  2: "translateY(-2px)",
  12: "translateY(10px)",
  11: "translateY(-2px)",
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

  return `${transitPrefix}${short}`;
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
        : mode === "chalit" && typeof p.house === "number"
          ? p.house
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
function getHouseClipPath(house: number, layout: LayoutConfig) {
  const { x, y, width, height } = layout.outerRect;

  const left = { x, y: y + height / 2 };
  const top = { x: x + width / 2, y };
  const right = { x: x + width, y: y + height / 2 };
  const bottom = { x: x + width / 2, y: y + height };

  const topLeft = { x, y };
  const topRight = { x: x + width, y };
  const bottomLeft = { x, y: y + height };
  const bottomRight = { x: x + width, y: y + height };
  const center = { x: x + width / 2, y: y + height / 2 };

  const midpoint = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const ul = midpoint(top, left);
  const ur = midpoint(top, right);
  const lr = midpoint(right, bottom);
  const ll = midpoint(bottom, left);

  const polygons: Record<number, { x: number; y: number }[]> = {
    1: [top, ur, center, ul],
    2: [topLeft, top, ul],
    3: [topLeft, ul, left],
    4: [left, ll, center, ul],
    5: [bottomLeft, left, ll],
    6: [bottomLeft, ll, bottom],
    7: [bottom, lr, center, ll],
    8: [bottomRight, bottom, lr],
    9: [bottomRight, lr, right],
    10: [right, ur, center, lr],
    11: [topRight, ur, right],
    12: [topRight, top, ur],
  };

  const points = polygons[house];

  if (!points) return "none";

  return `polygon(${points
    .map(p =>
      `${(p.x / layout.frameWidth) * 100}% ${(p.y / layout.frameHeight) * 100}%`
    )
    .join(", ")})`;
}

function getHousePolygon(house: number, layout: LayoutConfig) {
  const { x, y, width, height } = layout.outerRect;

  const left = { x, y: y + height / 2 };
  const top = { x: x + width / 2, y };
  const right = { x: x + width, y: y + height / 2 };
  const bottom = { x: x + width / 2, y: y + height };

  const topLeft = { x, y };
  const topRight = { x: x + width, y };
  const bottomLeft = { x, y: y + height };
  const bottomRight = { x: x + width, y: y + height };
  const center = { x: x + width / 2, y: y + height / 2 };

  const midpoint = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const ul = midpoint(top, left);
  const ur = midpoint(top, right);
  const lr = midpoint(right, bottom);
  const ll = midpoint(bottom, left);

  const polygons: Record<number, { x: number; y: number }[]> = {
    1: [top, ur, center, ul],
    2: [topLeft, top, ul],
    3: [topLeft, ul, left],
    4: [left, ll, center, ul],
    5: [bottomLeft, left, ll],
    6: [bottomLeft, ll, bottom],
    7: [bottom, lr, center, ll],
    8: [bottomRight, bottom, lr],
    9: [bottomRight, lr, right],
    10: [right, ur, center, lr],
    11: [topRight, ur, right],
    12: [topRight, top, ur],
  };

  return polygons[house] ?? [];
}

function getHouseCentroid(house: number, layout: LayoutConfig) {
  const polygon = getHousePolygon(house, layout);
  if (polygon.length < 3) {
    return { x: layout.outerRect.x + layout.outerRect.width / 2, y: layout.outerRect.y + layout.outerRect.height / 2 };
  }

  // Area-weighted polygon centroid (works for both triangular and diamond houses).
  let twiceArea = 0;
  let x = 0;
  let y = 0;

  for (let i = 0; i < polygon.length; i += 1) {
    const current = polygon[i];
    const next = polygon[(i + 1) % polygon.length];
    const cross = current.x * next.y - next.x * current.y;
    twiceArea += cross;
    x += (current.x + next.x) * cross;
    y += (current.y + next.y) * cross;
  }

  if (Math.abs(twiceArea) < 0.000001) {
    return {
      x: polygon.reduce((sum, point) => sum + point.x, 0) / polygon.length,
      y: polygon.reduce((sum, point) => sum + point.y, 0) / polygon.length,
    };
  }

  return {
    x: x / (3 * twiceArea),
    y: y / (3 * twiceArea),
  };
}

function isPointInsidePolygon(
  point: { x: number; y: number },
  polygon: { x: number; y: number }[]
) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];

    const crosses =
      (a.y > point.y) !== (b.y > point.y) &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;

    if (crosses) inside = !inside;
  }

  return inside;
}

function getHouseSafeRect(house: number, layout: LayoutConfig) {
  const polygon = getHousePolygon(house, layout);

  if (polygon.length < 3) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }

  const minX = Math.min(...polygon.map(p => p.x));
  const maxX = Math.max(...polygon.map(p => p.x));
  const minY = Math.min(...polygon.map(p => p.y));
  const maxY = Math.max(...polygon.map(p => p.y));

  // Determine polygon orientation.
  let signedArea = 0;

  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    signedArea += a.x * b.y - b.x * a.y;
  }

  const orientation = signedArea >= 0 ? 1 : -1;
  const margin = 9;

  // Each edge defines an inward half-plane.
  const edges = polygon.map((a, i) => {
    const b = polygon[(i + 1) % polygon.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const nx = orientation * dy;
    const ny = orientation * -dx;

    return {
      nx,
      ny,
      c:
        orientation * (dy * a.x - dx * a.y) -
        margin * Math.hypot(nx, ny),
    };
  });

  let bestArea = 0;
  let bestRect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };

  const maxHalfWidth = (maxX - minX) / 2;
  const maxHalfHeight = (maxY - minY) / 2;

  // Search different rectangle centres throughout the house.
  for (let cx = minX; cx <= maxX; cx += 4) {
    for (let cy = minY; cy <= maxY; cy += 4) {

      // Test progressively wider rectangles.
      for (
        let halfWidth = 14;
        halfWidth <= maxHalfWidth;
        halfWidth += 4
      ) {
        let allowedHalfHeight = maxHalfHeight;
        let valid = true;

        for (const edge of edges) {
          const remaining =
            edge.c -
            edge.nx * cx -
            edge.ny * cy -
            Math.abs(edge.nx) * halfWidth;

          if (Math.abs(edge.ny) < 0.000001) {
            if (remaining < 0) {
              valid = false;
              break;
            }
          } else {
            allowedHalfHeight = Math.min(
              allowedHalfHeight,
              remaining / Math.abs(edge.ny)
            );
          }
        }

        if (!valid || allowedHalfHeight < 14) continue;

        const halfHeight =
          Math.floor(allowedHalfHeight / 2) * 2;

        const width = halfWidth * 2;
        const height = halfHeight * 2;
        const area = width * height;

        if (area > bestArea) {
          bestArea = area;

          bestRect = {
            left: cx - halfWidth,
            top: cy - halfHeight,
            width,
            height,
          };
        }
      }
    }
  }

  return bestRect;
}

type DynamicPlanetLayout = {
  columns: number;
  density: "normal" | "medium" | "tight";
  columnGap: number;
  rowGap: number;
  buttonPadding: string;
  buttonMinHeight: number;
  degreeFontSize: number;
  labelFontSize: number;
  nakshatraFontSize: number;
};

/** Calculate a readable planet grid from each house's actual safe area. */
function calculateHousePlanetLayout(
  totalPlanets: number,
  width: number,
  height: number,
  options: {
    showDegrees: boolean;
    showNakshatra: boolean;
    compact: boolean;
    isAscHouse: boolean;
    hasAscDegree: boolean;
    technicalBadgeCount: number;
  }
): DynamicPlanetLayout {
  const safeWidth = Math.max(24, width);
  const safeHeight = Math.max(24, height);

  if (totalPlanets <= 0) {
    return {
      columns: 1, density: "normal", columnGap: 3, rowGap: 3,
      buttonPadding: "2px 3px", buttonMinHeight: 18,
      degreeFontSize: 8, labelFontSize: 9, nakshatraFontSize: 7,
    };
  }

  const headerHeight = 17 + (options.isAscHouse && options.hasAscDegree ? 13 : 0);
  const technicalHeight = options.technicalBadgeCount > 0 ? 13 : 0;
  const availableGridHeight = Math.max(16, safeHeight - headerHeight - technicalHeight - 10);
  const candidates: Array<{
    columns: number; density: "normal" | "medium" | "tight";
    columnGap: number; rowGap: number; score: number;
  }> = [];

  for (let columns = 1; columns <= Math.min(totalPlanets, 6); columns += 1) {
    const columnGap = columns >= 4 ? 2 : 3;
    const cardWidth = (safeWidth - columnGap * (columns - 1)) / columns;
    if (cardWidth < 36) continue;

    const rows = Math.ceil(totalPlanets / columns);
    const density: "normal" | "medium" | "tight" =
      options.compact || cardWidth < 38 || totalPlanets >= 6
        ? "tight"
        : options.showNakshatra || totalPlanets >= 3
          ? "medium"
          : "normal";

    const cardHeight =
      (options.showDegrees ? 8 : 0) +
      (density === "tight" ? 8 : 9) +
      (options.showNakshatra ? 8 : 0) +
      (density === "tight" ? 2 : 4);
    const rowGap = rows >= 3 ? 1 : 3;
    const requiredHeight = rows * cardHeight + (rows - 1) * rowGap;
    const overflow = Math.max(0, requiredHeight - availableGridHeight);
    const score = overflow * 100 + Math.max(0, 34 - cardWidth) * 20 +
      rows * 2 + Math.abs(cardWidth - 46) * 0.03;

    candidates.push({ columns, density, columnGap, rowGap, score });
  }

  if (!candidates.length) {
    return {
      columns: 1, density: "tight", columnGap: 2, rowGap: 1,
      buttonPadding: "1px 2px",
      buttonMinHeight: Math.max(14, Math.min(18, safeHeight / totalPlanets)),
      degreeFontSize: 7, labelFontSize: 8, nakshatraFontSize: 6,
    };
  }

  candidates.sort((a, b) => a.score - b.score);
  const best = candidates[0];
  const tight = best.density === "tight";

  return {
    columns: best.columns,
    density: best.density,
    columnGap: best.columnGap,
    rowGap: best.rowGap,
    buttonPadding: tight ? "1px 2px" : "2px 3px",
    buttonMinHeight: tight ? 15 : 18,
    degreeFontSize: tight ? 7 : 8,
    labelFontSize: tight ? 8 : 9,
    nakshatraFontSize: tight ? 6 : 7,
  };
}


/**
 * For crowded triangular houses, use a content band parallel to the triangle's
 * widest axis-aligned edge. This gives dense planet groups more usable space
 * without allowing cards to escape the actual house polygon (the parent is
 * still clipped to that polygon).
 */
function getHouseContentRect(house: number, layout: LayoutConfig, totalPlanets: number) {
  const polygon = getHousePolygon(house, layout);
  if (totalPlanets < 5 || polygon.length !== 3) return getHouseSafeRect(house, layout);

  const centroid = {
    x: polygon.reduce((sum, point) => sum + point.x, 0) / polygon.length,
    y: polygon.reduce((sum, point) => sum + point.y, 0) / polygon.length,
  };

  const axisAlignedEdges = polygon.map((a, index) => {
    const b = polygon[(index + 1) % polygon.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const horizontal = Math.abs(dy) < 0.001;
    const vertical = Math.abs(dx) < 0.001;
    if (!horizontal && !vertical) return null;

    const length = Math.hypot(dx, dy);
    const altitude = Math.max(
      ...polygon
        .filter((_, pointIndex) => pointIndex !== index && pointIndex !== (index + 1) % polygon.length)
        .map((point) => horizontal ? Math.abs(point.y - a.y) : Math.abs(point.x - a.x))
    );

    return { a, b, horizontal, length, altitude };
  }).filter(Boolean) as Array<{
    a: { x: number; y: number };
    b: { x: number; y: number };
    horizontal: boolean;
    length: number;
    altitude: number;
  }>;

  if (!axisAlignedEdges.length) return getHouseSafeRect(house, layout);

  axisAlignedEdges.sort((a, b) => b.length - a.length);
  const base = axisAlignedEdges[0];
  if (base.altitude < 80) return getHouseSafeRect(house, layout);

  const inset = 12;
  const bandSize = Math.min(112, base.altitude * 0.42);
  const depth = Math.min(12, base.altitude * 0.05);
  const farDepth = depth + bandSize;
  const usableRatio = Math.max(0.28, 1 - farDepth / base.altitude);
  const usableBase = Math.max(36, base.length * usableRatio - inset * 2);

  if (base.horizontal) {
    const baseY = base.a.y;
    const inward = centroid.y < baseY ? -1 : 1;
    return {
      left: (base.a.x + base.b.x) / 2 - usableBase / 2,
      top: inward < 0 ? baseY - farDepth : baseY + depth,
      width: usableBase,
      height: bandSize,
    };
  }

  const baseX = base.a.x;
  const inward = centroid.x < baseX ? -1 : 1;
  return {
    left: inward < 0 ? baseX - farDepth : baseX + depth,
    top: (base.a.y + base.b.y) / 2 - usableBase / 2,
    width: bandSize,
    height: usableBase,
  };
}


// Place technical badges inside their house before placing planets.
// Each badge has a dedicated rectangle; planet cards avoid these rectangles.
type TechnicalBadge = ReturnType<typeof getTechnicalBadges>[number];
type TechnicalBadgePlacement = { left: number; top: number; width: number; height: number };

function getTechnicalBadgePlacements(
  house: number,
  layout: LayoutConfig,
  badges: TechnicalBadge[],
  isAscHouse: boolean,
  hasAscDegree: boolean
): TechnicalBadgePlacement[] {
  if (!badges.length) return [];
  const polygon = getHousePolygon(house, layout);
  const center = getHouseCentroid(house, layout);
  const labelWidth = isAscHouse ? (hasAscDegree ? 74 : 42) : 34;
  const labelHeight = isAscHouse ? (hasAscDegree ? 48 : 34) : 28;
  const labelRect = { left: center.x - labelWidth / 2, top: center.y - labelHeight / 2, width: labelWidth, height: labelHeight };
  const overlaps = (a: TechnicalBadgePlacement, b: TechnicalBadgePlacement, gap = 2) =>
    a.left < b.left + b.width + gap && a.left + a.width + gap > b.left &&
    a.top < b.top + b.height + gap && a.top + a.height + gap > b.top;
  const minX = Math.min(...polygon.map(p => p.x));
  const maxX = Math.max(...polygon.map(p => p.x));
  const minY = Math.min(...polygon.map(p => p.y));
  const maxY = Math.max(...polygon.map(p => p.y));
  const placed: TechnicalBadgePlacement[] = [];
  for (const badge of badges) {
    const width = Math.max(23, badge.label.length * 6 + 10);
    const height = 15;
    const candidates: Array<TechnicalBadgePlacement & { score: number }> = [];
    for (let top = minY + 3; top + height < maxY - 3; top += 3) {
      for (let left = minX + 3; left + width < maxX - 3; left += 3) {
        const rect = { left, top, width, height };
        const corners = [
          { x: left + 2, y: top + 2 }, { x: left + width - 2, y: top + 2 },
          { x: left + 2, y: top + height - 2 }, { x: left + width - 2, y: top + height - 2 }
        ];
        if (!corners.every(p => isPointInsidePolygon(p, polygon))) continue;
        if (overlaps(rect, labelRect, 3) || placed.some(p => overlaps(rect, p, 3))) continue;
        // Prefer the house edge, leaving the centre available for planets.
        const edgePreference = TECHNICAL_PLACEMENT[house] === "top" ? top : -top;
        const score = edgePreference * 2 + Math.abs(left + width / 2 - center.x) * 0.35;
        candidates.push({ ...rect, score });
      }
    }
    candidates.sort((a, b) => a.score - b.score);
    if (candidates.length) {
      const { score: _score, ...rect } = candidates[0];
      placed.push(rect);
    }
  }
  return placed;
}

type PlanetCardPlacement = { left: number; top: number; width: number; height: number };

/**
 * Rule-based planet placement:
 * - Uses the real polygon for each house, not fixed house coordinates.
 * - Reserves a generous central zone for the house number/Ascendant label.
 * - Packs multiple cards across each valid row (not just one card per row).
 * - Tries comfortable card sizes first and only compacts when the geometry
 *   genuinely requires it.
 */
function getPlanetCardPlacements(
  house: number,
  layout: LayoutConfig,
  count: number,
  options: {
    showDegrees: boolean;
    showNakshatra: boolean;
    isAscHouse: boolean;
    hasAscDegree: boolean;
    reservedRects?: TechnicalBadgePlacement[];
  }
): {
  placements: PlanetCardPlacement[];
  density: "normal" | "medium" | "tight";
  degreeFontSize: number;
  labelFontSize: number;
  nakshatraFontSize: number;
} {
  const emptyResult = {
    placements: [] as PlanetCardPlacement[],
    density: "normal" as const,
    degreeFontSize: 8,
    labelFontSize: 9,
    nakshatraFontSize: 7,
  };

  if (count <= 0) return emptyResult;

  const polygon = getHousePolygon(house, layout);
  if (polygon.length < 3) return emptyResult;

  const minX = Math.min(...polygon.map((p) => p.x));
  const maxX = Math.max(...polygon.map((p) => p.x));
  const minY = Math.min(...polygon.map((p) => p.y));
  const maxY = Math.max(...polygon.map((p) => p.y));
  const center = getHouseCentroid(house, layout);

  // Keep house numbers and the Ascendant label visually clear.
  // Reserve only the actual space required by the centred house label.
const labelWidth = options.isAscHouse
  ? (options.hasAscDegree ? 74 : 42)
  : 34;

const labelHeight = options.isAscHouse
  ? (options.hasAscDegree ? 48 : 34)
  : 28;
  const labelRect = {
    left: center.x - labelWidth / 2,
    right: center.x + labelWidth / 2,
    top: center.y - labelHeight / 2,
    bottom: center.y + labelHeight / 2,
  };

  const fitsPolygon = (left: number, top: number, width: number, height: number) => {
    // Check all four corners with a small inset so borders never touch/cross
    // the house lines. The parent house layer also clips as a final safeguard.
    const inset = 2;
    const corners = [
      { x: left + inset, y: top + inset },
      { x: left + width - inset, y: top + inset },
      { x: left + inset, y: top + height - inset },
      { x: left + width - inset, y: top + height - inset },
    ];
    return corners.every((point) => isPointInsidePolygon(point, polygon));
  };

  let best: PlanetCardPlacement[] = [];
  let bestWidth = 36;
  let bestHeight = 22;

  // The wider candidates preserve the premium appearance. Smaller candidates
  // are considered only when the shape or planet count leaves no alternative.
  for (let cardWidth = 48; cardWidth >= 18; cardWidth -= 2) {
    const ultraCompact = cardWidth <= 24;
const compact = cardWidth <= 36 || count >= 7;

const degreeLine = options.showDegrees
  ? ultraCompact ? 6 : compact ? 7 : 8
  : 0;

const labelLine = ultraCompact ? 6 : compact ? 8 : 9;

const nakshatraLine = options.showNakshatra
  ? ultraCompact ? 5 : compact ? 6 : 7
  : 0;

const cardHeight =
  (ultraCompact ? 2 : 4) +
  degreeLine +
  labelLine +
  nakshatraLine;

const gap = cardWidth <= 22 ? 1 : cardWidth <= 34 ? 2 : 4;

const rowStep = cardHeight + (count >= 7 ? 2 : 4);

    let bestForWidth: PlanetCardPlacement[] = [];
    let bestOffsetScore = Number.POSITIVE_INFINITY;

    // Shift the row grid in small increments to find the best fit for
    // irregular triangles and diamonds.
    for (let offset = 0; offset < rowStep; offset += 2) {
      const rows: PlanetCardPlacement[][] = [];

      for (let top = minY + offset; top + cardHeight <= maxY; top += rowStep) {
        const validXs: number[] = [];

        for (let left = minX + 2; left + cardWidth <= maxX - 2; left += 2) {
          const overlapsLabel =
            left < labelRect.right &&
            left + cardWidth > labelRect.left &&
            top < labelRect.bottom &&
            top + cardHeight > labelRect.top;

          const overlapsTechnical = (options.reservedRects ?? []).some(rect =>
            left < rect.left + rect.width + 2 && left + cardWidth + 2 > rect.left &&
            top < rect.top + rect.height + 2 && top + cardHeight + 2 > rect.top
          );
          if (!overlapsLabel && !overlapsTechnical && fitsPolygon(left, top, cardWidth, cardHeight)) {
            validXs.push(left);
          }
        }

        if (!validXs.length) continue;

        // Split the row into continuous usable horizontal runs.
        const runs: Array<[number, number]> = [];
        let runStart = validXs[0];
        let previous = validXs[0];

        for (let i = 1; i <= validXs.length; i += 1) {
          const current = validXs[i];

          if (i < validXs.length && current - previous <= 2.1) {
            previous = current;
            continue;
          }

          runs.push([runStart, previous]);

          if (i < validXs.length) runStart = current;
          previous = current;
        }

        const rowSlots: PlanetCardPlacement[] = [];

        for (const [start, end] of runs) {
          // `end` is the last valid LEFT coordinate, not the right edge.
          // Advancing by cardWidth + gap lets several cards occupy one run.
          for (let left = start; left <= end + 0.5; left += cardWidth + gap) {
            if (fitsPolygon(left, top, cardWidth, cardHeight)) {
              rowSlots.push({
                left,
                top,
                width: cardWidth,
                height: cardHeight,
              });
            }
          }
        }

        // Prefer slots nearer the house centre, while keeping the label zone
        // empty. This gives balanced layouts on both sides of the label.
        if (rowSlots.length) {
          rowSlots.sort(
            (a, b) =>
              Math.abs(a.left + a.width / 2 - center.x) -
              Math.abs(b.left + b.width / 2 - center.x)
          );
          rows.push(rowSlots);
        }
      }

      // Fill rows nearest the centre first, then move outward symmetrically.
      rows.sort((a, b) => {
        const ay = a[0].top + cardHeight / 2;
        const by = b[0].top + cardHeight / 2;
        return Math.abs(ay - center.y) - Math.abs(by - center.y);
      });

      const candidate = rows.flat().slice(0, count);
      const score =
        candidate.length === count
          ? candidate.reduce(
              (sum, item) =>
                sum +
                Math.abs(item.top + item.height / 2 - center.y) * 1.2 +
                Math.abs(item.left + item.width / 2 - center.x) * 0.15,
              0
            )
          : Number.POSITIVE_INFINITY;

      if (
        candidate.length > bestForWidth.length ||
        (candidate.length === bestForWidth.length && score < bestOffsetScore)
      ) {
        bestForWidth = candidate;
        bestOffsetScore = score;
      }
    }

    if (bestForWidth.length > best.length) {
      best = bestForWidth;
      bestWidth = cardWidth;
      bestHeight = cardHeight;
    }

    // Stop at the largest card width that accommodates every planet.
    if (bestForWidth.length >= count) {
      best = bestForWidth;
      bestWidth = cardWidth;
      bestHeight = cardHeight;
      break;
    }
  }

  const density =
    bestWidth <= 34 || count >= 7
      ? "tight"
      : count >= 3 || options.showNakshatra
        ? "medium"
        : "normal";

  return {
    placements: best,
    density,
    degreeFontSize:
  bestWidth <= 22 ? 5 :
  bestWidth <= 30 ? 6 :
  bestWidth <= 36 ? 7 : 8,

labelFontSize:
  bestWidth <= 22 ? 6 :
  bestWidth <= 30 ? 7 :
  density === "tight" ? 8 : 9,

nakshatraFontSize:
  bestWidth <= 22 ? 5 :
  bestWidth <= 30 ? 5 :
  bestWidth <= 36 ? 6 : 7,
  };
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
function getTechnicalBadges(
  houseArudhas: string[],
  houseMarkers: ChartMarker[],
  showArudhas: boolean,
  showUpagrahas: boolean
) {
  const badges: {
    key: string;
    label: string;
    type: "arudha" | "upagraha" | "shadow";
    title?: string;
  }[] = [];

  if (showArudhas) {
    for (const label of houseArudhas) {
      badges.push({
        key: `arudha-${label}`,
        label,
        type: "arudha",
      });
    }
  }

  if (showUpagrahas) {
    for (const marker of houseMarkers) {
      badges.push({
        key: `${marker.type}-${marker.key}`,
        label: marker.label,
        type: marker.type,
        title: getMarkerTitle(marker),
      });
    }
  }

  return badges;
}
function formatPlanetDegree(degree?: number | null) {
  if (typeof degree !== "number") return null;
  return `${degree.toFixed(1)}°`;
}
function getNakshatraShort(nakshatra?: string | null) {
  if (!nakshatra) return null;

  const map: Record<string, string> = {
    Ashwini: "As",
    Bharani: "Bh",
    Krittika: "Kr",
    Rohini: "Ro",
    Mrigashira: "Mr",
    Ardra: "Ar",
    Punarvasu: "Pu",
    Pushya: "Ps",
    Ashlesha: "Al",
    Magha: "Mg",
    "Purva Phalguni": "PF",
    "Uttara Phalguni": "UF",
    Hasta: "Ha",
    Chitra: "Ch",
    Swati: "Sw",
    Vishakha: "Vi",
    Anuradha: "An",
    Jyeshtha: "Jy",
    Mula: "Mu",
    "Purva Ashadha": "PA",
    "Uttara Ashadha": "UA",
    Shravana: "Sh",
    Dhanishta: "Dh",
    Shatabhisha: "SB",
    "Purva Bhadrapada": "PB",
    "Uttara Bhadrapada": "UB",
    Revati: "Re",
  };

  return map[nakshatra] ?? nakshatra.slice(0, 2);
}

function getPlanetButtonDensity(
  totalPlanets: number,
  showNakshatra: boolean,
  compact: boolean
) {
  if (compact) return "tight";
  if (showNakshatra || totalPlanets >= 3) return "medium";
  return "normal";
}

function getPlanetButtonSizeClass(
  density: "normal" | "medium" | "tight"
) {
  if (density === "tight") {
    return "min-w-[38px] rounded-md px-1 py-[3px] text-[10px]";
  }

  if (density === "medium") {
    return "min-w-[42px] rounded-md px-1 py-[3px] text-[10px]";
  }

  return "min-w-[44px] rounded-md px-1.5 py-[3px] text-[11px]";
}

function getPlanetDegreeClass(
  isTransitPlanet: boolean,
  density: "normal" | "medium" | "tight"
) {
  return `text-[9px] mt-[2px] font-semibold ${
    isTransitPlanet ? "text-emerald-700" : "text-orange-700"
  }`;
}

function getNakshatraClass(
  density: "normal" | "medium" | "tight"
) {
  return "text-[8px] mt-[2px] font-medium text-slate-500";
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
function ordinal(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return `${n}st`;
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`;

  return `${n}th`;
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
function getTransitSambandh(
  natalPlanet: ChartPlanet,
  transitPlanets: ChartPlanet[]
) {
  const transitMatch = transitPlanets.find(
    (p) => p.planet === natalPlanet.planet
  );

  if (!transitMatch) return null;

  const natalHouse =
    natalPlanet.rashiHouse ?? natalPlanet.house ?? null;

  const transitHouse =
    transitMatch.rashiHouse ?? transitMatch.house ?? null;

  if (!natalHouse || !transitHouse) return null;

  const sambandh =
    ((transitHouse - natalHouse + 12) % 12) + 1;

  return {
    natalHouse,
    transitHouse,
    sambandh,
  };
}
export default function MediumNorthIndianChart({
  title = "North Indian Chart",
  ascSign,
  ascDegree = null,
  ascendantDetails = null,
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
placementMode = "sign",
}: MediumNorthIndianChartProps) {
  
  const [selected, setSelected] = useState<ChartPlanet | null>(null);
  const [hovered, setHovered] = useState<ChartPlanet | null>(null);
  const [showAscendantDetails, setShowAscendantDetails] = useState(false);
  const [showDegreesOnChart, setShowDegreesOnChart] = useState(true);
  const [showNakshatraOnChart, setShowNakshatraOnChart] = useState(false);
  const layout = useMemo(() => getLayoutConfig(title, layoutVariant), [title, layoutVariant]);
  const chartBoxRef = useRef<HTMLDivElement | null>(null);
const [chartScale, setChartScale] = useState(1);


useEffect(() => {
  const el = chartBoxRef.current;
  if (!el) return;

  const updateScale = () => {
  const availableWidth = el.clientWidth;

  const nextScale = Math.min(
    1.5,
    availableWidth / layout.frameWidth
  );

  setChartScale(nextScale);
};

  updateScale();

  const observer = new ResizeObserver(updateScale);
  observer.observe(el);

  return () => observer.disconnect();
}, [layout.frameWidth]);

  const pct = (value: number, total: number) => `${(value / total) * 100}%`;
  const displayPlanets = useMemo(() => {
  if (placementMode === "house") {
    return planets.map((p) => ({
      ...p,
      displayHouse: p.house,
    }));
  }

  return planets;
}, [planets, placementMode]);

const planetsByHouse = useMemo(
  () => getPlanetsByHouse(displayPlanets, mode),
  [displayPlanets, mode]
);
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
  const transitSambandh =
  activePlanet && !activePlanet.isTransit
    ? getTransitSambandh(activePlanet, transitPlanets)
    : null;
  const highlightSet = new Set(highlightPlanets.map(String));
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">Click any planet to view detailed information.</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-900">
  <div>
    Ascendant:{" "}
    <span className="font-semibold text-[color:var(--primary)]">
      {getSignNumber(ascSign)}
    </span>
  </div>

  <label className="inline-flex items-center gap-2 text-xs text-slate-700">
    <input
      type="checkbox"
      checked={showDegreesOnChart}
      onChange={(e) => setShowDegreesOnChart(e.target.checked)}
      className="h-3.5 w-3.5 rounded border-slate-300"
    />
    Degrees
  </label>

  <label className="inline-flex items-center gap-2 text-xs text-slate-700">
    <input
      type="checkbox"
      checked={showNakshatraOnChart}
      onChange={(e) => setShowNakshatraOnChart(e.target.checked)}
      className="h-3.5 w-3.5 rounded border-slate-300"
    />
    Nakshatra
  </label>
</div>
      </div>

      <div className="mt-4">
        <div className="min-w-0">
      <div ref={chartBoxRef} className="mt-4 w-full overflow-hidden">
 <div
  className="relative mx-auto overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm"
  style={{
    width: "100%",
    height: layout.frameHeight * chartScale,
  }}
>
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: layout.frameWidth,
      height: layout.frameHeight,
      transform: `scale(${chartScale})`,
      transformOrigin: "top left",
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
            const shownPlanets = [...housePlanets, ...houseTransitPlanets];
            const isAscHouse = anchor.house === 1;
            const houseLabel = getHouseSignNumber(anchor.house, ascSign);
            const allForTitle = [...housePlanets, ...houseTransitPlanets];
            const houseArudhas = arudhasByHouse.get(anchor.house) ?? [];
            const houseMarkers = markersByHouse.get(anchor.house) ?? [];
            const technicalBadges = getTechnicalBadges(
  houseArudhas,
  houseMarkers,
  showArudhas,
  showUpagrahas
);

const technicalPlacements = getTechnicalBadgePlacements(
  anchor.house, layout, technicalBadges, isAscHouse,
  typeof ascDegree === "number" && Number.isFinite(ascDegree)
);

const planetLayout = getPlanetCardPlacements(
  anchor.house,
  layout,
  shownPlanets.length,
  {
    showDegrees: showDegreesOnChart,
    showNakshatra: showNakshatraOnChart,
    isAscHouse,
    hasAscDegree: typeof ascDegree === "number" && Number.isFinite(ascDegree),
    reservedRects: technicalPlacements,
  }
);
const planetDensity = planetLayout.density;

            const houseSarva = sarvaAshtakvarga?.[anchor.house - 1];
            const houseCenter = getHouseCentroid(anchor.house, layout);
            return (
<div
  key={anchor.house}
  className="absolute inset-0 pointer-events-none"
  style={{
    clipPath: getHouseClipPath(anchor.house, layout),
    WebkitClipPath: getHouseClipPath(anchor.house, layout),
  }}
>
        {/* House number is positioned independently at the true geometric centre. */}
        <div
          className="absolute z-20 flex flex-col items-center justify-center pointer-events-none"
          style={{
            left: houseCenter.x,
            top: houseCenter.y,
            transform: "translate(-50%, -50%)",
            minWidth: "24px",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          <div
            className={`text-[15px] font-semibold leading-none ${
              isAscHouse ? "text-indigo-700" : "text-slate-700"
            }`}
          >
            {houseLabel}
            {typeof houseSarva === "number" ? (
              <span className="ml-1 text-[9px] font-medium text-slate-400">
                {houseSarva}
              </span>
            ) : null}
          </div>
          {isAscHouse && showDegreesOnChart && typeof ascDegree === "number" && Number.isFinite(ascDegree) ? (
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setHovered(null);
                setShowAscendantDetails(true);
              }}
              className="pointer-events-auto mt-1 cursor-pointer rounded px-1 text-[10px] font-semibold leading-none text-indigo-700 hover:bg-indigo-50 hover:underline"
              title="Click to view Ascendant details"
            >
              Asc {ascDegree.toFixed(2)}°
            </button>
          ) : null}
        </div>

        {shownPlanets.map((p, idx) => {
          const placement = planetLayout.placements[idx];
          if (!placement) return null;
          const isTransitPlanet = !!p.isTransit;
          const isActive = selected?.planet === p.planet && selected?.isTransit === p.isTransit;
          const isHovered = hovered?.planet === p.planet && hovered?.isTransit === p.isTransit;

          return (
            <button
              key={`${isTransitPlanet ? "transit" : "natal"}-${anchor.house}-${p.planet}-${idx}`}
              type="button"
              style={{
                position: "absolute",
                left: placement.left,
                top: placement.top,
                width: placement.width,
                height: placement.height,
                minWidth: 0,
                minHeight: 0,
                padding: "1px 1px",
                lineHeight: 1,
                borderRadius: "6px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                boxSizing: "border-box",
                textAlign: "center",
                zIndex: isActive ? 15 : 10,
                outline: p.retrograde ? "2.5px solid #0ea5e9" : "none",
                outlineOffset: "-1px",
              }}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered((curr) =>
                curr?.planet === p.planet && curr?.isTransit === p.isTransit ? null : curr
              )}
           onClick={() => {
  setShowAscendantDetails(false);
  setHovered(null);
  setSelected(p);
  onPlanetClick?.(p);
}}
              className={`pointer-events-auto cursor-pointer inline-flex flex-col items-center justify-center border font-medium leading-none transition-colors ${
                highlightSet.has(p.planet)
                  ? "border-indigo-400 bg-indigo-100 text-indigo-900"
                  : p.isSynastryOverlay
                    ? "border-violet-400 bg-violet-100 text-violet-900"
                    : isTransitPlanet
                      ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                      : "border-[#E7B5A5] bg-[#FBE9E2] text-[#451A12] font-extrabold"
              } ${isActive ? "border-indigo-500 ring-1 ring-indigo-300" : isHovered ? "brightness-95" : "hover:brightness-95"}`}
              title={getPlanetTitle(p)}
            >
              <span className="flex flex-col items-center leading-none">
                {showDegreesOnChart && typeof p.degree === "number" ? (
                  <span
                    className={getPlanetDegreeClass(isTransitPlanet, planetDensity)}
                    style={{ fontSize: `${planetLayout.degreeFontSize}px`, marginTop: 0, lineHeight: `${planetLayout.degreeFontSize}px` }}
                  >
                    {p.degree.toFixed(1)}°
                  </span>
                ) : null}
                <span className="whitespace-nowrap font-semibold" style={{ fontSize: `${planetLayout.labelFontSize}px`, lineHeight: `${planetLayout.labelFontSize}px` }}>
                  {formatPlanetLabel(p)}
                </span>
                {showNakshatraOnChart && getNakshatraShort(p.nakshatra) ? (
                  <span className={getNakshatraClass(planetDensity)} style={{ fontSize: `${planetLayout.nakshatraFontSize}px`, lineHeight: `${planetLayout.nakshatraFontSize}px` }}>
                    {getNakshatraShort(p.nakshatra)}
                  </span>
                ) : null}
              </span>
                        </button>
          );
        })}
      </div>
    );
  })}

{/* Technical labels use reserved, collision-free house positions. */}
{layout.anchors.map((anchor) => {
  const badges = getTechnicalBadges(
    arudhasByHouse.get(anchor.house) ?? [],
    markersByHouse.get(anchor.house) ?? [],
    showArudhas,
    showUpagrahas
  );
  const positions = getTechnicalBadgePlacements(
    anchor.house, layout, badges, anchor.house === 1,
    typeof ascDegree === "number" && Number.isFinite(ascDegree)
  );
  return badges.map((badge, index) => {
    const pos = positions[index];
    if (!pos) return null;
    return (
      <span
        key={`technical-${anchor.house}-${badge.key}`}
        title={badge.title ?? badge.label}
        className={`pointer-events-none absolute z-20 flex items-center justify-center rounded border text-[9px] font-bold leading-none ${
          badge.type === "arudha"
            ? "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-800"
            : badge.type === "upagraha"
              ? "border-violet-300 bg-violet-100 text-violet-800"
              : "border-cyan-300 bg-cyan-100 text-cyan-800"
        }`}
        style={{ left: pos.left, top: pos.top, width: pos.width, height: pos.height }}
      >
        {badge.label}
      </span>
    );
  });
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
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded border-2 border-sky-400 bg-orange-50 text-[7px] font-semibold text-orange-700">
            P
          </span>
          Retrograde Border
        </span>
      </div>

{showPlanetDetails && showAscendantDetails && ascendantDetails ? (
  <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-slate-50 p-4 shadow-sm">
    <div className="text-sm font-semibold text-slate-900">
      Ascendant (Lagna)
    </div>

    <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-slate-900/80 md:grid-cols-4">
      <div>
        <div className="text-[10px] uppercase tracking-wide">Sign</div>
        <div className="mt-1">{ascendantDetails.sign ?? "—"}</div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wide">Degree</div>
        <div className="mt-1">
          {typeof ascendantDetails.degree === "number"
            ? `${ascendantDetails.degree.toFixed(2)}°`
            : "—"}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wide">Sign Lord</div>
        <div className="mt-1">
          {({
            Aries: "Mars",
            Taurus: "Venus",
            Gemini: "Mercury",
            Cancer: "Moon",
            Leo: "Sun",
            Virgo: "Mercury",
            Libra: "Venus",
            Scorpio: "Mars",
            Sagittarius: "Jupiter",
            Capricorn: "Saturn",
            Aquarius: "Saturn",
            Pisces: "Jupiter",
          } as Record<string, string>)[ascendantDetails.sign ?? ""] ?? "—"}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wide">House</div>
        <div className="mt-1">1</div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wide">Nakshatra</div>
        <div className="mt-1">
          {ascendantDetails.nakshatra ?? "—"}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wide">
          Nakshatra Lord
        </div>
        <div className="mt-1">
          {({
            Ke: "Ketu",
            Ve: "Venus",
            Su: "Sun",
            Mo: "Moon",
            Ma: "Mars",
            Ra: "Rahu",
            Ju: "Jupiter",
            Sa: "Saturn",
            Me: "Mercury",
          } as Record<string, string>)[
            NAKSHATRA_LORD_SHORT[ascendantDetails.nakshatra ?? ""]
          ] ?? "—"}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wide">Pada</div>
        <div className="mt-1">
          {ascendantDetails.pada ?? "—"}
        </div>
      </div>
    </div>
  </div>
) : null}

      {activePlanet ? (
        <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-slate-50 p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">{activePlanet?.planet ?? "Planet"}</div>

          <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-slate-900/80 md:grid-cols-4">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-900">Sign</div>
              <div className="mt-1">{activePlanet?.sign ?? "—"}</div>
            </div>

            <div>
  <div className="text-[10px] uppercase tracking-wide text-slate-900">
    Transit Sambandh
  </div>

  <div className="mt-1">
    {transitSambandh
      ? `${ordinal(transitSambandh.sambandh)} (H${transitSambandh.natalHouse} → H${transitSambandh.transitHouse})`
      : "—"}
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
    </div>
  );
}
