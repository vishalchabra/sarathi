"use client";

import { buildGunaMilan } from "@/lib/astrology/matchmaking/buildGunaMilan";

function getAvakhada(data: any) {
  return data?.strength?.avakhada ?? null;
}

function getBirthMeta(data: any) {
  return data?.foundations?.birthMeta ?? data?.birthMeta ?? null;
}

function getPlanets(data: any) {
  return data?.foundations?.natal?.planets ?? data?.natal?.planets ?? [];
}

function getPlanet(data: any, planetName: string) {
  const planets = getPlanets(data);

  return Array.isArray(planets)
    ? planets.find((p: any) => p?.planet === planetName) ?? null
    : null;
}

function getMoonRow(data: any) {
  return getPlanet(data, "Moon");
}

function getCurrentDashaLabel(data: any) {
  const current = data?.timing?.dasha?.current ?? data?.dasha?.current ?? {};

  const md =
    current?.md?.planet ??
    current?.mahadasha?.planet ??
    current?.md ??
    null;

  const ad =
    current?.ad?.planet ??
    current?.antardasha?.planet ??
    current?.ad ??
    null;

  const pd =
    current?.pd?.planet ??
    current?.pratyantardasha?.planet ??
    current?.pd ??
    null;

  return [md, ad, pd].filter(Boolean).join(" / ") || "—";
}

