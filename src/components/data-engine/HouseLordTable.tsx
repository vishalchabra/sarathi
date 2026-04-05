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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">House Lords</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
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
              <tr key={h.house} className="border-b border-slate-100">
                <td className="px-3 py-2 text-slate-900">{h.house}</td>
                <td className="px-3 py-2 text-slate-700">{h.sign}</td>
                <td className="px-3 py-2 text-slate-700">{h.lord}</td>
                <td className="px-3 py-2 text-slate-700">
                  {h.lordPlacedHouse ?? "—"}
                </td>
                <td className="px-3 py-2 text-slate-700">
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