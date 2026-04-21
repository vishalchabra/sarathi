"use client";

type Props = {
  birthMeta?: {
    name?: string;
    dateISO?: string;
    time?: string;
    timezone?: string;
    lat?: number;
    lon?: number;
    ayanamsa?: string;
    hora?: string | null;
    horaNumber?: number | null;
    horaPhase?: string | null;
    horaStartsAt?: string | null;
    horaEndsAt?: string | null;
  };
  natal?: {
    birthUTCISO?: string;
    moonLonSidDeg?: number | null;
    ascendant?: {
      sign?: string;
      degree?: number | null;
    };
    planets?: Array<{
      planet: string;
      sign: string;
    }>;
  };
};

function formatDegree(v?: number | null) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}°`;
}

function labelClass() {
  return "text-xs font-medium uppercase tracking-wide text-slate-900";
}

function valueClass() {
  return "mt-1 text-sm text-slate-900";
}

export default function BirthSummaryCard({ birthMeta, natal }: Props) {
  const planets = natal?.planets ?? [];
  const moonSign = planets.find((p) => p.planet === "Moon")?.sign ?? "—";
  const sunSign = planets.find((p) => p.planet === "Sun")?.sign ?? "—";

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Birth Summary</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <div className={labelClass()}>Name</div>
          <div className={valueClass()}>{birthMeta?.name ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Birth date</div>
          <div className={valueClass()}>{birthMeta?.dateISO ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Birth time</div>
          <div className={valueClass()}>{birthMeta?.time ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Timezone</div>
          <div className={valueClass()}>{birthMeta?.timezone ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Latitude</div>
          <div className={valueClass()}>{birthMeta?.lat ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Longitude</div>
          <div className={valueClass()}>{birthMeta?.lon ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Ayanamsa</div>
          <div className={valueClass()}>{birthMeta?.ayanamsa ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Birth UTC</div>
          <div className={valueClass()}>{natal?.birthUTCISO ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Ascendant</div>
          <div className={valueClass()}>
            {natal?.ascendant?.sign ?? "—"}
            {natal?.ascendant?.degree != null
              ? ` ${formatDegree(natal.ascendant.degree)}`
              : ""}
          </div>
        </div>

        <div>
          <div className={labelClass()}>Moon sign</div>
          <div className={valueClass()}>{moonSign}</div>
        </div>

        <div>
          <div className={labelClass()}>Sun sign</div>
          <div className={valueClass()}>{sunSign}</div>
        </div>

        <div>
  <div className={labelClass()}>Hora</div>
  <div className={valueClass()}>
    {birthMeta?.hora
      ? `${birthMeta.hora} Hora${
          birthMeta?.horaNumber ? ` (${birthMeta.horaNumber})` : ""
        }${
          birthMeta?.horaPhase ? ` • ${birthMeta.horaPhase}` : ""
        }${
          birthMeta?.horaStartsAt && birthMeta?.horaEndsAt
            ? ` • ${birthMeta.horaStartsAt}-${birthMeta.horaEndsAt}`
            : ""
        }`
      : "—"}
  </div>
</div>

        <div>
          <div className={labelClass()}>Moon longitude</div>
          <div className={valueClass()}>
            {formatDegree(natal?.moonLonSidDeg)}
          </div>
        </div>
      </div>
    </div>
  );
}