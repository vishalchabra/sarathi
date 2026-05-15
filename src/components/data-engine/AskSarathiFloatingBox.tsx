"use client";

import { useRef, useState } from "react";

type AnswerBlock = {
  title: string;
  summary?: string;
  rows: string[];
};
type AskContext = {
  lastPlanet?: string | null;
  lastHouse?: number | null;
  lastChartKey?: string | null;
  lastTopic?: string | null;
};
function normalizeAskSarathiPlanets(rows: any[]): any[] {
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
      nakshatra: p?.nakshatra ?? p?.nakName ?? null,
      pada: p?.pada ?? null,
      retrograde:
  typeof p?.retrograde === "boolean"
    ? p.retrograde
    : Boolean(p?.isRetrograde),
combust:
  typeof p?.combust === "boolean"
    ? p.combust
    : Boolean(p?.isCombust),
isExalted: Boolean(p?.isExalted),
isDebilitated: Boolean(p?.isDebilitated),
    }))
    .filter((p) => p?.planet);
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
  return node?.planet ?? node?.lord ?? node?.name ?? node?.dashaLord ?? "—";
}

const DEFINITIONS: Record<string, string> = {
  d10: "D10, or Dasamsa, is the divisional chart used for career, karma, status, authority, and professional direction.",
  d9: "D9, or Navamsa, is the divisional chart used for dharma, marriage, deeper strength of planets, and maturity of the chart.",
  lagna: "Lagna means Ascendant. It is the rising sign at birth and acts as the starting point of the chart.",
  "lagna lord": "Lagna lord is the ruler of the Ascendant sign. Its placement shows where the chart’s core focus is carried.",
  shadbala: "Shadbala is a classical system of measuring planetary strength through six types of strength.",
  ashtakavarga: "Ashtakavarga is a scoring system showing how planets contribute strength to houses/signs.",
};
const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

function getLagnaLord(sign: string | null) {
  if (!sign) return null;
  return SIGN_LORDS[sign] ?? null;
}
function getHouseSignFromAsc(ascSign: string | null, house: number) {
  if (!ascSign) return null;

  const signs = Object.keys(SIGN_LORDS);
  const ascIndex = signs.indexOf(ascSign);

  if (ascIndex < 0) return null;

  return signs[(ascIndex + house - 1) % 12] ?? null;
}

