import { load as loadHTML } from "cheerio";

type WebHit = {
  title: string;
  dateISO: string;   // YYYY-MM-DD
  weekday: string;   // localized weekday in tz
  source: "nager" | "timeanddate";
  url: string;
};

// ------------ Public API ------------
export async function findFestivalDateFromWeb(
  query: string,
  year: number,
  tz: string,
  countryHint: string | undefined
): Promise<WebHit | null> {
  const fest = normalizeFestival(query);
  if (!fest) return null;

  const cc = countryFromTZ(tz) ?? (countryHint || "IN");

  // 1) Nager public-holidays if available
  const nagerHit = await tryNager(fest, year, cc, tz).catch(() => null);
  if (nagerHit) return nagerHit;

  // 2) timeanddate.com holiday table
  const tadHit = await tryTimeAndDate(fest, year, cc, tz).catch(() => null);
  if (tadHit) return tadHit;

  return null;
}

// ------------ Sources ------------
async function tryNager(
  fest: NormalizedFest,
  year: number,
  country: string,
  tz: string
): Promise<WebHit | null> {
  // https://date.nager.at/swagger
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as Array<{
    date: string;       // YYYY-MM-DD
    localName: string;  // e.g., Deepavali/Diwali
    name: string;
  }>;

  const m = json.find((r) => nameMatches(r.localName, fest) || nameMatches(r.name, fest));
  if (!m) return null;

  if (!monthAllowed(m.date, fest)) return null;

  return {
    title: fest.title,
    dateISO: m.date,
    weekday: weekdayInTZ(m.date, tz),
    source: "nager",
    url,
  };
}

async function tryTimeAndDate(
  fest: NormalizedFest,
  year: number,
  country: string,
  tz: string
): Promise<WebHit | null> {
  const countrySlug = slugCountry(country);
  const url = `https://www.timeanddate.com/holidays/${countrySlug}/${year}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const html = await res.text();
  const $ = loadHTML(html);
  const rows = $("#holidays-table tbody tr");

  let dateISO: string | null = null;

  rows.each((_i, tr) => {
    const $tr = $(tr);
    const name = $tr.find("a[data-tt]").text().trim() || $tr.find("a").first().text().trim();
    if (!name) return;

    if (nameMatches(name, fest)) {
      // extract date (format like "Oct 20" + separate year)
      const dateText = $tr.find("th").first().text().trim(); // e.g., "Oct 20"
      if (!dateText) return;

      const parsed = tryParseMonthDay(dateText, year, tz);
      if (!parsed) return;

      if (!monthAllowed(parsed, fest)) return;

      dateISO = parsed;
      return false as unknown as void; // break
    }
  });

  if (!dateISO) return null;

  return {
    title: fest.title,
    dateISO,
    weekday: weekdayInTZ(dateISO, tz),
    source: "timeanddate",
    url,
  };
}

// ------------ Helpers ------------
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36";

type NormalizedFest = {
  key: "diwali" | "holi" | "eid-al-fitr";
  title: string;
  aliases: RegExp[];
  allowedMonths: number[]; // 0-based months that make sense
};

function normalizeFestival(q: string): NormalizedFest | null {
  const s = q.toLowerCase();

  if (/\b(diwali|deepavali|deepawali)\b/.test(s)) {
    return {
      key: "diwali",
      title: "Diwali (Deepavali)",
      aliases: [/diwali/i, /deepavali/i, /deepawali/i],
      allowedMonths: [9, 10], // Oct, Nov
    };
  }

  if (/\bholi\b/.test(s)) {
    return {
      key: "holi",
      title: "Holi",
      aliases: [/holi/i],
      allowedMonths: [1, 2], // Feb, Mar
    };
  }

  if (/\b(eid)([^a-z]|$).*fitr\b|eid[- ]?al[- ]?fitr|ramadan[- ]?eid/i.test(s)) {
    return {
      key: "eid-al-fitr",
      title: "Eid al-Fitr",
      aliases: [/eid\s*-?\s*al\s*-?\s*fitr/i, /eid.*fitr/i, /ramazan eid/i, /ramadan eid/i],
      allowedMonths: [3, 4, 5], // Apr–Jun (varies)
    };
  }

  return null;
}

function nameMatches(name: string, fest: NormalizedFest) {
  return fest.aliases.some((rx) => rx.test(name));
}

// cheap guard to avoid bad rows like Dec-31 placeholders
function monthAllowed(dateISO: string, fest: NormalizedFest) {
  const m = new Date(dateISO + "T00:00:00Z").getUTCMonth();
  return fest.allowedMonths.includes(m);
}

function weekdayInTZ(dateISO: string, tz: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: tz }).format(
    new Date(dateISO + "T00:00:00")
  );
}

function tryParseMonthDay(md: string, year: number, tz: string): string | null {
  // md like "Oct 20" or "Mar 25"
  const parts = md.split(/\s+/);
  if (parts.length < 2) return null;
  const month = MONTHS[parts[0].toLowerCase()];
  const day = parseInt(parts[1], 10);
  if (month == null || !day) return null;

  const d = new Date(Date.UTC(year, month, day));
  // normalize to ISO date (no TZ shift)
  return d.toISOString().slice(0, 10);
}

const MONTHS: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function countryFromTZ(tz: string): string | null {
  // very small map for common cases
  if (/kolkata|calcutta|asia\/kolkata/i.test(tz)) return "IN";
  if (/dubai|asia\/dubai/i.test(tz)) return "AE";
  if (/london|europe\/london/i.test(tz)) return "GB";
  if (/new_york|america\/new_york/i.test(tz)) return "US";
  return null;
}

function slugCountry(cc: string): string {
  // timeanddate slugs for some common codes
  const map: Record<string, string> = {
    IN: "india",
    AE: "united-arab-emirates",
    US: "usa",
    GB: "uk",
    CA: "canada",
    AU: "australia",
    SG: "singapore",
    MY: "malaysia",
    PK: "pakistan",
    BD: "bangladesh",
    LK: "sri-lanka",
    NP: "nepal",
  };
  return map[cc] || "india";
}
