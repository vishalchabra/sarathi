import type {
  AstrologyEvidence,
} from "../contracts/evidence";

import {
  buildEvidenceStore,
  createEvidence,
} from "../contracts/evidence";

import type {
  AspectFact,
  ChartFacts,
  DashaFact,
  Dignity,
  HouseFact,
  PlanetFact,
  PlanetName,
  SambandhaFact,
  TransitFact,
  VargaPlacement,
  YogaFact,
} from "../contracts/facts";

type BundleLike = any;
const SIGN_LORDS: Record<
  string,
  PlanetName
> = {
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
const PLANETS: PlanetName[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];
function deriveDignity(
  planet: PlanetName,
  sign: string
): Dignity {
  const exaltationSigns: Partial<
    Record<PlanetName, string>
  > = {
    Sun: "Aries",
    Moon: "Taurus",
    Mars: "Capricorn",
    Mercury: "Virgo",
    Jupiter: "Cancer",
    Venus: "Pisces",
    Saturn: "Libra",
  };

  const debilitationSigns: Partial<
    Record<PlanetName, string>
  > = {
    Sun: "Libra",
    Moon: "Scorpio",
    Mars: "Cancer",
    Mercury: "Pisces",
    Jupiter: "Capricorn",
    Venus: "Virgo",
    Saturn: "Aries",
  };

  const ownSigns: Record<
    PlanetName,
    string[]
  > = {
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

  if (
    exaltationSigns[planet] ===
    sign
  ) {
    return "exalted";
  }

  if (
    debilitationSigns[planet] ===
    sign
  ) {
    return "debilitated";
  }

  if (
    ownSigns[planet].includes(
      sign
    )
  ) {
    return "own";
  }

  return "neutral";
}
function normalizeText(
  value: unknown
): string {
  return String(
    value ?? ""
  ).trim();
}

function normalizePlanet(
  value: unknown
): PlanetName | null {
  const raw =
    normalizeText(value)
      .toLowerCase();

  return (
    PLANETS.find(
      (planet) =>
        planet.toLowerCase() ===
        raw
    ) ??
    null
  );
}

function normalizeHouse(
  value: unknown
): number | null {
  const number =
    Number(value);

  if (
    !Number.isFinite(number) ||
    number < 1 ||
    number > 12
  ) {
    return null;
  }

  return Math.trunc(number);
}

function normalizeDegree(
  value: unknown
): number {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return 0;
  }

  return (
    (
      number %
      30
    ) +
    30
  ) % 30;
}

function normalizeDignity(
  value: unknown
): Dignity {
  const raw =
    normalizeText(value)
      .toLowerCase();

  switch (raw) {
    case "exalted":
    case "uchcha":
      return "exalted";

    case "moolatrikona":
    case "moola trikona":
      return "moolatrikona";

    case "own":
    case "own_sign":
    case "own sign":
      return "own";

    case "friend":
    case "friendly":
      return "friend";

    case "neutral":
      return "neutral";

    case "enemy":
    case "inimical":
      return "enemy";

    case "debilitated":
    case "neecha":
      return "debilitated";

    default:
      return "unknown";
  }
}

function createFactEvidence(params: {
  id: string;
  source: AstrologyEvidence["source"];
  category: AstrologyEvidence["category"];
  factor: string;
  detail: string;
  impact?: AstrologyEvidence["impact"];
  weight?: number;
  confidence?: number;
  planets?: string[];
  houses?: number[];
  signs?: string[];
  charts?: string[];
}): AstrologyEvidence {
  return createEvidence({
    id:
      params.id,

    source:
      params.source,

    category:
      params.category,

    factor:
      params.factor,

    detail:
      params.detail,

    impact:
      params.impact ??
      "neutral",

    weight:
      params.weight ??
      50,

    confidence:
      params.confidence ??
      90,

    planets:
      params.planets,

    houses:
      params.houses,

    signs:
      params.signs,

    charts:
      params.charts,
  });
}

function getCanonicalContext(
  bundle: BundleLike
): any {
  return (
    bundle?.canonicalChartContext ??
    bundle?.chartContext ??
    null
  );
}

function getAscendantSign(
  bundle: BundleLike
): string {
  const context =
    getCanonicalContext(
      bundle
    );

  return normalizeText(
    context?.lagnaSign ??
    context?.ascendantSign ??
    bundle?.ascendantSign ??
    bundle?.lagnaSign
  );
}

function getAscendantDegree(
  bundle: BundleLike
): number {
  const context =
    getCanonicalContext(
      bundle
    );

  return normalizeDegree(
    context?.lagnaDegree ??
    context?.ascendantDegree ??
    bundle?.ascendantDegree ??
    bundle?.lagnaDegree
  );
}

function getCanonicalPlanetRows(
  bundle: BundleLike
): any[] {
  const context =
    getCanonicalContext(
      bundle
    );

  const rows =
    context?.planets ??
    [];

  return Array.isArray(rows)
    ? rows
    : [];
}

function getCanonicalHouseRows(
  bundle: BundleLike
): any[] {
  const context =
    getCanonicalContext(
      bundle
    );

  const rows =
    context?.houses ??
    [];

  return Array.isArray(rows)
    ? rows
    : [];
}

function getAspectRows(
  bundle: BundleLike
): any[] {
  const directCandidates = [
    bundle?.aspectFacts,
    bundle?.aspects,
    bundle?.planetaryAspects,
    bundle?.sambandhaAnalysis
      ?.aspects,
  ];

  const directRows =
    directCandidates.find(
      Array.isArray
    ) ??
    [];

  const supportiveLinks =
    Array.isArray(
      bundle?.sambandhaAnalysis
        ?.supportiveLinks
    )
      ? bundle.sambandhaAnalysis
          .supportiveLinks
      : [];

  const derivedRows =
    supportiveLinks
      .map(
        (
          link: any
        ) => {
          const reason =
            normalizeText(
              link?.reason ??
              link?.description
            );

          const match =
            reason.match(
              /\b(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s+aspects?\s+(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\b/i
            );

          if (!match) {
            return null;
          }

          return {
            from:
              match[1],

            to:
              match[2],

            type:
              "graha_drishti",

            strength:
              Number.isFinite(
                Number(
                  link?.strength ??
                  link?.score
                )
              )
                ? Number(
                    link?.strength ??
                    link?.score
                  )
                : 60,

            reason,
          };
        }
      )
      .filter(Boolean);

  const combinedRows = [
    ...directRows,
    ...derivedRows,
  ];

  const seen =
    new Set<string>();

  return combinedRows.filter(
    (
      row: any
    ) => {
      const from =
        normalizePlanet(
          row?.from ??
          row?.planetA ??
          row?.source
        );

      const to =
        normalizePlanet(
          row?.to ??
          row?.planetB ??
          row?.target
        );

      if (
        !from ||
        !to
      ) {
        return false;
      }

      const key =
        `${from}_${to}_${normalizeText(
          row?.type ??
          row?.aspectType
        ).toLowerCase()}`;

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);
      return true;
    }
  );
}

function getSambandhaRows(
  bundle: BundleLike
): any[] {
  const candidates = [
    bundle?.sambandhaFacts,
    bundle?.sambandhaAnalysis
      ?.relationships,
    bundle?.sambandhaAnalysis
      ?.supportiveLinks,
  ];

  return (
    candidates.find(
      Array.isArray
    ) ??
    []
  );
}

function getYogaRows(
  bundle: BundleLike
): any[] {
  const candidates = [
    bundle?.yogaFacts,
    bundle?.yogas,
    bundle?.yogaAnalysis
      ?.yogas,
  ];

  return (
    candidates.find(
      Array.isArray
    ) ??
    []
  );
}

function getTransitRows(
  bundle: BundleLike
): any[] {
  const candidates = [
    bundle?.transitFacts,
    bundle?.transits,
    bundle?.currentTransits,
    bundle?.transitLayer
      ?.planets,
  ];

  return (
    candidates.find(
      Array.isArray
    ) ??
    []
  );
}

function getVargaPlacement(params: {
  bundle: BundleLike;
  planet: PlanetName;
  evidence: AstrologyEvidence[];
}): VargaPlacement[] {
  const charts =
  params.bundle?.divisionalCharts ??
  params.bundle?.vargas ??
  {};

  const placements: VargaPlacement[] = [];

  for (
    const [
      chart,
      chartData,
    ] of Object.entries(
      charts
    )
  ) {
    const rows =
      (
        chartData as any
      )?.planets ??
      (
        chartData as any
      )?.planetaryPositions ??
      [];

    if (
      !Array.isArray(rows)
    ) {
      continue;
    }

    const row =
      rows.find(
        (candidate: any) =>
          normalizePlanet(
            candidate?.planet ??
            candidate?.name ??
            candidate?.graha
          ) ===
params.planet
      );

    if (!row) {
      continue;
    }

    const sign =
  normalizeText(
    row?.sign ??
    row?.rashi ??
    row?.signName
  ) || null;

const house =
  normalizeHouse(
    row?.house ??
    row?.houseNumber ??
    row?.bhava
  );

const suppliedDignity =
  normalizeDignity(
    row?.dignity ??
    row?.relationship
  );

const dignity =
  suppliedDignity !== "unknown" &&
  sign
    ? suppliedDignity
    : sign
    ? deriveDignity(
        params.planet,
        sign
      )
    : "unknown";

const evidenceId =
  `${chart.toLowerCase()}_${params.planet}_${sign ?? "unknown"}_house_${house ?? "unknown"}`;

params.evidence.push(
  createFactEvidence({
    id: evidenceId,
    source:
      chart as AstrologyEvidence["source"],
    category: "divisional",
    factor:
      `${params.planet} in ${chart}`,
    detail:
      sign && house
        ? `${params.planet} is placed in ${sign} in house ${house} in ${chart}, with ${dignity} dignity.`
        : sign
        ? `${params.planet} is placed in ${sign} in ${chart}, with ${dignity} dignity.`
        : `${params.planet} placement is available in ${chart}.`,
    impact: "neutral",
    planets: [
      params.planet,
    ],
    houses:
      house
        ? [house]
        : undefined,
    signs:
      sign
        ? [sign]
        : undefined,
    charts: [
      chart,
    ],
  })
);

    placements.push({
      chart,
      sign,
      house,
      dignity,
      evidenceIds: [
        evidenceId,
      ],
    });
  }

  return placements;
}

function buildHouseFacts(params: {
  bundle: BundleLike;
  evidence: AstrologyEvidence[];
}): HouseFact[] {
  const rows =
    getCanonicalHouseRows(
      params.bundle
    );

  return rows
    .map(
      (
        row: any
      ): HouseFact | null => {
        const house =
          normalizeHouse(
            row?.house
          );

        const lord =
          normalizePlanet(
            row?.lord
          );

        const sign =
          normalizeText(
            row?.sign
          );

        if (
          !house ||
          !lord ||
          !sign
        ) {
          return null;
        }

        const evidenceId =
          `d1_house_${house}_${sign}_${lord}`;

        params.evidence.push(
          createFactEvidence({
            id:
              evidenceId,

            source:
              "D1",

            category:
              "house",

            factor:
              `House ${house} is ${sign}, ruled by ${lord}`,

            detail:
              `In the canonical whole-sign D1 chart, house ${house} falls in ${sign} and is ruled by ${lord}.`,

            houses:
              [house],

            planets:
              [lord],

            signs:
              [sign],

            charts:
              ["D1"],
          })
        );

        const occupants =
          Array.isArray(
            row?.occupants
          )
            ? row.occupants
                .map(
                  (
                    value: unknown
                  ) =>
                    normalizePlanet(
                      value
                    )
                )
                .filter(
                  (
                    value: PlanetName | null
                  ): value is PlanetName =>
                    Boolean(value)
                )
            : [];

        return {
          house,
          sign,
          lord,
          occupants,
          evidenceIds:
            [evidenceId],
        };
      }
    )
    .filter(
      (
        fact: HouseFact | null
      ): fact is HouseFact =>
        Boolean(fact)
    );
}

function buildAspectFacts(params: {
  bundle: BundleLike;
  evidence: AstrologyEvidence[];
}): AspectFact[] {
  return getAspectRows(
    params.bundle
  )
    .map(
      (
        row: any,
        index: number
      ): AspectFact | null => {
        const from =
          normalizePlanet(
            row?.from ??
            row?.planetA ??
            row?.source
          );

        const to =
          normalizePlanet(
            row?.to ??
            row?.planetB ??
            row?.target
          );

        if (
          !from ||
          !to
        ) {
          return null;
        }

        const typeRaw =
          normalizeText(
            row?.type ??
            row?.aspectType
          ).toLowerCase();

        const type: AspectFact["type"] =
          typeRaw ===
          "special"
            ? "special"
            : typeRaw ===
              "rashi_drishti"
            ? "rashi_drishti"
            : typeRaw ===
              "graha_drishti"
            ? "graha_drishti"
            : "full";

        const evidenceId =
          `aspect_${from}_${to}_${index}`;

        params.evidence.push(
          createFactEvidence({
            id:
              evidenceId,

            source:
              "aspect",

            category:
              "relationship",

            factor:
              `${from} aspects ${to}`,

            detail:
              normalizeText(
                row?.reason
              ) ||
              `${from} gives a ${type.replace(
                "_",
                " "
              )} aspect to ${to}.`,

            impact:
              "mixed",

            planets:
              [from, to],
          })
        );

        return {
          from,
          to,
          type,

          strength:
            Number.isFinite(
              Number(
                row?.strength
              )
            )
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    Math.round(
                      Number(
                        row.strength
                      )
                    )
                  )
                )
              : 60,

          evidenceIds:
            [evidenceId],
        };
      }
    )
    .filter(
      (
        fact: AspectFact | null
      ): fact is AspectFact =>
        Boolean(fact)
    );
}

