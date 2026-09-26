import {
  resolveDashaActivation,
} from "./knowledge/dashaActivation";

console.log(
  "\nDASHA ACTIVATION TEST"
);
console.log(
  "--------------------------------"
);

const tests = [
  {
    name: "Rahu / Venus / Sun",
    input: {
      mahadasha: "Rahu",
      antardasha: "Venus",
      pratyantardasha: "Sun",
    } as const,
  },

  {
    name: "Rahu / Rahu / Rahu",
    input: {
      mahadasha: "Rahu",
      antardasha: "Rahu",
      pratyantardasha: "Rahu",
    } as const,
  },

  {
    name: "Rahu / Venus / Rahu",
    input: {
      mahadasha: "Rahu",
      antardasha: "Venus",
      pratyantardasha: "Rahu",
    } as const,
  },

  {
    name: "Saturn / Mercury",
    input: {
      mahadasha: "Saturn",
      antardasha: "Mercury",
    } as const,
  },
  {
  name: "Taurus — Rahu / Venus / Sun",
  input: {
    ascendant: "Taurus",
    mahadasha: "Rahu",
    antardasha: "Venus",
    pratyantardasha: "Sun",
  } as const,
},

{
  name: "Aquarius — Saturn / Venus / Mercury",
  input: {
    ascendant: "Aquarius",
    mahadasha: "Saturn",
    antardasha: "Venus",
    pratyantardasha: "Mercury",
  } as const,
},
{
  name: "Taurus — Natal placement activation",
  input: {
    ascendant: "Taurus",

    mahadasha: "Rahu",
    antardasha: "Venus",
    pratyantardasha: "Sun",

    natalPositions: {
      Rahu: {
        sign: "Capricorn",
        house: 9,
      },

      Venus: {
        sign: "Leo",
        house: 4,
      },

      Sun: {
        sign: "Virgo",
        house: 5,
      },
    },
  } as const,
},
];

for (const test of tests) {
  const result =
    resolveDashaActivation(test.input);

  console.log(`\n${test.name}`);

  const output = {
    activePeriods: result.activePeriods,

    planetActivations:
      result.planetActivations.map(
        (activation) => ({
          planet: activation.planet,
          levels: activation.levels,
          strength: activation.strength,

          ruledHouses:
            activation.ruledHouses.join(", "),

          natalHouse:
            activation.natalHouse ?? null,

          dispositor:
            activation.dispositor ?? null,

          dispositorRuledHouses:
            activation.dispositorRuledHouses.join(
              ", "
            ),

          lordshipAreas:
            activation.lordshipAreas.join(
              ", "
            ),

          natalPlacementAreas:
            activation.natalPlacementAreas.join(
              ", "
            ),

          dispositorAreas:
            activation.dispositorAreas.join(
              ", "
            ),

          areaActivations:
            activation.areaActivations.map(
              (areaActivation) => ({
                area:
                  areaActivation.area,

                score:
                  areaActivation.score,

                sources:
                  areaActivation.sources.join(
                    ", "
                  ),
                  sourceContributions:
  areaActivation.sourceContributions.map(
    (contribution) => ({
      source:
        contribution.source,

      score:
        contribution.score,

      houses:
        contribution.houses.join(
          ", "
        ),
    })
  ),
              })
            ),

          areas:
            activation.areas.join(", "),
        })
      ),

    dominantPlanets:
      result.dominantPlanets,
      periodAreaActivations:
  result.periodAreaActivations.map(
    (activation) => ({
      area: activation.area,
      score: activation.score,

      contributors:
        activation.contributors.map(
          (contributor) => ({
            planet: contributor.planet,
            dashaStrength:
              contributor.dashaStrength,
            areaScore:
              contributor.areaScore,
            contribution:
              contributor.contribution,
          })
        ),
    })
  ),
  };

  console.dir(output, {
    depth: null,
  });
}
