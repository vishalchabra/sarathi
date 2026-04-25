"use client";

import { useMemo, useState } from "react";

type TransitRow = {
  id?: string;
  startISO?: string;
  endISO?: string;
  dateISO?: string;
  date?: string;
  from?: string;
  fromDateISO?: string;
  to?: string;
  toDateISO?: string;
  planet?: string;
  name?: string;
  body?: string;
  transitPlanet?: string;
  target?: string;
  eventType?: string;
  type?: string;
  title?: string;
  transitSign?: string;
  sign?: string;
  toSign?: string;
  newSign?: string;
  fromSign?: string;
  oldSign?: string;
  rashi?: string;
  nakshatra?: string | null;
  toNakshatra?: string | null;
  newNakshatra?: string | null;
  fromNakshatra?: string | null;
  oldNakshatra?: string | null;
  pada?: number | null;
  transitHouse?: number;
  house?: number;
  retrograde?: boolean | null;
  [key: string]: any;
};

type UpcomingTransitBuckets = {
  moonTransits?: TransitRow[];
  planetaryTransits?: TransitRow[];
  allEvents?: TransitRow[];
};

type Props = {
  transitWindows?: TransitRow[];
  transitNow?: TransitRow[] | any;
  upcomingTransits?: UpcomingTransitBuckets | null;
  currentDasha?: any;
  currentDashaLabel?: string;
  ascSign?: string | null;
};

type MajorEvent = {
  id: string;
  dateISO: string;
  endISO: string;
  planet: string;
  eventLabel: string;
  fromSign: string | null;
  toSign: string | null;
  fromNakshatra: string | null;
  toNakshatra: string | null;
  pada: number | null;
  house: number | null;
  motion: string | null;
  importance: number;
  source: "upcoming" | "window" | "current";
  raw: TransitRow;
};

const MAJOR_PLANETS = new Set(["Jupiter", "Saturn", "Rahu", "Ketu"]);
const DEFAULT_PLANETS = ["Jupiter", "Saturn", "Rahu", "Ketu"];
const ALL_PLANETS = ["Jupiter", "Saturn", "Rahu", "Ketu", "Mars", "Venus", "Mercury", "Sun", "Moon"];

const SIGNS_12 = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const NAK_TO_SIGN: Record<string, string> = {
  Ashwini: "Aries",
  Bharani: "Aries",
  Krittika: "Aries",
  Rohini: "Taurus",
  Mrigashira: "Taurus",
  Ardra: "Gemini",
  Punarvasu: "Gemini",
  Pushya: "Cancer",
  Ashlesha: "Cancer",
  Magha: "Leo",
  "Purva Phalguni": "Leo",
  "Uttara Phalguni": "Leo",
  Hasta: "Virgo",
  Chitra: "Virgo",
  Swati: "Libra",
  Vishakha: "Libra",
  Anuradha: "Scorpio",
  Jyeshtha: "Scorpio",
  Mula: "Sagittarius",
  "Purva Ashadha": "Sagittarius",
  "Uttara Ashadha": "Sagittarius",
  Shravana: "Capricorn",
  Dhanishta: "Capricorn",
  Shatabhisha: "Aquarius",
  "Purva Bhadrapada": "Aquarius",
  "Uttara Bhadrapada": "Pisces",
  Revati: "Pisces",
};

function normalizePlanet(value: any) {
  const text = String(value ?? "").trim();
  const aliases: Record<string, string> = {
    Su: "Sun",
    Mo: "Moon",
    Ma: "Mars",
    Me: "Mercury",
    Ju: "Jupiter",
    Ve: "Venus",
    Sa: "Saturn",
    Ra: "Rahu",
    Ke: "Ketu",
  };

  return aliases[text] ?? text;
}

function cleanLabel(value: any) {
  const raw = String(value ?? "").trim();
  const key = raw.toLowerCase().replace(/\s+/g, "_");

  const labels: Record<string, string> = {
    sign_ingress: "Rashi change",
    rashi_ingress: "Rashi change",
    nakshatra_ingress: "Nakshatra change",
    retrograde_start: "Retrograde starts",
    retrograde_end: "Retrograde ends",
    retrograde_station: "Retrograde starts",
    direct_station: "Direct motion starts",
    conjunction: "Conjunction",
    aspect_exact: "Aspect peak",
  };

  return (
    labels[key] ??
    raw
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (m) => m.toUpperCase())
  );
}

function parseDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(value?: string | null) {
  const d = parseDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDate(row: TransitRow) {
  return (
    row.startISO ??
    row.dateISO ??
    row.date ??
    row.from ??
    row.fromDateISO ??
    row.startDate ??
    null
  );
}

function getEndDate(row: TransitRow) {
  return row.endISO ?? row.to ?? row.toDateISO ?? getDate(row);
}

function getNak(row: TransitRow) {
  return (
    row.toNakshatra ??
    row.newNakshatra ??
    row.nakshatra ??
    row.moonNakshatra ??
    null
  );
}

function getFromNak(row: TransitRow) {
  return row.fromNakshatra ?? row.oldNakshatra ?? null;
}

function getToSign(row: TransitRow) {
  const nak = getNak(row);

  return (
    row.toSign ??
    row.newSign ??
    row.transitSign ??
    row.sign ??
    row.rashi ??
    (nak ? NAK_TO_SIGN[String(nak).trim()] : null) ??
    null
  );
}

function getFromSign(row: TransitRow) {
  return row.fromSign ?? row.oldSign ?? null;
}

function houseFromSign(sign?: string | null, ascSign?: string | null) {
  if (!sign || !ascSign) return null;

  const signIdx = SIGNS_12.findIndex((x) => x.toLowerCase() === String(sign).toLowerCase());
  const ascIdx = SIGNS_12.findIndex((x) => x.toLowerCase() === String(ascSign).toLowerCase());

  if (signIdx < 0 || ascIdx < 0) return null;
  return ((signIdx - ascIdx + 12) % 12) + 1;
}

function readHouse(value: any) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 12 ? n : null;
}

function isRashiChange(row: TransitRow, label: string) {
  const key = label.toLowerCase();
  return (
    key.includes("rashi change") ||
    key.includes("sign ingress") ||
    key.includes("rashi ingress") ||
    key.includes("sign change") ||
    !!row.toSign ||
    !!row.newSign
  );
}

function isNakshatraChange(row: TransitRow, label: string) {
  const key = label.toLowerCase();
  return (
    key.includes("nakshatra change") ||
    key.includes("nakshatra ingress") ||
    !!row.toNakshatra ||
    !!row.newNakshatra
  );
}

function isMotionEvent(label: string) {
  const key = label.toLowerCase();
  return key.includes("retrograde") || key.includes("direct motion") || key.includes("station");
}

function importanceFor(row: TransitRow, planet: string, label: string) {
  let score = 0;

  if (MAJOR_PLANETS.has(planet)) score += 10;
  if (planet === "Saturn") score += 3;
  if (planet === "Jupiter") score += 3;
  if (planet === "Rahu" || planet === "Ketu") score += 2;

  if (isRashiChange(row, label)) score += 8;
  if (isMotionEvent(label)) score += 7;
  if (isNakshatraChange(row, label)) score += 3;

  return score;
}

function normalizeEvent(
  row: TransitRow,
  idx: number,
  source: MajorEvent["source"],
  ascSign?: string | null
): MajorEvent | null {
  if (!row || typeof row !== "object") return null;

  const dateISO = getDate(row);
  if (!dateISO) return null;

  const planet = normalizePlanet(row.planet ?? row.name ?? row.body ?? row.transitPlanet);
  if (!planet) return null;

  const eventLabel = cleanLabel(row.target ?? row.eventType ?? row.type ?? row.title ?? "Transit");
  const toSign = getToSign(row);
  const fromSign = getFromSign(row);
  const toNakshatra = getNak(row);
  const fromNakshatra = getFromNak(row);

  const house =
    readHouse(row.transitHouse ?? row.house) ?? houseFromSign(toSign, ascSign);

  const motion =
    eventLabel.toLowerCase().includes("retrograde")
      ? "Retrograde"
      : eventLabel.toLowerCase().includes("direct")
      ? "Direct"
      : row.retrograde === true
      ? "Retrograde"
      : row.retrograde === false
      ? "Direct"
      : null;

  const importance = importanceFor(row, planet, eventLabel);

  return {
    id: String(row.id ?? `${source}-${idx}-${planet}-${dateISO}-${eventLabel}-${toSign ?? ""}-${toNakshatra ?? ""}`),
    dateISO,
    endISO: getEndDate(row) ?? dateISO,
    planet,
    eventLabel,
    fromSign,
    toSign,
    fromNakshatra,
    toNakshatra,
    pada: row.pada ?? null,
    house,
    motion,
    importance,
    source,
    raw: row,
  };
}