function buildSambandhaFacts(params: {
  bundle: BundleLike;
  evidence: AstrologyEvidence[];
}): SambandhaFact[] {
  return getSambandhaRows(
    params.bundle
  )
    .map(
      (
        row: any,
        index: number
      ): SambandhaFact | null => {
        const planets =
          [
            row?.planetA,
            row?.planetB,
            ...(
              Array.isArray(
                row?.planets
              )
                ? row.planets
                : []
            ),
          ]
            .map(
              (
                value: unknown
              ) =>
                normalizePlanet(
                  value
                )
            )
            .filter(
              (
                value: PlanetName | null
              ): value is PlanetName =>
                Boolean(value)
            );

        const uniquePlanets =
          Array.from(
            new Set(planets)
          );

        if (
          uniquePlanets.length < 2
        ) {
          return null;
        }

        const relationshipRaw =
          normalizeText(
            row?.relationship ??
            row?.type
          ).toLowerCase();

        const relationship: SambandhaFact["relationship"] =
          relationshipRaw.includes(
            "conj"
          )
            ? "conjunction"
            : relationshipRaw.includes(
                "mutual"
              ) &&
              relationshipRaw.includes(
                "aspect"
              )
            ? "mutual_aspect"
            : relationshipRaw.includes(
                "exchange"
              )
            ? "exchange"
            : relationshipRaw.includes(
                "nakshatra"
              )
            ? "nakshatra"
            : relationshipRaw.includes(
                "dispositor"
              )
            ? "dispositor"
            : "combined";

        const evidenceId =
          `sambandha_${uniquePlanets.join(
            "_"
          )}_${index}`;

        params.evidence.push(
          createFactEvidence({
            id:
              evidenceId,

            source:
              "sambandha",

            category:
              "relationship",

            factor:
              `${uniquePlanets.join(
                " and "
              )} are connected`,

            detail:
              normalizeText(
                row?.reason
              ) ||
              `${uniquePlanets.join(
                ", "
              )} form a ${relationship.replace(
                "_",
                " "
              )} relationship.`,

            impact:
              "support",

            planets:
              uniquePlanets,
          })
        );

        return {
          planets:
            uniquePlanets,

          relationship,

          strength:
            Number.isFinite(
              Number(
                row?.strength ??
                row?.score
              )
            )
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    Math.round(
                      Number(
                        row?.strength ??
                        row?.score
                      )
                    )
                  )
                )
              : 60,

          evidenceIds:
            [evidenceId],
        };
      }
    )
    .filter(
      (
        fact: SambandhaFact | null
      ): fact is SambandhaFact =>
        Boolean(fact)
    );
}

