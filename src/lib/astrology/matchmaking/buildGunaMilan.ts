type Avakhada = {
  nakshatra?: string | null;
  rashi?: string | null;
  gana?: string | null;
  yoni?: string | null;
  nadi?: string | null;
  varna?: string | null;
};

type GunaRow = {
  guna: string;
  personA: string;
  personB: string;
  maximum: number;
  obtained: number;
  area: string;
  note: string;
};

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const SIGN_LORDS: Record<string, string> = {
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

const RASHI_VARNA: Record<string, string> = {
  Aries: "Kshatriya",
  Leo: "Kshatriya",
  Sagittarius: "Kshatriya",

  Taurus: "Vaishya",
  Virgo: "Vaishya",
  Capricorn: "Vaishya",

  Gemini: "Shudra",
  Libra: "Shudra",
  Aquarius: "Shudra",

  Cancer: "Brahmin",
  Scorpio: "Brahmin",
  Pisces: "Brahmin",
};

const VARNA_RANK: Record<string, number> = {
  Shudra: 1,
  Vaishya: 2,
  Kshatriya: 3,
  Brahmin: 4,
};

const RASHI_VASHYA: Record<string, string> = {
  Aries: "Chatu",
  Taurus: "Chatu",
  Gemini: "Manav",
  Cancer: "Jalch",
  Leo: "Vanch",
  Virgo: "Manav",
  Libra: "Manav",
  Scorpio: "Keeta",
  Sagittarius: "Manav",
  Capricorn: "Chatu",
  Aquarius: "Manav",
  Pisces: "Jalch",
};

const VASHYA_SCORE: Record<string, number> = {
  "Chatu|Chatu": 2,
  "Manav|Manav": 2,
  "Jalch|Jalch": 2,
  "Vanch|Vanch": 2,
  "Keeta|Keeta": 2,

  "Keeta|Manav": 1,
  "Manav|Keeta": 0,

  "Manav|Chatu": 1,
  "Chatu|Manav": 1,

  "Keeta|Chatu": 1,
  "Chatu|Keeta": 1,

  "Vanch|Jalch": 1,
  "Jalch|Vanch": 1,

  "Manav|Jalch": 1,
  "Jalch|Manav": 1,

  "Chatu|Jalch": 1,
  "Jalch|Chatu": 1,

  "Vanch|Manav": 1,
  "Manav|Vanch": 1,

  "Vanch|Chatu": 1,
  "Chatu|Vanch": 1,

  "Keeta|Jalch": 1,
  "Jalch|Keeta": 1,

  "Keeta|Vanch": 1,
  "Vanch|Keeta": 1,
};

const PLANET_RELATION: Record<
  string,
  { friends: string[]; neutral: string[]; enemies: string[] }
> = {
  Sun: {
    friends: ["Moon", "Mars", "Jupiter"],
    neutral: ["Mercury"],
    enemies: ["Venus", "Saturn"],
  },
  Moon: {
    friends: ["Sun", "Mercury"],
    neutral: ["Mars", "Jupiter", "Venus", "Saturn"],
    enemies: [],
  },
  Mars: {
    friends: ["Sun", "Moon", "Jupiter"],
    neutral: ["Venus", "Saturn"],
    enemies: ["Mercury"],
  },
  Mercury: {
    friends: ["Sun", "Venus"],
    neutral: ["Mars", "Jupiter", "Saturn"],
    enemies: ["Moon"],
  },
  Jupiter: {
    friends: ["Sun", "Moon", "Mars"],
    neutral: ["Saturn"],
    enemies: ["Mercury", "Venus"],
  },
  Venus: {
    friends: ["Mercury", "Saturn"],
    neutral: ["Mars", "Jupiter"],
    enemies: ["Sun", "Moon"],
  },
  Saturn: {
    friends: ["Mercury", "Venus"],
    neutral: ["Jupiter"],
    enemies: ["Sun", "Moon", "Mars"],
  },
};

const GANA_SCORE: Record<string, number> = {
  "Deva|Deva": 6,
  "Deva|Manushya": 5,
  "Deva|Rakshasa": 1,

  "Manushya|Deva": 5,
  "Manushya|Manushya": 6,
  "Manushya|Rakshasa": 0,

  "Rakshasa|Deva": 1,
  "Rakshasa|Manushya": 0,
  "Rakshasa|Rakshasa": 6,
};

const NAKSHATRA_NADI_ASTROSAGE: Record<string, string> = {
  Ashwini: "Adi",
  Ardra: "Adi",
  Punarvasu: "Adi",
  "Uttara Phalguni": "Adi",
  Hasta: "Adi",
  Jyeshtha: "Adi",
  Mula: "Adi",
  Shatabhisha: "Adi",
  "Purva Bhadrapada": "Adi",

  Bharani: "Madhya",
  Mrigashira: "Madhya",
  Pushya: "Madhya",
  "Purva Phalguni": "Madhya",
  Chitra: "Madhya",
  Anuradha: "Madhya",
  "Purva Ashadha": "Madhya",
  Dhanishta: "Madhya",
  "Uttara Bhadrapada": "Madhya",

  Krittika: "Antya",
  Rohini: "Antya",
  Ashlesha: "Antya",
  Magha: "Antya",
  Swati: "Antya",
  Vishakha: "Antya",
  "Uttara Ashadha": "Antya",
  Shravana: "Antya",
  Revati: "Antya",
};

const YONI_ALIASES: Record<string, string> = {
  Mriga: "Deer",
  Vyagh: "Tiger",
  Vyaghra: "Tiger",
  Gaja: "Elephant",
  Ashwa: "Horse",
  Shwan: "Dog",
  Mushak: "Rat",
  Gau: "Cow",
  Mahisha: "Buffalo",
  Vanar: "Monkey",
  Nakul: "Mongoose",
  Simha: "Lion",
};

const YONI_SCORE: Record<string, number> = {
  "Horse|Horse": 4,
  "Elephant|Elephant": 4,
  "Goat|Goat": 4,
  "Serpent|Serpent": 4,
  "Dog|Dog": 4,
  "Cat|Cat": 4,
  "Rat|Rat": 4,
  "Cow|Cow": 4,
  "Buffalo|Buffalo": 4,
  "Tiger|Tiger": 4,
  "Deer|Deer": 4,
  "Monkey|Monkey": 4,
  "Mongoose|Mongoose": 4,
  "Lion|Lion": 4,

  "Deer|Tiger": 1,
  "Tiger|Deer": 1,

  "Deer|Elephant": 3,
  "Elephant|Deer": 3,

  "Deer|Horse": 3,
  "Horse|Deer": 3,

  "Rat|Elephant": 3,
  "Elephant|Rat": 3,

  "Dog|Deer": 0,
  "Deer|Dog": 0,

  "Dog|Elephant": 2,
  "Elephant|Dog": 2,

  "Cow|Tiger": 0,
  "Tiger|Cow": 0,

  "Elephant|Lion": 0,
  "Lion|Elephant": 0,

  "Horse|Buffalo": 0,
  "Buffalo|Horse": 0,

  "Serpent|Mongoose": 0,
  "Mongoose|Serpent": 0,

  "Monkey|Goat": 0,
  "Goat|Monkey": 0,

  "Cat|Rat": 0,
  "Rat|Cat": 0,
};

function clean(value: any) {
  return String(value ?? "—").trim() || "—";
}

function normalizeYoni(value: any) {
  const raw = clean(value);
  return YONI_ALIASES[raw] ?? raw;
}

function signDistance(from?: string | null, to?: string | null) {
  const a = SIGNS.indexOf(clean(from));
  const b = SIGNS.indexOf(clean(to));
  if (a < 0 || b < 0) return null;
  return ((b - a + 12) % 12) + 1;
}

function nakDistance(from?: string | null, to?: string | null) {
  const a = NAKSHATRAS.indexOf(clean(from));
  const b = NAKSHATRAS.indexOf(clean(to));
  if (a < 0 || b < 0) return null;
  return ((b - a + 27) % 27) + 1;
}

function relation(from: string, to: string) {
  const rel = PLANET_RELATION[from];
  if (!rel) return "Neutral";
  if (rel.friends.includes(to)) return "Friend";
  if (rel.enemies.includes(to)) return "Enemy";
  return "Neutral";
}

function maitriScore(aLord: string, bLord: string) {
  if (aLord === "—" || bLord === "—") return 0;
  if (aLord === bLord) return 5;

  const ab = relation(aLord, bLord);
  const ba = relation(bLord, aLord);

  if (ab === "Friend" && ba === "Friend") return 5;
  if ([ab, ba].includes("Friend") && [ab, ba].includes("Neutral")) return 4;
  if (ab === "Neutral" && ba === "Neutral") return 3;
  if ([ab, ba].includes("Friend") && [ab, ba].includes("Enemy")) return 1;
  if ([ab, ba].includes("Neutral") && [ab, ba].includes("Enemy")) return 0.5;
  if (ab === "Enemy" && ba === "Enemy") return 0.5;

  return 0.5;
}

function getMatchingNadi(avakhada: Avakhada) {
  return NAKSHATRA_NADI_ASTROSAGE[clean(avakhada.nakshatra)] ?? clean(avakhada.nadi);
}

function scoreVarna(a: Avakhada, b: Avakhada): GunaRow {
  const aVarna = RASHI_VARNA[clean(a.rashi)] ?? "—";
  const bVarna = RASHI_VARNA[clean(b.rashi)] ?? "—";

  const ar = VARNA_RANK[aVarna] ?? 0;
  const br = VARNA_RANK[bVarna] ?? 0;

  const obtained = ar >= br && ar > 0 && br > 0 ? 1 : 0;

  return {
    guna: "Varna",
    personA: aVarna,
    personB: bVarna,
    maximum: 1,
    obtained,
    area: "Work",
    note: `Moon rashi varna: ${clean(a.rashi)} → ${aVarna}, ${clean(b.rashi)} → ${bVarna}`,
  };
}

function scoreVashya(a: Avakhada, b: Avakhada): GunaRow {
  const av = RASHI_VASHYA[clean(a.rashi)] ?? "—";
  const bv = RASHI_VASHYA[clean(b.rashi)] ?? "—";

  const obtained = VASHYA_SCORE[`${av}|${bv}`] ?? 0;

  return {
    guna: "Vashya",
    personA: av,
    personB: bv,
    maximum: 2,
    obtained,
    area: "Dominance",
    note: `${av} ↔ ${bv}`,
  };
}

function scoreTara(a: Avakhada, b: Avakhada): GunaRow {
  const ab = nakDistance(a.nakshatra, b.nakshatra);
  const ba = nakDistance(b.nakshatra, a.nakshatra);

  const isGood = (distance: number | null) => {
    if (!distance) return false;
    const rem = distance % 9 || 9;
    return ![3, 5, 7].includes(rem);
  };

  let obtained = 0;
  if (isGood(ab)) obtained += 1.5;
  if (isGood(ba)) obtained += 1.5;

  return {
    guna: "Tara",
    personA: clean(a.nakshatra),
    personB: clean(b.nakshatra),
    maximum: 3,
    obtained,
    area: "Destiny / wellbeing",
    note: `Nakshatra distance A→B: ${ab ?? "—"}, B→A: ${ba ?? "—"}`,
  };
}

function scoreYoni(a: Avakhada, b: Avakhada): GunaRow {
  const ay = normalizeYoni(a.yoni);
  const by = normalizeYoni(b.yoni);

  const obtained = YONI_SCORE[`${ay}|${by}`] ?? 2;

  return {
    guna: "Yoni",
    personA: ay,
    personB: by,
    maximum: 4,
    obtained,
    area: "Mentality",
    note: `${ay} ↔ ${by}`,
  };
}

function scoreGrahaMaitri(a: Avakhada, b: Avakhada): GunaRow {
  const aLord = SIGN_LORDS[clean(a.rashi)] ?? "—";
  const bLord = SIGN_LORDS[clean(b.rashi)] ?? "—";

  return {
    guna: "Graha Maitri",
    personA: aLord,
    personB: bLord,
    maximum: 5,
    obtained: maitriScore(aLord, bLord),
    area: "Mental compatibility",
    note: `Moon sign lords: ${aLord} ↔ ${bLord}`,
  };
}

function scoreGana(a: Avakhada, b: Avakhada): GunaRow {
  const ag = clean(a.gana);
  const bg = clean(b.gana);

  return {
    guna: "Gana",
    personA: ag,
    personB: bg,
    maximum: 6,
    obtained: GANA_SCORE[`${ag}|${bg}`] ?? 0,
    area: "Guna Level",
    note: `${ag} ↔ ${bg}`,
  };
}

function scoreBhakoot(a: Avakhada, b: Avakhada): GunaRow {
  const ab = signDistance(a.rashi, b.rashi);
  const ba = signDistance(b.rashi, a.rashi);

  const zeroPairs = new Set(["2|12", "12|2", "5|9", "9|5", "6|8", "8|6"]);
  const key = `${ab}|${ba}`;

  const obtained = zeroPairs.has(key) ? 0 : 7;

  return {
    guna: "Bhakoot",
    personA: clean(a.rashi),
    personB: clean(b.rashi),
    maximum: 7,
    obtained,
    area: "Love",
    note: `${ab ?? "—"}/${ba ?? "—"}`,
  };
}

function scoreNadi(a: Avakhada, b: Avakhada): GunaRow {
  const an = getMatchingNadi(a);
  const bn = getMatchingNadi(b);

  const obtained = an !== "—" && bn !== "—" && an !== bn ? 8 : 0;

  return {
    guna: "Nadi",
    personA: an,
    personB: bn,
    maximum: 8,
    obtained,
    area: "Health / constitution",
    note: an === bn ? "Same nadi" : "Different nadi",
  };
}

export function buildGunaMilan({
  personAAvakhada,
  personBAvakhada,
}: {
  personAAvakhada: Avakhada | null | undefined;
  personBAvakhada: Avakhada | null | undefined;
}) {
  const a = personAAvakhada ?? {};
  const b = personBAvakhada ?? {};

  const rows = [
    scoreVarna(a, b),
    scoreVashya(a, b),
    scoreTara(a, b),
    scoreYoni(a, b),
    scoreGrahaMaitri(a, b),
    scoreGana(a, b),
    scoreBhakoot(a, b),
    scoreNadi(a, b),
  ];

  const obtained = rows.reduce((sum, row) => sum + Number(row.obtained || 0), 0);
  const maximum = rows.reduce((sum, row) => sum + Number(row.maximum || 0), 0);

  return {
    rows,
    total: {
      obtained,
      maximum,
    },
  };
}