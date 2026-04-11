"use client";

type Props = {
  title: string;
  value: any;
};

export default function VargaCard({ title, value }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-base font-semibold text-white">{title}</h2>

        <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
          Ascendant: {value?.ascSign ?? "—"}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/50">
            <tr>
              <th className="px-3 py-2 font-medium">Planet</th>
              <th className="px-3 py-2 font-medium">Sign</th>
              <th className="px-3 py-2 font-medium">House</th>
            </tr>
          </thead>
          <tbody>
            {(value?.planets ?? []).map((p: any, idx: number) => (
              <tr key={`${title}-${p?.name ?? idx}`} className="border-b border-white/10">
                <td className="px-3 py-2 font-medium text-white">
                  {p?.name ?? "—"}
                </td>
                <td className="px-3 py-2 text-white/80">{p?.sign ?? "—"}</td>
                <td className="px-3 py-2 text-white/80">{p?.house ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}