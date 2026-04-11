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
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
        Bhav Madhya data not available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-white">
        Bhav Madhya
      </h3>
      <p className="mt-1 text-sm text-white/50">
        House cusp centers with start and end boundaries.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wide text-white/50">
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
                className="border-b border-white/10 last:border-none"
              >
                <td className="py-3 pr-4 font-medium text-white">
                  {row.house}
                </td>

                <td className="py-3 pr-4 text-white/80">
                  {row.start
                    ? `${row.start.sign} ${row.start.degree.toFixed(2)}°`
                    : "—"}
                </td>

                <td className="py-3 pr-4 font-semibold text-white">
                  {row.cusp
                    ? `${row.cusp.sign} ${row.cusp.degree.toFixed(2)}°`
                    : "—"}
                </td>

                <td className="py-3 text-white/80">
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