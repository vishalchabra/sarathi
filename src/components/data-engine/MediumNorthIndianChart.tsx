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

type MediumNorthIndianChartProps = {
  title?: string;
  ascSign?: string | null;
  planets?: ChartPlanet[];
  transitPlanets?: ChartPlanet[];
  onPlanetClick?: (planet: ChartPlanet) => void;
  mode?: "rashi" | "chalit";
  sarvaAshtakvarga?: number[];
  showPlanetDetails?: boolean;   // ✅ ADD THIS
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

const SIGN_SHORT: Record<string, string> = {
  Aries: "Ar",
  Taurus: "Ta",
  Gemini: "Ge",
  Cancer: "Cn",
  Leo: "Le",
  Virgo: "Vi",
  Libra: "Li",
  Scorpio: "Sc",
  Sagittarius: "Sg",
  Capricorn: "Cp",
  Aquarius: "Aq",
  Pisces: "Pi",
};
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

function getSignNumber(sign?: string | null) {
  if (!sign) return "—";
  return String(SIGN_TO_NUMBER[sign] ?? "—");
}
const HOUSE_PLANET_SHIFTS: Record<number, string> = {
  11: "translate(3px, -42px)",
  9: "translate(-12px, -12px)",
  10: "translate(-10px, -8px)",
  7: "translate(-6px, -6px)",
  8: "translate(-4px, -6px)",
};
type HouseAnchor = {
  house: number;
  x: number;
  y: number;
  width: number;
};

const HOUSE_ANCHORS: HouseAnchor[] = [
  { house: 2, x: 160, y: 40, width: 84 },
  { house: 12, x: 390, y: 40, width: 84 },

  { house: 3, x: 85, y: 120, width: 84 },
  { house: 1, x: 260, y: 134, width: 104 },
  { house: 11, x: 422, y: 120, width: 84 },

  { house: 4, x: 150, y: 236, width: 84 },
  { house: 10, x: 370, y: 236, width: 84 },

  { house: 5, x: 85, y: 332, width: 80 },
  { house: 7, x: 260, y: 342, width: 104 },
  { house: 9, x: 450, y: 332, width: 84 },

  { house: 6, x: 150, y: 398, width: 84 },
  { house: 8, x: 370, y: 398, width: 84 },
];

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
        ? p.rashiHouse   // ✅ priority
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
    p.isTransit ? "Transit" : "foundations",
    p.planet,
    p.sign ? `in ${p.sign}` : null,
    typeof p.degree === "number" ? `${p.degree.toFixed(2)}°` : null,
    p.nakshatra ? p.nakshatra : null,
    p.pada ? `Pada ${p.pada}` : null,
  ].filter(Boolean);

  return parts.join(" • ");
}

