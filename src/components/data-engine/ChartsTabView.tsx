import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MiniNorthIndianChart from "@/components/data-engine/MiniNorthIndianChart";
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
}) {
  const [transitPlanets, setTransitPlanets] = useState<any[]>([]);
  const [transitLoading, setTransitLoading] = useState(false);
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
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      modalCardRef.current?.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "instant" as ScrollBehavior,
      });
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
    () => `Showing chart date: ${selectedDateISO} ${transitTime}`,
    [selectedDateISO, transitTime]
  );

  useEffect(() => {
    if (!selectedDateISO || !Number.isFinite(birthLat) || !Number.isFinite(birthLon)) return;

    async function fetchTransitChart() {
      setTransitLoading(true);
      try {
        const res = await fetch("/api/transit-chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateISO: selectedDateISO,
            time: transitTime,
            timezone: birthTimezone,
            lat: birthLat,
            lon: birthLon,
          }),
        });

        const json = await res.json();
        if (json?.ok) {
          setTransitPlanets(Array.isArray(json?.planets) ? json.planets : []);
        } else {
          setTransitPlanets([]);
        }
      } catch {
        setTransitPlanets([]);
      } finally {
        setTransitLoading(false);
      }
    }

    fetchTransitChart();
  }, [selectedDateISO, transitTime, birthLat, birthLon, birthTimezone]);

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
    const moon = Array.isArray(transitPlanets)
      ? transitPlanets.find((p) => (p?.name ?? p?.id ?? p?.planet) === "Moon")
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
  }, [transitPlanets]);

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
<MediumNorthIndianChart
              title=""
              ascSign={natalAscSign}
              planets={normalizeChartPlanets(natalPlanets)}
              transitPlanets={
                showTransitOverlay
                  ? normalizeTransitPlanets(transitPlanets, natalAscSign)
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
              rightPanel={
              <ActiveDashaPanel
                currentDasha={currentDasha}
                dashaTimelines={dashaTimelines}
              />
            }
          />
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
                      transitPlanets,
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
                value={selectedDateISO}
                onChange={(e) => setSelectedDateISO(e.target.value)}
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
          ) : transitPlanets.length ? (
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
                planets={normalizeTransitPlanets(transitPlanets, natalAscSign)}
                layoutVariant="secondary"
              />
            </div>
          ) : (
            <PlaceholderChart label="No transit data" />
          )}
        </ChartCard>
      </div>

      <ChartCard
        title="Divisional Chart Gallery"
        subtitle="Click any chart to open a larger view."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chartGalleryKeys.length ? (
            chartGalleryKeys.map((key) => {
              const chart = getVargaChart(key);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setExpandedChart({
                      key,
                      title: `${key.toUpperCase()} Chart`,
                      ascSign: chart.ascSign,
                      planets: chart.planets,
                    })
                  }
                  className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-3 text-left transition-transform duration-200 hover:scale-[1.02] hover:border-[color:var(--border)]"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-900">
                      {key.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-slate-900">Click to expand</div>
                  </div>

                  {chart.ascSign && chart.planets?.length ? (
                    <MiniNorthIndianChart
                      ascSign={chart.ascSign}
                      planets={chart.planets}
                    />
                  ) : (
                    <PlaceholderChart
                      label={`${key.toUpperCase()} Chart unavailable`}
                      height="h-32"
                    />
                  )}
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-white/80 p-6 text-sm text-slate-900">
              No divisional charts available.
            </div>
          )}
        </div>
      </ChartCard>

      {expandedChartModal}
    </div>
  );
}
