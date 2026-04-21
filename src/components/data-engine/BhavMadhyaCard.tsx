"use client";

type BhavMadhyaRow = {
  house: number;
  cusp: {
    lon: number;
    sign: string;
    degree: number;
  } | null;
  start: {
    lon: number;
    sign: string;
    degree: number;
  } | null;
  end: {
    lon: number;
    sign: string;
    degree: number;
  } | null;
};

export default function BhavMadhyaCard({
  data,
}: {
  data?: BhavMadhyaRow[];
}) {
  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 text-sm text-slate-900">
        Bhav Madhya data not available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Bhav Madhya
      </h3>
      <p className="mt-1 text-sm text-slate-900">
        House cusp centers with start and end boundaries.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] text-left text-[11px] uppercase tracking-wide text-slate-900">
              <th className="pb-2 pr-4">House</th>
              <th className="pb-2 pr-4">Start</th>
              <th className="pb-2 pr-4">Cusp</th>
              <th className="pb-2">End</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.house}
                className="border-b border-[color:var(--border)] last:border-none"
              >
                <td className="py-3 pr-4 font-medium text-slate-900">
                  {row.house}
                </td>

                <td className="py-3 pr-4 text-slate-900/80">
                  {row.start
                    ? `${row.start.sign} ${row.start.degree.toFixed(2)}°`
                    : "—"}
                </td>

                <td className="py-3 pr-4 font-semibold text-slate-900">
                  {row.cusp
                    ? `${row.cusp.sign} ${row.cusp.degree.toFixed(2)}°`
                    : "—"}
                </td>

                <td className="py-3 text-slate-900/80">
                  {row.end
                    ? `${row.end.sign} ${row.end.degree.toFixed(2)}°`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}