"use client";

type Props = {
  title?: string;
  subtitle?: string;
  data?: {
    dateISO?: string;
    weekday?: string;
    tithi?: string | null;
    nakshatra?: string | null;
    yoga?: string | null;
    karana?: string | null;
    sunrise?: string | null;
    sunset?: string | null;
  } | null;
};

function labelClass() {
  return "text-xs font-medium uppercase tracking-wide text-white/50";
}

function valueClass() {
  return "mt-1 text-sm text-white";
}

export default function PanchangCard({
  title = "Panchang",
  subtitle = "Day-level reference data for manual timing analysis.",
  data,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-white">
  {title}
</h2>
<p className="mt-1 text-sm text-white/70">
  {subtitle}
</p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <div className={labelClass()}>Date</div>
          <div className={valueClass()}>{data?.dateISO ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Weekday</div>
          <div className={valueClass()}>{data?.weekday ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Tithi</div>
          <div className={valueClass()}>{data?.tithi ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Nakshatra</div>
          <div className={valueClass()}>{data?.nakshatra ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Yoga</div>
          <div className={valueClass()}>{data?.yoga ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Karana</div>
          <div className={valueClass()}>{data?.karana ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Sunrise</div>
          <div className={valueClass()}>{data?.sunrise ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Sunset</div>
          <div className={valueClass()}>{data?.sunset ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}