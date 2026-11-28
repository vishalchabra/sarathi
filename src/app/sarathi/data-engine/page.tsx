"use client";

import { ensureNotificationTz } from "@/lib/notifications/timezone";
import {
  resolveActiveNodeMode,
  getNodeModeLabel,
  NODE_MODE_OPTIONS,
  requireNodeMode,
  type NodeMode,
} from "@/lib/node-mode";
import {
  getPreferredNodeMode,
  updatePreferredNodeMode as persistNodePreference,
} from "@/lib/supabase/node-preference-service";
import Link from "next/link";
import { Suspense } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import DataEngineTabs from "@/components/data-engine/DataEngineTabs";
import BirthSummaryCard from "@/components/data-engine/BirthSummaryCard";
import PlanetTable from "@/components/data-engine/PlanetTable";
import HouseLordTable from "@/components/data-engine/HouseLordTable";
import FunctionalRolesCard from "@/components/data-engine/FunctionalRolesCard";
import DashaBlock from "@/components/data-engine/DashaBlock";
import MajorTransitTimelineCard from "@/components/data-engine/MajorTransitTimelineCard";
import PlanetTransitTimelineCard from "@/components/data-engine/PlanetTransitTimelineCard";
import PanchangCard from "@/components/data-engine/PanchangCard";
import DashaLordProfileCard from "@/components/data-engine/DashaLordProfileCard";
import NakshatraContextCard from "@/components/data-engine/NakshatraContextCard";
import HouseJudgementCard from "@/components/data-engine/HouseJudgementCard";
import ChartsTabView from "@/components/data-engine/ChartsTabView";
import ShadbalaCard from "@/components/data-engine/ShadbalaCard";
import AshtakvargaCard from "@/components/data-engine/AshtakvargaCard";
import PrastharaCard from "@/components/data-engine/PrastharaCard";
import BhavMadhyaCard from "@/components/data-engine/BhavMadhyaCard";
import FiveFoldFriendshipCard from "@/components/data-engine/FiveFoldFriendshipCard";
import AvakhadaCard from "@/components/data-engine/AvakhadaCard";
import tzLookup from "tz-lookup";
import KpPlanetOnCuspCard from "@/components/data-engine/KpPlanetOnCuspCard";
import { formatKpPlanetOnCuspForAstroSage } from "@/lib/astrology/kp/formatKpPlanetOnCuspForAstroSage";
import DashaLordTransitTrackerCard from "@/components/data-engine/DashaLordTransitTrackerCard";
import ChartCompareTabView from "@/components/data-engine/ChartCompareTabView";
import { useRouter, useSearchParams } from "next/navigation";
import MediumNorthIndianChart from "@/components/data-engine/MediumNorthIndianChart";
import ForecastOverviewCard from "@/components/data-engine/ForecastOverviewCard";
import AnalysisFrameworkCard from "@/components/data-engine/AnalysisFrameworkCard";
import AskSarathiFloatingBox from "@/components/data-engine/AskSarathiFloatingBox";
import {
  addClientChart,
  createAstrologerClient,
  getAstrologerClient,
  type AstrologerClient,
  type ClientChart,
} from "@/lib/supabase/astrologer-crm-service";
type TabKey =
  | "foundations"
  | "charts"
  | "vargas"
  | "timing"
  | "forecast"
  | "strength"
  | "utilities"
  | "compare"
  | "analysis";

type UpcomingTransitBuckets = {
  moonTransits?: any[];
  planetaryTransits?: any[];
  allEvents?: any[];
};

