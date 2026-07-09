const SIGN_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const NAKSHATRA_SEQUENCE = [
  ["Ashwini", "Ketu"], ["Bharani", "Venus"], ["Krittika", "Sun"],
  ["Rohini", "Moon"], ["Mrigashira", "Mars"], ["Ardra", "Rahu"],
  ["Punarvasu", "Jupiter"], ["Pushya", "Saturn"], ["Ashlesha", "Mercury"],
  ["Magha", "Ketu"], ["Purva Phalguni", "Venus"], ["Uttara Phalguni", "Sun"],
  ["Hasta", "Moon"], ["Chitra", "Mars"], ["Swati", "Rahu"],
  ["Vishakha", "Jupiter"], ["Anuradha", "Saturn"], ["Jyeshtha", "Mercury"],
  ["Mula", "Ketu"], ["Purva Ashadha", "Venus"], ["Uttara Ashadha", "Sun"],
  ["Shravana", "Moon"], ["Dhanishta", "Mars"], ["Shatabhisha", "Rahu"],
  ["Purva Bhadrapada", "Jupiter"], ["Uttara Bhadrapada", "Saturn"], ["Revati", "Mercury"],
] as const;

const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const PLANET_ORDER = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
];

const NAK_DEG = 13 + 20 / 60;

function norm360(value: number) {
  return ((value % 360) + 360) % 360;
}

function getSign(lon: number) {
  return SIGN_ORDER[Math.floor(norm360(lon) / 30)];
}

function getDegreeInSign(lon: number) {
  return norm360(lon) % 30;
}

function getNakshatraData(lon: number) {
  const normalized = norm360(lon);
  const nakIndex = Math.floor(normalized / NAK_DEG);
  const nak = NAKSHATRA_SEQUENCE[nakIndex];
  const offsetInNak = normalized - nakIndex * NAK_DEG;
  const pada = Math.floor(offsetInNak / (NAK_DEG / 4)) + 1;

  return {
    nakshatra: nak?.[0] ?? null,
    nakshatraLord: nak?.[1] ?? null,
    pada,
    offsetInNak,
  };
}

function getSubLord(lon: number) {
  const { nakshatraLord, offsetInNak } = getNakshatraData(lon);

  if (!nakshatraLord) return null;

  const startIndex = PLANET_ORDER.indexOf(nakshatraLord);
  let covered = 0;

  for (let i = 0; i < PLANET_ORDER.length; i++) {
    const lord = PLANET_ORDER[(startIndex + i) % PLANET_ORDER.length];
    const span = ((DASHA_YEARS[lord] ?? 0) / 120) * NAK_DEG;

    if (offsetInNak >= covered && offsetInNak < covered + span) {
      return lord;
    }

    covered += span;
  }

  return PLANET_ORDER[(startIndex + 8) % PLANET_ORDER.length];
}

function getSubSubLord(lon: number) {
  const { nakshatraLord, offsetInNak } = getNakshatraData(lon);

  if (!nakshatraLord) return null;

  const startIndex = PLANET_ORDER.indexOf(nakshatraLord);
  let covered = 0;

  for (let i = 0; i < PLANET_ORDER.length; i++) {
    const subLord = PLANET_ORDER[(startIndex + i) % PLANET_ORDER.length];
    const subSpan = (DASHA_YEARS[subLord] / 120) * NAK_DEG;

    if (offsetInNak >= covered && offsetInNak < covered + subSpan) {
      const offsetInSub = offsetInNak - covered;
      let subCovered = 0;
      const subStartIndex = PLANET_ORDER.indexOf(subLord);

      for (let j = 0; j < PLANET_ORDER.length; j++) {
        const ssLord = PLANET_ORDER[(subStartIndex + j) % PLANET_ORDER.length];
        const ssSpan = ((DASHA_YEARS[ssLord] ?? 0) / 120) * subSpan;

        if (offsetInSub >= subCovered && offsetInSub < subCovered + ssSpan) {
          return ssLord;
        }

        subCovered += ssSpan;
      }

      return PLANET_ORDER[(subStartIndex + 8) % PLANET_ORDER.length];
    }

    covered += subSpan;
  }

  return null;
}

function getLon(row: any) {
  if (typeof row?.lon === "number") return row.lon;
  if (typeof row?.longitude === "number") return row.longitude;
  if (typeof row?.absoluteLongitude === "number") return row.absoluteLongitude;
  return null;
}
function getHouseFromCusps(planetLon: number, cusps: number[]) {
  if (!Array.isArray(cusps) || cusps.length < 12) return null;

  const lon = norm360(planetLon);

  for (let i = 0; i < 12; i++) {
    const start = norm360(cusps[i]);
    const end = norm360(cusps[(i + 1) % 12]);

    const isBetween =
      start <= end
        ? lon >= start && lon < end
        : lon >= start || lon < end;

    if (isBetween) return i + 1;
  }

  return null;
}
export function buildKPData({
  planets,
  houseCusps,
}: {
  planets: any[];
  houseCusps: number[];
}) {
  const kpPlanets = (Array.isArray(planets) ? planets : [])
    .map((p) => {
      const lon = getLon(p);
      if (typeof lon !== "number") return null;

      const nak = getNakshatraData(lon);

      return {
        planet: p.planet ?? p.name ?? p.id,
        longitude: norm360(lon),
        sign: getSign(lon),
        degree: getDegreeInSign(lon),
        house: getHouseFromCusps(lon, houseCusps),
        nakshatra: nak.nakshatra,
        pada: nak.pada,
        nakshatraLord: nak.nakshatraLord,
        subLord: getSubLord(lon),
        subSubLord: getSubSubLord(lon),
        retrograde: Boolean(p.retrograde ?? p.isRetrograde),
      };
    })
    .filter(Boolean);

  const cusps = (Array.isArray(houseCusps) ? houseCusps : [])
    .slice(0, 12)
    .map((lon, index) => {
      const nak = getNakshatraData(lon);

      return {
        cusp: index + 1,
        longitude: norm360(lon),
        sign: getSign(lon),
        degree: getDegreeInSign(lon),
        nakshatra: nak.nakshatra,
        pada: nak.pada,
        nakshatraLord: nak.nakshatraLord,
        subLord: getSubLord(lon),
        subSubLord: getSubSubLord(lon),
      };
    });

  return {
    planets: kpPlanets,
    cusps,
  };
}