function buildPlanetFacts(params: {
  bundle: BundleLike;
  houses: HouseFact[];
  aspects: AspectFact[];
  sambandhas: SambandhaFact[];
  evidence: AstrologyEvidence[];
}): PlanetFact[] {
  const rows =
    getCanonicalPlanetRows(
      params.bundle
    );

  const currentDashaLords =
    [
      params.bundle
        ?.currentDasha?.md,
      params.bundle
        ?.currentDasha?.ad,
      params.bundle
        ?.currentDasha?.pd,
    ]
      .map(
        (
          value
        ) =>
          normalizePlanet(
            value
          )
      )
      .filter(
        (
          value: PlanetName | null
        ): value is PlanetName =>
          Boolean(value)
      );

  return rows
    .map(
      (
        row: any
      ): PlanetFact | null => {
        const planet =
          normalizePlanet(
            row?.planet ??
            row?.name ??
            row?.graha
          );

        const sign =
          normalizeText(
            row?.sign ??
            row?.rashi ??
            row?.signName
          );

        const house =
          normalizeHouse(
            row?.house ??
            row?.houseNumber ??
            row?.bhava
          );

        if (
          !planet ||
          !sign ||
          !house
        ) {
          return null;
        }

        const dispositor =
          normalizePlanet(
            row?.dispositor
          ) ??
          SIGN_LORDS[sign] ??
          null;

        const suppliedDignity =
          normalizeDignity(
            row?.dignity ??
            row?.relationship
          );

        const dignity =
          suppliedDignity !==
          "unknown"
            ? suppliedDignity
            : deriveDignity(
                planet,
                sign
              );

        const ownsHouses =
          params.houses
            .filter(
              (
                houseFact
              ) =>
                houseFact.lord ===
                planet
            )
            .map(
              (
                houseFact
              ) =>
                houseFact.house
            );

        const evidenceIds: string[] = [];

        const placementEvidenceId =
          `d1_${planet}_${sign}_house_${house}`;

        params.evidence.push(
          createFactEvidence({
            id:
              placementEvidenceId,

            source:
              "D1",

            category:
              "planet",

            factor:
              `${planet} is in ${sign}, house ${house}`,

            detail:
              `${planet} is placed in ${sign} in whole-sign house ${house} in the canonical D1 chart.`,

            planets:
              [planet],

            houses:
              [house],

            signs:
              [sign],

            charts:
              ["D1"],
          })
        );

        evidenceIds.push(
          placementEvidenceId
        );

        for (
          const ownedHouse of
          ownsHouses
        ) {
          const lordshipEvidenceId =
            `${planet}_lord_of_house_${ownedHouse}`;

          params.evidence.push(
            createFactEvidence({
              id:
                lordshipEvidenceId,

              source:
                "lordship",

              category:
                "planet",

              factor:
                `${planet} rules house ${ownedHouse}`,

              detail:
                `${planet} is the canonical whole-sign lord of house ${ownedHouse}.`,

              planets:
                [planet],

              houses:
                [ownedHouse],
            })
          );

          evidenceIds.push(
            lordshipEvidenceId
          );
        }

        const aspectsGiven =
          params.aspects
            .filter(
              (
                aspect
              ) =>
                aspect.from ===
                planet
            );

        const aspectsReceived =
          params.aspects
            .filter(
              (
                aspect
              ) =>
                aspect.to ===
                planet
            );
        const conjunctionsFromSambandha =
  params.sambandhas
    .filter(
      (sambandha) =>
        sambandha.relationship === "conjunction" &&
        sambandha.planets.includes(planet)
    )
    .flatMap(
      (sambandha) =>
        sambandha.planets.filter(
          (connectedPlanet) =>
            connectedPlanet !== planet
        )
    );

        const conjunctionsFromRow =
  Array.isArray(row?.conjunctions)
    ? row.conjunctions
        .map(
          (value: unknown) =>
            normalizePlanet(value)
        )
        .filter(
          (
            value: PlanetName | null
          ): value is PlanetName =>
            Boolean(value)
        )
    : [];

        const conjunctions =
  Array.from(
    new Set([
      ...conjunctionsFromRow,
      ...conjunctionsFromSambandha,
    ])
  );
        return {
          planet,
          sign,
          house,
        
          degree:
            normalizeDegree(
              row?.degree ??
              row?.degreeInSign ??
              row?.longitude
            ),

          nakshatra:
            normalizeText(
              row?.nakshatra ??
              row?.nakshatraName ??
              row?.star
            ),

          pada:
            Number.isFinite(
              Number(
                row?.pada
              )
            )
              ? Math.trunc(
                  Number(
                    row.pada
                  )
                )
              : null,

          ownsHouses,

          dispositor,

          nakshatraLord:
            normalizePlanet(
              row?.nakshatraLord
            ),

          retrograde:
            Boolean(
              row?.retrograde
            ),

          combust:
            Boolean(
              row?.combust
            ),

          vargottama:
            Boolean(
              row?.vargottama
            ),

          dignity,

          conjunctions,

          aspectsGiven,
          aspectsReceived,

          vargas:
  getVargaPlacement({
    bundle:
      params.bundle,

    planet,

    evidence:
      params.evidence,
  }),

          strengthScore:
            Number.isFinite(
              Number(
                row?.strengthScore ??
                row?.strength
              )
            )
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    Math.round(
                      Number(
                        row?.strengthScore ??
                        row?.strength
                      )
                    )
                  )
                )
              : 50,

          currentDashaActive:
            currentDashaLords.includes(
              planet
            ),

          currentTransitActive:
            Boolean(
              row?.currentTransitActive
            ),

          futureActivationWindows:
            Array.isArray(
              row?.futureActivationWindows
            )
              ? row.futureActivationWindows
                  .map(
                    (
                      value: unknown
                    ) =>
                      normalizeText(
                        value
                      )
                  )
                  .filter(Boolean)
              : [],

          evidenceIds,
        };
      }
    )
    .filter(
      (
        fact: PlanetFact | null
      ): fact is PlanetFact =>
        Boolean(fact)
    );
}

