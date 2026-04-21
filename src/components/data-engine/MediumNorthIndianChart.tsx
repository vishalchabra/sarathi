"use client";

import { useMemo, useState } from "react";

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
  isTransit?: boolean;
};

type ArudhaMap = Record<string, { sign: string }>;
type LayoutVariant = "auto" | "primary" | "secondary";

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
};

const PRIMARY_LAYOUT: LayoutConfig = {
  frameWidth: 560,
  frameHeight: 540,
  outerRect: { x: 32, y: 32, width: 496, height: 476 },
  anchors: [
    { house: 2, x: 170, y: 60, width: 88, minHeight: 104 },
    { house: 12, x: 390, y: 60, width: 88, minHeight: 104 },

    { house: 3, x: 98, y: 136, width: 86, minHeight: 104 },
    { house: 1, x: 280, y: 110, width: 110, minHeight: 104 },
    { house: 11, x: 462, y: 136, width: 86, minHeight: 104 },

    { house: 4, x: 170, y: 248, width: 86, minHeight: 104 },
    { house: 10, x: 390, y: 248, width: 86, minHeight: 104 },

    { house: 5, x: 92, y: 338, width: 96, minHeight: 112 },
    { house: 7, x: 280, y: 356, width: 110, minHeight: 104 },
    { house: 9, x: 480, y: 350, width: 80, minHeight: 104 },

    { house: 6, x: 162, y: 416, width: 94, minHeight: 112 },
    { house: 8, x: 390, y: 424, width: 86, minHeight: 104 },
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
    5: 56,
    6: 54,
    9: 44,
  },
  houseArudhaShifts: {
    5: "translateY(6px)",
    6: "translateY(8px)",
  },
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
    9: 30,
  },
  houseArudhaShifts: {},
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
  const prefix = p?.isTransit ? "T:" : "";
  return `${prefix}${short}${p.retrograde ? "*" : ""}`;
}

function getPlanetsByHouse(planets: ChartPlanet[]) {
  const map = new Map<number, ChartPlanet[]>();

  for (const p of planets) {
    const house =
      typeof p.rashiHouse === "number"
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

function getPlanetTitle(p: ChartPlanet) {
  const parts = [
    p.isTransit ? "Transit" : "Natal",
    p.planet,
    p.sign ? `in ${p.sign}` : null,
    typeof p.degree === "number" ? `${p.degree.toFixed(2)}°` : null,
    p.nakshatra ? p.nakshatra : null,
    p.pada ? `Pada ${p.pada}` : null,
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

    for (let house = 1; house <= 12; house++) {
      const houseSign = getHouseSignName(house, ascSign);
      if (houseSign === sign) {
        if (!map.has(house)) map.set(house, []);
        map.get(house)!.push(label);
      }
    }
  }

  return map;
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
}: MediumNorthIndianChartProps) {
  const [selected, setSelected] = useState<ChartPlanet | null>(null);
  const [hovered, setHovered] = useState<ChartPlanet | null>(null);

  const planetsByHouse = useMemo(() => getPlanetsByHouse(planets), [planets]);
  const transitPlanetsByHouse = useMemo(() => getPlanetsByHouse(transitPlanets), [transitPlanets]);
  const arudhasByHouse = useMemo(() => getArudhasByHouse(arudhas, ascSign), [arudhas, ascSign]);
  const layout = useMemo(() => getLayoutConfig(title, layoutVariant), [title, layoutVariant]);

  const centerX = layout.frameWidth / 2;
  const centerY = layout.frameHeight / 2;
  const rectLeft = layout.outerRect.x;
  const rectTop = layout.outerRect.y;
  const rectRight = layout.outerRect.x + layout.outerRect.width;
  const rectBottom = layout.outerRect.y + layout.outerRect.height;

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

      <div className="mt-4 flex justify-center overflow-x-auto">
        <div
          className="relative mx-auto rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm"
          style={{ width: layout.frameWidth, height: layout.frameHeight }}
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
                  </div>
                </div>

                <div
                  className="mt-1 grid grid-cols-2 content-start justify-items-center gap-1 overflow-hidden"
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
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none shadow-sm transition ${
                        p.rashiHouse !== p.house
                          ? "border border-orange-200 bg-orange-50 text-orange-700"
                          : p.planet === "Moon"
                            ? "border border-amber-200 bg-amber-50 text-amber-700"
                            : selected?.planet === p.planet && !selected?.isTransit
                              ? "border border-indigo-200 bg-indigo-50 text-indigo-700"
                              : hovered?.planet === p.planet && !hovered?.isTransit
                                ? "border border-indigo-100 bg-indigo-50 text-indigo-600"
                                : idx === 0
                                  ? "border border-slate-200 bg-slate-100 text-slate-700"
                                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none shadow-sm transition ${
                        selected?.planet === p.planet && selected?.isTransit
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

                {houseArudhas.length ? (
                  <div
                    className="mt-1 flex flex-wrap justify-center gap-[3px] opacity-80"
                    style={{ lineHeight: "10px", transform: layout.houseArudhaShifts?.[anchor.house] ?? "translateY(0px)" }}
                  >
                    {houseArudhas.map((label) => {
                      const isAL = label === "AL";
                      const isUL = label === "UL";

                      return (
                        <span
                          key={`${anchor.house}-${label}`}
                          className={
                            isAL
                              ? "rounded bg-fuchsia-100 px-[3px] py-0.5 text-[8px] font-bold text-fuchsia-700"
                              : isUL
                                ? "rounded bg-fuchsia-50 px-[3px] py-0.5 text-[8px] font-semibold text-fuchsia-600"
                                : "rounded bg-fuchsia-50 px-[3px] py-0.5 text-[8px] font-medium text-fuchsia-500"
                          }
                          title={`${label} in ${getHouseSignName(anchor.house, ascSign) ?? "—"}`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {showPlanetDetails && (hovered || selected) ? (
        <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-slate-50 p-4 shadow-sm">
          {(() => {
            const activePlanet = hovered || selected;

            return (
              <>
                <div className="text-sm font-semibold text-slate-900">{activePlanet?.planet ?? "Planet"}</div>

                <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-slate-900/80 md:grid-cols-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-900">Sign</div>
                    <div className="mt-1">{activePlanet?.sign ?? "—"}</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-900">House</div>
                    <div className="mt-1">{activePlanet?.house ?? "—"}</div>
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
                    <div className="mt-1">{activePlanet?.nakshatra ?? "—"}</div>
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
              </>
            );
          })()}
        </div>
      ) : null}
    </div>
  );
}
