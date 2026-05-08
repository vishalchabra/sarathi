"use client";

const HOUSE_POSITIONS: Record<number, string> = {
  1: "left-[50%] top-[25%]",
  2: "left-[68%] top-[16%]",
  3: "left-[84%] top-[32%]",
  4: "left-[68%] top-[50%]",
  5: "left-[84%] top-[68%]",
  6: "left-[68%] top-[84%]",
  7: "left-[50%] top-[75%]",
  8: "left-[32%] top-[84%]",
  9: "left-[16%] top-[68%]",
  10: "left-[32%] top-[50%]",
  11: "left-[16%] top-[32%]",
  12: "left-[32%] top-[16%]",
};

const SIGN_NUM_TO_NAME: Record<number, string> = {
  1: "Ar",
  2: "Ta",
  3: "Ge",
  4: "Cn",
  5: "Le",
  6: "Vi",
  7: "Li",
  8: "Sc",
  9: "Sg",
  10: "Cp",
  11: "Aq",
  12: "Pi",
};

function shortPlanet(name: string) {
  const map: Record<string, string> = {
    Sun: "Su",
    Moon: "Mo",
    Mars: "Ma",
    Mercury: "Me",
    Jupiter: "Ju",
    Venus: "Ve",
    Saturn: "Sa",
    Rahu: "Ra",
    Ketu: "Ke",
  };

  return map[name] ?? name.slice(0, 2);
}

function getSignForHouse(ascSignNum: number | null | undefined, house: number) {
  if (!ascSignNum) return null;
  return ((ascSignNum + house - 2) % 12) + 1;
}

export default function ActivationMiniChart({
  transitPlanets = [],
  primaryPlanets = [],
  ascSignNum,
}: {
  transitPlanets?: any[];
  primaryPlanets?: string[];
  ascSignNum?: number | null;
}) {
  const primarySet = new Set(primaryPlanets.map(String));

  const rows = (transitPlanets ?? [])
    .filter((p: any) =>
      ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].includes(
        String(p?.planet ?? "")
      )
    )
    .map((p: any) => ({
      planet: String(p?.planet ?? ""),
      house: Number(p?.houseFromLagna ?? p?.house ?? 0),
      degree: p?.degree ?? null,
      primary: primarySet.has(String(p?.planet ?? "")),
    }))
    .filter((p) => p.house >= 1 && p.house <= 12);

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Activation Chart
          </div>
          <p className="mt-1 text-xs text-slate-500">
            North Indian house view from Lagna. Dasha planets highlighted.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-4 h-[420px] max-w-[560px] overflow-hidden rounded-2xl bg-slate-50 p-8">
        <svg viewBox="0 0 100 100" className="absolute inset-8 h-[calc(100%-4rem)] w-[calc(100%-4rem)]">
          <rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" className="text-slate-300" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" className="text-slate-300" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" className="text-slate-300" />
          <line x1="50" y1="0" x2="0" y2="50" stroke="currentColor" className="text-slate-300" />
          <line x1="50" y1="0" x2="100" y2="50" stroke="currentColor" className="text-slate-300" />
          <line x1="0" y1="50" x2="50" y2="100" stroke="currentColor" className="text-slate-300" />
          <line x1="100" y1="50" x2="50" y2="100" stroke="currentColor" className="text-slate-300" />
        </svg>

        {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
          const planets = rows.filter((p) => p.house === house);
          const pos = HOUSE_POSITIONS[house];
          const signNum = getSignForHouse(ascSignNum, house);

          return (
            <div
              key={house}
              className={`absolute ${pos} -translate-x-1/2 -translate-y-1/2`}
            >
              <div className="mb-1 text-center text-[11px] font-semibold text-slate-400">
                {signNum ? `${signNum} ${SIGN_NUM_TO_NAME[signNum]}` : ""}
              </div>

              <div className="flex max-w-[96px] flex-wrap justify-center gap-1">
                {planets.map((p) => (
                  <span
                    key={`${p.planet}-${p.house}`}
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                      p.primary
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {shortPlanet(p.planet)}
                    {p.degree == null ? "" : ` ${Number(p.degree).toFixed(0)}°`}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}