type DataEngineResponse = {
  ok?: boolean;
  nodeMode?: "mean" | "true";
  nodeCalculationVersion?: string;
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
  nabhasaYogas?: any;
  classicYogas?: any;
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
  triggerEngine?: {
  topAreas?: any[];
  facts?: any[];
  scores?: any[];
  degreeHits?: any[];
  microTriggerDays?: any[];
};
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
  nabhasaYogas?: any;
  classicYogas?: any;
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
    shadbalaInsights?: any[];
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
    const res = await fetch(`/api/cities?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("City search failed");

    const json = (await res.json()) as {
      ok: boolean;
      cities: Array<{ name: string; lat: number; lon: number; timezone: string }>;
    };

    if (!json.ok) throw new Error("City search failed");

    const cities = json.cities.map(({ name, lat, lon }) => ({ name, lat, lon }));
    cityCache.set(query, cities);
    setItems(cities);
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

type TransitQueryCondition = {
  id: string;
  planet: string;
  conditionType:
    | "sign_degree"
    | "nakshatra"
    | "retrograde"
    | "same_sign_as"
    | "conjunct_natal";
  sign: string;
  degree: string;
  minute: string;
  orb: string;
  nakshatra: string;
  comparePlanet: string;
  natalPlanet: string;
  enabled: boolean;
};

type TransitQueryMatch = {
  dateISO: string;
  time?: string;
  timestampUTC: string;
  timezone: string;
  utcOffsetMinutes: number;
  endDateISO?: string;
  endTime?: string;
  endTimestampUTC?: string;
  endUtcOffsetMinutes?: number;
  sampleCount?: number;
  durationHours?: number;
strengthScore?: number;
strengthLabel?: string;
matchedPlanets: Array<{
    planet: string;
    sign: string;
    degree: number | null;
    targetDegree: number;
    orb: number;
    conditionType?: string;
    natalOrb?: number;
    nakshatra?: string;
    pada?: number | null;
  }>;
};

const TRANSIT_QUERY_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

const TRANSIT_QUERY_SIGNS = [
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
const TRANSIT_QUERY_NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];
function addDaysISO(dateISO: string, days: number) {
  const d = new Date(`${dateISO}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysBetweenISO(startISO: string, endISO: string) {
  const start = new Date(`${startISO}T00:00:00`).getTime();
  const end = new Date(`${endISO}T00:00:00`).getTime();
  return Math.floor((end - start) / 86400000);
}

function degreeMatches(actual: number | null | undefined, target: number, orb: number) {
  if (actual === null || actual === undefined || Number.isNaN(Number(actual))) return false;
  return Math.abs(Number(actual) - target) <= orb;
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

function calculateMatchStrength(
  matchedPlanets: TransitQueryMatch["matchedPlanets"]
): { score: number | undefined; label: string } {
  if (!matchedPlanets.length) {
    return { score: undefined, label: "No match" };
  }

  const scores: number[] = [];

  for (const row of matchedPlanets) {
    const type = row.conditionType;

    if (
      type === "nakshatra" ||
      type === "retrograde" ||
      type === "same_sign_as"
    ) {
      continue;
    }

    if (
      type !== "sign_degree" &&
      type !== "conjunct_natal"
    ) {
      return { score: undefined, label: "Matched" };
    }

    const orb = row.orb;

    if (
      typeof orb !== "number" ||
      !Number.isFinite(orb) ||
      orb < 0
    ) {
      return { score: undefined, label: "Matched" };
    }

    let diff: number;

    if (type === "conjunct_natal") {
      if (
        typeof row.natalOrb !== "number" ||
        !Number.isFinite(row.natalOrb) ||
        row.natalOrb < 0 ||
        row.natalOrb > 180
      ) {
        return { score: undefined, label: "Matched" };
      }

      diff = row.natalOrb;
    } else {
      if (
        typeof row.degree !== "number" ||
        !Number.isFinite(row.degree) ||
        typeof row.targetDegree !== "number" ||
        !Number.isFinite(row.targetDegree)
      ) {
        return { score: undefined, label: "Matched" };
      }

      diff = Math.abs(row.degree - row.targetDegree);
    }

    const closeness =
      orb === 0
        ? (diff <= 1e-9 ? 1 : 0)
        : Math.max(0, Math.min(1, 1 - diff / orb));

    scores.push(closeness);
  }

  if (!scores.length) {
    return { score: undefined, label: "Matched" };
  }

  const avg =
    scores.reduce((sum, value) => sum + value, 0) /
    scores.length;

  const score = Number((avg * 100).toFixed(1));

  const label =
    score >= 92 ? "Exact" :
    score >= 75 ? "Strong" :
    score >= 50 ? "Moderate" :
    "Broad";

  return { score, label };
}

function buildTransitConditionSummary(
  condition: TransitQueryCondition
) {
  const planet = condition.planet;

  if (condition.conditionType === "sign_degree") {
    return `${planet} in ${condition.sign} ${condition.degree}°`;
  }

  if (condition.conditionType === "nakshatra") {
    return `${planet} in ${condition.nakshatra}`;
  }

  if (condition.conditionType === "retrograde") {
    return `${planet} retrograde`;
  }

  if (condition.conditionType === "same_sign_as") {
    return `${planet} in same sign as ${condition.comparePlanet}`;
  }

  if (condition.conditionType === "conjunct_natal") {
    return `${planet} hits natal ${condition.natalPlanet} within ±${condition.orb}°`;
  }

  return planet;
}
function getTransitStrengthClasses(label?: string) {
  switch (label) {
    case "Exact":
      return {
        outer:
          "border-emerald-300 bg-emerald-50/80",
        inner:
          "border-emerald-200 bg-white",
        heading:
          "text-emerald-900",
        badge:
          "bg-emerald-600 text-white",
      };

    case "Strong":
      return {
        outer:
          "border-sky-300 bg-sky-50/80",
        inner:
          "border-sky-200 bg-white",
        heading:
          "text-sky-900",
        badge:
          "bg-sky-600 text-white",
      };

    case "Moderate":
      return {
        outer:
          "border-amber-300 bg-amber-50/80",
        inner:
          "border-amber-200 bg-white",
        heading:
          "text-amber-900",
        badge:
          "bg-amber-500 text-white",
      };

    default:
      return {
        outer:
          "border-slate-300 bg-slate-50/80",
        inner:
          "border-slate-200 bg-white",
        heading:
          "text-slate-800",
        badge:
          "bg-slate-500 text-white",
      };
  }
}
function sortTransitQueryMatches(
  matches: TransitQueryMatch[],
  sortBy: "strongest" | "longest" | "earliest" | "exact"
) {
  const rows = [...matches];

  if (sortBy === "exact") {
    return rows
      .filter((row) =>
        typeof row.strengthScore === "number" &&
        row.strengthScore >= 92
      )
      .sort((a, b) => Number(b.strengthScore ?? 0) - Number(a.strengthScore ?? 0));
  }

  if (sortBy === "longest") {
    return rows.sort(
      (a, b) => Number(b.durationHours ?? 0) - Number(a.durationHours ?? 0)
    );
  }

  if (sortBy === "earliest") {
    return rows.sort((a, b) => {
      return Date.parse(a.timestampUTC) -
        Date.parse(b.timestampUTC);
    });
  }

  return rows.sort((a, b) => {
    const aScore = a.strengthScore ?? -1;
    const bScore = b.strengthScore ?? -1;

    const strengthDiff = bScore - aScore;

    if (strengthDiff !== 0) return strengthDiff;

    return Number(b.durationHours ?? 0) - Number(a.durationHours ?? 0);
  });
}
function formatTransitUtcOffset(minutes?: number): string {
  if (typeof minutes !== "number" || !Number.isFinite(minutes)) {
    return "";
  }

  const sign = minutes < 0 ? "-" : "+";
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const mins = String(absolute % 60).padStart(2, "0");

  return `UTC${sign}${hours}:${mins}`;
}

function mergeTransitQueryMatches(
  matches: TransitQueryMatch[],
  stepHours: number,
  searchEndExclusiveUTC: string
): TransitQueryMatch[] {
  if (stepHours !== 1 && stepHours !== 6) {
    throw new Error("Invalid transit sampling interval.");
  }

  const searchEndMs = Date.parse(searchEndExclusiveUTC);

  if (!Number.isFinite(searchEndMs)) {
    throw new Error("Invalid transit search boundary.");
  }

  const stepMs = stepHours * 3600000;

  for (const match of matches) {
    if (
      typeof match.timestampUTC !== "string" ||
      !match.timestampUTC.endsWith("Z") ||
      !Number.isFinite(Date.parse(match.timestampUTC)) ||
      Date.parse(match.timestampUTC) >= searchEndMs ||
      !match.timezone ||
      !Number.isFinite(match.utcOffsetMinutes)
    ) {
      throw new Error("Invalid transit result timestamp.");
    }
  }

  const sorted = [...matches].sort(
    (a, b) =>
      Date.parse(a.timestampUTC) -
      Date.parse(b.timestampUTC)
  );

  const merged: TransitQueryMatch[] = [];

  for (const match of sorted) {
    const currentMs = Date.parse(match.timestampUTC);
    const last = merged[merged.length - 1];

    const lastMs = last
      ? Date.parse(last.endTimestampUTC ?? last.timestampUTC)
      : NaN;

    const strength = calculateMatchStrength(
      match.matchedPlanets
    );

    const isConsecutive =
      last &&
      last.timezone === match.timezone &&
      currentMs - lastMs === stepMs;

    if (last && currentMs === lastMs) {
      continue;
    }

    if (isConsecutive) {
      last.endDateISO = match.dateISO;
      last.endTime = match.time;
      last.endTimestampUTC = match.timestampUTC;
      last.endUtcOffsetMinutes = match.utcOffsetMinutes;
      last.sampleCount = (last.sampleCount ?? 1) + 1;

      last.durationHours =
        (Math.min(currentMs + stepMs, searchEndMs) -
          Date.parse(last.timestampUTC)) / 3600000;

      last.matchedPlanets = match.matchedPlanets;
      last.strengthScore = strength.score;
      last.strengthLabel = strength.label;
    } else {
      merged.push({
        ...match,
        endDateISO: match.dateISO,
        endTime: match.time,
        endTimestampUTC: match.timestampUTC,
        endUtcOffsetMinutes: match.utcOffsetMinutes,
        sampleCount: 1,
        durationHours:
          (Math.min(currentMs + stepMs, searchEndMs) -
            currentMs) / 3600000,
        strengthScore: strength.score,
        strengthLabel: strength.label,
      });
    }
  }

  return merged;
}

function DataEnginePageContent() {
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
  () => getTodayISOInTimezone("UTC")
);
  const [compareDateISO, setCompareDateISO] = useState("");
 const [utilityPanchangData, setUtilityPanchangData] = useState<any | null>(null);
const [utilityHoraData, setUtilityHoraData] = useState<any | null>(null);
const searchParams = useSearchParams();
const router = useRouter();
const crmClientId: string | null = searchParams?.get("clientId") ?? null;
const [checkingAccess, setCheckingAccess] = useState(true);
const [accessAllowed, setAccessAllowed] = useState(false);

const [preferredNodeMode, setPreferredNodeMode] =
  useState<NodeMode | null>(null);

const [selectedNodeMode, setSelectedNodeMode] =
  useState<NodeMode | null>(null);

const [savedNodeMode, setSavedNodeMode] =
  useState<NodeMode | null>(null);

const [nodePreferenceLoading, setNodePreferenceLoading] =
  useState(true);

const [nodePreferenceError, setNodePreferenceError] =
  useState("");

const activeNodeMode = resolveActiveNodeMode({
  selectedNodeMode,
  savedNodeMode,
  preferredNodeMode,
});

const nodeModeReady =
  selectedNodeMode !== null ||
  savedNodeMode !== null ||
  (!nodePreferenceLoading &&
    !nodePreferenceError &&
    preferredNodeMode !== null);

const nodeModeUnavailableMessage =
  nodePreferenceLoading
    ? "Loading your calculation preferences. Please wait."
    : nodePreferenceError ||
      "Please select a lunar node convention.";

useEffect(() => {
  if (!accessAllowed) {
    setPreferredNodeMode(null);
    setNodePreferenceLoading(true);
    return;
  }

  let alive = true;

  async function loadNodePreference() {
    setNodePreferenceLoading(true);
    setNodePreferenceError("");

    try {
      const mode = await getPreferredNodeMode();

      if (alive) {
        setPreferredNodeMode(mode);
      }
    } catch (error: any) {
      if (alive) {
        setPreferredNodeMode(null);
        setNodePreferenceError(
          error?.message || "Unable to load node preference."
        );
      }
    } finally {
      if (alive) {
        setNodePreferenceLoading(false);
      }
    }
  }

  void loadNodePreference();

  return () => {
    alive = false;
  };
}, [accessAllowed]);
const [linkedClient, setLinkedClient] = useState<AstrologerClient | null>(null);
const [linkedClientCharts, setLinkedClientCharts] = useState<ClientChart[]>([]);
const [selectedLinkedChartId, setSelectedLinkedChartId] = useState("");
const [linkedClientLoading, setLinkedClientLoading] = useState(false);
const [saveToClientLoading, setSaveToClientLoading] = useState(false);
const [saveToClientMessage, setSaveToClientMessage] = useState("");
const [crmConsultationType, setCrmConsultationType] = useState("");
const [savedCrmClientId, setSavedCrmClientId] = useState<string | null>(null);
const [showSavePanel, setShowSavePanel] = useState(false);
const [saveLoading, setSaveLoading] = useState(false);
const [crmIsVip, setCrmIsVip] = useState(false);
const [crmName, setCrmName] = useState("");
const [crmPhone, setCrmPhone] = useState("");
const [crmEmail, setCrmEmail] = useState("");
const [crmPrimaryIssue, setCrmPrimaryIssue] = useState("");
const [crmRemediesSuggested, setCrmRemediesSuggested] = useState("");
const [crmNotes, setCrmNotes] = useState("");
const [crmFollowUpDate, setCrmFollowUpDate] = useState("");
const [showForecastTransits, setShowForecastTransits] = useState(true);
const [showForecastDashaHighlight, setShowForecastDashaHighlight] = useState(true);
const [showForecastActivatedHouses, setShowForecastActivatedHouses] = useState(true);
const [showForecastDegreeHits, setShowForecastDegreeHits] = useState(true);
const [showForecastMoonTriggers, setShowForecastMoonTriggers] = useState(true);
const [showForecastNatalPlanets, setShowForecastNatalPlanets] = useState(true);
const [forecastLens, setForecastLens] = useState<
  | "career"
  | "money"
  | "marriage"
  | "property"
  | "health"
  | "foreign"
  | "spiritual"
  | "disputes"
  | "children"
>("career");
// TEMP: later replace with real subscription check
const isPremierUser = true;
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
const [transitQueryConditions, setTransitQueryConditions] = useState<
  TransitQueryCondition[]
>([
{
  id: "condition-1",
  planet: "Sun",
  conditionType: "sign_degree",
  sign: "Taurus",
  degree: "21",
  minute: "0",
  orb: "1",
  nakshatra: "Rohini",
  comparePlanet: "Moon",
  natalPlanet: "Moon",
enabled: true,
},
{
  id: "condition-2",
  planet: "Moon",
  conditionType: "sign_degree",
  sign: "Gemini",
  degree: "18",
  minute: "0",
  orb: "1",
  nakshatra: "Mrigashira",
  comparePlanet: "Sun",
  natalPlanet: "Moon",
  enabled: true,
}
]);

const [transitQueryFromISO, setTransitQueryFromISO] = useState(
  new Date().toISOString().slice(0, 10)
);

const [transitQueryToISO, setTransitQueryToISO] = useState(
  addDaysISO(new Date().toISOString().slice(0, 10), 30)
);

const [transitQueryLoading, setTransitQueryLoading] = useState(false);
const [transitQueryError, setTransitQueryError] = useState("");
const [transitQueryMatches, setTransitQueryMatches] = useState<TransitQueryMatch[]>([]);
const [transitQuerySortBy, setTransitQuerySortBy] = useState<
  "strongest" | "longest" | "earliest" | "exact"
>("strongest");
const [transitQueryHasSearched, setTransitQueryHasSearched] = useState(false);

const transitQueryRequestIdRef = React.useRef(0);
const transitQueryMountedRef = React.useRef(false);

React.useLayoutEffect(() => {
  transitQueryMountedRef.current = true;

  return () => {
    transitQueryMountedRef.current = false;
    transitQueryRequestIdRef.current += 1;
  };
}, []);

React.useLayoutEffect(() => {
  transitQueryRequestIdRef.current += 1;

  setTransitQueryMatches([]);
  setTransitQueryHasSearched(false);
  setTransitQueryError("");
  setTransitQueryLoading(false);

  return () => {
    transitQueryRequestIdRef.current += 1;
  };
}, [
  data,
  name,
  dateISO,
  time,
  selectedPlace,
  timezone,
  activeNodeMode,
  nodeModeReady,
  linkedClientLoading,
  loading,
  transitQueryConditions,
  transitQueryFromISO,
  transitQueryToISO,
]);
const FORECAST_LENS_META = {
  career: {
    label: "Career",
    houses: [10, 6, 2, 11],
    planets: ["Sun", "Saturn", "Jupiter", "Mercury"],
  },

  money: {
    label: "Money",
    houses: [2, 11, 5, 9],
    planets: ["Jupiter", "Venus", "Mercury"],
  },

  marriage: {
    label: "Marriage",
    houses: [7, 2, 11],
    planets: ["Venus", "Jupiter", "Moon"],
  },

  property: {
    label: "Property",
    houses: [4, 11, 2],
    planets: ["Mars", "Moon", "Venus"],
  },

  health: {
    label: "Health",
    houses: [6, 8, 12],
    planets: ["Saturn", "Mars", "Sun"],
  },

  foreign: {
    label: "Foreign",
    houses: [12, 9, 7],
    planets: ["Rahu", "Moon", "Saturn"],
  },

  spiritual: {
    label: "Spiritual",
    houses: [12, 8, 9],
    planets: ["Ketu", "Jupiter", "Moon"],
  },

  disputes: {
    label: "Disputes",
    houses: [6, 8, 3],
    planets: ["Mars", "Saturn", "Rahu"],
  },

  children: {
    label: "Children",
    houses: [5, 9, 2],
    planets: ["Jupiter", "Sun", "Moon"],
  },
} as const;
const focusedHouses: number[] =
  [...FORECAST_LENS_META[forecastLens].houses];
useEffect(() => {
  try {
    const settings = ensureNotificationTz("UTC");

    setSelectedDateISO(
      getTodayISOInTimezone(settings.tz)
    );
  } catch {
    setSelectedDateISO(
      getTodayISOInTimezone("UTC")
    );
  }
}, []);
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
function updateTransitQueryCondition(
  id: string,
  patch: Partial<TransitQueryCondition>
) {
  setTransitQueryConditions((rows) =>
    rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
  );
}

function addTransitQueryCondition() {
  setTransitQueryConditions((rows) => [
    ...rows,
{
  id: `condition-${Date.now()}`,
  planet: "Jupiter",
  conditionType: "sign_degree",
  sign: "Aries",
  degree: "0",
  minute: "0",
  orb: "1",
  nakshatra: "Ashwini",
  comparePlanet: "Moon",
  natalPlanet: "Moon",
  enabled: true,
}
  ]);
}

function removeTransitQueryCondition(id: string) {
  setTransitQueryConditions((rows) =>
    rows.length <= 1 ? rows : rows.filter((row) => row.id !== id)
  );
}

async function handleRunTransitQuery() {
  const requestId = ++transitQueryRequestIdRef.current;

  const isCurrentRequest = () =>
    transitQueryMountedRef.current &&
    transitQueryRequestIdRef.current === requestId;

  setTransitQueryMatches([]);
  setTransitQueryHasSearched(false);
  setTransitQueryError("");
  setTransitQueryLoading(false);

  if (loading || linkedClientLoading) {
    setTransitQueryError(
      "Please wait for the chart to finish loading."
    );
    return;
  }

  if (!nodeModeReady) {
    setTransitQueryError(nodeModeUnavailableMessage);
    return;
  }

  const chart = data as any;

  const birth =
    chart?.foundations?.birthMeta ??
    chart?.birthMeta;

  const nodeMode = chart?.nodeMode;
  const nodeCalculationVersion =
    chart?.nodeCalculationVersion;

  if (
    (nodeMode !== "mean" && nodeMode !== "true") ||
    nodeMode !== activeNodeMode ||
    nodeCalculationVersion !== "lahiri-swiss-node-v1"
  ) {
    setTransitQueryError(
      "Chart calculation metadata is missing or has changed. Please regenerate the Data Engine."
    );
    return;
  }

  if (
    !birth?.dateISO ||
    !birth?.time ||
    !birth?.timezone ||
    birth.lat == null ||
    birth.lon == null ||
    String(birth.lat).trim() === "" ||
    String(birth.lon).trim() === "" ||
    !Number.isFinite(Number(birth.lat)) ||
    !Number.isFinite(Number(birth.lon)) ||
    Math.abs(Number(birth.lat)) > 90 ||
    Math.abs(Number(birth.lon)) > 180
  ) {
    setTransitQueryError(
      "Birth details are incomplete. Please regenerate the Data Engine."
    );
    return;
  }

  if (
    !selectedPlace ||
    birth.dateISO !== dateISO.trim() ||
    String(birth.time).slice(0, 5) !==
      time.trim().slice(0, 5) ||
    birth.timezone !== timezone ||
    Math.abs(Number(birth.lat) - selectedPlace.lat) > 0.000001 ||
    Math.abs(Number(birth.lon) - selectedPlace.lon) > 0.000001
  ) {
    setTransitQueryError(
      "Birth details have changed. Please regenerate the Data Engine."
    );
    return;
  }

  const activeConditions =
    transitQueryConditions.filter((row) => row.enabled);

  if (!activeConditions.length) {
    setTransitQueryError(
      "Please enable at least one condition."
    );
    return;
  }

  if (
    !transitQueryFromISO ||
    !transitQueryToISO ||
    transitQueryToISO < transitQueryFromISO
  ) {
    setTransitQueryError(
      "Please select a valid date range."
    );
    return;
  }

  try {
    setTransitQueryLoading(true);

    const res = await fetch("/api/transit-query", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nodeMode,
        birth: {
          name: birth.name || "Transit Query",
          city: birth.city,
          dateISO: birth.dateISO,
          time: birth.time,
          timezone: birth.timezone,
          lat: Number(birth.lat),
          lon: Number(birth.lon),
        },
        fromISO: transitQueryFromISO,
        toISO: transitQueryToISO,
        conditions: activeConditions,
      }),
    });

    const json = await res.json();

    if (!isCurrentRequest()) return;

    if (res.status === 401) {
      throw new Error(
        "Please sign in again to use Transit Query."
      );
    }

    if (res.status === 403) {
      throw new Error(
        "Your account does not currently have Data Engine access."
      );
    }

    if (!res.ok || json?.ok !== true) {
      throw new Error(
        json?.error || "Transit query failed."
      );
    }

    if (
      json.nodeMode !== nodeMode ||
      json.nodeCalculationVersion !== nodeCalculationVersion
    ) {
      throw new Error(
        "Transit calculation convention does not match your chart. Please regenerate the Data Engine."
      );
    }

    if (!Array.isArray(json.matches)) {
      throw new Error("Invalid transit query response.");
    }

    const mergedMatches = mergeTransitQueryMatches(
      json.matches,
      json.stepHours,
      json.searchEndExclusiveUTC
    );

    if (!isCurrentRequest()) return;

setTransitQueryMatches(mergedMatches);

    setTransitQueryHasSearched(true);
  } catch (e: any) {
    if (isCurrentRequest()) {
      setTransitQueryError(
        e?.message || "Transit query failed."
      );
    }
  } finally {
    if (isCurrentRequest()) {
      setTransitQueryLoading(false);
    }
  }
}

