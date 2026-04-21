type HouseAspectRow = {
  house?: number;
  aspectedBy?: Array<{
    planet?: string;
    fromHouse?: number | null;
    aspectType?: string;
    housesAway?: number | null;
  }>;
};

type VedicHouseAspectsData = {
  houses?: HouseAspectRow[];
} | null;

function show(value: any) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function formatAspectingPlanets(
  rows?: Array<{
    planet?: string;
    fromHouse?: number | null;
    aspectType?: string;
    housesAway?: number | null;
  }>
) {
  if (!rows?.length) return "—";

  return rows
    .map(
      (r) =>
        `${show(r.planet)} from H${show(r.fromHouse)} (${show(r.aspectType)})`
    )
    .join(" • ");
}

export default function VedicHouseAspectsCard({
  data,
}: {
  data?: VedicHouseAspectsData;
}) {
  const rows = Array.isArray(data?.houses) ? data!.houses! : [];

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Vedic House Aspects
        </h3>
        <p className="mt-1 text-sm text-slate-900">
          House-wise drishti received from natal planets.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[color:var(--border)]">
        <table className="min-w-full text-sm">
          <thead className="bg-white/80">
            <tr className="border-b border-[color:var(--border)] text-left text-slate-900">
              <th className="px-4 py-3 font-medium">House</th>
              <th className="px-4 py-3 font-medium">Aspected by</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, idx) => (
                <tr
                  key={`house-${row.house ?? idx}`}
                  className="border-b border-[color:var(--border)] last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {show(row.house)}
                  </td>
                  <td className="px-4 py-3 text-slate-900/80">
                    {formatAspectingPlanets(row.aspectedBy)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-slate-900">
                  No Vedic house aspect data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}