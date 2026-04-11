"use client";

type FriendshipRow = {
  planet: string;
  relationships: Array<{
    withPlanet: string;
    natural: string;
    temporary: string;
    final: string;
  }>;
};

function getTone(final: string) {
  if (final === "Great Friend") return "bg-emerald-100 text-emerald-800";
  if (final === "Friend") return "bg-green-50 text-green-700";
  if (final === "Neutral") return "bg-white/10 text-white/80";
  if (final === "Enemy") return "bg-amber-100 text-amber-800";
  if (final === "Great Enemy") return "bg-red-100 text-red-800";
  return "bg-white/10 text-white/80";
}

export default function FiveFoldFriendshipCard({
  data,
}: {
  data?: FriendshipRow[];
}) {
  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
        Five-fold friendship data not available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-white">
        Five-Fold Friendship
      </h3>
      <p className="mt-1 text-sm text-white/50">
        Natural, temporary, and final relationship status between planets.
      </p>

      <div className="mt-4 space-y-6">
        {data.map((row) => (
          <div key={row.planet}>
            <h4 className="mb-2 text-sm font-semibold text-white/90">
              {row.planet}
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wide text-white/50">
                    <th className="pb-2 pr-4">With</th>
                    <th className="pb-2 pr-4">Natural</th>
                    <th className="pb-2 pr-4">Temporary</th>
                    <th className="pb-2">Final</th>
                  </tr>
                </thead>

                <tbody>
                  {row.relationships.map((rel) => (
                    <tr
                      key={`${row.planet}-${rel.withPlanet}`}
                      className="border-b border-white/10 last:border-none"
                    >
                      <td className="py-3 pr-4 font-medium text-white">
                        {rel.withPlanet}
                      </td>

                      <td className="py-3 pr-4 text-white/80">
                        {rel.natural}
                      </td>

                      <td className="py-3 pr-4 text-white/80">
                        {rel.temporary}
                      </td>

                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getTone(
                            rel.final
                          )}`}
                        >
                          {rel.final}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}