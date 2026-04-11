import "server-only";

type NatalPlanet = {
  planet: string;
  sign: string;
  degree?: number | null;
  lon?: number | null;
  retrograde?: boolean;
  combust?: boolean;
};

type PlanetStrengthRow = {
  planet: string;
  sign: string;
  dignity: string;
  relationshipToSignLord: "friend" | "enemy" | "neutral" | "self" | "n/a";
  signLord: string | null;
  isOwnSign: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  isMoolatrikona: boolean;
  retrograde: boolean;
  combust: boolean;
  combustDistanceDeg: number | null;
  isCombustSevere: boolean;
  strengthBand: "very_strong" | "strong" | "mixed" | "weak";
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

const OWN_SIGNS: Record<string, string[]> = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mars: ["Aries", "Scorpio"],
  Mercury: ["Gemini", "Virgo"],
  Jupiter: ["Sagittarius", "Pisces"],
  Venus: ["Taurus", "Libra"],
  Saturn: ["Capricorn", "Aquarius"],
  Rahu: [],
  Ketu: [],
};

const EXALTATION_SIGNS: Record<string, string | null> = {
  Sun: "Aries",
  Moon: "Taurus",
  Mars: "Capricorn",
  Mercury: "Virgo",
  Jupiter: "Cancer",
  Venus: "Pisces",
  Saturn: "Libra",
  Rahu: null,
  Ketu: null,
};

const DEBILITATION_SIGNS: Record<string, string | null> = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mars: "Cancer",
  Mercury: "Pisces",
  Jupiter: "Capricorn",
  Venus: "Virgo",
  Saturn: "Aries",
  Rahu: null,
  Ketu: null,
};

const MOOLATRIKONA_SIGNS: Record<string, string | null> = {
  Sun: "Leo",
  Moon: "Taurus",
  Mars: "Aries",
  Mercury: "Virgo",
  Jupiter: "Sagittarius",
  Venus: "Libra",
  Saturn: "Aquarius",
  Rahu: null,
  Ketu: null,
};

// Natural relationships (simplified Vedic baseline)
const NATURAL_RELATIONSHIPS: Record<
  string,
  {
    friends: string[];
    enemies: string[];
  }
> = {
  Sun: {
    friends: ["Moon", "Mars", "Jupiter"],
    enemies: ["Venus", "Saturn"],
  },
  Moon: {
    friends: ["Sun", "Mercury"],
    enemies: [],
  },
  Mars: {
    friends: ["Sun", "Moon", "Jupiter"],
    enemies: ["Mercury"],
  },
  Mercury: {
    friends: ["Sun", "Venus"],
    enemies: ["Moon"],
  },
  Jupiter: {
    friends: ["Sun", "Moon", "Mars"],
    enemies: ["Mercury", "Venus"],
  },
  Venus: {
    friends: ["Mercury", "Saturn"],
    enemies: ["Sun", "Moon"],
  },
  Saturn: {
    friends: ["Mercury", "Venus"],
    enemies: ["Sun", "Moon", "Mars"],
  },
  Rahu: {
    friends: [],
    enemies: [],
  },
  Ketu: {
    friends: [],
    enemies: [],
  },
};

function wrap360(x: number) {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
}

function angleDiff(a: number, b: number) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function getRelationshipToSignLord(
  planet: string,
  signLord: string | null
): "friend" | "enemy" | "neutral" | "self" | "n/a" {
  if (!signLord) return "n/a";
  if (planet === signLord) return "self";

  const rel = NATURAL_RELATIONSHIPS[planet];
  if (!rel) return "n/a";
  if (rel.friends.includes(signLord)) return "friend";
  if (rel.enemies.includes(signLord)) return "enemy";
  return "neutral";
}

function getCombustDistanceDeg(
  planet: string,
  lon: number | null,
  sunLon: number | null
): number | null {
  if (planet === "Sun" || planet === "Rahu" || planet === "Ketu") return null;
  if (typeof lon !== "number" || typeof sunLon !== "number") return null;
  return Number(angleDiff(wrap360(lon), wrap360(sunLon)).toFixed(2));
}

function getIsCombustSevere(
  planet: string,
  combustDistanceDeg: number | null
): boolean {
  if (typeof combustDistanceDeg !== "number") return false;

  // simple severity thresholds
  if (planet === "Mercury") return combustDistanceDeg <= 4;
  if (planet === "Venus") return combustDistanceDeg <= 4;
  if (planet === "Mars") return combustDistanceDeg <= 5;
  if (planet === "Jupiter") return combustDistanceDeg <= 5;
  if (planet === "Saturn") return combustDistanceDeg <= 5;
  if (planet === "Moon") return combustDistanceDeg <= 6;
  return combustDistanceDeg <= 5;
}

