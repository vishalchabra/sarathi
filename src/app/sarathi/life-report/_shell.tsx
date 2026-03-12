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
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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


  /* ---------------- Locking city autocomplete (simplified - always typeable) ---------------- */


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

    //  Kaal windows (we?ll still show ?? - ?? until backend sends structured ranges)
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
    fullGuidanceV2?: any;
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

  // --- Yoga / Karana from sidereal - & - ---

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
    // 57 - Shakuni, 58 - Chatushpada, 59 - Naga, 0 - Kimstughna
    if (K === 57) return "Shakuni";
    if (K === 58) return "Chatushpada";
    if (K === 59) return "Naga";
    if (K === 0) return "Kimstughna";

    // Otherwise repeating set of 7 movable karanas
    return KARANA_MOVABLE[(K - 1 + 7) % 7];
  }
  class UiErrorBoundary extends React.Component<
    { label: string; children: React.ReactNode },
    { hasError: boolean; msg: string }
  > {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, msg: "" };
    }
    static getDerivedStateFromError(err: any) {
      return { hasError: true, msg: String(err?.message ?? err ?? "Unknown error") };
    }
    componentDidCatch(err: any) {
      console.error(`[${this.props.label}] render crashed`, err);
    }
    render() {
      if (!this.state.hasError) return this.props.children;
      return (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-200">
          <div className="font-semibold">{this.props.label} crashed</div>
          <div className="mt-1 text-xs text-red-200/80">{this.state.msg}</div>
          <div className="mt-2 text-xs text-red-200/70">
            Open browser console for stack trace.
          </div>
        </div>
      );
    }
  }

  /* ---------------- Helpers ---------------- */

  function humanizeInsight(base: string, seedKey: string = "default"): string {
    // Premium: deterministic tone (no Math.random), clean punctuation, no awkward spacing
    const openers = [
      "A gentle shift is available today:",
      "Notice this subtle signal:",
      "Today invites a quieter approach:",
      "The energy supports a calmer rhythm:",
      "Lean into this simple truth today:",
      "One clear step is enough today:",
    ];

    const endings = [
      "Move slowly — clarity builds when you stop forcing it.",
      "Keep it simple. One clean action beats ten scattered ones.",
      "Choose one priority and finish it fully.",
      "Let your next step be practical, not perfect.",
      "Keep your tone soft and your intent firm.",
    ];

    const pick = (arr: string[], key: string) => {
      // tiny deterministic hash so text stays stable per seedKey
      let h = 0;
      for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
      return arr[h % arr.length];
    };

    let sentence = String(base || "").trim();

    // Remove repetitive astrology phrasing + clean up spacing
    sentence = sentence
      .replace(/this moon (position|phase|placement)/gi, "")
      .replace(/this transit|the transit/gi, "")
      .replace(/today you may|today you might/gi, "today you may")
      .replace(/\s+/g, " ")
      .trim();

    if (!sentence) return "";

    // Ensure ending punctuation
    if (!/[.!?]$/.test(sentence)) sentence += ".";

    const opener = pick(openers, seedKey + "|o");
    const ending = pick(endings, seedKey + "|e");
    return `${opener} ${sentence} ${ending}`;
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
      ? `Career signals are active — ${planet} touching ${target} can bring a useful update, decision point, or visibility moment. Stay factual and respond with one clean action.`
      : cat === "relationships"
      ? `Relationship tone matters — ${planet} touching ${target} can surface a conversation or boundary. Speak simply; don’t try to “win” today.`
      : cat === "health"
      ? `Your system wants care — ${planet} touching ${target} rewards pacing, hydration, and an early wind-down. Support the body and the mind will follow.`
      : cat === "inner"
      ? `Inner weather is louder — ${planet} touching ${target} is best used for reflection, not reaction. Pause before you interpret everything.`
      : `A background influence is running — ${planet} touching ${target}. Keep your actions steady and uncluttered.`;
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

  // Base paragraph (tight + premium)
  const lines: string[] = [];

  // 1) One premium opener only (moodOpeners)
  const moodOpeners = [
    "Emotionally steady — you can get a lot done without overthinking.",
    "A calm, practical tone supports progress today.",
    "Your mind wants clarity; simplicity will feel powerful.",
    "Sensitivity is possible; keep your pace steady and your words clean.",
    "Today rewards quiet focus and clean choices.",
    "Small wins stack up — finish what you start.",
    "Less noise, more precision: one good decision beats many fast ones.",
  ];
  lines.push(moodOpeners[idx % moodOpeners.length]);

  // 2) Nakshatra layer (if available)
  const nakLine = themeSentence();
  if (nakLine) lines.push(nakLine);

  // 3) House focus (short)
  lines.push(`Your attention naturally goes toward ${houseText}.`);

  // 4) One guiding instruction (not two)
  lines.push("Choose one priority, take one clear step, then close the loop.");

  // 5) Transit flavor (dedupe)
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
      "Don't: multitask or start 3 things at once.",
      "Don't: react instantly to messages — pause first.",
      "Don't: overspend or overcommit to please others.",
      "Don't: push your body if energy feels low.",
      "Don't: argue to win — aim for clarity instead.",
      "Don't: make big decisions late at night or in a rush.",
      "Don't: let small friction turn into a big mood.",
    ];

    let doLine = doBank[idx % doBank.length];
    let dontLine = dontBank[idx % dontBank.length];

    // Tune to category
    if (strongest?.category === "career") {
      doLine = "Do: take one concrete career step (send, submit, schedule, follow up).";
      dontLine = "Don't: make impulsive job/business calls without checking details.";
    } else if (strongest?.category === "relationships") {
      doLine = "Do: prioritize one relationship action (check-in, clarify, set boundary).";
      dontLine = "Don't: escalate emotionally — keep tone calm and precise.";
    } else if (strongest?.category === "health") {
      doLine = "Do: support the body (hydration, lighter food, early sleep).";
      dontLine = "Don't: overtrain or experiment wildly with diet/routine today.";
    } else if (strongest?.category === "inner") {
      doLine = "Do: take quiet time — reflect before reacting.";
      dontLine = "Don't: spiral in overthinking; write it down and move on.";
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
  type FullGuidance = {
    version: string;
    generatedAtISO: string;

    lifeStory: Array<{
      mdLord: string;
      startISO: string;
      endISO: string;
      theme: string;
      career: string[];
      money: string[];
      relationships: string[];
      mindset: string[];
      lessons: string[];
      ad: Array<{
        adLord: string;
        startISO: string;
        endISO: string;
        highlights: string[];
        caution: string[];
      }>;
    }>;

    current: {
      md: string;
      ad: string;
      fromISO: string;
      toISO: string;
      summary: string;
      do: string[];
      avoid: string[];
    };

    next90Days: Array<{
      label: string;
      fromISO: string;
      toISO: string;
      score: number;
      why: string[];
      do: string[];
      avoid: string[];
    }>;

    playbook: Record<string, { do: string[]; avoid: string[]; timing: string[] }>;

    alignment: {
      daily: string[];
      weekly: string[];
      remedies: string[];
    };
  };
  function buildFullGuidanceFromReport(report: any): FullGuidance {
    const d = report?.dasha ?? null;

    const md = String(d?.mdLord ?? "Unknown");
    const adRow = Array.isArray(d?.ad) ? d.ad[0] : null;
    const ad = String(adRow?.lord ?? "Unknown");

    return {
      version: "v1",
      generatedAtISO: new Date().toISOString(),

      lifeStory: [],

      current: {
        md,
        ad,
        fromISO: String(adRow?.startISO ?? ""),
        toISO: String(adRow?.endISO ?? ""),
        summary: "",
        do: [],
        avoid: [],
      },

      next90Days: [],
      playbook: {},
      alignment: {
        daily: [],
        weekly: [],
        remedies: [],
      },
    };
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
  function normalizeBullets(input: any, max = 3): string[] {
    if (!Array.isArray(input)) return [];

    const out: string[] = [];

    for (const v of input) {
      // If it's already a string
      if (typeof v === "string") {
        const s = v.trim();
        if (s) out.push(s);
        continue;
      }

      // If it's an object like { text, reason }
      if (v && typeof v === "object") {
        const text = typeof v.text === "string" ? v.text.trim() : "";
        const reason = typeof v.reason === "string" ? v.reason.trim() : "";

        // choose ONE:
        // Option A (clean): just text
        if (text) out.push(text);

        // Option B (slightly richer): include reason
        // if (text) out.push(reason ? `${text} — ${reason}` : text);

        continue;
      }
    }

    return out.filter(Boolean).slice(0, max);
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

    // plain text fallback - split into lines if it looks list-y
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
      .replace(/\u00E2\u0080\u0099/g, "\u2019") // -
      .replace(/\u00E2\u0080\u009C/g, "\u201C") // -
      .replace(/\u00E2\u0080\u009D/g, "\u201D") // -
      .replace(/\u00E2\u0080\u0093/g, "\u2013") // -
      .replace(/\u00E2\u0080\u0094/g, "\u2014") // -
      .replace(/\u00E2\u0080\u00A6/g, "\u2026") // -
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

      // 5) Fix numeric ranges where - stands for a dash (do this BEFORE degree fixes)
      // 1?2 sentence/day/week/month -> 1-2 sentence/day/week/month
      .replace(
        /(\d)\?(\d)(\s*(?:sentence|sentences|day|days|week|weeks|month|months)\b)/gi,
        "$1-$2$3"
      )

      // 6) Fix degree symbol corruption (only when it looks like deg+minutes)
      // 13?20' -> 13-20'
      .replace(/(\d{1,2})\?(\d{2})(?=')/g, "$1-$2")

      // Also handle cases like 0?30 (common in astro text)
      .replace(/(\d{1,2})\?(\d{2})(?!\d)/g, "$1-$2")

      // 7) Fix separators: "active? treat" or "Retrograde ?"
      .replace(/([A-Za-z0-9])\?\s+(?=[A-Za-z])/g, "$1 - ")
      .replace(/\s+\?\s+/g, " – ")

      // 8) Collapse extra spaces
      .replace(/\s{2,}/g, " ")
      .trim();
  }


  function sanitizeText(input: string): string {
    if (!input) return "";

    return input
      // remove - replacement characters
      .replace(/\uFFFD/g, "")
      // common mojibake fixes
      .replace(/-/g, "")
      .replace(/-|/g, '"')
      .replace(/-|-/g, "'")
      .replace(/-|-/g, "")
      .replace(/-/g, "")
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
      .replace(/-/g, "")
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
    if (s.includes("�") || s.includes("-") || s.includes("Ã") || s.includes("Â")) return true;

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
      // "Today the Moon ..." (general)
      .replace(/\bToday\s+the\s+Moon\b[^.]*\.?\s*/gi, "")
      // cleanup extra spaces
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  function interpretNatalInteraction(evidenceLine: string) {
  const text = evidenceLine.toLowerCase();

  if (text.includes("natal venus"))
    return "This may touch relationship expectations or financial priorities.";

  if (text.includes("natal mars"))
    return "This may push you to act more decisively or assert your position.";

  if (text.includes("natal saturn"))
    return "Responsibilities or long-term commitments may shape the situation.";

  if (text.includes("natal jupiter"))
    return "An opportunity for growth, learning, or expansion may emerge here.";

  if (text.includes("natal rahu"))
    return "This may connect to long-term ambitions or unfamiliar territory.";

  if (text.includes("natal ketu"))
    return "Something may feel less important now, encouraging simplification.";

  if (text.includes("natal mercury"))
    return "Communication style or information flow may become especially important.";

  if (text.includes("natal moon"))
    return "Emotional reactions or comfort zones may influence decisions.";

  return "";
}
function buildContextLine(headline: string, evidenceLine: string) {
  const source = `${headline} ${evidenceLine}`.toLowerCase();

  if (/work|routine|task|responsibilit|colleague/.test(source)) {
    return "A quick response or clearer role definition will help keep things moving smoothly.";
  }

  if (/communication|reply|message|document|followup|negotiat|clarif/.test(source)) {
    return "The sooner details are clarified, the easier it will be to avoid unnecessary back-and-forth.";
  }

  if (/home|family|repair|property|foundation|schedule/.test(source)) {
    return "Practical coordination matters more than speed, so keep arrangements simple and specific.";
  }

  if (/money|expense|budget|shared resource|shared expense|financial|cost/.test(source)) {
    return "It will help to confirm terms, expectations, or numbers before making a final decision.";
  }

  if (/relationship|agreement|collaboration|team|shared/.test(source)) {
    return "A balanced response will work better than pushing too hard or leaving things vague.";
  }

  if (/career|direction|lead|project|initiative/.test(source)) {
    return "Small decisions made now may shape how others read your priorities over the next few days.";
  }

  return "A little structure and a timely response will make the situation easier to handle.";
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
  function pickTopHints(
    hints: string[],
    moonFrom: number | null,
    strength: number
  ) {
    if (!Array.isArray(hints) || hints.length === 0) return [];

    // 1) Prefer a "day:" flavor first (moon-from-moon themed)
    const moonHint =
      hints.find((h) => /message day:/i.test(h)) ||
      hints.find((h) => /career day:/i.test(h)) ||
      hints.find((h) => /relationship day:/i.test(h)) ||
      hints.find((h) => /home\/mind day:/i.test(h)) ||
      hints.find((h) => /money\/family day:/i.test(h)) ||
      hints.find((h) => /pressure day:/i.test(h)) ||
      hints.find((h) => /uncertainty day:/i.test(h)) ||
      hints.find((h) => /low bandwidth day:/i.test(h)) ||
      "";

    // 2) Prefer "angle:" next (target nuance) to avoid repeating Jupiter "trigger" daily
    const angleHint = hints.find((h) => /angle:/i.test(h)) || "";

    // 3) Only then use "trigger:" (planet driver)
    const triggerHint = hints.find((h) => /trigger:/i.test(h)) || "";

    const selected: string[] = [];

    if (moonHint) selected.push(moonHint);

    // Prefer angle over trigger to reduce repetitive "mentor support / approvals" every day
    if (angleHint && angleHint !== moonHint) {
      selected.push(angleHint);
    } else if (triggerHint && triggerHint !== moonHint) {
      selected.push(triggerHint);
    }

    // Fallback: fill up to 2 unique hints
    if (selected.length < 2) {
      for (const h of hints) {
        if (!selected.includes(h)) selected.push(h);
        if (selected.length >= 2) break;
      }
    }

    return selected.slice(0, 2);
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
  function resolveTodayISO(input?: any) {
    const s = String(input ?? "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    return new Date().toISOString().slice(0, 10);
  }

  function sanitizeDashaTimeline(raw: any): Array<{ planet: string; startISO: string; endISO: string }> {
    const arr = Array.isArray(raw) ? raw : [];
    const norm = arr
      .map((r: any) => {
        const planet =
          String(r?.planet ?? r?.mdLord ?? r?.md ?? r?.mahadasha ?? r?.lord ?? "").trim();
        const startISO =
          String(r?.startISO ?? r?.fromISO ?? r?.start ?? r?.from ?? "").slice(0, 10);
        const endISO =
          String(r?.endISO ?? r?.toISO ?? r?.end ?? r?.to ?? "").slice(0, 10);

        return { planet, startISO, endISO };
      })
      .filter((r) => r.planet && /^\d{4}-\d{2}-\d{2}$/.test(r.startISO) && /^\d{4}-\d{2}-\d{2}$/.test(r.endISO));

    // guardrail: if something is wildly wrong (e.g. 2187), drop it
    const plausible = norm.filter((r) => {
      const y1 = Number(r.startISO.slice(0, 4));
      const y2 = Number(r.endISO.slice(0, 4));
      return y1 >= 1900 && y2 <= 2100 && y2 >= y1;
    });

    return plausible.length ? plausible : norm;
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
    // - Jupiter - Moon (2026-01-01 -> 2026-02-15) [career]

    const reRange =
    /(?:^|\n)\s*[-*]?\s*([^\n(]+?)\s*\(\s*(\d{4}-\d{2}-\d{2})\s*(?:\?|->|-|-|to)\s*(\d{4}-\d{2}-\d{2})\s*\)\s*(?:\[\s*([^\]]+?)\s*\])?\s*(?=\n|$)/gi;

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

    // 2) Secondary: if your text has "Window: YYYY-MM-DD - YYYY-MM-DD"
    // (helps when GPT output format changes)
    const reInline =
    /(?:window|period|phase)\s*[:\-]\s*([^\n:]+?)\s*(\d{4}-\d{2}-\d{2})\s*(?:\?|->|-|-|to)\s*(\d{4}-\d{2}-\d{2})/gi;

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

  function describeMoonPhase(nak: string) {
    const n = (nak || "").toLowerCase();

    if (n.includes("ashwini"))
      return "Initiative rises — take the first step, send the message, start the task.";

    if (n.includes("bharani"))
      return "Intensity increases — stay steady, avoid impulsive reactions, choose the clean path.";

    if (n.includes("krittika"))
      return "Clarity sharpens — cut distractions, make one strong decision, follow through.";

    if (n.includes("rohini"))
      return "Growth and visibility increase — build, present, and let your work be seen.";

    if (n.includes("mrigashira"))
      return "Curiosity and outreach grow — explore options, network lightly, refine direction.";

    if (n.includes("ardra"))
      return "Emotional processing is active — slow down, observe patterns, don’t escalate conflicts.";

    if (n.includes("punarvasu"))
      return "Reset energy — revisit plans, correct course gently, restore balance.";

    if (n.includes("pushya"))
      return "Supportive steady flow — discipline works today, routines bring results.";

    if (n.includes("magha"))
      return "Authority themes rise — take ownership, lead with dignity, keep ego clean.";

    if (n.includes("purva phalguni"))
      return "Creative-social warmth — connect, collaborate, and keep things light but real.";

    if (n.includes("uttara phalguni"))
      return "Commitment energy — good for agreements, formal decisions, and responsible follow-up.";

    if (n.includes("hasta"))
      return "Practical focus — organize, edit, refine, and fix what’s already in motion.";

    if (n.includes("chitra"))
      return "Upgrade mode — improve presentation, polish details, align form with purpose.";

    if (n.includes("swati"))
      return "Flexibility helps — adapt fast, stay balanced, don’t force certainty.";

    if (n.includes("vishakha"))
      return "Goal-pressure rises — push toward a milestone, but avoid harshness.";

    if (n.includes("anuradha"))
      return "Collaboration is favored — lean on allies, build trust, move as a team.";

    if (n.includes("jyeshtha"))
      return "Responsibility feels heavier — stay composed, choose maturity over control.";

    if (n.includes("mula"))
      return "Deep reset — simplify, release what’s draining you, avoid big irreversible calls.";

    if (n.includes("purva ashadha"))
      return "Momentum returns — confidence rises, move forward, don’t overthink.";

    if (n.includes("uttara ashadha"))
      return "Long-term progress — choose durable work, build what lasts.";

    if (n.includes("shravana"))
      return "Listening wins — gather information, ask better questions, learn before acting.";

    if (n.includes("dhanishta"))
      return "Action increases — execute, show up visibly, channel energy constructively.";

    if (n.includes("shatabhisha"))
      return "Inner recalibration — reduce noise, protect focus, prioritize health and clarity.";

    if (n.includes("purva bhadrapada"))
      return "Strategic intensity — go deep, but avoid extremes or dramatic decisions.";

    if (n.includes("uttara bhadrapada"))
      return "Stabilization — consolidate gains, steady the mind, keep things simple.";

    if (n.includes("revati"))
      return "Completion energy — close loops, finish pending tasks, wrap what’s unfinished.";

    return "Stay steady — respond calmly, and keep your next step simple.";
  }

  function buildDailyFallbackFromFeatures(features: DailyFeature[]): DailyHighlight[] {
    return features.map((d) => {
      const nk = (d.moonNakshatra || "").trim();
      const focus = d.focusArea || "your regular routines";

      // Translate nakshatra → usable guidance
      const moonMeaning = describeMoonPhase(nk);

      const base =
        `Today’s flow centers on ${focus}. ${moonMeaning}`;

      let extra = "";
      const st = d.strongestTransit;

      if (st && st.strength >= 0.55) {
        extra =
          ` A stronger ${st.category} influence builds as ` +
          `${st.transitPlanet} interacts with your natal ${st.natalPlanet}. ` +
          `Stay intentional and respond rather than react.`;
      }

      return {
        dateISO: d.dateISO,
        text: (base + extra).trim(),
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

    // If we can't be clever, still return the guess - better than nothing
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

  /* ---- zodiac helpers for House - Sign legend ---- */

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
                  p.sign ? ` - ${p.sign}` : ""
                }${p.house ? ` - House ${p.house}` : ""}`}</title>
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
        }${ascNakshatra ? ` - ${ascNakshatra}` : ""}`,
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
  function interpretTransitWindow(planet?: string, target?: string) {
  const p = String(planet ?? "").toLowerCase();
  const t = String(target ?? "").toLowerCase();

  if (p === "mercury") {
    return "Expect more conversations, messages, and decisions around schedules, agreements, or plans.";
  }

  if (p === "mars") {
    return "Momentum increases here. Actions, confrontations, or urgent tasks may appear.";
  }

  if (p === "venus") {
    return "Relationships, finances, or agreements may come into focus.";
  }

  if (p === "saturn") {
    return "Responsibilities or long-term decisions may demand attention.";
  }

  if (p === "jupiter") {
    return "Opportunities for growth, learning, or expansion may surface.";
  }

  if (p === "rahu") {
    return "Unexpected shifts or unusual developments could push you to adapt.";
  }

  if (p === "ketu") {
    return "Something may need to be simplified, released, or re-evaluated.";
  }

  return "This window may bring decisions or adjustments related to current priorities.";
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
    report?: any;
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
      report,
      loading, // unused here now (12-month removed)
      error, // unused here now (12-month removed)
      transitSummary, // unused here now (12-month removed)
      dailyHighlights,
      dailyLoading: dailyLoadingProp,
      dailyError: dailyErrorProp,
      mounted,
    }) => {
      const mdLord =
  String((report as any)?.activePeriods?.mahadasha?.lord || "").trim();

const adLord =
  String(
    (report as any)?.activePeriods?.antardasha?.subLord ??
    (report as any)?.activePeriods?.antardasha?.lord ??
    ""
  ).trim();
      const list = Array.isArray((report as any)?.todayNextFewDaysCards)
  ? (report as any).todayNextFewDaysCards
  : [];

const visible = list.slice(0, 7);

console.log("[NOW TAB] todayNextFewDaysCards =", (report as any)?.todayNextFewDaysCards);
console.log("[NOW TAB] visible =", visible);
console.log("[NOW TAB] dailyHighlights fallback length =", Array.isArray(dailyHighlights) ? dailyHighlights.length : 0);
     const upcomingWindow = React.useMemo(() => {
  const list = Array.isArray((report as any)?.topTransits)
    ? (report as any).topTransits
    : [];

  if (!list.length) return null;

  const todayISO =
    typeof (report as any)?.todayISO === "string" && (report as any)?.todayISO
      ? String((report as any).todayISO)
      : new Date().toISOString().slice(0, 10);

  const toDate = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const todayDate = toDate(todayISO);
  if (!todayDate) return null;

  const scored = list
    .map((t: any) => {
      const startISO = String(t?.startISO || "").trim();
      const endISO = String(t?.endISO || "").trim();

      const startDate = toDate(startISO);
      const endDate = toDate(endISO);

      if (!startDate || !endDate) return null;

      const msPerDay = 1000 * 60 * 60 * 24;
      const daysUntilStart = Math.floor((startDate.getTime() - todayDate.getTime()) / msPerDay);
      const isActiveNow = startDate <= todayDate && endDate >= todayDate;
      const isSoon = daysUntilStart >= 0 && daysUntilStart <= 30;

      return {
        raw: t,
        startISO,
        endISO,
        startDate,
        endDate,
        daysUntilStart,
        isActiveNow,
        isSoon,
        strength: Number(t?.strength ?? 0),
      };
    })
    .filter(Boolean) as Array<{
      raw: any;
      startISO: string;
      endISO: string;
      startDate: Date;
      endDate: Date;
      daysUntilStart: number;
      isActiveNow: boolean;
      isSoon: boolean;
      strength: number;
    }>;

  if (!scored.length) return null;

  const activeNow = scored
    .filter((x) => x.isActiveNow)
    .sort((a, b) => b.strength - a.strength)[0];

  const upcomingSoon = scored
    .filter((x) => x.isSoon)
    .sort((a, b) => {
      if (a.daysUntilStart !== b.daysUntilStart) return a.daysUntilStart - b.daysUntilStart;
      return b.strength - a.strength;
    })[0];

  const fallbackStrongest = scored
    .slice()
    .sort((a, b) => b.strength - a.strength)[0];

  const picked = activeNow || upcomingSoon || fallbackStrongest;
  if (!picked) return null;

  return {
    planet: picked.raw?.planet,
    target: picked.raw?.target,
    start: picked.startISO,
    end: picked.endISO,
    title: picked.raw?.title,
    isActiveNow: picked.isActiveNow,
  };
}, [report]);
const strongestTodayTransit = React.useMemo(() => {
  const list = Array.isArray((report as any)?.transitNowFacts)
    ? (report as any).transitNowFacts.map((x: any) => String(x || "").trim()).filter(Boolean)
    : [];

  if (!list.length) return null;

  const preferred =
    list.find((x: string) => x.toLowerCase().includes("mars")) ||
list.find((x: string) => x.toLowerCase().includes("sun")) ||
list.find((x: string) => x.toLowerCase().includes("mercury")) ||
list[0];

  return preferred || null;
}, [report]);
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
     const weeklyPattern = React.useMemo(() => {
  const list = Array.isArray(visible) ? visible : [];
  if (!list.length) return null;

  const focusCounts: Record<string, number> = {};

  for (const card of list) {
    const key = String(card?.focus ?? "").toLowerCase();

    if (!key) continue;

    focusCounts[key] = (focusCounts[key] ?? 0) + 1;
  }

  const sorted = Object.entries(focusCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  if (!sorted.length) return null;

  const mainTheme = sorted[0][0];
  const count = sorted[0][1];

  let message = "";

  if (mainTheme.includes("communication")) {
    message =
      "Communication loops and clarifications dominate the coming days. Address messages early to avoid small misunderstandings growing.";
  } else if (mainTheme.includes("home")) {
    message =
      "Home and family logistics appear repeatedly this week. Practical coordination will help things move smoothly.";
  } else if (mainTheme.includes("finance") || mainTheme.includes("money") || mainTheme.includes("resource")) {
    message =
      "Shared finances or practical resource decisions appear multiple times this week. Confirm details before committing.";
  } else if (mainTheme.includes("relationship")) {
    message =
      "Relationship dynamics and shared expectations appear repeatedly. Transparent communication will keep things balanced.";
  } else {
    message =
      "Several days revolve around practical coordination and small decisions. Closing open loops early will keep the week smooth.";
  }

  return {
    title: "This week’s pattern",
    text: message,
  };
}, [visible]);
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

<div className="text-xs text-white/50">
  Current phase: {mdLord && adLord ? `${mdLord} main phase • ${adLord} sub-phase` : "Current dasha phase active"}
</div>

<div className="text-xs text-white/70">
  Personalized from your natal Moon + current transits.
</div>

<div className="text-xs text-white/60 mt-1">
  A 7-day view shaped by your dasha, Moon movement, and strongest active transits.
</div>
{weeklyPattern && (
  <div className="mt-3 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2">
    <div className="text-[11px] uppercase tracking-wide text-indigo-200 font-semibold">
      {weeklyPattern.title}
    </div>
    <div className="mt-1 text-xs text-white/75">
      {weeklyPattern.text}
    </div>
  </div>
)}
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
              {strongestTodayTransit && (
  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
    <div className="text-[11px] uppercase tracking-wide text-emerald-200 font-semibold">
      Today’s strongest transit
    </div>

    <div className="mt-1 text-sm font-semibold text-white">
      {strongestTodayTransit}
    </div>

    <div className="mt-2 text-xs text-white/65">
      This is the clearest active planetary tone influencing today’s decisions, mood, and response pattern.
    </div>
  </div>
)}
             {upcomingWindow && (
  <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4 mb-4">
    <div className="text-[11px] uppercase tracking-wide text-indigo-200 font-semibold">
      Upcoming Key Window
    </div>

    <div className="mt-1 text-sm font-semibold text-white">
      {upcomingWindow.title || `${upcomingWindow.planet} Activation`}
    </div>

    <div className="text-xs text-white/70 mt-1">
  {upcomingWindow.isActiveNow ? "Active now" : "Starts soon"} • {upcomingWindow.start} to {upcomingWindow.end}
</div>

    <div className="text-xs text-white/60 mt-2">
  {interpretTransitWindow(upcomingWindow.planet, upcomingWindow.target)}{" "}
  {upcomingWindow.isActiveNow
    ? "Because this window is already active, current decisions may carry more weight."
    : "This influence is building, so decisions made during this period may shape the coming weeks."}
</div>
  </div>
)}

              {/* Cards */}
              {!dailyLoadingProp && !dailyErrorProp && visible.length > 0 && (
                <div className="space-y-3">
                 {visible.map((d: any, idx: number) => {
const dateISO = String((d as any)?.dateISO ?? "").trim();

const titleRaw = String((d as any)?.title ?? "");
const textRaw = String((d as any)?.text ?? "");
const focusRaw = String((d as any)?.focus ?? "");
const triggerRaw = String((d as any)?.trigger ?? "");

const lowerSource = `${titleRaw} ${textRaw} ${focusRaw} ${triggerRaw}`.toLowerCase();

const planetMatch =
  lowerSource.match(
    /(sun|moon|mars|mercury|venus|jupiter|saturn|rahu|ketu)/i
  )?.[1]?.toLowerCase() ?? "";

const houseNum =
  Number.isFinite(Number((d as any)?.houseNum))
    ? Number((d as any)?.houseNum)
    : (() => {
        const m = /\bH(\d+)\b/i.exec(focusRaw || textRaw);
        return m ? Number(m[1]) : null;
      })();

const houseLabel =
  houseNum === 1 ? "Self & direction" :
  houseNum === 2 ? "Money & resources" :
  houseNum === 3 ? "Communication & effort" :
  houseNum === 4 ? "Home & foundations" :
  houseNum === 5 ? "Creativity & children" :
  houseNum === 6 ? "Work & routines" :
  houseNum === 7 ? "Relationships & agreements" :
  houseNum === 8 ? "Shared finances & change" :
  houseNum === 9 ? "Learning & travel" :
  houseNum === 10 ? "Career & reputation" :
  houseNum === 11 ? "Friends & gains" :
  houseNum === 12 ? "Rest & reflection" :
  null;

const triggerLabel =
  safeText((d as any)?.trigger ?? "") || "Transit Activation";

const energyLevel =
  safeText((d as any)?.energy ?? "") ||
  (lowerSource.includes("mars") || lowerSource.includes("sun")
    ? "High"
    : lowerSource.includes("mercury") || lowerSource.includes("jupiter")
    ? "Moderate"
    : lowerSource.includes("moon") || lowerSource.includes("venus")
    ? "Sensitive"
    : "Moderate");

const dateLabel =
  safeText((d as any)?.dateLabel ?? "") ||
  (() => {
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
const rawText = safeText(
  (d as any)?.text ??
  (d as any)?.guidance ??
  ""
);
const moodText = safeText((d as any)?.moodText ?? "");

const headlineRaw = safeText((d as any)?.headline ?? "");
const focusText = safeText((d as any)?.focus ?? "");
const subfocusText = safeText((d as any)?.subfocus ?? "");

const headline =
  headlineRaw ||
  (
    subfocusText &&
    subfocusText.toLowerCase() !== focusText.toLowerCase()
      ? subfocusText
      : ""
  ) ||
  String((d as any)?.title || "").trim() ||
  "";
const conf = String((d as any)?.confidence ?? "").trim().toLowerCase();

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

const finalLineRaw = fixQuotedGibberish(
  safeText(
    normalizeHighlightText(stripNakshatraClaims(rawText), idx)
  )
)
  .replace(/([a-z])([A-Z])/g, "$1 $2") // auto-fix smashed words
  .replace(/([a-z])such as/gi, "$1 such as")
  .replace(/([a-z])could\b/gi, "$1 could")
  .replace(/selfassertion/gi, "self-assertion")
  .replace(/selfdirection/g, "self-direction")
  .replace(/homesuch/gi, "home such")
  .replace(/reorganizationcould/gi, "reorganization could")
  .replace(/homerelated/gi, "home-related")
  .replace(/familyrelated/gi, "family-related")
  .replace(/workrelated/gi, "work-related");

const looksLikeInternalFacts = (s: string) =>
  /transit moon nakshatra:|strongest transit:|transit strength:|focus area:|from natal moon/i.test(s);

const finalLineCandidate =
  finalLineRaw && looksLikeInternalFacts(finalLineRaw) ? "" : finalLineRaw;

const evidenceLine = Array.isArray((d as any)?.evidence)
  ? (d as any).evidence.filter(Boolean).join(" • ")
  : "";
const actionBias = (() => {
  const source = `${headline} ${finalLineCandidate} ${evidenceLine}`.toLowerCase();

  if (/money|expense|budget|shared resource|shared expense|cost|financial/.test(source)) {
    return "Watch for: confirm financial details before agreeing or committing.";
  }

  if (/email|reply|message|conversation|discussion|negotiat|clarif|document|paperwork|follow up/.test(source)) {
    return "Best use: clarify details early and close open communication loops.";
  }

  if (/home|family|repair|maintenance|routine|schedule|foundation|property/.test(source)) {
    return "Best use: practical coordination and steady problem-solving.";
  }

  if (/project|initiative|leadership|step up|organizing|responsibility/.test(source)) {
    return "Best use: take initiative, but set clear expectations with others.";
  }

  if (/relationship|agreement|collaboration|team/.test(source)) {
    return "Best use: align expectations and keep communication transparent.";
  }

  return "Best use: keep plans simple and close small loops.";
})();
const fallbackLine =
  moodText ||
  evidenceLine ||
  "A steady day: keep it simple, choose one priority, and close loops.";

const likelyEventLine = (() => {
  const source = !finalLineCandidate || isMostlyGarbage(finalLineCandidate)
    ? fallbackLine
    : finalLineCandidate;

  const sentences = String(source)
    .split(/(?<=[.!?])\s+/)
    .slice(0, 3);

  return sentences.join(" ").trim();
})();

const contextLine = buildContextLine(headline, evidenceLine);

const finalLine = [likelyEventLine, contextLine]
  .filter(Boolean)
  .join(" ");
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
  className={
    "rounded-2xl border bg-white/5 p-4 " +
    (conf === "high"
      ? "border-emerald-400/20"
      : conf === "low"
      ? "border-amber-400/20"
      : "border-white/10")
  }
>
                         {/* Trigger label */}
    <div className="mb-2 inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-indigo-200">
      {triggerLabel}
    </div>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-100">
                              {safeText(dateLabel)}
                            </div>
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
{(safeText((d as any)?.focus ?? "") || houseNum) && (
  <div className="mt-2 inline-flex rounded-full border border-indigo-300/20 bg-indigo-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-indigo-200">
    {safeText((d as any)?.focus ?? "") || `H${houseNum} ${houseLabel}`}
  </div>
)}
                        {/* Headline */}
                        {headline && (
                          <div className="mt-2 text-sm font-semibold text-white/90">
                            {headline}
                          </div>
                        )}
                      
                       {/* Main line */}
<div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/75">
  {finalLine}
</div>
{interpretNatalInteraction(evidenceLine) && (
  <div className="mt-2 text-[12px] text-indigo-200/80">
    {interpretNatalInteraction(evidenceLine)}
  </div>
)}
{evidenceLine && (
  <div className="mt-2 text-[11px] text-white/50">
    {evidenceLine}
  </div>
)}
<div className="mt-2 text-[11px] text-indigo-100/70">
  {actionBias}
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

    // 3) Map category - text
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
    dailyHighlights: DailyHighlight[];
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

  // ===================== Full Guidance: degree + nakshatra intelligence =====================

  // Lahiri-ish sidereal: you already store siderealDeg in [0..360).
  // Convert absolute degree - degree within sign (0..30)
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

  // ---------------- Safe fallbacks for Advanced tab helpers ----------------
  // (These keep the build green if the “_X” helpers were renamed/removed.)
  function buildWhyBullets_X(_r: any): { bullets: string[]; evidence: string[] } {
    return { bullets: [], evidence: [] };
  }

  function buildOperatingMode_X(_r: any): string[] {
    return [];
  }

  function trimPlaybook_X(b: any): any {
    return b ?? { supportive: [], avoid: [], timing: [] };
  }
  function buildRules_X(_r: any): string[] {
    return [];
  }
  function buildTakeawayLine_X(_r: any): string {
    return "";
  }
  function getP_X(r: any, planetName: string): any | null {
    const arr = Array.isArray(r?.planets) ? r.planets : Array.isArray(r?.core?.planets) ? r.core.planets : [];
    return arr.find((p: any) => String(p?.name ?? p?.planet ?? "").toLowerCase() === planetName.toLowerCase()) ?? null;
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
  function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }

  function computeDecisionQuality10(al: {mind:number; emotions:number; direction:number; energy:number; support:number}, topToday: any[]) {
    // Higher mind/direction/support help, high emotions without mind reduces quality slightly
    const base =
      0.22 * al.mind +
      0.22 * al.direction +
      0.18 * al.support +
      0.20 * al.energy +
      0.18 * (100 - al.emotions); // emotional volatility reduces
    const transitBoost = Math.min(6, (topToday?.[0]?.strength ?? 0) * 10); // mild
    const score100 = base + transitBoost;
    return Math.round((Math.max(35, Math.min(92, score100)) / 10) * 10) / 10; // 3.5..9.2
  }

  function labelLevel(v: number) {
    if (v >= 75) return "High";
    if (v >= 58) return "Medium";
    return "Low";
  }

  function inferMainTheme(plan: any, report: any, topToday: any[]) {
    const head = String(plan?.headline ?? "").trim();
    if (head) return head;

    const t0 = topToday?.[0];
    if (t0?.category) return `Focus: ${String(t0.category)}`;
    // fallback: house 6/10 cues from your chart
    const sat = findPlanet(report, "Saturn");
    const h = toNum(sat?.house);
    return h ? `Focus: ${houseTheme(h)}` : "Focus: steady progress";
  }

  function pickTopAction(plan: any, buckets: any) {
    const a = plan?.next14Days?.steeringPlan?.[0];
    if (a) return String(a);
    const b = buckets?.supportive?.[0];
    if (b) return String(b);
    return "Pick one priority and finish it cleanly.";
  }

  function pickAvoid(buckets: any) {
    const a = buckets?.avoid?.[0];
    return a ? String(a) : "Avoid impulsive decisions when emotions are high.";
  }

  function computePressureOpportunity(topToday: any[], al: any) {
    const s = Number(topToday?.[0]?.strength ?? 0);
    const pressure = clamp01(0.55 * (al.emotions / 100) + 0.45 * s);
    const opportunity = clamp01(0.45 * (al.support / 100) + 0.35 * (al.direction / 100) + 0.20 * s);
    const energy = clamp01(al.energy / 100);
    return { pressure, opportunity, energy };
  }
  function scoreAreas(plan: any, topToday: any[]) {
    const areas = Array.isArray(plan?.next14Days?.areasActivated) ? plan?.next14Days?.areasActivated : [];
    const chipsText = (topToday || []).map((t: any) => `${t?.category ?? ""} ${t?.transitPlanet ?? ""}`.toLowerCase());

    const scored = areas.map((a: any) => {
      const area = String(a?.area ?? "Focus").trim();
      const why = String(a?.why ?? "").trim();
      let score = 6.2;

      const key = area.toLowerCase();
      if (key.includes("work") || key.includes("routine") || key.includes("health")) score += 1.2;
      if (key.includes("career") || key.includes("status")) score += 0.8;
      if (chipsText.some((s) => s.includes(key))) score += 0.8;

      return { area, why, score: Math.max(4.5, Math.min(9.7, score)) };
    });

    scored.sort((x: any, y: any) => y.score - x.score);
    return scored.slice(0, 5);
  }
  function attachProbabilities(likely: string[], areas: any[]) {
    const keys = (areas || []).map((a: any) => String(a?.area ?? "").toLowerCase()).join(" ");
    return (likely || []).slice(0, 8).map((s) => {
      const t = String(s).toLowerCase();
      let p = 0.52;
      if (t.includes("work") || t.includes("schedule") || t.includes("routine")) p += 0.12;
      if (t.includes("health") || t.includes("exercise")) p += 0.10;
      if (t.includes("conflict") || t.includes("misunderstanding")) p -= 0.08;
      if (keys && keys.includes("work") && (t.includes("team") || t.includes("project"))) p += 0.08;
      p = Math.max(0.28, Math.min(0.78, p));
      return { text: s, p: Math.round(p * 100) };
    }).sort((a,b)=>b.p-a.p);
  }
  function buildDecisionGPS(buckets: any) {
    return [
      { k: "Money", v: "Safe if you verify. Keep it simple, avoid impulsive spends." },
      { k: "Work", v: buckets?.supportive?.[0] || "Finish one task fully before starting another." },
      { k: "Conflict", v: buckets?.avoid?.[0] || "Delay reactions. Respond after calm." },
      { k: "New ideas", v: "Explore, don’t commit immediately. Validate with one small test." },
      { k: "Health", v: "Small consistent routines beat intense resets." },
    ];
  }
  const fmtRangeLite = (t: any) => {
    const a = String(t?.fromISO ?? t?.from ?? "").trim();
    const b = String(t?.toISO ?? t?.to ?? "").trim();
    if (a && b) return `${a}–${b}`;
    return a || b || "";
  };
  // ---------- PREMIUM PREDICTIVE ENGINE ----------
  function buildPredictiveLayer({
    topToday,
    asc,
    moon,
    md,
    ad,
  }: any) {
    const planetNames = (topToday || []).map((t: any) =>
      String(t?.transitPlanet || "").toLowerCase()
    );

    const hasMars = planetNames.includes("mars");
    const hasSaturn = planetNames.includes("saturn");
    const hasRahu = planetNames.includes("rahu");
    const hasVenus = planetNames.includes("venus");

    // TODAY EVENTS
    const todayEvents: string[] = [];

    if (hasMars || hasRahu) {
      todayEvents.push(
        "An urgent task, message, or demand may require quick response."
      );
      todayEvents.push(
        "Someone may expect clarity or a decision sooner than planned."
      );
    }

    if (hasSaturn) {
      todayEvents.push(
        "A responsibility or delay forces you to slow down and correct something."
      );
    }

    if (hasVenus) {
      todayEvents.push(
        "A relationship or money-related conversation may surface."
      );
    }

    // WEEK EVENTS
    const weekEvents: string[] = [
      "Something unfinished reaches a decision point.",
      "A conversation changes the direction of a situation.",
      "You may reconsider a commitment or responsibility.",
    ];

    if (ad === "Venus") {
      weekEvents.push(
        "A new collaboration, financial idea, or relationship focus begins forming."
      );
    }

    // 4–6 WEEK EVENTS
    const phaseEvents: string[] = [
      "A direction shift becomes clearer.",
      "One priority replaces several scattered efforts.",
      "A decision you postpone now will return stronger.",
    ];

    if (ad === "Venus") {
      phaseEvents.push(
        "Connections, finances, and stability themes strengthen."
      );
    }

    // DECISIONS
    const keyDecisions: string[] = [
      "Where must you commit fully instead of staying half-in?",
      "What needs to be closed so the next phase can begin?",
      "Which relationship or project deserves real energy?",
    ];

    return {
      todayEvents,
      weekEvents,
      phaseEvents,
      keyDecisions,
    };
  }
// ---------------- PAID / FULL: PREMIUM ENGINE (single clean block) ----------------

type PaidPrediction = {
  area: "career" | "money" | "relationships" | "health";
  event: string;                 // ✅ 1-line event prediction (headline)
  windowISO: { from: string; to: string };
  confidence: number;            // 0..100

  sign: string;                  // ✅ what you'll NOTICE (very concrete)
  do: string;                    // ✅ what to DO (specific)
  avoid?: string;                // ✅ what to AVOID (optional but powerful)

  consequence?: string;          // ✅ handled well vs poorly
  why?: string;                  // optional
  text?: string;                 // backward-compat (optional)
  trigger?: string;              // backward-compat (optional)
  action?: string;               // backward-compat (optional)
};
type PhaseBrief = {
  diagnosis: string;
  why: string[];
  moves: string[];
  traps: string[];
  outcome: string;
  confidence: number;
};

type PaidOutput = {
  theme: string;
  themeDrivers: string[];

  // optional premium memo blocks (nice for users)
  opportunity?: string;
  risk?: string;
  controlLever?: string;
  nonNegotiable?: string;

  phaseBrief?: PhaseBrief;

  predictions14d: PaidPrediction[];
  predictions30d: PaidPrediction[];
  predictions60d: PaidPrediction[];
  predictions90d: PaidPrediction[];

  keyWindows12m: PaidPrediction[];
};

function clampPct(n: number) {
  return Math.max(35, Math.min(92, Math.round(n)));
}

function getNowFacts(report: any): string[] {
  return Array.isArray(report?.transitNowFacts) ? report.transitNowFacts : [];
}

function pickTopWindows(report: any) {
  const arr = Array.isArray(report?.topTransits)
    ? report.topTransits
    : Array.isArray(report?.transits)
    ? report.transits
    : [];
  return arr
    .slice()
    .sort((a: any, b: any) => (b?.strength ?? 0) - (a?.strength ?? 0))
    .slice(0, 12);
}

function findWindow(report: any, predicate: (t: any) => boolean) {
  const list = pickTopWindows(report);
  return list.find(predicate) ?? null;
}

export function buildPaidOutput(report: any): PaidOutput {
  const facts = getNowFacts(report);

  // --- helpers ---
  const todayISO =
    String(report?.meta?.todayISO || report?.todayISO || "").slice(0, 10) ||
    new Date().toISOString().slice(0, 10);

  const addDaysISO = (iso: string, days: number) => {
    const d = new Date(iso + "T00:00:00.000Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const makeWin = (days: number) => ({ from: todayISO, to: addDaysISO(todayISO, days) });

  const iso10 = (v: any) => String(v ?? "").slice(0, 10);
  const toWin = (w: any, fallbackDays: number) => {
    if (!w) return makeWin(fallbackDays);
    const from = iso10(w?.startISO ?? w?.from ?? w?.windowISO?.from);
    const to = iso10(w?.endISO ?? w?.to ?? w?.windowISO?.to);
    if (from && to) return { from, to };
    return makeWin(fallbackDays);
  };

  // --- evidence flags from facts (be generous: facts vary) ---
  const hasH6 = facts.some((s) => /H\s*6/i.test(String(s)) || /6th house/i.test(String(s)));
  const hasJup10 = facts.some(
    (s) => /Jupiter/i.test(String(s)) && (/H\s*10/i.test(String(s)) || /10th house/i.test(String(s)))
  );
  const hasSat7 = facts.some(
    (s) => /Saturn/i.test(String(s)) && (/H\s*7/i.test(String(s)) || /7th house/i.test(String(s)))
  );

  const themeDrivers: string[] = [];
  if (hasH6) themeDrivers.push("H6 active: work/routines/health cleanup.");
  if (hasJup10) themeDrivers.push("Jupiter H10: visibility via output.");
  if (hasSat7) themeDrivers.push("Saturn H7: partnership terms + boundaries.");
  if (!themeDrivers.length) themeDrivers.push("Primary lever: consistency + clean communication.");

  // --- theme (less generic) ---
  const themeParts = [
    hasH6 ? "Operational pressure increases; precision matters." : "",
    hasJup10 ? "Career visibility opens if output is clean." : "",
    hasSat7 ? "Partnership terms require clarity and boundaries." : "",
  ].filter(Boolean);

  const theme = themeParts.length
    ? themeParts.join(" ")
    : "Execution + structural clarity dominate this cycle.";

  // --- windows from computed transit hits ---
  const winVenusRahu = findWindow(
    report,
    (t) => (t?.planet === "Venus" || t?.transitPlanet === "Venus") && /natal Rahu/i.test(String(t?.target ?? t?.natalPoint ?? ""))
  );
  const winMarsRahu = findWindow(
    report,
    (t) => (t?.planet === "Mars" || t?.transitPlanet === "Mars") && /natal Rahu/i.test(String(t?.target ?? t?.natalPoint ?? ""))
  );
  const winVenusMars = findWindow(
    report,
    (t) => (t?.planet === "Venus" || t?.transitPlanet === "Venus") && /natal Mars/i.test(String(t?.target ?? t?.natalPoint ?? ""))
  );
  const winSunSun = findWindow(
    report,
    (t) => (t?.planet === "Sun" || t?.transitPlanet === "Sun") && /natal Sun/i.test(String(t?.target ?? t?.natalPoint ?? ""))
  );

  const w14 = makeWin(14);
  const w30 = makeWin(30);
  const w60 = makeWin(60);
  const w90 = makeWin(90);

  const evidenceScore =
    themeDrivers.length +
    (winSunSun ? 1 : 0) +
    (winMarsRahu ? 1 : 0) +
    (winVenusRahu ? 1 : 0);

  const baseConf = clampPct(50 + evidenceScore * 6);

  // --- why line shown inside each prediction card ---
  const whyLine = (area: string) => {
  const parts: string[] = [];

  // Dasha (short)
  const md = String(report?.activePeriods?.mahadasha?.lord ?? "").trim();
  const ad = String(report?.activePeriods?.antardasha?.subLord ?? "").trim();
  const pd = String(report?.activePeriods?.pratyantardasha?.lord ?? "").trim();
  if (md) parts.push(`Dasha: ${md}${ad ? `–${ad}` : ""}${pd ? `–${pd}` : ""}`);

  // Core signals
  if (hasH6) parts.push("H6 pressure (work/routine/health cleanup)");
  if (hasJup10) parts.push("H10 support (visibility via output)");
  if (hasSat7) parts.push("H7 weight (terms/boundaries)");

  // Transit anchors (use what actually exists in report windows)
  const labelWin = (w: any, name: string) => {
    if (!w) return "";
    const f = String(w?.startISO ?? w?.from ?? w?.windowISO?.from ?? "").slice(0, 10);
    const t = String(w?.endISO ?? w?.to ?? w?.windowISO?.to ?? "").slice(0, 10);
    const rng = f && t ? ` ${f}→${t}` : "";
    return `${name}${rng}`.trim();
  };

  if (area === "career") {
    const a = labelWin(winSunSun, "Sun spotlight");
    const b = labelWin(winMarsRahu, "Mars pressure");
    if (a) parts.push(a);
    else if (b) parts.push(b);
  }

  if (area === "relationships") {
    const a = labelWin(winVenusRahu, "Venus–Rahu terms");
    const b = labelWin(winVenusMars, "Venus–Mars charge");
    if (a) parts.push(a);
    else if (b) parts.push(b);
  }

  // Keep tight
  return parts.slice(0, 3).join(" • ");
};
  // --- WHY bullets for phaseBrief ---
  const whyBullets: string[] = [];
  const md0 = String(report?.activePeriods?.mahadasha?.lord ?? "").trim();
  const ad0 = String(report?.activePeriods?.antardasha?.subLord ?? "").trim();
  const pd0 = String(report?.activePeriods?.pratyantardasha?.lord ?? "").trim();
  if (md0) whyBullets.push(`Dasha: ${md0}${ad0 ? `–${ad0}` : ""}${pd0 ? `–${pd0}` : ""}`);
  if (hasH6) whyBullets.push("Signal: 6th-house pressure → routines/workload/cleanup/health discipline.");
  if (hasJup10) whyBullets.push("Signal: 10th-house support → visibility if output is measurable.");
  if (hasSat7) whyBullets.push("Signal: 7th-house weight → relationships/partnership terms need clarity.");
  if (winSunSun) whyBullets.push("Timing: Sun activation → spotlight/authority window.");
  if (winVenusRahu) whyBullets.push("Timing: Venus–Rahu → attachment/terms get activated.");
  if (winMarsRahu) whyBullets.push("Timing: Mars–Rahu → urgency spike; avoid overcommitment.");

  // ---------------- Predictions (your deeper versions) ----------------

  const predictions14d: PaidPrediction[] = [
    {
  area: "career",
  event: "A finished task comes back for correction (precision test).",
  text: "This is a credibility moment: you either close the loop cleanly or you get stuck in rework cycles.",
  windowISO: w14,
  confidence: clampPct(baseConf + (hasH6 ? 8 : 0)),
  sign: "You hear: “Please resend with X / attach Y / adjust the numbers / align to the template.”",
  do: "Send ONE final version: (1) what changed, (2) the decision you need, (3) deadline. Put scope in writing.",
  avoid: "Avoid multiple partial revisions and vague ‘okay I’ll see’ replies.",
  consequence: "Handled cleanly → credibility rises. Delayed/messy → you become the fallback fixer.",
  why: whyLine("career"),
},
   {
  area: "health",
  event: "Energy dips if routine slips (sleep + digestion sensitivity).",
  text:
    "This is a short window where routine has outsized impact: small discipline gives a big payoff, but small chaos shows fast.",
  windowISO: w14,
  confidence: clampPct(baseConf - 4 + (hasH6 ? 6 : 0)),
  why: whyLine("health"),
  sign: "Heavier mornings, caffeine reliance, short temper, constipation/bloating.",
  do: "10-day stabilizer: fixed sleep/wake, lighter dinner, 20–30 min walk daily. Keep workouts moderate.",
  avoid: "Avoid late dinners, heavy fried food, and late-night screen time (they trigger the spiral).",
  consequence:
    "Handled well → stable energy and clearer mood. Ignored → fatigue/irritation builds and productivity drops.",
},
  ];

  const predictions30d: PaidPrediction[] = [
  {
    area: "relationships",
    event: "A clarity conversation happens (expectation / availability / commitment).",
    text:
      "Avoiding it turns into passive tension. Handling it directly stabilizes the dynamic quickly.",
    windowISO: w30,
    confidence: clampPct(baseConf + (hasSat7 ? 10 : 0)),
    why: whyLine("relationships"),
    sign:
      "Delayed replies, mixed signals, repeated misunderstandings, or a direct “Where is this going?” question.",
    do:
      "Send 3 lines: (1) what you want, (2) what you can commit to, (3) next step + date/time.",
    avoid: "Avoid late-night emotional debates and half-commitments.",
    consequence:
      "Handled well → stability and respect increases. Avoided → tension grows and boundaries harden.",
  },
  {
    area: "career",
    event: "Work becomes process ownership (cleanup + coordination = your value).",
    text:
      "Recognition comes if you standardize and document. Otherwise it becomes invisible labor and repeated rework.",
    windowISO: w30,
    confidence: clampPct(baseConf + (hasJup10 ? 6 : 0) + (hasH6 ? 6 : 0)),
    why: whyLine("career"),
    sign:
      "More dependencies/follow-ups; “Can you align/track/coordinate this?” requests increase.",
    do:
      "Create ONE standard: template + checklist + owner. Put scope in writing. Track outcomes (rework reduced, turnaround improved).",
    avoid: "Avoid saying yes without scope/authority/deadline — that creates unpaid pressure.",
    consequence:
      "Handled well → visible credibility + scope upgrade. Handled poorly → you become the default fixer without credit.",
  },
];
  const predictions60d: PaidPrediction[] = [
  {
    area: "money",
    event: "A ‘useful upgrade’ purchase temptation appears (recurring leak risk).",
    text:
      "This is a discipline test: the wrong purchase becomes a quiet monthly drain; the right one reduces friction and saves time.",
    windowISO: w60,
    confidence: clampPct(baseConf - 6),
    why: whyLine("money"),
    sign: "You justify it as “This will save time” or “This is a quality upgrade.”",
    do:
      "48-hour rule + friction test: buy ONLY if it removes daily repeat hassle or increases output measurably.",
    avoid: "Avoid subscriptions/add-ons that feel small but stack monthly.",
    consequence:
      "Handled well → spending stays controlled and clean. Impulsive → recurring leak that annoys you later.",
  },
  {
    area: "career",
    event: "A pivot/leadership ask appears (scope expansion).",
    text:
      "If you don’t define authority and success metrics, it turns into unpaid extra work. If you define it, it becomes a real trajectory shift.",
    windowISO: toWin(winMarsRahu, 60),
    confidence: clampPct(baseConf + (winMarsRahu ? 6 : 0)),
    why: whyLine("career"),
    sign: "You hear: “Can you lead this / own this / present this / be point person?”",
    do:
      "Reply with conditions: scope + authority + success metric + timeline. Ship 1 tangible artifact in 7–10 days to lock credibility.",
    avoid: "Avoid taking responsibility without decision power (that creates burnout + blame).",
    consequence:
      "Handled well → real authority/visibility. Handled poorly → pressure rises without reward.",
  },
];

  const predictions90d: PaidPrediction[] = [
  {
    area: "career",
    event: "90-day outcome: recognition OR invisible workload — depends on proof + asking.",
    text:
      "You’ll be noticed for fixing recurring problems and delivering clean work. This becomes a recognition moment only if you bring proof and ask for scope/authority.",
    windowISO: toWin(winSunSun, 90),
    confidence: clampPct(baseConf + 10),
    why: whyLine("career"),
    sign: "A review, presentation, or stakeholder references your work directly.",
    do: "Bring proof: before/after results + 2–3 metrics. Ask explicitly for expanded scope/authority.",
    avoid: "Avoid hinting. Say it directly: scope, title, ownership, next level.",
    consequence:
      "Handled well → promotion-like scope upgrade. Avoided → you keep doing high-value work without credit.",
  },
  {
    area: "relationships",
    event: "90-day outcome: terms get defined (commitment OR boundary).",
    text:
      "Stability arrives once mixed signals stop. The relationship becomes clearer — either closer commitment or cleaner distance.",
    windowISO: toWin(winVenusRahu, 90),
    confidence: clampPct(baseConf - 2 + (hasSat7 ? 10 : 0) + (winVenusRahu ? 4 : 0)),
    why: whyLine("relationships"),
    sign: "Renegotiation talk, proposal-like conversation, or friction around expectations.",
    do: "Choose one path and state it early. If yes → define cadence. If no → define distance.",
    avoid: "Avoid keeping it half-open (it creates resentment).",
    consequence:
      "Handled well → stability and peace. Avoided → repeated friction and emotional drain.",
  },
  {
    area: "health",
    event: "90-day outcome: routine decides energy (boring habits beat bursts).",
    text:
      "Consistency stabilizes energy; chaos creates dips. This cycle rewards prevention more than recovery.",
    windowISO: w90,
    confidence: clampPct(baseConf - 4 + (hasH6 ? 6 : 0)),
    why: whyLine("health"),
    sign: "Workload stacks + late nights → fatigue spiral; digestion and mood follow.",
    do: "Non-negotiables: sleep window + lighter dinners + daily movement. Track sleep/energy/digestion weekly.",
    avoid: "Avoid extreme workouts or extreme dieting — they backfire under workload.",
    consequence:
      "Handled well → stable energy and better focus. Ignored → repeated dips and irritability.",
  },
  {
    area: "money",
    event: "90-day outcome: stable money if verified + boring; risk is quiet leaks.",
    text:
      "Risk comes from small recurring charges and ‘quick fix’ purchases. Your win is clean spending rules and monthly audits.",
    windowISO: w90,
    confidence: clampPct(baseConf - 10),
    why: whyLine("money"),
    sign: "Subscriptions/add-ons and small convenience spends quietly stack.",
    do: "Monthly audit: cancel 2 leaks, cap impulse buys, allow only 1 upgrade that truly saves time/output.",
    avoid: "Avoid stacking subscriptions and paying for ‘nice-to-have’ tools during a busy phase.",
    consequence:
      "Handled well → savings feel effortless. Ignored → money feels ‘leaky’ and annoying.",
  },
];
  // --- de-dupe (optional) ---
  const uniq = (arr: PaidPrediction[]) => {
    const seen = new Set<string>();
    return arr.filter((p) => {
      const key = `${p.area}|${String(p.text ?? "").slice(0, 90)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const p14 = uniq(predictions14d);
  const p30 = uniq(predictions30d);
  const p60 = uniq(predictions60d);
  const p90 = uniq(predictions90d);

  // --- phaseBrief built AFTER predictions exist (prevents all red-line errors) ---
  const topByArea = (arr: PaidPrediction[], area: string) =>
    arr.find((p) => String(p?.area ?? "").toLowerCase() === area.toLowerCase()) ?? null;

  const topCareer = topByArea(p30, "career") || topByArea(p14, "career") || topByArea(p90, "career");
  const topRel = topByArea(p30, "relationships") || topByArea(p14, "relationships") || topByArea(p90, "relationships");
  const topHealth = topByArea(p14, "health") || topByArea(p30, "health") || topByArea(p90, "health");
  const topMoney = topByArea(p60, "money") || topByArea(p90, "money");

  const dashaLine =
    md0 ? `${md0}${ad0 ? `–${ad0}` : ""}${pd0 ? `–${pd0}` : ""}` : "";

  const diagnosis =
    `${dashaLine ? `Dasha running: ${dashaLine}. ` : ""}` +
    `${topCareer?.text ? `Career: ${String(topCareer.text)} ` : ""}` +
    `${topRel?.text ? `Relationships: ${String(topRel.text)} ` : ""}` +
    `${topHealth?.text ? `Health: ${String(topHealth.text)} ` : ""}` +
    `${topMoney?.text ? `Money: ${String(topMoney.text)}` : ""}`;

  const moves = [
    topCareer?.action ? `Career move: ${String(topCareer.action)}` : "",
    topRel?.action ? `Relationship move: ${String(topRel.action)}` : "",
    topHealth?.action ? `Health move: ${String(topHealth.action)}` : "",
    topMoney?.action ? `Money move: ${String(topMoney.action)}` : "",
  ].filter(Boolean).slice(0, 3);

  const traps = [
    topCareer?.trigger ? `Career trap: ${String(topCareer.trigger)}` : "",
    topRel?.trigger ? `Relationship trap: ${String(topRel.trigger)}` : "",
    topHealth?.trigger ? `Health trap: ${String(topHealth.trigger)}` : "",
    topMoney?.trigger ? `Money trap: ${String(topMoney.trigger)}` : "",
  ].filter(Boolean).slice(0, 3);

  const outCareer = topByArea(p90, "career");
  const outRel = topByArea(p90, "relationships");
  const outHealth = topByArea(p90, "health");
  const outMoney = topByArea(p90, "money");

  const outcome =
    `If you execute cleanly, your 90-day outcome looks like: ` +
    `${outCareer?.text ? `Career: ${String(outCareer.text)} ` : ""}` +
    `${outRel?.text ? `Relationships: ${String(outRel.text)} ` : ""}` +
    `${outHealth?.text ? `Health: ${String(outHealth.text)} ` : ""}` +
    `${outMoney?.text ? `Money: ${String(outMoney.text)}` : ""}`;

  const phaseBrief: PhaseBrief = {
    diagnosis,
    why: whyBullets.slice(0, 5),
    moves,
    traps,
    outcome,
    confidence: baseConf,
  };

  // --- premium memo blocks ---
  const opportunity = [
    hasJup10 ? "Visibility increases when output is measurable (deliverable + metric + outcome)." : "",
    winSunSun ? "Use Sun window for recognition/authority conversations." : "",
    hasH6 ? "Cleanup becomes a signature win if you standardize + document." : "",
  ].filter(Boolean).join(" ");

  const risk = [
    hasH6 ? "Rework + routine chaos → fatigue and lower precision." : "",
    hasSat7 ? "Unclear expectations → relationship/partnership friction." : "",
    winVenusMars ? "Higher charge: chemistry and conflict rise together if ego triggers." : "",
    winMarsRahu ? "Overcommitment risk: scope without authority becomes pressure." : "",
  ].filter(Boolean).join(" ");
  const opportunitySafe = opportunity || "Opportunity: build a visible win by standardizing one process and documenting outcomes.";
const riskSafe = risk || "Risk: rework + unclear terms drains energy and creates friction if you don’t set scope and boundaries.";
  const controlLever = hasH6
    ? "Consistency + precision: one clean system (template/checklist) + stable routine for 10 days."
    : "Clarity + follow-through: one decision, one message, one closure loop per day.";

  const nonNegotiable = [
    "No vague commitments (always define scope + deadline).",
    "No late-night conflict conversations.",
    hasH6 ? "No sleep chaos for 10 days." : "",
  ].filter(Boolean).join(" ");

// --- 12m key windows ---
const keyWindows12m: PaidPrediction[] = [];

if (winVenusRahu) {
  keyWindows12m.push({
    area: "relationships",
    event: "12-month turning point: relationship terms / alignment shifts.",
    text: "Partnership turning point: alignment opportunity OR a clean renegotiation.",
    windowISO: toWin(winVenusRahu, 90),
    confidence: clampPct(78),
    why: whyLine("relationships"),
    sign: "Reconnect / proposal-like talk / terms change / boundary conversation.",
    do: "State intentions early. Choose one path. Put expectations + cadence in writing if needed.",
    avoid: "Avoid keeping it half-open or sending mixed signals.",
    consequence: "Handled well → stability and clarity. Avoided → repeated friction and emotional drain.",
  });
}

if (winMarsRahu) {
  keyWindows12m.push({
    area: "career",
    event: "12-month spike window: leadership ask / scope expansion appears.",
    text: "Career spike: one decisive action changes trajectory (scope/visibility).",
    windowISO: toWin(winMarsRahu, 90),
    confidence: clampPct(82),
    why: whyLine("career"),
    sign: "New responsibility, bold opportunity, or pressure to lead / deliver fast.",
    do: "Ask for scope + authority + success metric. Ship 1 tangible artifact quickly to lock credibility.",
    avoid: "Avoid accepting responsibility without decision power (unpaid pressure trap).",
    consequence: "Handled well → real trajectory shift. Handled poorly → burnout + blame without reward.",
  });
}

if (winVenusMars) {
  keyWindows12m.push({
    area: "relationships",
    event: "12-month high-intensity window: chemistry + ego both rise.",
    text: "High intensity: chemistry rises; conflict risk rises if ego triggers.",
    windowISO: toWin(winVenusMars, 90),
    confidence: clampPct(74),
    why: whyLine("relationships"),
    sign: "Strong pull + strong reactions; quick escalation; blame loops.",
    do: "Keep discussions factual. Choose calm timing. De-escalate fast when tone rises.",
    avoid: "Avoid late-night emotional debates and ego-driven ultimatums.",
    consequence: "Handled well → passion with control. Ignored → avoidable fights and distance.",
  });
}

if (winSunSun) {
  keyWindows12m.push({
    area: "career",
    event: "12-month spotlight window: recognition / leadership conversation opens.",
    text: "Spotlight: recognition/leadership conversation if credibility is built.",
    windowISO: toWin(winSunSun, 90),
    confidence: clampPct(76),
    why: whyLine("career"),
    sign: "Promotion-like chat, visibility role, leadership ask, or stakeholder praise.",
    do: "Bring deliverables + numbers. Ask explicitly for the next level (scope/title/ownership).",
    avoid: "Avoid hinting or waiting for others to notice. Make the ask direct.",
    consequence: "Handled well → recognition/scope upgrade. Avoided → you do the work but stay undervalued.",
  });
}
  return {
    theme,
    themeDrivers,
    opportunity: opportunitySafe,
    risk: riskSafe,
    controlLever,
    nonNegotiable,
    phaseBrief,
    predictions14d: p14,
    predictions30d: p30,
    predictions60d: p60,
    predictions90d: p90,
    keyWindows12m,
  };
}
  // local safe string helper (keep near buildPredictiveLayerV2)
  const clean = (v: any) => String(v ?? "").trim();

  type ScenarioLite = { text: string; prob?: number };
  type PriorityLite = { label: string; house?: string; score?: number };
  type MoonWinLite = { dateISO: string; label: string };


  export function buildPredictiveLayerV2(args: {
    strongTransits?: StrongTransitLite[];
    priorities?: PriorityLite[];
    scenarios?: ScenarioLite[];
    moonWindows?: MoonWinLite[];
    md?: string;
    ad?: string;
  }) {
    const strong = (args.strongTransits || []).slice(0, 4);
    const pr = (args.priorities || []).slice(0, 3);
    const sc = (args.scenarios || []).slice(0, 5);
    const mw = (args.moonWindows || []).slice(0, 3);

    const topPriority = pr[0]?.label ? clean(pr[0].label) : "one core priority";
    const topTransit = strong[0]?.category ? clean(String(strong[0].category)) : "general";

    const todayEvents: string[] = [];
    sc.slice(0, 3).forEach((s) => {
      const p = typeof s.prob === "number" ? ` (${Math.round(s.prob)}%)` : "";
      const tx = clean(s.text);
      if (tx) todayEvents.push(`${tx}${p}`);
    });
    if (mw[0]?.dateISO && mw[0]?.label) {
      todayEvents.push(`Mood/tone shift near ${mw[0].dateISO}: ${mw[0].label}.`);
    }


  const weekEvents: string[] = [];
  strong.forEach((t: any) => {
    const cat = clean(String(t?.category ?? ""));
    const pl = clean(String(t?.transitPlanet ?? t?.label ?? ""));
    const r = fmtRangeLite(t);
      if (cat && pl) weekEvents.push(`${cat} theme strengthens via ${pl}${r ? ` (${r})` : ""}.`);
    });
    if (topPriority) weekEvents.push(`Your week concentrates around: ${topPriority}.`);

    const phaseEvents: string[] = [];
    if (strong[0]) phaseEvents.push(`Main lever this month: ${clean(String(strong[0].category || "progress"))} — keep it consistent.`);
    if (args.md && args.ad) phaseEvents.push(`Cycle context: ${args.md} MD + ${args.ad} AD — simplify noise, then commit cleanly.`);
    if (pr[1]?.label) phaseEvents.push(`Secondary lever: ${clean(pr[1].label)} — make one improvement and lock it.`);

    const keyDecisions: string[] = [
      `What is the ONE system/routine you will standardize this week to support ${topPriority}?`,
      `Which conversation needs to happen inside the ${topTransit} theme (clarify expectations, reduce ambiguity) — and by what date?`,
      `What will you stop doing (one distraction / one low-value commitment) so results can compound?`,
    ];

    return { todayEvents, weekEvents, phaseEvents, keyDecisions };
  }

  // ---------- Transit helpers (Advanced tab) ----------
  const isoDay = (d: Date) => d.toISOString().slice(0, 10);


  const TabAdvanced: React.FC<{
    report: LifeReportView | null;
    mounted: boolean;
    isFull: boolean;                 // acts like canSeeFull
    onUnlockFull?: () => void;       // ✅ ADD THIS
    timelineSummary?: string | null;
    dashaTransitSummary?: string | null;
    transits?: TransitHit[];
    transitNow?: any[];
    dailyHighlights?: DailyHighlight[];
    dailyLoading?: boolean;
    dailyError?: string | null;

  }> = ({
    report,
    mounted,
    isFull,
    onUnlockFull,                    // ✅ ADD THIS
    timelineSummary,
    dashaTransitSummary,
    transits,
    transitNow,
    dailyHighlights,
    dailyLoading,
    dailyError,
  }) => {

    // --- Transits source of truth (prefer prop; fallback to report) ---
  const hits: TransitHit[] = Array.isArray(transits)
    ? transits
    : Array.isArray((report as any)?.transits)
    ? ((report as any).transits as TransitHit[])
    : [];

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Loading Full Guidance…
      </div>
    );
  }

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

  // For today - next 2 weeks chips
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

  const r: any = report;
    // ---------- Helpers (keep lightweight + safe) ----------
  const safe = (v: any, fallback = "") =>
    String(v ?? "")
      .replace(/\u0000/g, "")
      .replace(/\s+/g, " ")
      .trim() || fallback;

  const titleCase = (s: string) =>
    safe(s) ? safe(s).charAt(0).toUpperCase() + safe(s).slice(1) : "";

  // ✅ NOW define activePlanet (safe exists)
  const activePlanet = safe(r?.activePlanet ?? r?.now?.activePlanet ?? "", "");

  // Debug anchors (safe)
  console.log("[ADV][anchors]", {
    ascSign: r?.ascSign,
    coreAsc: r?.core?.ascSign,
    moonSign: r?.moonSign,
    coreMoon: r?.core?.moonSign,
    moonHouse: r?.core?.moonHouse,
    dasha: r?.dasha,
    activeDasha: r?.activeDasha,
    now: r?.now,
    activePlanet: r?.activePlanet,
  });

  // Existing builders (keep)
  const why = buildWhyBullets_X(r);
  const operatingMode = buildOperatingMode_X(r);
  const buckets0 = buildDecisionBuckets(r);
  const buckets = trimPlaybook_X(buckets0);
  const rules = buildRules_X(r);
  const takeaway = buildTakeawayLine_X(r);

  // Pull a few real anchors from report if present (non-breaking if missing)
  const asc = safe(r?.ascSign ?? r?.core?.ascSign ?? "", "");

  /* -----------------------------
    A) Moon fallbacks (robust)
  -------------------------------- */
  const moonP = getP_X(r, "Moon"); // expects report.planets[]
  const moon = safe(r?.moonSign ?? r?.core?.moonSign ?? moonP?.sign ?? "", "");

  const moonHouseRaw =
    r?.core?.moonHouse ??
    r?.moonHouse ??
    moonP?.house ??
    null;

  const moonHouse: number | null =
    typeof moonHouseRaw === "number"
      ? moonHouseRaw
      : typeof moonHouseRaw === "string" && /^\d+$/.test(moonHouseRaw)
      ? Number(moonHouseRaw)
      : null;

  /* -----------------------------
    B) Tiny local types/helpers
  -------------------------------- */
  type TimingLocal = { windows: any[]; cautions: string[] };



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

  /* -----------------------------
    C) Dasha (declare BEFORE predictive)
  -------------------------------- */
  const md = safe(r?.dasha?.md?.planet ?? r?.activeDasha?.md ?? "", "");
  const ad = safe(r?.dasha?.ad?.planet ?? r?.activeDasha?.ad ?? "", "");

  /* -----------------------------
    D) Safe local aliases (never crash)
  -------------------------------- */
  const strongTransitsLocal = Array.isArray(r?.now?.strongTransits)
    ? r.now.strongTransits
    : Array.isArray(r?.strongTransits)
    ? r.strongTransits
    : Array.isArray(r?.transits)
    ? r.transits
    : [];

  const priorityRowsLocal = Array.isArray(r?.now?.priorityRows)
    ? r.now.priorityRows
    : Array.isArray(r?.priorityRows)
    ? r.priorityRows
    : Array.isArray(r?.priorities)
    ? r.priorities
    : [];

  const likelyScenariosLocal = Array.isArray(r?.now?.likelyScenarios)
    ? r.now.likelyScenarios
    : Array.isArray(r?.likelyScenarios)
    ? r.likelyScenarios
    : Array.isArray(r?.scenarios)
    ? r.scenarios
    : [];

  const timingLocal: TimingLocal =
    (r?.timing as TimingLocal) ??
    (r?.fullPlan?.timing as TimingLocal) ??
    ({ windows: [], cautions: [] } as TimingLocal);

  /* -----------------------------
    E) Predictive layer (V2) — safe fallback
  -------------------------------- */
  const predictive =
    (typeof (globalThis as any)?.buildPredictiveLayerV2 === "function"
      ? (buildPredictiveLayerV2 as any)({
          strongTransits: strongTransitsLocal.map((t: any) => ({
            transitPlanet: String(t?.transitPlanet ?? t?.planet ?? ""),
            category: String(t?.category ?? "general"),
            fromISO: String(t?.fromISO ?? t?.from ?? ""),
            toISO: String(t?.toISO ?? t?.to ?? ""),
            label: String(t?.label ?? t?.title ?? ""),
          })),

          priorities: priorityRowsLocal.map((p: any) => ({
            label: String(p?.label ?? p?.title ?? ""),
            house:
              typeof p?.house === "number" ? p.house : Number(p?.house) || null,
            score:
              typeof p?.score === "number" ? p.score : Number(p?.score) || 0,
          })),

          scenarios: likelyScenariosLocal.map((s: any) => ({
            text: String(s?.text ?? s?.label ?? s ?? ""),
            prob:
              typeof s?.probability === "number"
                ? s.probability
                : typeof s?.prob === "number"
                ? s.prob
                : Number(s?.probability ?? s?.prob) || 0,
          })),

          moonWindows: Array.isArray(timingLocal?.windows)
            ? timingLocal.windows
                .filter((w: any) =>
                  /moon/i.test(String(w?.label ?? w?.key ?? ""))
                )
                .slice(0, 3)
                .map((w: any) => ({
                  dateISO: String(w?.dateISO ?? w?.key ?? ""),
                  label: String(w?.label ?? "Moon shift"),
                }))
            : [],

          md,
          ad,
        })
      : null) || {
      todayEvents: [],
      weekEvents: [],
      phaseEvents: [],
      keyDecisions: [],
    };

  /* -----------------------------
    F) Curated lists (caps)
  -------------------------------- */
  const todayList = (predictive?.todayEvents ?? []).filter(Boolean).slice(0, 5);
  const weekList = (predictive?.weekEvents ?? []).filter(Boolean).slice(0, 5);
  const phaseList = (predictive?.phaseEvents ?? []).filter(Boolean).slice(0, 5);
  const decisionsList = (predictive?.keyDecisions ?? [])
    .filter(Boolean)
    .slice(0, 5);

  /* -----------------------------
    G) Drivers (anchored)
  -------------------------------- */
  const topPriorityLabel = String(priorityRowsLocal?.[0]?.label ?? "").trim();

  const topTransit = strongTransitsLocal?.[0] ?? null;
  const topTransitLabel = String(topTransit?.label ?? topTransit?.title ?? "").trim();
  const topTransitRange = topTransit ? fmtRangeLite(topTransit) : "";

  const topMoonWindow = Array.isArray(timingLocal?.windows)
    ? timingLocal.windows.find((w: any) => /moon/i.test(String(w?.label ?? "")))
    : null;

  const topMoonWindowLabel = String(topMoonWindow?.label ?? "").trim();

  const driversToday: string[] = [
    topPriorityLabel ? `Priority: ${topPriorityLabel}` : "",
    topTransitLabel
      ? `Main transit: ${topTransitLabel}${topTransitRange ? ` (${topTransitRange})` : ""}`
      : "",
    topMoonWindowLabel ? `Moon trigger: ${topMoonWindowLabel}` : "",
  ].filter(Boolean).slice(0, 3);

  /* -----------------------------
    H) Timing windows for UI (always usable)
  -------------------------------- */
  const timingWindowsForUI =
    Array.isArray(timingLocal?.windows) && timingLocal.windows.length
      ? timingLocal.windows.slice(0, 3).map((w: any, i: number) => ({
          key: String(w?.key ?? w?.label ?? i),
          label: String(w?.label ?? "Window"),
          bestFor: String(w?.bestFor ?? ""),
          oneAction: String(w?.oneAction ?? ""),
          avoid: String(w?.avoid ?? ""),
          why: String(w?.why ?? w?.text ?? ""),
        }))
      : [
          {
            key: "morning",
            label: "Morning",
            bestFor: "High-impact work, planning, key conversations",
            oneAction:
              "Lock 25–40 minutes on the hardest task and start without switching.",
            avoid: "Multitasking or starting too many threads",
            why: "",
          },
          {
            key: "midday",
            label: "Midday",
            bestFor: "Admin, follow-ups, low-risk decisions, money hygiene",
            oneAction:
              "Do a 5-minute check (spend/commitments/messages), then act only on basics.",
            avoid: "Big spends, rushed commitments, impulsive trades",
            why: "",
          },
          {
            key: "evening",
            label: "Evening",
            bestFor: "Closing loops, family/home, light creative work, reflection",
            oneAction: "Close one open loop and do a 10-minute wind-down reset.",
            avoid: "Heavy debates or emotionally loaded decisions",
            why: "",
          },
        ];

  const cautionNotesForUI =
    Array.isArray(timingLocal?.cautions) && timingLocal.cautions.length
      ? timingLocal.cautions.slice(0, 3).map((x: any) => String(x))
      : [
          "Avoid impulsive decisions during the afternoon dip.",
          "Avoid heavy conversations late at night.",
        ];

  /* -----------------------------
    I) Activations + playbook lists
  -------------------------------- */
  const activationBullets: string[] = [];
  if (asc)
    activationBullets.push(
      `Ascendant anchor: ${titleCase(asc)} rising (your baseline lens).`
    );
  if (moon)
    activationBullets.push(
      `Moon tone: ${titleCase(moon)} (your emotional processing style).`
    );
  if (moonHouse != null && moonHouse >= 1 && moonHouse <= 12) {
    activationBullets.push(
      `Moon house emphasis: House ${moonHouse} (where emotions go first).`
    );
  }
  if (md || ad)
    activationBullets.push(
      `Running dasha: ${md || ""} / ${ad || ""} (the inner weather).`
    );
  if (activePlanet)
    activationBullets.push(
      `Today's strongest lever: ${titleCase(activePlanet)} (what responds fastest).`
    );

  const doList = (buckets?.supportive || []).slice(0, 3);
  const maintainList = (buckets?.neutral || []).slice(0, 3);
  const avoidList = (buckets?.avoid || []).slice(0, 3);

  /* -----------------------------
    K) PremiumBriefing (declared BEFORE return)
  -------------------------------- */
  
    const pctLabel = (n: number) => `${Math.max(0, Math.min(100, Math.round(Number(n) || 0)))}%`;

const ScenarioCard: React.FC<{ s: any }> = ({ s }) => (
  <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          {String(s?.domain ?? "").toUpperCase()} • {s?.fromISO} → {s?.toISO}
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-100">
          {s?.headline ?? "Window"}
        </div>
        {Array.isArray(s?.why) && s.why.length ? (
          <div className="mt-2 text-xs text-white/60">
            {s.why.slice(0, 3).join(" • ")}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <div className="text-xs text-white/60">Confidence</div>
        <div className="text-lg font-semibold text-slate-100">{pctLabel(s?.score)}</div>
        <div className="text-xs text-white/60">{s?.confidence ?? ""}</div>
      </div>
    </div>

    {Array.isArray(s?.mostLikelySign) && s.mostLikelySign.length ? (
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Most likely sign
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm text-white/90 space-y-1">
          {s.mostLikelySign.slice(0, 3).map((x: string, i: number) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
    ) : null}

    <div className="mt-3 grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100/90">
          Do
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm text-white/90 space-y-1">
          {(Array.isArray(s?.do) ? s.do : []).slice(0, 4).map((x: string, i: number) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-red-100/90">
          Avoid
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm text-white/90 space-y-1">
          {(Array.isArray(s?.avoid) ? s.avoid : []).slice(0, 4).map((x: string, i: number) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
    </div>

    {(s?.outcomeIfDone || s?.outcomeIfIgnored) ? (
      <div className="mt-3 text-sm text-white/80">
        {s?.outcomeIfDone ? (
          <div>
            <span className="text-white/60 font-semibold">Handled well:</span>{" "}
            {s.outcomeIfDone}
          </div>
        ) : null}
        {s?.outcomeIfIgnored ? (
          <div className="mt-1">
            <span className="text-white/60 font-semibold">Ignored:</span>{" "}
            {s.outcomeIfIgnored}
          </div>
        ) : null}
      </div>
    ) : null}
  </div>
);

const HorizonBlock: React.FC<{ title: string; items: any[] }> = ({ title, items }) => (
  <details className="rounded-2xl border border-white/15 bg-white/5 p-4" open>
    <summary className="cursor-pointer list-none">
      <div className="text-sm font-semibold text-slate-100">{title}</div>
      <div className="mt-1 text-xs text-white/60">
        Trigger windows — what you’ll notice, what to do, what to avoid.
      </div>
    </summary>

    <div className="mt-4 grid gap-3">
      {(Array.isArray(items) ? items : []).map((s, i) => (
        <ScenarioCard key={i} s={s} />
      ))}
    </div>
  </details>
);

const FullGuidanceV2UI: React.FC<{ fg: any }> = ({ fg }) => {
  const rc = fg?.realityCheck ?? {};
  const domains = Array.isArray(fg?.domains) ? fg.domains : [];

  return (
    <div className="space-y-6">
      {/* Reality Check */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Full Guidance — 90 days
        </div>
        <div className="mt-1 text-lg font-semibold text-slate-100">
          Your 90-Day Reality Check
        </div>

        <div className="mt-2 text-sm text-white/80">
          <span className="text-white/60 font-semibold">Phase:</span>{" "}
          {rc?.currentPhase ?? "—"}
        </div>

        {rc?.mainTheme ? (
          <div className="mt-3 text-sm text-white/85 leading-relaxed">{rc.mainTheme}</div>
        ) : null}

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100/90">
              Your win move
            </div>
            <div className="mt-2 text-sm text-white/90">{rc?.winMove ?? "—"}</div>
          </div>

          <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-red-100/90">
              Your drain to cut
            </div>
            <div className="mt-2 text-sm text-white/90">{rc?.drainToCut ?? "—"}</div>
          </div>
        </div>
      </div>

      {/* Domain tiles */}
      {domains.length ? (
        <div className="grid gap-3 md:grid-cols-4">
          {domains
            .filter((d: any) => ["Career", "Relationships", "Health", "Money"].includes(String(d?.domain)))
            .slice(0, 4)
            .map((d: any) => (
              <div key={d.domain} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  {d.domain}
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-100">
                  {pctLabel(d.score)}
                </div>
                <div className="text-xs text-white/60">{d.confidence}</div>
                <div className="mt-2 text-sm text-white/85 leading-relaxed">
                  {d.headline}
                </div>
              </div>
            ))}
        </div>
      ) : null}

      {/* Horizons */}
      <HorizonBlock title="Next 14 days" items={fg?.next14d ?? []} />
      <HorizonBlock title="Next 30 days" items={fg?.next30d ?? []} />
      <HorizonBlock title="Next 60 days" items={fg?.next60d ?? []} />
      <HorizonBlock title="Next 90 days" items={fg?.next90d ?? []} />

      {/* Advisor Memo */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
        <div className="text-sm font-semibold text-slate-100">Advisor Memo</div>
        <div className="mt-1 text-xs text-white/60">
          What to push, what to refuse, what to enforce.
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Opportunity
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/90 space-y-1">
              {(fg?.advisorMemo?.opportunity ?? []).map((x: string, i: number) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Risks
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/90 space-y-1">
              {(fg?.advisorMemo?.risks ?? []).map((x: string, i: number) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Control levers
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/90 space-y-1">
              {(fg?.advisorMemo?.controlLevers ?? []).map((x: string, i: number) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Non-negotiables
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/90 space-y-1">
              {(fg?.advisorMemo?.nonNegotiables ?? []).map((x: string, i: number) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
  // ---------- TYPES ----------

  type DailyHighlightLocal = {
    dateISO: string;
    headline?: string;
    mood?: string;
    moodText?: string;
    text: string;
    do?: string[];
    avoid?: string[];
    color?: string;
    luckyNumber?: number | string;
    bestTime?: string;
    confidence?: "high" | "medium" | "low";
    theme?: string;
    facts?: string[];
  };

  type TabFullPlanProps = {
    report: LifeReportView | null;
    mounted: boolean;
    isFull: boolean;
    notificationsPreview: any | null;
    dashaTimeline?: any[] | null;
    topToday?: TransitHit[];
    todayISO?: string;
    onUnlockFull?: () => void;
  };

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

  type LifeTab = "overview" | "phases" | "now" | "advanced";
  const [activeTab, setActiveTab] = useState<"overview" | "phases" | "now" | "advanced">("overview");

    
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
    setMounted(true);
  }, []);
    const router = useRouter();
  const pathname = usePathname();
  const setTabFromUrl = useCallback((t: LifeTab) => {
    setActiveTab(t);
  }, []);

  // ---------------- Plan gating (reactive) ----------------
  type PlanTier = "free" | "advanced" | "full";

  const [planTier, setPlanTier] = useState<PlanTier>("free");

  // read localStorage once mounted (and whenever mounted flips true)
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const raw = String(localStorage.getItem("sarathi_plan") || "free").toLowerCase();
    const tier: PlanTier =
      raw === "full" || raw === "advanced" || raw === "free" ? (raw as PlanTier) : "free";

    setPlanTier(tier);
  }, [mounted]);
  const isFull = planTier === "full";

  const devUnlockFull =
    mounted && typeof window !== "undefined"
      ? localStorage.getItem("sarathi_dev_full") === "1"
      : false;

  const canSeeFull = isFull || devUnlockFull;

  const unlockFullDev = useCallback(() => {
    if (typeof window === "undefined") return;

    console.log("[unlockFullDev] clicked");
    localStorage.setItem("sarathi_plan", "full");
    setPlanTier("full");
    setActiveTab("advanced");
  }, [setPlanTier, setActiveTab]);

  // ---------------- Deep-link ?tab=... ----------------
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    try {
      const sp = new URLSearchParams(window.location.search);
      const t = (sp.get("tab") || "").toLowerCase();

      if (t === "overview" || t === "phases" || t === "now" || t === "full") {
        // Only allow "full" if paid (or dev override)
        if (t === "full" && !canSeeFull) {
          setTabFromUrl("overview");
        } else {
          setTabFromUrl(t as any);
        }
      }
    } catch {
      // ignore
    }
  }, [mounted, canSeeFull, setTabFromUrl]);


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
    const [dailyHighlights, setDailyHighlights] = useState<DailyHighlight[]>([]);
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
  }, [
    report,
    dashaTransitSummary,
    transitSummary,
    monthlyInsights,
    weeklyInsights,
    dailyHighlights,
  ]);


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
    const profileId = `${trimmedName} - ${dateISO}`;

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

    // ✅ Clear report ONLY when the user is actively editing inputs
  // (NOT when app internals re-set tz/place after generation)
  const lastInputsKeyRef = useRef<string>("");

  useEffect(() => {
    const key = [
      dateISO || "",
      time || "",
      tz || "",
      String(place?.lat ?? ""),
      String(place?.lon ?? ""),
    ].join("|");

    // first run: just store
    if (!lastInputsKeyRef.current) {
      lastInputsKeyRef.current = key;
      return;
    }

    // only clear if the inputs REALLY changed
    if (key !== lastInputsKeyRef.current) {
      lastInputsKeyRef.current = key;
      setReport(null);
      // keep tab as-is (don’t jump to overview)
    }
  }, [dateISO, time, tz, place?.lat, place?.lon]);


  // Ensure activeTab is always valid (prevents blank screen)
  useEffect(() => {
    const allowed = new Set(["overview", "phases", "now", "advanced", "full"] as const);
    if (!allowed.has(activeTab as any)) setActiveTab("overview");
  }, [activeTab]);



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

  // Unwrap: get the ACTUAL report object that contains nowPlan/nowNearFuture
  const data: any =
    envelope?.report ??
    envelope?.lifeReport ??
    envelope?.result?.report ??
    envelope?.data?.report ??
    envelope?.payload?.report ??
    envelope; // fallback: sometimes the API returns the report at top-level

  setReport(data as any);
  console.log("[life-report] setReport done:", !!data, Object.keys(data || {}));
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

  //  IMPORTANT: from this point forward, use `data` as your life report object


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

      // ?? Notifications from API - state (all 3 buckets)
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
        dashaTimeline: (() => {
    const rawTimeline = data?.dashaTimeline;
    const ap = data?.activePeriods;

    const isPlausibleISO = (d: any) => {
      if (typeof d !== "string") return false;
      const s = d.slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
      const y = Number(s.slice(0, 4));
      return y >= 1900 && y <= 2100;
    };

    const norm = (Array.isArray(rawTimeline) ? rawTimeline : [])
      .map((row: any) => ({
        planet: String(row?.planet ?? row?.md ?? row?.mahadasha ?? "").trim(),
        startISO: String(row?.startISO ?? row?.start ?? "").slice(0, 10),
        endISO: String(row?.endISO ?? row?.end ?? "").slice(0, 10),
      }))
      .filter((x: any) => x.planet && isPlausibleISO(x.startISO) && isPlausibleISO(x.endISO));

    const mdLord = String(ap?.mahadasha?.lord ?? "").trim();
    const mdStart = String(ap?.mahadasha?.start ?? "").slice(0, 10);
    const mdEnd = String(ap?.mahadasha?.end ?? "").slice(0, 10);

    const builtFromAP =
      mdLord && isPlausibleISO(mdStart) && isPlausibleISO(mdEnd)
        ? [{ planet: mdLord, startISO: mdStart, endISO: mdEnd }]
        : [];

    // paid-worthy: keep only current MD if possible
    if (norm.length) {
      const today = String((report as any)?.todayISO ?? data?.todayISO ?? new Date().toISOString()).slice(0, 10);
  const one = norm.find((x: any) => x.startISO <= today && today <= x.endISO);
      return one ? [one] : builtFromAP;
    }

    return builtFromAP;
  })(),
        // Paid plan blocks from API
    nowPlan: (data as any)?.nowPlan ?? (data as any)?.nowNearFuture ?? undefined,
    nowNearFuture: (data as any)?.nowNearFuture ?? (data as any)?.nowPlan ?? undefined,

    advancedPro: (data as any)?.advancedPro ?? undefined,
    fullPlan: (data as any)?.fullPlan ?? undefined,
    plan: (data as any)?.plan ?? undefined,
      };

      // Gold standard: "Now" should always win (Moon changes intraday)
  const moonNakFinal =
    (next as any)?.moonNow?.nakshatra ??
    (next as any)?.moonNow?.moonNakshatra ?? // (defensive if shape differs)
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

const structuredDailyFacts = buildDailyFacts(
  dailyMoon as any,
  hitList,
  todayISO,
  7,
  tz
);
    console.log("[ai-daily] dailyMoon length:", (dailyMoon || []).length);
  console.log("[ai-daily] dailyMoon sample:", (dailyMoon || [])[0]);
  console.log("[ai-daily] dailyFacts[0] raw:", safeDailyFacts?.[0]);

  console.log("[ai-daily] transits count:", (hitList || []).length);
  console.log("[ai-daily] transits sample:", (hitList || [])[0]);
  if (!hitList || hitList.length === 0) {
    console.log("⛔ Skipping daily highlights: no transits returned from API");
    // don't return from handleGenerate; just fall back
  }

  const pickStrongestForDate = (hits: any[], dateISO: string) => {
    if (!Array.isArray(hits) || !dateISO) return null;

    const pool = hits.filter((h) => {
      const s = String(h?.startISO || h?.start || "").slice(0, 10);
      const e = String(h?.endISO || h?.end || "").slice(0, 10);
      if (!s) return false;
      if (!e) return s === dateISO;
      return s <= dateISO && dateISO <= e; // inclusive
    });

    if (!pool.length) return null;
    pool.sort((a, b) => (b?.strength ?? 0) - (a?.strength ?? 0));
    return pool[0] || null;
  };
  function buildEventHintsRealLife(opts: {
    moonFrom: number | null;
    planet: string;
    target: string;
    strength: number;
    dayIndex: number;
  }) {

    const moonFrom = opts.moonFrom;
    const planet = String(opts.planet || "").toLowerCase();
    const target = String(opts.target || "").toLowerCase();
    const strength = typeof opts.strength === "number" ? opts.strength : 0;

    const hints: string[] = [];

    // --- Moon-from-Moon = "where life shows up"
    switch (moonFrom) {
      case 1:
        hints.push("your tone/visibility is higher; one small interaction sets the mood");
        hints.push("someone notices what you say (or don’t say)");
        break;
      case 2:
        hints.push("a money/food/family practical decision comes up");
        hints.push("a small spend or value discussion needs clarity");
        break;
      case 3:
        hints.push("a message thread or paperwork needs clarification");
        hints.push("a short errand/call interrupts flow");
        hints.push("a small domestic detail (repairs/logistics) steals time");
        break;
      case 4:
        hints.push("a home/family request interrupts your plan");
        hints.push("a comfort or space-related task needs attention");
        hints.push("a small domestic detail (repairs/logistics) steals time");
        break;
      case 5:
        hints.push("a creative idea or decision needs a clean yes/no");
        hints.push("avoid overpromising; keep it simple");
        hints.push("a small domestic detail (repairs/logistics) steals time");
        break;
      case 6:
        hints.push("a task/deadline needs fixing before it moves forward");
        hints.push("minor criticism or friction is possible if details are missed");
        hints.push("a small domestic detail (repairs/logistics) steals time");
        break;
      case 7:
        hints.push("a conversation sets relationship tone quickly");
        hints.push("a reply (or lack of reply) changes the mood");
        break;
      case 8:
        hints.push("a sudden update changes the next step");
        hints.push("something hidden/unclear surfaces and needs verification");
        break;
      case 9:
        hints.push("plans/travel/learning or a belief-based discussion comes up");
        hints.push("a guidance moment appears (advice, policy, rule, mentor-type input)");
        break;
      case 10:
        hints.push("a work/client/boss-facing moment needs a clean update");
        hints.push("a deliverable or decision point becomes visible");
        break;
      case 11:
        hints.push("a lead/approval/invite appears after you follow up");
        hints.push("networking or a useful connection opens a door");
        break;
      case 12:
        hints.push("low bandwidth: rest/sleep or quiet time is needed");
        hints.push("avoid overload; one small task is enough");
        break;
      default:
        // keep it neutral
        hints.push("one small practical task becomes the main thing");
        hints.push("a message needs a clear response");
    }

  // --- Planet = what triggers the situation (real-life, non-absolute)
  if (planet === "mercury") {
    hints.push("communication/admin: a message, number, or detail may need clarification");
  }

  else if (planet === "jupiter") {
    hints.push("a helpful perspective or approval is more available if you ask clearly");
  }

  else if (planet === "saturn") {
    hints.push("structure/test: a delay, checkpoint, or extra scrutiny may require patience and process");
  }

  else if (planet === "mars") {
    hints.push("action/friction: urgency rises — avoid rushed tone or impulsive responses");
  }

  else if (planet === "sun") {
    hints.push("visibility/authority: leadership or ego sensitivity may shape interactions");
  }

  else if (planet === "venus") {
    hints.push("comfort/relationships: spending, expectations, or harmony choices come into focus");
  }

  else if (planet === "rahu") {
    hints.push("noise/overreaction: verify information before acting on it");
  }

  else if (planet === "ketu") {
    hints.push("detachment/reset: interest may drop — keep commitments minimal and clear");
  }

    // --- Target nuance (only if it helps)
    if (target.includes("moon")) {
      hints.push("mood is reactive; choose calm timing for conversations");
    }
    if (target.includes("mercury")) {
      hints.push("paperwork/messages matter more than usual");
    }
    if (target.includes("venus")) {
      hints.push("relationship expectations or spending choices are highlighted");
    }
    if (target.includes("saturn")) {
      hints.push("accountability pressure increases; document steps");
    }

  // --- Strength logic + anti-repeat (VARIETY that stays true)
  let want = 2;
  if (strength >= 0.85) want = 3;

  // Split into buckets so we can rotate meaningfully
  const moonHints = hints.slice(0, 2); // first two are always moon-context in your switch
  const restHints = hints.slice(2);    // planet + target nuance etc.

  // If Jupiter is weak, don't force its hint
  const filteredRest: string[] = [];
  for (const h of restHints) {
    const hl = h.toLowerCase();
    if (planet === "jupiter" && strength < 0.75 && hl.includes("support/expansion")) continue;
    filteredRest.push(h);
  }

  // Deduplicate (moon + rest)
  function dedupe(arr: string[]) {
    const out: string[] = [];
    for (const s of arr) {
      const k = String(s).toLowerCase();
      if (!out.some(x => x.toLowerCase() === k)) out.push(String(s));
    }
    return out;
  }

  const moonU = dedupe(moonHints);
  const restU = dedupe(filteredRest);

  if (!moonU.length && !restU.length) return [];

  // Rotation helper
  function rotate<T>(arr: T[], seed: number) {
    if (!arr.length) return arr;
    const start = ((seed % arr.length) + arr.length) % arr.length;
    return arr.slice(start).concat(arr.slice(0, start));
  }

  // Seed by dayIndex heavily (not just moonFrom), so each day changes
  const seed = (opts.dayIndex ?? 0) + Math.floor(strength * 10) + (moonFrom ?? 0);

  // Pick rules:
  // - Always 1 moon hint (rotated)
  // - Always 1 “rest” hint if available (rotated)
  // - Third hint (only if want=3) comes from remaining pool, avoiding repeats
  const sel: string[] = [];

  const moonPick = rotate(moonU, seed)[0];
  if (moonPick) sel.push(moonPick);

  const restRot = rotate(restU, seed + 1);
  if (restRot[0]) sel.push(restRot[0]);

  // Optional 3rd hint: pick next best that's not already used
  if (want === 3) {
    const pool = dedupe([...moonU, ...restU]);
    const poolRot = rotate(pool, seed + 2);
    for (const h of poolRot) {
      if (!sel.some(x => x.toLowerCase() === h.toLowerCase())) {
        sel.push(h);
        break;
      }
    }
  }

  // Final dedupe + cap
  return dedupe(sel).slice(0, want);


  }

  // Build facts per day (internal), but do NOT show them in UI
  const dayInputs = (structuredDailyFacts || []).slice(0, 7).map((m: any, idx: number) => {
  const dateISO = String(m?.dateISO || "");
  const tr = m?.strongestTransit ?? pickStrongestForDate(hitList as any, dateISO);
  const facts: string[] = [];

  const moonFrom =
    typeof m?.relativeHouse === "number"
      ? m.relativeHouse
      : typeof m?.relativeHouseFromMoon === "number"
      ? m.relativeHouseFromMoon
      : typeof m?.houseFromMoon === "number"
      ? m.houseFromMoon
      : null;

  const moonNakNow =
  String(m?.moonNakshatra || "").trim() ||
  (next as any)?.moonNow?.nakshatra ||
  (next as any)?.moonNow?.moonNakshatra ||
  next.panchang?.moonNakshatraName ||
  next.moonNakshatraName ||
  derivedMoonNakshatra ||
  null;

  if (moonNakNow) {
    facts.push(`Moon-nakshatra-now: ${moonNakNow}`);
  }

  if (typeof moonFrom === "number") {
    facts.push(`Moon-from-natal-Moon: ${moonFrom}`);
  }

  if (tr?.planet) {
    facts.push(`Strongest transit: ${tr.planet} → ${tr.target || "natal point"}`);
  }

  if (typeof tr?.strength === "number") {
    facts.push(`Transit strength: ${Math.round(tr.strength * 100)}%`);
  }

  if (tr?.category) {
    facts.push(`Focus area: ${tr.category}`);
  }

  const strength = typeof tr?.strength === "number" ? tr.strength : 0;

  const moonIntense = moonFrom !== null && [6, 8, 12].includes(moonFrom);
  let score = 0;
  if (strength >= 0.65) score += 1;
  if (strength >= 0.85) score += 1;
  if (moonIntense) score += 1;

  const confidence: "high" | "medium" | "low" =
    score >= 2 ? "high" : score === 1 ? "medium" : "low";

  let focusHint: "work" | "relationships" | "health" | "money" | "inner" | "general" =
    String(tr?.category || "").toLowerCase() === "relationships"
      ? "relationships"
      : String(tr?.category || "").toLowerCase() === "health"
      ? "health"
      : String(tr?.category || "").toLowerCase() === "money"
      ? "money"
      : ["career", "job", "work"].includes(String(tr?.category || "").toLowerCase())
      ? "work"
      : "general";

  if (moonFrom === 2 || moonFrom === 11) focusHint = "money";
  if (moonFrom === 7) focusHint = "relationships";
  if (moonFrom === 12 || moonFrom === 8) focusHint = "inner";
  if (moonFrom === 6) focusHint = "health";

  const focusArea =
    focusHint === "relationships"
      ? "Relationships & communication"
      : focusHint === "health"
      ? "Health & energy"
      : focusHint === "money"
      ? "Money & stability"
      : focusHint === "work"
      ? "Work & direction"
      : focusHint === "inner"
      ? "Inner balance"
      : "General flow";

  const eventHints = buildEventHintsRealLife({
    moonFrom,
    planet: String(tr?.planet || ""),
    target: String(tr?.target || ""),
    strength,
    dayIndex: idx,
  });

  return {
    dateISO,
    facts,
    confidence,
    focusHint,
    focusArea,
    eventHints,
    moonFrom,
    strength,
  };
});

  console.log("[ai-daily] dayInputs[0] sample:", dayInputs?.[0]);
  console.log("DAY INPUTS SAMPLE", dayInputs[0]);

  console.log("[ai-daily] dayInputs[0] sample:", dayInputs?.[0]);

  console.log("DAY INPUTS SAMPLE", dayInputs[0]);
    // Try AI (optional). If it fails, fallback will still be good.
    try {
      // --- AI daily highlights with timeout (premium UX) ---
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 40000); // 40s hard cap

  let aiDailyRes: Response | null = null;
  let aiJson: any = {};


  try {
    aiDailyRes = await fetch("/api/ai-daily-highlights", {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: ctrl.signal,
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

    // Read as text first so JSON errors don't crash the flow
    const raw = await aiDailyRes.text().catch(() => "");
    try {
      aiJson = JSON.parse(raw || "{}");
    } catch {
      aiJson = { _raw: raw };
    }
  } catch (e: any) {
    // AbortError or network failure
    console.warn("[ai-daily] AI daily fetch failed/timeout:", e?.name || e?.message || e);
    aiDailyRes = null;
    aiJson = {};
  } finally {
    clearTimeout(t);
  }

  const outDays: any[] =
    Array.isArray(aiJson?.days) ? aiJson.days :
    Array.isArray(aiJson?.days?.days) ? aiJson.days.days :
    Array.isArray(aiJson?.result?.days) ? aiJson.result.days :
    Array.isArray(aiJson?.data?.days) ? aiJson.data.days :
    Array.isArray(aiJson?.outDays) ? aiJson.outDays :
    Array.isArray(aiJson) ? aiJson :
    [];


  console.log("[ai-daily] aiDaysArr[0] raw:", (outDays || [])[0]);

      console.log("[ai-daily] status=", aiDailyRes?.status ?? "NO_RESPONSE");
  console.log("[ai-daily] outDays length=", Array.isArray(outDays) ? outDays.length : "NOT_ARRAY", outDays);
  console.log("[ai-daily] dayInputs length=", Array.isArray(dayInputs) ? dayInputs.length : "NOT_ARRAY", dayInputs);

      const aiDaysArr = Array.isArray(outDays) ? outDays : [];
  if (aiDailyRes?.ok && Array.isArray(dayInputs) && dayInputs.length && aiDaysArr.length) {
  if (!aiDaysArr.length) {
    console.warn("[ai-daily] FALLBACK: empty aiDaysArr", {
      status: aiDailyRes?.status ?? "NO_RESPONSE",
      keys: aiJson ? Object.keys(aiJson) : null,
      err: aiJson?._error,
      rawPreview: (aiJson?._raw || "").slice(0, 200),
    });
  }
  console.log("[ai-daily] aiDaysArr[0] raw:", aiDaysArr?.[0]);
  console.log("[ai-daily] outDays[0] raw:", (outDays || [])[0]);

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
        const d: any =
    aiDaysArr.find((x: any) => x?.dateISO === inp?.dateISO) ??
    aiDaysArr[idx] ??
    {};


        const dateISO = String(inp?.dateISO ?? d?.dateISO ?? "").trim();
        const facts = Array.isArray(inp?.facts) ? (inp.facts as string[]) : [];

        const extras = dailyFlavorExtras(dateISO || String(idx));

        const conf: "high" | "medium" | "low" =
          d?.confidence === "high" || d?.confidence === "medium" || d?.confidence === "low"
            ? d.confidence
            : (inp?.confidence ?? "medium");

        // ---- Gold paragraph (use your deterministic builder) ----
        const df = (dailyMoon || [])[idx] as any;

        const relHouseDay: number | null =
          typeof df?.relativeHouse === "number"
            ? df.relativeHouse
            : typeof df?.relativeHouseFromMoon === "number"
            ? df.relativeHouseFromMoon
            : typeof df?.houseFromMoon === "number"
            ? df.houseFromMoon
            : null;

        const strongPicked = pickStrongestForDate(hitList as any, dateISO);
        const rawCat = String(strongPicked?.category ?? "general").toLowerCase();
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

        const strongDay: StrongTransitLite | null = strongPicked
          ? {
              planet: String(strongPicked.planet ?? "Transit"),
              target: String(strongPicked.target ?? "a key natal point"),
              category: cat,
              strength: Number(strongPicked.strength ?? 0),
              startISO: String(strongPicked.startISO ?? dateISO),
              endISO: String(strongPicked.endISO ?? dateISO),
            }
          : null;

        const moonNak = String(df?.moonNakshatra ?? "");
        const dg = buildDayGuidance(dateISO, relHouseDay, strongDay, idx, moonNak);

        const baseHeadlineGold =
          cat === "career"
            ? "Work & direction"
            : cat === "relationships"
            ? "Relationships & tone"
            : cat === "health"
            ? "Health & energy"
            : cat === "inner"
            ? "Inner clarity"
            : "Current activation";

        const fallbackTag = (dateISO || `Day ${idx + 1}`).toString();
        const headlineGold = dedupeHeadline(baseHeadlineGold, fallbackTag);

        const rawHeadline =
    String(d?.headline ?? "").trim() ||
    headlineGold;

  const aiText = String(d?.text ?? "").trim();
  console.log("[AI DAY]", dateISO, "headline=", d?.headline, "aiTextLen=", aiText.length);

  const text =
    aiText.length >= 40
      ? aiText
      : String(dg?.expect ?? "").trim();



        const mood = String((d?.mood ?? "").trim() || "balanced");
  const moodText = String((d?.moodText ?? "").trim() || "");

  const listKey = `${dateISO}:${cat}:${mood}`;
  const fallbackLists = doAvoidLists(cat, mood, listKey);

  const doList = normalizeBullets(d?.do, 3);
  const avoidList = normalizeBullets(d?.avoid, 3);

  console.log("AI DAY DO RAW", d?.do);
  console.log("AI DAY AVOID RAW", d?.avoid);
  console.log("AI DAY DO normalized", doList);
  console.log("AI DAY AVOID normalized", avoidList);

  return {
    dateISO,
    headline: rawHeadline,
    mood,
    moodText,
    text,
    do: doList.length ? doList : [...fallbackLists.do],
    avoid: avoidList.length ? avoidList : [...fallbackLists.avoid],
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
    // ✅ Meaningful fallback (varies by focus area + emotional tone)
   const fallbackInputs =
  Array.isArray(dayInputs) && dayInputs.length
    ? dayInputs.filter(Boolean)
    : Array.isArray(structuredDailyFacts) && structuredDailyFacts.length
    ? structuredDailyFacts.slice(0, 7).map((m: any) => {
        const tr = m?.strongestTransit ?? null;
        const moonFrom =
          typeof m?.relativeHouse === "number"
            ? m.relativeHouse
            : typeof m?.relativeHouseFromMoon === "number"
            ? m.relativeHouseFromMoon
            : typeof m?.houseFromMoon === "number"
            ? m.houseFromMoon
            : null;

        let focusHint: "work" | "relationships" | "health" | "money" | "inner" | "general" =
          String(tr?.category || "").toLowerCase() === "relationships"
            ? "relationships"
            : String(tr?.category || "").toLowerCase() === "health"
            ? "health"
            : String(tr?.category || "").toLowerCase() === "money"
            ? "money"
            : ["career", "job", "work"].includes(String(tr?.category || "").toLowerCase())
            ? "work"
            : "general";

        if (moonFrom === 2 || moonFrom === 11) focusHint = "money";
        if (moonFrom === 7) focusHint = "relationships";
        if (moonFrom === 12 || moonFrom === 8) focusHint = "inner";
        if (moonFrom === 6) focusHint = "health";

        const focusArea =
          focusHint === "relationships"
            ? "Relationships & communication"
            : focusHint === "health"
            ? "Health & energy"
            : focusHint === "money"
            ? "Money & stability"
            : focusHint === "work"
            ? "Work & direction"
            : focusHint === "inner"
            ? "Inner balance"
            : "General flow";

        const facts: string[] = [];
        if (m?.moonNakshatra) facts.push(`Moon-nakshatra-now: ${m.moonNakshatra}`);
        if (typeof moonFrom === "number") facts.push(`Moon-from-natal-Moon: ${moonFrom}`);
        if (tr?.planet) facts.push(`Strongest transit: ${tr.planet} → ${tr.target || "natal point"}`);
        if (typeof tr?.strength === "number") facts.push(`Transit strength: ${Math.round(tr.strength * 100)}%`);
        if (tr?.category) facts.push(`Focus area: ${tr.category}`);

        return {
          dateISO: String(m?.dateISO || ""),
          facts,
          confidence: "medium" as const,
          focusHint,
          focusArea,
          eventHints: [] as string[],
        };
      })
    : [];
    const fallback: DailyHighlight[] = fallbackInputs.map((d: any, idx: number) => {
      const safeD = d && typeof d === "object" ? d : {};

      const facts = Array.isArray(safeD.facts) ? (safeD.facts as string[]) : [];

      const conf: "high" | "medium" | "low" =
        safeD.confidence === "high" || safeD.confidence === "medium" || safeD.confidence === "low"
          ? safeD.confidence
          : "medium";

      const dateISO = String(safeD.dateISO ?? "");

      const extras = dailyFlavorExtras(dateISO || String(idx));
      const key = `${dateISO}::${idx}::${facts.join("|")}`;

      // ✅ Use focusHint/focusArea FIRST (facts may be empty in fallback)
      const focusHint = String(safeD.focusHint || "work").toLowerCase();
      const focusLower =
        focusHint === "relationships"
          ? "relationships"
          : focusHint === "health"
          ? "health"
          : focusHint === "money"
          ? "money"
          : focusHint === "inner" || focusHint === "mind"
          ? "inner"
          : focusHint === "home"
          ? "home"
          : focusHint === "purpose"
          ? "purpose"
          : focusHint === "creativity"
          ? "creativity"
          : "career";

      // Mood signals (fallback-safe)
      const moodObj = inferMoodFromFacts(facts, conf);
      const mood = String(moodObj?.mood || "balanced");
      const moodText = String(relatableMoodText(mood, key) ?? buildMoodLineText(mood, key) ?? "");

      const headline =
        focusLower === "relationships"
          ? "Relationships & conversations"
          : focusLower === "health"
          ? "Energy & routine"
          : focusLower === "inner"
          ? "Mindset & emotions"
          : focusLower === "money"
          ? "Money & stability"
          : focusLower === "home"
          ? "Home & comfort"
          : focusLower === "purpose"
          ? "Purpose & learning"
          : focusLower === "creativity"
          ? "Creativity & confidence"
          : "Work & direction";

      // Guidance pools (varies per day via pick)
      const REL_GUIDES = [
        "Say the simple truth, kindly. One clear conversation beats ten half-replies.",
        "Ask one direct question instead of assuming the answer.",
        "Choose timing and tone first — the message lands better.",
        "Listen fully, then respond. Don’t rush to fix everything.",
      ];

      const CAREER_GUIDES = [
        "Structure wins today. Finish one thing fully, then move to the next.",
        "Handle one practical task end-to-end — it will unclog the rest.",
        "Avoid scattered effort. Pick a priority and close it cleanly.",
        "A short, clear update beats long explanations.",
      ];

      const HEALTH_GUIDES = [
        "Protect energy. Keep meals light and routine clean.",
        "Movement + hydration will stabilize everything else.",
        "Do less, but do it consistently. Your body responds fast today.",
        "Avoid overstimulation — keep the day gentle.",
      ];

      const INNER_GUIDES = [
        "Name one emotion, then take one small action.",
        "Don’t overthink signals. Ground yourself in one practical step.",
        "Keep your mental space clean: one thought, one task, done.",
        "Pause before reacting — clarity shows up after the pause.",
      ];

      const MONEY_GUIDES = [
        "Keep money moves practical. One clean decision beats multiple small leaks.",
        "Check numbers once, then act. Avoid impulse spends.",
        "Follow up on a pending payment/approval and close it.",
        "Choose stability over speed today.",
      ];

      const HOME_GUIDES = [
        "Close one home task end-to-end. It will lift mental load.",
        "Keep family communication short and clear.",
        "Fix one small thing — it reduces friction for the rest of the week.",
        "Don’t multitask across home + work. Sequence it.",
      ];

      const GENERAL_GUIDES = [
        "Keep the day simple: one priority, one clean action.",
        "Even-paced day — small improvements compound.",
        "Steady effort wins. Don’t push; nudge things forward.",
        "Keep it calm and consistent. Simple choices land best.",
      ];

      const guidePool =
        focusLower === "relationships"
          ? REL_GUIDES
          : focusLower === "health"
          ? HEALTH_GUIDES
          : focusLower === "inner"
          ? INNER_GUIDES
          : focusLower === "money"
          ? MONEY_GUIDES
          : focusLower === "home"
          ? HOME_GUIDES
          : focusLower === "purpose" || focusLower === "creativity"
          ? GENERAL_GUIDES
          : CAREER_GUIDES;

      const guideKey = [dateISO, focusLower, mood, facts.join("|")].join("|");
      const guidance = pickKey(guidePool, guideKey);

      const microPool =
        focusLower === "career"
          ? [
              "Do the hardest task first — you’ll feel lighter all day.",
              "Close one loop before starting a new one.",
              "Keep messages short. Clarity > detail.",
              "Don’t tweak the plan — execute the plan.",
            ]
          : [
              "Don’t rush your day. Slow is smooth.",
              "One small win will shift your mood.",
              "Less input (scrolling/news) = more calm.",
              "Choose one thing and finish it properly.",
            ];

      const microTip = safeText(pickKey(microPool, guideKey + "::micro"));
      const composed = safeText(`${safeText(guidance)} ${microTip}`.trim());
      const finalText = stripMoodPrefix(composed, moodText);

      const listKey = `${dateISO}:${focusLower}:${mood}`;
      const lists = doAvoidLists(focusLower, mood, listKey);

      // If AI lists exist, use them; otherwise fallback lists
      const doList = normalizeBullets(safeD.do, 3);
      const avoidList = normalizeBullets(safeD.avoid, 3);

      return {
        dateISO,
        headline,
        mood,
        moodText,
        text: safeText(normalizeHighlightText(finalText, idx)),
        do: doList.length ? doList : [...lists.do],
        avoid: avoidList.length ? avoidList : [...lists.avoid],
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

      // 2) Dasha - Transits fusion
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

  // CLOSE the OUTER transits try/catch/finally correctly
  } catch (err) {
    console.error("transits API error", err);
    setTransitsError("Could not load upcoming transits.");
  } finally {
    setTransitsLoading(false);
  }
  };
  // ---- Refresh Full Guidance brief AFTER AI insights finish (fills blanks) ----
let reportWithPaid: any = next as any;

try {
  // STOP mutating __paid here. Full Guidance must come from server as fullGuidanceV2.
  (reportWithPaid as any).__ai = {
    transitSummary,
    dashaTransitSummary,
    monthlyInsights,
    weeklyInsights,
    dailyHighlights,
  };
} catch (e: any) {
  console.error("[FullGuidance] rebuild after AI failed", e);
}
    const computedKey = `${next.birthDateISO}|${next.birthTime}|${next.birthTz}|${next.birthLat}|${next.birthLon}`;
  setLastReportKey(computedKey);


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
    (report as any)?.moonNow?.nakshatra ||
    (report as any)?.moonNow?.moonNakshatra ||
    (report as any)?.panchangToday?.moonNakshatraName ||
    report?.panchang?.moonNakshatraName ||
    report?.moonNakshatraName ||
    null;


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
                    {report.moonSign ?? (moonRow?.sign ?? "")}
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

  {report.birthDateISO || report.birthTime || report.birthTz ? (
    <div>
      {[report.birthDateISO, report.birthTime].filter(Boolean).join(" @ ")}
      {report.birthTz ? ` (${report.birthTz})` : ""}
    </div>
  ) : (
    <div className="text-white/50">{report.birthDateISO || report.birthTime || report.birthTz ? (
  <div>
    {[report.birthDateISO, report.birthTime].filter(Boolean).join(" @ ")}
    {report.birthTz ? ` (${report.birthTz})` : ""}
  </div>
) : (
  <div className="text-white/50">Birth details unavailable</div>
)}</div>
  )}

  {typeof report.birthLat === "number" && typeof report.birthLon === "number" ? (
    <div className="text-xs text-white/70">
      {report.birthLat.toFixed(3)}, {report.birthLon.toFixed(3)}
    </div>
  ) : null}
</div>
              {/* Panchang snapshot */}
           {(() => {
  const bp = report?.panchang ?? null;

  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold uppercase text-white/70 tracking-wide">
        Birth Panchang
      </div>

      <div>
        <span className="font-medium">Weekday:</span> {bp?.weekday ?? ""}
      </div>

      <div>
        <span className="font-medium">Tithi:</span> {bp?.tithiName ?? ""}
      </div>

      <div>
        <span className="font-medium">Yoga:</span> {bp?.yogaName ?? ""}
      </div>

      <div>
        <span className="font-medium">Karana:</span> {bp?.karanaName ?? ""}
      </div>

      <div>
        <span className="font-medium">Nakshatra:</span> {bp?.moonNakshatraName ?? ""}
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
          href="/sarathi/life-report?tab=full"
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

      
      // NO HIDING: disable chat cache while we debug houses/asc
  window.localStorage.removeItem("sarathi.lifeReportCache.v2");
  // console.log("[life-report] chat cache disabled");

    } catch (e) {
      console.warn("[life-report] failed to cache for chat", e);
    }
  }, [report, transits]);
  const todayISO = new Date().toISOString().slice(0, 10);
  const topToday = Array.isArray((report as any)?.topTransits) ? (report as any).topTransits.slice(0, 6) : [];
    /* ---------------- Render ---------------- */
const fallbackNowHighlights =
  report
    ? buildDailyFromMoonAndTransits(
        Array.isArray((report as any)?.dailyMoon) ? (report as any).dailyMoon : [],
        Array.isArray((report as any)?.topTransits)
          ? (report as any).topTransits
          : Array.isArray(transits)
          ? transits
          : [],
        todayISOInTz(
          String(
            (report as any)?.birthTz ||
            tz ||
            "Asia/Dubai"
          )
        ),
        7,
        String(
          (report as any)?.birthTz ||
          tz ||
          "Asia/Dubai"
        )
      )
    : [];
   const reportNowPlan = (report as any)?.nowPlan ?? (report as any)?.nowNearFuture ?? null;

const addDaysISO = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const todayBaseISO =
  typeof (report as any)?.todayISO === "string" && (report as any)?.todayISO
    ? String((report as any).todayISO)
    : new Date().toISOString().slice(0, 10);

const dailyMoonRows = Array.isArray((report as any)?.dailyMoon) ? (report as any).dailyMoon : [];

const moonByDate = new Map(
  dailyMoonRows.map((r: any) => [
    String(r?.dateISO || ""),
    {
      moonNakshatra: String(r?.moonNakshatra || "").trim(),
      houseFromMoon:
        typeof r?.houseFromMoon === "number"
          ? r.houseFromMoon
          : typeof r?.relativeHouse === "number"
          ? r.relativeHouse
          : null,
    },
  ])
);

const mdLord = String((report as any)?.activePeriods?.mahadasha?.lord || "").trim();
const adLord = String((report as any)?.activePeriods?.antardasha?.subLord || "").trim();
const pdLord = String((report as any)?.activePeriods?.pratyantardasha?.lord || "").trim();

const phaseTag =
  mdLord && adLord
    ? `${mdLord} MD • ${adLord} AD${pdLord ? ` • ${pdLord} PD` : ""}`
    : "";

const nowHighlightsFromPlan = React.useMemo(() => {
  const p = reportNowPlan;
  if (!p) return [];

  const out: Array<{
    dateISO: string;
    title?: string;
    text: string;
    confidence?: "low" | "medium" | "high";
  }> = [];

  const pushRow = (
    dateISO: string,
    title: string,
    text: string,
    confidence: "low" | "medium" | "high" = "medium"
  ) => {
    if (!dateISO || !text) return;

    const moon = moonByDate.get(dateISO) as any;
    const moonBits: string[] = [];

    if (moon?.moonNakshatra) moonBits.push(`Moon in ${moon.moonNakshatra}`);
    if (typeof moon?.houseFromMoon === "number") {
      moonBits.push(`activating ${moon.houseFromMoon}th-from-Moon themes`);
    }

    const prefix = [
      phaseTag ? `${phaseTag}.` : "",
      moonBits.length ? `${moonBits.join(" • ")}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    out.push({
      dateISO,
      title: title || "Current activation",
      text: `${prefix} ${text}`.trim(),
      confidence,
    });
  };

  if (p?.now3Days) {
    const focusAreas = Array.isArray(p.now3Days.focusAreas) ? p.now3Days.focusAreas : [];
    const themes = Array.isArray(p.now3Days.themes) ? p.now3Days.themes : [];
    const scenarios = Array.isArray(p.now3Days.likelyScenarios) ? p.now3Days.likelyScenarios : [];
    const transitSnapshot = Array.isArray(p.now3Days.transitSnapshot) ? p.now3Days.transitSnapshot : [];

    for (let i = 0; i < 3; i++) {
      const fa = focusAreas[i] ?? {};
      const theme = themes[i] ? String(themes[i]) : "";
      const scenario = scenarios[i] ? String(scenarios[i]) : "";
      const snap = transitSnapshot[i] ? String(transitSnapshot[i]) : "";

      const title =
        String(fa?.area || "").trim() ||
        theme ||
        "Current activation";

      const textParts = [
  theme,
  scenario,
  String(fa?.why || "").trim(),
  snap,
]
  .map((x) => String(x || "").trim())
  .filter(Boolean);

const uniqueTextParts = textParts.filter(
  (part, index, arr) => arr.findIndex((x) => x.toLowerCase() === part.toLowerCase()) === index
);

const text = uniqueTextParts
  .join(" ")
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .replace(/([a-z])good\b/g, "$1 good")
  .replace(/\s+/g, " ")
  .trim();

      pushRow(addDaysISO(todayBaseISO, i), title, text, "medium");
    }
  }

  if (p?.next14Days) {
    const timing = Array.isArray(p.next14Days.timing) ? p.next14Days.timing : [];
    for (let i = 0; i < Math.min(timing.length, 4); i++) {
      const t = timing[i] ?? {};
      const title = String(t?.window || "").trim() || "Near-future window";
      const text = String(t?.note || "").trim();
      pushRow(addDaysISO(todayBaseISO, 3 + i), title, text, "medium");
    }
  }

  return out.slice(0, 7);
}, [reportNowPlan, todayBaseISO, phaseTag, dailyMoonRows]);
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
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
    <TabsTrigger value="full">Full Guidance</TabsTrigger>
  </TabsList>
  {/* Tab panels */}
  <TabsContent value="overview" className="mt-4">
    <div className="space-y-6">
      <TabPlacements />
      <TabPersonality report={report} aiSummary={aiSummary} />
    </div>
  </TabsContent>

  <TabsContent value="phases" className="mt-4">
    <TabTimeline
      report={report}
      mounted={mounted}
      timelineSummary={timelineSummary}
      dashaTransitSummary={dashaTransitSummary}
    />
  </TabsContent>
  <TabsContent value="now" className="mt-4">
    <TabTransits
  report={report}
  mounted={mounted}
  transits={
    (Array.isArray((report as any)?.topTransits)
      ? (report as any).topTransits
      : transits) ?? []
  }
  loading={!!transitsLoading}
  error={transitsError ?? null}
  transitSummary={transitSummary ?? ""}
  dailyHighlights={
    Array.isArray(nowHighlightsFromPlan) && nowHighlightsFromPlan.length > 0
      ? nowHighlightsFromPlan
      : Array.isArray(dailyHighlights) && dailyHighlights.length > 0
      ? dailyHighlights
      : fallbackNowHighlights
  }
  dailyLoading={!!dailyLoading && !(fallbackNowHighlights?.length > 0)}
  dailyError={dailyError ?? null}
/>
  </TabsContent>



  <TabsContent value="full" className="mt-4">
   
    {/* Always show *something* below */}
    {!canSeeFull ? (
      <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
        Full Guidance is locked.
      </div>
    ) : !report ? (
      <div className="mt-4 rounded-2xl border border-black-500/30 bg-black-950/30 p-4 text-sm text-red-100">
        Full Guidance will populate after generation.
      </div>
    ) : (
      <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
    <div className="text-xs text-white/60 mb-3">FULL CONTENT BELOW ✅</div>

    {(() => {
      try {
        return (
          <TabFullPlan
            report={report}
            mounted={mounted}
            isFull={isFull}
            notificationsPreview={notificationsPreview ?? null}
            dashaTimeline={(report as any)?.dashaTimeline ?? null}
            topToday={[]}
            todayISO={undefined}
          />
        );
      } catch (e: any) {
        return (
          <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-100">
            TabFullPlan crashed: {e?.message ? String(e.message) : "unknown error"}
          </div>
        );
      }
    })()}
  </div>
    )}
  </TabsContent>
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


      </main>
      
    );
    
  }
  function windowActionFromCategory(cat: any) {
    const c = String(cat || "").toLowerCase();
    if (c.includes("career")) return "Take the visible action: pitch, apply, present, ask for decision.";
    if (c.includes("money")) return "Verify before committing; cut recurring leaks; avoid impulse spends.";
    if (c.includes("relationship")) return "One calm message: define expectation + propose a next step/date.";
    if (c.includes("health")) return "Stabilize sleep/food for 10 days; consistency beats intensity.";
    return "Pick one outcome, finish the first measurable milestone, and close open loops.";
  }

  function buildPaid14dFromHits(hits: any[], todayISO: string) {
    const next14ISO = (() => {
      const d = new Date(todayISO + "T00:00:00.000Z");
      d.setUTCDate(d.getUTCDate() + 14);
      return d.toISOString().slice(0, 10);
    })();

    const rows = (Array.isArray(hits) ? hits : [])
      .filter((t: any) => t?.startISO && t?.endISO)
      .filter((t: any) => String(t.startISO).slice(0, 10) <= next14ISO && String(t.endISO).slice(0, 10) >= todayISO)
      .sort((a: any, b: any) => (b?.strength ?? 0) - (a?.strength ?? 0))
      .slice(0, 8);

    // bucket by area (one best per area)
    const seen = new Set<string>();
    const out: any[] = [];
    for (const t of rows) {
      const area = String(t.category || "general").toLowerCase();
      if (seen.has(area)) continue;
      seen.add(area);

      out.push({
        area: area.toUpperCase(),
        from: String(t.startISO).slice(0, 10),
        to: String(t.endISO).slice(0, 10),
        confidence: Math.round((t.strength ?? 0.6) * 100),
        text: t.title || "A meaningful window opens—act deliberately.",
        trigger: t.target ? `Transit trigger: ${t.target}` : "Momentum increases; decisions surface.",
        action: windowActionFromCategory(t.category),
      });

      if (out.length >= 4) break; // keep it tight
    }
    return out;
  }

function TabFullPlan({
  report,
  mounted,
  isFull,
  notificationsPreview: _notificationsPreview,
  dashaTimeline: _dashaTimeline,
  topToday: _topToday,
  todayISO: _todayISO,
  onUnlockFull: _onUnlockFull,
}: any) {
  if (!mounted) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Loading…
      </div>
    );
  }

  if (!isFull) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/70">
        Full Guidance is locked.
      </div>
    );
  }

  const r: any = report ?? null;
  const hasReport =
    !!r &&
    typeof r === "object" &&
    ((Array.isArray(r?.planets) && r.planets.length > 0) ||
      (Array.isArray(r?.core?.houses) && r.core.houses.length > 0) ||
      !!r?.ascSign ||
      !!r?.meta?.birthDateISO);

  if (!hasReport) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Full Guidance
        </div>
        <div className="mt-1 text-lg font-semibold text-slate-100">
          Generate your report first
        </div>
        <div className="mt-2 text-sm text-white/70 leading-relaxed">
          Enter birth details and click Generate / Refresh Report.
        </div>
      </div>
    );
  }

  const fg: any = r?.fullGuidanceV2 ?? null;

  if (!fg) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/70">
        Full guidance is loading…
      </div>
    );
  }

  const phase = String(fg?.realityCheck?.currentPhase ?? "").trim();

  const currentLife = fg?.currentLife ?? null;

  const overview =
    String(currentLife?.overview ?? "").trim() ||
    String(currentLife?.phaseBrief ?? "").trim() ||
    String(fg?.realityCheck?.mainTheme ?? "").trim();

  const mindState =
    String(currentLife?.mindState ?? "").trim() || "";
  const phaseTruth =
  String(currentLife?.phaseTruth ?? "").trim() || "";
  const oneDecision =
  String(currentLife?.oneDecision ?? "").trim() || "";
  const biggestMistake =
  String(currentLife?.biggestMistake ?? "").trim() || "";
  const areas: any[] = Array.isArray(currentLife?.areas)
    ? currentLife.areas
    : Array.isArray(currentLife?.snapshot)
      ? currentLife.snapshot.map((s: any) => {
          const raw = String(s ?? "");
          const idx = raw.indexOf(":");
          const domain = idx > 0 ? raw.slice(0, idx).trim() : "Life";
          const text = idx > 0 ? raw.slice(idx + 1).trim() : raw.trim();
          return { domain, what: text };
        })
      : [];

  const whyNow: string[] = Array.isArray(currentLife?.whyNow)
    ? currentLife.whyNow.map((x: any) => String(x).trim()).filter(Boolean)
    : [];

  const whatToDoNow: string[] = Array.isArray(currentLife?.whatToDoNow)
    ? currentLife.whatToDoNow.map((x: any) => String(x).trim()).filter(Boolean)
    : [];

  const nextShift = fg?.nextShift ?? null;
  const mostLikelyNextEvent = fg?.mostLikelyNextEvent ?? null;
  const remedies = fg?.remedies ?? null;
  const weekly = Array.isArray(fg?.weeklyPlaybook) ? fg.weeklyPlaybook : [];
  const chatPrompts = Array.isArray(fg?.chatPrompts) ? fg.chatPrompts : [];
  const probabilities = Array.isArray(fg?.probabilities)
  ? fg.probabilities
  : [];
  const strategicFocus = fg?.strategicFocus ?? null;
  const turningPoints = Array.isArray(fg?.turningPoints) ? fg.turningPoints : [];
const turningPointsTitle =
  turningPoints.length >= 2 ? "Your Next 3 Turning Points" : "Your Next Turning Point";
  const lifeSummary =
  String(currentLife?.lifeSummary ?? "").trim() || "";
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Your Current Phase
        </div>
        <div className="mt-1 text-lg font-semibold text-slate-100">
          {phase || "Current phase"}
        </div>
       <div className="mt-3 text-sm text-white/80 leading-relaxed">
  You are entering a phase where life becomes more defined. Work begins 
  to demand precision, relationships begin to demand clarity, and the 
  difference between discipline and distraction becomes visible quickly.
</div>

<div className="mt-2 text-sm text-white/70 leading-relaxed">
  This reading explains what is happening in your life right now, what 
  begins to change next, and how to move through this phase with more 
  clarity and fewer mistakes.
</div>
        
      </div>

      {/* Current Life Chapter */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Current Life Chapter
        </div>
       {lifeSummary ? (
  <div className="mt-2 text-sm text-white/80 leading-relaxed">
    <span className="text-white/60 font-semibold">Life summary:</span>{" "}
    {lifeSummary}
  </div>
) : null}
        {mindState ? (
          <div className="mt-3 text-sm text-white/80 leading-relaxed">
            <span className="text-white/60 font-semibold">What this feels like inside:</span>{" "}
            {mindState}
          </div>
        ) : null}
       {phaseTruth ? (
  <div className="mt-3 text-sm text-white/80 leading-relaxed">
    <span className="text-white/60 font-semibold">Truth of this phase:</span>{" "}
    {phaseTruth}
  </div>
) : null}

{oneDecision ? (
  <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
    <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
      The one decision that changes this phase
    </div>
    <div className="mt-1 text-sm text-white/80 leading-relaxed">
      {oneDecision}
    </div>
  </div>
) : null}
{biggestMistake ? (
  <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
    <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
      The mistake that will cost you the most in this phase
    </div>
    <div className="mt-1 text-sm text-white/80 leading-relaxed">
      {biggestMistake}
    </div>
  </div>
) : null}
        {areas.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {areas.slice(0, 5).map((a: any, i: number) => {
              const domain = String(a?.domain ?? a?.area ?? "Life").trim();
              const what = String(a?.what ?? a?.headline ?? "").trim();
              const feel = String(a?.feel ?? a?.feeling ?? "").trim();
              const events: string[] = Array.isArray(a?.events)
                ? a.events.map((x: any) => String(x).trim()).filter(Boolean)
                : [];

              return (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-slate-100">
                    {domain}
                  </div>

                  {what ? (
                    <div className="mt-2 text-sm text-white/80 leading-relaxed">
                      {what}
                    </div>
                  ) : null}

                  {feel ? (
                    <div className="mt-2 text-xs text-white/70">
                      <span className="text-white/60 font-semibold">How it feels:</span>{" "}
                      {feel}
                    </div>
                  ) : null}

                  {events.length ? (
                    <div className="mt-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Likely events
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-white/70">
                        {events.slice(0, 3).map((x: string, j: number) => (
                          <li key={j}>• {x}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {whyNow.length ? (
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Why this phase is active
            </div>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              {whyNow.slice(0, 5).map((x: string, i: number) => (
                <li key={i}>• {x}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {whatToDoNow.length ? (
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              What this phase is asking from you
            </div>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              {whatToDoNow.slice(0, 5).map((x: string, i: number) => (
                <li key={i}>• {x}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
{probabilities.length ? (
  <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
    <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
      Probability of Major Themes (Next 90 Days)
    </div>

    <div className="mt-3 space-y-2">
      {probabilities.slice(0, 5).map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between text-sm">
          <span className="text-white/80">{p.label}</span>
          <span className="text-slate-100 font-semibold">
            {p.probability}%
          </span>
        </div>
      ))}
    </div>
  </div>
) : null}
      {/* The Next Turn */}
      {nextShift ? (
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              The Next Turn
            </div>
            {nextShift?.whenISO ? (
              <div className="text-xs text-white/60">
                {String(nextShift.whenISO).slice(0, 10)}
              </div>
            ) : null}
          </div>

          {nextShift?.whatChanges ? (
            <div className="mt-2 text-sm text-white/80 leading-relaxed">
              {String(nextShift.whatChanges)}
            </div>
          ) : null}

          {Array.isArray(nextShift?.watchFor) && nextShift.watchFor.length ? (
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                What you will notice
              </div>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                {nextShift.watchFor.slice(0, 4).map((x: string, i: number) => (
                  <li key={i}>• {x}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {Array.isArray(nextShift?.realLifeScenarios) && nextShift.realLifeScenarios.length ? (
  <div className="mt-4">
    <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
      What this may look like in real life
    </div>
    <ul className="mt-2 space-y-1 text-sm text-white/80">
      {nextShift.realLifeScenarios.slice(0, 3).map((x: string, i: number) => (
        <li key={i}>• {x}</li>
      ))}
    </ul>
  </div>
) : null}

          {Array.isArray(nextShift?.do) && nextShift.do.length ? (
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                What to do
              </div>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                {nextShift.do.slice(0, 3).map((x: string, i: number) => (
                  <li key={i}>• {x}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      {mostLikelyNextEvent ? (
  <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
        {String(mostLikelyNextEvent.title ?? "The event most likely to happen next")}
      </div>
      {mostLikelyNextEvent?.whenISO ? (
        <div className="text-xs text-white/60">
          {String(mostLikelyNextEvent.whenISO).slice(0, 10)}
        </div>
      ) : null}
    </div>

    {mostLikelyNextEvent?.event ? (
      <div className="mt-2 text-sm text-white/80 leading-relaxed">
        {String(mostLikelyNextEvent.event)}
      </div>
    ) : null}

    {mostLikelyNextEvent?.whyLikely ? (
      <div className="mt-3 text-sm text-white/70 leading-relaxed">
        <span className="text-white/60 font-semibold">Why this is likely:</span>{" "}
        {String(mostLikelyNextEvent.whyLikely)}
      </div>
    ) : null}

    {Array.isArray(mostLikelyNextEvent?.signs) && mostLikelyNextEvent.signs.length ? (
      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          Signs it has started
        </div>
        <ul className="mt-2 space-y-1 text-sm text-white/80">
          {mostLikelyNextEvent.signs.slice(0, 3).map((x: string, i: number) => (
            <li key={i}>• {x}</li>
          ))}
        </ul>
      </div>
    ) : null}

    {mostLikelyNextEvent?.bestResponse ? (
      <div className="mt-4 text-sm text-white/80 leading-relaxed">
        <span className="text-white/60 font-semibold">Best response:</span>{" "}
        {String(mostLikelyNextEvent.bestResponse)}
      </div>
    ) : null}
  </div>
) : null}
{strategicFocus ? (
  <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
    <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
      {String(strategicFocus.title ?? "Your Strategic Focus for the Next 90 Days")}
    </div>

    {strategicFocus?.text ? (
      <div className="mt-2 text-sm text-white/80 leading-relaxed">
        {String(strategicFocus.text)}
      </div>
    ) : null}

    {Array.isArray(strategicFocus?.bullets) && strategicFocus.bullets.length ? (
      <ul className="mt-4 space-y-1 text-sm text-white/80">
        {strategicFocus.bullets.slice(0, 3).map((x: string, i: number) => (
          <li key={i}>• {x}</li>
        ))}
      </ul>
    ) : null}
  </div>
) : null}
      {/* Your Next 4 Weeks */}
      {weekly.length ? (
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Your Next 4 Weeks
          </div>
          <div className="mt-2 text-sm text-white/70">
            Read this as the weekly movement of the phase — where the pressure, clarity, and effort are likely to go.
          </div>

          <div className="mt-3 space-y-3">
            {weekly.slice(0, 4).map((w: any, i: number) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-100">
                    Week {w.week}
                  </div>
                  <div className="text-xs text-white/60">{w.range}</div>
                </div>

                <div className="mt-2 text-sm text-white/80 leading-relaxed">
                  {w.focus}
                </div>

                <div className="mt-2 text-xs text-white/70">
                  <span className="text-white/60 font-semibold">Do:</span>{" "}
                  {w.action}
                </div>
                <div className="mt-1 text-xs text-white/70">
                  <span className="text-white/60 font-semibold">Avoid:</span>{" "}
                  {w.avoid}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Remedies */}
      {remedies ? (
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Remedies for This Phase
          </div>
          <div className="mt-2 text-sm text-white/70">
            These remedies are meant to reduce the pressure of this phase, steady the mind, and help you move through it with less friction.
          </div>

          {Array.isArray(remedies.immediate) && remedies.immediate.length ? (
            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-100">Start today</div>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                {remedies.immediate.slice(0, 4).map((x: string, i: number) => (
                  <li key={i}>• {x}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {Array.isArray(remedies.stabilizer30d) && remedies.stabilizer30d.length ? (
            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-100">30-day stabilizer</div>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                {remedies.stabilizer30d.slice(0, 4).map((x: string, i: number) => (
                  <li key={i}>• {x}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {Array.isArray(remedies.spiritual) && remedies.spiritual.length ? (
            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-100">Spiritual support</div>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                {remedies.spiritual.slice(0, 4).map((x: string, i: number) => (
                  <li key={i}>• {x}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {Array.isArray(remedies.avoid) && remedies.avoid.length ? (
            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-100">Avoid for now</div>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                {remedies.avoid.slice(0, 3).map((x: string, i: number) => (
                  <li key={i}>• {x}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Ask Sarathi */}
      {chatPrompts.length ? (
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Ask Sārathi
          </div>
          <div className="mt-2 text-sm text-white/70">
            Use these when you want a direct answer on one area of life.
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {chatPrompts.slice(0, 6).map((c: any, i: number) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-sm font-semibold text-slate-100">{c.label}</div>
                <div className="mt-1 text-xs text-white/70">{c.prompt}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LifeReportShell;
  /* ---------------- Prefill wrapper (disabled for now) ----------------
    IMPORTANT:
    - Keep any experimental wrappers ABOVE the export default.
    - Do NOT put any "const", "function", "type", "import", "export" inside JSX return blocks.
  --------------------------------------------------------------------- */
  // (disabled)
  // export function LifeReportShellPrefilled() {
  //   return <LifeReportShell />;
  // }
