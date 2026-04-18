"use client";

import React from "react";

function getOrdinalSuffix(n: number) {
  if (n >= 11 && n <= 13) return "th";

  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

type UpagrahaPoint = {
  phase: "day" | "night" | null;
  weekday: string | null;
  segmentIndex: number | null;
  spanStartISO: string | null;
  spanEndISO: string | null;
  segmentStartISO: string | null;
  segmentEndISO: string | null;
  pointMomentISO: string | null;
  pointMomentType: "start" | "midpoint" | null;
  lon: number | null;
  sign: string | null;
  degree: number | null;
  nakshatra: string | null;
  pada: number | null;
  houseFromAsc: number | null;
  flags?: {
    isDusthana?: boolean;
    isUpachaya?: boolean;
    isKendra?: boolean;
    isTrikona?: boolean;
    isMaraka?: boolean;
  };
  interpretation?: {
    summary?: string;
    practicalReading?: string;
    caution?: string;
    birthContext?: string;
  } | null;
};

export default function UpagrahaCard({
  title,
  point,
  methodLabel,
}: {
  title: string;
  point: UpagrahaPoint | null | undefined;
  methodLabel?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-white shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-white/45">
        {title}
      </div>

      {!point ? (
        <div className="mt-2 text-white/50">No {title} data available.</div>
      ) : (
        <div className="mt-3 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-lg font-semibold text-white">
                {point.sign ?? "—"}
                {point.houseFromAsc
                  ? ` • ${point.houseFromAsc}${getOrdinalSuffix(point.houseFromAsc)} House`
                  : ""}
              </div>

              {point.flags?.isDusthana ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                  Dusthana
                </span>
              ) : null}

              {point.flags?.isUpachaya ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                  Upachaya
                </span>
              ) : null}

              {point.flags?.isKendra ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                  Kendra
                </span>
              ) : null}

              {point.flags?.isTrikona ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                  Trikona
                </span>
              ) : null}

              {point.flags?.isMaraka ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                  Maraka
                </span>
              ) : null}
            </div>

            <div className="mt-1 text-sm text-white/65">
              {point.nakshatra ?? "—"}
              {point.pada ? ` • Pada ${point.pada}` : ""}
              {point.degree != null ? ` • ${point.degree}°` : ""}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-white/45">Method</div>
              <div className="mt-1 text-white/85">{methodLabel ?? "—"}</div>
            </div>

            <div>
              <div className="text-white/45">Birth Basis</div>
              <div className="mt-1 text-white/85 capitalize">
                {point.phase ?? "—"} • {point.weekday ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-white/45">Segment</div>
              <div className="mt-1 text-white/85">{point.segmentIndex ?? "—"}</div>
            </div>

            <div>
              <div className="text-white/45">Longitude</div>
              <div className="mt-1 text-white/85">
                {point.lon != null ? `${point.lon.toFixed(2)}°` : "—"}
              </div>
            </div>

            <div>
              <div className="text-white/45">Point Type</div>
              <div className="mt-1 text-white/85 capitalize">
                {point.pointMomentType ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-white/45">Point Moment</div>
              <div className="mt-1 text-white/85">
                {point.pointMomentISO
                  ? new Date(point.pointMomentISO).toLocaleString()
                  : "—"}
              </div>
            </div>
          </div>

          {point.interpretation?.summary ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-medium uppercase tracking-wide text-white/45">
                Interpretation
              </div>
              <div className="mt-2 space-y-2 text-sm text-white/80">
                <p>{point.interpretation.summary}</p>
                {point.interpretation.practicalReading ? (
                  <p>{point.interpretation.practicalReading}</p>
                ) : null}
                {point.interpretation.caution ? (
                  <p className="text-amber-200/90">{point.interpretation.caution}</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}