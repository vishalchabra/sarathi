"use client";

import Link from "next/link";
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
import UpcomingTransitsCard from "@/components/data-engine/UpcomingTransitsCard";
import TransitWindowsCard from "@/components/data-engine/TransitWindowsCard";
import PanchangCard from "@/components/data-engine/PanchangCard";
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
import tzLookup from "tz-lookup";
import UpagrahaCard from "@/components/data-engine/UpagrahaCard";
import KpPlanetOnCuspCard from "@/components/data-engine/KpPlanetOnCuspCard";
import { formatKpPlanetOnCuspForAstroSage } from "@/lib/astrology/kp/formatKpPlanetOnCuspForAstroSage";

type TabKey =
  | "foundations"
  | "timing"
  | "transits"
  | "vargas"
  | "charts"
  | "strength"
  | "utilities";

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
  upagrahas?: any;
  solarShadowPoints?: any;
  bhavaChalit?: any;
  classicChalit?: any;
  debugLifeReport?: any;
  kpPlanetOnCusp?: any;
  vargas?: Record<string, any>;
  arudhas?: Record<string, { sign: string }>;

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
  kpPlanetOnCusp?: any;
  bhavaChalit?: any;
  upagrahas?: any;
  solarShadowPoints?: any;
  personalStrength?: {
    tarabalam?: any;
    chandrabalam?: any;
    natalMoonNakshatra?: string | null;
    natalMoonSign?: string | null;
    transitMoonNakshatra?: string | null;
    transitMoonSign?: string | null;
  };
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
    utilities?: {
      dateISO?: string;
      horaDateISO?: string;
      time?: string;
      place?: {
        name?: string;
        lat?: number;
        lon?: number;
        timezone?: string;
      };
      timezone?: string;
      panchang?: any;
      hora?: {
        horaLord?: string | null;
        horaNumber?: number | null;
        phase?: string | null;
        startsAt?: string | null;
        endsAt?: string | null;
      } | null;
    };
    personalStrength?: {
  tarabalam?: any;
  chandrabalam?: any;
  natalMoonNakshatra?: string | null;
  natalMoonSign?: string | null;
  transitMoonNakshatra?: string | null;
  transitMoonSign?: string | null;
};
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
    kpPlanetOnCusp?: any;
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
  const [items, setItems] = React.useState<Array<{ name: string; lat: number; lon: number }>>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timerRef = React.useRef<number | null>(null);
  
  React.useEffect(() => {
    setQ(value?.name ?? "");
  }, [value?.name]);

  React.useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

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

