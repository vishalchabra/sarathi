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

function formatDegree(v?: number | null) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}°`;
}

function badgeClass(planet: string) {
  const p = planet.toLowerCase();

  if (p === "sun") return "bg-amber-100 text-amber-800";
  if (p === "moon") return "bg-slate-200 text-slate-800";
  if (p === "mars") return "bg-rose-100 text-rose-800";
  if (p === "mercury") return "bg-emerald-100 text-emerald-800";
  if (p === "jupiter") return "bg-yellow-100 text-yellow-800";
  if (p === "venus") return "bg-pink-100 text-pink-800";
  if (p === "saturn") return "bg-indigo-100 text-indigo-800";
  if (p === "rahu") return "bg-violet-100 text-violet-800";
  if (p === "ketu") return "bg-cyan-100 text-cyan-800";

  return "bg-slate-100 text-slate-800";
}

export default function PlanetTable({
  planets,
  rawMode = false,
  title = "Planet Table",
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
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
              <tr key={p.planet} className="border-b border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-900">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(
                      p.planet
                    )}`}
                  >
                    {p.planet}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-700">{p.sign ?? "—"}</td>
                <td className="px-3 py-2 text-slate-700">
                  {formatDegree(p.degree)}
                </td>
                <td className="px-3 py-2 text-slate-700">{p.house ?? "—"}</td>
                <td className="px-3 py-2 text-slate-700">
                  {p.nakshatra ?? "—"}
                </td>
                <td className="px-3 py-2 text-slate-700">{p.pada ?? "—"}</td>
                <td className="px-3 py-2 text-slate-700">
                  {p.retrograde ? "Yes" : "No"}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {p.combust ? "Yes" : "No"}
                </td>
                {rawMode ? (
                  <>
                    <td className="px-3 py-2 text-slate-700">
                      {formatDegree(p.lon)}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
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