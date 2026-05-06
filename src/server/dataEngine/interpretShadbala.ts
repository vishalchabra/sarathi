export type ShadbalaInsight = {
  planet: string;
  strength: "strong" | "medium" | "weak";
  tone: "support" | "mixed" | "pressure";
  summary: string;
  usageNote: string;
};

export function getPlanetShadbalaInsight(
  row: any,
  afflictions: any[] = []
): ShadbalaInsight {
  const planet = String(row?.planet ?? "");
  const total = Number(row?.shadbalaRupas ?? row?.total ?? 0);

let strength: "strong" | "medium" | "weak" = "medium";
let tone: "support" | "mixed" | "pressure" = "mixed";

// Keep insights aligned with the Shadbala table.
// Source of truth = Shadbala in Rupas.
if (total >= 6) {
  strength = "strong";
  tone = "support";
} else if (total < 5) {
  strength = "weak";
  tone = "pressure";
}

  const base = {
    strong: `${planet} has good Shadbala support. When activated, it can deliver results with better stability and expression.`,
    medium: `${planet} has moderate Shadbala. When activated, results may come but need support from dasha, house strength, and transit confirmation.`,
    weak: `${planet} has low Shadbala. When activated, it may show delay, pressure, friction, or uneven results.`,
  };

  const usage = {
    support: `Use ${planet} as a supportive factor when judging dasha, transit, house activation, or lordship results.`,
    mixed: `Use ${planet} cautiously. It can support results if other chart factors are also favorable.`,
    pressure: `Treat ${planet} as a caution factor. Its activation may show effort, delay, instability, or corrective karma.`,
  };

  const aff = afflictions.find((a) => a.planet === planet);

  let affText = "";

  if (aff?.level === "afflicted") {
    affText = ` However, it is afflicted (${aff.reasons.join(
      ", "
    )}), so results may come with pressure, conflict, or instability.`;
  } else if (aff?.level === "mild") {
    affText = ` Chart role: ${aff.reasons.join(", ")}, so results may require effort or adjustment.`;
  }

  return {
    planet,
    strength,
    tone,
    summary: base[strength] + affText,
    usageNote: usage[tone],
  };
}

export function buildShadbalaInsights(
  shadbala: any[] = [],
  afflictions: any[] = []
) {
  return shadbala.map((row) => getPlanetShadbalaInsight(row, afflictions));
}