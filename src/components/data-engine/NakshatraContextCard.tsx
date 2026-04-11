type NakshatraRow = {
  planet?: string;
  nakshatra?: string | null;
  pada?: number | null;
  nakshatraLord?: string | null;
  nakshatraLordSign?: string | null;
  nakshatraLordHouse?: number | null;
  nakshatraLordNakshatra?: string | null;
  nakshatraLordChain?: string[];
  finalNakshatraDispositor?: string | null;
  sign?: string | null;
  signNum?: number | null;
  house?: number | null;
  dispositor?: string | null;
  finalDispositor?: string | null;
  dispositorChain?: string[];
  d9Sign?: string | null;
  d10Sign?: string | null;
};

type NakshatraContextData = {
  natal?: NakshatraRow[];
  dasha?: {
    md?: NakshatraRow | null;
    ad?: NakshatraRow | null;
    pd?: NakshatraRow | null;
  };
  moonToday?: {
    nakshatra?: string | null;
    pada?: number | null;
    nakshatraLord?: string | null;
    sign?: string | null;
    houseFromLagna?: number | null;
    houseFromMoon?: number | null;
  } | null;
} | null;

function show(value: any) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function showList(values?: (string | number | null | undefined)[]) {
  const clean = (values ?? []).filter(
    (v) => v !== null && v !== undefined && String(v).trim() !== ""
  );
  return clean.length ? clean.join(" → ") : "—";
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 py-2 last:border-b-0">
      <div className="text-sm text-white/50">{label}</div>
      <div className="text-right text-sm font-medium text-white">
        {value ?? "—"}
      </div>
    </div>
  );
}

function DashaNakshatraCard({
  title,
  row,
}: {
  title: string;
  row?: NakshatraRow | null;
}) {
  if (!row) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-3 text-sm text-white/50">No data available.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-white/50">
        {title}
      </div>
      <div className="mt-1 text-lg font-semibold text-white">
        {show(row.planet)}
      </div>

      <div className="mt-4 space-y-5">
  <div>
    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
      Nakshatra Layer
    </div>
    <div>
      <InfoRow label="Nakshatra" value={show(row.nakshatra)} />
      <InfoRow label="Pada" value={show(row.pada)} />
      <InfoRow label="Nakshatra lord" value={show(row.nakshatraLord)} />
      <InfoRow
        label="Nakshatra lord sign"
        value={show(row.nakshatraLordSign)}
      />
      <InfoRow
        label="Nakshatra lord house"
        value={show(row.nakshatraLordHouse)}
      />
      <InfoRow
        label="Nakshatra lord nakshatra"
        value={show(row.nakshatraLordNakshatra)}
      />
      <InfoRow
        label="Nakshatra lord chain"
        value={showList(row.nakshatraLordChain)}
      />
      <InfoRow
        label="Nakshatra chain end"
        value={show(row.finalNakshatraDispositor)}
      />
    </div>
  </div>

  <div>
    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
      Dasha Lord Placement
    </div>
    <div>
      <InfoRow label="Dasha lord sign" value={show(row.sign)} />
      <InfoRow label="Dasha lord house" value={show(row.house)} />
      <InfoRow label="Dasha lord dispositor" value={show(row.dispositor)} />
      <InfoRow
        label="Dasha lord final dispositor"
        value={show(row.finalDispositor)}
      />
      <InfoRow
        label="Dasha lord dispositor chain"
        value={showList(row.dispositorChain)}
      />
      <InfoRow label="D9 sign" value={show(row.d9Sign)} />
      <InfoRow label="D10 sign" value={show(row.d10Sign)} />
    </div>
  </div>
</div>
    </div>
  );
}

export default function NakshatraContextCard({
  data,
}: {
  data?: NakshatraContextData;
}) {
  if (!data) return null;

  const natalRows = Array.isArray(data.natal) ? data.natal : [];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
      
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <div className="border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="text-sm font-semibold text-white">
            Natal Nakshatra Table
          </div>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="px-4 py-3 font-medium">Planet</th>
              <th className="px-4 py-3 font-medium">Nakshatra</th>
              <th className="px-4 py-3 font-medium">Pada</th>
              <th className="px-4 py-3 font-medium">Lord</th>
              <th className="px-4 py-3 font-medium">Sign</th>
              <th className="px-4 py-3 font-medium">House</th>
              <th className="px-4 py-3 font-medium">Dispositor</th>
              <th className="px-4 py-3 font-medium">Final</th>
              <th className="px-4 py-3 font-medium">Chain</th>
              <th className="px-4 py-3 font-medium">D9</th>
              <th className="px-4 py-3 font-medium">D10</th>
            </tr>
          </thead>
          <tbody>
            {natalRows.length ? (
              natalRows.map((row, idx) => (
                <tr
                  key={`${row.planet ?? "planet"}-${idx}`}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {show(row.planet)}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {show(row.nakshatra)}
                  </td>
                  <td className="px-4 py-3 text-white/80">{show(row.pada)}</td>
                  <td className="px-4 py-3 text-white/80">
                    {show(row.nakshatraLord)}
                  </td>
                  <td className="px-4 py-3 text-white/80">{show(row.sign)}</td>
                  <td className="px-4 py-3 text-white/80">{show(row.house)}</td>
                  <td className="px-4 py-3 text-white/80">
                    {show(row.dispositor)}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {show(row.finalDispositor)}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {showList(row.dispositorChain)}
                  </td>
                  <td className="px-4 py-3 text-white/80">{show(row.d9Sign)}</td>
                  <td className="px-4 py-3 text-white/80">
                    {show(row.d10Sign)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="px-4 py-6 text-center text-white/50">
                  No natal nakshatra data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}