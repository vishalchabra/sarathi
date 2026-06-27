import "server-only";

import { computeTransitPlanetsNow } from "@/server/astro/transits";

function addDays(date: Date, d: number) {
  const x = new Date(date);
  x.setDate(x.getDate() + d);
  return x;
}

function angleDiff(a: number, b: number) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function signFromLon(lon: number) {
  const signs = [
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
  const idx = Math.floor((((lon % 360) + 360) % 360) / 30);
  return signs[idx] ?? "—";
}
function getNakshatraFromLon(lon: number) {
  const nakshatras = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Swati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
  ];

  const normalized = ((lon % 360) + 360) % 360;
  const index = Math.floor(normalized / (360 / 27));
  return nakshatras[index] ?? null;
}
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
function makeDateISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function makeContactKey(dateISO: string, transitPlanet: string, natalPlanet: string, type: string) {
  return `${dateISO}|${transitPlanet}|${natalPlanet}|${type}`;
}
function makeWindowKey(transitPlanet: string, natalPlanet: string) {
  return `${transitPlanet}|${natalPlanet}`;
}
function compressContactWindows(rows: any[]) {
  const contactRows = (Array.isArray(rows) ? rows : [])
    .filter((r) => r?.type === "natal_contact")
    .sort((a, b) => {
      if (a.transitPlanet !== b.transitPlanet) {
        return String(a.transitPlanet).localeCompare(String(b.transitPlanet));
      }
      if (a.natalPlanet !== b.natalPlanet) {
        return String(a.natalPlanet).localeCompare(String(b.natalPlanet));
      }
      return String(a.dateISO).localeCompare(String(b.dateISO));
    });

  const windows: any[] = [];
  let current: any = null;
  let currentKey = "";

  for (const row of contactRows) {
    const key = makeWindowKey(String(row.transitPlanet), String(row.natalPlanet));

    if (!current || key !== currentKey) {
      if (current) windows.push(current);

      current = {
        type: "natal_contact_window",
        transitPlanet: row.transitPlanet,
        natalPlanet: row.natalPlanet,
        startISO: row.dateISO,
        peakISO: row.dateISO,
        endISO: row.dateISO,
        minOrb: typeof row.orb === "number" ? row.orb : null,
        hitCount: 1,
      };
      currentKey = key;
      continue;
    }

    const prevDate = new Date(current.endISO);
    const thisDate = new Date(row.dateISO);
    const gapDays = Math.round(
      (thisDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (gapDays <= 1) {
      current.endISO = row.dateISO;
      current.hitCount += 1;

      if (
        typeof row.orb === "number" &&
        (current.minOrb === null || row.orb < current.minOrb)
      ) {
        current.minOrb = row.orb;
        current.peakISO = row.dateISO;
      }
    } else {
      windows.push(current);

      current = {
        type: "natal_contact_window",
        transitPlanet: row.transitPlanet,
        natalPlanet: row.natalPlanet,
        startISO: row.dateISO,
        peakISO: row.dateISO,
        endISO: row.dateISO,
        minOrb: typeof row.orb === "number" ? row.orb : null,
        hitCount: 1,
      };
      currentKey = key;
    }
  }

  if (current) windows.push(current);

  return windows;
}
const MAJOR_PLANETS = new Set([
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Rahu",
  "Ketu",
]);

export async function buildUpcomingTransits(params: {
  birth: any;
  natalPlanets: any[];
  natalAscendant?: {
    sign?: string;
    lon?: number | null;
  } | null;
  days?: number;
}) {
  const days = params.days ?? 180;
  const moonDays = 15;

  const moonTransits: any[] = [];
  const planetaryTransits: any[] = [];
  const allEvents: any[] = [];

  const engineBirth = {
    dateISO: params.birth.dateISO,
    time: params.birth.time,
    tz: params.birth.timezone,
    lat: params.birth.lat,
    lon: params.birth.lon,
  };

  const ascSign = String(params.natalAscendant?.sign ?? "").trim();

  if (!ascSign) {
  return {
    moonTransits: [],
    planetaryTransits: [],
    allEvents: [],
  };
}
  const ascSignNum = SIGN_TO_NUM[ascSign] ?? 0;

  const natalMoon = Array.isArray(params.natalPlanets)
    ? params.natalPlanets.find((p: any) => String(p?.planet ?? "") === "Moon")
    : null;

  const natalMoonSign =
    String(natalMoon?.sign ?? "").trim() ||
    (typeof natalMoon?.lon === "number" ? signFromLon(natalMoon.lon) : "");

  const natalMoonSignNum = SIGN_TO_NUM[natalMoonSign] ?? 0;
  let prevTransitMap = new Map<string, any>();
  const seenPlanetaryContacts = new Set<string>();

  for (let i = 1; i <= days; i++) {
    const date = addDays(new Date(), i);
    const dateISO = makeDateISO(date);
    const isMoonWindow = i <= moonDays;
    const transits = await computeTransitPlanetsNow(engineBirth, ascSign, {
      dateISO,
      time: "12:00",
      tz: params.birth.timezone,
    });

    const currentTransitMap = new Map<string, any>();
    for (const t of transits) {
      currentTransitMap.set(String(t?.name ?? ""), t);
    }

    // -----------------------------------
    // 1. Moon transits: keep daily detail
    // -----------------------------------
    const moon = currentTransitMap.get("Moon");

if (isMoonWindow && moon && typeof moon.lon === "number") {
  const lon = Number(moon.lon);
  const sign = moon.sign ?? signFromLon(lon);
  const signNum = SIGN_TO_NUM[sign] ?? 0;

  moonTransits.push({
    dateISO,
    planet: "Moon",
    sign,
    nakshatra: moon.nakshatra ?? getNakshatraFromLon(lon),
    degree: Number((lon % 30).toFixed(2)),
    houseFromLagna:
      signNum && ascSignNum ? houseFromRef(ascSignNum, signNum) : null,
    houseFromMoon:
      signNum && natalMoonSignNum ? houseFromRef(natalMoonSignNum, signNum) : null,
    type: "moon_daily",
  });
}
    // ------------------------------------------------
    // 2. Major planetary transits: event-style tracking
    // ------------------------------------------------
    for (const t of transits) {
  const transit = t as any;
  const transitPlanet = String(transit?.name ?? "");
  if (!MAJOR_PLANETS.has(transitPlanet) || transitPlanet === "Moon") continue;
  if (typeof transit?.lon !== "number") continue;

  const prev = prevTransitMap.get(transitPlanet) as any;

  const currentSign = String(transit?.sign ?? signFromLon(transit.lon));
  const prevSign =
    prev && typeof prev?.lon === "number"
      ? String(prev?.sign ?? signFromLon(prev.lon))
      : null;

  const currentNakshatra = String(transit?.nakshatra ?? "").trim() || null;
  const prevNakshatra =
    prev && String(prev?.nakshatra ?? "").trim()
      ? String(prev?.nakshatra).trim()
      : null;

      // sign ingress
      if (prev && prevSign && currentSign && prevSign !== currentSign) {
       const signNum = SIGN_TO_NUM[currentSign] ?? 0;

const event = {
  dateISO,
  transitPlanet,
  type: "sign_ingress",

  fromSign: prevSign,
  toSign: currentSign,

  sign: currentSign,
  nakshatra: currentNakshatra,
  pada: transit?.pada ?? null,
  retrograde: transit?.retrograde ?? false,
  lon: transit?.lon ?? null,

  houseFromLagna:
    signNum && ascSignNum ? houseFromRef(ascSignNum, signNum) : null,
};
        planetaryTransits.push(event);
        allEvents.push(event);
      }

      // nakshatra ingress
if (prev && prevNakshatra && currentNakshatra && prevNakshatra !== currentNakshatra) {
  const signNum = SIGN_TO_NUM[currentSign] ?? 0;

  const event = {
    dateISO,
    transitPlanet,
    type: "nakshatra_ingress",

    fromNakshatra: prevNakshatra,
    toNakshatra: currentNakshatra,

    sign: currentSign,
    nakshatra: currentNakshatra,
    pada: transit?.pada ?? null,
    retrograde: transit?.retrograde ?? false,
    lon: transit?.lon ?? null,

    houseFromLagna:
      signNum && ascSignNum ? houseFromRef(ascSignNum, signNum) : null,
  };

  planetaryTransits.push(event);
  allEvents.push(event);
}

// retrograde / direct change
if (
  prev &&
  typeof prev?.retrograde === "boolean" &&
  typeof transit?.retrograde === "boolean" &&
  prev.retrograde !== transit.retrograde
) {
  const signNum = SIGN_TO_NUM[currentSign] ?? 0;

  const event = {
    dateISO,
    transitPlanet,
    type: transit.retrograde ? "retrograde_start" : "retrograde_end",

    sign: currentSign,
    nakshatra: currentNakshatra,
    pada: transit?.pada ?? null,
    retrograde: transit?.retrograde ?? false,
    lon: transit?.lon ?? null,

    houseFromLagna:
      signNum && ascSignNum ? houseFromRef(ascSignNum, signNum) : null,
  };

  planetaryTransits.push(event);
  allEvents.push(event);
}

      // natal contacts for non-moon planets
      for (const n of params.natalPlanets) {
        if (typeof n?.lon !== "number") continue;

        const diff = angleDiff(transit.lon, n.lon);

        // slightly wider orb for slower planets so they actually show up
        if (diff <= 5) {
          const key = makeContactKey(dateISO, transitPlanet, String(n.planet), "natal_contact");
          if (seenPlanetaryContacts.has(key)) continue;
          seenPlanetaryContacts.add(key);

          const event = {
            dateISO,
            transitPlanet,
            natalPlanet: n.planet,
            type: "natal_contact",
            orb: Number(diff.toFixed(2)),
            sign: currentSign,
            nakshatra: currentNakshatra,
          };

          planetaryTransits.push(event);
          allEvents.push(event);
        }
      }
    }

    prevTransitMap = currentTransitMap;
  }

 // ------------------------------
// Build next movement per planet
// ------------------------------

const nextEventsMap = new Map<string, any>();

for (const row of planetaryTransits) {
  const planet = String(row.transitPlanet ?? "");
  if (!planet) continue;

  const existing = nextEventsMap.get(planet);

  const rowDate = String(row.dateISO ?? "");
  const existingDate = existing ? String(existing.dateISO ?? "") : "";

  // priority: sign > retro > nakshatra
  const priority = (type: string) => {
    if (type === "sign_ingress") return 3;
    if (type === "retrograde_start" || type === "retrograde_end") return 2;
    if (type === "nakshatra_ingress") return 1;
    return 0;
  };

  if (!existing) {
    nextEventsMap.set(planet, row);
    continue;
  }

  const better =
    rowDate < existingDate ||
    (rowDate === existingDate &&
      priority(String(row.type ?? "")) > priority(String(existing.type ?? "")));

  if (better) {
    nextEventsMap.set(planet, row);
  }
}

// convert to array
const nextPlanetaryTransits = Array.from(nextEventsMap.values()).sort((a, b) =>
  String(a.dateISO ?? "").localeCompare(String(b.dateISO ?? ""))
);

return {
  moonTransits,
  planetaryTransits: nextPlanetaryTransits,
  allEvents,
};
}