const panchangRequestIdRef = React.useRef(0);
const horaRequestIdRef = React.useRef(0);

React.useLayoutEffect(() => {
  panchangRequestIdRef.current += 1;
  setUtilityPanchangData(null);
  setUtilityPanchangLoading(false);
  setUtilityPanchangError("");

  return () => {
    panchangRequestIdRef.current += 1;
  };
}, [
  data,
  loading,
  activeNodeMode,
  nodeModeReady,
  linkedClientLoading,
  accessAllowed,
  crmClientId,
  name,
  dateISO,
  time,
  timezone,
  selectedPlace,
  plan,
  selectedDateISO,
  compareDateISO,
  utilityPanchangPlace,
  utilityPanchangTimezone,
  utilityPanchangDateISO,
]);

React.useLayoutEffect(() => {
  horaRequestIdRef.current += 1;
  setUtilityHoraData(null);
  setUtilityHoraLoading(false);
  setUtilityHoraError("");

  return () => {
    horaRequestIdRef.current += 1;
  };
}, [
  data,
  loading,
  activeNodeMode,
  nodeModeReady,
  linkedClientLoading,
  accessAllowed,
  crmClientId,
  name,
  dateISO,
  time,
  timezone,
  selectedPlace,
  plan,
  selectedDateISO,
  compareDateISO,
  utilityHoraPlace,
  utilityHoraTimezone,
  utilityHoraDateISO,
  utilityHoraTime,
]);

