"use client";

type Props = {
  data: any[];
};

export default function UpcomingTransitsCard({ data }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Upcoming Transits (Next 30 Days)
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Transit</th>
              <th className="px-3 py-2">Natal</th>
              <th className="px-3 py-2">Orb</th>
            </tr>
          </thead>

          <tbody>
            {data.length ? (
              data.map((r, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-3 py-2">{r.dateISO}</td>
                  <td className="px-3 py-2">{r.transitPlanet}</td>
                  <td className="px-3 py-2">{r.natalPlanet}</td>
                  <td className="px-3 py-2">{r.orb}°</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-slate-500">
                  No upcoming contacts
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}