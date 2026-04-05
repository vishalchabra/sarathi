"use client";

import { useMemo, useState } from "react";
import DataEngineTabs from "@/components/data-engine/DataEngineTabs";
import BirthSummaryCard from "@/components/data-engine/BirthSummaryCard";
import PlanetTable from "@/components/data-engine/PlanetTable";
import HouseLordTable from "@/components/data-engine/HouseLordTable";
import FunctionalRolesCard from "@/components/data-engine/FunctionalRolesCard";
import DashaBlock from "@/components/data-engine/DashaBlock";
import TransitTable from "@/components/data-engine/TransitTable";
import VargaCard from "@/components/data-engine/VargaCard";
import CompareCard from "@/components/data-engine/CompareCard";
import TransitContactsCard from "@/components/data-engine/TransitContactsCard";
import UpcomingTransitsCard from "@/components/data-engine/UpcomingTransitsCard";
import TransitWindowsCard from "@/components/data-engine/TransitWindowsCard";
type TabKey = "natal" | "timing" | "vargas";

type DataEngineResponse = {
  ok?: boolean;
  error?: string;

  meta?: {
    generatedAtISO: string;
    plan: "light" | "pro";
    selectedDateISO: string;
    compareDateISO: string | null;
  };

  birthMeta?: any;
  natal?: any;
  houses?: any[];
  roles?: any;
  vargas?: Record<string, any>;

  dasha?: {
    current?: Record<string, any>;
    timelines?: {
      md?: any[];
      adInCurrentMd?: any[];
      pdInCurrentAd?: any[];
    };
  };

  transitNow?: any;

  // ✅ ADD THESE TWO LINES
  transitContacts?: any[];
  upcomingTransits?: any[];
  transitWindows?: any[];
  selectedDate?: any;
  compare?: any | null;
};
const VARGA_LABELS: Record<string, string> = {
  d2: "D2 — Hora",
  d3: "D3 — Drekkana",
  d4: "D4 — Chaturthamsa",
  d5: "D5 — Panchamsa",
  d7: "D7 — Saptamsa",
  d8: "D8 — Ashtamsa",
  d9: "D9 — Navamsa",
  d10: "D10 — Dasamsa",
  d12: "D12 — Dvadasamsa",
  d16: "D16 — Shodasamsa",
  d20: "D20 — Vimsamsa",
  d24: "D24 — Chaturvimshamsa",
  d27: "D27 — Saptavimsamsa",
  d30: "D30 — Trimsamsa",
  d40: "D40 — Khavedamsa",
  d45: "D45 — Akshavedamsa",
  d60: "D60 — Shastiamsa",
};
export default function DataEnginePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("natal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<DataEngineResponse | null>(null);
  const [rawMode, setRawMode] = useState(false);
  const [selectedVarga, setSelectedVarga] = useState("d9");

  const [name, setName] = useState("Vishal");
  const [dateISO, setDateISO] = useState("1984-01-21");
  const [time, setTime] = useState("23:35");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [lat, setLat] = useState("29.97");
  const [lon, setLon] = useState("77.55");
  const [plan, setPlan] = useState<"light" | "pro">("light");
  const [selectedDateISO, setSelectedDateISO] = useState("2026-03-28");
  const [compareDateISO, setCompareDateISO] = useState("2026-06-15");

  async function handleGenerate() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/data-engine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birth: {
            name: name.trim(),
            dateISO: dateISO.trim(),
            time: time.trim(),
            timezone: timezone.trim(),
            lat: Number(lat),
            lon: Number(lon),
          },
          plan,
          selectedDateISO: selectedDateISO.trim(),
          compareDateISO: compareDateISO.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to generate Data Engine.");
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleExportJson() {
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sarathi-data-engine.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const planets = useMemo(() => data?.natal?.planets ?? [], [data]);
  const houses = useMemo(() => data?.houses ?? [], [data]);
  const currentDasha = data?.dasha?.current ?? {};
  const mdTimeline = data?.dasha?.timelines?.md ?? [];
  const adTimeline = data?.dasha?.timelines?.adInCurrentMd ?? [];
  const pdTimeline = data?.dasha?.timelines?.pdInCurrentAd ?? [];

const vargaEntries = useMemo(() => {
  const raw = data?.vargas ?? {};

  const entries = Object.entries(raw).filter(
    ([key, value]) =>
      !key.startsWith("_") &&
      key !== "sourceNote" &&
      value &&
      typeof value === "object"
  );

  if (plan === "light") {
    return entries.filter(([key]) => key === "d9" || key === "d10");
  }

  return entries;
}, [data, plan]);

  const selectedVargaValue =
    vargaEntries.find(([key]) => key === selectedVarga)?.[1] ?? null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Sārathi Data Engine
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Technical chart data for manual analysis.
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Plan: {plan.toUpperCase()}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Birth date
              </label>
              <input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Birth time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Timezone
              </label>
              <input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Latitude
              </label>
              <input
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Longitude
              </label>
              <input
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Selected date
              </label>
              <input
                type="date"
                value={selectedDateISO}
                onChange={(e) => setSelectedDateISO(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Compare date
              </label>
              <input
                type="date"
                value={compareDateISO}
                onChange={(e) => setCompareDateISO(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setPlan("light")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    plan === "light"
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-600"
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setPlan("pro")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    plan === "pro"
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-600"
                  }`}
                >
                  Pro
                </button>
              </div>

              {plan === "pro" ? (
  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
    <input
      type="checkbox"
      checked={rawMode}
      onChange={(e) => setRawMode(e.target.checked)}
    />
    Raw Mode
  </label>
) : (
  <div className="text-sm text-slate-500">
    Raw Mode is available in Pro
  </div>
)}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                disabled={!data}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export JSON
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate Data Engine"}
              </button>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <DataEngineTabs activeTab={activeTab} onChange={setActiveTab} />

          {!data ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Generate to see chart data here.
            </div>
          ) : null}

          {data && activeTab === "natal" ? (
            <div className="mt-6 space-y-6">
              <BirthSummaryCard birthMeta={data.birthMeta} natal={data.natal} />

              <PlanetTable
                planets={planets}
                rawMode={rawMode}
                title="D1 Planet Table"
              />

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <HouseLordTable houses={houses} />
                <FunctionalRolesCard roles={data.roles} />
              </div>
            </div>
          ) : null}

        {data && activeTab === "timing" ? (
  <div className="mt-6 space-y-6">
    <DashaBlock
      current={currentDasha}
      mdTimeline={mdTimeline}
      adTimeline={adTimeline}
      pdTimeline={plan === "pro" ? pdTimeline : []}
    />

    <TransitTable transitNow={data.transitNow} />

    {data?.transitContacts && (
      <TransitContactsCard contacts={data.transitContacts} />
    )}

    {data?.upcomingTransits && (
      <UpcomingTransitsCard data={data.upcomingTransits} />
    )}

    {data?.transitWindows && (
      <TransitWindowsCard windows={data.transitWindows} />
    )}

    <CompareCard compare={data.compare} isPro={plan === "pro"} />
  </div>
) : null}
          {data && activeTab === "vargas" ? (
            <div className="mt-6 space-y-6">
              {vargaEntries.length ? (
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Select varga
                  </label>
                  <select
                    value={selectedVarga}
                    onChange={(e) => setSelectedVarga(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  >
                    {vargaEntries.map(([key]) => (
                      <option key={key} value={key}>
  {VARGA_LABELS[key] ?? key.toUpperCase()}
</option>
                    ))}
                  </select>
                </div>
              ) : null}

              {!vargaEntries.length ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  No varga data available.
                </div>
              ) : null}

              {selectedVargaValue ? (
                <VargaCard
  title={VARGA_LABELS[selectedVarga] ?? selectedVarga.toUpperCase()}
  value={selectedVargaValue}
/>
              ) : null}
            </div>
            
          ) : null}
        </div>
      </div>
    </main>
  );
}