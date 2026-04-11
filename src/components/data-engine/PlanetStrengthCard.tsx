"use client";

type StrengthRow = {
  planet?: string;
  sign?: string;
  signLord?: string | null;
  dignity?: string;
  relationshipToSignLord?: string;
  isOwnSign?: boolean;
  isExalted?: boolean;
  isDebilitated?: boolean;
  isMoolatrikona?: boolean;
  isVargottama?: boolean;
  retrograde?: boolean;
  combust?: boolean;
  combustDistanceDeg?: number | null;
  isCombustSevere?: boolean;
  strengthBand?: string;
};

type Props = {
  rows?: StrengthRow[];
};

function yesNo(v?: boolean) {
  return v ? "Yes" : "No";
}

function formatDeg(v?: number | null) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}°`;
}

export default function PlanetStrengthCard({ rows }: Props) {
  const data = Array.isArray(rows) ? rows : [];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-white">
        Planet Strength
      </h2>
      <p className="mt-1 text-sm text-white/70">
        Sign dignity, relationship to sign lord, combustion condition, and
        vargottama support.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/50">
            <tr>
              <th className="px-3 py-2">Planet</th>
              <th className="px-3 py-2">Sign</th>
              <th className="px-3 py-2">Dignity</th>
              <th className="px-3 py-2">Sign Lord</th>
              <th className="px-3 py-2">Relation</th>
              <th className="px-3 py-2">Combust Dist.</th>
              <th className="px-3 py-2">Severe Combust</th>
              <th className="px-3 py-2">Band</th>
              <th className="px-3 py-2">Vargottama</th>
            </tr>
          </thead>

          <tbody>
            {data.length ? (
              data.map((r, i) => (
                <tr
                  key={`${r.planet ?? "planet"}-${i}`}
                  className="border-b border-white/10"
                >
                  <td className="px-3 py-2 text-white">
                    {r.planet ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-white/80">
                    {r.sign ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-white/80">
                    {r.dignity ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-white/80">
                    {r.signLord ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-white/80 capitalize">
                    {r.relationshipToSignLord ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-white/80">
                    {formatDeg(r.combustDistanceDeg)}
                  </td>
                  <td className="px-3 py-2 text-white/80">
                    {yesNo(r.isCombustSevere)}
                  </td>
                  <td className="px-3 py-2 text-white/80 capitalize">
                    {r.strengthBand?.replace(/_/g, " ") ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-white/80">
                    {yesNo(r.isVargottama)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-3 py-4 text-white/50">
                  No strength data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}