function formatDate(dateISO?: string | null) {
  if (!dateISO) return "—";

  const date = new Date(`${dateISO}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateISO;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value: any, digits = 2) {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toFixed(digits)
    : value ?? "—";
}

function DataRow({
  label,
  a,
  b,
}: {
  label: string;
  a: any;
  b: any;
}) {
  return (
    <tr className="border-t border-[color:var(--border)]">
      <td className="px-4 py-3 font-medium text-slate-900">{label}</td>
      <td className="px-4 py-3 text-slate-700">{a ?? "—"}</td>
      <td className="px-4 py-3 text-slate-700">{b ?? "—"}</td>
    </tr>
  );
}

function StatusChip({
  children,
  tone = "slate",
}: {
  children: any;
  tone?: "slate" | "green" | "amber" | "red" | "violet";
}) {
  const classes =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : tone === "red"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        classes,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function levelTone(level: string): "slate" | "green" | "amber" | "red" | "violet" {
  if (level === "None") return "green";
  if (level === "Low") return "amber";
  if (level === "Medium") return "violet";
  if (level === "High") return "red";
  return "slate";
}

const MANGAL_DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];

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
];

function houseFromSign(targetSign?: string | null, referenceSign?: string | null) {
  const targetIndex = SIGN_ORDER.indexOf(String(targetSign ?? ""));
  const referenceIndex = SIGN_ORDER.indexOf(String(referenceSign ?? ""));

  if (targetIndex < 0 || referenceIndex < 0) return null;

  return ((targetIndex - referenceIndex + 12) % 12) + 1;
}

function buildMangalDoshaData(data: any) {
  const mars = getPlanet(data, "Mars");
  const moon = getPlanet(data, "Moon");
  const venus = getPlanet(data, "Venus");

  const ascSign =
    data?.foundations?.ascendant?.sign ??
    data?.foundations?.natal?.ascendant?.sign ??
    null;

  // Exact Lagna-house from the same natal engine used by Charts tab.
  const marsHouseFromLagna =
    typeof mars?.house === "number" ? mars.house : null;

  const marsHouseFromMoon = houseFromSign(mars?.sign, moon?.sign);
  const marsHouseFromVenus = houseFromSign(mars?.sign, venus?.sign);

  const lagnaDosha =
    typeof marsHouseFromLagna === "number" &&
    MANGAL_DOSHA_HOUSES.includes(marsHouseFromLagna);

  const moonDosha =
    typeof marsHouseFromMoon === "number" &&
    MANGAL_DOSHA_HOUSES.includes(marsHouseFromMoon);

  const venusDosha =
    typeof marsHouseFromVenus === "number" &&
    MANGAL_DOSHA_HOUSES.includes(marsHouseFromVenus);

  const count = [lagnaDosha, moonDosha, venusDosha].filter(Boolean).length;

  let level = "None";
  if (count === 1) level = "Low";
  if (count === 2) level = "Medium";
  if (count === 3) level = "High";

  return {
    mars,
    moon,
    venus,
    ascSign,
    marsHouseFromLagna,
    marsHouseFromMoon,
    marsHouseFromVenus,
    lagnaDosha,
    moonDosha,
    venusDosha,
    triggerCount: count,
    level,
  };
}

function hasSameHouseConjunction(p1: any, p2: any) {
  return (
    p1 &&
    p2 &&
    typeof p1.house === "number" &&
    typeof p2.house === "number" &&
    p1.house === p2.house
  );
}

function hasJupiterAspectOnMars(data: any) {
  const mars = getPlanet(data, "Mars");
  const jupiter = getPlanet(data, "Jupiter");

  if (!mars || !jupiter) return false;

  const marsHouse = mars.house;
  const jupiterHouse = jupiter.house;

  if (typeof marsHouse !== "number" || typeof jupiterHouse !== "number") {
    return false;
  }

  const distance = ((marsHouse - jupiterHouse + 12) % 12) + 1;

  // Jupiter aspects 5th, 7th, and 9th from itself.
  return [5, 7, 9].includes(distance);
}

function buildMangalCancellationData(data: any, mangal: any) {
  const mars = getPlanet(data, "Mars");
  const moon = getPlanet(data, "Moon");
  const jupiter = getPlanet(data, "Jupiter");

  const marsSign = mars?.sign ?? null;

  const checks = [
    {
      label: "Mars in own sign",
      value: marsSign === "Aries" || marsSign === "Scorpio",
      note: "Mars in Aries or Scorpio",
    },
    {
      label: "Mars exalted",
      value: marsSign === "Capricorn",
      note: "Mars in Capricorn",
    },
    {
      label: "Mars debilitated",
      value: marsSign === "Cancer",
      note: "Mars in Cancer",
    },
    {
      label: "Mars with Jupiter",
      value: hasSameHouseConjunction(mars, jupiter),
      note: "Mars and Jupiter in same house",
    },
    {
      label: "Jupiter aspect on Mars",
      value: hasJupiterAspectOnMars(data),
      note: "Jupiter aspects Mars by 5th, 7th, or 9th aspect",
    },
    {
      label: "Mars with Moon",
      value: hasSameHouseConjunction(mars, moon),
      note: "Mars and Moon in same house",
    },
  ];

  const active = checks.filter((c) => c.value);

  return {
    checks,
    activeCount: active.length,
    activeLabels: active.map((c) => c.label),
    hasCancellation: active.length > 0,
    mangalLevel: mangal?.level ?? "None",
  };
}

function formatHouseCheck(house: any, active: boolean) {
  const houseLabel = typeof house === "number" ? `House ${house}` : "—";

  return (
    <span className="inline-flex items-center gap-2">
      <span>{houseLabel}</span>
      {active ? (
        <StatusChip tone="red">Dosha</StatusChip>
      ) : (
        <StatusChip tone="slate">Clear</StatusChip>
      )}
    </span>
  );
}

function MangalPersonCard({
  name,
  mangal,
  cancellation,
}: {
  name: string;
  mangal: any;
  cancellation: any;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-slate-900">{name}</h4>
          <p className="mt-1 text-sm text-slate-500">
            Mars: {mangal?.mars?.sign ?? "—"}{" "}
            {typeof mangal?.mars?.degree === "number"
              ? `${mangal.mars.degree.toFixed(2)}°`
              : ""}
          </p>
        </div>

        <StatusChip tone={levelTone(mangal?.level)}>
          {mangal?.level ?? "—"}
        </StatusChip>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3">
        <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            From Lagna
          </div>
          <div className="mt-2 text-sm font-medium text-slate-800">
            {formatHouseCheck(mangal?.marsHouseFromLagna, mangal?.lagnaDosha)}
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            From Moon
          </div>
          <div className="mt-2 text-sm font-medium text-slate-800">
            {formatHouseCheck(mangal?.marsHouseFromMoon, mangal?.moonDosha)}
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            From Venus
          </div>
          <div className="mt-2 text-sm font-medium text-slate-800">
            {formatHouseCheck(mangal?.marsHouseFromVenus, mangal?.venusDosha)}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Cancellation signals
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {cancellation?.activeCount ?? 0} active
            </div>
          </div>
          <StatusChip tone={cancellation?.hasCancellation ? "green" : "slate"}>
            {cancellation?.hasCancellation ? "Present" : "None"}
          </StatusChip>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {cancellation?.activeLabels?.length ? (
            cancellation.activeLabels.map((label: string) => (
              <StatusChip key={label} tone="green">
                {label}
              </StatusChip>
            ))
          ) : (
            <span className="text-sm text-slate-500">
              No listed cancellation signal triggered.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MangalComparisonPanel({
  personAName,
  personBName,
  aMangal,
  bMangal,
  aMangalCancellation,
  bMangalCancellation,
}: {
  personAName: string;
  personBName: string;
  aMangal: any;
  bMangal: any;
  aMangalCancellation: any;
  bMangalCancellation: any;
}) {
  const bothHaveMangal =
    aMangal?.level !== "None" && bMangal?.level !== "None";

  const sameLevel = aMangal?.level === bMangal?.level;

  const balanceReference = sameLevel
    ? "Same level"
    : `${aMangal?.level ?? "—"} / ${bMangal?.level ?? "—"}`;

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Mangal Dosha Comparison
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Data-only Mars check from Lagna, Moon, and Venus, using the same natal
            planet data as the Charts tab.
          </p>
        </div>

        <StatusChip tone={bothHaveMangal ? "amber" : "slate"}>
          {bothHaveMangal ? "Both have Mangal influence" : "Unequal / partial"}
        </StatusChip>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <MangalPersonCard
          name={personAName}
          mangal={aMangal}
          cancellation={aMangalCancellation}
        />

        <MangalPersonCard
          name={personBName}
          mangal={bMangal}
          cancellation={bMangalCancellation}
        />

        <div className="rounded-3xl border border-[color:var(--border)] bg-white p-5 shadow-sm">
          <h4 className="text-base font-semibold text-slate-900">
            Pair Balance Reference
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Neutral reference only; final judgement is left to the astrologer.
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50/60 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Mangal levels
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusChip tone={levelTone(aMangal?.level)}>
                  {personAName}: {aMangal?.level ?? "—"}
                </StatusChip>
                <StatusChip tone={levelTone(bMangal?.level)}>
                  {personBName}: {bMangal?.level ?? "—"}
                </StatusChip>
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50/60 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Balance status
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                {balanceReference}
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50/60 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Cancellation signal count
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                {personAName}: {aMangalCancellation?.activeCount ?? 0} • {" "}
                {personBName}: {bMangalCancellation?.activeCount ?? 0}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-amber-50/60 p-4 text-sm text-amber-800">
            Mangal Dosha houses checked: 1, 2, 4, 7, 8, 12 from Lagna, Moon,
            and Venus. Cancellation rules vary by tradition.
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-slate-50/70 p-4">
  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
    Advanced Cancellation Signals
  </div>

  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
    <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4">
      <div className="text-sm font-semibold text-slate-900">
        {personAName}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {aMangalCancellation?.activeLabels?.length ? (
          aMangalCancellation.activeLabels.map((label: string) => (
            <StatusChip key={label} tone="green">
              {label}
            </StatusChip>
          ))
        ) : (
          <StatusChip tone="slate">None triggered</StatusChip>
        )}
      </div>
    </div>

    <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4">
      <div className="text-sm font-semibold text-slate-900">
        {personBName}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {bMangalCancellation?.activeLabels?.length ? (
          bMangalCancellation.activeLabels.map((label: string) => (
            <StatusChip key={label} tone="green">
              {label}
            </StatusChip>
          ))
        ) : (
          <StatusChip tone="slate">None triggered</StatusChip>
        )}
      </div>
    </div>
  </div>

  <p className="mt-3 text-xs text-slate-500">
    Cancellation checks are reference data only. Traditions differ on which
    cancellations are accepted and how strongly they reduce Mangal Dosha.
  </p>
</div>
    </div>
  );
}

export default function GunaMilanPanel({
  personAData,
  personBData,
}: {
  personAData: any;
  personBData: any | null;
}) {
  const aBirth = getBirthMeta(personAData);
  const bBirth = getBirthMeta(personBData);

  const aAvakhada = getAvakhada(personAData);
  const bAvakhada = getAvakhada(personBData);

  const gunaMilan = buildGunaMilan({
    personAAvakhada: aAvakhada,
    personBAvakhada: bAvakhada,
  });

  const aMoon = getMoonRow(personAData);
  const bMoon = getMoonRow(personBData);

  const aMangal = buildMangalDoshaData(personAData);
  const bMangal = buildMangalDoshaData(personBData);

  const aMangalCancellation = buildMangalCancellationData(personAData, aMangal);
  const bMangalCancellation = buildMangalCancellationData(personBData, bMangal);

  if (!personBData) {
    return (
      <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 text-sm text-slate-500 shadow-sm">
        Generate the second chart to view Guna Milan data.
      </section>
    );
  }

  const personAName = aBirth?.name ?? "Person A";
  const personBName = bBirth?.name ?? "Person B";

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Guna Milan Data
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Data-only comparison based on Moon sign, nakshatra, and avakhada
          fields.
        </p>
      </div>

      <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          Birth Details
        </h3>

        <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Field</th>
                <th className="px-4 py-3 text-left">{personAName}</th>
                <th className="px-4 py-3 text-left">{personBName}</th>
              </tr>
            </thead>

            <tbody>
              <DataRow label="Name" a={aBirth?.name} b={bBirth?.name} />
              <DataRow
                label="Date"
                a={formatDate(aBirth?.dateISO)}
                b={formatDate(bBirth?.dateISO)}
              />
              <DataRow label="Time" a={aBirth?.time} b={bBirth?.time} />
              <DataRow
                label="Timezone"
                a={aBirth?.timezone}
                b={bBirth?.timezone}
              />
              <DataRow
                label="Latitude"
                a={formatNumber(aBirth?.lat, 5)}
                b={formatNumber(bBirth?.lat, 5)}
              />
              <DataRow
                label="Longitude"
                a={formatNumber(aBirth?.lon, 5)}
                b={formatNumber(bBirth?.lon, 5)}
              />
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          Moon & Avakhada Data
        </h3>

        <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Factor</th>
                <th className="px-4 py-3 text-left">{personAName}</th>
                <th className="px-4 py-3 text-left">{personBName}</th>
              </tr>
            </thead>

            <tbody>
              <DataRow
                label="Moon Sign / Rashi"
                a={aAvakhada?.rashi ?? aMoon?.sign}
                b={bAvakhada?.rashi ?? bMoon?.sign}
              />
              <DataRow
                label="Moon Nakshatra"
                a={aAvakhada?.nakshatra ?? aMoon?.nakshatra}
                b={bAvakhada?.nakshatra ?? bMoon?.nakshatra}
              />
              <DataRow
                label="Pada"
                a={aAvakhada?.pada ?? aMoon?.pada}
                b={bAvakhada?.pada ?? bMoon?.pada}
              />
              <DataRow label="Varna" a={aAvakhada?.varna} b={bAvakhada?.varna} />
              <DataRow label="Gana" a={aAvakhada?.gana} b={bAvakhada?.gana} />
              <DataRow label="Yoni" a={aAvakhada?.yoni} b={bAvakhada?.yoni} />
              <DataRow label="Nadi" a={aAvakhada?.nadi} b={bAvakhada?.nadi} />
              <DataRow
                label="Current Dasha"
                a={getCurrentDashaLabel(personAData)}
                b={getCurrentDashaLabel(personBData)}
              />
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Ashtakoota / Guna Milan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Row-wise calculated points. Data-only view, no prediction.
            </p>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-white px-5 py-3 text-right shadow-sm">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Total
            </div>
            <div className="text-2xl font-semibold text-slate-900">
              {gunaMilan.total.obtained} / {gunaMilan.total.maximum}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Guna</th>
                <th className="px-4 py-3 text-left">{personAName}</th>
                <th className="px-4 py-3 text-left">{personBName}</th>
                <th className="px-4 py-3 text-left">Max</th>
                <th className="px-4 py-3 text-left">Obtained</th>
                <th className="px-4 py-3 text-left">Area</th>
                <th className="px-4 py-3 text-left">Data Note</th>
              </tr>
            </thead>

            <tbody>
              {gunaMilan.rows.map((row: any) => (
                <tr
                  key={row.guna}
                  className="border-t border-[color:var(--border)]"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {row.guna}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.personA}</td>
                  <td className="px-4 py-3 text-slate-700">{row.personB}</td>
                  <td className="px-4 py-3 text-slate-700">{row.maximum}</td>
                  <td className="px-4 py-3 font-semibold text-[color:var(--primary)]">
                    {row.obtained}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.area}</td>
                  <td className="px-4 py-3 text-slate-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Astro-compatible Ashtakoota scoring (beta). Results may vary by
          tradition.
        </p>
      </div>

      <MangalComparisonPanel
        personAName={personAName}
        personBName={personBName}
        aMangal={aMangal}
        bMangal={bMangal}
        aMangalCancellation={aMangalCancellation}
        bMangalCancellation={bMangalCancellation}
      />
    </section>
  );
}
