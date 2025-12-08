// FILE: src/server/qa/wiki.ts
// Fetches festival info from Wikipedia and returns a clean, structured summary.

export type FestivalInfo = {
  title: string;
  url: string;
  summary: string;
  history?: string;
  significance?: string;
  observances?: string;
  dos: string[];
  donts: string[];
  sources: string[]; // primary page + any extras we used
};

const UA =
  "Sarathi/1.0 (festival-info; contact: dev@yourapp.example)";

const CANONICAL_TITLES: Record<string, string> = {
  diwali: "Diwali",
  deepavali: "Diwali",
  holi: "Holi",
  navratri: "Navaratri",
  dussehra: "Vijayadashami",
  vijayadashami: "Vijayadashami",
  "durga puja": "Durga Puja",
  onam: "Onam",
  pongal: "Pongal",
  "makar sankranti": "Makar Sankranti",
  sankranti: "Makar Sankranti",
  lohri: "Lohri",
  "raksha bandhan": "Raksha Bandhan",
  janmashtami: "Krishna Janmashtami",
  "ram navami": "Rama Navami",
  "ganesh chaturthi": "Ganesh Chaturthi",
  mahashivratri: "Maha Shivaratri",
  "maha shivratri": "Maha Shivaratri",
  "karva chauth": "Karva Chauth",
  gurpurab: "Gurpurab",
  baisakhi: "Vaisakhi",
  eid: "Eid al-Fitr", // generic "eid" defaults to al-Fitr; users often ask this one
  "eid al adha": "Eid al-Adha",
  "eid al-adha": "Eid al-Adha",
  "eid al fitr": "Eid al-Fitr",
  "eid al-fitr": "Eid al-Fitr",
  bakrid: "Eid al-Adha",
  christmas: "Christmas",
  easter: "Easter",
  hanukkah: "Hanukkah",
  hannukah: "Hanukkah",
  purim: "Purim",
  vesak: "Vesak",
  "buddha purnima": "Vesak",
  "good friday": "Good Friday",
};

const SECTION_KEYS = [
  "Etymology",
  "History",
  "Significance",
  "Observances",
  "Celebrations",
  "Rituals",
  "Practices",
  "Traditions",
  "Customs",
];