timerRef.current = window.setTimeout(async () => {
  setLoading(true);
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&accept-language=en&q=${encodeURIComponent(query)}`;

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
    name: [city, state, country]
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
        className="w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[color:var(--primary)]"
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
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400"
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
          className="absolute z-20 mt-1 w-full rounded-md border border-[color:var(--border)] bg-white text-slate-800 shadow-xl"
        >
          {loading && <div className="px-3 py-2 text-sm text-slate-500">Searching</div>}
          {!loading && !items.length && (
            <div className="px-3 py-2 text-sm text-slate-500">No results</div>
          )}
          {!loading &&
            items.map((it, i) => (
              <button
                key={`${it.name}-${i}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                onClick={() => commit(it)}
              >
                {it.name}
                <span className="ml-2 text-xs text-slate-400">
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
    <div className="rounded-2xl astro-card p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="text-base font-semibold text-slate-900">Primary Signals</h2>
      <p className="mt-1 text-sm text-slate-600">
        High-priority chart flags for quick astrologer review.
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current Dasha
          </div>
          <div className="mt-1 text-sm text-slate-900">{currentDashaLabel || "—"}</div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Strongest Planets
          </div>
          <div className="mt-1 text-sm text-slate-900">
            {strongestPlanets.length ? strongestPlanets.join(", ") : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Weakest Planets
          </div>
          <div className="mt-1 text-sm text-slate-900">
            {weakestPlanets.length ? weakestPlanets.join(", ") : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Key Houses
          </div>
          <div className="mt-1 text-sm text-slate-900">
            {keyHouses.length ? keyHouses.join(", ") : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Watchouts
          </div>
          <div className="mt-1 text-sm text-slate-900">
            {watchouts.length ? watchouts.join(" • ") : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTodayISOInTimezone(tz: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
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
  getTodayISOInTimezone("Asia/Kolkata")
);
  const [compareDateISO, setCompareDateISO] = useState("");
 const [utilityPanchangData, setUtilityPanchangData] = useState<any | null>(null);
const [utilityHoraData, setUtilityHoraData] = useState<any | null>(null);


const [utilityPanchangLoading, setUtilityPanchangLoading] = useState(false);
const [utilityHoraLoading, setUtilityHoraLoading] = useState(false);

const [utilityPanchangError, setUtilityPanchangError] = useState("");
const [utilityHoraError, setUtilityHoraError] = useState("");

const [utilityPanchangPlace, setUtilityPanchangPlace] = useState<PlaceLite | null>(null);
const [utilityHoraPlace, setUtilityHoraPlace] = useState<PlaceLite | null>(null);

const [utilityPanchangTimezone, setUtilityPanchangTimezone] = useState("Asia/Kolkata");
const [utilityHoraTimezone, setUtilityHoraTimezone] = useState("Asia/Kolkata");

const [utilityPanchangDateISO, setUtilityPanchangDateISO] = useState(
  new Date().toISOString().slice(0, 10)
);

const [utilityHoraDateISO, setUtilityHoraDateISO] = useState(
  new Date().toISOString().slice(0, 10)
);

const [utilityHoraTime, setUtilityHoraTime] = useState("12:00");
useEffect(() => {
  setSelectedDateISO(getTodayISOInTimezone(timezone));
}, [timezone]);
useEffect(() => {
  if (!selectedPlace) return;

  try {
    const tz = tzLookup(selectedPlace.lat, selectedPlace.lon);
    setTimezone(tz);
  } catch {
    // fallback: keep existing timezone
  }
}, [selectedPlace]);
useEffect(() => {
  if (!utilityPanchangPlace) return;

  try {
    const tz = tzLookup(utilityPanchangPlace.lat, utilityPanchangPlace.lon);
    setUtilityPanchangTimezone(tz);
  } catch {}
}, [utilityPanchangPlace]);

useEffect(() => {
  if (!utilityHoraPlace) return;

  try {
    const tz = tzLookup(utilityHoraPlace.lat, utilityHoraPlace.lon);
    setUtilityHoraTimezone(tz);
  } catch {}
}, [utilityHoraPlace]);

async function handleGeneratePanchang() {
  if (!data?.birthMeta && !birthMeta) {
    setUtilityPanchangError("Please generate the Data Engine first.");
    return;
  }

  if (!utilityPanchangPlace) {
    setUtilityPanchangError("Please select a city for Panchang.");
    return;
  }

  if (!utilityPanchangDateISO.trim()) {
    setUtilityPanchangError("Please select a Panchang date.");
    return;
  }

  try {
    setUtilityPanchangLoading(true);
    setUtilityPanchangError("");

    const res = await fetch("/api/data-engine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        birth: {
          name: birthMeta?.name ?? name.trim(),
          city: birthMeta?.city ?? selectedPlace?.name ?? "",
          dateISO: birthMeta?.dateISO ?? dateISO.trim(),
          time: birthMeta?.time ?? time.trim(),
          timezone: birthMeta?.timezone ?? timezone.trim(),
          lat: Number(birthMeta?.lat ?? selectedPlace?.lat ?? 0),
          lon: Number(birthMeta?.lon ?? selectedPlace?.lon ?? 0),
        },
        plan,
        selectedDateISO: selectedDateISO.trim(),
        utilityDateISO: utilityPanchangDateISO.trim(),
        utilityHoraDateISO: utilityPanchangDateISO.trim(),
        utilityTime: "12:00",
        utilityPlace: {
          name: utilityPanchangPlace.name,
          lat: utilityPanchangPlace.lat,
          lon: utilityPanchangPlace.lon,
          timezone: utilityPanchangTimezone,
        },
        compareDateISO: compareDateISO.trim() || null,
      }),
    });

    const json = await res.json();

if (!res.ok || json?.ok === false) {
  throw new Error(json?.error || "Failed to update Panchang.");
}

setUtilityPanchangData(json?.timing?.utilities?.panchang ?? null);
  } catch (e: any) {
    setUtilityPanchangError(e?.message || "Something went wrong.");
  } finally {
    setUtilityPanchangLoading(false);
  }
}

async function handleGenerate() {
  if (!selectedPlace) {
    setError("Please select a place.");
    return;
  }

  if (!dateISO.trim() || !time.trim()) {
    setError("Please enter date and time.");
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
          timezone,
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
      throw new Error(json?.error || "Failed to generate.");
    }

    setData(json);
  } catch (e: any) {
    setError(e?.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
}
async function handleGenerateHora() {
  if (!data?.birthMeta && !birthMeta) {
    setUtilityHoraError("Please generate the Data Engine first.");
    return;
  }

  if (!utilityHoraPlace) {
    setUtilityHoraError("Please select a city for Hora.");
    return;
  }

  if (!utilityHoraDateISO.trim()) {
    setUtilityHoraError("Please select a Hora date.");
    return;
  }

  if (!utilityHoraTime.trim()) {
    setUtilityHoraError("Please select a Hora time.");
    return;
  }

  try {
    setUtilityHoraLoading(true);
    setUtilityHoraError("");

    const res = await fetch("/api/data-engine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        birth: {
          name: birthMeta?.name ?? name.trim(),
          city: birthMeta?.city ?? selectedPlace?.name ?? "",
          dateISO: birthMeta?.dateISO ?? dateISO.trim(),
          time: birthMeta?.time ?? time.trim(),
          timezone: birthMeta?.timezone ?? timezone.trim(),
          lat: Number(birthMeta?.lat ?? selectedPlace?.lat ?? 0),
          lon: Number(birthMeta?.lon ?? selectedPlace?.lon ?? 0),
        },
        plan,
        selectedDateISO: selectedDateISO.trim(),
        utilityDateISO: utilityHoraDateISO.trim(),
        utilityHoraDateISO: utilityHoraDateISO.trim(),
        utilityTime: utilityHoraTime.trim(),
        utilityPlace: {
          name: utilityHoraPlace.name,
          lat: utilityHoraPlace.lat,
          lon: utilityHoraPlace.lon,
          timezone: utilityHoraTimezone,
        },
        compareDateISO: compareDateISO.trim() || null,
      }),
    });

    const json = await res.json();

    if (!res.ok || json?.ok === false) {
      throw new Error(json?.error || "Failed to update Hora.");
    }

    setUtilityHoraData(json?.timing?.utilities?.hora ?? null);
  } catch (e: any) {
    setUtilityHoraError(e?.message || "Something went wrong.");
  } finally {
    setUtilityHoraLoading(false);
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
const utilityPanchang = useMemo(
  () => utilityPanchangData ?? null,
  [utilityPanchangData]
);
const kpPlanetOnCusp = useMemo(() => {
  const raw =
    data?.strength?.kpPlanetOnCusp ??
    data?.foundations?.kpPlanetOnCusp ??
    data?.kpPlanetOnCusp ??
    null;

  return raw;
}, [data]);
const utilityHora = useMemo(
  () => utilityHoraData ?? null,
  [utilityHoraData]
);
const upagrahas = useMemo(
  () => data?.foundations?.upagrahas ?? data?.upagrahas ?? null,
  [data]
);
useEffect(() => {
  if (upagrahas) {
    console.log("UPAGRAHA DEBUG", upagrahas);
  }
}, [upagrahas]);
const solarShadowPoints = useMemo(
  () =>
    data?.foundations?.solarShadowPoints ??
    data?.solarShadowPoints ??
    null,
  [data]
);
const foundationPersonalStrength = useMemo(
  () =>
    data?.foundations?.personalStrength ??
    data?.timing?.personalStrength ??
    null,
  [data]
);
 
  const bhavaChalit = useMemo(
    () => data?.foundations?.bhavaChalit ?? data?.bhavaChalit ?? null,
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

    for (const row of natalStrengths ?? []) {
      const p = row?.planet;
      if (!p) continue;

      if (row?.isDebilitated) out.push(`${p} debilitated`);
      if (row?.combust) out.push(`${p} combust`);
      if (row?.strengthBand === "weak") out.push(`${p} weak`);
    }

    for (const row of houseJudgement ?? []) {
      const mal = Number(row?.maleficCount ?? 0);
      const ben = Number(row?.beneficCount ?? 0);

      if (mal >= 2 && mal > ben) {
        out.push(`H${row?.house} under pressure`);
      }
    }

    return out.slice(0, 4);
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

const primaryButtonClass =
  "rounded-xl bg-[color:var(--primary)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60";

const errorBoxClass =
  "mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm";
  return (
    <main className="min-h-screen astro-bg text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[color:var(--primary)]/16 blur-[140px]" />
        <div className="absolute left-[12%] top-[30%] h-[380px] w-[520px] rounded-full bg-amber-200/25 blur-[130px]" />
        <div className="absolute right-[10%] top-[55%] h-[380px] w-[520px] rounded-full bg-fuchsia-200/20 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/sarathi" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl astro-card">
              <span className="text-lg">✧</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900">Sārathi</div>
              <div className="text-xs text-slate-500">
                The charioteer of your journey within
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link className="hover:text-slate-900" href="/sarathi">
              Home
            </Link>
            <Link className="hover:text-slate-900" href="/sarathi/chat">
              Ask Sārathi
            </Link>
            <Link className="hover:text-slate-900" href="/sarathi/life-report">
              Life Report
            </Link>
            <Link className="hover:text-slate-900" href="/sarathi/data-engine">
              Data Engine
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-amber-300/40 bg-amber-100 px-3 py-1 text-xs text-amber-800 md:inline-flex">
              Pro astrologer view
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="space-y-6">
          <div className="rounded-3xl astro-card p-8 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
  <div>
    <h1 className="text-2xl font-semibold text-slate-900">Sārathi Astrologer’s Desk</h1>
    <p className="mt-1 text-sm text-slate-600">
      Built for astrologers who want technical depth, faster workflow, and cleaner chart judgement.
    </p>
  </div>
</div>

<div className="mt-6 rounded-2xl astro-card p-6 shadow-sm ring-1 ring-black/5">
  <h2 className="text-base font-semibold text-slate-900">
    Built for astrologers who want all technical chart data in one place
  </h2>

  <p className="mt-3 text-sm leading-relaxed text-slate-700">
    Sārathi Astrologer’s Desk was created for practicing astrologers who do not
    want to waste time jumping between multiple tools, calculations, and
    reference points. It brings together the core technical layers needed for
    judgement — natal structure, vargas, dasha, transits, strengths, Panchang,
    aspects, and chart views — in one clean workspace.
  </p>

  <p className="mt-3 text-sm leading-relaxed text-slate-700">
    The goal is not to replace the astrologer’s wisdom. The goal is to remove
    friction, reduce manual effort, and make serious chart analysis faster,
    clearer, and more complete.
  </p>

  <div className="mt-4 flex flex-wrap gap-2">
    <span className="rounded-full astro-chip px-3 py-1 text-xs">
      Built for manual judgement
    </span>
    <span className="rounded-full astro-chip px-3 py-1 text-xs">
      All major technical layers
    </span>
    <span className="rounded-full astro-chip px-3 py-1 text-xs">
      Faster chart reading
    </span>
    <span className="rounded-full astro-chip px-3 py-1 text-xs">
      Made for serious astrologers
    </span>
  </div>
</div>

<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-[color:var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
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
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Birth date
                </label>
                <input
                  type="date"
                  value={dateISO}
                  onChange={(e) => setDateISO(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Birth time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Timezone
                </label>
                <input
  value={timezone}
  readOnly
  
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[color:var(--primary)]"
                />
                <p className="mt-1 text-xs text-slate-600">
  Auto-detected from selected city
</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className={primaryButtonClass}
              >
                {loading ? "Generating..." : "Generate Data Engine"}
              </button>
            </div>

            {error ? (
              <div className={errorBoxClass}>
  {error}
</div>
            ) : null}
          </div>

          <div className="rounded-3xl astro-card p-6 shadow-sm ring-1 ring-black/5">
            <DataEngineTabs activeTab={activeTab} onChange={setActiveTab} />

            {!data ? (
              <div className="py-12 text-center text-sm text-slate-900">
                Generate to see chart data here.
              </div>
            ) : null}

            {data && activeTab === "foundations" ? (
              <div className="mt-6 space-y-8">
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Chart Identity</h2>
                    <p className="text-sm text-slate-900">
                      Core birth details, Panchang, and high-signal chart markers.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm backdrop-blur-sm">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {natal?.ascendant?.sign ? (
                        <span className="rounded-full border border-[color:var(--border)] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                          Asc - {natal.ascendant.sign}
                        </span>
                      ) : null}

                      {natal?.moonSign ? (
                        <span className="rounded-full border border-[color:var(--border)] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                          Moon {natal.moonSign}
                        </span>
                      ) : null}

                      {natal?.sunSign ? (
                        <span className="rounded-full border border-[color:var(--border)] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                          Sun {natal.sunSign}
                        </span>
                      ) : null}

                      {moonRow?.nakshatra ? (
                        <span className="rounded-full border border-[color:var(--border)] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                          {moonRow.nakshatra}
                          {moonRow?.pada ? ` - Pada ${moonRow.pada}` : ""}
                        </span>
                      ) : null}

                      <span className="rounded-full border border-[color:var(--border)] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                        Dasha - {currentDashaLabel}
                      </span>

                      {strongestPlanets.length ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                          Strong - {strongestPlanets.join(", ")}
                        </span>
                      ) : null}

                      {weakestPlanets.length ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 shadow-sm">
                          Weak - {weakestPlanets.join(", ")}
                        </span>
                      ) : null}

                      {keyHouses.length ? (
                        <span className="rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-sm">
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
                      <div className="rounded-2xl astro-card p-5 text-sm text-slate-900">
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
                 <section className="space-y-4">
  <div>
    <h2 className="text-lg font-semibold text-slate-900">Upagrahas, Solar Shadow Points & Moon Strength</h2>
<p className="text-sm text-slate-900">
  Chart-linked segmented upagrahas, classical solar shadow points, and daily lunar support factors for judgement.
</p>
  </div>

  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <UpagrahaCard
      title="Gulika"
      point={upagrahas?.gulika}
      methodLabel={upagrahas?.traditionLabel ?? upagrahas?.methodId ?? "—"}
    />

    <UpagrahaCard
      title="Mandi"
      point={upagrahas?.mandi}
      methodLabel={upagrahas?.traditionLabel ?? upagrahas?.methodId ?? "—"}
    />

    <UpagrahaCard
      title="Yamakantaka"
      point={upagrahas?.yamakantaka}
      methodLabel={upagrahas?.traditionLabel ?? upagrahas?.methodId ?? "—"}
    />

    <UpagrahaCard
      title="Kala"
      point={upagrahas?.kala}
      methodLabel={upagrahas?.traditionLabel ?? upagrahas?.methodId ?? "—"}
    />

    <UpagrahaCard
      title="Mrityu"
      point={upagrahas?.mrityu}
      methodLabel={upagrahas?.traditionLabel ?? upagrahas?.methodId ?? "—"}
    />
    <UpagrahaCard
  title="Ardhaprahara"
  point={upagrahas?.arthaprahara}
  methodLabel={upagrahas?.traditionLabel ?? upagrahas?.methodId ?? "—"}
/>
   <UpagrahaCard
  title="Dhuma"
  point={solarShadowPoints?.dhuma}
  methodLabel={solarShadowPoints?.traditionLabel ?? solarShadowPoints?.methodId ?? "—"}
/>

<UpagrahaCard
  title="Vyatipata"
  point={solarShadowPoints?.vyatipata}
  methodLabel={solarShadowPoints?.traditionLabel ?? solarShadowPoints?.methodId ?? "—"}
/>

<UpagrahaCard
  title="Parivesha"
  point={solarShadowPoints?.parivesha}
  methodLabel={solarShadowPoints?.traditionLabel ?? solarShadowPoints?.methodId ?? "—"}
/>

<UpagrahaCard
  title="Indrachapa"
  point={solarShadowPoints?.indrachapa}
  methodLabel={solarShadowPoints?.traditionLabel ?? solarShadowPoints?.methodId ?? "—"}
/>

<UpagrahaCard
  title="Upaketu"
  point={solarShadowPoints?.upaketu}
  methodLabel={solarShadowPoints?.traditionLabel ?? solarShadowPoints?.methodId ?? "—"}
/>
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-5 text-sm text-slate-900 shadow-sm backdrop-blur-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Tarabala & Chandrabala
      </div>

      {!foundationPersonalStrength ? (
        <div className="mt-2 text-slate-900">No lunar strength data available.</div>
      ) : (
        <div className="mt-3 space-y-2">
          <div>
            <span className="text-slate-400">Tarabala:</span>{" "}
            {foundationPersonalStrength?.tarabalam?.tara ?? "—"}
          </div>

          <div>
            <span className="text-slate-400">Tarabala Favorable:</span>{" "}
            {foundationPersonalStrength?.tarabalam?.favorable == null
              ? "—"
              : foundationPersonalStrength.tarabalam.favorable
              ? "Yes"
              : "No"}
          </div>

          <div>
            <span className="text-slate-400">Chandrabala Favorable:</span>{" "}
            {foundationPersonalStrength?.chandrabalam?.favorable == null
              ? "—"
              : foundationPersonalStrength.chandrabalam.favorable
              ? "Yes"
              : "No"}
          </div>

          <div>
            <span className="text-slate-400">Natal Moon Nakshatra:</span>{" "}
            {foundationPersonalStrength?.natalMoonNakshatra ?? "—"}
          </div>

          <div>
            <span className="text-slate-400">Transit Moon Nakshatra:</span>{" "}
            {foundationPersonalStrength?.transitMoonNakshatra ?? "—"}
          </div>

          <div>
            <span className="text-slate-400">Natal Moon Sign:</span>{" "}
            {foundationPersonalStrength?.natalMoonSign ?? "—"}
          </div>

          <div>
            <span className="text-slate-400">Transit Moon Sign:</span>{" "}
            {foundationPersonalStrength?.transitMoonSign ?? "—"}
          </div>
        </div>
      )}
    </div>
  </div>
</section>
                </section>

                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Natal Framework</h2>
                    <p className="text-sm text-slate-900">
                      Base structure of the natal chart for manual judgement.
                    </p>
                  </div>

                  <PlanetTable planets={planets} rawMode={false} title="D1 Planet Table" />

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <HouseLordTable houses={houses} />
                    <FunctionalRolesCard roles={roles} />
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Aspect and Strength Layer
                    </h2>
                    <p className="text-sm text-slate-900">
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
                    <h2 className="text-lg font-semibold text-slate-900">House Judgement</h2>
                    <p className="text-sm text-slate-900">
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
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Select varga
                    </label>
                    <select
                      value={selectedVarga}
                      onChange={(e) => setSelectedVarga(e.target.value)}
                      className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm outline-none focus:border-[color:var(--primary)]"
                    >
                      {vargaEntries.map(([key]) => (
                        <option key={key} value={key} className="bg-white text-slate-800">
                          {VARGA_LABELS[key] ?? key.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {!vargaEntries.length ? (
                  <div className="rounded-xl astro-card px-4 py-3 text-sm text-slate-800">
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
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Planet Strength</h2>
                    <p className="text-sm text-slate-900">
                      Core planetary strength metrics used for judgement.
                    </p>
                  </div>

                  <ShadbalaCard data={data?.strength?.shadbala} />
                  <AshtakvargaCard data={data?.strength?.ashtakvarga} />
                  <PrastharaCard data={data?.strength?.prasthara} />
                  <BhavMadhyaCard data={data?.strength?.bhavMadhya} />
                  <KpPlanetOnCuspCard
  data={formatKpPlanetOnCuspForAstroSage(kpPlanetOnCusp)}
/>
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
  arudhas={data?.arudhas ?? {}}
  upagrahas={upagrahas}
  solarShadowPoints={solarShadowPoints}
  vedicAspects={vedicAspects}
/>
            ) : null}
         {data && activeTab === "utilities" ? (
  <div className="mt-6 space-y-8">
    <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-semibold text-slate-900">Hora</h2>
      <p className="mt-1 text-sm text-slate-500">
        Select date, time, and place to generate Hora.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Date
          </label>
          <input
            type="date"
            value={utilityHoraDateISO}
            onChange={(e) => setUtilityHoraDateISO(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Time
          </label>
          <input
            type="time"
            value={utilityHoraTime}
            onChange={(e) => setUtilityHoraTime(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            City
          </label>
          <div className="mt-1">
            <LockingCityAutocomplete
              value={utilityHoraPlace}
              onSelect={setUtilityHoraPlace}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
      <button
  onClick={handleGenerateHora}
  disabled={utilityHoraLoading}
  className={primaryButtonClass}
>
          {utilityHoraLoading ? "Generating Hora..." : "Generate Hora"}
        </button>
      </div>

      {utilityHoraError ? (
        <div className={errorBoxClass}>
  {utilityHoraError}
</div>
      ) : null}

      {utilityHora?.horaLord ? (
        <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white/80 p-5">
          <h3 className="text-base font-semibold text-slate-700">Hora Result</h3>
          <p className="mt-1 text-sm text-slate-500">
            {utilityHoraPlace?.name ?? "Selected city"}, {utilityHoraDateISO} at{" "}
            {utilityHoraTime}
          </p>
          <p className="mt-2 text-xs italic text-slate-400">
            Calculated using variable hora based on local sunrise and sunset.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[color:var(--border)] bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-800">
                Planet
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {utilityHora.horaLord}
              </div>
            </div>

            <div className="rounded-xl border border-[color:var(--border)] bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-800">
                Phase
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {utilityHora.phase ?? "—"}
              </div>
            </div>

            <div className="rounded-xl border border-[color:var(--border)] bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-800">
                Hora Number
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {utilityHora.horaNumber ?? "—"}
              </div>
            </div>

            <div className="rounded-xl border border-[color:var(--border)] bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-800">
                Time Slot
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {utilityHora.startsAt} → {utilityHora.endsAt}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>

    <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-semibold text-slate-900">Panchang</h2>
      <p className="mt-1 text-sm text-slate-500">
        Select date and place to generate Panchang.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Date
          </label>
          <input
            type="date"
            value={utilityPanchangDateISO}
            onChange={(e) => setUtilityPanchangDateISO(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            City
          </label>
          <div className="mt-1">
            <LockingCityAutocomplete
              value={utilityPanchangPlace}
              onSelect={setUtilityPanchangPlace}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
      <button
  onClick={handleGeneratePanchang}
  disabled={utilityPanchangLoading}
  className={primaryButtonClass}
>
          {utilityPanchangLoading ? "Generating Panchang..." : "Generate Panchang"}
        </button>
      </div>

      {utilityPanchangError ? (
       <div className={errorBoxClass}>
  {utilityPanchangError}
</div>
      ) : null}

      {utilityPanchang ? (
        <>
          <div className="mt-6 rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
            <h3 className="text-2xl font-semibold text-slate-900">Today’s Panchang</h3>
            <p className="mt-2 text-sm text-slate-500">
              {utilityPanchangPlace?.name ?? "Selected city"}, {utilityPanchangDateISO}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
                <table className="w-full table-fixed border-collapse">
                  <tbody>
                    {[
                      ["Date", utilityPanchang?.dateLabel ?? utilityPanchangDateISO],
                      ["Tithi", utilityPanchang?.tithi ?? "—"],
                      ["Tithi Till", utilityPanchang?.tithiTill || "—"],
                      ["Next Tithi", utilityPanchang?.nextTithi || "—"],
                      ["Day", utilityPanchang?.weekday ?? "—"],
                      ["Paksha", utilityPanchang?.paksha ?? "—"],
                      ["Sunrise", utilityPanchang?.sunrise ?? "—"],
                      ["Sunset", utilityPanchang?.sunset ?? "—"],
                      ...(utilityPanchang?.moonrise
                        ? [["Moonrise", utilityPanchang.moonrise]]
                        : []),
                      ["Nakshatra", utilityPanchang?.nakshatraAtSunrise || "—"],
                      ["Nakshatra Till", utilityPanchang?.nakshatraTill || "—"],
                      ["Next Nakshatra", utilityPanchang?.nextNakshatra || "—"],
                    ].map(([label, value], idx) => (
                      <tr
                        key={`${String(label)}-${idx}`}
                        className="border-b border-[color:var(--border)] last:border-b-0"
                      >
                        <td className="w-[38%] px-6 py-5 align-middle text-lg font-semibold text-slate-900">
                          {String(label)}
                        </td>
                        <td className="px-6 py-5 text-right align-middle text-lg text-slate-900/90">
                          {String(value ?? "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
                <table className="w-full table-fixed border-collapse">
                  <tbody>
                    {[
                      ["Yog", utilityPanchang?.yoga || "—"],
                      ["Yog Till", utilityPanchang?.yogaTill || "—"],
                      ["Next Yog", utilityPanchang?.nextYoga || "—"],
                      ["Karana", utilityPanchang?.karana || "—"],
                      ["Karana Till", utilityPanchang?.karanaTill || "—"],
                      ["Next Karana", utilityPanchang?.nextKarana || "—"],
                      ["Sun sign", utilityPanchang?.sunSign ?? "—"],
                      ["Moon Sign", utilityPanchang?.moonSign ?? "—"],
                      ["Moon Sign Till", utilityPanchang?.moonSignTill || "—"],
                      ["Next Moon Sign", utilityPanchang?.nextMoonSign || "—"],
                      ["Panchak", utilityPanchang?.panchak?.active ? "Yes" : "No"],
                    ].map(([label, value], idx) => (
                      <tr
                        key={`${String(label)}-${idx}`}
                        className="border-b border-[color:var(--border)] last:border-b-0"
                      >
                        <td className="w-[42%] px-6 py-5 align-middle text-lg font-semibold text-slate-900">
                          {String(label)}
                        </td>
                        <td className="px-6 py-5 text-right align-middle text-lg text-slate-900/90">
                          {String(value ?? "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
            <h3 className="text-2xl font-semibold text-slate-900">Muhurat Windows</h3>
            <p className="mt-2 text-sm text-slate-500">
              Daily timing windows for {utilityPanchangPlace?.name ?? "Selected city"},{" "}
              {utilityPanchangDateISO}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
                <div className="text-xs uppercase tracking-wide text-red-200/70">
                  Rahu Kaal
                </div>
                <div className="mt-2 text-lg font-semibold text-red-100">
                  {utilityPanchang?.rahuKaal
                    ? `${utilityPanchang.rahuKaal.start} to ${utilityPanchang.rahuKaal.end}`
                    : "—"}
                </div>
                <p className="mt-2 text-sm text-red-100/70">
                  Traditionally avoided for major beginnings.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">
                <div className="text-xs uppercase tracking-wide text-amber-200/70">
                  Yamaganda
                </div>
                <div className="mt-2 text-lg font-semibold text-amber-100">
                  {utilityPanchang?.yamaganda
                    ? `${utilityPanchang.yamaganda.start} to ${utilityPanchang.yamaganda.end}`
                    : "—"}
                </div>
                <p className="mt-2 text-sm text-amber-100/70">
                  Usually avoided for travel and new activity.
                </p>
              </div>

              <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
                <div className="text-xs uppercase tracking-wide text-fuchsia-200/70">
                  Gulika
                </div>
                <div className="mt-2 text-lg font-semibold text-fuchsia-100">
                  {utilityPanchang?.gulika
                    ? `${utilityPanchang.gulika.start} to ${utilityPanchang.gulika.end}`
                    : "—"}
                </div>
                <p className="mt-2 text-sm text-fuchsia-100/70">
                  Important for certain electional considerations.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                <div className="text-xs uppercase tracking-wide text-emerald-200/70">
                  Abhijit Muhurat
                </div>
                <div className="mt-2 text-lg font-semibold text-emerald-100">
                  {utilityPanchang?.abhijitMuhurat
                    ? `${utilityPanchang.abhijitMuhurat.start} to ${utilityPanchang.abhijitMuhurat.end}`
                    : "—"}
                </div>
                <p className="mt-2 text-sm text-emerald-100/70">
                  Generally considered supportive for auspicious action.
                </p>
              </div>
            </div>
          </div>

          {utilityPanchang?.choghadiya ? (
            <div className="mt-6 rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
              <h3 className="text-2xl font-semibold text-slate-900">Choghadiya</h3>
              <p className="mt-2 text-sm text-slate-500">
                Day and night Choghadiya for{" "}
                {utilityPanchangPlace?.name ?? "Selected city"}, {utilityPanchangDateISO}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
                  <div className="border-b border-[color:var(--border)] px-6 py-4 text-lg font-semibold text-slate-900">
                    Day Choghadiya
                  </div>
                  <table className="w-full table-fixed border-collapse">
                    <tbody>
                      {(utilityPanchang.choghadiya.day ?? []).map(
                        (row: any, idx: number) => (
                          <tr
                            key={`day-${idx}`}
                            className="border-b border-[color:var(--border)] last:border-b-0"
                          >
                            <td className="w-[34%] px-6 py-4 text-base font-semibold text-slate-900">
                              {row.label}
                            </td>
                            <td className="px-6 py-4 text-right text-base text-slate-900/90">
                              {row.start} to {row.end}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
                  <div className="border-b border-[color:var(--border)] px-6 py-4 text-lg font-semibold text-slate-900">
                    Night Choghadiya
                  </div>
                  <table className="w-full table-fixed border-collapse">
                    <tbody>
                      {(utilityPanchang.choghadiya.night ?? []).map(
                        (row: any, idx: number) => (
                          <tr
                            key={`night-${idx}`}
                            className="border-b border-[color:var(--border)] last:border-b-0"
                          >
                            <td className="w-[34%] px-6 py-4 text-base font-semibold text-slate-900">
                              {row.label}
                            </td>
                            <td className="px-6 py-4 text-right text-base text-slate-900/90">
                              {row.start} to {row.end}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  </div>
) : null}

          </div>
        </div>
      </section>
    </main>
  );
}