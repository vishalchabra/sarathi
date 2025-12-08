// naive scaffolding; tweak weights later
type ADSpan = { fromISO:string; toISO:string; label:string; md?:string; ad?:string };
type Daily = {
  dateISO:string;
  Jup?: number; Sat?: number; Ven?: number; Mer?: {deg:number; retro?:boolean} | number;
  Moon?: number;
  nakshatras?: { Moon?: { name?: string; pada?: number } };
};
type Natal = {
  lord10?: "Saturn"|"Mercury"|"Mars"|"Venus"|"Jupiter"|"Sun"|"Moon"|"Rahu"|"Ketu";
  moonNakshatra?: string;
};

const NAK_FIT: Record<string,string[]> = {
  Rohini: ["build","visibility"], Pushya: ["stabilize","mentor"],
  Shravana: ["learn","structure"], Dhanistha: ["network","visibility"],
  Uttaraphalguni: ["agreements","close"],
};

function inRange(d:string, a:string, b:string) { return a <= d && d <= b; }

function dashaWeight(md?:string, ad?:string) {
  let w = 0;
  if (md?.toLowerCase()==="rahu") w += 0.30;
  if (ad?.toLowerCase()==="venus") w += 0.20;
  if (ad?.toLowerCase()==="mercury") w += 0.15;
  if (ad?.toLowerCase()==="saturn") w += 0.05; // favors build, not quick closes
  return Math.min(0.4, w);
}

function transitWeight(day:Daily, natal:Natal) {
  let w = 0;
  if ((day.Jup ?? 0) > 0) w += 0.10;   // coarse: positive dignity/aspect
  if ((day.Ven ?? 0) > 0) w += 0.08;
  // Mercury retro: penalize closes, favor build
  if (typeof day.Mer === "object" && day.Mer?.retro) w -= 0.05;
  return w;
}

function nakFit(day:Daily) {
  const n = day.nakshatras?.Moon?.name as string | undefined;
  if (!n) return 0;
  const themes = NAK_FIT[n] || [];
  // very simple: presence → small positive
  return themes.length ? 0.05 : 0;
}

export function buildSmartPlan({
  adSpans, transits, natal
}: {
  adSpans: ADSpan[];
  transits: Daily[];     // dense daily rows
  natal: Natal;
}) {
  // group daily to 3–8 week blocks by average score & dominant theme
  const micro:any[] = [];
  const chunk = 21; // 3 weeks; slide window to ~6 weeks effective
  for (let i=0; i<transits.length; i+=chunk) {
    const slice = transits.slice(i, i+chunk);
    if (!slice.length) continue;

    // find covering AD
    const mid = slice[Math.floor(slice.length/2)]?.dateISO || slice[0].dateISO;
    const ad = adSpans.find(s => inRange(mid, s.fromISO, s.toISO));
    const md = ad?.md || ad?.label?.split(" MD")[0];
    const adName = ad?.ad || ad?.label?.split("/")[1]?.replace("AD","")?.trim();

    const scores = slice.map(day => dashaWeight(md, adName) + transitWeight(day, natal) + nakFit(day));
    const avg = scores.reduce((a,b)=>a+b,0) / scores.length;

    let action:"close"|"push"|"build"|"foundation" = "foundation";
    if (avg >= 0.70) action = "close";
    else if (avg >= 0.55) action = "push";
    else if (avg >= 0.40) action = "build";

    const why:string[] = [];
    if ((md||"").toLowerCase()==="rahu") why.push("Rahu MD favors visibility & pivots");
    if ((adName||"").toLowerCase()==="venus") why.push("Venus AD supports pay/brand");
    if (slice.some(d => (d.Mer as any)?.retro)) why.push("Mercury retro: document & iterate");
    const nMoon = slice.find(d=>d.nakshatras?.Moon?.name)?.nakshatras?.Moon?.name;
    if (nMoon) why.push(`Moon in ${nMoon} aids ${NAK_FIT[nMoon]?.join(", ") || "focus & stability"}`);

    const doList = action==="close"
      ? ["Schedule interviews/negotiations", "Convert shortlists to offers"]
      : action==="push"
      ? ["Outbound/referrals weekly targets", "Present in community/meetups"]
      : action==="build"
      ? ["Course sprint (2–4w)", "Portfolio/LinkedIn rewrite", "Mock interviews"]
      : ["Foundations: health, rest, documentation, network maintenance"];

    micro.push({
      fromISO: slice[0].dateISO,
      toISO: slice[slice.length-1].dateISO,
      label: `${md || ad?.label || "AD"} focus`,
      action,
      why, do: doList,
      score: +avg.toFixed(2),
    });
  }

  // roll-up by quarter (3 actions) using dominant micro actions
  const byQuarter = new Map<string, typeof micro>();
  micro.forEach(m => {
    const q = new Date(m.fromISO);
    const qNo = Math.floor(q.getMonth()/3)+1;
    const key = `Q${qNo} ${q.getFullYear()}`;
    byQuarter.set(key, [...(byQuarter.get(key)||[]), m]);
  });

  const quarters = [...byQuarter.entries()].map(([label, arr])=>{
    const top = arr.sort((a,b)=>b.score-a.score)[0];
    const counts = arr.reduce((acc:any,m:any)=> (acc[m.action]=(acc[m.action]||0)+1, acc), {});
    const focus = Object.entries(counts).sort((a:any,b:any)=>b[1]-a[1]).slice(0,2).map(([k])=>{
      return k==="close" ? "Close/convert"
           : k==="push" ? "Visibility & outreach"
           : k==="build"? "Upskill & assets"
           : "Foundations";
    });
    const upskill = arr.some(a=>a.action==="build")
      ? { topic: "Interviewing + Role-specific skill", cadence: "2-4h/week, 4–6 weeks" }
      : undefined;
    const checkpoints = [
      "Shortlist 10 target roles/teams","2 mock interviews","1 public share/presentation"
    ];
    return { label, focus, checkpoints, upskill };
  }).sort((a,b)=> a.label.localeCompare(b.label));

  // fast tips
  const negotiationTips = ["Anchor on scope + impact", "Pick weeks with strong Venus or Jupiter support"];
  const visibilityTips  = ["Ship public artifacts monthly", "Present internally during high-score micro windows"];

  return { micro, quarters, negotiationTips, visibilityTips };
}
