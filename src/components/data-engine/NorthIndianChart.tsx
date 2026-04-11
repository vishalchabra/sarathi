"use client";

import { useMemo, useState } from "react";

type ChartPlanet = {
  planet: string;
  sign?: string | null;
  house?: number | null;
  degree?: number | null;
  retrograde?: boolean;
};

type NorthIndianChartProps = {
  title?: string;
  ascSign?: string | null;
  planets?: ChartPlanet[];
  onPlanetClick?: (planet: ChartPlanet) => void;
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

type HouseAnchor = {
  house: number;
  x: number;
  y: number;
  width: number;
};

const HOUSE_ANCHORS: HouseAnchor[] = [
  { house: 2, x: 210, y: 90, width: 120 },
  { house: 12, x: 550, y: 90, width: 120 },

  { house: 3, x: 95, y: 235, width: 120 },
  { house: 1, x: 380, y: 205, width: 150 },
  { house: 11, x: 665, y: 235, width: 120 },

  { house: 4, x: 175, y: 395, width: 130 },
  { house: 10, x: 555, y: 395, width: 130 },

  { house: 5, x: 95, y: 565, width: 120 },
  { house: 7, x: 380, y: 585, width: 150 },
  { house: 9, x: 665, y: 565, width: 120 },

  { house: 6, x: 210, y: 680, width: 120 },
  { house: 8, x: 550, y: 680, width: 120 },
];

function formatPlanetLabel(p: ChartPlanet) {
  const planetName = p?.planet ?? "??";
const short = PLANET_SHORT[planetName] ?? String(planetName).slice(0, 2);
  const deg =
    typeof p.degree === "number" && !Number.isNaN(p.degree)
      ? `${Math.round(p.degree)}°`
      : "";
  return `${short}${p.retrograde ? "*" : ""}${deg ? ` ${deg}` : ""}`;
}

function getPlanetsByHouse(planets: ChartPlanet[]) {
  const map = new Map<number, ChartPlanet[]>();

  for (const p of planets) {
    if (typeof p.house !== "number") continue;
    if (!map.has(p.house)) map.set(p.house, []);
    map.get(p.house)!.push(p);
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

  // Aries = 1, Taurus = 2 ... Pisces = 12
  const signNumber = ((ascIndex + (house - 1)) % 12) + 1;

  return String(signNumber);
}

export default function NorthIndianChart({
  title = "North Indian Chart",
  ascSign,
  planets = [],
  onPlanetClick,
}: NorthIndianChartProps) {
  const [selected, setSelected] = useState<ChartPlanet | null>(null);
  const planetsByHouse = useMemo(() => getPlanetsByHouse(planets), [planets]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-white/70">
            Traditional North Indian chart layout.
          </p>
        </div>

        <div className="text-sm text-white/70">
          Ascendant:{" "}
          <span className="font-semibold text-indigo-700">
            {ascSign ? SIGN_SHORT[ascSign] ?? ascSign : "—"}
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="relative mx-auto h-[760px] w-[760px] rounded-xl bg-white/5">
          <svg
            viewBox="0 0 760 760"
            className="absolute inset-0 h-full w-full"
            aria-label="North Indian astrology chart"
          >
            <rect
              x="40"
              y="40"
              width="680"
              height="680"
              fill="white"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            <line x1="380" y1="40" x2="720" y2="380" stroke="#525252" strokeWidth="1.6" />
            <line x1="720" y1="380" x2="380" y2="720" stroke="#525252" strokeWidth="1.6" />
            <line x1="380" y1="720" x2="40" y2="380" stroke="#525252" strokeWidth="1.6" />
            <line x1="40" y1="380" x2="380" y2="40" stroke="#525252" strokeWidth="1.6" />

            <line x1="40" y1="40" x2="720" y2="720" stroke="#525252" strokeWidth="1.6" />
            <line x1="720" y1="40" x2="40" y2="720" stroke="#525252" strokeWidth="1.6" />
          </svg>

          {HOUSE_ANCHORS.map((anchor) => {
            const housePlanets = planetsByHouse.get(anchor.house) ?? [];
            const isAscHouse = anchor.house === 1;
            const rashiNumber = getHouseSignNumber(anchor.house, ascSign);

            return (
              <div
                key={anchor.house}
                className="absolute flex flex-col items-center text-center"
                style={{
                  left: anchor.x - anchor.width / 2,
                  top: anchor.y,
                  width: anchor.width,
                }}
              >
                <div
                  className={`text-base font-semibold ${
                    isAscHouse ? "text-indigo-700" : "text-white/80"
                  }`}
                >
                  <div className="text-base font-semibold text-indigo-700">
  {rashiNumber}
  {isAscHouse ? " ⬆" : ""}
</div>
                </div>

                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {housePlanets.map((p, idx) => (
                    <button
                      key={`${anchor.house}-${p.planet}-${idx}`}
                      type="button"
                      onClick={() => {
                        setSelected(p);
                        onPlanetClick?.(p);
                      }}
                      className="rounded-md bg-white/10 px-2 py-1 text-[11px] text-white/90 transition hover:bg-slate-200"
                      title={`${p.planet}${p.sign ? ` in ${p.sign}` : ""}${
                        typeof p.degree === "number" ? ` • ${p.degree.toFixed(2)}°` : ""
                      }`}
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

      {selected ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-white">
            {selected.planet}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-white/80 md:grid-cols-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-white/50">
                Sign
              </div>
              <div className="mt-1">{selected.sign ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-white/50">
                House
              </div>
              <div className="mt-1">{selected.house ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-white/50">
                Degree
              </div>
              <div className="mt-1">
                {typeof selected.degree === "number"
                  ? `${selected.degree.toFixed(2)}°`
                  : "—"}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-white/50">
                Retrograde
              </div>
              <div className="mt-1">{selected.retrograde ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}