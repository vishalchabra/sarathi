import { DateTime } from "luxon";

const HORA_SEQUENCE = [
  "Sun",
  "Venus",
  "Mercury",
  "Moon",
  "Saturn",
  "Jupiter",
  "Mars",
] as const;

const WEEKDAY_LORDS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
] as const;
export function buildHoraTable(params: {
  sunriseDT: any;
  sunsetDT: any;
  nextSunriseDT: any;
  weekdayIndex: number;
}) {
  const {
    sunriseDT,
    sunsetDT,
    nextSunriseDT,
    weekdayIndex,
  } = params;

  if (!sunriseDT || !sunsetDT || !nextSunriseDT) {
    return {
      day: [],
      night: [],
    };
  }

  const dayStartLord = WEEKDAY_LORDS[weekdayIndex];
  const dayStartIndex = getHoraIndexForPlanet(dayStartLord);

  const nightStartIndex = (dayStartIndex + 12) % 7;

  const dayMinutes = sunsetDT.diff(sunriseDT, "minutes").minutes;
  const nightMinutes = nextSunriseDT.diff(sunsetDT, "minutes").minutes;

  const dayHoraLength = dayMinutes / 12;
  const nightHoraLength = nightMinutes / 12;

  const day = Array.from({ length: 12 }, (_, i) => {
    const start = sunriseDT.plus({
      minutes: i * dayHoraLength,
    });

    const end = sunriseDT.plus({
      minutes: (i + 1) * dayHoraLength,
    });

    return {
      number: i + 1,
      planet: HORA_SEQUENCE[(dayStartIndex + i) % 7],
      start: start.toFormat("hh:mm a"),
      end: end.toFormat("hh:mm a"),
    };
  });

  const night = Array.from({ length: 12 }, (_, i) => {
    const start = sunsetDT.plus({
      minutes: i * nightHoraLength,
    });

    const end = sunsetDT.plus({
      minutes: (i + 1) * nightHoraLength,
    });

    return {
      number: i + 1,
      planet: HORA_SEQUENCE[(nightStartIndex + i) % 7],
      start: start.toFormat("hh:mm a"),
      end: end.toFormat("hh:mm a"),
    };
  });

  return {
    day,
    night,
  };
}
function getHoraIndexForPlanet(planet: string) {
  return HORA_SEQUENCE.findIndex((p) => p === planet);
}

