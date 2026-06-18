"use client";

type SthanaBreakdownRow = {
  division: string;
  sign: string | null;
  signLord?: string | null;
  signLordSign?: string | null;
  relationship: string;
  virupas: number;
};

type ShadbalaInsight = {
  planet: string;
  strength: "strong" | "medium" | "weak";
  tone: "support" | "mixed" | "pressure";
  summary: string;
  usageNote: string;
};

type ShadbalaRow = {
  planet: string;
  total: number;
  status?: "Strong" | "Medium" | "Weak";

  uchchaBala?: number;
  saptavargajaBala?: number;
  ojhayugmaBala?: number;
  kendraBala?: number;
  drekkanaBala?: number;
  totalSthanaBala?: number;

  totalDigBala?: number;

  natonnathaBala?: number;
  pakshaBala?: number;
  tribhagaBala?: number;
  abdaBala?: number;
  masaBala?: number;
  varaBala?: number;
  horaBala?: number;
  ayanaBala?: number;
  yuddhaBala?: number;
  totalKalaBala?: number;

  totalCheshtaBala?: number;
  totalNaisargikaBala?: number;
  totalDrikBala?: number;

  totalShadbalaVirupas?: number;
  shadbalaRupas?: number;
  minimumRequirement?: number;
  ratio?: number;
  relativeRank?: number;
  ishtaPhala?: number;
  kashtaPhala?: number;

  sthana: number;
  sthanaVirupas?: number;
  sthanaBreakdown?: SthanaBreakdownRow[];
  dig: number;
  kala: number;
  chestha: number;
  naisargika: number;
  drik: number;
};

