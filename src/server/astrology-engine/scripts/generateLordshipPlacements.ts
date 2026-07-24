import fs from "fs";
import path from "path";

const houses: Record<number, string[]> = {
  1: ["self", "body", "confidence", "identity"],
  2: ["money", "speech", "family", "values"],
  3: ["effort", "communication", "siblings", "short travel"],
  4: ["home", "comfort", "mother", "property"],
  5: ["children", "creativity", "learning", "romance"],
  6: ["workload", "health", "conflict", "discipline"],
  7: ["relationships", "clients", "partnerships", "public dealings"],
  8: ["sudden changes", "hidden matters", "deep emotions", "research"],
  9: ["luck", "guidance", "teachers", "beliefs"],
  10: ["career", "status", "responsibility", "visibility"],
  11: ["gains", "network", "income", "friends"],
  12: ["rest", "sleep", "expenses", "foreign matters"],
};

function key(lord: number, placed: number) {
  return `${lord}_lord_in_${placed}`;
}

function makeEntry(lord: number, placed: number) {
  return `  "${key(lord, placed)}": {
    lordshipHouse: ${lord},
    placementHouse: ${placed},
    key: "${key(lord, placed)}",
    principle: "${houses[lord][0]} connects with ${houses[placed][0]}.",
    areas: ["mind"],
    supportiveThemes: [${houses[placed].map((x) => `"${x}"`).join(", ")}],
    cautionThemes: [],
    synthesis:
      "${houses[lord].slice(0, 3).join(", ")} may express through ${houses[placed]
        .slice(0, 3)
        .join(", ")}.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  }`;
}

const entries: string[] = [];

for (let lord = 1; lord <= 12; lord++) {
  for (let placed = 1; placed <= 12; placed++) {
    entries.push(makeEntry(lord, placed));
  }
}

const content = `import type { LifeArea } from "../types";

export type LordshipPlacementKnowledge = {
  lordshipHouse: number;
  placementHouse: number;
  key: string;
  principle: string;
  areas: LifeArea[];
  supportiveThemes: string[];
  cautionThemes: string[];
  synthesis: string;
  advice: string;
};

export function lordshipPlacementKey(
  lordshipHouse: number,
  placementHouse: number
): string {
  return \`\${lordshipHouse}_lord_in_\${placementHouse}\`;
}

export const LORDSHIP_PLACEMENT_KNOWLEDGE: Record<
  string,
  LordshipPlacementKnowledge
> = {
${entries.join(",\n\n")}
};
`;

const outPath = path.join(
  process.cwd(),
  "src/server/astrology-engine/knowledge/lordshipPlacements.ts"
);

fs.writeFileSync(outPath, content, "utf8");

console.log("Generated 144 lordship placement combinations.");