function buildYogaFacts(params: {
  bundle: BundleLike;
  evidence: AstrologyEvidence[];
}): YogaFact[] {
  return getYogaRows(
    params.bundle
  )
    .map(
      (
        row: any,
        index: number
      ): YogaFact | null => {
        const name =
          normalizeText(
            row?.name ??
            row?.yoga
          );

        if (!name) {
          return null;
        }

        const evidenceId =
          `yoga_${name}_${index}`;

        params.evidence.push(
          createFactEvidence({
            id:
              evidenceId,

            source:
              "yoga",

            category:
              "domain",

            factor:
              name,

            detail:
              normalizeText(
                row?.reason ??
                row?.description
              ) ||
              `${name} is present in the supplied chart analysis.`,

            impact:
              Boolean(
                row?.active ??
                true
              )
                ? "support"
                : "neutral",
          })
        );

        return {
          name,

          active:
            row?.active !==
            false,

          strength:
            Number.isFinite(
              Number(
                row?.strength ??
                row?.score
              )
            )
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    Math.round(
                      Number(
                        row?.strength ??
                        row?.score
                      )
                    )
                  )
                )
              : 50,

          evidenceIds:
            [evidenceId],
        };
      }
    )
    .filter(
      (
        fact: YogaFact | null
      ): fact is YogaFact =>
        Boolean(fact)
    );
}

