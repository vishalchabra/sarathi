"use client";

import React, { useMemo } from "react";
import type {
  KpPlanetOnCuspData,
  KpPlanetOnCuspHit,
} from "@/lib/astrology/kp/types";


function getAspectTone(code: string) {
  switch (code) {
    case "CONJ":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "TRIN":
    case "SEXT":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
       case "SQUR":
    case "OPPN":
    case "SSQU":
    case "SESQ":
    case "SQQD":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "QCUN":
    case "NONL":
    case "QUIN":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-[color:var(--border)] bg-white text-slate-700";
  }
}
const PLANET_LABELS: Record<string, string> = {
  Sun: "SUN",
  Moon: "MOON",
  Mars: "MARS",
  Mercury: "MERC",
  Jupiter: "JUPT",
  Venus: "VENU",
  Saturn: "SATN",
  Rahu: "RAHU",
  Ketu: "KETU",
  Uranus: "URAN",
  Neptune: "NEPT",
  Pluto: "PLUT",
};
export default function KpPlanetOnCuspCard({
  data,
}: {
  data: KpPlanetOnCuspData | null | undefined;
}) {
  const planets = useMemo(() => {
  return [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Rahu",
    "Ketu",
    "Uranus",
    "Neptune",
    "Pluto",
  ];
}, []);

  const matrix = useMemo(() => {
    const out: Record<string, Record<number, KpPlanetOnCuspHit | null>> = {};

    for (const planet of planets) {
      out[planet] = {};
      for (let cusp = 1; cusp <= 12; cusp += 1) {
        out[planet][cusp] = null;
      }
    }

    for (const cuspEntry of data?.cusps ?? []) {
      for (const hit of cuspEntry.hits ?? []) {
        if (!hit?.planet) continue;
        if (!out[hit.planet]) out[hit.planet] = {};
        out[hit.planet][cuspEntry.cusp] = hit;
      }
    }

    return out;
  }, [data, planets]);

  if (!data?.cusps?.length) {
    return (
      <div className="rounded-2xl astro-card p-5 shadow-sm ring-1 ring-black/5">
        <h2 className="text-base font-semibold text-slate-900">Planet on KP Cusp</h2>
        <p className="mt-1 text-sm text-slate-600">
          KP cusp contacts are not available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl astro-card p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Planet on KP Cusp</h2>
          <p className="mt-1 text-sm text-slate-600">
            Planet-to-cusp aspect matrix with orb values.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1">
            System: {data.system}
          </span>
          <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1">
            Zodiac: {data.zodiac}
          </span>
          {data.ayanamsa ? (
            <span className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1">
              Ayanamsa: {data.ayanamsa}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[color:var(--border)] bg-white">
        <table className="min-w-[1100px] w-full border-collapse text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-[color:var(--border)]">
              <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-900">
                Planet
              </th>

              {data.cusps.map((cusp: any) => (
                <th
                  key={cusp.cusp}
                  className="min-w-[82px] px-3 py-3 text-center font-semibold text-slate-900"
                >
                  <div>C{cusp.cusp}</div>
                  <div className="mt-1 text-[11px] font-normal text-slate-500">
                    {cusp.sign} {Number(cusp.degreeInSign ?? 0).toFixed(2)}°
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {planets.map((planet) => (
              <tr key={PLANET_LABELS[planet] ?? planet} className="border-b border-[color:var(--border)] last:border-b-0">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-900">
                  {PLANET_LABELS[planet] ?? planet}
                </td>

                {data.cusps.map((cusp) => {
                  const hit = matrix?.[planet]?.[cusp.cusp] ?? null;

                  return (
                    <td key={`${PLANET_LABELS[planet] ?? planet}-${cusp.cusp}`} className="px-2 py-2 text-center align-middle">
                      {!hit ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        <div
                          className={`inline-flex min-w-[58px] flex-col items-center rounded-xl border px-2 py-1 ${getAspectTone(
                            hit.aspectCode
                          )}`}
                        >
                          <span className="text-[11px] font-semibold leading-none">
                            {hit.aspectCode}
                          </span>
                          <span className="mt-1 text-[11px] leading-none">
                            {hit.orb.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.aspectSet?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.aspectSet.map((a: any) => (
            <span
              key={`${a.code}-${a.angle}`}
              className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-xs text-slate-600"
            >
              {a.code} {a.angle}° ±{a.maxOrb}°
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}