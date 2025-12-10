import Holidays from "date-holidays";

type LocalHit = {
  title: string;
  dateISO: string;
  weekday: string;
  source: string; // "date-holidays"
};

const COUNTRY_MAP: Record<string, string> = {
  india: "IN",
  in: "IN",
  usa: "US",
  us: "US",
  uk: "GB",
  gb: "GB",
  canada: "CA",
  ca: "CA",
};

function pickCountryCode(hint?: string) {
  if (!hint) return "IN";
  const key = hint.trim().toLowerCase();
  return COUNTRY_MAP[key] || "IN";
}

function norm(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function weekday(dateISO: string, tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: tz }).format(new Date(dateISO));
  } catch {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(dateISO));
  }
}

// canonical festival → synonyms (used for fuzzy matching)
const NAME_SYNONYMS: Record<string, string[]> = {
  "eid al-fitr": ["eid al fitr", "eid-ul-fitr", "id-ul-fitr", "id ul fitr", "eid", "eid al-fitr"],
  "eid al-adha": ["eid al adha", "eid-ul-adha", "id-ul-adha", "bakrid", "bakr id", "id al adha", "id-ul-zuha"],
  "holi": ["holi"],
  "diwali": ["diwali", "deepavali", "diwali (deepavali)", "diwali/deepavali"],
  "maha shivaratri": ["maha shivaratri", "mahashivratri", "shivaratri", "mahashivaratri"],
  "janmashtami": ["janmashtami", "krishna janmashtami"],
  "ganesh chaturthi": ["ganesh chaturthi", "vinayaka chaturthi"],
  "raksha bandhan": ["raksha bandhan", "rakshabandhan"],
  "ram navami": ["ram navami", "rama navami"],
  "guru nanak jayanti": ["guru nanak jayanti", "gurpurab", "guru nanak gurpurab"],
  "good friday": ["good friday"],
  "christmas": ["christmas"],
  "independence day": ["independence day"],
};

function canonicalForQuery(query: string): string | null {
  const q = norm(query);
  for (const [canon, vars] of Object.entries(NAME_SYNONYMS)) {
    for (const v of vars) {
      if (q.includes(v)) return canon;
    }
  }
  if (/\beid\b/i.test(query)) return "eid al-fitr"; // bare "eid"
  return null;
}

function matchName(holidayName: string, canonical: string) {
  const c = norm(holidayName);
  const variants = NAME_SYNONYMS[canonical] || [];
  return variants.some((v) => c.includes(norm(v)));
}

/** Resolve using date-holidays (offline). Returns null if not available. */
export async function findFestivalDateLocal(
  query: string,
  year: number,
  tz: string,
  countryHint?: string
): Promise<LocalHit | null> {
  const country = pickCountryCode(countryHint);
  let hd: Holidays;
  try {
    hd = new Holidays(country);
  } catch {
    return null;
  }

  const list = hd.getHolidays(year) || [];
  if (!Array.isArray(list) || list.length === 0) return null;

  const canonical = canonicalForQuery(query);
  const tryKeys = canonical
    ? [canonical, ...(canonical === "eid al-fitr" ? ["eid al-adha"] : [])]
    : Object.keys(NAME_SYNONYMS);

  for (const key of tryKeys) {
    const hit = list.find(
      (h: any) =>
        (typeof h.name === "string" && matchName(h.name, key)) ||
        (typeof h.localName === "string" && matchName(h.localName, key))
    );
    if (hit) {
      const dateISO = (hit.date || hit.start || "").toString().slice(0, 10);
           if (!dateISO) continue;

      // Some holiday entries may have a `localName` field at runtime,
      // but it's not declared on the Holiday type, so we access it via `any`.
      const localName =
        (hit as any)?.localName as string | undefined;

      return {
        title: hit.name || localName || key,
        dateISO,
        weekday: weekday(dateISO, tz),
        source: "date-holidays",
      };

    }
  }
  return null;
}
