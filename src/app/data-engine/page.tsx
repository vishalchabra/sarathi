"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
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
import PanchangCard from "@/components/data-engine/PanchangCard";
import MoonContextCard from "@/components/data-engine/MoonContextCard";
import PlanetStrengthCard from "@/components/data-engine/PlanetStrengthCard";
import NatalAspectsCard from "@/components/data-engine/NatalAspectsCard";
import TransitInteractionCard from "@/components/data-engine/TransitInteractionCard";
import DashaLordProfileCard from "@/components/data-engine/DashaLordProfileCard";
import NakshatraContextCard from "@/components/data-engine/NakshatraContextCard";
import VedicPlanetAspectsCard from "@/components/data-engine/VedicPlanetAspectsCard";
import VedicHouseAspectsCard from "@/components/data-engine/VedicHouseAspectsCard";
import HouseJudgementCard from "@/components/data-engine/HouseJudgementCard";
import ChartsTabView from "@/components/data-engine/ChartsTabView";
import ShadbalaCard from "@/components/data-engine/ShadbalaCard";
import AshtakvargaCard from "@/components/data-engine/AshtakvargaCard";
import PrastharaCard from "@/components/data-engine/PrastharaCard";
import BhavMadhyaCard from "@/components/data-engine/BhavMadhyaCard";
import FiveFoldFriendshipCard from "@/components/data-engine/FiveFoldFriendshipCard";
import AvakhadaCard from "@/components/data-engine/AvakhadaCard";
type TabKey = "foundations" | "timing" | "transits" | "vargas" | "charts" | "strength";

type UpcomingTransitBuckets = {
  moonTransits?: any[];
  planetaryTransits?: any[];
  allEvents?: any[];
};

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
  vedicAspects?: any;
  houseJudgement?: any;
  bhavaChalit?: any;
  classicChalit?: any;
  debugLifeReport?: any;
  vargas?: Record<string, any>;
  dasha?: {
  current?: Record<string, any>;
  timelines?: {
    md?: any[];
    adInCurrentMd?: any[];
    pdInCurrentAd?: any[];
  };
  tree?: any[];
};
  transitNow?: any;
  transitContacts?: any[];
  transitInteractions?: any[];
  upcomingTransits?: UpcomingTransitBuckets;
  transitWindows?: any[];
  selectedDate?: any;
  compare?: any | null;

  foundations?: {
    birthMeta?: any;
    ascendant?: any;
    natal?: {
      ayanamsa?: string;
      birthUTCISO?: string;
      moonLonSidDeg?: number | null;
      ascendant?: any;
      planets?: any[];
      aspects?: any[];
      strengths?: any[];
      sourceNote?: string;
      [key: string]: any;
    };
    houses?: any[];
    roles?: any;
    vedicAspects?: any;
    houseJudgement?: any;
    bhavaChalit?: any;
  };

 timing?: {
  dasha?: {
    current?: Record<string, any>;
    timelines?: {
      md?: any[];
      adInCurrentMd?: any[];
      pdInCurrentAd?: any[];
    };
    tree?: any[];
  };
    panchang?: any;
    moonContext?: any;
    selectedDate?: any;
    dashaContext?: any;
    nakshatraContext?: any;
  };

  transits?: {
    transitNow?: any;
    transitContacts?: any[];
    transitInteractions?: any[];
    transitAspects?: any[];
    upcomingEvents?: UpcomingTransitBuckets;
    transitWindows?: any[];
    compare?: any | null;
  };
  strength?: {
  shadbala?: any[];
   ashtakvarga?: {
    planets: Array<{
      planet: string;
      houses: number[];
      total: number;
    }>;
    sarva: number[];
  };
  prasthara?: Record<string, Record<string, number[]>>;
  bhavMadhya?: Array<{
  house: number;
  cusp: {
    lon: number;
    sign: string;
    degree: number;
  } | null;
  start: {
    lon: number;
    sign: string;
    degree: number;
  } | null;
  end: {
    lon: number;
    sign: string;
    degree: number;
  } | null;
}>;
fiveFoldFriendship?: Array<{
  planet: string;
  relationships: Array<{
    withPlanet: string;
    natural: string;
    temporary: string;
    final: string;
  }>;
}>;
avakhada?: {
  nakshatra: string;
  pada: number | null;
  rashi: string | null;
  gana: string;
  yoni: string;
  nadi: string;
  varna: string;
} | null;
};

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
const cityCache = new Map<string, Array<{ name: string; lat: number; lon: number }>>();

