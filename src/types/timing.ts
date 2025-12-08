// src/types/timing.ts
export type Place = { name?: string; tz: string; lat: number; lon: number };
export type Birth = { dateISO: string; time: string; tz: string; lat: number; lon: number };

export type Graha = "Sun"|"Moon"|"Mars"|"Mercury"|"Jupiter"|"Venus"|"Saturn"|"Rahu"|"Ketu";
export type Sign  = "Aries"|"Taurus"|"Gemini"|"Cancer"|"Leo"|"Virgo"|"Libra"|"Scorpio"|"Sagittarius"|"Capricorn"|"Aquarius"|"Pisces";
export type Nakshatra =
  | "Ashwini"|"Bharani"|"Krittika"|"Rohini"|"Mrigashira"|"Ardra"|"Punarvasu"|"Pushya"|"Ashlesha"
  | "Magha"|"Purva Phalguni"|"Uttara Phalguni"|"Hasta"|"Chitra"|"Swati"|"Vishakha"|"Anuradha"|"Jyeshtha"
  | "Mula"|"Purva Ashadha"|"Uttara Ashadha"|"Shravana"|"Dhanishta"|"Shatabhisha"|"Purva Bhadrapada"|"Uttara Bhadrapada"|"Revati";

export type PlanetPos = {
  graha: Graha;
  deg: number;                 // 0–360 ecliptic longitude
  sign: Sign;
  nakshatra: Nakshatra;
  pada: 1|2|3|4;
  house?: number;              // optional house mapping (1..12)
  retro?: boolean;
};

export type VimshottariSpan = {
  fromISO: string; toISO: string;
  md: Graha; ad: Graha; label: string;
};

export type TransitSample = {
  dateISO: string;
  planets: Record<Graha, { deg: number; sign: Sign; nakshatra: Nakshatra; pada: 1|2|3|4; retro?: boolean }>;
};

export type TransitWindow = { fromISO: string; toISO: string; label: string; score: number; why: string[] };

export type TimingWindow = {
  fromISO: string; toISO: string;
  tag: "prep + momentum" | "build + close" | "offer + close" | "align + meet families" | "engage + register" | "discuss + prep";
  why: string[]; do: string[]; score: number;
  overlays: { dasha: string; keyTransits: string[]; nakshatraNotes: string[] };
  remedies?: string[];
};