function buildDashaFact(params: {
  bundle: BundleLike;
  evidence: AstrologyEvidence[];
}): DashaFact {
  const mahadasha =
    normalizePlanet(
      params.bundle
        ?.currentDasha?.md
    ) ??
    "Rahu";

  const antardasha =
    normalizePlanet(
      params.bundle
        ?.currentDasha?.ad
    ) ??
    mahadasha;

  const pratyantardasha =
    normalizePlanet(
      params.bundle
        ?.currentDasha?.pd
    ) ??
    undefined;

  const evidenceId =
    `dasha_${mahadasha}_${antardasha}_${pratyantardasha ?? "none"}`;

  params.evidence.push(
    createFactEvidence({
      id:
        evidenceId,

      source:
        "dasha",

      category:
        "timing",

      factor:
        `Current dasha: ${[
          mahadasha,
          antardasha,
          pratyantardasha,
        ]
          .filter(Boolean)
          .join("–")}`,

      detail:
        normalizeText(
          params.bundle
            ?.currentDasha?.line
        ) ||
        `The current dasha chain is ${[
          mahadasha,
          antardasha,
          pratyantardasha,
        ]
          .filter(Boolean)
          .join("–")}.`,

      planets:
        [
          mahadasha,
          antardasha,
          pratyantardasha,
        ].filter(
          (
            value
          ): value is PlanetName =>
            Boolean(value)
        ),
    })
  );

  return {
    mahadasha,
    antardasha,
    pratyantardasha,

    start:
      normalizeText(
        params.bundle
          ?.currentDasha?.start
      ) ||
      undefined,

    end:
      normalizeText(
        params.bundle
          ?.currentDasha?.end
      ) ||
      undefined,

    evidenceIds:
      [evidenceId],
  };
}