function getDignity(params: {
  isOwnSign: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  isMoolatrikona: boolean;
  relationshipToSignLord: "friend" | "enemy" | "neutral" | "self" | "n/a";
}) {
  const {
    isExalted,
    isDebilitated,
    isMoolatrikona,
    isOwnSign,
    relationshipToSignLord,
  } = params;

  if (isExalted) return "Exalted";
  if (isDebilitated) return "Debilitated";
  if (isMoolatrikona) return "Moolatrikona";
  if (isOwnSign) return "Own Sign";
  if (relationshipToSignLord === "friend") return "Friend Sign";
  if (relationshipToSignLord === "enemy") return "Enemy Sign";
  if (relationshipToSignLord === "neutral") return "Neutral Sign";
  if (relationshipToSignLord === "self") return "Own Sign";
  return "Other";
}

function getStrengthBand(params: {
  isExalted: boolean;
  isDebilitated: boolean;
  isOwnSign: boolean;
  isMoolatrikona: boolean;
  relationshipToSignLord: "friend" | "enemy" | "neutral" | "self" | "n/a";
  isCombustSevere: boolean;
}): "very_strong" | "strong" | "mixed" | "weak" {
  const {
    isExalted,
    isDebilitated,
    isOwnSign,
    isMoolatrikona,
    relationshipToSignLord,
    isCombustSevere,
  } = params;

  if (isDebilitated || relationshipToSignLord === "enemy") return "weak";
  if (isExalted || isMoolatrikona) return isCombustSevere ? "strong" : "very_strong";
  if (isOwnSign || relationshipToSignLord === "friend") {
    return isCombustSevere ? "mixed" : "strong";
  }
  if (isCombustSevere) return "weak";
  return "mixed";
}
function getIsVargottama(
  planet: string,
  d1Sign: string,
  d9Planets: any[]
): boolean {
  if (!Array.isArray(d9Planets)) return false;

  const d9 = d9Planets.find((p) => p?.name === planet);
  if (!d9 || !d9.sign) return false;

  return d9.sign === d1Sign;
}
export function buildPlanetStrength(params: {
  natalPlanets: NatalPlanet[];
  vargaData?: any;
}): PlanetStrengthRow[] {
  const planets = Array.isArray(params.natalPlanets) ? params.natalPlanets : [];
  const d9Planets = params.vargaData?.d9?.planets ?? [];
  const sun = planets.find((p) => p?.planet === "Sun");
  const sunLon = typeof sun?.lon === "number" ? sun.lon : null;

  return planets
    .filter((p) => p && typeof p.planet === "string" && typeof p.sign === "string")
    .map((p) => {
      const ownSigns = OWN_SIGNS[p.planet] ?? [];
      const exaltationSign = EXALTATION_SIGNS[p.planet] ?? null;
      const debilitationSign = DEBILITATION_SIGNS[p.planet] ?? null;
      const moolatrikonaSign = MOOLATRIKONA_SIGNS[p.planet] ?? null;
      const signLord = SIGN_LORDS[p.sign] ?? null;

      const isOwnSign = ownSigns.includes(p.sign);
      const isExalted = exaltationSign === p.sign;
      const isDebilitated = debilitationSign === p.sign;
      const isMoolatrikona = moolatrikonaSign === p.sign;
      const isVargottama = getIsVargottama(
  p.planet,
  p.sign,
  d9Planets
);
      const relationshipToSignLord = getRelationshipToSignLord(
        p.planet,
        signLord
      );

      const combustDistanceDeg = getCombustDistanceDeg(
        p.planet,
        typeof p.lon === "number" ? p.lon : null,
        sunLon
      );

      const isCombustSevere = getIsCombustSevere(
        p.planet,
        combustDistanceDeg
      );

      const dignity = getDignity({
        isOwnSign,
        isExalted,
        isDebilitated,
        isMoolatrikona,
        relationshipToSignLord,
      });

      const strengthBand = getStrengthBand({
        isExalted,
        isDebilitated,
        isOwnSign,
        isMoolatrikona,
        relationshipToSignLord,
        isCombustSevere,
      });

      return {
        planet: p.planet,
        sign: p.sign,
        signLord,
        dignity,
        relationshipToSignLord,
        isOwnSign,
        isExalted,
        isDebilitated,
        isMoolatrikona,
        isVargottama,
        retrograde: Boolean(p.retrograde),
        combust: Boolean(p.combust),
        combustDistanceDeg,
        isCombustSevere,
        strengthBand,
      };
    })
    .sort((a, b) => a.planet.localeCompare(b.planet));
}