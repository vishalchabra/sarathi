"use client";

type PlanetRow = {
  planet: string;
  sign: string;
  signNum?: number;
  degree?: number | null;
  house?: number | null;
  nakshatra?: string | null;
  pada?: number | null;
  retrograde?: boolean;
  combust?: boolean;
  lon?: number | null;
  lordships?: number[];
};

type Props = {
  planets: PlanetRow[];
  rawMode?: boolean;
  title?: string;
};

const NAKSHATRA_LORD_MAP: Record<string, string> = {
  Ashwini: "Ketu",
  Bharani: "Venus",
  Krittika: "Sun",
  Rohini: "Moon",
  Mrigashira: "Mars",
  Ardra: "Rahu",
  Punarvasu: "Jupiter",
  Pushya: "Saturn",
  Ashlesha: "Mercury",
  Magha: "Ketu",
  "Purva Phalguni": "Venus",
  "Uttara Phalguni": "Sun",
  Hasta: "Moon",
  Chitra: "Mars",
  Swati: "Rahu",
  Vishakha: "Jupiter",
  Anuradha: "Saturn",
  Jyeshtha: "Mercury",
  Mula: "Ketu",
  "Purva Ashadha": "Venus",
  "Uttara Ashadha": "Sun",
  Shravana: "Moon",
  Dhanishta: "Mars",
  Shatabhisha: "Rahu",
  "Purva Bhadrapada": "Jupiter",
  "Uttara Bhadrapada": "Saturn",
  Revati: "Mercury",
};

function formatDegree(v?: number | null) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}°`;
}

function getNakshatraLord(nakshatra?: string | null) {
  if (!nakshatra) return null;
  return NAKSHATRA_LORD_MAP[nakshatra] ?? null;
}

function formatNakshatraWithLord(nakshatra?: string | null) {
  if (!nakshatra) return "—";
  const lord = getNakshatraLord(nakshatra);
  return lord ? `${nakshatra} (${lord})` : nakshatra;
}

function badgeClass(planet: string) {
  const p = planet.toLowerCase();

  if (p === "sun") return "bg-amber-100 text-amber-800";
  if (p === "moon") return "bg-indigo-100 text-indigo-800";
  if (p === "mars") return "bg-rose-100 text-rose-800";
  if (p === "mercury") return "bg-emerald-100 text-emerald-800";
  if (p === "jupiter") return "bg-yellow-100 text-yellow-800";
  if (p === "venus") return "bg-pink-100 text-pink-800";
  if (p === "saturn") return "bg-indigo-100 text-indigo-800";
  if (p === "rahu") return "bg-violet-100 text-violet-800";
  if (p === "ketu") return "bg-cyan-100 text-cyan-800";

  return "bg-white/10 text-slate-900/90";
}

export default function PlanetTable({
  planets,
  rawMode = false,
  title = "Planet Table",
}: Props) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[color:var(--border)] text-slate-900">
            <tr>
              <th className="px-3 py-2 font-medium">Planet</th>
              <th className="px-3 py-2 font-medium">Sign</th>
              <th className="px-3 py-2 font-medium">Degree</th>
              <th className="px-3 py-2 font-medium">House</th>
              <th className="px-3 py-2 font-medium">Nakshatra</th>
              <th className="px-3 py-2 font-medium">Pada</th>
              <th className="px-3 py-2 font-medium">Rx</th>
              <th className="px-3 py-2 font-medium">Combust</th>
              {rawMode ? (
                <>
                  <th className="px-3 py-2 font-medium">Longitude</th>
                  <th className="px-3 py-2 font-medium">Sign #</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {planets.map((p) => (
              <tr key={p.planet} className="border-b border-[color:var(--border)]">
                <td className="px-3 py-2 font-medium text-slate-900">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(
                      p.planet
                    )}`}
                  >
                    {p.planet}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-900/80">{p.sign ?? "—"}</td>
                <td className="px-3 py-2 text-slate-900/80">
                  {formatDegree(p.degree)}
                </td>
                <td className="px-3 py-2 text-slate-900/80">{p.house ?? "—"}</td>
                <td className="px-3 py-2 text-slate-900/80">
                  {formatNakshatraWithLord(p.nakshatra)}
                </td>
                <td className="px-3 py-2 text-slate-900/80">{p.pada ?? "—"}</td>
                <td className="px-3 py-2 text-slate-900/80">
                  {p.retrograde ? "Yes" : "No"}
                </td>
                <td className="px-3 py-2 text-slate-900/80">
                  {p.combust ? "Yes" : "No"}
                </td>
                {rawMode ? (
                  <>
                    <td className="px-3 py-2 text-slate-900/80">
                      {formatDegree(p.lon)}
                    </td>
                    <td className="px-3 py-2 text-slate-900/80">
                      {p.signNum ?? "—"}
                    </td>
                  </>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}