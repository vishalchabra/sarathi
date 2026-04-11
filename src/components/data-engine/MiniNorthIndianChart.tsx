"use client";

type ChartPlanet = {
  planet: string;
  sign?: string | null;
  house?: number | null;
  degree?: number | null;
  retrograde?: boolean;
};

type MiniNorthIndianChartProps = {
  ascSign?: string | null;
  planets?: ChartPlanet[];
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

type HouseAnchor = {
  house: number;
  x: number;
  y: number;
  width: number;
  align?: "left" | "center" | "right";
  numberOffsetY?: number;
};

const HOUSE_ANCHORS: HouseAnchor[] = [
  { house: 2, x: 76, y: 20, width: 34, align: "center", numberOffsetY: 0 },
  { house: 12, x: 184, y: 20, width: 34, align: "center", numberOffsetY: 0 },

  { house: 3, x: 30, y: 70, width: 34, align: "left", numberOffsetY: -2 },
  { house: 1, x: 130, y: 70, width: 52, align: "center", numberOffsetY: -2 },
  { house: 11, x: 230, y: 70, width: 34, align: "right", numberOffsetY: -2 },

  { house: 4, x: 58, y: 122, width: 34, align: "left", numberOffsetY: -2 },
  { house: 10, x: 202, y: 122, width: 34, align: "right", numberOffsetY: -2 },

  { house: 5, x: 30, y: 176, width: 34, align: "left", numberOffsetY: 2 },
  { house: 7, x: 130, y: 178, width: 52, align: "center", numberOffsetY: 2 },
  { house: 9, x: 230, y: 176, width: 34, align: "right", numberOffsetY: 2 },

  { house: 6, x: 76, y: 222, width: 34, align: "center", numberOffsetY: 4 },
  { house: 8, x: 184, y: 222, width: 34, align: "center", numberOffsetY: 6 },
];

function getPlanetsByHouse(planets: ChartPlanet[]) {
  const map = new Map<number, ChartPlanet[]>();

  for (let h = 1; h <= 12; h += 1) {
    map.set(h, []);
  }

  for (const p of planets) {
    if (typeof p.house !== "number") continue;
    map.set(p.house, [...(map.get(p.house) ?? []), p]);
  }

  return map;
}

function getAscSignIndex(ascSign?: string | null) {
  if (!ascSign) return -1;
  return SIGNS.findIndex((s) => s === ascSign);
}

function getHouseSignNumber(house: number, ascSign?: string | null) {
  const ascIndex = getAscSignIndex(ascSign);
  if (ascIndex < 0) return "—";
  return String(((ascIndex + (house - 1)) % 12) + 1);
}

function formatPlanetShort(p: ChartPlanet) {
  const planetName = p?.planet ?? "??";
  return PLANET_SHORT[planetName] ?? String(planetName).slice(0, 2);
}

function getHiddenPlanetText(planets: ChartPlanet[]) {
  if (planets.length <= 1) return null;
  return planets
    .slice(1)
    .map((p) => formatPlanetShort(p))
    .join(", ");
}

function getAlignmentClass(align?: "left" | "center" | "right") {
  if (align === "left") return "items-start text-left";
  if (align === "right") return "items-end text-right";
  return "items-center text-center";
}

export default function MiniNorthIndianChart({
  ascSign,
  planets = [],
}: MiniNorthIndianChartProps) {
  const planetsByHouse = getPlanetsByHouse(planets);

  return (
    <div className="mx-auto w-full max-w-[280px] rounded-xl border border-white/10 bg-white/[0.06] p-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm">
      <div className="relative mx-auto h-[280px] w-[280px] overflow-hidden rounded-lg bg-white/[0.03] ring-1 ring-white/10">
        <svg
          viewBox="0 0 260 260"
          className="absolute inset-0 h-full w-full"
          aria-label="Mini North Indian astrology chart"
        >
          <rect
            x="10"
            y="10"
            width="240"
            height="240"
            fill="transparent"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
          />

          <line x1="130" y1="10" x2="250" y2="130" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <line x1="250" y1="130" x2="130" y2="250" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <line x1="130" y1="250" x2="10" y2="130" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <line x1="10" y1="130" x2="130" y2="10" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />

          <line x1="10" y1="10" x2="250" y2="250" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <line x1="250" y1="10" x2="10" y2="250" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        </svg>

        {HOUSE_ANCHORS.map((anchor) => {
          const housePlanets = planetsByHouse.get(anchor.house) ?? [];
          const visiblePlanets = housePlanets.slice(0, 1);
          const hiddenPlanetText = getHiddenPlanetText(housePlanets);
          const isAscHouse = anchor.house === 1;
          const rashiNumber = getHouseSignNumber(anchor.house, ascSign);

          return (
            <div
              key={anchor.house}
              className={`absolute flex flex-col ${getAlignmentClass(anchor.align)}`}
              style={{
                left: anchor.x - anchor.width / 2,
                top: anchor.y,
                width: anchor.width,
              }}
            >
              <div
  className={`text-[10px] font-semibold leading-none ${
    isAscHouse ? "text-indigo-700" : "text-white/80"
  }`}
  style={{
    transform: `translateY(${anchor.numberOffsetY ?? 0}px)`,
  }}
>
  {rashiNumber}
  {isAscHouse ? " ↑" : ""}
</div>
              <div
  className={`mt-1 flex flex-col gap-[2px] ${getAlignmentClass(anchor.align)} overflow-hidden`}
  style={{
    maxHeight: 24,   // 🔑 controls vertical space inside house
  }}
>
                {visiblePlanets.map((p, idx) => (
  <div
    key={`${anchor.house}-${p.planet}-${idx}`}
    className={`max-w-full rounded px-1 py-[1px] leading-none ${
      idx === 0
  ? "bg-indigo-400/15 text-indigo-100 text-[9px] font-semibold ring-1 ring-indigo-300/20"
  : "bg-white/10 text-white/80 text-[8px]"
    }`}
  >
                    {formatPlanetShort(p)}
                  </div>
                ))}

                {hiddenPlanetText ? (
  <div
    className="max-w-full text-[9px] leading-tight text-white/70 line-clamp-2"
                    title={hiddenPlanetText}
                  >
                    {hiddenPlanetText}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}