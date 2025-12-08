"use client";

import { useEffect, useMemo, useState } from "react";

type ProfileIn = {
  name?: string;
  dobISO?: string;
  tob?: string;
  placeLabel?: string;
  place?: { name?: string; tz?: string; lat?: number; lon?: number };
};
type Props = { data?: any; profile?: ProfileIn };

function pick<T>(...vals: (T | undefined)[]) {
  for (const v of vals) if (v !== undefined && v !== null && v !== "") return v;
  return undefined;
}

function signOf(data: any, planet: "Sun" | "Moon") {
  const arr =
    Array.isArray(data?.placements) &&
    data.placements.find(
      (p: any) => (p?.planet || "").toLowerCase() === planet.toLowerCase()
    )?.sign;
  const obj = data?.planets?.[planet]?.sign;
  const sum = planet === "Sun" ? data?.summary?.sunSign : data?.summary?.moonSign;
  return pick(arr, obj, sum);
}

function ascOf(data: any) {
  return pick(data?.houses?.asc?.sign, data?.ascendant?.sign, data?.summary?.ascSign);
}

export default function LifeReport({ data: dataProp, profile: profileProp }: Props) {
  // 1) Restore a previous cache (so refresh doesn’t blank the page)
  const [cached, setCached] = useState<{ data?: any; profile?: any } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sarathi.lifeReportCache");
      if (raw) setCached(JSON.parse(raw));
    } catch {}
  }, []);

  // 2) Merge: prefer live props, else cached
  const data = dataProp || cached?.data || {};
  const profile = profileProp || cached?.profile || {};

  // 3) Save to cache whenever fresh props arrive
  useEffect(() => {
    if (!dataProp && !profileProp) return;
    try {
      localStorage.setItem(
        "sarathi.lifeReportCache",
        JSON.stringify({ data: dataProp || cached?.data, profile: profileProp || cached?.profile })
      );
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(dataProp), JSON.stringify(profileProp)]);

  // 4) Quick facts
  const sun = useMemo(() => signOf(data, "Sun"), [data]);
  const moon = useMemo(() => signOf(data, "Moon"), [data]);
  const asc = useMemo(() => ascOf(data), [data]);

  const tz =
    profile?.place?.tz ||
    (typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined);

  // helpers for ui
  const hasPlacements = Array.isArray(data?.placements) && data.placements.length > 0;
  const hasHouses = Boolean(data?.houses);
  const hasPanchang = Boolean(data?.panchang);
  const hasDasha = Boolean(data?.dasha);

  return (
    <section className="space-y-6">
      {/* ====== HERO / MINI HEADER ====== */}
      <div className="p-4 rounded bg-black text-white/90 space-y-3">
        <h2 className="text-lg font-semibold">Your Life Report</h2>
        <p className="text-sm text-white/70">
          Guided read on where you are energetically right now.
        </p>

        <div className="text-xs grid sm:grid-cols-2 gap-x-8 gap-y-1">
          <div>name: {profile?.name || "—"}</div>
          <div>dob: {profile?.dobISO || "—"}</div>
          <div>tob: {profile?.tob || "—"}</div>
          <div>tz: {tz || "—"}</div>
          <div>
            lat/lon:{" "}
            {profile?.place?.lat != null && profile?.place?.lon != null
              ? `${profile.place.lat}/${profile.place.lon}`
              : "—"}
          </div>
          <div>place: {profile?.place?.name || profile?.placeLabel || "—"}</div>
        </div>

        <div className="p-3 rounded bg-white/10 text-sm">
          This is your anchor space. The goal is not “you’re doomed / you’re blessed,” the
          goal is “here’s what your chart is asking from you right now so you don’t burn
          out or panic jump.”
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded bg-white/5">
            <div className="text-xs uppercase text-white/60">Sun</div>
            <div className="font-medium">{sun || "—"}</div>
          </div>
          <div className="p-3 rounded bg-white/5">
            <div className="text-xs uppercase text-white/60">Moon</div>
            <div className="font-medium">{moon || "—"}</div>
          </div>
          <div className="p-3 rounded bg-white/5">
            <div className="text-xs uppercase text-white/60">Asc</div>
            <div className="font-medium">{asc || "—"}</div>
          </div>
          <div className="p-3 rounded bg-white/5">
            <div className="text-xs uppercase text-white/60">House Sys</div>
            <div className="font-medium">{data?.houses?.system || data?.hsys || "—"}</div>
          </div>
        </div>
      </div>

      {/* ====== WARNINGS ====== */}
      {Array.isArray(data?.warnings) && data.warnings.length > 0 && (
        <div className="rounded border border-amber-300 bg-amber-50 p-3">
          <div className="font-medium mb-1">Ephemeris warnings</div>
          <ul className="list-disc pl-5 text-sm">
            {data.warnings.map((w: string, i: number) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ====== PLACEMENTS ====== */}
      {hasPlacements && (
        <section className="card p-4 space-y-2 rounded border">
          <h3 className="text-base font-semibold">Placements (Sidereal)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-2 py-1 border">Planet</th>
                  <th className="px-2 py-1 border">Sign</th>
                  <th className="px-2 py-1 border">Deg°</th>
                  <th className="px-2 py-1 border">Nakshatra</th>
                  <th className="px-2 py-1 border">Pada</th>
                </tr>
              </thead>
              <tbody>
                {data.placements.map((p: any, i: number) => (
                  <tr key={i} className={i % 2 ? "bg-slate-50/60" : undefined}>
                    <td className="px-2 py-1 border">{p.planet}</td>
                    <td className="px-2 py-1 border">{p.sign}</td>
                    <td className="px-2 py-1 border">
                      {typeof p.degInSign === "number" ? `${p.degInSign.toFixed(2)}°` : "—"}
                    </td>
                    <td className="px-2 py-1 border">{p.nakshatra ?? p.nak ?? "—"}</td>
                    <td className="px-2 py-1 border">{p.pada ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ====== HOUSES ====== */}
      {hasHouses && (
        <section className="card p-4 space-y-2 rounded border">
          <h3 className="text-base font-semibold">
            Ascendant & Houses ({data.houses.system || data.hsys || "—"})
          </h3>

          <div className="text-sm flex flex-wrap gap-6">
            {data.houses.asc && (
              <div>
                <b>Asc</b>: {data.houses.asc.sign}{" "}
                {typeof data.houses.asc.degInSign === "number"
                  ? `${data.houses.asc.degInSign.toFixed(2)}°`
                  : ""}
              </div>
            )}
            {data.houses.mc && (
              <div>
                <b>MC</b>: {data.houses.mc.sign}{" "}
                {typeof data.houses.mc.degInSign === "number"
                  ? `${data.houses.mc.degInSign.toFixed(2)}°`
                  : ""}
              </div>
            )}
          </div>

          {Array.isArray(data.houses.cuspsSidereal) &&
            data.houses.cuspsSidereal.length === 12 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-2 py-1 border">House</th>
                      <th className="px-2 py-1 border">Sign</th>
                      <th className="px-2 py-1 border">Deg°</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.houses.cuspsSidereal.map((deg: number, i: number) => {
                      const d = ((deg % 360) + 360) % 360;
                      const signIdx = Math.floor(d / 30);
                      const signs = [
                        "Aries",
                        "Taurus",
                        "Gemini",
                        "Cancer",
                        "Leo",
                        "Virgo",
                        "Libra",
                        "Scorpio",
                        "Sagittarius",
                        "Capricorn",
                        "Aquarius",
                        "Pisces",
                      ];
                      const sign = signs[signIdx];
                      const degInSign = d % 30;
                      return (
                        <tr key={i} className={i % 2 ? "bg-slate-50/60" : undefined}>
                          <td className="px-2 py-1 border">{i + 1}</td>
                          <td className="px-2 py-1 border">{sign}</td>
                          <td className="px-2 py-1 border">{degInSign.toFixed(2)}°</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      )}

      {/* ====== PANCHANG ====== */}
      {hasPanchang && (
        <section className="card p-4 space-y-2 rounded border">
          <h3 className="text-base font-semibold">Pañchāṅga</h3>
          <div className="text-sm grid sm:grid-cols-2 gap-2">
            <div>
              <b>Weekday:</b> {data.panchang.weekday ?? "—"}
            </div>
            {data.panchang.tithi && (
              <div>
                <b>Tithi:</b> {data.panchang.tithi.paksha} {data.panchang.tithi.name} (
                {data.panchang.tithi.num})
              </div>
            )}
            {data.panchang.nakshatra && (
              <div>
                <b>Nakshatra:</b> {data.panchang.nakshatra.name} — Pāda{" "}
                {data.panchang.nakshatra.pada}
              </div>
            )}
            {data.panchang.yoga && (
              <div>
                <b>Yoga:</b> {data.panchang.yoga.name}
              </div>
            )}
            {data.panchang.karana && (
              <div>
                <b>Karana:</b> {data.panchang.karana.name}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ====== DASHA ====== */}
      {hasDasha && (
        <section className="card p-4 space-y-1 rounded border">
          <h3 className="text-base font-semibold">Vimśottarī Daśā</h3>
          <div className="text-sm">
            <div>
              <b>MD</b>: {data.dasha.md} (
              {data.dasha.mdStart ? new Date(data.dasha.mdStart).toDateString() : "—"} →{" "}
              {data.dasha.mdEnd ? new Date(data.dasha.mdEnd).toDateString() : "—"})
            </div>
            <div>
              <b>AD</b>: {data.dasha.ad} (
              {data.dasha.adStart ? new Date(data.dasha.adStart).toDateString() : "—"} →{" "}
              {data.dasha.adEnd ? new Date(data.dasha.adEnd).toDateString() : "—"})
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
