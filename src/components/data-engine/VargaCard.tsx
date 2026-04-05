"use client";

type Props = {
  title: string;
  value: any;
};

export default function VargaCard({ title, value }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>

        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Ascendant: {value?.ascSign ?? "—"}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Planet</th>
              <th className="px-3 py-2 font-medium">Sign</th>
              <th className="px-3 py-2 font-medium">House</th>
            </tr>
          </thead>
          <tbody>
            {(value?.planets ?? []).map((p: any, idx: number) => (
              <tr key={`${title}-${p?.name ?? idx}`} className="border-b border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-900">
                  {p?.name ?? "—"}
                </td>
                <td className="px-3 py-2 text-slate-700">{p?.sign ?? "—"}</td>
                <td className="px-3 py-2 text-slate-700">{p?.house ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}