function buildTransitFacts(params: {
  bundle: BundleLike;
  evidence: AstrologyEvidence[];
}): TransitFact[] {
  return getTransitRows(
    params.bundle
  )
    .map(
      (
        row: any
      ): TransitFact | null => {
        const planet =
          normalizePlanet(
            row?.planet ??
            row?.name
          );

        const sign =
          normalizeText(
            row?.sign
          );

        const house =
          normalizeHouse(
            row?.house
          );

        if (
          !planet ||
          !sign ||
          !house
        ) {
          return null;
        }

        const evidenceId =
          `transit_${planet}_${sign}_house_${house}`;

        params.evidence.push(
          createFactEvidence({
            id:
              evidenceId,

            source:
              "transit",

            category:
              "timing",

            factor:
              `${planet} transits ${sign}, house ${house}`,

            detail:
              `${planet} is currently transiting ${sign} in house ${house}.`,

            planets:
              [planet],

            signs:
              [sign],

            houses:
              [house],
          })
        );

        return {
          planet,
          sign,
          house,

          degree:
            normalizeDegree(
              row?.degree ??
              row?.longitude
            ),

          evidenceIds:
            [evidenceId],
        };
      }
    )
    .filter(
      (
        fact: TransitFact | null
      ): fact is TransitFact =>
        Boolean(fact)
    );
}

