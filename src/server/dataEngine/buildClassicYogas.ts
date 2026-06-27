type PlanetRow = {
  planet?: string;
  name?: string;
  sign?: string;
  house?: number | null;
  signNum?: number | null;
  lon?: number | null;
  degree?: number | null;
  combust?: boolean;
};

type HouseRow = {
  house?: number;
  lord?: string;
  sign?: string;
};

const KENDRAS = [1, 4, 7, 10];
const TRIKONAS = [1, 5, 9];
const DHANA_HOUSES = [2, 5, 9, 11];
const DUSTHANAS = [6, 8, 12];

const DEBILITATION_SIGNS: Record<string, string> = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mars: "Cancer",
  Mercury: "Pisces",
  Jupiter: "Capricorn",
  Venus: "Virgo",
  Saturn: "Aries",
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

function getSignLord(sign?: string | null) {
  if (!sign) return null;
  return SIGN_LORDS[sign] ?? null;
}
function planetName(p: PlanetRow) {
  return String(p.planet ?? p.name ?? "");
}

function getPlanet(planets: PlanetRow[], name: string) {
  return planets.find((p) => planetName(p) === name) ?? null;
}

function getHouseLord(houses: HouseRow[], houseNum: number) {
  const row = houses.find((h) => Number(h.house) === houseNum);
  return row?.lord ?? null;
}

function getPlanetHouse(planets: PlanetRow[], planet: string) {
  const row = getPlanet(planets, planet);
  const h = Number(row?.house);
  return Number.isFinite(h) && h >= 1 && h <= 12 ? h : null;
}

function houseDistance(fromHouse: number, toHouse: number) {
  return ((toHouse - fromHouse + 12) % 12) + 1;
}

function getAssociationType(planets: PlanetRow[], a: string, b: string) {
  const ah = getPlanetHouse(planets, a);
  const bh = getPlanetHouse(planets, b);

  if (!ah || !bh) return null;
  if (ah === bh) return "conjunction";

  const distanceAB = houseDistance(ah, bh);
  if (distanceAB === 7) return "mutual_aspect";

  if (a === "Jupiter" && [5, 9].includes(distanceAB)) return "jupiter_aspect";
  if (a === "Mars" && [4, 8].includes(distanceAB)) return "mars_aspect";
  if (a === "Saturn" && [3, 10].includes(distanceAB)) return "saturn_aspect";

  const distanceBA = houseDistance(bh, ah);
  if (distanceBA === 7) return "mutual_aspect";

  if (b === "Jupiter" && [5, 9].includes(distanceBA)) return "jupiter_aspect";
  if (b === "Mars" && [4, 8].includes(distanceBA)) return "mars_aspect";
  if (b === "Saturn" && [3, 10].includes(distanceBA)) return "saturn_aspect";

  return null;
}

function areAssociated(planets: PlanetRow[], a: string, b: string) {
  return getAssociationType(planets, a, b) !== null;
}

function getAssociationHouse(planets: PlanetRow[], a: string, b: string) {
  const ah = getPlanetHouse(planets, a);
  const bh = getPlanetHouse(planets, b);

  if (!ah || !bh) return null;
  if (ah === bh) return ah;

  return null;
}

function isDusthanaHouse(house: number | null) {
  return !!house && DUSTHANAS.includes(house);
}

function isPlanetDebilitated(planets: PlanetRow[], planet: string) {
  const p = getPlanet(planets, planet);
  if (!p?.sign) return false;
  return p.sign === DEBILITATION_SIGNS[planet];
}

function isPlanetCombust(planets: PlanetRow[], planet: string) {
  const p = getPlanet(planets, planet);
  return !!p?.combust;
}

