// FILE: src/server/astro/houses.ts

/* --------------------------------------------------------------------------
   Simple house-wise reading used by /api/qa
   - Lightweight, defensive (all fields optional)
   - Topic -> houses, then score by: planets in house, house lord, aspects
   -------------------------------------------------------------------------- */

export type NatalHouses = Record<
  string | number,
  {
    lord?: string;          // house lord (e.g., "Saturn")
    sign?: string;          // optional
    planets?: string[];     // planets placed in the house
  }
>;

export type NatalAspect = {
  from: string;             // planet casting the aspect, e.g. "Saturn"
  to: string;               // "house:10" or planet/point/lord name
  type?: string;            // "trine", "square", "conjunction"...
  angle?: number;           // degrees if you have them
};

export type NatalInput = {
  houses?: NatalHouses;
  aspects?: NatalAspect[];
};

export type HouseReading = {
  topic: string;
  houses: number[];
  score: number;            // 0..1
  strengths: string[];
  cautions: string[];
  notes: string[];
};

const BENS = ["Jupiter", "Venus", "Mercury", "Moon"];
const MALS = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"]; // Sun ~ mild malefic in simple model

function cap(s?: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
}

function has(list?: string[], name?: string) {
  if (!list || !name) return false;
  const n = name.toLowerCase();
  return list.some((p) => String(p).toLowerCase() === n);
}

function planetsIn(h?: { planets?: string[] }) {
  return (h?.planets || []).map(cap);
}

function isBen(p?: string) {
  return !!p && BENS.some((b) => b.toLowerCase() === p.toLowerCase());
}
function isMal(p?: string) {
  return !!p && MALS.some((m) => m.toLowerCase() === p.toLowerCase());
}

/* -------- topic -> houses map -------- */
function housesForTopic(topic: string): number[] {
  switch (topic) {
    case "job":
      return [2, 6, 10, 11];
    case "wealth":
      return [2, 11];
    case "health":
      return [1, 6, 8, 12];
    case "vehicle":
      return [3, 11]; // movement + gains
    case "property":
      return [4, 8, 11]; // home + fixed assets + gains
    case "relationships":
      return [5, 7, 11];
    case "marriage":
      return [7, 2, 11];
    case "disputes":
      return [6, 8];
    default:
      return [2, 6, 10, 11];
  }
}

/* -------- core scoring -------- */
export function analyzeTopicByHouses(
  topic: string,
  natal?: NatalInput
): HouseReading | undefined {
  if (!natal || !natal.houses) return undefined;
  const H = natal.houses;
  const aspects = Array.isArray(natal.aspects) ? natal.aspects : [];

  const targets = housesForTopic(topic);
  // base confidence
  let score = 0.5;
  const strengths: string[] = [];
  const cautions: string[] = [];
  const notes: string[] = [];

  for (const hNo of targets) {
    const h = H[String(hNo)] || H[hNo];
    const inside = planetsIn(h);
    const lord = cap(h?.lord);

    // planets in house
    for (const p of inside) {
      if (isBen(p)) { score += 0.07; strengths.push(`${p} in house ${hNo}`); }
      if (isMal(p)) { score -= 0.06; cautions.push(`${p} in house ${hNo}`); }
    }

    // house lord
    if (lord) {
      if (isBen(lord)) { score += 0.06; strengths.push(`Benefic lord (${lord}) of house ${hNo}`); }
      if (isMal(lord)) { score -= 0.04; cautions.push(`Malefic lord (${lord}) of house ${hNo}`); }
    }

    // simple aspects onto the house or its lord
    const tagHouse = `house:${hNo}`;
    const houseAspects = aspects.filter((a) => {
      const to = String(a?.to || "").toLowerCase();
      return to === tagHouse || (lord && to === String(lord).toLowerCase());
    });

    for (const a of houseAspects) {
      const from = cap(a.from);
      const t = (a.type || "").toLowerCase();
      const soft = /trine|sextile|conj(unction)?/.test(t);
      const hard = /square|opp(osition)?/.test(t);

      if (isBen(from) || soft) {
        score += 0.04;
        strengths.push(`${from} aspect to ${tagHouse}${lord ? `/${lord}` : ""}${t ? ` (${t})` : ""}`);
      }
      if (isMal(from) || hard) {
        score -= 0.04;
        cautions.push(`${from} aspect to ${tagHouse}${lord ? `/${lord}` : ""}${t ? ` (${t})` : ""}`);
      }
    }
  }

  // clamp
  score = Math.max(0, Math.min(1, score));

  // rollup summary
  const good = strengths.length ? `Support: ${strengths.slice(0, 3).join("; ")}.` : "";
  const warn  = cautions.length ? `Watchouts: ${cautions.slice(0, 3).join("; ")}.` : "";
  const summary = [good, warn].filter(Boolean).join(" ");

  if (summary) notes.push(summary);
  notes.push(`Houses considered → ${targets.join(", ")}.`);

  return {
    topic,
    houses: targets,
    score,
    strengths: uniq(strengths).slice(0, 8),
    cautions: uniq(cautions).slice(0, 8),
    notes,
  };
}

function uniq<T>(arr: T[]) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const k = String(x);
    if (!seen.has(k)) { seen.add(k); out.push(x); }
  }
  return out;
}