function collectEvents(params: {
  transitWindows?: TransitRow[];
  upcomingTransits?: UpcomingTransitBuckets | null;
  transitNow?: TransitRow[] | any;
  ascSign?: string | null;
}) {
  const events: MajorEvent[] = [];

  (Array.isArray(params.transitWindows) ? params.transitWindows : []).forEach((row, idx) => {
    const event = normalizeEvent(row, idx, "window", params.ascSign);
    if (event) events.push(event);
  });

  [
    ...(Array.isArray(params.upcomingTransits?.planetaryTransits)
      ? params.upcomingTransits!.planetaryTransits!
      : []),
    ...(Array.isArray(params.upcomingTransits?.allEvents)
      ? params.upcomingTransits!.allEvents!
      : []),
  ].forEach((row, idx) => {
    const event = normalizeEvent(row, idx, "upcoming", params.ascSign);
    if (event) events.push(event);
  });

  (Array.isArray(params.transitNow) ? params.transitNow : []).forEach((row, idx) => {
    const event = normalizeEvent(
      {
        ...row,
        startISO: new Date().toISOString().slice(0, 10),
        eventType: "current_transit",
      },
      idx,
      "current",
      params.ascSign
    );
    if (event) events.push(event);
  });

  const seen = new Set<string>();

  return events.filter((event) => {
    const key = [
      event.dateISO,
      event.planet,
      event.eventLabel,
      event.toSign ?? "",
      event.toNakshatra ?? "",
      event.house ?? "",
    ].join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getDashaPlanet(node: any) {
  if (!node) return null;
  if (typeof node === "string") return node;
  return node?.planet ?? node?.lord ?? node?.name ?? node?.dashaLord ?? null;
}

function dashaLabel(currentDasha: any, fallback?: string) {
  const md =
    getDashaPlanet(currentDasha?.md) ??
    getDashaPlanet(currentDasha?.mahadasha) ??
    (typeof currentDasha?.md === "string" ? currentDasha.md : null);

  const ad =
    getDashaPlanet(currentDasha?.ad) ??
    getDashaPlanet(currentDasha?.antardasha) ??
    (typeof currentDasha?.ad === "string" ? currentDasha.ad : null);

  const pd =
    getDashaPlanet(currentDasha?.pd) ??
    getDashaPlanet(currentDasha?.pratyantardasha) ??
    (typeof currentDasha?.pd === "string" ? currentDasha.pd : null);

  const parts = [
    md ? `MD ${normalizePlanet(md)}` : null,
    ad ? `AD ${normalizePlanet(ad)}` : null,
    pd ? `PD ${normalizePlanet(pd)}` : null,
  ].filter(Boolean);

  return parts.length ? parts.join(" / ") : fallback || "—";
}

function eventLine(event: MajorEvent) {
  if (isRashiChange(event.raw, event.eventLabel)) {
    return `${event.planet} ${event.fromSign ? `${event.fromSign} → ` : "→ "}${event.toSign ?? "new rashi"}`;
  }

  if (isNakshatraChange(event.raw, event.eventLabel)) {
    return `${event.planet} ${event.fromNakshatra ? `${event.fromNakshatra} → ` : "→ "}${event.toNakshatra ?? "new nakshatra"}`;
  }

  return `${event.planet} • ${event.eventLabel}`;
}

export default function MajorTransitTimelineCard({
  transitWindows = [],
  transitNow = [],
  upcomingTransits = null,
  currentDasha,
  currentDashaLabel,
  ascSign = null,
}: Props) {
  const [months, setMonths] = useState(12);
  const [planetMode, setPlanetMode] = useState<"major" | "all">("major");
  const [eventLevel, setEventLevel] = useState<"major" | "nakshatra">("major");
  const [openId, setOpenId] = useState<string | null>(null);

  const now = useMemo(() => new Date(), []);
  const horizonEnd = useMemo(() => addMonths(now, months), [now, months]);

  const allEvents = useMemo(
    () =>
      collectEvents({
        transitWindows,
        upcomingTransits,
        transitNow,
        ascSign,
      }),
    [transitWindows, upcomingTransits, transitNow, ascSign]
  );

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((event) => {
        const start = parseDate(event.dateISO);
        if (!start) return false;

        if (start < now || start > horizonEnd) return false;

        if (planetMode === "major" && !DEFAULT_PLANETS.includes(event.planet)) {
          return false;
        }

        if (eventLevel === "major") {
          return (
            isRashiChange(event.raw, event.eventLabel) ||
            isMotionEvent(event.eventLabel) ||
            (MAJOR_PLANETS.has(event.planet) && event.importance >= 10)
          );
        }

        return (
          isRashiChange(event.raw, event.eventLabel) ||
          isMotionEvent(event.eventLabel) ||
          isNakshatraChange(event.raw, event.eventLabel)
        );
      })
      .sort((a, b) => {
        const dateDiff = a.dateISO.localeCompare(b.dateISO);
        if (dateDiff !== 0) return dateDiff;
        return b.importance - a.importance;
      })
      .slice(0, eventLevel === "major" ? 20 : 60);
  }, [allEvents, now, horizonEnd, planetMode, eventLevel]);

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Major Transit Timeline
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
            Start with the biggest planetary movements first. Expand any row for
            rashi, nakshatra, house and motion details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Period
            </label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
            >
              <option value={3}>Next 3 months</option>
              <option value={6}>Next 6 months</option>
              <option value={12}>Next 12 months</option>
              <option value={24}>Next 24 months</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Planets
            </label>
            <select
              value={planetMode}
              onChange={(e) => setPlanetMode(e.target.value as "major" | "all")}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
            >
              <option value="major">Major only</option>
              <option value="all">All planets</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Level
            </label>
            <select
              value={eventLevel}
              onChange={(e) => setEventLevel(e.target.value as "major" | "nakshatra")}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
            >
              <option value="major">Rashi + motion</option>
              <option value="nakshatra">Include nakshatras</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Active Dasha
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-950">
            {dashaLabel(currentDasha, currentDashaLabel)}
          </div>
          <div className="mt-1 text-xs text-slate-500">Timing context</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Events Analyzed
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {allEvents.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Raw timing events scanned</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Shown
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {filteredEvents.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Events after filters</div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[110px_1fr_110px_110px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
          <div>Date</div>
          <div>Event</div>
          <div>House</div>
          <div>Details</div>
        </div>

        {!filteredEvents.length ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            No major transit events found for this filter.
          </div>
        ) : null}

        <div className="divide-y divide-slate-100">
          {filteredEvents.map((event) => {
            const isOpen = openId === event.id;

            return (
              <div key={event.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : event.id)}
                  className="grid w-full grid-cols-[110px_1fr_110px_110px] gap-3 px-4 py-4 text-left text-sm transition hover:bg-slate-50"
                >
                  <div className="font-medium text-slate-500">
                    {formatDate(event.dateISO)}
                  </div>

                  <div>
                    <div className="font-semibold text-slate-900">
                      {eventLine(event)}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        {event.eventLabel}
                      </span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        {event.planet}
                      </span>
                    </div>
                  </div>

                  <div className="text-slate-700">
                    {event.house ? `H${event.house}` : "—"}
                  </div>

                  <div className="text-sm font-medium text-slate-500">
                    {isOpen ? "Hide" : "View"}
                  </div>
                </button>

                {isOpen ? (
                  <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4">
                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Planet
                        </div>
                        <div className="mt-1 font-semibold text-slate-900">
                          {event.planet}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Rashi
                        </div>
                        <div className="mt-1 font-semibold text-slate-900">
                          {event.fromSign ? `${event.fromSign} → ` : ""}
                          {event.toSign ?? "—"}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Nakshatra
                        </div>
                        <div className="mt-1 font-semibold text-slate-900">
                          {event.fromNakshatra ? `${event.fromNakshatra} → ` : ""}
                          {event.toNakshatra ?? "—"}
                          {event.pada ? ` / Pada ${event.pada}` : ""}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Motion / House
                        </div>
                        <div className="mt-1 font-semibold text-slate-900">
                          {event.motion ?? "—"} {event.house ? `• H${event.house}` : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Default view shows Jupiter, Saturn, Rahu and Ketu rashi/motion level events.
        Use “Include nakshatras” for finer timing.
      </div>
    </section>
  );
}