function getNextWeekdayLord(date: any) {
  const nextDay = date.plus({ days: 1 });
  return WEEKDAY_LORDS[nextDay.weekday % 7];
}
function normalizeSolarDateTime(
  value: any,
  baseDateISO: string,
  timezone: string
) {
  if (!value) return null;

  // Luxon DateTime
  if (typeof value === "object" && typeof value.isValid === "boolean") {
    return value.isValid ? value : null;
  }

  // JS Date
  if (value instanceof Date) {
    const dt = DateTime.fromJSDate(value, { zone: timezone });
    return dt.isValid ? dt : null;
  }

  // String
  const raw = String(value).trim();

  // HH:mm or HH:mm:ss
  const hhmmMatch = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (hhmmMatch) {
    const hh = hhmmMatch[1].padStart(2, "0");
    const mm = hhmmMatch[2];
    const ss = hhmmMatch[3] ?? "00";
    const dt = DateTime.fromISO(`${baseDateISO}T${hh}:${mm}:${ss}`, {
      zone: timezone,
    });
    return dt.isValid ? dt : null;
  }

  // ISO-like string
  const iso = DateTime.fromISO(raw, { zone: timezone });
  if (iso.isValid) return iso;

  return null;
}
export function getAccurateHoraLord(params: {
  birthDateISO: string;
  birthTime: string;
  timezone: string;
  sunrise: any | null;
  sunset: any | null;
  previousSunset?: any | null;
  nextSunrise?: any | null;
}) {
  const {
    birthDateISO,
    birthTime,
    timezone,
    sunrise,
    sunset,
    previousSunset,
    nextSunrise,
  } = params;

  const birthDT = DateTime.fromISO(`${birthDateISO}T${birthTime}`, {
    zone: timezone,
  });

  if (!birthDT.isValid) {
    return {
      horaLord: null,
      horaNumber: null,
      phase: null,
      startsAt: null,
      endsAt: null,
    };
  }

  const sunriseDT = normalizeSolarDateTime(sunrise, birthDateISO, timezone);
  const sunsetDT = normalizeSolarDateTime(sunset, birthDateISO, timezone);
  const previousSunsetDT = normalizeSolarDateTime(
    previousSunset ?? null,
    DateTime.fromISO(birthDateISO, { zone: timezone })
      .minus({ days: 1 })
      .toFormat("yyyy-MM-dd"),
    timezone
  );
  const nextSunriseDT = normalizeSolarDateTime(
    nextSunrise ?? null,
    DateTime.fromISO(birthDateISO, { zone: timezone })
      .plus({ days: 1 })
      .toFormat("yyyy-MM-dd"),
    timezone
  );

  if (!sunriseDT || !sunsetDT) {
    return {
      horaLord: null,
      horaNumber: null,
      phase: null,
      startsAt: null,
      endsAt: null,
    };
  }

  // Determine which sunrise-based weekday owns the Hora cycle
  const horaDayDT = birthDT < sunriseDT ? birthDT.minus({ days: 1 }) : birthDT;
  const weekdayLord = WEEKDAY_LORDS[horaDayDT.weekday % 7];
  const startIndex = getHoraIndexForPlanet(weekdayLord);

  if (startIndex < 0) {
    return {
      horaLord: null,
      horaNumber: null,
      phase: null,
      startsAt: null,
      endsAt: null,
    };
  }

  // Day Hora
  if (birthDT >= sunriseDT && birthDT < sunsetDT) {
    const dayMinutes = sunsetDT.diff(sunriseDT, "minutes").minutes;
    const horaLength = dayMinutes / 12;
    const elapsed = birthDT.diff(sunriseDT, "minutes").minutes;

    const horaNumber = Math.min(12, Math.floor(elapsed / horaLength) + 1);
    const sequenceIndex = (startIndex + (horaNumber - 1)) % 7;
    const horaLord = HORA_SEQUENCE[sequenceIndex];

    const startsAt = sunriseDT.plus({ minutes: (horaNumber - 1) * horaLength });
    const endsAt = sunriseDT.plus({ minutes: horaNumber * horaLength });

    return {
      horaLord,
      horaNumber,
      phase: "day",
      startsAt: startsAt.toFormat("HH:mm"),
      endsAt: endsAt.toFormat("HH:mm"),
    };
  }

  // Night Hora after sunset -> next sunrise
  if (birthDT >= sunsetDT) {
    if (!nextSunriseDT) {
      return {
        horaLord: null,
        horaNumber: null,
        phase: null,
        startsAt: null,
        endsAt: null,
      };
    }

    const nightStartIndex = (startIndex + 12) % 7;
    const nightMinutes = nextSunriseDT.diff(sunsetDT, "minutes").minutes;
    const horaLength = nightMinutes / 12;
    const elapsed = birthDT.diff(sunsetDT, "minutes").minutes;

    const horaNumber = Math.min(12, Math.max(1, Math.floor(elapsed / horaLength) + 1));
    const sequenceIndex = (nightStartIndex + (horaNumber - 1)) % 7;
    const horaLord = HORA_SEQUENCE[sequenceIndex];

    const startsAt = sunsetDT.plus({ minutes: (horaNumber - 1) * horaLength });
    const endsAt = sunsetDT.plus({ minutes: horaNumber * horaLength });

    return {
      horaLord,
      horaNumber,
      phase: "night",
      startsAt: startsAt.toFormat("HH:mm"),
      endsAt: endsAt.toFormat("HH:mm"),
    };
  }

  // Night Hora before sunrise -> previous sunset to current sunrise
  if (birthDT < sunriseDT) {
    if (!previousSunsetDT) {
      return {
        horaLord: null,
        horaNumber: null,
        phase: null,
        startsAt: null,
        endsAt: null,
      };
    }

    const nightStartIndex = (startIndex + 12) % 7;
    const nightMinutes = sunriseDT.diff(previousSunsetDT, "minutes").minutes;
    const horaLength = nightMinutes / 12;
    const elapsed = birthDT.diff(previousSunsetDT, "minutes").minutes;

    const horaNumber = Math.min(12, Math.max(1, Math.floor(elapsed / horaLength) + 1));
    const sequenceIndex = (nightStartIndex + (horaNumber - 1)) % 7;
    const horaLord = HORA_SEQUENCE[sequenceIndex];


    const startsAt = previousSunsetDT.plus({ minutes: (horaNumber - 1) * horaLength });
    const endsAt = previousSunsetDT.plus({ minutes: horaNumber * horaLength });

    return {
      horaLord,
      horaNumber,
      phase: "night",
      startsAt: startsAt.toFormat("HH:mm"),
      endsAt: endsAt.toFormat("HH:mm"),
    };
  }

  return {
    horaLord: null,
    horaNumber: null,
    phase: null,
    startsAt: null,
    endsAt: null,
  };
}