function evaluateYogaStrength(
  planets: PlanetRow[],
  params: {
    associationHouse?: number | null;
    involvedPlanets: string[];
    allowDusthana?: boolean;
  }
) {
  const cancellationReasons: string[] = [];
  const weakeningReasons: string[] = [];
  const supportingReasons: string[] = [];
  let score = 50;
  if (!params.allowDusthana && isDusthanaHouse(params.associationHouse ?? null)) {
    cancellationReasons.push("Yoga association occurs in 6th, 8th or 12th house.");
    score -= 40;
  }

  for (const planet of params.involvedPlanets) {
    if (isPlanetDebilitated(planets, planet)) {
      weakeningReasons.push(`${planet} is debilitated.`);
      score -= 20;
    }

    if (isPlanetCombust(planets, planet)) {
      weakeningReasons.push(`${planet} is combust.`);
      score -= 15;
    }
  }

  if (
    params.associationHouse &&
    [1, 4, 5, 7, 9, 10, 11].includes(params.associationHouse)
  ) {
    supportingReasons.push("Yoga association occurs in a supportive house.");
    score += 20;
  }

  const strength =
    cancellationReasons.length > 0
      ? "Cancelled"
      : weakeningReasons.length > 0
      ? "Weak"
      : supportingReasons.length > 0
      ? "Strong"
      : "Moderate";
  score = Math.max(0, Math.min(100, score));
  return {
  strength,
  score,
  cancellationReasons,
  weakeningReasons,
  supportingReasons,
};
}

function pushDetected(out: any[], yoga: any) {
  const evidence = yoga?.evidence ?? {};
  const yogaStrength = evidence?.yogaStrength ?? yoga?.yogaStrength ?? null;

  const involvedPlanets = Array.from(
    new Set(
      Object.entries(evidence)
        .filter(([key, value]) => {
          if (typeof value !== "string") return false;
          return (
            key.toLowerCase().includes("lord") ||
            key.toLowerCase().includes("planet")
          );
        })
        .map(([, value]) => value)
    )
  );

  out.push({
    detected: true,
    involvedPlanets,
    status: yogaStrength?.strength ?? "Detected",
    ...yoga,
  });
}

