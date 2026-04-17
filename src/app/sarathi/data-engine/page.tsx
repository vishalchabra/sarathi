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
  bhavaChalit?: any;
  classicChalit?: any;
  debugLifeReport?: any;
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
  bhavaChalit?: any;
  upagrahas?: any;
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
  const [utilityMetaData, setUtilityMetaData] = useState<any | null>(null);
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
        className="w-full rounded-xl border border-white/15 bg-white/5/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-indigo-400"
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
          className="absolute z-20 mt-1 w-full rounded-md border border-white/10 bg-[#0C1222] text-white shadow-xl"
        >
          {loading && <div className="px-3 py-2 text-sm text-white/60">Searching</div>}
          {!loading && !items.length && (
            <div className="px-3 py-2 text-sm text-white/60">No results</div>
          )}
          {!loading &&
            items.map((it, i) => (
              <button
                key={`${it.name}-${i}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                className="w-full px-3 py-2 text-left text-sm hover:bg-white/5/5"
                onClick={() => commit(it)}
              >
                {it.name}
                <span className="ml-2 text-xs text-white/45">
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
    <div className="rounded-2xl border border-white/10 bg-white/5/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
      <h2 className="text-base font-semibold text-white">Primary Signals</h2>
      <p className="mt-1 text-sm text-white/65">
        High-priority chart flags for quick astrologer review.
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/45">
            Current Dasha
          </div>
          <div className="mt-1 text-sm text-white">{currentDashaLabel || "—"}</div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/45">
            Strongest Planets
          </div>
          <div className="mt-1 text-sm text-white">
            {strongestPlanets.length ? strongestPlanets.join(", ") : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/45">
            Weakest Planets
          </div>
          <div className="mt-1 text-sm text-white">
            {weakestPlanets.length ? weakestPlanets.join(", ") : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/45">
            Key Houses
          </div>
          <div className="mt-1 text-sm text-white">
            {keyHouses.length ? keyHouses.join(", ") : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/45">
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
 const [utilityPanchangData, setUtilityPanchangData] = useState<any | null>(null);
const [utilityHoraData, setUtilityHoraData] = useState<any | null>(null);
const [utilityMetaData, setUtilityMetaData] = useState<any | null>(null);

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
setUtilityMetaData(json?.timing?.personalStrength ?? null);
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
const utilityPersonalStrength = useMemo(
  () => utilityMetaData ?? null,
  [utilityMetaData]
);
const utilityHora = useMemo(
  () => utilityHoraData ?? null,
  [utilityHoraData]
);
const upagrahas = useMemo(
  () => data?.foundations?.upagrahas ?? data?.upagrahas ?? null,
  [data]
);

const foundationPersonalStrength = useMemo(
  () =>
    data?.foundations?.personalStrength ??
    data?.timing?.personalStrength ??
    null,
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

  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />
        <div className="absolute left-[12%] top-[30%] h-[380px] w-[520px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute right-[10%] top-[55%] h-[380px] w-[520px] rounded-full bg-violet-500/10 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070A14]/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/sarathi" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5/5">
              <span className="text-lg">✧</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Sārathi</div>
              <div className="text-xs text-white/60">
                The charioteer of your journey within
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <Link className="hover:text-white" href="/sarathi">
              Home
            </Link>
            <Link className="hover:text-white" href="/sarathi/chat">
              Ask Sārathi
            </Link>
            <Link className="hover:text-white" href="/sarathi/life-report">
              Life Report
            </Link>
            <Link className="hover:text-white" href="/sarathi/data-engine">
              Data Engine
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200 md:inline-flex">
              Pro astrologer view
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
  <div>
    <h1 className="text-2xl font-semibold text-white">Sārathi Astrologer’s Desk</h1>
    <p className="mt-1 text-sm text-white/65">
      Built for astrologers who want technical depth, faster workflow, and cleaner chart judgement.
    </p>
  </div>
</div>

<div className="mt-6 rounded-2xl border border-white/10 bg-white/5/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
  <h2 className="text-base font-semibold text-white">
    Built for astrologers who want all technical chart data in one place
  </h2>

  <p className="mt-3 text-sm leading-relaxed text-white/70">
    Sārathi Astrologer’s Desk was created for practicing astrologers who do not
    want to waste time jumping between multiple tools, calculations, and
    reference points. It brings together the core technical layers needed for
    judgement — natal structure, vargas, dasha, transits, strengths, Panchang,
    aspects, and chart views — in one clean workspace.
  </p>

  <p className="mt-3 text-sm leading-relaxed text-white/70">
    The goal is not to replace the astrologer’s wisdom. The goal is to remove
    friction, reduce manual effort, and make serious chart analysis faster,
    clearer, and more complete.
  </p>

  <div className="mt-4 flex flex-wrap gap-2">
    <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs text-indigo-200">
      Built for manual judgement
    </span>
    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
      All major technical layers
    </span>
    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
      Faster chart reading
    </span>
    <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
      Made for serious astrologers
    </span>
  </div>
</div>

<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-white/45">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-white/45">
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
                <label className="text-xs font-medium uppercase tracking-wide text-white/45">
                  Birth date
                </label>
                <input
                  type="date"
                  value={dateISO}
                  onChange={(e) => setDateISO(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-white/45">
                  Birth time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-white/45">
                  Timezone
                </label>
                <input
  value={timezone}
  readOnly
  
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-indigo-400"
                />
                <p className="text-xs text-white/40 mt-1">
  Auto-detected from selected city
</p>
              </div>

    

              <div>
                
               
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate Data Engine"}
              </button>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
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
                      <div className="rounded-2xl border border-white/10 bg-white/5/5 p-5 text-sm text-white/50">
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
    <h2 className="text-lg font-semibold text-white">Upagrahas & Moon Strength</h2>
    <p className="text-sm text-white/50">
      Chart-linked Gulika, Mandi, and daily lunar support factors for judgement.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <div className="space-y-4">
      {/* Gulika */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-white shadow-sm">
        <div className="text-xs font-medium uppercase tracking-wide text-white/45">
          Gulika
        </div>

        {!upagrahas?.gulika ? (
          <div className="mt-2 text-white/50">No Gulika data available.</div>
        ) : (
          <div className="mt-3 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-lg font-semibold text-white">
                  {upagrahas?.gulika?.sign ?? "—"}
                  {upagrahas?.gulika?.houseFromAsc
                    ? ` • ${upagrahas.gulika.houseFromAsc}${getOrdinalSuffix(
                        upagrahas.gulika.houseFromAsc
                      )} House`
                    : ""}
                </div>

                {upagrahas?.gulika?.flags?.isDusthana ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Dusthana
                  </span>
                ) : null}

                {upagrahas?.gulika?.flags?.isUpachaya ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Upachaya
                  </span>
                ) : null}

                {upagrahas?.gulika?.flags?.isKendra ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Kendra
                  </span>
                ) : null}

                {upagrahas?.gulika?.flags?.isTrikona ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Trikona
                  </span>
                ) : null}

                {upagrahas?.gulika?.flags?.isMaraka ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Maraka
                  </span>
                ) : null}
              </div>

              <div className="mt-1 text-sm text-white/65">
                {upagrahas?.gulika?.nakshatra ?? "—"}
                {upagrahas?.gulika?.pada ? ` • Pada ${upagrahas.gulika.pada}` : ""}
                {upagrahas?.gulika?.degree != null ? ` • ${upagrahas.gulika.degree}°` : ""}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/45">Method</div>
                <div className="mt-1 text-white/85">
                  {upagrahas?.traditionLabel ?? upagrahas?.methodId ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Birth Basis</div>
                <div className="mt-1 text-white/85 capitalize">
                  {upagrahas?.gulika?.phase ?? "—"} • {upagrahas?.gulika?.weekday ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Segment</div>
                <div className="mt-1 text-white/85">
                  {upagrahas?.gulika?.segmentIndex ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Longitude</div>
                <div className="mt-1 text-white/85">
                  {upagrahas?.gulika?.lon != null
                    ? `${upagrahas.gulika.lon.toFixed(2)}°`
                    : "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Point Type</div>
                <div className="mt-1 text-white/85 capitalize">
                  {upagrahas?.gulika?.pointMomentType ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Point Moment</div>
                <div className="mt-1 text-white/85">
                  {upagrahas?.gulika?.pointMomentISO
                    ? new Date(upagrahas.gulika.pointMomentISO).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mandi */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-white shadow-sm">
        <div className="text-xs font-medium uppercase tracking-wide text-white/45">
          Mandi
        </div>

        {!upagrahas?.mandi ? (
          <div className="mt-2 text-white/50">No Mandi data available.</div>
        ) : (
          <div className="mt-3 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-lg font-semibold text-white">
                  {upagrahas?.mandi?.sign ?? "—"}
                  {upagrahas?.mandi?.houseFromAsc
                    ? ` • ${upagrahas.mandi.houseFromAsc}${getOrdinalSuffix(
                        upagrahas.mandi.houseFromAsc
                      )} House`
                    : ""}
                </div>

                {upagrahas?.mandi?.flags?.isDusthana ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Dusthana
                  </span>
                ) : null}

                {upagrahas?.mandi?.flags?.isUpachaya ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Upachaya
                  </span>
                ) : null}

                {upagrahas?.mandi?.flags?.isKendra ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Kendra
                  </span>
                ) : null}

                {upagrahas?.mandi?.flags?.isTrikona ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Trikona
                  </span>
                ) : null}

                {upagrahas?.mandi?.flags?.isMaraka ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                    Maraka
                  </span>
                ) : null}
              </div>

              <div className="mt-1 text-sm text-white/65">
                {upagrahas?.mandi?.nakshatra ?? "—"}
                {upagrahas?.mandi?.pada ? ` • Pada ${upagrahas.mandi.pada}` : ""}
                {upagrahas?.mandi?.degree != null ? ` • ${upagrahas.mandi.degree}°` : ""}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/45">Method</div>
                <div className="mt-1 text-white/85">
                  {upagrahas?.traditionLabel ?? upagrahas?.methodId ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Birth Basis</div>
                <div className="mt-1 text-white/85 capitalize">
                  {upagrahas?.mandi?.phase ?? "—"} • {upagrahas?.mandi?.weekday ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Segment</div>
                <div className="mt-1 text-white/85">
                  {upagrahas?.mandi?.segmentIndex ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Longitude</div>
                <div className="mt-1 text-white/85">
                  {upagrahas?.mandi?.lon != null
                    ? `${upagrahas.mandi.lon.toFixed(2)}°`
                    : "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Point Type</div>
                <div className="mt-1 text-white/85 capitalize">
                  {upagrahas?.mandi?.pointMomentType ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-white/45">Point Moment</div>
                <div className="mt-1 text-white/85">
                  {upagrahas?.mandi?.pointMomentISO
                    ? new Date(upagrahas.mandi.pointMomentISO).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-white shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-white/45">
        Tarabala & Chandrabala
      </div>

      {!foundationPersonalStrength ? (
        <div className="mt-2 text-white/50">No lunar strength data available.</div>
      ) : (
        <div className="mt-3 space-y-2">
          <div>
            <span className="text-white/45">Tarabala:</span>{" "}
            {foundationPersonalStrength?.tarabalam?.tara ?? "—"}
          </div>
          <div>
            <span className="text-white/45">Tarabala Favorable:</span>{" "}
            {foundationPersonalStrength?.tarabalam?.favorable == null
              ? "—"
              : foundationPersonalStrength.tarabalam.favorable
              ? "Yes"
              : "No"}
          </div>
          <div>
            <span className="text-white/45">Chandrabala Favorable:</span>{" "}
            {foundationPersonalStrength?.chandrabalam?.favorable == null
              ? "—"
              : foundationPersonalStrength.chandrabalam.favorable
              ? "Yes"
              : "No"}
          </div>
          <div>
            <span className="text-white/45">Natal Moon Nakshatra:</span>{" "}
            {foundationPersonalStrength?.natalMoonNakshatra ?? "—"}
          </div>
          <div>
            <span className="text-white/45">Transit Moon Nakshatra:</span>{" "}
            {foundationPersonalStrength?.transitMoonNakshatra ?? "—"}
          </div>
          <div>
            <span className="text-white/45">Natal Moon Sign:</span>{" "}
            {foundationPersonalStrength?.natalMoonSign ?? "—"}
          </div>
          <div>
            <span className="text-white/45">Transit Moon Sign:</span>{" "}
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
                    <h2 className="text-lg font-semibold text-white">Natal Framework</h2>
                    <p className="text-sm text-white/50">
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
                    <label className="text-xs font-medium uppercase tracking-wide text-white/45">
                      Select varga
                    </label>
                    <select
                      value={selectedVarga}
                      onChange={(e) => setSelectedVarga(e.target.value)}
                      className="rounded-xl border border-white/15 bg-white/5/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
                    >
                      {vargaEntries.map(([key]) => (
                        <option key={key} value={key} className="bg-[#0C1222] text-white">
                          {VARGA_LABELS[key] ?? key.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {!vargaEntries.length ? (
                  <div className="rounded-xl border border-white/10 bg-white/5/5 px-4 py-3 text-sm text-white/65">
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
                    <h2 className="text-lg font-semibold text-white">Planet Strength</h2>
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
                arudhas={data?.arudhas ?? {}}
              />
            ) : null}
         {data && activeTab === "utilities" ? (
  <div className="mt-6 space-y-8">
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
      <h2 className="text-xl font-semibold text-white">Hora</h2>
      <p className="mt-1 text-sm text-white/60">
        Select date, time, and place to generate Hora.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-white/45">
            Date
          </label>
          <input
            type="date"
            value={utilityHoraDateISO}
            onChange={(e) => setUtilityHoraDateISO(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-white/45">
            Time
          </label>
          <input
            type="time"
            value={utilityHoraTime}
            onChange={(e) => setUtilityHoraTime(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-white/45">
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
          className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {utilityHoraLoading ? "Generating Hora..." : "Generate Hora"}
        </button>
      </div>

      {utilityHoraError ? (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {utilityHoraError}
        </div>
      ) : null}

      {utilityHora?.horaLord ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-base font-semibold text-white">Hora Result</h3>
          <p className="mt-1 text-sm text-white/60">
            {utilityHoraPlace?.name ?? "Selected city"}, {utilityHoraDateISO} at{" "}
            {utilityHoraTime}
          </p>
          <p className="mt-2 text-xs italic text-white/45">
            Calculated using variable hora based on local sunrise and sunset.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-wide text-white/45">
                Planet
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                {utilityHora.horaLord}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-wide text-white/45">
                Phase
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                {utilityHora.phase ?? "—"}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-wide text-white/45">
                Hora Number
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                {utilityHora.horaNumber ?? "—"}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-wide text-white/45">
                Time Slot
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                {utilityHora.startsAt} → {utilityHora.endsAt}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>

    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
      <h2 className="text-xl font-semibold text-white">Panchang</h2>
      <p className="mt-1 text-sm text-white/60">
        Select date and place to generate Panchang.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-white/45">
            Date
          </label>
          <input
            type="date"
            value={utilityPanchangDateISO}
            onChange={(e) => setUtilityPanchangDateISO(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-white/45">
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
          className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {utilityPanchangLoading ? "Generating Panchang..." : "Generate Panchang"}
        </button>
      </div>

      {utilityPanchangError ? (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {utilityPanchangError}
        </div>
      ) : null}

      {utilityPanchang ? (
        <>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
            <h3 className="text-2xl font-semibold text-white">Today’s Panchang</h3>
            <p className="mt-2 text-sm text-white/60">
              {utilityPanchangPlace?.name ?? "Selected city"}, {utilityPanchangDateISO}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <td className="w-[38%] px-6 py-5 align-middle text-lg font-semibold text-white">
                          {String(label)}
                        </td>
                        <td className="px-6 py-5 text-right align-middle text-lg text-white/90">
                          {String(value ?? "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <td className="w-[42%] px-6 py-5 align-middle text-lg font-semibold text-white">
                          {String(label)}
                        </td>
                        <td className="px-6 py-5 text-right align-middle text-lg text-white/90">
                          {String(value ?? "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
            <h3 className="text-2xl font-semibold text-white">Muhurat Windows</h3>
            <p className="mt-2 text-sm text-white/60">
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
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
              <h3 className="text-2xl font-semibold text-white">Choghadiya</h3>
              <p className="mt-2 text-sm text-white/60">
                Day and night Choghadiya for{" "}
                {utilityPanchangPlace?.name ?? "Selected city"}, {utilityPanchangDateISO}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="border-b border-white/10 px-6 py-4 text-lg font-semibold text-white">
                    Day Choghadiya
                  </div>
                  <table className="w-full table-fixed border-collapse">
                    <tbody>
                      {(utilityPanchang.choghadiya.day ?? []).map(
                        (row: any, idx: number) => (
                          <tr
                            key={`day-${idx}`}
                            className="border-b border-white/10 last:border-b-0"
                          >
                            <td className="w-[34%] px-6 py-4 text-base font-semibold text-white">
                              {row.label}
                            </td>
                            <td className="px-6 py-4 text-right text-base text-white/90">
                              {row.start} to {row.end}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="border-b border-white/10 px-6 py-4 text-lg font-semibold text-white">
                    Night Choghadiya
                  </div>
                  <table className="w-full table-fixed border-collapse">
                    <tbody>
                      {(utilityPanchang.choghadiya.night ?? []).map(
                        (row: any, idx: number) => (
                          <tr
                            key={`night-${idx}`}
                            className="border-b border-white/10 last:border-b-0"
                          >
                            <td className="w-[34%] px-6 py-4 text-base font-semibold text-white">
                              {row.label}
                            </td>
                            <td className="px-6 py-4 text-right text-base text-white/90">
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