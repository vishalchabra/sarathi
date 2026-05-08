type PlanetRow = {
  planet?: string;
  name?: string;
  sign?: string;
  house?: number | null;
  signNum?: number | null;
  lon?: number | null;
  degree?: number | null;
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
  return getAssociationType(planets, a, b) === "conjunction";
}
function pushDetected(out: any[], yoga: any) {
  const evidence = yoga?.evidence ?? {};

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

  // 1. Raj Yoga: pick strongest association per Trikona lord
for (const tLord of trikonaLords) {
  let bestMatch: any = null;

  for (const kLord of kendraLords) {
    if (!kLord || !tLord || kLord === tLord) continue;

    const assocType = getAssociationType(planets, kLord, tLord);
    if (!assocType) continue;

    // Only strong associations
    if (assocType !== "conjunction") continue;

    const priority =
      assocType === "conjunction" ? 2 :
      assocType === "mutual_aspect" ? 1 : 0;

    if (!bestMatch || priority > bestMatch.priority) {
      bestMatch = {
        kLord,
        tLord,
        assocType,
        priority,
      };
    }
  }

  if (bestMatch) {
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
        associationType: bestMatch.assocType,
      },
    });
  }
}

  // 2. Dhana Yoga: 2/5/9/11 lords associated
  for (let i = 0; i < dhanaLords.length; i++) {
    for (let j = i + 1; j < dhanaLords.length; j++) {
      const a = dhanaLords[i];
      const b = dhanaLords[j];

      if (!a || !b || a === b) continue;

      if (areAssociated(planets, a, b)) {
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
          },
        });
      }
    }
  }

  // 3. Gajakesari Yoga: Jupiter in Kendra from Moon
  const moonHouse = getPlanetHouse(planets, "Moon");
  const jupiterHouse = getPlanetHouse(planets, "Jupiter");

  if (moonHouse && jupiterHouse) {
    const distance = houseDistance(moonHouse, jupiterHouse);

    if (KENDRAS.includes(distance)) {
      pushDetected(detected, {
        id: "gajakesari_yoga",
        name: "Gajakesari Yoga",
        group: "Classic Yoga",
        rule: "Jupiter is in a Kendra from Moon.",
        evidence: {
          moonHouse,
          jupiterHouse,
          relationFromMoon: distance,
        },
      });
    }
  }

  // 4. Vipreet Raj Yoga: 6/8/12 lord placed in 6/8/12
  for (const lord of dusthanaLords) {
    if (!lord) continue;

    const lordHouse = getPlanetHouse(planets, lord);

    if (lordHouse && DUSTHANAS.includes(lordHouse)) {
      pushDetected(detected, {
        id: `vipreet_raj_yoga_${lord}`,
        name: "Vipreet Raj Yoga",
        group: "Classic Yoga",
        rule: "A Dusthana lord is placed in a Dusthana.",
        evidence: {
          dusthanaHousesChecked: DUSTHANAS,
          lord,
          lordHouse,
        },
      });
    }
  }
    // 5. Budhaditya Yoga: Sun + Mercury same house
  const sunHouse = getPlanetHouse(planets, "Sun");
  const mercuryHouse = getPlanetHouse(planets, "Mercury");

  if (sunHouse && mercuryHouse && sunHouse === mercuryHouse) {
    pushDetected(detected, {
      id: "budhaditya_yoga",
      name: "Budhaditya Yoga",
      group: "Classic Yoga",
      rule: "Sun and Mercury are in the same house.",
      evidence: {
        sunHouse,
        mercuryHouse,
      },
    });
  }

  // 6. Chandra-Mangal Yoga: Moon + Mars same house
  const moonHouse2 = getPlanetHouse(planets, "Moon");
  const marsHouse = getPlanetHouse(planets, "Mars");

  if (moonHouse2 && marsHouse && moonHouse2 === marsHouse) {
    pushDetected(detected, {
      id: "chandra_mangal_yoga",
      name: "Chandra-Mangal Yoga",
      group: "Classic Yoga",
      rule: "Moon and Mars are in the same house.",
      evidence: {
        moonHouse: moonHouse2,
        marsHouse,
      },
    });
  }

  // 7. Dharma-Karmadhipati Yoga: 9th lord + 10th lord association
  const lord9 = getHouseLord(houses, 9);
  const lord10 = getHouseLord(houses, 10);

  if (
  lord9 &&
  lord10 &&
  lord9 !== lord10 &&
  areAssociated(planets, lord9, lord10)
) {
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
      },
    });
  }

  // 8. Lakshmi Yoga (basic): 9th lord associated with Lagna lord
  const lagnaLord = getHouseLord(houses, 1);

  if (lagnaLord && lord9 && areAssociated(planets, lagnaLord, lord9)) {
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
      },
    });
  }

  // 9. Adhi Yoga: benefics in 6/7/8 from Moon
  const benefics = ["Jupiter", "Venus", "Mercury"];
  const moonH = getPlanetHouse(planets, "Moon");

  if (moonH) {
    const housesFromMoon = benefics
      .map((b) => {
        const h = getPlanetHouse(planets, b);
        return h ? houseDistance(moonH, h) : null;
      })
      .filter(Boolean);

    if (housesFromMoon.every((d) => [6, 7, 8].includes(d as number))) {
      pushDetected(detected, {
        id: "adhi_yoga",
        name: "Adhi Yoga",
        group: "Classic Yoga",
        rule: "Benefics are placed in 6th, 7th or 8th from Moon.",
        evidence: {
          moonHouse: moonH,
          relativePositions: housesFromMoon,
        },
      });
    }
  }

  // 10. Neechabhanga (basic version)
  const DEBILITATION_SIGNS: Record<string, string> = {
    Sun: "Libra",
    Moon: "Scorpio",
    Mars: "Cancer",
    Mercury: "Pisces",
    Jupiter: "Capricorn",
    Venus: "Virgo",
    Saturn: "Aries",
  };

  for (const planetNameKey of Object.keys(DEBILITATION_SIGNS)) {
    const p = getPlanet(planets, planetNameKey);
    if (!p || p.sign !== DEBILITATION_SIGNS[planetNameKey]) continue;

    const signLord = getHouseLord(houses, getPlanetHouse(planets, planetNameKey) || 0);

    if (signLord && areAssociated(planets, planetNameKey, signLord)) {
      pushDetected(detected, {
        id: `neechabhanga_${planetNameKey}`,
        name: "Neechabhanga Raj Yoga",
        group: "Classic Yoga",
        rule: "Debilitated planet is associated with its sign lord.",
        evidence: {
          planet: planetNameKey,
          debilitationSign: DEBILITATION_SIGNS[planetNameKey],
          signLord,
        },
      });
    }
  }

if (moonHouse) {
  const house2 = ((moonHouse % 12) + 1);
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
      rule: "No planets in 2nd and 12th from Moon.",
      evidence: {
        moonHouse,
        house2,
        house12,
      },
    });
  }
}
const lord2 = getHouseLord(houses, 2);

if (lord2) {
  const h = getPlanetHouse(planets, lord2);

  if (h && [6, 8, 12].includes(h)) {
    pushDetected(detected, {
      id: "daridra_yoga",
      name: "Daridra Yoga",
      group: "Classic Yoga",
      rule: "2nd lord is placed in 6th, 8th or 12th house.",
      evidence: {
        lord2,
        house: h,
      },
    });
  }
}
// 13. Parivartana Yoga: two planets in each other's signs
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

    const p1SignLord = getHouseLord(houses, p1House);
    const p2SignLord = getHouseLord(houses, p2House);

    if (p1SignLord === p2Name && p2SignLord === p1Name) {
      seenParivartanaPairs.add(pairKey);

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
      totalDetected: detected.length,
      kendraLords,
      trikonaLords,
      dhanaLords,
      dusthanaLords,
    },
  };
}