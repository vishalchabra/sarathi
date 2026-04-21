"use client";

type Props = {
  compare?: any | null;
  isPro?: boolean;
};

export default function CompareCard({ compare, isPro = false }: Props) {
  if (!isPro) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Compare Mode</h2>
        <div className="mt-3 text-sm text-slate-900">
          Compare Mode is available in Pro.
        </div>
      </div>
    );
  }

  if (!compare) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Compare Mode</h2>
        <div className="mt-3 text-sm text-slate-900">No compare data available.</div>
      </div>
    );
  }

  const changes = Array.isArray(compare?.transitChanges)
  ? compare.transitChanges
  : [];

const natalRows = Array.isArray(compare?.natalRows)
  ? compare.natalRows
  : [];

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Compare Mode</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-900">
            Date A
          </div>
          <div className="mt-1 text-sm text-slate-900">
            {compare?.dateAISO ?? "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-900">
            Date B
          </div>
          <div className="mt-1 text-sm text-slate-900">
            {compare?.dateBISO ?? "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-900">
            Dasha changed
          </div>
          <div className="mt-1 text-sm text-slate-900">
            {compare?.dashaChanged ? "Yes" : "No"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-900">
            Transit changes
          </div>
          <div className="mt-1 text-sm text-slate-900">{changes.length}</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white/80 p-4">
          <div className="text-sm font-medium text-slate-900">Dasha on Date A</div>
          <pre className="mt-2 overflow-x-auto text-xs text-slate-900/80">
            {JSON.stringify(compare?.dashaA ?? {}, null, 2)}
          </pre>
        </div>

        <div className="rounded-xl bg-white/80 p-4">
          <div className="text-sm font-medium text-slate-900">Dasha on Date B</div>
          <pre className="mt-2 overflow-x-auto text-xs text-slate-900/80">
            {JSON.stringify(compare?.dashaB ?? {}, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
  <table className="min-w-full text-left text-sm">
    <thead className="border-b border-[color:var(--border)] text-slate-900">
      <tr>
        <th className="px-3 py-2 font-medium">Planet</th>
        <th className="px-3 py-2 font-medium">Natal Sign</th>
        <th className="px-3 py-2 font-medium">Date A Sign</th>
        <th className="px-3 py-2 font-medium">Date B Sign</th>
        <th className="px-3 py-2 font-medium">Natal House</th>
        <th className="px-3 py-2 font-medium">Date A House</th>
        <th className="px-3 py-2 font-medium">Date B House</th>
      </tr>
    </thead>
    <tbody>
      {natalRows.length ? (
        natalRows.map((row: any, idx: number) => (
          <tr key={`${row?.planet ?? "p"}-${idx}`} className="border-b border-[color:var(--border)]">
            <td className="px-3 py-2 font-medium text-slate-900">
              {row?.planet ?? "—"}
            </td>
            <td className="px-3 py-2 text-slate-900/80">
              {row?.natalSign ?? "—"}
            </td>
            <td className="px-3 py-2 text-slate-900/80">
              {row?.dateASign ?? "—"}
            </td>
            <td className="px-3 py-2 text-slate-900/80">
              {row?.dateBSign ?? "—"}
            </td>
            <td className="px-3 py-2 text-slate-900/80">
              {row?.natalHouse ?? "—"}
            </td>
            <td className="px-3 py-2 text-slate-900/80">
              {row?.dateAHouse ?? "—"}
            </td>
            <td className="px-3 py-2 text-slate-900/80">
              {row?.dateBHouse ?? "—"}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={7} className="px-3 py-4 text-sm text-slate-900">
            No compare data available.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
    </div>
  );
}