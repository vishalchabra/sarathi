export type Place = { name: string; lat: number; lon: number; tz: string };

export type Panchang = {
tithi: { name: string; phase: "Waxing" | "Waning"; endTime?: string };
  nakshatra: { name: string; pada: 1|2|3|4; endTime?: string };
  yoga: { name: string; endTime?: string };
  karana: { name: string; endTime?: string };
  sun: { sunrise: string; sunset: string };
  moon: { moonrise?: string; moonset?: string };
  kaal: {
    rahu: { start: string; end: string },
    gulika: { start: string; end: string },
    yamagandam?: { start: string; end: string }   // 👈 add this
  };
  muhurtas: { abhijit?: { start: string; end: string } };
  festivals?: string[];
};

export type Chart = {
  ascendant: string; // e.g., "Virgo"
  moonSign: string;
  planets: Record<string, { sign: string; degree: number; house: number; nakshatra: string; pada: 1|2|3|4 }>;
};

export type Verdict = {
  area: "Career" | "Finance" | "Relationships" | "Health" | "Learning" | "Travel" | "Property" | "Litigation";
  summary: string;
  confidence: number; // 0..1
  reasons: string[];   // explainability bullets
  remedies?: string[]; // optional
};