export function buildChartFacts(
  bundle: BundleLike
): ChartFacts {
  const evidence: AstrologyEvidence[] = [];
  const warnings: string[] = [];

  const ascendantSign =
    getAscendantSign(
      bundle
    );

  if (!ascendantSign) {
    warnings.push(
      "Canonical ascendant sign could not be resolved."
    );
  }

  const houses =
    buildHouseFacts({
      bundle,
      evidence,
    });

  if (
    houses.length !==
    12
  ) {
    warnings.push(
      `Expected 12 canonical houses, found ${houses.length}.`
    );
  }

  const aspects =
    buildAspectFacts({
      bundle,
      evidence,
    });

  const sambandhas =
    buildSambandhaFacts({
      bundle,
      evidence,
    });

  const planets =
    buildPlanetFacts({
      bundle,
      houses,
      aspects,
      sambandhas,
      evidence,
    });

  const yogas =
    buildYogaFacts({
      bundle,
      evidence,
    });

  const dasha =
    buildDashaFact({
      bundle,
      evidence,
    });

  const transits =
    buildTransitFacts({
      bundle,
      evidence,
    });

  const evidenceStore =
    buildEvidenceStore(
      evidence
    );

  warnings.push(
    ...evidenceStore.warnings
  );

  return {
    chartId:
      normalizeText(
        bundle?.chartId ??
        bundle?.profileId ??
        bundle?.birthProfileId
      ) ||
      "current_chart",

    ascendantSign:
      ascendantSign ||
      "Unknown",

    ascendantDegree:
      getAscendantDegree(
        bundle
      ),

    ayanamsha:
      normalizeText(
        bundle?.ayanamsha
      ) ||
      undefined,

    planets,
    houses,
    sambandhas,
    yogas,
    dasha,
    transits,

    evidence:
      evidenceStore.records,

    warnings,
  };
}
