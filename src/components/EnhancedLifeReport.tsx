"use client";

import React from "react";

/* ---------------- Types that match /api/life-report ---------------- */

type ActivePeriods = {
  mahadasha?: {
    lord: string;
    start: string; // ISO
    end: string;   // ISO
    summary?: string;
  };
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

type Report = {
  ascendant?: {
    label: string;
    summary?: string;
    ascNakshatra?: string;
  } | null;
  soulPath?: {
    emotionalPurpose?: string;
    spiritualPurpose?: string;
  };
  houses?: Array<{
    id: number;
    title: string;
    planetsNote?: string;
    houseNote?: string;
    houseSummaryPlain?: string;
  }>;
  planets?: Array<{
    name: string;
    sign: string;
    house?: number;
    note?: string;
    nakshatra?: string;
  }>;
  personalSummary?: string;
  activePeriods?: ActivePeriods;
  raw?: any;
};

/* ---------------- Small utils ---------------- */

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "—";
  // Your screenshot uses DD/MM/YYYY style (en-GB)
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ---------------- Subcomponents ---------------- */

function CurrentCycleCard({ activePeriods }: { activePeriods?: ActivePeriods }) {
  const maha  = activePeriods?.mahadasha;
  const antar = activePeriods?.antardasha;
  const praty = activePeriods?.pratyantardasha;

  // Build the headline like:
  // "Rahu Mahadasha / Ketu Antardasha / Mars Pratyantardasha"
  const titleParts: string[] = [];
  if (maha?.lord)        titleParts.push(`${maha.lord} Mahadasha`);
  if (antar?.subLord)    titleParts.push(`${antar.subLord} Antardasha`);
  if (praty?.lord)       titleParts.push(`${praty.lord} Pratyantardasha`);
  const titleLine = titleParts.join(" / ") || "Current Cycle";

  // Mahadasha line (already in screenshot)
  const mahaLine = maha
    ? `Major period (${maha.lord}) runs ${fmtDate(maha.start)} – ${fmtDate(maha.end)}`
    : null;

  // Antardasha line (already in screenshot)
  const antarLine = antar
    ? `Current sub-period (${antar.subLord}) runs ${fmtDate(antar.start)} – ${fmtDate(antar.end)}`
    : null;

  // NEW: Pratyantardasha line
  const pratyLine = praty
    ? `Current micro-period (${praty.lord}) runs ${fmtDate(praty.start)} – ${fmtDate(praty.end)}`
    : null;

  // Big paragraph is Mahadasha summary (the long block in your screenshot)
  const mahaSummary = maha?.summary;

  // "Right now specifically:" paragraph in screenshot.
  // We now upgrade it: prefer PD summary if available, else fallback to Antardasha summary.
  const nowSummary = praty?.summary || antar?.summary || "";

  return (
    <section className="rounded-lg border p-4 md:p-6 bg-white shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {titleLine}
      </h3>

      <div className="text-xs text-gray-600 space-y-1 mb-4">
        {mahaLine && <div><strong>{mahaLine.split(" runs ")[0]}</strong> runs {mahaLine.split(" runs ")[1]}</div>}
        {antarLine && <div><strong>{antarLine.split(" runs ")[0]}</strong> runs {antarLine.split(" runs ")[1]}</div>}
        {pratyLine && <div><strong>{pratyLine.split(" runs ")[0]}</strong> runs {pratyLine.split(" runs ")[1]}</div>}
      </div>

      {mahaSummary && (
        <p className="text-sm text-gray-800 mb-4 leading-relaxed">
          {mahaSummary}
        </p>
      )}

      {nowSummary && (
        <p className="text-sm text-gray-800 leading-relaxed">
          <strong>Right now specifically:</strong>{" "}
          {nowSummary}
        </p>
      )}
    </section>
  );
}

function PlainEnglishCard({ personalSummary }: { personalSummary?: string }) {
  if (!personalSummary) return null;
  return (
    <section className="rounded-lg border p-4 md:p-6 bg-white shadow-sm mb-6">
      <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
        <span role="img" aria-label="spark">✨</span>
        <span>In plain English</span>
      </h3>
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        {personalSummary}
      </p>
    </section>
  );
}

function AscendantCard({ ascendant }: { ascendant?: Report["ascendant"] }) {
  // In your screenshot I saw "Unknown Ascendant" fallback.
  if (!ascendant) {
    return (
      <section className="rounded-lg border p-4 bg-white shadow-sm mb-6">
        <h3 className="font-semibold text-base mb-2">Unknown Ascendant</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Ascendant insights will appear here once the data loads.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border p-4 bg-white shadow-sm mb-6">
      <h3 className="font-semibold text-base mb-2">{ascendant.label}</h3>
      {ascendant.summary && (
        <p className="text-sm text-gray-700 leading-relaxed">
          {ascendant.summary}
        </p>
      )}
      {ascendant.ascNakshatra && (
        <div className="text-xs text-gray-500 mt-2">
          Ascendant nakshatra: {ascendant.ascNakshatra}
        </div>
      )}
    </section>
  );
}

function SoulPathCard({ soulPath }: { soulPath?: Report["soulPath"] }) {
  if (!soulPath) return null;
  return (
    <section className="grid gap-4 md:grid-cols-2 mb-6">
      <div className="rounded-lg border p-4 bg-white shadow-sm">
        <div className="text-xs text-gray-500 mb-1 font-medium">
          Emotional Purpose
        </div>
        <div className="text-sm text-gray-800 leading-relaxed">
          {soulPath.emotionalPurpose || "—"}
        </div>
      </div>
      <div className="rounded-lg border p-4 bg-white shadow-sm">
        <div className="text-xs text-gray-500 mb-1 font-medium">
          Spiritual Purpose
        </div>
        <div className="text-sm text-gray-800 leading-relaxed">
          {soulPath.spiritualPurpose || "—"}
        </div>
      </div>
    </section>
  );
}

function HousesBlock({ houses }: { houses?: Report["houses"] }) {
  if (!houses?.length) return null;
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-base">House-wise Overview</h3>
        <div className="text-[11px] text-gray-500 flex items-center gap-1">
          <span className="inline-flex items-center justify-center rounded border px-1.5 py-0.5 leading-none">
            12 houses
          </span>
        </div>
      </div>

      <div className="divide-y border rounded-lg bg-white shadow-sm">
        {houses.map((h) => (
          <div key={h.id} className="p-4 text-sm leading-relaxed">
            <div className="font-medium text-gray-800 mb-1">
              {h.title}
            </div>

            {h.planetsNote && (
              <div className="text-gray-700">
                <b>Key planets here:</b> {h.planetsNote}
              </div>
            )}

            {h.houseNote && (
              <div className="text-gray-700">
                {h.houseNote}
              </div>
            )}

            {h.houseSummaryPlain && (
              <div className="text-gray-800 mt-1">
                {h.houseSummaryPlain}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function PlanetsBlock({ planets }: { planets?: Report["planets"] }) {
  if (!planets?.length) return (
    <section className="mb-6">
      <h3 className="font-semibold text-base mb-2">Planets</h3>
      <div className="rounded-lg border p-4 bg-white text-sm text-gray-600 shadow-sm">
        No planetary data returned.
      </div>
    </section>
  );

  return (
    <section className="mb-6">
      <h3 className="font-semibold text-base mb-2">Planets</h3>
      <div className="rounded-lg border divide-y bg-white shadow-sm">
        {planets.map((p, i) => (
          <div key={i} className="p-4 text-sm leading-relaxed">
            <div className="font-medium text-gray-800 mb-1">
              {p.name} in {p.sign}
              {typeof p.house === "number" ? ` (House ${p.house})` : ""}
            </div>
            {p.nakshatra && (
              <div className="text-gray-600 text-xs mb-1">
                Nakshatra: {p.nakshatra}
              </div>
            )}
            {p.note && (
              <div className="text-gray-700">{p.note}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Main component ---------------- */

export default function EnhancedLifeReport({
  report,
}: {
  report: Report;
}) {
  // we destructure so code is easy to read below
  const {
    activePeriods,
    personalSummary,
    ascendant,
    soulPath,
    houses,
    planets,
  } = report || {};
  console.log("DEBUG activePeriods", activePeriods);
  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-800 print:bg-white print:text-black">
      
      {/* CURRENT CYCLE CARD with Mahadasha / Antardasha / Pratyantardasha */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Current Cycle</h2>
        <CurrentCycleCard activePeriods={activePeriods} />
      </div>

      {/* In plain English (your "personalSummary") */}
      <PlainEnglishCard personalSummary={personalSummary} />

      {/* Ascendant card */}
      <AscendantCard ascendant={ascendant} />

      {/* Soul path (Rahu/Ketu meaning) */}
      <SoulPathCard soulPath={soulPath} />

      {/* Houses overview */}
      <HousesBlock houses={houses} />

      {/* Planets block */}
      <PlanetsBlock planets={planets} />

      {/* Tips / footer section like in your screenshot right column could be a sidebar,
          but for now we just do a tiny footer: */}
      <footer className="text-[11px] text-gray-500 border-t pt-4">
        Built with Sārathi • This page is printer-friendly and shareable.
        Edit birth details from the top bar.
      </footer>
    </div>
  );
}
