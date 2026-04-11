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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Vedic House Aspects
        </h3>
        <p className="mt-1 text-sm text-white/70">
          House-wise drishti received from natal planets.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="px-4 py-3 font-medium">House</th>
              <th className="px-4 py-3 font-medium">Aspected by</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, idx) => (
                <tr
                  key={`house-${row.house ?? idx}`}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {show(row.house)}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {formatAspectingPlanets(row.aspectedBy)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-white/50">
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