function normalizeFestivalQuery(q: string): string {
  let s = (q || "").toLowerCase();
  s = s
    .replace(/\b(what is|why is|why do we|why is it|tell me|explain|about|when is|which date|what date|exact date)\b/gi, "")
    .replace(/\b(celebrated|celebration|festival|fest)\b/gi, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  // try to map to canonical title if known
  if (CANONICAL_TITLES[s]) return CANONICAL_TITLES[s];
  return s;
}

/* --------------------------------- Fetchers -------------------------------- */
async function wikiSearchTitle(q: string): Promise<string | null> {
  // Try canonical title mapping first
  const mapped = normalizeFestivalQuery(q);
  if (mapped && mapped in CANONICAL_TITLES) return CANONICAL_TITLES[mapped] || mapped;

  // Wikipedia Search API
  const url =
    "https://en.wikipedia.org/w/api.php" +
    "?action=query&list=search&format=json&srprop=snippet&utf8=1&srnamespace=0&origin=*" +
    `&srsearch=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) return null;
  const data = await r.json();
  const title: string | undefined = data?.query?.search?.[0]?.title;
  return title || null;
}

async function wikiSummary(title: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) return null;
  return r.json();
}

type ParsedSection = { line: string; index: number; anchor: string; number: string };
type ParseResp = {
  parse?: {
    title: string;
    text?: string;
    sections?: ParsedSection[];
  };
};

async function wikiParseSections(title: string): Promise<ParseResp | null> {
  const url =
    "https://en.wikipedia.org/w/api.php" +
    "?action=parse&format=json&formatversion=2&prop=sections%7Ctext&redirects=1&origin=*" +
    `&page=${encodeURIComponent(title)}`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) return null;
  const json = (await r.json()) as ParseResp;
  return json;
}

function stripHtml(html: string): string {
  if (!html) return "";
  // Remove references, infobox tables, images, and tags
  return html
    .replace(/<ref[\s\S]*?<\/ref>/gi, " ")
    .replace(/<table[\s\S]*?<\/table>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<sup[\s\S]*?<\/sup>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sliceSection(html: string, sectionName: string): string | undefined {
  // Heuristic: split by headings and find the requested one
  // Headings look like <h2>History</h2>, <h3>Significance</h3> etc. in parse text.
  const tokens = html.split(/<h[2-4][^>]*>/gi);
  for (const tok of tokens) {
    const hdrMatch = tok.match(/^([^<]+)<\/h[2-4]>/i);
    if (!hdrMatch) continue;
    const hdr = stripHtml(hdrMatch[1] || "").toLowerCase();
    const body = tok.replace(/^[\s\S]*?<\/h[2-4]>/i, "");
    if (hdr.includes(sectionName.toLowerCase())) {
      const clean = stripHtml(body).slice(0, 1400); // keep it concise
      if (clean) return clean;
    }
  }
  return undefined;
}

/* --------------------------- Do/Don't heuristics --------------------------- */
function safeGuidelinesFor(title: string): { dos: string[]; donts: string[] } {
  const t = title.toLowerCase();

  if (t.includes("diwali")) {
    return {
      dos: [
        "Use diyas/candles safely; keep away from curtains and children.",
        "Prefer eco-friendly decorations and low-smoke fireworks where legal.",
        "Check local noise/firecracker regulations.",
        "Share sweets mindfully (allergy/diabetes considerations).",
      ],
      donts: [
        "Don’t burst fireworks in crowded/closed areas.",
        "Don’t leave lamps unattended.",
        "Don’t litter — dispose of diya remains and packaging responsibly.",
      ],
    };
  }
  if (t.includes("holi")) {
    return {
      dos: [
        "Use herbal/skin-safe colors; protect eyes and hair.",
        "Ask for consent before applying color.",
        "Hydrate well and apply moisturizer/sunscreen.",
      ],
      donts: [
        "Don’t use industrial dyes or toxic colors.",
        "Don’t waste water; avoid high-pressure jets.",
        "Don’t apply color to unwilling participants or animals.",
      ],
    };
  }
  // Generic festival advice
  return {
    dos: [
      "Confirm regional date/timings with a trusted local calendar.",
      "Respect local customs and dress codes.",
      "Plan transport/parking early; expect crowds.",
    ],
    donts: [
      "Don’t block public pathways or emergency exits during processions.",
      "Don’t photograph people during rituals without permission.",
      "Don’t ignore local safety advisories or noise/fire rules.",
    ],
  };
}

/* --------------------------------- Main --------------------------------- */
export async function fetchFestivalInfoFromWiki(
  query: string
): Promise<FestivalInfo | null> {
  try {
    // 1) Pick a title
    const canonical =
      CANONICAL_TITLES[(query || "").toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim()];
    const guessedTitle =
      canonical || (await wikiSearchTitle(query)) || null;
    if (!guessedTitle) return null;

    // 2) Summary
    const sum = await wikiSummary(guessedTitle);
    const title = sum?.title || guessedTitle;
    const pageUrl =
      sum?.content_urls?.desktop?.page ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(guessedTitle)}`;
    const summary =
      (sum?.extract as string | undefined)?.trim() ||
      (sum?.description as string | undefined) ||
      "";

    // 3) Sections (history/significance/observances)
    const parsed = await wikiParseSections(guessedTitle);
    const fullHtml: string | undefined = parsed?.parse?.text;
    let history: string | undefined;
    let significance: string | undefined;
    let observances: string | undefined;

    if (fullHtml) {
      // Prefer specific sections first
      history = sliceSection(fullHtml, "History");
      significance = sliceSection(fullHtml, "Significance") ?? sliceSection(fullHtml, "Meaning");
      observances =
        sliceSection(fullHtml, "Observances") ??
        sliceSection(fullHtml, "Celebrations") ??
        sliceSection(fullHtml, "Rituals") ??
        sliceSection(fullHtml, "Traditions") ??
        sliceSection(fullHtml, "Practices") ??
        sliceSection(fullHtml, "Customs");
    }

    const guides = safeGuidelinesFor(title);

    const info: FestivalInfo = {
      title,
      url: pageUrl,
      summary: summary || `Summary for ${title}.`,
      history,
      significance,
      observances,
      dos: guides.dos,
      donts: guides.donts,
      sources: [pageUrl],
    };

    return info;
  } catch (e) {
    // Swallow errors and return null so the caller can gracefully fallback
    return null;
  }
}
