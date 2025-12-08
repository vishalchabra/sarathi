import "server-only";
import swe from "@/lib/astro/swe-init";
import { DateTime } from "luxon";

type Place = { lat: number; lon: number; tz: string };
type Placement = { body: string; lon: number; sign: string; nakshatra: string; pada: number };

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const NAKS  = [
  "Aśvinī","Bharanī","Kṛttikā","Rohiṇī","Mṛgaśīrṣa","Ārdrā","Punarvasu","Puṣya","Āśleṣā",
  "Maghā","Pūrva Phalgunī","Uttara Phalgunī","Hasta","Chitrā","Svātī","Viśākhā","Anurādhā","Jyeṣṭhā",
  "Mūla","Pūrva Āṣāḍhā","Uttara Āṣāḍhā","Śravaṇā","Dhaniṣṭhā","Śatabhiṣā","Pūrva Bhādrapadā","Uttara Bhādrapadā","Revatī"
];

function toJdUT(dateISO: string, timeHHmm: string, tz: string): number {
  const [hh, mm] = timeHHmm.split(":").map(n => Number(n) || 0);
  const dt = DateTime.fromISO(`${dateISO}T${timeHHmm}`, { zone: tz }).toUTC();
  const h = dt.hour + dt.minute/60 + dt.second/3600;
  return swe.swe_julday(dt.year, dt.month, dt.day, h, swe.SE_GREG_CAL);
}

function nakFromLon(lon: number) {
  const deg = (lon % 360 + 360) % 360;
  const idx = Math.floor(deg / (360/27));          // 13°20' = 13.333…
  const pada = Math.floor((deg % (360/27)) / (360/27/4)) + 1;
  return { name: NAKS[idx], pada };
}

function signFromLon(lon: number) {
  const idx = Math.floor(((lon % 360) + 360) % 360 / 30);
  return SIGNS[idx];
}

export function computePlacements(params: {
  dateISO: string; time: string; place: Place;
  bodies?: Array<{ id: number; name: string }>
}): Placement[] {
  const { dateISO, time, place, bodies } = params;
  const jd_ut = toJdUT(dateISO, time, place.tz);

  const list = bodies ?? [
    { id: swe.SE_SUN,        name: "Sun"     },
    { id: swe.SE_MOON,       name: "Moon"    },
    { id: swe.SE_MARS,       name: "Mars"    },
    { id: swe.SE_MERCURY,    name: "Mercury" },
    { id: swe.SE_JUPITER,    name: "Jupiter" },
    { id: swe.SE_VENUS,      name: "Venus"   },
    { id: swe.SE_SATURN,     name: "Saturn"  },
    { id: swe.SE_TRUE_NODE,  name: "Rahu"    },              // true node
    // Ketu = Rahu + 180°
  ];

  const placements: Placement[] = [];

  for (const b of list) {
    const { longitude } = swe.swe_calc_ut(jd_ut, b.id, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL).result;
    const lon = b.name === "Rahu" ? longitude : longitude;
    const s = signFromLon(lon);
    const nk = nakFromLon(lon);
    placements.push({ body: b.name, lon, sign: s, nakshatra: nk.name, pada: nk.pada });
    if (b.name === "Rahu") {
      const ketuLon = (lon + 180) % 360;
      const ks = signFromLon(ketuLon);
      const knk = nakFromLon(ketuLon);
      placements.push({ body: "Ketu", lon: ketuLon, sign: ks, nakshatra: knk.name, pada: knk.pada });
    }
  }

  return placements;
}
