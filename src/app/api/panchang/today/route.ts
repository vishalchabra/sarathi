export const runtime = "nodejs";

import { NextResponse } from "next/server";

/* Reuse small subset: keep in sync with life-report route */
const DEG_PER_NAK = 360/27, DEG_PER_TITHI = 12, DEG_PER_KARANA = 6;
const TITHIS = [
  "Shukla Pratipada","Shukla Dwitiya","Shukla Tritiya","Shukla Chaturthi","Shukla Panchami","Shukla Shashthi",
  "Shukla Saptami","Shukla Ashtami","Shukla Navami","Shukla Dashami","Shukla Ekadashi","Shukla Dwadashi",
  "Shukla Trayodashi","Shukla Chaturdashi","Purnima",
  "Krishna Pratipada","Krishna Dwitiya","Krishna Tritiya","Krishna Chaturthi","Krishna Panchami","Krishna Shashthi",
  "Krishna Saptami","Krishna Ashtami","Krishna Navami","Krishna Dashami","Krishna Ekadashi","Krishna Dwadashi",
  "Krishna Trayodashi","Krishna Chaturdashi","Amavasya"
] as const;
const YOGAS = [
  "Vishkambha","Preeti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shoola","Ganda",
  "Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva",
  "Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"
] as const;
const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
] as const;
const KARANA_FIXED: Record<number,string> = { 0:"Kimstughna",57:"Shakuni",58:"Chatushpada",59:"Naga" };
const KARANA_CHARA = ["Bava","Balava","Kaulava","Taitila","Garaja","Vanija","Vishti (Bhadra)"] as const;

const norm360 = (x:number)=>{ let v=x%360; if(v<0)v+=360; return v; };

function panchangFromSidereal(sidSun:number, sidMoon:number) {
  const diff = norm360(sidMoon - sidSun);
  const tithiIndex = Math.floor(diff / DEG_PER_TITHI);
  const kIndex = Math.floor(diff / DEG_PER_KARANA);
  const karanaName = KARANA_FIXED[kIndex] ?? KARANA_CHARA[(kIndex - 1 + 7) % 7];
  const tithiName = TITHIS[tithiIndex] ?? null;

  const sum = norm360(sidSun + sidMoon);
  const yogaIndex = Math.floor(sum / DEG_PER_NAK);
  const yogaName = YOGAS[yogaIndex] ?? null;

  const nakIndex = Math.floor(sidMoon / DEG_PER_NAK);
  const moonNakshatraName = NAKSHATRAS[nakIndex] ?? null;

  return { tithiName, yogaName, karanaName, moonNakshatraName };
}

/**
 * POST body (choose one of):
 *  - { sidSun:number, sidMoon:number, tz?:string, lang?: "en"|"hi"|"sa" }
 *  - { placements:[{planet:"Sun",lonSid:number},{planet:"Moon",lonSid:number},...], tz?:string, lang? }
 *  NOTE: This route does not compute astronomical positions; send sidereal longs from your engine.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lang = (body?.lang === "hi" || body?.lang === "sa") ? body.lang : "en";

    let sidSun = typeof body?.sidSun === "number" ? body.sidSun : undefined;
    let sidMoon = typeof body?.sidMoon === "number" ? body.sidMoon : undefined;

    if ((sidSun == null || sidMoon == null) && Array.isArray(body?.placements)) {
      const sun = body.placements.find((p:any)=>String(p?.planet).toLowerCase()==="sun");
      const moon = body.placements.find((p:any)=>String(p?.planet).toLowerCase()==="moon");
      sidSun = typeof sun?.lonSid === "number" ? sun.lonSid : sidSun;
      sidMoon = typeof moon?.lonSid === "number" ? moon.lonSid : sidMoon;
    }

    if (sidSun == null || sidMoon == null) {
      return NextResponse.json(
        { error: "Provide sidSun & sidMoon (sidereal) or placements with lonSid for Sun/Moon." },
        { status: 400 }
      );
    }

    const core = panchangFromSidereal(norm360(sidSun), norm360(sidMoon));

    // simple weekday tag if tz provided
    const tz = body?.tz || "UTC";
    const weekday = new Intl.DateTimeFormat("en", { weekday: "long", timeZone: tz }).format(new Date());

    return NextResponse.json({
      weekday,
      ...core,
      lang,
      meta: { source: "sidLongs" },
    });
  } catch (e:any) {
    return new NextResponse(e?.message || "Bad Request", { status: 400 });
  }
}
