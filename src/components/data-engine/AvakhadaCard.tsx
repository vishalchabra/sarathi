"use client";

export default function AvakhadaCard({
  data,
}: {
  data?: {
    nakshatra: string;
    pada: number | null;
    rashi: string | null;
    gana: string;
    yoni: string;
    nadi: string;
    varna: string;
  } | null;
}) {
  if (!data) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 text-sm text-slate-900">
        Avakhada Chakra not available.
      </div>
    );
  }

  const rows = [
    ["Nakshatra", data.nakshatra],
    ["Pada", data.pada ?? "—"],
    ["Rashi", data.rashi ?? "—"],
    ["Gana", data.gana],
    ["Yoni", data.yoni],
    ["Nadi", data.nadi],
    ["Varna", data.varna],
  ];

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Avakhada Chakra
      </h3>
      <p className="mt-1 text-sm text-slate-900">
        Birth signature based on Moon nakshatra.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <span className="text-xs text-slate-900">{label}</span>
            <span className="mt-1 font-medium text-slate-900">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}