function getHouseLord(ascSign: string | null, house: number) {
  const sign = getHouseSignFromAsc(ascSign, house);
  if (!sign) return null;

  return {
    sign,
    lord: SIGN_LORDS[sign] ?? null,
  };
}
export default function AskSarathiFloatingBox({
  natalPlanets,
  natalAscSign,
  vargaMap,
  chartGalleryKeys,
  currentDasha,
  dashaTimelines,
  vedicAspects,
  houseData,
  triggerEngine,
}: {
  natalPlanets: any[];
  natalAscSign: string | null;
  vargaMap: Record<string, any>;
  chartGalleryKeys: string[];
  currentDasha?: any;
  dashaTimelines?: any;
  vedicAspects?: any;
  houseData?: any;
  triggerEngine?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AnswerBlock>({
    title: "Ask factual chart-data questions",
    summary: "No interpretation. No AI. Answers are based only on loaded chart data.",
    rows: [
      "Try: What dasha is running?",
      "Try: Where is Mars in D10?",
      "Try: Show Mars in all vargas.",
      "Try: What is D10?",
    ],
  });
 const [askContext, setAskContext] = useState<AskContext>({});
 const askContextRef = useRef<AskContext>({});
  const [position, setPosition] = useState({ x: 900, y: 170 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
console.log("ASK SARATHI PROPS", { vedicAspects });
  const planetNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const hasAny = (text: string, words: string[]) => {
  return words.some((word) => text.includes(word));
};

const isPlacementQuery = (text: string) => {
  return hasAny(text, [
    "where is",
    "placement",
    "position",
    "placed",
    "posited",
    "located",
  ]);
};

const isRelationshipQuery = (text: string) => {
  return hasAny(text, [
    "conjunction",
    "conjunct",
    "conj",
    "relation",
    "relationship",
    "sambandh",
    "connection",
    "connected",
    "with",
    "together",
    "same house",
  ]);
};

const isAspectQuery = (text: string) =>
  hasAny(text, [
    "aspect",
    "aspects",
    "drishti",
    "influence",
    "influences",
    "who aspects",
  ]);
  function startDrag(e: React.MouseEvent<HTMLDivElement>) {
    setDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }

  function onDrag(e: React.MouseEvent<HTMLDivElement>) {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  }
const normalizeQuestion = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[?.,!]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\basc\b/g, "ascendant")
    .replace(/\blagna\b/g, "ascendant")
    .replace(/\bmd\b/g, "mahadasha")
    .replace(/\bad\b/g, "antardasha")
    .replace(/\bpd\b/g, "pratyantardasha")
    .replace(/\bnak\b/g, "nakshatra")
    .replace(/\bnakshtra\b/g, "nakshatra")
    .replace(/\bvarga\b/g, "vargas")
    .replace(/\bretro\b/g, "retrograde")
.replace(/\bretrograded\b/g, "retrograde")
.replace(/\bcombusted\b/g, "combust")
.replace(/\bmd lord\b/g, "mahadasha lord")
.replace(/\bad lord\b/g, "antardasha lord")
.replace(/\bpd lord\b/g, "pratyantardasha lord")
.replace(/\b10l\b/g, "10th lord")
.replace(/\b7l\b/g, "7th lord")
.replace(/\b4l\b/g, "4th lord")
.replace(/\b9l\b/g, "9th lord")
};

const NAKSHATRA_ALIASES: Record<string, string> = {
  ashwini: "Ashwini",
  ashvini: "Ashwini",
  bharani: "Bharani",
  krittika: "Krittika",
  kritika: "Krittika",
  rohini: "Rohini",
  mrigashira: "Mrigashira",
  ardra: "Ardra",
  punarvasu: "Punarvasu",
  pushya: "Pushya",
  ashlesha: "Ashlesha",
  magha: "Magha",
  hasta: "Hasta",
  chitra: "Chitra",
  swati: "Swati",
  vishakha: "Vishakha",
  anuradha: "Anuradha",
  jyeshtha: "Jyeshtha",
  mula: "Mula",
  moola: "Mula",
  shravana: "Shravana",
  dhanishta: "Dhanishta",
  dhanishtha: "Dhanishta",
  shatabhisha: "Shatabhisha",
  revati: "Revati",
};

const findNakshatraName = (text: string) => {
  const normalized = normalizeQuestion(text);

  for (const [alias, canonical] of Object.entries(NAKSHATRA_ALIASES)) {
    if (normalized.includes(alias)) return canonical;
  }

  return null;
};
  function stopDrag() {
    setDragging(false);
  }

  const getChart = (key: string) => {
    const normalizedKey = key.toLowerCase();

    if (normalizedKey === "d1") {
      return {
        ascSign: natalAscSign,
        planets: normalizeAskSarathiPlanets(natalPlanets),
      };
    }

    const value = vargaMap?.[normalizedKey];

    const rawPlanets =
      (Array.isArray(value?.planets) && value.planets) ||
      (Array.isArray(value?.rows) && value.rows) ||
      (Array.isArray(value?.data?.planets) && value.data.planets) ||
      [];

    return {
      ascSign: value?.ascendant?.sign ?? value?.ascSign ?? value?.lagna?.sign ?? null,
      planets: normalizeAskSarathiPlanets(rawPlanets),
    };
  };

 const formatPlanet = (chartKey: string, p: any) => {
  const parts = [
    p.sign ?? null,
    typeof p.house === "number" ? `H${p.house}` : null,
    typeof p.degree === "number" ? `${p.degree.toFixed(2)}°` : null,
    p.nakshatra
      ? `${p.nakshatra}${p.pada ? ` Pada ${p.pada}` : ""}`
      : null,
  ].filter(Boolean);

  return `${chartKey.toUpperCase()} — ${parts.join(" • ")}`;
};

  const findPlanetName = (text: string) => {
    const lower = text.toLowerCase();
    return planetNames.find((p) => lower.includes(p.toLowerCase())) ?? null;
  };

  const findChartKey = (text: string) => {
    const match = text.toLowerCase().match(/\bd\s*([1-9][0-9]?)\b/);
    return match ? `d${match[1]}` : null;
  };

 const findHouseNumber = (text: string) => {
  const lower = text.toLowerCase();

  const direct =
    lower.match(/\bhouse\s*([1-9]|1[0-2])\b/) ??
    lower.match(/\bh\s*([1-9]|1[0-2])\b/);

  if (direct) {
    return Number(direct[1]);
  }

  const ordinal = lower.match(
    /\b([1-9]|1[0-2])(st|nd|rd|th)\s+house\b/
  );

  if (ordinal) {
    return Number(ordinal[1]);
  }

  return null;
};
const findAllPlanetsInChart = (chartKey: string) => {
  const chart = getChart(chartKey);

  return chart.planets.map((p: any) => {
    const parts = [
      p.sign ?? null,
      typeof p.house === "number" ? `H${p.house}` : null,
      typeof p.degree === "number" ? `${p.degree.toFixed(2)}°` : null,
      p.nakshatra
        ? `${p.nakshatra}${p.pada ? ` Pada ${p.pada}` : ""}`
        : null,
    ].filter(Boolean);

    return `${p.planet} — ${parts.join(" • ")}`;
  });
};
const findAllAscendants = () => {
  const keys = ["d1", ...chartGalleryKeys.filter((k) => k !== "d1")];

  return keys.map((key) => {
    const chart = getChart(key);

    return `${key.toUpperCase()} — ${
      chart.ascSign ?? "Ascendant not found"
    }`;
  });
};
const findPlanetsInNakshatra = (nakshatra: string) => {
  const keys = ["d1", ...chartGalleryKeys.filter((k) => k !== "d1")];

  const rows: string[] = [];

  keys.forEach((key) => {
    const chart = getChart(key);

    chart.planets.forEach((p: any) => {
      if (
        typeof p.nakshatra === "string" &&
        p.nakshatra.toLowerCase() === nakshatra.toLowerCase()
      ) {
        rows.push(
          `${p.planet} — ${key.toUpperCase()} • ${
            p.sign ?? "—"
          } • H${p.house ?? "—"}`
        );
      }
    });
  });

  return rows;
};
const findPlanetsByState = (
  state: "retrograde" | "combust" | "exalted" | "debilitated",
  chartKey = "d1"
) => {
  const chart = getChart(chartKey);

  return chart.planets
    .filter((p: any) => {
      if (state === "retrograde") return Boolean(p.retrograde);
      if (state === "combust") return Boolean(p.combust);
      if (state === "exalted") return Boolean(p.isExalted);
      if (state === "debilitated") return Boolean(p.isDebilitated);
      return false;
    })
    .map((p: any) => `${p.planet} — ${formatPlanet(chartKey, p)}`);
};
const findPlanetsInfluencingHouse = (house: number) => {
  const rows: string[] = [];

  const aspectRows =
    Array.isArray((vargaMap as any)?.vedicAspects)
      ? (vargaMap as any).vedicAspects
      : [];

  const d1 = getChart("d1");

  const occupants = d1.planets.filter((p: any) => p?.house === house);

  occupants.forEach((p: any) => {
    rows.push(`${p.planet} — occupies H${house}`);
  });

  aspectRows.forEach((aspect: any) => {
    const targetHouse =
      aspect?.toHouse ??
      aspect?.targetHouse ??
      aspect?.house ??
      null;

    const planet =
      aspect?.planet ??
      aspect?.fromPlanet ??
      aspect?.sourcePlanet ??
      null;

    if (Number(targetHouse) === house && planet) {
      rows.push(`${planet} — aspects H${house}`);
    }
  });

  return rows;
};
const findAspectsForPlanet = (targetPlanet: string) => {
  const rows: string[] = [];

  const aspectRows =
  Array.isArray(vedicAspects)
    ? vedicAspects
    : Array.isArray(vedicAspects?.allAspects)
      ? vedicAspects.allAspects
      : Array.isArray(vedicAspects?.planetAspects)
        ? vedicAspects.planetAspects
        : Array.isArray(vedicAspects?.aspects)
          ? vedicAspects.aspects
          : [];

  aspectRows.forEach((aspect: any) => {
    const from =
      aspect?.fromPlanet ??
      aspect?.planet ??
      aspect?.sourcePlanet ??
      aspect?.from ??
      null;

    const to =
      aspect?.toPlanet ??
      aspect?.targetPlanet ??
      aspect?.target ??
      aspect?.to ??
      null;

    const label =
      aspect?.aspectLabel ??
      aspect?.type ??
      aspect?.aspect ??
      aspect?.relation ??
      "aspect";

    if (
  from &&
  to &&
  String(to).toLowerCase() === targetPlanet.toLowerCase()
) {
  rows.push(`${from} → ${targetPlanet} • ${label}`);
}

if (
  from &&
  to &&
  String(from).toLowerCase() === targetPlanet.toLowerCase()
) {
  rows.push(`${targetPlanet} → ${to} • ${label}`);
}
  });
console.log("VEDIC ASPECTS DEBUG", vedicAspects);
console.log("ASPECT ROW SAMPLE", aspectRows?.[0]);
  return rows.length ? rows : [`No aspect data found for ${targetPlanet}.`];
};
const findPlanetRelationships = (targetPlanet: string) => {
  const rows: string[] = [];
  const d1 = getChart("d1");
  const target = d1.planets.find((p: any) => p?.planet === targetPlanet);

  if (!target) return [`${targetPlanet} not found in D1.`];

  d1.planets.forEach((p: any) => {
    if (p?.planet === targetPlanet) return;

    if (
      typeof p?.house === "number" &&
      typeof target?.house === "number" &&
      p.house === target.house
    ) {
      rows.push(`${p.planet} — conjunct/same house with ${targetPlanet} in H${target.house}`);
    }
  });

  return rows.length ? rows : [`No same-house conjunction found for ${targetPlanet} in D1.`];
};
const getCurrentDashaPlanets = () => {
  const md = getDashaPlanet(
    getDashaNode(currentDasha, ["md", "mahadasha", "mahaDasha"])
  );
  const ad = getDashaPlanet(
    getDashaNode(currentDasha, ["ad", "antardasha", "antarDasha"])
  );
  const pd = getDashaPlanet(
    getDashaNode(currentDasha, ["pd", "pratyantardasha", "pratyantarDasha"])
  );

  return { md, ad, pd };
};

const getDashaEnd = (node: any) => {
  if (!node || typeof node === "string") return null;

  return (
    node?.endDate ??
    node?.end_date ??
    node?.endISO ??
    node?.endIso ??
    node?.toDate ??
    node?.to_date ??
    node?.toISO ??
    node?.toIso ??
    node?.end ??
    node?.to ??
    node?.finish ??
    node?.finishDate ??
    node?.finishISO ??
    null
  );
};

const getDashaStart = (node: any) => {
  if (!node || typeof node === "string") return null;

  return (
    node?.startDate ??
    node?.start_date ??
    node?.startISO ??
    node?.startIso ??
    node?.fromDate ??
    node?.from_date ??
    node?.fromISO ??
    node?.fromIso ??
    node?.start ??
    node?.from ??
    node?.begin ??
    node?.beginDate ??
    node?.beginISO ??
    null
  );
};

const getCurrentDashaNode = (level: "md" | "ad" | "pd") => {
  if (level === "md") {
    return getDashaNode(currentDasha, ["md", "mahadasha", "mahaDasha"]);
  }

  if (level === "ad") {
    return getDashaNode(currentDasha, ["ad", "antardasha", "antarDasha"]);
  }

  return getDashaNode(currentDasha, [
    "pd",
    "pratyantardasha",
    "pratyantarDasha",
  ]);
};

const findCurrentDashaPlacement = (
  level: "md" | "ad" | "pd",
  chartKey = "d1"
) => {
  const planets = getCurrentDashaPlanets();
  const planet = planets[level];

  if (!planet || planet === "—") return null;

  const chart = getChart(chartKey);
  const placement = chart.planets.find((p: any) => p?.planet === planet);

  return {
    level,
    planet,
    placement,
  };
};
const findCurrentDashaLordAcrossVargas = (
  level: "md" | "ad" | "pd"
) => {
  const planets = getCurrentDashaPlanets();
  const planet = planets[level];

  if (!planet || planet === "—") return [];

  const keys = ["d1", ...chartGalleryKeys.filter((k) => k !== "d1")];

  return keys
    .map((key) => {
      const chart = getChart(key);
      const placement = chart.planets.find((p: any) => p?.planet === planet);

      return placement
        ? `${key.toUpperCase()} — ${formatPlanet(key, placement)}`
        : null;
    })
    .filter(Boolean) as string[];
};
const findHouseLord = (house: number) => {
  if (!houseData) return null;

  const rows = Array.isArray(houseData)
    ? houseData
    : Array.isArray(houseData?.houses)
      ? houseData.houses
      : [];

  const row = rows.find((h: any) => {
    const value =
      h?.house ??
      h?.houseNumber ??
      h?.number ??
      h?.id;

    return Number(value) === house;
  });

  const lord =
    row?.lord ??
    row?.houseLord ??
    row?.ruler ??
    row?.owner ??
    null;

  return lord;
};
const findHouseLordPlacement = (
  house: number,
  chartKey = "d1"
) => {
  const lord = findHouseLord(house);

  if (!lord) return null;

  const chart = getChart(chartKey);

  const placement = chart.planets.find(
    (p: any) => p?.planet === lord
  );

  return {
    lord,
    placement,
  };
};
const findActivatedHouses = () => {
  const facts = Array.isArray(triggerEngine?.facts)
    ? triggerEngine.facts
    : [];

  const houseMap = new Map<number, string[]>();

  facts.forEach((fact: any) => {
    const rawTarget = String(fact?.target ?? "");
    const houseMatch = rawTarget.match(/house\s+(\d+)/i);

    const house =
      typeof fact?.house === "number"
        ? fact.house
        : houseMatch
          ? Number(houseMatch[1])
          : null;

    if (!house) return;

    const reason = [
      fact?.planet ? `${fact.planet}` : null,
      fact?.kind ? `${fact.kind}` : null,
      fact?.source ? `from ${fact.source}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

    if (!houseMap.has(house)) houseMap.set(house, []);
    houseMap.get(house)!.push(reason || "Activated");
  });

  return Array.from(houseMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([house, reasons]) => `H${house} — ${reasons.slice(0, 3).join("; ")}`);
};
const formatDateValue = (value: any) => {
  if (!value) return "—";

  try {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
  } catch {}

  return String(value);
};
const findDashaTimelineRows = (planet: string, level: "md" | "ad" | "pd") => {
  const rows =
    level === "md"
      ? dashaTimelines?.md ?? []
      : level === "ad"
        ? dashaTimelines?.adInCurrentMd ?? []
        : dashaTimelines?.pdInCurrentAd ?? [];

  return (Array.isArray(rows) ? rows : []).filter((row: any) => {
    const rowPlanet =
      row?.planet ??
      row?.lord ??
      row?.name ??
      row?.dashaLord ??
      row?.md ??
      row?.ad ??
      row?.pd ??
      "";

    return String(rowPlanet).toLowerCase() === planet.toLowerCase();
  });
};
const rememberContext = (patch: AskContext) => {
  askContextRef.current = {
    ...askContextRef.current,
    ...patch,
  };

  setAskContext(askContextRef.current);
};
  const answerQuestion = () => {
    const q = question.trim();
    const lower = normalizeQuestion(q);
    
      const explicitPlanet = findPlanetName(q);
const explicitChartKey = findChartKey(q);
const explicitHouseNumber = findHouseNumber(q);

const wantsFollowupReference =
  lower.includes("it") ||
  lower.includes("this") ||
  lower.includes("that") ||
  lower.includes("what about") ||
  Boolean(lower.match(/\bd\s*[1-9]/));

const planet =
  explicitPlanet ??
  (wantsFollowupReference
    ? (
    askContext.lastPlanet ??
    askContextRef.current.lastPlanet ??
    null
  )
    : null);

const chartKey =
  explicitChartKey ??
  (lower.includes("in d") || lower.match(/\bd\s*[1-9]/)
    ? null
    : askContext.lastChartKey ?? null);

const houseNumber =
  explicitHouseNumber ??
  (lower.includes("it") || lower.includes("this") || lower.includes("that")
    ? askContext.lastHouse ?? null
    : null);
    if (!q) return;
setQuestion("");
    const definitionKey = Object.keys(DEFINITIONS).find((key) =>
      lower.includes(`what is ${key}`) || lower.includes(`meaning of ${key}`)
    );

    if (definitionKey) {
      setAnswer({
        title: `Definition: ${definitionKey.toUpperCase()}`,
        rows: [DEFINITIONS[definitionKey]],
      });
      return;
    }
    
const dashaSearchPlanet = findPlanetName(q);
const dashaLevel =
  lower.includes("mahadasha") || lower.includes("md")
    ? "md"
    : lower.includes("antardasha") || lower.includes("ad")
      ? "ad"
      : lower.includes("pratyantardasha") || lower.includes("pd")
        ? "pd"
        : null;
if (
  houseNumber &&
  (
    lower.includes("lord") ||
    lower.includes("owner") ||
    lower.includes("rules")
  )
) {
  const key = chartKey ?? "d1";

  const result = findHouseLordPlacement(houseNumber, key);

  setAnswer({
    title: `${houseNumber}th Lord`,
    summary: result?.lord
      ? `${result.lord} is lord of H${houseNumber}.`
      : undefined,
    rows:
      result?.placement
        ? [formatPlanet(key, result.placement)]
        : [`No lord placement found for H${houseNumber}.`],
  });
rememberContext({
  lastPlanet: result?.lord ?? null,
  lastHouse: houseNumber,
  lastChartKey: key,
  lastTopic: "house_lord",
});
  return;
}
if (
  dashaSearchPlanet &&
  dashaLevel &&
  (lower.includes("when") || lower.includes("was") || lower.includes("is"))
) {
  const rows = findDashaTimelineRows(dashaSearchPlanet, dashaLevel);

  setAnswer({
    title: `${dashaSearchPlanet} ${dashaLevel.toUpperCase()} Timeline`,
    summary: rows.length ? `${rows.length} period(s) found.` : "No matching period found.",
    rows: rows.length
      ? rows.map((row: any) => {
          const start = formatDateValue(getDashaStart(row));
          const end = formatDateValue(getDashaEnd(row));
          return `${dashaSearchPlanet}: ${start} → ${end}`;
        })
      : [`No ${dashaSearchPlanet} ${dashaLevel.toUpperCase()} found in loaded timeline.`],
  });

  return;
}
if (
  lower.includes("current") &&
  (
    lower.includes("end") ||
    lower.includes("till when") ||
    lower.includes("until when")
  )
) {
  const level =
    lower.includes("pratyantardasha") || lower.includes("pd")
      ? "pd"
      : lower.includes("antardasha") || lower.includes("ad")
        ? "ad"
        : "md";

  const node = getCurrentDashaNode(level);
  const planet = getDashaPlanet(node);

  const timelineRow = findDashaTimelineRows(planet, level)?.[0] ?? null;

  const endValue =
    getDashaEnd(node) ??
    getDashaEnd(timelineRow);

  setAnswer({
    title:
      level === "pd"
        ? "Current Pratyantardasha End"
        : level === "ad"
          ? "Current Antardasha End"
          : "Current Mahadasha End",
    summary: `${planet} ${level.toUpperCase()} from loaded timing data.`,
    rows: [
      `Planet: ${planet}`,
      `Ends: ${formatDateValue(endValue)}`,
    ],
  });

  return;
}
if (
  lower.includes("mahadasha lord") ||
  lower.includes("antardasha lord") ||
  lower.includes("pratyantardasha lord")
) {
  const level =
    lower.includes("antardasha")
      ? "ad"
      : lower.includes("pratyantardasha")
        ? "pd"
        : "md";

  const label =
    level === "md"
      ? "Mahadasha Lord"
      : level === "ad"
        ? "Antardasha Lord"
        : "Pratyantardasha Lord";
if (
  lower.includes("activated") &&
  lower.includes("house")
) {
  const rows = findActivatedHouses();

  setAnswer({
    title: "Activated Houses",
    summary: rows.length
      ? `${rows.length} activated house(s) found.`
      : "No activation data found.",
    rows: rows.length ? rows : ["No activated houses found in loaded trigger data."],
  });

  return;
}
  if (lower.includes("all vargas")) {
    const rows = findCurrentDashaLordAcrossVargas(level);

    setAnswer({
      title: `${label} across Vargas`,
      summary: rows.length ? `${rows.length} placement(s) found.` : "No placements found.",
      rows: rows.length ? rows : ["No placement found."],
    });

    return;
  }

  const key = chartKey ?? "d1";
  const result = findCurrentDashaPlacement(level, key);

  setAnswer({
    title: `${label} in ${key.toUpperCase()}`,
    summary: result?.planet ? `Current ${label}: ${result.planet}` : undefined,
    rows: result?.placement
      ? [formatPlanet(key, result.placement)]
      : ["Placement not found."],
  });

  return;
}
    if (lower.includes("dasha")) {
      const md = getDashaPlanet(getDashaNode(currentDasha, ["md", "mahadasha", "mahaDasha"]));
      const ad = getDashaPlanet(getDashaNode(currentDasha, ["ad", "antardasha", "antarDasha"]));
      const pd = getDashaPlanet(getDashaNode(currentDasha, ["pd", "pratyantardasha", "pratyantarDasha"]));

      setAnswer({
        title: "Current Dasha",
        summary: "Running dasha chain from loaded timing data.",
        rows: [
  `Mahadasha: ${md}`,
  `Antardasha: ${ad}`,
  `Pratyantardasha: ${pd}`,
  currentDasha?.md?.endDate
    ? `MD Ends: ${currentDasha.md.endDate}`
    : "",
  currentDasha?.ad?.endDate
    ? `AD Ends: ${currentDasha.ad.endDate}`
    : "",
].filter(Boolean),
      });
      return;
    }

 if (
  houseNumber &&
  !planet &&
  (
    lower.includes("influence") ||
    lower.includes("aspect") ||
    lower.includes("aspects")
  )
) {
  const rows = findPlanetsInfluencingHouse(houseNumber);

  setAnswer({
    title: `Planets influencing H${houseNumber}`,
    summary: rows.length
      ? `${rows.length} influence(s) found.`
      : "No direct influence found from loaded data.",
    rows: rows.length ? rows : [`No planets found influencing H${houseNumber}.`],
  });

  return;
}

    if (planet && lower.includes("all varga")) {
      const keys = ["d1", ...chartGalleryKeys.filter((k) => k !== "d1")];

      const rows = keys
        .map((key) => {
          const chart = getChart(key);
          const p = chart.planets.find((x: any) => x?.planet === planet);
          return p ? formatPlanet(key, p) : null;
        })
        .filter(Boolean) as string[];

      setAnswer({
        title: `${planet} across Vargas`,
        summary: `Found ${planet} in ${rows.length} chart(s).`,
        rows: rows.length ? rows : [`No ${planet} placement found.`],
      });
      return;
    }

 if (
  planet &&
  chartKey &&
  !isAspectQuery(lower) &&
  !isRelationshipQuery(lower) &&
  !lower.includes("retrograde") &&
  !lower.includes("combust") &&
  !lower.includes("exalted") &&
  !lower.includes("debilitated")
) {
  const chart = getChart(chartKey);
  const p = chart.planets.find((x: any) => x?.planet === planet);

  setAnswer({
    title: `${planet} in ${chartKey.toUpperCase()}`,
    rows: p
      ? [formatPlanet(chartKey, p)]
      : [`${planet} not found in ${chartKey.toUpperCase()}.`],
  });

  rememberContext({
    lastPlanet: planet,
    lastChartKey: chartKey,
    lastTopic: "placement",
  });

  return;
}

    if (houseNumber) {
      const key = chartKey ?? "d1";
      const chart = getChart(key);
      const rows = chart.planets
        .filter((p: any) => p?.house === houseNumber)
        .map((p: any) => `${p.planet} — ${p.sign ?? "—"} • ${typeof p.degree === "number" ? `${p.degree.toFixed(2)}°` : "—"} • ${p.nakshatra ?? "—"}`);

      setAnswer({
        title: `Planets in H${houseNumber} ${key.toUpperCase()}`,
        summary: rows.length ? `${rows.length} planet(s) found.` : "No planets found in this house.",
        rows: rows.length ? rows : [`No planets found in H${houseNumber}.`],
      });
      rememberContext({
  lastHouse: houseNumber,
  lastChartKey: key,
  lastTopic: "house",
});
      return;
    }
if (lower.includes("lagna lord")) {
  const lord = getLagnaLord(natalAscSign);

  if (!lord) {
    setAnswer({
      title: "Lagna Lord",
      rows: ["Unable to determine Lagna lord."],
    });
    return;
  }

  const chartKey = findChartKey(q) ?? "d1";
  const chart = getChart(chartKey);

  const placement = chart.planets.find(
    (p: any) => p?.planet === lord
  );

  setAnswer({
    title: `Lagna Lord — ${lord}`,
    summary: `${lord} is the ruler of ${natalAscSign} Lagna.`,
    rows: placement
      ? [formatPlanet(chartKey, placement)]
      : [`No placement found in ${chartKey.toUpperCase()}.`],
  });

  return;
}
if (
  lower.includes("moon nakshatra") ||
  lower.includes("nakshatra of moon")
) {
  const chart = getChart("d1");

  const moon = chart.planets.find(
    (p: any) => p?.planet === "Moon"
  );

  setAnswer({
    title: "Moon Nakshatra",
    rows: moon
      ? [
          `${moon.nakshatra ?? "—"}${
            moon.pada ? ` • Pada ${moon.pada}` : ""
          }`,
        ]
      : ["Moon data not found."],
  });

  return;
}
const nakName = findNakshatraName(q);

if (
  nakName &&
  (
    lower.includes("which planets") ||
    lower.includes("show planets") ||
    lower.includes("planets in")
  )
) {
  const rows = findPlanetsInNakshatra(nakName);

  setAnswer({
    title: `Planets in ${nakName}`,
    summary: rows.length
      ? `${rows.length} placement(s) found.`
      : "No placements found.",
    rows: rows.length ? rows : [`No planets found in ${nakName}.`],
  });

  return;
}
if (
  lower.includes("all planets") ||
  lower.includes("show planets")
) {
  const key = chartKey ?? "d1";

  const rows = findAllPlanetsInChart(key);

  setAnswer({
    title: `All planets in ${key.toUpperCase()}`,
    summary: `${rows.length} planet(s) found.`,
    rows,
  });

  return;
}
if (
  lower.includes("all varga ascendants") ||
  lower.includes("show varga ascendants")
) {
  const rows = findAllAscendants();

  setAnswer({
    title: "Varga Ascendants",
    summary: `${rows.length} chart ascendants found.`,
    rows,
  });

  return;
}

if (
  lower.includes("ascendant") &&
  chartKey
) {
  const chart = getChart(chartKey);

  setAnswer({
    title: `${chartKey.toUpperCase()} Ascendant`,
    rows: [chart.ascSign ?? "Ascendant not found."],
  });

  return;
}
const houseLordMatch = lower.match(/\b([1-9]|1[0-2])(st|nd|rd|th)?\s+lord\b/);

if (houseLordMatch) {
  const targetHouse = Number(houseLordMatch[1]);
  const lordInfo = getHouseLord(natalAscSign, targetHouse);
  const key = chartKey ?? "d1";

  if (!lordInfo?.lord) {
    setAnswer({
      title: `${targetHouse}th Lord`,
      rows: ["Unable to determine house lord."],
    });
    return;
  }

  const chart = getChart(key);
  const placement = chart.planets.find(
    (p: any) => p?.planet === lordInfo.lord
  );

  setAnswer({
    title: `H${targetHouse} Lord — ${lordInfo.lord}`,
    summary: `H${targetHouse} falls in ${lordInfo.sign}. Its lord is ${lordInfo.lord}.`,
    rows: placement
      ? [formatPlanet(key, placement)]
      : [`No ${lordInfo.lord} placement found in ${key.toUpperCase()}.`],
  });

  return;
}
const stateType =
  lower.includes("retrograde")
    ? "retrograde"
    : lower.includes("combust")
      ? "combust"
      : lower.includes("exalted")
        ? "exalted"
        : lower.includes("debilitated")
          ? "debilitated"
          : null;

if (stateType) {
  const key = chartKey ?? "d1";

  if (planet) {
    const chart = getChart(key);
    const row = chart.planets.find((p: any) => p?.planet === planet);

    const value =
      stateType === "retrograde"
        ? Boolean(row?.retrograde)
        : stateType === "combust"
          ? Boolean(row?.combust)
          : stateType === "exalted"
            ? Boolean(row?.isExalted)
            : Boolean(row?.isDebilitated);

    setAnswer({
      title: `${planet} ${stateType}`,
      summary: `${key.toUpperCase()} check.`,
      rows: row
        ? [`${planet} is ${value ? "" : "not "}${stateType} in ${key.toUpperCase()}.`]
        : [`${planet} not found in ${key.toUpperCase()}.`],
    });

    return;
  }

  const rows = findPlanetsByState(stateType, key);

  setAnswer({
    title: `${stateType[0].toUpperCase() + stateType.slice(1)} planets in ${key.toUpperCase()}`,
    summary: rows.length ? `${rows.length} planet(s) found.` : "No planets found.",
    rows: rows.length ? rows : [`No ${stateType} planets found in ${key.toUpperCase()}.`],
  });

  return;
}
if (isAspectQuery(lower)) {
  const targetPlanet = planet ?? askContext.lastPlanet ?? null;

  if (!targetPlanet) {
    setAnswer({
      title: "Aspect Query",
      rows: ["Please mention a planet first, e.g. “Who aspects Venus?”"],
    });
    return;
  }

  const rows = findAspectsForPlanet(targetPlanet);

  setAnswer({
    title: `${targetPlanet} Aspects`,
    summary: "Based on loaded Vedic aspect data.",
    rows,
  });

  rememberContext({
    lastPlanet: targetPlanet,
    lastTopic: "relationship",
  });

  return;
}
if (planet && isRelationshipQuery(lower)) {
  const rows = findPlanetRelationships(planet);

  setAnswer({
    title: `${planet} Relationships`,
    summary: "Based on same-house placement in D1 for now.",
    rows,
  });
rememberContext({
  lastPlanet: planet,
  lastTopic: "relationship",
});
  return;
}
if (planet && isPlacementQuery(lower)) {
  const key = chartKey ?? "d1";
  const chart = getChart(key);
  const p = chart.planets.find((x: any) => x?.planet === planet);

  setAnswer({
    title: `${planet} placement in ${key.toUpperCase()}`,
    rows: p
      ? [formatPlanet(key, p)]
      : [`${planet} not found in ${key.toUpperCase()}.`],
  });
rememberContext({
  lastPlanet: planet,
  lastChartKey: key,
  lastTopic: "placement",
});
  return;
}
if (lower.includes("activated") && lower.includes("house")) {
  const rows = findActivatedHouses();

  setAnswer({
    title: "Activated Houses",
    summary: rows.length
      ? `${rows.length} activated house(s) found.`
      : "No activation data found.",
    rows: rows.length
      ? rows
      : ["No activated houses found in loaded trigger data."],
  });

  return;
}
if (
  lower.includes("activation") ||
  lower.includes("activated")
) {
  const rows = findActivatedHouses();

  setAnswer({
    title: "Activated Houses",
    summary: rows.length
      ? `${rows.length} activated house(s) found.`
      : "No activation data found.",
    rows: rows.length
      ? rows
      : ["No activated houses found in loaded trigger data."],
  });

  return;
}

    setAnswer({
      title: "I can answer factual chart-data questions for now",
      rows: [
        "Try: What dasha is running?",
        "Try: Where is Mars in D10?",
        "Try: Show Mars in all vargas.",
        "Try: Which planets are in house 7?",
        "Try: What is D10?",
      ],
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
      >
        Ask Sārathi
      </button>

      {isOpen ? (
        <div
          onMouseMove={onDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          className="fixed z-[120] w-[420px] rounded-3xl border border-indigo-100 bg-white p-5 shadow-2xl"
          style={{
  left: position.x,
  top: position.y,
  maxWidth: "calc(100vw - 32px)",
}}
        >
          <div onMouseDown={startDrag} className="flex cursor-move items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-950">Ask Sārathi</h3>
              <p className="mt-1 text-xs text-slate-500">
                Factual answers from this chart only. No interpretation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-200"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") answerQuestion();
              }}
              placeholder="Ask: Where is Mars in all vargas?"
              className="min-h-11 flex-1 rounded-xl border border-indigo-100 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
            />

            <button
              type="button"
              onClick={answerQuestion}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Ask
            </button>
          </div>

          <div className="mt-4 h-[220px] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            <div className="font-semibold text-slate-900">{answer.title}</div>
            {answer.summary ? (
              <div className="mt-1 text-xs text-slate-500">{answer.summary}</div>
            ) : null}

            <div className="mt-3 space-y-1">
              {answer.rows.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
            
          </div>

          <div className="mt-3 text-[11px] text-slate-400">
            Examples: What dasha is running? • Where is Mars in D10? • Which planets are in house 7?
          </div>
        </div>
      ) : null}
    </div>
  );
}