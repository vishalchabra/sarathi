"use client";

type MoonTransitRow = {
  dateISO?: string;
  planet?: string;
  sign?: string;
  nakshatra?: string | null;
  degree?: number | null;
  houseFromLagna?: number | null;
  houseFromMoon?: number | null;
  type?: string;
};

type PlanetaryTransitRow = {
  dateISO?: string;
  transitPlanet?: string;
  natalPlanet?: string;
  type?: string;
  orb?: number | null;
  fromSign?: string | null;
  toSign?: string | null;
  fromNakshatra?: string | null;
  toNakshatra?: string | null;
  sign?: string | null;
  nakshatra?: string | null;
  houseFromLagna?: number | null;
  startISO?: string;
  peakISO?: string;
  endISO?: string;
  minOrb?: number | null;
  hitCount?: number | null;
};

type Props = {
  data?: {
    moonTransits?: MoonTransitRow[];
    planetaryTransits?: PlanetaryTransitRow[];
    allEvents?: any[];
  } | null;
  ascSign?: string | null;
};

const SIGN_TO_NUM: Record<string, number> = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

function houseFromRef(refSignNum: number, currentSignNum: number) {
  return ((currentSignNum - refSignNum + 12) % 12) + 1;
}

function formatDegree(v?: number | null) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}°`;
}

function extractNextPerPlanet(events: PlanetaryTransitRow[]) {
  const map = new Map<string, PlanetaryTransitRow>();

  for (const row of events || []) {
    const planet = String(row.transitPlanet ?? "").trim();
    if (!planet) continue;

    const existing = map.get(planet);
    const rowDate = String(row.dateISO ?? "");
    const existingDate = existing ? String(existing.dateISO ?? "") : "";

    if (!existing || rowDate < existingDate) {
      map.set(planet, row);
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    String(a.dateISO ?? "").localeCompare(String(b.dateISO ?? ""))
  );
}

function getNextEventText(row: PlanetaryTransitRow) {
  if (row.type === "sign_ingress") {
    return row.toSign ? `enters ${row.toSign}` : "sign ingress";
  }
  if (row.type === "retrograde_start") {
    return "turns retrograde";
  }
  if (row.type === "retrograde_end") {
    return "turns direct";
  }
  if (row.type === "nakshatra_ingress") {
    return row.toNakshatra ? `enters ${row.toNakshatra}` : "nakshatra ingress";
  }
  return row.type ?? "—";
}

function getMotionText(row: PlanetaryTransitRow) {
  if (row.type === "retrograde_start") return "Retro";
  if (row.type === "retrograde_end") return "Direct";
  return "Direct";
}

export default function UpcomingTransitsCard({ data, ascSign }: Props) {
  const moonTransits = Array.isArray(data?.moonTransits) ? data!.moonTransits : [];
  const planetaryEvents = Array.isArray(data?.planetaryTransits)
    ? data!.planetaryTransits
    : [];

  const nextPerPlanet = extractNextPerPlanet(planetaryEvents);
  const ascSignNum = SIGN_TO_NUM[String(ascSign ?? "").trim()] ?? 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Upcoming Planetary Shifts
        </h2>
        <p className="mt-1 text-sm text-slate-900">
          Next important movement for each planet.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[color:var(--border)] text-slate-900">
              <tr>
                <th className="px-3 py-2">Planet</th>
                <th className="px-3 py-2">Next Event</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Motion</th>
                <th className="px-3 py-2">House</th>
              </tr>
            </thead>

            <tbody>
              {nextPerPlanet.length ? (
                nextPerPlanet.map((row, i) => {
                  const signForHouse = row.toSign ?? row.sign ?? null;

const signNum = SIGN_TO_NUM[String(signForHouse ?? "").trim()] ?? 0;

const house =
  typeof row.houseFromLagna === "number"
    ? row.houseFromLagna
    : ascSignNum && signNum
    ? houseFromRef(ascSignNum, signNum)
    : null;
                  return (
                    <tr key={`${row.transitPlanet ?? "planet"}-${i}`} className="border-b border-[color:var(--border)]">
                      <td className="px-3 py-2 font-medium text-slate-900">
                        {row.transitPlanet ?? "—"}
                      </td>

                      <td className="px-3 py-2 text-slate-900/80">
                        {getNextEventText(row)}
                      </td>

                      <td className="px-3 py-2 text-slate-900/80">
                        {row.dateISO ?? "—"}
                      </td>

                      <td className="px-3 py-2 text-slate-900/80">
                        {getMotionText(row)}
                      </td>

                      <td className="px-3 py-2 text-slate-900/80">
                        {typeof house === "number" ? `H${house}` : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-slate-900">
                    No upcoming planetary shifts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Moon Transits
        </h2>
        <p className="mt-1 text-sm text-slate-900">
          Daily Moon movement shown separately for timing and day-level reading.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[color:var(--border)] text-slate-900">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Sign</th>
                <th className="px-3 py-2">Nakshatra</th>
                <th className="px-3 py-2">Degree</th>
                <th className="px-3 py-2">House from Lagna</th>
                <th className="px-3 py-2">House from Moon</th>
              </tr>
            </thead>

            <tbody>
              {moonTransits.length ? (
                moonTransits.map((m, i) => (
                  <tr key={`${m.dateISO ?? "date"}-${i}`} className="border-b border-[color:var(--border)]">
                    <td className="px-3 py-2 text-slate-900/80">
                      {m.dateISO ?? "—"}
                    </td>

                    <td className="px-3 py-2 text-slate-900/80">
                      {m.sign ?? "—"}
                    </td>

                    <td className="px-3 py-2 text-slate-900/80">
                      {m.nakshatra ?? "—"}
                    </td>

                    <td className="px-3 py-2 text-slate-900/80">
                      {formatDegree(m.degree)}
                    </td>

                    <td className="px-3 py-2 text-slate-900/80">
                      {typeof m.houseFromLagna === "number" ? `H${m.houseFromLagna}` : "—"}
                    </td>

                    <td className="px-3 py-2 text-slate-900/80">
                      {typeof m.houseFromMoon === "number" ? `H${m.houseFromMoon}` : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-slate-900">
                    No Moon transit rows found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}