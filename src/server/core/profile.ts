// Minimal profile until you wire DB/logins.
// Uses your known example: Virgo lagna 22°, natal Mercury 12° Virgo, Dubai.
export type UserProfile = {
  name?: string;
  birth: {
    dob: string; // YYYY-MM-DD
    tob: string; // HH:MM
    place: { name: string; lat: number; lon: number; tz: string };
  };
  natal: {
    lagna: { sign: "Virgo"; degree: number };
    mercury: { sign: "Virgo"; degree: number };
  };
};

export async function getProfile(userId: string): Promise<UserProfile> {
  return {
    name: "Demo",
    birth: {
      dob: "1984-01-21",
      tob: "23:35",
      place: { name: "Dubai", lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai" },
    },
    natal: {
      lagna: { sign: "Virgo", degree: 22 },
      mercury: { sign: "Virgo", degree: 12 },
    },
  };
}