export function buildClassicYogas(input: {
  natalPlanets: PlanetRow[];
  houses: HouseRow[];
}) {
  const planets = Array.isArray(input.natalPlanets) ? input.natalPlanets : [];
  const houses = Array.isArray(input.houses) ? input.houses : [];

  const detected: any[] = [];

  const kendraLords = Array.from(
    new Set(KENDRAS.map((h) => getHouseLord(houses, h)).filter(Boolean))
  ) as string[];

  const trikonaLords = Array.from(
    new Set(TRIKONAS.map((h) => getHouseLord(houses, h)).filter(Boolean))
  ) as string[];

  const dhanaLords = Array.from(
    new Set(DHANA_HOUSES.map((h) => getHouseLord(houses, h)).filter(Boolean))
  ) as string[];

  const dusthanaLords = Array.from(
    new Set(DUSTHANAS.map((h) => getHouseLord(houses, h)).filter(Boolean))
  ) as string[];

  // 1. Raj Yoga
  for (const tLord of trikonaLords) {
    let bestMatch: any = null;

    for (const kLord of kendraLords) {
      if (!kLord || !tLord || kLord === tLord) continue;

      const assocType = getAssociationType(planets, kLord, tLord);
      if (assocType !== "conjunction") continue;

      const associationHouse = getAssociationHouse(planets, kLord, tLord);
      const priority = assocType === "conjunction" ? 2 : 0;

      if (!bestMatch || priority > bestMatch.priority) {
        bestMatch = {
          kLord,
          tLord,
          assocType,
          priority,
          associationHouse,
        };
      }
    }

    if (bestMatch) {
      const yogaStrength = evaluateYogaStrength(planets, {
        associationHouse: bestMatch.associationHouse,
        involvedPlanets: [bestMatch.kLord, bestMatch.tLord],
      });

      pushDetected(detected, {
        id: `raj_yoga_${bestMatch.kLord}_${bestMatch.tLord}`,
        name: "Raj Yoga",
        group: "Classic Yoga",
        rule: "A Kendra lord is strongly associated with a Trikona lord.",
        evidence: {
          kendraLord: bestMatch.kLord,
          trikonaLord: bestMatch.tLord,
          kendraLordHouse: getPlanetHouse(planets, bestMatch.kLord),
          trikonaLordHouse: getPlanetHouse(planets, bestMatch.tLord),
          associationHouse: bestMatch.associationHouse,
          associationType: bestMatch.assocType,
          yogaStrength,
        },
      });
    }
  }

  // 2. Dhana Yoga
  for (let i = 0; i < dhanaLords.length; i++) {
    for (let j = i + 1; j < dhanaLords.length; j++) {
      const a = dhanaLords[i];
      const b = dhanaLords[j];

      if (!a || !b || a === b) continue;
      if (!areAssociated(planets, a, b)) continue;

      const associationHouse = getAssociationHouse(planets, a, b);
      const yogaStrength = evaluateYogaStrength(planets, {
        associationHouse,
        involvedPlanets: [a, b],
      });

      pushDetected(detected, {
        id: `dhana_yoga_${a}_${b}`,
        name: "Dhana Yoga",
        group: "Classic Yoga",
        rule: "Wealth house lords are associated.",
        evidence: {
          wealthHousesChecked: DHANA_HOUSES,
          lordA: a,
          lordB: b,
          lordAHouse: getPlanetHouse(planets, a),
          lordBHouse: getPlanetHouse(planets, b),
          associationHouse,
          yogaStrength,
        },
      });
    }
  }

  // 3. Gajakesari Yoga
  const moonHouse = getPlanetHouse(planets, "Moon");
  const jupiterHouse = getPlanetHouse(planets, "Jupiter");

  if (moonHouse && jupiterHouse) {
    const distance = houseDistance(moonHouse, jupiterHouse);

    if (KENDRAS.includes(distance)) {
      const yogaStrength = evaluateYogaStrength(planets, {
        associationHouse: jupiterHouse,
        involvedPlanets: ["Moon", "Jupiter"],
      });

      pushDetected(detected, {
        id: "gajakesari_yoga",
        name: "Gajakesari Yoga",
        group: "Classic Yoga",
        rule: "Jupiter is in a Kendra from Moon.",
        evidence: {
          moonHouse,
          jupiterHouse,
          relationFromMoon: distance,
          yogaStrength,
        },
      });
    }
  }

  // 4. Vipreet Raj Yoga
  for (const lord of dusthanaLords) {
    if (!lord) continue;

    const lordHouse = getPlanetHouse(planets, lord);

    if (lordHouse && DUSTHANAS.includes(lordHouse)) {
      const yogaStrength = evaluateYogaStrength(planets, {
        associationHouse: lordHouse,
        involvedPlanets: [lord],
        allowDusthana: true,
      });

      pushDetected(detected, {
        id: `vipreet_raj_yoga_${lord}`,
        name: "Vipreet Raj Yoga",
        group: "Classic Yoga",
        rule: "A Dusthana lord is placed in a Dusthana.",
        evidence: {
          dusthanaHousesChecked: DUSTHANAS,
          lord,
          lordHouse,
          yogaStrength,
        },
      });
    }
  }

  // 5. Budhaditya Yoga
  const sunHouse = getPlanetHouse(planets, "Sun");
  const mercuryHouse = getPlanetHouse(planets, "Mercury");

  if (sunHouse && mercuryHouse && sunHouse === mercuryHouse) {
    const yogaStrength = evaluateYogaStrength(planets, {
      associationHouse: sunHouse,
      involvedPlanets: ["Sun", "Mercury"],
    });

    pushDetected(detected, {
      id: "budhaditya_yoga",
      name: "Budhaditya Yoga",
      group: "Classic Yoga",
      rule: "Sun and Mercury are in the same house.",
      evidence: {
        sunHouse,
        mercuryHouse,
        yogaStrength,
      },
    });
  }

  // 6. Chandra-Mangal Yoga
  const marsHouse = getPlanetHouse(planets, "Mars");

  if (moonHouse && marsHouse && moonHouse === marsHouse) {
    const yogaStrength = evaluateYogaStrength(planets, {
      associationHouse: moonHouse,
      involvedPlanets: ["Moon", "Mars"],
    });

    pushDetected(detected, {
      id: "chandra_mangal_yoga",
      name: "Chandra-Mangal Yoga",
      group: "Classic Yoga",
      rule: "Moon and Mars are in the same house.",
      evidence: {
        moonHouse,
        marsHouse,
        yogaStrength,
      },
    });
  }

  // 7. Dharma-Karmadhipati Yoga
  const lord9 = getHouseLord(houses, 9);
  const lord10 = getHouseLord(houses, 10);

  if (lord9 && lord10 && lord9 !== lord10 && areAssociated(planets, lord9, lord10)) {
    const associationHouse = getAssociationHouse(planets, lord9, lord10);
    const yogaStrength = evaluateYogaStrength(planets, {
      associationHouse,
      involvedPlanets: [lord9, lord10],
    });

    pushDetected(detected, {
      id: "dharma_karmadhipati",
      name: "Dharma-Karmadhipati Yoga",
      group: "Classic Yoga",
      rule: "9th lord is associated with 10th lord.",
      evidence: {
        lord9,
        lord10,
        lord9House: getPlanetHouse(planets, lord9),
        lord10House: getPlanetHouse(planets, lord10),
        associationHouse,
        yogaStrength,
      },
    });
  }

  // 8. Lakshmi Yoga
  const lagnaLord = getHouseLord(houses, 1);

  if (lagnaLord && lord9 && areAssociated(planets, lagnaLord, lord9)) {
    const associationHouse = getAssociationHouse(planets, lagnaLord, lord9);
    const yogaStrength = evaluateYogaStrength(planets, {
      associationHouse,
      involvedPlanets: [lagnaLord, lord9],
    });

    pushDetected(detected, {
      id: "lakshmi_yoga",
      name: "Lakshmi Yoga",
      group: "Classic Yoga",
      rule: "9th lord is associated with Lagna lord.",
      evidence: {
        lagnaLord,
        lord9,
        lagnaLordHouse: getPlanetHouse(planets, lagnaLord),
        lord9House: getPlanetHouse(planets, lord9),
        associationHouse,
        yogaStrength,
      },
    });
  }

  // 9. Adhi Yoga
  const benefics = ["Jupiter", "Venus", "Mercury"];

  if (moonHouse) {
    const housesFromMoon = benefics
      .map((b) => {
        const h = getPlanetHouse(planets, b);
        return h ? houseDistance(moonHouse, h) : null;
      })
      .filter(Boolean);

    if (
      housesFromMoon.length === benefics.length &&
      housesFromMoon.every((d) => [6, 7, 8].includes(d as number))
    ) {
      const yogaStrength = evaluateYogaStrength(planets, {
        associationHouse: moonHouse,
        involvedPlanets: benefics,
        allowDusthana: true,
      });

      pushDetected(detected, {
        id: "adhi_yoga",
        name: "Adhi Yoga",
        group: "Classic Yoga",
        rule: "Benefics are placed in 6th, 7th or 8th from Moon.",
        evidence: {
          moonHouse,
          relativePositions: housesFromMoon,
          yogaStrength,
        },
      });
    }
  }

  // 10. Neechabhanga Raj Yoga
  for (const planetNameKey of Object.keys(DEBILITATION_SIGNS)) {
    const p = getPlanet(planets, planetNameKey);
    if (!p || p.sign !== DEBILITATION_SIGNS[planetNameKey]) continue;

    const signLord = getSignLord(p.sign);

    if (signLord && areAssociated(planets, planetNameKey, signLord)) {
      const associationHouse = getAssociationHouse(planets, planetNameKey, signLord);

      const yogaStrength = evaluateYogaStrength(planets, {
        associationHouse,
        involvedPlanets: [planetNameKey, signLord],
        allowDusthana: true,
      });

      pushDetected(detected, {
        id: `neechabhanga_${planetNameKey}`,
        name: "Neechabhanga Raj Yoga",
        group: "Classic Yoga",
        rule: "Debilitated planet is associated with its sign lord.",
        evidence: {
          planet: planetNameKey,
          debilitationSign: DEBILITATION_SIGNS[planetNameKey],
          signLord,
          associationHouse,
          yogaStrength,
        },
      });
    }
  }

  // 11. Kemadruma Yoga
  if (moonHouse) {
    const house2 = (moonHouse % 12) + 1;
    const house12 = ((moonHouse + 10) % 12) + 1;

    const hasPlanets2 = planets.some((p) => {
      const name = planetName(p);
      return name !== "Moon" && getPlanetHouse(planets, name) === house2;
    });

    const hasPlanets12 = planets.some((p) => {
      const name = planetName(p);
      return name !== "Moon" && getPlanetHouse(planets, name) === house12;
    });

    if (!hasPlanets2 && !hasPlanets12) {
      pushDetected(detected, {
        id: "kemadruma_yoga",
        name: "Kemadruma Yoga",
        group: "Classic Yoga",
        status: "Pressure",
        rule: "No planets in 2nd and 12th from Moon.",
        evidence: {
          moonHouse,
          house2,
          house12,
        },
      });
    }
  }

  // 12. Daridra Yoga
  const lord2 = getHouseLord(houses, 2);

  if (lord2) {
    const h = getPlanetHouse(planets, lord2);

    if (h && DUSTHANAS.includes(h)) {
      pushDetected(detected, {
        id: "daridra_yoga",
        name: "Daridra Yoga",
        group: "Classic Yoga",
        status: "Pressure",
        rule: "2nd lord is placed in 6th, 8th or 12th house.",
        evidence: {
          lord2,
          house: h,
        },
      });
    }
  }

  // 13. Parivartana Yoga
  const seenParivartanaPairs = new Set<string>();

  for (const p1 of planets) {
    for (const p2 of planets) {
      const p1Name = planetName(p1);
      const p2Name = planetName(p2);

      if (!p1Name || !p2Name || p1Name === p2Name) continue;

      const pairKey = [p1Name, p2Name].sort().join("_");
      if (seenParivartanaPairs.has(pairKey)) continue;

      const p1House = getPlanetHouse(planets, p1Name);
      const p2House = getPlanetHouse(planets, p2Name);

      if (!p1House || !p2House) continue;

      const p1SignLord = getSignLord(p1.sign);
const p2SignLord = getSignLord(p2.sign);

      if (p1SignLord === p2Name && p2SignLord === p1Name) {
        seenParivartanaPairs.add(pairKey);

        const yogaStrength = evaluateYogaStrength(planets, {
          associationHouse: null,
          involvedPlanets: [p1Name, p2Name],
          allowDusthana: true,
        });

        pushDetected(detected, {
          id: `parivartana_${pairKey}`,
          name: "Parivartana Yoga",
          group: "Classic Yoga",
          rule: "Two planets are in each other's signs.",
          evidence: {
            planet1: p1Name,
            planet2: p2Name,
            planet1House: p1House,
            planet2House: p2House,
            planet1SignLord: p1SignLord,
            planet2SignLord: p2SignLord,
            yogaStrength,
          },
        });
      }
    }
  }

  const YOGA_PRIORITY: Record<string, number> = {
    "Raj Yoga": 1,
    "Dharma-Karmadhipati Yoga": 2,
    "Lakshmi Yoga": 3,
    "Dhana Yoga": 4,
    "Vipreet Raj Yoga": 5,
    "Gajakesari Yoga": 6,
    "Budhaditya Yoga": 7,
    "Chandra-Mangal Yoga": 8,
    "Adhi Yoga": 9,
    "Parivartana Yoga": 10,
    "Neechabhanga Raj Yoga": 11,
    "Daridra Yoga": 12,
    "Kemadruma Yoga": 13,
  };

  const sortedDetected = [...detected].sort((a, b) => {
    const pa = YOGA_PRIORITY[a.name] ?? 999;
    const pb = YOGA_PRIORITY[b.name] ?? 999;
    return pa - pb;
  });

  return {
    detected: sortedDetected,
    summary: {
      totalDetected: sortedDetected.length,
      kendraLords,
      trikonaLords,
      dhanaLords,
      dusthanaLords,
    },
  };
}