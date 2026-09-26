
"use client";

import { useState } from "react";
import MediumNorthIndianChart from "@/components/data-engine/MediumNorthIndianChart";
export type AstrologicalSnapshotData = {
  ascendant?: {
    sign?: string;
    degree?: number;
  } | null;
  natal?: {
    ascendant?: {
      sign?: string;
      degree?: number;
    } | null;
    planets?: Array<{
      planet: string;
      sign?: string;
      degree?: number;
      house?: number;
      nakshatra?: string;
      pada?: number;
      retrograde?: boolean;
    }>;
    ayanamsa?: string;
  };
  dasha?: {
  current?: {
    md?: string | null;
    ad?: string | null;
    activeOn?: string;
    mdStartISO?: string | null;
    mdEndISO?: string | null;
    adStartISO?: string | null;
    adEndISO?: string | null;
  } | null;
  activeForPrediction?: {
    md?: string | null;
    ad?: string | null;
    pd?: string | null;
  } | null;
  stack?: {
    md?: {
      lord?: string | null;
      startISO?: string | null;
      endISO?: string | null;
    };
    ad?: {
      lord?: string | null;
      startISO?: string | null;
      endISO?: string | null;
    };
  } | null;
};
  transits?: {
    planets?: Array<{
      planet: string;
      sign?: string;
      degree?: number;
      houseFromLagna?: number;
      nakshatra?: string;
      retrograde?: boolean;
    }>;
    moonToday?: {
      sign?: string;
      nakshatra?: string;
      houseFromLagna?: number;
    } | null;
  };
};

type Props = {
  snapshot: AstrologicalSnapshotData;
  selectedDateISO: string;
};

function formatDegree(value?: number) {
  return typeof value === "number"
    ? `${value.toFixed(2)}°`
    : "—";
}

