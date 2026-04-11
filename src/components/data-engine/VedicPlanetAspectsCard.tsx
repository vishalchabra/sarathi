type GivenAspect = {
  fromPlanet?: string;
  fromHouse?: number | null;
  toHouse?: number | null;
  aspectType?: string;
  housesAway?: number | null;
};

type ReceivedAspect = {
  toPlanet?: string;
  fromPlanet?: string;
  fromHouse?: number | null;
  toHouse?: number | null;
  aspectType?: string;
  housesAway?: number | null;
};

type PlanetAspectSummary = {
  planet?: string;
  house?: number | null;
  sign?: string | null;
  given?: GivenAspect[];
  received?: ReceivedAspect[];
};

type VedicAspectsData = {
  planets?: PlanetAspectSummary[];
} | null;

function show(value: any) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function formatGiven(rows?: GivenAspect[]) {
  if (!rows?.length) return "—";
  return rows
    .map(
      (r) =>
        `H${show(r.toHouse)} (${show(r.aspectType)})`
    )
    .join(" • ");
}

function formatReceived(rows?: ReceivedAspect[]) {
  if (!rows?.length) return "—";
  return rows
    .map(
      (r) =>
        `${show(r.fromPlanet)} from H${show(r.fromHouse)} (${show(r.aspectType)})`
    )
    .join(" • ");
}

export default function VedicPlanetAspectsCard({
  data,
}: {
  data?: VedicAspectsData;
}) {
  const rows = Array.isArray(data?.planets) ? data!.planets! : [];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Vedic Planet Aspects
        </h3>
        <p className="mt-1 text-sm text-white/70">
          Planet-wise drishti given and received.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="px-4 py-3 font-medium">Planet</th>
              <th className="px-4 py-3 font-medium">Sign</th>
              <th className="px-4 py-3 font-medium">House</th>
              <th className="px-4 py-3 font-medium">Aspects given</th>
              <th className="px-4 py-3 font-medium">Aspects received</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, idx) => (
                <tr
                  key={`${row.planet ?? "planet"}-${idx}`}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {show(row.planet)}
                  </td>
                  <td className="px-4 py-3 text-white/80">{show(row.sign)}</td>
                  <td className="px-4 py-3 text-white/80">{show(row.house)}</td>
                  <td className="px-4 py-3 text-white/80">
                    {formatGiven(row.given)}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {formatReceived(row.received)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/50">
                  No Vedic planet aspect data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}