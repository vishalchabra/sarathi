type BhavMadhyaRow = {
  house: number;
  cusp: {
    lon: number;
    sign: string;
    degree: number;
  } | null;
  start: {
    lon: number;
    sign: string;
    degree: number;
  } | null;
  end: {
    lon: number;
    sign: string;
    degree: number;
  } | null;
};

const SIGNS = [
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

function normalize360(value: number) {
  return ((value % 360) + 360) % 360;
}

function getSignFromLon(lon: number) {
  const normalized = normalize360(lon);
  const index = Math.floor(normalized / 30);
  return SIGNS[index] ?? "—";
}

function getDegreeInSign(lon: number) {
  return normalize360(lon) % 30;
}

function formatLonParts(lon: number) {
  return {
    lon: Number(normalize360(lon).toFixed(2)),
    sign: getSignFromLon(lon),
    degree: Number(getDegreeInSign(lon).toFixed(2)),
  };
}

function midpointForward(fromLon: number, toLon: number) {
  const from = normalize360(fromLon);
  const to = normalize360(toLon);

  const distance = normalize360(to - from);
  return normalize360(from + distance / 2);
}

export function buildBhavMadhya({
  cusps,
}: {
  cusps: number[];
}): BhavMadhyaRow[] {
  const normalizedCusps = Array.isArray(cusps)
    ? cusps.filter((c) => typeof c === "number" && Number.isFinite(c))
    : [];

  if (normalizedCusps.length !== 12) {
    return [];
  }

  return normalizedCusps.map((cuspLon, index) => {
    const house = index + 1;

    const prevIndex = (index - 1 + 12) % 12;
    const nextIndex = (index + 1) % 12;

    const prevCusp = normalizedCusps[prevIndex];
    const nextCusp = normalizedCusps[nextIndex];

    const startLon = midpointForward(prevCusp, cuspLon);
    const endLon = midpointForward(cuspLon, nextCusp);

    return {
      house,
      cusp: formatLonParts(cuspLon),
      start: formatLonParts(startLon),
      end: formatLonParts(endLon),
    };
  });
}