export default function AstrologicalSnapshot({
  snapshot,
  selectedDateISO,
}: Props) {
  const [showDasha, setShowDasha] = useState(true);
  const [showNatal, setShowNatal] = useState(false);
  const [showTransits, setShowTransits] = useState(false);

  const ascendant =
    snapshot.natal?.ascendant ?? snapshot.ascendant;

  const natalPlanets = snapshot.natal?.planets ?? [];
  const transitPlanets = snapshot.transits?.planets ?? [];

  return (
    <section className="mt-8 rounded-3xl border border-[#E0DFDC] bg-[#FFF6F4] p-5 text-[#220600] sm:p-7">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9D1200]">
          Behind your guidance
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Your Astrological Snapshot
        </h2>

        <p className="mt-2 text-sm text-[#6B514B]">
          Explore your birth chart, planetary periods and
          transits for {selectedDateISO}.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs text-[#9D1200]">
            Your Ascendant
          </p>
          <p className="mt-1 text-lg font-semibold">
            {ascendant?.sign ?? "—"}
          </p>
          <p className="text-sm text-[#6B514B]">
            {formatDegree(ascendant?.degree)}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs text-[#9D1200]">
            Today's Moon
          </p>
          <p className="mt-1 text-lg font-semibold">
            {snapshot.transits?.moonToday?.sign ?? "—"}
          </p>
          <p className="text-sm text-[#6B514B]">
            {snapshot.transits?.moonToday?.nakshatra ?? ""}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="overflow-hidden rounded-2xl border border-[#E0DFDC] bg-white">
          <button
            type="button"
            onClick={() => setShowDasha(!showDasha)}
            className="flex w-full items-center justify-between p-4 text-left font-semibold"
            aria-expanded={showDasha}
          >
            <span>Running Dasha</span>
            <span>{showDasha ? "−" : "+"}</span>
          </button>

          {showDasha && (
  <div className="space-y-3 border-t border-[#E0DFDC] p-4">
    {[
      {
        title: "Mahadasha",
        lord: snapshot.dasha?.current?.md,
        start: snapshot.dasha?.current?.mdStartISO,
        end: snapshot.dasha?.current?.mdEndISO,
      },
      {
        title: "Antardasha",
        lord: snapshot.dasha?.current?.ad,
        start: snapshot.dasha?.current?.adStartISO,
        end: snapshot.dasha?.current?.adEndISO,
      },
      {
        title: "Pratyantardasha",
        lord: snapshot.dasha?.activeForPrediction?.pd,
        start: null,
        end: null,
      },
    ].map((period) => (
      <div
        key={period.title}
        className="rounded-xl bg-[#FFF6F4] p-4"
      >
        <p className="text-xs font-medium text-[#9D1200]">
          {period.title}
        </p>

        <p className="mt-1 text-lg font-semibold">
          {period.lord ?? "Unavailable"}
        </p>

        {period.start && period.end ? (
          <p className="mt-1 text-sm text-[#6B514B]">
            {period.start} – {period.end}
          </p>
        ) : period.lord && period.title === "Pratyantardasha" ? (
          <p className="mt-1 text-xs text-[#6B514B]">
            Active planetary sub-period
          </p>
        ) : null}
      </div>
    ))}

    <p className="text-xs text-[#6B514B]">
      Planetary periods active on {selectedDateISO}.
    </p>
  </div>
)}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E0DFDC] bg-white">
          <button
            type="button"
            onClick={() => setShowNatal(!showNatal)}
            className="flex w-full items-center justify-between p-4 text-left font-semibold"
            aria-expanded={showNatal}
          >
            <span>Birth Chart & Planetary Placements</span>
            <span>{showNatal ? "−" : "+"}</span>
          </button>

          {showNatal && (
  <div className="border-t border-[#E0DFDC] p-4">
    {ascendant?.sign && (
      <div className="mb-6">
        <MediumNorthIndianChart
          title="D1 Birth Chart"
          ascSign={ascendant.sign}
          planets={natalPlanets.map((planet) => ({
            ...planet,
            rashiHouse: planet.house,
          }))}
          mode="rashi"
          placementMode="sign"
          layoutVariant="secondary"
          showPlanetDetails
          showAbbreviations={false}
        />
      </div>
    )}

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E0DFDC]">
                    <th className="pb-3">Planet</th>
                    <th className="pb-3">Sign</th>
                    <th className="pb-3">Degree</th>
                    <th className="pb-3">House</th>
                    <th className="pb-3">Nakshatra</th>
                  </tr>
                </thead>
                <tbody>
                  {natalPlanets.map((planet) => (
                    <tr
                      key={planet.planet}
                      className="border-b border-[#E0DFDC]/60"
                    >
                      <td className="py-3 font-medium">
                        {planet.planet}
                        {planet.retrograde ? " (R)" : ""}
                      </td>
                      <td>{planet.sign ?? "—"}</td>
                      <td>{formatDegree(planet.degree)}</td>
                      <td>{planet.house ?? "—"}</td>
                      <td>
                        {planet.nakshatra ?? "—"}
                        {planet.pada
                          ? ` · Pada ${planet.pada}`
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
                            </table>
            </div>
          </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E0DFDC] bg-white">
          <button
            type="button"
            onClick={() => setShowTransits(!showTransits)}
            className="flex w-full items-center justify-between p-4 text-left font-semibold"
            aria-expanded={showTransits}
          >
            <span>Planetary Transits</span>
            <span>{showTransits ? "−" : "+"}</span>
          </button>

          {showTransits && (
  <div className="border-t border-[#E0DFDC] p-4">
    {ascendant?.sign && transitPlanets.length > 0 && (
      <div className="mb-6">
        <MediumNorthIndianChart
          title="Gochar — Planetary Transits"
          ascSign={ascendant.sign}
          planets={transitPlanets.map((planet) => ({
            ...planet,
            house: planet.houseFromLagna,
            rashiHouse: planet.houseFromLagna,
          }))}
          mode="rashi"
          placementMode="sign"
          layoutVariant="secondary"
          showPlanetDetails
          showAbbreviations={false}
        />
      </div>
    )}

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E0DFDC]">
                    <th className="pb-3">Planet</th>
                    <th className="pb-3">Sign</th>
                    <th className="pb-3">Degree</th>
                    <th className="pb-3">House</th>
                    <th className="pb-3">Nakshatra</th>
                  </tr>
                </thead>
                <tbody>
                  {transitPlanets.map((planet) => (
                    <tr
                      key={planet.planet}
                      className="border-b border-[#E0DFDC]/60"
                    >
                      <td className="py-3 font-medium">
                        {planet.planet}
                        {planet.retrograde ? " (R)" : ""}
                      </td>
                      <td>{planet.sign ?? "—"}</td>
                      <td>{formatDegree(planet.degree)}</td>
                      <td>{planet.houseFromLagna ?? "—"}</td>
                      <td>{planet.nakshatra ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
                            </table>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}