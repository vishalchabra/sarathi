"use client";

type Props = {
  data?: {
    sign?: string | null;
    nakshatra?: string | null;
    houseFromLagna?: number | null;
    houseFromMoon?: number | null;
  } | null;
};

function labelClass() {
  return "text-xs font-medium uppercase tracking-wide text-white/50";
}

function valueClass() {
  return "mt-1 text-sm text-white";
}

export default function MoonContextCard({ data }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-white">
        Moon Context
      </h2>
      <p className="mt-1 text-sm text-white/70">
        Moon reference for selected-date timing analysis.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <div className={labelClass()}>Moon sign</div>
          <div className={valueClass()}>{data?.sign ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>Moon nakshatra</div>
          <div className={valueClass()}>{data?.nakshatra ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>House from lagna</div>
          <div className={valueClass()}>{data?.houseFromLagna ?? "—"}</div>
        </div>

        <div>
          <div className={labelClass()}>House from moon</div>
          <div className={valueClass()}>{data?.houseFromMoon ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}