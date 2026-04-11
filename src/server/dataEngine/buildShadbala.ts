type PlanetInput = {
  planet: string;
  sign?: string;
  house?: number;
  degree?: number;
  retrograde?: boolean;
};

const NATURAL_STRENGTH: Record<string, number> = {
  Sun: 0.60,
  Moon: 0.51,
  Mars: 0.43,
  Mercury: 0.34,
  Jupiter: 0.85,
  Venus: 0.68,
  Saturn: 0.43,
};

const EXALTATION_SIGNS: Record<string, string> = {
  Sun: "Aries",
  Moon: "Taurus",
  Mars: "Capricorn",
  Mercury: "Virgo",
  Jupiter: "Cancer",
  Venus: "Pisces",
  Saturn: "Libra",
};

const EXALTATION_DEGREES: Record<string, number> = {
  Sun: 10,
  Moon: 3,
  Mars: 28,
  Mercury: 15,
  Jupiter: 5,
  Venus: 27,
  Saturn: 20,
};

const DEBILITATION_SIGNS: Record<string, string> = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mars: "Cancer",
  Mercury: "Pisces",
  Jupiter: "Capricorn",
  Venus: "Virgo",
  Saturn: "Aries",
};

const OWN_SIGNS: Record<string, string[]> = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mars: ["Aries", "Scorpio"],
  Mercury: ["Gemini", "Virgo"],
  Jupiter: ["Sagittarius", "Pisces"],
  Venus: ["Taurus", "Libra"],
  Saturn: ["Capricorn", "Aquarius"],
};

function getSthanaBala(p: PlanetInput): number {
  if (!p.sign || typeof p.degree !== "number") return 0.15;

  const exaltSign = EXALTATION_SIGNS[p.planet];
  const exaltDeg = EXALTATION_DEGREES[p.planet];

  if (p.sign === exaltSign && typeof exaltDeg === "number") {
    const diff = Math.abs(p.degree - exaltDeg);
    return Number(Math.max(0.05, 0.30 - diff * 0.005).toFixed(3));
  }

  if (p.sign === DEBILITATION_SIGNS[p.planet]) {
    return 0.05;
  }

  if (OWN_SIGNS[p.planet]?.includes(p.sign)) {
    return 0.22;
  }

  return 0.12;
}

function getDigBala(p: PlanetInput): number {
  const house = p.house ?? 0;

  const ideal: Record<string, number> = {
    Sun: 10,
    Moon: 4,
    Mars: 10,
    Mercury: 1,
    Jupiter: 1,
    Venus: 4,
    Saturn: 7,
  };

  const target = ideal[p.planet];
  if (typeof target !== "number" || house <= 0) return 0.10;

  const distance = Math.abs(house - target);
  return Number(Math.max(0.05, 0.25 - distance * 0.02).toFixed(3));
}

function getKalaBala(p: PlanetInput, isDayBirth?: boolean): number {
  if (isDayBirth === undefined) return 0.15;

  if (isDayBirth) {
    if (["Sun", "Jupiter"].includes(p.planet)) return 0.25;
    if (["Moon", "Venus"].includes(p.planet)) return 0.10;
  } else {
    if (["Moon", "Venus"].includes(p.planet)) return 0.25;
    if (["Sun", "Jupiter"].includes(p.planet)) return 0.10;
  }

  return 0.15;
}

function getChesthaBala(p: PlanetInput): number {
  if (p.retrograde) return 0.30;
  return 0.10;
}

function getDrikBala(
  p: PlanetInput,
  aspects?: Array<{ to?: string }>
): number {
  const influences = (aspects ?? []).filter((a) => a?.to === p.planet);
  const score = influences.length * 0.05;
  return Number(Math.min(0.25, score).toFixed(3));
}

export function buildShadbala({
  natalPlanets,
  aspects,
  isDayBirth,
}: {
  natalPlanets: PlanetInput[];
  aspects?: Array<{ to?: string }>;
  isDayBirth?: boolean;
}) {
  const corePlanets = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
  ];

  return corePlanets.map((planetName) => {
    const p: PlanetInput =
      natalPlanets.find((x) => x.planet === planetName) ?? {
        planet: planetName,
      };

    const sthana = getSthanaBala(p);
    const dig = getDigBala(p);
    const kala = getKalaBala(p, isDayBirth);
    const chestha = getChesthaBala(p);
    const naisargika = NATURAL_STRENGTH[planetName] ?? 0.2;
    const drik = getDrikBala(p, aspects);

    const total = sthana + dig + kala + chestha + naisargika + drik;

    return {
      planet: planetName,
      total: Number(total.toFixed(2)),
      sthana,
      dig,
      kala,
      chestha,
      naisargika,
      drik,
    };
  });
}