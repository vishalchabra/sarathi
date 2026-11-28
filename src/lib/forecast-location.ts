export type ForecastLocation = {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
};

const STORAGE_KEY = "sarathi:forecast-location:v1";

export function validateForecastLocation(
  value: unknown
): ForecastLocation | null {
  if (!value || typeof value !== "object") return null;

  const p = value as Partial<ForecastLocation>;

  if (
    typeof p.name !== "string" ||
    !p.name.trim() ||
    typeof p.lat !== "number" ||
    typeof p.lon !== "number" ||
    !Number.isFinite(p.lat) ||
    !Number.isFinite(p.lon) ||
    Math.abs(p.lat) > 90 ||
    Math.abs(p.lon) > 180 ||
    typeof p.timezone !== "string" ||
    !p.timezone.trim()
  ) {
    return null;
  }

  try {
    new Intl.DateTimeFormat("en", {
      timeZone: p.timezone,
    }).format(new Date());
  } catch {
    return null;
  }

  return {
    name: p.name.trim(),
    lat: p.lat,
    lon: p.lon,
    timezone: p.timezone,
  };
}

export function readForecastLocation(
  userId: string
): ForecastLocation | null {
  if (typeof window === "undefined" || !userId) return null;

  try {
    const raw = sessionStorage.getItem(
      `${STORAGE_KEY}:${userId}`
    );

    return raw
      ? validateForecastLocation(JSON.parse(raw))
      : null;
  } catch {
    return null;
  }
}

export function saveForecastLocation(
  userId: string,
  location: unknown
): boolean {
  if (typeof window === "undefined" || !userId) return false;

  const valid = validateForecastLocation(location);

  if (!valid) return false;

  try {
    sessionStorage.setItem(
      `${STORAGE_KEY}:${userId}`,
      JSON.stringify(valid)
    );

    return true;
  } catch {
    return false;
  }
}

export function clearForecastLocation(userId: string): void {
  if (typeof window === "undefined" || !userId) return;

  try {
    sessionStorage.removeItem(`${STORAGE_KEY}:${userId}`);
  } catch {
    // Storage may be unavailable.
  }
}