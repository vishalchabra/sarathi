"use client";

type Props = {
  contacts: any[];
};

export default function TransitContactsCard({ contacts }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Transit Contacts (Current)
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-3 py-2">Transit</th>
              <th className="px-3 py-2">Natal</th>
              <th className="px-3 py-2">Aspect</th>
              <th className="px-3 py-2">Orb</th>
              <th className="px-3 py-2">Applying</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length ? (
              contacts.map((c, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-3 py-2">{c.transitPlanet}</td>
                  <td className="px-3 py-2">{c.natalPlanet}</td>
                  <td className="px-3 py-2 capitalize">{c.type}</td>
                  <td className="px-3 py-2">{c.orb}°</td>
                  <td className="px-3 py-2">
                    {c.applying ? "Yes" : "No"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-slate-500">
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