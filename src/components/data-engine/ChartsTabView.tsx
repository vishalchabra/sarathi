import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MediumNorthIndianChart from "@/components/data-engine/MediumNorthIndianChart";

type SimpleChartData = {
  title: string;
  ascSign: string | null;
  planets: any[];
  subtitle?: string;
};

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <section className="rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-[1.01]">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-slate-900">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function PlaceholderChart({
  label,
  height = "h-44",
}: {
  label: string;
  height?: string;
}) {
  return (
    <div
      className={`flex ${height} items-center justify-center rounded-2xl border border-dashed border-[color:var(--border)] bg-white/80 text-sm text-slate-900`}
    >
      {label}
    </div>
  );
}

function MediumChartCard({
  title,
  subtitle,
  ascSign,
  planets,
}: SimpleChartData) {
  if (!ascSign || !Array.isArray(planets) || !planets.length) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <PlaceholderChart label={`${title} unavailable`} height="h-40" />
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <MediumNorthIndianChart
        title=""
        ascSign={ascSign}
        planets={planets}
        layoutVariant="secondary"
      />
    </ChartCard>
  );
}

function normalizeChartPlanets(rows: any[]): any[] {
  return (Array.isArray(rows) ? rows : [])
    .map((p) => ({
      ...p,
      planet: p?.planet ?? p?.name ?? p?.id ?? null,
      sign: p?.sign ?? p?.rashi ?? null,
      house:
        typeof p?.house === "number"
          ? p.house
          : typeof p?.houseNum === "number"
          ? p.houseNum
          : typeof p?.bhava === "number"
          ? p.bhava
          : null,
      degree:
        typeof p?.degree === "number"
          ? p.degree
          : typeof p?.deg === "number"
          ? p.deg
          : null,
      retrograde:
        typeof p?.retrograde === "boolean"
          ? p.retrograde
          : false,
      nakshatra: p?.nakshatra ?? p?.nakName ?? null,
      pada: p?.pada ?? null,
      combust:
        typeof p?.combust === "boolean"
          ? p.combust
          : false,
    }))
    .filter((p) => p?.planet);
}

