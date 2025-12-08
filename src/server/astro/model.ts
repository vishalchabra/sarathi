// FILE: src/server/astro/model.ts
// Minimal natal model + a safe placeholder builder.
// Replace `computeNatalSnapshot()` later with your real chart engine.

export type Dignity =
  | "uccha"        // exalted
  | "own"
  | "moola"
  | "friend"
  | "neutral"
  | "enemy"
  | "neecha";

export type NatalHouse = {
  lord: string;                              // e.g. "Saturn"
  lordDignity: Dignity | "unknown";
  lordShadbala: number;                      // normalized -10..+10 (0 = average)
  occupants: Array<{ planet: string; strength: number }>; // -6..+6 heuristic
  aspects: Array<{ from: string; type: "benefic"|"malefic"; power: number }>; // -8..+8
  yogas: string[];                           // names/labels you detect
};

export type NatalSnapshot = {
  houses: Record<number, NatalHouse>;
  lords: Record<
    string,
    { housesRuled: number[]; isFunctionalBenefic: boolean }
  >;
};

export type BirthData = {
  dateISO: string;
  time: string;
  tz: string;
  lat: number;
  lon: number;
};

export type Place = { name?: string; tz: string; lat: number; lon: number };

export async function computeNatalSnapshot(
  birth?: BirthData | null
): Promise<NatalSnapshot> {
  // SAFETY: Return a neutral snapshot if we don't have a real engine yet.
  // This keeps the API stable and UI responsive.
  const emptyHouse = (): NatalHouse => ({
    lord: "Unknown",
    lordDignity: "unknown",
    lordShadbala: 0,
    occupants: [],
    aspects: [],
    yogas: [],
  });

  const houses: Record<number, NatalHouse> = {
    1: emptyHouse(), 2: emptyHouse(), 3: emptyHouse(), 4: emptyHouse(),
    5: emptyHouse(), 6: emptyHouse(), 7: emptyHouse(), 8: emptyHouse(),
    9: emptyHouse(), 10: emptyHouse(), 11: emptyHouse(), 12: emptyHouse(),
  };

  const lords: NatalSnapshot["lords"] = {};

  return { houses, lords };
}
