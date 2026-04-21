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
  badgeOffsetX?: number;
  badgeOffsetY?: number;
  maxHeight?: number;
};

const HOUSE_ANCHORS: HouseAnchor[] = [
  { house: 2, x: 76, y: 18, width: 34, align: "center", numberOffsetY: 0, badgeOffsetY: 2, maxHeight: 26 },
  { house: 12, x: 190, y: 18, width: 34, align: "center", numberOffsetY: 0, badgeOffsetY: 4, maxHeight: 28 },

  { house: 3, x: 28, y: 68, width: 32, align: "left", numberOffsetY: -1, badgeOffsetX: 2, badgeOffsetY: 1, maxHeight: 24 },
  { house: 1, x: 130, y: 68, width: 44, align: "center", numberOffsetY: -1, badgeOffsetY: 2, maxHeight: 28 },
  { house: 11, x: 232, y: 64, width: 34, align: "right", numberOffsetY: -1, badgeOffsetX: -4, badgeOffsetY: 3, maxHeight: 28 },

  { house: 4, x: 56, y: 118, width: 32, align: "left", numberOffsetY: 0, badgeOffsetX: 1, badgeOffsetY: 2, maxHeight: 24 },
  { house: 10, x: 204, y: 118, width: 32, align: "right", numberOffsetY: 0, badgeOffsetX: -1, badgeOffsetY: 2, maxHeight: 24 },

  { house: 5, x: 28, y: 168, width: 32, align: "left", numberOffsetY: 1, badgeOffsetX: 1, badgeOffsetY: 0, maxHeight: 24 },
  { house: 7, x: 130, y: 170, width: 44, align: "center", numberOffsetY: 2, badgeOffsetY: -1, maxHeight: 28 },
  { house: 9, x: 226, y: 180, width: 38, align: "right", numberOffsetY: 0, badgeOffsetX: -3, badgeOffsetY: -1, maxHeight: 26 },

  { house: 6, x: 76, y: 230, width: 34, align: "center", numberOffsetY: 3, badgeOffsetY: -2, maxHeight: 24 },
  { house: 8, x: 200, y: 230, width: 48, align: "center", numberOffsetY: 2, badgeOffsetY: -4, maxHeight: 22 },
];

function getPlanetsByHouse(planets: ChartPlanet[]) {
  const map = new Map<number, ChartPlanet[]>();
  for (let h = 1; h <= 12; h += 1) map.set(h, []);
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
  const short = PLANET_SHORT[planetName] ?? String(planetName).slice(0, 2);
  return `${short}${p.retrograde ? "*" : ""}`;
}

function getPlanetBadgeClass(planet: ChartPlanet) {
  if (planet.planet === "Moon") return "border border-amber-200 bg-amber-50 text-amber-700";
  return "border border-slate-200 bg-slate-100 text-slate-700";
}

function getAlignmentClass(align?: "left" | "center" | "right") {
  if (align === "left") return "items-start text-left";
  if (align === "right") return "items-end text-right";
  return "items-center text-center";
}

function getHouseTitle(planets: ChartPlanet[]) {
  if (!planets.length) return "";
  return planets.map((p) => formatPlanetShort(p)).join(", ");
}

export default function MiniNorthIndianChart({
  ascSign,
  planets = [],
}: MiniNorthIndianChartProps) {
  const planetsByHouse = getPlanetsByHouse(planets);

  return (
    <div className="mx-auto w-full max-w-[296px] rounded-2xl border border-[color:var(--border)] bg-white p-3 shadow-sm backdrop-blur-sm">
      <div className="relative mx-auto h-[280px] w-[280px] overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 shadow-sm">
        <svg
          viewBox="0 0 260 260"
          className="absolute inset-0 h-full w-full"
          aria-label="Mini North Indian astrology chart"
        >
          <rect x="10" y="10" width="240" height="240" fill="transparent" stroke="rgba(71,85,105,0.65)" strokeWidth="1.15" />
          <line x1="130" y1="10" x2="250" y2="130" stroke="rgba(71,85,105,0.65)" strokeWidth="1.15" />
          <line x1="250" y1="130" x2="130" y2="250" stroke="rgba(71,85,105,0.65)" strokeWidth="1.15" />
          <line x1="130" y1="250" x2="10" y2="130" stroke="rgba(71,85,105,0.65)" strokeWidth="1.15" />
          <line x1="10" y1="130" x2="130" y2="10" stroke="rgba(71,85,105,0.65)" strokeWidth="1.15" />
          <line x1="10" y1="10" x2="250" y2="250" stroke="rgba(71,85,105,0.65)" strokeWidth="1.15" />
          <line x1="250" y1="10" x2="10" y2="250" stroke="rgba(71,85,105,0.65)" strokeWidth="1.15" />
        </svg>

        {HOUSE_ANCHORS.map((anchor) => {
          const housePlanets = planetsByHouse.get(anchor.house) ?? [];
          const primaryPlanet = housePlanets[0] ?? null;
          const hiddenCount = Math.max(0, housePlanets.length - 1);
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
              title={getHouseTitle(housePlanets)}
            >
              <div
                className={`text-[10px] font-semibold leading-none ${isAscHouse ? "text-indigo-700" : "text-slate-700"}`}
                style={{ transform: `translateY(${anchor.numberOffsetY ?? 0}px)` }}
              >
                {rashiNumber}
              </div>

              <div
                className={`mt-1 flex flex-col ${getAlignmentClass(anchor.align)} overflow-hidden`}
                style={{
                  gap: 2,
                  maxHeight: anchor.maxHeight ?? 24,
                  transform: `translate(${anchor.badgeOffsetX ?? 0}px, ${anchor.badgeOffsetY ?? 0}px)`,
                }}
              >
                {primaryPlanet ? (
                  <div
                    className={`max-w-full rounded-md px-1 py-[1px] text-[8px] font-medium leading-none shadow-sm ${getPlanetBadgeClass(primaryPlanet)}`}
                    title={primaryPlanet.planet}
                  >
                    {formatPlanetShort(primaryPlanet)}
                  </div>
                ) : null}

                {hiddenCount > 0 ? (
                  <div
                    className="rounded bg-slate-50 px-[4px] py-[1px] text-[7px] font-medium leading-none text-slate-500 ring-1 ring-slate-200"
                    title={housePlanets.slice(1).map((p) => p.planet).join(", ")}
                  >
                    +{hiddenCount}
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
