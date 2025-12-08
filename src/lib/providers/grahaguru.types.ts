// Shared types – safe to import in Client Components
export type Place = { name: string; lat: number; lon: number; tz: string };

export type Panchang = {
  tithi?: string;
  nakshatra?: string;
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  rahuKaal?: { start: string; end: string };
  gulikaKaal?: { start: string; end: string };
  abhijit?: { start: string; end: string };
};

export type TransitHit = {
  name: string;
  degree?: number;
  exact?: string;              // ISO datetime
  orbDays?: number;
  strength?: "weak" | "ok" | "strong";
  note?: string;
};

export type TransitSummary = {
  hits: TransitHit[];
  bestDay?: string;            // ISO date (YYYY-MM-DD)
  bestWindow?: { start: string; end: string; reason?: string };
  notes?: string[];
};