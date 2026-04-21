"use client";

type LordProfile = {
  planet?: string;
  sign?: string | null;
  signNum?: number | null;
  house?: number | null;
  ruledHouses?: number[];
  nakshatra?: string | null;
  nakshatraLord?: string | null;
  dignity?: string | null;
  strengthBand?: "strong" | "medium" | "weak" | string;
  retrograde?: boolean;
  combust?: boolean;
  vargottama?: boolean;
  aspectsReceived?: string[];
  conjunctions?: string[];
  dispositor?: string | null;
  finalDispositor?: string | null;
  dispositorChain?: string[];
  d9Sign?: string | null;
  d10Sign?: string | null;
};

type DashaContextData = {
  md?: LordProfile | null;
  ad?: LordProfile | null;
  pd?: LordProfile | null;
  relationships?: {
    mdToAd?: string | null;
    adToPd?: string | null;
    mdToPd?: string | null;
  };
  activatedHouses?: number[];
} | null;

type NakshatraRow = {
  planet?: string;
  nakshatra?: string | null;
  pada?: number | null;
  nakshatraLord?: string | null;
  nakshatraLordSign?: string | null;
  nakshatraLordHouse?: number | null;
  nakshatraLordChain?: string[];
  finalNakshatraDispositor?: string | null;
};

type DashaNakshatraData = {
  md?: NakshatraRow | null;
  ad?: NakshatraRow | null;
  pd?: NakshatraRow | null;
} | null;

function formatList(values?: (string | number | null | undefined)[]) {
  const cleaned = (values ?? []).filter(
    (v) => v !== null && v !== undefined && String(v).trim() !== ""
  );
  return cleaned.length ? cleaned.join(", ") : "—";
}

function formatChain(values?: (string | number | null | undefined)[]) {
  const cleaned = (values ?? []).filter(
    (v) => v !== null && v !== undefined && String(v).trim() !== ""
  );
  return cleaned.length ? cleaned.join(" → ") : "—";
}

function formatBool(value?: boolean) {
  return value ? "Yes" : "No";
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] py-2 last:border-b-0">
      <div className="min-w-0 text-sm text-slate-900">{label}</div>
      <div className="text-right text-sm font-medium text-slate-900">
        {value ?? "—"}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  profile,
  nakshatraRow,
}: {
  title: string;
  profile?: LordProfile | null;
  nakshatraRow?: NakshatraRow | null;
}) {
  if (!profile) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-3 text-sm text-slate-900">No data available.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-900">
            {title}
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-900">
            {profile.planet ?? "—"}
          </div>
        </div>

        <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-900/80">
          {profile.strengthBand ?? "—"}
        </div>
      </div>

      <div className="mt-4 space-y-5">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-900">
            Lord Placement
          </div>
          <InfoRow label="Sign" value={profile.sign ?? "—"} />
          <InfoRow label="House" value={profile.house ?? "—"} />
          <InfoRow label="D9 sign" value={profile.d9Sign ?? "—"} />
          <InfoRow label="D10 sign" value={profile.d10Sign ?? "—"} />
          <InfoRow label="Dignity" value={profile.dignity ?? "—"} />
          <InfoRow label="Retrograde" value={formatBool(profile.retrograde)} />
          <InfoRow label="Combust" value={formatBool(profile.combust)} />
          <InfoRow label="Vargottama" value={formatBool(profile.vargottama)} />
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-900">
            Dispositor Chain
          </div>
          <InfoRow label="Dispositor" value={profile.dispositor ?? "—"} />
          <InfoRow
            label="Final dispositor"
            value={profile.finalDispositor ?? "—"}
          />
          <InfoRow
            label="Chain"
            value={formatChain(profile.dispositorChain)}
          />
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-900">
            Nakshatra Chain
          </div>
          <InfoRow label="Nakshatra" value={nakshatraRow?.nakshatra ?? "—"} />
          <InfoRow label="Pada" value={nakshatraRow?.pada ?? "—"} />
          <InfoRow
            label="Nakshatra lord"
            value={nakshatraRow?.nakshatraLord ?? "—"}
          />
          <InfoRow
            label="Nakshatra lord sign"
            value={nakshatraRow?.nakshatraLordSign ?? "—"}
          />
          <InfoRow
            label="Nakshatra lord house"
            value={nakshatraRow?.nakshatraLordHouse ?? "—"}
          />
          <InfoRow
            label="Nakshatra chain"
            value={formatChain(nakshatraRow?.nakshatraLordChain)}
          />
          <InfoRow
            label="Chain end"
            value={nakshatraRow?.finalNakshatraDispositor ?? "—"}
          />
        </div>
      </div>
    </div>
  );
}

export default function DashaLordProfileCard({
  data,
  nakshatraData,
}: {
  data?: DashaContextData;
  nakshatraData?: DashaNakshatraData;
}) {
  if (!data) return null;

  const activatedHouses = [
    data?.md?.house,
    data?.ad?.house,
    data?.pd?.house,
  ].filter((h) => typeof h === "number");

  const repetitionMap: Record<string, number> = {};
  [data?.md?.planet, data?.ad?.planet, data?.pd?.planet].forEach((p) => {
    if (!p) return;
    repetitionMap[p] = (repetitionMap[p] || 0) + 1;
  });

  const repeatingPlanets = Object.entries(repetitionMap)
    .filter(([_, count]) => count >= 2)
    .map(([planet]) => planet);

  const finalDispositors = [
    data?.md?.finalDispositor,
    data?.ad?.finalDispositor,
    data?.pd?.finalDispositor,
  ].filter(Boolean);

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Dasha Chain Context
          </h3>
          <p className="mt-1 text-sm text-slate-900">
            Placement, dispositor chain, and nakshatra chain for active MD, AD, and PD lords.
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white/80 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-900">
              Activated Houses (MD–AD–PD)
            </div>
            <div className="mt-1 text-sm font-medium text-slate-900">
              {activatedHouses.length ? activatedHouses.join(", ") : "—"}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-900">
              Repeating Planets
            </div>
            <div className="mt-1 text-sm font-medium text-slate-900">
              {repeatingPlanets.length ? repeatingPlanets.join(", ") : "None"}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-900">
              Final Dispositor Focus
            </div>
            <div className="mt-1 text-sm font-medium text-slate-900">
              {finalDispositors.length
                ? [...new Set(finalDispositors)].join(", ")
                : "—"}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          title="Mahadasha Lord"
          profile={data?.md}
          nakshatraRow={nakshatraData?.md}
        />
        <SectionCard
          title="Antardasha Lord"
          profile={data?.ad}
          nakshatraRow={nakshatraData?.ad}
        />
        <SectionCard
          title="Pratyantardasha Lord"
          profile={data?.pd}
          nakshatraRow={nakshatraData?.pd}
        />
      </div>
    </section>
  );
}