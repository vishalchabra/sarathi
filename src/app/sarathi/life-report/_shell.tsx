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

import { useSearchParams } from "next/navigation";
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
const AYANAMSA_LAHIRI_APPROX = 23.85;


/* ---------------- Locking city autocomplete (simplified – always typeable) ---------------- */


const cityCache = new Map<string, Array<{ name: string; lat: number; lon: number }>>();

type PlaceLite = { name: string; lat: number; lon: number; tz?: string };

function LockingCityAutocomplete({
  value,
  onSelect,
  placeholder = "Start typing a city…",
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
    }
    if (!value && q && !q.trim()) {
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
        const res = await fetch(url, { headers: { "Accept-Language": "en" } });
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
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clearAll}
          aria-label="Clear"
          title="Clear"
        >
          ×
        </button>
      )}

      {open && (
        <div
          data-citymenu
          className="absolute z-20 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow"
        >
          {loading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">Searching…</div>
          )}
          {!loading && !items.length && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
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
                <span className="ml-2 text-xs text-muted-foreground">
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

  // 🕒 Timings
  sunrise?: string | null;
  sunriseISO?: string | null;
  sunset?: string | null;
  sunsetISO?: string | null;
  moonrise?: string | null;
  moonriseISO?: string | null;
  moonset?: string | null;
  moonsetISO?: string | null;

  // 🕑 Kaal windows (we’ll still show “— – —” until backend sends structured ranges)
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

/* === Sidereal alignment helpers (Lahiri) === */

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

/** Light, date-aware Lahiri ayanāṁśa (deg). Base ~23.856° at 2000 CE, +50.29″/yr. */
function lahiriAyanamsaDegrees(date: Date) {
  const year = date.getUTCFullYear();
  const base = 23.856; // around J2000
  const perYear = 50.29 / 3600; // deg/yr
  return base + (year - 2000) * perYear;
}

/** Convert tropical ecliptic longitude → sidereal (Lahiri). */
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

// --- Yoga / Karana from sidereal ⊙ & ☾ ---

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

function norm360(x: number) {
  return ((x % 360) + 360) % 360;
}

/** Yoga = floor( (Sun + Moon) / 13°20' ) over 27 parts (sidereal) */
function computeYogaName(
  sunSidDeg?: number,
  moonSidDeg?: number
): string | undefined {
  if (sunSidDeg === undefined || moonSidDeg === undefined) return;
  const sum = norm360(sunSidDeg + moonSidDeg);
  const idx = Math.floor(sum / (360 / 27));
  return YOGAS_27[idx];
}

/** Karana: K = floor( (Moon - Sun) / 6° ) over 60 parts; mapping per canonical rules */
function computeKaranaName(
  sunSidDeg?: number,
  moonSidDeg?: number
): string | undefined {
  if (sunSidDeg === undefined || moonSidDeg === undefined) return;
  const D = norm360(moonSidDeg - sunSidDeg); // angular separation (sidereal)
  const K = Math.floor(D / 6); // 0..59

  // Fixed (sthira) karanas at specific K values:
  // 57 → Shakuni, 58 → Chatushpada, 59 → Naga, 0 → Kimstughna
  if (K === 57) return "Shakuni";
  if (K === 58) return "Chatushpada";
  if (K === 59) return "Naga";
  if (K === 0) return "Kimstughna";

  // Otherwise repeating set of 7 movable karanas
  return KARANA_MOVABLE[(K - 1 + 7) % 7];
}

/* ---------------- Helpers ---------------- */
function primaryCategoryForRange(
  transits: any[] | null | undefined,
  from: Date,
  to: Date
): string {
  if (!Array.isArray(transits) || !transits.length) {
    return "general";
  }

  // Very simple logic for now:
  // pick the strongest transit whose active window overlaps the range
  const overlapping = transits.filter((t: any) => {
    if (!t?.from || !t?.to) return false;
    const start = new Date(t.from);
    const end = new Date(t.to);
    return end >= from && start <= to;
  });

  const primary = overlapping[0] ?? transits[0];
  return primary?.category ?? "general";
}
function strongestTransitForRange(
  transits: any[] | null | undefined,
  from: Date,
  to: Date
): any | null {
  if (!Array.isArray(transits) || !transits.length) {
    return null;
  }

  // Filter to only transits that overlap this range
  const overlapping = transits.filter((t: any) => {
    if (!t?.from || !t?.to) return false;
    const start = new Date(t.from);
    const end = new Date(t.to);
    return end >= from && start <= to;
  });

  const pool = overlapping.length ? overlapping : transits;

  // Prefer the one with highest "strength" if available
  const withStrength = pool.filter(
    (t: any) => typeof t?.strength === "number"
  );

  let primary: any | null = null;

  if (withStrength.length) {
    primary = withStrength.sort(
      (a: any, b: any) => (b.strength ?? 0) - (a.strength ?? 0)
    )[0];
  } else {
    primary = pool[0] ?? null;
  }

  return primary ?? null;
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
    festivals: Array.isArray(p.festivals) ? p.festivals : undefined,
  };
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

// small helper to generate facts from moon + transits
function buildDailyFacts(
  dailyMoon: DailyMoonEntry[],
  transits: TransitHit[],
  startDateISO: string,
  days: number
): DailyFact[] {
  const startBase =
    parseISODateLoose(startDateISO) ??
    parseISODateLoose(new Date().toISOString().slice(0, 10)) ??
    new Date();

  const clampedDays = Math.max(1, Math.min(days, 14));
  const out: DailyFact[] = [];

  for (let i = 0; i < clampedDays; i++) {
    const day = addDaysLoose(startBase, i);
    const dateISO = day.toISOString().slice(0, 10);

       const m = dailyMoon.find((x) => x.dateISO === dateISO);

    const nak =
      (m as any)?.moonNakshatraName ||
      (m as any)?.moonNakshatra ||
      (m as any)?.nakshatraName ||
      (m as any)?.nakshatra ||
      "this nakshatra";

    const rel =
      (m as any)?.relativeHouseFromMoon ?? (m as any)?.houseFromMoon;


    const strongest = (() => {
      const ts = transits.filter(
        (t) => t.startISO <= dateISO && t.endISO >= dateISO
      );
      if (!ts.length) return null;
      const best = ts.reduce((b, c) =>
        c.strength > b.strength ? c : b
      );
      return {
        planet: best.planet,
        target: best.target,
        category: best.category,
        strength: best.strength,
        startISO: best.startISO,
        endISO: best.endISO,
      };
    })();

    out.push({
      dateISO,
      moonNakshatra: nak,
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
    const bullets = Array.isArray((obj as any)?.text) ? (obj as any).text.filter(Boolean) : [];
    const closing = typeof (obj as any)?.closing === "string" ? (obj as any).closing : "";
    if (bullets.length || closing) return { bullets, closing };
  } catch {
    // ignore
  }

  // plain text fallback → split into lines if it looks list-y
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

// ---------------- Weekly guidance helper (client-side) ----------------

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
    // e.g. "Nov 20–26"
    return `${month} ${d1}–${d2}`;
  }

  // Different months or years, e.g. "Nov 30 – Dec 6"
  return `${fmt.format(start)} – ${fmt.format(end)}`;
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
      extra = ` A noticeable influence from ${planet} ${target} is active in the background — stay conscious, go slow and avoid big reactions.`;
    }

    out.push({
      label,
      text: base + (extra ? extra : ""),
    });
  }

  return out;
}

/* ---------------- Monthly highlights helper (client-side) ---------------- */

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
      return "your overall mood and the day’s emotional flow";
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

function buildDailyFromMoonAndTransits(
  dailyMoon: DailyMoonEntry[],
  transits: TransitHit[],
  startDateISO: string,
  days: number
): DailyHighlight[] {
  const out: DailyHighlight[] = [];

  const startBase =
    parseISODateLoose(startDateISO) ??
    parseISODateLoose(new Date().toISOString().slice(0, 10)) ??
    new Date();

  const clampedDays = Math.max(1, Math.min(days, 14));

  for (let i = 0; i < clampedDays; i++) {
    const day = addDaysLoose(startBase, i);
    const dateISO = day.toISOString().slice(0, 10);

    const m = dailyMoon.find((x) => x.dateISO === dateISO);

    const nak =
      m?.nakshatraName ??
      m?.nakshatra ??
      // for sweDailyMoon rows
      (m as any)?.moonNakshatra ??
      "this nakshatra";

    // 🔹 This was missing – define relHouse safely from any of the fields
    const relHouse =
      typeof (m as any)?.relativeHouseFromMoon === "number"
        ? (m as any).relativeHouseFromMoon
        : typeof (m as any)?.houseFromMoon === "number"
        ? (m as any).houseFromMoon
        : null;

    const houseText = houseFocusFromMoon(
      typeof relHouse === "number" ? relHouse : undefined
    );
    const houseOrdinal = ordinal(
      typeof relHouse === "number" ? relHouse : undefined
    );

    // Base Moon sentence
    let text = `Today the Moon moves through ${nak} from your natal Moon${
      relHouse ? ` (about the ${houseOrdinal} house)` : ""
    }, drawing attention to ${houseText}.`;

    // Overlay strongest transit for that day, if any
    const strong = chooseStrongTransitForDay(dateISO, transits);
    if (strong) {
      const area = shortCategoryLabel(strong.category);
      const planet = strong.planet;
      const target = strong.target || "a key natal point";

      if (strong.category === "career") {
        text += ` With ${planet} ${target}, a stronger career transit is active now, so even small decisions about work, visibility or long-term direction can carry extra weight.`;
      } else if (strong.category === "relationships") {
        text += ` With ${planet} ${target}, relationships are a little louder; one honest, present interaction can shift the tone around you.`;
      } else if (strong.category === "health") {
        text += ` ${planet} ${target} highlights ${area}; listen to your body and adjust pace, food or rest instead of pushing blindly.`;
      } else if (strong.category === "inner") {
        text += ` ${planet} ${target} amplifies inner work; some quiet time for reflection, journaling or prayer will go a long way.`;
      } else {
        text += ` ${planet} ${target} colours your day in a subtle way; notice which life area feels ready for a small adjustment.`;
      }
    }

    out.push({ dateISO, text });
  }

  return out;
}


// ---------------- Daily highlights helper (client-side) ----------------

type DailyHighlight = { dateISO: string; text: string };

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
  days: number
): DailyFeature[] {
  const startBase =
    parseISODateLoose(startDateISO) ??
    parseISODateLoose(new Date().toISOString().slice(0, 10)) ??
    new Date();

  const clampedDays = Math.max(1, Math.min(days, 14));
  const out: DailyFeature[] = [];

  for (let i = 0; i < clampedDays; i++) {
    const day = addDaysLoose(startBase, i);
    const dateISO = day.toISOString().slice(0, 10);

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

  // Case: raw is 0–30 = within sign, use sign index to build 0–360
  if (raw >= 0 && raw < 30 && signIdx >= 0) {
    return wrap360(signIdx * 30 + raw);
  }

  // Case: raw looks already 0–360 sidereal and matches sign
  if (signIdx >= 0 && signIndexFromDeg(raw) === signIdx) {
    return wrap360(raw);
  }

  // 3) Last resort: treat raw as tropical and subtract Lahiri ayanamsa
  const sidGuess = wrap360(raw - AYANAMSA_LAHIRI_APPROX);
  if (signIdx >= 0 && signIndexFromDeg(sidGuess) === signIdx) {
    return sidGuess;
  }

  // If we can't be clever, still return the guess — better than nothing
  return sidGuess;
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
  if (!sign) return { tag: "—", weight: 0 };
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

/* ---- zodiac helpers for House → Sign legend ---- */

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
                p.sign ? ` • ${p.sign}` : ""
              }${p.house ? ` • House ${p.house}` : ""}`}</title>
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
        name: name || "—",
        sign: sign || "—",
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
      headline: `Ascendant • ${asc.sign}${
        asc.house ? ` • House ${asc.house}` : ""
      }${ascNakshatra ? ` • ${ascNakshatra}` : ""}`,
      bullets: [
        d.theme
          ? `Core vibe: ${d.theme}.`
          : `Core vibe shaped by ${asc.nakshatra || "asc. nakshatra"}.`,
        d.friendly.length
          ? `Supported by: ${d.friendly.join(", ")}.`
          : "Supported by: —",
        d.enemy.length
          ? `Pressures from: ${d.enemy.join(", ")}.`
          : "Pressures from: —",
      ],
    });
  }

  if (moon) {
    const d = describeTarget("Moon", moonNakshatra ?? moon.nakshatra);
    out.push({
      headline: `Moon • ${moon.sign}${
        moon.house ? ` • House ${moon.house}` : ""
      }${moonNakshatra ? ` • ${moonNakshatra}` : ""}`,
      bullets: [
        d.theme
          ? `Emotional style: ${d.theme}.`
          : `Emotional style tuned by ${moon.nakshatra || "moon nakshatra"}.`,
        d.friendly.length
          ? `Nourished by: ${d.friendly.join(", ")}.`
          : "Nourished by: your own inner reserves (no strong friendly aspects).",
        d.enemy.length
          ? `Stressors: ${d.enemy.join(", ")}.`
          : "Stressors: no major challenging aspects; general mood and environment matter more.",
      ],
    });
  }

  const keys = ["Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  for (const k of keys) {
    const p = planets.find((pl) => pl.name.toLowerCase() === k.toLowerCase());
    if (!p) continue;
    const d = describeTarget(k, p.nakshatra);
    out.push({
      headline: `${k} • ${p.sign}${
        p.house ? ` • House ${p.house}` : ""
      }${p.nakshatra ? ` • ${p.nakshatra}` : ""}`,
      bullets: [
        d.theme
          ? `Expression: ${d.theme}.`
          : `Expression through ${p.nakshatra || "nakshatra"}.`,
        d.friendly.length
          ? `Gets help from: ${d.friendly.join(", ")}.`
          : "Gets help from: inner strength and the basic dignity of this planet (no strong friendly aspects).",
        d.enemy.length
          ? `Faces resistance from: ${d.enemy.join(", ")}.`
          : "Faces resistance from: normal life challenges rather than direct planetary clashes.",
      ],
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
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "caution":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-slate-50 text-slate-600 border border-slate-200";
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
  return (
    <div className="rounded-xl border border-muted-foreground/20 p-3 bg-muted/40">
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="font-semibold">{label}</div>
        <div className="text-muted-foreground">
          {new Date(start).toLocaleDateString()} →{" "}
          {new Date(end).toLocaleDateString()}
        </div>
      </div>
      {subtitle && (
        <div className="text-xs text-muted-foreground mb-2">{subtitle}</div>
      )}
      <div className="h-2 w-full rounded bg-muted overflow-hidden">
        <div
          className="h-2 bg-foreground/70"
          style={{ width: `${pct.toFixed(1)}%` }}
        />
      </div>
      <div className="text-[11px] text-muted-foreground mt-1">
        {pct.toFixed(1)}% complete
      </div>
    </div>
  );
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

/* ---------- Individual tab components ---------- */

const TabTransits: React.FC<TabTransitsProps> = memo(
  ({
    transits,
    loading,
    error,
    transitSummary,
    dailyHighlights,
    dailyLoading,
    dailyError,
    mounted,
  }) => {
    const hasTransits = Array.isArray(transits) && transits.length > 0;

    return (
      <div
        className={
          "space-y-4 transform transition-all duration-300 " +
          (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
        }
      >
        {/* Card 1: key themes + short-term view */}
        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Transits — Key Themes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {loading && (
              <div className="text-muted-foreground">
                Looking at your current and upcoming transits...
              </div>
            )}

            {!loading && error && (
              <div className="text-sm text-red-500">{error}</div>
            )}

                        {!loading && !error && !hasTransits && (
              <div className="text-muted-foreground text-xs leading-relaxed">
                Right now the sky looks relatively calm for you.
                No strong transit windows are active in the next few days,
                so focus on steady, simple actions and rest where you can.
              </div>
            )}


            {!loading && !error && transitSummary && (
              <p className="text-xs whitespace-pre-wrap leading-relaxed">
                {transitSummary}
              </p>
            )}

            {/* Today + next few days (reuse dailyHighlights) */}
            {!loading && !error && dailyHighlights.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Today &amp; next few days
                </p>
                <ul className="space-y-1 text-xs">
                  {dailyHighlights.map((d) => (
                    <li key={d.dateISO}>
                      <span className="font-semibold">{d.dateISO}:</span>{" "}
                      {d.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!loading && !error && dailyError && (
              <div className="text-xs text-red-500">{dailyError}</div>
            )}

            {dailyLoading && (
              <div className="text-xs text-muted-foreground">
                Loading daily highlights...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: full transit windows, but hidden behind <details> */}
        {hasTransits && (
          <Card className="rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Upcoming transit windows
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <details>
                <summary className="cursor-pointer text-xs text-muted-foreground">
                  Show full list of transit windows (next 12 months)
                </summary>

                <div className="mt-3 space-y-3">
                  {(transits as any[]).map((tr, idx) => {
                    const title =
                      tr.label ??
                      tr.windowLabel ??
                      `${tr.planet ?? ""} ${tr.aspectLabel ?? tr.aspect ?? ""} ${
                        tr.targetLabel ?? tr.natalPoint ?? ""
                      }`.trim();

                    const line2 = [
                      tr.planet,
                      (tr as any).aspectLabel ?? tr.aspect,
                      (tr as any).targetLabel ?? tr.natalPoint,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    const category =
                      (tr as any).categoryLabel ?? tr.category ?? "";

                    const description =
                      tr.description ?? tr.text ?? tr.summary ?? "";

                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-muted-foreground/20 bg-muted/40 p-3 text-xs leading-relaxed"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="font-semibold">{title}</div>
                            {line2 && (
                              <div className="text-[11px] text-muted-foreground">
                                {line2}
                              </div>
                            )}
                            {(tr.startISO || tr.endISO) && (
                              <div className="text-[11px] text-muted-foreground">
                                {tr.startISO} → {tr.endISO}
                              </div>
                            )}
                          </div>
                          {category && (
                            <span className="text-[10px] rounded-full border border-muted-foreground/40 px-2 py-0.5 uppercase tracking-wide">
                              {category}
                            </span>
                          )}
                        </div>

                        {description && (
                          <p className="mt-2 whitespace-pre-wrap">
                            {description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                        
                </div>
              </details>
            </CardContent>
          </Card>
        )}
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

    // Try to split overview into “overview text” vs “raw transit list”
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
        {/* Top: Next 12 months overview */}
        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Next 12 Months — Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {loading && (
              <div className="text-muted-foreground">
                Building your 12-month overview...
              </div>
            )}

            {!loading && error && (
              <div className="text-sm text-red-500">{error}</div>
            )}

            {!loading && !error && !hasData && (
              <div className="text-muted-foreground">
                Monthly guidance will appear here once transits are available.
              </div>
            )}

            {!loading && !error && overview && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {overview.label}
                </p>

                {mainNarrative && (
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">
                    {mainNarrative}
                  </p>
                )}

                {transitText && (
                  <div className="text-xs">
                    <details>
                      <summary className="cursor-pointer text-[11px] text-muted-foreground">
                        Show upcoming transit windows (next 12 months)
                      </summary>
                      <p className="mt-2 whitespace-pre-wrap leading-relaxed">
                        {transitText}
                      </p>
                    </details>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Below: month-by-month guidance, if any months exist beyond the overview */}
        {rest.length > 0 && (
          <Card className="rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Month-by-Month Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-3">
                {rest.map((m) => (
                  <Card
                    key={m.label}
                    className="border border-muted-foreground/30 bg-muted/40"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold">
                        {m.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-xs whitespace-pre-wrap leading-relaxed">
                      {m.text}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
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
        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Weekly guidance (next 8 weeks)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {loading && (
              <div className="text-muted-foreground">
                Building your weekly guidance...
              </div>
            )}

            {!loading && error && (
              <div className="text-sm text-red-500">{error}</div>
            )}

            {!loading && !error && weeklyInsights.length === 0 && (
              <div className="text-muted-foreground">
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
  summary: string;  // 1–2 sentence explanation
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

  // 3) Map category → text
  if (finalCat === "career") {
    return {
      area: "Career & long-term direction",
      headline: "Day favours focused, practical steps for your work path.",
      summary:
        "Good day to organise, plan or execute 1–2 meaningful actions that move your career or responsibilities forward.",
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
        "Digging too deep into old pain without breaks or taking irreversible decisions purely from today’s mood.",
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
      "Letting the day scatter into endless scrolling and reacting to others’ priorities only.",
  };
}
type MoneyTip = {
  tone?: "caution" | "neutral" | "opportunity" | string; // how the day feels for money
  headline?: string;
  summary?: string;
  tilt?: string;            // e.g. "caution", "opportunity", etc.
  drivers?: string[];       // e.g. ["Saturn transit", "Rahu AD"]
  windowLabel?: string;     // e.g. "Jan–Mar 2026" or "Next 30 days"
  do?: string[];            // action recommendations
  avoid?: string[];         // what to avoid
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
  todaysFocus: any; // can type properly later
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

  // ---------------- Basic safe objects ----------------
  const rAny: any = report || {};
  const gAny: any = guide || {};

  const emotional: any =
    gAny.emotionalWeather ||
    rAny.emotionalWeather ||
    null;

  const food: any =
    gAny.food ||
    rAny.foodToday ||
    null;

  const fasting: any =
    gAny.fasting ||
    rAny.fastingToday ||
    null;

  const money: any =
    gAny.moneyTip ||
    rAny.moneyToday ||
    null;

  // ---------------- Panchang merge (today) ----------------
  const panchangToday: any =
    rAny.panchangToday ||
    rAny.panchang?.today ||
    rAny.panchang ||
    gAny.panchangToday ||
    gAny.panchang?.today ||
    gAny.panchang ||
    null;

  const candidateFromReport: any =
    (rAny.panchangToday && rAny.panchangToday) ||
    (rAny.panchang && rAny.panchang) ||
    null;

  const candidateFromGuide: any =
    (gAny.panchangToday && gAny.panchangToday) ||
    (gAny.panchang && gAny.panchang) ||
    null;

  const pt: any = {
    ...(panchangToday || {}),
    ...(candidateFromGuide || {}),
    ...(candidateFromReport || {}),
  };

  const tithiName =
    pt?.tithi?.fullName ||
    pt?.tithi?.name ||
    pt?.tithiName ||
    null;

  const nakshatraName =
    pt?.nakshatra?.name ||
    pt?.nakshatraName ||
    pt?.moon?.nakshatraName ||
    pt?.moon?.nakshatra?.name ||
    rAny.moonNakshatraName ||
    rAny.panchang?.moonNakshatraName ||
    null;

  // Times – we only keep sunrise / sunset (you asked to drop moonrise/moonset globally anyway)
  const sunriseRaw =
    pt?.sunriseISO ||
    pt?.sunrise ||
    pt?.sun?.riseISO ||
    pt?.sun?.rise ||
    pt?.sun?.sunrise ||
    null;

  const sunsetRaw =
    pt?.sunsetISO ||
    pt?.sunset ||
    pt?.sun?.setISO ||
    pt?.sun?.set ||
    pt?.sun?.sunset ||
    null;

  const formatTime = (raw: any): string | null => {
    if (!raw) return null;
    if (typeof raw === "string") {
      // ISO: 2025-12-12T07:03:00+05:30 → 07:03
      if (raw.includes("T") && raw.length >= 16) {
        return raw.slice(11, 16);
      }
      return raw;
    }
    return null;
  };

  const sunrise = formatTime(sunriseRaw);
  const sunset = formatTime(sunsetRaw);

  // ---------------- Todays Focus (MD/AD focus) ----------------
  const tf: any = todaysFocus || {};
  const focusArea: string =
    tf.area ||
    tf.domain ||
    "Overall balance";

  const focusHeadline: string =
    tf.headline ||
    "Day favours balanced, steady progress.";

  const focusSummary: string =
    tf.summary ||
    "Nothing extreme is required. Use the day to keep momentum in one or two important areas.";

  const focusDo: string =
    tf.do ||
    "Pick one task that genuinely matters and complete it with full attention.";

  const focusAvoid: string =
    tf.avoid ||
    "Avoid scattering attention across too many half-started things.";

  // ---------------- Helpers for money tone ----------------
  const moneyTone: string =
    money?.tone ||
    money?.tilt ||
    "neutral";

  const moneyToneClass = (() => {
    if (moneyTone === "opportunity")
      return "bg-emerald-50 border-emerald-200 text-emerald-800";
    if (moneyTone === "caution")
      return "bg-red-50 border-red-200 text-red-800";
    if (moneyTone === "mixed")
      return "bg-amber-50 border-amber-200 text-amber-800";
    return "bg-slate-50 border-slate-200 text-slate-700";
  })();

  const todayLabel: string =
    rAny.todayLabel ||
    rAny.dateISO ||
    new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-5">
      {/* Error from /daily-guide API */}
      {guideError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {guideError}
        </div>
      )}

      {/* Top row: AI Snapshot + Today's Focus + Panchang mini card */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* AI Snapshot */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI Snapshot · {todayLabel}
              </div>
              <h3 className="mt-1 text-lg font-semibold">
                {emotional?.headline ||
                  "Today favours calm, conscious choices over impulsive moves."}
              </h3>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-700 leading-relaxed">
            {emotional?.summary ||
              "You don’t have to solve everything today. Focus on doing a few things slowly and well, instead of chasing ten things at once."}
          </p>

          {/* “Your next step” CTA */}
          <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your next step today
            </div>
            <p className="mt-1 text-slate-800">
              {emotional?.nextStep ||
                "Choose one small action you can complete in the next 30–60 minutes. Do it with full attention, then allow yourself a short conscious break."}
            </p>
          </div>
        </div>

        {/* Today’s Focus (MD/AD) */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-sm text-slate-900">
          <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Today’s Focus · Dasha
          </div>
          <div className="mt-1 text-sm font-semibold">{focusArea}</div>
          <p className="mt-1 text-xs text-slate-700">{focusHeadline}</p>
          <p className="mt-2 text-xs text-slate-700">{focusSummary}</p>

          <div className="mt-3 grid gap-2 text-xs">
            <div>
              <div className="font-semibold text-slate-900">Do</div>
              <p className="text-slate-700">{focusDo}</p>
            </div>
            <div>
              <div className="font-semibold text-slate-900">Avoid</div>
              <p className="text-slate-700">{focusAvoid}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panchang mini bar */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-700 md:grid-cols-4">
        <div>
          <div className="font-semibold text-slate-900">Tithi</div>
          <div>{tithiName || "—"}</div>
        </div>
        <div>
          <div className="font-semibold text-slate-900">Nakshatra</div>
          <div>{nakshatraName || "—"}</div>
        </div>
        <div>
          <div className="font-semibold text-slate-900">Sunrise</div>
          <div>{sunrise || "—"}</div>
        </div>
        <div>
          <div className="font-semibold text-slate-900">Sunset</div>
          <div>{sunset || "—"}</div>
        </div>
      </div>

      {/* Middle row: Food · Fasting · Money */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Food card */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-slate-900">
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Food · Body
          </div>
          <h3 className="mt-1 text-sm font-semibold">
            {food?.headline || "Keep food light and sattvic where possible."}
          </h3>
          <p className="mt-1 text-xs text-slate-800">
            {food?.summary ||
              "Favour simple, clean meals that don’t weigh you down. Avoid heavy or very late-night eating if you can."}
          </p>
          {Array.isArray(food?.suggestions) && food.suggestions.length > 0 && (
            <ul className="mt-2 list-disc pl-4 text-xs">
              {food.suggestions.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Fasting card */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-slate-900">
          <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Fasting · Reset
          </div>
          <h3 className="mt-1 text-sm font-semibold">
            {fasting?.headline || "Use simple discipline over extreme fasting."}
          </h3>
          <p className="mt-1 text-xs text-slate-800">
            {fasting?.summary ||
              "If you’re fasting, keep it gentle and hydrated. If not, you can still “fast” from noise, screens, or negativity."}
          </p>
          {fasting?.isGoodDay != null && (
            <div className="mt-2 inline-flex rounded-full bg-white/70 px-2 py-1 text-[11px] font-medium text-amber-800">
              {fasting.isGoodDay ? "Supportive day for fasting" : "Not a strong day for full fasting — choose lightness instead."}
            </div>
          )}
        </div>

        {/* Money card */}
        <div
          className={`rounded-2xl border p-4 text-sm ${moneyToneClass}`}
        >
          <div className="text-xs font-semibold uppercase tracking-wide">
            Money · Day Tilt
          </div>
          <h3 className="mt-1 text-sm font-semibold">
            {money?.headline ||
              (moneyTone === "opportunity"
                ? "Day leans mildly favourable for money decisions."
                : moneyTone === "caution"
                ? "Go slow with big money moves today."
                : "Neutral day — keep it steady.")}
          </h3>
          <p className="mt-1 text-xs">
            {money?.summary ||
              "Treat money decisions as part of the long game. Avoid panic moves just because of today’s mood."}
          </p>

          {Array.isArray(money?.do) && money.do.length > 0 && (
            <div className="mt-2">
              <div className="text-[11px] font-semibold">Do</div>
              <ul className="mt-1 list-disc pl-4 text-[11px]">
                {money.do.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(money?.avoid) && money.avoid.length > 0 && (
            <div className="mt-2">
              <div className="text-[11px] font-semibold">Avoid</div>
              <ul className="mt-1 list-disc pl-4 text-[11px]">
                {money.avoid.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Next few days section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Next few days
            </div>
            <p className="text-xs text-slate-700">
              Glance ahead so you don’t overreact to just today.
            </p>
          </div>
          {dailyLoading && (
            <div className="text-[11px] text-slate-500">
              Loading…
            </div>
          )}
        </div>

        {!dailyLoading && dailyHighlights?.length === 0 && (
          <p className="mt-3 text-xs text-slate-500">
            No upcoming highlights available right now.
          </p>
        )}

        {dailyHighlights?.length > 0 && (
          <div className="mt-3 space-y-2">
            {dailyHighlights.slice(0, 5).map((d, i) => {
              const label = d.dateISO
                ? new Date(d.dateISO).toLocaleDateString()
                : `Day ${i + 1}`;
              return (
                <div
                  key={d.dateISO ?? i}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800"
                >
                  <div className="mt-[2px] h-2 w-2 flex-shrink-0 rounded-full bg-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-900">
                      {label}
                    </div>
                    <div className="text-xs text-slate-700">
                      {d.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
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

  type MonthlyInsight = { label: string; text: string };
  const [monthlyInsights, setMonthlyInsights] = useState<MonthlyInsight[]>([]);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  // make sure client-only tabs (timeline, transits, monthly, weekly, myths) show
  useEffect(() => {
    setMounted(true);
  }, []);
  type WeeklyInsightLocal = { label: string; text: string };
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsightLocal[]>([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);

      type DailyHighlightLocal = { dateISO: string; text: string };
  const [dailyHighlights, setDailyHighlights] = useState<DailyHighlightLocal[]>([]);
  const [dailyLoading, setDailyLoading] = useState(false);
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

  const [myths, setMyths] = useState<MythCardLocal[]>([]);
  const [mythsLoading, setMythsLoading] = useState(false);
  const [mythsError, setMythsError] = useState<string | null>(null);
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
  if (!dateISO || !time || !place?.lat || !place?.lon || !tz) {
    alert("Fill birth date, time & place before saving a profile.");
    return;
  }

  const trimmedName = (name || "").trim() || "Default";
  const profileId = `${trimmedName} — ${dateISO}`;

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
        key={`${pl?.name ?? "pl"}-${i}`}
        className="rounded-lg border border-muted-foreground/20 bg-muted/40 p-3"
      >
        <div className="flex items-center justify-between">
          <div className="font-medium">
            {pl.name}
            {pl.sign ? (
              <span className="ml-2 text-xs text-muted-foreground">
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
                ? "bg-slate-100 text-slate-700"
                : "bg-red-100 text-red-800")
            }
          >
            {d.tag}
          </div>
        </div>

        <div className="mt-1 text-[11px] text-muted-foreground">
          {retro ? "Retrograde • " : ""}
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
  }, [dateISO, time, tz, place?.lat, place?.lon]);



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

// --- validate time ---
const rawTime = (time || "").trim();
if (!rawTime) {
  setError("Please enter your birth time.");
  setLoading(false);
  return;
}

const t =
  /^\d{2}:\d{2}$/.test(rawTime)
    ? rawTime
    : normalizeTimeForBackend(rawTime);

if (!t) {
  setError("Birth time must be in HH:MM format.");
  setLoading(false);
  return;
}


    if (!place?.lat || !place?.lon) {
      throw new Error("Pick a birth place from the dropdown.");
    }
    const dISO =
  d instanceof Date && Number.isFinite(d.getTime())
    ? d.toISOString().slice(0, 10)
    : String(d);

    const payload = {
      name: name || "User",
      birthDateISO: dateISO,
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
    const timeout = setTimeout(() => ac.abort(), 15000);

    let res: Response;
    try {
      const url = `/api/life-report?ts=${Date.now()}`;
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
          ? "Request timed out. Please try again."
          : "Network error while contacting /api/life-report."
      );
    }
    clearTimeout(timeout);

   if (!res.ok) {
  let json: any = null;

  // Try to parse JSON error from the API
  try {
    json = await res.json();
  } catch {
    // fall back to text below
  }
  
  // 🔴 Special case: our life-report API says swisseph / engine is unavailable
  if (json?.error === "astro_engine_unavailable") {
    const msg =
      json?.message ||
      "High-precision Life Report engine is not available on this server environment yet.";
    setEngineUnavailable(msg);
    setError(null);      // clear any generic error
    setLoading(false);   // stop the spinner
    return;              // IMPORTANT: don't throw, just exit handler
  }

  // Generic error path
  const fallbackText =
    (typeof json === "string" ? json : "") ||
    (await res.text().catch(() => "")) ||
    `Server returned ${res.status}`;

  throw new Error(fallbackText);
}

const data = (await res.json()) as LifeReportAPI;


// ✅ STEP 2: call /api/ai-personality using the REAL life-report payload
try {
  const pRes = await fetch("/api/ai-personality", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ report: data }), // or { report: next } if inside that section
  });

  const pJson = await pRes.json().catch(() => ({}));

  if (!pRes.ok) {
    console.error("ai-personality failed", pRes.status, pJson);
    // If you have setAiError, use it. Otherwise just don't crash.
    // setAiError?.(`ai-personality failed (${pRes.status})`);
    return;
  }

  const text = (pJson as any)?.text ?? (pJson as any)?.personality ?? "";
  if (text) setAiSummary(text);
} catch (e: any) {
  console.error("ai-personality crashed", e?.message ?? e);
  // setAiError?.(e?.message ?? "ai-personality crashed");
}

    // 🔹 Notifications from API → state (all 3 buckets)
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

    const birthInstant = makeUtcInstant(d, t, tz);
    const rawPlanets: any[] =
      (data as any)?.raw?.planets ?? (data as any)?.planets ?? [];

    function siderealFromRaw(label: "sun" | "moon"): number | undefined {
      const r = rawPlanets.find(
        (p) =>
          String(p?.name ?? p?.planet ?? "").toLowerCase() === label
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
      birthTime: t,
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
    
       // --- non-blocking AI personality summary with client-side cache ---
    try {
      aiCtrlRef.current?.abort();
    } catch {}
    const ctrl = new AbortController();
    aiCtrlRef.current = ctrl;
setTimeout(async () => {
  try {
    if (!next || !Array.isArray(next.planets) || next.planets.length === 0) return;

    // Cache key: stable per profile inputs
    const cacheKey = `sarathi:ai-personality:${next.birthDateISO}:${next.birthTime}:${next.birthTz}:${next.ascSign}:${next.moonSign}:${next.sunSign}`;

    // 1) Try cache first (skip API call if fresh)
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(cacheKey);
        if (raw) {
          const cached = JSON.parse(raw) as { payload?: any; ts?: number };
          const ts = typeof cached?.ts === "number" ? cached.ts : 0;
          const ageMs = Date.now() - ts;

          // freshness window: 14 days (change if you want)
          if (cached?.payload && ageMs < 14 * 24 * 60 * 60 * 1000) {
            setAiSummary(
              typeof cached.payload === "string" ? cached.payload : JSON.stringify(cached.payload)
            );
            return; // ✅ IMPORTANT: do not call API
          }
        }
      }
    } catch {
      // ignore cache read errors
    }

    // 2) Call API (only if no fresh cache)
    const ctrl = new AbortController();
    const aiRes = await fetch("/api/ai-personality", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        profile: {
          name: next.name,
          ascSign: next.ascSign,
          moonSign: next.moonSign,
          sunSign: next.sunSign,
        },
        planets: next.planets,
        aspects: next.aspects,
        nakshatraMap: (data as any)?.nakshatraMap || {},
      }),
      signal: ctrl.signal,
    });

    const aiJson = await aiRes.json().catch(() => ({}));

    // NOTE: your API sometimes returns {text: {...}} or {text: "..." }
    const payload = aiJson?.text ?? aiJson;

    if (aiRes.ok && payload) {
      const asString = typeof payload === "string" ? payload : JSON.stringify(payload);
      setAiSummary(asString);

      // 3) Save cache
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            cacheKey,
            JSON.stringify({ payload, ts: Date.now() })
          );
        }
      } catch {
        // ignore cache write errors
      }
    }
  } catch (e: any) {
    console.error("ai-personality crashed", e?.message ?? e);
    // optional: show a tiny inline error state if you have one
  }
}, 0);

        // --- non-blocking AI personality with cache ---
setTimeout(async () => {
  try {
    // ✅ Guard FIRST (before any fetch)
    if (!next || !Array.isArray(next.planets) || next.planets.length === 0) return;

    const cacheKey = `sarathi:ai-personality:${next.birthDateISO}:${next.birthTime}:${next.birthTz}`;

    // 1) Cache read
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(cacheKey);
        if (raw) {
          const cached = JSON.parse(raw) as { text?: string; ts?: number };
          if (cached?.text) setAiSummary(cached.text);
        }
      }
    } catch {
      // ignore
    }

    // 2) Call API using the REAL full report object (✅ most reliable)
    const aiRes = await fetch("/api/ai-personality", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ report: next }),
      signal: ctrl.signal,
    });

    const aiJson = await aiRes.json().catch(() => ({}));
    if (aiRes.ok && aiJson?.text) {
      const text = aiJson.text as string;
      setAiSummary(text);

      // 3) Cache write
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(cacheKey, JSON.stringify({ text, ts: Date.now() }));
        }
      } catch {
        // ignore
      }
    } else if (!aiRes.ok) {
      const msg = (aiJson as any)?.error || (aiJson as any)?.message || "";
      console.error("ai-personality failed", aiRes.status, msg);
    }
  } catch {
    // ignore personality AI errors
  }
}, 0);

    

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
     const todayISO = new Date().toISOString().slice(0, 10);
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

        // birth object for transits API
        const birth = {
          dateISO: next.birthDateISO,
          time: next.birthTime,
          tz: next.birthTz,
          lat: next.birthLat ?? payload.lat,
          lon: next.birthLon ?? payload.lon,
        };

        const tRes = await fetch("/api/transits", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            birth,
            horizonDays: 365,
          }),
        });

        const tJson = await tRes.json().catch(() => ({} as any));

        if (!tRes.ok || !Array.isArray(tJson?.transits)) {
          console.error("transits API failed", tRes.status, tJson);
          setTransits([]);
          setTransitsError("Could not load upcoming transits.");
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

        if (hitList.length === 0 && dailyMoon.length === 0) {
          // nothing meaningful to show
          return;
        }

        const todayISO = new Date().toISOString().slice(0, 10);

        // 5) Daily highlights – Moon + strongest transit, with Mars–Ketu special handling
        try {
          setDailyLoading(true);
          setDailyError(null);
          setDailyHighlights([]);

          // Moon + transits → structured facts
          const dailyFacts = buildDailyFacts(
            dailyMoon as any,
            hitList,
            todayISO,
            7
          );

          function isMarsKetuFact(f: DailyFact): boolean {
            const tr = f.strongestTransit;
            if (!tr) return false;

            const planet = (tr.planet || "").toString().toLowerCase();
            const target = (tr.target || "").toString().toLowerCase();

            return (
              planet === "mars" &&
              /conjunction\s+natal\s+ketu/i.test(target)
            );
          }
const describeNakshatraFocus = (nak: string): string => {
  const n = nak.toLowerCase();

  if (n.includes("ardra")) {
    return "This Ardra Moon highlights emotional intensity, catharsis and the need to process what’s been building beneath the surface.";
  }

  if (n.includes("punarvasu")) {
    return "This Punarvasu Moon supports renewal and reset energy — returning to what matters and starting again with a lighter touch.";
  }

  if (n.includes("pushya")) {
    return "This Pushya Moon is nurturing and stabilising, good for caring for yourself, family and the foundations of your life.";
  }

  if (n.includes("ashlesha")) {
    return "This Ashlesha Moon can bring up tangled feelings or attachments; honesty with yourself goes further than quick fixes.";
  }

  if (n.includes("jyeshtha")) {
    return "This Jyeshtha Moon can spotlight power dynamics, responsibility and how you handle pressure or leadership energy.";
  }

  // Default fallback
  return "This Moon position invites a bit more awareness than usual in how you respond, not just how you react.";
};

          // Slightly varied sentence templates so the week doesn't feel copy-pasted
const templates: Array<(nak: string, area: string) => string> = [
  (nak, area) =>
    `With the Moon in ${nak}, your attention may naturally settle on ${area}. Notice one situation where a small adjustment would genuinely help.`,
  (nak, area) =>
    `${nak} Moon day: your energy leans toward ${area}. Keep choices simple and intentional here rather than trying to do everything at once.`,
  (nak, area) =>
    `As the Moon moves through ${nak}, themes around ${area} come into focus. Use this as a chance to tidy something small that has been pending.`,
  (nak, area) =>
    `Under this ${nak} Moon, ${area} may feel more visible than usual. Go slowly, respond, and avoid reacting from urgency.`,
];

const safeDailyFacts = Array.isArray(dailyFacts) ? dailyFacts : [];

const highlights: DailyHighlightLocal[] = safeDailyFacts.map((f, idx) => {
  // Only override nakshatra from Panchang for *today*;
  // for future days, keep whatever came in f.moonNakshatra.
  const isToday =
    typeof f.dateISO === "string" &&
    f.dateISO.slice(0, 10) === todayISO;

  const nakFromPanchang = isToday
    ? ( (next as any)?.panchang?.moonNakshatraName ??
        (next as any)?.panchang?.nakshatraName ??
        (next as any)?.panchang?.nakshatra?.name ??
        (next as any)?.moonToday?.nakshatra ??
        undefined )
    : undefined;

  const rawNak =
    nakFromPanchang ||
    (f.moonNakshatra &&
      f.moonNakshatra.toString().toLowerCase() !== "a key nakshatra"
      ? f.moonNakshatra
      : undefined);

  const nak = rawNak ?? "this nakshatra";
  const nakStr = String(nak);

  // Optional: if you already have describeNakshatraFocus(nakStr) defined above, keep using it.
  const nakFlavor = describeNakshatraFocus
    ? describeNakshatraFocus(nakStr)
    : "";

  const cat = f.strongestTransit?.category;

  // Base area from category
  let area =
    cat === "career"
      ? "career, responsibilities and long-term direction"
      : cat === "relationships"
      ? "relationships, conversations and close people"
      : cat === "health"
      ? "health, energy and daily routines"
      : cat === "inner"
      ? "inner emotional climate and mindset"
      : "your regular routines and overall balance";

  // Tiny variation so a long career stretch doesn't read *exactly* the same
  if (cat === "career" && idx % 3 === 1) {
    area = "the balance between outer responsibilities and your inner life";
  } else if (cat === "career" && idx % 3 === 2) {
    area =
      "your long-term direction and how daily choices support it";
  }

  const coreLine = templates[idx % templates.length](nakStr, area);
  const base = nakFlavor ? `${coreLine} ${nakFlavor}` : coreLine;

  const tr = f.strongestTransit;
  let transitHook = "";

  if (tr && (tr.strength ?? 0) >= 0.65) {
    const planet = tr.planet;
    const target = tr.target || "a key natal point";

    if (isMarsKetuFact(f)) {
      if (idx === 0) {
        // Only the FIRST day gets the full Mars–Ketu emphasis
        transitHook =
          " This Mars–Ketu phase is loud today; use any spikes in emotion or urgency as a reminder to slow down and choose one grounded action.";
      } else {
        // Other days: rotate a few softer background wordings
        const mkVariants = [
          " In the background, the Mars–Ketu thread keeps humming; if you feel rushed or irritable, pause and come back to small, deliberate steps.",
          " Mars–Ketu is still active in the background today; notice any urge to overreact and turn it into one small, conscious adjustment instead.",
          " This Mars–Ketu backdrop continues quietly; protect your energy by choosing one or two clear priorities rather than scattering yourself.",
        ];
        transitHook = mkVariants[idx % mkVariants.length];
      }
    } else {
      // Generic strong-transit wording for non Mars–Ketu days
      transitHook =
        ` A noticeable transit from ${planet} to ${target} is active — ` +
        `treat it as a nudge for small, conscious adjustments rather than big, impulsive moves.`;
    }
  }

  return {
    dateISO: f.dateISO,
    text: base + transitHook,
  };
});

setDailyHighlights(highlights);
setDailyError(null);

        } catch (err) {
          console.error("daily highlights fallback failed", err);
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

          const aiTransitsJson = await aiTransitsRes
            .json()
            .catch(() => ({} as any));

          if (aiTransitsRes.ok && aiTransitsJson?.text) {
            setTransitSummary(aiTransitsJson.text as string);
          } else {
            console.error(
              "ai-transits failed",
              aiTransitsRes.status,
              aiTransitsJson
            );
          }
        } catch (err) {
          console.error("ai-transits error", err);
        }

        // 2) Dasha × Transits fusion
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
              dashaLayers: {
                md,
                ad,
                pd,
                timeline: next.dashaTimeline ?? null,
              },
              transits: hitList,
              lifeMilestones: next.lifeMilestones,
            }),
          });

          const fusionJson = await fusionRes
            .json()
            .catch(() => ({} as any));

          if (fusionRes.ok && fusionJson?.text) {
            setDashaTransitSummary(fusionJson.text as string);
          } else {
            console.error(
              "ai-dasha-transits failed",
              fusionRes.status,
              fusionJson
            );
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
              dashaLayers: {
                md,
                ad,
                pd,
                timeline: next.dashaTimeline ?? null,
              },
              transits: hitList,
              startDateISO: todayISO,
              months: 12,
            }),
          });

          const monthsJson = await monthsRes
            .json()
            .catch(() => ({} as any));

          if (monthsRes.ok && Array.isArray(monthsJson?.months)) {
            setMonthlyInsights(
              monthsJson.months as { label: string; text: string }[]
            );
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
                // We still let it refresh below for now
              }
            }
          }
        } catch {
          // ignore cache read errors
        }

        // 4.2 Always hit API for now (to keep content fresh),
        // UI already has something if servedFromCache=true.
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
          const weeksArr = weeksJson.weeks as {
            label: string;
            text: string;
          }[];
          setWeeklyInsights(weeksArr);
          setWeeklyError(null);

          // 4.3 Save to cache
          try {
            if (typeof window !== "undefined") {
              window.localStorage.setItem(
                cacheKey,
                JSON.stringify({
                  weeks: weeksArr,
                  ts: Date.now(),
                })
              );
            }
          } catch {
            // ignore cache write errors
          }
        } else if (weeksRes.ok) {
          const fallbackWeekly = buildWeeklyFromTransits(
            hitList,
            todayISO,
            8
          );
          setWeeklyInsights(fallbackWeekly);
          setWeeklyError(null);
          console.warn(
            "ai-weekly returned no weeks; used client-side fallback instead"
          );
        } else {
          console.error("ai-weekly failed", weeksRes.status, weeksJson);
          if (!servedFromCache) {
            setWeeklyError("Could not load weekly guidance.");
          }
        }
      } catch (err) {
        console.error("ai-weekly error", err);
        setWeeklyError("Could not load weekly guidance.");
      } finally {
        setWeeklyLoading(false);
      }
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
  setReport(next);
  setActiveTab("placements");
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

  const TabPlacements = (() => {
  if (!report) {
    return (
      <>
        {engineUnavailable && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            <div className="font-semibold">
              Life Report engine not enabled yet
            </div>
            <p className="mt-1">
              {engineUnavailable}
            </p>
            <p className="mt-1">
              Panchang, Daily Guide and notifications will still work. 
              Detailed MD / AD timelines will be enabled once the full engine 
              is switched on for this server.
            </p>
          </div>
        )}

        <Card className="rounded-2xl shadow-inner border-dashed border-2 border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Fill details and generate.
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Tab will populate after generation.
          </CardContent>
        </Card>
      </>
    );
  }


    const yogaCalc = (() => {
      try {
        const sun = (report.planets || []).find(
          (p) => (p.name || "").toLowerCase() === "sun"
        );
        const moon = (report.planets || []).find(
          (p) => (p.name || "").toLowerCase() === "moon"
        );

        const sunDegRaw = sun ? (guessSiderealDegFrom as any)(sun as any) : undefined;
        const moonDegRaw = moon ? (guessSiderealDegFrom as any)(moon as any) : undefined;

        const sunDeg =
          typeof sunDegRaw === "number" && Number.isFinite(sunDegRaw)
            ? norm360(sunDegRaw)
            : undefined;
        const moonDeg =
          typeof moonDegRaw === "number" && Number.isFinite(moonDegRaw)
            ? norm360(moonDegRaw)
            : undefined;

        if (sunDeg === undefined || moonDeg === undefined) {
          return { yoga: report.panchang?.yogaName };
        }

        const part = 360 / 27;
        const total = norm360(sunDeg + moonDeg);
        const idx = Math.floor((total + 1e-8) / part) % 27;

        const yoga = YOGAS_27[idx] ?? report.panchang?.yogaName;

        return { yoga, sunDeg, moonDeg, idx, total };
      } catch {
        return { yoga: report.panchang?.yogaName };
      }
    })();

    return (
      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
                {/* Core signature */}
        <motion.div variants={fadeUp}>
          <Card className="rounded-2xl shadow-xl">
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
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
              {/* Birth data */}
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                  Birth Data
                </div>
                <div>
                  {report.birthDateISO} @ {report.birthTime} ({report.birthTz})
                </div>
                {typeof report.birthLat === "number" &&
                  typeof report.birthLon === "number" && (
                    <div className="text-xs text-muted-foreground">
                      {report.birthLat.toFixed(3)}, {report.birthLon.toFixed(3)}
                    </div>
                  )}
              </div>

              {/* Panchang snapshot */}
              {(() => {
                const sunRow = (report.planets || []).find(
                  (p) => (p.name || "").toLowerCase() === "sun"
                );
                const moonRow = (report.planets || []).find(
                  (p) => (p.name || "").toLowerCase() === "moon"
                );
                const sunSid = sunRow
                  ? guessSiderealDegFrom(sunRow as any)
                  : undefined;
                const moonSid = moonRow
                  ? guessSiderealDegFrom(moonRow as any)
                  : undefined;

                const weekday =
                  weekdayFromISODate(report.birthDateISO) ??
                  report.panchang?.weekday ??
                  "—";

                const part = 360 / 27;
                const yogaName =
                  sunSid !== undefined && moonSid !== undefined
                    ? YOGAS_27[
                        Math.floor(
                          (norm360(sunSid + moonSid) + 1e-8) / part
                        ) % 27
                      ]
                    : report.panchang?.yogaName ?? "—";

                const karanaName =
                  sunSid !== undefined && moonSid !== undefined
                    ? computeKaranaName(sunSid, moonSid) ?? "—"
                    : report.panchang?.karanaName ?? "—";

                const moonNak =
  (report as any).panchangToday?.moonNakshatraName ??
  (report as any).panchangToday?.nakshatraName ??
  (report as any).panchangToday?.nakshatra?.name ??
  report.panchang?.moonNakshatraName ??
  report.panchang?.moonNakshatraName ??
  "";



                return (
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                      Panchang Snapshot
                    </div>

                    <div>
                      <span className="font-medium">Weekday:</span> {weekday}
                    </div>

                    <div>
                      <span className="font-medium">Tithi:</span>{" "}
                      {report.panchang?.tithiName ?? "—"}{" "}
                      {report.panchang?.meanings?.tithi && (
                        <span className="text-xs text-muted-foreground">
                          — {report.panchang.meanings.tithi}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-medium">Yoga:</span> {yogaName}{" "}
                      {report.panchang?.meanings?.yoga && (
                        <span className="text-xs text-muted-foreground">
                          — {report.panchang.meanings.yoga}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-medium">Karana:</span>{" "}
                      {karanaName}{" "}
                      {report.panchang?.meanings?.karana && (
                        <span className="text-xs text-muted-foreground">
                          — {report.panchang.meanings.karana}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-medium">Moon Nakshatra:</span>{" "}
                      {moonNak}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </motion.div>
        {/* Wheel + placements */}
        <motion.div variants={fadeUpSmall} className="space-y-4">
          {report.planets?.length ? (
            <Card className="rounded-2xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center justify-between">
                  Planet placements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm">
                <div className="text-xs grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(report.planets ?? [])
                    .filter(
                      (p) =>
                        p?.name && p.name.toLowerCase() !== "ascendant"
                    )
                    .slice()
                    .sort(
                      (a, b) =>
                        PLANET_ORDER.indexOf(a.name) -
                        PLANET_ORDER.indexOf(b.name)
                    )
                    .map((pl, idx) => renderPlacement(pl as any, idx))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl shadow-inner border-dashed border-2 border-muted-foreground/20">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  No planet table available.
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Generate again to see planet placements.
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    );
  })();

  /* ---------------- Tab 2: Personality ---------------- */

  type TabPersonalityProps = {
    report: LifeReportView | null;
    aiSummary: string;
  };

  const TabPersonality: React.FC<TabPersonalityProps> = memo(
    ({ report, aiSummary }) => {
      if (!report) return null;

      const cards = buildPersonality(
        report.planets,
        report.aspects,
        report.ascNakshatraName,
        report.moonNakshatraName
      );

      return (
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {aiSummary && (
            <motion.div variants={fadeUpSmall}>
              <Card className="rounded-2xl border border-muted-foreground/20 bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    AI Personality Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed space-y-3">
  {(() => {
    const raw = (aiSummary ?? "").trim();

    // If AI returned ```json ... ``` strip the fences first
    const unfenced = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let obj: any = null;

    try {
      obj = JSON.parse(unfenced);
    } catch {
      obj = null;
    }

    if (obj && (Array.isArray(obj.text) || typeof obj.closing === "string")) {
      const bullets = Array.isArray(obj.text) ? obj.text : [];
      const closing = typeof obj.closing === "string" ? obj.closing : "";

      return (
        <>
          {bullets.length > 0 && (
            <ul className="list-disc pl-5 space-y-2">
              {bullets.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          {closing && <p className="text-muted-foreground">{closing}</p>}
        </>
      );
    }

    return <p className="whitespace-pre-wrap">{raw}</p>;
  })()}
</CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            variants={fadeUpSmall}
            className="grid gap-4 md:grid-cols-2"
          >
            {cards.map((card, idx) => (
              <Card
                key={idx}
                className="rounded-2xl border border-muted-foreground/15 bg-card/80 shadow-sm"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {card.headline}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm leading-relaxed">
                  {card.bullets.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      );
    }
  );

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
    const ap = report.activePeriods;

    return (
      <div
        className={
          "space-y-6 transform transition-all duration-300 " +
          (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
        }
      >
        {/* 1. Current Dasha Progress – always visible, moved to top */}
        {ap && (
          <Card className="rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Current Dasha Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(ap as any).mahadasha && (
                <DashaBar
                  label={`Mahadasha — ${(ap as any).mahadasha.lord}`}
                  start={(ap as any).mahadasha.start}
                  end={(ap as any).mahadasha.end}
                  subtitle={(ap as any).mahadasha.summary}
                />
              )}
              {(ap as any).antardasha && (
                <DashaBar
                  label={`Antardasha — ${
                    (ap as any).antardasha.subLord
                  } (in ${(ap as any).antardasha.mahaLord})`}
                  start={(ap as any).antardasha.start}
                  end={(ap as any).antardasha.end}
                  subtitle={(ap as any).antardasha.summary}
                />
              )}
              {(ap as any).pratyantardasha && (
                <DashaBar
                  label={`Pratyantardasha — ${
                    (ap as any).pratyantardasha.lord
                  }`}
                  start={(ap as any).pratyantardasha.start}
                  end={(ap as any).pratyantardasha.end}
                  subtitle={(ap as any).pratyantardasha.summary}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* 2. Collapsible sections for the heavy text + timelines */}
        <Accordion
  type="multiple"
  className="w-full space-y-2"
>

          {/* Year-ahead insight */}
          <AccordionItem value="year-ahead">
            <AccordionTrigger className="text-sm font-semibold">
              Dasha × Transits — Year Ahead Insight
            </AccordionTrigger>
            <AccordionContent>
              {dashaTransitSummary ? (
                <Card className="rounded-2xl shadow-sm">
                  <CardContent className="pt-4 text-sm whitespace-pre-wrap leading-relaxed">
                    {dashaTransitSummary}
                  </CardContent>
                </Card>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No year-ahead summary available.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Life story overview */}
          <AccordionItem value="life-overview">
            <AccordionTrigger className="text-sm font-semibold">
              Life Story Overview
            </AccordionTrigger>
            <AccordionContent>
              {timelineSummary ? (
                <Card className="rounded-2xl shadow-sm">
                  <CardContent className="pt-4 text-sm whitespace-pre-wrap leading-relaxed">
                    {timelineSummary}
                  </CardContent>
                </Card>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No life-story summary available.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Full Vimshottari Mahadasha timeline */}
          {Array.isArray(report.dashaTimeline) &&
            report.dashaTimeline.length > 0 && (
              <AccordionItem value="timeline">
                <AccordionTrigger className="text-sm font-semibold">
                  Vimshottari Mahadasha Timeline
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="pt-4 space-y-3 text-sm">
                      {report.dashaTimeline.map((row: any, idx: number) => {
                        const now = Date.now();
                        const s = new Date(row.startISO).getTime();
                        const e = new Date(row.endISO).getTime();
                        const isActive = now >= s && now <= e;

                        return (
                          <div
                            key={idx}
                            className={
                              "flex items-center justify-between rounded-lg border px-3 py-2 " +
                              (isActive
                                ? "border-emerald-300 bg-emerald-50"
                                : "border-muted-foreground/20 bg-muted/40")
                            }
                          >
                            <div className="space-y-0.5">
                              <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                                {row.planet} Mahadasha
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {row.startISO} → {row.endISO}
                              </div>
                            </div>
                            {isActive && (
                              <span className="text-[10px] font-semibold text-emerald-700">
                                Current
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            )}

          {/* Life story by Dasha (milestones) */}
{Array.isArray(report.lifeMilestones) &&
  report.lifeMilestones.length > 0 && (
    <AccordionItem value="life-story">
      <AccordionTrigger className="text-sm font-semibold">
        Life Story by Dasha
      </AccordionTrigger>
      <AccordionContent>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="pt-4">
            <div className="space-y-4">
              {report.lifeMilestones.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="relative pl-4 border-l border-muted-foreground/20 last:border-l-0"
                >
                  {/* timeline dot */}
                  <div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-sky-500 shadow-sm" />

                  <div className="rounded-xl border border-muted-foreground/15 bg-muted/40 p-3 text-sm leading-relaxed">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                          {m.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {m.approxAgeRange} (
                          {new Date(m.periodStart).getFullYear()}–
                          {new Date(m.periodEnd).getFullYear()})
                        </div>
                        {m.drivers && (
                          <div className="text-[11px] text-muted-foreground">
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

                    <div className="mt-2 space-y-1 text-xs leading-relaxed">
                      {Array.isArray(m.themes) && m.themes.length ? (
                        m.themes.map((t: string, i2: number) => (
                          <p key={i2}>{t}</p>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          (No notes.)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  )}
</Accordion>
      </div>
    );
  }
);
/* ---------------- Tab: Myths (Myth of the Day) ---------------- */

type TabMythsProps = {
  myths: any[] | null;
  loading: boolean;
  error: string | null;
};

const TabMyths: React.FC<TabMythsProps> = ({ myths, loading, error }) => {
  // Default myths with proper clarifications
  const defaultMyths = [
    {
      title: "Myth 1",
      text: "Astrology decides your fate. Reality: it shows tendencies and timings, but your choices and effort still shape outcomes.",
    },
    {
      title: "Myth 2",
      text: "Rahu & Ketu only bring problems. Reality: they often trigger big learning curves, breakthroughs and non-linear growth.",
    },
    {
      title: "Myth 3",
      text: "A ‘bad’ planet ruins life. Reality: every planet has constructive and challenging expressions depending on how you work with it.",
    },
    {
      title: "Myth 4",
      text: "You must follow harsh, complicated remedies. Reality: awareness, aligned action and simple consistent practices often matter more.",
    },
    {
      title: "Myth 5",
      text: "Charts of partners must be ‘perfect matches’. Reality: maturity, communication and shared values matter more than exact alignment.",
    },
  ];

  // Normalise whatever comes in:
  // - if it's a string → use as title, attach default text by index
  // - if it's an object with only title → fill in missing text from defaults
  const rawList: any[] =
    Array.isArray(myths) && myths.length ? myths : defaultMyths;

  const listToShow = rawList.map((item, index) => {
    const def = defaultMyths[index % defaultMyths.length] || defaultMyths[0];

    if (typeof item === "string") {
      return {
        title: item,
        text: def.text,
      };
    }

    return {
      title: item.title || def.title,
      text: item.text || def.text,
    };
  });

  // 🔹 Pick Myth of the Day based on date (stable but simple)
  const today = new Date();
  const idx =
    listToShow.length > 0 ? today.getDate() % listToShow.length : 0;

  const mythOfTheDay =
    listToShow.length > 0 ? listToShow[idx] : null;

  const otherMyths =
    mythOfTheDay && listToShow.length > 1
      ? listToShow.filter((m) => m !== mythOfTheDay)
      : listToShow;

  return (
    <Card className="rounded-2xl shadow-inner border-2 border-dashed border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Astrology myths &amp; clarifications
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm text-muted-foreground">
        {loading && <p>Loading myths...</p>}

        {!loading && error && (
          <p className="text-red-600 text-xs">
            {error || "Could not load myths right now."}
          </p>
        )}

        {/* Myth of the day */}
        {!loading && !error && mythOfTheDay && (
          <div className="rounded-xl border bg-white/60 p-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-600 mb-1">
              Myth of the day
            </p>
            <div className="font-medium text-slate-900">
              {mythOfTheDay.title}
            </div>
            {mythOfTheDay.text && (
              <p className="text-xs text-slate-700 mt-1">
                {mythOfTheDay.text}
              </p>
            )}
          </div>
        )}

        {/* All myths list */}
        {!loading && !error && otherMyths && otherMyths.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              All myths
            </p>
            <ul className="space-y-2">
              {otherMyths.map((item: any, idx2: number) => (
                <li
                  key={idx2}
                  className="border-b pb-2 last:border-b-0 last:pb-0"
                >
                  <div className="font-medium text-slate-800">
                    {item.title || `Myth ${idx2 + 1}`}
                  </div>
                  {item.text && (
                    <p className="text-xs text-slate-600 mt-1">
                      {item.text}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && !error && listToShow.length === 0 && (
          <p className="text-xs text-muted-foreground">
            This section will soon bust common astrology myths and explain what
            actually matters in your chart.
          </p>
        )}
      </CardContent>
    </Card>
  );
};


    /* ---------------- TZ mismatch banner ---------------- */

  const tzMismatchBanner = useMemo(() => {
    if (!place?.name) return null;
    const exp = expectedTzForPlaceName(place.name);
    if (exp && tz !== exp) {
      return (
        <div className="mt-2 text-xs rounded-md bg-amber-50 text-amber-900 border border-amber-200 p-2">
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
  // Load myths & reality cards once when we have a report + transits
  useEffect(() => {
    if (!report) return;

    let cancelled = false;

    async function loadMyths() {
      try {
        setMythsError(null);
        setMythsLoading(true);

        // build dashaStack from activePeriods (same idea as daily-guide)
        const periods: any = (report as any)?.activePeriods;
        const dashaStack: CoreSignals["dashaStack"] = [];

        if (periods?.mahadasha?.lord) {
          dashaStack.push({
            planet: periods.mahadasha.lord,
            startISO: periods.mahadasha.start,
            endISO: periods.mahadasha.end,
            level: "md",
          });
        }

        if (periods?.antardasha?.subLord) {
          dashaStack.push({
            planet: periods.antardasha.subLord,
            startISO: periods.antardasha.start,
            endISO: periods.antardasha.end,
            level: "ad",
          });
        }

        if (periods?.pratyantardasha?.lord) {
          dashaStack.push({
            planet: periods.pratyantardasha.lord,
            startISO: periods.pratyantardasha.start,
            endISO: periods.pratyantardasha.end,
            level: "pd",
          });
        }

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

        const res = await fetch("/api/sarathi/myths", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ core }),
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          console.error("myths API failed", res.status, txt);
          if (!cancelled) {
            setMythsError("Could not load myths.");
          }
          return;
        }

        const json = await res.json();
        if (!cancelled) {
          setMyths(Array.isArray(json.myths) ? json.myths : []);
          setMythsError(null);
        }
      } catch (err) {
        console.error("myths fetch error", err);
        if (!cancelled) {
          setMythsError("Could not load myths.");
        }
      } finally {
        if (!cancelled) {
          setMythsLoading(false);
        }
      }
    }

    loadMyths();

    return () => {
      cancelled = true;
    };
  }, [report, transits, dateISO, time, tz, place]);

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

    
    // ✅ NO HIDING: disable chat cache while we debug houses/asc
window.localStorage.removeItem("sarathi.lifeReportCache.v2");
// console.log("[life-report] chat cache disabled");

  } catch (e) {
    console.warn("[life-report] failed to cache for chat", e);
  }
}, [report, transits]);

  /* ---------------- Render ---------------- */

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Card className="mb-6 shadow-xl rounded-2xl">
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
              placeholder="City, Country (e.g., Saharanpur)"
            />
            {place && (
              <p className="text-xs text-muted-foreground">
                lat {place.lat?.toFixed(3)}, lon {place.lon?.toFixed(3)} ({tz})
              </p>
            )}

                        {tzMismatchBanner}
          </div>

          {/* Profiles row + Generate button */}
<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  {/* Left: profile selector + save */}
  <div className="flex flex-wrap items-center gap-2 text-xs">
    <span className="font-semibold uppercase tracking-wide text-muted-foreground">
      Profiles:
    </span>

    <select
      className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground"
      value={selectedProfileId}
      onChange={(e) => handleSelectProfile(e.target.value)}
    >
      <option value="">(None selected)</option>
      {profiles.map((p) => (
        <option key={p.id} value={p.id}>
          {p.label} — {p.birthDateISO}
        </option>
      ))}
    </select>

    <button
      type="button"
      className="rounded-md border px-2 py-1 text-[11px] text-foreground border-foreground/30"
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

      {/* Tabs + Ask Sārathi chat entry */}
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="flex-1"
        >
          <TabsList className="flex flex-wrap gap-2">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="phases">Life Phases</TabsTrigger>
  <TabsTrigger value="now">Now & Near Future</TabsTrigger>
  <TabsTrigger value="advanced">Advanced</TabsTrigger>
</TabsList>
        </Tabs>

        <Link href="/sarathi/chat" className="md:ml-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full md:w-auto"
          >
           Ask Sārathi
          </Button>
        </Link>
      </div>

    {/* Tab content */}
<div className="mt-4 space-y-6">
  {/* OVERVIEW = show ONLY placements (core signature) + personality summary */}
  {activeTab === "overview" && (
    <div className="space-y-6">
      {TabPlacements}

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
      transits={transits}
      loading={transitsLoading}
      error={transitsError}
      transitSummary={transitSummary}
      dailyHighlights={dailyHighlights}
      dailyLoading={dailyLoading}
      dailyError={dailyError}
      mounted={mounted}
    />
  )}

  {/* ADVANCED = everything that overwhelms */}
  {activeTab === "advanced" && (
    <div className="space-y-6">
      {/* Daily guide stays accessible but not “primary” */}
      <div className="space-y-4">
        <TabDailyGuide
          report={report}
          guide={guide}
          guideError={guideError}
          dailyHighlights={dailyHighlights}
          dailyLoading={dailyLoading}
          mounted={mounted}
          todaysFocus={todaysFocus}
        />
        <DailyRhythmCard report={report} />
      </div>

      <TabWeekly
        weeklyInsights={weeklyInsights}
        loading={weeklyLoading}
        error={weeklyError}
        mounted={mounted}
      />

      <TabMonthly
        monthlyInsights={monthlyInsights}
        loading={monthlyLoading}
        error={monthlyError}
        mounted={mounted}
      />

      <TabMyths myths={myths} loading={mythsLoading} error={mythsError} />
    </div>
  )}
</div>

    </main>
  );
}

export default LifeReportShell;

/* ---------------- Prefill wrapper (disabled for now) ---------------- */

// function LifeReportInnerWithPrefill() {
//   const searchParams = useSearchParams();
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
