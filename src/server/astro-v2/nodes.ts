import { norm360 } from "./math";
import { ayanamsaLahiriDegrees, toSiderealLon } from "./ayanamsa";
import { toUtcDate } from "./time";

/**
 * Mean lunar ascending node longitude (tropical), Meeus-style approximation.
 * Good enough for correct sign/nakshatra for Rahu/Ketu in app UX.
 */
function meanNodeTropicalLon(jd: number): number {
  // Julian centuries from J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // Ω (deg) = 125.04452 − 1934.136261*T + 0.0020708*T^2 + (T^3)/450000
  const omega =
    125.04452 -
    1934.136261 * T +
    0.0020708 * T * T +
    (T * T * T) / 450000.0;

  return norm360(omega);
}

function jdFromUtcDate(d: Date): number {
  return d.getTime() / 86400000 + 2440587.5; // Unix ms -> JD (UTC)
}

export function computeRahuKetuSidereal(when: string | Date) {
  const d = toUtcDate(when);
  const jd = jdFromUtcDate(d);

  const rahuTrop = meanNodeTropicalLon(jd);
  const ayan = ayanamsaLahiriDegrees(d);

  const rahuSid = toSiderealLon(rahuTrop, ayan);
  const ketuSid = norm360(rahuSid + 180);

  return { rahuSid, ketuSid, rahuTrop };
}
