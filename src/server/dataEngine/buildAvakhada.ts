type PlanetInput = {
  planet: string;
  sign?: string | null;
  nakshatra?: string | null;
  pada?: number | null;
};

const NAKSHATRA_META: Record<
  string,
  {
    gana: string;
    yoni: string;
    nadi: string;
    varna: string;
  }
> = {
  Ashwini: { gana: "Deva", yoni: "Horse", nadi: "Adi", varna: "Kshatriya" },
  Bharani: { gana: "Manushya", yoni: "Elephant", nadi: "Madhya", varna: "Shudra" },
  Krittika: { gana: "Rakshasa", yoni: "Goat", nadi: "Antya", varna: "Brahmin" },
  Rohini: { gana: "Manushya", yoni: "Serpent", nadi: "Adi", varna: "Vaishya" },
  Mrigashira: { gana: "Deva", yoni: "Serpent", nadi: "Madhya", varna: "Brahmin" },
  Ardra: { gana: "Manushya", yoni: "Dog", nadi: "Antya", varna: "Shudra" },
  Punarvasu: { gana: "Deva", yoni: "Cat", nadi: "Adi", varna: "Kshatriya" },
  Pushya: { gana: "Deva", yoni: "Goat", nadi: "Madhya", varna: "Kshatriya" },
  Ashlesha: { gana: "Rakshasa", yoni: "Cat", nadi: "Antya", varna: "Brahmin" },
  Magha: { gana: "Rakshasa", yoni: "Rat", nadi: "Adi", varna: "Kshatriya" },
  PurvaPhalguni: { gana: "Manushya", yoni: "Rat", nadi: "Madhya", varna: "Brahmin" },
  UttaraPhalguni: { gana: "Manushya", yoni: "Cow", nadi: "Antya", varna: "Kshatriya" },
  Hasta: { gana: "Deva", yoni: "Buffalo", nadi: "Adi", varna: "Vaishya" },
  Chitra: { gana: "Rakshasa", yoni: "Tiger", nadi: "Madhya", varna: "Shudra" },
  Swati: { gana: "Deva", yoni: "Buffalo", nadi: "Antya", varna: "Vaishya" },
  Vishakha: { gana: "Rakshasa", yoni: "Tiger", nadi: "Adi", varna: "Kshatriya" },
  Anuradha: { gana: "Deva", yoni: "Deer", nadi: "Madhya", varna: "Shudra" },
  Jyeshtha: { gana: "Rakshasa", yoni: "Deer", nadi: "Antya", varna: "Brahmin" },
  Mula: { gana: "Rakshasa", yoni: "Dog", nadi: "Adi", varna: "Kshatriya" },
  PurvaAshadha: { gana: "Manushya", yoni: "Monkey", nadi: "Madhya", varna: "Brahmin" },
  UttaraAshadha: { gana: "Manushya", yoni: "Mongoose", nadi: "Antya", varna: "Kshatriya" },
  Shravana: { gana: "Deva", yoni: "Monkey", nadi: "Adi", varna: "Vaishya" },
  Dhanishta: { gana: "Rakshasa", yoni: "Lion", nadi: "Madhya", varna: "Shudra" },
  Shatabhisha: { gana: "Rakshasa", yoni: "Horse", nadi: "Antya", varna: "Shudra" },
  PurvaBhadrapada: { gana: "Manushya", yoni: "Lion", nadi: "Adi", varna: "Brahmin" },
  UttaraBhadrapada: { gana: "Manushya", yoni: "Cow", nadi: "Madhya", varna: "Kshatriya" },
  Revati: { gana: "Deva", yoni: "Elephant", nadi: "Antya", varna: "Shudra" },
};
const NAKSHATRA_ALIASES: Record<string, string> = {
  Dhanishta: "Dhanishta",
  Jyeshta: "Jyeshtha",
  Moola: "Mula",
  PoorvaPhalguni: "PurvaPhalguni",
  PoorvaAshadha: "PurvaAshadha",
  PoorvaBhadrapada: "PurvaBhadrapada",
  UttaraBhadra: "UttaraBhadrapada",
  PoorvaBhadra: "PurvaBhadrapada",
};
function normalizeNakshatraKey(value?: string | null) {
  const v = String(value ?? "")
    .replace(/\s+/g, "")
    .replace(/[\u2013\u2014-]/g, "")
    .trim();

  if (v === "Dhanishtha") return "Dhanishta";

  return v;
}
export function buildAvakhada({
  natalPlanets,
}: {
  natalPlanets: PlanetInput[];
}) {
  const moon = natalPlanets.find((p) => p.planet === "Moon");

  if (!moon) return null;

const nak = moon.nakshatra ?? "—";
const nakKey = normalizeNakshatraKey(nak);

const resolvedNakKey = NAKSHATRA_ALIASES[nakKey] ?? nakKey;

const meta = NAKSHATRA_META[resolvedNakKey] ?? {
  gana: "—",
  yoni: "—",
  nadi: "—",
  varna: "—",
};

  return {
    nakshatra: nak,
    pada: moon.pada ?? null,
    rashi: moon.sign ?? null,
    gana: meta.gana,
    yoni: meta.yoni,
    nadi: meta.nadi,
    varna: meta.varna,
  };
}