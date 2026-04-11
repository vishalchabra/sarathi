type HouseJudgementRow = {
  house?: number;
  sign?: string | null;
  lord?: string | null;
  lordHouse?: number | null;
  lordSign?: string | null;
  occupants?: string[];
  occupantCount?: number;
  aspectedBy?: string[];
  aspectingPlanetsDetailed?: Array<{
    planet?: string;
    fromHouse?: number | null;
    aspectType?: string;
  }>;
  beneficCount?: number;
  maleficCount?: number;
  houseLordStrengthBand?: "strong" | "medium" | "weak" | string;
  houseStrengthLabel?: "strong" | "mixed" | "challenged" | string;
  summaryLine?: string;
};

function show(value: any) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function showList(values?: (string | null | undefined)[]) {
  const clean = (values ?? []).filter(
    (v) => v !== null && v !== undefined && String(v).trim() !== ""
  );
  return clean.length ? clean.join(", ") : "—";
}

function showAspectDetails(
  rows?: Array<{
    planet?: string;
    fromHouse?: number | null;
    aspectType?: string;
  }>
) {
  if (!rows?.length) return "—";
  return rows
    .map(
      (r) =>
        `${show(r.planet)} from H${show(r.fromHouse)} (${show(r.aspectType)})`
    )
    .join(" • ");
}

function badgeTone(value?: string | null) {
  const raw = String(value ?? "").toLowerCase();
  if (raw === "strong") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (raw === "challenged" || raw === "weak") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}
function capitalize(val?: string) {
  if (!val) return "";
  return val.charAt(0).toUpperCase() + val.slice(1);
}
function getNetSignal(row: any) {
  const benefic = Number(row?.beneficCount ?? 0);
  const malefic = Number(row?.maleficCount ?? 0);

  const net = benefic - malefic;

  if (net >= 2) return "Strong support";
  if (net >= 0) return "Moderate support";
  if (net === -1) return "Mild pressure";
  return "High pressure";
}
export default function HouseJudgementCard({
  rows,
}: {
  rows?: HouseJudgementRow[];
}) {
  const data = Array.isArray(rows) ? rows : [];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-white">
          House Judgement Layer
        </h3>
        <p className="mt-1 text-sm text-white/70">
          House-wise occupants, aspects, lord placement, and strength summary.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
  {data.map((row, idx) => (
    <div
      key={`house-card-${row.house ?? idx}`}
      className={`rounded-2xl border ${
  row.houseStrengthLabel === "strong"
    ? "border-green-300"
    : row.houseStrengthLabel === "challenged"
    ? "border-red-300"
    : "border-white/10"
} bg-white/5 p-4 shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-white/50">House</div>
          <div className="text-lg font-semibold text-white">
            {show(row.house)} — {show(row.sign)}
          </div>
        </div>

        <div className="text-xs text-white/50">
          Lord: <span className="font-medium text-white">{show(row.lord)}</span>
        </div>
      </div>

        {/* Body */}
        <div className="mt-4 space-y-2 text-sm">
            <div className="text-sm text-white/80">
  {row.summaryLine ?? "—"}
</div>
            <div>
            <span className="text-white/50">Lord placement: </span>
            <span className="text-white font-medium">
  {row.lord
    ? `${show(row.lordSign)} (H${show(row.lordHouse)})`
    : "—"}
</span>
            </div>

          <div className="space-y-1.5">
  <div>
    <span className="text-white/50">Occupants: </span>
    <span className="text-white font-medium">
      {showList(row.occupants)}
    </span>
  </div>

  <div className="text-xs text-white/50">
    Count: {show(row.occupantCount)}
  </div>
</div>

            <div className="space-y-1.5">
  <div>
    <span className="text-white/50">Influences: </span>
    <span className="text-white font-medium">
      {showList(row.aspectedBy)}
    </span>
  </div>

  <div className="text-xs leading-5 text-white/50">
    {showAspectDetails(row.aspectingPlanetsDetailed)}
  </div>
</div>
            <div>
  <span className="text-white/50">Net signal: </span>
  <span className="font-medium text-white">
    {getNetSignal(row)}
  </span>
</div>

            <div className="flex gap-3 pt-2">
            <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badgeTone(
                row.houseLordStrengthBand
                )}`}
            >
                {`Lord: ${capitalize(row.houseLordStrengthBand)}`}
            </span>

            <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badgeTone(
                row.houseStrengthLabel
                )}`}
            >
                {`House: ${capitalize(row.houseStrengthLabel)}`}
            </span>
            </div>
        </div>
    </div>
  ))}
</div>
      </div>
    </section>
  );
}