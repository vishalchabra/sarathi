"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import MediumNorthIndianChart from "@/components/data-engine/MediumNorthIndianChart";
import tzLookup from "tz-lookup";
import GunaMilanPanel from "@/components/data-engine/GunaMilanPanel";
type PlaceLite = { name: string; lat: number; lon: number; tz?: string };

const cityCache = new Map<string, Array<{ name: string; lat: number; lon: number }>>();

const SIGN_ORDER = [
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

function getHouseFromSign(sign: string | null, ascSign: string | null) {
  if (!sign || !ascSign) return null;

  const signIndex = SIGN_ORDER.findIndex((s) => s === sign);
  const ascIndex = SIGN_ORDER.findIndex((s) => s === ascSign);

  if (signIndex < 0 || ascIndex < 0) return null;

  return ((signIndex - ascIndex + 12) % 12) + 1;
}

function possessiveName(name?: string | null) {
  const clean = String(name ?? "").trim();

  if (!clean) return "Primary";

  return clean.toLowerCase().endsWith("s") ? `${clean}'` : `${clean}'s`;
}

function normalizeChartPlanets(rows: any[]): any[] {
  return (Array.isArray(rows) ? rows : [])
    .map((p) => ({
      ...p,
      planet: p?.planet ?? p?.name ?? p?.id ?? null,
      sign: p?.sign ?? p?.rashi ?? null,
      house:
        typeof p?.house === "number"
          ? p.house
          : typeof p?.houseNum === "number"
          ? p.houseNum
          : typeof p?.bhava === "number"
          ? p.bhava
          : null,
      degree:
        typeof p?.degree === "number"
          ? p.degree
          : typeof p?.deg === "number"
          ? p.deg
          : null,
      retrograde: typeof p?.retrograde === "boolean" ? p.retrograde : false,
      nakshatra: p?.nakshatra ?? p?.nakName ?? null,
      pada: p?.pada ?? null,
      combust: typeof p?.combust === "boolean" ? p.combust : false,
    }))
    .filter((p) => p?.planet);
}

function buildSynastryOverlayPlanets({
  sourcePlanets,
  targetAscSign,
  prefix,
}: {
  sourcePlanets: any[];
  targetAscSign: string | null;
  prefix: "A" | "B";
}) {
  return normalizeChartPlanets(sourcePlanets).map((p) => ({
    ...p,
    planet: p.planet,
    isSynastryOverlay: true,
    synastrySource: prefix,
    house: getHouseFromSign(p.sign, targetAscSign),
  }));
}

function buildCrossOverlayRows(sourcePlanets: any[], targetAscSign: string | null) {
  return normalizeChartPlanets(sourcePlanets).map((p) => ({
    planet: p.planet,
    sign: p.sign ?? "—",
    degree: typeof p.degree === "number" ? p.degree.toFixed(2) : "—",
    nakshatra: p.nakshatra ?? "—",
    pada: p.pada ?? "—",
    fallsInHouse: getHouseFromSign(p.sign, targetAscSign) ?? "—",
  }));
}

function normalizeTransitPlanets(planets: any[], natalAscSign: string | null): any[] {
  const ascIndex = natalAscSign ? SIGN_ORDER.findIndex((s) => s === natalAscSign) : -1;

  return (Array.isArray(planets) ? planets : [])
    .map((p) => {
      const sign = p?.sign ?? null;
      const signIndex = sign ? SIGN_ORDER.findIndex((s) => s === sign) : -1;

      return {
        planet: p?.name ?? p?.id ?? p?.planet ?? null,
        sign,
        house:
          ascIndex >= 0 && signIndex >= 0
            ? ((signIndex - ascIndex + 12) % 12) + 1
            : null,
        degree:
          typeof p?.deg === "number"
            ? p.deg
            : typeof p?.degree === "number"
            ? p.degree
            : typeof p?.lon === "number"
            ? Number((((p.lon % 30) + 30) % 30).toFixed(2))
            : null,
        retrograde: typeof p?.retrograde === "boolean" ? p.retrograde : false,
        nakshatra: p?.nakshatra ?? p?.nakName ?? null,
        pada: p?.pada ?? null,
      };
    })
    .filter((p) => p?.planet);
}

function getCurrentDashaLabel(data: any) {
  const current = data?.timing?.dasha?.current ?? data?.dasha?.current ?? {};

  const md = current?.md?.planet ?? current?.mahadasha?.planet ?? current?.md ?? null;
  const ad = current?.ad?.planet ?? current?.antardasha?.planet ?? current?.ad ?? null;
  const pd = current?.pd?.planet ?? current?.pratyantardasha?.planet ?? current?.pd ?? null;

  return [md, ad, pd].filter(Boolean).join(" / ") || "—";
}

function getVargaChart({
  key,
  natalAscSign,
  natalPlanets,
  vargaMap,
}: {
  key: "d1" | "d9";
  natalAscSign: string | null;
  natalPlanets: any[];
  vargaMap: Record<string, any>;
}) {
  if (key === "d1") {
    return {
      ascSign: natalAscSign,
      planets: normalizeChartPlanets(natalPlanets),
    };
  }

  const value = vargaMap?.[key];

  const rawPlanets =
    (Array.isArray(value?.planets) && value.planets) ||
    (Array.isArray(value?.rows) && value.rows) ||
    (Array.isArray(value?.data?.planets) && value.data.planets) ||
    [];

  const planets = normalizeChartPlanets(rawPlanets);

  const ascSign = value?.ascendant?.sign ?? value?.ascSign ?? value?.lagna?.sign ?? null;

  return { ascSign, planets };
}

function LockingCityAutocomplete({
  value,
  onSelect,
  placeholder = "Start typing a city",
}: {
  value: PlaceLite | null;
  onSelect: (p: PlaceLite | null) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PlaceLite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQ(value?.name ?? "");
  }, [value?.name]);

  useEffect(() => {
    const query = q.trim();

    if (query.length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }

    if (cityCache.has(query)) {
      setItems(cityCache.get(query)!);
      setOpen(true);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);

      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&accept-language=en&q=${encodeURIComponent(
          query
        )}`;

        const res = await fetch(url, {
          headers: { "Accept-Language": "en" },
          referrerPolicy: "no-referrer",
        });

        const json = (await res.json()) as any[];

        const out = json.map((r) => {
          const city =
            r.address?.city ||
            r.address?.town ||
            r.address?.village ||
            r.address?.municipality ||
            r.address?.hamlet ||
            r.address?.county ||
            r.address?.region;

          const state =
            r.address?.state ||
            r.address?.state_district ||
            r.address?.province ||
            r.address?.region ||
            "";

          const country = r.address?.country || "";

          return {
            name:
              [city, state, country]
                .filter(Boolean)
                .filter((value, index, arr) => arr.indexOf(value) === index)
                .join(", ") || r.display_name,
            lat: +r.lat,
            lon: +r.lon,
          };
        });

        cityCache.set(query, out);
        setItems(out);
        setOpen(true);
      } catch {
        setItems([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [q]);

  return (
    <div className="relative">
      <Input
        value={q}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => items.length && setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          if (value && e.target.value !== value.name) onSelect(null);
        }}
        className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-800"
      />

      {open ? (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-[color:var(--border)] bg-white text-slate-800 shadow-xl">
          {loading ? <div className="px-3 py-2 text-sm text-slate-500">Searching</div> : null}

          {!loading && !items.length ? (
            <div className="px-3 py-2 text-sm text-slate-500">No results</div>
          ) : null}

          {!loading &&
            items.map((it, i) => (
              <button
                key={`${it.name}-${i}`}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQ(it.name);
                  setOpen(false);
                  onSelect(it);
                }}
              >
                {it.name}
                <span className="ml-2 text-xs text-slate-400">
                  {it.lat.toFixed(2)}, {it.lon.toFixed(2)}
                </span>
              </button>
            ))}
        </div>
      ) : null}
    </div>
  );
}

function SynastryOverlayTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{
    planet: string;
    sign: string;
    degree: string;
    nakshatra: string;
    pada: string | number;
    fallsInHouse: string | number;
  }>;
}) {
  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">
        Planet placements remapped into the other person’s houses.
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Planet</th>
              <th className="px-4 py-3 text-left">Sign</th>
              <th className="px-4 py-3 text-left">Degree</th>
              <th className="px-4 py-3 text-left">Nakshatra</th>
              <th className="px-4 py-3 text-left">Pada</th>
              <th className="px-4 py-3 text-left">Falls in House</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={`${row.planet}-${idx}`} className="border-t border-[color:var(--border)]">
                <td className="px-4 py-3 font-semibold text-slate-900">{row.planet}</td>
                <td className="px-4 py-3 text-slate-700">{row.sign}</td>
                <td className="px-4 py-3 text-slate-700">{row.degree}</td>
                <td className="px-4 py-3 text-slate-700">{row.nakshatra}</td>
                <td className="px-4 py-3 text-slate-700">{row.pada}</td>
                <td className="px-4 py-3 font-semibold text-[color:var(--primary)]">
                  {row.fallsInHouse}
                </td>
              </tr>
            ))}

            {!rows.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  Generate both charts to view overlay data.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CompareLegend({
  ownerName,
  overlayName,
  showSynastry,
  showTransits,
}: {
  ownerName: string;
  overlayName: string;
  showSynastry: boolean;
  showTransits: boolean;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
      <span className="inline-flex items-center gap-1">
        <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
        {ownerName} planets
      </span>

      {showSynastry ? (
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
          {overlayName} overlay
        </span>
      ) : null}

      {showTransits ? (
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Transits
        </span>
      ) : null}
    </div>
  );
}

export default function ChartCompareTabView({
  personAData,
  personAAscSign,
  personAPlanets,
  personAVargaMap,
  personAArudhas,
  personAUpagrahas,
  personASolarShadowPoints,
  personAVedicAspects,
  selectedDateISO,
  timezone,
  plan,
}: {
  personAData: any;
  personAAscSign: string | null;
  personAPlanets: any[];
  personAVargaMap: Record<string, any>;
  personAArudhas?: Record<string, { sign: string }>;
  personAUpagrahas?: any;
  personASolarShadowPoints?: any;
  personAVedicAspects?: any;
  selectedDateISO: string;
  timezone: string;
  plan: "light" | "pro";
}) {
  const [personAChart, setPersonAChart] = useState<"d1" | "d9">("d1");
  const [personBChart, setPersonBChart] = useState<"d1" | "d9">("d1");

  const [showTransits, setShowTransits] = useState(false);
  const [showUpagrahas, setShowUpagrahas] = useState(false);
  const [showArudhas, setShowArudhas] = useState(false);
  const [showAspects, setShowAspects] = useState(false);
  const [showSynastry, setShowSynastry] = useState(false);
  const [compareMode, setCompareMode] = useState<"charts" | "guna">("charts");
  const [transitPlanets, setTransitPlanets] = useState<any[]>([]);
  const [nameB, setNameB] = useState("");
  const [placeB, setPlaceB] = useState<PlaceLite | null>(null);
  const [dateISOB, setDateISOB] = useState("");
  const [timeB, setTimeB] = useState("");
  const [timezoneB, setTimezoneB] = useState(timezone || "Asia/Kolkata");

  const [dataB, setDataB] = useState<any | null>(null);
  const [loadingB, setLoadingB] = useState(false);
  const [errorB, setErrorB] = useState("");

  const personAName =
    personAData?.birthMeta?.name ?? personAData?.foundations?.birthMeta?.name ?? "Primary";

  const personBName =
    dataB?.birthMeta?.name ?? dataB?.foundations?.birthMeta?.name ?? nameB?.trim() ?? "Second";

  const personALabel = possessiveName(personAName);
  const personBLabel = possessiveName(personBName);

  useEffect(() => {
    if (!placeB) return;

    try {
      setTimezoneB(tzLookup(placeB.lat, placeB.lon));
    } catch {}
  }, [placeB]);

  useEffect(() => {
    async function fetchTransits() {
      if (!showTransits) {
        setTransitPlanets([]);
        return;
      }

      try {
        const res = await fetch("/api/transit-chart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dateISO: selectedDateISO,
            time: "12:00",
            timezone,
            lat: 28.6139,
            lon: 77.209,
          }),
        });

        const json = await res.json();
        setTransitPlanets(json?.ok && Array.isArray(json?.planets) ? json.planets : []);
      } catch {
        setTransitPlanets([]);
      }
    }

    fetchTransits();
  }, [showTransits, selectedDateISO, timezone]);

  const personASelectedChart = useMemo(
    () =>
      getVargaChart({
        key: personAChart,
        natalAscSign: personAAscSign,
        natalPlanets: personAPlanets,
        vargaMap: personAVargaMap,
      }),
    [personAChart, personAAscSign, personAPlanets, personAVargaMap]
  );

  const personBNatal = dataB?.foundations?.natal ?? dataB?.natal ?? null;
  const personBPlanets = dataB?.foundations?.natal?.planets ?? dataB?.natal?.planets ?? [];
  const personBVargaMap = dataB?.vargas ?? {};

  const personBSelectedChart = useMemo(
    () =>
      getVargaChart({
        key: personBChart,
        natalAscSign: personBNatal?.ascendant?.sign ?? null,
        natalPlanets: personBPlanets,
        vargaMap: personBVargaMap,
      }),
    [personBChart, personBNatal, personBPlanets, personBVargaMap]
  );

  const bPlanetsInAHouses = useMemo(
    () =>
      dataB
        ? buildCrossOverlayRows(personBSelectedChart.planets, personASelectedChart.ascSign)
        : [],
    [dataB, personBSelectedChart, personASelectedChart]
  );

  const aPlanetsInBHouses = useMemo(
    () =>
      dataB
        ? buildCrossOverlayRows(personASelectedChart.planets, personBSelectedChart.ascSign)
        : [],
    [dataB, personASelectedChart, personBSelectedChart]
  );

  async function handleGeneratePersonB() {
    if (!placeB) {
      setErrorB("Please select place of birth for second chart.");
      return;
    }

    if (!dateISOB.trim() || !timeB.trim()) {
      setErrorB("Please enter birth date and birth time for second chart.");
      return;
    }

    try {
      setLoadingB(true);
      setErrorB("");

      const res = await fetch("/api/data-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth: {
            name: nameB.trim(),
            city: placeB.name,
            dateISO: dateISOB.trim(),
            time: timeB.trim(),
            timezone: timezoneB,
            lat: placeB.lat,
            lon: placeB.lon,
          },
          plan,
          selectedDateISO,
          compareDateISO: null,
        }),
      });

      const json = await res.json();

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to generate second chart.");
      }

      setDataB(json);
    } catch (e: any) {
      setErrorB(e?.message || "Something went wrong.");
    } finally {
      setLoadingB(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Compare Charts</h2>
            <p className="mt-1 text-sm text-slate-500">
              Compare the generated chart with another person’s D1 or D9 chart.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-800">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showTransits}
                onChange={(e) => setShowTransits(e.target.checked)}
              />
              Transits
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUpagrahas}
                onChange={(e) => setShowUpagrahas(e.target.checked)}
              />
              Upagrahas
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showArudhas}
                onChange={(e) => setShowArudhas(e.target.checked)}
              />
              ALs
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showAspects}
                onChange={(e) => setShowAspects(e.target.checked)}
              />
              Aspects
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSynastry}
                onChange={(e) => setShowSynastry(e.target.checked)}
              />
              Synastry
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Second Chart Details</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Name</label>
            <input
              value={nameB}
              onChange={(e) => setNameB(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">City</label>
            <div className="mt-1">
              <LockingCityAutocomplete value={placeB} onSelect={setPlaceB} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Birth date</label>
            <input
              type="date"
              value={dateISOB}
              onChange={(e) => setDateISOB(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Birth time</label>
            <input
              type="time"
              value={timeB}
              onChange={(e) => setTimeB(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Timezone</label>
            <input
              value={timezoneB}
              readOnly
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleGeneratePersonB}
            disabled={loadingB}
            className="rounded-xl bg-[color:var(--primary)] px-7 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {loadingB ? "Generating..." : "Generate Second Chart"}
          </button>
        </div>

        {errorB ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorB}
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2 rounded-3xl border border-[color:var(--border)] bg-white/80 p-3 shadow-sm">
  <button
    type="button"
    onClick={() => setCompareMode("charts")}
    className={[
      "rounded-xl px-4 py-2 text-sm font-medium transition",
      compareMode === "charts"
        ? "border border-[color:var(--border)] bg-white text-slate-900 shadow-sm"
        : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
    ].join(" ")}
  >
    Charts
  </button>

  <button
    type="button"
    onClick={() => setCompareMode("guna")}
    className={[
      "rounded-xl px-4 py-2 text-sm font-medium transition",
      compareMode === "guna"
        ? "border border-[color:var(--border)] bg-white text-slate-900 shadow-sm"
        : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
    ].join(" ")}
  >
    Guna Milan
  </button>
</div>
{compareMode === "charts" ? (
  <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-4 text-sm shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Chart A Current Dasha
          </div>
          <div className="mt-1 font-semibold text-slate-900">
            {getCurrentDashaLabel(personAData)}
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-4 text-sm shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Chart B Current Dasha
          </div>
          <div className="mt-1 font-semibold text-slate-900">
            {dataB ? getCurrentDashaLabel(dataB) : "Generate second chart"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{personALabel} Chart</h3>
              <p className="text-sm text-slate-500">Existing generated chart.</p>
            </div>

            <select
              value={personAChart}
              onChange={(e) => setPersonAChart(e.target.value as "d1" | "d9")}
              className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm"
            >
              <option value="d1">D1 — Rashi</option>
              <option value="d9">D9 — Navamsa</option>
            </select>
          </div>

          <MediumNorthIndianChart
            title={personAChart === "d1" ? `${personAName} — D1` : `${personAName} — D9`}
            ascSign={personASelectedChart.ascSign}
            planets={[
              ...personASelectedChart.planets,
              ...(showSynastry && dataB
                ? buildSynastryOverlayPlanets({
                    sourcePlanets: personBSelectedChart.planets,
                    targetAscSign: personASelectedChart.ascSign,
                    prefix: "B",
                  })
                : []),
            ]}
            transitPlanets={
              showTransits
                ? normalizeTransitPlanets(transitPlanets, personASelectedChart.ascSign)
                : []
            }
            arudhas={personAArudhas}
            upagrahas={personAUpagrahas}
            solarShadowPoints={personASolarShadowPoints}
            vedicAspects={personAVedicAspects}
            showArudhas={showArudhas}
            showUpagrahas={showUpagrahas}
            showAspects={showAspects}
            showAbbreviations={false}
            compactPlanetLabels={showSynastry}
            layoutVariant="secondary"
          />

          <CompareLegend
            ownerName={personAName}
            overlayName={personBName}
            showSynastry={showSynastry && Boolean(dataB)}
            showTransits={showTransits}
          />
        </section>

        <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{personBLabel} Chart</h3>
              <p className="text-sm text-slate-500">Generated comparison chart.</p>
            </div>

            <select
              value={personBChart}
              onChange={(e) => setPersonBChart(e.target.value as "d1" | "d9")}
              className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm"
            >
              <option value="d1">D1 — Rashi</option>
              <option value="d9">D9 — Navamsa</option>
            </select>
          </div>

          {dataB ? (
            <>
              <MediumNorthIndianChart
                title={personBChart === "d1" ? `${personBName} — D1` : `${personBName} — D9`}
                ascSign={personBSelectedChart.ascSign}
                planets={[
                  ...personBSelectedChart.planets,
                  ...(showSynastry
                    ? buildSynastryOverlayPlanets({
                        sourcePlanets: personASelectedChart.planets,
                        targetAscSign: personBSelectedChart.ascSign,
                        prefix: "A",
                      })
                    : []),
                ]}
                transitPlanets={
                  showTransits
                    ? normalizeTransitPlanets(transitPlanets, personBSelectedChart.ascSign)
                    : []
                }
                showAbbreviations={false}
                compactPlanetLabels={showSynastry}
                arudhas={dataB?.arudhas ?? {}}
                upagrahas={dataB?.foundations?.upagrahas ?? dataB?.upagrahas ?? null}
                solarShadowPoints={
                  dataB?.foundations?.solarShadowPoints ?? dataB?.solarShadowPoints ?? null
                }
                vedicAspects={dataB?.foundations?.vedicAspects ?? dataB?.vedicAspects ?? null}
                showArudhas={showArudhas}
                showUpagrahas={showUpagrahas}
                showAspects={showAspects}
                layoutVariant="secondary"
              />

              <CompareLegend
                ownerName={personBName}
                overlayName={personAName}
                showSynastry={showSynastry}
                showTransits={showTransits}
              />
            </>
          ) : (
            <div className="flex h-[520px] items-center justify-center rounded-2xl border border-dashed border-[color:var(--border)] bg-white/70 text-sm text-slate-500">
              Generate second chart to compare.
            </div>
          )}
        </section>
      </div>
  </>
) : null}
{compareMode === "guna" ? (
  <GunaMilanPanel
    personAData={personAData}
    personBData={dataB}
    
  />
) : null}
      {showSynastry ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SynastryOverlayTable
            title={`${personBName} planets in ${personAName} houses`}
            rows={bPlanetsInAHouses}
          />

          <SynastryOverlayTable
            title={`${personAName} planets in ${personBName} houses`}
            rows={aPlanetsInBHouses}
          />
        </div>
      ) : null}
    </div>
  );
}
