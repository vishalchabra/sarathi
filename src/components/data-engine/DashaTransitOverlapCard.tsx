"use client";

import { useMemo, useState } from "react";

type TransitRow = {
  id?: string;
  dateISO?: string;
  startISO?: string;
  endISO?: string;
  date?: string;
  planet?: string;
  transitPlanet?: string;
  name?: string;
  body?: string;
  type?: string;
  eventType?: string;
  target?: string;
  title?: string;
  sign?: string;
  transitSign?: string;
  toSign?: string;
  fromSign?: string;
  nakshatra?: string | null;
  toNakshatra?: string | null;
  fromNakshatra?: string | null;
  pada?: number | null;
  house?: number | null;
  transitHouse?: number | null;
  houseFromLagna?: number | null;
  retrograde?: boolean | null;
  lon?: number | null;
  [key: string]: any;
};

type UpcomingTransitBuckets = {
  moonTransits?: TransitRow[];
  planetaryTransits?: TransitRow[];
  allEvents?: TransitRow[];
};

type Props = {
  upcomingTransits?: UpcomingTransitBuckets | null;
  currentDasha?: any;
  currentDashaLabel?: string;
};

type DashaLevel = "MD" | "AD" | "PD";

type OverlapRow = {
  id: string;
  level: DashaLevel;
  dashaPlanet: string;
  dateISO: string;
  eventPlanet: string;
  eventLabel: string;
  sign: string | null;
  nakshatra: string | null;
  pada: number | null;
  house: number | null;
  retrograde: boolean | null;
  reason: string;
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
    aspect_exact: "Aspect peak",
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

function getCurrentDashaPlanets(currentDasha: any) {
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

function getEventLabel(row: TransitRow) {
  return cleanEventLabel(row?.type ?? row?.eventType ?? row?.target ?? row?.title);
}

function getEventSign(row: TransitRow) {
  return (
    row?.toSign ??
    row?.transitSign ??
    row?.sign ??
    row?.rashi ??
    null
  );
}

function getEventNakshatra(row: TransitRow) {
  return row?.toNakshatra ?? row?.nakshatra ?? null;
}

function getEventHouse(row: TransitRow) {
  const raw = row?.houseFromLagna ?? row?.transitHouse ?? row?.house;
  const n = Number(raw);

  return Number.isFinite(n) && n >= 1 && n <= 12 ? n : null;
}

function buildEvents(upcomingTransits?: UpcomingTransitBuckets | null) {
  return [
    ...(Array.isArray(upcomingTransits?.planetaryTransits)
      ? upcomingTransits!.planetaryTransits!
      : []),
    ...(Array.isArray(upcomingTransits?.moonTransits)
      ? upcomingTransits!.moonTransits!
      : []),
    ...(Array.isArray(upcomingTransits?.allEvents)
      ? upcomingTransits!.allEvents!
      : []),
  ].filter(Boolean);
}

function buildOverlaps(params: {
  upcomingTransits?: UpcomingTransitBuckets | null;
  currentDasha?: any;
}) {
  const dashaPlanets = getCurrentDashaPlanets(params.currentDasha);
  const events = buildEvents(params.upcomingTransits);
  const overlaps: OverlapRow[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    const eventDate = getDate(event);
    if (!eventDate) continue;

    const eventPlanet = getEventPlanet(event);
    if (!eventPlanet) continue;

    for (const dasha of dashaPlanets) {
      if (!dasha.planet) continue;

      const isSamePlanet =
        eventPlanet.toLowerCase() === dasha.planet.toLowerCase();

      const natalPlanet =
        event?.natalPlanet || event?.targetPlanet || event?.natalTarget;

      const isNatalContactToDasha =
        natalPlanet &&
        normalizePlanet(natalPlanet).toLowerCase() ===
          dasha.planet.toLowerCase();

      if (!isSamePlanet && !isNatalContactToDasha) continue;

      const eventLabel = getEventLabel(event);
      const reason = isSamePlanet
        ? `${dasha.level} lord ${dasha.planet} has a transit event`
        : `Transit contacts ${dasha.level} lord ${dasha.planet}`;

      const key = [
        dasha.level,
        dasha.planet,
        eventDate,
        eventPlanet,
        eventLabel,
        getEventSign(event) ?? "",
        getEventNakshatra(event) ?? "",
      ].join("|");

      if (seen.has(key)) continue;
      seen.add(key);

      overlaps.push({
        id: key,
        level: dasha.level,
        dashaPlanet: dasha.planet,
        dateISO: eventDate,
        eventPlanet,
        eventLabel,
        sign: getEventSign(event),
        nakshatra: getEventNakshatra(event),
        pada: event?.pada ?? null,
        house: getEventHouse(event),
        retrograde:
          typeof event?.retrograde === "boolean" ? event.retrograde : null,
        reason,
        raw: event,
      });
    }
  }

  return overlaps.sort((a, b) => {
    const dateDiff = String(a.dateISO).localeCompare(String(b.dateISO));
    if (dateDiff !== 0) return dateDiff;

    const order: Record<DashaLevel, number> = { MD: 1, AD: 2, PD: 3 };
    return order[a.level] - order[b.level];
  });
}

function groupedByLevel(rows: OverlapRow[]) {
  const levels: DashaLevel[] = ["MD", "AD", "PD"];

  return levels.map((level) => ({
    level,
    rows: rows.filter((row) => row.level === level),
  }));
}

export default function DashaTransitOverlapCard({
  upcomingTransits = null,
  currentDasha,
  currentDashaLabel,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<"all" | DashaLevel>("all");

  const overlaps = useMemo(
    () => buildOverlaps({ upcomingTransits, currentDasha }),
    [upcomingTransits, currentDasha]
  );

  const dashaPlanets = useMemo(
    () => getCurrentDashaPlanets(currentDasha),
    [currentDasha]
  );

  const filtered = useMemo(
    () =>
      levelFilter === "all"
        ? overlaps
        : overlaps.filter((row) => row.level === levelFilter),
    [overlaps, levelFilter]
  );

  const grouped = useMemo(() => groupedByLevel(filtered), [filtered]);

  const runningChain =
    dashaPlanets.map((row) => row.planet).filter(Boolean).join(" / ") ||
    currentDashaLabel ||
    "—";

  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Dasha + Transit Overlap
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
            Shows transit events involving current MD / AD / PD lords. This is
            a timing cross-check, not an interpretation.
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
              Filter
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
            Overlaps Found
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {overlaps.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Matching transit rows</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Events Scanned
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {buildEvents(upcomingTransits).length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Upcoming transit rows</div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {!filtered.length ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No dasha-transit overlaps found in the current upcoming transit
            set.
          </div>
        ) : null}

        {grouped.map((group) =>
          group.rows.length ? (
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
                    {group.rows[0]?.dashaPlanet}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-500">
                  {group.rows.length} overlap{group.rows.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {group.rows.map((row) => {
                  const isOpen = openId === row.id;

                  return (
                    <div key={row.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : row.id)}
                        className="grid w-full grid-cols-1 gap-3 px-4 py-3 text-left transition hover:bg-slate-50 md:grid-cols-[110px_minmax(0,1fr)_80px]"
                      >
                        <div className="text-sm font-medium text-slate-500">
                          {formatDate(row.dateISO)}
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {row.eventPlanet} • {row.eventLabel}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {[
                              row.house ? `H${row.house}` : null,
                              row.sign ? `Rashi: ${row.sign}` : null,
                              row.nakshatra ? `Nakshatra: ${row.nakshatra}` : null,
                              row.pada ? `Pada ${row.pada}` : null,
                            ]
                              .filter(Boolean)
                              .join(" • ") || row.reason}
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
                                Dasha Link
                              </div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {row.level} {row.dashaPlanet}
                              </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Event
                              </div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {row.eventLabel}
                              </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Position
                              </div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {[
                                  row.sign,
                                  row.nakshatra,
                                  row.pada ? `Pada ${row.pada}` : null,
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
                                  row.house ? `H${row.house}` : null,
                                  row.retrograde === true
                                    ? "Retrograde"
                                    : row.retrograde === false
                                    ? "Direct"
                                    : null,
                                ]
                                  .filter(Boolean)
                                  .join(" • ") || "—"}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
                            {row.reason}
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
