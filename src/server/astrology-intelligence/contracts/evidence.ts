export type EvidenceImpact =
  | "support"
  | "block"
  | "mixed"
  | "neutral";

export type EvidenceSource =
  | "D1"
  | "D2"
  | "D3"
  | "D4"
  | "D7"
  | "D9"
  | "D10"
  | "D12"
  | "D16"
  | "D20"
  | "D24"
  | "D30"
  | "D60"
  | "dasha"
  | "transit"
  | "sambandha"
  | "strength"
  | "yoga"
  | "nakshatra"
  | "avastha"
  | "dignity"
  | "lordship"
  | "dispositor"
  | "aspect"
  | "conjunction"
  | "chart_validation";

export type EvidenceCategory =
  | "planet"
  | "house"
  | "relationship"
  | "divisional"
  | "timing"
  | "strength"
  | "validation"
  | "domain";

export type AstrologyEvidence = {
  /**
   * Stable unique identifier used by intelligence and domain conclusions.
   * Example: mercury_lord_10_d1
   */
  id: string;

  source: EvidenceSource;
  category: EvidenceCategory;

  /**
   * Short machine-readable factor.
   * Example: "Mercury owns house 10"
   */
  factor: string;

  /**
   * Complete factual explanation suitable for an evidence accordion.
   */
  detail: string;

  impact: EvidenceImpact;

  /**
   * Relative importance of this evidence in the current assessment.
   * Range: 0–100.
   */
  weight: number;

  /**
   * Reliability of the evidence based on source quality and data completeness.
   * Range: 0–100.
   */
  confidence: number;

  /**
   * Optional entity references for filtering and inspection.
   */
  planets?: string[];
  houses?: number[];
  signs?: string[];
  charts?: string[];

  /**
   * Optional relationship to another evidence record.
   * Useful for contradictions or supporting chains.
   */
  relatedEvidenceIds?: string[];

  /**
   * Optional structured metadata. This must remain serializable.
   */
  metadata?: Record<
    string,
    string | number | boolean | null | string[] | number[]
  >;
};

export type EvidenceReference = {
  evidenceId: string;
  contribution: number;
  reason: string;
};

export type EvidenceConclusion = {
  key: string;
  label: string;

  score: number;
  confidence: number;

  verdict: string;

  supportingEvidence: EvidenceReference[];
  blockingEvidence: EvidenceReference[];
  mixedEvidence: EvidenceReference[];
};

export type EvidenceStore = {
  records: AstrologyEvidence[];
  byId: Record<string, AstrologyEvidence>;
  warnings: string[];
};

function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
}

function normalizeId(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function createEvidence(
  input: Omit<
    AstrologyEvidence,
    "id" | "weight" | "confidence"
  > & {
    id: string;
    weight?: number;
    confidence?: number;
  }
): AstrologyEvidence {
  const id =
    normalizeId(
      input.id
    );

  if (!id) {
    throw new Error(
      "Astrology evidence requires a valid id."
    );
  }

  return {
    ...input,
    id,

    weight:
      clampScore(
        input.weight ??
        50
      ),

    confidence:
      clampScore(
        input.confidence ??
        70
      ),

    planets:
      input.planets
        ? Array.from(
            new Set(
              input.planets
                .map(
                  (planet) =>
                    String(planet).trim()
                )
                .filter(Boolean)
            )
          )
        : undefined,

    houses:
      input.houses
        ? Array.from(
            new Set(
              input.houses
                .filter(
                  (house) =>
                    Number.isFinite(house) &&
                    house >= 1 &&
                    house <= 12
                )
                .map(
                  (house) =>
                    Math.trunc(house)
                )
            )
          )
        : undefined,

    signs:
      input.signs
        ? Array.from(
            new Set(
              input.signs
                .map(
                  (sign) =>
                    String(sign).trim()
                )
                .filter(Boolean)
            )
          )
        : undefined,

    charts:
      input.charts
        ? Array.from(
            new Set(
              input.charts
                .map(
                  (chart) =>
                    String(chart).trim()
                )
                .filter(Boolean)
            )
          )
        : undefined,

    relatedEvidenceIds:
      input.relatedEvidenceIds
        ? Array.from(
            new Set(
              input.relatedEvidenceIds
                .map(
                  (relatedId) =>
                    normalizeId(
                      relatedId
                    )
                )
                .filter(Boolean)
            )
          )
        : undefined,
  };
}

export function buildEvidenceStore(
  records: AstrologyEvidence[]
): EvidenceStore {
  const byId: Record<
    string,
    AstrologyEvidence
  > = {};

  const warnings: string[] = [];
  const normalizedRecords: AstrologyEvidence[] = [];

  for (const rawRecord of records) {
    const record =
      createEvidence(
        rawRecord
      );

    if (byId[record.id]) {
      warnings.push(
        `Duplicate evidence id ignored: ${record.id}`
      );

      continue;
    }

    byId[record.id] =
      record;

    normalizedRecords.push(
      record
    );
  }

  return {
    records:
      normalizedRecords,

    byId,

    warnings,
  };
}

export function resolveEvidence(
  store: EvidenceStore,
  evidenceIds: string[]
): AstrologyEvidence[] {
  return Array.from(
    new Set(
      evidenceIds
        .map(
          (id) =>
            normalizeId(id)
        )
        .filter(Boolean)
    )
  )
    .map(
      (id) =>
        store.byId[id]
    )
    .filter(
      (
        record
      ): record is AstrologyEvidence =>
        Boolean(record)
    );
}

export function validateEvidenceReferences(params: {
  store: EvidenceStore;
  evidenceIds: string[];
}): {
  valid: string[];
  missing: string[];
} {
  const valid: string[] = [];
  const missing: string[] = [];

  for (
    const rawId of
    params.evidenceIds
  ) {
    const id =
      normalizeId(
        rawId
      );

    if (!id) {
      continue;
    }

    if (
      params.store.byId[id]
    ) {
      valid.push(id);
    } else {
      missing.push(id);
    }
  }

  return {
    valid:
      Array.from(
        new Set(valid)
      ),

    missing:
      Array.from(
        new Set(missing)
      ),
  };
}

export function calculateEvidenceConfidence(
  records: AstrologyEvidence[]
): number {
  if (
    records.length === 0
  ) {
    return 0;
  }

  const totalWeight =
    records.reduce(
      (
        sum,
        record
      ) =>
        sum +
        Math.max(
          1,
          record.weight
        ),
      0
    );

  const weightedConfidence =
    records.reduce(
      (
        sum,
        record
      ) =>
        sum +
        record.confidence *
          Math.max(
            1,
            record.weight
          ),
      0
    );

  return clampScore(
    weightedConfidence /
      totalWeight
  );
}
