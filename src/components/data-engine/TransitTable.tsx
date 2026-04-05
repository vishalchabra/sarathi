"use client";

type Props = {
  transitNow?: {
    dateISO?: string;
    planets?: Array<{
      planet: string;
      sign: string;
      signNum?: number;
      degree?: number | null;
      houseFromLagna?: number | null;
      retrograde?: boolean;
      nakshatra?: string | null;
    }>;
    moonToday?: {
      nakshatra?: string | null;
      sign?: string | null;
      houseFromLagna?: number | null;
      houseFromMoon?: number | null;
    };
  };
};

function formatDegree(v?: number | null) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}°`;
}

function labelClass() {
  return "text-xs font-medium uppercase tracking-wide text-slate-500";
}

function valueClass() {
  return "mt-1 text-sm text-slate-900";
}

export default function TransitTable({ transitNow }: Props) {
  const planets = transitNow?.planets ?? [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Current Transit Snapshot
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Planet</th>
              <th className="px-3 py-2 font-medium">Sign</th>
              <th className="px-3 py-2 font-medium">Degree</th>
              <th className="px-3 py-2 font-medium">House from Lagna</th>
              <th className="px-3 py-2 font-medium">Nakshatra</th>
              <th className="px-3 py-2 font-medium">Rx</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p) => (
              <tr key={p.planet} className="border-b border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-900">
                  {p.planet}
                </td>
                <td className="px-3 py-2 text-slate-700">{p.sign}</td>
                <td className="px-3 py-2 text-slate-700">
                  {formatDegree(p.degree)}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {p.houseFromLagna ?? "—"}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {p.nakshatra ?? "—"}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {p.retrograde ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <div className={labelClass()}>Selected date</div>
          <div className={valueClass()}>{transitNow?.dateISO ?? "—"}</div>
        </div>
        <div>
          <div className={labelClass()}>Moon nakshatra</div>
          <div className={valueClass()}>
            {transitNow?.moonToday?.nakshatra ?? "—"}
          </div>
        </div>
        <div>
          <div className={labelClass()}>Moon house from lagna</div>
          <div className={valueClass()}>
            {transitNow?.moonToday?.houseFromLagna ?? "—"}
          </div>
        </div>
        <div>
          <div className={labelClass()}>Moon house from moon</div>
          <div className={valueClass()}>
            {transitNow?.moonToday?.houseFromMoon ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}