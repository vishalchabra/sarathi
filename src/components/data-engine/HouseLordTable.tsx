"use client";

type HouseRow = {
  house: number;
  sign: string;
  signNum?: number;
  lord: string;
  lordPlacedHouse: number | null;
  lordPlacedSign: string | null;
};

type Props = {
  houses: HouseRow[];
};

export default function HouseLordTable({ houses }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-white">House Lords</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/50">
            <tr>
              <th className="px-3 py-2 font-medium">House</th>
              <th className="px-3 py-2 font-medium">Sign</th>
              <th className="px-3 py-2 font-medium">Lord</th>
              <th className="px-3 py-2 font-medium">Lord in House</th>
              <th className="px-3 py-2 font-medium">Lord in Sign</th>
            </tr>
          </thead>
          <tbody>
            {houses.map((h) => (
              <tr key={h.house} className="border-b border-white/10">
                <td className="px-3 py-2 text-white">{h.house}</td>
                <td className="px-3 py-2 text-white/80">{h.sign}</td>
                <td className="px-3 py-2 text-white/80">{h.lord}</td>
                <td className="px-3 py-2 text-white/80">
                  {h.lordPlacedHouse ?? "—"}
                </td>
                <td className="px-3 py-2 text-white/80">
                  {h.lordPlacedSign ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}