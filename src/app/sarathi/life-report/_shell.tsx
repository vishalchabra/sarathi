"use client";

import React, {
  Suspense,
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
  useRef,
} from "react";

import { ensureNotificationTz } from "@/lib/notifications/timezone";

import { usePathname, useRouter } from "next/navigation";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareerWindowCard } from "@/components/sarathi/CareerWindowCard";
import DailyRhythmCard from "@/components/sarathi/DailyRhythmCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import type { TransitHit } from "@/app/api/transits/route";
import type {
  EmotionalWeather,
  FoodGuide,
  FastingGuide,
  MoneyWindow,
  CoreSignals,
} from "@/server/guides/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";
import { saveBirthProfile } from "@/lib/birth-profile";
import { getMoonNakshatra } from "@/lib/astro"; 
import { NAKSHATRA_INFO } from "@/lib/astrology/nakshatraMap";
const AYANAMSA_LAHIRI_APPROX = 23.85;


/* ---------------- Locking city autocomplete (simplified ï¿½ always typeable) ---------------- */


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
  
  // keep input in sync if parent changes value
React.useEffect(() => {
  if (value?.name && value.name !== q) {
    setQ(value.name);
    return;
  }
  if (!value && q !== "") {
    setQ("");
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [value]);

  // search as user types
  React.useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    const query = q.trim();
    if (query.length < 3) {
      setItems([]);
      setOpen(false);
      return;
    }

    // cache hit
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

    // guess timezone and broadcast
    try {
      const expTz = expectedTzForPlaceName(it.name);
      if (expTz) {
        window.dispatchEvent(new CustomEvent("sarathi:set-tz", { detail: expTz }));
      }
    } catch {}

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
          const caret = el.selectionStart ?? e.target.value.length;
          setQ(e.target.value);
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
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/70"
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
          className="absolute z-20 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow"
        >
          {loading && (
            <div className="px-3 py-2 text-sm text-white/70">Searching</div>
          )}
          {!loading && !items.length && (
            <div className="px-3 py-2 text-sm text-white/70">No results</div>
          )}
          {!loading &&
            items.map((it, i) => (
              <button
                key={`${it.name}-${i}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => commit(it)}
              >
                {it.name}
                <span className="ml-2 text-xs text-white/70">
                  {it.lat.toFixed(2)}, {it.lon.toFixed(2)}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}


/* ---------------- Types from API (defensive) ---------------- */

type PanchangInfo = {
  weekday?: string | null;
  tithiName?: string | null;
  yogaName?: string | null;
  karanaName?: string | null;
  moonNakshatraName?: string | null;
  moonNakshatraTheme?: string | null;

  meanings?: {
    tithi?: string | null;
    yoga?: string | null;
    karana?: string | null;
  };

  meta?: Record<string, any>;

  // ?? Timings
  sunrise?: string | null;
  sunriseISO?: string | null;
  sunset?: string | null;
  sunsetISO?: string | null;
  moonrise?: string | null;
  moonriseISO?: string | null;
  moonset?: string | null;
  moonsetISO?: string | null;

  //  Kaal windows (we?ll still show ?? ï¿½ ?? until backend sends structured ranges)
  rahuKaal?: any;
  gulikaKaal?: any;
  abhijit?: any;

  // Optional extra fields if you add later
  tip?: string | null;
  festivals?: string[];
};


type PlanetRow = {
  name: string;
  sign: string;
  house?: number;
  nakshatra?: string;
  note?: string;
} & Record<string, any>;

type AspectRow = {
  from: string;
  to: string;
  type?: string;
  strength?: number;
  nature?: "soft" | "hard" | "neutral";
};

type ActivePeriods = {
  mahadasha?: { lord: string; start: string; end: string; summary?: string };
  antardasha?: {
    mahaLord: string;
    subLord: string;
    start: string;
    end: string;
    summary?: string;
  };
  pratyantardasha?: {
    mahaLord: string;
    antarLord: string;
    lord: string;
    start: string;
    end: string;
    summary?: string;
  };
};

type LifeMilestone = {
  label: string;
  approxAgeRange: string;
  periodStart: string;
  periodEnd: string;
  drivers: string;
  themes: string[];
  risk?: "caution" | "opportunity" | "mixed";
};

type LifeReportAPI = {
  name?: string;
  birthDateISO?: string;
  birthTime?: string;
  birthTz?: string;
  birthLat?: number;
  birthLon?: number;

  ascSign?: string;
  sunSign?: string;
  moonSign?: string;

  panchang?: PanchangInfo;
  placements?: any[];
  planets?: any[];
  aspects?: AspectRow[];
  dashaTimeline?: any[];
  activePeriods?: ActivePeriods;
  lifeMilestones?: LifeMilestone[];
  
    foodToday?: {
    tone: "sattvic" | "rajasic" | "tamasic";
    headline: string;
    description: string;
    examplesToFavor: string[];
    examplesToReduce: string[];
    reason: string;
  } | null;

  ascendant?:
    | {
        ascSign?: string;
        moonSign?: string;
        ascNakshatraName?: string;
        moonNakshatraName?: string;
        moonNakshatraKeywords?: string;
        panchang?: PanchangInfo;
      }
    | null;
  nakshatraMap?: Record<string, string>;
  raw?: any;
};

type LifeReportView = {
  name: string;
  birthDateISO: string;
  birthTime: string;
  birthTz: string;
  birthLat?: number;
  birthLon?: number;

  ascSign?: string;
  moonSign?: string;
  sunSign?: string;
  ascNakshatraName?: string;
  moonNakshatraName?: string;
  moonNakshatraTheme?: string;

  panchang?: PanchangInfo;
  planets: PlanetRow[];
  aspects: AspectRow[];
  activePeriods?: ActivePeriods;
  lifeMilestones?: LifeMilestone[];
  dashaTimeline?: any[];
  nowPlan?: any;
  nowNearFuture?: any;
  advancedPro?: any;
  fullPlan?: any;
  plan?: any;
};

const PLANET_ORDER = [
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


function mod360(n: number) {
  return ((n % 360) + 360) % 360;
}
function wrap360(n: number) {
  return ((n % 360) + 360) % 360;
}

const SIGNS = [
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

function signIndexFromDeg(deg: number) {
  return Math.floor(wrap360(deg) / 30);
}
function signIndexFromName(s?: string | null) {
  if (!s) return -1;
  const i = SIGNS.findIndex((x) => x.toLowerCase() === s.toLowerCase());
  return i;
}

/** Light, date-aware Lahiri ayana?sa (deg). Base ~23.856? at 2000 CE, +50.29?/yr. */
function lahiriAyanamsaDegrees(date: Date) {
  const year = date.getUTCFullYear();
  const base = 23.856; // around J2000
  const perYear = 50.29 / 3600; // deg/yr
  return base + (year - 2000) * perYear;
}

/** Convert tropical ecliptic longitude ? sidereal (Lahiri). */
function toSidereal(tropicalDeg: number, at: Date) {
  const ay = lahiriAyanamsaDegrees(at);
  return mod360(tropicalDeg - ay);
}

/* === Nakshatras & Yoga === */

const NAKS_27 = [
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

const YOGAS_27 = [
  "Vishkambha",
  "Preeti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyan",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

function nakIndexFromDeg(deg: number): number {
  const span = 360 / 27;
  return Math.floor(mod360(deg) / span);
}
function nakFromDeg(deg: number): string {
  return NAKS_27[nakIndexFromDeg(deg)];
}

function toNum(x: any): number | undefined {
  const n = typeof x === "string" ? parseFloat(x) : x;
return Number.isFinite(n) ? (n as number) : undefined;
}

// --- Yoga / Karana from sidereal ï¿½ & ï¿½ ---

const KARANA_MOVABLE = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Gara",
  "Vanija",
  "Vishti",
] as const;
type MovableKarana = (typeof KARANA_MOVABLE)[number];

function norm360Local(n: number) {
  const x = n % 360;
  return x < 0 ? x + 360 : x;
}


/** Yoga = floor( (Sun + Moon) / 13?20' ) over 27 parts (sidereal) */
function computeYogaName(
  sunSidDeg?: number,
  moonSidDeg?: number
): string | undefined {
  if (sunSidDeg === undefined || moonSidDeg === undefined) return;
  const sum = norm360(sunSidDeg + moonSidDeg);
  const idx = Math.floor(sum / (360 / 27));
  return YOGAS_27[idx];
}

/** Karana: K = floor( (Moon - Sun) / 6? ) over 60 parts; mapping per canonical rules */
function computeKaranaName(
  sunSidDeg?: number,
  moonSidDeg?: number
): string | undefined {
  if (sunSidDeg === undefined || moonSidDeg === undefined) return;
  const D = norm360(moonSidDeg - sunSidDeg); // angular separation (sidereal)
  const K = Math.floor(D / 6); // 0..59

  // Fixed (sthira) karanas at specific K values:
  // 57 ï¿½ Shakuni, 58 ï¿½ Chatushpada, 59 ï¿½ Naga, 0 ï¿½ Kimstughna
  if (K === 57) return "Shakuni";
  if (K === 58) return "Chatushpada";
  if (K === 59) return "Naga";
  if (K === 0) return "Kimstughna";

  // Otherwise repeating set of 7 movable karanas
  return KARANA_MOVABLE[(K - 1 + 7) % 7];
}

/* ---------------- Helpers ---------------- */
function TabFromUrl({
  onTab,
}: {
  onTab: (t: "overview" | "phases" | "now" | "advanced") => void;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const sp = new URLSearchParams(window.location.search);
      const t = (sp.get("tab") || "").toLowerCase();

      if (t === "overview" || t === "phases" || t === "now" || t === "advanced") {
        onTab(t as any);
      }
    } catch {
      // ignore
    }
  }, [onTab]);

  return null;
}


function humanizeInsight(base: string): string {
  const openers = [
    "Today brings a subtle shift ",
    "You may notice that",
    "Theres a quiet invitation today to",
    "The day supports a gentler approach ",
    "Energy today encourages you to",
    "This is a good day to"
  ];

  const endings = [
    "Take it one step at a time.",
    "Small, steady choices will go a long way.",
    "No need to rushclarity builds naturally.",
    "Let simplicity guide your actions.",
    "A calm pace will work in your favor.",
  ];

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  let sentence = base.trim();

  // remove repetitive astrology phrasing
  sentence = sentence
    .replace(/this moon (position|phase|placement)/gi, "")
    .replace(/this transit|the transit/gi, "")
    .replace(/today you may|today you might/gi, "today you may")
    .replace(/\s+/g, " ")
    .trim();

  return `${pick(openers)} ${sentence} ${pick(endings)}`;
}
function transitRangeISO(t: any): { startISO: string | null; endISO: string | null } {
  const sRaw = t?.startISO ?? t?.fromISO ?? t?.from ?? t?.start ?? t?.startDate;
  const eRaw = t?.endISO ?? t?.toISO ?? t?.to ?? t?.end ?? t?.endDate;

  const startISO = toISODate(sRaw);
  const endISO = toISODate(eRaw);

  return { startISO, endISO };
}

function primaryCategoryForRange(
  transits: any[] | null | undefined,
  from: Date,
  to: Date
): string {
  if (!Array.isArray(transits) || !transits.length) return "general";

  // pick the strongest transit whose window overlaps the range
  const overlapping = transits.filter((t: any) => {
    const { startISO, endISO } = transitRangeISO(t);
    if (!startISO || !endISO) return false;

    // Use UTC day boundaries consistently
    const start = new Date(startISO + "T00:00:00.000Z");
    const end = new Date(endISO + "T23:59:59.999Z");

    return end >= from && start <= to;
  });

  const pool = overlapping.length ? overlapping : transits;

  const withStrength = pool.filter((t: any) => typeof t?.strength === "number");

  const primary =
    withStrength.length
      ? withStrength
          .slice()
          .sort((a: any, b: any) => (b?.strength ?? 0) - (a?.strength ?? 0))[0]
      : pool[0];

  const cat = String(primary?.category || "general").toLowerCase();
  if (cat === "career") return "career";
  if (cat === "relationships") return "relationships";
  if (cat === "health") return "health";
  if (cat === "inner") return "inner";
  return "general";
}


function strongestTransitForRange(
  transits: any[] | null | undefined,
  from: Date,
  to: Date
): any | null {
  if (!Array.isArray(transits) || !transits.length) return null;

  // Filter to only transits that overlap this range
  const overlapping = transits.filter((t: any) => {
    const { startISO, endISO } = transitRangeISO(t);
    if (!startISO || !endISO) return false;

    const start = new Date(startISO + "T00:00:00.000Z");
    const end = new Date(endISO + "T23:59:59.999Z");

    return end >= from && start <= to;
  });

  const pool = overlapping.length ? overlapping : transits;

  // Prefer the one with highest "strength" if available
  const withStrength = pool.filter((t: any) => typeof t?.strength === "number");

  const primary =
    withStrength.length
      ? withStrength
          .slice()
          .sort((a: any, b: any) => (b?.strength ?? 0) - (a?.strength ?? 0))[0]
      : pool[0];

  return primary ?? null;
}

function fmtRange(startISO?: string, endISO?: string) {
  const s = String(startISO || "").slice(5, 10);
  const e = String(endISO || "").slice(5, 10);
  if (!s || !e) return "";
  return s === e ? s : `${s}–${e}`;
}

function niceCat(cat: any) {
  const c = String(cat || "").toLowerCase();
  if (c === "career") return "Career";
  if (c === "relationships") return "Relationships";
  if (c === "health") return "Health";
  if (c === "inner") return "Inner";
  return "General";
}

function formatTransitChip(t: any): string {
  if (!t || typeof t !== "object") return "Transit";

  const planet = String(t?.planet || "").trim();
  const target = String(t?.target || "").trim();
  const title = String(t?.title || "").trim();
  const cat = niceCat(t?.category);

  const range = fmtRange(t?.startISO, t?.endISO);
  const label = title || [planet, target].filter(Boolean).join("  ") || cat;

  return range ? `${label}  ${cat}  ${range}` : `${label}  ${cat}`;
}


function normalizeDateForBackend(v: string): string | null {
  if (!v) return null;
  const s = v.trim().replace(/[./]/g, "-").replace(/\//g, "-");

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  return null;
}

function normalizeTimeForBackend(v: string): string | null {
  if (/^\d{2}:\d{2}$/.test(v)) return v;
  const m = /^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/.exec(v.trim());
  if (m) {
    let h = parseInt(m[1], 10);
    const min = m[2];
    const ampm = m[3].toLowerCase();
    if (ampm === "pm" && h !== 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${min}`;
  }
  return null;
}

function normalizePanchang(p: any): PanchangInfo | undefined {
  if (!p) return undefined;

  const weekday =
    p.weekday ?? p.weekDay ?? p.day ?? p?.dateInfo?.weekday ?? null;

  const tithiName =
    p.tithiName ??
    (typeof p.tithi === "string" ? p.tithi : p.tithi?.name) ??
    p?.lunarDay ??
    null;

  const yogaName = p.yogaName ?? p.yoga ?? null;
  const karanaName = p.karanaName ?? p.karana ?? null;
    const moonNakshatraName =
    p.moonNakshatraName ?? p.moonNakshatra ?? p.nakshatra ?? null;


  // ---- Times: read both flat and nested shapes ----
  const sunrise =
    p.sunriseISO ??
    p.sunrise ??
    p.sun?.sunriseISO ??
    p.sun?.riseISO ??
    p.sun?.sunrise ??
    p.sun?.rise ??
    null;

  const sunset =
    p.sunsetISO ??
    p.sunset ??
    p.sun?.sunsetISO ??
    p.sun?.setISO ??
    p.sun?.sunset ??
    p.sun?.set ??
    null;

  const moonrise =
    p.moonriseISO ??
    p.moonrise ??
    p.moon?.moonriseISO ??
    p.moon?.riseISO ??
    p.moon?.moonrise ??
    p.moon?.rise ??
    null;

  const moonset =
    p.moonsetISO ??
    p.moonset ??
    p.moon?.moonsetISO ??
    p.moon?.setISO ??
    p.moon?.moonset ??
    p.moon?.set ??
    null;

  // ---- Kaal windows: keep whatever is sent for now ----
  const rahuKaal = p.rahuKaal ?? p.rahu ?? null;
  const gulikaKaal = p.gulikaKaal ?? p.gulika ?? null;
  const abhijit = p.abhijit ?? p.abhijitMuhurat ?? p.abhijitMuhurt ?? null;

  return {
    weekday,
    tithiName,
    yogaName,
    karanaName,
    moonNakshatraName,
    moonNakshatraTheme:
      p.moonNakshatraTheme ??
      p.moonNakshatraKeywords ??
      p.nakshatraTheme ??
      p.nakshatraKeywords ??
      null,
    meanings: p.meanings,
    meta: p.meta,

    sunrise,
    sunriseISO: sunrise,
    sunset,
    sunsetISO: sunset,
    moonrise,
    moonriseISO: moonrise,
    moonset,
    moonsetISO: moonset,

    rahuKaal,
    gulikaKaal,
    abhijit,

    tip: p.tip ?? null,
    festivals: Array.isArray(p.festivals) ? p.festivals : undefined,  };
}


type DailyFact = {
  dateISO: string;
  moonNakshatra: string;
  relativeHouse?: number;
  strongestTransit?: {
    planet: string;
    target: string;
    category: "career" | "relationships" | "health" | "inner" | "general";
    strength: number;
    startISO: string;
    endISO: string;
  } | null;
};
type StrongTransitCategory = "career" | "relationships" | "health" | "inner" | "general";

type StrongTransitLite = {
  planet: string;
  target: string; // must be required (NOT optional) because UI/types expect string
  category: "career" | "relationships" | "health" | "inner" | "general";
  strength: number;
  startISO: string;
  endISO: string;
};

function toStrongTransitCategory(x: any): StrongTransitCategory {
  return x === "career" || x === "relationships" || x === "health" || x === "inner"
    ? x
    : "general";
}
function transitLineGold(
  strongest: StrongTransitLite | null,
  idx: number,
  prevKey?: string
): { key: string; line: string } {
  if (!strongest) return { key: "", line: "" };

  const planet = String(strongest.planet ?? "").trim() || "A transit";
  const target = String(strongest.target ?? "").trim() || "a key point";
  const cat =
    (strongest.category as any) === "career" ||
    (strongest.category as any) === "relationships" ||
    (strongest.category as any) === "health" ||
    (strongest.category as any) === "inner"
      ? (strongest.category as any)
      : "general";

  const key = `${planet}|${target}|${cat}`;

  // If same transit repeats day-to-day, don't repeat the same sentence.
  const sameAsYesterday = !!prevKey && prevKey === key;

  // Show full “planet+target” line on day 1 or when it changes
  if (!sameAsYesterday) {
    const full =
      cat === "career"
        ? `Career is louder — ${planet} touching ${target} can bring a message, decision, or visibility moment.`
        : cat === "relationships"
        ? `Relationships are sensitive — ${planet} touching ${target} can highlight a conversation or boundary.`
        : cat === "health"
        ? `Energy needs care — ${planet} touching ${target} rewards pacing, sleep, and clean routine.`
        : cat === "inner"
        ? `Inner noise rises — ${planet} touching ${target} is best used for reflection, not reaction.`
        : `Background influence — ${planet} touching ${target}.`;
    return { key, line: full };
  }

  // Otherwise rotate a short “supporting” variation so it doesn't feel cloned
  const variations = [
    `Keep actions factual; let the transit do its work without forcing outcomes.`,
    `Stay steady — small choices compound more than big pushes today.`,
    `Don’t over-interpret signals. One clean step is enough.`,
    `Use the energy quietly: finish, follow through, and close loops.`,
  ];

  return { key, line: variations[idx % variations.length] };
}


function buildDayGuidance(
  dateISO: string,
  relHouse: number | null,
  strongest: StrongTransitLite | null,
  idx: number,
  moonNakshatra?: string
): { expect: string; doLine: string; dontLine: string } {

  const houseText = houseFocusFromMoon(
    typeof relHouse === "number" ? relHouse : undefined
  );

  // Keep the opening rotation, but make them “human”
  const openings = [
    "Expect a steady day where small moves compound.",
    "Expect a practical day — progress likes structure today.",
    "Expect emotions to be noticeable; treat them as information, not commands.",
    "Expect sensitivity — keep things simple and clean.",
    "Expect attention to drift to what’s pending; close loops.",
    "Expect clarity when you slow down and choose one priority.",
    "Expect progress through discipline, not intensity.",
  ];
  const opening = openings[idx % openings.length];

  // --- Nakshatra premium layer (short + memorable) ---
  const nak = String(moonNakshatra ?? "").trim();
  const nakName = nak ? nak.split("(")[0].trim() : "";
  const theme = nakName ? String(nakTheme(nakName) || "").trim() : "";

  // Turn theme into a *guidance sentence* (not just keywords)
  function themeSentence(): string {
    if (!nakName) return "";
    const t = theme.toLowerCase();

    if (t.includes("communication") || t.includes("speaking") || t.includes("learning")) {
      return `Moon in ${nakName} favors clear communication — say the true thing simply, and write down the next step.`;
    }
    if (t.includes("service") || t.includes("healing") || t.includes("care")) {
      return `Moon in ${nakName} supports service and repair — small fixes (body, home, routine) create big relief.`;
    }
    if (t.includes("discipline") || t.includes("duty") || t.includes("structure")) {
      return `Moon in ${nakName} rewards discipline — less drama, more execution.`;
    }
    if (t.includes("ambition") || t.includes("drive") || t.includes("leadership")) {
      return `Moon in ${nakName} boosts ambition — choose one target and move toward it with calm confidence.`;
    }
    if (t.includes("relationships") || t.includes("bond") || t.includes("connection")) {
      return `Moon in ${nakName} highlights relationships — tone matters more than winning today.`;
    }

    // default (still premium): name + themes
    return theme
      ? `Moon in ${nakName} carries themes of ${theme} — use that energy deliberately instead of scattering it.`
      : `Moon in ${nakName} sets today’s emotional tone — move deliberately, not reactively.`;
  }

  // Base paragraph (2–4 sentences)
  const lines: string[] = [];

  // 1) opener
  lines.push(opening);

  // 2) nakshatra layer
  const nakLine = themeSentence();
  if (nakLine) lines.push(nakLine);

  // 3) house focus layer
  // 3) Moon-house focus line (premium, human)
const moodOpeners = [
  "Emotionally even, you can get a lot done without overthinking it.",
  "A calm, practical tone supports progress today.",
  "Your mind wants clarity — simplicity will feel powerful today.",
  "A slightly sensitive mood is possible; keep your pace steady.",
  "Today rewards quiet focus and clean choices.",
  "Small wins stack up — finish what you start.",
  "Less noise, more precision: one good decision beats many fast ones.",
];
lines.push(moodOpeners[idx % moodOpeners.length]);

lines.push(`Attention naturally goes toward ${houseText}.`);

lines.push("Keep actions simple and intentional: choose one priority, take one clear step, then close the loop.");

    // 4) transit flavor (dedupe so the same “strongest transit” doesn’t repeat daily)
const prevKey = String((strongest as any)?._prevKey ?? "");
const tline = transitLineGold(strongest, idx, prevKey);
if (tline.line) lines.push(tline.line);

  const expect = lines.filter(Boolean).join(" ");

  // DO / DON'T suggestions (keep yours)
  const doBank = [
    "Do: finish one pending task and close it fully.",
    "Do: keep your schedule lighter and protect focus.",
    "Do: have one honest conversation — soft tone, clear words.",
    "Do: take 10 minutes for journaling/prayer before decisions.",
    "Do: simplify — choose one priority and move it forward.",
    "Do: handle money/food/routine with care and consistency.",
    "Do: respond slowly; quality > speed.",
  ];
  const dontBank = [
    "Don’t: multitask or start 3 things at once.",
    "Don’t: react instantly to messages — pause first.",
    "Don’t: overspend or overcommit to please others.",
    "Don’t: push your body if energy feels low.",
    "Don’t: argue to win — aim for clarity instead.",
    "Don’t: make big decisions late at night or in a rush.",
    "Don’t: let small friction turn into a big mood.",
  ];

  let doLine = doBank[idx % doBank.length];
  let dontLine = dontBank[idx % dontBank.length];

  // Tune to category
  if (strongest?.category === "career") {
    doLine = "Do: take one concrete career step (send, submit, schedule, follow up).";
    dontLine = "Don’t: make impulsive job/business calls without checking details.";
  } else if (strongest?.category === "relationships") {
    doLine = "Do: prioritize one relationship action (check-in, clarify, set boundary).";
    dontLine = "Don’t: escalate emotionally — keep tone calm and precise.";
  } else if (strongest?.category === "health") {
    doLine = "Do: support the body (hydration, lighter food, early sleep).";
    dontLine = "Don’t: overtrain or experiment wildly with diet/routine today.";
  } else if (strongest?.category === "inner") {
    doLine = "Do: take quiet time — reflect before reacting.";
    dontLine = "Don’t: spiral in overthinking; write it down and move on.";
  }

  return { expect, doLine, dontLine };
}
function isoDateInTz(d: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

// small helper to generate facts from moon + transits
function buildDailyFacts(
  dailyMoon: DailyMoonEntry[],
  transits: TransitHit[],
  startDateISO: string,
  days: number,
  tz: string
): DailyFact[] {

  const startBase =
    parseISODateLoose(startDateISO) ??
    parseISODateLoose(new Date().toISOString().slice(0, 10)) ??
    new Date();

  const clampedDays = Math.max(1, Math.min(days, 14));
  const out: DailyFact[] = [];

  for (let i = 0; i < clampedDays; i++) {
    const day = addDaysLoose(startBase, i);
    const dateISO = isoDateInTz(day, tz);

    // Try tz date first
const m =
  dailyMoon.find((x) => x.dateISO === dateISO) ??
  // UTC fallback (some sources store dailyMoon in UTC)
  dailyMoon.find((x) => x.dateISO === day.toISOString().slice(0, 10));


// --- 1) Determine Moon nakshatra (SOURCE OF TRUTH) ---
let moonNakName = "";
let moonNakPada: number | null = null;

// Prefer a real sidereal degree if your dailyMoon row has it
const moonSidDeg = Number(
  (m as any)?.siderealLongitude ??
    (m as any)?.siderealLon ??
    (m as any)?.siderealDeg ??
    (m as any)?.moonSiderealLongitude ??
    (m as any)?.moonSiderealLon ??
    (m as any)?.moonSiderealDeg ??
    (m as any)?.moonLonSidereal ??
    (m as any)?.moonLon ??
    (m as any)?.lon ??
    (m as any)?.deg
);

if (Number.isFinite(moonSidDeg)) {
  const cn = nakshatraFromDegASCII(moonSidDeg);
  moonNakName = cn.name;
  moonNakPada = cn.pada;
} else {
  // fallback ONLY if we have no degree
  const fallbackNak =
    (m as any)?.moonNakshatraName ||
    (m as any)?.moonNakshatra ||
    (m as any)?.nakshatraName ||
    (m as any)?.nakshatra ||
    null;

  if (typeof fallbackNak === "string" && fallbackNak.trim()) {
    moonNakName = fallbackNak.trim();
  }
}

// --- 2) Relative house from Moon ---
const rel =
  (m as any)?.relativeHouseFromMoon ??
  (m as any)?.houseFromMoon ??
  null;

    // ---- 2) Strongest transit of that day ----
    const strongest: StrongTransitLite | null = (() => {
  const ts = (transits ?? []).filter(
    (t) => (t?.startISO ?? "") <= dateISO && (t?.endISO ?? "") >= dateISO
  );
  if (!ts.length) return null;

  const best = ts.reduce((b, c) => ((c?.strength ?? 0) > (b?.strength ?? 0) ? c : b));

  const rawCat = String(best?.category ?? "general").toLowerCase();
  const category: StrongTransitLite["category"] =
    rawCat === "career"
      ? "career"
      : rawCat === "relationships"
      ? "relationships"
      : rawCat === "health"
      ? "health"
      : rawCat === "inner"
      ? "inner"
      : "general";

  return {
    planet: String(best?.planet ?? "Transit"),
    target: String(best?.target ?? best?.title ?? "a key natal point"),
    category,
    strength: Number(best?.strength ?? 0),
    startISO: String(best?.startISO ?? dateISO),
    endISO: String(best?.endISO ?? dateISO),
  };
})();



    // ---- 3) Output ----
    out.push({
      dateISO,
      moonNakshatra: moonNakPada ? `${moonNakName} (Pada ${moonNakPada})` : moonNakName,

      relativeHouse: rel,
      strongestTransit: strongest,
    });
  }

  return out;
}

function ordinal(n?: number): string {
  if (!n || !Number.isFinite(n)) return "";
  const v = Math.abs(Math.trunc(n));
  const suffix =
    v % 100 >= 11 && v % 100 <= 13
      ? "th"
      : v % 10 === 1
      ? "st"
      : v % 10 === 2
      ? "nd"
      : v % 10 === 3
      ? "rd"
      : "th";
  return `${v}${suffix}`;
}

function classifyBullet(line: string): "strength" | "challenge" | "growth" {
  const s = (line || "").toLowerCase();

  const challengeHints = [
    "struggle",
    "struggles",
    "watch for",
    "beware",
    "risk",
    "may feel",
    "can feel",
    "conflict",
    "impatient",
    "misunderstood",
    "self-doubt",
    "periodic",
    "tension",
  ];
  const growthHints = [
    "learn",
    "growth",
    "practice",
    "build",
    "develop",
    "focus",
    "improve",
    "nudge",
    "work on",
    "try",
    "discipline",
    "steady",
  ];

  if (challengeHints.some((k) => s.includes(k))) return "challenge";
  if (growthHints.some((k) => s.includes(k))) return "growth";
  return "strength";
}

function parsePersonality(raw: unknown): { bullets: string[]; closing: string } {
  // raw can be string JSON, plain string, or object
  if (raw == null) return { bullets: [], closing: "" };

  // if already an object
  if (typeof raw === "object") {
    const obj: any = raw;
    const bullets = Array.isArray(obj.text) ? obj.text.filter(Boolean) : [];
    const closing = typeof obj.closing === "string" ? obj.closing : "";
    return { bullets, closing };
  }

  const str = String(raw);

  // try JSON parse
  try {
    const obj = JSON.parse(str);
    const bullets = Array.isArray((obj as any)?.text)
  ? (obj as any).text.filter(Boolean)
  : [];
    const closing = typeof (obj as any)?.closing === "string" ? (obj as any).closing : "";
    if (bullets.length || closing) return { bullets, closing };
  } catch {
    // ignore
  }

  // plain text fallback ï¿½ split into lines if it looks list-y
  const lines = str
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  return { bullets: lines.length > 1 ? lines : [str], closing: "" };
}
function normalizeDateToISO(input: string): string {
  const s = (input || "").trim();

  // already ISO: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // DD/MM/YYYY
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }

  return s; // fallback (won't crash)
}
function cap1(s: any) {
  const t = String(s ?? "").trim();
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function cleanText(input: string): string {
  if (!input) return "";

  return String(input ?? "")
  // remove Unicode "replacement character"
  .replace(/\uFFFD/g, "")
  // normalize smart quotes to plain quotes
  .replace(/[“”„‟]/g, '"')
  .replace(/[‘’‚‛]/g, "'")
  // normalize dashes to hyphen (safe inside strings)
  .replace(/[–—]/g, "-")
  // collapse whitespace
  .replace(/\s+/g, " ")
  .trim();
}

function parseAiJson(raw: string) {
  const s0 = (raw ?? "").trim();
  if (!s0) return null;

  // Remove common code fences
  const s1 = s0
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(s1);
  } catch {
    return null;
  }
}

// ---------------- Weekly guidance helper (client-side) ----------------
function fixWeirdEncoding(input: string) {
  const s = String(input ?? "");

  return s
    // 1) Kill Unicode replacement char
    .replace(/\uFFFD/g, "")

    // 2) Common mojibake sequences
    .replace(/\u00E2\u0080\u0099/g, "\u2019") // ï¿½
    .replace(/\u00E2\u0080\u009C/g, "\u201C") // ï¿½
    .replace(/\u00E2\u0080\u009D/g, "\u201D") // ï¿½
    .replace(/\u00E2\u0080\u0093/g, "\u2013") // ï¿½
    .replace(/\u00E2\u0080\u0094/g, "\u2014") // ï¿½
    .replace(/\u00E2\u0080\u00A6/g, "\u2026") // ï¿½
    .replace(/\u00E2\u0086\u0092/g, "\u2192") // ?

    // 3) Drop stray and NBSP
    .replace(/\u00C2/g, "")
    .replace(/\u00A0/g, " ")

    // 4) Fix apostrophes in common contractions (safe)
    // today?s -> today's, we?ll -> we'll, you?re -> you're, don?t -> don't, etc.
    .replace(
      /\b([A-Za-z]+)\?(s|t|re|ve|ll|d|m)\b/g,
      "$1'$2"
    )

    // 5) Fix numeric ranges where ï¿½ stands for a dash (do this BEFORE degree fixes)
    // 1?2 sentence/day/week/month -> 1ï¿½2 sentence/day/week/month
    .replace(
      /(\d)\?(\d)(\s*(?:sentence|sentences|day|days|week|weeks|month|months)\b)/gi,
      "$1ï¿½$2$3"
    )

    // 6) Fix degree symbol corruption (only when it looks like deg+minutes)
    // 13?20' -> 13ï¿½20'
    .replace(/(\d{1,2})\?(\d{2})(?=')/g, "$1ï¿½$2")

    // Also handle cases like 0?30 (common in astro text)
    .replace(/(\d{1,2})\?(\d{2})(?!\d)/g, "$1ï¿½$2")

    // 7) Fix separators: "active? treat" or "Retrograde ?"
    .replace(/([A-Za-z0-9])\?\s+(?=[A-Za-z])/g, "$1 ï¿½ ")
    .replace(/\s+\?\s+/g, " – ")

    // 8) Collapse extra spaces
    .replace(/\s{2,}/g, " ")
    .trim();
}


function sanitizeText(input: string): string {
  if (!input) return "";

  return input
    // remove ï¿½ replacement characters
    .replace(/\uFFFD/g, "")
    // common mojibake fixes
    .replace(/ï¿½/g, "")
    .replace(/ï¿½|/g, '"')
    .replace(/ï¿½|ï¿½/g, "'")
    .replace(/ï¿½|ï¿½/g, "")
    .replace(/ï¿½/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fmtRangeLabel(start: Date, end: Date): string {
  // Use UTC so it's stable and not affected by local time zone shifts
  const sameDay =
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCDate() === end.getUTCDate();

  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  if (sameDay) {
    // e.g. "Nov 20"
    return fmt.format(start);
  }

  const sameMonth =
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth();

  if (sameMonth) {
    const month = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(start);
    const d1 = start.getUTCDate();
    const d2 = end.getUTCDate();
    // e.g. "Nov 2026"
    return `${month} ${d1}-${d2}`;
  }

  // Different months or years, e.g. "Nov 30 - Dec 6"
  return `${fmt.format(start)} - ${fmt.format(end)}`;
}

type WeeklyInsight = { label: string; text: string };
type WeeklyCat = "career" | "relationships" | "health" | "inner" | "general";

/**
 * Minimal, safe weekly builder: picks a rough category based on transit.category
 * and uses a simple template. We can always make this smarter later.
 */
function buildWeeklyFromTransits(
  transits: TransitHit[],
  startDateISO: string,
  weeks: number
): WeeklyInsight[] {
  const startBase =
    parseISODateLoose(startDateISO) ??
    parseISODateLoose(new Date().toISOString().slice(0, 10)) ??
    new Date();

  const clampedWeeks = Math.max(1, Math.min(weeks, 12));
  const out: WeeklyInsight[] = [];

  const TEMPLATES: Record<WeeklyCat, string> = {
    career:
      "Career: This week supports steady, realistic progress. Choose one priority and move it forward calmly instead of chasing everything at once.",
    relationships:
      "Relationships: Make room for one or two honest, gentle conversations. Soft tone and patience will go further than big debates.",
    health:
      "Health & routines: Favour rhythm over intensity. Simple food, rest and light movement will support you more than big experiments.",
    inner:
      "Inner work: Keep a few minutes each day for quiet reflection, journaling or prayer. Let thoughts settle before you act.",
    general:
      "General focus: A balanced week. Clear small pending tasks, keep your schedule simple and move at a steady pace.",
  };

  function pickCategory(trans: TransitHit[]): WeeklyCat {
    if (!trans.length) return "general";

    const scores: Record<WeeklyCat, number> = {
      career: 0,
      relationships: 0,
      health: 0,
      inner: 0,
      general: 0,
    };

    for (const t of trans) {
      const strength =
        typeof t.strength === "number" && Number.isFinite(t.strength)
          ? t.strength
          : 0.5;

      const cat: WeeklyCat =
        t.category === "career" ||
        t.category === "relationships" ||
        t.category === "health" ||
        t.category === "inner"
          ? t.category
          : "general";

      scores[cat] += strength;
    }

    let best: WeeklyCat = "general";
    let bestScore = 0;
    (Object.keys(scores) as WeeklyCat[]).forEach((c) => {
      if (scores[c] > bestScore) {
        bestScore = scores[c];
        best = c;
      }
    });

    return best;
  }

  for (let i = 0; i < clampedWeeks; i++) {
    const weekStart = addDaysLoose(startBase, i * 7);
    const weekEnd = addDaysLoose(weekStart, 6);
    const label = fmtRangeLabel(weekStart, weekEnd);

    const startISO = weekStart.toISOString().slice(0, 10);
    const endISO = weekEnd.toISOString().slice(0, 10);

    const active = transits.filter(
      (t) => !(t.endISO < startISO || t.startISO > endISO)
    );

    const cat = pickCategory(active);
    const base = TEMPLATES[cat];

    let extra = "";
    if (active.length) {
      active.sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
      const strongest = active[0];
      const planet = strongest.planet;
      const target = strongest.target || "a key natal point";
      extra = ` A noticeable influence from ${planet} ${target} is active in the background - stay conscious, go slow and avoid big reactions.`;
    }

    out.push({
      label,
      text: base + (extra ? extra : ""),
    });
  }

  return out;
}
// --- Nakshatra helpers (deterministic; do NOT trust AI text for this) ---
const NAK_SPAN = 13 + 20 / 60; // 1320' = 13.333333333...
const NAK_NAMES_ASCII = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha",
  "Purva Bhadrapada","Uttara Bhadrapada","Revati",
];

function norm360(n: number) {
  const x = n % 360;
  return x < 0 ? x + 360 : x;
}
function normalizeMojibake(input: any): string {
  let s = String(input ?? "");

  // Normalize to reduce weird unicode forms
  try {
    s = s.normalize("NFKC");
  } catch {}

  // Remove control chars (keep newline + tab)
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

  // Kill common replacement chars / mojibake sequences
  s = s
    .replace(/\uFFFD/g, "")        // � replacement char
    .replace(/ï¿½/g, "")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/â€˜/g, "‘")
    .replace(/â€™/g, "’")
    .replace(/â€œ/g, "“")
    .replace(/â€/g, "”")
    .replace(/â€¦/g, "…")
    .replace(/Â/g, "")
    .replace(/ΓÇÖ/g, "’")
    .replace(/ΓÇô/g, "–")
    .replace(/ΓÇö/g, "—");

  // Remove bidi / zero-width / direction marks that can create visual garbage
  s = s.replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, "");

  // ✅ Remove box drawing + block elements + geometric shapes
  // (this is exactly the “line garbage” in your screenshot)
  s = s.replace(/[\u2500-\u257F\u2580-\u259F\u25A0-\u25FF]/g, "");

  // Collapse whitespace
  s = s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

  // ✅ Hard guard 1: if it STILL contains box/block chars, drop it
  if (/[\u2500-\u257F\u2580-\u259F\u25A0-\u25FF]/.test(s)) return "";

  // ✅ Hard guard 2: repeated-glyph runs like "──────" or "██████" patterns
  // (helps even when chars aren’t in the exact ranges above)
  if (/(.)\1{10,}/.test(s)) return "";

  // ✅ Junk ratio: tighten a bit so it gets discarded earlier
  const total = s.length || 1;
  const good =
    (s.match(/[A-Za-z0-9\u0600-\u06FF\u0900-\u097F ,.'"“”‘’\-–—:;!?()\n]/g) ??
      []).length;

  const junkRatio = 1 - good / total;

    // ✅ Keep text unless it's clearly the box/block gibberish
  // If text is extremely short after cleanup, it's not useful.
  if (s.length < 2) return "";

  return s;

}
function pickKey<T>(arr: T[], key: string): T {
  if (!arr.length) return arr[0] as T;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

function extractFocusFromFacts(facts: string[]): string {
  const focusRaw = facts.find((x) => x.toLowerCase().includes("focus area:")) || "";
  return String(focusRaw).split(":").slice(1).join(":").trim();
}

function extractMoonFromNatalMoonHouse(facts: string[]): number | null {
  const moonFromRaw = facts.find((x) => x.toLowerCase().includes("from natal moon")) || "";
  const m = String(moonFromRaw).match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

function buildMoonGuidedFallbackText(opts: {
  dateISO: string;
  idx: number;
  facts: string[];
  conf: string;
}): string {
  const { dateISO, idx, facts } = opts;

  const focusLower = extractFocusFromFacts(facts).toLowerCase();
  const moonFrom = extractMoonFromNatalMoonHouse(facts); // 1..12 or null

  // Very light Moon steering (restore variation)
  const moonTone =
    moonFrom === 6 || moonFrom === 10
      ? "Practical and productive."
      : moonFrom === 7 || moonFrom === 11
      ? "Social and collaborative."
      : moonFrom === 8 || moonFrom === 12
      ? "Quiet and reflective."
      : moonFrom === 4
      ? "Home and foundations."
      : "Steady and balanced.";

  const REL = [
    "Choose timing and tone first; your message lands better.",
    "Ask one direct question instead of assuming the answer.",
    "Say the simple truth kindly; clarity beats over-explaining.",
  ];

  const CAREER = [
    "Finish one thing fully, then move to the next.",
    "Keep updates short and clear; execute the plan.",
    "Pick one priority and close the loop cleanly.",
  ];

  const HEALTH = [
    "Protect energy: hydrate early and keep the day simple.",
    "Do less, but do it consistently; routines win today.",
    "Avoid overstimulation; steady habits stabilize everything.",
  ];

  const INNER = [
    "Pause before reacting; clarity shows up after the pause.",
    "Name one emotion, then take one small practical step.",
    "Reduce inputs; your mind settles when you simplify.",
  ];

  const GENERAL = [
    "One priority, one clean action — keep distractions low.",
    "Small improvements compound; finish what you start.",
    "Stay consistent; don’t chase intensity today.",
  ];

  const pool = focusLower.includes("relationship")
    ? REL
    : focusLower.includes("career") || focusLower.includes("work")
    ? CAREER
    : focusLower.includes("health")
    ? HEALTH
    : focusLower.includes("inner") || focusLower.includes("mind")
    ? INNER
    : GENERAL;

  const key = `${dateISO || idx}::${moonFrom ?? "x"}::${focusLower}`;
  const guidance = pickKey(pool, key);

  return `${moonTone} ${guidance}`.trim();
}
function fixQuotedGibberish(input: any) {
  const s = String(input ?? "");
  const quoteCount = (s.match(/"/g) || []).length;

  // If the string has an unusually high quote density,
  // it’s likely the `"E"x"p"...` style corruption.
  if (quoteCount > Math.max(12, Math.floor(s.length * 0.12))) {
    return s
      .replace(/"/g, "")          // remove all double quotes
      .replace(/\s{2,}/g, " ")    // collapse whitespace
      .trim();
  }
  return s;
}

// Keep your wrapper
function safeText(x: any): string {
  return cleanText(normalizeMojibake(x));
}
function isMostlyGarbage(input: string): boolean {
  const s = String(input ?? "").trim();
  if (!s) return true;

  // Quick catches for common mojibake / replacement-char spam
  if (s.includes("�") || s.includes("ï¿½") || s.includes("Ã") || s.includes("Â")) return true;

  // Remove whitespace for ratio checks
  const compact = s.replace(/\s+/g, "");
  if (compact.length < 8) return false;

  // Count "non-normal" characters (symbols/box-drawing/etc.)
  // Allow normal punctuation + letters/numbers.
  const weird = compact.match(/[^a-zA-Z0-9.,!?'"():;\-–—/%&@#]/g)?.length ?? 0;

  // If too many weird chars, it's likely garbage
  const ratio = weird / compact.length;
  return ratio > 0.22; // tune if needed
}

function apiPath(p: string) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${base}${path}`;
}

function nakshatraFromDegASCII(deg: number) {
  const d = norm360(deg);
  const idx = Math.min(26, Math.max(0, Math.floor(d / NAK_SPAN)));
  const into = d - idx * NAK_SPAN;
  const pada = Math.min(4, Math.max(1, Math.floor(into / (NAK_SPAN / 4)) + 1));
  return { name: NAK_NAMES_ASCII[idx], pada };
}

// Remove any AI-hallucinated nakshatra mentions from highlight text
function stripNakshatraClaims(s: string) {
  const t = String(s ?? "");
  if (!t.trim()) return t;

  // Build a safe list of nakshatra names we want to strip if AI mentions them
  const NAKS = [
    "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha","Ardra",
    "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
    "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
    "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha",
    "Purva Bhadrapada","Uttara Bhadrapada","Revati",
  ];

  // Matches things like:
  // "Pushya Moon day...", "This Ashlesha Moon...", "Moon in Purva Phalguni...",
  // "Moon moves through Pushya...", "Moon nakshatra is Pushya..."
  const nakPattern = NAKS.map((n) => n.replace(/\s+/g, "\\s+")).join("|");

  return t
    // "Pushya Moon day ..." / "Ashlesha Moon ..."
    .replace(new RegExp(`\\b(?:${nakPattern})\\s+Moon\\b[^.]*\\.?\\s*`, "gi"), "")

    // "Moon in Pushya..." / "Moon is in Pushya..."
    .replace(new RegExp(`\\bMoon\\s+(?:is\\s+)?in\\s+(?:${nakPattern})\\b[^.]*\\.?\\s*`, "gi"), "")

    // "Moon moves through Pushya..." / "Moon transits Pushya..."
    .replace(new RegExp(`\\bMoon\\s+(?:moves\\s+through|transits|enters)\\s+(?:${nakPattern})\\b[^.]*\\.?\\s*`, "gi"), "")

    // "Moon nakshatra is: Pushya"
    .replace(new RegExp(`\\bMoon\\s+nakshatra\\s+(?:is|:)?\\s*(?:${nakPattern})\\b[^.]*\\.?\\s*`, "gi"), "")

    // cleanup extra spaces
    .replace(/\s{2,}/g, " ")
    .trim();
}


/* ---------------- Monthly highlights helper (client-side) ---------------- */
function stripMoodPrefix(main: string, moodText: string) {
  const t = String(main || "").trim();
  const m = String(moodText || "").trim();
  if (!t || !m) return t;

  const tL = t.toLowerCase();
  const mL = m.toLowerCase();

  // If main starts with moodText (exact or near-exact), remove it.
  if (tL.startsWith(mL)) {
    return t.slice(m.length).trim().replace(/^[-:]\s*/, "");
  }

  // Also handle cases like "Steady mood today. Steady mood today..."
  const doubled = `${mL} ${mL}`;
  if (tL.startsWith(doubled)) {
    return t.slice(m.length).trim().replace(/^[-:]\s*/, "");
  }

  return t;
}

function cleanMoodText(mood: string, moodText: string) {
  const m = String(mood || "").trim().toLowerCase();
  let t = String(moodText || "").trim();

  // remove leading "Balanced..." / "Uplifting..." etc
  const leading = new RegExp(`^\\s*${m}\\s*(and\\s+[a-z]+)?\\s*[-:]*\\s*`, "i");
  t = t.replace(leading, "");

  // also remove common repeated phrases
  t = t.replace(/^balanced and practical\s*[-:]*\s*/i, "");
  t = t.replace(/^neutral mood\s*[-:]*\s*/i, "");

  return t.trim();
}
function hashToIndex(key: string, mod: number) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return mod ? h % mod : 0;
}
function pick<T>(arr: T[], idx: number) {
  return arr[idx % arr.length];
}


function dailyFlavorExtras(key: string) {
  const colors = [
    "Blue",
    "Green",
    "Yellow",
    "White",
    "Light Pink",
    "Sky Blue",
    "Earthy Brown",
    "Soft Orange",
  ];

  const times = [
    "Early morning",
    "Mid-morning",
    "Late morning",
    "Early afternoon",
    "Mid-afternoon",
    "Early evening",
    "Late evening",
  ];

  return {
    color: pickKey(colors, key),
    luckyNumber: (hashToIndex(key, 9) + 1),
    bestTime: pickKey(times, key + "::time"),
  };
}

function pickDifferent<T>(arr: T[], idx: number, avoid: string) {
  const a = arr.filter((x) => String(x).toLowerCase() !== String(avoid).toLowerCase());
  return pick(a.length ? a : arr, idx);
}

type MonthlyHighlight = { label: string; text: string };

type MonthlyFeature = {
  label: string;
  startISO: string;
  endISO: string;
  primaryCategory: "career" | "relationships" | "health" | "inner" | "general";
  strongestTransit: {
    transitPlanet: string;
    natalPlanet: string;
    aspect: string;
    category: "career" | "relationships" | "health" | "inner" | "general";
    strength: number;
  } | null;
};
function todayISOInTz(tz?: string) {
  const safeTz = tz && String(tz).trim() ? String(tz).trim() : "Asia/Dubai";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: safeTz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function buildMonthlyFeaturesFromTransits(
  transits: TransitHit[],
  startDateISO: string,
  numMonths: number
): MonthlyFeature[] {
  const startBase =
    parseISODateLoose(startDateISO) ??
    parseISODateLoose(new Date().toISOString().slice(0, 10)) ??
    new Date();

  const clampedMonths = Math.max(1, Math.min(numMonths, 12));
  const out: MonthlyFeature[] = [];

  for (let i = 0; i < clampedMonths; i++) {
    const monthStart = new Date(
      Date.UTC(
        startBase.getUTCFullYear(),
        startBase.getUTCMonth() + i,
        1
      )
    );
    const monthEnd = new Date(
      Date.UTC(
        monthStart.getUTCFullYear(),
        monthStart.getUTCMonth() + 1,
        0
      )
    );

    const label = fmtRangeLabel(monthStart, monthEnd);
    const primaryCategory = primaryCategoryForRange(
      transits,
      monthStart,
      monthEnd
    );
    const strongest = strongestTransitForRange(
      transits,
      monthStart,
      monthEnd
    );

    let strongestTransit: MonthlyFeature["strongestTransit"] = null;

    if (strongest) {
      const targetStr =
        typeof strongest.target === "string" ? strongest.target : "";
      const m = targetStr.match(
        /(conjunction|square|trine|opposition|sextile)\s+natal\s+(\w+)/i
      );

      const aspect = m ? m[1].toLowerCase() : "alignment";
      const natalPlanet = m ? m[2] : "a natal point";

      strongestTransit = {
        transitPlanet: strongest.planet,
        natalPlanet,
        aspect,
        category: strongest.category,
        strength: strongest.strength ?? 0.6,
      };
    }

        const rawCategory = primaryCategory || "general";

    const safeCategory: MonthlyFeature["primaryCategory"] =
      rawCategory === "health" ||
      rawCategory === "career" ||
      rawCategory === "relationships" ||
      rawCategory === "inner" ||
      rawCategory === "general"
        ? rawCategory
        : "general";

    out.push({
      label,
      startISO: monthStart.toISOString().slice(0, 10),
      endISO: monthEnd.toISOString().slice(0, 10),
      primaryCategory: safeCategory,
      strongestTransit,
    });

  }

  return out;
}

function buildMonthlyFallbackFromFeatures(
  features: MonthlyFeature[]
): MonthlyHighlight[] {
  return features.map((f) => {
    const { label, primaryCategory, strongestTransit } = f;

    let base: string;
    if (primaryCategory === "career") {
      base =
        "Career: this month supports steady growth, planning and visibility. Focus on practical steps rather than dramatic leaps.";
    } else if (primaryCategory === "relationships") {
      base =
        "Relationships: this month brings important one-to-one interactions. Repair, clarify or deepen key bonds with calm honesty.";
    } else if (primaryCategory === "health") {
      base =
        "Health: this month is good for gentle lifestyle changes. Small, consistent shifts in routine can have long-lasting effects.";
    } else if (primaryCategory === "inner") {
      base =
        "Inner work: the month has a more introspective tone. Simplifying commitments and spending time in reflection will help you reset.";
    } else {
      base =
        "Balanced month: several life areas move together. Choose one or two main priorities and let the rest move at a slower pace.";
    }

    let extra = "";
    const st = strongestTransit;
    if (st && st.strength >= 0.55) {
      const aspectWord =
        st.aspect === "conjunction"
          ? "joins"
          : st.aspect === "square"
          ? "challenges"
          : st.aspect === "opposition"
          ? "pulls against"
          : st.aspect === "trine"
          ? "supports"
          : "interacts with";

      extra =
        ` ${st.transitPlanet} ${aspectWord} your natal ${st.natalPlanet}, ` +
        `adding extra emphasis in ${primaryCategory}. Think in terms of ` +
        `gradual adjustments rather than all-or-nothing moves.`;
    }

    return {
      label,
      text: [label, base + extra].join("\n"),
    };
  });
}
function describeNakshatra(n: string | undefined) {
  if (!n) return null;

  const map: Record<string, string> = {
    "Uttara Ashadha":
      "Uttara Ashadha emphasizes perseverance, integrity, and finishing what is started. Progress comes through consistency, not force.",
    // well expand later
  };

  return map[n] || null;
}
type BulletLike =
  | string
  | {
      text?: unknown;
      label?: unknown;
      value?: unknown;
      title?: unknown;
    };

function bulletText(x: unknown): string {
  if (typeof x === "string") return x.trim();
  if (!x || typeof x !== "object") return String(x ?? "").trim();

  const b = x as BulletLike;
  const pick =
    (typeof (b as any).text === "string" && (b as any).text) ||
    (typeof (b as any).label === "string" && (b as any).label) ||
    (typeof (b as any).value === "string" && (b as any).value) ||
    (typeof (b as any).title === "string" && (b as any).title) ||
    "";

  return String(pick ?? "").trim();
}

function houseFocusFromMoon(h?: number): string {
  switch (h) {
    case 2:
      return "finances, food choices and your sense of daily security";
    case 3:
      return "effort, short tasks, emails and communication";
    case 4:
      return "home, emotional grounding and family matters";
    case 5:
      return "creativity, children, romance and enjoyment";
    case 6:
      return "workload, routines, small health matters and service";
    case 7:
      return "one-to-one relationships, spouse, clients and partners";
    case 8:
      return "shared resources, deeper emotions and hidden fears";
    case 9:
      return "learning, beliefs, travel and mentors";
    case 10:
      return "career, visibility, status and long-term direction";
    case 11:
      return "friends, networks, ambitions and gains";
    case 12:
      return "rest, retreat, sleep and the subconscious";
    case 1:
      return "your own mood, body, confidence and how you show up";
    default:
      return "your overall mood and the day's emotional flow";
  }
}
function shortCategoryLabel(
  cat: "career" | "relationships" | "health" | "inner" | "general"
): string {
  switch (cat) {
    case "career":
      return "career and long-term direction";
    case "relationships":
      return "relationships, partnerships and close bonds";
    case "health":
      return "health, energy and daily routines";
    case "inner":
      return "inner work, psychology and quiet reflection";
    case "general":
    default:
      return "your general life direction";
  }
}
function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick2<T>(arr: T[], key: string) {
  if (!arr.length) return arr[0] as any;
  const idx = hashStr(key) % arr.length;
  return arr[idx];
}

function normFocus2(focus: string) {
  const x = (focus || "").toLowerCase();
  if (x.includes("relationship")) return "relationships";
  if (x.includes("career")) return "career";
  if (x.includes("health")) return "health";
  if (x.includes("inner")) return "inner";
  return "general";
}

function inferMoodFromMoonFrom(moonFrom: number | null) {
  // classic intensity houses (private logic; we never show the number)
  if (moonFrom === 6 || moonFrom === 8 || moonFrom === 12) return "heavy";
  if (moonFrom === 1 || moonFrom === 5 || moonFrom === 9) return "uplifting";
  if (moonFrom === 3 || moonFrom === 11) return "social";
  if (moonFrom === 2 || moonFrom === 10) return "focused";
  return "balanced";
}

function buildMoodLineText(mood: string, key: string) {
  const m = String(mood || "balanced").toLowerCase();

  const pools: Record<string, string[]> = {
    balanced: [
      "A steady, normal-feeling day  youll do best with a simple, clean plan.",
      "Your mood is stable today. Small wins will feel surprisingly satisfying.",
      "Nothing dramatic emotionally  the day rewards consistency over intensity.",
      "Youll feel most grounded when you keep things practical and uncluttered.",
      "Steady inner weather. If you keep the pace calm, the day stays smooth.",
      "Emotionally even  you can get a lot done without overthinking it.",
      "Balanced tone today. Decisions feel easier when you keep them simple.",
      "Quietly productive energy  one clean action unlocks the next.",
    ],

    uplifting: [
      "Lighter mood today  you may feel more hopeful and open than usual.",
      "Youll feel encouraged today. Use that momentum for one meaningful step.",
      "A slightly brighter inner tone  conversations can flow more easily.",
      "Good emotional lift today. Dont waste it on small irritations.",
      "You may feel more confident today  act on one thing youve been delaying.",
      "Its easier to stay positive. Keep the day moving and dont overanalyze.",
      "Warm, upbeat energy  people respond well when you keep it simple.",
      "A nice emotional tailwind  do one thing that makes you proud.",
    ],

    heavy: [
      "Sensitive day  you may take things personally. Slow down your reactions.",
      "Emotions may feel louder today. Give yourself space before you respond.",
      "A heavier inner tone  dont force big decisions. Keep it gentle.",
      "You may feel more reactive. Protect your peace with fewer conversations.",
      "Emotionally dense day  do less, but do it with care and calm.",
      "If something stings today, pause. Dont reply in the first wave.",
      "You might feel low tolerance. Keep your circle small and your tasks simple.",
      "More sensitive than usual  softness and pacing will help a lot.",
    ],

    restless: [
      "Restless energy today  attention can jump. Keep tasks small and clear.",
      "Your mind may race a bit. Short sprints work better than long pushes.",
      "You may feel impatient. Dont multitask  it will scatter the day.",
      "Busy inner buzz  write the next step down so you dont spin.",
      "A little restless today. Movement helps you settle quickly.",
      "If you feel pulled in many directions, pick one lane and stay there.",
      "Your attention may wander  simplify your to-do list on purpose.",
      "Fast mental energy  channel it into one finish, not many starts.",
    ],

    clear: [
      "Clear-headed day  youll see what matters quickly. Keep it decisive.",
      "Mentally sharp today. One clean decision can remove a lot of noise.",
      "Clarity is available  do the thing youve been avoiding.",
      "Youll think more cleanly today. Dont dilute it with distractions.",
      "Good mental clarity  you can solve a problem faster than expected.",
      "Its easier to stay objective today. Use it to close something pending.",
      "Clear mind, steady hands  a great day for tidy execution.",
      "Youll feel more certain today. Take one direct step forward.",
    ],

    introspective: [
      "Inward day  you may want quiet. Dont over-socialize if it drains you.",
      "More reflective mood  journaling or a short walk will feel grounding.",
      "You may feel inward. Keep conversations fewer, but more meaningful.",
      "A thoughtful day  clarity comes after you sit with it for a moment.",
      "Inner processing day  dont rush your feelings; name them, then act.",
      "You may prefer solitude today. Thats fine  protect that space.",
      "Quiet inner tone  one small grounding routine will help a lot.",
      "Reflective energy  dont force speed; let the day unfold calmly.",
    ],
  };

  const fallback = pools.balanced;
  const arr = pools[m] || fallback;

  // rotate by date/key so it doesn't repeat every day
  return pickKey(arr, key + "::mood");
}


function transitFlavorFromFacts(facts: string[]) {
  // We DO NOT show these strings  only use them to vary output.
  const s = facts.join(" | ").toLowerCase();

  if (s.includes("strongest transit: venus")) return "venus";
  if (s.includes("strongest transit: mars")) return "mars";
  if (s.includes("strongest transit: saturn")) return "saturn";
  if (s.includes("strongest transit: jupiter")) return "jupiter";
  if (s.includes("strongest transit: mercury")) return "mercury";
  if (s.includes("strongest transit: rahu") || s.includes("strongest transit: ketu")) return "nodes";

  return "generic";
}

function guidanceLine(focus: string, mood: string, flavor: string, key: string) {
  const pools: Record<string, string[]> = {
    relationships: [
      "Choose warmth over precision. One clear conversation beats ten half-replies.",
      "Ask one direct question instead of assuming the answer.",
      "If something feels off, pause  then speak calmly and clearly.",
    ],
    career: [
      "Structure wins today. Finish one thing completely before starting another.",
      "Do the hard thing first  the rest becomes easy.",
      "Clean execution beats big planning. Ship one small output.",
    ],
    health: [
      "Protect energy. Keep routine clean, meals lighter, and sleep respected.",
      "Move a little, hydrate, and avoid overstimulation.",
      "Dont push intensity  consistency is the win today.",
    ],
    inner: [
      "Name one emotion, then take one small grounded action.",
      "If your mind loops, write it down once and return to the next step.",
      "Quiet progress is progress  dont force clarity.",
    ],
    general: [
      "Keep it simple: one priority, one clean action.",
      "Choose the smallest useful step and do it fully.",
      "Reduce noise. Do less, but do it properly.",
    ],
  };

  // Add a small overlay based on flavor
  const overlay: Record<string, string[]> = {
    venus: [
      "Make things smoother: fix tone, aesthetics, or harmony in one place.",
      "Choose diplomacy. A softer approach gets better results.",
      "Nudge life toward balance  dont push.",
    ],
    mars: [
      "Channel urgency into one controlled task  avoid sharp reactions.",
      "Act, but dont explode. Precision beats force.",
      "Cut one problem at the root instead of fighting everything.",
    ],
    saturn: [
      "Do the responsible thing first. Discipline is your advantage today.",
      "Simplify and follow the process. Consistency wins.",
      "Avoid shortcuts  do it cleanly once.",
    ],
    jupiter: [
      "Think long-term. Make one wise decision youll respect later.",
      "Good day to learn, plan, or mentor  keep ego out.",
      "Choose meaning over speed.",
    ],
    mercury: [
      "Communicate clearly: shorter messages, sharper intent.",
      "Double-check details. One mistake can create extra work.",
      "Have one focused conversation; dont multitask talk.",
    ],
    nodes: [
      "Keep choices simple  avoid extremes and overthinking.",
      "If something feels obsessive, step back and reset.",
      "Dont chase noise. Stick to what matters.",
    ],
    generic: ["", "", ""],
  };

const basePool = pools[focus] || pools.general;
const addPool = overlay[flavor] || overlay.generic;

const base = pickKey(basePool, key + "::base");
const add = pickKey(addPool, key + "::overlay");

  return add ? `${base} ${add}` : base;
}
// Deterministic "pick" from an array using a string key
function pickKeyed<T>(arr: T[], key: string): T {
  if (!arr.length) throw new Error("pickKeyed: empty array");
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0; // uint32 hash
  }
  return arr[h % arr.length];
}

// Pick 2 distinct items deterministically
function pick2Keyed(arr: string[], key: string): [string, string] {
  const first = pickKeyed(arr, key + "::1");
  const rest = arr.filter((x) => x !== first);
  const second = pickKeyed(rest.length ? rest : arr, key + "::2");
  return [first, second];
}

// Normalizes focus flags so includes() works reliably
function normFocus(focus: any) {
  const f = String(focus ?? "").toLowerCase();
  return {
    rel: f.includes("relationships"),
    career: f.includes("career"),
    health: f.includes("health"),
    inner: f.includes("inner"),
  };
}
function isGenericMoodText(s: string) {
  const t = String(s || "").trim().toLowerCase();
  if (!t) return true;

  // Known generic / repetitive lines (add more if you see them)
  const GENERIC = [
    "even-paced day  small improvements compound.",
    "steady effort wins today.",
    "keep it clean and consistent.",
    "balanced and practical.",
    "neutral mood  keep it clean and consistent.",
  ];

  if (GENERIC.includes(t)) return true;

  // Also treat super-short or low-signal lines as generic
  if (t.length < 18) return true;

  return false;
}


function doAvoidLists(focus: string, mood: string, key: string) {
  const DO_REL = [
    "Listen fully before replying",
    "Speak calmly and directly",
    "Send one thoughtful message",
    "Clarify one misunderstanding early",
  ];
  const AVOID_REL = [
    "Reacting instantly",
    "Assuming intentions",
    "Passive aggression",
    "Overexplaining",
  ];

  const DO_CAREER = [
    "Close one pending task",
    "Send one clear update / follow-up",
    "Write a short next-step list",
    "Finish what you start",
  ];
  const AVOID_CAREER = [
    "Multitasking",
    "Starting new distractions",
    "Overpromising",
    "Rushing without checking",
  ];

  const DO_HEALTH = [
    "10-20 minutes movement",
    "Hydrate + lighter meals",
    "Early night / low screens",
    "A short walk after meals",
  ];
  const AVOID_HEALTH = [
    "Skipping sleep",
    "Overdoing stimulation",
    "Heavy late meals",
    "Too much caffeine",
  ];

  const DO_INNER = [
    "Write down 1 worry, then 1 next step",
    "Do one grounding task (walk / tidy / shower)",
    "Breathe 2 minutes before decisions",
    "Reduce inputs (noise / scrolling)",
  ];
  const AVOID_INNER = [
    "Doom-scrolling",
    "Reading too much into small things",
    "Replaying old conversations",
    "Decision-making when emotional",
  ];

  const DO_GEN = [
    "Finish one small pending thing",
    "Keep your plan simple",
    "Do one thing properly",
    "Slow down your pace",
  ];
  const AVOID_GEN = [
    "Overthinking",
    "Trying to do too much",
    "Reacting from urgency",
    "Scattered attention",
  ];

  // Mood bias: if heavy/restless, prefer calming actions
  const m = (mood || "").toLowerCase();
  const CALM_DO = ["Pause before replying", "Keep things simple", "Take a short walk", "Breathe slowly for 2 minutes"];
  const CALM_AVOID = ["Escalating quickly", "Overloading your schedule", "Making big decisions emotionally", "Too much stimulation"];

  const flags = normFocus(focus);

  let doPool = flags.rel
    ? DO_REL
    : flags.career
    ? DO_CAREER
    : flags.health
    ? DO_HEALTH
    : flags.inner
    ? DO_INNER
    : DO_GEN;

  let avoidPool = flags.rel
    ? AVOID_REL
    : flags.career
    ? AVOID_CAREER
    : flags.health
    ? AVOID_HEALTH
    : flags.inner
    ? AVOID_INNER
    : AVOID_GEN;

  // If mood is "heavy" or "restless", blend in calming options
  if (m.includes("heavy") || m.includes("restless") || m.includes("sensitive")) {
    doPool = [...doPool, ...CALM_DO];
    avoidPool = [...avoidPool, ...CALM_AVOID];
  }

  const [d1, d2] = pick2Keyed(doPool, key + "::do");
  const [a1, a2] = pick2Keyed(avoidPool, key + "::avoid");

  return {
    do: [d1, d2],
    avoid: [a1, a2],
  };
}


function chooseStrongTransitForDay(
  dateISO: string,
  transits: TransitHit[]
): TransitHit | null {
  // pick all transits active on this date
  const hitsToday = transits.filter(
    (t) => t.startISO <= dateISO && t.endISO >= dateISO
  );
  if (!hitsToday.length) return null;

  // sort by strength descending
  hitsToday.sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
  const best = hitsToday[0];

  // treat as "strong" only above threshold
  if ((best.strength ?? 0) < 0.5) return null;
  return best;
}
function buildTransitLine(
  i: number,
  strong: TransitHit,
  dateISO: string
): string {
  // Derive category safely
  const cat = (strong?.category || "").toLowerCase();

  const templates: Array<(area: string) => string> = [
  (area) =>
    `Today invites focused attention toward ${area}.`,
  (area) =>
    `This is a good day to move steadily within ${area}.`,
  (area) =>
    `Energy today supports calm, thoughtful progress around ${area}.`,
];


  // Decide focus area
  const area =
    cat === "career"
      ? "career and long-term direction"
      : cat === "relationships"
      ? "relationships and emotional balance"
      : cat === "health"
      ? "health, routines, and wellbeing"
      : cat === "inner"
      ? "inner balance and emotional clarity"
      : "your daily priorities";

  // Rotate template by index so lines don't repeat
  const template = templates[i % templates.length];

  return template(area);
}



function buildDailyFromMoonAndTransits(
  dailyMoon: DailyMoonEntry[],
  transits: TransitHit[],
  startDateISO: string,
  days: number,
  tz?: string
): DailyHighlight[] {
  const out: DailyHighlight[] = [];

  const startBase =
    parseISODateLoose(startDateISO) ??
    parseISODateLoose(new Date().toISOString().slice(0, 10)) ??
    new Date();

  const clampedDays = Math.max(1, Math.min(days, 14));
  const tzSafe = String(tz ?? "Asia/Dubai");

  // track last day's strongest transit key to reduce repetition
  let lastTransitKey = "";

  for (let i = 0; i < clampedDays; i++) {
    const day = addDaysLoose(startBase, i);

    // 1) Date for lookup in correct timezone
    const dateISO = isoDateInTz(day, tzSafe);

    // 2) UTC fallback (some sources may store dailyMoon in UTC)
    const dateISO_utc = day.toISOString().slice(0, 10);

    const m =
      dailyMoon.find((x) => x.dateISO === dateISO) ??
      dailyMoon.find((x) => x.dateISO === dateISO_utc);

    // -----------------------------
    // Deterministic nakshatra (if we have longitude)
    // -----------------------------
    let nak = "";
    const rawLon = Number(
      (m as any)?.siderealLongitude ??
        (m as any)?.siderealLon ??
        (m as any)?.siderealDeg ??
        (m as any)?.moonSiderealLongitude ??
        (m as any)?.moonSiderealLon ??
        (m as any)?.moonSiderealDeg ??
        (m as any)?.moonLonSidereal ??
        (m as any)?.moonLon ??
        (m as any)?.lon ??
        (m as any)?.deg
    );

    if (Number.isFinite(rawLon)) {
      // Guard: if value looks like radians (0..~6.28), convert to degrees
      const v = rawLon;
      const deg = v > 0 && v < 7 ? (v * 180) / Math.PI : v;

      // normalize to 0..360
      const moonDegTropical = ((deg % 360) + 360) % 360;

// If the source field is not explicitly sidereal, convert it
const cameFromSiderealField =
  (m as any)?.siderealLongitude != null ||
  (m as any)?.siderealLon != null ||
  (m as any)?.siderealDeg != null ||
  (m as any)?.moonSiderealLongitude != null ||
  (m as any)?.moonSiderealLon != null ||
  (m as any)?.moonSiderealDeg != null ||
  (m as any)?.moonLonSidereal != null;

const moonDeg = cameFromSiderealField
  ? moonDegTropical
  : toSidereal(moonDegTropical, day); // IMPORTANT: use the day object you already have in the loop

nak = nakshatraFromDegASCII(moonDeg).name;

    } else {
      const fallbackNak =
        (m as any)?.moonNakshatraName ||
        (m as any)?.moonNakshatra ||
        (m as any)?.nakshatraName ||
        (m as any)?.nakshatra ||
        null;

      if (typeof fallbackNak === "string" && fallbackNak.trim()) {
        nak = fallbackNak.trim();
      }
    }

    // -----------------------------
    // House-from-Moon / relative house (safe)
    // -----------------------------
    const relHouse =
      typeof (m as any)?.relativeHouseFromMoon === "number"
        ? (m as any).relativeHouseFromMoon
        : typeof (m as any)?.houseFromMoon === "number"
        ? (m as any).houseFromMoon
        : null;

    const houseText = houseFocusFromMoon(
      typeof relHouse === "number" ? relHouse : undefined
    );

    // -----------------------------
    // Base day text (varied)
    // -----------------------------
    const openers = [
      "Keep choices simple today — one priority, one action.",
      "Move a little slower than usual and notice what truly needs attention.",
      "A good day to tidy something small that has been pending.",
      "Stay present in conversations; a soft tone goes further than force.",
      "Focus on steady progress, not speed — small steps compound.",
      "Protect your energy: fewer tasks, cleaner boundaries.",
      "Ground yourself first, then respond — don’t react.",
    ];

    const tips = [
      "Choose one thing to finish, then stop.",
      "Say less, listen more.",
      "Avoid rushing decisions.",
      "Keep spending conservative and practical.",
      "Do one body-friendly reset: walk, hydration, early sleep.",
      "Handle the most annoying small task first.",
      "Simplify your schedule and reduce noise.",
    ];

    const opener = openers[i % openers.length];
    const tip = tips[(i * 2) % tips.length];

    const houseLine =
      typeof relHouse === "number" && relHouse >= 1 && relHouse <= 12
        ? `Emotional focus leans toward ${houseText}.`
        : "Keep your emotional tone steady and practical.";

    // Premium nakshatra micro-layer (short + optional)
    const nakLine = nak ? `Moon is in ${nak} — keep your choices clean and intentional.` : "";

    let text = [opener, houseLine, nakLine, tip].filter(Boolean).join(" ");

    // -----------------------------
    // Strongest transit overlay (reduce repetition)
    // IMPORTANT: use dateISO (tz-safe) for matching
    // -----------------------------
    const strong = chooseStrongTransitForDay(dateISO, transits);

    if (strong) {
      const key = `${strong.planet}|${strong.target}|${strong.category}`;
      const sameAsYesterday = key === lastTransitKey;

      if (sameAsYesterday) {
        text += " Keep actions simple — you can get a lot done without overthinking it.";
      } else {
        text += ` ${buildTransitLine(i, strong, dateISO)}`;
      }

      lastTransitKey = key;
    }

    out.push({ dateISO, text });
  }

  return out;
}

function decodeJsonString(s: string) {
  try {
    // handles escaped quotes, \n, etc.
    return JSON.parse(`"${String(s).replace(/"/g, '\\"')}"`);
  } catch {
    return s;
  }
}
function hideMathyDailyEvidence(raw: string) {
  const s = String(raw ?? "");

  // Remove common evidence prefixes if the AI echoes them
  return s
    .replace(/Transit Moon nakshatra:\s*[^.]+\.?\s*/gi, "")
    .replace(/Transit Moon is\s*\d+\s*from natal Moon\.?\s*/gi, "")
    .replace(/Strongest transit:\s*[^.]+\.?\s*/gi, "")
    .replace(/Transit strength:\s*\d+%\.?\s*/gi, "")
    .replace(/Focus area:\s*[^.]+\.?\s*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractTimelineText(raw: any): string {
  const t = String(raw ?? "").trim();
  if (!t) return "";

  // If it *looks* like JSON or contains JSON keys, try to parse
  const looksJson =
    /^[\[{]/.test(t) || /"title"\s*:|"text"\s*:|"nextStep"\s*:|"source"\s*:/.test(t);

  if (looksJson) {
    // 1) Try JSON.parse first
    try {
      const obj = JSON.parse(t);

      // If server returned { text: "..." }
      if (obj && typeof obj === "object" && typeof (obj as any).text === "string") {
        return String((obj as any).text);
      }

      // If server returned { narrative: "...", windows: [...] }
      if (obj && typeof obj === "object" && typeof (obj as any).narrative === "string") {
        return String((obj as any).narrative);
      }

      // If server returned array of blocks
      if (Array.isArray(obj)) {
        const joined = obj
          .map((x) => (typeof x === "string" ? x : x?.text || x?.title || ""))
          .filter(Boolean)
          .join(" ");
        if (joined.trim()) return joined.trim();
      }

      // Fallback: if it's still an object, try common fields
      if (obj && typeof obj === "object") {
        const parts: string[] = [];
        const o: any = obj;
        if (o.title) parts.push(String(o.title));
        if (o.text) parts.push(String(o.text));
        if (o.nextStep) parts.push(String(o.nextStep));
        if (Array.isArray(o.items)) {
          parts.push(
            o.items
              .map((it: any) => it?.text || it?.title || "")
              .filter(Boolean)
              .join(" ")
          );
        }
        if (parts.join(" ").trim()) return parts.join(" ").trim();
      }
    } catch {
      // 2) If JSON.parse fails, regex-pull the "text":"..." fields
      const chunks: string[] = [];
      const re = /"text"\s*:\s*"([^"]+)"/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(t))) {
        chunks.push(decodeJsonString(m[1]));
      }
      const joined = chunks.map((x) => x.trim()).filter(Boolean).join(" ");
      if (joined.trim()) return joined.trim();
    }
  }

  // Not JSON: return as-is
  return t;
}

function sentenceCase(s: string) {
  const t = String(s ?? "").trim();
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// Keep a string to a max length, end at a clean boundary when possible
function trimToSentence(s: string, maxLen = 180) {
  const t = String(s ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  if (t.length <= maxLen) return t;

  const cut = t.slice(0, maxLen);

  // Prefer ending at punctuation
  const lastPunct = Math.max(
    cut.lastIndexOf("."),
    cut.lastIndexOf("!"),
    cut.lastIndexOf("")
  );
  if (lastPunct > 80) return cut.slice(0, lastPunct + 1).trim();

  // Else end at last space
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > 80) return cut.slice(0, lastSpace).trim() + "";

  return cut.trim() + "";
}

function parseTimelineWindows(raw: string) {
  const text = String(raw ?? "")
    .replace(/\u0000/g, "")
    .replace(/\u2022/g, "") // normalize bullets
    .replace(/\s+\n/g, "\n")
    .trim();

  const windows: Array<{
    label: string;
    start: string;
    end: string;
    domain?: string;
  }> = [];

  // 1) Primary: bullet lines that contain a date range in parentheses
  // Supports: ?, ->, , , to
  // Example:
  // - Jupiter ï¿½ Moon (2026-01-01 -> 2026-02-15) [career]

  const reRange =
  /(?:^|\n)\s*[-ï¿½*]?\s*([^\n(]+?)\s*\(\s*(\d{4}-\d{2}-\d{2})\s*(?:\?|->|ï¿½|ï¿½|to)\s*(\d{4}-\d{2}-\d{2})\s*\)\s*(?:\[\s*([^\]]+?)\s*\])?\s*(?=\n|$)/gi;

  let m: RegExpExecArray | null;
  while ((m = reRange.exec(text))) {
    const label = (m[1] ?? "").trim();
    const start = (m[2] ?? "").trim();
    const end = (m[3] ?? "").trim();
    const domain = (m[4] ?? "").trim() || undefined;

    if (label && start && end) {
      windows.push({ label, start, end, domain });
    }
  }

  // 2) Secondary: if your text has "Window: YYYY-MM-DD ï¿½ YYYY-MM-DD"
  // (helps when GPT output format changes)
  const reInline =
  /(?:window|period|phase)\s*[:\-]\s*([^\n:]+?)\s*(\d{4}-\d{2}-\d{2})\s*(?:\?|->|ï¿½|ï¿½|to)\s*(\d{4}-\d{2}-\d{2})/gi;

  while ((m = reInline.exec(text))) {
    const label = (m[1] ?? "").trim();
    const start = (m[2] ?? "").trim();
    const end = (m[3] ?? "").trim();
    if (label && start && end) windows.push({ label, start, end });
  }

  // Remove parsed window lines from narrative so we dont show them twice
  const narrative = text
    .replace(reRange, "\n")
    .replace(reInline, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  return { windows, narrative };
}

function toShortBullets(narrative: string) {
  const s = String(narrative ?? "").replace(/\s+/g, " ").trim();
  if (!s) return [];

  // Split into sentences
  const sentences = s
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter(Boolean);

  if (!sentences.length) return [];

  // Strong preference for "action + clarity" lines
  const score = (x: string) => {
    let v = 0;

    // action cues
    if (/(pick|choose|do|act|start|plan|delay|avoid|focus|protect|simplify|commit|negotiate|close|reset)/i.test(x)) v += 3;

    // structure cues: Next step, Rule, Use
    if (/(next step|rule of thumb|use this|best window|caution|during stronger windows)/i.test(x)) v += 2;

    // penalty: overly vague filler
    if (/(in this phase|push you|asks you|more awareness|background storyline)/i.test(x)) v -= 1;

    // penalty: too long
    if (x.length > 220) v -= 1;

    return v;
  };

  const ranked = [...sentences].sort((a, b) => score(b) - score(a));

  const chosen = ranked.slice(0, 3);

  return chosen
    .map((x) => sentenceCase(trimToSentence(x, 170)))
    .filter(Boolean);
}

// ---------------- Daily highlights helper (client-side) ----------------
function relatableMoodText(mood: string, key: string) {
  const m = String(mood || "balanced").toLowerCase();
  const lines: Record<string, string[]> = {
    uplifting: [
      "Youll feel lighter and more open today  things dont feel as heavy.",
      "Confidence is easier to access today. Youll want to move forward.",
      "Mood lifts when you keep things simple  dont overcomplicate it.",
    ],
    heavy: [
      "You may feel more sensitive than usual  small things can feel bigger.",
      "Emotions may run closer to the surface today. Give yourself space.",
      "If you feel irritated, its likely overstimulation  slow down your pace.",
    ],
    restless: [
      "Your mind may jump between tasks  focus will need intention.",
      "You might feel impatient today. Reduce distractions and keep it clean.",
      "Restlessness fades when you commit to one thing at a time.",
    ],
    introspective: [
      "Youll want quiet and fewer people today  protect your mental space.",
      "You may reflect more than usual. Dont force answers  observe.",
      "Good day for inner clarity  choose depth over noise.",
    ],
    clear: [
      "Youll feel clear-headed  decisions become simpler today.",
      "Good day to organize thoughts and act with precision.",
      "Clarity grows when you do one thing properly from start to finish.",
    ],
    balanced: [
      "Even-paced day  nothing extreme, but small wins compound.",
      "Steady mood today. Youll do best with a simple, clean plan.",
      "Neutral energy  consistency will carry you.",
    ],
  };

  const pool = lines[m] || lines.balanced;
  return pickKey(pool, key + "::mood");
}

function relatableGuidanceText(focusLower: string, mood: string, flavor: string, key: string) {
  const f = String(focusLower || "").toLowerCase();
  const m = String(mood || "balanced").toLowerCase();

  // Relationship style
  const rel = [
    "Today you may notice youre reading people more deeply  dont assume, ask.",
    "If something feels off, say it softly. Clarity beats silent overthinking.",
    "One calm message can change the whole day. Keep it simple and kind.",
    "If you feel reactive, pause 3 seconds before replying  it prevents regret.",
  ];

  // Career style
  const career = [
    "Youll feel better after completing one task fully  finish something end-to-end.",
    "Dont try to do everything. Pick the hardest thing first and close it cleanly.",
    "A short update to the right person will unblock your day  send it early.",
    "Avoid scattered effort today. One finished task beats five started.",
  ];

  // Health style
  const health = [
    "Your body will ask for simplicity today  lighter food, more water, less noise.",
    "Energy improves fast if you move a bit. Even a short walk resets you.",
    "If you feel tired, dont push harder  reduce stimulation and pace yourself.",
    "Keep the day gentle. Your system responds better to calm routines today.",
  ];

  // Inner style
  const inner = [
    "You may feel thoughts looping today  name one worry, then take one small action.",
    "If you feel stuck, do something physical (walk / tidy / shower)  it clears the mind.",
    "Dont chase certainty today. One grounded step is enough.",
    "If emotions rise, pause, breathe, then act. Clarity comes after the pause.",
  ];

  const general = [
    "Keep it simple today: one priority, one clean action  youll feel more in control.",
    "Small improvements compound today. Do one thing properly and stop.",
    "If you feel pulled in many directions, choose one lane and stay there.",
    "Steady day  dont rush. Nudge things forward gently and consistently.",
  ];

  const pool =
    f.includes("relationships") ? rel :
    f.includes("career") ? career :
    f.includes("health") ? health :
    f.includes("inner") ? inner :
    general;

  // small overlay if transit flavor suggests pressure
  const overlays: Record<string, string[]> = {
    intense: [
      "If pressure builds, reduce talking and increase action.",
      "Strong day  avoid impulsive decisions. Slow is smart.",
    ],
    soft: [
      "Soft day  warmth works better than force.",
      "Gentle tone wins today  let things unfold naturally.",
    ],
    generic: [""],
  };

  const base = pickKey(pool, key + "::guide");
  const add = pickKey(overlays[flavor] || overlays.generic, key + "::overlay");
  return add ? `${base} ${add}` : base;
}

function inferMoodFromFacts(facts: string[], confidence: "high" | "medium" | "low") {
  const focusRaw =
    facts.find((x) => x.toLowerCase().includes("focus area:")) || "";
  const focus = focusRaw.split(":").slice(1).join(":").trim().toLowerCase();

  const strengthRaw =
    facts.find((x) => x.toLowerCase().includes("transit strength:")) || "";
  const pct = Number((strengthRaw.match(/(\d+)%/) || [])[1] || 0);

  // Simple, user-friendly emotional weather rules
  if (pct >= 75) {
    if (focus.includes("relationships"))
      return { mood: "Emotionally charged", moodText: "You may feel reactive or extra sensitive  respond slowly." };
    if (focus.includes("career"))
      return { mood: "Intense but productive", moodText: "Pressure is higher, but you can make real progress." };
    if (focus.includes("health"))
      return { mood: "Body-first day", moodText: "Energy fluctuates  keep routine clean and steady." };
    return { mood: "High signal day", moodText: "Youll feel the day strongly  keep choices simple and conscious." };
  }

  if (pct >= 55) {
    if (focus.includes("relationships"))
      return { mood: "Warm + social", moodText: "Good for conversations  clarity comes from listening first." };
    if (focus.includes("career"))
      return { mood: "Focused", moodText: "A steady, get-things-done mood  avoid distractions." };
    if (focus.includes("health"))
      return { mood: "Resetting", moodText: "Good for cleanup habits  small improvements help a lot." };
    return { mood: "Balanced", moodText: "Not heavy, not flat  best used for simple wins." };
  }

  // low strength / low signal days
  if (confidence === "low")
    return { mood: "Low signal", moodText: "Nothing major  keep it light and avoid overthinking." };

  return { mood: "Calm", moodText: "A quieter day emotionally  perfect for consistency." };
}

type DailyHighlight = { dateISO: string; text: string; doLine?: string; dontLine?: string };

// must match /api/ai-daily/route.ts
type DailyFeature = {
  dateISO: string;
  moonNakshatra: string | null;      // e.g. "Swati"
  houseFromMoon: number | null;      // 1..12 relative to natal Moon
  focusArea: string;                 // "career", "home & family", etc.
  strongestTransit?: {
    transitPlanet: string;
    natalPlanet: string;
    aspect: string;                  // "conjunction", "square", etc.
    category: "career" | "relationships" | "health" | "inner" | "general";
    strength: number;
    window?: { startISO: string; endISO: string };
  } | null;
};

// shape coming back from sweDailyMoon
type DailyMoonEntry = {
  dateISO: string;
  moonNakshatra?: string | null;
  nakshatra?: string;
  nakshatraName?: string;
  houseFromMoon?: number | null;
  relativeHouseFromMoon?: number | null;
};

function houseToFocusArea(house: number | null | undefined): string {
  if (house == null) return "your regular routines";

  switch (house) {
    case 1:
      return "your body, energy and overall mood";
    case 2:
      return "finances, food and daily security";
    case 3:
      return "communication, emails and short tasks";
    case 4:
      return "home, family and emotional grounding";
    case 5:
      return "creativity, self-expression and children";
    case 6:
      return "work routines, health and service";
    case 7:
      return "partnerships and one-to-one relations";
    case 8:
      return "deep emotions, shared resources and detox";
    case 9:
      return "learning, beliefs and long-term vision";
    case 10:
      return "your role, responsibilities and how others see you";
    case 11:
      return "friends, networks and gains";
    case 12:
      return "rest, retreat and inner processing";
    default:
      return "your regular routines";
  }
}
// --- Small date helpers used by daily highlights ---
// Parse "YYYY-MM-DD" into a Date in a safe, null-tolerant way.
function parseISODateLoose(s?: string | null): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
}
function coerceTz(value: any, fallback: string): string {
  // Accept IANA TZ ("Asia/Dubai") or GMT offsets ("+04:00")
  if (typeof value === "string") {
    const s = value.trim();
    if (s) return s;
  }
  return fallback;
}


// Add N days to a Date and return a new Date
function addDaysLoose(d: Date, days: number): Date {
  const nd = new Date(d.getTime());
  nd.setUTCDate(nd.getUTCDate() + days);
  return nd;
}

function buildDailyFeatures(
  dailyMoon: DailyMoonEntry[],
  transits: TransitHit[],
  startDateISO: string,
  days: number,
  tz?: string
): DailyFeature[] {

  const startBase =
    parseISODateLoose(startDateISO) ??
    parseISODateLoose(new Date().toISOString().slice(0, 10)) ??
    new Date();

  const clampedDays = Math.max(1, Math.min(days, 14));
  const out: DailyFeature[] = [];
  const tzSafe = String(tz ?? "Asia/Dubai");
  for (let i = 0; i < clampedDays; i++) {
    const day = addDaysLoose(startBase, i);
    const dateISO = isoDateInTz(day, tzSafe);

    const m = dailyMoon.find((x) => x.dateISO === dateISO);

    // Try ALL the possible field names we've ever used
    const moonNakshatra =
      (m as any)?.moonNakshatra ??
      (m as any)?.nakshatraName ??
      (m as any)?.nakshatra ??
      null;

    const houseFromMoon =
      (m as any)?.houseFromMoon ??
      (m as any)?.relHouseFromMoon ??
      (m as any)?.relativeHouseFromMoon ??
      null;

    // strongest transit active on this day (if any)
    const dayTransits = transits.filter(
      (t) => t.startISO <= dateISO && t.endISO >= dateISO
    );

    const strongest =
      dayTransits.length > 0
        ? dayTransits.reduce((best, cur) =>
            cur.strength > best.strength ? cur : best
          )
        : null;

        // Primary focus comes from Moon house; transit is secondary
    const focusArea = houseToFocusArea(
      typeof houseFromMoon === "number" ? houseFromMoon : null
    );

    const strongestTransit = strongest
      ? {
          transitPlanet: strongest.planet,
          natalPlanet:
            typeof strongest.target === "string"
              ? strongest.target.replace(/^.*natal\s+/i, "") ||
                "a natal point"
              : "a natal point",
          aspect:
            typeof strongest.target === "string"
              ? (strongest.target.split(" ")[0] || "alignment").toLowerCase()
              : "alignment",
          category: strongest.category,
          strength: strongest.strength,
          window: {
            startISO: strongest.startISO,
            endISO: strongest.endISO,
          },
        }
      : null;

    out.push({
      dateISO,
      moonNakshatra,
      houseFromMoon:
        typeof houseFromMoon === "number" ? houseFromMoon : null,
      focusArea,
      strongestTransit,
    });
  }

  return out;
}


function buildDailyFallbackFromFeatures(features: DailyFeature[]): DailyHighlight[] {
  return features.map((d) => {
    const nk = d.moonNakshatra ?? "this nakshatra";
    const focus = d.focusArea || "your regular routines";

    const base =
      `Today the Moon moves through ${nk}, gently highlighting ${focus}.`;

    let extra = "";
    const st = d.strongestTransit;
    if (st && st.strength >= 0.5) {
      extra =
        ` There is also an important ${st.category} theme from ` +
        `${st.transitPlanet} interacting with your natal ${st.natalPlanet}, ` +
        `so move with awareness and make small, conscious choices.`;
    }

    return {
      dateISO: d.dateISO,
      text: base + extra,
    };
  });
}

/* --- Time zone helpers (no libs) --- */

function parseGmtOffsetMinutes(label: string): number | undefined {
  const m = /GMT([+-]\d{1,2})(?::?(\d{2}))?/.exec(label);
  if (!m) return;
  const h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  return h * 60 + (h >= 0 ? min : -min);
}

function tzOffsetMinutesAt(tz: string, probeUtc: Date): number {
  const s = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    timeZoneName: "shortOffset",
  }).format(probeUtc);
  return parseGmtOffsetMinutes(s) ?? 0;
}

/** Build the UTC Date that corresponds to local dISO + HH:mm in tz. */
function makeUtcInstant(dISO: string, hhmm: string, tz: string): Date {
  const [H, M] = hhmm.split(":").map(Number);
  const pretendedUtc = new Date(
    Date.UTC(
      +dISO.slice(0, 4),
      +dISO.slice(5, 7) - 1,
      +dISO.slice(8, 10),
      H,
      M,
      0,
      0
    )
  );
  const off = tzOffsetMinutesAt(tz, pretendedUtc);
  return new Date(pretendedUtc.getTime() - off * 60_000);
}

// --- weekday from yyyy-mm-dd (local calendar date, tz-agnostic) ---

function weekdayFromISODate(iso: string): string | undefined {
  // iso must be "YYYY-MM-DD"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;

  // Use noon UTC to avoid edge cases around DST/offsets
  const d = new Date(`${iso}T12:00:00Z`);

  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d);
}

// Normalizes weird encoding, stray symbols, and spacing
function normalizeText(input: string): string {
  if (!input) return "";

  return input
    .replace(/[?]/g, "")                 // remove replacement chars
    .replace(/\s+/g, " ")                // normalize whitespace
    .replace(/\u00A0/g, " ")             // non-breaking spaces
    .replace(/\s+([.,!?])/g, "$1")       // fix spacing before punctuation
    .trim();
}
function normalizeHighlightText(raw: string, i: number): string {
  // 1) Normalize encoding + spacing
  let s = String(raw ?? "");
  s = fixWeirdEncoding(s);
  s = sanitizeText(s);
  s = cleanText(s);

  // 2) Kill the exact repeated nudge line (anywhere, even mid paragraph)
  s = s.replace(
    /\s*(A\s+noticeable\s+transit\s+from\s+Venus\s+to\s+conjunction\s+natal\s+Venus\s+is\s+active\s+\s*treat\s+it\s+as\s+a\s+nudge\s+for\s+small,\s+conscious\s+adjustments\s+rather\s+than\s+big,\s+impulsive\s+moves\.?)\s*/gi,
    " "
  );

  // 3) Also remove similar variants (slightly different wording)
  s = s.replace(
    /\s*(A\s+noticeable\s+transit\s+from\s+Venus[^.]{0,140}?\s+is\s+active\s+\s*treat\s+it\s+as\s+a\s+nudge[^.]*\.?)\s*/gi,
    " "
  );

  // 4) Add a rotating ending so each day doesn't feel cloned
  const endings = [
    "Keep it simple: one priority, one action.",
    "Go steadysmall improvements beat big reactions.",
    "Choose clarity over speed today.",
    "Do one useful thing and stop there.",
    "Slow down before you reply or decide.",
    "Pick one adjustment and repeat it.",
    "Less drama, more precision.",
  ];

  s = s.replace(/\s+/g, " ").trim();

  // Only append an ending if we actually removed the repeated line
  // (so we dont bloat good text)
  const removedSomething =
    /Venus\s+to\s+conjunction\s+natal\s+Venus/i.test(String(raw ?? "")) &&
    !/Venus\s+to\s+conjunction\s+natal\s+Venus/i.test(s);

  if (removedSomething) {
    s = `${s} ${endings[i % endings.length]}`.trim();
  }

  return s;
}

/* ---------------- Sidereal degree helpers for planets ---------------- */

const guessSiderealDegFrom = (pl: PlanetRow): number | undefined => {
  // 1) If backend already gave a sidereal degree, trust it fully.
  const sid =
    typeof (pl as any).__siderealDeg === "number"
      ? (pl as any).__siderealDeg
      : undefined;
  if (sid !== undefined && Number.isFinite(sid)) {
    return wrap360(sid);
  }

  // 2) Otherwise fall back to a best-effort guess from `deg` + sign.
  const raw =
    typeof (pl as any).deg === "number" ? (pl as any).deg : undefined;
  if (raw === undefined || !Number.isFinite(raw)) return undefined;

  const signIdx = signIndexFromName(pl?.sign);

  // Case: raw is 0?30 = within sign, use sign index to build 0?360
  if (raw >= 0 && raw < 30 && signIdx >= 0) {
    return wrap360(signIdx * 30 + raw);
  }

  // Case: raw looks already 0?360 sidereal and matches sign
  if (signIdx >= 0 && signIndexFromDeg(raw) === signIdx) {
    return wrap360(raw);
  }

  // 3) Last resort: treat raw as tropical and subtract Lahiri ayanamsa
  const sidGuess = wrap360(raw - AYANAMSA_LAHIRI_APPROX);
  if (signIdx >= 0 && signIndexFromDeg(sidGuess) === signIdx) {
    return sidGuess;
  }

  // If we can't be clever, still return the guess ï¿½ better than nothing
  return sidGuess;
};
const PLANET_PRACTICE: Record<
  string,
  { strength: string; pressure: string; action: string }
> = {
  Sun: {
    strength: "Leadership, clarity, and long-term purpose.",
    pressure: "Over-responsibility or rigidity when outcomes matter.",
    action: "Decide one priority for the week and say no to one distraction.",
  },
  Moon: {
    strength: "Emotional intelligence, creativity, and intuition.",
    pressure: "Mood-driven decisions or withdrawing when overloaded.",
    action: "Protect sleep + take 10 minutes of quiet reset daily.",
  },
  Mars: {
    strength: "Courage, initiative, and decisive action.",
    pressure: "Impatience, conflict, or forcing outcomes too early.",
    action: "Channel energy into one measurable task; avoid multitasking fights.",
  },
  Mercury: {
    strength: "Learning, strategy, communication, and problem-solving.",
    pressure: "Overthinking, anxiety, or mental restlessness.",
    action: "Write the plan in 5 bullets; then execute step 1 today.",
  },
  Jupiter: {
    strength: "Growth, mentorship, faith, and higher meaning.",
    pressure: "Over-promising or waiting for perfect confidence.",
    action: "Pick one skill to deepen for 30 days; track progress weekly.",
  },
  Venus: {
    strength: "Harmony, relationships, taste, and value alignment.",
    pressure: "People-pleasing or comfort spending.",
    action: "Set one boundary + one delight habit that doesn't cost much.",
  },
  Saturn: {
    strength: "Discipline, endurance, and mastery through structure.",
    pressure: "Fear, delay-frustration, or self-criticism.",
    action: "Build a routine: same time, small steps, 5 days/week.",
  },
  Rahu: {
    strength: "Ambition, innovation, and breakthrough hunger.",
    pressure: "Restlessness, obsession, or shortcuts.",
    action: "Choose 1 bold goal, but add 1 safety rule you won't break.",
  },
  Ketu: {
    strength: "Detachment, insight, spiritual intelligence.",
    pressure: "Disengagement or why bother phases.",
    action: "Do one grounding ritual daily (walk, breathwork, prayer, journaling).",
  },
};

/* ---------------- Dignity & friends ---------------- */

const EXALT: Record<string, string> = {
  Sun: "Aries",
  Moon: "Taurus",
  Mars: "Capricorn",
  Mercury: "Virgo",
  Jupiter: "Cancer",
  Venus: "Pisces",
  Saturn: "Libra",
  Rahu: "Taurus",
  Ketu: "Scorpio",
};
const DEBIL: Record<string, string> = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mars: "Cancer",
  Mercury: "Pisces",
  Jupiter: "Capricorn",
  Venus: "Virgo",
  Saturn: "Aries",
  Rahu: "Scorpio",
  Ketu: "Taurus",
};
const OWN: Record<string, string[]> = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mars: ["Aries", "Scorpio"],
  Mercury: ["Gemini", "Virgo"],
  Jupiter: ["Sagittarius", "Pisces"],
  Venus: ["Taurus", "Libra"],
  Saturn: ["Capricorn", "Aquarius"],
  Rahu: [],
  Ketu: [],
};

function dignity(planet: string, sign?: string) {
  if (!sign) return { tag: "", weight: 0 };
  if (EXALT[planet] === sign) return { tag: "Exalted", weight: +2 };
  if ((OWN[planet] || []).includes(sign)) return { tag: "Own sign", weight: +1 };
  if (DEBIL[planet] === sign) return { tag: "Debilitated", weight: -2 };
  return { tag: "Neutral", weight: 0 };
}

const FRIENDS: Record<
  string,
  { friends: string[]; enemies: string[]; neutral: string[] }
> = {
  Sun: {
    friends: ["Moon", "Mars", "Jupiter"],
    enemies: ["Venus", "Saturn"],
    neutral: ["Mercury", "Rahu", "Ketu"],
  },
  Moon: {
    friends: ["Sun", "Mercury", "Jupiter"],
    enemies: [],
    neutral: ["Mars", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"],
  },
  Mars: {
    friends: ["Sun", "Moon", "Jupiter"],
    enemies: ["Mercury"],
    neutral: ["Venus", "Saturn", "Rahu", "Ketu"],
  },
  Mercury: {
    friends: ["Sun", "Venus"],
    enemies: ["Moon"],
    neutral: ["Mars", "Jupiter", "Saturn", "Rahu", "Ketu"],
  },
  Jupiter: {
    friends: ["Sun", "Moon", "Mars"],
    enemies: ["Venus", "Mercury"],
    neutral: ["Saturn", "Rahu", "Ketu"],
  },
  Venus: {
    friends: ["Mercury", "Saturn"],
    enemies: ["Sun", "Moon"],
    neutral: ["Mars", "Jupiter", "Rahu", "Ketu"],
  },
  Saturn: {
    friends: ["Mercury", "Venus"],
    enemies: ["Sun", "Moon"],
    neutral: ["Mars", "Jupiter", "Rahu", "Ketu"],
  },
  Rahu: {
    friends: ["Venus", "Saturn", "Mercury"],
    enemies: ["Sun", "Moon"],
    neutral: ["Mars", "Jupiter", "Ketu"],
  },
  Ketu: {
    friends: ["Venus", "Saturn", "Mercury"],
    enemies: ["Sun", "Moon"],
    neutral: ["Mars", "Jupiter", "Rahu"],
  },
};

function expectedTzForPlaceName(name?: string | null) {
  if (!name) return null;
  const s = name.toLowerCase();
  if (s.includes("india")) return "Asia/Kolkata";
  if (
    s.includes("united arab emirates") ||
    s.includes("uae") ||
    s.includes("dubai") ||
    s.includes("abu dhabi")
  )
    return "Asia/Dubai";
  return null;
}

function friendStatus(
  target: string,
  from: string
): "friendly" | "enemy" | "neutral" {
  const key = target[0].toUpperCase() + target.slice(1).toLowerCase();
  const f = FRIENDS[key];
  if (!f) return "neutral";
  if (f.friends.includes(from)) return "friendly";
  if (f.enemies.includes(from)) return "enemy";
  return "neutral";
}

function nakTheme(name?: string | null) {
  if (!name) return null;
  const map: Record<string, string> = {
    Ashwini: "Initiation, speed, healing",
    Bharani: "Discipline, bearing burdens",
    Krittika: "Cutting, purification, resolve",
    Rohini: "Growth, beauty, abundance",
    Mrigashira: "Curiosity, seeking",
    Ardra: "Intensity, catharsis",
    Punarvasu: "Renewal, return to goodness",
    Pushya: "Nurture, support",
    Ashlesha: "Intuition, binding",
    Magha: "Heritage, dignity",
    "Purva Phalguni": "Joy, creativity",
    "Uttara Phalguni": "Commitment, agreements",
    Hasta: "Skill, craftsmanship",
    Chitra: "Design, refinement",
    Swati: "Independence, flexibility",
    Vishakha: "Ambition, milestones",
    Anuradha: "Friendship, precision",
    Jyeshtha: "Protection, triumph",
    Mula: "Roots, radical truth",
    "Purva Ashadha": "Initiatives, persuasion",
    "Uttara Ashadha": "Endurance, dharma",
    Shravana: "Listening, learning",
    Dhanishta: "Rhythm, wealth",
    Shatabhisha: "Healing, sky",
    "Purva Bhadrapada": "Intensity, vows",
    "Uttara Bhadrapada": "Stability, depth",
    Revati: "Guidance, safe travel",
  };
  return map[name] ?? null;
}

/* ---- zodiac helpers for House ï¿½ Sign legend ---- */

function wrapIndex(i: number) {
  return ((i % 12) + 12) % 12;
}
function houseSignsFromAsc(ascSign?: string | null) {
  if (!ascSign) return null;
  const idx = SIGNS.findIndex(
    (s) => s.toLowerCase() === ascSign.toLowerCase()
  );
  if (idx === -1) return null;
  return Array.from({ length: 12 }, (_, i) => SIGNS[wrapIndex(idx + i)]);
}

/* ---------------- Simple house wheel ---------------- */

function houseToAngle(h: number) {
  const idx = ((h - 1) % 12 + 12) % 12;
  return (-90 + idx * 30) * (Math.PI / 180);
}

function PlanetWheelSVG({
  planets,
  ascSign,
}: {
  planets: PlanetRow[];
  ascSign?: string;
}) {
  const size = 260;
  const r = 110;
  const cx = size / 2;
  const cy = size / 2;
  const byHouse = new Map<number, PlanetRow[]>();
  planets.forEach((p) => {
    if (p.house && p.house >= 1 && p.house <= 12) {
      const arr = byHouse.get(p.house) ?? [];
      arr.push(p);
      byHouse.set(p.house, arr);
    }
  });
  return (
    <svg width={size} height={size} className="mx-auto block">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (-90 + i * 30) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        const signs = ascSign ? houseSignsFromAsc(ascSign) : null;
        const signAbbrev = signs ? signs[i].slice(0, 3).toUpperCase() : null;

        return (
          <g key={i}>
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.15"
            />
            <text
              x={cx + (r + 14) * Math.cos(angle)}
              y={cy + (r + 14) * Math.sin(angle)}
              fontSize="10"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              opacity="0.75"
            >
              {i + 1}
            </text>
            {signAbbrev && (
              <text
                x={cx + (r + 28) * Math.cos(angle)}
                y={cy + (r + 28) * Math.sin(angle)}
                fontSize="9"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                opacity="0.85"
              >
                {signAbbrev}
              </text>
            )}
            {ascSign && i === 0 && (
              <>
                <circle
                  cx={cx + (r - 22) * Math.cos(angle)}
                  cy={cy + (r - 22) * Math.sin(angle)}
                  r={10}
                  fill="currentColor"
                  fillOpacity="0.08"
                />
                <text
                  x={cx + (r - 22) * Math.cos(angle)}
                  y={cy + (r - 22) * Math.sin(angle)}
                  fontSize="9"
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="currentColor"
                >
                  ASC
                </text>
              </>
            )}
          </g>
        );
      })}

      {Array.from(byHouse.entries()).map(([h, plist]) => {
        const base = houseToAngle(h);
        return plist.map((p, idx) => {
          const rr = r - 18 - idx * 14;
          const x = cx + rr * Math.cos(base);
          const y = cy + rr * Math.sin(base);
          const initials = (p.name || "")
            .replace(/\s+/g, "")
            .slice(0, 2)
            .toUpperCase();
          return (
            <g key={`${h}-${p.name}-${idx}`}>
              <title>{`${p.name}${
                p.sign ? ` ï¿½ ${p.sign}` : ""
              }${p.house ? ` ï¿½ House ${p.house}` : ""}`}</title>
              <circle cx={x} cy={y} r={8} fill="currentColor" fillOpacity="0.1" />
              <circle
                cx={x}
                cy={y}
                r={8}
                stroke="currentColor"
                strokeOpacity="0.3"
                fill="none"
              />
              <text
                x={x}
                y={y}
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
              >
                {initials}
              </text>
            </g>
          );
        });
      })}
      <circle cx={cx} cy={cy} r={2} fill="currentColor" opacity={0.5} />
    </svg>
  );
}

/* ---------------- Normalizers ---------------- */

function normalizePlanets(anyList: any[]): PlanetRow[] {
  return (anyList || [])
    .map((p: any) => {
      const name =
        p?.name ??
        p?.planet ??
        p?.body ??
        (typeof p?.id === "string" ? p.id : undefined);
      const sign =
        p?.sign ??
        p?.signName ??
        p?.rasi ??
        p?.zodiac ??
        p?.zodiacSign ??
        p?.sign_label;
      const house =
        p?.house ??
        p?.houseId ??
        p?.bhava ??
        (typeof p?.houseIndex === "number" ? p.houseIndex + 1 : undefined);
      const nakshatra = p?.nakshatra ?? p?.nakshatraName ?? p?.star ?? p?.lunarMansion;

      const siderealDeg =
        toNum(p?.siderealLongitude) ??
        toNum(p?.sidereal_longitude) ??
        toNum(p?.sidereal_long) ??
        toNum(p?.siderealLon);

      const anyDeg =
        siderealDeg ??
        toNum(p?.longitude) ??
        toNum(p?.lon) ??
        toNum(p?.eclipticLongitude) ??
        toNum(p?.lambda) ??
        toNum(p?.deg);

      const row: PlanetRow = {
        name: name || "",
        sign: sign || "",
        house: typeof house === "number" ? house : undefined,
        nakshatra,
        note: p?.note ?? p?.dignity ?? p?.status ?? p?.strength,
      };

      if (anyDeg !== undefined) (row as any).deg = anyDeg;
      if (siderealDeg !== undefined) (row as any).__siderealDeg = siderealDeg;
      if (!name && !sign && !house) return null;
      return row;
    })
    .filter(Boolean) as PlanetRow[];
}

function pickPanchang(r: any): PanchangInfo | undefined {
  return r?.panchang ?? r?.ascendant?.panchang ?? r?.raw?.panchang ?? undefined;
}
function pickAspects(r: any): AspectRow[] {
  const a = r?.aspects ?? r?.raw?.aspects ?? r?.aspectList ?? r?.aspectsMap;
  return Array.isArray(a) ? (a as AspectRow[]) : [];
}
function pickPlanets(r: any): PlanetRow[] {
  const rawPlanetsAny =
    r?.planets ??
    r?.raw?.planets ??
    r?.chart?.planets ??
    r?.placements ??
    r?.raw?.placements ??
    [];
  return Array.isArray(rawPlanetsAny) ? normalizePlanets(rawPlanetsAny) : [];
}

/* ---------------- Personality synthesis ---------------- */

function buildPersonality(
  planets: PlanetRow[],
  aspects: AspectRow[],
  ascNakshatra?: string | null,
  moonNakshatra?: string | null
) {
  const incoming = new Map<string, AspectRow[]>();
  for (const a of aspects) {
    const to = (a?.to || "").trim();
    const from = (a?.from || "").trim();
    if (!to || !from) continue;
    const list = incoming.get(to) ?? [];
    list.push(a);
    incoming.set(to, list);
  }

  const describeTarget = (name: string, nak?: string) => {
    const theme = nakTheme(nak || "") || undefined;
    const inc = incoming.get(name) || [];
    const friendly: string[] = [];
    const enemy: string[] = [];
    const neutral: string[] = [];
    for (const a of inc) {
      const src = a.from;
      const status = friendStatus(name, src);
      const tag = `${src}${a.type ? ` (${a.type})` : ""}`;
      if (status === "friendly") friendly.push(tag);
      else if (status === "enemy") enemy.push(tag);
      else neutral.push(tag);
    }
    return { theme, friendly, enemy, neutral };
  };

  const out: { headline: string; bullets: string[] }[] = [];

  const asc = planets.find((p) => p.name.toLowerCase() === "ascendant");
  const moon = planets.find((p) => p.name.toLowerCase() === "moon");

  if (asc) {
    const d = describeTarget("Ascendant", ascNakshatra ?? asc.nakshatra);
    out.push({
      headline: `Ascendant  ${asc.sign}${
        asc.house ? `  House ${asc.house}` : ""
      }${ascNakshatra ? ` ï¿½ ${ascNakshatra}` : ""}`,
      bullets: [
        d.theme
          ? `Core vibe: ${d.theme}.`
          : `Core vibe shaped by ${asc.nakshatra || "asc. nakshatra"}.`,
        d.friendly.length
          ? `Supported by: ${d.friendly.join(", ")}.`
          : "Supported by: ?",
        d.enemy.length
          ? `Pressures from: ${d.enemy.join(", ")}.`
          : "Pressures from: ?",
      ],
    });
  }

  if (moon) {
    const d = describeTarget("Moon", moonNakshatra ?? moon.nakshatra);
    out.push({
      headline: `Moon - ${moon.sign}${
        moon.house ? ` - House ${moon.house}` : ""
      }${moonNakshatra ? ` - ${moonNakshatra}` : ""}`,
      bullets: [
        d.theme
          ? `Emotional style: ${d.theme}.`
          : `Emotional style tuned by ${moon.nakshatra || "moon nakshatra"}.`,
        d.friendly.length
  ? `Nourished by: ${d.friendly.join(", ")}.`
  : "Nourished by: sleep, solitude, music, and a consistent routine.",
d.enemy.length
  ? `Stressors: ${d.enemy.join(", ")}.`
  : "Stressors: overstimulation, irregular schedule, and emotional overload.",

      ],
    });
  }

  const keys = ["Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  for (const k of keys) {
    const p = planets.find((pl) => pl.name.toLowerCase() === k.toLowerCase());
    if (!p) continue;
    const d = describeTarget(k, p.nakshatra);
    out.push({
      headline: `${k} - ${p.sign}${
        p.house ? ` - House ${p.house}` : ""
      }${p.nakshatra ? ` - ${p.nakshatra}` : ""}`,
      bullets: (() => {
  const base = PLANET_PRACTICE[p.name] ?? {
    strength: "A meaningful life theme becomes active through this planet.",
    pressure: "Challenges show up when this planet is overused or ignored.",
    action: "Choose one small practice that aligns with your goals.",
  };

  const strength = `Strength: ${d.theme ? d.theme : base.strength}`;
  const support = d.friendly.length
  ? `Support: ${d.friendly.join(", ")} (helpful influences).`
  : ""; // <-- remove the fallback support line entirely

  const pressure = d.enemy.length
    ? `Pressure point: ${d.enemy.join(", ")} (areas to manage).`
    : `Pressure point: ${base.pressure}`;

  const action = `Do this: ${base.action}`;

  return [strength, pressure, support, action];
})(),

    });
  }

  return out;
}

/* ---- misc UI helpers ---- */

const fadeUp: any = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: "easeOut",
    },
  },
};

const fadeUpSmall: any = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: "easeOut",
    },
  },
};
const ACC_CARD =
  "rounded-2xl border border-white/15 bg-indigo-950/60 backdrop-blur-sm shadow-lg shadow-[0_0_40px_rgba(99,102,241,0.10)]";

const ACC_TEXT = "text-slate-100";
const ACC_MUTED = "text-slate-300/80";

const staggerContainer: any = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};


function toneColor(flag?: "caution" | "opportunity" | "mixed") {
  switch (flag) {
    case "opportunity":
      return "bg-emerald-500/10 text-emerald-100 border border-emerald-400/25";
    case "caution":
      return "bg-red-500/10 text-red-100 border border-red-400/25";
    default:
      return "bg-white/5 text-white/70 border border-white/15";
  }
}

function pctProgress(startISO: string, endISO: string) {
  const now = Date.now();
  const s = new Date(startISO).getTime();
  const e = new Date(endISO).getTime();
  if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return 0;
  return Math.max(0, Math.min(100, ((now - s) / (e - s)) * 100));
}
function DashaBar({
  label,
  start,
  end,
  subtitle,
}: {
  label: string;
  start: string;
  end: string;
  subtitle?: string;
}) {
  const pct = pctProgress(start, end);

  const startTxt = fixWeirdEncoding(
    new Date(start).toLocaleDateString("en-GB")
  );
  const endTxt = fixWeirdEncoding(
    new Date(end).toLocaleDateString("en-GB")
  );

  // Force a clean separator (never show "")
  const rangeTxt = `${startTxt}  ${endTxt}`.replace(/\s\?\s/g, "  ");

  return (
    <div className="rounded-xl border border-muted-foreground/20 p-3 bg-muted/40">
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="font-semibold">{label}</div>
        <div className="text-white/70 tabular-nums">{rangeTxt}</div>
      </div>

      {subtitle ? (
        <div className="text-xs text-white/70 mb-2">{subtitle}</div>
      ) : null}

      <div className="h-2 w-full rounded bg-muted overflow-hidden">
        <div
          className="h-2 bg-foreground/70"
          style={{ width: `${pct.toFixed(1)}%` }}
        />
      </div>

      <div className="text-[11px] text-white/70 mt-1">
        {pct.toFixed(1)}% complete
      </div>
    </div>
  );
}
function renderAiTextBlocks(raw: string) {
  const text = String(raw ?? "");
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  let para: string[] = [];
  let k = 0;

  const flushBullets = () => {
    if (!bullets.length) return;
    out.push(
      <ul key={`b${k++}`} className="list-disc pl-5 space-y-2">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    );
    bullets = [];
  };

  const flushPara = () => {
    const p = para.join(" ").trim();
    if (!p) return;
    out.push(
      <p key={`p${k++}`} className="whitespace-pre-wrap">
        {p}
      </p>
    );
    para = [];
  };

  for (const line0 of lines) {
    const line = String(line0 ?? "").replace(/\t/g, "  ").trimEnd();

    if (/^---+$/.test(line.trim())) {
      flushBullets();
      flushPara();
      out.push(<hr key={`hr${k++}`} className="border-white/15" />);
      continue;
    }

    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      flushBullets();
      flushPara();
      const level = h[1].length;
      const title = h[2].trim();
      out.push(
        <div
          key={`h${k++}`}
          className={
            level === 2
              ? "text-base font-semibold text-indigo-100 mt-4"
              : "text-sm font-semibold text-indigo-100 mt-3"
          }
        >
          {title}
        </div>
      );
      continue;
    }

    // bullet lines: "- " or " "
    const b =
      line.match(/^\-\s+(.*)$/) ||
      line.match(/^\\s+(.*)$/) ||
      line.match(/^\u2022\s+(.*)$/);

    if (b) {
      flushPara();
      bullets.push((b[1] ?? "").trim());
      continue;
    }

    if (!line.trim()) {
      flushBullets();
      flushPara();
      continue;
    }

    flushBullets();
    para.push(line.trim());
  }

  flushBullets();
  flushPara();

  return <div className="space-y-3">{out}</div>;
}

/* ---------- Tab prop types ---------- */

type MonthlyInsight = { label: string; text: string };

type TabTransitsProps = {
  transits: TransitHit[];
  loading: boolean;
  error: string | null;
  transitSummary: string;
  dailyHighlights: DailyHighlight[];
  dailyLoading: boolean;
  dailyError: string | null;
  mounted: boolean;
};

type TabMonthlyProps = {
  monthlyInsights: MonthlyInsight[];
  loading: boolean;
  error: string | null;
  mounted: boolean;
};

type TabWeeklyProps = {
  weeklyInsights: WeeklyInsight[];
  loading: boolean;
  error: string | null;
  mounted: boolean;
};
const cleanTransitText = (raw: string) => {
  const s = (raw || "").toString();

  // remove bold markers and stray markdown noise
  return s
    .replace(/\*\*/g, "")                 // **bold**
    .replace(/__+/g, "")                  // __bold__
    .replace(/^\s*#+\s*/gm, "")           // headings like ### Title
    .replace(/\n{3,}/g, "\n\n")           // collapse extra blank lines
    .trim();
};

/* ---------- Individual tab components ---------- */
const TabTransits: React.FC<TabTransitsProps> = memo(
  ({
    loading, // unused here now (12-month removed)
    error, // unused here now (12-month removed)
    transitSummary, // unused here now (12-month removed)
    dailyHighlights,
    dailyLoading: dailyLoadingProp,
    dailyError: dailyErrorProp,
    mounted,
  }) => {
    const list = Array.isArray(dailyHighlights) ? dailyHighlights : [];
    const visible = list.slice(0, 7);

    // Local guard: treat any “mostly junk” strings as unusable
    function isMostlyGarbage(s: string): boolean {
      const t = safeText(s);
      if (!t) return true;

      // if box/block chars somehow survive, treat as garbage
      if (/[\u2500-\u257F\u2580-\u259F\u25A0-\u25FF]/.test(t)) return true;

      // long repeated glyphs often indicate corruption
      if (/(.)\1{10,}/.test(t)) return true;

      const total = t.length || 1;
      const good =
        (t.match(/[A-Za-z0-9\u0600-\u06FF\u0900-\u097F]/g) ?? []).length;
      const ratioGood = good / total;

      // if very few letters/numbers, it’s probably junk
      return ratioGood < 0.35;
    }

    return (
      <div
        className={
          "space-y-4 transform transition-all duration-300 " +
          (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
        }
      >
        <Card className="rounded-2xl border border-indigo-400/15 bg-indigo-950/40 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold !text-slate-100">
              Today & next few days
            </CardTitle>
            <div className="text-xs text-white/70">
  Personalized from your natal Moon + current transits.
  <div className="text-xs text-white/60 mt-1">
    Guidance tuned for today — based on Moon placement + the strongest active transit.
  </div>
</div>

          </CardHeader>

          <CardContent className="space-y-3">
            {/* Loading */}
            {dailyLoadingProp && (
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                Loading next few days
              </div>
            )}

            {/* Error */}
            {!dailyLoadingProp && dailyErrorProp && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {safeText(dailyErrorProp)}
              </div>
            )}

            {/* Empty */}
            {!dailyLoadingProp && !dailyErrorProp && visible.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                No strong highlights for the next few days.
              </div>
            )}

            {/* Cards */}
            {!dailyLoadingProp && !dailyErrorProp && visible.length > 0 && (
              <div className="space-y-3">
                {visible.map((d, idx) => {
 const dateISO = String((d as any)?.dateISO ?? "").trim();



                  const dateLabel = (() => {
                    try {
                      if (!dateISO) return "";
                      const dt = new Date(dateISO + "T00:00:00");
                      if (Number.isNaN(dt.getTime())) return dateISO;
                      return dt.toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                    } catch {
                      return dateISO || "";
                    }
                  })();

                  // --- Pull + sanitize fields ---
const rawText = safeText((d as any)?.text ?? "");
const moodText = safeText((d as any)?.moodText ?? "");

// Headline fallback
const headlineRaw = safeText((d as any)?.headline ?? "");
const headline = headlineRaw || "Steady focus & small wins";

const conf = String((d as any)?.confidence ?? "").trim(); // "high" | "medium" | "low"
const doListRaw = Array.isArray((d as any)?.do) ? (d as any).do : [];
const avoidListRaw = Array.isArray((d as any)?.avoid) ? (d as any).avoid : [];

const pickText = (v: any) => {
  if (typeof v === "string") return safeText(v);
  if (v && typeof v === "object") {
    const t = (v.text ?? v.label ?? v.value ?? v.title ?? "") as any;
    if (typeof t === "string") return safeText(t);
  }
  return "";
};

const doList = doListRaw.map(pickText).filter(Boolean);
const avoidList = avoidListRaw.map(pickText).filter(Boolean);

// Remove moodText if it appears inside raw text (prevents repetition)
const textNoMood =
  moodText && rawText ? safeText(rawText.replace(moodText, "")) : rawText;

// Build a cleaned line from AI/local text
const finalLineRaw = fixQuotedGibberish(safeText(
  normalizeHighlightText(stripNakshatraClaims(textNoMood), idx)
));

const looksLikeInternalFacts = (s: string) =>
  /transit moon nakshatra:|strongest transit:|transit strength:|focus area:|from natal moon/i.test(s);

const finalLineCandidate =
  finalLineRaw && looksLikeInternalFacts(finalLineRaw) ? "" : finalLineRaw;

// ✅ final guard: if still garbage, force a clean fallback
const finalLine =
  !finalLineCandidate || isMostlyGarbage(finalLineCandidate)
    ? (moodText || "A steady day: keep it simple, choose one priority, and close loops.")
    : finalLineCandidate;


const confLabel =
  conf === "high" ? "High" : conf === "low" ? "Low" : "Medium";

const confClass =
  conf === "high"
    ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
    : conf === "low"
    ? "border-amber-400/25 bg-amber-500/10 text-amber-200"
    : "border-indigo-400/25 bg-indigo-500/10 text-indigo-200";

                  return (
                    <div
                      key={`${dateISO || "day"}-${idx}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-100">
                            {safeText(dateLabel)}
                          </div>
                          {dateISO && (
                            <div className="text-[11px] text-white/50">
                              {dateISO}
                            </div>
                          )}
                        </div>

                        <span
                          className={
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold " +
                            confClass
                          }
                        >
                          Confidence: {confLabel}
                        </span>
                      </div>

                      {/* Headline */}
                      {headline && (
                        <div className="mt-2 text-sm font-semibold text-white/90">
                          {headline}
                        </div>
                      )}
                     
                      {/* Main line */}
                      <div className="mt-2 text-sm leading-relaxed text-white/75">
                        {finalLine}
                      </div>

                      {/* Do / Avoid */}
                      {(doList.length > 0 || avoidList.length > 0) && (
                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          {doList.length > 0 && (
                            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                              <div className="text-[11px] font-semibold text-white/70">
                                DO
                              </div>
                              <ul className="mt-2 space-y-1 text-xs text-white/70">
                                {doList.slice(0, 4).map((x: string, i: number) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-white/40" />
                                    <span>{x}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {avoidList.length > 0 && (
                            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                              <div className="text-[11px] font-semibold text-white/70">
                                AVOID
                              </div>
                              <ul className="mt-2 space-y-1 text-xs text-white/70">
                                {avoidList.slice(0, 4).map((x: string, i: number) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-white/40" />
                                    <span>{x}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);

const TabMonthly: React.FC<TabMonthlyProps> = memo(
  ({ monthlyInsights, loading, error, mounted }) => {
    const hasData = Array.isArray(monthlyInsights) && monthlyInsights.length > 0;

    // First item = overview, rest = individual months (if present)
    const overview = hasData ? monthlyInsights[0] : null;
    const rest = hasData ? monthlyInsights.slice(1) : [];

    // Try to split overview into ?overview text? vs ?raw transit list?
    const overviewText = overview?.text ?? "";
    let mainNarrative = overviewText;
    let transitText = "";

    const splitMarker = "Upcoming transit windows (next 12 months)";
    if (overviewText.includes(splitMarker)) {
      const [before, after] = overviewText.split(splitMarker);
      mainNarrative = before.trim();
      transitText = after.trim();
    }

   return (
  <div
    className={
      "space-y-4 transform transition-all duration-300 " +
      (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
    }
  >
    <Card className="rounded-2xl border border-indigo-400/15 bg-indigo-950/40 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-100">Next 12 months</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3 text-slate-100">
        {loading && (
          <div className="text-white/70">
            Building your 12-month overview
          </div>
        )}

        {!loading && error && (
          <div className="text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && !hasData && (
          <div className="text-white/70">
            12-month overview will appear here once transits are available.
          </div>
        )}

        {!loading && !error && hasData && (
          <>
            {mainNarrative && (
              <pre className="text-[12px] whitespace-pre-wrap leading-relaxed">
                {mainNarrative}
              </pre>
            )}

            {transitText && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-white/70">
                  Show technical transit details
                </summary>
                <pre className="mt-2 text-[11px] whitespace-pre-wrap leading-relaxed">
                  {transitText}
                </pre>
              </details>
            )}
          </>
        )}
      </CardContent>
    </Card>

    {/* Optional: show remaining months as cards */}
    {!loading && !error && rest.length > 0 && (
      <div className="space-y-3">
        {rest.map((m) => (
          <Card
            key={m.label}
            className="border border-muted-foreground/30 bg-muted/40 rounded-2xl"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{m.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-xs whitespace-pre-wrap leading-relaxed">
              {m.text}
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);


  }
);

const TabWeekly: React.FC<TabWeeklyProps> = memo(
  ({ weeklyInsights, loading, error, mounted }) => {
    return (
      <div
        className={
          "space-y-4 transform transition-all duration-300 " +
          (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
        }
      >
        <Card className="rounded-2xl border border-white/15 bg-indigo-950/45 p-3">

          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Weekly guidance (next 8 weeks)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {loading && (
              <div className="text-white/70">
                Building your weekly guidance...
              </div>
            )}

            {!loading && error && (
              <div className="text-sm text-red-500">{error}</div>
            )}

            {!loading && !error && weeklyInsights.length === 0 && (
              <div className="text-white/70">
                Weekly guidance will appear here once transits are available.
              </div>
            )}

            {!loading && !error && weeklyInsights.length > 0 && (
              <div className="space-y-3">
                {weeklyInsights.map((w) => (
                  <Card
                    key={w.label}
                    className="border border-muted-foreground/30 bg-muted/40"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold">
                        {w.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-xs whitespace-pre-wrap leading-relaxed">
                      {w.text}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);
// ---------------- Today's Focus builder (chart + transits) ----------------

type TodaysFocusProfile = {
  area: string;     // e.g. "Career & long-term direction"
  headline: string; // short title
  summary: string;  // 1?2 sentence explanation
  do: string;       // one clear "Do"
  avoid: string;    // one clear "Avoid"
};

function buildTodaysFocusV2(opts: {
  report?: any;
  dashaStack?: any;
  transits?: any[] | null;
}): TodaysFocusProfile | null {
  const { report, dashaStack, transits } = opts || {};

  // 1) Figure out dominant category from transits, if any
  type Cat = "career" | "relationships" | "health" | "inner" | "general";

  const normalise = (cat?: string | null): Cat => {
    if (!cat) return "general";
    const c = cat.toLowerCase();
    if (c === "career") return "career";
    if (c === "relationships" || c === "relationship") return "relationships";
    if (c === "health") return "health";
    if (c === "inner" || c === "spiritual") return "inner";
    return "general";
  };

  let strongest: any | null = null;

  if (Array.isArray(transits) && transits.length > 0) {
    strongest = transits.reduce((best, cur) => {
      const b = typeof best?.strength === "number" ? best.strength : 0;
      const c = typeof cur?.strength === "number" ? cur.strength : 0;
      return c > b ? cur : best;
    }, transits[0]);
  }

  const cat: Cat = strongest ? normalise(strongest.category) : "general";

  // 2) Light influence from current dasha (if provided)
  let dashaFlavour: Cat | null = null;
  if (Array.isArray(dashaStack) && dashaStack.length > 0) {
    const md = (dashaStack[0]?.planet || dashaStack[0]?.lord || "")
      .toString()
      .toLowerCase();

    if (md === "saturn" || md === "mars") dashaFlavour = "career";
    else if (md === "venus" || md === "moon") dashaFlavour = "relationships";
    else if (md === "sun") dashaFlavour = "career";
    else if (md === "jupiter" || md === "mercury") dashaFlavour = "general";
    else if (md === "ketu" || md === "rahu") dashaFlavour = "inner";
  }

  const finalCat: Cat = dashaFlavour ?? cat;

  // 3) Map category ï¿½ text
  if (finalCat === "career") {
    return {
      area: "Career & long-term direction",
      headline: "Day favours focused, practical steps for your work path.",
      summary:
        "Good day to organise, plan or execute 1-2 meaningful actions that move your career or responsibilities forward.",
      do: "Choose one clear work-related action (planning, mail, call, or execution) and complete it fully.",
      avoid:
        "Starting ten different tasks at once or making dramatic career decisions out of impatience.",
    };
  }

  if (finalCat === "relationships") {
    return {
      area: "Relationships & conversations",
      headline: "Day favours honest, unhurried connection.",
      summary:
        "Energy supports listening, clarifying misunderstandings and having one real conversation instead of many surface-level chats.",
      do: "Reach out to one key person and have a calm, honest conversation or message.",
      avoid:
        "Over-explaining yourself to everyone or getting pulled into gossip and comparison.",
    };
  }

  if (finalCat === "health") {
    return {
      area: "Health, body & routines",
      headline: "Day favours steady care for the body.",
      summary:
        "This is a good day to support your body with simple routines: food, movement, rest and pending health tasks.",
      do: "Commit to one small but concrete action for your body (walk, workout, sleep routine or long-pending appointment).",
      avoid:
        "Swinging between strict discipline and total neglect; choose small, repeatable steps instead.",
    };
  }

  if (finalCat === "inner") {
    return {
      area: "Inner work & letting go",
      headline: "Day favours inner processing and quiet clarity.",
      summary:
        "Use this energy to observe emotions, release old baggage and make space for a cleaner inner story.",
      do: "Spend a little time journaling, meditating or consciously closing one lingering emotional loop.",
      avoid:
        "Digging too deep into old pain without breaks or taking irreversible decisions purely from today's mood.",
    };
  }

  // default: general / balance
  return {
    area: "Overall balance",
    headline: "Day favours balanced attention across life areas.",
    summary:
      "Good for keeping things steady: a bit of work, a bit of connection, and some time for your own body and mind.",
    do: "Write 3 small tasks (work, relationships, self) and complete just one from each bucket if possible.",
    avoid:
      "Letting the day scatter into endless scrolling and reacting to others priorities only.",
  };
}


type MoneyTip = {
  tone: "caution" | "neutral" | "opportunity" | string;
  headline: string;
  summary: string;
  tilt: string;
  drivers: string[];
  windowLabel: string;
  do: string[];
  avoid: string[];
};

const TabDailyGuide: React.FC<{
  report: LifeReportView | null;
  guide: {
    emotionalWeather?: EmotionalWeather;
    food?: FoodGuide;
    fasting?: FastingGuide;
    moneyTip?: MoneyTip;
  } | null;
  guideError: string | null;
  dailyHighlights: { dateISO: string; text: string }[];
  dailyLoading: boolean;
  mounted: boolean;
  todaysFocus: any;
}> = ({
  report,
  guide,
  guideError,
  dailyHighlights,
  dailyLoading,
  mounted,
  todaysFocus,
}) => {
  if (!mounted) return null;

  const emotional = guide?.emotionalWeather;
  const food = guide?.food;
  const fasting = guide?.fasting;
  const money = guide?.moneyTip;

  const todayLabel =
    (dailyHighlights?.[0]?.dateISO as string) ||
    new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-5">
      {guideError && (
        <div className="rounded-md border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {guideError}
        </div>
      )}

      {/* Snapshot */}
      <div className="rounded-2xl border border-white/15 bg-indigo-950/40 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Sarathi Snapshot  {todayLabel}
        </div>
        <div className="mt-1 text-lg font-semibold text-slate-100">
          {emotional?.headline ||
            "Today favours calm, conscious choices over impulsive moves."}
        </div>
        <p className="mt-2 text-sm text-white/70">
          {emotional?.summary ||
            "You dont have to solve everything today. Choose one priority and move steadily."}
        </p>
      </div>

     {/* 3 mini cards */}
{(() => {
  const foodTitle =
    (food as any)?.headline ||
    (food as any)?.title ||
    (food as any)?.label ||
    "Keep food light and sattvic where possible.";

  const foodText =
    (food as any)?.summary ||
    (food as any)?.text ||
    (food as any)?.note ||
    "Favour simple, clean meals that dont weigh you down.";

  const fastingTitle =
    (fasting as any)?.headline ||
    (fasting as any)?.title ||
    "Use simple discipline over extremes.";

  const fastingText =
    (fasting as any)?.summary ||
    (fasting as any)?.text ||
    "If fasting, keep it gentle and hydrated. If not, fast from noise/screens.";

  const moneyTitle =
    (money as any)?.headline ||
    (money as any)?.title ||
    "Keep money decisions steady today.";

  const moneyText =
    (money as any)?.summary ||
    (money as any)?.text ||
    "Avoid panic moves. Treat decisions as part of the long game.";

  const fastingIsGoodDay =
    typeof (fasting as any)?.isGoodDay === "boolean"
      ? (fasting as any).isGoodDay
      : null;

  const foodSuggestions: any[] = Array.isArray((food as any)?.suggestions)
    ? ((food as any).suggestions as any[])
    : [];

  const moneyDo: any[] = Array.isArray((money as any)?.do) ? ((money as any).do as any[]) : [];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Food */}
      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
          Food
        </div>

        <div className="mt-1 text-sm font-semibold text-slate-100 leading-snug">
          {foodTitle}
        </div>

        <p className="mt-2 text-xs text-white/70 leading-relaxed">
          {foodText}
        </p>

        {foodSuggestions.length > 0 && (
          <ul className="mt-3 list-disc pl-4 text-xs text-white/70 space-y-1">
            {foodSuggestions.slice(0, 5).map((s, i) => (
              <li key={i}>{String(s)}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Fasting */}
      <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-amber-200">
          Fasting
        </div>

        <div className="mt-1 text-sm font-semibold text-slate-100 leading-snug">
          {fastingTitle}
        </div>

        <p className="mt-2 text-xs text-white/70 leading-relaxed">
          {fastingText}
        </p>

        {fastingIsGoodDay !== null && (
          <div className="mt-3 inline-flex rounded-full bg-white/10 px-2 py-1 text-[11px] font-medium text-amber-200">
            {fastingIsGoodDay
              ? "Supportive day for fasting"
              : "Not a strong day for full fasting  choose lightness instead."}
          </div>
        )}
      </div>

      {/* Money */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Money
        </div>

        <div className="mt-1 text-sm font-semibold text-slate-100 leading-snug">
          {moneyTitle}
        </div>

        <p className="mt-2 text-xs text-white/70 leading-relaxed">
          {moneyText}
        </p>

        {moneyDo.length > 0 && (
          <div className="mt-3 text-xs text-white/70">
            <div className="text-[11px] font-semibold text-slate-100">Do</div>
            <ul className="mt-2 list-disc pl-4 space-y-1">
              {moneyDo.slice(0, 3).map((s, i) => (
                <li key={i}>{String(s)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
})()}

      {/* Loading */}
      {dailyLoading && (
        <div className="text-sm text-white/60">Loading next few days</div>
      )}
    </div>
  );
};


/* ======================================================================
   ADVANCED TAB (Premium conversion experience)
   Tone: balanced (wisdom + clarity)
   No backend changes required: uses safe heuristics + existing report data.
======================================================================== */

// ---------- helpers (top-level, NOT inside another component) ----------
function extractTimeline(report: any) {
  const r = report || {};
  const milestones = Array.isArray(r?.lifeMilestones) ? r.lifeMilestones : [];
  const phases = Array.isArray(r?.lifePhases) ? r.lifePhases : [];
  const active = Array.isArray(r?.activePeriods) ? r.activePeriods : [];

  // Normalize into a single list of { title, range, text }
  const items: Array<{ title: string; range?: string; text?: string }> = [];

  milestones.forEach((m: any) => {
    items.push({
      title: String(m?.title || m?.label || "Milestone"),
      range: String(m?.range || m?.window || m?.dates || "").trim() || undefined,
      text: String(m?.text || m?.description || m?.summary || "").trim() || undefined,
    });
  });

  phases.forEach((p: any) => {
    items.push({
      title: String(p?.title || p?.label || "Phase"),
      range: String(p?.range || p?.window || p?.dates || "").trim() || undefined,
      text: String(p?.text || p?.summary || p?.description || "").trim() || undefined,
    });
  });

  active.forEach((a: any) => {
    items.push({
      title: String(a?.title || a?.label || "Active period"),
      range: String(a?.range || a?.window || a?.dates || "").trim() || undefined,
      text: String(a?.text || a?.summary || a?.description || "").trim() || undefined,
    });
  });

  return items.filter((x) => x.title);
}

type PlanetLike = {
  name?: string;
  sign?: string;
  house?: number;
  nakshatra?: string;
  siderealLongitude?: number;
  dignity?: string;
};

function norm(s: any) {
  return String(s || "").trim().toLowerCase();
}

function getPlanet(report: any, planetName: string): PlanetLike | null {
  const arr = Array.isArray(report?.planets) ? report.planets : [];
  const p = arr.find((x: any) => norm(x?.name) === norm(planetName));
  return p || null;
}

function housePhrase(h?: number | null) {
  if (!h || typeof h !== "number") return "";
  const suffix = h === 1 ? "st" : h === 2 ? "nd" : h === 3 ? "rd" : "th";
  return `${h}${suffix} house`;
}

function fmtPlanet(p: PlanetLike | null) {
  if (!p) return null;
  const sign = p.sign ? String(p.sign) : "";
  const house = typeof p.house === "number" ? ` (${housePhrase(p.house)})` : "";
  const nak = p.nakshatra ? `  ${p.nakshatra}` : "";
  return `${p.name || "Planet"} in ${sign}${house}${nak}`.trim();
}

/**
 * Real alignment drivers based on planets + houses (and later dasha/transits when we map exact fields).
 */
function buildAlignmentDriversFromChart(report: any) {
  const sun = getPlanet(report, "Sun");
  const moon = getPlanet(report, "Moon");
  const mars = getPlanet(report, "Mars");
  const merc = getPlanet(report, "Mercury");
  const jup = getPlanet(report, "Jupiter");
  const ven = getPlanet(report, "Venus");
  const sat = getPlanet(report, "Saturn");
  const rahu = getPlanet(report, "Rahu");
  const ketu = getPlanet(report, "Ketu");

  // Evidence bullets (real)
  const evidenceMind = [
    fmtPlanet(merc),
    sat?.house ? `Saturn emphasis: discipline via ${housePhrase(sat.house)}` : null,
    ketu?.house ? `Ketu focus: detachment lessons via ${housePhrase(ketu.house)}` : null,
  ].filter(Boolean) as string[];

  const evidenceEmo = [
    fmtPlanet(moon),
    ven?.house ? `Venus soothing effect via ${housePhrase(ven.house)}` : null,
    sat?.house ? `Saturn can cool emotions via ${housePhrase(sat.house)}` : null,
  ].filter(Boolean) as string[];

  const evidenceDir = [
    fmtPlanet(sun),
    fmtPlanet(jup),
    rahu?.house ? `Rahu ambition grows via ${housePhrase(rahu.house)}` : null,
  ].filter(Boolean) as string[];

  const evidenceEnergy = [
    fmtPlanet(mars),
    sat?.house ? `Saturn affects stamina via ${housePhrase(sat.house)}` : null,
    moon?.house ? `Moon affects rhythm via ${housePhrase(moon.house)}` : null,
  ].filter(Boolean) as string[];

  const evidenceSupport = [
    ven?.house ? `Venus supports relationships via ${housePhrase(ven.house)}` : null,
    jup?.house ? `Jupiter brings mentors via ${housePhrase(jup.house)}` : null,
    rahu?.house ? `Networks expand via ${housePhrase(rahu.house)}` : null,
  ].filter(Boolean) as string[];

  // Convert evidence into why text
  const whyMind =
    evidenceMind.length
      ? `Mind patterns are shaped by ${evidenceMind[0]}${evidenceMind[1] ? ` and ${evidenceMind[1]}` : ""}.`
      : "Mind patterns improve when you simplify and follow one thread.";

  const whyEmo =
    evidenceEmo.length
      ? `Emotional rhythm is colored by ${evidenceEmo[0]}${evidenceEmo[1] ? ` and ${evidenceEmo[1]}` : ""}.`
      : "Emotional rhythm improves with steadiness and slower responses.";

  const whyDir =
    evidenceDir.length
      ? `Direction is driven by ${evidenceDir[0]}${evidenceDir[1] ? ` + ${evidenceDir[1]}` : ""}.`
      : "Direction strengthens when you commit to one priority.";

  const whyEnergy =
    evidenceEnergy.length
      ? `Energy and drive are influenced by ${evidenceEnergy[0]}${evidenceEnergy[1] ? ` and ${evidenceEnergy[1]}` : ""}.`
      : "Energy is stableprotect it from decision fatigue.";

  const whySupport =
    evidenceSupport.length
      ? `External support increases through ${evidenceSupport[0]}${evidenceSupport[1] ? ` and ${evidenceSupport[1]}` : ""}.`
      : "External support rises when requests are specific and boundaries are clear.";

  return {
    evidence: { mind: evidenceMind, emotions: evidenceEmo, direction: evidenceDir, energy: evidenceEnergy, support: evidenceSupport },
    why: { mind: whyMind, emotions: whyEmo, direction: whyDir, energy: whyEnergy, support: whySupport },
  };
}

/**
 * Timing Intelligence v1:
 * - Uses notificationsPreview as best windows (already derived by your system)
 * - Adds simple caution windows based on Moon/Mars/Saturn house emphasis
 */
function buildTimingV1(report: any, notificationsPreview: any) {
  const moon = getPlanet(report, "Moon");
  const mars = getPlanet(report, "Mars");
  const sat = getPlanet(report, "Saturn");

  const best: string[] = [];
  ["morning", "midday", "evening"].forEach((k) => {
    const arr = notificationsPreview?.[k] || [];
    if (Array.isArray(arr) && arr.length) {
      const t = String(arr[0]?.text || "").trim();
      if (t) best.push(`${k}: ${t}`);
    }
  });

  const caution: string[] = [];
  if (mars?.house === 6 || mars?.house === 8 || mars?.house === 12) {
    caution.push("Mars is in a more intense house  avoid impulsive conflict today.");
  }
  if (sat?.house === 6 || sat?.house === 8 || sat?.house === 12) {
    caution.push("Saturn pressure is higher  avoid overcommitting and running on low sleep.");
  }
  if (moon?.house === 8 || moon?.house === 12) {
    caution.push("Moon is in a sensitive house  avoid emotional overexposure / late-night heavy talks.");
  }

  if (!best.length) {
    best.push("late morning: focused work / planning", "early evening: follow-ups / clarity");
  }
  if (!caution.length) {
    caution.push("mid-afternoon: avoid impulsive decisions", "late night: avoid heavy conversations");
  }

  return { best: best.slice(0, 3), caution: caution.slice(0, 3) };
}

function pickStrings(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string") return v ? [v] : [];
  return [];
}

function firstNonEmpty(...arrs: any[]): string[] {
  for (const a of arrs) {
    const s = pickStrings(a);
    if (s.length) return s;
  }
  return [];
}

function extractEvidence(report: any) {
  const r = report || {};

  // Common places you might already have structured data
  const focus = firstNonEmpty(
    r?.nowFocus?.bullets,
    r?.now?.bullets,
    r?.focusAreas,
    r?.whatToFocusOn,
    r?.guidance?.focus,
    r?.core?.focus
  );

  const cautions = firstNonEmpty(
    r?.nowAvoid?.bullets,
    r?.now?.avoid,
    r?.avoidAreas,
    r?.whatToAvoid,
    r?.guidance?.avoid
  );

  const transit = firstNonEmpty(
    r?.transitHighlights,
    r?.transits?.highlights,
    r?.now?.transits,
    r?.timeline?.transitTriggers
  );

  const dasha = firstNonEmpty(
    r?.dashaSummary?.bullets,
    r?.dasha?.bullets,
    r?.activePeriods,
    r?.lifePhases,
    r?.timeline?.phases
  );

  return { focus, cautions, transit, dasha };
}

function takeN(arr: string[], n: number) {
  return (arr || []).slice(0, n);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeStr(v: any, fallback = "") {
  const s = String(v ?? "").trim();
  return s || fallback;
}
const normS = (s: any) => String(s ?? "").trim();
const lcS = (s: any) => normS(s).toLowerCase();


function getPlanets(report: any): any[] {
  return Array.isArray(report?.planets) ? report.planets : [];
}

function findPlanet(report: any, name: string) {
  const planets = getPlanets(report);
  return planets.find((p) => lcS(p?.name) === lcS(name)) || null;
}


function planetLabel(p: any) {
  const nm = safeStr(p?.name, "");
  const sign = safeStr(p?.sign, "");
  const house = safeStr(p?.house, "");
  return `${nm} in ${sign} (house ${house})`;
}
function toISODate(v: any): string | null {
  if (!v) return null;

  // Already ISO date
  if (typeof v === "string") {
    const s = v.trim();

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    // ISO datetime -> take date part
    // 2026-01-21T10:30:00Z or 2026-01-21 10:30
    const m = s.match(/^(\d{4}-\d{2}-\d{2})[T\s]/);
    if (m?.[1]) return m[1];

    // Common dd/mm/yyyy or dd-mm-yyyy (assume day-first)
    const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmy) {
      const dd = String(dmy[1]).padStart(2, "0");
      const mm = String(dmy[2]).padStart(2, "0");
      const yyyy = dmy[3];
      return `${yyyy}-${mm}-${dd}`;
    }

    return null;
  }

  // Date object
  if (v instanceof Date && !isNaN(v.getTime())) {
    return v.toISOString().slice(0, 10);
  }

  // Timestamp (ms)
  if (typeof v === "number" && isFinite(v)) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }

  return null;
}

// ===================== Advanced Pro: degree + nakshatra intelligence =====================

// Lahiri-ish sidereal: you already store siderealDeg in [0..360).
// Convert absolute degree ï¿½ degree within sign (0..30)
function degInSignX(absDeg: any): number | null {
  const n = Number(absDeg);
  if (!Number.isFinite(n)) return null;
  // normalize to 0..360
  const d = ((n % 360) + 360) % 360;
  return d % 30;
}

function phaseInSignX(deg0to30: number | null): "early" | "mid" | "late" | null {
  if (deg0to30 == null) return null;
  if (deg0to30 < 10) return "early";
  if (deg0to30 < 20) return "mid";
  return "late";
}

function formatDegX(deg0to30: number | null): string {
  if (deg0to30 == null) return "";
  return `${Math.floor(deg0to30)}`;
}

// Light, truthful phase meaning  no fear, no fake certainty.
function signPhaseMeaningX(planetName: string, sign: string, phase: "early" | "mid" | "late" | null) {
  const p = (planetName || "").toLowerCase();
  if (!phase) return null;

  // Keep it universally accurate and practical.
  if (phase === "early") {
    return p === "mars"
      ? "This is initiation energy  start clean, then commit."
      : "This is an opening phase  explore options, then choose one lane.";
  }
  if (phase === "mid") {
    return p === "saturn"
      ? "This is construction energy  routines and boundaries compound fast."
      : "This is a build phase  consistency beats intensity.";
  }
  // late
  return p === "sun"
    ? "This is a maturity phase  lead with responsibility, simplify what doesnt matter."
    : "This is a completion phase  finish, refine, and lock in what works.";
}

// Minimal nakshatra blurbs (we can expand later).
// Keep 12 lines max: essence + decision rule.
function nakshatraNoteX(n: any): string | null {
  const key = String(n ?? "").trim();
  if (!key) return null;

  const map: Record<string, string> = {
    "Uttara Ashadha":
      "Uttara Ashadha rewards perseverance and integrity. Decision rule: choose what you can stand by long-term, then follow through steadily.",
    "Purva Ashadha":
      "Purva Ashadha pushes renewal and conviction. Decision rule: commit boldly, but dont argue your way into outcomes.",
    "Shravana":
      "Shravana grows through listening and learning. Decision rule: gather signals first, then speak once with clarity.",
    "Hasta":
      "Hasta is skill and craftsmanship. Decision rule: improve the method  results follow the method.",
    "Rohini":
      "Rohini builds beauty and stability. Decision rule: grow whats already working; avoid unnecessary upheaval.",
  };

  return map[key] || null;
}

// House meaning for planet -> what area gets emphasized (lightweight).
function houseCueX(h: any): string | null {
  const n = Number(h);
  if (!Number.isFinite(n)) return null;
  const map: Record<number, string> = {
    1: "identity and initiative",
    2: "money, speech, values",
    3: "effort and skills",
    4: "home and inner stability",
    5: "learning, creativity, children",
    6: "work, health, competition",
    7: "relationships and partnerships",
    8: "deep change, uncertainty, shared resources",
    9: "beliefs, mentors, long journeys",
    10: "career and responsibility",
    11: "networks, gains, long-term hopes",
    12: "rest, retreat, healing, endings",
  };
  return map[n] || null;
}

// Build a premium signature insight from 12 strongest anchors.
// Uses degree-phase + nakshatra + house cue.
function buildSignatureInsightX(report: any): string {
  const planets = Array.isArray(report?.planets) ? report.planets : [];
  const findBy = (nm: string) => planets.find((p: any) => String(p?.name ?? "").toLowerCase() === nm.toLowerCase());

  // Prefer Saturn/Moon/Sun because they read life-real.
  const sat = findBy("Saturn");
  const moon = findBy("Moon");
  const sun = findBy("Sun");
  const rahu = findBy("Rahu");
  const mars = findBy("Mars");

  // Pick primary anchor: Saturn if present, else Moon, else Sun.
  const primary = sat || moon || sun || planets[0] || null;

  if (!primary) {
    return "Your next best step is simple: choose one priority, remove noise, and follow through steadily.";
  }

  const pName = String(primary?.name ?? "This cycle");
  const sign = String(primary?.sign ?? "");
  const h = primary?.house;
  const houseCue = houseCueX(h);

  const absDeg = primary?.siderealDeg ?? primary?.deg;
  const dis = degInSignX(absDeg);
  const phase = phaseInSignX(dis);
  const phaseMeaning = signPhaseMeaningX(pName, sign, phase);
  const nak = nakshatraNoteX(primary?.nakshatra);

  // Optional secondary tension (Rahu/Mars) for realism
  const tension = rahu || mars || null;
  const tensionLine = tension
    ? `Watch the pull of ${String(tension?.name ?? "restlessness")} in ${String(tension?.sign ?? "")}  keep it in a lane, not everywhere.`
    : "";

  const degTxt = formatDegX(dis);
  const anchorLine = `${pName} in ${sign}${degTxt ? ` (${degTxt})` : ""}${houseCue ? ` highlights ${houseCue}` : ""}.`;

  // Final signature: 23 sentences max.
  const lines = [
    `Your signature insight right now: ${anchorLine}`,
    phaseMeaning ? phaseMeaning : "Keep it clean: one priority, one timeline, one action.",
    nak ? nak : "",
    tensionLine,
  ].filter(Boolean);

  // Ensure its not too long
  return lines.join(" ").replace(/\s+/g, " ").trim();
}

const SIGN_MODALITY: Record<string, "cardinal" | "fixed" | "mutable" | ""> = {
  Aries: "cardinal",
  Cancer: "cardinal",
  Libra: "cardinal",
  Capricorn: "cardinal",
  Taurus: "fixed",
  Leo: "fixed",
  Scorpio: "fixed",
  Aquarius: "fixed",
  Gemini: "mutable",
  Virgo: "mutable",
  Sagittarius: "mutable",
  Pisces: "mutable",
};

function modalityOf(sign: string) {
  return SIGN_MODALITY[sign] || "";
}

function houseTheme(h: number) {
  const map: Record<number, string> = {
    1: "identity and initiative",
    2: "money, speech, values",
    3: "effort, courage, skills",
    4: "home, inner stability",
    5: "learning, creativity, children",
    6: "work, health, competition",
    7: "relationships, partnerships",
    8: "deep change, uncertainty, shared resources",
    9: "beliefs, mentors, long journeys",
    10: "career, status, responsibility",
    11: "networks, gains, long-term hopes",
    12: "rest, retreat, healing, endings",
  };
  return map[h] || "life themes";
}

function numOrNull(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}


function buildCorePattern(report: any) {
  const asc = safeStr(report?.ascSign, "");

  const moon = findPlanet(report, "Moon");
  const sun = findPlanet(report, "Sun");

  const moonSign = safeStr(moon?.sign, safeStr(report?.moonSign, ""));
  const sunSign = safeStr(sun?.sign, safeStr(report?.sunSign, ""));

  const moonHouseRaw = toNum(moon?.house);
const sunHouseRaw = toNum(sun?.house);

const moonHouseN =
  moonHouseRaw !== undefined && moonHouseRaw >= 1 && moonHouseRaw <= 12
    ? moonHouseRaw
    : null;


const sunHouseN =
  sunHouseRaw !== undefined && sunHouseRaw >= 1 && sunHouseRaw <= 12
    ? sunHouseRaw
    : null;


  const ascMod = modalityOf(asc);
  const moonMod = modalityOf(moonSign);
  const sunMod = modalityOf(sunSign);

  const ascLine =
    asc !== ""
      ? `Your baseline approach: ${asc} rising (${ascMod || "steady"} style)  you initiate through ${ascMod === "cardinal" ? "decisive starts" : ascMod === "fixed" ? "consistency and staying power" : "adaptation and options"}.`
      : `Your baseline approach: ascendant details will refine this once available.`;

  const moonLine =
    moon
      ? `Emotional rhythm: ${planetLabel(moon)}  your feelings first go toward ${moonHouseN ? houseTheme(moonHouseN) : "what matters most"}, and you recover best through ${moonMod === "fixed" ? "stability and predictability" : moonMod === "cardinal" ? "taking a clean action" : "processing and reframing"}.`
      : `Emotional rhythm: Moon placement not found in report.`;

  const sunNak = describeNakshatra(sun?.nakshatra);

const sunLine =
  sun
    ? `Direction + drive: ${planetLabel(sun)}  growth wants patient consistency and responsibility.${
        sunNak ? " " + sunNak : ""
      }`
    : `Direction + drive: Sun placement not found.`;

  const useLine =
  `Use this rule today: pick one priority aligned with your baseline lens${asc !== "" ? ` (${asc} rising)` : ""}, regulate emotions via the Moons house focus, then commit to one Sun-led action (small, but consistent).`;

  return [ascLine, moonLine, sunLine, useLine].join(" ");
}

function pickDeepPatterns(report: any) {
  const moon = findPlanet(report, "Moon");
  const saturn = findPlanet(report, "Saturn");
  const rahu = findPlanet(report, "Rahu");
  const ketu = findPlanet(report, "Ketu");

  const moonSign = safeStr(moon?.sign, "");
  const moonHouseN = toNum(moon?.house);

  const satHouseN = toNum(saturn?.house);

  const rahuHouseN = toNum(rahu?.house);
  const ketuHouseN = toNum(ketu?.house);

  // Emotional pattern  house-based (specific)
  const emotionalText = moon
    ? [
        `Anchor: ${planetLabel(moon)}.`,
        moonHouseN
          ? `When pressure rises, emotions first show up around ${houseTheme(moonHouseN)} (house ${moonHouseN}).`
          : `When pressure rises, emotions show up in a consistent area of life (house detail missing).`,
        `Best recovery move: name the feeling, then take one small action that restores control (not a full reset).`,
        `Watch-out: if you delay decisions, emotions can run the day  choose a timeline first, then decide.`
      ].join(" ")
    : `Moon placement not found. Once present, this will map how stress shows up and how you recover fastest.`;

  // Life strategy  Saturn house-based (specific)
  const strategyText = saturn
    ? [
        `Anchor: ${planetLabel(saturn)}.`,
        satHouseN
          ? `Progress comes from structure in ${houseTheme(satHouseN)} (house ${satHouseN}).`
          : `Progress comes from structure and steady rules (house detail missing).`,
        `Your edge is compounding: small daily discipline beats occasional intensity.`,
        `Shortcut pattern: if you skip fundamentals, life forces rework later  build once, build clean.`
      ].join(" ")
    : `Saturn not found. This card becomes sharper once Saturns house is available.`;

  // Karmic growth edge  Rahu/Ketu axis house-based (premium)
  const karmicText =
    rahu || ketu
      ? [
          `Axis: ${rahu ? planetLabel(rahu) : "Rahu"} ? ${ketu ? planetLabel(ketu) : "Ketu"}.`,
          rahuHouseN && ketuHouseN
            ? `This is a pushpull between ${houseTheme(rahuHouseN)} (where desire grows) and ${houseTheme(ketuHouseN)} (where detachment is already strong).`
            : `This axis shows where desire expands and where detachment has already been learned.`,
          `Lesson for this cycle: pursue growth without over-identifying with outcomes.`,
          `Practical rule: ambition with a boundary  one goal, one limit, no spirals.`
        ].join(" ")
      : `Rahu/Ketu not found. Once present, this becomes your most accurate repeating lesson card.`;

  return [
    { title: "Emotional pattern (how you process & recover)", text: emotionalText },
    { title: "Life strategy (how results compound)", text: strategyText },
    { title: "Karmic edge (what life is training in you)", text: karmicText },
  ];
}
function buildDecisionBuckets(report: any) {
  const moon = findPlanet(report, "Moon");
  const mars = findPlanet(report, "Mars");
  const saturn = findPlanet(report, "Saturn");
  const sun = findPlanet(report, "Sun");
  const rahu = findPlanet(report, "Rahu");

  const moonHouseN = toNum(moon?.house);
  const sunHouseN = toNum(sun?.house);

  const supportive: string[] = [];
  const neutral: string[] = [];
  const avoid: string[] = [];

  // Baseline: always usable but not generic (phrased as decision behaviors)
  supportive.push("Choose one priority and finish it cleanly (closure creates momentum).");
  supportive.push("Plan in writing: a simple sequence beats overthinking.");
  neutral.push("Maintenance and learning: improve systems, dont force outcomes.");
  avoid.push("Binary decisions made in an emotional spike (sleep on it if needed).");

  // Saturn: structure / discipline
  if (saturn) {
    supportive.push(`Lean into structure and boundaries (Saturn emphasized: ${planetLabel(saturn)}).`);
    supportive.push("Long-term commitments with clear rules and timelines.");
    avoid.push("Shortcuts that create future cleanup (Saturn punishes rework).");
  }

  // Mars: action / confrontation
  if (mars) {
    supportive.push(`Use physical action to clear mind-noise (Mars emphasized: ${planetLabel(mars)}).`);
    supportive.push("Decisive follow-through on one task youve delayed.");
    avoid.push("Unnecessary conflict, ego battles, or proving a point.");
  }

  // Moon: emotional timing
  if (moon) {
    supportive.push(`Emotional hygiene first, then decisions (Moon emphasized: ${planetLabel(moon)}).`);
    avoid.push("Late-night spirals / doom-scrolling / reactive messaging.");
    if (moonHouseN === 12) supportive.push("Rest, solitude, and quiet clarity before major choices.");
    if (moonHouseN === 8) supportive.push("Handle shared money / uncertainty with extra verification.");
    if (moonHouseN === 4) supportive.push("Home/family stability decisions get priority over noise.");
  }

  // Sun: leadership / visibility
  if (sun) {
    if (sunHouseN === 10 || sunHouseN === 1) {
      supportive.push(`Visibility works in your favor now (Sun in a strong action house: ${planetLabel(sun)}).`);
      supportive.push("Initiate conversations where you set the terms clearly.");
    } else {
      neutral.push(`Keep ego out of decisions; let results speak (Sun: ${planetLabel(sun)}).`);
    }
  }

  // Rahu: obsession / overreach
  if (rahu) {
    avoid.push(`Overpromising or chasing the quick win (Rahu tendency: ${planetLabel(rahu)}).`);
    supportive.push("Move in steps: validate, then commit.");
  }

  // Return trimmed, unique lists (clean UI)
  const uniq = (arr: string[]) => Array.from(new Set(arr)).slice(0, 6);

  return {
    supportive: uniq(supportive),
    neutral: uniq(neutral),
    avoid: uniq(avoid),
  };
}
function computeAlignment(report: any) {
  const planets = getPlanets(report);

  const moon = findPlanet(report, "Moon");
  const sun = findPlanet(report, "Sun");
  const mars = findPlanet(report, "Mars");
  const mercury = findPlanet(report, "Mercury");
  const jupiter = findPlanet(report, "Jupiter");
  const saturn = findPlanet(report, "Saturn");
  const venus = findPlanet(report, "Venus");

  const moonHouse = toNum(moon?.house);
  const sunHouse = toNum(sun?.house);
  const marsHouse = toNum(mars?.house);

  // Count elements very lightly (optional but real-ish)
  const signToElement: Record<string, "fire" | "earth" | "air" | "water" | ""> = {
    Aries: "fire", Leo: "fire", Sagittarius: "fire",
    Taurus: "earth", Virgo: "earth", Capricorn: "earth",
    Gemini: "air", Libra: "air", Aquarius: "air",
    Cancer: "water", Scorpio: "water", Pisces: "water",
  };

  const elementCounts = { fire: 0, earth: 0, air: 0, water: 0 };
  for (const p of planets) {
    const el = signToElement[safeStr(p?.sign, "") as keyof typeof signToElement] || "";
    if (el) elementCounts[el] += 1;
  }

  // Base is stable, but not random
  let mind = 55;
  let emotions = 55;
  let direction = 55;
  let energy = 55;
  let support = 55;

  // Mind drivers
  if (mercury) mind += 10;
  if (saturn) mind += 6;
  mind += Math.min(6, elementCounts.air * 1.5 + elementCounts.earth * 1.0);

  // Emotions drivers
  if (moon) emotions += 10;
  if (moonHouse === 4 || moonHouse === 5 || moonHouse === 9 || moonHouse === 11) emotions += 6;
  if (moonHouse === 6 || moonHouse === 8 || moonHouse === 12) emotions -= 6;
  emotions += Math.min(6, elementCounts.water * 1.5);

  // Direction drivers
  if (sun) direction += 8;
  if (jupiter) direction += 10;
  if (sunHouse === 10 || sunHouse === 1) direction += 6;

  // Energy drivers
  if (mars) energy += 10;
  if (marsHouse === 1 || marsHouse === 3 || marsHouse === 6) energy += 4;
  if (moonHouse === 12 || moonHouse === 8) energy -= 4;

  // Support drivers (external help / tailwinds)
  if (jupiter) support += 10;
  if (venus) support += 6;
  // light bonus if many planets in 11th/2nd (gains/resources)
  const has11 = planets.some((p) => toNum(p?.house) === 11);
  const has2 = planets.some((p) => toNum(p?.house) === 2);
  if (has11) support += 4;
  if (has2) support += 3;

  return {
    mind: clamp(Math.round(mind), 35, 92),
    emotions: clamp(Math.round(emotions), 35, 92),
    direction: clamp(Math.round(direction), 35, 92),
    energy: clamp(Math.round(energy), 35, 92),
    support: clamp(Math.round(support), 35, 92),
  };
}
function topActiveTransitsForToday(hits: any[], todayISO: string, limit = 5): any[] {
  const arr = Array.isArray(hits) ? hits : [];
  if (!arr.length) return [];

  const active = arr.filter((t: any) => {
    const sRaw = t?.startISO ?? t?.fromISO ?? t?.from ?? t?.start ?? t?.startDate;
    const eRaw = t?.endISO ?? t?.toISO ?? t?.to ?? t?.end ?? t?.endDate;

    const s = toISODate(sRaw);
    const e = toISODate(eRaw);

    if (!s || !e) return false;
    return s <= todayISO && e >= todayISO;
  });

  active.sort((a: any, b: any) => (Number(b?.strength ?? 0) || 0) - (Number(a?.strength ?? 0) || 0));
  return active.slice(0, Math.max(1, limit));
}

// ---------- Transit helpers (Advanced tab) ----------
const isoDay = (d: Date) => d.toISOString().slice(0, 10);


// ---------- TabAdvanced (top-level component) ----------
const TabAdvanced: React.FC<{
  report: LifeReportView | null;
  mounted: boolean;
  isPro: boolean; // … Tier-2: Advanced Pro
  timelineSummary?: string | null;
  dashaTransitSummary?: string | null;
  transits?: TransitHit[];
  transitNow?: any[]; // ✅ ADD
}> = ({
  report,
  mounted,
  isPro,
  timelineSummary,
  dashaTransitSummary,
  transits,
  transitNow, // ✅ ADD
}) => {
  if (!mounted) return null;
  // --- Transits source of truth (prefer prop; fallback to report) ---
const hits: TransitHit[] = Array.isArray(transits)
  ? transits
  : Array.isArray((report as any)?.transits)
  ? ((report as any).transits as TransitHit[])
  : [];

 if (!mounted) return null;
const todayISO = (() => {
  const tz =
  (report as any)?.meta?.birthTz ??
  "Asia/Dubai";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
})();


const hitsN: TransitHit[] = (Array.isArray(hits) ? hits : [])
  .map((h: any) => {
    const sRaw = h?.startISO ?? h?.fromISO ?? h?.from ?? h?.start ?? h?.startDate;
    const eRaw = h?.endISO ?? h?.toISO ?? h?.to ?? h?.end ?? h?.endDate;

    const startISO = toISODate(sRaw);
    const endISO = toISODate(eRaw);

    return { ...h, startISO, endISO };
  })
  .filter((h: any) => !!h?.startISO && !!h?.endISO);

// For today ï¿½ next 2 weeks chips
const addDaysISO = (iso: string, days: number) => {
  const d = new Date(iso + "T00:00:00.000Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
const next14ISO = addDaysISO(todayISO, 14);

// If you dont already have a range helper, keep it simple:
const topToday = topActiveTransitsForToday(hitsN as any, todayISO, 5);
const topNext2Weeks = hitsN
  .filter((h) => h?.startISO && h?.endISO && h.startISO <= next14ISO && h.endISO >= todayISO)
  .sort((a, b) => (b?.strength ?? 0) - (a?.strength ?? 0))
  .slice(0, 8);
// Near-future plan can come back under different keys depending on route merges.
// This makes the UI resilient while we finalize the backend contract.
const planRaw =
  (report as any)?.nowPlan ??
  (report as any)?.nowNearFuture ??
  (report as any)?.nowNearFuturePlan ??
  (report as any)?.advancedPro?.nowNearFuture ??
  (report as any)?.advancedPro?.plan ??
  (report as any)?.fullPlan?.nowNearFuture ??
  (report as any)?.fullPlan?.nowNearFuturePlan ??
  (report as any)?.plan ??
  null;


// If the API returns JSON as a string (common when LLM returns ```json```), parse it.
const plan = (() => {
  if (!planRaw) return null;
  if (typeof planRaw === "object") return planRaw;
  if (typeof planRaw === "string") {
    const s = planRaw.trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();
    try { return JSON.parse(s); } catch { return null; }
  }
  return null;
})();
console.log("[ADV_PRO][UI] plan?", !!plan, "keys:", plan ? Object.keys(plan) : null);


const nextUpcoming = hits
  .filter((t: any) => String(t?.startISO || "").slice(0, 10) > todayISO)
  .sort((a: any, b: any) => String(a?.startISO).localeCompare(String(b?.startISO)))
  .slice(0, 5);

console.log("[advanced] hits:", hits.length, "topToday:", topToday.length);
// Try to extract transits from dashaTransitSummary (it may be JSON from /api/ai-dasha-transits)
const parsedFusion: any = (() => {
  try {
    const s = typeof dashaTransitSummary === "string" ? dashaTransitSummary : "";
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
})();




  // IMPORTANT: if no report yet, show clean empty-state (no demo data)
  if (!report) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Advanced - Your deeper map
          </div>
          <div className="mt-1 text-sm text-white/70">
            Enter your birth details above and click{" "}
            <span className="text-white/90 font-semibold">
              Generate / Refresh Report
            </span>{" "}
            to unlock Advanced insights.
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-indigo-950/40 p-5 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
            What youll get here
          </div>
          <div className="mt-2 text-sm text-white/80 leading-relaxed">
            Once generated, this tab shows your chart-backed decision layer:
          </div>
         {topToday.length > 0 ? (
  <div className="mt-3 flex flex-wrap gap-2">
    {topToday.map((t: any, i: number) => (
      <span key={(t?.id ?? i) as any} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/80">
        {formatTransitChip(t)}
      </span>
    ))}
  </div>
) : nextUpcoming.length > 0 ? (
  <div className="mt-3">
    <div className="text-xs text-white/60 mb-2">No strong transits active today. Next up:</div>
    <div className="flex flex-wrap gap-2">
      {nextUpcoming.map((t: any, i: number) => (
        <span key={(t?.id ?? i) as any} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/80">
          {formatTransitChip(t)}
        </span>
      ))}
    </div>
  </div>
) : (
  <div className="mt-3 text-xs text-white/60">
    No transit windows available (backend returned none).
  </div>
)}


          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              "Current activations (chart-specific)",
              "Dasha - Transit blend (why it feels this way)",
              "Decision playbook (do / avoid / timing cues)",
            ].map((t) => (
              <div
                key={t}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80"
              >
                {t}
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-white/60">
            Tip: If you see old data, change any input slightly (time/place) and regenerate.
          </div>
        </div>
      </div>
    );
  }

  // Compute ONLY when report exists
  const r: any = report;
  console.log("[TabAdvanced] prop transits len:", Array.isArray(transits) ? transits.length : "not-array", transits);
console.log("[TabAdvanced] report.transits len:", Array.isArray((r as any)?.transits) ? (r as any).transits.length : "not-array", (r as any)?.transits);

console.log("[TabAdvanced] planets[0]", report?.planets?.[0]);
{/* ï¿½ TODAYS STRONG TRANSITS (from /api/transits) */}
<div className="rounded-2xl border border-white/15 bg-white/5 p-5">
  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
    Todays strong transits
  </div>

  {topToday.length > 0 ? (
    <div className="mt-3 flex flex-wrap gap-2">
      {topToday.map((t: any, i: number) => (
        <span
          key={(t?.id ?? i) as any}
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/80"
        >
          {formatTransitChip(t)}
        </span>
      ))}
    </div>
  ) : (
    <div className="mt-3 text-xs text-white/60">
      No strong transits active today.
    </div>
  )}
</div>


  // Existing builders (keep)
  const why = buildWhyBullets_X(r);
const operatingMode = buildOperatingMode_X(r);
const buckets0 = buildDecisionBuckets(r);
const buckets = trimPlaybook_X(buckets0);
const rules = buildRules_X(r);
const takeaway = buildTakeawayLine_X(r);
  // ---------- Helpers (keep lightweight + safe) ----------
  const safe = (v: any, fallback = "") =>
    String(v ?? "")
      .replace(/\u0000/g, "")
      .replace(/\s+/g, " ")
      .trim() || fallback;

  const titleCase = (s: string) =>
    safe(s)
      ? safe(s).charAt(0).toUpperCase() + safe(s).slice(1)
      : "";

  // Pull a few real anchors from report if present (non-breaking if missing)
  const asc = safe(r?.ascSign ?? r?.core?.ascSign ?? "", "");
  const moon = safe(r?.moonSign ?? r?.core?.moonSign ?? "", "");
  const moonHouseRaw = r?.core?.moonHouse ?? r?.moonHouse ?? null;
const moonHouse =
  Number.isFinite(Number(moonHouseRaw)) &&
  Number(moonHouseRaw) >= 1 &&
  Number(moonHouseRaw) <= 12
    ? Number(moonHouseRaw)
    : null;

  const md = safe(r?.dasha?.md?.planet ?? r?.activeDasha?.md ?? "", "");
  const ad = safe(r?.dasha?.ad?.planet ?? r?.activeDasha?.ad ?? "", "");

  const activePlanet =
    safe(r?.activePlanet ?? r?.now?.activePlanet ?? "", "") ||
    safe(r?.remedyPlanet ?? "", "");

  // Try to reuse the dashaTransitSummary already passed in (this is good because it is computed elsewhere)
  const rawText = extractTimelineText(
    safe(
      dashaTransitSummary,
      "Your current cycle blends your running dasha with active transits  the aim is steadier, more conscious choices."
    )
  );

  const cleanTimelineText = safe(rawText);

  const Locked: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-indigo-950/40 p-4 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
      <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
        {title}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
  function toHouseNum(p: any): number | null {
  if (!p) return null;

  const h =
    (typeof p.house === "number" && Number.isFinite(p.house) && p.house) ||
    (typeof p.houseNum === "number" && Number.isFinite(p.houseNum) && p.houseNum) ||
    (typeof p.h === "number" && Number.isFinite(p.h) && p.h) ||
    null;

  if (h == null) return null;

  // clamp to 1..12 if something weird comes
  const n = Math.round(h);
  if (n < 1) return 1;
  if (n > 12) return 12;
  return n;
}


// ===================== Advanced Pro: no-generic builders (WHY ï¿½ SO WHAT ï¿½ HOW) =====================

function getP_X(report: any, name: string) {
  const planets = Array.isArray(report?.planets) ? report.planets : [];
  return planets.find((p: any) => String(p?.name ?? "").toLowerCase() === name.toLowerCase()) || null;
}

function phaseLine_X(p: any): string | null {
  if (!p) return null;
  const abs = p?.siderealDeg ?? p?.deg;
  const dis = degInSignX(abs);
  const phase = phaseInSignX(dis);
  const pm = signPhaseMeaningX(String(p?.name ?? ""), String(p?.sign ?? ""), phase);
  return pm ? pm : null;
}

function evidenceChip_X(p: any): string | null {
  if (!p) return null;
  const nm = String(p?.name ?? "").trim();
  const sign = String(p?.sign ?? "").trim();
  const h = p?.house;
  const deg0 = degInSignX(p?.siderealDeg ?? p?.deg);
  const degTxt = formatDegX(deg0);
  const nak = String(p?.nakshatra ?? "").trim();
  const parts = [
    nm ? nm : null,
    sign ? sign : null,
    Number.isFinite(Number(h)) ? `H${Number(h)}` : null,
    degTxt ? degTxt : null,
    nak ? nak : null,
  ].filter(Boolean);
  return parts.length ? parts.join("  ") : null;
}
function getHouseNum_X(p: any): number | null {
  if (!p) return null;
  // common shapes
  const h =
    p?.house ??
    p?.houseNum ??
    (typeof p?.houseIndex === "number" ? p.houseIndex + 1 : null);
  const n = Number(h);
  return Number.isFinite(n) ? n : null;
}

// 1) WHY THIS PHASE FEELS LIKE THIS (bullets only, all anchored)
function buildWhyBullets_X(report: any): { bullets: string[]; evidence: string[] } {
  const sat = getP_X(report, "Saturn");
  const moon = getP_X(report, "Moon");
  const sun = getP_X(report, "Sun");
  const rahu = getP_X(report, "Rahu");
  const mars = getP_X(report, "Mars");

  const bullets: string[] = [];
  const evidence: string[] = [];

  const addE = (p: any) => {
    const chip = evidenceChip_X(p);
    if (chip) evidence.push(chip);
  };

  // Evidence chips (keeps trust high)
  addE(sat); addE(moon); addE(sun); addE(rahu); addE(mars);

  // Saturn: pressure/structure (house-specific)
  if (sat) {
    const h = Number(sat?.house);
    const cue = houseCueX(h);
    bullets.push(
      `Structure is the main teacher right now: Saturn in ${String(sat?.sign ?? "")} (house ${h}) emphasizes ${cue || "discipline and reality checks"}  progress comes from rules, not mood.`
    );
  }

  // Moon: emotional processing location
  if (moon) {
    const h = Number(moon?.house);
    const cue = houseCueX(h);
    bullets.push(
      `Your emotional processing is concentrating in ${cue || "one key life area"}: Moon in ${String(moon?.sign ?? "")} (house ${h})  feelings settle after you create safety/clarity in that zone.`
    );
  }

  // Sun: purpose/drive in a specific house, plus nakshatra note if available
  if (sun) {
    const h = Number(sun?.house);
    const cue = houseCueX(h);
    const nak = nakshatraNoteX(sun?.nakshatra);
    bullets.push(
      `Your drive is maturing through ${cue || "a specific area"}: Sun in ${String(
  sun?.sign ?? ""
)} (house ${h}).${nak ? " " + nak : ""}`

    );
    const pl = phaseLine_X(sun);
    if (pl) bullets.push(pl);
  }

  // Rahu/Mars: noise / urgency (only if present)
  if (rahu) {
    const h = Number(rahu?.house);
    bullets.push(
      `Restlessness can spike when chasing quick certainty: Rahu in ${String(rahu?.sign ?? "")} (house ${h})  channel ambition into one lane, not ten.`
    );
  }
  if (mars) {
    const h = Number(mars?.house);
    bullets.push(
      `Energy runs hot when provoked: Mars in ${String(mars?.sign ?? "")} (house ${h})  act decisively, but avoid winning the moment at the cost of peace.`
    );
  }

  // Keep it to 5 bullets max (no overwhelm)
  return { bullets: bullets.slice(0, 5), evidence: evidence.filter(Boolean).slice(0, 5) };
}

// 2) OPERATING MODE (one paragraph; still anchored)
function buildOperatingMode_X(report: any): string {
  const sat = getP_X(report, "Saturn");
  const moon = getP_X(report, "Moon");
  const sun = getP_X(report, "Sun");

  const parts: string[] = [];

  if (sat) {
    parts.push(
      `With Saturn emphasized (${evidenceChip_X(sat)}), you function best with fewer priorities, clear boundaries, and repeatable routines.`
    );
  }
  if (moon) {
    parts.push(
      `With the Moon emphasized (${evidenceChip_X(moon)}), clarity returns after you name what you feel and take one small stabilizing action  not after long mental debate.`
    );
  }
  if (sun) {
    parts.push(
      `With the Sun guiding direction (${evidenceChip_X(sun)}), growth comes from steady follow-through and responsible choices over dramatic resets.`
    );
  }

  if (!parts.length) {
    return "Your operating mode becomes precise once key planetary anchors are present in the report.";
  }

  // One paragraph only
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

// 4) ENERGY & EMOTIONAL RULES (max 5; anchored)
function buildRules_X(report: any): string[] {
  const sat = getP_X(report, "Saturn");
  const moon = getP_X(report, "Moon");
  const mars = getP_X(report, "Mars");
  const rahu = getP_X(report, "Rahu");

  const rules: string[] = [];

  if (moon) {
    rules.push(`Decide after you calm the Moon pattern (${evidenceChip_X(moon)}). If emotional intensity is high, delay the decision  not the action boundary.`);
  }
  if (sat) {
    rules.push(`Use structure as medicine (${evidenceChip_X(sat)}): one routine, one boundary, one timeline. Momentum follows the system.`);
  }
  if (mars) {
    rules.push(`Move the body before the mind argues (${evidenceChip_X(mars)}). Physical action prevents avoidable conflict and impulsive messaging.`);
  }
  if (rahu) {
    rules.push(`Dont chase certainty everywhere (${evidenceChip_X(rahu)}). Pick one lane and let results compound.`);
  }

  // Universal rule (still not generic: its a delivery rule)
  rules.push(`One priority per day. If you cant name the priority, dont add a commitment.`);

  return rules.slice(0, 5);
}

// 3) DECISION PLAYBOOK (keep your buckets, but trim + de-planetize slightly)
function trimPlaybook_X(buckets: any) {
  const take4 = (arr: any[]) => (Array.isArray(arr) ? arr.slice(0, 4) : []);
  return {
    supportive: take4(buckets?.supportive || []),
    neutral: take4(buckets?.neutral || []),
    avoid: take4(buckets?.avoid || []),
  };
}
function buildTakeawayLine_X(report: any): { line: string; evidence: string[] } {
  const pls = getPlanets(report);

  const moon = findPlanet(report, "Moon");
  const sat = findPlanet(report, "Saturn");
  const rahu = findPlanet(report, "Rahu");
  const mars = findPlanet(report, "Mars");
  const sun = findPlanet(report, "Sun");

  const ev: string[] = [];
  const moonH = getHouseNum_X(moon);

  const moonS = safeStr(moon?.sign, "");
  if (moon) ev.push(`Moon: ${planetLabel(moon)}`);
  if (sat) ev.push(`Saturn: ${planetLabel(sat)}`);
  if (rahu) ev.push(`Rahu: ${planetLabel(rahu)}`);
  if (mars) ev.push(`Mars: ${planetLabel(mars)}`);
  if (sun) ev.push(`Sun: ${planetLabel(sun)}`);

  // If you have dasha info on report, include it (only if present)
  const md = safeStr(report?.dashaLayers?.md?.planet ?? report?.dasha?.md ?? "", "");
  const ad = safeStr(report?.dashaLayers?.ad?.planet ?? report?.dasha?.ad ?? "", "");
  if (md) ev.push(`MD: ${md}`);
  if (ad) ev.push(`AD: ${ad}`);

  // Build a click line based on the strongest real anchors we have
  const moonZone =
  moonH != null
    ? houseTheme(moonH)
    : (moonS ? `Moon in ${titleCase(moonS)}` : "your emotional center");

  const pressure =
    (sat || rahu || mars)
      ? "Pressure is coming from responsibility + restlessness  so the mind wants quick closure."
      : "The mind wants clean closure  not more input.";

  const remedy =
    moonH === 6
      ? "Your win is simple: fix one routine (sleep/food/body) and everything else gets easier."
      : moonH === 8
      ? "Dont force certainty. Make one safe move, reduce exposure, and let clarity arrive."
      : moonH === 12
      ? "You need quiet to think. Reduce stimulation and decide after youve rested."
      : "Choose one priority, remove noise, and follow through steadily.";

  const line = `Takeaway: your emotions are concentrating around ${moonZone}. ${pressure} ${remedy}`;

  return { line, evidence: ev.slice(0, 6) };
}

  // ---------- Premium blocks (Tier-2) ----------
  const activationBullets: string[] = [];
  if (asc) activationBullets.push(`Ascendant anchor: ${titleCase(asc)} rising (your baseline lens).`);
  if (moon) activationBullets.push(`Moon tone: ${titleCase(moon)} (your emotional processing style).`);
  const moonHouseN = Number(moonHouse);
if (Number.isFinite(moonHouseN) && moonHouseN >= 1 && moonHouseN <= 12) {
  activationBullets.push(
    `Moon house emphasis: House ${moonHouseN} (where emotions go first).`
  );
}
  if (md || ad) activationBullets.push(`Running dasha: ${md || ""} / ${ad || ""} (the inner weather).`);
  if (activePlanet) activationBullets.push(`Todays strongest lever: ${titleCase(activePlanet)} (what responds fastest).`);

  // Operating manual based on your existing decision buckets (feels practical + reusable)
  const doList = (buckets?.supportive || []).slice(0, 3);
  const maintainList = (buckets?.neutral || []).slice(0, 3);
  const avoidList = (buckets?.avoid || []).slice(0, 3);

  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          {isPro ? "Advanced Pro - Decision intelligence" : "Advanced - Preview"}
        </div>

        <div className="mt-1 text-lg font-semibold text-slate-100">
          {isPro
            ? "Your chart, translated into practical timing and choices."
            : "A glimpse of your deeper map  unlock to see the full decision layer."}
        </div>

        <div className="mt-1 text-sm text-white/70">
          {isPro
            ? "Everything shown below is anchored in your report data. Full Plan adds exact dated windows + day-by-day guidance."
            : "Upgrade to Advanced Pro to unlock chart-specific activations, dasha - transit clarity, and your operating playbook."}
        </div>
      </div>

      {/* If NOT Pro: show a strong, tempting paywall section (no generic filler) */}
      {!isPro ? (
        <Locked title="What Advanced Pro unlocks">
          <div className="text-sm text-white/80 leading-relaxed">
            Youll unlock three things that make Sarathi feel real:
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              {
                h: "Current activations",
                b: "Your ascendant, Moon emphasis, running dasha, and todays strongest lever  summarised cleanly.",
              },
              {
                h: "Dasha  transit clarity",
                b: "Why this period feels intense/slow/confusing  without fear language.",
              },
              {
                h: "Decision playbook",
                b: "Do / Maintain / Avoid guidance that matches your current cycle.",
              },
            ].map((x) => (
              <div
                key={x.h}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  {x.h}
                </div>
                <div className="mt-2 text-sm text-white/80 leading-relaxed">
                  {x.b}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link href="/sarathi/upgrade" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Unlock Advanced Pro</Button>
            </Link>
            <Link href="/sarathi/chat" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-white"
              >
                Ask Sarathi
              </Button>
            </Link>
          </div>
        </Locked>
      ) : null}

      {/* Pro content */}
      {isPro ? (
        <>
          {/* Current activations */}
          <Locked title="Current activations (chart-specific)">
            <div className="text-sm text-white/80 leading-relaxed">
              This is what your chart is emphasizing right now - kept clean, factual, and usable.
            </div>

            <ul className="mt-3 list-disc pl-5 text-sm text-white/75 space-y-2">
              {activationBullets.length ? (
                activationBullets.map((s, i) => <li key={i}>{s}</li>)
              ) : (
                <li>
                  Your report doesn't include activation anchors yet. Once added, this block will show ascendant, Moon emphasis, dasha stack, and the current lever.
                </li>
              )}
            </ul>

            <div className="mt-3 text-xs text-white/60">
              Full Plan adds: degree-precise hits + exact date windows for each activation.
            </div>
          </Locked>
{/* 0) TAKEAWAY (the click moment) */}
<Locked title="Now and near future (paid guidance)">
  {!plan ? (
  <div className="text-sm text-white/70">
    Near-future plan is not available yet. Please regenerate.
  </div>
) : (
    <div className="space-y-5">
      <div className="text-lg font-semibold text-slate-100">
        {plan.headline}
      </div>

      {/* NOW 3 DAYS (Upgraded) */}
<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
    Now and next 3 days
  </div>
 {Array.isArray(transitNow) && transitNow.length > 0 && (
  <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
    <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
      Transit snapshot (what’s active)
    </div>
    <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
      {transitNow.slice(0, 6).map((p: any, i: number) => (
        <li key={i}>
          {p?.name} in {p?.sign}
          {p?.house ? ` (H${p.house})` : ""}
        </li>
      ))}
    </ul>
  </div>
)}


  {/* Focus areas (like 14d cards) */}
  {Array.isArray(plan.now3Days.focusAreas) && plan.now3Days.focusAreas.length > 0 && (
    <div className="mt-3 grid gap-2 md:grid-cols-2">
      {plan.now3Days.focusAreas.slice(0, 6).map((a: any, i: number) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-sm font-semibold text-white/90">{a?.area}</div>
          <div className="mt-1 text-xs text-white/70">{a.why}</div>
        </div>
      ))}
    </div>
  )}

  {/* If no focusAreas exist yet, fallback to themes */}
  {(!Array.isArray(plan.now3Days.focusAreas) || plan.now3Days.focusAreas.length === 0) &&
    Array.isArray(plan.now3Days.themes) && plan.now3Days.themes.length > 0 && (
      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
          Themes (keep simple)
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
          {plan.now3Days.themes.slice(0, 4).map((x: string, i: number) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
    )}

  {/* Likely scenarios */}
  {Array.isArray(plan.now3Days.likelyScenarios) && plan.now3Days.likelyScenarios.length > 0 && (
    <div className="mt-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
        Likely scenarios (what may show up)
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
        {plan.now3Days.likelyScenarios.slice(0, 5).map((x: string, i: number) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Do now / Don't do (tight) */}
  <div className="mt-4 grid gap-3 md:grid-cols-2">
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-100/90">
        Do now
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
        {(plan.now3Days.do ?? []).slice(0, 4).map((x: unknown, i: number) => (
  <li key={i}>{bulletText(x)}</li>
))}
      </ul>
    </div>

    <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-red-100/90">
        Don't do
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
        {(plan.now3Days.avoid ?? []).slice(0, 4).map((x: unknown, i: number) => (
  <li key={i}>{bulletText(x)}</li>
))}
      </ul>
    </div>
  </div>

  {/* 10-min reset */}
  {Array.isArray(plan.now3Days.remedies) && plan.now3Days.remedies.length > 0 && (
    <div className="mt-4 rounded-xl border border-white/10 bg-indigo-950/40 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
        10-minute reset (optional)
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
        {plan.now3Days.remedies.slice(0, 3).map((x: string, i: number) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  )}
</div>

      {/* NEXT 14 DAYS */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Next 14 days
        </div>

        {Array.isArray(plan.next14Days.areasActivated) && plan.next14Days.areasActivated.length > 0 && (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {plan.next14Days.areasActivated.slice(0, 6).map((a: any, i: number) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-sm font-semibold text-white/90">{a?.area}</div>
                <div className="mt-1 text-xs text-white/70">{a.why}</div>
              </div>
            ))}
          </div>
        )}

        {Array.isArray(plan.next14Days.likelyScenarios) && plan.next14Days.likelyScenarios.length > 0 && (
          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
              Likely scenarios
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
              {plan.next14Days.likelyScenarios.slice(0, 8).map((x: string, i: number) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(plan.next14Days.steeringPlan) && plan.next14Days.steeringPlan.length > 0 && (
          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
              Steering plan
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
              {plan.next14Days.steeringPlan.slice(0, 8).map((x: string, i: number) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(plan.next14Days.timing) && plan.next14Days.timing.length > 0 && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
              Timing windows
            </div>
            <div className="mt-2 space-y-2 text-sm text-white/85">
              {plan.next14Days.timing.slice(0, 6).map((t: any, i: number) => (
                <div key={i}>
                  <span className="text-white/90 font-semibold">{t.window}</span>
                  <span className="text-white/70">  {t.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(plan?.next14Days?.remedies) && plan.next14Days.remedies.length > 0 && (
          <div className="mt-4 text-xs text-white/70">
            Remedies: {plan.next14Days.remedies.slice(0, 3).join(" - ")}
          </div>
        )}
      </div>

     {/* NEXT 30 DAYS (Upgraded) */}
<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
    Next 30 days
  </div>

  {/* Activated areas (cards like 14d) */}
  {Array.isArray(plan.next30Days.areasActivated) && plan.next30Days.areasActivated.length > 0 && (
    <div className="mt-3 grid gap-2 md:grid-cols-2">
      {plan.next30Days.areasActivated.slice(0, 6).map((a: any, i: number) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-sm font-semibold text-white/90">{a?.area}</div>
          <div className="mt-1 text-xs text-white/70">{a?.why}</div>
        </div>
      ))}
    </div>
  )}

  {/* 30-day runway (3 slices) */}
  {Array.isArray(plan.next30Days.runway) && plan.next30Days.runway.length > 0 && (
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      {plan.next30Days.runway.slice(0, 3).map((p: any, i: number) => (
        <div key={i} className="rounded-xl border border-white/10 bg-indigo-950/40 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
            {p.label || (i === 0 ? "Weeks 12" : i === 1 ? "Weeks 34" : "By day 30")}
          </div>
          <div className="mt-2 text-sm text-white/85 leading-relaxed">
            {p.focus}
          </div>

          {Array.isArray(p.likely) && p.likely.length > 0 ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-white/80 space-y-1">
              {p.likely.slice(0, 3).map((x: string, j: number) => (
                <li key={j}>{x}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  )}

  {/* Practical grid (trimmed) */}
  <div className="mt-4 grid gap-3 md:grid-cols-3">
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-100/90">
        Priority wins
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
        {(plan.next30Days.priorityWins ?? []).slice(0, 4).map((x: string, i: number) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>

    <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-red-100/90">
        Watch-outs
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
        {(plan.next30Days?.watchouts ?? []).slice(0, 4).map((x: string, i: number) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>

    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
        System to install
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm text-white/85">
        {(plan.next30Days?.systemToInstall ?? []).slice(0, 4).map((x: string, i: number) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  </div>
</div>

      {/* EVIDENCE */}
<div className="text-xs text-white/60">
  Phase: {plan.evidence.phase || "-"}
</div>

{/* TRANSIT TRIGGERS */}
{Array.isArray(plan?.evidence?.transitsUsed) && plan.evidence.transitsUsed.length > 0 && (
  <div className="mt-2">
    <div className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
      Transit triggers (windows)
    </div>

    <div className="mt-2 flex flex-wrap gap-2">
      {plan.evidence.transitsUsed.slice(0, 8).map((x: string, i: number) => (
        <span
          key={i}
          className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-white/80"
        >
          {x}
        </span>
      ))}
    </div>
  </div>
)}

{/* NATAL ANCHORS */}
{Array.isArray(plan.evidence.anchorsUsed) && plan.evidence.anchorsUsed.length > 0 && (
  <div className="mt-3">
    <div className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
      Natal anchors (your chart)
    </div>

    <div className="mt-2 flex flex-wrap gap-2">
      {plan.evidence.anchorsUsed.slice(0, 10).map((x: string, i: number) => (
        <span
          key={i}
          className="rounded-full border border-white/15 bg-indigo-950/30 px-2 py-1 text-[11px] text-white/70"
        >
          {x}
        </span>
      ))}
    </div>
  </div>
)}

<div className="text-sm text-white/80">{plan.closing}</div>
</div>
)}
</Locked>

          {/* 1) WHY THIS PHASE FEELS LIKE THIS */}
<Locked title="Why this phase feels the way it does">
  <div className="text-sm text-white/80 leading-relaxed">
    This is the current weather of your chart - explained plainly, without fear language.
  </div>

  <ul className="mt-3 list-disc pl-5 text-sm text-white/75 space-y-2">
    {why.bullets.map((b, i) => (
      <li key={i}>{b}</li>
    ))}
  </ul>

  {why.evidence.length ? (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
        Based on your chart
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {why.evidence.map((e, i) => (
          <span
            key={i}
            className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-white/70"
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  ) : null}
</Locked>

{/* 2) YOUR CURRENT OPERATING MODE */}
<Locked title="Your operating mode (how you function best right now)">
  <div className="text-sm text-white/85 leading-relaxed">{operatingMode}</div>
</Locked>

          {/* Decision Playbook (less generic framing, more operating manual) */}
          <div className="rounded-2xl border border-white/15 bg-indigo-950/40 p-4 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Your decision playbook (right now)
            </div>
            <div className="mt-1 text-sm text-white/70">
              This is how to work with your current cycle, not against it.
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  Do more of this
                </div>
                <ul className="mt-2 list-disc pl-4 text-xs text-white/80 space-y-1">
                  {doList.length ? doList.map((s: string, i: number) => <li key={i}>{s}</li>) : <li></li>}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-200">
                  Maintain / stabilise
                </div>
                <ul className="mt-2 list-disc pl-4 text-xs text-white/80 space-y-1">
                  {maintainList.length ? maintainList.map((s: string, i: number) => <li key={i}>{s}</li>) : <li></li>}
                </ul>
              </div>

              <div className="rounded-xl border border-red-400/25 bg-red-500/10 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-red-200">
                  Avoid / proceed carefully
                </div>
                <ul className="mt-2 list-disc pl-4 text-xs text-white/80 space-y-1">
                  {avoidList.length ? avoidList.map((s: string, i: number) => <li key={i}>{s}</li>) : <li></li>}
                </ul>
              </div>
            </div>

            <div className="mt-3 text-xs text-white/60">
              Full Plan adds: exact dates + why this bucket is active with chart evidence.
            </div>
            {/* Signature Insight (Pro mic-drop) */}
<Locked title="Your signature insight (right now)">
  <div className="text-sm text-white/85 leading-relaxed">
    {buildSignatureInsightX(report)}
  </div>
  <div className="mt-3 text-xs text-white/60">
    Full Plan adds: dated windows + why evidence for each insight.
  </div>
</Locked>
{/* 4) ENERGY & EMOTIONAL RULES */}
<Locked title="Energy & emotional rules (to stay steady)">
  <ul className="list-disc pl-5 text-sm text-white/80 space-y-2">
    {rules.map((r0, i) => (
      <li key={i}>{r0}</li>
    ))}
  </ul>
</Locked>

          </div>
       </>
      ) : null}

      {/* Final CTA */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
        <div className="text-sm font-semibold text-slate-100">
          Want the complete picture?
        </div>
        <div className="mt-1 text-sm text-white/70">
          Full Plan unlocks exact dated windows, deeper personalization, and day-by-day guidance across life areas.
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Link href="/sarathi/upgrade" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Unlock Full Guidance</Button>
          </Link>
          <Link href="/sarathi/chat" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-white"
            >
              Ask Sarathi
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-white/50">
        This guidance evolves as your cycles shift. Revisit anytime to realign with what matters most.
      </div>
    </div>
  );
};

type TabFullPlanProps = {
  report: LifeReportView | null;
  mounted: boolean;
  isPro: boolean;
  dailyHighlights: DailyHighlight[];
  dailyLoading: boolean;
  dailyError: string | null;
  notificationsPreview: any | null;
  dashaTimeline?: any[] | null;
};


/* ---------------- Main Shell ---------------- */


type LifeReportShellProps = {
  initialName?: string;
  initialDateISO?: string;
  initialTime?: string;
  initialTz?: string;
  initialLat?: string;
  initialLon?: string;
};

const LifeReportShell: React.FC<LifeReportShellProps> = ({
  initialName = "",
  initialDateISO = "",
  initialTime = "",
  initialTz = "Asia/Dubai",
  initialLat = "",
  initialLon = "",
}) => {
  const [name, setName] = useState(initialName);
  const [dateISO, setDateISO] = useState(initialDateISO);
  const [time, setTime] = useState(initialTime);
  const [tz, setTz] = useState(initialTz);
    const [notificationTz, setNotificationTz] = useState<string>(initialTz);
   const [jobPrediction, setJobPrediction] = useState<any | null>(null);
  const [jobPredictionError, setJobPredictionError] = useState<string | null>(null);
  // Detect / load notification timezone dynamically on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const settings = ensureNotificationTz(initialTz);
      setNotificationTz(settings.tz);
      console.log("[sarathi] notificationTz", settings.tz);
    } catch {
      // fall back silently
    }
  }, [initialTz]);
  const [engineUnavailable, setEngineUnavailable] = useState<string | null>(null);
  const aiCtrlRef = useRef<AbortController | null>(null);
  const [dashaTransitSummary, setDashaTransitSummary] = useState<string>("");

  const [place, setPlace] = useState<PlaceLite | null>(() => {
    if (initialLat && initialLon) {
      const lat = parseFloat(initialLat);
      const lon = parseFloat(initialLon);
      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        return { name: "Custom location", lat, lon, tz };
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
  setMounted(true);
}, []);
  const router = useRouter();
const pathname = usePathname();
const setTabFromUrl = useCallback(
  (t: "overview" | "phases" | "now" | "advanced" | "full") => {
    setActiveTab(t);
  },
  []
);
const isPro =
  mounted &&
  typeof window !== "undefined" &&
  String(window.localStorage.getItem("sarathi_plan") || "free").toLowerCase() === "pro";

    // Read ?tab= from URL on first mount (deep-link to a tab)
// Read ?tab= from URL on first mount (deep-link to a tab)
useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    const sp = new URLSearchParams(window.location.search);
    const t = (sp.get("tab") || "").toLowerCase();

    if (
  t === "overview" ||
  t === "phases" ||
  t === "now" ||
  t === "advanced" ||
  t === "full"
) {
  setTabFromUrl(t as any);
}

  } catch {
    // ignore
  }
}, []);


  const [dashaTimeline, setDashaTimeline] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [report, setReport] = useState<LifeReportView | null>(null);
  const [lastReportKey, setLastReportKey] = useState<string | null>(null);

  const [aiSummary, setAiSummary] = useState<string>("");
  const [timelineSummary, setTimelineSummary] = useState<string>("");

  const [transits, setTransits] = useState<TransitHit[]>([]);
  const [transitsLoading, setTransitsLoading] = useState(false);
  const [transitsError, setTransitsError] = useState<string | null>(null);
  const [transitSummary, setTransitSummary] = useState<string>("");
  const [transitNow, setTransitNow] = useState<any[]>([]);

  type MonthlyInsight = { label: string; text: string };
  const [monthlyInsights, setMonthlyInsights] = useState<MonthlyInsight[]>([]);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);


  type WeeklyInsightLocal = { label: string; text: string };
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsightLocal[]>([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);

      type DailyHighlightLocal = {
  dateISO: string;
  headline?: string;
  mood?: string;        // short: Uplifting, Emotionally heavy, etc.
  moodText?: string;    // one-line description of how it feels
  text: string;
  color?: string;
luckyNumber?: number;
bestTime?: string;
  // optional bullets
  do?: string[];
  avoid?: string[];
  confidence?: "high" | "medium" | "low";
  facts?: string[];
};




  const [dailyHighlights, setDailyHighlights] = useState<DailyHighlightLocal[]>([]);
  const [dailyLoading, setDailyLoading] = useState<boolean>(false);
  const [dailyError, setDailyError] = useState<string | null>(null);

      type MythCardLocal = {
    myth: string;
    reality: string;
    personalNote?: string;
  };

  type SarathiNotification = {
    id: string;
    domain: string;
    text: string;
  };

  type NotificationPreviewBuckets = {
    morning?: SarathiNotification[];
    midday?: SarathiNotification[];
    evening?: SarathiNotification[];
  };

  const [notificationsPreview, setNotificationsPreview] =
    useState<NotificationPreviewBuckets | null>(null);

  
  const [guide, setGuide] = useState<{
    emotionalWeather?: EmotionalWeather;
    food?: FoodGuide;
    fasting?: FastingGuide;
    moneyTip?: MoneyTip;
  } | null>(null);


useEffect(() => {
  console.log("[predict-effect] report changed", report);

  if (!report) {
    setJobPrediction(null);
    setJobPredictionError(null);
    return;
  }

  const birthDateISO = report.birthDateISO;
  const birthTime = report.birthTime;
  const birthTz = report.birthTz;
  const lat = report.birthLat;
  const lon = report.birthLon;
  const placeName = report.name || "";

  if (!birthDateISO || !birthTime || !birthTz) {
    setJobPrediction(null);
    setJobPredictionError("Missing birth data for prediction.");
    return;
  }

  let cancelled = false;

  async function runPrediction() {
    try {
      setJobPredictionError(null);

      const body = {
        category: "job",
        birthDateISO,
        birthTime,
        birthTz,
        lat,
        lon,
        placeName,
      };

      console.log("[predict-effect] calling /api/sarathi/predict with", body);

      const res = await fetch("/api/sarathi/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("[predict-effect] response status", res.status);

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("job prediction failed", res.status, txt);
        if (!cancelled) {
          setJobPrediction(null);
          setJobPredictionError("Could not load career window.");
        }
        return;
      }

      const json = await res.json();
      console.log("[predict-effect] prediction json", json);

      if (!cancelled) {
        setJobPrediction(json);
        setJobPredictionError(null);
      }
    } catch (err) {
      console.error("job prediction error", err);
      if (!cancelled) {
        setJobPrediction(null);
        setJobPredictionError("Could not load career window.");
      }
    }
  }

  runPrediction();

  return () => {
    cancelled = true;
  };
}, [report]);

  const [guideError, setGuideError] = useState<string | null>(null);
  // listen for timezone events from city picker
  useEffect(() => {
    const handler = (e: any) => {
      const newTz = e?.detail;
      if (typeof newTz === "string" && newTz !== tz) setTz(newTz);
    };
    window.addEventListener("sarathi:set-tz", handler);
    return () => window.removeEventListener("sarathi:set-tz", handler);
  }, [tz]);

const todaysFocus = useMemo(
  () =>
    buildTodaysFocusV2({
      report,
      dashaStack: (report as any)?.dashaStack ?? null,
      transits: null, // we'll wire real transits later
    }),
  [report]
);

  // ---- Saved profiles (local only) ----
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");

  // Load profiles from localStorage on first mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("sarathi_profiles_v1");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setProfiles(parsed);
      }
      
    } catch (e) {
      console.warn("Could not load stored profiles", e);
    }
  }, []);
   
    const handleSaveProfile = useCallback(() => {
  // basic validation
  if (
  !dateISO ||
  !time ||
  !tz ||
  typeof place?.lat !== "number" ||
  typeof place?.lon !== "number"
) {

    alert("Fill birth date, time & place before saving a profile.");
    return;
  }
  
  const trimmedName = (name || "").trim() || "Default";
  const profileId = `${trimmedName} ï¿½ ${dateISO}`;

  // Shape that Life Report / SavedProfile uses
  const savedProfile: SavedProfile = {
    id: profileId,
    label: profileId,
    name: trimmedName,
    birthDateISO: dateISO,
    birthTime: time,
    birthTz: tz,
    lat: place.lat,
    lon: place.lon,
    placeName: place.name || "",
  };

  // merge into profiles list (override if same id exists)
  const nextProfiles: SavedProfile[] = [
    ...profiles.filter((p) => p.id !== profileId),
    savedProfile,
  ];

  // update state
  setProfiles(nextProfiles);

  // persist to localStorage
  try {
    localStorage.setItem("sarathi_profiles_v1", JSON.stringify(nextProfiles));
  } catch (e) {
    console.warn("[life-report] failed to persist profiles", e);
  }
    // Also set the ACTIVE profile for the whole app (Chat, Daily Guide, etc.)
  saveBirthProfile({
    name: trimmedName,
    dobISO: dateISO,
    tob: time,
    place: {
      name: place?.name || "",
      tz: tz,
      lat: Number(place.lat),
      lon: Number(place.lon),
    },
  });


  // auto-select the newly saved profile
  setSelectedProfileId(profileId);
}, [name, dateISO, time, tz, place, profiles, setProfiles, setSelectedProfileId]);


  const handleSelectProfile = useCallback(
    (id: string) => {
      setSelectedProfileId(id);
      const prof = profiles.find((p) => p.id === id);
      if (!prof) return;

      setName(prof.name);
      setDateISO(prof.birthDateISO);
      setTime(prof.birthTime);
      setTz(prof.birthTz);
      setPlace({
        name: prof.placeName,
        lat: prof.lat,
        lon: prof.lon,
      });
    },
    [profiles]
  );

  function renderPlacement(pl: PlanetRow & Record<string, any>, i: number) {
    const d = dignity(pl.name, pl.sign);
    const retro =
      pl.retro === true ||
      pl.isRetro === true ||
      String(pl.motion || "").toLowerCase() === "retrograde";

    return (
      <div
        key={`${pl.name ?? "pl"}-${i}`}
        className="rounded-lg border border-muted-foreground/20 bg-muted/40 p-3"
      >
        <div className="flex items-center justify-between">
          <div className="font-medium">
            {pl.name}
            {pl.sign ? (
              <span className="ml-2 text-xs text-white/70">
                in {pl.sign}
              </span>
            ) : null}
            {typeof pl.house === "number" ? (
              <span className="ml-2 text-xs rounded-md px-1.5 py-0.5 bg-foreground/5">
                House {pl.house}
              </span>
            ) : null}
          </div>

          <div
            className={
              "text-[11px] px-2 py-0.5 rounded-md " +
              (d.weight > 1
                ? "bg-emerald-100 text-emerald-800"
                : d.weight === 1
                ? "bg-teal-100 text-teal-800"
                : d.weight === 0
                ? "bg-slate-100 text-white/70"
                : "bg-red-100 text-red-800")
            }
          >
            {d.tag}
          </div>
        </div>

        <div className="mt-1 text-[11px] text-white/70">
          {retro ? "Retrograde ? " : ""}
          {pl.nakshatra ? `Nakshatra: ${pl.nakshatra}` : " "}
        </div>
      </div>
    );
  }

  // Disable auto-restore
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sarathi.report.v3");
      if (!saved) return;
      // keep cached only; don't auto-setReport
    } catch {}
  }, []);

  // Clear report when inputs change
  useEffect(() => {
  setReport(null);
  setActiveTab("overview");
}, [dateISO, time, tz, place?.lat, place?.lon]);

// Ensure activeTab is always valid (prevents blank screen)
useEffect(() => {
  const allowed = new Set(["overview", "phases", "now", "advanced"]);
  if (!allowed.has(activeTab as any)) setActiveTab("overview");
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);



 const handleGenerate = useCallback(async () => {
  setLoading(true);
  setError(null);
  setAiSummary("");
  setTimelineSummary("");
  setTransits([]);
  setTransitsError(null);
  setTransitsLoading(false);
  setTransitSummary("");
  setDashaTransitSummary("");
  setMonthlyInsights([]);
  setMonthlyError(null);
  setMonthlyLoading(false);
  setWeeklyInsights([]);
  setWeeklyError(null);
  setWeeklyLoading(false);
  setDailyHighlights([]);
  setDailyError(null);
  setDailyLoading(false);
  setEngineUnavailable(null);

  try {
  // --- validate date ---
const rawDate = (dateISO || "").trim();
if (!rawDate) {
  setError("Please enter your birth date.");
  setLoading(false);
  return;
}

const d =
  /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
    ? rawDate
    : normalizeDateForBackend(rawDate);

if (!d) {
  setError("Birth date must be in YYYY-MM-DD format.");
  setLoading(false);
  return;
}

// --- validate time (always end up with a string HH:MM or exit early) ---
const rawTime = (typeof time === "string" ? time : "").trim();

if (!rawTime) {
  setError("Please enter your birth time.");
  setLoading(false);
  return;
}

const normalized = normalizeTimeForBackend(rawTime);
const t: string | null = /^\d{2}:\d{2}$/.test(rawTime) ? rawTime : normalized;

if (!t) {
  setError("Birth time must be in HH:MM format.");
  setLoading(false);
  return;
}

const dISO = String(d);

if (!place?.lat || !place?.lon) {
      throw new Error("Pick a birth place from the dropdown.");
    }
    const payload = {
      name: name || "User",
      birthDateISO: dISO,
      birthTime: t,
      birthTz: tz,
      lat: place.lat,
      lon: place.lon,
      placeName: place.name,
      notificationTz,
    };
    console.log("[PAYLOAD life-report]", payload);

    // --- call /api/life-report ---
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 180000);
console.log("[life-report] sending payload", payload);

    let res: Response;
    try {
      const url = "/api/life-report";
      res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache",
          pragma: "no-cache",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
        signal: ac.signal,
      });
   } catch (err) {
  clearTimeout(timeout);
  throw new Error(
    (err as any)?.name === "AbortError"
      ? "Report generation is taking longer than expected. Please try again (or retry in a moment)."
      : "Network error while contacting /api/life-report."
  );
}
console.log("[life-report] response status", res.status);

    clearTimeout(timeout);

   if (!res.ok) {
  const raw = await res.text().catch(() => "");
  let msg = raw;

  try {
    const j = raw ? JSON.parse(raw) : null;
    msg =
      j?.marker
        ? `${j.marker}\n${j.message || ""}\n${j.stack || ""}`.trim()
        : j?.message || j?.error || j?.details || raw || `Server returned ${res.status}`;
  } catch {
    msg = raw || `Server returned ${res.status}`;
  }

  console.error("[life-report] API failed:", res.status, msg);
  throw new Error(typeof msg === "string" && msg.trim() ? msg : `Server returned ${res.status}`);
}


const envelope: any = await res.json();

// ï¿½ Unwrap: get the ACTUAL report object that contains nowPlan/nowNearFuture
const data: any =
  envelope?.report ??
  envelope?.lifeReport ??
  envelope?.result?.report ??
  envelope?.data?.report ??
  envelope?.payload?.report ??
  envelope; // fallback: sometimes the API returns the report at top-level

// Debug to prove the fix
console.log("[life-report] envelope keys:", Object.keys(envelope || {}));
console.log("[life-report] data keys:", Object.keys(data || {}));
console.log(
  "[life-report] data.nowPlan?",
  !!data?.nowPlan,
  "data.nowNearFuture?",
  !!data?.nowNearFuture
);
console.log("[life-report] headline:", data?.nowPlan?.headline);

// ï¿½ IMPORTANT: from this point forward, use `data` as your life report object


// ?? STEP 2: call /api/ai-personality using the REAL life-report payload
try {
  const pRes = await fetch("/api/ai-personality", {
    method: "POST",
    headers: { "content-type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ report: data }),
  });

  // Always read as TEXT first (covers HTML / 502 pages / non-JSON errors)
  const pText = await pRes.text();

  // Try parse JSON (optional)
  let pJson: any = null;
  try {
    pJson = pText ? JSON.parse(pText) : null;
  } catch {
    pJson = null;
  }

  if (!pRes.ok) {
    const errMsg =
      pJson?.error ||
      pJson?.message ||
      (pText ? pText.slice(0, 800) : "") ||
      `ai-personality failed (${pRes.status})`;

    console.error("ai-personality failed:", pRes.status, { json: pJson, text: pText });

    // TEMP: surface real reason on UI
    setAiSummary(`(DEBUG) ai-personality failed: ${errMsg}`);
  } else {
    // Your API returns: { ok:true, text:[...], closing:"..." }
    const bullets = Array.isArray(pJson?.text) ? pJson.text : [];
    const closing = typeof pJson?.closing === "string" ? pJson.closing : "";

    // Store as string so renderer can parse consistently
    const asString = JSON.stringify({ text: bullets, closing });
    setAiSummary(asString);

    console.log("[AI SUMMARY RAW]", asString.slice(0, 120));
  }
} catch (e: any) {
  console.error("ai-personality crashed", e?.message ?? e);
  setAiSummary(`(DEBUG) ai-personality crashed: ${e?.message ?? String(e)}`);
}

    // ?? Notifications from API ï¿½ state (all 3 buckets)
    const anyData = data as any;
    const preview = anyData.previewNotifications ?? null;
    if (preview && typeof preview === "object") {
      console.log("[life-report] previewNotifications", preview);
      setNotificationsPreview(preview as any);
    } else {
      setNotificationsPreview(null);
    }

    // (optional debug)
    console.log("[life-report] notificationFacts", anyData.notificationFacts);
    console.log(
      "[life-report] notificationsPreview",
      anyData.previewNotifications?.morning
    );

    // --- normalize planet & aspect data ---
        const planets = pickPlanets(data);
    const aspects = pickAspects(data);

    const timeStr =
  typeof t === "string"
    ? t
    : typeof (data as any)?.meta?.birthTime === "string"
      ? (data as any).meta.birthTime
      : typeof (data as any)?.birth?.time === "string"
        ? (data as any).birth.time
        : typeof (data as any)?.profile?.birthTime === "string"
          ? (data as any).profile.birthTime
          : "06:00"; // safe fallback

const birthInstant = makeUtcInstant(
  d,
  timeStr,
  coerceTz(
    (data as any)?.meta?.tz ??
      (data as any)?.meta?.timezone ??
      (data as any)?.birth?.tz ??
      (data as any)?.profile?.birthTz,
    "Asia/Dubai"
  )
);


    const rawPlanets: any[] =
  (data as any)?.raw?.planets ??
  (data as any)?.rawPlanets ??
  (data as any)?.planets ??
  [];

    function siderealFromRaw(label: "sun" | "moon"): number | undefined {
      const r = rawPlanets.find(
        (p) =>
          String(p.name ?? p.planet ?? "").toLowerCase() === label
      );
      if (!r) return undefined;

      const sid =
        toNum(
          r?.siderealLongitude ??
            r?.sidereal_longitude ??
            r?.sidereal_long ??
            r?.siderealLon
        );
      if (sid !== undefined) return mod360(sid);

      const trop =
        toNum(
          r?.longitude ??
            r?.lon ??
            r?.eclipticLongitude ??
            r?.lambda ??
            r?.deg ??
            r?.degree
        );
      if (trop !== undefined) return toSidereal(trop, birthInstant);

      return undefined;
    }

    let sunSid = siderealFromRaw("sun");
    let moonSid = siderealFromRaw("moon");

    if (sunSid === undefined) {
      const sPl = planets.find(
        (pl) => (pl.name || "").toLowerCase() === "sun"
      );
      if (sPl) sunSid = guessSiderealDegFrom(sPl);
    }
    if (moonSid === undefined) {
      const mPl = planets.find(
        (pl) => (pl.name || "").toLowerCase() === "moon"
      );
      if (mPl) moonSid = guessSiderealDegFrom(mPl);
    }

    const derivedMoonNakshatra =
      moonSid !== undefined ? nakFromDeg(moonSid) : undefined;
    const derivedYoga = computeYogaName(sunSid, moonSid);
    const derivedKarana = computeKaranaName(sunSid, moonSid);
    const basePanchang = normalizePanchang(
      data?.ascendant?.panchang ?? (data as any)?.panchang
    );
    const derivedWeekday = weekdayFromISODate(d);

    const mergedPanchang: PanchangInfo | undefined =
      basePanchang || derivedYoga || derivedKarana || derivedWeekday
        ? {
            ...(basePanchang ?? {}),
            weekday: derivedWeekday ?? basePanchang?.weekday,
            yogaName: derivedYoga ?? basePanchang?.yogaName,
            karanaName: derivedKarana ?? basePanchang?.karanaName,
            moonNakshatraName:
              basePanchang?.moonNakshatraName ?? derivedMoonNakshatra,
          }
        : undefined;

    const next: LifeReportView = {
      name: payload.name || "",
      birthDateISO: d,
      birthTime: timeStr,
      birthTz: payload.birthTz,
      birthLat: payload.lat,
      birthLon: payload.lon,

      ascSign: data?.ascendant?.ascSign ?? data?.ascSign ?? undefined,
      moonSign: data?.ascendant?.moonSign ?? data?.moonSign ?? undefined,
      sunSign: data?.sunSign ?? data?.raw?.summary?.sunSign ?? undefined,

      ascNakshatraName: data?.ascendant?.ascNakshatraName ?? undefined,
      moonNakshatraName:
        data?.ascendant?.moonNakshatraName ??
        mergedPanchang?.moonNakshatraName ??
        derivedMoonNakshatra,
      moonNakshatraTheme:
        data?.ascendant?.moonNakshatraKeywords ??
        mergedPanchang?.moonNakshatraTheme ??
        (nakTheme(
          data?.ascendant?.moonNakshatraName ??
            mergedPanchang?.moonNakshatraName ??
            derivedMoonNakshatra
        ) ?? undefined),

      panchang: mergedPanchang,
      planets,
      aspects,
      activePeriods: data?.activePeriods,
      lifeMilestones: data?.lifeMilestones,
      dashaTimeline: data?.dashaTimeline,
      // ï¿½ Paid plan blocks from API
  nowPlan: (data as any)?.nowPlan ?? (data as any)?.nowNearFuture ?? undefined,
  nowNearFuture: (data as any)?.nowNearFuture ?? (data as any)?.nowPlan ?? undefined,

  advancedPro: (data as any)?.advancedPro ?? undefined,
  fullPlan: (data as any)?.fullPlan ?? undefined,
  plan: (data as any)?.plan ?? undefined,
    };

    const moonNakFinal =
      next.panchang?.moonNakshatraName ??
      next.moonNakshatraName ??
      derivedMoonNakshatra;

    next.planets = (next.planets || []).map((pl) => {
      if (
        typeof pl?.name === "string" &&
        pl.name.toLowerCase() === "moon"
      ) {
        return moonNakFinal && pl.nakshatra !== moonNakFinal
          ? { ...pl, nakshatra: moonNakFinal }
          : pl;
      }
      const dSid = guessSiderealDegFrom(pl);
      if (dSid !== undefined) {
        const nk = nakFromDeg(dSid);
        if (nk && pl.nakshatra !== nk) return { ...pl, nakshatra: nk };
      }
      return pl;
    });

    if (next.panchang) {
      next.panchang.moonNakshatraName =
        moonNakFinal ?? next.panchang.moonNakshatraName;
    }
    
 

  // --- compute md/ad/pd once for fusion & monthly/weekly ---

let mainDasha: any = null;

let mdPlanet: string | null = null;
let adPlanet: string | null = null;
let pdPlanet: string | null = null;

let mdStart: string | null = null;
let mdEnd: string | null = null;
let adStart: string | null = null;
let adEnd: string | null = null;
let pdStart: string | null = null;
let pdEnd: string | null = null;

if (Array.isArray(next.dashaTimeline) && next.dashaTimeline.length > 0) {
     const todayISO = (() => {
  const tz =
    (next as any)?.birthTz ??
    (payload as any)?.tz ??
    (report as any)?.meta?.birthTz ??
    "UTC";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
})();

   const activeRow =
    (next.dashaTimeline as any[]).find((r: any) => {
      const from = (
        r.fromISO ||
        r.startISO ||
        r.from ||
        r.start ||
        ""
      ).slice(0, 10);
      const to = (
        r.toISO ||
        r.endISO ||
        r.to ||
        r.end ||
        ""
      ).slice(0, 10);
      if (!from || !to) return false;
      return from <= todayISO && todayISO <= to;
    }) || (next.dashaTimeline[0] as any);

  mainDasha = activeRow;

  if (mainDasha) {
    mdPlanet =
      mainDasha.md ||
      mainDasha.mahadasha ||
      mainDasha.mdLord ||
      mainDasha.planet ||
      null;

    adPlanet =
      mainDasha.ad ||
      mainDasha.antardasha ||
      mainDasha.adLord ||
      null;

    pdPlanet =
      mainDasha.pd ||
      mainDasha.pratyantardasha ||
      mainDasha.pdLord ||
      null;

    const fromVal =
      mainDasha.fromISO ||
      mainDasha.startISO ||
      mainDasha.from ||
      mainDasha.start ||
      null;

    const toVal =
      mainDasha.toISO ||
      mainDasha.endISO ||
      mainDasha.to ||
      mainDasha.end ||
      null;

    mdStart = fromVal ? String(fromVal).slice(0, 10) : null;
    mdEnd = toVal ? String(toVal).slice(0, 10) : null;

    // For now, use the same window for AD / PD dates if we don't have finer fields
    adStart = mdStart;
    adEnd = mdEnd;
    pdStart = mdStart;
    pdEnd = mdEnd;
  }
}

 

   
    const md = mainDasha?.md ?? (mainDasha as any)?.mahadasha ?? null;
    const ad = mainDasha?.ad ?? (mainDasha as any)?.antardasha ?? null;
    const pd =
      mainDasha?.pd ?? (mainDasha as any)?.pratyantardasha ?? null;

    // ---------- 4) TRANSITS + AI LAYERS ----------
const loadTransitsAndInsights = async () => {
  try {
    setTransitsLoading(true);
    setTransitsError(null);

    const birth = {
      dateISO: next.birthDateISO,
      time: next.birthTime,
      tz: next.birthTz,
      lat: next.birthLat ?? payload.lat,
      lon: next.birthLon ?? payload.lon,
    };

    const payloadT = {
  birth,
  horizonDays: 365,
  // pass Lagna so server can compute transitHouse + transitNow.house correctly
  ascDeg: (next as any)?.core?.ascDeg ?? (next as any)?.ascDeg ?? null,
  ascSign: (next as any)?.core?.ascSign ?? (next as any)?.ascSign ?? null,
};

let tRes: Response;
let tText = "";
let tJson: any = {};

try {
  tRes = await fetch("/api/transits", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payloadT),
  });

  tText = await tRes.text().catch(() => "");
  try {
    tJson = JSON.parse(tText || "{}");
  } catch {
    tJson = { _raw: tText };
  }
} catch (e: any) {
  console.error("[transits] NETWORK FAIL (fetch threw)", e);
  console.error("[transits] payload:", payloadT);
  setTransits([]);
  setTransitNow([]);
  setTransitsError(
    "Transits request failed to reach the server (network/route crash). Check terminal logs."
  );
  return;
}

setTransitNow(Array.isArray(tJson?.transitNow) ? tJson.transitNow : []);

console.log("[transits] status:", tRes.status);
console.log("[transits] debug:", tJson?._debug);
console.log("[transits] transitNow sample:", tJson?.transitNow?.[0]);
console.log("[transits] first transit sample:", tJson?.transits?.[0]);

if (!tRes.ok || !Array.isArray(tJson?.transits)) {
  console.error("[transits] API failed", tRes.status, tJson);
  setTransits([]);
  setTransitsError(
    `Could not load upcoming transits. (${tRes.status})`
  );
  return;
}


    const hitList = tJson.transits as TransitHit[];

    type DailyMoonRowClient = {
      dateISO: string;
      moonNakshatra: string | null;
      houseFromMoon?: number | null;
    };

    const dailyMoon: DailyMoonRowClient[] = Array.isArray(tJson.dailyMoon)
      ? (tJson.dailyMoon as DailyMoonRowClient[])
      : [];

    setTransits(hitList);

    const todayISO = (() => {
  const tz = (payload as any)?.tz || next?.birthTz || "Asia/Dubai";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
})();


    // -------------------------
// 5) Daily highlights (meaningful, no calculations shown)
// -------------------------
try {
  setDailyLoading(true);
  setDailyError(null);
  setDailyHighlights([]);

  const tz = String((payload as any)?.tz ?? (next as any)?.birthTz ?? "Asia/Dubai");

const dailyFacts = buildDailyFromMoonAndTransits(
  dailyMoon as any,
  hitList,
  todayISO,
  7,
  tz
);


  const safeDailyFacts = Array.isArray(dailyFacts) ? dailyFacts : [];

  // Build facts per day (internal), but do NOT show them in UI
  const dayInputs = safeDailyFacts.slice(0, 7).map((f: any) => {
    const tr = f.strongestTransit;
    const facts: string[] = [];

    if (f.moonNakshatra) facts.push(`Transit Moon nakshatra: ${f.moonNakshatra}`);
    const moonFrom =
  typeof f.relativeHouseFromMoon === "number"
    ? f.relativeHouseFromMoon
    : typeof f.relativeHouse === "number"
    ? f.relativeHouse
    : typeof f.houseFromMoon === "number"
    ? f.houseFromMoon
    : null;

if (typeof moonFrom === "number") {
  facts.push(`Transit Moon is ${moonFrom} from natal Moon`);
}

    if (tr?.planet) facts.push(`Strongest transit: ${tr.planet} ï¿½ ${tr.target || "natal point"}`);
    if (typeof tr?.strength === "number")
      facts.push(`Transit strength: ${Math.round(tr.strength * 100)}%`);
    if (tr?.category) facts.push(`Focus area: ${tr.category}`);
    // --- Add driver tags (plain, no jargon in UI) ---
if (tr?.planet) facts.push(`Driver planet: ${String(tr.planet)}`);
if (typeof tr?.strength === "number") {
  const s = tr.strength;
  facts.push(`Driver intensity: ${s >= 0.65 ? "high" : s >= 0.45 ? "medium" : "low"}`);
}
if (typeof moonFrom === "number") facts.push(`Moon pattern: ${moonFrom}`);

    const strength = typeof tr?.strength === "number" ? tr.strength : 0;
    const confidence: "high" | "medium" | "low" =
      strength >= 0.65 ? "high" : strength >= 0.45 ? "medium" : "low";


    // ---------- derive focusHint ----------
const factsText = facts.join(" ").toLowerCase();

let focusHint = "work";
const focusArea =
  focusHint === "career" || focusHint === "work"
    ? "Work & direction"
    : focusHint === "money"
    ? "Money & decisions"
    : focusHint === "relationships"
    ? "Relationships"
    : focusHint === "home"
    ? "Home & family"
    : focusHint === "health"
    ? "Health & energy"
    : focusHint === "mind"
    ? "Mind & emotions"
    : "Work & direction";

// strongest transit category first (most accurate)
if (tr?.category) {
  const c = String(tr.category).toLowerCase();
  if (c.includes("career")) focusHint = "career";
  else if (c.includes("relationship")) focusHint = "relationships";
  else if (c.includes("health")) focusHint = "health";
  else if (c.includes("inner")) focusHint = "mind";
}

// moon-from-moon fallback
if (typeof moonFrom === "number") {
  if ([2, 11].includes(moonFrom)) focusHint = "money";
  if ([6, 10].includes(moonFrom)) focusHint = "work";
  if ([7].includes(moonFrom)) focusHint = "relationships";
  if ([4].includes(moonFrom)) focusHint = "home";
  if ([12, 8].includes(moonFrom)) focusHint = "mind";
}

// keyword fallback
if (factsText.includes("money") || factsText.includes("budget")) focusHint = "money";
if (factsText.includes("home") || factsText.includes("family")) focusHint = "home";

return {
  dateISO: String(f.dateISO ?? ""),
  facts: facts.filter(Boolean),
  confidence,
  focusHint,   // <-- ADD THIS LINE
  focusArea,
};

  });
  console.log("[ai-daily] dayInputs[0] sample:", dayInputs?.[0]);
 console.log("DAY INPUTS SAMPLE", dayInputs[0]);
  // Try AI (optional). If it fails, fallback will still be good.
  try {
    const aiDailyRes = await fetch("/api/ai-daily-highlights", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        profile: {
          name: next.name,
          birthDateISO: next.birthDateISO,
          birthTime: next.birthTime,
          birthTz: next.birthTz,
        },
        days: dayInputs,
      }),
    });

    const aiJson = await aiDailyRes.json().catch(() => ({} as any));

const outDays: any[] = Array.isArray(aiJson?.days)
  ? aiJson.days
  : Array.isArray(aiJson?.outDays)
  ? aiJson.outDays
  : Array.isArray(aiJson)
  ? aiJson
  : [];

    console.log("[ai-daily] status=", aiDailyRes.status);
console.log("[ai-daily] outDays length=", Array.isArray(outDays) ? outDays.length : "NOT_ARRAY", outDays);
console.log("[ai-daily] dayInputs length=", Array.isArray(dayInputs) ? dayInputs.length : "NOT_ARRAY", dayInputs);

    const aiDaysArr = Array.isArray(outDays) ? outDays : [];

if (aiDailyRes.ok && Array.isArray(dayInputs) && dayInputs.length) {
  const seen = new Set<string>();

function dedupeHeadline(h: string, fallbackTag: string) {
  const base = (h || "").trim() || "Today’s focus";
  const key = base.toLowerCase();
  if (!seen.has(key)) {
    seen.add(key);
    return base;
  }
  const alt = `${base} — ${fallbackTag}`.trim();
  const key2 = alt.toLowerCase();
  if (!seen.has(key2)) {
    seen.add(key2);
    return alt;
  }
  const alt2 = `${fallbackTag}: ${base}`.trim();
  seen.add(alt2.toLowerCase());
  return alt2;
}

  setDailyHighlights(
    dayInputs.map((inp: any, idx: number) => {
      const d: any = aiDaysArr[idx] ?? {};

      const dateISO = String(inp?.dateISO ?? d?.dateISO ?? "").trim();

      const facts = Array.isArray(inp?.facts) ? (inp.facts as string[]) : [];

      const extras = dailyFlavorExtras(dateISO || String(idx));

      const conf: "high" | "medium" | "low" =
        d?.confidence === "high" || d?.confidence === "low" ? d.confidence : "medium";
    // ---- Gold paragraph (Moon nakshatra + Moon-from-Moon + strongest transit) ----
    const df = safeDailyFacts?.[idx] as any;

    const relHouseDay: number | null =
      typeof df?.relativeHouse === "number"
        ? df.relativeHouse
        : typeof df?.relativeHouseFromMoon === "number"
        ? df.relativeHouseFromMoon
        : typeof df?.houseFromMoon === "number"
        ? df.houseFromMoon
        : null;

    const rawCat = String(df?.strongestTransit?.category ?? "general").toLowerCase();
    const cat: "career" | "relationships" | "health" | "inner" | "general" =
      rawCat === "career"
        ? "career"
        : rawCat === "relationships"
        ? "relationships"
        : rawCat === "health"
        ? "health"
        : rawCat === "inner"
        ? "inner"
        : "general";

    const strongDay: StrongTransitLite | null = df?.strongestTransit
      ? {
          planet: String(df.strongestTransit.planet ?? "Transit"),
          target: String(df.strongestTransit.target ?? "a key natal point"),
          category: cat,
          strength: Number(df.strongestTransit.strength ?? 0),
          startISO: String(df.strongestTransit.startISO ?? dateISO),
          endISO: String(df.strongestTransit.endISO ?? dateISO),
        }
      : null;

    const moonNak = String(df?.moonNakshatra ?? "");
    const dg = buildDayGuidance(dateISO, relHouseDay, strongDay, idx, moonNak);

   // ---- headline logic ----

// choose base headline from category
const baseHeadlineGold =
  cat === "career"
    ? "Work & direction"
    : cat === "relationships"
    ? "Relationships & tone"
    : cat === "health"
    ? "Health & energy"
    : cat === "inner"
    ? "Inner clarity"
    : "Steady focus & small wins";

// fallback tag so duplicates become unique
const fallbackTag = (dateISO || `Day ${idx + 1}`).toString();

// FINAL headline (deduped)
const headlineGold = dedupeHeadline(baseHeadlineGold, fallbackTag);
const rawHeadline = String(d?.headline ?? "").trim() || headlineGold;

// ---- text ----
const textGold = String(dg?.expect ?? "").trim();
const text = String(d?.text ?? "").trim() || textGold;


// fallback mood
const mood = String((d?.mood ?? "").trim() || "balanced");
const moodText = String((d?.moodText ?? "").trim() || "");

    return {
      dateISO,
      headline: rawHeadline,
      mood,
      moodText,
      text,
      
      do: Array.isArray(d?.do) && d.do.length ? [...d.do] : [],
      avoid: Array.isArray(d?.avoid) && d.avoid.length ? [...d.avoid] : [],

      color: extras.color,
      luckyNumber: extras.luckyNumber,
      bestTime: extras.bestTime,
      confidence: conf,
      theme: String(d?.theme ?? ""),
      facts,
    };
  })
);


      setDailyError(null);
    } else {
      throw new Error("ai daily returned empty");
    }
  } catch {
    // ï¿½ Meaningful fallback (varies by focus area + emotional tone)
const fallback: DailyHighlightLocal[] = dayInputs.map((d: any, idx: number) => {
  const facts = Array.isArray(d.facts) ? (d.facts as string[]) : [];

  const focusRaw =
    facts.find((x: string) => x.toLowerCase().includes("focus area:")) || "";
  const focusStr = String(focusRaw).split(":").slice(1).join(":").trim();
  const focusLower = focusStr.toLowerCase();

  const moonFromRaw =
    facts.find((x: string) => x.toLowerCase().includes("from natal moon")) || "";
  const moonFrom = (() => {
    const m = String(moonFromRaw).match(/(\d+)/);
    return m ? Number(m[1]) : null;
  })();

  const conf: "high" | "medium" | "low" =
    d.confidence === "high" || d.confidence === "low" ? d.confidence : "medium";

  const dateISO = String(d.dateISO ?? "");
  const extras = dailyFlavorExtras(dateISO || String(idx));

  const key = `${dateISO}::${idx}::${facts.join("|")}`;

  // Mood signals (fallback-safe)
  const moodObj = inferMoodFromFacts(facts, conf);
  const moodFromMoon = inferMoodFromMoonFrom(moonFrom);
  const mood = String(moodFromMoon || moodObj.mood || "balanced");

// ï¿½ fallback doesnt use AI moodText at all  generate relatable mood line
const moodText = String(relatableMoodText(mood, key) ?? buildMoodLineText(mood, key) ?? "");


  // Headline by focus area
  const headline =
    focusLower.includes("relationships")
      ? "Relationships & conversations"
      : focusLower.includes("career")
      ? "Work & direction"
      : focusLower.includes("health")
      ? "Energy & routine"
      : focusLower.includes("inner")
      ? "Mindset & emotions"
      : "Todays focus";

  // Guidance pools (varies per day via pick)
  const REL_GUIDES = [
    "Say the simple truth, kindly. One clear conversation beats ten half-replies.",
    "Ask one direct question instead of assuming the answer.",
    "Choose timing and tone first  the message lands better.",
    "Listen fully, then respond. Dont rush to fix everything.",
  ];

  const CAREER_GUIDES = [
    "Structure wins today. Finish one thing fully, then move to the next.",
    "Handle one practical task end-to-end  it will unclog the rest.",
    "Avoid scattered effort. Pick a priority and close it cleanly.",
    "A short, clear update beats long explanations.",
  ];

  const HEALTH_GUIDES = [
    "Protect energy. Keep meals light and routine clean.",
    "Movement + hydration will stabilize everything else.",
    "Do less, but do it consistently. Your body responds fast today.",
    "Avoid overstimulation  keep the day gentle.",
  ];

  const INNER_GUIDES = [
    "Name one emotion, then take one small action.",
    "Dont overthink signals. Ground yourself in one practical step.",
    "Keep your mental space clean: one thought, one task, done.",
    "Pause before reacting  clarity shows up after the pause.",
  ];

  const GENERAL_GUIDES = [
    "Keep the day simple: one priority, one clean action.",
    "Even-paced day  small improvements compound.",
    "Steady effort wins. Dont push; nudge things forward.",
    "Keep it calm and consistent. Simple choices land best.",
  ];

  const guidePool =
    focusLower.includes("relationships")
      ? REL_GUIDES
      : focusLower.includes("career")
      ? CAREER_GUIDES
      : focusLower.includes("health")
      ? HEALTH_GUIDES
      : focusLower.includes("inner")
      ? INNER_GUIDES
      : GENERAL_GUIDES;

  // ï¿½ Varies by dateISO (not only idx)
  const guideKey = [
  dateISO,
  focusLower,
  mood,
  (facts.find((x: string) => x.toLowerCase().includes("transit moon nakshatra:")) || ""),
  (facts.find((x: string) => x.toLowerCase().includes("transit moon is")) || ""),
  (facts.find((x: string) => x.toLowerCase().includes("strongest transit:")) || ""),
].join("|");

  const guidance = pickKey(guidePool, guideKey);

  // Micro-tip (also varies)
  const microPool = focusLower.includes("relationships")
  ? [
      "If you feel a reaction rising, pause before typing.",
      "Say less, but say it clearly.",
      "Assume good intent first  it changes everything.",
      "Dont re-read messages looking for hidden meaning.",
    ]
  : focusLower.includes("career")
  ? [
      "Do the hardest task first  youll feel lighter all day.",
      "Close one loop before starting a new one.",
      "Keep messages short. Clarity > detail.",
      "Dont tweak the planexecute the plan.",
    ]
  : focusLower.includes("health")
  ? [
      "Your body will respond fast to small discipline today.",
      "Hydrate early  energy stays stable.",
      "Light dinner = better sleep tonight.",
      "Move a little  it clears the mind too.",
    ]
  : [
      "Dont rush your day. Slow is smooth.",
      "One small win will shift your mood.",
      "Less input (scrolling/news) = more calm.",
      "Choose one thing and finish it properly.",
    ];

const dayKey = [
  dateISO,
  focusLower,
  mood,
  // add a little uniqueness from facts (nakshatra / moon-from-moon / strongest transit)
  (facts.find((x: string) => x.toLowerCase().includes("transit moon nakshatra:")) || ""),
  (facts.find((x: string) => x.toLowerCase().includes("transit moon is")) || ""),
  (facts.find((x: string) => x.toLowerCase().includes("strongest transit:")) || ""),
].join("|");


// micro-tip (also varies)
const microTip = safeText(pickKey(microPool, dayKey + "::micro"));

// guidance already comes from your pool — sanitize it too
const guidanceClean = safeText(guidance);

// Compose + sanitize again (final guard)
const composed = safeText(`${guidanceClean} ${microTip}`.trim());

// Remove mood prefix if it repeats
const finalText = stripMoodPrefix(composed, moodText);

// Do/Avoid lists (rotate + stable)
const listKey = `${dateISO}:${focusLower}:${mood}`;
const lists = doAvoidLists(focusLower, mood, listKey);

  return {
    dateISO,
    headline,
    mood,
    moodText,
    text: safeText(normalizeHighlightText(finalText, idx)),
    do: [...lists.do],
    avoid: [...lists.avoid],
    color: extras.color,
    luckyNumber: extras.luckyNumber,
    bestTime: extras.bestTime,
    confidence: conf,
    theme: "",
    facts,
  };
});


    setDailyHighlights(fallback);
    setDailyError(null);
  }
} catch (err) {
  console.error("daily highlights failed", err);
  setDailyError("Could not load daily highlights.");
} finally {
  setDailyLoading(false);
}

    // 1) AI summary for transits
    try {
      const aiTransitsRes = await fetch("/api/ai-transits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          profile: {
            name: next.name,
            birthDateISO: next.birthDateISO,
            birthTime: next.birthTime,
            birthTz: next.birthTz,
          },
          transits: hitList,
        }),
      });

      const aiTransitsJson = await aiTransitsRes.json().catch(() => ({} as any));
      if (aiTransitsRes.ok && aiTransitsJson?.text) {
        setTransitSummary(aiTransitsJson.text as string);
      } else {
        console.error("ai-transits failed", aiTransitsRes.status, aiTransitsJson);
      }
    } catch (err) {
      console.error("ai-transits error", err);
    }

    // 2) Dasha ï¿½ Transits fusion
    try {
      const fusionRes = await fetch("/api/ai-dasha-transits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          profile: {
            name: next.name,
            birthDateISO: next.birthDateISO,
            birthTime: next.birthTime,
            birthTz: next.birthTz,
          },
          mdad: { md: md ?? null, ad: ad ?? null },
          transits: hitList,
        }),
      });

      const fusionJson = await fusionRes.json().catch(() => ({} as any));
      if (fusionRes.ok) {
        const asStr = typeof fusionJson === "string" ? fusionJson : JSON.stringify(fusionJson);
        setDashaTransitSummary(asStr);
        setTimelineSummary(asStr);
      } else {
        console.error("ai-dasha-transits failed", fusionRes.status, fusionJson);
      }
    } catch (err) {
      console.error("ai-dasha-transits error", err);
    }

    // 3) Monthly guidance (AI)
    try {
      setMonthlyLoading(true);
      setMonthlyError(null);
      setMonthlyInsights([]);

      const monthsRes = await fetch("/api/ai-monthly", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          profile: {
            name: next.name,
            birthDateISO: next.birthDateISO,
            birthTime: next.birthTime,
            birthTz: next.birthTz,
          },
          dashaLayers: { md, ad, pd, timeline: next.dashaTimeline ?? null },
          transits: hitList,
          startDateISO: todayISO,
          months: 12,
        }),
      });

      const monthsJson = await monthsRes.json().catch(() => ({} as any));
      if (monthsRes.ok && Array.isArray(monthsJson?.months)) {
        setMonthlyInsights(monthsJson.months as { label: string; text: string }[]);
        setMonthlyError(null);
      } else {
        console.error("ai-monthly failed", monthsRes.status, monthsJson);
        setMonthlyError("Could not load monthly guidance.");
      }
    } catch (err) {
      console.error("ai-monthly error", err);
      setMonthlyError("Could not load monthly guidance.");
    } finally {
      setMonthlyLoading(false);
    }

    // 4) Weekly guidance (AI + fallback + local cache)
try {
  setWeeklyLoading(true);
  setWeeklyError(null);
  setWeeklyInsights([]);

  const cacheKey = `sarathi:ai-weekly:${next.birthDateISO}:${next.birthTime}:${next.birthTz}:${todayISO}:8`;
  let servedFromCache = false;

  // 4.1 Try cache first
  try {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(cacheKey);
      if (raw) {
        const cached = JSON.parse(raw) as {
          weeks?: { label: string; text: string }[];
          ts?: number;
        };

        if (Array.isArray(cached.weeks) && cached.weeks.length > 0) {
          setWeeklyInsights(cached.weeks);
          setWeeklyError(null);
          servedFromCache = true;
        }
      }
    }
  } catch {
    // ignore cache read errors
  }

  // 4.2 Always hit API for now (keep content fresh)
  const weeksRes = await fetch("/api/ai-weekly", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      profile: {
        name: next.name,
        birthDateISO: next.birthDateISO,
        birthTime: next.birthTime,
        birthTz: next.birthTz,
      },
      dashaLayers: {
        md,
        ad,
        pd,
        timeline: next.dashaTimeline ?? null,
      },
      transits: hitList,
      startDateISO: todayISO,
      weeks: 8,
    }),
  });

  const weeksJson = await weeksRes.json().catch(() => ({} as any));

  if (weeksRes.ok && Array.isArray(weeksJson?.weeks)) {
    const weeksArr = weeksJson.weeks as { label: string; text: string }[];

    setWeeklyInsights(weeksArr);
    setWeeklyError(null);

    // 4.3 Save to cache
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          cacheKey,
          JSON.stringify({ weeks: weeksArr, ts: Date.now() })
        );
      }
    } catch {
      // ignore cache write errors
    }
  } else if (weeksRes.ok) {
    const fallbackWeekly = buildWeeklyFromTransits(hitList, todayISO, 8);
    setWeeklyInsights(fallbackWeekly);
    setWeeklyError(null);
    console.warn("ai-weekly returned no weeks; used client-side fallback instead");
  } else {
    console.error("ai-weekly failed", weeksRes.status, weeksJson);
    if (!servedFromCache) setWeeklyError("Could not load weekly guidance.");
  }
} catch (err) {
  console.error("ai-weekly error", err);
  setWeeklyError("Could not load weekly guidance.");
} finally {
  setWeeklyLoading(false);
}

// ï¿½ CLOSE the OUTER transits try/catch/finally correctly
} catch (err) {
  console.error("transits API error", err);
  setTransitsError("Could not load upcoming transits.");
} finally {
  setTransitsLoading(false);
}
};

  // fire and forget
  loadTransitsAndInsights();

  // finally update UI
  console.log("[setReport] next keys:", next ? Object.keys(next as any) : null);
console.log("[setReport] next.nowPlan?", !!(next as any)?.nowPlan);
console.log("[setReport] next.nowPlan keys:", (next as any)?.nowPlan ? Object.keys((next as any).nowPlan) : null);

  setReport(next);
  // Fill Life Story Overview (until we wire a dedicated AI endpoint)
setTimelineSummary(
  (next as any)?.timelineSummary ||
    (next as any)?.lifeOverview ||
    (next as any)?.lifeStoryOverview ||
    ""
);
console.log("[life-report] next core fields", {
  birthDateISO: next?.birthDateISO,
  birthTime: next?.birthTime,
  birthTz: next?.birthTz,
  birthLat: next?.birthLat,
  birthLon: next?.birthLon,
});

  setActiveTab("overview");
} catch (err: any) {
  console.error("life-report error", err);
  setError(
    err?.message || "Something went wrong while generating your report."
  );
} finally {
  setLoading(false);
}
}, [name, dateISO, time, tz, place, profiles]);


/* ---------------- Tab 1: Placements ---------------- */

const TabPlacements = () => {
  if (!report) {
    return (
      <>
        {engineUnavailable && (
          <div className="mb-4 rounded-md border border-amber-400/25 bg-amber-500/10 p-3 text-xs text-amber-200">
            <div className="font-semibold">Life Report engine not enabled yet</div>
            <p className="mt-1">{engineUnavailable}</p>
            <p className="mt-1">
              Panchang, Daily Guide and notifications will still work. Detailed MD / AD
              timelines will be enabled once the full engine is switched on for this
              server.
            </p>
          </div>
        )}

        <Card className="rounded-2xl shadow-inner border-dashed border-2 border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Fill details and generate.</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            Tab will populate after generation.
          </CardContent>
        </Card>
      </>
    );
  }

  const plsAll = (report.planets ?? []) as any[];

  const findP = (name: string) =>
    plsAll.find((p) => String(p?.name ?? "").trim().toLowerCase() === name);

  const getMoonNakName = () =>
    (report as any).panchangToday?.moonNakshatraName ??
    (report as any).panchangToday?.nakshatraName ??
    (report as any).panchangToday?.nakshatra?.name ??
    report.panchang?.moonNakshatraName ??
    "";

  const moonRow = findP("moon");
  const sunRow = findP("sun");

  return (
    <motion.div
      className="space-y-6 text-white"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Core signature */}
      <motion.div variants={fadeUp}>
        <Card className="rounded-2xl border border-indigo-400/15 bg-indigo-950/40 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex flex-wrap gap-2 items-baseline">
              Core birth signature
              {report.ascSign && (
                <Badge variant="secondary" className="rounded-lg text-xs">
                  Rising: {report.ascSign}
                </Badge>
              )}
              {report.moonSign && (
                <Badge variant="outline" className="rounded-lg text-xs">
                  Moon: {report.moonSign}
                </Badge>
              )}
              {report.sunSign && (
                <Badge variant="outline" className="rounded-lg text-xs">
                  Sun: {report.sunSign}
                </Badge>
              )}
            </CardTitle>

            {/* Key signs */}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Moon sign
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {report.moonSign ??
                    (() => {
                      const moonNak = getMoonNakName();
                      return `${moonRow?.sign ?? ""}${moonNak ? ` (${moonNak})` : ""}`;
                    })()}
                </div>
                <div className="mt-1 text-xs text-white/70">
                  Your emotional style, what you need to feel steady and safe.
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Sun sign
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {report.sunSign ?? (sunRow?.sign ?? "")}
                </div>
                <div className="mt-1 text-xs text-white/70">
                  Your life direction, what you're here to build and become.
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            {/* Birth data */}
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase text-white/70 tracking-wide">
                Birth Data
              </div>
              <div>
                {report.birthDateISO} @ {report.birthTime} ({report.birthTz})
              </div>
              {typeof report.birthLat === "number" && typeof report.birthLon === "number" && (
                <div className="text-xs text-white/70">
                  {report.birthLat.toFixed(3)}, {report.birthLon.toFixed(3)}
                </div>
              )}
            </div>

            {/* Panchang snapshot */}
            {(() => {
              const sunSid = sunRow ? guessSiderealDegFrom(sunRow as any) : undefined;
              const moonSid = moonRow ? guessSiderealDegFrom(moonRow as any) : undefined;

              const weekday =
                weekdayFromISODate(report.birthDateISO) ?? report.panchang?.weekday ?? "";

              const part = 360 / 27;

              const yogaName =
                sunSid !== undefined && moonSid !== undefined
                  ? YOGAS_27[Math.floor((norm360(sunSid + moonSid) + 1e-8) / part) % 27]
                  : report.panchang?.yogaName ?? "";

              const karanaName =
                sunSid !== undefined && moonSid !== undefined
                  ? computeKaranaName(sunSid, moonSid) ?? ""
                  : report.panchang?.karanaName ?? "";

              const moonNak = getMoonNakName();

              return (
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase text-white/70 tracking-wide">
                    Panchang Snapshot
                  </div>

                  <div>
                    <span className="font-medium">Weekday:</span> {weekday}
                  </div>

                  <div>
                    <span className="font-medium">Tithi:</span>{" "}
                    {report.panchang?.tithiName ?? ""}
                    {report.panchang?.meanings?.tithi ? (
                      <span className="text-xs text-white/70">
                        {" "}
                         {report.panchang.meanings.tithi}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <span className="font-medium">Yoga:</span> {yogaName}
                    {report.panchang?.meanings?.yoga ? (
                      <span className="text-xs text-white/70">
                        {" "}
                         {report.panchang.meanings.yoga}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <span className="font-medium">Karana:</span> {karanaName}
                    {report.panchang?.meanings?.karana ? (
                      <span className="text-xs text-white/70">
                        {" "}
                         {report.panchang.meanings.karana}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <span className="font-medium">Moon Nakshatra:</span> {moonNak || ""}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </motion.div>

      {/* Life themes (user-friendly) */}
      <motion.div variants={fadeUpSmall} className="space-y-4">
        <Card className="rounded-2xl border border-indigo-400/15 bg-indigo-950/40 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-50">
              Your life themes
            </CardTitle>
            <div className="text-sm text-white/70">
              A simple, practical view of what your chart emphasizes, no astrology knowledge
              needed.
            </div>
          </CardHeader>

          <CardContent className="grid gap-3 md:grid-cols-2">
            {(() => {
              const moon = findP("moon");
              const sun = findP("sun");
              const ven = findP("venus");
              const mars = findP("mars");
              const jup = findP("jupiter");
              const sat = findP("saturn");
              const rahu = findP("rahu");
              const ketu = findP("ketu");

              const fmt = (p: any) => {
                if (!p) return "";
                const sign = p.sign ? String(p.sign) : "";
                return `${String(p.name)}${sign ? ` in ${sign}` : ""}`;
              };

              const themeCard = (title: string, line1: string, line2: string) => (
                <div className="rounded-2xl border border-white/15 bg-indigo-950/40 p-4">
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="mt-2 text-sm text-white/90">{line1}</div>
                  <div className="mt-1 text-xs text-white/70">{line2}</div>
                </div>
              );

              return (
                <>
                  {themeCard(
                    "Mind & emotions",
                    moon ? fmt(moon) : `Moon sign: ${report.moonSign ?? ""}`,
                    "How you process feelings, handle stress, and regain balance."
                  )}

                  {themeCard(
                    "Identity & direction",
                    sun ? fmt(sun) : `Sun sign: ${report.sunSign ?? "-"}`,
                    "What drives you - confidence, purpose, and long-term direction."
                  )}

                  {themeCard(
                    "Work & discipline",
                    sat ? fmt(sat) : "Saturn emphasis: ?",
                    "How you build stability: routines, responsibility, and patience."
                  )}

                  {themeCard(
                    "Relationships & values",
                    ven || mars
                      ? `${fmt(ven)}${ven && mars ? " - " : ""}${fmt(mars)}`
                      : "Venus/Mars: ?",
                    "How you bond, love, set boundaries, and handle conflict."
                  )}

                  {themeCard(
                    "Growth & learning",
                    jup ? fmt(jup) : "Jupiter emphasis: ?",
                    "Where luck grows: guidance, mentors, faith, and expansion."
                  )}

                  {(rahu || ketu) &&
                    themeCard(
                      "Life lessons",
                      `${fmt(rahu)}${rahu && ketu ? " - " : ""}${fmt(ketu)}`,
                      "What life pushes you to master - growth edges and detachment points."
                    )}
                </>
              );
            })()}
          </CardContent>
        </Card>

        <div className="text-xs text-white/70">
          Want the technical chart view. Open the section below.
        </div>
      </motion.div>

      {/* What to focus on now */}
      <motion.div variants={fadeUpSmall}>
        <Card className="rounded-2xl border border-indigo-400/15 bg-indigo-950/40 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-50">
              What to focus on now
            </CardTitle>
            <div className="text-sm text-white/70">
              A simple direction for the next few weeks - practical, not predictive.
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            {(() => {
              const moon = findP("moon");
              const sun = findP("sun");
              const sat = findP("saturn");

              const moonSign = moon.sign ?? report.moonSign ?? "-";
              const sunSign = sun.sign ?? report.sunSign ?? "-";

              const focusLines: string[] = [];
              focusLines.push(
                `Stabilize your mind first (Moon in ${moonSign}), choose fewer priorities and finish what you start.`
              );
              focusLines.push(
                `Take one long-term step daily (Sun in ${sunSign}), consistency beats intensity.`
              );
              if (sat)
                focusLines.push(
                  `Protect your routine (Saturn influence), sleep, discipline, and boundaries help you stay steady.`
                );

              return (
                <ul className="list-disc pl-5 space-y-2 text-white/90">
                  {focusLines.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              );
            })()}

            <div className="pt-2 text-xs text-white/70">
              Want this personalized for your situation right now? Use{" "}
              <span className="font-medium">Ask Sarathi</span>.
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advanced placements */}
      <div className="mt-10 border-t border-white/15 pt-6 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_35%)]">
        <motion.div variants={fadeUpSmall} className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="placements-details">
              <AccordionTrigger className="text-sm font-semibold text-slate-100 hover:text-white [&_svg]:text-slate-200 [&_svg]:opacity-80">
                Advanced astrology (planets, houses & interpretations)
              </AccordionTrigger>

              <AccordionContent>
                <div className="mb-3 text-xs text-white/70">
                  For advanced users: technical chart details like planet positions, houses, and
                  deeper interpretations.
                </div>

                {Array.isArray((report as any)?.planets) && (report as any).planets.length ? (
                  <Card className="rounded-2xl border border-indigo-400/15 bg-indigo-950/40 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center justify-between">
                        Planet placements
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="text-sm text-slate-100 leading-relaxed">
                      {(() => {
                        const pls = Array.isArray((report as any)?.planets)
                          ? ((report as any).planets as any[])
                          : [];

                        if (!pls.length) {
                          return (
                            <div className="text-white/70 text-sm">
                              No planet placements found. Generate / Refresh to load the chart.
                            </div>
                          );
                        }

                        const ORDER = [
                          "Sun",
                          "Moon",
                          "Mercury",
                          "Venus",
                          "Mars",
                          "Jupiter",
                          "Saturn",
                          "Rahu",
                          "Ketu",
                        ];

                        const norm = (s: any) => String(s ?? "").trim().toLowerCase();
                        const byName = new Map(pls.map((p) => [norm(p?.name), p]));

                        const ordered = [
                          ...ORDER.map((n) => byName.get(norm(n))).filter(Boolean),
                          ...pls.filter(
                            (p) => !ORDER.some((n) => norm(p?.name) === norm(n))
                          ),
                        ] as any[];

                        const dignity = (planetNameRaw: string, signRaw: string) => {
                          const planet = String(planetNameRaw ?? "").trim().toLowerCase();
                          const sign = String(signRaw ?? "").trim().toLowerCase();

                          if (planet === "rahu" || planet === "ketu") return "Neutral";

                          const EXALT: Record<string, string> = {
                            sun: "aries",
                            moon: "taurus",
                            mars: "capricorn",
                            mercury: "virgo",
                            jupiter: "cancer",
                            venus: "pisces",
                            saturn: "libra",
                          };

                          const DEBIL: Record<string, string> = {
                            sun: "libra",
                            moon: "scorpio",
                            mars: "cancer",
                            mercury: "pisces",
                            jupiter: "capricorn",
                            venus: "virgo",
                            saturn: "aries",
                          };

                          const OWN: Record<string, string[]> = {
                            sun: ["leo"],
                            moon: ["cancer"],
                            mars: ["aries", "scorpio"],
                            mercury: ["gemini", "virgo"],
                            jupiter: ["sagittarius", "pisces"],
                            venus: ["taurus", "libra"],
                            saturn: ["capricorn", "aquarius"],
                          };

                          if (EXALT[planet] === sign) return "Exalted";
                          if (DEBIL[planet] === sign) return "Debilitated";
                          if (OWN[planet]?.includes(sign)) return "Own";
                          return "Neutral";
                        };

                        const statusClass = (status: string) =>
                          status === "Exalted"
                            ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                            : status === "Debilitated"
                            ? "border-rose-400/30 bg-rose-500/10 text-rose-200"
                            : status === "Own"
                            ? "border-sky-400/30 bg-sky-500/10 text-sky-200"
                            : "border-white/15 bg-white/5 text-white/70";

                        return (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {ordered.map((p, idx) => {
                              const name = String(p.name ?? "Planet");
                              const sign = p.sign ? String(p.sign) : "-";
                              const house =
                                p?.house != null && p.house !== ""
                                  ? String(p.house)
                                  : "-";
                              const nak = p.nakshatra ? String(p.nakshatra) : null;

                              const status = dignity(name, sign);

                              return (
                                <div
                                  key={`${name}-${idx}`}
                                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-slate-50">
                                      {name}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span
                                        className={
                                          "text-[11px] px-2 py-0.5 rounded-full border " +
                                          statusClass(status)
                                        }
                                      >
                                        {status}
                                      </span>

                                      <div className="text-xs text-white/60">
                                        House {house}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-1 text-sm text-slate-100">
                                    <span className="font-medium">{sign}</span>
                                    {nak ? (
                                      <span className="text-white/70">
                                        {" "}
                                         <span className="font-normal">{nak}</span>
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="rounded-2xl shadow-inner border-dashed border-2 border-muted-foreground/20">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium">
                        No planet table available.
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-white/70">
                      Generate again to see planet placements.
                    </CardContent>
                  </Card>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ---------------- Tab 2: Personality ---------------- */

type TabPersonalityProps = {
  report: LifeReportView | null;
  aiSummary: string;
};

const TabPersonality: React.FC<TabPersonalityProps> = memo(
  ({ report, aiSummary }) => {
    if (!report) return null;

    return (
      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Keep AI Summary (the one you said you NEED) */}
        {aiSummary ? (
          <motion.div variants={fadeUpSmall} className="space-y-2">
            <Card className="rounded-2xl border border-indigo-400/15 bg-indigo-950/40 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-50">
                  Sarathi's summary
                </CardTitle>
              </CardHeader>

              <CardContent className="text-sm leading-relaxed space-y-3 text-slate-100/90">
                {(() => {
                  const raw0 = (aiSummary ?? "").trim();
                  if (!raw0) return null;

                  // Strip markdown fences if present
                  const raw1 = raw0
                    .replace(/^```json\s*/i, "")
                    .replace(/^```\s*/i, "")
                    .replace(/```$/i, "")
                    .trim();

                  const tryParse = (s: string) => {
                    try {
                      return JSON.parse(s);
                    } catch {
                      return null;
                    }
                  };

                  let obj: any = tryParse(raw1);
                  if (typeof obj === "string") {
                    const obj2 = tryParse(obj);
                    if (obj2) obj = obj2;
                  }

                  // If { text: [...], closing: "..." }
                  const bullets =
                    obj && Array.isArray(obj.text)
                      ? (obj.text as string[])
                      : obj && typeof obj.text === "string"
                        ? [obj.text]
                        : null;

                  const closing =
                    obj && typeof obj.closing === "string"
                      ? (obj.closing as string)
                      : "";

                  if (bullets && bullets.length) {
                    return (
                      <>
                        <ul className="list-disc pl-5 space-y-2 text-indigo-50/90">
                          {bullets.map((b, i) => (
                            <li key={i}>{String(b)}</li>
                          ))}
                        </ul>
                        {closing ? (
                          <p className="text-indigo-200/70 italic">{closing}</p>
                        ) : null}
                      </>
                    );
                  }

                  // Plain text fallback
                  return <p className="whitespace-pre-wrap">{raw1}</p>;
                })()}
              </CardContent>
            </Card>
          </motion.div>
        ) : null}

        {/* Removed: the grid of personality cards (Strength/Pressure/Do this) */}
      </motion.div>
    );
  }
);
function stripMdLite(s: any) {
  return String(s ?? "")
    .replace(/^#{1,6}\s+/gm, "")        // remove markdown headings like ### Title
    .replace(/\*\*(.*?)\*\*/g, "$1")    // remove **bold**
    .replace(/\*(.*?)\*/g, "$1")        // remove *italic*
    .replace(/`{1,3}/g, "")             // remove inline/backticks
    .replace(/\s+/g, " ")
    .trim();
}

 /* ---------------- Tab 3: Timeline ---------------- */
type SavedProfile = {
  id: string;
  label: string;
  name: string;
  birthDateISO: string;
  birthTime: string;
  birthTz: string;
  lat: number;
  lon: number;
  placeName: string;
};

type TabTimelineProps = {
  report: LifeReportView | null;
  mounted: boolean;
  timelineSummary: string;
  dashaTransitSummary: string;
};

const TabTimeline: React.FC<TabTimelineProps> = memo(
  ({ report, mounted, timelineSummary, dashaTransitSummary }) => {
    if (!report) return null;
  
const hits =
  Array.isArray((report as any)?.transits) ? (report as any).transits :
  Array.isArray((report as any)?.topTransits) ? (report as any).topTransits :
  [];

const todayISO = (() => {
  const tz =
  (report as any)?.meta?.birthTz ??
  "Asia/Dubai";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
})();



    const ap = report.activePeriods as any;

    const sectionTrigger =
      "text-sm font-semibold text-slate-100 hover:text-slate-50";
    const subNote = "text-xs text-slate-200/70";
    const divider = "border-white/15";

    return (
      <div
        className={
          "space-y-6 transform transition-all duration-300 " +
          (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
        }
      >
        {/* 1) Current dasha progress (simple, always visible) */}
        {ap && (
          <Card className="rounded-2xl border border-indigo-400/15 bg-indigo-950/40 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-100">
                Current Dasha Progress
              </CardTitle>
              <p className={subNote}>
                Where you are right now in the dasha cycle (big - medium - short).
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              {ap.mahadasha && (
                <DashaBar
                  label={`Mahadasha - ${ap.mahadasha.lord}`}
                  start={ap.mahadasha.start}
                  end={ap.mahadasha.end}
                  subtitle={ap.mahadasha.summary}
                />
              )}

              {ap.antardasha && (
                <DashaBar
                  label={`Antardasha - ${ap.antardasha.subLord} (in ${ap.antardasha.mahaLord})`}
                  start={ap.antardasha.start}
                  end={ap.antardasha.end}
                  subtitle={ap.antardasha.summary}
                />
              )}

              {ap.pratyantardasha && (
                <DashaBar
                  label={`Pratyantardasha - ${ap.pratyantardasha.lord}`}
                  start={ap.pratyantardasha.start}
                  end={ap.pratyantardasha.end}
                  subtitle={ap.pratyantardasha.summary}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* 2) Details (collapsible, avoids overwhelm) */}
        <Accordion type="multiple" className="w-full space-y-2">
          {/* A) Year-ahead insight */}
          <AccordionItem
            value="year-ahead"
            className={"rounded-2xl border " + divider + " bg-indigo-950/40"}
          >
            <AccordionTrigger className={sectionTrigger}>
              Dasha - Transits - Year Ahead Insight
            </AccordionTrigger>

            <AccordionContent className="pt-2">
  <p className={subNote}>
    A short preview of your year-ahead story (full breakdown in Advanced - Pro).
  </p>

  <div className="mt-3">
    {dashaTransitSummary ? (
      <Card className={ACC_CARD}>
        <CardContent className="pt-4">
          {(() => {
            const raw0 = cleanTransitText(fixWeirdEncoding(dashaTransitSummary));
const obj = parseAiJson(raw0);

// If it's JSON, build a nice teaser from fields.
// If not, fall back to short plain text.
let teaser = "";
let windows: any[] = [];

if (obj && typeof obj === "object") {
  const headline = typeof (obj as any).headline === "string" ? (obj as any).headline.trim() : "";
  const dashaLine = typeof (obj as any).dashaLine === "string" ? (obj as any).dashaLine.trim() : "";
  const summary = typeof (obj as any).summary === "string" ? (obj as any).summary.trim() : "";
  windows = Array.isArray((obj as any).windows) ? (obj as any).windows : [];

  // Build a readable teaser paragraph
  teaser = [headline, dashaLine, summary].filter(Boolean).join(" - ").trim();
} else {
  const plain = stripMdLite(raw0);
  teaser = plain.length > 260 ? plain.slice(0, 260).trim() + "-" : plain;
}

return (
  <div className="space-y-3">
    <div className="text-slate-100 text-sm leading-relaxed">
      {teaser || "Year-ahead preview will appear here once available."}
    </div>

    {/* Optional: show top 2 windows when JSON exists */}
    {windows.length > 0 ? (
      <div className="space-y-2">
        {windows.slice(0, 2).map((w: any, idx: number) => {
          const label =
            typeof w.label === "string" && w.label.trim()
              ? w.label.trim()
              : typeof w.category === "string" && w.category.trim()
              ? w.category.trim()
              : `Window ${idx + 1}`;

          const when = typeof w.when === "string" ? w.when.trim() : "";
          const strength =
            typeof w.strength === "number" && Number.isFinite(w.strength)
              ? Math.max(0, Math.min(1, w.strength))
              : null;

          return (
            <div
              key={idx}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="text-sm font-semibold text-slate-100">
                {label}
              </div>
              {(when || strength !== null) ? (
                <div className="mt-1 text-xs text-white/60">
                  {when ? <span>{when}</span> : null}
                  {when && strength !== null ? <span>{" - "}</span> : null}
                  {strength !== null ? (
                    <span>strength {Math.round(strength * 10)}/10</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    ) : null}

    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className={"text-xs " + ACC_MUTED}>
        Want the full insight, key windows, and action plan?
      </div>

      <Link
        href="/sarathi/life-report?tab=advanced"
        className="w-full sm:w-auto"
      >
        <Button size="sm" className="w-full sm:w-auto">
          View in Advanced (Pro)
        </Button>
      </Link>
    </div>
  </div>
);

          })()}
        </CardContent>
      </Card>
    ) : (
      <p className={"mt-2 text-xs " + ACC_MUTED}>
        No year-ahead summary available yet.
      </p>
    )}
  </div>
</AccordionContent>

          </AccordionItem>

          {/* Life story overview (hide if it's the same as year-ahead) */}
{(() => {
  const y = (dashaTransitSummary || "").trim();
  const t = (timelineSummary || "").trim();
  // no longer hide: year-ahead is a teaser now, so it's not overwhelming


  return (
    <AccordionItem value="life-overview">
      
      <AccordionContent>
        {t ? (
          <Card className={ACC_CARD}>
            <CardContent className="pt-4 space-y-3 text-sm">
              {renderAiTextBlocks(cleanTransitText(t))}
            </CardContent>
          </Card>
        ) : (
          <p className={"text-xs " + ACC_MUTED}>
            Your life themes will appear here once your report summary is ready.
          </p>
        )}

      </AccordionContent>
    </AccordionItem>
  );
})()}

          {/* C) Vimshottari timeline (compact list) */}
          {Array.isArray(report.dashaTimeline) && report.dashaTimeline.length > 0 && (
            <AccordionItem
              value="timeline"
              className={"rounded-2xl border " + divider + " bg-indigo-950/40"}
            >
              <AccordionTrigger className={sectionTrigger}>
                Vimshottari Mahadasha Timeline
              </AccordionTrigger>

              <AccordionContent className="pt-2">
                <p className={subNote}>
                  The full sequence of mahadashas. The active one is highlighted.
                </p>

                <div className="mt-3">
                  <Card className={ACC_CARD}>
                    <CardContent className="pt-4 space-y-2">
                      {report.dashaTimeline.map((row: any, idx: number) => {
                        const now = Date.now();
                        const s = new Date(row.startISO).getTime();
                        const e = new Date(row.endISO).getTime();
                        const isActive = now >= s && now <= e;

                        return (
                          <div
                            key={idx}
                            className={
                              "flex items-center justify-between rounded-xl border px-3 py-2 " +
                              (isActive
                                ? "border-indigo-400/40 bg-indigo-500/10"
                                : "border-white/15 bg-slate-950/40")
                            }
                          >
                            <div className="space-y-0.5">
                              <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
                                {row.planet} Mahadasha
                              </div>
                              <div className="text-[13px] text-white/70">
                                {row.startISO} - {row.endISO}
                              </div>
                            </div>

                            {isActive && (
                              <span className="text-[11px] font-semibold text-indigo-200">
                                Current
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* D) Key phases (limit to avoid overwhelm) */}
          {Array.isArray(report.lifeMilestones) && report.lifeMilestones.length > 0 && (
            <AccordionItem
              value="life-story"
              className={"rounded-2xl border " + divider + " bg-indigo-950/40"}
            >
              <AccordionTrigger className={sectionTrigger}>
                Life Story - Key Phases
              </AccordionTrigger>

              <AccordionContent className="pt-2">
                <p className={subNote}>
                  The most important turning points. Kept short so it's easy to digest.
                </p>

                <div className="mt-3">
                  <Card className={ACC_CARD}>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {report.lifeMilestones.slice(0, 6).map((m: any, idx: number) => (
                          <div
                            key={idx}
                            className="relative pl-4 border-l border-white/15 last:border-l-0"
                          >
                            <div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-indigo-400 shadow-sm" />

                            <div className="rounded-xl border border-white/15 bg-slate-950/40 p-3 text-sm leading-relaxed text-slate-100">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="text-xs font-semibold uppercase text-white/60 tracking-wide">
                                    {m.label}
                                  </div>

                                  <div className="text-[11px] text-slate-200/70">
                                    {m.approxAgeRange} (
                                    {new Date(m.periodStart).getFullYear()}?{new Date(m.periodEnd).getFullYear()})
                                  </div>

                                  {m.drivers && (
                                    <div className="text-[11px] text-slate-200/60">
                                      {m.drivers}
                                    </div>
                                  )}
                                </div>

                                <div
                                  className={
                                    "text-[10px] leading-none rounded-md px-2 py-1 font-medium " +
                                    toneColor(m.risk)
                                  }
                                >
                                  {m.risk === "opportunity"
                                    ? "Opportunity"
                                    : m.risk === "caution"
                                    ? "Caution"
                                    : "Mixed"}
                                </div>
                              </div>

                              <div className="mt-2 space-y-1 text-xs leading-relaxed text-slate-100">
                                {Array.isArray(m.themes) && m.themes.length ? (
                                  m.themes.slice(0, 3).map((t: string, i2: number) => (
                                    <p key={i2}>{t}</p>
                                  ))
                                ) : (
                                  <p className="text-slate-200/60">(No notes.)</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {report.lifeMilestones.length > 6 && (
                          <p className="text-xs text-slate-200/60">
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    );
  }
);

    /* ---------------- TZ mismatch banner ---------------- */

  const tzMismatchBanner = useMemo(() => {
    if (!place?.name) return null;
    const exp = expectedTzForPlaceName(place.name);
    if (exp && tz !== exp) {
      return (
        <div className="mt-2 text-xs rounded-md bg-amber-500/10 text-amber-200 border border-amber-400/25 p-2">
          Time zone mismatch: this place typically uses{" "}
          <span className="font-medium">{exp}</span>, but the field says{" "}
          <span className="font-mono">{tz}</span>. Panchang (tithi/yoga/karana)
          should be computed in the birth-place time zone.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => setTz(exp)}
          >
            Set to {exp}
          </button>
        </div>
      );
    }
    return null;
  }, [place?.name, tz]);
 
     // Keep daily guide in sync with latest Life Report + transits
useEffect(() => {
  if (!report) {
    setGuide(null);
    setGuideError(null);
    return;
  }

  let cancelled = false;

    async function loadGuide() {
    try {
      setGuideError(null);

      const dashaStack = (report as any)?.activePeriods ?? null;

      const core: CoreSignals = {
        birth: {
          dateISO: dateISO || new Date().toISOString().slice(0, 10),
          time: time || "00:00",
          tz: tz || "Asia/Dubai",
          lat: place?.lat ?? 0,
          lon: place?.lon ?? 0,
          lagnaSign: (report as any)?.ascendant?.sign,
        },
        dashaStack,
        transits: (transits ?? []).map((t: any) => ({
          planet: t.planet,
          house: t.house,
          sign: t.sign,
          category: t.category,
          strength: t.strength,
          tags: t.tags,
          windowLabel: t.windowLabel,
          startISO: t.startISO,
          endISO: t.endISO,
        })),
        moonToday: {
          sign: (report as any)?.moon?.sign || "Unknown",
          nakshatra: (report as any)?.moon?.nakshatra || "Unknown",
          houseFromMoon: (report as any)?.moon?.houseFromMoon ?? undefined,
          guna: (report as any)?.moon?.guna || undefined,
        },
                panchang: {
          tithi: report?.panchang?.tithiName || "Unknown",
          weekday:
            (report?.panchang as any)?.weekdayName || "Unknown",
          yogaName: report?.panchang?.yogaName ?? undefined,
          karanaName: report?.panchang?.karanaName ?? undefined,
          sunriseISO: report?.panchang?.sunriseISO ?? undefined,
        },

      };

           if (!report) {
        console.warn(
          "[life-report] No report available when building daily-guide cache key"
        );
        return;
      }

      const cacheKey = `sarathi:daily-guide:${report.birthDateISO}:${report.birthTime}:${report.birthTz}:${dateISO}`;

      // 1) Try cache
      try {
        if (typeof window !== "undefined") {
          const raw = window.localStorage.getItem(cacheKey);
          if (raw) {
            const cached = JSON.parse(raw) as { json?: any; ts?: number };
            if (cached?.json && !cancelled) {
              setGuide(cached.json);
              // We still go on to refresh below
            }
          }
        }
      } catch {
        // ignore cache errors
      }

      // 2) Fetch fresh daily guide
      const res = await fetch("/api/sarathi/daily-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ core, label: "This week" }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("daily-guide API failed", res.status, txt);
        if (!cancelled) {
          setGuideError("Could not load daily guide.");
        }
        return;
      }

      const json = await res.json().catch(() => null);

      if (!cancelled && json) {
        setGuide(json);

        // 3) Save to cache
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              cacheKey,
              JSON.stringify({ json, ts: Date.now() })
            );
          }
        } catch {
          // ignore cache write errors
        }
      }
    } catch (err) {
      console.error("daily-guide fetch error", err);
      if (!cancelled) {
        setGuideError("Could not load daily guide.");
      }
    }
  }

  loadGuide();

  return () => {
    cancelled = true;
  };
}, [report, transits, dateISO, time, tz, place]);

const panchangToday = report?.panchang;
 // Keep chat cache in sync with latest Life Report + transits
useEffect(() => {
  if (typeof window === "undefined") return;
  if (!report) return;

  try {
    const rep: any = report;

    // 1) Birth details (best effort)
    const birthName =
      rep.name ?? rep.profile?.name ?? rep.ascendant?.name ?? "";
    const birthDateISO =
      rep.birthDateISO ??
      rep.birth?.dateISO ??
      rep.profile?.birthDateISO ??
      "";
    const birthTime =
      rep.birthTime ??
      rep.birth?.time ??
      rep.profile?.birthTime ??
      "";
    const birthTz =
      rep.birthTz ??
      rep.birth?.tz ??
      rep.profile?.birthTz ??
      "";
    const birthLat =
      rep.birthLat ??
      rep.birth?.lat ??
      rep.profile?.lat ??
      null;
    const birthLon =
      rep.birthLon ??
      rep.birth?.lon ??
      rep.profile?.lon ??
      null;

    // 2) Dasha timeline (MD/AD/PD windows)
    const timeline =
      Array.isArray(rep.dashaTimeline)
        ? rep.dashaTimeline
        : Array.isArray(rep.timelineWindows)
        ? rep.timelineWindows
        : [];

    // 3) Transits array from state
    const transitsArray = Array.isArray(transits) ? transits : [];

    // 4) Transit windows:
    //    - prefer server-computed windows on report
    //    - else derive simple windows from the transits hits
    let transitWindows: any[] = [];

    if (Array.isArray(rep.transitWindows) && rep.transitWindows.length) {
      transitWindows = rep.transitWindows;
    } else if (transitsArray.length) {
      transitWindows = transitsArray.map((t: any) => ({
        from: t.startISO || t.from || t.start || null,
        to: t.endISO || t.to || t.end || null,
        focusArea: t.category || "mixed",
        driver: `${t.planet || ""} ${t.sign || ""} house ${
          t.house ?? ""
        }`.trim(),
        riskFlag:
          typeof t.strength === "number"
            ? t.strength >= 0.8
              ? "opportunity"
              : t.strength <= -0.4
              ? "caution"
              : "mixed"
            : undefined,
        summary: t.windowLabel || t.label || "",
        actions: [],
      }));
    }

    // 5) Natal flavour (Moon nakshatra etc.)
    const natal = {
      moonNakshatra:
        rep.moonNakshatraName ??
        rep.panchang?.moonNakshatraName ??
        null,
      moonNakshatraTheme: rep.moonNakshatraTheme ?? null,
    };

    
    // ï¿½ NO HIDING: disable chat cache while we debug houses/asc
window.localStorage.removeItem("sarathi.lifeReportCache.v2");
// console.log("[life-report] chat cache disabled");

  } catch (e) {
    console.warn("[life-report] failed to cache for chat", e);
  }
}, [report, transits]);

  /* ---------------- Render ---------------- */

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Suspense fallback={null}>
      <TabFromUrl onTab={setTabFromUrl} />
    </Suspense>
      <Card className="rounded-2xl border border-white/15 bg-indigo-950/40 backdrop-blur-md shadow-xl shadow-[0_0_30px_rgba(99,102,241,0.10)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Your birth details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={dateISO}
                onChange={(e) => {
                  const raw = e.target.value;
                  const norm = normalizeDateForBackend(raw);
                  setDateISO(norm ?? raw);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Time of Birth</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Time Zone (auto from city)</Label>
              <Input value={tz} readOnly aria-readonly title="Picked from city" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Place of Birth</Label>
            <LockingCityAutocomplete
              value={
                place
                  ? { name: place.name, lat: place.lat, lon: place.lon }
                  : null
              }
              onSelect={(p) => {
                if (!p) {
                  setPlace(null);
                  return;
                }
                setPlace({ name: p.name, lat: p.lat, lon: p.lon, tz });
              }}
              placeholder="City, Country (e.g., New Delhi)"
            />
            {place && (
              <p className="text-xs text-white/70">
                lat {place.lat?.toFixed(3)}, lon {place.lon?.toFixed(3)} ({tz})
              </p>
            )}

                        {tzMismatchBanner}
          </div>

          {/* Profiles row + Generate button */}
<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  {/* Left: profile selector + save */}
  <div className="flex flex-wrap items-center gap-2 text-xs">
    <span className="font-semibold uppercase tracking-wide text-white/70">
      Profiles:
    </span>

    <select
      className="rounded-md border bg-background px-2 py-1 text-xs text-white/70"
      value={selectedProfileId}
      onChange={(e) => handleSelectProfile(e.target.value)}
    >
      <option value="">(None selected)</option>
      {profiles.map((p) => (
        <option key={p.id} value={p.id}>
          {p.label}  {p.birthDateISO}
        </option>
      ))}
    </select>

    <button
      type="button"
      className="rounded-md border px-2 py-1 text-[11px] text-white/90 border-foreground/30"
      onClick={handleSaveProfile}
    >
      Save current as profile
    </button>
  </div>

  {/* Right: generate / refresh button */}
  <Button
    type="button"
    onClick={handleGenerate}
    disabled={loading}
    className="w-full sm:w-auto"
  >
    {loading ? "Generating..." : "Generate / Refresh Report"}
  </Button>
</div>

        </CardContent>
      </Card>

      {/* Tabs + Ask Sarathi chat entry */}
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
  const next = String(v);
  setActiveTab(next as any);

const sp = new URLSearchParams(
  typeof window !== "undefined" ? window.location.search : ""
);
sp.set("tab", next);
router.replace(`${pathname}?${sp.toString()}`, { scroll: false });

}}

          className="flex-1"
        >
          <TabsList className="flex flex-wrap gap-2">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="phases">Life Phases</TabsTrigger>
  <TabsTrigger value="now">Now & Near Future</TabsTrigger>
  <TabsTrigger value="advanced">Advanced - Pro</TabsTrigger>
  <TabsTrigger value="full">Full Plan </TabsTrigger>
</TabsList>

        </Tabs>

        <Link href="/sarathi/chat" className="md:ml-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full md:w-auto text-white hover:text-white border-white/20 hover:bg-white/10"


          >
           Ask Sarathi
          </Button>
        </Link>
      </div>

    {/* Tab content */}
<div className="mt-4 space-y-6">
  

  {/* OVERVIEW = show ONLY placements (core signature) + personality summary */}
  {activeTab === "overview" && (
    <div className="space-y-6">
      <TabPlacements />
      {/* Keep personality, but it now belongs to Overview */}
      <TabPersonality report={report} aiSummary={aiSummary} />
    </div>
  )}

  {/* LIFE PHASES = timeline only */}
  {activeTab === "phases" && (
    <TabTimeline
      report={report}
      mounted={mounted}
      timelineSummary={timelineSummary}
      dashaTransitSummary={dashaTransitSummary}
    />
  )}

  {/* NOW & NEAR FUTURE = transits only */}
  {activeTab === "now" && (
  <TabTransits
    transits={
      (Array.isArray((report as any)?.topTransits) ? (report as any).topTransits : transits) ?? []
    }
    loading={transitsLoading}
    error={transitsError}
    transitSummary={transitSummary}
    dailyHighlights={dailyHighlights}
    dailyLoading={dailyLoading}
    dailyError={dailyError}
    mounted={mounted}
  />
)}


     {/* ADVANCED = premium deep insights (conversion page) */}
  {activeTab === "advanced" && (
  <TabAdvanced
    report={report}
    mounted={mounted}
    isPro={isPro}
    timelineSummary={timelineSummary}
    dashaTransitSummary={dashaTransitSummary}
    transits={(report as any)?.transits ?? transits ?? []}
    transitNow={transitNow}
  />
)}

  {activeTab === "full" && (
  <TabFullPlan
    report={report}
    mounted={mounted}
    isPro={isPro}
    dailyHighlights={dailyHighlights}
    dailyLoading={dailyLoading}
    dailyError={dailyError}
    notificationsPreview={notificationsPreview}
     dashaTimeline={dashaTimeline} 
  />
)}


</div>

    </main>
    
  );
  
}
const TabFullPlan: React.FC<TabFullPlanProps> = ({
  report,
  mounted,
  isPro,
  dailyHighlights,
  dailyLoading,
  dailyError,
  notificationsPreview,
  dashaTimeline,
}) => {
   const isPreview = !isPro;
  if (!mounted) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Loading Full Plan
      </div>
      
    );
  }


  // -------------------------
  // BLANK STATE: no report yet
  // -------------------------
  const r: any = report ?? null;

  const hasReport =
  !!r &&
  typeof r === "object" &&
  (
    (Array.isArray(r?.planets) && r.planets.length > 0) ||
    (Array.isArray(r?.core?.houses) && r.core.houses.length > 0) ||
    !!r?.ascSign ||
    !!r?.meta?.birthDateISO
  );


  if (!hasReport) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
        Full plan
      </div>

      <div className="mt-1 text-lg font-semibold text-slate-100">
        Enter birth details to generate your Full Plan
      </div>

      <div className="mt-2 text-sm text-white/70 leading-relaxed">
        This section becomes personalized only after you generate your report.
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-indigo-950/40 p-3 text-sm text-white/75">
        Tip: Fill your birth details above and click{" "}
        <span className="text-white/90 font-medium">Generate / Refresh Report</span>.
      </div>
    </div>
  );
}

  
const ap = r?.activePeriods as any;



const todayISO = (() => {
  const tz = (r as any)?.meta?.birthTz ?? "Asia/Dubai";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
})();


const horizonISO = new Date(Date.now() + 365 * 24 * 3600 * 1000)
  .toISOString()
  .slice(0, 10);

// ï¿½ define FIRST
const toISODate = (v: any): string => {
  const s = String(v || "").trim();
  if (!s) return "";

  // Already ISO-ish (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss...)
  const isoMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = String(isoMatch[2]).padStart(2, "0");
    const d = String(isoMatch[3]).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // DD-MM-YYYY or DD/MM/YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const d = String(dmy[1]).padStart(2, "0");
    const m = String(dmy[2]).padStart(2, "0");
    const y = dmy[3];
    return `${y}-${m}-${d}`;
  }

  // Last resort: Date parse
  const dt = new Date(s);
  if (!Number.isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);

  return "";
};

const dayNum = (iso: string) => {
  if (!iso) return NaN;
  const t = new Date(iso + "T00:00:00.000Z").getTime();
  return t;
};

const normalizeRow = (row: any) => {
  const start = toISODate(
    row?.fromISO ??
      row?.startISO ??
      row?.from ??
      row?.start ??
      row?.startDate ??
      row?.dateFrom ??
      row?.begin ??
      row?.s
  );

  const end = toISODate(
    row?.toISO ??
      row?.endISO ??
      row?.to ??
      row?.end ??
      row?.endDate ??
      row?.dateTo ??
      row?.finish ??
      row?.e
  );

  const md = String(row?.md || row?.mahadasha || row?.mdLord || row?.planet || row?.major || "").trim();
  const ad = String(row?.ad || row?.antardasha || row?.adLord || row?.sub || row?.minor || "").trim();
  const pd = String(row?.pd || row?.pratyantardasha || row?.pdLord || row?.subsub || "").trim();

  return { start, end, md, ad, pd, raw: row };
};


// horizon numbers (safe compare)
const todayN = dayNum(todayISO);
const horizonN = dayNum(horizonISO);


const adEndISO = toISODate(ap?.antardasha?.end);
const adEndN = dayNum(adEndISO);

// +/- 1 day tolerance (handles timezone shifts)
const oneDay = 24 * 60 * 60 * 1000;

  // ï¿½ transits array to use everywhere in TabAdvanced
const hits =
  Array.isArray((report as any)?.transits) ? (report as any).transits :
  Array.isArray((report as any)?.topTransits) ? (report as any).topTransits :
  [];


  const align = computeAlignment(r);
  const ev = extractEvidence({ ...(r as any), transits: hits });
  const real = buildAlignmentDriversFromChart(r);

  const topDrivers = (() => {
    const a = [...takeN(ev.dasha, 2), ...takeN(ev.transit, 2), ...takeN(ev.focus, 2)]
      .map((x) => String(x).trim())
      .filter(Boolean);

    if (a.length >= 3) return a.slice(0, 3);

    return [
      "Your current cycle rewards consistency and structured action (do one thing fully).",
      "Emotional clarity improves when you slow responses and reduce noise.",
      "Timing is supportive for planning and follow-through; avoid impulsive decisions.",
    ];
  })();

  const drivers = [
    { key: "Mind", score: align.mind, why: real.why.mind, evidence: real.evidence.mind,
      do: ["Work in 2 focused blocks", "Write a 3-line plan before action"],
      avoid: ["Multitasking", "Starting 5 things at once"] },
    { key: "Emotions", score: align.emotions, why: real.why.emotions, evidence: real.evidence.emotions,
      do: ["One honest conversation", "10-minute quiet reset"],
      avoid: ["Over-explaining", "Late-night spirals"] },
    { key: "Direction", score: align.direction, why: real.why.direction, evidence: real.evidence.direction,
      do: ["Pick 1 priority and finish", "Say no to 1 distraction"],
      avoid: ["Changing targets mid-day", "Overcommitting"] },
    { key: "Energy", score: align.energy, why: real.why.energy, evidence: real.evidence.energy,
      do: ["Hardest task first", "2030 min movement"],
      avoid: ["Scrolling loops", "Reactive scheduling"] },
    { key: "External support", score: align.support, why: real.why.support, evidence: real.evidence.support,
      do: ["Ask for 1 specific help", "Set 1 boundary clearly"],
      avoid: ["Vague requests", "Silent resentment"] },
  ];
const weekTheme =
  takeN(ev.transit, 1)[0] ||
  takeN(ev.dasha, 1)[0] ||
  "Build steady momentum through consistency. Simplify, then execute deliberately.";
// --- Vimshottari helpers (AD inside current MD) ---
const VIM_ORDER = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"] as const;

const PLANET_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const normLord = (s: any) => {
  const t = String(s || "").trim();
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
};

const addDaysISO = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + Math.max(0, Math.round(days)));
  return d.toISOString().slice(0, 10);
};

const diffDays = (aISO: string, bISO: string) => {
  // a - b
  const a = new Date(aISO).getTime();
  const b = new Date(bISO).getTime();
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
};

const rotateFrom = (lord: string) => {
  const i = VIM_ORDER.indexOf(lord as any);
  if (i < 0) return [...VIM_ORDER];
  return [...VIM_ORDER.slice(i), ...VIM_ORDER.slice(0, i)];
};

const nextInMdSeq = (mdLord: string, currentAdLord: string) => {
  const seq = rotateFrom(mdLord);
  const j = seq.indexOf(currentAdLord as any);
  if (j < 0) return seq[0]; // fallback
  return seq[(j + 1) % seq.length];
};

// Find current MD window from MD timeline (dashaTimeline)
// MD timeline rows only
const dtMD = Array.isArray(dashaTimeline)
  ? dashaTimeline
  : Array.isArray(r?.dashaTimeline)
  ? r.dashaTimeline
  : [];

const mdRow = dtMD
  .map((row: any) => ({
    planet: normLord(row?.planet || row?.md || row?.mahadasha || ""),
    start: String(row?.startISO || row?.start || "").slice(0, 10),
    end: String(row?.endISO || row?.end || "").slice(0, 10),
  }))
  .find((x: any) => x.start && x.end && x.start <= todayISO && todayISO <= x.end);

// Current MD/AD from activePeriods
const mdLord = normLord(ap?.mahadasha?.lord);
const adLord = normLord(ap?.antardasha?.subLord);
const adEnd = String(ap?.antardasha?.end || "").slice(0, 10);

// Compute next AD (only if it starts within next 12 months)
let nextAD: null | { lord: string; start: string; end: string } = null;

if (mdRow?.start && mdRow?.end && mdLord && adLord && adEnd) {
  const nextAdLord = nextInMdSeq(mdLord, adLord);
  const adStart = adEnd; // next AD starts right after current AD ends (same date boundary)

  // AD duration = MD duration * (planetYears / 120)
  const mdLenDays = diffDays(mdRow.end, mdRow.start);
  const years = PLANET_YEARS[nextAdLord] ?? 0;
  const adLenDays = mdLenDays * (years / 120);

  let adEndISO = addDaysISO(adStart, adLenDays);

  // Clamp to MD end
  if (adEndISO > mdRow.end) adEndISO = mdRow.end;

  // Only show if within horizon
  if (adStart > todayISO && adStart <= horizonISO) {
    nextAD = { lord: nextAdLord, start: adStart, end: adEndISO };
  }
}

// Next MD (major shift) from MD timeline
const nextMD = dtMD
  .map((row: any) => ({
    planet: normLord(row?.planet || ""),
    start: String(row?.startISO || "").slice(0, 10),
    end: String(row?.endISO || "").slice(0, 10),
  }))
  .find((x: any) => x.start && x.start > todayISO);
  // --------- Transits for "today chips" ----------
  const hitsToday = hits;

  const todayISOTransit = todayISO;
const topToday = topActiveTransitsForToday(hitsToday, todayISOTransit, 5);

   return (
  <div className="space-y-6">
    {(() => {
      // -------------------------
      // Shared helpers (tone + cleanup)
      // -------------------------
      const clean = (s: any) =>
        String(s || "")
          .replace(/\s+/g, " ")
          .trim();

      const sentenceCase = (s: string) => {
        const t = clean(s);
        if (!t) return "";
        const out = t.charAt(0).toUpperCase() + t.slice(1);
        return /[.!?]$/.test(out) ? out : out + ".";
      };

      
      const stripRepeats = (s: string) => {
        let t = clean(s);
        t = t.replace(/Focus this more around Food\s*&\s*diet focus\.?/gi, "");
        t = t.replace(/\s+\./g, ".");
        return clean(t);
      };

      const norm = (s: string) =>
        clean(s)
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, "")
          .replace(/\s+/g, " ");

      // tone shifting by horizon
      const toTodayTone = (s: string) => {
        let t = clean(s);
        // keep "today" if present; just reduce overly conversational fluff
        t = t.replace(/\bRight now\b/gi, "Today");
        t = t.replace(/\bcurrently\b/gi, "today");
        return t;
      };

      const toWeekTone = (s: string) => {
        let t = clean(s);
        t = t.replace(/\btoday\b/gi, "this week");
        t = t.replace(/\btonight\b/gi, "later this week");
        t = t.replace(/\bthis morning\b/gi, "early this week");
        t = t.replace(/\bthis afternoon\b/gi, "mid-week");
        t = t.replace(/\bthis evening\b/gi, "later this week");
        t = t.replace(/\bright now\b/gi, "over the next few days");
        t = t.replace(/\bcurrently\b/gi, "over the next 7 days");
        return t;
      };

      const toPhaseTone = (s: string) => {
        let t = clean(s);
        t = t.replace(/\btoday\b/gi, "this period");
        t = t.replace(/\btonight\b/gi, "later in the period");
        t = t.replace(/\bthis morning\b/gi, "early in the period");
        t = t.replace(/\bthis afternoon\b/gi, "mid-period");
        t = t.replace(/\bthis evening\b/gi, "later in the period");
        t = t.replace(/\bright now\b/gi, "as this period unfolds");
        t = t.replace(/\bcurrently\b/gi, "over the coming weeks");
        return t;
      };

      const safeList = (arr: any, n: number) =>
  (Array.isArray(arr) ? arr : [])
    .map((x: any) => {
      if (typeof x === "string") return clean(x);
      // handle objects like { text, reason } OR { label } OR { value }
      return clean(x?.text ?? x?.label ?? x?.value ?? "");
    })
    .filter(Boolean)
    .slice(0, n);

      // -------------------------
      // Derived text buckets (non-repetitive)
      // -------------------------
      const dashaNotes = safeList(ev?.dasha, 3);
      const transitNotes = safeList(ev?.transit, 3);
      const focusNotes = safeList(ev?.focus, 3);
      const cautionNotes = safeList(ev?.cautions, 3);

      // Core directive for paid feel (one anchor sentence)
      const coreDirective = (() => {
        const src =
          clean(transitNotes[0]) ||
          clean(dashaNotes[0]) ||
          clean(focusNotes[0]) ||
          "Focus on consistency and follow-through. Keep it simple and finish what you start.";
        return sentenceCase(trimToSentence(toPhaseTone(src), 180));
      })();

      // Today drivers  convert to Today tone and make them complete
      const driversToday = topDrivers
        .map((x) => sentenceCase(trimToSentence(toTodayTone(stripRepeats(String(x))), 160)))
        .slice(0, 3);

      // Weekly theme
      const weekThemeBase =
        clean(transitNotes[0]) ||
        clean(dashaNotes[0]) ||
        clean(weekTheme) ||
        "Build steady momentum through consistency. Simplify, then execute deliberately.";
      const weekThemeNice = sentenceCase(trimToSentence(toWeekTone(weekThemeBase), 220));

      // Weekly priorities: pick two distinct daily highlights without repeating theme
      const weeklyPriorities = (() => {
        const next7 = Array.isArray(dailyHighlights) ? dailyHighlights.slice(0, 7) : [];
        const themeN = norm(weekThemeBase);

        const candidates = next7
          .map((d: any) => clean(d?.text))
          .filter(Boolean)
          .filter((t) => {
            const tn = norm(t);
            if (!tn) return false;
            if (tn === themeN) return false;
            if (themeN && tn.startsWith(themeN.slice(0, Math.min(80, themeN.length)))) return false;
            return true;
          })
          .filter((t, idx, arr) => arr.findIndex((x) => norm(x) === norm(t)) === idx);

        const p1Raw =
          candidates[0] ||
          "Close one open loop and finish the first clear step of an important task.";
        const p2Raw =
          candidates[1] ||
          "Protect one focused block on your calendar and make steady progress on it.";

        const p1 = sentenceCase(
          trimToSentence(toWeekTone(p1Raw).replace(/^Over the next 7 days:\s*/i, "Early week: "), 170)
        );
        const p2 = sentenceCase(
          trimToSentence(toWeekTone(p2Raw).replace(/^Over the next 7 days:\s*/i, "Mid-week: "), 170)
        );

        return [p1, p2];
      })();

      const weeklyCaution = (() => {
        const base =
          clean(cautionNotes[0]) ||
          "Avoid impulsive decisions when you feel rushed. Slow down and verify.";
        return sentenceCase(trimToSentence(toWeekTone(base).replace(/^Over the next 7 days:\s*/i, "Watch for: "), 190));
      })();

      // Next 46 weeks: build a strategic phase box
      const phase = (() => {
        const theme = sentenceCase(trimToSentence(toPhaseTone(clean(weekTheme) || weekThemeBase), 240));

        const w12Raw =
          clean(transitNotes[1]) ||
          clean(dashaNotes[1]) ||
          "Simplify commitments, reset routines, and reduce distractions.";
        const w34Raw =
          clean(transitNotes[2]) ||
          clean(dashaNotes[2]) ||
          "Follow-through wins: make one decision and stick to it.";

        const w12 = sentenceCase(trimToSentence(toPhaseTone(`Weeks 12: ${w12Raw}`), 200));
        const w34 = sentenceCase(trimToSentence(toPhaseTone(`Weeks 34: ${w34Raw}`), 200));

        const meaningfulMoveRaw =
          clean(focusNotes[0]) ||
          clean(dailyHighlights?.[0]?.text) ||
          "Choose one outcome that matters and complete the first measurable milestone.";
        const meaningfulMove = sentenceCase(trimToSentence(toPhaseTone(meaningfulMoveRaw), 190));

        const watchOutRaw =
          clean(cautionNotes[0]) ||
          "Overcommitting, reactive decisions, and spreading effort too thin.";
        const watchOut = sentenceCase(trimToSentence(toPhaseTone(watchOutRaw), 190));

        return { theme, w12, w34, meaningfulMove, watchOut };
      })();

     // Timing Intelligence (today ? next 72 hours) : crisp + premium + no repetition
const timing = (() => {
  const pick = (k: "morning" | "midday" | "evening") => {
    const arr = (notificationsPreview as any)?.[k] || [];
    const raw = clean(arr?.[0]?.text || "");
    return stripRepeats(raw);
  };

  const oneWhy = (s: string) => {
    const t = sentenceCase(trimToSentence(clean(s), 160));
    if (!t) return "";
    return t
      .replace(/\bToday\b/gi, "In this window")
      .replace(/\bthis week\b/gi, "over the next few days");
  };

  const windows = [
    {
      key: "morning",
      label: "Morning",
      bestFor: "High-impact work, planning, key conversations",
      oneAction: "Lock 2540 minutes on the hardest task and start without switching.",
      avoid: "Multitasking or starting too many threads",
      why: oneWhy(pick("morning")),
    },
    {
      key: "midday",
      label: "Midday",
      bestFor: "Admin, follow-ups, low-risk decisions, money hygiene",
      oneAction: "Do a 5-minute check (spend/commitments/messages), then act only on basics.",
      avoid: "Big spends, rushed commitments, impulsive trades",
      why: oneWhy(pick("midday")),
    },
    {
      key: "evening",
      label: "Evening",
      bestFor: "Closing loops, family/home, light creative work, reflection",
      oneAction: "Close one open loop and do a 10-minute wind-down reset.",
      avoid: "Heavy debates or emotionally loaded decisions",
      why: oneWhy(pick("evening")),
    },
  ].map((w) => ({ ...w, why: w.why || "" }));

  const cautions =
    cautionNotes.length
      ? cautionNotes
          .map((x) => sentenceCase(trimToSentence(toTodayTone(clean(x)), 150)))
          .filter(Boolean)
          .slice(0, 3)
      : [
          "Avoid impulsive decisions during the afternoon dip.",
          "Avoid heavy conversations late at night.",
        ].map((x) => sentenceCase(x));

  return { windows, cautions };
})();


      // Next 12 months: same logic you built, but with better explanation and what to do
      const planetMeaning: Record<
        string,
        { theme: string; expect: string[]; do: string[]; avoid: string[] }
      > = {
        Sun: {
          theme: "Identity, leadership, visibility.",
          expect: ["Clear decisions become important", "Pressure to own outcomes"],
          do: ["Take ownership", "Commit to fewer priorities", "Lead with clarity"],
          avoid: ["Ego battles", "Overpromising"],
        },
        Moon: {
          theme: "Emotions, home, inner stability.",
          expect: ["Mood sensitivity increases", "Home/family themes rise"],
          do: ["Protect routine & sleep", "Communicate gently", "Stabilize habits"],
          avoid: ["Deciding from mood", "Overreacting"],
        },
        Mars: {
          theme: "Action, drive, conflict/competition.",
          expect: ["Faster pace", "Higher urgency"],
          do: ["Channel energy into one hard task", "Move quickly on small decisions"],
          avoid: ["Impulsive conflict", "Risk without plan"],
        },
        Mercury: {
          theme: "Learning, communication, deals.",
          expect: ["More conversations/options", "Better outcomes with data"],
          do: ["Write plans", "Clarify expectations", "Negotiate cleanly"],
          avoid: ["Overthinking", "Too many parallel tasks"],
        },
        Jupiter: {
          theme: "Growth, support, long-term wins.",
          expect: ["Mentors/support improve", "Bigger opportunities appear"],
          do: ["Invest in skills", "Build credibility", "Play long-term"],
          avoid: ["Overconfidence", "Ignoring details"],
        },
        Venus: {
          theme: "Harmony, relationships, comfort, money flow.",
          expect: ["Ease in connections", "Desire for stability/quality"],
          do: ["Strengthen key ties", "Upgrade systems", "Prioritize balance"],
          avoid: ["Overindulgence", "Avoiding tough talks"],
        },
        Saturn: {
          theme: "Discipline, structure, durable progress.",
          expect: ["More responsibility", "Slow wins that reward persistence"],
          do: ["Routine + consistency", "Close old duties", "Stay patient"],
          avoid: ["Cutting corners", "Quitting too soon"],
        },
        Rahu: {
          theme: "Ambition, experimentation, visibility.",
          expect: ["Restlessness / hunger for change", "New networks and unusual paths"],
          do: ["Calculated risks", "Expand reach strategically", "Stay curious, stay grounded"],
          avoid: ["Chasing hype", "Overextending"],
        },
        Ketu: {
          theme: "Detachment, simplification, clarity.",
          expect: ["Less interest in distractions", "Pruning and redefining priorities"],
          do: ["Reduce noise", "End what drains you", "Refine direction"],
          avoid: ["Cutting ties impulsively", "Withdrawing too much"],
        },
      };

      const meaningFor = (p: any) => planetMeaning[clean(p)] || null;

      const md = clean(ap?.mahadasha?.lord);
      const ad = clean(ap?.antardasha?.subLord);
      const pd = clean(ap?.pratyantardasha?.subLord);

      const mdInfo = meaningFor(md);
      const adInfo = meaningFor(ad);
      const nextAdInfo = meaningFor(nextAD?.lord);
      const nextMdInfo = meaningFor(nextMD?.planet);

      // -------------------------
      // UI
      // -------------------------
      return (
        <>
          {/* Header */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Full plan  explain + act
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              A clear plan for today  and the direction your next months are moving toward
            </div>
            <div className="mt-1 text-sm text-white/70">
              Built from your report signals (dasha + transits) and translated into actions.
            </div>
          </div>
      {/* Todays strong transits */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Todays strongest transits
        </div>

        {topToday.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {topToday.map((t: any, i: number) => (
              <span
                key={(t?.id ?? i) as any}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/80"
              >
                {formatTransitChip(t)}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-sm text-white/70">
            No strong hits today  we lean more on your MD/AD signals.
          </div>
        )}
      </div>

          {/* 1) TODAY */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <div className="text-sm font-semibold text-slate-100">Today: your 3 biggest drivers</div>
            <div className="mt-1 text-sm text-white/70">
              Keep these in mind all day  they explain why your mood, focus, and timing feel the way they do.
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {driversToday.map((t, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-indigo-950/40 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Driver {idx + 1}
                  </div>
                  <div className="mt-2 text-sm text-white/85 leading-relaxed">{t}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2) Timing Intelligence (today ï¿½ next 72 hours) */}
<details className="rounded-2xl border border-white/15 bg-indigo-950/40 p-4 backdrop-blur-md" open>
  <summary className="cursor-pointer list-none">
    <div className="text-sm font-semibold text-slate-100">Todays Energy Windows</div>
    <div className="mt-1 text-xs text-white/60">
      When to act, when to pause  based on todays planetary rhythm.
    </div>
  </summary>

  <div className="mt-4 space-y-3">
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/75">
      Use this like a GPS: <span className="text-white/85">do high-impact work in best windows</span>, and keep
      caution windows for low-risk tasks (admin, cleanup, light workouts).
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      {/* Best windows */}
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100/90">
          Best windows (today)
        </div>

        <div className="mt-3 space-y-3">
          {Array.isArray(timing.windows) && timing.windows.length ? (
            timing.windows.map((w: any) => {
              // Prefer w.why (new model), fallback to w.text (old model)
              const whyLine = stripRepeats(String(w.why || w.text || "")).trim();
              return (
                <div key={w.key} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{w.label}</div>
                      <div className="mt-1 text-sm text-white/85">
                        <span className="text-white/60 text-[11px] uppercase tracking-wide mr-2">Best for</span>
                        {w.bestFor}
                      </div>
                    </div>
                  </div>

                  {/* Optional "Why" (1 short line) */}
                  {clean(w.why) ? (
  <div className="mt-2 rounded-md border border-white/10 bg-white/5 p-2 text-sm text-white/75 leading-relaxed">
    <span className="text-white/60 text-[11px] uppercase tracking-wide mr-2">Why</span>
    {w.why}
  </div>
) : null}

                  {/* One action (always shown) */}
                  <div className="mt-2 rounded-md border border-emerald-400/20 bg-emerald-500/10 p-2 text-sm text-white/85">
                    <span className="text-emerald-100/90 font-semibold">One action:</span> {w.oneAction}
                  </div>

                  <div className="mt-2 text-xs text-white/60">
                    Avoid: {w.avoid}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-white/70">
              Windows will appear once schedule insights are available  until then, use the default actions above.
            </div>
          )}
        </div>
      </div>

      {/* Caution windows */}
      <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-red-100/90">
          Caution windows
        </div>

        <div className="mt-3 space-y-2">
          {(Array.isArray(timing.cautions) && timing.cautions.length ? timing.cautions : []).map((c: string, i: number) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/85">
              {c}
            </div>
          ))}

          {!timing.cautions?.length ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/70">
              No caution notes detected  still avoid rushed commitments when you feel pressured.
            </div>
          ) : null}
        </div>

        <div className="mt-3 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-white/85">
          <span className="font-semibold text-red-100/90">Rule of thumb:</span> during caution windows, do low-stakes tasks
          and delay big conversations, spends, or commitments.
        </div>
      </div>
    </div>
  </div>
</details>

          {/* 3) Next 35 days (optional but premium) */}
          {/* 3) Next 35 days (premium) */}
<details className="rounded-2xl border border-white/15 bg-white/5 p-4">
  <summary className="cursor-pointer list-none">
    <div className="text-sm font-semibold text-slate-100">Next 3 days</div>
    <div className="mt-1 text-xs text-white/60">
      A short runway showing how momentum unfolds over the next few days.
    </div>
  </summary>

  <div className="mt-4 space-y-3">
    {(!dailyLoading &&
      !dailyError &&
      Array.isArray(dailyHighlights) &&
      dailyHighlights.length > 0) ? (
      dailyHighlights.slice(0, 4).map((h: any, idx: number) => {
        const headline = clean(h?.headline || "");
        const likely = safeList(h?.likely, 3);
        const dos = safeList(h?.do, 3);
        const avoids = safeList(h?.avoid, 3);
        const body = sentenceCase(trimToSentence(stripRepeats(clean(h?.text)), 220));

        return (
          <div key={idx} className="rounded-xl border border-white/10 bg-indigo-950/40 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
                {h?.dateISO || ""}
              </div>
              {clean(h?.confidence) ? (
                <div className="rounded-full border border-white/15 bg-white/5 px-2 py-[2px] text-[10px] text-white/70">
                  {String(h.confidence).toUpperCase()}
                </div>
              ) : null}
            </div>

            {headline ? (
              <div className="mt-1 text-sm font-semibold text-slate-100">{headline}</div>
            ) : null}

            {likely.length ? (
              <div className="mt-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
                  Likely events
                </div>
                <ul className="mt-1 list-disc pl-4 text-sm text-white/85 space-y-1">
                  {likely.map((x: string, i: number) => (
                    <li key={i}>{sentenceCase(trimToSentence(x, 120))}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {body ? (
              <div className="mt-2 text-sm text-white/80 leading-relaxed">{body}</div>
            ) : null}

            {(dos.length || avoids.length) ? (
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-100/90">
                    Do
                  </div>
                  <ul className="mt-1 list-disc pl-4 text-sm text-white/85 space-y-1">
                    {(dos.length ? dos : ["Do one important thing fully."]).map((x: string, i: number) => (
                      <li key={i}>{sentenceCase(trimToSentence(x, 90))}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-red-100/90">
                    Avoid
                  </div>
                  <ul className="mt-1 list-disc pl-4 text-sm text-white/85 space-y-1">
                    {(avoids.length ? avoids : ["Avoid impulsive reactions."]).map((x: string, i: number) => (
                      <li key={i}>{sentenceCase(trimToSentence(x, 90))}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        );
      })
    ) : (
      <div className="text-xs text-white/60">No short plan available yet.</div>
    )}
  </div>
</details>

          {/* 4) Weekly insight */}
          <details className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <summary className="cursor-pointer list-none">
              <div className="text-sm font-semibold text-slate-100">This week (next 7 days)</div>
              <div className="mt-1 text-xs text-white/60">One theme + two priorities + one watch-out</div>
            </summary>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-indigo-950/40 p-3 md:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Theme</div>
                <div className="mt-1 text-sm text-white/85 leading-relaxed">{weekThemeNice}</div>
              </div>

              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100/90">Priorities</div>
                <ul className="mt-2 list-disc pl-4 text-sm text-white/80 space-y-1">
                  <li>{weeklyPriorities[0]}</li>
                  <li>{weeklyPriorities[1]}</li>
                </ul>
              </div>

              <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-red-100/90">Watch-out</div>
                <div className="mt-2 text-sm text-white/80">{weeklyCaution}</div>
              </div>
            </div>
          </details>

          {/* 5) Next 46 weeks */}
          <details className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <summary className="cursor-pointer list-none">
              <div className="text-sm font-semibold text-slate-100">Next 46 weeks</div>
              <div className="mt-1 text-xs text-white/60">The broader direction your energy is moving toward  not daily noise.</div>
            </summary>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Core direction</div>
                <div className="mt-1 text-sm text-white/85 leading-relaxed">{coreDirective}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-indigo-950/40 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Theme</div>
                <div className="mt-1 text-sm text-white/85 leading-relaxed">{phase.theme}</div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Weeks 12</div>
                  <div className="mt-1 text-sm text-white/80 leading-relaxed">
                    {phase.w12.replace(/^Weeks 12:\s*/i, "")}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Weeks 34</div>
                  <div className="mt-1 text-sm text-white/80 leading-relaxed">
                    {phase.w34.replace(/^Weeks 34:\s*/i, "")}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100/90">
                    Most meaningful move
                  </div>
                  <div className="mt-2 text-sm text-white/80 leading-relaxed">{phase.meaningfulMove}</div>
                </div>

                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-red-100/90">Watch-out</div>
                  <div className="mt-2 text-sm text-white/80 leading-relaxed">{phase.watchOut}</div>
                </div>
              </div>
            </div>
          </details>

          {/* 6) Next 12 months */}
          <details className="rounded-2xl border border-white/15 bg-indigo-950/40 p-4 backdrop-blur-md">
            <summary className="cursor-pointer list-none">
              <div className="text-sm font-semibold text-slate-100">Next 12 months</div>
              <div className="mt-1 text-xs text-white/60">
                What changes + what it means (in plain English)
              </div>
            </summary>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/75">
                <span className="text-white/85 font-semibold">How to read this:</span> Mahadasha is your big life chapter (years),
                Antardasha is the sub-chapter (months/years). The most noticeable shift inside the next 12 months is usually
                the next Antardasha change.
              </div>

              {(md || ad || pd) ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Current cycle</div>

                  <div className="mt-2 text-sm text-white/85">
                    {md ? `Big chapter (MD): ${md}` : "Big chapter (MD): "}
                    {ad ? `  Sub-chapter (AD): ${ad}` : ""}
                    {pd ? `  Short phase (PD): ${pd}` : ""}
                  </div>

                  <div className="mt-1 text-xs text-white/60">
                    {ap?.antardasha?.start && ap?.antardasha?.end
                      ? `${String(ap.antardasha.start).slice(0, 10)} ï¿½ ${String(ap.antardasha.end).slice(0, 10)}`
                      : ""}
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-indigo-950/40 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-white/60">What it means</div>
                      <div className="mt-2 text-sm text-white/80 leading-relaxed">
                        {sentenceCase(
                          mdInfo?.theme
                            ? `MD ${md}: ${mdInfo.theme}`
                            : "Your current chapter sets the overall tone  focus on steady, intentional progress."
                        )}
                      </div>
                      {adInfo?.theme ? (
                        <div className="mt-2 text-sm text-white/75 leading-relaxed">
                          {sentenceCase(`AD ${ad}: ${adInfo.theme}`)}
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100/90">How to use this</div>
                      <ul className="mt-2 list-disc pl-4 text-sm text-white/80 space-y-1">
                        {(adInfo?.do?.length ? adInfo.do : mdInfo?.do?.length ? mdInfo.do : ["Pick 1 priority and finish it", "Keep routine strong", "Avoid reactive decisions"])
                          .slice(0, 3)
                          .map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 md:grid-cols-2">
                {nextAD ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                      Next shift (Antardasha)
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-100">AD: {nextAD.lord}</div>
                    <div className="mt-1 text-xs text-white/60">{nextAD.start} ï¿½ {nextAD.end}</div>

                    <div className="mt-3 rounded-lg border border-white/10 bg-indigo-950/40 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-white/60">What you may notice</div>
                      <ul className="mt-2 list-disc pl-4 text-sm text-white/80 space-y-1">
                        {(nextAdInfo?.expect?.length ? nextAdInfo.expect : ["A noticeable change in motivation/focus", "Different kinds of opportunities/pressure show up"])
                          .slice(0, 3)
                          .map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>

                    <div className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100/90">
                        Best way to prepare
                      </div>
                      <ul className="mt-2 list-disc pl-4 text-sm text-white/80 space-y-1">
                        {(nextAdInfo?.do?.length ? nextAdInfo.do : ["Close open loops", "Simplify commitments", "Make a simple plan"])
                          .slice(0, 3)
                          .map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Next shift (Antardasha)</div>
                    No Antardasha boundary inside the next 12 months  the theme stays consistent. Focus on execution and compounding.
                  </div>
                )}

                {nextMD?.start ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                      Major shift (Mahadasha)  longer term
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-100">MD: {nextMD.planet}</div>
                    <div className="mt-1 text-xs text-white/60">{nextMD.start} ï¿½ {nextMD.end}</div>

                    <div className="mt-3 text-sm text-white/80 leading-relaxed">
                      {sentenceCase(
                        nextMdInfo?.theme
                          ? `This begins a bigger life chapter: ${nextMdInfo.theme}`
                          : "This is a bigger turning-point chapter  your priorities and direction can shift more noticeably."
                      )}
                    </div>

                    <div className="mt-3 rounded-lg border border-red-400/20 bg-red-500/10 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-red-100/90">Avoid</div>
                      <ul className="mt-2 list-disc pl-4 text-sm text-white/80 space-y-1">
                        {(nextMdInfo?.avoid?.length ? nextMdInfo.avoid : ["Big reactive decisions without a plan", "Burning bridges impulsively"])
                          .slice(0, 2)
                          .map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </details>

          {/* 7) Deep dive: Soul Alignment */}
          <details className="rounded-2xl border border-white/15 bg-indigo-950/40 p-4 backdrop-blur-md">
            <summary className="cursor-pointer list-none">
              <div className="text-sm font-semibold text-slate-100">Soul Alignment Index  explained</div>
              <div className="mt-1 text-xs text-white/60">Why each score is high/low + do/avoid + evidence</div>
            </summary>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
  {(Array.isArray(timing?.windows) ? timing.windows : []).slice(0, 3).map((w: any, i: number) => (
    <div key={w.key ?? i} className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-slate-100">{w.label}</div>

      <div className="mt-1 text-xs text-white/70">
        {w.bestFor ? `Best for: ${w.bestFor}` : "Best for: "}
      </div>

      <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/80">
        <span className="text-white/60 text-[11px] uppercase tracking-wide mr-2">One action</span>
        {w.oneAction || "Pick one meaningful action and finish it."}
      </div>

      <div className="mt-2 text-xs text-white/60">
        Avoid: {w.avoid || "Rushed commitments."}
      </div>
    </div>
  ))}

  {!timing?.windows?.length ? (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
      No windows available yet. Generate/refresh the report to compute timing windows.
    </div>
  ) : null}
</div>

          </details>
        </>
      );
    })()}
  </div>
);
};


export default LifeReportShell;

/* ---------------- Prefill wrapper (disabled for now) ---------------- */

// function LifeReportInnerWithPrefill() {
//   
//
//   const name = searchParams.get("name") ?? "";
//   const dateISO = searchParams.get("date") ?? "";
//   const time = searchParams.get("time") ?? "";
//   const tz = searchParams.get("tz") ?? "";
//   const placeName = searchParams.get("place") ?? "";
//
//   return (
//     <LifeReportShell
//       initialName={name}
//       initialDateISO={dateISO}
//       initialTime={time}
//       initialTz={tz}
//       initialPlaceName={placeName}
//     />
//   );
// }
//
// export default LifeReportInnerWithPrefill;