function normalizeTransitPlanets(planets: any[], natalAscSign: string | null): any[] {
  const signOrder = [
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

  const ascIndex = natalAscSign ? signOrder.findIndex((s) => s === natalAscSign) : -1;

  return (Array.isArray(planets) ? planets : [])
    .map((p) => {
      const sign = p?.sign ?? null;
      const signIndex = sign ? signOrder.findIndex((s) => s === sign) : -1;

      const houseFromNatal =
        ascIndex >= 0 && signIndex >= 0
          ? ((signIndex - ascIndex + 12) % 12) + 1
          : null;

      return {
        planet: p?.name ?? p?.id ?? p?.planet ?? null,
        sign,
        house: houseFromNatal,
        degree:
          typeof p?.deg === "number"
            ? p.deg
            : typeof p?.degree === "number"
            ? p.degree
            : typeof p?.lon === "number"
            ? Number((((p.lon % 30) + 30) % 30).toFixed(2))
            : null,
        retrograde:
          typeof p?.retrograde === "boolean"
            ? p.retrograde
            : false,
        nakshatra: p?.nakshatra ?? p?.nakName ?? null,
        pada: p?.pada ?? null,
      };
    })
    .filter((p) => p?.planet);
}

const SIGN_ORDER = [
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
] as const;

function getSignIndex(sign?: string | null) {
  if (!sign) return -1;
  return SIGN_ORDER.findIndex((s) => s === sign);
}

function buildReferenceChartFromPlanet(planets: any[], referencePlanetName: string | null) {
  const normalized = normalizeChartPlanets(planets);
  const referencePlanet = normalized.find((p) => p?.planet === referencePlanetName);

  if (!referencePlanet?.sign) {
    return {
      ascSign: null,
      planets: [],
      referenceSign: null,
    };
  }

  const referenceSign = referencePlanet.sign;
  const referenceIndex = getSignIndex(referenceSign);

  if (referenceIndex < 0) {
    return {
      ascSign: null,
      planets: [],
      referenceSign: null,
    };
  }

  const remappedPlanets = normalized.map((p) => {
    const signIndex = getSignIndex(p?.sign);

    if (signIndex < 0) {
      return {
        ...p,
        house: null,
      };
    }

    const houseFromReference = ((signIndex - referenceIndex + 12) % 12) + 1;

    return {
      ...p,
      house: houseFromReference,
    };
  });

  return {
    ascSign: referenceSign,
    planets: remappedPlanets,
    referenceSign,
  };
}

function buildChandraChartPlanets(planets: any[]) {
  return buildReferenceChartFromPlanet(planets, "Moon");
}

function buildReferenceChartFromHouse(
  natalAscSign: string | null,
  planets: any[],
  referenceHouse: number
) {
  const normalized = normalizeChartPlanets(planets);

  const ascIndex = getSignIndex(natalAscSign);

  if (ascIndex < 0 || !referenceHouse || referenceHouse < 1 || referenceHouse > 12) {
    return {
      ascSign: null,
      planets: [],
      referenceSign: null,
    };
  }

  const referenceSignIndex = (ascIndex + (referenceHouse - 1)) % 12;
  const referenceSign = SIGN_ORDER[referenceSignIndex];

  const remappedPlanets = normalized.map((p) => {
    const natalHouse =
      typeof p?.house === "number" && p.house >= 1 && p.house <= 12
        ? p.house
        : null;

    if (!natalHouse) {
      return {
        ...p,
        house: null,
      };
    }

    const houseFromReference = ((natalHouse - referenceHouse + 12) % 12) + 1;

    return {
      ...p,
      house: houseFromReference,
    };
  });

  return {
    ascSign: referenceSign,
    planets: remappedPlanets,
    referenceSign,
  };
}

function getPlanetShifts(planets: any[]) {
  return (Array.isArray(planets) ? planets : []).map((p) => ({
    planet: p?.planet ?? p?.name ?? "Unknown",
    from: p?.rashiHouse ?? null,
    to: p?.house ?? null,
    changed: p?.rashiHouse !== p?.house,
  }));
}

type ReferenceMode = "lagna" | "moon" | "md" | "ad";
type HouseReferenceOption = {
  house: number;
  key: string;
  label: string;
  shortLabel: string;
};
type ExpandedChartState = {
  key: string;
  title: string;
  ascSign: string | null;
  planets: any[];
} | null;

const HOUSE_REFERENCE_OPTIONS: HouseReferenceOption[] = [
  { house: 1, key: "self", label: "1st House — Self", shortLabel: "Self" },
  { house: 2, key: "money", label: "2nd House — Wealth & Family", shortLabel: "Wealth & Family" },
  { house: 3, key: "effort", label: "3rd House — Effort & Siblings", shortLabel: "Effort & Siblings" },
  { house: 4, key: "home", label: "4th House — Home & Mother", shortLabel: "Home & Mother" },
  { house: 5, key: "children", label: "5th House — Children & Creativity", shortLabel: "Children & Creativity" },
  { house: 6, key: "health", label: "6th House — Health, Debt & Conflict", shortLabel: "Health / Debt / Conflict" },
  { house: 7, key: "marriage", label: "7th House — Marriage & Partnership", shortLabel: "Marriage & Partnership" },
  { house: 8, key: "longevity", label: "8th House — Longevity & Change", shortLabel: "Longevity & Change" },
  { house: 9, key: "fortune", label: "9th House — Fortune, Father & Dharma", shortLabel: "Fortune / Father / Dharma" },
  { house: 10, key: "career", label: "10th House — Career & Karma", shortLabel: "Career & Karma" },
  { house: 11, key: "gains", label: "11th House — Gains & Network", shortLabel: "Gains & Network" },
  { house: 12, key: "loss", label: "12th House — Loss, Foreign & Moksha", shortLabel: "Loss / Foreign / Moksha" },
];


function formatDashaDate(value: any) {
  if (!value) return "—";

  try {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
  } catch {}

  return String(value);
}

function getDashaNode(currentDasha: any, keys: string[]) {
  for (const key of keys) {
    const value = currentDasha?.[key];
    if (value) return value;
  }

  return null;
}

function getDashaPlanet(node: any) {
  if (!node) return "—";
  if (typeof node === "string") return node;

  return (
    node?.planet ??
    node?.lord ??
    node?.name ??
    node?.dashaLord ??
    "—"
  );
}

function getDashaStart(node: any) {
  if (!node || typeof node === "string") return null;

  return (
    node?.start ??
    node?.startDate ??
    node?.startISO ??
    node?.from ??
    node?.fromISO ??
    node?.begin ??
    node?.beginISO ??
    null
  );
}

function getDashaEnd(node: any) {
  if (!node || typeof node === "string") return null;

  return (
    node?.end ??
    node?.endDate ??
    node?.endISO ??
    node?.to ??
    node?.toISO ??
    node?.finish ??
    node?.finishISO ??
    null
  );
}

function getTimelineRows(dashaTimelines: any, keys: string[]) {
  for (const key of keys) {
    const value = dashaTimelines?.[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

function getTimelinePlanet(row: any) {
  if (!row) return "—";
  if (typeof row === "string") return row;

  return (
    row?.planet ??
    row?.lord ??
    row?.name ??
    row?.dashaLord ??
    row?.md ??
    row?.ad ??
    row?.pd ??
    "—"
  );
}

function getTimelineStart(row: any) {
  if (!row || typeof row === "string") return null;

  return (
    row?.start ??
    row?.startDate ??
    row?.startISO ??
    row?.from ??
    row?.fromISO ??
    row?.begin ??
    row?.beginISO ??
    null
  );
}

function getTimelineEnd(row: any) {
  if (!row || typeof row === "string") return null;

  return (
    row?.end ??
    row?.endDate ??
    row?.endISO ??
    row?.to ??
    row?.toISO ??
    row?.finish ??
    row?.finishISO ??
    null
  );
}

function isDateWithinRow(row: any, now = new Date()) {
  const start = getTimelineStart(row);
  const end = getTimelineEnd(row);

  if (!start || !end) return false;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return false;
  }

  return startDate.getTime() <= now.getTime() && now.getTime() <= endDate.getTime();
}

function findCurrentTimelineRow(rows: any[], planet: string) {
  if (!Array.isArray(rows) || !rows.length) return null;

  const byDate = rows.find((row) => isDateWithinRow(row));
  if (byDate) return byDate;

  if (planet && planet !== "—") {
    const byPlanet = rows.find((row) => getTimelinePlanet(row) === planet);
    if (byPlanet) return byPlanet;
  }

  return null;
}

function enrichDashaNodeFromTimeline(node: any, rows: any[]) {
  const planet = getDashaPlanet(node);
  const timelineRow = findCurrentTimelineRow(rows, planet);

  if (!timelineRow) return node;

  return {
    ...(typeof node === "object" && node ? node : { planet }),
    start: getDashaStart(node) ?? getTimelineStart(timelineRow),
    end: getDashaEnd(node) ?? getTimelineEnd(timelineRow),
  };
}

function findDashaRowByDate(rows: any[], dateISO: string) {
  if (!Array.isArray(rows) || !rows.length || !dateISO) return null;

  const target = new Date(`${dateISO}T00:00:00`).getTime();

  return (
    rows.find((row) => {
      const start = getTimelineStart(row);
      const end = getTimelineEnd(row);

      if (!start || !end) return false;

      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();

      if (Number.isNaN(startTime) || Number.isNaN(endTime)) return false;

      return startTime <= target && target <= endTime;
    }) ?? null
  );
}

function formatDashaCompactDate(value: any) {
  if (!value) return "—";

  try {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
  } catch {}

  return String(value);
}
function filterRowsWithinParent(rows: any[], parentRow: any) {
  if (!Array.isArray(rows) || !parentRow) return [];

  const parentStart = new Date(getTimelineStart(parentRow)).getTime();
  const parentEnd = new Date(getTimelineEnd(parentRow)).getTime();

  return rows.filter((row) => {
    const start = new Date(getTimelineStart(row)).getTime();
    const end = new Date(getTimelineEnd(row)).getTime();

    if (Number.isNaN(start) || Number.isNaN(end)) return false;

    return start >= parentStart && end <= parentEnd;
  });
}
const NAKSHATRA_LORDS: Record<string, string> = {
  Ashwini: "Ke",
  Bharani: "Ve",
  Krittika: "Su",
  Rohini: "Mo",
  Mrigashira: "Ma",
  Ardra: "Ra",
  Punarvasu: "Ju",
  Pushya: "Sa",
  Ashlesha: "Me",
  Magha: "Ke",
  "Purva Phalguni": "Ve",
  "Uttara Phalguni": "Su",
  Hasta: "Mo",
  Chitra: "Ma",
  Swati: "Ra",
  Vishakha: "Ju",
  Anuradha: "Sa",
  Jyeshtha: "Me",
  Mula: "Ke",
  "Purva Ashadha": "Ve",
  "Uttara Ashadha": "Su",
  Shravana: "Mo",
  Dhanishta: "Ma",
  Shatabhisha: "Ra",
  "Purva Bhadrapada": "Ju",
  "Uttara Bhadrapada": "Sa",
  Revati: "Me",
};

function formatNakshatraWithLord(nakshatra?: string | null) {
  if (!nakshatra) return "—";

  const lord = NAKSHATRA_LORDS[nakshatra];

  return lord
    ? `${nakshatra} (${lord})`
    : nakshatra;
}
function NabhasaYogasCard({ data }: { data?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const detected = Array.isArray(data?.detected) ? data.detected : [];

  return (
    <aside className="h-full rounded-2xl border border-[color:var(--border)] bg-white/90 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-start justify-between text-left"
      >
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Nabhasa Yogas
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            Pattern yogas based on the 7 classical planets.
          </p>
        </div>

        <span className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen ? (
        <>
          {!detected.length ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600">
              No major Nabhasa pattern detected.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {detected.slice(0, 5).map((yoga: any) => (
                <div
                  key={yoga.id}
                  className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">
                        {yoga.name}
                      </div>
                      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        {yoga.group}
                      </div>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-100">
                      Detected
                    </span>
                  </div>

                  <div className="mt-2 text-xs leading-relaxed text-slate-700">
                    {yoga.rule}
                  </div>

                  {yoga.theme ? (
                    <div className="mt-2 text-xs leading-relaxed text-slate-600">
                      <span className="font-semibold text-slate-800">
                        Theme:
                      </span>{" "}
                      {yoga.theme}
                    </div>
                  ) : null}
                </div>
              ))}

              {detected.length > 5 ? (
                <div className="text-xs text-slate-500">
                  +{detected.length - 5} more yoga(s) detected.
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
            Houses checked:{" "}
            {Array.isArray(data?.summary?.occupiedHouses)
              ? data.summary.occupiedHouses.join(", ")
              : "—"}
          </div>
        </>
      ) : null}
    </aside>
  );
}
function ClassicYogasCard({
  data,
  currentDasha,
}: {
  data?: any;
  currentDasha?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rawDetectedSource = Array.isArray(data)
  ? data
  : Array.isArray(data?.detected)
    ? data.detected
    : Array.isArray(data?.yogas)
      ? data.yogas
      : Array.isArray(data?.classicYogas)
        ? data.classicYogas
        : [];

const rawDetected = rawDetectedSource.filter(
  (yoga: any) => yoga && typeof yoga === "object"
);
  console.log("CLASSIC YOGAS DEBUG", {
  data,
  rawDetectedSource,
  rawDetected,
});
  const currentDashaPlanets = [
  currentDasha?.md?.planet ?? currentDasha?.md?.lord ?? currentDasha?.md,
  currentDasha?.ad?.planet ?? currentDasha?.ad?.lord ?? currentDasha?.ad,
  currentDasha?.pd?.planet ?? currentDasha?.pd?.lord ?? currentDasha?.pd,
]
  .filter(Boolean)
  .map(String);

function getActiveYogaReason(yoga: any): string | null {
  const involved = Array.isArray(yoga?.involvedPlanets)
    ? yoga.involvedPlanets
    : [];

  const activePlanet = involved.find((p: string) =>
    currentDashaPlanets.includes(p)
  );

  if (!activePlanet) return null;

  return `Current dasha lord ${activePlanet} participates in this yoga.`;
}

  const detected: any[] = Object.values(
    rawDetected.reduce((acc: any, yoga: any) => {
      const key = yoga?.name ?? yoga?.id ?? "Unknown Yoga";

      if (!acc[key]) {
        acc[key] = {
          ...yoga,
          combinations: [],
        };
      }

      acc[key].combinations.push({
  rule: yoga?.rule ?? "Rule not available",
  evidence: yoga?.evidence ?? null,
});

      return acc;
    }, {})
  );
const yogaCategoryMap: Record<string, string> = {
  "Raj Yoga": "Career / Authority",
  "Dharma-Karmadhipati Yoga": "Career / Authority",
  "Vipreet Raj Yoga": "Resilience / Reversal",
  "Dhana Yoga": "Wealth",
  "Lakshmi Yoga": "Wealth",
  "Gajakesari Yoga": "Support / Wisdom",
  "Budhaditya Yoga": "Intellect / Status",
  "Chandra-Mangal Yoga": "Wealth / Action",
  "Adhi Yoga": "Support / Protection",
  "Parivartana Yoga": "Exchange / Structural",
  "Neechabhanga Raj Yoga": "Cancellation / Recovery",
  "Daridra Yoga": "Challenge",
  "Kemadruma Yoga": "Mind / Isolation",
};

const groupedDetected: Record<string, any[]> = detected.reduce((acc: Record<string, any[]>, yoga: any) => {
  const category = yogaCategoryMap[yoga?.name] ?? "Other Yogas";

  if (!acc[category]) acc[category] = [];
  acc[category].push(yoga);

  return acc;
}, {});
const activeYogas = detected.filter((yoga: any) => yoga?.isActive);

const topActiveYoga =
  activeYogas.find((yoga: any) => yoga?.activationLevel === "Strong") ??
  activeYogas.find((yoga: any) => yoga?.activationLevel === "Moderate") ??
  activeYogas[0] ??
  null;
  const peakLine =
  Array.isArray(topActiveYoga?.activation)
    ? topActiveYoga.activation.find((r: string) =>
        r.toLowerCase().includes("peak")
      )
    : null;
  return (
    <aside className="h-full rounded-2xl border border-[color:var(--border)] bg-white/90 p-4 shadow-sm">
      <div>
  <button
    type="button"
    onClick={() => setIsOpen((v) => !v)}
    className="flex w-full items-start justify-between text-left"
  >
    <div>
      <h4 className="text-sm font-semibold text-slate-900">Classic Yogas</h4>
      <p className="mt-1 text-xs text-slate-500">
        Rule-based yoga checks with evidence only.
      </p>
    </div>

    <span className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">
      {isOpen ? "▲" : "▼"}
    </span>
  </button>
        {topActiveYoga ? (
  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3">
    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
      Strongest Active Yoga Now
    </div>

    <div className="mt-1 text-sm font-semibold text-slate-950">
      {topActiveYoga.name}
    </div>

    <div className="mt-1 text-xs text-emerald-700">
  {topActiveYoga.activationLevel} Activation
</div>

{peakLine && (
  <div className="mt-1 text-[11px] font-medium text-emerald-800">
    {String(peakLine)}
  </div>
)}

    {Array.isArray(topActiveYoga.activation) && topActiveYoga.activation.length ? (
      <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] font-medium text-emerald-700">
        {topActiveYoga.activation.slice(0, 3).map((reason: string, index: number) => (
          <li key={index}>{String(reason)}</li>
        ))}
      </ul>
    ) : null}
  </div>
) : null}
      </div>

      {isOpen ? (
  !detected.length ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600">
          No major classic yoga detected (based on current rule set).
        </div>
      ) : (
        <div className="mt-4 space-y-3">
        {Object.entries(groupedDetected).map(([category, yogas]) => (
  <div key={category} className="space-y-3">
    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
      <span>{category} ({(yogas as any[]).length})</span>
    </div>

    {(yogas as any[]).map((yoga: any) => (
      <div
  key={yoga.id}
  className={`rounded-xl border px-3 py-3 ${
    yoga.isActive
      ? yoga.activationLevel === "Strong"
        ? "border-emerald-300 bg-emerald-50"
        : "border-emerald-200 bg-emerald-50/50"
      : "border-indigo-100 bg-indigo-50/50"
  }`}
>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-950">
              {yoga.name}
            </div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
              {yoga.group}
            </div>
          </div>

          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-indigo-700 ring-1 ring-indigo-100">
            Detected
          </span>
        </div>

       <div className="mt-2 text-xs leading-relaxed text-slate-700">
  {yoga.rule}
</div>

{yoga.isActive && (
  <>
    <div className="mt-2 text-[10px] font-bold text-emerald-700">
      {yoga.activationLevel} Activation
    </div>

    <div className="mt-2 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-2 text-[11px] font-medium text-emerald-700">
      Active now:
      <ul className="mt-1 list-disc pl-4">
        {yoga.activation.map((r: string, i: number) => (
          <li key={i}>
  {r.toLowerCase().includes("peak") ? (
    <span className="font-semibold text-emerald-800">
      {String(r)}
    </span>
  ) : (
    String(r)
  )}
</li>
        ))}
      </ul>
    </div>
  </>
)}

        {Array.isArray(yoga.combinations) && yoga.combinations.length ? (
          <div className="mt-2 space-y-2">
            {yoga.combinations.slice(0, 4).map((combo: any, index: number) => (
              <div
                key={index}
                className="rounded-lg border border-white/80 bg-white/70 px-2 py-2 text-[11px] leading-relaxed text-slate-600"
              >
                <div className="mb-1 font-semibold text-slate-700">
                  Combination {index + 1}
                </div>

                {combo.rule ? (
                  <div className="mb-1 text-slate-600">{combo.rule}</div>
                ) : null}

                {combo.evidence
                  ? Object.entries(combo.evidence).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-semibold text-slate-700">
                          {key === "associationType" ? "Association" : key}:
                        </span>{" "}
                        {key === "associationType"
  ? value === "conjunction"
    ? "Conjunction"
    : value === "mutual_aspect"
    ? "7th Aspect"
    : value === "jupiter_aspect"
    ? "Jupiter Aspect"
    : value === "mars_aspect"
    ? "Mars Aspect"
    : value === "saturn_aspect"
    ? "Saturn Aspect"
    : String(value ?? "—")

  : key === "yogaStrength" &&
    value &&
    typeof value === "object"

  ? (() => {
      const ys = value as any;

      return (
        <div className="space-y-1">
          <div>
            strength: {String(ys?.strength ?? "—")}
          </div>
         <div>
  score: {ys?.score == null ? "—" : `${ys.score}/100`}
</div>
          {ys?.supportingReasons?.length ? (
            <div>
              supportingReasons:{" "}
              {ys.supportingReasons.join(", ")}
            </div>
          ) : null}

          {ys?.weakeningReasons?.length ? (
            <div>
              weakeningReasons:{" "}
              {ys.weakeningReasons.join(", ")}
            </div>
          ) : null}

          {ys?.cancellationReasons?.length ? (
            <div>
              cancellationReasons:{" "}
              {ys.cancellationReasons.join(", ")}
            </div>
          ) : null}
        </div>
      );
    })()

  : Array.isArray(value)
  ? value.join(", ")

  : String(value ?? "—")}
                      </div>
                    ))
                  : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    ))}
  </div>
))}

          {detected.length > 6 ? (
            <div className="text-xs text-slate-500">
              +{detected.length - 6} more yoga(s) detected.
            </div>
          ) : null}
        </div>
           )
) : null}
    </aside>
  );
}
function FunctionalPlanetSnapshot({ roles }: { roles?: any }) {
  const yogakaraka =
    roles?.yogakaraka ??
    roles?.yogaKaraka ??
    roles?.yogaKarakaPlanets ??
    roles?.yogakarakaPlanets ??
    [];

  const vargottama =
    roles?.vargottama ??
    roles?.vargottam ??
    roles?.vargottamaPlanets ??
    roles?.vargottamPlanets ??
    [];

  const maraka =
    roles?.maraka ??
    roles?.marakaPlanets ??
    [];

  const badhaka =
    roles?.badhaka ??
    roles?.badhakaPlanets ??
    [];

  const benefic =
    roles?.functionalBenefics ??
    roles?.benefics ??
    roles?.functionalBeneficPlanets ??
    [];

  const malefic =
    roles?.functionalMalefics ??
    roles?.malefics ??
    roles?.functionalMaleficPlanets ??
    [];

  function list(value: any) {
    if (Array.isArray(value)) {
      return value.length ? value.map((x) => x?.planet ?? x?.name ?? x).join(", ") : "—";
    }

    if (typeof value === "string") return value || "—";

    return "—";
  }

  const rows = [
    { label: "Yogakaraka", value: list(yogakaraka) },
    { label: "Vargottama", value: list(vargottama) },
    { label: "Maraka", value: list(maraka) },
    { label: "Badhaka", value: list(badhaka) },
    { label: "Functional Benefic", value: list(benefic) },
    { label: "Functional Malefic", value: list(malefic) },
  ];

  return (
    <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-white/90 p-4 shadow-sm">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-slate-900">
          Functional Planet Snapshot
        </h4>
        <p className="mt-1 text-xs text-slate-500">
          Key functional roles from the Foundations tab.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
          >
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              {row.label}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ActiveDashaPanel({
  currentDasha,
  dashaTimelines,
}: {
  currentDasha?: any;
  dashaTimelines?: any;
}) {
  const [lookupDate, setLookupDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const rawMd = getDashaNode(currentDasha, ["md", "mahadasha", "mahaDasha"]);
  const rawAd = getDashaNode(currentDasha, ["ad", "antardasha", "antarDasha"]);
  const rawPd = getDashaNode(currentDasha, [
    "pd",
    "pratyantardasha",
    "pratyantarDasha",
  ]);

  const mdRows = getTimelineRows(dashaTimelines, [
    "md",
    "mahadasha",
    "mahaDasha",
  ]);

 const adRows = getTimelineRows(dashaTimelines, [
  "ad",
  "antardasha",
  "antarDasha",
  "adInCurrentMd",
]);

const pdRows = getTimelineRows(dashaTimelines, [
  "pd",
  "pratyantardasha",
  "pratyantarDasha",
  "pdInCurrentAd",
]);

  // 1. Find MD for lookup date
const md = findDashaRowByDate(mdRows, lookupDate) ??
  enrichDashaNodeFromTimeline(rawMd, mdRows);

// 2. Filter ADs inside THIS MD
const adRowsForMd = filterRowsWithinParent(adRows, md);

// 3. Find AD inside selected MD
const ad = findDashaRowByDate(adRowsForMd, lookupDate) ??
  enrichDashaNodeFromTimeline(rawAd, adRowsForMd);

// 4. Filter PDs inside THIS AD
const pdRowsForAd = filterRowsWithinParent(pdRows, ad);

// 5. Find PD inside selected AD
const pd = findDashaRowByDate(pdRowsForAd, lookupDate) ??
  enrichDashaNodeFromTimeline(rawPd, pdRowsForAd);

  const rows = [
    { label: "MD", node: md },
    { label: "AD", node: ad },
    { label: "PD", node: pd },
  ];

  const chain = rows
    .map((row) => getDashaPlanet(row.node))
    .filter((planet) => planet && planet !== "—")
    .join(" / ");

  return (
    <aside className="h-full rounded-2xl border border-[color:var(--border)] bg-white/90 p-4 shadow-sm">
      <div>
        <h4 className="text-sm font-semibold text-slate-900">Dasha Lookup</h4>
        <p className="mt-1 text-xs text-slate-500">
          Check the Vimshottari chain for any date.
        </p>
      </div>

      <div className="mt-3">
        <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Date
        </label>
        <input
          type="date"
          value={lookupDate}
          onChange={(e) => setLookupDate(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm outline-none focus:border-[color:var(--primary)]"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-3 py-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400">
          Running Chain
        </div>
        <div className="mt-1 text-base font-semibold leading-snug text-slate-950">
          {chain || "—"}
        </div>
        <div className="mt-1 text-[11px] text-slate-500">MD / AD / PD</div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {rows.map((row) => {
          const planet = getDashaPlanet(row.node);
          const start = getTimelineStart(row.node) ?? getDashaStart(row.node);
          const end = getTimelineEnd(row.node) ?? getDashaEnd(row.node);

          return (
            <div
              key={row.label}
              className="border-b border-slate-100 px-3 py-2.5 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                  {row.label}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {planet}
                </span>
              </div>

              <div className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {formatDashaCompactDate(start)} → {formatDashaCompactDate(end)}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
function PlanetNakshatraSnapshot({
  planets,
}: {
  planets: any[];
}) {
  const rows = normalizeChartPlanets(planets);

  return (
    <aside className="mt-4 rounded-2xl border border-[color:var(--border)] bg-white/90 p-4 shadow-sm">
      <div>
        <h4 className="text-sm font-semibold text-slate-900">
          Planet Nakshatras
        </h4>
        <p className="mt-1 text-xs text-slate-500">
          Natal planet degree and nakshatra lord.
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((p) => (
          <div
            key={p.planet}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
          >
            <div className="font-semibold text-slate-900">
              {p.planet}
            </div>

            <div className="text-right text-slate-600">
              <div>
                {typeof p.degree === "number"
                  ? `${p.degree.toFixed(2)}°`
                  : "—"}
              </div>
              <div className="text-[11px]">
                {p.nakshatra ? formatNakshatraWithLord(p.nakshatra) : "—"}
                {p.pada ? ` • P${p.pada}` : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function ChartsTabView({
  selectedDateISO,
  setSelectedDateISO,
  selectedDateChartLabel,
  natalAscSign,
  natalPlanets,
  vargaMap,
  chartGalleryKeys,
  bhavaChalit,
  classicChalit,
  birthLat,
  birthLon,
  birthTimezone,
  currentMdPlanet,
  currentAdPlanet,
  currentDasha,
  dashaTimelines,
  sarvaAshtakvarga,
  arudhas,
  upagrahas,
  solarShadowPoints,
  vedicAspects,
  nabhasaYogas,
  classicYogas,
  roles,
}: {
  selectedDateISO: string;
  setSelectedDateISO: (value: string) => void;
  selectedDateChartLabel?: string;
  natalAscSign: string | null;
  natalPlanets: any[];
  vargaMap: Record<string, any>;
  chartGalleryKeys: string[];
  bhavaChalit: any;
  classicChalit: any;
  birthLat: number;
  birthLon: number;
  birthTimezone: string;
  currentMdPlanet: string | null;
  currentAdPlanet: string | null;
  currentDasha?: any;
  dashaTimelines?: any;
  sarvaAshtakvarga?: number[];
  arudhas?: Record<string, { sign: string }>;
  upagrahas?: any;
  solarShadowPoints?: any;
  vedicAspects?: any;
  nabhasaYogas?: any;
  classicYogas?: any;
  roles?: any;
}) {
const [overlayTransitPlanets, setOverlayTransitPlanets] = useState<any[]>([]);
const [transitChartPlanets, setTransitChartPlanets] = useState<any[]>([]);
const [transitLoading, setTransitLoading] = useState(false);
  const [transitChartDateISO, setTransitChartDateISO] = useState(selectedDateISO);
  const [overlayTransitTime] = useState(() =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: birthTimezone || "UTC",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date())
  );
  const [transitTime, setTransitTime] = useState(() =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: birthTimezone || "UTC",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date())
  );
  const [referenceMode, setReferenceMode] = useState<ReferenceMode>("md");
  const [showTransitOverlay, setShowTransitOverlay] = useState(false);
  const [showArudhaOverlay, setShowArudhaOverlay] = useState(false);
  const [showUpagrahaOverlay, setShowUpagrahaOverlay] = useState(false);
  const [showAspectOverlay, setShowAspectOverlay] = useState(false);
  const [expandedChart, setExpandedChart] = useState<ExpandedChartState>(null);
  const [referenceMenuOpen, setReferenceMenuOpen] = useState(false);
  const [selectedHouseReference, setSelectedHouseReference] = useState<number>(1);
  const [houseReferenceMenuOpen, setHouseReferenceMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const modalCardRef = useRef<HTMLDivElement | null>(null);

  const chandraChart = buildChandraChartPlanets(natalPlanets);

  const mdReferenceChart = buildReferenceChartFromPlanet(
    natalPlanets,
    currentMdPlanet
  );

  const adReferenceChart = buildReferenceChartFromPlanet(
    natalPlanets,
    currentAdPlanet
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!expandedChart) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedChart(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    requestAnimationFrame(() => {
  modalCardRef.current?.focus?.();
});

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [expandedChart]);

  const selectedReferenceChart = useMemo(() => {
    if (referenceMode === "lagna") {
      return {
        title: "Lagna Reference Chart",
        subtitle: "Natal lagna used as reference ascendant.",
        ascSign: natalAscSign,
        planets: normalizeChartPlanets(natalPlanets),
      };
    }

    if (referenceMode === "moon") {
      return {
        title: "Moon Reference Chart",
        subtitle:
          chandraChart?.ascSign
            ? `Moon in ${chandraChart.ascSign} treated as reference ascendant.`
            : "Moon-reference chart.",
        ascSign: chandraChart.ascSign,
        planets: chandraChart.planets,
      };
    }

    if (referenceMode === "ad") {
      return {
        title: "Antardasha Reference Chart",
        subtitle:
          currentAdPlanet && adReferenceChart?.referenceSign
            ? `${currentAdPlanet} in ${adReferenceChart.referenceSign} treated as reference ascendant.`
            : "Current AD lord sign treated as reference ascendant.",
        ascSign: adReferenceChart.ascSign,
        planets: adReferenceChart.planets,
      };
    }

    return {
      title: "Mahadasha Reference Chart",
      subtitle:
        currentMdPlanet && mdReferenceChart?.referenceSign
          ? `${currentMdPlanet} in ${mdReferenceChart.referenceSign} treated as reference ascendant.`
          : "Current MD lord sign treated as reference ascendant.",
      ascSign: mdReferenceChart.ascSign,
      planets: mdReferenceChart.planets,
    };
  }, [
    referenceMode,
    natalAscSign,
    natalPlanets,
    chandraChart,
    currentMdPlanet,
    currentAdPlanet,
    mdReferenceChart,
    adReferenceChart,
  ]);

  const selectedHouseReferenceOption = useMemo(
    () =>
      HOUSE_REFERENCE_OPTIONS.find(
        (option) => option.house === selectedHouseReference
      ) ?? HOUSE_REFERENCE_OPTIONS[0],
    [selectedHouseReference]
  );

  const selectedHouseReferenceChart = useMemo(() => {
    const chart = buildReferenceChartFromHouse(
      natalAscSign,
      natalPlanets,
      selectedHouseReference
    );

    return {
      title: "House-Centered Natal View",
      subtitle: chart?.referenceSign
        ? `${selectedHouseReferenceOption.label} • ${chart.referenceSign} treated as temporary ascendant.`
        : "Selected house treated as temporary ascendant.",
      ascSign: chart.ascSign,
      planets: chart.planets,
    };
  }, [
    natalAscSign,
    natalPlanets,
    selectedHouseReference,
    selectedHouseReferenceOption,
  ]);

  const selectedDateTimeLabel = useMemo(
  () => `Showing chart date: ${transitChartDateISO} ${transitTime}`,
  [transitChartDateISO, transitTime]
);

  useEffect(() => {
    if (!showTransitOverlay) {
      setOverlayTransitPlanets([]);
      return;
    }

    if (!selectedDateISO || !Number.isFinite(birthLat) || !Number.isFinite(birthLon)) return;

    async function fetchOverlayTransitChart() {
      try {
        const res = await fetch("/api/transit-chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateISO: selectedDateISO,
            time: overlayTransitTime,
            timezone: birthTimezone,
            lat: birthLat,
            lon: birthLon,
          }),
        });

        const json = await res.json();

        if (json?.ok) {
          setOverlayTransitPlanets(Array.isArray(json?.planets) ? json.planets : []);
        } else {
          setOverlayTransitPlanets([]);
        }
      } catch {
        setOverlayTransitPlanets([]);
      }
    }

    fetchOverlayTransitChart();
  }, [showTransitOverlay, selectedDateISO, overlayTransitTime, birthLat, birthLon, birthTimezone]);

  useEffect(() => {
  if (!transitChartDateISO || !Number.isFinite(birthLat) || !Number.isFinite(birthLon)) return;

    async function fetchTransitChart() {
      setTransitLoading(true);
      try {
        const res = await fetch("/api/transit-chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateISO: transitChartDateISO,
            time: transitTime,
            timezone: birthTimezone,
            lat: birthLat,
            lon: birthLon,
          }),
        });

        const json = await res.json();
        if (json?.ok) {
          setTransitChartPlanets(Array.isArray(json?.planets) ? json.planets : []);
        } else {
          setTransitChartPlanets([]);
        }
      } catch {
        setTransitChartPlanets([]);
      } finally {
        setTransitLoading(false);
      }
    }

    fetchTransitChart();
  }, [transitChartDateISO, transitTime, birthLat, birthLon, birthTimezone]);

  const getVargaChart = (key: string) => {
    if (key === "d1") {
      return {
        ascSign: natalAscSign,
        planets: normalizeChartPlanets(natalPlanets),
      };
    }

    const value = vargaMap?.[key];

    const rawPlanets =
      (Array.isArray(value?.planets) && value.planets) ||
      (Array.isArray(value?.rows) && value.rows) ||
      (Array.isArray(value?.data?.planets) && value.data.planets) ||
      [];

    const planets = (Array.isArray(rawPlanets) ? rawPlanets : []).map((p) => ({
      ...p,
      planet: p?.planet ?? p?.name ?? p?.id ?? null,
      house: p?.house ?? null,
    }));

    const ascSign =
      value?.ascendant?.sign ??
      value?.ascSign ??
      value?.lagna?.sign ??
      null;

    return {
      ascSign,
      planets,
    };
  };

  const transitMoonInfo = useMemo(() => {
    const moon = Array.isArray(transitChartPlanets)
      ? transitChartPlanets.find((p) => (p?.name ?? p?.id ?? p?.planet) === "Moon")
      : null;

    if (!moon) return null;

    return {
      sign: moon?.sign ?? null,
      degree:
        typeof moon?.deg === "number"
          ? moon.deg
          : typeof moon?.degree === "number"
          ? moon.degree
          : null,
      nakshatra: moon?.nakshatra ?? moon?.nakName ?? null,
      pada: moon?.pada ?? null,
    };
  }, [transitChartPlanets]);

  const expandedChartModal =
    expandedChart && isMounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 p-4"
            onClick={() => setExpandedChart(null)}
          >
            <div className="flex min-h-full items-start justify-center py-6">
              <div
                ref={modalCardRef}
                className="relative w-full max-w-3xl rounded-3xl border border-[color:var(--border)] bg-white/95 p-6 shadow-2xl backdrop-blur-md"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setExpandedChart(null)}
                  className="absolute right-4 top-4 rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>

                <div className="mb-4 pr-20">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {expandedChart.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-900">
                    Expanded divisional chart view.
                  </p>
                </div>

                {expandedChart.ascSign && expandedChart.planets?.length ? (
                  <MediumNorthIndianChart
                    title=""
                    ascSign={expandedChart.ascSign}
                    planets={expandedChart.planets}
                    showPlanetDetails={false}
                    layoutVariant="secondary"
                  />
                ) : (
                  <PlaceholderChart
                    label={`${expandedChart.title} unavailable`}
                    height="h-64"
                  />
                )}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;
const d1PlanetsWithBhava = useMemo(() => {
  const chalitPlanets = Array.isArray(bhavaChalit?.planets)
  ? bhavaChalit.planets
  : [];

  return normalizeChartPlanets(natalPlanets).map((p) => {
    const chalit = chalitPlanets.find(
      (c: any) => (c?.planet ?? c?.name) === p.planet
    );

const isNode = p.planet === "Rahu" || p.planet === "Ketu";

const bhavaHouse =
  typeof chalit?.house === "number"
    ? chalit.house
    : p.house;

const degreeInSign =
  typeof p.degree === "number"
    ? p.degree
    : typeof p.lon === "number"
      ? ((p.lon % 30) + 30) % 30
      : null;

const isBorderlineNode =
  isNode && typeof degreeInSign === "number" && degreeInSign >= 29;

return {
  ...p,
  rashiHouse: p.house,
  house: bhavaHouse,
  displayHouse: isBorderlineNode ? bhavaHouse : p.house,
};
  });
}, [natalPlanets, bhavaChalit]);
  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-6">
        <ChartCard
          title="Natal Lagna Chart"
          subtitle="Primary natal D1 chart."
        >
          <div className="mb-4 rounded-2xl border border-[color:var(--border)] bg-slate-50/70 p-3">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-800">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showTransitOverlay}
                  onChange={(e) => setShowTransitOverlay(e.target.checked)}
                  className="h-4 w-4 rounded border-[color:var(--border)]"
                />
                Transits
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showArudhaOverlay}
                  onChange={(e) => setShowArudhaOverlay(e.target.checked)}
                  className="h-4 w-4 rounded border-[color:var(--border)]"
                />
                Arudhas / AL
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showUpagrahaOverlay}
                  onChange={(e) => setShowUpagrahaOverlay(e.target.checked)}
                  className="h-4 w-4 rounded border-[color:var(--border)]"
                />
                Upagrahas
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showAspectOverlay}
                  onChange={(e) => setShowAspectOverlay(e.target.checked)}
                  className="h-4 w-4 rounded border-[color:var(--border)]"
                />
                House aspects
              </label>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Toggle overlays to keep the D1 chart clean while reviewing specific technical layers.
            </p>
          </div>
<div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
  <div>
    <MediumNorthIndianChart
      title=""
      ascSign={natalAscSign}
      planets={d1PlanetsWithBhava}
      transitPlanets={
        showTransitOverlay
          ? normalizeTransitPlanets(overlayTransitPlanets, natalAscSign)
          : []
      }
      arudhas={arudhas}
      upagrahas={upagrahas}
      solarShadowPoints={solarShadowPoints}
      vedicAspects={vedicAspects}
      showArudhas={showArudhaOverlay}
      showUpagrahas={showUpagrahaOverlay}
      showAspects={showAspectOverlay}
      aspectHouseReferenceHouse={1}
      layoutVariant="primary"
    />

    <FunctionalPlanetSnapshot roles={roles} />
  </div>

  <div className="xl:sticky xl:top-4">
    <ActiveDashaPanel
      currentDasha={currentDasha}
      dashaTimelines={dashaTimelines}
    />

    <PlanetNakshatraSnapshot planets={natalPlanets} />
  </div>
</div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <NabhasaYogasCard data={nabhasaYogas} />
            <ClassicYogasCard
  data={classicYogas}
  currentDasha={currentDasha}
/>
          </div>
        </ChartCard>

        <ChartCard
          title={selectedHouseReferenceChart.title}
          subtitle={selectedHouseReferenceChart.subtitle}
        >
          <div className="mb-4">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-900">
              View from house
            </label>

            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => {
                  setReferenceMenuOpen(false);
                  setHouseReferenceMenuOpen((v) => !v);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition hover:bg-slate-50"
              >
                <span>{selectedHouseReferenceOption.label}</span>
                <span className="text-slate-900">▾</span>
              </button>

              {houseReferenceMenuOpen ? (
                <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[color:var(--border)] bg-white p-1 shadow-xl">
                  {HOUSE_REFERENCE_OPTIONS.map((option) => {
                    const isActive = selectedHouseReference === option.house;

                    return (
                      <button
                        key={option.house}
                        type="button"
                        onClick={() => {
                          setSelectedHouseReference(option.house);
                          setHouseReferenceMenuOpen(false);
                        }}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          {selectedHouseReferenceChart.ascSign &&
          selectedHouseReferenceChart.planets?.length ? (
            <MediumNorthIndianChart
              title=""
              ascSign={selectedHouseReferenceChart.ascSign}
              planets={selectedHouseReferenceChart.planets}
              transitPlanets={
                showTransitOverlay
                  ? normalizeTransitPlanets(
                      overlayTransitPlanets,
                      selectedHouseReferenceChart.ascSign
                    )
                  : []
              }
              upagrahas={upagrahas}
              solarShadowPoints={solarShadowPoints}
              vedicAspects={vedicAspects}
            showArudhas={showArudhaOverlay}
            showUpagrahas={showUpagrahaOverlay}
            showAspects={showAspectOverlay}
              aspectHouseReferenceHouse={selectedHouseReference}
              layoutVariant="primary"
            />
          ) : (
            <PlaceholderChart
              label="House-centered chart unavailable"
              height="h-40"
            />
          )}

          <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-slate-50 p-3 text-xs text-slate-600">
            Natal chart rotated so the selected house becomes the temporary ascendant.
            This is a reference view of the natal chart, not a separate divisional chart.
          </div>
        </ChartCard>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <MediumChartCard
            title="Chandra Chart"
            subtitle="Moon-reference chart."
            ascSign={chandraChart.ascSign}
            planets={chandraChart.planets}
          />

          <ChartCard
            title="Bhava Chalit Chart"
            subtitle={`Classic Bhava Chalit${classicChalit?.system ? ` (${classicChalit.system})` : ""}.`}
          >
            {classicChalit?.ascendant?.sign &&
            Array.isArray(classicChalit?.planets) &&
            classicChalit.planets.length ? (
              <>
                <MediumNorthIndianChart
                  title=""
                  ascSign={classicChalit?.ascendant?.sign ?? null}
                  planets={classicChalit?.planets ?? []}
                  mode="chalit"
                  layoutVariant="secondary"
                />

                <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-slate-50 p-4 shadow-sm">
                  <div className="mb-2 text-sm font-semibold text-slate-900">
                    Planet Shifts
                  </div>

                  <div className="space-y-1">
                    {getPlanetShifts(classicChalit?.planets ?? []).map((s) => (
                      <div key={s.planet} className="flex justify-between text-sm">
                        <span>{s.planet}</span>
                        <span
                          className={
                            s.changed
                              ? "font-semibold text-orange-600"
                              : "text-slate-900"
                          }
                        >
                          {s.from} → {s.to}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <PlaceholderChart
                label="Bhava Chalit Chart unavailable"
                height="h-40"
              />
            )}
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title={selectedReferenceChart.title}
          subtitle={selectedReferenceChart.subtitle}
        >
          <div className="mb-4">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-900">
              Reference mode
            </label>

            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => {
                  setHouseReferenceMenuOpen(false);
                  setReferenceMenuOpen((v) => !v);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition hover:bg-slate-50"
              >
                <span>
                  {referenceMode === "lagna"
                    ? "Lagna"
                    : referenceMode === "moon"
                    ? "Moon"
                    : referenceMode === "md"
                    ? "Mahadasha"
                    : "Antardasha"}
                </span>
                <span className="text-slate-900">▾</span>
              </button>

              {referenceMenuOpen ? (
                <div className="absolute z-20 mt-2 w-full rounded-xl border border-[color:var(--border)] bg-white p-1 shadow-xl">
                  {[
                    { key: "lagna", label: "Lagna" },
                    { key: "moon", label: "Moon" },
                    { key: "md", label: "Mahadasha" },
                    { key: "ad", label: "Antardasha" },
                  ].map((option) => {
                    const isActive = referenceMode === option.key;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setReferenceMode(option.key as ReferenceMode);
                          setReferenceMenuOpen(false);
                        }}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          {selectedReferenceChart.ascSign && selectedReferenceChart.planets?.length ? (
            <MediumNorthIndianChart
              title=""
              ascSign={selectedReferenceChart.ascSign}
              planets={selectedReferenceChart.planets}
              layoutVariant="secondary"
            />
          ) : (
            <PlaceholderChart label="Reference chart unavailable" height="h-40" />
          )}
        </ChartCard>

        <ChartCard
          title="Transit Chart by Date"
          subtitle="Select a past or future date to inspect transit placements."
        >
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-900">
                Chart date
              </label>
<input
  type="date"
  value={transitChartDateISO}
  onChange={(e) => setTransitChartDateISO(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-900">
                Chart time
              </label>
              <input
                type="time"
                value={transitTime}
                onChange={(e) => setTransitTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-xs text-slate-900">
                {selectedDateTimeLabel}
                {birthTimezone ? ` • ${birthTimezone}` : ""}
              </div>
            </div>
          </div>

          {transitLoading ? (
            <PlaceholderChart label="Loading transit chart..." />
          ) : transitChartPlanets.length ? (
            <div className="space-y-4">
              {transitMoonInfo ? (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3">
                  <div className="text-xs font-medium uppercase tracking-wide text-indigo-700">
                    Transit Moon
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-slate-900/90 md:grid-cols-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-900">
                        Sign
                      </div>
                      <div className="mt-1 font-medium">
                        {transitMoonInfo.sign ?? "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-900">
                        Degree
                      </div>
                      <div className="mt-1 font-medium">
                        {typeof transitMoonInfo.degree === "number"
                          ? `${transitMoonInfo.degree.toFixed(2)}°`
                          : "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-900">
                        Nakshatra
                      </div>
                      <div className="mt-1 font-medium">
                        {transitMoonInfo.nakshatra ?? "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-900">
                        Pada
                      </div>
                      <div className="mt-1 font-medium">
                        {transitMoonInfo.pada ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <MediumNorthIndianChart
                title=""
                ascSign={natalAscSign}
                planets={normalizeTransitPlanets(transitChartPlanets, natalAscSign)}
                layoutVariant="secondary"
              />
            </div>
          ) : (
            <PlaceholderChart label="No transit data" />
          )}
        </ChartCard>
      </div>
      {expandedChartModal}
    </div>
  );
}
