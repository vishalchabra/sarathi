"use client";

import { useMemo, useState } from "react";

type TransitRow = {
  id?: string;
  dateISO?: string;
  startISO?: string;
  endISO?: string;
  date?: string;
  from?: string;
  fromDateISO?: string;
  transitPlanet?: string;
  planet?: string;
  name?: string;
  body?: string;
  type?: string;
  eventType?: string;
  target?: string;
  title?: string;
  fromSign?: string | null;
  toSign?: string | null;
  sign?: string | null;
  transitSign?: string | null;
  rashi?: string | null;
  fromNakshatra?: string | null;
  toNakshatra?: string | null;
  nakshatra?: string | null;
  pada?: number | null;
  houseFromLagna?: number | null;
  transitHouse?: number | null;
  house?: number | null;
  retrograde?: boolean | null;
  lon?: number | null;
  [key: string]: any;
};

type UpcomingTransitBuckets = {
  moonTransits?: TransitRow[];
  planetaryTransits?: TransitRow[];
  allEvents?: TransitRow[];
};

type DashaLevel = "MD" | "AD" | "PD";

type Props = {
  upcomingTransits?: UpcomingTransitBuckets | null;
  currentDasha?: any;
  currentDashaLabel?: string;
};

type TrackerEvent = {
  id: string;
  level: DashaLevel;
  dashaPlanet: string;
  dateISO: string;
  eventPlanet: string;
  eventLabel: string;
  fromSign: string | null;
  toSign: string | null;
  fromNakshatra: string | null;
  toNakshatra: string | null;
  sign: string | null;
  nakshatra: string | null;
  pada: number | null;
  house: number | null;
  retrograde: boolean | null;
  lon: number | null;
  raw: TransitRow;
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

function cleanEventLabel(value: any) {
  const raw = String(value ?? "Transit").trim();
  const key = raw.toLowerCase().replace(/\s+/g, "_");

  const labels: Record<string, string> = {
    sign_ingress: "Rashi change",
    rashi_ingress: "Rashi change",
    nakshatra_ingress: "Nakshatra change",
    retrograde_start: "Retrograde starts",
    retrograde_end: "Retrograde ends",
    retrograde_station: "Retrograde starts",
    direct_station: "Direct motion starts",
    natal_contact: "Natal contact",
    natal_contact_window: "Natal contact window",
    current_transit: "Current transit",
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

function getDashaPlanet(node: any) {
  if (!node) return null;
  if (typeof node === "string") return normalizePlanet(node);

  return normalizePlanet(
    node?.planet ??
      node?.lord ??
      node?.name ??
      node?.dashaLord ??
      node?.graha ??
      null
  );
}

function getDashaLevels(currentDasha: any) {
  const md =
    getDashaPlanet(currentDasha?.md) ??
    getDashaPlanet(currentDasha?.mahadasha) ??
    getDashaPlanet(currentDasha?.mahaDasha);

  const ad =
    getDashaPlanet(currentDasha?.ad) ??
    getDashaPlanet(currentDasha?.antardasha) ??
    getDashaPlanet(currentDasha?.antarDasha);

  const pd =
    getDashaPlanet(currentDasha?.pd) ??
    getDashaPlanet(currentDasha?.pratyantardasha) ??
    getDashaPlanet(currentDasha?.pratyantarDasha);

  return [
    { level: "MD" as DashaLevel, planet: md },
    { level: "AD" as DashaLevel, planet: ad },
    { level: "PD" as DashaLevel, planet: pd },
  ].filter((row) => row.planet);
}

function getDate(row: TransitRow) {
  return (
    row?.dateISO ??
    row?.startISO ??
    row?.date ??
    row?.from ??
    row?.fromDateISO ??
    null
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const d = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(value);

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getEventPlanet(row: TransitRow) {
  return normalizePlanet(
    row?.transitPlanet ?? row?.planet ?? row?.name ?? row?.body ?? ""
  );
}

function getEventType(row: TransitRow) {
  return String(row?.type ?? row?.eventType ?? row?.target ?? row?.title ?? "");
}

function getEventLabel(row: TransitRow) {
  return cleanEventLabel(getEventType(row));
}

function getSign(row: TransitRow) {
  return row?.toSign ?? row?.transitSign ?? row?.sign ?? row?.rashi ?? null;
}

function getNakshatra(row: TransitRow) {
  return row?.toNakshatra ?? row?.nakshatra ?? null;
}

function getHouse(row: TransitRow) {
  const n = Number(row?.houseFromLagna ?? row?.transitHouse ?? row?.house);
  return Number.isFinite(n) && n >= 1 && n <= 12 ? n : null;
}

function collectTransitRows(upcomingTransits?: UpcomingTransitBuckets | null) {
  const rows = [
    ...(Array.isArray(upcomingTransits?.planetaryTransits)
      ? upcomingTransits!.planetaryTransits!
      : []),
    ...(Array.isArray(upcomingTransits?.allEvents)
      ? upcomingTransits!.allEvents!
      : []),
    ...(Array.isArray(upcomingTransits?.moonTransits)
      ? upcomingTransits!.moonTransits!
      : []),
  ];

  const seen = new Set<string>();

  return rows.filter((row) => {
    const key = [
      getDate(row),
      getEventPlanet(row),
      getEventType(row),
      row?.toSign ?? "",
      row?.toNakshatra ?? "",
      getHouse(row) ?? "",
    ].join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isMovementEvent(row: TransitRow) {
  const type = getEventType(row).toLowerCase();

  return (
    type.includes("sign_ingress") ||
    type.includes("rashi_ingress") ||
    type.includes("nakshatra_ingress") ||
    type.includes("retrograde") ||
    type.includes("direct_station")
  );
}

function buildTrackerEvents(params: {
  upcomingTransits?: UpcomingTransitBuckets | null;
  currentDasha?: any;
}) {
  const dashaLevels = getDashaLevels(params.currentDasha);
  const rows = collectTransitRows(params.upcomingTransits);
  const output: TrackerEvent[] = [];
  const seen = new Set<string>();

  for (const dasha of dashaLevels) {
    if (!dasha.planet) continue;

    for (const row of rows) {
      const eventPlanet = getEventPlanet(row);
      if (!eventPlanet) continue;

      if (eventPlanet.toLowerCase() !== dasha.planet.toLowerCase()) continue;
      if (!isMovementEvent(row)) continue;

      const dateISO = getDate(row);
      if (!dateISO) continue;

      const eventLabel = getEventLabel(row);

      const key = [
        dasha.level,
        dasha.planet,
        dateISO,
        eventPlanet,
        eventLabel,
        row?.toSign ?? "",
        row?.toNakshatra ?? "",
        getHouse(row) ?? "",
      ].join("|");

      if (seen.has(key)) continue;
      seen.add(key);

      output.push({
        id: key,
        level: dasha.level,
        dashaPlanet: dasha.planet,
        dateISO,
        eventPlanet,
        eventLabel,
        fromSign: row?.fromSign ?? null,
        toSign: row?.toSign ?? null,
        fromNakshatra: row?.fromNakshatra ?? null,
        toNakshatra: row?.toNakshatra ?? null,
        sign: getSign(row),
        nakshatra: getNakshatra(row),
        pada: row?.pada ?? null,
        house: getHouse(row),
        retrograde:
          typeof row?.retrograde === "boolean" ? row.retrograde : null,
        lon: typeof row?.lon === "number" ? row.lon : null,
        raw: row,
      });
    }
  }

  return output.sort((a, b) => {
    const dateDiff = String(a.dateISO).localeCompare(String(b.dateISO));
    if (dateDiff !== 0) return dateDiff;

    const order: Record<DashaLevel, number> = { MD: 1, AD: 2, PD: 3 };
    return order[a.level] - order[b.level];
  });
}

function groupByDashaLevel(events: TrackerEvent[], levels: Array<{ level: DashaLevel; planet: string | null }>) {
  return levels.map((item) => ({
    ...item,
    events: events.filter((event) => event.level === item.level),
  }));
}

function movementLine(event: TrackerEvent) {
  if (event.eventLabel === "Rashi change") {
    return `${event.eventPlanet} ${event.fromSign ? `${event.fromSign} → ` : "→ "}${event.toSign ?? event.sign ?? "new rashi"}`;
  }

  if (event.eventLabel === "Nakshatra change") {
    return `${event.eventPlanet} ${event.fromNakshatra ? `${event.fromNakshatra} → ` : "→ "}${event.toNakshatra ?? event.nakshatra ?? "new nakshatra"}`;
  }

  return `${event.eventPlanet} • ${event.eventLabel}`;
}

export default function DashaLordTransitTrackerCard({
  upcomingTransits = null,
  currentDasha,
  currentDashaLabel,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<"all" | DashaLevel>("all");

  const dashaLevels = useMemo(() => getDashaLevels(currentDasha), [currentDasha]);

  const allEvents = useMemo(
    () => buildTrackerEvents({ upcomingTransits, currentDasha }),
    [upcomingTransits, currentDasha]
  );

  const filteredEvents = useMemo(
    () =>
      levelFilter === "all"
        ? allEvents
        : allEvents.filter((event) => event.level === levelFilter),
    [allEvents, levelFilter]
  );

  const grouped = useMemo(
    () => groupByDashaLevel(filteredEvents, dashaLevels as any),
    [filteredEvents, dashaLevels]
  );

  const runningChain =
    dashaLevels.map((row) => row.planet).filter(Boolean).join(" / ") ||
    currentDashaLabel ||
    "—";

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Dasha Lord Transit Tracker
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
            Tracks only the current MD / AD / PD lords and their own rashi,
            nakshatra and motion changes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Current Chain
            </label>
            <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
              {runningChain}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
            >
              <option value="all">All levels</option>
              <option value="MD">MD only</option>
              <option value="AD">AD only</option>
              <option value="PD">PD only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Dasha Lords
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-950">
            {runningChain}
          </div>
          <div className="mt-1 text-xs text-slate-500">MD / AD / PD</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Dasha Lord Events
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {allEvents.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Movement rows for current dasha lords
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Events Scanned
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {collectTransitRows(upcomingTransits).length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Upcoming transit rows</div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {!filteredEvents.length ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No dasha lord movement events found in the current upcoming transit
            set.
          </div>
        ) : null}

        {grouped.map((group) =>
          group.events.length ? (
            <div
              key={group.level}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                    {group.level}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {group.planet}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-500">
                  {group.events.length} event{group.events.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {group.events.map((event) => {
                  const isOpen = openId === event.id;

                  return (
                    <div key={event.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : event.id)}
                        className="grid w-full grid-cols-1 gap-3 px-4 py-3 text-left transition hover:bg-slate-50 md:grid-cols-[110px_minmax(0,1fr)_80px]"
                      >
                        <div className="text-sm font-medium text-slate-500">
                          {formatDate(event.dateISO)}
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {movementLine(event)}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {[
                              event.house ? `H${event.house}` : null,
                              event.sign ? `Rashi: ${event.sign}` : null,
                              event.nakshatra ? `Nakshatra: ${event.nakshatra}` : null,
                              event.pada ? `Pada ${event.pada}` : null,
                            ]
                              .filter(Boolean)
                              .join(" • ") || "Transit movement"}
                          </div>
                        </div>

                        <div className="text-sm font-medium text-slate-500 md:text-right">
                          {isOpen ? "Hide" : "View"}
                        </div>
                      </button>

                      {isOpen ? (
                        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4">
                          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Dasha Level
                              </div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {event.level} {event.dashaPlanet}
                              </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Event
                              </div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {event.eventLabel}
                              </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Position
                              </div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {[
                                  event.sign,
                                  event.nakshatra,
                                  event.pada ? `Pada ${event.pada}` : null,
                                ]
                                  .filter(Boolean)
                                  .join(" • ") || "—"}
                              </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                House / Motion
                              </div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {[
                                  event.house ? `H${event.house}` : null,
                                  event.retrograde === true
                                    ? "Retrograde"
                                    : event.retrograde === false
                                    ? "Direct"
                                    : null,
                                ]
                                  .filter(Boolean)
                                  .join(" • ") || "—"}
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
          ) : null
        )}
      </div>
    </section>
  );
}
