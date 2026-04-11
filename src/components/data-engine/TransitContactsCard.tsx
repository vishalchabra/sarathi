"use client";

type ContactRow = {
  transitPlanet?: string;
  natalTarget?: string;
  natalPlanet?: string; // fallback for old data
  type?: string;
  orb?: number | null;
  exactAngle?: number | null;
  diff?: number | null;
  applying?: boolean | null;
};

type Props = {
  contacts: ContactRow[];
};

function formatOrb(v?: number | null) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}°`;
}

function formatApplying(v?: boolean | null) {
  if (v === true) return "Applying";
  if (v === false) return "Separating";
  return "—";
}

export default function TransitContactsCard({ contacts }: Props) {
  const rows = Array.isArray(contacts) ? contacts : [];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-white">
        Transit Contacts (Current)
      </h2>
      <p className="mt-1 text-sm text-white/70">
        Current aspects between transiting planets and natal positions.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-white/10 text-white/50">
            <tr>
              <th className="px-3 py-2">Transit</th>
              <th className="px-3 py-2">Natal</th>
              <th className="px-3 py-2">Aspect</th>
              <th className="px-3 py-2">Orb</th>
              <th className="px-3 py-2">Applying</th>
            </tr>
          </thead>

          <tbody>
            {rows.length ? (
              rows.map((c, i) => (
                <tr key={`${c.transitPlanet ?? "t"}-${i}`} className="border-b border-white/10">
                  <td className="px-3 py-2 text-white">
                    {c.transitPlanet ?? "—"}
                  </td>

                  <td className="px-3 py-2 text-white/80">
                    {c.natalTarget ?? c.natalPlanet ?? "—"}
                  </td>

                  <td className="px-3 py-2 text-white/80 capitalize">
                    {c.type ?? "—"}
                  </td>

                  <td className="px-3 py-2 text-white/80">
                    {formatOrb(c.orb)}
                  </td>

                  <td className="px-3 py-2 text-white/80">
                    {formatApplying(c.applying)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-white/50">
                  No active contacts
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}