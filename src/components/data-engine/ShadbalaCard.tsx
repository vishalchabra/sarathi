"use client";

type ShadbalaRow = {
  planet: string;
  total: number;
  sthana: number;
  dig: number;
  kala: number;
  chestha: number;
  naisargika: number;
  drik: number;
};

function getStrengthLabel(value: number) {
  if (value >= 1.2) {
    return {
      label: "Strong",
      tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };
  }

  if (value >= 1.0) {
    return {
      label: "Medium",
      tone: "text-amber-700 bg-amber-50 border-amber-200",
    };
  }

  return {
    label: "Weak",
    tone: "text-red-700 bg-red-50 border-red-200",
  };
}

export default function ShadbalaCard({
  data,
}: {
  data?: ShadbalaRow[];
}) {
  if (!data || !data.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
        Shadbala data not available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-white">
        Shadbala Strength
      </h3>
      <p className="mt-1 text-sm text-white/50">
        Total and component-wise planetary strength in rupa.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wide text-white/50">
              <th className="pb-2 pr-4">Planet</th>
              <th className="pb-2 pr-4">Total</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Sthana</th>
              <th className="pb-2 pr-4">Dig</th>
              <th className="pb-2 pr-4">Kala</th>
              <th className="pb-2 pr-4">Chestha</th>
              <th className="pb-2 pr-4">Naisargika</th>
              <th className="pb-2">Drik</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => {
              const status = getStrengthLabel(row.total);

              return (
                <tr
                  key={row.planet}
                  className="border-b border-white/10 last:border-none"
                >
                  <td className="py-3 pr-4 font-medium text-white">
                    {row.planet}
                  </td>

                  <td className="py-3 pr-4 font-semibold text-white">
                    {row.total.toFixed(2)}
                  </td>

                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${status.tone}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="py-3 pr-4 text-white/80">{row.sthana.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-white/80">{row.dig.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-white/80">{row.kala.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-white/80">{row.chestha.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-white/80">{row.naisargika.toFixed(2)}</td>
                  <td className="py-3 text-white/80">{row.drik.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}