type PlaceLite = { name: string; lat: number; lon: number; tz?: string };

function LockingCityAutocomplete({
  value,
  onSelect,
  placeholder = "Start typing a city",
}: {
  value: { name: string; lat: number; lon: number } | null;
  onSelect: (p: { name: string; lat: number; lon: number } | null) => void;
  placeholder?: string;
}) {
  const [q, setQ] = React.useState(value?.name ?? "");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<
    Array<{ name: string; lat: number; lon: number }>
  >([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
  setQ(value?.name ?? "");
}, [value?.name]);

  React.useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    const query = q.trim();
    if (query.length < 3) {
      setItems([]);
      setOpen(false);
      return;
    }

    if (cityCache.has(query)) {
      setItems(cityCache.get(query)!);
      setOpen(true);
      return;
    }

    timerRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&q=${encodeURIComponent(
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
            r.address?.state_district ||
            r.address?.state ||
            r.address?.county ||
            r.address?.region;
          const country = r.address?.country || "";
          return {
            name: [city, country].filter(Boolean).join(", ") || r.display_name,
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

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [q]);

  const commit = (it: { name: string; lat: number; lon: number }) => {
    setQ(it.name);
    setItems([]);
    setOpen(false);
    onSelect(it);

    try {
      inputRef.current?.blur();
    } catch {}
  };

  const clearAll = () => {
    setQ("");
    setItems([]);
    setOpen(false);
    onSelect(null);
    try {
      inputRef.current?.focus();
    } catch {}
  };

  return (
    <div className="relative">
     <Input
  ref={inputRef}
  placeholder={placeholder}
  autoComplete="off"
  value={q}
  className="w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
        onFocus={() => {
          if (items.length) setOpen(true);
        }}
        onBlur={(e) => {
          const next = e.relatedTarget as HTMLElement | null;
          if (next && next.closest("[data-citymenu]")) return;
          setOpen(false);
        }}
        onChange={(e) => {
  const el = e.target as HTMLInputElement;
  const nextValue = e.target.value;
  const caret = el.selectionStart ?? nextValue.length;

  setQ(nextValue);

  if (value && nextValue !== value.name) {
    onSelect(null);
  }

  requestAnimationFrame(() => {
    try {
      el.setSelectionRange(caret, caret);
    } catch {}
  });
}}
      />

      {q && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/50"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clearAll}
          aria-label="Clear"
          title="Clear"
        >
          x
        </button>
      )}

      {open && (
        <div
          data-citymenu
          className="absolute z-20 mt-1 w-full rounded-md border border-white/10 bg-white/5 text-white shadow"
        >
          {loading && (
            <div className="px-3 py-2 text-sm text-white/50">Searching</div>
          )}
          {!loading && !items.length && (
            <div className="px-3 py-2 text-sm text-white/50">No results</div>
          )}
          {!loading &&
            items.map((it, i) => (
              <button
                key={`${it.name}-${i}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                className="w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                onClick={() => commit(it)}
              >
                {it.name}
                <span className="ml-2 text-xs text-white/50">
                  {it.lat.toFixed(2)}, {it.lon.toFixed(2)}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
function PrimarySignalsCard({
  strongestPlanets,
  weakestPlanets,
  keyHouses,
  currentDashaLabel,
  watchouts,
}: {
  strongestPlanets: string[];
  weakestPlanets: string[];
  keyHouses: Array<string | number>;
  currentDashaLabel: string;
  watchouts: string[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-base font-semibold text-white">Primary Signals</h2>
      <p className="mt-1 text-sm text-white/70">
        High-priority chart flags for quick astrologer review.
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/50">
            Current Dasha
          </div>
          <div className="mt-1 text-sm text-white">{currentDashaLabel || "—"}</div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/50">
            Strongest Planets
          </div>
          <div className="mt-1 text-sm text-white">
            {strongestPlanets.length ? strongestPlanets.join(", ") : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/50">
            Weakest Planets
          </div>
          <div className="mt-1 text-sm text-white">
            {weakestPlanets.length ? weakestPlanets.join(", ") : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/50">
            Key Houses
          </div>
          <div className="mt-1 text-sm text-white">
            {keyHouses.length ? keyHouses.join(", ") : "—"}
          </div>
        </div>
        <div>
  <div className="text-xs font-medium uppercase tracking-wide text-white/50">
    Watchouts
  </div>
  <div className="mt-1 text-sm text-white">
    {watchouts.length ? watchouts.join(" • ") : "—"}
  </div>
</div>
      </div>
    </div>
  );
}
export default function DataEnginePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("foundations");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [data, setData] = useState<DataEngineResponse | null>(null);
const [selectedVarga, setSelectedVarga] = useState("d9");

const [name, setName] = useState("");
const [selectedPlace, setSelectedPlace] = useState<PlaceLite | null>(null);
const [dateISO, setDateISO] = useState("");
const [time, setTime] = useState("");
const [timezone, setTimezone] = useState("Asia/Kolkata");
const [plan] = useState<"pro">("pro");
const [selectedDateISO, setSelectedDateISO] = useState(
  new Date().toISOString().slice(0, 10)
);
const [compareDateISO, setCompareDateISO] = useState("");


 async function handleGenerate() {
  if (!name.trim()) {
    setError("Please enter a name.");
    setData(null);
    return;
  }

  if (!dateISO.trim()) {
    setError("Please select a birth date.");
    setData(null);
    return;
  }

  if (!time.trim()) {
    setError("Please select a birth time.");
    setData(null);
    return;
  }

  if (!selectedPlace) {
    setError("Please select a city from the dropdown.");
    setData(null);
    return;
  }

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
          city: selectedPlace.name,
          dateISO: dateISO.trim(),
          time: time.trim(),
          timezone: timezone.trim(),
          lat: selectedPlace.lat,
          lon: selectedPlace.lon,
        },
        plan,
        selectedDateISO: selectedDateISO.trim(),
        compareDateISO: compareDateISO.trim() || null,
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

  const birthMeta = useMemo(
    () => data?.foundations?.birthMeta ?? data?.birthMeta ?? null,
    [data]
  );

  const natal = useMemo(
    () => data?.foundations?.natal ?? data?.natal ?? null,
    [data]
  );

  const planets = useMemo(
    () => data?.foundations?.natal?.planets ?? data?.natal?.planets ?? [],
    [data]
  );

  const natalStrengths = useMemo(
    () => data?.foundations?.natal?.strengths ?? data?.natal?.strengths ?? [],
    [data]
  );

  const natalAspects = useMemo(
    () => data?.foundations?.natal?.aspects ?? data?.natal?.aspects ?? [],
    [data]
  );

  const houses = useMemo(
    () => data?.foundations?.houses ?? data?.houses ?? [],
    [data]
  );

  const roles = useMemo(
    () => data?.foundations?.roles ?? data?.roles ?? null,
    [data]
  );

  const currentDasha = useMemo(
    () => data?.timing?.dasha?.current ?? data?.dasha?.current ?? {},
    [data]
  );

 
  const dashaContext = useMemo(() => data?.timing?.dashaContext ?? null, [data]);

  const transitNow = useMemo(
    () => data?.transits?.transitNow ?? data?.transitNow ?? null,
    [data]
  );

  const nakshatraContext = useMemo(
    () => data?.timing?.nakshatraContext ?? null,
    [data]
  );

  const transitContacts = useMemo(
    () => data?.transits?.transitContacts ?? data?.transitContacts ?? [],
    [data]
  );

  const transitInteractions = useMemo(
    () => data?.transits?.transitInteractions ?? data?.transitInteractions ?? [],
    [data]
  );

  const upcomingTransitItems = useMemo<UpcomingTransitBuckets | null>(() => {
    const nested = data?.transits?.upcomingEvents;
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      return nested;
    }

    const flat = data?.upcomingTransits;
    if (flat && typeof flat === "object" && !Array.isArray(flat)) {
      return flat;
    }

    return null;
  }, [data]);

  const transitWindows = useMemo(
    () => data?.transits?.transitWindows ?? data?.transitWindows ?? [],
    [data]
  );

  const vedicAspects = useMemo(
    () => data?.foundations?.vedicAspects ?? data?.vedicAspects ?? null,
    [data]
  );

  const houseJudgement = useMemo(
    () => data?.foundations?.houseJudgement ?? data?.houseJudgement ?? [],
    [data]
  );
useEffect(() => {
  if (data) {
    console.log("==== DEBUG START ====");
    console.log("natalStrengths sample:", natalStrengths?.[0]);
    console.log("houseJudgement sample:", houseJudgement?.[0]);
    console.log("FULL natalStrengths:", natalStrengths);
    console.log("FULL houseJudgement:", houseJudgement);

    console.log(
      "MOON DEBUG",
      planets.find((p: any) => p?.planet === "Moon")
    );

    console.log("==== DEBUG END ====");
  }
}, [data, natalStrengths, houseJudgement, planets]);
  const bhavaChalit = useMemo(
    () => data?.foundations?.bhavaChalit ?? data?.bhavaChalit ?? null,
    [data]
  );

  const compareData = useMemo(
    () => data?.transits?.compare ?? data?.compare ?? null,
    [data]
  );

  const panchang = useMemo(
    () => data?.timing?.panchang ?? data?.selectedDate?.panchang ?? null,
    [data]
  );
  const birthPanchang = useMemo(
  () =>
    data?.foundations?.birthMeta?.panchang ??
    data?.birthMeta?.panchang ??
    data?.foundations?.natal?.panchang ??
    data?.natal?.panchang ??
    null,
  [data]
);
const moonRow = useMemo(
  () => planets.find((p: any) => p?.planet === "Moon") ?? null,
  [planets]
);

const strongestPlanets = useMemo(() => {
  const rows = Array.isArray(natalStrengths) ? natalStrengths : [];

  const scorePlanet = (row: any) => {
    let score = 0;

    if (row?.strengthBand === "strong") score += 4;
    if (row?.strengthBand === "medium") score += 2;
    if (row?.strengthBand === "weak") score -= 2;

    if (row?.isExalted) score += 5;
    if (row?.isOwnSign) score += 4;
    if (row?.isMoolatrikona) score += 4;
    if (row?.isVargottama) score += 2;
    if (row?.isDebilitated) score -= 5;
    if (row?.combust) score -= 2;

    return score;
  };

  return rows
    .filter((row: any) =>
      ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].includes(
        String(row?.planet ?? "")
      )
    )
    .slice()
    .sort((a: any, b: any) => scorePlanet(b) - scorePlanet(a))
    .slice(0, 3)
    .map((row: any) => row?.planet)
    .filter(Boolean);
}, [natalStrengths]);

const weakestPlanets = useMemo(() => {
  const rows = Array.isArray(natalStrengths) ? natalStrengths : [];

  const scorePlanet = (row: any) => {
    let score = 0;

    if (row?.strengthBand === "strong") score += 4;
    if (row?.strengthBand === "medium") score += 2;
    if (row?.strengthBand === "weak") score -= 2;

    if (row?.isExalted) score += 5;
    if (row?.isOwnSign) score += 4;
    if (row?.isMoolatrikona) score += 4;
    if (row?.isVargottama) score += 2;
    if (row?.isDebilitated) score -= 5;
    if (row?.combust) score -= 2;

    return score;
  };

  return rows
    .filter((row: any) =>
      ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].includes(
        String(row?.planet ?? "")
      )
    )
    .slice()
    .sort((a: any, b: any) => scorePlanet(a) - scorePlanet(b))
    .slice(0, 3)
    .map((row: any) => row?.planet)
    .filter(Boolean);
}, [natalStrengths]);

const keyHouses = useMemo(() => {
  const rows = Array.isArray(houseJudgement) ? houseJudgement : [];

  const scoreHouse = (row: any) => {
    let score = 0;

    if (row?.houseStrengthLabel === "strong") score += 4;
    if (row?.houseStrengthLabel === "mixed") score += 2;
    if (row?.houseStrengthLabel === "weak") score -= 2;

    if (row?.houseLordStrengthBand === "strong") score += 3;
    if (row?.houseLordStrengthBand === "medium") score += 1;

    score += Number(row?.beneficCount ?? 0);
    score -= Number(row?.maleficCount ?? 0) * 0.5;
    score += Number(row?.occupantCount ?? 0) * 0.5;

    return score;
  };

  return rows
    .slice()
    .sort((a: any, b: any) => scoreHouse(b) - scoreHouse(a))
    .slice(0, 4)
    .map((row: any) => row?.house)
    .filter((x: any) => x !== null && x !== undefined);
}, [houseJudgement]);
const watchouts = useMemo(() => {
  const out: string[] = [];

  // Planet-based watchouts
  for (const row of natalStrengths ?? []) {
    const p = row?.planet;

    if (!p) continue;

    if (row?.isDebilitated) {
      out.push(`${p} debilitated`);
    }

    if (row?.combust) {
      out.push(`${p} combust`);
    }

    if (row?.strengthBand === "weak") {
      out.push(`${p} weak`);
    }
  }

  // House-based watchouts
  for (const row of houseJudgement ?? []) {
    const mal = Number(row?.maleficCount ?? 0);
    const ben = Number(row?.beneficCount ?? 0);

    if (mal >= 2 && mal > ben) {
      out.push(`H${row?.house} under pressure`);
    }
  }

  return out.slice(0, 4); // keep it tight
}, [natalStrengths, houseJudgement]);

const currentDashaLabel = useMemo(() => {
  const md =
    currentDasha?.md?.planet ??
    currentDasha?.mahadasha?.planet ??
    currentDasha?.md ??
    null;

  const ad =
    currentDasha?.ad?.planet ??
    currentDasha?.antardasha?.planet ??
    currentDasha?.ad ??
    null;

  if (md && ad) return `${md}–${ad}`;
  if (md) return String(md);
  return "—";
}, [currentDasha]);

  const moonContext = useMemo(
    () => data?.timing?.moonContext ?? data?.selectedDate?.moonContext ?? null,
    [data]
  );

  const vargaMap = useMemo(() => data?.vargas ?? {}, [data]);

  const vargaEntries = useMemo(() => {
    return Object.entries(vargaMap).filter(
      ([key, value]) =>
        !key.startsWith("_") &&
        key !== "sourceNote" &&
        value &&
        typeof value === "object"
    );
  }, [vargaMap]);

  const chartGalleryKeys = useMemo(() => {
    const preferredOrder = [
      "d1",
      "d2",
      "d3",
      "d4",
      "d5",
      "d7",
      "d8",
      "d9",
      "d10",
      "d12",
      "d16",
      "d20",
      "d24",
      "d27",
      "d30",
      "d40",
      "d45",
      "d60",
    ];

    const existing = new Set(vargaEntries.map(([key]) => key));
    const ordered = preferredOrder.filter((key) => existing.has(key));

    if (!ordered.includes("d1")) {
      ordered.unshift("d1");
    }

    return ordered;
  }, [vargaEntries]);

  useEffect(() => {
    if (!vargaEntries.length) return;

    const hasSelected = vargaEntries.some(([key]) => key === selectedVarga);
    if (!hasSelected) {
      setSelectedVarga(vargaEntries[0][0]);
    }
  }, [vargaEntries, selectedVarga]);

  const selectedVargaValue =
    vargaEntries.find(([key]) => key === selectedVarga)?.[1] ?? null;

  return (
    <main className="min-h-screen bg-white/5 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Sārathi Data Engine
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Technical chart data for manual analysis.
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              Plan: PRO
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-white/50">
      Name
    </label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="mt-1 w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-white/50">
      City
    </label>
    <div className="mt-1">
      <LockingCityAutocomplete
  value={selectedPlace}
  onSelect={setSelectedPlace}
  placeholder="Start typing a city"
/>
    </div>
  </div>

  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-white/50">
      Birth date
    </label>
    <input
      type="date"
      value={dateISO}
      onChange={(e) => setDateISO(e.target.value)}
      className="mt-1 w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-white/50">
      Birth time
    </label>
    <input
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      className="mt-1 w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-white/50">
      Timezone
    </label>
    <input
      value={timezone}
      onChange={(e) => setTimezone(e.target.value)}
      className="mt-1 w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-white/50">
      Selected date
    </label>
    <input
      type="date"
      value={selectedDateISO}
      onChange={(e) => setSelectedDateISO(e.target.value)}
      className="mt-1 w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-white/50">
      Compare date
    </label>
    <input
      type="date"
      value={compareDateISO}
      onChange={(e) => setCompareDateISO(e.target.value)}
      className="mt-1 w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>
</div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Data Engine"}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
          <DataEngineTabs activeTab={activeTab} onChange={setActiveTab} />

          {!data ? (
            <div className="py-12 text-center text-sm text-white/50">
              Generate to see chart data here.
            </div>
          ) : null}

         {data && activeTab === "foundations" ? (
  <div className="mt-6 space-y-8">
    <section className="space-y-4">
  <div>
    <h2 className="text-lg font-semibold text-white">Chart Identity</h2>
    <p className="text-sm text-white/50">
      Core birth details, Panchang, and high-signal chart markers.
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white shadow-sm">
  <div className="flex flex-wrap items-center gap-2">
    {natal?.ascendant?.sign ? (
      <span className="rounded-full bg-white/5/10 px-3 py-1 text-xs font-medium">
        Asc - {natal.ascendant.sign}
      </span>
    ) : null}

    {natal?.moonSign ? (
      <span className="rounded-full bg-white/5/10 px-3 py-1 text-xs font-medium">
        Moon {natal.moonSign}
      </span>
    ) : null}

    {natal?.sunSign ? (
      <span className="rounded-full bg-white/5/10 px-3 py-1 text-xs font-medium">
        Sun {natal.sunSign}
      </span>
    ) : null}

    {moonRow?.nakshatra ? (
      <span className="rounded-full bg-white/5/10 px-3 py-1 text-xs font-medium">
        {moonRow.nakshatra}
        {moonRow?.pada ? ` - Pada ${moonRow.pada}` : ""}
      </span>
    ) : null}

    <span className="rounded-full bg-white/5/10 px-3 py-1 text-xs font-medium">
      Dasha - {currentDashaLabel}
    </span>

    {strongestPlanets.length ? (
      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200">
        Strong - {strongestPlanets.join(", ")}
      </span>
    ) : null}

    {weakestPlanets.length ? (
      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-200">
        Weak - {weakestPlanets.join(", ")}
      </span>
    ) : null}

    {keyHouses.length ? (
      <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-200">
        Houses - {keyHouses.join(", ")}
      </span>
    ) : null}
  </div>
</div>

  <BirthSummaryCard birthMeta={birthMeta} natal={natal} />

  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
    {birthPanchang ? (
      <PanchangCard
        title="Birth Panchang"
        subtitle="Panchang reference for the date of birth."
        data={birthPanchang}
      />
    ) : (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
        Birth Panchang not available.
      </div>
    )}

 <PrimarySignalsCard
  strongestPlanets={strongestPlanets}
  weakestPlanets={weakestPlanets}
  keyHouses={keyHouses}
  currentDashaLabel={currentDashaLabel}
  watchouts={watchouts}
/>
  </div>
</section>

    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Natal Framework</h2>
        <p className="text-sm text-white/50">
          Base structure of the natal chart for manual judgement.
        </p>
      </div>

      <PlanetTable
        planets={planets}
        rawMode={false}
        title="D1 Planet Table"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <HouseLordTable houses={houses} />
        <FunctionalRolesCard roles={roles} />
      </div>
    </section>

    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Aspect and Strength Layer
        </h2>
        <p className="text-sm text-white/50">
          Strengths, aspects, and interaction patterns across the chart.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PlanetStrengthCard rows={natalStrengths} />
        <NatalAspectsCard rows={natalAspects} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <VedicPlanetAspectsCard data={vedicAspects} />
        <VedicHouseAspectsCard data={vedicAspects} />
      </div>
    </section>

    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">House Judgement</h2>
        <p className="text-sm text-white/50">
          Consolidated house-level judgement for quick review.
        </p>
      </div>

      <HouseJudgementCard rows={houseJudgement} />
    </section>
  </div>
) : null}

          {data && activeTab === "timing" ? (
            <div className="mt-6 space-y-6">
              <DashaBlock
  current={currentDasha}
  tree={data?.timing?.dasha?.tree ?? data?.dasha?.tree ?? []}
/>

              <DashaLordProfileCard
  data={dashaContext}
  nakshatraData={nakshatraContext?.dasha}
/>
              <NakshatraContextCard data={nakshatraContext} />

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                
              </div>
            </div>
          ) : null}

          {data && activeTab === "transits" ? (
            <div className="mt-6 space-y-6">
              <TransitTable transitNow={transitNow} />

              {transitInteractions?.length ? (
  <TransitInteractionCard rows={transitInteractions} />
) : null}

              {(upcomingTransitItems?.planetaryTransits?.length ||
                upcomingTransitItems?.moonTransits?.length) ? (
                <UpcomingTransitsCard
  data={upcomingTransitItems}
  ascSign={natal?.ascendant?.sign ?? null}
/>
              ) : null}

              {transitWindows?.length ? (
                <TransitWindowsCard windows={transitWindows} />
              ) : null}
            </div>
          ) : null}

          {data && activeTab === "vargas" ? (
            <div className="mt-6 space-y-6">
              {vargaEntries.length ? (
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium uppercase tracking-wide text-white/50">
                    Select varga
                  </label>
                  <select
                    value={selectedVarga}
                    onChange={(e) => setSelectedVarga(e.target.value)}
                    className="rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
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
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
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
{data && activeTab === "strength" ? (
  <div className="mt-6 space-y-6">

    {/* Planet Strength */}
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Planet Strength
        </h2>
        <p className="text-sm text-white/50">
          Core planetary strength metrics used for judgement.
        </p>
      </div>

      <ShadbalaCard data={data?.strength?.shadbala} />
      <AshtakvargaCard data={data?.strength?.ashtakvarga} />
      <PrastharaCard data={data?.strength?.prasthara} />
      <BhavMadhyaCard data={data?.strength?.bhavMadhya} />
      <FiveFoldFriendshipCard data={data?.strength?.fiveFoldFriendship} />
      <AvakhadaCard data={data?.strength?.avakhada} />
    </section>

  </div>
) : null}
          {data && activeTab === "charts" ? (
            <ChartsTabView
  selectedDateISO={selectedDateISO}
  setSelectedDateISO={setSelectedDateISO}
  selectedDateChartLabel={`Showing chart date: ${selectedDateISO}`}
  natalAscSign={natal?.ascendant?.sign ?? null}
  natalPlanets={planets}
  vargaMap={vargaMap}
  chartGalleryKeys={chartGalleryKeys}
  bhavaChalit={bhavaChalit}
  classicChalit={data?.classicChalit ?? null}
  birthLat={Number(birthMeta?.lat ?? 0)}
  birthLon={Number(birthMeta?.lon ?? 0)}
  birthTimezone={String(birthMeta?.timezone ?? "UTC")}
  currentMdPlanet={
    currentDasha?.md?.planet ??
    currentDasha?.mahadasha?.planet ??
    currentDasha?.md ??
    null
  }
  currentAdPlanet={
    currentDasha?.ad?.planet ??
    currentDasha?.antardasha?.planet ??
    currentDasha?.ad ??
    null
  }
  sarvaAshtakvarga={data?.strength?.ashtakvarga?.sarva ?? []}
/>
          ) : null}
        </div>
      </div>
    </main>
  );
}