function getStrengthLabel(status: "Strong" | "Medium" | "Weak") {
  if (status === "Strong") {
    return {
      label: "Strong",
      tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };
  }

  if (status === "Medium") {
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

function getInsightTone(tone: ShadbalaInsight["tone"]) {
  if (tone === "support") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (tone === "pressure") {
    return "border-red-200 bg-red-50 text-red-800";
  }

  return "border-amber-200 bg-amber-50 text-amber-800";
}

function fmt(value: any, label?: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  if (label === "Planet Strength Rank") {
    return String(Math.round(value));
  }

  return value.toFixed(2);
}

function formatRelationship(value: string) {
  return String(value || "—")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

export default function ShadbalaCard({
  data,
  insights,
}: {
  data?: ShadbalaRow[];
  insights?: ShadbalaInsight[];
}) {
  if (!data || !data.length) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 text-sm text-slate-900">
        Shadbala data not available.
      </div>
    );
  }

  const planets = data.map((row) => row.planet);

  const tableRows = [
    { label: "Uchcha Bala", getValue: (r: ShadbalaRow) => r.uchchaBala },
    {
      label: "Saptavargaja Bala",
      getValue: (r: ShadbalaRow) => r.saptavargajaBala ?? r.sthanaVirupas,
    },
    {
      label: "Ojhayugmarasyamsa Bala",
      getValue: (r: ShadbalaRow) => r.ojhayugmaBala,
    },
    { label: "Kendra Bala", getValue: (r: ShadbalaRow) => r.kendraBala },
    { label: "Drekkana Bala", getValue: (r: ShadbalaRow) => r.drekkanaBala },
    {
      label: "Total Sthana Bala",
      getValue: (r: ShadbalaRow) => r.totalSthanaBala,
    },
    { label: "Total Dig Bala", getValue: (r: ShadbalaRow) => r.totalDigBala },
    {
      label: "Natonnatha Bala",
      getValue: (r: ShadbalaRow) => r.natonnathaBala,
    },
    { label: "Paksha Bala", getValue: (r: ShadbalaRow) => r.pakshaBala },
    { label: "Tribhaga Bala", getValue: (r: ShadbalaRow) => r.tribhagaBala },
    { label: "Abda Bala", getValue: (r: ShadbalaRow) => r.abdaBala },
    { label: "Masa Bala", getValue: (r: ShadbalaRow) => r.masaBala },
    { label: "Vara Bala", getValue: (r: ShadbalaRow) => r.varaBala },
    { label: "Hora Bala", getValue: (r: ShadbalaRow) => r.horaBala },
    { label: "Ayana Bala", getValue: (r: ShadbalaRow) => r.ayanaBala },
    { label: "Yuddha Bala", getValue: (r: ShadbalaRow) => r.yuddhaBala },
    {
      label: "Total Kala Bala",
      getValue: (r: ShadbalaRow) => r.totalKalaBala,
    },
    {
      label: "Total Cheshta Bala",
      getValue: (r: ShadbalaRow) => r.totalCheshtaBala,
    },
    {
      label: "Total Naisargika Bala",
      getValue: (r: ShadbalaRow) => r.totalNaisargikaBala,
    },
    { label: "Total Drik Bala", getValue: (r: ShadbalaRow) => r.totalDrikBala },
    {
      label: "Total Shad Bala",
      getValue: (r: ShadbalaRow) => r.totalShadbalaVirupas,
    },
    {
      label: "Shadbala in Rupas",
      getValue: (r: ShadbalaRow) => r.shadbalaRupas ?? r.total,
    },
    {
      label: "Minimum Requirement",
      getValue: (r: ShadbalaRow) => r.minimumRequirement,
    },
    { label: "Ratio", getValue: (r: ShadbalaRow) => r.ratio },
    { label: "Planet Strength Rank", getValue: (r: ShadbalaRow) => r.relativeRank },
    { label: "Ishta Phala", getValue: (r: ShadbalaRow) => r.ishtaPhala },
    { label: "Kashta Phala", getValue: (r: ShadbalaRow) => r.kashtaPhala },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          Shadbala Strength
        </h3>
        <p className="mt-1 text-sm text-slate-900">
          Planetary strength summary in rupas, with component totals in virupas.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-left text-[11px] uppercase tracking-wide text-slate-900">
                <th className="pb-2 pr-4">Planet</th>
                <th className="pb-2 pr-4">Rupas</th>
                <th className="pb-2 pr-4">Virupas</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 pr-4">Ratio</th>
                <th className="pb-2 pr-4">Rank</th>
                <th className="pb-2 pr-4">Sthana</th>
                <th className="pb-2 pr-4">Dig</th>
                <th className="pb-2 pr-4">Kala</th>
                <th className="pb-2 pr-4">Cheshta</th>
                <th className="pb-2 pr-4">Naisargika</th>
                <th className="pb-2">Drik</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => {
                const status = getStrengthLabel(row.status ?? "Medium");

                return (
                  <tr
                    key={row.planet}
                    className="border-b border-[color:var(--border)] last:border-none"
                  >
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {row.planet}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      {fmt(row.shadbalaRupas ?? row.total)}
                    </td>
                    <td className="py-3 pr-4 text-slate-900/80">
                      {fmt(row.totalShadbalaVirupas)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${status.tone}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-900/80">
                      {fmt(row.ratio)}
                    </td>
                    <td className="py-3 pr-4 text-slate-900/80">
                      {row.relativeRank ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-slate-900/80">
                      {fmt(row.sthana)}
                    </td>
                    <td className="py-3 pr-4 text-slate-900/80">
                      {fmt(row.dig)}
                    </td>
                    <td className="py-3 pr-4 text-slate-900/80">
                      {fmt(row.kala)}
                    </td>
                    <td className="py-3 pr-4 text-slate-900/80">
                      {fmt(row.chestha)}
                    </td>
                    <td className="py-3 pr-4 text-slate-900/80">
                      {fmt(row.naisargika)}
                    </td>
                    <td className="py-3 text-slate-900/80">{fmt(row.drik)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {insights?.length ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Planet Strength Insights
          </h3>
          <p className="mt-1 text-sm text-slate-900">
            How each planet should be treated when it becomes active through
            dasha, transit, lordship, or house activation.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
            {insights.map((insight) => {
  const matchingRow = data.find((r) => r.planet === insight.planet);

  const normalizedStrength =
  (matchingRow?.status ?? insight.strength ?? "Medium").toLowerCase();

const normalizedTone =
  normalizedStrength === "strong"
    ? "support"
    : normalizedStrength === "weak"
      ? "pressure"
      : "mixed";

const normalizedSummary =
  normalizedStrength === "strong"
    ? `${insight.planet} has good Shadbala support. When activated, it can deliver results with better stability and expression.`
    : normalizedStrength === "weak"
      ? `${insight.planet} has low Shadbala. When activated, it may show delay, pressure, friction, or weaker results.`
      : `${insight.planet} has moderate Shadbala. When activated, results may come but need support from dasha, house strength, and transit confirmation.`;

const normalizedUsageNote =
  normalizedStrength === "strong"
    ? `Use ${insight.planet} as a supportive factor when judging dasha, transit, house activation, or lordship results.`
    : normalizedStrength === "weak"
      ? `Treat ${insight.planet} as a caution factor. Its activation may show effort, delay, instability, or corrective karma.`
      : `Use ${insight.planet} cautiously. It can support results if other chart factors are also favorable.`;

  return (
              <div
                key={insight.planet}
                className={`rounded-xl border p-4 ${getInsightTone(
  normalizedTone
)}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold">
                    {insight.planet} — {normalizedStrength.toUpperCase()}
                  </div>
                  <div className="rounded-full border border-current/20 bg-white/50 px-2.5 py-1 text-xs font-medium">
                    {normalizedTone}
                  </div>
                </div>

                <p className="mt-2 text-sm leading-relaxed">
                  {normalizedSummary}
                </p>
                <p className="mt-2 text-xs leading-relaxed opacity-80">
                  {normalizedUsageNote}
                </p>
              </div>
            );
})}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          Shad Bala Table
        </h3>
        <p className="mt-1 text-sm text-slate-900">
          Classical component-wise strength table in virupas unless stated
          otherwise.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-left text-[11px] uppercase tracking-wide text-slate-900">
                <th className="pb-2 pr-4">Component</th>
                {planets.map((planet) => (
                  <th key={planet} className="pb-2 pr-4">
                    {planet}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableRows.map((item) => (
                <tr
                  key={item.label}
                  className="border-b border-[color:var(--border)] last:border-none"
                >
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {item.label}
                  </td>
                  {data.map((row) => (
                    <td
                      key={`${item.label}-${row.planet}`}
                      className="py-3 pr-4 text-slate-900/80"
                    >
                      {fmt(item.getValue(row), item.label)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          Saptavargaja Bala Breakdown
        </h3>
        <p className="mt-1 text-sm text-slate-900">
          Division-wise sign relationship and virupa contribution.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {data.map((row) => (
            <div
              key={`breakdown-${row.planet}`}
              className="rounded-xl border border-[color:var(--border)] bg-white/70 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="font-semibold text-slate-900">
                  {row.planet}
                </div>
                <div className="text-xs font-medium text-slate-500">
                  {fmt(row.saptavargajaBala ?? row.sthanaVirupas)} virupas
                </div>
              </div>

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[color:var(--border)] text-left uppercase tracking-wide text-slate-500">
                    <th className="pb-2 pr-2">Div</th>
                    <th className="pb-2 pr-2">Sign</th>
                    <th className="pb-2 pr-2">Relation</th>
                    <th className="pb-2 text-right">Virupas</th>
                  </tr>
                </thead>
                <tbody>
                  {(row.sthanaBreakdown ?? []).map((b) => (
                    <tr
                      key={`${row.planet}-${b.division}`}
                      className="border-b border-[color:var(--border)] last:border-none"
                    >
                      <td className="py-2 pr-2 font-medium text-slate-900">
                        {b.division}
                      </td>
                      <td className="py-2 pr-2 text-slate-700">
                        {b.sign ?? "—"}
                      </td>
                      <td className="py-2 pr-2 text-slate-700">
                        {formatRelationship(b.relationship)}
                      </td>
                      <td className="py-2 text-right text-slate-700">
                        {fmt(b.virupas)}
                      </td>
                    </tr>
                  ))}

                  {!row.sthanaBreakdown?.length ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-3 text-center text-slate-500"
                      >
                        Breakdown not available.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}