"use client";

type AshtakvargaPlanetRow = {
  planet: string;
  houses: number[];
  total: number;
};

type AshtakvargaData = {
  planets: AshtakvargaPlanetRow[];
  sarva: number[];
};

function getCellTone(value: number) {
  if (value >= 6) return "bg-emerald-50 text-emerald-700";
  if (value >= 4) return "bg-amber-50 text-amber-700";
  return "bg-white/80 text-slate-900";
}

function getSarvaTone(value: number) {
  if (value >= 35) return "bg-emerald-100 text-emerald-800";
  if (value >= 28) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

export default function AshtakvargaCard({
  data,
}: {
  data?: AshtakvargaData;
}) {
  if (!data?.planets?.length) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 text-sm text-slate-900">
        Ashtakvarga data not available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Ashtakvarga System
      </h3>
      <p className="mt-1 text-sm text-slate-900">
        Planet-wise bindu distribution across houses, plus Sarva Ashtakvarga.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] text-left text-[11px] uppercase tracking-wide text-slate-900">
              <th className="pb-2 pr-3">Planet</th>
              {Array.from({ length: 12 }, (_, i) => (
                <th key={i} className="pb-2 px-2 text-center">
                  H{i + 1}
                </th>
              ))}
              <th className="pb-2 pl-3 text-center">Total</th>
            </tr>
          </thead>

          <tbody>
            {data.planets.map((row) => (
              <tr
                key={row.planet}
                className="border-b border-[color:var(--border)] last:border-none"
              >
                <td className="py-3 pr-3 font-medium text-slate-900">
                  {row.planet}
                </td>

                {row.houses.map((value, idx) => (
                  <td key={idx} className="px-2 py-3 text-center">
                    <span
                      className={`inline-flex min-w-[30px] items-center justify-center rounded-md px-2 py-1 text-xs font-medium ${getCellTone(value)}`}
                    >
                      {value}
                    </span>
                  </td>
                ))}

                <td className="pl-3 py-3 text-center font-semibold text-slate-900">
                  {row.total}
                </td>
              </tr>
            ))}

            <tr className="border-t-2 border-[color:var(--border)]">
              <td className="py-3 pr-3 font-semibold text-slate-900">
                Sarva
              </td>

              {data.sarva.map((value, idx) => (
                <td key={idx} className="px-2 py-3 text-center">
                  <span
                    className={`inline-flex min-w-[36px] items-center justify-center rounded-md px-2 py-1 text-xs font-semibold ${getSarvaTone(value)}`}
                  >
                    {value}
                  </span>
                </td>
              ))}

              <td className="pl-3 py-3 text-center font-semibold text-slate-900">
                {data.sarva.reduce((a, b) => a + b, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}