function getFullPlanetListTitle(planets: ChartPlanet[]) {
  return planets
    .map((p) => {
      const name = p?.planet ?? "??";
      const deg =
        typeof p.degree === "number" && !Number.isNaN(p.degree)
          ? ` ${p.degree.toFixed(2)}°`
          : "";
      return `${name}${deg}`;
    })
    .join(" • ");
}
function getHouseSignNumber(house: number, ascSign?: string | null) {
  const ascIndex = getAscSignIndex(ascSign);
  if (ascIndex < 0) return "—";
  return String(((ascIndex + (house - 1)) % 12) + 1);
}
export default function MediumNorthIndianChart({
  title = "North Indian Chart",
  ascSign,
  planets = [],
  transitPlanets = [],
  onPlanetClick,
  mode = "rashi",
  sarvaAshtakvarga = [],
  showPlanetDetails = true,   // ✅ ADD THIS
}: MediumNorthIndianChartProps) {
  const [selected, setSelected] = useState<ChartPlanet | null>(null);
  const [hovered, setHovered] = useState<ChartPlanet | null>(null);
  const planetsByHouse = useMemo(() => getPlanetsByHouse(planets), [planets]);
const transitPlanetsByHouse = useMemo(
  () => getPlanetsByHouse(transitPlanets),
  [transitPlanets]
);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <p className="mt-1 text-xs text-white/70">
            Click any Planet to view detailed information.
          </p>
        </div>
     
        <div className="text-xs text-white/70">
          Ascendant:{" "}
          <span className="font-semibold text-indigo-300">
  {getSignNumber(ascSign)}
</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="relative mx-auto h-[500px] w-[520px] rounded-xl bg-white/[0.03] ring-1 ring-white/10">
          <svg
            viewBox="0 0 520 500"
            className="absolute inset-0 h-full w-full"
            aria-label="North Indian astrology chart"
          >
            <rect
              x="36"
              y="36"
              width="448"
              height="428"
              fill="transparent"
              stroke="rgba(255,255,255,0.24)"
              strokeWidth="1.4"
            />

            <line x1="260" y1="36" x2="484" y2="250" stroke="rgba(255,255,255,0.24)" strokeWidth="1.4" />
            <line x1="484" y1="250" x2="260" y2="464" stroke="rgba(255,255,255,0.24)" strokeWidth="1.4" />
            <line x1="260" y1="464" x2="36" y2="250" stroke="rgba(255,255,255,0.24)" strokeWidth="1.4" />
            <line x1="36" y1="250" x2="260" y2="36" stroke="rgba(255,255,255,0.24)" strokeWidth="1.4" />

            <line x1="36" y1="36" x2="484" y2="464" stroke="rgba(255,255,255,0.24)" strokeWidth="1.4" />
            <line x1="484" y1="36" x2="36" y2="464" stroke="rgba(255,255,255,0.24)" strokeWidth="1.4" />
          </svg>

        {HOUSE_ANCHORS.map((anchor) => {
  const housePlanets = planetsByHouse.get(anchor.house) ?? [];
  const houseTransitPlanets = (transitPlanetsByHouse.get(anchor.house) ?? []).map(
    (p) => ({ ...p, isTransit: true })
  );

const shownNatalPlanets = housePlanets;
const shownTransitPlanets = houseTransitPlanets;

  const isAscHouse = anchor.house === 1;
  const houseLabel = getHouseSignNumber(anchor.house, ascSign);
  const sarvaValue = sarvaAshtakvarga?.[anchor.house - 1] ?? null;
  const planetShift = HOUSE_PLANET_SHIFTS[anchor.house] || "translate(0,0)";
  const allForTitle = [...housePlanets, ...houseTransitPlanets];

  return (
    <div
      key={anchor.house}
      className="absolute"
      style={{
        left: anchor.x - anchor.width / 2,
        top: anchor.y,
        width: anchor.width,
      }}
    >
      <div className="flex flex-col items-center">
  <div
    className={`text-base font-semibold ${
      isAscHouse ? "text-indigo-200" : "text-white/75"
    }`}
  >
    {houseLabel}
  </div>

  {typeof sarvaValue === "number" ? (
    <div className="mt-[2px] text-[10px] font-medium text-white/40">
      {sarvaValue}
    </div>
  ) : null}
</div>

     <div
  className="mt-1 grid grid-cols-2 content-start justify-items-start gap-[2px] overflow-hidden"
  style={{
    maxHeight: 92,
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
              setHovered((curr) =>
                curr?.planet === p.planet && !curr?.isTransit ? null : curr
              )
            }
            onClick={() => {
              setSelected(p);
              onPlanetClick?.(p);
            }}
           className={`rounded px-[4px] py-[2px] text-[12px] leading-none transition ${
  p.rashiHouse !== p.house
    ? "bg-orange-400/15 text-orange-200 ring-1 ring-orange-400/25 font-semibold"
    : p.planet === "Moon"
    ? "bg-yellow-400/15 text-yellow-200 ring-1 ring-yellow-400/25 font-semibold"
    : selected?.planet === p.planet && !selected?.isTransit
    ? "bg-indigo-400/20 text-indigo-100 ring-1 ring-indigo-300/40"
    : hovered?.planet === p.planet && !hovered?.isTransit
    ? "bg-indigo-400/15 text-indigo-100 ring-1 ring-indigo-300/30"
    : idx === 0
    ? "bg-indigo-400/12 text-indigo-100 font-medium hover:bg-indigo-400/18"
    : "bg-white/10 text-white/85 hover:bg-white/15"
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
              setHovered((curr) =>
                curr?.planet === p.planet && curr?.isTransit ? null : curr
              )
            }
            onClick={() => {
              setSelected(p);
              onPlanetClick?.(p);
            }}
           className={`rounded px-[4px] py-[2px] text-[12px] leading-none transition ${
  selected?.planet === p.planet && selected?.isTransit
    ? "bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/40"
    : hovered?.planet === p.planet && hovered?.isTransit
    ? "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/30"
    : "bg-emerald-400/12 text-emerald-100 hover:bg-emerald-400/18"
}`}
            title={getPlanetTitle(p)}
          >
            {formatPlanetLabel(p)}
          </button>
        ))}
      </div>
    </div>
  );
})}
        </div>
      </div>

      {showPlanetDetails && (hovered || selected) ? (
  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.18)]">
    {(() => {
      const activePlanet = hovered || selected;

      return (
        <>
          <div className="text-sm font-semibold text-white">
            {activePlanet?.planet ?? "Planet"}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-white/80 md:grid-cols-4">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-white/50">
                Sign
              </div>
              <div className="mt-1">{activePlanet?.sign ?? "—"}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-white/50">
                House
              </div>
              <div className="mt-1">{activePlanet?.house ?? "—"}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-white/50">
                Degree
              </div>
              <div className="mt-1">
                {typeof activePlanet?.degree === "number"
                  ? `${activePlanet.degree.toFixed(2)}°`
                  : "—"}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-white/50">
                Retrograde
              </div>
              <div className="mt-1">{activePlanet?.retrograde ? "Yes" : "No"}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-white/50">
                Nakshatra
              </div>
              <div className="mt-1">{activePlanet?.nakshatra ?? "—"}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-white/50">
                Pada
              </div>
              <div className="mt-1">{activePlanet?.pada ?? "—"}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-white/50">
                Combust
              </div>
              <div className="mt-1">{activePlanet?.combust ? "Yes" : "No"}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-white/50">
                State
              </div>
              <div className="mt-1">
                {hovered?.planet === activePlanet?.planet ? "Hovering" : "Selected"}
              </div>
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