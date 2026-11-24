const MANGAL_DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];

const SIGN_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

function getPlanets(data: any) {
  return data?.foundations?.natal?.planets ?? data?.natal?.planets ?? [];
}

function getPlanet(data: any, planetName: string) {
  const planets = getPlanets(data);

  return Array.isArray(planets)
    ? planets.find((p: any) => p?.planet === planetName) ?? null
    : null;
}

function houseFromSign(
  targetSign?: string | null,
  referenceSign?: string | null
) {
  const targetIndex = SIGN_ORDER.indexOf(String(targetSign ?? ""));
  const referenceIndex = SIGN_ORDER.indexOf(String(referenceSign ?? ""));

  if (targetIndex < 0 || referenceIndex < 0) return null;

  return ((targetIndex - referenceIndex + 12) % 12) + 1;
}

export function buildMangalDoshaData(data: any) {
  const mars = getPlanet(data, "Mars");
  const moon = getPlanet(data, "Moon");
  const venus = getPlanet(data, "Venus");

  const ascSign =
    data?.foundations?.ascendant?.sign ??
    data?.foundations?.natal?.ascendant?.sign ??
    null;

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

  return [5, 7, 9].includes(distance);
}

export function buildMangalCancellationData(data: any, mangal: any) {
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
