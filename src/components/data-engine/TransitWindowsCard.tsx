"use client";

type Props = {
  windows: any[];
};

export default function TransitWindowsCard({ windows }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-white">
        Transit Windows
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-white/10 text-white/50">
            <tr>
              <th className="px-3 py-2">Transit</th>
              <th className="px-3 py-2">Natal</th>
              <th className="px-3 py-2">Start</th>
              <th className="px-3 py-2">Peak</th>
              <th className="px-3 py-2">End</th>
              <th className="px-3 py-2">Min Orb</th>
              <th className="px-3 py-2">Hits</th>
            </tr>
          </thead>

          <tbody>
            {windows.length ? (
              windows.map((w, i) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="px-3 py-2">{w.transitPlanet}</td>
                  <td className="px-3 py-2">{w.natalPlanet}</td>
                  <td className="px-3 py-2">{w.startISO}</td>
                  <td className="px-3 py-2">{w.peakISO}</td>
                  <td className="px-3 py-2">{w.endISO}</td>
                  <td className="px-3 py-2">{w.minOrb}°</td>
                  <td className="px-3 py-2">{w.hitCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-white/50">
                  No transit windows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}