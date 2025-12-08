// client-safe, pure helper (no server-only imports)
type PlanetInfo = {
  house: number;
  sign?: string;
  nakshatra?: string;
  pada?: 1 | 2 | 3 | 4;
  degree?: number;
};

export type Chart = {
  planets: Record<string, PlanetInfo>;
  longitudes: Record<string, number>; // degrees 0..360
};

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

const NAKSHATRAS = [
  "Aśvinī","Bharanī","Kṛttikā","Rohiṇī","Mṛgaśīrṣa","Ārdrā",
  "Punarvasu","Puṣya","Āśleṣā","Maghā","Pūrvaphalgunī","Uttaraphalgunī",
  "Hasta","Chitrā","Svātī","Viśākhā","Anurādhā","Jyeṣṭhā",
  "Mūla","Pūrvāṣāḍhā","Uttarāṣāḍhā","Śravaṇa","Dhaniṣṭhā","Śatabhiṣaj",
  "Pūrvabhādrapadā","Uttarabhādrapadā","Revatī",
];

// simple deterministic hash
function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
function rnd(seed: number) {
  let x = seed >>> 0;
  return () => {
    // xorshift32
    x ^= x << 13; x >>>= 0;
    x ^= x >> 17; x >>>= 0;
    x ^= x << 5;  x >>>= 0;
    return (x >>> 0) / 0xffffffff;
  };
}

export function computeChart(dob: string, tob: string, place: string): Chart {
  const seed = hash(`${dob}|${tob}|${place}`);
  const rand = rnd(seed);

  const planetNames = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const longitudes: Record<string, number> = {};
  const planets: Record<string, PlanetInfo> = {};

  for (const p of planetNames) {
    const deg = Math.floor(rand() * 36000) / 100; // 0..360 with 2dp
    longitudes[p] = deg;

    const house = (1 + Math.floor(rand() * 12)) as number;
    const sign = SIGNS[Math.floor((deg / 30) % 12)];
    const nak = NAKSHATRAS[Math.floor((deg / (360 / 27)) % 27)];
    const pada = (1 + Math.floor(rand() * 4)) as 1 | 2 | 3 | 4;

    planets[p] = {
      house,
      sign,
      nakshatra: nak,
      pada,
      degree: Math.round((deg % 30) * 10) / 10, // 0..30, 1dp
    };
  }

  return { planets, longitudes };
}
