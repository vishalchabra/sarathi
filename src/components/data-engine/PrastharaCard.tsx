"use client";

type PrastharaData = Record<
  string,
  Record<string, number[]>
>;

export default function PrastharaCard({
  data,
}: {
  data?: PrastharaData;
}) {
  if (!data) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 text-sm text-slate-900">
        Prasthara data not available.
      </div>
    );
  }

  const planets = Object.keys(data);

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Prasthara Ashtakvarga
      </h3>
      <p className="mt-1 text-sm text-slate-900">
        Detailed bindu contributions by each planet.
      </p>

      <div className="mt-4 space-y-6">
        {planets.map((planet) => {
          const contributors = data[planet];

          return (
            <div key={planet}>
              <h4 className="mb-2 text-sm font-semibold text-slate-900/90">
                {planet}
              </h4>

              <div className="overflow-x-auto">
                <table className="min-w-[900px] text-xs">
                  <thead>
                    <tr className="text-slate-900">
                      <th className="text-left pr-2">From</th>
                      {Array.from({ length: 12 }, (_, i) => (
                        <th key={i} className="px-1 text-center">
                          {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(contributors).map(
                      ([fromPlanet, values]) => (
                        <tr key={fromPlanet}>
                          <td className="pr-2 font-medium text-slate-900/80">
                            {fromPlanet}
                          </td>

                          {values.map((v, i) => (
                            <td key={i} className="px-1 text-center">
                              <span
                                className={`inline-flex w-5 h-5 items-center justify-center rounded text-[10px] ${
                                  v === 1
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-white/10 text-slate-900"
                                }`}
                              >
                                {v}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}