import { useEffect, useMemo, useState } from "react";
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
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-transform duration-200 hover:scale-[1.01]">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-white/50">{subtitle}</p>
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
      className={`flex ${height} items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-sm text-white/50`}
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
        
      <MediumNorthIndianChart title="" ascSign={ascSign} planets={planets} />
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

function getPlanetShifts(planets: any[]) {
  return (Array.isArray(planets) ? planets : []).map((p) => ({
    planet: p?.planet ?? p?.name ?? "Unknown",
    from: p?.rashiHouse ?? null,
    to: p?.house ?? null,
    changed: p?.rashiHouse !== p?.house,
  }));
}

type ReferenceMode = "lagna" | "moon" | "md" | "ad";

type ExpandedChartState = {
  key: string;
  title: string;
  ascSign: string | null;
  planets: any[];
} | null;

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
  sarvaAshtakvarga,
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
  sarvaAshtakvarga?: number[];
}) {
  const [transitPlanets, setTransitPlanets] = useState<any[]>([]);
  const [transitLoading, setTransitLoading] = useState(false);
  const [transitTime, setTransitTime] = useState("12:00");
  const [referenceMode, setReferenceMode] = useState<ReferenceMode>("md");
  const [showTransitOverlay, setShowTransitOverlay] = useState(false);
  const [expandedChart, setExpandedChart] = useState<ExpandedChartState>(null);

  const chandraChart = buildChandraChartPlanets(natalPlanets);

  const mdReferenceChart = buildReferenceChartFromPlanet(
    natalPlanets,
    currentMdPlanet
  );

  const adReferenceChart = buildReferenceChartFromPlanet(
    natalPlanets,
    currentAdPlanet
  );

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
  house: p?.house ?? null, // 🔑 DO NOT TOUCH
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

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Natal Lagna Chart"
          subtitle="Primary natal D1 chart."
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-3 text-base font-medium text-white/80">
              <input
                type="checkbox"
                checked={showTransitOverlay}
                onChange={(e) => setShowTransitOverlay(e.target.checked)}
                className="h-5 w-5 rounded border-white/15"
              />
              Show transits
            </label>

            {showTransitOverlay ? (
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
  Transit overlay active
</div>
            ) : null}
          </div>
<div className="text-xs text-white/50 mb-2 flex items-center gap-2">
  <span className="font-medium text-white/70">Sarva AV</span>
  <span>values shown inside each house</span>
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
  sarvaAshtakvarga={sarvaAshtakvarga}
/>
        </ChartCard>

        <MediumChartCard
          title="Chandra Chart"
          subtitle="Moon-reference chart."
          ascSign={chandraChart.ascSign}
          planets={chandraChart.planets}
        />

        <div className="xl:col-span-2">
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
                />

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.16)]">
                  <div className="mb-2 text-sm font-semibold text-white">Planet Shifts</div>

                  <div className="space-y-1">
                    {getPlanetShifts(classicChalit?.planets ?? []).map((s) => (
                      <div key={s.planet} className="flex justify-between text-sm">
                        <span>{s.planet}</span>
                        <span
                          className={
                            s.changed
                              ? "font-semibold text-orange-200"
                              : "text-white/50"
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
              <PlaceholderChart label="Bhava Chalit Chart unavailable" height="h-40" />
            )}
          </ChartCard>
        </div>
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
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition-transform duration-200 hover:scale-105 hover:border-white/15"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
                      {key.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-white/40">Click to expand</div>
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
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-white/50">
              No divisional charts available.
            </div>
          )}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title={selectedReferenceChart.title}
          subtitle={selectedReferenceChart.subtitle}
        >
          <div className="mb-4">
            <label className="text-xs font-medium uppercase tracking-wide text-white/50">
              Reference mode
            </label>
            <select
              value={referenceMode}
              onChange={(e) => setReferenceMode(e.target.value as ReferenceMode)}
              className="mt-1 w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="lagna">Lagna</option>
              <option value="moon">Moon</option>
              <option value="md">Mahadasha</option>
              <option value="ad">Antardasha</option>
            </select>
          </div>

          {selectedReferenceChart.ascSign && selectedReferenceChart.planets?.length ? (
            
            <MediumNorthIndianChart
              title=""
              ascSign={selectedReferenceChart.ascSign}
              planets={selectedReferenceChart.planets}
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
              <label className="text-xs font-medium uppercase tracking-wide text-white/50">
                Chart date
              </label>
              <input
                type="date"
                value={selectedDateISO}
                onChange={(e) => setSelectedDateISO(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-white/50">
                Chart time
              </label>
              <input
                type="time"
                value={transitTime}
                onChange={(e) => setTransitTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-xs text-white/50">
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
                <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-3">
                  <div className="text-xs font-medium uppercase tracking-wide text-indigo-200">
                    Transit Moon
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-white/90 md:grid-cols-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-white/50">
                        Sign
                      </div>
                      <div className="mt-1 font-medium">
                        {transitMoonInfo.sign ?? "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-white/50">
                        Degree
                      </div>
                      <div className="mt-1 font-medium">
                        {typeof transitMoonInfo.degree === "number"
                          ? `${transitMoonInfo.degree.toFixed(2)}°`
                          : "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-white/50">
                        Nakshatra
                      </div>
                      <div className="mt-1 font-medium">
                        {transitMoonInfo.nakshatra ?? "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-white/50">
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
              />
            </div>
          ) : (
            <PlaceholderChart label="No transit data" />
          )}
        </ChartCard>
      </div>

      {expandedChart ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0C1222]/95 p-6 shadow-2xl backdrop-blur-md">s
            <button
              type="button"
              onClick={() => setExpandedChart(null)}
              className="absolute right-4 top-4 rounded-full border border-white/10 px-3 py-1 text-sm text-white/70 hover:bg-white/5"
            >
              Close
            </button>

            <div className="mb-4 pr-20">
              <h3 className="text-lg font-semibold text-white">
                {expandedChart.title}
              </h3>
              <p className="mt-1 text-sm text-white/50">
                Expanded divisional chart view.
              </p>
            </div>

            {expandedChart.ascSign && expandedChart.planets?.length ? (
                
            <MediumNorthIndianChart
  title=""
  ascSign={expandedChart.ascSign}
  planets={expandedChart.planets}
  showPlanetDetails={false}
/>
            ) : (
              <PlaceholderChart
                label={`${expandedChart.title} unavailable`}
                height="h-64"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}