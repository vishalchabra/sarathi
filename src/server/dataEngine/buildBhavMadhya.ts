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
  const normalized = normalize360(lon);
  return normalized % 30;
}

function formatLonParts(lon: number) {
  return {
    lon: Number(normalize360(lon).toFixed(2)),
    sign: getSignFromLon(lon),
    degree: Number(getDegreeInSign(lon).toFixed(2)),
  };
}

export function buildBhavMadhya({
  cusps,
}: {
  cusps: number[];
}): BhavMadhyaRow[] {
  const normalizedCusps = Array.isArray(cusps) ? cusps : [];

  return normalizedCusps.map((cuspLon, index) => {
    const house = index + 1;

    const prevIndex = (index - 1 + normalizedCusps.length) % normalizedCusps.length;
    const nextIndex = (index + 1) % normalizedCusps.length;

    const prevCusp = normalizedCusps[prevIndex];
    const nextCusp = normalizedCusps[nextIndex];

    const startLon =
      typeof prevCusp === "number"
        ? normalize360((prevCusp + cuspLon) / 2)
        : null;

    const endLon =
      typeof nextCusp === "number"
        ? normalize360((cuspLon + nextCusp) / 2)
        : null;

    return {
      house,
      cusp: typeof cuspLon === "number" ? formatLonParts(cuspLon) : null,
      start: typeof startLon === "number" ? formatLonParts(startLon) : null,
      end: typeof endLon === "number" ? formatLonParts(endLon) : null,
    };
  });
}