async function handleGeneratePanchang() {
  const snapshot = getVerifiedCrmChartSnapshot();

  if (!snapshot) {
    setUtilityPanchangError(
      "Please generate the Data Engine using the current calculation convention first."
    );
    return;
  }

  if (!nodeModeReady || linkedClientLoading) {
    setUtilityPanchangError(
      linkedClientLoading
        ? "Loading the saved client chart. Please wait."
        : nodeModeUnavailableMessage
    );
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

  const requestId = ++panchangRequestIdRef.current;
  const requestedNodeMode = snapshot.nodeMode;
  setUtilityPanchangData(null);

  try {
    setUtilityPanchangLoading(true);
    setUtilityPanchangError("");

    const res = await fetch("/api/data-engine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nodeMode: requestedNodeMode,
        birth: {
          name: name.trim(),
          city: snapshot.placeName,
          dateISO: snapshot.birthDateISO,
          time: snapshot.birthTime,
          timezone: snapshot.birthTz,
          lat: snapshot.lat,
          lon: snapshot.lon,
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

    if (requestId !== panchangRequestIdRef.current) return;

if (!res.ok || json?.ok === false) {
  throw new Error(json?.error || "Failed to update Panchang.");
}

if (
      json?.nodeMode !== requestedNodeMode ||
      json?.nodeCalculationVersion !== "lahiri-swiss-node-v1"
    ) {
      throw new Error(
        "Calculation convention mismatch. Please regenerate the chart."
      );
    }

    setUtilityPanchangData(json?.timing?.utilities?.panchang ?? null);
  } catch (e: any) {
    if (requestId !== panchangRequestIdRef.current) return;
    setUtilityPanchangError(e?.message || "Something went wrong.");
  } finally {
    if (requestId === panchangRequestIdRef.current) setUtilityPanchangLoading(false);
  }
}

const [nodePreferenceSaving, setNodePreferenceSaving] = useState(false);
const [nodePreferenceSaveMessage, setNodePreferenceSaveMessage] = useState("");
const nodePreferenceSaveLock = React.useRef(false);

async function handleSaveNodePreference() {
  if (
    !accessAllowed ||
    !nodeModeReady ||
    nodePreferenceLoading ||
    nodePreferenceSaveLock.current ||
    linkedClientLoading
  ) return;

  const requestedMode = activeNodeMode;

  nodePreferenceSaveLock.current = true;
  setNodePreferenceSaving(true);
  setNodePreferenceSaveMessage("");

  try {
    const confirmedMode = await persistNodePreference(requestedMode);

    if (confirmedMode !== requestedMode) {
      throw new Error("Unable to verify the saved account preference.");
    }

    setPreferredNodeMode(confirmedMode);
    setNodePreferenceSaveMessage(
      `${getNodeModeLabel(confirmedMode)} saved as your account default.`
    );
  } catch (error: any) {
    setNodePreferenceSaveMessage(
      error?.message || "Unable to save account preference."
    );
  } finally {
    nodePreferenceSaveLock.current = false;
    setNodePreferenceSaving(false);
  }
}

const chartRequestIdRef = React.useRef(0);

React.useLayoutEffect(() => {
  chartRequestIdRef.current += 1;
  setData(null);
  setLoading(false);
  setError("");
  setShowSavePanel(false);
  setSaveToClientMessage("");

  return () => {
    chartRequestIdRef.current += 1;
  };
}, [
  activeNodeMode,
  nodeModeReady,
  linkedClientLoading,
  accessAllowed,
  crmClientId,
  selectedLinkedChartId,
  name,
  dateISO,
  time,
  timezone,
  selectedPlace,
  plan,
  selectedDateISO,
  compareDateISO,
]);

async function handleGenerate() {
  if (!nodeModeReady || linkedClientLoading) {
    setError(
      linkedClientLoading
        ? "Loading the saved client chart. Please wait."
        : nodeModeUnavailableMessage
    );
    return;
  }
  if (!selectedPlace) {
    setError("Please select a place.");
    return;
  }

  if (!dateISO.trim() || !time.trim()) {
    setError("Please enter date and time.");
    return;
  }

  const requestId = ++chartRequestIdRef.current;
  const requestedNodeMode = activeNodeMode;

  setData(null);

  try {
    setLoading(true);
    setError("");

    const res = await fetch("/api/data-engine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nodeMode: requestedNodeMode,
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

    if (requestId !== chartRequestIdRef.current) return;

    if (!res.ok || json?.ok === false) {
      throw new Error(json?.error || "Failed to generate.");
    }
;
    if (
      json?.nodeMode !== requestedNodeMode ||
      json?.nodeCalculationVersion !== "lahiri-swiss-node-v1"
    ) {
      throw new Error(
        "Calculation convention mismatch. Please regenerate the chart."
      );
    }

    setData(json);
  } catch (e: any) {
    if (requestId !== chartRequestIdRef.current) return;
    setError(e?.message || "Something went wrong.");
  } finally {
    if (requestId === chartRequestIdRef.current) setLoading(false);
  }
}
function getVerifiedCrmChartSnapshot() {
  if (
    !data ||
    loading ||
    linkedClientLoading ||
    !nodeModeReady ||
    !accessAllowed ||
    data.nodeMode !== activeNodeMode ||
    data.nodeCalculationVersion !== "lahiri-swiss-node-v1"
  ) {
    return null;
  }

  const birth =
    data.foundations?.birthMeta ?? data.birthMeta ?? null;

  if (!birth || !selectedPlace) return null;

  const lat = birth.lat;
  const lon = birth.lon;

  if (
    typeof lat !== "number" ||
    typeof lon !== "number" ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180 ||
    !birth.dateISO ||
    !birth.time ||
    !birth.timezone ||
    birth.dateISO !== dateISO.trim() ||
    String(birth.time).slice(0, 5) !== time.trim().slice(0, 5) ||
    birth.timezone !== timezone ||
    Math.abs(lat - selectedPlace.lat) > 0.000001 ||
    Math.abs(lon - selectedPlace.lon) > 0.000001
  ) {
    return null;
  }

  return {
    birthDateISO: birth.dateISO,
    birthTime: birth.time,
    birthTz: birth.timezone,
    lat,
    lon,
    placeName: birth.city ?? birth.place_name ?? selectedPlace.name,
    nodeMode: requireNodeMode(data.nodeMode),
  };
}

async function handleSaveGeneratedChartToClient() {
  if (!crmClientId) {
    setSaveToClientMessage("No CRM client linked.");
    return;
  }

  const snapshot = getVerifiedCrmChartSnapshot();

  if (!snapshot) {
    setSaveToClientMessage(
      "Generate a valid chart using the current calculation convention before saving."
    );
    return;
  }

  try {
    setSaveToClientLoading(true);
    setSaveToClientMessage("");

    await addClientChart({
      clientId: crmClientId,
      chartName: `${linkedClient?.name ?? name ?? "Client"} Birth Chart`,
      ...snapshot,
    });
    setSavedCrmClientId(crmClientId);
    setSaveToClientMessage("Chart saved to client profile.");
  } catch (e: any) {
    setSaveToClientMessage(e?.message || "Failed to save chart.");
  } finally {
    setSaveToClientLoading(false);
  }
}
async function handleGenerateHora() {
  if (!nodeModeReady || linkedClientLoading) {
    setUtilityHoraError(
      linkedClientLoading
        ? "Loading the saved client chart. Please wait."
        : nodeModeUnavailableMessage
    );
    return;
  }
  const snapshot = getVerifiedCrmChartSnapshot();

  if (!snapshot) {
    setUtilityHoraError(
      "Please generate the Data Engine using the current calculation convention first."
    );
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

  const requestId = ++horaRequestIdRef.current;
  const requestedNodeMode = snapshot.nodeMode;
  setUtilityHoraData(null);

  try {
    setUtilityHoraLoading(true);
    setUtilityHoraError("");

    const res = await fetch("/api/data-engine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nodeMode: requestedNodeMode,
        birth: {
          name: name.trim(),
          city: snapshot.placeName,
          dateISO: snapshot.birthDateISO,
          time: snapshot.birthTime,
          timezone: snapshot.birthTz,
          lat: snapshot.lat,
          lon: snapshot.lon,
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

    if (requestId !== horaRequestIdRef.current) return;

    if (!res.ok || json?.ok === false) {
      throw new Error(json?.error || "Failed to update Hora.");
    }

    if (
      json?.nodeMode !== requestedNodeMode ||
      json?.nodeCalculationVersion !== "lahiri-swiss-node-v1"
    ) {
      throw new Error(
        "Calculation convention mismatch. Please regenerate the chart."
      );
    }

    setUtilityHoraData(json?.timing?.utilities?.hora ?? null);
  } catch (e: any) {
    if (requestId !== horaRequestIdRef.current) return;
    setUtilityHoraError(e?.message || "Something went wrong.");
  } finally {
    if (requestId === horaRequestIdRef.current) setUtilityHoraLoading(false);
  }
}
async function handleSaveToCRM() {
  if (!data) return;

  if (!isPremierUser) {
    alert("Upgrade to Premier to save clients");
    return;
  }

  setCrmName((current) => current || name.trim());


  setShowSavePanel(true);
}
async function handleSaveGeneratedChartAsClient() {
  if (!data) return;

  const snapshot = getVerifiedCrmChartSnapshot();
  const saveName = crmName.trim() || name.trim();

  if (!snapshot || !saveName) {
    setSaveToClientMessage(
      "Generate a valid chart and enter the client name before saving."
    );
    return;
  }

  try {
    setSaveLoading(true);
    setSaveToClientMessage("");

    const client = await createAstrologerClient({
      name: saveName,
      phone: crmPhone,
      email: crmEmail,
      notes: crmNotes,
      primaryIssue: crmPrimaryIssue,
      remediesSuggested: crmRemediesSuggested,
      clientStatus: crmFollowUpDate ? "follow_up" : "active",
      nextAction: crmFollowUpDate ? "Follow up with client" : "",
      nextFollowUpDate: crmFollowUpDate,
      isVip: crmIsVip,
      consultationType: crmConsultationType,
    });

    await addClientChart({
      clientId: client.id,
      chartName: `${saveName} Birth Chart`,
      ...snapshot,
    });

    setSaveToClientMessage("Client and chart saved to Premier CRM.");
setShowSavePanel(false);

setSavedCrmClientId(client.id);
setSaveToClientMessage("Client and chart saved to Premier CRM.");
setShowSavePanel(false);
return;
  } catch (e: any) {
    setSaveToClientMessage(e?.message || "Failed to save client and chart.");
  } finally {
    setSaveLoading(false);
  }
}
function loadLinkedChartIntoForm(chartId: string) {
  const chart = linkedClientCharts.find((item) => item.id === chartId);

  if (!chart) return;

  chartRequestIdRef.current += 1;
  setData(null);
  setLoading(false);
  setShowSavePanel(false);
  setSaveToClientMessage("");
  setSelectedLinkedChartId(chartId);

  setSavedNodeMode(requireNodeMode(chart.node_mode));
  setSelectedNodeMode(null);
  setDateISO(chart.birth_date_iso ?? "");
  setTime(chart.birth_time ?? "");
  setTimezone(chart.birth_tz ?? "");

  if (
    chart.place_name &&
    typeof chart.lat === "number" &&
    typeof chart.lon === "number" &&
    Number.isFinite(chart.lat) &&
    Number.isFinite(chart.lon) &&
    Math.abs(chart.lat) <= 90 &&
    Math.abs(chart.lon) <= 180
  ) {
    setSelectedPlace({
      name: chart.place_name,
      lat: chart.lat,
      lon: chart.lon,
    });
  } else {
    setSelectedPlace(null);
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
const dashaTimelines = useMemo(
  () => data?.timing?.dasha?.timelines ?? data?.dasha?.timelines ?? {},
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
  const triggerEngine = useMemo(
  () => data?.triggerEngine ?? null,
  [data]
);
const activationFacts = useMemo(
  () => triggerEngine?.facts ?? [],
  [triggerEngine]
);

const activeHouseRows = useMemo(() => {
  type HouseRow = {
  house: number;
  total: number;
  facts: any[];
};

const rows = new Map<number, HouseRow>();

  const getFactHouse = (fact: any) => {
    if (typeof fact?.house === "number") return fact.house;

    const raw = String(fact?.target ?? "");
    const match = raw.match(/house\s+(\d+)/i);
    return match ? Number(match[1]) : null;
  };

  for (const fact of activationFacts) {
    if (!["transit_house", "transit_aspect"].includes(String(fact?.kind))) continue;
    if (fact?.priority !== "primary") continue;
    const house = getFactHouse(fact);
    if (!house) continue;

    const existing = rows.get(house);

if (existing) {
  existing.total += 1;
  const alreadyExists = existing.facts.some(
  (f: any) => f.planet === fact.planet && f.kind === fact.kind
);

if (!alreadyExists) {
  existing.facts.push(fact);
}
} else {
  rows.set(house, {
    house,
    total: Number(fact?.strength ?? 0),
    facts: [fact],
  });
}
  }

  return Array.from(rows.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}, [activationFacts]);
const activeDashaPlanetRows = useMemo(() => {
  
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

  const active = [md, ad].filter(Boolean).map(String);

  return active.map((planet) => {
    const natalRow = planets.find((p: any) => p?.planet === planet);
    const transitRow = transitNow?.planets?.find((p: any) => p?.planet === planet);

    return {
      planet,
      natalHouse: natalRow?.house ?? natalRow?.houseFromLagna ?? "—",
      natalSign: natalRow?.sign ?? "—",
      natalDegree: natalRow?.degree ?? null,
      natalNakshatra: natalRow?.nakshatra ?? "—",
      transitHouse: transitRow?.houseFromLagna ?? transitRow?.house ?? "—",
      transitSign: transitRow?.sign ?? "—",
      transitDegree: transitRow?.degree ?? null,
      transitNakshatra: transitRow?.nakshatra ?? "—",
    };
  });
}, [currentDasha, planets, transitNow]);
const dashaHouseRows = useMemo(() => {
  return activeDashaPlanetRows.flatMap((row: any) => {
    const out: any[] = [];

    if (typeof row.natalHouse === "number") {
      out.push({
        house: row.natalHouse,
        facts: [
          {
            id: `${row.planet}-natal-placement`,
            planet: row.planet,
            kind: "dasha_placement",
            priority: "primary",
          },
        ],
      });
    }

    return out;
  });
}, [activeDashaPlanetRows]);

const forecastHouseRows = useMemo(() => {
  return [...activeHouseRows, ...dashaHouseRows];
}, [activeHouseRows, dashaHouseRows]);
const activeDashaPlanetNames = useMemo(
  () => activeDashaPlanetRows.map((row: any) => row.planet).filter(Boolean),
  [activeDashaPlanetRows]
);
const activePlanetRows = useMemo(() => {
  const planets = transitNow?.planets ?? [];

  const factScoreByPlanet = new Map<string, number>();

  for (const fact of activationFacts) {
    const planet = String(fact?.planet ?? "");
    if (!planet) continue;

    factScoreByPlanet.set(
      planet,
      (factScoreByPlanet.get(planet) ?? 0) + Number(fact?.strength ?? 0)
    );
  }

  return planets
    .map((p: any) => ({
      planet: p?.planet ?? "—",
      sign: p?.sign ?? "—",
      house: p?.houseFromLagna ?? p?.house ?? "—",
      degree: p?.degree ?? null,
      nakshatra: p?.nakshatra ?? "—",
      pada: p?.pada ?? null,
      score: factScoreByPlanet.get(String(p?.planet ?? "")) ?? 0,
    }))
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 12);
}, [transitNow, activationFacts]);
const mainArea = triggerEngine?.topAreas?.[0] ?? null;
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
const visibleTransitQueryMatches = useMemo(
  () => sortTransitQueryMatches(
    transitQueryMatches,
    transitQuerySortBy
  ),
  [transitQueryMatches, transitQuerySortBy]
);
const solarShadowPoints = useMemo(
  () =>
    data?.foundations?.solarShadowPoints ??
    data?.solarShadowPoints ??
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
useEffect(() => {
  if (!crmClientId) {
    setLinkedClient(null);
    setLinkedClientCharts([]);
    setSelectedLinkedChartId("");
    setSavedNodeMode(null);
    setSelectedNodeMode(null);
    setLinkedClientLoading(false);
    return;
  }

  let alive = true;

  async function loadLinkedClient() {
    try {
      setLinkedClientLoading(true);
      setSaveToClientMessage("");
      setLinkedClient(null);
      setLinkedClientCharts([]);
      setSelectedLinkedChartId("");
      setSavedNodeMode(null);
      setSelectedNodeMode(null);
      setSelectedPlace(null);
      setName("");
      setDateISO("");
      setTime("");
      setTimezone("");

      const result = await getAstrologerClient(crmClientId as string);

      if (!alive) return;

      setLinkedClient(result.client);
      setLinkedClientCharts(result.charts ?? []);

      const latestChart = result.charts?.[0];
      if (latestChart?.id) {
  setSelectedLinkedChartId(latestChart.id);
}
      if (result.client?.name) {
        setName(result.client.name);
      }

      if (latestChart) {
        setSavedNodeMode(requireNodeMode(latestChart.node_mode));
        setSelectedNodeMode(null);
        setDateISO(latestChart.birth_date_iso ?? "");
        setTime(latestChart.birth_time ?? "");
        setTimezone(latestChart.birth_tz ?? "");

        if (
          latestChart.place_name &&
          typeof latestChart.lat === "number" &&
          typeof latestChart.lon === "number" &&
          Number.isFinite(latestChart.lat) &&
          Number.isFinite(latestChart.lon) &&
          Math.abs(latestChart.lat) <= 90 &&
          Math.abs(latestChart.lon) <= 180
        ) {
          setSelectedPlace({
            name: latestChart.place_name,
            lat: latestChart.lat,
            lon: latestChart.lon,
          });
        }
      }
    } catch (e: any) {
      if (!alive) return;
      setError(e?.message || "Failed to load linked client.");
    } finally {
      if (alive) setLinkedClientLoading(false);
    }
  }

  loadLinkedClient();

  return () => {
    alive = false;
  };
}, [crmClientId]);
useEffect(() => {
  let cancelled = false;

  async function checkAccess() {
    try {
      const res = await fetch("/api/entitlements");

      if (!res.ok) {
        router.replace(
          "/sarathi/astrologers/login?next=/sarathi/data-engine"
        );
        return;
      }

      const json = await res.json();

      if (!json.entitlements?.dataEngine?.allowed) {
        router.replace("/sarathi/upgrade?feature=data-engine");
        return;
      }

      if (!cancelled) {
        setAccessAllowed(true);
      }
    } catch {
      router.replace(
        "/sarathi/astrologers/login?next=/sarathi/data-engine"
      );
    } finally {
      if (!cancelled) {
        setCheckingAccess(false);
      }
    }
  }

  checkAccess();

  return () => {
    cancelled = true;
  };
}, [router]);
  const selectedVargaValue =
  vargaEntries.find(([key]) => key === selectedVarga)?.[1] ?? null;

const primaryButtonClass =
  "rounded-xl bg-[color:var(--primary)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60";

const errorBoxClass =
  "mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm";
 if (checkingAccess) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      Checking access...
    </div>
  );
}

if (!accessAllowed) {
  return null;
}
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
{crmClientId ? (
  <div className="mt-4 mb-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-800">
    {linkedClientLoading ? (
      "Loading linked CRM client..."
    ) : linkedClient ? (
      <>
        Working on client:{" "}
        <span className="font-semibold">{linkedClient.name}</span>

        {linkedClientCharts.length ? (
          <span> • {linkedClientCharts.length} saved chart(s)</span>
        ) : (
          <span> • No saved charts yet</span>
        )}
        {linkedClientCharts.length ? (
  <div className="mt-3">
    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-violet-700">
      Load saved chart
    </label>

    <select
      value={selectedLinkedChartId}
      onChange={(e) => loadLinkedChartIntoForm(e.target.value)}
      className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-400 md:w-96"
    >
      {linkedClientCharts.map((chart) => (
        <option key={chart.id} value={chart.id}>
          {chart.chart_name || "Birth Chart"} — {chart.birth_date_iso}{" "}
          {chart.birth_time} — {chart.place_name || "Place"}
        </option>
      ))}
    </select>
  </div>
) : null}
      </>
    ) : (
      "CRM client linked."
    )}
  </div>
) : null}
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
                  City of Birth
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

           <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/50 p-4">
  <label
    htmlFor="data-engine-node-mode"
    className="text-xs font-semibold uppercase tracking-wide text-violet-800"
  >
    Lunar Node Convention (Rahu &amp; Ketu)
  </label>

  <select
    id="data-engine-node-mode"
    value={selectedNodeMode ?? ""}
    disabled={linkedClientLoading || saveLoading || saveToClientLoading || nodePreferenceSaving}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedNodeMode(
        value === "" ? null : requireNodeMode(value)
      );
    }}
    className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-slate-800"
  >
    <option value="">
      {savedNodeMode
        ? `Saved chart convention (${getNodeModeLabel(savedNodeMode)})`
        : preferredNodeMode
          ? `Account preference (${getNodeModeLabel(preferredNodeMode)})`
          : "Account preference unavailable"}
    </option>

    {NODE_MODE_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>

  <p className="mt-2 text-xs text-slate-600">
    {nodeModeReady
      ? `Active convention: ${getNodeModeLabel(activeNodeMode)}`
      : nodeModeUnavailableMessage}
  </p>

  {nodeModeReady && (
    <p className="mt-1 text-xs text-slate-600">
      {NODE_MODE_OPTIONS.find(
        (option) => option.value === activeNodeMode
      )?.description}
    </p>
  )}

  <p className="mt-2 text-xs text-slate-500">
    This selection applies to the current calculation.
    Changing the convention requires regenerating the chart.
    Existing saved charts retain their stored convention.
    Your account default changes only when explicitly saved below.
  </p>

  <div className="mt-3 border-t border-violet-200 pt-3">
    <p className="text-xs text-slate-600">
      Account default: {preferredNodeMode
        ? getNodeModeLabel(preferredNodeMode)
        : "Unavailable"}
    </p>

    <button
      type="button"
      onClick={handleSaveNodePreference}
      disabled={
        !nodeModeReady ||
        nodePreferenceLoading ||
        nodePreferenceSaving ||
        linkedClientLoading ||
        activeNodeMode === preferredNodeMode
      }
      className="mt-2 rounded-lg border border-violet-300 bg-white px-4 py-2 text-xs font-semibold text-violet-800 disabled:opacity-50"
    >
      {nodePreferenceSaving ? "Saving..." : "Save as Account Default"}
    </button>

    {nodePreferenceSaveMessage && (
      <p role="status" className="mt-2 text-xs text-slate-600">
        {nodePreferenceSaveMessage}
      </p>
    )}
  </div>
</div>

<div className="mt-4 flex flex-col gap-3 md:flex-row md:justify-end">
  {crmClientId && data ? (
    <button
      type="button"
      onClick={handleSaveGeneratedChartToClient}
      disabled={saveToClientLoading}
      className="rounded-xl border border-[color:var(--border)] bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
    >
      {saveToClientLoading ? "Saving..." : "Save Chart to Client"}
    </button>
  ) : null}

  <button
  type="button"
  onClick={handleGenerate}
  disabled={loading || !nodeModeReady || linkedClientLoading}
  className={primaryButtonClass}
>
  {loading ? "Generating..." : "Generate Data Engine"}
</button>

<Link
  href="/sarathi/data-engine/clients"
  className="inline-flex items-center justify-center rounded-xl border border-violet-300 bg-violet-50 px-7 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100"
>
  Client Management (CRM)
</Link>
</div>
{data && (
  <div className="mt-6 flex gap-3">
    {isPremierUser ? (
      <button
        onClick={handleSaveToCRM}
        className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium"
      >
        Save to Premier CRM
      </button>
    ) : (
      <button
        onClick={() => alert("Redirect to subscription page")}
        className="px-5 py-2.5 rounded-xl border text-gray-700"
      >
        Upgrade to Premier
      </button>
    )}
  </div>
)}

{showSavePanel && (
  <div className="mt-6 space-y-4 rounded-2xl border border-[color:var(--border)] bg-white/80 p-5">
    <h3 className="text-lg font-semibold text-slate-900">
      Save Client Details
    </h3>

    <input
      value={crmName}
      onChange={(e) => setCrmName(e.target.value)}
      placeholder="Client Name"
      className="w-full rounded-xl border p-3"
    />

    <input
      value={crmPhone}
      onChange={(e) => setCrmPhone(e.target.value)}
      placeholder="Phone"
      className="w-full rounded-xl border p-3"
    />

    <input
      value={crmEmail}
      onChange={(e) => setCrmEmail(e.target.value)}
      placeholder="Email"
      className="w-full rounded-xl border p-3"
    />
 <select
  value={crmConsultationType}
  onChange={(e) => {
    const nextType = e.target.value;
    setCrmConsultationType(nextType);
  }}
  className="w-full rounded-xl border p-3"
>
  <option value="">Consultation Type</option>
  <option value="Marriage">Marriage</option>
  <option value="Career">Career</option>
  <option value="Finance">Finance</option>
  <option value="Health">Health</option>
  <option value="Property">Property</option>
  <option value="Education">Education</option>
  <option value="General">General</option>
</select>
    <textarea
      value={crmPrimaryIssue}
      onChange={(e) => setCrmPrimaryIssue(e.target.value)}
      placeholder="Primary Issue"
      className="w-full rounded-xl border p-3"
    />

    <textarea
      value={crmRemediesSuggested}
      onChange={(e) => setCrmRemediesSuggested(e.target.value)}
      placeholder="Remedies Suggested"
      className="w-full rounded-xl border p-3"
    />

    <textarea
      value={crmNotes}
      onChange={(e) => setCrmNotes(e.target.value)}
      placeholder="General Notes"
      className="w-full rounded-xl border p-3"
    />
    <label className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
  <input
    type="checkbox"
    checked={crmIsVip}
    onChange={(e) => setCrmIsVip(e.target.checked)}
    className="mt-1"
  />
  <span>
    <span className="block text-sm font-semibold text-amber-800">
      Mark as VIP Client
    </span>
    <span className="mt-1 block text-xs leading-relaxed text-amber-700">
      Prioritize this client for deeper review, remedy tracking, important-date reminders, and faster follow-ups.
    </span>
  </span>
</label>
 

   <input
  type="date"
  value={crmFollowUpDate}
  onChange={(e) => setCrmFollowUpDate(e.target.value)}
  className="w-full rounded-xl border p-3"
/>

    <button
      type="button"
      onClick={handleSaveGeneratedChartAsClient}
      disabled={saveLoading}
      className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white disabled:opacity-60"
    >
      {saveLoading ? "Saving..." : "Save Client + Chart"}
    </button>
  </div>
)}
{saveToClientMessage ? (
  <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
    <span>{saveToClientMessage}</span>

    {savedCrmClientId ? (
      <Link
        href={`/sarathi/data-engine/clients/${savedCrmClientId}`}
        className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Go to Client Dashboard
      </Link>
    ) : null}
  </div>
) : null}
          </div>

          <div className="rounded-3xl astro-card p-6 shadow-sm ring-1 ring-black/5">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <DataEngineTabs activeTab={activeTab} onChange={setActiveTab} />

    {data ? (
      <div className="relative z-[80] shrink-0">
        <AskSarathiFloatingBox
          nodeMode={data?.nodeMode}
          nodeCalculationVersion={data?.nodeCalculationVersion}
          natalPlanets={planets}
          natalAscSign={natal?.ascendant?.sign ?? null}
          vargaMap={vargaMap}
          chartGalleryKeys={chartGalleryKeys}
          currentDasha={currentDasha}
          dashaTimelines={dashaTimelines}
          vedicAspects={vedicAspects}
          houseData={houses}
          triggerEngine={triggerEngine}
          functionalRoles={roles}
          natalStrengths={natalStrengths}
          transitNow={transitNow}
          birthPanchang={birthPanchang}
          utilityPanchang={utilityPanchang}
          utilityHora={utilityHora}
          selectedDateISO={selectedDateISO}
          birthMeta={birthMeta}
          timezone={timezone}
          selectedPlace={selectedPlace}
        />
      </div>
    ) : null}
  </div>

  {!data ? (
              <div className="py-12 text-center text-sm text-slate-900">
                Generate to see chart data here.
              </div>
            ) : null}
           {data && activeTab === "analysis" ? (
  <div className="mt-6">
    <AnalysisFrameworkCard
      natal={natal}
      planets={planets}
      houses={houses}
      roles={roles}
      currentDasha={currentDasha}
      transitNow={transitNow}
      triggerEngine={triggerEngine}
      vargas={data?.vargas ?? {}}
      houseJudgement={houseJudgement}
      natalStrengths={natalStrengths}
      classicYogas={data?.foundations?.classicYogas ?? data?.classicYogas}
nabhasaYogas={data?.foundations?.nabhasaYogas ?? data?.nabhasaYogas}
    />
  </div>
) : null}
            {data && activeTab === "foundations" ? (
              <div className="mt-6 space-y-8">
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Chart Identity
                    </h2>
                    <p className="text-sm text-slate-900">
                      Core birth details and natal chart identity.
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
                    </div>
                  </div>

                  <BirthSummaryCard birthMeta={birthMeta} natal={natal} />

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
                </section>

                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Natal Framework
                    </h2>
                    <p className="text-sm text-slate-900">
                      Planetary placements, house ownership and functional planetary roles.
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
                      House Judgement
                    </h2>
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

            {data && activeTab === "forecast" ? (
  <div className="mt-6 space-y-6">
    <section className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Astrologer Forecast Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Prediction-focused dashboard showing active houses, dasha triggers, transit pressure, and timing windows.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(FORECAST_LENS_META).map(([key, value]) => {
            const active = forecastLens === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setForecastLens(key as any)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {value.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-slate-50/70 p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-800">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showForecastNatalPlanets}
              onChange={(e) => setShowForecastNatalPlanets(e.target.checked)}
              className="h-4 w-4 rounded border-[color:var(--border)]"
            />
            Natal planets
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showForecastTransits}
              onChange={(e) => setShowForecastTransits(e.target.checked)}
              className="h-4 w-4 rounded border-[color:var(--border)]"
            />
            Transit planets
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showForecastDashaHighlight}
              onChange={(e) => setShowForecastDashaHighlight(e.target.checked)}
              className="h-4 w-4 rounded border-[color:var(--border)]"
            />
            Highlight dasha lords
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showForecastActivatedHouses}
              onChange={(e) => setShowForecastActivatedHouses(e.target.checked)}
              className="h-4 w-4 rounded border-[color:var(--border)]"
            />
            Activated houses
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showForecastDegreeHits}
              onChange={(e) => setShowForecastDegreeHits(e.target.checked)}
              className="h-4 w-4 rounded border-[color:var(--border)]"
            />
            Degree hits
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showForecastMoonTriggers}
              onChange={(e) => setShowForecastMoonTriggers(e.target.checked)}
              className="h-4 w-4 rounded border-[color:var(--border)]"
            />
            Moon triggers
          </label>
        </div>

        <MediumNorthIndianChart
          title="Activation Transit Chart"
          ascSign={natal?.ascendant?.sign ?? null}
          planets={showForecastNatalPlanets ? natal?.planets ?? [] : []}
          transitPlanets={
            showForecastTransits
              ? (transitNow?.planets ?? []).map((p: any) => ({
                  ...p,
                  house: p.houseFromLagna ?? p.house,
                  rashiHouse: p.houseFromLagna ?? p.house,
                  isTransit: true,
                }))
              : []
          }
          layoutVariant="secondary"
          showPlanetDetails={false}
          showAbbreviations={false}
          compactPlanetLabels={true}
          highlightPlanets={
            showForecastDashaHighlight
              ? [
                  ...activeDashaPlanetNames,
                  ...FORECAST_LENS_META[forecastLens].planets,
                ]
              : []
          }
        />

        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Current Prediction Lens
          </div>

          <div className="mt-2 text-lg font-semibold text-slate-900">
            {FORECAST_LENS_META[forecastLens].label}
          </div>

          <div className="mt-2 text-sm text-slate-600">
            Focus Houses:{" "}
            {FORECAST_LENS_META[forecastLens].houses.map((h) => `H${h}`).join(" • ")}
          </div>

          <div className="mt-1 text-sm text-slate-600">
            Key Planets:{" "}
            {FORECAST_LENS_META[forecastLens].planets.join(" • ")}
          </div>
        </div>

        {showForecastActivatedHouses && activeHouseRows.length ? (
          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Activated Houses
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {forecastHouseRows
                .filter((row: any) => focusedHouses.includes((row.house as any)))
                .slice(0, 6)
                .map((row: any, index: number) => (
                  <span
                    key={`${row.house}-${index}`}
                    className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    H{row.house} · {row.facts?.length ?? 0} triggers
                  </span>
                ))}
            </div>
          </div>
        ) : null}

        {showForecastDegreeHits && triggerEngine?.degreeHits?.length ? (
          <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/70 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Close Degree Hits
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {triggerEngine.degreeHits.slice(0, 5).map((hit: any, index: number) => (
                <span
                  key={index}
                  className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-medium text-amber-700"
                >
                  {hit.transitPlanet} → {hit.natalPlanet} · {Number(hit.distance ?? 0).toFixed(2)}°
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {showForecastMoonTriggers && triggerEngine?.microTriggerDays?.length ? (
          <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/70 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              Moon Trigger Days
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {triggerEngine.microTriggerDays.slice(0, 5).map((day: any) => (
                <span
                  key={day.dateISO}
                  className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-700"
                >
                  {day.dateISO} · H{day.house ?? "—"}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Top Activated Houses
          </div>

          <div className="mt-3 space-y-3">
            {forecastHouseRows.filter((row: any) => focusedHouses.includes((row.house as any))).length ? (
              forecastHouseRows
                .filter((row: any) => focusedHouses.includes((row.house as any)))
                .map((row: any, index: number) => (
                  <div key={`${row.house}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">
                          House {row.house}
                        </div>

                        <div className="mt-0.5 text-xs text-slate-500">
                          {row.house === 1
                            ? "Self / Body"
                            : row.house === 2
                            ? "Wealth / Family"
                            : row.house === 3
                            ? "Effort / Communication"
                            : row.house === 4
                            ? "Home / Property"
                            : row.house === 5
                            ? "Education / Children"
                            : row.house === 6
                            ? "Work / Health"
                            : row.house === 7
                            ? "Relationship / Public"
                            : row.house === 8
                            ? "Change / Vulnerability"
                            : row.house === 9
                            ? "Dharma / Fortune"
                            : row.house === 10
                            ? "Career / Status"
                            : row.house === 11
                            ? "Gains / Network"
                            : row.house === 12
                            ? "Loss / Spiritual"
                            : ""}
                        </div>
                      </div>

                      <div className="text-xs font-medium text-slate-500">
                        {row.facts?.length ?? 0} triggers
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {(row.facts ?? []).map((fact: any, index: number) => (
                        <span
                          key={fact.id ?? `${row.house}-${index}`}
                          className={`rounded-full border px-3 py-1 text-xs ${
                            fact.priority === "primary"
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                              : "bg-slate-50 border-slate-200 text-slate-500"
                          }`}
                        >
                          {fact.planet} • {fact.kind === "transit_house" ? "Transit" : "Aspect"}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-sm text-slate-500">
                No active house data detected for this prediction lens.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Major Transit Activity
          </div>

          <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-2">Planet</th>
                  <th className="px-3 py-2">Transit</th>
                  <th className="px-3 py-2">House</th>
                  <th className="px-3 py-2">Degree</th>
                  <th className="px-3 py-2">Nakshatra</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {activePlanetRows.map((p: any) => (
                  <tr key={p.planet} className={p.score ? "bg-indigo-50/40" : "bg-white"}>
                    <td className="px-3 py-2 font-medium text-slate-900">
                      {p.planet}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{p.sign}</td>
                    <td className="px-3 py-2 text-slate-600">{p.house}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {p.degree == null ? "—" : `${Number(p.degree).toFixed(2)}°`}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {p.nakshatra}
                      {p.pada ? ` ${p.pada}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Active Dasha Lords
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2">Planet</th>
                <th className="px-3 py-2">Natal Placement</th>
                <th className="px-3 py-2">Natal Nakshatra</th>
                <th className="px-3 py-2">Transit Placement</th>
                <th className="px-3 py-2">Transit Nakshatra</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {activeDashaPlanetRows.length ? (
                activeDashaPlanetRows.map((row: any) => (
                  <tr key={row.planet} className="bg-white">
                    <td className="px-3 py-2 font-medium text-slate-900">
                      {row.planet}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      House {row.natalHouse} · {row.natalSign}
                      {row.natalDegree == null
                        ? ""
                        : ` · ${Number(row.natalDegree).toFixed(2)}°`}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {row.natalNakshatra}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      House {row.transitHouse} · {row.transitSign}
                      {row.transitDegree == null
                        ? ""
                        : ` · ${Number(row.transitDegree).toFixed(2)}°`}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {row.transitNakshatra}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-slate-500">
                    No active dasha planet placement data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Close Degree Contacts
          </div>

          <div className="mt-3 space-y-2">
            {triggerEngine?.degreeHits?.length ? (
              triggerEngine.degreeHits.slice(0, 6).map((hit: any, index: number) => (
                <div key={index} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <div className="font-medium text-slate-800">
                    Transit {hit.transitPlanet} → Natal {hit.natalPlanet}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Orb {Number(hit.distance ?? 0).toFixed(2)}° · {hit.strength ?? "—"} activation
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">
                No close degree proximity detected.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Moon Activation Windows
          </div>

          <div className="mt-3 space-y-2">
            {triggerEngine?.microTriggerDays?.length ? (
              triggerEngine.microTriggerDays.map((day: any) => (
                <div key={day.dateISO} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <div className="font-medium text-slate-800">{day.dateISO}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Moon trigger through House {day.house ?? "—"}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {day.sign ?? "—"} · Strength {day.strength ?? "—"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">
                No Moon timing data detected.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    <MajorTransitTimelineCard
      transitWindows={transitWindows}
      transitNow={Array.isArray(transitNow) ? transitNow : []}
      upcomingTransits={upcomingTransitItems}
      ascSign={natal?.ascendant?.sign ?? null}
      currentDasha={currentDasha}
      currentDashaLabel={currentDashaLabel}
    />
  </div>
) : null}

            {data && activeTab === "vargas" ? (
  <div className="mt-6 space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">
        Divisional Charts
      </h2>
      <p className="text-sm text-slate-600">
        Medium chart view for all available Vargas.
      </p>
    </div>

    {!vargaEntries.length ? (
      <div className="rounded-xl astro-card px-4 py-3 text-sm text-slate-800">
        No varga data available.
      </div>
    ) : (
      <div className="space-y-5">
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
        <option key={key} value={key}>
          {VARGA_LABELS[key] ?? key.toUpperCase()}
        </option>
      ))}
    </select>
  </div>

  {selectedVargaValue ? (() => {
    const ascSign = selectedVargaValue?.ascSign ?? null;

    const planets = Array.isArray(selectedVargaValue?.planets)
      ? selectedVargaValue.planets.map((p: any) => ({
          ...p,
          planet: p?.planet ?? p?.name ?? null,
          sign: p?.sign ?? p?.rashi ?? null,
          house: typeof p?.house === "number" ? p.house : null,
          degree:
            typeof p?.degree === "number"
              ? p.degree
              : typeof p?.deg === "number"
              ? p.deg
              : null,
          nakshatra: p?.nakshatra ?? p?.nakName ?? null,
          pada: p?.pada ?? null,
          retrograde:
            typeof p?.retrograde === "boolean" ? p.retrograde : false,
        }))
      : [];

    return (
      <MediumNorthIndianChart
        title={VARGA_LABELS[selectedVarga] ?? selectedVarga.toUpperCase()}
        ascSign={ascSign}
        planets={planets}
        layoutVariant="primary"
        showPlanetDetails={false}
      />
    );
  })() : null}
</div>
    )}
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

                  <ShadbalaCard
  data={data?.strength?.shadbala}
  insights={data?.strength?.shadbalaInsights}
/>

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
  nodeMode={data?.nodeMode}
  nodeCalculationVersion={data?.nodeCalculationVersion}
  selectedDateISO={selectedDateISO}
  setSelectedDateISO={setSelectedDateISO}
  selectedDateChartLabel={`Showing chart date: ${selectedDateISO}`}
  natalAscSign={natal?.ascendant?.sign ?? null}
  natalAscDegree={natal?.ascendant?.degree ?? null}
  natalAscendant={natal?.ascendant ?? null}
  natalPlanets={planets}
  natalStrengths={natalStrengths}
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
  currentDasha={currentDasha}
dashaTimelines={data?.timing?.dasha?.timelines ?? data?.dasha?.timelines ?? null}
  sarvaAshtakvarga={data?.strength?.ashtakvarga?.sarva ?? []}
  arudhas={data?.arudhas ?? {}}
  upagrahas={upagrahas}
  solarShadowPoints={solarShadowPoints}
  vedicAspects={vedicAspects}
  nabhasaYogas={data?.foundations?.nabhasaYogas ?? data?.nabhasaYogas ?? null}
  classicYogas={data?.foundations?.classicYogas ?? data?.classicYogas ?? null}
  roles={data?.foundations?.roles ?? data?.roles}
  kpData={(data as any)?.kpData}
  kpPlanetOnCusp={data?.strength?.kpPlanetOnCusp}
/>
            ) : null}
            {data && activeTab === "compare" ? (
  <ChartCompareTabView
    personAData={data}
    personAAscSign={natal?.ascendant?.sign ?? null}
    personAPlanets={planets}
    personAVargaMap={vargaMap}
    personAArudhas={data?.arudhas ?? {}}
    personAUpagrahas={upagrahas}
    personASolarShadowPoints={solarShadowPoints}
    personAVedicAspects={vedicAspects}
    selectedDateISO={selectedDateISO}
    timezone={timezone}
    plan={plan}
  />
) : null}
         {data && activeTab === "utilities" ? (
  <div className="mt-6 space-y-8">
    <PlanetTransitTimelineCard nodeMode={data?.nodeMode} nodeCalculationVersion={data?.nodeCalculationVersion} defaultTimezone={String(birthMeta?.timezone ?? timezone ?? "Asia/Kolkata")} />
    <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-slate-900">
        Transit Query Engine
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Find dates when multiple planets match selected sign and degree conditions.
      </p>
    </div>

    <button
      type="button"
      onClick={addTransitQueryCondition}
      className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
    >
      + Add Condition
    </button>
  </div>

  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        From Date
      </label>
      <input
        type="date"
        value={transitQueryFromISO}
        onChange={(e) => setTransitQueryFromISO(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
      />
    </div>

    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        To Date
      </label>
      <input
        type="date"
        value={transitQueryToISO}
        onChange={(e) => setTransitQueryToISO(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
      />
    </div>
  </div>
<div className="mt-3 flex flex-wrap gap-2">
  {[
    { label: "Next 30 days", days: 30 },
    { label: "3 months", days: 90 },
    { label: "6 months", days: 180 },
  ].map((item) => (
    <button
      key={item.label}
      type="button"
      onClick={() => {
        const today = new Date().toISOString().slice(0, 10);
        setTransitQueryFromISO(today);
        setTransitQueryToISO(addDaysISO(today, item.days));
      }}
      className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
    >
      {item.label}
    </button>
  ))}
</div>
  <div className="mt-5 space-y-3">
    {transitQueryConditions.map((condition, index) => (
      <div
        key={condition.id}
        className="rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-900">
            Condition {index + 1}
          </div>
<div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
  {buildTransitConditionSummary(condition)}
</div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={condition.enabled}
                onChange={(e) =>
                  updateTransitQueryCondition(condition.id, {
                    enabled: e.target.checked,
                  })
                }
              />
              Enabled
            </label>

            <button
              type="button"
              onClick={() => removeTransitQueryCondition(condition.id)}
              className="text-xs font-semibold text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        </div>
<div>
  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
    Type
  </label>
  <select
    value={condition.conditionType}
    onChange={(e) =>
      updateTransitQueryCondition(condition.id, {
        conditionType: e.target.value as TransitQueryCondition["conditionType"],
      })
    }
    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
  >
    <option value="sign_degree">Sign + Degree</option>
    <option value="nakshatra">Nakshatra</option>
    <option value="retrograde">Retrograde</option>
    <option value="same_sign_as">Same Sign As</option>
    <option value="conjunct_natal">Transit hits Natal Planet</option>
  </select>
</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
          <div>
            
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Planet
            </label>
            <select
              value={condition.planet}
              onChange={(e) =>
                updateTransitQueryCondition(condition.id, {
                  planet: e.target.value,
                })
              }
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
            >
              {TRANSIT_QUERY_PLANETS.map((planet) => (
                <option key={planet} value={planet}>
                  {planet}
                </option>
              ))}
            </select>
          </div>

         {condition.conditionType === "sign_degree" ? (
  <>
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Rashi
      </label>
      <select
        value={condition.sign}
        onChange={(e) =>
          updateTransitQueryCondition(condition.id, { sign: e.target.value })
        }
        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
      >
        {TRANSIT_QUERY_SIGNS.map((sign) => (
          <option key={sign} value={sign}>
            {sign}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Degree
      </label>
      <input
        type="number"
        min="0"
        max="29"
        value={condition.degree}
        onChange={(e) =>
          updateTransitQueryCondition(condition.id, { degree: e.target.value })
        }
        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
      />
    </div>

    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Minute
      </label>
      <input
        type="number"
        min="0"
        max="59"
        value={condition.minute}
        onChange={(e) =>
          updateTransitQueryCondition(condition.id, { minute: e.target.value })
        }
        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
      />
    </div>

    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Orb ±
      </label>
      <input
        type="number"
        min="0"
        step="0.1"
        value={condition.orb}
        onChange={(e) =>
          updateTransitQueryCondition(condition.id, { orb: e.target.value })
        }
        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
      />
    </div>
  </>
) : null}

{condition.conditionType === "nakshatra" ? (
  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
      Nakshatra
    </label>
    <select
      value={condition.nakshatra}
      onChange={(e) =>
        updateTransitQueryCondition(condition.id, { nakshatra: e.target.value })
      }
      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
    >
      {TRANSIT_QUERY_NAKSHATRAS.map((nakshatra) => (
        <option key={nakshatra} value={nakshatra}>
          {nakshatra}
        </option>
      ))}
    </select>
  </div>
) : null}

{condition.conditionType === "same_sign_as" ? (
  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
      Same Sign As
    </label>
    <select
      value={condition.comparePlanet}
      onChange={(e) =>
        updateTransitQueryCondition(condition.id, { comparePlanet: e.target.value })
      }
      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
    >
      {TRANSIT_QUERY_PLANETS.map((planet) => (
        <option key={planet} value={planet}>
          {planet}
        </option>
      ))}
    </select>
  </div>
) : null}

{condition.conditionType === "conjunct_natal" ? (
  <>
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Natal Planet
      </label>
      <select
        value={condition.natalPlanet}
        onChange={(e) =>
          updateTransitQueryCondition(condition.id, { natalPlanet: e.target.value })
        }
        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
      >
        {TRANSIT_QUERY_PLANETS.map((planet) => (
          <option key={planet} value={planet}>
            {planet}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Orb ±
      </label>
      <input
        type="number"
        min="0"
        step="0.1"
        value={condition.orb}
        onChange={(e) =>
          updateTransitQueryCondition(condition.id, { orb: e.target.value })
        }
        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
      />
    </div>
  </>
) : null}
        </div>
      </div>
    ))}
  </div>

  <div className="mt-5 flex justify-end">
    <button
      type="button"
      onClick={handleRunTransitQuery}
      disabled={transitQueryLoading}
      className={primaryButtonClass}
    >
      {transitQueryLoading ? "Searching..." : "Find Matching Dates"}
    </button>
  </div>

  {transitQueryError ? (
    <div className={errorBoxClass}>{transitQueryError}</div>
  ) : null}

  {transitQueryHasSearched ? (
  <div className="mt-6 space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <h3 className="text-base font-semibold text-slate-900">
    Matching Dates
  </h3>

  <div className="flex items-center gap-2">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      Sort by
    </label>
    <select
      value={transitQuerySortBy}
      onChange={(e) =>
        setTransitQuerySortBy(
          e.target.value as "strongest" | "longest" | "earliest" | "exact"
        )
      }
      className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--primary)]"
    >
      <option value="strongest">Strongest</option>
      <option value="longest">Longest window</option>
      <option value="earliest">Earliest date</option>
      <option value="exact">Exact matches only</option>
    </select>
  </div>
</div>

      {visibleTransitQueryMatches.length ? (
  visibleTransitQueryMatches.map((match, matchIndex) => {
  const strengthClasses = getTransitStrengthClasses(
    match.strengthLabel
  );

  return (
  <div
    key={`${match.dateISO}-${match.time ?? "no-time"}-${matchIndex}`}
          className={`rounded-2xl border p-3 ${strengthClasses.outer}`}
        >
        <div className={`flex flex-wrap items-center gap-2 text-sm font-semibold ${strengthClasses.heading}`}>
  {match.dateISO}
  {match.time ? ` • ${match.time}` : ""}
  {` (${formatTransitUtcOffset(match.utcOffsetMinutes)})`}

  {match.endTimestampUTC !== match.timestampUTC
    ? ` – ${match.endDateISO !== match.dateISO
        ? `${match.endDateISO} `
        : ""}${match.endTime ?? ""} (${formatTransitUtcOffset(match.endUtcOffsetMinutes)})`
    : ""}

  {match.timezone ? ` • ${match.timezone}` : ""}

  {typeof match.durationHours === "number"
    ? ` • ~${Number(match.durationHours.toFixed(2))}h estimated sampled coverage`
    : ""}

  {match.sampleCount
    ? ` • ${match.sampleCount} sample(s)`
    : ""}

  {match.strengthLabel ? (
  <span
    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${strengthClasses.badge}`}
  >
    Last sample: {match.strengthLabel}
    {typeof match.strengthScore === "number"
      ? ` ${match.strengthScore}%`
      : ""}
  </span>
) : null}
</div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {match.matchedPlanets.map((row) => (
              <div
                key={`${match.dateISO}-${match.time ?? "no-time"}-${row.planet}`}
                className={`rounded-xl border p-2.5 text-sm ${strengthClasses.inner}`}
              >
                <div className="font-semibold text-slate-900">
                  {row.planet} → {row.sign}{" "}
                  {row.degree !== null ? row.degree.toFixed(2) : "—"}°
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Target {row.targetDegree.toFixed(2)}° ± {row.orb}°
                  {row.nakshatra ? ` • ${row.nakshatra}` : ""}
                  {row.pada ? ` Pada ${row.pada}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
        );
})
) : (
  <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
    No matching windows found. Try widening the orb, increasing the date range, or removing one condition.
  </p>
)}
    </div>
  ) : !transitQueryLoading && !transitQueryError && transitQueryHasSearched ? (
  <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
    No matching dates found for the selected conditions. Try increasing the date range
    or widening the match tolerance.
  </p>
) : !transitQueryLoading && !transitQueryError ? (
  <p className="mt-5 text-sm text-slate-500">
    No matching dates searched yet.
  </p>
) : null}

  <p className="mt-4 text-xs leading-relaxed text-slate-400">
    Searches use hourly samples for Moon-related conditions and six-hour samples for other conditions.
    Matching windows and sampled coverage are approximate, not exact entry or exit times.
    Planetary positions and match strength reflect the last matching sample in each window.
    Strongest and Exact use this last-sample strength.
  </p>
</div>
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
          {utilityHora?.table ? (
  <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
    {[
      ["Day Hora Muhurta", utilityHora.table.day],
      ["Night Hora Muhurta", utilityHora.table.night],
    ].map(([title, rows]: any) => (
      <div
        key={title}
        className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white"
      >
        <div className="grid grid-cols-[1fr_1.2fr] bg-amber-100 px-4 py-3 text-sm font-bold text-slate-900">
          <div>{title}</div>
          <div>Time</div>
        </div>

        <div className="divide-y divide-slate-100">
          {(rows ?? []).map((row: any) => {
            const isActive =
              utilityHora?.phase === (title.startsWith("Day") ? "day" : "night") &&
              Number(utilityHora?.horaNumber) === Number(row.number);

            return (
              <div
                key={`${title}-${row.number}`}
                className={`grid grid-cols-[1fr_1.2fr] px-4 py-3 text-sm ${
                  isActive ? "bg-emerald-50 font-semibold text-emerald-800" : "text-slate-700"
                }`}
              >
                <div>{row.planet}</div>
                <div>
                  {row.start} - {row.end}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
) : null}
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
                <div className="text-xs uppercase tracking-wide font-semibold text-white-200/70">
                  Rahu Kaal
                </div>
                <div className="mt-2 text-lg font-semibold text-white-100">
                  {utilityPanchang?.rahuKaal
                    ? `${utilityPanchang.rahuKaal.start} to ${utilityPanchang.rahuKaal.end}`
                    : "—"}
                </div>
                <p className="mt-2 text-sm text-white-100/70">
                  Traditionally avoided for major beginnings.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">
                <div className="text-xs uppercase tracking-wide font-semibold text-white-200/70">
                  Yamaganda
                </div>
                <div className="mt-2 text-lg font-semibold text-white-100">
                  {utilityPanchang?.yamaganda
                    ? `${utilityPanchang.yamaganda.start} to ${utilityPanchang.yamaganda.end}`
                    : "—"}
                </div>
                <p className="mt-2 text-sm text-white-100/70">
                  Usually avoided for travel and new activity.
                </p>
              </div>

              <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
                <div className="text-xs uppercase tracking-wide font-semibold text-white-200/70">
                  Gulika
                </div>
                <div className="mt-2 text-lg font-semibold text-white-100">
                  {utilityPanchang?.gulika
                    ? `${utilityPanchang.gulika.start} to ${utilityPanchang.gulika.end}`
                    : "—"}
                </div>
                <p className="mt-2 text-sm text-white-100/70">
                  Important for certain electional considerations.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                <div className="text-xs uppercase tracking-wide font-semibold text-white-200/70">
                  Abhijit Muhurat
                </div>
                <div className="mt-2 text-lg font-semibold text-white-100">
                  {utilityPanchang?.abhijitMuhurat
                    ? `${utilityPanchang.abhijitMuhurat.start} to ${utilityPanchang.abhijitMuhurat.end}`
                    : "—"}
                </div>
                <p className="mt-2 text-sm text-white-100/70">
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
export default function DataEnginePage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading Data Engine...</div>}>
      <DataEnginePageContent />
    </Suspense>
  );
}
